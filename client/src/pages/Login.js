import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 80 80" fill="none">
    <defs>
      <linearGradient id="ll1" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#c026d3"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
      <linearGradient id="ll2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#818cf8"/></linearGradient>
      <linearGradient id="ll3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#1d4ed8"/><stop offset="100%" stopColor="#38bdf8"/></linearGradient>
      <linearGradient id="ll4" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#0891b2"/><stop offset="100%" stopColor="#34d399"/></linearGradient>
      <linearGradient id="ll5" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#059669"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient>
    </defs>
    <g transform="rotate(-22,36,70)" opacity="0.72"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#ll1)"/></g>
    <g transform="rotate(-11,36,70)" opacity="0.85"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#ll2)"/></g>
    <rect x="36" y="16" width="24" height="32" rx="3.5" fill="url(#ll3)"/>
    <g transform="rotate(11,36,70)" opacity="0.85"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#ll4)"/></g>
    <g transform="rotate(22,36,70)" opacity="0.72"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#ll5)"/></g>
  </svg>
);

export default function Login() {
  const [tab, setTab]       = useState('login');  // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const [loginForm,    setLoginForm]    = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [forgotEmail,  setForgotEmail]  = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // ── Login ──────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  // ── Register ───────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirm) {
      toast.error('Passwords do not match'); return;
    }
    if (registerForm.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      await register(registerForm.name, registerForm.email, registerForm.password);
      toast.success('Account created! Welcome to Paper5.');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  // ── Forgot password ────────────────────────────────────────────────────
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const inputStyle = { width:'100%', padding:'.8rem 1rem', background:'var(--cream)', border:'1.5px solid var(--border)', borderRadius:10, fontSize:'.9rem', outline:'none', fontFamily:'var(--font-body)', color:'var(--ink)', transition:'border-color .2s' };
  const labelStyle = { display:'block', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.4rem' };

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ width:'100%', maxWidth:440 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:'.6rem', textDecoration:'none', marginBottom:'1rem' }}>
            <Logo />
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:700, color:'var(--ink)', letterSpacing:'-.03em' }}>paper5</span>
          </Link>
          <p style={{ color:'var(--muted)', fontSize:'.88rem' }}>Admin panel</p>
        </div>

        <div className="card" style={{ padding:'2rem' }}>

          {/* Tabs */}
          {tab !== 'forgot' && (
            <div style={{ display:'flex', background:'var(--cream2)', borderRadius:10, padding:4, marginBottom:'1.5rem' }}>
              {[['login','Sign in'],['register','Create account']].map(([key,label]) => (
                <button key={key} onClick={() => setTab(key)}
                  style={{ flex:1, padding:'.6rem', borderRadius:8, border:'none', cursor:'pointer', fontSize:'.85rem', fontWeight:600, fontFamily:'var(--font-body)', transition:'all .2s', background: tab===key ? 'white' : 'transparent', color: tab===key ? 'var(--ink)' : 'var(--muted)', boxShadow: tab===key ? '0 1px 4px rgba(26,18,8,.08)' : 'none' }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* ── Login form ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label style={labelStyle}>Email</label>
                <input type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email:e.target.value})}
                  placeholder="admin@paper5.co" required style={inputStyle}
                  onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              </div>
              <div className="form-group" style={{ position:'relative' }}>
                <label style={labelStyle}>Password</label>
                <input type={showPass ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm({...loginForm, password:e.target.value})}
                  placeholder="••••••••" required style={inputStyle}
                  onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:12, top:36, background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:13, fontFamily:'var(--font-mono)' }}>
                  {showPass ? 'hide' : 'show'}
                </button>
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1rem', marginTop:'-.5rem' }}>
                <button type="button" onClick={() => setTab('forgot')}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'#7c3aed', fontSize:'.82rem', fontWeight:600, fontFamily:'var(--font-body)', padding:0 }}>
                  Forgot password?
                </button>
              </div>
              <button type="submit" disabled={loading}
                style={{ width:'100%', padding:'.9rem', background: loading ? 'var(--cream3)' : 'var(--ink)', color: loading ? 'var(--muted)' : 'white', border:'none', borderRadius:'100px', fontSize:'.95rem', fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'var(--font-body)', transition:'background .25s' }}
                onMouseEnter={e=>{ if(!loading) e.target.style.background='#7c3aed'; }}
                onMouseLeave={e=>{ if(!loading) e.target.style.background='var(--ink)'; }}>
                {loading ? 'Signing in…' : 'Sign in →'}
              </button>
            </form>
          )}

          {/* ── Register form ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label style={labelStyle}>Full name</label>
                <input value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name:e.target.value})}
                  placeholder="Harshpal Singh" required style={inputStyle}
                  onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              </div>
              <div className="form-group">
                <label style={labelStyle}>Email</label>
                <input type="email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email:e.target.value})}
                  placeholder="you@paper5.co" required style={inputStyle}
                  onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              </div>
              <div className="form-group" style={{ position:'relative' }}>
                <label style={labelStyle}>Password</label>
                <input type={showPass ? 'text' : 'password'} value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password:e.target.value})}
                  placeholder="Min. 6 characters" required style={inputStyle}
                  onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:12, top:36, background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:13, fontFamily:'var(--font-mono)' }}>
                  {showPass ? 'hide' : 'show'}
                </button>
              </div>
              <div className="form-group">
                <label style={labelStyle}>Confirm password</label>
                <input type="password" value={registerForm.confirm} onChange={e => setRegisterForm({...registerForm, confirm:e.target.value})}
                  placeholder="Repeat your password" required style={inputStyle}
                  onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              </div>
              {registerForm.password && registerForm.confirm && registerForm.password !== registerForm.confirm && (
                <p style={{ color:'#dc2626', fontSize:'.8rem', marginBottom:'.75rem', marginTop:'-.5rem' }}>Passwords don't match</p>
              )}
              <button type="submit" disabled={loading || (registerForm.password !== registerForm.confirm && registerForm.confirm)}
                style={{ width:'100%', padding:'.9rem', background:'var(--ink)', color:'white', border:'none', borderRadius:'100px', fontSize:'.95rem', fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', transition:'background .25s' }}
                onMouseEnter={e=>e.target.style.background='#7c3aed'}
                onMouseLeave={e=>e.target.style.background='var(--ink)'}>
                {loading ? 'Creating account…' : 'Create account →'}
              </button>
            </form>
          )}

          {/* ── Forgot password ── */}
          {tab === 'forgot' && (
            <>
              <button onClick={() => { setTab('login'); setForgotSent(false); }}
                style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:'.82rem', fontFamily:'var(--font-mono)', padding:0, marginBottom:'1.2rem', display:'flex', alignItems:'center', gap:'.3rem' }}>
                ← Back to sign in
              </button>

              {forgotSent ? (
                <div style={{ textAlign:'center', padding:'1rem 0' }}>
                  <div style={{ width:56, height:56, background:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:24 }}>✓</div>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:400, marginBottom:'.6rem' }}>Check your inbox</h3>
                  <p style={{ color:'var(--muted)', fontSize:'.88rem', lineHeight:1.7 }}>
                    If <strong>{forgotEmail}</strong> is registered, you'll receive a reset link shortly. Check your spam folder too.
                  </p>
                  <p style={{ color:'var(--muted)', fontSize:'.8rem', marginTop:'1rem' }}>
                    The link expires in {15} minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgot}>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:400, marginBottom:'.5rem' }}>Reset your password</h3>
                  <p style={{ color:'var(--muted)', fontSize:'.88rem', marginBottom:'1.5rem', lineHeight:1.65 }}>Enter your email and we'll send you a reset link.</p>
                  <div className="form-group">
                    <label style={labelStyle}>Email address</label>
                    <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                      placeholder="admin@paper5.co" required style={inputStyle}
                      onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ width:'100%', padding:'.9rem', background:'var(--ink)', color:'white', border:'none', borderRadius:'100px', fontSize:'.95rem', fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', transition:'background .25s' }}
                    onMouseEnter={e=>e.target.style.background='#7c3aed'}
                    onMouseLeave={e=>e.target.style.background='var(--ink)'}>
                    {loading ? 'Sending…' : 'Send reset link →'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'.82rem', color:'var(--muted)' }}>
          <Link to="/" style={{ color:'var(--p2,#7c3aed)' }}>← Back to website</Link>
          {' · '}
          <Link to="/api-tester" style={{ color:'var(--p2,#7c3aed)' }}>API tester</Link>
        </p>
      </div>
    </div>
  );
}
