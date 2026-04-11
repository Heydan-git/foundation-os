# Tools Module v2 — Design Spec

> Spec validee le 2026-04-10. Brainstorm complet avec Kevin.

## 1. Objectif

Transformer le module Core OS Tools d'un simple inventaire de scripts en une **toolbox complete** :
- Catalogue exhaustif de tous les outils (scripts, hooks, commands, agents, skills OMC/Superpowers/BMAD, MCP, CI/CD)
- Documentation precise de chaque outil (quoi, quand, comment, exemples)
- Format dual JSON (machine-readable pour dashboard) + MD (lisible)
- Routing intelligent etendu (signal → meilleur outil, autonome)
- Detection de patterns et proposition de nouveaux outils
- Script CLI pour ajouter/documenter/classer des outils

## 2. Structure de fichiers

```
docs/core/tools/
├── index.json              # Agregateur — metadata de tous les outils
├── README.md               # Vue lisible auto-generee depuis les JSON
├── registry/
│   ├── scripts.json        # Scripts bash/node (health-check, sync-check, etc.)
│   ├── hooks.json          # Hooks Claude + git hooks
│   ├── commands.json       # Commands Claude (/cockpit, /session-start, etc.)
│   ├── agents.json         # Agents Claude (dev, architect, review, doc)
│   ├── skills-omc.json     # Skills oh-my-claudecode (~40)
│   ├── skills-superpowers.json  # Skills Superpowers (~15)
│   ├── skills-bmad.json    # Skills BMAD (12)
│   ├── mcp.json            # MCP servers (Asana, Notion, Figma, etc.)
│   └── ci.json             # CI/CD (Vercel, GitHub Actions)
├── routing.json            # Table etendue signal → outil
└── patterns.json           # Patterns detectes pour proposition de nouveaux skills

scripts/
└── tool-register.sh        # CLI pour ajouter/documenter un outil
```

Le `docs/core/tools.md` existant reste comme spec du module (principes, conventions, limites). Le catalogue vit dans `docs/core/tools/`.

## 3. Schema d'un outil

Chaque outil dans les JSON de `registry/` suit le meme schema :

```json
{
  "id": "string — identifiant unique kebab-case",
  "name": "string — nom affichable",
  "category": "string — script|hook|command|agent|skill-omc|skill-superpowers|skill-bmad|mcp|ci",
  "path": "string — chemin fichier ou namespace (ex: oh-my-claudecode:autopilot)",
  "description": "string — une phrase, ce que l'outil fait",
  "usage": "string — comment l'invoquer",
  "triggers": ["string — mots-cles qui declenchent la suggestion"],
  "when_to_use": "string — contexte ou cet outil est le bon choix",
  "when_not_to_use": "string — contexte ou ne pas l'utiliser",
  "depends_on": ["string — dependances"],
  "outputs": "string — ce que l'outil produit",
  "examples": [
    {
      "situation": "string — quand",
      "command": "string — comment",
      "result": "string — resultat attendu"
    }
  ],
  "auto_routing": "boolean — si true, utilisable sans demander a Kevin",
  "priority": "number — en cas de conflit, le plus haut gagne (1 = max)",
  "added": "string — date YYYY-MM-DD",
  "updated": "string — date YYYY-MM-DD"
}
```

Champs cles pour le routing intelligent :
- `triggers` — mots-cles qui declenchent la suggestion de cet outil
- `when_to_use` / `when_not_to_use` — contexte decisionnel
- `auto_routing` — si true, Claude peut l'utiliser sans demander
- `priority` — en cas de conflit entre outils, le plus haut gagne

## 4. Index

`index.json` agrege les metadata legeres de tous les outils :

```json
{
  "version": "1.0",
  "updated": "YYYY-MM-DD",
  "total_tools": 98,
  "categories": {
    "<category>": {
      "file": "registry/<category>.json",
      "count": 6
    }
  }
}
```

## 5. Routing etendu

`routing.json` etend la table Cortex avec tous les outils :

```json
{
  "version": "1.0",
  "rules": [
    {
      "signals": ["mots-cles qui declenchent cette regle"],
      "tools": ["outil-1", "outil-2"],
      "strategy": "priority | combine | best_match",
      "note": "explication du choix"
    }
  ],
  "strategies": {
    "priority": "Utiliser le premier outil, passer au suivant si insuffisant",
    "combine": "Utiliser plusieurs outils en sequence",
    "best_match": "Choisir l'outil dont les triggers matchent le plus le contexte"
  },
  "fallback": "Si aucune regle ne matche → traiter directement sans outil"
}
```

### Ordre de resolution (mise a jour Cortex)

```
Tache arrive
    |
    v
1. Match dans routing.json ? → utiliser l'outil/skill indique
2. Match dans table Cortex agents ? → deleguer a l'agent
3. Ambiguite → demander a Kevin
4. Aucun match → traiter directement
```

`routing.json` passe avant la table agents car il est plus granulaire.

## 6. Script tool-register.sh

### Usage

```bash
# Ajouter un outil
bash scripts/tool-register.sh add --category script --path scripts/mon-outil.sh

# Ajouter un skill OMC
bash scripts/tool-register.sh add --category skills-omc --id "oh-my-claudecode:autopilot"

# Scanner et detecter les outils non-enregistres
bash scripts/tool-register.sh scan

# Regenerer l'index et le README
bash scripts/tool-register.sh rebuild
```

### Mode scan

Compare les fichiers source vs les registres JSON :
- `scripts/*.sh` vs `registry/scripts.json`
- `.claude/commands/*.md` vs `registry/commands.json`
- `.claude/agents/*.md` vs `registry/agents.json`
- `_bmad/_config/skill-manifest.csv` vs `registry/skills-bmad.json`

Liste les manquants → propose de les ajouter.

Pour les outils complexes (skills, MCP), le script genere un squelette JSON. Claude complete la doc intelligente (`when_to_use`, `when_not_to_use`, `examples`) en lisant le source.

## 7. Detection de patterns

### patterns.json

```json
{
  "patterns": [
    {
      "id": "pattern-001",
      "description": "description du workflow repetitif",
      "occurrences": 3,
      "first_seen": "YYYY-MM-DD",
      "last_seen": "YYYY-MM-DD",
      "steps": ["commande 1", "commande 2"],
      "status": "detected | proposed | implemented | rejected",
      "proposed_tool": {
        "name": "nom-propose",
        "type": "script | skill",
        "description": "ce que l'outil ferait"
      }
    }
  ]
}
```

### Cycle de vie

1. **Detection** — Claude remarque une repetition → status `detected`
2. **Proposition** (3+ occurrences) — status `proposed`, signale a Kevin en fin de session
3. **Validation Kevin** → Claude cree l'outil, l'enregistre via tool-register, met a jour routing → status `implemented`
4. **Refus Kevin** → status `rejected` (ne plus reproposer)

### Regles

- Jamais de creation d'outil sans validation explicite de Kevin
- Seuil minimum : 3 occurrences avant proposition
- Signalement en fin de session (pas en plein travail)
- Chaque proposition inclut : ce que l'outil ferait, pourquoi, et le gain

### Mise a jour auto de la doc

Quand un outil existant evolue (DS change, script modifie) :
- En `/sync` ou `/session-start`, comparer le fichier source vs la doc dans le registre
- Si decalage detecte → mettre a jour la doc JSON automatiquement
- Pas de validation requise pour la mise a jour de doc (reflet, pas creation)

## 8. Integration dans l'OS existant

### Session-start — ajouts

4. Lire `docs/core/tools/index.json` → charger le catalogue en memoire de travail
5. Verifier `patterns.json` → signaler les patterns proposes non traites

### Cortex — extension

`docs/core/cortex.md` section 1 etendue avec reference a `routing.json` comme source primaire de routing.

### Sync — ajouts

- `tool-register.sh scan` → detecter outils non-enregistres
- Comparer sources vs doc registre → signaler les decalages

### CLAUDE.md — ajout

Section "Core OS — Tools" :
```
Catalogue complet : `docs/core/tools/index.json`. Routing etendu : `docs/core/tools/routing.json`.
En session-start, lire l'index pour le routing intelligent des outils.
```

### CONTEXT.md — mise a jour table Modules

Ajouter le detail Tools dans la ligne Core OS.

### Ce qui ne change PAS

- `docs/core/tools.md` reste la spec (principes, conventions)
- Les 4 agents gardent leur protocole
- Les commands gardent leur fonctionnement
- Les hooks Claude ne bougent pas

## 9. Perimetre de l'inventaire initial

Toutes les couches :

| Categorie | Source | Nb estime |
|-----------|--------|-----------|
| Scripts | `scripts/*.sh` | 6 |
| Hooks | `scripts/hooks/` + `.git/hooks/` | 4 |
| Commands | `.claude/commands/*.md` | 5 |
| Agents | `.claude/agents/*.md` | 4 |
| Skills OMC | Plugin oh-my-claudecode | ~40 |
| Skills Superpowers | Plugin superpowers | ~15 |
| Skills BMAD | `_bmad/core/` | 12 |
| MCP servers | MCP connectes | ~12 |
| CI/CD | Vercel + GitHub Actions | 2 |

Total estime : ~100 outils.

## 10. Hors scope (V2+)

- Dashboard UI (le catalogue JSON est pret pour consommation, mais le rendu UI est un chantier separe)
- Integration Asana/Notion pour tracker les outils (pas de besoin identifie)
- Tests automatises du routing (a evaluer apres usage)
