---
type: strategy
title: "EMA Cross 4h BTC"
status: experimental
horizon: swing
instruments: [BTCUSDT]
implementation: ../../../../modules/finance/trading/src/trading/strategies/_examples/ema_cross.py
backtest_runs: ../../../../modules/finance/trading/reports/
pine_source: ../../../../modules/finance/trading/strategies/pine/ema_cross.pine
confidence: low
updated: 2026-04-19
related:
  - "[[Sharpe Ratio]]"
  - "[[Walk-Forward Analysis]]"
  - "[[PBO]]"
  - "[[Slippage Models]]"
  - "[[index-trading]]"
---

# EMA Cross 4h BTC (exemple validation socle)

> [!placeholder] Strategie de validation du socle technique. PAS pour trader live. Sert a prouver que la chaine data -> backtest -> harnesses -> report -> Pine genere fonctionne end-to-end.

## Hypothese

Moyenne mobile rapide > moyenne mobile lente = tendance haussiere courte-terme. Entry long sur cross haussier, exit sur cross baissier.

## Hyperparametres

- `ema_fast` : 10 bougies 4h (defaut)
- `ema_slow` : 30 bougies 4h (defaut)

## Resultats backtest exemple

Voir [[2026-04-19-ema-cross-btc-smoke]].

## Limites connues (honnetete)

- Strategie "follow-the-trend" classique, edge probablement inexistant sur BTC post-2022 (regime plus choppy).
- Pas de stop-loss explicite (gere par cross inverse).
- Pas de position sizing (100% equity par entry).
- Overfitting facile sur ema_fast / ema_slow si on grid-search sans [[Deflated Sharpe]] + [[PBO]].

## Generation Pine Script

```bash
cd modules/finance/trading
uv run trading generate-pine _examples.ema_cross --ema-fast 10 --ema-slow 30 --out strategies/pine/ema_cross.pine
```

Puis coller le fichier `.pine` dans TradingView Pine Editor et attacher au chart BTCUSDT 4h.

## Backtest reproductible

```bash
uv run trading download-data --symbols BTC/USDT --timeframe 4h --start 2021-01-01
uv run trading backtest _examples.ema_cross --venue BINANCE --symbol BTCUSDT --timeframe 4h --start 2021-01-01 --end 2026-04-01
uv run trading walk-forward _examples.ema_cross --train-bars 500 --test-bars 200
uv run trading monte-carlo _examples.ema_cross --runs 1000
```
