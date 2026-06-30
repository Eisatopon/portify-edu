// Stable slug generator for books — Greek-safe, deterministic.
// Same input → same slug, so links never break.

const GREEK_MAP = {
  'α':'a','ά':'a','β':'v','γ':'g','δ':'d','ε':'e','έ':'e','ζ':'z','η':'i','ή':'i',
  'θ':'th','ι':'i','ί':'i','ϊ':'i','ΐ':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x',
  'ο':'o','ό':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'y','ύ':'y','ϋ':'y',
  'ΰ':'y','φ':'f','χ':'ch','ψ':'ps','ω':'o','ώ':'o'
};

function greeklish(str) {
  return str.toLowerCase().split('').map(ch => GREEK_MAP[ch] ?? ch).join('');
}

export function bookSlug(book) {
  const base = `${book.subject}-${book.gradeLabel}-${book.publisher}-${book.id?.slice(-4) || ''}`;
  return greeklish(base)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function findBookBySlug(books, slug) {
  return books.find(b => bookSlug(b) === slug) || null;
}

export function subjectSlug(subject) {
  return greeklish(String(subject || ''))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
