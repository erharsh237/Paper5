const router = require('express').Router();
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const Conversation = require('../models/Conversation');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');
const { buildSystemPrompt } = require('../utils/siteKnowledge');
const { chatCompletion } = require('../utils/ollama');

const MAX_HISTORY = 20; // cap messages sent to the model per turn, keeps latency/cost sane

const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30, // 30 messages per 5 min per IP — generous for real chatting, blocks scripted abuse
  message: { message: 'Too many messages — please wait a few minutes.' },
});

// Heuristic extractor — looks for email/phone patterns and a name. Runs server-side on the
// user's own message only; not used to scrape arbitrary text, only to detect contact info
// a visitor is actively offering (often all in one message, e.g. "Rahul, rahul@x.com, 98765...").
function extractContact(text) {
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const phoneMatch = text.match(/(?:\+?\d[\d\s-]{8,14}\d)/);

  let name = null;

  // Explicit phrasing: "my name is X" / "I'm X" / "I am X" / "this is X"
  const phraseMatch = text.match(/(?:my name is|i'm|i am|this is)\s+([a-zA-Z\s]{2,40})/i);
  if (phraseMatch) {
    name = phraseMatch[1].trim().split(/[,.\n]/)[0];
  }

  // Fallback: a bare name offered alongside email/phone in the same message,
  // e.g. "Rahul Sharma, rahul@gmail.com, 9876543210" or split by newlines.
  if (!name && (emailMatch || phoneMatch)) {
    const segments = text.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    for (const seg of segments) {
      // Skip the segment if it IS the email or phone we already found
      if (emailMatch && seg.includes(emailMatch[0])) continue;
      if (phoneMatch && seg.replace(/[\s-]/g, '').includes(phoneMatch[0].replace(/[\s-]/g, ''))) continue;
      // A plausible bare name: letters/spaces only, 2-40 chars, 1-4 words, no digits/@
      if (/^[a-zA-Z\s]{2,40}$/.test(seg) && seg.split(/\s+/).length <= 4) {
        name = seg;
        break;
      }
    }
  }

  return {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0].replace(/[\s-]/g, '') : null,
    name,
  };
}

const SERVICE_KEYWORDS = {
  'SEO': ['seo', 'search engine', 'ranking', 'organic'],
  'Social Media Marketing': ['social media', 'instagram', 'reels', 'facebook page', 'social marketing'],
  'Website — WordPress': ['wordpress'],
  'Website — Full Stack (Frontend)': ['full stack frontend'],
  'Website — Full Stack (Frontend + Backend)': ['full stack', 'website develop', 'web develop', 'new website'],
  'Paid Advertising': ['ppc', 'google ads', 'meta ads', 'paid ad', 'facebook ads'],
};

function detectInterests(text) {
  const lower = text.toLowerCase();
  const found = [];
  for (const [service, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) found.push(service);
  }
  return found;
}

// POST /api/chat — send a message, get a reply. No auth required (public widget).
router.post('/', chatLimiter, async (req, res) => {
  try {
    const { sessionId, message, page } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'A message is required' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ message: 'Message is too long' });
    }

    const sid = sessionId && typeof sessionId === 'string' ? sessionId : crypto.randomUUID();

    let convo = await Conversation.findOne({ sessionId: sid });
    if (!convo) {
      convo = new Conversation({ sessionId: sid, messages: [], interestedIn: [], pagesReferenced: [] });
    }

    // Gate activates once the bot has given one free assistant reply already.
    const assistantRepliesSoFar = convo.messages.filter(m => m.role === 'assistant').length;
    const gateAlreadySatisfied = !!(convo.contactName && convo.contactEmail && convo.contactPhone);
    const gateActive = assistantRepliesSoFar >= 1 && !gateAlreadySatisfied;

    convo.messages.push({ role: 'user', content: message.trim() });
    if (page && !convo.pagesReferenced.includes(page)) convo.pagesReferenced.push(page);

    const newInterests = detectInterests(message);
    newInterests.forEach(s => { if (!convo.interestedIn.includes(s)) convo.interestedIn.push(s); });

    // Accumulate contact info across turns — visitor may give name, then email, then phone separately
    const contact = extractContact(message);
    if (contact.name && !convo.contactName) convo.contactName = contact.name;
    if (contact.email && !convo.contactEmail) convo.contactEmail = contact.email;
    if (contact.phone && !convo.contactPhone) convo.contactPhone = contact.phone;

    // Safety net: if email + phone are both in hand but name extraction never matched
    // (e.g. unusual phrasing), don't silently drop the lead forever — use a placeholder
    // once the visitor has clearly engaged with the gate (sent a message after it activated).
    const hasCoreContact = !!(convo.contactEmail && convo.contactPhone);
    if (gateActive && hasCoreContact && !convo.contactName && !convo.leadCaptured) {
      convo.contactName = 'Website chat visitor';
    }

    const gateNowSatisfied = !!(convo.contactName && convo.contactEmail && convo.contactPhone);

    const systemPrompt = buildSystemPrompt({ gateActive: gateActive && !gateNowSatisfied });
    const recentMessages = convo.messages.slice(-MAX_HISTORY);

    let reply;
    try {
      reply = await chatCompletion({ systemPrompt, messages: recentMessages });
    } catch (err) {
      console.error('[chat] Ollama call failed:', err.message);
      return res.status(503).json({
        message: "I'm having trouble connecting right now. Please try the contact form and we'll get back to you within 24 hours.",
      });
    }

    convo.messages.push({ role: 'assistant', content: reply });

    // Create the Lead once we have name + email + phone (name may be the fallback placeholder)
    if (gateNowSatisfied && !convo.leadCaptured) {
      const lead = await Lead.create({
        name: convo.contactName,
        email: convo.contactEmail,
        phone: convo.contactPhone,
        message: `Captured via chat widget. Topics discussed: ${convo.interestedIn.join(', ') || 'general inquiry'}.`,
        service: convo.interestedIn[0] || 'Other',
        source: 'chatbot',
      });
      convo.leadCaptured = true;
      convo.lead = lead._id;
    }

    await convo.save();

    res.json({ sessionId: sid, reply, leadCaptured: convo.leadCaptured });
  } catch (err) {
    console.error('[chat] error:', err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// GET /api/chat/insights — stats dashboard data for the admin portal (protected)
router.get('/insights', protect, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);

    const conversations = await Conversation.find({ createdAt: { $gte: since } }).populate('lead');

    const totalConversations = conversations.length;
    const totalLeadsFromChat = conversations.filter(c => c.leadCaptured).length;
    const conversionRate = totalConversations ? Math.round((totalLeadsFromChat / totalConversations) * 100) : 0;

    const interestCounts = {};
    conversations.forEach(c => c.interestedIn.forEach(s => {
      interestCounts[s] = (interestCounts[s] || 0) + 1;
    }));
    const topInterests = Object.entries(interestCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([service, count]) => ({ service, count }));

    const pageCounts = {};
    conversations.forEach(c => c.pagesReferenced.forEach(p => {
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    }));
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([page, count]) => ({ page, count }));

    const avgMessagesPerConvo = totalConversations
      ? Math.round(conversations.reduce((sum, c) => sum + c.messages.length, 0) / totalConversations)
      : 0;

    // Conversations with zero detected interest = visitors the bot couldn't help match to a service
    const noInterestDetected = conversations.filter(c => c.interestedIn.length === 0).length;

    res.json({
      since,
      totalConversations,
      totalLeadsFromChat,
      conversionRate,
      avgMessagesPerConvo,
      topInterests,
      topPages,
      noInterestDetected,
      recentConversations: conversations
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 20)
        .map(c => ({
          id: c._id,
          startedAt: c.createdAt,
          messageCount: c.messages.length,
          interestedIn: c.interestedIn,
          leadCaptured: c.leadCaptured,
          leadEmail: c.lead?.email || c.contactEmail || null,
          leadPhone: c.lead?.phone || c.contactPhone || null,
          pagesReferenced: c.pagesReferenced,
        })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/chat/:sessionId — fetch full transcript for one conversation (admin detail view)
router.get('/:sessionId', protect, async (req, res) => {
  try {
    const convo = await Conversation.findOne({ sessionId: req.params.sessionId }).populate('lead');
    if (!convo) return res.status(404).json({ message: 'Conversation not found' });
    res.json(convo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
