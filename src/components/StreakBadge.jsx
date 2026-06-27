'use client';
import { useEffect, useState } from 'react';
import { getStreak } from '@/src/lib/readingHistory';

export default function StreakBadge() {
  const [streak, setStreak] = useState({ current: 0, best: 0 });

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  if (streak.current < 2) return null;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      🔥 {streak.current} μέρες στη σειρά!
      {streak.best > streak.current && <span style={{ color: '#9a3412', opacity: 0.7 }}>(best: {streak.best})</span>}
    </div>
  );
}
