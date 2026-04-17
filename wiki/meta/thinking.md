---
type: meta
title: "Thinking — Réflexions autonomes"
updated: 2026-04-16
tags:
  - meta
  - thinking
  - neuroplasticity
status: evergreen
related:
  - "[[index-meta]]"
  - "[[sessions-recent]]"
  - "[[lessons-learned]]"
  - "[[foundation-os-map]]"
  - "[[index-wiki]]"
---

# Thinking — Réflexions autonomes

> Questions ouvertes, hypotheses, connexions cross-domain, insights.
> Enrichi par Claude EN SESSION quand un insight emerge. Kevin peut lire pour voir "comment Claude pense".

## Questions ouvertes

- Le [[Compounding Knowledge]] s'applique-t-il aux backtests Trading ? Chaque backtest enrichit la comprehension marche, pas juste la strategie testee. Explorer quand module Trading demarre.
- Comment structurer le conseil sante multi-agents (Phase 5) ? Chaque agent (cardio, nutrition, sommeil) consulte wiki/domains/sante/ independamment puis synthese cross-agent. Pattern a designer.
- Est-ce que les Routines Cloud peuvent generer des pages wiki/meta/memory-health-report.md automatiquement ? Tester avec premiere routine.

## Hypotheses

- L'architecture 5 tiers memoire est probablement sur-segmentee pour un dev solo. A terme, auto-memory (profile/feedback) pourrait fusionner avec wiki/ (tout dans un seul vault). Mais pour l'instant, la separation est utile car auto-memory est lu AUTO par Claude Code (pas besoin de commande).

## Connexions cross-domain

- [[LLM Wiki Pattern]] + Trading : le pattern "pre-compiler sources en wiki" s'applique parfaitement aux whitepapers trading (Jegadeesh, Asness, etc.). Le wiki/domains/trading/ est deja scaffolde pour ca.
- [[Hot Cache]] + Sante : un "hot cache sante" pourrait tracker les derniers biomarkers de Kevin (TSH, ferritine, vit D) pour que chaque session sante commence avec les valeurs recentes.

## Insights cette session (2026-04-17 mapping refactor)

- **Sources verite multiples = source de drift silencieux.** Avant refactor : 4 sources pour wiki counts (counts.md, hot.md, overview.md, index-wiki.md) avec valeurs divergentes (45/48/50/791/804). Apres : 1 source (counts.md regeneree par script), les 5 consumers pointent vers `[[counts]]`. Pattern applicable ailleurs : chaque fois qu'une metrique apparait dans > 1 fichier, soit source unique + pointers, soit regen auto par script.
- **Hubs surdimensionnes crashent a 500+ pages.** foundation-os-map.md a 81 wikilinks aurait eu 500+ a Phase 5 lancee. Pattern mesh (1 hub niveau 1 + 7 sous-indexes niveau 2) > pattern etoile (1 hub + N feuilles) pour scalabilite.
- **Categories vides depuis 1 mois = supprimer.** comparisons/, questions/, canvases/ scaffoldes mais 0 pages depuis adoption wiki 2026-04-15. Pas d'usage emerging. Suppression propre + recreer en 30s si besoin > garder dossiers vides qui polluent graph.
- **Frontieres vault strictes evitent confusion.** DS components `[[01-button]]..[[46-carousel]]` resolvent vers `modules/design-system/docs-supernova/` (vault=racine D-VAULT-01). Mais pas navigable si vault restreint wiki/. Solution : backtick paths explicites = signal "ce n'est pas une page wiki".

## Insights cette session (2026-04-16)

- L'adoption wiki a revele que 90% du travail est STRUCTUREL (scaffold, docs, hooks, scripts) et 10% est CONTENU (ingest, pages). Le ratio s'inversera en Phase 5.
- Les wikilinks relatifs `../` ne fonctionnent pas dans Obsidian. Toujours utiliser basenames ou paths absolus vault.
- La carte neuronale (foundation-os-map) est un HACK necessaire pour connecter le graph. Un vrai vault mature n'en aurait pas besoin car les pages se cross-referenceraient naturellement. A surveiller : quand le wiki a 100+ pages, la carte devient-elle obsolete ?
