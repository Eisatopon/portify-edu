'use client';
import Link from 'next/link';
import { bookSlug } from '@/src/lib/slug';
import { LEVEL_BADGE } from '@/src/lib/constants';

export default function SimilarBooks({ currentBook, allBooks, max = 6 }) {
  // ONLY same subject + same level. No subject mixing.
  const pool = allBooks
    .filter(b =>
      b.id !== currentBook.id &&
      b.level === currentBook.level &&
      b.subject === currentBook.subject
    )
    .slice(0, max);

  if (!pool.length) return null;

  return (
    <section style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }} aria-label="Άλλες εκδόσεις">
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
        📚 Άλλες εκδόσεις — {currentBook.subject}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
        {pool.map(book => {
          const lc = LEVEL_BADGE[book.level];
          return (
            <Link key={book.id} href={`/book/${bookSlug(book)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--t-shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                {book.thumbnail
                  ? <img src={book.thumbnail} alt="" style={{ width: '100%', aspectRatio: '5/7', objectFit: 'cover', borderRadius: 6, display: 'block' }} loading="lazy" />
                  : <div style={{ width: '100%', aspectRatio: '5/7', background: 'var(--bg)', borderRadius: 6 }} />}
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 28 }}>
                  {book.publisher}
                </div>
                <div style={{ fontSize: 10, color: lc?.text, marginTop: 2 }}>{lc?.label} · {book.gradeLabel}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
