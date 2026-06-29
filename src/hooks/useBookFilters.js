'use client';
import { useState, useMemo, useEffect, useDeferredValue } from 'react';
import { filterBooks } from '@/src/lib/search';

export function useBookFilters(allBooks, initialLevel = null) {
  const [level, setLevelRaw]     = useState(initialLevel);
  const [grade, setGradeRaw]     = useState(null);
  const [subject, setSubjectRaw] = useState(null);
  const [query, setQueryRaw]     = useState('');
  const [inputValue, setInputValue] = useState('');

  // Live search — debounced 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryRaw(inputValue.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

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
    const src = allBooks.filter(b => !level || b.level === level);
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

  // Show live results dropdown when typing without level selected.
  // Use a deferred value so the heavy filterBooks call is computed at a lower
  // priority and never blocks keystrokes (fixes typing lag) while keeping the
  // dropdown instant-feeling.
  const deferredInput = useDeferredValue(inputValue);
  const showLiveResults = deferredInput.trim().length > 1 && !level;
  const liveResults = useMemo(() => {
    if (!showLiveResults) return [];
    return filterBooks(allBooks, { level: null, grade: null, subject: null, query: deferredInput.trim() }).slice(0, 6);
  }, [allBooks, deferredInput, showLiveResults]);

  return {
    level, grade, subject, query, inputValue, setInputValue,
    setLevel, toggleGrade, toggleSubject,
    submitSearch, clearSearch, clearAll,
    filtered, grades, subjects, hasFilters,
    liveResults, showLiveResults,
  };
}