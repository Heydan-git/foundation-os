# Foundation OS — Decisions archivees

Navigation: [[CONTEXT]] (decisions actives) | [[index-wiki]] (wiki) | [[foundation-os-map]] (carte)

> Log des decisions stabilisees archivees depuis CONTEXT.md quand le seuil de 15 est franchi (protocole Communication — `docs/core/communication.md` section 3).
>
> Les decisions ici sont encore **actives** — elles continuent de guider le travail — mais elles sont sorties de la vue chaude de CONTEXT.md parce qu'elles ne bougent plus.

## Archivage 2026-04-07 — 7 decisions du 2026-04-01

Stabilisees depuis la creation du projet. Aucune modification enregistree.

| Decision | Date | Detail |
|----------|------|--------|
| Stack | 2026-04-01 | Vite + React + TS + Tailwind + Supabase + Vercel |
| Design | 2026-04-01 | Void Glass — docs/design-system.md |
| Architecture | 2026-04-01 | Monorepo modules/ (seul app/ existe, finance et sante prevus) |
| Commits | 2026-04-01 | Conventional commits type(scope): description |
| Anti-bullshit | 2026-04-01 | 6 gates dans CLAUDE.md, mots interdits, verification obligatoire |
| Garde-fous | 2026-04-01 | Jamais de fichier a la racine, jamais sans demande, grep+fix apres rename |
| Schema DB | 2026-04-01 | supabase/migrations/001_create_tables.sql = source de verite (6 tables) |

## Archivage 2026-04-07 — 10 decisions Phases / Specs / livrables

Decisions stables migres depuis CONTEXT.md "Decisions actives" lors du housekeeping S3 du plan Finition OS. Specs Core OS stabilisees, phases DONE confirmees, livrable module-scaffold.

| Decision | Date | Detail |
|----------|------|--------|
| Memoire | 2026-04-05 | 4 tiers (session/contexte/reference/auto-memory) — docs/core/communication.md |
| Core OS | 2026-04-05 | 4 modules actifs (Cortex, Communication, Monitor, Tools). Specs : docs/core/ |
| Foundation v2 | 2026-04-05 | Approche C iterative 5 phases. Spec : docs/specs/2026-04-05-foundation-os-v2-design.md |
| Phase 1 DONE | 2026-04-05 | Fondations : CLAUDE.md v2, security-guidance, gstack, index navigation |
| Phase 2.1 DONE | 2026-04-07 | Tests : 16 nouveaux, mocks Supabase via vi.hoisted, 19 total. Plan Phase 2 ecrit. |
| Phase 2.2/2.3 DONE | 2026-04-07 | Navbar (NavLink, sticky top, Void Glass), LoginPage min 8 char, ResetPasswordPage (request+update modes). 7 routes. |
| Phase 2 DONE | 2026-04-07 | App Hardening complet : 16 tests, Navbar+Auth, KnowledgePage. Artifacts JSX archives. App production-ready. |
| Phase 3 DONE | 2026-04-07 | OS Intelligence : session-end 4 niveaux, docs/index.md re-aligne, audit BMAD/OMC/Coderabbit (docs/tools-audit.md). |
| Phase 4 DONE | 2026-04-07 | Monitoring : pre-commit health-check (BROKEN bloque), bundle thresholds JS>600KB/CSS>40KB, token-awareness rules dans CLAUDE.md. |
| module-scaffold | 2026-04-07 | scripts/module-scaffold.sh (170L) — automatise /new-project, idempotent, --help, gere upgrade ligne CONTEXT.md. Commit 025615c. Sort du backlog Tools moyenne priorite. |

## Protocole

Quand CONTEXT.md depasse 15 decisions actives :
1. Identifier les decisions stables (pas touchees depuis ~30 jours)
2. Les deplacer ici en ajoutant une section `## Archivage YYYY-MM-DD — N decisions`
3. Laisser les decisions recentes et actives dans CONTEXT.md
4. Preserver le format table identique pour pouvoir les "unarchiver" si besoin
