import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const STATUSES = ['new','contacted','qualified','closed','lost'];

export default function LeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`/api/leads/${id}`)
      .then(r => { setLead(r.data); setNotes(r.data.notes || ''); })
      .catch(() => toast.error('Failed to load lead'));
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const { data } = await axios.patch(`/api/leads/${id}`, { status });
      setLead(data);
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update'); }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      const { data } = await axios.patch(`/api/leads/${id}`, { notes });
      setLead(data);
      toast.success('Notes saved');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (!lead) return <p style={{ color:'var(--muted)' }}>Loading…</p>;

  return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}>
        <Link to="/admin/leads" style={{ fontSize:'.82rem', color:'var(--muted)', fontFamily:'var(--font-mono)', letterSpacing:'.05em' }}>← Back to leads</Link>
      </div>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:400, letterSpacing:'-.03em', marginBottom:'.3rem' }}>{lead.name}</h1>
          <p style={{ color:'var(--muted)', fontFamily:'var(--font-mono)', fontSize:'.82rem' }}>{lead.email}</p>
        </div>
        <span className={`badge badge-${lead.status}`} style={{ fontSize:'.85rem', padding:'.4rem 1rem' }}>{lead.status}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        {/* Details */}
        <div className="card">
          <h3 style={{ fontSize:'.9rem', fontWeight:600, marginBottom:'1.2rem' }}>Lead details</h3>
          {[['Company', lead.company || '—'],['Service', lead.service || '—'],['Source', lead.source],['Received', new Date(lead.createdAt).toLocaleString('en-IN')]].map(([k,v])=>(
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'.6rem 0', borderBottom:'1px solid var(--border)' }}>
              <span style={{ fontSize:'.82rem', color:'var(--muted)', fontFamily:'var(--font-mono)', fontSize:'.72rem', letterSpacing:'.05em', textTransform:'uppercase' }}>{k}</span>
              <span style={{ fontSize:'.88rem', fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Message */}
        <div className="card">
          <h3 style={{ fontSize:'.9rem', fontWeight:600, marginBottom:'1rem' }}>Message</h3>
          <p style={{ fontSize:'.88rem', color:'var(--ink)', lineHeight:1.75, whiteSpace:'pre-wrap' }}>{lead.message}</p>
        </div>

        {/* Update status */}
        <div className="card">
          <h3 style={{ fontSize:'.9rem', fontWeight:600, marginBottom:'1rem' }}>Update status</h3>
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => updateStatus(s)} className={`btn btn-sm badge badge-${s}`}
                style={{ border: lead.status === s ? '2px solid var(--ink)' : '1px solid transparent', cursor:'pointer', fontFamily:'var(--font-body)' }}>
                {s.charAt(0).toUpperCase()+s.slice(1)} {lead.status===s && '✓'}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <h3 style={{ fontSize:'.9rem', fontWeight:600, marginBottom:'1rem' }}>Internal notes</h3>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add notes about this lead…" style={{ width:'100%', minHeight:100, padding:'.75rem', background:'var(--cream)', border:'1.5px solid var(--border)', borderRadius:10, fontSize:'.88rem', outline:'none', resize:'vertical', fontFamily:'var(--font-body)' }}/>
          <button onClick={saveNotes} className="btn btn-dark btn-sm" style={{ marginTop:'.75rem' }} disabled={saving}>
            {saving ? 'Saving…' : 'Save notes'}
          </button>
        </div>
      </div>
    </div>
  );
}
