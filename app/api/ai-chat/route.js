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
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'Εισαι ενας φιλικος βοηθος για μαθητες στην Ελλαδα. Απαντας παντα στα ελληνικα. Ο μαθητης διαβαζει το βιβλιο: ' + bookTitle + ' (' + bookLevel + ' - ' + bookSubject + '). Εξηγεις απλα και κατανοητα.'
          },
          { role: 'user', content: question }
        ],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    });
    const data = await res.json();
    const answer = data.choices[0].message.content;
    return Response.json({ answer });
  } catch (error) {
    return Response.json({ error: 'Κατι πηγε στραβα' }, { status: 500 });
  }
}
