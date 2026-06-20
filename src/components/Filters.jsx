'use client';

export default function Filters({ grades, subjects, activeGrade, activeSubject, onGrade, onSubject }) {
  return (
    <aside className="sidebar">
      {grades.length > 0 && (
        <div className="filter-card">
          <p className="filter-label">Τάξη</p>
          {grades.map(g => (
            <button
              key={g.grade}
              onClick={() => onGrade(g.grade)}
              className={`filter-btn${activeGrade === g.grade ? ' active' : ''}`}
            >
              <span>{g.label}</span>
              <span className="filter-count">{g.count}</span>
            </button>
          ))}
        </div>
      )}
      {subjects.length > 0 && (
        <div className="filter-card">
          <p className="filter-label">Μάθημα</p>
          {subjects.map(s => (
            <button
              key={s.subject}
              onClick={() => onSubject(s.subject)}
              className={`filter-btn${activeSubject === s.subject ? ' active' : ''}`}
            >
              <span>{s.subject}</span>
              <span className="filter-count">{s.count}</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}