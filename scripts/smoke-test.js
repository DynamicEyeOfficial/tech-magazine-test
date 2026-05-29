import { randomBytes, createHash } from "node:crypto";
import { connect } from "node:net";
import { cleanupQaData } from "./qa-cleanup.js";
import { getQaAdminCredentials, hasKnownCredentialLeak, hasSecretTokenLeak } from "./qa-credentials.js";

const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const checks = [];

async function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    ...options
  });
}

async function expectText(path, text) {
  const response = await request(path);
  const body = await response.text();
  checks.push({
    name: path,
    ok: response.status >= 200 && response.status < 400 && body.includes(text),
    status: response.status
  });
}

async function expectNoCredentialLeak(path) {
  const response = await request(path);
  const body = await response.text();
  checks.push({
    name: `${path} no credential leak`,
    ok: response.status >= 200 && response.status < 400 && !hasKnownCredentialLeak(body),
    status: response.status
  });
}

async function expectNoSecretTokenLeak(path, options = {}) {
  const response = await request(path, options);
  const body = await response.text();
  checks.push({
    name: `${path} no secret token leak`,
    ok: response.status >= 200 && response.status < 500 && !hasSecretTokenLeak(body),
    status: response.status
  });
}

async function expectRedirectNoCredentialLeak(path, location) {
  const response = await request(path);
  const body = await response.text();
  checks.push({
    name: `${path} redirects without credential body`,
    ok: response.status === 302 && (response.headers.get("location") || "").includes(location) && !hasKnownCredentialLeak(body),
    status: response.status
  });
}

async function expectHeader(path, header, predicate) {
  const response = await request(path);
  checks.push({
    name: `${path} header ${header}`,
    ok: response.ok && predicate(response.headers.get(header) || ""),
    status: response.status
  });
}

async function expectJson(path, predicate, options = {}) {
  const response = await request(path, options);
  const text = await response.text();
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {
    checks.push({ name: `${path} valid json`, ok: false, status: response.status });
    return;
  }
  checks.push({
    name: path,
    ok: response.ok && predicate(json),
    status: response.status
  });
}

async function expectJsonStatus(path, status, predicate) {
  const response = await request(path);
  const text = await response.text();
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {
    checks.push({ name: `${path} valid json`, ok: false, status: response.status });
    return;
  }
  checks.push({
    name: path,
    ok: response.status === status && predicate(json),
    status: response.status
  });
}

async function expectPostJson(path, payload, predicate, options = {}) {
  const response = await request(path, {
    method: "POST",
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    body: JSON.stringify(payload)
  });
  const text = await response.text();
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {
    checks.push({ name: `POST ${path} valid json`, ok: false, status: response.status });
    return {};
  }
  checks.push({
    name: `POST ${path}`,
    ok: response.ok && predicate(json),
    status: response.status
  });
  return json;
}

async function login() {
  const credentials = getQaAdminCredentials();
  const response = await request("/admin/login", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      email: credentials.email,
      password: credentials.password
    })
  });
  const cookie = response.headers.get("set-cookie")?.split(";")[0];
  checks.push({ name: "admin login", ok: response.status === 302 && Boolean(cookie), status: response.status });
  return cookie;
}

async function expectAdminPasswordRotation() {
  const credentials = getQaAdminCredentials();
  const oldPasswordResponse = await request("/admin/login", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email: credentials.email, password: ["admin", "123"].join("") })
  });
  checks.push({ name: "old admin password is rejected", ok: oldPasswordResponse.status === 401, status: oldPasswordResponse.status });
  const newPasswordResponse = await request("/admin/login", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email: credentials.email, password: credentials.password })
  });
  const cookie = newPasswordResponse.headers.get("set-cookie")?.split(";")[0] || "";
  checks.push({ name: "rotated admin password works", ok: newPasswordResponse.status === 302 && Boolean(cookie), status: newPasswordResponse.status });
  if (cookie) await request("/admin/logout", { headers: { cookie } });
}

async function expectAdmin(path, cookie, text, { csrf = false } = {}) {
  const response = await request(path, { headers: { cookie } });
  const body = await response.text();
  checks.push({
    name: `admin ${path}`,
    ok: response.ok && body.includes(text) && (!csrf || body.includes("_csrf")),
    status: response.status
  });
}

function extractCsrf(body) {
  return body.match(/name="_csrf" value="([^"]+)"/)?.[1] || "";
}

async function safeJson(response, name) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    checks.push({ name: `${name} valid json`, ok: false, status: response.status });
    return {};
  }
}

function waitForWorkflowSocketEvent(cookie, expectedType, trigger) {
  return new Promise((resolve) => {
    const target = new URL(baseUrl);
    const key = randomBytes(16).toString("base64");
    const socket = connect(Number(target.port || 80), target.hostname);
    let settled = false;
    let buffer = "";
    const finish = (ok, status = 0) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      resolve({ ok, status });
    };
    const timer = setTimeout(() => finish(false, 408), 6000);
    socket.on("connect", () => {
      socket.write([
        "GET /api/workflow/realtime HTTP/1.1",
        `Host: ${target.host}`,
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Key: ${key}`,
        "Sec-WebSocket-Version: 13",
        `Cookie: ${cookie}`,
        "\r\n"
      ].join("\r\n"));
    });
    socket.on("data", async (chunk) => {
      buffer += chunk.toString("utf8");
      if (buffer.includes("101 Switching Protocols") && trigger) {
        const run = trigger;
        trigger = null;
        await run();
      }
      if (buffer.includes(`"type":"${expectedType}"`)) {
        const accept = createHash("sha1")
          .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
          .digest("base64");
        finish(buffer.includes(accept), 101);
      }
    });
    socket.on("error", () => finish(false, 500));
  });
}

await expectText("/", "Tech Magazine");
await expectRedirectNoCredentialLeak("/admin", "/admin/login");
await expectNoCredentialLeak("/admin/login");
await expectNoSecretTokenLeak("/");
await expectNoSecretTokenLeak("/admin/login");
await expectAdminPasswordRotation();
await expectJson("/api/health", (json) => json.ok && json.database === "sqlite");
await expectJsonStatus("/.env", 403, (json) => json.ok === false && /firewall|security/i.test(json.message || ""));
await expectHeader("/assets/logo.svg", "cache-control", (value) => value.includes("max-age"));
await expectJson("/api/bootstrap", (json) => json.articles?.length > 0 && json.categories?.length > 0 && json.ads?.length > 0 && json.siteSettings?.brandName === "Tech Magazine" && Array.isArray(json.mediaOptimization?.imageWidths));
await expectJson("/api/bootstrap", (json) => json.analytics && "googleAnalyticsId" in json.analytics && "googleTagManagerId" in json.analytics && "matomoUrl" in json.analytics);
await expectJson("/api/bootstrap", (json) => json.authors?.some((author) => author.id === "maya-chen" && author.verified === true && Array.isArray(author.expertise) && author.expertise.length > 0 && author.sourcePolicy));
await expectJson("/api/bootstrap", (json) => json.credibility?.stats?.publishedArticles >= 1 && Array.isArray(json.credibility?.proofPoints) && json.credibility.proofPoints.some((item) => item.label === "Source governance") && json.credibility.externalProof?.some((item) => item.label === "Awards"));
await expectJson("/api/bootstrap", (json) => json.audienceConversion?.capabilities?.doubleOptIn === true && json.audienceConversion?.capabilities?.readerAlertPreferences === true && typeof json.audienceConversion?.subscribers === "number");
await expectJson("/api/languages", (json) => json.ok && json.languages?.some((language) => language.code === "ar" && language.direction === "rtl"));
await expectJson("/api/media/optimization", (json) =>
  json.ok
  && json.media?.settings?.storageProvider === "local"
  && typeof json.media?.totals?.assets === "number"
  && json.media?.totals?.productionReady === false
  && json.media?.readiness?.provider === "local"
  && json.media?.readiness?.productionReady === false
);
await expectJson("/api/v1/openapi.json", (json) => json.openapi === "3.1.0" && Boolean(json.paths?.["/api/v1/news"]) && Boolean(json.paths?.["/api/v1/mobile/config"]) && Boolean(json.paths?.["/graphql"]));
await expectJson("/api/v1/status", (json) => json.ok && json.status?.restApiReady === true && json.status?.graphqlReady === true && json.status?.mobileApiReady === true);
await expectJsonStatus("/api/v1/news", 401, (json) => json.ok === false && /api key/i.test(json.message || ""));
await expectJson("/api/articles/ai-agents-newsroom-workflows", (json) => json.ok && json.article?.slug === "ai-agents-newsroom-workflows");
await expectJson("/api/articles/ai-agents-newsroom-workflows", (json) => json.ok && json.article?.contentOrigin && json.article?.factCheckStatus && Number(json.article?.trustScore || 0) > 0 && json.article?.disclosureNote && json.article?.trustSummary);
await expectJson("/api/search?q=AI&category=ai&sort=popular", (json) => json.ok && json.articles?.some((article) => article.slug === "ai-agents-newsroom-workflows"));
await expectJson("/api/search/suggestions?q=cybersecurty", (json) => json.ok && json.suggestions?.some((item) => item.label === "Cybersecurity"));
await expectJson("/api/search/trending", (json) => json.ok && Array.isArray(json.trending));
await expectJson("/api/search?query=cybersecurty", (json) => json.ok && json.correctedQuery === "Cybersecurity" && json.articles?.length > 0);
await expectJson("/api/search/discovery?query=best%20AI%20chips&type=all", (json) => json.ok && json.results?.some((item) => ["article", "video", "device"].includes(item.type)) && json.semantic?.tokens?.includes("nvidia"));
await expectJson("/api/search/status", (json) => json.ok && json.search?.totalIndexed >= 1 && Array.isArray(json.search?.indexed));
await expectPostJson("/api/search/voice", { transcript: "AI security podcast", type: "all", deviceType: "mobile" }, (json) => json.ok && Array.isArray(json.results));
await expectJson("/api/memberships", (json) => json.ok && json.plans?.some((plan) => plan.slug === "pro"));
await expectJson("/api/commercial/experience", (json) =>
  json.ok
  && json.readiness?.manualCheckoutReady === true
  && json.readiness?.revenueReportingReady === true
  && json.readiness?.productionPaymentsConnected === false
  && json.packages?.length >= 4
  && json.revenueModel?.length >= 6
  && json.sponsorJourney?.length >= 5
);
const commercialResponse = await request("/api/commercial/experience");
const commercialJson = await safeJson(commercialResponse, "/api/commercial/experience affiliate");
if (commercialJson.affiliates?.[0]?.id) {
  const affiliateRedirect = await request(`/go/${commercialJson.affiliates[0].id}`);
  checks.push({
    name: "affiliate redirect tracking",
    ok: [301, 302, 303, 307, 308].includes(affiliateRedirect.status) && Boolean(affiliateRedirect.headers.get("location")),
    status: affiliateRedirect.status
  });
}
await expectJson("/api/trust/experience", (json) => json.ok && json.compliance?.privacy?.cookieConsentReady === true && json.trustModules?.length >= 4);
await expectPostJson("/api/ads/impression", { placement: "smoke-test", path: "#/smoke" }, (json) => json.ok);
await expectPostJson("/api/track", { eventType: "engagement", path: "#/article/ai-agents-newsroom-workflows", articleSlug: "ai-agents-newsroom-workflows", durationSeconds: 42, scrollDepth: 76 }, (json) => json.ok);
await expectJson("/api/notifications", (json) => json.ok && Array.isArray(json.notifications));
await expectJson("/api/firebase/config", (json) => json.ok && json.config?.projectId === "it-magazine-aeb46" && Boolean(json.vapidKey));
await expectJson("/api/ai/status", (json) => json.ok && Array.isArray(json.tools) && !("openaiApiKey" in json));
await expectNoSecretTokenLeak("/api/ai/status");
await expectJson("/api/breaking-news", (json) => json.ok && Array.isArray(json.alerts));
await expectJson("/api/live-events", (json) => json.ok && Array.isArray(json.events));
await expectJson("/api/events", (json) => json.ok && json.events?.some((event) => event.slug === "ai-leadership-forum"));
await expectJson("/api/events/ai-leadership-forum", (json) => json.ok && json.event?.speakers?.length > 0 && json.event?.agenda?.length > 0);
await expectJson("/api/events/experience", (json) => json.ok && json.readiness?.eventPagesReady && json.readiness?.virtualConferencesReady && json.stats?.liveStreams >= 1 && json.sponsorDesk?.length >= 1);
await expectJson("/api/jobs", (json) => json.ok && json.jobs?.some((job) => job.slug === "senior-cloud-security-architect"));
await expectJson("/api/jobs/senior-cloud-security-architect", (json) => json.ok && json.job?.requirements?.length > 0 && json.job?.benefits?.length > 0);
await expectJson("/api/jobs/experience", (json) => json.ok && json.experience?.stats?.openRoles >= 2 && json.experience?.featuredJobs?.length >= 1 && json.experience?.salaryInsights?.length >= 1 && json.experience?.readiness?.resumeUploadReady === true);
await expectJson("/api/startups", (json) => json.ok && json.startups?.some((startup) => startup.slug === "auralink-systems"));
await expectJson("/api/startups/auralink-systems", (json) => json.ok && json.startup?.founders?.length > 0 && json.startup?.fundingRounds?.length > 0);
await expectJson("/api/devices", (json) => json.ok && json.devices?.some((device) => device.slug === "nova-x1-pro"));
await expectJson("/api/devices/nova-x1-pro", (json) => json.ok && json.device?.specs?.length > 0 && json.device?.benchmarks?.length > 0);
await expectJson("/api/devices/experience", (json) => json.ok && json.devices?.some((device) => device.slug === "quantumedge-c9") && json.readiness?.gpuCpuDatabaseReady && json.companyProfiles?.length >= 3 && json.releaseTimeline?.length >= 4);
await expectJson("/api/devices/compare?slugs=nova-x1-pro,atlasbook-14-ai,quantumedge-c9", (json) => json.ok && json.comparison?.devices?.length === 3 && json.comparison?.specMatrix?.length > 0);
await expectJson("/api/videos", (json) => json.ok && Array.isArray(json.videos) && Array.isArray(json.playlists) && Array.isArray(json.categories) && json.platform?.streaming);
await expectJson("/api/videos/platform", (json) => json.ok && json.platform?.totals?.categories >= 1 && Boolean(json.platform?.streaming?.provider));
await expectJson("/api/podcasts", (json) => json.ok && Array.isArray(json.shows) && Array.isArray(json.episodes) && Array.isArray(json.categories) && json.platform?.totals);
await expectJson("/api/podcasts/platform", (json) => json.ok && json.platform?.totals?.categories >= 1 && Array.isArray(json.platform?.distribution));
await expectJson("/api/mobile/config", (json) => json.ok && json.app?.scheme === "techmagazine");
await expectJson("/api/mobile/experience", (json) => json.ok && json.app?.scheme === "techmagazine" && json.sync?.apiContractReady && Array.isArray(json.qaChecklist));
await expectJson("/api/mobile/home?platform=ios&appVersion=0.1.0", (json) => json.ok && Array.isArray(json.feed) && json.capabilities?.offlineReading);
await expectJson("/api/mobile/widgets", (json) => json.ok && Array.isArray(json.widgets?.trending));
await expectJson("/api/mobile/deep-link?url=techmagazine://article/ai-agents-newsroom-workflows", (json) => json.ok && json.route?.type === "article");
await expectJson("/api/reviews", (json) => json.ok && Array.isArray(json.reviews) && json.reviews?.some((review) => review.slug === "nova-x1-pro-review"));
await expectJson("/api/reviews/experience", (json) => json.ok && json.labSignals?.publishedReviews >= 1 && json.readiness?.reviewSchemaReady === true && json.scoringSystem?.length >= 4);
await expectJson("/api/reviews/compare?slugs=nova-x1-pro-review", (json) => json.ok && json.comparison?.reviews?.length >= 1 && json.comparison?.specMatrix?.length >= 1 && Array.isArray(json.comparison?.benchmarkMatrix));
await expectJson("/api/tech-database/summary", (json) => json.ok && json.database?.quality?.deviceRecordsWithSpecs >= 1 && json.database?.quality?.deviceRecordsWithBenchmarks >= 1 && json.database?.workflows?.comparisonReady);
await expectText("/api/events/ai-leadership-forum/calendar", "BEGIN:VCALENDAR");
await expectPostJson("/api/jobs/alerts", { email: `jobs-${Date.now()}@example.com`, keywords: "security kubernetes", location: "Remote", frequency: "weekly" }, (json) => json.ok && json.alert?.frequency === "weekly");
await expectPostJson("/api/compliance/consent", { consentType: "analytics", value: true, region: "LB", metadata: { source: "smoke" } }, (json) => json.ok && json.consent?.value === true);
  await expectJson("/api/future/summary", (json) => json.ok && json.future?.roadmap?.total >= 1 && json.future?.readiness?.voiceNavigationApiReady);
await expectJson("/api/future/summary", (json) =>
  json.ok
  && json.future?.roadmap?.total >= 8
  && Array.isArray(json.future?.readinessMatrix)
  && json.future.readinessMatrix.some((item) => item.id === "smart_tv_apps")
  && json.future.readinessMatrix.some((item) => item.id === "ai_news_anchors")
  && json.future.readinessMatrix.some((item) => item.id === "vr_ar_news")
  && json.future.readinessMatrix.some((item) => item.id === "blockchain_verification" && item.ready === true)
  && json.future.readinessMatrix.some((item) => item.id === "nft_media_collectibles")
  && json.future.readinessMatrix.some((item) => item.id === "ai_generated_media")
  && json.future.readinessMatrix.some((item) => item.id === "smart_assistants")
  && json.future.readinessMatrix.some((item) => item.id === "voice_navigation" && item.ready === true)
  && json.future.modules?.every((item) => item.surface && item.userJourney && Array.isArray(item.productionNeeds))
);
await expectJson("/api/future/voice-navigation", (json) => json.ok && json.prototype?.ready === true);
await expectJson("/api/community/topics", (json) => json.ok && json.topics?.length > 0);
await expectJson("/api/community/polls", (json) => json.ok && Array.isArray(json.polls));
await expectJson("/api/community/experience", (json) => json.ok && json.totals?.topicCount >= 0 && json.feedMix && Array.isArray(json.nextActions));
await expectJson("/api/community/social-experience", (json) => json.ok && json.readiness?.readerProfilesReady === true && Array.isArray(json.forums) && Array.isArray(json.leaderboard));
await expectJson("/api/gamification/leaderboard", (json) => json.ok && Array.isArray(json.leaderboard));
await expectJson("/api/directory/job", (json) => json.ok && json.items?.length > 0);
await expectText("/podcasts/rss.xml", "Tech Magazine Podcasts");
await expectText("/amp/articles/ai-agents-newsroom-workflows", "<html amp");
await expectText("/news-sitemap.xml", "sitemap-news");
await expectText("/video-sitemap.xml", "video:video");
await expectText("/podcast-sitemap.xml", "urlset");
await expectText("/category-sitemap.xml", "urlset");
await expectJson("/api/seo/schema/article/ai-agents-newsroom-workflows", (json) => json.ok && json.schema?.["@type"] === "NewsArticle");
await expectJson("/api/seo/preview/article/ai-agents-newsroom-workflows", (json) => json.ok && json.preview?.score >= 1 && json.preview?.og?.url);
await expectJson("/api/seo/preview/video/ai-agents-enterprise-briefing", (json) => json.ok && json.preview?.title?.includes("AI Agents"));
await expectJson("/api/seo/preview/podcast/ai-agents-production-playbook", (json) => json.ok && json.preview?.title?.includes("AI Agents"));
await expectJson("/api/seo/internal-links/ai-agents-newsroom-workflows", (json) => json.ok && Array.isArray(json.suggestions));
await expectPostJson("/graphql", { query: "query { articles categories }", variables: { category: "ai" } }, (json) => json.data?.articles?.length > 0 && json.data?.categories?.length > 0);
await expectJson("/api/newsletter/experience", (json) => json.ok && json.readiness?.doubleOptInReady === true && Array.isArray(json.segments) && Array.isArray(json.journey));
const newsletterEmail = `newsletter-${Date.now()}@example.com`;
const newsletter = await expectPostJson("/api/newsletter", { email: newsletterEmail, preferences: { ai: true, cybersecurity: true } }, (json) => json.ok && Boolean(json.verificationToken));
await expectPostJson("/api/company/contact", {
  name: "Smoke Company Contact",
  email: `company-smoke-${Date.now()}@example.com`,
  company: "Smoke Labs",
  topic: "media-kit",
  message: "Please route this smoke test company request into the email outbox."
}, (json) => json.ok && Boolean(json.id));
if (newsletter?.verificationToken) {
  await expectJson(`/api/newsletter/verify?token=${encodeURIComponent(newsletter.verificationToken)}`, (json) => json.ok && json.subscriber?.email === newsletterEmail);
  await expectPostJson("/api/newsletter/event", { email: newsletterEmail, eventType: "open", campaignId: "smoke-campaign", metadata: { source: "smoke" } }, (json) => json.ok);
  await expectPostJson("/api/newsletter/unsubscribe", { email: newsletterEmail }, (json) => json.ok && /unsubscribed/i.test(json.message || ""));
}
const readerEmail = `reader-${Date.now()}@example.com`;
const reader = await expectPostJson("/api/reader/register", { name: "Reader Smoke", email: readerEmail, password: "password123" }, (json) => json.ok && Boolean(json.token));
if (reader?.token) {
  await expectPostJson("/api/reader/profile", {
    name: "Reader Smoke Updated",
    bio: "Smoke reader profile with preferences.",
    avatar: "https://example.com/avatar.png",
    preferredCategories: "ai, cybersecurity",
    preferredAuthors: "maya-chen",
    emailFrequency: "daily",
    theme: "dark",
    languageCode: "en"
  }, (json) => json.ok && json.reader?.name === "Reader Smoke Updated", { headers: { authorization: `Bearer ${reader.token}` } });
  await expectJson("/api/mobile/home?platform=android&appVersion=0.1.0&installationId=smoke-install", (json) => json.ok && json.personalized === true && Array.isArray(json.sections?.saved), { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/mobile/device", { installationId: `smoke-install-${Date.now()}`, platform: "android", appVersion: "0.1.0", deviceToken: `smoke-mobile-${Date.now()}`, channels: ["breaking", "podcast"] }, (json) => json.ok && json.device?.pushEnabled === true, { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/mobile/offline", { itemType: "article", itemSlug: "ai-agents-newsroom-workflows" }, (json) => json.ok && json.item?.payload?.slug === "ai-agents-newsroom-workflows", { headers: { authorization: `Bearer ${reader.token}` } });
  await expectJson("/api/mobile/offline", (json) => json.ok && json.items?.some((item) => item.slug === "ai-agents-newsroom-workflows"), { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/mobile/analytics", { installationId: "smoke-install", eventType: "screen_view", screen: "article", itemType: "article", itemSlug: "ai-agents-newsroom-workflows", platform: "android", durationSeconds: 12 }, (json) => json.ok, { headers: { authorization: `Bearer ${reader.token}` } });
  await expectJson("/api/mobile/experience?platform=android&appVersion=0.1.0&installationId=smoke-install", (json) => json.ok && json.signedIn === true && json.devices?.some((device) => device.installationId?.startsWith("smoke-install")) && json.offline?.some((item) => item.slug === "ai-agents-newsroom-workflows") && json.sync?.readyForNativeApps, { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/search/saved-filters", { name: "Smoke AI discovery", query: "AI chips", type: "all", sort: "relevance" }, (json) => json.ok && json.filter?.name === "Smoke AI discovery", { headers: { authorization: `Bearer ${reader.token}` } });
  await expectJson("/api/search/saved-filters", (json) => json.ok && json.filters?.some((item) => item.name === "Smoke AI discovery"), { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/bookmarks/ai-agents-newsroom-workflows", {}, (json) => json.ok && json.bookmarked === true, { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/track", { eventType: "article_view", path: "#/article/ai-agents-newsroom-workflows", articleSlug: "ai-agents-newsroom-workflows" }, (json) => json.ok, { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/track", { eventType: "engagement", path: "#/article/ai-agents-newsroom-workflows", articleSlug: "ai-agents-newsroom-workflows", durationSeconds: 45, scrollDepth: 80 }, (json) => json.ok, { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/memberships/subscribe/pro", {}, (json) => json.ok && json.membership?.planSlug === "pro", { headers: { authorization: `Bearer ${reader.token}` } });
  await expectJson("/api/commercial/experience", (json) => json.ok && json.signedIn === true && json.membership?.planSlug === "pro" && json.readiness?.paywallReady === true && json.revenueModel?.some((item) => item.label === "Membership"), { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/compliance/consent", { consentType: "personalization", value: true, metadata: { source: "smoke-trust-center" } }, (json) => json.ok && json.consent?.consentType === "personalization", { headers: { authorization: `Bearer ${reader.token}` } });
  await expectJson("/api/trust/experience", (json) => json.ok && json.signedIn === true && json.reader?.email === readerEmail && json.securityPosture?.csrfReady === true, { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/notifications/preferences", { breaking: true, newsletters: true, liveEvents: true, favoriteCategories: "ai, cloud" }, (json) => json.ok && json.preferences?.favoriteCategories?.includes("ai"), { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/notifications/device", { deviceToken: `smoke-fcm-${Date.now()}` }, (json) => json.ok && json.preferences?.pushEnabled === true, { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/events/ai-leadership-forum/register", { name: "Reader Smoke", email: readerEmail, company: "Smoke Labs" }, (json) => json.ok && Boolean(json.registration?.id), { headers: { authorization: `Bearer ${reader.token}` } });
  await expectPostJson("/api/jobs/senior-cloud-security-architect/apply", { name: "Reader Smoke", email: readerEmail, skills: "cloud security, zero trust, kubernetes", resumeUrl: "https://example.com/resume.pdf", coverLetter: "I lead cloud security and Kubernetes risk programs." }, (json) => json.ok && Number(json.application?.matchScore || 0) >= 0, { headers: { authorization: `Bearer ${reader.token}` } });
  const topicResult = await expectPostJson("/api/community/topics", { title: "Smoke test community topic", body: "This topic confirms the community API is working." }, (json) => json.ok && Boolean(json.topic?.slug), { headers: { authorization: `Bearer ${reader.token}` } });
  if (topicResult?.topic?.id) {
    await expectPostJson(`/api/community/topics/${topicResult.topic.id}/replies`, { body: "Smoke test reply confirms threaded community replies." }, (json) => json.ok && Boolean(json.reply?.id), { headers: { authorization: `Bearer ${reader.token}` } });
    await expectPostJson(`/api/community/topics/${topicResult.topic.id}/vote`, { vote: 1 }, (json) => json.ok && Number(json.score || 0) >= 1, { headers: { authorization: `Bearer ${reader.token}` } });
  }
  await expectPostJson("/api/authors/maya-chen/follow", {}, (json) => json.ok && json.following === true, { headers: { authorization: `Bearer ${reader.token}` } });
  await expectJson("/api/reader/following-feed", (json) => json.ok && Array.isArray(json.articles), { headers: { authorization: `Bearer ${reader.token}` } });
  const socialResponse = await request("/api/reader/social", { headers: { authorization: `Bearer ${reader.token}` } });
  const socialJson = await safeJson(socialResponse, "/api/reader/social");
  checks.push({
    name: "/api/reader/social",
    ok: socialResponse.ok && socialJson.ok && socialJson.follows?.some((author) => author.id === "maya-chen") && socialJson.reputation?.points >= 1 && Number.isFinite(Number(socialJson.gamification?.completedReads || 0)),
    status: socialResponse.status
  });
  const gamificationResponse = await request("/api/reader/gamification", { headers: { authorization: `Bearer ${reader.token}` } });
  const gamificationJson = await safeJson(gamificationResponse, "/api/reader/gamification");
  checks.push({
    name: "/api/reader/gamification",
    ok: gamificationResponse.ok && gamificationJson.ok && gamificationJson.gamification?.points >= 1 && gamificationJson.gamification?.streak?.currentStreak >= 1,
    status: gamificationResponse.status
  });
  const experienceResponse = await request("/api/reader/experience", { headers: { authorization: `Bearer ${reader.token}` } });
  const experienceJson = await safeJson(experienceResponse, "/api/reader/experience");
  checks.push({
    name: "/api/reader/experience",
    ok: experienceResponse.ok &&
      experienceJson.ok &&
      experienceJson.preferences?.categories?.includes("ai") &&
      experienceJson.follows?.some((author) => author.id === "maya-chen") &&
      experienceJson.savedSearches?.some((item) => item.name === "Smoke AI discovery") &&
      experienceJson.completion?.score >= 50 &&
      Array.isArray(experienceJson.recommendations),
    status: experienceResponse.status
  });
  const communityExperienceResponse = await request("/api/community/experience", { headers: { authorization: `Bearer ${reader.token}` } });
  const communityExperienceJson = await safeJson(communityExperienceResponse, "/api/community/experience");
  checks.push({
    name: "/api/community/experience signed in",
    ok: communityExperienceResponse.ok &&
      communityExperienceJson.ok &&
      communityExperienceJson.signedIn === true &&
      communityExperienceJson.readerStats?.follows >= 1 &&
      Array.isArray(communityExperienceJson.nextActions),
    status: communityExperienceResponse.status
  });
  const communitySocialResponse = await request("/api/community/social-experience", { headers: { authorization: `Bearer ${reader.token}` } });
  const communitySocialJson = await safeJson(communitySocialResponse, "/api/community/social-experience");
  checks.push({
    name: "/api/community/social-experience signed in",
    ok: communitySocialResponse.ok &&
      communitySocialJson.ok &&
      communitySocialJson.signedIn === true &&
      communitySocialJson.social?.follows?.some((author) => author.id === "maya-chen") &&
      communitySocialJson.readiness?.moderationReady === true &&
      Array.isArray(communitySocialJson.recentReplies),
    status: communitySocialResponse.status
  });
  const bookmarkResponse = await request("/api/reader/bookmarks", { headers: { authorization: `Bearer ${reader.token}` } });
  const bookmarkJson = await safeJson(bookmarkResponse, "/api/reader/bookmarks");
  checks.push({
    name: "/api/reader/bookmarks",
    ok: bookmarkResponse.ok && bookmarkJson.ok && bookmarkJson.articles?.some((article) => article.slug === "ai-agents-newsroom-workflows"),
    status: bookmarkResponse.status
  });
  await expectJson(`/api/community/profiles/${encodeURIComponent(readerEmail)}`, (json) => json.ok && json.profile?.preferences?.categories?.includes("ai"));
}
await expectText("/sitemap.xml", "urlset");
await expectText("/robots.txt", "Sitemap");

const cookie = await login();
if (cookie) {
  await expectAdmin("/admin", cookie, "Newsroom dashboard");
  await expectAdmin("/admin/articles", cookie, "Article manager");
  await expectAdmin("/admin/news-imports", cookie, "Tech news imports");
  await expectAdmin("/admin/news-imports/inspection", cookie, "Imported story inspection");
  await expectAdmin("/admin/news-imports/performance", cookie, "Source performance dashboard");
  const newsImportsResponse = await request("/admin/news-imports", { headers: { cookie } });
  const newsImportsBody = await newsImportsResponse.text();
  checks.push({
    name: "admin news imports connected sources",
    ok: newsImportsResponse.ok
      && newsImportsBody.includes("TechCrunch")
      && newsImportsBody.includes("Import tech stories")
      && newsImportsBody.includes("Source quality controls")
      && newsImportsBody.includes("Max auto risk")
      && newsImportsBody.includes("pending review"),
    status: newsImportsResponse.status
  });
  const inspectionResponse = await request("/admin/news-imports/inspection", { headers: { cookie } });
  const inspectionBody = await inspectionResponse.text();
  checks.push({
    name: "admin news inspection queue controls",
    ok: inspectionResponse.ok && inspectionBody.includes("Risky imported articles")
      && (inspectionBody.includes("No imported stories are waiting for inspection.") || (inspectionBody.includes("Approve") && inspectionBody.includes("Reject"))),
    status: inspectionResponse.status
  });
  const performanceResponse = await request("/admin/news-imports/performance", { headers: { cookie } });
  const performanceBody = await performanceResponse.text();
  checks.push({
    name: "admin source performance dashboard",
    ok: performanceResponse.ok
      && performanceBody.includes("Imported")
      && performanceBody.includes("Rejected")
      && performanceBody.includes("Pending inspection")
      && performanceBody.includes("Duplicate rate")
      && performanceBody.includes("Average risk"),
    status: performanceResponse.status
  });
  const articleManagerResponse = await request("/admin/articles", { headers: { cookie } });
  const articleManagerBody = await articleManagerResponse.text();
  checks.push({
    name: "admin article manager cms controls",
    ok: articleManagerResponse.ok && articleManagerBody.includes("/duplicate") && articleManagerBody.includes("/delete"),
    status: articleManagerResponse.status
  });
  const articleFormResponse = await request("/admin/articles/new", { headers: { cookie } });
  const articleFormBody = await articleFormResponse.text();
  checks.push({
    name: "admin article form cms controls",
    ok: articleFormResponse.ok
      && articleFormBody.includes("data-autosave-form")
      && articleFormBody.includes("name=\"expiresAt\"")
      && articleFormBody.includes("data-editor-table")
      && articleFormBody.includes("data-editor-poll")
      && articleFormBody.includes("name=\"seoTitle\""),
    status: articleFormResponse.status
  });
  await expectAdmin("/admin/workflow", cookie, "Assignment desk");
  const communityAdminResponse = await request("/admin/community", { headers: { cookie } });
  const communityAdminBody = await communityAdminResponse.text();
  checks.push({
    name: "admin community command center",
    ok: communityAdminResponse.ok &&
      communityAdminBody.includes("Community command center") &&
      communityAdminBody.includes("Moderation intelligence") &&
      communityAdminBody.includes("Reputation leaders") &&
      communityAdminBody.includes("Forum categories") &&
      communityAdminBody.includes("Anti Abuse Throttling Ready"),
    status: communityAdminResponse.status
  });
  const workflowResponse = await request("/admin/workflow?status=all", { headers: { cookie } });
  const workflowBody = await workflowResponse.text();
  const workflowCsrf = extractCsrf(workflowBody);
  const workflowArticleId = workflowBody.match(/name="articleId"><option value="([^"]+)"/)?.[1] || "";
  const workflowUserId = workflowBody.match(/name="assigneeId"><option value="([^"]+)"/)?.[1]
    || workflowBody.match(/name="userId"><option value="([^"]+)"/)?.[1]
    || "";
  checks.push({
    name: "admin workflow operational controls",
    ok: workflowResponse.ok
      && workflowBody.includes("Reporter dashboard")
      && workflowBody.includes("Task management")
      && workflowBody.includes("Shift management")
      && workflowBody.includes("Journalist productivity tracking")
      && workflowBody.includes("sensitivityLevel")
      && Boolean(workflowArticleId)
      && Boolean(workflowUserId),
    status: workflowResponse.status
  });
  if (workflowArticleId && workflowUserId) {
    const workflowStamp = Date.now();
    const assignmentResponse = await request("/admin/workflow/assignments", {
      method: "POST",
      headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        _csrf: workflowCsrf,
        articleId: workflowArticleId,
        assigneeId: workflowUserId,
        priority: "urgent",
        status: "assigned",
        dueAt: "2026-06-24T10:00",
        brief: `Section four assignment ${workflowStamp}`
      })
    });
    checks.push({ name: "admin workflow assignment create", ok: assignmentResponse.ok, status: assignmentResponse.status });
    const approvalResponse = await request("/admin/workflow/approvals", {
      method: "POST",
      headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        _csrf: workflowCsrf,
        articleId: workflowArticleId,
        stage: "legal",
        sensitivityLevel: "sensitive",
        notes: `Section four legal approval ${workflowStamp}`
      })
    });
    checks.push({ name: "admin workflow approval create", ok: approvalResponse.ok, status: approvalResponse.status });
    const calendarResponse = await request("/admin/workflow/calendar", {
      method: "POST",
      headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        _csrf: workflowCsrf,
        title: `Section four calendar ${workflowStamp}`,
        eventType: "legal",
        startsAt: "2026-06-24T11:00",
        endsAt: "2026-06-24T12:00",
        articleId: workflowArticleId,
        ownerId: workflowUserId,
        notes: "Legal and sensitive content review slot."
      })
    });
    checks.push({ name: "admin workflow calendar create", ok: calendarResponse.ok, status: calendarResponse.status });
    const taskResponse = await request("/admin/workflow/tasks", {
      method: "POST",
      headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        _csrf: workflowCsrf,
        title: `Section four task ${workflowStamp}`,
        taskType: "fact_check",
        articleId: workflowArticleId,
        assigneeId: workflowUserId,
        priority: "urgent",
        status: "in_progress",
        dueAt: "2026-06-24T13:00",
        notes: "Fact-checking task for Section 4 workflow."
      })
    });
    checks.push({ name: "admin workflow task create", ok: taskResponse.ok, status: taskResponse.status });
    const shiftResponse = await request("/admin/workflow/shifts", {
      method: "POST",
      headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        _csrf: workflowCsrf,
        userId: workflowUserId,
        shiftRole: "editor",
        startsAt: "2026-06-24T09:00",
        endsAt: "2026-06-24T17:00",
        coverageArea: "Section four smoke desk",
        status: "scheduled",
        notes: "Shift management verification."
      })
    });
    checks.push({ name: "admin workflow shift create", ok: shiftResponse.ok, status: shiftResponse.status });
    const messageResponse = await request("/admin/workflow/messages", {
      method: "POST",
      headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        _csrf: workflowCsrf,
        channel: "legal",
        articleId: workflowArticleId,
        message: `Section four newsroom note ${workflowStamp}`
      })
    });
    checks.push({ name: "admin workflow message create", ok: messageResponse.ok, status: messageResponse.status });
    const workflowOverviewResponse = await request("/api/workflow/overview?status=all", { headers: { cookie } });
    const workflowOverviewJson = await safeJson(workflowOverviewResponse, "/api/workflow/overview");
    checks.push({
      name: "/api/workflow/overview section four",
      ok: workflowOverviewResponse.ok
        && workflowOverviewJson.ok
        && Array.isArray(workflowOverviewJson.workflow?.assignments)
        && Array.isArray(workflowOverviewJson.workflow?.approvals)
        && Array.isArray(workflowOverviewJson.workflow?.calendar)
        && Array.isArray(workflowOverviewJson.workflow?.tasks)
        && Array.isArray(workflowOverviewJson.workflow?.shifts)
        && Array.isArray(workflowOverviewJson.workflow?.messages)
        && workflowOverviewJson.realtime?.transport === "websocket"
        && workflowOverviewJson.realtime?.endpoint === "/api/workflow/realtime"
        && "redisFanoutReady" in workflowOverviewJson.realtime
        && Array.isArray(workflowOverviewJson.workflow?.productivity),
      status: workflowOverviewResponse.status
    });
    const realtimeMessage = `Section four realtime WebSocket ${workflowStamp}`;
    const realtimeResult = await waitForWorkflowSocketEvent(cookie, "workflow.message", () => request("/admin/workflow/messages", {
      method: "POST",
      headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        _csrf: workflowCsrf,
        channel: "editorial",
        articleId: workflowArticleId,
        message: realtimeMessage
      })
    }));
    checks.push({
      name: "admin workflow websocket realtime",
      ok: realtimeResult.ok,
      status: realtimeResult.status
    });
  }
  await expectAdmin("/admin/homepage", cookie, "Homepage controls", { csrf: true });
  await expectAdmin("/admin/breaking-news", cookie, "Breaking news system", { csrf: true });
  await expectAdmin("/admin/live-blogs", cookie, "Live blogging system", { csrf: true });
  const livePageResponse = await request("/admin/live-blogs", { headers: { cookie } });
  const livePageBody = await livePageResponse.text();
  const liveSlug = `section-three-live-${Date.now()}`;
  const createLiveResponse = await request("/admin/live-blogs", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      _csrf: extractCsrf(livePageBody),
      title: "Section Three Live Coverage Smoke",
      slug: liveSlug,
      status: "live",
      coverageMode: "conference",
      autoRefreshSeconds: "8",
      eventDate: "2026-06-24T09:00",
      host: "Smoke newsroom desk",
      coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=82",
      notifyUpdates: "on",
      homepageOverride: "on",
      allowComments: "on",
      description: "Smoke coverage validates live blogging, comments, homepage override, and sync metadata."
    })
  });
  checks.push({
    name: "admin live event create",
    ok: createLiveResponse.ok,
    status: createLiveResponse.status
  });
  const liveListResponse = await request("/api/live-events");
  const liveListJson = await safeJson(liveListResponse, "/api/live-events created");
  const createdLiveEvent = liveListJson.events?.find((event) => event.slug === liveSlug);
  checks.push({
    name: "/api/live-events created event",
    ok: liveListResponse.ok && Boolean(createdLiveEvent?.id) && createdLiveEvent.homepageOverride === true && createdLiveEvent.allowComments === true,
    status: liveListResponse.status
  });
  if (createdLiveEvent?.id) {
    const updateLiveResponse = await request("/admin/live-blogs/updates", {
      method: "POST",
      headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        _csrf: extractCsrf(livePageBody),
        eventId: createdLiveEvent.id,
        updateType: "key_moment",
        sourceUrl: "https://example.com/live-source",
        pinned: "on",
        notifyPush: "on",
        title: "Smoke keynote update",
        body: "A timestamped live update confirms the real-time live feed path."
      })
    });
    checks.push({
      name: "admin live update create",
      ok: updateLiveResponse.ok,
      status: updateLiveResponse.status
    });
    const commentHeaders = reader?.token ? { authorization: `Bearer ${reader.token}` } : {};
    const liveCommentResponse = await request(`/api/live-events/${encodeURIComponent(liveSlug)}/comments`, {
      method: "POST",
      headers: { "content-type": "application/json", ...commentHeaders },
      body: JSON.stringify({ name: "Live Smoke Reader", email: readerEmail, body: "Live event commenting is working." })
    });
    const liveCommentJson = await safeJson(liveCommentResponse, "/api/live-events comments");
    checks.push({
      name: "/api/live-events comments",
      ok: liveCommentResponse.ok && liveCommentJson.ok && Boolean(liveCommentJson.comment?.id),
      status: liveCommentResponse.status
    });
    const liveDetailResponse = await request(`/api/live-events/${encodeURIComponent(liveSlug)}`);
    const liveDetailJson = await safeJson(liveDetailResponse, "/api/live-events detail");
    checks.push({
      name: "/api/live-events detail sync",
      ok: liveDetailResponse.ok
        && liveDetailJson.ok
        && liveDetailJson.event?.updates?.some((update) => update.title === "Smoke keynote update")
        && liveDetailJson.event?.comments?.some((comment) => comment.body === "Live event commenting is working.")
        && liveDetailJson.event?.sync?.realtime === true
        && liveDetailJson.event?.sync?.autoRefreshSeconds === 8,
      status: liveDetailResponse.status
    });
  }
  await expectAdmin("/admin/videos", cookie, "Videos, playlists, SEO, transcripts", { csrf: true });
  await expectAdmin("/admin/podcasts", cookie, "Shows, episodes, audio, RSS", { csrf: true });
  await expectAdmin("/admin/reviews", cookie, "Product review and comparison command center", { csrf: true });
  await expectAdmin("/admin/devices", cookie, "Device directory and comparison command center", { csrf: true });
  await expectAdmin("/admin/ai-assistant", cookie, "Advanced AI newsroom assistant", { csrf: true });
  await expectAdmin("/admin/site-cms", cookie, "Brand, theme, banners, homepage controls", { csrf: true });
  await expectAdmin("/admin/monetization", cookie, "Monetization dashboard", { csrf: true });
  await expectAdmin("/admin/media", cookie, "CDN & media optimization", { csrf: true });
  await expectAdmin("/admin/ads", cookie, "Ad placements", { csrf: true });
  await expectAdmin("/admin/affiliates", cookie, "Affiliate links", { csrf: true });
  await expectAdmin("/admin/memberships", cookie, "Membership plans");
  await expectAdmin("/admin/events", cookie, "Event, RSVP, and live conference command center", { csrf: true });
  await expectAdmin("/admin/jobs", cookie, "Job board, recruiters, applications, and salary intelligence", { csrf: true });
  await expectAdmin("/admin/startups", cookie, "Startup directory", { csrf: true });
  await expectAdmin("/admin/directory", cookie, "Podcasts, jobs, events, marketplace", { csrf: true });
  await expectAdmin("/admin/community", cookie, "Social, forums, polls, reputation", { csrf: true });
  await expectAdmin("/admin/backup", cookie, "Create backup/export", { csrf: true });
  await expectAdmin("/admin/categories", cookie, "Category manager", { csrf: true });
  await expectAdmin("/admin/tags", cookie, "Tag manager", { csrf: true });
  await expectAdmin("/admin/users", cookie, "Create newsroom account", { csrf: true });
  await expectAdmin("/admin/roles", cookie, "Roles and privileges", { csrf: true });
  const rolesPageResponse = await request("/admin/roles", { headers: { cookie } });
  const rolesPageBody = await rolesPageResponse.text();
  const roleParams = new URLSearchParams({
    _csrf: extractCsrf(rolesPageBody),
    name: `Smoke Role ${Date.now()}`
  });
  roleParams.append("permissions", "articles");
  roleParams.append("permissions", "comments");
  const createRoleResponse = await request("/admin/roles", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: roleParams
  });
  const createRoleBody = await createRoleResponse.text();
  checks.push({
    name: "admin role creation with multiple privileges",
    ok: createRoleResponse.ok && createRoleBody.includes("Role saved.") && createRoleBody.includes("Articles and CMS") && createRoleBody.includes("Moderation"),
    status: createRoleResponse.status
  });
  const duplicateRoleParams = new URLSearchParams({
    _csrf: extractCsrf(rolesPageBody),
    name: "Writer"
  });
  duplicateRoleParams.append("permissions", "articles");
  const duplicateRoleResponse = await request("/admin/roles", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: duplicateRoleParams
  });
  const duplicateRoleBody = await duplicateRoleResponse.text();
  checks.push({
    name: "admin duplicate role name handled",
    ok: duplicateRoleResponse.ok && duplicateRoleBody.includes("A role named &quot;Writer&quot; already exists."),
    status: duplicateRoleResponse.status
  });
  await expectAdmin("/admin/analytics", cookie, "Tracked page views");
  await expectAdmin("/admin/retention", cookie, "Gamification & retention");
  await expectAdmin("/admin/seo", cookie, "Google News, schema, scoring");
  await expectAdmin("/admin/languages", cookie, "Globalization command center", { csrf: true });
  await expectAdmin("/admin/api", cookie, "API and integration command center", { csrf: true });
  await expectAdmin("/admin/future", cookie, "Future ecosystem command center");
  await expectAdmin("/admin/infrastructure", cookie, "Enterprise scalability command center");
  await expectAdmin("/admin/database", cookie, "SQLite to PostgreSQL path");
  await expectAdmin("/admin/launch", cookie, "Deployment readiness");
  await expectAdmin("/admin/operations", cookie, "Administration and operations command center", { csrf: true });
  await expectAdmin("/admin/newsletter/campaigns", cookie, "Newsletter campaigns", { csrf: true });
  const newsletterCampaignsResponse = await request("/admin/newsletter/campaigns", { headers: { cookie } });
  const newsletterCampaignsBody = await newsletterCampaignsResponse.text();
  checks.push({
    name: "admin newsletter marketing command center",
    ok: newsletterCampaignsResponse.ok &&
      newsletterCampaignsBody.includes("Newsletter marketing command center") &&
      newsletterCampaignsBody.includes("Double opt-in") &&
      newsletterCampaignsBody.includes("A/B variant") &&
      newsletterCampaignsBody.includes("Automated workflows") &&
      newsletterCampaignsBody.includes("Campaign performance"),
    status: newsletterCampaignsResponse.status
  });
  await expectAdmin("/admin/notifications", cookie, "Notification center", { csrf: true });
  await expectAdmin("/admin/email-outbox", cookie, "Email outbox");
  await expectAdmin("/admin/security", cookie, "Security and compliance command center", { csrf: true });
  const securityPageResponse = await request("/admin/security", { headers: { cookie } });
  const securityPageBody = await securityPageResponse.text();
  checks.push({
    name: "admin security compliance command center",
    ok: securityPageResponse.ok
      && securityPageBody.includes("Section 22 readiness matrix")
      && securityPageBody.includes("Security workflow")
      && securityPageBody.includes("DDoS application throttling")
      && securityPageBody.includes("Admin sessions and devices")
      && securityPageBody.includes("Mobile device tracking")
      && securityPageBody.includes("Consent ledger"),
    status: securityPageResponse.status
  });
  const analyticsResponse = await request("/api/analytics/summary", { headers: { cookie } });
  const analyticsJson = await safeJson(analyticsResponse, "/api/analytics/summary");
  checks.push({
    name: "/api/analytics/summary",
    ok: analyticsResponse.ok
      && analyticsJson.ok
      && typeof analyticsJson.analytics?.avgScrollDepth === "number"
      && Array.isArray(analyticsJson.analytics?.authorPerformance)
      && Array.isArray(analyticsJson.analytics?.deviceAnalytics)
      && Array.isArray(analyticsJson.analytics?.geoAnalytics)
      && Array.isArray(analyticsJson.analytics?.heatmap)
      && Boolean(analyticsJson.analytics?.subscriberAnalytics),
    status: analyticsResponse.status
  });
  const biResponse = await request("/api/analytics/business-intelligence", { headers: { cookie } });
  const biJson = await safeJson(biResponse, "/api/analytics/business-intelligence");
  checks.push({
    name: "/api/analytics/business-intelligence",
    ok: biResponse.ok
      && biJson.ok
      && Array.isArray(biJson.intelligence?.traffic?.hourlyHeatmap)
      && Array.isArray(biJson.intelligence?.traffic?.devices)
      && Array.isArray(biJson.intelligence?.traffic?.geo)
      && Array.isArray(biJson.intelligence?.content?.predictions)
      && Array.isArray(biJson.intelligence?.audience?.readerFunnel)
      && biJson.intelligence?.readiness?.predictiveAnalyticsReady === true,
    status: biResponse.status
  });
  const analyticsIntegrationsResponse = await request("/api/analytics/integrations", { headers: { cookie } });
  const analyticsIntegrationsJson = await safeJson(analyticsIntegrationsResponse, "/api/analytics/integrations");
  checks.push({
    name: "/api/analytics/integrations",
    ok: analyticsIntegrationsResponse.ok && analyticsIntegrationsJson.ok && Array.isArray(analyticsIntegrationsJson.integrations?.activeProviders) && typeof analyticsIntegrationsJson.integrations?.googleAnalytics?.enabled === "boolean",
    status: analyticsIntegrationsResponse.status
  });
  const seoResponse = await request("/api/seo/summary", { headers: { cookie } });
  const seoJson = await safeJson(seoResponse, "/api/seo/summary");
  checks.push({
    name: "/api/seo/summary",
    ok: seoResponse.ok
      && seoJson.ok
      && typeof seoJson.seo?.averageScore === "number"
      && seoJson.seo?.schemaTypes?.includes("NewsArticle")
      && seoJson.seo?.schemaTypes?.includes("VideoObject")
      && seoJson.seo?.schemaTypes?.includes("PodcastEpisode")
      && seoJson.seo?.sitemaps?.videos >= 1
      && seoJson.seo?.sitemaps?.podcasts >= 1
      && seoJson.seo?.validation?.schemaResults?.some((item) => item.type === "video" && item.valid),
    status: seoResponse.status
  });
  await expectPostJson("/api/ai/automation/article/ai-agents-newsroom-workflows", {}, (json) => json.ok && json.output?.suggestedTags?.length > 0, { headers: { cookie } });
  await expectJson("/api/ai/automation/summary", (json) => json.ok && json.automation?.capabilities?.summarization === true && Array.isArray(json.automation?.jobs), { headers: { cookie } });
  await expectPostJson("/api/seo/queue-indexing", { itemType: "article", itemSlug: "ai-agents-newsroom-workflows", provider: "google-indexing-ready" }, (json) => json.ok && Boolean(json.id), { headers: { cookie } });
  await expectPostJson("/api/seo/internal-links/ai-agents-newsroom-workflows/approvals", {}, (json) => json.ok && Array.isArray(json.suggestions), { headers: { cookie } });
  await expectJson("/api/community/operations", (json) => json.ok && json.community?.controls?.moderatorQueuesReady === true && json.community?.categories?.length >= 1, { headers: { cookie } });
  await expectJson("/api/newsletter/marketing", (json) => json.ok && json.newsletter?.automations?.length >= 1 && json.newsletter?.capabilities?.doubleOptIn === true, { headers: { cookie } });
  const reviewsDashboardResponse = await request("/api/reviews/dashboard", { headers: { cookie } });
  const reviewsDashboardJson = await safeJson(reviewsDashboardResponse, "/api/reviews/dashboard");
  checks.push({
    name: "/api/reviews/dashboard",
    ok: reviewsDashboardResponse.ok
      && reviewsDashboardJson.ok
      && reviewsDashboardJson.dashboard?.controls?.ratingSystemReady === true
      && reviewsDashboardJson.dashboard?.workflow?.length >= 4,
    status: reviewsDashboardResponse.status
  });
  const reviewsPageResponse = await request("/admin/reviews", { headers: { cookie } });
  const reviewsPageBody = await reviewsPageResponse.text();
  checks.push({
    name: "admin review command center UI",
    ok: reviewsPageResponse.ok
      && reviewsPageBody.includes("Product review and comparison command center")
      && reviewsPageBody.includes("Review workflow")
      && reviewsPageBody.includes("Readiness and compliance"),
    status: reviewsPageResponse.status
  });
  const reviewStamp = Date.now();
  const createReviewResponse = await request("/admin/reviews", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      _csrf: extractCsrf(reviewsPageBody),
      productName: `Smoke Review Product ${reviewStamp}`,
      slug: `smoke-review-product-${reviewStamp}`,
      brand: "Smoke Labs",
      productCategory: "hardware",
      productUrl: "https://example.com/smoke-review-product",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82",
      rating: "8.7",
      scoreLabel: "Smoke Tested",
      status: "published",
      pros: "Clear benchmark evidence\nStrong value for testing",
      cons: "Smoke-only product\nNeeds production provenance",
      specs: "Chip: Smoke X1\nDisplay: 14 inch test panel\nBattery: 70 Wh",
      benchmarks: "Battery Loop | 12.5 | hours | Smoke QA run\nAI Local Inference | 55 | tokens/s | Smoke QA run",
      comparisons: "Best alternative: Nova X1 Pro\nValue note: Strong smoke-test score",
      verdict: "This smoke review confirms the review engine can publish a structured product verdict with specs, benchmarks, comparison notes, and an affiliate-ready product URL."
    })
  });
  const createReviewBody = await createReviewResponse.text();
  checks.push({ name: "admin product review create", ok: createReviewResponse.ok && createReviewBody.includes("Product review saved."), status: createReviewResponse.status });
  await expectJson(`/api/reviews/smoke-review-product-${reviewStamp}`, (json) => json.ok && json.review?.benchmarks?.length >= 2 && json.review?.pros?.length >= 2);
  await expectJson(`/api/reviews/compare?slugs=smoke-review-product-${reviewStamp},nova-x1-pro-review`, (json) => json.ok && json.comparison?.reviews?.length === 2 && json.comparison?.affiliateReady?.some((item) => item.ready === true));
  const revenueResponse = await request("/api/monetization/summary", { headers: { cookie } });
  const revenueJson = await safeJson(revenueResponse, "/api/monetization/summary");
  checks.push({
    name: "/api/monetization/summary",
    ok: revenueResponse.ok && revenueJson.ok && typeof revenueJson.summary?.adImpressions === "number",
    status: revenueResponse.status
  });
  const monetizationOperationsResponse = await request("/api/monetization/operations", { headers: { cookie } });
  const monetizationOperationsJson = await safeJson(monetizationOperationsResponse, "/api/monetization/operations");
  checks.push({
    name: "/api/monetization/operations",
    ok: monetizationOperationsResponse.ok
      && monetizationOperationsJson.ok
      && monetizationOperationsJson.monetization?.summary?.videoAds?.length >= 1
      && monetizationOperationsJson.monetization?.affiliates?.productReviewIntegrationReady === true
      && monetizationOperationsJson.monetization?.readiness?.some((item) => item.label === "Payment gateway" && item.status === "pending"),
    status: monetizationOperationsResponse.status
  });
  const monetizationPageResponse = await request("/admin/monetization", { headers: { cookie } });
  const monetizationPageBody = await monetizationPageResponse.text();
  checks.push({
    name: "admin monetization revenue journey UI",
    ok: monetizationPageResponse.ok
      && monetizationPageBody.includes("Revenue journey")
      && monetizationPageBody.includes("Video ad slots")
      && monetizationPageBody.includes("Monetization and revenue command center")
      && monetizationPageBody.includes("Payment gateway required")
      && monetizationPageBody.includes("Commercial readiness matrix"),
    status: monetizationPageResponse.status
  });
  const sponsorResponse = await request("/admin/monetization/sponsors", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      _csrf: extractCsrf(monetizationPageBody),
      name: `Smoke sponsor campaign ${Date.now()}`,
      sponsor: "Smoke Sponsor",
      budgetCents: "250000",
      status: "active",
      notes: "Smoke sponsor campaign for monetization QA."
    })
  });
  checks.push({ name: "admin monetization sponsor create", ok: sponsorResponse.ok, status: sponsorResponse.status });
  const manualRevenueResponse = await request("/admin/monetization/revenue", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      _csrf: extractCsrf(monetizationPageBody),
      source: "manual",
      amountCents: "12500",
      currency: "USD",
      description: "Smoke manual revenue event"
    })
  });
  checks.push({ name: "admin monetization manual revenue create", ok: manualRevenueResponse.ok, status: manualRevenueResponse.status });
  const videoAdResponse = await request("/admin/monetization/video-ads", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      _csrf: extractCsrf(monetizationPageBody),
      placementKey: "video-smoke-preroll",
      label: `Smoke video ad ${Date.now()}`,
      adType: "pre-roll",
      cpmCents: "1850",
      status: "active",
      sponsor: "Smoke Sponsor",
      geoTargets: "US,LB"
    })
  });
  checks.push({ name: "admin monetization video ad create", ok: videoAdResponse.ok, status: videoAdResponse.status });
  const retentionResponse = await request("/api/retention/summary", { headers: { cookie } });
  const retentionJson = await safeJson(retentionResponse, "/api/retention/summary");
  checks.push({
    name: "/api/retention/summary",
    ok: retentionResponse.ok && retentionJson.ok && Array.isArray(retentionJson.retention?.leaderboard),
    status: retentionResponse.status
  });
  const operationsResponse = await request("/api/operations/summary", { headers: { cookie } });
  const operationsJson = await safeJson(operationsResponse, "/api/operations/summary");
  checks.push({
    name: "/api/operations/summary",
    ok: operationsResponse.ok
      && operationsJson.ok
      && Array.isArray(operationsJson.operations?.features)
      && Array.isArray(operationsJson.operations?.readiness)
      && operationsJson.operations.readiness.some((item) => item.id === "cache_management" && item.ready === true)
      && operationsJson.operations.readiness.some((item) => item.id === "deployment_controls" && item.ready === true)
      && operationsJson.operations.readiness.some((item) => item.id === "cdn_management")
      && operationsJson.operations?.server?.nodeVersion
      && operationsJson.operations?.deployment?.deploymentControlsReady === true
      && operationsJson.operations?.cdn?.provider
      && Array.isArray(operationsJson.operations?.auditTrail)
      && Array.isArray(operationsJson.operations?.errorLogs)
      && typeof operationsJson.uptimeSeconds === "number",
    status: operationsResponse.status
  });
  const infrastructureResponse = await request("/api/infrastructure/summary", { headers: { cookie } });
  const infrastructureJson = await safeJson(infrastructureResponse, "/api/infrastructure/summary");
  checks.push({
    name: "/api/infrastructure/summary",
    ok: infrastructureResponse.ok
      && infrastructureJson.ok
      && infrastructureJson.infrastructure?.containers?.dockerCompose === true
      && typeof infrastructureJson.infrastructure?.scaling?.queueWorkerReady === "boolean"
      && Array.isArray(infrastructureJson.infrastructure?.readinessMatrix)
      && infrastructureJson.infrastructure.readinessMatrix.some((item) => item.id === "microservices_architecture" && item.ready === true)
      && infrastructureJson.infrastructure.readinessMatrix.some((item) => item.id === "docker_containers" && item.ready === true)
      && infrastructureJson.infrastructure.readinessMatrix.some((item) => item.id === "kubernetes_orchestration" && item.ready === true)
      && infrastructureJson.infrastructure.readinessMatrix.some((item) => item.id === "redis_caching")
      && infrastructureJson.infrastructure.readinessMatrix.some((item) => item.id === "postgresql_setup")
      && infrastructureJson.infrastructure.readinessMatrix.some((item) => item.id === "queue_systems" && item.ready === true)
      && infrastructureJson.infrastructure.readinessMatrix.some((item) => item.id === "cdn_acceleration")
      && infrastructureJson.infrastructure.readinessMatrix.some((item) => item.id === "horizontal_scaling")
      && infrastructureJson.infrastructure.readinessMatrix.some((item) => item.id === "multi_region_deployment")
      && infrastructureJson.infrastructure.readinessMatrix.some((item) => item.id === "disaster_recovery" && item.ready === true)
      && Array.isArray(infrastructureJson.infrastructure?.serviceBoundaries)
      && Array.isArray(infrastructureJson.infrastructure?.deploymentPath),
    status: infrastructureResponse.status
  });
  const sectionsResponse = await request("/api/platform/sections-16-26", { headers: { cookie } });
  const sectionsJson = await safeJson(sectionsResponse, "/api/platform/sections-16-26");
  checks.push({
    name: "/api/platform/sections-16-26",
    ok: sectionsResponse.ok && sectionsJson.ok && sectionsJson.sections?.section25FutureExpansion?.total >= 1 && sectionsJson.sections?.section26Infrastructure?.queueWorkerReady === true,
    status: sectionsResponse.status
  });
  const launchResponse = await request("/api/launch/readiness", { headers: { cookie } });
  const launchJson = await safeJson(launchResponse, "/api/launch/readiness");
  checks.push({
    name: "/api/launch/readiness",
    ok: launchResponse.ok && launchJson.ok && typeof launchJson.readiness?.score === "number" && Array.isArray(launchJson.readiness?.checks),
    status: launchResponse.status
  });
  const databaseStatusResponse = await request("/api/database/status", { headers: { cookie } });
  const databaseStatusJson = await safeJson(databaseStatusResponse, "/api/database/status");
  checks.push({
    name: "/api/database/status",
    ok: databaseStatusResponse.ok && databaseStatusJson.ok && databaseStatusJson.database?.activeClient === "sqlite" && Array.isArray(databaseStatusJson.database?.nextSteps),
    status: databaseStatusResponse.status
  });
  const emailStatusResponse = await request("/api/email/status", { headers: { cookie } });
  const emailStatusJson = await safeJson(emailStatusResponse, "/api/email/status");
  checks.push({
    name: "/api/email/status",
    ok: emailStatusResponse.ok && emailStatusJson.ok && Array.isArray(emailStatusJson.provider?.supported) && typeof emailStatusJson.delivery?.counts === "object",
    status: emailStatusResponse.status
  });
  const pushStatusResponse = await request("/api/push/status", { headers: { cookie } });
  const pushStatusJson = await safeJson(pushStatusResponse, "/api/push/status");
  checks.push({
    name: "/api/push/status",
    ok: pushStatusResponse.ok && pushStatusJson.ok && pushStatusJson.provider?.provider === "firebase" && typeof pushStatusJson.provider?.serverPushReady === "boolean",
    status: pushStatusResponse.status
  });
  const outboxPageResponse = await request("/admin/email-outbox", { headers: { cookie } });
  const outboxPageBody = await outboxPageResponse.text();
  const testEmailResponse = await request("/admin/email-outbox/test", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      _csrf: extractCsrf(outboxPageBody),
      to: `email-smoke-${Date.now()}@example.com`
    })
  });
  const testEmailBody = await testEmailResponse.text();
  checks.push({
    name: "admin email test queue",
    ok: testEmailResponse.ok && testEmailBody.includes("Tech Magazine email delivery test"),
    status: testEmailResponse.status
  });
  const securityResponse = await request("/api/security/summary", { headers: { cookie } });
  const securityJson = await safeJson(securityResponse, "/api/security/summary");
  checks.push({
    name: "/api/security/summary",
    ok: securityResponse.ok
      && securityJson.ok
      && securityJson.security?.wafEnabled === true
      && Array.isArray(securityJson.security?.recentEvents)
      && Array.isArray(securityJson.security?.securityReadiness)
      && securityJson.security.securityReadiness.some((item) => item.id === "ddos_protection" && item.ready === true)
      && securityJson.security.securityReadiness.some((item) => item.id === "waf_firewall")
      && securityJson.security.securityReadiness.some((item) => item.id === "csrf_protection")
      && securityJson.security.securityReadiness.some((item) => item.id === "xss_prevention")
      && securityJson.security.securityReadiness.some((item) => item.id === "rate_limiting")
      && securityJson.security.securityReadiness.some((item) => item.id === "login_protection")
      && securityJson.security.securityReadiness.some((item) => item.id === "role_based_security")
      && securityJson.security.securityReadiness.some((item) => item.id === "audit_logging")
      && securityJson.security.securityReadiness.some((item) => item.id === "content_backups")
      && securityJson.security.securityReadiness.some((item) => item.id === "disaster_recovery")
      && securityJson.security.securityReadiness.some((item) => item.id === "gdpr_compliance")
      && securityJson.security.securityReadiness.some((item) => item.id === "cookie_consent")
      && securityJson.security.securityReadiness.some((item) => item.id === "anti_spam_ai")
      && securityJson.security.securityReadiness.some((item) => item.id === "device_session_tracking")
      && Array.isArray(securityJson.security?.activeAdminSessions)
      && Array.isArray(securityJson.security?.activeReaderSessions)
      && Array.isArray(securityJson.security?.mobileDevices),
    status: securityResponse.status
  });
  const complianceResponse = await request("/api/compliance/summary", { headers: { cookie } });
  const complianceJson = await safeJson(complianceResponse, "/api/compliance/summary");
  checks.push({
    name: "/api/compliance/summary",
    ok: complianceResponse.ok && complianceJson.ok && complianceJson.compliance?.privacy?.cookieConsentReady === true && Array.isArray(complianceJson.compliance?.policies) && Array.isArray(complianceJson.compliance?.readiness),
    status: complianceResponse.status
  });
  const mediaPageResponse = await request("/admin/media", { headers: { cookie } });
  const mediaPageBody = await mediaPageResponse.text();
  const variantsResponse = await request("/admin/media/variants/rebuild", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ _csrf: extractCsrf(mediaPageBody) })
  });
  checks.push({
    name: "admin media variants rebuild",
    ok: variantsResponse.ok,
    status: variantsResponse.status
  });
  const apiPageResponse = await request("/admin/api", { headers: { cookie } });
  const apiPageBody = await apiPageResponse.text();
  const createWebhookResponse = await request("/admin/api/webhooks", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      _csrf: extractCsrf(apiPageBody),
      name: `Smoke Webhook ${Date.now()}`,
      targetUrl: "https://example.com/webhook",
      events: "article.published,breaking.created",
      secretHint: "smoke",
      status: "active"
    })
  });
  checks.push({
    name: "admin api webhook create",
    ok: createWebhookResponse.ok,
    status: createWebhookResponse.status
  });
  const integrationsResponse = await request("/api/integrations/summary", { headers: { cookie } });
  const integrationsJson = await safeJson(integrationsResponse, "/api/integrations/summary");
  checks.push({
    name: "/api/integrations/summary",
    ok: integrationsResponse.ok
      && integrationsJson.ok
      && Array.isArray(integrationsJson.integrations?.webhooks)
      && integrationsJson.integrations?.feeds?.openapi === "/api/v1/openapi.json"
      && Array.isArray(integrationsJson.integrations?.readiness)
      && integrationsJson.integrations.readiness.some((item) => item.id === "rest_api" && item.ready === true)
      && integrationsJson.integrations.readiness.some((item) => item.id === "graphql_api" && item.ready === true)
      && integrationsJson.integrations.readiness.some((item) => item.id === "mobile_api" && item.ready === true)
      && integrationsJson.integrations.readiness.some((item) => item.id === "webhooks" && item.ready === true)
      && integrationsJson.integrations.readiness.some((item) => item.id === "oauth_authentication")
      && integrationsJson.integrations.readiness.some((item) => item.id === "rss_feeds" && item.ready === true)
      && integrationsJson.integrations.readiness.some((item) => item.id === "news_syndication" && item.ready === true)
      && integrationsJson.integrations.readiness.some((item) => item.id === "public_developer_api" && item.ready === true)
      && integrationsJson.integrations.readiness.some((item) => item.id === "social_media_integrations" && item.ready === true)
      && Array.isArray(integrationsJson.integrations?.restEndpoints)
      && integrationsJson.integrations?.mobileApi?.readyForNativeApps === true
      && Array.isArray(integrationsJson.integrations?.socialIntegrations),
    status: integrationsResponse.status
  });
  const globalizationResponse = await request("/api/globalization/summary", { headers: { cookie } });
  const globalizationJson = await safeJson(globalizationResponse, "/api/globalization/summary");
  checks.push({
    name: "/api/globalization/summary",
    ok: globalizationResponse.ok
      && globalizationJson.ok
      && globalizationJson.globalization?.stats?.enabledLanguages >= 2
      && globalizationJson.globalization?.stats?.rtlLanguages >= 1
      && globalizationJson.globalization?.localizedSeo?.hreflangReady === true
      && globalizationJson.globalization?.localizedSeo?.schemaReady === true
      && Array.isArray(globalizationJson.globalization?.countryEditions)
      && globalizationJson.globalization.countryEditions.length >= 4
      && Array.isArray(globalizationJson.globalization?.regionalTargeting)
      && globalizationJson.globalization.regionalTargeting.length >= 4
      && Array.isArray(globalizationJson.globalization?.timezones)
      && globalizationJson.globalization.timezones.length >= 4
      && Array.isArray(globalizationJson.globalization?.currencies)
      && globalizationJson.globalization.currencies.length >= 4
      && Array.isArray(globalizationJson.globalization?.readiness)
      && globalizationJson.globalization.readiness.some((item) => item.id === "rtl_ltr_support" && item.ready === true)
      && globalizationJson.globalization.readiness.some((item) => item.id === "language_switching" && item.ready === true)
      && globalizationJson.globalization.readiness.some((item) => item.id === "translation_workflows" && item.ready === true)
      && globalizationJson.globalization.readiness.some((item) => item.id === "localized_seo" && item.ready === true)
      && globalizationJson.globalization.readiness.some((item) => item.id === "regional_content_targeting" && item.ready === true)
      && globalizationJson.globalization.readiness.some((item) => item.id === "country_editions" && item.ready === true)
      && globalizationJson.globalization.readiness.some((item) => item.id === "timezone_management" && item.ready === true)
      && globalizationJson.globalization.readiness.some((item) => item.id === "multi_currency_support" && item.ready === true),
    status: globalizationResponse.status
  });
  const createApiKeyResponse = await request("/admin/api/keys", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      _csrf: extractCsrf(apiPageBody),
      name: `Smoke Partner ${Date.now()}`,
      scopes: "news:read,articles:read,media:read,mobile:read,syndication:read",
      rateLimitPerMinute: "120",
      status: "active"
    })
  });
  const apiKeyBody = await createApiKeyResponse.text();
  const partnerKey = apiKeyBody.match(/tmk_[a-f0-9]+/)?.[0] || "";
  checks.push({
    name: "admin api key create",
    ok: createApiKeyResponse.ok && Boolean(partnerKey),
    status: createApiKeyResponse.status
  });
  if (partnerKey) {
    const partnerNewsResponse = await request("/api/v1/news?limit=3&category=ai", { headers: { authorization: `Bearer ${partnerKey}` } });
    const partnerNewsJson = await safeJson(partnerNewsResponse, "/api/v1/news partner");
    checks.push({
      name: "/api/v1/news partner",
      ok: partnerNewsResponse.ok && partnerNewsJson.ok && partnerNewsJson.data?.length > 0 && partnerNewsJson.data.every((article) => article.slug && article.title && article.apiUrl),
      status: partnerNewsResponse.status
    });
    const partnerArticleResponse = await request("/api/v1/articles/ai-agents-newsroom-workflows", { headers: { "x-api-key": partnerKey } });
    const partnerArticleJson = await safeJson(partnerArticleResponse, "/api/v1/articles partner");
    checks.push({
      name: "/api/v1/articles partner",
      ok: partnerArticleResponse.ok && partnerArticleJson.ok && partnerArticleJson.article?.slug === "ai-agents-newsroom-workflows",
      status: partnerArticleResponse.status
    });
    const partnerMediaResponse = await request("/api/v1/media", { headers: { authorization: `Bearer ${partnerKey}` } });
    const partnerMediaJson = await safeJson(partnerMediaResponse, "/api/v1/media partner");
    checks.push({
      name: "/api/v1/media partner",
      ok: partnerMediaResponse.ok && partnerMediaJson.ok && typeof partnerMediaJson.media?.totals?.assets === "number",
      status: partnerMediaResponse.status
    });
    const partnerMobileResponse = await request("/api/v1/mobile/config", { headers: { authorization: `Bearer ${partnerKey}` } });
    const partnerMobileJson = await safeJson(partnerMobileResponse, "/api/v1/mobile/config partner");
    checks.push({
      name: "/api/v1/mobile/config partner",
      ok: partnerMobileResponse.ok && partnerMobileJson.ok && partnerMobileJson.mobile?.config?.sync?.readyForNativeApps === true && Array.isArray(partnerMobileJson.mobile?.widgets?.widgets?.trending),
      status: partnerMobileResponse.status
    });
  }
  const baseArticleResponse = await request("/api/articles/ai-agents-newsroom-workflows");
  const baseArticleJson = await safeJson(baseArticleResponse, "/api/articles/ai-agents-newsroom-workflows");
  const languagesResponse = await request("/admin/languages", { headers: { cookie } });
  const languagesBody = await languagesResponse.text();
  const translationResponse = await request("/admin/languages/translations", {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      _csrf: extractCsrf(languagesBody),
      articleId: baseArticleJson.article?.id || "",
      languageCode: "ar",
      title: "AI Agents Arabic Smoke",
      slug: "ai-agents-newsroom-workflows-ar",
      status: "published",
      seoTitle: "AI Agents Arabic Smoke",
      seoDescription: "Localized article smoke check for the multi-language system.",
      subtitle: "Localized editorial workflow verification.",
      body: "Localized paragraph one for the Arabic article.\n\nLocalized paragraph two for the reader API."
    })
  });
  checks.push({
    name: "admin translation save",
    ok: translationResponse.ok,
    status: translationResponse.status
  });
  await expectJson("/api/articles/ai-agents-newsroom-workflows?lang=ar", (json) => json.ok && json.article?.translated === true && json.article?.language === "ar");
}

const failed = checks.filter((check) => !check.ok);
if (process.env.SMOKE_KEEP_QA_DATA !== "true") cleanupQaData({ log: false });

for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} ${check.status} ${check.name}`);
}

if (failed.length) {
  console.error(`\n${failed.length} smoke checks failed.`);
  process.exit(1);
}

console.log(`\nAll ${checks.length} smoke checks passed.`);
