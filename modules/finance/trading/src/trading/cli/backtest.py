"""CLI 'trading backtest' : lance un run single-strategy sur periode donnee."""

from __future__ import annotations

from pathlib import Path
from typing import Annotated

import pandas as pd  # type: ignore[import-untyped]
import typer
from rich.console import Console

from trading.backtest.runner import BacktestRunner
from trading.data.catalog import Catalog
from trading.strategies._examples.ema_cross import EMACrossStrategy

console = Console()
app = typer.Typer()


@app.command("backtest")
def backtest(
    strategy_id: Annotated[str, typer.Argument(help="ex: _examples.ema_cross")] = "_examples.ema_cross",
    venue: Annotated[str, typer.Option()] = "BINANCE",
    symbol: Annotated[str, typer.Option()] = "BTCUSDT",
    timeframe: Annotated[str, typer.Option()] = "1h",
    start: Annotated[str, typer.Option(help="YYYY-MM-DD")] = "2023-01-01",
    end: Annotated[str, typer.Option(help="YYYY-MM-DD")] = "2024-12-31",
    catalog_root: Annotated[Path, typer.Option()] = Path("data/parquet"),
) -> None:
    strat_map = {"_examples.ema_cross": EMACrossStrategy}
    if strategy_id not in strat_map:
        raise typer.BadParameter(f"unknown strategy_id {strategy_id}. Known: {list(strat_map)}")

    catalog = Catalog(root=catalog_root)
    df = catalog.read_ohlcv(venue=venue, symbol=symbol, timeframe=timeframe)
    start_ts = pd.Timestamp(start, tz="UTC")
    end_ts = pd.Timestamp(end, tz="UTC")
    df = df.loc[(df.index >= start_ts) & (df.index <= end_ts)]

    strategy = strat_map[strategy_id]()
    runner = BacktestRunner()
    result = runner.run(strategy, df)

    console.print(f"[bold]Backtest {result.strategy_name}[/bold]")
    console.print(f"  trades: {result.stats['n_trades']}")
    console.print(f"  total_return: {result.stats['total_return']:.2%}")
    console.print(f"  final_equity: ${result.stats['final_equity']:.2f}")
