"""Exponential Moving Average pandas-based."""
import pandas as pd  # type: ignore[import-untyped]


def ema(series: pd.Series, period: int) -> pd.Series:
    return series.ewm(span=period, adjust=False).mean()
