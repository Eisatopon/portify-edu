'use client';
import { useState, useEffect } from 'react';
import { SUBJECT_ICONS, LEVEL_BADGE } from '@/src/lib/constants';
import StarRating from '@/src/components/StarRating';

export default function BookCard({ book, isFav, onToggleFav }) {
  const [imgError, setImgError] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lc = LEVEL_BADGE[book.level];
  const icon = SUBJECT_ICONS[book.subject] || SUBJECT_ICONS.default;
  const isStudent = book.type === 'Βιβλίο μαθητή' || book.type === 'Βιβλίο μαθητή/μαθήτριας';
  const typeLabel = book.type.replace('Βιβλίο μαθητή/μαθήτριας','').replace('Βιβλίο μαθητή','').replace('Τετράδιο εργασιών','Τετράδιο').trim();

  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);

  function handlePDF() {
    if (isMobile) window.open(book.pdfUrl, '_blank');
    else setShowViewer(true);
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
            style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', transition: 'transform 0.15s', zIndex: 2 }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="book-info">
          <p className="book-title">{book.title}</p>
          <p className="book-publisher">{book.publisher}</p>
        </div>
        <StarRating bookId={book.pdfUrl} />
        <div className="book-actions">
          <button onClick={handlePDF} className="btn-pdf">📄 PDF</button>
          {book.epubUrl ? (
            <a href={book.epubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">📱 ePUB</a>
          ) : (
            <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">📖 Διαβάστε</a>
          )}
        </div>
      </div>

      {showViewer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}
          onClick={e => { if (e.target === e.currentTarget) setShowViewer(false); }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#0f172a', flexShrink: 0 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 500, maxWidth: 'calc(100% - 200px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onToggleFav && onToggleFav()}
                style={{ background: isFav ? '#fff7ed' : 'rgba(255,255,255,0.1)', color: isFav ? '#c2410c' : '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>
                {isFav ? '❤️ Αποθηκεύτηκε' : '🤍 Αποθήκευση'}
              </button>
              <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer"
                style={{ background: '#1a4fa8', color: '#fff', borderRadius: 7, padding: '7px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                📖 Άνοιγμα
              </a>
              <button onClick={() => setShowViewer(false)}
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>✕</button>
            </div>
          </div>
          <iframe src={`${book.pdfUrl}#toolbar=1&view=FitH`} style={{ flex: 1, border: 'none', width: '100%' }} title={book.title} />
        </div>
      )}
    </>
  );
}