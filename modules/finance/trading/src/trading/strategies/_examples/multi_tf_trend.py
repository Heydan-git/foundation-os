"""Multi-Timeframe Trend Following : EMA cross filtered by long-term trend slope.

Long entry : ema_fast crosses above ema_slow AND long-term EMA slope is positive.
Long exit : ema_fast crosses below ema_slow (regardless of trend, to cut losses).

Evite les faux signaux de ema_cross en bear market.
Pas pour trader live — exemple de validation socle.
"""

from __future__ import annotations

from typing import Any

import pandas as pd  # type: ignore[import-untyped]

from trading.strategies.base import BaseStrategy, StrategyMetadata
from trading.strategies.indicators.ema import ema


class MultiTFTrendStrategy(BaseStrategy):
    def __init__(
        self,
        ema_fast: int = 10,
        ema_slow: int = 30,
        trend_ema: int = 200,
        trend_lookback: int = 50,
    ) -> None:
        if ema_fast >= ema_slow:
            raise ValueError(
                f"ema_fast must be < ema_slow (got {ema_fast} >= {ema_slow})"
            )
        super().__init__(
            StrategyMetadata(
                name=f"multi_tf_trend_{ema_fast}_{ema_slow}_{trend_ema}_{trend_lookback}",
                horizon="swing",
                instruments=["BTCUSDT.BINANCE"],
                hyperparams={
                    "ema_fast": ema_fast,
                    "ema_slow": ema_slow,
                    "trend_ema": trend_ema,
                    "trend_lookback": trend_lookback,
                },
                wiki_ref=f"[[Multi-TF Trend {ema_fast}/{ema_slow}/{trend_ema}]]",
            ),
        )
        self.ema_fast = ema_fast
        self.ema_slow = ema_slow
        self.trend_ema = trend_ema
        self.trend_lookback = trend_lookback

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        """+1 on fast>slow cross with uptrend filter, -1 on fast<slow cross (no filter)."""
        close = df["close"]
        ema_f = ema(close, self.ema_fast)
        ema_s = ema(close, self.ema_slow)
        trend = ema(close, self.trend_ema)

        # Trend slope : single-step diff on EMA gives direction without NaN warmup gap
        trend_slope = trend.diff(1)
        trend_up = trend_slope > 0

        # Cross detection (shift 1 for look-ahead safety)
        fast_prev = ema_f.shift(1)
        slow_prev = ema_s.shift(1)
        cross_up = (fast_prev <= slow_prev) & (ema_f > ema_s)
        cross_down = (fast_prev >= slow_prev) & (ema_f < ema_s)

        long_entry = cross_up & trend_up
        long_exit = cross_down

        signals = pd.Series(0, index=df.index, dtype=int)
        signals[long_entry] = 1
        signals[long_exit] = -1
        return signals

    def to_pine_context(self) -> dict[str, Any]:
        ctx = super().to_pine_context()
        ctx.update(
            {
                "ema_fast": self.ema_fast,
                "ema_slow": self.ema_slow,
                "trend_ema": self.trend_ema,
                "trend_lookback": self.trend_lookback,
            }
        )
        return ctx
