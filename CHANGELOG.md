# Changelog — theme-optimized.xml (EisatoponAI Blogger Template)

> Βάση: `theme-7136655045781905113.xml`
> Στόχος: καθαρότερο CSS, ταχύτητα (ειδικά mobile), δυνατότερο SEO, accessibility — **χωρίς οπτικές αλλαγές στο τελικό render**.
> Το αρχείο επαληθεύτηκε ως **well-formed XML** και το JSON-LD δοκιμάστηκε σε **8 σενάρια** (όλα έγκυρα).

---

## ⚠️ Πριν το upload — Backup (safety net)
Blogger → **Theme → ⋮ (menu) → Backup / Restore → Download** (κράτα το τρέχον `.xml`).
Μετά: **Upload** το `theme-optimized.xml`.

---

## 1) CSS Cleanup & Consolidation
- **Ένωση 33 → 5 `<style>` blocks** μέσα στο `<head>` (Ενότητες 5.1–5.17 + 7.x + MathJax container + header).
  - Η **σειρά των κανόνων διατηρήθηκε ακριβώς** → ίδιο cascade → **μηδέν οπτική αλλαγή**.
  - Τα ενδιάμεσα SEO/JSON-LD/script blocks (`<b:if>`) και το widget-CDATA CSS **δεν πειράχτηκαν**.
  - Τα section labels (`5.2 — Share bar` κ.λπ.) διατηρήθηκαν ως CSS comments για μελλοντική επεξεργασία.
- **Fix σπασμένου CSS comment**: το `===== ΑΦΑΙΡΕΣΗ JUSTIFY ΣΤΟΙΧΙΣΗΣ ===== */` ήταν χωρίς άνοιγμα `/*`,
  πράγμα που **ακύρωνε** τον επόμενο κανόνα (`text-align:left` στο `.post-body`). Διορθώθηκε σε έγκυρο σχόλιο.
  *(Η προεπιλεγμένη στοίχιση ήταν ήδη left, οπότε καμία ορατή διαφορά — απλώς ο κανόνας πλέον εφαρμόζεται σωστά.)*

## 2) Speed / Performance
- **Google Fonts → non-render-blocking**: το stylesheet φορτώνει πλέον με
  `rel="preload" as="style" onload="this.rel='stylesheet'"` + `<noscript>` fallback.
  Αφαιρεί ένα render-blocking request (σημαντικό mobile PageSpeed win). Το `display=swap` ήταν ήδη ενεργό.
- **Preconnect/preload**: επιβεβαιώθηκαν (`fonts.googleapis.com`, `fonts.gstatic.com` crossorigin, `blogger.googleusercontent.com`, preload og-image). Χωρίς αλλαγή.
- **Lazy-loading**: επιβεβαιώθηκε IntersectionObserver + native `loading="lazy"`/`decoding="async"` σε όλες τις εικόνες, με εξαίρεση το LCP hero thumbnail (`fetchpriority="high"`, `loading="eager"`). Χωρίς αλλαγή.
- **Scripts**: τα custom scripts τρέχουν ήδη σε `DOMContentLoaded`/`window.load` (ουσιαστικά deferred)· MathJax φορτώνει `async`· GTM φορτώνει delayed on `load`.
- **Καθαρισμός duplicate/dead scripts**:
  - Αφαιρέθηκε **διπλότυπο** `setActiveMenu` script (έτρεχε 2 φορές — πλέον 1).
  - Αφαιρέθηκε άδειο placeholder script (`/* toggleSearch: defined above */`).

## 3) SEO Hardening
- **JSON-LD** ελέγχθηκε (WebSite + Sitelinks Search, Organization, BlogPosting, BreadcrumbList).
- **BlogPosting ενισχύθηκε** (απαιτήσεις Google για Article rich results):
  - `publisher.logo` (ImageObject) — ήταν required και έλειπε.
  - `dateModified` (από `lastUpdated`, με fallback στο `datePublished`).
  - `image` (από `firstImageUrl`, fallback `thumbnailUrl`).
- **Canonical / robots**: επιβεβαιώθηκαν — `noindex,follow` σε archive/search/label, `index,follow,max-image-preview:large` αλλού, canonical σε όλες τις σελίδες. Χωρίς αλλαγή.
- **OpenGraph / Twitter**: επιβεβαιώθηκαν για homepage/pages/single-item. Χωρίς αλλαγή.
- **Auto alt-tags**: το υπάρχον JS που γεμίζει alt όπου λείπει διατηρήθηκε.

## 4) Accessibility (bonus, χωρίς ρίσκο)
- **Focus states (`:focus-visible`)** για πλήκτρα/links πλοήγησης: `View more labels`, pager buttons, CTA, μενού, share buttons, scroll-to-top, search. Εμφανίζονται **μόνο σε keyboard navigation** → καμία αλλαγή για χρήστες ποντικιού.
- **`aria-expanded`** στο κουμπί «View more labels» (toggle true/false).
- **`alt`** προστέθηκε: author photo (`data:post.author.name`), + `alt=""` σε 2 διακοσμητικά system icons (comment favicon, delete icon).

## 5) MathJax
- **Δεν πειράχτηκε** (config, delimiters, SVG). Δεν εντοπίστηκε πρόβλημα με hero/snippets.

---

## Επαλήθευση
- `well-formed XML`: ✅
- `BlogPosting JSON-LD`: ✅ έγκυρο και στα 8 σενάρια (lastUpdated × firstImage × thumbnail)
- Μέγεθος: ~177 KB → ~176 KB (καθαρισμός duplicates)
- `<style>` tags στο head: **33 → 5**

## Ανοιχτά σημεία (προαιρετικά, για μελλοντικά)
- Το non-blocking font load προκαλεί ελάχιστο FOUT κατά τη φόρτωση (fallback → swap). Είναι το standard PageSpeed pattern· αν το προτιμάς αλλιώς, μπορεί να επανέλθει σε μία γραμμή.
- Μελλοντικά: interactive μαθηματικό εργαλείο/quiz, dark mode, Core Web Vitals tuning με πραγματικά δεδομένα.
