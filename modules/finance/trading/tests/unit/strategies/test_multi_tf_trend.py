"""Tests MultiTFTrendStrategy : EMA cross filtered by long-term trend slope."""
import numpy as np
import pandas as pd

from trading.strategies._examples.multi_tf_trend import MultiTFTrendStrategy


def _uptrend(n: int = 400) -> pd.DataFrame:
    """Strong uptrend : trend filter should allow entries."""
    idx = pd.date_range("2024-01-01", periods=n, freq="1h", tz="UTC")
    prices = 100 * np.exp(np.linspace(0, 0.6, n))
    return pd.DataFrame(
        {
            "open": prices,
            "high": prices * 1.002,
            "low": prices * 0.998,
            "close": prices,
            "volume": 1.0,
        },
        index=idx,
    )


def _downtrend(n: int = 400) -> pd.DataFrame:
    """Strong downtrend : trend filter should BLOCK entries."""
    idx = pd.date_range("2024-01-01", periods=n, freq="1h", tz="UTC")
    prices = 100 * np.exp(np.linspace(0, -0.6, n))
    return pd.DataFrame(
        {
            "open": prices,
            "high": prices * 1.002,
            "low": prices * 0.998,
            "close": prices,
            "volume": 1.0,
        },
        index=idx,
    )


def test_metadata_horizon_swing() -> None:
    strat = MultiTFTrendStrategy(ema_fast=10, ema_slow=30, trend_ema=200, trend_lookback=50)
    assert strat.metadata.horizon == "swing"
    assert strat.metadata.name == "multi_tf_trend_10_30_200_50"
    assert strat.metadata.hyperparams == {
        "ema_fast": 10,
        "ema_slow": 30,
        "trend_ema": 200,
        "trend_lookback": 50,
    }


def test_generate_signals_returns_series_valid_values() -> None:
    df = _uptrend(400)
    strat = MultiTFTrendStrategy()
    signals = strat.generate_signals(df)
    assert isinstance(signals, pd.Series)
    assert len(signals) == len(df)
    assert set(signals.dropna().unique()).issubset({-1, 0, 1})


def test_entries_allowed_on_uptrend() -> None:
    df = _uptrend(400)
    strat = MultiTFTrendStrategy(ema_fast=10, ema_slow=30, trend_ema=100, trend_lookback=30)
    signals = strat.generate_signals(df)
    assert (signals == 1).any(), "uptrend should allow at least one long entry"


def test_entries_blocked_on_downtrend() -> None:
    df = _downtrend(400)
    strat = MultiTFTrendStrategy(ema_fast=10, ema_slow=30, trend_ema=100, trend_lookback=30)
    signals = strat.generate_signals(df)
    # In a clean downtrend, the trend filter is DOWN, so no long entry should fire
    assert not (signals == 1).any(), "downtrend should block long entries via trend filter"


def test_to_pine_context_includes_all_params() -> None:
    strat = MultiTFTrendStrategy(ema_fast=8, ema_slow=21, trend_ema=150, trend_lookback=40)
    ctx = strat.to_pine_context()
    assert ctx["strategy_name"] == "multi_tf_trend_8_21_150_40"
    assert ctx["ema_fast"] == 8
    assert ctx["ema_slow"] == 21
    assert ctx["trend_ema"] == 150
    assert ctx["trend_lookback"] == 40


def test_invalid_ema_config_raises() -> None:
    import pytest

    with pytest.raises(ValueError, match="ema_fast must be < ema_slow"):
        MultiTFTrendStrategy(ema_fast=30, ema_slow=10)
