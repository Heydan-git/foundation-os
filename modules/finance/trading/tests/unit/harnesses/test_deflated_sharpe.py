"""Tests DeflatedSharpe : Sharpe ajuste pour N trials (Bailey-Lopez)."""
import numpy as np

from trading.backtest.harnesses.deflated_sharpe import DeflatedSharpe


def test_deflated_sharpe_basic() -> None:
    rng = np.random.default_rng(1)
    returns = rng.normal(0.001, 0.01, 500)
    ds = DeflatedSharpe()
    result = ds.run(strategy=None, df=None, config={"returns": returns, "n_trials": 100})
    assert result.name == "deflated_sharpe"
    assert "dsr" in result.metrics
    assert 0 <= result.metrics["dsr"] <= 1
    assert result.metrics["n_trials"] == 100
