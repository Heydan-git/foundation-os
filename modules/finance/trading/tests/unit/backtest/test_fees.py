from trading.backtest.fees import FeeSchedule


def test_binance_spot_vip0() -> None:
    s = FeeSchedule(venue="BINANCE", market="spot", tier="VIP0")
    assert s.maker() == 0.001
    assert s.taker() == 0.001


def test_binance_perp_vip0() -> None:
    s = FeeSchedule(venue="BINANCE", market="perp", tier="VIP0")
    assert s.maker() == 0.0002
    assert s.taker() == 0.0005
