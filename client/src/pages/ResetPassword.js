import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate  = useNavigate();
  const [form, setForm]   = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [done, setDone]   = useState(false);

  const strength = (pw) => {
    let score = 0;
    if (pw.length >= 8)  score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#e24b4a', '#f59e0b', '#0891b2', '#059669'];
  const s = strength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password: form.password });
      setDone(true);
      toast.success('Password reset! Redirecting…');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed — the link may have expired');
    } finally { setLoading(false); }
  };

  const inputStyle = { width:'100%', padding:'.8rem 1rem', background:'var(--cream)', border:'1.5px solid var(--border)', borderRadius:10, fontSize:'.9rem', outline:'none', fontFamily:'var(--font-body)', color:'var(--ink)', transition:'border-color .2s' };
  const labelStyle = { display:'block', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.4rem' };

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:'.6rem', textDecoration:'none', marginBottom:'1rem', justifyContent:'center' }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:700, color:'var(--ink)', letterSpacing:'-.03em' }}>paper5</span>
          </Link>
        </div>

        <div className="card" style={{ padding:'2rem' }}>
          {done ? (
            <div style={{ textAlign:'center', padding:'1rem 0' }}>
              <div style={{ width:60, height:60, background:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.2rem', fontSize:26 }}>✓</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:400, marginBottom:'.5rem' }}>Password updated!</h2>
              <p style={{ color:'var(--muted)', fontSize:'.88rem' }}>Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:400, letterSpacing:'-.03em', marginBottom:'.5rem' }}>Set new password</h2>
              <p style={{ color:'var(--muted)', fontSize:'.88rem', marginBottom:'1.5rem', lineHeight:1.65 }}>Choose a strong password for your Paper5 admin account.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ position:'relative' }}>
                  <label style={labelStyle}>New password</label>
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password:e.target.value})}
                    placeholder="Min. 6 characters" required style={inputStyle}
                    onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position:'absolute', right:12, top:36, background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:13, fontFamily:'var(--font-mono)' }}>
                    {showPass ? 'hide' : 'show'}
                  </button>
                </div>

                {/* Password strength bar */}
                {form.password && (
                  <div style={{ marginBottom:'1rem', marginTop:'-.5rem' }}>
                    <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ height:3, flex:1, borderRadius:2, background: i<=s ? strengthColor[s] : 'var(--cream3)', transition:'background .3s' }}/>
                      ))}
                    </div>
                    <p style={{ fontSize:'.75rem', color: strengthColor[s], fontFamily:'var(--font-mono)' }}>{strengthLabel[s]}</p>
                  </div>
                )}

                <div className="form-group">
                  <label style={labelStyle}>Confirm new password</label>
                  <input type="password" value={form.confirm} onChange={e => setForm({...form, confirm:e.target.value})}
                    placeholder="Repeat your password" required style={inputStyle}
                    onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                </div>
                {form.confirm && form.password !== form.confirm && (
                  <p style={{ color:'#dc2626', fontSize:'.8rem', marginBottom:'.75rem', marginTop:'-.5rem' }}>Passwords don't match</p>
                )}

                <button type="submit" disabled={loading}
                  style={{ width:'100%', padding:'.9rem', background:'var(--ink)', color:'white', border:'none', borderRadius:'100px', fontSize:'.95rem', fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', transition:'background .25s' }}
                  onMouseEnter={e=>e.target.style.background='#7c3aed'}
                  onMouseLeave={e=>e.target.style.background='var(--ink)'}>
                  {loading ? 'Resetting…' : 'Reset password →'}
                </button>
              </form>
            </>
          )}
        </div>
        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'.82rem', color:'var(--muted)' }}>
          <Link to="/login" style={{ color:'#7c3aed' }}>← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
