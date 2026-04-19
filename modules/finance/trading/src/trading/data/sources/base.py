"""Protocol DataSource : contrat unique pour tout fournisseur de donnees historiques."""

from datetime import datetime
from typing import Literal, Protocol, runtime_checkable

import pandas as pd


@runtime_checkable
class DataSource(Protocol):
    """Fournisseur de donnees OHLCV + funding + liste symbols.

    Toutes les implementations (CCXTSource, BinanceSource, TardisSource futur)
    respectent cette interface. Permet de swapper les sources sans refacto
    du reste du pipeline.
    """

    def fetch_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        """Retourne un DataFrame index=datetime, cols=[open, high, low, close, volume]."""
        ...

    def fetch_funding(
        self,
        symbol: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        """Funding rates pour perps. DataFrame index=datetime, col=[funding_rate]. Vide pour spot."""
        ...

    def list_symbols(self, market_type: Literal["spot", "perp"]) -> list[str]:
        """Symbols disponibles sur la venue pour ce market_type."""
        ...
