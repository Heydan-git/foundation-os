# /plan-os — Orchestrateur de generation de plans Foundation OS

> **IMPERATIF** — Quand cette command est invoquee avec une demande (ex: `/plan-os "build auth"`) :
>
> **Tour 1 (OBLIGATOIRE, tool call en premier)** :
> 1. `EnterPlanMode()` — active la plan window Desktop IMMEDIATEMENT
>
> **Dans PlanMode (phase exploration/questions)** :
> 2. Si ambiguite >=2 questions : `AskUserQuestion` avec les questions groupees (pas texte chat)
> 3. Si exploration necessaire : `Agent subagent_type="Explore"` en parallele (max 3)
>
> **Dans PlanMode (phase redaction)** :
> 4. `Write ~/.claude/plans/<slug>.md` avec le plan au format obligatoire :
>    - Titre : `# 🪐 <Mini-detail> (DD-MM-YYYY)` (convention nommage sessions native)
>    - Sections : Context / Findings / Phases / Fichiers critiques / Hors scope / Verification / Risques
> 5. `ExitPlanMode()` — presenter le plan a Kevin pour validation
>
> **Apres approbation (Kevin clique Accept)** :
> 6. `Bash cp ~/.claude/plans/<slug>.md docs/plans/$(date +%Y-%m-%d)-<slug>.md` — copie versionnee
> 7. **Afficher en chat un bloc SESSION RENAME** avec le titre exact `🪐 <Mini-detail> (DD-MM-YYYY)` a copier-coller dans la sidebar Desktop (clic droit > Rename)
> 8. `TodoWrite` avec une todo par phase du plan
> 9. Executer phase par phase, commit conventionnel `<type>(scope): phase N/<total> ...`
>
> PAS DE QUESTIONS TEXTE EN CHAT AVANT `EnterPlanMode`. La plan window doit s'ouvrir au tour 1.
> Le format titre 🪐 est obligatoire (sert de source pour le rename manuel de la session Desktop).

**Point d'entree UNIQUE** pour generer un plan Foundation OS. Route intelligemment vers le meilleur skill de planification selon le contexte, puis finalise toujours via `EnterPlanMode` natif (Desktop app plan window) + dual-path versionnement.

Spec complete : `docs/core/planner.md`. Memoire permanente : `feedback_plans_orchestrateur.md`.

## Principe

Garder les skills efficaces (`superpowers:writing-plans`, `superpowers:brainstorming`, `oh-my-claudecode:ralplan`, etc.) ET les orchestrer. Ne JAMAIS les dupliquer, ne JAMAIS en eliminer.

Sortie finale **toujours** :
1. `EnterPlanMode` (natif Claude Code) — affiche le plan dans la plan window Desktop.
2. Plan file ecrit dans `~/.claude/plans/<slug>.md` (path natif, visible UI).
3. Copie versionnee dans `docs/plans/YYYY-MM-DD-<slug>.md` (projet Foundation OS).
4. `ExitPlanMode` — plan valide par Kevin.
5. Affichage bloc **SESSION RENAME** en chat : titre exact `🪐 <mini-detail> (DD-MM-YYYY)` a copier-coller manuellement dans la sidebar Desktop (clic droit session > Rename).

## Phase 1 — Analyse de la demande

Avant tout routing, identifier les signaux de la demande Kevin :

| Signal | Questionnement |
|---|---|
| Ambiguite | Y a-t-il au moins 2 questions a poser pour clarifier l'objectif ? |
| Ampleur | Combien de phases probables ? Combien de domaines touches (code, docs, infra) ? |
| Type | Est-ce un debat d'options (consensus) ou une tache deterministe ? |
| Scope | Tache simple 1-3 phases OU complexe multi-session ? |
| Intention | Foundation OS interne (routing decision OS) OU dev applicatif ? |

Cette analyse determine le routing Phase 2.

## Phase 2 — Routing skill

Table de routing canonique (aussi dans memoire `feedback_plans_orchestrateur.md`) :

| Signal dominant | Skill d'entree | Skill suivant | Finalisation |
|---|---|---|---|
| Ambiguite >=2 questions, "je sais pas comment" | `superpowers:brainstorming` | `superpowers:writing-plans` | EnterPlanMode |
| Plan multi-phase complexe (>=5 phases, multi-domaines) | `superpowers:writing-plans` | — | EnterPlanMode |
| Plan multi-session avec checkpoints | `superpowers:writing-plans` puis `superpowers:executing-plans` | — | EnterPlanMode |
| Consensus ou debat d'options | `oh-my-claudecode:ralplan` | `superpowers:writing-plans` | EnterPlanMode |
| Demande directe, scope clair, 1-3 phases | Skip skills tiers | — | EnterPlanMode direct |
| Intention Foundation OS (decision OS) | `oh-my-claudecode:plan` | — | EnterPlanMode |

**Regles imperatives** :
1. Si ambiguite >=2 questions mentales → **toujours** `brainstorming` d'abord.
2. Si plan >=5 phases OU >=3 domaines → **toujours** `writing-plans`.
3. Sortie finale **toujours** via `EnterPlanMode`.
4. AskUserQuestion pour grouper les questions en debut (regle feedback Kevin `feedback_frontload_questions.md`).

## Phase 3 — Execution routing

Selon la table Phase 2, invoquer le skill choisi.

- `superpowers:brainstorming` : pose les questions groupees, explore les options. Kevin tranche.
- `superpowers:writing-plans` : structure le plan (Context / Findings / Phases / Verification / Risques).
- `oh-my-claudecode:ralplan` : consensus planning avec gating.
- `oh-my-claudecode:plan` : skill interne OMC (interview optionnel).

Apres le skill : recueillir la structure du plan, adapter au format Foundation OS, transitionner vers Phase 4.

## Phase 4 — EnterPlanMode + ecriture plan file

```
EnterPlanMode()
→ prompt natif affecte un path ~/.claude/plans/<slug>.md
→ ecrire le plan avec Write tool dans ce path
→ appeller ExitPlanMode pour validation Kevin
```

Le titre du plan **doit** suivre le format `🪐 <mini-detail> (DD-MM-YYYY)`. Ce titre sert de source pour le **rename manuel** de la session Desktop (affiche par `/plan-os` en fin de flow, Kevin copie-colle dans la sidebar).

Format obligatoire du plan :

1. **Titre** : `# 🪐 <mini-detail> (DD-MM-YYYY)`
2. **Context** : 3-6 paragraphes, verite du pourquoi, verite du probleme, intention Kevin consolidee.
3. **Findings** (optionnel) : decouvertes d'exploration si applicable.
4. **Phases** : decoupees en sessions courtes (regle "jamais monolithe" CLAUDE.md).
5. **Fichiers critiques** : recap tableau fichier / phase / action.
6. **Hors scope** : ce qu'on ne fait PAS, explicite.
7. **Verification end-to-end** : comment tester que tout marche.
8. **Risques** : table risque / probabilite / mitigation.

## Phase 5 — Copie versionnee

Apres `ExitPlanMode` valide :

```bash
cp ~/.claude/plans/<slug>.md docs/plans/$(date +%Y-%m-%d)-<slug>.md
git add docs/plans/<date>-<slug>.md
# Commit propose en fin de session via /session-end
```

Garantit que le plan survit dans l'historique projet (les plans natifs `~/.claude/plans/` sont locaux).

## Phase 5b — Bloc SESSION RENAME (affichage chat)

Apres la copie versionnee, afficher IMMEDIATEMENT en chat le bloc suivant avec le titre exact extrait du plan :

```
╔═ SESSION RENAME ═════════════════════════════════════╗
║                                                      ║
║   🪐 <Mini-detail> (DD-MM-YYYY)                     ║
║                                                      ║
║   → Sidebar Desktop : clic droit session > Rename    ║
║     coller le nom ci-dessus                          ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

Ce bloc est **non-negociable** : pas d'auto-rename natif Desktop (feature inexistante verifiee 2026-04-15). Kevin copie-colle manuellement dans la sidebar. Le titre affiche doit etre identique au `# 🪐 <...>` du plan file.

## Phase 6 — Execution avec TodoWrite

Une fois le plan approuve (ExitPlanMode return "User has approved your plan") :

1. Creer un TodoWrite avec une todo par phase du plan.
2. Executer phase par phase en marquant les todos.
3. Commit conventionnel par phase (format `<type>(scope): phase N/<total> ...`).
4. Fin de toutes phases → `/session-end` cloture.

Regle tasks pane (memoire `feedback_todowrite_systematique.md`) : une seule todo `in_progress` a la fois, update immediat.

## Exemples

### Simple fix de typo
```
/plan-os "fix typo doc architecture.md"
```
→ Phase 1 : scope clair, 1 phase.
→ Phase 2 : skip skills, direct EnterPlanMode.
→ Phase 4 : plan minimal (1 phase, 1 fichier).
→ Titre : `🪐 Fix typo architecture.md (15-04-2026)`.

### Migration complexe (ce plan actuel)
```
/plan-os "migrer Foundation OS vers Claude Code Desktop"
```
→ Phase 1 : ambiguite forte (quelles features natives ? quels workflows ?), 9 phases, multi-domaines (code + docs + scripts + commands).
→ Phase 2 : `brainstorming` d'abord (AskUserQuestion groupes) puis `writing-plans`.
→ Phase 4 : plan riche (Context + Findings + 9 Phases + Risks).
→ Titre : `🪐 Migration Foundation OS Desktop (15-04-2026)`.

### Debat architecture
```
/plan-os "auth : JWT vs session cookie"
```
→ Phase 1 : consensus/debat.
→ Phase 2 : `oh-my-claudecode:ralplan` (consensus planning).
→ Phase 4 : plan avec options + recommandation + trade-offs.
→ Titre : `🪐 Debat architecture auth (15-04-2026)`.

## Hors scope

- Execution du plan (→ phases du plan en sessions distinctes, via `/session-start` + commits conventionnels).
- Skills custom Kevin-specific (→ laisser skills existants gerer, pas de reinvention).
- Memoire long-terme (→ auto-memory existant via `feedback_*.md`, pas de MCP memory tier).

## Ce qui remplace les anciens workflows

Avant (6 chemins concurrents) :
- `.claude/commands/plan-os.md` wrapper superpowers obligatoire
- `superpowers:writing-plans` appelable seul
- `superpowers:brainstorming` appelable seul
- `oh-my-claudecode:plan` appelable seul
- `oh-my-claudecode:ralplan` appelable seul
- `plan-os:plan-os` skill redondant

Maintenant (1 entry point, skills preserves) :
- **`/plan-os` = orchestrateur** (ce fichier)
- Skills efficaces restent installes et appelables manuellement si Kevin veut un A/B.
- Sortie toujours EnterPlanMode natif.

Supersede D-PLAN-01 (2026-04-11 MVP plan-os wrapper superpowers). Nouvelle decision : D-PLAN-02 orchestrateur (2026-04-15).

## References

- Spec : `docs/core/planner.md`
- Conventions : `docs/core/naming-conventions.md` sections 3-4
- Memoires :
  - `feedback_plans_orchestrateur.md` (table routing)
  - `feedback_sessions_nommage_planete.md` (titre 🪐)
  - `feedback_todowrite_systematique.md` (tasks pane)
  - `feedback_frontload_questions.md` (AskUserQuestion groupees)
