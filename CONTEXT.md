# Foundation OS — Contexte

> Source de verite operationnelle. Lu en debut de session, mis a jour en fin.
> Spec format : docs/core/communication.md

## Modules

| Module | Status | Path | Detail |
|--------|--------|------|--------|
| App Builder | ✅ Figma Make | `modules/app/` | UI refactor complet — DashboardLayout (sidebar collapsible + header + glow orbs), toutes pages restyled glassmorphism, 0 inline styles legacy, build OK 266ms, 19/19 tests |
| Design System | ✅ F1-F9 done | `modules/design-system/` | 46 composants shadcn/ui, tokens DTCG 3 couches, biome linter, 23 tests (smoke+a11y), CHANGELOG. Doc DS v2 → Supernova (plan 2). |
| Core OS | 6/6 actif | `docs/core/` | Cortex, Communication, Monitor, Tools v2 (98 outils), Planner (/plan-os), Worktrees (feature Claude Code — isolation parallele, doc officielle integree) |
| Cowork | actif (non-branche) | `docs/travaux-cowork/` | Co-work Desktop + CLI. Non branche a /session-start /session-end |
| Plan-Router | PROPOSITION | `docs/travaux-cowork/` | 5 profils, 6 questions ouvertes bloquent execution |
| Finance | prevu | — | Pas encore cree |
| Sante | prevu | — | Pas encore cree |

## Sessions recentes

| Date | Resume |
|------|--------|
| 2026-04-13 | **[DONE] DS finition F8-F9** |
|            | F8 : biome v2.4 (Tailwind, rules shadcn), 9 smoke+a11y tests (23 total DS), CHANGELOG.md |
|            | F9 : audit 46 composants (7 CVA, loading/error rares), chart.tsx @ts-nocheck conserve (recharts v3), F9.3 site demo → plan 2 Storybook |
|            | Commits : `d0217a8` (F8) + `e671ca8` (F9) |
| 2026-04-13 | **[DONE] App UI refactor — Figma Make design system integration** |
|            | DashboardLayout : sidebar collapsible + header + orbs glow (copie exacte preview Figma Make) |
|            | App.tsx : layout routes avec Outlet, auth pages standalone |
|            | IndexPage : stat cards glow + module cards (donnees Supabase live) |
|            | Commander : header gradient, glass tabs, stats pills, 6 panels Tailwind (0 inline style legacy) |
|            | KnowledgePage : glass cards, glass badges, 5 sections |
|            | Login + ResetPassword : centered glassmorphism card, orbs background |
|            | Cleanup : TabBar, Layout, Navbar, StatsBar supprimes (remplaces par DashboardLayout) |
|            | Commits : `436de80` (UI refactor) + `5418f35` (panel cleanup) |
|            | Health DEGRADED : 51 refs cassees (docs/travaux-cowork prospectifs) + bundle 613kB (motion/lucide) |
| 2026-04-13 | **[DONE_WITH_CONCERNS] DS finition F1-F7** |
|            | F1-F7 : tokens primitives + semantic + bridge + app migree + prefixe fos retire |
|            | Reste : F8 (tests etendus), F9 (affinage + site demo) |
| 2026-04-11 | **[DONE] DS shadcn rebuild depuis Figma Make** |
|            | 46 composants shadcn/ui, tokens DTCG from scratch, preview Figma Make iso |
|            | Commits : a6f37a2 + 3547b48 + 311ae9a |
| 2026-04-11 | **[DONE] Planner MVP + Worktrees feature + health SAIN** |
|            | Scope : 2 nouveaux modules Core OS (Planner, Worktrees) + nettoyage health-check |
|            | Planner : spec `docs/core/planner.md`, commande `/plan-os`, template `docs/plans/_template-plan.md`, registre, routing auto (haiku/sonnet/opus), sub-agent gate 3 conditions, wrapper `superpowers:writing-plans` |
|            | Worktrees : doc officielle integree `docs/core/worktrees.md`, `.gitignore` + `ref-checker.sh` exclusion, feature native Claude Code documentee |
|            | Cleanup : worktree orphelin `admiring-sutherland` archive dans `.archive/worktrees-orphelins/`, branche supprimee, 95 refs cassees → 0 |
|            | Decisions : D-PLAN-01 Planner MVP wrapper Superpowers, D-WT-01 Worktrees integres Core OS |
|            | Phase 2 backlog Planner : log tokens reels vs estimes, calibration heuristiques |
|            | Commits : 6413ac9 (planner) + 962c174 (worktrees) |
| 2026-04-11 | **[DONE] Tools v2 — catalogue 97 outils, routing 26 regles, CLI tool-register.sh**. D-TOOLS-01. `40e197c` |
| 2026-04-10 | **[DONE] Audit Core OS + Cockpit + Communication v1** — 27 fixes, /cockpit TDAH, rename Memory→Communication. `21354c9`/`7cbb391`/`18079d0` |

> Sessions plus anciennes (S0-S14, Cycle 3 audit + Design System + Monitor Dashboard + Cycles 1-2) disponibles via `git log` et `.archive/audit-massif/23-rapport-final.md`.

## Cap

**Direction** : DS Showcase + Tooling Sync — Storybook complet, Supernova doc, Asana/Notion sync.

**Pourquoi** : Plan finition DS termine (F1-F9, commits d0217a8 + e671ca8). DS propre : biome, 23 tests, audit composants fait. Prochaine etape = rendre le DS visible et documente.

**Prochaine action** : Executer plan DS Showcase (`docs/plans/2026-04-13-ds-showcase-tooling-sync-plan.md`) — Bloc 1 (audit Storybook config). 15 blocs sur 5 sessions.

**Ensuite** : Phase 5 Expansion (Finance/Sante/Trading — a decider).

## Idees & Parking

- 💡 **Agent SDK Anthropic** : explorer formalisation Cortex en natif. Pre-requis : SDK mature + evaluation. (S17)
- 💡 **MCP custom CONTEXT.md** : anti-compactage via contexte a la demande. Spec + implementation. (S17)
- 💡 **Supabase MCP + Vercel MCP** : quick wins connexion. Installation simple post-cycle3. (S17)
- 🔮 **modules/shared** : extraction auth+DB. Premature tant qu'1 seul module actif — a faire quand 2e module. (S19)
- 🔮 **DS-6 complet** : exporter tokens DTCG vers Figma/Penpot. Nice-to-have. (D-DS-21)
- 💡 **Storybook 9 + React 19** : upgrader quand Storybook 9 sort pour retirer les overrides react-dom. (audit 2026-04-10)
- ❓ **Cowork : methodo ou produit ?** : Foundation OS = apprentissage methodologique ou produit Phase 5+ ? A trancher avant Sprint 1 Cowork. (S7)

## En attente Kevin

- Activer "Email confirmations" dans Supabase Auth (Dashboard → Authentication → Providers → Email). Pending depuis Phase 2.3.
- OMC update disponible v4.11.4 (actuel v4.10.1, `omc update`). Lateral, pas urgent.
- Decision strategique Cowork : methodo ou produit ? (ref Idees & Parking)
- Decision strategique Phase 5 : quel module lancer ? Finance / Sante / Trading (reporte apres finition DS)
- Demarrer S+2 DS : executer F8 du plan finition (nettoyage + tests etendus)

## Decisions

> Decisions stables (> 30 jours ou supersedees) archivees dans `docs/decisions-log.md`.

| Decision | Date | Detail |
|----------|------|--------|
| D-DS-REBUILD Remplacement total shadcn | 2026-04-11 | Option C : supprimer ancien DS (tokens turquoise #5EEAD4 + 5 primitives hand-crafted), reconstruire from scratch depuis Figma Make `base DS/src.zip`. Dark-only, pas de compat layer, prefixe `--fos-*` a retirer (→ `--ds-*`, `--shadcn-*`). App a migrer direct (pas de shim). Nouveau palette Figma Make : ds-surface-{0..3}, ds-blue #60a5fa, ds-purple #c084fc, etc. Polices : Figtree + JetBrains Mono. Plan detaille `docs/plans/2026-04-11-ds-shadcn-finition.md`. |
| D-WT-01 Worktrees integres Core OS | 2026-04-11 | Feature native Claude Code documentee `docs/core/worktrees.md`. `.claude/worktrees/` dans `.gitignore` + exclu `ref-checker.sh`. Orphelin `admiring-sutherland` archive dans `.archive/worktrees-orphelins/`. Health SAIN. |
| D-PLAN-01 Planner MVP wrapper Superpowers | 2026-04-11 | `/plan-os` wrapper par-dessus `superpowers:writing-plans` + routing modele auto + sub-agent gate 3 conditions + versionnement `docs/plans/`. Spec `docs/core/planner.md`. Phase 2 (log reel) en backlog. |
| D-TOOLS-01 Catalogue modulaire v2 | 2026-04-10 | 97 outils documentes (9 categories), routing etendu (26 regles), tool-register.sh CLI, patterns.json. Spec `docs/specs/2026-04-10-tools-module-v2-design.md` |
| D-AUDIT-01 Scripts dynamiques | 2026-04-10 | health-check + sync-check decouvrent modules/agents/commands dynamiquement. Plus de listes hardcodees. |
| D-AUDIT-02 DS monitoring | 2026-04-10 | Design System visible dans health-check (build + TS + 100 tests). react-dom v19 force via overrides. |
| D-COCKPIT-01 Point d'entree unique | 2026-04-10 | /cockpit = super-pilote optionnel. Coexiste avec session-start/end/sync/new-project. Routing auto via Cortex. |
| D-BRIEF-01 Format v11 TDAH | 2026-04-10 | Cadres box-drawing, zones visuelles, alignement strict. Remplace separateurs plats v10. Kevin TDAH. |
| D-COM-01 Module Communication | 2026-04-10 | Remplace Memory. Spec 375L, CONTEXT.md 400→120L, brief v10, capture idees, nomenclature unifiee. `18079d0` |
| D-HK-01 DS-6 complet | 2026-04-10 | 206/254 couleurs → tokens. 9 primitifs + 9 semantiques. 25 fichiers. `59d115a` |
| D-HK-02 Deps upgrade | 2026-04-10 | React 19, Vite 8, Tailwind 4. Build -74%. `67b0188` |
| Dashboard supprime | 2026-04-10 | Dead code doublon Commander. Redirect /dashboard→/commander. |
| D-S7-01 Foundation OS = outil | 2026-04-08 | Outil produit, pas projet d'apprentissage. Phase 5 = objectif. |
| BMAD garde | 2026-04-07 | _bmad/ dormant (overrule Kevin). |
| Code review | 2026-04-07 | review-agent custom = outil principal. Coderabbit/OMC installes mais non utilises. |
| Compactage → re-audit | 2026-04-07 | Si compactage risque → refaire cycle audit complet avant de continuer. |
| Regles meta OS | 2026-04-07 | Decoupage sessions, cause racine obligatoire, pragmatisme. |
| D-DS tokens DTCG | 2026-04-09 | 2-tier primitives+semantic, Style Dictionary 4.4, CSS+JS+JSON. |
| D-DS primitives API | 2026-04-09 | Button, Text, Icon, Input, Card. ForwardRef, WCAG AA, focus-visible. |
| D-DS workspace | 2026-04-09 | npm workspaces, prebuild chain, dep version "*". |

## Metriques

| Module | Build | JS | CSS | Tests | Routes |
|--------|-------|----|-----|-------|--------|
| App Builder | OK 253ms | 473 kB | 25 kB | 19/19 | 5 |
| Design System | OK tokens | — | — | 23/23 | — |

Seuils : voir `docs/core/monitor.md` section 4 (source unique).
Health-check : SAIN (0 critical, 0 warning). Refs nettoyees 2026-04-10.
Deploy : https://foundation-os.vercel.app/
DB : Supabase, 6 tables + updated_at triggers (migration 003 appliquee).

## Cycle 3 — Clos

24/24 sessions DONE (100%). 35/42 fixes appliques (83%). 7 items justifies (4 skips + 3 N/A).
Branche : `audit-massif-cycle3` (merged). Rapport : `.archive/audit-massif/23-rapport-final.md`.

## MCP — Comptes connectes

| Service | Info |
|---------|------|
| Asana | workspace 1213280972575193, kevin.noel.divers@gmail.com |
| Notion | user 4f1b99db |
| Figma | disponible |
| Monday.com | disponible |
| Gmail | Auth requise |

## Outils

- **CI** : GitHub Actions (Node 24, build + TS + tests) + supabase-ping cron
- **Tests** : Vitest (app 19 + DS 100) + health-check.sh + sync-check.sh + ref-checker.sh
- **Hooks** : validate-void-glass (PreToolUse) + security-reminder.py (PreToolUse) + pre-commit + commit-msg
- **Cowork** : session-lock.sh (verrou 30min TTL)
- **Plugins** : OMC, Superpowers v5.0.7, gstack, BMAD v6 (dormant)
- **Design System** : npm workspaces, Style Dictionary, Storybook 8.6, Playwright + axe

## Travaux Cowork

| Titre | Chemin | Status |
|-------|--------|--------|
| Plan Dashboard Monitoring | `docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/` | valide Kevin — 14 fichiers (~174Ko), pret pour handoff CLI. Gates G1 (pre-build snapshot JSON) + G2 (fichiers MD dans `modules/app/data/`) **arbitres Kevin 2026-04-13** : Claude decide au mieux, recommandations suivies. Effort estime ~33h (10-12 sessions). Contrainte absolue : 100% DS Void Glass, Supernova + Storybook dans le meme flow que chaque nouveau composant. |

## Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Supabase pause 7j inactif | low | GitHub Actions cron ping hebdo |
| Vercel deploy casse | medium | Root dir = modules/app |
