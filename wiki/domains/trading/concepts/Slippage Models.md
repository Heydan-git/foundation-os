---
type: concept
title: "Slippage Models"
updated: 2026-04-19
tags: [trading, backtest, execution, realism]
status: evergreen
confidence: high
related:
  - "[[Walk-Forward Analysis]]"
  - "[[index-trading]]"
---

# Slippage Models

Le slippage = difference entre le prix attendu et le prix execute reel (defavorable). Modeliser le slippage correctement est une des differences entre un backtest "propre" et un "illusoire".

## Modeles courants

### Flat (naif)

```
slippage_bps = constant
```

Facile mais faux : le slippage reel augmente avec la volatilite et la taille d'ordre.

### Volatility-based (Foundation OS default)

```
slippage_bps = base + atr_multiplier * atr_ratio + size_impact * (order / avg_volume)
```

- `base_bps = 2.0` (minimum market impact)
- `atr_multiplier = 50.0` (volatilite x 50 en bps)
- `size_impact = 100.0` (penalite liquidite)

### Orderbook-based (plus precis, paye)

Simule le fill en consommant les niveaux du L2 orderbook. Requiert data tick historique (tardis.dev ~200-500$/mois). Overkill pour v1.

## Pourquoi c'est critique

Un backtest avec slippage flat 5 bps peut etre surestime de 30 a 50% vs reel sur strategies intraday. Sur swing/position (Foundation OS v1), l'ecart est moindre mais existe.

## Reference

Almgren, R., Chriss, N. (2001), "Optimal Execution of Portfolio Transactions".

## Implementation Foundation OS

`modules/finance/trading/src/trading/backtest/slippage.py` (classe `VolatilityBasedSlippage`, utilisee par `BacktestRunner`).
