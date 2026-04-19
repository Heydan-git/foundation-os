---
type: concept
title: "Product Management"
updated: 2026-04-19
tags:
  - concept
  - core-os
  - product
  - notion
  - foundation-os
status: active
confidence: high
domain: dev
implementation: "docs/core/product.md"
related:
  - "[[Foundation OS]]"
  - "[[Core OS]]"
  - "[[Body]]"
  - "[[Notion integration]]"
  - "[[foundation-os-map]]"
  - "[[index-concepts]]"
---

# Product Management

> **9e module Core OS Foundation OS** — Gestion produit du perimetre Kevin via agent PO + skill `/po` + integration Notion.
>
> **Decision** : D-PRODUCT-01 (2026-04-19, pivot P1.5 Notion-only).
> **Spec canonique** : `docs/core/product.md`.
> **Plan creation** : `.archive/plans-done-260419/2026-04-19-product-module-full-integration.md`.

## Vue d'ensemble

Le module **Product** est le 9e module Core OS Foundation OS. Son role : gerer le produit (pas juste le code) au-dela du terminal via integration bidirectionnelle FOS ↔ Notion.

Contrairement aux autres modules Core OS (routing, monitoring, communication), Product module ne fait pas partie du cerveau interne FOS. Il le refletede et l'etend dans un outil collaboratif externe (Notion).

## Role PO elargi

L'agent `po-agent` (sonnet, Task invocable) n'est **pas** un simple technicien de sync. Son scope couvre **TOUT le perimetre Kevin** :

1. **Foundation OS** (cerveau cognitif + 9 modules Core OS)
2. **Modules existants** (App Builder, Design System)
3. **Apps futures revendables** (applications concues dans App Builder pour revente client)
4. **Modules Phase 5** (Finance / Sante / Trading quand lances)

Responsabilites Product Owner classiques :
- **Roadmap** : now/next/later, timeline Notion
- **Backlog grooming** : clarifier, prioriser, splitter US
- **User stories** : format "En tant que X, je veux Y, afin de Z"
- **Acceptance criteria** : testables, mesurables
- **Sprint planning** : capacity, velocity, dependencies
- **Kanban management** : views Notion natives (by Status, by Module, timeline)
- **Integration bidirectionnelle** : push FOS → Notion + pull Notion → FOS

## 3 surfaces

### Agent `po-agent`

`.claude/agents/po-agent.md` — Task invocable. Expertise :
- **Notion a 100%** : workspace architecture, databases, propriétés typées, views kanban/timeline, formulas, relations, MCP complet (14 tools)
- **Product Management** : backlog, US, acceptance, estimation, sprint, metrics
- **Scope elargi** : FOS + modules + apps futures

### Skill `/po`

`.claude/commands/po.md` — Subcommandes :
- `/po init` : archive + scaffold Notion (DB Decisions/Plans/Sessions/Tasks + views)
- `/po sync` : push FOS → Notion (manifest-driven)
- `/po pull` : pull Notion → FOS (diff + propose updates via TodoWrite)
- `/po status` : diff FOS vs Notion (chainable health-check INFO)

### Hooks opt-in

`scripts/hooks/product-session-{start,end}.sh` — Activation via `PRODUCT_MCP_SYNC=1` env :
- **SessionStart** : pull leger (timeout 10s, non-bloquant)
- **SessionEnd** : push best-effort (timeout 30s, retry 1x, offline fallback)

## Architecture Notion (4 DB)

| DB | data_source_id | Role |
|----|----------------|------|
| 📊 Decisions | `8abb85ef-8806-49a0-ba08-c58b464ce4c9` | Miroir D-XXX-NN CONTEXT.md |
| 📋 Plans | `47fda921-85b6-43cf-a7ec-efbc03d3b953` | Miroir docs/plans/ |
| 💬 Sessions | `218baff4-e4fe-4e9d-b59d-ccdcc130d355` | Miroir wiki/meta/sessions-recent.md |
| 🎯 Tasks | `716e6844-eca0-4a33-9c40-7a52f6ed07b3` | Phases + Elements + TodoWrite (kanban) |

## Mapping canonique

- **1 plan `docs/plans/<slug>.md`** = 1 row DB Plans
- **1 phase du plan** = 1 row DB Tasks (Type=Phase, Plan ref=relation)
- **1 element des 6-stricts** = 1 row DB Tasks (Type=Element)
- **1 TodoWrite item courant** = 1 row DB Tasks (Type=Task)

## Regle source of truth

- **FOS MD gagne sur la structure** (schema, decisions spec, code)
- **Notion gagne sur l'ordre/priorite humaine** (Kevin drag cards, ajoute commentaires)
- **Last-write-wins par champ** sur conflit (log [[Product]] `.omc/po-conflicts.log`)

## Pattern manifest-driven (honnete [[P-11]])

Les scripts bash ne peuvent pas invoquer MCP Notion directement. Pattern adopte :

1. Claude invoque `scripts/po-<action>.sh`
2. Script parse etat FOS + genere manifest JSON dans `.omc/po-manifests/`
3. Claude lit manifest + execute MCP calls sequentiellement (respect rate limits Notion 3 req/s)
4. Claude ecrit resultats dans `.omc/po-results/`
5. Script persiste IDs dans `.omc/product-config.json`

## Pivot P1.5 Notion-only

Asana etait prevu initialement mais **abandonne en P1.5** apres decouverte de limites MCP :
- Asana payant pour features au-dela minimum
- MCP Asana ne supporte pas `create_project`, `update_project` (archive), `create_section`
- Setup tout manuel = pas viable pour "full integration automatisee"

Notion absorbe seule le role (kanban, timeline, relations, databases dans un outil coherent). Voir [[Notion integration]].

## Limites honnetes (P-10 + P-11)

- Rate limit Notion 3 req/s → batching fin session
- Pas de webhooks → pull au session-start, pas temps reel
- Conflits : last-write-wins (pas 3-way merge, YAGNI solo)
- Hooks opt-in default OFF (pas de casse session si MCP down)

## References

- Spec canonique : `docs/core/product.md`
- Plan creation : `.archive/plans-done-260419/2026-04-19-product-module-full-integration.md` (archive apres P5)
- Decision : D-PRODUCT-01
- Related concepts : [[Foundation OS]], [[Core OS]], [[Body]], [[Notion integration]]
