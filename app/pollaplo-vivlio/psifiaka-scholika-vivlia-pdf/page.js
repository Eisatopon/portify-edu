// app/pollaplo-vivlio/psifiaka-scholika-vivlia-pdf/page.js — cluster article (μαθητές/γονείς)
import Link from 'next/link';
import GuideTopBar from '@/src/components/GuideTopBar';
import FaqSection from '@/src/components/FaqSection';

const SITE_URL = 'https://www.portify.gr';
const ACCENT = '#1a4fa8';
const PUBLISHED = '2026-07-04';

export const metadata = {
  title: 'Ψηφιακά Σχολικά Βιβλία σε PDF: Δωρεάν Λήψη ανά Τάξη',
  description: 'Κατέβασε δωρεάν όλα τα σχολικά βιβλία σε PDF — Δημοτικό, Γυμνάσιο, Λύκειο. Online ανάγνωση, λήψη PDF και χιλιάδες Ψηφιακά Μαθησιακά Αντικείμενα στο Portify.',
  alternates: { canonical: '/pollaplo-vivlio/psifiaka-scholika-vivlia-pdf' },
  openGraph: {
    title: 'Ψηφιακά Σχολικά Βιβλία σε PDF: Δωρεάν Λήψη ανά Τάξη',
    description: 'Όλα τα σχολικά βιβλία σε PDF, δωρεάν, ανά τάξη και μάθημα.',
    url: `${SITE_URL}/pollaplo-vivlio/psifiaka-scholika-vivlia-pdf`,
    type: 'article',
    images: ['/og-image.png'],
  },
};

const H2 = { fontSize: 23, margin: '34px 0 12px', color: 'var(--text-1)', lineHeight: 1.25 };
const P = { fontSize: 16.5, lineHeight: 1.7, color: 'var(--text-2)', margin: '0 0 14px' };
const LI = { fontSize: 16.5, lineHeight: 1.7, color: 'var(--text-2)', marginBottom: 8 };

export default function Page() {
  const faqItems = [
    { q: 'Είναι δωρεάν τα ψηφιακά σχολικά βιβλία;', a: 'Ναι, εντελώς δωρεάν. Προέρχονται από την επίσημη Ψηφιακή Βιβλιοθήκη «Μελίσπη» του ΙΤΥΕ Διόφαντος.' },
    { q: 'Μπορώ να κατεβάσω τα βιβλία σε PDF;', a: 'Ναι. Κάθε βιβλίο ανοίγει online στον browser και μπορείς να το κατεβάσεις σε PDF για offline μελέτη, σε υπολογιστή ή κινητό.' },
    { q: 'Πώς βρίσκω το βιβλίο της τάξης μου;', a: 'Επίλεξε τη βαθμίδα (Δημοτικό, Γυμνάσιο, Λύκειο) και μετά το μάθημα, ή χρησιμοποίησε την αναζήτηση γράφοντας π.χ. «μαθηματικά β γυμνασίου».' },
  ];

  const articleJsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: metadata.title, description: metadata.description, inLanguage: 'el',
    datePublished: PUBLISHED, dateModified: PUBLISHED,
    author: { '@type': 'Organization', name: 'Portify' },
    publisher: { '@type': 'Organization', name: 'Portify', logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` } },
    mainEntityOfPage: `${SITE_URL}/pollaplo-vivlio/psifiaka-scholika-vivlia-pdf`,
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Αρχική', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Πολλαπλό Βιβλίο', item: `${SITE_URL}/pollaplo-vivlio` },
      { '@type': 'ListItem', position: 3, name: 'Ψηφιακά σχολικά βιβλία σε PDF', item: `${SITE_URL}/pollaplo-vivlio/psifiaka-scholika-vivlia-pdf` },
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
          <Link href="/pollaplo-vivlio" style={{ color: 'var(--text-3)', textDecoration: 'none' }} data-testid="cluster2-breadcrumb-pillar">Πολλαπλό Βιβλίο</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: 'var(--text-2)' }}>Ψηφιακά σχολικά βιβλία σε PDF</span>
        </nav>

        <h1 style={{ fontSize: 'clamp(26px, 5vw, 38px)', lineHeight: 1.15, margin: '0 0 14px', color: 'var(--text-1)' }} data-testid="cluster2-h1">
          Ψηφιακά Σχολικά Βιβλία σε PDF: Δωρεάν Λήψη ανά Τάξη
        </h1>
        <p style={{ ...P, fontSize: 18 }}>
          Ψάχνεις τα σχολικά βιβλία σε ψηφιακή μορφή; Στο Portify βρίσκεις <strong>όλα τα σχολικά βιβλία σε PDF</strong>, δωρεάν, οργανωμένα ανά βαθμίδα και μάθημα — Δημοτικό, Γυμνάσιο και Λύκειο.
        </p>

        <h2 style={H2}>Πώς λειτουργεί</h2>
        <ul style={{ paddingLeft: 22, margin: '0 0 14px' }}>
          <li style={LI}>Κάθε βιβλίο <strong>ανοίγει online</strong> στον browser — σε υπολογιστή ή κινητό.</li>
          <li style={LI}>Μπορείς να το <strong>κατεβάσεις σε PDF</strong> για offline μελέτη.</li>
          <li style={LI}>Κάθε βιβλίο συνοδεύεται από <strong>Ψηφιακά Μαθησιακά Αντικείμενα (ΨΜΑ)</strong>: βίντεο, ασκήσεις, εικόνες.</li>
        </ul>

        <h2 style={H2}>Βρες το βιβλίο σου ανά βαθμίδα</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
          <Link href="/dimotiko" data-testid="cluster2-link-dimotiko" style={pill(ACCENT)}>Βιβλία Δημοτικού</Link>
          <Link href="/gymnasio" data-testid="cluster2-link-gymnasio" style={pill(ACCENT)}>Βιβλία Γυμνασίου</Link>
          <Link href="/lykeio" data-testid="cluster2-link-lykeio" style={pill(ACCENT)}>Βιβλία Λυκείου</Link>
        </div>

        <h2 style={H2}>Θέλεις να μάθεις για το πολλαπλό βιβλίο;</h2>
        <p style={P}>
          Τα ψηφιακά βιβλία συνδέονται με τη μεγάλη μεταρρύθμιση του πολλαπλού βιβλίου. Διάβασε τον πλήρη οδηγό:
        </p>
        <Link href="/pollaplo-vivlio" data-testid="cluster2-back-pillar" style={pill(ACCENT)}>← Οδηγός: Πολλαπλό Βιβλίο</Link>

        <FaqSection items={faqItems} accent={ACCENT} />
      </article>
    </>
  );
}

function pill(accent) { return { padding: '10px 16px', borderRadius: 999, background: accent, color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 }; }
