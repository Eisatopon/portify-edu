// app/not-found.js — custom 404 for entire site
import Link from 'next/link';
import allBooks from '@/src/data/books.json';
import { bookSlug } from '@/src/lib/slug';
import { LEVEL_BADGE } from '@/src/lib/constants';

export const metadata = {
  title: 'Δεν βρέθηκε η σελίδα',
  description: 'Η σελίδα που ζήτησες δεν υπάρχει.',
  robots: { index: false, follow: false },
};

// Quick picks: one popular book from each level
function pickFeatured() {
  const out = [];
  for (const level of ['dimotiko', 'gymnasio', 'lykeio']) {
    const candidates = allBooks.filter(b => b.level === level && b.subject === 'Μαθηματικά');
    if (candidates.length) out.push(candidates[0]);
  }
  return out;
}

export default function NotFound() {
  const featured = pickFeatured();
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 80, lineHeight: 1, marginBottom: 16 }} aria-hidden="true">📕</div>
      <h1 style={{ fontSize: 36, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>404 — Δεν το βρήκαμε</h1>
      <p style={{ fontSize: 17, color: 'var(--text-2)', marginBottom: 32, lineHeight: 1.5 }}>
        Η σελίδα που ψάχνεις δεν υπάρχει ή έχει μετακινηθεί. Δες μερικές προτάσεις:
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
        <Link href="/" style={{ background: 'var(--blue)', color: '#fff', padding: '11px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
          🏠 Αρχική
        </Link>
        <Link href="/dimotiko" style={{ background: 'var(--white)', color: 'var(--text)', border: '1px solid var(--border)', padding: '11px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
          Δημοτικό
        </Link>
        <Link href="/gymnasio" style={{ background: 'var(--white)', color: 'var(--text)', border: '1px solid var(--border)', padding: '11px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
          Γυμνάσιο
        </Link>
        <Link href="/lykeio" style={{ background: 'var(--white)', color: 'var(--text)', border: '1px solid var(--border)', padding: '11px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
          Λύκειο
        </Link>
      </div>

      {featured.length > 0 && (
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Δοκίμασε αυτά</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {featured.map(book => {
              const lc = LEVEL_BADGE[book.level];
              return (
                <Link key={book.id} href={`/book/${bookSlug(book)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: 10 }}>
                    {book.thumbnail
                      ? <img src={book.thumbnail} alt="" style={{ width: '100%', aspectRatio: '5/7', objectFit: 'cover', borderRadius: 6, display: 'block' }} loading="lazy" />
                      : <div style={{ width: '100%', aspectRatio: '5/7', background: 'var(--bg)', borderRadius: 6 }} />}
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginTop: 8, textAlign: 'left' }}>
                      {book.subject}
                    </div>
                    <div style={{ fontSize: 10, color: lc?.text, marginTop: 2, textAlign: 'left' }}>{lc?.label} · {book.gradeLabel}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
