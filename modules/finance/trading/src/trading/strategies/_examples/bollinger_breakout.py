"""Bollinger Volatility Breakout : long sur breakout bande superieure, exit sur retour median.

Capture les expansions de volatilite. Complementaire a RSI mean-reversion (qui trade le squeeze).
Pas pour trader live — exemple de validation socle.
"""

from __future__ import annotations

from typing import Any

import pandas as pd  # type: ignore[import-untyped]

from trading.strategies.base import BaseStrategy, StrategyMetadata


class BollingerBreakoutStrategy(BaseStrategy):
    def __init__(self, period: int = 20, num_std: float = 2.0) -> None:
        if num_std <= 0:
            raise ValueError(f"num_std must be > 0 (got {num_std})")
        super().__init__(
            StrategyMetadata(
                name=f"bollinger_breakout_{period}_{int(num_std)}",
                horizon="swing",
                instruments=["BTCUSDT.BINANCE"],
                hyperparams={"period": period, "num_std": num_std},
                wiki_ref=f"[[Bollinger Breakout {period}/{num_std}]]",
            ),
        )
        self.period = period
        self.num_std = num_std

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        """+1 on close crossing above upper band, -1 on close crossing below middle band."""
        close = df["close"]
        # Use prior-bar rolling stats to avoid look-ahead
        sma_prior = close.shift(1).rolling(self.period).mean()
        std_prior = close.shift(1).rolling(self.period).std(ddof=0)

        upper_prior = sma_prior + self.num_std * std_prior
        middle_prior = sma_prior

        # Cross detection : close at t-1 was <= band, close at t > band
        close_prev = close.shift(1)

        cross_up_upper = (close_prev <= upper_prior.shift(1)) & (close > upper_prior)
        cross_down_middle = (close_prev >= middle_prior.shift(1)) & (close < middle_prior)

        signals = pd.Series(0, index=df.index, dtype=int)
        signals[cross_up_upper.fillna(False)] = 1
        signals[cross_down_middle.fillna(False)] = -1
        return signals

    def to_pine_context(self) -> dict[str, Any]:
        ctx = super().to_pine_context()
        ctx.update({"period": self.period, "num_std": self.num_std})
        return ctx
