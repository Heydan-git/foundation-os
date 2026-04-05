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

## Structure
modules/app/       Module App Builder (React, actif)
docs/              Architecture, design system, manifeste, guide setup
scripts/hooks/     Hook Void Glass (PreToolUse)
supabase/          Migrations DB
_bmad/             BMAD v6 (12 modules)
.claude/           Agents, commands, settings
.archive/          Historique (ne pas toucher sauf demande)

## Build
cd modules/app && npm run dev    # Dev local
cd modules/app && npm run build  # Production

## Agents (.claude/agents/)
- os-architect  : architecture, decisions, structure
- doc-agent     : documentation, CONTEXT.md, sync
- review-agent  : coherence, zero regression
- dev-agent     : code React, Supabase, Void Glass

## Commands (.claude/commands/)
- /session-start : lire CONTEXT.md, git status, build check, annoncer etat + next
- /session-end   : verifier coherence, mettre a jour CONTEXT.md, proposer commit
- /new-project   : creer un nouveau module dans modules/
- /sync-md       : verifier coherence MD/JSX dans l'app
