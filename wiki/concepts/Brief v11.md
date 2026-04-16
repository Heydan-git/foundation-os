---
type: concept
title: "Brief v11"
complexity: intermediate
domain: dev
aliases:
  - "Brief session"
  - "Brief v11 TDAH"
created: 2026-04-16
updated: 2026-04-16
tags:
  - concept
  - brief
  - tdah
  - communication
status: seed
confidence: high
related:
  - "[[communication]]"
  - "[[Foundation OS]]"
  - "[[Hot Cache]]"
sources: []
---

# Brief v11

## Definition

Format de brief de session TDAH-friendly utilise dans [[Foundation OS]]. 14 sections structurees avec cadres box-drawing, emojis couleur, barres de progression 12 blocs, et indicateurs de tendance. Concu pour le scanning rapide et l'alignement visuel strict.

## How It Works

### Structure 14 sections

Le brief v11 suit un format rigide defini dans `docs/core/communication.md` section 6 :

1. Entete double trait avec emoji status
2. Etat modules avec barres progression
3. Sessions recentes
4. Health monitoring
5. Decisions actives
6. Cap strategique
7. Prochaines actions
8. Risques
9. Metriques cles
10. Wiki/knowledge status
11. Worktrees actifs
12. Plans en cours
13. Tendances
14. Cloture

### Elements visuels

- **Emojis couleur** : 🟢 OK / 🟡 attention / 🔴 critique / 🔵 info / ⚪ inactif / ⚫ bloque / 🔮 futur
- **Barres 12 blocs** : `████████░░░░` (8/12 = 67%)
- **Tendance** : ▲ hausse / ▶ stable / ▼ baisse
- **Cadres** : caracteres box-drawing pour separation visuelle

## Why It Matters

Kevin est TDAH. Les briefs traditionnels en prose sont difficiles a scanner. Le format v11 permet :

- **Scanning rapide** : zones visuelles distinctes, pas de paragraphes denses
- **Alignement strict** : chaque section a sa place previsible
- **Couleurs semantiques** : status visible en un coup d'oeil sans lire le texte
- **Progression quantifiee** : barres 12 blocs pour tracking visuel immediat

## Connections

- [[communication]] — spec complete dans docs/core/communication.md section 6
- [[Foundation OS]] — systeme parent
- [[Hot Cache]] — le brief v11 inclut le status wiki/hot.md
- [[TDAH workflow]] — adaptations TDAH globales dont le brief fait partie

## Sources

- [[session-2026-04-16-wiki-adoption]]
