'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setMounted(true);
    const stored = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(stored);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.add('theme-transition');
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('portify_theme', next); } catch {}
    setTheme(next);
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 320);
  }

  if (!mounted) return <button className="theme-toggle" aria-hidden="true" tabIndex={-1} />;

  return (
    <button onClick={toggle} className="theme-toggle"
      aria-label={theme === 'dark' ? 'Εναλλαγή σε φωτεινό θέμα' : 'Εναλλαγή σε σκούρο θέμα'}
      title={theme === 'dark' ? 'Φωτεινό θέμα' : 'Σκούρο θέμα'}>
      <span className="icon sun" aria-hidden="true">☀️</span>
      <span className="icon moon" aria-hidden="true">🌙</span>
    </button>
  );
}
