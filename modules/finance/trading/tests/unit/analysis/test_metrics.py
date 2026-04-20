"""Tests PerformanceMetrics : Sharpe / Sortino / Calmar / MaxDD / ProfitFactor."""
import pandas as pd
import pytest

from trading.analysis.metrics import PerformanceMetrics


def test_sharpe_of_constant_returns_zero() -> None:
    returns = pd.Series([0.001] * 100)
    pm = PerformanceMetrics()
    m = pm.compute(returns=returns, equity=pd.Series(1 + returns.cumsum()))
    # stdev=0 => sharpe undefined, on retourne 0.0
    assert m["sharpe"] == 0.0


def test_max_drawdown_non_positive() -> None:
    equity = pd.Series([100.0, 110.0, 90.0, 95.0, 120.0])
    pm = PerformanceMetrics()
    m = pm.compute(returns=equity.pct_change().dropna(), equity=equity)
    assert m["max_drawdown"] <= 0


def test_profit_factor_sane() -> None:
    trades = pd.Series([0.05, -0.02, 0.03, -0.01, 0.04])
    pm = PerformanceMetrics()
    m = pm.compute(returns=trades, equity=(1 + trades).cumprod())
    pf_expected = (0.05 + 0.03 + 0.04) / (0.02 + 0.01)
    assert m["profit_factor"] == pytest.approx(pf_expected, rel=0.01)


def test_win_rate_and_expectancy() -> None:
    trades = pd.Series([0.05, -0.02, 0.03, -0.01, 0.04])
    pm = PerformanceMetrics()
    m = pm.compute(returns=trades, equity=(1 + trades).cumprod())
    assert m["win_rate"] == pytest.approx(3 / 5)
    assert m["expectancy"] == pytest.approx(trades.mean())
