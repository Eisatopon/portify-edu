// src/lib/psmaRank.js — lightweight Greek keyword retrieval over ΨΜΑ titles (no embeddings).
const STOP = new Set([
  'και','της','του','των','στο','στη','στον','στην','στις','στους','για','με','να','το','η','ο','οι','τα',
  'ενα','μια','ενας','πως','τι','ποιο','ποια','ποιος','ειναι','σε','απο','ως','πιο','που','αυτο','αυτη','αυτα',
  'ολα','ολο','ολη','καθε','μου','σου','της','τον','την','θα','δεν','κ','αν','η','ή',
]);

export function normalizeGreek(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/ς/g, 'σ');
}

export function tokenize(s) {
  return normalizeGreek(s)
    .split(/[^a-zα-ω0-9]+/)
    .filter((t) => t.length >= 3 && !STOP.has(t));
}

// Returns the most relevant ΨΜΑ items for a question, ranked by keyword overlap.
export function rankPsma(list, question, limit = 8) {
  if (!Array.isArray(list) || list.length === 0) return [];
  const qTokens = new Set(tokenize(question));
  if (qTokens.size === 0) return list.slice(0, limit);

  const scored = list.map((item) => {
    const tt = tokenize(item.title);
    let score = 0;
    for (const t of tt) if (qTokens.has(t)) score++;
    return { item, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const hits = scored.filter((s) => s.score > 0).slice(0, limit).map((s) => s.item);
  // If nothing matched, fall back to the first few items so the AI still knows material exists.
  return hits.length ? hits : list.slice(0, Math.min(limit, list.length));
}
