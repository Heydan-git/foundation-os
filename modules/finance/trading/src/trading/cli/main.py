"""Point d'entree CLI Typer unifie pour le module trading."""

import typer

from trading import __version__
from trading.cli import backtest as backtest_cli
from trading.cli import download as download_cli
from trading.cli import montecarlo as mc_cli
from trading.cli import pbo as pbo_cli
from trading.cli import pine as pine_cli
from trading.cli import walkforward as wf_cli

app = typer.Typer(
    name="trading",
    help="Foundation OS — backtest engine crypto + Pine bridge + 3Commas.",
    no_args_is_help=True,
)

app.add_typer(download_cli.app, name="")
app.add_typer(backtest_cli.app, name="")
app.add_typer(wf_cli.app, name="")
app.add_typer(mc_cli.app, name="")
app.add_typer(pbo_cli.app, name="")
app.add_typer(pine_cli.app, name="")


def _version_callback(value: bool) -> None:
    if value:
        typer.echo(f"trading {__version__}")
        raise typer.Exit()


@app.callback()
def main(
    version: bool = typer.Option(
        False,
        "--version",
        callback=_version_callback,
        is_eager=True,
        help="Afficher la version et quitter.",
    ),
) -> None:
    """Racine CLI trading."""
