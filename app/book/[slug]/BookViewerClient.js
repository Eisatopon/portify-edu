'use client';
import { useState, useEffect } from 'react';
import { LEVEL_BADGE } from '@/src/lib/constants';
import AiChatPanel from '@/src/components/AiChatPanel';
import SimilarBooks from '@/src/components/SimilarBooks';
import PackageSiblings from '@/src/components/PackageSiblings';
import SupplementaryMaterial from '@/src/components/SupplementaryMaterial';
import { recordVisit, getBookStats, timeAgoGreek } from '@/src/lib/readingHistory';
import allBooks from '@/src/data/books.json';
import Link from 'next/link';

export default function BookViewerClient({ book, psma = [] }) {
  const [aiOpen, setAiOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [stats, setStats] = useState(null);
  const [streakInfo, setStreakInfo] = useState(null);
  const lc = LEVEL_BADGE[book.level];
  // Load the PDF directly from the source (supports HTTP Range / progressive
  // loading). The /api/pdf proxy can't cache these large files (41MB+) on
  // Vercel's Data Cache, so it just added a slow extra hop — direct is faster.
  const pdfSrc = book.pdfUrl;

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('portify_favs_v2') || '[]');
      setFav(favs.includes(book.id));
    } catch {}
  }, [book.id]);

  // Recently viewed
  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem('portify_recent_v1') || '[]');
      const next = [book.id, ...prev.filter(i => i !== book.id)].slice(0, 12);
      localStorage.setItem('portify_recent_v1', JSON.stringify(next));
    } catch {}
  }, [book.id]);

  // Track visit + streak
  useEffect(() => {
    const prev = getBookStats(book.id); // count BEFORE incrementing
    const info = recordVisit(book.id);
    setStats(prev);
    setStreakInfo(info);
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

  async function shareBook() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: book.title, url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Αντιγράφηκε ο σύνδεσμος! 📋');
      } catch {}
    }
  }

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 16px' }}>
      <nav aria-label="breadcrumb" style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 500 }}>← Αρχική</Link>
        <span aria-hidden="true" style={{ color: 'var(--text-3)' }}>·</span>
        <Link href={`/?level=${book.level}`} style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 500 }}>
          {lc?.label}
        </Link>
        <span aria-hidden="true" style={{ color: 'var(--text-3)' }}>·</span>
        <span style={{ color: 'var(--text-2)' }}>{book.subject}</span>
      </nav>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <span style={{ display: 'inline-block', background: lc?.bg, color: lc?.text, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, marginBottom: 6 }}>{lc?.label}</span>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', lineHeight: 1.25, marginBottom: 4 }}>{book.title}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{book.subject} · {book.gradeLabel} · {book.publisher}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          <button onClick={() => setAiOpen(true)} aria-label="Άνοιξε τον AI βοηθό"
            style={{ background: 'var(--blue-light)', color: 'var(--blue)', border: '1px solid var(--border)', padding: '9px 16px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            AI Βοηθός
          </button>
          <button onClick={shareBook} aria-label="Κοινοποίηση"
            style={{ background: 'var(--white)', color: 'var(--text-2)', border: '1px solid var(--border)', padding: '9px 14px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            🔗 Κοινοποίηση
          </button>
          <button onClick={toggleFav} aria-label={fav ? 'Αφαίρεση' : 'Αποθήκευση'} aria-pressed={fav}
            style={{ background: fav ? 'var(--blue-light)' : 'var(--white)', color: fav ? 'var(--blue)' : 'var(--text-2)', border: `1px solid var(--border)`, padding: '9px 14px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            <span aria-hidden="true">{fav ? '❤️' : '🤍'}</span>
          </button>
          <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" download
            style={{ background: 'var(--white)', color: 'var(--text-2)', border: '1px solid var(--border)', padding: '9px 14px', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}
            aria-label="Κατέβασμα">
            ⬇
          </a>
        </div>
      </div>

      {/* Reading stats banner */}
      {stats && stats.count > 0 && (
        <div style={{ background: 'var(--blue-light)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
            👋 <strong style={{ color: 'var(--blue)' }}>Καλώς ήρθες πίσω!</strong> Έχεις ανοίξει αυτό το βιβλίο {stats.count} φορ{stats.count === 1 ? 'ά' : 'ές'}.
            {stats.lastAt && <> Τελευταία φορά: <em>{timeAgoGreek(stats.lastAt)}</em></>}
          </div>
          {streakInfo && streakInfo.streak >= 2 && (
            <div style={{ background: '#fff7ed', color: '#c2410c', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              🔥 {streakInfo.streak} μέρες στη σειρά!
            </div>
          )}
        </div>
      )}

      {/* Embedded PDF viewer */}
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 240px)', minHeight: 500, background: '#1e293b', borderRadius: 8, overflow: 'hidden' }}>
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

      <SupplementaryMaterial items={psma} />

      <PackageSiblings book={book} allBooks={allBooks} />

      <SimilarBooks currentBook={book} allBooks={allBooks} />

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
