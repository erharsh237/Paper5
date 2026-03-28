import React, { useEffect, useRef } from 'react';

// Loads Quill from CDN dynamically — no npm install needed
const QUILL_CSS = 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css';
const QUILL_JS  = 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js';

let quillLoaded = false;
let loadCallbacks = [];

function loadQuill(cb) {
  if (window.Quill) { cb(); return; }
  if (quillLoaded) { loadCallbacks.push(cb); return; }
  quillLoaded = true;

  // CSS
  if (!document.querySelector(`link[href="${QUILL_CSS}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = QUILL_CSS;
    document.head.appendChild(link);
  }

  // JS
  const script = document.createElement('script');
  script.src = QUILL_JS;
  script.onload = () => { cb(); loadCallbacks.forEach(f => f()); loadCallbacks = []; };
  document.head.appendChild(script);
}

const TOOLBAR = [
  [{ header: [2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['blockquote', 'code-block'],
  ['link'],
  ['clean'],
];

export default function RichEditor({ value, onChange }) {
  const containerRef = useRef();
  const quillRef    = useRef();
  const valueRef    = useRef(value);

  useEffect(() => {
    loadQuill(() => {
      if (quillRef.current) return; // already initialised

      const quill = new window.Quill(containerRef.current, {
        theme: 'snow',
        modules: { toolbar: TOOLBAR },
        placeholder: 'Write your post here…',
      });

      // Set initial content
      if (valueRef.current) {
        quill.clipboard.dangerouslyPasteHTML(valueRef.current);
      }

      quill.on('text-change', () => {
        const html = containerRef.current.querySelector('.ql-editor').innerHTML;
        onChange(html === '<p><br></p>' ? '' : html);
      });

      quillRef.current = quill;
    });
  }, []); // eslint-disable-line

  // Sync external value changes (e.g. loading existing post)
  useEffect(() => {
    if (!quillRef.current) return;
    if (value === valueRef.current) return;
    valueRef.current = value;
    const editor = containerRef.current?.querySelector('.ql-editor');
    if (editor && editor.innerHTML !== value) {
      quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
    }
  }, [value]);

  return (
    <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border)' }}>
      <style>{`
        .ql-toolbar { border: none !important; border-bottom: 1.5px solid var(--border) !important; background: var(--cream); font-family: var(--font-body) !important; }
        .ql-container { border: none !important; font-family: var(--font-body) !important; font-size: 1rem !important; }
        .ql-editor { min-height: 380px; padding: 1.2rem 1.4rem; line-height: 1.85; color: var(--ink); }
        .ql-editor.ql-blank::before { color: var(--muted); font-style: normal; }
        .ql-editor h2 { font-family: var(--font-display); font-size: 1.6rem; font-weight: 400; margin: 1.5rem 0 .5rem; letter-spacing: -.02em; }
        .ql-editor h3 { font-family: var(--font-display); font-size: 1.25rem; font-weight: 400; margin: 1.2rem 0 .4rem; }
        .ql-editor p  { margin-bottom: .85rem; }
        .ql-editor blockquote { border-left: 3px solid var(--p2); margin: 1rem 0; padding: .5rem 1rem; color: var(--muted); font-style: italic; background: var(--cream2); }
        .ql-editor pre { background: #1a1208; color: #f0eeff; padding: 1rem; border-radius: 8px; font-family: var(--font-mono); font-size: .88rem; overflow-x: auto; }
        .ql-editor a  { color: var(--p2); text-decoration: underline; }
        .ql-snow .ql-picker { font-family: var(--font-body) !important; }
        .ql-snow .ql-stroke { stroke: var(--muted) !important; }
        .ql-snow .ql-fill   { fill: var(--muted) !important; }
        .ql-snow .ql-active .ql-stroke { stroke: var(--p2) !important; }
        .ql-snow .ql-active .ql-fill   { fill: var(--p2) !important; }
      `}</style>
      <div ref={containerRef} />
    </div>
  );
}
