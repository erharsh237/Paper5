import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const STATUSES = ['','new','contacted','qualified','closed','lost'];
const SERVICES = ['','SEO','Social Media Marketing','Website — WordPress','Website — Full Stack (Frontend)','Website — Full Stack (Frontend + Backend)','Paid Advertising','Full Package'];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [service, setService] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchLeads = useCallback(() => {
    setLoading(true);
    const params = { page, limit:15 };
    if (status) params.status = status;
    if (service) params.service = service;
    if (search) params.search = search;
    axios.get('/api/leads', { params })
      .then(r => { setLeads(r.data.leads); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(() => toast.error('Failed to load leads'))
      .finally(() => setLoading(false));
  }, [page, status, service, search]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const deleteLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await axios.delete(`/api/leads/${id}`);
      toast.success('Lead deleted');
      fetchLeads();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-sub" style={{ margin:0 }}>{total} total leads</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search name, email, company…" style={{ padding:'.6rem 1rem', borderRadius:10, border:'1.5px solid var(--border)', background:'white', fontSize:'.85rem', outline:'none', minWidth:220 }}/>
        <select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}} style={{ padding:'.6rem 1rem', borderRadius:10, border:'1.5px solid var(--border)', background:'white', fontSize:'.85rem', outline:'none' }}>
          <option value="">All statuses</option>
          {STATUSES.filter(Boolean).map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
        <select value={service} onChange={e=>{setService(e.target.value);setPage(1);}} style={{ padding:'.6rem 1rem', borderRadius:10, border:'1.5px solid var(--border)', background:'white', fontSize:'.85rem', outline:'none' }}>
          <option value="">All services</option>
          {SERVICES.filter(Boolean).map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        {loading ? (
          <p style={{ padding:'2rem', color:'var(--muted)' }}>Loading…</p>
        ) : leads.length === 0 ? (
          <p style={{ padding:'2rem', color:'var(--muted)', textAlign:'center' }}>No leads found. Share your website to get started!</p>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)', background:'var(--cream)' }}>
                {['Name','Email','Company','Service','Status','Date',''].map(h=>(
                  <th key={h} style={{ padding:'.75rem 1rem', textAlign:'left', fontSize:'.72rem', fontFamily:'var(--font-mono)', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', fontWeight:400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead._id} style={{ borderBottom:'1px solid var(--border)', transition:'background .15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--cream)'}
                  onMouseLeave={e=>e.currentTarget.style.background='white'}>
                  <td style={{ padding:'.75rem 1rem', fontSize:'.88rem', fontWeight:500 }}>{lead.name}</td>
                  <td style={{ padding:'.75rem 1rem', fontSize:'.82rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{lead.email}</td>
                  <td style={{ padding:'.75rem 1rem', fontSize:'.82rem', color:'var(--muted)' }}>{lead.company || '—'}</td>
                  <td style={{ padding:'.75rem 1rem', fontSize:'.82rem' }}>{lead.service || '—'}</td>
                  <td style={{ padding:'.75rem 1rem' }}><span className={`badge badge-${lead.status}`}>{lead.status}</span></td>
                  <td style={{ padding:'.75rem 1rem', fontSize:'.78rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding:'.75rem 1rem' }}>
                    <div style={{ display:'flex', gap:'.5rem' }}>
                      <Link to={`/admin/leads/${lead._id}`} className="btn btn-outline btn-sm">View</Link>
                      <button onClick={()=>deleteLead(lead._id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display:'flex', gap:'.5rem', marginTop:'1rem', justifyContent:'center' }}>
          {Array.from({length:pages},(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)} className="btn btn-sm" style={{ background: page===p ? 'var(--ink)' : 'white', color: page===p ? 'white' : 'var(--muted)', border:'1.5px solid', borderColor: page===p ? 'var(--ink)' : 'var(--border)', borderRadius:8, minWidth:36 }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
