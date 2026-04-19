"""CLI 'trading generate-pine' : Strategy Python -> Pine v5 source file."""

from __future__ import annotations

from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console

from trading.execution.pine.generator import PineGenerator
from trading.strategies._examples.ema_cross import EMACrossStrategy

console = Console()
app = typer.Typer()


@app.command("generate-pine")
def generate_pine(
    strategy_id: Annotated[str, typer.Argument()] = "_examples.ema_cross",
    ema_fast: Annotated[int, typer.Option()] = 10,
    ema_slow: Annotated[int, typer.Option()] = 30,
    out: Annotated[Path, typer.Option()] = Path("strategies/pine/ema_cross.pine"),
) -> None:
    if strategy_id == "_examples.ema_cross":
        strategy = EMACrossStrategy(ema_fast=ema_fast, ema_slow=ema_slow)
    else:
        raise typer.BadParameter(f"unknown strategy_id {strategy_id}")

    gen = PineGenerator()
    source = gen.generate(strategy)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(source, encoding="utf-8")
    console.print(f"[green]OK[/green] Pine source -> {out} ({len(source)} chars)")
