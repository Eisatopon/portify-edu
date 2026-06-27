// app/epikoinonia/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Επικοινωνία',
  description: 'Επικοινώνησε με την ομάδα του Portify για ερωτήσεις, παρατηρήσεις ή συνεργασίες.',
  alternates: { canonical: '/epikoinonia' },
};

export default function ContactPage() {
  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px' }}>
      <nav style={{ fontSize: 14, marginBottom: 20 }}>
        <Link href="/" style={{ color: 'var(--blue)', textDecoration: 'none' }}>← Αρχική</Link>
      </nav>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Επικοινωνία</h1>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text-2)', marginBottom: 24 }}>
        Έχεις ερώτηση, πρόταση ή βρήκες κάποιο πρόβλημα; Επικοινώνησε μαζί μας:
      </p>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Email</div>
          <a href="mailto:info@portify.gr" style={{ fontSize: 18, color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>info@portify.gr</a>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Χρόνος απόκρισης</div>
          <div style={{ fontSize: 14, color: 'var(--text-2)' }}>Συνήθως απαντάμε εντός 24-48 ωρών</div>
        </div>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 28, marginBottom: 10, color: 'var(--text)' }}>Συχνές περιπτώσεις</h2>
      <ul style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-2)', paddingLeft: 22 }}>
        <li><strong>Βρήκα λάθος σε βιβλίο</strong> — Στείλε email με το βιβλίο και τη σελίδα.</li>
        <li><strong>Πρόταση για νέο feature</strong> — Πολύ ευπρόσδεκτη! Όλες οι ιδέες εξετάζονται.</li>
        <li><strong>Συνεργασία / διαφήμιση</strong> — Για εκπαιδευτικούς φορείς και brands.</li>
        <li><strong>Αναφορά πνευματικών δικαιωμάτων</strong> — Επικοινώνησε άμεσα.</li>
      </ul>
    </main>
  );
}
