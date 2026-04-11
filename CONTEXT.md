# Foundation OS — Contexte

> Source de verite operationnelle. Lu en debut de session, mis a jour en fin.
> Spec format : docs/core/communication.md

## Modules

| Module | Status | Path | Detail |
|--------|--------|------|--------|
| App Builder | production-ready | `modules/app/` | 5 routes, React 19 + Vite 8 + Tailwind 4, 19 tests, DS-6 done (206 couleurs → tokens) |
| Design System | DS-1..DS-6 done | `modules/design-system/` | 5 primitives (Button, Text, Icon, Input, Card), 100 tests, tokens DTCG W3C, Storybook 8.6, DS-5 CI done |
| Core OS | 6/6 actif | `docs/core/` | Cortex, Communication, Monitor, Tools v2 (98 outils), Planner (/plan-os), Worktrees (feature Claude Code — isolation parallele, doc officielle integree) |
| Cowork | actif (non-branche) | `docs/travaux-cowork/` | Co-work Desktop + CLI. Non branche a /session-start /session-end |
| Plan-Router | PROPOSITION | `docs/travaux-cowork/` | 5 profils, 6 questions ouvertes bloquent execution |
| Finance | prevu | — | Pas encore cree |
| Sante | prevu | — | Pas encore cree |

## Sessions recentes

| Date | Resume |
|------|--------|
| 2026-04-11 | **[DONE] Planner MVP — /plan-os + spec + template** |
|            | Scope : module Core OS Planner (generateur de plan avec routing modele + sub-agent gate) |
|            | Livres : `docs/core/planner.md` (spec), `docs/plans/_template-plan.md`, `.claude/commands/plan-os.md`, registre commands.json |
|            | Routing auto : haiku (lookups) / sonnet (exec standard) / opus (archi, decisions) — default conservateur |
|            | Sub-agent gate : 3 conditions (zone isolee + sans memoire session + sortie observable), sinon main session |
|            | Dependance : `superpowers:writing-plans` en moteur (accepte trade-off) |
|            | Decisions : D-PLAN-01 Planner MVP wrapper Superpowers |
|            | Phase 2 backlog : log tokens reels vs estimes, calibration heuristiques |
| 2026-04-11 | **[DONE] Tools v2 — catalogue complet 97 outils** |
|            | Scope : nouveau module Core OS Tools v2 (brainstorm → spec → plan → execution) |
|            | Catalogue : 7 scripts, 4 hooks, 5 commands, 4 agents, 36 OMC, 14 Superpowers, 12 BMAD, 13 MCP, 2 CI |
|            | Routing : 26 regles, 14 domaines fonctionnels dans `docs/core/tools/routing.json` |
|            | CLI : `scripts/tool-register.sh` (scan/rebuild/add) |
|            | Integration : tools.md, cortex.md, CLAUDE.md, CONTEXT.md mis a jour |
|            | Decisions : D-TOOLS-01 Catalogue modulaire v2 |
|            | Commits : 8 commits (c979262 → 40e197c) |
| 2026-04-10 | **[DONE] Audit Core OS — 14 axes, 27 fixes** — rename Memory→Communication, scripts dynamiques, DS monitoring. `21354c9` |
| 2026-04-10 | **[DONE] Cockpit + harmonisation** — /cockpit TDAH, CLAUDE.md -20L. `7cbb391` |
| 2026-04-10 | **[DONE] Cleanup refs + brief v11** — 31 refs cassees → 0. `18436e9` |
| 2026-04-10 | **[DONE] Communication v1 + DS-5 + migration 003** — spec 375L, CONTEXT.md 400→120L. `18079d0` |

> Sessions plus anciennes (S0-S14, Cycle 3 audit + Design System + Monitor Dashboard + Cycles 1-2) disponibles via `git log` et `.archive/audit-massif/23-rapport-final.md`.

## Cap

**Direction** : Phase 5 Expansion — choisir et lancer le premier module metier (Finance / Sante / Trading).

**Pourquoi** : Cycle 3 clos, DS done, stack modernisee. L'OS est pret a accueillir un vrai module.

**Pistes** :
- A. **Finance** — tracking depenses/revenus, premier use case concret
- B. **Sante** — suivi habitudes, donnees personnelles
- C. **Trading** — plus technique, API externes

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
- Decision strategique Phase 5 : quel module lancer ? Finance / Sante / Trading

## Decisions

> Decisions stables (> 30 jours ou supersedees) archivees dans `docs/decisions-log.md`.

| Decision | Date | Detail |
|----------|------|--------|
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
| App Builder | OK 200ms | 473 kB | 24 kB | 19/19 | 5 |
| Design System | OK tokens | — | — | 100/100 | — |

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

## Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Supabase pause 7j inactif | low | GitHub Actions cron ping hebdo |
| Vercel deploy casse | medium | Root dir = modules/app |
