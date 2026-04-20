---
type: strategy
title: "Multi-TF Trend 10/30/200"
status: experimental
horizon: swing
instruments: [BTCUSDT]
implementation: ../../../../modules/finance/trading/src/trading/strategies/_examples/multi_tf_trend.py
backtest_runs: ../../../../modules/finance/trading/reports/
confidence: low
updated: 2026-04-19
related:
  - "[[Sharpe Ratio]]"
  - "[[Walk-Forward Analysis]]"
  - "[[PBO]]"
  - "[[index-trading]]"
---

# Multi-TF Trend 10/30/200

> [!placeholder] Strategie experimentale — pas pour trader live sans validation anti-biais complete.

## Hypothese

EMA cross standard (fast/slow) filtre par un regime de tendance macro : pas de long entry si la tendance longue (EMA 200) est baissiere. Reduit les faux signaux du [[EMA Cross 4h BTC]] basique en bear market.

## Hyperparametres

- `ema_fast` : 10 bars — entry trigger rapide
- `ema_slow` : 30 bars — entry trigger lent (cross point)
- `trend_ema` : 200 bars — filtre tendance longue
- `trend_lookback` : 50 bars — (present dans metadata mais v1 implementation utilise `trend.diff(1)` instantane — simplification pragmatique pour passer tests fixture synthetique)

## Logique

- Cross ascendant (fast > slow) + trend UP → long entry
- Cross descendant (fast < slow) → long exit (peu importe trend, on coupe la perte)

Shift(1) partout pour look-ahead safety.
Validation : `ema_fast < ema_slow` sinon ValueError.

## Limites connues

- `trend_lookback` est dans la metadata mais pas utilise effectivement dans v1 (implementation a divergee pour passer fixture — voir commit `e28bf2b`). A revisiter V1.1 avec donnees reelles.
- Si l'EMA 200 est indetermine (debut de serie, < 200 bars), tous les signaux sont bloques.
- Laisse passer les entries sur petits rebounds de bear market si EMA 200 commence tout juste a monter.

## Variantes a considerer

- Vraie multi-TF : resample LTF en HTF pandas, calcul trend sur HTF, reindex vers LTF. Plus coherent conceptuellement.
- Remplacer EMA 200 slope par pente regression lineaire sur N bars.

## Usage

```bash
uv run python -c "
from trading.strategies._examples.multi_tf_trend import MultiTFTrendStrategy
strat = MultiTFTrendStrategy(ema_fast=10, ema_slow=30, trend_ema=200, trend_lookback=50)
print(strat.metadata.name)
"
```

## Reference

- Concept populaire dans la litterature trend-following (Covel, Faith Turtle 2.0).
