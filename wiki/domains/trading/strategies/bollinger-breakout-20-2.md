---
type: strategy
title: "Bollinger Breakout 20/2"
status: experimental
horizon: swing
instruments: [BTCUSDT]
implementation: ../../../../modules/finance/trading/src/trading/strategies/_examples/bollinger_breakout.py
backtest_runs: ../../../../modules/finance/trading/reports/
confidence: low
updated: 2026-04-19
related:
  - "[[Sharpe Ratio]]"
  - "[[Walk-Forward Analysis]]"
  - "[[PBO]]"
  - "[[Slippage Models]]"
  - "[[index-trading]]"
---

# Bollinger Breakout 20/2

> [!placeholder] Strategie experimentale — pas pour trader live sans validation anti-biais complete.

## Hypothese

Bollinger Bands capturent les regimes de volatilite. Un breakout au-dessus de la bande superieure = expansion de volatilite + momentum = signal d'entree. Le retour sous le median (SMA) apres le breakout indique un essoufflement = exit.

Complementaire au [[RSI Mean-Reversion 14/30/70]] qui lui trade le squeeze (contraction de volatilite).

## Hyperparametres

- `period` : 20 bars (SMA + stdev window) — standard Bollinger
- `num_std` : 2.0 stdev (bande upper/lower) — standard Bollinger

## Logique

- Middle band : rolling SMA du close sur `period` bars (shift 1)
- Upper band : middle + `num_std` * rolling stdev
- Long entry : close(t-1) <= upper(t-1) AND close(t) > upper(t) (cross ascendant)
- Long exit : close(t-1) >= middle(t-1) AND close(t) < middle(t) (retour vers mean)

Shift(1) partout pour look-ahead safety.
Validation : `num_std > 0` sinon ValueError.

## Limites connues

- Faux breakouts frequents en regime choppy.
- Pas de stop-loss hard : si le breakout echoue brusquement (rejet de bande), attendre le retour au median peut couter cher.
- Sensible aux spikes (une bougie qui casse upper momentanement declenche entry).

## Variantes a considerer

- Ajouter filtre volume (breakout + volume > moyenne).
- Combiner avec ATR stop-loss (V1.2).
- "Squeeze Bollinger" : trader la contraction (low volatility) → breakout imminent.

## Usage

```bash
uv run python -c "
from trading.strategies._examples.bollinger_breakout import BollingerBreakoutStrategy
strat = BollingerBreakoutStrategy(period=20, num_std=2.0)
print(strat.metadata.name)
"
```

## Reference

- John Bollinger (1980s) — invention des Bollinger Bands.
- Connors, L. (2009), *Short Term Trading Strategies That Work* — variantes mean-reversion et breakout.
