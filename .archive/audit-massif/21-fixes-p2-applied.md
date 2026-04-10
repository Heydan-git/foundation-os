# 21-fixes-p2-applied — S21 Batch P2
> **Status** : DONE
> **Session** : S21 (2026-04-10)
> **Branche** : audit-massif-cycle3
> **Commits** : cdd9d4e + 4e896e8

## Objectif

Appliquer les ~23 fixes P2 identifies dans `19-synthese-roadmap.md` section 3.

## Fixes appliques (19/23)

### Commit 1 : cdd9d4e — 17 fixes code quality/UI/CI/docs

| # | Finding | Fix | Fichier(s) |
|---|---------|-----|------------|
| 5 | F-S13-05 | 19 console.log supprimes (garder console.error) | 8 fichiers src/ |
| 6 | F-S13-09 | Phase1Demo double export → default seul | pages/Phase1Demo.tsx |
| 7 | F-S13-11 | 14 catch any → unknown (couple #1 P1) | 6 fichiers src/ |
| 8 | F-S13-21 | SupabaseCRUDTest DEV-only lazy route (-8.73kB chunk) | App.tsx, SupabaseCRUDTest.tsx |
| 9 | F-S13-10 | Seed data extrait → lib/seed-data.ts | lib/useCommander.ts, lib/seed-data.ts |
| 12 | F-S13-07 | globalStyles dedup (App.tsx inline supprime) | App.tsx |
| 14 | F-S13-15 | APP_META partage Commander+Dashboard+Knowledge | lib/constants.ts, 3 pages |
| 15 | F-S13-16 | Google Fonts @import deplace dans index.html | index.html, App.tsx |
| 16 | F-S13-17 | KnowledgePage 120L data extraite → lib/knowledge-data.ts | pages/KnowledgePage.tsx, lib/knowledge-data.ts |
| 18 | F-S15-02 | CI DS build + workspaces | .github/workflows/ci.yml |
| 19 | F-S15-05 | CI cache-dependency-path → racine | .github/workflows/ci.yml |
| 22 | F-S8-03 | sync.md 80→16L (pointeur script) | .claude/commands/sync.md |
| 23 | D-S7-04 | PAUL jargon supprime 4 fichiers | agents + commands |
| 24 | F-S3-01 | CLAUDE.md tools MAJ | CLAUDE.md |
| 27 | F-S13-18 | PASSWORD_MIN extrait → lib/constants.ts | LoginPage, ResetPasswordPage, constants.ts |
| — | F-S13-14p | LoadingSkeleton partage (partie visible) | components/LoadingSkeleton.tsx, Commander.tsx |
| — | — | Brief v9 alignment (session-start/end) | .claude/commands/ |

### Commit 2 : 4e896e8 — Dashboard removal + migration

| # | Finding | Fix | Fichier(s) |
|---|---------|-----|------------|
| 11 | F-S13-06 | Dashboard.tsx dead code supprime, redirect /dashboard→/commander | App.tsx, Navbar |
| 20 | F-S15-04 | Migration 003 updated_at 6 tables + triggers auto | supabase/migrations/003_add_updated_at.sql |

## Skips justifies (4)

| # | Finding | Raison du skip |
|---|---------|----------------|
| 10 | F-S13-12 | Inline fn NextStepActions : pattern standard React (onClick avec arg), pas de perf issue |
| 13 | F-S13-14 | LoadingSkeleton variant : duplication restante dans Dashboard.tsx = dead code |
| 17 | F-S13-20 | Dates hardcodees : nettoyees par extraction knowledge-data.ts, plus de dates stale |
| 25/26 | F-S14-01/02 | Vulns + outdated packages : resolus post-cycle3 par migration vite@8+react@19+tailwind@4 |

## Verification

- Build app : OK (cdd9d4e 980ms, 4e896e8 889ms)
- JS bundle : 457→440kB (-17kB)
- tsc : 0 erreur
- Tests : 19/19 passed
- Health : DEGRADED (83 refs baseline audit docs)
