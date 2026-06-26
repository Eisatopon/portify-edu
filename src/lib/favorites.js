// Migration helper for favorites: pdfUrl → book.id (run once on app load)

export function migrateFavorites(allBooks) {
  if (typeof window === 'undefined') return [];
  try {
    const v2 = localStorage.getItem('portify_favs_v2');
    if (v2) return JSON.parse(v2);

    const v1 = JSON.parse(localStorage.getItem('portify_favs') || '[]');
    const urlToId = new Map(allBooks.map(b => [b.pdfUrl, b.id]));
    const migrated = v1.map(url => urlToId.get(url)).filter(Boolean);
    localStorage.setItem('portify_favs_v2', JSON.stringify(migrated));
    return migrated;
  } catch {
    return [];
  }
}

export function useFavoritesV2(allBooks) {
  // Designed to be used inside React via useState/useEffect:
  // const [favs, setFavs] = useState([]);
  // useEffect(() => setFavs(migrateFavorites(allBooks)), []);
  // For convenience export raw helpers:
  return { migrate: () => migrateFavorites(allBooks) };
}
