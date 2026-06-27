'use client';
import { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(display-mode: standalone)').matches) { setInstalled(true); return; }
    try { if (localStorage.getItem('portify_install_dismissed')) setDismissed(true); } catch {}

    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  function dismiss() {
    setDismissed(true);
    try { localStorage.setItem('portify_install_dismissed', '1'); } catch {}
  }

  if (installed || dismissed || !deferredPrompt) return null;

  return (
    <div style={{ position: 'fixed', bottom: 16, left: 16, right: 16, maxWidth: 380, margin: '0 auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '12px 14px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 12, zIndex: 900 }} role="dialog" aria-label="Εγκατάσταση εφαρμογής">
      <div style={{ fontSize: 26 }} aria-hidden="true">📲</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>Εγκατάστησε το Portify</div>
        <div style={{ fontSize: 12, color: '#64748b' }}>Γρήγορη πρόσβαση από την οθόνη σου</div>
      </div>
      <button onClick={install} style={{ background: '#1a4fa8', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Εγκατάσταση</button>
      <button onClick={dismiss} aria-label="Κλείσιμο" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18, padding: 4 }}>✕</button>
    </div>
  );
}
