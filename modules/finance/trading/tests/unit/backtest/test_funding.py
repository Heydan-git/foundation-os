from datetime import UTC

import pandas as pd

from trading.backtest.funding import FundingCalculator


def test_funding_cashflow_long_negative_rate_earns() -> None:
    idx = pd.date_range("2024-01-01", periods=3, freq="8h", tz=UTC)
    funding = pd.Series([-0.0001, -0.0001, -0.0001], index=idx, name="funding_rate")
    calc = FundingCalculator()
    cashflow = calc.apply(position_notional=10_000, direction="long", funding_series=funding)
    assert cashflow > 0


def test_funding_cashflow_long_positive_rate_pays() -> None:
    idx = pd.date_range("2024-01-01", periods=2, freq="8h", tz=UTC)
    funding = pd.Series([0.0002, 0.0002], index=idx, name="funding_rate")
    calc = FundingCalculator()
    cashflow = calc.apply(position_notional=10_000, direction="long", funding_series=funding)
    assert cashflow < 0
