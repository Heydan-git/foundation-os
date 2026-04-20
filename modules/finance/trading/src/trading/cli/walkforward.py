"""CLI 'trading walk-forward'."""

from __future__ import annotations

from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console

from trading.backtest.harnesses.walk_forward import WalkForward
from trading.data.catalog import Catalog
from trading.strategies._examples.ema_cross import EMACrossStrategy

console = Console()
app = typer.Typer()


@app.command("walk-forward")
def walk_forward(
    strategy_id: Annotated[str, typer.Argument()] = "_examples.ema_cross",
    venue: Annotated[str, typer.Option()] = "BINANCE",
    symbol: Annotated[str, typer.Option()] = "BTCUSDT",
    timeframe: Annotated[str, typer.Option()] = "1h",
    train_bars: Annotated[int, typer.Option()] = 500,
    test_bars: Annotated[int, typer.Option()] = 200,
    embargo_bars: Annotated[int, typer.Option()] = 24,
    catalog_root: Annotated[Path, typer.Option()] = Path("data/parquet"),
) -> None:
    if strategy_id != "_examples.ema_cross":
        raise typer.BadParameter(f"unknown strategy_id {strategy_id}")
    cat = Catalog(root=catalog_root)
    df = cat.read_ohlcv(venue=venue, symbol=symbol, timeframe=timeframe)
    strategy = EMACrossStrategy()
    wf = WalkForward(train_bars=train_bars, test_bars=test_bars, embargo_bars=embargo_bars)
    result = wf.run(strategy, df, config={})
    console.print(f"[bold]{result.name}[/bold] verdict=[{result.verdict.value}]")
    for k, v in result.metrics.items():
        console.print(f"  {k}: {v}")
