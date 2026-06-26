// Fast PDF proxy with Range support + AGGRESSIVE Vercel Edge Cache.
// After first visitor loads a PDF, all next visitors get it from Vercel CDN instantly.

export const runtime = 'edge';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url || !url.includes('ebooksdl.cti.gr')) {
    return new Response('Invalid URL', { status: 400 });
  }

  const range = req.headers.get('range');

  // Use Next.js fetch cache — Vercel Data Cache stores upstream response
  const upstream = await fetch(url, {
    headers: range ? { Range: range } : {},
    // Range requests can't be cached as a single entry, so only cache full requests
    cache: range ? 'no-store' : 'force-cache',
    next: range ? undefined : { revalidate: 604800 }, // 7 days
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response('Upstream error', { status: 502 });
  }

  const headers = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline',
    'Accept-Ranges': 'bytes',
    // Browser cache: 7 days
    'Cache-Control': 'public, max-age=604800, immutable',
    // Vercel Edge CDN cache: 7 days (this is the key!)
    'CDN-Cache-Control': 'public, s-maxage=604800, max-age=604800',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=604800, max-age=604800',
  });

  for (const h of ['content-length', 'content-range', 'etag', 'last-modified']) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
