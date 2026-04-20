"""FundingCalculator : cashflow funding sur positions perps ouvertes."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

import pandas as pd  # type: ignore[import-untyped]


@dataclass
class FundingCalculator:
    """Pour un long : cashflow = - position * sum(funding_rates). Invert pour short."""

    def apply(
        self,
        *,
        position_notional: float,
        direction: Literal["long", "short"],
        funding_series: pd.Series,
    ) -> float:
        total_rate = float(funding_series.sum())
        sign = -1 if direction == "long" else 1
        return sign * position_notional * total_rate
