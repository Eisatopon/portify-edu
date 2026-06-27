// app/terms/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Όροι Χρήσης',
  description: 'Όροι χρήσης του Portify — δικαιώματα και υποχρεώσεις χρηστών.',
  alternates: { canonical: '/terms' },
};

const UPDATED = '27 Ιουνίου 2026';

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>
      <nav style={{ fontSize: 14, marginBottom: 20 }}>
        <Link href="/" style={{ color: 'var(--blue)', textDecoration: 'none' }}>← Αρχική</Link>
      </nav>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Όροι Χρήσης</h1>
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 28 }}>Τελευταία ενημέρωση: {UPDATED}</p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>1. Αποδοχή όρων</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Χρησιμοποιώντας το Portify (portify.gr) αποδέχεσαι τους παρόντες όρους. Αν δεν συμφωνείς, παρακαλούμε μη χρησιμοποιείς την υπηρεσία.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>2. Φύση της υπηρεσίας</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Το Portify είναι μια <strong>δωρεάν</strong> εκπαιδευτική πλατφόρμα που συγκεντρώνει σχολικά βιβλία του ΙΤΥΕ Διόφαντος. Δεν είναι επίσημος ιστότοπος του Υπουργείου Παιδείας ή του ΙΤΥΕ.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>3. Πνευματικά δικαιώματα</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Όλα τα βιβλία προέρχονται από την Ψηφιακή Βιβλιοθήκη Μελίσπη του ΙΤΥΕ Διόφαντος. Τα πνευματικά δικαιώματα ανήκουν στους συγγραφείς και τους εκδότες. Το Portify απλώς αναπαράγει τα δημόσια διαθέσιμα PDF για εκπαιδευτικούς σκοπούς.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>4. Επιτρεπόμενη χρήση</h2>
      <ul style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-2)', paddingLeft: 22 }}>
        <li>✅ Ανάγνωση και κατέβασμα βιβλίων για προσωπική εκπαιδευτική χρήση</li>
        <li>✅ Αξιολόγηση και αποθήκευση αγαπημένων</li>
        <li>✅ Χρήση του AI βοηθού για μαθησιακή υποστήριξη</li>
        <li>❌ Αναπαραγωγή του υλικού σε άλλο ιστότοπο χωρίς αναφορά</li>
        <li>❌ Εμπορική χρήση των βιβλίων</li>
        <li>❌ Αυτοματοποιημένη μαζική λήψη (scraping)</li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>5. AI Βοηθός</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Ο AI βοηθός παρέχει εκπαιδευτική βοήθεια αλλά μπορεί να κάνει λάθη. Δεν αντικαθιστά τον εκπαιδευτικό σου. Ισχύει rate limit για αποφυγή κατάχρησης.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>6. Διαθεσιμότητα</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Η υπηρεσία παρέχεται «ως έχει». Δεν εγγυόμαστε 100% διαθεσιμότητα. Μπορούμε να αλλάξουμε ή να σταματήσουμε τη λειτουργία οποιαδήποτε στιγμή.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>7. Περιορισμός ευθύνης</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Το Portify δεν φέρει ευθύνη για ζημίες που προκύπτουν από τη χρήση της υπηρεσίας, για την ακρίβεια των απαντήσεων του AI, ή για περιεχόμενο τρίτων ιστότοπων που συνδέονται.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>8. Τροποποιήσεις</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Μπορούμε να ενημερώσουμε τους όρους ανά πάσα στιγμή. Σημαντικές αλλαγές θα ανακοινώνονται στην αρχική.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>9. Εφαρμοστέο δίκαιο</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Οι παρόντες όροι διέπονται από το ελληνικό δίκαιο.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>10. Επαφή</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Ερωτήσεις: <a href="mailto:eisatoponai@gmail.com" style={{ color: 'var(--blue)' }}>eisatoponai@gmail.com</a>
      </p>
    </main>
  );
}
