// app/about/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Σχετικά',
  description: 'Μάθε για το Portify — δωρεάν ψηφιακή βιβλιοθήκη σχολικών βιβλίων Δημοτικού, Γυμνασίου και Λυκείου.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>
      <nav style={{ fontSize: 14, marginBottom: 20 }}>
        <Link href="/" style={{ color: 'var(--blue)', textDecoration: 'none' }}>← Αρχική</Link>
      </nav>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Σχετικά με το Portify</h1>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text-2)', marginBottom: 20 }}>
        Το <strong>Portify</strong> είναι μια δωρεάν ψηφιακή βιβλιοθήκη που συγκεντρώνει σε ένα μέρος τα σχολικά βιβλία Δημοτικού, Γυμνασίου και Λυκείου του ελληνικού εκπαιδευτικού συστήματος.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 28, marginBottom: 12, color: 'var(--text)' }}>Η αποστολή μας</h2>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-2)', marginBottom: 18 }}>
        Δίνουμε σε μαθητές, γονείς και εκπαιδευτικούς γρήγορη και εύκολη πρόσβαση στο εκπαιδευτικό υλικό που χρειάζονται — χωρίς να χρειάζεται να ψάχνουν σε πολλούς ιστότοπους.
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 28, marginBottom: 12, color: 'var(--text)' }}>Τι περιλαμβάνει</h2>
      <ul style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-2)', marginBottom: 18, paddingLeft: 22 }}>
        <li>437 σχολικά βιβλία και τετράδια εργασιών</li>
        <li>Όλες οι τάξεις Δημοτικού (Α΄ – ΣΤ΄), Γυμνασίου (Α΄ – Γ΄) και Λυκείου (Α΄ – Γ΄)</li>
        <li>Online ανάγνωση PDF χωρίς εγκατάσταση εφαρμογής</li>
        <li>AI βοηθός για βοήθεια στα μαθήματα</li>
        <li>Αξιολογήσεις και αγαπημένα</li>
      </ul>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 28, marginBottom: 12, color: 'var(--text)' }}>Πηγή υλικού</h2>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Τα βιβλία προέρχονται από την <a href="https://ebooksdl.cti.gr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>Ψηφιακή Βιβλιοθήκη Μελίσπη</a> του ΙΤΥΕ Διόφαντος και αναπαράγονται για εκπαιδευτικούς σκοπούς. Όλα τα πνευματικά δικαιώματα ανήκουν στους νόμιμους κατόχους τους.
      </p>
    </main>
  );
}
