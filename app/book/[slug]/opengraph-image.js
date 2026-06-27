// Dynamic OG image per book (1200×630 PNG)
// Δημιουργείται at request time από Next.js Edge runtime
import { ImageResponse } from 'next/og';
import allBooks from '@/src/data/books.json';
import { findBookBySlug } from '@/src/lib/slug';
import { LEVEL_BADGE } from '@/src/lib/constants';

export const runtime = 'edge';
export const alt = 'Portify βιβλίο';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const LEVEL_BG = {
  dimotiko: { from: '#0f3a23', to: '#16a34a' },
  gymnasio: { from: '#3a2308', to: '#d97706' },
  lykeio:   { from: '#2c1565', to: '#7c3aed' },
};

export default async function og({ params }) {
  const { slug } = await params;
  const book = findBookBySlug(allBooks, slug);
  if (!book) {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>
        Portify
      </div>,
      { ...size }
    );
  }

  const lc = LEVEL_BADGE[book.level];
  const bg = LEVEL_BG[book.level] || LEVEL_BG.dimotiko;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', background: `linear-gradient(135deg, ${bg.from} 0%, ${bg.to} 100%)`, padding: 60, color: '#fff', fontFamily: 'sans-serif' }}>
        {/* Cover thumbnail */}
        <div style={{ display: 'flex', flexShrink: 0, marginRight: 50 }}>
          {book.thumbnail ? (
            <img src={book.thumbnail} alt="" style={{ width: 340, height: 480, objectFit: 'cover', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
          ) : (
            <div style={{ width: 340, height: 480, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100 }}>📖</div>
          )}
        </div>

        {/* Text content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ background: 'rgba(255,255,255,0.92)', color: bg.to, fontSize: 22, fontWeight: 700, padding: '8px 20px', borderRadius: 100 }}>
                {lc?.label || book.level}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 22 }}>
                {book.gradeLabel}
              </div>
            </div>

            <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1, marginBottom: 18, display: 'flex' }}>
              {book.subject}
            </div>

            <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.85)', lineHeight: 1.3, display: 'flex', maxHeight: 130, overflow: 'hidden' }}>
              {(book.title || '').slice(0, 100)}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)' }}>Εκδόσεις</div>
              <div style={{ fontSize: 28, fontWeight: 600 }}>{book.publisher}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, opacity: 0.95 }}>portify.gr</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
