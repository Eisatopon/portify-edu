import allBooks from '@/src/data/books.json';
import { bookSlug, findBookBySlug } from '@/src/lib/slug';
import { LEVEL_BADGE } from '@/src/lib/constants';
import { notFound } from 'next/navigation';
import BookViewerClient from './BookViewerClient';

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
      url: `https://portify.gr/book/${slug}`,
      images: book.thumbnail ? [{ url: book.thumbnail, width: 500, height: 700, alt: book.title }] : ['/og-image.png'],
    },
    twitter: { card: 'summary_large_image', title, description, images: book.thumbnail ? [book.thumbnail] : ['/og-image.png'] },
  };
}

export default async function BookPage({ params }) {
  const { slug } = await params;
  const book = findBookBySlug(allBooks, slug);
  if (!book) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    bookFormat: 'https://schema.org/EBook',
    inLanguage: 'el',
    publisher: { '@type': 'Organization', name: book.publisher },
    about: book.subject,
    educationalLevel: LEVEL_BADGE[book.level]?.label || book.level,
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    image: book.thumbnail || undefined,
    url: `https://portify.gr/book/${slug}`,
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BookViewerClient book={book} />
    </>
  );
}
