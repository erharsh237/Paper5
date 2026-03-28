import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';


const FILTERS = ['All', 'SEO', 'Paid Ads', 'Social Media', 'Content', 'Email'];

const CASES = [
  {
    id: 1,
    client: 'Bloom Boutique',
    industry: 'Fashion & Retail',
    location: 'Ludhiana, Punjab',
    service: 'Social Media',
    tags: ['Social Media', 'Content'],
    avatar: 'BB',
    grad: 'linear-gradient(135deg,#c026d3,#a78bfa)',
    challenge: 'A local boutique with zero social presence, relying entirely on walk-in customers. Owner wanted to reach younger audiences online but had no strategy.',
    approach: 'Built a full Instagram identity from scratch — brand tone, content pillars, posting cadence, Reels strategy, and hashtag research. Ran micro-influencer campaigns with 3 local fashion creators.',
    results: [
      { metric: '0 → 14,200', label: 'Instagram followers in 5 months' },
      { metric: '3.2×', label: 'Increase in online enquiries' },
      { metric: '₹2.4L', label: 'Monthly revenue attributed to social' },
      { metric: '8.4%', label: 'Engagement rate (industry avg: 1.2%)' },
    ],
    quote: 'Paper5 didn\'t just grow our following — they built us a community that actually buys.',
    quoteName: 'Priya Sharma, Founder',
    color: '#c026d3',
  },
  {
    id: 2,
    client: 'TechNova Solutions',
    industry: 'B2B SaaS',
    location: 'Chandigarh',
    service: 'SEO',
    tags: ['SEO', 'Content'],
    avatar: 'TN',
    grad: 'linear-gradient(135deg,#1d4ed8,#38bdf8)',
    challenge: 'A software company invisible on Google, losing leads to competitors who ranked for their own product category keywords. No blog, no backlinks.',
    approach: 'Complete technical SEO overhaul — fixed 140+ crawl errors, rewrote meta data, built a content cluster strategy around 8 core topics, and executed targeted outreach to earn quality backlinks from tech publications.',
    results: [
      { metric: 'Page 6 → Page 1', label: 'For 12 primary keywords' },
      { metric: '420%', label: 'Organic traffic growth in 8 months' },
      { metric: '₹18L', label: 'Pipeline attributed to organic leads' },
      { metric: '67', label: 'Domain authority (was 12)' },
    ],
    quote: 'We went from invisible to ranking above competitors we thought were untouchable.',
    quoteName: 'Rajat Mehta, CEO',
    color: '#1d4ed8',
  },
  {
    id: 3,
    client: 'FreshMart Grocery',
    industry: 'eCommerce / FMCG',
    location: 'Amritsar',
    service: 'Paid Ads',
    tags: ['Paid Ads'],
    avatar: 'FM',
    grad: 'linear-gradient(135deg,#059669,#34d399)',
    challenge: 'Online grocery store spending ₹80,000/month on Google Ads with a 1.8x ROAS — barely breaking even. Poor campaign structure, no audience segmentation, zero remarketing.',
    approach: 'Rebuilt the entire Google Ads account from scratch. Implemented SKAG structure, layered audience segments, Shopping campaigns for top 50 SKUs, and a 3-tier remarketing funnel. Reduced wasted spend by 38%.',
    results: [
      { metric: '1.8× → 5.2×', label: 'ROAS improvement in 3 months' },
      { metric: '₹38,000', label: 'Monthly ad spend reduction' },
      { metric: '62%', label: 'Lower cost per acquisition' },
      { metric: '3.1×', label: 'Increase in returning customer orders' },
    ],
    quote: 'The ROI improvement paid for Paper5\'s fees 4x over in the first month alone.',
    quoteName: 'Ananya Kapoor, Marketing Head',
    color: '#059669',
  },
  {
    id: 4,
    client: 'LegalEase India',
    industry: 'Legal Services',
    location: 'Delhi NCR',
    service: 'Content',
    tags: ['Content', 'SEO'],
    avatar: 'LE',
    grad: 'linear-gradient(135deg,#7c3aed,#818cf8)',
    challenge: 'A legal consultancy struggling to explain complex services to non-lawyers. Website had no content, zero organic traffic, and all leads came from expensive referrals.',
    approach: 'Developed a full content strategy targeting "plain English" legal questions people actually Google. Published 2 SEO-optimised articles per week, built a free legal guides section, and created a monthly newsletter with 1,400 subscribers.',
    results: [
      { metric: '0 → 28,000', label: 'Monthly organic visitors in 10 months' },
      { metric: '1,400+', label: 'Newsletter subscribers' },
      { metric: '45%', label: 'Of new clients cite content as first touchpoint' },
      { metric: '₹12L', label: 'Annual value of organic lead channel' },
    ],
    quote: 'Our content now works 24/7 as a sales team member we never have to pay.',
    quoteName: 'Vikram Arora, Managing Partner',
    color: '#7c3aed',
  },
  {
    id: 5,
    client: 'WarmHome Decor',
    industry: 'Home Furnishings',
    location: 'Ludhiana',
    service: 'Email',
    tags: ['Email', 'Content'],
    avatar: 'WH',
    grad: 'linear-gradient(135deg,#f59e0b,#f97316)',
    challenge: 'Furniture store with 6,000 past customers receiving zero follow-up communication. Huge untapped repeat purchase potential going to waste.',
    approach: 'Built a complete email automation system — welcome flow, post-purchase sequence, seasonal campaigns, re-engagement for lapsed customers (12+ months inactive), and a VIP segment for high spenders.',
    results: [
      { metric: '₹0 → ₹3.8L', label: 'Monthly email-attributed revenue' },
      { metric: '44%', label: 'Average email open rate' },
      { metric: '2.8×', label: 'Repeat purchase rate increase' },
      { metric: '1,200', label: 'Lapsed customers reactivated' },
    ],
    quote: 'I had no idea how much money was sitting in my email list. Paper5 unlocked it.',
    quoteName: 'Manpreet Singh, Owner',
    color: '#f59e0b',
  },
  {
    id: 6,
    client: 'SkillUp Academy',
    industry: 'EdTech',
    location: 'Chandigarh',
    service: 'Paid Ads',
    tags: ['Paid Ads', 'Social Media'],
    avatar: 'SA',
    grad: 'linear-gradient(135deg,#0891b2,#34d399)',
    challenge: 'Online course platform spending heavily on Meta Ads with a 22% enrollment conversion rate. High traffic, low conversions — leaky funnel with no follow-up.',
    approach: 'Rebuilt Meta Ads targeting with Lookalike audiences, created a 5-part video ad sequence, A/B tested 14 landing page variants, and implemented WhatsApp re-engagement for cart-abandoners.',
    results: [
      { metric: '22% → 61%', label: 'Enrollment conversion rate' },
      { metric: '2.4×', label: 'More enrollments at same budget' },
      { metric: '₹340', label: 'Cost per enrollment (was ₹890)' },
      { metric: '4,800', label: 'New students in 6 months' },
    ],
    quote: 'Paper5 solved in 6 weeks what our in-house team had been failing at for a year.',
    quoteName: 'Deepika Nair, Co-founder',
    color: '#0891b2',
  },
];

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === 'All' ? CASES : CASES.filter(c => c.tags.includes(filter));

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '7rem 2rem 4rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontFamily: 'var(--font-mono)', fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>
          <span style={{ width: 24, height: 2, background: 'linear-gradient(to right,#7c3aed,#1d4ed8)', borderRadius: 2, display: 'inline-block' }} />
          Our work
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.08, letterSpacing: '-.03em', marginBottom: '1rem', maxWidth: 700 }}>
          Real campaigns.{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, background: 'linear-gradient(135deg,#c026d3,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Real results.
          </em>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 560, marginBottom: '3rem' }}>
          Every number below is real, verified, and achieved for actual clients. No inflated claims, no cherry-picked metrics.
        </p>

        {/* Stats strip */}
        <div style={{ display: 'flex', gap: 0, background: 'white', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {[['6+', 'Case studies'], ['₹50L+', 'Revenue generated'], ['320%', 'Avg. ROI'], ['100%', 'Client retention']].map(([n, l], i, arr) => (
            <div key={i} style={{ flex: 1, minWidth: 120, textAlign: 'center', padding: '1.2rem 1.5rem', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg,#7c3aed,#1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1 }}>{n}</div>
              <div style={{ fontSize: '.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '.3rem' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '.45rem 1.1rem', borderRadius: '100px', fontSize: '.82rem', fontWeight: 500, border: '1.5px solid', cursor: 'pointer', transition: 'all .2s', fontFamily: 'var(--font-body)', background: filter === f ? 'var(--ink)' : 'white', color: filter === f ? 'white' : 'var(--muted)', borderColor: filter === f ? 'var(--ink)' : 'var(--border)' }}>
              {f}
            </button>
          ))}
        </div>

        {/* Case study cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.4rem' }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', transition: 'all .3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,18,8,.09)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>

              {/* Card header */}
              <div style={{ padding: '1.8rem 1.8rem 1.2rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: c.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.75rem', fontWeight: 700, color: 'white' }}>{c.avatar}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-.01em' }}>{c.client}</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{c.industry} · {c.location}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '.72rem', fontFamily: 'var(--font-mono)', background: 'var(--cream3)', color: 'var(--muted)', padding: '.3rem .7rem', borderRadius: '100px', border: '1px solid var(--border)' }}>{c.service}</span>
                </div>

                {/* Results grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' }}>
                  {c.results.map((r, i) => (
                    <div key={i} style={{ background: 'var(--cream)', borderRadius: 10, padding: '.75rem' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: c.color, lineHeight: 1.1 }}>{r.metric}</div>
                      <div style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: '.2rem', lineHeight: 1.4 }}>{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expandable detail */}
              <div style={{ padding: '1.2rem 1.8rem' }}>
                <button onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '.85rem', fontWeight: 600, color: c.color, padding: 0, display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                  {expanded === c.id ? '▲ Hide case study' : '▼ Read case study'}
                </button>

                {expanded === c.id && (
                  <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.4rem' }}>The challenge</p>
                      <p style={{ fontSize: '.88rem', color: 'var(--ink)', lineHeight: 1.75 }}>{c.challenge}</p>
                    </div>
                    <div style={{ marginBottom: '1.2rem' }}>
                      <p style={{ fontSize: '.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.4rem' }}>Our approach</p>
                      <p style={{ fontSize: '.88rem', color: 'var(--ink)', lineHeight: 1.75 }}>{c.approach}</p>
                    </div>
                    <div style={{ background: 'var(--cream2)', borderRadius: 12, padding: '1rem 1.2rem', borderLeft: `3px solid ${c.color}` }}>
                      <p style={{ fontSize: '.9rem', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '.5rem' }}>"{c.quote}"</p>
                      <p style={{ fontSize: '.78rem', color: 'var(--muted)', fontWeight: 600 }}>— {c.quoteName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'white', borderRadius: 24, border: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, letterSpacing: '-.03em', marginBottom: '.75rem' }}>
            Want results like{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 300, background: 'linear-gradient(135deg,#c026d3,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>these?</em>
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '.95rem' }}>Book a free 30-minute strategy call. No pitch, no pressure — just honest advice.</p>
          <Link to="/#contact"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.9rem 2rem', background: 'var(--ink)', color: 'white', borderRadius: '100px', fontWeight: 600, textDecoration: 'none', fontSize: '.95rem', transition: 'all .25s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}>
            Get your free strategy call →
          </Link>
        </div>
      </section>

      <footer style={{ background: 'var(--ink)', padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.4)', fontFamily: 'var(--font-mono)' }}>© 2026 Paper5 · paper5.co</p>
      </footer>
 
    </div>
  );
}
