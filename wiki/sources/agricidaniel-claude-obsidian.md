---
type: source
title: "claude-obsidian (AgriciDaniel)"
source_type: repo
author: "AgriciDaniel"
date_published: 2026-04-13
url: "https://github.com/AgriciDaniel/claude-obsidian"
confidence: high
key_claims:
  - "Plugin Claude Code implementant le pattern Karpathy LLM Wiki avec Obsidian"
  - "10 skills + 4 commands + 2 agents + 5 templates"
  - "Hot cache wiki/hot.md (~500 mots) lu en premier chaque session"
  - "Token cost stable meme avec 1000+ pages (on-demand loading)"
  - "Delta tracking .manifest.json evite re-ingestion"
  - "PostToolUse auto-commit (desactive dans Foundation OS)"
created: 2026-04-15
updated: 2026-04-16
tags:
  - source
  - repo
  - plugin
  - claude-code
  - obsidian
status: mature
related:
  - "[[karpathy-llm-wiki-pattern]]"
sources: []
---

# claude-obsidian (AgriciDaniel)

## Summary

Plugin Claude Code cree par [[../entities/AgriciDaniel]] qui implemente le [[../concepts/LLM Wiki Pattern]] d'[[../entities/Andrej Karpathy]] avec [[../entities/Obsidian]]. 1279 stars GitHub, v1.4.3, MIT license. Adopte par Foundation OS (D-WIKI-01, 2026-04-15).

## Key Claims

- 10 skills (wiki, wiki-ingest, wiki-query, wiki-lint, save, autoresearch, canvas, defuddle, obsidian-bases, obsidian-markdown)
- 4 commands (/wiki, /save, /autoresearch, /canvas)
- [[../concepts/Hot Cache]] via `wiki/hot.md` (~500 mots)
- Token cost stable via on-demand page loading (index scan + pages pertinentes only)
- Delta tracking `.raw/.manifest.json` (hash-based, evite re-ingestion)
- Multi-agent bootstrap (Codex, OpenCode, Gemini, Cursor, Windsurf, Copilot)

## Entities Mentioned

- [[../entities/AgriciDaniel]] — auteur du plugin
- [[../entities/Andrej Karpathy]] — createur du pattern implemente
- [[../entities/Obsidian]] — editeur cible

## Concepts Introduced

- [[../concepts/LLM Wiki Pattern]] — pattern central
- [[../concepts/Hot Cache]] — composant cle
- [[../concepts/Compounding Knowledge]] — propriete emergente

## Ecosysteme concurrent

- Ar9av-obsidian-wiki (multi-agent + delta tracking)
- Nexus-claudesidian-mcp (plugin Obsidian natif + MCP bridge)
- ballred-obsidian-claude-pkm (goal cascade + auto-commit)
- rvk7895-llm-knowledge-bases (3-depth query, Marp slides)
- kepano-obsidian-skills (skills officiels createur Obsidian)
- Claudian-YishenTu (plugin Obsidian embedding Claude Code)

## Raw Source

`.raw/articles/agricidaniel-claude-obsidian-2026-04-15.md`

## Notes

Implementation de reference pour Foundation OS. PostToolUse auto-commit **desactive** (D-WIKI-01 : casse regle Kevin-valide, remplace par `scripts/wiki-commit.sh`).
