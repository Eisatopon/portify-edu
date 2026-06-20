'use client';
import { useState, useMemo } from 'react';
import { filterBooks } from '@/src/lib/search';

export function useBookFilters(allBooks, initialLevel = 'dimotiko') {
  const [level, setLevelRaw]     = useState(initialLevel);
  const [grade, setGradeRaw]     = useState(null);
  const [subject, setSubjectRaw] = useState(null);
  const [query, setQueryRaw]     = useState('');
  const [inputValue, setInputValue] = useState('');

  function setLevel(l) {
    setLevelRaw(l);
    setGradeRaw(null);
    setSubjectRaw(null);
    setQueryRaw('');
    setInputValue('');
  }

  function toggleGrade(g) {
    setGradeRaw(prev => prev === g ? null : g);
    setSubjectRaw(null);
  }

  function toggleSubject(s) {
    setSubjectRaw(prev => prev === s ? null : s);
  }

  function submitSearch(val) {
    setQueryRaw(val);
    setLevelRaw(null);
    setGradeRaw(null);
    setSubjectRaw(null);
  }

  function clearSearch() {
    setQueryRaw('');
    setInputValue('');
  }

  function clearAll() {
    setLevelRaw(initialLevel);
    setGradeRaw(null);
    setSubjectRaw(null);
    setQueryRaw('');
    setInputValue('');
  }

  const filtered = useMemo(
    () => filterBooks(allBooks, { level, grade, subject, query }),
    [allBooks, level, grade, subject, query]
  );

  const grades = useMemo(() => {
    const src = level ? allBooks.filter(b => b.level === level) : allBooks;
    const map = {};
    src.forEach(b => {
      map[b.grade] = map[b.grade] || { grade: b.grade, label: b.gradeLabel, count: 0 };
      map[b.grade].count++;
    });
    return Object.values(map).sort((a, b) => a.grade - b.grade);
  }, [allBooks, level]);

  const subjects = useMemo(() => {
    const src = allBooks.filter(b =>
      (!level || b.level === level) && (!grade || b.grade === grade)
    );
    const map = {};
    src.forEach(b => { map[b.subject] = (map[b.subject] || 0) + 1; });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([s, c]) => ({ subject: s, count: c }));
  }, [allBooks, level, grade]);

  const hasFilters = !!(grade || subject || query);

  return {
    level, grade, subject, query, inputValue, setInputValue,
    setLevel, toggleGrade, toggleSubject,
    submitSearch, clearSearch, clearAll,
    filtered, grades, subjects, hasFilters,
  };
}