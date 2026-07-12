'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AiChatPanel from './AiChatPanel';

// Καθολικός AI βοηθός: πλωτό κουμπί σε όλες τις σελίδες (εκτός των σελίδων βιβλίου,
// που έχουν δικό τους per-book βοηθό). Ανοίγει και με το event `portify:open-ai`.
export default function GlobalAiButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onBookPage = pathname && pathname.startsWith('/book/');

  useEffect(() => {
    function openIt() { setOpen(true); }
    window.addEventListener('portify:open-ai', openIt);
    return () => window.removeEventListener('portify:open-ai', openIt);
  }, []);

  if (onBookPage) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-testid="global-ai-btn"
          aria-label="Άνοιγμα AI βοηθού — ρώτησε για οποιοδήποτε βιβλίο"
          style={{
            position: 'fixed', bottom: 20, right: 20, zIndex: 1000,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #1a4fa8, #3b82f6)', color: '#fff',
            fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: '0 8px 26px rgba(26,79,168,0.45)',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 18 }}>🤖</span>
          <span>Ρώτησε τον AI</span>
        </button>
      )}
      {open && <AiChatPanel onClose={() => setOpen(false)} />}
    </>
  );
}
