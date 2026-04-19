"""Tests BollingerBreakoutStrategy : breakout above upper, exit below middle."""
import numpy as np
import pandas as pd

from trading.strategies._examples.bollinger_breakout import BollingerBreakoutStrategy


def _breakout_fixture(n: int = 200) -> pd.DataFrame:
    """Consolidation then breakout then return-to-mean : forces both entry and exit."""
    idx = pd.date_range("2024-01-01", periods=n, freq="1h", tz="UTC")
    rng = np.random.default_rng(42)
    # Phase 1 : consolidation around 100 (low vol) 0..80
    consolidation = 100 + rng.normal(0, 0.3, 80)
    # Phase 2 : breakout upward (high vol) 80..130
    breakout = np.linspace(100, 130, 50) + rng.normal(0, 0.5, 50)
    # Phase 3 : return to mean 130..100 (70 bars)
    reversion = np.linspace(130, 100, n - 130) + rng.normal(0, 0.3, n - 130)
    prices = np.concatenate([consolidation, breakout, reversion])
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
    strat = BollingerBreakoutStrategy(period=20, num_std=2.0)
    assert strat.metadata.horizon == "swing"
    assert strat.metadata.name == "bollinger_breakout_20_2"
    assert strat.metadata.hyperparams == {"period": 20, "num_std": 2.0}


def test_generate_signals_returns_series_valid_values() -> None:
    df = _breakout_fixture(200)
    strat = BollingerBreakoutStrategy(period=20, num_std=2.0)
    signals = strat.generate_signals(df)
    assert isinstance(signals, pd.Series)
    assert len(signals) == len(df)
    assert set(signals.dropna().unique()).issubset({-1, 0, 1})


def test_entry_on_breakout_phase() -> None:
    df = _breakout_fixture(200)
    strat = BollingerBreakoutStrategy(period=20, num_std=1.5)
    signals = strat.generate_signals(df)
    # At least one +1 during breakout phase (bars 80..130)
    breakout_signals = signals.iloc[80:130]
    assert (breakout_signals == 1).any(), "breakout phase should emit at least one long entry"


def test_exit_on_reversion_phase() -> None:
    df = _breakout_fixture(200)
    strat = BollingerBreakoutStrategy(period=20, num_std=1.5)
    signals = strat.generate_signals(df)
    # At least one -1 during reversion phase (bars 130..200)
    reversion_signals = signals.iloc[130:]
    assert (reversion_signals == -1).any(), "reversion phase should emit at least one long exit"


def test_to_pine_context_includes_params() -> None:
    strat = BollingerBreakoutStrategy(period=14, num_std=2.5)
    ctx = strat.to_pine_context()
    assert ctx["strategy_name"] == "bollinger_breakout_14_2"
    assert ctx["period"] == 14
    assert ctx["num_std"] == 2.5


def test_invalid_num_std_raises() -> None:
    import pytest

    with pytest.raises(ValueError, match="num_std must be > 0"):
        BollingerBreakoutStrategy(period=20, num_std=0)

    with pytest.raises(ValueError, match="num_std must be > 0"):
        BollingerBreakoutStrategy(period=20, num_std=-1.0)
