// Simpler PDF proxy — back to working version with minimal hardening.

export const runtime = 'nodejs';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url || !url.includes('ebooksdl.cti.gr')) {
    return new Response('Invalid URL', { status: 400 });
  }
  const res = await fetch(url);
  if (!res.ok) return new Response('Upstream error', { status: 502 });
  return new Response(res.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=604800',
    },
  });
}
