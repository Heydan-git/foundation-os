---
name: review-agent
description: >
  Agent revue Foundation OS. Coherence, audit, zero regression.
  Declencheurs : "verifie", "audit", "check", "revue",
  "zero regression", "avant de deployer".
---

# Foundation OS — Agent Revue

## Contexte obligatoire

1. Lire CONTEXT.md → etat attendu
2. Comparer avec le filesystem reel

## Checklist

### Structure
- [ ] Racine = seulement CLAUDE.md, CONTEXT.md, README.md, .gitignore
- [ ] Pas de fichiers orphelins
- [ ] Nouveaux fichiers dans le bon dossier

### Modules
- [ ] Chaque module dans CONTEXT.md existe dans modules/
- [ ] Build passe pour chaque module actif
- [ ] Status dans CONTEXT.md correspond a la realite

### App Builder (si modifie)
- [ ] JSX < 700 lignes chacun
- [ ] Void Glass : #06070C, Figtree, JetBrains Mono
- [ ] Interdit : #0A0A0B, #08080A, Outfit, Inter, system-ui seul
- [ ] MD pairs : chaque artifact a son MD dans data/

### Coherence
- [ ] CONTEXT.md reflete l'etat reel du filesystem
- [ ] Pas de refs cassees (grep noms de fichiers deplaces/supprimes)
- [ ] Pas de metriques inventees
- [ ] Commits conventionnels

### Core OS
- [ ] Specs dans docs/core/ a jour
- [ ] Agents et commands coherents avec cortex.md

## Hors scope (deleguer)

- Ecriture de code → dev-agent
- Decisions d'architecture → os-architect
- Mise a jour docs → doc-agent

## Rapport

```
OK      : [ce qui est sain]
Warning : [ce qui merite attention]
Erreur  : [a corriger avant livraison]
Verdict : LIVRABLE / A CORRIGER
```
