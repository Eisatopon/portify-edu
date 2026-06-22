export async function POST(req) {
  try {
    const { question, bookTitle, bookSubject, bookLevel } = await req.json();
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Εισαι ενας φιλικος βοηθος για μαθητες στην Ελλαδα. Απαντας παντα στα ελληνικα. Ο μαθητης διαβαζει το βιβλιο: ' + bookTitle + ' (' + bookLevel + ' - ' + bookSubject + '). Εξηγεις απλα και κατανοητα. Οταν γραφεις μαθηματικους τυπους χρησιμοποιεις παντα LaTeX: inline με $τυπος$ και display mode με $$τυπος$$.'
          },
          { role: 'user', content: question }
        ],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Groq error:', data);
      return Response.json({ error: data.error?.message || 'Groq error' }, { status: 500 });
    }

    const answer = data.choices[0].message.content;
    return Response.json({ answer });

  } catch (error) {
    console.error('AI Chat error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}