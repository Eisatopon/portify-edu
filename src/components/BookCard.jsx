'use client';
import { useState, useEffect } from 'react';
import { SUBJECT_ICONS, LEVEL_BADGE } from '@/src/lib/constants';
import StarRating from '@/src/components/StarRating';

export default function BookCard({ book, isFav, onToggleFav }) {
  const [imgError, setImgError] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const lc = LEVEL_BADGE[book.level];
  const icon = SUBJECT_ICONS[book.subject] || SUBJECT_ICONS.default;
  const isStudent = book.type === 'Vivlio mathiti' || book.type === 'Vivlio mathiti/mathitrias';
  const typeLabel = book.type.replace('Vivlio mathiti/mathitrias','').replace('Vivlio mathiti','').replace('Tetradio ergasion','Tetradio').trim();

  function handlePDF() {
    setPdfLoaded(false);
    setShowViewer(true);
  }

  return (
    <>
      <div className="book-card">
        <div className="book-cover" style={{ position: 'relative' }}>
          {book.thumbnail && !imgError ? (
            <img src={book.thumbnail} alt={book.title} onError={() => setImgError(true)} loading="lazy" />
          ) : (
            <div className="cover-placeholder">
              <span className="cover-icon">{icon}</span>
              <span className="cover-subject">{book.subject}</span>
            </div>
          )}
          <span className="level-badge" style={{ background: lc.bg, color: lc.text }}>{lc.label}</span>
          {!isStudent && typeLabel && <span className="type-badge">{typeLabel}</span>}
          <button onClick={e => { e.stopPropagation(); onToggleFav && onToggleFav(); }}
            style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', transition: 'transform 0.15s', zIndex: 2 }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            {isFav ? 'fav' : 'unfav'}
          </button>
        </div>
        <div className="book-info">
          <p className="book-title">{book.title}</p>
          <p className="book-publisher">{book.publisher}</p>
        </div>
        <StarRating bookId={book.pdfUrl} />
        <div className="book-actions">
          <button onClick={handlePDF} className="btn-pdf">PDF</button>
        </div>
      </div>

      {showViewer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}
          onClick={e => { if (e.target === e.currentTarget) setShowViewer(false); }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#0f172a', flexShrink: 0 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 500, maxWidth: 'calc(100% - 150px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onToggleFav && onToggleFav()}
                style={{ background: isFav ? '#fff7ed' : 'rgba(255,255,255,0.1)', color: isFav ? '#c2410c' : '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>
                {isFav ? 'Saved' : 'Save'}
              </button>
              <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer"
                style={{ background: '#1a4fa8', color: '#fff', borderRadius: 7, padding: '7px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                Open
              </a>
              <button onClick={() => setShowViewer(false)}
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>X</button>
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            {!pdfLoaded && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', zIndex: 1 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                  <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading PDF...</p>
                </div>
              </div>
            )}
            <iframe
              src={'/api/pdf?url=' + encodeURIComponent(book.pdfUrl)}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={book.title}
              onLoad={() => setPdfLoaded(true)}
            />
          </div>
        </div>
      )}

      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </>
  );
}
