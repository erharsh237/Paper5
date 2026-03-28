import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';


const VALUES = [
  { icon: '🔥', title: 'Results over activity', desc: 'We celebrate outcomes, not hours. Nobody tracks your time — we track what you achieve.' },
  { icon: '📚', title: 'Always learning', desc: 'Digital marketing changes fast. We budget time and money for every team member to keep growing.' },
  { icon: '🤝', title: 'Radical transparency', desc: 'No politics, no hidden agendas. We share numbers, challenges, and wins openly with the whole team.' },
  { icon: '⚡', title: 'Bias for action', desc: 'We ship fast, learn from data, and improve. A good campaign launched today beats a perfect one next month.' },
];

const PERKS = [
  { icon: '🏠', label: 'Remote-first', desc: 'Work from anywhere in India' },
  { icon: '📅', label: 'Flexible hours', desc: 'Core hours 11am–5pm, rest is yours' },
  { icon: '💰', label: 'Performance bonus', desc: 'Quarterly bonuses tied to results' },
  { icon: '📖', label: 'Learning budget', desc: '₹15,000/year for courses & books' },
  { icon: '🏥', label: 'Health insurance', desc: 'Covered for you & your family' },
  { icon: '🎯', label: 'Career path', desc: 'Clear growth tracks, no dead ends' },
];

const JOBS = [
  {
    id: 'seo-strategist',
    title: 'SEO Strategist',
    type: 'Full-time',
    mode: 'Remote',
    dept: 'SEO',
    exp: '2–4 years',
    salary: '₹4L–₹7L/year',
    color: '#c026d3',
    summary: 'Own SEO strategy for 5–8 client accounts. You\'ll run technical audits, build content strategies, execute link building, and report on growth.',
    responsibilities: [
      'Conduct full technical SEO audits and implement fixes',
      'Build and execute keyword strategies across client verticals',
      'Manage off-page SEO and link building outreach',
      'Write and publish monthly client SEO reports',
      'Stay ahead of Google algorithm updates',
    ],
    requirements: [
      '2+ years hands-on SEO experience (agency preferred)',
      'Proficient with Semrush, Ahrefs, Google Search Console',
      'Strong understanding of Core Web Vitals & technical SEO',
      'Excellent written English for client communication',
      'Experience with local SEO is a plus',
    ],
  },
  {
    id: 'paid-ads-manager',
    title: 'Paid Ads Manager',
    type: 'Full-time',
    mode: 'Remote',
    dept: 'Performance',
    exp: '2–5 years',
    salary: '₹5L–₹9L/year',
    color: '#7c3aed',
    summary: 'Manage Google Ads and Meta Ads campaigns for 6–10 clients with combined monthly ad spend of ₹15L+. ROI is your north star.',
    responsibilities: [
      'Create, manage, and optimise Google Search, Shopping & Display campaigns',
      'Build and scale Meta (Facebook & Instagram) ad funnels',
      'Run structured A/B tests on ads, audiences, and landing pages',
      'Deliver weekly performance reports with actionable insights',
      'Manage monthly ad budgets from ₹30k to ₹5L per client',
    ],
    requirements: [
      '2+ years managing Google Ads with ₹5L+ monthly spend',
      'Google Ads certified (preferred)',
      'Experience with Meta Ads Manager and pixel setup',
      'Strong analytical skills — comfortable with ROAS, CPA, LTV',
      'eCommerce or SaaS advertising experience preferred',
    ],
  },
  {
    id: 'content-writer',
    title: 'Content Writer & Strategist',
    type: 'Full-time',
    mode: 'Remote',
    dept: 'Content',
    exp: '1–3 years',
    salary: '₹3L–₹5.5L/year',
    color: '#1d4ed8',
    summary: 'Write SEO-optimised blog posts, website copy, email newsletters, and social content for diverse clients across industries.',
    responsibilities: [
      'Write 15–20 SEO-optimised blog posts per month',
      'Develop content strategies and editorial calendars for clients',
      'Write website copy, landing pages, and ad copy',
      'Create email newsletter content and sequences',
      'Research and stay current on client industry topics',
    ],
    requirements: [
      '1+ years writing for digital (agency or in-house)',
      'Excellent English writing with a clean, engaging voice',
      'Understanding of on-page SEO and keyword integration',
      'Ability to write across B2B and B2C verticals',
      'Fast turnaround — able to produce quality content under deadlines',
    ],
  },
  {
    id: 'social-media-exec',
    title: 'Social Media Executive',
    type: 'Full-time',
    mode: 'Remote',
    dept: 'Social',
    exp: '1–2 years',
    salary: '₹2.5L–₹4L/year',
    color: '#0891b2',
    summary: 'Manage social media presence for 4–6 clients. Create content, grow communities, and build genuine engagement on Instagram, LinkedIn, and more.',
    responsibilities: [
      'Create and schedule posts across Instagram, LinkedIn, Facebook & X',
      'Shoot/edit short-form videos and Reels (basic video skills needed)',
      'Manage comments, DMs, and community engagement daily',
      'Coordinate with influencers and content creators',
      'Track and report on follower growth and engagement metrics',
    ],
    requirements: [
      '1+ year managing brand social media accounts',
      'Strong visual eye — experience with Canva or basic design tools',
      'Deep understanding of Instagram and LinkedIn algorithms',
      'Basic video editing on mobile (CapCut, InShot, etc.)',
      'Passion for trends, pop culture, and social storytelling',
    ],
  },
];

function JobCard({ job, onApply }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', transition: 'all .3s' }}>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.6rem', flexWrap: 'wrap' }}>
              {[job.type, job.mode, job.dept].map(tag => (
                <span key={tag} style={{ fontSize: '.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', background: 'var(--cream3)', color: 'var(--muted)', padding: '.25rem .65rem', borderRadius: '100px', border: '1px solid var(--border)' }}>{tag}</span>
              ))}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, letterSpacing: '-.02em', marginBottom: '.3rem' }}>{job.title}</h3>
            <p style={{ fontSize: '.82rem', color: 'var(--muted)' }}>{job.exp} experience · {job.salary}</p>
          </div>
          <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
            <button onClick={() => setOpen(!open)}
              style={{ padding: '.55rem 1.1rem', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: '100px', fontSize: '.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--muted)', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.color = 'var(--ink)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}>
              {open ? 'Hide details' : 'View details'}
            </button>
            <button onClick={() => onApply(job)}
              style={{ padding: '.55rem 1.3rem', background: job.color, color: 'white', border: 'none', borderRadius: '100px', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'opacity .2s' }}
              onMouseEnter={e => e.target.style.opacity = '.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}>
              Apply now →
            </button>
          </div>
        </div>
        <p style={{ fontSize: '.88rem', color: 'var(--muted)', lineHeight: 1.7, marginTop: '.75rem' }}>{job.summary}</p>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', background: 'var(--cream)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <p style={{ fontSize: '.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Responsibilities</p>
            {job.responsibilities.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '.6rem', marginBottom: '.5rem' }}>
                <span style={{ color: job.color, flexShrink: 0, marginTop: 2, fontSize: 13 }}>✓</span>
                <span style={{ fontSize: '.87rem', color: 'var(--ink)', lineHeight: 1.6 }}>{r}</span>
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontSize: '.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Requirements</p>
            {job.requirements.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '.6rem', marginBottom: '.5rem' }}>
                <span style={{ color: 'var(--muted)', flexShrink: 0, marginTop: 2, fontSize: 13 }}>→</span>
                <span style={{ fontSize: '.87rem', color: 'var(--muted)', lineHeight: 1.6 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', portfolio: '', whyUs: '' });
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post('/api/contact', {
        name: form.name,
        email: form.email,
        company: form.phone,
        service: `Job Application — ${job.title}`,
        message: `Portfolio/LinkedIn: ${form.portfolio}\n\nWhy Paper5: ${form.whyUs}`,
      });
      setStep(3);
    } catch {
      toast.error('Something went wrong. Please email us at careers@paper5.co');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,18,8,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--cream)', borderRadius: 24, padding: '2.5rem', width: '100%', maxWidth: 500, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--muted)' }}>✕</button>

        {step === 1 && (
          <>
            <span style={{ display: 'inline-block', background: '#ede9fe', color: '#5b21b6', fontSize: '.72rem', fontFamily: 'var(--font-mono)', padding: '.3rem .8rem', borderRadius: '100px', marginBottom: '1rem' }}>{job.dept}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 400, letterSpacing: '-.03em', marginBottom: '.3rem' }}>Apply for</h2>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: job.color, marginBottom: '1.5rem' }}>{job.title}</h3>
            {[['Full name', 'name', 'text', 'Your full name'], ['Email address', 'email', 'email', 'your@email.com'], ['Phone number', 'phone', 'tel', '+91 98765 43210']].map(([label, field, type, ph]) => (
              <div key={field} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.4rem' }}>{label}</label>
                <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder={ph}
                  style={{ width: '100%', padding: '.8rem 1rem', background: 'white', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '.9rem', outline: 'none', fontFamily: 'var(--font-body)', color: 'var(--ink)' }}
                  onFocus={e => e.target.style.borderColor = job.color}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            ))}
            <button onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.phone}
              style={{ width: '100%', padding: '.9rem', background: (!form.name || !form.email || !form.phone) ? 'var(--cream3)' : job.color, color: (!form.name || !form.email || !form.phone) ? 'var(--muted)' : 'white', border: 'none', borderRadius: '100px', fontSize: '.95rem', fontWeight: 600, cursor: (!form.name || !form.email || !form.phone) ? 'not-allowed' : 'pointer', marginTop: '.5rem' }}>
              Continue →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 400, letterSpacing: '-.03em', marginBottom: '1.5rem' }}>Almost there</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.4rem' }}>Portfolio / LinkedIn / Resume URL</label>
              <input value={form.portfolio} onChange={e => setForm({ ...form, portfolio: e.target.value })} placeholder="https://linkedin.com/in/yourprofile"
                style={{ width: '100%', padding: '.8rem 1rem', background: 'white', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '.9rem', outline: 'none', fontFamily: 'var(--font-body)', color: 'var(--ink)' }}
                onFocus={e => e.target.style.borderColor = job.color}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.4rem' }}>Why do you want to work at Paper5? (2–4 sentences)</label>
              <textarea value={form.whyUs} onChange={e => setForm({ ...form, whyUs: e.target.value })} placeholder="What excites you about this role and our company…"
                style={{ width: '100%', padding: '.8rem 1rem', background: 'white', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '.9rem', outline: 'none', fontFamily: 'var(--font-body)', color: 'var(--ink)', minHeight: 110, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = job.color}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button onClick={() => setStep(1)} style={{ padding: '.9rem 1.5rem', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: '100px', fontSize: '.9rem', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>Back</button>
              <button onClick={handleSubmit} disabled={!form.whyUs || submitting}
                style={{ flex: 1, padding: '.9rem', background: (!form.whyUs || submitting) ? 'var(--cream3)' : job.color, color: (!form.whyUs || submitting) ? 'var(--muted)' : 'white', border: 'none', borderRadius: '100px', fontSize: '.95rem', fontWeight: 600, cursor: (!form.whyUs || submitting) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)' }}>
                {submitting ? 'Submitting…' : 'Submit application →'}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: 64, height: 64, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', fontSize: 28 }}>✓</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 400, letterSpacing: '-.03em', marginBottom: '.6rem' }}>Application received!</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              Thanks {form.name.split(' ')[0]}! We'll review your application and get back to you within 5 business days. Check your email at <strong>{form.email}</strong> for confirmation.
            </p>
            <button onClick={onClose} style={{ padding: '.75rem 2rem', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: '100px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '.9rem' }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Careers() {
  const [applyJob, setApplyJob] = useState(null);

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '7rem 2rem 4rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontFamily: 'var(--font-mono)', fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>
          <span style={{ width: 24, height: 2, background: 'linear-gradient(to right,#7c3aed,#1d4ed8)', borderRadius: 2, display: 'inline-block' }} />
          Join the team
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.08, letterSpacing: '-.03em', marginBottom: '1.2rem', maxWidth: 700 }}>
          Build the future of{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, background: 'linear-gradient(135deg,#c026d3,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            marketing.
          </em>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 560, marginBottom: '2rem' }}>
          We're a small, ambitious team building a new kind of digital marketing agency — one that's transparent, obsessed with results, and genuinely fun to work at. Join us if that sounds like your kind of place.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#openings" style={{ padding: '.8rem 1.8rem', background: 'var(--ink)', color: 'white', borderRadius: '100px', fontWeight: 600, fontSize: '.9rem', textDecoration: 'none', transition: 'all .25s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}>
            See open roles ↓
          </a>
          <a href="mailto:careers@paper5.co" style={{ padding: '.8rem 1.8rem', background: 'transparent', color: 'var(--ink)', borderRadius: '100px', fontWeight: 500, fontSize: '.9rem', textDecoration: 'none', border: '1.5px solid var(--border)', transition: 'all .25s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
            careers@paper5.co
          </a>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '4rem 2rem', background: 'var(--cream2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, letterSpacing: '-.03em', marginBottom: '2rem' }}>How we work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.2rem' }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: '.75rem' }}>{v.icon}</span>
                <h3 style={{ fontSize: '.95rem', fontWeight: 600, marginBottom: '.5rem' }}>{v.title}</h3>
                <p style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section style={{ padding: '4rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, letterSpacing: '-.03em', marginBottom: '2rem' }}>Perks & benefits</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {PERKS.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'white', borderRadius: 14, padding: '1.2rem', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{p.icon}</span>
              <div>
                <div style={{ fontSize: '.9rem', fontWeight: 600, marginBottom: '.2rem' }}>{p.label}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section id="openings" style={{ padding: '2rem 2rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, letterSpacing: '-.03em' }}>
            Open roles <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 400, background: '#ede9fe', color: '#5b21b6', padding: '.2rem .6rem', borderRadius: '100px', marginLeft: '.5rem' }}>{JOBS.length}</span>
          </h2>
          <p style={{ fontSize: '.85rem', color: 'var(--muted)' }}>All roles are remote · India only</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {JOBS.map(job => <JobCard key={job.id} job={job} onApply={setApplyJob} />)}
        </div>

        {/* No role fits */}
        <div style={{ marginTop: '2.5rem', background: 'white', borderRadius: 16, padding: '2rem', border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '.5rem' }}>Don't see a role that fits?</p>
          <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginBottom: '1.2rem' }}>We hire talented people even when we don't have an open role. Send us your profile and we'll keep you in mind.</p>
          <a href="mailto:careers@paper5.co?subject=General application — Paper5&body=Hi Paper5 team,%0A%0AI'd love to be considered for future roles. Here's a bit about me:%0A%0A[Tell us who you are and what you do]%0A%0APortfolio/LinkedIn: [link]"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.75rem 1.8rem', background: 'var(--ink)', color: 'white', borderRadius: '100px', fontWeight: 600, fontSize: '.9rem', textDecoration: 'none' }}>
            Send a general application →
          </a>
        </div>
      </section>

      <footer style={{ background: 'var(--ink)', padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.4)', fontFamily: 'var(--font-mono)' }}>© 2026 Paper5 · paper5.co</p>
      </footer>

      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
 
    </div>
  );
}
