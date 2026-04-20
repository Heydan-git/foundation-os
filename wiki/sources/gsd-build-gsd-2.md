---
type: source
title: "GSD-2 (Get Shit Done 2) — Autonomous coding agent CLI par gsd-build"
source_type: repo
author: "gsd-build (GitHub organization)"
date_published: 2026-04-19
url: "https://github.com/gsd-build/gsd-2"
confidence: high
fos_compat: low
effort_estime: XL (adoption full) / S (ref ADRs)
decision: reference-ne-pas-adopter-lire-ADRs
key_claims:
  - "Evolution GSD v1 (slash commands Claude Code) vers standalone CLI autonomous"
  - "6.1k stars, 632 forks, 3828 commits, 112 releases, v2.76.0 (avril 2026)"
  - "License MIT"
  - "Stack : TypeScript 94.2% + Rust 1.8% + Python + Shell, Node.js >= 22"
  - "Built on Pi SDK (badlogic/pi-mono)"
  - "Distribution : npm `gsd-pi`, SQLite state `gsd.db`"
  - "20+ LLM providers (Anthropic, OpenAI, Google, OpenRouter, Copilot, Bedrock, Azure)"
  - "Hierarchy : Milestone (4-10 slices) -> Slice (1-7 tasks) -> Task (1 context window)"
  - "Features majeures : Auto Mode, Fresh Context Windows per task, State Machine Orchestration on-disk, Git Isolation (worktree per milestone + squash merge), Cost Tracking per unit, Stuck Detection sliding-window, Verification Automation, Parallel Orchestration, Knowledge System semantic+keyword, Progressive Planning (ADR-011), Memory System Phase 1/5, MCP Integration, Remote Control Telegram/Slack/Discord"
  - "24 bundled extensions + 5 specialist subagents (Scout, Researcher, Worker, JavaScript Pro, TypeScript Pro)"
  - "OAuth Claude Max / Copilot compatible"
  - "Support VS Code extension + web Studio UI"
  - "Philosophie : State lives on disk (.gsd/ source of truth)"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - repo
  - cli
  - autonomous-agent
  - orchestration
  - typescript
  - mit
status: mature
related:
  - "[[index-sources]]"
  - "[[Claude Code]]"
  - "[[Foundation OS]]"
  - "[[Core OS]]"
  - "[[MCP]]"
  - "[[Cockpit OS Dashboard]]"
  - "[[AI agent patterns]]"
sources: []
---

# GSD-2 (Get Shit Done 2) — Autonomous coding agent CLI par gsd-build

## Summary

**Standalone CLI tool** transformant un agent AI coding en **systeme autonome capable de gerer des milestones entiers** sans intervention humaine. Evolution de GSD v1 (qui etait un prompt framework dans Claude Code) vers architecture propre.

**6.1k stars, MIT, 3828 commits, v2.76.0 avril 2026**. Maintenu activement. Built on Pi SDK, 20+ LLM providers supportes.

**Paradigme** : `Milestone (4-10 slices) -> Slice (1-7 tasks) -> Task (1 context window)`. Chaque task = context window fresh ~200k tokens avec pre-inlined relevant files. Orchestrator state machine on-disk (`.gsd/`) survive aux crashes.

**Complementaire a Claude Code** (pas remplacement) : runs as standalone CLI, expose MCP server, peut etre invoque depuis Claude Code comme external tool.

## Key Claims

### Stack technique
- TypeScript 94.2% + Rust 1.8% + Python + Shell
- Node.js >= 22
- Built on **Pi SDK** (badlogic/pi-mono)
- SQLite state (`gsd.db`)
- Distribution npm `gsd-pi`

### LLM providers (20+)
Anthropic, OpenAI, Google, OpenRouter, GitHub Copilot, Bedrock, Azure, Ollama, vLLM, LM Studio, proxies.

### Features majeures

| Feature | Description |
|---|---|
| Auto Mode | Execution autonome research -> planning -> execution -> verification -> completion full milestones |
| Fresh Context Windows | Chaque task = context ~200k fresh avec pre-inlined files (pas garbage accumule) |
| State Machine | Disk-based state drive execution, survive crashes via lock files + session forensics |
| Git Isolation | Worktree ou branch-per-milestone + squash-merge cleanup |
| Cost Tracking | Per-unit token ledger + projections + budget ceilings |
| Stuck Detection | Sliding-window pattern matching cross dispatch cycles |
| Verification | Shell commands configurables (lint, test) + auto-fix retries |
| Parallel Orchestration | Multi-worker milestone scheduling + IPC |
| Knowledge System | Cross-session memory semantic + keyword retrieval |
| Progressive Planning (ADR-011) | Sketch-then-refine + compensating rollback |
| Memory System (Phase 1/5) | Capture/query/graph knowledge across sessions |
| MCP Integration | Full workflow tools over MCP |
| Remote Control | Telegram/Slack/Discord command interface |

### Extension ecosystem
- 24 bundled extensions (search, GitHub, browser, MCP client, background shell, async jobs, voice, subagent delegation, Context7, LSP, etc.)
- 5 specialist subagents : Scout, Researcher, Worker, JavaScript Pro, TypeScript Pro

### Installation
```bash
npm install -g gsd-pi@latest
gsd  # launches setup wizard
```

### Modes usage
- **Step Mode** : `/gsd next` pause entre units
- **Auto Mode** : `/gsd auto` autonomous
- **Headless** : `gsd headless [cmd]` CI/cron-friendly JSON output
- **Web Dashboard** : local browser UI

## Entities Mentioned

- **gsd-build** (GitHub org)
- **Pi SDK** (badlogic/pi-mono) — foundation technique
- **[[Claude Code]]** — complementary runtime
- **[[MCP]]** — integration protocol
- Providers : Anthropic, OpenAI, Google, OpenRouter, GitHub Copilot, Bedrock, Azure
- [[RTK]] — mentionne comme optional tool pour shell compression (macOS/Linux/Windows)

## Concepts Introduced

- **Spec-Driven Development** — work decomposed en slices + tasks avec must-haves mechanically verifiable
- **Meta-Prompting** — dispatch prompts built programmatically avec pre-inlined context (no tool reads pendant execution)
- **Context Engineering** (tiered relevance injection) — 65%+ token reduction vs naive inlining
- **Capability-Aware Routing** (ADR-004) — model selection based on task complexity scoring
- **Progressive Planning** (ADR-011) — sketch-then-refine + compensating rollback
- **State-lives-on-disk** philosophy — `.gsd/` = source of truth, pas in-memory
- **Milestone -> Slice -> Task hierarchy** — 3-tier decomposition

## Foundation OS Analysis

### Compat OS

**LOW** pour adoption full. **Duplication majeure avec FOS existant** :

| GSD-2 feature | FOS equivalent |
|---|---|
| Auto Mode autonomous | OMC `autopilot` + `ralph` + `ultrawork` skills |
| Fresh context per task | [[Layered Loading]] + [[Hot Cache]] + [[Pre-compaction Snapshot]] |
| State machine on-disk | `docs/plans/` + `wiki/` + `CONTEXT.md` + `.omc/state/` |
| Git isolation (worktree-per-milestone) | `/wt` command FOS + convention `wt/<desc>-<yymmdd>` |
| Cost tracking | Manuel (no token ledger formel FOS) |
| Stuck detection | Manual via Kevin |
| Verification automation | `scripts/health-check.sh` + git pre-commit hooks |
| Parallel orchestration | Worktrees multiples (N sessions Desktop) + OMC team |
| Knowledge system | [[LLM Wiki Pattern]] + wiki/ 89 pages |
| Progressive planning | `/plan-os` + skills brainstorming/writing-plans/ralplan |
| Memory system | 5 tiers FOS (conversation/CONTEXT.md/auto-memory/docs/wiki) |
| MCP integration | Natif Claude Code FOS |
| Remote control | N/A FOS (Kevin local only) |
| Milestone->Slice->Task | `/plan-os` avec 6 elements par phase |

**Adopter GSD-2 = re-architecturer FOS** pour suivre leur paradigme. XL effort + perte conventions FOS existantes.

### Effort integration (scenarios)

| Scenario | Effort | Realisme |
|---|---|---|
| A. Adoption full (remplacer FOS workflow) | XL (semaines) | ❌ NON — duplication massive |
| B. Fork + customiser pour FOS | XL | ❌ NON — scope trop gros |
| C. Lire ADRs + piquer patterns | S | ✅ Recommande |
| D. Test en parallele (standalone pour projet specifique) | M | ⚠️ Possible mais autre worktree/repo |
| E. Utiliser comme tool external via MCP | M | 🤔 Possible si besoin spec-driven precis |

### Ce qui vaut le coup d'etre lu (ADRs + concepts)

**Patterns interessants a piquer** (pas adopter) :

1. **ADR-004 Capability-Aware Routing** — model selection based on task complexity scoring. FOS route manuel via `/plan-os` (opus/sonnet/haiku). GSD-2 automatise la decision. A etudier.

2. **ADR-011 Progressive Planning** — sketch-then-refine avec compensating rollback. FOS a `/plan-os` 6 elements mais pas mid-execution escalation. **Gap potentiel FOS** a considerer.

3. **Milestone -> Slice -> Task hierarchy** — FOS utilise plan/phase flat. Hierarchie 3-tier pourrait enrichir plans FOS Phase 5 gros (Trading, Sante).

4. **State-lives-on-disk philosophy** — FOS a deja cette approche (docs/plans, wiki, CONTEXT.md) mais pas formalisee explicitement. Concept a documenter.

5. **Cost tracking per-unit ledger** — FOS n'a pas. Complete l'ecosysteme [[RTK]] (compression) + [[Cockpit OS Dashboard]] (observability) avec un **budget ledger** explicite.

6. **Stuck detection sliding-window** — FOS n'a pas. Pourrait aider si Kevin laisse Claude en autopilot.

### Limites Claude declarees

- **N'ai pas clone** GSD-2. Analyse basee sur README + fetch.
- **Pi SDK** non-connu de mon training. Je ne peux pas juger sa qualite/maintenance.
- **Benchmark** vs Claude Code standalone : pas de comparaison empirique publiee.
- **Community** : 6.1k stars mais seuls "23 watchers" = engagement passif potentiel. 632 forks = activite modere mais pas massive.

### Risques / pieges

1. **Adoption = perte investissement FOS** (conventions, workflows, memoires). XL cout.
2. **Pi SDK dependency** : dep sur autre projet tiers (badlogic/pi-mono). Bus factor supplementaire.
3. **Stack TypeScript+Node 22** : compatible FOS mais fichier `gsd.db` SQLite a pos question state layering vs `Supabase` FOS actuel.
4. **Paradigme different** : "agent autonomous for milestones" vs FOS "collaboration Kevin-Claude session". Mismatch philosophique.
5. **Remote Control Telegram/Slack/Discord** : cool mais pas besoin FOS actuel.
6. **112 releases + weekly cadence** : fast-moving = breaking changes risk si adopte.

### Verdict

**Reference : ne pas adopter, lire les ADRs**.

**Actions recommandees** :
1. **Fetcher ADR-004 + ADR-011** dans GSD-2 docs pour analyser les patterns
2. **Cherry-pick 2-3 concepts** pour enrichir FOS (capability-aware routing, progressive planning mid-execution, stuck detection)
3. **Documenter** les gaps FOS identifies (cost ledger, stuck detection) dans backlog
4. **Ne pas** migrate FOS workflow vers GSD-2

**Cas exception** : si Kevin a un side-project AUTRE que FOS (ex: Phase 5 Trading completement separe, standalone repo) ou il veut tester GSD-2 en autonomie, fine. Mais **pas sur FOS principal**.

### Questions ouvertes

- ADR-004 Capability-Aware Routing : algorithm precis ? Applicable a `/plan-os` FOS ?
- ADR-011 Progressive Planning : comment gere rollback mid-execution concretement ?
- Memory System Phase 2-5 (roadmap) : features prevues different de [[LLM Wiki Pattern]] FOS ?
- Pi SDK long-term maintenance ? Dependency risque ?
- Integration MCP : GSD-2 comme client OU serveur MCP ? FOS pourrait beneficier si serveur.

## Raw Source

- Repo : https://github.com/gsd-build/gsd-2
- Docs : mintlify-docs/ + gitbook/ in repo
- VISION.md pour roadmap long-terme
- ADRs dans docs/ADR-*.md

## Notes

**GSD-2 = projet serieux**, mature, bien architecture. Pas un hobby. **Mais pas approprie pour FOS** qui a son propre paradigme cognitif (collaboration Kevin-Claude session-based, pas milestone-autonomous).

**Candidate secondaire** : si Kevin veut experimenter avec autonomous agents full (Phase 5 bot trading 24/7 qui tourne sans lui), GSD-2 pourrait etre un backend interessant **separe de FOS**. Pas integre dans le cerveau OS.

**Stocke comme reference patterns + gaps FOS identifies**. Pas adoption.
