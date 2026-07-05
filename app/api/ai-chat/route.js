import { checkRateLimit, getClientIp } from '@/src/lib/rateLimit';
import psmaData from '@/src/data/psma.json';
import { rankPsma } from '@/src/lib/psmaRank';

export const runtime = 'nodejs';

const MAX_QUESTION_LEN = 600;

function bad(msg, status = 400, extra = {}) {
  return Response.json({ error: msg }, { status, headers: extra });
}

// Safety net: strip any URLs the model may still emit inside the answer body.
function stripUrls(text) {
  if (!text) return text;
  return String(text)
    .replace(/\s*[—–-]?\s*https?:\/\/\S+/gi, '') // "— https://..." or bare URLs
    .replace(/\(\s*\)/g, '') // leftover empty parentheses
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Build a RAG context block from the book's official Digital Learning Objects (ΨΜΑ).
function buildPsmaContext(bitstreamId, question) {
  const list = (bitstreamId && psmaData[String(bitstreamId)]) || [];
  if (!list.length) return { contextText: '', sources: [] };
  const ranked = rankPsma(list, question, 6);
  const sources = ranked
    .filter((it) => it && it.title && it.url)
    .map((it) => ({ title: it.title, url: it.url, page: it.page ?? null }));
  if (!sources.length) return { contextText: '', sources: [] };
  const lines = sources
    .map((s, i) => `${i + 1}. "${s.title}"${s.page ? ` (σελ. ${s.page})` : ''} — ${s.url}`)
    .join('\n');
  const contextText = `\n\nΕΠΙΣΗΜΟ ΨΗΦΙΑΚΟ ΥΛΙΚΟ (Ψηφιακά Μαθησιακά Αντικείμενα) που συνοδεύει αυτό το βιβλίο και σχετίζεται με την ερώτηση:\n${lines}\n\nΌταν κάποιο από αυτά βοηθά την απάντηση, ανάφερέ το ΜΟΝΟ με τον τίτλο του μέσα σε εισαγωγικά (π.χ. «δες το υλικό "…"»). ΜΗΝ γράφεις ΠΟΤΕ διευθύνσεις URL ή συνδέσμους μέσα στην απάντηση — οι σύνδεσμοι εμφανίζονται αυτόματα ξεχωριστά κάτω από την απάντηση.`;
  return { contextText, sources };
}

function buildSystemPrompt({ bookSubject, bookTitle, bookLevel, contextText }) {
  return `Είσαι ένας φιλικός εκπαιδευτικός βοηθός για μαθητές στην Ελλάδα. Απαντάς βασιζόμενος στις γνώσεις σου για το μάθημα: ${bookSubject || 'γενικό'}. Το βιβλίο του μαθητή είναι: ${bookTitle || ''} (${bookLevel || ''}).

ΚΑΝΟΝΕΣ ΜΟΡΦΟΠΟΙΗΣΗΣ (πολύ σημαντικοί):
- Γράφε πάντα στα ελληνικά, απλά και καθαρά, με σωστούς τόνους, σαν να εξηγείς σε τετράδιο μαθητή.
- Χώρισε την απάντηση σε σύντομες παραγράφους με κενή γραμμή ανάμεσά τους.
- Για λίστες χρησιμοποίησε παύλα «- » στην αρχή κάθε γραμμής (μία ιδέα ανά γραμμή).
- Χρησιμοποίησε **έντονα** μόνο για 1-2 λέξεις-κλειδιά, με φειδώ.
- ΜΗΝ γράφεις ΠΟΤΕ διευθύνσεις URL, links ή «https://…» μέσα στο κείμενο.
- Για μαθηματικούς τύπους χρησιμοποίησε LaTeX: inline $τύπος$ ή display $$τύπος$$.
- Αν ρωτηθείς για κάτι εκτός του μαθήματος, εξήγησε φιλικά ότι μπορείς να βοηθήσεις μόνο για αυτό.${contextText}`;
}

async function callGroq(systemPrompt, question) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { ok: false, status: 500, error: 'no-groq-key' };
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      temperature: 0.4,
      max_tokens: 1024,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('Groq error:', res.status, errText.slice(0, 300));
    return { ok: false, status: res.status };
  }
  const data = await res.json();
  const answer = data?.choices?.[0]?.message?.content;
  return answer ? { ok: true, answer } : { ok: false, status: 502 };
}

// Fallback provider (Google Gemini) using the user's own key.
async function callGemini(systemPrompt, question) {
  const apiKey = process.env.GOOGLE_AI_KEY;
  if (!apiKey) return { ok: false, status: 500, error: 'no-gemini-key' };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: question }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('Gemini fallback error:', res.status, errText.slice(0, 300));
    return { ok: false, status: res.status };
  }
  const data = await res.json();
  const answer = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  return answer ? { ok: true, answer } : { ok: false, status: 502 };
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
  const { question, bookTitle, bookSubject, bookLevel, bitstreamId } = payload || {};

  if (typeof question !== 'string' || !question.trim()) return bad('Missing question');
  if (question.length > MAX_QUESTION_LEN) return bad('Η ερώτηση είναι πολύ μεγάλη.');
  if (bookTitle && typeof bookTitle !== 'string') return bad('Invalid bookTitle');

  const q = question.trim();

  // 3. RAG: retrieve relevant official ΨΜΑ for this book
  const { contextText, sources } = buildPsmaContext(bitstreamId, q);
  const systemPrompt = buildSystemPrompt({ bookSubject, bookTitle, bookLevel, contextText });

  // 4. Call LLM: Groq primary, Gemini fallback
  try {
    let result = await callGroq(systemPrompt, q);
    if (!result.ok) result = await callGemini(systemPrompt, q);
    if (!result.ok) return bad('Ο βοηθός είναι προσωρινά απασχολημένος.', 502);
    return Response.json({ answer: stripUrls(result.answer), sources }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('AI chat fatal:', err);
    return bad('Σφάλμα δικτύου. Δοκίμασε ξανά.', 500);
  }
}
