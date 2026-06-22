'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

function renderWithKatex(text) {
  if (typeof window === 'undefined' || !window.katex) return null;

  const segments = [];
  const displayRegex = /\$\$([\s\S]+?)\$\$/g;
  let lastIndex = 0;
  let match;

  while ((match = displayRegex.exec(text)) !== null) {
    if (match.index > lastIndex) segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    segments.push({ type: 'display', content: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) segments.push({ type: 'text', content: text.slice(lastIndex) });

  const katexOptions = { throwOnError: false, trust: false };

  return segments.map((seg, si) => {
    if (seg.type === 'display') {
      try {
        return <div key={si} style={{ overflowX: 'auto', margin: '6px 0' }}
          dangerouslySetInnerHTML={{ __html: window.katex.renderToString(seg.content, { ...katexOptions, displayMode: true }) }} />;
      } catch { return <span key={si}>{seg.content}</span>; }
    }

    const inlineParts = [];
    const inlineRegex = /\$([\s\S]+?)\$/g;
    let li = 0;
    let im;
    while ((im = inlineRegex.exec(seg.content)) !== null) {
      if (im.index > li) inlineParts.push(seg.content.slice(li, im.index));
      try {
        inlineParts.push(
          <span key={li} dangerouslySetInnerHTML={{ __html: window.katex.renderToString(im[1], katexOptions) }} />
        );
      } catch { inlineParts.push(im[1]); }
      li = im.index + im[0].length;
    }
    if (li < seg.content.length) inlineParts.push(seg.content.slice(li));
    return <span key={si}>{inlineParts}</span>;
  });
}

function Message({ m, katexReady }) {
  const [rendered, setRendered] = useState(null);

  useEffect(() => {
    if (m.role !== 'assistant') return;
    const result = renderWithKatex(m.text);
    if (result) setRendered(result);
  }, [m.text, m.role, katexReady]);

  return (
    <div style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth: '85%', padding: '9px 13px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.role === 'user' ? '#1a4fa8' : 'white', color: m.role === 'user' ? 'white' : '#1e293b', fontSize: 13, lineHeight: 1.6, border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none' }}>
        {rendered || m.text}
      </div>
    </div>
  );
}

export default function AiChatPanel({ bookTitle, bookSubject, bookLevel, onClose }) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    { id: 0, role: 'assistant', text: 'Γεια! Ειμαι ο AI βοηθος σου για το βιβλιο "' + (bookTitle || '').replace(/"/g, "'") + '". Τι θελεις να μαθεις;' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [katexReady, setKatexReady] = useState(false);
  const messagesEndRef = useRef(null);
  const msgIdRef = useRef(1);

  useEffect(() => {
    if (window.katex) { setKatexReady(true); return; }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.onload = () => setKatexReady(true);
    script.onerror = () => console.warn('KaTeX failed to load');
    document.head.appendChild(script);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: msgIdRef.current++, role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg, bookTitle, bookSubject, bookLevel }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      setMessages(prev => [...prev, { id: msgIdRef.current++, role: 'assistant', text: data.answer || data.error }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: msgIdRef.current++, role: 'assistant', text: 'Κατι πηγε στραβα. Δοκιμασε ξανα.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, bookTitle, bookSubject, bookLevel]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose && onClose();
  }, [onClose]);

  const panelStyle = {
    position: 'fixed', bottom: 0, right: 0, width: '100%', maxWidth: 420,
    height: '70vh', maxHeight: 560, background: '#fff',
    borderRadius: '20px 20px 0 0', boxShadow: '0 -4px 40px rgba(0,0,0,0.2)',
    display: 'flex', flexDirection: 'column', zIndex: 1001, overflow: 'hidden',
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`@media (min-width: 640px) { .ai-panel { bottom: 24px !important; right: 24px !important; border-radius: 20px !important; height: 520px !important; } }`}</style>
      <div className="ai-panel" style={panelStyle} role="dialog" aria-label="AI Βοηθος">
        <div style={{ background: 'linear-gradient(135deg, #1a4fa8, #3b82f6)', color: 'white', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>AI Βοηθος</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{bookTitle}</div>
          </div>
          <button onClick={handleClose} aria-label="Κλεισιμο" style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: '#f8fafc' }}>
          {messages.map(m => <Message key={m.id} m={m} katexReady={katexReady} />)}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '9px 13px', borderRadius: '16px 16px 16px 4px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 13 }}>Σκεφτομαι...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '10px 14px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8, flexShrink: 0 }}>
          <label htmlFor="ai-input" style={{ display: 'none' }}>Ερωτηση</label>
          <input
            id="ai-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
            disabled={loading}
            placeholder="Γραψε την ερωτηση σου..."
            style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: 12, padding: '9px 13px', fontSize: 13, outline: 'none', opacity: loading ? 0.6 : 1 }}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()} aria-label="Αποστολη"
            style={{ width: 36, height: 36, borderRadius: 10, background: input.trim() && !loading ? '#1a4fa8' : '#e2e8f0', color: input.trim() && !loading ? 'white' : '#94a3b8', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default', fontSize: 18, flexShrink: 0 }}>
            ›
          </button>
        </div>
      </div>
    </>
  );
}
