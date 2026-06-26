import allBooks from '@/src/data/books.json';
import { bookSlug } from '@/src/lib/slug';

const BASE = 'https://portify.gr';

export default function sitemap() {
  const now = new Date();
  const staticRoutes = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/dimotiko`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/gymnasio`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/lykeio`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];
  const bookRoutes = allBooks.map(b => ({
    url: `${BASE}/book/${bookSlug(b)}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));
  return [...staticRoutes, ...bookRoutes];
}
