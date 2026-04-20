"""NautilusLiveEngine : event-driven live trading skeleton (V1.2 Nautilus integration prep).

V1 status : SKELETON. Lifecycle + order tracking + kill-switch testes in-memory.
V1.2 roadmap : connect_to_exchange() et send_order_to_exchange() implementeront la vraie
integration Nautilus live mode + ccxt broker. Voir spec V1.2 roadmap.

Voir aussi :
- src/trading/backtest/nautilus_bridge/ — transforms pandas <-> Nautilus (B1)
- src/trading/execution/threecommas/ — OMS/EMS via 3Commas (fallback operationnel)
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime
from typing import Literal

from trading.backtest.nautilus_bridge.types import OrderIntent
from trading.execution.live.kill_switch import KillSwitch


@dataclass
class LiveOrder:
    """Order live en memoire. Mirror nautilus_trader.model.orders.Order (subset)."""

    order_id: str
    instrument_id: str
    ts_submitted: datetime
    side: Literal["BUY", "SELL"]
    quantity: float
    status: Literal["PENDING", "FILLED", "CANCELLED", "REJECTED"] = "PENDING"
    order_type: Literal["MARKET"] = "MARKET"


@dataclass
class LiveFill:
    """Fill event. Mirror nautilus_trader.model.events.OrderFilled."""

    order_id: str
    ts: datetime
    fill_price: float
    fill_quantity: float


@dataclass
class LivePosition:
    """Position aggregee. V1 : simple long/short net. V1.2 : ledger FIFO complet."""

    instrument_id: str
    quantity: float  # positif = long, negatif = short
    avg_price: float


@dataclass
class NautilusLiveEngine:
    """Skeleton live engine : lifecycle + order tracking + kill-switch integres.

    V1 : tout est in-memory, PAS de broker reel.
    V1.2 : connect_to_exchange() + send_order_to_exchange() implementes (Nautilus live mode + ccxt).
    """

    venue: str = "BINANCE"
    kill_switch: KillSwitch = field(default_factory=KillSwitch)
    _running: bool = field(default=False, init=False)
    _paused: bool = field(default=False, init=False)
    open_orders: dict[str, LiveOrder] = field(default_factory=dict)
    positions: dict[str, LivePosition] = field(default_factory=dict)

    # --- Lifecycle ---

    def start(self) -> None:
        self._running = True
        self._paused = False

    def stop(self) -> None:
        self._running = False
        self._paused = False

    def pause(self) -> None:
        self._paused = True

    def resume(self) -> None:
        self._paused = False

    def is_running(self) -> bool:
        return self._running

    def is_paused(self) -> bool:
        return self._paused

    # --- Order flow ---

    def submit_order(self, intent: OrderIntent) -> str:
        """V1 : tracke l'ordre en memoire sans l'envoyer a l'exchange.

        V1.2 : apres tracking local, appelle send_order_to_exchange() pour la vraie submission.
        """
        if not self._running:
            raise RuntimeError("engine not running — call start() first")
        if self.kill_switch.is_active():
            raise RuntimeError(
                f"kill-switch active : {self.kill_switch.reason()} — order refused"
            )

        order_id = str(uuid.uuid4())
        self.open_orders[order_id] = LiveOrder(
            order_id=order_id,
            instrument_id=intent.instrument_id,
            ts_submitted=intent.ts,
            side=intent.side,
            quantity=intent.quantity,
        )
        return order_id

    def on_fill(self, fill: LiveFill) -> None:
        """Handler fill event. V1 : met a jour position net + close order.

        V1.2 : handler appele par Nautilus event loop sur OrderFilled.
        """
        order = self.open_orders.pop(fill.order_id, None)
        if order is None:
            return  # fill inconnu, ignore (V1.2 : log warning + reconcile)

        order.status = "FILLED"
        # Update position (net long/short)
        pos = self.positions.get(order.instrument_id)
        signed_qty = fill.fill_quantity if order.side == "BUY" else -fill.fill_quantity
        if pos is None:
            self.positions[order.instrument_id] = LivePosition(
                instrument_id=order.instrument_id,
                quantity=signed_qty,
                avg_price=fill.fill_price,
            )
        else:
            # V1 : moyenne ponderee naive. V1.2 : FIFO ledger complet pour cost basis propre.
            new_qty = pos.quantity + signed_qty
            if new_qty == 0:
                del self.positions[order.instrument_id]
            else:
                # Simple weighted avg (only correct if same side — V1 caveat)
                self.positions[order.instrument_id] = LivePosition(
                    instrument_id=order.instrument_id,
                    quantity=new_qty,
                    avg_price=(
                        (pos.quantity * pos.avg_price + signed_qty * fill.fill_price)
                        / new_qty
                    ),
                )

    # --- V1.2 integration points (NotImplementedError) ---

    def connect_to_exchange(self, *, api_key: str, api_secret: str) -> None:
        """V1.2 : etablit la connection websocket + REST vers l'exchange via Nautilus adapter ou ccxt.

        V1 : NotImplementedError.
        """
        raise NotImplementedError(
            "connect_to_exchange non implemente en V1. V1.2 roadmap : "
            "instancier nautilus_trader.adapters.binance.BinanceExecClient + BinanceDataClient, "
            "ou fallback ccxt WebSocket Pro. Voir "
            "docs/superpowers/specs/2026-04-19-nautilus-v12-roadmap.md"
        )

    def send_order_to_exchange(self, order_id: str) -> None:
        """V1.2 : serialize LiveOrder en nautilus.MarketOrder et submit au vrai broker.

        V1 : NotImplementedError.
        """
        raise NotImplementedError(
            "send_order_to_exchange non implemente en V1. V1 delegue a 3Commas webhook. "
            "V1.2 roadmap : conversion LiveOrder -> nautilus MarketOrder + "
            "exec_engine.submit(order). Voir "
            "docs/superpowers/specs/2026-04-19-nautilus-v12-roadmap.md"
        )
