import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    axios.get('/api/posts/admin')
      .then(r => setPosts(r.data.posts))
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try { await axios.delete(`/api/posts/${id}`); toast.success('Post deleted'); fetchPosts(); }
    catch { toast.error('Failed to delete'); }
  };

  const toggleStatus = async (post) => {
    try {
      const status = post.status === 'published' ? 'draft' : 'published';
      await axios.put(`/api/posts/${post._id}`, { status });
      toast.success(`Post ${status}`);
      fetchPosts();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <h1 className="page-title">Blog Posts</h1>
          <p className="page-sub" style={{ margin:0 }}>{posts.length} posts total</p>
        </div>
        <Link to="/admin/posts/new" className="btn btn-dark">✍️ New post</Link>
      </div>

      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        {loading ? (
          <p style={{ padding:'2rem', color:'var(--muted)' }}>Loading…</p>
        ) : posts.length === 0 ? (
          <div style={{ padding:'3rem', textAlign:'center' }}>
            <p style={{ color:'var(--muted)', marginBottom:'1rem' }}>No posts yet.</p>
            <Link to="/admin/posts/new" className="btn btn-dark btn-sm">Write your first post →</Link>
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)', background:'var(--cream)' }}>
                {['Title','Category','Status','Views','Author','Date',''].map(h=>(
                  <th key={h} style={{ padding:'.75rem 1rem', textAlign:'left', fontSize:'.72rem', fontFamily:'var(--font-mono)', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', fontWeight:400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id} style={{ borderBottom:'1px solid var(--border)', transition:'background .15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--cream)'}
                  onMouseLeave={e=>e.currentTarget.style.background='white'}>
                  <td style={{ padding:'.75rem 1rem', fontSize:'.9rem', fontWeight:500, maxWidth:280 }}>
                    <p style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{post.title}</p>
                  </td>
                  <td style={{ padding:'.75rem 1rem', fontSize:'.82rem', color:'var(--muted)' }}>{post.category}</td>
                  <td style={{ padding:'.75rem 1rem' }}><span className={`badge badge-${post.status}`}>{post.status}</span></td>
                  <td style={{ padding:'.75rem 1rem', fontSize:'.82rem', fontFamily:'var(--font-mono)', color:'var(--muted)' }}>{post.views}</td>
                  <td style={{ padding:'.75rem 1rem', fontSize:'.82rem', color:'var(--muted)' }}>{post.author?.name}</td>
                  <td style={{ padding:'.75rem 1rem', fontSize:'.78rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding:'.75rem 1rem' }}>
                    <div style={{ display:'flex', gap:'.5rem' }}>
                      <Link to={`/admin/posts/${post._id}`} className="btn btn-outline btn-sm">Edit</Link>
                      <button onClick={()=>toggleStatus(post)} className="btn btn-sm" style={{ background:'var(--cream3)', border:'1px solid var(--border)', cursor:'pointer', borderRadius:100, fontSize:'.78rem', padding:'.4rem .85rem' }}>
                        {post.status==='published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={()=>deletePost(post._id)} className="btn btn-danger btn-sm">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
