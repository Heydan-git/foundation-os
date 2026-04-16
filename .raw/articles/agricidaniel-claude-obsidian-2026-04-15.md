---
source_url: https://github.com/AgriciDaniel/claude-obsidian
source_type: repo
author: AgriciDaniel
date_published: 2026-04-13
fetched: 2026-04-15
stars: 1279
release_latest: v1.4.3
---

# claude-obsidian (AgriciDaniel)

Plugin Claude Code implementant le pattern Karpathy LLM Wiki avec Obsidian. 1279 stars, release v1.4.3.

Architecture : vault/ (.raw/ sources immutables + wiki/ knowledge LLM-generated + CLAUDE.md instructions).

10 Skills : wiki, wiki-ingest, wiki-query, wiki-lint, save, autoresearch, canvas, defuddle, obsidian-bases, obsidian-markdown.
4 Commands : /wiki, /save, /autoresearch, /canvas.
4 Hooks : SessionStart (cat hot.md), PostCompact (re-read), PostToolUse (auto-commit), Stop (update hot.md).
5 Templates : concept, source, entity, comparison, question.

Hot cache wiki/hot.md (~500 mots) lu en premier a chaque session. Index wiki/index.md (1 ligne par page) pour navigation rapide. Token cost stable meme avec 1000+ pages car seules pages pertinentes chargees.

Install : claude plugin marketplace add AgriciDaniel/claude-obsidian + claude plugin install claude-obsidian@claude-obsidian-marketplace.

Ecosysteme concurrent : Ar9av-obsidian-wiki, Nexus-claudesidian-mcp, ballred-obsidian-claude-pkm, rvk7895-llm-knowledge-bases, kepano-obsidian-skills, Claudian-YishenTu.
