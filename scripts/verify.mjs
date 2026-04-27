import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const checks = [
  ["node", ["scripts/test-normalize-api.mjs"]],
  ["node", ["scripts/build-plugin.mjs", "--check"]],
  ["node", ["--check", "dashboard/dist/index.js"]],
  ["python3", ["-m", "py_compile", "dashboard/plugin_api.py"]],
  ["python3", ["-m", "html.parser", "index.html"]],
  ["python3", ["-m", "html.parser", "Hermes Labyrinth _standalone_.html"]],
];

for (const [cmd, args] of checks) {
  const label = [cmd, ...args].join(" ");
  const result = spawnSync(cmd, args, { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`failed: ${label}`);
    process.exit(result.status ?? 1);
  }
}

for (const file of ["dashboard/dist/index.js", "index.html", "Hermes Labyrinth _standalone_.html"]) {
  const content = readFileSync(file, "utf8");
  if (/New journey|new journey/.test(content)) {
    console.error(`dead New journey affordance found in ${file}`);
    process.exit(1);
  }
}

const indexHtml = readFileSync("index.html", "utf8");
if (/__bundler\/template|__bundler\/manifest|Error unpacking/.test(indexHtml)) {
  console.error("packed artifact wrapper found in index.html; use the static demo harness");
  process.exit(1);
}
if (/__HERMES_ASSET_VERSION__/.test(indexHtml)) {
  console.error("unstamped asset version placeholder found in index.html");
  process.exit(1);
}
if (!/dashboard\/dist\/labyrinth\.css\?v=[0-9a-f]{12}/.test(indexHtml)) {
  console.error("index.html must cache-bust dashboard/dist/labyrinth.css");
  process.exit(1);
}
if (!/dashboard\/dist\/index\.js\?v=[0-9a-f]{12}/.test(indexHtml)) {
  console.error("index.html must cache-bust dashboard/dist/index.js");
  process.exit(1);
}

console.log("all checks passed");
