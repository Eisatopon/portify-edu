import { checkRateLimit, getClientIp } from '@/src/lib/rateLimit';

export const runtime = 'nodejs';

const MAX_QUESTION_LEN = 600;

function bad(msg, status = 400, extra = {}) {
  return Response.json({ error: msg }, { status, headers: extra });
}

export async function POST(req) {
  // 1. Rate limit by IP
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return bad('Πολλά αιτήματα. Δοκίμασε σε λίγο.', 429, { 'Retry-After': String(rl.retryAfter) });
  }

  // 2. Parse + validate
  let payload;
  try { payload = await req.json(); } catch { return bad('Invalid JSON'); }
  const { question, bookTitle, bookSubject, bookLevel } = payload || {};

  if (typeof question !== 'string' || !question.trim()) return bad('Missing question');
  if (question.length > MAX_QUESTION_LEN) return bad('Η ερώτηση είναι πολύ μεγάλη.');
  if (bookTitle && typeof bookTitle !== 'string') return bad('Invalid bookTitle');

  // 3. Call Groq
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return bad('AI service not configured', 500);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Είσαι ένας εκπαιδευτικός βοηθός για μαθητές στην Ελλάδα. Απαντάς βασιζόμενος στις γνώσεις σου για το μάθημα: ${bookSubject || 'γενικό'}. Το βιβλίο του μαθητή είναι: ${bookTitle || ''} (${bookLevel || ''}). Απαντάς πάντα στα ελληνικά, απλά και κατανοητά, με σωστούς τόνους. Αν ρωτηθείς για κάτι εκτός του μαθήματος, εξηγείς φιλικά ότι μπορείς να βοηθήσεις μόνο για αυτό. Όταν γράφεις μαθηματικούς τύπους χρησιμοποίησε LaTeX: inline $τύπος$ ή display $$τύπος$$.`
          },
          { role: 'user', content: question.trim() }
        ],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Groq error:', res.status, errText.slice(0, 300));
      return bad('Ο βοηθός είναι προσωρινά απασχολημένος.', 502);
    }
    const data = await res.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) return bad('Κενή απάντηση. Δοκίμασε ξανά.', 502);

    return Response.json({ answer }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('AI chat fatal:', err);
    return bad('Σφάλμα δικτύου. Δοκίμασε ξανά.', 500);
  }
}
