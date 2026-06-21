'use client';
import { useState, useEffect, useRef } from 'react';
import BookCard from '@/src/components/BookCard';
import Filters from '@/src/components/Filters';
import { useBookFilters } from '@/src/hooks/useBookFilters';
import allBooks from '@/src/data/books.json';

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

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const count = useCounter(allBooks.length);

  const {
    level, grade, subject, query,
    inputValue, setInputValue,
    setLevel, toggleGrade, toggleSubject,
    submitSearch, clearSearch, clearAll,
    filtered, grades, subjects, hasFilters,
  } = useBookFilters(allBooks, null);

  function handleSearch(e) {
    e.preventDefault();
    if (inputValue.trim()) {
      setLoading(true);
      setTimeout(() => { submitSearch(inputValue.trim()); setLoading(false); }, 300);
    }
  }

  function handleLevelClick(key) {
    setLoading(true);
    setTimeout(() => { setLevel(key); setLoading(false); }, 300);
  }

  const currentLevel = LEVELS.find(l => l.key === level);
  const activeFiltersCount = (grade ? 1 : 0) + (subject ? 1 : 0);

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
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-pill">ΔΗΜΟΤΙΚΟ · ΓΥΜΝΑΣΙΟ · ΛΥΚΕΙΟ</div>
          <h1>Όλα τα σχολικά βιβλία<br /><em>σε ένα μέρος</em></h1>
          <p className="hero-sub">Βρες το σχολικό βιβλίο που χρειάζεσαι — χωρίς περιπλανήσεις</p>
          <form className="search-wrap" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="π.χ. Μαθηματικά Γ΄ Γυμνασίου, Φυσική, Ιστορία..." />
            <button type="button" className={`search-clear${inputValue ? ' visible' : ''}`} onClick={clearSearch}>✕</button>
            <button type="submit" className="search-btn">Αναζήτηση</button>
          </form>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="n">{count}</div>
              <div className="l">βιβλία</div>
            </div>
            <div className="hero-stat">
              <div className="n">Α&prime; Δημοτικού</div>
              <div className="l">έως Γ&prime; Λυκείου</div>
            </div>
          </div>
        </div>
      </section>

      {/* LANDING */}
      {!level && !query && (
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

      {/* BOOKS VIEW */}
      {(level || query) && (
        <>
          <div className="level-tabs">
            <div className="level-tabs-inner">
              <button onClick={clearAll} className="ltab" style={{ color: 'var(--text-3)' }}>← Πίσω</button>
              {LEVELS.map(l => (
                <button key={l.key} onClick={() => handleLevelClick(l.key)} className={`ltab${level === l.key ? ' active' : ''}`}>
                  {l.icon} {l.label} <span className="cnt">{byLevel[l.key]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="page-main">
            <Filters grades={grades} subjects={subjects} activeGrade={grade} activeSubject={subject} onGrade={toggleGrade} onSubject={toggleSubject} />
            <div className="content">
              {hasFilters && (
                <div className="chips-bar">
                  <span className="chips-label">Φίλτρα:</span>
                  {grade && <span className="chip">{grades.find(g => g.grade === grade)?.label}<button onClick={() => toggleGrade(grade)}>×</button></span>}
                  {subject && <span className="chip">{subject}<button onClick={() => toggleSubject(subject)}>×</button></span>}
                  {query && <span className="chip">«{query}»<button onClick={clearSearch}>×</button></span>}
                  <button className="clear-all-btn" onClick={clearAll}>Καθαρισμός</button>
                </div>
              )}
              <p className="results-info">
                <strong>{filtered.length}</strong> βιβλία
                {currentLevel && <> · <strong style={{ color: currentLevel.color }}>{currentLevel.label}</strong></>}
                {subject && <> · <strong>{subject}</strong></>}
                {grade && <> · <strong>{grades.find(g => g.grade === grade)?.label}</strong></>}
              </p>
              {loading ? <SkeletonGrid /> : (
                <div className="books-grid">
                  {filtered.length === 0 ? (
                    <div className="empty-state"><div className="empty-icon">📚</div><h3>Δεν βρέθηκαν βιβλία</h3><p>Δοκίμασε διαφορετικά φίλτρα</p><button className="btn-reset" onClick={clearAll}>Επιστροφή</button></div>
                  ) : (
                    filtered.map((book, i) => <BookCard key={`${book.id}-${i}`} book={book} />)
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
                        <span>{g.label}</span>
                        <span className="bs-count">{g.count}</span>
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
                        <span>{s.subject}</span>
                        <span className="bs-count">{s.count}</span>
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

      <footer className="footer">
        <p>Τα βιβλία προέρχονται από τη <a href="https://ebooksdl.cti.gr" target="_blank" rel="noopener noreferrer">Ψηφιακή Βιβλιοθήκη Μελίσπη</a> του ΙΤΥΕ Διόφαντος.</p>
      </footer>
    </>
  );
}