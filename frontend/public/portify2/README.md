# Portify — v2: Δημοφιλία + One-Click Download

## Τι άλλαξε (αντικατέστησε αυτά τα αρχεία στο repo σου)
| Αρχείο | Τι κάνει |
|---|---|
| `app/page.js` | **NEW** control «Ταξινόμηση: ⭐ Δημοφιλή» (καλύτερη βαθμολογία πρώτα) |
| `src/components/BookCard.jsx` | **NEW** κουμπί ⬇ Λήψη απευθείας στην κάρτα |
| `app/api/pdf/route.js` | Υποστήριξη πραγματικού download (`?dl=1`) |
| `src/components/BookComments.jsx` | (dark-mode fix — αν δεν το έχεις ήδη) |
| `app/book/[slug]/BookViewerClient.js` | (σχόλια — αν δεν το έχεις ήδη) |
| `supabase/comments.sql` | (σχόλια — αν δεν το έχεις τρέξει ήδη) |

## Εγκατάσταση
1. Extract το zip → αντίγραψε τους φακέλους `app`, `src`, `supabase` μέσα στο `C:\portify-edu` (Merge/Replace → Ναι).
2. VS Code Terminal:
   ```
   git add .
   git commit -m "Add popularity sort + one-click download"
   git push
   ```
3. Το Vercel κάνει auto-deploy.

## Σημειώσεις
- **#1 Google Schema (αστεράκια):** ✅ υπάρχει ήδη στο `app/book/[slug]/page.js` (`aggregateRating`). Εμφανίζεται μόλις κάθε βιβλίο έχει ≥3 αξιολογήσεις.
- **#2 Δημοφιλία:** ταξινομεί με βάση (πλήθος × μέση βαθμολογία). Βιβλία χωρίς αξιολογήσεις πάνε τελευταία.
- **#3 Λήψη:** περνά μέσα από το `/api/pdf` proxy ώστε το αρχείο να «κατεβαίνει» κανονικά (όχι απλό άνοιγμα).
