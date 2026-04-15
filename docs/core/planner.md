# Planner — Spec

> Module Core OS. Generation de plans Foundation OS via orchestrateur intelligent qui combine les meilleurs skills de planification existants + EnterPlanMode natif Claude Code Desktop.

> Command : `/plan-os`. Spec command : `.claude/commands/plan-os.md`.

## 1. Objectif

Produire des plans d'execution Foundation OS qui :

- **Combinent** les skills efficaces (`superpowers:writing-plans`, `superpowers:brainstorming`, `oh-my-claudecode:ralplan`) sans en eliminer aucun.
- **Affichent** le plan dans la **plan window UI** native du Desktop app via `EnterPlanMode` / `ExitPlanMode`.
- **Versionnent** dans `docs/plans/YYYY-MM-DD-<slug>.md` (parallele au path natif `~/.claude/plans/<slug>.md`).
- **Auto-renomment** la session Desktop au format `🪐 <mini-detail> (DD-MM-YYYY)` (convention `docs/core/naming-conventions.md` section 3).
- **Decoupent** en sessions courtes (regle "jamais monolithe" CLAUDE.md).
- **Maintiennent** la regle frontload des questions (`feedback_frontload_questions.md`).

## 2. Architecture

```
                 ┌─────────────────────────────────────┐
                 │  Demande Kevin                      │
                 │  ("on fait quoi", "plan pour X")    │
                 └────────────┬────────────────────────┘
                              ▼
                 ┌─────────────────────────────────────┐
                 │  /plan-os (orchestrateur)           │
                 │  Phase 1 : Analyse signaux          │
                 └────────────┬────────────────────────┘
                              ▼
            ┌─────────────────┴─────────────────┐
            │  Phase 2 : Routing skill           │
            ├───────────────────────────────────┤
            │  Ambiguite >= 2Q  → brainstorming │
            │  Multi-phase (>=5) → writing-plans│
            │  Consensus/debat  → ralplan       │
            │  Direct simple    → skip skills   │
            │  Decision OS      → omc:plan      │
            └─────────────────┬─────────────────┘
                              ▼
                 ┌─────────────────────────────────────┐
                 │  Phase 3 : Execution skill          │
                 │  (un ou plusieurs en chaine)        │
                 └────────────┬────────────────────────┘
                              ▼
                 ┌─────────────────────────────────────┐
                 │  Phase 4 : EnterPlanMode natif      │
                 │  → Write plan dans path natif       │
                 │  → ExitPlanMode (validation Kevin)  │
                 │  → Desktop app rename session 🪐    │
                 └────────────┬────────────────────────┘
                              ▼
                 ┌─────────────────────────────────────┐
                 │  Phase 5 : Copie versionnee         │
                 │  cp -> docs/plans/YYYY-MM-DD-...md  │
                 └────────────┬────────────────────────┘
                              ▼
                 ┌─────────────────────────────────────┐
                 │  Phase 6 : Execution avec TodoWrite │
                 │  1 todo / phase, commits par phase  │
                 └─────────────────────────────────────┘
```

## 3. Routing des skills

### Table canonique

Reproduite a l'identique dans `feedback_plans_orchestrateur.md` (memoire auto-chargee).

| Signal dominant | Skill d'entree | Skill suivant | Finalisation |
|---|---|---|---|
| Ambiguite >=2 questions, "je sais pas comment" | `superpowers:brainstorming` | `superpowers:writing-plans` | EnterPlanMode |
| Plan multi-phase complexe (>=5 phases, multi-domaines) | `superpowers:writing-plans` | — | EnterPlanMode |
| Plan multi-session avec checkpoints | `superpowers:writing-plans` puis `superpowers:executing-plans` | — | EnterPlanMode |
| Consensus ou debat d'options | `oh-my-claudecode:ralplan` | `superpowers:writing-plans` | EnterPlanMode |
| Demande directe, scope clair, 1-3 phases | Skip skills tiers | — | EnterPlanMode direct |
| Intention Foundation OS (decision OS) | `oh-my-claudecode:plan` | — | EnterPlanMode |

### Regles de bascule

1. **Brainstorming systematique** si Claude identifie >=2 questions mentales pour clarifier → ne jamais sauter cette etape.
2. **Writing-plans systematique** si plan >=5 phases OU >=3 domaines (code + docs + infra par exemple).
3. **Sortie EnterPlanMode obligatoire** : meme un plan trivial passe par EnterPlanMode pour visibilite plan window Desktop.
4. **AskUserQuestion pour les questions** : grouper en debut, ne pas eparpiller (regle `feedback_frontload_questions.md`).

## 4. Format plan obligatoire

> **Plans multi-session anti-perte-de-contexte** (D-LEVELUP-02, 2026-04-15) : chaque phase DOIT contenir les 6 elements stricts (pre-conditions verifiables, etat repo attendu, actions atomiques numerotees avec snippets exacts, verification post-phase, rollback explicite, commit message preformate). Memoire : `feedback_plans_ultra_detailles.md`. Exemple reference : plan level-up Foundation OS 2026-04-15 (`.archive/plans-done-260415/2026-04-15-level-up-foundation-os.md`).

Rendu dans `~/.claude/plans/<slug>.md` (natif) puis copie `docs/plans/YYYY-MM-DD-<slug>.md`.

```markdown
# 🪐 <Mini-detail> (DD-MM-YYYY)

## Context
3-6 paragraphes : pourquoi ce changement, probleme constate, intention Kevin consolidee, outcome vise.

## Findings (optionnel)
Decouvertes d'exploration si applicable. Tableaux concis, chiffres factuels.

## Phases (sessions courtes)

### Phase N — Titre (~duree)
Objectif : phrase courte.
Actions : liste numerotee.
Verification : commande exacte de check.
Commit : `<type>(scope): description`.

## Fichiers critiques (recap)
| Fichier | Phase | Action |
|---|---|---|
| ... | ... | ... |

## Hors scope explicite
Ce qu'on ne fait PAS, lister.

## Verification end-to-end
Comment tester que tout marche apres.

## Risques
| Risque | Probabilite | Mitigation |
|---|---|---|
| ... | ... | ... |
```

## 5. Dual-path versionnement

**Path natif** (Desktop plan window) : `~/.claude/plans/<slug>.md`
- Genere par `EnterPlanMode` avec slug auto (ex: `staged-shimmying-nygaard.md`)
- Visible dans la fenetre plan UI Desktop
- **Non versionne** dans git (path utilisateur)

**Path projet** (versionne git) : `docs/plans/YYYY-MM-DD-<slug-explicite>.md`
- Copie du plan natif avec nom explicite
- Slug = description du plan, lowercase, kebab-case
- Versionne via `git add` + commit Foundation OS
- Conservation long-terme dans l'historique projet

**Synchronisation** : apres chaque ExitPlanMode validee, copier le plan natif vers `docs/plans/`. La copie peut se faire automatiquement par `/plan-os` ou manuellement par Kevin si besoin de renommer.

## 6. Auto-naming session Desktop

Feature native Claude Code Desktop (release ~2026-04) : la session est **auto-renommee** depuis le titre du plan a `ExitPlanMode` valide.

**Convention obligatoire** (`docs/core/naming-conventions.md` section 3) :

```
🪐 <Mini-detail de ce qu'on fait> (DD-MM-YYYY)
```

Donc le titre `# 🪐 <...> (DD-MM-YYYY)` au top du plan **conditionne** le nom de la session dans la sidebar Desktop.

**Limite honnete** : impossible de renommer une session deja en cours sans plan (pas d'API exposee). Le format prend effet a chaque nouveau plan valide.

## 7. Execution apres approbation

`ExitPlanMode` retourne `User has approved your plan` → demarrer execution :

1. **TodoWrite initial** : 1 todo par phase du plan.
2. **Execution sequentielle** : phase par phase, mark `in_progress` → `completed`.
3. **Commit conventionnel par phase** : `<type>(scope): phase N/<total> ...`.
4. **Health-check intermediaire** apres phases majeures.
5. **Cloture** : `/session-end` quand toutes les phases livrees.

Reference TodoWrite : `feedback_todowrite_systematique.md` (memoire auto-chargee).

## 8. Anti-patterns a eviter

- ❌ Generer un plan SANS EnterPlanMode (perte visibilite plan window).
- ❌ Eparpiller les questions au fil de l'eau (regle frontload Kevin).
- ❌ Supprimer un skill efficace au pretexte qu'il fait doublon (Kevin a refuse explicitement 2026-04-15).
- ❌ Plan monolithique sans phases (regle CLAUDE.md "jamais monolithe").
- ❌ Titre sans format 🪐 (Desktop ne peut pas auto-renommer).
- ❌ Skip de la copie versionnee (perte historique).

## 9. Decisions structurantes

- **D-PLAN-01** (2026-04-11, archive) : `/plan-os` MVP wrapper `superpowers:writing-plans` + routing modele auto. SUPERSEDED.
- **D-PLAN-02** (2026-04-15) : `/plan-os` orchestrateur intelligent qui route vers le meilleur skill selon contexte + finalise EnterPlanMode + dual-path. ACTIVE.

## 10. References

- Command : `.claude/commands/plan-os.md`
- Conventions nommage : `docs/core/naming-conventions.md`
- Memoires :
  - `feedback_plans_orchestrateur.md` (table routing)
  - `feedback_frontload_questions.md` (questions groupees)
  - `feedback_sessions_nommage_planete.md` (titre 🪐)
  - `feedback_todowrite_systematique.md` (tasks pane)
- Skills tiers reutilises (jamais reimplementer) :
  - `superpowers:brainstorming`
  - `superpowers:writing-plans`
  - `superpowers:executing-plans`
  - `oh-my-claudecode:ralplan`
  - `oh-my-claudecode:plan`
- Tools natifs : `EnterPlanMode`, `ExitPlanMode`, `TodoWrite`, `AskUserQuestion`
