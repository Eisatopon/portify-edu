import rawBooks from '@/src/data/books.json';

export function getAllBooks() {
  return rawBooks;
}

export function getBooksByLevel(level) {
  return rawBooks.filter(b => b.level === level);
}

export function getBookById(id) {
  return rawBooks.find(b => b.id === id) || null;
}

export function getSubjectsByLevel(level) {
  const src = level ? rawBooks.filter(b => b.level === level) : rawBooks;
  const map = {};
  src.forEach(b => { map[b.subject] = (map[b.subject] || 0) + 1; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([subject, count]) => ({ subject, count }));
}

export function getGradesByLevel(level) {
  const src = level ? rawBooks.filter(b => b.level === level) : rawBooks;
  const map = {};
  src.forEach(b => { map[b.grade] = map[b.grade] || { grade: b.grade, label: b.gradeLabel, count: 0 }; map[b.grade].count++; });
  return Object.values(map).sort((a, b) => a.grade - b.grade);
}

export function getStats() {
  const total = rawBooks.length;
  const byLevel = { dimotiko: 0, gymnasio: 0, lykeio: 0 };
  rawBooks.forEach(b => { if (byLevel[b.level] !== undefined) byLevel[b.level]++; });
  return { total, byLevel };
}