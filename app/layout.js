import './globals.css';

export const metadata = {
  title: 'Portify — Σχολικά Βιβλία',
  description: 'Όλα τα σχολικά βιβλία Δημοτικού, Γυμνασίου και Λυκείου σε PDF. Γρήγορη αναζήτηση ανά τάξη και μάθημα.',
  keywords: 'σχολικά βιβλία, PDF, δημοτικό, γυμνάσιο, λύκειο, Μελίσπη, βιβλία μαθητή',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL('https://portify.gr'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Portify — Σχολικά Βιβλία',
    description: 'Όλα τα σχολικά βιβλία Δημοτικού, Γυμνασίου και Λυκείου. Βρες το βιβλίο που χρειάζεσαι γρήγορα και εύκολα.',
    url: 'https://portify.gr',
    siteName: 'Portify Βιβλία',
    locale: 'el_GR',
    type: 'website',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Portify — Σχολικά Βιβλία' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portify — Σχολικά Βιβλία',
    description: 'Όλα τα σχολικά βιβλία σε ένα μέρος.',
    images: ['/og-image.svg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Portify Βιβλία",
              "url": "https://portify.gr",
              "description": "Ψηφιακή βιβλιοθήκη σχολικών βιβλίων — Δημοτικό, Γυμνάσιο, Λύκειο",
              "inLanguage": "el",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://portify.gr/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}