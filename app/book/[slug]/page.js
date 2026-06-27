import allBooks from '@/src/data/books.json';
import { bookSlug, findBookBySlug } from '@/src/lib/slug';
import { LEVEL_BADGE } from '@/src/lib/constants';
import { notFound } from 'next/navigation';
import BookViewerClient from './BookViewerClient';

const SITE_URL = 'https://portify.gr';

export async function generateStaticParams() {
  return allBooks.map(b => ({ slug: bookSlug(b) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const book = findBookBySlug(allBooks, slug);
  if (!book) return { title: 'Δεν βρέθηκε — Portify' };

  const title = `${book.title} — ${book.publisher} · Portify`;
  const description = `${book.title} (${book.gradeLabel}). Διάβασέ το online ή κατέβασέ το σε PDF. ${book.subject} — ${LEVEL_BADGE[book.level]?.label || ''}.`;

  return {
    title,
    description,
    alternates: { canonical: `/book/${slug}` },
    openGraph: {
      title,
      description,
      type: 'book',
      url: `${SITE_URL}/book/${slug}`,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

async function fetchRatings(bookId) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/ratings?book_id=eq.${encodeURIComponent(bookId)}&select=stars`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!rows.length) return null;
    const avg = rows.reduce((s, r) => s + r.stars, 0) / rows.length;
    return { count: rows.length, avg: Math.round(avg * 10) / 10 };
  } catch {
    return null;
  }
}

export default async function BookPage({ params }) {
  const { slug } = await params;
  const book = findBookBySlug(allBooks, slug);
  if (!book) notFound();

  const ratings = await fetchRatings(book.id);
  const lvlLabel = LEVEL_BADGE[book.level]?.label || book.level;

  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    bookFormat: 'https://schema.org/EBook',
    inLanguage: 'el',
    publisher: { '@type': 'Organization', name: book.publisher },
    about: book.subject,
    educationalLevel: lvlLabel,
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    image: book.thumbnail || undefined,
    url: `${SITE_URL}/book/${slug}`,
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    ...(ratings && ratings.count >= 3 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: ratings.avg,
        ratingCount: ratings.count,
        bestRating: 5,
        worstRating: 1,
      }
    } : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Αρχική', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: lvlLabel, item: `${SITE_URL}/${book.level}` },
      { '@type': 'ListItem', position: 3, name: book.subject, item: `${SITE_URL}/?level=${book.level}` },
      { '@type': 'ListItem', position: 4, name: book.title, item: `${SITE_URL}/book/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <BookViewerClient book={book} />
    </>
  );
}
