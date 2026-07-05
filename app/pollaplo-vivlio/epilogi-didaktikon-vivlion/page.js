// app/pollaplo-vivlio/epilogi-didaktikon-vivlion/page.js — cluster article (εκπαιδευτικοί)
import Link from 'next/link';
import GuideTopBar from '@/src/components/GuideTopBar';
import FaqSection from '@/src/components/FaqSection';

const SITE_URL = 'https://www.portify.gr';
const ACCENT = '#1a4fa8';
const PUBLISHED = '2026-07-04';

export const metadata = {
  title: 'Επιλογή Διδακτικών Βιβλίων 2027-2028: Οδηγός για Εκπαιδευτικούς',
  description: 'Πώς γίνεται η επιλογή διδακτικών βιβλίων από το Μητρώο του ΙΕΠ για το πολλαπλό βιβλίο: ποιος αποφασίζει, προθεσμίες, πλειοψηφία και πρακτικά Συλλόγου Διδασκόντων.',
  alternates: { canonical: '/pollaplo-vivlio/epilogi-didaktikon-vivlion' },
  openGraph: {
    title: 'Επιλογή Διδακτικών Βιβλίων 2027-2028: Οδηγός για Εκπαιδευτικούς',
    description: 'Ο οδηγός επιλογής βιβλίων από το Μητρώο του ΙΕΠ για το πολλαπλό βιβλίο.',
    url: `${SITE_URL}/pollaplo-vivlio/epilogi-didaktikon-vivlion`,
    type: 'article',
    images: ['/og-image.png'],
  },
};

const H2 = { fontSize: 23, margin: '34px 0 12px', color: 'var(--text-1)', lineHeight: 1.25 };
const P = { fontSize: 16.5, lineHeight: 1.7, color: 'var(--text-2)', margin: '0 0 14px' };
const LI = { fontSize: 16.5, lineHeight: 1.7, color: 'var(--text-2)', marginBottom: 8 };

export default function Page() {
  const faqItems = [
    { q: 'Ποιος επιλέγει τελικά το διδακτικό βιβλίο;', a: 'Οι εκπαιδευτικοί που διδάσκουν το μάθημα. Στη Δευτεροβάθμια, όταν υπάρχουν περισσότεροι με α΄ ανάθεση, αποφασίζουν με απλή πλειοψηφία.' },
    { q: 'Πού καταγράφεται η απόφαση;', a: 'Στα πρακτικά ειδικής συνεδρίασης του Συλλόγου Διδασκόντων της σχολικής μονάδας.' },
    { q: 'Από πού επιλέγονται τα βιβλία;', a: 'Αποκλειστικά από τους τίτλους του Μητρώου Διδακτικών Βιβλίων (ΜΔΒ) του ΙΕΠ, μέσω mdv.iep.edu.gr.' },
  ];

  const articleJsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: metadata.title, description: metadata.description, inLanguage: 'el',
    datePublished: PUBLISHED, dateModified: PUBLISHED,
    author: { '@type': 'Organization', name: 'Portify' },
    publisher: { '@type': 'Organization', name: 'Portify', logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` } },
    mainEntityOfPage: `${SITE_URL}/pollaplo-vivlio/epilogi-didaktikon-vivlion`,
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Αρχική', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Πολλαπλό Βιβλίο', item: `${SITE_URL}/pollaplo-vivlio` },
      { '@type': 'ListItem', position: 3, name: 'Επιλογή διδακτικών βιβλίων', item: `${SITE_URL}/pollaplo-vivlio/epilogi-didaktikon-vivlion` },
    ],
  };

  return (
    <>
      <GuideTopBar />
      <article style={{ maxWidth: 820, margin: '0 auto', padding: '32px 20px 80px' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <nav aria-label="breadcrumb" style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 18 }}>
          <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Αρχική</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/pollaplo-vivlio" style={{ color: 'var(--text-3)', textDecoration: 'none' }} data-testid="cluster1-breadcrumb-pillar">Πολλαπλό Βιβλίο</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: 'var(--text-2)' }}>Επιλογή διδακτικών βιβλίων</span>
        </nav>

        <h1 style={{ fontSize: 'clamp(26px, 5vw, 38px)', lineHeight: 1.15, margin: '0 0 14px', color: 'var(--text-1)' }} data-testid="cluster1-h1">
          Επιλογή Διδακτικών Βιβλίων 2027-2028: Οδηγός για Εκπαιδευτικούς
        </h1>
        <p style={{ ...P, fontSize: 18 }}>
          Με το <strong>πολλαπλό βιβλίο</strong>, η επιλογή του διδακτικού βιβλίου κάθε μαθήματος περνά στα χέρια των σχολικών μονάδων. Δείτε βήμα-βήμα πώς γίνεται η διαδικασία επιλογής για το σχολικό έτος 2027-2028.
        </p>

        <h2 style={H2}>Από πού επιλέγονται τα βιβλία</h2>
        <p style={P}>
          Τα σχολεία επιλέγουν <strong>αποκλειστικά</strong> μεταξύ των εγκεκριμένων τίτλων του <strong>Μητρώου Διδακτικών Βιβλίων (ΜΔΒ)</strong> του ΙΕΠ. Η πρόσβαση στο Μητρώο γίνεται μέσω <em>mdv.iep.edu.gr</em>, ενώ τα ψηφιακά αντίγραφα βρίσκονται στην Ψηφιακή Βιβλιοθήκη «Μελίσπη».
        </p>

        <h2 style={H2}>Ποιος αποφασίζει</h2>
        <ul style={{ paddingLeft: 22, margin: '0 0 14px' }}>
          <li style={LI}>Η επιλογή γίνεται από τους <strong>εκπαιδευτικούς που διδάσκουν το μάθημα</strong> στην αντίστοιχη τάξη.</li>
          <li style={LI}>Στη Δευτεροβάθμια, όταν υπάρχουν περισσότεροι καθηγητές με <strong>α΄ ανάθεση</strong>, η απόφαση λαμβάνεται με <strong>απλή πλειοψηφία</strong>.</li>
          <li style={LI}>Η τελική επιλογή καταγράφεται στα <strong>πρακτικά</strong> ειδικής συνεδρίασης του Συλλόγου Διδασκόντων.</li>
        </ul>

        <h2 style={H2}>Προθεσμίες</h2>
        <ul style={{ paddingLeft: 22, margin: '0 0 14px' }}>
          <li style={LI}><strong>Πρωτοβάθμια:</strong> έως 18 Ιουνίου 2026.</li>
          <li style={LI}><strong>Δευτεροβάθμια:</strong> έως 29 Ιουνίου 2026.</li>
          <li style={LI}>Τα βιβλία που επιλέχθηκαν διανέμονται το σχολικό έτος <strong>2027-2028</strong>.</li>
        </ul>

        <h2 style={H2}>Δες τα βιβλία στην πράξη</h2>
        <p style={P}>
          Στο Portify μπορείς να ξεφυλλίσεις τα σχολικά βιβλία online πριν αποφασίσεις, ανά βαθμίδα και μάθημα, μαζί με τα Ψηφιακά Μαθησιακά Αντικείμενα.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Link href="/pollaplo-vivlio" data-testid="cluster1-back-pillar" style={pill(ACCENT)}>← Οδηγός: Πολλαπλό Βιβλίο</Link>
          <Link href="/gymnasio" style={pillGhost()}>Βιβλία Γυμνασίου</Link>
          <Link href="/lykeio" style={pillGhost()}>Βιβλία Λυκείου</Link>
        </div>

        <FaqSection items={faqItems} accent={ACCENT} />
      </article>
    </>
  );
}

function pill(accent) { return { padding: '10px 16px', borderRadius: 999, background: accent, color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 }; }
function pillGhost() { return { padding: '10px 16px', borderRadius: 999, border: '1px solid var(--border, #e5e7eb)', color: 'var(--text-1)', background: 'var(--card, #fff)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }; }
