# Portify — Σχόλια κάτω από κάθε βιβλίο (χωρίς εγγραφή, χωρίς διαφημίσεις)

Custom σύστημα σχολίων στη δική σου **Supabase** βάση. Ίδιο ασφαλές μοτίβο με το υπάρχον `StarRating`
(session-id + RLS). Χωρίς τρίτους, χωρίς διαφημίσεις, χωρίς login. Όνομα προαιρετικό. Honeypot + rate-limit anti-spam.

## 📂 Αρχεία (3 αλλαγές)
| Αρχείο | Τύπος |
|---|---|
| `supabase/comments.sql` | **NEW** — πίνακας `comments` + RLS + anti-spam trigger |
| `src/components/BookComments.jsx` | **NEW** — το component σχολίων |
| `app/book/[slug]/BookViewerClient.js` | **MODIFIED** — 2 γραμμές (import + render) |

Το `BookViewerClient.js` άλλαξε μόνο σε 2 σημεία:
```js
// 1) κοντά στα imports:
import BookComments from '@/src/components/BookComments';

// 2) στο τέλος, μετά το <SimilarBooks .../>:
<BookComments bookId={book.id} />
```
> ⚠️ Αγνόησε τυχόν αλλαγές στο `package-lock.json` (προέκυψαν από το τοπικό build μου).

## 🚀 Βήματα εγκατάστασης
1. **Supabase → SQL Editor**: τρέξε ολόκληρο το `supabase/comments.sql` (μία φορά).
2. Αντίγραψε τα 3 αρχεία στο repo σου (στις ίδιες θέσεις).
3. Commit & push → το Vercel κάνει auto-deploy.
4. Οι μεταβλητές `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` υπάρχουν ήδη (τις χρησιμοποιεί το StarRating).

## 🔒 Ασφάλεια / Anti-spam
- **RLS**: insert μόνο αν το `session_id` ταιριάζει με το `x-session-id` header (μπλοκάρει bulk spam).
- **Honeypot**: κρυφό πεδίο — αν γεμίσει (bot), το σχόλιο απορρίπτεται σιωπηλά.
- **Rate limit**: max 3 σχόλια/session ανά 60'' (DB trigger) + 20'' client-side.
- **Όρια**: σχόλιο ≤ 2000 χαρακτήρες, όνομα ≤ 40.

## 🛠️ Διαχείριση (moderation)
Δεν υπάρχει anon UPDATE/DELETE. Για να σβήσεις/κρύψεις σχόλιο:
**Supabase → Table Editor → `comments` → διάγραψε τη γραμμή.**
(Αν αργότερα θες κουμπί «Αναφορά» ή admin panel, μου το λες και το προσθέτω.)

## ✅ Τι επαληθεύτηκε
- `next build` περνά καθαρά (Compiled successfully, 437 σελίδες βιβλίων με το component).
- Δεν μπόρεσα να τεστάρω το ζωντανό insert/read γιατί χρειάζεται η δική σου Supabase (env keys) — γι' αυτό τρέξε το SQL & κάνε deploy, και θα δουλέψει με το ίδιο μοτίβο που ήδη δουλεύει το StarRating.
