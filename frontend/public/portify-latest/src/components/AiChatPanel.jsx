'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

const QUICK_PROMPTS = [
  { label: '📝 Ασκήσεις', text: 'Δώσε μου μερικές ασκήσεις για εξάσκηση πάνω σε αυτό το κεφάλαιο' },
  { label: '💡 Εξήγησέ μου', text: 'Εξήγησέ μου απλά και κατανοητά το βασικό περιεχόμενο του κεφαλαίου' },
  { label: '📄 Περίληψη', text: 'Κάνε μου μια σύντομη περίληψη' },
  { label: '❓ Ερωτήσεις', text: 'Γράψε μου ερωτήσεις για να εξασκηθώ' },
];

const GENERAL_PROMPTS = [
  { label: '📚 Ποιο βιβλίο;', text: 'Σε ποιο σχολικό βιβλίο θα βρω την ύλη για τα κλάσματα;' },
  { label: '💡 Εξήγησέ μου', text: 'Εξήγησέ μου απλά μια έννοια που δυσκολεύομαι' },
  { label: '📝 Ασκήσεις', text: 'Δώσε μου ασκήσεις για εξάσκηση σε ένα μάθημα' },
  { label: '❓ Πανελλαδικές', text: 'Τι ύλη πέφτει στις Πανελλαδικές στα Μαθηματικά;' },
];

function katexNode(content, display, key) {
  if (typeof window !== 'undefined' && window.katex) {
    try {
      const html = window.katex.renderToString(content, { throwOnError: false, trust: false, displayMode: display });
      return display
        ? <div key={key} style={{ overflowX: 'auto', margin: '6px 0' }} dangerouslySetInnerHTML={{ __html: html }} />
        : <span key={key} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch { /* fall through */ }
  }
  return display ? <div key={key}>{content}</div> : <span key={key}>{content}</span>;
}

// Inline parser: handles $$display$$, $inline$ math and **bold**.
function parseInline(str) {
  const nodes = [];
  const re = /(\$\$[\s\S]+?\$\$)|(\$[^$\n]+?\$)|(\*\*[^*\n]+?\*\*)/g;
  let last = 0, m, key = 0;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) nodes.push(str.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('$$')) nodes.push(katexNode(tok.slice(2, -2), true, 'd' + key++));
    else if (tok.startsWith('$')) nodes.push(katexNode(tok.slice(1, -1), false, 'i' + key++));
    else nodes.push(<strong key={'b' + key++}>{tok.slice(2, -2)}</strong>);
    last = m.index + tok.length;
  }
  if (last < str.length) nodes.push(str.slice(last));
  return nodes;
}

// Block parser: paragraphs + bullet / numbered lists.
function renderRich(text) {
  const lines = String(text || '').split('\n');
  const blocks = [];
  let list = null;
  const flush = () => { if (list) { blocks.push(list); list = null; } };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) { flush(); continue; }
    const ul = line.match(/^\s*[-•]\s+(.*)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ul) { if (!list || list.type !== 'ul') { flush(); list = { type: 'ul', items: [] }; } list.items.push(ul[1]); }
    else if (ol) { if (!list || list.type !== 'ol') { flush(); list = { type: 'ol', items: [] }; } list.items.push(ol[1]); }
    else { flush(); blocks.push({ type: 'p', text: line.trim() }); }
  }
  flush();
  return blocks.map((b, i) => {
    if (b.type === 'p') {
      // A paragraph that is entirely bold becomes an underlined "notebook" heading.
      const headingMatch = b.text.match(/^\*\*([^*]+)\*\*$/);
      if (headingMatch) {
        return <p key={i} style={{ margin: '0 0 14px', fontWeight: 700, color: '#1a4fa8', borderBottom: '2px solid #cfe0f5', paddingBottom: 3, display: 'inline-block' }}>{headingMatch[1]}</p>;
      }
      return <p key={i} style={{ margin: '0 0 12px' }}>{parseInline(b.text)}</p>;
    }
    const Tag = b.type === 'ul' ? 'ul' : 'ol';
    return (
      <Tag key={i} style={{ margin: '0 0 12px', paddingLeft: 22 }}>
        {b.items.map((it, j) => <li key={j} style={{ margin: '0 0 6px' }}>{parseInline(it)}</li>)}
      </Tag>
    );
  });
}

function Message({ m, katexReady }) {
  const [rich, setRich] = useState(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (m.role !== 'assistant') return;
    setRich(renderRich(m.text));
  }, [m.text, m.role, katexReady]);

  const copy = useCallback(() => {
    try {
      navigator.clipboard.writeText(String(m.text || ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }, [m.text]);

  const isUser = m.role === 'user';
  const bubble = isUser
    ? { maxWidth: '85%', padding: '9px 13px', borderRadius: '16px 16px 4px 16px', background: '#1a4fa8', color: 'white', fontSize: 13.5, lineHeight: 1.6 }
    : {
        maxWidth: '88%', padding: '14px 16px 12px', borderRadius: '4px 16px 16px 16px', color: '#2b2b2b',
        fontSize: 14, lineHeight: '28px', border: '1px solid #efe6cf', borderLeft: '3px solid #e07a7a',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)', position: 'relative',
        background: 'repeating-linear-gradient(#fffdf5, #fffdf5 27px, #eaf1fb 28px)',
        backgroundAttachment: 'local',
      };

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={bubble} data-testid={isUser ? 'ai-msg-user' : 'ai-msg-assistant'}>
        {isUser ? m.text : (rich || m.text)}
        {!isUser && Array.isArray(m.sources) && m.sources.length > 0 && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed #e0d6bd' }} data-testid="ai-sources">
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8a7a52', marginBottom: 6, letterSpacing: 0.3, lineHeight: 1.5 }}>📎 ΕΠΙΣΗΜΟ ΨΗΦΙΑΚΟ ΥΛΙΚΟ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {m.sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" data-testid={`ai-source-link-${i}`}
                  style={{ fontSize: 12.5, color: '#1a4fa8', textDecoration: 'none', lineHeight: 1.4, fontWeight: 500 }}>
                  → {s.title}{s.page ? ` (σελ. ${s.page})` : ''}
                </a>
              ))}
            </div>
          </div>
        )}
        {!isUser && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={copy} aria-label="Αντιγραφή" data-testid="ai-copy-btn"
              style={{ background: copied ? '#dcfce7' : 'transparent', border: '1px solid ' + (copied ? '#bbf7d0' : '#e5ddc6'), borderRadius: 8, padding: '3px 9px', fontSize: 11, cursor: 'pointer', color: copied ? '#166534' : '#94886a', lineHeight: 1.5, fontFamily: 'inherit' }}>
              {copied ? '✓ Αντιγράφηκε' : '📋 Αντιγραφή'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AiChatPanel({ bookTitle, bookSubject, bookLevel, bitstreamId, onClose }) {
  const [isOpen, setIsOpen] = useState(true);
  const safeTitle = (bookTitle || '').replace(/"/g, '\u201C');
  const promptList = bookTitle ? QUICK_PROMPTS : GENERAL_PROMPTS;
  const [messages, setMessages] = useState([
    { id: 0, role: 'assistant', text: bookTitle
        ? `Γεια! Είμαι ο AI βοηθός σου για το βιβλίο «${safeTitle}». Τι θέλεις να μάθεις;`
        : 'Γεια! 👋 Είμαι ο AI βοηθός του Portify. Ρώτησέ με για οποιοδήποτε σχολικό βιβλίο, μάθημα ή άσκηση — Δημοτικό, Γυμνάσιο ή Λύκειο!' }
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

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose && onClose();
  }, [onClose]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') handleClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  const sendMessage = useCallback(async (textArg) => {
    const raw = (typeof textArg === 'string' ? textArg : input).trim();
    if (!raw || loading) return;
    const userMsg = raw.slice(0, 600);
    setInput('');
    setMessages(prev => [...prev, { id: msgIdRef.current++, role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg, bookTitle, bookSubject, bookLevel, bitstreamId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) {
        setMessages(prev => [...prev, { id: msgIdRef.current++, role: 'assistant', text: data.error || 'Πολλά αιτήματα. Δοκίμασε σε λίγο.' }]);
      } else if (!res.ok) {
        setMessages(prev => [...prev, { id: msgIdRef.current++, role: 'assistant', text: data.error || 'Κάτι πήγε στραβά. Δοκίμασε ξανά.' }]);
      } else {
        setMessages(prev => [...prev, { id: msgIdRef.current++, role: 'assistant', text: data.answer, sources: data.sources || [] }]);
      }
    } catch {
      setMessages(prev => [...prev, { id: msgIdRef.current++, role: 'assistant', text: 'Σφάλμα δικτύου. Δοκίμασε ξανά.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, bookTitle, bookSubject, bookLevel, bitstreamId]);

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
      <div className="ai-panel" style={panelStyle} role="dialog" aria-label="AI Βοηθός" aria-modal="true">
        <div style={{ background: 'linear-gradient(135deg, #1a4fa8, #3b82f6)', color: 'white', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>AI Βοηθός</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{bookTitle || 'Όλα τα βιβλία · Δημοτικό–Λύκειο'}</div>
          </div>
          <button onClick={handleClose} aria-label="Κλείσιμο" style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: '#f8fafc' }} aria-live="polite">
          {messages.map(m => <Message key={m.id} m={m} katexReady={katexReady} />)}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '9px 13px', borderRadius: '16px 16px 16px 4px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 13 }} role="status">Σκέφτομαι…</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '10px 14px', background: 'white', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, WebkitOverflowScrolling: 'touch' }} data-testid="ai-quick-prompts">
            {promptList.map((qp, i) => (
              <button key={i} onClick={() => sendMessage(qp.text)} disabled={loading} data-testid={`ai-quick-prompt-${i}`}
                style={{ flexShrink: 0, whiteSpace: 'nowrap', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 999, padding: '6px 12px', fontSize: 12, color: '#334155', cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.5 : 1 }}>
                {qp.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <label htmlFor="ai-input" style={{ position: 'absolute', left: -9999 }}>Ερώτηση</label>
            <input
              id="ai-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
              disabled={loading}
              maxLength={600}
              placeholder="Γράψε την ερώτησή σου…"
              style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: 12, padding: '9px 13px', fontSize: 13, outline: 'none', opacity: loading ? 0.6 : 1 }}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} aria-label="Αποστολή"
              style={{ width: 36, height: 36, borderRadius: 10, background: input.trim() && !loading ? '#1a4fa8' : '#e2e8f0', color: input.trim() && !loading ? 'white' : '#94a3b8', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default', fontSize: 18, flexShrink: 0 }}>
              ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
