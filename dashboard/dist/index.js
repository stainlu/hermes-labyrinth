/**
 * Hermes Labyrinth dashboard plugin.
 *
 * Plain IIFE bundle; uses the Hermes dashboard plugin SDK exposed on window.
 * The UI is deliberately functional and sparse so a designer can own the final
 * visual system without unpicking product behavior.
 */
(function () {
  "use strict";

  const SDK = window.__HERMES_PLUGIN_SDK__;
  const React = SDK.React;
  const h = React.createElement;
  const hooks = SDK.hooks;
  const Card = SDK.components.Card;
  const CardHeader = SDK.components.CardHeader;
  const CardTitle = SDK.components.CardTitle;
  const CardContent = SDK.components.CardContent;
  const Badge = SDK.components.Badge;
  const Button = SDK.components.Button;
  const Input = SDK.components.Input;
  const Separator = SDK.components.Separator;

  const API = "/api/plugins/hermes-labyrinth";

  function fetchText(url) {
    const headers = {};
    if (window.__HERMES_SESSION_TOKEN__) {
      headers["X-Hermes-Session-Token"] = window.__HERMES_SESSION_TOKEN__;
    }
    return fetch(url, { headers }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (text) {
          throw new Error(res.status + ": " + text);
        });
      }
      return res.text();
    });
  }

  function fmtTime(value) {
    if (!value) return "unknown";
    const ts = typeof value === "number" ? value * 1000 : Date.parse(value);
    if (!Number.isFinite(ts)) return String(value);
    return new Date(ts).toLocaleString();
  }

  function fmtDuration(ms) {
    if (!Number.isFinite(ms)) return "unknown";
    if (ms < 1000) return ms + "ms";
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return seconds + "s";
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    if (minutes < 60) return minutes + "m " + rest + "s";
    const hours = Math.floor(minutes / 60);
    return hours + "h " + (minutes % 60) + "m";
  }

  function trunc(value, limit) {
    const text = value == null ? "" : String(value);
    if (text.length <= limit) return text;
    return text.slice(0, limit - 3) + "...";
  }

  function statusTone(status) {
    if (status === "failed") return "destructive";
    if (status === "active" || status === "complete") return "default";
    return "outline";
  }

  function Stat(props) {
    return h("div", {
      className: "border border-border bg-background/40 p-3",
      style: { minHeight: 72 },
    },
      h("div", { className: "text-xs uppercase text-muted-foreground" }, props.label),
      h("div", { className: "mt-1 text-2xl font-semibold" }, props.value),
      props.detail ? h("div", { className: "mt-1 text-xs text-muted-foreground" }, props.detail) : null,
    );
  }

  function Empty(props) {
    return h("div", { className: "border border-dashed border-border p-4 text-sm text-muted-foreground" }, props.children);
  }

  function Section(props) {
    return h(Card, null,
      h(CardHeader, null,
        h("div", { className: "flex items-center justify-between gap-3" },
          h(CardTitle, { className: "text-base" }, props.title),
          props.action || null,
        ),
      ),
      h(CardContent, null, props.children),
    );
  }

  function KeyValue(props) {
    return h("div", { className: "grid grid-cols-2 gap-3 text-xs" },
      props.items.map(function (item) {
        return h("div", { key: item[0], className: "border border-border p-2" },
          h("div", { className: "uppercase text-muted-foreground" }, item[0]),
          h("div", { className: "mt-1 break-words font-mono" }, item[1] == null || item[1] === "" ? "unknown" : String(item[1])),
        );
      }),
    );
  }

  function GuidepostList(props) {
    const items = props.items || [];
    if (!items.length) return h(Empty, null, "No guideposts generated from available evidence.");
    return h("div", { className: "flex flex-col gap-2" },
      items.map(function (item, index) {
        return h("div", { key: index, className: "border border-border p-3" },
          h("div", { className: "flex items-center gap-2" },
            h(Badge, { variant: item.severity === "warning" ? "destructive" : "outline" }, item.severity || "info"),
            h("span", { className: "text-sm font-medium" }, item.title),
          ),
          item.detail ? h("div", { className: "mt-2 text-xs text-muted-foreground" }, item.detail) : null,
        );
      }),
    );
  }

  function JourneyList(props) {
    const query = (props.query || "").toLowerCase();
    const journeys = (props.journeys || []).filter(function (journey) {
      if (!query) return true;
      return [
        journey.journey_id,
        journey.source,
        journey.status,
        journey.summary,
        journey.model,
      ].join(" ").toLowerCase().indexOf(query) >= 0;
    });
    if (!journeys.length) return h(Empty, null, "No journeys matched.");
    return h("div", { className: "flex flex-col gap-2" },
      journeys.map(function (journey) {
        const selected = journey.journey_id === props.selectedId;
        return h("button", {
          key: journey.journey_id,
          type: "button",
          onClick: function () { props.onSelect(journey.journey_id); },
          className: "border p-3 text-left transition-colors " + (selected ? "border-foreground bg-foreground/10" : "border-border bg-background/30 hover:bg-foreground/5"),
        },
          h("div", { className: "flex items-center justify-between gap-3" },
            h("span", { className: "font-mono text-xs" }, trunc(journey.journey_id, 18)),
            h(Badge, { variant: statusTone(journey.status) }, journey.status || "unknown"),
          ),
          h("div", { className: "mt-2 text-sm" }, trunc(journey.summary || journey.root_prompt || "(no prompt preview)", 120)),
          h("div", { className: "mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground" },
            h("span", null, journey.source || "unknown"),
            h("span", null, fmtTime(journey.started_at)),
            h("span", null, (journey.tool_call_count || 0) + " tool calls"),
          ),
        );
      }),
    );
  }

  function CrossingList(props) {
    const crossings = props.crossings || [];
    if (!crossings.length) return h(Empty, null, "No crossings available for this journey.");
    return h("div", { className: "flex flex-col gap-2" },
      crossings.map(function (crossing) {
        const selected = props.selected && props.selected.crossing_id === crossing.crossing_id;
        return h("button", {
          key: crossing.crossing_id,
          type: "button",
          onClick: function () { props.onSelect(crossing); },
          className: "border p-3 text-left transition-colors " + (selected ? "border-foreground bg-foreground/10" : "border-border bg-background/30 hover:bg-foreground/5"),
        },
          h("div", { className: "flex items-center justify-between gap-3" },
            h("div", { className: "flex items-center gap-2" },
              h(Badge, { variant: "outline" }, crossing.type || "unknown"),
              h("span", { className: "text-sm font-medium" }, crossing.label || crossing.target || "crossing"),
            ),
            h(Badge, { variant: statusTone(crossing.status) }, crossing.status || "unknown"),
          ),
          h("div", { className: "mt-2 text-xs text-muted-foreground" },
            fmtTime(crossing.started_at),
            crossing.actor ? " / " + crossing.actor + " -> " + (crossing.target || "unknown") : "",
          ),
        );
      }),
    );
  }

  function CrossingInspector(props) {
    const crossing = props.crossing;
    if (!crossing) return h(Empty, null, "Select a crossing to inspect its evidence.");
    const preview = crossing.outputs_preview || crossing.inputs_preview || "";
    return h("div", { className: "flex flex-col gap-3" },
      h(KeyValue, {
        items: [
          ["type", crossing.type],
          ["status", crossing.status],
          ["actor", crossing.actor],
          ["target", crossing.target],
          ["time", fmtTime(crossing.started_at)],
          ["duration", fmtDuration(crossing.duration_ms)],
        ],
      }),
      h("div", { className: "border border-border p-3" },
        h("div", { className: "text-xs uppercase text-muted-foreground" }, "redacted preview"),
        h("pre", { className: "mt-2 whitespace-pre-wrap break-words text-xs font-mono" }, preview || "(no preview)"),
      ),
      h("div", { className: "border border-border p-3" },
        h("div", { className: "text-xs uppercase text-muted-foreground" }, "evidence refs"),
        h("pre", { className: "mt-2 whitespace-pre-wrap break-words text-xs font-mono" },
          JSON.stringify(crossing.evidence_refs || [], null, 2),
        ),
      ),
    );
  }

  function SkillsPanel(props) {
    const skills = props.skills || [];
    if (!skills.length) return h(Empty, null, "No skills discovered.");
    return h("div", { className: "grid gap-2" },
      skills.slice(0, 30).map(function (skill) {
        return h("div", { key: skill.source + ":" + skill.name, className: "border border-border p-3" },
          h("div", { className: "flex items-center justify-between gap-3" },
            h("div", null,
              h("div", { className: "text-sm font-medium" }, skill.name),
              h("div", { className: "mt-1 text-xs text-muted-foreground" }, trunc(skill.description || "", 140)),
            ),
            h("div", { className: "flex items-center gap-2" },
              h(Badge, { variant: "outline" }, skill.source || "unknown"),
              h(Badge, { variant: skill.enabled ? "default" : "destructive" }, skill.enabled ? "enabled" : "disabled"),
            ),
          ),
          h("div", { className: "mt-2 text-xs font-mono text-muted-foreground" }, trunc(skill.relative_path || skill.path || "", 120)),
        );
      }),
      skills.length > 30 ? h("div", { className: "text-xs text-muted-foreground" }, "Showing 30 of " + skills.length + " skills.") : null,
    );
  }

  function CronPanel(props) {
    const jobs = props.jobs || [];
    if (!jobs.length) return h(Empty, null, "No cron gates configured.");
    return h("div", { className: "grid gap-2" },
      jobs.map(function (job) {
        return h("div", { key: job.id, className: "border border-border p-3" },
          h("div", { className: "flex items-center justify-between gap-3" },
            h("div", null,
              h("div", { className: "text-sm font-medium" }, job.name || job.id),
              h("div", { className: "mt-1 text-xs text-muted-foreground" }, job.schedule_display || "unknown schedule"),
            ),
            h(Badge, { variant: job.enabled ? "outline" : "destructive" }, job.enabled ? (job.state || "enabled") : "disabled"),
          ),
          h("div", { className: "mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground" },
            h("div", null, "next: " + fmtTime(job.next_run_at)),
            h("div", null, "last: " + fmtTime(job.last_run_at)),
            h("div", null, "deliver: " + (job.deliver || "unknown")),
            h("div", null, "workdir: " + trunc(job.workdir || "unknown", 80)),
          ),
          job.last_error ? h("div", { className: "mt-2 text-xs text-destructive" }, job.last_error) : null,
        );
      }),
    );
  }

  function ReportPanel(props) {
    if (!props.report) return null;
    return h(Section, {
      title: "Labyrinth Report",
      action: h(Button, {
        onClick: function () {
          if (navigator.clipboard) navigator.clipboard.writeText(props.report);
        },
        className: "text-xs",
      }, "Copy"),
      children: h("pre", { className: "max-h-96 overflow-auto whitespace-pre-wrap break-words text-xs font-mono" }, props.report),
    });
  }

  function LabyrinthPage() {
    const useState = hooks.useState;
    const useEffect = hooks.useEffect;
    const useCallback = hooks.useCallback;

    const stateJourneys = useState([]);
    const journeys = stateJourneys[0];
    const setJourneys = stateJourneys[1];

    const stateSelectedId = useState(null);
    const selectedId = stateSelectedId[0];
    const setSelectedId = stateSelectedId[1];

    const stateDetail = useState(null);
    const detail = stateDetail[0];
    const setDetail = stateDetail[1];

    const stateCrossings = useState([]);
    const crossings = stateCrossings[0];
    const setCrossings = stateCrossings[1];

    const stateSelectedCrossing = useState(null);
    const selectedCrossing = stateSelectedCrossing[0];
    const setSelectedCrossing = stateSelectedCrossing[1];

    const stateSkills = useState([]);
    const skills = stateSkills[0];
    const setSkills = stateSkills[1];

    const stateCron = useState([]);
    const cron = stateCron[0];
    const setCron = stateCron[1];

    const stateGlobalGuideposts = useState([]);
    const globalGuideposts = stateGlobalGuideposts[0];
    const setGlobalGuideposts = stateGlobalGuideposts[1];

    const stateQuery = useState("");
    const query = stateQuery[0];
    const setQuery = stateQuery[1];

    const stateError = useState(null);
    const error = stateError[0];
    const setError = stateError[1];

    const stateLoading = useState(true);
    const loading = stateLoading[0];
    const setLoading = stateLoading[1];

    const stateReport = useState("");
    const report = stateReport[0];
    const setReport = stateReport[1];

    const loadOverview = useCallback(function () {
      setLoading(true);
      setError(null);
      return Promise.all([
        SDK.fetchJSON(API + "/journeys?limit=25&include_children=true"),
        SDK.fetchJSON(API + "/skills"),
        SDK.fetchJSON(API + "/cron"),
        SDK.fetchJSON(API + "/guideposts?limit=10"),
      ]).then(function (results) {
        const journeyList = results[0].journeys || [];
        setJourneys(journeyList);
        setSkills(results[1].skills || []);
        setCron(results[2].jobs || []);
        setGlobalGuideposts(results[3].guideposts || []);
        if (!selectedId && journeyList.length) setSelectedId(journeyList[0].journey_id);
      }).catch(function (err) {
        setError(err.message || String(err));
      }).finally(function () {
        setLoading(false);
      });
    }, [selectedId]);

    useEffect(function () {
      loadOverview();
    }, []);

    useEffect(function () {
      if (!selectedId) return;
      setReport("");
      setSelectedCrossing(null);
      Promise.all([
        SDK.fetchJSON(API + "/journeys/" + encodeURIComponent(selectedId)),
        SDK.fetchJSON(API + "/journeys/" + encodeURIComponent(selectedId) + "/crossings"),
      ]).then(function (results) {
        setDetail(results[0]);
        const nextCrossings = results[1].crossings || [];
        setCrossings(nextCrossings);
        setSelectedCrossing(nextCrossings[0] || null);
      }).catch(function (err) {
        setError(err.message || String(err));
      });
    }, [selectedId]);

    function generateReport() {
      if (!selectedId) return;
      setReport("Generating report...");
      fetchText(API + "/reports/" + encodeURIComponent(selectedId) + ".md")
        .then(setReport)
        .catch(function (err) { setReport("Report failed: " + (err.message || String(err))); });
    }

    const activeJourney = detail && detail.journey ? detail.journey : journeys.find(function (j) { return j.journey_id === selectedId; });
    const journeyGuideposts = detail && detail.guideposts ? detail.guideposts : [];
    const failedCrossings = crossings.filter(function (c) { return c.status === "failed"; }).length;
    const thresholdCrossings = crossings.filter(function (c) {
      return ["approval", "context_compression", "subagent_spawn", "subagent_return"].indexOf(c.type) >= 0;
    }).length;

    return h("div", { className: "flex flex-col gap-6" },
      h("div", { className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between" },
        h("div", null,
          h("h1", { className: "text-2xl font-semibold" }, "Hermes Labyrinth"),
          h("p", { className: "mt-1 max-w-3xl text-sm text-muted-foreground" },
            "Hermes is the guide. The dashboard is the thread. The agent's behavior is the labyrinth.",
          ),
        ),
        h("div", { className: "flex items-center gap-2" },
          h(Button, { onClick: loadOverview, disabled: loading }, loading ? "Refreshing..." : "Refresh"),
          h(Button, { onClick: generateReport, disabled: !selectedId }, "Report"),
        ),
      ),

      error ? h("div", { className: "border border-destructive p-3 text-sm text-destructive" }, error) : null,

      h("div", { className: "grid gap-3 md:grid-cols-5" },
        h(Stat, { label: "Journeys", value: journeys.length, detail: "recent sessions" }),
        h(Stat, { label: "Crossings", value: crossings.length, detail: selectedId ? "selected journey" : "none selected" }),
        h(Stat, { label: "Thresholds", value: thresholdCrossings, detail: "delegation, approval, context" }),
        h(Stat, { label: "Failures", value: failedCrossings, detail: "selected journey" }),
        h(Stat, { label: "Skills", value: skills.length, detail: cron.length + " cron gates" }),
      ),

      h("div", { className: "grid gap-6 xl:grid-cols-[360px_1fr]" },
        h(Section, {
          title: "Journey Index",
          action: h(Input, {
            value: query,
            onChange: function (event) { setQuery(event.target.value); },
            placeholder: "Filter",
            className: "h-8 w-40 text-xs",
          }),
          children: h(JourneyList, {
            journeys: journeys,
            selectedId: selectedId,
            query: query,
            onSelect: setSelectedId,
          }),
        }),

        h("div", { className: "flex flex-col gap-6" },
          h(Section, {
            title: "Selected Journey",
            children: activeJourney ? h("div", { className: "flex flex-col gap-4" },
              h(KeyValue, {
                items: [
                  ["journey", trunc(activeJourney.journey_id, 24)],
                  ["source", activeJourney.source],
                  ["status", activeJourney.status],
                  ["model", (activeJourney.model_sequence || []).join(", ")],
                  ["started", fmtTime(activeJourney.started_at)],
                  ["duration", fmtDuration(activeJourney.duration_ms)],
                  ["messages", activeJourney.message_count],
                  ["tool calls", activeJourney.tool_call_count],
                ],
              }),
              h("div", { className: "border border-border p-3 text-sm" }, activeJourney.summary || activeJourney.root_prompt || "(no summary)"),
              detail && detail.child_journeys && detail.child_journeys.length
                ? h("div", { className: "text-xs text-muted-foreground" }, detail.child_journeys.length + " child journey link(s) detected.")
                : null,
            ) : h(Empty, null, "Select a journey."),
          }),

          h("div", { className: "grid gap-6 xl:grid-cols-2" },
            h(Section, {
              title: "Crossings",
              children: h(CrossingList, {
                crossings: crossings,
                selected: selectedCrossing,
                onSelect: setSelectedCrossing,
              }),
            }),
            h(Section, {
              title: "Crossing Inspector",
              children: h(CrossingInspector, { crossing: selectedCrossing }),
            }),
          ),

          h("div", { className: "grid gap-6 xl:grid-cols-2" },
            h(Section, {
              title: "Journey Guideposts",
              children: h(GuidepostList, { items: journeyGuideposts }),
            }),
            h(Section, {
              title: "Recent Global Guideposts",
              children: h(GuidepostList, { items: globalGuideposts }),
            }),
          ),

          h("div", { className: "grid gap-6 xl:grid-cols-2" },
            h(Section, {
              title: "Skill Atlas",
              children: h(SkillsPanel, { skills: skills }),
            }),
            h(Section, {
              title: "Cron Gate",
              children: h(CronPanel, { jobs: cron }),
            }),
          ),

          h(ReportPanel, { report: report }),
        ),
      ),
    );
  }

  function HeaderStatus() {
    const useState = hooks.useState;
    const useEffect = hooks.useEffect;
    const state = useState(null);
    const health = state[0];
    const setHealth = state[1];
    useEffect(function () {
      SDK.fetchJSON(API + "/health").then(setHealth).catch(function () { setHealth({ ok: false }); });
    }, []);
    if (!health) return null;
    return h("div", { className: "hidden items-center gap-2 text-xs text-muted-foreground md:flex" },
      h(Badge, { variant: health.ok ? "outline" : "destructive" }, "Labyrinth"),
      h("span", null, health.state_db_exists ? "state: present" : "state: empty"),
    );
  }

  window.__HERMES_PLUGINS__.register("hermes-labyrinth", LabyrinthPage);
  window.__HERMES_PLUGINS__.registerSlot("hermes-labyrinth", "header-right", HeaderStatus);
})();
