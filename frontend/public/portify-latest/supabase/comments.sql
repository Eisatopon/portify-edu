-- Portify · Supabase table + RLS for book `comments`
-- Χωρίς εγγραφή χρήστη, χωρίς διαφημίσεις. Τρέξε μία φορά στο SQL editor. Idempotent.

-- 1. Table
CREATE TABLE IF NOT EXISTS public.comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id     text NOT NULL,
  nickname    text,
  body        text NOT NULL,
  session_id  text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT comments_body_len     CHECK (char_length(body) BETWEEN 1 AND 2000),
  CONSTRAINT comments_nickname_len CHECK (nickname IS NULL OR char_length(nickname) <= 40)
);

CREATE INDEX IF NOT EXISTS comments_book_id_created_idx
  ON public.comments (book_id, created_at DESC);

-- 2. Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 3. Policies
DROP POLICY IF EXISTS "comments_select_all"  ON public.comments;
DROP POLICY IF EXISTS "comments_insert_self" ON public.comments;

-- Όλοι μπορούν να διαβάζουν σχόλια
CREATE POLICY "comments_select_all" ON public.comments
  FOR SELECT USING (true);

-- Insert μόνο αν το session_id ταιριάζει με το x-session-id header
-- (μπλοκάρει bulk spam με τυχαία session ids)
CREATE POLICY "comments_insert_self" ON public.comments
  FOR INSERT WITH CHECK (
    session_id = current_setting('request.headers', true)::json ->> 'x-session-id'
  );

-- (Καμία πολιτική UPDATE/DELETE για anon: τα σχόλια είναι αμετάβλητα.
--  Η διαχείριση/διαγραφή γίνεται από εσένα μέσω Supabase dashboard.)

-- 4. Anti-spam: max 3 σχόλια ανά session μέσα σε 60 δευτερόλεπτα
CREATE OR REPLACE FUNCTION public.comments_rate_limit()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (
    SELECT count(*) FROM public.comments
    WHERE session_id = NEW.session_id
      AND created_at > now() - interval '60 seconds'
  ) >= 3 THEN
    RAISE EXCEPTION 'Πολλά σχόλια σε σύντομο διάστημα. Δοκίμασε ξανά σε λίγο.';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS comments_rate_limit_trg ON public.comments;
CREATE TRIGGER comments_rate_limit_trg
  BEFORE INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.comments_rate_limit();

-- 5. ΣΗΜΕΙΩΣΗ: το frontend στέλνει ήδη το x-session-id header
--    (βλ. src/lib/supabase.js — getSupabase()).
