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
    <div style={{ padding: '8px 12px 4px', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => submitRating(star)}
            onMouseEnter={() => !voted && setHovered(star)}
            onMouseLeave={() => !voted && setHovered(0)}
            disabled={voted || loading}
            style={{
              background: 'none', border: 'none', cursor: voted ? 'default' : 'pointer',
              padding: '2px', fontSize: 16, lineHeight: 1,
              color: star <= displayRating ? '#f59e0b' : '#d1d5db',
              transition: 'color 0.1s, transform 0.1s',
              transform: !voted && hovered >= star ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            ★
          </button>
        ))}
        <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 4 }}>
          {totalRatings > 0 ? `${avgRating.toFixed(1)} (${totalRatings})` : 'Αξιολόγησε'}
        </span>
      </div>
      {voted && (
        <p style={{ fontSize: 10, color: '#16a34a', marginTop: 2 }}>✓ Ευχαριστούμε!</p>
      )}
    </div>
  );
}