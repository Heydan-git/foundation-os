# Foundation OS — Contexte

> Source de verite operationnelle. Lu en debut de session, mis a jour en fin.
> Spec format : docs/core/communication.md

## En bref (pour Kevin)

Foundation OS = OS travail IA + second-brain. **10 modules Core OS** + projets metier (App Builder, Design System, Trading v1). **1 seule session a la fois** (D-NO-MULTI-SESSION-01 du 2026-04-20). **Tout ce que je te dis est maintenant vulgarise de bout en bout** (D-VULGARIZE-01 du 2026-04-20 : regle ancree dans 13 endroits + garde-fou automatique `scripts/vulgarization-check.sh`).

**Prochaines actions** : (1) executer **D-PRODUCT-02** plan pret (rendre le PO Notion autonome), (2) finir projet **Gmail centralisation** (3 boites → 1), (3) deployer **Morning Intelligence v3** scheduled task (tache programmee qui lance le briefing matinal).

## Modules

| Module | Status | Path | Detail |
|--------|--------|------|--------|
| App Builder | ✅ Void Glass dark-only | `modules/app/` | Tokens `ds-*` partout. Build ~250ms, 15/15 tests. 6 routes. |
| Design System | ✅ Void Glass fork base DS | `modules/design-system/` | Rebuild 2026-04-15. 46 ui + 7 patterns + 62 stories Storybook. |
| Core OS | 10/10 actif | `docs/core/` | Cortex/Communication/Monitor/Tools/Planner/Worktrees/Knowledge/Body/Product/Model + Cockpit orchestrateur. |
| Knowledge | ✅ Phase 7 | `wiki/` | 113 pages filesystem main. Plugin claude-obsidian v1.4.3. 5 domaines + 7 cross-domain. |
| Body | ✅ COMPLET 5/5 | `docs/core/body.md` | 8e Core OS Proprioception Kevin-Claude. Constitution 41 P-XX + intent capture + subagent alignment-auditor. |
| Product | ✅ COMPLET 5/5 | `docs/core/product.md` | 9e Core OS — Integration FOS ↔ Notion only (pivot Asana abandonne). Agent po-agent + skill /po + 4 DB. |
| Model | ✅ COMPLET | `docs/core/model.md` | 10e Core OS — conscience modele (Opus 4.7 1M context). |
| Cowork | actif | `docs/travaux-cowork/` | Co-work Desktop + CLI. Plusieurs projets en cours (Gmail centralisation + Morning Intelligence v3 + Dashboard Monitoring). |
| Trading | ✅ v1.1 | `modules/finance/trading/` | Python 3.12 + Pine v5 bridge + 3Commas webhook FastAPI + Nautilus skeletons + 5 strategies. **94/94 tests** + ruff/mypy strict + CI GH Actions. Nautilus full V1.2 : [[spec roadmap]]. |
| Finance Patrimoine | prevu | — | Phase 5 |
| Sante | prevu | — | Phase 5 |

## Sessions recentes (max 5)

| Date | Resume |
|------|--------|
| 2026-04-20 | **[DONE] D-VULGARIZE-01 Vulgarisation integrale briefs ancree racine OS (Opus 4.7, ~2h, 2 commits)** Kevin alerte : "je comprends rien a tes briefs, c'est ca qui saoule, ancre-le dans la racine OS". Audit complet + codification en 13 endroits + garde-fou automatique. E9 (commit `673aace`) : CLAUDE.md + communication.md 6.0 + P-42 constitution + 4 commands principaux + lesson wiki + memoire auto. E10 (commit `dc3d9ae`) : 6 agents + 4 commands restantes + 2 templates + `scripts/vulgarization-check.sh` chain health-check. Script detecte 28 violations sur 4 briefs actuels (baseline). Non-regression verifiee. |
| 2026-04-20 | **[DONE] Reality Check + cleanup multi-session (Opus 4.7, ~4h, 10 commits)** Audit factuel apres alerte Kevin "travail perdu". 2 branches non-mergees retrouvees (D-CCCONFIG-01 + nice-mayer drifts) + 6 dirs cowork untracked commits (Gmail, Morning Intel, briefs). Wiki 86 → 113 pages. 12 refs cassees → 0. Regle **D-NO-MULTI-SESSION-01**. Rapport : `docs/audits/2026-04-20-reality-check/rapport.md`. |
| 2026-04-19 (recup 2026-04-20) | **[DONE] D-CCCONFIG-01 + Batch Alim 11 refs externes** (Opus 4.7, 13 commits, session perdue retrouvee 2026-04-20) Durcissement config Claude Code : bash-firewall hook + deny list + tools frontmatter + CLAUDE.local.md. Wiki 48→94 pages (awesome-claude-code, claude-howto, Ultraplan, Paperclip, RTK, UI UX Pro Max v2.5.0, 6 libs shadcn, prediction markets). Integre main via Option C (47 files A). |
| 2026-04-19/20 | **[DONE] D-AUDIT-TOTAL-01 COMPLET 14/14 + D-MODEL-01** (Opus 4.7 1M context, ~10h, 15+ commits) Audit exhaustif 11 axes. Creation 10e module Core OS "Model Awareness". 15 ameliorations mesurables. Rapport master 324L + 11 findings-Px : `docs/audits/2026-04-19-audit-total-foundation-os/`. Plan archive `.archive/plans-done-260420/`. |
| 2026-04-19 | **[DONE] D-TRADING-01 Backtest engine crypto v1 + V1.1 extension** (Opus 4.7, 8 phases, 27+ commits subagent-driven) Socle trading + 5 strategies (EMA cross + Donchian + RSI + Multi-TF + Bollinger) + harnesses anti-biais (WF/PurgedCV/MC/PBO/DSR) + Pine + 3Commas + Nautilus skeletons. 94/94 tests, cov 86%. Plan : `.archive/plans-done-260420/2026-04-19-finance-trading-backtest-engine.md`. |
| 2026-04-19 | **[DONE] D-PRODUCT-01 COMPLET 5/5 + D-BODY-01 COMPLET 5/5 + D-CONCURRENCY-01** Modules Body (41 P-XX constitution + intent + alignment-auditor) + Product (Integration FOS ↔ Notion only, pivot P1.5 Asana abandonne, 4 DB + views kanban + hooks opt-in) + Concurrency (B-lite YAGNI). |
> Sessions anterieures (2026-04-18 D-INTEG-01, 2026-04-17 mapping refactor + cleanup + audit v2 S3, 2026-04-16 mega audit V2 + hygiene OS, 2026-04-15 migration Desktop + wiki adoption D-WIKI-01 + level up, DS rebuild + cycle 3 + Storybook S1/S2) : voir `git log` + `.archive/plans-done-*/`.

## Cap

**Direction** : Multi-session abandonne 2026-04-20 apres regression memoire (2 sessions perdues retrouvees). 10 modules Core OS livres, architecture SAIN. Projets Cowork actifs (Gmail centralisation + Morning Intelligence v3). Phase 5 Trading mergee main.

**Prochaine action** (Kevin decide) :
- **A** — **Executer D-PRODUCT-02 Module Product Autonomie** (plan pret `docs/plans/2026-04-19-product-autonomie.md`, 5 phases 15-20h, passage "sync surface" → "PO vit le projet en continu")
- **B** — Continuer **projet Gmail centralisation** (Phase D : Kevin reactive MCP Gmail sur principale, puis Phase E-F labels + script briefing)
- **C** — **Morning Intelligence v3** deploiement scheduled task cron 0 9 * * *
- **D** — Test live D-BODY-01 alignment-auditor (Phase E pending)
- **E** — Test live D-PRODUCT-01 PRODUCT_MCP_SYNC=1
- **F** — OMC update v4.10.1 → v4.13.0
- **G** — Candidate D-ENFORCE-01 11e Core OS (pattern declaratif enforcement)
- **H** — Cleanup worktree lucid-moore (session reality-check terminee)

**Reporte V1.2+ Trading** : Nautilus migration complete (roadmap `docs/superpowers/specs/2026-04-19-nautilus-v12-roadmap.md` 263L, 11-16 sessions prerequis). **V1.2+** : 3Commas maison. **V1.3+** : Finance Dashboard Maison.

## Idees & Parking

- 💡 **D-ENFORCE-01 candidate** : pattern declaratif non-enforced (5 modules) → candidat 11e module Core OS enforcement runtime.
- 💡 Agent SDK Anthropic : explorer formalisation Cortex en natif. Pre-requis : SDK mature.
- 💡 MCP custom CONTEXT.md : anti-compactage via contexte a la demande.
- 🔮 *modules/shared* : extraction auth+DB quand 2e module (futur, pas encore cree).
- ❓ **Cowork** : methodo ou produit ? A trancher avant Sprint 1.

## En attente Kevin

- **Test live D-BODY-01** (alignment-auditor au prochain `/plan-os` reel + Phase 7bis 4 questions + tuile brief v12 #14).
- **Test live D-PRODUCT-01** (activer `PRODUCT_MCP_SYNC=1` + observer hooks SessionStart/End reels + pull Notion reel).
- **Test manuel DS composants** : 46 ui Storybook (http://localhost:6006).
- **Validation workflow Desktop** : tester /cockpit + /plan-os sur vraie tache.
- **Decision Phase 5** : Finance Patrimoine / Sante — lequel lancer ?
- Activer "Email confirmations" dans Supabase Auth.
- **OMC update v4.13.0** (actuel v4.10.1, 3 versions retard).
- **Kevin reactive MCP plugin_design_gmail** sur principale pour projet Gmail centralisation Phase D.

## Decisions

> Decisions stables (> 30 jours ou supersedees) archivees dans `docs/decisions-log.md`.

| Decision | Date | Detail |
|----------|------|--------|
| D-VULGARIZE-01 | 2026-04-20 | **Vulgarisation integrale briefs ancree racine OS**. Regle : TOUT document produit pour Kevin (brief, rapport, audit, plan, message chat, update CONTEXT.md/hot.md) vulgarise **de bout en bout**, pas juste la section "En bref" en tete. Raison : piege observe 2026-04-20 `/session-start` (En bref OK, 14 tuiles suivantes en jargon brut, Kevin : "je comprends rien"). Codification 13 endroits : CLAUDE.md + communication.md 6.0 (principe + regles + table par tuile + check-list + exemples) + P-42 constitution + 8 commands (.claude/commands/) + 6 agents (.claude/agents/) + 2 templates (plan + audit) + lesson wiki + memoire auto. Garde-fou auto : `scripts/vulgarization-check.sh` chain health-check. Commits : `673aace` (E9) + `dc3d9ae` (E10). |
| D-NO-MULTI-SESSION-01 | 2026-04-20 | **Arret multi-session**. Regle : 1 session a la fois. Raison : 2 sessions perdues (D-CCCONFIG-01 + nice-mayer) decouvertes par audit reality-check 2026-04-20 (desync memoire main garantie si >=2 worktrees paralleles). Spec : `wiki/meta/lessons-learned.md` section "Multi-session = regression memoire". Supersede partiellement D-CONCURRENCY-01 (cloture serie → cloture unique). |
| D-CCCONFIG-01 | 2026-04-19 | **Durcissement config Claude Code** (recupere 2026-04-20 via cherry-pick Option C depuis `claude/determined-torvalds-903dc3`). 4/6 gaps : `scripts/hooks/bash-firewall.sh` hook PreToolUse Bash exit 2 patterns destructifs (rm -rf /, push --force, dd, mkfs), deny list stricte `.claude/settings.json`, `tools:` frontmatter 4 agents FOS restrictions, CLAUDE.local.md template + `.gitignore`. + Batch alim 11 refs externes wiki (48→94 pages : awesome-claude-code + claude-howto + Ultraplan + Paperclip + RTK + UI UX Pro Max v2.5.0 + 6 libs shadcn + prediction markets Polymarket/Kalshi + Kelly + Brier). Install UI UX Pro Max v2.5.0 global. 13 commits originaux session perdue. |
| D-AUDIT-TOTAL-01 | 2026-04-19/20 | Audit total 11 axes + fixes + refactors + 10e module Core OS. 14 phases × 6 elements stricts. Livrables : 11 findings-Px + rapport-master.md **324L** (`docs/audits/2026-04-19-audit-total-foundation-os/`) + 15+ commits atomiques (df4244a → P13). 15 ameliorations mesurables. Plan archive `.archive/plans-done-260420/`. |
| D-MODEL-01 | 2026-04-19 | 10e Core OS Model Awareness. Spec `docs/core/model.md` (11 sections, Opus 4.7 1M context). Forces/faiblesses/optimisations FOS (layered L0-L3, subagent < 500 mots, pre-compaction, caching). Architecture 9 → 10 modules. |
| D-PRODUCT-01 | 2026-04-19 | 9e Core OS Product Integration FOS ↔ Notion only (pivot P1.5 Asana abandonne apres limites MCP). Agent po-agent sonnet PO elargi + skill /po + 4 DB Notion (Decisions/Plans/Sessions/Tasks) + 4 views kanban natives + hooks opt-in PRODUCT_MCP_SYNC=1. |
| D-BODY-01 | 2026-04-19 | 8e Core OS Body Proprioception Kevin-Claude. 4 couches : Constitution (41 P-XX) + Intent capture `.omc/intent/` + Feedback structure `.omc/alignment/*.jsonl` + Learning loop (alignment-analyze + constitution-suggest + alignment-auditor subagent). |
| D-CONCURRENCY-01 | 2026-04-19 | Multi-session safety B-lite (YAGNI). Spec `docs/core/concurrency.md` (7 hotspots). **Partiellement supersede par D-NO-MULTI-SESSION-01 2026-04-20**. |
| D-TRADING-01 | 2026-04-19 | Backtest engine crypto v1 + V1.1. Socle `modules/finance/trading/` : pipeline data → 5 strategies → runner pandas → harnesses anti-biais (WF/PurgedCV/MC/PBO/DSR) → Pine v5 + 3Commas webhook FastAPI + Nautilus skeletons B1/B2. **94/94 tests + cov 86%** + CI GH Actions. Plan `.archive/plans-done-260420/2026-04-19-finance-trading-backtest-engine.md`. |
| D-MAPPING-01 | 2026-04-17 | Refactor mapping/routage cerveau OS. Wiki 45 pages navigation 2 niveaux (mesh vs etoile). Sources uniques counts.md. |
| D-INTEG-01 | 2026-04-17 | Integration 4 enhancements MemPalace/Graphify (pre-compaction snapshot + confidence tagging + graph report + layered loading). |
| D-WIKI-01 | 2026-04-15 | Adoption claude-obsidian + 5 tiers memoire. Plugin v1.4.3. 5 domaines + 7 cross-domain. |
| D-LEVELUP-01/02/03 | 2026-04-15 | Organicite detection-only + Plans ultra detailles 6 elements + Worktree legacy merge-then-delete. |
| D-DESKTOP-01 | 2026-04-15 | Foundation OS calibre Claude Code Desktop. |
| D-NAMING-01/02 | 2026-04-15/16 | Conventions nommage branches/worktrees/sessions + wiki espaces. |
| D-PLAN-02 | 2026-04-15 | /plan-os orchestrateur skills (brainstorming/writing-plans/ralplan) + EnterPlanMode + dual-path. |
| D-VAULT-01 | 2026-04-16 | Obsidian vault = racine projet. 9 groupes couleurs. |
| D-DS-REBUILD | 2026-04-11 | Remplacement total shadcn. Void Glass dark-only tokens `--ds-*`. |
| D-WT-01 | 2026-04-11 | Worktrees integres Core OS. Feature native Claude Code documentee `docs/core/worktrees.md`. |

## Metriques

| Module | Build | JS | CSS | Tests | Routes |
|--------|-------|----|-----|-------|--------|
| App Builder | OK ~250ms | 184KB | 48KB | 15/15 | 6 |
| Design System | OK | — | — | 23/23 | — |
| Storybook | OK 5.87s | — | — | — | 62 stories |
| Trading | CI OK | — | — | **94/94** | CLI 6 sub-commands |

Seuils : voir `docs/core/monitor.md` section 4. Health-check : DEGRADED (0 critical, 2 warnings cosmetiques : drifts CONTEXT ~186L budget 150L + wiki confidence 1 sans tag non-bloquants).
Wiki : **113 pages filesystem main** (67 wiki-health inclut templates, 86 hors templates pre-D-CCCONFIG, 113 post integration).
Deploy : https://foundation-os.vercel.app/ · DB : Supabase 6 tables.

## MCP — Comptes connectes

| Service | Info |
|---------|------|
| Asana | workspace 1213280972575193 (abandonne D-PRODUCT-01 P1.5, setup structure impossible via MCP) |
| Notion | user 4f1b99db (actif D-PRODUCT-01, 4 DB + 4 views kanban) |
| Figma | disponible |
| Monday.com | disponible |
| Gmail | Auth requise (Kevin reactive pour projet Gmail centralisation Phase D) |

## Outils

- **CI** : GitHub Actions (Node 24, build + TS + tests) + supabase-ping cron + supernova-sync + finance-trading-ci (ruff + mypy + pytest + cov >= 70%)
- **Tests** : Vitest (app 15 + DS 23) + Pytest trading 94 + health-check + sync-check + ref-checker + drift-detector + docs-sync-check
- **Hooks Claude (9)** : PreToolUse validate-void-glass + security-reminder + **bash-firewall** (D-CCCONFIG-01 recup 2026-04-20) + memory-last-used (opt-in), SessionEnd auto-archive-plans + product-session-end (opt-in PRODUCT_MCP_SYNC=1), SessionStart drift-detector + product-session-start (opt-in), PreCompact pre-compaction-snapshot
- **Git hooks (2)** : pre-commit health-check + commit-msg conventional (install via `bash scripts/git-hooks-install.sh`)
- **Plugins** : OMC v4.10.1 (3 versions retard), Superpowers v5.0.7, gstack, claude-obsidian v1.4.3, UI UX Pro Max v2.5.0, BMAD v6 (dormant)

## Travaux Cowork

| Titre | Chemin | Status |
|-------|--------|--------|
| Plan Dashboard Monitoring | `docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/` | valide Kevin — handoff CLI. ~33h. |
| Gmail centralisation 3 comptes → 1 inbox | `docs/travaux-cowork/2026-04-19-gmail-centralisation/` | Phase A (Kevin reactive MCP Gmail avant Phase D) |
| Morning Intelligence v3 refonte TDAH | `docs/travaux-cowork/morning-intelligence/` | Shell livre, attend deploiement scheduled task cron |
| Briefs Foundation OS (specs morning + hebdo) | `docs/travaux-cowork/2026-04-14-briefs-foundation-os/` | Integre |
| Project Instructions v3 | `docs/travaux-cowork/2026-04-13-reorg-project-instructions/` | Integre |
| Evolution Core OS | `docs/travaux-cowork/2026-04-13-evolution-core-os/` | Analyse sources externes |

## Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Supabase pause 7j inactif | low | GitHub Actions cron ping hebdo |
| Vercel deploy casse | medium | Root dir = modules/app |
| Multi-session drift memoire | **high** (prouve 2026-04-20) | **D-NO-MULTI-SESSION-01 : 1 session a la fois** |
| Hook auto-archive-plans pas tourne | medium | `/session-end` doit inclure `git status --short` check |
