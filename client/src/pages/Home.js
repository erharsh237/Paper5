import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Testimonials from '../components/Testimonials';


const Logo5 = ({ size = 280 }) => (
  <svg width={size} height={size} viewBox="0 0 680 480" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hg1" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#c026d3"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
      <linearGradient id="hg2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#818cf8"/></linearGradient>
      <linearGradient id="hg3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#1d4ed8"/><stop offset="100%" stopColor="#38bdf8"/></linearGradient>
      <linearGradient id="hg4" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#0891b2"/><stop offset="100%" stopColor="#34d399"/></linearGradient>
      <linearGradient id="hg5" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#059669"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient>
      <linearGradient id="hshine" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.2)"/><stop offset="40%" stopColor="rgba(255,255,255,0)"/></linearGradient>
    </defs>
    <g transform="rotate(-22,300,300)" opacity="0.72"><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#hg1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#hshine)"/><text x="314" y="204" fontFamily="Helvetica Neue,sans-serif" fontSize="18" fontWeight="300" fill="rgba(255,255,255,0.85)">P</text></g>
    <g transform="rotate(-11,300,300)" opacity="0.85"><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#hg2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#hshine)"/><text x="314" y="204" fontFamily="Helvetica Neue,sans-serif" fontSize="18" fontWeight="300" fill="rgba(255,255,255,0.88)">A</text></g>
    <rect x="300" y="176" width="90" height="122" rx="12" fill="url(#hg3)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8"/><rect x="300" y="176" width="90" height="122" rx="12" fill="url(#hshine)"/><text x="315" y="199" fontFamily="Helvetica Neue,sans-serif" fontSize="19" fontWeight="300" fill="rgba(255,255,255,0.95)">P</text>
    <g transform="rotate(11,300,300)" opacity="0.85"><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#hg4)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#hshine)"/><text x="314" y="204" fontFamily="Helvetica Neue,sans-serif" fontSize="18" fontWeight="300" fill="rgba(255,255,255,0.88)">E</text></g>
    <g transform="rotate(22,300,300)" opacity="0.72"><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#hg5)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#hshine)"/><text x="314" y="204" fontFamily="Helvetica Neue,sans-serif" fontSize="18" fontWeight="300" fill="rgba(255,255,255,0.85)">R</text></g>
  </svg>
);

const useScrollReveal = () => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const services = [
  { num:'01', icon:'🔍', color:'#fdf2ff', stroke:'#c026d3', name:'Search Engine Optimisation',      slug:'seo',               desc:'Rank higher, get found by the right people. On-page, technical SEO, link building & local SEO.', from:'₹38,500', dropdown: null, included:['Keyword research & strategy','Technical site audit','Monthly ranking reports'] },
  { num:'02', icon:'📱', color:'#ecfeff', stroke:'#0891b2', name:'Social Media Marketing',          slug:'social-media',      desc:'Build a brand people follow and trust. Post designs, Reels, community management & strategy.', from:'₹48,000', dropdown: null, included:['12 posts + 4 Reels / month','Daily community management','Monthly growth report'] },
  { num:'03', icon:'💻', color:'#eff6ff', stroke:'#1d4ed8', name:'Website Designing & Development', slug:'website-designing',  desc:'Beautiful, fast websites. Choose WordPress for easy management or a custom Full Stack build for unlimited power.', from:'₹40,000', dropdown: [{ label:'WordPress', value:'wordpress' }, { label:'Full Stack Development', value:'fullstack' }], included:['UX/UI design + development','Mobile-first, fast loading','1 month free support'] },
  { num:'04', icon:'📺', color:'#f0edff', stroke:'#7c3aed', name:'Paid Advertising (PPC)',          slug:'paid-advertising',   desc:'Google Ads & Meta Ads engineered for maximum ROI. Immediate results, every rupee tracked.', from:'₹37,000', dropdown: null, included:['Google + Meta campaign setup','Conversion tracking setup','Weekly performance reports'] },
];

const acronym = [
  { letter:'P', word:'Passion',     meaning:'We love what we do. Every campaign is crafted with genuine care.',      grad:'linear-gradient(135deg,#c026d3,#a78bfa)' },
  { letter:'A', word:'Ambition',    meaning:'We think big. Small goals don\'t inspire great work.',                  grad:'linear-gradient(135deg,#7c3aed,#818cf8)' },
  { letter:'P', word:'Prosperity',  meaning:'Your growth is our growth. We measure success by business outcomes.',   grad:'linear-gradient(135deg,#1d4ed8,#38bdf8)' },
  { letter:'E', word:'Enthusiasm',  meaning:'Energy is contagious — we bring it to every brief and meeting.',        grad:'linear-gradient(135deg,#0891b2,#34d399)' },
  { letter:'R', word:'Results',     meaning:'Everything we do is engineered to perform. ROI is the only metric.',    grad:'linear-gradient(135deg,#059669,#fbbf24)' },
];

function ServiceCard({ s, visible, delay }) {
  const [selected, setSelected] = useState('');
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (s.dropdown) {
      navigate(`/services/${s.slug}/${selected}`);
    } else {
      navigate(`/services/${s.slug}`);
    }
  };

  const canProceed = !s.dropdown || selected !== '';

  return (
    <div className="card" style={{ transition:'all .3s', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay:`${delay}s`, display:'flex', flexDirection:'column' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:'.65rem', letterSpacing:'.1em', color:'var(--muted)', marginBottom:'1.2rem' }}>{s.num}</div>
      <div style={{ width:44, height:44, borderRadius:12, background:s.color, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.2rem', fontSize:20 }}>{s.icon}</div>
      <div style={{ fontSize:'1rem', fontWeight:600, marginBottom:'.5rem', letterSpacing:'-.01em' }}>{s.name}</div>
      <div style={{ fontSize:'.83rem', color:'var(--muted)', lineHeight:1.7, flex:1, marginBottom:'.75rem' }}>{s.desc}</div>
      <div style={{ fontSize:'.78rem', color:'var(--muted)', marginBottom:'1rem', fontFamily:'var(--font-mono)' }}>
        Starting from <span style={{ fontWeight:700, color:s.stroke }}>{s.from}<span style={{ fontWeight:400, fontSize:'.7rem' }}>/mo</span></span>
      </div>

      {/* What's included — expandable */}
      {s.included && (
        <div style={{ marginBottom:'1rem' }}>
          <button type="button" onClick={() => setExpanded(v => !v)}
            style={{ display:'flex', alignItems:'center', gap:'.35rem', background:'none', border:'none', padding:0, fontSize:'.78rem', color:s.stroke, fontFamily:'var(--font-body)', cursor:'pointer' }}>
            {expanded ? 'Hide details' : "See what's included"}
            <span style={{ display:'inline-block', transition:'transform .15s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', fontSize:'.7rem' }}>▾</span>
          </button>
          {expanded && (
            <ul style={{ listStyle:'none', margin:'.6rem 0 0', padding:0, display:'flex', flexDirection:'column', gap:'.35rem' }}>
              {s.included.map((item, idx) => (
                <li key={idx} style={{ fontSize:'.78rem', color:'var(--muted)', lineHeight:1.5, display:'flex', alignItems:'baseline', gap:'.45rem' }}>
                  <span style={{ color:s.stroke, fontWeight:700 }}>✓</span>{item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Dropdown for website service */}
      {s.dropdown && (
        <div style={{ marginBottom:'1rem' }}>
          <label style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:'.65rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.4rem' }}>
            Select type
          </label>
          <select value={selected} onChange={e => setSelected(e.target.value)}
            style={{ width:'100%', padding:'.65rem 1rem', background:'var(--cream)', border:`1.5px solid ${selected ? s.stroke : 'var(--border)'}`, borderRadius:10, fontSize:'.88rem', outline:'none', fontFamily:'var(--font-body)', color: selected ? 'var(--ink)' : 'var(--muted)', cursor:'pointer', transition:'border-color .2s', appearance:'auto' }}>
            <option value="">Choose an option…</option>
            {s.dropdown.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Get started button — always show for non-dropdown, show only after selection for dropdown */}
      {canProceed && (
        <button onClick={handleGetStarted}
          style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', padding:'.6rem 1.2rem', background:'var(--ink)', color:'white', borderRadius:'100px', fontSize:'.82rem', fontWeight:600, border:'none', cursor:'pointer', transition:'all .25s', alignSelf:'flex-start', fontFamily:'var(--font-body)', animation: s.dropdown ? 'fadeUp .3s both' : 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = s.stroke}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}>
          Get started →
        </button>
      )}
    </div>
  );
}

function HeroSection({ scrollTo }) {
  const [typed, setTyped] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [countVals, setCountVals] = useState([0,0,0,0]);
  const words = ['Brands', 'Startups', 'Businesses', 'Products', 'Ideas'];
  const targets = [50, 320, 120, 15];
  const hasCountedRef = useRef(false);

  // Typewriter effect
  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!isDeleting && typed.length < current.length) {
      timeout = setTimeout(() => setTyped(current.slice(0, typed.length + 1)), 90);
    } else if (!isDeleting && typed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && typed.length > 0) {
      timeout = setTimeout(() => setTyped(current.slice(0, typed.length - 1)), 45);
    } else if (isDeleting && typed.length === 0) {
      setIsDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [typed, isDeleting, wordIdx]);

  // Counter animation on mount
  useEffect(() => {
    if (hasCountedRef.current) return;
    hasCountedRef.current = true;
    targets.forEach((target, i) => {
      let start = 0;
      const duration = 1800;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { start = target; clearInterval(timer); }
        setCountVals(prev => { const n = [...prev]; n[i] = Math.floor(start); return n; });
      }, 16);
    });
  }, []);

  const particles = Array.from({ length: 18 }, (_, i) => ({
    x: 10 + (i * 73) % 85,
    y: 5 + (i * 47) % 90,
    size: 2 + (i % 4),
    dur: 4 + (i % 6),
    delay: -(i * 0.7),
    color: ['#c026d3','#7c3aed','#1d4ed8','#0891b2','#059669','#f59e0b'][i % 6],
    opacity: 0.25 + (i % 4) * 0.12,
  }));

  return (
    <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'7rem 2rem 7rem', position:'relative', overflow:'hidden', background:'var(--cream)' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes floatUp{0%,100%{transform:translateY(0) scale(1);opacity:var(--op)}50%{transform:translateY(-18px) scale(1.15);opacity:calc(var(--op)*1.4)}}
        @keyframes cardFloat{0%,100%{transform:translateY(0) rotate(-0.8deg)}50%{transform:translateY(-10px) rotate(0.8deg)}}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes popIn{0%{opacity:0;transform:scale(0.5) translateY(10px)}70%{transform:scale(1.08) translateY(-2px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes slideRight{from{width:0}to{width:100%}}
        @keyframes orbitSpin{from{transform:rotate(0deg) translateX(110px) rotate(0deg)}to{transform:rotate(360deg) translateX(110px) rotate(-360deg)}}
        @keyframes orbitSpin2{from{transform:rotate(180deg) translateX(85px) rotate(-180deg)}to{transform:rotate(540deg) translateX(85px) rotate(-540deg)}}
        .hero-btn-primary:hover{background:#7c3aed!important;transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,.28)!important}
        .hero-btn-outline:hover{border-color:var(--ink)!important;color:var(--ink)!important;background:var(--cream2)!important}
        .stat-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(26,18,8,.1)!important}
      `}</style>

      {/* Animated dot grid background */}
      <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden' }}>
        {/* Grid dots */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(139,110,80,0.18) 1px, transparent 1px)', backgroundSize:'36px 36px', opacity:.6 }}/>

        {/* Floating particles */}
        {particles.map((p, i) => (
          <div key={i} style={{ position:'absolute', left:`${p.x}%`, top:`${p.y}%`, width:p.size, height:p.size, borderRadius:'50%', background:p.color, '--op': p.opacity, opacity:p.opacity, animation:`floatUp ${p.dur}s ease-in-out infinite`, animationDelay:`${p.delay}s`, pointerEvents:'none' }}/>
        ))}

        {/* Large soft background blobs */}
        <div style={{ position:'absolute', top:'-10%', right:'-5%', width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle, rgba(192,38,211,0.12) 0%, transparent 70%)' }}/>
        <div style={{ position:'absolute', bottom:'-5%', left:'-8%', width:440, height:440, borderRadius:'50%', background:'radial-gradient(circle, rgba(8,145,178,0.10) 0%, transparent 70%)' }}/>
        <div style={{ position:'absolute', top:'35%', left:'40%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }}/>
      </div>

      {/* Main content */}
      <div style={{ maxWidth:1100, width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', alignItems:'center', position:'relative', zIndex:2 }}>

        {/* LEFT — Text */}
        <div>
          {/* Live badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.1em', color:'#166534', background:'#dcfce7', border:'1px solid #bbf7d0', padding:'.4rem 1rem', borderRadius:'100px', marginBottom:'2rem', textTransform:'uppercase', animation:'fadeUp .6s .1s both' }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#059669', animation:'pulse 2s infinite', display:'inline-block' }}/>
            Now open for clients · paper5.co
          </div>

          {/* Headline with typewriter */}
          <div style={{ animation:'fadeUp .8s .25s both' }}>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.8rem,5.2vw,5rem)', fontWeight:400, lineHeight:1.06, letterSpacing:'-.03em', marginBottom:'1.4rem', color:'var(--ink)' }}>
              We grow
              <br/>
              <span style={{ display:'inline-flex', alignItems:'baseline', gap:'.2em' }}>
                <span style={{ background:'linear-gradient(135deg,#c026d3,#7c3aed,#1d4ed8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', fontStyle:'italic', fontWeight:300, minWidth:'4ch' }}>
                  {typed}
                </span>
                <span style={{ display:'inline-block', width:3, height:'0.85em', background:'linear-gradient(to bottom,#7c3aed,#1d4ed8)', borderRadius:2, marginLeft:2, animation:'blink 1s step-end infinite', verticalAlign:'baseline' }}/>
              </span>
              <br/>
              <span style={{ position:'relative', display:'inline-block' }}>
                digitally.
                <span style={{ position:'absolute', bottom:-2, left:0, right:0, height:5, borderRadius:'100px', background:'linear-gradient(to right,#f59e0b,#f97316)', animation:'slideRight 1.2s 1s both ease-out' }}/>
              </span>
            </h1>
          </div>

          {/* Sub */}
          <p style={{ color:'var(--muted)', fontSize:'1.05rem', lineHeight:1.8, maxWidth:440, marginBottom:'2.5rem', animation:'fadeUp .8s .45s both' }}>
            Paper5 is a results-driven digital marketing agency — <em style={{ fontStyle:'italic', color:'var(--ink2,#3d2f1e)' }}>passion</em>, <em style={{ fontStyle:'italic', color:'var(--ink2,#3d2f1e)' }}>ambition</em>, and relentless focus on growth. We turn clicks into clients.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center', animation:'fadeUp .8s .6s both' }}>
            <button onClick={() => scrollTo('#contact')} className="hero-btn-primary"
              style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'.9rem 2rem', background:'var(--ink)', color:'white', borderRadius:'100px', fontWeight:700, fontSize:'.95rem', border:'none', cursor:'pointer', transition:'all .25s', boxShadow:'0 4px 14px rgba(26,18,8,.15)', fontFamily:'var(--font-body)' }}>
              Start your journey →
            </button>
            <button onClick={() => scrollTo('#services')} className="hero-btn-outline"
              style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'.9rem 1.8rem', background:'transparent', color:'var(--muted)', borderRadius:'100px', fontWeight:500, fontSize:'.95rem', border:'1.5px solid var(--border)', cursor:'pointer', transition:'all .25s', fontFamily:'var(--font-body)' }}>
              Our services
            </button>
          </div>

          {/* Social proof row */}
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginTop:'2rem', animation:'fadeUp .8s .75s both' }}>
            <div style={{ display:'flex' }}>
              {['#c026d3','#7c3aed','#1d4ed8','#0891b2','#059669'].map((c,i) => (
                <div key={i} style={{ width:30, height:30, borderRadius:'50%', background:c, border:'2px solid var(--cream)', marginLeft: i===0 ? 0 : -8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white', fontFamily:'var(--font-mono)' }}>
                  {['P','A','P','E','R'][i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display:'flex', gap:2, marginBottom:2 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color:'#f59e0b', fontSize:13 }}>★</span>)}
              </div>
              <p style={{ fontSize:'.75rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>Trusted by 50+ clients across India</p>
            </div>
          </div>
        </div>

        {/* RIGHT — Logo + orbiting elements */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', animation:'fadeIn 1s .5s both', position:'relative' }}>

          {/* Outer decorative ring */}
          <div style={{ position:'absolute', width:280, height:280, borderRadius:'50%', border:'1px dashed rgba(139,110,80,0.2)' }}/>
          <div style={{ position:'absolute', width:340, height:340, borderRadius:'50%', border:'1px dashed rgba(139,110,80,0.12)' }}/>

          {/* Orbiting metric badges */}
          {[
            { label:'ROI', value:'320%', color:'#c026d3', bg:'#fdf2ff', border:'#f3b0ff', angle:0, r:160 },
            { label:'Clients', value:'50+', color:'#1d4ed8', bg:'#eff6ff', border:'#bfdbfe', angle:90, r:160 },
            { label:'Campaigns', value:'120+', color:'#059669', bg:'#ecfdf5', border:'#6ee7b7', angle:180, r:160 },
            { label:'Industries', value:'15', color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', angle:270, r:160 },
          ].map((item, i) => {
            const rad = (item.angle * Math.PI) / 180;
            const x = Math.cos(rad) * item.r;
            const y = Math.sin(rad) * item.r;
            return (
              <div key={i} style={{ position:'absolute', left:`calc(50% + ${x}px)`, top:`calc(50% + ${y}px)`, transform:'translate(-50%,-50%)', background:item.bg, border:`1px solid ${item.border}`, borderRadius:12, padding:'.5rem .9rem', textAlign:'center', animation:`fadeIn 1s ${1 + i * 0.15}s both`, boxShadow:'0 2px 12px rgba(26,18,8,.07)', minWidth:72, zIndex:3 }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.25rem', fontWeight:700, color:item.color, lineHeight:1 }}>{item.value}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'.6rem', letterSpacing:'.08em', textTransform:'uppercase', color:item.color, opacity:.7, marginTop:2 }}>{item.label}</div>
              </div>
            );
          })}

          {/* Center logo card */}
          <div style={{ background:'white', borderRadius:28, padding:'2.5rem', boxShadow:'0 8px 40px rgba(26,18,8,.12), 0 0 0 1px rgba(139,110,80,.08)', animation:'cardFloat 6s ease-in-out infinite', position:'relative', zIndex:2 }}>
            {/* Animated ring around card */}
            <div style={{ position:'absolute', inset:-12, borderRadius:40, border:'1.5px solid', borderColor:'transparent', background:'linear-gradient(135deg,rgba(192,38,211,.2),rgba(29,78,216,.2),rgba(5,150,105,.2)) border-box', WebkitMask:'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite:'destination-out', maskComposite:'exclude', animation:'spinSlow 8s linear infinite' }}/>
            <Logo5 size={220} />
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div style={{ position:'absolute', bottom:'2rem', left:'50%', transform:'translateX(-50%)', display:'flex', background:'white', borderRadius:20, boxShadow:'0 4px 24px rgba(26,18,8,.09), 0 0 0 1px var(--border)', overflow:'hidden', zIndex:2, animation:'fadeUp 1s 1.1s both', whiteSpace:'nowrap' }}>
        {[
          { n: countVals[0], suffix:'+', label:'Happy clients', color:'#c026d3' },
          { n: countVals[1], suffix:'%', label:'Avg. ROI boost', color:'#7c3aed' },
          { n: countVals[2], suffix:'+', label:'Campaigns run', color:'#1d4ed8' },
          { n: countVals[3], suffix:'',  label:'Industries served', color:'#059669' },
        ].map(({ n, suffix, label, color }, i) => (
          <div key={i} className="stat-card" style={{ textAlign:'center', padding:'1rem 2rem', borderRight: i < 3 ? '1px solid var(--border)' : 'none', transition:'all .25s', cursor:'default' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.9rem', fontWeight:700, color, lineHeight:1.1 }}>{n}{suffix}</div>
            <div style={{ fontSize:'.68rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', marginTop:'.25rem', fontFamily:'var(--font-mono)' }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [form, setForm] = useState({ name:'', email:'', company:'', service:'', message:'' });
  const [submitting, setSubmitting] = useState(false);
  const [svcRef, svcVisible] = useScrollReveal();
  const [aboutRef, aboutVisible] = useScrollReveal();
  const [processRef, processVisible] = useScrollReveal();

  const scrollTo = (hash) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/contact', form);
      toast.success('Message sent! We\'ll be in touch within 24 hours.');
      setForm({ name:'', email:'', company:'', service:'', message:'' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />

      {/* HERO */}
      <HeroSection scrollTo={scrollTo} />

      {/* MARQUEE */}
      <div style={{ background:'var(--ink)', padding:'.85rem 0', overflow:'hidden', whiteSpace:'nowrap' }}>
        <div style={{ display:'inline-flex', animation:'marquee 22s linear infinite' }}>
          {['SEO','Social Media','Website Design','Paid Ads','Google Ads','Meta Ads','Instagram Marketing','Local SEO','Landing Pages','Link Building','Reels & Shorts','Brand Strategy','SEO','Social Media','Website Design','Paid Ads','Google Ads','Meta Ads','Instagram Marketing','Local SEO','Landing Pages','Link Building','Reels & Shorts','Brand Strategy'].map((item,i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'.75rem', padding:'0 2.5rem', fontFamily:'var(--font-mono)', fontSize:'.73rem', letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,.65)' }}>
              <span style={{ width:4, height:4, borderRadius:'50%', background:['#c026d3','#7c3aed','#1d4ed8','#0891b2','#059669','#f59e0b'][i%6], display:'inline-block', flexShrink:0 }}/>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" style={{ padding:'7rem 2rem', maxWidth:'1200px', margin:'0 auto' }} ref={svcRef}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', fontFamily:'var(--font-mono)', fontSize:'.7rem', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'1rem' }}>
          <span style={{ width:24, height:2, background:'linear-gradient(to right,#7c3aed,#1d4ed8)', borderRadius:2, display:'inline-block' }}/>
          What we do
        </div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.2rem,4vw,3.4rem)', fontWeight:400, lineHeight:1.12, letterSpacing:'-.03em', marginBottom:'3.5rem', maxWidth:560 }}>
          Full-spectrum digital <em style={{ fontStyle:'italic', fontWeight:300, background:'linear-gradient(135deg,#0891b2,#059669)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>marketing</em>
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.4rem' }}>
          {services.map((s, i) => (
            <ServiceCard key={i} s={s} visible={svcVisible} delay={i * 0.07} />
          ))}
        </div>
      </section>

      {/* ABOUT / ACRONYM */}
      <section id="about" style={{ padding:'7rem 2rem', background:'var(--cream2)' }} ref={aboutRef}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6rem', alignItems:'start' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', fontFamily:'var(--font-mono)', fontSize:'.7rem', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'1rem' }}>
              <span style={{ width:24, height:2, background:'linear-gradient(to right,#7c3aed,#1d4ed8)', borderRadius:2, display:'inline-block' }}/>
              The name
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.2rem,4vw,3.4rem)', fontWeight:400, lineHeight:1.12, letterSpacing:'-.03em', marginBottom:'2rem' }}>
              What <em style={{ fontStyle:'italic', fontWeight:300, background:'linear-gradient(135deg,#0891b2,#059669)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>PAPER</em> stands for
            </h2>
            {acronym.map((a, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'1.5rem', padding:'1.5rem 0', borderBottom:'1px solid var(--border)', borderTop: i===0 ? '1px solid var(--border)' : 'none', opacity: aboutVisible ? 1 : 0, transform: aboutVisible ? 'translateX(0)' : 'translateX(-16px)', transition:`opacity .5s ${i*.08}s, transform .5s ${i*.08}s` }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'2.8rem', fontWeight:700, lineHeight:1, minWidth:44, background:a.grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{a.letter}</div>
                <div>
                  <div style={{ fontSize:'.95rem', fontWeight:600, marginBottom:'.3rem' }}>{a.word}</div>
                  <div style={{ fontSize:'.82rem', color:'var(--muted)', lineHeight:1.65 }}>{a.meaning}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ opacity: aboutVisible ? 1 : 0, transform: aboutVisible ? 'translateY(0)' : 'translateY(20px)', transition:'opacity .6s .3s, transform .6s .3s' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', fontFamily:'var(--font-mono)', fontSize:'.7rem', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'1rem' }}>
              <span style={{ width:24, height:2, background:'linear-gradient(to right,#7c3aed,#1d4ed8)', borderRadius:2, display:'inline-block' }}/>
              Who we are
            </div>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.7rem,2.8vw,2.4rem)', fontWeight:400, fontStyle:'italic', lineHeight:1.3, marginBottom:'1.5rem' }}>"Marketing is no longer about the stuff you make, but the stories you tell."</p>
            <p style={{ color:'var(--muted)', fontSize:'.9rem', lineHeight:1.85, marginBottom:'1.2rem' }}>Paper5 is a new-age digital marketing agency founded with one belief: great marketing should feel human, move fast, and deliver measurable results. Based in Ludhiana, we partner with ambitious brands across India.</p>
            <p style={{ color:'var(--muted)', fontSize:'.9rem', lineHeight:1.85, marginBottom:'1.5rem' }}>Whether you're a startup looking for your first 1,000 customers or an established business ready to scale — we have the strategy and the passion to get you there.</p>
            <span style={{ display:'inline-block', fontFamily:'var(--font-mono)', fontSize:'.78rem', letterSpacing:'.08em', color:'#1d4ed8', background:'#eff6ff', border:'1px solid #bfdbfe', padding:'.4rem 1rem', borderRadius:'100px' }}>↗ paper5.co</span>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.8rem', marginTop:'2rem' }}>
              {[['50+','Happy clients across India'],['320%','Average ROI improvement'],['15','Industries served'],['24h','Response guarantee']].map(([n,l],i) => (
                <div key={i} className="card" style={{ padding:'1.2rem' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:700, background:'linear-gradient(135deg,#c026d3,#1d4ed8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }}>{n}</div>
                  <div style={{ fontSize:'.75rem', color:'var(--muted)', marginTop:'.3rem', lineHeight:1.4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{ padding:'7rem 2rem', maxWidth:'1200px', margin:'0 auto' }} ref={processRef}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', fontFamily:'var(--font-mono)', fontSize:'.7rem', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'1rem' }}>
          <span style={{ width:24, height:2, background:'linear-gradient(to right,#7c3aed,#1d4ed8)', borderRadius:2, display:'inline-block' }}/>
          How we work
        </div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.2rem,4vw,3.4rem)', fontWeight:400, lineHeight:1.12, letterSpacing:'-.03em', marginBottom:'3.5rem' }}>
          From brief to <em style={{ fontStyle:'italic', fontWeight:300, background:'linear-gradient(135deg,#0891b2,#059669)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>results</em>
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'1rem', position:'relative' }}>
          <div style={{ position:'absolute', top:28, left:'5%', right:'5%', height:1.5, background:'linear-gradient(to right,#c026d3,#7c3aed,#1d4ed8,#0891b2,#059669)', borderRadius:2, zIndex:0 }}/>
          {[['01','Discovery','We learn your brand, audience, goals and competition.','linear-gradient(135deg,#c026d3,#7c3aed)','white'],['02','Strategy','A tailored roadmap with clear KPIs and timelines.','linear-gradient(135deg,#7c3aed,#1d4ed8)','white'],['03','Execute','Creative campaigns launched with precision.','linear-gradient(135deg,#1d4ed8,#0891b2)','white'],['04','Optimise','Continuous A/B testing and refinement.','linear-gradient(135deg,#0891b2,#059669)','white'],['05','Scale','What works gets amplified every month.','linear-gradient(135deg,#059669,#f59e0b)','var(--ink)']].map(([n,name,desc,bg,color], i) => (
            <div key={i} style={{ textAlign:'center', position:'relative', zIndex:1, opacity: processVisible ? 1 : 0, transform: processVisible ? 'translateY(0)' : 'translateY(14px)', transition:`opacity .5s ${i*.1}s, transform .5s ${i*.1}s` }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.4rem', fontFamily:'var(--font-mono)', fontSize:'.72rem', border:'2px solid white', boxShadow:'0 4px 14px rgba(0,0,0,.1)' }}>{n}</div>
              <div style={{ fontSize:'.9rem', fontWeight:600, marginBottom:'.4rem' }}>{name}</div>
              <div style={{ fontSize:'.78rem', color:'var(--muted)', lineHeight:1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG TEASER */}
      <section style={{ padding:'5rem 2rem', background:'var(--cream2)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:400, letterSpacing:'-.03em' }}>
              From the <em style={{ fontStyle:'italic', fontWeight:300, background:'linear-gradient(135deg,#c026d3,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>blog</em>
            </h2>
            <Link to="/blog" className="btn btn-outline btn-sm">View all posts →</Link>
          </div>
          <BlogTeaser />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CONTACT */}
      <section id="contact" style={{ padding:'7rem 2rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-200px', left:'50%', transform:'translateX(-50%)', width:800, height:800, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,.06) 0%,transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:680, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', fontFamily:'var(--font-mono)', fontSize:'.7rem', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'1rem', justifyContent:'center' }}>
            <span style={{ width:24, height:2, background:'linear-gradient(to right,#7c3aed,#1d4ed8)', borderRadius:2, display:'inline-block' }}/>
            Get in touch
          </div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.6rem,5vw,4.2rem)', fontWeight:400, lineHeight:1.25, letterSpacing:'-.03em', marginBottom:'1.2rem' }}>
            Ready to <em style={{ fontStyle:'italic', fontWeight:300, background:'linear-gradient(135deg,#7c3aed,#1d4ed8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', display:'inline-block', paddingTop:'0.15em', lineHeight:1 }}>grow?</em>
          </h2>
          <p style={{ color:'var(--muted)', fontSize:'1rem', lineHeight:1.75, marginBottom:'2.5rem' }}>Tell us about your brand. We'll get back to you within 24 hours with a plan tailored just for you.</p>

          <form onSubmit={handleSubmit} style={{ background:'white', borderRadius:24, padding:'2.5rem', textAlign:'left', border:'1px solid var(--border)', boxShadow:'0 4px 30px rgba(26,18,8,.06)' }}>
            <div className="form-row">
              <div className="form-group"><label>Your name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Rahul Sharma" required/></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="rahul@company.com" required/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Company</label><input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="Your company"/></div>
              <div className="form-group"><label>Service</label>
                <select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                  <option value="">Select a service</option>
                  {['SEO','Social Media Marketing','Website — WordPress','Website — Full Stack','Paid Advertising','Full Package'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label>Your goals</label><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="We want to grow our online sales..." required/></div>
            <div style={{ display:'flex', justifyContent:'center', marginTop:'.5rem' }}>
              <button type="submit" className="btn btn-dark" disabled={submitting} style={{ opacity: submitting ? .7 : 1 }}>
                {submitting ? 'Sending…' : 'Send message →'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'var(--ink)', padding:'2.5rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:700, color:'white', letterSpacing:'-.02em' }}>paper5</div>
        <p style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', fontFamily:'var(--font-mono)' }}>© 2026 Paper5 · paper5.co</p>
        <div style={{ display:'flex', gap:'2rem' }}>
          {[['#services','Services'],['#about','About'],['/blog','Blog'],['/portfolio','Portfolio'],['/faq','FAQ'],['/careers','Careers'],['#contact','Contact']].map(([href,label])=>(
            href.startsWith('#')
              ? <button key={href} onClick={() => scrollTo(href)} style={{ fontSize:'.78rem', color:'rgba(255,255,255,.5)', fontFamily:'var(--font-mono)', letterSpacing:'.04em', background:'none', border:'none', cursor:'pointer', transition:'color .2s' }}
                  onMouseEnter={e=>e.target.style.color='white'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,.5)'}>{label}</button>
              : <Link key={href} to={href} style={{ fontSize:'.78rem', color:'rgba(255,255,255,.5)', fontFamily:'var(--font-mono)', letterSpacing:'.04em', transition:'color .2s' }}
                  onMouseEnter={e=>e.target.style.color='white'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,.5)'}>{label}</Link>
          ))}
        </div>
      </footer>


 
    </div>
  );
}

function BlogTeaser() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.get('/api/posts?limit=3').then(r => setPosts(r.data.posts)).catch(()=>{});
  }, []);
  if (!posts.length) return <p style={{ color:'var(--muted)', fontSize:'.9rem' }}>No posts yet — publish your first one from the admin dashboard.</p>;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.2rem' }}>
      {posts.map(p => (
        <Link key={p._id} to={`/blog/${p.slug}`} className="card" style={{ display:'block', transition:'all .3s' }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(26,18,8,.1)';}}
          onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
          <span className={`badge badge-${p.status}`} style={{ marginBottom:'.8rem' }}>{p.category}</span>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:400, letterSpacing:'-.02em', marginBottom:'.5rem', lineHeight:1.3 }}>{p.title}</h3>
          <p style={{ fontSize:'.82rem', color:'var(--muted)', lineHeight:1.65, marginBottom:'1rem' }}>{p.excerpt.substring(0,100)}…</p>
          <span style={{ fontSize:'.78rem', color:'var(--p2)', fontWeight:600 }}>Read more →</span>
        </Link>
      ))}
    </div>
  );
}
