import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { cleanupQaData } from "./qa-cleanup.js";
import { getQaAdminCredentials } from "./qa-credentials.js";

const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const outDir = join(process.cwd(), "screenshots", "qa-full");
const checks = [];
const consoleProblems = [];
const pageErrors = [];
const badNetworkResponses = [];

const publicRoutes = [
  ["home", "/#/"],
  ["search", "/#/search"],
  ["sections", "/#/sections"],
  ["mobile", "/#/mobile"],
  ["video", "/#/video"],
  ["podcasts", "/#/podcasts"],
  ["reviews", "/#/reviews"],
  ["review-detail", "/#/review/nova-x1-pro-review"],
  ["review-compare", "/#/reviews-compare/nova-x1-pro-review"],
  ["live", "/#/live"],
  ["newsletter", "/#/newsletter"],
  ["membership", "/#/membership"],
  ["community", "/#/community"],
  ["leaderboard", "/#/leaderboard"],
  ["alerts", "/#/alerts"],
  ["profile", "/#/account"],
  ["article", "/#/article/ai-agents-newsroom-workflows"],
  ["category-ai", "/#/category/ai"],
  ["author", "/#/author/maya-chen"],
  ["events", "/#/events"],
  ["event-detail", "/#/event/future-devices-virtual-expo"],
  ["jobs", "/#/jobs"],
  ["job-detail", "/#/job/ai-platform-engineer-auralink"],
  ["startups", "/#/startups"],
  ["devices", "/#/devices"],
  ["device-detail", "/#/device/quantumedge-c9"],
  ["device-compare", "/#/compare/nova-x1-pro"],
  ["about", "/#/about"],
  ["contact", "/#/contact"],
  ["authors", "/#/authors"],
  ["trust-center", "/#/trust-center"],
  ["advertise", "/#/advertise"],
  ["media-kit", "/#/media-kit"],
  ["careers", "/#/careers"],
  ["editorial", "/#/editorial"],
  ["editorial-team", "/#/editorial-team"],
  ["ethics", "/#/ethics"],
  ["privacy", "/#/privacy"],
  ["cookies", "/#/cookies"],
  ["terms", "/#/terms"]
];

const adminRoutes = [
  "/admin",
  "/admin/articles",
  "/admin/articles/new",
  "/admin/workflow",
  "/admin/homepage",
  "/admin/breaking-news",
  "/admin/live-blogs",
  "/admin/videos",
  "/admin/podcasts",
  "/admin/reviews",
  "/admin/devices",
  "/admin/ai-assistant",
  "/admin/site-cms",
  "/admin/monetization",
  "/admin/ads",
  "/admin/affiliates",
  "/admin/memberships",
  "/admin/events",
  "/admin/jobs",
  "/admin/startups",
  "/admin/directory",
  "/admin/community",
  "/admin/media",
  "/admin/comments",
  "/admin/subscribers",
  "/admin/newsletter/campaigns",
  "/admin/notifications",
  "/admin/email-outbox",
  "/admin/users",
  "/admin/roles",
  "/admin/categories",
  "/admin/tags",
  "/admin/audit",
  "/admin/backup",
  "/admin/analytics",
  "/admin/retention",
  "/admin/seo",
  "/admin/languages",
  "/admin/api",
  "/admin/future",
  "/admin/infrastructure",
  "/admin/database",
  "/admin/launch",
  "/admin/security",
  "/admin/operations",
  "/admin/settings"
];

function record(name, ok, detail = "") {
  checks.push({ name, ok: Boolean(ok), detail });
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.id && this.pending.has(data.id)) {
        const { resolve, reject } = this.pending.get(data.id);
        this.pending.delete(data.id);
        if (data.error) reject(new Error(data.error.message || "CDP error"));
        else resolve(data.result || {});
        return;
      }
      const listeners = this.events.get(data.method) || [];
      for (const listener of listeners) listener(data.params || {});
    };
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        reject(new Error(`Timed out: ${method}`));
      }, 15000);
    });
  }

  once(event) {
    return new Promise((resolve) => {
      const listener = (params) => {
        this.events.set(event, (this.events.get(event) || []).filter((item) => item !== listener));
        resolve(params);
      };
      this.events.set(event, [...(this.events.get(event) || []), listener]);
    });
  }

  on(event, listener) {
    this.events.set(event, [...(this.events.get(event) || []), listener]);
  }
}

async function waitForChrome(port) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return response.json();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  }
  throw new Error("Chrome did not expose a debugging endpoint.");
}

async function createPage(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (!response.ok) throw new Error(`Could not create Chrome tab: ${response.status}`);
  const target = await response.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  const cdp = new Cdp(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");
  await cdp.send("Log.enable").catch(() => {});
  cdp.on("Runtime.exceptionThrown", (event) => {
    pageErrors.push(event.exceptionDetails?.text || "Runtime exception");
  });
  cdp.on("Log.entryAdded", (event) => {
    if (["error", "warning"].includes(event.entry?.level)) {
      const text = event.entry?.text || "";
      if (!/Failed to load resource/i.test(text) && !/favicon|manifest/i.test(text)) consoleProblems.push(text);
    }
  });
  cdp.on("Network.responseReceived", (event) => {
    const status = Number(event.response?.status || 0);
    const url = event.response?.url || "";
    if (status >= 400 && !/favicon\.ico|manifest/i.test(url)) {
      badNetworkResponses.push(`${status} ${url}`);
    }
  });
  return cdp;
}

async function navigate(cdp, url) {
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url });
  await Promise.race([
    loaded.catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 3500))
  ]);
  await new Promise((resolve) => setTimeout(resolve, 650));
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  return result.result?.value;
}

async function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, { redirect: "manual", ...options });
}

async function loginReader() {
  const email = `full-qa-reader-${Date.now()}@example.com`;
  const response = await request("/api/reader/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Full QA Reader", email, password: "password123" })
  });
  const json = await response.json().catch(() => ({}));
  return json.token || "";
}

async function loginAdminCookie() {
  const credentials = getQaAdminCredentials();
  const response = await request("/admin/login", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email: credentials.email, password: credentials.password })
  });
  return response.headers.get("set-cookie")?.split(";")[0] || "";
}

async function setAdminCookie(cdp, cookie) {
  const [name, value] = cookie.split("=");
  await cdp.send("Network.setCookie", { name, value, url: baseUrl, path: "/" });
}

async function setClientState(cdp, token, theme = "light") {
  await navigate(cdp, baseUrl);
  await evaluate(cdp, `localStorage.setItem("tm_theme", ${JSON.stringify(theme)}); localStorage.setItem("tm_reader_token", ${JSON.stringify(token)}); localStorage.setItem("tm_language", "en");`);
}

async function inspect(cdp, label, url, { admin = false } = {}) {
  console.log(`QA ${label}`);
  await navigate(cdp, url);
  const data = await evaluate(cdp, `(() => {
    const root = document.querySelector("#app") || document.querySelector(".admin-main") || document.body;
    const controls = [...document.querySelectorAll("button, a, input, textarea, select")];
    const buttonName = (button) => [
      button.textContent,
      button.getAttribute("aria-label"),
      button.getAttribute("title")
    ].map((value) => (value || "").trim()).find(Boolean) || "";
    const namedButtons = [...document.querySelectorAll("button")].filter((button) => {
      const name = buttonName(button);
      return name.length > 0 || button.querySelector("svg,img");
    });
    const badButtons = [...document.querySelectorAll("button")].filter((button) => {
      const name = buttonName(button);
      return !name && !button.querySelector("svg,img");
    }).map((button) => button.outerHTML.slice(0, 160));
    const forms = [...document.querySelectorAll("form")].map((form) => ({
      method: (form.getAttribute("method") || "get").toLowerCase(),
      action: form.getAttribute("action") || "",
      hasCsrf: Boolean(form.querySelector('input[name="_csrf"]')),
      submitCount: form.querySelectorAll('button[type="submit"], button:not([type]), input[type="submit"]').length
    }));
    const inputsWithoutContext = [...document.querySelectorAll("input:not([type='hidden']), textarea, select")].filter((input) => {
      const id = input.id;
      const labelled = id && document.querySelector('label[for="' + CSS.escape(id) + '"]');
      const wrapped = input.closest("label");
      const aria = input.getAttribute("aria-label") || input.getAttribute("aria-labelledby");
      const placeholder = input.getAttribute("placeholder");
      const name = input.getAttribute("name");
      return !labelled && !wrapped && !aria && !placeholder && !name;
    }).map((input) => input.outerHTML.slice(0, 160));
    const badOverflow = [...document.querySelectorAll("body *")]
      .filter((el) => !el.closest(".live-ticker, .hero-slider, .hero-dots"))
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { text: (el.textContent || "").trim().slice(0, 70), cls: el.className, tag: el.tagName, left: r.left, right: r.right, width: r.width, height: r.height };
      })
      .filter((item) => item.width > 1 && item.height > 1 && item.right > window.innerWidth + 3 && item.left < window.innerWidth)
      .slice(0, 8);
    const visibleText = (root.textContent || "").replace(/\\s+/g, " ").trim();
    const links = [...document.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter(Boolean)
      .filter((href) => href.startsWith("/") || href.startsWith("#/"))
      .slice(0, 80);
    return {
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      textLength: visibleText.length,
      controls: controls.length,
      buttonCount: document.querySelectorAll("button").length,
      namedButtons: namedButtons.length,
      badButtons,
      forms,
      inputsWithoutContext,
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      badOverflow,
      postFormsMissingCsrf: forms.filter((form) => form.method === "post" && !form.hasCsrf && !form.action.includes("/admin/login") && !form.action.includes("/admin/forgot") && !form.action.includes("/admin/reset")).length,
      links
    };
  })()`);
  record(`${label} renders content`, data.textLength > 80 || data.h1.length > 0, data.h1 || data.title);
  record(`${label} has controls`, data.controls > 0, `${data.controls} controls`);
  record(`${label} buttons have names`, data.badButtons.length === 0, data.badButtons.join(" | "));
  record(`${label} inputs have context`, data.inputsWithoutContext.length === 0, data.inputsWithoutContext.join(" | "));
  record(`${label} no horizontal overflow`, data.scrollWidth <= data.viewport + 3, `${data.scrollWidth}/${data.viewport}`);
  record(`${label} no visible clipped overflow`, data.badOverflow.length === 0, data.badOverflow.map((item) => item.text || item.cls || item.tag).join(" | "));
  if (admin) {
    record(`${label} admin post forms include CSRF`, data.postFormsMissingCsrf === 0, `${data.postFormsMissingCsrf} missing`);
  }
  return data;
}

function normalizeInternalLink(href) {
  if (!href || href === "#" || href.startsWith("javascript:")) return "";
  if (href.startsWith("#/")) return `/${href}`;
  if (href.startsWith("/")) return href;
  return "";
}

async function setViewport(cdp, metrics, label) {
  try {
    await cdp.send("Emulation.setDeviceMetricsOverride", metrics);
    return true;
  } catch (error) {
    await cdp.send("Emulation.clearDeviceMetricsOverride").catch(() => {});
    try {
      await cdp.send("Emulation.setDeviceMetricsOverride", metrics);
      return true;
    } catch (retryError) {
      record(`${label} viewport can be applied`, false, retryError.message || error.message || "CDP viewport error");
      return false;
    }
  }
}

await mkdir(outDir, { recursive: true });
const userDataDir = await mkdtemp(join(tmpdir(), "tm-full-qa-"));
const port = 9600 + Math.floor(Math.random() * 500);
const chrome = spawn(chromePath, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--window-size=1440,950",
  "about:blank"
], { stdio: "ignore" });

try {
  await waitForChrome(port);
  const cdp = await createPage(port);
  const token = await loginReader();
  const cookie = await loginAdminCookie();
  record("reader login token available", Boolean(token));
  record("admin session cookie available", Boolean(cookie));

  await setViewport(cdp, { width: 1440, height: 950, deviceScaleFactor: 1, mobile: false }, "desktop");
  await setClientState(cdp, token, "light");
  const allLinks = new Set();
  for (const [name, route] of publicRoutes) {
    const data = await inspect(cdp, `client ${name}`, `${baseUrl}${route}`);
    data.links.map(normalizeInternalLink).filter(Boolean).forEach((link) => allLinks.add(link));
  }

  await setViewport(cdp, { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, "mobile");
  await inspect(cdp, "client mobile home", `${baseUrl}/#/`);
  await inspect(cdp, "client mobile profile", `${baseUrl}/#/account`);

  await setViewport(cdp, { width: 1440, height: 950, deviceScaleFactor: 1, mobile: false }, "admin desktop");
  await setAdminCookie(cdp, cookie);
  for (const route of adminRoutes) {
    const data = await inspect(cdp, `admin ${route}`, `${baseUrl}${route}`, { admin: true });
    data.links.map(normalizeInternalLink).filter(Boolean).forEach((link) => allLinks.add(link));
  }

  const internalLinks = [...allLinks]
    .filter((link) => !link.startsWith("/admin/logout"))
    .filter((link) => !link.includes("mailto:"))
    .slice(0, 180);
  for (const link of internalLinks) {
    const response = await request(link.startsWith("/#/") ? "/" : link, {
      headers: link.startsWith("/admin") ? { cookie } : {}
    });
    record(`internal link ${link}`, response.status >= 200 && response.status < 400, String(response.status));
  }

  const uniqueConsole = [...new Set(consoleProblems)].slice(0, 8);
  const uniqueErrors = [...new Set(pageErrors)].slice(0, 8);
  const uniqueNetwork = [...new Set(badNetworkResponses)].slice(0, 12);
  record("no browser console errors", uniqueConsole.length === 0, uniqueConsole.join(" | "));
  record("no browser runtime exceptions", uniqueErrors.length === 0, uniqueErrors.join(" | "));
  record("no failing browser network resources", uniqueNetwork.length === 0, uniqueNetwork.join(" | "));

  const failed = checks.filter((check) => !check.ok);
  cleanupQaData({ log: false });
  const report = { checks, failed };
  await writeFile(join(outDir, "full-ui-qa-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: checks.length - failed.length, total: checks.length, failed }, null, 2));
  if (failed.length) process.exitCode = 1;
} finally {
  chrome.kill();
  await new Promise((resolve) => setTimeout(resolve, 500));
  await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
}
