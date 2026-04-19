from trading.backtest.latency import LatencySimulator


def test_latency_in_range() -> None:
    sim = LatencySimulator(min_ms=100, max_ms=200, seed=42)
    samples = [sim.draw_ms() for _ in range(1000)]
    assert min(samples) >= 100
    assert max(samples) <= 200


def test_latency_deterministic_with_seed() -> None:
    s1 = LatencySimulator(seed=1).draw_ms()
    s2 = LatencySimulator(seed=1).draw_ms()
    assert s1 == s2
