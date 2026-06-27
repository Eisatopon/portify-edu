// app/privacy/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Πολιτική Απορρήτου',
  description: 'Πολιτική απορρήτου του Portify — πώς συλλέγουμε και χρησιμοποιούμε δεδομένα.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

const UPDATED = '27 Ιουνίου 2026';

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>
      <nav style={{ fontSize: 14, marginBottom: 20 }}>
        <Link href="/" style={{ color: 'var(--blue)', textDecoration: 'none' }}>← Αρχική</Link>
      </nav>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>Πολιτική Απορρήτου</h1>
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 28 }}>Τελευταία ενημέρωση: {UPDATED}</p>

      <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-2)', marginBottom: 24 }}>
        Στο Portify σεβόμαστε την ιδιωτικότητά σου. Αυτή η πολιτική εξηγεί τι δεδομένα συλλέγουμε, πώς τα χρησιμοποιούμε και τα δικαιώματά σου σύμφωνα με τον <strong>GDPR (Κανονισμός 2016/679)</strong>.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 28, marginBottom: 10 }}>1. Τι συλλέγουμε</h2>
      <ul style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-2)', paddingLeft: 22 }}>
        <li><strong>Anonymous session ID</strong> — Δημιουργείται τοπικά για να αποθηκεύονται τα αγαπημένα και οι αξιολογήσεις σου. Δεν περιέχει προσωπικά στοιχεία.</li>
        <li><strong>Αξιολογήσεις βιβλίων</strong> — Αποθηκεύονται στη βάση Supabase συνδεδεμένες με το anonymous session ID.</li>
        <li><strong>Στατιστικά επισκεψιμότητας</strong> — Μέσω Google Analytics (αν είναι ενεργοποιημένο). Δεδομένα anonymized.</li>
        <li><strong>localStorage</strong> — Αγαπημένα, πρόσφατα είδες, προτίμηση theme, reading streak. Αποθηκεύονται μόνο στη συσκευή σου.</li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 28, marginBottom: 10 }}>2. Τι ΔΕΝ συλλέγουμε</h2>
      <ul style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-2)', paddingLeft: 22 }}>
        <li>Όνομα, email, τηλέφωνο ή άλλα στοιχεία ταυτότητας</li>
        <li>Διεύθυνση IP (μόνο σε rate limiting για το AI, χωρίς αποθήκευση)</li>
        <li>Δεδομένα πληρωμής (το Portify είναι δωρεάν)</li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 28, marginBottom: 10 }}>3. Cookies</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Δεν χρησιμοποιούμε cookies. Όλη η τοπική αποθήκευση γίνεται μέσω <code>localStorage</code> του browser σου.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 28, marginBottom: 10 }}>4. Τρίτοι πάροχοι</h2>
      <ul style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-2)', paddingLeft: 22 }}>
        <li><strong>Vercel</strong> — Hosting</li>
        <li><strong>Supabase</strong> — Βάση δεδομένων για αξιολογήσεις</li>
        <li><strong>Groq</strong> — AI inference (όταν χρησιμοποιείς τον AI βοηθό)</li>
        <li><strong>ebooksdl.cti.gr</strong> — Πηγή PDF αρχείων (ΙΤΥΕ Διόφαντος)</li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 28, marginBottom: 10 }}>5. Τα δικαιώματά σου (GDPR)</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)', marginBottom: 8 }}>
        Έχεις δικαίωμα να:
      </p>
      <ul style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-2)', paddingLeft: 22 }}>
        <li>Διαγράψεις όλα τα τοπικά δεδομένα: στις ρυθμίσεις του browser → Clear site data</li>
        <li>Διαγράψεις τις αξιολογήσεις σου: Κουμπί "Διαγραφή" δίπλα σε κάθε αξιολόγηση</li>
        <li>Ζητήσεις πλήρη διαγραφή: <a href="mailto:eisatoponai@gmail.com" style={{ color: 'var(--blue)' }}>eisatoponai@gmail.com</a></li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 28, marginBottom: 10 }}>6. Παιδιά</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Το Portify απευθύνεται σε μαθητές. Δεν συλλέγουμε προσωπικά δεδομένα ανηλίκων. Όλη η λειτουργικότητα είναι anonymous.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 28, marginBottom: 10 }}>7. Επαφή</h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Για οποιοδήποτε ερώτημα σχετικά με το απόρρητο: <a href="mailto:eisatoponai@gmail.com" style={{ color: 'var(--blue)' }}>eisatoponai@gmail.com</a>
      </p>
    </main>
  );
}
