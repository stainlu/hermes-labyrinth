import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalizeSource = readFileSync("src/parts/70-normalize-api.js", "utf8");
const journeyIndexSource = readFileSync("src/parts/50-surfaces.js", "utf8");
const experienceSource = readFileSync("src/parts/60-experience-chrome.js", "utf8");

const loadApiHelpers = new Function(
  "SAMPLE_DATA",
  "SDK",
  "API",
  `${normalizeSource}
return { normalizeJourney, normalizeData, clock, describeApiError };`,
);

const { normalizeJourney, normalizeData, clock, describeApiError } = loadApiHelpers(
  { journeys: [], debugCrossings: [], cleanCrossings: [], guideposts: [], skills: [], cron: [] },
  {},
  "/api/plugins/hermes-labyrinth",
);

const timestampSeconds = 1714262400;
const timestampMillis = timestampSeconds * 1000;

const normalizedJourney = normalizeJourney(
  {
    journey_id: "journey-1",
    started_at: timestampSeconds,
    ended_at: timestampMillis + 1500,
    duration_ms: 1500,
  },
  [],
);

assert.equal(
  normalizedJourney.started_at,
  "2024-04-28 00:00:00",
  "normalizeJourney should format numeric Unix-second started_at timestamps",
);
assert.equal(
  normalizedJourney.ended_at,
  "2024-04-28 00:00:01",
  "normalizeJourney should format numeric Unix-millisecond ended_at timestamps",
);
assert.equal(
  clock(normalizedJourney.started_at),
  "00:00:00",
  "formatted journey timestamps should remain compatible with UI clock extraction",
);
assert.equal(clock(timestampSeconds), "00:00:00", "clock should handle raw Unix-second timestamps");
assert.equal(clock("2026-04-28T14:25:30Z"), "14:25:30", "clock should handle ISO timestamps");
assert.equal(clock(null), "unknown", "clock should handle missing timestamps");
assert.match(
  describeApiError(new SyntaxError("Unexpected token '<', \"<!doctype \"... is not valid JSON")),
  /backend API is not mounted/,
  "HTML SPA fallback should produce an actionable backend-not-mounted diagnostic",
);
assert.match(
  describeApiError(new Error("404: Plugin not found")),
  /plugin assets or API routes were not found/,
  "missing plugin assets should produce an actionable install diagnostic",
);

const normalizedData = normalizeData({
  journeys: [{ journey_id: "journey-2", started_at: timestampSeconds, status: "active" }],
  crossingsByJourney: { "journey-2": [] },
});

assert.equal(
  normalizedData.journeys[0].started_at,
  "2024-04-28 00:00:00",
  "normalizeData should expose journey.started_at as a formatted string for renderers",
);

assert.equal(
  /\.started_at\.split\(" "\)/.test(journeyIndexSource),
  false,
  "JourneyIndex should not split started_at directly; renderers must tolerate numeric timestamps",
);

assert.equal(
  /\.started_at\.split\(" "\)/.test(experienceSource),
  false,
  "LabyrinthExperience fallback crossings should not split started_at directly",
);

console.log("normalize-api regression checks passed");
