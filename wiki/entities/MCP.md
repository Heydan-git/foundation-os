---
type: entity
title: "MCP (Model Context Protocol)"
entity_type: product
aliases:
  - "Model Context Protocol"
url: "https://modelcontextprotocol.io"
github: "https://github.com/modelcontextprotocol"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - protocol
  - ai-integration
  - anthropic
  - design-to-code
status: mature
confidence: high
related:
  - "[[index-entities]]"
  - "[[Figma]]"
  - "[[Figma Make]]"
  - "[[Jordan]]"
  - "[[Nolly Studio]]"
  - "[[hamish-oneill-shadcncraft]]"
  - "[[nolly-studio-cult-ui-pro]]"
sources: []
---

# MCP (Model Context Protocol)

## What

Protocole ouvert par Anthropic permettant aux LLMs (Claude, GPT, Gemini) d'acceder a des sources de donnees externes via des **serveurs MCP** standardises. Equivalent des "tools API" mais generique + composable.

## Why It Matters

**Pivot ecosysteme 2026** : utilise par Claude Code (Foundation OS tooling), [[hamish-oneill-shadcncraft|Shadcncraft]] (plugin Figma → React), [[Nolly Studio]] (Cult UI Pro integration Cursor/Claude Code/VS Code), [[Figma]] (MCP design-to-code). Pattern emergent = **design-to-code via MCP**.

Foundation OS utilise deja MCP via Claude Code (plusieurs serveurs MCP configures : claude_ai_Asana, claude_ai_Notion, Figma, Context7, etc. — visible dans les system-reminders au debut de chaque session Claude Code).

## Key Facts

- Createur : Anthropic (2024)
- Protocole : JSON-RPC over stdio/HTTP
- Category : LLM integration protocol
- License : MIT (spec) + implementations diverses
- Adoption 2026-04 : massive (Cursor, Claude Code, VS Code, Figma, v0, etc.)
- Ecosystem : 500+ serveurs MCP publies (GitHub, Notion, Asana, Linear, etc.)

## Connections

- [[Figma]] — MCP integration design-to-code
- [[Figma Make]] — AI design utilise MCP
- [[hamish-oneill-shadcncraft]] — Figma plugin avec MCP support
- [[nolly-studio-cult-ui-pro]] — integration MCP Cursor/Claude Code
- [[Foundation OS]] — utilise MCP via Claude Code (Asana, Notion, Figma, etc.)

## External Refs

- Site : https://modelcontextprotocol.io
- GitHub : https://github.com/modelcontextprotocol
- Anthropic docs : https://docs.anthropic.com/mcp
