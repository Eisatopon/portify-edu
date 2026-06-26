// Robust type detection for Greek book.type strings.
// Replaces the broken Latin string comparison in BookCard.jsx

const STUDENT_RX = /^Βιβλίο\s+μαθητή/i;
const STRIP_RX = /Βιβλίο\s+μαθητή\/μαθήτριας\s*-?\s*/i;

/** Is this primarily a student book (no badge needed)? */
export function isStudentBook(type = '') {
  return STUDENT_RX.test(type.trim());
}

/** Short label for the type badge, only when meaningful. */
export function shortTypeLabel(type = '') {
  if (!type) return '';
  if (isStudentBook(type) && !/Τετράδιο|Τεύχος|Ανθολόγιο|Άτλας/.test(type)) return '';

  let label = type.replace(STRIP_RX, '').trim();
  // Common shortcuts
  label = label
    .replace(/^Τετράδιο εργασιών(?: - )?/, 'Τετράδιο ')
    .replace(/Τεύχος\s+Α΄/, 'Α΄')
    .replace(/Τεύχος\s+Β΄/, 'Β΄')
    .replace(/Τεύχος\s+Γ΄/, 'Γ΄')
    .replace(/Ανθολόγιο Γλωσσικής Διδασκαλίας/, 'Ανθολόγιο')
    .replace(/^\s*-\s*/, '')
    .trim();
  return label.length > 28 ? label.slice(0, 27) + '…' : label;
}
