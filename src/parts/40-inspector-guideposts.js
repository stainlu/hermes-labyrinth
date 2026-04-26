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
