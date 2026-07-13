# Portify-Edu — PRD & Progress

## Original Problem Statement
Greek educational platform (Next.js App Router + Supabase) serving Greek school-book PDFs. Goal: improve SEO, engagement, UI to surpass a competitor. User (Greek-speaking) develops locally on Windows (`C:\portify-edu`), pushes to GitHub `Eisatopon/portify-edu` → Vercel auto-deploy.

## Architecture
- Next.js 16 (App Router), React 19, Supabase (comments, RLS)
- `app/api/pdf` proxy for external PDFs; `app/api/ai-chat` (Groq/Gemini)
- Static `src/data/books.json`; components in `src/components`
- Container repo `/app/portify-edu` is linked to same GitHub repo → user pushes via "Save to Github".

## Implemented (dates)
- 2026-06: Comments system, dark-mode fixes, popularity sort, one-click download, global AI button, larger logo, PDF 404 graceful fallback, AI button no longer overlaps mobile nav.
- 2026-06-13: **PWA install banner fix** — replaced full-width bottom banner (which overlapped mobile bottom-nav) with a small circular install icon (📲) in the header next to ThemeToggle, shown only on `beforeinstallprompt`. Files: `src/components/InstallPWA.jsx`, `app/page.js`, `app/globals.css`. Verified by testing_agent (iteration_1.json, 100% frontend).

## Git Note
Container was behind GitHub main by 7 commits (all already-live work). Resolved via `git reset --hard origin/main` then re-applied the install-icon fix so "Save to Github" is a clean fast-forward — NO force push needed.

## Backlog / Next
- P1: SEO descriptions (100-200 words) + FAQ schema per book
- P1: Permanently update URLs of 26 broken PDF links in `books.json`
- P2: Share buttons (Viber/WhatsApp/FB) + per-book Open Graph images
