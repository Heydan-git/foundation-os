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
| Design | 2026-04-01 | Void Glass — modules/design-system/ |
| Architecture | 2026-04-01 | Monorepo modules/ (seul app/ existe, finance et sante prevus) |
| Commits | 2026-04-01 | Conventional commits type(scope): description |
| Anti-bullshit | 2026-04-01 | 6 gates dans CLAUDE.md, mots interdits, verification obligatoire |
| Garde-fous | 2026-04-01 | Jamais de fichier a la racine, jamais sans demande, grep+fix apres rename |
| Schema DB | 2026-04-01 | supabase/migrations/001_create_tables.sql = source de verite (6 tables) |

## Archivage 2026-04-07 — 10 decisions Phases / Specs / livrables

Decisions stables migres depuis CONTEXT.md "Decisions actives" lors du housekeeping S3 du plan Finition OS. Specs Core OS stabilisees, phases DONE confirmees, livrable module-scaffold.

| Decision | Date | Detail |
|----------|------|--------|
| Memoire | 2026-04-05 | 5 tiers (session/contexte/auto-memory/reference/wiki) — docs/core/communication.md |
| Core OS | 2026-04-05 | 7 modules actifs (Cortex, Communication, Monitor, Tools, Planner, Worktrees, Knowledge). Specs : docs/core/ |
| Foundation v2 | 2026-04-05 | Approche C iterative 5 phases. Spec : docs/specs/2026-04-05-foundation-os-v2-design.md |
| Phase 1 DONE | 2026-04-05 | Fondations : CLAUDE.md v2, security-guidance, gstack, index navigation |
| Phase 2.1 DONE | 2026-04-07 | Tests : 16 nouveaux, mocks Supabase via vi.hoisted, 19 total. Plan Phase 2 ecrit. |
| Phase 2.2/2.3 DONE | 2026-04-07 | Navbar (NavLink, sticky top, Void Glass), LoginPage min 8 char, ResetPasswordPage (request+update modes). 7 routes. |
| Phase 2 DONE | 2026-04-07 | App Hardening complet : 16 tests, Navbar+Auth, KnowledgePage. Artifacts JSX archives. App production-ready. |
| Phase 3 DONE | 2026-04-07 | OS Intelligence : session-end 4 niveaux, docs/index-documentation.md re-aligne, audit BMAD/OMC/Coderabbit (docs/tools-audit.md). |
| Phase 4 DONE | 2026-04-07 | Monitoring : pre-commit health-check (BROKEN bloque), bundle thresholds JS>600KB/CSS>40KB, token-awareness rules dans CLAUDE.md. |
| module-scaffold | 2026-04-07 | scripts/module-scaffold.sh (170L) — automatise /new-project, idempotent, --help, gere upgrade ligne CONTEXT.md. Commit 025615c. Sort du backlog Tools moyenne priorite. |

## Archivage 2026-04-17 — 7 decisions stabilisees avril 2026

Decisions stabilisees retirees de CONTEXT.md lors du cleanup drifts Phase 6 (passage CONTEXT.md 179L -> <150L).

| Decision | Date | Detail |
|----------|------|--------|
| D-PLAN-01 Planner MVP wrapper Superpowers | 2026-04-11 | SUPERSEDE par D-PLAN-02 (/plan-os orchestrateur EnterPlanMode dual-path). |
| D-TOOLS-01 Catalogue modulaire v2 | 2026-04-10 | 109 outils documentes, routing etendu (35 regles), `tool-register.sh` CLI. |
| D-COCKPIT-01 Point d'entree unique | 2026-04-10 | /cockpit = super-pilote optionnel. Coexiste avec session-start/end/sync/new-project. |
| D-BRIEF-01 Format v11 TDAH | 2026-04-10 | Cadres box-drawing, zones visuelles, alignement strict. SUPERSEDE par brief v12 tuiles Markdown. |
| D-COM-01 Module Communication | 2026-04-10 | Remplace Memory. 5 tiers persistance (D-WIKI-01) + brief v11/v12. |
| D-HK-02 Deps upgrade | 2026-04-10 | React 19, Vite 8, Tailwind 4. Build -74%. |
| Compactage -> re-audit | 2026-04-07 | Si compactage risque -> refaire cycle audit complet avant de continuer. |

## Archivage 2026-04-17 — 2 migrations historiques Core OS

Sections historiques migrees depuis `docs/core/communication.md` (section 9) et `docs/core/knowledge.md` (section 11) lors du cleanup drifts Phase 7-8. Specs Core OS n'ont plus a contenir d'historique descriptif — les changements sont deja traces dans CONTEXT.md Sessions + git log.

| Migration | Date | Detail |
|-----------|------|--------|
| Memory -> Communication (rename spec) | 2026-04-10 | Ancien fichier `memory.md` (dans docs/core/) renomme en `docs/core/communication.md`. Scope elargi : persistance uniquement -> journalisation + indexation + lecture + briefing. 4 tiers + protocoles lecture/ecriture, sessions structurees, decisions compactes, idees + lifecycle, brief v12, nomenclature unifiee, budget CONTEXT.md < 150L. |
| auto-memory -> wiki/ (migrations selectives D-WIKI-01) | 2026-04-15 | 2 memoires migrees : `project_migration_desktop.md` -> `wiki/domains/dev/concepts/foundation-os-desktop-migration.md` (concept dev atemporel), `tools_inventory.md` -> `wiki/entities/tools-foundation-os.md` (entity tool). 27 autres memoires restees dans auto-memory (profile Kevin + feedback comportement Claude = bon tier). Principe : 1-par-1 avec ASK Kevin, zero perte. |

## Protocole

Quand CONTEXT.md depasse 15 decisions actives :
1. Identifier les decisions stables (pas touchees depuis ~30 jours)
2. Les deplacer ici en ajoutant une section `## Archivage YYYY-MM-DD — N decisions`
3. Laisser les decisions recentes et actives dans CONTEXT.md
4. Preserver le format table identique pour pouvoir les "unarchiver" si besoin
