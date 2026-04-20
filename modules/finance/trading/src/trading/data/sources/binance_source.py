"""BinanceSource : acces API Binance direct (REST v3) pour granularite fine."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any, Literal

import httpx
import pandas as pd  # type: ignore[import-untyped]


@dataclass
class BinanceSource:
    """Adaptateur direct Binance REST API. market = "spot" | "perp" (USDM futures)."""

    market: Literal["spot", "perp"] = "spot"
    _client: Any = field(default=None, repr=False)

    BASE_URLS = {
        "spot": "https://api.binance.com/api/v3",
        "perp": "https://fapi.binance.com/fapi/v1",
    }

    def __post_init__(self) -> None:
        if self._client is None:
            self._client = httpx.Client(timeout=30.0)

    def _base_url(self) -> str:
        return self.BASE_URLS[self.market]

    def fetch_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        since = int(start.replace(tzinfo=UTC).timestamp() * 1000)
        until = int(end.replace(tzinfo=UTC).timestamp() * 1000)

        rows: list[list[Any]] = []
        cursor = since
        while cursor < until:
            resp = self._client.get(
                f"{self._base_url()}/klines",
                params={
                    "symbol": symbol,
                    "interval": timeframe,
                    "startTime": cursor,
                    "endTime": until,
                    "limit": 1000,
                },
            )
            resp.raise_for_status()
            chunk = resp.json()
            if not chunk:
                break
            rows.extend(chunk)
            if len(chunk) < 1000:
                break
            last_ts = int(chunk[-1][0])
            if last_ts <= cursor:
                break
            cursor = last_ts + 1

        if not rows:
            raise ValueError(f"empty klines for {symbol} {timeframe} {start}..{end}")

        df = pd.DataFrame(
            rows,
            columns=[
                "ts_ms", "open", "high", "low", "close", "volume",
                "close_ts", "quote_vol", "trades", "taker_base_vol", "taker_quote_vol", "ignore",
            ],
        )
        for col in ("open", "high", "low", "close", "volume"):
            df[col] = df[col].astype(float)
        df["ts"] = pd.to_datetime(df["ts_ms"], unit="ms", utc=True)
        return df.set_index("ts")[["open", "high", "low", "close", "volume"]]

    def fetch_funding(
        self,
        symbol: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        if self.market != "perp":
            return pd.DataFrame(columns=["funding_rate"])

        since = int(start.replace(tzinfo=UTC).timestamp() * 1000)
        until = int(end.replace(tzinfo=UTC).timestamp() * 1000)
        resp = self._client.get(
            f"{self._base_url()}/fundingRate",
            params={"symbol": symbol, "startTime": since, "endTime": until, "limit": 1000},
        )
        resp.raise_for_status()
        rows = resp.json()
        if not rows:
            return pd.DataFrame(columns=["funding_rate"])

        df = pd.DataFrame(
            [{"ts_ms": r["fundingTime"], "funding_rate": float(r["fundingRate"])} for r in rows]
        )
        df["ts"] = pd.to_datetime(df["ts_ms"], unit="ms", utc=True)
        return df.set_index("ts").drop(columns=["ts_ms"])

    def list_symbols(self, market_type: Literal["spot", "perp"]) -> list[str]:
        if market_type == "spot":
            resp = self._client.get("https://api.binance.com/api/v3/exchangeInfo")
        else:
            resp = self._client.get("https://fapi.binance.com/fapi/v1/exchangeInfo")
        resp.raise_for_status()
        data = resp.json()
        return sorted(s["symbol"] for s in data["symbols"] if s.get("status") == "TRADING")
