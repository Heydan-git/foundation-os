"""Tests PBO : Probability of Backtest Overfitting (Bailey-Lopez)."""
import numpy as np
import pandas as pd

from trading.backtest.harnesses.pbo import PBO


def test_pbo_runs_on_random_curves() -> None:
    rng = np.random.default_rng(0)
    curves = pd.DataFrame(
        {f"s{i}": 100 * np.exp(rng.normal(0, 0.01, 2000).cumsum()) for i in range(10)},
        index=pd.date_range("2023-01-01", periods=2000, freq="1h"),
    )
    pbo = PBO(s=8)
    result = pbo.run(strategy=None, df=curves, config={"equity_curves": curves})
    assert result.name == "pbo"
    assert 0 <= result.metrics["pbo_probability"] <= 1
    assert result.metrics["s"] == 8
