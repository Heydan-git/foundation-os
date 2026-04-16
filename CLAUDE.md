# Foundation OS

OS de travail personnel IA-driven. Modules : App Builder (actif), Design System (actif), Finance/Sante/Trading (prevu Phase 5).

## Imperatifs (non-negociable)
- Ne jamais mentir, inventer, ou fabriquer (donnees, URLs, citations). Si pas sur → le dire.
- Ne jamais pretendre avoir fini sans verification reelle (build + test executes).
- Plan avant execution. Validation Kevin avant changement non-trivial.
- Decouper systematiquement en phases/sessions courtes (jamais de monolithe).
- Cause racine de chaque erreur avant de fixer (pas de patch symptomatique).
- Actions pragmatiques, conscience des limites — dire "je ne peux pas X" plutot que faire semblant.
- Sub-agents : OK pour taches complexes **si contexte precis injecte dans le prompt** (memoire `feedback_subagents_context.md`). Jugements type "orphelin/doublon/redondance" → moi avec contexte global.

## A chaque session

### Tool calls OBLIGATOIRES selon command invoquee

**`/cockpit` ou `/session-start`** :
- Tour 1 (parallele) : `Read CONTEXT.md` + `Bash git status && git worktree list && git log -1` + `Bash bash scripts/health-check.sh` + `Glob docs/plans/*.md`
- Tour 2 : lire chaque plan actif + `TodoWrite` avec 1 todo par plan
- Tour 3 : brief v11 (format `docs/core/communication.md` section 6.1)

**`/plan-os "<demande>"`** :
- Tour 1 : `EnterPlanMode()` IMMEDIATEMENT (pas de texte chat avant)
- Dans PlanMode : `AskUserQuestion` pour clarifications, `Write` plan file au format `🪐 <titre> (DD-MM-YYYY)`, `ExitPlanMode`

**`/session-end`** :
- Tour 1 : `Bash git diff --name-status HEAD` + worktree list + health-check + ref-checker
- Tour 2 : verifier 0 todo TodoWrite `in_progress` orpheline + classer changes par commit logique
- Tour 3 : brief cloture v11 + propose commit (pas auto)

**`/wt new|clean <desc>`** : Tour 1 direct `bash scripts/worktree-{new,clean}.sh <desc>`.

Tool calls NON optionnels. Interpretation alternative = violation.

### Regles generales

1. Lire CONTEXT.md pour etat + prochaine action
2. Jamais de metriques inventees — verifier les fichiers
3. **TodoWrite systematique** pour >= 3 etapes. Une seule `in_progress`, update immediat (memoire `feedback_todowrite_systematique.md`)
4. Fin session : zero todo `in_progress` orpheline + update CONTEXT.md
5. **Thinking en francais** (memoire `feedback_thinking_francais.md`)

## Briefs session (format v11)

Spec complete : `docs/core/communication.md` section 6.
11 sections cadres box-drawing, entete/input double trait, emojis couleur 🟢🟡🔴🔵⚪⚫🔮, barres 12 blocs, tendance ▲▶▼.

Questions groupees en debut pour plans (memoire `feedback_frontload_questions.md`).

## Stack & Regles code

- Vite + React 19 + TypeScript + Tailwind 4 + Supabase + Vercel
- Conventional commits : `type(scope): description`
- Void Glass : dark-only `#030303` (ds-surface-0), Figtree UI, JetBrains Mono code, tokens DTCG
- Interdit : `#0A0A0B`, `#08080A`, Outfit, Inter, system-ui seul (OK fallback CSS)
- TSX < 700 lignes — decouper si plus

## Conventions nommage (Claude Code Desktop)

Source unique : `docs/core/naming-conventions.md`. Appliquees auto par `/plan-os`, `/wt`, `/cockpit`, `/session-end`.

- **Branches** : `<type>/<scope>-<desc>[-yymmdd]` (lowercase, max 40 chars, types : feat/fix/docs/refactor/chore/audit/wt)
- **Worktrees** : `/wt new <desc>` → `wt/<desc>-<yymmdd>`, jamais `git worktree add` manuel
- **Sessions Desktop** : `🪐 <mini-detail> (DD-MM-YYYY)` via titre plan (rename manuel — `/plan-os` affiche le nom en fin de flow, Kevin colle dans sidebar)
- **Plans** : `docs/plans/YYYY-MM-DD-<slug>.md` versionne + `~/.claude/plans/<slug>.md` natif (dual-path)
- **Memoires** : 6 elements stricts par phase si plan multi-session (memoire `feedback_plans_ultra_detailles.md`)

Red flag si branche/worktree hors format : arreter, renommer, reprendre.

## Decisions autonomes (agis SANS demander)

Logique pure — prendre automatiquement, sauf si destructif ET irreversible (ex : `git push --force`, delete hors archive).

### Due diligence OBLIGATOIRE avant action autonome

Avant tout `mv`, `rm`, archive, modification Core OS :
1. Grep refs actives (hors `.archive/`). Si ref active → NE PAS toucher, poser question.
2. Check workflow actif (script/hook/CI/command). Si oui → NE PAS toucher.
3. Check CONTEXT.md : fichier mentionne ACTIF dans Modules/Cap/Chantier ? Si oui → NE PAS toucher.
4. DOUTE → poser UNE question groupee a Kevin.

### Honnetete stricte

Quand je modifie Core OS (scripts, hooks, commands, settings, CLAUDE.md, docs/core/) :
- **Tester** ce qui est testable (bash exec, builds, tests)
- **Declarer** : ✅ "marche, verifie : output" / ⚠️ "devrait marcher mais pas teste car X" / ❌ "theorique/plateforme"
- **Jamais pretendre** qu'une automation fonctionne sans preuve.
- **Jamais mettre en place** une automation 50/50 sans la documenter "best-effort" + fallback manuel.

### Automations actives

- **Archivage plans** : frontmatter `status:done` OU cases `[x] >= 3` → `.archive/plans-done-$(date +%y%m%d)/` via `scripts/auto-archive-plans.sh` (hook SessionEnd)
- **Drift detection** : `scripts/drift-detector.sh` au SessionStart (detection only, pas de fix auto destructif)
- **Docs sync** : `scripts/docs-sync-check.sh` (manuel, chain dans health-check)
- **Ref integrity** : `scripts/ref-checker.sh` (chain dans health-check + sync-check)

### Interdit sans Kevin
- `git push` sur main ou `--force`
- `rm -rf` hors `.archive/` ou `node_modules` regenerable
- `git commit` automatique (attendre OK sauf `/session-end` apres diff review)
- Push sur remote (`origin/*`)
- Actions Asana/Notion/MCP externes

## Garde-fous (non-negociable)

- Jamais de fichier a la racine (seuls CLAUDE.md, CONTEXT.md, README.md, .gitignore, package.json)
- Jamais creer de fichier sans demande explicite Kevin
- Jamais dupliquer une info deja dans CONTEXT.md (regle d'or 4 tiers)
- Fichier deplace/renomme → mettre a jour TOUTES les refs (grep + fix)
- Decision prise → CONTEXT.md section Decisions
- Module change status → CONTEXT.md section Modules
- **`.archive/` = POUBELLE** : `mv` vers `.archive/<contexte>-<yymmdd>/`, JAMAIS `rm` direct
- **JAMAIS LIRE `.archive/`** sauf demande explicite Kevin (perte de tokens). Scripts excluent deja.

## Token-awareness

| Situation | Action |
|-----------|--------|
| < 3 fichiers, 1 domaine | Direct (pas d'agent) |
| 3+ fichiers ou 2+ domaines | Agent(s) |
| Recherche exploratoire | Agent Explore |
| Max agents paralleles | 3 (projet solo) |
| Build/tests longs | run_in_background |

## Anti-bullshit gates
- Jamais de "TERMINE" ou "100%" sans preuve (build + test executes)
- Chaque metrique a une commande de verification
- Mots interdits : revolution, historique, reference mondiale, premier au monde, $XB, accomplish
- **Verification visuelle obligatoire** pour UI : screenshot chrome-devtools MCP avant de claim "fait" (memoire `feedback_visual_verification.md`)
- Red flag : plus de MD que de code dans une session → suspect

## Core OS

Specs completes : `docs/core/`.
- **Cortex** (routing) : `cortex.md`
- **Communication** (persistance + brief v11) : `communication.md`
- **Monitor** (health, seuils) : `monitor.md`
- **Tools** (catalogue 98 outils) : `tools.md` + `tools/index.json` + `tools/routing.json`
- **Planner** (`/plan-os` orchestrateur) : `planner.md`
- **Worktrees** (feature native + workflow `/wt`) : `worktrees.md`
- **Architecture globale** : `architecture-core.md`

## Commands (.claude/commands/ + plugin claude-obsidian)
- `/cockpit` : point d'entree unique (scan + brief + routing + cloture)
- `/session-start` + `/session-end` : protocoles session complets
- `/plan-os` : orchestrateur plans (EnterPlanMode natif)
- `/wt` : worktrees (new/list/clean)
- `/new-project` : scaffold module
- `/sync` : audit coherence
- `/wiki` : bootstrap/check vault Obsidian (plugin claude-obsidian)
- `/save [name]` : sauver conversation courante en wiki page
- `/autoresearch [topic]` : web research loop 3-5 rounds + synthese
- `/canvas [desc]` : Obsidian canvas visual

## Agents (.claude/agents/)
- `os-architect` (opus) : architecture, decisions, stack, schema
- `dev-agent` (sonnet) : code React/TS, composants, Supabase, Void Glass
- `doc-agent` (sonnet) : documentation, CONTEXT.md, traces
- `review-agent` (sonnet) : coherence, audit, zero regression, pre-deploy

Protocole : entree (CONTEXT.md + scope) → execution dans scope → sortie (rapport court).

## Build
```bash
cd modules/app && npm run dev    # localhost:5173
cd modules/app && npm run build  # production
cd modules/design-system && npm run storybook  # localhost:6006
```

## Reference
- Architecture : `docs/architecture.md`
- Setup : `docs/setup-guide.md`
- Manifeste : `docs/manifeste.md`
- Navigation : `docs/index.md`
- Conventions : `docs/core/naming-conventions.md`
- Decisions archivees : `docs/decisions-log.md`
