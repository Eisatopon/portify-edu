'use client';
// src/components/SupplementaryMaterial.jsx
// Shows the official Digital Learning Objects (ΨΜΑ) embedded in the book's
// interactive PDF. Receives `items` from the server (page.js) so the big
// psma.json is never shipped to the client bundle.
import { useState } from 'react';

export default function SupplementaryMaterial({ items = [] }) {
  const [expanded, setExpanded] = useState(false);

  if (!items.length) return null;

  const INITIAL = 12;
  const shown = expanded ? items : items.slice(0, INITIAL);
  const hasMore = items.length > INITIAL;

  return (
    <section
      data-testid="supplementary-material"
      aria-labelledby="psma-heading"
      style={{ marginTop: 32 }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
        <h2 id="psma-heading" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          📚 Ψηφιακό Συμπληρωματικό Υλικό
        </h2>
        <span data-testid="psma-count" style={{ background: 'var(--blue-light)', color: 'var(--blue)', fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>
          {items.length} αντικείμενα
        </span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '0 0 14px' }}>
        Διαδραστικά μαθησιακά αντικείμενα από το επίσημο διαδραστικό βιβλίο.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
        {shown.map((it) => (
          <a
            key={it.id}
            data-testid={`psma-item-${it.id}`}
            href={it.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              background: 'var(--white)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '11px 13px', textDecoration: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(26,79,168,0.10)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>🔗</span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
                {it.title || `Αντικείμενο ${it.id}`}
              </span>
              {it.page != null && (
                <span style={{ display: 'block', fontSize: 11.5, color: 'var(--text-3)', marginTop: 3 }}>
                  Σελίδα {it.page}
                </span>
              )}
            </span>
          </a>
        ))}
      </div>

      {hasMore && (
        <button
          data-testid="psma-toggle"
          onClick={() => setExpanded((v) => !v)}
          style={{
            marginTop: 12, background: 'var(--blue-light)', color: 'var(--blue)',
            border: '1px solid var(--border)', padding: '9px 18px', borderRadius: 8,
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}
        >
          {expanded ? 'Λιγότερα ▲' : `Δες και τα ${items.length - INITIAL} υπόλοιπα ▼`}
        </button>
      )}
    </section>
  );
}
