---
type: domain-index
title: "sante"
updated: 2026-04-15
tags:
  - domain-index
  - sante
  - meta
status: evergreen
related:
  - "[[index-wiki]]"
---

# Domaine : sante

> [!placeholder] **Phase 5 non-demarree** (2026-04-17)
> Ce domaine est scaffolde mais 100% vide (aucune page `concepts/`, `sources/`, `bilans/`, `protocoles/`). Il sera actif quand le module `modules/sante/` sera lance (decision Kevin Phase 5).
> **Pour demarrer** : ingerer un paper PubMed via `.raw/sante/` + `wiki-ingest` OU creer concept (ex: TSH, ferritine, chronobiologie).

Knowledge layer pour module `modules/sante/` (Phase 5) : suivi bio, protocoles, papers medicaux, conseil sante multi-agents.

## Sous-dossiers

- `concepts/` — biomarkers (TSH, ferritine, vitamine D, etc.), protocoles (jeune intermittent, cold exposure, supplements), pathologies
- `sources/` — papers medicaux (PubMed), articles recherche, livres sante evidence-based
- `bilans/` — synthese bilans bio Kevin (valeurs, evolution, notes) ; raw scans dans `modules/sante/data/` (gitignored)
- `protocoles/` — regimes, supplements, sport, sommeil, chronobiologie

## Couplage code

Module `modules/sante/` (Phase 5) :
- Lit `wiki/domains/sante/protocoles/` pour recommendations
- Ecrit synthese bilans dans `wiki/domains/sante/bilans/` apres extraction
- Raw bilans PDF dans `modules/sante/data/` (jamais dans wiki)

## Cas d'usage futur : conseil sante multi-agents

Plusieurs agents specialises (cardio, nutrition, sommeil, hormonal, mental) consultent wiki :
- Chaque agent lit ses `concepts/` + `sources/` pertinents
- Synthese cross-agent pour plan sante personnalise Kevin
- Trackage evolution biomarkers dans `bilans/`

## Pages recentes

Aucune pour l'instant (Phase 5 non demarree).

## Cross-references cles

- [[index-wiki|Concepts cross-domain]] (biochimie, physiologie partages)
- [[index-wiki|Entities cross-domain]] (medecins, chercheurs, labs)

## Sensibilite

Donnees sante perso = **privacy-first**. Synthese OK dans wiki/, raw scans JAMAIS.
`modules/sante/data/` gitignored. Repo reste prive.

## Workflows specifiques

- Nouveau bilan PDF → `modules/sante/data/` (gitignored) → extract valeurs → synthese `wiki/domains/sante/bilans/YYYY-MM-bilan.md`
- Paper PubMed → `.raw/sante/` → `wiki-ingest` → concepts + sources
- Skills custom futurs : `wiki-sante-bilan-extract` (~2h, Phase 5)
