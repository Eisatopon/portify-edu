// app/[level]/page.js — real, indexable per-level landing pages: /dimotiko, /gymnasio, /lykeio
import Link from 'next/link';
import { notFound } from 'next/navigation';
import allBooks from '@/src/data/books.json';
import { GRADE_LABELS } from '@/src/lib/constants';
import { bookSlug } from '@/src/lib/slug';

const SITE_URL = 'https://www.portify.gr';

const LEVELS = {
  dimotiko: { label: 'Δημοτικό', genitive: 'Δημοτικού', grades: [1, 2, 3, 4, 5, 6], accent: '#16a34a' },
  gymnasio: { label: 'Γυμνάσιο', genitive: 'Γυμνασίου', grades: [7, 8, 9], accent: '#d97706' },
  lykeio: { label: 'Λύκειο', genitive: 'Λυκείου', grades: [10, 11, 12], accent: '#7c3aed' },
};

export function generateStaticParams() {
  return Object.keys(LEVELS).map((level) => ({ level }));
}

export async function generateMetadata({ params }) {
  const { level } = await params;
  const cfg = LEVELS[level];
  if (!cfg) return { title: 'Δεν βρέθηκε' };
  const count = allBooks.filter((b) => b.level === level).length;
  const title = `Σχολικά Βιβλία ${cfg.genitive} σε PDF — ${count} βιβλία δωρεάν`;
  const description = `Όλα τα σχολικά βιβλία ${cfg.genitive} σε PDF, δωρεάν. ${count} βιβλία μαθητή με online ανάγνωση, λήψη PDF, αναζήτηση ανά τάξη & μάθημα και χιλιάδες Ψηφιακά Μαθησιακά Αντικείμενα.`;
  return {
    title,
    description,
    alternates: { canonical: `/${level}` },
    openGraph: { title, description, url: `${SITE_URL}/${level}`, images: ['/og-image.png'] },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function LevelPage({ params }) {
  const { level } = await params;
  const cfg = LEVELS[level];
  if (!cfg) notFound();

  const books = allBooks.filter((b) => b.level === level);
  const byGrade = cfg.grades
    .map((g) => ({ grade: g, label: GRADE_LABELS[g], books: books.filter((b) => b.grade === g) }))
    .filter((x) => x.books.length > 0);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Σχολικά Βιβλία ${cfg.genitive}`,
    numberOfItems: books.length,
    itemListElement: books.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/book/${bookSlug(b)}`,
      name: b.title,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Αρχική', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: cfg.label, item: `${SITE_URL}/${level}` },
    ],
  };

  return (
    <>
      <div style={{ borderBottom: '1px solid var(--border, #e5e7eb)', background: 'var(--card, #fff)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '14px 20px' }}>
          <Link href="/" data-testid="level-brand-home" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>Portify</span>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Σχολικά Βιβλία</span>
          </Link>
        </div>
      </div>
    <main id="main" style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 20px 80px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="breadcrumb" style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 18 }}>
        <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }} data-testid="level-breadcrumb-home">Αρχική</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: 'var(--text-2)' }}>{cfg.label}</span>
      </nav>

      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.15, margin: '0 0 12px', color: 'var(--text-1)' }} data-testid="level-h1">
          Σχολικά Βιβλία {cfg.genitive} σε PDF
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text-2)', maxWidth: 720, margin: 0 }}>
          {books.length} σχολικά βιβλία {cfg.genitive} διαθέσιμα δωρεάν. Διάβασέ τα online ή κατέβασέ τα σε PDF,
          με γρήγορη αναζήτηση ανά τάξη και μάθημα και χιλιάδες Ψηφιακά Μαθησιακά Αντικείμενα (βίντεο, ασκήσεις, διαδραστικά).
        </p>
        <Link
          href={`/?level=${level}`}
          data-testid="level-interactive-cta"
          style={{
            display: 'inline-block', marginTop: 16, padding: '10px 18px', borderRadius: 999,
            background: cfg.accent, color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14,
          }}
        >
          Αναζήτηση με φίλτρα →
        </Link>
      </header>

      {byGrade.map(({ grade, label, books: gradeBooks }) => (
        <section key={grade} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 20, margin: '0 0 14px', color: 'var(--text-1)', borderLeft: `3px solid ${cfg.accent}`, paddingLeft: 10 }}>
            {label} <span style={{ color: 'var(--text-3)', fontWeight: 400, fontSize: 15 }}>({gradeBooks.length})</span>
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {gradeBooks.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/book/${bookSlug(b)}`}
                  data-testid={`level-book-link-${bookSlug(b)}`}
                  style={{
                    display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderRadius: 12,
                    border: '1px solid var(--border, #e5e7eb)', textDecoration: 'none', background: 'var(--card, #fff)',
                  }}
                >
                  {b.thumbnail ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={b.thumbnail} alt={b.title} width={44} height={60} loading="lazy" style={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                  ) : null}
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.3 }}>{b.title}</span>
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{b.subject} · {b.publisher}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
    </>
  );
}
