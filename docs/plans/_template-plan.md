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

## En bref (pour Kevin)

[OBLIGATOIRE — 2-5 phrases langage simple, TDAH-first. Ce qu'on va faire, pourquoi, prochaine etape ou question decisive. Pas de jargon non-traduit. Si jargon necessaire, entre parentheses. Regle spec : `docs/core/communication.md` section 6.0 Vulgarisation obligatoire.

Exemple :
"On va mettre en place un systeme qui envoie automatiquement les decisions Foundation OS dans Notion (l'app ou tu gardes tes pages). Ca prend environ 18h sur 5 etapes. Chaque etape fait un petit morceau (configurer l'agent, relier les bases de donnees, synchroniser automatiquement, etc.). Apres ca, ton PO dans Notion 'vit' avec le projet au lieu de devoir tout mettre a jour a la main. A decider : option A (tout d'un coup) ou option B (en 5 sessions separees)."]

## Context

[3-6 paragraphes : pourquoi ce changement, probleme constate, intention Kevin consolidee, outcome vise. Verite du pourquoi avant le quoi.]

## Findings (optionnel)

[Decouvertes d'exploration si applicable. Tableaux concis, chiffres factuels. Bugs detectes, dette identifiee, etc.]

## Phases (sessions courtes, regle "jamais monolithe" CLAUDE.md)

> Chaque phase DOIT contenir les **7 elements obligatoires** (spec `docs/core/planner.md`, memoire `feedback_plans_ultra_detailles.md`, P-42 vulgarisation D-VULGARIZE-01) pour etre resistante au compactage contexte ET lisible par Kevin (TDAH, non-tech) :
> 1. **Impact pour Kevin** (1-2 phrases langage simple : ce que cette phase change concretement pour lui, pourquoi il devrait s'y interesser) **[OBLIGATOIRE D-VULGARIZE-01]**
> 2. **Pre-conditions** (etat attendu avant phase)
> 3. **Etat repo** (branche, worktree, fichiers modifies)
> 4. **Actions atomiques** (commandes + snippets exacts)
> 5. **Verification** (commandes + resultat attendu)
> 6. **Rollback** (comment annuler si echec)
> 7. **Commit message** (preformate, conventional commits)

### Phase 1 — [Titre court] (~Xmin)

Objectif : [phrase courte].

**Impact pour Kevin** : [1-2 phrases en langage simple, TDAH-first. Ce que cette phase change concretement pour lui dans son quotidien, pas le "quoi technique" mais le "pourquoi ca te sert a toi". Exemple : "Apres cette phase, quand tu crees un plan, Notion se peuplera tout seul avec les etapes du plan. Tu n'auras plus a ouvrir Notion pour recopier les taches a la main."]

**Pre-conditions** :
- [Etat repo attendu avant]
- [Phase prerequise DONE]

**Etat repo** :
- Branche : `<branche>`
- Worktree : `<nom>` (si applicable)
- Fichiers modifies : [liste]

**Actions atomiques** :
```bash
# Action 1 : [description]
<commande>

# Action 2 : [description]
<commande>
```

**Verification** :
```bash
<commande>  # doit retourner [resultat attendu]
```

**Rollback** :
```bash
git reset --hard HEAD
# ou autre procedure specifique
```

**Commit** :
```
<type>(scope): description courte

Body optionnel si phase majeure.
```

### Phase 2 — [Titre court] (~Xmin)

[meme structure : 7 elements obligatoires incluant Impact pour Kevin en tete]

### Phase N — [Titre court] (~Xmin)

[meme structure : 7 elements obligatoires incluant Impact pour Kevin en tete]

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
