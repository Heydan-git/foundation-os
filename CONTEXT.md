# Foundation OS — Contexte

> Source de verite operationnelle. Lu en debut de session, mis a jour en fin.
> Spec format : docs/core/communication.md

## Modules

| Module | Status | Path | Detail |
|--------|--------|------|--------|
| App Builder | ✅ iso base DS | `modules/app/` | Tous fichiers `.tsx` utilisent tokens `ds-*` (0 legacy). Build 281ms, 19/19 tests. Verif visuelle chrome-devtools : IndexPage + Commander + Knowledge iso base DS. |
| Design System | ✅ iso base DS | `modules/design-system/` | Rebuild complet DONE (plan `2026-04-14-ds-rebuild-from-base.md`). Phases 0-3b + 4-5 livrees : tokens primitives + semantic (dark-only), 46 composants ui copies iso, 7 patterns Dashboard + 46 stories individuelles Storybook (53 stories DS + 9 app = 62 total). Build-storybook OK 5.87s. |
| Core OS | 6/6 actif | `docs/core/` | Cortex, Communication, Monitor, Tools v2 (98 outils), Planner (/plan-os), Worktrees (feature Claude Code — isolation parallele, doc officielle integree) |
| Cowork | actif (non-branche) | `docs/travaux-cowork/` | Co-work Desktop + CLI. Non branche a /session-start /session-end |
| Plan-Router | PROPOSITION | `docs/travaux-cowork/` | 5 profils, 6 questions ouvertes bloquent execution |
| Finance | prevu | — | Pas encore cree |
| Sante | prevu | — | Pas encore cree |

## Sessions recentes

| Date | Resume |
|------|--------|
| 2026-04-15 | **[DONE] Migration Foundation OS → Claude Code Desktop natif (9 phases)** |
|            | Plan : `docs/plans/2026-04-15-migration-foundation-desktop.md`. 9 commits enchaines. |
|            | Phase 1 (`9598328`) clean debris : settings.local 159→71L + 4 branches mergees deletes + orphelin worktree 2Mo supprime. Phase 2 (`2c78655`) conventions nommage : nouveau spec `docs/core/naming-conventions.md` + hook branch-name-check.sh. Phase 3 (`14cc9f4`) worktrees actifs : scripts worktree-{new,clean,list}.sh + `/wt` command + integration cockpit. Phase 4 (`b6b2dd9`) `/plan-os` orchestrateur : route vers brainstorming/writing-plans/ralplan selon contexte + EnterPlanMode natif. Phase 5 (`10212ca`) TodoWrite systematique : regle CLAUDE.md + tasks pane peuplee. Phase 6 (`0660deb`) docs CLI→Desktop : setup-guide + architecture + index reecrits. Phase 7 (`4f81122`) baselines monitor + Planner+Worktrees ajoutes architecture-core. Phase 8 (`006aac0`) brief v11 source unique : 533→299L commands (gain 234L deduplication). |
|            | 8 memoires permanentes creees (`feedback_thinking_francais`, `feedback_plans_orchestrateur`, `feedback_sessions_nommage_planete`, `feedback_branches_convention`, `feedback_todowrite_systematique`, `feedback_worktrees_actifs`, `feedback_tout_automatique`, `project_migration_desktop`) + MEMORY.md index update. Auto-chargees chaque session. |
|            | Decisions : D-DESKTOP-01 (Foundation OS calibre Desktop natif), D-NAMING-01 (conventions unifiees), D-PLAN-02 (orchestrateur supersede D-PLAN-01). |
|            | Build app 338ms / 19/19 tests / typecheck 0 erreur. Refs cassees 30→43 (refs vers nouveaux fichiers post-creation, `ref-checker` resoudra apres /sync, hors blocant). |
|            | **Plus de noms aleatoires** : `claude/agitated-wilson` est la derniere branche claude/* (legacy). Toute nouvelle branche/worktree suit `<type>/<scope>-<desc>[-yymmdd]`. |
| 2026-04-15 | **[DONE_COTE_CLAUDE / EN_COURS_KEVIN] DS iso visuel + typography critique** |
|            | 3 causes racines identifiees via audit chrome-devtools MCP : (1) `--font-sans/--font-mono` non definis dans `@theme inline` → Figtree/JetBrains Mono pas charges, fallback ui-* serifs, (2) `cn()` tailwind-merge dedupliquait `text-ds-sm` (font-size) avec `text-ds-fg/60` (color) a tort, (3) `@layer base` forçait `font-size:var(--text-base)` undefined + `font-weight:medium` sur `h1-h4/label/button/input` cassant l'heritage. |
|            | Fixes : `globals.css` `@theme inline` + font tokens ; `utils.ts` `extendTailwindMerge` classGroups ds-* ; `@layer base` supprime les regles bruyantes ; `size-3_5` invalide -> `size-3.5` dans sheet/dialog/toggle ; calendar nav reposition ; resizable imports v9+ (Group/Panel/Separator) ; alert variant propagation ; RadioGroup label ds-fg/90|70. |
|            | Rewrite 46 composants ui iso template via 8 sub-agents paralleles : custom HTML (checkbox/switch/slider/radio-group) + tokens ds-* partout (plus de bg-primary/accent). Audit visuel chrome-devtools 27/46 composants ✓. |
|            | Commits : `7e7c41f` 4 form · `723fd5f` 46 ui · `f2f5790` typography · `3e1d9cf` calendar · `d266f37` resizable. |
|            | **En attente Kevin** : test manuel composant par composant (il verifiera 46 ui visuellement, iterations possibles sur bugs residuels). |
|            | Memoires ajoutees : `feedback_ds_true_iso.md`, `feedback_ds_reconstruction_protocole.md`, `feedback_subagents_context.md` (SUPERSEDE : sous-agents autorises AVEC contexte precis injecte). |
| 2026-04-14 | **[DONE] DS Rebuild iso base DS — phases 0-5 + 3b complet** |
|            | Plan : `docs/plans/2026-04-14-ds-rebuild-from-base.md`. 8 commits enchaines. |
|            | Phase 0 (`64d6baf`) archive · Phase 1 (`ccd3e01`) tokens 2-couches · Phase 2 (`ea1e48b`) 46 ui · Phase 3a (`8bacea7`) 7 patterns · Phase 4a (`7638b5c`) IndexPage ds-* · Phase 4b (`100120e`) app-wide sed 47 rempl. sur 12 fichiers · Phase 5 (`b518083`) verif chrome-devtools 3 pages iso · Phase 3b (ce commit) 46 stories UI individuelles via script `/tmp/gen-stories.py`. |
|            | Build app 281ms / 19/19 tests. DS typecheck 0 erreur / build-storybook 5.87s. 0 legacy token `-{color}-NNN` dans app. 62 stories total (53 DS + 9 app). |
| 2026-04-14 | **[DONE] Supernova 46 Components SDK + sync auto** (`2c9403d`) |
|            | 46 composants via `sn.components.createComponent()` visibles UI Supernova. GitHub Action sync push main DS. Plan Free = 20 doc pages max. 52 md narratifs disponibles pour upgrade plan. Asana setup cloture, projet Build cree. Kevin : rotater `SUPERNOVA_TOKEN`. |
| 2026-04-14 | **[SUPERSEDED] DS Void Glass 11 atoms** — abandonne par decision Kevin (`d620c4f`). Remplace par DS Rebuild iso base DS. Commits conserves pour historique. |
| 2026-04-14 | **[DONE] Supernova live + Storybook 9.1.20 + refs 81→0** (`4a57db5`+`06afda1`) |
|            | Workspace 735528/DS 790241, 197 tokens DTCG, 154 stories. Fix SB runtime Vite 8 incompat. URL : storybook.supernova.io/design-systems/790241/alias/foundation-os-ds. |
| 2026-04-14 | **[DONE] Storybook S2 + bloc8 — 27 stories + audit etats**. 55 stories total. Blocage Asana/Notion (blocs 13-15) = OK ecriture externe Kevin. |
| 2026-04-13 | **[DONE] Storybook S1 blocs 1-3** (19 stories Form + Feedback). `b36cbe0` |
| 2026-04-13 | **[DONE] DS finition F8-F9** (biome v2.4, 23 tests DS, audit 46 composants). `d0217a8`+`e671ca8` |
| 2026-04-13 | **[DONE] App UI refactor Figma Make** (DashboardLayout + pages glass, cleanup TabBar/Layout/Navbar/StatsBar). `436de80`+`5418f35` |
| 2026-04-13 | **[DONE_WITH_CONCERNS] DS finition F1-F7** (tokens primitives+semantic+bridge, app migree, prefixe fos retire). |
| 2026-04-11 | **[DONE] DS shadcn rebuild + Planner MVP + Worktrees + Tools v2** (sessions enchaines). `a6f37a2`+`6413ac9`+`962c174`+`40e197c` |
| 2026-04-10 | **[DONE] Audit Core OS + Cockpit + Communication v1**. `21354c9`/`7cbb391`/`18079d0` |

> Sessions plus anciennes (S0-S14, Cycle 3 audit + Design System + Monitor Dashboard + Cycles 1-2) disponibles via `git log` et `.archive/audit-massif/23-rapport-final.md`.

## Cap

**Direction** : Migration Foundation OS → Claude Code Desktop natif DONE (9 phases). Foundation OS exploite maintenant pleinement les features natives Desktop (plan window UI, tasks pane, worktrees, sessions auto-nommees 🪐). DS iso visuel cote Claude toujours DONE, test manuel Kevin en cours.

**Prochaine action** :
  - **Validation Kevin migration Desktop** : tester le nouveau workflow sur une vraie tache (`/cockpit` puis `/plan-os "<demande>"` puis verifier que session se renomme automatiquement au format 🪐 dans la sidebar Desktop).
  - **Test manuel DS composants** (en parallele) : 46 ui Storybook, parcourir composant par composant pour bugs residuels.
  - **Level up memoire** (si Kevin veut continuer cette piste) : discussion ouverte. Options : hot cache, tiering, external MCP, tags+versioning. A brainstormer.
  - **Ensuite** : Expansion Phase 5 (Finance / Sante / Trading).

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

- **Test manuel DS composants** : 46 ui Storybook, parcourir composant par composant pour bugs residuels (http://localhost:6006). Claude attend feedback pour iterations ciblees.
- **Design level up memoire** : choisir direction (hot cache / tiering / external MCP / tags-versioning / autre) pour prochaine session.
- Activer "Email confirmations" dans Supabase Auth (Dashboard → Authentication → Providers → Email). Pending depuis Phase 2.3.
- OMC update v4.11.6 (actuel v4.10.1, `omc update`). Lateral.
- Decision strategique Cowork : methodo ou produit ? (ref Idees & Parking)
- Decision strategique Phase 5 : quel module lancer ? Finance / Sante / Trading

## Decisions

> Decisions stables (> 30 jours ou supersedees) archivees dans `docs/decisions-log.md`.

| Decision | Date | Detail |
|----------|------|--------|
| D-DESKTOP-01 Foundation OS calibre Claude Code Desktop | 2026-04-15 | Migration de tout le workflow OS pour exploiter les features natives Desktop : plan window UI (`/plan-os` orchestrateur via EnterPlanMode), tasks pane (TodoWrite systematique, regle CLAUDE.md), worktrees actifs (`/wt new|list|clean` + integration `/cockpit`), sessions auto-nommees format `🪐 <mini-detail> (DD-MM-YYYY)` via titre plan. Plan : `docs/plans/2026-04-15-migration-foundation-desktop.md`. 9 phases, 9 commits. |
| D-NAMING-01 Conventions nommage unifiees | 2026-04-15 | Spec `docs/core/naming-conventions.md` (source unique). Branches `<type>/<scope>-<desc>[-yymmdd]`. Worktrees `wt/<desc>-<yymmdd>` via `/wt new`. Sessions `🪐 <mini-detail> (DD-MM-YYYY)` via titre plan + auto-rename Desktop. Plans `docs/plans/YYYY-MM-DD-<slug>.md`. Hook `branch-name-check.sh` warning si hors format. |
| D-PLAN-02 /plan-os orchestrateur skills | 2026-04-15 | `/plan-os` n'est plus un wrapper unique. Devient orchestrateur intelligent qui route vers le meilleur skill selon contexte (`superpowers:brainstorming` ambiguite, `writing-plans` multi-phase, `oh-my-claudecode:ralplan` consensus, etc.) puis finalise toujours via `EnterPlanMode` natif + dual-path versionnement. Skills tiers gardes intacts (Kevin a explicitement refuse leur suppression). Spec : `docs/core/planner.md`. Supersede D-PLAN-01. |
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
