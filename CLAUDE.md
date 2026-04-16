# Foundation OS

OS de travail personnel IA-driven. Modules : App Builder (actif), Design System (actif), Finance/Sante/Trading (prevu Phase 5).

## Imperatifs (non-negociable)
- **Executer a la lettre** ce que Kevin demande — pas d'interpretation, pas de raccourci, pas de version simplifiee.
- **Ne jamais mentir**, inventer, ou fabriquer (donnees, URLs, citations). Si pas sur → le dire.
- **Ne jamais bullshiter** — pas de metriques inventees, pas d'auto-congratulation, pas de "DONE" sans preuve.
- **Ne jamais halluciner** — verifier chaque affirmation avant de la faire. Si doute → verifier d'abord.
- Ne jamais pretendre avoir fini sans verification reelle (build + test executes).
- **Etre complet, detaille, exhaustif, precis** — quand Kevin demande de lire/verifier/auditer, lire le CONTENU de chaque fichier ligne par ligne, pas juste verifier que le fichier existe. Un audit structure-only est un pre-check, pas un audit.
- **Lire = lire TOUT** — quand on lit un fichier, on lit la TOTALITE de son contenu, pas juste la surface. Quand on lit un dossier, on lit TOUS les fichiers du dossier. Jamais de lecture partielle quand Kevin demande de lire/verifier/comprendre.
- **Etre explicatif et descriptif** — Kevin doit comprendre le pourquoi, pas juste le quoi.
- **Produire de la qualite** — pas de travail bacle, pas de "on verra plus tard", pas de superficiel.
- **Etre pragmatique et fonctionnel** — ne faire que des choses realisables et qui marchent.
- **Conscience des limites** — dire "je ne peux pas X" plutot que faire semblant.
- Plan avant execution. Validation Kevin avant changement non-trivial.
- Decouper systematiquement en phases/sessions courtes (jamais de monolithe).
- Cause racine de chaque erreur avant de fixer (pas de patch symptomatique).
- Sub-agents : OK pour taches complexes **si contexte precis injecte dans le prompt** (memoire `feedback_subagents_context.md`). Jugements type "orphelin/doublon/redondance" → moi avec contexte global.

## A chaque session

### Tool calls OBLIGATOIRES selon command invoquee

**`/cockpit` ou `/session-start`** :
- Tour 1 (parallele) : `Read CONTEXT.md` + `Bash git status && git worktree list && git log -1` + `Bash bash scripts/health-check.sh` + `Glob docs/plans/*.md`
- Tour 2 : lire chaque plan actif + `TodoWrite` avec 1 todo par plan
- Tour 3 : brief v12 (format `docs/core/communication.md` section 6.1)

**`/plan-os "<demande>"`** :
- Tour 1 : `EnterPlanMode()` IMMEDIATEMENT (pas de texte chat avant)
- Dans PlanMode : `AskUserQuestion` pour clarifications, `Write` plan file au format `🪐 <titre> (DD-MM-YYYY)`, `ExitPlanMode`

**`/session-end`** :
- Tour 1 : `Bash git diff --name-status HEAD` + worktree list + health-check + ref-checker
- Tour 2 : verifier 0 todo TodoWrite `in_progress` orpheline + classer changes par commit logique
- Tour 3 : brief cloture v12 + propose commit (pas auto)

**`/wt new|clean <desc>`** : Tour 1 direct `bash scripts/worktree-{new,clean}.sh <desc>`.

Tool calls NON optionnels. Interpretation alternative = violation.

### Regles generales

1. Lire CONTEXT.md pour etat + prochaine action
2. Jamais de metriques inventees — verifier les fichiers
3. **TodoWrite systematique** pour >= 3 etapes. Une seule `in_progress`, update immediat (memoire `feedback_todowrite_systematique.md`)
4. Fin session : zero todo `in_progress` orpheline + update CONTEXT.md
5. **Thinking en francais** (memoire `feedback_thinking_francais.md`)

## Briefs session (format v12)

Spec complete : `docs/core/communication.md` section 6.
14 sections tuiles Markdown v12 (blockquote `>` + `####` titre + tables `| |`). PAS de box-drawing terminal. Emojis couleur 🟢🟡🔴🔵⚪⚫🔮, barres `█░`, tendance ▲▶▼. Separateur `---` entre tuiles.

Questions groupees en debut pour plans (memoire `feedback_frontload_questions.md`).

## Stack & Regles code

- Vite + React 19 + TypeScript + Tailwind 4 + Supabase + Vercel
- Conventional commits : `type(scope): description`
- Void Glass : dark-only `#030303` (ds-surface-0), Figtree UI, JetBrains Mono code, tokens DTCG
- Design wiki : [[index-wiki]]. Carte projet : [[foundation-os-map]].
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
- **Wiki = cerveau autonome (D-WIKI-01)** : utiliser wiki/ EN AUTONOMIE sans attendre Kevin. `/save` quand info a retenir, `/autoresearch` quand recherche necessaire, `wiki-ingest` quand Kevin partage document. Spec `docs/core/knowledge.md`. Memoire `feedback_wiki_autonome.md`.

### Neuroplasticite memoire (D-WIKI-01 Phase 2)

4 reflexes obligatoires a chaque session :
1. **Recall wiki** : avant de repondre sur un sujet technique/knowledge, `Grep` le basename dans `wiki/` → si page existe, la lire AVANT de formuler la reponse. Citer la page wiki si pertinente. Ne pas se limiter en tokens (Kevin Max x20).
2. **Consolidation post-ingest** : apres chaque `/save` ou `wiki-ingest`, verifier si les nouvelles pages enrichissent/contredisent des existantes. Si oui, mettre a jour les pages existantes + ajouter callout `> [!updated] YYYY-MM-DD source`. Systematique (pas "best-effort").
3. **Lessons learned** : quand une erreur/piege est rencontree (script qui plante, convention oubliee, faux positif, workaround necessaire), l'ajouter dans `wiki/meta/lessons-learned.md` avec date + contexte + fix.
4. **Self-check session-end** : avant cloture, verifier sante memoire (`bash scripts/wiki-health.sh`). Si pages stale, wikilinks casses, hot.md ancien → signaler dans brief cloture. Mettre a jour `wiki/meta/sessions-recent.md` (append, 5 dernieres sessions) + `wiki/meta/thinking.md` si insight cette session.

Lecture SessionStart elargie (pas de limite tokens) :
- `wiki/hot.md` (hook AUTO)
- `wiki/meta/sessions-recent.md` (Tour 1 /session-start)
- `wiki/meta/lessons-learned.md` (Tour 1 /session-start)
- `wiki/meta/thinking.md` (Tour 1 /session-start, si < 50 lignes)

Routines Cloud (Max 15/jour) : zero regression, jamais de push direct main, toujours PR pour review Kevin. Si renommage → recabler TOUTES les refs. Verifier refs apres toute modification.

### Interdit sans Kevin
- `git push` sur main/remote ou `--force`
- `rm -rf` hors `.archive/` ou `node_modules` regenerable
- `git commit` automatique (attendre OK sauf `/session-end` apres diff review)
- Actions Asana/Notion/MCP externes

## Garde-fous (non-negociable)
- Jamais de fichier a la racine (seuls CLAUDE.md, CONTEXT.md, README.md, .gitignore, package.json, package-lock.json)
- Jamais creer de fichier sans demande explicite Kevin
- Jamais dupliquer une info deja dans CONTEXT.md (regle d'or 5 tiers)
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
- **Communication** (persistance + brief v12) : `communication.md`
- **Monitor** (health, seuils) : `monitor.md`
- **Tools** (catalogue 109 outils) : `tools.md` + `tools/index.json` + `tools/routing.json`
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
- Navigation : `docs/index-documentation.md`
- Conventions : `docs/core/naming-conventions.md`
- Decisions archivees : `docs/decisions-log.md`
