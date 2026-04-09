# Plan-Router — Setup pas a pas

> Date : 2026-04-08
> Spec source : `docs/travaux-cowork/2026-04-08-plan-router/01-spec.md` (lecture obligatoire avant)
> Statut : PROPOSITION (pending validation Kevin)
> Mode d'execution : Claude Code CLI (PAS Cowork — Cowork ne touche pas au code)

---

## Goal

Mettre en production le systeme Plan-Router decrit dans la spec : convention de frontmatter de phase, script plan-router.sh, model defaults sur les 4 sub-agents, integration aux commands /session-start et /session-end. Verifier en dogfooding sur 1 plan reel avant cloture.

## Architecture cible (rappel)

```
plan MD annote  --(plan-router.sh next)-->  dispatch table  --(Kevin /model X)-->  Claude Code
     ^                                                                                  |
     |                                                                                  |
     +------(plan-router.sh log)----<--(/session-end)------------------------------------+
                                              |
                                              v
                                  scripts/.token-budget.log
```

## Pre-conditions

- [ ] Spec `docs/travaux-cowork/2026-04-08-plan-router/01-spec.md` lue et validee par Kevin
- [ ] Branche dediee creee : `feat-plan-router`
- [ ] Baseline saine : `bash scripts/health-check.sh` = SAIN
- [ ] CONTEXT.md a jour (derniere session DONE)

---

## Phase 1 — Validation spec

<!-- routing
profile: SCAN
model: haiku
effort: low
agent: direct
estimated_tokens: 3000
rationale: lecture spec + retours Kevin, aucune ecriture
-->

- [ ] Step 1.1 : Kevin lit `docs/travaux-cowork/2026-04-08-plan-router/01-spec.md`
- [ ] Step 1.2 : Kevin tranche les 6 questions ouvertes section 12 de la spec
- [ ] Step 1.3 : Si modifs spec → editer la spec (NE PAS executer Phase 2 avant)
- [ ] Gate : Kevin dit "go phase 2"

## Phase 2 — Arbitrage points ouverts

<!-- routing
profile: ARCHITECT
model: opus
effort: high
agent: os-architect
estimated_tokens: 8000
rationale: 6 decisions a trancher, impact toute l'archi du router
-->

- [ ] Step 2.1 : Trancher Q1 (HTML comment vs YAML bloc) — recommandation spec : HTML
- [ ] Step 2.2 : Trancher Q2 (effort = thinking only ou + verbosity) — reco : thinking only
- [ ] Step 2.3 : Trancher Q3 (hook PreSessionStart possible ?) — investigation `.claude/settings.json`
- [ ] Step 2.4 : Trancher Q4 (catalogue par module ?) — reco : global v1
- [ ] Step 2.5 : Trancher Q5 (seuil calibration) — reco : 10 sessions
- [ ] Step 2.6 : Trancher Q6 (annoter retroactif ?) — reco : non, S7+ seulement
- [ ] Step 2.7 : Logger les 6 decisions dans `CONTEXT.md` section Decisions actives, format `D-PR-01..06`
- [ ] Gate : 6/6 decisions prises

## Phase 3 — Implementation scripts/plan-router.sh

<!-- routing
profile: CODE
model: sonnet
effort: medium
agent: dev-agent
estimated_tokens: 25000
rationale: ~150L bash, parser + dispatch + log + --help
-->

- [ ] Step 3.1 : Creer `scripts/plan-router.sh` avec :
  - Header `#!/usr/bin/env bash` + `set -euo pipefail`
  - Const `CATALOG` embed : profil → model/effort/agent
  - Subcommands : `next`, `log`, `--help`
  - `next [plan_path]` : trouve le 1er `- [ ]` dans le plan, remonte au bloc routing parent, parse, affiche dispatch
  - `log <phase> --tokens N --duree M` : append-only a `scripts/.token-budget.log`
  - Exit codes : 0 OK, 1 erreur parsing, 2 plan introuvable
- [ ] Step 3.2 : Tests bash manuels :
  - `bash -n scripts/plan-router.sh` (syntax)
  - `bash scripts/plan-router.sh --help`
  - `bash scripts/plan-router.sh next docs/travaux-cowork/2026-04-08-plan-router/02-setup.md` (dogfood : doit retourner Phase 1 SCAN haiku)
- [ ] Step 3.3 : `chmod +x scripts/plan-router.sh`
- [ ] Step 3.4 : Ajouter `scripts/.token-budget.log` au `.gitignore` ? OU le tracker pour calibration partagee ? → trancher en Phase 2
- [ ] Step 3.5 : Verifier health-check toujours SAIN
- [ ] Gate : `bash scripts/plan-router.sh next ...` retourne le bon dispatch sur ce plan

## Phase 4 — Model defaults sur les 4 sub-agents

<!-- routing
profile: CODE
model: sonnet
effort: low
agent: dev-agent
estimated_tokens: 4000
rationale: 4 edits trivials de frontmatter
-->

- [ ] Step 4.1 : Editer `.claude/agents/os-architect.md` → ajouter ligne `model: opus` apres `description:`
- [ ] Step 4.2 : Editer `.claude/agents/dev-agent.md` → `model: sonnet`
- [ ] Step 4.3 : Editer `.claude/agents/doc-agent.md` → `model: haiku`
- [ ] Step 4.4 : Editer `.claude/agents/review-agent.md` → `model: sonnet`
- [ ] Step 4.5 : Verifier le frontmatter parse correctement (lancer une command qui invoque chaque agent en dry-run, si possible)
- [ ] Gate : 4/4 agents ont un model frontmatter

## Phase 5 — Integration commands

<!-- routing
profile: DOC
model: haiku
effort: low
agent: doc-agent
estimated_tokens: 3000
rationale: 2 edits cibles dans 2 fichiers MD
-->

- [ ] Step 5.1 : Editer `.claude/commands/session-start.md` → ajouter step 4.5 (cf. spec section 9)
- [ ] Step 5.2 : Editer `.claude/commands/session-end.md` → ajouter step 6.5 (cf. spec section 9)
- [ ] Step 5.3 : Verifier que les 2 commands restent < 100 lignes (pas de bloat)
- [ ] Step 5.4 : Verifier qu'aucune autre command ne casse (`bash scripts/sync-check.sh`)
- [ ] Gate : sync-check SAIN

## Phase 6 — Dogfooding

<!-- routing
profile: AUDIT
model: sonnet
effort: high
agent: review-agent
estimated_tokens: 30000
rationale: executer 1 vraie session avec le router actif, mesurer
-->

- [ ] Step 6.1 : Choisir un plan reel a annoter — candidat : Cycle 3 S7 (07-agents.md)
- [ ] Step 6.2 : Annoter chaque phase de S7 avec un bloc `<!-- routing ... -->`
- [ ] Step 6.3 : Lancer une session Claude Code reelle sur S7 :
  - `/session-start` doit afficher le profil de la phase courante
  - Switcher `/model` selon dispatch
  - Executer la phase
  - `/session-end` doit logger
- [ ] Step 6.4 : Comparer tokens consommes vs sessions S1-S6 (sans router)
- [ ] Step 6.5 : Verdict : gain mesurable / equivalent / pire ?
- [ ] Step 6.6 : Si gain ≥ 20 % → procede a Phase 7. Si non → debrief, ajustement catalogue, repeat Phase 6 sur 1 autre plan
- [ ] Gate : 1 session reelle tournee bout en bout avec metric

## Phase 7 — Doc + ADR

<!-- routing
profile: DOC
model: haiku
effort: low
agent: doc-agent
estimated_tokens: 5000
rationale: ecriture finale, journalisation
-->

- [ ] Step 7.1 : Ajouter dans `CLAUDE.md` section Token-awareness une sous-section "Plan-Router" avec lien vers la spec
- [ ] Step 7.2 : Ajouter dans `CONTEXT.md` section Modules une ligne "Plan-Router : actif depuis YYYY-MM-DD"
- [ ] Step 7.3 : Ajouter dans `docs/decisions-log.md` un ADR resumant la decision
- [ ] Step 7.4 : Ajouter dans `docs/core/cortex.md` un pointer vers la spec (ne pas dupliquer le contenu)
- [ ] Step 7.5 : Ajouter dans `docs/core/tools.md` section 1 : `plan-router.sh` au tableau Scripts
- [ ] Step 7.6 : `git add` ciblee + commit conventionnel `feat(core): plan-router pour optimisation tokens par phase`
- [ ] Step 7.7 : Ouvrir PR `feat-plan-router → main` avec description detaillee
- [ ] Gate : PR ouverte, attente review Kevin

## Phase 8 — Calibration (asynchrone, +N semaines)

<!-- routing
profile: AUDIT
model: sonnet
effort: medium
agent: review-agent
estimated_tokens: 10000
rationale: lecture log + ajustement catalogue
-->

- [ ] Step 8.1 : Apres 10 sessions reelles avec le router actif → lancer `bash scripts/plan-calibrate.sh` (a creer si jugeable utile)
- [ ] Step 8.2 : Ajuster le catalogue de profils dans la spec si un profil sur/sous-consomme
- [ ] Step 8.3 : Bumper la spec en v1.1, logger dans decisions-log

---

## Verification finale (avant Gate Kevin)

- [ ] `bash scripts/health-check.sh` → SAIN
- [ ] `bash scripts/sync-check.sh` → SAIN
- [ ] `bash scripts/ref-checker.sh` → 0 ref cassee
- [ ] `bash scripts/plan-router.sh next docs/travaux-cowork/2026-04-08-plan-router/02-setup.md` → retourne dispatch coherent
- [ ] CONTEXT.md a jour (decisions D-PR-01..06 + module Plan-Router)
- [ ] Aucun fichier a la racine
- [ ] 4 agents ont un `model:` frontmatter
- [ ] 2 commands ont leurs nouveaux steps
- [ ] PR ouverte avec description + lien spec

---

## Out of scope (v1)

- Hook PreSessionStart automatique (depend d'une feature Claude Code non confirmee)
- Calcul automatique des `estimated_tokens` (eyeball humain)
- Routing par module (catalogue global v1)
- Annotation retroactive des plans deja executes
- Verbosity control (pas de levier propre dans Claude Code v1)
- Integration Cowork-side (Cowork annotera manuellement les plans qu'il genere — automatisation reportee a v2)

---

## Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Frontmatter HTML casse un futur parser MD | low | Format grep-able, fallback regex simple |
| Oubli d'annotation par Cowork | medium | Default = CODE sonnet medium (compromis raisonnable) |
| Calibration jamais faite → catalogue stale | medium | Ritual : 1 calibration / 10 sessions, logger dans CONTEXT.md |
| Switch /model oublie par Kevin | low | plan-router.sh next propose la commande exacte a coller |
| Sub-agent model frontmatter ignore par Claude Code (cf. issue #173) | medium | Verifier en Phase 6 dogfooding ; si bug, reporter au tracker upstream |

---

## References

- Spec : `docs/travaux-cowork/2026-04-08-plan-router/01-spec.md`
- Cortex : `docs/core/cortex.md`
- Tools : `docs/core/tools.md`
- Sub-agents docs Claude Code : https://code.claude.com/docs/en/sub-agents
- Issue effortLevel : https://github.com/anthropics/claude-code/issues/31536
