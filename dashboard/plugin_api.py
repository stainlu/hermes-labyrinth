"""Hermes Labyrinth dashboard plugin API.

Mounted at /api/plugins/hermes-labyrinth/ by the dashboard plugin system.

The plugin is intentionally read-only. It normalizes existing Hermes state into
journeys, crossings, guideposts, skills, cron gates, and exportable reports.
"""

from __future__ import annotations

import json
import re
import time
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

from hermes_constants import get_hermes_home

router = APIRouter()

PLUGIN_VERSION = "0.1.0"
PROJECT_ROOT = Path(__file__).resolve().parents[3]
PREVIEW_LIMIT = 360
LONG_TOOL_SECONDS = 45
LONG_JOURNEY_SECONDS = 30 * 60


def _now() -> float:
    return time.time()


def _redact(value: Any) -> str:
    text = value if isinstance(value, str) else json.dumps(value, ensure_ascii=True, default=str)
    try:
        from agent.redact import redact_sensitive_text

        text = redact_sensitive_text(text)
    except Exception:
        pass
    return text


def _preview(value: Any, limit: int = PREVIEW_LIMIT) -> str:
    if value is None:
        return ""
    text = _redact(value)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > limit:
        return text[: limit - 3] + "..."
    return text


def _parse_json_maybe(value: Any) -> Any:
    if value is None or isinstance(value, (dict, list)):
        return value
    if not isinstance(value, str):
        return value
    try:
        return json.loads(value)
    except Exception:
        return value


def _db():
    from hermes_state import SessionDB

    return SessionDB()


def _state_db_exists() -> bool:
    return (get_hermes_home() / "state.db").exists()


def _status_from_session(session: Dict[str, Any]) -> str:
    if session.get("ended_at") is None:
        last = float(session.get("last_active") or session.get("started_at") or 0)
        if _now() - last < 300:
            return "active"
        return "open"
    reason = str(session.get("end_reason") or "").lower()
    if "error" in reason or "fail" in reason:
        return "failed"
    if reason in {"interrupt", "interrupted", "cancelled", "canceled"}:
        return "interrupted"
    return "complete"


def _journey_from_session(session: Dict[str, Any]) -> Dict[str, Any]:
    started = session.get("started_at")
    ended = session.get("ended_at")
    duration_ms = None
    if isinstance(started, (int, float)):
        end_value = ended if isinstance(ended, (int, float)) else session.get("last_active") or _now()
        duration_ms = max(0, int((float(end_value) - float(started)) * 1000))
    return {
        "journey_id": session.get("id"),
        "source": session.get("source") or "unknown",
        "status": _status_from_session(session),
        "started_at": started,
        "ended_at": ended,
        "last_active": session.get("last_active") or started,
        "duration_ms": duration_ms,
        "summary": session.get("title") or session.get("preview") or "",
        "root_prompt": session.get("preview") or "",
        "parent_journey_id": session.get("parent_session_id"),
        "model_sequence": [session.get("model")] if session.get("model") else [],
        "model": session.get("model"),
        "message_count": session.get("message_count") or 0,
        "tool_call_count": session.get("tool_call_count") or 0,
        "api_call_count": session.get("api_call_count") or 0,
        "estimated_cost": session.get("estimated_cost_usd"),
        "actual_cost": session.get("actual_cost_usd"),
        "cost_status": session.get("cost_status"),
        "end_reason": session.get("end_reason"),
        "token_counts": {
            "input": session.get("input_tokens") or 0,
            "output": session.get("output_tokens") or 0,
            "cache_read": session.get("cache_read_tokens") or 0,
            "cache_write": session.get("cache_write_tokens") or 0,
            "reasoning": session.get("reasoning_tokens") or 0,
        },
    }


def _list_journeys(limit: int = 25, offset: int = 0, include_children: bool = True) -> Dict[str, Any]:
    if not _state_db_exists():
        return {
            "journeys": [],
            "total": 0,
            "limit": limit,
            "offset": offset,
            "generated_at": _now(),
        }
    db = _db()
    try:
        sessions = db.list_sessions_rich(
            limit=max(1, min(limit, 100)),
            offset=max(0, offset),
            include_children=include_children,
            project_compression_tips=False,
        )
        total = db.session_count()
        journeys = [_journey_from_session(s) for s in sessions]
        return {
            "journeys": journeys,
            "total": total,
            "limit": limit,
            "offset": offset,
            "generated_at": _now(),
        }
    finally:
        db.close()


def _extract_tool_call(call: Any) -> Dict[str, Any]:
    call = _parse_json_maybe(call)
    if not isinstance(call, dict):
        return {"name": "unknown_tool", "arguments": call, "raw": call}
    fn = call.get("function") if isinstance(call.get("function"), dict) else {}
    name = (
        fn.get("name")
        or call.get("name")
        or call.get("tool_name")
        or call.get("type")
        or "unknown_tool"
    )
    args = fn.get("arguments")
    if args is None:
        args = call.get("arguments") or call.get("args") or call.get("input")
    return {
        "name": str(name),
        "arguments": _parse_json_maybe(args),
        "id": call.get("id") or call.get("tool_call_id"),
        "raw": call,
    }


def _message_status(message: Dict[str, Any], content: str) -> str:
    lowered = content.lower()
    finish = str(message.get("finish_reason") or "").lower()
    if "error" in lowered or "traceback" in lowered or "exception" in lowered:
        return "failed"
    if "denied" in lowered or "cancelled" in lowered or "canceled" in lowered:
        return "interrupted"
    if finish in {"error", "length", "content_filter"}:
        return "failed"
    return "complete"


def _message_to_crossings(session_id: str, message: Dict[str, Any], index: int) -> List[Dict[str, Any]]:
    role = message.get("role") or "unknown"
    timestamp = message.get("timestamp")
    content = message.get("content") or ""
    msg_id = message.get("id")
    base = {
        "journey_id": session_id,
        "started_at": timestamp,
        "ended_at": timestamp,
        "duration_ms": None,
        "evidence_refs": [{"kind": "message", "id": msg_id}],
    }
    crossings: List[Dict[str, Any]] = []

    if role == "user":
        crossings.append({
            **base,
            "crossing_id": f"m{msg_id or index}-user",
            "type": "prompt",
            "label": "User prompt",
            "status": "complete",
            "actor": "user",
            "target": "agent_loop",
            "inputs_preview": _preview(content),
            "outputs_preview": "",
        })
        return crossings

    if role == "assistant":
        raw_tool_calls = _parse_json_maybe(message.get("tool_calls")) or []
        if isinstance(raw_tool_calls, dict):
            raw_tool_calls = [raw_tool_calls]
        for call_index, call in enumerate(raw_tool_calls if isinstance(raw_tool_calls, list) else []):
            tool = _extract_tool_call(call)
            name = tool["name"]
            crossing_type = "subagent_spawn" if name == "delegate_task" else "tool_call"
            if "approval" in name:
                crossing_type = "approval"
            crossings.append({
                **base,
                "crossing_id": f"m{msg_id or index}-tool-call-{call_index}",
                "type": crossing_type,
                "label": name,
                "status": "complete",
                "actor": "agent",
                "target": name,
                "inputs_preview": _preview(tool.get("arguments")),
                "outputs_preview": "",
            })
        if content.strip():
            crossings.append({
                **base,
                "crossing_id": f"m{msg_id or index}-assistant",
                "type": "assistant_response",
                "label": "Assistant response",
                "status": _message_status(message, content),
                "actor": "agent",
                "target": "user",
                "inputs_preview": "",
                "outputs_preview": _preview(content),
            })
        return crossings

    if role == "tool":
        tool_name = message.get("tool_name") or "tool_result"
        crossing_type = "subagent_return" if tool_name == "delegate_task" else "tool_result"
        status = _message_status(message, content)
        crossings.append({
            **base,
            "crossing_id": f"m{msg_id or index}-tool-result",
            "type": crossing_type,
            "label": tool_name,
            "status": status,
            "actor": tool_name,
            "target": "agent",
            "inputs_preview": "",
            "outputs_preview": _preview(content),
        })
        return crossings

    crossings.append({
        **base,
        "crossing_id": f"m{msg_id or index}-{role}",
        "type": f"{role}_message",
        "label": f"{role} message",
        "status": _message_status(message, content),
        "actor": role,
        "target": "session",
        "inputs_preview": _preview(content),
        "outputs_preview": "",
    })
    return crossings


def _crossings_for_session(session_id: str) -> Dict[str, Any]:
    if not _state_db_exists():
        raise HTTPException(status_code=404, detail="Hermes state database not found")
    db = _db()
    try:
        sid = db.resolve_session_id(session_id)
        if not sid:
            raise HTTPException(status_code=404, detail="Journey not found")
        session = db.get_session(sid)
        if not session:
            raise HTTPException(status_code=404, detail="Journey not found")
        messages = db.get_messages(sid)
        crossings: List[Dict[str, Any]] = []
        for index, message in enumerate(messages):
            crossings.extend(_message_to_crossings(sid, message, index))
        if session.get("end_reason") == "compression":
            crossings.append({
                "crossing_id": "session-context-compression",
                "journey_id": sid,
                "type": "context_compression",
                "label": "Context compression",
                "started_at": session.get("ended_at"),
                "ended_at": session.get("ended_at"),
                "duration_ms": None,
                "status": "complete",
                "actor": "agent",
                "target": "next_context",
                "inputs_preview": "",
                "outputs_preview": "Session ended through context compression.",
                "evidence_refs": [{"kind": "session", "id": sid, "field": "end_reason"}],
            })
        threads = _threads_from_crossings(crossings)
        return {
            "journey_id": sid,
            "crossings": crossings,
            "threads": threads,
            "generated_at": _now(),
        }
    finally:
        db.close()


def _threads_from_crossings(crossings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    buckets: Dict[str, List[str]] = defaultdict(list)
    for crossing in crossings:
        typ = crossing.get("type") or "unknown"
        if typ in {"tool_call", "tool_result"}:
            key = "tools"
        elif typ in {"subagent_spawn", "subagent_return"}:
            key = "delegation"
        elif typ in {"approval", "context_compression"}:
            key = "thresholds"
        else:
            key = "main"
        buckets[key].append(crossing["crossing_id"])
    labels = {
        "main": "Main passage",
        "tools": "Tool passage",
        "delegation": "Delegation passage",
        "thresholds": "Threshold passage",
    }
    return [
        {"thread_id": key, "label": labels.get(key, key), "crossing_ids": ids}
        for key, ids in buckets.items()
    ]


def _guideposts_for(journey: Dict[str, Any], crossings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    guideposts: List[Dict[str, Any]] = []

    def add(kind: str, severity: str, title: str, evidence: Iterable[Any], detail: str = ""):
        guideposts.append({
            "kind": kind,
            "severity": severity,
            "title": title,
            "detail": detail,
            "evidence_refs": list(evidence),
        })

    if not journey.get("model_sequence"):
        add("missing_data", "info", "Model not recorded", [{"kind": "session", "id": journey["journey_id"], "field": "model"}])

    if journey.get("parent_journey_id"):
        add(
            "delegation",
            "info",
            "Child journey",
            [{"kind": "session", "id": journey["journey_id"], "field": "parent_session_id"}],
            "This journey has a parent session.",
        )

    if journey.get("end_reason") == "compression":
        add(
            "context",
            "info",
            "Context compression occurred",
            [{"kind": "session", "id": journey["journey_id"], "field": "end_reason"}],
        )

    duration_ms = journey.get("duration_ms")
    if isinstance(duration_ms, int) and duration_ms > LONG_JOURNEY_SECONDS * 1000:
        add(
            "duration",
            "notice",
            "Long journey",
            [{"kind": "session", "id": journey["journey_id"], "field": "duration_ms"}],
            f"Duration exceeded {LONG_JOURNEY_SECONDS // 60} minutes.",
        )

    if (journey.get("tool_call_count") or 0) >= 10:
        add(
            "tooling",
            "notice",
            "High tool-call journey",
            [{"kind": "session", "id": journey["journey_id"], "field": "tool_call_count"}],
        )

    failures = [c for c in crossings if c.get("status") == "failed"]
    if failures:
        add(
            "failure",
            "warning",
            f"{len(failures)} failed crossing(s)",
            [{"kind": "crossing", "id": c["crossing_id"]} for c in failures[:8]],
        )

    tool_failures = Counter(c.get("target") or c.get("label") for c in failures if c.get("type") == "tool_result")
    for tool, count in tool_failures.items():
        if count > 1:
            add(
                "loop",
                "warning",
                f"Repeated failing tool: {tool}",
                [{"kind": "tool", "name": tool}],
                f"{count} failed results were observed.",
            )

    if any(c.get("type") == "subagent_spawn" for c in crossings):
        add(
            "delegation",
            "info",
            "Delegation boundary crossed",
            [{"kind": "crossing", "id": c["crossing_id"]} for c in crossings if c.get("type") == "subagent_spawn"],
        )

    if any(c.get("type") == "approval" for c in crossings):
        add(
            "approval",
            "notice",
            "Approval boundary crossed",
            [{"kind": "crossing", "id": c["crossing_id"]} for c in crossings if c.get("type") == "approval"],
        )

    return guideposts


def _get_journey_detail(session_id: str) -> Dict[str, Any]:
    if not _state_db_exists():
        raise HTTPException(status_code=404, detail="Hermes state database not found")
    db = _db()
    try:
        sid = db.resolve_session_id(session_id)
        if not sid:
            raise HTTPException(status_code=404, detail="Journey not found")
        session = db.get_session(sid)
        if not session:
            raise HTTPException(status_code=404, detail="Journey not found")
        rich = db._get_session_rich_row(sid) or session
        journey = _journey_from_session({**session, **rich})
        children = db.list_sessions_rich(
            limit=50,
            offset=0,
            include_children=True,
            project_compression_tips=False,
        )
        child_journeys = [
            _journey_from_session(s)
            for s in children
            if s.get("parent_session_id") == sid
        ]
    finally:
        db.close()
    crossings = _crossings_for_session(sid)["crossings"]
    guideposts = _guideposts_for(journey, crossings)
    return {
        "journey": journey,
        "child_journeys": child_journeys,
        "crossing_count": len(crossings),
        "guideposts": guideposts,
        "generated_at": _now(),
    }


def _load_skill_inventory() -> Dict[str, Any]:
    from agent.skill_utils import (
        get_disabled_skill_names,
        get_external_skills_dirs,
        iter_skill_index_files,
        parse_frontmatter,
        skill_matches_platform,
    )
    from hermes_constants import get_optional_skills_dir, get_skills_dir

    roots = [
        ("user", get_skills_dir()),
        ("bundled", PROJECT_ROOT / "skills"),
        ("optional", get_optional_skills_dir(PROJECT_ROOT / "optional-skills")),
    ]
    roots.extend(("external", path) for path in get_external_skills_dirs())
    disabled = get_disabled_skill_names()
    seen: set[str] = set()
    skills: List[Dict[str, Any]] = []
    duplicates: List[Dict[str, Any]] = []

    for source, root in roots:
        if not root.exists():
            continue
        for skill_md in iter_skill_index_files(root, "SKILL.md"):
            try:
                content = skill_md.read_text(encoding="utf-8")[:5000]
                frontmatter, body = parse_frontmatter(content)
                if not skill_matches_platform(frontmatter):
                    continue
                rel = skill_md.relative_to(root)
                skill_dir = skill_md.parent
                name = str(frontmatter.get("name") or skill_dir.name)[:64]
                if name in seen:
                    duplicates.append({"name": name, "path": str(skill_md), "source": source})
                    continue
                seen.add(name)
                description = str(frontmatter.get("description") or "").strip()
                if not description:
                    for line in body.splitlines():
                        line = line.strip()
                        if line and not line.startswith("#"):
                            description = line
                            break
                category = rel.parts[0] if len(rel.parts) > 2 else None
                skills.append({
                    "name": name,
                    "description": _preview(description, 220),
                    "category": category,
                    "source": source,
                    "enabled": name not in disabled,
                    "path": str(skill_md),
                    "relative_path": str(rel),
                    "last_modified": skill_md.stat().st_mtime,
                    "file_count": sum(1 for p in skill_dir.rglob("*") if p.is_file()),
                })
            except Exception as exc:
                duplicates.append({"name": skill_md.parent.name, "path": str(skill_md), "source": source, "error": str(exc)})
                continue

    skills.sort(key=lambda item: (item.get("source") or "", item.get("category") or "", item.get("name") or ""))
    return {
        "skills": skills,
        "total": len(skills),
        "duplicates": duplicates[:50],
        "disabled_count": sum(1 for item in skills if not item["enabled"]),
        "generated_at": _now(),
    }


def _cron_inventory() -> Dict[str, Any]:
    try:
        from cron.jobs import list_jobs

        jobs = list_jobs(include_disabled=True)
    except Exception as exc:
        return {"jobs": [], "total": 0, "error": str(exc), "generated_at": _now()}
    normalized = []
    for job in jobs:
        normalized.append({
            "id": job.get("id"),
            "name": job.get("name"),
            "enabled": job.get("enabled", True),
            "state": job.get("state"),
            "schedule_display": job.get("schedule_display"),
            "next_run_at": job.get("next_run_at"),
            "last_run_at": job.get("last_run_at"),
            "last_status": job.get("last_status"),
            "last_error": _preview(job.get("last_error"), 240),
            "deliver": job.get("deliver"),
            "workdir": job.get("workdir"),
            "model": job.get("model"),
            "provider": job.get("provider"),
            "skills": job.get("skills") or [],
        })
    return {"jobs": normalized, "total": len(normalized), "generated_at": _now()}


def _recent_global_guideposts(limit: int = 10) -> Dict[str, Any]:
    journeys = _list_journeys(limit=limit, include_children=True)["journeys"]
    result = []
    for journey in journeys:
        try:
            crossings = _crossings_for_session(journey["journey_id"])["crossings"]
            for guidepost in _guideposts_for(journey, crossings):
                result.append({**guidepost, "journey_id": journey["journey_id"]})
        except Exception:
            continue
    return {"guideposts": result, "total": len(result), "generated_at": _now()}


def _markdown_report(session_id: str) -> str:
    detail = _get_journey_detail(session_id)
    crossing_payload = _crossings_for_session(session_id)
    journey = detail["journey"]
    lines = [
        f"# Hermes Labyrinth Report: {journey['journey_id']}",
        "",
        "## Journey",
        "",
        f"- Source: {journey.get('source')}",
        f"- Status: {journey.get('status')}",
        f"- Model: {', '.join(journey.get('model_sequence') or []) or 'unknown'}",
        f"- Started: {journey.get('started_at')}",
        f"- Ended: {journey.get('ended_at')}",
        f"- Messages: {journey.get('message_count')}",
        f"- Tool calls: {journey.get('tool_call_count')}",
        f"- Summary: {_preview(journey.get('summary'), 500)}",
        "",
        "## Guideposts",
        "",
    ]
    if detail["guideposts"]:
        for item in detail["guideposts"]:
            lines.append(f"- [{item['severity']}] {item['title']}")
    else:
        lines.append("- No guideposts generated.")
    lines.extend(["", "## Crossings", ""])
    for crossing in crossing_payload["crossings"][:200]:
        label = crossing.get("label") or crossing.get("type")
        status = crossing.get("status")
        typ = crossing.get("type")
        lines.append(f"- {typ} / {status}: {label}")
        preview = crossing.get("outputs_preview") or crossing.get("inputs_preview")
        if preview:
            lines.append(f"  - Evidence: {_preview(preview, 240)}")
    if len(crossing_payload["crossings"]) > 200:
        lines.append(f"- Report truncated after 200 crossings of {len(crossing_payload['crossings'])}.")
    lines.extend(["", "## Missing Data Policy", "", "Unknown fields were left unknown. This report is generated from local Hermes state and redacted before export."])
    return "\n".join(lines) + "\n"


@router.get("/health")
async def health():
    home = get_hermes_home()
    state_db = home / "state.db"
    return {
        "ok": True,
        "plugin": "hermes-labyrinth",
        "version": PLUGIN_VERSION,
        "hermes_home": str(home),
        "state_db_exists": state_db.exists(),
        "data_sources": {
            "sessions": state_db.exists(),
            "skills": (home / "skills").exists() or (PROJECT_ROOT / "skills").exists(),
            "cron": (home / "cron").exists(),
        },
        "generated_at": _now(),
    }


@router.get("/journeys")
async def journeys(limit: int = 25, offset: int = 0, include_children: bool = True):
    return _list_journeys(limit=limit, offset=offset, include_children=include_children)


@router.get("/journeys/{journey_id}")
async def journey_detail(journey_id: str):
    return _get_journey_detail(journey_id)


@router.get("/journeys/{journey_id}/crossings")
async def journey_crossings(journey_id: str):
    return _crossings_for_session(journey_id)


@router.get("/skills")
async def skills():
    return _load_skill_inventory()


@router.get("/cron")
async def cron():
    return _cron_inventory()


@router.get("/guideposts")
async def guideposts(limit: int = 10):
    return _recent_global_guideposts(limit=limit)


@router.get("/reports/{journey_id}.json")
async def report_json(journey_id: str):
    return {
        "detail": _get_journey_detail(journey_id),
        "crossings": _crossings_for_session(journey_id),
        "generated_at": _now(),
    }


@router.get("/reports/{journey_id}.md", response_class=PlainTextResponse)
async def report_markdown(journey_id: str):
    return _markdown_report(journey_id)
