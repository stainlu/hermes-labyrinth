import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/parts/70-normalize-api.js", "utf8");
const journeyIndexSource = readFileSync("src/parts/50-surfaces.js", "utf8");
const experienceSource = readFileSync("src/parts/60-experience-chrome.js", "utf8");
const loadApiHelpers = new Function(
  "SAMPLE_DATA",
  "SDK",
  "API",
  `${source}
return { normalizeJourney, normalizeData, clock };`
);

const { normalizeJourney, normalizeData, clock } = loadApiHelpers(
  { journeys: [], debugCrossings: [], cleanCrossings: [], guideposts: [], skills: [], cron: [] },
  {},
  "/api/plugins/hermes-labyrinth"
);

const timestampSeconds = 1714262400;
const normalizedJourney = normalizeJourney(
  {
    journey_id: "journey-1",
    started_at: timestampSeconds,
    duration_ms: 1500,
  },
  []
);

assert.equal(
  normalizedJourney.started_at,
  "2024-04-28 00:00:00",
  "normalizeJourney should format numeric started_at timestamps into the display string used by the UI"
);
assert.equal(
  clock(normalizedJourney.started_at),
  "00:00:00",
  "formatted journey timestamps should remain compatible with UI clock extraction"
);

const normalizedData = normalizeData({
  journeys: [{ journey_id: "journey-2", started_at: timestampSeconds, status: "active" }],
  crossingsByJourney: { "journey-2": [] },
});

assert.equal(
  normalizedData.journeys[0].started_at,
  "2024-04-28 00:00:00",
  "normalizeData should expose journey.started_at as a formatted string for renderers"
);

assert.equal(
  /\.started_at\.split\(" "\)/.test(journeyIndexSource),
  false,
  "JourneyIndex should not split started_at directly; renderers must tolerate numeric timestamps too"
);

assert.equal(
  /\.started_at\.split\(" "\)/.test(experienceSource),
  false,
  "LabyrinthExperience fallback crossings should not split started_at directly; they should use clock()"
);

console.log("normalize-api regression checks passed");
