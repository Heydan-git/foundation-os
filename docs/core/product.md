# Module Product — Integration FOS ↔ Notion

> **Spec canonique** du 9e module Core OS. Synchronisation bidirectionnelle entre Foundation OS (source de vérité structurelle) et **Notion** (miroir + input humain + kanban + roadmap).
>
> **Decision** : D-PRODUCT-01 (2026-04-19). Pivot P1.5 Notion-only (2026-04-19) — abandon Asana (payant + limites MCP create_project/section).
> **Plan de création** : `.archive/plans-done-260419/2026-04-19-product-module-full-integration.md` (après P5).
> **Inspirations** : `docs/core/body.md` (pattern multi-couches), `docs/core/planner.md` (workflow commands), `docs/core/knowledge.md` (5 tiers zero duplication), `docs/core/concurrency.md` (honnêteté limites).

## 1. Overview

Product module = **9e module Core OS**. Integration **100% Notion** (pivot P1.5). 3 surfaces :

- **Agent** `po-agent` (Task invocable, sonnet) : gestion produit complexe, expertise Notion complète
- **Skill** `/po` (init / sync / pull / status) : commandes manuelles invocables
- **Hooks** SessionStart (pull léger) + SessionEnd (push best-effort), opt-in via env `PRODUCT_MCP_SYNC=1`

## 2. Motivation

Kevin a délaissé Notion depuis début 2026 malgré MCP connecté. Réintégrer Notion via un module Core OS améliore :

- **Visibilité** : kanban + timeline + databases = vue projet au-delà du terminal
- **Collaboration possible** : si Kevin passe d'un dev solo à une équipe, Notion = point de partage natif (partageable, permissions granulaires)
- **Historique produit** : archive externe résiliente aux pertes locales
- **Cockpit multi-device** : Notion apps iOS/web/desktop permettent suivi hors terminal

**Pivot P1.5 Notion-only** : Asana initialement prévu mais abandonné pour raisons pragmatiques :
- Asana payant pour features au-delà du minimum (custom fields, portfolios)
- MCP Asana ne supporte pas `create_project` / `update_project` / `create_section` (setup manuel required)
- Notion natif offre kanban + timeline + relations + databases dans un seul outil cohérent
- YAGNI (P-20) : 1 plateforme < 2 plateformes pour dev solo

FOS reste **source de vérité structurelle**. Notion = **miroir** + capture input humain (Kevin drag cards dans Kanban view, ajoute commentaires, déplace priorités).

## 3. Scope (ce que le module fait)

1. Push FOS → Notion : Decisions, Plans, Sessions, **Tasks/US** (via DB dedicated)
2. Pull Notion → FOS : ordre kanban (Status change), commentaires, priorité humaine
3. **Kanban natif Notion** : vue Board sur DB Tasks groupé par Status (Todo/In Progress/Done/Blocked) ou par Module
4. **Timeline natif Notion** : vue Timeline sur DB Plans + DB Tasks (due dates)
5. Mapping canonique :
   - **1 plan `docs/plans/<slug>.md` = 1 row DB Plans**
   - **1 phase du plan = 1 row DB Tasks** (Type=Phase, Plan ref=relation)
   - **1 élément des 6-stricts = 1 row DB Tasks** (Type=Element, Phase=P1-P5, Element=1-6)
   - **1 TodoWrite item = 1 row DB Tasks** (Type=Task)
6. Offline fallback : FOS autonome si MCP Notion down
7. Brief v12 tuile #16 📊 PRODUCT : état kanban + divergences FOS↔Notion + derniers commentaires Notion
8. Archive auto : quand un plan passe à `status:done`, row DB Plans → Status=archived, tasks liées → Done bulk update

## 4. Non-scope (ce que le module ne fait PAS)

1. **Wiki → Notion sync** : le wiki reste second-brain séparé (knowledge.md owns wiki, product.md owns Notion project mirror). Reporté à un futur D-PRODUCT-02 si besoin clair.
2. **3-way merge sur conflits** : last-write-wins par champ, YAGNI solo
3. **Webhooks temps réel** : MCP ne supporte pas — pull au session-start seulement
4. **Remplacement TodoWrite / CONTEXT.md** : FOS reste autonome, Notion = miroir
5. **Sync temps réel à chaque commit** : rate limits MCP interdisent (3 req/s Notion)
6. **Gestion team Notion avancée** : 1 user (Kevin), pas de multi-assignee ou permissions complexes
7. **~~Asana~~ integration** : abandonné P1.5 (voir motivation section 2)

## 5. Components

| # | Composant | Chemin | Type |
|---|-----------|--------|------|
| 1 | Spec canonique | `docs/core/product.md` | Canonique (ce fichier) |
| 2 | Agent | `.claude/agents/po-agent.md` | Sonnet, Task invocable |
| 3 | Skill | `.claude/commands/po.md` | `/po init\|sync\|pull\|status` |
| 4 | Orchestrateur init | `scripts/po-init.sh` | Archive + scaffold Notion (manifest driver) |
| 5 | Orchestrateur sync | `scripts/po-sync.sh` | Push FOS → Notion (manifest driver) |
| 6 | Orchestrateur pull | `scripts/po-pull.sh` | Pull Notion → FOS (diff + propose) |
| 7 | Orchestrateur status | `scripts/po-status.sh` | Diff FOS vs Notion (chain health INFO) |
| 8 | Hook SessionStart | `scripts/hooks/product-session-start.sh` | Pull léger opt-in (P4) |
| 9 | Hook SessionEnd | `scripts/hooks/product-session-end.sh` | Push best-effort opt-in (P4) |
| 10 | Config persistante | `.omc/product-config.json` | IDs Notion DB + views |
| 11 | State runtime | `.omc/product-state.json` | Cache brief tuile #16 |
| 12 | Manifests MCP | `.omc/po-manifests/` | Actions MCP à exécuter par Claude |
| 13 | Results MCP | `.omc/po-results/` | Résultats exécution par Claude |
| 14 | Last-sync timestamps | `.omc/po-last-sync.json` | Persistance delta pull |
| 15 | Conflicts log | `.omc/po-conflicts.log` | Warnings last-write-wins |

## 6. Architecture Notion

### Espace root

**🪐 Foundation OS** (`34721e30-0c7b-8109-ad34-cc6baec0f265`) — nouveau espace créé en P1 (ancien archivé `🪐 Foundation OS — Archive 2026-04`).

### Databases (4 au total)

| DB | data_source_id | Rôle |
|----|----------------|------|
| 📊 Decisions | `8abb85ef-8806-49a0-ba08-c58b464ce4c9` | Miroir D-XXX-NN CONTEXT.md |
| 📋 Plans | `47fda921-85b6-43cf-a7ec-efbc03d3b953` | Miroir docs/plans/ + .archive/plans-done-*/ |
| 💬 Sessions | `218baff4-e4fe-4e9d-b59d-ccdcc130d355` | Miroir wiki/meta/sessions-recent.md |
| 🎯 Tasks | `716e6844-eca0-4a33-9c40-7a52f6ed07b3` | **NEW P1.5** — Tasks/US/Phases/Elements (ex-kanban Asana) |

### Schema DB Tasks (🎯 Tasks — pivot P1.5)

| Propriété | Type | Rôle |
|-----------|------|------|
| Title | title | Nom task |
| Plan ref | relation → Plans | Plan parent |
| Phase | rich_text | P1/P2/P3/... du plan |
| Element | number | 1-6 dans phase (nullable si Phase/US) |
| Status | select | Todo / In Progress / Done / Blocked |
| Priority | select | High / Medium / Low |
| Module | select | Core OS / App Builder / Design System / Knowledge / Cowork / Phase 5 / Cross |
| Type | select | Phase / Element / US / Task |
| Due date | date | Deadline |
| Synced at | date | Dernier sync FOS → Notion |

### Views Notion (natives MCP — à créer P2)

- **Kanban by Status** : board view groupé par Status (Todo → In Progress → Done → Blocked)
- **Kanban by Module** : board view groupé par Module (7 sections émojis)
- **Timeline** : timeline view par Due date (Gantt visuel)
- **Roadmap** : calendar ou table view filtré sur Plans actifs + Tasks top priority

## 7. Conventions

### Scripts bash

- Shebang : `#!/usr/bin/env bash`
- Options : `set -uo pipefail` (pas `-e` car gestion manuelle erreurs MCP)
- ANSI colors : RED / GREEN / YELLOW / NC
- Mode `--quiet` : chain health-check (supprime logs intermédiaires)
- Mode `--dry-run` : preview actions MCP sans exécuter
- Exit codes : 0=OK, 1=ERROR, 2=PARTIAL/WARN

### Pattern manifests JSON (honnête P-11)

Les MCP tools ne sont invocables que par Claude (pas par bash). Scripts `po-*.sh` **génèrent manifests JSON** d'actions à exécuter, et Claude lit + exécute les MCP calls séquentiellement.

**Flow** :

1. Claude invoque `scripts/po-<action>.sh [args]`
2. Script parse état FOS (CONTEXT.md, plans, etc.) + écrit manifest dans `.omc/po-manifests/YYYY-MM-DD-HHMM-<action>.json`
3. Claude lit manifest, exécute MCP calls batch (respect rate limits Notion 3 req/s)
4. Claude écrit résultats dans `.omc/po-results/YYYY-MM-DD-HHMM-<action>-results.json`
5. Script (re-invoqué avec `--apply-results`) persiste IDs/timestamps dans `.omc/product-config.json`

### Tagging FOS-generated

- Propriété `Source` (text, à ajouter P2) = `fos-sync` ou `kevin-manual`
- Propriété `Synced at` (date) = timestamp dernier push FOS

Permet distinction claire entre contenu généré par FOS vs Kevin ajouté manuellement.

## 8. Source of truth + Conflit resolution

**Règle immuable** :

- **FOS MD gagne sur la structure** (schema, décisions spec, code, commits)
- **Notion gagne sur l'ordre / priorité humaine** (Kevin drag cards Kanban, ajoute commentaires, modifie priorité)

**Sur conflit** (édit parallèle FOS + Notion même champ) :

- **Last-write-wins par champ** (timestamp le plus récent)
- Log warning dans `.omc/po-conflicts.log` avec diff avant/après
- Pas de 3-way merge (YAGNI solo — si Kevin passe équipe, réévaluer)

**Exemples concrets** :

1. **Pas de conflit** (champs distincts) : Kevin move card Notion kanban "P2 Push" Todo→In Progress. Claude edit `docs/plans/<slug>.md` ajoute `[x] P2 action 1`. `/po pull` détecte Status change Notion → propose TodoWrite update. Changements orthogonaux.

2. **Conflit** (même champ) : Kevin modifie date décision D-BODY-01 dans Notion DB Decisions (2026-04-19 → 2026-04-18). Claude regenere CONTEXT.md Decisions (2026-04-19 reste). Pull détecte divergence date. Last-write gagne (timestamp modified_at). Warning log.

3. **Priorité** : Kevin réordonne cards Notion Kanban (US "P3 Pull" déplacée au-dessus de "P2 Push"). FOS TodoWrite re-ordonne via `/po pull --apply`. Pas de conflit structure (ordre = ordre humain = Kevin owns).

## 9. Execution flow

### Scenario push (P2 + `/po sync`)

```
1. Claude invoque `bash scripts/po-sync.sh [--dry-run|--plan <slug>|--since <date>]`
2. Script parse CONTEXT.md Decisions + docs/plans/*.md + wiki/meta/sessions-recent.md
3. Script génère manifest .omc/po-manifests/YYYY-MM-DD-HHMM-sync.json
4. Claude lit manifest + exécute MCP Notion calls :
   - Create/update rows DB Decisions (parse table CONTEXT.md)
   - Create/update rows DB Plans (parse docs/plans/*)
   - Create/update rows DB Sessions (parse wiki/meta/sessions-recent.md)
   - Create/update rows DB Tasks (phases + elements + TodoWrite state)
   - Create/update relations Plan ref sur DB Tasks
5. Batching : max 10 req/s Notion (sleep 100ms entre calls)
6. Claude écrit .omc/po-results/YYYY-MM-DD-HHMM-sync-results.json
7. Script update .omc/po-last-sync.json timestamps
```

### Scenario pull (P3 + `/po pull`)

```
1. Claude invoque `bash scripts/po-pull.sh [--preview|--apply|--interactive]`
2. Script génère manifest lecture (queries DB Tasks + DB Decisions modifiées)
3. Claude lit manifest + exécute MCP queries Notion
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

1. **Jamais delete** contenu Notion sans flag explicite Kevin. Archive = rename page OR change Status=Archive dans DB.
2. **Jamais push main automatique** (règle CLAUDE.md respectée).
3. **Jamais mutate schema Notion DB** après P1.5 sans nouveau plan (schema figé).
4. **Hooks TOUJOURS opt-in** env flag `PRODUCT_MCP_SYNC=1` : default OFF pour éviter casse session si MCP down.
5. **Rate limits respectés** : batching obligatoire (3 req/s Notion). Si 429 → abort + log.
6. **Idempotence** : `po-sync` relancé 2x = 0 duplicate (match par Title + Code + timestamp).
7. **Offline fallback** : FOS continue autonome si MCP down.
8. **Preview avant destructif** : toute action irreversible (delete row, archive plan) → manifest `--dry-run` obligatoire, Kevin valide.

## 11. Limits + Maintenance

**Limites explicites** (P-10 pragmatisme, P-11 conscience) :

1. **Rate limits MCP Notion** : 3 req/s → batching fin session (pas live)
2. **Pas de webhooks** : pull au session-start, **pas temps réel**
3. **Conflits** : last-write-wins par champ (pas de 3-way merge)
4. **Hooks opt-in** : `PRODUCT_MCP_SYNC=1` default OFF
5. **Notion page root temporairement enfant de l'archive** : limite MCP workspace-level creation. Kevin peut déplacer manuellement au top-level si souhaité.
6. **Custom views MCP** : `notion-create-view` dispo mais limité (layout kanban/timeline testable uniquement en live)
7. **Asana abandonné** (P1.5) : réévaluation possible si Kevin change d'avis (payant + MCP incomplete), mais pas de réintégration auto-planifiée.

**Maintenance** :

- **Monthly** : `/po status` + review `.omc/po-conflicts.log`
- **Quarterly** : audit Notion DB schemas vs CONTEXT.md / plans format (rename propriétés si drift)
- **Si Kevin passe équipe** : réévaluer 3-way merge + permissions Notion multi-user
- **Si MCP Notion change API** : update scripts + rate limits

---

**Version** : 1.1 (D-PRODUCT-01 P1.5 pivot Notion-only, 2026-04-19). **Append-only** : toute évolution majeure = nouveau D-PRODUCT-XX.

**Related** : `docs/core/architecture-core.md` (table modules), `docs/core/communication.md` (tuile #16), `docs/core/body.md` (pattern multi-couches), `wiki/concepts/Product Management.md` (P5), `wiki/concepts/Notion integration.md` (P5).
