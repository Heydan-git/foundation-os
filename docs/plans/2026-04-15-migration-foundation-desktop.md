# Migration Foundation OS → Claude Code Desktop (natif)

## Contexte

Kevin migre son poste de travail du **CLI terminal Claude Code** vers le **nouveau Claude Code Desktop app** (redesign sorti ~2026-04-14 : tasks pane, plan window UI natif, worktrees natifs améliorés, sidebar multi-sessions, sessions auto-nommées depuis les plans validés).

**Problème constaté** : Foundation OS est calibré pour le CLI terminal. Les fonctionnalités natives du Desktop ne sont pas exploitées activement par les commandes/workflows, alors que la plomberie technique est largement en place. En plus, la dette s'est accumulée : 5 workflows de plan en parallèle, branches nommées aléatoirement (`claude/agitated-wilson`), `settings.local.json` bloated, refs stale `Memory`→`Communication`, 2 bugs scripts.

**Intention Kevin** (consolidée après 7 messages + 4 AskUserQuestion) :
- **Ne PAS refaire** ce qui existe. **Améliorer** et **intégrer** avec features natives.
- **Ignorer Memory tool API / Memory Keeper MCP tiers** — on reste sur auto-memory (MEMORY.md + `memory/` files). Pas de MCP tiers.
- **Worktrees** : activer dans les workflows (actuellement passifs).
- **Plan mode / Tasks pane / Session naming** : exploiter les features natives.
- **Conventions nommage** : branches + sessions + worktrees selon un standard cohérent (Kevin me laisse choisir).
- **Unification génération plans** : UN seul workflow, stop la prolifération de 6 approches concurrentes.
- **Triad prioritaire** : gestion des tâches, génération de plan + mémoire, début/fin de session — doivent être **les meilleurs possibles**.
- **Clean global** : vire ce qui sert à rien.

**Outcome visé** : Foundation OS utilise pleinement les features natives Claude Code Desktop, workflows v11 (briefs TDAH-friendly) préservés, nommage cohérent partout, un seul flow plan, dette réduite.

---

## Findings d'exploration (5 agents parallèles + 3 verifs directes)

### Bugs P0/P2 confirmés
- **P0** — `scripts/sync-check.sh:130` attend `docs/core/memory.md` (renommé `communication.md` depuis 2026-04-10) → reporte BROKEN à tort.
- **P2** — `scripts/health-check.sh:104-106` : extraction bundle cassée par rendering box-drawing (`awk '{print $3 $4}'` sort `kB│`).

### Dette structurelle
- **`.claude/settings.local.json` (159 lignes)** : 70% débris (kill PIDs morts, sed one-offs, cp/mv temp). Garder uniquement les MCP actifs → ~40 lignes.
- **Brief v11 dupliqué** dans `/session-start.md`, `/session-end.md`, `/cockpit.md`. Source canonique existe dans `docs/core/communication.md` § 6.
- **Cockpit non-enregistré** : manque dans `scripts/sync-check.sh` EXPECTED_COMMANDS (l. 110), `docs/index.md`, `docs/core/architecture-core.md`.
- **Baselines obsolètes** `docs/core/monitor.md:79-80` : JS ~457 kB annoncé vs 244-613 kB réel ; build ~800 ms vs 178-303 ms ; "Modules actifs : 1" vs 2 réels.
- **Orphelin purgeable** : `.archive/worktrees-orphelins/admiring-sutherland-20260411/` (2 Mo).
- **Branches orphelines** (git branch) : `audit-massif-cycle3`, `claude/brave-hermann`, `deps-major-upgrade`, `ds6-colors-migration` — à auditer/purger.

### Worktrees — usage réel
- **Plomberie OK** : `.gitignore`, `ref-checker.sh` exclusion, `docs/core/worktrees.md`, décision D-WT-01.
- **Usage passif** : aucune command (`/cockpit`, `/session-start`, `/session-end`, `/plan-os`, `/new-project`, `/sync`) ne détecte/aide à créer/fermer un worktree. Manuel 100 %.

### Modules/ code — impact migration = 0
- Zéro dépendance CLI-specific dans `modules/app/` et `modules/design-system/`. Tous les scripts npm tournent identiquement sous Desktop app. 56 stories, build 281 ms, 19/19 tests, 23/23 tests DS.

### Docs CLI-centric à réécrire
- `docs/setup-guide.md` (57 l.) : entièrement CLI terminal. À réécrire Desktop.
- `docs/architecture.md` (55 l.) : diagramme 3-couches CLI-centric. À redessiner.

### "Run else check" stuck dans l'UI
- `ps aux` confirme **aucun shell actif** correspondant. C'est un artefact UI Desktop (shell terminé, pane pas rafraîchie). Redémarrer la session Desktop ou fermer la pane résout. Pas de vrai process zombie.

### Prolifération des workflows "plan" (cause du chaos)
- `.claude/commands/plan-os.md` (Foundation OS command)
- `docs/core/planner.md` (spec interne)
- `docs/plans/_template-plan.md` (template FOS)
- `superpowers:writing-plans` (skill)
- `superpowers:brainstorming` (skill — pré-plan)
- `superpowers:executing-plans` (skill)
- `oh-my-claudecode:plan` (skill OMC)
- `oh-my-claudecode:ralplan` (skill OMC — consensus planning)
- `plan-os:plan-os` (skill, ambigu avec command)
- **Natif** : `EnterPlanMode` / `ExitPlanMode` (tools Claude Code)

→ **6+ chemins** pour le même besoin. Kevin doit avoir UN seul bouton.

### Session naming natif
- Release notes april 2026 confirment : **"Sessions are now auto-named from plan content when you accept a plan"**. Natif. Si le plan a un titre qui suit notre convention, la session héritera automatiquement.

---

## Conventions à établir (choix Kevin-laissé-à-moi)

### Convention branches

```
<type>/<scope>-<short-desc>[-yymmdd]
```

- `feat/<scope>-<desc>` — nouvelle feature (ex. `feat/ds-void-glass`)
- `fix/<scope>-<desc>` — bugfix (ex. `fix/sync-check-memory-ref`)
- `docs/<scope>` — docs only (ex. `docs/cockpit-desktop`)
- `refactor/<scope>` — refactor technique (ex. `refactor/brief-v11-source-unique`)
- `wt/<desc>-<yymmdd>` — worktree éphémère (ex. `wt/migration-desktop-260415`). Les worktrees ont la date courte (YYMMDD) car éphémères.
- `audit/<cycle>-<scope>` — audits multi-sessions (ex. `audit/cycle3-massif`)

**Règles** : lowercase, séparateur `-`, max 40 chars, scope 1-2 mots, desc 2-4 mots, pas d'accents.

### Convention worktrees

Au lieu de `claude/agitated-wilson` (random auto), on force un nom **descriptif** à la création :

```bash
./scripts/worktree-new.sh <desc-courte>
# → crée .claude/worktrees/<desc>-<yymmdd>/ sur branche wt/<desc>-<yymmdd>
# → exemple : worktree-new.sh "migration-desktop" → .claude/worktrees/migration-desktop-260415/
```

Branche auto-nommée selon convention + date.

### Convention sessions Claude Code (nommage auto)

**Feature native exploitable** : sessions auto-nommées depuis le titre du plan quand Kevin valide `ExitPlanMode`.

**Format cible** (comme Cowork) :

```
🪐 <Mini-détail de ce qu'on fait> (DD-MM-YYYY)
```

Exemples :
- `🪐 Migration Foundation OS Desktop (15-04-2026)`
- `🪐 Fix sync-check memory ref (15-04-2026)`
- `🪐 DS Void Glass Phase 3 (14-04-2026)`

**Implémentation** : dans `/plan-os`, le titre du plan généré est **toujours** au format `🪐 <titre> (DD-MM-YYYY)`. Quand Kevin fait ExitPlanMode, la session est auto-renommée par le Desktop app avec ce titre. **Zero hack custom**, exploitation de la feature native.

**Limite honnête** : je ne peux pas renommer directement une session déjà en cours depuis un tool (pas d'API exposée que j'aie pu vérifier). Mais via le mécanisme "auto-name from plan" natif, l'effet est équivalent dès qu'un plan est validé.

---

## Phases (sessions courtes, règle CLAUDE.md "jamais monolithe")

### Phase 1 — Fixes P0/P2 + clean débris critiques + branches (~1 h)
Objectif : corriger les bugs + purger ce qui ne sert plus, y compris branches orphelines.

**Actions code/scripts** :
- Fix `scripts/sync-check.sh:130` — `memory.md` → `communication.md`.
- Fix `scripts/health-check.sh:104-106` — extraction bundle (parser correct).
- Purger `.claude/settings.local.json` → garder uniquement MCP actifs (~40 l.). Backup dans `.archive/settings-local-before-migration-260415.json`.
- `rm -rf .archive/worktrees-orphelins/admiring-sutherland-20260411/` (2 Mo).

**Actions branches orphelines** (Kevin confirme : vraiment cleaner) :
- Pour chaque branche non-main (`audit-massif-cycle3`, `claude/brave-hermann`, `deps-major-upgrade`, `ds6-colors-migration`, plus ce qui traîne sur remotes) : `git log main..<branche>` pour voir si merge-base et si des commits sont uniquement sur la branche.
- Branches dont **tous les commits** sont déjà dans main (déjà mergées/squash-mergées) → **delete** local + remote : `git branch -d <branche> && git push origin --delete <branche>`.
- Branches avec commits uniques mais clairement abandonnées (ex. `deps-major-upgrade` date ancienne, décision documentée non-reprise) → confirmer avec Kevin avant delete (demander explicitement avant la bascule irréversible). Tag d'archive possible (`git tag archive/<nom> <sha>`) avant delete pour conserver le sha.
- Worktrees liés : `git worktree list` → supprimer worktrees fantômes si leur branche est supprimée.

**Verification** : health-check SAIN (0 warn critiques), sync-check passe, `git branch -a` ne contient que `main` + worktrees actifs + branches réellement en cours.

**Commit** : `chore(os): fix bugs + purge debris + branches cleanup`

---

### Phase 2 — Conventions nommage (branches + worktrees + sessions) (~45 min)
Objectif : standardiser les nommages partout.

**Nouveaux fichiers** :
- `docs/core/naming-conventions.md` — spec complète : branches (regex), worktrees (format script), sessions (format 🪐 title (date)), fichiers plans (`YYYY-MM-DD-<slug>.md`), commits (conventional commits déjà en place).

**Update existants** :
- `CLAUDE.md` — nouvelle section courte "Conventions nommage" qui pointe vers `docs/core/naming-conventions.md`.
- `.claude/commands/plan-os.md` — force titre format `🪐 <titre> (DD-MM-YYYY)` pour que session auto-name fonctionne.

**Hook optionnel** (git pre-commit) :
- `scripts/hooks/branch-name-check.sh` — refuse commits sur branches qui ne matchent pas la regex (warning uniquement, pas hard-block pour worktrees hors convention déjà créés).

**Verification** : `git branch` + les noms futurs suivent le pattern. `/plan-os` génère des titres au bon format.

**Commit** : `feat(os): conventions nommage branches + sessions + worktrees`

---

### Phase 3 — Worktrees actifs (scripts + `/wt` command) (~1 h)
Objectif : passer worktrees de passif à actif, nommés selon convention.

**Nouveaux scripts** :
- `scripts/worktree-new.sh <desc>` — crée `.claude/worktrees/<desc>-<yymmdd>/` sur branche `wt/<desc>-<yymmdd>`, copie state `.omc/` de base, affiche commande pour ouvrir nouvelle fenêtre Desktop.
- `scripts/worktree-clean.sh <desc>` — `git worktree remove` + cleanup `.omc/state` + delete branche `wt/…` si mergée.
- `scripts/worktree-list.sh` — liste worktrees avec branche + dernier commit + status (ahead/behind main).

**Nouvelle command** :
- `.claude/commands/wt.md` — `/wt new <desc>`, `/wt list`, `/wt clean <desc>`. Wrappers autour des scripts.

**Update commands existantes** :
- `/cockpit` — Phase 1 SCAN : détecter worktree actif (`git worktree list` filtré au cwd), afficher dans brief v11 (ligne Worktree dans cadre Santé).
- `/session-end` — avant commit : si worktree ≠ main, rappeler "merge/push depuis main après review" et proposer `/wt clean` quand la branche est mergée.

**Docs** :
- `docs/core/worktrees.md` — ajouter section "Workflow Foundation OS" : quand créer/fermer, lifecycle, intégration Desktop (ouvrir 2e fenêtre sur worktree).

**Verification** : `/wt new test-wt` crée `.claude/worktrees/test-wt-260415/`. `/cockpit` y détecte le worktree. `/wt clean test-wt` nettoie. Zero résidu.

**Commit** : `feat(os): worktrees actifs — scripts /wt + integration cockpit`

---

### Phase 4 — `/plan-os` comme orchestrateur intelligent de skills (~1 h 30)
Objectif : **ne PAS supprimer** les skills efficaces (`superpowers:writing-plans`, `superpowers:brainstorming`, etc.). Les **orchestrer** via `/plan-os` qui choisit le meilleur skill selon le contexte, avec EnterPlanMode natif en sortie (pour plan window UI).

**Décision structurante révisée** (Kevin confirmé : garder les skills qui marchent bien) :
- **Keep natifs** : `EnterPlanMode` / `ExitPlanMode` (tools moteur).
- **Keep skills tiers** : `superpowers:brainstorming`, `superpowers:writing-plans`, `superpowers:executing-plans`, `oh-my-claudecode:plan`, `oh-my-claudecode:ralplan`. Tous restent installés et appelables.
- **`/plan-os` devient un ORCHESTRATEUR** qui analyse la demande et route vers le bon skill, puis wrap la sortie dans EnterPlanMode pour visibilité plan window.

**Table de routing skills (dans `.claude/commands/plan-os.md`)** :

| Signal de la demande | Skill invoqué d'abord | Puis | Finalisation |
|---|---|---|---|
| Ambiguïté ≥ 2 questions, objectif flou, "je sais pas comment" | `superpowers:brainstorming` (explore options + questions) | `superpowers:writing-plans` (structure) | `EnterPlanMode` → plan window |
| Plan multi-phase complexe (≥ 5 phases, multi-domaines) | `superpowers:writing-plans` (découpage rigoureux) | — | `EnterPlanMode` → plan window |
| Plan multi-session avec checkpoints | `superpowers:executing-plans` (pour exécution ultérieure) + `writing-plans` pour la rédaction | — | `EnterPlanMode` |
| Demande nécessitant consensus ou débat d'options | `oh-my-claudecode:ralplan` (consensus planning) | `writing-plans` pour formaliser | `EnterPlanMode` |
| Demande directe, scope clair, 1-3 phases | Skip skills tiers → direct | — | `EnterPlanMode` natif simple |
| Intention Foundation OS (routing interne, décision OS) | `oh-my-claudecode:plan` (skill OMC interne) | — | `EnterPlanMode` |

**Règles de routing** :
1. Si ≥ 2 questions d'ambiguïté posées mentalement par Claude → **toujours** passer par brainstorming avant.
2. Si plan ≥ 5 phases OU ≥ 3 domaines (code + docs + infra p.ex.) → **toujours** passer par `writing-plans`.
3. Sortie finale : **toujours** un `EnterPlanMode` suivi d'un plan file `~/.claude/plans/<slug>.md` + copie `docs/plans/YYYY-MM-DD-<slug>.md`.
4. `ExitPlanMode` finalise → Desktop app renomme automatiquement la session selon le titre format `🪐 <titre> (DD-MM-YYYY)`.

**Fichier à créer/réécrire** :
- `.claude/commands/plan-os.md` — la command devient orchestrateur explicite. Sections : analyse demande, signaux de routing, invocation skill(s) choisi(s), wrap EnterPlanMode, écriture dual-path, TodoWrite par bloc pour execution.

**Fichier à mettre à jour** :
- `docs/core/planner.md` — réécriture spec. Sections : entry point unique `/plan-os`, table de routing skills, moteur natif EnterPlanMode, dual path (`~/.claude/plans/` + `docs/plans/`), "quel skill pour quel contexte", auto-naming sessions.
- `docs/plans/_template-plan.md` — mise à jour mineure : format compatible EnterPlanMode (structure Context / Findings / Phases / Verification / Risques — comme le plan courant).

**Verification** :
- `/plan-os "simple fix de typo"` → skip skills → EnterPlanMode direct → plan minimal.
- `/plan-os "migrer tout vers Desktop app"` (ce plan actuel) → `brainstorming` (ambiguïté) → `writing-plans` (multi-phase) → EnterPlanMode → plan riche.
- `/plan-os "debat architecture auth JWT vs session"` → `ralplan` consensus → `writing-plans` → EnterPlanMode.
- Kevin voit le titre 🪐 dans sidebar sessions Desktop après chaque ExitPlanMode.

**Commit** : `feat(os): /plan-os orchestrateur — skills combines + EnterPlanMode natif`

---

### Phase 5 — Tasks pane + TodoWrite systématique (~45 min)
Objectif : exploiter tasks pane Desktop via TodoWrite comme colonne vertébrale.

**Règle ajoutée à `CLAUDE.md`** (section "A chaque session") :
- Toute tâche ≥ 3 étapes passe par TodoWrite. Update immédiat (pas de batch).
- Fin de session : aucune tâche `in_progress` orpheline.

**Update commands** :
- `/cockpit` / `/session-start` — après Phase SCAN, créer TodoWrite initial avec les plans actifs en tâches (1 tâche par plan en cours). Kevin voit dans tasks pane.
- `/plan-os` — Phase EXEC : TodoWrite par bloc du plan.
- `/session-end` — check qu'il n'y a plus de `in_progress` avant commit.

**Verification** : après `/cockpit`, tasks pane affiche les plans actifs. Après `/session-end`, aucune tâche orpheline.

**Commit** : `feat(os): TodoWrite systematique — tasks pane native exploitee`

---

### Phase 6 — Docs CLI-centric → Desktop (~45 min)

**Fichiers** :
- `docs/setup-guide.md` — réécriture Desktop app : lancement app, création worktree `/wt new`, ouverture 2e fenêtre sur worktree, dev server intégré, plan window, tasks pane.
- `docs/architecture.md` — nouveau diagramme 3-couches : (1) Desktop shell + sidebar sessions + plan window + tasks pane + worktrees ; (2) Foundation OS Core (Cortex, Communication, Monitor, Tools, Planner, Worktrees + Cockpit orchestrator) ; (3) Modules (App Builder, DS, futurs).
- `docs/index.md` — lister les 5 commands Foundation (Cockpit, plan-os, session-start, session-end, sync, new-project, wt) + features natives exploitées (plan mode, tasks pane, worktrees, session naming).

**Verification** : relecture cohérente avec CONTEXT.md + CLAUDE.md + naming-conventions.md. `ref-checker.sh` propre.

**Commit** : `docs(os): setup-guide + architecture + index — Desktop app native`

---

### Phase 7 — Refs stales + Cockpit enregistré + baselines (~30 min)

**Fichiers** :
- `docs/core/architecture-core.md:9,19` — `Memory` → `Communication` + ajouter couche Cockpit au diagramme.
- `docs/core/tools.md:81` — idem Memory→Communication.
- `CLAUDE.md:91` — idem si encore présent.
- `docs/decisions-log.md:27` — idem.
- `docs/core/monitor.md:79-80` — baselines : JS 613 kB (ou seuil 600), build 303 ms (seuil 500), modules actifs 2, 56 stories.
- `scripts/sync-check.sh:~110` — ajouter `cockpit` à EXPECTED_COMMANDS + ajouter `wt` (après Phase 3).

**Verification** : `grep -rn "core/memory.md" .` = 0. `sync-check.sh` valide Cockpit + wt. Baselines cohérentes avec réalité.

**Commit** : `docs(os): refs Memory→Communication + Cockpit/wt registered + baselines`

---

### Phase 8 — Consolidation brief v11 source unique (~30 min)

**Stratégie** :
- `docs/core/communication.md` § 6 reste **source unique** du template v11.
- `/session-start.md`, `/session-end.md`, `/cockpit.md` : remplacer règles de rendu dupliquées par `**Format brief** : voir docs/core/communication.md § 6 (source unique)`.
- Garder dans chaque command uniquement la logique qui lui est propre (phases SCAN, BRIEF, ROUTE, EXECUTE, CLOTURE, INPUT).

**Verification** : un seul endroit décrit cadres / largeurs / emojis. Les 3 commands délèguent.

**Commit** : `refactor(os): brief v11 source unique communication.md`

---

### Phase 9 — CONTEXT.md + session + commit final (~15 min)

**Update CONTEXT.md** :
- **Section Sessions** : entrée 2026-04-15 "[DONE] Migration Foundation OS → Claude Code Desktop natif — 9 phases, X commits".
- **Section Decisions** : ajouter :
  - `D-DESKTOP-01` — Foundation OS calibré Claude Code Desktop app (plan mode natif, tasks pane via TodoWrite, sessions auto-nommées format 🪐).
  - `D-NAMING-01` — Conventions branches/worktrees/sessions/plans unifiées (`docs/core/naming-conventions.md`).
  - `D-PLAN-02` — Unification génération plans : `/plan-os` wrap `EnterPlanMode`, skills tiers déprécits soft (supersede D-PLAN-01).
- **Section Modules** : mettre à jour status App Builder + DS si inchangé.
- **Section Prochaine action** : level up memoire (si Kevin garde direction) OU nouvelle direction.

**Verification finale** :
- `bash scripts/health-check.sh` = SAIN.
- `bash scripts/sync-check.sh` = passe sans erreur memory.md + Cockpit/wt.
- `git worktree list` + `git branch` = propres selon convention.
- `/cockpit` = affiche worktree actif + tasks pane peuplée.
- `/plan-os "test"` = un flow, plan window Desktop, session renommée.
- `grep -rn "docs/core/memory.md" .` = 0.

**Commit** : `docs(context): session migration Desktop — 9 phases DONE + decisions`

---

## Fichiers critiques (récap)

| Fichier | Phase | Action |
|---------|-------|--------|
| `scripts/sync-check.sh` | 1, 7 | Fix memory→communication + add cockpit/wt EXPECTED_COMMANDS |
| `scripts/health-check.sh` | 1 | Fix bundle extraction l. 104-106 |
| `.claude/settings.local.json` | 1 | Purge → ~40 l. (+ backup archive) |
| `.archive/worktrees-orphelins/admiring-sutherland-20260411/` | 1 | Delete |
| (branches orphelines) | 1 | Audit + delete mortes |
| `docs/core/naming-conventions.md` (nouveau) | 2 | Créer |
| `.claude/commands/plan-os.md` | 2, 4, 5 | Titre 🪐 + pipeline unifié + TodoWrite |
| `scripts/hooks/branch-name-check.sh` (nouveau, optionnel) | 2 | Créer |
| `scripts/worktree-new.sh` (nouveau) | 3 | Créer |
| `scripts/worktree-clean.sh` (nouveau) | 3 | Créer |
| `scripts/worktree-list.sh` (nouveau) | 3 | Créer |
| `.claude/commands/wt.md` (nouveau) | 3 | Créer |
| `.claude/commands/cockpit.md` | 3, 5 | Détection worktree + TodoWrite plans actifs |
| `.claude/commands/session-start.md` | 5, 8 | TodoWrite + refs brief v11 |
| `.claude/commands/session-end.md` | 3, 5, 8 | Rappel worktree + check tasks + refs brief v11 |
| `docs/core/planner.md` | 4 | Réécriture — pipeline unifié |
| `docs/plans/_template-plan.md` | 4 | Simplifier — align EnterPlanMode |
| `docs/setup-guide.md` | 6 | Réécriture Desktop |
| `docs/architecture.md` | 6 | Nouveau diagramme 3-couches |
| `docs/index.md` | 6, 7 | 5 commands + features natives + /wt |
| `docs/core/worktrees.md` | 3 | Section Workflow FOS |
| `docs/core/architecture-core.md` | 7 | Memory→Comm + Cockpit diagramme |
| `docs/core/tools.md` | 7 | Memory→Comm |
| `docs/core/monitor.md` | 7 | Baselines actualisées |
| `docs/decisions-log.md` | 7 | Memory→Comm |
| `CLAUDE.md` | 2, 5, 7 | Refs naming + TodoWrite systematique + Memory→Comm |
| `CONTEXT.md` | 9 | Sessions + 3 décisions (DESKTOP, NAMING, PLAN-02) |

## Fonctions/utils réutilisées (zero duplication)

- `scripts/health-check.sh` logique découverte dynamique modules — base solide
- `scripts/ref-checker.sh` déjà exclut `.claude/worktrees/` — zero modif
- `docs/core/communication.md` § 6 — source unique brief v11 (déjà présente)
- Hooks `validate-void-glass.sh` + `security-reminder.py` — zéro modif
- 4 agents `.claude/agents/*.md` (os-architect opus, dev/doc/review sonnet) — zéro modif
- Tools natifs `EnterPlanMode` / `ExitPlanMode` / `TodoWrite` / `AskUserQuestion` — moteur de la migration

## Hors scope explicite

- **Memory tool API / Memory Keeper MCP** : abandonné ("on oublie"). Auto-memory MEMORY.md + `~/.claude/projects/.../memory/` reste.
- **Modules/ code applicatif** : zéro changement.
- **BMAD (`_bmad/`)** : dormant, intact.
- **Cowork (`docs/travaux-cowork/`)** : non touché.
- **Phase 5 Expansion (Finance/Santé/Trading)** : en attente Kevin.
- **Retry nommage sessions déjà en cours** : pas d'API directe, on passe par auto-name natif via ExitPlanMode.

## Verification end-to-end (après 9 phases)

1. `bash scripts/health-check.sh` → SAIN (0 warn critiques).
2. `bash scripts/sync-check.sh` → passe, cockpit + wt reconnus.
3. `git worktree list` + `git branch` → noms suivent convention.
4. `/cockpit` → brief v11 mentionne worktree actif, tasks pane peuplée.
5. `/plan-os "titre test"` → plan window Desktop, fichier `docs/plans/2026-04-XX-titre-test.md`, session auto-renommée `🪐 Titre test (DD-MM-2026)`.
6. `/wt new test-migration` → `.claude/worktrees/test-migration-260415/` + branche `wt/test-migration-260415`.
7. `grep -rn "docs/core/memory.md" .` → 0 résultat.
8. `docs/setup-guide.md` décrit Desktop app, pas `claude .` terminal.
9. Session neuve Desktop → `/cockpit` affiche Cockpit registered partout.

**Durée totale** : ~6 h, 9 sessions courtes, 9 commits conventionnels, zero régression code applicatif.

## Risques

| Risque | Probabilité | Mitigation |
|--------|-------------|------------|
| Purge `.claude/settings.local.json` casse un MCP utilisé | moyen | Liste avec Kevin avant purge, backup dans `.archive/` |
| Auto-name session pas exactement format 🪐 | faible | Titre plan contrôlé par `/plan-os`, format force |
| Script `worktree-new.sh` incompatible Linux | faible | Tester macOS (env courant), flag portabilité dans doc |
| `/wt` conflit namespace skill/command | faible | Grep avant création |
| Branches orphelines contiennent travail non-mergé | moyen | Audit `git log` + check avec Kevin avant delete |
| Kevin veut ralentir / changer cap pendant migration | faible | Phases courtes + commits indépendants → pause à n'importe quelle phase |

## Feedbacks permanents à enregistrer (auto-memory, post-migration)

À ajouter dans `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/` une fois la migration terminée :

- **`feedback_thinking_francais.md`** — Kevin voit ma réflexion (texte gris du thinking mode) dans le CLI Desktop. Il ne comprend pas quand c'est en anglais. **Règle** : je dois réfléchir en français, pas seulement répondre en français. Le thinking aussi. **Pourquoi** : Kevin est francophone, il lit mon raisonnement en temps réel pour valider/corriger, l'anglais est une barrière. **Comment appliquer** : forcer le français dans toute réflexion interne (architecture, debug, code), pas seulement le user-facing.
- **`feedback_plans_skills_orchestres.md`** — Kevin ne veut pas qu'on supprime les skills efficaces (`superpowers:writing-plans`, `brainstorming`, etc.). Il veut qu'on les **orchestre** via `/plan-os` selon le contexte. **Comment appliquer** : toujours chercher à combiner/router vers le meilleur skill plutôt qu'à éliminer, même quand il y a "prolifération apparente".
- **`feedback_sessions_nommage_planete.md`** — Convention imposée pour noms sessions : `🪐 <mini-détail> (DD-MM-YYYY)`. Appliqué via titre de plan (EnterPlanMode + auto-name session natif Desktop app).
- **`feedback_branches_convention.md`** — Convention branches Foundation OS : `<type>/<scope>-<desc>[-yymmdd]` — détails dans `docs/core/naming-conventions.md`.

## Notes spéciales

### "Run else check" stuck
Pas de vrai process actif (`ps aux` confirme). Artefact UI Desktop app (pane pas rafraîchie). Kevin peut fermer la pane ou redémarrer la session Desktop sans risque. Rien à fixer dans le code.

### Session naming direct (limite honnête)
Je **ne peux pas** renommer une session Claude Code déjà démarrée depuis un tool (pas d'API exposée). **Mais** via la feature native "auto-name from plan content", l'effet recherché par Kevin est obtenu chaque fois qu'il valide un plan. Le format `🪐 <titre> (DD-MM-YYYY)` est imposé par `/plan-os` au titre du plan, donc la session hérite naturellement.

### Triad prioritaire Kevin
- **Gestion tâches** → Phase 5 (TodoWrite systématique, tasks pane native).
- **Génération plan + mémoire** → Phase 4 (unification plans), auto-memory intact.
- **Début/fin session** → `/cockpit` enrichi Phase 3+5, `/session-end` Phase 3+5+8.

Les 3 sont au cœur de la migration, pas des sujets annexes.
