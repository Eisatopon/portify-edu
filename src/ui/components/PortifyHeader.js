'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SERVICES } from '@/src/core/config/uiConfig';

function getContrastColor(hex) {
  if (!hex || !hex.startsWith('#')) return '#fff';
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return (r*299 + g*587 + b*114) / 1000 > 128 ? '#111' : '#fff';
}

export default function PortifyHeader({ serviceId }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const service = SERVICES.find(s => s.id === serviceId);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escape key + scroll lock για mobile menu
  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    const handleClick = (e) => {
      if (!e.target.closest('#ph-mobile-menu') && !e.target.closest('.ph-mobile-toggle')) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('click', handleClick);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('click', handleClick);
    };
  }, [mobileOpen]);

  if (!service) return <div style={{ height: 64, background: '#fff', borderBottom: '4px solid #111' }} />;

  return (
    <>
      {/* Nav */}
      <nav className={`ph-nav${scrolled ? ' ph-nav-scrolled' : ''}`}>
        <Link href="/" className="ph-nav-logo">PORTIFY.GR</Link>

        <div className="ph-nav-services">
          {SERVICES.map(s => {
            const isActive = s.id === serviceId;
            return (
              <Link
                key={s.id}
                href={s.comingSoon ? '#' : s.href}
                className={`ph-nav-pill${isActive ? ' ph-nav-pill-active' : ''}${s.comingSoon ? ' ph-nav-pill-soon' : ''}`}
                style={isActive ? {
                  background: s.bg,
                  color: getContrastColor(s.bg),
                  borderColor: s.bg,
                } : {}}
                onClick={s.comingSoon ? (e) => e.preventDefault() : undefined}
              >
                {s.shortName}
                {s.isNew && <span className="ph-pill-new">Νέο</span>}
                {s.comingSoon && <span className="ph-pill-new" style={{ background:'#888' }}>Σύντομα</span>}
              </Link>
            );
          })}
        </div>

        <button
          className="ph-mobile-toggle"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
          aria-expanded={mobileOpen}
          aria-controls="ph-mobile-menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav id="ph-mobile-menu" className="ph-mobile-menu" aria-label="Υπηρεσίες Portify">
          {SERVICES.map(s => (
            <Link
              key={s.id}
              href={s.href}
              className={`ph-mobile-item${s.id === serviceId ? ' ph-mobile-active' : ''}`}
              style={s.id === serviceId ? { borderLeftColor: s.bg } : {}}
              onClick={() => setMobileOpen(false)}
            >
              <span className="ph-mobile-monogram" style={{ background: s.iconBg || '#333', color: '#fff' }}>
                {s.monogram}
              </span>
              <span>{s.shortName}</span>
              {s.isNew && <span className="ph-mobile-new">Νέο</span>}
            </Link>
          ))}
        </nav>
      )}

      {/* Hero */}
      <header className="ph-hero" style={{ background: service.bg, color: service.color }}>
        <div className="ph-hero-inner">
          <div className="ph-hero-left">
            <p className="ph-hero-cat" style={{ color: service.subColor }}>
              {service.category}
            </p>
            <h1 className="ph-hero-title">
              {service.name.split(/\n|\\n/).map((part, i, arr) => (
                <span key={i}>{part}{i < arr.length - 1 && <br />}</span>
              ))}
            </h1>
            <p className="ph-hero-desc" style={{ color: service.subColor }}>
              {service.description}
            </p>
          </div>

          <div
            className="ph-hero-icon"
            style={{ background: service.iconBg || 'rgba(0,0,0,0.2)' }}
            aria-hidden="true"
          >
            {service.monogram}
          </div>
        </div>
      </header>

      <style jsx global>{`
        /* ─── Nav ─── */
        .ph-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: #fff;
          border-bottom: 4px solid #111;
          flex-wrap: wrap;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: box-shadow 0.2s ease;
        }
        .ph-nav-scrolled { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .ph-nav-logo {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #111;
          text-decoration: none;
          transition: opacity 0.15s ease;
        }
        .ph-nav-logo:hover { opacity: 0.6; }
        .ph-nav-services { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .ph-nav-pill {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 5px 13px;
          border-radius: 99px;
          border: 1.5px solid #ddd;
          color: #555;
          text-decoration: none;
          transition: all 0.15s ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .ph-nav-pill:hover { border-color: #111; color: #111; transform: translateY(-1px); }
        .ph-nav-pill-active { box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
        .ph-pill-new {
          font-size: 8px;
          background: #e8380d;
          color: #fff;
          padding: 1px 5px;
          border-radius: 8px;
          font-weight: 700;
        }
        .ph-mobile-toggle {
          display: none;
          background: none;
          border: 1.5px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          padding: 4px 10px;
          color: #111;
        }

        /* ─── Mobile menu ─── */
        .ph-mobile-menu {
          display: none;
          position: fixed;
          top: 68px;
          left: 0;
          right: 0;
          background: #fff;
          border-bottom: 4px solid #111;
          padding: 12px 16px;
          z-index: 99;
          animation: ph-slide-down 0.2s ease;
        }
        .ph-mobile-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          padding-left: 10px;
          text-decoration: none;
          color: #111;
          border-radius: 8px;
          border-left: 3px solid transparent;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.15s ease;
        }
        .ph-mobile-item:hover { background: #f5f3ee; }
        .ph-mobile-active { background: #f5f3ee; border-left-width: 3px; }
        .ph-mobile-monogram {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .ph-mobile-new {
          margin-left: auto;
          font-size: 9px;
          background: #e8380d;
          color: #fff;
          padding: 2px 7px;
          border-radius: 10px;
          font-weight: 700;
        }

        /* ─── Breadcrumb ─── */
        .ph-breadcrumb {
          font-size: 11px;
          color: #888;
          padding: 7px 32px;
          background: #f5f3ee;
          border-bottom: 0.5px solid #d8d4cc;
        }
        .ph-breadcrumb a {
          color: #555;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: color 0.15s ease;
        }
        .ph-breadcrumb a:hover { color: #111; }
        .ph-bc-sep { margin: 0 7px; opacity: 0.4; }

        /* ─── Hero ─── */
        .ph-hero {
          border-bottom: 4px solid #111;
          position: relative;
          overflow: hidden;
          animation: ph-hero-in 0.5s cubic-bezier(.22,1,.36,1);
        }
        .ph-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 60%, rgba(0,0,0,0.07) 100%);
          pointer-events: none;
        }
        .ph-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          position: relative;
          z-index: 1;
        }
        .ph-hero-left { flex: 1; }
        .ph-hero-cat {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
          opacity: 0.85;
        }
        .ph-hero-title {
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.05;
          margin-bottom: 0.4rem;
        }
        .ph-hero-desc {
          font-size: 0.9rem;
          line-height: 1.5;
          opacity: 0.88;
          max-width: 440px;
        }
        .ph-hero-icon {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #fff;
          border: 3px solid rgba(255,255,255,0.15);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          transition: transform 0.3s cubic-bezier(.22,1,.36,1);
          cursor: default;
          user-select: none;
        }
        .ph-hero-icon:hover { transform: scale(1.05); }

        @keyframes ph-hero-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ph-slide-down {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ─── Responsive ─── */
        @media (max-width: 767px) {
          .ph-nav { padding: 14px 20px; }
          .ph-nav-services { display: none; }
          .ph-mobile-toggle { display: flex; }
          .ph-mobile-menu { display: block; }
          .ph-hero-icon { display: none; }
          .ph-hero-inner { padding: 2rem 1.25rem; }
          .ph-breadcrumb { padding: 7px 20px; }
        }
      `}</style>
    </>
  );
}