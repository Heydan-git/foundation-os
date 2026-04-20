"""Protocol DataSource : verifier qu'une classe conforme est detectee."""
from datetime import datetime
from typing import Literal

import pandas as pd

from trading.data.sources.base import DataSource


class FakeSource:
    def fetch_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        return pd.DataFrame()

    def fetch_funding(
        self,
        symbol: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        return pd.DataFrame()

    def list_symbols(self, market_type: Literal["spot", "perp"]) -> list[str]:
        return []


def test_fake_source_is_datasource() -> None:
    src: DataSource = FakeSource()
    assert isinstance(src, DataSource)
