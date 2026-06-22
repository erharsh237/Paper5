import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StatCard = ({ label, value, sub, grad }) => (
  <div className="card" style={{ padding:'1.5rem' }}>
    <p style={{ fontSize:'.72rem', fontFamily:'var(--font-mono)', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.5rem' }}>{label}</p>
    <p style={{ fontFamily:'var(--font-display)', fontSize:'2.4rem', fontWeight:700, lineHeight:1, background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{value ?? '—'}</p>
    {sub && <p style={{ fontSize:'.78rem', color:'var(--muted)', marginTop:'.3rem' }}>{sub}</p>}
  </div>
);

const BarRow = ({ label, count, max, color }) => (
  <div style={{ marginBottom:'.75rem' }}>
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.25rem' }}>
      <span style={{ fontSize:'.82rem' }}>{label}</span>
      <span style={{ fontSize:'.78rem', fontFamily:'var(--font-mono)', color:'var(--muted)' }}>{count}</span>
    </div>
    <div style={{ height:6, background:'var(--cream3)', borderRadius:3, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${max ? (count/max)*100 : 0}%`, background:color, borderRadius:3, transition:'width .8s ease' }}/>
    </div>
  </div>
);

const RANGE_OPTIONS = [
  { label:'Last 7 days',  value:7 },
  { label:'Last 30 days', value:30 },
  { label:'Last 90 days', value:90 },
];

export default function Insights() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = (range) => {
    setLoading(true);
    axios.get(`/api/chat/insights?days=${range}`)
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInsights(days); /* eslint-disable-next-line */ }, [days]);

  const maxInterest = data?.topInterests?.length ? Math.max(...data.topInterests.map(x => x.count)) : 0;
  const maxPage     = data?.topPages?.length ? Math.max(...data.topPages.map(x => x.count)) : 0;
  const colors = ['#c026d3','#7c3aed','#1d4ed8','#0891b2','#059669','#f59e0b'];

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.25rem', flexWrap:'wrap', gap:'1rem' }}>
        <h1 className="page-title" style={{ margin:0 }}>Chat insights</h1>
        <select value={days} onChange={e => setDays(Number(e.target.value))}
          style={{ padding:'.5rem 1rem', borderRadius:10, border:'1px solid var(--border)', fontSize:'.85rem', fontFamily:'var(--font-body)', background:'white', cursor:'pointer' }}>
          {RANGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <p className="page-sub">What visitors are asking the chatbot, and where it's turning into leads.</p>

      {loading ? (
        <p style={{ color:'var(--muted)', fontSize:'.9rem', marginTop:'2rem' }}>Loading…</p>
      ) : !data ? (
        <div className="card" style={{ padding:'2rem', textAlign:'center', color:'var(--muted)' }}>
          Couldn't load chat insights. Make sure the server is running.
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
            <StatCard label="Conversations" value={data.totalConversations} sub="In selected period" grad="linear-gradient(135deg,#c026d3,#7c3aed)"/>
            <StatCard label="Leads from chat" value={data.totalLeadsFromChat} sub="Captured via widget" grad="linear-gradient(135deg,#7c3aed,#1d4ed8)"/>
            <StatCard label="Conversion rate" value={`${data.conversionRate}%`} sub="Chats to leads" grad="linear-gradient(135deg,#059669,#34d399)"/>
            <StatCard label="Avg. messages" value={data.avgMessagesPerConvo} sub="Per conversation" grad="linear-gradient(135deg,#f59e0b,#f97316)"/>
          </div>

          {data.noInterestDetected > 0 && (
            <div className="card" style={{ marginBottom:'1.5rem', padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'.75rem', background:'#fffbeb', border:'1px solid #fde68a' }}>
              <span style={{ fontSize:18 }}>⚠️</span>
              <p style={{ fontSize:'.85rem', color:'#854d0e' }}>
                <strong>{data.noInterestDetected}</strong> conversation{data.noInterestDetected !== 1 ? 's' : ''} didn't match any known service — possible sign of a gap in offerings or unclear service descriptions. Review recent transcripts below.
              </p>
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem' }}>
            <div className="card">
              <h2 style={{ fontSize:'1rem', fontWeight:600, marginBottom:'1.2rem' }}>What visitors are asking about</h2>
              {!data.topInterests?.length
                ? <p style={{ color:'var(--muted)', fontSize:'.88rem' }}>No service interest detected yet.</p>
                : data.topInterests.map((item, i) => (
                    <BarRow key={item.service} label={item.service} count={item.count} max={maxInterest} color={colors[i % colors.length]} />
                  ))
              }
            </div>

            <div className="card">
              <h2 style={{ fontSize:'1rem', fontWeight:600, marginBottom:'1.2rem' }}>Pages visitors chatted from</h2>
              {!data.topPages?.length
                ? <p style={{ color:'var(--muted)', fontSize:'.88rem' }}>No page data yet.</p>
                : data.topPages.map((item, i) => (
                    <BarRow key={item.page} label={item.page} count={item.count} max={maxPage} color={colors[i % colors.length]} />
                  ))
              }
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize:'1rem', fontWeight:600, marginBottom:'1.2rem' }}>Recent conversations</h2>
            {!data.recentConversations?.length ? (
              <p style={{ color:'var(--muted)', fontSize:'.88rem' }}>No conversations yet.</p>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', fontSize:'.85rem', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid var(--border)' }}>
                      <th style={{ textAlign:'left', padding:'.6rem .5rem', color:'var(--muted)', fontWeight:500, fontSize:'.75rem', fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'.05em' }}>Started</th>
                      <th style={{ textAlign:'left', padding:'.6rem .5rem', color:'var(--muted)', fontWeight:500, fontSize:'.75rem', fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'.05em' }}>Topics</th>
                      <th style={{ textAlign:'left', padding:'.6rem .5rem', color:'var(--muted)', fontWeight:500, fontSize:'.75rem', fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'.05em' }}>Messages</th>
                      <th style={{ textAlign:'left', padding:'.6rem .5rem', color:'var(--muted)', fontWeight:500, fontSize:'.75rem', fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'.05em' }}>Lead?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentConversations.map(c => (
                      <tr key={c.id} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'.6rem .5rem', color:'var(--muted)', fontFamily:'var(--font-mono)', fontSize:'.78rem' }}>
                          {new Date(c.startedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                        </td>
                        <td style={{ padding:'.6rem .5rem' }}>
                          {c.interestedIn.length === 0
                            ? <span style={{ color:'var(--muted)' }}>—</span>
                            : c.interestedIn.map(s => (
                                <span key={s} style={{ fontSize:'.68rem', fontFamily:'var(--font-mono)', background:'#ede9fe', color:'#5b21b6', padding:'1px 6px', borderRadius:'100px', marginRight:4, display:'inline-block', marginBottom:2 }}>{s}</span>
                              ))
                          }
                        </td>
                        <td style={{ padding:'.6rem .5rem', color:'var(--muted)' }}>{c.messageCount}</td>
                        <td style={{ padding:'.6rem .5rem' }}>
                          {c.leadCaptured
                            ? <span className="badge badge-qualified">Yes — {c.leadEmail}</span>
                            : <span style={{ color:'var(--muted)' }}>No</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{ marginTop:'1.5rem' }}>
            <Link to="/admin/leads" className="btn btn-outline">👥 View all leads →</Link>
          </div>
        </>
      )}
    </div>
  );
}
