# /new-project — Creer un nouveau module Foundation OS

## Usage
/new-project [nom-du-module]

Exemple : /new-project finance

## Execution

Lancer le script : `bash scripts/module-scaffold.sh [nom-du-module]`

Le script automatise tout le workflow ci-dessous (idempotent, kebab-case valide, rollback en cas d'erreur). Voir `docs/core/tools.md` pour la spec.

## Workflow (couvert par module-scaffold.sh)

1. Creer `modules/[nom]/` avec structure de base
2. Mettre a jour CONTEXT.md (ajouter le module dans la table Modules, status "initialise")
3. Annoncer ce qui a ete cree

## Structure creee

Voir `scripts/module-scaffold.sh` pour le detail exact (source unique du template README et de la structure).

## Apres creation

- CONTEXT.md mis a jour (section Modules)
- Decider de la stack avec Kevin avant de coder
- Ne PAS creer de fichiers supplementaires sans demande

## Sortie attendue

```
Module cree : modules/[nom]/
Structure  : README.md + package.json + src/
CONTEXT.md : mis a jour (section Modules)
Next       : decider stack avec Kevin
```
