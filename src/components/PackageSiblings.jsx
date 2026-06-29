'use client';
// src/components/PackageSiblings.jsx — Shows other books in the same Teaching Package
// (same subject + grade + publisher as the current book).
// Renders nothing if the package has only 1 book (this one).
import Link from 'next/link';
import { getPackageForBook, bookPartLabel } from '@/src/lib/packages';
import { bookSlug } from '@/src/lib/slug';

export default function PackageSiblings({ book, allBooks }) {
  const pkg = getPackageForBook(book, allBooks);
  if (!pkg || pkg.size < 2) return null;

  const siblings = pkg.books.filter(b => b.id !== book.id);

  return (
    <section className="pkg-siblings" aria-label="Άλλα βιβλία αυτού του πακέτου">
      <div className="pkg-header">
        <div className="pkg-icon" aria-hidden="true">📦</div>
        <div className="pkg-meta">
          <div className="pkg-eyebrow">Διδακτικό Πακέτο</div>
          <h2 className="pkg-title">{pkg.title}</h2>
          <div className="pkg-sub">
            <span>{pkg.publisher}</span>
            <span className="pkg-dot">·</span>
            <span>{pkg.size} βιβλία</span>
          </div>
        </div>
      </div>

      <div className="pkg-grid">
        {siblings.map(b => (
          <Link key={b.id} href={`/book/${bookSlug(b)}`} className="pkg-card">
            <div className="pkg-thumb">
              {b.thumbnail
                ? <img src={b.thumbnail} alt="" loading="lazy" />
                : <div className="pkg-thumb-placeholder">📕</div>}
            </div>
            <div className="pkg-card-body">
              <div className="pkg-card-part">{bookPartLabel(b)}</div>
              <div className="pkg-card-open">Άνοιξε <span aria-hidden="true">→</span></div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .pkg-siblings {
          max-width: 1100px;
          margin: 32px auto 0;
          padding: 0 20px;
        }
        .pkg-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 18px;
          padding: 18px 20px;
          background: linear-gradient(135deg, var(--blue-light, #eef4ff) 0%, transparent 100%);
          border: 1px solid var(--border);
          border-radius: 14px;
        }
        .pkg-icon {
          width: 44px; height: 44px;
          border-radius: 11px;
          background: var(--white);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        .pkg-meta { flex: 1; min-width: 0; }
        .pkg-eyebrow {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--blue, #1a4fa8);
          margin-bottom: 2px;
        }
        .pkg-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }
        .pkg-sub {
          font-size: 13px;
          color: var(--text-2);
          display: flex; align-items: center; gap: 6px;
        }
        .pkg-dot { color: var(--text-3); }

        .pkg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }
        .pkg-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex; flex-direction: column;
          transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
        }
        .pkg-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.10);
          border-color: var(--blue, #1a4fa8);
        }
        .pkg-thumb {
          width: 100%;
          aspect-ratio: 5 / 7;
          background: var(--bg, #f8fafc);
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .pkg-thumb img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .pkg-thumb-placeholder {
          font-size: 40px;
          opacity: 0.5;
        }
        .pkg-card-body {
          padding: 10px 12px 12px;
          display: flex; flex-direction: column; gap: 6px;
          flex: 1;
        }
        .pkg-card-part {
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 32px;
        }
        .pkg-card-open {
          font-size: 12px;
          font-weight: 600;
          color: var(--blue, #1a4fa8);
          margin-top: auto;
        }

        @media (max-width: 480px) {
          .pkg-header { flex-direction: column; gap: 10px; padding: 14px 16px; }
          .pkg-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
          .pkg-title { font-size: 16px; }
        }
      `}</style>
    </section>
  );
}
