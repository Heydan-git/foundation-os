"""Store DuckDB : queries analytiques SQL sur Parquet catalog.

Utilisation prevue (Phase post-v1) :
  - rolling volatility, correlation matrices, regime stats
  - lecture Parquet multi-fichiers via duckdb.read_parquet('<glob>')

V1 : wrapper minimal. Les usages plus riches (pandas-on-arrow, filter pushdown)
peuvent etre ajoutes plus tard sans breaking change.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import duckdb
import pandas as pd  # type: ignore[import-untyped]


@dataclass
class Store:
    catalog_root: Path

    def query(self, sql: str) -> pd.DataFrame:
        """Execute une query DuckDB et retourne un DataFrame pandas.

        Pour lire un Parquet du catalog :
            store.query("SELECT * FROM read_parquet('data/parquet/BINANCE/BTCUSDT/1h.parquet')")
        """
        con = duckdb.connect(":memory:")
        return con.execute(sql).df()
