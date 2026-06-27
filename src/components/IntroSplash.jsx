'use client';
// src/components/IntroSplash.jsx — Portify intro splash (Books Stack)
// Παίζει μόνο μια φορά ανά session. Έχει skip button. Σέβεται prefers-reduced-motion.
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'portify_intro_v1';
const AUTO_DISMISS_MS = 2000;
const FADE_OUT_MS = 600;

export default function IntroSplash() {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    try {
      // Already shown this session? Skip.
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      // User prefers reduced motion? Skip.
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sessionStorage.setItem(STORAGE_KEY, '1');
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, '1');
      setShow(true);

      const tFade = setTimeout(() => setClosing(true), AUTO_DISMISS_MS);
      const tHide = setTimeout(() => setShow(false), AUTO_DISMISS_MS + FADE_OUT_MS);
      return () => { clearTimeout(tFade); clearTimeout(tHide); };
    } catch {
      // sessionStorage blocked (private mode) — just show it once per page load
    }
  }, []);

  function handleSkip() {
    setClosing(true);
    setTimeout(() => setShow(false), 250);
  }

  if (!show) return null;

  return (
    <div
      className={`intro-splash${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-label="Καλωσήρθες στο Portify"
      data-testid="intro-splash"
    >
      <button
        type="button"
        className="intro-skip"
        onClick={handleSkip}
        aria-label="Παράλειψη intro"
        data-testid="intro-skip-btn"
      >
        Παράλειψη <span aria-hidden="true">→</span>
      </button>

      <div className="intro-stack" aria-hidden="true">
        <div className="intro-book intro-book-1" />
        <div className="intro-book intro-book-2" />
        <div className="intro-book intro-book-3" />
        <div className="intro-book intro-book-4" />
        <div className="intro-book intro-book-5" />

        <div className="intro-logo">
          <div className="intro-logo-icon" />
          <div className="intro-logo-text">Portify <span>Βιβλία</span></div>
        </div>

        <div className="intro-tagline">437 σχολικά βιβλία · σε ένα μέρος</div>
      </div>

      <style>{`
        .intro-splash {
          position: fixed; inset: 0; z-index: 9999;
          background: radial-gradient(ellipse at center, #1a4fa8 0%, #0f172a 80%);
          display: flex; align-items: center; justify-content: center;
          animation: portifyIntroIn 0.2s ease-out;
        }
        .intro-splash.is-closing {
          animation: portifyIntroOut ${FADE_OUT_MS}ms ease-in forwards;
        }
        @keyframes portifyIntroIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes portifyIntroOut {
          to { opacity: 0; visibility: hidden; transform: scale(1.05); }
        }

        .intro-skip {
          position: absolute; top: 18px; right: 18px;
          background: rgba(255,255,255,0.12); color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          padding: 8px 16px; border-radius: 20px;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          backdrop-filter: blur(8px);
          font-family: inherit;
          transition: background 0.2s;
        }
        .intro-skip:hover { background: rgba(255,255,255,0.22); }
        .intro-skip:focus-visible {
          outline: 2px solid #fff; outline-offset: 2px;
        }

        .intro-stack {
          position: relative;
          width: 220px; height: 240px;
        }

        .intro-book {
          position: absolute; left: 50%;
          height: 22px;
          border-radius: 3px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35), inset 0 -2px 0 rgba(0,0,0,0.18);
          opacity: 0;
          animation: portifyBookDrop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .intro-book::before {
          content: ""; position: absolute;
          left: 8px; top: 50%; transform: translateY(-50%);
          width: 4px; height: 60%;
          background: rgba(255,255,255,0.4);
          border-radius: 2px;
        }
        .intro-book-1 { background: #ef4444; bottom: 30px;  width: 140px; margin-left: -70px; animation-delay: 0.10s; }
        .intro-book-2 { background: #f59e0b; bottom: 52px;  width: 156px; margin-left: -78px; animation-delay: 0.30s; }
        .intro-book-3 { background: #10b981; bottom: 74px;  width: 130px; margin-left: -65px; animation-delay: 0.50s; }
        .intro-book-4 { background: #3b82f6; bottom: 96px;  width: 150px; margin-left: -75px; animation-delay: 0.70s; }
        .intro-book-5 { background: #8b5cf6; bottom: 118px; width: 140px; margin-left: -70px; animation-delay: 0.90s; }

        @keyframes portifyBookDrop {
          0%   { transform: translate(-50%, -300px) rotate(-8deg); opacity: 0; }
          60%  { transform: translate(-50%, 8px)    rotate(2deg);  opacity: 1; }
          100% { transform: translate(-50%, 0)      rotate(0deg);  opacity: 1; }
        }

        .intro-logo {
          position: absolute; left: 50%; bottom: 150px;
          transform: translate(-50%, 0) scale(0);
          display: flex; align-items: center; gap: 10px;
          opacity: 0;
          animation: portifyLogoBurst 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 1.25s forwards;
          white-space: nowrap;
        }
        @keyframes portifyLogoBurst {
          0%   { transform: translate(-50%, 20px) scale(0); opacity: 0; }
          100% { transform: translate(-50%, 0) scale(1);    opacity: 1; }
        }
        .intro-logo-icon {
          width: 44px; height: 44px; border-radius: 9px;
          background: #fff; position: relative;
          box-shadow: 0 8px 24px rgba(255,255,255,0.3);
        }
        .intro-logo-icon::before {
          content: ""; position: absolute; inset: 6px;
          background: #1a4fa8; border-radius: 5px;
        }
        .intro-logo-icon::after {
          content: ""; position: absolute;
          left: 50%; top: 6px; bottom: 6px;
          width: 1.5px; background: #fff;
        }
        .intro-logo-text {
          font-size: 32px; font-weight: 800; color: #fff;
          letter-spacing: -0.5px;
        }
        .intro-logo-text span { font-weight: 400; opacity: 0.85; }

        .intro-tagline {
          position: absolute; left: 50%; bottom: 88px;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.8);
          font-size: 14px; font-weight: 500;
          letter-spacing: 0.3px;
          white-space: nowrap;
          opacity: 0;
          animation: portifyTaglineUp 0.5s ease-out 1.55s forwards;
        }
        @keyframes portifyTaglineUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }

        @media (max-width: 480px) {
          .intro-logo-text { font-size: 26px; }
          .intro-tagline { font-size: 12px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-splash, .intro-book, .intro-logo, .intro-tagline { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
