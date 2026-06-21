'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';

function getSessionId() {
  let id = localStorage.getItem('portify_session');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('portify_session', id);
  }
  return id;
}

export default function StarRating({ bookId }) {
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const sessionId = getSessionId();

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
    if (error || !data || !data.length) {
      setAvgRating(0);
      setTotalRatings(0);
      return;
    }
    const avg = data.reduce((sum, r) => sum + r.stars, 0) / data.length;
    setAvgRating(avg);
    setTotalRatings(data.length);
  }

  async function submitRating(stars) {
    if (loading) return;
    setLoading(true);
    const { error } = await supabase
      .from('ratings')
      .upsert({ book_id: bookId, stars, session_id: sessionId }, { onConflict: 'book_id,session_id' });
    if (!error) {
      localStorage.setItem(`rating_${bookId}`, stars);
      setVoted(true);
      setIsChanging(false);
      setUserRating(stars);
      await fetchRatings();
    }
    setLoading(false);
  }

  async function deleteRating() {
    await supabase.from('ratings').delete().eq('book_id', bookId).eq('session_id', sessionId);
    localStorage.removeItem(`rating_${bookId}`);
    setVoted(false);
    setIsChanging(false);
    setUserRating(0);
    setHovered(0);
    await fetchRatings();
  }

  function handleChange() { setIsChanging(true); setVoted(false); }
  function handleCancel() { setIsChanging(false); setVoted(true); setUserRating(parseInt(localStorage.getItem(`rating_${bookId}`) || '0')); }

  const displayRating = hovered || userRating || avgRating;

  return (
    <div style={{ padding: '8px 12px 6px', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <p style={{ fontSize: 10, color: 'var(--text-3)' }}>
          {voted ? 'Η αξιολόγησή σου:' : isChanging ? 'Νέα αξιολόγηση:' : 'Αξιολόγησε:'}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {voted && !isChanging && (
            <>
              <button onClick={handleChange} style={{ fontSize: 10, color: '#1a4fa8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Αλλαγή</button>
              <button onClick={deleteRating} style={{ fontSize: 10, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Διαγραφή</button>
            </>
          )}
          {isChanging && (
            <button onClick={handleCancel} style={{ fontSize: 10, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Ακύρωση</button>
          )}
        </div>
      </div>
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