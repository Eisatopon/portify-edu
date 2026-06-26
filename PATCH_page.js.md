// PATCH for app/page.js — apply manually or replace the useFavorites hook
// and the favBooks line. Only these two changes needed.

// 1. Replace `useFavorites` hook (lines 34-47) with this:
function useFavorites(allBooks) {
  const [favs, setFavs] = useState([]);
  useEffect(() => {
    try {
      const v2 = localStorage.getItem('portify_favs_v2');
      if (v2) { setFavs(JSON.parse(v2)); return; }
      // Migrate v1 (pdfUrl) → v2 (book.id) once
      const v1 = JSON.parse(localStorage.getItem('portify_favs') || '[]');
      const urlToId = new Map(allBooks.map(b => [b.pdfUrl, b.id]));
      const migrated = v1.map(url => urlToId.get(url)).filter(Boolean);
      localStorage.setItem('portify_favs_v2', JSON.stringify(migrated));
      setFavs(migrated);
    } catch {}
  }, [allBooks]);
  function toggle(id) {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try { localStorage.setItem('portify_favs_v2', JSON.stringify(next)); } catch {}
      return next;
    });
  }
  return { favs, toggle };
}

// 2. Replace line 72: `const { favs, toggle: toggleFav } = useFavorites();`
//    with: `const { favs, toggle: toggleFav } = useFavorites(allBooks);`

// 3. Replace line 116:
//    OLD: const favBooks = allBooks.filter(b => favs.includes(b.pdfUrl));
//    NEW: const favBooks = allBooks.filter(b => favs.includes(b.id));

// 4. Replace line 278 (BookCard call):
//    OLD: isFav={favs.includes(book.pdfUrl)} onToggleFav={() => toggleFav(book.pdfUrl)}
//    NEW: isFav={favs.includes(book.id)} onToggleFav={() => toggleFav(book.id)}

// 5. Wrap your <header>...</header>...<footer> tree with <main id="main">
//    so the skip-link in layout.js works:
//    <main id="main">{/* hero + content */}</main>
