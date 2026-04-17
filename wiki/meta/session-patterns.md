---
type: meta
title: "Session Patterns — Analytics"
updated: 2026-04-17
tags:
  - meta
  - sessions
  - analytics
  - patterns
status: evergreen
related:
  - "[[sessions-recent]]"
  - "[[thinking]]"
  - "[[index-meta]]"
---

# Session Patterns — Analytics

> Auto-regenere par `scripts/sessions-analyze.sh`. Source : `~/.claude/projects/-Users-kevinnoel-foundation-os/*.jsonl` (28 sessions (periode 7d)).
>
> Objectif : observer comment Kevin travaille avec Claude pour detecter patterns, friction, opportunites d'amelioration.

## Vue d'ensemble

| Metrique | Valeur |
|----------|--------|
| Sessions analysees | 28 |
| Messages Kevin totaux | 203 |
| Tool calls totaux | 3846 |
| Moyenne msgs/session | 7.2 |
| Moyenne tools/session | 137.4 |
| Transcripts total | 58.1 MB |

## Slash commands frequence (top 10)

| Command | Count | Part |
|---------|-------|------|
| `/cockpit` | 4 | 100.0% |

## Tools utilises (top 15)

| Tool | Count | Part |
|------|-------|------|
| `Bash` | 1214 | 31.6% |
| `Read` | 852 | 22.2% |
| `Edit` | 548 | 14.2% |
| `Write` | 253 | 6.6% |
| `TaskUpdate` | 200 | 5.2% |
| `Grep` | 169 | 4.4% |
| `TaskCreate` | 118 | 3.1% |
| `mcp__plugin_chrome-devtools-mcp_chrome-devtools__navigate_page` | 78 | 2.0% |
| `mcp__plugin_chrome-devtools-mcp_chrome-devtools__take_screenshot` | 70 | 1.8% |
| `Skill` | 42 | 1.1% |
| `Agent` | 39 | 1.0% |
| `mcp__neon-browser__tab-content-jq-search-query` | 37 | 1.0% |
| `ToolSearch` | 29 | 0.8% |
| `mcp__neon-browser__click` | 28 | 0.7% |
| `Glob` | 26 | 0.7% |

## Agents delegues (top 10 via Task tool)

| Agent | Count |
|-------|-------|
| (aucun agent delegue) | 0 |

## Lexique Kevin — top 30 mots (hors stopwords, >= 4 chars)

| Mot | Count |
|-----|-------|
| task | 272 |
| output | 210 |
| claude | 161 |
| file | 152 |
| status | 146 |
| foundation | 139 |
| tool | 139 |
| notification | 136 |
| summary | 136 |
| completed | 128 |
| veux | 106 |
| kevinnoel | 93 |
| code | 93 |
| users | 90 |
| command | 71 |
| private | 68 |
| tasks | 68 |
| background | 63 |
| exit | 63 |
| composants | 63 |
| branch | 58 |
| main | 50 |
| build | 46 |
| merge | 43 |
| sont | 42 |
| fois | 41 |
| check | 39 |
| worktree | 38 |
| system | 38 |
| jolly | 36 |

## Rework ratio — fichiers modifies plusieurs fois

**124 fichiers** modifies > 1 fois (sur 283 fichiers distincts).

| Fichier | Modifications |
|---------|---------------|
| `~/foundation-os/CONTEXT.md` | 119 |
| `~/foundation-os/modules/app/src/lib/mutations.ts` | 31 |
| `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md` | 17 |
| `~/foundation-os/docs/monitor/data.js` | 17 |
| `~/foundation-os/CLAUDE.md` | 15 |
| `~/foundation-os/modules/app/src/pages/IndexPage.tsx` | 15 |
| `~/foundation-os/modules/design-system/package.json` | 15 |
| `~/foundation-os/modules/app/src/App.tsx` | 11 |
| `~/foundation-os/scripts/health-check.sh` | 10 |
| `~/foundation-os/modules/design-system/src/styles/globals.css` | 9 |

## Sessions recentes (5 dernieres)

| Session | Date | Msgs Kevin | Tool calls | Fichiers touches |
|---------|------|-----------|-----------|------------------|
| `b6e881e7...` | 2026-04-16 | 7 | 194 | 22 |
| `83ec785d...` | 2026-04-15 | 13 | 81 | 16 |
| `8b1ca419...` | 2026-04-15 | 45 | 398 | 35 |
| `047a27da...` | 2026-04-15 | 3 | 13 | 1 |
| `b1478500...` | 2026-04-14 | 0 | 117 | 11 |

## Insights

- **Command dominant** : `/cockpit` (4 invocations = 100% du total)
- **Tool dominant** : `Bash` (1214 calls = 32% du total)
- **Ratio delegation agents** : Task = 0/3846 tool calls (0.0%). Faible delegation (Claude fait tout en direct).
- **Rework concentre** : top fichier modifie 119 fois sur 28 sessions

## Regeneration

```bash
bash scripts/sessions-analyze.sh                   # complet
bash scripts/sessions-analyze.sh --limit=10        # dev (10 sessions)
bash scripts/sessions-analyze.sh --period=7d       # derniers 7 jours
```

## Refs

- Audit v2 : `docs/audits/2026-04-16-mega-audit-v2/rapport-comportement.md` I-02 (C-17 transcripts inexploites)
- Decouverte : les vrais transcripts sont dans `~/.claude/projects/-Users-kevinnoel-foundation-os/*.jsonl` (28 transcripts, 58.1 MB). `.omc/sessions/*.json` ne contient que metadata 189 bytes chacune.
