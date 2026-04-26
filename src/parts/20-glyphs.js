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
