@'
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { book, messages } = await req.json();

    const systemPrompt = `Είσαι ένας φιλικός AI βοηθός για μαθητές και καθηγητές στην Ελλάδα.
Ο χρήστης διαβάζει το βιβλίο: "${book.title}" (${book.level} – ${book.subject}).
Απαντάς στα ελληνικά, με απλή γλώσσα κατάλληλη για μαθητές.
Εξηγείς έννοιες, δίνεις παραδείγματα, και βοηθάς με ασκήσεις.
Είσαι σύντομος και ουσιαστικός — μέγιστο 150 λέξεις ανά απάντηση.`;

    const openaiMessages = messages.map(m => ({
      role: m.role,
      content: m.text
    }));

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...openaiMessages
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content;
    return Response.json({ reply });

  } catch (error) {
    console.error('AI error:', error);
    return Response.json({ reply: 'Κάτι πήγε στραβά. Δοκίμασε ξανά.' }, { status: 500 });
  }
}
'@ | Set-Content "C:\portify-edu\src\app\api\ai-book\route.js" -Encoding UTF8