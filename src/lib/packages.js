// src/lib/packages.js — Teaching Package logic (derived from books.json)
// Strategy: a Teaching Package = (subject + gradeLabel + publisher)
// All books with the same triplet belong to the same package.
//
// Pure functions, no side effects, no DB. Safe to import anywhere.

function norm(s) {
  return (s || '').toString().trim().toLowerCase();
}

// Stable, URL-safe slug from a string (Greek-friendly: keeps letters but strips diacritics)
function slugify(s) {
  if (!s) return '';
  try {
    return s
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-zα-ω0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '');
  } catch {
    return String(s).toLowerCase().replace(/\s+/g, '-');
  }
}

/** Unique key for a book's package: subject|gradeLabel|publisher (normalized) */
export function getPackageKey(book) {
  if (!book) return '';
  return `${norm(book.subject)}|${norm(book.gradeLabel)}|${norm(book.publisher)}`;
}

/** URL-safe slug for a package (used in /paketo/[slug] URLs) */
export function packageSlug(pkg) {
  if (!pkg) return '';
  return `${slugify(pkg.subject)}-${slugify(pkg.gradeLabel)}-${slugify(pkg.publisher)}`;
}

// Priority order for sorting books inside a package (lower = first)
const TYPE_ORDER = [
  { match: /τετράδιο εργασιών.*τεύχος Α/i, p: 11 },
  { match: /τετράδιο εργασιών.*τεύχος Β/i, p: 12 },
  { match: /τετράδιο εργασιών.*τεύχος Γ/i, p: 13 },
  { match: /βιβλίο μαθητή.*τετράδιο.*τεύχος Α/i, p: 5 },
  { match: /βιβλίο μαθητή.*τετράδιο.*τεύχος Β/i, p: 6 },
  { match: /βιβλίο μαθητή.*τετράδιο.*τεύχος Γ/i, p: 7 },
  { match: /βιβλίο μαθητή.*τετράδιο/i, p: 4 },
  { match: /βιβλίο μαθητή.*τεύχος Α/i, p: 1 },
  { match: /βιβλίο μαθητή.*τεύχος Β/i, p: 2 },
  { match: /βιβλίο μαθητή.*τεύχος Γ/i, p: 3 },
  { match: /βιβλίο μαθητή/i, p: 0 },
  { match: /τετράδιο εργασιών/i, p: 10 },
];
function typePriority(type) {
  const t = type || '';
  for (const r of TYPE_ORDER) if (r.match.test(t)) return r.p;
  return 50;
}

/** Short label for a book inside a package (e.g. "Βιβλίο Μαθητή · Τεύχος Α'") */
export function bookPartLabel(book) {
  const t = (book && book.type) || '';
  if (!t) return 'Βιβλίο';
  // Replace verbose phrases for compact display
  return t
    .replace(/Βιβλίο μαθητή\/μαθήτριας/g, 'Βιβλίο Μαθητή')
    .replace(/Τετράδιο εργασιών/g, 'Τετράδιο Εργασιών')
    .replace(/\s*-\s*/g, ' · ');
}

/** Build the package object that contains the given book. Returns null if no siblings exist. */
export function getPackageForBook(book, allBooks) {
  if (!book || !Array.isArray(allBooks)) return null;
  const key = getPackageKey(book);
  const members = allBooks.filter(b => getPackageKey(b) === key);
  if (members.length === 0) return null;

  // Sort by type priority, then by title
  members.sort((a, b) => {
    const pa = typePriority(a.type), pb = typePriority(b.type);
    if (pa !== pb) return pa - pb;
    return (a.title || '').localeCompare(b.title || '', 'el');
  });

  return {
    key,
    slug: packageSlug(book),
    title: `${book.subject} — ${book.gradeLabel}`,
    subject: book.subject,
    gradeLabel: book.gradeLabel,
    grade: book.grade,
    level: book.level,
    publisher: book.publisher,
    books: members,
    size: members.length,
  };
}

/** Sibling books = books in the same package, excluding the current one */
export function getSiblingBooks(book, allBooks) {
  const pkg = getPackageForBook(book, allBooks);
  if (!pkg) return [];
  return pkg.books.filter(b => b.id !== book.id);
}

/** Build a Map<key, package> of ALL packages in the dataset (memoized per allBooks reference) */
let cachedRef = null;
let cachedMap = null;
export function getAllPackages(allBooks) {
  if (allBooks === cachedRef && cachedMap) return cachedMap;
  cachedRef = allBooks;
  const map = new Map();
  if (!Array.isArray(allBooks)) { cachedMap = map; return map; }
  for (const b of allBooks) {
    const key = getPackageKey(b);
    if (!map.has(key)) {
      map.set(key, { key, slug: packageSlug(b), subject: b.subject, gradeLabel: b.gradeLabel, grade: b.grade, level: b.level, publisher: b.publisher, books: [] });
    }
    map.get(key).books.push(b);
  }
  // Sort books inside each package
  for (const pkg of map.values()) {
    pkg.books.sort((a, b) => {
      const pa = typePriority(a.type), pb = typePriority(b.type);
      if (pa !== pb) return pa - pb;
      return (a.title || '').localeCompare(b.title || '', 'el');
    });
    pkg.size = pkg.books.length;
    pkg.title = `${pkg.subject} — ${pkg.gradeLabel}`;
  }
  cachedMap = map;
  return map;
}
