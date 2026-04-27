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
    const D = data || SAMPLE_DATA;
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
    }, guidepostCount)));
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
