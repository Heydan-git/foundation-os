"""Point d'entree CLI Typer unifie pour le module trading."""

import typer

from trading import __version__
from trading.cli import download as download_cli

app = typer.Typer(
    name="trading",
    help="Foundation OS — backtest engine crypto + Pine bridge + 3Commas.",
    no_args_is_help=True,
)

app.add_typer(download_cli.app, name="")  # commands mountes a la racine


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
