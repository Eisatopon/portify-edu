// Safer PDF proxy: strict host check, size cap, caching, range support.

export const runtime = 'nodejs';

const ALLOWED_HOSTS = new Set(['ebooksdl.cti.gr']);
const MAX_BYTES = 60 * 1024 * 1024; // 60MB hard cap

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');
  if (!target) return new Response('Missing url', { status: 400 });

  let parsed;
  try { parsed = new URL(target); } catch { return new Response('Invalid URL', { status: 400 }); }
  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return new Response('Forbidden host', { status: 403 });
  }

  const range = req.headers.get('range');
  const upstream = await fetch(parsed.toString(), {
    headers: range ? { Range: range } : {},
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response('Upstream error', { status: 502 });
  }

  const contentLength = upstream.headers.get('content-length');
  if (contentLength && Number(contentLength) > MAX_BYTES) {
    return new Response('File too large', { status: 413 });
  }

  const headers = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline',
    // 7 days CDN cache, immutable since URLs include version hashes
    'Cache-Control': 'public, max-age=604800, immutable',
    'X-Content-Type-Options': 'nosniff',
  });
  for (const h of ['content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
