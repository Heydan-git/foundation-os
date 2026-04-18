---
type: concept
title: "Layered Loading"
complexity: intermediate
domain: meta
aliases:
  - "context layers L0-L3"
  - "incremental context loading"
  - "token discipline"
created: 2026-04-17
updated: 2026-04-17
tags:
  - concept
  - neuroplasticity
  - context
  - tokens
status: seed
confidence: high
related:
  - "[[index-concepts]]"
  - "[[Hot Cache]]"
  - "[[Neuroplasticite]]"
  - "[[Brief v12]]"
  - "[[Foundation OS]]"
sources: []
---

# Layered Loading

> [!success] **Status : implemente 2026-04-18** (Phase 5/5 D-INTEG-01). Spec canonique : `docs/core/communication.md` section 6.5.

## Definition

Formalisation du chargement context en 4 layers **L0-L3** (inspire MemPalace). Chaque layer a un **budget tokens** et un **trigger** precis. Claude peut choisir quels layers charger en fonction du type de tache, evitant de tout lire d'un coup.

| Layer | Contenu | Tokens cible | Trigger |
|-------|---------|--------------|---------|
| **L0** | `wiki/hot.md` | < 200 | Hook SessionStart auto |
| **L1** | `CONTEXT.md` + `wiki/meta/sessions-recent.md` | < 2 000 | `/session-start` Tour 1 |
| **L2** | `wiki/meta/lessons-learned.md` + `wiki/meta/thinking.md` + plans actifs | < 10 000 | `/session-start` Tour 1 (suite) |
| **L3** | Pages wiki (concepts, entities, sources, domains) | on-demand | Reflex 1 recall wiki |

## How It Works

1. **L0** est charge automatiquement par le hook `scripts/hooks/session-start-wiki.sh` a chaque SessionStart. Garantie : contexte minimum < 200 tokens.
2. **L1** est charge en Tour 1 parallele de `/session-start` ou `/cockpit`. Donne etat operationnel courant + memoire court terme 5 sessions.
3. **L2** complete le Tour 1 avec apprentissage cross-session (lessons-learned, thinking, plans en cours).
4. **L3** n'est jamais charge en bloc. Seulement via `grep wiki/` + `Read wiki/<page>.md` cible, declenche par reflex 1 neuroplasticite quand la tache touche un domaine precis.

## Why It Matters

- **Discipline tokens** : Kevin Max x20 certes, mais charger 50k tokens pour repondre a un typo = gaspillage + latence.
- **Strategie par type de tache** :
  - Tache triviale (typo, clarif) : **L0 seul**
  - Bug fix / small feature : **L0 + L1**
  - Refactor / audit : **L0 + L1 + L2**
  - Architecture / nouveau domaine : **L0 + L1 + L2 + L3 cible**
- **Anti-compactage** : contexte leger = sessions plus longues avant compaction forcee.
- **Reflex 1 recall** preserve : L3 reste on-demand, jamais pre-loaded, evite surcharge.

## Examples

- Kevin dit "fix typo dans hot.md" → charger L0 suffit.
- Kevin dit "audit v2 mapping cerveau" → L0 + L1 + L2 (plans actifs lus) + L3 cible (foundation-os-map + concepts hub).
- Kevin demande "statut cap" → L0 + L1 (pas besoin lessons ni thinking).
- Nouveau Claude en session froide → hook SessionStart donne L0. Ensuite `/session-start` charge L1+L2.

## Connections

- [[Hot Cache]] — L0 implementation concrete via wiki/hot.md
- [[Neuroplasticite]] — reflex 1 declenche L3 cible
- [[Brief v12]] — format de sortie apres chargement L0+L1+L2
- [[Foundation OS]] — discipline cognitive, pragmatique/fonctionnel
- [[Pre-compaction Snapshot]] — capture L0+L1 avant compaction auto

## Sources

- [MemPalace](https://github.com/MemPalace/mempalace) — 4 layers incremental loading, 170 tokens startup (L0+L1 combine)
- Plan : `.archive/plans-done-260418/2026-04-17-integration-sources-externes.md` Phase 5
- Spec canonique (post Phase 5) : `docs/core/communication.md` section 6.5
- Seuils : `scripts/thresholds.json` section `wiki.layered_loading`
