---
type: concept
title: "Cascader pattern"
complexity: intermediate
domain: design
created: 2026-04-19
updated: 2026-04-19
confidence: high
tags:
  - concept
  - ui-pattern
  - component
  - form-controls
  - hierarchical
status: seed
related:
  - "[[index-concepts]]"
  - "[[ademking-cascader-shadcn]]"
  - "[[Ademking]]"
  - "[[shadcn/ui]]"
  - "[[Shadcn Block Libraries Landscape 2026-04]]"
sources:
  - "[[ademking-cascader-shadcn]]"
---

# Cascader pattern

## Definition

Composant UI de **selection hierarchique multi-niveau**. L'user navigue progressivement entre des niveaux dependants (niveau N depend du choix fait au niveau N-1). Pattern classique pour selectionner des donnees structurees en arbre.

Exemples canoniques :
- **Location picker** : Pays → Region → Ville
- **Category picker** : Categorie → Sous-categorie → Item
- **Organizational picker** : Departement → Equipe → Personne
- **Dev trading** (Phase 5 FOS) : Paire crypto → Timeframe → Strategy
- **Dev sante** (Phase 5 FOS) : Specialite → Symptome → Protocole

## How It Works

Structure UI typique :
1. Bouton trigger (Popover/Select) qui montre la selection actuelle ou placeholder
2. Popover avec colonnes en cascade : chaque colonne represente un niveau
3. Click sur item niveau N → charge/affiche les items niveau N+1
4. Selection finale = chemin complet (ex: `France → Île-de-France → Paris`)
5. Integration form : retourne un tableau ou un objet serialise

Implementation React typique :
- `Popover` (ou `DropdownMenu`) pour le trigger
- `Command` (cmdk) pour la recherche dans chaque niveau
- Data structure : arbre recursif `{ value, label, children?: Item[] }`
- Support async : fetch children a la demande (pour grosses hierarchies)

## Why It Matters

**Gap officiel shadcn/ui** : pas de composant natif cascader dans le catalog officiel. Plusieurs ports communautaires existent — [[ademking-cascader-shadcn|Cascader ShadCN]] (Ademking, 76 stars) est le plus populaire.

Pour **Foundation OS**, le pattern est utile si un cas d'usage hierarchical concret emerge (Phase 5 modules Trading/Sante/Finance). Adoption trivial si [[ademking-cascader-shadcn|Cascader ShadCN]] est port (effort S, ~30min-1h).

## Cas d'usage Foundation OS potentiels

- **Phase 5 Trading** : paire crypto > timeframe > strategy
- **Phase 5 Sante** : specialite > symptome > protocole
- **Phase 5 Finance** : compte > sous-compte > categorie transaction
- **App Builder** : projet > page > section
- **Knowledge wiki** : domaine > concept > entity

## Connections

- [[ademking-cascader-shadcn]] — implementation shadcn de reference
- [[Ademking]] — maintainer
- [[shadcn/ui]] — ecosysteme parent (gap officiel)
- [[Shadcn Block Libraries Landscape 2026-04]] — context batch analyse

## Variants connus

- **Async cascader** : fetch niveaux a la demande (grosses hierarchies)
- **Multi-select cascader** : selectionner plusieurs chemins
- **Searchable cascader** : recherche globale dans tous les niveaux

## Sources

- [[ademking-cascader-shadcn]] — demo + repo GitHub
