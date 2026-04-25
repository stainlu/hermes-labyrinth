/**
 * Hermes Labyrinth dashboard plugin.
 *
 * Implements the Claude Design handoff for "Hermes Labyrinth.html" as a
 * dashboard-native plugin. The prototype's mock data has been replaced with
 * real read-only Hermes state from plugin_api.py.
 */
(function () {
  "use strict";

  const SDK = window.__HERMES_PLUGIN_SDK__;
  const React = SDK.React;
  const h = React.createElement;
  const hooks = SDK.hooks;
  const API = "/api/plugins/hermes-labyrinth";

  const ROUTES = [
    ["labyrinth", "map", "Labyrinth"],
    ["guideposts", "flame", "Guideposts"],
    ["skills", "book", "Skills"],
    ["cron", "clock", "Cron"],
    ["ferry", "network", "Ferry"],
    ["memory", "layers", "Memory"],
    ["report", "file", "Report"],
  ];

  function cx() {
    return Array.prototype.slice.call(arguments).filter(Boolean).join(" ");
  }

  function getId(journey) {
    return journey && (journey.journey_id || journey.id);
  }

  function getCrossingId(crossing) {
    return crossing && (crossing.crossing_id || crossing.id);
  }

  function shortId(value) {
    const text = value == null ? "" : String(value);
    return text.length > 10 ? text.slice(-10) : text || "unknown";
  }

  function trunc(value, limit) {
    const text = value == null ? "" : String(value);
    return text.length > limit ? text.slice(0, limit - 3) + "..." : text;
  }

  function fmtTime(value) {
    if (!value) return "unknown";
    const ts = typeof value === "number" ? value * 1000 : Date.parse(value);
    if (!Number.isFinite(ts)) return String(value);
    return new Date(ts).toLocaleString();
  }

  function fmtClock(value) {
    if (!value) return "unknown";
    const ts = typeof value === "number" ? value * 1000 : Date.parse(value);
    if (!Number.isFinite(ts)) return String(value);
    return new Date(ts).toLocaleTimeString([], { hour12: false });
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

  function redactClient(text, enabled) {
    if (!enabled || !text) return text || "";
    return String(text)
      .replace(/sk_live_[A-Za-z0-9_-]+/g, "sk_live_********")
      .replace(/sk-[A-Za-z0-9_-]{12,}/g, "sk-********")
      .replace(/[A-Za-z0-9_]{20,}\.[A-Za-z0-9_.-]{20,}/g, "[REDACTED]")
      .replace(/\b[A-Z0-9]{24,}\b/g, "********");
  }

  function crossingThread(crossing) {
    const type = crossing && crossing.type;
    if (["tool_call", "tool_result"].indexOf(type) >= 0) return "tools";
    if (["subagent_spawn", "subagent_return"].indexOf(type) >= 0) return "delegation";
    if (["approval", "context_compression", "model_switch", "redaction"].indexOf(type) >= 0) return "thresholds";
    return "main";
  }

  function isThreshold(crossing) {
    return crossingThread(crossing) === "thresholds";
  }

  function fetchText(url) {
    const headers = {};
    if (window.__HERMES_SESSION_TOKEN__) {
      headers["X-Hermes-Session-Token"] = window.__HERMES_SESSION_TOKEN__;
    }
    return fetch(url, { headers: headers }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (text) {
          throw new Error(res.status + ": " + text);
        });
      }
      return res.text();
    });
  }

  function pathIcon(name) {
    return {
      map: "M9 3l-6 3v15l6-3 6 3 6-3V3l-6 3-6-3z|M9 3v15|M15 6v15",
      book: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",
      clock: "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18|M12 7v5l3 2",
      layers: "M12 2L2 7l10 5l10-5-10-5z|M2 17l10 5l10-5|M2 12l10 5l10-5",
      file: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z|M14 3v6h6",
      search: "M11 18a7 7 0 1 0 0-14a7 7 0 0 0 0 14z|M21 21l-5-5",
      download: "M12 3v12|M7 10l5 5 5-5|M5 21h14",
      x: "M6 6l12 12|M18 6L6 18",
      plus: "M12 5v14|M5 12h14",
      network: "M5 4h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM5 14h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z|M8 10v4|M16 10v4|M12 10v4",
      flame: "M12 21c4 0 7-3 7-7 0-3-2-5-3-7-1-2-1-4-1-4s-2 2-3 4c-1-1-2-2-2-2s-3 4-3 7c0 4 1 6 5 9z",
      filter: "M4 4h16l-6 8v6l-4 2v-8z",
      terminal: "M5 8l4 4-4 4|M11 16h8",
      dashboard: "M4 5h16v14H4z|M4 9h16",
      gateway: "M4 12c4-4 12-4 16 0|M7 12c2-2 8-2 10 0|M12 12h.01",
      subagent: "M6 7h.01M6 17h.01M17 12h.01|M7.5 7l8 4|M7.5 17l8-4",
    }[name] || "M12 5a7 7 0 1 0 0 14a7 7 0 0 0 0-14";
  }

  function Icon(props) {
    const segs = pathIcon(props.name).split("|");
    return h("svg", {
      width: props.size || 16,
      height: props.size || 16,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: props.stroke || 1.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: props.className || "",
      "aria-hidden": true,
    }, segs.map(function (d, i) {
      return h("path", { key: i, d: d });
    }));
  }

  function Caduceus(props) {
    const size = props.size || 28;
    return h("svg", {
      width: size,
      height: size,
      viewBox: "0 0 32 40",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.25,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    },
      h("path", { d: "M16 4v32" }),
      h("path", { d: "M16 8c-3-1-6-1-9 1" }),
      h("path", { d: "M16 8c3-1 6-1 9 1" }),
      h("path", { d: "M16 11c-2.5-.5-5-.5-7 .6" }),
      h("path", { d: "M16 11c2.5-.5 5-.5 7 .6" }),
      h("path", { d: "M16 14c-3 1-3 4 0 5s3 4 0 5-3 4 0 5" }),
      h("path", { d: "M16 14c3 1 3 4 0 5s-3 4 0 5 3 4 0 5" }),
      h("circle", { cx: 16, cy: 5, r: 1.2 }),
    );
  }

  function CrossingGlyph(props) {
    const size = props.size || 16;
    const type = props.type || "unknown";
    const common = {
      width: size,
      height: size,
      x: props.x,
      y: props.y,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: props.stroke || 1.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    };
    const paths = {
      prompt: ["M3 12h12", "M11 8l4 4-4 4", "M19 12h.01"],
      tool_call: ["M5 5l5 5", "M5 12l5-2", "M5 19l5-5", "M15 12a3.2 3.2 0 1 0 .01 0"],
      tool_result: ["M9 12a3.2 3.2 0 1 0 .01 0", "M19 5l-5 5", "M19 12l-5-2", "M19 19l-5-5"],
      assistant_response: ["M5 12h.01", "M9 12h12", "M17 8l4 4-4 4"],
      approval: ["M5 4v16", "M19 4v16", "M12 10a2.4 2.4 0 1 0 .01 0", "M12 12.5v5", "M10.5 14.5h3"],
      redaction: ["M4 6h16v12H4z", "M7 10h3", "M13 10h4", "M7 14h5", "M15 14h2"],
      subagent_spawn: ["M6 6h.01", "M6 7.6V12", "M6 12c0 4 4 4 8 4", "M18 16h.01", "M6 12c0-3 4-3 8-3", "M18 9h.01"],
      subagent_return: ["M18 6h.01", "M18 7.6V12", "M18 12c0 4-4 4-8 4", "M6 16h.01", "M18 12c0-3-4-3-8-3", "M6 9h.01"],
      model_switch: ["M5 5v14", "M19 5v14", "M5 9h6l3-3", "M19 15h-6l-3 3"],
      context_compression: ["M4 7h16", "M6 12h12", "M9 17h6"],
      memory_op: ["M12 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14", "M12 4v14", "M5 11h14"],
    }[type] || ["M12 6a6 6 0 1 0 0 12a6 6 0 0 0 0-12"];
    return h("svg", common, paths.map(function (d, i) {
      return h("path", { key: i, d: d });
    }));
  }

  function SourceGlyph(props) {
    const source = props.source || "unknown";
    const icon = source === "cli" ? "terminal"
      : source === "dashboard" ? "dashboard"
      : source === "gateway" ? "gateway"
      : source === "cron" ? "clock"
      : source === "subagent" ? "subagent"
      : "map";
    return h(Icon, { name: icon, size: props.size || 14 });
  }

  function StatusPip(props) {
    const status = props.status || "unknown";
    const color = status === "active" ? "var(--hl-thread)"
      : status === "complete" || status === "ok" ? "var(--hl-ok)"
      : status === "failed" ? "var(--hl-danger)"
      : status === "interrupted" ? "var(--hl-warn)"
      : "var(--hl-ink-4)";
    return h("span", { className: "hl-status-pip" },
      h("i", { className: status === "active" ? "hl-pulse" : "", style: { background: color } }),
      h("span", null, status),
    );
  }

  function Meta(props) {
    return h("span", { className: "hl-meta-item" },
      h("span", { className: "hl-meta-label" }, props.label),
      h("span", { className: cx("hl-meta-value", props.danger && "hl-danger") }, props.value == null || props.value === "" ? "unknown" : String(props.value)),
    );
  }

  function Empty(props) {
    return h("div", { className: "hl-empty" }, props.children || "No data available.");
  }

  function TopChrome(props) {
    const journey = props.journey;
    return h("div", { className: "hl-chrome" },
      h("div", { className: "hl-brand" },
        h(Caduceus, { size: 26 }),
        h("div", null,
          h("div", { className: "hl-brand-title" }, "Hermes Labyrinth"),
          h("div", { className: "hl-eyebrow", style: { fontSize: 9.5 } }, "observability for autonomous crossings"),
        ),
      ),
      h("div", { className: "hl-separator" }),
      h("div", { className: "hl-chrome-meta hl-truncate" },
        h("span", { className: "hl-mono", style: { fontSize: 10.5 } }, shortId(getId(journey))),
        h("span", null, "/"),
        h("span", { className: "hl-truncate" }, journey ? (journey.summary || journey.root_prompt || "selected journey") : "no journey selected"),
        h("span", { className: "hl-mono", style: { fontSize: 10.5 } }, props.crossingsCount + " crossings"),
        journey && journey.status === "active" ? h("span", { className: "hl-live-cursor" }) : null,
      ),
      h("div", { style: { flex: 1 } }),
      h("button", { className: "hl-button", onClick: props.onToggleGuides },
        h("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "var(--hl-gold)" } }),
        "Guideposts ",
        h("span", { style: { color: "var(--hl-ink-3)" } }, props.guidepostCount),
      ),
      h("button", { className: "hl-button", onClick: props.onToggleTheme }, props.theme === "ink" ? "Paper" : "Ink"),
      h("button", { className: "hl-button", onClick: props.onToggleDensity }, props.density === "compact" ? "Comfy" : "Compact"),
      h("button", { className: cx("hl-button", props.redaction && "hl-primary"), onClick: props.onToggleRedaction }, "Redact"),
    );
  }

  function LeftNav(props) {
    return h("div", { className: "hl-left-nav" },
      ROUTES.map(function (item) {
        return h("button", {
          key: item[0],
          type: "button",
          title: item[2],
          className: cx("hl-nav-btn", props.route === item[0] && "hl-active"),
          onClick: function () { props.onRoute(item[0]); },
        }, h(Icon, { name: item[1], size: 16 }), h("span", null, item[2].slice(0, 3)));
      }),
      h("div", { style: { flex: 1 } }),
      h("div", { className: "hl-eyebrow", style: { writingMode: "vertical-rl", transform: "rotate(180deg)", color: "var(--hl-ink-4)" } }, "v0.2"),
    );
  }

  function JourneyIndex(props) {
    const useState = hooks.useState;
    const filterState = useState("");
    const sourceState = useState("all");
    const filter = filterState[0].toLowerCase();
    const source = sourceState[0];
    const sources = ["all", "cli", "dashboard", "gateway", "cron", "subagent"];
    const journeys = (props.journeys || []).filter(function (j) {
      const body = [getId(j), j.source, j.status, j.summary, j.root_prompt, j.model].join(" ").toLowerCase();
      return (source === "all" || j.source === source) && (!filter || body.indexOf(filter) >= 0);
    });
    return h("div", { className: "hl-index" },
      h("div", { className: "hl-panel-header" },
        h("div", { className: "hl-eyebrow" }, h("span", { className: "hl-dot" }), "Journey Index / ", props.journeys.length),
        h("div", { className: "hl-display", style: { fontSize: 22, marginTop: 6 } }, "Where the agent has been"),
        h("div", { className: "hl-search", style: { marginTop: 12 } },
          h(Icon, { name: "search", size: 13 }),
          h("input", {
            value: filterState[0],
            onChange: function (e) { filterState[1](e.target.value); },
            placeholder: "search journeys, models, prompts",
          }),
        ),
        h("div", { className: "hl-filter-row", style: { marginTop: 8 } },
          sources.map(function (s) {
            return h("button", {
              key: s,
              className: cx("hl-chip", source === s && "hl-active"),
              onClick: function () { sourceState[1](s); },
            }, s);
          }),
        ),
      ),
      h("div", { className: "hl-list" },
        journeys.length ? journeys.map(function (j) {
          const id = getId(j);
          const selected = id === props.selectedId;
          return h("button", {
            key: id,
            className: cx("hl-list-row", selected && "hl-selected"),
            onClick: function () { props.onSelect(id); },
          },
            h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } },
              h(SourceGlyph, { source: j.source }),
              h("span", { className: "hl-mono", style: { fontSize: 10, color: "var(--hl-ink-3)", textTransform: "uppercase", letterSpacing: "0.04em" } }, j.source || "unknown"),
              h("span", { className: "hl-mono", style: { fontSize: 10, color: "var(--hl-ink-4)" } }, "/ " + shortId(id)),
              h("span", { style: { flex: 1 } }),
              h(StatusPip, { status: j.status }),
            ),
            h("div", { className: "hl-title" }, trunc(j.summary || j.root_prompt || "(no prompt preview)", 130)),
            h("div", { className: "hl-meta", style: { marginTop: 6 } },
              h(Meta, { label: "t", value: fmtClock(j.started_at) }),
              h(Meta, { label: "dur", value: fmtDuration(j.duration_ms) }),
              h(Meta, { label: "msg", value: j.message_count || 0 }),
              h(Meta, { label: "tool", value: j.tool_call_count || 0 }),
              h(Meta, { label: "model", value: trunc((j.model_sequence || [j.model]).filter(Boolean).join(" -> "), 20) }),
            ),
          );
        }) : h(Empty, null, "No journeys matched."),
      ),
    );
  }

  function JourneyHeader(props) {
    const j = props.journey;
    if (!j) return h("div", { className: "hl-journey-header" }, h(Empty, null, "Select a journey."));
    return h("div", { className: "hl-journey-header" },
      h("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 6 } },
        h(SourceGlyph, { source: j.source, size: 16 }),
        h("span", { className: "hl-mono", style: { fontSize: 10.5, color: "var(--hl-ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" } }, (j.source || "unknown") + " / " + getId(j)),
        h("div", { style: { flex: 1 } }),
        h(StatusPip, { status: j.status }),
      ),
      h("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, flexWrap: "wrap" } },
        h("div", { style: { flex: "1 1 460px", minWidth: 0 } },
          h("div", { className: "hl-display", style: { fontSize: 26, lineHeight: 1.15 } }, j.summary || j.root_prompt || "Untitled journey"),
          h("div", { className: "hl-mono", style: { fontSize: 11, color: "var(--hl-ink-3)", marginTop: 6 } }, '"' + trunc(j.root_prompt || j.summary || "unknown prompt", 180) + '"'),
        ),
        h("div", { className: "hl-meta", style: { gap: 18 } },
          h(Meta, { label: "elapsed", value: fmtDuration(j.duration_ms) }),
          h(Meta, { label: "model", value: trunc((j.model_sequence || [j.model]).filter(Boolean).join(" -> "), 34) }),
          h(Meta, { label: "cost", value: j.actual_cost || j.estimated_cost || j.cost_status || "unknown" }),
          h(Meta, { label: "tokens", value: ((j.token_counts && j.token_counts.input) || 0) + " in" }),
        ),
      ),
      h("div", { style: { display: "flex", alignItems: "center", gap: 10, marginTop: 14 } },
        h("span", { className: "hl-eyebrow" }, "map"),
        h("div", { className: "hl-segment" },
          [["thread", "Thread"], ["corridor", "Corridor"], ["flight", "Flight strip"]].map(function (entry) {
            return h("button", {
              key: entry[0],
              className: props.mapStyle === entry[0] ? "hl-active" : "",
              onClick: function () { props.onMapStyle(entry[0]); },
            }, entry[1]);
          }),
        ),
        h("div", { style: { flex: 1 } }),
        h("label", { className: "hl-mono", style: { display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.04em", cursor: "pointer" } },
          h("input", {
            type: "checkbox",
            checked: props.thresholdsOnly,
            onChange: function (e) { props.onThresholdsOnly(e.target.checked); },
          }),
          "Thresholds only",
        ),
      ),
    );
  }

  function LabyrinthMap(props) {
    if (props.mapStyle === "corridor") return h(MapCorridor, props);
    if (props.mapStyle === "flight") return h(MapFlightStrip, props);
    return h(MapThread, props);
  }

  function visibleCrossings(crossings, thresholdsOnly) {
    const base = crossings || [];
    return thresholdsOnly ? base.filter(isThreshold) : base;
  }

  function MapThread(props) {
    const list = visibleCrossings(props.crossings, props.thresholdsOnly);
    const W = 760;
    const ROW = 56;
    const cx0 = 360;
    const H = Math.max(220, list.length * ROW + 80);
    function xFor(c) {
      const thread = crossingThread(c);
      return thread === "tools" ? cx0 + 110 : thread === "delegation" ? cx0 - 110 : cx0;
    }
    return h("svg", { className: "hl-map-svg", width: "100%", viewBox: "0 0 " + W + " " + H },
      h("defs", null,
        h("pattern", { id: "hl-dot", x: 0, y: 0, width: 20, height: 20, patternUnits: "userSpaceOnUse" },
          h("circle", { cx: 1, cy: 1, r: 0.5, fill: "var(--hl-ink-5)" }),
        ),
      ),
      h("rect", { x: 0, y: 0, width: W, height: H, fill: "url(#hl-dot)", opacity: 0.35 }),
      h("line", { x1: cx0, y1: 20, x2: cx0, y2: H - 30, stroke: "var(--hl-ink)", strokeWidth: 1 }),
      list.map(function (c, i) {
        const id = getCrossingId(c);
        const y = 50 + i * ROW;
        const x = xFor(c);
        const selected = id === props.selectedId;
        const failed = c.status === "failed";
        const active = c.status === "active";
        const stroke = failed ? "var(--hl-danger)" : "var(--hl-ink)";
        return h("g", { key: id, onClick: function () { props.onSelect(id); }, style: { cursor: "pointer" } },
          x !== cx0 ? h("path", {
            d: "M " + cx0 + " " + y + " Q " + ((cx0 + x) / 2) + " " + y + " " + x + " " + y,
            fill: "none",
            stroke: stroke,
            strokeWidth: 1,
            opacity: failed ? 0.9 : 0.55,
            className: active ? "hl-thread-active" : "",
          }) : null,
          isThreshold(c) ? h("line", { x1: cx0 - 44, y1: y, x2: cx0 + 44, y2: y, stroke: "var(--hl-gold)", strokeWidth: 1.25 }) : null,
          h("circle", { cx: x, cy: y, r: selected ? 8 : 5, fill: selected ? "var(--hl-ink)" : "var(--hl-paper)", stroke: stroke, strokeWidth: 1.25 }),
          failed ? h("circle", { cx: x, cy: y, r: 11, fill: "none", stroke: "var(--hl-danger)", strokeWidth: 0.75, strokeDasharray: "2 2" }) : null,
          active ? h("circle", { cx: x, cy: y, r: 14, fill: "none", stroke: "var(--hl-thread)", strokeWidth: 1, className: "hl-thread-active" }) : null,
          h(CrossingGlyph, { type: c.type, x: x + (x >= cx0 ? 14 : -34), y: y - 10, size: 20 }),
          h("text", { x: x + (x >= cx0 ? 40 : -40), y: y + 1, textAnchor: x >= cx0 ? "start" : "end", fontFamily: "var(--hl-font-mono)", fontSize: 11, fill: "var(--hl-ink-2)" }, trunc(c.label || c.type, 26)),
          h("text", { x: x + (x >= cx0 ? 40 : -40), y: y + 14, textAnchor: x >= cx0 ? "start" : "end", fontFamily: "var(--hl-font-mono)", fontSize: 10, fill: "var(--hl-ink-3)" }, fmtClock(c.started_at) + (c.duration_ms ? " / " + fmtDuration(c.duration_ms) : "")),
        );
      }),
      h("path", { d: "M " + (cx0 - 4) + " " + (H - 30) + " L " + cx0 + " " + (H - 22) + " L " + (cx0 + 4) + " " + (H - 30), fill: "none", stroke: "var(--hl-ink)", strokeWidth: 1 }),
    );
  }

  function MapCorridor(props) {
    const list = visibleCrossings(props.crossings, props.thresholdsOnly);
    const cols = 3;
    const colW = 220;
    const rowH = 110;
    const padX = 60;
    const padY = 50;
    const rows = Math.max(1, Math.ceil(list.length / cols));
    const W = padX * 2 + cols * colW;
    const H = padY * 2 + rows * rowH;
    function pos(i) {
      const row = Math.floor(i / cols);
      const colIn = i % cols;
      const col = row % 2 === 0 ? colIn : cols - 1 - colIn;
      return { x: padX + col * colW + colW / 2, y: padY + row * rowH + rowH / 2, row: row };
    }
    const pts = list.map(function (_, i) { return pos(i); });
    let d = pts[0] ? "M " + pts[0].x + " " + pts[0].y : "";
    for (let i = 1; i < pts.length; i += 1) {
      const a = pts[i - 1];
      const b = pts[i];
      if (a.row === b.row) d += " L " + b.x + " " + b.y;
      else d += " Q " + a.x + " " + ((a.y + b.y) / 2) + " " + ((a.x + b.x) / 2) + " " + ((a.y + b.y) / 2) + " Q " + b.x + " " + ((a.y + b.y) / 2) + " " + b.x + " " + b.y;
    }
    return h("svg", { className: "hl-map-svg", width: "100%", viewBox: "0 0 " + W + " " + H },
      h("rect", { x: padX - 30, y: padY - 30, width: W - padX * 2 + 60, height: H - padY * 2 + 60, fill: "none", stroke: "var(--hl-ink)", strokeWidth: 1 }),
      d ? h("path", { d: d, fill: "none", stroke: "var(--hl-ink)", strokeWidth: 1.25, opacity: 0.85 }) : null,
      list.map(function (c, i) {
        const p = pts[i];
        const id = getCrossingId(c);
        const selected = id === props.selectedId;
        const failed = c.status === "failed";
        return h("g", { key: id, onClick: function () { props.onSelect(id); }, style: { cursor: "pointer" } },
          isThreshold(c) ? h("g", null,
            h("line", { x1: p.x - 22, y1: p.y - 22, x2: p.x - 22, y2: p.y + 22, stroke: "var(--hl-gold)", strokeWidth: 1.25 }),
            h("line", { x1: p.x + 22, y1: p.y - 22, x2: p.x + 22, y2: p.y + 22, stroke: "var(--hl-gold)", strokeWidth: 1.25 }),
          ) : null,
          h("rect", { x: p.x - 62, y: p.y - 24, width: 124, height: 48, rx: 2, fill: "var(--hl-paper)", stroke: selected ? "var(--hl-ink)" : failed ? "var(--hl-danger)" : "var(--hl-line-2)", strokeWidth: selected ? 1.25 : 0.75 }),
          h(CrossingGlyph, { type: c.type, x: p.x - 54, y: p.y - 16, size: 18 }),
          h("text", { x: p.x - 30, y: p.y - 4, fontFamily: "var(--hl-font-mono)", fontSize: 10.5, fill: "var(--hl-ink)" }, trunc(c.label || c.type, 16)),
          h("text", { x: p.x - 30, y: p.y + 10, fontFamily: "var(--hl-font-mono)", fontSize: 9.5, fill: "var(--hl-ink-3)" }, fmtClock(c.started_at)),
        );
      }),
    );
  }

  function MapFlightStrip(props) {
    const list = visibleCrossings(props.crossings, props.thresholdsOnly);
    const W = Math.max(1100, list.length * 72);
    const H = 240;
    const base = 150;
    function xFor(i) {
      return 60 + (i / Math.max(1, list.length - 1)) * (W - 120);
    }
    return h("svg", { className: "hl-map-svg", width: "100%", viewBox: "0 0 " + W + " " + H },
      h("line", { x1: 40, y1: base, x2: W - 40, y2: base, stroke: "var(--hl-ink)", strokeWidth: 1 }),
      list.map(function (c, i) {
        const x = xFor(i);
        const y = isThreshold(c) ? 50 : crossingThread(c) === "tools" ? 100 : crossingThread(c) === "delegation" ? 200 : base;
        const id = getCrossingId(c);
        const selected = id === props.selectedId;
        const failed = c.status === "failed";
        return h("g", { key: id, onClick: function () { props.onSelect(id); }, style: { cursor: "pointer" } },
          h("line", { x1: x, y1: base, x2: x, y2: y, stroke: isThreshold(c) ? "var(--hl-gold)" : failed ? "var(--hl-danger)" : "var(--hl-ink)", strokeWidth: isThreshold(c) ? 1.25 : 1, strokeDasharray: crossingThread(c) === "delegation" ? "2 2" : "0" }),
          h("circle", { cx: x, cy: y, r: selected ? 7 : 4.5, fill: selected ? "var(--hl-ink)" : "var(--hl-paper)", stroke: failed ? "var(--hl-danger)" : "var(--hl-ink)", strokeWidth: 1.25 }),
          h(CrossingGlyph, { type: c.type, x: x - 9, y: y - 28, size: 18 }),
          h("text", { x: x, y: base + 18, textAnchor: "middle", fontFamily: "var(--hl-font-mono)", fontSize: 9, fill: "var(--hl-ink-3)" }, fmtClock(c.started_at).slice(3)),
        );
      }),
      [["THRESHOLD", 46], ["TOOL", 96], ["MAIN", base - 4], ["DELEGATION", 206]].map(function (item) {
        return h("text", { key: item[0], x: 40, y: item[1], fontFamily: "var(--hl-font-mono)", fontSize: 9.5, fill: "var(--hl-ink-3)" }, item[0]);
      }),
    );
  }

  function Inspector(props) {
    const c = props.crossing;
    if (!c) return h("div", { className: "hl-inspector-body" }, h("div", { className: "hl-panel-header" }, h("div", { className: "hl-eyebrow" }, h("span", { className: "hl-dot" }), "Crossing Inspector")), h("div", { className: "hl-inspector-scroll" }, h(Empty, null, "Select a crossing on the map to inspect its evidence.")));
    const failed = c.status === "failed";
    const input = redactClient(c.inputs_preview || "", props.redaction);
    const output = redactClient(c.outputs_preview || "", props.redaction);
    return h("div", { className: "hl-inspector-body" },
      h("div", { className: "hl-panel-header" },
        h("div", { className: "hl-eyebrow" }, h("span", { className: "hl-dot" }), "Crossing / " + shortId(getCrossingId(c))),
        h("div", { style: { display: "flex", alignItems: "center", gap: 12, marginTop: 8 } },
          h("div", { style: { width: 32, height: 32, border: "1px solid var(--hl-ink)", display: "flex", alignItems: "center", justifyContent: "center" } }, h(CrossingGlyph, { type: c.type, size: 20 })),
          h("div", { style: { flex: 1, minWidth: 0 } },
            h("div", { style: { fontSize: 16, fontWeight: 500 } }, c.label || c.type, c.status === "active" ? h("span", { className: "hl-live-cursor" }) : null),
            h("div", { className: "hl-mono", style: { fontSize: 11, color: "var(--hl-ink-3)" } }, (c.type || "unknown").replace("_", " ") + " / " + (c.actor || "unknown") + " -> " + (c.target || "unknown")),
          ),
          h(StatusPip, { status: c.status }),
        ),
      ),
      h("div", { style: { padding: "14px 22px", borderBottom: "1px solid var(--hl-line)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 } },
        h(MetaBlock, { label: "started", value: fmtClock(c.started_at) }),
        h(MetaBlock, { label: "duration", value: fmtDuration(c.duration_ms) }),
        h(MetaBlock, { label: "thread", value: crossingThread(c) }),
        h(MetaBlock, { label: "journey", value: shortId(props.journey && getId(props.journey)) }),
      ),
      h("div", { className: "hl-inspector-scroll" },
        input ? h(PreviewBlock, { label: "input", value: input }) : null,
        output ? h(PreviewBlock, { label: failed ? "output / failed" : "output", value: output, failed: failed }) : null,
        h("div", { style: { marginBottom: 14 } },
          h("div", { className: "hl-eyebrow" }, h("span", { className: "hl-dot" }), "evidence"),
          h("div", { style: { marginTop: 6, display: "flex", flexDirection: "column", gap: 4 } },
            (c.evidence_refs || []).length ? (c.evidence_refs || []).map(function (ref, i) {
              return h("div", { key: i, className: "hl-evidence-row" },
                h("span", { className: "hl-meta-label", style: { minWidth: 70 } }, ref.kind || "ref"),
                h("span", { className: "hl-mono hl-truncate", style: { color: "var(--hl-ink-2)", fontSize: 11 } }, ref.id || ref.field || JSON.stringify(ref)),
              );
            }) : h("div", { className: "hl-evidence-row" }, h("span", { className: "hl-meta-label" }, "local"), h("span", { className: "hl-mono" }, "session state")),
          ),
        ),
        failed ? h("div", { style: { padding: 10, border: "1px solid var(--hl-danger)", background: "rgba(138,47,31,0.04)" } },
          h("div", { className: "hl-eyebrow", style: { color: "var(--hl-danger)" } }, h("span", { className: "hl-dot" }), "guidepost"),
          h("div", { className: "hl-display", style: { fontSize: 14, marginTop: 4 } }, "The thread doubled back here. Inspect adjacent crossings for a repeated failure."),
        ) : null,
      ),
    );
  }

  function MetaBlock(props) {
    return h("div", null,
      h("div", { className: "hl-eyebrow", style: { fontSize: 9.5 } }, props.label),
      h("div", { className: "hl-mono", style: { fontSize: 12, marginTop: 2 } }, props.value || "unknown"),
    );
  }

  function PreviewBlock(props) {
    return h("div", { style: { marginBottom: 18 } },
      h("div", { className: "hl-eyebrow", style: { fontSize: 9.5 } }, h("span", { className: "hl-dot" }), props.label),
      h("pre", { className: cx("hl-pre", props.failed && "hl-failed") }, props.value || "(no preview)"),
    );
  }

  function GuidepostsPanel(props) {
    const items = props.guideposts || [];
    return h("div", { className: "hl-guide-list" },
      h("div", { className: "hl-panel-header", style: { display: "flex", alignItems: "flex-start", gap: 12 } },
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { className: "hl-eyebrow" }, h("span", { className: "hl-dot" }), "Guideposts"),
          h("div", { className: "hl-display", style: { fontSize: 17, marginTop: 4 } }, "What deserves your attention"),
        ),
        props.onClose ? h("button", { className: "hl-button", onClick: props.onClose }, h(Icon, { name: "x", size: 14 })) : null,
      ),
      h("div", { className: "hl-list" },
        items.length ? items.map(function (g, i) {
          const color = g.severity === "warning" ? "var(--hl-danger)" : g.severity === "notice" ? "var(--hl-warn)" : "var(--hl-ink-3)";
          return h("div", {
            key: i,
            className: "hl-guide-row",
            onClick: function () { props.onJump && props.onJump(g); },
          },
            h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 } },
              h("span", { style: { width: 6, height: 6, borderRadius: "50%", background: color } }),
              h("span", { className: "hl-mono", style: { fontSize: 9.5, letterSpacing: "0.06em", textTransform: "uppercase", color: color } }, g.severity || "info"),
              h("span", { className: "hl-mono", style: { fontSize: 9.5, color: "var(--hl-ink-4)", letterSpacing: "0.06em", textTransform: "uppercase" } }, "/ " + (g.kind || "guidepost")),
            ),
            h("div", { style: { fontSize: 13, fontWeight: 500, lineHeight: 1.4 } }, g.title),
            g.detail ? h("div", { style: { fontSize: 12, color: "var(--hl-ink-2)", marginTop: 4 } }, g.detail) : null,
            h("div", { className: "hl-mono", style: { fontSize: 10, color: "var(--hl-ink-3)", marginTop: 6 } }, shortId(g.journey_id || g.journey) + " / " + ((g.evidence_refs || g.evidence || []).length) + " evidence"),
          );
        }) : h(Empty, null, "No guideposts generated from available evidence."),
      ),
    );
  }

  function SkillAtlas(props) {
    const skills = props.skills || [];
    const groups = {};
    skills.forEach(function (s) {
      const key = s.source || "unknown";
      groups[key] = groups[key] || [];
      groups[key].push(s);
    });
    return h("div", { className: "hl-surface" },
      h(SurfaceTitle, { eyebrow: "Skill Atlas / " + skills.length + " skills", title: "The agent's evolving repertoire", body: "Skills are procedural memory: capabilities Hermes carries from one crossing into the next." }),
      ["user", "bundled", "optional", "external", "unknown"].map(function (source) {
        const list = groups[source] || [];
        if (!list.length) return null;
        return h("div", { key: source, style: { marginBottom: 32 } },
          h("div", { style: { display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12, paddingBottom: 6, borderBottom: "1px solid var(--hl-ink)" } },
            h("div", { className: "hl-eyebrow" }, source),
            h("div", { className: "hl-mono", style: { color: "var(--hl-ink-3)", fontSize: 10.5 } }, list.length + " skills"),
          ),
          h("div", { className: "hl-card-grid" },
            list.map(function (s) {
              return h("div", { key: source + ":" + s.name, className: "hl-card-cell", style: { opacity: s.enabled === false ? 0.7 : 1 } },
                h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 } },
                  h("span", { className: "hl-mono", style: { fontSize: 12, fontWeight: 500 } }, s.name),
                  h("span", { style: { flex: 1 } }),
                  h(StatusPip, { status: s.enabled === false ? "disabled" : "ok" }),
                ),
                h("div", { style: { fontSize: 12, color: "var(--hl-ink-2)", minHeight: 36 } }, trunc(s.description || "", 160)),
                h("div", { className: "hl-meta", style: { marginTop: 8 } },
                  h(Meta, { label: "cat", value: s.category || "none" }),
                  h(Meta, { label: "files", value: s.file_count || 1 }),
                ),
                h("div", { className: "hl-mono hl-truncate", style: { fontSize: 9.5, color: "var(--hl-ink-4)", marginTop: 6 } }, s.relative_path || s.path || ""),
              );
            }),
          ),
        );
      }),
    );
  }

  function CronGate(props) {
    const cron = props.cron || [];
    return h("div", { className: "hl-surface" },
      h(SurfaceTitle, { eyebrow: "Cron Gate / " + cron.length + " jobs", title: "Scheduled crossings into unattended hours", body: "Jobs that begin without a human prompt. Each run becomes a journey." }),
      cron.length ? h("div", { className: "hl-table" },
        h("div", { className: "hl-table-row hl-table-head" }, ["", "job", "schedule", "next run", "last run", "status"].map(function (label, i) {
          return h("div", { key: i, className: "hl-eyebrow" }, label);
        })),
        cron.map(function (job) {
          return h("div", { key: job.id || job.name, className: "hl-table-row" },
            h("div", null, h(SourceGlyph, { source: "cron" })),
            h("div", null,
              h("div", { className: "hl-mono", style: { fontSize: 12, fontWeight: 500 } }, job.name || job.id || "cron job"),
              h("div", { className: "hl-meta", style: { marginTop: 4 } },
                h(Meta, { label: "model", value: job.model || "default" }),
                h(Meta, { label: "deliver", value: job.deliver || "local" }),
                h(Meta, { label: "skills", value: (job.skills || []).join(", ") || "none" }),
              ),
              h("div", { className: "hl-mono hl-truncate", style: { fontSize: 9.5, color: "var(--hl-ink-3)", marginTop: 4 } }, job.workdir || "unknown workdir"),
              job.last_error ? h("div", { style: { color: "var(--hl-danger)", fontSize: 11, marginTop: 4 } }, job.last_error) : null,
            ),
            h("div", { className: "hl-mono", style: { fontSize: 11 } }, job.schedule_display || "unknown"),
            h("div", { className: "hl-mono", style: { fontSize: 11 } }, fmtTime(job.next_run_at)),
            h("div", { className: "hl-mono", style: { fontSize: 11 } }, fmtTime(job.last_run_at)),
            h("div", null, h(StatusPip, { status: job.enabled === false ? "disabled" : (job.last_status || job.state || "unknown") })),
          );
        }),
      ) : h(Empty, null, "No cron gates configured."),
    );
  }

  function ModelFerry(props) {
    const journeys = props.journeys || [];
    const transitions = [];
    journeys.forEach(function (j) {
      const seq = (j.model_sequence || []).filter(Boolean);
      if (seq.length > 1) {
        for (let i = 1; i < seq.length; i += 1) {
          transitions.push({ from: seq[i - 1], to: seq[i], journey: getId(j), at: j.started_at, cause: "recorded model sequence" });
        }
      } else if (seq[0] || j.model) {
        transitions.push({ from: "start", to: seq[0] || j.model, journey: getId(j), at: j.started_at, cause: j.source || "journey" });
      }
    });
    const providers = {};
    transitions.forEach(function (t) {
      providers[t.to] = providers[t.to] || { name: t.to, journeys: 0 };
      providers[t.to].journeys += 1;
    });
    return h("div", { className: "hl-surface" },
      h(SurfaceTitle, { eyebrow: "Model Ferry / Crossroads", title: "Which model carried which crossing", body: "Model and provider motion is treated as a boundary crossing, not hidden plumbing." }),
      h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 } },
        h("div", null,
          h("div", { className: "hl-eyebrow", style: { paddingBottom: 6, borderBottom: "1px solid var(--hl-ink)", marginBottom: 12 } }, "recent transitions"),
          transitions.slice(0, 20).map(function (t, i) {
            return h("div", { key: i, style: { padding: "12px 0", borderBottom: "1px solid var(--hl-line)" } },
              h("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                h("span", { className: "hl-mono", style: { color: "var(--hl-ink-3)", fontSize: 11 } }, t.from),
                h(CrossingGlyph, { type: "model_switch", size: 16 }),
                h("span", { className: "hl-mono", style: { fontWeight: 500, fontSize: 12 } }, t.to),
                h("span", { style: { flex: 1 } }),
                h("span", { className: "hl-mono", style: { color: "var(--hl-ink-3)", fontSize: 10.5 } }, fmtClock(t.at)),
              ),
              h("div", { className: "hl-display", style: { fontSize: 13, color: "var(--hl-ink-2)", marginTop: 4 } }, t.cause),
              h("div", { className: "hl-mono", style: { color: "var(--hl-ink-4)", fontSize: 10, marginTop: 2 } }, "journey " + shortId(t.journey)),
            );
          }),
        ),
        h("div", null,
          h("div", { className: "hl-eyebrow", style: { paddingBottom: 6, borderBottom: "1px solid var(--hl-ink)", marginBottom: 12 } }, "models seen"),
          Object.keys(providers).length ? Object.keys(providers).map(function (name) {
            return h("div", { key: name, style: { padding: "12px 0", borderBottom: "1px solid var(--hl-line)", display: "flex", alignItems: "center", gap: 12 } },
              h("span", { className: "hl-mono", style: { minWidth: 160, fontWeight: 500 } }, name),
              h(Meta, { label: "journeys", value: providers[name].journeys }),
              h("span", { style: { flex: 1 } }),
              h(StatusPip, { status: "ok" }),
            );
          }) : h(Empty, null, "No model data available."),
        ),
      ),
    );
  }

  function MemoryMap(props) {
    const journeys = props.journeys || [];
    const compressions = (props.crossings || []).filter(function (c) { return c.type === "context_compression"; }).length;
    const memoryOps = (props.crossings || []).filter(function (c) { return c.type === "memory_op"; }).length;
    return h("div", { className: "hl-surface" },
      h(SurfaceTitle, { eyebrow: "Memory and Context", title: "What the agent carried, what it dropped", body: "This surface summarizes memory and compression traces available from local session evidence." }),
      h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "1px solid var(--hl-ink)" } },
        [
          ["journeys", journeys.length, "recent session inventory"],
          ["memory ops", memoryOps, "selected journey crossings"],
          ["compressions", compressions, "selected journey crossings"],
          ["input tokens", ((props.journey && props.journey.token_counts && props.journey.token_counts.input) || 0), "selected journey"],
          ["cache read", ((props.journey && props.journey.token_counts && props.journey.token_counts.cache_read) || 0), "selected journey"],
          ["reasoning", ((props.journey && props.journey.token_counts && props.journey.token_counts.reasoning) || 0), "selected journey"],
        ].map(function (cell, i) {
          return h("div", { key: cell[0], style: { padding: 20, borderRight: i % 3 < 2 ? "1px solid var(--hl-line)" : "none", borderBottom: i < 3 ? "1px solid var(--hl-line)" : "none" } },
            h("div", { className: "hl-eyebrow" }, cell[0]),
            h("div", { className: "hl-display", style: { fontSize: 28, marginTop: 6 } }, cell[1]),
            h("div", { className: "hl-mono", style: { fontSize: 10.5, color: "var(--hl-ink-3)", marginTop: 4 } }, cell[2]),
          );
        }),
      ),
    );
  }

  function LabyrinthReport(props) {
    const journey = props.journey;
    return h("div", { className: "hl-surface", style: { maxWidth: 980 } },
      h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 } },
        h("div", { className: "hl-eyebrow" }, h("span", { className: "hl-dot" }), "Labyrinth Report / redacted markdown"),
        h("button", { className: "hl-button hl-primary", disabled: !journey, onClick: props.onGenerateReport }, h(Icon, { name: "download", size: 13 }), "Generate"),
      ),
      h("div", { className: "hl-display-large", style: { marginTop: 8, marginBottom: 8 } }, journey ? "Hermes Labyrinth Report / " + getId(journey) : "No journey selected"),
      h("hr", { style: { border: 0, borderTop: "1px solid var(--hl-ink)", marginBottom: 18 } }),
      props.report ? h("pre", { className: "hl-pre", style: { maxHeight: 520, overflow: "auto" } }, props.report) : h("div", null,
        journey ? h("div", null,
          h(ReportSection, { title: "Journey" },
            h(KV, { k: "source", v: journey.source }),
            h(KV, { k: "status", v: journey.status }),
            h(KV, { k: "model", v: (journey.model_sequence || [journey.model]).filter(Boolean).join(" -> ") }),
            h(KV, { k: "started", v: fmtTime(journey.started_at) }),
            h(KV, { k: "duration", v: fmtDuration(journey.duration_ms) }),
            h(KV, { k: "messages", v: journey.message_count }),
            h(KV, { k: "tool calls", v: journey.tool_call_count }),
            h(KV, { k: "summary", v: journey.summary || journey.root_prompt }),
          ),
          h(ReportSection, { title: "Crossings (" + (props.crossings || []).length + ")" },
            (props.crossings || []).slice(0, 12).map(function (c) {
              return h("div", { key: getCrossingId(c), style: { padding: "6px 0", borderBottom: "1px dotted var(--hl-line)" } },
                h("div", { className: "hl-mono", style: { fontSize: 11 } }, c.type + " / " + c.status + ": " + (c.label || "")),
                h("div", { className: "hl-mono", style: { fontSize: 10.5, color: "var(--hl-ink-3)", paddingLeft: 12 } }, trunc(redactClient(c.outputs_preview || c.inputs_preview || "", props.redaction), 140)),
              );
            }),
          ),
        ) : h(Empty, null, "Select a journey before generating a report."),
      ),
    );
  }

  function ReportSection(props) {
    return h("div", { style: { marginBottom: 24 } },
      h("div", { className: "hl-eyebrow", style: { paddingBottom: 6, borderBottom: "1px solid var(--hl-ink)", marginBottom: 10 } }, props.title),
      props.children,
    );
  }

  function KV(props) {
    return h("div", { className: "hl-kv" },
      h("span", { className: "hl-kv-label" }, props.k),
      h("span", { className: "hl-kv-value" }, props.v == null || props.v === "" ? "unknown" : String(props.v)),
    );
  }

  function SurfaceTitle(props) {
    return h("div", { style: { marginBottom: 24 } },
      h("div", { className: "hl-eyebrow" }, h("span", { className: "hl-dot" }), props.eyebrow),
      h("div", { className: "hl-display-large", style: { marginTop: 4 } }, props.title),
      props.body ? h("p", { style: { color: "var(--hl-ink-3)", fontSize: 13, maxWidth: 680, marginTop: 6 } }, props.body) : null,
    );
  }

  function BottomBar(props) {
    const failures = (props.crossings || []).filter(function (c) { return c.status === "failed"; }).length;
    const thresholds = (props.crossings || []).filter(isThreshold).length;
    return h("div", { className: "hl-bottom-bar" },
      h("span", null, h("span", { className: "hl-pulse", style: { width: 6, height: 6, background: "var(--hl-thread)", borderRadius: "50%", display: "inline-block", marginRight: 6 } }), "plugin: mounted"),
      h("span", null, "/"),
      h("span", null, "crossings ", h("span", { style: { color: "var(--hl-ink)" } }, (props.crossings || []).length)),
      h("span", null, "/"),
      h("span", null, "thresholds ", h("span", { style: { color: "var(--hl-ink)" } }, thresholds)),
      failures ? h("span", null, "/ failures ", h("span", { style: { color: "var(--hl-danger)" } }, failures)) : null,
      h("div", { style: { flex: 1 } }),
      h("span", null, new Date().toISOString().slice(11, 19) + "Z"),
    );
  }

  function LabyrinthPage() {
    const useState = hooks.useState;
    const useEffect = hooks.useEffect;

    const routeState = useState("labyrinth");
    const route = routeState[0];
    const setRoute = routeState[1];
    const selectedState = useState(null);
    const selectedId = selectedState[0];
    const setSelectedId = selectedState[1];
    const crossingState = useState(null);
    const selectedCrossingId = crossingState[0];
    const setSelectedCrossingId = crossingState[1];
    const journeysState = useState([]);
    const journeys = journeysState[0];
    const setJourneys = journeysState[1];
    const detailState = useState(null);
    const detail = detailState[0];
    const setDetail = detailState[1];
    const crossingsState = useState([]);
    const crossings = crossingsState[0];
    const setCrossings = crossingsState[1];
    const skillsState = useState([]);
    const skills = skillsState[0];
    const setSkills = skillsState[1];
    const cronState = useState([]);
    const cron = cronState[0];
    const setCron = cronState[1];
    const guideState = useState([]);
    const guideposts = guideState[0];
    const setGuideposts = guideState[1];
    const reportState = useState("");
    const report = reportState[0];
    const setReport = reportState[1];
    const errorState = useState("");
    const error = errorState[0];
    const setError = errorState[1];
    const mapState = useState("thread");
    const mapStyle = mapState[0];
    const setMapStyle = mapState[1];
    const thresholdsState = useState(false);
    const thresholdsOnly = thresholdsState[0];
    const setThresholdsOnly = thresholdsState[1];
    const guidesOpenState = useState(false);
    const showGuides = guidesOpenState[0];
    const setShowGuides = guidesOpenState[1];
    const redactionState = useState(true);
    const redaction = redactionState[0];
    const setRedaction = redactionState[1];
    const themeState = useState("ink");
    const theme = themeState[0];
    const setTheme = themeState[1];
    const densityState = useState("comfortable");
    const density = densityState[0];
    const setDensity = densityState[1];

    function loadOverview() {
      setError("");
      return Promise.all([
        SDK.fetchJSON(API + "/journeys?limit=40&include_children=true"),
        SDK.fetchJSON(API + "/skills"),
        SDK.fetchJSON(API + "/cron"),
        SDK.fetchJSON(API + "/guideposts?limit=20"),
      ]).then(function (res) {
        const list = res[0].journeys || [];
        setJourneys(list);
        setSkills(res[1].skills || []);
        setCron(res[2].jobs || []);
        setGuideposts(res[3].guideposts || []);
        if (!selectedId && list.length) setSelectedId(getId(list[0]));
      }).catch(function (err) {
        setError(err.message || String(err));
      });
    }

    useEffect(function () {
      loadOverview();
    }, []);

    useEffect(function () {
      if (!selectedId) return;
      setReport("");
      Promise.all([
        SDK.fetchJSON(API + "/journeys/" + encodeURIComponent(selectedId)),
        SDK.fetchJSON(API + "/journeys/" + encodeURIComponent(selectedId) + "/crossings"),
      ]).then(function (res) {
        const nextCrossings = res[1].crossings || [];
        setDetail(res[0]);
        setCrossings(nextCrossings);
        if (!selectedCrossingId || !nextCrossings.some(function (c) { return getCrossingId(c) === selectedCrossingId; })) {
          setSelectedCrossingId(nextCrossings[Math.min(7, nextCrossings.length - 1)] ? getCrossingId(nextCrossings[Math.min(7, nextCrossings.length - 1)]) : null);
        }
      }).catch(function (err) {
        setDetail(null);
        setCrossings([]);
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

    function jumpGuidepost(g) {
      if (g.journey_id || g.journey) setSelectedId(g.journey_id || g.journey);
      const evidence = g.evidence_refs || g.evidence || [];
      const crossing = evidence.find(function (e) { return e.kind === "crossing"; });
      if (crossing && crossing.id) setSelectedCrossingId(crossing.id);
      setRoute("labyrinth");
      setShowGuides(false);
    }

    const journey = detail && detail.journey ? detail.journey : journeys.find(function (j) { return getId(j) === selectedId; });
    const selectedCrossing = crossings.find(function (c) { return getCrossingId(c) === selectedCrossingId; }) || crossings[0] || null;
    const rootClass = cx("hl-root", theme === "ink" && "hl-theme-ink", density === "compact" && "hl-density-compact", "hl-myth-on");

    return h("div", { className: rootClass },
      h(TopChrome, {
        journey: journey,
        crossingsCount: crossings.length,
        guidepostCount: guideposts.length,
        onToggleGuides: function () { setShowGuides(!showGuides); },
        theme: theme,
        onToggleTheme: function () { setTheme(theme === "ink" ? "paper" : "ink"); },
        density: density,
        onToggleDensity: function () { setDensity(density === "compact" ? "comfortable" : "compact"); },
        redaction: redaction,
        onToggleRedaction: function () { setRedaction(!redaction); },
      }),
      h(LeftNav, { route: route, onRoute: setRoute }),
      route === "labyrinth" ? h(React.Fragment, null,
        h(JourneyIndex, { journeys: journeys, selectedId: selectedId, onSelect: setSelectedId }),
        h("div", { className: "hl-main" },
          h(JourneyHeader, { journey: journey, mapStyle: mapStyle, onMapStyle: setMapStyle, thresholdsOnly: thresholdsOnly, onThresholdsOnly: setThresholdsOnly }),
          error ? h("div", { style: { padding: 12, color: "var(--hl-danger)", borderBottom: "1px solid var(--hl-danger)" } }, error) : null,
          h("div", { className: "hl-map-wrap" },
            crossings.length ? h(LabyrinthMap, { crossings: crossings, selectedId: selectedCrossingId, onSelect: setSelectedCrossingId, mapStyle: mapStyle, thresholdsOnly: thresholdsOnly }) : h(Empty, null, "No crossings available yet. Run Hermes once, then return to the Labyrinth."),
          ),
        ),
        h("div", { className: "hl-inspector" }, h(Inspector, { crossing: selectedCrossing, journey: journey, redaction: redaction })),
      ) : null,
      route === "guideposts" ? h("div", { className: "hl-surface", style: { padding: 0 } }, h(GuidepostsPanel, { guideposts: guideposts, onJump: jumpGuidepost })) : null,
      route === "skills" ? h(SkillAtlas, { skills: skills }) : null,
      route === "cron" ? h(CronGate, { cron: cron }) : null,
      route === "ferry" ? h(ModelFerry, { journeys: journeys }) : null,
      route === "memory" ? h(MemoryMap, { journeys: journeys, journey: journey, crossings: crossings }) : null,
      route === "report" ? h(LabyrinthReport, { journey: journey, crossings: crossings, redaction: redaction, report: report, onGenerateReport: generateReport }) : null,
      h(BottomBar, { crossings: crossings }),
      showGuides ? h("div", { className: "hl-guide-overlay" }, h(GuidepostsPanel, { guideposts: guideposts, onJump: jumpGuidepost, onClose: function () { setShowGuides(false); } })) : null,
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
      h("span", { className: "inline-flex h-2 w-2 rounded-full", style: { background: health.ok ? "var(--hl-thread, #c8d4e8)" : "var(--destructive)" } }),
      h("span", null, "Labyrinth"),
    );
  }

  window.__HERMES_PLUGINS__.register("hermes-labyrinth", LabyrinthPage);
  window.__HERMES_PLUGINS__.registerSlot("hermes-labyrinth", "header-right", HeaderStatus);
})();
