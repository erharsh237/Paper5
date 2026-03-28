import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`/api/posts/${slug}`)
      .then(r => setPost(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--muted)' }}>Loading…</div>
  );
  if (error || !post) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
      <p style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--muted)' }}>Post not found.</p>
      <Link to="/blog" className="btn btn-outline">← Back to blog</Link>
    </div>
  );

  return (
    <div>
      <Navbar />
      <article style={{ maxWidth:760, margin:'0 auto', padding:'7rem 2rem 5rem' }}>
        <div style={{ marginBottom:'2rem' }}>
          <Link to="/blog" style={{ fontSize:'.82rem', color:'var(--muted)', fontFamily:'var(--font-mono)', letterSpacing:'.05em' }}>← Blog</Link>
        </div>
        <span className="badge badge-published" style={{ marginBottom:'1rem', display:'inline-block' }}>{post.category}</span>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:400, lineHeight:1.1, letterSpacing:'-.03em', marginBottom:'1rem' }}>{post.title}</h1>
        <p style={{ color:'var(--muted)', fontSize:'1.05rem', lineHeight:1.7, fontStyle:'italic', marginBottom:'1.5rem', fontFamily:'var(--font-display)' }}>{post.excerpt}</p>
        <div style={{ display:'flex', gap:'1.5rem', fontSize:'.78rem', color:'var(--muted)', fontFamily:'var(--font-mono)', paddingBottom:'2rem', borderBottom:'1px solid var(--border)', marginBottom:'2.5rem' }}>
          <span>By {post.author?.name || 'Paper5 Team'}</span>
          <span>{new Date(post.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
          <span>{post.views} views</span>
        </div>
        <div style={{ fontSize:'1rem', lineHeight:1.85, color:'var(--ink)' }} dangerouslySetInnerHTML={{ __html: post.content }}/>
        <div style={{ marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid var(--border)' }}>
          <Link to="/blog" className="btn btn-outline">← Back to blog</Link>
        </div>
      </article>
      <footer style={{ background:'var(--ink)', padding:'2rem', textAlign:'center' }}>
        <p style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', fontFamily:'var(--font-mono)' }}>© 2026 Paper5 · paper5.co</p>
      </footer>
    </div>
  );
}
