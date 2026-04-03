# Foundation OS — Claude Code Instructions
# ⚠️ Ce fichier = instructions Claude Code (L2 terminal)
# Pour Cowork (L1b desktop) : voir SKILL.md dans le dossier foundation-os/

## Projet
Foundation OS · OS de travail IA-driven · Coopération Claude/Kévin
Stack : Vite + React + TypeScript + Tailwind + Supabase + Vercel
Repo  : foundation-os (GitHub privé) · Phase : 00 — Setup

## Règles absolues

1. MD FIRST — modifier NOM-DATA.md avant NOM.jsx, toujours, sans exception
2. VOID GLASS — fond #06070C · Figtree (UI) · JetBrains Mono (labels/code)
3. TAILLE — artifacts JSX < 700 lignes / ~50KB
4. SYNC — livrer MD + JSX ensemble, jamais l'un sans l'autre
5. BMAD — dossier _bmad/ (UNDERSCORE, jamais .bmad/)
6. ZÉRO NUISANCE — aucun mal volontaire ou involontaire

## Patterns obligatoires

- Conventional commits : `type(scope): description`
  types : feat · fix · docs · refactor · chore · test · style
- API Claude : model "claude-sonnet-4-20250514" · max_tokens 1000
- JSON repair : tryParse 4 passes si réponse AI tronquée
- Supabase : supabase-js SDK direct depuis React, pas de backend custom
- Error log : toute erreur Claude → ajouter dans FOS-ERROR-LOG.md puis CLAUDE.md

## Gestion du contexte

- 0-50%  → travailler librement
- 50-70% → surveiller, compacter si session longue
- 70-90% → /compact obligatoire avant de continuer
- 90%+   → /clear + résumer la session dans FOS-JOURNAL.md

## Interdictions

- Modifier un JSX sans son MD pair à jour
- Ne jamais utiliser #0A0A0B ni #08080A (toujours #06070C)
- Ne jamais utiliser Outfit, Inter, system-ui (toujours Figtree)
- Artifact > 700L sans découper en 2 modules
- Supprimer décisions ou historique tracés
- Nommer le dossier BMAD autrement que _bmad/ (underscore obligatoire)

## Agents disponibles (.claude/agents/)

- os-architect  → architecture · ADR · review structure
- doc-agent     → MD · traçabilité · journal · sync
- review-agent  → garde-fous · cohérence · zéro régression
- dev-agent     → code React · Supabase · Void Glass

## Slash commands (.claude/commands/)

- /session-start → charger contexte + état + prochaine action
- /session-end   → résumer + lister fichiers modifiés + next step
- /new-project   → créer structure nouveau projet dans Foundation OS
- /sync-md       → vérifier cohérence MD/JSX de tous les artifacts
