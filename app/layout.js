import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { APP, META } from "@/src/core/config/appConfig";

const inter = Inter({
  subsets:  ["latin", "greek"],
  weight:   ["300", "400", "500", "600", "700", "900"],
  variable: "--font-inter",
  display:  "swap",
});

const FULL_TITLE = `${APP.NAME} — ${APP.TAGLINE}`;

export const metadata = {
  metadataBase: new URL(APP.URL),

  title: {
    default:  FULL_TITLE,
    template: `%s | ${APP.NAME}`,
  },

  description: APP.DESCRIPTION,
  keywords:    ["portify", "portal", "ειδήσεις", "gov.gr", "fast news", "χωρίς λογαριασμό"],
  authors:     [{ name: APP.NAME, url: APP.URL }],
  creator:     APP.NAME,

  alternates: {
    canonical: APP.URL,
    languages: { "el-GR": APP.URL },
  },

  openGraph: {
    title:       FULL_TITLE,
    description: APP.DESCRIPTION,
    url:         APP.URL,
    siteName:    APP.NAME,
    locale:      APP.LOCALE,
    type:        "website",
    images: [{
      url:    META.OG_IMAGE,
      width:  META.OG_WIDTH,
      height: META.OG_HEIGHT,
      alt:    META.OG_IMAGE_ALT,
    }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       FULL_TITLE,
    description: APP.DESCRIPTION,
    creator:     META.TWITTER_HANDLE,
    images:      [META.OG_IMAGE],
  },

  appleWebApp: {
    capable:        true,
    statusBarStyle: "default",
    title:          APP.NAME,
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-image-preview": "large",
    },
  },

  icons: {
    icon:     "/favicon.svg",
    apple:    "/favicon.svg",
    shortcut: "/favicon.svg",
  },

  manifest: "/manifest.json",
};

export const viewport = {
  width:        "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: META.THEME_COLOR },
    { media: "(prefers-color-scheme: dark)",  color: "#0f172a" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang={APP.LANG} className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased font-sans">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F9993EL21B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F9993EL21B');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}