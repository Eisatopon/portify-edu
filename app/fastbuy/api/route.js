import { NextResponse } from 'next/server';
import { PRODUCTS, UPDATED_AT } from '@/src/data/fastbuyProducts';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `Είσαι ένας αντικειμενικός shopping advisor για Έλληνες καταναλωτές.
Σου δίνεται μια λίστα προϊόντων με pros ΚΑΙ cons και ένα ερώτημα αγοράς.
Επέλεξε τις 3 καλύτερες επιλογές και εξήγησε γιατί — με ειλικρίνεια.

Κανόνες:
- Επέλεξε ΠΑΝΤΑ 3 προϊόντα: "best" (καλύτερη συνολικά), "value" (καλύτερη για χρήμα), "premium" (αν θέλει να ξοδέψει παραπάνω)
- Σεβάσου το budget για "best" και "value"
- Η αιτιολόγηση να είναι 1-2 προτάσεις στα ελληνικά, ειλικρινής — ανέφερε και trade-offs αν υπάρχουν
- Αν δεν υπάρχουν κατάλληλα προϊόντα, επέστρεψε κενή λίστα
- Απαντάς ΜΟΝΟ με JSON:
{
  "recommendations": [
    { "tier": "best", "product_id": "...", "reason": "..." },
    { "tier": "value", "product_id": "...", "reason": "..." },
    { "tier": "premium", "product_id": "...", "reason": "..." }
  ]
}`;

export async function POST(req) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Λείπει το κλειδί OpenAI.' }, { status: 500 });
  }

  try {
    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: 'Γράψε τι ψάχνεις.' }, { status: 400 });
    }

    const productsContext = PRODUCTS.map(p =>
      `ID: ${p.id} | ${p.brand} ${p.name} | ${p.price}€ | ${p.category} | Score: ${p.score} | Tier: ${p.tier} | BestFor: ${p.bestFor} | Pros: ${p.pros.join(', ')} | Cons: ${p.cons.join(', ')} | UseCases: ${p.useCases.join(', ')} | Tags: ${p.tags.join(', ')}`
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
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Ερώτημα: "${query}"\n\nΔιαθέσιμα προϊόντα:\n${productsContext}` }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'OpenAI error');
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim();

    if (!message) {
      return NextResponse.json({ error: 'Πρόβλημα με την υπηρεσία. Δοκίμασε ξανά.' }, { status: 502 });
    }

    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch {
      return NextResponse.json({ error: 'Πρόβλημα με την υπηρεσία. Δοκίμασε ξανά.' }, { status: 502 });
    }

    if (!Array.isArray(parsed.recommendations)) {
      return NextResponse.json({ error: 'Πρόβλημα με την υπηρεσία. Δοκίμασε ξανά.' }, { status: 502 });
    }

    const results = parsed.recommendations.map(rec => {
      const product = PRODUCTS.find(p => p.id === rec.product_id);
      if (!product) return null;
      return { ...product, tier: rec.tier, reason: rec.reason };
    }).filter(Boolean);

    return NextResponse.json({ success: true, results, updatedAt: UPDATED_AT });

  } catch (err) {
    console.error('[fastbuy]', err.message);
    return NextResponse.json({ error: 'Πρόβλημα με την υπηρεσία. Δοκίμασε ξανά.' }, { status: 500 });
  }
}