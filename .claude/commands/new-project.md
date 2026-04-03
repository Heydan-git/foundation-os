# /new-project — Créer un nouveau projet dans Foundation OS

Créer la structure d'un nouveau projet géré par Foundation OS.

## Usage

```
/new-project [nom-du-projet]
```

Exemple : `/new-project ios-app-foundations`

## Ce que fait cette commande

1. Crée `projects/[nom]/` dans le repo foundation-os
2. Génère les fichiers de base du projet
3. Ajoute une entrée dans FOS-MONITORING.md
4. Crée la tâche Asana correspondante (si MCP actif)

## Structure créée

```
foundation-os/
└── projects/
    └── [nom-projet]/
        ├── PROJECT-CONTEXT.md     ← vision · stack · phase · décisions
        ├── PROJECT-JOURNAL.md     ← sessions du projet
        ├── PROJECT-BACKLOG.md     ← features · bugs · idées
        └── README.md              ← onboarding rapide
```

## Template PROJECT-CONTEXT.md

```markdown
# [Nom Projet]
> Projet géré par Foundation OS
> Créé : [date]

## Vision
[Vision courte du projet]

## Stack
[Technologies utilisées]

## Phase actuelle
[Phase en cours]

## Décisions clés
| ID | Décision | Date |
|---|---|---|

## Liens
- Asana : [lien]
- Figma : [lien]
- Vercel : [lien]
```

## Après création

- Ajouter le projet dans `fos-index.jsx` quand il sera produit
- Créer section Asana dédiée
- Si app iOS : utiliser le pipeline 8 phases (voir FOS-KNOWLEDGE-DATA.md)
