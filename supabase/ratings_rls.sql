-- Portify · Supabase RLS for `ratings` table
-- Run once in SQL editor. Idempotent.

-- 1. Ensure table exists (skip if you already have it)
CREATE TABLE IF NOT EXISTS public.ratings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id     text NOT NULL,
  stars       smallint NOT NULL CHECK (stars BETWEEN 1 AND 5),
  session_id  text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (book_id, session_id)
);

CREATE INDEX IF NOT EXISTS ratings_book_id_idx ON public.ratings (book_id);

-- 2. Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- 3. Policies — anon can read aggregates, insert/update only OWN session row
DROP POLICY IF EXISTS "ratings_select_all"   ON public.ratings;
DROP POLICY IF EXISTS "ratings_insert_self"  ON public.ratings;
DROP POLICY IF EXISTS "ratings_update_self"  ON public.ratings;
DROP POLICY IF EXISTS "ratings_delete_self"  ON public.ratings;

CREATE POLICY "ratings_select_all" ON public.ratings
  FOR SELECT USING (true);

-- Require x-session-id header to match the inserted session_id
-- Front-end already sends session_id in the row; this prevents
-- spamming arbitrary session_ids by attaching a header check.
CREATE POLICY "ratings_insert_self" ON public.ratings
  FOR INSERT WITH CHECK (
    session_id = current_setting('request.headers', true)::json ->> 'x-session-id'
  );

CREATE POLICY "ratings_update_self" ON public.ratings
  FOR UPDATE USING (
    session_id = current_setting('request.headers', true)::json ->> 'x-session-id'
  );

CREATE POLICY "ratings_delete_self" ON public.ratings
  FOR DELETE USING (
    session_id = current_setting('request.headers', true)::json ->> 'x-session-id'
  );

-- 4. Optional: throttle inserts per session (max 200 ratings/session)
CREATE OR REPLACE FUNCTION public.ratings_session_cap()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT count(*) FROM public.ratings WHERE session_id = NEW.session_id) > 200 THEN
    RAISE EXCEPTION 'Rating cap reached for this session';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS ratings_session_cap_trg ON public.ratings;
CREATE TRIGGER ratings_session_cap_trg
  BEFORE INSERT ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.ratings_session_cap();

-- 5. NOTE for frontend
-- Send the session id as header on every supabase client call:
-- supabase.headers = { 'x-session-id': sessionId }
-- See src/lib/supabase.js patch.
