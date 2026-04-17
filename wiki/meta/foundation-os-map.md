---
type: meta
title: "Foundation OS — Carte Neuronale"
updated: 2026-04-17
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
  - "[[index-concepts]]"
  - "[[index-entities]]"
  - "[[index-sources]]"
  - "[[index-meta]]"
  - "[[index-cowork]]"
---

# Foundation OS — Carte Neuronale

> **Hub niveau 2** : pointe vers les sous-indexes par famille. Pour navigation niveau 1, utiliser [[index-wiki]]. Cette carte liste les *relations hub → sous-index*, pas les pages individuelles (qui vivent dans leurs sous-indexes respectifs).

Navigation : [[index-wiki]] | [[hot]] | [[overview]]

---

## Racine projet

- [[CLAUDE]] — Instructions Claude Code (imperatifs, automations, garde-fous)
- [[CONTEXT]] — Etat operationnel (source de verite)
- [[README|README (racine)]] — Description projet

## Core OS (7 modules + Cockpit)

> Sous-index : [[index-core-os]]

Concepts canoniques (a lire pour comprendre l'OS) : [[Foundation OS]] · [[Core OS]] · [[LLM Wiki Pattern]] · [[Neuroplasticite]] · [[Brief v12]] · [[TDAH workflow]] · [[Void Glass]]

## Documentation (docs/)

Hubs principaux (wikilinks pour graph Obsidian) :
- [[docs/architecture|Architecture globale]]
- [[docs/manifeste|Manifeste]]
- [[docs/setup-guide|Setup guide]]
- [[docs/decisions-log|Decisions archivees]]
- [[docs/index-documentation|Index documentation]]
- [[docs/core/tools/README-tools-catalogue|README Tools Catalogue]]
- [[docs/specs/README|Specs README]]
- [[_template-plan|Template plan Foundation OS]]

## Travaux Cowork

> Sous-index : [[index-cowork]]

## Modules Code

- App Builder : [[modules/app/README-app-builder|README App]]
- Design System : [[modules/design-system/README-design-system|README DS]] · domaine wiki [[index-design]]
- Phase 5 (prevus) : [[index-trading|Trading]] · [[index-finance|Finance]] · [[index-sante|Sante]]

## Wiki Knowledge Layer

| Type | Sous-index | Count |
|------|-----------|-------|
| Concepts | [[index-concepts]] | voir [[counts]] |
| Entities | [[index-entities]] | voir [[counts]] |
| Sources | [[index-sources]] | voir [[counts]] |
| Meta | [[index-meta]] | voir [[counts]] |
| Domaines | 5 (dans [[index-wiki]] section Domaines) | voir [[counts]] |

## Neuroplasticite (memoire active)

Pages meta lues en SessionStart : [[hot]] · [[sessions-recent]] · [[lessons-learned]] · [[thinking]]

---

## Enhancements 2026 (D-INTEG-01)

4 features integrees 2026-04-17 depuis sources externes (MemPalace / Graphify) :

| Feature | Concept | Implementation (Phase) |
|---------|---------|------------------------|
| Auto-save pre-compression | [[Pre-compaction Snapshot]] | `scripts/hooks/pre-compaction-snapshot.sh` (Phase 2) |
| Confidence systematique | [[Confidence Tagging]] | `scripts/wiki-confidence-audit.sh` (Phase 3) |
| Graph report auto | [[Graph Report]] | `scripts/wiki-graph-report.sh` + `wiki/meta/graph-report.md` (Phase 4) |
| Layered loading formel | [[Layered Loading]] | `docs/core/communication.md` section 6.5 (Phase 5) |

Spec : `docs/core/knowledge.md` section 12. Plan : `docs/plans/2026-04-17-integration-sources-externes.md`.

---

## Statistiques

> Stats wiki : voir [[counts]]. Cette carte liste les *relations*, pas les counts.
