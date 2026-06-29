// app/layout.js — Manrope brand font + SEO + compact hero override
import { Manrope } from 'next/font/google';
import './globals.css';
import HotKeys from '@/src/components/HotKeys';
import ServiceWorkerRegister from '@/src/components/ServiceWorkerRegister';
import IntroSplash from '@/src/components/IntroSplash';
import { GoogleAnalytics } from '@next/third-parties/google';

const manrope = Manrope({
  subsets: ['greek', 'latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const themeInit = `(function(){try{var s=localStorage.getItem('portify_theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||(m?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

// Compact hero CSS — fits search bar + level cards above the fold
const heroCompactCSS = `
.hero { min-height: auto !important; padding: 56px 20px 44px !important; }
.hero-inner { max-width: 760px; margin: 0 auto; }
.hero h1 { font-size: clamp(28px, 5vw, 44px) !important; line-height: 1.15 !important; margin-bottom: 10px !important; }
.hero-pill { margin-bottom: 14px !important; }
.hero-sub { font-size: 15px !important; margin-bottom: 22px !important; }
.hero-stats { margin-top: 20px !important; gap: 28px !important; }
.hero-stat .n { font-size: 28px !important; }
@media (max-width: 640px) {
  .hero { padding: 36px 16px 32px !important; }
  .hero h1 { font-size: 26px !important; line-height: 1.18 !important; }
  .hero-sub { font-size: 14px !important; margin-bottom: 16px !important; }
  .hero-stats { margin-top: 14px !important; gap: 20px !important; }
}
`;

// IMPORTANT: canonical/SEO base must match the served domain (www.portify.gr)
const SITE_URL = 'https://www.portify.gr';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Portify — Σχολικά Βιβλία', template: '%s · Portify' },
  description: 'Όλα τα σχολικά βιβλία Δημοτικού, Γυμνασίου και Λυκείου σε PDF — και χιλιάδες Ψηφιακά Μαθησιακά Αντικείμενα (βίντεο, ασκήσεις, διαδραστικά). 437 βιβλία, γρήγορη αναζήτηση ανά τάξη και μάθημα, με δωρεάν AI βοηθό.',
  keywords: ['σχολικά βιβλία', 'PDF', 'δημοτικό', 'γυμνάσιο', 'λύκειο', 'Μελίσπη', 'βιβλία μαθητή', 'ΙΤΥΕ Διόφαντος'],
  authors: [{ name: 'Portify' }],
  applicationName: 'Portify',
  formatDetection: { telephone: false, email: false, address: false },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Portify — Σχολικά Βιβλία',
    description: 'Όλα τα σχολικά βιβλία Δημοτικού, Γυμνασίου και Λυκείου. 437 βιβλία σε ένα μέρος.',
    url: SITE_URL,
    siteName: 'Portify',
    locale: 'el_GR',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Portify — Σχολικά Βιβλία' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portify — Σχολικά Βιβλία',
    description: 'Όλα τα σχολικά βιβλία σε ένα μέρος.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
};

export const viewport = {
  themeColor: '#1a4fa8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const JSON_LD_SITE = {
  '@context': 'https://schema.org', '@type': 'WebSite',
  name: 'Portify', alternateName: 'Portify Βιβλία', url: SITE_URL,
  description: 'Ψηφιακή βιβλιοθήκη σχολικών βιβλίων — Δημοτικό, Γυμνάσιο, Λύκειο', inLanguage: 'el',
  potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
};

const JSON_LD_ORG = {
  '@context': 'https://schema.org', '@type': 'EducationalOrganization',
  name: 'Portify', url: SITE_URL, logo: `${SITE_URL}/og-image.png`,
  description: 'Δωρεάν ψηφιακή βιβλιοθήκη ελληνικών σχολικών βιβλίων.',
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="el" className={manrope.variable}>
      <body suppressHydrationWarning style={{ fontFamily: 'var(--font-manrope), system-ui, -apple-system, sans-serif' }}>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <style dangerouslySetInnerHTML={{ __html: heroCompactCSS }} />
        <HotKeys />
        <ServiceWorkerRegister />
        <IntroSplash />
        <a href="#main" style={{ position: 'absolute', left: -9999 }} className="skip-link">Μετάβαση στο περιεχόμενο</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SITE) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_ORG) }} />
        {children}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
