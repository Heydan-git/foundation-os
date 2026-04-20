---
type: concept
title: "Deflated Sharpe Ratio (DSR)"
updated: 2026-04-19
tags: [trading, anti-bias, statistics, multiple-testing]
status: evergreen
confidence: high
related:
  - "[[Sharpe Ratio]]"
  - "[[PBO]]"
  - "[[index-trading]]"
---

# Deflated Sharpe Ratio (DSR)

Sharpe Ratio corrige pour le fait qu'on a teste N strategies en parallele. Sans cette correction, le "meilleur Sharpe" est biaise vers le haut par chance pure.

## Intuition

Si on backteste 100 strategies aleatoires, la meilleure aura souvent un Sharpe apparent > 1 **par pur hasard**. DSR soustrait cet "Expected Max SR" sous H0 (hypothese nulle = strategies sans edge).

## Formule simplifiee

```
DSR = Phi((SR - E[max SR | N trials]) / sqrt(var))
```

ou Phi = CDF normale. `E[max SR]` depend de `N` (nombre de trials testes) et est donne par la formule Bailey-Lopez.

## Seuils Foundation OS

- DSR > 0.95 : strategie probablement robuste -> `PASS`
- DSR > 0.75 : prudence -> `WARN`
- DSR <= 0.75 : rejetee -> `FAIL`

## Quand l'appliquer

Systematiquement apres un parameter sweep (grid search ema_fast / ema_slow / etc.) ou un screening multi-strategies. Single-strategy backtest = DSR moins critique.

## Reference

Bailey, D. H., Lopez de Prado, M. (2014), "The Deflated Sharpe Ratio: Correcting for Selection Bias, Backtest Overfitting and Non-Normality".

## Implementation Foundation OS

`modules/finance/trading/src/trading/backtest/harnesses/deflated_sharpe.py` (classe `DeflatedSharpe`).
