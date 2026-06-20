'use client';
import BookCard from '@/src/components/BookCard';
import Filters from '@/src/components/Filters';
import { useBookFilters } from '@/src/hooks/useBookFilters';
import allBooks from '@/src/data/books.json';

const LEVELS = [
  { key: 'dimotiko', label: 'Δημοτικό', icon: '🏫', grades: 'Α΄ – ΣΤ΄', color: '#166534', btnColor: '#16a34a', desc: 'Γλώσσα, Μαθηματικά, Ιστορία και άλλα για τις 6 τάξεις' },
  { key: 'gymnasio', label: 'Γυμνάσιο', icon: '🏛', grades: 'Α΄ – Γ΄', color: '#92400e', btnColor: '#d97706', desc: 'Φυσική, Χημεία, Αρχαία και άλλα για τις 3 τάξεις' },
  { key: 'lykeio',   label: 'Λύκειο',   icon: '🎓', grades: 'Α΄ – Γ΄', color: '#5b21b6', btnColor: '#7c3aed', desc: 'Άλγεβρα, Βιολογία, Χημεία και άλλα για τις 3 τάξεις' },
];

const byLevel = { dimotiko: 0, gymnasio: 0, lykeio: 0 };
allBooks.forEach(b => { if (byLevel[b.level] !== undefined) byLevel[b.level]++; });

export default function HomePage() {
  const {
    level, grade, subject, query,
    inputValue, setInputValue,
    setLevel, toggleGrade, toggleSubject,
    submitSearch, clearSearch, clearAll,
    filtered, grades, subjects, hasFilters,
  } = useBookFilters(allBooks, null);

  function handleSearch(e) {
    e.preventDefault();
    if (inputValue.trim()) submitSearch(inputValue.trim());
  }

  const currentLevel = LEVELS.find(l => l.key === level);

return (
  <>
    <div style={{position:'fixed',top:0,right:0,background:'red',color:'white',padding:10,zIndex:9999,fontSize:12}}>
      level:{level} grade:{String(grade)} subject:{subject} filtered:{filtered.length}
    </div>
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

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-pill">ΔΗΜΟΤΙΚΟ · ΓΥΜΝΑΣΙΟ · ΛΥΚΕΙΟ</div>
          <h1>Όλα τα σχολικά βιβλία<br /><em>σε ένα μέρος</em></h1>
          <p className="hero-sub">Βρες και κατέβασε δωρεάν το σχολικό βιβλίο που χρειάζεσαι — χωρίς περιπλανήσεις</p>
          <form className="search-wrap" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="π.χ. Μαθηματικά Γ΄ Γυμνασίου, Φυσική, Ιστορία..." />
            <button type="button" className={`search-clear${inputValue ? ' visible' : ''}`} onClick={clearSearch}>✕</button>
            <button type="submit" className="search-btn">Αναζήτηση</button>
          </form>
          <div className="hero-stats">
            {[{ n: allBooks.length, l: 'βιβλία' }, { n: '230', l: 'πακέτα' }, { n: '3', l: 'βαθμίδες' }, { n: 'PDF', l: 'δωρεάν' }].map(s => (
              <div className="hero-stat" key={s.l}><div className="n">{s.n}</div><div className="l">{s.l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* LANDING — χωρίς επιλογή */}
      {!level && !query && (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 20px' }}>
          <p style={{ textAlign: 'center', fontSize: 16, color: 'var(--color-text-secondary)', marginBottom: 36 }}>
            Επέλεξε βαθμίδα για να δεις τα βιβλία
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {LEVELS.map(l => (
              <button key={l.key} onClick={() => setLevel(l.key)}
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderTop: `3px solid ${l.btnColor}`, borderRadius: 16, padding: '28px 24px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{l.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: l.color, marginBottom: 4 }}>{l.label}</div>
                <div style={{ fontSize: 12, color: l.btnColor, fontWeight: 600, marginBottom: 10 }}>{l.grades} Τάξη · {byLevel[l.key]} βιβλία</div>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18, lineHeight: 1.5 }}>{l.desc}</p>
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
              <button onClick={clearAll} className="ltab" style={{ color: 'var(--color-text-tertiary)' }}>← Πίσω</button>
              {LEVELS.map(l => (
                <button key={l.key} onClick={() => setLevel(l.key)} className={`ltab${level === l.key ? ' active' : ''}`}>
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
              <div className="books-grid">
                {filtered.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon">📚</div><h3>Δεν βρέθηκαν βιβλία</h3><p>Δοκίμασε διαφορετικά φίλτρα</p><button className="btn-reset" onClick={clearAll}>Επιστροφή</button></div>
                ) : (
                  filtered.map((book, i) => <BookCard key={`${book.id}-${i}`} book={book} />)
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