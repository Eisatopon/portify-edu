'use client';
import { useRouter, usePathname } from 'next/navigation';

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  function openFilters() {
    // If we're on the homepage, dispatch a custom event so page.js can open the bottom sheet.
    // Otherwise navigate to homepage with ?openFilters=1 query param.
    if (pathname === '/') {
      try { window.dispatchEvent(new CustomEvent('portify:open-filters')); } catch {}
    } else {
      router.push('/?openFilters=1');
    }
  }

  function goFavs() {
    router.push('/?favs=1');
  }

  const isHome = pathname === '/';

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
      <button onClick={openFilters} aria-label="Φίλτρα">
        <span className="mn-icon" aria-hidden="true">🎛</span>
        <span className="mn-label">Φίλτρα</span>
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
