import { NextResponse } from 'next/server';
import { extractText } from 'unpdf';

const OPENAI_API_KEY  = process.env.OPENAI_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const MAX_PDF_SIZE    = 10 * 1024 * 1024; // 10MB

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
    if (u.hostname === 'youtu.be') return u.pathname.slice(1, 12);
    const v = u.searchParams.get('v');
    if (v && v.length === 11) return v;
    return null;
  } catch {
    return null;
  }
}

async function fetchCaptions(videoId) {
  // 1. Παίρνω λίστα caption tracks
  const listUrl = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`;
  const listRes = await fetch(listUrl);
  if (!listRes.ok) throw new Error(`YouTube API error: ${listRes.status}`);
  const listData = await listRes.json();

  const items = listData.items || [];
  if (items.length === 0) return null;

  // Προτιμώ ελληνικά, μετά αγγλικά, μετά οτιδήποτε
  const preferred = ['el', 'en'];
  let track = null;
  for (const lang of preferred) {
    track = items.find(i => i.snippet.language === lang);
    if (track) break;
  }
  if (!track) track = items[0];

  // 2. Κατεβάζω το transcript
  const captionUrl = `https://www.googleapis.com/youtube/v3/captions/${track.id}?key=${YOUTUBE_API_KEY}&tfmt=srt`;
  const captionRes = await fetch(captionUrl, {
    headers: { 'Accept': 'text/plain' }
  });

  if (!captionRes.ok) {
    // Fallback: χρησιμοποιώ τον τίτλο και περιγραφή του βίντεο
    return null;
  }

  const srt = await captionRes.text();
  // Αφαιρώ SRT formatting (timestamps, numbering)
  const text = srt
    .replace(/\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 12000);

  return text.length > 100 ? text : null;
}

async function fetchVideoInfo(videoId) {
  // Fallback: παίρνω τίτλο + περιγραφή για σύνοψη
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;
  const { title, description } = item.snippet;
  return `Τίτλος: ${title}\n\nΠερίληψη: ${description}`.slice(0, 8000);
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

    if (!response.ok) throw new Error(`OpenAI error ${response.status}`);
    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim();
    if (!message) throw new Error('Κενή απάντηση.');
    const parsed = JSON.parse(message.replace(/```json|```/g, '').trim());
    if (!Array.isArray(parsed.bullets)) throw new Error('Invalid format');
    return parsed.bullets;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Λείπει το OPENAI_API_KEY.' }, { status: 500 });
  }

  const type = req.nextUrl?.searchParams?.get('type') || 'video';

  try {
    // ─── PDF mode ────────────────────────────────────────────────────────────
    if (type === 'pdf') {
      const formData = await req.formData();
      const file = formData.get('pdf');
      if (!file) return NextResponse.json({ error: 'Δεν βρέθηκε αρχείο PDF.' }, { status: 400 });
      if (file.size > MAX_PDF_SIZE) return NextResponse.json({ error: 'Μέγιστο μέγεθος 10MB.' }, { status: 400 });

      const buffer = Buffer.from(await file.arrayBuffer());
      const { text: rawText, totalPages } = await extractText(buffer, { mergePages: true });
      const text = rawText.replace(/\s+/g, ' ').replace(/-\s+/g, '').trim().slice(0, 12000);

      if (!text || text.length < 150) {
        return NextResponse.json({ error: 'Το PDF δεν περιέχει αρκετό κείμενο ή είναι σαρωμένο.' }, { status: 422 });
      }

      const bullets = await summarize(text);
      return NextResponse.json({ success: true, bullets, pages: totalPages || 1 });
    }

    // ─── Video mode ───────────────────────────────────────────────────────────
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'Άκυρο YouTube URL.' }, { status: 400 });

    const videoId = extractVideoId(url);
    if (!videoId) return NextResponse.json({ error: 'Άκυρο YouTube URL.' }, { status: 400 });

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: 'Λείπει το YOUTUBE_API_KEY.' }, { status: 500 });
    }

    // Προσπαθώ πρώτα captions, μετά video info
    let text = await fetchCaptions(videoId);
    let usedFallback = false;

    if (!text) {
      text = await fetchVideoInfo(videoId);
      usedFallback = true;
    }

    if (!text) {
      return NextResponse.json({ error: 'Δεν βρέθηκε περιεχόμενο για αυτό το βίντεο.' }, { status: 422 });
    }

    const estimatedMinutes = usedFallback ? null : Math.max(Math.round(text.split(' ').length / 150), 1);
    const bullets = await summarize(text);
    return NextResponse.json({ success: true, bullets, duration: estimatedMinutes, fallback: usedFallback });

  } catch (err) {
    if (err.name === 'AbortError') {
      return NextResponse.json({ error: 'Η ανάλυση πήρε πολύ ώρα. Δοκίμασε ξανά.' }, { status: 504 });
    }
    console.error('[video-summary]', err.message);
    return NextResponse.json({ error: 'Πρόβλημα με την υπηρεσία.' }, { status: 500 });
  }
}