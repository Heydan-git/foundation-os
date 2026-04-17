---
type: concept
title: "TDAH workflow"
complexity: intermediate
domain: dev
aliases:
  - "ADHD workflow"
  - "Workflow TDAH"
created: 2026-04-16
updated: 2026-04-16
tags:
  - concept
  - tdah
  - workflow
  - accessibility
status: seed
confidence: high
related:
  - "[[index-concepts]]"
  - "[[Brief v12]]"
  - "[[Foundation OS]]"
  - "[[communication]]"
  - "[[Neuroplasticite]]"
sources: []
---

# TDAH workflow

## Definition

Ensemble d'adaptations du workflow [[Foundation OS]] pour le profil TDAH de Kevin. Chaque composant du systeme est concu pour minimiser la charge cognitive, maximiser la visibilite de l'etat, et eviter les sessions trop longues ou les pertes de contexte.

## How It Works

### Briefs visuels

Le [[Brief v12]] est le composant central : 14 sections avec cadres box-drawing, emojis couleur semantiques (🟢🟡🔴), barres progression 12 blocs, tendances (▲▶▼). Scanning rapide sans lecture de prose.

### TodoWrite tracking

Toute tache >= 3 etapes passe par TodoWrite pour tracking visible dans le tasks pane Desktop. Une seule tache `in_progress` a la fois. Update immediat a chaque changement d'etat. Zero orphelines en fin de session.

### Sessions courtes et decoupees

Les plans multi-session sont decoupes en phases avec 6 elements stricts (pre-conditions, etat repo, actions atomiques, verification, rollback, commit). Chaque phase est autonome — reprise possible apres compactage ou cold restart.

### Questions groupees

Lors d'un plan, toutes les questions de clarification sont posees en debut de session (frontloaded). L'execution se fait ensuite sans interruption — evite les allers-retours qui cassent le flow TDAH.

### Communication directe

Pas de jargon dense non-explique. Hierarchise, visuel, droit au but. Jamais de paragraphes longs sans structure. Zero auto-congratulation.

## Why It Matters

Le TDAH affecte la memoire de travail, la regulation de l'attention, et la planification. Foundation OS compense ces difficultes via :

- **Externalisation memoire** : 5 tiers memoire + wiki (rien a retenir)
- **Visibilite etat** : briefs, barres, emojis (pas besoin de chercher)
- **Fragmentation** : phases courtes, actions atomiques (pas de monolithe)
- **Predictibilite** : formats fixes, conventions auto (pas de decisions a prendre sur le format)

## Connections

- [[Brief v12]] — format de brief TDAH-friendly
- [[Foundation OS]] — systeme parent
- [[communication]] — spec briefs dans docs/core/communication.md
- [[Neuroplasticite]] — self-check session-end previent les oublis

## Sources

