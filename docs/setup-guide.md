# Foundation OS — Guide Setup

## Prerequis

- Node.js >= 18
- Claude Code CLI (`npm install -g @anthropic-ai/claude-code`)
- Comptes : GitHub, Supabase, Vercel

## Installation

```bash
git clone git@github.com:kevinnoeldivers-5446/foundation-os.git
cd foundation-os
claude .
```

Claude Code charge automatiquement CLAUDE.md et la memoire native.

## Structure

```
CLAUDE.md          Instructions (lu automatiquement)
CONTEXT.md         Etat actuel (lu via /session-start)
modules/app/       App React (cd modules/app && npm install && npm run dev)
docs/              Documentation de reference
_bmad/             BMAD v6 (installe)
.claude/           Agents, commands, hooks
.omc/              OMC (installe)
```

## Commandes

- /session-start : lire etat + verifier structure + build check + annoncer next
- /session-end : verifier coherence + mettre a jour CONTEXT.md + proposer commit
- /new-project : creer un nouveau module dans modules/
- /sync-md : verifier coherence MD/JSX dans l'app

## Outils installes

- **OMC** : oh-my-claudecode (multi-agent, autopilot, ralph, ultrawork)
- **BMAD v6** : 12 modules dans _bmad/ (brainstorming, elicitation, reviews)
- **MCP** : Notion, Asana, Figma, Monday, ClickUp, Computer Use, Context7
- **Hooks** : validate-void-glass (PreToolUse) + conventional-commit (git hook)

## Dev local

```bash
cd modules/app
npm install
npm run dev      # localhost:5173
npm run build    # production
```

## Vercel

Root Directory = `modules/app` (a configurer dans Vercel). Auto-deploy sur git push vers main.
