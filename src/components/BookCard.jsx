'use client';
import { useState } from 'react';
import { SUBJECT_ICONS, LEVEL_BADGE } from '@/src/lib/constants';

export default function BookCard({ book }) {
  const [imgError, setImgError] = useState(false);
  const lc = LEVEL_BADGE[book.level];
  const icon = SUBJECT_ICONS[book.subject] || SUBJECT_ICONS.default;
  const isStudent = book.type === 'Βιβλίο μαθητή';

  return (
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
        <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-pdf">
          📄 PDF
        </a>
        {book.epubUrl ? (
          <a href={book.epubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            📱 ePUB
          </a>
        ) : (
          <a href="https://ebooksdl.cti.gr" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            🔗 Πηγή
          </a>
        )}
      </div>
    </div>
  );
}