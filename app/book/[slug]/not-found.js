import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }} aria-hidden="true">📕</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Δεν βρέθηκε το βιβλίο</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Το βιβλίο που ψάχνεις δεν υπάρχει ή έχει αφαιρεθεί.</p>
      <Link href="/" style={{ background: '#1a4fa8', color: '#fff', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Επιστροφή στην αρχική</Link>
    </main>
  );
}
