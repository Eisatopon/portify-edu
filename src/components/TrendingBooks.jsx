'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/src/lib/supabase';
import { bookSlug } from '@/src/lib/slug';
import { LEVEL_BADGE } from '@/src/lib/constants';

export default function TrendingBooks({ allBooks }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const sb = getSupabase();
      if (!sb) { setLoading(false); return; }
      try {
        const { data } = await sb.from('ratings').select('book_id');
        if (cancelled || !data) { setLoading(false); return; }
        const counts = {};
        for (const row of data) counts[row.book_id] = (counts[row.book_id] || 0) + 1;
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
        const result = top.map(([id, c]) => {
          const b = allBooks.find(x => x.id === id);
          return b ? { ...b, ratingCount: c } : null;
        }).filter(Boolean);
        if (!cancelled) setBooks(result);
      } catch {}
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [allBooks]);

  if (loading || books.length < 4) return null;

  return (
    <section style={{ maxWidth: 1100, margin: '32px auto 0', padding: '0 20px' }} aria-label="Δημοφιλή βιβλία">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>🔥 Τα πιο δημοφιλή</h2>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Με βάση τις αξιολογήσεις των χρηστών</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
        {books.map((book, i) => {
          const lc = LEVEL_BADGE[book.level];
          return (
            <Link key={book.id} href={`/book/${bookSlug(book)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', position: 'relative' }}>
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: 10, transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--t-shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ position: 'absolute', top: 14, left: 14, background: i < 3 ? '#f59e0b' : 'rgba(15, 23, 42, 0.7)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, zIndex: 1 }}>#{i + 1}</div>
                {book.thumbnail
                  ? <img src={book.thumbnail} alt="" style={{ width: '100%', aspectRatio: '5/7', objectFit: 'cover', borderRadius: 6, display: 'block' }} loading="lazy" />
                  : <div style={{ width: '100%', aspectRatio: '5/7', background: 'var(--bg)', borderRadius: 6 }} />}
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginTop: 8, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 32 }}>
                  {book.subject}
                </div>
                <div style={{ fontSize: 10, color: lc?.text, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{lc?.label} · {book.gradeLabel}</span>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>★ {book.ratingCount}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
