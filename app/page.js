'use client';
import { useState } from 'react';
import BookCard from '@/src/components/BookCard';
import Filters from '@/src/components/Filters';
import { useBookFilters } from '@/src/hooks/useBookFilters';
import allBooks from '@/src/data/books.json';

const TABS = [
  { key: 'dimotiko', label: 'Δημοτικό',  icon: '🏫' },
  { key: 'gymnasio', label: 'Γυμνάσιο', icon: '🏛' },
  { key: 'lykeio',   label: 'Λύκειο',   icon: '🎓' },
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
  } = useBookFilters(allBooks, 'dimotiko');

  function handleSearch(e) {
    e.preventDefault();
    if (inputValue.trim()) submitSearch(inputValue.trim());
  }

  return (
    <>
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
          <p className="hero-sub">
            Βρες και κατέβασε δωρεάν το σχολικό βιβλίο που χρειάζεσαι — χωρίς περιπλανήσεις
          </p>

          <form className="search-wrap" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="π.χ. Μαθηματικά Γ΄ Γυμνασίου, Φυσική, Ιστορία..."
            />
            <button
              type="button"
              className={`search-clear${inputValue ? ' visible' : ''}`}
              onClick={clearSearch}
            >✕</button>
            <button type="submit" className="search-btn">Αναζήτηση</button>
          </form>

          <div className="hero-stats">
            {[
              { n: allBooks.length, l: 'βιβλία' },
              { n: '230',           l: 'πακέτα' },
              { n: '3',             l: 'βαθμίδες' },
              { n: 'PDF',           l: 'δωρεάν' },
            ].map(s => (
              <div className="hero-stat" key={s.l}>
                <div className="n">{s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="level-tabs">
        <div className="level-tabs-inner">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setLevel(t.key)}
              className={`ltab${level === t.key ? ' active' : ''}`}
            >
              {t.icon} {t.label}
              <span className="cnt">{byLevel[t.key]}</span>
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
              {grade && (
                <span className="chip">
                  {grades.find(g => g.grade === grade)?.label}
                  <button onClick={() => toggleGrade(grade)}>×</button>
                </span>
              )}
              {subject && (
                <span className="chip">
                  {subject}
                  <button onClick={() => toggleSubject(subject)}>×</button>
                </span>
              )}
              {query && (
                <span className="chip">
                  «{query}»
                  <button onClick={clearSearch}>×</button>
                </span>
              )}
              <button className="clear-all-btn" onClick={clearAll}>Καθαρισμός</button>
            </div>
          )}

          <p className="results-info">
            <strong>{filtered.length}</strong> βιβλία
            {subject && <> · <strong>{subject}</strong></>}
            {grade && <> · <strong>{grades.find(g => g.grade === grade)?.label}</strong></>}
          </p>

          <div className="books-grid">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>Δεν βρέθηκαν βιβλία</h3>
                <p>Δοκίμασε διαφορετικά φίλτρα ή όρους αναζήτησης</p>
                <button className="btn-reset" onClick={clearAll}>Εμφάνισε όλα</button>
              </div>
            ) : (
              filtered.map(book => <BookCard key={book.id} book={book} />)
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>
          Τα βιβλία προέρχονται από τη{' '}
          <a href="https://ebooksdl.cti.gr" target="_blank" rel="noopener noreferrer">
            Ψηφιακή Βιβλιοθήκη Μελίσπη
          </a>{' '}
          του ΙΤΥΕ Διόφαντος. Δωρεάν πρόσβαση για όλους.
        </p>
      </footer>
    </>
  );
}