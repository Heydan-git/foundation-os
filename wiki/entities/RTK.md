---
type: entity
title: "RTK (Rust Token Killer)"
entity_type: product
aliases:
  - "Rust Token Killer"
  - "rtk"
url: "https://www.rtk-ai.app"
github: "https://github.com/rtk-ai/rtk"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - cli
  - rust
  - llm-optimization
  - token-reduction
  - claude-code-compatible
  - devtool
status: mature
confidence: high
related:
  - "[[index-entities]]"
  - "[[rtk-ai-token-killer]]"
  - "[[Claude Code]]"
  - "[[Claude Code Configuration Pattern]]"
  - "[[Cockpit OS Dashboard]]"
  - "[[Foundation OS]]"
  - "[[Hot Cache]]"
  - "[[Layered Loading]]"
sources:
  - "[[rtk-ai-token-killer]]"
---

# RTK (Rust Token Killer)

## What

**CLI proxy Rust single-binary** qui reduit la consommation de tokens LLM de **60-90%** en filtrant/groupant/tronquant/dedupliquant l'output des commandes CLI **avant** qu'elles n'atteignent le contexte LLM.

100+ commandes supportees (git, gh, ls, tree, find, grep, docker, kubectl, npm, cargo, jest, pytest, etc.). Integration native Claude Code via PreToolUse hook bash transparent.

## Why It Matters

**Pour Foundation OS** : FOS utilise Claude Code intensivement avec beaucoup de scripts bash (health-check, wiki-health, ref-checker, build, tests). RTK pourrait reduire de 50-70% les tokens consommes par ces scripts → **plus de context utile** + **focus ameliore**.

**Pour l'ecosysteme general** : premier outil mature dedie a l'optimisation tokens au niveau **output CLI** (complementaire a hot cache / layered loading / pre-compaction qui attaquent d'autres niveaux).

## Key Facts

- **Version actuelle** : v0.37.1 (18 avril 2026)
- **License** : Apache 2.0 (MIT dual mentionne)
- **Stars GitHub** : 29.6k
- **Forks** : 1.7k
- **Releases** : 123
- **Langage** : Rust (92.1%) + Bash (5.8%) + TypeScript (1.8%)
- **Overhead** : <10ms par commande
- **Install** : `brew install rtk` (recommande) ou cargo/curl/binaires pre-built
- **Plateformes** : macOS Intel/ARM, Linux x86/ARM, Windows (WSL recommande)
- **Zero runtime dependency** (binary statique)
- **Telemetry** : opt-in GDPR-compliant, disabled par defaut

## Team

- **Patrick Szymkowiak** (Founder) — GitHub: pszymkowiak
- **Florian Bruniaux** (Core contributor) — GitHub: FlorianBruniaux
- **Adrien Eppling** (Core contributor) — GitHub: aeppling

## 4 Strategies Filtering

1. **Smart Filtering** : retire noise (comments, whitespace, boilerplate)
2. **Grouping** : agrege items similaires (files/directory, errors/type)
3. **Truncation** : preserve relevant context, elimine redondance
4. **Deduplication** : collapse repeated log lines avec counts

## AI Tools supportes (12)

- **Claude Code** (PreToolUse hook natif)
- GitHub Copilot (VS Code + CLI)
- Cursor
- Gemini CLI
- Codex (OpenAI)
- Windsurf
- Cline / Roo Code
- OpenCode
- OpenClaw
- Kilo Code
- Google Antigravity
- Mistral Vibe (planned)

## Meta-commands

- `rtk gain` : analytics token savings avec graphs
- `rtk discover` : identifie opportunites manquees
- `rtk session` : tracking adoption RTK
- `rtk proxy` : raw passthrough avec tracking
- `rtk err` / `rtk test` : error/failure filtering

## Integration Claude Code

### Methodes
- **Auto-rewrite Hook** : bash hook PreToolUse intercepte commandes, rewrite en equivalent rtk avant exec
- **CLAUDE.md Injection** : fallback pour environnements sans bash (Windows native)
- **Tee Mode** : save full unfiltered output on failure (pour LLM review sans re-exec)

### Config files
- `~/.config/rtk/config.toml` (Linux)
- `~/Library/Application Support/rtk/config.toml` (macOS)
- Per-command exclusions
- Environment variable overrides

## Exemples reduction concrete

| Commande | Standard tokens | RTK tokens | Reduction |
|---|---|---|---|
| `ls .` | ~800 | ~150 | **81%** |
| `git push` | ~200 | ~10 | **95%** |
| `cargo test` | variable | compresse | 50-80% |
| `git diff` | variable | condense | 60-80% |
| `read file.rs -l aggressive` | full code | signature-only | 70-90% |

## Connections

- [[rtk-ai-token-killer]] — source wiki detaillee (analyse complete)
- [[Claude Code]] — integration principale via PreToolUse hook
- [[Claude Code Configuration Pattern]] — pattern de config CC sur lequel RTK se branche
- [[Foundation OS]] — adoption potentielle pour scripts bash intensifs FOS
- [[Hot Cache]] / [[Layered Loading]] / [[Pre-compaction Snapshot]] — mecanismes FOS complementaires (niveaux differents d'optimisation tokens)

## FOS adoption status

**Status** : **pending test** (2026-04-19). Pas encore installe.

**Verdict preliminaire** : go favorable apres test rapide (~30min). Voir [[rtk-ai-token-killer]] section "Foundation OS Analysis" pour plan detaille.

**Blocker potentiel** : conflit d'ordre avec `bash-firewall.sh` livre aujourd'hui (D-CCCONFIG-01). Resolution : bash-firewall en premier (security), RTK ensuite (compression).

## External Refs

- Site : https://www.rtk-ai.app
- Guide : https://www.rtk-ai.app/guide
- GitHub : https://github.com/rtk-ai/rtk
- Install : https://www.rtk-ai.app/guide/getting-started/
- Architecture : https://github.com/rtk-ai/rtk/blob/master/ARCHITECTURE.md
