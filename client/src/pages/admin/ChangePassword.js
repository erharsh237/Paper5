import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function ChangePassword() {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword:'', newPassword:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const strength = (pw) => {
    let s = 0;
    if (pw.length >= 8)        s++;
    if (/[A-Z]/.test(pw))     s++;
    if (/[0-9]/.test(pw))     s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#e24b4a', '#f59e0b', '#0891b2', '#059669'];
  const s = strength(form.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) { toast.error('New passwords do not match'); return; }
    if (form.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await axios.post('/api/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password changed successfully!');
      setForm({ currentPassword:'', newPassword:'', confirm:'' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  const inputStyle = { width:'100%', padding:'.8rem 1rem', background:'var(--cream)', border:'1.5px solid var(--border)', borderRadius:10, fontSize:'.9rem', outline:'none', fontFamily:'var(--font-body)', color:'var(--ink)', transition:'border-color .2s' };
  const labelStyle = { display:'block', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.4rem' };

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 className="page-title">Change password</h1>
      <p className="page-sub">Update the password for <strong>{user?.email}</strong></p>

      <div className="card" style={{ padding:'2rem' }}>
        <form onSubmit={handleSubmit}>
          {/* Current password */}
          <div style={{ marginBottom:'1.2rem', position:'relative' }}>
            <label style={labelStyle}>Current password</label>
            <input type={showCurrent ? 'text' : 'password'} value={form.currentPassword}
              onChange={e => setForm({...form, currentPassword:e.target.value})}
              placeholder="Your current password" required style={inputStyle}
              onFocus={e=>e.target.style.borderColor='#7c3aed'}
              onBlur={e=>e.target.style.borderColor='var(--border)'}/>
            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
              style={{ position:'absolute', right:12, top:34, background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:13, fontFamily:'var(--font-mono)' }}>
              {showCurrent ? 'hide' : 'show'}
            </button>
          </div>

          {/* Divider */}
          <div style={{ borderTop:'1px solid var(--border)', margin:'1.2rem 0' }}/>

          {/* New password */}
          <div style={{ marginBottom: form.newPassword ? '.5rem' : '1.2rem', position:'relative' }}>
            <label style={labelStyle}>New password</label>
            <input type={showNew ? 'text' : 'password'} value={form.newPassword}
              onChange={e => setForm({...form, newPassword:e.target.value})}
              placeholder="Min. 6 characters" required style={inputStyle}
              onFocus={e=>e.target.style.borderColor='#7c3aed'}
              onBlur={e=>e.target.style.borderColor='var(--border)'}/>
            <button type="button" onClick={() => setShowNew(!showNew)}
              style={{ position:'absolute', right:12, top:34, background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:13, fontFamily:'var(--font-mono)' }}>
              {showNew ? 'hide' : 'show'}
            </button>
          </div>

          {/* Strength bar */}
          {form.newPassword && (
            <div style={{ marginBottom:'1.2rem' }}>
              <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ height:3, flex:1, borderRadius:2, background: i<=s ? strengthColor[s] : 'var(--cream3)', transition:'background .3s' }}/>
                ))}
              </div>
              <p style={{ fontSize:'.75rem', color:strengthColor[s], fontFamily:'var(--font-mono)' }}>
                {strengthLabel[s]} — {s < 3 ? 'add uppercase, numbers or symbols to strengthen' : 'good password'}
              </p>
            </div>
          )}

          {/* Confirm */}
          <div style={{ marginBottom:'1.5rem' }}>
            <label style={labelStyle}>Confirm new password</label>
            <input type="password" value={form.confirm}
              onChange={e => setForm({...form, confirm:e.target.value})}
              placeholder="Repeat new password" required style={inputStyle}
              onFocus={e=>e.target.style.borderColor='#7c3aed'}
              onBlur={e=>e.target.style.borderColor='var(--border)'}/>
            {form.confirm && form.newPassword !== form.confirm && (
              <p style={{ color:'#dc2626', fontSize:'.8rem', marginTop:'.4rem' }}>Passwords don't match</p>
            )}
            {form.confirm && form.newPassword === form.confirm && form.confirm.length > 0 && (
              <p style={{ color:'#059669', fontSize:'.8rem', marginTop:'.4rem' }}>✓ Passwords match</p>
            )}
          </div>

          <button type="submit" disabled={loading || (form.confirm && form.newPassword !== form.confirm)}
            style={{ padding:'.85rem 2rem', background: loading ? 'var(--cream3)' : 'var(--ink)', color: loading ? 'var(--muted)' : 'white', border:'none', borderRadius:'100px', fontSize:'.92rem', fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'var(--font-body)', transition:'background .25s' }}
            onMouseEnter={e=>{ if(!loading) e.target.style.background='#7c3aed'; }}
            onMouseLeave={e=>{ if(!loading) e.target.style.background='var(--ink)'; }}>
            {loading ? 'Updating…' : 'Update password →'}
          </button>
        </form>
      </div>

      {/* Tips */}
      <div style={{ marginTop:'1.2rem', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:12, padding:'1rem 1.2rem' }}>
        <p style={{ fontSize:'.82rem', color:'#92400e', lineHeight:1.7 }}>
          <strong>Tips for a strong password:</strong> Use at least 8 characters, mix uppercase and lowercase letters, add numbers and symbols like <code>@#$!</code>. Never reuse passwords across sites.
        </p>
      </div>
    </div>
  );
}
