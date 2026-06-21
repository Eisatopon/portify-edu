export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url || !url.includes('ebooksdl.cti.gr')) {
    return new Response('Invalid URL', { status: 400 });
  }
  const res = await fetch(url);
  return new Response(res.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Transfer-Encoding': 'chunked',
    },
  });
}
