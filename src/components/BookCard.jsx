'use client';
import { useState } from 'react';
import { SUBJECT_ICONS, LEVEL_BADGE } from '@/src/lib/constants';

export default function BookCard({ book }) {
  const [imgError, setImgError] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const lc = LEVEL_BADGE[book.level];
  const icon = SUBJECT_ICONS[book.subject] || SUBJECT_ICONS.default;
  const isStudent = book.type === 'Βιβλίο μαθητή';

  return (
    <>
      <div className="book-card">
        <div className="book-cover">
          {book.thumbnail && !imgError ? (
            <img src={book.thumbnail} alt={book.title} onError={() => setImgError(true)} />
          ) : (
            <div className="cover-placeholder">
              <span className="cover-icon">{icon}</span>
              <span className="cover-subject">{book.subject}</span>
            </div>
          )}
          <span className="level-badge" style={{ background: lc.bg, color: lc.text }}>{lc.label}</span>
          {!isStudent && <span className="type-badge">{book.type}</span>}
        </div>
        <div className="book-info">
          <p className="book-title">{book.title}</p>
          <p className="book-publisher">{book.publisher}</p>
        </div>
        <div className="book-actions">
          <button onClick={() => setShowViewer(true)} className="btn-pdf">
            📄 PDF
          </button>
          {book.epubUrl ? (
            <a href={book.epubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              📱 ePUB
            </a>
          ) : (
            <a href={book.pdfUrl} download target="_blank" rel="noopener noreferrer" className="btn-secondary">
              ⬇ Λήψη
            </a>
          )}
        </div>
      </div>

      {showViewer && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}
          onClick={e => { if (e.target === e.currentTarget) setShowViewer(false); }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#0f172a', flexShrink: 0 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 500, maxWidth: 'calc(100% - 120px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {book.title}
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <a href={book.pdfUrl} download target="_blank" rel="noopener noreferrer"
                style={{ background: '#1a4fa8', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                ⬇ Λήψη
              </a>
              <button onClick={() => setShowViewer(false)}
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>
                ✕ Κλείσιμο
              </button>
            </div>
          </div>
          <iframe
            src={`${book.pdfUrl}#toolbar=1&view=FitH`}
            style={{ flex: 1, border: 'none', width: '100%' }}
            title={book.title}
          />
        </div>
      )}
    </>
  );
}