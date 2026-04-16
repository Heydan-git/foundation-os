---
type: concept
title: "Neuroplasticite"
complexity: advanced
domain: dev
aliases:
  - "Neuroplasticity"
  - "Auto-amelioration memoire"
created: 2026-04-16
updated: 2026-04-16
tags:
  - concept
  - neuroplasticity
  - memory
  - knowledge-management
status: seed
confidence: high
related:
  - "[[LLM Wiki Pattern]]"
  - "[[Hot Cache]]"
  - "[[thinking]]"
  - "[[sessions-recent]]"
  - "[[lessons-learned]]"
  - "[[knowledge]]"
sources: []
---

# Neuroplasticite

## Definition

Systeme d'auto-amelioration memoire de [[Foundation OS]]. Inspire de la neuroplasticite cerebrale : la memoire de Claude se renforce avec l'usage, cree de nouvelles connexions, et apprend de ses erreurs. Implemente via 4 reflexes obligatoires, 3 pages meta, et des routines cloud autonomes.

## How It Works

### 4 reflexes obligatoires (CLAUDE.md)

1. **Recall wiki** : avant de repondre sur un sujet technique/knowledge, grep le basename dans wiki/ → si page existe, la lire AVANT de formuler la reponse
2. **Consolidation post-ingest** : apres chaque /save ou wiki-ingest, verifier si les nouvelles pages enrichissent/contredisent des existantes → mettre a jour + callout `[!updated]`
3. **Lessons learned** : quand une erreur/piege est rencontree, l'ajouter dans [[lessons-learned]] avec date + contexte + fix
4. **Self-check session-end** : avant cloture, verifier sante memoire (wiki-health.sh) → signaler dans brief cloture

### 3 pages meta

- [[thinking]] — reflexions autonomes, hypotheses, connexions cross-domain (append libre)
- [[sessions-recent]] — 5 dernieres sessions (memoire court terme, append)
- [[lessons-learned]] — auto-apprentissage erreurs/pieges (append)

### Routines cloud autonomes

- **Quotidien** : wiki-health.sh (sante vault)
- **Hebdomadaire** : consolidation pages stale + drift detection
- **Loop.md** : maintenance memoire via /loop bare

## Why It Matters

Sans neuroplasticite, le wiki est un stockage passif. Avec, il devient un cerveau qui :

- Se rappelle proactivement du knowledge pertinent (reflexe 1)
- Se renforce a chaque ingestion (reflexe 2)
- Apprend de ses erreurs (reflexe 3)
- S'auto-diagnostique (reflexe 4)

Les 7 failles identifiees lors de l'audit post-adoption wiki (cerveau passif, tiers fragmentes, pas de consolidation, hot.md mono-session, pas de reflexion, pas d'auto-apprentissage, pas de self-check) sont toutes corrigees par ce systeme.

## Connections

- [[LLM Wiki Pattern]] — pattern fondateur sur lequel la neuroplasticite se greffe
- [[Hot Cache]] — composant cle (hot.md = memoire flash)
- [[knowledge]] — spec complete dans docs/core/knowledge.md section 8
- [[Foundation OS]] — systeme parent

## Sources

- [[session-2026-04-16-neuroplasticity-audit]]
