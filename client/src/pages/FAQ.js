import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';


const FAQS = [
  {
    category: 'Getting started',
    items: [
      {
        q: 'How do I get started with Paper5?',
        a: 'Simple — fill out our contact form on the homepage or click "Start a project" in the navigation. We\'ll get back to you within 24 hours to schedule a free 30-minute discovery call where we learn about your business, goals, and challenges. After the call, we send you a custom proposal within 2 business days.',
      },
      {
        q: 'Do you work with businesses outside Ludhiana?',
        a: 'Absolutely. While we\'re based in Ludhiana, Punjab, we work with clients across India — from Delhi NCR and Mumbai to Bengaluru and Hyderabad. All our work is done remotely with regular video calls, shared dashboards, and WhatsApp communication. Distance has never been a barrier to great results.',
      },
      {
        q: 'What industries do you work with?',
        a: 'We\'ve worked with fashion & retail, B2B SaaS, eCommerce, legal services, education (EdTech), healthcare, hospitality, real estate, and local service businesses. We adapt our strategy to your industry — we don\'t use a one-size-fits-all playbook.',
      },
      {
        q: 'How long does it take to see results?',
        a: 'It depends on the service. Paid ads can show results within 7–14 days. Social media growth is typically visible within 4–6 weeks. SEO is a longer game — expect meaningful organic traffic growth in 3–6 months. We set honest timelines upfront and never overpromise.',
      },
    ],
  },
  {
    category: 'Pricing & contracts',
    items: [
      {
        q: 'Are there any lock-in contracts?',
        a: 'No. All our retainer packages are month-to-month by default — you can cancel with 30 days notice. We also offer a 15% discount if you commit to an annual plan, which some clients prefer for budget predictability. We believe in earning your business every month, not locking you in.',
      },
      {
        q: 'What is your minimum budget?',
        a: 'Our Starter packages begin at ₹8,000–₹12,000/month depending on the service. For paid advertising, you\'ll also need a separate ad spend budget (we recommend at least ₹20,000/month to see meaningful results). There\'s no minimum for one-time projects like website audits or strategy sessions.',
      },
      {
        q: 'Do you charge a setup or onboarding fee?',
        a: 'No setup fees. The first month\'s retainer covers the onboarding, account setup, strategy creation, and initial implementation. We believe the cost of starting should be predictable.',
      },
      {
        q: 'Can I upgrade or downgrade my plan?',
        a: 'Yes, anytime. If your business is growing fast and you want to scale up, we can upgrade your plan from the next billing cycle. If you need to scale back temporarily, just let us know 30 days before the renewal date.',
      },
      {
        q: 'How do I pay? Do you accept UPI/bank transfer?',
        a: 'We accept all major Indian payment methods — UPI, NEFT/IMPS bank transfer, and credit/debit cards. We raise a GST invoice on the 1st of every month for retainer clients. For one-time projects, we take 50% upfront and 50% on delivery.',
      },
    ],
  },
  {
    category: 'Our process',
    items: [
      {
        q: 'Who will I be working with?',
        a: 'Every client is assigned a dedicated account manager who is your single point of contact. Behind them is a team of specialists — an SEO strategist, a content writer, a paid ads manager, and a designer — depending on your package. You\'re never passed around between different people.',
      },
      {
        q: 'How often will we have calls/check-ins?',
        a: 'Starter plan clients get a monthly review call. Growth plan clients get bi-weekly calls. Enterprise clients get weekly calls. Beyond scheduled calls, you can always reach your account manager on WhatsApp for quick questions and updates.',
      },
      {
        q: 'What do you need from me to get started?',
        a: 'We\'ll send you an onboarding checklist after signing, but typically we need: access to your existing social/ad/analytics accounts, your brand assets (logo, brand colours), a brief on your target customer, and any past campaign data you have. The whole onboarding process takes about 3–5 business days.',
      },
      {
        q: 'Do I own the content and assets you create?',
        a: '100%. Everything we create for you — graphics, copy, blog posts, ad creatives, email sequences — is yours. We don\'t retain any rights. If you ever leave Paper5, you take everything with you.',
      },
    ],
  },
  {
    category: 'Results & reporting',
    items: [
      {
        q: 'How do you measure and report results?',
        a: 'Every client gets a custom Looker Studio dashboard with real-time data from all their marketing channels. We also send a detailed monthly performance report that covers what happened, what worked, what didn\'t, and what we\'re doing next. No jargon — just plain English insights.',
      },
      {
        q: 'What if I\'m not seeing results after 3 months?',
        a: 'We take full accountability. If you\'re not seeing agreed-upon improvements after 3 months of consistent work, we\'ll either work for free until targets are met, or refund your most recent month\'s fee — your choice. We\'ve never had to invoke this policy, but it exists because we stand behind our work.',
      },
      {
        q: 'Do you guarantee rankings or specific results?',
        a: 'We don\'t guarantee specific Google rankings — anyone who does is misleading you. What we do guarantee is transparent work, clear communication, and a data-driven approach that has consistently delivered strong results for our clients. We share realistic benchmarks based on your industry and budget before you sign.',
      },
    ],
  },
  {
    category: 'Technical questions',
    items: [
      {
        q: 'Do I need a website to work with Paper5?',
        a: 'For most services, yes — a website is the foundation. If you don\'t have one, we can recommend trusted web development partners who work well with our team. For social media only packages, a website isn\'t strictly required but is always recommended.',
      },
      {
        q: 'What tools and platforms do you use?',
        a: 'We use industry-standard tools: Google Analytics 4, Google Search Console, Semrush, Ahrefs, Meta Business Suite, Google Ads Manager, Mailchimp/Klaviyo for email, Hootsuite for social scheduling, and Looker Studio for reporting. All tool costs are included in your package — no surprise charges.',
      },
      {
        q: 'Can you manage my existing ad accounts or do you need new ones?',
        a: 'We can work with your existing accounts — in fact, we prefer it because historical data is valuable. We\'ll request manager-level access (not ownership) so you always retain full control. If you don\'t have accounts yet, we\'ll set them up and transfer ownership to you.',
      },
    ],
  },
];

function AccordionItem({ q, a, isOpen, onToggle, color }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button onClick={onToggle}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1.2rem 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', textAlign: 'left', fontFamily: 'var(--font-body)' }}>
        <span style={{ fontSize: '.95rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4, flex: 1 }}>{q}</span>
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: isOpen ? color : 'var(--cream3)', color: isOpen ? 'white' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 700, transition: 'all .2s', marginTop: 2 }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div style={{ paddingBottom: '1.2rem' }}>
          <p style={{ fontSize: '.9rem', color: 'var(--muted)', lineHeight: 1.8 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState('0-0');
  const [search, setSearch] = useState('');

  const catColors = ['#c026d3', '#7c3aed', '#1d4ed8', '#0891b2', '#059669'];

  const allItems = FAQS.flatMap((cat, ci) => cat.items.map((item, ii) => ({ ...item, catIdx: ci, itemIdx: ii, id: `${ci}-${ii}` })));
  const searchResults = search.trim()
    ? allItems.filter(i => i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ padding: '7rem 2rem 5rem', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontFamily: 'var(--font-mono)', fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>
          <span style={{ width: 24, height: 2, background: 'linear-gradient(to right,#7c3aed,#1d4ed8)', borderRadius: 2, display: 'inline-block' }} />
          Frequently asked
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem,5vw,4rem)', fontWeight: 400, lineHeight: 1.08, letterSpacing: '-.03em', marginBottom: '1.2rem' }}>
          Questions &{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, background: 'linear-gradient(135deg,#7c3aed,#1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            answers
          </em>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
          Everything you need to know about working with Paper5. Can't find what you're looking for?{' '}
          <Link to="/#contact" style={{ color: '#7c3aed', fontWeight: 600 }}>Just ask us.</Link>
        </p>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '3rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions…"
            style={{ width: '100%', padding: '.9rem 1rem .9rem 3rem', background: 'white', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: '.95rem', outline: 'none', fontFamily: 'var(--font-body)', color: 'var(--ink)', transition: 'border-color .2s' }}
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>

        {/* Search results */}
        {searchResults ? (
          <div>
            <p style={{ fontSize: '.82rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{search}"</p>
            {searchResults.length === 0
              ? <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: '.5rem' }}>No results found.</p>
                  <p>Try different keywords or <Link to="/#contact" style={{ color: '#7c3aed' }}>contact us directly.</Link></p>
                </div>
              : searchResults.map(item => (
                <AccordionItem key={item.id} q={item.q} a={item.a} isOpen={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} color={catColors[item.catIdx]} />
              ))
            }
          </div>
        ) : (
          /* Category accordions */
          FAQS.map((cat, ci) => (
            <div key={ci} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: catColors[ci], flexShrink: 0 }} />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-.02em' }}>{cat.category}</h2>
              </div>
              <div style={{ background: 'white', borderRadius: 16, padding: '0 1.5rem', border: '1px solid var(--border)' }}>
                {cat.items.map((item, ii) => (
                  <AccordionItem key={ii} q={item.q} a={item.a}
                    isOpen={openId === `${ci}-${ii}`}
                    onToggle={() => setOpenId(openId === `${ci}-${ii}` ? null : `${ci}-${ii}`)}
                    color={catColors[ci]} />
                ))}
              </div>
            </div>
          ))
        )}

        {/* Still have questions */}
        <div style={{ background: 'white', borderRadius: 20, padding: '2.5rem', border: '1px solid var(--border)', textAlign: 'center', marginTop: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, letterSpacing: '-.03em', marginBottom: '.6rem' }}>Still have questions?</h3>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '1.5rem' }}>Our team typically responds within 2 hours on business days.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/#contact"
              style={{ padding: '.75rem 1.8rem', background: 'var(--ink)', color: 'white', borderRadius: '100px', fontWeight: 600, fontSize: '.9rem', textDecoration: 'none', transition: 'all .25s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}>
              Send us a message
            </Link>
            <a href="https://wa.me/919999999999?text=Hi! I have a question about Paper5's services."
              target="_blank" rel="noreferrer"
              style={{ padding: '.75rem 1.8rem', background: '#25D366', color: 'white', borderRadius: '100px', fontWeight: 600, fontSize: '.9rem', textDecoration: 'none' }}>
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <footer style={{ background: 'var(--ink)', padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.4)', fontFamily: 'var(--font-mono)' }}>© 2026 Paper5 · paper5.co</p>
      </footer>
 
    </div>
  );
}
