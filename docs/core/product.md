# Module Product — Integration FOS ↔ Notion + Asana

> **Spec canonique** du 9e module Core OS. Synchronisation bidirectionnelle entre Foundation OS (source de vérité structurelle) et Notion + Asana (miroir + input humain).
>
> **Decision** : D-PRODUCT-01 (2026-04-19).
> **Plan de création** : `.archive/plans-done-260419/2026-04-19-product-module-full-integration.md` (après P5).
> **Inspirations** : `docs/core/body.md` (pattern multi-couches), `docs/core/planner.md` (workflow commands), `docs/core/knowledge.md` (5 tiers zero duplication), `docs/core/concurrency.md` (honnêteté limites).

## 1. Overview

Product module = **9e module Core OS**. 3 surfaces :

- **Agent** `po-agent` (Task invocable, sonnet) : gestion produit complexe (créer EPIC, structurer US, résoudre conflits kanban)
- **Skill** `/po` (init / sync / pull / status) : commandes manuelles invocables
- **Hooks** SessionStart (pull léger) + SessionEnd (push best-effort), opt-in via env `PRODUCT_MCP_SYNC=1`

## 2. Motivation

Kevin a délaissé Notion + Asana depuis début 2026 malgré MCP connectés. Réintégrer ces 2 outils via un module Core OS améliore :

- **Visibilité** : kanban Asana + databases Notion = vue projet au-delà du terminal
- **Collaboration possible** : si Kevin passe d'un dev solo à une équipe, Notion/Asana = point de partage natif
- **Historique produit** : archive externe résiliente aux pertes locales
- **Cockpit multi-device** : Asana/Notion apps iOS/web permettent suivi hors terminal

FOS reste **source de vérité structurelle**. Notion + Asana = **miroir** + capture input humain (Kevin drag cards, ajoute commentaires, déplace priorités).

## 3. Scope (ce que le module fait)

1. Push FOS → Notion + Asana : Decisions, Plans, Sessions, TodoWrite
2. Pull Notion + Asana → FOS : ordre kanban, commentaires, priorité humaine
3. Mapping canonique :
   - **1 plan `docs/plans/<slug>.md` = 1 EPIC Asana**
   - **1 phase du plan = 1 US Asana** (dans section = module détecté)
   - **1 élément des 6-stricts = 1 subtask Asana** (sous chaque US)
4. Offline fallback : FOS autonome si MCP Notion/Asana down
5. Brief v12 tuile #16 📊 PRODUCT : état kanban + divergences FOS↔Externe + derniers commentaires Asana
6. Archive auto : quand un plan passe à `status:done`, EPIC Asana → section archive + Notion DB Plans row → status "archived"

## 4. Non-scope (ce que le module ne fait PAS)

1. **Wiki → Notion sync** : le wiki reste second-brain séparé (knowledge.md owns wiki, product.md owns Notion project mirror). Reporté à un futur D-PRODUCT-02 si besoin clair émerge.
2. **3-way merge sur conflits** : last-write-wins par champ, YAGNI solo
3. **Webhooks temps réel** : MCP ne supporte pas — pull au session-start seulement
4. **Remplacement TodoWrite / CONTEXT.md** : FOS reste autonome, Notion/Asana sont miroir
5. **Sync temps réel à chaque commit** : rate limits MCP interdisent
6. **Gestion team Asana** : 1 user (Kevin), pas de multi-assignee ou permissions avancées
7. **Archive automatique Asana projet** : MCP ne supporte pas `update_project archived=true` (limite API, Kevin le fait manuellement si besoin)

## 5. Components

| # | Composant | Chemin | Type |
|---|-----------|--------|------|
| 1 | Spec canonique | `docs/core/product.md` | Canonique (ce fichier) |
| 2 | Agent | `.claude/agents/po-agent.md` | Sonnet, Task invocable |
| 3 | Skill | `.claude/commands/po.md` | `/po init\|sync\|pull\|status` |
| 4 | Orchestrateur init | `scripts/po-init.sh` | Archive + scaffold (manifest driver) |
| 5 | Orchestrateur sync | `scripts/po-sync.sh` | Push FOS → externe (manifest driver) |
| 6 | Orchestrateur pull | `scripts/po-pull.sh` | Pull externe → FOS (diff + propose) |
| 7 | Orchestrateur status | `scripts/po-status.sh` | Diff FOS vs externe (chain health INFO) |
| 8 | Hook SessionStart | `scripts/hooks/product-session-start.sh` | Pull léger opt-in (P4) |
| 9 | Hook SessionEnd | `scripts/hooks/product-session-end.sh` | Push best-effort opt-in (P4) |
| 10 | Config persistante | `.omc/product-config.json` | IDs Notion DB + Asana project |
| 11 | State runtime | `.omc/product-state.json` | Cache brief tuile #16 |
| 12 | Manifests MCP | `.omc/po-manifests/` | Actions MCP à exécuter par Claude |
| 13 | Results MCP | `.omc/po-results/` | Résultats exécution par Claude |
| 14 | Last-sync timestamps | `.omc/po-last-sync.json` | Persistance delta pull |
| 15 | Conflicts log | `.omc/po-conflicts.log` | Warnings last-write-wins |

## 6. Integration points

**Edits à faire lors de la création** :

- `CONTEXT.md` section Modules : row "Product"
- `docs/core/architecture-core.md` : table 8→9 modules + section Product (10L)
- `docs/core/communication.md` : section 6.1 template + 6.3 rendu + 6.4 sources pour tuile #16 📊 PRODUCT
- `.claude/settings.json` : 2 hooks Product opt-in env flag `PRODUCT_MCP_SYNC=1` (P4)
- `scripts/health-check.sh` : chain INFO via `scripts/po-status.sh --quiet` (P2)
- `CLAUDE.md` : section Core OS ref Product (1 ligne)

**Wiki concepts** (P5) :

- `wiki/concepts/Product Management.md` : concept core (9e module)
- `wiki/concepts/Notion integration.md` : concept impl (rate limits + workflow + mapping)
- `wiki/concepts/Asana integration.md` : concept impl (EPIC/US/subtasks + kanban + custom fields)

## 7. Conventions

### Scripts bash

- Shebang : `#!/usr/bin/env bash`
- Options : `set -uo pipefail` (pas `-e` car gestion manuelle erreurs MCP)
- ANSI colors : `RED='\033[0;31m'`, `GREEN='\033[0;32m'`, `YELLOW='\033[1;33m'`, `NC='\033[0m'`
- Mode `--quiet` : chain health-check (supprime logs intermédiaires)
- Mode `--dry-run` : preview actions MCP sans exécuter
- Exit codes : 0=OK, 1=ERROR, 2=PARTIAL/WARN

### Pattern manifests JSON (honnête P-11)

Les MCP tools ne sont invocables que par Claude (pas par bash). Donc les scripts `po-*.sh` **génèrent des manifests JSON** d'actions à exécuter, et Claude lit + exécute les MCP calls séquentiellement.

**Flow** :

1. Claude invoque `scripts/po-<action>.sh [args]`
2. Script parse état FOS (CONTEXT.md, plans, etc.) + écrit manifest dans `.omc/po-manifests/YYYY-MM-DD-HHMM-<action>.json`
3. Claude lit manifest, exécute MCP calls batch (respect rate limits)
4. Claude écrit résultats dans `.omc/po-results/YYYY-MM-DD-HHMM-<action>-results.json`
5. Script (re-invoqué avec `--apply-results`) persiste IDs/timestamps dans `.omc/product-config.json`

**Avantage** : traçabilité + idempotence + debugging + rollback possible (le manifest est un journal).

### Tagging FOS-generated

- **Asana tasks** : préfixe description `[fos-sync]` + custom field (si dispo) `Decision ref` = `D-XXX-NN`
- **Notion rows** : propriété `Source` = `fos-sync` + `Last sync timestamp`

Permet distinction claire entre contenu généré par FOS vs Kevin ajouté manuellement.

## 8. Source of truth + Conflit resolution

**Règle immuable** :

- **FOS MD gagne sur la structure** (schema, décisions spec, code, commits)
- **Notion + Asana gagnent sur l'ordre / priorité humaine** (Kevin drag cards, ajoute commentaires, modifie priorité)

**Sur conflit** (édit parallèle FOS + Notion/Asana même champ) :

- **Last-write-wins par champ** (timestamp le plus récent)
- Log warning dans `.omc/po-conflicts.log` avec diff avant/après
- Pas de 3-way merge (YAGNI solo — si Kevin passe équipe, réévaluer)

**Exemples concrets** :

1. **Pas de conflit** (champs distincts) : Kevin move card Asana "P2 Push" Todo→In Progress. Claude edit `docs/plans/<slug>.md` ajoute `[x] P2 action 1`. `/po pull` détecte status Asana → propose TodoWrite update. Changements orthogonaux.

2. **Conflit** (même champ) : Kevin modifie date décision D-BODY-01 dans Notion DB (2026-04-19 → 2026-04-18). Claude regenere CONTEXT.md Decisions table (2026-04-19 reste). Pull détecte divergence date. Last-write gagne (timestamp modified_at). Warning log.

3. **Priorité** : Kevin réordonne cards Asana (US "P3 Pull" déplacée au-dessus de "P2 Push"). FOS TodoWrite re-ordonne via `/po pull --apply`. Pas de conflit structure (ordre = ordre humain = Kevin owns).

## 9. Execution flow

### Scenario push (P2 + `/po sync`)

```
1. Claude invoque `bash scripts/po-sync.sh [--dry-run|--plan <slug>|--since <date>]`
2. Script parse CONTEXT.md Decisions + docs/plans/*.md + wiki/meta/sessions-recent.md
3. Script génère manifest .omc/po-manifests/YYYY-MM-DD-HHMM-sync.json
4. Claude lit manifest + exécute MCP calls :
   - Notion : update/create DB rows (Decisions, Plans, Sessions)
   - Asana : create_tasks (EPIC = plan, US = phase, subtask = élément)
5. Batching : 10 req/s Notion max, 100/min Asana max (sleep adapté)
6. Claude écrit .omc/po-results/YYYY-MM-DD-HHMM-sync-results.json
7. Script update .omc/po-last-sync.json timestamps
```

### Scenario pull (P3 + `/po pull`)

```
1. Claude invoque `bash scripts/po-pull.sh [--preview|--apply|--interactive]`
2. Script génère manifest lecture (queries Notion DB + Asana tasks modifiés)
3. Claude lit manifest + exécute MCP queries
4. Script compare résultats vs état FOS courant
5. Script génère diff .omc/po-diffs/YYYY-MM-DD-HHMM.json
6. Mode --preview : affiche diff
7. Mode --apply : applique diff via TodoWrite update + edit CONTEXT.md ordre/priorité
8. Mode --interactive : demande confirmation par update
```

### Scenario hooks auto (P4)

```
SessionStart:
  1. Hook product-session-start.sh invoque po-pull.sh --quiet
  2. Timeout 10s : si dépassé → skip + log .omc/logs/product-sync-errors.log
  3. Si OK → update .omc/product-state.json (source brief tuile #16)

SessionEnd:
  1. Hook product-session-end.sh invoque po-sync.sh --since <start>
  2. Timeout 30s + retry 1x si erreur transitoire
  3. Si MCP down → log + skip (FOS continue sans casse)
```

## 10. Safety rules (immuables)

1. **Jamais delete** contenu Notion/Asana sans flag explicite Kevin. Archive = rename Notion / archived=true Asana (si MCP supportait — sinon manuel).
2. **Jamais push main automatique** (règle CLAUDE.md respectée).
3. **Jamais mutate Notion DB structure** après P1 sans nouveau plan (schema figé dès P1).
4. **Hooks TOUJOURS opt-in** env flag `PRODUCT_MCP_SYNC=1` : default OFF pour éviter casse session si MCP down.
5. **Rate limits respectés** : batching obligatoire. Si 429 → abort + log (pas de retry agressif).
6. **Idempotence** : `po-sync` relancé 2x = 0 duplicate (match par tag + Decision ref + timestamp).
7. **Offline fallback** : FOS continue autonome si MCP down.
8. **Preview avant destructif** : toute action irreversible (delete task, archive EPIC) → manifest `--dry-run` obligatoire, Kevin valide.

## 11. Limits + Maintenance

**Limites explicites** (P-10 pragmatisme, P-11 conscience) :

1. **Rate limits MCP** : Notion 3 req/s, Asana 150/min → batching fin session (pas live)
2. **Pas de webhooks** : pull au session-start, **pas temps réel**
3. **Conflits** : last-write-wins par champ (pas de 3-way merge)
4. **Hooks opt-in** : `PRODUCT_MCP_SYNC=1` default OFF
5. **Subtasks Asana max 20/task** : 6 éléments par phase OK (marge 14)
6. **Archive Asana projet non-automatisable** : Kevin doit archiver manuellement via UI (MCP limite)
7. **Custom fields Asana** : disponibles à partir de plan Premium (Kevin : à confirmer). Fallback : utiliser description + tags.
8. **`create_project_preview` seul pour créer projet** : nécessite confirmation UI Kevin (pas création silencieuse)
9. **Notion pages count limits** : workspace personnel, pas de quota théorique. DB rows illimité.

**Maintenance** :

- **Monthly** : `/po status` + review `.omc/po-conflicts.log`
- **Quarterly** : audit Notion DB schema vs CONTEXT.md Decisions format (rename propriétés si drift)
- **Si Kevin passe équipe** : réévaluer lock par fichier + 3-way merge (YAGNI solo actuellement)
- **Si MCP Asana/Notion change API** : update scripts + rate limits

---

**Version** : 1.0 (D-PRODUCT-01 P1, 2026-04-19). **Append-only** : toute évolution majeure = nouveau D-PRODUCT-XX. Mise à jour mineure (correction limite, pattern) = edit direct avec commit `docs(product): ...`.

**Related** : `docs/core/architecture-core.md` (table modules), `docs/core/communication.md` (tuile #16), `docs/core/body.md` (pattern multi-couches inspiration), `wiki/concepts/Product Management.md` (P5).
