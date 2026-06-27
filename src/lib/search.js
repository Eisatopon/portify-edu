// Greek-aware fuzzy book search.
// - Normalises Greek accents (αλγεβρα = άλγεβρα)
// - Case insensitive
// - Ranks results: title > subject > publisher
// - Supports multi-word ("αλγεβρα α λυκειο" → matches title with all words)

function strip(str = '') {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function score(book, words) {
  const t = strip(book.title);
  const sub = strip(book.subject);
  const g = strip(book.gradeLabel);
  const p = strip(book.publisher);
  let s = 0;
  for (const w of words) {
    if (!w) continue;
    if (sub === w) s += 100;          // exact subject match
    if (sub.startsWith(w)) s += 50;   // subject starts with
    if (sub.includes(w)) s += 30;
    if (t.includes(w)) s += 15;
    if (g.includes(w)) s += 10;
    if (p.includes(w)) s += 5;
  }
  return s;
}

export function filterBooks(books, { level, grade, subject, query, publisher }) {
  let filtered = books.filter(b => {
    if (level && b.level !== level) return false;
    if (grade && Number(b.grade) !== Number(grade)) return false;
    if (subject && b.subject !== subject) return false;
    if (publisher && b.publisher !== publisher) return false;
    return true;
  });

  if (!query) return filtered;

  const words = strip(query).split(/\s+/).filter(Boolean);
  const scored = filtered
    .map(b => ({ b, s: score(b, words) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s);

  return scored.map(x => x.b);
}

export { strip as normalizeGreek };
