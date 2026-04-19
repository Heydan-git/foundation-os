---
type: concept
title: "Walk-Forward Analysis"
updated: 2026-04-19
tags: [trading, anti-bias, validation, time-series]
status: evergreen
confidence: high
related:
  - "[[Purged CV]]"
  - "[[PBO]]"
  - "[[Sharpe Ratio]]"
  - "[[index-trading]]"
---

# Walk-Forward Analysis

Validation en rolling train/test : on entraine sur une periode T1, on teste sur T2 (immediatement apres, jamais melange), on avance, on re-entraine, on re-teste. Reflete les contraintes live : un trader ne voit pas le futur.

## Intuition

Decoupe historique en fenetres successives :
- `train_bars` = 500 bougies pour apprendre les parametres
- `embargo_bars` = 24 bougies "mur" entre train et test (anti-leakage)
- `test_bars` = 200 bougies pour evaluer out-of-sample
- On avance le curseur de `test_bars` et on recommence

## Metrique cle

Ratio `OOS Sharpe / IS Sharpe` :
- > 0.5 : strategie robuste -> `PASS`
- 0.2 - 0.5 : stable mais fragile -> `WARN`
- < 0.2 : overfitting probable -> `FAIL`

## Pourquoi c'est crucial en crypto

Les regimes crypto changent rapidement (bull/bear/chop). Une strategie optimisee sur 2021 qui casse en 2022 est un classic. Walk-forward revele ces fragilites.

## Reference

Pardo, Robert (2008), *The Evaluation and Optimization of Trading Strategies*.

## Implementation Foundation OS

`modules/finance/trading/src/trading/backtest/harnesses/walk_forward.py` (classe `WalkForward`).
