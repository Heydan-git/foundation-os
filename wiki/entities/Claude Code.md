---
type: entity
title: "Claude Code"
entity_type: product
aliases:
  - "Claude Code CLI"
url: "https://www.claude.com/claude-code"
github: "https://github.com/anthropics/claude-code"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - cli
  - anthropic
  - foundation-os-core
  - llm-agent
status: mature
confidence: high
related:
  - "[[index-entities]]"
  - "[[Claude Code Configuration Pattern]]"
  - "[[claude-code-config-guide-2026-04]]"
  - "[[Foundation OS]]"
  - "[[Core OS]]"
  - "[[MCP]]"
  - "[[AgriciDaniel]]"
sources: []
---

# Claude Code

## What

CLI d'Anthropic pour interaction LLM-native avec un codebase. Disponible comme **CLI terminal**, **desktop app** (Mac/Windows), **web app** (claude.ai/code), et **extensions IDE** (VS Code, JetBrains). Integre natively avec le file system, git, shell commands, web fetching, MCP servers.

**Runtime principal de Foundation OS** : toute la config Core OS (commands, agents, hooks, skills, permissions) vit autour de Claude Code. FOS utilise Claude Code Desktop avec worktrees natifs + plan window UI + tasks pane.

## Why It Matters

**Outil central de FOS**. Kevin travaille **exclusivement** via Claude Code (pas Cursor, pas OpenAI ChatGPT, pas Gemini CLI). Toutes les decisions d'architecture FOS (5 tiers memoire, brief v12, cortex routing, worktrees, hooks) sont designed pour Claude Code specifiquement.

Versions utilisees FOS :
- **Opus 4.7** (1M context) — modele principal pour sessions longues
- **Sonnet 4.6** — fallback / taches ciblees
- **Haiku 4.5** — taches rapides (read-only, code review legere)

## Key Facts

- Developer : **Anthropic**
- Category : LLM agent CLI + IDE extensions
- Modeles supportes : Opus 4.7 (1M context), Sonnet 4.6, Haiku 4.5
- Tools natifs : Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, TodoWrite, Agent, etc.
- MCP integration native : serveurs MCP configurables
- Auto-memory : `~/.claude/projects/<project>/` persist notes cross-session
- Hooks system : PreToolUse, PostToolUse, Stop, SessionStart/End, PreCompact, UserPromptSubmit, Notification
- Configuration : `.claude/` projet + `~/.claude/` user
- Plugins marketplace : OMC, BMAD, Superpowers, claude-obsidian, etc.

## FOS usage patterns

### Commands custom FOS (.claude/commands/)
- `/cockpit` — point d'entree unique
- `/session-start` + `/session-end` — protocoles session
- `/plan-os` — orchestrateur plans
- `/wt` — worktrees management
- `/new-project` — scaffold module
- `/sync` — audit coherence

### Agents FOS (.claude/agents/)
- `os-architect` (opus) — decisions architecture
- `dev-agent` (sonnet) — code React/TS
- `doc-agent` (sonnet) — documentation
- `review-agent` (sonnet) — audit coherence

### Hooks FOS (5 actifs)
- PreToolUse Write|Edit|MultiEdit : validate-void-glass + security-reminder
- PreToolUse Read : memory-last-used-hook
- SessionStart : session-start-wiki (inject hot.md)
- SessionEnd : auto-archive-plans
- PreCompact : pre-compaction-snapshot

### Plugins FOS
- **OMC** (oh-my-claudecode) — multi-agent orchestration
- **claude-obsidian** (v1.4.3, [[AgriciDaniel]]) — knowledge layer wiki
- **Superpowers** v5.0.7 — skills additionnels
- **gstack** — browser QA
- **BMAD** v6 (dormant) — methodologie

## Configuration pattern

Voir [[Claude Code Configuration Pattern]] pour le pattern complet (24 parties derivees du guide community). FOS implemente ~70-80% avec 4-5 gaps mineurs identifies.

## Connections

- [[Claude Code Configuration Pattern]] — pattern canonique
- [[claude-code-config-guide-2026-04]] — guide source
- [[Foundation OS]] — application centrale
- [[Core OS]] — adaptation FOS
- [[MCP]] — protocole integration (Cursor, Claude Code, VS Code)
- [[AgriciDaniel]] — createur plugin claude-obsidian adopte par FOS

## External Refs

- Site : https://www.claude.com/claude-code
- GitHub : https://github.com/anthropics/claude-code
- Docs : https://docs.claude.com/claude-code
- MCP docs : https://docs.anthropic.com/mcp
