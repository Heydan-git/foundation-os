---
id: YYYY-MM-DD-nom
title: [Titre court]
created: YYYY-MM-DD
status: draft
models_used: []
blocks_total: 0
blocks_subagent: 0
blocks_main: 0
estimated_duration: 0min
---

# [Titre du plan]

> Genere par `/plan-os`. Spec : `docs/core/planner.md`.

## Contexte

[Pourquoi ce plan existe. Lien vers la demande Kevin ou le ticket. 2-4 lignes max.]

## Objectif

[Une phrase. Resultat observable attendu.]

## Blocs

### Bloc 1 — [nom court]

- **Modele** : haiku | sonnet | opus
- **Justification** : [1 ligne — pourquoi ce modele]
- **Sub-agent** : non (context required) | oui (agent=X)
- **Justification sub-agent** : [si oui : 3 conditions validees. Si non : laquelle tombe]
- **Fichiers** : `path/to/file1.ts`, `path/to/file2.md`
- **Duree estimee** : ~Xmin
- **Critere de fin** : [observable : test passe, build OK, fichier existe, etc.]
- **Dependances** : [aucune | Bloc N]

### Bloc 2 — [nom court]

[meme structure]

## Routing resume

| # | Bloc | Modele | Sub-agent | Duree | Dep |
|---|------|--------|-----------|-------|-----|
| 1 | ... | sonnet | non | 10min | — |
| 2 | ... | opus   | non | 15min | 1 |

**Total** : X blocs, Y min, modeles : [liste]

## Validation

- [ ] Kevin a lu le routing
- [ ] Kevin a valide les choix de modele
- [ ] Kevin a valide la regle sub-agent par bloc
- [ ] Kevin a dit "go"

## Execution log

- [ ] Bloc 1 — pending
- [ ] Bloc 2 — pending

## Notes post-execution

[A remplir apres. Ecarts estimation vs reel, surprises, leçons.]
