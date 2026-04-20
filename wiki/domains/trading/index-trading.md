---
type: domain-index
title: "trading"
updated: 2026-04-19
tags:
  - domain-index
  - trading
  - meta
status: evergreen
confidence: medium
related:
  - "[[index-wiki]]"
  - "[[Compounding Knowledge]]"
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

## Strategies v1 (experimentales)

> Toutes les strategies sont `status: experimental` — validation anti-biais complete requise avant trading live. Voir [[Walk-Forward Analysis]] + [[PBO]] + [[Deflated Sharpe]].

| Strategie | Famille | Logique courte |
|---|---|---|
| [[EMA Cross 4h BTC]] | trend-following | Fast EMA > slow EMA → long, inverse → exit |
| [[Donchian Breakout 20/10]] | momentum / breakout | Close casse high 20 bars → long ; casse low 10 bars → exit |
| [[RSI Mean-Reversion 14/30/70]] | mean-reversion | RSI cross < 30 → long ; cross > 70 → exit |
| [[Multi-TF Trend 10/30/200]] | trend-following filtre | EMA cross + filtre trend EMA 200 |
| [[Bollinger Breakout 20/2]] | momentum / volatility | Close > upper band → long ; retour sous middle → exit |

Implementation : `modules/finance/trading/src/trading/strategies/_examples/*.py` — classes heritant de `BaseStrategy`, toutes testees TDD (72/72 tests).

## Backtest d'une strategie

```bash
cd modules/finance/trading
uv run trading download-data --symbols BTC/USDT --timeframe 4h --start 2021-01-01
# V1 : seul ema_cross est branche dans le CLI backtest. Autres strategies via Python REPL.
uv run trading backtest _examples.ema_cross --venue BINANCE --symbol BTCUSDT --timeframe 4h
uv run trading walk-forward _examples.ema_cross
uv run trading monte-carlo _examples.ema_cross --runs 1000
```

## Cross-references cles

- [[index-wiki|Concepts cross-domain]] (Sharpe, Kelly, etc. partages)
- [[index-wiki|Entities cross-domain]] (outils, brokers, researchers)
- [[Compounding Knowledge]] — le compounding s'applique aux backtests et strategies

## Workflows specifiques

- Ingest whitepaper PDF → `.raw/trading/` → `wiki-ingest` → pages concepts + sources + entities crees
- Backtest reussi → `/save` rapport synthese → `wiki/domains/trading/backtests/<date>-<strat>.md`
- Skills custom futurs : `wiki-trading-strategy-doc`, `wiki-trading-backtest-report` (~2h chacun, Phase 5)
