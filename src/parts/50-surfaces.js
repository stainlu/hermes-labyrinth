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
