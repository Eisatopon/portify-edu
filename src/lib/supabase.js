'use client';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSessionId() {
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem('portify_session');
  if (!id) {
    id = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36));
    localStorage.setItem('portify_session', id);
  }
  return id;
}

// Singleton client with session id header — required by RLS policy
let _client = null;
export function getSupabase() {
  if (_client) return _client;
  if (!supabaseUrl || !supabaseKey) return null;
  _client = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { 'x-session-id': getSessionId() } },
    auth: { persistSession: false },
  });
  return _client;
}

// Backwards compat
export const supabase = typeof window !== 'undefined' ? getSupabase() : null;
export { getSessionId };
