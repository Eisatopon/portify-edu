export function filterBooks(books, { level, grade, subject, query }) {
  return books.filter(b => {
    if (level && b.level !== level) return false;
    if (grade && b.grade !== grade) return false;
    if (subject && b.subject !== subject) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.subject.toLowerCase().includes(q) ||
        b.gradeLabel.toLowerCase().includes(q) ||
        b.publisher.toLowerCase().includes(q)
      );
    }
    return true;
  });
}