export const AGE_GROUPS = [
  { id: 'youth', label: '18–29 ετών', emoji: '🎒', sub: 'Σπουδές, Πρώτη Δουλειά' },
  { id: 'working', label: '30–64 ετών', emoji: '💼', sub: 'Οικογένεια, Εργασία' },
  { id: 'senior', label: '65+ ετών', emoji: '👴', sub: 'Σύνταξη, Υγεία' },
];

export const QUESTIONS = {
  youth: [
    { id: 'student', text: 'Είσαι φοιτητής ή μαθητής;' },
    { id: 'renting', text: 'Πληρώνεις ενοίκιο;' },
    { id: 'low_income', text: 'Το εισόδημά σου είναι κάτω από 15.000€/χρόνο;' },
  ],
  working: [
    { id: 'children', text: 'Έχεις παιδιά κάτω των 18 ετών;' },
    { id: 'renting', text: 'Πληρώνεις ενοίκιο;' },
    { id: 'low_income', text: 'Το οικογενειακό εισόδημα είναι κάτω από 30.000€/χρόνο;' },
  ],
  senior: [
    { id: 'low_pension', text: 'Η σύνταξή σου είναι κάτω από 700€/μήνα;' },
    { id: 'low_income', text: 'Το εισόδημά σου είναι κάτω από 15.000€/χρόνο;' },
    { id: 'alone', text: 'Ζεις μόνος/η;' },
  ],
};

export const BENEFITS = [
  {
    id: 'rent',
    title: 'Επίδομα Ενοικίου',
    amount: 'έως 210€/μήνα',
    desc: 'Για ενοικιαστές με χαμηλό εισόδημα.',
    url: 'https://www.gov.gr/ipiresies/oikonomika-kai-foros/epidomata/epidoma-enoikiou',
    rules: { renting: true, low_income: true },
    groups: ['youth', 'working'],
  },
  {
    id: 'a21',
    title: 'Επίδομα Παιδιού (Α21)',
    amount: 'έως 168€/μήνα',
    desc: 'Για οικογένειες με παιδιά.',
    url: 'https://www.gov.gr/ipiresies/oikonomika-kai-foros/epidomata/epidoma-paidiou-a21',
    rules: { children: true },
    groups: ['working'],
  },
  {
    id: 'student_rent',
    title: 'Φοιτητικό Στεγαστικό',
    amount: 'έως 1.500€/χρόνο',
    desc: 'Για φοιτητές που νοικιάζουν σπίτι.',
    url: 'https://www.gov.gr/ipiresies/oikonomika-kai-foros/epidomata/foitetiko-stegastiko-epidoma',
    rules: { student: true, renting: true },
    groups: ['youth'],
  },
  {
    id: 'electricity',
    title: 'Κοινωνικό Τιμολόγιο Ρεύματος',
    amount: 'έκπτωση έως 60%',
    desc: 'Για χαμηλά εισοδήματα.',
    url: 'https://www.gov.gr/ipiresies/oikonomika-kai-foros/epidomata/koinoniko-timologio',
    rules: { low_income: true },
    groups: ['youth', 'working', 'senior'],
  },
];