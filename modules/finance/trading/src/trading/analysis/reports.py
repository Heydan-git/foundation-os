"""HTMLReport : tearsheet custom (templates Jinja + equity PNG matplotlib headless)."""

from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")  # headless, avant import pyplot
import matplotlib.pyplot as plt
import pandas as pd  # type: ignore[import-untyped]
from jinja2 import Environment, FileSystemLoader

from trading.backtest.harnesses.base import HarnessResult, HarnessVerdict


@dataclass
class HTMLReport:
    out_dir: Path

    def generate(
        self,
        *,
        strategy_name: str,
        equity: pd.Series,
        metrics: dict[str, float],
        harnesses: list[HarnessResult],
    ) -> Path:
        self.out_dir.mkdir(parents=True, exist_ok=True)

        fig, ax = plt.subplots(figsize=(10, 4))
        equity.plot(ax=ax)
        ax.set_title(f"{strategy_name} — equity curve")
        ax.grid(True)
        fig.tight_layout()
        eq_png = self.out_dir / "equity.png"
        fig.savefig(eq_png, dpi=80)
        plt.close(fig)

        order = {HarnessVerdict.PASS: 0, HarnessVerdict.WARN: 1, HarnessVerdict.FAIL: 2}
        overall = (
            max(harnesses, key=lambda h: order[h.verdict]).verdict
            if harnesses
            else HarnessVerdict.WARN
        )

        env = Environment(
            loader=FileSystemLoader(Path(__file__).parent / "templates"),
            autoescape=True,
        )
        template = env.get_template("tearsheet.html.j2")
        html = template.render(
            strategy_name=strategy_name,
            generated_at=datetime.now(tz=UTC).isoformat(),
            overall_verdict=overall.value,
            metrics={
                k: f"{v:.4f}" if isinstance(v, float) else v for k, v in metrics.items()
            },
            harnesses=[
                {"name": h.name, "verdict": h.verdict.value, "metrics": h.metrics}
                for h in harnesses
            ],
            equity_png="equity.png",
        )
        out_html = self.out_dir / "index.html"
        out_html.write_text(html, encoding="utf-8")

        (self.out_dir / "metrics.json").write_text(
            json.dumps(
                {
                    "metrics": metrics,
                    "harnesses": [
                        {"name": h.name, "verdict": h.verdict.value, "metrics": h.metrics}
                        for h in harnesses
                    ],
                },
                indent=2,
                default=str,
            ),
            encoding="utf-8",
        )

        return out_html
