import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SideLink = ({ to, icon, label, end }) => (
  <NavLink to={to} end={end} style={({ isActive }) => ({
    display:'flex', alignItems:'center', gap:'.75rem', padding:'.7rem 1rem', borderRadius:10, fontSize:'.88rem', fontWeight:500, textDecoration:'none', transition:'all .2s', marginBottom:'.25rem',
    background: isActive ? 'var(--cream3)' : 'transparent',
    color: isActive ? 'var(--ink)' : 'var(--muted)',
  })}>
    <span style={{ fontSize:18 }}>{icon}</span> {label}
  </NavLink>
);

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); toast.success('Signed out'); navigate('/login'); };

  // Notification bell state
  const [newLeads, setNewLeads]       = useState([]);
  const [bellOpen, setBellOpen]       = useState(false);
  const [lastChecked, setLastChecked] = useState(() => localStorage.getItem('p5_last_checked') || new Date().toISOString());
  const bellRef = useRef();
  const prevCountRef = useRef(0);

  // Poll for new leads every 30 seconds
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await axios.get('/api/leads?status=new&limit=20');
        const leads = data.leads || data || [];
        const fresh = leads.filter(l => new Date(l.createdAt) > new Date(lastChecked));
        // Show toast for brand-new leads since last poll
        if (fresh.length > prevCountRef.current) {
          const newest = fresh[0];
          toast.custom((t) => (
            <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:14, padding:'1rem 1.2rem', display:'flex', alignItems:'center', gap:'1rem', boxShadow:'0 8px 24px rgba(26,18,8,.1)', maxWidth:340, cursor:'pointer' }}
              onClick={() => { navigate('/admin/leads'); toast.dismiss(t.id); }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🔔</div>
              <div>
                <p style={{ fontWeight:600, fontSize:'.88rem', marginBottom:'.15rem' }}>New lead from {newest.name}</p>
                <p style={{ fontSize:'.78rem', color:'var(--muted)' }}>{newest.service || 'General enquiry'} · just now</p>
              </div>
            </div>
          ), { duration: 6000, position: 'top-right' });
        }
        prevCountRef.current = fresh.length;
        setNewLeads(fresh);
      } catch (e) { /* silent fail */ }
    };
    fetchLeads();
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, [lastChecked]);

  // Close bell dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    const now = new Date().toISOString();
    localStorage.setItem('p5_last_checked', now);
    setLastChecked(now);
    setNewLeads([]);
    setBellOpen(false);
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--cream)' }}>
      {/* Sidebar */}
      <aside style={{ width:240, background:'white', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', padding:'1.5rem 1rem', flexShrink:0, position:'sticky', top:0, height:'100vh' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'2rem', paddingLeft:'.5rem' }}>
          <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
            <defs>
              <linearGradient id="sl1" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#c026d3"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
              <linearGradient id="sl2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#818cf8"/></linearGradient>
              <linearGradient id="sl3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#1d4ed8"/><stop offset="100%" stopColor="#38bdf8"/></linearGradient>
              <linearGradient id="sl4" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#0891b2"/><stop offset="100%" stopColor="#34d399"/></linearGradient>
              <linearGradient id="sl5" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#059669"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient>
            </defs>
            <g transform="rotate(-22,36,70)" opacity="0.72"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#sl1)"/></g>
            <g transform="rotate(-11,36,70)" opacity="0.85"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#sl2)"/></g>
            <rect x="36" y="16" width="24" height="32" rx="3.5" fill="url(#sl3)"/>
            <g transform="rotate(11,36,70)" opacity="0.85"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#sl4)"/></g>
            <g transform="rotate(22,36,70)" opacity="0.72"><rect x="36" y="18" width="22" height="30" rx="3" fill="url(#sl5)"/></g>
          </svg>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:700, letterSpacing:'-.03em' }}>paper5</span>
        </div>

        <nav style={{ flex:1 }}>
          <p style={{ fontSize:'.65rem', fontFamily:'var(--font-mono)', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.5rem', paddingLeft:'.5rem' }}>Main</p>
          <SideLink to="/admin" end icon="📊" label="Dashboard"/>
          <SideLink to="/admin/leads" icon="👥" label="Leads"/>
          <SideLink to="/admin/insights" icon="💬" label="Chat insights"/>
          <SideLink to="/admin/posts" icon="✍️" label="Blog Posts"/>
          <div style={{ borderTop:'1px solid var(--border)', margin:'1rem 0' }}/>
          <p style={{ fontSize:'.65rem', fontFamily:'var(--font-mono)', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.5rem', paddingLeft:'.5rem' }}>Tools</p>
          <SideLink to="/api-tester" icon="🔧" label="API tester"/>
          <SideLink to="/admin/change-password" icon="🔑" label="Change password"/>
          <div style={{ borderTop:'1px solid var(--border)', margin:'1rem 0' }}/>
          <p style={{ fontSize:'.65rem', fontFamily:'var(--font-mono)', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.5rem', paddingLeft:'.5rem' }}>Site</p>
          <SideLink to="/" icon="🌐" label="View Website"/>
        </nav>

        <div style={{ borderTop:'1px solid var(--border)', paddingTop:'1rem' }}>
          <div style={{ padding:'.5rem', borderRadius:10, marginBottom:'.75rem' }}>
            <p style={{ fontSize:'.82rem', fontWeight:600 }}>{user?.name}</p>
            <p style={{ fontSize:'.72rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ width:'100%', justifyContent:'center' }}>Sign out</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, overflow:'auto' }}>
        {/* Top bar with notification bell */}
        <div style={{ background:'white', borderBottom:'1px solid var(--border)', padding:'.75rem 2rem', display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'1rem', position:'sticky', top:0, zIndex:50 }}>

          {/* Bell button */}
          <div ref={bellRef} style={{ position:'relative' }}>
            <button onClick={() => setBellOpen(!bellOpen)}
              style={{ width:38, height:38, borderRadius:'50%', background: newLeads.length > 0 ? '#fff7ed' : 'var(--cream)', border:`1.5px solid ${newLeads.length > 0 ? '#fed7aa' : 'var(--border)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', transition:'all .2s' }}>
              <span style={{ fontSize:16 }}>🔔</span>
              {newLeads.length > 0 && (
                <span style={{ position:'absolute', top:-4, right:-4, width:18, height:18, borderRadius:'50%', background:'#dc2626', color:'white', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid white', fontFamily:'var(--font-mono)' }}>
                  {newLeads.length > 9 ? '9+' : newLeads.length}
                </span>
              )}
            </button>

            {/* Bell dropdown */}
            {bellOpen && (
              <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, width:340, background:'white', border:'1px solid var(--border)', borderRadius:16, boxShadow:'0 8px 32px rgba(26,18,8,.12)', overflow:'hidden', zIndex:100 }}>
                <div style={{ padding:'1rem 1.2rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <p style={{ fontWeight:600, fontSize:'.9rem' }}>Notifications</p>
                    <p style={{ fontSize:'.72rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{newLeads.length} new since last check</p>
                  </div>
                  {newLeads.length > 0 && (
                    <button onClick={markAllRead} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'.75rem', color:'#7c3aed', fontWeight:600, fontFamily:'var(--font-body)' }}>
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight:320, overflowY:'auto' }}>
                  {newLeads.length === 0 ? (
                    <div style={{ padding:'2rem', textAlign:'center', color:'var(--muted)', fontSize:'.88rem' }}>
                      <span style={{ display:'block', fontSize:28, marginBottom:'.5rem' }}>✅</span>
                      All caught up!
                    </div>
                  ) : (
                    newLeads.map((lead, i) => (
                      <div key={i} onClick={() => { navigate('/admin/leads'); setBellOpen(false); }}
                        style={{ padding:'.9rem 1.2rem', borderBottom:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:'.75rem', transition:'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--cream)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#c026d3,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:13, fontWeight:700, color:'white', fontFamily:'var(--font-mono)' }}>
                          {lead.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:'.85rem', fontWeight:600, marginBottom:'.15rem' }}>{lead.name}</p>
                          <p style={{ fontSize:'.75rem', color:'var(--muted)', marginBottom:'.15rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.email}</p>
                          <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                            {lead.service && <span style={{ fontSize:'.68rem', fontFamily:'var(--font-mono)', background:'#ede9fe', color:'#5b21b6', padding:'1px 6px', borderRadius:'100px' }}>{lead.service}</span>}
                            <span style={{ fontSize:'.68rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>
                              {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div style={{ width:8, height:8, borderRadius:'50%', background:'#059669', flexShrink:0, marginTop:4 }}/>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ padding:'.75rem 1.2rem', borderTop:'1px solid var(--border)', background:'var(--cream)' }}>
                  <button onClick={() => { navigate('/admin/leads'); setBellOpen(false); }}
                    style={{ width:'100%', padding:'.6rem', background:'var(--ink)', color:'white', border:'none', borderRadius:'100px', fontSize:'.82rem', fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)' }}
                    onMouseEnter={e=>e.target.style.background='#7c3aed'} onMouseLeave={e=>e.target.style.background='var(--ink)'}>
                    View all leads →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User pill */}
          <div style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.4rem .9rem', background:'var(--cream)', borderRadius:'100px', border:'1px solid var(--border)' }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,#c026d3,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white', fontFamily:'var(--font-mono)', flexShrink:0 }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <span style={{ fontSize:'.82rem', fontWeight:500, color:'var(--ink)' }}>{user?.name?.split(' ')[0]}</span>
          </div>
        </div>

        <div style={{ padding:'2rem', maxWidth:1100 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
