// app/about/page.js — με FAQ schema για rich snippets στο Google
import Link from 'next/link';

export const metadata = {
  title: 'Σχετικά',
  description: 'Μάθε για το Portify — δωρεάν ψηφιακή βιβλιοθήκη σχολικών βιβλίων Δημοτικού, Γυμνασίου και Λυκείου.',
  alternates: { canonical: '/about' },
};

const FAQS = [
  {
    q: 'Είναι δωρεάν το Portify;',
    a: 'Ναι, το Portify είναι 100% δωρεάν. Όλα τα βιβλία διαβάζονται ή κατεβαίνουν χωρίς εγγραφή ή πληρωμή.'
  },
  {
    q: 'Από πού προέρχονται τα βιβλία;',
    a: 'Από την Ψηφιακή Βιβλιοθήκη Μελίσπη του ΙΤΥΕ Διόφαντος, που είναι δημόσια διαθέσιμη για εκπαιδευτικούς σκοπούς.'
  },
  {
    q: 'Πόσα βιβλία υπάρχουν;',
    a: 'Έχουμε 437 βιβλία: 257 Δημοτικού, 126 Γυμνασίου και 54 Λυκείου, καλύπτοντας όλες τις τάξεις και τα μαθήματα.'
  },
  {
    q: 'Χρειάζομαι λογαριασμό για να χρησιμοποιήσω το Portify;',
    a: 'Όχι! Όλη η λειτουργικότητα είναι ανοιχτή. Τα αγαπημένα και οι αξιολογήσεις σου αποθηκεύονται τοπικά στη συσκευή σου anonymously.'
  },
  {
    q: 'Τι είναι ο AI βοηθός;',
    a: 'Ένας δωρεάν AI βοηθός που σε βοηθάει με τα μαθήματα. Ρωτάς, π.χ., "Τι είναι η άλγεβρα;" και σου δίνει εξήγηση. Δεν αντικαθιστά τον δάσκαλό σου, αλλά είναι χρήσιμος για γρήγορες απορίες.'
  },
  {
    q: 'Μπορώ να κατεβάσω τα PDFs;',
    a: 'Ναι, υπάρχει κουμπί κατεβάσματος ⬇ σε κάθε σελίδα βιβλίου. Τα PDFs είναι ιδιοκτησία του ΙΤΥΕ Διόφαντος.'
  },
];

export default function AboutPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
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

      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 32, marginBottom: 16, color: 'var(--text)' }}>Συχνές ερωτήσεις</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FAQS.map((f, i) => (
          <details key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
            <summary style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{f.q}</span>
              <span style={{ color: 'var(--text-3)', fontSize: 18 }}>+</span>
            </summary>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-2)', marginTop: 10 }}>{f.a}</p>
          </details>
        ))}
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 32, marginBottom: 12, color: 'var(--text)' }}>Πηγή υλικού</h2>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-2)' }}>
        Τα βιβλία προέρχονται από την <a href="https://ebooksdl.cti.gr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>Ψηφιακή Βιβλιοθήκη Μελίσπη</a> του ΙΤΥΕ Διόφαντος και αναπαράγονται για εκπαιδευτικούς σκοπούς. Όλα τα πνευματικά δικαιώματα ανήκουν στους νόμιμους κατόχους τους.
      </p>
    </main>
  );
}
