// app/pollaplo-vivlio/page.js — Pillar page: Πολλαπλό Βιβλίο (ο πλήρης οδηγός)
import Link from 'next/link';
import GuideTopBar from '@/src/components/GuideTopBar';
import FaqSection from '@/src/components/FaqSection';

const SITE_URL = 'https://www.portify.gr';
const ACCENT = '#1a4fa8';
const PUBLISHED = '2026-07-04';
const MODIFIED = '2026-07-04';

export const metadata = {
  title: 'Πολλαπλό Βιβλίο: Ο Πλήρης Οδηγός για Εκπαιδευτικούς, Μαθητές & Γονείς (2027-2028)',
  description: 'Τι είναι το πολλαπλό βιβλίο, πώς λειτουργεί η επιλογή διδακτικών βιβλίων από το Μητρώο του ΙΕΠ, σημαντικές ημερομηνίες 2026-2027 και πού βρίσκεις τα ψηφιακά βιβλία δωρεάν.',
  alternates: { canonical: '/pollaplo-vivlio' },
  openGraph: {
    title: 'Πολλαπλό Βιβλίο: Ο Πλήρης Οδηγός (2027-2028)',
    description: 'Ο απόλυτος οδηγός για το πολλαπλό βιβλίο — τι είναι, πώς γίνεται η επιλογή, ημερομηνίες και ψηφιακό υλικό.',
    url: `${SITE_URL}/pollaplo-vivlio`,
    type: 'article',
    images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image', title: 'Πολλαπλό Βιβλίο: Ο Πλήρης Οδηγός', description: 'Τι είναι το πολλαπλό βιβλίο & πώς λειτουργεί.' },
};

const H2 = { fontSize: 24, margin: '36px 0 12px', color: 'var(--text-1)', lineHeight: 1.25 };
const P = { fontSize: 16.5, lineHeight: 1.7, color: 'var(--text-2)', margin: '0 0 14px' };
const LI = { fontSize: 16.5, lineHeight: 1.7, color: 'var(--text-2)', marginBottom: 8 };

export default function PollaploVivlioPage() {
  const faqItems = [
    { q: 'Τι είναι με απλά λόγια το πολλαπλό βιβλίο;', a: 'Είναι το νέο σύστημα όπου κάθε σχολείο επιλέγει το διδακτικό βιβλίο κάθε μαθήματος μέσα από μια λίστα εγκεκριμένων βιβλίων (το Μητρώο Διδακτικών Βιβλίων του ΙΕΠ), αντί να υπάρχει ένα υποχρεωτικό βιβλίο για όλους. Ο μαθητής εξακολουθεί να έχει ΕΝΑ βιβλίο ανά μάθημα — απλώς το σχολείο διαλέγει ποιο ταιριάζει καλύτερα.' },
    { q: 'Πότε εφαρμόζεται το πολλαπλό βιβλίο;', a: 'Η επιλογή των βιβλίων από τα σχολεία έγινε μέσα στο 2026 (προθεσμίες: Πρωτοβάθμια έως 18 Ιουνίου 2026, Δευτεροβάθμια έως 29 Ιουνίου 2026) και τα νέα βιβλία θα διανεμηθούν το σχολικό έτος 2027-2028.' },
    { q: 'Ποιος επιλέγει τα βιβλία;', a: 'Τα επιλέγουν οι εκπαιδευτικοί που διδάσκουν το κάθε μάθημα. Στη Δευτεροβάθμια, όταν υπάρχουν περισσότεροι καθηγητές με α΄ ανάθεση, η απόφαση λαμβάνεται με απλή πλειοψηφία και καταγράφεται στα πρακτικά του Συλλόγου Διδασκόντων.' },
    { q: 'Πού βρίσκω τα ψηφιακά βιβλία δωρεάν;', a: 'Τα εγκεκριμένα βιβλία διατίθενται ψηφιακά μέσω της Ψηφιακής Βιβλιοθήκης «Μελίσπη» του ΙΤΥΕ Διόφαντος. Στο Portify θα τα βρεις όλα συγκεντρωμένα, οργανωμένα ανά βαθμίδα και μάθημα, με online ανάγνωση και λήψη PDF.' },
  ];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Πολλαπλό Βιβλίο: Ο Πλήρης Οδηγός για Εκπαιδευτικούς, Μαθητές & Γονείς',
    description: metadata.description,
    inLanguage: 'el',
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    author: { '@type': 'Organization', name: 'Portify' },
    publisher: { '@type': 'Organization', name: 'Portify', logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` } },
    mainEntityOfPage: `${SITE_URL}/pollaplo-vivlio`,
    image: `${SITE_URL}/og-image.png`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Αρχική', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Πολλαπλό Βιβλίο', item: `${SITE_URL}/pollaplo-vivlio` },
    ],
  };

  return (
    <>
      <GuideTopBar />
      <article style={{ maxWidth: 820, margin: '0 auto', padding: '32px 20px 80px' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <nav aria-label="breadcrumb" style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 18 }}>
          <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }} data-testid="pillar-breadcrumb-home">Αρχική</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: 'var(--text-2)' }}>Πολλαπλό Βιβλίο</span>
        </nav>

        <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', lineHeight: 1.15, margin: '0 0 14px', color: 'var(--text-1)' }} data-testid="pillar-h1">
          Πολλαπλό Βιβλίο: Ο Πλήρης Οδηγός για Εκπαιδευτικούς, Μαθητές & Γονείς
        </h1>
        <p style={{ ...P, fontSize: 18, color: 'var(--text-2)' }}>
          Το <strong>πολλαπλό βιβλίο</strong> είναι η μεγαλύτερη αλλαγή στα σχολικά εγχειρίδια των τελευταίων δεκαετιών. Σε αυτόν τον οδηγό εξηγούμε απλά τι είναι, πώς γίνεται η επιλογή των διδακτικών βιβλίων, ποιες είναι οι σημαντικές ημερομηνίες και πού βρίσκεις τα ψηφιακά βιβλία δωρεάν.
        </p>

        <h2 style={H2}>Τι είναι το πολλαπλό βιβλίο;</h2>
        <p style={P}>
          Μέχρι σήμερα υπήρχε ένα υποχρεωτικό, ενιαίο βιβλίο για κάθε μάθημα σε όλα τα σχολεία της Ελλάδας. Με το πολλαπλό βιβλίο, το κάθε σχολείο <strong>επιλέγει</strong> ποιο βιβλίο θα χρησιμοποιήσει, μέσα από μια λίστα εγκεκριμένων τίτλων — το <strong>Μητρώο Διδακτικών Βιβλίων (Μ.Δ.Β.)</strong> του ΙΕΠ.
        </p>
        <p style={P}>
          Σημαντικό: ο κάθε μαθητής εξακολουθεί να έχει <strong>ένα</strong> βιβλίο ανά μάθημα. Απλώς πλέον δεν είναι το ίδιο υποχρεωτικά για όλα τα σχολεία — η κάθε σχολική μονάδα διαλέγει αυτό που ταιριάζει καλύτερα στη δική της τάξη και στα νέα Προγράμματα Σπουδών.
        </p>

        <h2 style={H2}>Τι αλλάζει σε σχέση με το παλιό σύστημα;</h2>
        <ul style={{ paddingLeft: 22, margin: '0 0 14px' }}>
          <li style={LI}><strong>Ποικιλία & ποιότητα:</strong> περισσότεροι τίτλοι ανά μάθημα, με σύγχρονο περιεχόμενο.</li>
          <li style={LI}><strong>Επιλογή από το σχολείο:</strong> οι εκπαιδευτικοί επιλέγουν το καταλληλότερο βιβλίο.</li>
          <li style={LI}><strong>Πιλοτική εφαρμογή:</strong> κάθε νέο εγχειρίδιο δοκιμάζεται σε πραγματικές τάξεις πριν εγκριθεί.</li>
          <li style={LI}><strong>Ενσωματωμένο ψηφιακό υλικό:</strong> εικόνες, κείμενα, ήχος, διαδραστικές δραστηριότητες και QR codes.</li>
        </ul>

        <h2 style={H2}>Το Μητρώο Διδακτικών Βιβλίων (ΜΔΒ) & η «Μελίσπη»</h2>
        <p style={P}>
          Τα βιβλία που εγκρίνονται από το ΙΕΠ εντάσσονται στο <strong>Μητρώο Διδακτικών Βιβλίων</strong> (πρόσβαση μέσω <em>mdv.iep.edu.gr</em>). Τον Απρίλιο του 2026, το Υπουργείο Παιδείας ενέκρινε <strong>230 νέα διδακτικά βιβλία</strong>. Τα ψηφιακά αντίγραφα διατίθενται μέσω της Ψηφιακής Βιβλιοθήκης Διδακτικών Βιβλίων <strong>«Μελίσπη»</strong> του ΙΤΥΕ Διόφαντος.
        </p>

        <h2 style={H2}>Ποιος επιλέγει τα βιβλία και πώς;</h2>
        <p style={P}>
          Η επιλογή γίνεται από τους <strong>εκπαιδευτικούς</strong> που διδάσκουν το αντίστοιχο μάθημα. Στη Δευτεροβάθμια, όταν υπάρχουν περισσότεροι καθηγητές με α΄ ανάθεση στο ίδιο μάθημα, η απόφαση λαμβάνεται με <strong>απλή πλειοψηφία</strong> και καταγράφεται στα πρακτικά ειδικής συνεδρίασης του Συλλόγου Διδασκόντων.
        </p>
        <p style={P}>
          Διαβάστε αναλυτικά:{' '}
          <Link href="/pollaplo-vivlio/epilogi-didaktikon-vivlion" data-testid="pillar-link-cluster1" style={{ color: ACCENT, fontWeight: 600 }}>
            Οδηγός επιλογής διδακτικών βιβλίων για εκπαιδευτικούς →
          </Link>
        </p>

        <h2 style={H2}>Σημαντικές ημερομηνίες</h2>
        <ul style={{ paddingLeft: 22, margin: '0 0 14px' }}>
          <li style={LI}><strong>Απρίλιος 2026:</strong> έγκριση 230 νέων βιβλίων και ένταξη στο Μητρώο.</li>
          <li style={LI}><strong>Έως 18 Ιουνίου 2026:</strong> προθεσμία επιλογής για την Πρωτοβάθμια Εκπαίδευση.</li>
          <li style={LI}><strong>Έως 29 Ιουνίου 2026:</strong> προθεσμία επιλογής για τη Δευτεροβάθμια Εκπαίδευση.</li>
          <li style={LI}><strong>Σχολικό έτος 2027-2028:</strong> διανομή των νέων βιβλίων στα σχολεία.</li>
        </ul>

        <h2 style={H2}>Ψηφιακό υλικό & Ψηφιακά Μαθησιακά Αντικείμενα (ΨΜΑ)</h2>
        <p style={P}>
          Το πολλαπλό βιβλίο συνδέεται με πλούσιο <strong>συμπληρωματικό ψηφιακό υλικό</strong> — βίντεο, εικόνες, αρχεία ήχου, ασκήσεις και διαδραστικές δραστηριότητες. Αυτά τα <strong>Ψηφιακά Μαθησιακά Αντικείμενα (ΨΜΑ)</strong> συνοδεύουν τα κεφάλαια και βοηθούν τους μαθητές να κατανοήσουν πιο εύκολα την ύλη.
        </p>

        <h2 style={H2}>Πώς σε βοηθά το Portify</h2>
        <p style={P}>
          Στο Portify βρίσκεις όλα τα σχολικά βιβλία συγκεντρωμένα και οργανωμένα, μαζί με χιλιάδες ΨΜΑ και έναν AI βοηθό — δωρεάν. Ξεκίνα από τη βαθμίδα σου:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
          <Link href="/dimotiko" data-testid="pillar-link-dimotiko" style={pill(ACCENT)}>Βιβλία Δημοτικού</Link>
          <Link href="/gymnasio" data-testid="pillar-link-gymnasio" style={pill(ACCENT)}>Βιβλία Γυμνασίου</Link>
          <Link href="/lykeio" data-testid="pillar-link-lykeio" style={pill(ACCENT)}>Βιβλία Λυκείου</Link>
          <Link href="/pollaplo-vivlio/psifiaka-scholika-vivlia-pdf" data-testid="pillar-link-cluster2" style={pill(ACCENT)}>Ψηφιακά βιβλία σε PDF</Link>
        </div>

        <FaqSection items={faqItems} accent={ACCENT} />
      </article>
    </>
  );
}

function pill(accent) {
  return { padding: '10px 16px', borderRadius: 999, background: accent, color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 };
}
