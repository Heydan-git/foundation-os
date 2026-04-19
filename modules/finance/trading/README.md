# modules/finance/trading/

Backtest engine crypto + Pine Script bridge + 3Commas execution pour Foundation OS.

## Setup

```bash
cd modules/finance/trading
uv sync --all-extras
cp .env.example .env  # puis editer les secrets
```

## Usage (v1)

```bash
uv run trading download-data --source ccxt --symbols BTC/USDT,ETH/USDT --timeframe 1h --start 2021-01-01
uv run trading backtest _examples.ema_cross --period 2022-01:2024-12 --report
uv run trading walk-forward _examples.ema_cross --train 180d --test 60d
uv run trading monte-carlo _examples.ema_cross --runs 1000
uv run trading generate-pine _examples.ema_cross --out strategies/pine/ema_cross.pine
```

## Architecture

Voir [design spec](../../../docs/superpowers/specs/2026-04-18-finance-trading-backtest-engine-design.md).

## Couplage wiki

- Strategies documentees : `wiki/domains/trading/strategies/*.md`
- Backtests archives : `wiki/domains/trading/backtests/*.md`
- Concepts : `wiki/domains/trading/concepts/*.md`

## Honnetete

Un backtest ne garantit pas de gains live. Cet outil minimise les biais courants (look-ahead, overfitting, slippage irrealiste) ; il ne les elimine pas. Trading crypto retail perd en moyenne. Deploiement live reste gate humaine (copy-paste Pine dans TradingView, activation 3Commas manuelle).
