import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 80 80" fill="none">
    <defs>
      <linearGradient id="ln1" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#c026d3"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
      <linearGradient id="ln2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#818cf8"/></linearGradient>
      <linearGradient id="ln3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#1d4ed8"/><stop offset="100%" stopColor="#38bdf8"/></linearGradient>
      <linearGradient id="ln4" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#0891b2"/><stop offset="100%" stopColor="#34d399"/></linearGradient>
      <linearGradient id="ln5" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#059669"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient>
    </defs>
    <g transform="rotate(-22,36,70)" opacity="0.72"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#ln1)"/></g>
    <g transform="rotate(-11,36,70)" opacity="0.85"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#ln2)"/></g>
    <rect x="36" y="16" width="24" height="32" rx="3.5" fill="url(#ln3)"/>
    <g transform="rotate(11,36,70)" opacity="0.85"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#ln4)"/></g>
    <g transform="rotate(22,36,70)" opacity="0.72"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#ln5)"/></g>
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Handle hash scroll after route change
  useEffect(() => {
    setMenuOpen(false);
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, [location]);

  const scrollTo = (hash) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: 'Services',  action: () => scrollTo('#services') },
    { label: 'Portfolio', path:   '/portfolio'                },
    { label: 'Blog',      path:   '/blog'                     },
    { label: 'FAQ',       path:   '/faq'                      },
    { label: 'Careers',   path:   '/careers'                  },
    { label: 'Contact',   action: () => scrollTo('#contact')  },
  ];

  const baseLink = { color:'var(--muted)', fontSize:'.85rem', fontWeight:500, transition:'color .2s', textDecoration:'none', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)', padding:0 };

  return (
    <>
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:500, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 2rem', transition:'all .3s', background: scrolled ? 'rgba(253,246,238,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none', boxShadow: scrolled ? '0 1px 0 rgba(139,110,80,0.15)' : 'none' }}>

        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'.6rem', textDecoration:'none' }}>
          <Logo />
          <span style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, color:'var(--ink)', letterSpacing:'-.03em' }}>paper5</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display:'flex', gap:'2rem', alignItems:'center' }}>
          {navLinks.map(link => (
            link.path
              ? <Link key={link.label} to={link.path} style={baseLink}
                  onMouseEnter={e=>e.target.style.color='var(--ink)'}
                  onMouseLeave={e=>e.target.style.color='var(--muted)'}>
                  {link.label}
                </Link>
              : <button key={link.label} onClick={link.action} style={baseLink}
                  onMouseEnter={e=>e.target.style.color='var(--ink)'}
                  onMouseLeave={e=>e.target.style.color='var(--muted)'}>
                  {link.label}
                </button>
          ))}
        </div>

        <button onClick={() => scrollTo('#contact')}
          style={{ background:'var(--ink)', color:'white', padding:'.55rem 1.3rem', borderRadius:'100px', fontSize:'.82rem', fontWeight:600, border:'none', cursor:'pointer', fontFamily:'var(--font-body)', transition:'all .25s' }}
          onMouseEnter={e=>e.currentTarget.style.background='#7c3aed'}
          onMouseLeave={e=>e.currentTarget.style.background='var(--ink)'}>
          Start a project →
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position:'fixed', inset:0, background:'var(--cream)', zIndex:400, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2rem' }}>
          <button onClick={() => setMenuOpen(false)} style={{ position:'absolute', top:'1.4rem', right:'1.5rem', background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', color:'var(--ink)' }}>✕</button>
          {navLinks.map(link => (
            link.path
              ? <Link key={link.label} to={link.path} onClick={() => setMenuOpen(false)}
                  style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:400, color:'var(--ink)', textDecoration:'none' }}>
                  {link.label}
                </Link>
              : <button key={link.label} onClick={link.action}
                  style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:400, color:'var(--ink)', background:'none', border:'none', cursor:'pointer' }}>
                  {link.label}
                </button>
          ))}
        </div>
      )}
    </>
  );
}
