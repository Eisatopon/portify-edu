import { NextResponse } from 'next/server';
import { SERVICES } from '@/src/data/govfastServices';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `Είσαι βοηθός του GovFast, μια υπηρεσία που βοηθά τους Έλληνες πολίτες με κρατικές υπηρεσίες.

Σου δίνεται μια λίστα διαθέσιμων υπηρεσιών και ένα ερώτημα χρήστη στα ελληνικά.
Βρες τις πιο σχετικές υπηρεσίες (1-4) και δώσε έναν σύντομο οδηγό.

Κανόνες:
- Επέλεξε ΜΟΝΟ από τις διαθέσιμες υπηρεσίες
- Αν δεν υπάρχει σχετική υπηρεσία, πες το ευθέως
- Απαντάς ΜΟΝΟ με έγκυρο JSON:
{
  "found": true,
  "intro": "Σύντομη εισαγωγή (1 πρόταση)",
  "services": ["id1", "id2"],
  "tip": "Ένα χρήσιμο tip για τη συγκεκριμένη περίπτωση"
}
Αν δεν βρεθεί τίποτα: { "found": false, "message": "..." }`;

export async function POST(req) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Λείπει το OPENAI_API_KEY.' }, { status: 500 });
  }

  try {
    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: 'Γράψε την ερώτησή σου.' }, { status: 400 });
    }

    // Δίνω στο AI τη λίστα υπηρεσιών
    const servicesList = SERVICES.map(s =>
      `ID: ${s.id} | ${s.name} | ${s.desc} | Keywords: ${s.keywords?.join(', ')}`
    ).join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 400,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Ερώτηση: "${query}"\n\nΔιαθέσιμες υπηρεσίες:\n${servicesList}` }
        ],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error(`OpenAI error ${response.status}`);

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) throw new Error('Κενή απάντηση.');

    const parsed = JSON.parse(raw);

    if (!parsed.found) {
      return NextResponse.json({ found: false, message: parsed.message });
    }

    // Επιστρέφω τις πλήρεις υπηρεσίες
    const services = (parsed.services || [])
      .map(id => SERVICES.find(s => s.id === id))
      .filter(Boolean);

    return NextResponse.json({
      found: true,
      intro: parsed.intro,
      tip: parsed.tip,
      services,
    });

  } catch (err) {
    console.error('[govfast/api]', err.message);
    return NextResponse.json({ error: 'Πρόβλημα με την υπηρεσία.' }, { status: 500 });
  }
}