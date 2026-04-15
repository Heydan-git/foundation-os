---
id: YYYY-MM-DD-slug
title: 🪐 [Mini-detail] (DD-MM-YYYY)
created: YYYY-MM-DD
status: draft
phases_total: 0
estimated_duration: 0min
---

# 🪐 [Mini-detail] (DD-MM-YYYY)

> Genere par `/plan-os` orchestrateur. Spec : `docs/core/planner.md`. Convention nommage titre : `docs/core/naming-conventions.md` section 3.

## Context

[3-6 paragraphes : pourquoi ce changement, probleme constate, intention Kevin consolidee, outcome vise. Verite du pourquoi avant le quoi.]

## Findings (optionnel)

[Decouvertes d'exploration si applicable. Tableaux concis, chiffres factuels. Bugs detectes, dette identifiee, etc.]

## Phases (sessions courtes, regle "jamais monolithe" CLAUDE.md)

### Phase 1 — [Titre court] (~Xmin)

Objectif : [phrase courte].

**Actions** :
- [Action 1]
- [Action 2]
- ...

**Verification** : `[commande exacte]` doit retourner [resultat attendu].

**Commit** : `<type>(scope): description courte`

### Phase 2 — [Titre court] (~Xmin)

[meme structure]

### Phase N — [Titre court] (~Xmin)

[meme structure]

## Fichiers critiques (recap)

| Fichier | Phase | Action |
|---|---|---|
| `path/to/file.ext` | 1 | Modifier — [pourquoi] |
| `path/to/new.ext` | 2 | Creer — [pourquoi] |
| ... | ... | ... |

## Hors scope explicite

- [Ce qu'on ne fait PAS, et pourquoi]
- [Ce qui est laisse pour plus tard]
- [Ce qui est gere par autre chose]

## Verification end-to-end

[Comment tester apres execution complete des phases]

1. `bash scripts/health-check.sh` doit retourner SAIN
2. `bash scripts/sync-check.sh` doit passer
3. [Test specifique au plan]
4. [Etc.]

## Risques

| Risque | Probabilite | Mitigation |
|---|---|---|
| [Description du risque] | faible/moyen/eleve | [Comment l'eviter ou le detecter] |

## Memoires permanentes a creer (optionnel, post-execution)

[Si le plan introduit des regles ou conventions durables, lister les memoires `feedback_*.md` ou `project_*.md` a ajouter dans `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/` une fois le plan execute. Mettre a jour MEMORY.md index.]

- `feedback_<slug>.md` — [Regle a memoriser]
- `project_<slug>.md` — [Etat projet a tracer]

## Execution log

- [ ] Phase 1 — pending
- [ ] Phase 2 — pending
- [ ] Phase N — pending

## Notes post-execution

[A remplir apres. Ecarts estimation vs reel, surprises, lecons retenues.]
