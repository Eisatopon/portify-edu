// app/[level]/page.js — per-level SEO routes: /dimotiko, /gymnasio, /lykeio
import { redirect, notFound } from 'next/navigation';
import allBooks from '@/src/data/books.json';
import { LEVEL_BADGE } from '@/src/lib/constants';

const VALID = { dimotiko: 'Δημοτικό', gymnasio: 'Γυμνάσιο', lykeio: 'Λύκειο' };

export function generateStaticParams() {
  return Object.keys(VALID).map(level => ({ level }));
}

export async function generateMetadata({ params }) {
  const { level } = await params;
  if (!VALID[level]) return { title: 'Δεν βρέθηκε' };
  const lbl = VALID[level];
  const count = allBooks.filter(b => b.level === level).length;
  const title = `${lbl} — ${count} σχολικά βιβλία σε PDF`;
  const description = `Όλα τα σχολικά βιβλία ${lbl} σε PDF. ${count} βιβλία διαθέσιμα δωρεάν, με αναζήτηση ανά τάξη και μάθημα.`;
  return {
    title,
    description,
    alternates: { canonical: `/${level}` },
    openGraph: { title, description, url: `https://www.portify.gr/${level}`, images: ['/og-image.png'] },
  };
}

export default async function LevelPage({ params }) {
  const { level } = await params;
  if (!VALID[level]) notFound();
  // Server-side redirect to homepage with level pre-selected
  // (Homepage reads ?level= and auto-shows the books)
  redirect(`/?level=${level}`);
}
