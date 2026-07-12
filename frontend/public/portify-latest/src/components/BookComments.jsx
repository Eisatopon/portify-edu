'use client';
import { useState, useEffect, useCallback } from 'react';
import { getSupabase, getSessionId } from '@/src/lib/supabase';

const MAX_BODY = 2000;
const MAX_NAME = 40;
const MIN_INTERVAL_MS = 20000; // 20s ανάμεσα σε σχόλια (client-side)

function timeAgo(iso) {
  const then = new Date(iso).getTime();
  if (!then) return '';
  const diff = Math.max(0, Date.now() - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'μόλις τώρα';
  if (m < 60) return `πριν ${m} λεπτ${m === 1 ? 'ό' : 'ά'}`;
  const h = Math.floor(m / 60);
  if (h < 24) return `πριν ${h} ώρ${h === 1 ? 'α' : 'ες'}`;
  const d = Math.floor(h / 24);
  if (d < 30) return `πριν ${d} μέρ${d === 1 ? 'α' : 'ες'}`;
  return new Date(iso).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BookComments({ bookId }) {
  const [comments, setComments] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [nickname, setNickname] = useState('');
  const [body, setBody] = useState('');
  const [hp, setHp] = useState(''); // honeypot
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const fetchComments = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) { setLoaded(true); return; }
    const { data, error: err } = await sb
      .from('comments')
      .select('id, nickname, body, created_at')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false })
      .limit(200);
    if (!err && data) setComments(data);
    setLoaded(true);
  }, [bookId]);

  useEffect(() => {
    try { const n = localStorage.getItem('portify_comment_name'); if (n) setNickname(n); } catch {}
    fetchComments();
  }, [fetchComments]);

  async function submit(e) {
    e.preventDefault();
    setError(''); setOk(false);
    const text = body.trim();
    if (hp) { setOk(true); setBody(''); return; } // honeypot: σιωπηλή απόρριψη bot
    if (text.length < 2) { setError('Γράψε λίγο περισσότερο 🙂'); return; }
    if (text.length > MAX_BODY) { setError(`Πολύ μεγάλο σχόλιο (μέγιστο ${MAX_BODY} χαρακτήρες).`); return; }
    try {
      const last = parseInt(localStorage.getItem('portify_comment_last') || '0', 10);
      if (Date.now() - last < MIN_INTERVAL_MS) { setError('Περίμενε λίγο πριν στείλεις νέο σχόλιο.'); return; }
    } catch {}

    const sb = getSupabase();
    if (!sb) { setError('Τα σχόλια δεν είναι διαθέσιμα αυτή τη στιγμή.'); return; }

    setSending(true);
    const name = (nickname || '').trim().slice(0, MAX_NAME);
    const { error: err } = await sb.from('comments').insert({
      book_id: bookId,
      nickname: name || null,
      body: text,
      session_id: getSessionId(),
    });
    setSending(false);
    if (err) { setError('Κάτι πήγε στραβά. Δοκίμασε ξανά σε λίγο.'); return; }

    try {
      localStorage.setItem('portify_comment_last', String(Date.now()));
      if (name) localStorage.setItem('portify_comment_name', name);
    } catch {}
    setBody(''); setOk(true);
    fetchComments();
  }

  return (
    <section data-testid="book-comments" style={{ margin: '28px 0 8px', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
        💬 Σχόλια{loaded && comments.length > 0 ? ` (${comments.length})` : ''}
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>
        Πες τη γνώμη σου για αυτό το βιβλίο — <strong>χωρίς εγγραφή</strong>. Το όνομα είναι προαιρετικό.
      </p>

      <form onSubmit={submit} data-testid="comment-form" style={{ marginBottom: 22 }}>
        <input
          data-testid="comment-nickname"
          type="text" value={nickname} maxLength={MAX_NAME}
          onChange={e => setNickname(e.target.value)}
          placeholder="Το όνομά σου (προαιρετικό)"
          aria-label="Όνομα ή ψευδώνυμο (προαιρετικό)"
          style={{ width: '100%', maxWidth: 320, padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, marginBottom: 8, background: 'var(--white)', color: 'var(--text)' }}
        />
        {/* honeypot — κρυφό από ανθρώπους, το γεμίζουν μόνο bots */}
        <input
          tabIndex={-1} autoComplete="off" name="website" aria-hidden="true"
          value={hp} onChange={e => setHp(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />
        <textarea
          data-testid="comment-body"
          value={body} maxLength={MAX_BODY} rows={3}
          onChange={e => setBody(e.target.value)}
          placeholder="Γράψε το σχόλιό σου…"
          aria-label="Το σχόλιό σου"
          style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, resize: 'vertical', background: 'var(--white)', color: 'var(--text)', fontFamily: 'inherit' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{body.length}/{MAX_BODY}</span>
          <button
            data-testid="comment-submit" type="submit"
            disabled={sending || body.trim().length < 2}
            style={{ background: 'var(--blue)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: (sending || body.trim().length < 2) ? 'default' : 'pointer', opacity: (sending || body.trim().length < 2) ? 0.6 : 1 }}>
            {sending ? 'Αποστολή…' : 'Δημοσίευση σχολίου'}
          </button>
        </div>
        {error && <p data-testid="comment-error" style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</p>}
        {ok && <p data-testid="comment-success" style={{ color: '#16a34a', fontSize: 13, marginTop: 8 }}>✓ Το σχόλιό σου δημοσιεύτηκε!</p>}
      </form>

      {!loaded ? (
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Φόρτωση σχολίων…</p>
      ) : comments.length === 0 ? (
        <p data-testid="comment-empty" style={{ fontSize: 14, color: 'var(--text-3)' }}>Δεν υπάρχουν σχόλια ακόμη. Γίνε ο πρώτος! 🎉</p>
      ) : (
        <ul data-testid="comment-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {comments.map(c => (
            <li key={c.id} data-testid="comment-item" style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--blue-light)', color: 'var(--blue)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {(c.nickname || 'Α').trim().charAt(0).toUpperCase()}
                </span>
                <strong style={{ fontSize: 13, color: 'var(--text)' }}>{c.nickname || 'Ανώνυμος'}</strong>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>· {timeAgo(c.created_at)}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
