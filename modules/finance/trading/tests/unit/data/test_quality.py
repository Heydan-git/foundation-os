"""Tests QualityChecker : detection gaps / outliers / zero volume."""
from datetime import UTC, datetime

import numpy as np
import pandas as pd
import pytest  # noqa: F401

from trading.data.quality import QualityChecker


def make_ohlcv(start: datetime, n: int, freq: str = "1h") -> pd.DataFrame:
    idx = pd.date_range(start, periods=n, freq=freq, tz=UTC)
    return pd.DataFrame(
        {
            "open": np.linspace(100, 110, n),
            "high": np.linspace(101, 111, n),
            "low": np.linspace(99, 109, n),
            "close": np.linspace(100.5, 110.5, n),
            "volume": np.linspace(10, 20, n),
        },
        index=idx,
    )


def test_no_gaps_reports_clean() -> None:
    df = make_ohlcv(datetime(2024, 1, 1, tzinfo=UTC), 24)
    checker = QualityChecker(timeframe="1h")
    report = checker.check(df, symbol="BTCUSDT")
    assert report.passed
    assert report.gaps == []


def test_detect_single_gap() -> None:
    df = make_ohlcv(datetime(2024, 1, 1, tzinfo=UTC), 24)
    df = df.drop(df.index[12])  # enleve 1 bougie
    checker = QualityChecker(timeframe="1h", max_gap_ratio=0.0)  # force fail on any gap
    report = checker.check(df, symbol="BTCUSDT")
    assert not report.passed
    assert len(report.gaps) == 1


def test_detect_zero_volume_outlier() -> None:
    df = make_ohlcv(datetime(2024, 1, 1, tzinfo=UTC), 24)
    df.loc[df.index[5], "volume"] = 0
    checker = QualityChecker(timeframe="1h")
    report = checker.check(df, symbol="BTCUSDT")
    assert any("zero_volume" in i for i in report.issues)


def test_detect_price_spike_outlier() -> None:
    df = make_ohlcv(datetime(2024, 1, 1, tzinfo=UTC), 48)
    df.loc[df.index[10], "close"] = df["close"].mean() * 10
    checker = QualityChecker(timeframe="1h", spike_zscore=5.0)
    report = checker.check(df, symbol="BTCUSDT")
    assert any("price_spike" in i for i in report.issues)
