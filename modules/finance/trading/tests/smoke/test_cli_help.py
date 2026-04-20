"""Smoke test : CLI 'trading --help' doit retourner exit 0."""
from typer.testing import CliRunner

from trading.cli.main import app

runner = CliRunner()


def test_cli_help_returns_zero() -> None:
    result = runner.invoke(app, ["--help"])
    assert result.exit_code == 0
    assert "trading" in result.stdout.lower()


def test_cli_version_flag_returns_zero() -> None:
    result = runner.invoke(app, ["--version"])
    assert result.exit_code == 0
    assert "0.1.0" in result.stdout
