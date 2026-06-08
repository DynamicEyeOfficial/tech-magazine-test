import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { getQaAdminCredentials } from "./qa-credentials.js";

// Screenshot capture for the product-owner/developer master guide.
// It intentionally captures broad route coverage, not only the visual-smoke subset.
// Use SMOKE_BASE_URL to target live staging, or omit it for localhost.
const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const outDir = join(process.cwd(), "screenshots", "master-guide");

const publicRoutes = [
  ["public-home", "/#/"],
  ["public-search", "/#/search"],
  ["public-sections", "/#/sections"],
  ["public-feed", "/#/feed"],
  ["public-it-rooms", "/#/it-rooms"],
  ["public-it-room-detail", "/#/it-rooms/cloud-architecture-room"],
  ["public-mobile", "/#/mobile"],
  ["public-videos", "/#/videos"],
  ["public-video-detail", "/#/video/ai-agents-enterprise-briefing"],
  ["public-podcasts", "/#/podcasts"],
  ["public-podcast-detail", "/#/podcast/ai-agents-production-playbook"],
  ["public-podcast-episode", "/#/podcast-episode/ai-agents-production-playbook"],
  ["public-reviews", "/#/reviews"],
  ["public-review-detail", "/#/review/nova-x1-pro-review"],
  ["public-review-compare", "/#/reviews-compare/nova-x1-pro-review"],
  ["public-live", "/#/live"],
  ["public-live-detail", "/#/live/ai-leadership-forum"],
  ["public-newsletter", "/#/newsletter"],
  ["public-membership", "/#/membership"],
  ["public-community", "/#/community"],
  ["public-leaderboard", "/#/leaderboard"],
  ["public-notifications", "/#/notifications"],
  ["public-account", "/#/account"],
  ["public-article", "/#/article/ai-agents-newsroom-workflows"],
  ["public-category-ai", "/#/category/ai"],
  ["public-author", "/#/author/maya-chen"],
  ["public-events", "/#/events"],
  ["public-event-detail", "/#/event/future-devices-virtual-expo"],
  ["public-jobs", "/#/jobs"],
  ["public-job-detail", "/#/job/ai-platform-engineer-auralink"],
  ["public-startups", "/#/startups"],
  ["public-startup-detail", "/#/startup/auralink-systems"],
  ["public-devices", "/#/devices"],
  ["public-device-detail", "/#/device/quantumedge-c9"],
  ["public-device-compare", "/#/compare/nova-x1-pro"],
  ["public-about", "/#/about"],
  ["public-contact", "/#/contact"],
  ["public-authors", "/#/authors"],
  ["public-trust-center", "/#/trust-center"],
  ["public-advertise", "/#/advertise"],
  ["public-media-kit", "/#/media-kit"],
  ["public-careers", "/#/careers"],
  ["public-editorial", "/#/editorial"],
  ["public-editorial-team", "/#/editorial-team"],
  ["public-ethics", "/#/ethics"],
  ["public-privacy", "/#/privacy"],
  ["public-cookies", "/#/cookies"],
  ["public-terms", "/#/terms"]
];

const adminRoutes = [
  ["admin-dashboard", "/admin"],
  ["admin-articles", "/admin/articles"],
  ["admin-article-new", "/admin/articles/new"],
  ["admin-workflow", "/admin/workflow"],
  ["admin-homepage", "/admin/homepage"],
  ["admin-breaking-news", "/admin/breaking-news"],
  ["admin-live-blogs", "/admin/live-blogs"],
  ["admin-news-imports", "/admin/news-imports"],
  ["admin-news-imports-inspection", "/admin/news-imports/inspection"],
  ["admin-news-imports-performance", "/admin/news-imports/performance"],
  ["admin-videos", "/admin/videos"],
  ["admin-podcasts", "/admin/podcasts"],
  ["admin-reviews", "/admin/reviews"],
  ["admin-devices", "/admin/devices"],
  ["admin-ai-assistant", "/admin/ai-assistant"],
  ["admin-site-cms", "/admin/site-cms"],
  ["admin-monetization", "/admin/monetization"],
  ["admin-ads", "/admin/ads"],
  ["admin-affiliates", "/admin/affiliates"],
  ["admin-memberships", "/admin/memberships"],
  ["admin-events", "/admin/events"],
  ["admin-jobs", "/admin/jobs"],
  ["admin-startups", "/admin/startups"],
  ["admin-directory", "/admin/directory"],
  ["admin-community", "/admin/community"],
  ["admin-it-rooms", "/admin/it-rooms"],
  ["admin-media", "/admin/media"],
  ["admin-comments", "/admin/comments"],
  ["admin-subscribers", "/admin/subscribers"],
  ["admin-newsletter-campaigns", "/admin/newsletter/campaigns"],
  ["admin-notifications", "/admin/notifications"],
  ["admin-email-outbox", "/admin/email-outbox"],
  ["admin-users", "/admin/users"],
  ["admin-roles", "/admin/roles"],
  ["admin-categories", "/admin/categories"],
  ["admin-tags", "/admin/tags"],
  ["admin-audit", "/admin/audit"],
  ["admin-backup", "/admin/backup"],
  ["admin-analytics", "/admin/analytics"],
  ["admin-retention", "/admin/retention"],
  ["admin-seo", "/admin/seo"],
  ["admin-languages", "/admin/languages"],
  ["admin-api", "/admin/api"],
  ["admin-future", "/admin/future"],
  ["admin-infrastructure", "/admin/infrastructure"],
  ["admin-database", "/admin/database"],
  ["admin-launch", "/admin/launch"],
  ["admin-security", "/admin/security"],
  ["admin-operations", "/admin/operations"],
  ["admin-settings", "/admin/settings"]
];

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (!data.id || !this.pending.has(data.id)) return;
      const { resolve, reject } = this.pending.get(data.id);
      this.pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message || "CDP error"));
      else resolve(data.result || {});
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
}

async function waitForChrome(port) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return response.json();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  throw new Error("Chrome did not expose a debugging endpoint.");
}

async function createPage(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
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

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  return result.result?.value;
}

async function navigate(cdp, url) {
  await cdp.send("Page.navigate", { url });
  await new Promise((resolve) => setTimeout(resolve, 1400));
}

async function setViewport(cdp, width, height, mobile = false) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    mobile,
    deviceScaleFactor: mobile ? 2 : 1
  });
}

async function loginReader() {
  const email = `guide-reader-${Date.now()}@example.com`;
  const response = await fetch(`${baseUrl}/api/reader/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Guide Reader", email, password: "password123" })
  });
  const json = await response.json().catch(() => ({}));
  return json.token || "";
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

async function setAdminCookie(cdp, cookie) {
  const [name, value] = cookie.split("=");
  await cdp.send("Network.setCookie", { name, value, url: baseUrl, path: "/" });
}

async function capture(cdp, name, route, options = {}) {
  if (options.mobile) await setViewport(cdp, 390, 844, true);
  else await setViewport(cdp, 1440, 950, false);
  if (options.readerToken) {
    await navigate(cdp, baseUrl);
    await evaluate(cdp, `localStorage.setItem("tm_theme", "dark"); localStorage.setItem("tm_language", "en"); localStorage.setItem("tm_reader_token", ${JSON.stringify(options.readerToken)});`);
  }
  if (options.adminCookie) await setAdminCookie(cdp, options.adminCookie);
  const url = `${baseUrl}${route}`;
  await navigate(cdp, url);
  await evaluate(cdp, `document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, 0);`);
  await new Promise((resolve) => setTimeout(resolve, 450));
  const info = await evaluate(cdp, `(() => {
    const app = document.querySelector("#app") || document.querySelector(".admin-main") || document.body;
    const text = (app.textContent || "").replace(/\\s+/g, " ").trim();
    return { title: document.title, heading: app.querySelector("h1,h2")?.textContent?.trim() || "", length: text.length, url: location.href };
  })()`);
  const shot = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 68, captureBeyondViewport: false });
  const file = join(outDir, `${name}.jpg`);
  await writeFile(file, Buffer.from(shot.data, "base64"));
  console.log(`Captured ${name}`);
  return { name, route, file, info };
}

await mkdir(outDir, { recursive: true });
const userDataDir = await mkdtemp(join(tmpdir(), "tm-guide-shots-"));
const port = 10200 + Math.floor(Math.random() * 500);
const chrome = spawn(chromePath, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check"
], { stdio: "ignore" });

try {
  await waitForChrome(port);
  const cdp = await createPage(port);
  const readerToken = await loginReader();
  const adminCookie = await loginAdminCookie();
  const captures = [];

  captures.push(await capture(cdp, "admin-login-logged-out", "/admin/login"));
  for (const [name, route] of publicRoutes) {
    captures.push(await capture(cdp, name, route, { readerToken }));
  }
  captures.push(await capture(cdp, "public-home-mobile", "/#/", { readerToken, mobile: true }));
  captures.push(await capture(cdp, "public-account-mobile", "/#/account", { readerToken, mobile: true }));
  for (const [name, route] of adminRoutes) {
    captures.push(await capture(cdp, name, route, { adminCookie }));
  }

  await writeFile(join(outDir, "master-guide-screenshot-report.json"), JSON.stringify({ baseUrl, captures }, null, 2));
  console.log(JSON.stringify({ captured: captures.length, outDir }, null, 2));
} finally {
  chrome.kill();
  await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
}
