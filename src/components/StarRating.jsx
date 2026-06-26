'use client';
import { useState, useEffect } from 'react';
import { getSupabase, getSessionId } from '@/src/lib/supabase';

export default function StarRating({ bookId }) {
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`rating_${bookId}`);
      if (saved) { setVoted(true); setUserRating(parseInt(saved, 10)); }
    } catch {}
    fetchRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  async function fetchRatings() {
    const sb = getSupabase();
    if (!sb) return;
    const { data, error } = await sb.from('ratings').select('stars').eq('book_id', bookId);
    if (error || !data?.length) { setAvgRating(0); setTotalRatings(0); return; }
    const avg = data.reduce((s, r) => s + r.stars, 0) / data.length;
    setAvgRating(avg);
    setTotalRatings(data.length);
  }

  async function submitRating(stars) {
    if (loading) return;
    const sb = getSupabase();
    if (!sb) return;
    setLoading(true);
    const { error } = await sb
      .from('ratings')
      .upsert(
        { book_id: bookId, stars, session_id: getSessionId() },
        { onConflict: 'book_id,session_id' }
      );
    if (!error) {
      try { localStorage.setItem(`rating_${bookId}`, String(stars)); } catch {}
      setVoted(true);
      setIsChanging(false);
      setUserRating(stars);
      await fetchRatings();
    }
    setLoading(false);
  }

  async function deleteRating() {
    const sb = getSupabase();
    if (!sb) return;
    await sb.from('ratings').delete().eq('book_id', bookId).eq('session_id', getSessionId());
    try { localStorage.removeItem(`rating_${bookId}`); } catch {}
    setVoted(false); setIsChanging(false); setUserRating(0); setHovered(0);
    await fetchRatings();
  }

  function handleChange() { setIsChanging(true); setVoted(false); }
  function handleCancel() {
    setIsChanging(false); setVoted(true);
    try { setUserRating(parseInt(localStorage.getItem(`rating_${bookId}`) || '0', 10)); } catch {}
  }

  const displayRating = hovered || userRating || avgRating;

  return (
    <div style={{ padding: '8px 12px 6px', borderTop: '1px solid var(--border)' }}>
      <p style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4 }}>
        {voted ? 'Η αξιολόγησή σου:' : isChanging ? 'Νέα αξιολόγηση:' : 'Αξιολόγησε:'}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }} role="radiogroup" aria-label="Αξιολόγηση βιβλίου σε 5 αστέρια">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={userRating === star}
            aria-label={`${star} αστέρι${star > 1 ? 'α' : ''}`}
            onClick={() => submitRating(star)}
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
      {voted && !isChanging && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button onClick={handleChange} style={{ fontSize: 10, color: '#1a4fa8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Αλλαγή</button>
          <button onClick={deleteRating} style={{ fontSize: 10, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Διαγραφή</button>
        </div>
      )}
      {isChanging && (
        <div style={{ marginTop: 4 }}>
          <button onClick={handleCancel} style={{ fontSize: 10, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Ακύρωση</button>
        </div>
      )}
    </div>
  );
}
