"""RSI Mean-Reversion : long sur cross oversold, exit sur cross overbought.

Pas pour trader live — exemple de validation socle.
Classical mean-reversion : works best in ranging markets, poorly in trends.
"""

from __future__ import annotations

from typing import Any

import pandas as pd  # type: ignore[import-untyped]

from trading.strategies.base import BaseStrategy, StrategyMetadata
from trading.strategies.indicators.rsi import rsi


class RSIMeanReversionStrategy(BaseStrategy):
    def __init__(
        self,
        period: int = 14,
        oversold: float = 30.0,
        overbought: float = 70.0,
    ) -> None:
        if oversold >= overbought:
            raise ValueError(
                f"oversold must be < overbought (got {oversold} >= {overbought})"
            )
        super().__init__(
            StrategyMetadata(
                name=f"rsi_meanrev_{period}_{int(oversold)}_{int(overbought)}",
                horizon="swing",
                instruments=["BTCUSDT.BINANCE"],
                hyperparams={
                    "period": period,
                    "oversold": oversold,
                    "overbought": overbought,
                },
                wiki_ref=f"[[RSI Mean-Reversion {period}/{int(oversold)}/{int(overbought)}]]",
            ),
        )
        self.period = period
        self.oversold = oversold
        self.overbought = overbought

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        """+1 on cross below oversold, -1 on cross above overbought, 0 otherwise.

        Cross detection : RSI at t-1 >= threshold AND RSI at t < threshold (downward cross),
        or symmetric for upward cross. Uses prior bar value to avoid look-ahead.
        """
        rsi_series = rsi(df["close"], period=self.period)
        rsi_prev = rsi_series.shift(1)

        long_entry = (rsi_prev >= self.oversold) & (rsi_series < self.oversold)
        long_exit = (rsi_prev <= self.overbought) & (rsi_series > self.overbought)

        signals = pd.Series(0, index=df.index, dtype=int)
        signals[long_entry] = 1
        signals[long_exit] = -1
        return signals

    def to_pine_context(self) -> dict[str, Any]:
        ctx = super().to_pine_context()
        ctx.update(
            {
                "period": self.period,
                "oversold": self.oversold,
                "overbought": self.overbought,
            }
        )
        return ctx
