import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { extractText } from 'unpdf';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

const SYSTEM_PROMPT = `Είσαι εξαιρετικά καλός στη σύνοψη κειμένου στα ελληνικά.
Απαντάς ΑΠΟΚΛΕΙΣΤΙΚΑ με έγκυρο JSON:
{"bullets": ["...", "...", "..."]}

Κανόνες:
- Ακριβώς 3 bullets
- Κάθε bullet 1-2 προτάσεις το πολύ
- Γλώσσα: Φυσικά ελληνικά
- Εστίασε στην ουσία και τα πιο σημαντικά σημεία
- Αν δεν μπορείς να συνοψίσεις, απαντάς: {"bullets": []}
- Απαγορεύεται οποιοδήποτε κείμενο εκτός JSON`;

function extractVideoId(url) {
  try {
    const u = new URL(url);
    const v = u.searchParams.get('v');
    if (v && v.length === 11) return v;
    const paths = u.pathname.split('/');
    return paths.find(p => p.length === 11) || null;
  } catch {
    return null;
  }
}

async function fetchTranscript(videoId) {
  const langs = ['el', 'en', 'el-GR', 'en-US', null];
  for (const lang of langs) {
    try {
      const opts = lang ? { lang } : {};
      const items = await YoutubeTranscript.fetchTranscript(videoId, opts);
      if (items?.length) {
        return items.map(i => i.text).join(' ').slice(0, 12000);
      }
    } catch {}
  }
  return null;
}

async function summarize(text) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 500,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Συνόψισε αυτό το κείμενο σε 3 βασικά σημεία:\n\n${text}` }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'OpenAI error');
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim();
    if (!message) throw new Error('Κενή απάντηση από το μοντέλο.');

    const clean = message.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    if (!Array.isArray(parsed.bullets)) throw new Error('Μη έγκυρη μορφή απάντησης.');
    return parsed.bullets;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Λείπει το κλειδί OpenAI στον server.' }, { status: 500 });
  }

  const type = req.nextUrl?.searchParams?.get('type') || 'video';

  try {
    // PDF mode
    if (type === 'pdf') {
      const formData = await req.formData();
      const file = formData.get('pdf');
      if (!file) return NextResponse.json({ error: 'Δεν βρέθηκε αρχείο PDF.' }, { status: 400 });

      if (file.size > MAX_PDF_SIZE) {
        return NextResponse.json({ error: 'Μέγιστο μέγεθος αρχείου 10MB.' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const { text: rawText, totalPages } = await extractText(buffer, { mergePages: true });
      const text = rawText
        .replace(/\s+/g, ' ')
        .replace(/-\s+/g, '')
        .trim()
        .slice(0, 12000);

      if (!text.trim() || text.length < 150) {
        return NextResponse.json({ error: 'Το PDF δεν περιέχει αρκετό κείμενο ή είναι σαρωμένο (image-based).' }, { status: 422 });
      }

      const bullets = await summarize(text);
      return NextResponse.json({ success: true, bullets, pages: totalPages || 1 });
    }

    // Video mode
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'Άκυρο YouTube URL.' }, { status: 400 });

    const videoId = extractVideoId(url);
    if (!videoId) return NextResponse.json({ error: 'Άκυρο YouTube URL.' }, { status: 400 });

    const transcript = await fetchTranscript(videoId);
    if (!transcript) {
      return NextResponse.json({
        error: 'Δεν βρέθηκαν υπότιτλοι για αυτό το βίντεο. Δοκίμασε βίντεο με ενεργοποιημένους υπότιτλους.'
      }, { status: 422 });
    }

    const estimatedMinutes = Math.max(Math.round(transcript.split(' ').length / 150), 1);
    const bullets = await summarize(transcript);
    return NextResponse.json({ success: true, bullets, duration: estimatedMinutes });

  } catch (err) {
    if (err.name === 'AbortError') {
      return NextResponse.json({ error: 'Η ανάλυση πήρε πολύ ώρα. Δοκίμασε ξανά.' }, { status: 504 });
    }
    console.error('[video-summary]', err.message);
    return NextResponse.json({ error: 'Πρόβλημα με την υπηρεσία. Δοκίμασε ξανά αργότερα.' }, { status: 500 });
  }
}