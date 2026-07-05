// app/tag/[slug]/page.js — tag pages: portify.gr book links FIRST, external ΨΜΑ links AFTER.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GuideTopBar from '@/src/components/GuideTopBar';
import tags from '@/src/data/tags.json';
import allBooks from '@/src/data/books.json';
import { bookSlug } from '@/src/lib/slug';

const SITE_URL = 'https://www.portify.gr';
const ACCENT = '#1a4fa8';

const bookById = {};
for (const b of allBooks) bookById[b.id] = b;

export function generateStaticParams() {
  return Object.keys(tags).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = tags[slug];
  if (!t) return { title: 'Δεν βρέθηκε' };
  const title = `${t.label} — Σχολικά βιβλία & υλικό | Portify`;
  const description = `Βιβλία και ψηφιακό εκπαιδευτικό υλικό για «${t.label}». Διάβασε online, κατέβασε PDF και δες σχετικά Ψηφιακά Μαθησιακά Αντικείμενα, δωρεάν στο Portify.`;
  return {
    title, description,
    alternates: { canonical: `/tag/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/tag/${slug}`, images: ['/og-image.png'] },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function TagPage({ params }) {
  const { slug } = await params;
  const t = tags[slug];
  if (!t) notFound();

  const books = (t.books || []).map((id) => bookById[id]).filter(Boolean);
  const psma = t.psma || [];

  const itemListJsonLd = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: t.label,
    itemListElement: books.map((b, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/book/${bookSlug(b)}`, name: b.title })),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Αρχική', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: t.label, item: `${SITE_URL}/tag/${slug}` },
    ],
  };

  return (
    <>
      <GuideTopBar />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 80px' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <nav aria-label="breadcrumb" style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }} data-testid="tag-breadcrumb-home">Αρχική</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: 'var(--text-2)' }}>{t.label}</span>
        </nav>

        <h1 style={{ fontSize: 'clamp(26px, 5vw, 38px)', lineHeight: 1.15, margin: '0 0 10px', color: 'var(--text-1)' }} data-testid="tag-h1">
          {t.label}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text-2)', maxWidth: 720, margin: '0 0 28px' }}>
          Σχολικά βιβλία και ψηφιακό εκπαιδευτικό υλικό σχετικά με «{t.label}» — δωρεάν στο Portify.
        </p>

        {books.length > 0 && (
          <section style={{ marginBottom: 40 }} data-testid="tag-books-section">
            <h2 style={{ fontSize: 20, margin: '0 0 14px', color: 'var(--text-1)', borderLeft: `3px solid ${ACCENT}`, paddingLeft: 10 }}>
              📚 Βιβλία στο Portify
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {books.map((b) => (
                <li key={b.id}>
                  <Link href={`/book/${bookSlug(b)}`} data-testid={`tag-book-link-${bookSlug(b)}`}
                    style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderRadius: 12, border: '1px solid var(--border, #e5e7eb)', textDecoration: 'none', background: 'var(--card, #fff)' }}>
                    {b.thumbnail ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={b.thumbnail} alt={b.title} width={44} height={60} loading="lazy" style={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                    ) : null}
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.3 }}>{b.title}</span>
                      <span style={{ display: 'block', fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{b.subject}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {psma.length > 0 && (
          <section data-testid="tag-psma-section">
            <h2 style={{ fontSize: 20, margin: '0 0 6px', color: 'var(--text-1)', borderLeft: `3px solid #e07a7a`, paddingLeft: 10 }}>
              🎬 Ψηφιακά Μαθησιακά Αντικείμενα
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '0 0 14px', paddingLeft: 13 }}>Ανοίγουν στην επίσημη πηγή (ebooksdl.cti.gr)</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {psma.map((p, i) => (
                <li key={i}>
                  <a href={p.u} target="_blank" rel="noopener noreferrer" data-testid={`tag-psma-link-${i}`}
                    style={{ display: 'block', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border, #e5e7eb)', textDecoration: 'none', background: 'var(--card, #fff)' }}>
                    <span style={{ display: 'block', fontSize: 13.5, color: '#1a4fa8', fontWeight: 500, lineHeight: 1.4 }}>{p.t}</span>
                    {p.bt ? <span style={{ display: 'block', fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{p.bt}{p.p ? ` · σελ. ${p.p}` : ''}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
