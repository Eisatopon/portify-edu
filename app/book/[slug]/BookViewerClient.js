'use client';
import { useState, useEffect } from 'react';
import { LEVEL_BADGE } from '@/src/lib/constants';
import AiChatPanel from '@/src/components/AiChatPanel';
import Link from 'next/link';

export default function BookViewerClient({ book }) {
  const [aiOpen, setAiOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const lc = LEVEL_BADGE[book.level];

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
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
      <nav aria-label="breadcrumb" style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        <Link href="/" style={{ color: 'inherit' }}>Αρχική</Link>
        <span aria-hidden="true"> › </span>
        <Link href={`/?level=${book.level}`} style={{ color: 'inherit' }}>{lc?.label}</Link>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">{book.subject}</span>
      </nav>

      <article style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' }}>
        <div>
          {book.thumbnail
            ? <img src={book.thumbnail} alt={`Εξώφυλλο: ${book.title}`} style={{ width: '100%', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} loading="lazy" />
            : <div style={{ width: '100%', aspectRatio: '5/7', background: '#f1f5f9', borderRadius: 8 }} aria-hidden="true" />
          }
        </div>
        <div>
          <span style={{ display: 'inline-block', background: lc?.bg, color: lc?.text, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20, marginBottom: 12 }}>{lc?.label}</span>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1.2, marginBottom: 12 }}>{book.title}</h1>
          <p style={{ fontSize: 15, color: '#475569', marginBottom: 6 }}><strong>Μάθημα:</strong> {book.subject}</p>
          <p style={{ fontSize: 15, color: '#475569', marginBottom: 6 }}><strong>Τάξη:</strong> {book.gradeLabel}</p>
          <p style={{ fontSize: 15, color: '#475569', marginBottom: 24 }}><strong>Εκδόσεις:</strong> {book.publisher}</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href={`/api/pdf?url=${encodeURIComponent(book.pdfUrl)}`} target="_blank" rel="noopener noreferrer"
              style={{ background: '#1a4fa8', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>
              Άνοιξε το PDF
            </a>
            <button onClick={() => setAiOpen(true)} aria-label="Άνοιξε τον AI βοηθό"
              style={{ background: '#f0f4ff', color: '#1a4fa8', border: '1px solid #c7d7f5', padding: '12px 20px', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              Ρώτησε τον AI βοηθό
            </button>
            <button onClick={toggleFav} aria-label={fav ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'} aria-pressed={fav}
              style={{ background: fav ? '#fff7ed' : '#fff', color: fav ? '#c2410c' : '#475569', border: `1px solid ${fav ? '#fed7aa' : '#e2e8f0'}`, padding: '12px 20px', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              <span aria-hidden="true">{fav ? '❤️' : '🤍'}</span> {fav ? 'Στα αγαπημένα' : 'Αγαπημένο'}
            </button>
          </div>
        </div>
      </article>

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
