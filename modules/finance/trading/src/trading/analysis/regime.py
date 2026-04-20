"""RegimeClassifier : bull/bear/chop par regles simples (EMA slope + ATR ratio)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

import pandas as pd  # type: ignore[import-untyped]

from trading.strategies.indicators.atr import atr
from trading.strategies.indicators.ema import ema

Regime = Literal["bull", "bear", "chop"]


@dataclass
class RegimeClassifier:
    slope_window: int = 50
    atr_threshold_ratio: float = 0.02

    def classify(self, df: pd.DataFrame) -> pd.Series:
        slow_ema = ema(df["close"], self.slope_window)
        slope = slow_ema.diff(self.slope_window) / slow_ema.shift(self.slope_window)
        atr_ratio = atr(df) / df["close"]

        result = pd.Series(index=df.index, dtype=object)
        result[:] = "chop"
        result[(slope > 0.01) & (atr_ratio < self.atr_threshold_ratio)] = "bull"
        result[(slope < -0.01) & (atr_ratio < self.atr_threshold_ratio)] = "bear"
        return result
