"""Tests Harness protocol + HarnessResult dataclass."""
from trading.backtest.harnesses.base import HarnessResult, HarnessVerdict


def test_verdict_values() -> None:
    assert HarnessVerdict.PASS.value == "PASS"
    assert HarnessVerdict.WARN.value == "WARN"
    assert HarnessVerdict.FAIL.value == "FAIL"


def test_harness_result_dataclass() -> None:
    r = HarnessResult(name="walk_forward", verdict=HarnessVerdict.PASS, metrics={"sharpe_oos": 1.2})
    assert r.name == "walk_forward"
    assert r.verdict == HarnessVerdict.PASS
    assert r.metrics == {"sharpe_oos": 1.2}
    assert r.artifacts == []
