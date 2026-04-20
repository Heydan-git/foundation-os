"""Transforms : pandas OHLCV <-> NautilusBar, signals pd.Series -> list[OrderIntent]."""

from __future__ import annotations

import pandas as pd  # type: ignore[import-untyped]

from trading.backtest.nautilus_bridge.types import NautilusBar, OrderIntent


def pandas_to_nautilus_bars(df: pd.DataFrame, *, instrument_id: str) -> list[NautilusBar]:
    """Convertit OHLCV DataFrame vers list[NautilusBar] ordonne par ts croissant.

    V1.2 roadmap : cette fonction deviendra le feed du BacktestNode Nautilus
    via ParquetDataCatalog ingestion + BarDataType registration.
    """
    bars: list[NautilusBar] = []
    for ts, row in df.iterrows():
        bars.append(
            NautilusBar(
                instrument_id=instrument_id,
                ts_event=ts.to_pydatetime() if hasattr(ts, "to_pydatetime") else ts,
                open=float(row["open"]),
                high=float(row["high"]),
                low=float(row["low"]),
                close=float(row["close"]),
                volume=float(row["volume"]),
            )
        )
    return bars


def signals_to_order_intents(
    signals: pd.Series,
    *,
    instrument_id: str,
    quantity: float,
) -> list[OrderIntent]:
    """+1 signal -> BUY intent, -1 -> SELL intent, 0 ignored.

    V1.2 roadmap : ces intents seront convertis en nautilus_trader.model.orders.MarketOrder
    puis submit via Strategy.submit_order() event-driven.
    """
    intents: list[OrderIntent] = []
    for ts, sig in signals.items():
        if sig == 1:
            intents.append(
                OrderIntent(
                    instrument_id=instrument_id,
                    ts=ts.to_pydatetime() if hasattr(ts, "to_pydatetime") else ts,
                    side="BUY",
                    quantity=quantity,
                )
            )
        elif sig == -1:
            intents.append(
                OrderIntent(
                    instrument_id=instrument_id,
                    ts=ts.to_pydatetime() if hasattr(ts, "to_pydatetime") else ts,
                    side="SELL",
                    quantity=quantity,
                )
            )
    return intents
