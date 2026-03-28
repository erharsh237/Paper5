import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ENDPOINTS = [
  {
    group: 'Auth',
    color: '#c026d3',
    routes: [
      { method:'POST', path:'/api/auth/register', label:'Register admin', desc:'Create a new admin account', body:'{\n  "name": "Harshpal Singh",\n  "email": "erharsh237@gmail.com",\n  "password": "@Harsh123"\n}' },
      { method:'POST', path:'/api/auth/login',    label:'Login',           desc:'Get your JWT token',       body:'{\n  "email": "erharsh237@gmail.com",\n  "password": "@Harsh123"\n}' },
      { method:'GET',  path:'/api/auth/me',        label:'Get current user', desc:'Requires Bearer token',  body:'' },
      { method:'POST', path:'/api/auth/forgot-password', label:'Forgot password', desc:'Send reset email',  body:'{\n  "email": "erharsh237@gmail.com"\n}' },
      { method:'POST', path:'/api/auth/change-password', label:'Change password', desc:'Requires Bearer token', body:'{\n  "currentPassword": "@Harsh123",\n  "newPassword": "@NewPass456"\n}' },
    ],
  },
  {
    group: 'Contact / Leads',
    color: '#7c3aed',
    routes: [
      { method:'POST', path:'/api/contact',  label:'Submit contact form', desc:'Public — creates a lead', body:'{\n  "name": "Test Client",\n  "email": "test@example.com",\n  "company": "Test Co",\n  "service": "SEO",\n  "message": "I need help with my website SEO"\n}' },
      { method:'GET',  path:'/api/leads',    label:'List all leads',       desc:'Requires Bearer token', body:'' },
      { method:'GET',  path:'/api/leads/stats', label:'Lead stats',        desc:'Requires Bearer token', body:'' },
    ],
  },
  {
    group: 'Blog Posts',
    color: '#1d4ed8',
    routes: [
      { method:'GET',  path:'/api/posts',       label:'List published posts', desc:'Public endpoint', body:'' },
      { method:'GET',  path:'/api/posts/admin', label:'List all posts',        desc:'Requires Bearer token', body:'' },
      { method:'POST', path:'/api/posts',       label:'Create post',           desc:'Requires Bearer token', body:'{\n  "title": "How to rank on Google",\n  "excerpt": "A quick guide to SEO in 2026",\n  "content": "<p>Your content here</p>",\n  "category": "SEO",\n  "status": "draft"\n}' },
    ],
  },
  {
    group: 'Health',
    color: '#059669',
    routes: [
      { method:'GET', path:'/api/health', label:'API health check', desc:'Check if server is running', body:'' },
    ],
  },
];

const METHOD_COLORS = { GET:'#059669', POST:'#7c3aed', PUT:'#f59e0b', PATCH:'#0891b2', DELETE:'#dc2626' };
const METHOD_BG     = { GET:'#ecfdf5', POST:'#ede9fe', PUT:'#fffbeb', PATCH:'#ecfeff', DELETE:'#fee2e2' };

function syntaxHighlight(json) {
  if (!json) return '';
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = '#0891b2';
    if (/^"/.test(match)) {
      cls = /:$/.test(match) ? '#c026d3' : '#059669';
    } else if (/true|false/.test(match)) { cls = '#f59e0b'; }
    else if (/null/.test(match)) { cls = '#8a7560'; }
    return `<span style="color:${cls}">${match}</span>`;
  });
}

export default function APITester() {
  const [selected, setSelected] = useState(ENDPOINTS[0].routes[0]);
  const [token,    setToken]    = useState(localStorage.getItem('p5_token') || '');
  const [body,     setBody]     = useState(ENDPOINTS[0].routes[0].body);
  const [params,   setParams]   = useState('');
  const [response, setResponse] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [time,     setTime]     = useState(null);
  const [copyDone, setCopyDone] = useState(false);
  const tokenRef = useRef();

  const selectRoute = (route) => {
    setSelected(route);
    setBody(route.body);
    setResponse(null);
    setParams('');
  };

  const run = async () => {
    setLoading(true);
    setResponse(null);
    const start = Date.now();
    try {
      let parsedBody = undefined;
      if (body.trim()) {
        try { parsedBody = JSON.parse(body); }
        catch { setResponse({ error: 'Invalid JSON in request body' }); setLoading(false); return; }
      }
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const queryString = params.trim() ? `?${params}` : '';
      const res = await axios({
        method: selected.method.toLowerCase(),
        url: selected.path + queryString,
        data: parsedBody,
        headers,
        validateStatus: () => true,
      });

      setTime(Date.now() - start);
      setResponse({ status: res.status, statusText: res.statusText, data: res.data, headers: res.headers });

      // Auto-save token if login/register returns one
      if (res.data?.token) {
        localStorage.setItem('p5_token', res.data.token);
        setToken(res.data.token);
      }
    } catch (err) {
      setTime(Date.now() - start);
      setResponse({ error: err.message });
    } finally { setLoading(false); }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 1500);
  };

  const statusOk  = response?.status && response.status < 300;
  const statusWarn = response?.status && response.status >= 300 && response.status < 500;

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', fontFamily:'var(--font-body)' }}>

      {/* Header */}
      <div style={{ background:'var(--ink)', padding:'1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <Link to="/admin" style={{ color:'rgba(255,255,255,.5)', fontSize:'.82rem', fontFamily:'var(--font-mono)', textDecoration:'none' }}>← Admin</Link>
          <span style={{ color:'rgba(255,255,255,.2)' }}>|</span>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:700, color:'white', letterSpacing:'-.02em' }}>paper5 API tester</span>
          <span style={{ background:'#ede9fe', color:'#5b21b6', fontSize:'.68rem', fontFamily:'var(--font-mono)', padding:'.2rem .6rem', borderRadius:'100px' }}>localhost:5000</span>
        </div>
        <Link to="/login" style={{ color:'rgba(255,255,255,.5)', fontSize:'.78rem', fontFamily:'var(--font-mono)', textDecoration:'none' }}>Login page →</Link>
      </div>

      {/* Token bar */}
      <div style={{ background:'#13132a', padding:'.75rem 2rem', display:'flex', alignItems:'center', gap:'1rem' }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'.72rem', color:'rgba(255,255,255,.4)', letterSpacing:'.08em', flexShrink:0 }}>BEARER TOKEN</span>
        <input ref={tokenRef} value={token} onChange={e => setToken(e.target.value)} placeholder="Paste your JWT token here (auto-fills after login/register)"
          style={{ flex:1, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'.5rem .9rem', color:'rgba(255,255,255,.8)', fontSize:'.78rem', fontFamily:'var(--font-mono)', outline:'none' }}/>
        {token && (
          <button onClick={copyToken}
            style={{ background:'rgba(255,255,255,.08)', border:'none', borderRadius:6, padding:'.4rem .9rem', color:'rgba(255,255,255,.6)', fontSize:'.75rem', fontFamily:'var(--font-mono)', cursor:'pointer' }}>
            {copyDone ? 'copied!' : 'copy'}
          </button>
        )}
        {token && (
          <button onClick={() => { setToken(''); localStorage.removeItem('p5_token'); }}
            style={{ background:'rgba(220,38,38,.15)', border:'none', borderRadius:6, padding:'.4rem .9rem', color:'#f09595', fontSize:'.75rem', fontFamily:'var(--font-mono)', cursor:'pointer' }}>
            clear
          </button>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', height:'calc(100vh - 105px)' }}>

        {/* Sidebar — endpoints */}
        <div style={{ borderRight:'1px solid var(--border)', overflowY:'auto', background:'white', padding:'.75rem 0' }}>
          {ENDPOINTS.map((group) => (
            <div key={group.group}>
              <div style={{ padding:'.4rem 1.2rem', fontFamily:'var(--font-mono)', fontSize:'.65rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted)' }}>{group.group}</div>
              {group.routes.map((route) => (
                <button key={route.path + route.method} onClick={() => selectRoute(route)}
                  style={{ width:'100%', textAlign:'left', padding:'.55rem 1.2rem', background: selected === route ? 'var(--cream2)' : 'transparent', border:'none', cursor:'pointer', borderLeft: selected === route ? `2px solid ${group.color}` : '2px solid transparent', transition:'all .15s' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.15rem' }}>
                    <span style={{ fontSize:'.65rem', fontFamily:'var(--font-mono)', fontWeight:700, background:METHOD_BG[route.method], color:METHOD_COLORS[route.method], padding:'.15rem .45rem', borderRadius:4, flexShrink:0 }}>{route.method}</span>
                    <span style={{ fontSize:'.82rem', fontWeight:500, color: selected === route ? 'var(--ink)' : 'var(--muted)' }}>{route.label}</span>
                  </div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'.68rem', color:'var(--muted)', paddingLeft:'.1rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{route.path}</div>
                </button>
              ))}
              <div style={{ height:8 }}/>
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div style={{ display:'grid', gridTemplateRows:'auto 1fr auto', overflowY:'auto' }}>

          {/* Request area */}
          <div style={{ padding:'1.5rem 2rem', borderBottom:'1px solid var(--border)' }}>
            {/* URL bar */}
            <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.2rem' }}>
              <span style={{ fontSize:'.82rem', fontFamily:'var(--font-mono)', fontWeight:700, background:METHOD_BG[selected.method], color:METHOD_COLORS[selected.method], padding:'.45rem .9rem', borderRadius:8, flexShrink:0 }}>{selected.method}</span>
              <div style={{ flex:1, background:'var(--cream)', border:'1.5px solid var(--border)', borderRadius:10, padding:'.7rem 1rem', fontFamily:'var(--font-mono)', fontSize:'.88rem', color:'var(--muted)' }}>
                http://localhost:5000<span style={{ color:'var(--ink)', fontWeight:500 }}>{selected.path}</span>
              </div>
              <button onClick={run} disabled={loading}
                style={{ padding:'.7rem 1.8rem', background: loading ? 'var(--cream3)' : 'var(--ink)', color: loading ? 'var(--muted)' : 'white', border:'none', borderRadius:'100px', fontWeight:600, fontSize:'.9rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'var(--font-body)', transition:'all .2s', flexShrink:0 }}
                onMouseEnter={e=>{ if(!loading) e.target.style.background='#7c3aed'; }}
                onMouseLeave={e=>{ if(!loading) e.target.style.background='var(--ink)'; }}>
                {loading ? 'Sending…' : '▶ Send'}
              </button>
            </div>

            {/* Desc */}
            <p style={{ fontSize:'.82rem', color:'var(--muted)', marginBottom:'1rem' }}>
              {selected.desc}
              {selected.desc.includes('Bearer') && !token && (
                <span style={{ color:'#f59e0b', marginLeft:'.5rem' }}>⚠ No token set — run login first</span>
              )}
            </p>

            {/* Query params */}
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.4rem' }}>
                Query params (e.g. status=new&limit=5)
              </label>
              <input value={params} onChange={e => setParams(e.target.value)} placeholder="key=value&key2=value2"
                style={{ width:'100%', padding:'.65rem 1rem', background:'var(--cream)', border:'1.5px solid var(--border)', borderRadius:10, fontSize:'.85rem', fontFamily:'var(--font-mono)', outline:'none', color:'var(--ink)' }}
                onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
            </div>

            {/* Body editor */}
            {selected.method !== 'GET' && (
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.4rem' }}>
                  Request body (JSON)
                </label>
                <textarea value={body} onChange={e => setBody(e.target.value)}
                  style={{ width:'100%', minHeight:140, padding:'1rem', background:'#1a1208', color:'#a78bfa', border:'1px solid rgba(255,255,255,.08)', borderRadius:10, fontSize:'.85rem', fontFamily:'var(--font-mono)', outline:'none', resize:'vertical', lineHeight:1.7 }}/>
              </div>
            )}
          </div>

          {/* Response area */}
          <div style={{ padding:'1.5rem 2rem', overflowY:'auto' }}>
            {!response && !loading && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--muted)', gap:'.5rem' }}>
                <span style={{ fontSize:32 }}>▶</span>
                <p style={{ fontSize:'.9rem' }}>Hit Send to see the response</p>
              </div>
            )}

            {loading && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--muted)' }}>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'.9rem' }}>Waiting for response…</p>
              </div>
            )}

            {response && !loading && (
              <>
                {/* Status bar */}
                <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                  {response.error ? (
                    <span style={{ background:'#fee2e2', color:'#991b1b', padding:'.4rem 1rem', borderRadius:'100px', fontFamily:'var(--font-mono)', fontSize:'.82rem', fontWeight:700 }}>Error</span>
                  ) : (
                    <span style={{ background: statusOk ? '#dcfce7' : statusWarn ? '#fef3c7' : '#fee2e2', color: statusOk ? '#166534' : statusWarn ? '#92400e' : '#991b1b', padding:'.4rem 1rem', borderRadius:'100px', fontFamily:'var(--font-mono)', fontSize:'.82rem', fontWeight:700 }}>
                      {response.status} {response.statusText}
                    </span>
                  )}
                  {time && <span style={{ fontFamily:'var(--font-mono)', fontSize:'.78rem', color:'var(--muted)' }}>{time}ms</span>}
                  {response.data?.token && (
                    <span style={{ background:'#dcfce7', color:'#166534', padding:'.3rem .8rem', borderRadius:'100px', fontFamily:'var(--font-mono)', fontSize:'.75rem' }}>
                      ✓ Token saved automatically
                    </span>
                  )}
                </div>

                {/* Response body */}
                <div style={{ background:'#1a1208', borderRadius:12, padding:'1.2rem 1.4rem', border:'1px solid rgba(255,255,255,.06)' }}>
                  <pre style={{ margin:0, fontFamily:'var(--font-mono)', fontSize:'.82rem', lineHeight:1.75, color:'rgba(255,255,255,.8)', whiteSpace:'pre-wrap', wordBreak:'break-word' }}
                    dangerouslySetInnerHTML={{ __html: response.error
                      ? `<span style="color:#f09595">${response.error}</span>`
                      : syntaxHighlight(JSON.stringify(response.data, null, 2))
                    }}/>
                </div>
              </>
            )}
          </div>

          {/* Footer tip */}
          <div style={{ padding:'.75rem 2rem', borderTop:'1px solid var(--border)', background:'var(--cream2)' }}>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'.72rem', color:'var(--muted)' }}>
              💡 Tip: Run <strong>Register</strong> or <strong>Login</strong> first — the token auto-fills and enables all protected routes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
