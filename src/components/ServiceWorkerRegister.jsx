'use client';
import { useEffect, useState } from 'react';

export default function ServiceWorkerRegister() {
  const [updateReady, setUpdateReady] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production' && !window.location.host.includes('portify.gr')) return;

    let refreshing = false;
    function onControllerChange() {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((reg) => {
      // Already a waiting SW (from previous visit)
      if (reg.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(reg.waiting);
        setUpdateReady(true);
      }

      // Listen for new SW installation
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        if (!newSW) return;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newSW);
            setUpdateReady(true);
          }
        });
      });

      // Manual periodic check (every 30 min while tab open)
      setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
    }).catch(() => {});

    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, []);

  function applyUpdate() {
    if (waitingWorker) {
      waitingWorker.postMessage('SKIP_WAITING');
      setUpdateReady(false);
    }
  }

  function dismiss() {
    setUpdateReady(false);
  }

  if (!updateReady) return null;

  return (
    <div role="alert" aria-live="polite"
      style={{ position: 'fixed', bottom: 80, left: 16, right: 16, maxWidth: 380, margin: '0 auto', background: 'linear-gradient(135deg, #1a4fa8, #2563eb)', color: '#fff', borderRadius: 14, padding: '12px 16px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 12, zIndex: 950 }}>
      <div style={{ fontSize: 22 }} aria-hidden="true">🚀</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Νέα έκδοση διαθέσιμη!</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>Ανανέωσε για να την εφαρμόσεις</div>
      </div>
      <button onClick={applyUpdate}
        style={{ background: '#fff', color: '#1a4fa8', border: 'none', padding: '8px 14px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
        Ανανέωση
      </button>
      <button onClick={dismiss} aria-label="Αργότερα"
        style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: 14 }}>
        ✕
      </button>
    </div>
  );
}
