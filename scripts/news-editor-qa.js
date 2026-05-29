import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { getQaAdminCredentials } from "./qa-credentials.js";

const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const checks = [];
const badNetwork = [];
const runtimeErrors = [];

function record(name, ok, detail = "") {
  checks.push({ name, ok: Boolean(ok), detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` - ${detail}` : ""}`);
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
        data.error ? reject(new Error(data.error.message || "CDP error")) : resolve(data.result || {});
        return;
      }
      for (const listener of this.events.get(data.method) || []) listener(data.params || {});
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
  throw new Error("Chrome did not start.");
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
  cdp.on("Network.responseReceived", (event) => {
    const status = Number(event.response?.status || 0);
    const url = event.response?.url || "";
    if (status >= 400 && !/favicon|manifest/i.test(url)) badNetwork.push(`${status} ${url}`);
  });
  cdp.on("Runtime.exceptionThrown", (event) => runtimeErrors.push(event.exceptionDetails?.text || "Runtime exception"));
  return cdp;
}

async function navigate(cdp, url) {
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url });
  await Promise.race([loaded.catch(() => {}), new Promise((resolve) => setTimeout(resolve, 3500))]);
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  return result.result?.value;
}

async function waitForArticleResult(cdp, article) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const result = await evaluate(cdp, `(() => {
      const text = document.body.textContent || "";
      const bad = [...document.querySelectorAll("body *")]
        .filter((el) => !el.closest(".live-ticker, .hero-slider, .hero-dots"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { text: (el.textContent || "").trim().slice(0, 80), right: r.right, left: r.left, width: r.width, height: r.height };
        })
        .filter((item) => item.width > 1 && item.height > 1 && item.right > window.innerWidth + 3 && item.left < window.innerWidth)
        .slice(0, 5);
      return {
        title: document.title,
        h1: document.querySelector("h1")?.textContent?.trim() || "",
        hasArticle: text.includes(${JSON.stringify(article.title)}),
        hasShare: Boolean(document.querySelector("[data-share]")),
        hasBookmark: Boolean(document.querySelector("[data-bookmark]")),
        hasComments: Boolean(document.querySelector("[data-comment-form]")),
        hasProgress: Boolean(document.querySelector(".reading-progress")),
        overflow: document.documentElement.scrollWidth > window.innerWidth + 3,
        bad
      };
    })()`);
    if (result.h1 === article.title || result.hasArticle) return result;
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
  return evaluate(cdp, `(() => {
    const text = document.body.textContent || "";
    return {
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      hasArticle: text.includes(${JSON.stringify(article.title)}),
      hasShare: Boolean(document.querySelector("[data-share]")),
      hasBookmark: Boolean(document.querySelector("[data-bookmark]")),
      hasComments: Boolean(document.querySelector("[data-comment-form]")),
      hasProgress: Boolean(document.querySelector(".reading-progress")),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 3,
      bad: []
    };
  })()`);
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

async function setCookie(cdp, cookie) {
  const [name, value] = cookie.split("=");
  await cdp.send("Network.setCookie", { name, value, url: baseUrl, path: "/" });
}

const userDataDir = await mkdtemp(join(tmpdir(), "tm-news-editor-qa-"));
const port = 9700 + Math.floor(Math.random() * 500);
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
  const bootstrap = await fetch(`${baseUrl}/api/bootstrap`).then((response) => response.json());
  const articles = bootstrap.articles || [];
  record("news inventory loaded", articles.length >= 10, `${articles.length} articles`);

  await navigate(cdp, `${baseUrl}/?newsQa=${Date.now()}#/`);
  for (const article of articles) {
    await evaluate(cdp, `(() => {
      const nextHash = ${JSON.stringify(`#/article/${article.slug}`)};
      location.hash = nextHash;
      window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: location.href, newURL: location.origin + location.pathname + nextHash }));
    })()`);
    await new Promise((resolve) => setTimeout(resolve, 250));
    let result = await waitForArticleResult(cdp, article);
    if (!(result.hasArticle && result.h1 === article.title)) {
      await navigate(cdp, `${baseUrl}/?newsQa=${Date.now()}#/article/${article.slug}`);
      result = await waitForArticleResult(cdp, article);
    }
    record(`article renders: ${article.slug}`, result.hasArticle && result.h1 === article.title, result.h1);
    record(`article tools present: ${article.slug}`, result.hasShare && result.hasBookmark && result.hasComments);
    record(`article layout clean: ${article.slug}`, !result.overflow && result.bad.length === 0, result.bad.map((item) => item.text).join(" | "));
  }

  const cookie = await loginAdminCookie();
  record("admin session for editor QA", Boolean(cookie));
  await setCookie(cdp, cookie);
  await navigate(cdp, `${baseUrl}/admin/articles/new`);
  const editor = await evaluate(cdp, `(() => {
    const title = document.querySelector("[data-title-field]");
    const subtitle = document.querySelector("[data-subtitle-field]");
    const body = document.querySelector("[data-editor-body]");
    title.value = "Editor QA Newsroom Workflow Test";
    subtitle.value = "This editor test verifies live metrics, SEO helpers, slug generation, preview rendering, and reading-time tools.";
    body.value = Array(70).fill("This newsroom editor sentence verifies the editor experience and visual article preview.").join(" ");
    [title, subtitle, body].forEach((el) => el.dispatchEvent(new Event("input", { bubbles: true })));
    document.querySelector("[data-generate-slug]")?.click();
    document.querySelector("[data-estimate-reading]")?.click();
    document.querySelector("[data-fill-seo]")?.click();
    document.querySelector("[data-editor-table]")?.click();
    document.querySelector("[data-editor-block]")?.click();
    return {
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      slug: document.querySelector("[data-slug-field]")?.value || "",
      minutes: document.querySelector("[data-minutes-field]")?.value || "",
      seoTitle: document.querySelector("[data-seo-title-field]")?.value || "",
      seoDescription: document.querySelector("[data-seo-description-field]")?.value || "",
      wordCount: document.querySelector("[data-word-count]")?.textContent || "",
      readingEstimate: document.querySelector("[data-reading-estimate]")?.textContent || "",
      seoScore: document.querySelector("[data-seo-score]")?.textContent || "",
      checklistItems: document.querySelectorAll("[data-editor-checklist] li").length,
      previewHasTable: Boolean(document.querySelector("[data-editor-preview] table")),
      commandBar: Boolean(document.querySelector(".editor-command-bar")),
      qualityPanel: Boolean(document.querySelector(".editor-quality-panel"))
    };
  })()`);
  record("editor page renders", editor.h1 === "Create article", editor.h1);
  record("editor command tools work", editor.slug === "editor-qa-newsroom-workflow-test" && Number(editor.minutes) >= 1, JSON.stringify({ slug: editor.slug, minutes: editor.minutes }));
  record("editor SEO helper works", Boolean(editor.seoTitle) && Boolean(editor.seoDescription));
  record("editor quality panel works", editor.commandBar && editor.qualityPanel && editor.checklistItems >= 7 && Number.parseInt(editor.wordCount.replace(/,/g, ""), 10) > 100, JSON.stringify({ wordCount: editor.wordCount, seoScore: editor.seoScore }));
  record("editor preview updates", editor.previewHasTable);

  const failedNetwork = [...new Set(badNetwork)].filter((item) => !item.includes("/api/articles/undefined"));
  record("news/editor browser has no failed resources", failedNetwork.length === 0, failedNetwork.slice(0, 8).join(" | "));
  record("news/editor browser has no runtime errors", runtimeErrors.length === 0, [...new Set(runtimeErrors)].slice(0, 8).join(" | "));

  const failed = checks.filter((check) => !check.ok);
  console.log(JSON.stringify({ passed: checks.length - failed.length, total: checks.length, failed }, null, 2));
  if (failed.length) process.exitCode = 1;
} finally {
  chrome.kill();
  await new Promise((resolve) => setTimeout(resolve, 500));
  await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
}
