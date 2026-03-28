import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const CURRENCIES = {
  INR: { symbol: '₹', label: 'INR', rate: 1,      flag: '🇮🇳' },
  USD: { symbol: '$', label: 'USD', rate: 0.012,   flag: '🇺🇸' },
  GBP: { symbol: '£', label: 'GBP', rate: 0.0095,  flag: '🇬🇧' },
};

const fmt = (inrAmount, currency) => {
  const c = CURRENCIES[currency];
  const v = inrAmount * c.rate;
  if (currency === 'INR') return c.symbol + Math.round(v).toLocaleString('en-IN');
  return c.symbol + Math.round(v).toLocaleString();
};

const SUBTYPES = {
  wordpress: {
    slug: 'wordpress',
    label: 'WordPress',
    icon: '🌐',
    heroColor: 'linear-gradient(135deg,#1d4ed8,#38bdf8)',
    tagline: 'Professional websites, easy to manage yourself.',
    description: 'WordPress powers 43% of the internet for a reason — it\'s reliable, flexible, and easy for you to update without a developer. Paper5 builds custom WordPress websites that look bespoke, load fast, and convert visitors into clients. Perfect for businesses that want a great website without ongoing developer dependency.',
    whatWeDeliver: [
      'Custom WordPress theme design (not generic templates)',
      'Mobile-first responsive layout',
      'Page builder setup (Elementor / Gutenberg)',
      'WooCommerce setup for eCommerce (Premium)',
      'Speed optimisation & caching setup',
      'Basic SEO plugin configuration',
      'Contact forms & lead capture',
      'Training session so you can manage it yourself',
    ],
    results: ['Avg. 2.5x faster load times than client\'s previous site', '65% of clients manage content themselves after handover', 'Average 40% increase in enquiry conversions'],
    packages: [
      {
        name: 'WP Business', priceINR: 40000, billing: 'one-time', highlight: false,
        features: ['Up to 5 pages', 'Custom design', 'Mobile responsive', 'Contact form', 'Basic SEO setup', 'Free domain setup', '3 revisions', '2 weeks delivery'],
        tag: null,
      },
      {
        name: 'WP Professional', priceINR: 75000, billing: 'one-time', highlight: true,
        features: ['Up to 10 pages', 'Custom UI + Elementor', 'Blog setup', 'Speed optimisation', 'Analytics integration', 'WooCommerce ready', '5 revisions', '1 month support', '3–4 weeks delivery'],
        tag: 'Most popular',
      },
      {
        name: 'WP Premium', priceINR: 140000, billing: 'one-time', highlight: false,
        features: ['Unlimited pages', 'Full custom theme', 'eCommerce (WooCommerce)', 'Payment gateway integration', 'Advanced SEO setup', 'Performance audit', 'Unlimited revisions', '3 months support', '5–6 weeks delivery'],
        tag: 'Best results',
      },
    ],
    addons: [
      { name: 'Monthly maintenance (AMC)', priceINR: 5000 },
      { name: 'Extra page', priceINR: 3000 },
      { name: 'WooCommerce product upload (per 50)', priceINR: 4000 },
    ],
  },

  fullstack: {
    slug: 'fullstack',
    label: 'Full Stack Development',
    icon: '⚡',
    heroColor: 'linear-gradient(135deg,#7c3aed,#1d4ed8)',
    tagline: 'Custom-built web applications with no limits.',
    description: 'When WordPress isn\'t enough — when you need a custom booking system, a SaaS dashboard, a marketplace, or a fully bespoke web app — you need Full Stack Development. Paper5 builds production-grade applications using React, Node.js, and MongoDB. You own 100% of the code, no third-party platform lock-in.',
    whatWeDeliver: [
      'Custom React frontend with animations & responsive design',
      'REST API with Node.js + Express (Full Stack only)',
      'MongoDB / PostgreSQL database (Full Stack only)',
      'JWT authentication & user management (Full Stack only)',
      'Admin dashboard & CMS (Full Stack only)',
      'Deployment on Vercel + Railway / AWS',
      'Full source code ownership',
      'Technical documentation & handover',
    ],
    results: ['100% custom — no template limitations', 'Built to scale from 10 to 100,000 users', 'Average 3x performance vs. WordPress for complex apps'],
    tiers: [
      {
        id: 'frontend',
        label: 'Frontend only',
        icon: '🎨',
        desc: 'Beautiful, fast React UI. Perfect when you already have a backend or API, or just need a stunning web presence.',
        packages: [
          {
            name: 'Frontend Starter', priceINR: 50000, billing: 'one-time', highlight: false,
            features: ['Up to 5 pages / screens', 'React 18 + custom CSS', 'Mobile responsive', 'Animations & transitions', 'Contact form (static)', '3 revisions', '2–3 weeks delivery'],
            tag: null,
          },
          {
            name: 'Frontend Pro', priceINR: 95000, billing: 'one-time', highlight: true,
            features: ['Up to 12 pages / screens', 'React 18 + Tailwind CSS', 'Full animation suite', 'Multi-page routing', 'API integration (existing backend)', '5 revisions', '1 month support', '3–4 weeks delivery'],
            tag: 'Most popular',
          },
          {
            name: 'Frontend Premium', priceINR: 170000, billing: 'one-time', highlight: false,
            features: ['Unlimited screens', 'Custom design system', 'Complex interactions & micro-animations', 'Full API integration', 'Performance optimisation', 'Unlimited revisions', '3 months support', '5–6 weeks delivery'],
            tag: null,
          },
        ],
      },
      {
        id: 'fullstack',
        label: 'Frontend + Backend',
        icon: '🚀',
        desc: 'Complete web application — React frontend + Node.js API + MongoDB database. Full ownership, built to scale.',
        packages: [
          {
            name: 'Full Stack Starter', priceINR: 90000, billing: 'one-time', highlight: false,
            features: ['Up to 5 screens', 'React frontend', 'Node.js + Express API', 'MongoDB database', 'JWT authentication', 'Basic admin panel', '3 revisions', '4–5 weeks delivery'],
            tag: null,
          },
          {
            name: 'Full Stack Pro', priceINR: 175000, billing: 'one-time', highlight: true,
            features: ['Up to 15 screens', 'Full React UI + animations', 'Complete REST API', 'MongoDB + advanced queries', 'Auth + roles + permissions', 'Custom admin dashboard', 'Email notifications', '5 revisions', '2 months support', '6–8 weeks delivery'],
            tag: 'Most popular',
          },
          {
            name: 'Full Stack Enterprise', priceINR: 350000, billing: 'one-time', highlight: false,
            features: ['Unlimited screens', 'Full custom design system', 'Scalable microservices API', 'PostgreSQL or MongoDB', 'Full auth system + OAuth', 'Advanced admin CMS', 'Payment gateway (Razorpay/Stripe)', 'Unlimited revisions', '6 months support', 'Deployment included'],
            tag: 'For SaaS / Startups',
          },
        ],
      },
    ],
  },
};

function CurrencyToggle({ currency, setCurrency }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'.4rem', background:'white', border:'1px solid var(--border)', borderRadius:'100px', padding:'.2rem .3rem' }}>
      {Object.entries(CURRENCIES).map(([key, c]) => (
        <button key={key} onClick={() => setCurrency(key)}
          style={{ padding:'.3rem .8rem', borderRadius:'100px', border:'none', cursor:'pointer', fontFamily:'var(--font-mono)', fontSize:'.72rem', fontWeight:600, transition:'all .2s', background: currency === key ? 'var(--ink)' : 'transparent', color: currency === key ? 'white' : 'var(--muted)' }}>
          {c.flag} {c.label}
        </button>
      ))}
    </div>
  );
}

function BuyModal({ pkg, subtype, onClose, currency }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'' });
  const [submitting, setSubmitting] = useState(false);
  const priceDisplay = fmt(pkg.priceINR, currency);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post('/api/contact', {
        name: form.name, email: form.email, company: form.company,
        service: `Website Designing — ${subtype.label} — ${pkg.name}`,
        message: `Phone: ${form.phone}\nInterested in: ${pkg.name} (${priceDisplay})`,
      });
      setStep(3);
    } catch {
      toast.error('Something went wrong. Please email us at hello@paper5.co');
    } finally { setSubmitting(false); }
  };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(26,18,8,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'var(--cream)', borderRadius:24, padding:'2.5rem', width:'100%', maxWidth:480, position:'relative', maxHeight:'90vh', overflowY:'auto' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:20, background:'none', border:'none', fontSize:'1.4rem', cursor:'pointer', color:'var(--muted)' }}>✕</button>

        {step === 1 && (
          <>
            <span style={{ display:'inline-block', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:'#5b21b6', background:'#ede9fe', border:'1px solid #ddd6fe', padding:'.3rem .8rem', borderRadius:'100px', marginBottom:'1rem' }}>
              {subtype.label}
            </span>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:400, letterSpacing:'-.03em', marginBottom:'.4rem' }}>{pkg.name}</h2>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:700, background:subtype.heroColor, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:'1.5rem' }}>
              {priceDisplay} <span style={{ fontSize:'1rem', fontWeight:400, WebkitTextFillColor:'var(--muted)', color:'var(--muted)' }}>one-time</span>
            </p>
            <div style={{ background:'white', borderRadius:14, padding:'1.2rem', marginBottom:'1.5rem', border:'1px solid var(--border)' }}>
              {pkg.features.map((f, i) => (
                <div key={i} style={{ display:'flex', gap:'.6rem', fontSize:'.85rem', color:'var(--muted)', padding:'.3rem 0' }}>
                  <span style={{ color:'#059669', flexShrink:0 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} style={{ width:'100%', padding:'1rem', background:'var(--ink)', color:'white', border:'none', borderRadius:'100px', fontSize:'1rem', fontWeight:600, cursor:'pointer' }}
              onMouseEnter={e=>e.target.style.background='#7c3aed'} onMouseLeave={e=>e.target.style.background='var(--ink)'}>
              Get started →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:400, letterSpacing:'-.03em', marginBottom:'1.5rem' }}>Your details</h2>
            {[['Name','name','text','Your full name'],['Email','email','email','you@company.com'],['Phone / WhatsApp','phone','tel','+91 or international'],['Company','company','text','Your company']].map(([label,field,type,ph]) => (
              <div key={field} style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.4rem' }}>{label}</label>
                <input type={type} value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})} placeholder={ph}
                  style={{ width:'100%', padding:'.8rem 1rem', background:'white', border:'1.5px solid var(--border)', borderRadius:10, fontSize:'.9rem', outline:'none', fontFamily:'var(--font-body)', color:'var(--ink)' }}
                  onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              </div>
            ))}
            <div style={{ display:'flex', gap:'.75rem', marginTop:'1.5rem' }}>
              <button onClick={handleSubmit} disabled={!form.name || !form.email || submitting}
                style={{ flex:1, padding:'.9rem', background:(!form.name||!form.email)?'#ccc':'var(--ink)', color:'white', border:'none', borderRadius:'100px', fontSize:'.9rem', fontWeight:600, cursor:(!form.name||!form.email)?'not-allowed':'pointer' }}>
                {submitting ? 'Sending…' : 'Submit →'}
              </button>
              <button onClick={()=>setStep(1)} style={{ padding:'.9rem 1.5rem', background:'transparent', border:'1.5px solid var(--border)', borderRadius:'100px', fontSize:'.9rem', cursor:'pointer', color:'var(--muted)' }}>Back</button>
            </div>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign:'center', padding:'1rem 0' }}>
            <div style={{ width:60, height:60, background:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.2rem', fontSize:28 }}>✓</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:400, marginBottom:'.6rem' }}>Request received!</h2>
            <p style={{ color:'var(--muted)', fontSize:'.9rem', lineHeight:1.7, marginBottom:'1.5rem' }}>
              We'll be in touch at <strong>{form.email}</strong> within 24 hours with a detailed project proposal.
            </p>
            <button onClick={onClose} style={{ padding:'.75rem 2rem', background:'var(--ink)', color:'white', border:'none', borderRadius:'100px', fontWeight:600, cursor:'pointer', fontSize:'.9rem' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WebsiteServicePage() {
  const { subtype: subtypeParam } = useParams();
  const [currency, setCurrency] = useState('INR');
  const [activeTier, setActiveTier] = useState('frontend');
  const [buyPkg, setBuyPkg] = useState(null);

  const subtype = SUBTYPES[subtypeParam];

  if (!subtype) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', background:'var(--cream)' }}>
        <p style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--muted)' }}>Page not found.</p>
        <Link to="/services/website-designing/wordpress" className="btn btn-outline">WordPress</Link>
        <Link to="/services/website-designing/fullstack" className="btn btn-outline">Full Stack</Link>
      </div>
    );
  }

  const packages = subtype.tiers
    ? subtype.tiers.find(t => t.id === activeTier)?.packages || []
    : subtype.packages;

  return (
    <div style={{ background:'var(--cream)', minHeight:'100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding:'7rem 2rem 4rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 60% 80% at 80% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)`, pointerEvents:'none' }}/>
        <div style={{ maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap' }}>
            <Link to="/#services" style={{ fontFamily:'var(--font-mono)', fontSize:'.75rem', color:'var(--muted)', textDecoration:'none' }}>← Services</Link>
            <span style={{ color:'var(--border)' }}>/</span>
            <Link to="/services/website-designing/wordpress" style={{ fontFamily:'var(--font-mono)', fontSize:'.75rem', color: subtypeParam === 'wordpress' ? '#1d4ed8' : 'var(--muted)', textDecoration:'none', fontWeight: subtypeParam === 'wordpress' ? 600 : 400 }}>WordPress</Link>
            <span style={{ color:'var(--border)' }}>/</span>
            <Link to="/services/website-designing/fullstack" style={{ fontFamily:'var(--font-mono)', fontSize:'.75rem', color: subtypeParam === 'fullstack' ? '#7c3aed' : 'var(--muted)', textDecoration:'none', fontWeight: subtypeParam === 'fullstack' ? 600 : 400 }}>Full Stack</Link>
          </div>

          {/* Sub-type toggle pills */}
          <div style={{ display:'inline-flex', background:'white', borderRadius:'100px', padding:'.3rem', border:'1px solid var(--border)', marginBottom:'2rem', gap:'.25rem' }}>
            {Object.values(SUBTYPES).map(st => (
              <Link key={st.slug} to={`/services/website-designing/${st.slug}`}
                style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', padding:'.5rem 1.2rem', borderRadius:'100px', fontSize:'.85rem', fontWeight:600, textDecoration:'none', transition:'all .2s', background: subtypeParam === st.slug ? 'var(--ink)' : 'transparent', color: subtypeParam === st.slug ? 'white' : 'var(--muted)' }}>
                {st.icon} {st.label}
              </Link>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>
            <div>
              <span style={{ display:'inline-block', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted)', background:'var(--cream3)', border:'1px solid var(--border)', padding:'.35rem .9rem', borderRadius:'100px', marginBottom:'1.2rem' }}>
                Website Designing & Development
              </span>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.4rem,4.5vw,3.8rem)', fontWeight:400, lineHeight:1.08, letterSpacing:'-.03em', marginBottom:'1rem' }}>
                {subtype.label}
              </h1>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontStyle:'italic', fontWeight:300, color:'var(--muted)', marginBottom:'1.5rem', lineHeight:1.5 }}>{subtype.tagline}</p>
              <p style={{ color:'var(--muted)', fontSize:'1rem', lineHeight:1.8, marginBottom:'2rem' }}>{subtype.description}</p>
              <a href="#pricing" className="btn btn-dark">View pricing →</a>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {subtype.results.map((r, i) => (
                <div key={i} style={{ background:'white', borderRadius:16, padding:'1.2rem 1.4rem', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'1rem' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:subtype.heroColor, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>
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
            What we <em style={{ fontStyle:'italic', fontWeight:300, background:subtype.heroColor, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>deliver</em>
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'.85rem' }}>
            {subtype.whatWeDeliver.map((item, i) => (
              <div key={i} style={{ background:'white', borderRadius:12, padding:'1rem 1.2rem', border:'1px solid var(--border)', display:'flex', alignItems:'flex-start', gap:'.75rem',
                opacity: (!subtype.tiers || item.includes('Full Stack only')) && subtype.tiers ? (activeTier === 'fullstack' ? 1 : (item.includes('Full Stack only') ? 0.3 : 1)) : 1 }}>
                <span style={{ width:22, height:22, borderRadius:'50%', background: item.includes('Full Stack only') ? '#ede9fe' : '#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:12, color: item.includes('Full Stack only') ? '#5b21b6' : '#166534', fontWeight:600, marginTop:1 }}>
                  {item.includes('Full Stack only') ? '⚡' : '✓'}
                </span>
                <span style={{ fontSize:'.9rem', color:'var(--ink)', lineHeight:1.5 }}>
                  {item.replace(' (Full Stack only)', '')}
                  {item.includes('Full Stack only') && <span style={{ marginLeft:'.4rem', fontSize:'.72rem', fontFamily:'var(--font-mono)', background:'#ede9fe', color:'#5b21b6', padding:'1px 6px', borderRadius:'100px' }}>Full Stack</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding:'5rem 2rem' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>

          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
            <div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,3.5vw,3rem)', fontWeight:400, letterSpacing:'-.03em', marginBottom:'.5rem' }}>
                Choose your <em style={{ fontStyle:'italic', fontWeight:300, background:subtype.heroColor, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>plan</em>
              </h2>
              <p style={{ color:'var(--muted)', fontSize:'.9rem' }}>50% upfront · 50% on delivery. Full source code ownership.</p>
            </div>
            <CurrencyToggle currency={currency} setCurrency={setCurrency} />
          </div>

          {/* Full Stack tier selector */}
          {subtype.tiers && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'2.5rem' }}>
              {subtype.tiers.map(tier => (
                <button key={tier.id} onClick={() => setActiveTier(tier.id)}
                  style={{ padding:'1.2rem 1.5rem', textAlign:'left', borderRadius:16, border: activeTier === tier.id ? '2px solid #7c3aed' : '1.5px solid var(--border)', background: activeTier === tier.id ? '#f5f3ff' : 'white', cursor:'pointer', transition:'all .2s' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.4rem' }}>
                    <span style={{ fontSize:20 }}>{tier.icon}</span>
                    <span style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:500, color: activeTier === tier.id ? '#5b21b6' : 'var(--ink)' }}>{tier.label}</span>
                    {activeTier === tier.id && <span style={{ marginLeft:'auto', fontSize:'.68rem', fontFamily:'var(--font-mono)', background:'#7c3aed', color:'white', padding:'.2rem .6rem', borderRadius:'100px' }}>selected</span>}
                  </div>
                  <p style={{ fontSize:'.82rem', color:'var(--muted)', lineHeight:1.5 }}>{tier.desc}</p>
                  <p style={{ fontSize:'.75rem', fontFamily:'var(--font-mono)', color: activeTier === tier.id ? '#7c3aed' : 'var(--muted)', marginTop:'.5rem' }}>
                    Starting from {fmt(tier.packages[0].priceINR, currency)}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Currency note for international */}
          {currency !== 'INR' && (
            <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:'1rem 1.2rem', marginBottom:'2rem', display:'flex', alignItems:'center', gap:'.75rem' }}>
              <span style={{ fontSize:18 }}>🌍</span>
              <p style={{ fontSize:'.88rem', color:'#1e40af', lineHeight:1.6 }}>
                International pricing shown for reference. Invoices raised in INR. <Link to="/#contact" style={{ color:'#7c3aed', fontWeight:600 }}>Contact us</Link> for a custom quote.
              </p>
            </div>
          )}

          {/* Package cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.2rem' }}>
            {packages.map((pkg, i) => (
              <div key={i} style={{ background:'white', borderRadius:20, padding:'2rem', border:pkg.highlight ? '2px solid #7c3aed' : '1px solid var(--border)', position:'relative', display:'flex', flexDirection:'column', transition:'all .3s' }}
                onMouseEnter={e=>{ if(!pkg.highlight) e.currentTarget.style.transform='translateY(-4px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=''; }}>
                {pkg.highlight && (
                  <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:'#7c3aed', color:'white', fontSize:'.72rem', fontWeight:600, padding:'.35rem 1rem', borderRadius:'100px', whiteSpace:'nowrap', fontFamily:'var(--font-mono)' }}>
                    ⭐ Most popular
                  </div>
                )}
                {pkg.tag && !pkg.highlight && (
                  <div style={{ position:'absolute', top:-12, right:16, background:'var(--cream3)', color:'var(--muted)', fontSize:'.68rem', padding:'.25rem .8rem', borderRadius:'100px', fontFamily:'var(--font-mono)', border:'1px solid var(--border)' }}>
                    {pkg.tag}
                  </div>
                )}
                <h3 style={{ fontSize:'1rem', fontWeight:600, marginBottom:'.75rem' }}>{pkg.name}</h3>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', fontWeight:700, background:subtype.heroColor, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1, marginBottom:'.3rem' }}>
                  {fmt(pkg.priceINR, currency)}
                </div>
                <div style={{ fontSize:'.8rem', color:'var(--muted)', marginBottom:'1.5rem' }}>
                  one-time
                  {currency !== 'INR' && <span style={{ marginLeft:'.5rem', fontFamily:'var(--font-mono)', fontSize:'.7rem', background:'#eff6ff', color:'#1e40af', padding:'1px 6px', borderRadius:'100px' }}>≈ {fmt(pkg.priceINR, 'INR')}</span>}
                </div>
                <div style={{ flex:1, marginBottom:'1.5rem' }}>
                  {pkg.features.map((f, j) => (
                    <div key={j} style={{ display:'flex', alignItems:'flex-start', gap:'.6rem', padding:'.4rem 0', borderBottom:'1px solid var(--border)', fontSize:'.84rem', color:'var(--ink)' }}>
                      <span style={{ color:'#059669', flexShrink:0, marginTop:1 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button onClick={() => setBuyPkg(pkg)}
                  style={{ width:'100%', padding:'.9rem', background:pkg.highlight?'var(--ink)':'transparent', color:pkg.highlight?'white':'var(--ink)', border:pkg.highlight?'none':'1.5px solid var(--border)', borderRadius:'100px', fontSize:'.92rem', fontWeight:600, cursor:'pointer', transition:'all .25s', fontFamily:'var(--font-body)' }}
                  onMouseEnter={e=>{ e.target.style.background='#7c3aed'; e.target.style.color='white'; e.target.style.borderColor='#7c3aed'; }}
                  onMouseLeave={e=>{ e.target.style.background=pkg.highlight?'var(--ink)':'transparent'; e.target.style.color=pkg.highlight?'white':'var(--ink)'; e.target.style.borderColor=pkg.highlight?'transparent':'var(--border)'; }}>
                  Buy this plan →
                </button>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          {subtype.addons && (
            <div style={{ marginTop:'2rem', background:'var(--cream2)', borderRadius:16, padding:'1.5rem', border:'1px solid var(--border)' }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:400, letterSpacing:'-.02em', marginBottom:'1rem' }}>Optional add-ons</h3>
              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                {subtype.addons.map((a, i) => (
                  <div key={i} style={{ background:'white', borderRadius:12, padding:'.75rem 1.2rem', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'1rem' }}>
                    <span style={{ fontSize:'.9rem', fontWeight:500 }}>{a.name}</span>
                    <span style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, background:subtype.heroColor, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                      {fmt(a.priceINR, currency)}<span style={{ fontSize:'.75rem', fontWeight:400, WebkitTextFillColor:'var(--muted)', color:'var(--muted)' }}>/mo</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ textAlign:'center', marginTop:'2rem', padding:'1.5rem', background:'var(--cream2)', borderRadius:14, border:'1px solid var(--border)' }}>
            <p style={{ fontSize:'.9rem', color:'var(--muted)' }}>
              Need something custom? <Link to="/#contact" style={{ color:'#7c3aed', fontWeight:600 }}>Talk to us</Link> — every project is quoted individually.
            </p>
          </div>
        </div>
      </section>

      {/* Other option */}
      <section style={{ padding:'3rem 2rem', background:'var(--cream2)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:400, letterSpacing:'-.02em', marginBottom:'1rem' }}>Not sure which to pick?</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', maxWidth:600 }}>
            <div style={{ background:'white', borderRadius:14, padding:'1.2rem', border:'1px solid var(--border)' }}>
              <p style={{ fontWeight:600, marginBottom:'.4rem' }}>Choose WordPress if…</p>
              <p style={{ fontSize:'.83rem', color:'var(--muted)', lineHeight:1.65 }}>You want a professional website you can update yourself, need it fast, and don't require custom app functionality.</p>
            </div>
            <div style={{ background:'white', borderRadius:14, padding:'1.2rem', border:'1px solid var(--border)' }}>
              <p style={{ fontWeight:600, marginBottom:'.4rem' }}>Choose Full Stack if…</p>
              <p style={{ fontSize:'.83rem', color:'var(--muted)', lineHeight:1.65 }}>You need custom functionality, a web app, SaaS dashboard, booking system, or anything WordPress can't do out of the box.</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background:'var(--ink)', padding:'2rem', textAlign:'center' }}>
        <p style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', fontFamily:'var(--font-mono)' }}>© 2026 Paper5 · paper5.co</p>
      </footer>

      {buyPkg && <BuyModal pkg={buyPkg} subtype={subtype} onClose={() => setBuyPkg(null)} currency={currency} />}
    </div>
  );
}
