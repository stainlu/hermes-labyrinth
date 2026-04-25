# Hermes Labyrinth Functional Spec

## Product thesis

Hermes Agent already has the ingredients of a persistent autonomous system:
sessions, tools, memory, skills, cron, providers, gateway platforms, approvals,
and delegation. Hermes Labyrinth makes those ingredients visible as journeys
through boundaries.

The user should be able to answer:

- What did the agent do?
- Which boundaries did it cross?
- What changed because of this session?
- Which tools, skills, memories, models, and subagents were involved?
- Where did the path fail, loop, or become uncertain?
- What should I inspect next?

## Non-goals

- Do not define final colors, typography, compositions, animations, icons, or
  visual assets.
- Do not modify Hermes core behavior for the MVP.
- Do not require a rebuild of the dashboard source.
- Do not turn this into a generic analytics dashboard.
- Do not hide uncertainty. Missing data should be explicit.
- Do not introduce autonomous actions in v1. The first version observes.

## Core concepts

### Journey

A journey is a user-facing unit of agent activity. Usually this maps to a
Hermes session, but it can also represent a cron run, gateway interaction,
or delegated child session.

Fields:

- `journey_id`
- `source` such as `cli`, `dashboard`, `gateway`, `cron`, `subagent`
- `started_at`, `ended_at`
- `status` such as `active`, `complete`, `interrupted`, `failed`, `unknown`
- `summary`
- `root_prompt`
- `parent_journey_id`
- `model_sequence`
- `cost_estimate` when available
- `duration_ms` when available

### Crossing

A crossing is a boundary event inside a journey.

Examples:

- User prompt enters the agent loop.
- Agent calls a tool.
- Tool result returns.
- Context is compressed.
- Model/provider changes.
- A skill is invoked or created.
- Memory is searched, written, or skipped.
- Cron launches work in a project directory.
- A subagent is spawned.
- Approval is requested or denied.
- A secret/redaction boundary is encountered.
- Gateway message enters or exits Hermes.

Fields:

- `crossing_id`
- `journey_id`
- `type`
- `label`
- `started_at`, `ended_at`
- `status`
- `actor`
- `target`
- `duration_ms`
- `inputs_preview`
- `outputs_preview`
- `evidence_refs`

### Thread

A thread links crossings into a path. It is the user's navigational unit.

Examples:

- A tool chain.
- A model fallback sequence.
- A parent agent delegating to children.
- A cron job that triggered a session.
- A gateway request that became a session and produced a reply.

### Artifact

An artifact is durable evidence produced or touched by a journey.

Examples:

- Edited file.
- Generated image.
- Skill file.
- Memory entry.
- Log excerpt.
- Screenshot.
- External message.
- Exported report.

### Guidepost

A guidepost is a computed interpretation that helps the user orient.

Examples:

- "This journey looped on the same failing tool 4 times."
- "A subagent timed out before making an API call."
- "The model switched after context compression."
- "This skill has not been used since creation."
- "A cron job ran outside the expected project directory."

Guideposts should be explainable from local evidence.

## Functional areas

### 1. Journey Index

Show recent journeys across Hermes surfaces.

Required:

- List sessions with status, source, model, duration, and last activity.
- Link parent and child journeys when delegation data is available.
- Surface cron and gateway origins when detectable.
- Search/filter by text, tool, model, source, status, date, and project path.

MVP:

- Read session summaries from existing Hermes session storage or dashboard APIs.
- Show unknown fields as unknown instead of fabricating them.

### 2. Labyrinth Map

Provide a navigable representation of crossings inside a selected journey.

Required:

- Render crossings as ordered path segments.
- Group related crossings into threads.
- Distinguish normal flow, loops, failures, approvals, and handoffs.
- Let the user select a crossing and inspect evidence.

MVP:

- Start with a timeline-first map.
- Add graph relationships where the data is reliable.
- Avoid complex graph physics in the first version.

### 3. Crossing Inspector

Show concrete evidence for one crossing.

Required:

- Type-specific metadata.
- Start/end time and duration.
- Status and error summary.
- Input/output previews with redaction.
- Links to logs, sessions, files, or artifacts when available.

MVP:

- Tool calls, model switches, approvals, errors, and subagent events.

### 4. Skill Atlas

Make Hermes skills legible as part of the agent's evolving capability surface.

Required:

- Discover built-in skills, optional skills, and user skills.
- Show enabled/disabled state when config is available.
- Show source path, description, last modified time, and rough category.
- Link skill usage to journeys when usage evidence exists.
- Flag duplicate, stale, or broken skill definitions.

MVP:

- Filesystem inventory of skill directories.
- Optional usage association from session/tool evidence.

Future:

- Skill lineage from edits/backups.
- Fitness metrics based on successful usage.
- Skill creation events when Hermes creates or modifies a skill.

### 5. Memory and Context Map

Expose how memory and context affected a journey.

Required:

- Show whether memory was enabled, skipped, queried, or written.
- Show context compression events.
- Show model context limits and token-budget changes.
- Show memory provider identity when available.

MVP:

- Show memory provider/config state and compression events if present in logs
  or session records.

Future:

- Memory read/write graph.
- Retrieval evidence with provenance and redacted previews.

### 6. Delegation Threads

Show how parent and child agents coordinate.

Required:

- Parent journey to child journey links.
- Child status, model, duration, and final result.
- Timeout and deadlock indicators.
- Approval boundaries involving subagents.

MVP:

- Detect known subagent/delegate events from sessions/logs.
- Show child sessions if identifiers are available.

### 7. Cron Gate

Show scheduled autonomy as journeys that begin without direct user input.

Required:

- List configured cron jobs.
- Show next run, last run, project workdir, status, and recent failure.
- Link cron runs to journeys.

MVP:

- Read cron configuration and recent logs where available.
- Present unknown run linkage explicitly when not available.

### 8. Model Ferry

Show model/provider transitions during a journey.

Required:

- Model sequence.
- Provider/auth status when safe to expose.
- Context limit and token-budget changes.
- Fallback or retry events.
- Cost/latency estimates when available.

MVP:

- Model sequence, provider names, duration, and context compression links.

### 9. Boundary Events

Make safety and trust boundaries visible.

Required:

- Approval prompts.
- Denied or cancelled actions.
- Secret handling and redaction events.
- Sandbox or permission boundaries.
- External platform ingress/egress.

MVP:

- Approval, redaction, and error events from logs/session data.

### 10. Labyrinth Report

Create a shareable artifact for hackathon submission and debugging.

Required:

- Export one journey as JSON.
- Export a human-readable Markdown report.
- Include summary, path, key crossings, artifacts, guideposts, and missing data.
- Redact sensitive previews by default.

MVP:

- JSON and Markdown export from the plugin UI.

## Data sources

Use the least invasive source first.

1. Existing dashboard/session APIs.
2. Hermes session storage through a read-only backend plugin route.
3. Logs under the Hermes home directory.
4. Skill directories:
   - Built-in repo `skills/`
   - Optional repo `optional-skills/`
   - User `~/.hermes/skills/`
5. Cron configuration and job state.
6. Plugin hook events captured by an optional recorder.

## Dashboard integration

The hackathon implementation should be a drop-in dashboard plugin plus theme.

UI plugin:

- Registers a visible `Labyrinth` tab.
- Optionally registers a compact status slot in `sidebar` or `header-right`.
- Calls backend routes through the plugin SDK.
- Works without patching the dashboard source.

Backend plugin:

- Exposes read-only FastAPI routes under `/api/plugins/hermes-labyrinth/`.
- Normalizes sessions, skills, logs, cron jobs, and guideposts.
- Handles missing permissions/data sources gracefully.
- Redacts secrets before returning previews.

Theme:

- Provides the high-level atmosphere only.
- Does not carry core functionality.
- Must be replaceable without breaking the plugin.

## Proposed backend API

```text
GET /api/plugins/hermes-labyrinth/health
GET /api/plugins/hermes-labyrinth/journeys
GET /api/plugins/hermes-labyrinth/journeys/{journey_id}
GET /api/plugins/hermes-labyrinth/journeys/{journey_id}/crossings
GET /api/plugins/hermes-labyrinth/skills
GET /api/plugins/hermes-labyrinth/cron
GET /api/plugins/hermes-labyrinth/guideposts
GET /api/plugins/hermes-labyrinth/reports/{journey_id}.json
GET /api/plugins/hermes-labyrinth/reports/{journey_id}.md
```

## Guidepost rules for MVP

Implement a small set of explainable guideposts:

- Repeated failing tool call.
- Long-running tool call.
- Tool result transformed by hook.
- Approval denied or timed out.
- Context compression occurred.
- Model/provider changed.
- Subagent timed out or returned no final result.
- Cron job failed or ran from an unexpected workdir.
- Skill exists but is disabled.
- Missing data source.

## MVP acceptance criteria

- Installs as a dashboard plugin and theme without modifying core dashboard
  source.
- Shows at least 10 recent journeys.
- Opens one journey into a crossing timeline.
- Shows real tool/model/error/subagent data when present.
- Inventories built-in and user skills.
- Produces at least 5 guideposts from local evidence.
- Exports a redacted Markdown report for one journey.
- Fails gracefully on a fresh Hermes install with little data.
- Includes screenshots or video showing real Hermes state.

## Stretch goals

- Optional hook recorder for richer tool-call and duration data.
- Journey graph across sessions, cron, gateway, and delegation.
- Skill lineage and usage fitness.
- Memory read/write provenance.
- Browser/computer-use replay support.
- Shareable static HTML report.

## Hackathon scoring argument

This is useful because Hermes users need to debug and understand increasingly
autonomous behavior. It is awesome because it makes the agent's liminal nature
visible: every action becomes a crossing, every session becomes a journey, and
the dashboard becomes a guide through the unknown.

