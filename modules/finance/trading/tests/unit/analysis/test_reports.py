"""Tests HTMLReport : generate index.html + metrics.json + equity.png."""
from pathlib import Path

import pandas as pd

from trading.analysis.reports import HTMLReport
from trading.backtest.harnesses.base import HarnessResult, HarnessVerdict


def test_report_writes_html_and_metrics_json(tmp_path: Path) -> None:
    equity = pd.Series(
        [100.0, 101.0, 102.0, 103.0],
        index=pd.date_range("2024-01-01", periods=4, freq="1h"),
    )
    metrics = {"sharpe": 1.2, "max_drawdown": -0.05}
    harnesses = [
        HarnessResult(name="walk_forward", verdict=HarnessVerdict.PASS, metrics={"n_windows": 5})
    ]
    rep = HTMLReport(out_dir=tmp_path)
    out = rep.generate(strategy_name="test", equity=equity, metrics=metrics, harnesses=harnesses)
    assert out.exists()
    assert (tmp_path / "equity.png").exists()
    assert (tmp_path / "metrics.json").exists()
