'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SUBJECT_ICONS, LEVEL_BADGE } from '@/src/lib/constants';
import { isStudentBook, shortTypeLabel } from '@/src/lib/bookType';
import { bookSlug } from '@/src/lib/slug';
import StarRating from '@/src/components/StarRating';

export default function BookCard({ book, isFav, onToggleFav, onAiClick }) {
  const [imgError, setImgError] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const lc = LEVEL_BADGE[book.level];
  const icon = SUBJECT_ICONS[book.subject] || SUBJECT_ICONS.default;
  const typeBadge = isStudentBook(book.type) ? '' : shortTypeLabel(book.type);
  const slug = bookSlug(book);

  // Close PDF viewer with Escape
  function onKey(e) { if (e.key === 'Escape') setShowViewer(false); }

  function handlePDF() {
    setPdfLoaded(false);
    setShowViewer(true);
  }

  return (
    <>
      <div className="book-card">
        <Link href={`/book/${slug}`} className="book-cover" style={{ position: 'relative', textDecoration: 'none' }} aria-label={`Άνοιγμα: ${book.title}`}>
          {book.thumbnail && !imgError ? (
            <img src={book.thumbnail} alt={`Εξώφυλλο: ${book.title}`} onError={() => setImgError(true)} loading="lazy" />
          ) : (
            <div className="cover-placeholder">
              <span className="cover-icon" aria-hidden="true">{icon}</span>
              <span className="cover-subject">{book.subject}</span>
            </div>
          )}
          <span className="level-badge" style={{ background: lc.bg, color: lc.text }}>{lc.label}</span>
          {typeBadge && <span className="type-badge">{typeBadge}</span>}
        </Link>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onToggleFav && onToggleFav(); }}
          aria-label={isFav ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
          aria-pressed={isFav}
          style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 17, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', transition: 'transform 0.15s', zIndex: 2 }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <span aria-hidden="true">{isFav ? '❤️' : '🤍'}</span>
        </button>
        <div className="book-info">
          <Link href={`/book/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <p className="book-title">{book.title}</p>
          </Link>
          <p className="book-publisher">{book.publisher}</p>
        </div>
        <StarRating bookId={book.id} />
        <div className="book-actions" style={{ display: 'flex', gap: 6 }}>
          <button onClick={handlePDF} className="btn-pdf" style={{ flex: 1 }} aria-label={`Άνοιγμα PDF: ${book.title}`}>PDF</button>
          <button onClick={() => onAiClick && onAiClick(book)} aria-label="Άνοιγμα AI βοηθού"
            style={{ width: 36, background: '#f0f4ff', color: '#1a4fa8', border: '1px solid #c7d7f5', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            AI
          </button>
        </div>
      </div>

      {showViewer && (
        <div
          role="dialog"
          aria-label={`Προβολή PDF: ${book.title}`}
          aria-modal="true"
          tabIndex={-1}
          onKeyDown={onKey}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}
          onClick={e => { if (e.target === e.currentTarget) setShowViewer(false); }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#0f172a', flexShrink: 0 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 500, maxWidth: 'calc(100% - 200px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onToggleFav && onToggleFav()} aria-label={isFav ? 'Αποθηκευμένο' : 'Αποθήκευση'}
                style={{ background: isFav ? '#fff7ed' : 'rgba(255,255,255,0.1)', color: isFav ? '#c2410c' : '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>
                <span aria-hidden="true">{isFav ? '❤️' : '🤍'}</span> {isFav ? 'Αποθηκευμένο' : 'Αποθήκευση'}
              </button>
              <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer"
                style={{ background: '#1a4fa8', color: '#fff', borderRadius: 7, padding: '7px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                Άνοιξε
              </a>
              <button onClick={() => setShowViewer(false)} aria-label="Κλείσιμο"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>✕</button>
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            {!pdfLoaded && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', zIndex: 1 }} role="status" aria-live="polite">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} aria-hidden="true" />
                  <p style={{ color: '#94a3b8', fontSize: 13 }}>Φόρτωση PDF…</p>
                </div>
              </div>
            )}
            <iframe
              src={'/api/pdf?url=' + encodeURIComponent(book.pdfUrl)}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={book.title}
              sandbox="allow-scripts allow-same-origin allow-downloads"
              onLoad={() => setPdfLoaded(true)}
            />
          </div>
        </div>
      )}
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </>
  );
}
