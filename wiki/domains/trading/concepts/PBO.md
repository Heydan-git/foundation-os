---
type: concept
title: "Probability of Backtest Overfitting (PBO)"
updated: 2026-04-19
tags: [trading, anti-bias, statistics, validation]
status: evergreen
confidence: high
related:
  - "[[Deflated Sharpe]]"
  - "[[Walk-Forward Analysis]]"
  - "[[Purged CV]]"
  - "[[index-trading]]"
---

# Probability of Backtest Overfitting (PBO)

Metrique proposee par Bailey, Borwein, Lopez de Prado, Zhu (2015) qui estime la probabilite qu'une strategie selectionnee comme "meilleure" en in-sample soit en realite mediocre out-of-sample.

## Intuition

On teste N strategies (ou hyperparams). On split le temps en S blocs (S pair, typiquement 16). Pour chaque combinaison de S/2 blocs en IS et S/2 en OOS, on regarde si la meilleure strategie IS figure dans le top 50% en OOS. Si elle tombe souvent dans le bottom, PBO est eleve = overfitting.

## Formule

```
PBO = P(logit(OOS rank of best IS strategy) < 0)
```

## Seuils Foundation OS

- PBO < 0.15 : sain -> verdict `PASS`
- 0.15 <= PBO < 0.30 : warning -> `WARN`
- PBO >= 0.30 : rejeter strategie -> `FAIL`

## Reference

Bailey, Borwein, Lopez de Prado, Zhu (2015), "The Probability of Backtest Overfitting", *Journal of Computational Finance*.

## Implementation Foundation OS

`modules/finance/trading/src/trading/backtest/harnesses/pbo.py` (classe `PBO`, default `s=16`).
