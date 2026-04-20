"""PineGenerator : BaseStrategy -> Pine v5 source via templates Jinja2."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from jinja2 import Environment, FileSystemLoader

from trading.strategies.base import BaseStrategy

TEMPLATE_MAP: dict[str, str] = {
    "ema_cross": "ema_cross.pine.j2",
}


def _default_templates_dir() -> Path:
    return Path(__file__).parent / "templates"


@dataclass
class PineGenerator:
    templates_dir: Path = field(default_factory=_default_templates_dir)

    def _template_for(self, strategy: BaseStrategy) -> str:
        # strategy.metadata.name format : "<family>_<variant>_..."
        parts = strategy.metadata.name.split("_")
        if len(parts) < 2:
            raise ValueError(
                f"no Pine template for strategy name {strategy.metadata.name!r}"
            )
        key = "_".join(parts[:2])  # ex: "ema_cross"
        if key not in TEMPLATE_MAP:
            raise ValueError(
                f"no Pine template for strategy family {key!r} "
                f"(available: {list(TEMPLATE_MAP)})"
            )
        return TEMPLATE_MAP[key]

    def generate(self, strategy: BaseStrategy) -> str:
        template_file = self._template_for(strategy)
        env = Environment(
            loader=FileSystemLoader(self.templates_dir),
            keep_trailing_newline=True,
        )
        template = env.get_template(template_file)
        return template.render(**strategy.to_pine_context())
