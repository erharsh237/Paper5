import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// Generated once per page load (module scope), never persisted to storage —
// a hard refresh re-runs this module, so every refresh is a genuinely new conversation.
const sessionId = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const GREETING = "Hi! I'm the Paper5 assistant. Ask me about our services, pricing, or anything else on the site.";

export default function ChatWidget() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: text }]);
    setSending(true);
    try {
      const { data } = await axios.post('/api/chat', {
        sessionId,
        message: text,
        page: location.pathname,
      });
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      const fallback = err?.response?.data?.message || "Sorry, something went wrong. Please try the contact form below.";
      setMessages(m => [...m, { role: 'assistant', content: fallback }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Hide on admin and login routes — this widget is for public-facing visitors
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') return null;

  return (
    <>
      <button onClick={() => setOpen(o => !o)} aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position:'fixed', bottom:28, right:28, zIndex:999,
          width:60, height:60, borderRadius:'50%', border:'none', cursor:'pointer',
          background:'var(--ink)', color:'white',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 20px rgba(26,18,8,.25)', transition:'all .25s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}>
        {open ? (
          <span style={{ fontSize:22, lineHeight:1 }}>✕</span>
        ) : (
          <span style={{ fontSize:24, lineHeight:1 }}>💬</span>
        )}
      </button>

      {open && (
        <div style={{
          position:'fixed', bottom:100, right:28, zIndex:998,
          width:360, maxWidth:'calc(100vw - 40px)', height:480, maxHeight:'calc(100vh - 140px)',
          background:'white', borderRadius:20, boxShadow:'0 12px 40px rgba(26,18,8,.18)',
          border:'1px solid var(--border)', display:'flex', flexDirection:'column', overflow:'hidden',
        }}>
          <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'.6rem' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#c026d3,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>🌐</div>
            <div>
              <p style={{ fontWeight:600, fontSize:'.88rem', margin:0 }}>Paper5 Assistant</p>
              <p style={{ fontSize:'.72rem', color:'var(--muted)', margin:0 }}>Usually replies in seconds</p>
            </div>
          </div>

          <div ref={scrollRef} style={{ flex:1, overflowY:'auto', padding:'1rem 1.1rem', display:'flex', flexDirection:'column', gap:'.6rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth:'85%', padding:'.6rem .85rem', borderRadius:14, fontSize:'.85rem', lineHeight:1.5,
                background: m.role === 'user' ? 'var(--ink)' : 'var(--cream)',
                color: m.role === 'user' ? 'white' : 'var(--ink)',
              }}>
                {m.content}
              </div>
            ))}
            {sending && (
              <div style={{ alignSelf:'flex-start', padding:'.6rem .85rem', borderRadius:14, background:'var(--cream)', fontSize:'.85rem', color:'var(--muted)' }}>
                Typing…
              </div>
            )}
          </div>

          <div style={{ borderTop:'1px solid var(--border)', padding:'.75rem', display:'flex', gap:'.5rem' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our services…"
              disabled={sending}
              style={{ flex:1, padding:'.6rem .9rem', borderRadius:100, border:'1px solid var(--border)', fontSize:'.85rem', outline:'none', fontFamily:'var(--font-body)', background:'var(--cream)' }}
            />
            <button onClick={send} disabled={sending || !input.trim()}
              style={{ width:38, height:38, borderRadius:'50%', border:'none', background:'var(--ink)', color:'white', cursor: sending ? 'default' : 'pointer', flexShrink:0, opacity: !input.trim() ? .5 : 1 }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
