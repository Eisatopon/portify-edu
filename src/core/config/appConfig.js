// src/core/config/appConfig.js

// ─── Environment ──────────────────────────────────────────────────────────────
export const ENV = Object.freeze({
  MODE:    process.env.NODE_ENV || 'production',
  IS_DEV:  process.env.NODE_ENV === 'development',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://portify.gr',
});

// ─── App ──────────────────────────────────────────────────────────────────────
export const APP = Object.freeze({
  NAME:        'Portify.gr',
  TAGLINE:     'Faster than search',
  DESCRIPTION: 'Portify.gr - Ό,τι χρειάζεσαι στην καθημερινότητά σου, σε δευτερόλεπτα.',
  URL:         ENV.APP_URL,
  LOCALE:      'el_GR',
  LANG:        'el',
});

// ─── Meta / SEO ───────────────────────────────────────────────────────────────
export const META = Object.freeze({
  THEME_COLOR:    '#f5c842',
  TWITTER_HANDLE: '@portifygr',
  OG_IMAGE:       '/og-image.jpg',
  OG_IMAGE_ALT:   'Portify.gr — Faster than search',
  OG_WIDTH:       1200,
  OG_HEIGHT:      630,
});

// ─── News feature ─────────────────────────────────────────────────────────────
export const NEWS = Object.freeze({
  ROUTE:   '/molis-tora/api',
  CACHE:   30,
  POLLING: 30_000,
  LIMITS: Object.freeze({
    items:    20,
    fallback: 5,
  }),
});

// ─── Video Summary feature ────────────────────────────────────────────────────
export const VIDEO_SUMMARY = Object.freeze({
  ROUTE: '/video-summary/api',
  CACHE: 300,
  LIMITS: Object.freeze({
    transcript: { maxChars:  4000 },
    summary:    { maxTokens: 300  },
  }),
});

// ─── Legacy exports ───────────────────────────────────────────────────────────
export const API_ROUTES = Object.freeze({
  news:         NEWS.ROUTE,
  videoSummary: VIDEO_SUMMARY.ROUTE,
});

export const CACHE = Object.freeze({
  news:         NEWS.CACHE,
  videoSummary: VIDEO_SUMMARY.CACHE,
});

export const LIMITS = Object.freeze({
  newsItems:       NEWS.LIMITS.items,
  newsFallback:    NEWS.LIMITS.fallback,
  transcriptChars: VIDEO_SUMMARY.LIMITS.transcript.maxChars,
  summaryTokens:   VIDEO_SUMMARY.LIMITS.summary.maxTokens,
});

export const POLLING = Object.freeze({
  news: NEWS.POLLING,
});

// ─── Master config ────────────────────────────────────────────────────────────
export const CONFIG = Object.freeze({
  ENV, APP, META, NEWS, VIDEO_SUMMARY,
  API_ROUTES, CACHE, LIMITS, POLLING,
});