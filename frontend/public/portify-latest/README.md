# Portify — ΟΛΕΣ οι αλλαγές μαζί (comments + sort + download + central AI)

Αυτό το πακέτο περιέχει **όλα** τα αρχεία που αλλάξαμε. Αντικατέστησέ τα στο repo σου και είσαι 100% ενημερωμένος.

## Αρχεία
| Αρχείο | Feature |
|---|---|
| `supabase/comments.sql` | Σχόλια — πίνακας + RLS (τρέξ' το στη Supabase αν δεν το έχεις κάνει) |
| `src/components/BookComments.jsx` | Σχόλια κάτω από κάθε βιβλίο (dark-mode ok) |
| `app/book/[slug]/BookViewerClient.js` | Ενσωμάτωση σχολίων στη σελίδα βιβλίου |
| `app/page.js` | Ταξινόμηση «⭐ Δημοφιλή» + CTA «Ρώτησε τον AI» στο hero |
| `src/components/BookCard.jsx` | Κουμπί ⬇ Λήψη στην κάρτα |
| `app/api/pdf/route.js` | Πραγματικό download (`?dl=1`) |
| `src/components/AiChatPanel.jsx` | Υποστήριξη **general mode** (ρώτα για οποιοδήποτε βιβλίο) |
| `src/components/GlobalAiButton.jsx` | **NEW** πλωτό κουμπί «🤖 Ρώτησε τον AI» σε όλες τις σελίδες |
| `app/layout.js` | Mount του καθολικού AI κουμπιού |

## Εγκατάσταση
1. Extract → αντίγραψε `app`, `src`, `supabase` στο `C:\portify-edu` (Merge/Replace → Ναι).
2. (Μία φορά, αν δεν το έχεις κάνει) Supabase → SQL Editor → τρέξε το `comments.sql`.
3. VS Code Terminal:
   ```
   git add .
   git commit -m "Central AI assistant + comments + popularity sort + one-click download"
   git push
   ```

## Ο καθολικός AI βοηθός
- Πλωτό κουμπί «🤖 Ρώτησε τον AI» κάτω δεξιά σε ΟΛΕΣ τις σελίδες (εκτός σελίδων βιβλίου, που έχουν ήδη δικό τους).
- Μεγάλο CTA στο hero της αρχικής.
- Σε **general mode** απαντά για οποιοδήποτε μάθημα/βιβλίο (Δημοτικό–Λύκειο), με το ίδιο backend (Groq + Gemini fallback) που ήδη δουλεύει.
- Χρησιμοποιεί τα ΙΔΙΑ env keys (GROQ/Gemini) που ήδη έχεις στο Vercel — δεν χρειάζεται κάτι νέο.
