# Changelog — theme-optimized.xml (EisatoponAI / eisatopon.blogspot.com)

> Το theme αφορά το blog **eisatopon.blogspot.com** (blog ID 7136655045781905113).
> (Το www.eisatopon.gr είναι ΞΕΧΩΡΙΣΤΟ blog με άλλο, σκούρο theme — δεν έχει πειραχτεί.)

---

## ⚠️ Πριν το upload — Backup
Blogger → **Theme → ⋮ → Δημιουργία αντιγράφου ασφαλείας (Download)**, μετά → **Επαναφορά (Restore) → Upload** το `theme-optimized.xml`.

---

# 🆕 Έκδοση 2 (νέες βελτιώσεις εμφάνισης/λειτουργικότητας)

## A. Διόρθωση «σπασμένων» μαθηματικών στις κάρτες/λίστες
- Πρόβλημα: στην αρχική & στις λίστες τα μαθηματικά εμφανίζονταν ως raw LaTeX
  (π.χ. τίτλος «... \(5\times10\times10\)»), επειδή το MathJax τρέχει μόνο μέσα στα άρθρα.
- Λύση: ελαφρύ script (μόνο σε non-article σελίδες) που μετατρέπει τα σύμβολα σε καθαρό Unicode:
  - `\(5\times10\times10\)` → **5×10×10**
  - `$x^2+1=0$` → **x²+1=0**
  - `\frac{a}{b}` → **a/b**, `\sqrt{2}` → **√2**, `\pi` → **π**, εκθέτες → ⁰¹²³…
  - Τα απλά κείμενα μένουν ανέγγιχτα. **Χωρίς φόρτωση MathJax στην αρχική** (μηδέν κόστος ταχύτητας).

## B. Νέα branded εικόνα κοινοποίησης (og-image)
- Πρόβλημα: η παλιά `https://www.eisatopon.gr/img/og-default.jpg` επέστρεφε **404**
  (σπασμένα previews σε Facebook/X/WhatsApp) **και γινόταν preload σε κάθε σελίδα** (σπατάλη + error).
- Λύση:
  - Δημιουργήθηκε νέα επαγγελματική εικόνα **1264×848** (EisatoponAI, μαθηματικό theme) → `og-eisatopon.png`.
  - Ενημερώθηκαν όλες οι αναφορές `og:image` / `twitter:image` (homepage + pages) στη νέα εικόνα.
  - Ενημερώθηκαν `og:image:width/height` → 1264/848.
  - **Αφαιρέθηκε το άχρηστο/σπασμένο `<link rel="preload">`** της og-image.

> ℹ️ Η νέα εικόνα δείχνει προσωρινά σε emergent CDN URL. Για μέγιστη μονιμότητα, ανέβασέ την στο δικό σου hosting/Blogger και άλλαξε το URL (μία γραμμή) — οδηγίες στο chat.

---

# Έκδοση 1 (βάση — καθαρισμός/ταχύτητα/SEO/a11y)

## 1) CSS Cleanup & Consolidation
- Ένωση **33 → 5 `<style>` blocks** στο `<head>` με **ακριβώς ίδια σειρά** (ίδιο cascade → μηδέν οπτική αλλαγή).
- Fix σπασμένου CSS comment («ΑΦΑΙΡΕΣΗ JUSTIFY» — έλειπε το `/*`, ακύρωνε τον επόμενο κανόνα).

## 2) Speed / Performance
- **Google Fonts → non-render-blocking** (`preload` + swap + `<noscript>` fallback).
- Επιβεβαίωση lazy-loading (IntersectionObserver + native), preconnects.
- Αφαίρεση **διπλότυπου** `setActiveMenu` script + άδειου placeholder script.

## 3) SEO Hardening
- Ενίσχυση **BlogPosting** JSON-LD: `publisher.logo` (required), `dateModified`, `image`.
- Επιβεβαίωση canonical / robots (noindex σε archive/search/label) / OpenGraph.

## 4) Accessibility
- `:focus-visible` σε κουμπιά/links, `aria-expanded` στο «View more», `alt` όπου έλειπε.

## 5) MathJax (μέσα σε άρθρα)
- Ανέγγιχτο.

---

## Επαλήθευση
- ✅ well-formed XML
- ✅ BlogPosting JSON-LD έγκυρο (8/8 σενάρια)
- ✅ Math cleanup δοκιμασμένο σε 6 παραδείγματα
- ✅ `<style>` tags head: 33 → 5 · og-default 404 → νέα εικόνα · broken preload removed
