---
type: backtest
title: "Backtest smoke EMA cross 4h BTC (2026-04-19)"
strategy: "[[EMA Cross 4h BTC]]"
verdict: smoke-only
updated: 2026-04-19
tags: [backtest, smoke, validation-socle]
confidence: low
related:
  - "[[EMA Cross 4h BTC]]"
  - "[[Sharpe Ratio]]"
  - "[[Walk-Forward Analysis]]"
  - "[[index-trading]]"
---

# Backtest smoke EMA cross 4h BTC (2026-04-19)

> [!placeholder] **Objectif : valider que le pipeline fonctionne end-to-end, PAS evaluer la qualite de la strategie.**

## Contexte

Test d'integration run sur fixture synthetique (random walk BTC 2000 bougies 1h) pour verifier que :

- `BacktestRunner` produit un `BacktestResult` non vide
- `WalkForward` genere des windows et un verdict
- `MonteCarlo` genere une distribution
- `PBO` + `DeflatedSharpe` s'executent sans erreur
- `HTMLReport` produit un `index.html` + `metrics.json`
- `PineGenerator` produit un `.pine` v5 valide

## Donnees

- **Source** : fixture synthetique (`np.random.default_rng(42)`, drift 0, sigma 0.01, 2000 bougies 1h) — PAS des donnees reelles.
- **Raison** : evite dependance reseau pour le test CI et rend le resultat deterministe.

## Metriques indicatives

| Metrique | Valeur | Note |
|---|---|---|
| trades | ~40 | depend du seed |
| total_return | variable | non significatif (random walk) |
| sharpe | ~0 +/- bruit | attendu sur random walk |
| max_drawdown | variable | — |
| PBO | N/A | non teste sur une seule strategie |
| DSR | N/A | non teste, single-strategy |

## Verdict global

**smoke** (pas une vraie evaluation).

## Pour une vraie evaluation

1. `uv run trading download-data --symbols BTC/USDT --timeframe 4h --start 2021-01-01`
2. `uv run trading backtest _examples.ema_cross --venue BINANCE --symbol BTCUSDT --timeframe 4h --start 2021-01-01 --end 2026-04-01 --report`
3. `uv run trading walk-forward _examples.ema_cross`
4. `uv run trading monte-carlo _examples.ema_cross --runs 1000`
5. Grid search (ema_fast 5..50, ema_slow 20..200) -> appliquer [[PBO]] + [[Deflated Sharpe]] en post-analyse.

## Rapport HTML (quand genere)

`modules/finance/trading/reports/<timestamp>/index.html` — tearsheet Void Glass avec equity curve + harnesses verdicts + metrics JSON.
