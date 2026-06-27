// app/layout.js — Manrope brand font + everything από πριν
import { Manrope } from 'next/font/google';
import './globals.css';
import HotKeys from '@/src/components/HotKeys';
import ServiceWorkerRegister from '@/src/components/ServiceWorkerRegister';
import { GoogleAnalytics } from '@next/third-parties/google';

const manrope = Manrope({
  subsets: ['greek', 'latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const themeInit = `(function(){try{var s=localStorage.getItem('portify_theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||(m?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const SITE_URL = 'https://portify.gr';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Portify — Σχολικά Βιβλία', template: '%s · Portify' },
  description: 'Όλα τα σχολικά βιβλία Δημοτικού, Γυμνασίου και Λυκείου σε PDF. 437 βιβλία, γρήγορη αναζήτηση ανά τάξη και μάθημα, με δωρεάν AI βοηθό.',
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
        <HotKeys />
        <ServiceWorkerRegister />
        <a href="#main" style={{ position: 'absolute', left: -9999 }} className="skip-link">Μετάβαση στο περιεχόμενο</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SITE) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_ORG) }} />
        {children}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
