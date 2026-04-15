---
type: domain-index
title: "finance"
updated: 2026-04-15
tags:
  - domain-index
  - finance
status: evergreen
related:
  - "[[../../index]]"
---

# Domaine : finance

Knowledge layer pour module `modules/finance/` (Phase 5) : gestion patrimoine perso, fiscalite, decisions d'investissement, regulations.

## Sous-dossiers

- `concepts/` — PER, PEA, SCPI, assurance-vie, LMNP, fiscalite, diversification, etc.
- `sources/` — articles patrimoine, regulations (BOFiP, Code General des Impots), ouvrages finance perso
- `decisions/` — decisions d'investissement Kevin (dates, montants, raisons, revues)

## Couplage code

Module `modules/finance/` (Phase 5) peut consulter :
- `wiki/domains/finance/concepts/` pour tax rules
- `wiki/domains/finance/decisions/` pour historique decisions

Le code module peut aussi generer des pages finance automatiquement via skills custom (post-adoption).

## Pages recentes

Aucune pour l'instant (Phase 5 non demarree).

## Cross-references cles

- [[../../entities/|Entities cross-domain]] (banques, courtiers, conseillers)
- [[../trading/|Trading]] (crossover investissement actif/passif)

## Workflows specifiques

- Ingest article fiscal web → `.raw/finance/` → `wiki-ingest` → page source + concepts cree
- Decision patrimoine nouvelle → `/save decision [nom]` → `wiki/domains/finance/decisions/`
- Skills custom futurs : `wiki-finance-tax-extract` (~2h, Phase 5)

## Sensibilite

Donnees perso (montants, comptes, cles) = **JAMAIS** dans wiki/. Uniquement synthese + decisions.
Secrets dans `modules/finance/secrets/` (gitignored).
