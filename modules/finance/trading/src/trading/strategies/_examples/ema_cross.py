"""Exemple EMA cross : long si ema_fast > ema_slow, flat sinon. Pas pour trader live."""

from __future__ import annotations

from typing import Any

import pandas as pd  # type: ignore[import-untyped]

from trading.strategies.base import BaseStrategy, StrategyMetadata
from trading.strategies.indicators.ema import ema


class EMACrossStrategy(BaseStrategy):
    def __init__(self, ema_fast: int = 10, ema_slow: int = 30) -> None:
        super().__init__(
            StrategyMetadata(
                name=f"ema_cross_{ema_fast}_{ema_slow}",
                horizon="swing",
                instruments=["BTCUSDT.BINANCE"],
                hyperparams={"ema_fast": ema_fast, "ema_slow": ema_slow},
                wiki_ref=f"[[EMA Cross {ema_fast}/{ema_slow}]]",
            ),
        )
        self.ema_fast = ema_fast
        self.ema_slow = ema_slow

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        fast = ema(df["close"], self.ema_fast)
        slow = ema(df["close"], self.ema_slow)
        raw = (fast > slow).astype(int)
        return raw.diff().fillna(0)  # +1 = entry long, -1 = exit, 0 = hold

    def to_pine_context(self) -> dict[str, Any]:
        ctx = super().to_pine_context()
        ctx.update({"ema_fast": self.ema_fast, "ema_slow": self.ema_slow})
        return ctx
