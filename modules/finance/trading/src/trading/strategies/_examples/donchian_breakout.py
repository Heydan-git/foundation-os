"""Donchian Breakout : momentum / trend-following classique (Turtle Traders).

Long entry when close > highest high of N prior bars.
Long exit when close < lowest low of M prior bars.

Pas pour trader live — exemple de validation socle.
"""

from __future__ import annotations

from typing import Any

import pandas as pd  # type: ignore[import-untyped]

from trading.strategies.base import BaseStrategy, StrategyMetadata


class DonchianBreakoutStrategy(BaseStrategy):
    def __init__(self, entry_window: int = 20, exit_window: int = 10) -> None:
        super().__init__(
            StrategyMetadata(
                name=f"donchian_breakout_{entry_window}_{exit_window}",
                horizon="swing",
                instruments=["BTCUSDT.BINANCE"],
                hyperparams={
                    "entry_window": entry_window,
                    "exit_window": exit_window,
                },
                wiki_ref=f"[[Donchian Breakout {entry_window}/{exit_window}]]",
            ),
        )
        self.entry_window = entry_window
        self.exit_window = exit_window

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        """+1 on breakout above entry-window high, -1 on breakdown below exit-window low, 0 otherwise."""
        # Use prior bars (shift 1) to avoid look-ahead
        high_prior = df["high"].shift(1).rolling(self.entry_window).max()
        low_prior = df["low"].shift(1).rolling(self.exit_window).min()

        long_entry = df["close"] > high_prior
        long_exit = df["close"] < low_prior

        signals = pd.Series(0, index=df.index, dtype=int)
        signals[long_entry] = 1
        signals[long_exit] = -1
        return signals

    def to_pine_context(self) -> dict[str, Any]:
        ctx = super().to_pine_context()
        ctx.update(
            {
                "entry_window": self.entry_window,
                "exit_window": self.exit_window,
            }
        )
        return ctx
