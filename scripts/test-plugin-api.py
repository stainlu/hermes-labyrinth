#!/usr/bin/env python3
"""Dependency-light tests for the Hermes Labyrinth plugin API helpers."""

from __future__ import annotations

import asyncio
import importlib.util
import sys
import tempfile
import types
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TEMP_HOME = Path(tempfile.mkdtemp(prefix="hermes-labyrinth-api-"))


class HTTPException(Exception):
    def __init__(self, status_code: int, detail: str):
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


class PlainTextResponse:
    pass


class APIRouter:
    def get(self, *_args, **_kwargs):
        def decorator(fn):
            return fn

        return decorator


def install_stubs() -> None:
    fastapi = types.ModuleType("fastapi")
    fastapi.APIRouter = APIRouter
    fastapi.HTTPException = HTTPException
    responses = types.ModuleType("fastapi.responses")
    responses.PlainTextResponse = PlainTextResponse
    constants = types.ModuleType("hermes_constants")
    constants.get_hermes_home = lambda: TEMP_HOME
    sys.modules["fastapi"] = fastapi
    sys.modules["fastapi.responses"] = responses
    sys.modules["hermes_constants"] = constants


def load_plugin_api():
    install_stubs()
    spec = importlib.util.spec_from_file_location("hermes_labyrinth_plugin_api", ROOT / "dashboard" / "plugin_api.py")
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def assert_equal(actual, expected, label: str) -> None:
    if actual != expected:
        raise AssertionError(f"{label}: expected {expected!r}, got {actual!r}")


def assert_true(value, label: str) -> None:
    if not value:
        raise AssertionError(label)


def main() -> None:
    api = load_plugin_api()

    journeys = api._list_journeys()
    assert_equal(journeys["journeys"], [], "missing state db journeys")
    assert_equal(journeys["total"], 0, "missing state db total")

    health = asyncio.run(api.health())
    assert_equal(health["plugin"], "hermes-labyrinth", "health plugin id")
    assert_equal(health["state_db_exists"], False, "health state db")

    user_crossings = api._message_to_crossings("j1", {
        "id": 1,
        "role": "user",
        "timestamp": 1000,
        "content": "Please inspect the billing parser.",
    }, 0)
    assert_equal(user_crossings[0]["type"], "prompt", "user crossing type")
    assert_equal(user_crossings[0]["actor"], "user", "user crossing actor")

    assistant_crossings = api._message_to_crossings("j1", {
        "id": 2,
        "role": "assistant",
        "timestamp": 1001,
        "content": "I will inspect the file.",
        "tool_calls": [
            {"function": {"name": "read_file", "arguments": "{\"path\":\"parser.py\"}"}},
            {"function": {"name": "delegate_task", "arguments": {"task": "write regression"}}},
            {"function": {"name": "request_approval", "arguments": {"reason": "write patch"}}},
        ],
    }, 1)
    types_seen = [item["type"] for item in assistant_crossings]
    assert_true("tool_call" in types_seen, "assistant tool call crossing")
    assert_true("subagent_spawn" in types_seen, "assistant delegate crossing")
    assert_true("approval" in types_seen, "assistant approval crossing")
    assert_true("assistant_response" in types_seen, "assistant response crossing")

    failed_tool = api._message_to_crossings("j1", {
        "id": 3,
        "role": "tool",
        "timestamp": 1002,
        "tool_name": "run_python",
        "content": "Traceback: KeyError",
    }, 2)[0]
    assert_equal(failed_tool["status"], "failed", "tool failure status")

    threads = api._threads_from_crossings(assistant_crossings + [failed_tool])
    thread_ids = {item["thread_id"] for item in threads}
    assert_true({"main", "tools", "delegation", "thresholds"}.issubset(thread_ids), "thread buckets")

    guideposts = api._guideposts_for({
        "journey_id": "j1",
        "model_sequence": ["hermes-4-70b"],
        "tool_call_count": 12,
        "duration_ms": 31 * 60 * 1000,
    }, [
        {**failed_tool, "crossing_id": "c1", "target": "run_python"},
        {**failed_tool, "crossing_id": "c2", "target": "run_python"},
    ])
    titles = [item["title"] for item in guideposts]
    assert_true(any("Long journey" in title for title in titles), "long journey guidepost")
    assert_true(any("High tool-call" in title for title in titles), "tool-call guidepost")
    assert_true(any("Repeated failing tool" in title for title in titles), "loop guidepost")

    print("plugin api tests passed")


if __name__ == "__main__":
    main()
