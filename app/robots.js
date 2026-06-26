export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
    ],
    sitemap: 'https://portify.gr/sitemap.xml',
    host: 'https://portify.gr',
  };
}
