(function () {
  "use strict";

  const SDK = window.__HERMES_PLUGIN_SDK__;
  const React = SDK.React;
  const {
    useState,
    useEffect,
    useMemo,
    useRef
  } = React;
  const API = "/api/plugins/hermes-labyrinth";
  const uiUseState = React.useState;
  const SAMPLE_DATA = (() => {
    const journeys = [{
      id: "j-2026-04-26-cli-7f2a",
      source: "cli",
      status: "active",
      started_at: "2026-04-26 14:02:11",
      duration_label: "00:34:08",
      duration_ms: 2048000,
      title: "Refactor billing reconciliation skill — failing on stripe webhook parser",
      root_prompt: "the billing reconciliation skill keeps blowing up. trace why and fix it.",
      model_sequence: ["hermes-4-70b", "claude-sonnet-4.5"],
      provider: "nous · openrouter",
      messages: 47,
      tool_calls: 22,
      api_calls: 31,
      cost: "$0.42",
      tokens: {
        input: 142_400,
        output: 38_900,
        cache_read: 410_220,
        cache_write: 21_300,
        reasoning: 12_800
      },
      end_reason: null,
      parent: null,
      children: ["j-2026-04-26-sub-9c11", "j-2026-04-26-sub-a2d4"],
      thresholds: 6,
      failures: 3,
      project: "~/code/billing-reconcile"
    }, {
      id: "j-2026-04-26-cron-3e91",
      source: "cron",
      status: "complete",
      started_at: "2026-04-26 09:00:02",
      duration_label: "00:11:42",
      duration_ms: 702000,
      title: "Daily ops digest — Telegram",
      root_prompt: "[cron: ops-digest @ 09:00 UTC]",
      model_sequence: ["hermes-4-70b"],
      provider: "nous portal",
      messages: 18,
      tool_calls: 9,
      api_calls: 12,
      cost: "$0.08",
      tokens: {
        input: 24_100,
        output: 6_400,
        cache_read: 88_000,
        cache_write: 3_200,
        reasoning: 0
      },
      end_reason: "complete",
      parent: null,
      children: ["j-2026-04-26-sub-b101"],
      thresholds: 4,
      failures: 0,
      project: "~/.hermes/cron/ops-digest"
    }, {
      id: "j-2026-04-26-gw-tg-c401",
      source: "gateway",
      status: "complete",
      started_at: "2026-04-26 13:14:55",
      duration_label: "00:02:03",
      duration_ms: 123000,
      title: "Telegram → quick lookup, what's the cron job that posts to slack?",
      root_prompt: "what's the cron job that posts to slack on fridays?",
      model_sequence: ["hermes-4-70b"],
      provider: "nous portal",
      messages: 6,
      tool_calls: 2,
      api_calls: 3,
      cost: "$0.01",
      tokens: {
        input: 8_400,
        output: 1_100,
        cache_read: 22_000,
        cache_write: 0,
        reasoning: 0
      },
      end_reason: "complete",
      parent: null,
      children: [],
      thresholds: 2,
      failures: 0,
      project: "~/.hermes"
    }, {
      id: "j-2026-04-26-sub-9c11",
      source: "subagent",
      status: "failed",
      started_at: "2026-04-26 14:09:31",
      duration_label: "00:04:08",
      duration_ms: 248000,
      title: "delegate: read stripe webhook samples and identify schema drift",
      root_prompt: "[delegated by j-7f2a]",
      model_sequence: ["minimax-m2.7"],
      provider: "minimax",
      messages: 11,
      tool_calls: 5,
      api_calls: 6,
      cost: "$0.04",
      tokens: {
        input: 14_200,
        output: 2_100,
        cache_read: 0,
        cache_write: 0,
        reasoning: 0
      },
      end_reason: "timeout",
      parent: "j-2026-04-26-cli-7f2a",
      children: [],
      thresholds: 1,
      failures: 2,
      project: "~/code/billing-reconcile"
    }, {
      id: "j-2026-04-26-sub-a2d4",
      source: "subagent",
      status: "complete",
      started_at: "2026-04-26 14:21:11",
      duration_label: "00:06:55",
      duration_ms: 415000,
      title: "delegate: write a regression test that reproduces the parser crash",
      root_prompt: "[delegated by j-7f2a]",
      model_sequence: ["claude-sonnet-4.5"],
      provider: "anthropic",
      messages: 14,
      tool_calls: 7,
      api_calls: 8,
      cost: "$0.11",
      tokens: {
        input: 31_400,
        output: 4_200,
        cache_read: 18_000,
        cache_write: 8_100,
        reasoning: 0
      },
      end_reason: "complete",
      parent: "j-2026-04-26-cli-7f2a",
      children: [],
      thresholds: 2,
      failures: 0,
      project: "~/code/billing-reconcile"
    }, {
      id: "j-2026-04-25-dash-bb87",
      source: "dashboard",
      status: "interrupted",
      started_at: "2026-04-25 22:41:08",
      duration_label: "00:18:41",
      duration_ms: 1121000,
      title: "draft a postmortem for the friday outage",
      root_prompt: "draft a postmortem for the friday outage. include timelines from grafana logs.",
      model_sequence: ["hermes-4-405b"],
      provider: "nous portal",
      messages: 22,
      tool_calls: 10,
      api_calls: 13,
      cost: "$0.36",
      tokens: {
        input: 88_000,
        output: 12_000,
        cache_read: 110_000,
        cache_write: 8_400,
        reasoning: 4_200
      },
      end_reason: "interrupted",
      parent: null,
      children: [],
      thresholds: 3,
      failures: 1,
      project: "~/notes/incidents"
    }, {
      id: "j-2026-04-25-cli-1a02",
      source: "cli",
      status: "complete",
      started_at: "2026-04-25 16:08:00",
      duration_label: "00:42:19",
      duration_ms: 2539000,
      title: "set up a daily cron that summarizes my discord pings",
      root_prompt: "set up a daily cron that summarizes my discord pings to me at 8pm.",
      model_sequence: ["hermes-4-70b"],
      provider: "nous portal",
      messages: 31,
      tool_calls: 14,
      api_calls: 19,
      cost: "$0.19",
      tokens: {
        input: 56_000,
        output: 9_200,
        cache_read: 220_000,
        cache_write: 11_000,
        reasoning: 0
      },
      end_reason: "complete",
      parent: null,
      children: [],
      thresholds: 5,
      failures: 0,
      project: "~/.hermes"
    }, {
      id: "j-2026-04-25-cron-2244",
      source: "cron",
      status: "failed",
      started_at: "2026-04-25 09:00:01",
      duration_label: "00:00:09",
      duration_ms: 9000,
      title: "Daily ops digest — Telegram",
      root_prompt: "[cron: ops-digest @ 09:00 UTC]",
      model_sequence: ["hermes-4-70b"],
      provider: "nous portal",
      messages: 2,
      tool_calls: 0,
      api_calls: 1,
      cost: "$0.00",
      tokens: {
        input: 800,
        output: 0,
        cache_read: 0,
        cache_write: 0,
        reasoning: 0
      },
      end_reason: "workdir_missing",
      parent: null,
      children: [],
      thresholds: 1,
      failures: 1,
      project: "~/code/missing-dir"
    }, {
      id: "j-2026-04-26-sub-b101",
      source: "subagent",
      status: "complete",
      started_at: "2026-04-26 09:01:14",
      duration_label: "00:02:11",
      duration_ms: 131000,
      title: "delegate: pull yesterday's incident summary",
      root_prompt: "[delegated by cron j-3e91]",
      model_sequence: ["hermes-4-70b"],
      provider: "nous portal",
      messages: 5,
      tool_calls: 2,
      api_calls: 3,
      cost: "$0.01",
      tokens: {
        input: 4_200,
        output: 800,
        cache_read: 0,
        cache_write: 0,
        reasoning: 0
      },
      end_reason: "complete",
      parent: "j-2026-04-26-cron-3e91",
      children: [],
      thresholds: 1,
      failures: 0,
      project: "~/.hermes/cron/ops-digest"
    }];
    const debugCrossings = [{
      id: "c01",
      type: "prompt",
      label: "User prompt",
      actor: "you",
      target: "agent_loop",
      t: "14:02:11",
      dur: null,
      status: "complete",
      thread: "main",
      preview_in: "the billing reconciliation skill keeps blowing up. trace why and fix it.",
      preview_out: ""
    }, {
      id: "c02",
      type: "memory_op",
      label: "memory.search",
      actor: "agent",
      target: "qdrant",
      t: "14:02:13",
      dur: 410,
      status: "complete",
      thread: "main",
      preview_in: "billing reconciliation skill failures",
      preview_out: "3 hits — last_session: j-04-19-cli-d811 (\"stripe webhook v2 schema added\")"
    }, {
      id: "c03",
      type: "tool_call",
      label: "read_file",
      actor: "agent",
      target: "fs",
      t: "14:02:15",
      dur: 88,
      status: "complete",
      thread: "tools",
      preview_in: "~/code/billing-reconcile/skills/reconcile/SKILL.md",
      preview_out: ""
    }, {
      id: "c04",
      type: "tool_result",
      label: "read_file",
      actor: "fs",
      target: "agent",
      t: "14:02:15",
      dur: null,
      status: "complete",
      thread: "tools",
      preview_in: "",
      preview_out: "1.2KB — last modified 12 days ago."
    }, {
      id: "c05",
      type: "tool_call",
      label: "run_python",
      actor: "agent",
      target: "sandbox",
      t: "14:03:01",
      dur: 4_120,
      status: "failed",
      thread: "tools",
      preview_in: "from skills.reconcile import parse_webhook; parse_webhook(sample)",
      preview_out: ""
    }, {
      id: "c06",
      type: "tool_result",
      label: "run_python",
      actor: "sandbox",
      target: "agent",
      t: "14:03:05",
      dur: null,
      status: "failed",
      thread: "tools",
      preview_in: "",
      preview_out: "KeyError: 'data.object.charges' — schema drift since stripe-2026-03-15."
    }, {
      id: "c07",
      type: "tool_call",
      label: "run_python",
      actor: "agent",
      target: "sandbox",
      t: "14:03:48",
      dur: 3_980,
      status: "failed",
      thread: "tools",
      preview_in: "patched parser, retrying parse_webhook(sample)",
      preview_out: ""
    }, {
      id: "c08",
      type: "tool_result",
      label: "run_python",
      actor: "sandbox",
      target: "agent",
      t: "14:03:52",
      dur: null,
      status: "failed",
      thread: "tools",
      preview_in: "",
      preview_out: "KeyError: 'data.object.charges.data' — same shape, deeper miss."
    }, {
      id: "c09",
      type: "redaction",
      label: "redact: stripe sk_live_***",
      actor: "hooks",
      target: "preview",
      t: "14:04:12",
      dur: null,
      status: "complete",
      thread: "thresholds",
      preview_in: "[REDACTED] api_key field replaced before logging",
      preview_out: "stripe.api_key = sk_live_••••••••••••XR4n"
    }, {
      id: "c10",
      type: "model_switch",
      label: "→ claude-sonnet-4.5",
      actor: "router",
      target: "model",
      t: "14:05:02",
      dur: null,
      status: "complete",
      thread: "thresholds",
      preview_in: "fallback after 2 tool failures · ctx 92%",
      preview_out: "provider: anthropic · ctx 22% (fresh)"
    }, {
      id: "c11",
      type: "subagent_spawn",
      label: "delegate_task → schema-drift",
      actor: "agent",
      target: "subagent",
      t: "14:09:31",
      dur: null,
      status: "complete",
      thread: "delegation",
      preview_in: "read stripe webhook samples and identify schema drift",
      preview_out: "spawned j-9c11 · model minimax-m2.7"
    }, {
      id: "c12",
      type: "approval",
      label: "approval: write to ~/code",
      actor: "agent",
      target: "you",
      t: "14:13:18",
      dur: 18_000,
      status: "complete",
      thread: "thresholds",
      preview_in: "patch skills/reconcile/parser.py (3 hunks, 41 lines)",
      preview_out: "approved at 14:13:36"
    }, {
      id: "c13",
      type: "tool_call",
      label: "edit_file",
      actor: "agent",
      target: "fs",
      t: "14:13:37",
      dur: 240,
      status: "complete",
      thread: "tools",
      preview_in: "skills/reconcile/parser.py — 3 hunks",
      preview_out: ""
    }, {
      id: "c14",
      type: "subagent_return",
      label: "schema-drift → timeout",
      actor: "subagent",
      target: "agent",
      t: "14:13:39",
      dur: null,
      status: "failed",
      thread: "delegation",
      preview_in: "",
      preview_out: "no final_result · timeout after 4m08s · last action: web_fetch stripe.com/docs"
    }, {
      id: "c15",
      type: "subagent_spawn",
      label: "delegate_task → write-test",
      actor: "agent",
      target: "subagent",
      t: "14:21:11",
      dur: null,
      status: "complete",
      thread: "delegation",
      preview_in: "write a regression test that reproduces the parser crash",
      preview_out: "spawned j-a2d4 · model claude-sonnet-4.5"
    }, {
      id: "c16",
      type: "context_compression",
      label: "context compressed",
      actor: "agent",
      target: "next_context",
      t: "14:25:40",
      dur: null,
      status: "complete",
      thread: "thresholds",
      preview_in: "ctx 88% · 47 messages · 12 tool results pruned",
      preview_out: "summary 2.1KB written · ctx 19%"
    }, {
      id: "c17",
      type: "subagent_return",
      label: "write-test → complete",
      actor: "subagent",
      target: "agent",
      t: "14:28:06",
      dur: null,
      status: "complete",
      thread: "delegation",
      preview_in: "",
      preview_out: "tests/test_parser_drift.py · 1 test, currently failing on master"
    }, {
      id: "c18",
      type: "tool_call",
      label: "run_python",
      actor: "agent",
      target: "sandbox",
      t: "14:28:18",
      dur: 1_640,
      status: "complete",
      thread: "tools",
      preview_in: "pytest tests/test_parser_drift.py -k drift",
      preview_out: ""
    }, {
      id: "c19",
      type: "tool_result",
      label: "run_python",
      actor: "sandbox",
      target: "agent",
      t: "14:28:20",
      dur: null,
      status: "complete",
      thread: "tools",
      preview_in: "",
      preview_out: "1 passed in 1.4s · parser handles drift, returns Decimal('0.00') on missing."
    }, {
      id: "c20",
      type: "assistant_response",
      label: "Assistant",
      actor: "agent",
      target: "you",
      t: "14:36:19",
      dur: null,
      status: "active",
      thread: "main",
      preview_in: "",
      preview_out: "Found and patched it. Schema drift in stripe webhook v2026-03-15 nests `charges` one level deeper. Parser now reads `data.object.charges.data[]` defensively. Regression test in tests/test_parser_drift.py. Subagent that scraped stripe docs timed out — I'll"
    }];
    const cleanCrossings = [{
      id: "k01",
      type: "prompt",
      label: "Cron trigger",
      actor: "cron",
      target: "agent_loop",
      t: "09:00:02",
      dur: null,
      status: "complete",
      thread: "main",
      preview_in: "[cron: ops-digest @ 09:00 UTC]",
      preview_out: ""
    }, {
      id: "k02",
      type: "memory_op",
      label: "memory.search",
      actor: "agent",
      target: "qdrant",
      t: "09:00:03",
      dur: 220,
      status: "complete",
      thread: "main",
      preview_in: "yesterday's ops events",
      preview_out: "12 hits"
    }, {
      id: "k03",
      type: "subagent_spawn",
      label: "delegate_task → summarize",
      actor: "agent",
      target: "subagent",
      t: "09:01:14",
      dur: null,
      status: "complete",
      thread: "delegation",
      preview_in: "pull yesterday's incident summary from grafana",
      preview_out: "spawned j-b101"
    }, {
      id: "k04",
      type: "subagent_return",
      label: "summarize → complete",
      actor: "subagent",
      target: "agent",
      t: "09:03:25",
      dur: null,
      status: "complete",
      thread: "delegation",
      preview_in: "",
      preview_out: "0 incidents · 2 deploys · 1 cron failure (j-2244)"
    }, {
      id: "k05",
      type: "redaction",
      label: "redact: telegram token",
      actor: "hooks",
      target: "preview",
      t: "09:08:11",
      dur: null,
      status: "complete",
      thread: "thresholds",
      preview_in: "[REDACTED] before gateway egress",
      preview_out: "bot_token=tg_••••••••••XQ"
    }, {
      id: "k06",
      type: "tool_call",
      label: "telegram.send",
      actor: "agent",
      target: "gateway",
      t: "09:11:40",
      dur: 380,
      status: "complete",
      thread: "tools",
      preview_in: "Daily ops digest — 0 incidents · 2 deploys · 1 failed cron (~/code/missing-dir)",
      preview_out: ""
    }, {
      id: "k07",
      type: "tool_result",
      label: "telegram.send",
      actor: "gateway",
      target: "agent",
      t: "09:11:41",
      dur: null,
      status: "complete",
      thread: "tools",
      preview_in: "",
      preview_out: "ok · message_id 18402"
    }, {
      id: "k08",
      type: "assistant_response",
      label: "Assistant",
      actor: "agent",
      target: "cron",
      t: "09:11:44",
      dur: null,
      status: "complete",
      thread: "main",
      preview_in: "",
      preview_out: "Digest sent. 1 follow-up: cron j-2244 failing for 3 days — workdir missing."
    }];
    const guideposts = [{
      kind: "loop",
      severity: "warning",
      title: "Repeated failing tool: run_python",
      detail: "2 KeyError failures on stripe webhook parser before the model switched.",
      journey: "j-2026-04-26-cli-7f2a",
      evidence: ["c05", "c06", "c07", "c08"]
    }, {
      kind: "delegation",
      severity: "warning",
      title: "Subagent timed out before final result",
      detail: "schema-drift subagent (j-9c11) ran 4m08s, last action was web_fetch.",
      journey: "j-2026-04-26-cli-7f2a",
      evidence: ["c14"]
    }, {
      kind: "model",
      severity: "info",
      title: "Model switched after 2 tool failures",
      detail: "Routed hermes-4-70b → claude-sonnet-4.5 with fresh context.",
      journey: "j-2026-04-26-cli-7f2a",
      evidence: ["c10"]
    }, {
      kind: "context",
      severity: "info",
      title: "Context compression mid-journey",
      detail: "47 messages → 2.1KB summary, 12 tool results pruned.",
      journey: "j-2026-04-26-cli-7f2a",
      evidence: ["c16"]
    }, {
      kind: "approval",
      severity: "notice",
      title: "Approval: write to ~/code (granted)",
      detail: "User approved 41-line patch in 18s.",
      journey: "j-2026-04-26-cli-7f2a",
      evidence: ["c12"]
    }, {
      kind: "cron",
      severity: "warning",
      title: "Cron 'ops-digest' failed: workdir missing",
      detail: "j-2244 has failed 3 consecutive days — ~/code/missing-dir doesn't exist.",
      journey: "j-2026-04-25-cron-2244",
      evidence: []
    }, {
      kind: "skill",
      severity: "notice",
      title: "Skill 'reconcile' edited mid-journey",
      detail: "parser.py patched after subagent regression test confirmed crash.",
      journey: "j-2026-04-26-cli-7f2a",
      evidence: ["c13", "c19"]
    }, {
      kind: "missing",
      severity: "info",
      title: "Provider auth not recorded for j-c401",
      detail: "Gateway → Telegram quick lookup; provider field unknown.",
      journey: "j-2026-04-26-gw-tg-c401",
      evidence: []
    }];
    const skills = [{
      name: "reconcile",
      source: "user",
      category: "billing",
      enabled: true,
      modified: "12 min ago",
      desc: "Reconcile stripe webhooks against ledger entries. Patched today.",
      uses: 41,
      files: 6,
      path: "~/.hermes/skills/reconcile/"
    }, {
      name: "ops-digest",
      source: "user",
      category: "ops",
      enabled: true,
      modified: "2 days ago",
      desc: "Compose and post daily ops digest to Telegram.",
      uses: 17,
      files: 3,
      path: "~/.hermes/skills/ops-digest/"
    }, {
      name: "openclaw-migration",
      source: "bundled",
      category: "migration",
      enabled: true,
      modified: "1 week ago",
      desc: "Interactive agent-guided migration from ~/.openclaw with dry-run previews.",
      uses: 1,
      files: 4,
      path: "skills/openclaw-migration/"
    }, {
      name: "skill-factory",
      source: "external",
      category: "meta",
      enabled: true,
      modified: "4 days ago",
      desc: "Auto-generates reusable skills from your workflows.",
      uses: 8,
      files: 7,
      path: "~/.hermes/skills/external/skill-factory/"
    }, {
      name: "litprog",
      source: "external",
      category: "code",
      enabled: false,
      modified: "3 weeks ago",
      desc: "Literate programming across Claude Code, OpenCode, Hermes. Disabled.",
      uses: 0,
      files: 5,
      path: "~/.hermes/skills/external/litprog/"
    }, {
      name: "incident-postmortem",
      source: "user",
      category: "ops",
      enabled: true,
      modified: "yesterday",
      desc: "Drafts postmortem from grafana logs, slack threads, and cron output.",
      uses: 4,
      files: 2,
      path: "~/.hermes/skills/incident-postmortem/"
    }, {
      name: "memory-curator",
      source: "bundled",
      category: "memory",
      enabled: true,
      modified: "1 week ago",
      desc: "Periodically prunes and re-indexes long-term memory.",
      uses: 23,
      files: 2,
      path: "skills/memory-curator/"
    }, {
      name: "discord-summarize",
      source: "user",
      category: "ops",
      enabled: true,
      modified: "yesterday",
      desc: "Summarize discord pings to you at 8pm.",
      uses: 2,
      files: 2,
      path: "~/.hermes/skills/discord-summarize/"
    }, {
      name: "code-review",
      source: "optional",
      category: "code",
      enabled: false,
      modified: "never used",
      desc: "Review a diff or a PR with structured feedback.",
      uses: 0,
      files: 4,
      path: "optional-skills/code-review/"
    }, {
      name: "research-trace",
      source: "optional",
      category: "research",
      enabled: true,
      modified: "5 days ago",
      desc: "Multi-source research with explicit provenance trace.",
      uses: 3,
      files: 6,
      path: "optional-skills/research-trace/"
    }];
    const cron = [{
      id: "ops-digest",
      name: "ops-digest",
      enabled: true,
      schedule: "0 9 * * *",
      display: "every day · 09:00 UTC",
      next: "tomorrow 09:00",
      last: "today 09:11 · ok",
      status: "ok",
      workdir: "~/.hermes/cron/ops-digest",
      model: "hermes-4-70b",
      provider: "nous portal",
      deliver: "telegram",
      skills: ["ops-digest"]
    }, {
      id: "weekly-review",
      name: "weekly-review",
      enabled: true,
      schedule: "0 17 * * 5",
      display: "every fri · 17:00 local",
      next: "fri 17:00",
      last: "fri 17:01 · ok",
      status: "ok",
      workdir: "~/notes/weekly",
      model: "hermes-4-405b",
      provider: "nous portal",
      deliver: "slack",
      skills: ["incident-postmortem"]
    }, {
      id: "discord-pings",
      name: "discord-pings",
      enabled: true,
      schedule: "0 20 * * *",
      display: "every day · 20:00 local",
      next: "today 20:00",
      last: "yesterday 20:00 · ok",
      status: "ok",
      workdir: "~/.hermes",
      model: "hermes-4-70b",
      provider: "nous portal",
      deliver: "telegram",
      skills: ["discord-summarize"]
    }, {
      id: "missing-dir",
      name: "ledger-backup",
      enabled: true,
      schedule: "0 9 * * *",
      display: "every day · 09:00 UTC",
      next: "tomorrow 09:00 · will fail",
      last: "3 consecutive failures",
      status: "failed",
      workdir: "~/code/missing-dir",
      model: "hermes-4-70b",
      provider: "nous portal",
      deliver: "(none)",
      skills: [],
      error: "workdir does not exist; created at setup, deleted later."
    }, {
      id: "memory-curate",
      name: "memory-curate",
      enabled: true,
      schedule: "30 3 * * 0",
      display: "every sun · 03:30 UTC",
      next: "sun 03:30",
      last: "sun 03:34 · ok",
      status: "ok",
      workdir: "~/.hermes/memory",
      model: "hermes-4-70b",
      provider: "nous portal",
      deliver: "(silent)",
      skills: ["memory-curator"]
    }, {
      id: "trial-pause",
      name: "research-pulse",
      enabled: false,
      schedule: "0 12 * * *",
      display: "every day · 12:00 UTC · disabled",
      next: "—",
      last: "10 days ago · ok",
      status: "disabled",
      workdir: "~/notes/research",
      model: "hermes-4-405b",
      provider: "nous portal",
      deliver: "email",
      skills: ["research-trace"]
    }];
    return {
      journeys,
      debugCrossings,
      cleanCrossings,
      guideposts,
      skills,
      cron
    };
  })();
  const CrossingGlyph = ({
    type,
    size = 16,
    stroke = 1.5
  }) => {
    const props = {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: stroke,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    };
    switch (type) {
      case "prompt":
        return React.createElement("svg", props, React.createElement("path", {
          d: "M3 12h12"
        }), React.createElement("path", {
          d: "M11 8l4 4-4 4"
        }), React.createElement("circle", {
          cx: "19",
          cy: "12",
          r: "1.4"
        }));
      case "tool_call":
        return React.createElement("svg", props, React.createElement("path", {
          d: "M5 5l5 5"
        }), React.createElement("path", {
          d: "M5 12l5-2"
        }), React.createElement("path", {
          d: "M5 19l5-5"
        }), React.createElement("circle", {
          cx: "15",
          cy: "12",
          r: "3.2"
        }));
      case "tool_result":
        return React.createElement("svg", props, React.createElement("circle", {
          cx: "9",
          cy: "12",
          r: "3.2"
        }), React.createElement("path", {
          d: "M19 5l-5 5"
        }), React.createElement("path", {
          d: "M19 12l-5-2"
        }), React.createElement("path", {
          d: "M19 19l-5-5"
        }));
      case "assistant_response":
        return React.createElement("svg", props, React.createElement("circle", {
          cx: "5",
          cy: "12",
          r: "1.4"
        }), React.createElement("path", {
          d: "M9 12h12"
        }), React.createElement("path", {
          d: "M17 8l4 4-4 4"
        }));
      case "approval":
        return React.createElement("svg", props, React.createElement("path", {
          d: "M5 4v16"
        }), React.createElement("path", {
          d: "M19 4v16"
        }), React.createElement("circle", {
          cx: "12",
          cy: "10",
          r: "2.4"
        }), React.createElement("path", {
          d: "M12 12.5v5"
        }), React.createElement("path", {
          d: "M10.5 14.5h3"
        }));
      case "redaction":
        return React.createElement("svg", props, React.createElement("rect", {
          x: "4",
          y: "6",
          width: "16",
          height: "12",
          rx: "1"
        }), React.createElement("path", {
          d: "M7 10l3 0"
        }), React.createElement("path", {
          d: "M13 10l4 0"
        }), React.createElement("path", {
          d: "M7 14l5 0"
        }), React.createElement("path", {
          d: "M15 14l2 0"
        }));
      case "subagent_spawn":
        return React.createElement("svg", props, React.createElement("circle", {
          cx: "6",
          cy: "6",
          r: "1.6"
        }), React.createElement("path", {
          d: "M6 7.6V12"
        }), React.createElement("path", {
          d: "M6 12c0 4 4 4 8 4"
        }), React.createElement("path", {
          d: "M6 12c0 4 4 4 8 4"
        }), React.createElement("circle", {
          cx: "18",
          cy: "16",
          r: "1.6"
        }), React.createElement("path", {
          d: "M6 12c0 -3 4 -3 8 -3"
        }), React.createElement("circle", {
          cx: "18",
          cy: "9",
          r: "1.6"
        }));
      case "subagent_return":
        return React.createElement("svg", props, React.createElement("circle", {
          cx: "18",
          cy: "6",
          r: "1.6"
        }), React.createElement("path", {
          d: "M18 7.6V12"
        }), React.createElement("path", {
          d: "M18 12c0 4 -4 4 -8 4"
        }), React.createElement("circle", {
          cx: "6",
          cy: "16",
          r: "1.6"
        }), React.createElement("path", {
          d: "M18 12c0 -3 -4 -3 -8 -3"
        }), React.createElement("circle", {
          cx: "6",
          cy: "9",
          r: "1.6"
        }));
      case "model_switch":
        return React.createElement("svg", props, React.createElement("path", {
          d: "M5 5v14"
        }), React.createElement("path", {
          d: "M19 5v14"
        }), React.createElement("path", {
          d: "M5 9h6l3 -3"
        }), React.createElement("path", {
          d: "M19 15h-6l-3 3"
        }));
      case "context_compression":
        return React.createElement("svg", props, React.createElement("path", {
          d: "M4 7l16 0"
        }), React.createElement("path", {
          d: "M6 12l12 0"
        }), React.createElement("path", {
          d: "M9 17l6 0"
        }));
      case "memory_op":
        return React.createElement("svg", props, React.createElement("path", {
          d: "M12 4c-4 0 -7 3 -7 7c0 4 3 7 7 7c4 0 7 -3 7 -7c0 -4 -3 -7 -7 -7"
        }), React.createElement("path", {
          d: "M12 4v14"
        }), React.createElement("path", {
          d: "M5 11h14"
        }));
      default:
        return React.createElement("svg", props, React.createElement("circle", {
          cx: "12",
          cy: "12",
          r: "6"
        }));
    }
  };
  const Caduceus = ({
    size = 28
  }) => React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 32 40",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.25",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M16 4v32"
  }), React.createElement("path", {
    d: "M16 8c-3 -1 -6 -1 -9 1"
  }), React.createElement("path", {
    d: "M16 8c3 -1 6 -1 9 1"
  }), React.createElement("path", {
    d: "M16 11c-2.5 -0.5 -5 -0.5 -7 0.6"
  }), React.createElement("path", {
    d: "M16 11c2.5 -0.5 5 -0.5 7 0.6"
  }), React.createElement("path", {
    d: "M16 14c-3 1 -3 4 0 5s3 4 0 5s-3 4 0 5"
  }), React.createElement("path", {
    d: "M16 14c3 1 3 4 0 5s-3 4 0 5s3 4 0 5"
  }), React.createElement("circle", {
    cx: "16",
    cy: "5",
    r: "1.2"
  }));
  const StatusPip = ({
    status
  }) => {
    const map = {
      active: {
        color: "var(--thread)",
        pulse: true,
        label: "active"
      },
      complete: {
        color: "var(--ok)",
        pulse: false,
        label: "complete"
      },
      failed: {
        color: "var(--danger)",
        pulse: false,
        label: "failed"
      },
      interrupted: {
        color: "var(--warn)",
        pulse: false,
        label: "interrupted"
      },
      open: {
        color: "var(--ink-3)",
        pulse: false,
        label: "open"
      },
      disabled: {
        color: "var(--ink-4)",
        pulse: false,
        label: "disabled"
      },
      ok: {
        color: "var(--ok)",
        pulse: false,
        label: "ok"
      },
      unknown: {
        color: "var(--ink-4)",
        pulse: false,
        label: "unknown"
      }
    };
    const s = map[status] || map.unknown;
    return React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6
      }
    }, React.createElement("span", {
      className: s.pulse ? "pulse" : "",
      style: {
        display: "inline-block",
        width: 7,
        height: 7,
        background: s.color,
        borderRadius: "50%"
      }
    }), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10.5,
        letterSpacing: "0.06em",
        color: "var(--ink-3)",
        textTransform: "uppercase"
      }
    }, s.label));
  };
  const SourceGlyph = ({
    source,
    size = 14
  }) => {
    const p = {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.5,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    };
    switch (source) {
      case "cli":
        return React.createElement("svg", p, React.createElement("path", {
          d: "M5 8l3 3l-3 3"
        }), React.createElement("path", {
          d: "M11 16h6"
        }));
      case "dashboard":
        return React.createElement("svg", p, React.createElement("rect", {
          x: "4",
          y: "5",
          width: "16",
          height: "14",
          rx: "1"
        }), React.createElement("path", {
          d: "M4 9h16"
        }));
      case "gateway":
        return React.createElement("svg", p, React.createElement("path", {
          d: "M4 12c4 -4 12 -4 16 0"
        }), React.createElement("path", {
          d: "M7 12c2 -2 8 -2 10 0"
        }), React.createElement("circle", {
          cx: "12",
          cy: "12",
          r: "1.2"
        }));
      case "cron":
        return React.createElement("svg", p, React.createElement("circle", {
          cx: "12",
          cy: "12",
          r: "7"
        }), React.createElement("path", {
          d: "M12 8v4l3 2"
        }));
      case "subagent":
        return React.createElement("svg", p, React.createElement("circle", {
          cx: "6",
          cy: "7",
          r: "1.5"
        }), React.createElement("circle", {
          cx: "6",
          cy: "17",
          r: "1.5"
        }), React.createElement("circle", {
          cx: "17",
          cy: "12",
          r: "1.5"
        }), React.createElement("path", {
          d: "M7.5 7l8 4"
        }), React.createElement("path", {
          d: "M7.5 17l8 -4"
        }));
      default:
        return React.createElement("svg", p, React.createElement("circle", {
          cx: "12",
          cy: "12",
          r: "5"
        }));
    }
  };
  const LucideIcon = ({
    name,
    size = 16,
    stroke = 1.5
  }) => {
    const paths = {
      map: "M9 3l-6 3v15l6-3 6 3 6-3V3l-6 3-6-3z|M9 3v15|M15 6v15",
      activity: "M22 12h-4l-3 9L9 3l-3 9H2",
      book: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",
      clock: "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18|M12 7v5l3 2",
      layers: "M12 2L2 7l10 5l10-5l-10-5z|M2 17l10 5l10-5|M2 12l10 5l10-5",
      file: "M14 3H6a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V9z|M14 3v6h6",
      search: "M11 18a7 7 0 1 0 0 -14a7 7 0 0 0 0 14z|M21 21l-5 -5",
      download: "M12 3v12|M7 10l5 5l5-5|M5 21h14",
      eye: "M2 12s3.5 -7 10 -7s10 7 10 7s-3.5 7 -10 7s-10 -7 -10 -7|M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0 -6",
      shield: "M12 3l8 3v6c0 5 -4 9 -8 9s-8 -4 -8 -9V6l8 -3z",
      settings: "M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0 -8|M19 12a7 7 0 0 0 -.1 -1.2l2.1 -1.6l-2 -3.4l-2.5 1a7 7 0 0 0 -2 -1.2L14 3h-4l-.5 2.6a7 7 0 0 0 -2 1.2l-2.5 -1l-2 3.4l2.1 1.6a7 7 0 0 0 0 2.4l-2.1 1.6l2 3.4l2.5 -1a7 7 0 0 0 2 1.2L10 21h4l.5 -2.6a7 7 0 0 0 2 -1.2l2.5 1l2 -3.4l-2.1 -1.6c.07 -.4 .1 -.8 .1 -1.2",
      chevron_right: "M9 6l6 6l-6 6",
      chevron_down: "M6 9l6 6l6 -6",
      x: "M6 6l12 12|M18 6l-6 6l-6 6",
      plus: "M12 5v14|M5 12h14",
      sun: "M12 3v2|M12 19v2|M5 5l1.5 1.5|M17.5 17.5L19 19|M3 12h2|M19 12h2|M5 19l1.5 -1.5|M17.5 6.5L19 5|M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0 -8",
      moon: "M21 13a8 8 0 1 1 -10 -10a6 6 0 0 0 10 10",
      filter: "M4 4h16l-6 8v6l-4 2v-8z",
      expand: "M9 3H5a2 2 0 0 0 -2 2v4|M21 9V5a2 2 0 0 0 -2 -2h-4|M3 15v4a2 2 0 0 0 2 2h4|M21 15v4a2 2 0 0 0 -2 2h-4",
      play: "M6 4l14 8l-14 8z",
      network: "M5 4a2 2 0 0 0 -2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2zM5 14a2 2 0 0 0 -2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2z|M8 10v4|M16 10v4|M12 10v4",
      flame: "M12 21c4 0 7 -3 7 -7c0 -3 -2 -5 -3 -7c-1 -2 -1 -4 -1 -4s-2 2 -3 4c-1 -1 -2 -2 -2 -2s-3 4 -3 7c0 4 1 6 5 9z"
    };
    const segs = (paths[name] || "").split("|");
    return React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: stroke,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        flexShrink: 0
      }
    }, segs.map((d, i) => React.createElement("path", {
      key: i,
      d: d
    })));
  };
  Object.assign(window, {
    CrossingGlyph,
    Caduceus,
    StatusPip,
    SourceGlyph,
    LucideIcon
  });
  function MapThread({
    crossings,
    selectedId,
    onSelect,
    thresholdsOnly
  }) {
    const visible = thresholdsOnly ? crossings.filter(c => c.thread === "thresholds") : crossings;
    const W = 760,
      ROW = 56;
    const cx = 360;
    const H = visible.length * ROW + 80;
    const xFor = thread => ({
      main: cx,
      tools: cx + 110,
      delegation: cx - 110,
      thresholds: cx
    })[thread] ?? cx;
    return React.createElement("svg", {
      width: "100%",
      viewBox: `0 0 ${W} ${H}`,
      style: {
        display: "block"
      }
    }, React.createElement("defs", null, React.createElement("pattern", {
      id: "dot",
      x: "0",
      y: "0",
      width: "20",
      height: "20",
      patternUnits: "userSpaceOnUse"
    }, React.createElement("circle", {
      cx: "1",
      cy: "1",
      r: "0.5",
      fill: "var(--ink-5)"
    }))), React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: H,
      fill: "url(#dot)",
      opacity: "0.35"
    }), React.createElement("line", {
      x1: cx,
      y1: "20",
      x2: cx,
      y2: H - 30,
      stroke: "var(--ink)",
      strokeWidth: "1",
      strokeDasharray: "0"
    }), visible.map((c, i) => {
      const y = 50 + i * ROW;
      const x = xFor(c.thread);
      const isActive = c.status === "active";
      const isSelected = c.id === selectedId;
      const isFailed = c.status === "failed";
      const stroke = isFailed ? "var(--danger)" : "var(--ink)";
      return React.createElement("g", {
        key: c.id,
        style: {
          cursor: "pointer"
        },
        onClick: () => onSelect(c.id)
      }, x !== cx && React.createElement("path", {
        d: `M ${cx} ${y} Q ${(cx + x) / 2} ${y} ${x} ${y}`,
        fill: "none",
        stroke: stroke,
        strokeWidth: "1",
        className: isActive ? "thread-active" : "",
        opacity: isFailed ? 0.9 : 0.55
      }), c.thread === "thresholds" && React.createElement("line", {
        x1: cx - 44,
        y1: y,
        x2: cx + 44,
        y2: y,
        stroke: "var(--gold)",
        strokeWidth: "1.25"
      }), React.createElement("circle", {
        cx: x,
        cy: y,
        r: isSelected ? 8 : 5,
        fill: isSelected ? "var(--ink)" : "var(--paper)",
        stroke: stroke,
        strokeWidth: "1.25"
      }), isFailed && React.createElement("circle", {
        cx: x,
        cy: y,
        r: "11",
        fill: "none",
        stroke: "var(--danger)",
        strokeWidth: "0.75",
        strokeDasharray: "2 2"
      }), isActive && React.createElement("circle", {
        cx: x,
        cy: y,
        r: "14",
        fill: "none",
        stroke: "var(--thread)",
        strokeWidth: "1",
        className: "thread-active"
      }), React.createElement("foreignObject", {
        x: x + (x >= cx ? 14 : -34),
        y: y - 10,
        width: "20",
        height: "20"
      }, React.createElement("div", {
        xmlns: "http://www.w3.org/1999/xhtml",
        style: {
          color: stroke
        }
      }, React.createElement(CrossingGlyph, {
        type: c.type,
        size: 20
      }))), React.createElement("text", {
        x: x + (x >= cx ? 40 : -40),
        y: y + 1,
        textAnchor: x >= cx ? "start" : "end",
        fontFamily: "var(--font-mono)",
        fontSize: "11",
        fill: "var(--ink-2)",
        style: {
          letterSpacing: "0.02em"
        }
      }, c.label), React.createElement("text", {
        x: x + (x >= cx ? 40 : -40),
        y: y + 14,
        textAnchor: x >= cx ? "start" : "end",
        fontFamily: "var(--font-mono)",
        fontSize: "10",
        fill: "var(--ink-3)"
      }, c.t, c.dur ? ` · ${(c.dur / 1000).toFixed(2)}s` : ""));
    }), React.createElement("path", {
      d: `M ${cx - 4} ${H - 30} L ${cx} ${H - 22} L ${cx + 4} ${H - 30}`,
      fill: "none",
      stroke: "var(--ink)",
      strokeWidth: "1"
    }));
  }
  function MapCorridor({
    crossings,
    selectedId,
    onSelect,
    thresholdsOnly
  }) {
    const visible = thresholdsOnly ? crossings.filter(c => c.thread === "thresholds") : crossings;
    const COLS = 3;
    const COL_W = 220;
    const ROW_H = 110;
    const PAD_X = 60;
    const PAD_Y = 60;
    const rows = Math.ceil(visible.length / COLS);
    const W = PAD_X * 2 + COLS * COL_W;
    const H = PAD_Y * 2 + rows * ROW_H;
    const positionFor = i => {
      const row = Math.floor(i / COLS);
      const colInRow = i % COLS;
      const col = row % 2 === 0 ? colInRow : COLS - 1 - colInRow;
      return {
        x: PAD_X + col * COL_W + COL_W / 2,
        y: PAD_Y + row * ROW_H + ROW_H / 2,
        row,
        col
      };
    };
    const pts = visible.map((_, i) => positionFor(i));
    return React.createElement("svg", {
      width: "100%",
      viewBox: `0 0 ${W} ${H}`,
      style: {
        display: "block"
      }
    }, React.createElement("defs", null, React.createElement("pattern", {
      id: "grid-corr",
      x: "0",
      y: "0",
      width: "20",
      height: "20",
      patternUnits: "userSpaceOnUse"
    }, React.createElement("path", {
      d: "M 20 0 L 0 0 0 20",
      fill: "none",
      stroke: "var(--ink-5)",
      strokeWidth: "0.4"
    }))), React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: H,
      fill: "url(#grid-corr)",
      opacity: "0.45"
    }), React.createElement("rect", {
      x: PAD_X - 30,
      y: PAD_Y - 30,
      width: W - PAD_X * 2 + 60,
      height: H - PAD_Y * 2 + 60,
      fill: "none",
      stroke: "var(--ink)",
      strokeWidth: "1"
    }), pts.length > 1 && (() => {
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1],
          b = pts[i];
        if (a.row === b.row) {
          d += ` L ${b.x} ${b.y}`;
        } else {
          const bend = a.col === b.col ? 0 : 0;
          const midY = (a.y + b.y) / 2;
          d += ` Q ${a.x} ${midY} ${(a.x + b.x) / 2} ${midY} Q ${b.x} ${midY} ${b.x} ${b.y}`;
        }
      }
      return React.createElement("path", {
        d: d,
        fill: "none",
        stroke: "var(--ink)",
        strokeWidth: "1.25",
        opacity: "0.85"
      });
    })(), visible.map((c, i) => {
      const p = pts[i];
      const isActive = c.status === "active";
      const isFailed = c.status === "failed";
      const isSelected = c.id === selectedId;
      return React.createElement("g", {
        key: c.id,
        style: {
          cursor: "pointer"
        },
        onClick: () => onSelect(c.id)
      }, c.thread === "thresholds" && React.createElement("g", null, React.createElement("line", {
        x1: p.x - 22,
        y1: p.y - 22,
        x2: p.x - 22,
        y2: p.y + 22,
        stroke: "var(--gold)",
        strokeWidth: "1.25"
      }), React.createElement("line", {
        x1: p.x + 22,
        y1: p.y - 22,
        x2: p.x + 22,
        y2: p.y + 22,
        stroke: "var(--gold)",
        strokeWidth: "1.25"
      })), React.createElement("rect", {
        x: p.x - 60,
        y: p.y - 22,
        width: "120",
        height: "44",
        rx: "2",
        fill: "var(--paper)",
        stroke: isSelected ? "var(--ink)" : isFailed ? "var(--danger)" : "var(--line-2)",
        strokeWidth: isSelected ? 1.25 : 0.75
      }), React.createElement("foreignObject", {
        x: p.x - 54,
        y: p.y - 16,
        width: "20",
        height: "20"
      }, React.createElement("div", {
        xmlns: "http://www.w3.org/1999/xhtml",
        style: {
          color: isFailed ? "var(--danger)" : "var(--ink)"
        }
      }, React.createElement(CrossingGlyph, {
        type: c.type,
        size: 18
      }))), React.createElement("text", {
        x: p.x - 30,
        y: p.y - 4,
        fontFamily: "var(--font-mono)",
        fontSize: "10.5",
        fill: "var(--ink)",
        style: {
          letterSpacing: "0.02em"
        }
      }, c.label.slice(0, 16)), React.createElement("text", {
        x: p.x - 30,
        y: p.y + 10,
        fontFamily: "var(--font-mono)",
        fontSize: "9.5",
        fill: "var(--ink-3)"
      }, c.t), isActive && React.createElement("circle", {
        cx: p.x + 50,
        cy: p.y - 12,
        r: "3",
        fill: "var(--thread)",
        className: "pulse"
      }));
    }));
  }
  function MapFlightStrip({
    crossings,
    selectedId,
    onSelect,
    thresholdsOnly
  }) {
    const visible = thresholdsOnly ? crossings.filter(c => c.thread === "thresholds") : crossings;
    const W = Math.max(1100, visible.length * 70);
    const H = 240;
    const baselineY = 150;
    const t0 = 0,
      t1 = visible.length - 1;
    const xFor = i => 60 + i / Math.max(1, t1) * (W - 120);
    return React.createElement("svg", {
      width: "100%",
      viewBox: `0 0 ${W} ${H}`,
      preserveAspectRatio: "xMidYMid meet",
      style: {
        display: "block"
      }
    }, React.createElement("line", {
      x1: "40",
      y1: baselineY,
      x2: W - 40,
      y2: baselineY,
      stroke: "var(--ink)",
      strokeWidth: "1"
    }), visible.map((c, i) => React.createElement("g", {
      key: `tick-${c.id}`
    }, React.createElement("line", {
      x1: xFor(i),
      y1: baselineY - 3,
      x2: xFor(i),
      y2: baselineY + 3,
      stroke: "var(--ink-3)",
      strokeWidth: "0.75"
    }), React.createElement("text", {
      x: xFor(i),
      y: baselineY + 18,
      textAnchor: "middle",
      fontFamily: "var(--font-mono)",
      fontSize: "9",
      fill: "var(--ink-3)"
    }, c.t.slice(3)))), visible.map((c, i) => {
      const x = xFor(i);
      const isThreshold = c.thread === "thresholds";
      const yMark = isThreshold ? 50 : c.thread === "tools" ? 100 : c.thread === "delegation" ? 200 : baselineY;
      const isActive = c.status === "active";
      const isFailed = c.status === "failed";
      const isSelected = c.id === selectedId;
      return React.createElement("g", {
        key: c.id,
        style: {
          cursor: "pointer"
        },
        onClick: () => onSelect(c.id)
      }, React.createElement("line", {
        x1: x,
        y1: baselineY,
        x2: x,
        y2: yMark,
        stroke: isThreshold ? "var(--gold)" : isFailed ? "var(--danger)" : "var(--ink)",
        strokeWidth: isThreshold ? "1.25" : "1",
        strokeDasharray: c.thread === "delegation" ? "2 2" : "0",
        className: isActive ? "thread-active" : ""
      }), React.createElement("circle", {
        cx: x,
        cy: yMark,
        r: isSelected ? 7 : 4.5,
        fill: isSelected ? "var(--ink)" : "var(--paper)",
        stroke: isFailed ? "var(--danger)" : "var(--ink)",
        strokeWidth: "1.25"
      }), React.createElement("foreignObject", {
        x: x - 9,
        y: yMark - 28,
        width: "18",
        height: "18"
      }, React.createElement("div", {
        xmlns: "http://www.w3.org/1999/xhtml",
        style: {
          color: isFailed ? "var(--danger)" : "var(--ink)"
        }
      }, React.createElement(CrossingGlyph, {
        type: c.type,
        size: 18
      }))), isThreshold && React.createElement("text", {
        x: x,
        y: 36,
        textAnchor: "middle",
        fontFamily: "var(--font-mono)",
        fontSize: "9.5",
        fill: "var(--gold)",
        style: {
          letterSpacing: "0.04em"
        }
      }, c.type.toUpperCase().replace("_", " ")));
    }), React.createElement("text", {
      x: "40",
      y: "46",
      fontFamily: "var(--font-mono)",
      fontSize: "9.5",
      fill: "var(--ink-3)",
      style: {
        letterSpacing: "0.06em"
      }
    }, "THRESHOLD"), React.createElement("text", {
      x: "40",
      y: "96",
      fontFamily: "var(--font-mono)",
      fontSize: "9.5",
      fill: "var(--ink-3)",
      style: {
        letterSpacing: "0.06em"
      }
    }, "TOOL"), React.createElement("text", {
      x: "40",
      y: baselineY - 4,
      fontFamily: "var(--font-mono)",
      fontSize: "9.5",
      fill: "var(--ink-3)",
      style: {
        letterSpacing: "0.06em"
      }
    }, "MAIN"), React.createElement("text", {
      x: "40",
      y: "206",
      fontFamily: "var(--font-mono)",
      fontSize: "9.5",
      fill: "var(--ink-3)",
      style: {
        letterSpacing: "0.06em"
      }
    }, "DELEGATION"));
  }
  const LabyrinthMap = ({
    style,
    crossings,
    selectedId,
    onSelect,
    thresholdsOnly
  }) => {
    if (style === "corridor") return React.createElement(MapCorridor, {
      crossings: crossings,
      selectedId: selectedId,
      onSelect: onSelect,
      thresholdsOnly: thresholdsOnly
    });
    if (style === "flight") return React.createElement(MapFlightStrip, {
      crossings: crossings,
      selectedId: selectedId,
      onSelect: onSelect,
      thresholdsOnly: thresholdsOnly
    });
    return React.createElement(MapThread, {
      crossings: crossings,
      selectedId: selectedId,
      onSelect: onSelect,
      thresholdsOnly: thresholdsOnly
    });
  };
  Object.assign(window, {
    LabyrinthMap
  });
  function Inspector({
    crossing,
    redaction,
    journey
  }) {
    if (!crossing) return React.createElement("div", {
      style: {
        padding: 24,
        color: "var(--ink-3)"
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, React.createElement("span", {
      className: "dot"
    }), "Crossing Inspector"), React.createElement("div", {
      style: {
        marginTop: 16,
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 18,
        color: "var(--ink-2)"
      }
    }, "Select a crossing on the map to inspect its evidence."));
    const c = crossing;
    const isFailed = c.status === "failed";
    const isActive = c.status === "active";
    const redact = txt => {
      if (!redaction) return txt;
      return (txt || "").replace(/sk_live_\w{4,}/g, "sk_live_••••••••").replace(/tg_\w+/g, "tg_••••••••").replace(/\b[A-Z0-9]{16,}\b/g, "••••••••");
    };
    return React.createElement("div", {
      style: {
        padding: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }
    }, React.createElement("div", {
      style: {
        padding: "18px 22px 14px",
        borderBottom: "1px solid var(--line)"
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, React.createElement("span", {
      className: "dot"
    }), "Crossing \xB7 ", c.id), React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 8
      }
    }, React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        border: "1px solid var(--ink)",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, React.createElement(CrossingGlyph, {
      type: c.type,
      size: 20
    })), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 500,
        letterSpacing: "0"
      }
    }, c.label, isActive && React.createElement("span", {
      className: "live-cursor"
    })), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 11,
        color: "var(--ink-3)",
        marginTop: 2
      }
    }, c.type.replace("_", " "), " \xB7 ", c.actor, " \u2192 ", c.target)), React.createElement(StatusPip, {
      status: c.status
    }))), React.createElement("div", {
      style: {
        padding: "14px 22px",
        borderBottom: "1px solid var(--line)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14
      }
    }, React.createElement("div", null, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9.5
      }
    }, "started"), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 12,
        marginTop: 2
      }
    }, c.t)), React.createElement("div", null, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9.5
      }
    }, "duration"), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 12,
        marginTop: 2
      }
    }, c.dur ? `${(c.dur / 1000).toFixed(2)}s` : "—")), React.createElement("div", null, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9.5
      }
    }, "thread"), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 12,
        marginTop: 2
      }
    }, c.thread)), React.createElement("div", null, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9.5
      }
    }, "journey"), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 12,
        marginTop: 2,
        color: "var(--ink-3)"
      }
    }, journey?.id?.slice(-8) || "—"))), React.createElement("div", {
      style: {
        padding: "14px 22px",
        flex: 1,
        overflowY: "auto"
      }
    }, c.preview_in && React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9.5
      }
    }, React.createElement("span", {
      className: "dot"
    }), "input"), React.createElement("pre", {
      style: {
        margin: "6px 0 0",
        padding: 12,
        background: "var(--vellum)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        fontSize: 11.5,
        lineHeight: 1.55,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        color: "var(--ink-2)"
      }
    }, redact(c.preview_in))), c.preview_out && React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9.5
      }
    }, React.createElement("span", {
      className: "dot"
    }), "output", isFailed ? " · failed" : "", isActive ? " · streaming" : ""), React.createElement("pre", {
      style: {
        margin: "6px 0 0",
        padding: 12,
        background: isFailed ? "rgba(138,47,31,0.05)" : "var(--vellum)",
        border: `1px solid ${isFailed ? "var(--danger)" : "var(--line)"}`,
        borderRadius: 4,
        fontSize: 11.5,
        lineHeight: 1.55,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        color: isFailed ? "var(--danger)" : "var(--ink-2)"
      }
    }, redact(c.preview_out), isActive && React.createElement("span", {
      className: "live-cursor"
    }))), React.createElement("div", {
      style: {
        marginBottom: 14
      }
    }, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9.5
      }
    }, React.createElement("span", {
      className: "dot"
    }), "evidence"), React.createElement("div", {
      style: {
        marginTop: 6,
        display: "flex",
        flexDirection: "column",
        gap: 4
      }
    }, React.createElement(EvidenceRow, {
      label: "message",
      value: `m${c.id.slice(1)} · session.db`
    }), c.thread === "tools" && React.createElement(EvidenceRow, {
      label: "tool log",
      value: `~/.hermes/logs/tools/${c.label}.jsonl`
    }), c.thread === "delegation" && React.createElement(EvidenceRow, {
      label: "child session",
      value: "j-9c11 / j-a2d4"
    }), c.type === "redaction" && React.createElement(EvidenceRow, {
      label: "hook",
      value: "agent.redact.redact_sensitive_text"
    }), c.type === "approval" && React.createElement(EvidenceRow, {
      label: "approval log",
      value: `~/.hermes/logs/approvals/${c.t.replace(/:/g, "")}.json`
    }))), isFailed && React.createElement("div", {
      style: {
        padding: 10,
        border: "1px solid var(--danger)",
        borderRadius: 4,
        background: "rgba(138,47,31,0.04)"
      }
    }, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9.5,
        color: "var(--danger)"
      }
    }, React.createElement("span", {
      className: "dot"
    }), "guidepost"), React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--ink-2)",
        marginTop: 4,
        fontFamily: "var(--font-display)",
        fontStyle: "italic"
      }
    }, "The thread doubled back here. Look for the same call attempted again before this crossing."))));
  }
  function EvidenceRow({
    label,
    value
  }) {
    return React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 8px",
        background: "var(--paper-2)",
        borderRadius: 2
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9.5,
        color: "var(--ink-3)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        minWidth: 70
      }
    }, label), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 11,
        color: "var(--ink-2)"
      }
    }, value));
  }
  function GuidepostsPanel({
    guideposts,
    onJump,
    asOverlay,
    onClose
  }) {
    const sevColor = s => s === "warning" ? "var(--danger)" : s === "notice" ? "var(--warn)" : "var(--ink-3)";
    return React.createElement("div", {
      style: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: asOverlay ? "var(--vellum)" : "transparent",
        boxShadow: asOverlay ? "var(--shadow-3)" : "none"
      }
    }, React.createElement("div", {
      style: {
        padding: "16px 20px 12px",
        borderBottom: "1px solid var(--line)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12
      }
    }, React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, React.createElement("span", {
      className: "dot"
    }), "Guideposts"), React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 17,
        marginTop: 4,
        color: "var(--ink)",
        lineHeight: 1.2
      }
    }, "What deserves your attention")), asOverlay && onClose && React.createElement("button", {
      onClick: onClose,
      style: {
        flexShrink: 0,
        background: "none",
        border: "1px solid var(--line)",
        padding: 6,
        borderRadius: 2,
        cursor: "pointer",
        color: "var(--ink-2)"
      }
    }, React.createElement(LucideIcon, {
      name: "x",
      size: 14
    }))), React.createElement("div", {
      style: {
        flex: 1,
        overflowY: "auto"
      }
    }, guideposts.map((g, i) => React.createElement("div", {
      key: i,
      onClick: () => onJump && onJump(g),
      style: {
        padding: "14px 20px",
        borderBottom: "1px solid var(--line)",
        cursor: onJump ? "pointer" : "default"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 6
      }
    }, React.createElement("span", {
      style: {
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: sevColor(g.severity)
      }
    }), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9.5,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: sevColor(g.severity)
      }
    }, g.severity), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9.5,
        color: "var(--ink-4)",
        letterSpacing: "0.06em",
        textTransform: "uppercase"
      }
    }, "\xB7 ", g.kind)), React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500,
        lineHeight: 1.4
      }
    }, g.title), React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--ink-2)",
        marginTop: 4,
        lineHeight: 1.5
      }
    }, g.detail), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: "var(--ink-3)",
        marginTop: 6
      }
    }, g.journey.slice(-8), " \xB7 ", g.evidence.length, " evidence")))));
  }
  Object.assign(window, {
    Inspector,
    GuidepostsPanel
  });
  function JourneyIndex({
    journeys,
    selectedId,
    onSelect,
    dataset,
    onSetDataset
  }) {
    const [filter, setFilter] = uiUseState("");
    const [src, setSrc] = uiUseState("all");
    const sources = ["all", "cli", "dashboard", "gateway", "cron", "subagent"];
    const filtered = journeys.filter(j => (src === "all" || j.source === src) && (filter === "" || j.title.toLowerCase().includes(filter.toLowerCase()) || j.id.includes(filter)));
    return React.createElement("div", {
      style: {
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }
    }, React.createElement("div", {
      style: {
        padding: "18px 22px 14px",
        borderBottom: "1px solid var(--line)"
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, React.createElement("span", {
      className: "dot"
    }), "Journey Index \xB7 ", journeys.length), React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginTop: 6
      }
    }, React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 22,
        letterSpacing: "0"
      }
    }, "Where the agent has been"), React.createElement("div", {
      style: {
        display: "flex",
        gap: 4
      }
    }, React.createElement("button", {
      onClick: () => onSetDataset("debug"),
      style: {
        padding: "4px 8px",
        fontSize: 10.5,
        background: dataset === "debug" ? "var(--ink)" : "transparent",
        color: dataset === "debug" ? "var(--paper)" : "var(--ink-2)",
        border: "1px solid var(--ink)",
        borderRadius: 2,
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.04em",
        textTransform: "uppercase"
      }
    }, "Debug"), React.createElement("button", {
      onClick: () => onSetDataset("clean"),
      style: {
        padding: "4px 8px",
        fontSize: 10.5,
        background: dataset === "clean" ? "var(--ink)" : "transparent",
        color: dataset === "clean" ? "var(--paper)" : "var(--ink-2)",
        border: "1px solid var(--ink)",
        borderRadius: 2,
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.04em",
        textTransform: "uppercase"
      }
    }, "Clean"))), React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginTop: 12,
        alignItems: "center"
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 6,
        border: "1px solid var(--line)",
        padding: "5px 8px",
        borderRadius: 2,
        background: "var(--vellum)"
      }
    }, React.createElement(LucideIcon, {
      name: "search",
      size: 13
    }), React.createElement("input", {
      value: filter,
      onChange: e => setFilter(e.target.value),
      placeholder: "search journeys, models, prompts\u2026",
      style: {
        border: "none",
        outline: "none",
        background: "transparent",
        flex: 1,
        fontSize: 12,
        fontFamily: "var(--font-mono)",
        color: "var(--ink)"
      }
    }))), React.createElement("div", {
      style: {
        display: "flex",
        gap: 4,
        marginTop: 8,
        flexWrap: "wrap"
      }
    }, sources.map(s => React.createElement("button", {
      key: s,
      onClick: () => setSrc(s),
      style: {
        padding: "3px 7px",
        fontSize: 10,
        background: src === s ? "var(--ink)" : "transparent",
        color: src === s ? "var(--paper)" : "var(--ink-3)",
        border: "1px solid var(--line-2)",
        borderRadius: 2,
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.04em",
        textTransform: "uppercase"
      }
    }, s)))), React.createElement("div", {
      style: {
        flex: 1,
        overflowY: "auto"
      }
    }, filtered.map(j => {
      const sel = j.id === selectedId;
      return React.createElement("div", {
        key: j.id,
        onClick: () => onSelect(j.id),
        style: {
          padding: "14px 22px",
          borderBottom: "1px solid var(--line)",
          cursor: "pointer",
          background: sel ? "var(--paper-2)" : "transparent",
          borderLeft: sel ? "2px solid var(--ink)" : "2px solid transparent"
        }
      }, React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 4
        }
      }, React.createElement("span", {
        style: {
          color: "var(--ink-2)"
        }
      }, React.createElement(SourceGlyph, {
        source: j.source
      })), React.createElement("span", {
        className: "mono",
        style: {
          fontSize: 10,
          color: "var(--ink-3)",
          letterSpacing: "0.04em",
          textTransform: "uppercase"
        }
      }, j.source), React.createElement("span", {
        className: "mono",
        style: {
          fontSize: 10,
          color: "var(--ink-4)"
        }
      }, "\xB7"), React.createElement("span", {
        className: "mono",
        style: {
          fontSize: 10,
          color: "var(--ink-3)"
        }
      }, j.id.slice(-8)), React.createElement("div", {
        style: {
          flex: 1
        }
      }), React.createElement(StatusPip, {
        status: j.status
      })), React.createElement("div", {
        style: {
          fontSize: 12.5,
          fontWeight: 450,
          lineHeight: 1.4,
          color: "var(--ink)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }
      }, j.title), React.createElement("div", {
        style: {
          display: "flex",
          gap: 14,
          marginTop: 6,
          flexWrap: "wrap"
        }
      }, React.createElement(Meta, {
        label: "t",
        value: j.started_at.split(" ")[1]
      }), React.createElement(Meta, {
        label: "dur",
        value: j.duration_label
      }), React.createElement(Meta, {
        label: "msg",
        value: j.messages
      }), React.createElement(Meta, {
        label: "tool",
        value: j.tool_calls
      }), j.failures > 0 && React.createElement(Meta, {
        label: "fail",
        value: j.failures,
        danger: true
      }), React.createElement(Meta, {
        label: "thr",
        value: j.thresholds
      })));
    })));
  }
  function Meta({
    label,
    value,
    danger
  }) {
    return React.createElement("span", {
      style: {
        display: "inline-flex",
        gap: 4,
        alignItems: "baseline"
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9.5,
        color: "var(--ink-4)",
        letterSpacing: "0.06em",
        textTransform: "uppercase"
      }
    }, label), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10.5,
        color: danger ? "var(--danger)" : "var(--ink-2)"
      }
    }, value));
  }
  function JourneyHeader({
    j,
    mapStyle,
    onMapStyle,
    thresholdsOnly,
    onThresholdsOnly
  }) {
    if (!j) return null;
    return React.createElement("div", {
      style: {
        padding: "16px 24px 12px",
        borderBottom: "1px solid var(--line)"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 6
      }
    }, React.createElement("span", {
      style: {
        color: "var(--ink-2)"
      }
    }, React.createElement(SourceGlyph, {
      source: j.source,
      size: 16
    })), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10.5,
        color: "var(--ink-3)",
        letterSpacing: "0.06em",
        textTransform: "uppercase"
      }
    }, j.source, " \xB7 ", j.id), React.createElement("div", {
      style: {
        flex: 1
      }
    }), React.createElement(StatusPip, {
      status: j.status
    })), React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap"
      }
    }, React.createElement("div", {
      style: {
        flex: "1 1 460px",
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 26,
        letterSpacing: "0",
        lineHeight: 1.15,
        color: "var(--ink)"
      }
    }, j.title), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 11,
        color: "var(--ink-3)",
        marginTop: 6
      }
    }, "\u201C", j.root_prompt, "\u201D")), React.createElement("div", {
      style: {
        display: "flex",
        gap: 18,
        flexWrap: "wrap"
      }
    }, React.createElement(Stat, {
      label: "elapsed",
      value: j.duration_label,
      live: j.status === "active"
    }), React.createElement(Stat, {
      label: "model",
      value: j.model_sequence.join(" → ")
    }), React.createElement(Stat, {
      label: "cost",
      value: j.cost
    }), React.createElement(Stat, {
      label: "tokens",
      value: `${(j.tokens.input / 1000).toFixed(1)}k in · ${(j.tokens.output / 1000).toFixed(1)}k out`
    }))), React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 14
      }
    }, React.createElement("span", {
      className: "eyebrow"
    }, "map"), React.createElement("div", {
      style: {
        display: "flex",
        border: "1px solid var(--ink)",
        borderRadius: 2,
        overflow: "hidden"
      }
    }, [["thread", "Thread"], ["corridor", "Corridor"], ["flight", "Flight strip"]].map(([k, l]) => React.createElement("button", {
      key: k,
      onClick: () => onMapStyle(k),
      style: {
        padding: "4px 10px",
        fontSize: 10.5,
        background: mapStyle === k ? "var(--ink)" : "transparent",
        color: mapStyle === k ? "var(--paper)" : "var(--ink-2)",
        border: "none",
        borderRight: k !== "flight" ? "1px solid var(--ink)" : "none",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.04em",
        textTransform: "uppercase"
      }
    }, l))), React.createElement("div", {
      style: {
        flex: 1
      }
    }), React.createElement("label", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        color: "var(--ink-2)",
        cursor: "pointer"
      }
    }, React.createElement("input", {
      type: "checkbox",
      checked: thresholdsOnly,
      onChange: e => onThresholdsOnly(e.target.checked),
      style: {
        accentColor: "var(--ink)"
      }
    }), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10.5,
        letterSpacing: "0.04em",
        textTransform: "uppercase"
      }
    }, "Thresholds only"))));
  }
  function Stat({
    label,
    value,
    live
  }) {
    return React.createElement("div", null, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9.5
      }
    }, label), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 12,
        color: "var(--ink)",
        marginTop: 2
      }
    }, value, live && React.createElement("span", {
      className: "live-cursor"
    })));
  }
  function SkillAtlas({
    skills
  }) {
    const grouped = skills.reduce((acc, s) => {
      (acc[s.source] = acc[s.source] || []).push(s);
      return acc;
    }, {});
    const sources = ["user", "bundled", "optional", "external"];
    return React.createElement("div", {
      style: {
        padding: 28,
        height: "100%",
        overflowY: "auto"
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, React.createElement("span", {
      className: "dot"
    }), "Skill Atlas \xB7 ", skills.length, " skills"), React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 30,
        letterSpacing: "0",
        marginTop: 4,
        marginBottom: 4
      }
    }, "The agent's evolving repertoire"), React.createElement("p", {
      style: {
        color: "var(--ink-3)",
        fontSize: 13,
        maxWidth: 620,
        marginBottom: 28
      }
    }, "Skills are procedural memory \u2014 capabilities Hermes creates from experience and improves during use. Disabled skills are kept; they do not run."), sources.map(src => grouped[src] && React.createElement("div", {
      key: src,
      style: {
        marginBottom: 32
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        marginBottom: 12,
        paddingBottom: 6,
        borderBottom: "1px solid var(--ink)"
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, src), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10.5,
        color: "var(--ink-3)"
      }
    }, grouped[src].length, " skills")), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 0,
        borderLeft: "1px solid var(--line)",
        borderTop: "1px solid var(--line)"
      }
    }, grouped[src].map(s => React.createElement("div", {
      key: s.name,
      style: {
        padding: "14px 16px",
        borderRight: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        background: s.enabled ? "var(--paper)" : "var(--paper-2)",
        opacity: s.enabled ? 1 : 0.7
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 6
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: "var(--ink)"
      }
    }, s.name), React.createElement("div", {
      style: {
        flex: 1
      }
    }), React.createElement(StatusPip, {
      status: s.enabled ? "ok" : "disabled"
    })), React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--ink-2)",
        lineHeight: 1.45,
        minHeight: 36
      }
    }, s.desc), React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        marginTop: 8
      }
    }, React.createElement(Meta, {
      label: "cat",
      value: s.category
    }), React.createElement(Meta, {
      label: "uses",
      value: s.uses
    }), React.createElement(Meta, {
      label: "files",
      value: s.files
    })), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9.5,
        color: "var(--ink-4)",
        marginTop: 6,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, s.path), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9.5,
        color: "var(--ink-3)",
        marginTop: 2
      }
    }, "modified ", s.modified)))))));
  }
  function CronGate({
    cron
  }) {
    return React.createElement("div", {
      style: {
        padding: 28,
        height: "100%",
        overflowY: "auto"
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, React.createElement("span", {
      className: "dot"
    }), "Cron Gate \xB7 ", cron.length, " jobs"), React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 30,
        letterSpacing: "0",
        marginTop: 4
      }
    }, "Scheduled crossings into the unattended hours"), React.createElement("p", {
      style: {
        color: "var(--ink-3)",
        fontSize: 13,
        maxWidth: 620,
        marginTop: 4,
        marginBottom: 24
      }
    }, "Jobs that begin without a human prompt. Each run becomes a journey."), React.createElement("div", {
      style: {
        border: "1px solid var(--ink)"
      }
    }, React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "32px 1fr 130px 120px 130px 90px",
        gap: 0,
        borderBottom: "1px solid var(--ink)",
        background: "var(--paper-2)"
      }
    }, ["", "job", "schedule", "next run", "last run", "status"].map((h, i) => React.createElement("div", {
      key: i,
      className: "eyebrow",
      style: {
        padding: "8px 12px",
        fontSize: 9.5,
        borderRight: i < 5 ? "1px solid var(--line)" : "none"
      }
    }, h))), cron.map((j, i) => React.createElement("div", {
      key: j.id,
      style: {
        display: "grid",
        gridTemplateColumns: "32px 1fr 130px 120px 130px 90px",
        borderBottom: i < cron.length - 1 ? "1px solid var(--line)" : "none",
        background: j.status === "failed" ? "rgba(138,47,31,0.04)" : "transparent"
      }
    }, React.createElement("div", {
      style: {
        padding: "12px",
        borderRight: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink-2)"
      }
    }, React.createElement(SourceGlyph, {
      source: "cron",
      size: 14
    })), React.createElement("div", {
      style: {
        padding: "12px",
        borderRight: "1px solid var(--line)"
      }
    }, React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 12,
        color: "var(--ink)",
        fontWeight: 500
      }
    }, j.name), React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        marginTop: 4,
        flexWrap: "wrap"
      }
    }, React.createElement(Meta, {
      label: "model",
      value: j.model
    }), React.createElement(Meta, {
      label: "deliver",
      value: j.deliver
    }), React.createElement(Meta, {
      label: "skills",
      value: j.skills.length ? j.skills.join(", ") : "—"
    })), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9.5,
        color: "var(--ink-3)",
        marginTop: 4
      }
    }, j.workdir), j.error && React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--danger)",
        marginTop: 4,
        fontStyle: "italic"
      }
    }, j.error)), React.createElement("div", {
      style: {
        padding: "12px",
        borderRight: "1px solid var(--line)"
      },
      className: "mono"
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--ink-2)"
      }
    }, j.schedule), React.createElement("div", {
      style: {
        fontSize: 10,
        color: "var(--ink-3)",
        marginTop: 2
      }
    }, j.display)), React.createElement("div", {
      style: {
        padding: "12px",
        borderRight: "1px solid var(--line)"
      },
      className: "mono"
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        color: j.status === "failed" ? "var(--danger)" : "var(--ink-2)"
      }
    }, j.next)), React.createElement("div", {
      style: {
        padding: "12px",
        borderRight: "1px solid var(--line)"
      },
      className: "mono"
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--ink-2)"
      }
    }, j.last)), React.createElement("div", {
      style: {
        padding: "12px",
        display: "flex",
        alignItems: "center"
      }
    }, React.createElement(StatusPip, {
      status: j.status
    }))))));
  }
  function ModelFerry({
    journeys
  }) {
    const switches = [{
      from: "hermes-4-70b",
      to: "claude-sonnet-4.5",
      cause: "2 tool failures · ctx 92%",
      journey: "j-7f2a",
      at: "14:05:02"
    }, {
      from: "—",
      to: "minimax-m2.7",
      cause: "subagent spawn",
      journey: "j-9c11",
      at: "14:09:31"
    }, {
      from: "—",
      to: "claude-sonnet-4.5",
      cause: "subagent spawn",
      journey: "j-a2d4",
      at: "14:21:11"
    }];
    const providers = [{
      name: "nous portal",
      journeys: 6,
      tokens: "412k",
      status: "ok"
    }, {
      name: "anthropic",
      journeys: 1,
      tokens: "31k",
      status: "ok"
    }, {
      name: "minimax",
      journeys: 1,
      tokens: "14k",
      status: "ok"
    }, {
      name: "openrouter",
      journeys: 0,
      tokens: "0",
      status: "unknown"
    }];
    return React.createElement("div", {
      style: {
        padding: 28,
        height: "100%",
        overflowY: "auto"
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, React.createElement("span", {
      className: "dot"
    }), "Model Ferry \xB7 Crossroads"), React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 30,
        letterSpacing: "0",
        marginTop: 4,
        marginBottom: 24
      }
    }, "Which model carried which crossing"), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 32
      }
    }, React.createElement("div", null, React.createElement("div", {
      style: {
        paddingBottom: 6,
        borderBottom: "1px solid var(--ink)",
        marginBottom: 12
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, "recent transitions")), switches.map((s, i) => React.createElement("div", {
      key: i,
      style: {
        padding: "12px 0",
        borderBottom: i < switches.length - 1 ? "1px solid var(--line)" : "none"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 11,
        color: "var(--ink-3)"
      }
    }, s.from), React.createElement("span", {
      style: {
        color: "var(--ink-2)"
      }
    }, React.createElement(CrossingGlyph, {
      type: "model_switch",
      size: 16
    })), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 12,
        color: "var(--ink)",
        fontWeight: 500
      }
    }, s.to), React.createElement("div", {
      style: {
        flex: 1
      }
    }), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10.5,
        color: "var(--ink-3)"
      }
    }, s.at)), React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--ink-2)",
        marginTop: 4,
        fontStyle: "italic",
        fontFamily: "var(--font-display)"
      }
    }, s.cause), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: "var(--ink-4)",
        marginTop: 2
      }
    }, "journey ", s.journey)))), React.createElement("div", null, React.createElement("div", {
      style: {
        paddingBottom: 6,
        borderBottom: "1px solid var(--ink)",
        marginBottom: 12
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, "providers seen")), providers.map((p, i) => React.createElement("div", {
      key: p.name,
      style: {
        padding: "12px 0",
        borderBottom: i < providers.length - 1 ? "1px solid var(--line)" : "none",
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 12,
        color: "var(--ink)",
        fontWeight: 500,
        minWidth: 110
      }
    }, p.name), React.createElement(Meta, {
      label: "journeys",
      value: p.journeys
    }), React.createElement(Meta, {
      label: "tokens",
      value: p.tokens
    }), React.createElement("div", {
      style: {
        flex: 1
      }
    }), React.createElement(StatusPip, {
      status: p.status
    }))))));
  }
  function MemoryMap() {
    return React.createElement("div", {
      style: {
        padding: 28,
        height: "100%",
        overflowY: "auto"
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, React.createElement("span", {
      className: "dot"
    }), "Memory & Context"), React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 30,
        letterSpacing: "0",
        marginTop: 4,
        marginBottom: 24
      }
    }, "What the agent carried, what it dropped"), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 0,
        border: "1px solid var(--ink)"
      }
    }, [{
      l: "provider",
      v: "qdrant",
      sub: "local, ~/.hermes/memory"
    }, {
      l: "vectors",
      v: "12,408",
      sub: "+38 today"
    }, {
      l: "compressions",
      v: "1",
      sub: "today, j-7f2a · 14:25"
    }, {
      l: "context limit",
      v: "200k",
      sub: "claude-sonnet-4.5"
    }, {
      l: "writes today",
      v: "6",
      sub: "5 user, 1 hook"
    }, {
      l: "skipped",
      v: "2",
      sub: "thresholds prevented write"
    }].map((c, i) => React.createElement("div", {
      key: i,
      style: {
        padding: 20,
        borderRight: i % 3 < 2 ? "1px solid var(--line)" : "none",
        borderBottom: i < 3 ? "1px solid var(--line)" : "none"
      }
    }, React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 9.5
      }
    }, c.l), React.createElement("div", {
      style: {
        fontSize: 28,
        fontWeight: 450,
        letterSpacing: "0",
        marginTop: 6,
        fontFamily: "var(--font-display)",
        fontStyle: "italic"
      }
    }, c.v), React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10.5,
        color: "var(--ink-3)",
        marginTop: 4
      }
    }, c.sub)))), React.createElement("div", {
      style: {
        marginTop: 32
      }
    }, React.createElement("div", {
      className: "eyebrow",
      style: {
        paddingBottom: 6,
        borderBottom: "1px solid var(--ink)"
      }
    }, "recent reads & writes"), [{
      op: "search",
      q: "billing reconciliation skill failures",
      hits: 3,
      t: "14:02:13",
      j: "j-7f2a"
    }, {
      op: "write",
      q: "stripe webhook v2026-03-15 nests charges",
      t: "14:36:12",
      j: "j-7f2a"
    }, {
      op: "search",
      q: "yesterday's ops events",
      hits: 12,
      t: "09:00:03",
      j: "j-3e91"
    }, {
      op: "skip",
      q: "redacted secret — not stored",
      t: "14:04:12",
      j: "j-7f2a"
    }].map((r, i) => React.createElement("div", {
      key: i,
      style: {
        padding: "12px 0",
        borderBottom: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: "var(--ink-3)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        minWidth: 60
      }
    }, r.op), React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--ink)",
        fontStyle: r.op === "skip" ? "italic" : "normal",
        flex: 1
      }
    }, r.q), r.hits != null && React.createElement(Meta, {
      label: "hits",
      value: r.hits
    }), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10.5,
        color: "var(--ink-3)"
      }
    }, r.t), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: "var(--ink-4)"
      }
    }, r.j)))));
  }
  function LabyrinthReport({
    journey,
    crossings,
    guideposts,
    redaction
  }) {
    if (!journey) return null;
    const redact = txt => redaction ? (txt || "").replace(/sk_live_\w+/g, "sk_live_••••••••") : txt;
    return React.createElement("div", {
      style: {
        padding: 28,
        height: "100%",
        overflowY: "auto",
        maxWidth: 880
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, React.createElement("span", {
      className: "dot"
    }), "Labyrinth Report \xB7 redacted markdown"), React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, React.createElement("button", {
      style: btnSecondary
    }, React.createElement(LucideIcon, {
      name: "download",
      size: 13
    }), " \xA0", journey.id.slice(-8), ".md"), React.createElement("button", {
      style: btnPrimary
    }, React.createElement(LucideIcon, {
      name: "download",
      size: 13
    }), " \xA0", journey.id.slice(-8), ".json"))), React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 30,
        letterSpacing: "0",
        marginTop: 8,
        marginBottom: 8
      }
    }, "Hermes Labyrinth Report \u2014 ", journey.id), React.createElement("hr", {
      className: "hardline",
      style: {
        marginBottom: 18
      }
    }), React.createElement(Section, {
      title: "Journey"
    }, React.createElement(KV, {
      k: "source",
      v: journey.source
    }), React.createElement(KV, {
      k: "status",
      v: journey.status
    }), React.createElement(KV, {
      k: "model",
      v: journey.model_sequence.join(" → ")
    }), React.createElement(KV, {
      k: "started",
      v: journey.started_at
    }), React.createElement(KV, {
      k: "duration",
      v: journey.duration_label
    }), React.createElement(KV, {
      k: "messages",
      v: journey.messages
    }), React.createElement(KV, {
      k: "tool calls",
      v: journey.tool_calls
    }), React.createElement(KV, {
      k: "cost",
      v: journey.cost
    }), React.createElement(KV, {
      k: "summary",
      v: redact(journey.title)
    })), React.createElement(Section, {
      title: "Guideposts"
    }, guideposts.length === 0 ? React.createElement("p", {
      style: {
        color: "var(--ink-3)"
      }
    }, "No guideposts generated.") : guideposts.map((g, i) => React.createElement("div", {
      key: i,
      style: {
        padding: "6px 0",
        display: "flex",
        gap: 8
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10.5,
        color: "var(--ink-3)",
        minWidth: 70,
        textTransform: "uppercase",
        letterSpacing: "0.04em"
      }
    }, "[", g.severity, "]"), React.createElement("span", {
      style: {
        fontSize: 12.5
      }
    }, g.title)))), React.createElement(Section, {
      title: `Crossings (${crossings.length})`
    }, crossings.slice(0, 12).map(c => React.createElement("div", {
      key: c.id,
      style: {
        padding: "6px 0",
        borderBottom: "1px dotted var(--line)"
      }
    }, React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 11,
        color: "var(--ink-2)"
      }
    }, c.type, " / ", c.status, ": ", React.createElement("span", {
      style: {
        color: "var(--ink)"
      }
    }, c.label)), (c.preview_out || c.preview_in) && React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10.5,
        color: "var(--ink-3)",
        marginTop: 2,
        paddingLeft: 12
      }
    }, "\u21B3 ", redact(c.preview_out || c.preview_in).slice(0, 140))))), React.createElement(Section, {
      title: "Missing data policy"
    }, React.createElement("p", {
      style: {
        fontSize: 12.5,
        color: "var(--ink-2)",
        lineHeight: 1.6,
        fontFamily: "var(--font-display)",
        fontStyle: "italic"
      }
    }, "Unknown fields were left unknown. This report is generated from local Hermes state and redacted before export.")));
  }
  function Section({
    title,
    children
  }) {
    return React.createElement("div", {
      style: {
        marginBottom: 24
      }
    }, React.createElement("div", {
      className: "eyebrow",
      style: {
        paddingBottom: 6,
        borderBottom: "1px solid var(--ink)",
        marginBottom: 10
      }
    }, title), children);
  }
  function KV({
    k,
    v
  }) {
    return React.createElement("div", {
      style: {
        display: "flex",
        padding: "4px 0",
        borderBottom: "1px dotted var(--line)"
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10.5,
        color: "var(--ink-3)",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        minWidth: 110
      }
    }, k), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 11.5,
        color: "var(--ink)"
      }
    }, v));
  }
  const btnPrimary = {
    padding: "6px 12px",
    fontSize: 11,
    background: "var(--ink)",
    color: "var(--paper)",
    border: "1px solid var(--ink)",
    borderRadius: 2,
    cursor: "pointer",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    display: "inline-flex",
    alignItems: "center",
    gap: 4
  };
  const btnSecondary = {
    ...btnPrimary,
    background: "transparent",
    color: "var(--ink)"
  };
  Object.assign(window, {
    JourneyIndex,
    JourneyHeader,
    SkillAtlas,
    CronGate,
    ModelFerry,
    MemoryMap,
    LabyrinthReport
  });
  function useTweaks(defaults) {
    const [values, setValues] = React.useState(defaults);
    const setTweak = React.useCallback((key, val) => setValues(prev => ({
      ...prev,
      [key]: val
    })), []);
    return [values, setTweak];
  }
  function TweaksPanel() {
    return null;
  }
  function TweakSection() {
    return null;
  }
  function TweakRadio() {
    return null;
  }
  function TweakToggle() {
    return null;
  }
  const TWEAK_DEFAULTS = {
    "theme": "dark",
    "mapStyle": "thread",
    "redaction": true,
    "myth": true,
    "thresholdsOnly": false,
    "density": "comfortable",
    "dataset": "debug",
    "_v": 2
  };
  function LabyrinthExperience({
    data
  }) {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [route, setRoute] = useState("labyrinth");
    const [selectedJourneyId, setSelectedJourneyId] = useState(t.dataset === "debug" ? D.debugJourneyId || "j-2026-04-26-cli-7f2a" : D.cleanJourneyId || "j-2026-04-26-cron-3e91");
    const [selectedCrossingId, setSelectedCrossingId] = useState("c08");
    const [showGuideposts, setShowGuideposts] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => {
      const id = setInterval(() => setTick(x => x + 1), 1000);
      return () => clearInterval(id);
    }, []);
    useEffect(() => {
      if (t.dataset === "debug") setSelectedJourneyId(D.debugJourneyId || D.journeys[0]?.id || null);else setSelectedJourneyId(D.cleanJourneyId || D.journeys.find(j => j.status === "complete")?.id || D.journeys[0]?.id || null);
    }, [t.dataset]);
    const D = data || SAMPLE_DATA;
    const journeys = D.journeys;
    const journey = journeys.find(j => j.id === selectedJourneyId);
    const crossings = useMemo(() => {
      if (!journey) return [];
      const mapped = D.crossingsByJourney && D.crossingsByJourney[journey.id];
      if (mapped) return mapped;
      if (journey.id.includes("7f2a")) return D.debugCrossings || [];
      if (journey.id.includes("3e91")) return D.cleanCrossings || [];
      return [{
        id: "x01",
        type: "prompt",
        label: "User prompt",
        actor: "you",
        target: "agent_loop",
        t: journey.started_at.split(" ")[1],
        dur: null,
        status: "complete",
        thread: "main",
        preview_in: journey.root_prompt,
        preview_out: ""
      }, {
        id: "x02",
        type: "tool_call",
        label: "memory.search",
        actor: "agent",
        target: "qdrant",
        t: journey.started_at.split(" ")[1],
        dur: 320,
        status: "complete",
        thread: "tools",
        preview_in: "",
        preview_out: ""
      }, {
        id: "x03",
        type: "assistant_response",
        label: "Assistant",
        actor: "agent",
        target: "you",
        t: journey.started_at.split(" ")[1],
        dur: null,
        status: journey.status === "failed" ? "failed" : "complete",
        thread: "main",
        preview_in: "",
        preview_out: journey.end_reason === "workdir_missing" ? "ENOENT: ~/code/missing-dir" : "Replied."
      }];
    }, [journey, D]);
    const crossing = crossings.find(c => c.id === selectedCrossingId) || crossings[0];
    useEffect(() => {
      if (crossings.length && !crossings.find(c => c.id === selectedCrossingId)) {
        setSelectedCrossingId(crossings[Math.min(7, crossings.length - 1)].id);
      }
    }, [crossings.map(c => c.id).join(",")]);
    return React.createElement("div", {
      className: `hl-root ${t.theme === "dark" ? "hl-theme-ink" : ""} ${t.myth ? "hl-myth-on" : ""} ${t.density === "compact" ? "hl-density-compact" : ""}`,
      "data-screen-label": "00 Labyrinth",
      style: {
        display: "grid",
        gridTemplateColumns: "56px 340px 1fr 380px",
        gridTemplateRows: "56px 1fr 28px",
        height: "100vh",
        overflow: "hidden",
        position: "relative"
      }
    }, React.createElement(TopChrome, {
      route: route,
      onRoute: setRoute,
      journey: journey,
      crossingsCount: crossings.length,
      guidepostCount: D.guideposts.length,
      onToggleGuideposts: () => setShowGuideposts(x => !x)
    }), React.createElement(LeftNav, {
      route: route,
      onRoute: setRoute
    }), route === "labyrinth" && React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        gridColumn: "2 / 3",
        gridRow: "2 / 3",
        borderRight: "1px solid var(--ink)",
        overflow: "hidden",
        background: "var(--paper)"
      }
    }, React.createElement(JourneyIndex, {
      journeys: journeys,
      selectedId: selectedJourneyId,
      onSelect: setSelectedJourneyId,
      dataset: t.dataset,
      onSetDataset: d => setTweak('dataset', d)
    })), React.createElement("div", {
      style: {
        gridColumn: "3 / 4",
        gridRow: "2 / 3",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "var(--paper)"
      }
    }, React.createElement(JourneyHeader, {
      j: journey,
      mapStyle: t.mapStyle,
      onMapStyle: s => setTweak('mapStyle', s),
      thresholdsOnly: t.thresholdsOnly,
      onThresholdsOnly: v => setTweak('thresholdsOnly', v)
    }), React.createElement("div", {
      style: {
        flex: 1,
        overflow: "auto",
        padding: "12px 24px 32px",
        background: "var(--paper)"
      }
    }, React.createElement(LabyrinthMap, {
      style: t.mapStyle,
      crossings: crossings,
      selectedId: selectedCrossingId,
      onSelect: setSelectedCrossingId,
      thresholdsOnly: t.thresholdsOnly
    }))), React.createElement("div", {
      style: {
        gridColumn: "4 / 5",
        gridRow: "2 / 3",
        borderLeft: "1px solid var(--ink)",
        overflow: "hidden",
        background: "var(--vellum)"
      }
    }, React.createElement(Inspector, {
      crossing: crossing,
      redaction: t.redaction,
      journey: journey
    }))), route === "skills" && React.createElement("div", {
      style: {
        gridColumn: "2 / 5",
        gridRow: "2 / 3",
        overflow: "hidden",
        borderLeft: "1px solid var(--ink)"
      }
    }, React.createElement(SkillAtlas, {
      skills: D.skills
    })), route === "cron" && React.createElement("div", {
      style: {
        gridColumn: "2 / 5",
        gridRow: "2 / 3",
        overflow: "hidden",
        borderLeft: "1px solid var(--ink)"
      }
    }, React.createElement(CronGate, {
      cron: D.cron
    })), route === "ferry" && React.createElement("div", {
      style: {
        gridColumn: "2 / 5",
        gridRow: "2 / 3",
        overflow: "hidden",
        borderLeft: "1px solid var(--ink)"
      }
    }, React.createElement(ModelFerry, {
      journeys: journeys
    })), route === "memory" && React.createElement("div", {
      style: {
        gridColumn: "2 / 5",
        gridRow: "2 / 3",
        overflow: "hidden",
        borderLeft: "1px solid var(--ink)"
      }
    }, React.createElement(MemoryMap, null)), route === "report" && React.createElement("div", {
      style: {
        gridColumn: "2 / 5",
        gridRow: "2 / 3",
        overflow: "hidden",
        borderLeft: "1px solid var(--ink)"
      }
    }, React.createElement(LabyrinthReport, {
      journey: journey,
      crossings: crossings,
      guideposts: D.guideposts.filter(g => g.journey === selectedJourneyId),
      redaction: t.redaction
    })), route === "guideposts" && React.createElement("div", {
      style: {
        gridColumn: "2 / 5",
        gridRow: "2 / 3",
        overflow: "hidden",
        borderLeft: "1px solid var(--ink)"
      }
    }, React.createElement(GuidepostsPanel, {
      guideposts: D.guideposts,
      onJump: g => {
        setSelectedJourneyId(g.journey);
        if (g.evidence[0]) setSelectedCrossingId(g.evidence[0]);
        setRoute("labyrinth");
      }
    })), React.createElement(BottomBar, {
      journey: journey,
      crossings: crossings,
      dataset: t.dataset,
      tick: tick
    }), showGuideposts && React.createElement("div", {
      style: {
        position: "absolute",
        top: 56,
        right: 0,
        width: 380,
        bottom: 28,
        background: "var(--vellum)",
        borderLeft: "1px solid var(--ink)",
        boxShadow: "-12px 0 24px rgba(20,19,15,0.06)",
        zIndex: 20
      }
    }, React.createElement(GuidepostsPanel, {
      guideposts: D.guideposts,
      onJump: g => {
        setSelectedJourneyId(g.journey);
        if (g.evidence[0]) setSelectedCrossingId(g.evidence[0]);
        setShowGuideposts(false);
        setRoute("labyrinth");
      },
      asOverlay: true,
      onClose: () => setShowGuideposts(false)
    })), React.createElement(TweaksPanel, {
      title: "Tweaks"
    }, React.createElement(TweakSection, {
      label: "Surface"
    }, React.createElement(TweakRadio, {
      label: "Theme",
      value: t.theme,
      options: [{
        value: "paper",
        label: "Paper"
      }, {
        value: "dark",
        label: "Ink"
      }],
      onChange: v => setTweak('theme', v)
    }), React.createElement(TweakRadio, {
      label: "Density",
      value: t.density,
      options: [{
        value: "comfortable",
        label: "Comfy"
      }, {
        value: "compact",
        label: "Compact"
      }],
      onChange: v => setTweak('density', v)
    }), React.createElement(TweakToggle, {
      label: "Mythic atmosphere",
      value: t.myth,
      onChange: v => setTweak('myth', v)
    })), React.createElement(TweakSection, {
      label: "Labyrinth"
    }, React.createElement(TweakRadio, {
      label: "Map style",
      value: t.mapStyle,
      options: [{
        value: "thread",
        label: "Thread"
      }, {
        value: "corridor",
        label: "Corridor"
      }, {
        value: "flight",
        label: "Flight"
      }],
      onChange: v => setTweak('mapStyle', v)
    }), React.createElement(TweakToggle, {
      label: "Thresholds only",
      value: t.thresholdsOnly,
      onChange: v => setTweak('thresholdsOnly', v)
    }), React.createElement(TweakRadio, {
      label: "Dataset",
      value: t.dataset,
      options: [{
        value: "debug",
        label: "Debug"
      }, {
        value: "clean",
        label: "Clean"
      }],
      onChange: v => setTweak('dataset', v)
    })), React.createElement(TweakSection, {
      label: "Privacy"
    }, React.createElement(TweakToggle, {
      label: "Redact secrets",
      value: t.redaction,
      onChange: v => setTweak('redaction', v)
    }))));
  }
  function TopChrome({
    route,
    onRoute,
    journey,
    crossingsCount,
    guidepostCount,
    onToggleGuideposts
  }) {
    const elapsed = journey?.duration_label ?? "—";
    return React.createElement("div", {
      style: {
        gridColumn: "1 / 5",
        gridRow: "1 / 2",
        borderBottom: "1px solid var(--ink)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        background: "var(--paper)",
        gap: 16,
        position: "relative",
        zIndex: 10
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, React.createElement("span", {
      style: {
        color: "var(--ink)"
      }
    }, React.createElement(Caduceus, {
      size: 26
    })), React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        lineHeight: 1
      }
    }, React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 16,
        letterSpacing: "0"
      }
    }, "Hermes Labyrinth"), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 9.5,
        color: "var(--ink-3)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginTop: 2
      }
    }, "observability for autonomous crossings"))), React.createElement("div", {
      style: {
        width: 1,
        height: 28,
        background: "var(--line)"
      }
    }), React.createElement("div", {
      style: {
        display: "flex",
        gap: 18,
        alignItems: "center"
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10.5,
        color: "var(--ink-3)",
        letterSpacing: "0.04em"
      }
    }, journey?.id?.slice(-8) || "—"), React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--ink-2)"
      }
    }, "\xB7"), React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--ink-2)",
        maxWidth: 360,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, journey?.title || "no journey selected"), React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10.5,
        color: "var(--ink-3)"
      }
    }, "\xB7 ", crossingsCount, " crossings \xB7 ", elapsed), journey?.status === "active" && React.createElement("span", {
      className: "live-cursor"
    })), React.createElement("div", {
      style: {
        flex: 1
      }
    }), React.createElement("button", {
      onClick: onToggleGuideposts,
      title: "Guideposts",
      style: {
        display: "inline-flex",
        gap: 6,
        alignItems: "center",
        padding: "5px 10px",
        background: "var(--paper)",
        border: "1px solid var(--ink)",
        borderRadius: 2,
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "var(--ink)"
      }
    }, React.createElement("span", {
      style: {
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "var(--gold)"
      }
    }), "Guideposts ", React.createElement("span", {
      style: {
        color: "var(--ink-3)"
      }
    }, guidepostCount)), React.createElement("button", {
      title: "New journey",
      style: {
        display: "inline-flex",
        gap: 6,
        alignItems: "center",
        padding: "5px 10px",
        background: "var(--ink)",
        color: "var(--paper)",
        border: "1px solid var(--ink)",
        borderRadius: 2,
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        letterSpacing: "0.04em",
        textTransform: "uppercase"
      }
    }, React.createElement(LucideIcon, {
      name: "plus",
      size: 12
    }), " New journey"));
  }
  function LeftNav({
    route,
    onRoute
  }) {
    const items = [{
      k: "labyrinth",
      icon: "map",
      label: "Labyrinth"
    }, {
      k: "guideposts",
      icon: "flame",
      label: "Guideposts"
    }, {
      k: "skills",
      icon: "book",
      label: "Skills"
    }, {
      k: "cron",
      icon: "clock",
      label: "Cron"
    }, {
      k: "ferry",
      icon: "network",
      label: "Ferry"
    }, {
      k: "memory",
      icon: "layers",
      label: "Memory"
    }, {
      k: "report",
      icon: "file",
      label: "Report"
    }];
    return React.createElement("div", {
      style: {
        gridColumn: "1 / 2",
        gridRow: "2 / 3",
        borderRight: "1px solid var(--ink)",
        padding: "14px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        background: "var(--paper)"
      }
    }, items.map(it => {
      const active = route === it.k;
      return React.createElement("button", {
        key: it.k,
        onClick: () => onRoute(it.k),
        title: it.label,
        style: {
          width: 40,
          height: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          background: active ? "var(--ink)" : "transparent",
          color: active ? "var(--paper)" : "var(--ink-2)",
          border: "1px solid " + (active ? "var(--ink)" : "transparent"),
          borderRadius: 2,
          cursor: "pointer",
          position: "relative"
        }
      }, React.createElement(LucideIcon, {
        name: it.icon,
        size: 16
      }), React.createElement("span", {
        style: {
          fontSize: 8,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.06em",
          textTransform: "uppercase"
        }
      }, it.label.slice(0, 3)));
    }), React.createElement("div", {
      style: {
        flex: 1
      }
    }), React.createElement("div", {
      style: {
        padding: "8px 0",
        borderTop: "1px solid var(--line)",
        width: "60%",
        textAlign: "center"
      }
    }, React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 8.5,
        color: "var(--ink-4)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        writingMode: "vertical-rl",
        transform: "rotate(180deg)",
        display: "inline-block",
        marginTop: 8
      }
    }, "v0.1 \xB7 \u03C8")));
  }
  function BottomBar({
    journey,
    crossings,
    dataset,
    tick
  }) {
    const failures = crossings.filter(c => c.status === "failed").length;
    const thresholds = crossings.filter(c => c.thread === "thresholds").length;
    return React.createElement("div", {
      style: {
        gridColumn: "1 / 5",
        gridRow: "3 / 4",
        borderTop: "1px solid var(--ink)",
        background: "var(--paper-2)",
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        gap: 18,
        fontSize: 10.5,
        color: "var(--ink-3)",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.02em"
      }
    }, React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6
      }
    }, React.createElement("span", {
      className: "pulse",
      style: {
        width: 6,
        height: 6,
        background: "var(--thread)",
        borderRadius: "50%",
        display: "inline-block"
      }
    }), "gateway: localhost:8421"), React.createElement("span", null, "\xB7"), React.createElement("span", null, "dataset: ", React.createElement("span", {
      style: {
        color: "var(--ink)"
      }
    }, dataset)), React.createElement("span", null, "\xB7"), React.createElement("span", null, "crossings ", React.createElement("span", {
      style: {
        color: "var(--ink)"
      }
    }, crossings.length)), React.createElement("span", null, "\xB7"), React.createElement("span", null, "thresholds ", React.createElement("span", {
      style: {
        color: "var(--ink)"
      }
    }, thresholds)), React.createElement("span", null, "\xB7"), failures > 0 && React.createElement(React.Fragment, null, React.createElement("span", null, "failures ", React.createElement("span", {
      style: {
        color: "var(--danger)"
      }
    }, failures)), React.createElement("span", null, "\xB7")), React.createElement("span", null, "memory: ", React.createElement("span", {
      style: {
        color: "var(--ink)"
      }
    }, "qdrant"), " \xB7 12,408 vectors"), React.createElement("div", {
      style: {
        flex: 1
      }
    }), React.createElement("span", null, "last frame ", String(tick).padStart(3, "0")), React.createElement("span", null, "\xB7"), React.createElement("span", null, new Date().toISOString().slice(11, 19), "Z"));
  }
  function pad2(n) {
    return String(n).padStart(2, "0");
  }
  function formatDateTime(value) {
    if (!value) return "unknown";
    if (typeof value === "string") return value.replace("T", " ").replace(/Z$/, "").slice(0, 19);
    const d = new Date(Number(value) * (Number(value) < 100000000000 ? 1000 : 1));
    if (!Number.isFinite(d.getTime())) return String(value);
    return d.getUTCFullYear() + "-" + pad2(d.getUTCMonth() + 1) + "-" + pad2(d.getUTCDate()) + " " + pad2(d.getUTCHours()) + ":" + pad2(d.getUTCMinutes()) + ":" + pad2(d.getUTCSeconds());
  }
  function clock(value) {
    const s = formatDateTime(value);
    const m = s.match(/(\d{2}:\d{2}:\d{2})/);
    return m ? m[1] : s;
  }
  function durationLabel(ms) {
    if (!Number.isFinite(ms)) return "--";
    const total = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor(total % 3600 / 60);
    const s = total % 60;
    return pad2(h) + ":" + pad2(m) + ":" + pad2(s);
  }
  function crossingThread(c) {
    if (c.thread) return c.thread;
    const type = c.type;
    if (["tool_call", "tool_result"].includes(type)) return "tools";
    if (["subagent_spawn", "subagent_return"].includes(type)) return "delegation";
    if (["approval", "context_compression", "model_switch", "redaction"].includes(type)) return "thresholds";
    return "main";
  }
  function normalizeJourney(j, crossings) {
    const id = j.id || j.journey_id || j.session_id || "unknown";
    const sequence = (j.model_sequence || [j.model]).filter(Boolean);
    const tokenSource = j.tokens || j.token_counts || {};
    const failed = crossings ? crossings.filter(c => c.status === "failed").length : null;
    const thresholds = crossings ? crossings.filter(c => crossingThread(c) === "thresholds").length : null;
    return {
      id,
      source: j.source || "unknown",
      status: j.status || "unknown",
      started_at: j.started_at || "unknown",
      duration_label: j.duration_label || durationLabel(j.duration_ms),
      duration_ms: j.duration_ms,
      title: j.title || j.summary || j.root_prompt || "Untitled journey",
      root_prompt: j.root_prompt || j.preview || j.summary || "",
      model_sequence: sequence.length ? sequence : ["unknown"],
      provider: j.provider || j.provider_name || "unknown",
      messages: j.messages ?? j.message_count ?? 0,
      tool_calls: j.tool_calls ?? j.tool_call_count ?? 0,
      api_calls: j.api_calls ?? j.api_call_count ?? 0,
      cost: j.cost || j.actual_cost || j.estimated_cost || j.cost_status || "unknown",
      tokens: {
        input: tokenSource.input || 0,
        output: tokenSource.output || 0,
        cache_read: tokenSource.cache_read || 0,
        cache_write: tokenSource.cache_write || 0,
        reasoning: tokenSource.reasoning || 0
      },
      end_reason: j.end_reason || null,
      parent: j.parent || j.parent_journey_id || null,
      children: j.children || [],
      thresholds: j.thresholds ?? j.threshold_count ?? thresholds ?? 0,
      failures: j.failures ?? j.failure_count ?? failed ?? 0,
      project: j.project || j.workdir || "~/.hermes"
    };
  }
  function normalizeCrossing(c, index, journeyId) {
    const id = c.id || c.crossing_id || "c" + pad2(index + 1);
    return {
      id,
      type: c.type || "unknown",
      label: c.label || c.type || "crossing",
      actor: c.actor || "agent",
      target: c.target || "unknown",
      t: c.t || clock(c.started_at),
      dur: c.dur ?? c.duration_ms ?? null,
      status: c.status || "complete",
      thread: crossingThread(c),
      preview_in: c.preview_in ?? c.inputs_preview ?? "",
      preview_out: c.preview_out ?? c.outputs_preview ?? "",
      journey_id: journeyId
    };
  }
  function normalizeGuidepost(g) {
    const evidence = g.evidence || (g.evidence_refs || []).filter(e => e.kind === "crossing").map(e => e.id) || [];
    return {
      kind: g.kind || "guidepost",
      severity: g.severity || "info",
      title: g.title || "Guidepost",
      detail: g.detail || "",
      journey: g.journey || g.journey_id || "unknown",
      evidence
    };
  }
  function normalizeSkill(s) {
    return {
      name: s.name || "skill",
      source: s.source || "unknown",
      category: s.category || "general",
      enabled: s.enabled !== false,
      modified: s.modified || "unknown",
      desc: s.desc || s.description || "",
      uses: s.uses || 0,
      files: s.files || s.file_count || 1,
      path: s.path || s.relative_path || ""
    };
  }
  function normalizeCron(job) {
    return {
      id: job.id || job.name,
      name: job.name || job.id || "cron job",
      enabled: job.enabled !== false,
      schedule: job.schedule || job.schedule_display || "unknown",
      display: job.display || job.schedule_display || "unknown",
      next: job.next || formatDateTime(job.next_run_at),
      last: job.last || formatDateTime(job.last_run_at),
      status: job.status || job.last_status || job.state || "unknown",
      workdir: job.workdir || "unknown",
      model: job.model || "default",
      provider: job.provider || "unknown",
      deliver: job.deliver || "local",
      skills: job.skills || [],
      error: job.error || job.last_error || ""
    };
  }
  function normalizeData(raw) {
    const rawJourneys = raw.journeys || [];
    const rawCrossingsByJourney = raw.crossingsByJourney || {};
    const crossingsByJourney = {};
    rawJourneys.forEach(j => {
      const id = j.id || j.journey_id || j.session_id;
      crossingsByJourney[id] = (rawCrossingsByJourney[id] || []).map((c, index) => normalizeCrossing(c, index, id));
    });
    const journeys = rawJourneys.map(j => normalizeJourney(j, crossingsByJourney[j.id || j.journey_id || j.session_id]));
    const active = journeys.find(j => j.status === "active") || journeys.find(j => j.failures > 0) || journeys[0];
    const clean = journeys.find(j => j.status === "complete" && j.source === "cron") || journeys.find(j => j.status === "complete") || active;
    const debugJourneyId = raw.debugJourneyId || active && active.id;
    const cleanJourneyId = raw.cleanJourneyId || clean && clean.id;
    return {
      journeys,
      crossingsByJourney,
      debugJourneyId,
      cleanJourneyId,
      debugCrossings: crossingsByJourney[debugJourneyId] || [],
      cleanCrossings: crossingsByJourney[cleanJourneyId] || [],
      guideposts: (raw.guideposts || []).map(normalizeGuidepost),
      skills: (raw.skills || []).map(normalizeSkill),
      cron: (raw.cron || raw.jobs || []).map(normalizeCron)
    };
  }
  function sampleAsApiData() {
    const by = {};
    by[SAMPLE_DATA.journeys[0].id] = SAMPLE_DATA.debugCrossings;
    by[SAMPLE_DATA.journeys[1].id] = SAMPLE_DATA.cleanCrossings;
    return normalizeData({
      journeys: SAMPLE_DATA.journeys,
      crossingsByJourney: by,
      guideposts: SAMPLE_DATA.guideposts,
      skills: SAMPLE_DATA.skills,
      cron: SAMPLE_DATA.cron,
      debugJourneyId: SAMPLE_DATA.journeys[0].id,
      cleanJourneyId: SAMPLE_DATA.journeys[1].id
    });
  }
  function fetchJSON(url) {
    return SDK.fetchJSON ? SDK.fetchJSON(url) : fetch(url).then(r => r.json());
  }
  function loadApiData() {
    return Promise.all([fetchJSON(API + "/journeys?limit=40&include_children=true"), fetchJSON(API + "/skills"), fetchJSON(API + "/cron"), fetchJSON(API + "/guideposts?limit=40")]).then(async ([journeyRes, skillRes, cronRes, guideRes]) => {
      const journeys = journeyRes.journeys || [];
      const entries = await Promise.all(journeys.map(j => {
        const id = j.id || j.journey_id;
        return fetchJSON(API + "/journeys/" + encodeURIComponent(id) + "/crossings").then(res => [id, res.crossings || []]).catch(() => [id, []]);
      }));
      const crossingsByJourney = Object.fromEntries(entries);
      return normalizeData({
        journeys,
        crossingsByJourney,
        skills: skillRes.skills || [],
        cron: cronRes.jobs || cronRes.cron || [],
        guideposts: guideRes.guideposts || []
      });
    });
  }
  function LabyrinthPage() {
    const demo = !!window.__HERMES_LABYRINTH_DEMO__;
    const [data, setData] = React.useState(demo ? sampleAsApiData() : null);
    const [error, setError] = React.useState("");
    React.useEffect(() => {
      if (demo) return;
      let mounted = true;
      loadApiData().then(next => {
        if (mounted) setData(next);
      }).catch(err => {
        if (mounted) setError(err && err.message ? err.message : String(err));
      });
      return () => {
        mounted = false;
      };
    }, [demo]);
    if (!data) return React.createElement("div", {
      className: "hl-root hl-theme-ink hl-myth-on",
      style: {
        display: "grid",
        placeItems: "center",
        height: "100vh"
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, error || "Loading Labyrinth"));
    return React.createElement(LabyrinthExperience, {
      data
    });
  }
  function HeaderStatus() {
    const [health, setHealth] = React.useState(null);
    React.useEffect(() => {
      fetchJSON(API + "/health").then(setHealth).catch(() => setHealth({
        ok: false
      }));
    }, []);
    if (!health) return null;
    return React.createElement("div", {
      className: "hidden items-center gap-2 text-xs text-muted-foreground md:flex"
    }, React.createElement("span", {
      className: "inline-flex h-2 w-2 rounded-full",
      style: {
        background: health.ok ? "var(--thread, #c8d4e8)" : "var(--destructive)"
      }
    }), React.createElement("span", null, "Labyrinth"));
  }
  window.__HERMES_PLUGINS__.register("hermes-labyrinth", LabyrinthPage);
  window.__HERMES_PLUGINS__.registerSlot("hermes-labyrinth", "header-right", HeaderStatus);
})();
