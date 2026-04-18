---
type: meta
title: "Graph Report — wiki analyse auto"
updated: 2026-04-18
tags:
  - meta
  - graph
  - neuroplasticity
  - auto-generated
status: evergreen
confidence: high
related:
  - "[[index-meta]]"
  - "[[Graph Report]]"
  - "[[foundation-os-map]]"
  - "[[counts]]"
---

# Graph Report — wiki analyse auto

> **Auto-regenere** par `scripts/wiki-graph-report.sh`. Source unique pattern counts.md. Ne pas editer manuellement.
>
> Last run: 2026-04-18 · 44 pages scannees · seuils `scripts/thresholds.json` section `wiki.graph_report`.

## God Nodes

Pages avec >= 10 wikilinks entrants (hubs structurants).

| Page | Inbound | Domaine |
|------|---------|---------|
| `index-wiki` | 19 | meta |
| `index-concepts` | 19 | meta |
| `LLM Wiki Pattern` | 18 | dev |
| `foundation-os-map` | 17 | meta |
| `Compounding Knowledge` | 13 | dev |
| `Foundation OS` | 13 | dev |
| `Hot Cache` | 13 | dev |
| `Obsidian` | 13 | meta |
| `Neuroplasticite` | 11 | dev |
| `Andrej Karpathy` | 10 | meta |
| `index-meta` | 10 | meta |

## Orphelins

Pages avec 0 wikilink entrant (hors roots meta: hot, overview, index-wiki, counts, foundation-os-map). Seuil max : 2.

**1 orphelins** (`OK`)

- `session-patterns` — `wiki/meta/session-patterns.md`

## Surprising Connections (cross-domain)

Wikilinks qui relient des domaines differents (hors meta). Revele insights cross-domain emergents.

| Source | Target | Source domain | Target domain |
|--------|--------|---------------|---------------|
| `Foundation OS` | `Void Glass` | dev | design |
| `index-design` | `index-dev` | design | dev |
| `index-dev` | `index-design` | dev | design |
| `index-finance` | `Compounding Knowledge` | finance | dev |
| `index-finance` | `index-trading` | finance | trading |
| `index-trading` | `Compounding Knowledge` | trading | dev |

## Communities (par tag primaire)

Groupement des pages par premier tag frontmatter (fallback `type:` ou `untagged`).

### `#concept` (15 pages)

- `Brief v12`
- `Compounding Knowledge`
- `Confidence Tagging`
- `Core OS`
- `Foundation OS`
- `Graph Report`
- `Hot Cache`
- `LLM Wiki Pattern`
- `Layered Loading`
- `Neuroplasticite`
- `Pre-compaction Snapshot`
- `TDAH workflow`
- `Void Glass`
- `design-system-components`
- `foundation-os-desktop-migration`

### `#meta` (11 pages)

- `counts`
- `foundation-os-map`
- `hot`
- `index-wiki`
- `lessons-learned`
- `overview`
- `routines-guardrails`
- `routines-setup`
- `session-patterns`
- `sessions-recent`
- `thinking`

### `#index` (6 pages)

- `index-concepts`
- `index-core-os`
- `index-cowork`
- `index-entities`
- `index-meta`
- `index-sources`

### `#domain-index` (5 pages)

- `index-design`
- `index-dev`
- `index-finance`
- `index-sante`
- `index-trading`

### `#entity` (5 pages)

- `AgriciDaniel`
- `Andrej Karpathy`
- `Obsidian`
- `Pinecone`
- `tools-foundation-os`

### `#source` (2 pages)

- `agricidaniel-claude-obsidian`
- `karpathy-llm-wiki-pattern`

---

## Comment regenerer

```bash
bash scripts/wiki-graph-report.sh          # regenere graph-report.md
bash scripts/wiki-graph-report.sh --check  # compare existing vs regen, exit 0/1
bash scripts/wiki-graph-report.sh --quiet  # 1-ligne stats (pour chain health-check)
```
