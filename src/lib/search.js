// Fast Greek-aware book search.
// - Cached normalized strings (computed once per books array)
// - Short queries (<2 chars) use cheap substring match only
// - No expensive scoring/sort for tiny queries

function strip(str = '') {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Memoize normalized index per books reference
let cachedBooks = null;
let cachedIndex = null;
function getIndex(books) {
  if (books === cachedBooks && cachedIndex) return cachedIndex;
  cachedBooks = books;
  cachedIndex = books.map(b => ({
    b,
    t: strip(b.title),
    sub: strip(b.subject),
    g: strip(b.gradeLabel),
    p: strip(b.publisher),
  }));
  return cachedIndex;
}

export function filterBooks(books, { level, grade, subject, query, publisher }) {
  let pool = books;
  if (level || grade || subject || publisher) {
    pool = pool.filter(b => {
      if (level && b.level !== level) return false;
      if (grade && Number(b.grade) !== Number(grade)) return false;
      if (subject && b.subject !== subject) return false;
      if (publisher && b.publisher !== publisher) return false;
      return true;
    });
  }

  if (!query) return pool;

  const q = strip(query);
  if (!q) return pool;

  // Short query: simple substring match (fast)
  if (q.length < 3) {
    const idx = getIndex(pool);
    return idx
      .filter(x => x.sub.includes(q) || x.t.includes(q) || x.g.includes(q))
      .map(x => x.b);
  }

  // Longer query: ranked search
  const words = q.split(/\s+/).filter(Boolean);
  const idx = getIndex(pool);
  const out = [];
  for (const x of idx) {
    let s = 0;
    for (const w of words) {
      if (x.sub === w) s += 100;
      if (x.sub.startsWith(w)) s += 50;
      if (x.sub.includes(w)) s += 30;
      if (x.t.includes(w)) s += 15;
      if (x.g.includes(w)) s += 10;
      if (x.p.includes(w)) s += 5;
    }
    if (s > 0) out.push({ b: x.b, s });
  }
  out.sort((a, b) => b.s - a.s);
  return out.map(x => x.b);
}

export { strip as normalizeGreek };
