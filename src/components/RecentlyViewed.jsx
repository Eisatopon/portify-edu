'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { bookSlug } from '@/src/lib/slug';
import { LEVEL_BADGE } from '@/src/lib/constants';

export default function RecentlyViewed({ allBooks }) {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem('portify_recent_v1') || '[]');
      const books = ids.map(id => allBooks.find(b => b.id === id)).filter(Boolean).slice(0, 6);
      setRecent(books);
    } catch {}
  }, [allBooks]);

  if (recent.length === 0) return null;

  return (
    <section style={{ maxWidth: 1100, margin: '32px auto 0', padding: '0 20px' }} aria-label="Πρόσφατα είδες">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>📖 Πρόσφατα είδες</h2>
        <button onClick={() => { try { localStorage.removeItem('portify_recent_v1'); setRecent([]); } catch {} }}
          style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
          Καθαρισμός
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
        {recent.map(book => {
          const lc = LEVEL_BADGE[book.level];
          return (
            <Link key={book.id} href={`/book/${bookSlug(book)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                {book.thumbnail
                  ? <img src={book.thumbnail} alt="" style={{ width: '100%', aspectRatio: '5/7', objectFit: 'cover', borderRadius: 6, display: 'block' }} loading="lazy" />
                  : <div style={{ width: '100%', aspectRatio: '5/7', background: 'var(--bg)', borderRadius: 6 }} />}
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 28 }}>
                  {book.subject}
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
