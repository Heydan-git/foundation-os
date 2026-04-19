---
type: strategy
title: "RSI Mean-Reversion 14/30/70"
status: experimental
horizon: swing
instruments: [BTCUSDT]
implementation: ../../../../modules/finance/trading/src/trading/strategies/_examples/rsi_mean_reversion.py
backtest_runs: ../../../../modules/finance/trading/reports/
confidence: low
updated: 2026-04-19
related:
  - "[[Sharpe Ratio]]"
  - "[[Walk-Forward Analysis]]"
  - "[[PBO]]"
  - "[[index-trading]]"
---

# RSI Mean-Reversion 14/30/70

> [!placeholder] Strategie experimentale — pas pour trader live sans validation anti-biais complete.

## Hypothese

Mean-reversion classique : un actif survendu (RSI < 30) rebondit statistiquement, un actif sur-achete (RSI > 70) corrige. Marche en ranging market, sous-performe en trend fort.

## Hyperparametres

- `period` : 14 bars (defaut RSI classique)
- `oversold` : 30.0 — seuil entry
- `overbought` : 70.0 — seuil exit

## Logique

- Long entry : `RSI(t-1) >= oversold AND RSI(t) < oversold` (cross descendant franchit le seuil)
- Long exit : `RSI(t-1) <= overbought AND RSI(t) > overbought` (cross ascendant)
- `shift(1)` pour cross detection look-ahead-safe.

Validation : `oversold < overbought` sinon ValueError au init.

## Limites connues

- Degrade fortement en trend market (RSI reste en zone < 30 ou > 70 longtemps).
- Pas de filtre trend (un RSI Mean-Reversion sur un downtrend fort = buy-the-dip pernicieux).
- Peut rester sans signal semaines entieres en faible volatilite.

## Usage

```bash
cd modules/finance/trading
# Via Python REPL pour v1 :
uv run python -c "
from trading.strategies._examples.rsi_mean_reversion import RSIMeanReversionStrategy
strat = RSIMeanReversionStrategy(period=14, oversold=30, overbought=70)
print(strat.metadata.name)
"
```

## Variantes a considerer

- Combiner avec [[Multi-TF Trend 10/30/200]] comme filtre (seulement long si HTF trend up) → ameliore perf en regime mixte.
- Widenir les seuils (20/80) pour signaux plus rares mais plus forts.

## Reference

- J. Welles Wilder (1978), *New Concepts in Technical Trading Systems* — invention du RSI.
