# Hermes Labyrinth Design Brief

## Purpose

Hermes Labyrinth is a dashboard extension about orientation.

Hermes is the figure who crosses boundaries without obstruction: Olympus,
earth, underworld, roads, markets, messages, theft, invention, and the passage
of souls. Hermes Agent crosses a modern set of boundaries: user intent into
tool calls, local context into memory, isolated work into subagents, manual
tasks into cron, and one model/provider into another.

The labyrinth is the counterforce: a place where crossing is possible but not
obvious. It contains entry and exit, known and unknown, progress and loop,
life and death, signal and disorientation.

The product spirit is simple:

Hermes is the guide. The dashboard is the thread. The agent's behavior is the
labyrinth.

## What the design must accomplish

The design should make a complex autonomous system feel:

- Legible without becoming sterile.
- Strange without becoming decorative noise.
- Dense without becoming unreadable.
- Mythic without becoming fantasy cosplay.
- Technical without becoming generic observability software.

The core emotional movement is from disorientation to orientation. The user
should feel that the system is powerful and alien enough to require a guide,
but honest enough to reveal its path.

## Functional priorities for design

The visual system should serve these information priorities:

1. Current journey: what is happening now?
2. Path: how did the agent get here?
3. Crossings: what boundaries did it cross?
4. Evidence: what concrete logs, files, tool results, or artifacts prove it?
5. Guideposts: what does the system think deserves attention?
6. Continuity: what changed across sessions, skills, memory, cron, or models?

The design should not merely present metrics. It should create orientation.

## Concepts the designer may interpret

### Boundary

Every meaningful agent event is a boundary crossing:

- prompt to plan
- thought to tool
- local file to external service
- memory lookup to memory write
- parent agent to subagent
- active session to scheduled job
- one model to another model
- private data to redacted output

Design should help the user feel these crossings as transitions in state, not
as flat rows in a table.

### Thread

The user needs a thread through the maze.

The thread may be chronological, causal, spatial, or ritualized, but it should
always answer: "where am I, where did I come from, and what is next?"

### Psychopomp

Hermes as psychopomp is not decoration. It is a product role: the interface
guides the user through dead ends, failures, hidden transitions, and obscure
states.

The dashboard should be at its best when something goes wrong.

### Threshold

Thresholds should be treated as first-class events. Approvals, redactions,
provider switches, context compression, subagent spawning, and cron execution
are more important than raw counters.

### Evidence

The system should never ask the user to trust vibes. Every interpretation
needs a route back to evidence: logs, session records, files, or local config.

## High-level design directions

These are directions, not final designs.

### Direction 1: Cartographic Labyrinth

The dashboard behaves like a map of a journey through branching corridors.

Best for:

- Showing session paths.
- Showing branching delegation.
- Showing loops, dead ends, and exits.
- Making the "labyrinth" metaphor explicit.

Functional emphasis:

- Journey graph.
- Crossing inspector.
- Parent/child session links.
- Guideposts as landmarks.

Risks:

- Can become too abstract if evidence is hard to reach.
- Graphs can become messy with real data.

### Direction 2: Psychopomp Flight Recorder

The dashboard behaves like a blackbox recorder for an agentic journey.

Best for:

- Debugging.
- Trust and safety.
- Hackathon demo clarity.
- Showing exact evidence.

Functional emphasis:

- Timeline.
- Event inspector.
- Tool-call durations.
- Model/provider transitions.
- Redacted report export.

Risks:

- Could feel too conventional if the mythic layer is weak.

### Direction 3: Threshold Observatory

The dashboard focuses on boundary events rather than all events.

Best for:

- Making Hermes's unique nature obvious.
- Separating meaningful transitions from noise.
- Showing where autonomy increases risk.

Functional emphasis:

- Approvals.
- Secret/redaction moments.
- Gateway ingress/egress.
- Cron launches.
- Subagent spawn/return.
- Context compression and model switching.

Risks:

- May underrepresent ordinary successful work.

### Direction 4: Skill Temple

The dashboard centers Hermes's evolving capabilities: skills, memory, and
reusable knowledge.

Best for:

- Showing Hermes as more than a chat loop.
- Making self-improvement visible.
- Explaining long-term continuity.

Functional emphasis:

- Skill inventory.
- Skill usage history.
- Skill edits and lineage.
- Memory provider status.
- Capability gaps.

Risks:

- Less directly tied to one active journey unless paired with the map or
  recorder.

### Direction 5: Crossroads Control Room

The dashboard emphasizes Hermes as a router across worlds: models, providers,
platforms, tools, cron jobs, and subagents.

Best for:

- Operations.
- Power users.
- VPS/server deployments.
- Showing the agent as infrastructure.

Functional emphasis:

- Provider/model routing.
- Gateway platforms.
- Cron jobs.
- Tool availability.
- System health and failures.

Risks:

- Can drift toward generic admin software if the journey metaphor is lost.

## Recommended synthesis

For the hackathon, combine Direction 1 and Direction 2:

- Cartographic Labyrinth gives the memorable concept.
- Psychopomp Flight Recorder gives utility and credibility.

Use Direction 3 as the organizing filter: prioritize boundary events.

Direction 4 and Direction 5 are strong secondary panels, but they should not
own the first version.

## Experience principles

- The first screen should immediately show that Hermes is traversing paths,
  not sitting in a static dashboard.
- The most important events are transitions, not totals.
- Every beautiful abstraction must have an evidence drawer behind it.
- The product should be proud of uncertainty. Unknowns are part of the maze.
- The interface should make failures feel inspectable, not embarrassing.
- The design should leave room for Hermes to feel alive without pretending it
  is magic.

## Language direction

Prefer language from travel, transition, evidence, and guidance.

Good terms:

- journey
- crossing
- thread
- guidepost
- threshold
- passage
- trace
- artifact
- witness
- return

Use mythic language sparingly. The product should feel informed by myth, not
buried under lore.

Avoid:

- Generic analytics language as the primary frame.
- Corporate dashboard words as the emotional center.
- Overexplaining the myth inside the app.
- Decorative labels that do not map to real functionality.

## What the designer owns

The designer owns:

- Final visual system.
- Layout.
- Color and type.
- Motion.
- Iconography.
- Asset direction.
- Spatial metaphor.
- Interaction feel.
- Screenshot and video presentation style.

Engineering should provide:

- Real data.
- Clear event semantics.
- Reliable redaction.
- Graceful empty states.
- Exportable evidence.
- Stable extension points.

