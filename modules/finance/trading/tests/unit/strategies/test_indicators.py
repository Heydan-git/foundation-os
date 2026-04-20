"""Tests indicateurs purs (pandas-based, reutilisables hors Nautilus)."""
import numpy as np
import pandas as pd

from trading.strategies.indicators.atr import atr
from trading.strategies.indicators.ema import ema
from trading.strategies.indicators.rsi import rsi


def _ohlc(n: int) -> pd.DataFrame:
    idx = pd.date_range("2024-01-01", periods=n, freq="1h", tz="UTC")
    prices = np.linspace(100, 110, n)
    return pd.DataFrame(
        {"open": prices, "high": prices + 1, "low": prices - 1, "close": prices, "volume": 1.0},
        index=idx,
    )


def test_ema_length_matches_input() -> None:
    series = _ohlc(50)["close"]
    out = ema(series, period=10)
    assert len(out) == len(series)
    assert not out.iloc[10:].isna().any()


def test_rsi_range_0_100() -> None:
    series = _ohlc(100)["close"]
    out = rsi(series, period=14)
    valid = out.dropna()
    assert (valid >= 0).all() and (valid <= 100).all()


def test_atr_positive() -> None:
    df = _ohlc(100)
    out = atr(df, period=14)
    valid = out.dropna()
    assert (valid >= 0).all()
