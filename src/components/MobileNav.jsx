'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import allBooks from '@/src/data/books.json';
import { bookSlug } from '@/src/lib/slug';

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'light');
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.add('theme-transition');
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('portify_theme', next); } catch {}
    setTheme(next);
    setTimeout(() => document.documentElement.classList.remove('theme-transition'), 320);
  }

  function openRandom() {
    const b = allBooks[Math.floor(Math.random() * allBooks.length)];
    router.push(`/book/${bookSlug(b)}`);
  }

  function goFavs() {
    // Trigger favorites view on homepage
    router.push('/?favs=1');
  }

  const isHome = pathname === '/';
  const isBook = pathname?.startsWith('/book/');

  return (
    <nav className="mobile-nav" aria-label="Κάτω πλοήγηση κινητού">
      <button onClick={() => router.push('/')} className={isHome ? 'active' : ''} aria-label="Αρχική">
        <span className="mn-icon" aria-hidden="true">🏠</span>
        <span className="mn-label">Αρχική</span>
      </button>
      <button onClick={goFavs} aria-label="Αγαπημένα">
        <span className="mn-icon" aria-hidden="true">❤️</span>
        <span className="mn-label">Αγαπημένα</span>
      </button>
      <button onClick={openRandom} aria-label="Τυχαίο βιβλίο">
        <span className="mn-icon" aria-hidden="true">🎲</span>
        <span className="mn-label">Τυχαίο</span>
      </button>
      <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Φωτεινό θέμα' : 'Σκούρο θέμα'}>
        <span className="mn-icon" aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span className="mn-label">Θέμα</span>
      </button>

      <style jsx>{`
        .mobile-nav {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: var(--white);
          border-top: 1px solid var(--border);
          z-index: 880;
          padding: 6px 4px calc(6px + env(safe-area-inset-bottom));
          justify-content: space-around;
          align-items: center;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.06);
        }
        .mobile-nav button {
          flex: 1;
          background: none;
          border: none;
          padding: 8px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          cursor: pointer;
          color: var(--text-2);
          font-family: inherit;
          border-radius: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .mobile-nav button:hover, .mobile-nav button.active {
          color: var(--blue);
          background: var(--blue-light);
        }
        .mn-icon { font-size: 20px; line-height: 1; }
        .mn-label { font-size: 10px; font-weight: 500; }
        @media (max-width: 640px) {
          .mobile-nav { display: flex; }
        }
      `}</style>
    </nav>
  );
}
