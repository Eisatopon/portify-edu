'use client';
import { useState, useEffect } from 'react';
import { LEVEL_BADGE } from '@/src/lib/constants';
import AiChatPanel from '@/src/components/AiChatPanel';
import Link from 'next/link';

export default function BookViewerClient({ book }) {
  const [aiOpen, setAiOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const lc = LEVEL_BADGE[book.level];
  const pdfSrc = '/api/pdf?url=' + encodeURIComponent(book.pdfUrl);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('portify_favs_v2') || '[]');
      setFav(favs.includes(book.id));
    } catch {}
  }, [book.id]);

  function toggleFav() {
    try {
      const favs = JSON.parse(localStorage.getItem('portify_favs_v2') || '[]');
      const next = favs.includes(book.id) ? favs.filter(i => i !== book.id) : [...favs, book.id];
      localStorage.setItem('portify_favs_v2', JSON.stringify(next));
      setFav(!fav);
    } catch {}
  }

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && aiOpen) setAiOpen(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aiOpen]);

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 16px' }}>
      {/* Breadcrumbs + back link */}
      <nav aria-label="breadcrumb" style={{ fontSize: 14, color: '#475569', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#1a4fa8', textDecoration: 'none', fontWeight: 500 }}>← Αρχική</Link>
        <span aria-hidden="true" style={{ color: '#cbd5e1' }}>·</span>
        <Link href={`/?level=${book.level}`} style={{ color: '#1a4fa8', textDecoration: 'none', fontWeight: 500 }}>
          {lc?.label}
        </Link>
        <span aria-hidden="true" style={{ color: '#cbd5e1' }}>·</span>
        <span style={{ color: '#64748b' }}>{book.subject}</span>
      </nav>

      {/* Book header — compact */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <span style={{ display: 'inline-block', background: lc?.bg, color: lc?.text, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, marginBottom: 6 }}>{lc?.label}</span>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', lineHeight: 1.25, marginBottom: 4 }}>{book.title}</h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>{book.subject} · {book.gradeLabel} · {book.publisher}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={() => setAiOpen(true)} aria-label="Άνοιξε τον AI βοηθό"
            style={{ background: '#f0f4ff', color: '#1a4fa8', border: '1px solid #c7d7f5', padding: '9px 16px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            AI Βοηθός
          </button>
          <button onClick={toggleFav} aria-label={fav ? 'Αφαίρεση' : 'Αποθήκευση'} aria-pressed={fav}
            style={{ background: fav ? '#fff7ed' : '#fff', color: fav ? '#c2410c' : '#475569', border: `1px solid ${fav ? '#fed7aa' : '#e2e8f0'}`, padding: '9px 14px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            <span aria-hidden="true">{fav ? '❤️' : '🤍'}</span>
          </button>
          <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" download
            style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0', padding: '9px 14px', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}
            aria-label="Κατέβασμα">
            ⬇
          </a>
        </div>
      </div>

      {/* Embedded PDF viewer */}
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 200px)', minHeight: 500, background: '#1e293b', borderRadius: 8, overflow: 'hidden' }}>
        {!pdfLoaded && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }} role="status">
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} aria-hidden="true" />
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Φόρτωση PDF…</p>
            </div>
          </div>
        )}
        <iframe
          src={pdfSrc}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title={book.title}
          onLoad={() => setPdfLoaded(true)}
        />
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {aiOpen && (
        <AiChatPanel
          bookTitle={book.title}
          bookSubject={book.subject}
          bookLevel={book.level}
          onClose={() => setAiOpen(false)}
        />
      )}
    </main>
  );
}
