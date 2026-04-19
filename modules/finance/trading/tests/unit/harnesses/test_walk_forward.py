"""Tests WalkForward : rolling train/test avec embargo."""
import numpy as np
import pandas as pd

from trading.backtest.harnesses.base import HarnessVerdict
from trading.backtest.harnesses.walk_forward import WalkForward
from trading.strategies._examples.ema_cross import EMACrossStrategy


def _long_fixture(n: int = 2000) -> pd.DataFrame:
    idx = pd.date_range("2023-01-01", periods=n, freq="1h", tz="UTC")
    rng = np.random.default_rng(7)
    returns = rng.normal(0, 0.01, n)
    prices = 40000 * np.exp(returns.cumsum())
    return pd.DataFrame(
        {
            "open": prices,
            "high": prices * 1.002,
            "low": prices * 0.998,
            "close": prices,
            "volume": rng.uniform(50, 200, n),
        },
        index=idx,
    )


def test_walk_forward_runs() -> None:
    df = _long_fixture()
    strategy = EMACrossStrategy(5, 20)
    wf = WalkForward(train_bars=500, test_bars=200, embargo_bars=24)
    result = wf.run(strategy, df, config={})
    assert result.name == "walk_forward"
    assert result.verdict in {HarnessVerdict.PASS, HarnessVerdict.WARN, HarnessVerdict.FAIL}
    assert "n_windows" in result.metrics
    assert result.metrics["n_windows"] >= 2
