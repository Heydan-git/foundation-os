# Foundation OS — Contexte

> Source de verite operationnelle. Lu en debut de session, mis a jour en fin.
> Spec format : docs/core/communication.md

## Modules

| Module | Status | Path | Detail |
|--------|--------|------|--------|
| App Builder | ✅ Figma Make | `modules/app/` | UI refactor complet — DashboardLayout (sidebar collapsible + header + glow orbs), toutes pages restyled glassmorphism, 0 inline styles legacy, build OK 266ms, 19/19 tests |
| Design System | ✅ F1-F9 + Supernova | `modules/design-system/` | 46 composants shadcn/ui, tokens DTCG 3 couches, biome linter, 23 tests, CHANGELOG. **Supernova live** : 197 tokens + 154 stories + doc publiée (DS 790241). Scripts `npm run supernova:*` + `supernova.config.json`. |
| Core OS | 6/6 actif | `docs/core/` | Cortex, Communication, Monitor, Tools v2 (98 outils), Planner (/plan-os), Worktrees (feature Claude Code — isolation parallele, doc officielle integree) |
| Cowork | actif (non-branche) | `docs/travaux-cowork/` | Co-work Desktop + CLI. Non branche a /session-start /session-end |
| Plan-Router | PROPOSITION | `docs/travaux-cowork/` | 5 profils, 6 questions ouvertes bloquent execution |
| Finance | prevu | — | Pas encore cree |
| Sante | prevu | — | Pas encore cree |

## Sessions recentes

| Date | Resume |
|------|--------|
| 2026-04-14 | **[DONE] Tooling sync + narratif DS ready** |
|            | Asana : projet "Foundation OS — Setup" cloture (status "complete", 22/22 taches). Nouveau projet "Foundation OS — Build" (gid 1214059589666268) avec 4 sections (En cours, En attente Kevin, Idees & Parking, Phase 5 gelee) + 18 taches. |
|            | Notion : wiki 🪐 Foundation OS mis a jour — Sessions (+ 9 sessions 2026-04-07→14), Decisions actives (+ 14 decisions Build), Roadmap (Phase Build + modules reels + Phase 5 gelee). |
|            | Supernova narratif : 52 fichiers Markdown prets dans `modules/design-system/docs-supernova/` (6 Foundations handcrafted + 46 Components generes via `modules/design-system/scripts/gen-component-docs.mjs`). Push via UI Supernova (Option A) — push SDK non verifie sans token. |
|            | Composants invisibles Supernova : root cause documentee dans README docs-supernova. `storybook-import` embed iframe mais ne cree pas d'entites Component navigables — fix = pages Documentation dediees (markdown prets). |
|            | Health : SAIN (0 critical, 0 ref cassee, 42/42 tests, 1 warning bundle 613kB). |
| 2026-04-14 | **[DONE] Supernova live + Storybook fix + refs 81→0** |
|            | Supernova blocs 9-10 : workspace 735528 / DS 790241. 197 tokens DTCG sync, 22 groupes, 154 stories importees, doc publiee. |
|            | **Storybook upgrade** : 8.6 → 9.1.20 + Vite 7 (DS uniquement). Fix runtime `__STORYBOOK_MODULE_PREVIEW_API__` cause par Vite 8/Rolldown incompat SB 8.6. Preview iframe fonctionne (verifie local + Supernova hosted). App tsconfig exclude `*.stories.tsx`. |
|            | Scripts repo : `modules/design-system/supernova.config.json` + 4 npm scripts `supernova:*`. Env var `SUPERNOVA_TOKEN` requise. |
|            | Refs cassees : exclure `docs/travaux-cowork/` dans ref-checker.sh, CHANGELOG DS paths corriges, plan DS shadcn DONE archive `.archive/plans/`. 81 → 0. |
|            | Commits : `4a57db5` (Supernova + refs) + `06afda1` (Storybook upgrade). |
|            | URL Storybook public Supernova : https://storybook.supernova.io/design-systems/790241/alias/foundation-os-ds/index.html |
| 2026-04-14 | **[DONE] Storybook S2 + S3.bloc8 — 27 stories + audit etats** |
|            | S2 Blocs 4-6 (27 stories DS : Layout 10 + Nav 8 + Data 9). S2 Bloc 7 (9 stories app : Card/Badge/Skeleton + 6 Commander panels). |
|            | S3 Bloc 8 : audit etats 46 composants (couverture 21%, rapport docs/plans/2026-04-14-ds-audit-etats.md). |
|            | Config : extension Storybook scanne modules/app (alias @ resolu). Total Storybook : 55 stories. |
|            | Brief spec v11 passee a 12 sections (PLANS ACTIFS obligatoire — docs/core/communication.md §6.1). |
|            | Commits : `[blocs 4-6]` + `[bloc 7]` + `[bloc 8]` + spec brief. |
|            | **Blocage** : Supernova (blocs 9-12) requiert compte Kevin. Asana/Notion sync (blocs 13-15) requiert OK ecriture externe. |
| 2026-04-13 | **[DONE] Storybook S1 — Blocs 1-3 (19 stories)** |
|            | Bloc 1 : audit config OK. Bloc 2 : 10 stories Form. Bloc 3 : 9 stories Feedback. |
|            | Commit : `b36cbe0` |
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

**Direction** : DS Showcase + Tooling Sync — Supernova live, Asana/Notion sync restants.

**Pourquoi** : Supernova setup fait (blocs 9-12 infra). DS visible publiquement. Reste enrichissement narratif + sync Asana/Notion.

**Prochaine action** : verifier Supernova dans UI (preview Storybook + composants/tokens visibles). Puis au choix — (a) Enrichir narratif Supernova (Foundations intros, Components entites distinctes via SDK docs writer). (b) Plan DS Showcase blocs 13-14 (Asana/Notion sync) **bloque** tant que Kevin n'a pas OK ecriture externe. (c) Investiguer bundle app 613kB (seul warning health).

**Ensuite** : Phase 5 Expansion (Finance/Sante/Trading — a decider).

## Idees & Parking

- 💡 **Agent SDK Anthropic** : explorer formalisation Cortex en natif. Pre-requis : SDK mature + evaluation. (S17)
- 💡 **MCP custom CONTEXT.md** : anti-compactage via contexte a la demande. Spec + implementation. (S17)
- 💡 **Supabase MCP + Vercel MCP** : quick wins connexion. Installation simple post-cycle3. (S17)
- 🔮 **modules/shared** : extraction auth+DB. Premature tant qu'1 seul module actif — a faire quand 2e module. (S19)
- 🔮 **DS-6 complet** : exporter tokens DTCG vers Figma/Penpot. Nice-to-have. (D-DS-21)
- 💡 **Storybook 9 + React 19** : upgrader quand Storybook 9 sort pour retirer les overrides react-dom. (audit 2026-04-10)
- 🔧 **Refs cassees recurrentes — investigation** : a chaque session health-check revient DEGRADED avec 78-82 refs cassees. Hypothese 1 : cowork/ genere refs vers docs non existants (a exclure du ref-checker). Hypothese 2 : trou session-end — les docs ajoutes ne declenchent pas de MAJ index auto. Tache : a) modifier `scripts/ref-checker.sh` pour exclure `docs/travaux-cowork/`, b) identifier le trou dans session-end qui laisse passer les refs cassees, c) fixer le protocole pour zero dette structurelle. Kevin : prio apres finition DS Showcase. (2026-04-14)
- ❓ **Cowork : methodo ou produit ?** : Foundation OS = apprentissage methodologique ou produit Phase 5+ ? A trancher avant Sprint 1 Cowork. (S7)

## En attente Kevin

- **Push narratif Supernova** — 52 md prets dans `modules/design-system/docs-supernova/`. Import via UI Supernova (Option A, session dediee) OU verifier un chemin SDK programmatique. Requiert `SUPERNOVA_TOKEN`.
- Activer "Email confirmations" dans Supabase Auth (Dashboard → Authentication → Providers → Email). Pending depuis Phase 2.3.
- OMC update v4.11.6 (actuel v4.10.1, `omc update`). Lateral.
- Decision strategique Cowork : methodo ou produit ? (ref Idees & Parking)
- Decision strategique Phase 5 : quel module lancer ? Finance / Sante / Trading

## Decisions

> Decisions stables (> 30 jours ou supersedees) archivees dans `docs/decisions-log.md`.

| Decision | Date | Detail |
|----------|------|--------|
| D-DS-REBUILD Remplacement total shadcn | 2026-04-11 | Option C : supprimer ancien DS (tokens turquoise #5EEAD4 + 5 primitives hand-crafted), reconstruire from scratch depuis Figma Make `base DS/src.zip`. Dark-only, pas de compat layer, prefixe `--fos-*` a retirer (→ `--ds-*`, `--shadcn-*`). App a migrer direct (pas de shim). Nouveau palette Figma Make : ds-surface-{0..3}, ds-blue #60a5fa, ds-purple #c084fc, etc. Polices : Figtree + JetBrains Mono. Plan detaille `.archive/plans/2026-04-11-ds-shadcn-finition.md`. |
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
| App Builder | OK | 473 kB | 25 kB | 19/19 | 5 |
| Design System | OK | — | — | 23/23 | — |
| Storybook | OK (2.68s) | — | — | — | 46 stories DS + 9 app = 55 |

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
