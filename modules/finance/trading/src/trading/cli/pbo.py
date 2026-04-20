"""CLI 'trading pbo' : Probability of Backtest Overfitting sur equity curves multiples."""

from __future__ import annotations

from pathlib import Path
from typing import Annotated

import pandas as pd  # type: ignore[import-untyped]
import typer
from rich.console import Console

from trading.backtest.harnesses.pbo import PBO

console = Console()
app = typer.Typer()


@app.command("pbo")
def pbo(
    equity_curves: Annotated[
        Path,
        typer.Option(help="Parquet file with columns=strategies, rows=time -> equity per strategy"),
    ] = Path("reports/equity_curves.parquet"),
    s: Annotated[int, typer.Option(help="nombre de splits (pair, Bailey recommande 16)")] = 16,
) -> None:
    if not equity_curves.exists():
        raise typer.BadParameter(f"equity_curves file not found: {equity_curves}")
    curves = pd.read_parquet(equity_curves)
    harness = PBO(s=s)
    result = harness.run(strategy=None, df=curves, config={"equity_curves": curves})
    console.print(f"[bold]{result.name}[/bold] verdict=[{result.verdict.value}]")
    for k, v in result.metrics.items():
        console.print(f"  {k}: {v}")
