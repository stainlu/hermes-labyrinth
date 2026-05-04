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
        minHeight: "100vh",
        padding: 24,
        textAlign: "center"
      }
    }, React.createElement("div", {
      style: {
        maxWidth: 680
      }
    }, React.createElement("div", {
      className: "eyebrow"
    }, error ? "Labyrinth cannot read Hermes state" : "Loading Labyrinth"), error && React.createElement("p", {
      style: {
        marginTop: 12,
        color: "var(--ink-2)",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        lineHeight: 1.6
      }
    }, error)));
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
