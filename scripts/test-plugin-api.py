#!/usr/bin/env python3
"""Dependency-light tests for the Hermes Labyrinth plugin API helpers."""

from __future__ import annotations

import asyncio
import importlib.util
import os
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
    constants.get_skills_dir = lambda: TEMP_HOME / "skills"
    constants.get_optional_skills_dir = lambda default=None: Path(default) if default is not None else TEMP_HOME / "optional-skills"
    hermes_cli = types.ModuleType("hermes_cli")
    hermes_cli.__file__ = str(TEMP_HOME / "hermes-source" / "hermes_cli" / "__init__.py")
    sys.modules["fastapi"] = fastapi
    sys.modules["fastapi.responses"] = responses
    sys.modules["hermes_constants"] = constants
    sys.modules["hermes_cli"] = hermes_cli


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


def install_redactor(fn=None) -> None:
    agent = types.ModuleType("agent")
    redact = types.ModuleType("agent.redact")
    if fn is None:
        fn = lambda text: text.replace("sk_live_test_secret", "[REDACTED]")
    redact.redact_sensitive_text = fn
    agent.redact = redact
    sys.modules["agent"] = agent
    sys.modules["agent.redact"] = redact


def remove_redactor() -> None:
    sys.modules.pop("agent.redact", None)
    sys.modules.pop("agent", None)


def install_skill_utils(external_dirs=None, disabled=None) -> None:
    agent = sys.modules.get("agent") or types.ModuleType("agent")
    skill_utils = types.ModuleType("agent.skill_utils")

    def iter_skill_index_files(skills_dir: Path, filename: str):
        matches = sorted(Path(skills_dir).rglob(filename), key=lambda p: str(p.relative_to(skills_dir)))
        for path in matches:
            yield path

    def parse_frontmatter(content: str):
        frontmatter = {}
        body = content
        if content.startswith("---"):
            end = content.find("\n---", 3)
            if end != -1:
                raw = content[3:end].strip()
                body = content[end + 4 :]
                for line in raw.splitlines():
                    if ":" not in line:
                        continue
                    key, value = line.split(":", 1)
                    frontmatter[key.strip()] = value.strip().strip("'\"")
        return frontmatter, body

    skill_utils.get_disabled_skill_names = lambda: set(disabled or [])
    skill_utils.get_external_skills_dirs = lambda: list(external_dirs or [])
    skill_utils.iter_skill_index_files = iter_skill_index_files
    skill_utils.parse_frontmatter = parse_frontmatter
    skill_utils.skill_matches_platform = lambda _frontmatter: True
    agent.skill_utils = skill_utils
    sys.modules["agent"] = agent
    sys.modules["agent.skill_utils"] = skill_utils


def write_skill(root: Path, rel: str, *, name: str, description: str, body: str = "") -> Path:
    path = root / rel / "SKILL.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        f"---\nname: {name}\ndescription: {description}\n---\n{body or description}\n",
        encoding="utf-8",
    )
    return path


def main() -> None:
    api = load_plugin_api()
    os.environ.pop("HERMES_PYTHON_SRC_ROOT", None)

    journeys = api._list_journeys()
    assert_equal(journeys["journeys"], [], "missing state db journeys")
    assert_equal(journeys["total"], 0, "missing state db total")

    health = asyncio.run(api.health())
    assert_equal(health["plugin"], "hermes-labyrinth", "health plugin id")
    assert_equal(health["state_db_exists"], False, "health state db")

    remove_redactor()
    unavailable = api._preview("token sk_live_test_secret")
    assert_equal(unavailable, api.REDACTION_UNAVAILABLE, "redaction import failure closes preview")
    assert_true("sk_live_test_secret" not in unavailable, "redaction import failure does not leak")

    install_redactor()
    redacted = api._preview("token sk_live_test_secret")
    assert_true("[REDACTED]" in redacted, "core redactor is applied")
    assert_true("sk_live_test_secret" not in redacted, "core redactor hides secret")

    install_redactor(lambda _text: (_ for _ in ()).throw(RuntimeError("redactor failed")))
    failed_closed = api._preview("token sk_live_test_secret")
    assert_equal(failed_closed, api.REDACTION_UNAVAILABLE, "redactor exception closes preview")
    assert_true("sk_live_test_secret" not in failed_closed, "redactor exception does not leak")

    install_redactor()
    redacted_journey = api._journey_from_session({
        "id": "j-secret",
        "source": "cli",
        "started_at": 1000,
        "last_active": 1001,
        "title": "debug sk_live_test_secret",
        "preview": "prompt sk_live_test_secret",
    })
    assert_true("sk_live_test_secret" not in redacted_journey["summary"], "journey summary is redacted")
    assert_true("sk_live_test_secret" not in redacted_journey["root_prompt"], "journey prompt is redacted")

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

    source_root = TEMP_HOME / "hermes-source"
    user_root = TEMP_HOME / "skills"
    bundled_root = source_root / "skills"
    optional_root = source_root / "optional-skills"
    external_root = TEMP_HOME / "external-skills"
    write_skill(user_root, "autonomous/codex", name="codex", description="User override")
    write_skill(bundled_root, "autonomous/codex", name="codex", description="Bundled default")
    write_skill(user_root, "dups/one", name="same-root", description="First duplicate")
    write_skill(user_root, "dups/two", name="same-root", description="Second duplicate")
    write_skill(optional_root, "review/code-review", name="code-review", description="Optional review")
    write_skill(external_root, "factory/skill-factory", name="skill-factory", description="External factory")
    write_skill(user_root, "disabled/quiet", name="disabled-one", description="Disabled skill")
    install_skill_utils(external_dirs=[external_root], disabled={"disabled-one"})
    inventory = api._load_skill_inventory()
    by_name = {item["name"]: item for item in inventory["skills"]}
    assert_equal(by_name["codex"]["source"], "user", "user skill shadows bundled skill")
    assert_equal(by_name["code-review"]["source"], "optional", "optional skill source")
    assert_equal(by_name["skill-factory"]["source"], "external", "external skill source")
    assert_equal(by_name["disabled-one"]["enabled"], False, "disabled skill remains listed")
    assert_true(any(item["name"] == "codex" and item["source"] == "bundled" for item in inventory["shadowed"]), "bundled skill is shadowed, not duplicated")
    assert_true(any(item["name"] == "same-root" for item in inventory["duplicates"]), "same-root name collision is a duplicate")
    assert_true(all(item["name"] != "codex" for item in inventory["duplicates"]), "shadowed overrides are excluded from duplicates")

    print("plugin api tests passed")


if __name__ == "__main__":
    main()
