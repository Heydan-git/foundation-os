# /new-project — Creer un nouveau module Foundation OS

## Usage
/new-project [nom-du-module]

Exemple : /new-project finance

## Workflow

1. Creer `modules/[nom]/` avec structure de base
2. Mettre a jour CONTEXT.md (ajouter le module dans la table Modules, status "initialise")
3. Annoncer ce qui a ete cree

## Structure creee

```
modules/[nom]/
├── README.md          Description du module
├── package.json       Si module JS/TS
└── src/               Code source
```

## Template README.md

```markdown
# [Nom Module]
> Module Foundation OS — Cree le [date]

## Objectif
[A definir]

## Stack
[A definir]

## Etat
En cours de definition.
```

## Apres creation

- CONTEXT.md mis a jour (section Modules)
- Decider de la stack avec Kevin avant de coder
- Ne PAS creer de fichiers supplementaires sans demande
