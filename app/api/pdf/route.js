// Fast PDF proxy with Range request support + Edge runtime for streaming.

export const runtime = 'edge';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url || !url.includes('ebooksdl.cti.gr')) {
    return new Response('Invalid URL', { status: 400 });
  }

  // Forward Range header from browser for chunked loading
  const range = req.headers.get('range');
  const upstream = await fetch(url, {
    headers: range ? { Range: range } : {},
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response('Upstream error', { status: 502 });
  }

  const headers = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline',
    'Cache-Control': 'public, max-age=604800, immutable',
    'Accept-Ranges': 'bytes',
  });

  // Pass through size + range + caching headers from upstream
  for (const h of ['content-length', 'content-range', 'etag', 'last-modified']) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
