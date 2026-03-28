import React, { useState } from 'react';

const testimonials = [
  {
    name:    'Priya Sharma',
    role:    'Founder, Bloom Boutique',
    city:    'Ludhiana',
    avatar:  'PS',
    grad:    'linear-gradient(135deg,#c026d3,#a78bfa)',
    rating:  5,
    text:    'Paper5 transformed our Instagram presence completely. In just 3 months our following grew from 800 to over 12,000 and our online sales doubled. The team is passionate, responsive and genuinely cares about results.',
  },
  {
    name:    'Rajat Mehta',
    role:    'CEO, TechNova Solutions',
    city:    'Chandigarh',
    avatar:  'RM',
    grad:    'linear-gradient(135deg,#1d4ed8,#38bdf8)',
    rating:  5,
    text:    'We hired Paper5 for SEO and within 6 months we were ranking on page 1 for our top 5 keywords. The transparency in reporting is unlike any agency we\'ve worked with before. Highly recommended.',
  },
  {
    name:    'Ananya Kapoor',
    role:    'Marketing Head, FreshMart',
    city:    'Amritsar',
    avatar:  'AK',
    grad:    'linear-gradient(135deg,#059669,#34d399)',
    rating:  5,
    text:    'Our Google Ads ROI went from 1.8x to 5.2x after Paper5 took over. They A/B tested everything, tightened our targeting, and the results speak for themselves. Best investment we made this year.',
  },
];

const Stars = ({ count }) => (
  <div style={{ display:'flex', gap:2, marginBottom:'.75rem' }}>
    {Array.from({length:5}).map((_,i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i<count ? '#f59e0b' : '#e5e7eb'}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
);

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section style={{ padding:'7rem 2rem', background:'var(--cream)' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', fontFamily:'var(--font-mono)', fontSize:'.7rem', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'1rem' }}>
          <span style={{ width:24, height:2, background:'linear-gradient(to right,#7c3aed,#1d4ed8)', borderRadius:2, display:'inline-block' }}/>
          What clients say
        </div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.2rem,4vw,3.4rem)', fontWeight:400, lineHeight:1.12, letterSpacing:'-.03em', marginBottom:'3rem', maxWidth:560 }}>
          Real results, real{' '}
          <em style={{ fontStyle:'italic', fontWeight:300, background:'linear-gradient(135deg,#c026d3,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>people</em>
        </h2>

        {/* Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.2rem', marginBottom:'2rem' }}>
          {testimonials.map((t, i) => (
            <div key={i}
              onClick={() => setActive(i)}
              style={{
                background: 'white', borderRadius:20, padding:'1.8rem',
                border: `1.5px solid ${active===i ? '#7c3aed' : 'var(--border)'}`,
                cursor:'pointer', transition:'all .3s',
                boxShadow: active===i ? '0 8px 30px rgba(124,58,237,.12)' : 'none',
                transform: active===i ? 'translateY(-3px)' : 'none',
              }}>
              <Stars count={t.rating}/>
              <p style={{ fontSize:'.88rem', color:'var(--ink)', lineHeight:1.75, marginBottom:'1.2rem', fontStyle:'italic' }}>
                "{t.text}"
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:t.grad, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontSize:'.75rem', fontWeight:700, color:'white', fontFamily:'var(--font-mono)' }}>{t.avatar}</span>
                </div>
                <div>
                  <p style={{ fontSize:'.88rem', fontWeight:600, lineHeight:1.2 }}>{t.name}</p>
                  <p style={{ fontSize:'.75rem', color:'var(--muted)' }}>{t.role} · {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display:'flex', gap:'.5rem', justifyContent:'center' }}>
          {testimonials.map((_,i) => (
            <button key={i} onClick={()=>setActive(i)} style={{ width: active===i ? 24 : 8, height:8, borderRadius:100, border:'none', cursor:'pointer', transition:'all .3s', background: active===i ? '#7c3aed' : 'var(--warm,#ede0cc)' }}/>
          ))}
        </div>
      </div>
    </section>
  );
}
