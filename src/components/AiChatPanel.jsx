'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

export default function AiChatPanel({ bookTitle, bookSubject, bookLevel }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Γεια! Ειμαι ο AI βοηθος σου για το βιβλιο "' + bookTitle + '". Τι θελεις να μαθεις;' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg, bookTitle, bookSubject, bookLevel }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.answer || data.error }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Κατι πηγε στραβα. Δοκιμασε ξανα.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}
          style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1a4fa8, #3b82f6)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(26,79,168,0.4)', zIndex: 1001, fontSize: 24 }}>
          AI
        </button>
      )}
      {isOpen && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, width: 380, height: 520, background: '#fff', borderRadius: 20, boxShadow: '0 12px 40px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', zIndex: 1001, overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a4fa8, #3b82f6)', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>AI Βοηθος</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>X</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, background: '#f8fafc' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.role === 'user' ? '#1a4fa8' : 'white', color: m.role === 'user' ? 'white' : '#1e293b', fontSize: 13, lineHeight: 1.6, border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none' }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 13 }}>Σκεφτομαι...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Γραψε την ερωτηση σου..."
              style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: 12, padding: '10px 14px', fontSize: 13, outline: 'none' }} />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              style={{ width: 38, height: 38, borderRadius: 10, background: input.trim() ? '#1a4fa8' : '#e2e8f0', color: input.trim() ? 'white' : '#94a3b8', border: 'none', cursor: input.trim() ? 'pointer' : 'default', fontSize: 16 }}>
              &gt;
            </button>
          </div>
        </div>
      )}
    </>
  );
}