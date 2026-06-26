export async function POST(req) {
  const { question, pdfUrl } = await req.json();

  if (!question || !pdfUrl) {
    return Response.json({ error: 'Missing data' }, { status: 400 });
  }

  const pdfRes = await fetch(pdfUrl);
  const pdfBuffer = await pdfRes.arrayBuffer();
  const base64Pdf = Buffer.from(pdfBuffer).toString('base64');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: 'application/pdf', data: base64Pdf } },
            { text: `Είσαι βοηθός μαθητή. Απάντα στα ελληνικά βάσει του βιβλίου.\n\nΕρώτηση: ${question}` }
          ]
        }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
      })
    }
  );

  const data = await res.json();
  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || data.error?.message || 'Σφάλμα';
  return Response.json({ answer });
}
