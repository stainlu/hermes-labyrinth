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
