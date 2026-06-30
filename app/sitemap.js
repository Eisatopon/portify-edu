// app/sitemap.js — XML sitemap (www canonical)
import allBooks from '@/src/data/books.json';
import { bookSlug, subjectSlug } from '@/src/lib/slug';

const BASE = 'https://www.portify.gr';

export default function sitemap() {
  const now = new Date();
  const staticRoutes = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/dimotiko`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/gymnasio`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/lykeio`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/epikoinonia`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Per-subject pages: /{level}/{subject}
  const subjectSeen = new Set();
  const subjectRoutes = [];
  for (const b of allBooks) {
    const s = subjectSlug(b.subject);
    const key = `${b.level}/${s}`;
    if (!s || subjectSeen.has(key)) continue;
    subjectSeen.add(key);
    subjectRoutes.push({ url: `${BASE}/${key}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 });
  }

  const bookRoutes = allBooks.map(b => ({
    url: `${BASE}/book/${bookSlug(b)}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));
  return [...staticRoutes, ...subjectRoutes, ...bookRoutes];
}
