// app/robots.js — robots.txt (www canonical)
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: 'https://www.portify.gr/sitemap.xml',
    host: 'https://www.portify.gr',
  };
}
