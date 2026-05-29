import { database, getArticles, getNewsImportSources, rebuildSearchIndex, recordNewsImportSourceMetric, saveAdminArticle } from "./db.js";
import { config } from "./config.js";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=82";
const REQUEST_TIMEOUT_MS = 12000;
const GLOBAL_EXCLUDE_KEYWORDS = [
  "coupon code",
  "coupon codes",
  "promo code",
  "promo codes",
  "discount code",
  "discounts",
  "% off",
  "limited time",
  "black friday",
  "cyber monday"
].join("\n");

function decodeEntities(value = "") {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)));
}

function stripTags(value = "") {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 110);
}

function firstMatch(xml, patterns) {
  for (const pattern of patterns) {
    const match = pattern.exec(xml);
    if (match?.[1]) return decodeEntities(match[1].trim());
  }
  return "";
}

function attrMatch(xml, tagName, attrName) {
  const tag = new RegExp(`<${tagName}\\b[^>]*>`, "i").exec(xml)?.[0] || "";
  const attr = new RegExp(`${attrName}=["']([^"']+)["']`, "i").exec(tag)?.[1] || "";
  return decodeEntities(attr);
}

function normalizeUrl(value = "") {
  try {
    const url = new URL(decodeEntities(value).trim());
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}

function clampText(value = "", max = 260) {
  const text = stripTags(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

function keywordList(value = "") {
  return String(value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function keywordHits(text, keywords) {
  const haystack = String(text || "").toLowerCase();
  return keywordList(keywords).filter((keyword) => haystack.includes(keyword));
}

export function assessImportRisk(source, item) {
  const text = `${item.title} ${stripTags(item.description)} ${(item.categories || []).join(" ")} ${item.link}`.toLowerCase();
  const excludeHits = [...new Set([...keywordHits(text, source.excludeKeywords), ...keywordHits(text, GLOBAL_EXCLUDE_KEYWORDS)])];
  const requireKeywords = keywordList(source.requireKeywords);
  const missingRequired = requireKeywords.length > 0 && !requireKeywords.some((keyword) => text.includes(keyword));
  const inspectionHits = keywordHits(text, source.inspectionKeywords);
  const sensitiveHits = keywordHits(text, [
    "accused", "alleged", "ban", "breach", "civil unrest", "credentials", "crime", "death", "exploit",
    "fraud", "hack", "illegal", "lawsuit", "leak", "malware", "politics", "ransomware", "scam",
    "settlement", "war", "weapon"
  ].join("\n"));
  let score = { high: 12, medium: 26, low: 42 }[source.trustLevel] ?? 30;
  const reasons = [`${source.trustLevel || "medium"} source trust`];
  if (!stripTags(item.description)) {
    score += 10;
    reasons.push("missing feed excerpt");
  }
  if (source.id === "hacker-news") {
    score += 15;
    reasons.push("community-ranked source requires caution");
  }
  if (/twitter\.com|x\.com|reddit\.com|github\.com/i.test(item.link || "")) {
    score += 12;
    reasons.push("primary link is social/code-hosted, verify context");
  }
  if (inspectionHits.length) {
    score += Math.min(45, inspectionHits.length * 18);
    reasons.push(`inspection keywords: ${inspectionHits.slice(0, 4).join(", ")}`);
  }
  if (sensitiveHits.length) {
    score += Math.min(35, sensitiveHits.length * 10);
    reasons.push(`sensitive terms: ${sensitiveHits.slice(0, 4).join(", ")}`);
  }
  if (missingRequired) {
    return { score: 100, blocked: true, needsInspection: true, action: "skipped", reasons: [`missing required keyword: ${requireKeywords.slice(0, 3).join(", ")}`] };
  }
  if (excludeHits.length) {
    return { score: 100, blocked: true, needsInspection: true, action: "skipped", reasons: [`excluded keyword: ${excludeHits.slice(0, 4).join(", ")}`] };
  }
  const finalScore = Math.max(0, Math.min(100, score));
  const threshold = Number(source.autoPublishMaxRisk || 50);
  const needsInspection = finalScore > threshold;
  return { score: finalScore, blocked: false, needsInspection, action: needsInspection ? "pending_review" : "auto_publish", reasons };
}

function readingMinutes(value = "") {
  const words = stripTags(value).split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.min(8, Math.ceil(words / 220) || 3));
}

function sourceCategory(source, item) {
  const text = `${item.title} ${item.description} ${(item.categories || []).join(" ")}`.toLowerCase();
  if (/\b(ai|artificial intelligence|machine learning|llm|openai|anthropic|agent|nvidia|model)\b/.test(text)) return "ai";
  if (/\b(security|cyber|hack|breach|privacy|ransomware|vulnerability)\b/.test(text)) return "cybersecurity";
  if (/\b(startup|founder|funding|venture|ipo|seed|series [abc])\b/.test(text)) return "startups";
  if (/\b(game|gaming|xbox|playstation|nintendo|steam|esports)\b/.test(text)) return "gaming";
  if (/\b(chip|cpu|gpu|phone|iphone|android|laptop|hardware|device)\b/.test(text)) return "hardware";
  if (/\b(cloud|aws|azure|google cloud|kubernetes|devops|server|infrastructure)\b/.test(text)) return "cloud";
  if (/\b(review|hands-on|tested|benchmark)\b/.test(text)) return "reviews";
  if (/\b(enterprise|cio|business|workplace|microsoft|salesforce|oracle|sap)\b/.test(text)) return "enterprise-tech";
  return source.category || "software";
}

function itemTags(source, item) {
  const tags = new Set(["Syndicated", source.name]);
  for (const category of item.categories || []) {
    const clean = stripTags(category).slice(0, 34);
    if (clean && clean.length > 1) tags.add(clean);
  }
  tags.add(sourceCategory(source, item).replace(/-/g, " "));
  return [...tags].slice(0, 8).join(", ");
}

function parseFeed(xml, source) {
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  return blocks.map((block) => {
    const title = stripTags(firstMatch(block, [/<title\b[^>]*>([\s\S]*?)<\/title>/i]));
    const link = normalizeUrl(firstMatch(block, [/<link\b[^>]*>([\s\S]*?)<\/link>/i]) || attrMatch(block, "link", "href"));
    const description = firstMatch(block, [
      /<description\b[^>]*>([\s\S]*?)<\/description>/i,
      /<summary\b[^>]*>([\s\S]*?)<\/summary>/i,
      /<content:encoded\b[^>]*>([\s\S]*?)<\/content:encoded>/i,
      /<content\b[^>]*>([\s\S]*?)<\/content>/i
    ]);
    const image = normalizeUrl(
      attrMatch(block, "media:content", "url") ||
      attrMatch(block, "media:thumbnail", "url") ||
      attrMatch(block, "enclosure", "url") ||
      firstMatch(block, [/<image\b[^>]*>([\s\S]*?)<\/image>/i])
    );
    const categories = [...block.matchAll(/<category\b[^>]*>([\s\S]*?)<\/category>/gi)].map((match) => stripTags(match[1])).filter(Boolean);
    const publishedAt = firstMatch(block, [
      /<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i,
      /<published\b[^>]*>([\s\S]*?)<\/published>/i,
      /<updated\b[^>]*>([\s\S]*?)<\/updated>/i
    ]);
    return { source, title, link, description, image, categories, publishedAt };
  }).filter((item) => item.title && item.link);
}

export async function fetchNewsSource(source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "accept": "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        "user-agent": "TechMagazineNewsImporter/1.0 (+https://techmag.local)"
      }
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const xml = await response.text();
    return { ok: true, source, items: parseFeed(xml, source) };
  } catch (error) {
    return { ok: false, source, items: [], error: error.message };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchHackerNews(limit = 20, sourceControl = null) {
  const source = sourceControl || {
    id: "hacker-news",
    name: "Hacker News",
    url: "https://news.ycombinator.com/news",
    category: "software",
    weight: 62,
    priority: 62,
    trustLevel: "low",
    defaultStatus: "pending_review",
    autoPublishMaxRisk: 25
  };
  try {
    const listResponse = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", { headers: { "accept": "application/json" } });
    if (!listResponse.ok) throw new Error(`${listResponse.status} ${listResponse.statusText}`);
    const ids = (await listResponse.json()).slice(0, limit);
    const items = await Promise.all(ids.map(async (id) => {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { headers: { "accept": "application/json" } });
      if (!response.ok) return null;
      const item = await response.json();
      if (!item?.title || !item?.url) return null;
      const techSignal = `${item.title} ${item.url}`.toLowerCase();
      if (!/\b(ai|api|app|cloud|code|developer|devops|github|google|hardware|kubernetes|linux|llm|machine learning|openai|programming|security|software|startup|system|technology|web)\b/.test(techSignal)) return null;
      if (/\bremove[-\s]?ai[-\s]?watermarks?\b/.test(techSignal)) return null;
      return {
        source,
        title: item.title,
        link: normalizeUrl(item.url),
        description: `A highly discussed Hacker News story with ${Number(item.score || 0).toLocaleString()} points and ${Number(item.descendants || 0).toLocaleString()} comments.`,
        image: "",
        categories: ["Hacker News", "Technology"],
        publishedAt: item.time ? new Date(item.time * 1000).toUTCString() : ""
      };
    }));
    return { ok: true, source, items: items.filter(Boolean).map((item) => ({ ...item, source })) };
  } catch (error) {
    return { ok: false, source, items: [], error: error.message };
  }
}

function sourceControls() {
  return getNewsImportSources().map((source) => ({ ...source, weight: source.priority }));
}

export async function previewTechNewsSources() {
  const controls = sourceControls();
  const activeFeeds = controls.filter((source) => source.enabled && source.id !== "hacker-news");
  const results = await Promise.all(activeFeeds.map(fetchNewsSource));
  const hnControl = controls.find((source) => source.id === "hacker-news");
  const hn = hnControl?.enabled ? await fetchHackerNews(15, hnControl) : null;
  const byId = new Map([...results, hn].filter(Boolean).map((result) => [result.source.id, result]));
  return controls.map((source) => {
    const result = byId.get(source.id);
    return {
      id: source.id,
      source: source.name,
      url: source.url || "https://news.ycombinator.com/news",
      enabled: source.enabled,
      priority: source.priority,
      trustLevel: source.trustLevel,
      defaultStatus: source.defaultStatus,
      autoPublishMaxRisk: source.autoPublishMaxRisk,
      excludeKeywords: source.excludeKeywords,
      inspectionKeywords: source.inspectionKeywords,
      requireKeywords: source.requireKeywords,
      ok: source.enabled ? Boolean(result?.ok) : false,
      items: source.enabled ? Number(result?.items.length || 0) : 0,
      error: source.enabled ? (result?.error || "") : "Disabled"
    };
  });
}

function currentArticleIdentity() {
  const rows = database
    .prepare("SELECT slug, canonical_url AS canonicalUrl FROM articles WHERE deleted_at IS NULL")
    .all();
  return {
    slugs: new Set(rows.map((row) => row.slug).filter(Boolean)),
    canonicals: new Set(rows.map((row) => normalizeUrl(row.canonicalUrl)).filter(Boolean))
  };
}

function rankedItems(results) {
  return results
    .flatMap((result) => result.items.map((item, index) => ({ ...item, sourceRank: result.source.weight || 50, sourceIndex: index })))
    .sort((a, b) => {
      const dateA = Date.parse(a.publishedAt || "") || 0;
      const dateB = Date.parse(b.publishedAt || "") || 0;
      return (dateB + b.sourceRank * 100000 - b.sourceIndex * 1000) - (dateA + a.sourceRank * 100000 - a.sourceIndex * 1000);
    });
}

function articlePayload(item, identity, options) {
  const source = item.source;
  const risk = options.risk || assessImportRisk(source, item);
  const baseSlug = slugify(`${source.id}-${item.title}`) || `${source.id}-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;
  while (identity.slugs.has(slug)) {
    slug = `${baseSlug.slice(0, 100)}-${suffix}`;
    suffix += 1;
  }
  identity.slugs.add(slug);

  const sourceUrl = normalizeUrl(item.link);
  const excerpt = clampText(item.description || item.title, 260);
  const date = item.publishedAt && !Number.isNaN(Date.parse(item.publishedAt))
    ? new Date(item.publishedAt).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const category = sourceCategory(source, item);
  const sourceName = escapeHtml(source.name);
  const title = stripTags(item.title).slice(0, 180);
  const brief = escapeHtml(excerpt || `A current technology story from ${source.name}.`);
  const original = escapeHtml(sourceUrl);
  const sourceFeed = escapeHtml(source.url || "");

  const policyStatus = risk.needsInspection ? "pending_review" : (source.defaultStatus || "published");
  const requestedStatus = options.status && options.status !== "source_policy" ? options.status : policyStatus;
  const finalStatus = risk.needsInspection ? "pending_review" : requestedStatus;

  return {
    title,
    slug,
    subtitle: excerpt || `Latest technology story from ${source.name}.`,
    category,
    channel: "news",
    author: options.author || "maya-chen",
    date,
    minutes: readingMinutes(`${title} ${excerpt}`),
    views: Math.max(250, Math.round((source.weight || 50) * 40 + Math.random() * 900)),
    featured: false,
    breaking: false,
    trending: true,
    image: item.image || FALLBACK_IMAGE,
    caption: `Syndicated brief based on ${source.name}'s public feed.`,
    body: [
      `<p><strong>Source brief:</strong> ${brief}</p>`,
      `<p>This item was imported from ${sourceName}'s public feed for newsroom monitoring and reader discovery. Tech Magazine stores a short credited brief, metadata, and a canonical link instead of copying the full publisher article.</p>`,
      `<p><strong>Import risk:</strong> ${risk.score}/100. Route: ${finalStatus.replace("_", " ")}. ${escapeHtml(risk.reasons.slice(0, 3).join("; "))}</p>`,
      `<p><a href="${original}" target="_blank" rel="noopener noreferrer">Read the full original story at ${sourceName}</a>${sourceFeed ? ` - Feed: <a href="${sourceFeed}" target="_blank" rel="noopener noreferrer">${sourceName} RSS</a>` : ""}</p>`
    ].join("\n\n"),
    seoTitle: title,
    seoDescription: excerpt || title,
    canonicalUrl: sourceUrl,
    ogImage: item.image || FALLBACK_IMAGE,
    status: finalStatus,
    tags: `${itemTags(source, item)}, Risk ${risk.score}, ${risk.needsInspection ? "Needs inspection" : "Auto imported"}`,
    savedBy: options.savedBy || null
  };
}

export async function importTechNews(options = {}) {
  const limit = Math.max(1, Number.parseInt(options.limit || config.newsImportTargetCount || "50", 10) || 50);
  const status = options.status || config.newsImportStatus || "source_policy";
  const controls = sourceControls();
  const sourceResults = await Promise.all(controls.filter((source) => source.enabled && source.id !== "hacker-news").map(fetchNewsSource));
  const results = [...sourceResults];
  const identity = currentArticleIdentity();
  const imported = [];
  const skipped = [];
  const failed = [];
  const inspected = [];

  const importFromItems = (items) => {
    for (const item of items) {
      if (imported.length >= limit) break;
      const risk = assessImportRisk(item.source, item);
      recordNewsImportSourceMetric({ sourceId: item.source.id, seen: true, riskScore: risk.score });
      if (risk.blocked) {
        recordNewsImportSourceMetric({ sourceId: item.source.id, skipped: true });
        skipped.push({ title: item.title, source: item.source.name, reason: risk.reasons.join("; "), riskScore: risk.score });
        continue;
      }
      const canonical = normalizeUrl(item.link);
      if (!canonical || identity.canonicals.has(canonical)) {
        recordNewsImportSourceMetric({ sourceId: item.source.id, duplicate: true });
        skipped.push({ title: item.title, source: item.source.name, reason: "duplicate" });
        continue;
      }
      identity.canonicals.add(canonical);
      const payload = articlePayload(item, identity, { ...options, status, risk });
      try {
        const result = saveAdminArticle(payload);
        if (!result.ok) {
          recordNewsImportSourceMetric({ sourceId: item.source.id, failed: true });
          failed.push({ title: item.title, source: item.source.name, error: result.message });
        }
        else {
          recordNewsImportSourceMetric({ sourceId: item.source.id, imported: true, inspection: payload.status === "pending_review" });
          const record = { id: result.id, slug: payload.slug, title: payload.title, source: item.source.name, canonicalUrl: canonical, status: payload.status, riskScore: risk.score, riskReasons: risk.reasons, riskAction: risk.action };
          imported.push(record);
          if (payload.status === "pending_review") inspected.push(record);
        }
      } catch (error) {
        recordNewsImportSourceMetric({ sourceId: item.source.id, failed: true });
        failed.push({ title: item.title, source: item.source.name, error: error.message });
      }
    }
  };

  importFromItems(rankedItems(results));

  if (imported.length < limit) {
    const hnControl = controls.find((source) => source.enabled && source.id === "hacker-news");
    if (hnControl) {
      const hn = await fetchHackerNews(Math.max(25, limit - imported.length + 10), hnControl);
      results.push(hn);
      importFromItems(rankedItems([hn]));
    }
  }

  if (imported.length) rebuildSearchIndex();
  const publishedCount = getArticles().length;
  return {
    ok: imported.length > 0,
    requested: limit,
    status,
    imported,
    importedCount: imported.length,
    inspectionCount: inspected.length,
    inspected,
    skippedCount: skipped.length,
    failedCount: failed.length,
    skipped: skipped.slice(0, 20),
    failed,
    publishedCount,
    sources: results.map((result) => ({
      id: result.source.id,
      name: result.source.name,
      url: result.source.url || "https://news.ycombinator.com/news",
      ok: result.ok,
      items: result.items.length,
      error: result.error || ""
    }))
  };
}
