"""3Commas REST API wrapper minimal : list_bots + start_deal."""

from __future__ import annotations

import hashlib
import hmac
from dataclasses import dataclass, field
from typing import Any, cast

import httpx

BASE_URL = "https://api.3commas.io/public/api"


@dataclass
class ThreeCommasAPI:
    api_key: str
    api_secret: str
    _client: Any = field(default=None, repr=False)

    def __post_init__(self) -> None:
        if self._client is None:
            self._client = httpx.Client(timeout=30.0)

    def _signed_request(
        self, method: str, path: str, params: dict[str, Any] | None = None
    ) -> Any:
        url = f"{BASE_URL}{path}"
        query = httpx.QueryParams(params or {})
        sig_payload = f"{path}?{query}" if query else path
        signature = hmac.new(
            self.api_secret.encode(),
            sig_payload.encode(),
            hashlib.sha256,
        ).hexdigest()
        headers = {
            "APIKEY": self.api_key,
            "Signature": signature,
        }
        resp = self._client.request(method, url, params=query, headers=headers)
        resp.raise_for_status()
        return resp.json()

    def list_bots(self) -> list[dict[str, Any]]:
        return cast(list[dict[str, Any]], self._signed_request("GET", "/ver1/bots"))

    def start_deal(self, bot_id: int, pair: str) -> dict[str, Any]:
        return cast(
            dict[str, Any],
            self._signed_request(
                "POST",
                f"/ver1/bots/{bot_id}/start_new_deal",
                {"pair": pair},
            ),
        )
