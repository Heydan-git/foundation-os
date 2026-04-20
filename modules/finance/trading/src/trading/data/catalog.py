"""Catalog : wrapper simple autour Parquet pour storage hierarchise.

Note : on utilise Parquet brut (pas le ParquetDataCatalog Nautilus complet)
pour la v1 — plus simple a manipuler. La conversion vers Nautilus catalog
se fera dans BacktestRunner (Phase 3) via un builder dedie.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import pandas as pd  # type: ignore[import-untyped]


@dataclass
class Catalog:
    """Storage Parquet hierarchise : root/{venue}/{symbol}/{timeframe}.parquet."""

    root: Path

    def _path(self, venue: str, symbol: str, timeframe: str) -> Path:
        return self.root / venue / symbol / f"{timeframe}.parquet"

    def write_ohlcv(
        self,
        df: pd.DataFrame,
        *,
        venue: str,
        symbol: str,
        timeframe: str,
    ) -> Path:
        path = self._path(venue, symbol, timeframe)
        path.parent.mkdir(parents=True, exist_ok=True)
        df.to_parquet(path, engine="pyarrow", compression="snappy")
        return path

    def read_ohlcv(
        self,
        *,
        venue: str,
        symbol: str,
        timeframe: str,
    ) -> pd.DataFrame:
        path = self._path(venue, symbol, timeframe)
        if not path.exists():
            raise FileNotFoundError(f"no catalog entry for {venue}/{symbol}/{timeframe}")
        return pd.read_parquet(path, engine="pyarrow")

    def list_available(self, *, venue: str, timeframe: str) -> list[str]:
        venue_dir = self.root / venue
        if not venue_dir.exists():
            return []
        out: list[str] = []
        for sym_dir in venue_dir.iterdir():
            if (sym_dir / f"{timeframe}.parquet").exists():
                out.append(sym_dir.name)
        return sorted(out)
