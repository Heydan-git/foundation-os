"""Tests RSIMeanReversionStrategy : signal +1 on oversold cross, -1 on overbought cross."""
import numpy as np
import pandas as pd

from trading.strategies._examples.rsi_mean_reversion import RSIMeanReversionStrategy


def _oscillating_series(n: int = 200) -> pd.DataFrame:
    """Sine wave to generate oscillations that cross RSI thresholds."""
    idx = pd.date_range("2024-01-01", periods=n, freq="1h", tz="UTC")
    t = np.linspace(0, 8 * np.pi, n)
    prices = 100 + 20 * np.sin(t)  # 80..120 range
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
    strat = RSIMeanReversionStrategy(period=14, oversold=30, overbought=70)
    assert strat.metadata.horizon == "swing"
    assert strat.metadata.name == "rsi_meanrev_14_30_70"
    assert strat.metadata.hyperparams == {
        "period": 14,
        "oversold": 30,
        "overbought": 70,
    }


def test_generate_signals_returns_series_valid_values() -> None:
    df = _oscillating_series(200)
    strat = RSIMeanReversionStrategy(period=14)
    signals = strat.generate_signals(df)
    assert isinstance(signals, pd.Series)
    assert len(signals) == len(df)
    assert set(signals.dropna().unique()).issubset({-1, 0, 1})


def test_emits_entry_and_exit_on_oscillations() -> None:
    df = _oscillating_series(200)
    strat = RSIMeanReversionStrategy(period=14, oversold=40, overbought=60)  # wider for sine test
    signals = strat.generate_signals(df)
    # both entry (+1) and exit (-1) must occur at least once during full oscillation
    assert (signals == 1).any(), "should have at least one long entry on oversold cross"
    assert (signals == -1).any(), "should have at least one long exit on overbought cross"


def test_to_pine_context_includes_all_params() -> None:
    strat = RSIMeanReversionStrategy(period=21, oversold=25, overbought=75)
    ctx = strat.to_pine_context()
    assert ctx["strategy_name"] == "rsi_meanrev_21_25_75"
    assert ctx["period"] == 21
    assert ctx["oversold"] == 25
    assert ctx["overbought"] == 75


def test_invalid_thresholds_raise() -> None:
    import pytest

    with pytest.raises(ValueError, match="oversold must be < overbought"):
        RSIMeanReversionStrategy(oversold=70, overbought=30)
