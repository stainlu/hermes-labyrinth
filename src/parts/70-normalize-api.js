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
      started_at: formatDateTime(j.started_at),
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
