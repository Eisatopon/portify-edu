'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';

export default function StarRating({ bookId }) {
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`rating_${bookId}`);
    if (saved) { setVoted(true); setUserRating(parseInt(saved)); }
    fetchRatings();
  }, [bookId]);

  async function fetchRatings() {
    const { data, error } = await supabase
      .from('ratings')
      .select('stars')
      .eq('book_id', bookId);
    if (error || !data.length) return;
    const avg = data.reduce((sum, r) => sum + r.stars, 0) / data.length;
    setAvgRating(avg);
    setTotalRatings(data.length);
  }

  async function submitRating(stars) {
    if (voted || loading) return;
    setLoading(true);
    const { error } = await supabase.from('ratings').insert({ book_id: bookId, stars });
    if (!error) {
      localStorage.setItem(`rating_${bookId}`, stars);
      setVoted(true);
      setUserRating(stars);
      await fetchRatings();
    }
    setLoading(false);
  }

  const displayRating = hovered || userRating || avgRating;

  return (
    <div style={{ padding: '8px 12px 6px', borderTop: '1px solid var(--border)' }}>
      {!voted && (
        <p style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4 }}>Αξιολόγησε:</p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button key={star} onClick={() => submitRating(star)}
            onMouseEnter={() => !voted && setHovered(star)}
            onMouseLeave={() => !voted && setHovered(0)}
            disabled={voted || loading}
            style={{ background: 'none', border: 'none', cursor: voted ? 'default' : 'pointer', padding: '1px', fontSize: 20, lineHeight: 1, color: star <= displayRating ? '#f59e0b' : '#d1d5db', transition: 'color 0.1s, transform 0.15s', transform: !voted && hovered >= star ? 'scale(1.25)' : 'scale(1)' }}>
            ★
          </button>
        ))}
        <span style={{ fontSize: 11, marginLeft: 6 }}>
          {voted
            ? <span style={{ color: '#16a34a', fontWeight: 600 }}>✓ {avgRating.toFixed(1)} ({totalRatings})</span>
            : totalRatings > 0 ? <span style={{ color: 'var(--text-3)' }}>{avgRating.toFixed(1)} ({totalRatings})</span> : null
          }
        </span>
      </div>
    </div>
  );
}