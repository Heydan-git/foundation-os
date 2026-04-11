# Planner — Spec

> Module Core OS. Generateur de plans avec economie de tokens et routing modele automatique.
> Commande : `/plan-os`. Wrapper par-dessus `superpowers:writing-plans` + heuristiques Foundation OS.

## 1. Objectif

Produire des plans d'execution optimises pour :
- **Token economy** — router chaque bloc de tache vers le modele le moins cher qui fait le job
- **Anti-compactage** — decouper en sessions courtes (< 30 min de travail utile par bloc)
- **Tracabilite** — versionner chaque plan dans le dossier `docs/plans/` (nom : date + slug + suffixe `-plan.md`)
- **Zero degradation** — jamais sacrifier la qualite ou le contexte pour gratter des tokens

Le planner n'execute rien. Il propose un plan, Kevin valide, puis execute (eventuellement avec delegation sub-agent bloc par bloc).

## 2. Workflow (6 phases)

```
1. CAPTURE     → Comprendre la demande (brainstorm court si ambigu)
2. DECOUPE     → Identifier les blocs de travail atomiques
3. ROUTING     → Assigner un modele a chaque bloc (heuristiques section 3)
4. SUB-AGENT   → Evaluer chaque bloc contre les 3 conditions (section 4)
5. ECRITURE    → Generer le plan via superpowers:writing-plans + injecter routing
6. VALIDATION  → Afficher routing + decoupage + estimation, attendre OK Kevin
```

Le plan final est ecrit dans le dossier `docs/plans/` (nom : date + slug + suffixe `-plan.md`) avec le frontmatter de la section 5.

## 3. Heuristiques routing modele

Table de decision. Match le premier critere qui s'applique.

| Modele | Critere | Exemples |
|--------|---------|----------|
| **haiku** | Lookups, lecture, grep, listing, status | Lire CONTEXT.md, `git status`, chercher un fichier, lister modules |
| **sonnet** | Exec code standard, tests, docs techniques, review de routine | Ecrire composant React, fixer test, mettre a jour CONTEXT.md, code review standard |
| **opus** | Architecture, decisions, schema DB, refactor multi-module, debug causal, spec | Nouvelle feature cross-module, choix stack, migration DB complexe, root cause hunt |

### Override

- **Kevin peut forcer** un modele sur n'importe quel bloc (`--force-model opus`)
- **Le planner doit justifier** chaque routing en 1 ligne (ex: "sonnet : exec CRUD standard, 1 module, pas de decision d'archi")
- **Default conservateur** : en cas de doute, monter d'un cran (haiku → sonnet, sonnet → opus). Mieux vaut payer un peu plus que casser

## 4. Regle sub-agent (3 conditions)

Un bloc est delegable a un sub-agent **uniquement si les 3 conditions sont TOUTES vraies** :

1. **Zone isolee** — un seul module, un seul domaine, pas de cross-references
2. **Sans memoire session** — pas besoin des decisions/historique/contexte conversationnel
3. **Sortie observable** — code, fichier, resultat de commande. Pas un jugement, pas une recommandation strategique

### Si une seule condition tombe → execution en session principale

Le planner affiche `⚠ main session (context required)` et explique laquelle des 3 conditions echoue.

### Pourquoi

Memoire Foundation OS `feedback_subagents_context.md` : les sous-agents sans contexte global cassent les findings (orphelin/doublon/redondance). Ne JAMAIS deleguer un jugement qui exige la memoire des sessions.

## 5. Format du plan genere

Chaque plan est un markdown avec frontmatter YAML.

```markdown
---
id: 2026-04-11-exemple
title: Exemple de plan
created: 2026-04-11
status: draft | validated | executing | done
models_used: [opus, sonnet, haiku]
blocks_total: 5
blocks_subagent: 1
blocks_main: 4
estimated_duration: 45min
---

# [Titre du plan]

## Contexte
[Pourquoi ce plan existe, lien vers la demande Kevin]

## Blocs

### Bloc 1 — [nom]
- **Modele** : sonnet
- **Justification** : exec code standard, 1 module
- **Sub-agent** : non (context required : depend de CONTEXT.md)
- **Fichiers** : `modules/app/src/X.tsx`
- **Duree** : ~10min
- **Critere fin** : [observable]

### Bloc 2 — [nom]
...

## Routing resume

| # | Bloc | Modele | Sub-agent | Duree |
|---|------|--------|-----------|-------|
| 1 | ... | sonnet | non | 10min |

## Execution log (ajoute pendant l'exec)

- [ ] Bloc 1 — status
- [ ] Bloc 2 — status
```

## 6. Decoupage session (anti-compactage)

Regles :
- **Max 30 min de travail utile** par bloc (hors lecture/routing)
- **Min 15 min** (sinon le cout de chargement contexte depasse le gain)
- **Blocs groupes par domaine** : tout ce qui touche DB ensemble, tout le front ensemble (economie contexte)
- **Dependances explicites** : si Bloc 3 depend du Bloc 1, le noter. Le planner peut proposer sequentiel ou parallele

## 7. Dependances

- **superpowers:writing-plans** — moteur de generation. Si desinstalle, `/plan-os` casse. Accepte comme trade-off (evite duplication).
- **docs/plans/** — dossier de sortie, existe deja
- **CONTEXT.md** — source du contexte projet (modules, decisions, cap)

## 8. Limites (ce que le planner ne fait PAS)

- **Pas d'execution automatique** — Kevin valide toujours
- **Pas d'estimation coût en $** — juste le modele (coût calcule separement si besoin)
- **Pas de rollback** — si un bloc echoue, c'est l'execution qui decide, pas le planner
- **Pas de re-plan automatique** — si le plan doit evoluer, re-lancer `/plan-os` manuellement

## 9. Phase 2 (backlog, non-MVP)

- Log post-execution : tokens reels vs estimes, duree reelle vs estimee
- Calibration automatique des heuristiques routing apres N plans executes
- Integration avec `docs/core/tools/routing.json` pour auto-suggestion d'outils par bloc

## 10. References

- Commande : `.claude/commands/plan-os.md`
- Template : `docs/plans/_template-plan.md`
- Memoire sub-agents : `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/feedback_subagents_context.md`
- Token-awareness : `CLAUDE.md` section Token-awareness
