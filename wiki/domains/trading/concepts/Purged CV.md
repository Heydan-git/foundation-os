---
type: concept
title: "Purged Cross-Validation"
updated: 2026-04-19
tags: [trading, anti-bias, validation, k-fold]
status: evergreen
confidence: high
related:
  - "[[Walk-Forward Analysis]]"
  - "[[PBO]]"
  - "[[index-trading]]"
---

# Purged Cross-Validation

K-fold cross-validation adapte aux series temporelles : entre chaque fold train/test, un "embargo" retire les bougies voisines pour eviter le data leakage.

## Probleme du K-fold naif sur time-series

En ML classique, K-fold melange les lignes. Sur time-series, melanger viole la causalite — une bougie d'aujourd'hui peut "lire" des indicateurs calcules sur des donnees futures si on ne purge pas.

## Solution

Pour chaque fold :
1. Prendre `fold_size = n / k` bougies contigues en test.
2. Exclure `embargo` bougies AVANT et APRES le test.
3. Concatener tout le reste en train.

## Parametres Foundation OS

- `k = 5` folds
- `embargo_pct = 0.01` (1% du dataset par cote)

## Verdict

- `PASS` si mean fold return > 0 et stdev contenue
- `WARN` sinon (instabilite cross-fold)

## Reference

Lopez de Prado, M. (2018), *Advances in Financial Machine Learning*, ch. 7.

## Implementation Foundation OS

`modules/finance/trading/src/trading/backtest/harnesses/purged_cv.py` (classe `PurgedCV`).
