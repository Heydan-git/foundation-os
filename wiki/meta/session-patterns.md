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

> Auto-regenere par `scripts/sessions-analyze.sh`. Source : `~/.claude/projects/-Users-kevinnoel-foundation-os/*.jsonl` (72 sessions).
>
> Objectif : observer comment Kevin travaille avec Claude pour detecter patterns, friction, opportunites d'amelioration.

## Vue d'ensemble

| Metrique | Valeur |
|----------|--------|
| Sessions analysees | 72 |
| Messages Kevin totaux | 548 |
| Tool calls totaux | 9549 |
| Moyenne msgs/session | 7.6 |
| Moyenne tools/session | 132.6 |
| Transcripts total | 177.2 MB |

## Slash commands frequence (top 10)

| Command | Count | Part |
|---------|-------|------|
| `/sync` | 27 | 30.0% |
| `/session-end` | 26 | 28.9% |
| `/session-start` | 19 | 21.1% |
| `/new-project` | 13 | 14.4% |
| `/cockpit` | 4 | 4.4% |
| `/save` | 1 | 1.1% |

## Tools utilises (top 15)

| Tool | Count | Part |
|------|-------|------|
| `Bash` | 3192 | 33.4% |
| `Read` | 1864 | 19.5% |
| `Edit` | 1298 | 13.6% |
| `TaskUpdate` | 636 | 6.7% |
| `Write` | 550 | 5.8% |
| `TaskCreate` | 356 | 3.7% |
| `Grep` | 346 | 3.6% |
| `Agent` | 203 | 2.1% |
| `Skill` | 145 | 1.5% |
| `Glob` | 98 | 1.0% |
| `mcp__neon-browser__click` | 93 | 1.0% |
| `mcp__plugin_chrome-devtools-mcp_chrome-devtools__navigate_page` | 92 | 1.0% |
| `ToolSearch` | 87 | 0.9% |
| `mcp__plugin_chrome-devtools-mcp_chrome-devtools__take_screenshot` | 86 | 0.9% |
| `mcp__neon-browser__screenshot` | 69 | 0.7% |

## Agents delegues (top 10 via Task tool)

| Agent | Count |
|-------|-------|
| (aucun agent delegue) | 0 |

## Lexique Kevin — top 30 mots (hors stopwords, >= 4 chars)

| Mot | Count |
|-----|-------|
| task | 1171 |
| file | 968 |
| output | 928 |
| foundation | 819 |
| claude | 809 |
| status | 737 |
| users | 640 |
| kevinnoel | 633 |
| tool | 633 |
| summary | 621 |
| code | 590 |
| notification | 580 |
| completed | 538 |
| memory | 381 |
| exit | 326 |
| check | 310 |
| json | 308 |
| command | 305 |
| tasks | 305 |
| private | 295 |
| session | 271 |
| system | 268 |
| files | 266 |
| modules | 259 |
| background | 257 |
| context | 225 |
| data | 209 |
| module | 204 |
| build | 199 |
| test | 189 |

## Rework ratio — fichiers modifies plusieurs fois

**227 fichiers** modifies > 1 fois (sur 487 fichiers distincts).

| Fichier | Modifications |
|---------|---------------|
| `~/foundation-os/CONTEXT.md` | 340 |
| `~/foundation-os/docs/monitor/data.js` | 53 |
| `~/foundation-os/CLAUDE.md` | 40 |
| `~/foundation-os/modules/app/src/lib/mutations.ts` | 32 |
| `~/foundation-os/FOS-MONITORING.md` | 32 |
| `~/foundation-os/scripts/health-check.sh` | 23 |
| `~/foundation-os/app/src/lib/mutations.ts` | 23 |
| `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md` | 22 |
| `~/foundation-os/modules/design-system/package.json` | 21 |
| `~/foundation-os/docs/audit-massif/00-INDEX.md` | 20 |

## Sessions recentes (5 dernieres)

| Session | Date | Msgs Kevin | Tool calls | Fichiers touches |
|---------|------|-----------|-----------|------------------|
| `b6e881e7...` | 2026-04-16 | 7 | 194 | 22 |
| `83ec785d...` | 2026-04-15 | 13 | 81 | 16 |
| `8b1ca419...` | 2026-04-15 | 45 | 398 | 35 |
| `047a27da...` | 2026-04-15 | 3 | 13 | 1 |
| `b1478500...` | 2026-04-14 | 0 | 117 | 11 |

## Insights

- **Command dominant** : `/sync` (27 invocations = 30% du total)
- **Tool dominant** : `Bash` (3192 calls = 33% du total)
- **Ratio delegation agents** : Task = 0/9549 tool calls (0.0%). Faible delegation (Claude fait tout en direct).
- **Rework concentre** : top fichier modifie 340 fois sur 72 sessions

## Regeneration

```bash
bash scripts/sessions-analyze.sh                   # complet
bash scripts/sessions-analyze.sh --limit=10        # dev (10 sessions)
bash scripts/sessions-analyze.sh --period=7d       # derniers 7 jours
```

## Refs

- Audit v2 : `docs/audits/2026-04-16-mega-audit-v2/rapport-comportement.md` I-02 (C-17 transcripts inexploites)
- Decouverte : les vrais transcripts sont dans `~/.claude/projects/-Users-kevinnoel-foundation-os/*.jsonl` (72 transcripts, 177.2 MB). `.omc/sessions/*.json` ne contient que metadata 189 bytes chacune.
