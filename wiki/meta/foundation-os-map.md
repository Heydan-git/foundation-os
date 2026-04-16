---
type: meta
title: "Foundation OS — Carte Complete"
updated: 2026-04-16
tags:
  - meta
  - map
  - index
status: evergreen
related:
  - "[[index-wiki]]"
  - "[[hot]]"
  - "[[overview]]"
  - "[[index-core-os]]"
  - "[[index-app]]"
  - "[[index-concepts]]"
  - "[[index-entities]]"
  - "[[index-sources]]"
  - "[[index-meta]]"
---

# Foundation OS — Carte Neuronale

> Hub central. Pointe vers les sous-index par famille — chaque sous-index detaille ses fichiers.
> Navigation incrementale : carte → sous-index → fichier. Economie de tokens.

Navigation : [[index-wiki]] | [[hot]] | [[overview]] | [[log]]

---

## Fichiers racine

- [[CLAUDE]] — Instructions Claude Code (imperatifs, automations, garde-fous)
- [[CONTEXT]] — Etat operationnel projet (source de verite)
- [[README|README (racine)]] — Description projet + structure + setup

---

## Core OS (9 specs)

> **Sous-index : [[index-core-os]]** — 7 modules + architecture + conventions

| Module | Spec |
|--------|------|
| Cortex | [[cortex]] |
| Communication | [[communication]] |
| Monitor | [[monitor]] |
| Tools | [[tools]] |
| Planner | [[planner]] |
| Worktrees | [[worktrees]] |
| Knowledge | [[knowledge]] |

Transversal : [[architecture-core]] | [[naming-conventions]]

Agents : `os-architect` `dev-agent` `doc-agent` `review-agent`
Commands : `cockpit` `session-start` `session-end` `plan-os` `wt` `new-project` `sync`

---

## Documentation (docs/)

- [[docs/index-documentation|index documentation]] — Navigation docs
- [[docs/architecture|architecture]] | [[docs/manifeste|manifeste]] | [[docs/setup-guide|setup-guide]]
- [[docs/decisions-log|decisions-log]] | [[docs/core/tools/README-tools-catalogue|README Tools]]

Specs historiques : [[2026-04-05-foundation-os-v2-design]] | [[2026-04-10-cockpit-design]] | [[2026-04-10-tools-module-v2-design]]

---

## Travaux Cowork

- [[docs/travaux-cowork/COWORK-CONTEXT|COWORK-CONTEXT]] | [[docs/travaux-cowork/README-cowork|README Cowork]]
- [[docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/index-dashboard-monitoring|Dashboard Monitoring]] (14 chapitres)
- [[docs/travaux-cowork/2026-04-13-evolution-core-os/index-evolution-core-os|Evolution Core OS]]
- [[docs/travaux-cowork/2026-04-14-briefs-foundation-os/index-briefs-foundation-os|Briefs FOS]]

---

## Modules Code

> **Sous-index : [[index-app]]** — App Builder pages + Design System

- [[modules/app/README-app-builder|App Builder]] — 7 pages, 5 routes, 19 tests
- [[design-system-components]] — 46 composants UI + 6 foundations
- [[CHANGELOG|CHANGELOG DS]] | [[modules/design-system/README-design-system|README DS]]

---

## Wiki — Knowledge Layer

> **Sous-index par famille :**

| Famille | Sous-index | Nb pages |
|---------|-----------|----------|
| Concepts | [[index-concepts]] | 11 |
| Entities | [[index-entities]] | 5 |
| Sources | [[index-sources]] | 4 |
| Meta | [[index-meta]] | 8+ |

### Domaines (5)

| Domaine | Index |
|---------|-------|
| Trading | [[wiki/domains/trading/index-trading|index-trading]] |
| Finance | [[wiki/domains/finance/index-finance|index-finance]] |
| Sante | [[wiki/domains/sante/index-sante|index-sante]] |
| Design | [[wiki/domains/design/index-design|index-design]] |
| Dev | [[wiki/domains/dev/index-dev|index-dev]] |

---

## Statistiques

| Type | Count |
|------|-------|
| Fichiers racine | 3 |
| Core OS (specs + agents + commands) | 9 + 4 + 7 |
| Documentation + specs historiques | 6 + 3 |
| Travaux Cowork | 19 |
| Modules code (app + DS) | 8 + 3 |
| Wiki (concepts + entities + sources + meta) | 11 + 5 + 4 + 8 |
| Wiki domaines | 5 |
| Sous-index | 6 |
| **Total connecte** | **~96** |
