// FaqSection — server component. Visible accordion (native <details>) + FAQPage JSON-LD.
export default function FaqSection({ items, accent = '#1a4fa8' }) {
  if (!items || !items.length) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };

  return (
    <section style={{ marginTop: 12, marginBottom: 40 }} data-testid="faq-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 style={{ fontSize: 20, margin: '0 0 16px', color: 'var(--text-1)', borderLeft: `3px solid ${accent}`, paddingLeft: 10 }}>
        Συχνές ερωτήσεις
      </h2>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((it, i) => (
          <details
            key={i}
            data-testid={`faq-item-${i}`}
            style={{ border: '1px solid var(--border, #e5e7eb)', borderRadius: 12, background: 'var(--card, #fff)', padding: '0 16px' }}
          >
            <summary
              style={{ cursor: 'pointer', fontWeight: 600, fontSize: 15, color: 'var(--text-1)', padding: '14px 0', listStyle: 'none' }}
            >
              {it.q}
            </summary>
            <p style={{ margin: '0 0 16px', fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-2)' }}>{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
