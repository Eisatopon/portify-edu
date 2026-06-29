'use client';
// src/components/IntroSplash.jsx — Portify intro splash · "Friendly Mascot"
// Παίζει μόνο μια φορά ανά session. Skip button. Σέβεται prefers-reduced-motion.
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'portify_intro_v3';
const AUTO_DISMISS_MS = 3000;
const FADE_OUT_MS = 700;

export default function IntroSplash() {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sessionStorage.setItem(STORAGE_KEY, '1');
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, '1');
      setShow(true);

      const tFade = setTimeout(() => setClosing(true), AUTO_DISMISS_MS);
      const tHide = setTimeout(() => setShow(false), AUTO_DISMISS_MS + FADE_OUT_MS);
      return () => { clearTimeout(tFade); clearTimeout(tHide); };
    } catch {}
  }, []);

  if (!show) return null;

  return (
    <div
      className={`portify-intro${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-label="Καλωσήρθες στο Portify"
      data-testid="intro-splash"
    >
      <div className="pi-stage">
        <div className="pi-text">
          <div className="pi-welcome">Καλώς ήρθες!</div>
          <div className="pi-brand">Portify</div>
          <div className="pi-tagline">Όλα τα σχολικά σου βιβλία σε ένα μέρος ✨</div>
          <svg className="pi-squiggle" viewBox="0 0 300 14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M 4 8 Q 30 -2, 60 8 T 120 8 T 180 8 T 240 8 T 296 8" />
          </svg>
        </div>

        <svg className="pi-mascot" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" aria-label="Φιλικό βιβλιαράκι">
          <line x1="78" y1="210" x2="68" y2="270" stroke="#0a1f3d" strokeWidth="4" strokeLinecap="round"/>
          <line x1="122" y1="210" x2="132" y2="270" stroke="#0a1f3d" strokeWidth="4" strokeLinecap="round"/>
          <ellipse cx="63" cy="272" rx="10" ry="4" fill="#0a1f3d"/>
          <ellipse cx="137" cy="272" rx="10" ry="4" fill="#0a1f3d"/>

          <g transform="rotate(-4 100 130)">
            <rect x="40" y="62" width="120" height="156" rx="10" fill="#ff7a59" stroke="#0a1f3d" strokeWidth="4"/>
            <line x1="100" y1="62" x2="100" y2="218" stroke="#0a1f3d" strokeWidth="2.5" strokeDasharray="3 4" opacity="0.5"/>
            <rect x="48" y="70" width="14" height="140" rx="6" fill="rgba(255,255,255,0.25)"/>
            <path d="M 65 130 Q 73 122, 81 130" stroke="#0a1f3d" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M 119 130 Q 127 122, 135 130" stroke="#0a1f3d" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="65" cy="152" rx="6" ry="3" fill="#ff4f7a" opacity="0.6"/>
            <ellipse cx="135" cy="152" rx="6" ry="3" fill="#ff4f7a" opacity="0.6"/>
            <path d="M 84 158 Q 100 172, 116 158" stroke="#0a1f3d" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          </g>

          <line x1="50" y1="155" x2="35" y2="195" stroke="#0a1f3d" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="33" cy="200" r="6" fill="#ff7a59" stroke="#0a1f3d" strokeWidth="3"/>

          <g className="pi-wave">
            <line x1="155" y1="120" x2="180" y2="80" stroke="#0a1f3d" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="183" cy="75" r="8" fill="#ff7a59" stroke="#0a1f3d" strokeWidth="3"/>
            <path d="M 170 60 Q 175 55, 180 58" stroke="#0a1f3d" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
            <path d="M 175 50 Q 180 45, 185 48" stroke="#0a1f3d" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
          </g>
        </svg>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');

        .portify-intro {
          position: fixed; inset: 0; z-index: 9999;
          background: #2870e8;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          animation: piIn 0.2s ease-out;
        }
        .portify-intro.is-closing {
          animation: piOut ${FADE_OUT_MS}ms ease-in forwards;
        }
        @keyframes piIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes piOut { to { opacity: 0; visibility: hidden; } }

        .pi-skip {
          position: absolute; top: 18px; right: 18px;
          z-index: 10;
          background: rgba(255,255,255,0.15);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          padding: 9px 16px;
          border-radius: 100px;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          font-family: inherit;
          letter-spacing: -0.01em;
          transition: background 0.3s;
        }
        .pi-skip:hover { background: rgba(255,255,255,0.28); }
        .pi-skip:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

        .pi-stage {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: clamp(20px, 5vw, 80px);
          align-items: center;
          padding: 20px;
          max-width: 1100px;
          width: 100%;
        }
        .pi-text { text-align: left; color: #fff; }

        .pi-welcome {
          font-family: "Caveat", "Patrick Hand", cursive, inherit;
          font-weight: 700;
          font-size: clamp(28px, 5vw, 48px);
          color: rgba(255,255,255,0.85);
          margin-bottom: 4px;
          letter-spacing: 0.5px;
          transform: rotate(-3deg);
          display: inline-block;
          opacity: 0;
          animation: piWelcomeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
        }
        @keyframes piWelcomeIn {
          from { opacity: 0; transform: rotate(-3deg) translateY(-12px) scale(0.9); }
          to   { opacity: 1; transform: rotate(-3deg) translateY(0) scale(1); }
        }

        .pi-brand {
          font-size: clamp(54px, 11vw, 120px);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.04em;
          line-height: 0.95;
          margin-bottom: 12px;
          opacity: 0;
          transform: translateX(-20px);
          animation: piBrandIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
        }
        @keyframes piBrandIn { to { opacity: 1; transform: translateX(0); } }

        .pi-tagline {
          font-size: clamp(15px, 2.5vw, 22px);
          font-weight: 400;
          color: rgba(255,255,255,0.92);
          letter-spacing: -0.01em;
          opacity: 0;
          transform: translateY(8px);
          animation: piTagIn 0.5s ease-out 1.0s forwards;
        }
        @keyframes piTagIn { to { opacity: 1; transform: translateY(0); } }

        .pi-squiggle {
          margin-top: 10px;
          width: clamp(160px, 30vw, 280px);
          height: 14px;
          opacity: 0;
          animation: piSquiggleIn 0.6s ease-out 1.3s forwards;
        }
        .pi-squiggle path {
          stroke: #0a1f3d;
          stroke-width: 2.5;
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: 380;
          stroke-dashoffset: 380;
          animation: piSquiggleDraw 0.9s cubic-bezier(0.45, 0, 0.55, 1) 1.3s forwards;
        }
        @keyframes piSquiggleIn { to { opacity: 1; } }
        @keyframes piSquiggleDraw { to { stroke-dashoffset: 0; } }

        .pi-mascot {
          width: clamp(140px, 22vw, 260px);
          height: auto;
          opacity: 0;
          transform: translateX(60px) rotate(8deg);
          animation: piMascotIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards,
                     piMascotBob 2s ease-in-out infinite 1.5s;
          transform-origin: bottom center;
        }
        @keyframes piMascotIn {
          to { opacity: 1; transform: translateX(0) rotate(0deg); }
        }
        @keyframes piMascotBob {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-6px) rotate(1deg); }
        }
        .pi-wave {
          transform-origin: 70% 80%;
          animation: piWave 1.2s ease-in-out infinite 1.5s;
        }
        @keyframes piWave {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(-18deg); }
          75%      { transform: rotate(15deg); }
        }

        @media (max-width: 720px) {
          .pi-stage {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 20px;
          }
          .pi-text { text-align: center; }
          .pi-squiggle { margin-left: auto; margin-right: auto; }
          .pi-mascot { order: -1; width: 140px; margin: 0 auto; }
          .pi-welcome { transform: rotate(-3deg) translateX(-12px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .portify-intro, .pi-welcome, .pi-brand, .pi-tagline,
          .pi-squiggle, .pi-squiggle path, .pi-mascot, .pi-wave {
            animation: none !important;
          }
          .pi-welcome, .pi-brand, .pi-tagline, .pi-squiggle, .pi-mascot { opacity: 1; transform: none; }
          .pi-welcome { transform: rotate(-3deg); }
          .pi-squiggle path { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
