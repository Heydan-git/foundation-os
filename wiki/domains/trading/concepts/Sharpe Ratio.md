---
type: concept
title: "Sharpe Ratio"
updated: 2026-04-19
tags: [trading, metrics, risk-adjusted-return]
status: evergreen
confidence: high
related:
  - "[[Deflated Sharpe]]"
  - "[[Walk-Forward Analysis]]"
  - "[[index-trading]]"
---

# Sharpe Ratio

Metrique risk-adjusted return proposee par William Sharpe (1966). Mesure le rendement excedentaire par unite de risque (volatilite).

## Formule

```
SR = (mean(returns) - risk_free) / stdev(returns)
```

Annualisation (bougies 1h) : `SR * sqrt(365 * 24)`.

En crypto : on considere souvent `risk_free = 0` (pas d'equivalent stable du 3-mois T-bill).

## Interpretation (crypto retail)

- SR > 2 : excellent (rare, souvent trop beau pour etre vrai)
- SR 1 - 2 : bon
- SR 0.5 - 1 : acceptable
- SR < 0.5 : douteux
- SR < 0 : perdant

Attention : un Sharpe eleve en backtest sans validation anti-biais est presque toujours illusoire. Voir [[Deflated Sharpe]] pour correction multi-trials.

## Limites

- Penalise la volatilite a la hausse autant qu'a la baisse (asymetrique : voir Sortino).
- Suppose des returns gaussiens (faux en crypto : fat tails).
- Fragile avec peu de trades (< 30).

## Implementation Foundation OS

`modules/finance/trading/src/trading/analysis/metrics.py` (`PerformanceMetrics.compute().sharpe`).
