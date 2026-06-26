'use client';
import { useState, useRef, useEffect } from 'react';

export default function BookChat({ bookTitle, pdfUrl }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Γεια! Είμαι έτοιμος για το βιβλίο "${bookTitle}". Γράψε την απορία σου!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function ask() {
    const question = input.trim();
    if (!question || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, pdfUrl }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.answer || data.error || 'Κάτι πήγε στραβά.'
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Σφάλμα σύνδεσης. Δοκίμασε ξανά.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f172a' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
        <div>
          <p style={{ margin: 0, color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>AI Βοηθός</p>
          <p style={{ margin: 0, color: '#10b981', fontSize: 11 }}>Διαβάζει το βιβλίο</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-start' }}>
            {msg.role === 'ai' && (
              <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, marginTop: 2 }}>🤖</div>
            )}
            <div style={{
              maxWidth: '82%',
              background: msg.role === 'user' ? '#6366f1' : '#1e293b',
              color: '#e2e8f0',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              padding: '8px 12px', fontSize: 13, lineHeight: 1.55,
              border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.06)' : 'none',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🤖</div>
            <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px 12px 12px 2px', padding: '10px 14px', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8, flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Γράψε την απορία σου..."
          disabled={loading}
          style={{ flex: 1, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '8px 14px', color: '#e2e8f0', fontSize: 13, outline: 'none', opacity: loading ? 0.6 : 1 }}
        />
        <button
          onClick={ask}
          disabled={!input.trim() || loading}
          style={{ background: input.trim() && !loading ? '#6366f1' : '#1e293b', color: input.trim() && !loading ? '#fff' : '#475569', border: 'none', borderRadius: '50%', width: 36, height: 36, flexShrink: 0, fontSize: 16, cursor: 'pointer', transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >↑</button>
      </div>

      <style>{`@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }`}</style>
    </div>
  );
}