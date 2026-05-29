import { cleanupQaData } from "./qa-cleanup.js";
import { getQaAdminCredentials, hasKnownCredentialLeak, hasSecretTokenLeak } from "./qa-credentials.js";

const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const stamp = Date.now();
const checks = [];

function add(group, name, ok, detail = "", status = "") {
  checks.push({ group, name, ok: Boolean(ok), detail, status });
}

async function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, { redirect: "manual", ...options });
}

async function text(path, options = {}) {
  const response = await request(path, options);
  return { response, body: await response.text() };
}

async function json(path, options = {}) {
  const response = await request(path, options);
  const body = await response.text();
  try {
    return { response, data: JSON.parse(body) };
  } catch {
    return { response, data: null, body };
  }
}

async function postJson(group, path, payload, predicate, headers = {}) {
  const { response, data } = await json(path, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(payload)
  });
  add(group, `POST ${path}`, response.ok && predicate(data || {}), data?.message || "", response.status);
  return data || {};
}

async function getJson(group, path, predicate, headers = {}) {
  const { response, data } = await json(path, { headers });
  add(group, `GET ${path}`, response.ok && predicate(data || {}), data?.message || "", response.status);
  return data || {};
}

function extractCsrf(body) {
  return body.match(/name="_csrf" value="([^"]+)"/)?.[1] || "";
}

function extractLinks(body) {
  return [...body.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((match) => match[1]);
}

function extractForms(body) {
  return [...body.matchAll(/<form\b([^>]*)>/gi)].map((match) => {
    const attrs = match[1];
    return {
      method: (attrs.match(/method="([^"]+)"/i)?.[1] || "get").toLowerCase(),
      action: attrs.match(/action="([^"]+)"/i)?.[1] || ""
    };
  });
}

async function loginAdmin() {
  const credentials = getQaAdminCredentials();
  const response = await request("/admin/login", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email: credentials.email, password: credentials.password })
  });
  const cookie = response.headers.get("set-cookie")?.split(";")[0] || "";
  add("admin", "admin sign-in works", response.status === 302 && Boolean(cookie), "", response.status);
  return cookie;
}

async function postForm(group, path, cookie, fields, predicate = (body, response) => response.ok) {
  const response = await request(path, {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: fields
  });
  const body = await response.text();
  add(group, `POST ${path}`, predicate(body, response), "", response.status);
  return { response, body };
}

async function runClientAudit() {
  const home = await text("/");
  add("client", "public shell loads", home.response.ok && home.body.includes("Tech Magazine") && home.body.includes('id="app"'), "", home.response.status);
  add("client", "public shell has no /admin links", !extractLinks(home.body).some((link) => link.startsWith("/admin") || link.includes("#/admin")), "", home.response.status);
  add("client", "public shell has no admin preview", !/admin-preview|Admin preview|renderAdminPreview/i.test(home.body), "", home.response.status);

  for (const asset of ["/styles.css?v=55", "/app.js?v=55", "/assets/logo.svg"]) {
    const assetResponse = await request(asset);
    add("client", `asset ${asset} loads`, assetResponse.ok, "", assetResponse.status);
  }

  const appSource = await text("/app.js?v=55");
  const requiredRoutes = [
    "renderHome", "renderArticle", "renderCategory", "renderSearch", "renderAuthor", "renderAccount",
    "renderMembership", "renderAdvertiseExperience", "renderTrustCenterExperience", "renderCommunity", "renderNotifications", "renderBreakingNews", "renderLiveEvents",
    "renderVideos", "renderPodcasts", "renderReviews", "renderReviewComparison", "renderJobs", "renderStartups", "renderDevices",
    "renderEvents", "renderSectionsHub", "renderMobileExperience", "renderStaticPage"
  ];
  for (const route of requiredRoutes) {
    add("client", `client route renderer ${route}`, appSource.body.includes(`function ${route}`));
  }
  add("client", "client app source has no admin preview route", !/admin-preview|renderAdminPreview/i.test(appSource.body));

  await getJson("client", "/api/bootstrap", (data) => data.articles?.length > 0 && data.categories?.length > 0 && data.siteSettings?.brandName === "Tech Magazine");
  await getJson("client", "/api/articles/ai-agents-newsroom-workflows", (data) => data.ok && data.article?.slug === "ai-agents-newsroom-workflows");
  await getJson("client", "/api/search?query=cybersecurty", (data) => data.ok && data.correctedQuery === "Cybersecurity");
  await getJson("client", "/api/search/discovery?query=best%20AI%20chips&type=all", (data) => data.ok && data.results?.length > 0);
  await getJson("client", "/api/videos", (data) => data.ok && Array.isArray(data.videos) && Array.isArray(data.playlists));
  await getJson("client", "/api/podcasts", (data) => data.ok && Array.isArray(data.shows) && Array.isArray(data.episodes));
  await getJson("client", "/api/reviews", (data) => data.ok && Array.isArray(data.reviews));
  await getJson("client", "/api/reviews/experience", (data) => data.ok && data.readiness?.comparisonReady === true && data.scoringSystem?.length >= 4);
  await getJson("client", "/api/reviews/compare?slugs=nova-x1-pro-review", (data) => data.ok && data.comparison?.reviews?.length >= 1 && data.comparison?.benchmarkMatrix?.length >= 1);
  await getJson("client", "/api/events", (data) => data.ok && data.events?.length > 0);
  await getJson("client", "/api/events/experience", (data) => data.ok && data.readiness?.ticketSystemReady === true && data.readiness?.virtualConferencesReady === true && data.attendeeJourney?.length >= 5);
  await getJson("client", "/api/jobs", (data) => data.ok && data.jobs?.length > 0);
  await getJson("client", "/api/jobs/experience", (data) => data.ok && data.experience?.readiness?.resumeUploadReady === true && data.experience?.featuredJobs?.length >= 1 && data.experience?.salaryInsights?.length >= 1);
  await getJson("client", "/api/startups", (data) => data.ok && data.startups?.length > 0);
  await getJson("client", "/api/devices", (data) => data.ok && data.devices?.length > 0);
  await getJson("client", "/api/devices/experience", (data) => data.ok && data.readiness?.deviceComparisonsReady === true && data.quality?.gpuCpuRecords >= 1 && data.companyProfiles?.length >= 1);
  await getJson("client", "/api/community/topics", (data) => data.ok && Array.isArray(data.topics));
  await getJson("client", "/api/community/polls", (data) => data.ok && Array.isArray(data.polls));
  await getJson("client", "/api/community/social-experience", (data) => data.ok && data.readiness?.forumsReady === true && Array.isArray(data.forums));
  await getJson("client", "/api/newsletter/experience", (data) => data.ok && data.readiness?.doubleOptInReady === true && Array.isArray(data.journey));
  await getJson("client", "/api/commercial/experience", (data) =>
    data.ok
    && data.readiness?.manualCheckoutReady === true
    && data.readiness?.productionPaymentsConnected === false
    && data.readiness?.revenueReportingReady === true
    && Array.isArray(data.packages)
    && data.revenueModel?.length >= 6
    && data.sponsorJourney?.length >= 5
  );
  await getJson("client", "/api/trust/experience", (data) => data.ok && data.compliance?.privacy?.cookieConsentReady === true && Array.isArray(data.trustModules));
  await getJson("client", "/api/mobile/home?platform=ios&appVersion=0.1.0", (data) => data.ok && Array.isArray(data.feed));

  const newsletterEmail = `client-audit-newsletter-${stamp}@example.com`;
  const newsletter = await postJson("client", "/api/newsletter", { email: newsletterEmail, preferences: { ai: true, cloud: true } }, (data) => data.ok && Boolean(data.verificationToken));
  if (newsletter.verificationToken) {
    await getJson("client", `/api/newsletter/verify?token=${encodeURIComponent(newsletter.verificationToken)}`, (data) => data.ok && data.subscriber?.email === newsletterEmail);
  }

  const readerEmail = `client-audit-reader-${stamp}@example.com`;
  const reader = await postJson("client", "/api/reader/register", { name: "Client Audit Reader", email: readerEmail, password: "password123" }, (data) => data.ok && Boolean(data.token));
  const auth = reader.token ? { authorization: `Bearer ${reader.token}` } : {};
  if (reader.token) {
    await postJson("client", "/api/reader/profile", { name: "Client Audit Reader Updated", preferredCategories: "ai,cloud", preferredAuthors: "maya-chen", theme: "dark", languageCode: "en" }, (data) => data.ok && data.reader?.name.includes("Updated"), auth);
    await postJson("client", "/api/bookmarks/ai-agents-newsroom-workflows", {}, (data) => data.ok && data.bookmarked === true, auth);
    await postJson("client", "/api/authors/maya-chen/follow", {}, (data) => data.ok && data.following === true, auth);
    await postJson("client", "/api/memberships/subscribe/pro", {}, (data) => data.ok && data.membership?.planSlug === "pro", auth);
    await getJson("client", "/api/commercial/experience", (data) => data.ok && data.membership?.planSlug === "pro" && data.revenueModel?.some((item) => item.label === "Membership"), auth);
    await postJson("client", "/api/compliance/consent", { consentType: "analytics", value: true, metadata: { source: "client-audit" } }, (data) => data.ok && data.consent?.value === true, auth);
    await getJson("client", "/api/trust/experience", (data) => data.ok && data.signedIn === true && data.reader?.email === readerEmail, auth);
    await getJson("client", "/api/community/social-experience", (data) => data.ok && data.signedIn === true && data.social?.follows?.some((author) => author.id === "maya-chen"), auth);
    await postJson("client", "/api/notifications/preferences", { breaking: true, newsletters: true, liveEvents: true, favoriteCategories: "ai, cloud" }, (data) => data.ok && data.preferences?.favoriteCategories?.includes("ai"), auth);
    await postJson("client", "/api/notifications/device", { deviceToken: `client-audit-device-${stamp}` }, (data) => data.ok && data.preferences?.pushEnabled === true, auth);
    await getJson("client", "/api/newsletter/experience", (data) => data.ok && data.signedIn === true && data.reader?.email === readerEmail, auth);
    await postJson("client", "/api/search/saved-filters", { name: `Client Audit Search ${stamp}`, query: "AI chips", type: "all", sort: "relevance" }, (data) => data.ok && data.filter?.name, auth);
    await postJson("client", "/api/events/ai-leadership-forum/register", { name: "Client Audit Reader", email: readerEmail, company: "Audit Labs" }, (data) => data.ok && Boolean(data.registration?.id), auth);
    await postJson("client", "/api/jobs/senior-cloud-security-architect/apply", { name: "Client Audit Reader", email: readerEmail, skills: "cloud security, zero trust", resumeUrl: "https://example.com/resume.pdf", coverLetter: "Audit application." }, (data) => data.ok && Boolean(data.application?.id), auth);
    const topic = await postJson("client", "/api/community/topics", { title: `Client audit topic ${stamp}`, body: "Client audit topic body." }, (data) => data.ok && Boolean(data.topic?.id), auth);
    if (topic.topic?.id) {
      await postJson("client", `/api/community/topics/${topic.topic.id}/replies`, { body: "Client audit reply." }, (data) => data.ok && Boolean(data.reply?.id), auth);
      await postJson("client", `/api/community/topics/${topic.topic.id}/vote`, { vote: 1 }, (data) => data.ok && Number(data.score || 0) >= 1, auth);
    }
    const comment = await postJson("client", "/api/comments", { articleSlug: "ai-agents-newsroom-workflows", userName: "Client Audit Reader", userEmail: readerEmail, content: "Client audit article comment." }, (data) => data.ok && /moderation/i.test(data.message || ""), auth);
    if (comment.comment?.id) {
      await postJson("client", "/api/comments/vote", { commentId: comment.comment.id, vote: 1 }, (data) => data.ok);
      await postJson("client", "/api/comments/report", { commentId: comment.comment.id, reason: "Audit report flow." }, (data) => data.ok);
    }
  }

  const publicAnalytics = await json("/api/analytics/summary");
  add("client", "public cannot read admin analytics", publicAnalytics.response.status === 401 && publicAnalytics.data?.ok === false, publicAnalytics.data?.message || "", publicAnalytics.response.status);
  const adminNoCookie = await request("/admin");
  add("client", "admin root redirects when not signed in", adminNoCookie.status === 302 && (adminNoCookie.headers.get("location") || "").includes("/admin/login"), "", adminNoCookie.status);
  const adminNoCookieBody = await adminNoCookie.text();
  add("client", "admin root exposes no credentials when not signed in", !hasKnownCredentialLeak(adminNoCookieBody), "", adminNoCookie.status);
  add("client", "admin root exposes no secret tokens when not signed in", !hasSecretTokenLeak(adminNoCookieBody), "", adminNoCookie.status);
}

async function runAdminAudit() {
  const loginPage = await text("/admin/login");
  add("admin", "admin login page loads", loginPage.response.ok && loginPage.body.includes("Editorial login") && loginPage.body.includes("Log in"), "", loginPage.response.status);
  add("admin", "admin login has no signup", !/sign\s*up|signup|create account/i.test(loginPage.body), "", loginPage.response.status);
  add("admin", "admin login exposes no test credentials", !hasKnownCredentialLeak(loginPage.body), "", loginPage.response.status);
  add("admin", "admin login exposes no secret tokens", !hasSecretTokenLeak(loginPage.body), "", loginPage.response.status);

  const cookie = await loginAdmin();
  if (!cookie) return;

  const dashboard = await text("/admin", { headers: { cookie } });
  const adminLinks = [...new Set(extractLinks(dashboard.body).filter((link) => link.startsWith("/admin") && !["/admin/logout", "/admin/login", "/admin/forgot", "/admin/reset"].includes(link)).map((link) => link.split("?")[0]))];
  add("admin", "admin dashboard exposes nav links", dashboard.response.ok && adminLinks.length >= 30, `${adminLinks.length} links`, dashboard.response.status);

  for (const link of adminLinks) {
    const unauth = await request(link);
    add("admin", `protected without session ${link}`, unauth.status === 302 && (unauth.headers.get("location") || "").includes("/admin/login"), "", unauth.status);
  }

  for (const link of adminLinks) {
    const page = await text(link, { headers: { cookie } });
    add("admin", `admin page loads ${link}`, page.response.ok && page.body.includes("admin-sidebar") && !page.body.includes("Admin page not found"), "", page.response.status);
    const forms = extractForms(page.body);
    const postForms = forms.filter((form) => form.method === "post" && form.action !== "/admin/login" && form.action !== "/admin/forgot" && form.action !== "/admin/reset");
    if (postForms.length) add("admin", `csrf present for post forms ${link}`, page.body.includes('name="_csrf"'), `${postForms.length} post forms`, page.response.status);
  }

  const rolesPage = await text("/admin/roles", { headers: { cookie } });
  const csrf = extractCsrf(rolesPage.body);
  const roleFields = new URLSearchParams({ _csrf: csrf, name: `Audit Role ${stamp}` });
  roleFields.append("permissions", "articles");
  roleFields.append("permissions", "media");
  roleFields.append("permissions", "analytics");
  await postForm("admin", "/admin/roles", cookie, roleFields, (body, response) => response.ok && body.includes("Role saved.") && body.includes(`Audit Role ${stamp}`));
  const duplicateRoleFields = new URLSearchParams({ _csrf: csrf, name: "Writer" });
  duplicateRoleFields.append("permissions", "articles");
  const duplicateRole = await postForm("admin", "/admin/roles", cookie, duplicateRoleFields, (body, response) => response.ok && body.includes("A role named &quot;Writer&quot; already exists."));
  add("admin", "duplicate role name is handled without crashing", duplicateRole.response.ok && duplicateRole.body.includes("A role named &quot;Writer&quot; already exists."), "", duplicateRole.response.status);

  const roleSearch = await text(`/admin/roles?q=${encodeURIComponent(`Audit Role ${stamp}`)}`, { headers: { cookie } });
  const roleId = roleSearch.body.match(/<input type="hidden" name="id" value="([^"]+)"/)?.[1] || "";
  add("admin", "role search finds created role", roleSearch.response.ok && roleSearch.body.includes(`Audit Role ${stamp}`) && Boolean(roleId), "", roleSearch.response.status);

  const usersPage = await text("/admin/users", { headers: { cookie } });
  const userCsrf = extractCsrf(usersPage.body);
  const userFields = new URLSearchParams({
    _csrf: userCsrf,
    name: `Audit User ${stamp}`,
    email: `audit-user-${stamp}@example.com`,
    password: "changeme123",
    roleId: roleId || "role-writer",
    status: "active"
  });
  await postForm("admin", "/admin/users", cookie, userFields, (body, response) => response.ok && body.includes("User saved.") && body.includes(`audit-user-${stamp}@example.com`));

  const categoriesPage = await text("/admin/categories", { headers: { cookie } });
  await postForm("admin", "/admin/categories", cookie, new URLSearchParams({
    _csrf: extractCsrf(categoriesPage.body),
    id: "",
    name: `Audit Category ${stamp}`,
    slug: `audit-category-${stamp}`,
    color: "#62d6ff",
    icon: "QA",
    sortOrder: "99",
    description: "Audit category."
  }), (body, response) => response.ok && body.includes("Category saved."));

  const tagsPage = await text("/admin/tags", { headers: { cookie } });
  await postForm("admin", "/admin/tags", cookie, new URLSearchParams({
    _csrf: extractCsrf(tagsPage.body),
    id: "",
    name: `Audit Tag ${stamp}`,
    slug: `audit-tag-${stamp}`,
    description: "Audit tag."
  }), (body, response) => response.ok && body.includes("Tag saved."));

  const articleForm = await text("/admin/articles/new", { headers: { cookie } });
  add("admin", "article create form has CMS controls", articleForm.response.ok && articleForm.body.includes("data-autosave-form") && articleForm.body.includes("name=\"seoTitle\"") && articleForm.body.includes("data-editor-poll") && articleForm.body.includes("Article trust and transparency") && articleForm.body.includes("name=\"factCheckStatus\""), "", articleForm.response.status);

  const security = await text("/admin/security", { headers: { cookie } });
  add("admin", "security page has 2FA controls", security.response.ok && security.body.includes("/admin/security/2fa") && security.body.includes("Two-factor authentication"), "", security.response.status);
  add("admin", "security command center has section 22 controls", security.response.ok && security.body.includes("Security and compliance command center") && security.body.includes("Section 22 readiness matrix") && security.body.includes("DDoS") && security.body.includes("WAF") && security.body.includes("CSRF") && security.body.includes("Rate limits") && security.body.includes("Admin sessions and devices") && security.body.includes("Mobile device tracking") && security.body.includes("Consent ledger"), "", security.response.status);

  const community = await text("/admin/community", { headers: { cookie } });
  add("admin", "community command center has social operations", community.response.ok && community.body.includes("Community command center") && community.body.includes("Forum categories") && community.body.includes("Moderation intelligence") && community.body.includes("Reputation leaders"), "", community.response.status);

  const campaigns = await text("/admin/newsletter/campaigns", { headers: { cookie } });
  add("admin", "newsletter command center has marketing operations", campaigns.response.ok && campaigns.body.includes("Newsletter marketing command center") && campaigns.body.includes("Automated workflows") && campaigns.body.includes("Campaign performance") && campaigns.body.includes("A/B variant"), "", campaigns.response.status);

  const reviews = await text("/admin/reviews", { headers: { cookie } });
  add("admin", "review command center has product review operations", reviews.response.ok && reviews.body.includes("Product review and comparison command center") && reviews.body.includes("Review workflow") && reviews.body.includes("Readiness and compliance"), "", reviews.response.status);

  const devices = await text("/admin/devices", { headers: { cookie } });
  add("admin", "device command center has tech database operations", devices.response.ok && devices.body.includes("Device directory and comparison command center") && devices.body.includes("Database workflow") && devices.body.includes("Company profiles") && devices.body.includes("Release timeline"), "", devices.response.status);

  const events = await text("/admin/events", { headers: { cookie } });
  add("admin", "event command center has conference operations", events.response.ok && events.body.includes("Event, RSVP, and live conference command center") && events.body.includes("Event workflow") && events.body.includes("Sponsor desk") && events.body.includes("Readiness"), "", events.response.status);

  const jobs = await text("/admin/jobs", { headers: { cookie } });
  add("admin", "career command center has job operations", jobs.response.ok && jobs.body.includes("Job board, recruiters, applications, and salary intelligence") && jobs.body.includes("Career platform readiness") && jobs.body.includes("Salary insights") && jobs.body.includes("Featured job"), "", jobs.response.status);

  const monetization = await text("/admin/monetization", { headers: { cookie } });
  add("admin", "monetization command center has revenue operations", monetization.response.ok && monetization.body.includes("Monetization and revenue command center") && monetization.body.includes("Commercial readiness matrix") && monetization.body.includes("Payment gateway required") && monetization.body.includes("Video ad slots"), "", monetization.response.status);

  const analytics = await text("/admin/analytics", { headers: { cookie } });
  add("admin", "analytics command center has business intelligence", analytics.response.ok && analytics.body.includes("Business intelligence readiness") && analytics.body.includes("Reader conversion funnel") && analytics.body.includes("Scroll and click heatmap") && analytics.body.includes("Predictive content actions"), "", analytics.response.status);

  const operations = await text("/admin/operations", { headers: { cookie } });
  add("admin", "operations command center has administration controls", operations.response.ok && operations.body.includes("Administration and operations command center") && operations.body.includes("Section 21 readiness matrix") && operations.body.includes("Maintenance mode") && operations.body.includes("Cache management") && operations.body.includes("Queue monitor") && operations.body.includes("Server monitoring") && operations.body.includes("API activity log") && operations.body.includes("Error logs") && operations.body.includes("Audit trails") && operations.body.includes("Backup management") && operations.body.includes("Deployment controls") && operations.body.includes("CDN management"), "", operations.response.status);

  const api = await text("/admin/api", { headers: { cookie } });
  add("admin", "api command center has integration ecosystem", api.response.ok && api.body.includes("API and integration command center") && api.body.includes("Section 23 readiness matrix") && api.body.includes("REST") && api.body.includes("GraphQL") && api.body.includes("Mobile API") && api.body.includes("Webhooks") && api.body.includes("OAuth") && api.body.includes("RSS feeds and syndication") && api.body.includes("Public developer API") && api.body.includes("Social media integrations"), "", api.response.status);

  const languages = await text("/admin/languages", { headers: { cookie } });
  add("admin", "globalization command center has section 24 operations", languages.response.ok && languages.body.includes("Globalization command center") && languages.body.includes("Section 24 readiness matrix") && languages.body.includes("RTL/LTR") && languages.body.includes("Translation workflow") && languages.body.includes("Localized SEO") && languages.body.includes("Country editions") && languages.body.includes("Timezone management") && languages.body.includes("Multi-currency support"), "", languages.response.status);

  const future = await text("/admin/future", { headers: { cookie } });
  add("admin", "future command center has section 25 ecosystem", future.response.ok && future.body.includes("Future ecosystem command center") && future.body.includes("Section 25 readiness matrix") && future.body.includes("Smart TV apps") && future.body.includes("AI news anchors") && future.body.includes("VR/AR news") && future.body.includes("Blockchain publishing verification") && future.body.includes("NFT/media collectibles") && future.body.includes("AI-generated media") && future.body.includes("Smart assistants") && future.body.includes("Voice navigation"), "", future.response.status);

  const infrastructure = await text("/admin/infrastructure", { headers: { cookie } });
  add("admin", "infrastructure command center has section 26 scalability", infrastructure.response.ok && infrastructure.body.includes("Enterprise scalability command center") && infrastructure.body.includes("Section 26 readiness matrix") && infrastructure.body.includes("Microservices") && infrastructure.body.includes("Docker") && infrastructure.body.includes("Kubernetes") && infrastructure.body.includes("PostgreSQL") && infrastructure.body.includes("Redis") && infrastructure.body.includes("Queues") && infrastructure.body.includes("CDN") && infrastructure.body.includes("Horizontal scaling") && infrastructure.body.includes("Multi-region") && infrastructure.body.includes("Disaster recovery") && infrastructure.body.includes("Deployment controls"), "", infrastructure.response.status);

  const affiliates = await text("/admin/affiliates", { headers: { cookie } });
  add("admin", "affiliate page has commerce controls", affiliates.response.ok && affiliates.body.includes("Affiliate commerce command center") && affiliates.body.includes("Affiliate disclosure and tracking") && affiliates.body.includes("Click tracking ready"), "", affiliates.response.status);

  const memberships = await text("/admin/memberships", { headers: { cookie } });
  add("admin", "memberships page explains manual payment mode", memberships.response.ok && memberships.body.includes("Membership and subscriber revenue") && memberships.body.includes("Manual checkout status") && memberships.body.includes("does not charge cards"), "", memberships.response.status);
}

await runClientAudit();
await runAdminAudit();
cleanupQaData({ log: false });

const groups = ["client", "admin"];
let failed = false;
for (const group of groups) {
  const groupChecks = checks.filter((check) => check.group === group);
  const pass = groupChecks.filter((check) => check.ok).length;
  const fail = groupChecks.length - pass;
  console.log(`\n${group.toUpperCase()} ${pass}/${groupChecks.length} passed`);
  for (const check of groupChecks) {
    console.log(`${check.ok ? "PASS" : "FAIL"} ${check.status || ""} ${check.name}${check.detail ? ` - ${check.detail}` : ""}`);
    if (!check.ok) failed = true;
  }
}

if (failed) process.exit(1);
