"""CLI 'trading download-data' : recupere OHLCV + funding via ccxt/Binance direct."""

from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console
from rich.progress import track

from trading.data.catalog import Catalog
from trading.data.quality import QualityChecker
from trading.data.sources.binance_source import BinanceSource
from trading.data.sources.ccxt_source import CCXTSource

console = Console()
app = typer.Typer(help="Telecharger donnees historiques crypto dans le catalog Parquet local.")


@app.command("download-data")
def download_data(
    source: Annotated[str, typer.Option(help="ccxt | binance-direct")] = "ccxt",
    exchange: Annotated[str, typer.Option(help="ccxt exchange_id (ignore si source=binance-direct)")] = "binance",
    symbols: Annotated[str, typer.Option(help="CSV symbols, ex: BTC/USDT,ETH/USDT")] = "BTC/USDT,ETH/USDT",
    timeframe: Annotated[str, typer.Option(help="1h|4h|1d|...")] = "1h",
    start: Annotated[str, typer.Option(help="YYYY-MM-DD")] = "2021-01-01",
    end: Annotated[str | None, typer.Option(help="YYYY-MM-DD (defaut=today)")] = None,
    market: Annotated[str, typer.Option(help="spot|perp")] = "spot",
    catalog_root: Annotated[Path, typer.Option(help="Dossier catalog")] = Path("data/parquet"),
) -> None:
    """Telecharge et stocke OHLCV (+ funding si perp) dans catalog_root/<venue>/<symbol>/<tf>.parquet."""
    start_dt = datetime.fromisoformat(start).replace(tzinfo=UTC)
    end_dt = (
        datetime.fromisoformat(end).replace(tzinfo=UTC)
        if end
        else datetime.now(tz=UTC)
    )

    if source == "ccxt":
        data_source: CCXTSource | BinanceSource = CCXTSource(
            exchange_id=exchange if market == "spot" else f"{exchange}usdm"
        )
        venue = exchange.upper()
    elif source == "binance-direct":
        data_source = BinanceSource(market="spot" if market == "spot" else "perp")
        venue = "BINANCE"
    else:
        raise typer.BadParameter(f"unknown source {source}")

    catalog = Catalog(root=catalog_root)
    checker = QualityChecker(timeframe=timeframe)  # type: ignore[arg-type]

    symbol_list = [s.strip() for s in symbols.split(",") if s.strip()]
    for symbol in track(symbol_list, description="Downloading"):
        console.print(f"[cyan]{venue}[/cyan] {symbol} {timeframe} {start_dt.date()}..{end_dt.date()}")
        try:
            df = data_source.fetch_ohlcv(symbol, timeframe, start_dt, end_dt)
        except Exception as exc:  # noqa: BLE001
            console.print(f"  [red]FAIL[/red] {symbol}: {exc}")
            continue

        report = checker.check(df, symbol=symbol)
        if not report.passed:
            console.print(f"  [yellow]WARN[/yellow] quality issues: {report.issues}")

        sym_key = symbol.replace("/", "")
        path = catalog.write_ohlcv(df=df, venue=venue, symbol=sym_key, timeframe=timeframe)
        console.print(f"  [green]OK[/green] {len(df)} bars -> {path}")

        if market == "perp":
            try:
                funding_df = data_source.fetch_funding(symbol, start_dt, end_dt)
                if not funding_df.empty:
                    funding_path = catalog.root / venue / sym_key / f"{timeframe}_funding.parquet"
                    funding_path.parent.mkdir(parents=True, exist_ok=True)
                    funding_df.to_parquet(funding_path)
                    console.print(f"  [green]OK[/green] {len(funding_df)} funding -> {funding_path}")
            except Exception as exc:  # noqa: BLE001
                console.print(f"  [yellow]WARN[/yellow] funding fetch: {exc}")
