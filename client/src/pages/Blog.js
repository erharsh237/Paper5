import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';


const CATS = ['All','SEO','Social Media','PPC','Content','Email','Strategy','News'];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (cat !== 'All') params.category = cat;
    if (search) params.search = search;
    axios.get('/api/posts', { params })
      .then(r => setPosts(r.data.posts))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [cat, search]);

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'6rem 2rem 5rem' }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:400, letterSpacing:'-.03em', marginBottom:'.5rem' }}>
          The <em style={{ fontStyle:'italic', fontWeight:300, background:'linear-gradient(135deg,#c026d3,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>blog</em>
        </h1>
        <p style={{ color:'var(--muted)', marginBottom:'2.5rem' }}>Insights, strategies and tips from the Paper5 team.</p>

        {/* Filters */}
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center', marginBottom:'2.5rem' }}>
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ padding:'.45rem 1rem', borderRadius:'100px', fontSize:'.8rem', fontWeight:500, border:'1.5px solid', cursor:'pointer', transition:'all .2s', background: cat===c ? 'var(--ink)' : 'white', color: cat===c ? 'white' : 'var(--muted)', borderColor: cat===c ? 'var(--ink)' : 'var(--border)' }}>{c}</button>
            ))}
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search posts…" style={{ marginLeft:'auto', padding:'.5rem 1rem', borderRadius:100, border:'1.5px solid var(--border)', background:'white', fontSize:'.85rem', outline:'none', width:200 }}/>
        </div>

        {loading ? (
          <p style={{ color:'var(--muted)' }}>Loading posts…</p>
        ) : posts.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--muted)' }}>
            <p style={{ fontSize:'1.1rem', marginBottom:'.5rem' }}>No posts found.</p>
            <p style={{ fontSize:'.88rem' }}>Check back soon or try a different filter.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.4rem' }}>
            {posts.map(p => (
              <Link key={p._id} to={`/blog/${p.slug}`}
                style={{ display:'block', background:'white', borderRadius:16, border:'1px solid var(--border)', overflow:'hidden', textDecoration:'none', transition:'all .3s' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(26,18,8,.1)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>

                {/* Cover image */}
                {p.coverImage ? (
                  <img src={p.coverImage} alt={p.title} style={{ width:'100%', height:180, objectFit:'cover', display:'block' }}
                    onError={e=>{ e.target.style.display='none'; }}/>
                ) : (
                  <div style={{ width:'100%', height:180, background:`linear-gradient(135deg,${['#c026d3','#7c3aed','#1d4ed8','#0891b2','#059669'][Math.floor(Math.random()*5)]},${['#a78bfa','#818cf8','#38bdf8','#34d399','#fbbf24'][Math.floor(Math.random()*5)]})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:600, color:'rgba(255,255,255,0.3)' }}>p5</span>
                  </div>
                )}

                <div style={{ padding:'1.2rem' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.7rem' }}>
                    <span className="badge badge-published">{p.category}</span>
                    <span style={{ fontSize:'.7rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{new Date(p.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                  </div>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem', fontWeight:400, letterSpacing:'-.02em', marginBottom:'.5rem', lineHeight:1.3, color:'var(--ink)' }}>{p.title}</h3>
                  <p style={{ fontSize:'.82rem', color:'var(--muted)', lineHeight:1.65, marginBottom:'1rem' }}>{p.excerpt.substring(0,100)}…</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:'.78rem', color:'var(--p2)', fontWeight:600 }}>Read more →</span>
                    <span style={{ fontSize:'.7rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{p.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer style={{ background:'var(--ink)', padding:'2rem', textAlign:'center' }}>
        <p style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', fontFamily:'var(--font-mono)' }}>© 2026 Paper5 · paper5.co</p>
      </footer>
 
    </div>
  );
}
