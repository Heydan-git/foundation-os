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
1. Lire CONTEXT.md pour etat actuel + prochaine action
2. Ne jamais inventer de metriques — verifier les fichiers
3. Evaluations realistes uniquement — zero bullshit, zero auto-congratulation
4. Ne jamais ajouter de fonctionnalites non demandees
5. En fin de session, mettre a jour CONTEXT.md (resume + prochaine action)

## Briefs session (format obligatoire)

Template complet en memoire : `feedback_brief_format.md` (v9, valide 2026-04-09).

**11 sections dans l'ordre** : Etat global (3 barres sante/build/tests) → Mission/Focus/Derniere session → Modules/Acces rapides/Git → Alertes sante/Rappels/Questions en attente → Dernier commit → Termine → En cours → En pause → Reflexions/Parking → Decisions cles/Echeance → Prochaine action/Ton input.

**Regles de rendu** : emojis couleur 🟢🟡🔴🔵⚪⚫🔮, barres `████░░░░` (12 blocs max), separateurs 32 chars, lignes courtes (safe petit terminal), vulgariser le jargon (glose 3-4 mots), mise en garde automatique si risque regression.

**Questions groupees (plans)** : lors de l'execution d'un plan, poser TOUTES les questions en debut de session, pas au fil de l'eau. Execution ensuite sans interruption sauf imprevu (bug, regression, trade-off inattendu). Memoire : `feedback_frontload_questions.md`.

## Stack
Vite + React + TypeScript + Tailwind + Supabase + Vercel

## Regles
- Conventional commits : type(scope): description
- Void Glass : fond #06070C, Figtree (UI), JetBrains Mono (code) — voir docs/design-system.md
- Interdit : #0A0A0B, #08080A, Outfit, Inter, system-ui seul (OK en fallback CSS)
- TSX < 700 lignes — decouper si plus
- BMAD : dossier _bmad/ (underscore obligatoire)

## Garde-fous (non-negociable)
- Ne JAMAIS creer de fichier a la racine (seuls CLAUDE.md, CONTEXT.md, README.md, .gitignore, package.json y vivent — package.json racine = workspace root UNIQUEMENT, pas un projet ; ajoute 2026-04-09 pour npm workspaces + Design System)
- Ne JAMAIS creer de fichier sans demande explicite de Kevin
- Ne JAMAIS dupliquer une info qui est deja dans CONTEXT.md
- Quand un fichier est deplace ou renomme → mettre a jour TOUTES les references (grep + fix)
- Quand une decision est prise → l'ajouter dans CONTEXT.md section Decisions
- Quand un module change de status → mettre a jour CONTEXT.md section Modules
- Un fichier qui documente un autre fichier = du bloat, ne pas creer

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

## Core OS — Routing

Cortex route les taches vers l'agent adapte. Table signaux → agents : `docs/core/cortex.md` section 1 (source unique).

Agents : os-architect, dev-agent, doc-agent, review-agent.
Priorite : match explicite → deleguer. Ambiguite → demander. Aucun match → traiter directement.
Multi-agent → sequentiel (ex: dev puis review). Trivial (< 1 fichier) → direct.

## Core OS — Memory

4 tiers de memoire. Spec complete : docs/core/memory.md

| Tier | Support | Quand mettre a jour |
|------|---------|---------------------|
| Session | Conversation | Automatique (volatile) |
| Contexte | CONTEXT.md | Chaque /session-end |
| Reference | docs/ | Quand un fondamental change |
| Auto-memory | Claude natif | Automatique |

Regle d'or : une info ne vit que dans UN tier. Pas de duplication.
Decisions dans CONTEXT.md : toujours avec date (YYYY-MM-DD).

## Core OS — Monitor

Health indicators par severite. Spec complete + seuils : `docs/core/monitor.md` (source unique).

Execution : `bash scripts/health-check.sh` (appele par pre-commit et /session-end).
Verdicts : SAIN (0 critical, 0 warning) / DEGRADED (0 critical, 1+ warning) / BROKEN (1+ critical).

## Core OS — Tools

Utilitaires et automation. Spec complete : docs/core/tools.md

Existants : validate-void-glass.sh (hook), security-reminder.py (hook), commit-msg (git hook), health-check.sh (Monitor), supabase-ping (GitHub Actions cron), Vercel auto-deploy.
Backlog : ref-checker (a construire sur demande).
Convention : scripts/ en bash/node, kebab-case, idempotent, exit codes standards.

## Structure
modules/app/       Module App Builder (React, actif)
docs/              Architecture, design system, manifeste, guide setup, specs, plans
docs/core/         Specs Core OS (cortex, memory, monitor, tools)
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
- /session-start : contexte + structure check + build tous modules actifs + announce
- /session-end   : list changes + coherence + build + update CONTEXT.md + propose commit
- /new-project   : scaffold modules/[nom]/ + update CONTEXT.md
- /sync          : coherence projet entiere (structure, refs, CONTEXT.md vs filesystem, Void Glass)

## Reference
- Directive complete : docs/directive-v1.md
- Design spec v2 : docs/specs/2026-04-05-foundation-os-v2-design.md
- Plan Phase 1 : docs/plans/2026-04-05-phase1-fondations.md
