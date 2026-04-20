"""CCXTSource : adaptateur multi-exchange via la librairie ccxt."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any, Literal

import ccxt  # type: ignore[import-untyped]
import pandas as pd  # type: ignore[import-untyped]


@dataclass
class CCXTSource:
    """Fetch OHLCV + funding via ccxt. Exchange_id = "binance" | "bybit" | etc.

    Note : pour les perps Binance, utiliser exchange_id="binanceusdm".
    """

    exchange_id: str
    _exchange: Any = field(default=None, repr=False)

    def __post_init__(self) -> None:
        if self._exchange is None:
            self._exchange = getattr(ccxt, self.exchange_id)({"enableRateLimit": True})

    def fetch_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        since = int(start.replace(tzinfo=UTC).timestamp() * 1000)
        until = int(end.replace(tzinfo=UTC).timestamp() * 1000)

        raw: list[list[float]] = []
        cursor = since
        while cursor < until:
            chunk = self._exchange.fetch_ohlcv(symbol, timeframe, since=cursor, limit=1000)
            if not chunk:
                break
            raw.extend(chunk)
            last_ts = chunk[-1][0]
            if last_ts <= cursor:
                break
            cursor = last_ts + 1

        if not raw:
            raise ValueError(f"empty OHLCV for {symbol} {timeframe} {start}..{end}")

        df = pd.DataFrame(raw, columns=["ts_ms", "open", "high", "low", "close", "volume"])
        df["ts"] = pd.to_datetime(df["ts_ms"], unit="ms", utc=True)
        df = df.set_index("ts").drop(columns=["ts_ms"])
        df = df[~df.index.duplicated(keep="first")].sort_index()
        return df.loc[(df.index >= start.replace(tzinfo=UTC)) & (df.index <= end.replace(tzinfo=UTC))]

    def fetch_funding(
        self,
        symbol: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        if not getattr(self._exchange, "has", {}).get("fetchFundingRateHistory"):
            return pd.DataFrame(columns=["funding_rate"])

        since = int(start.replace(tzinfo=UTC).timestamp() * 1000)
        rows = self._exchange.fetch_funding_rate_history(symbol, since=since, limit=1000)
        if not rows:
            return pd.DataFrame(columns=["funding_rate"])

        df = pd.DataFrame([{"ts_ms": r["timestamp"], "funding_rate": r["fundingRate"]} for r in rows])
        df["ts"] = pd.to_datetime(df["ts_ms"], unit="ms", utc=True)
        return df.set_index("ts").drop(columns=["ts_ms"])

    def list_symbols(self, market_type: Literal["spot", "perp"]) -> list[str]:
        markets = self._exchange.load_markets()
        if market_type == "spot":
            return sorted([s for s, m in markets.items() if m.get("spot", False)])
        return sorted([s for s, m in markets.items() if m.get("swap") or m.get("future")])
