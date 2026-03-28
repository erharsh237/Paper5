import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import RichEditor from '../../components/RichEditor';

const CATS = ['SEO','Social Media','PPC','Content','Email','Strategy','News'];

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState({
    title:'', excerpt:'', content:'',
    category:'Strategy', tags:'', coverImage:'', status:'draft',
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!isNew) {
      axios.get('/api/posts/admin')
        .then(r => {
          const post = r.data.posts.find(p => p._id === id);
          if (post) setForm({
            title: post.title, excerpt: post.excerpt, content: post.content,
            category: post.category, tags: (post.tags||[]).join(', '),
            coverImage: post.coverImage||'', status: post.status,
          });
        })
        .catch(() => toast.error('Failed to load post'));
    }
  }, [id, isNew]);

  const handleSave = async (statusOverride) => {
    if (!form.title || !form.excerpt || !form.content) {
      toast.error('Title, excerpt and content are required'); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, status: statusOverride||form.status, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) };
      if (isNew) { await axios.post('/api/posts', payload); toast.success('Post created!'); }
      else        { await axios.put(`/api/posts/${id}`, payload); toast.success('Post updated!'); }
      navigate('/admin/posts');
    } catch (err) { toast.error(err.response?.data?.message||'Failed to save'); }
    finally { setSaving(false); }
  };

  const f = (field, val) => setForm(p => ({ ...p, [field]: val }));
  const wordCount = form.content.replace(/<[^>]+>/g,'').split(/\s+/).filter(Boolean).length;

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <Link to="/admin/posts" style={{ fontSize:'.82rem', color:'var(--muted)', fontFamily:'var(--font-mono)', display:'block', marginBottom:'.4rem' }}>← Back to posts</Link>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:400, letterSpacing:'-.03em' }}>{isNew ? 'New post' : 'Edit post'}</h1>
        </div>
        <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
          <button onClick={() => setPreview(!preview)} className="btn btn-outline btn-sm">{preview ? '✏️ Edit' : '👁 Preview'}</button>
          <button onClick={() => handleSave('draft')} className="btn btn-outline" disabled={saving}>Save draft</button>
          <button onClick={() => handleSave('published')} className="btn btn-dark" disabled={saving}>{saving ? 'Saving…' : '🚀 Publish'}</button>
        </div>
      </div>

      {preview ? (
        <div className="card" style={{ maxWidth:760 }}>
          {form.coverImage && !imgError && (
            <img src={form.coverImage} alt="cover" onError={()=>setImgError(true)} style={{ width:'100%', height:280, objectFit:'cover', borderRadius:10, marginBottom:'1.5rem' }}/>
          )}
          <span className="badge badge-draft" style={{ marginBottom:'1rem', display:'inline-block' }}>{form.category}</span>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', fontWeight:400, letterSpacing:'-.03em', marginBottom:'1rem', lineHeight:1.1 }}>{form.title||'Untitled'}</h2>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontStyle:'italic', color:'var(--muted)', marginBottom:'2rem', lineHeight:1.6 }}>{form.excerpt}</p>
          <div style={{ fontSize:'1rem', lineHeight:1.85 }} dangerouslySetInnerHTML={{ __html: form.content }}/>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'1.5rem', alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="card">
              <div className="form-group" style={{ marginBottom:0 }}>
                <label>Post title</label>
                <input value={form.title} onChange={e=>f('title',e.target.value)} placeholder="How to rank #1 on Google in 2026…" style={{ fontSize:'1.1rem', fontFamily:'var(--font-display)', fontWeight:400 }}/>
              </div>
            </div>
            <div className="card">
              <div className="form-group" style={{ marginBottom:0 }}>
                <label>Excerpt (shown in blog listing)</label>
                <textarea value={form.excerpt} onChange={e=>f('excerpt',e.target.value)} placeholder="A short compelling summary…" style={{ minHeight:80 }}/>
              </div>
            </div>
            <div className="card">
              <label style={{ fontFamily:'var(--font-mono)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', display:'block', marginBottom:'.6rem' }}>Content</label>
              <RichEditor value={form.content} onChange={val=>f('content',val)}/>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="card">
              <h3 style={{ fontSize:'.88rem', fontWeight:600, marginBottom:'1rem' }}>Publish settings</h3>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e=>f('status',e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <span className={`badge badge-${form.status}`}>{form.status}</span>
            </div>

            <div className="card">
              <h3 style={{ fontSize:'.88rem', fontWeight:600, marginBottom:'1rem' }}>Cover image</h3>
              <div className="form-group" style={{ marginBottom: form.coverImage ? '.75rem' : 0 }}>
                <label>Image URL</label>
                <input value={form.coverImage} onChange={e=>{f('coverImage',e.target.value);setImgError(false);}} placeholder="https://images.unsplash.com/…"/>
              </div>
              {form.coverImage && !imgError && (
                <img src={form.coverImage} alt="Cover preview" onError={()=>setImgError(true)} style={{ width:'100%', height:130, objectFit:'cover', borderRadius:8, border:'1px solid var(--border)' }}/>
              )}
              {imgError && <p style={{ fontSize:'.75rem', color:'#dc2626' }}>⚠️ Could not load image — check the URL</p>}
              <p style={{ fontSize:'.72rem', color:'var(--muted)', marginTop:'.5rem', lineHeight:1.5 }}>
                Paste any image URL. Use <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color:'var(--p2)' }}>Unsplash</a> for free photos.
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize:'.88rem', fontWeight:600, marginBottom:'1rem' }}>Organisation</h3>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e=>f('category',e.target.value)}>
                  {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom:0 }}>
                <label>Tags (comma separated)</label>
                <input value={form.tags} onChange={e=>f('tags',e.target.value)} placeholder="seo, google, ranking"/>
              </div>
            </div>

            <div className="card" style={{ padding:'1rem' }}>
              {[['Words', wordCount],['Est. read time', `${Math.max(1,Math.ceil(wordCount/200))} min`]].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'.3rem 0' }}>
                  <span style={{ fontSize:'.75rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{k}</span>
                  <span style={{ fontSize:'.75rem', fontWeight:600, fontFamily:'var(--font-mono)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
