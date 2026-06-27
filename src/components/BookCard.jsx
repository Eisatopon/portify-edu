'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SUBJECT_ICONS, LEVEL_BADGE } from '@/src/lib/constants';
import { isStudentBook, shortTypeLabel } from '@/src/lib/bookType';
import { bookSlug } from '@/src/lib/slug';
import StarRating from '@/src/components/StarRating';

export default function BookCard({ book, isFav, onToggleFav, onAiClick }) {
  const [imgError, setImgError] = useState(false);
  const lc = LEVEL_BADGE[book.level];
  const icon = SUBJECT_ICONS[book.subject] || SUBJECT_ICONS.default;
  const typeBadge = isStudentBook(book.type) ? '' : shortTypeLabel(book.type);
  const slug = bookSlug(book);

  return (
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
        <Link
          href={`/book/${slug}`}
          className="btn-pdf"
          style={{ flex: 1, textDecoration: 'none', textAlign: 'center', display: 'block' }}
          aria-label={`Άνοιγμα: ${book.title}`}
        >
          Άνοιξε
        </Link>
        <button onClick={() => onAiClick && onAiClick(book)} aria-label="Άνοιγμα AI βοηθού"
          style={{ width: 36, background: '#f0f4ff', color: '#1a4fa8', border: '1px solid #c7d7f5', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          AI
        </button>
      </div>
    </div>
  );
}
