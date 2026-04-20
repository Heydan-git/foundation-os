"""Tests NautilusLiveEngine : lifecycle + order tracking (in-memory only, NO broker)."""
from datetime import UTC, datetime

import pytest

from trading.backtest.nautilus_bridge.types import OrderIntent
from trading.execution.live.kill_switch import KillSwitch
from trading.execution.live.nautilus_live import (
    LiveFill,
    LiveOrder,
    LivePosition,
    NautilusLiveEngine,
)


def test_initial_state_stopped() -> None:
    engine = NautilusLiveEngine(venue="BINANCE")
    assert not engine.is_running()
    assert engine.open_orders == {}
    assert engine.positions == {}


def test_start_sets_running() -> None:
    engine = NautilusLiveEngine(venue="BINANCE")
    engine.start()
    assert engine.is_running()


def test_stop_clears_running() -> None:
    engine = NautilusLiveEngine(venue="BINANCE")
    engine.start()
    engine.stop()
    assert not engine.is_running()


def test_pause_resume() -> None:
    engine = NautilusLiveEngine(venue="BINANCE")
    engine.start()
    engine.pause()
    assert engine.is_paused()
    engine.resume()
    assert not engine.is_paused()
    assert engine.is_running()


def test_submit_order_tracks_locally() -> None:
    engine = NautilusLiveEngine(venue="BINANCE")
    engine.start()
    intent = OrderIntent(
        instrument_id="BTCUSDT.BINANCE",
        ts=datetime(2024, 1, 1, tzinfo=UTC),
        side="BUY",
        quantity=0.1,
    )
    order_id = engine.submit_order(intent)
    assert order_id in engine.open_orders
    assert isinstance(engine.open_orders[order_id], LiveOrder)
    assert engine.open_orders[order_id].side == "BUY"
    assert engine.open_orders[order_id].status == "PENDING"


def test_submit_order_refused_when_kill_switch_active() -> None:
    ks = KillSwitch()
    ks.activate("test")
    engine = NautilusLiveEngine(venue="BINANCE", kill_switch=ks)
    engine.start()
    intent = OrderIntent(
        instrument_id="X",
        ts=datetime(2024, 1, 1, tzinfo=UTC),
        side="BUY",
        quantity=1.0,
    )
    with pytest.raises(RuntimeError, match="kill-switch active"):
        engine.submit_order(intent)


def test_submit_order_refused_when_not_running() -> None:
    engine = NautilusLiveEngine(venue="BINANCE")
    intent = OrderIntent(
        instrument_id="X",
        ts=datetime(2024, 1, 1, tzinfo=UTC),
        side="BUY",
        quantity=1.0,
    )
    with pytest.raises(RuntimeError, match="not running"):
        engine.submit_order(intent)


def test_on_fill_updates_position() -> None:
    engine = NautilusLiveEngine(venue="BINANCE")
    engine.start()
    intent = OrderIntent(
        instrument_id="BTCUSDT.BINANCE",
        ts=datetime(2024, 1, 1, tzinfo=UTC),
        side="BUY",
        quantity=0.5,
    )
    order_id = engine.submit_order(intent)
    fill = LiveFill(
        order_id=order_id,
        ts=datetime(2024, 1, 1, 0, 1, tzinfo=UTC),
        fill_price=42_000.0,
        fill_quantity=0.5,
    )
    engine.on_fill(fill)
    # Order closed
    assert order_id not in engine.open_orders
    # Position opened
    assert "BTCUSDT.BINANCE" in engine.positions
    pos = engine.positions["BTCUSDT.BINANCE"]
    assert isinstance(pos, LivePosition)
    assert pos.quantity == 0.5
    assert pos.avg_price == 42_000.0


def test_connect_to_real_broker_raises_not_implemented() -> None:
    engine = NautilusLiveEngine(venue="BINANCE")
    with pytest.raises(NotImplementedError, match="V1.2"):
        engine.connect_to_exchange(api_key="fake", api_secret="fake")


def test_send_order_to_exchange_raises_not_implemented() -> None:
    engine = NautilusLiveEngine(venue="BINANCE")
    engine.start()
    intent = OrderIntent(
        instrument_id="X",
        ts=datetime(2024, 1, 1, tzinfo=UTC),
        side="BUY",
        quantity=1.0,
    )
    order_id = engine.submit_order(intent)
    with pytest.raises(NotImplementedError, match="V1.2"):
        engine.send_order_to_exchange(order_id)
