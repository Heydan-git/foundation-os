"""QualityChecker : detecte gaps temporels, outliers prix/volume, delistings."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

import numpy as np
import pandas as pd  # type: ignore[import-untyped]

TIMEFRAME_TO_PANDAS = {
    "1m": "1min", "5m": "5min", "15m": "15min", "30m": "30min",
    "1h": "1h", "4h": "4h", "1d": "1D", "1w": "1W",
}


@dataclass
class QualityReport:
    symbol: str
    passed: bool
    gaps: list[tuple[pd.Timestamp, pd.Timestamp]] = field(default_factory=list)
    issues: list[str] = field(default_factory=list)
    stats: dict[str, float] = field(default_factory=dict)


@dataclass
class QualityChecker:
    """Valide qualite d'un DataFrame OHLCV. Ne lance pas : retourne un QualityReport."""

    timeframe: Literal["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w"] = "1h"
    spike_zscore: float = 10.0
    max_gap_ratio: float = 0.01

    def check(self, df: pd.DataFrame, *, symbol: str) -> QualityReport:
        report = QualityReport(symbol=symbol, passed=True)
        if df.empty:
            report.passed = False
            report.issues.append("empty_dataframe")
            return report

        expected_freq = TIMEFRAME_TO_PANDAS[self.timeframe]
        expected_idx = pd.date_range(df.index[0], df.index[-1], freq=expected_freq, tz=df.index.tz)
        missing = expected_idx.difference(df.index)
        if len(missing) > 0:
            report.gaps = self._group_consecutive(missing, expected_freq)
            ratio = len(missing) / max(len(expected_idx), 1)
            report.stats["gap_ratio"] = ratio
            if ratio > self.max_gap_ratio:
                report.passed = False
                report.issues.append(f"gap_ratio_high={ratio:.3%}")

        if (df["volume"] == 0).any():
            report.issues.append(f"zero_volume_count={int((df['volume'] == 0).sum())}")

        for col in ("open", "high", "low", "close"):
            z = (df[col] - df[col].mean()) / df[col].std(ddof=0)
            if (np.abs(z) > self.spike_zscore).any():
                report.issues.append(f"price_spike_{col}_zmax={float(np.abs(z).max()):.2f}")

        return report

    @staticmethod
    def _group_consecutive(
        missing: pd.DatetimeIndex, freq: str
    ) -> list[tuple[pd.Timestamp, pd.Timestamp]]:
        if len(missing) == 0:
            return []
        delta = pd.Timedelta(freq)
        groups: list[tuple[pd.Timestamp, pd.Timestamp]] = []
        start = missing[0]
        prev = missing[0]
        for ts in missing[1:]:
            if ts - prev > delta:
                groups.append((start, prev))
                start = ts
            prev = ts
        groups.append((start, prev))
        return groups
