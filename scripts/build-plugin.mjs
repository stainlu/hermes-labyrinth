import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

async function readFrontendSource() {
  const partsDir = resolve(root, "src/parts");
  const entries = (await readdir(partsDir))
    .filter((name) => name.endsWith(".js"))
    .sort();
  if (entries.length === 0) {
    throw new Error("No frontend source parts found in src/parts");
  }
  const chunks = [];
  for (const entry of entries) {
    chunks.push(await readFile(resolve(partsDir, entry), "utf8"));
  }
  return chunks.join("\n");
}

const files = [
  {
    source: "src/parts/*.js",
    target: "dashboard/dist/index.js",
    read: readFrontendSource,
    banner: "// Generated from src/parts/*.js by scripts/build-plugin.mjs. Do not edit dashboard/dist/index.js directly.\n",
  },
  {
    source: "src/labyrinth.css",
    target: "dashboard/dist/labyrinth.css",
    read: () => readFile(resolve(root, "src/labyrinth.css"), "utf8"),
    banner: "/* Generated from src/labyrinth.css by scripts/build-plugin.mjs. Do not edit dashboard/dist/labyrinth.css directly. */\n",
  },
];

function stripBanner(text) {
  return text
    .replace(/^\/\/ Generated from src\/plugin\.js by scripts\/build-plugin\.mjs\. Do not edit dashboard\/dist\/index\.js directly\.\n/, "")
    .replace(/^\/\/ Generated from src\/parts\/\*\.js by scripts\/build-plugin\.mjs\. Do not edit dashboard\/dist\/index\.js directly\.\n/, "")
    .replace(/^\/\* Generated from src\/labyrinth\.css by scripts\/build-plugin\.mjs\. Do not edit dashboard\/dist\/labyrinth\.css directly\. \*\/\n/, "");
}

let dirty = false;

for (const file of files) {
  const targetPath = resolve(root, file.target);
  const source = await file.read();
  const next = file.banner + stripBanner(source);
  let current = "";
  try {
    current = await readFile(targetPath, "utf8");
  } catch {
    current = "";
  }

  if (current !== next) {
    dirty = true;
    if (checkOnly) {
      console.error(`${file.target} is out of date. Run npm run build.`);
    } else {
      await writeFile(targetPath, next);
      console.log(`built ${file.target}`);
    }
  } else if (!checkOnly) {
    console.log(`up to date ${file.target}`);
  }
}

if (checkOnly && dirty) {
  process.exitCode = 1;
}
