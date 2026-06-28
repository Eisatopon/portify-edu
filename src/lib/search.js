// Fast Greek-aware book search — Safari-safe (defensive)
// - try/catch wraps every step
// - Fallback to simple toLowerCase if normalize fails
// - Logs error to console once for debugging

let normalizeWarned = false;

function safeStrip(str) {
  if (typeof str !== 'string' || !str) return '';
  // Primary path: NFD + diacritic removal
  try {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  } catch (err) {
    if (!normalizeWarned) {
      // eslint-disable-next-line no-console
      console.warn('[Portify search] normalize failed, falling back', err);
      normalizeWarned = true;
    }
    // Fallback: just lowercase (no accent removal, but still works)
    try { return String(str).toLowerCase(); } catch { return ''; }
  }
}

// Memoize normalized index per books reference
let cachedBooks = null;
let cachedIndex = null;
function getIndex(books) {
  if (books === cachedBooks && cachedIndex) return cachedIndex;
  cachedBooks = books;
  try {
    cachedIndex = books.map(b => ({
      b,
      t:   safeStrip(b && b.title),
      sub: safeStrip(b && b.subject),
      g:   safeStrip(b && b.gradeLabel),
      p:   safeStrip(b && b.publisher),
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Portify search] index build failed', err);
    cachedIndex = [];
  }
  return cachedIndex;
}

export function filterBooks(books, filters) {
  if (!Array.isArray(books)) return [];
  const opts = filters || {};
  const level     = opts.level;
  const grade     = opts.grade;
  const subject   = opts.subject;
  const query     = opts.query;
  const publisher = opts.publisher;

  let pool = books;

  if (level || grade || subject || publisher) {
    pool = pool.filter(b => {
      if (!b) return false;
      if (level && b.level !== level) return false;
      if (grade && Number(b.grade) !== Number(grade)) return false;
      if (subject && b.subject !== subject) return false;
      if (publisher && b.publisher !== publisher) return false;
      return true;
    });
  }

  if (!query) return pool;
  const q = safeStrip(query);
  if (!q) return pool;

  try {
    // Short query: simple substring match (fast)
    if (q.length < 3) {
      const idx = getIndex(pool);
      return idx
        .filter(x => x.sub.indexOf(q) >= 0 || x.t.indexOf(q) >= 0 || x.g.indexOf(q) >= 0)
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
        if (x.sub.indexOf(w) === 0) s += 50;
        if (x.sub.indexOf(w) >= 0) s += 30;
        if (x.t.indexOf(w) >= 0) s += 15;
        if (x.g.indexOf(w) >= 0) s += 10;
        if (x.p.indexOf(w) >= 0) s += 5;
      }
      if (s > 0) out.push({ b: x.b, s });
    }
    out.sort((a, b) => b.s - a.s);
    return out.map(x => x.b);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Portify search] filterBooks failed', err);
    // Worst-case fallback: return everything in pool
    return pool;
  }
}

export { safeStrip as normalizeGreek };
