'use client';
import { useState } from 'react';
import BookCard from '@/src/components/BookCard';
import Filters from '@/src/components/Filters';
import { useBookFilters } from '@/src/hooks/useBookFilters';
import allBooks from '@/src/data/books.json';

const LEVELS = [
  {
    key: 'dimotiko',
    label: 'Δημοτικό',
    icon: '🏫',
    grades: 'Α΄ – ΣΤ΄',
    color: '#166534',
    bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    count: allBooks.filter(b => b.level === 'dimotiko').length,
    desc: 'Όλα τα βιβλία για τις 6 τάξεις του Δημοτικού'
  },
  {
    key: 'gymnasio',
    label: 'Γυμνάσιο',
    icon: '🏛',
    grades: 'Α΄ – Γ΄',
    color: '#92400e',
    bg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    count: allBooks.filter(b => b.level === 'gymnasio').length,
    desc: 'Όλα τα βιβλία για τις 3 τάξεις του Γυμνασίου'
  },
  {
    key: 'lykeio',
    label: 'Λύκειο',
    icon: '🎓',
    grades: 'Α΄ – Γ΄',
    color: '#5b21b6',
    bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    count: allBooks.filter(b => b.level === 'lykeio').length,
    desc: 'Όλα τα βιβλία για τις 3 τάξεις του Λυκείου'
  },
];

export default function HomePage() {
  const [activeLevel, setActiveLevel] = useState(null);

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
      submitSearch(inputValue.trim());
      setActiveLevel('search');
    }
  }

  function handleLevelClick(key) {
    setActiveLevel(key);
    setLevel(key);
  }

  function handleBack() {
    setActiveLevel(null);
    clearAll();
  }

  const currentLevel = LEVELS.find(l => l.key === activeLevel);

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">
            <div className="logo-mark">π</div>
            <div>
              <div className="logo-name">Portify <span>Βιβλία</span></div>
              <div className="logo-sub">Ψηφιακή βιβλιοθήκη</div>
            </div>
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-pill">ΔΗΜΟΤΙΚΟ · ΓΥΜΝΑΣΙΟ · ΛΥΚΕΙΟ</div>
          <h1>Όλα τα σχολικά βιβλία<br /><em>σε ένα μέρος</em></h1>
          <p className="hero-sub">Βρες και κατέβασε δωρεάν το σχολικό βιβλίο που χρειάζεσαι — χωρίς περιπλανήσεις</p>

          <form className="search-wrap" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="π.χ. Μαθηματικά Γ΄ Γυμνασίου, Φυσική, Ιστορία..."
            />
            <button type="button" className={`search-clear${inputValue ? ' visible' : ''}`} onClick={() => { clearSearch(); setActiveLevel(null); }}>✕</button>
            <button type="submit" className="search-btn">Αναζήτηση</button>
          </form>

          <div className="hero-stats">
            {[{ n: allBooks.length, l: 'βιβλία' }, { n: '230', l: 'πακέτα' }, { n: '3', l: 'βαθμίδες' }, { n: 'PDF', l: 'δωρεάν' }].map(s => (
              <div className="hero-stat" key={s.l}>
                <div className="n">{s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEVEL CARDS — default view */}
      {!activeLevel && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <p style={{ textAlign: 'center', fontSize: 18, color: '#475569', marginBottom: 40, fontWeight: 500 }}>
            Επέλεξε βαθμίδα για να δεις τα βιβλία
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {LEVELS.map(l => (
              <button
                key={l.key}
                onClick={() => handleLevelClick(l.key)}
                style={{
                  background: l.bg,
                  border: 'none',
                  borderRadius: 20,
                  padding: '40px 32px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>{l.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: l.color, marginBottom: 4 }}>{l.label}</div>
                <div style={{ fontSize: 14, color: l.color, opacity: 0.8, marginBottom: 16, fontWeight: 600 }}>{l.grades}</div>
                <div style={{ fontSize: 14, color: '#475569', marginBottom: 20, lineHeight: 1.5 }}>{l.desc}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: l.color, color: '#fff', borderRadius: 10, padding: '8px 18px', fontSize: 14, fontWeight: 600 }}>
                  {l.count} βιβλία →
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BOOKS VIEW — after level selected or search */}
      {activeLevel && (
        <>
          <div className="level-tabs">
            <div className="level-tabs-inner">
              <button onClick={handleBack} className="ltab" style={{ color: '#94a3b8' }}>
                ← Πίσω
              </button>
              {LEVELS.map(l => (
                <button
                  key={l.key}
                  onClick={() => handleLevelClick(l.key)}
                  className={`ltab${level === l.key ? ' active' : ''}`}
                >
                  {l.icon} {l.label} <span className="cnt">{l.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="page-main">
            <Filters
              grades={grades}
              subjects={subjects}
              activeGrade={grade}
              activeSubject={subject}
              onGrade={toggleGrade}
              onSubject={toggleSubject}
            />
            <div className="content">
              {hasFilters && (
                <div className="chips-bar">
                  <span className="chips-label">Φίλτρα:</span>
                  {grade && <span className="chip">{grades.find(g => g.grade === grade)?.label}<button onClick={() => toggleGrade(grade)}>×</button></span>}
                  {subject && <span className="chip">{subject}<button onClick={() => toggleSubject(subject)}>×</button></span>}
                  {query && <span className="chip">«{query}»<button onClick={() => { clearSearch(); }}>×</button></span>}
                  <button className="clear-all-btn" onClick={clearAll}>Καθαρισμός</button>
                </div>
              )}

              <p className="results-info">
                <strong>{filtered.length}</strong> βιβλία
                {currentLevel && <> · <strong style={{ color: currentLevel.color }}>{currentLevel.label}</strong></>}
                {subject && <> · <strong>{subject}</strong></>}
                {grade && <> · <strong>{grades.find(g => g.grade === grade)?.label}</strong></>}
              </p>

              <div className="books-grid">
                {filtered.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h3>Δεν βρέθηκαν βιβλία</h3>
                    <p>Δοκίμασε διαφορετικά φίλτρα</p>
                    <button className="btn-reset" onClick={handleBack}>Επιστροφή</button>
                  </div>
                ) : (
                  filtered.map(book => <BookCard key={book.id} book={book} />)
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <footer className="footer">
        <p>Τα βιβλία προέρχονται από τη <a href="https://ebooksdl.cti.gr" target="_blank" rel="noopener noreferrer">Ψηφιακή Βιβλιοθήκη Μελίσπη</a> του ΙΤΥΕ Διόφαντος.</p>
      </footer>
    </>
  );
}