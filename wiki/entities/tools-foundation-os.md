---
type: entity
title: "Foundation OS Toolchain"
entity_type: tool
aliases:
  - "Tools inventory"
  - "Foundation OS tools"
  - "Outils installes Foundation OS"
url: ""
created: 2026-04-15
updated: 2026-04-16
tags:
  - entity
  - tool
  - foundation-os
status: mature
confidence: high
related:
  - "[[index-entities]]"
  - "[[foundation-os-desktop-migration]]"
  - "[[Obsidian]]"
  - "[[AgriciDaniel]]"
  - "[[LLM Wiki Pattern]]"
  - "[[Void Glass]]"
  - "[[design-system-components]]"
sources:
  - "[[agricidaniel-claude-obsidian]]"
migrated_from: "auto-memory/tools_inventory.md (2026-04-16, D-WIKI-01 Phase 5)"
---

# Foundation OS — Toolchain

> Entity regroupant les outils installes dans Foundation OS.
> Source originale : auto-memory `tools_inventory.md`. Migre vers wiki D-WIKI-01 Phase 5.

## Claude Code

- CLAUDE.md (~177 lignes), 4 agents custom, 6+ commands custom (dont /wiki /save /autoresearch /canvas post-D-WIKI-01)
- Hooks PreToolUse (validate-void-glass + security-reminder)
- Hooks SessionStart (drift-detector + wiki hot.md), PostCompact (hot.md re-read), Stop (wiki changed notif)
- Git hooks : pre-commit (build+vitest+health) + commit-msg (11 types conventional) + branch-name-check

## OMC (oh-my-claudecode) v4.10.1

88 skills plugins (4 Foundation custom + 17 superpowers + 37 oh-my-claudecode + 6 figma + 4 chrome-devtools-mcp + 6 Claude Code built-in + 14 divers)
Agents : executor, designer, writer, architect, code-reviewer, verifier, explorer, planner, + 11 autres OMC

## claude-obsidian v1.4.3 (D-WIKI-01, 2026-04-15)

10 skills : wiki, wiki-ingest, wiki-query, wiki-lint, save, autoresearch, canvas, defuddle, obsidian-bases, obsidian-markdown
4 commands : /wiki, /save, /autoresearch, /canvas
2 agents : wiki-ingest, wiki-lint
5 templates : concept, source, entity, comparison, question

## BMAD v6 (_bmad/)

12 modules dormants (decision garde 2026-04-07, re-confirmee 2026-04-09)

## MCP connectes

Asana, Notion, Figma, Monday, ClickUp, Computer Use, Context7, Chrome DevTools, Pencil
Gmail/Slack/Google Calendar : auth requise

## Scripts Foundation OS

health-check, drift-detector, docs-sync-check, ref-checker, wiki-commit, wiki-health, auto-archive-plans, module-scaffold, sync-check, tool-register, session-lock, worktree-new/clean/list + hooks/session-start-wiki

## Connections

- [[Obsidian]] — editeur vault wiki
- [[AgriciDaniel]] — plugin claude-obsidian
- [[LLM Wiki Pattern]] — pattern architectural du wiki
- [[Void Glass]] — design system dark-only
- [[design-system-components]] — 46 composants + 6 foundations DS
- [[foundation-os-desktop-migration]] — migration CLI → Desktop natif

## Total

~177+ points d'invocation (post-D-WIKI-01 : +10 skills +4 commands +2 agents claude-obsidian)
