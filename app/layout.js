import './globals.css';

export const metadata = {
  title: 'Portify — Σχολικά Βιβλία',
  description: 'Όλα τα σχολικά βιβλία Δημοτικού, Γυμνασίου και Λυκείου. Δωρεάν PDF — γρήγορη αναζήτηση ανά τάξη και μάθημα.',
  keywords: 'σχολικά βιβλία, PDF, δωρεάν, δημοτικό, γυμνάσιο, λύκειο, Μελίσπη',
  openGraph: {
    title: 'Portify — Σχολικά Βιβλία δωρεάν',
    description: 'Βρες το σχολικό βιβλίο που χρειάζεσαι — γρήγορα και εύκολα',
    url: 'https://portify.gr',
    siteName: 'Portify',
    locale: 'el_GR',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  );
}