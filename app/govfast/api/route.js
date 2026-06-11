import { NextResponse } from 'next/server';
import { SERVICES } from '@/src/data/govfastServices';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `Είσαι βοηθός του GovFast, μια υπηρεσία που βοηθά τους Έλληνες πολίτες με κρατικές διαδικασίες.

Σου δίνεται:
- μια λίστα διαθέσιμων υπηρεσιών (με ID, όνομα, περιγραφή, keywords)
- μια ερώτηση χρήστη στα ελληνικά, σε φυσική γλώσσα (π.χ. "Θέλω να πουλήσω αυτοκίνητο")

Στόχος σου:
- Να καταλάβεις ΤΙ ΘΕΛΕΙ ΝΑ ΚΑΝΕΙ ο χρήστης
- Να δώσεις ΠΡΑΚΤΙΚΟ οδηγό βημάτων (όχι θεωρία)
- Να προτείνεις 1-4 σχετικές υπηρεσίες από τη λίστα

Κανόνες:
- Επέλεξε ΜΟΝΟ από τις διαθέσιμες υπηρεσίες
- ΜΗΝ εφευρίσκεις υπηρεσίες που δεν υπάρχουν στη λίστα
- Αν δεν υπάρχει σχετική υπηρεσία, πες το ξεκάθαρα
- Απαντάς ΜΟΝΟ με έγκυρο JSON, χωρίς πρόλογο

Αν βρήκες σχετική διαδικασία:
{
  "found": true,
  "intro": "Σύντομη εισαγωγή σε 1 πρόταση.",
  "goal": "Μία πρόταση που περιγράφει τον στόχο του χρήστη.",
  "steps": [
    "Βήμα 1 σε απλά ελληνικά.",
    "Βήμα 2 σε απλά ελληνικά.",
    "Βήμα 3 σε απλά ελληνικά."
  ],
  "requiredServices": ["id1", "id2"],
  "warnings": [
    "Προσοχή σε προθεσμίες ή συχνά λάθη."
  ],
  "tip": "Ένα πρακτικό tip για τη συγκεκριμένη περίπτωση."
}

Αν δεν καλύπτεται:
{ "found": false, "message": "Σύντομη εξήγηση." }`;

export async function POST(req) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Λείπει το OPENAI_API_KEY.' }, { status: 500 });
  }

  try {
    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: 'Γράψε την ερώτησή σου.' }, { status: 400 });
    }

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
        max_tokens: 600,
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
      return NextResponse.json({ found: false, message: parsed.message || 'Δεν βρέθηκε σχετική διαδικασία.' });
    }

    const services = (parsed.requiredServices || [])
      .map(id => SERVICES.find(s => s.id === id))
      .filter(Boolean);

    return NextResponse.json({
      found: true,
      intro: parsed.intro || '',
      goal: parsed.goal || '',
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
      tip: parsed.tip || '',
      services,
    });

  } catch (err) {
    console.error('[govfast/api]', err.message);
    return NextResponse.json({ error: 'Πρόβλημα με την υπηρεσία.' }, { status: 500 });
  }
}