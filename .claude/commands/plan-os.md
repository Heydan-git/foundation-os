# /plan-os — Generateur de plan Foundation OS

Wrapper par-dessus `superpowers:writing-plans` avec routing modele automatique, regle sub-agent stricte, et versionnement dans `docs/plans/`.

Spec complete : `docs/core/planner.md`.
Template : `docs/plans/_template-plan.md`.

## Quand utiliser

- Tache non-triviale (> 3 fichiers OU > 1 domaine OU > 30 min de travail)
- Besoin d'economie de tokens (session longue, plusieurs blocs heterogenes)
- Besoin de tracabilite (plan versionne dans git)

## Quand ne PAS utiliser

- Tache triviale (< 3 fichiers, 1 domaine) → coder directement
- Exploration pure → utiliser Agent Explore
- Bug fix simple avec cause racine claire → executer direct

## Phase 1 — CAPTURE

Comprendre la demande. Si ambigu → poser **toutes les questions en une fois** (regle Foundation OS `feedback_frontload_questions.md`).

Sortie : formulation claire de l'objectif observable.

## Phase 2 — DECOUPE

Identifier les blocs de travail atomiques.

Regles :
- **Un bloc = 15-30 min** de travail utile (anti-compactage)
- **Grouper par domaine** (tout le front ensemble, tout la DB ensemble)
- **Identifier les dependances** (Bloc B depend de Bloc A)
- **Atomique** : un bloc doit avoir un critere de fin observable

## Phase 3 — ROUTING

Pour chaque bloc, assigner un modele selon `docs/core/planner.md` section 3 :

| Modele | Critere |
|--------|---------|
| haiku  | Lookups, lecture, grep, listing, status |
| sonnet | Exec code standard, tests, docs techniques, review |
| opus   | Architecture, decisions, schema DB, refactor multi-module, debug causal |

**Default conservateur** : en cas de doute, monter d'un cran.

Chaque assignation doit avoir une **justification en 1 ligne**.

## Phase 4 — SUB-AGENT GATE

Pour chaque bloc, evaluer les 3 conditions (`docs/core/planner.md` section 4) :

1. Zone isolee (1 module, 1 domaine)
2. Sans memoire session (pas de decisions/historique/contexte conversationnel)
3. Sortie observable (code, fichier, commande — pas un jugement)

**Si les 3 sont TRUE → sub-agent OK (proposer agent + modele).**
**Si une seule tombe → main session obligatoire.**

Memoire a respecter : `feedback_subagents_context.md` — les sous-agents cassent souvent les findings qui necessitent contexte global.

## Phase 5 — ECRITURE

Invoquer `superpowers:writing-plans` pour generer le squelette.

Puis injecter :
- Frontmatter YAML (template `docs/plans/_template-plan.md`)
- Section "Routing resume" avec tableau
- Colonnes Modele + Sub-agent + Duree + Dep pour chaque bloc
- Justifications explicites

Ecrire le fichier dans le dossier `docs/plans/` avec pour nom la date + slug + suffixe `-plan.md`.

## Phase 6 — VALIDATION

Afficher a Kevin :
- **Routing resume** (tableau compact)
- **Blocs avec sub-agent propose** (si aucun, le dire)
- **Estimation duree totale**
- **Fichier cree** (chemin)

Demander : **"Je valide bloc par bloc ?"**

Kevin doit :
- Valider chaque routing modele (ou forcer override)
- Valider chaque delegation sub-agent (ou refuser)
- Donner le "go" global

Tant que Kevin n'a pas dit "go", **rien ne s'execute**.

## Phase 7 — EXECUTION (optionnelle, si Kevin dit "go")

Executer bloc par bloc dans l'ordre des dependances.

- Pour chaque bloc avec `sub-agent: oui` valide → dispatch via Task tool avec le bon `model:` et `subagent_type:`
- Pour chaque bloc `main session` → executer dans la session courante

**Avertissement modele session principale** : si un bloc `main session` reclame un modele different du modele courant (ex: plan dit opus, Kevin est en sonnet), afficher :
```
⚠ Bloc X requiert opus en session principale.
  Kevin doit taper /model opus avant d'executer ce bloc, ou forcer sonnet.
```

Apres chaque bloc : cocher dans le plan markdown, afficher le statut, demander confirmation avant le suivant si Kevin avait demande "validation par bloc".

## Phase 8 — CLOTURE

Apres execution :
- Marquer `status: done` dans le frontmatter du plan
- Ajouter section "Notes post-execution" avec ecarts estimation vs reel (si observable)
- Proposer commit `docs(plans): <nom-plan>` si fichier modifie

## Limites

- **Pas d'execution automatique** — Kevin valide toujours
- **Pas de rollback** — si un bloc echoue, re-lancer `/plan-os` pour un nouveau plan
- **Dependance Superpowers** — si `superpowers:writing-plans` est desinstalle, cette commande casse. Accepte comme trade-off.

## Exemple d'usage

```
Kevin: "/plan-os ajouter authentification Supabase au module Finance"

Claude:
  Phase 1 — CAPTURE : "Scope = login/logout + session persistence + guards routes, sans reset password"
  Phase 2 — DECOUPE : 4 blocs (setup client, pages, guards, tests)
  Phase 3 — ROUTING : sonnet x3, opus x1 (decision schema session)
  Phase 4 — SUB-AGENT : 0 sub-agent (contexte global requis)
  Phase 5 — ECRITURE : docs/plans/2026-04-11-finance-auth-plan.md
  Phase 6 — VALIDATION : affiche routing + attend "go"
```

## References

- Spec : `docs/core/planner.md`
- Template : `docs/plans/_template-plan.md`
- Superpower : `superpowers:writing-plans`
- Memoire sub-agents : `feedback_subagents_context.md`
- Memoire questions groupees : `feedback_frontload_questions.md`
