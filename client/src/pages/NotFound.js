import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Logo5 = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 680 480" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g1" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#c026d3"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
      <linearGradient id="g2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#818cf8"/></linearGradient>
      <linearGradient id="g3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#1d4ed8"/><stop offset="100%" stopColor="#38bdf8"/></linearGradient>
      <linearGradient id="g4" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#0891b2"/><stop offset="100%" stopColor="#34d399"/></linearGradient>
      <linearGradient id="g5" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#059669"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient>
      <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.2)"/><stop offset="40%" stopColor="rgba(255,255,255,0)"/></linearGradient>
    </defs>
    <g transform="rotate(-22,300,300)" opacity="0.72"><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#g1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#shine)"/><text x="314" y="204" fontFamily="Helvetica Neue,sans-serif" fontSize="18" fontWeight="300" fill="rgba(255,255,255,0.85)">P</text></g>
    <g transform="rotate(-11,300,300)" opacity="0.85"><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#g2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#shine)"/><text x="314" y="204" fontFamily="Helvetica Neue,sans-serif" fontSize="18" fontWeight="300" fill="rgba(255,255,255,0.88)">A</text></g>
    <rect x="300" y="176" width="90" height="122" rx="12" fill="url(#g3)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8"/><rect x="300" y="176" width="90" height="122" rx="12" fill="url(#shine)"/><text x="315" y="199" fontFamily="Helvetica Neue,sans-serif" fontSize="19" fontWeight="300" fill="rgba(255,255,255,0.95)">P</text>
    <g transform="rotate(11,300,300)" opacity="0.85"><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#g4)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#shine)"/><text x="314" y="204" fontFamily="Helvetica Neue,sans-serif" fontSize="18" fontWeight="300" fill="rgba(255,255,255,0.88)">E</text></g>
    <g transform="rotate(22,300,300)" opacity="0.72"><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#g5)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><rect x="300" y="182" width="84" height="114" rx="11" fill="url(#shine)"/><text x="314" y="204" fontFamily="Helvetica Neue,sans-serif" fontSize="18" fontWeight="300" fill="rgba(255,255,255,0.85)">R</text></g>
  </svg>
);

const SUGGESTIONS = [
  { label: 'Home',        path: '/',          icon: '🏠' },
  { label: 'Services',    path: '/#services', icon: '⚡' },
  { label: 'Portfolio',   path: '/portfolio', icon: '📁' },
  { label: 'Blog',        path: '/blog',      icon: '✍️' },
  { label: 'FAQ',         path: '/faq',       icon: '❓' },
  { label: 'Contact',     path: '/#contact',  icon: '✉️' },
];

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);
  const [hovered, setHovered] = useState(null);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) { navigate('/'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'hidden', position: 'relative', fontFamily: 'var(--font-body)' }}>

      <style>{`
        @keyframes floatUpDown { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-16px) rotate(1deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse404 { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes particleDrift { 0%,100%{transform:translateY(0) scale(1);opacity:0.2} 50%{transform:translateY(-22px) scale(1.2);opacity:0.5} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes countdownShrink { from{transform:scaleX(1)} to{transform:scaleX(0)} }
        .suggest-card:hover { transform: translateY(-3px) !important; border-color: #7c3aed !important; }
      `}</style>

      {/* Background particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${8 + (i * 79) % 88}%`,
          top: `${5 + (i * 53) % 85}%`,
          width: 3 + (i % 3),
          height: 3 + (i % 3),
          borderRadius: '50%',
          background: ['#c026d3','#7c3aed','#1d4ed8','#0891b2','#059669','#f59e0b'][i % 6],
          opacity: 0.2,
          animation: `particleDrift ${4 + i % 5}s ease-in-out infinite`,
          animationDelay: `${-(i * 0.6)}s`,
          pointerEvents: 'none',
        }}/>
      ))}

      {/* Spinning decorative ring */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', border: '1px dashed rgba(139,110,80,0.15)', animation: 'spin 40s linear infinite', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', border: '1px dashed rgba(139,110,80,0.1)', animation: 'spin 25s linear infinite reverse', pointerEvents: 'none' }}/>

      {/* Logo */}
      <div style={{ animation: 'floatUpDown 6s ease-in-out infinite', marginBottom: '1.5rem' }}>
        <Logo5 size={110} />
      </div>

      {/* 404 big number */}
      <div style={{ position: 'relative', marginBottom: '1rem', animation: 'fadeUp .7s .1s both' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(7rem, 18vw, 14rem)',
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.05em',
          background: 'linear-gradient(135deg, #c026d3, #7c3aed, #1d4ed8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'pulse404 4s ease-in-out infinite',
          userSelect: 'none',
        }}>
          404
        </div>
        {/* Shadow text behind */}
        <div style={{
          position: 'absolute', top: 6, left: 6, zIndex: -1,
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(7rem, 18vw, 14rem)',
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.05em',
          color: 'rgba(139,110,80,0.08)',
          userSelect: 'none',
        }}>
          404
        </div>
      </div>

      {/* Message */}
      <div style={{ textAlign: 'center', maxWidth: 500, animation: 'fadeUp .7s .2s both', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 400, letterSpacing: '-.03em', marginBottom: '.75rem', color: 'var(--ink)' }}>
          Oops! This page went{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, background: 'linear-gradient(135deg,#f59e0b,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            missing.
          </em>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.75 }}>
          The page you're looking for doesn't exist, was moved, or the URL was mistyped. Don't worry — here are some places you can go instead.
        </p>
      </div>

      {/* Suggestion cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', maxWidth: 520, width: '100%', animation: 'fadeUp .7s .35s both', marginBottom: '2.5rem' }}>
        {SUGGESTIONS.map((s, i) => (
          <Link key={i} to={s.path}
            className="suggest-card"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem',
              padding: '.9rem .75rem',
              background: 'white',
              border: `1.5px solid ${hovered === i ? '#7c3aed' : 'var(--border)'}`,
              borderRadius: 14,
              textDecoration: 'none',
              color: 'var(--ink)',
              fontSize: '.82rem',
              fontWeight: 500,
              transition: 'all .2s',
              transform: hovered === i ? 'translateY(-3px)' : 'none',
            }}>
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            {s.label}
          </Link>
        ))}
      </div>

      {/* Primary CTA */}
      <div style={{ animation: 'fadeUp .7s .5s both', marginBottom: '2rem' }}>
        <Link to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.9rem 2rem', background: 'var(--ink)', color: 'white', borderRadius: '100px', fontWeight: 700, fontSize: '.95rem', textDecoration: 'none', transition: 'all .25s', boxShadow: '0 4px 14px rgba(26,18,8,.12)' }}
          onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}>
          ← Take me home
        </Link>
      </div>

      {/* Auto redirect countdown */}
      <div style={{ animation: 'fadeUp .7s .65s both', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.72rem', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: '.5rem' }}>
          Redirecting to home in <strong style={{ color: 'var(--ink)' }}>{countdown}s</strong>
        </p>
        <div style={{ width: 200, height: 3, background: 'var(--cream3)', borderRadius: 2, overflow: 'hidden', margin: '0 auto' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(to right, #7c3aed, #1d4ed8)',
            borderRadius: 2,
            animation: `countdownShrink ${15}s linear forwards`,
            transformOrigin: 'left',
          }}/>
        </div>
      </div>

      {/* Footer brand */}
      <div style={{ position: 'absolute', bottom: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--muted)', opacity: .4, letterSpacing: '-.02em' }}>
        paper5
      </div>
    </div>
  );
}
