---
type: concept
title: "Brief v12"
complexity: intermediate
domain: dev
aliases:
  - "Brief session"
  - "Brief v12 TDAH"
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
  - "[[index-concepts]]"
  - "[[communication]]"
  - "[[Foundation OS]]"
  - "[[Hot Cache]]"
  - "[[TDAH workflow]]"
sources: []
---

# Brief v12

## Definition

Format de brief de session TDAH-friendly utilise dans [[Foundation OS]]. 14 sections structurees en tuiles Markdown (blockquote `>` + `####`), emojis couleur, barres de progression 12 blocs, et indicateurs de tendance. Concu pour le scanning rapide et l'alignement visuel strict. PAS de caracteres box-drawing terminal.

## How It Works

### Structure 14 sections

Le brief v12 suit un format rigide defini dans `docs/core/communication.md` section 6 :

1. **SANTE** `🏥` : table build/tests/refs/css/wiki/drift, verdict en bold
2. **HOT** `🔥` : 3-5 lignes condensees de wiki/hot.md + Next action
3. **TRAJECTOIRE** `🧭` : table mission/focus/tendance/derniere
4. **PLANS** `📋` : progression + hier + prochain + reste par plan actif
5. **WIKI** `📚` : table pages/domaines/ingest/stale + couverture domaines
6. **MODULES** `📦` : sous-groupes Code/Meta/Prevu + liens acces
7. **ATTENTION** `⚠️` : sous-groupes Alertes + En attente Kevin (checklist)
8. **SYNC** `🔄` (optionnel) : si drift-detector exit 1, table drifts + fix
9. **DERNIER TRAVAIL** `🔨` : N commits + table batches + decisions
10. **STATUT** `📊` : barres progression modules
11. **IDEES** `💡` : table emoji + description
12. **REFLEXION** `🤔` : bullets courtes
13. **HISTORIQUE** `📜` : table 3 decisions recentes
14. **CAP + INPUT** `🎯📥` : direction + prochaines actions + choix Kevin

### Elements visuels

- **Emojis couleur** : 🟢 OK / 🟡 attention / 🔴 critique / 🔵 info / ⚪ inactif / ⚫ bloque / 🔮 futur
- **Barres 12 blocs** : `████████░░░░` (8/12 = 67%)
- **Tendance** : ▲ hausse / ▶ stable / ▼ baisse
- **Tuiles** : blockquote `>` contenant `####` titre + contenu + tables Markdown
- **Separateur** : `---` (horizontal rule) entre chaque tuile

### Rendu Markdown natif

Le brief v12 est du **Markdown natif** — Claude Desktop rend les blockquotes comme des blocs gris, les tables comme des tableaux. **INTERDITS** : `┌─┐│└┘╔═╗╚╝` (caracteres box-drawing terminal). Utiliser uniquement `>`, `####`, `| |`, `**bold**`, `---`.

## Why It Matters

Kevin est TDAH. Les briefs traditionnels en prose sont difficiles a scanner. Le format v12 permet :

- **Scanning rapide** : tuiles visuellement delimitees, pas de paragraphes denses
- **Alignement strict** : chaque section a sa place previsible
- **Couleurs semantiques** : status visible en un coup d'oeil sans lire le texte
- **Progression quantifiee** : barres 12 blocs pour tracking visuel immediat
- **Compatibilite Desktop** : Markdown natif, rendu optimal dans Claude Desktop

## Connections

- [[communication]] — spec complete dans docs/core/communication.md section 6
- [[Foundation OS]] — systeme parent
- [[Hot Cache]] — le brief v12 inclut le status wiki/hot.md (section HOT)
- [[TDAH workflow]] — adaptations TDAH globales dont le brief fait partie

## Sources

