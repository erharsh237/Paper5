import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/* ── Load Chart.js from CDN ── */
function loadChartJs(cb) {
  if (window.Chart) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
  s.onload = cb;
  document.head.appendChild(s);
}

const StatCard = ({ label, value, sub, grad }) => (
  <div className="card" style={{ padding:'1.5rem' }}>
    <p style={{ fontSize:'.72rem', fontFamily:'var(--font-mono)', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.5rem' }}>{label}</p>
    <p style={{ fontFamily:'var(--font-display)', fontSize:'2.4rem', fontWeight:700, lineHeight:1, background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{value ?? '—'}</p>
    {sub && <p style={{ fontSize:'.78rem', color:'var(--muted)', marginTop:'.3rem' }}>{sub}</p>}
  </div>
);

/* ── Build last-30-days labels + bucket leads ── */
function buildChartData(leads) {
  const days = 30;
  const now = new Date();
  const labels = [];
  const counts = {};

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-IN', { day:'numeric', month:'short' });
    labels.push(key);
    counts[key] = 0;
  }

  leads.forEach(l => {
    const d = new Date(l.createdAt);
    const key = d.toLocaleDateString('en-IN', { day:'numeric', month:'short' });
    if (counts[key] !== undefined) counts[key]++;
  });

  return { labels, data: labels.map(k => counts[k]) };
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const chartRef  = useRef();
  const chartInst = useRef();

  useEffect(() => {
    axios.get('/api/leads/stats').then(r => setStats(r.data)).catch(()=>{});
    axios.get('/api/leads?limit=5').then(r => setRecentLeads(r.data.leads)).catch(()=>{});
    axios.get('/api/leads?limit=1000').then(r => setAllLeads(r.data.leads)).catch(()=>{});
  }, []);

  /* Draw chart once allLeads loaded */
  useEffect(() => {
    if (!allLeads.length || !chartRef.current) return;
    loadChartJs(() => {
      const { labels, data } = buildChartData(allLeads);
      if (chartInst.current) chartInst.current.destroy();
      const ctx = chartRef.current.getContext('2d');
      chartInst.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Leads',
            data,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124,58,237,0.08)',
            borderWidth: 2,
            pointBackgroundColor: '#7c3aed',
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} lead${ctx.parsed.y!==1?'s':''}` } } },
          scales: {
            x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { family:'DM Mono, monospace', size:11 }, color:'#8a7560' } },
            y: { beginAtZero: true, ticks: { stepSize: 1, font: { family:'DM Mono, monospace', size:11 }, color:'#8a7560' }, grid: { color:'rgba(139,110,80,0.08)' } },
          },
        },
      });
    });
    return () => { if (chartInst.current) chartInst.current.destroy(); };
  }, [allLeads]);

  /* CSV export */
  const exportCSV = () => {
    if (!allLeads.length) return;
    const headers = ['Name','Email','Company','Service','Status','Message','Date'];
    const rows = allLeads.map(l => [
      l.name, l.email, l.company||'', l.service||'', l.status,
      `"${(l.message||'').replace(/"/g,'""')}"`,
      new Date(l.createdAt).toLocaleDateString('en-IN'),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `paper5-leads-${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const statusCount = s => stats?.byStatus?.find(x => x._id === s)?.count || 0;

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.25rem', flexWrap:'wrap', gap:'1rem' }}>
        <h1 className="page-title" style={{ margin:0 }}>Dashboard</h1>
        <button onClick={exportCSV} className="btn btn-outline btn-sm" disabled={!allLeads.length}>
          ⬇ Export leads CSV
        </button>
      </div>
      <p className="page-sub">Welcome back! Here's what's happening at Paper5.</p>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        <StatCard label="Total Leads"  value={stats?.total}      sub="All time"         grad="linear-gradient(135deg,#c026d3,#7c3aed)"/>
        <StatCard label="This Month"   value={stats?.thisMonth}  sub="New leads"        grad="linear-gradient(135deg,#7c3aed,#1d4ed8)"/>
        <StatCard label="Qualified"    value={statusCount('qualified')} sub="Ready to close" grad="linear-gradient(135deg,#059669,#34d399)"/>
        <StatCard label="New"          value={statusCount('new')} sub="Awaiting contact" grad="linear-gradient(135deg,#f59e0b,#f97316)"/>
      </div>

      {/* Leads chart */}
      <div className="card" style={{ marginBottom:'1.5rem', padding:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <h2 style={{ fontSize:'1rem', fontWeight:600 }}>Leads — last 30 days</h2>
          <span style={{ fontSize:'.72rem', fontFamily:'var(--font-mono)', color:'var(--muted)' }}>{allLeads.length} total</span>
        </div>
        <div style={{ height:220 }}>
          {allLeads.length === 0
            ? <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)', fontSize:'.9rem' }}>No leads yet — share your website to get started!</div>
            : <canvas ref={chartRef}/>
          }
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        {/* Recent leads */}
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.2rem' }}>
            <h2 style={{ fontSize:'1rem', fontWeight:600 }}>Recent leads</h2>
            <Link to="/admin/leads" style={{ fontSize:'.78rem', color:'var(--p2)', fontWeight:600 }}>View all →</Link>
          </div>
          {recentLeads.length === 0
            ? <p style={{ color:'var(--muted)', fontSize:'.88rem' }}>No leads yet. Share your website!</p>
            : recentLeads.map(lead => (
              <Link key={lead._id} to={`/admin/leads/${lead._id}`} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.75rem 0', borderBottom:'1px solid var(--border)', textDecoration:'none', color:'inherit' }}>
                <div>
                  <p style={{ fontSize:'.9rem', fontWeight:500 }}>{lead.name}</p>
                  <p style={{ fontSize:'.78rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{lead.email}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span className={`badge badge-${lead.status}`}>{lead.status}</span>
                  <p style={{ fontSize:'.7rem', color:'var(--muted)', marginTop:'.2rem' }}>{new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))
          }
        </div>

        {/* Leads by service */}
        <div className="card">
          <h2 style={{ fontSize:'1rem', fontWeight:600, marginBottom:'1.2rem' }}>Leads by service</h2>
          {!stats?.byService?.length
            ? <p style={{ color:'var(--muted)', fontSize:'.88rem' }}>No data yet.</p>
            : stats.byService.sort((a,b)=>b.count-a.count).map((s,i) => {
                const max = Math.max(...stats.byService.map(x=>x.count));
                const colors = ['#c026d3','#7c3aed','#1d4ed8','#0891b2','#059669','#f59e0b'];
                return (
                  <div key={i} style={{ marginBottom:'.75rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.25rem' }}>
                      <span style={{ fontSize:'.82rem' }}>{s._id||'Other'}</span>
                      <span style={{ fontSize:'.78rem', fontFamily:'var(--font-mono)', color:'var(--muted)' }}>{s.count}</span>
                    </div>
                    <div style={{ height:6, background:'var(--cream3)', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(s.count/max)*100}%`, background:colors[i%colors.length], borderRadius:3, transition:'width .8s ease' }}/>
                    </div>
                  </div>
                );
              })
          }
        </div>
      </div>

      <div style={{ marginTop:'1.5rem', display:'flex', gap:'1rem', flexWrap:'wrap' }}>
        <Link to="/admin/posts/new" className="btn btn-dark">✍️ Write new post</Link>
        <Link to="/admin/leads"     className="btn btn-outline">👥 View all leads</Link>
        <button onClick={exportCSV} className="btn btn-outline" disabled={!allLeads.length}>⬇ Export CSV</button>
      </div>
    </div>
  );
}
