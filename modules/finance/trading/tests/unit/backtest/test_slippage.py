from trading.backtest.slippage import VolatilityBasedSlippage


def test_slippage_scales_with_atr() -> None:
    model = VolatilityBasedSlippage(base_bps=2.0, atr_multiplier=0.5)
    low_vol = model.compute_bps(atr_ratio=0.001, order_notional=10_000, avg_volume_notional=1_000_000)
    high_vol = model.compute_bps(atr_ratio=0.01, order_notional=10_000, avg_volume_notional=1_000_000)
    assert high_vol > low_vol


def test_slippage_scales_with_order_size() -> None:
    model = VolatilityBasedSlippage(base_bps=2.0, size_impact=1.0)
    small = model.compute_bps(atr_ratio=0.005, order_notional=1_000, avg_volume_notional=1_000_000)
    large = model.compute_bps(atr_ratio=0.005, order_notional=100_000, avg_volume_notional=1_000_000)
    assert large > small
