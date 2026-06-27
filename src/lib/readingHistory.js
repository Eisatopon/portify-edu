// localStorage helpers για reading streak + visit tracking
const KEY_HISTORY = 'portify_reading_history_v1';
const KEY_STREAK = 'portify_streak_v1';

function safe(fn, fallback) { try { return fn(); } catch { return fallback; } }

export function recordVisit(bookId) {
  if (typeof window === 'undefined' || !bookId) return null;
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  // Visit count per book
  const history = safe(() => JSON.parse(localStorage.getItem(KEY_HISTORY) || '{}'), {});
  const prev = history[bookId] || { count: 0, firstAt: now, lastAt: now };
  prev.count = (prev.count || 0) + 1;
  prev.lastAt = now;
  history[bookId] = prev;
  safe(() => localStorage.setItem(KEY_HISTORY, JSON.stringify(history)));

  // Reading streak: consecutive days
  const streak = safe(() => JSON.parse(localStorage.getItem(KEY_STREAK) || '{}'), {});
  if (streak.lastDay === today) {
    // already counted today
  } else {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    streak.current = (streak.lastDay === yesterday) ? (streak.current || 0) + 1 : 1;
    streak.lastDay = today;
    streak.best = Math.max(streak.best || 0, streak.current);
    safe(() => localStorage.setItem(KEY_STREAK, JSON.stringify(streak)));
  }

  return { visits: prev.count, streak: streak.current || 1, best: streak.best || 1 };
}

export function getBookStats(bookId) {
  if (typeof window === 'undefined' || !bookId) return null;
  const history = safe(() => JSON.parse(localStorage.getItem(KEY_HISTORY) || '{}'), {});
  return history[bookId] || null;
}

export function getStreak() {
  if (typeof window === 'undefined') return { current: 0, best: 0 };
  const s = safe(() => JSON.parse(localStorage.getItem(KEY_STREAK) || '{}'), {});
  // Check if streak still valid (last visit was today or yesterday)
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (s.lastDay !== today && s.lastDay !== yesterday) {
    return { current: 0, best: s.best || 0 };
  }
  return { current: s.current || 0, best: s.best || 0 };
}

export function timeAgoGreek(timestamp) {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  if (sec < 60) return 'μόλις τώρα';
  if (min < 60) return `πριν ${min} λεπτ${min === 1 ? 'ό' : 'ά'}`;
  if (hour < 24) return `πριν ${hour} ώρ${hour === 1 ? 'α' : 'ες'}`;
  if (day < 7) return `πριν ${day} μέρ${day === 1 ? 'α' : 'ες'}`;
  return new Date(timestamp).toLocaleDateString('el-GR');
}
