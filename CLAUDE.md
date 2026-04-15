# Foundation OS

OS de travail personnel IA-driven. Modules : App Builder (actif), Finance (prevu), Sante (prevu).

## Imperatifs (non-negociable)
- Ne jamais mentir, inventer, ou fabriquer (donnees, URLs, citations)
- Si je ne sais pas ou ne suis pas sur → le dire
- Ne jamais pretendre avoir fini sans verification reelle (build + test)
- Ne pas completer une tache Asana sans OK explicite de Kevin
- 100% ou rien — verifier le repertoire courant avant toute operation fichier
- Plan avant execution, validation Kevin avant changement non-trivial
- Avant compactage : sauvegarder l'etat courant. Apres compactage : reverifier
- Decouper systematiquement chaque tache en phases/sessions courtes pour eviter le compactage (jamais de monolithe, meme pour du "simple")
- Identifier la cause racine de chaque erreur ou incoherence avant de fixer (pas de patch symptomatique)
- Actions pragmatiques, conscience des limites — ne jamais tenter ce qui ne peut pas fonctionner (dire "je ne peux pas X" plutot que faire semblant)
- Sub-agents uniquement quand le contexte global n'est PAS necessaire (zones isolees, faits observables). Tout jugement qui exige ma memoire des sessions/decisions → MOI directement. Les findings type "orphelin/doublon/redondance" d'un sub-agent sont toujours a re-verifier avec contexte global avant validation.

## A chaque session

### Tool calls OBLIGATOIRES selon la command invoquee (non-negociable)

**Si conversation demarre par `/cockpit` ou `/session-start`** :
- Tour 1 (parallele) : `Read CONTEXT.md` + `Bash git status && git worktree list && git log -1` + `Bash bash scripts/health-check.sh`
- Tour 2 : `TodoWrite` avec 1 todo par plan actif dans docs/plans/ (hors DONE/SUPERSEDED)
- Tour 3 : brief v11 (format `docs/core/communication.md` section 6)
- JAMAIS produire le brief sans avoir fait les 2 premiers tours.

**Si conversation demarre par `/plan-os "<demande>"`** :
- Tour 1 : `EnterPlanMode()` — ouvrir la plan window Desktop IMMEDIATEMENT
- JAMAIS poser des questions texte chat avant d'avoir ouvert PlanMode
- Dans PlanMode : AskUserQuestion pour clarifications (pas texte), Write plan file, ExitPlanMode

**Si conversation demarre par `/session-end`** :
- Tour 1 : `Bash git diff --name-status HEAD` + `Bash git worktree list` + `Bash bash scripts/health-check.sh`
- Tour 2 : verifier zero todo TodoWrite `in_progress` orpheline
- Tour 3 : brief cloture v11 (format section 6.2)

**Si conversation demarre par `/wt new <desc>` ou `/wt clean <desc>`** :
- Tour 1 : `Bash bash scripts/worktree-{new,clean}.sh <desc>` EXACTEMENT (pas de pre-traitement)

Ces tool calls NE sont PAS optionnels. Une interpretation alternative (ex : "laisse-moi d'abord comprendre...") est une violation.

### Regles generales (apres les tool calls obligatoires)

1. Lire CONTEXT.md pour etat actuel + prochaine action
2. Ne jamais inventer de metriques — verifier les fichiers
3. Evaluations realistes uniquement — zero bullshit, zero auto-congratulation
4. Ne jamais ajouter de fonctionnalites non demandees
5. **TodoWrite systematique** pour toute tache >= 3 etapes (visibilite tasks pane Desktop). Une seule todo `in_progress` a la fois, update immediat (memoire `feedback_todowrite_systematique.md`)
6. En fin de session, mettre a jour CONTEXT.md (resume + prochaine action) ET verifier zero todo `in_progress` orpheline

## Briefs session (format obligatoire)

Format v11 (TDAH-friendly, valide 2026-04-10). Spec complete : `docs/core/communication.md` section 6.

**11 sections dans cadres box-drawing** : Sante → Trajectoire → Modules+Acces → Attention → Dernier travail → Statut projet → Idees → Reflexion → Historique → Cap → Input.

**Regles de rendu v11** : cadres `┌─ TITRE ─┐ ... └─┘` (42 chars), entete/input en double trait `╔═══╗`, 2 lignes vides entre cadres, labels paddes 12 chars, emojis couleur 🟢🟡🔴🔵⚪⚫🔮, barres `████░░░░` (12 blocs), tendance ▲▶▼, lignes ~55 chars max, vulgariser le jargon.

**Questions groupees (plans)** : lors de l'execution d'un plan, poser TOUTES les questions en debut de session, pas au fil de l'eau. Execution ensuite sans interruption sauf imprevu (bug, regression, trade-off inattendu). Memoire : `feedback_frontload_questions.md`.

## Stack
Vite + React + TypeScript + Tailwind + Supabase + Vercel

## Regles
- Conventional commits : type(scope): description
- Void Glass : dark-only (#030303 ds-surface-0), Figtree (UI), JetBrains Mono (code), tokens DTCG semantic — voir modules/design-system/
- Interdit : #0A0A0B, #08080A, Outfit, Inter, system-ui seul (OK en fallback CSS)
- TSX < 700 lignes — decouper si plus
- BMAD : dossier _bmad/ (underscore obligatoire)

## Conventions nommage (Claude Code Desktop, automatique)

Spec complete : `docs/core/naming-conventions.md`. Source de verite unique, appliquee auto par `/plan-os`, `/wt`, `/cockpit`, `/session-end`.

- **Branches** : `<type>/<scope>-<desc>[-yymmdd]` — ex. `feat/ds-void-glass`, `wt/migration-desktop-260415`. Lowercase, max 40 chars.
- **Worktrees** : via `/wt new <desc>` uniquement, jamais `git worktree add` manuel. Genere `.claude/worktrees/<desc>-<yymmdd>/` + branche `wt/<desc>-<yymmdd>`.
- **Sessions Desktop** : format `🪐 <mini-detail> (DD-MM-YYYY)` via titre de plan (auto-rename natif Desktop app a ExitPlanMode).
- **Plans** : `docs/plans/YYYY-MM-DD-<slug>.md` versionne + `~/.claude/plans/<slug>.md` natif (dual-path).
- **Thinking** : toute reflexion en francais (memoire `feedback_thinking_francais.md`).

Red flag si je cree une branche ou un worktree hors format : arreter, renommer, reprendre.

## Garde-fous (non-negociable)
- Ne JAMAIS creer de fichier a la racine (seuls CLAUDE.md, CONTEXT.md, README.md, .gitignore, package.json y vivent — package.json racine = workspace root UNIQUEMENT, pas un projet ; ajoute 2026-04-09 pour npm workspaces + Design System)
- Ne JAMAIS creer de fichier sans demande explicite de Kevin
- Ne JAMAIS dupliquer une info qui est deja dans CONTEXT.md
- Quand un fichier est deplace ou renomme → mettre a jour TOUTES les references (grep + fix)
- Quand une decision est prise → l'ajouter dans CONTEXT.md section Decisions
- Quand un module change de status → mettre a jour CONTEXT.md section Modules
- Un fichier qui documente un autre fichier = du bloat, ne pas creer
- **`.archive/` = POUBELLE** : pour supprimer un fichier, TOUJOURS `mv` vers `.archive/<contexte>-<yymmdd>/`, JAMAIS `rm` direct. Permet rollback + historique.
- **JAMAIS LIRE `.archive/`** sauf demande explicite Kevin. Dossier exclus du fonctionnement OS — perte de tokens sans valeur. Les scripts (ref-checker, health-check, sync-check) excluent deja `.archive/` du scan. Les Explore agents et Read tool doivent ignorer ce dossier par defaut.
- **Plans termines = auto-archive** : des qu'un plan dans `docs/plans/` est termine (toutes cases `[x]` OU status `done`), `/session-end` le deplace AUTOMATIQUEMENT vers `.archive/plans-done-$(date +%y%m%d)/`. Le brief de cloture liste les plans archives. Le brief suivant (`/cockpit`, `/session-start`) affiche `🟢 N plans termines recemment` dans le cadre PLANS ACTIFS.

## Token-awareness

| Situation | Action |
|-----------|--------|
| < 3 fichiers, 1 domaine | Direct (pas d'agent) |
| 3+ fichiers ou 2+ domaines | Agent(s) |
| Recherche exploratoire | Agent Explore |
| Max agents paralleles | 3 (projet solo) |
| Build/tests | run_in_background |

## Anti-bullshit gates
- Jamais de "TERMINE" ou "100%" sans preuve (build + test execute)
- Avant d'affirmer "X fonctionne" → executer la commande, montrer l'output
- Chaque metrique doit avoir une commande de verification
- Mots interdits : revolution, historique, reference mondiale, premier au monde, $XB, accomplish
- Commits factuels : pas de "achieve", "world-first", "revolutionary"
- Red flag : si plus de MD que de code dans une session, c'est suspect
- **Verification visuelle obligatoire** : pour toute tache a impact UI/visuel (Supernova, Storybook, app deployee, dashboard externe), avant de dire "fait" je DOIS prendre un screenshot via chrome-devtools MCP (ou equivalent) et verifier de mes yeux que le changement est visible. Pas de confiance aveugle dans la sortie d'une CLI ou d'une API — une reponse "200 OK" ne veut pas dire que c'est visible. Regle ajoutee 2026-04-14 apres 2 faux "c'est fait" sur Supernova (analyze push != visibilite UI).

## Core OS — Routing

Spec complete : `docs/core/cortex.md`. Table signaux → agents section 1. Point d'entree simplifie : `/cockpit`.

## Core OS — Communication

Spec complete : `docs/core/communication.md`. 4 tiers (Session/Contexte/Reference/Auto-memory). Regle d'or : une info ne vit que dans UN tier.

## Core OS — Monitor

Spec complete + seuils : `docs/core/monitor.md`. Execution : `bash scripts/health-check.sh`.

## Core OS — Tools

Spec base : `docs/core/tools.md`. Catalogue complet : `docs/core/tools/index.json` (97 outils).
Routing etendu : `docs/core/tools/routing.json`. CLI : `bash scripts/tool-register.sh`.
En session-start, lire l'index pour le routing intelligent des outils.
Quand un outil evolue, mettre a jour sa doc via `tool-register.sh rebuild`.

## Structure
modules/app/       Module App Builder (React, actif)
docs/              Architecture, design system, manifeste, guide setup, specs, plans
docs/core/         Specs Core OS (cortex, communication, monitor, tools)
scripts/hooks/     Hooks (Void Glass, security)
supabase/          Migrations DB
_bmad/             BMAD v6 (12 modules)
.claude/           Agents, commands, settings
.archive/          Historique (ne pas toucher sauf demande)

## Build
cd modules/app && npm run dev    # Dev local
cd modules/app && npm run build  # Production

## Agents (.claude/agents/)
- os-architect  : architecture, decisions, stack, schema, structure
- dev-agent     : code React/TS, composants, Supabase, Void Glass
- doc-agent     : documentation, CONTEXT.md, traces
- review-agent  : coherence, audit, zero regression, pre-deploy

Protocole uniforme : entree (CONTEXT.md + scope) → execution → sortie (rapport court).
Spec agents : docs/core/cortex.md section 4.

## Commands (.claude/commands/)
- /cockpit       : point d'entree unique — scan + brief + routing + cloture (TDAH-friendly)
- /session-start : contexte + structure check + build tous modules actifs + announce
- /session-end   : list changes + coherence + build + update CONTEXT.md + propose commit
- /plan-os       : generateur de plan — routing modele auto (haiku/sonnet/opus) + regle sub-agent + versionnement docs/plans/
- /new-project   : scaffold modules/[nom]/ + update CONTEXT.md
- /sync          : coherence projet entiere (structure, refs, CONTEXT.md vs filesystem, Void Glass)

## Reference
- Design spec v2 : docs/specs/2026-04-05-foundation-os-v2-design.md
- Plan Phase 1 : docs/plans/2026-04-05-phase1-fondations.md
- Cockpit spec : docs/specs/2026-04-10-cockpit-design.md
- Archives : `.archive/` (directive-v1.md, tools-audit.md)
