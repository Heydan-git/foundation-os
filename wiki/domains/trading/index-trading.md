---
type: domain-index
title: "trading"
updated: 2026-04-15
tags:
  - domain-index
  - trading
status: evergreen
related:
  - "[[index-wiki]]"
---

# Domaine : trading

Knowledge layer pour module `modules/trading/` (Phase 5) : backtest engine, strategies automatisees, market microstructure, regulations, instruments.

## Sous-dossiers

- `concepts/` — Sharpe ratio, Kelly criterion, momentum, mean-reversion, market making, arbitrage, etc.
- `sources/` — whitepapers academic (Jegadeesh & Titman, Asness, Lo, Fama-French, etc.), articles recherche, transcripts
- `strategies/` — doc des strategies (hypotheses, refs, perf attendue) ; code dans `modules/trading/strategies/`
- `backtests/` — rapports synthetiques backtests (Sharpe, max DD, win rate) ; raw data dans `modules/trading/backtests/`
- `instruments/` — BTCUSD, ES, gold, EURUSD, etc. (specs, horaires, frais)

## Couplage code

Chaque strategie wiki pointe son code :

```yaml
---
type: strategy
implementation: ../../../../modules/trading/strategies/momentum.ts
backtest_runs: ../../../../modules/trading/backtests/
---
```

## Pages recentes

Aucune pour l'instant (Phase 5 non demarree).

## Cross-references cles

- [[index-wiki|Concepts cross-domain]] (Sharpe, Kelly, etc. partages)
- [[index-wiki|Entities cross-domain]] (outils, brokers, researchers)

## Workflows specifiques

- Ingest whitepaper PDF → `.raw/trading/` → `wiki-ingest` → pages concepts + sources + entities crees
- Backtest reussi → `/save` rapport synthese → `wiki/domains/trading/backtests/<date>-<strat>.md`
- Skills custom futurs : `wiki-trading-strategy-doc`, `wiki-trading-backtest-report` (~2h chacun, Phase 5)
