# Foundation OS — Contexte

> Source de verite. Lu en debut de session, mis a jour en fin.

## Modules

| Module | Status | Detail |
|--------|--------|--------|
| App Builder | production-ready | 8 routes, Navbar 4 items, KnowledgePage integree, 0 artifact JSX, Vitest 19 tests, build 862ms |
| Core OS | 4/4 actif | Cortex (routing), Memory (tiers), Monitor (health), Tools (automation). Specs : docs/core/ |
| Finance | prevu | Pas encore cree |
| Sante | prevu | Pas encore cree |

## Dernieres sessions

| Date | Resume |
|------|--------|
| 2026-04-08 | **Cycle 3 — S3 Fondations Core OS DONE (mode MOI strict)**. Sur branche `audit-massif-cycle3`. 6 phases anti-compactage A-F (Read parallele 5 specs Core OS, Read v2-design + decisions-log, test reel 4 piliers, cross-ref S2, livrable, commit). **17 fichiers lus / ~1700L scannees** (cortex.md 97L, memory.md 103L, monitor.md 93L, tools.md 83L, architecture-core.md 61L, v2-design 324L, decisions-log 44L, CONTEXT/CLAUDE/MEMORY/index, review-agent + 3 frontmatters agents, health-check.sh 172L, commit-msg + pre-commit, S2 inventaire). **Verdict 4 piliers : tous REELS** — Cortex (routing via CLAUDE.md + frontmatters Declencheurs des 4 agents, source unique cortex.md L11-14), Memory (CONTEXT.md + docs/ + auto-memory 7 entries dans MEMORY.md + decisions-log.md 17 archivees, max 15/9 actives respecte), Monitor (health-check.sh = **11/12 indicators implementes**, le 12e "CONTEXT.md a jour" delegue a sync-check.sh), Tools (10/10 outils confirmes filesystem : 2 validators + 4 scripts + 2 git hooks + 2 CI). Coherence S2 ↔ Core OS specs : **0 trou d'inventaire** (4 agents + 4 commands + 8 scripts + 2 CI tous mappes). **9 findings** : 0 P1, 1 P2 (F-S3-01 CLAUDE.md L95-96 liste outils Tools obsolete : ref-checker dans backlog alors que construit, sync-check.sh + module-scaffold.sh + pre-commit manquants → fix S20), 8 P3 (F-S3-02 tools.md L27 path .git/hooks/commit-msg incorrect, F-S3-03 ambiguite double-namespace "Phase X" architecture-core vs v2-design, F-S3-04 mismatch seuil Build time monitor.md 2000ms vs health-check.sh 1500ms, F-S3-05 indicateur MD pairs trop specifique modules/app, F-S3-06 review-agent.md L23 cite .git/hooks/commit-msg duplique de F-S2-07, F-S3-07 CLAUDE.md Reference section incomplete 1 plan listed sur 7+, F-S3-08 plan S3 dit "6 entries" auto-memory realite 7, F-S3-09 settings.local.json bloat non-resolu duplique F-S2-06). 0 fix applique en S3 (mode doc-only). **5 decisions D-S3-01..05** dont D-S3-04 "Cortex = convention de prompt pas de runtime separe" et D-S3-05 "build time seuil derive 1500 vs 2000 → decision Kevin S22". **6 learnings metaboliques L-S3-01..06** dont L-S3-02 "code health-check.sh = materialisation monitor.md, faire le diff systematique" et L-S3-05 "CLAUDE.md vit moins bien que docs/index.md → CLAUDE.md devrait pointer vers index.md pour listes evolutives". Mode MOI strict respecte (0 sub-agent invoque). Health SAIN maintenu (build 830ms, refs 66/66, vitest 19/19). Zero regression. Livrable `docs/audit-massif/03-fondations-core.md` (493L). Prochaine : S4 architecture orga/scalabilite/maintenabilite (mode MOI). |
| 2026-04-07 | **Cycle 3 — S2 Inventaire components DONE (mode MOI)**. Sur branche `audit-massif-cycle3`. 6 phases anti-compactage A-F (Read parallele agents+commands, smoke tests batch scripts, hooks refs settings.json, CI workflows, livrable, commit). Inventaire complet : **4 agents** (`.claude/agents/*.md` 193L total : os-architect 50L, dev-agent 52L, doc-agent 51L, review-agent 40L) + **4 commands** (`.claude/commands/*.md` 211L total : session-start 30L, session-end 53L, new-project 49L, sync 79L) + **8 scripts** (`scripts/*.sh` 731L + `scripts/hooks/` 318L + `scripts/git-hooks/` 39L = **1088L**) + 2 hooks PreToolUse declenches via `.claude/settings.json` matcher Write\|Edit\|MultiEdit + 0 skill custom + 7 MCP connectes + 2 CI workflows (ci.yml 35L, supabase-ping.yml 27L). **Smoke tests 8/8 PASS** : `bash -n` x6 + `python -m py_compile` x1 + `--help` x2 (ref-checker, module-scaffold). Matrice delegation agents 4×3 complete (zero trou). Coherence command→script 4/4. **9 findings** : 0 P1, 1 P2 (F-S2-08 paths absolus `/Users/kevinnoel/...` dans settings.json hooks → non portable, fix S21), 3 P3 (F-S2-04 6 .DS_Store tracked malgre .gitignore, F-S2-06 ~50 entries bloat settings.local.json, F-S2-09 .pyc local — informatif), 4 imprecisions docs (F-S2-01 plan disait "9 scripts" vrai=8 → fix docs-only applique D-S2-01, F-S2-02/03 frontmatter agents/commands minimal mais intentionnel, F-S2-07 review-agent.md cite .git/hooks au lieu de scripts/git-hooks). **5 decisions D-S2-01..05** + 1 fix docs-only trivial applique sur plan cycle3 ("9 scripts"→"8 scripts"). **7 learnings metaboliques L-S2-01..07** dont substitution `--help` par `bash -n`+`py_compile` comme smoke test universel, pattern decoupage 6 phases A-F a repeter pour S3-S18, et L-S2-07 (interaction ref-checker vs paths inexistants documentes : utiliser texte plain au lieu de backticks). Mode MOI strict respecte (0 sub-agent invoque). Health SAIN maintenu, zero regression. Livrable `docs/audit-massif/02-inventaire-components.md` (277L). Prochaine : S3 fondations Core OS (mode MOI, lecture deep docs/core/). |
| 2026-04-07 | **Cycle 3 — S1 Carto repo DONE (mode MIX)**. 100 fichiers cartographies / 11 567 lignes scannees (App src 42/4755L, App root 13/213L COMBLE EN SESSION, Infra 21/1959L, Docs 23/4631L, racine 1/9L). Phase A : 3 sub-agents Explore en parallele (modules/app/src, infra, docs+racine). Phase B : verification integrite outputs (formats OK). Phase C : consolidation MOI + **re-verification critique des findings cross-fichier** suite aux 4 nouveaux imperatifs ajoutes en cours de S1 (decoupage anti-compactage, cause racine, pragmatisme, sub-agents contexte non necessaire). 3 findings sub-agents corriges : SA#3 design-system+manifeste "orphelins" → FAUX (12 refs verifiees), SA#3 total plans 2756L → FAUX (vrai = 2956L), SA#2 commit-msg non-exec → VRAI (fix applique). 1 fix trivial applique (D-S0-08) : `chmod +x scripts/git-hooks/commit-msg` (cause racine : chmod oublie au commit audit OS profond). Gap couverture detecte : briefs sub-agents avaient exclu modules/app/ root (13 fichiers configs) → comble en Phase C par MOI. Livrable `docs/audit-massif/01-carto-repo.md` (346L) avec 9 sections : objectif, methodo, carto consolide 4 zones, findings (F-S1-01..12 dont 1 fix applique + 3 corriges + 5 reportes en S3/S13), 5 decisions D-S1-01..05, refs, OOS, next S2, learnings metaboliques L-S1-01..07. CLAUDE.md enrichi : 7→11 imperatifs (4 ajoutes en S1). Auto-memory `feedback_subagents_context.md` enrichi avec regle re-verification cross-fichier. Health SAIN maintenu (build 822ms, refs 65/65, vitest 19/19, decisions datees 9). Zero regression. Prochaine : S2 inventaire components + smoke tests (mode MOI). |
| 2026-04-07 | **Cycle 3 — S0 pre-flight DONE**. Sur branche `audit-massif-cycle3` (creee depuis main@a8519c8), tag baseline `pre-audit-cycle3` pose. Baseline capturee : health SAIN (build 875ms), sync 6/6 SAIN, refs 0/65 cassees, vitest 19/19 (1.35s), build 870ms (107 modules, JS 457.15kB / CSS 17.22kB). 2 warnings Vite deprecation (esbuild→oxc, optimizeDeps→rolldown) flaggees pour S14. Livrable `docs/audit-massif/00-preflight.md` ecrit (8 sections, 3 captures metrics, 5 decisions operationnelles + 4 decisions directive meta). **Directive Kevin mid-S0** : "nourrir l'audit pour ameliorer le fonctionnement de l'OS" integree via 4 decisions D-S0-06..09 : (1) section "Learnings metaboliques" ajoutee a chaque livrable, (2) auto-memory maj en post-session ritual, (3) fixes docs-only triviaux autorises en continu, (4) rapport S23 enrichi section "OS-learnings". Zero fichier code modifie. Prochaine : S1 carto repo (mode MIX). |
| 2026-04-07 | **Cycle 3 — Audit Massif Final : preparation/brainstorming complete**. Demande Kevin d'audit le plus massif et final couvrant 100% Foundation OS. Brainstorming via skill `superpowers:brainstorming` execute en 8 questions Q1-Q8 toutes repondues. Decisions cles : (Q1) audit + execution multi-sessions, (Q2) refonte moderee, (Q3) recherche externe DEEP, (Q4) branche dediee `audit-massif-cycle3` + PR finale, (Q5) 12 SUGG-X gardees, (Q6) granulaire 8-12+ sessions courtes, (Q7) lecture exhaustive + tests fonctionnels reels, (Q8) Approche D Maximum revisee = 24 sessions S0-S23. Contrainte sub-agents : reserves aux taches isolees (5 sessions sur 24), MOI directement pour 19 sessions necessitant contexte global. Spec complet ecrit dans `docs/plans/2026-04-07-audit-massif-final.md` (420L) avec : demande verbatim, decisions Q1-Q8, plan 24 sessions detaille (3.1 vue / 3.2 decoupage / 3.3 go-no-go / 3.4 livrables / 3.5 anti-compactage / 3.6 sub-agents / 3.7 gates Kevin / 3.8 commits), procedure reprise post-compactage, section 6 live tracking 24 sessions PENDING. Auto-memory mise a jour : `feedback_subagents_context.md` (regle sub-agents). Sessions execution : pas encore demarrees, attente review Kevin du spec puis invocation `superpowers:writing-plans`. Branche pas encore creee, fixes pas encore appliques, zero regression. |
> 8 sessions plus anciennes (Cycle 2 audit complet post-compactage, Cycle 2 partiel STOP, Audit OS profond execute, Plan Finition OS, Dette Tools cloturee, Chantier OS suite, Affinement Foundation OS, Phase 4 Monitoring) sorties de la vue chaude pour respecter le max 5 du protocole Memory. Restent disponibles via `git log` et docs/decisions-log.md.

## Cycle 3 progress

Branche : `audit-massif-cycle3` | Tag baseline : `pre-audit-cycle3` (a8519c8) | Plan : `docs/plans/2026-04-07-cycle3-implementation.md` | Livrables : `docs/audit-massif/`

| Session | Status | Mode | Livrable |
|---------|--------|------|----------|
| S0 Pre-flight | DONE 2026-04-07 | MOI | 00-preflight.md |
| S1 Carto repo | DONE 2026-04-07 | MIX | 01-carto-repo.md (346L, 100 fichiers / 11 567L baseline) |
| S2 Inventaire components | DONE 2026-04-07 | MOI | 02-inventaire-components.md (277L, 4+4+8 components / 1554L scannes / 9 findings) |
| S3 Fondations Core OS | DONE 2026-04-08 | MOI | 03-fondations-core.md (493L, 4 piliers REELS / 17 fichiers / 1700L / 9 findings / 1 P2) |
| S4-S23 | PENDING | voir plan | voir plan |

Directive meta Kevin (2026-04-07 mid-S0) : "nourrir l'audit pour ameliorer le fonctionnement de l'OS" → 4 decisions integrees dans `docs/audit-massif/00-preflight.md` section 4.2 (learnings metaboliques par session, auto-memory continue, fixes docs-only triviaux OK, rapport S23 section OS-learnings).

## Prochaine action
1. **Cycle 3 — S4 Architecture organicite/scalabilite/maintenabilite** (mode MOI). Sur branche `audit-massif-cycle3`. Tasks : (S4.2) audit organicite — deps agents/commands/scripts, deps docs cross-refs, code mort potentiel ; (S4.3) audit scalabilite — exercice mental "1 module → 5 → 10 modules : qu'est-ce qui casse ?" (auth, db, deploy, ci, navigation), F-S3-05 indicateur MD pairs trop specifique modules/app a traiter ici ; (S4.4) audit maintenabilite — stat code/doc ratio, gros fichiers >500L, doublons, dette TODO/FIXME/HACK. Pre-conditions : S3 commit valide + baseline SAIN + clarifier les 2 fichiers untracked (`docs/audit-massif/read-log-S1-code.md`, `docs/foundation-os-manifeste-realiste.pdf`). Livrable : `docs/audit-massif/04-architecture-orga.md`. Plan : `docs/plans/2026-04-07-cycle3-implementation.md:485-522`.
2. **Phase 5 Expansion** (apres Cycle 3 S23 + G3 merge) : Choisir module Finance / Sante / Trading. Ref : `docs/specs/2026-04-05-foundation-os-v2-design.md` section Phase 5.

### Actions manuelles Kevin (hors code)
- Activer "Email confirmations" dans Supabase Auth settings (UI Supabase Dashboard → Authentication → Providers → Email → Confirm email). Pendant depuis Phase 2.3.
- OMC update disponible v4.10.1 → v4.11.0 (`omc update`). Lateral, pas urgent.

## Decisions actives

> 17 decisions stabilisees (7 du 2026-04-01 + 10 specs/phases/livrables) archivees dans `docs/decisions-log.md` (toujours actives, sorties de la vue chaude — protocole Memory).

| Decision | Date | Detail |
|----------|------|--------|
| Dashboard | 2026-04-05 | Commander evolue vers monitoring Core OS (futur) |
| BMAD garde | 2026-04-07 | _bmad/ reste dormant (overrule Kevin sur verdict audit ARCHIVER). |
| Code review | 2026-04-07 | review-agent custom = outil principal. Coderabbit / code-review Anthropic / OMC code-reviewer = installes mais non invoques. |
| Affinement OS | 2026-04-07 | 3 phases desyncs/dedup Core OS + agents/commands + audit (commits 3d3cae2, b8b33a9, 8ab0844, 73dc63b). Decisions-log cree, MD first supprime, data/ figes. |
| Chantier OS suite | 2026-04-07 | sync-check.sh executable (180L, 5 checks auto, 5/6 sections /sync automatisees) + vitest integre pre-commit (DEGRADED si fail). Commits 39b85f6, de19c2c, 6d4e1b0. |
| Finition OS plan | 2026-04-07 | 3 sessions programmees pour cloturer dette Tools + housekeeping avant Phase 5. Plan : `docs/plans/2026-04-07-finition-os.md`. S1 sync-check 6/6, S2 ref-checker, S3 polish + decisions-log. |
| Audit OS profond | 2026-04-07 | 24 etapes A0-A9 + T1-T10 + P1-P3 executees en 1 session. 13 fixes appliques (5 P1 critiques + 6 P2 importants + 2 P3 cosmetiques). health-check enrichi (refs intactes via ref-checker, build time WARN >1500ms, decisions regex Y2027-safe). validate-void-glass case-insensitive. commit-msg etend a 11 types via scripts/git-hooks/commit-msg version-controlled. ci.yml + supabase-ping timeouts. Verdict SAIN, zero regression fonctionnelle. Decouverte : 21 commits ahead origin/main. |
| Compactage → re-audit | 2026-04-07 | Si la conversation Claude approche du compactage (perte de contexte risquee), refaire un cycle complet d'audit + test (A0-A9 + T1-T10) pour rebatir un baseline propre avant de continuer. Permet de detecter toute regression introduite avant la perte de contexte et de garantir que CONTEXT.md reflete l'etat reel. |
| Regles meta OS | 2026-04-07 | 3 imperatifs ajoutes dans CLAUDE.md : (1) decoupage phases/sessions systematique anti-compactage, (2) cause racine obligatoire avant fix, (3) actions pragmatiques + conscience limites (dire "je ne peux pas" plutot que faire semblant). Directive Kevin mid-session avant Cycle 3 S1. |

## App Builder — Etat technique

- **Routes** : / (index), /commander, /knowledge, /dashboard, /crud-test, /phase1-demo, /login, /reset-password
- **Build** : OK (854ms, JS 457.15kB / CSS 17.22kB, 107 modules) — sous seuils 600KB/40KB
- **Tests** : 19 (6 fichiers : app, supabase, mutations, useCommander, AuthContext, forms)
- **Navbar** : sticky top, NavLink active state (Home / Commander / Knowledge / Dashboard), bouton deconnexion integre
- **Artifacts JSX** : 0 dans src/artifacts/ (supprime). Tous archives dans `.archive/artifacts-jsx/` (7 fichiers)
- **Deploy** : https://foundation-os.vercel.app/ (root dir modules/app, live)
- **DB** : Supabase, 6 tables (sessions, decisions, risks, next_steps, context_blocks, docs)
- **MD pairs** : 7 dans data/ — alignes avec .archive/artifacts-jsx/ (7/7)
- **Refs stales** : 0 confirmed via `bash scripts/ref-checker.sh` (baseline 0, 38 .md scannes full-repo, code-block aware)

## MCP — Comptes connectes

| Service | ID / Info |
|---------|-----------|
| Asana | workspace: 1213280972575193, user: kevin.noel.divers@gmail.com |
| Notion | user: 4f1b99db-9655-40a7-b59a-a9e8af210dfb |
| Figma | disponible |
| Monday.com | disponible |
| Gmail | Auth requise |

## Outils installes

- **Claude Code** : CLAUDE.md v2 (868 mots, imperatifs integres, tables Core OS condensees vers specs) + 4 agents + 4 commands + 2 hooks PreToolUse (Void Glass + security) + 1 git hook (pre-commit)
- **CI** : GitHub Actions (Node 24, build + TS + tests sur push) + supabase-ping (cron hebdo)
- **Tests** : Vitest 19 tests, 6 fichiers (app, supabase, mutations, useCommander, AuthContext, forms) + health-check.sh (Monitor + vitest) + sync-check.sh (/sync audit 6/6 sections auto, fonts Void Glass inclus) + ref-checker.sh (full-repo broken refs detector, baseline 0)
- **OMC** : oh-my-claudecode (team, autopilot, ralph, ultrawork, etc.)
- **Superpowers** : v5.0.7 (TDD, brainstorming, executing-plans, verification)
- **gstack** : ~/.claude/skills/gstack/ (qa, cso, careful, freeze, guard, ship)
- **BMAD v6** : _bmad/ (12 modules, dormant — audit Phase 3 DONE, voir docs/tools-audit.md)
- **MCP** : Notion, Asana, Figma, Monday, ClickUp, Computer Use, Context7

## Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Supabase pause 7j inactif | low | GitHub Actions cron ping hebdo |
| Vercel deploy casse | medium | Changer root dir vers modules/app |
