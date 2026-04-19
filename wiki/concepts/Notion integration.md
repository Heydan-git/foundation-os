---
type: concept
title: "Notion integration"
updated: 2026-04-19
tags:
  - concept
  - implementation
  - notion
  - mcp
  - product
  - foundation-os
status: active
confidence: high
domain: dev
implementation: "docs/core/product.md (section 6+9)"
related:
  - "[[Product Management]]"
  - "[[Foundation OS]]"
  - "[[Core OS]]"
  - "[[index-concepts]]"
---

# Notion integration

> **Implementation pratique** de l'integration bidirectionnelle FOS ↔ Notion.
> Decision : D-PRODUCT-01 (pivot P1.5 Notion-only 2026-04-19).
> Spec : `docs/core/product.md` sections 6 (Architecture Notion), 9 (Execution flow).

## Workspace

- **URL** : workspace user Notion Kevin (`user_id 4f1b99db`)
- **Root page** : `🪐 Foundation OS` (`34721e30-0c7b-8109-ad34-cc6baec0f265`) — enfant temporaire de `🪐 Foundation OS — Archive 2026-04` (limite MCP workspace-level creation)
- **Config persistante** : `.omc/product-config.json` (IDs DB + views + sync_state)

## 4 Databases

### 📊 Decisions (`8abb85ef-8806-49a0-ba08-c58b464ce4c9`)

Miroir des Architecture Decision Records (D-XXX-NN) depuis `CONTEXT.md` section Decisions.

**Propriétés** : Title, Code (D-XXX-NN), Date, Module (select), Status (Active/Superseded/Archive), Source ref (URL), Synced at (date).

**Peuplee P2** : 16 rows (D-PRODUCT-01 a D-WT-01).

### 📋 Plans (`47fda921-85b6-43cf-a7ec-efbc03d3b953`)

Miroir de `docs/plans/*.md` (actifs) + `.archive/plans-done-*/*.md` (archives).

**Propriétés** : Title, Slug, Decision ref, Status (draft/active/done/archived), Phases total, Phases done, Effort estime, Path, Created (date), Synced at.

**Peuplee P2** : 1 row (D-PRODUCT-01 plan courant).

### 💬 Sessions (`218baff4-e4fe-4e9d-b59d-ccdcc130d355`)

Miroir de `wiki/meta/sessions-recent.md` (5 sessions recentes).

**Propriétés** : Title, Date, Duration, Scope, Commits, Decisions ref, Livraison, Revelations, Synced at.

**Peuplee P2** : 5 rows (D-BODY-01 COMPLET, D-CONCURRENCY-01 DONE, D-INTEG-01 Phases 2-5, D-INTEG-01 Phase 1/5, Mapping refactor).

### 🎯 Tasks (`716e6844-eca0-4a33-9c40-7a52f6ed07b3`) — pivot P1.5

Ajoute au pivot Notion-only (remplace ex-kanban Asana).

**Propriétés** : Title, Plan ref (relation → Plans), Phase (P1-PN), Element (1-6, nullable), Status (Todo/In Progress/Done/Blocked), Priority (High/Medium/Low), Module (9 options), Type (Phase/Element/US/Task), Due date, Synced at.

**Peuplee P2** : 6 rows (phases D-PRODUCT-01 : P1 Done, P1.5 Done, P2 In Progress, P3/P4/P5 Todo).

## 4 Views natives

Creees P3 via MCP `notion-create-view` :

| View | DB | Type | Group/Sort |
|------|-----|------|------------|
| Kanban by Status | Tasks | board | Status |
| Kanban by Module | Tasks | board | Module |
| Timeline Tasks | Tasks | timeline | Due date |
| Timeline Plans | Plans | timeline | Created |

## MCP tools utilises (14)

- `notion-search` : recherche semantique workspace
- `notion-fetch` : retrieve page/database details
- `notion-create-pages` : create pages (batch up to 100)
- `notion-create-database` : create DB avec SQL DDL
- `notion-update-page` (5 commandes)
- `notion-update-data-source` : ALTER schema
- `notion-create-view` / `notion-update-view`
- `notion-create-comment` / `notion-get-comments`
- `notion-move-pages` / `notion-duplicate-page`
- `notion-get-teams` / `notion-get-users`

## Rate limits + batching

- **Notion API** : 3 req/s par integration
- **Batch** : `notion-create-pages` accepte 1-100 pages par call (P2 utilise 1 call par DB)
- **Sleep entre batches** : 350ms minimum si > 1 call sequentiel
- **429 abort** : pas de retry agressif (P-14 cause racine)

## Workflow bidirectionnel

### Push FOS → Notion (`/po sync`)

1. `bash scripts/po-sync.sh [--dry-run|--plan <slug>|--since <date>]`
2. Script parse CONTEXT.md + plans + sessions → genere manifest `.omc/po-manifests/`
3. Claude lit manifest + execute MCP `notion-create-pages` (4 calls batches)
4. Idempotence : match par Code (Decisions), Slug (Plans), Title+Date (Sessions), Title+Phase (Tasks)

### Pull Notion → FOS (`/po pull`)

1. `bash scripts/po-pull.sh [--preview|--apply|--interactive]`
2. Script genere manifest lecture (queries DB Tasks + Decisions + Plans + Sessions modifies depuis last_pull)
3. Claude lit manifest + execute MCP queries → diff vs FOS
4. Mode `--apply` : propose updates via TodoWrite + brief v12 tuile #17

### Hooks auto (opt-in)

- `PRODUCT_MCP_SYNC=1` env flag
- SessionStart : `scripts/hooks/product-session-start.sh` → pull preview leger
- SessionEnd : `scripts/hooks/product-session-end.sh` → push sync best-effort
- Offline fallback : log + skip si MCP down

## Limites (P-10 + P-11)

1. **Pas de webhooks** → pull au session-start, **pas temps reel** (MCP limite)
2. **Rate limit 3 req/s** → batching fin session, pas live par commit
3. **Workspace-level creation** non supportee → new root cree enfant temporaire de Archive
4. **Conflits last-write-wins** par champ (pas 3-way merge, YAGNI solo)
5. **Custom fields complexes** : formulas/rollups creables via DDL mais limit MCP sur valeurs complexes

## Pattern manifest-driven (honnete [[P-11]])

Bash ne peut pas invoquer MCP directement. Solution : scripts po-*.sh generent manifests JSON d'actions, Claude execute les MCP calls. Permet traceabilite + idempotence + recovery post-compactage.

Voir `.omc/po-manifests/*.json` pour journal actions MCP.

## References

- Spec : `docs/core/product.md` sections 6-9
- Concepts related : [[Product Management]], [[Foundation OS]], [[Core OS]]
- Decision : D-PRODUCT-01
