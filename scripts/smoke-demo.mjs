import { createServer } from "node:http";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const argValue = (name) => {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
};

const explicitUrl = argValue("--url");
const screenshotPath = argValue("--screenshot") || "/tmp/hermes-labyrinth-smoke.png";
const verbose = args.has("--verbose");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate;
  }
  throw new Error("Chrome/Chromium not found. Set CHROME_PATH.");
}

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", "http://127.0.0.1");
      if (url.pathname === "/favicon.ico") {
        res.writeHead(204);
        res.end();
        return;
      }
      const decodedPath = decodeURIComponent(url.pathname);
      const relative = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
      const filePath = resolve(root, relative);
      if (filePath !== root && !filePath.startsWith(root + sep)) {
        res.writeHead(403);
        res.end("forbidden");
        return;
      }
      const type = mime[extname(filePath)] || "application/octet-stream";
      res.writeHead(200, {
        "content-type": type,
        "cache-control": "no-store",
      });
      createReadStream(filePath).on("error", () => {
        if (!res.headersSent) res.writeHead(404);
        res.end("not found");
      }).pipe(res);
    } catch (error) {
      res.writeHead(500);
      res.end(String(error && error.stack ? error.stack : error));
    }
  });

  return new Promise((resolveServer, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolveServer({
        url: `http://127.0.0.1:${address.port}/`,
        close: () => new Promise((resolveClose) => server.close(resolveClose)),
      });
    });
  });
}

async function waitFor(fn, label, timeoutMs = 15000, intervalMs = 150) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMs) {
    try {
      const value = await fn();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, intervalMs));
  }
  throw new Error(`Timed out waiting for ${label}${lastError ? `: ${lastError.message}` : ""}`);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

class CDP {
  constructor(wsUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.errors = [];
    this.ws = new WebSocket(wsUrl);
    this.ready = new Promise((resolveReady, rejectReady) => {
      this.ws.addEventListener("open", resolveReady, { once: true });
      this.ws.addEventListener("error", rejectReady, { once: true });
    });
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolveSend, rejectSend } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) rejectSend(new Error(message.error.message || JSON.stringify(message.error)));
        else resolveSend(message.result || {});
        return;
      }
      this.events.push(message);
      if (message.method === "Runtime.exceptionThrown") {
        const details = message.params?.exceptionDetails;
        this.errors.push(details?.text || details?.exception?.description || "Runtime exception");
      }
      if (message.method === "Runtime.consoleAPICalled" && message.params?.type === "error") {
        const argsText = (message.params.args || [])
          .map((arg) => arg.value || arg.description || "")
          .filter(Boolean)
          .join(" ");
        this.errors.push(argsText || "console.error");
      }
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolveSend, rejectSend) => {
      this.pending.set(id, { resolveSend, rejectSend });
      setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        rejectSend(new Error(`CDP timeout: ${method}`));
      }, 10000);
    });
  }

  async eval(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
      timeout: 10000,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result?.value;
  }

  close() {
    this.ws.close();
  }
}

async function launchChrome(url) {
  const chromePath = await findChrome();
  const userDataDir = await mkdtemp(join(tmpdir(), "hermes-labyrinth-smoke-"));
  const remotePort = 9222 + Math.floor(Math.random() * 1000);
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync",
    "--disable-domain-reliability",
    "--metrics-recording-only",
    "--safebrowsing-disable-auto-update",
    `--remote-debugging-port=${remotePort}`,
    `--user-data-dir=${userDataDir}`,
    "--window-size=2048,1210",
    url,
  ], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stderr = "";
  chrome.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
    stderr = stderr.slice(-6000);
    if (verbose) process.stderr.write(chunk);
  });
  chrome.stdout.on("data", (chunk) => {
    if (verbose) process.stdout.write(chunk);
  });

  const version = await waitFor(
    () => fetchJson(`http://127.0.0.1:${remotePort}/json/version`).catch(() => null),
    "Chrome DevTools endpoint",
    12000,
    200,
  );
  const tabs = await fetchJson(`http://127.0.0.1:${remotePort}/json/list`);
  const page = tabs.find((tab) => tab.type === "page") || tabs[0];
  assert(page?.webSocketDebuggerUrl || version.webSocketDebuggerUrl, `No page websocket. Chrome stderr:\n${stderr}`);
  const cdp = new CDP(page.webSocketDebuggerUrl || version.webSocketDebuggerUrl);
  await cdp.send("Runtime.enable");
  await cdp.send("Page.enable");
  await cdp.send("Page.navigate", { url });

  return {
    cdp,
    async close() {
      cdp.close();
      if (!chrome.killed) chrome.kill("SIGTERM");
      await new Promise((resolveClose) => {
        const timeout = setTimeout(resolveClose, 3000);
        chrome.once("exit", () => {
          clearTimeout(timeout);
          resolveClose();
        });
      });
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          await rm(userDataDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
          break;
        } catch (error) {
          if (attempt === 4) {
            if (verbose) console.warn(`warning: could not remove ${userDataDir}: ${error.message}`);
            break;
          }
          await new Promise((resolveWait) => setTimeout(resolveWait, 200));
        }
      }
    },
  };
}

const pageSnapshotExpression = `(() => {
  const body = document.body ? document.body.innerText : "";
  return {
    title: document.title,
    boot: document.querySelector("#boot")?.textContent || "",
    error: document.querySelector("#boot-error")?.textContent || "",
    text: body,
    hasRoot: !!document.querySelector(".hl-root"),
  };
})()`;

const helpers = `
  const norm = (value) => String(value || "").replace(/\\s+/g, " ").trim().toLowerCase();
  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  };
  const clickButtonText = (text) => {
    const needle = norm(text);
    const button = Array.from(document.querySelectorAll("button"))
      .find((el) => visible(el) && norm(el.textContent).includes(needle));
    if (!button) throw new Error("button not found: " + text);
    button.click();
    return true;
  };
  const clickNav = (title) => {
    const button = Array.from(document.querySelectorAll("button[title]"))
      .find((el) => visible(el) && el.getAttribute("title") === title && el.getBoundingClientRect().width <= 50);
    if (!button) throw new Error("nav button not found: " + title);
    button.click();
    return true;
  };
  const setSearch = (value) => {
    const input = document.querySelector("input[placeholder^='search']");
    if (!input) throw new Error("search input not found");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  };
  const clickThresholds = () => {
    const input = document.querySelector("input[type='checkbox']");
    if (!input) throw new Error("threshold checkbox not found");
    input.click();
    return input.checked;
  };
`;

async function pageState(cdp) {
  return cdp.eval(pageSnapshotExpression);
}

async function assertText(cdp, expected, label = expected) {
  const expectedText = expected.toLowerCase();
  const state = await waitFor(async () => {
    const snapshot = await pageState(cdp);
    if (snapshot.error) throw new Error(snapshot.error);
    return snapshot.text.toLowerCase().includes(expectedText) ? snapshot : null;
  }, label);
  return state;
}

async function clickAndExpect(cdp, actionExpression, expected, label = expected) {
  await cdp.eval(`(() => { ${helpers} ${actionExpression}; })()`);
  return assertText(cdp, expected, label);
}

async function runSmoke(cdp) {
  let lastMountState = null;
  try {
    await waitFor(async () => {
      const state = await pageState(cdp);
      lastMountState = {
        title: state.title,
        boot: state.boot,
        error: state.error,
        hasRoot: state.hasRoot,
        textStart: state.text.slice(0, 240),
      };
      if (state.error) throw new Error(state.error);
      return !state.boot && state.hasRoot && state.text.toLowerCase().includes("journey index") ? state : null;
    }, "Labyrinth app mount", 20000);
  } catch (error) {
    throw new Error(`${error.message}\nLast page state: ${JSON.stringify(lastMountState, null, 2)}`);
  }

  let state = await pageState(cdp);
  assert(!state.text.includes("New journey"), "dead New journey affordance returned");
  assert(state.text.toLowerCase().includes("refactor billing reconciliation"), "default journey did not render");
  assert(state.text.toLowerCase().includes("run_python"), "default crossing inspector did not render");

  await clickAndExpect(cdp, `clickButtonText("Corridor")`, "Refactor billing reconciliation", "corridor map mode");
  await clickAndExpect(cdp, `clickButtonText("Flight strip")`, "THRESHOLD", "flight strip map mode");
  await clickAndExpect(cdp, `clickButtonText("Thread")`, "User prompt", "thread map mode");
  await clickAndExpect(cdp, `clickThresholds()`, "Refactor billing reconciliation", "thresholds-only filter");
  await clickAndExpect(cdp, `clickThresholds()`, "Refactor billing reconciliation", "thresholds-only reset");

  await clickAndExpect(cdp, `setSearch("Telegram")`, "Daily ops digest", "journey search");
  await cdp.eval(`(() => { ${helpers} setSearch(""); })()`);
  await clickAndExpect(cdp, `clickButtonText("Clean")`, "Daily ops digest", "clean dataset");
  await clickAndExpect(cdp, `clickButtonText("Debug")`, "Refactor billing reconciliation", "debug dataset");

  await clickAndExpect(cdp, `clickNav("Skills")`, "Skill Atlas", "skills route");
  await clickAndExpect(cdp, `clickNav("Cron")`, "Cron Gate", "cron route");
  await clickAndExpect(cdp, `clickNav("Ferry")`, "Model Ferry", "ferry route");
  await clickAndExpect(cdp, `clickNav("Memory")`, "Memory & Context", "memory route");
  await clickAndExpect(cdp, `clickNav("Report")`, "Labyrinth Report", "report route");
  await clickAndExpect(cdp, `clickNav("Guideposts")`, "What deserves your attention", "guideposts route");
  await clickAndExpect(cdp, `clickNav("Labyrinth")`, "Journey Index", "labyrinth route");

  state = await pageState(cdp);
  assert(!state.error, state.error);
  assert(cdp.errors.length === 0, `browser errors:\n${cdp.errors.join("\n")}`);
}

let server;
let browser;
try {
  server = explicitUrl ? null : await startServer();
  const url = explicitUrl || server.url;
  browser = await launchChrome(url);
  await runSmoke(browser.cdp);
  const screenshot = await browser.cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  if (screenshot.data) {
    await writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));
  }
  console.log(`smoke passed: ${url}`);
  console.log(`screenshot: ${screenshotPath}`);
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}
