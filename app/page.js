'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookCard from '@/src/components/BookCard';
import Filters from '@/src/components/Filters';
import { useBookFilters } from '@/src/hooks/useBookFilters';
import { LEVEL_BADGE } from '@/src/lib/constants';
import allBooks from '@/src/data/books.json';
import AiChatPanel from '@/src/components/AiChatPanel';
import InstallPWA from '@/src/components/InstallPWA';
import ThemeToggle from '@/src/components/ThemeToggle';
import MobileNav from '@/src/components/MobileNav';
import RecentlyViewed from '@/src/components/RecentlyViewed';
import TrendingBooks from '@/src/components/TrendingBooks';
import { bookSlug } from '@/src/lib/slug';

const LEVELS = [
  { key: 'dimotiko', label: 'Δημοτικό', icon: '🏫', grades: 'Α΄ – ΣΤ΄', color: '#166534', btnColor: '#16a34a', desc: 'Γλώσσα, Μαθηματικά, Ιστορία και άλλα για τις 6 τάξεις' },
  { key: 'gymnasio', label: 'Γυμνάσιο', icon: '🏛', grades: 'Α΄ – Γ΄',  color: '#92400e', btnColor: '#d97706', desc: 'Φυσική, Χημεία, Αρχαία και άλλα για τις 3 τάξεις' },
  { key: 'lykeio',   label: 'Λύκειο',   icon: '🎓', grades: 'Α΄ – Γ΄',  color: '#5b21b6', btnColor: '#7c3aed', desc: 'Άλγεβρα, Βιολογία, Χημεία και άλλα για τις 3 τάξεις' },
];

const byLevel = { dimotiko: 0, gymnasio: 0, lykeio: 0 };
allBooks.forEach(b => { if (byLevel[b.level] !== undefined) byLevel[b.level]++; });

function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function useFavorites(allBooks) {
  const [favs, setFavs] = useState([]);
  useEffect(() => {
    try {
      const v2 = localStorage.getItem('portify_favs_v2');
      if (v2) { setFavs(JSON.parse(v2)); return; }
      // Migrate v1 (pdfUrl) -> v2 (book.id) once
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

function SkeletonGrid() {
  return (
    <div className="books-grid">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-cover" />
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
          <div className="skeleton-line btn" />
        </div>
      ))}
    </div>
  );
}

function HomePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFavs, setShowFavs] = useState(false);
  const [aiBook, setAiBook] = useState(null);
  const count = useCounter(allBooks.length);
  const searchRef = useRef(null);
  const { favs, toggle: toggleFav } = useFavorites(allBooks);

  const {
    level, grade, subject, query,
    inputValue, setInputValue,
    setLevel, toggleGrade, toggleSubject,
    submitSearch, clearSearch, clearAll,
    filtered, grades, subjects, hasFilters,
    liveResults, showLiveResults,
  } = useBookFilters(allBooks, null);

  function openRandomBook() {
    const pool = level ? allBooks.filter(b => b.level === level) : allBooks;
    if (!pool.length) return;
    const book = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/book/${bookSlug(book)}`);
  }

  // Read ?level= query param from URL on first mount and pre-select level
  useEffect(() => {
    const lvl = searchParams.get('level');
    if (lvl && ['dimotiko','gymnasio','lykeio'].includes(lvl)) {
      setLevel(lvl);
      setShowFavs(false);
    }
    if (searchParams.get('favs') === '1') {
      setShowFavs(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const lvl = searchParams.get('level');
    if (lvl && ['dimotiko','gymnasio','lykeio'].includes(lvl)) {
      setLevel(lvl);
      setShowFavs(false);
    }
    if (searchParams.get('favs') === '1') {
      setShowFavs(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function openRandomBook() {
    const pool = level ? allBooks.filter(b => b.level === level) : allBooks;
    if (!pool.length) return;
    const book = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/book/${bookSlug(book)}`);
  }

  useEffect(() => {
    setDropdownOpen(showLiveResults && liveResults.length > 0);
  }, [showLiveResults, liveResults]);

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (inputValue.trim()) {
      setDropdownOpen(false);
      setLoading(true);
      setTimeout(() => { submitSearch(inputValue.trim()); setLoading(false); }, 300);
    }
  }

  function handleLevelClick(key) {
    setShowFavs(false);
    setLoading(true);
    setTimeout(() => { setLevel(key); setLoading(false); }, 300);
  }

  function handleLiveResultClick(book) {
    setDropdownOpen(false);
    setInputValue(book.subject);
    submitSearch(book.subject);
  }

  const favBooks = allBooks.filter(b => favs.includes(b.id));
  const currentLevel = LEVELS.find(l => l.key === level);
  const activeFiltersCount = (grade ? 1 : 0) + (subject ? 1 : 0);
  const showBooks = !!(level || query || showFavs);
  const displayBooks = showFavs ? favBooks : filtered;

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">
            <svg width="34" height="34" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <rect width="32" height="32" rx="6" fill="#1a4fa8"/>
              <rect x="8" y="6" width="16" height="20" rx="2" fill="white"/>
              <rect x="8" y="6" width="8" height="20" rx="2" fill="#93c5fd"/>
              <line x1="16" y1="6" x2="16" y2="26" stroke="#1a4fa8" strokeWidth="1.5"/>
            </svg>
            <div>
              <div className="logo-name">Portify <span>Βιβλία</span></div>
              <div className="logo-sub">Ψηφιακή βιβλιοθήκη</div>
            </div>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ThemeToggle />
          <button onClick={() => { setShowFavs(true); clearAll(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: favs.length > 0 ? '#fff7ed' : 'none', border: favs.length > 0 ? '1px solid #fed7aa' : '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: favs.length > 0 ? '#c2410c' : 'var(--text-2)', fontFamily: 'inherit' }}>
            {favs.length > 0 ? '❤️' : '🤍'} Αγαπημένα {favs.length > 0 && <span style={{ background: '#c2410c', color: '#fff', borderRadius: 20, padding: '0 6px', fontSize: 11 }}>{favs.length}</span>}
          </button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-pill">ΔΗΜΟΤΙΚΟ · ΓΥΜΝΑΣΙΟ · ΛΥΚΕΙΟ</div>
          <h1>Όλα τα σχολικά βιβλία<br /><em>σε ένα μέρος</em></h1>
          <p className="hero-sub">Βρες το σχολικό βιβλίο που χρειάζεσαι — χωρίς περιπλανήσεις</p>

          <div ref={searchRef} style={{ position: 'relative', maxWidth: 540, margin: '0 auto' }}>
            <form className="search-wrap" onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '100%', margin: 0 }}>
              <span className="search-icon">🔍</span>
              <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)}
                onFocus={() => liveResults.length > 0 && setDropdownOpen(true)}
                placeholder="π.χ. Μαθηματικά Γ΄ Γυμνασίου, Φυσική, Ιστορία..." />
              <button type="button" className={`search-clear${inputValue ? ' visible' : ''}`} onClick={() => { clearSearch(); setDropdownOpen(false); }}>✕</button>
              <button type="submit" className="search-btn">Αναζήτηση</button>
            </form>

            {dropdownOpen && liveResults.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', zIndex: 200, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                {liveResults.map((book, i) => {
                  const lc = LEVEL_BADGE[book.level];
                  return (
                    <button key={i} onClick={() => handleLiveResultClick(book)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid #f1f5f9', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      {book.thumbnail ? (
                        <img src={book.thumbnail} alt="" style={{ width: 36, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 36, height: 48, background: '#f1f5f9', borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📖</div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{book.gradeLabel}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: lc.bg, color: lc.text, flexShrink: 0 }}>{lc.label}</span>
                    </button>
                  );
                })}
                <button onClick={handleSearch}
                  style={{ display: 'block', width: '100%', padding: '10px 16px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: 13, color: '#1a4fa8', fontWeight: 600, fontFamily: 'inherit', textAlign: 'center' }}>
                  Δες όλα τα αποτελέσματα για «{inputValue}» →
                </button>
              </div>
            )}
          </div>

          <div className="hero-stats">
            <div className="hero-stat"><div className="n">{count}</div><div className="l">βιβλία</div></div>
            <div className="hero-stat"><div className="n" style={{ fontSize: 15, whiteSpace: 'nowrap' }}>Το πολλαπλό βιβλίο</div><div className="l">στην εκπαίδευση</div></div>
          </div>
        </div>
      </section>

      {/* LANDING */}
      {!showBooks && (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 20px' }}>
          <p style={{ textAlign: 'center', fontSize: 16, color: 'var(--color-text-secondary)', marginBottom: 36 }}>
            Επέλεξε βαθμίδα για να δεις τα βιβλία
          </p>
          <div className="level-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {LEVELS.map(l => (
              <button key={l.key} onClick={() => handleLevelClick(l.key)}
                style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderTop: `3px solid ${l.btnColor}`, borderRadius: 16, padding: '28px 24px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${l.btnColor}33`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{l.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: l.color, marginBottom: 4 }}>{l.label}</div>
                <div style={{ fontSize: 12, color: l.btnColor, fontWeight: 600, marginBottom: 10 }}>{l.grades} · {byLevel[l.key]} βιβλία</div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 18, lineHeight: 1.5 }}>{l.desc}</p>
                <span style={{ background: l.btnColor, color: '#fff', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600 }}>Δες τα βιβλία →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Below the 3 level cards: Random book + Recently viewed */}
      {!showBooks && (
        <>
          <div style={{ maxWidth: 1100, margin: '32px auto 0', padding: '0 20px', textAlign: 'center' }}>
            <button onClick={openRandomBook}
              style={{ background: '#fff', border: '2px dashed #cbd5e1', color: '#1a4fa8', padding: '10px 22px', borderRadius: 30, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              🎲 Τυχαίο βιβλίο
            </button>
          </div>
          <TrendingBooks allBooks={allBooks} />
          <RecentlyViewed allBooks={allBooks} />
        </>
      )}

      {/* BOOKS VIEW */}
      {showBooks && (
        <>
          <div className="level-tabs">
            <div className="level-tabs-inner">
              <button onClick={() => { clearAll(); setShowFavs(false); }} className="ltab" style={{ color: 'var(--text-3)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 4 }}>
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Πίσω
              </button>
              {LEVELS.map(l => (
                <button key={l.key} onClick={() => handleLevelClick(l.key)} className={`ltab${level === l.key && !showFavs ? ' active' : ''}`}>
                  {l.icon} {l.label} <span className="cnt">{byLevel[l.key]}</span>
                </button>
              ))}
              <button onClick={() => { setShowFavs(true); clearAll(); }} className={`ltab${showFavs ? ' active' : ''}`} style={{ color: showFavs ? '#c2410c' : undefined }}>
                ❤️ Αγαπημένα <span className="cnt">{favs.length}</span>
              </button>
            </div>
          </div>

          <div className="page-main">
            {!showFavs && <Filters grades={grades} subjects={subjects} activeGrade={grade} activeSubject={subject} onGrade={toggleGrade} onSubject={toggleSubject} />}
            <div className="content">
              {!showFavs && hasFilters && (
                <div className="chips-bar">
                  <span className="chips-label">Φίλτρα:</span>
                  {grade && <span className="chip">{grades.find(g => g.grade === grade)?.label}<button onClick={() => toggleGrade(grade)}>×</button></span>}
                  {subject && <span className="chip">{subject}<button onClick={() => toggleSubject(subject)}>×</button></span>}
                  {query && <span className="chip">«{query}»<button onClick={clearSearch}>×</button></span>}
                  <button className="clear-all-btn" onClick={clearAll}>Καθαρισμός</button>
                </div>
              )}
              <p className="results-info">
                {showFavs ? (
                  <><strong>{favBooks.length}</strong> αγαπημένα βιβλία</>
                ) : (
                  <><strong>{filtered.length}</strong> βιβλία
                  {currentLevel && <> · <strong style={{ color: currentLevel.color }}>{currentLevel.label}</strong></>}
                  {subject && <> · <strong>{subject}</strong></>}
                  {grade && <> · <strong>{grades.find(g => g.grade === grade)?.label}</strong></>}</>
                )}
              </p>
              {loading ? <SkeletonGrid /> : (
                <div className="books-grid">
                  {displayBooks.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">{showFavs ? '🤍' : '📚'}</div>
                      <h3>{showFavs ? 'Δεν έχεις αγαπημένα ακόμα' : 'Δεν βρέθηκαν βιβλία'}</h3>
                      <p>{showFavs ? 'Πάτα ❤️ σε ένα βιβλίο για να το αποθηκεύσεις' : 'Δοκίμασε διαφορετικά φίλτρα'}</p>
                      <button className="btn-reset" onClick={() => { clearAll(); setShowFavs(false); }}>Επιστροφή</button>
                    </div>
                  ) : (
                    displayBooks.map((book, i) => (
                      <BookCard key={`${book.id}-${i}`} book={book} isFav={favs.includes(book.id)} onToggleFav={() => toggleFav(book.id)} onAiClick={setAiBook} />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <button className="mobile-filter-btn" onClick={() => setSheetOpen(true)}>
            🎛 Φίλτρα {activeFiltersCount > 0 && <span style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 20, padding: '1px 8px', fontSize: 12 }}>{activeFiltersCount}</span>}
          </button>

          <div className={`bottom-sheet-overlay${sheetOpen ? ' open' : ''}`} onClick={() => setSheetOpen(false)} />
          <div className={`bottom-sheet${sheetOpen ? ' open' : ''}`}>
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <h3>Φίλτρα</h3>
              <button className="bottom-sheet-close" onClick={() => setSheetOpen(false)}>×</button>
            </div>
            <div className="bottom-sheet-body">
              {grades.length > 0 && (
                <>
                  <p className="bs-section-title">Τάξη</p>
                  <div className="bs-grid">
                    {grades.map(g => (
                      <button key={g.grade} className={`bs-btn${grade === g.grade ? ' active' : ''}`} onClick={() => toggleGrade(g.grade)}>
                        <span>{g.label}</span><span className="bs-count">{g.count}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
              {subjects.length > 0 && (
                <>
                  <p className="bs-section-title">Μάθημα</p>
                  <div className="bs-grid">
                    {subjects.map(s => (
                      <button key={s.subject} className={`bs-btn${subject === s.subject ? ' active' : ''}`} onClick={() => toggleSubject(s.subject)}>
                        <span>{s.subject}</span><span className="bs-count">{s.count}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button className="bs-apply" onClick={() => setSheetOpen(false)}>
              Εμφάνισε {filtered.length} βιβλία
            </button>
          </div>
        </>
      )}

      {aiBook && (
        <AiChatPanel
          key={aiBook.pdfUrl}
          bookTitle={aiBook.title}
          bookSubject={aiBook.subject}
          bookLevel={aiBook.level}
          onClose={() => setAiBook(null)}
        />
      )}

      <MobileNav />
      <InstallPWA />

      <footer className="footer">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginBottom: 16 }}>
            <a href="/about" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: 13 }}>Σχετικά</a>
            <a href="/epikoinonia" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: 13 }}>Επικοινωνία</a>
            <a href="/privacy" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: 13 }}>Πολιτική Απορρήτου</a>
            <a href="/terms" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: 13 }}>Όροι Χρήσης</a>
          </div>
          <p style={{ fontSize: 13, textAlign: 'center' }}>
            Τα βιβλία προέρχονται από τη <a href="https://ebooksdl.cti.gr" target="_blank" rel="noopener noreferrer">Ψηφιακή Βιβλιοθήκη Μελίσπη</a> του ΙΤΥΕ Διόφαντος.
          </p>
          <p style={{ fontSize: 11, textAlign: 'center', color: 'var(--text-3)', marginTop: 8 }}>© {new Date().getFullYear()} Portify · Δωρεάν εκπαιδευτική υπηρεσία</p>
        </div>
      </footer>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageInner />
    </Suspense>
  );
}
