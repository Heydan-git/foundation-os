# Foundation OS

OS de travail personnel IA-driven. Modules : App Builder (actif), Finance (prevu), Sante (prevu).

## A chaque session
1. Lire CONTEXT.md pour etat actuel + prochaine action
2. Ne jamais inventer de metriques — verifier les fichiers
3. Evaluations realistes uniquement — zero bullshit, zero auto-congratulation
4. Ne jamais ajouter de fonctionnalites non demandees
5. En fin de session, mettre a jour CONTEXT.md (resume + prochaine action)

## Stack
Vite + React + TypeScript + Tailwind + Supabase + Vercel

## Regles
- Conventional commits : type(scope): description
- Void Glass : fond #06070C, Figtree (UI), JetBrains Mono (code) — voir docs/design-system.md
- Interdit : #0A0A0B, #08080A, Outfit, Inter, system-ui seul (OK en fallback CSS)
- JSX < 700 lignes — decouper si plus
- BMAD : dossier _bmad/ (underscore obligatoire)

## Garde-fous (non-negociable)
- Ne JAMAIS creer de fichier a la racine (seuls CLAUDE.md, CONTEXT.md, README.md, .gitignore y vivent)
- Ne JAMAIS creer de fichier sans demande explicite de Kevin
- Ne JAMAIS dupliquer une info qui est deja dans CONTEXT.md
- Quand un fichier est deplace ou renomme → mettre a jour TOUTES les references (grep + fix)
- Quand une decision est prise → l'ajouter dans CONTEXT.md section Decisions
- Quand un module change de status → mettre a jour CONTEXT.md section Modules
- Un fichier qui documente un autre fichier = du bloat, ne pas creer

## Anti-bullshit gates
- Jamais de "TERMINE" ou "100%" sans preuve (build + test execute)
- Avant d'affirmer "X fonctionne" → executer la commande, montrer l'output
- Chaque metrique doit avoir une commande de verification
- Mots interdits : revolution, historique, reference mondiale, premier au monde, $XB, accomplish
- Commits factuels : pas de "achieve", "world-first", "revolutionary"
- Red flag : si plus de MD que de code dans une session, c'est suspect

## Core OS — Routing

Cortex route les taches vers l'agent adapte. Spec complete : docs/core/cortex.md

| Signal | Agent |
|--------|-------|
| architecture, ADR, stack, schema, structurer, option A vs B | os-architect |
| code, composant, page, Supabase, React, build, scaffold, CSS | dev-agent |
| documente, note, trace, journalise, met a jour CONTEXT | doc-agent |
| verifie, audit, check, revue, regression, deployer | review-agent |

Priorite : match explicite → deleguer. Ambiguite → demander. Aucun match → traiter directement.
Multi-agent → sequentiel (ex: dev puis review). Trivial (< 1 fichier) → direct.

## Structure
modules/app/       Module App Builder (React, actif)
docs/              Architecture, design system, manifeste, guide setup
docs/core/         Specs Core OS (cortex, architecture)
scripts/hooks/     Hook Void Glass (PreToolUse)
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
