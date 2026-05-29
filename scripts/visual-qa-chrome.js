import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { getQaAdminCredentials, hasKnownCredentialLeak, hasSecretTokenLeak } from "./qa-credentials.js";

const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const outDir = join(process.cwd(), "screenshots", "qa-final");
const checks = [];

function check(name, ok, detail = "") {
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
  return cdp;
}

async function navigate(cdp, url) {
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url });
  await Promise.race([
    loaded.catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 3500))
  ]);
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  return result.result?.value;
}

async function screenshot(cdp, name) {
  const shot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const path = join(outDir, `${name}.png`);
  await writeFile(path, Buffer.from(shot.data, "base64"));
  return path;
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  try {
    return { response, json: JSON.parse(text), text };
  } catch {
    return { response, json: null, text };
  }
}

async function loginReader() {
  const email = `visual-reader-${Date.now()}@example.com`;
  const { json } = await requestJson("/api/reader/register", {
    method: "POST",
    body: JSON.stringify({ name: "Visual QA Reader", email, password: "password123" })
  });
  return json?.token || "";
}

async function loginAdminCookie() {
  const credentials = getQaAdminCredentials();
  const response = await fetch(`${baseUrl}/admin/login`, {
    method: "POST",
    redirect: "manual",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email: credentials.email, password: credentials.password })
  });
  return response.headers.get("set-cookie")?.split(";")[0] || "";
}

async function inspectPage(cdp, name, url, { theme = "dark", token = "", adminCookie = "" } = {}) {
  console.log(`Inspecting ${name}`);
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 950, deviceScaleFactor: 1, mobile: false });
  if (adminCookie) {
    const [cookieName, cookieValue] = adminCookie.split("=");
    await cdp.send("Network.setCookie", { name: cookieName, value: cookieValue, url: baseUrl, path: "/" });
  }
  await navigate(cdp, baseUrl);
  await evaluate(cdp, `localStorage.setItem("tm_theme", ${JSON.stringify(theme)});${token ? `localStorage.setItem("tm_reader_token", ${JSON.stringify(token)});` : ""}`);
  if (!adminCookie) await navigate(cdp, "about:blank");
  await navigate(cdp, url);
  let ready = false;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    ready = await evaluate(cdp, `(() => {
      const app = document.querySelector("#app") || document.querySelector(".admin-main");
      return Boolean(app && ((app.textContent || "").trim().length > 80 || app.querySelector("h1, h2, form, article, table")));
    })()`);
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  if (!ready) {
    await navigate(cdp, url);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const info = await evaluate(cdp, `(() => {
    const app = document.querySelector("#app") || document.querySelector(".admin-main") || document.body;
    const rect = app.getBoundingClientRect();
    const all = [...document.querySelectorAll("body *")];
    const bad = all
      .filter((el) => !el.closest(".live-ticker, .hero-slider, .hero-dots"))
      .map((el) => {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return { tag: el.tagName, cls: el.className, text: (el.textContent || "").trim().slice(0, 80), left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height, display: style.display, overflow: style.overflow };
      })
      .filter((item) => item.width > 1 && item.height > 1 && item.right > window.innerWidth + 3 && item.left < window.innerWidth)
      .slice(0, 10);
    const inputs = [...document.querySelectorAll("input, textarea, select")].map((el) => {
      const style = getComputedStyle(el);
      return { name: el.name || el.type, color: style.color, background: style.backgroundColor, value: el.value ? "filled" : "" };
    }).slice(0, 16);
    return {
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      text: app.textContent.slice(0, 500),
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 3,
      appTop: rect.top,
      appHeight: rect.height,
      bad,
      inputs,
      accountHero: Boolean(document.querySelector(".account-hero")),
      profileSummary: Boolean(document.querySelector(".profile-summary")),
      adminSidebar: Boolean(document.querySelector(".admin-sidebar")),
      postFormsMissingCsrf: [...document.querySelectorAll('form[method="post"]')].filter((form) => !form.querySelector('input[name="_csrf"]')).length
    };
  })()`);
  const image = await screenshot(cdp, name);
  check(`${name} loads`, Boolean(info.h1 || info.text), info.h1 || info.title);
  check(`${name} no horizontal overflow`, !info.horizontalOverflow, `${info.scrollWidth}/${info.viewport}`);
  check(`${name} no obvious offscreen elements`, info.bad.length === 0, info.bad.map((item) => item.text || item.cls || item.tag).join(" | "));
  return { name, image, info };
}

await mkdir(outDir, { recursive: true });
const userDataDir = await mkdtemp(join(tmpdir(), "tm-chrome-qa-"));
const port = 9333 + Math.floor(Math.random() * 500);
const chrome = spawn(chromePath, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "--window-size=1440,950",
  "about:blank"
], { stdio: "ignore" });

try {
  await waitForChrome(port);
  const cdp = await createPage(port);
  const readerToken = await loginReader();
  const adminCookie = await loginAdminCookie();
  check("reader token created", Boolean(readerToken));
  check("admin cookie created", Boolean(adminCookie));

  const pages = [];
  const adminLogin = await inspectPage(cdp, "admin-login-logged-out", `${baseUrl}/admin/login`, { theme: "dark" });
  pages.push(adminLogin);
  check("admin login visual exposes no test credentials", !hasKnownCredentialLeak(adminLogin.info.text));
  check("admin login visual exposes no secret tokens", !hasSecretTokenLeak(adminLogin.info.text));
  pages.push(await inspectPage(cdp, "client-home-desktop", `${baseUrl}/#/`, { theme: "dark" }));
  pages.push(await inspectPage(cdp, "client-account-light", `${baseUrl}/#/account`, { theme: "light", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-article-desktop", `${baseUrl}/#/article/ai-agents-newsroom-workflows`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-search-light", `${baseUrl}/#/search?query=ai&type=all`, { theme: "light", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-live-desktop", `${baseUrl}/#/live`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-events-desktop", `${baseUrl}/#/events`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-event-detail-desktop", `${baseUrl}/#/event/future-devices-virtual-expo`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-jobs-desktop", `${baseUrl}/#/jobs`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-job-detail-desktop", `${baseUrl}/#/job/ai-platform-engineer-auralink`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-community-desktop", `${baseUrl}/#/community`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-newsletter-desktop", `${baseUrl}/#/newsletter`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-reviews-desktop", `${baseUrl}/#/reviews`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-review-detail-desktop", `${baseUrl}/#/review/nova-x1-pro-review`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-review-compare-desktop", `${baseUrl}/#/reviews-compare/nova-x1-pro-review`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-devices-desktop", `${baseUrl}/#/devices`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-device-detail-desktop", `${baseUrl}/#/device/quantumedge-c9`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-device-compare-desktop", `${baseUrl}/#/compare/nova-x1-pro`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-membership-desktop", `${baseUrl}/#/membership`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-advertise-desktop", `${baseUrl}/#/advertise`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-leaderboard-desktop", `${baseUrl}/#/leaderboard`, { theme: "light", token: readerToken }));
  pages.push(await inspectPage(cdp, "admin-dashboard", `${baseUrl}/admin`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-roles", `${baseUrl}/admin/roles`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-community", `${baseUrl}/admin/community`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-newsletter-campaigns", `${baseUrl}/admin/newsletter/campaigns`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-analytics", `${baseUrl}/admin/analytics`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-reviews", `${baseUrl}/admin/reviews`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-devices", `${baseUrl}/admin/devices`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-events", `${baseUrl}/admin/events`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-jobs", `${baseUrl}/admin/jobs`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-monetization", `${baseUrl}/admin/monetization`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-operations", `${baseUrl}/admin/operations`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-security", `${baseUrl}/admin/security`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-api", `${baseUrl}/admin/api`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-languages", `${baseUrl}/admin/languages`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-future", `${baseUrl}/admin/future`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-infrastructure", `${baseUrl}/admin/infrastructure`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-affiliates", `${baseUrl}/admin/affiliates`, { adminCookie }));
  pages.push(await inspectPage(cdp, "admin-memberships", `${baseUrl}/admin/memberships`, { adminCookie }));

  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  pages.push(await inspectPage(cdp, "client-home-mobile", `${baseUrl}/#/`, { theme: "dark", token: readerToken }));
  pages.push(await inspectPage(cdp, "client-account-mobile", `${baseUrl}/#/account`, { theme: "light", token: readerToken }));

  const failed = checks.filter((item) => !item.ok);
  const report = { checks, failed, pages: pages.map((page) => ({ name: page.name, image: page.image, info: page.info })) };
  await writeFile(join(outDir, "visual-qa-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    passed: checks.length - failed.length,
    total: checks.length,
    failed,
    screenshots: pages.map((page) => page.image)
  }, null, 2));
  if (failed.length) process.exitCode = 1;
} finally {
  chrome.kill();
  await new Promise((resolve) => setTimeout(resolve, 500));
  await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
}
