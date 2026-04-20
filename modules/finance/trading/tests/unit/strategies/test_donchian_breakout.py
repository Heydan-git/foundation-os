"""Tests DonchianBreakoutStrategy : signal +1 on breakout high, -1 on breakdown low."""
import numpy as np
import pandas as pd

from trading.strategies._examples.donchian_breakout import DonchianBreakoutStrategy


def _make_trend(n: int = 100) -> pd.DataFrame:
    """Uptrend + pullback fixture to force both entry and exit."""
    idx = pd.date_range("2024-01-01", periods=n, freq="1h", tz="UTC")
    # half rising, half falling
    rising = np.linspace(100, 150, n // 2)
    falling = np.linspace(150, 100, n - n // 2)
    prices = np.concatenate([rising, falling])
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
    strat = DonchianBreakoutStrategy(entry_window=20, exit_window=10)
    assert strat.metadata.horizon == "swing"
    assert strat.metadata.name == "donchian_breakout_20_10"
    assert strat.metadata.hyperparams == {"entry_window": 20, "exit_window": 10}


def test_generate_signals_returns_series_with_correct_values() -> None:
    df = _make_trend(100)
    strat = DonchianBreakoutStrategy(entry_window=20, exit_window=10)
    signals = strat.generate_signals(df)
    assert isinstance(signals, pd.Series)
    assert len(signals) == len(df)
    assert set(signals.dropna().unique()).issubset({-1, 0, 1})


def test_entry_signal_on_uptrend() -> None:
    df = _make_trend(100)
    strat = DonchianBreakoutStrategy(entry_window=10, exit_window=5)
    signals = strat.generate_signals(df)
    # at least one +1 entry during the rising phase
    rising_signals = signals.iloc[:50]
    assert (rising_signals == 1).any()


def test_exit_signal_on_downtrend() -> None:
    df = _make_trend(100)
    strat = DonchianBreakoutStrategy(entry_window=10, exit_window=5)
    signals = strat.generate_signals(df)
    # at least one -1 exit during the falling phase
    falling_signals = signals.iloc[50:]
    assert (falling_signals == -1).any()


def test_to_pine_context_includes_windows() -> None:
    strat = DonchianBreakoutStrategy(entry_window=55, exit_window=20)
    ctx = strat.to_pine_context()
    assert ctx["strategy_name"] == "donchian_breakout_55_20"
    assert ctx["entry_window"] == 55
    assert ctx["exit_window"] == 20
