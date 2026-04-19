---
type: strategy
title: "Donchian Breakout 20/10"
status: experimental
horizon: swing
instruments: [BTCUSDT]
implementation: ../../../../modules/finance/trading/src/trading/strategies/_examples/donchian_breakout.py
backtest_runs: ../../../../modules/finance/trading/reports/
confidence: low
updated: 2026-04-19
related:
  - "[[Sharpe Ratio]]"
  - "[[Walk-Forward Analysis]]"
  - "[[PBO]]"
  - "[[index-trading]]"
---

# Donchian Breakout 20/10

> [!placeholder] Strategie experimentale — pas pour trader live sans validation anti-biais complete (walk-forward + PBO + DSR).

## Hypothese

Classic Turtle Traders logic. Breakout au-dessus du plus haut des N derniers bars = signal de demarrage d'un nouveau trend. Exit en cassant le plus bas des M derniers bars = retour en range, on coupe.

## Hyperparametres

- `entry_window` : 20 bars (defaut) — breakout high
- `exit_window` : 10 bars (defaut) — breakdown low

## Logique

- Long entry : `close > highest(high, 20 prior bars)`
- Long exit : `close < lowest(low, 10 prior bars)`
- `shift(1)` applique sur rolling pour eviter look-ahead.

Precedence : si entry et exit firent le meme bar, exit gagne (conforme Turtle).

## Limites connues

- Sous-performe en marche range (whipsaws).
- Exit plus court que entry = sortie rapide en cas de pullback, peut sortir tot.
- Pas de stop-loss explicite (le cross exit sert de stop).
- Pas de sizing (100% equity par defaut runner).

## Usage

```bash
cd modules/finance/trading
uv run trading download-data --symbols BTC/USDT --timeframe 4h --start 2021-01-01
# Backtest direct : necessite enregistrement dans strat_map (V1.2 feature)
```

En V1, seul `_examples.ema_cross` est branche dans le CLI `backtest`. Pour tester Donchian : importer via Python REPL ou script.

## Reference

- Turtle Traders rules (Richard Dennis, 1983) — base du pattern Donchian.
