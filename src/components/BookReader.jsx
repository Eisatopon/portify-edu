'use client';
// src/components/BookReader.jsx
// Shows the page-1 preview image INSTANTLY (a tiny ~50KB static JPEG), so the
// student sees the book immediately. The full 41MB interactive PDF (PdfViewer)
// loads only when they tap "Διάβασε ολόκληρο το βιβλίο" — saving mobile data.
import { useState } from 'react';
import PdfViewer from '@/src/components/PdfViewer';

export default function BookReader({ pdfUrl, title, previewSrc }) {
  const [started, setStarted] = useState(false);
  const [imgOk, setImgOk] = useState(Boolean(previewSrc));

  if (started) return <PdfViewer pdfUrl={pdfUrl} title={title} />;

  return (
    <div
      data-testid="book-reader-preview"
      onClick={() => setStarted(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setStarted(true); }}
      aria-label="Διάβασε ολόκληρο το βιβλίο"
      style={{
        position: 'relative', width: '100%', minHeight: 480,
        height: 'calc(100vh - 240px)', background: '#475569',
        borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {imgOk ? (
        <img
          src={previewSrc}
          alt={`Προεπισκόπηση 1ης σελίδας: ${title}`}
          onError={() => setImgOk(false)}
          loading="eager"
          style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', objectFit: 'contain', boxShadow: '0 4px 24px rgba(0,0,0,0.35)' }}
        />
      ) : (
        <div style={{ color: '#e2e8f0', textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📖</div>
          <p style={{ fontSize: 14 }}>{title}</p>
        </div>
      )}

      {/* CTA overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0) 55%, rgba(15,23,42,0.78) 100%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <span
            data-testid="start-reading-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--blue, #1a4fa8)', color: '#fff', padding: '12px 26px', borderRadius: 999, fontWeight: 700, fontSize: 15, boxShadow: '0 6px 20px rgba(0,0,0,0.35)' }}
          >
            <span aria-hidden="true">▶</span> Διάβασε ολόκληρο το βιβλίο
          </span>
          <p style={{ color: '#cbd5e1', fontSize: 12, marginTop: 10 }}>Προεπισκόπηση 1ης σελίδας · κλικ για πλήρη ανάγνωση</p>
        </div>
      </div>
    </div>
  );
}
