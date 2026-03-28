import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Currency config
const CURRENCIES = {
  INR: { symbol: '₹', label: 'INR', rate: 1,      locale: 'en-IN', flag: '🇮🇳' },
  USD: { symbol: '$', label: 'USD', rate: 0.012,   locale: 'en-US', flag: '🇺🇸' },
  GBP: { symbol: '£', label: 'GBP', rate: 0.0095,  locale: 'en-GB', flag: '🇬🇧' },
};

const formatPrice = (inrAmount, currency) => {
  const c = CURRENCIES[currency];
  const converted = inrAmount * c.rate;
  if (currency === 'INR') return c.symbol + Math.round(converted).toLocaleString('en-IN');
  return c.symbol + (converted < 10 ? converted.toFixed(0) : Math.round(converted).toLocaleString(c.locale));
};

const SERVICES = {
  'seo': {
    num: '01', icon: '🔍',
    name: 'Search Engine Optimisation',
    tagline: 'Get found by the right people at the right time.',
    heroColor: 'linear-gradient(135deg,#c026d3,#a78bfa)',
    description: `SEO is the foundation of every successful digital presence. When someone searches for your product or service on Google, you need to be on page 1 — because 95% of clicks go to the first page. Paper5's SEO service is built around sustainable, long-term rankings using white-hat techniques that stand the test of Google algorithm updates.`,
    whatWeDeliver: [
      'Full technical SEO audit & fix report',
      'Keyword research (5–25 keywords depending on plan)',
      'On-page optimisation for all key pages',
      'Title, H1/H2/H3, meta description & schema markup',
      'Image alt tags & internal linking',
      'Google My Business optimisation',
      'Monthly ranking & traffic report',
    ],
    results: ['Average 3x organic traffic in 6 months', 'Page 1 rankings for 80% of target keywords', 'Avg. 220% increase in inbound leads'],
    packages: [
      {
        name: 'Starter SEO', priceINR: 38500, billing: 'month', highlight: false,
        features: ['5 pages optimised', 'Title, H1/H2/H3 tags', 'Meta description', '5 keywords researched', 'GMB management', 'Monthly report'],
        tag: null,
      },
      {
        name: 'Growth SEO', priceINR: 54500, billing: 'month', highlight: true,
        features: ['10 pages optimised', 'Title, H1/H2/H3 + schema markup', 'Meta description + image alt tags', '10 keywords researched', 'Full page audit', 'Competitor tracking', 'Bi-weekly strategy call'],
        tag: 'Most popular',
      },
      {
        name: 'Authority SEO', priceINR: 109500, billing: 'month', highlight: false,
        features: ['25 pages optimised', 'Full on-page + schema + audit', '25 keywords researched', 'Advanced link building', 'Weekly reports', 'Dedicated SEO manager', 'Quarterly strategy review'],
        tag: 'Best results',
      },
    ],
  },

  'social-media': {
    num: '02', icon: '📱',
    name: 'Social Media Marketing',
    tagline: 'Build a community that follows, trusts and buys.',
    heroColor: 'linear-gradient(135deg,#0891b2,#34d399)',
    description: `Social media is where your customers spend hours every day. Paper5 manages your Instagram, LinkedIn, Facebook, and X presence — creating content, growing your following, and building genuine engagement that translates into real business. We don't just post — we build a brand people love.`,
    whatWeDeliver: [
      'Social media strategy & brand voice guide',
      'Custom post designs + captions + hashtags',
      'Reels & short-form video creation',
      'Community management & comment replies',
      'Page/channel evaluation & audit',
      'Post scheduling across platforms',
      'Monthly analytics & growth report',
    ],
    results: ['Average 280% follower growth in 6 months', '5x improvement in engagement rate', 'Clients report 35% of new inquiries from social'],
    packages: [
      {
        name: 'Social Starter', priceINR: 48000, billing: 'month', highlight: false,
        features: ['12 post designs + captions', '1 platform (Instagram or Facebook)', 'Hashtag research', 'Post scheduling', 'Monthly report', '2 revisions'],
        tag: null,
      },
      {
        name: 'Social Growth', priceINR: 69000, billing: 'month', highlight: true,
        features: ['16 post designs + 4 videos', '2 platforms', 'Captions + hashtags', 'Page evaluation & audit', 'Post scheduling', 'Monthly report + action plan', '2 revisions'],
        tag: 'Most popular',
      },
      {
        name: 'Social Pro', priceINR: 112500, billing: 'month', highlight: false,
        features: ['24 post designs + 6 videos', '3–5 platforms', '1 post/day for 30 days', 'Full strategy + action plan', 'Community management', 'Weekly reports', 'Dedicated manager'],
        tag: 'Best results',
      },
    ],
  },

  'website-designing': {
    num: '03', icon: '💻',
    name: 'Website Designing',
    tagline: 'Your website is your best salesperson — make it count.',
    heroColor: 'linear-gradient(135deg,#1d4ed8,#38bdf8)',
    description: `Your website is the first thing a potential client judges you by. A slow, outdated, or confusing website loses you customers before you even know they visited. Paper5 designs beautiful, fast, mobile-first websites that are built to convert visitors into leads — and leads into paying clients.`,
    whatWeDeliver: [
      'Custom website design (no generic templates)',
      'Mobile-first responsive development',
      'WordPress / Webflow / custom build',
      'Landing page design for campaigns',
      'Website speed & Core Web Vitals optimisation',
      'Contact forms & lead capture setup',
      'Basic SEO setup on all pages',
    ],
    results: ['Avg. 3x increase in time-on-site after redesign', '60% improvement in mobile conversion rate', 'Clients see 2x more leads within 30 days of launch'],
    packages: [
      {
        name: 'Business', priceINR: 40000, billing: 'one-time', highlight: false,
        features: ['Up to 5 pages', 'Mobile responsive', 'Contact form', 'Basic SEO setup', 'Free domain setup', '3 revisions'],
        tag: null,
      },
      {
        name: 'Professional', priceINR: 75000, billing: 'one-time', highlight: true,
        features: ['Up to 10 pages', 'Custom UI design', 'Blog setup', 'Speed optimisation', 'Analytics integration', '5 revisions', '1 month support'],
        tag: 'Most popular',
      },
      {
        name: 'Premium', priceINR: 140000, billing: 'one-time', highlight: false,
        features: ['Unlimited pages', 'Full custom UI/UX', 'eCommerce ready', 'CMS integration', 'Advanced SEO', 'Unlimited revisions', '3 months support'],
        tag: 'Best results',
      },
    ],
    addons: [
      { name: 'Monthly maintenance (AMC)', priceINR: 5000 },
      { name: 'Extra page design', priceINR: 3000 },
    ],
  },

  'paid-advertising': {
    num: '04', icon: '📺',
    name: 'Paid Advertising (PPC)',
    tagline: 'Every rupee you spend, engineered to return more.',
    heroColor: 'linear-gradient(135deg,#7c3aed,#818cf8)',
    description: `Paid advertising done right isn't just about spending money — it's about spending it intelligently. Paper5 manages Google Ads and Meta Ads campaigns with a laser focus on ROI. We set up, optimise, and scale your campaigns while you focus on running your business. First results visible within 7 days. Ad spend budget is separate and paid directly to Google/Meta.`,
    whatWeDeliver: [
      'Campaign strategy & competitor analysis (3–9 competitors)',
      'Ad copy & creative design (2–6 new ads/month)',
      'Google Search, Display & Shopping campaigns',
      'Meta (Facebook & Instagram) Ads',
      'SEM audit & full campaign setup',
      '4 weeks of active campaign management',
      'Weekly optimisation + performance report',
    ],
    results: ['Average 5.2x ROAS across client campaigns', '40% lower cost-per-lead vs. industry benchmark', 'First results visible within 7 days'],
    packages: [
      {
        name: 'PPC Starter', priceINR: 37000, billing: 'month', highlight: false,
        features: ['Google OR Meta Ads (1 platform)', '2 new ads/month', '3 competitors analysed', 'Full campaign setup', '4 weeks management', 'Monthly report', '3 revisions'],
        tag: null,
        note: 'Ad spend paid separately to Google/Meta',
      },
      {
        name: 'PPC Growth', priceINR: 76500, billing: 'month', highlight: true,
        features: ['Google AND Meta Ads (2 platforms)', '4 new ads/month', '6 competitors analysed', 'Full campaign setup', '4 weeks management', 'Weekly reports', '3 revisions'],
        tag: 'Most popular',
        note: 'Ad spend paid separately to Google/Meta',
      },
      {
        name: 'PPC Scale', priceINR: 108500, billing: 'month', highlight: false,
        features: ['Google + Meta + TikTok Ads', '6 new ads/month', '9 competitors analysed', 'Full campaign setup', '4 weeks management', 'Daily monitoring', 'Custom dashboard', '3 revisions'],
        tag: 'Best results',
        note: 'Ad spend paid separately to Google/Meta',
      },
    ],
  },
};

const slugMap = {
  'seo':               'SEO',
  'social-media':      'Social Media Marketing',
  'website-designing': 'Website Designing',
  'paid-advertising':  'Paid Advertising',
};

function CurrencyToggle({ currency, setCurrency }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'.5rem', background:'white', border:'1px solid var(--border)', borderRadius:'100px', padding:'.25rem .35rem' }}>
      {Object.entries(CURRENCIES).map(([key, c]) => (
        <button key={key} onClick={() => setCurrency(key)}
          style={{ padding:'.35rem .85rem', borderRadius:'100px', border:'none', cursor:'pointer', fontFamily:'var(--font-mono)', fontSize:'.75rem', fontWeight:600, letterSpacing:'.04em', transition:'all .2s', background: currency === key ? 'var(--ink)' : 'transparent', color: currency === key ? 'white' : 'var(--muted)' }}>
          {c.flag} {c.label}
        </button>
      ))}
    </div>
  );
}

function BuyModal({ pkg, service, onClose, currency }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'' });
  const priceDisplay = formatPrice(pkg.priceINR, currency);
  const whatsappMsg = `Hi Paper5! I'd like to get started with the *${pkg.name}* package (${priceDisplay}/${pkg.billing}). My name is ${form.name || '[your name]'} from ${form.company || '[company]'}. Please guide me on the next steps.`;

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(26,18,8,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'var(--cream)', borderRadius:24, padding:'2.5rem', width:'100%', maxWidth:480, position:'relative', maxHeight:'90vh', overflowY:'auto' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:20, background:'none', border:'none', fontSize:'1.4rem', cursor:'pointer', color:'var(--muted)' }}>✕</button>

        {step === 1 && (
          <>
            <span style={{ display:'inline-block', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:'#5b21b6', background:'#ede9fe', border:'1px solid #ddd6fe', padding:'.3rem .8rem', borderRadius:'100px', marginBottom:'1rem' }}>{service.name}</span>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:400, letterSpacing:'-.03em', marginBottom:'.4rem' }}>{pkg.name}</h2>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:700, background:service.heroColor, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:'1.5rem' }}>
              {priceDisplay} <span style={{ fontSize:'1rem', fontWeight:400, WebkitTextFillColor:'var(--muted)', color:'var(--muted)' }}>/ {pkg.billing}</span>
            </p>
            <div style={{ background:'white', borderRadius:14, padding:'1.2rem', marginBottom:'1.5rem', border:'1px solid var(--border)' }}>
              <p style={{ fontSize:'.82rem', fontWeight:600, marginBottom:'.75rem' }}>What's included:</p>
              {pkg.features.map((f, i) => (
                <div key={i} style={{ display:'flex', gap:'.6rem', fontSize:'.85rem', color:'var(--muted)', padding:'.3rem 0' }}>
                  <span style={{ color:'#059669', flexShrink:0 }}>✓</span> {f}
                </div>
              ))}
            </div>
            {pkg.note && (
              <div style={{ background:'#eff6ff', borderRadius:10, padding:'.75rem 1rem', marginBottom:'1.2rem', border:'1px solid #bfdbfe' }}>
                <p style={{ fontSize:'.82rem', color:'#1e40af' }}>ℹ {pkg.note}</p>
              </div>
            )}
            <div style={{ background:'#fffbeb', borderRadius:12, padding:'1rem', marginBottom:'1.5rem', border:'1px solid #fde68a' }}>
              <p style={{ fontSize:'.82rem', color:'#92400e', lineHeight:1.6 }}>
                <strong>How it works:</strong> Fill in your details and our team will reach out within 24 hours to discuss your goals and get started. No payment until you're fully happy with the plan.
              </p>
            </div>
            <button onClick={() => setStep(2)} style={{ width:'100%', padding:'1rem', background:'var(--ink)', color:'white', border:'none', borderRadius:'100px', fontSize:'1rem', fontWeight:600, cursor:'pointer' }}
              onMouseEnter={e=>e.target.style.background='#7c3aed'} onMouseLeave={e=>e.target.style.background='var(--ink)'}>
              Get started with this plan →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:400, letterSpacing:'-.03em', marginBottom:'.4rem' }}>Your details</h2>
            <p style={{ color:'var(--muted)', fontSize:'.88rem', marginBottom:'1.5rem' }}>We'll use these to prepare your custom onboarding plan.</p>
            {[['Name','name','text','Your full name'],['Email','email','email','you@company.com'],['Phone / WhatsApp','phone','tel','+91 or international'],['Company','company','text','Your Company']].map(([label,field,type,ph]) => (
              <div key={field} style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.4rem' }}>{label}</label>
                <input type={type} value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})} placeholder={ph}
                  style={{ width:'100%', padding:'.8rem 1rem', background:'white', border:'1.5px solid var(--border)', borderRadius:10, fontSize:'.9rem', outline:'none', fontFamily:'var(--font-body)', color:'var(--ink)' }}
                  onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              </div>
            ))}
            <div style={{ display:'flex', gap:'.75rem', marginTop:'1.5rem' }}>
              <button onClick={()=>setStep(3)} disabled={!form.name||!form.email}
                style={{ flex:1, padding:'.9rem', background:(!form.name||!form.email)?'#ccc':'var(--ink)', color:'white', border:'none', borderRadius:'100px', fontSize:'.9rem', fontWeight:600, cursor:(!form.name||!form.email)?'not-allowed':'pointer' }}>
                Continue →
              </button>
              <button onClick={()=>setStep(1)} style={{ padding:'.9rem 1.5rem', background:'transparent', border:'1.5px solid var(--border)', borderRadius:'100px', fontSize:'.9rem', cursor:'pointer', color:'var(--muted)' }}>Back</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
              <div style={{ width:60, height:60, background:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:28 }}>✓</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:400, letterSpacing:'-.03em', marginBottom:'.5rem' }}>You're all set!</h2>
              <p style={{ color:'var(--muted)', fontSize:'.9rem', lineHeight:1.7 }}>Choose how you'd like us to reach out. We respond within 24 hours.</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.75rem', marginBottom:'1.5rem' }}>
              <a href={`https://wa.me/919999999999?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noreferrer"
                style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'1rem 1.4rem', background:'#25D366', color:'white', borderRadius:14, textDecoration:'none', fontWeight:600, fontSize:'.95rem' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
              <a href={`mailto:hello@paper5.co?subject=Interested in ${pkg.name}&body=Hi Paper5 Team,%0A%0AI'd like to get started with the ${pkg.name} package (${priceDisplay}/${pkg.billing}).%0A%0AName: ${form.name}%0ACompany: ${form.company}%0APhone: ${form.phone}%0A%0AThanks!`}
                style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'1rem 1.4rem', background:'var(--ink)', color:'white', borderRadius:14, textDecoration:'none', fontWeight:600, fontSize:'.95rem' }}>
                <span style={{ fontSize:20 }}>✉️</span> Send us an email
              </a>
              <Link to="/#contact" onClick={onClose}
                style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'1rem 1.4rem', background:'white', color:'var(--ink)', borderRadius:14, textDecoration:'none', fontWeight:600, fontSize:'.95rem', border:'1.5px solid var(--border)' }}>
                <span style={{ fontSize:20 }}>📋</span> Fill the contact form
              </Link>
            </div>
            <p style={{ textAlign:'center', fontSize:'.78rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>hello@paper5.co · paper5.co</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  const service = SERVICES[slug];
  const [buyPkg, setBuyPkg] = useState(null);
  const [currency, setCurrency] = useState('INR');

  if (!service) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', background:'var(--cream)' }}>
        <p style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--muted)' }}>Service not found.</p>
        <Link to="/" className="btn btn-outline">← Back home</Link>
      </div>
    );
  }

  return (
    <div style={{ background:'var(--cream)', minHeight:'100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding:'7rem 2rem 4rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 60% 80% at 80% 50%, rgba(124,58,237,0.07) 0%, transparent 70%)`, pointerEvents:'none' }}/>
        <div style={{ maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:1 }}>
          <Link to="/#services" style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', fontFamily:'var(--font-mono)', fontSize:'.75rem', letterSpacing:'.08em', color:'var(--muted)', marginBottom:'2rem', textDecoration:'none' }}>
            ← Back to services
          </Link>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>
            <div>
              <span style={{ display:'inline-block', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted)', background:'var(--cream3)', border:'1px solid var(--border)', padding:'.35rem .9rem', borderRadius:'100px', marginBottom:'1.2rem' }}>
                Service {service.num}
              </span>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.4rem,4.5vw,3.8rem)', fontWeight:400, lineHeight:1.08, letterSpacing:'-.03em', marginBottom:'1rem' }}>
                {service.name}
              </h1>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontStyle:'italic', fontWeight:300, color:'var(--muted)', marginBottom:'1.5rem', lineHeight:1.5 }}>{service.tagline}</p>
              <p style={{ color:'var(--muted)', fontSize:'1rem', lineHeight:1.8, marginBottom:'2rem' }}>{service.description}</p>
              <a href="#pricing" className="btn btn-dark">View pricing →</a>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {service.results.map((r, i) => (
                <div key={i} style={{ background:'white', borderRadius:16, padding:'1.2rem 1.4rem', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'1rem' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:service.heroColor, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>
                    {['🚀','📊','💡'][i]}
                  </div>
                  <p style={{ fontSize:'.9rem', fontWeight:500, lineHeight:1.4 }}>{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What we deliver */}
      <section style={{ padding:'4rem 2rem', background:'var(--cream2)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:400, letterSpacing:'-.03em', marginBottom:'2rem' }}>
            What we <em style={{ fontStyle:'italic', fontWeight:300, background:service.heroColor, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>deliver</em>
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'.85rem' }}>
            {service.whatWeDeliver.map((item, i) => (
              <div key={i} style={{ background:'white', borderRadius:12, padding:'1rem 1.2rem', border:'1px solid var(--border)', display:'flex', alignItems:'flex-start', gap:'.75rem' }}>
                <span style={{ width:22, height:22, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:12, color:'#166534', fontWeight:600, marginTop:1 }}>✓</span>
                <span style={{ fontSize:'.9rem', color:'var(--ink)', lineHeight:1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding:'5rem 2rem' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>

          {/* Pricing header with currency toggle */}
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'3rem', flexWrap:'wrap', gap:'1.5rem' }}>
            <div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,3.5vw,3rem)', fontWeight:400, letterSpacing:'-.03em', marginBottom:'.5rem' }}>
                Choose your <em style={{ fontStyle:'italic', fontWeight:300, background:service.heroColor, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>plan</em>
              </h2>
              <p style={{ color:'var(--muted)', fontSize:'.95rem' }}>No lock-in contracts. Cancel anytime. Results guaranteed or we work for free.</p>
            </div>
            <CurrencyToggle currency={currency} setCurrency={setCurrency} />
          </div>

          {/* International client note */}
          {currency !== 'INR' && (
            <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:'1rem 1.2rem', marginBottom:'2rem', display:'flex', alignItems:'center', gap:'.75rem' }}>
              <span style={{ fontSize:20 }}>🌍</span>
              <p style={{ fontSize:'.88rem', color:'#1e40af', lineHeight:1.6 }}>
                <strong>International clients</strong> — prices shown in {CURRENCIES[currency].label} for reference. All invoices are raised in INR. Exchange rates are approximate. For a custom quote or to pay in your local currency, <Link to="/#contact" style={{ color:'#7c3aed', fontWeight:600 }}>contact us directly.</Link>
              </p>
            </div>
          )}

          {/* Package cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.2rem' }}>
            {service.packages.map((pkg, i) => (
              <div key={i} style={{ background:'white', borderRadius:20, padding:'2rem', border:pkg.highlight ? '2px solid #7c3aed' : '1px solid var(--border)', position:'relative', display:'flex', flexDirection:'column', transition:'all .3s' }}
                onMouseEnter={e=>{ if(!pkg.highlight) e.currentTarget.style.transform='translateY(-4px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=''; }}>

                {pkg.highlight && (
                  <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:'#7c3aed', color:'white', fontSize:'.72rem', fontWeight:600, padding:'.35rem 1rem', borderRadius:'100px', whiteSpace:'nowrap', fontFamily:'var(--font-mono)' }}>
                    ⭐ Most popular
                  </div>
                )}
                {pkg.tag && !pkg.highlight && (
                  <div style={{ position:'absolute', top:-12, right:16, background:'var(--cream3)', color:'var(--muted)', fontSize:'.68rem', fontWeight:600, padding:'.25rem .8rem', borderRadius:'100px', fontFamily:'var(--font-mono)', border:'1px solid var(--border)' }}>
                    {pkg.tag}
                  </div>
                )}

                <div style={{ marginBottom:'1.5rem' }}>
                  <h3 style={{ fontSize:'1.05rem', fontWeight:600, marginBottom:'.75rem' }}>{pkg.name}</h3>

                  {/* Price display */}
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'2.4rem', fontWeight:700, background:service.heroColor, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }}>
                    {formatPrice(pkg.priceINR, currency)}
                  </div>
                  <div style={{ fontSize:'.8rem', color:'var(--muted)', marginTop:'.3rem' }}>
                    per {pkg.billing}
                    {currency !== 'INR' && (
                      <span style={{ marginLeft:'.5rem', fontFamily:'var(--font-mono)', fontSize:'.7rem', background:'#eff6ff', color:'#1e40af', padding:'1px 6px', borderRadius:'100px' }}>
                        ≈ {formatPrice(pkg.priceINR, 'INR')}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ flex:1, marginBottom:'1.5rem' }}>
                  {pkg.features.map((f, j) => (
                    <div key={j} style={{ display:'flex', alignItems:'flex-start', gap:'.6rem', padding:'.45rem 0', borderBottom:'1px solid var(--border)', fontSize:'.85rem', color:'var(--ink)' }}>
                      <span style={{ color:'#059669', flexShrink:0, marginTop:1 }}>✓</span>{f}
                    </div>
                  ))}
                  {pkg.note && (
                    <div style={{ marginTop:'.75rem', fontSize:'.78rem', color:'#1e40af', background:'#eff6ff', padding:'.5rem .75rem', borderRadius:8 }}>
                      ℹ {pkg.note}
                    </div>
                  )}
                </div>

                <button onClick={() => setBuyPkg(pkg)}
                  style={{ width:'100%', padding:'.9rem', background:pkg.highlight ? 'var(--ink)' : 'transparent', color:pkg.highlight ? 'white' : 'var(--ink)', border:pkg.highlight ? 'none' : '1.5px solid var(--border)', borderRadius:'100px', fontSize:'.92rem', fontWeight:600, cursor:'pointer', transition:'all .25s', fontFamily:'var(--font-body)' }}
                  onMouseEnter={e=>{ e.target.style.background='#7c3aed'; e.target.style.color='white'; e.target.style.borderColor='#7c3aed'; }}
                  onMouseLeave={e=>{ e.target.style.background=pkg.highlight?'var(--ink)':'transparent'; e.target.style.color=pkg.highlight?'white':'var(--ink)'; e.target.style.borderColor=pkg.highlight?'transparent':'var(--border)'; }}>
                  Buy this plan →
                </button>
              </div>
            ))}
          </div>

          {/* Add-ons for website */}
          {service.addons && (
            <div style={{ marginTop:'2rem', background:'var(--cream2)', borderRadius:16, padding:'1.5rem', border:'1px solid var(--border)' }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:400, letterSpacing:'-.02em', marginBottom:'1rem' }}>Optional add-ons</h3>
              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                {service.addons.map((a, i) => (
                  <div key={i} style={{ background:'white', borderRadius:12, padding:'.75rem 1.2rem', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'1rem' }}>
                    <span style={{ fontSize:'.9rem', fontWeight:500 }}>{a.name}</span>
                    <span style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, background:service.heroColor, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                      {formatPrice(a.priceINR, currency)}<span style={{ fontSize:'.75rem', fontWeight:400, WebkitTextFillColor:'var(--muted)', color:'var(--muted)' }}>/mo</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom plan CTA */}
          <div style={{ textAlign:'center', marginTop:'2rem', padding:'1.5rem', background:'var(--cream2)', borderRadius:14, border:'1px solid var(--border)' }}>
            <p style={{ fontSize:'.9rem', color:'var(--muted)' }}>
              Need a custom plan or have a unique requirement?{' '}
              <Link to="/#contact" style={{ color:'#7c3aed', fontWeight:600 }}>Talk to us</Link> — we build bespoke packages for every budget and market.
            </p>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section style={{ padding:'4rem 2rem', background:'var(--cream2)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:400, letterSpacing:'-.03em', marginBottom:'1.5rem' }}>Explore other services</h2>
          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            {Object.entries(SERVICES).filter(([s]) => s !== slug).map(([s, svc]) => (
              <Link key={s} to={`/services/${s}`}
                style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'.6rem 1.2rem', background:'white', border:'1px solid var(--border)', borderRadius:'100px', fontSize:'.85rem', color:'var(--ink)', textDecoration:'none', transition:'all .2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='#7c3aed'; e.currentTarget.style.color='#7c3aed'; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--ink)'; }}>
                <span style={{ fontSize:16 }}>{svc.icon}</span> {svc.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background:'var(--ink)', padding:'2rem', textAlign:'center' }}>
        <p style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', fontFamily:'var(--font-mono)' }}>© 2026 Paper5 · paper5.co</p>
      </footer>

      {buyPkg && <BuyModal pkg={buyPkg} service={service} onClose={() => setBuyPkg(null)} currency={currency} />}
    </div>
  );
}
