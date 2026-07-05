// scripts/buildTags.cjs — quality tags from books + ΨΜΑ. Topical nouns only, accented labels.
const fs = require('fs');
const path = require('path');
const books = require('../src/data/books.json');
const psma = require('../src/data/psma.json');

function greeklish(s) {
  const map = { α:'a',ά:'a',β:'v',γ:'g',δ:'d',ε:'e',έ:'e',ζ:'z',η:'i',ή:'i',θ:'th',ι:'i',ί:'i',ϊ:'i',ΐ:'i',κ:'k',λ:'l',μ:'m',ν:'n',ξ:'x',ο:'o',ό:'o',π:'p',ρ:'r',σ:'s',ς:'s',τ:'t',υ:'y',ύ:'y',ϋ:'y',ΰ:'y',φ:'f',χ:'ch',ψ:'ps',ω:'o',ώ:'o' };
  return String(s || '').toLowerCase().split('').map(c => map[c] ?? c).join('');
}
const slugify = (s) => greeklish(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const bookSlug = (b) => slugify(`${b.title} ${b.publisher || ''} ${b.grade || ''}`);
function getBitstreamId(url) {
  const m = String(url || '').match(/\/bitstream\/[^/]+\/(\d+)\//) || String(url || '').match(/\/(\d+)\/\d+\//);
  return m ? m[1] : null;
}
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ς/g, 'σ');

const STOP = new Set(['και','της','του','των','στο','στη','στον','στην','στις','στους','για','με','να','το','τον','την','τα','ενα','μια','ειναι','σε','απο','που','αυτο','αυτη','ολα','ολο','τησ','μου','σου','θα','δεν','κατα','προσ','ως','πωσ','τι','μεσα','τουσ','τισ','οταν','καθε','αυτα','αυτεσ','ολεσ','μονο','ποια','ποιο','ποιοσ','εχει','εχουν','κανε','εγινε']);
const BLACKLIST = new Set([
  // grades / levels
  'λυκειου','λυκειο','γυμνασιου','γυμνασιο','δημοτικου','δημοτικο','ταξη','ταξησ','γενικου','γενικο','γενικησ','παιδειασ','προσανατολισμου','τευχοσ','τομοσ',
  // structural / instructional
  'βιβλιο','βιβλιου','κεφαλαιο','κεφαλαιου','ασκηση','ασκησεισ','ασκησεων','μαθημα','μαθηματοσ','μαθηματα','σελιδα','σελιδασ','εικονα','εικονεσ','φυλλο','φυλλα','εργασιασ','εργασια','εργασιεσ','δραστηριοτητα','δραστηριοτητεσ','ενοτητα','ενοτητασ','αναφορασ','αναφορα','μεροσ','γλωσσαρι','γλωσσαριο','υλικο','υλικου','σχεση','σχεσεισ','συμπληρωση','συμπληρωσε','συμπληρωστε','ερωτηση','ερωτησεισ','σωστο','σωστη','σωστεσ','λαθοσ','βρεσ','βρειτε','αντιστοιχισε','αντιστοιχιση','επελεξε','επιλεξε','προταση','προτασεισ','προτασεων','λεξη','λεξεισ','κειμενο','κειμενα','βιντεο','ματια','δομη','περιληψη','παρουσιαση','εισαγωγη','στηλη','καρτελα','κουιζ','τεστ','επαναληψη','πινακασ','σχημα','αρχειο','αρχειου','ολοκληρο','προεπισκοπηση','περιεχομενα','παραρτημα','θεμα','θεματα','παραδειγμα','τιτλοσ','συμφωνα','παρακατω','παραπανω','ακολουθα','ακολουθεσ','διπλανη','διπλανο',
]);

function tokens(s) {
  return norm(s).split(/[^a-zα-ω0-9]+/).filter(t => t.length >= 5 && !STOP.has(t) && !BLACKLIST.has(t) && !/^\d/.test(t));
}
function originalWord(src, tok) {
  for (const w of String(src).split(/[^A-Za-zΑ-Ωα-ωΆ-Ώά-ώϊϋΐΰ0-9]+/)) {
    if (norm(w) === tok && w.length >= 5) return w[0].toUpperCase() + w.slice(1).toLowerCase();
  }
  return null;
}

const bsToBook = {};
for (const b of books) { const bs = getBitstreamId(b.pdfUrl); if (bs) bsToBook[bs] = b; }

const map = new Map();
const ensure = (t) => { if (!map.has(t)) map.set(t, { labels: {}, books: new Set(), psma: [] }); return map.get(t); };
const addLabel = (e, lbl) => { if (lbl) e.labels[lbl] = (e.labels[lbl] || 0) + 1; };

for (const b of books) {
  const seen = new Set();
  for (const src of [b.title, b.subject]) {
    for (const tok of new Set(tokens(src))) {
      if (seen.has(tok)) continue; seen.add(tok);
      const e = ensure(tok); e.books.add(b.id); addLabel(e, originalWord(src, tok));
    }
  }
}
for (const [bs, list] of Object.entries(psma)) {
  const book = bsToBook[bs];
  for (const item of list) {
    if (!item || !item.title || !item.url) continue;
    for (const tok of new Set(tokens(item.title))) {
      const e = ensure(tok);
      if (book) e.books.add(book.id);
      if (e.psma.length < 20) e.psma.push({ t: item.title, u: item.url, p: item.page ?? null, b: book ? bookSlug(book) : null, bt: book ? book.title : null });
      addLabel(e, originalWord(item.title, tok));
    }
  }
}

function bestLabel(labels, fb) {
  const es = Object.entries(labels);
  if (!es.length) return fb[0].toUpperCase() + fb.slice(1);
  es.sort((a, b) => b[1] - a[1]);
  return es[0][0];
}

// Build + quality gate: appears across >=2 books AND total related >=5
let entries = [];
for (const [tok, e] of map.entries()) {
  const total = e.books.size + e.psma.length;
  if (e.books.size < 2 || total < 5) continue;
  const slug = slugify(tok);
  if (!slug || slug.length < 4) continue;
  entries.push({ tok, slug, e, total, bf: e.books.size });
}
// Keep the most useful ~700 (broad coverage but not junk)
entries.sort((a, b) => b.total - a.total);
entries = entries.slice(0, 700);

const tags = {};
const slugBf = {};
for (const { slug, e, bf } of entries) {
  tags[slug] = { label: bestLabel(e.labels, slug), books: [...e.books].slice(0, 15), psma: e.psma.slice(0, 20) };
  slugBf[slug] = bf;
}

// bookTags: per book, pick 8 MOST SPECIFIC tags (lowest book-frequency) that survived
const perBook = {};
for (const { slug, e } of entries) {
  for (const bid of e.books) (perBook[bid] = perBook[bid] || []).push(slug);
}
const bookTags = {};
for (const [bid, slugs] of Object.entries(perBook)) {
  const uniq = [...new Set(slugs)];
  uniq.sort((a, b) => slugBf[a] - slugBf[b]); // specific first
  bookTags[bid] = uniq.slice(0, 8).map(s => ({ slug: s, label: tags[s].label }));
}

fs.writeFileSync(path.join(__dirname, '../src/data/tags.json'), JSON.stringify(tags));
fs.writeFileSync(path.join(__dirname, '../src/data/bookTags.json'), JSON.stringify(bookTags));
console.log('tags:', Object.keys(tags).length, '| booksWithTags:', Object.keys(bookTags).length);
