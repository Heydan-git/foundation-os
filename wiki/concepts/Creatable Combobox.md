---
type: concept
title: "Creatable Combobox"
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
  - creatable
status: seed
related:
  - "[[index-concepts]]"
  - "[[vzkiss-flowkit-ui]]"
  - "[[vzkiss]]"
  - "[[shadcn/ui]]"
  - "[[Shadcn-complement library]]"
  - "[[Shadcn Block Libraries Landscape 2026-04]]"
sources:
  - "[[vzkiss-flowkit-ui]]"
---

# Creatable Combobox

## Definition

Composant form combinant **multiselect + autocomplete + ability de creer des items a la volee**. L'user peut :
1. Selectionner des items pre-existants dans une liste
2. Taper pour filtrer / rechercher
3. **Creer** un nouvel item si la saisie ne match aucun existant
4. Selectionner multiple items simultanement

Patterns similaires : **tag input with autocomplete + creatable**.

## How It Works

Structure UI :
1. Input + pills (chips) pour les items selectionnes
2. Popover avec liste filtree au fur et a mesure de la saisie
3. Option "Create [user input]" en bas de la liste si pas de match exact
4. Click sur item existant → ajout aux pills
5. Enter sur input non-match → crea nouvel item + ajout aux pills
6. Backspace vide → retire dernier pill

Implementation React typique :
- `Popover` + `Command` (cmdk) pour la liste + search
- `Input` controle pour la saisie
- State : `selected: Item[]` + `search: string`
- Callback : `onCreate(newLabel)` pour persist le nouvel item

## Why It Matters

**Gap officiel shadcn/ui** : shadcn a un Combobox pattern (Popover + Command) mais **pas de creatable variant**. Pattern frequemment reclame pour :
- **Tags dynamiques** : blog posts, tickets, knowledge items
- **Assignees libres** : task assignment without preset list
- **Custom categories** : user-defined hierarchies
- **Skills / competencies** : onboarding forms

## Cas d'usage Foundation OS potentiels

- **Wiki tagging** : ajouter tags custom sans preset list
- **App Builder** : categoriser sections custom par projet
- **Phase 5 Sante** : symptomes personnalises hors liste standard
- **Phase 5 Trading** : tagger paires custom ou notes
- **Task manager** (si ajout Phase 5+) : assignees / labels dynamiques

## Implementation reference

[[vzkiss-flowkit-ui|Flowkit UI]] (vzkiss) propose un Creatable Combobox base [[Base UI]] primitives. **Early-stage** (10 stars, 0 forks, no releases) — recommandation : **reecrire from scratch sur [[Radix UI]] + cmdk** plutot qu'adopter Flowkit comme dep.

Effort estime Foundation OS : 2-4h (Radix Popover + cmdk Command + creatable logic + re-theme `--ds-*`).

## Connections

- [[vzkiss-flowkit-ui]] — implementation reference (early-stage)
- [[vzkiss]] — maintainer
- [[shadcn/ui]] — ecosysteme parent (gap officiel)
- [[Shadcn-complement library]] — positioning categorie
- [[Shadcn Block Libraries Landscape 2026-04]] — context batch analyse

## Variants connus

- **Async creatable** : validation serveur apres saisie (eviter doublons)
- **With hierarchy** : creatable + parent category selection (combine avec [[Cascader pattern]])
- **With icons** : rendering custom par item (tag color, avatar, etc.)

## Sources

- [[vzkiss-flowkit-ui]] — Flowkit UI implementation
