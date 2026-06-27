'use client';
import { useEffect } from 'react';

// Global keyboard shortcuts:
//   /  → focus search input
//   ?  → show shortcuts help (alert for now)
//   t  → toggle theme
export default function HotKeys() {
  useEffect(() => {
    function isTyping(e) {
      const t = e.target;
      return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    }

    function handler(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === '/' && !isTyping(e)) {
        e.preventDefault();
        const input = document.querySelector('.search-wrap input, input[type="text"]');
        if (input) { input.focus(); input.select?.(); }
      } else if (e.key === 't' && !isTyping(e)) {
        const btn = document.querySelector('.theme-toggle');
        btn?.click();
      } else if (e.key === '?' && !isTyping(e)) {
        e.preventDefault();
        alert('Συντομεύσεις πληκτρολογίου:\n\n  /  →  Αναζήτηση\n  t  →  Εναλλαγή θέματος\n  Esc →  Κλείσιμο\n  ?  →  Αυτή η βοήθεια');
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  return null;
}
