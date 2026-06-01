import { createServer } from "node:http";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { generateArticleAi, generateNewsroomAi } from "./ai.js";
import { getAnalyticsIntegrationStatus, injectAnalyticsIntoHtml } from "./analytics-integrations.js";
import { cached, cacheStats, clearCache, redisCommand } from "./cache.js";
import { getLaunchReadiness } from "./launch-readiness.js";
import { getEmailProviderStatus } from "./email.js";
import { getDatabaseRuntimeStatus } from "./database-runtime.js";
import { getPushProviderStatus } from "./push.js";
import { getMediaStorageStatus, storeMediaFile } from "./media-storage.js";
import { importTechNews, previewTechNewsSources } from "./news-ingestion.js";
import {
  addComment,
  addLiveEventComment,
  addMedia,
  addNewsroomMessage,
  addSubscriber,
  apiKeyHasScope,
  authenticateApiKey,
  authenticateUser,
  authenticateReader,
  createApiKey,
  createBackup,
  createOutboxEmail,
  confirmTwoFactor,
  clearArticleAutosave,
  createPasswordReset,
  deleteCategory,
  deleteReaderSession,
  deleteTag,
  disableTwoFactor,
  deleteSession,
  duplicateArticle,
  getAdminArticle,
  getAdminArticles,
  getAdminCollections,
  getAdminComments,
  getAdminStats,
  getAdminMedia,
  getAdminSubscribers,
  getAdminUsers,
  getAdminRoles,
  getPermissionCatalog,
  getAdPlacements,
  getAiAssistantRuns,
  getAiAutomationDashboard,
  getApiDashboard,
  getAffiliateLinks,
  getAnalyticsSummary,
  getArticleForReader,
  getArticleRevisions,
  getAuditLogs,
  getArticle,
  getArticles,
  getBootstrap,
  getBreakingNewsAlerts,
  getCommunityTopics,
  getCommunityTopic,
  getCommunityPolls,
  getCommunityOperationsDashboard,
  getCommunitySocialExperience,
  getCommercialExperience,
  getTrustComplianceExperience,
  getDirectoryItems,
  getDevice,
  getDeviceDatabaseExperience,
  getDeviceDashboard,
  getDevices,
  getEmailOutbox,
  getEmailDeliverySummary,
  getEventDashboard,
  getEventExperience,
  getConferenceEvent,
  getConferenceEvents,
  getJobBoard,
  getJobBoardDashboard,
  getJobBoardExperience,
  getJobPost,
  compareDevices,
  compareProductReviews,
  getJobStats,
  getLiveEvent,
  getLiveEvents,
  getLanguages,
  getBusinessIntelligenceDashboard,
  getComplianceDashboard,
  getEnterpriseInfrastructureDashboard,
  getFutureExpansionDashboard,
  getGlobalizationDashboard,
  getIntegrationDashboard,
  getArticleTranslations,
  getMediaOptimizationDashboard,
  getMediaVariants,
  getMobileAnalyticsDashboard,
  getMobileExperienceDashboard,
  getMobileHome,
  getMobileOfflineLibrary,
  getMobileWidgetFeed,
  getNewsletterCampaigns,
  getNewsletterExperience,
  getNewsletterMarketingDashboard,
  getNewsImportInspectionQueue,
  getNewsImportSourcePerformance,
  getNewsImportSources,
  getNotifications,
  getNotificationPreferences,
  getPodcastCategories,
  getPodcastEpisode,
  getPodcastEpisodes,
  getPodcastPlatformDashboard,
  getPodcastShow,
  getPodcastShows,
  getProductReview,
  getProductReviewDashboard,
  getProductReviewExperience,
  getProductReviews,
  getReaderBookmarks,
  getReaderBySession,
  getReaderExperience,
  getReaderGamification,
  getReaderNotifications,
  getReaderMembership,
  getReaderSocial,
  getPublicReaderProfile,
  getFollowedAuthorFeed,
  getRetentionDashboard,
  getGamificationLeaderboard,
  getPaywallRules,
  getRevenueSummary,
  getMonetizationOperationsDashboard,
  getSitemapPaths,
  getSyndicationFeed,
  getSiteSettings,
  getSponsoredCampaigns,
  getStartup,
  getStartupDashboard,
  getStartups,
  getUserSecurity,
  getVideo,
  getVideoCategories,
  getVideoPlatformDashboard,
  getVideoPlaylists,
  getVideos,
  getWorkflowOperations,
  getWorkflowArticles,
  getUserBySession,
  getSearchSuggestions,
  getSecurityOperations,
  getSavedSearchFilters,
  getSearchDiscoveryDashboard,
  getSections16To26Dashboard,
  getSocialEngagementDashboard,
  getTechDatabaseDashboard,
  interpretVoiceSearch,
  rebuildSearchIndex,
  queueSeoIndexing,
  saveSearchFilter,
  deleteSearchFilter,
  unsubscribeNewsletterSubscriber,
  searchDiscovery,
  getTrendingSearches,
  getSeoDashboard,
  getSeoAutomationDashboard,
  getSeoPreview,
  getStructuredData,
  getNewsSitemapEntries,
  getVideoSitemapEntries,
  getPodcastSitemapEntries,
  getCategorySitemapEntries,
  getInternalLinkSuggestions,
  getItRoom,
  getItRooms,
  getPlatformFeed,
  getOperationsDashboard,
  initDatabase,
  advancedSearchArticles,
  activateBreakingNewsAlert,
  cancelReaderMembership,
  createCommunityTopic,
  createItRoomPost,
  createInternalLinkApprovals,
  addCommunityReply,
  recordAnalyticsEvent,
  recordAiAssistantRun,
  recordAdImpression,
  recordAffiliateClick,
  recordApiUsage,
  recordMobileAppEvent,
  recordPodcastEvent,
  recordRevenueEvent,
  recordSecurityEvent,
  recordComplianceConsent,
  recordNewsletterEvent,
  registerMobileDevice,
  registerNotificationDevice,
  registerReader,
  registerForConferenceEvent,
  applyForJob,
  reportComment,
  requestArticleApproval,
  resetPassword,
  removeMobileOfflineItem,
  resolveMobileDeepLink,
  reviewArticleApproval,
  rollbackArticleRevision,
  resolveBreakingNewsAlert,
  rebuildMediaVariants,
  saveAdminArticle,
  saveArticleAutosave,
  saveAffiliateLink,
  saveAdminUser,
  saveAdminRole,
  saveBreakingNewsAlert,
  saveCategory,
  saveConferenceEvent,
  saveCommunityPoll,
  saveDirectoryItem,
  saveDevice,
  saveDeviceBenchmark,
  saveDeviceSpec,
  saveEventAgendaItem,
  saveEventSpeaker,
  saveJobPost,
  saveJobAlert,
  saveItRoom,
  saveApiWebhook,
  saveRecruiter,
  saveStartupFounder,
  saveStartupFundingRound,
  saveStartupProfile,
  saveEditorialAssignment,
  saveEditorialCalendarEvent,
  saveEditorialTask,
  saveLiveEvent,
  saveNewsroomShift,
  saveArticleTranslation,
  saveMediaOptimizationSettings,
  saveMobileOfflineItem,
  saveNewsletterCampaign,
  saveNewsImportSourceControls,
  saveNotification,
  saveNotificationPreferences,
  saveFeatureToggle,
  savePodcastCategory,
  savePodcastEpisode,
  savePodcastShow,
  savePaywallRule,
  saveProductReview,
  saveSecurityPolicy,
  saveSiteSettings,
  saveSponsoredCampaign,
  saveVideoAdSlot,
  saveTag,
  saveVideo,
  saveVideoCategory,
  saveVideoPlaylist,
  recordVideoEvent,
  togglePodcastBookmark,
  toggleVideoBookmark,
  sendNotification,
  sendNewsletterCampaign,
  runArticleAutomation,
  searchArticles,
  setCommentStatus,
  softDeleteArticle,
  subscribeReaderToPlan,
  toggleBookmark,
  toggleAuthorFollow,
  markNotificationRead,
  prepareTwoFactor,
  updateReaderProfile,
  updateApiKeyStatus,
  updateArticleStatus,
  updateAdPlacement,
  updateHomepageFlags,
  restoreArticle,
  updateLiveEventStatus,
  addLiveUpdate,
  blockIpAddress,
  unblockIpAddress,
  verifyCsrf,
  voteCommunityPoll,
  voteCommunityTopic,
  verifyNewsletterSubscriber,
  voteComment
} from "./db.js";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(root, "public");
const uploadDir = join(publicDir, "uploads");
const resumeUploadDir = join(uploadDir, "resumes");
const port = config.port;
initDatabase();
const rateLimits = new Map();
const workflowSockets = new Set();
const realtimeInstanceId = randomUUID();
const realtimeSeenEvents = new Set();
let realtimeRedisLastPoll = 0;
const redisConfigured = Boolean(config.redisUrl || (config.redisRestUrl && config.redisRestToken));
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=15552000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; img-src 'self' https://images.unsplash.com data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https:; frame-src https://www.youtube.com https://www.youtube-nocookie.com; connect-src 'self' https:;"
};

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

function isAsset(pathname) {
  return pathname.startsWith("/assets/") || pathname === "/styles.css" || pathname === "/app.js" || pathname === "/admin.js";
}

async function serveFile(response, pathname) {
  const normalized = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const target = join(publicDir, normalized === "/" ? "index.html" : normalized);
  if (!target.startsWith(publicDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    let body = await readFile(target);
    const extension = extname(target);
    if (extension === ".html") body = Buffer.from(injectAnalyticsIntoHtml(body.toString("utf8")));
    const immutableAsset = normalized.startsWith("/uploads/") || normalized.startsWith("/assets/") || [".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".mp4", ".mp3", ".m4a", ".wav", ".ogg"].includes(extension);
    response.writeHead(200, {
      "Content-Type": types[extension] || "application/octet-stream",
      "Cache-Control": immutableAsset ? config.mediaCacheControl : "no-store",
      "Accept-Ranges": immutableAsset ? "bytes" : "none",
      ...securityHeaders
    });
    response.end(body);
  } catch {
    const shell = injectAnalyticsIntoHtml(await readFile(join(publicDir, "index.html"), "utf8"));
    response.writeHead(200, { "Content-Type": types[".html"], "Cache-Control": "no-store", ...securityHeaders });
    response.end(shell);
  }
}

function sendJson(response, payload, status = 200, headers = {}) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
    ...securityHeaders
  });
  response.end(body);
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};

  const contentType = request.headers["content-type"] || "";
  if (contentType.includes("application/json")) return JSON.parse(raw);
  const values = {};
  for (const [key, value] of new URLSearchParams(raw)) {
    if (key in values) values[key] = Array.isArray(values[key]) ? [...values[key], value] : [values[key], value];
    else values[key] = value;
  }
  return values;
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function readMultipart(request) {
  const contentType = request.headers["content-type"] || "";
  const boundary = contentType.match(/boundary=(.+)$/)?.[1];
  if (!boundary) return { fields: {}, files: {} };

  const body = await readBody(request);
  const delimiter = Buffer.from(`--${boundary}`);
  const fields = {};
  const files = {};
  let cursor = 0;

  while (cursor < body.length) {
    const start = body.indexOf(delimiter, cursor);
    if (start === -1) break;
    const next = body.indexOf(delimiter, start + delimiter.length);
    if (next === -1) break;
    let part = body.subarray(start + delimiter.length, next);
    cursor = next;

    if (part.subarray(0, 2).toString() === "--") break;
    if (part.subarray(0, 2).toString() === "\r\n") part = part.subarray(2);
    if (part.subarray(-2).toString() === "\r\n") part = part.subarray(0, -2);

    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd === -1) continue;

    const headers = part.subarray(0, headerEnd).toString("utf8");
    const content = part.subarray(headerEnd + 4);
    const name = headers.match(/name="([^"]+)"/)?.[1];
    const filename = headers.match(/filename="([^"]*)"/)?.[1];
    const type = headers.match(/Content-Type:\s*([^\r\n]+)/i)?.[1] || "application/octet-stream";

    if (!name) continue;
    if (filename) files[name] = { filename, type, content };
    else fields[name] = content.toString("utf8");
  }

  return { fields, files };
}

async function storeResumeUpload(file) {
  if (!file?.content?.length) return { ok: true, url: "" };
  const allowed = new Map([
    ["application/pdf", ".pdf"],
    ["application/msword", ".doc"],
    ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"]
  ]);
  const extension = allowed.get(file.type);
  if (!extension) return { ok: false, message: "Resume upload must be PDF, DOC, or DOCX." };
  if (file.content.length > 5 * 1024 * 1024) return { ok: false, message: "Resume upload must be 5 MB or smaller." };
  if (file.type === "application/pdf" && file.content.subarray(0, 4).toString("ascii") !== "%PDF") {
    return { ok: false, message: "Resume file does not look like a valid PDF." };
  }
  const safeName = `${Date.now()}-${createHash("sha256").update(file.content).digest("hex").slice(0, 12)}${extension}`;
  await mkdir(resumeUploadDir, { recursive: true });
  await writeFile(join(resumeUploadDir, safeName), file.content);
  return { ok: true, url: `/uploads/resumes/${safeName}` };
}

function redirect(response, location, headers = {}) {
  response.writeHead(302, { Location: location, ...securityHeaders, ...headers });
  response.end();
}

function sendHtml(response, html, status = 200, headers = {}) {
  response.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    ...securityHeaders,
    ...headers
  });
  response.end(html);
}

function websocketFrame(payload) {
  const data = Buffer.from(JSON.stringify(payload));
  if (data.length < 126) return Buffer.concat([Buffer.from([0x81, data.length]), data]);
  if (data.length < 65536) {
    const header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(data.length, 2);
    return Buffer.concat([header, data]);
  }
  const header = Buffer.alloc(10);
  header[0] = 0x81;
  header[1] = 127;
  header.writeBigUInt64BE(BigInt(data.length), 2);
  return Buffer.concat([header, data]);
}

function sendWorkflowSocket(socket, payload) {
  if (socket.destroyed) {
    workflowSockets.delete(socket);
    return;
  }
  try {
    socket.write(websocketFrame(payload));
  } catch {
    workflowSockets.delete(socket);
  }
}

function rememberRealtimeEvent(id) {
  realtimeSeenEvents.add(id);
  if (realtimeSeenEvents.size > 1000) {
    const first = realtimeSeenEvents.values().next().value;
    realtimeSeenEvents.delete(first);
  }
}

function deliverWorkflowEvent(event) {
  rememberRealtimeEvent(event.id);
  for (const socket of workflowSockets) sendWorkflowSocket(socket, event);
}

async function publishRealtimeEvent(event) {
  await redisCommand(["LPUSH", "tm:realtime:workflow", JSON.stringify(event)]);
  await redisCommand(["LTRIM", "tm:realtime:workflow", "0", "199"]);
}

async function pollRealtimeEvents() {
  if (!config.redisUrl && !(config.redisRestUrl && config.redisRestToken)) return;
  const redis = await redisCommand(["LRANGE", "tm:realtime:workflow", "0", "49"]);
  const rows = Array.isArray(redis?.result) ? redis.result : [];
  for (const row of rows.reverse()) {
    try {
      const event = JSON.parse(row);
      if (!event?.id || realtimeSeenEvents.has(event.id)) continue;
      if (event.instanceId === realtimeInstanceId) {
        rememberRealtimeEvent(event.id);
        continue;
      }
      deliverWorkflowEvent(event);
    } catch {
      // Ignore malformed cross-instance payloads.
    }
  }
  realtimeRedisLastPoll = Date.now();
}

function broadcastWorkflowEvent(type, payload = {}) {
  const event = {
    id: randomUUID(),
    instanceId: realtimeInstanceId,
    type,
    payload,
    sentAt: new Date().toISOString(),
    workflow: getWorkflowOperations("all")
  };
  deliverWorkflowEvent(event);
  publishRealtimeEvent(event).catch(() => {});
}

function getCookie(request, name) {
  const cookie = request.headers.cookie || "";
  return cookie
    .split(";")
    .map((part) => part.trim().split("="))
    .find(([key]) => key === name)?.[1];
}

function adminUser(request) {
  return getUserBySession(getCookie(request, "tm_session"));
}

function readerToken(request) {
  const authorization = request.headers.authorization || "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7) : getCookie(request, "tm_reader");
}

function can(user, permission) {
  return Boolean(user?.permissions?.includes("all") || user?.permissions?.includes(permission));
}

function forbiddenPage(response, user, message = "Your account does not have permission to use this area.") {
  sendHtml(
    response,
    adminLayout(
      "Forbidden",
      user,
      `<section class="admin-heading"><span>Access</span><h1>Permission required</h1></section><section class="admin-panel"><p>${escapeHtml(message)}</p></section>`
    ),
    403
  );
}

function csrfInput(user) {
  return `<input type="hidden" name="_csrf" value="${escapeHtml(user.csrfToken)}">`;
}

function checkRateLimit(request, bucket, limit, windowMs) {
  const ip = clientIp(request);
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  current.count += 1;
  return current.count <= limit;
}

function rateLimitResponse(response) {
  recordSecurityEvent({ eventType: "rate_limit", severity: "medium", details: "Request exceeded application rate limit." });
  sendJson(response, { ok: false, message: "Too many requests. Try again shortly." }, 429);
}

const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT = 100;

function clampInteger(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function paginationParams(url, { defaultLimit = DEFAULT_PAGE_LIMIT, maxLimit = MAX_PAGE_LIMIT } = {}) {
  const page = clampInteger(url.searchParams.get("page"), 1, 1, 100000);
  const limit = clampInteger(url.searchParams.get("limit"), defaultLimit, 1, maxLimit);
  return { page, limit, offset: (page - 1) * limit };
}

function paginateArray(items = [], params = {}) {
  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.max(1, Number(params.limit || DEFAULT_PAGE_LIMIT));
  const offset = Math.max(0, Number(params.offset ?? ((page - 1) * limit)));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    items: items.slice(offset, offset + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    }
  };
}

function paginatedCollection(items, url, options = {}) {
  return paginateArray(items, paginationParams(url, options));
}

function sendPaginatedCollection(response, key, items, url, options = {}, extra = {}) {
  const result = paginatedCollection(items, url, options);
  sendJson(response, { ok: true, ...extra, [key]: result.items, pagination: result.pagination });
}

function apiReadAllowed(request, response, bucket = "api-read", limit = 600, windowMs = 60 * 1000) {
  if (checkRateLimit(request, bucket, limit, windowMs)) return true;
  rateLimitResponse(response);
  return false;
}

function adminListPage(url, items, basePath, options = {}) {
  const params = paginationParams(url, { defaultLimit: options.defaultLimit || 25, maxLimit: options.maxLimit || 100 });
  const result = paginateArray(items, params);
  const buildHref = (page) => {
    const next = new URLSearchParams(url.searchParams);
    next.set("page", String(page));
    next.set("limit", String(params.limit));
    return `${basePath}?${next.toString()}`;
  };
  const start = result.pagination.total ? params.offset + 1 : 0;
  const end = Math.min(params.offset + params.limit, result.pagination.total);
  const controls = `
    <div class="pagination-bar">
      <span>Showing ${Number(start).toLocaleString()}-${Number(end).toLocaleString()} of ${Number(result.pagination.total).toLocaleString()}</span>
      <div class="pagination-actions">
        ${result.pagination.hasPrevious ? `<a class="button secondary" href="${escapeHtml(buildHref(result.pagination.page - 1))}">Previous</a>` : `<span class="button secondary disabled">Previous</span>`}
        <span>Page ${Number(result.pagination.page).toLocaleString()} of ${Number(result.pagination.totalPages).toLocaleString()}</span>
        ${result.pagination.hasNext ? `<a class="button secondary" href="${escapeHtml(buildHref(result.pagination.page + 1))}">Next</a>` : `<span class="button secondary disabled">Next</span>`}
      </div>
    </div>
  `;
  return { rows: result.items, pagination: result.pagination, controls };
}

function resolveAdminPageArgs(urlOrMessage, message = "", basePath = "/admin") {
  if (urlOrMessage?.searchParams) return { url: urlOrMessage, message };
  return { url: new URL(`http://local${basePath}`), message: String(urlOrMessage || message || "") };
}

function apiKeyFromRequest(request, url) {
  return url.searchParams.get("api_key") || request.headers["x-api-key"] || String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
}

function partnerApiRequest(request, response, url, scope) {
  const apiKey = authenticateApiKey(apiKeyFromRequest(request, url));
  if (!apiKey || !apiKeyHasScope(apiKey, scope)) {
    recordApiUsage({ path: url.pathname, method: request.method || "GET", statusCode: 401, ipAddress: clientIp(request), userAgent: request.headers["user-agent"] || "" });
    sendJson(response, { ok: false, message: "Valid API key with required scope is required." }, 401);
    return null;
  }
  if (!checkRateLimit(request, `partner-api:${apiKey.id}`, apiKey.rateLimitPerMinute || 120, 60 * 1000)) {
    recordApiUsage({ apiKeyId: apiKey.id, path: url.pathname, method: request.method || "GET", statusCode: 429, ipAddress: clientIp(request), userAgent: request.headers["user-agent"] || "" });
    rateLimitResponse(response);
    return null;
  }
  return apiKey;
}

function sendPartnerJson(request, response, url, apiKey, payload, status = 200) {
  recordApiUsage({ apiKeyId: apiKey.id, path: url.pathname, method: request.method || "GET", statusCode: status, ipAddress: clientIp(request), userAgent: request.headers["user-agent"] || "" });
  sendJson(response, payload, status);
}

function clientIp(request) {
  const forwarded = config.trustProxy ? request.headers["x-forwarded-for"]?.split(",")[0]?.trim() : "";
  return forwarded || request.socket.remoteAddress || "local";
}

function parsePolicyJson(value, fallback) {
  try {
    return JSON.parse(value || "");
  } catch {
    return fallback;
  }
}

function inspectSecurityRequest(request, url) {
  const security = getSecurityOperations();
  const ipAddress = clientIp(request);
  const userAgent = request.headers["user-agent"] || "";
  const blocked = security.blockedIps.find((item) => item.ipAddress === ipAddress);
  if (blocked) {
    recordSecurityEvent({ eventType: "ip_block", ipAddress, path: url.pathname, userAgent, severity: "high", details: blocked.reason });
    return { ok: false, status: 403, message: "Request blocked by security policy." };
  }

  const geoPolicy = parsePolicyJson(security.policies.geo_restrictions?.value, { mode: "monitor", blockedCountries: [], allowedCountries: [] });
  const country = String(request.headers["cf-ipcountry"] || request.headers["x-country-code"] || "").toUpperCase();
  if (security.geoEnabled && country) {
    const blockedCountry = (geoPolicy.blockedCountries || []).map((item) => String(item).toUpperCase()).includes(country);
    const allowedList = (geoPolicy.allowedCountries || []).map((item) => String(item).toUpperCase());
    const outsideAllowList = allowedList.length > 0 && !allowedList.includes(country);
    if (blockedCountry || outsideAllowList) {
      recordSecurityEvent({ eventType: "geo_restriction", ipAddress, path: url.pathname, userAgent, severity: "medium", details: `Country ${country}` });
      if (geoPolicy.mode === "block") return { ok: false, status: 403, message: "Request blocked by geo policy." };
    }
  }

  if (security.wafEnabled) {
    const patterns = parsePolicyJson(security.policies.waf_patterns?.value, []);
    const target = decodeURIComponent(`${url.pathname} ${url.search}`.toLowerCase());
    const match = patterns.find((pattern) => target.includes(String(pattern).toLowerCase()));
    if (match) {
      recordSecurityEvent({ eventType: "waf_match", ipAddress, path: url.pathname, userAgent, severity: "high", details: `Matched pattern: ${match}` });
      if (security.wafMode === "block") return { ok: false, status: 403, message: "Request blocked by web application firewall." };
    }
  }

  return { ok: true };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function adminLayout(title, user, body, active = "dashboard") {
  const roleSlug = String(user.role || "user").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "user";
  const links = [
    ["Workspace", "dashboard", "/admin", "Dashboard", []],
    ["Workspace", "articles", "/admin/articles", "Articles", ["articles"]],
    ["Workspace", "workflow", "/admin/workflow", "Review Queue", ["workflow", "articles"]],
    ["Workspace", "media", "/admin/media", "Media", ["media", "articles"]],
    ["Publishing", "newsimport", "/admin/news-imports", "News Imports", ["articles"]],
    ["Publishing", "inspection", "/admin/news-imports/inspection", "Inspection Queue", ["articles"]],
    ["Publishing", "sourceperformance", "/admin/news-imports/performance", "Source Performance", ["articles"]],
    ["Publishing", "homepage", "/admin/homepage", "Homepage", ["homepage"]],
    ["Publishing", "breaking", "/admin/breaking-news", "Breaking News", ["articles"]],
    ["Publishing", "liveblogs", "/admin/live-blogs", "Live Blogs", ["articles"]],
    ["Publishing", "videos", "/admin/videos", "Video Center", ["articles", "media"]],
    ["Publishing", "podcasts", "/admin/podcasts", "Podcasts", ["articles", "media"]],
    ["Publishing", "reviews", "/admin/reviews", "Reviews", ["articles"]],
    ["Publishing", "devices", "/admin/devices", "Devices", ["articles"]],
    ["Publishing", "ai", "/admin/ai-assistant", "AI Assistant", ["articles"]],
    ["Audience", "itrooms", "/admin/it-rooms", "IT Rooms", ["comments"]],
    ["Audience", "community", "/admin/community", "Community", ["comments"]],
    ["Audience", "comments", "/admin/comments", "Comments", ["comments"]],
    ["Audience", "subscribers", "/admin/subscribers", "Subscribers", ["subscribers"]],
    ["Audience", "campaigns", "/admin/newsletter/campaigns", "Campaigns", ["subscribers"]],
    ["Audience", "notifications", "/admin/notifications", "Notifications", ["subscribers"]],
    ["Audience", "outbox", "/admin/email-outbox", "Email Outbox", ["subscribers"]],
    ["Business", "monetization", "/admin/monetization", "Monetization", ["all"]],
    ["Business", "ads", "/admin/ads", "Ads", ["all"]],
    ["Business", "affiliates", "/admin/affiliates", "Affiliates", ["all"]],
    ["Business", "memberships", "/admin/memberships", "Memberships", ["all"]],
    ["Business", "events", "/admin/events", "Events", ["all"]],
    ["Business", "jobs", "/admin/jobs", "Jobs", ["all"]],
    ["Business", "startups", "/admin/startups", "Startups", ["all"]],
    ["Business", "directory", "/admin/directory", "Directory", ["all"]],
    ["Control", "sitecms", "/admin/site-cms", "Site CMS", ["all"]],
    ["Control", "users", "/admin/users", "Users", ["all"]],
    ["Control", "roles", "/admin/roles", "Roles", ["all"]],
    ["Control", "categories", "/admin/categories", "Categories", ["all"]],
    ["Control", "tags", "/admin/tags", "Tags", ["all"]],
    ["Control", "audit", "/admin/audit", "Audit Log", ["all"]],
    ["Control", "backup", "/admin/backup", "Backups", ["all"]],
    ["Intelligence", "analytics", "/admin/analytics", "Analytics", ["analytics", "all"]],
    ["Intelligence", "retention", "/admin/retention", "Retention", ["all"]],
    ["Intelligence", "seo", "/admin/seo", "SEO", ["articles"]],
    ["Intelligence", "languages", "/admin/languages", "Languages", ["articles"]],
    ["System", "api", "/admin/api", "News API", ["all"]],
    ["System", "future", "/admin/future", "Future Ecosystem", ["all"]],
    ["System", "infrastructure", "/admin/infrastructure", "Infrastructure", ["all"]],
    ["System", "database", "/admin/database", "Database", ["all"]],
    ["System", "launch", "/admin/launch", "Launch", ["all"]],
    ["System", "security", "/admin/security", "Security", ["all"]],
    ["System", "operations", "/admin/operations", "Operations", ["all"]],
    ["System", "settings", "/admin/settings", "Settings", ["all"]]
  ];
  const canAny = (permissions = []) => !permissions.length || permissions.some((permission) => can(user, permission));
  const groupedLinks = links
    .filter(([, , , , permissions]) => canAny(permissions))
    .reduce((groups, [group, key, href, label]) => {
      groups[group] = groups[group] || [];
      groups[group].push([key, href, label]);
      return groups;
    }, {});
  const navHtml = Object.entries(groupedLinks)
    .map(([group, items]) => `
      <section class="admin-nav-group">
        <span>${escapeHtml(group)}</span>
        ${items.map(([key, href, label]) => `<a class="${active === key ? "active" : ""}" href="${href}">${label}</a>`).join("")}
      </section>
    `)
    .join("");
  const userPermissions = (user.permissions || []).includes("all") ? "Full platform access" : `${user.permissions.length} privileges enabled`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | Tech Magazine CMS</title>
  <link rel="icon" href="/assets/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css?v=26">
  <script src="/admin.js?v=5" defer></script>
</head>
<body class="admin-body admin-role-${escapeHtml(roleSlug)}">
  <aside class="admin-sidebar">
    <a class="brand admin-brand" href="/admin">
      <img class="brand-logo" src="/assets/logo.svg" alt="Tech Magazine logo">
      <span><strong>Tech Magazine</strong><small>Editorial control room</small></span>
    </a>
    <div class="admin-user-card">
      <span>${escapeHtml(user.role)}</span>
      <strong>${escapeHtml(user.name)}</strong>
      <small>${escapeHtml(userPermissions)}</small>
    </div>
    <nav>${navHtml}</nav>
    <a class="view-site" href="/#/">View website</a>
  </aside>
  <main class="admin-main">
    <header class="admin-topbar">
      <div class="admin-topbar-title"><span>${escapeHtml(title)}</span><strong>Ready for newsroom work</strong></div>
      <div class="admin-topbar-actions">
        <a class="button ghost dark" href="/#/">Website</a>
        <a class="button ghost dark" href="/admin/logout">Log out</a>
      </div>
    </header>
    ${body}
  </main>
</body>
</html>`;
}

function adminLoginPage(error = "") {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CMS Login | Tech Magazine</title>
  <link rel="icon" href="/assets/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css?v=26">
</head>
<body>
  <section class="login-shell">
    <form class="login-card" method="post" action="/admin/login">
      <img class="login-logo" src="/assets/logo.svg" alt="Tech Magazine logo">
      <h1>Editorial login</h1>
      <p>Manage articles, comments, subscribers, and newsroom workflow.</p>
      ${error ? `<div class="alert">${escapeHtml(error)}</div>` : ""}
      <label>Email<input type="email" name="email" autocomplete="username" required></label>
      <label>Password<input type="password" name="password" autocomplete="current-password" required></label>
      <label>2FA code<input name="twoFactorCode" inputmode="numeric" placeholder="Only if enabled"></label>
      <button class="button primary" type="submit">Log in</button>
      <a href="/admin/forgot">Forgot password?</a>
      <small>Authorized newsroom staff only.</small>
    </form>
  </section>
</body>
</html>`;
}

function forgotPasswordPage(message = "") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Password Recovery | Tech Magazine</title><link rel="stylesheet" href="/styles.css?v=26"></head><body><section class="login-shell"><form class="login-card" method="post" action="/admin/forgot"><h1>Password recovery</h1>${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}<label>Email<input type="email" name="email" autocomplete="username" required></label><button class="button primary" type="submit">Create reset link</button><a href="/admin/login">Back to login</a></form></section></body></html>`;
}

function resetPasswordPage(token, message = "") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Reset Password | Tech Magazine</title><link rel="stylesheet" href="/styles.css?v=26"></head><body><section class="login-shell"><form class="login-card" method="post" action="/admin/reset"><h1>Reset password</h1>${message ? `<div class="alert">${escapeHtml(message)}</div>` : ""}<input type="hidden" name="token" value="${escapeHtml(token)}"><label>New password<input type="password" name="password" minlength="8" required></label><button class="button primary" type="submit">Update password</button><a href="/admin/login">Back to login</a></form></section></body></html>`;
}

function dashboardPage(user) {
  const stats = getAdminStats();
  const workspaceActions = [
    can(user, "articles") ? ["New article", "/admin/articles/new", "Draft, submit, or schedule a story."] : null,
    can(user, "workflow") || can(user, "articles") ? ["Review queue", "/admin/workflow", "Assignments, notes, deadlines, and approvals."] : null,
    can(user, "media") || can(user, "articles") ? ["Media library", "/admin/media", "Upload images, audio, and video assets."] : null,
    can(user, "comments") ? ["Moderation", "/admin/comments", "Review comments, reports, and community activity."] : null,
    can(user, "all") ? ["Users and roles", "/admin/users", "Create accounts and assign privilege sets."] : null
  ].filter(Boolean);
  const statCards = [
    ["Total articles", stats.articles],
    ["Published", stats.published],
    ["Drafts/review", stats.drafts],
    ["Pending comments", stats.pendingComments],
    ["Subscribers", stats.subscribers],
    ["Total views", stats.views]
  ].map(([label, value]) => `<article><span>${label}</span><strong>${Number(value).toLocaleString()}</strong></article>`).join("");

  const rows = getAdminArticles().slice(0, 6).map((article) => `
    <tr>
      <td><strong>${escapeHtml(article.title)}</strong><small>${escapeHtml(article.slug)}</small></td>
      <td>${escapeHtml(article.category)}</td>
      <td><span class="status">${escapeHtml(article.status)}</span></td>
      <td>${Number(article.views).toLocaleString()}</td>
    </tr>
  `).join("");

  return adminLayout("Dashboard", user, `
    <section class="admin-heading admin-hero-heading">
      <div>
        <span>${can(user, "all") ? "Platform overview" : "Your workspace"}</span>
        <h1>${can(user, "all") ? "Newsroom dashboard" : `${escapeHtml(user.role)} dashboard`}</h1>
        <p>${can(user, "all") ? "Monitor the full publishing, audience, and operations stack." : "Focused tools for the work your role is allowed to do."}</p>
      </div>
      ${can(user, "articles") ? `<a class="button primary" href="/admin/articles/new">New article</a>` : ""}
    </section>
    <section class="admin-quick-actions">
      ${workspaceActions.map(([label, href, description]) => `<a href="${href}"><span>${escapeHtml(label)}</span><small>${escapeHtml(description)}</small></a>`).join("")}
    </section>
    <section class="admin-stats">${statCards}</section>
    <section class="admin-panel">
      <h2>Top editorial items</h2>
      <table><thead><tr><th>Article</th><th>Category</th><th>Status</th><th>Views</th></tr></thead><tbody>${rows}</tbody></table>
    </section>
  `);
}

function articlesPage(user, urlOrMessage = null, message = "") {
  const { url } = resolveAdminPageArgs(urlOrMessage, message, "/admin/articles");
  const page = adminListPage(url, getAdminArticles(), "/admin/articles");
  const rows = page.rows.map((article) => `
    <tr>
      <td><strong>${escapeHtml(article.title)}</strong><small>${escapeHtml(article.slug)}</small></td>
      <td>${escapeHtml(article.channel)}</td>
      <td>${escapeHtml(article.category)}</td>
      <td>
        <span class="status">${article.deletedAt ? "deleted" : escapeHtml(article.status)}</span>
        ${article.expiresAt ? `<small>Expires ${escapeHtml(article.expiresAt)}</small>` : ""}
        ${article.deletedAt ? `<small>Deleted ${escapeHtml(article.deletedAt)}</small>` : ""}
      </td>
      <td>${escapeHtml(article.author)}</td>
      <td>
        <div class="inline-actions compact-actions">
          <a href="/admin/articles/${article.id}/edit">Edit</a>
          <form class="inline-form" method="post" action="/admin/articles/${article.id}/duplicate">${csrfInput(user)}<button type="submit">Duplicate</button></form>
          ${article.deletedAt
            ? `<form class="inline-form" method="post" action="/admin/articles/${article.id}/restore">${csrfInput(user)}<button type="submit">Restore</button></form>`
            : `<form class="inline-form" method="post" action="/admin/articles/${article.id}/delete">${csrfInput(user)}<button type="submit">Delete</button></form>`}
        </div>
      </td>
    </tr>
  `).join("");

  return adminLayout("Articles", user, `
    <section class="admin-heading"><span>CMS</span><h1>Article manager</h1><a class="button primary" href="/admin/articles/new">New article</a></section>
    <section class="admin-panel">
      ${page.controls}
      <table><thead><tr><th>Article</th><th>Section</th><th>Category</th><th>Status</th><th>Author</th><th></th></tr></thead><tbody>${rows}</tbody></table>
      ${page.controls}
    </section>
  `, "articles");
}

async function newsImportsPage(user, result = null) {
  const sources = await previewTechNewsSources();
  const publishedArticles = getArticles();
  const controlledSources = getNewsImportSources();
  const controlledById = new Map(controlledSources.map((source) => [source.id, source]));
  const statusOptions = ["source_policy", "published", "pending_review", "draft"];
  const sourceRows = sources.map((source) => {
    const control = controlledById.get(source.id) || source;
    return `
    <tr>
      <td>
        <label class="check-field"><input type="checkbox" name="enabled_${escapeHtml(source.id)}" ${control.enabled ? "checked" : ""}> <strong>${escapeHtml(source.source)}</strong></label>
        <small>${escapeHtml(source.url)}</small>
        <span class="status ${source.ok ? "published" : "rejected"}">${control.enabled ? (source.ok ? "Live" : "Needs attention") : "Disabled"}</span>
      </td>
      <td>${Number(source.items || 0).toLocaleString()}</td>
      <td><input name="priority_${escapeHtml(source.id)}" type="number" min="1" max="100" value="${Number(control.priority || source.priority || 50)}"></td>
      <td>
        <select name="trust_${escapeHtml(source.id)}">
          ${["high", "medium", "low"].map((level) => `<option value="${level}" ${control.trustLevel === level ? "selected" : ""}>${level}</option>`).join("")}
        </select>
      </td>
      <td>
        <select name="status_${escapeHtml(source.id)}">
          ${["published", "pending_review", "draft"].map((status) => `<option value="${status}" ${control.defaultStatus === status ? "selected" : ""}>${status.replace("_", " ")}</option>`).join("")}
        </select>
      </td>
      <td><input name="threshold_${escapeHtml(source.id)}" type="number" min="0" max="100" value="${Number(control.autoPublishMaxRisk || 50)}"></td>
      <td><textarea name="exclude_${escapeHtml(source.id)}" rows="3" placeholder="Skip if matched">${escapeHtml(control.excludeKeywords || "")}</textarea></td>
      <td><textarea name="inspection_${escapeHtml(source.id)}" rows="3" placeholder="Send to inspection">${escapeHtml(control.inspectionKeywords || "")}</textarea><input name="require_${escapeHtml(source.id)}" value="${escapeHtml(control.requireKeywords || "")}" placeholder="Required keywords, optional"></td>
      <td>${source.error ? escapeHtml(source.error) : "Ready"}</td>
    </tr>
  `;
  }).join("");
  const importedRows = (result?.imported || []).slice(0, 20).map((article) => `
    <tr>
      <td><strong>${escapeHtml(article.title)}</strong><small>${escapeHtml(article.slug)}</small></td>
      <td>${escapeHtml(article.source)}</td>
      <td><span class="status">${escapeHtml(article.status || "")}</span></td>
      <td>${Number(article.riskScore || 0).toLocaleString()}/100<small>${escapeHtml((article.riskReasons || []).slice(0, 2).join("; "))}</small></td>
      <td><a href="${escapeHtml(article.canonicalUrl)}" target="_blank" rel="noopener noreferrer">Original</a></td>
    </tr>
  `).join("");
  const resultPanel = result ? `
    <section class="admin-panel">
      <h2>Latest import result</h2>
      <div class="admin-stats compact">
        <article><span>Imported</span><strong>${Number(result.importedCount).toLocaleString()}</strong></article>
        <article><span>Sent to inspection</span><strong>${Number(result.inspectionCount || 0).toLocaleString()}</strong></article>
        <article><span>Skipped duplicates</span><strong>${Number(result.skippedCount).toLocaleString()}</strong></article>
        <article><span>Failed</span><strong>${Number(result.failedCount).toLocaleString()}</strong></article>
        <article><span>Published inventory</span><strong>${Number(result.publishedCount).toLocaleString()}</strong></article>
      </div>
      <table><thead><tr><th>Story</th><th>Source</th><th>Status</th><th>Risk</th><th>Canonical</th></tr></thead><tbody>${importedRows || "<tr><td colspan='5'>No new stories imported because the feeds were already in the CMS.</td></tr>"}</tbody></table>
    </section>
  ` : "";

  return adminLayout("News Imports", user, `
    <section class="admin-heading">
      <span>Automated news desk</span>
      <h1>Tech news imports</h1>
      <a class="button ghost" href="/admin/news-imports/inspection">Inspection queue</a>
      <a class="button ghost" href="/admin/news-imports/performance">Source performance</a>
      <form class="inline-form" method="post" action="/admin/news-imports/run">
        ${csrfInput(user)}
        <input name="limit" type="number" min="1" max="100" value="${Number(config.newsImportTargetCount || 50)}" aria-label="Import limit">
        <select name="status" aria-label="Publish status">
          ${statusOptions.map((status) => `<option value="${status}" ${status === config.newsImportStatus ? "selected" : ""}>${status.replace("_", " ")}</option>`).join("")}
        </select>
        <button class="button primary" type="submit">Import tech stories</button>
      </form>
    </section>
    <section class="admin-panel news-import-brief">
      <h2>How this works</h2>
      <p>The importer uses public RSS/API-style feeds from major tech sources and creates short credited briefs with canonical source links. Risk scoring runs before every save: low-risk items can publish automatically, risky items go to pending review, and excluded keywords are skipped.</p>
      <div class="admin-stats compact">
        <article><span>Target per run</span><strong>${Number(config.newsImportTargetCount || 50).toLocaleString()}</strong></article>
        <article><span>Published now</span><strong>${Number(publishedArticles.length).toLocaleString()}</strong></article>
        <article><span>Worker interval</span><strong>${Number(config.newsImportIntervalMinutes || 60).toLocaleString()}m</strong></article>
        <article><span>Auto worker</span><strong>${config.newsImportEnabled ? "On" : "Off"}</strong></article>
      </div>
    </section>
    ${resultPanel}
    <section class="admin-panel">
      <h2>Source quality controls</h2>
      <form method="post" action="/admin/news-imports/sources">
        ${csrfInput(user)}
        <table class="source-control-table"><thead><tr><th>Source</th><th>Items</th><th>Priority</th><th>Trust</th><th>Default route</th><th>Max auto risk</th><th>Exclude</th><th>Inspection rules</th><th>Note</th></tr></thead><tbody>${sourceRows}</tbody></table>
        <button class="button primary" type="submit">Save source controls</button>
      </form>
    </section>
  `, "newsimport");
}

function newsInspectionPage(user) {
  const items = getNewsImportInspectionQueue();
  const rows = items.map((article) => `
    <tr>
      <td>
        <strong>${escapeHtml(article.title)}</strong>
        <small>${escapeHtml(article.subtitle)}</small>
        <small>${escapeHtml(article.slug)}</small>
      </td>
      <td>${escapeHtml(article.category)}<small>${escapeHtml(article.author)}</small></td>
      <td><strong>${Number(article.riskScore || 0).toLocaleString()}/100</strong><small>${escapeHtml(article.riskReason || "Risk details are stored on the article body.")}</small></td>
      <td><a href="${escapeHtml(article.canonicalUrl)}" target="_blank" rel="noopener noreferrer">Original source</a></td>
      <td>
        <div class="inline-actions compact-actions">
          <a href="/admin/articles/${escapeHtml(article.id)}/edit">Inspect</a>
          <form class="inline-form" method="post" action="/admin/articles/${escapeHtml(article.id)}/status">${csrfInput(user)}<button name="status" value="approved" type="submit">Approve</button></form>
          <form class="inline-form" method="post" action="/admin/articles/${escapeHtml(article.id)}/status">${csrfInput(user)}<button name="status" value="published" type="submit">Publish</button></form>
          <form class="inline-form" method="post" action="/admin/articles/${escapeHtml(article.id)}/status">${csrfInput(user)}<button name="status" value="rejected" type="submit">Reject</button></form>
        </div>
      </td>
    </tr>
  `).join("");

  return adminLayout("Inspection Queue", user, `
    <section class="admin-heading">
      <span>Automated risk gate</span>
      <h1>Imported story inspection</h1>
      <a class="button ghost" href="/admin/news-imports">Source controls</a>
    </section>
    <section class="admin-stats compact">
      <article><span>Needs inspection</span><strong>${Number(items.length).toLocaleString()}</strong></article>
      <article><span>Route</span><strong>Pending review</strong></article>
      <article><span>Actions</span><strong>Approve / publish / reject</strong></article>
    </section>
    <section class="admin-panel">
      <h2>Risky imported articles</h2>
      <table><thead><tr><th>Story</th><th>Desk</th><th>Risk reason</th><th>Source</th><th>Decision</th></tr></thead><tbody>${rows || "<tr><td colspan='5'>No imported stories are waiting for inspection.</td></tr>"}</tbody></table>
    </section>
  `, "inspection");
}

function sourcePerformancePage(user) {
  const rows = getNewsImportSourcePerformance();
  const totals = rows.reduce((acc, source) => {
    acc.imported += source.importedCount;
    acc.rejected += source.rejectedCount;
    acc.pending += source.pendingInspectionCount;
    acc.duplicates += source.duplicateCount;
    acc.seen += source.seenCount;
    acc.riskTotal += source.averageRiskScore * Math.max(1, source.seenCount || source.importedCount || 1);
    acc.riskWeight += Math.max(1, source.seenCount || source.importedCount || 1);
    return acc;
  }, { imported: 0, rejected: 0, pending: 0, duplicates: 0, seen: 0, riskTotal: 0, riskWeight: 0 });
  const tableRows = rows.map((source) => {
    const riskClass = source.averageRiskScore >= 70 ? "rejected" : source.averageRiskScore >= 45 ? "scheduled" : "published";
    return `
      <tr>
        <td><strong>${escapeHtml(source.name)}</strong><small>${escapeHtml(source.url)}</small><small>${source.enabled ? "Enabled" : "Disabled"} / ${escapeHtml(source.trustLevel)} trust / priority ${Number(source.priority).toLocaleString()}</small></td>
        <td>${Number(source.importedCount).toLocaleString()}</td>
        <td>${Number(source.rejectedCount).toLocaleString()}</td>
        <td>${Number(source.pendingInspectionCount).toLocaleString()}</td>
        <td>${Number(source.duplicateRate).toLocaleString()}%<small>${Number(source.duplicateCount).toLocaleString()} duplicates / ${Number(source.seenCount).toLocaleString()} seen</small></td>
        <td><span class="status ${riskClass}">${Number(source.averageRiskScore).toLocaleString()}/100</span></td>
        <td>${Number(source.skippedCount).toLocaleString()}</td>
        <td>${Number(source.failedCount).toLocaleString()}</td>
      </tr>
    `;
  }).join("");

  return adminLayout("Source Performance", user, `
    <section class="admin-heading">
      <span>Import intelligence</span>
      <h1>Source performance dashboard</h1>
      <a class="button ghost" href="/admin/news-imports">Source controls</a>
      <a class="button ghost" href="/admin/news-imports/inspection">Inspection queue</a>
    </section>
    <section class="admin-stats compact">
      <article><span>Imported</span><strong>${Number(totals.imported).toLocaleString()}</strong></article>
      <article><span>Rejected</span><strong>${Number(totals.rejected).toLocaleString()}</strong></article>
      <article><span>Pending inspection</span><strong>${Number(totals.pending).toLocaleString()}</strong></article>
      <article><span>Duplicate rate</span><strong>${Number(Math.round((totals.duplicates / Math.max(1, totals.seen)) * 100)).toLocaleString()}%</strong></article>
      <article><span>Average risk</span><strong>${Number(Math.round(totals.riskTotal / Math.max(1, totals.riskWeight))).toLocaleString()}/100</strong></article>
    </section>
    <section class="admin-panel">
      <h2>Source performance</h2>
      <table><thead><tr><th>Source</th><th>Imported</th><th>Rejected</th><th>Pending inspection</th><th>Duplicate rate</th><th>Average risk</th><th>Skipped</th><th>Failed</th></tr></thead><tbody>${tableRows}</tbody></table>
    </section>
  `, "sourceperformance");
}

function statusActions(article, user) {
  const actions = [
    ["pending_review", "Submit"],
    ["approved", "Approve"],
    ["published", "Publish"],
    ["scheduled", "Schedule"],
    ["rejected", "Reject"],
    ["archived", "Archive"]
  ];
  return `
    <form class="inline-form" method="post" action="/admin/articles/${article.id}/status">
      ${csrfInput(user)}
      ${actions.map(([status, label]) => `<button name="status" value="${status}" ${article.status === status ? "disabled" : ""}>${label}</button>`).join("")}
    </form>
  `;
}

function workflowPage(user, urlOrStatus = "pending_review", statusOrMessage = "", message = "") {
  const url = urlOrStatus?.searchParams ? urlOrStatus : new URL("http://local/admin/workflow");
  const status = urlOrStatus?.searchParams ? String(statusOrMessage || "pending_review") : String(urlOrStatus || "pending_review");
  const notice = urlOrStatus?.searchParams ? String(message || "") : String(statusOrMessage || "");
  const statuses = ["all", "draft", "pending_review", "approved", "scheduled", "published", "rejected", "archived"];
  const operations = getWorkflowOperations(status);
  const allArticles = getAdminArticles();
  const users = getAdminUsers().filter((item) => item.status === "active");
  const articleOptions = allArticles.map((article) => `<option value="${escapeHtml(article.id)}">${escapeHtml(article.title)} (${escapeHtml(article.status)})</option>`).join("");
  const userOptions = users.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} / ${escapeHtml(item.role)}</option>`).join("");
  const articlePage = adminListPage(url, operations.articles, "/admin/workflow");
  const rows = articlePage.rows.map((article) => {
    const approvalSummary = article.approvals?.length
      ? article.approvals.slice(0, 3).map((item) => `${item.stage}:${item.status}`).join(", ")
      : "No approvals";
    return `
    <tr>
      <td><strong>${escapeHtml(article.title)}</strong><small>${escapeHtml(article.subtitle)}</small></td>
      <td>${escapeHtml(article.category)}</td>
      <td><span class="status">${escapeHtml(article.status.replace("_", " "))}</span></td>
      <td>${article.assignment ? `<strong>${escapeHtml(article.assignment.assignee)}</strong><small>${escapeHtml(article.assignment.priority)} / ${escapeHtml(article.assignment.dueAt || "No deadline")}</small>` : "<span class='muted'>Unassigned</span>"}</td>
      <td>${escapeHtml(approvalSummary)}</td>
      <td>${statusActions(article, user)}</td>
    </tr>
  `;
  }).join("");
  const assignmentRows = operations.assignments.slice(0, 8).map((item) => `
    <tr><td><strong>${escapeHtml(item.articleTitle)}</strong><small>${escapeHtml(item.brief)}</small></td><td>${escapeHtml(item.assignee)}</td><td>${escapeHtml(item.priority)}</td><td>${escapeHtml(item.dueAt || "")}</td><td><span class="status">${escapeHtml(item.status)}</span></td></tr>
  `).join("");
  const approvalRows = operations.approvals.slice(0, 8).map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.articleTitle)}</strong><small>${escapeHtml(item.notes || "")}</small></td>
      <td>${escapeHtml(item.stage)}</td>
      <td><span class="status">${escapeHtml(item.status)}</span></td>
      <td>
        <form class="inline-form" method="post" action="/admin/workflow/approvals/${item.id}/review">
          ${csrfInput(user)}
          <button name="status" value="approved" ${item.status !== "requested" ? "disabled" : ""}>Approve</button>
          <button name="status" value="rejected" ${item.status !== "requested" ? "disabled" : ""}>Reject</button>
        </form>
      </td>
    </tr>
  `).join("");
  const calendarRows = operations.calendar.slice(0, 8).map((item) => `
    <tr><td><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.notes || item.articleTitle || "")}</small></td><td>${escapeHtml(item.eventType)}</td><td>${escapeHtml(item.startsAt)}</td><td>${escapeHtml(item.owner || "")}</td><td><span class="status">${escapeHtml(item.status)}</span></td></tr>
  `).join("");
  const messageRows = operations.messages.slice(0, 8).map((item) => `
    <article class="topic-row"><span>${escapeHtml(item.channel)} / ${escapeHtml(item.userName || "System")}</span><p>${escapeHtml(item.message)}</p><small>${escapeHtml(item.articleTitle || "General newsroom")} / ${escapeHtml(item.createdAt)}</small></article>
  `).join("");
  const taskRows = operations.tasks.slice(0, 10).map((item) => `
    <tr><td><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.notes || item.articleTitle || "")}</small></td><td>${escapeHtml(item.taskType)}</td><td>${escapeHtml(item.assignee || "Unassigned")}</td><td>${escapeHtml(item.dueAt || "No deadline")}</td><td><span class="status">${escapeHtml(item.status)}</span></td></tr>
  `).join("");
  const shiftRows = operations.shifts.slice(0, 10).map((item) => `
    <tr><td><strong>${escapeHtml(item.userName)}</strong><small>${escapeHtml(item.coverageArea || item.notes || "")}</small></td><td>${escapeHtml(item.shiftRole)}</td><td>${escapeHtml(item.startsAt)}</td><td>${escapeHtml(item.endsAt || "")}</td><td><span class="status">${escapeHtml(item.status)}</span></td></tr>
  `).join("");
  const productivityRows = operations.productivity.slice(0, 8).map((item) => `
    <tr><td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.role)}</small></td><td>${Number(item.articleCount || 0).toLocaleString()}</td><td>${Number(item.completedAssignments || 0).toLocaleString()}</td><td>${Number(item.completedTasks || 0).toLocaleString()}</td><td>${Number(item.productivityScore || 0).toLocaleString()}</td></tr>
  `).join("");
  const pendingApprovals = operations.approvals.filter((item) => item.status === "requested").length;
  const urgentTasks = operations.tasks.filter((item) => item.priority === "urgent" && item.status !== "done").length;
  const activeShifts = operations.shifts.filter((item) => item.status === "active" || item.status === "scheduled").length;
  return adminLayout("Review Queue", user, `
    <section class="admin-heading"><span>Workflow</span><h1>Review queue</h1><a class="button primary" href="/admin/articles/new">New article</a></section>
    ${notice ? `<div class="alert success">${escapeHtml(notice)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Pending approvals</span><strong>${Number(pendingApprovals).toLocaleString()}</strong></article>
      <article><span>Open tasks</span><strong>${Number(operations.tasks.filter((item) => item.status !== "done").length).toLocaleString()}</strong></article>
      <article><span>Urgent tasks</span><strong>${Number(urgentTasks).toLocaleString()}</strong></article>
      <article><span>Scheduled shifts</span><strong>${Number(activeShifts).toLocaleString()}</strong></article>
    </section>
    <section class="admin-panel">
      <h2>Role workspaces</h2>
      <div class="mini-grid">
        <article class="reader-card"><span>Reporter dashboard</span><h2>Assignments and deadlines</h2><p>Reporters can track assigned stories, drafts, live coverage, and due dates from this workflow desk.</p></article>
        <article class="reader-card"><span>Writer dashboard</span><h2>Drafts, SEO, and collaboration</h2><p>Writers use article tools, editorial notes, media uploads, and approval requests to move content forward.</p></article>
        <article class="reader-card"><span>Editor dashboard</span><h2>Queues and moderation</h2><p>Editors review submitted content, assign work, approve articles, manage notes, and coordinate publication.</p></article>
        <article class="reader-card"><span>Chief editor controls</span><h2>Final approval and strategy</h2><p>Chief editors see legal approvals, sensitive content, productivity, publishing schedules, and shift coverage.</p></article>
      </div>
    </section>
    <nav class="status-tabs">${statuses.map((item) => `<a class="${status === item ? "active" : ""}" href="/admin/workflow?status=${item}">${item.replace("_", " ")}</a>`).join("")}</nav>
    <section class="admin-panel">
      ${articlePage.controls}
      <table><thead><tr><th>Article</th><th>Category</th><th>Status</th><th>Assignment</th><th>Approvals</th><th>Actions</th></tr></thead><tbody>${rows || "<tr><td colspan='6'>No articles in this queue.</td></tr>"}</tbody></table>
      ${articlePage.controls}
    </section>
    <section class="admin-panel">
      <h2>Assignment desk</h2>
      <form class="admin-form flat" method="post" action="/admin/workflow/assignments">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Article<select name="articleId">${articleOptions}</select></label>
          <label>Assignee<select name="assigneeId">${userOptions}</select></label>
          <label>Priority<select name="priority"><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option><option value="low">Low</option></select></label>
          <label>Status<select name="status"><option value="assigned">Assigned</option><option value="in_progress">In progress</option><option value="blocked">Blocked</option><option value="completed">Completed</option></select></label>
          <label>Due date<input type="datetime-local" name="dueAt"></label>
          <label>Brief<textarea name="brief" required></textarea></label>
        </div>
        <button class="button primary" type="submit">Save assignment</button>
      </form>
      <table><thead><tr><th>Article</th><th>Assignee</th><th>Priority</th><th>Due</th><th>Status</th></tr></thead><tbody>${assignmentRows || "<tr><td colspan='5'>No assignments yet.</td></tr>"}</tbody></table>
    </section>
    <section class="admin-panel">
      <h2>Multi-level approvals</h2>
      <form class="admin-form flat" method="post" action="/admin/workflow/approvals">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Article<select name="articleId">${articleOptions}</select></label>
          <label>Stage<select name="stage"><option value="editor">Editor</option><option value="chief_editor">Chief editor</option><option value="legal">Legal approval</option></select></label>
          <label>Sensitivity<select name="sensitivityLevel"><option value="normal">Normal</option><option value="sensitive">Sensitive</option><option value="legal">Legal risk</option><option value="embargoed">Embargoed</option></select></label>
          <label>Notes<textarea name="notes" placeholder="Approval context, risks, legal notes"></textarea></label>
        </div>
        <button class="button primary" type="submit">Request approval</button>
      </form>
      <table><thead><tr><th>Article</th><th>Stage</th><th>Status</th><th>Review</th></tr></thead><tbody>${approvalRows || "<tr><td colspan='4'>No approvals yet.</td></tr>"}</tbody></table>
    </section>
    <section class="admin-panel">
      <h2>Editorial calendar</h2>
      <form class="admin-form flat" method="post" action="/admin/workflow/calendar">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Title<input name="title" required></label>
          <label>Type<select name="eventType"><option value="deadline">Deadline</option><option value="publication">Publication</option><option value="event">Event</option><option value="campaign">Campaign</option><option value="legal">Legal</option></select></label>
          <label>Start<input type="datetime-local" name="startsAt" required></label>
          <label>End<input type="datetime-local" name="endsAt"></label>
          <label>Article<select name="articleId"><option value="">No article</option>${articleOptions}</select></label>
          <label>Owner<select name="ownerId"><option value="">No owner</option>${userOptions}</select></label>
          <label>Notes<textarea name="notes"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save calendar item</button>
      </form>
      <table><thead><tr><th>Event</th><th>Type</th><th>Start</th><th>Owner</th><th>Status</th></tr></thead><tbody>${calendarRows || "<tr><td colspan='5'>No calendar items yet.</td></tr>"}</tbody></table>
    </section>
    <section class="admin-panel">
      <h2>Task management</h2>
      <form class="admin-form flat" method="post" action="/admin/workflow/tasks">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Title<input name="title" required></label>
          <label>Type<select name="taskType"><option value="story">Story</option><option value="edit">Edit</option><option value="fact_check">Fact check</option><option value="legal">Legal</option><option value="homepage">Homepage</option><option value="live">Live coverage</option><option value="production">Production</option></select></label>
          <label>Article<select name="articleId"><option value="">No article</option>${articleOptions}</select></label>
          <label>Assignee<select name="assigneeId"><option value="">Unassigned</option>${userOptions}</select></label>
          <label>Priority<select name="priority"><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option><option value="low">Low</option></select></label>
          <label>Status<select name="status"><option value="open">Open</option><option value="in_progress">In progress</option><option value="blocked">Blocked</option><option value="done">Done</option></select></label>
          <label>Due<input type="datetime-local" name="dueAt"></label>
          <label>Notes<textarea name="notes"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save task</button>
      </form>
      <table><thead><tr><th>Task</th><th>Type</th><th>Assignee</th><th>Due</th><th>Status</th></tr></thead><tbody>${taskRows || "<tr><td colspan='5'>No workflow tasks yet.</td></tr>"}</tbody></table>
    </section>
    <section class="admin-panel">
      <h2>Shift management</h2>
      <form class="admin-form flat" method="post" action="/admin/workflow/shifts">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Team member<select name="userId">${userOptions}</select></label>
          <label>Shift role<select name="shiftRole"><option value="reporter">Reporter</option><option value="writer">Writer</option><option value="editor">Editor</option><option value="chief_editor">Chief editor</option><option value="producer">Producer</option><option value="moderator">Moderator</option><option value="legal">Legal</option></select></label>
          <label>Starts<input type="datetime-local" name="startsAt" required></label>
          <label>Ends<input type="datetime-local" name="endsAt"></label>
          <label>Coverage area<input name="coverageArea" placeholder="AI desk, CES, cybersecurity..."></label>
          <label>Status<select name="status"><option value="scheduled">Scheduled</option><option value="active">Active</option><option value="completed">Completed</option><option value="canceled">Canceled</option></select></label>
          <label>Notes<textarea name="notes"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save shift</button>
      </form>
      <table><thead><tr><th>Person</th><th>Role</th><th>Starts</th><th>Ends</th><th>Status</th></tr></thead><tbody>${shiftRows || "<tr><td colspan='5'>No shifts scheduled yet.</td></tr>"}</tbody></table>
    </section>
    <section class="admin-panel">
      <h2>Journalist productivity tracking</h2>
      <table><thead><tr><th>Journalist</th><th>Articles</th><th>Assignments</th><th>Tasks</th><th>Score</th></tr></thead><tbody>${productivityRows || "<tr><td colspan='5'>No productivity data yet.</td></tr>"}</tbody></table>
    </section>
    <section class="admin-panel" id="editorial-notes">
      <h2>Internal newsroom chat and Editorial notes</h2>
      <p>Post an internal newsroom message or attach an editorial note to a specific article. These notes stay inside the workflow area and are not shown to public readers.</p>
      <form class="admin-form flat" method="post" action="/admin/workflow/messages">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Channel<select name="channel"><option value="editorial">Editorial</option><option value="breaking">Breaking</option><option value="legal">Legal</option><option value="production">Production</option></select></label>
          <label>Article<select name="articleId"><option value="">General newsroom</option>${articleOptions}</select></label>
          <label>Editorial note / internal message<textarea name="message" required></textarea></label>
        </div>
        <button class="button primary" type="submit">Post internal note</button>
      </form>
      <p class="workflow-realtime-status" data-workflow-realtime>Realtime newsroom channel connecting...</p>
      <div class="workflow-message-list" data-workflow-messages>${messageRows || "<p class='muted'>No newsroom messages yet.</p>"}</div>
    </section>
  `, "workflow");
}

function homepagePage(user) {
  const rows = getAdminArticles().map((article) => `
    <tr>
      <td><strong>${escapeHtml(article.title)}</strong><small>${escapeHtml(article.slug)}</small></td>
      <td><span class="status">${escapeHtml(article.status.replace("_", " "))}</span></td>
      <td>
        <form class="inline-form flag-form" method="post" action="/admin/articles/${article.id}/homepage">
          ${csrfInput(user)}
          <label><input type="checkbox" name="featured" ${article.featured ? "checked" : ""}> Featured</label>
          <label><input type="checkbox" name="breaking" ${article.breaking ? "checked" : ""}> Breaking</label>
          <label><input type="checkbox" name="trending" ${article.trending ? "checked" : ""}> Trending</label>
          <button>Save</button>
        </form>
      </td>
    </tr>
  `).join("");

  return adminLayout("Homepage Controls", user, `
    <section class="admin-heading"><span>Distribution</span><h1>Homepage controls</h1></section>
    <section class="admin-panel">
      <table><thead><tr><th>Article</th><th>Status</th><th>Placements</th></tr></thead><tbody>${rows}</tbody></table>
    </section>
  `, "homepage");
}

function breakingNewsPage(user, message = "") {
  const articleOptions = getAdminArticles()
    .map((article) => `<option value="${escapeHtml(article.id)}">${escapeHtml(article.title)} (${escapeHtml(article.status)})</option>`)
    .join("");
  const rows = getBreakingNewsAlerts({ includeResolved: true }).map((alert) => `
    <tr>
      <td><strong>${escapeHtml(alert.title)}</strong><small>${escapeHtml(alert.summary)}</small></td>
      <td>${escapeHtml(alert.severity)}<small>Score ${Number(alert.priorityScore).toLocaleString()}</small></td>
      <td><span class="status">${escapeHtml(alert.status)}</span></td>
      <td>${alert.articleSlug ? `<a href="/#/article/${escapeHtml(alert.articleSlug)}">${escapeHtml(alert.articleTitle)}</a>` : `<a href="${escapeHtml(alert.linkUrl)}">Open link</a>`}</td>
      <td>
        <form class="inline-form" method="post" action="/admin/breaking-news/${alert.id}/activate">
          ${csrfInput(user)}
          <button type="submit" ${alert.status === "active" ? "disabled" : ""}>Activate</button>
        </form>
        <form class="inline-form" method="post" action="/admin/breaking-news/${alert.id}/resolve">
          ${csrfInput(user)}
          <button type="submit" ${alert.status === "resolved" ? "disabled" : ""}>Resolve</button>
        </form>
      </td>
    </tr>
  `).join("");
  return adminLayout("Breaking News", user, `
    <section class="admin-heading"><span>Emergency desk</span><h1>Breaking news system</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="admin-panel">
      <h2>Create breaking alert</h2>
      <form class="admin-form flat" method="post" action="/admin/breaking-news">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Linked article<select name="articleId"><option value="">No linked article</option>${articleOptions}</select></label>
          <label>Severity<select name="severity"><option value="standard">Standard</option><option value="high">High</option><option value="critical">Critical</option></select></label>
          <label>Priority score<input name="priorityScore" type="number" min="0" max="100" placeholder="Auto"></label>
          <label>Status<select name="status"><option value="draft">Draft</option><option value="pending">Pending fast approval</option></select></label>
          <label>Link URL<input name="linkUrl" placeholder="#/article/story-slug"></label>
          <label class="check-field"><input type="checkbox" name="notifyPush" checked> Send notification when activated</label>
          <label>Title<input name="title" placeholder="Uses linked article title if empty"></label>
          <label>Banner text<input name="bannerText" placeholder="Short homepage banner copy"></label>
          <label>Summary<textarea name="summary" placeholder="Uses linked article subtitle if empty"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save breaking alert</button>
      </form>
    </section>
    <section class="admin-panel">
      <h2>Breaking alerts</h2>
      <table><thead><tr><th>Alert</th><th>Priority</th><th>Status</th><th>Placement</th><th>Actions</th></tr></thead><tbody>${rows || "<tr><td colspan='5'>No breaking alerts yet.</td></tr>"}</tbody></table>
    </section>
  `, "breaking");
}

function liveBlogsPage(user, message = "") {
  const events = getLiveEvents({ includeDrafts: true });
  const conferenceOptions = getConferenceEvents({ includeDrafts: true })
    .map((event) => `<option value="${escapeHtml(event.id)}">${escapeHtml(event.title)}</option>`)
    .join("");
  const eventOptions = events
    .map((event) => `<option value="${escapeHtml(event.id)}">${escapeHtml(event.title)} (${escapeHtml(event.status)})</option>`)
    .join("");
  const rows = events.map((event) => `
    <tr>
      <td>
        <strong>${escapeHtml(event.title)}</strong>
        <small>${escapeHtml(event.coverageMode || "event")} coverage${event.conferenceTitle ? ` / ${escapeHtml(event.conferenceTitle)}` : ""}</small>
        <small>${escapeHtml(event.description)}</small>
      </td>
      <td><span class="status">${escapeHtml(event.status)}</span><small>${Number(event.updateCount || 0).toLocaleString()} updates / ${Number(event.commentCount || 0).toLocaleString()} comments</small></td>
      <td>${event.status !== "draft" ? `<a href="/#/live/${escapeHtml(event.slug)}">Open public page</a>` : `<span class="muted">Not public yet</span>`}</td>
      <td>
        <form class="inline-form" method="post" action="/admin/live-blogs/${event.id}/status">
          ${csrfInput(user)}
          <input type="hidden" name="status" value="live">
          <button type="submit" ${event.status === "live" ? "disabled" : ""}>Start</button>
        </form>
        <form class="inline-form" method="post" action="/admin/live-blogs/${event.id}/status">
          ${csrfInput(user)}
          <input type="hidden" name="status" value="ended">
          <button type="submit" ${event.status === "ended" ? "disabled" : ""}>End</button>
        </form>
      </td>
    </tr>
  `).join("");
  return adminLayout("Live Blogs", user, `
    <section class="admin-heading"><span>Live desk</span><h1>Live blogging system</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="admin-panel">
      <h2>Create live event</h2>
      <form class="admin-form flat" method="post" action="/admin/live-blogs">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Title<input name="title" placeholder="WWDC keynote live coverage"></label>
          <label>Slug<input name="slug" placeholder="wwdc-keynote-live"></label>
          <label>Status<select name="status"><option value="draft">Draft</option><option value="live">Live now</option><option value="ended">Ended</option></select></label>
          <label>Coverage mode<select name="coverageMode"><option value="event">Event coverage</option><option value="breaking">Breaking news</option><option value="conference">Conference hub</option><option value="launch">Product launch</option><option value="tournament">Gaming tournament</option></select></label>
          <label>Linked conference<select name="conferenceEventId"><option value="">No linked conference</option>${conferenceOptions}</select></label>
          <label>Auto-refresh seconds<input name="autoRefreshSeconds" type="number" min="5" max="120" value="20"></label>
          <label>Event date<input name="eventDate" type="datetime-local"></label>
          <label>Host<input name="host" placeholder="Newsroom desk"></label>
          <label>Cover image URL<input name="coverImage" placeholder="https://..."></label>
          <label class="check-field"><input type="checkbox" name="notifyUpdates" checked> Allow push notifications for updates</label>
          <label class="check-field"><input type="checkbox" name="homepageOverride"> Instant homepage override while live</label>
          <label class="check-field"><input type="checkbox" name="allowComments" checked> Allow live event comments</label>
          <label>Description<textarea name="description" placeholder="What this live coverage follows"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save live event</button>
      </form>
    </section>
    <section class="admin-panel">
      <h2>Post live update</h2>
      <form class="admin-form flat" method="post" action="/admin/live-blogs/updates">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Event<select name="eventId">${eventOptions || `<option value="">Create a live event first</option>`}</select></label>
          <label>Update type<select name="updateType"><option value="text">Text</option><option value="key_moment">Key moment</option><option value="social">Social embed</option><option value="video">Video</option></select></label>
          <label>Source URL<input name="sourceUrl" placeholder="Optional video, tweet, or source link"></label>
          <label class="check-field"><input type="checkbox" name="pinned"> Pin this update</label>
          <label class="check-field"><input type="checkbox" name="notifyPush"> Send push notification</label>
          <label>Update title<input name="title" placeholder="Apple announces..."></label>
          <label>Update body<textarea name="body" placeholder="Timestamped live update body"></textarea></label>
        </div>
        <button class="button primary" type="submit" ${events.length ? "" : "disabled"}>Post update</button>
      </form>
    </section>
    <section class="admin-panel">
      <h2>Live events</h2>
      <table><thead><tr><th>Event</th><th>Status</th><th>Public page</th><th>Actions</th></tr></thead><tbody>${rows || "<tr><td colspan='4'>No live events yet.</td></tr>"}</tbody></table>
    </section>
  `, "liveblogs");
}

function videoCenterPage(user, message = "") {
  const playlists = getVideoPlaylists({ includeDrafts: true });
  const videos = getVideos({ includeDrafts: true, limit: 200 });
  const dashboard = getVideoPlatformDashboard();
  const readiness = dashboard.streaming;
  const blockerRows = readiness.blockers.length ? readiness.blockers.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>Video platform streaming checks passed.</li>";
  const warningRows = readiness.warnings.length ? readiness.warnings.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>No video platform warnings.</li>";
  const collections = getAdminCollections();
  const uploadedVideos = getAdminMedia().filter((item) => String(item.type || "").startsWith("video/"));
  const playlistOptions = playlists.map((playlist) => `<option value="${escapeHtml(playlist.id)}">${escapeHtml(playlist.title)}</option>`).join("");
  const categoryOptions = collections.categories.map((category) => `<option value="${escapeHtml(category.slug)}">${escapeHtml(category.name)}</option>`).join("");
  const videoCategoryOptions = dashboard.categories.map((category) => `<option value="${escapeHtml(category.slug)}">${escapeHtml(category.name)}</option>`).join("");
  const uploadOptions = uploadedVideos.map((media) => `<option value="${escapeHtml(media.url)}">${escapeHtml(media.title)} (${escapeHtml(media.url)})</option>`).join("");
  const playlistRows = playlists.map((playlist) => `
    <tr>
      <td><strong>${escapeHtml(playlist.title)}</strong><small>${escapeHtml(playlist.description)}</small></td>
      <td>${escapeHtml(playlist.slug)}</td>
      <td><span class="status">${escapeHtml(playlist.status)}</span></td>
      <td>${Number(playlist.videoCount || 0).toLocaleString()} videos</td>
    </tr>
  `).join("");
  const videoRows = videos.map((video) => `
    <tr>
      <td><strong>${escapeHtml(video.title)}</strong><small>${escapeHtml(video.description)}</small></td>
      <td>${escapeHtml(video.sourceType)}<small>${escapeHtml(video.playlistTitle || "No playlist")}</small></td>
      <td><span class="status">${escapeHtml(video.status)}</span>${video.featured ? "<small>Featured</small>" : ""}</td>
      <td>${video.status === "published" ? `<a href="/#/video/${escapeHtml(video.slug)}">Open public page</a>` : `<span class="muted">Draft</span>`}</td>
    </tr>
  `).join("");
  return adminLayout("Video Center", user, `
    <section class="admin-heading"><span>Video media center</span><h1>Videos, playlists, SEO, transcripts</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Videos</span><strong>${Number(dashboard.totals.videos).toLocaleString()}</strong></article>
      <article><span>Published</span><strong>${Number(dashboard.totals.published).toLocaleString()}</strong></article>
      <article><span>Categories</span><strong>${Number(dashboard.totals.categories).toLocaleString()}</strong></article>
      <article><span>Watch seconds</span><strong>${Number(dashboard.totals.watchSeconds).toLocaleString()}</strong></article>
      <article><span>Adaptive delivery</span><strong>${dashboard.totals.adaptiveReady ? "Ready" : "Action needed"}</strong></article>
    </section>
    <section class="admin-panel">
      <h2>Video platform readiness</h2>
      <p class="muted">Provider: ${escapeHtml(readiness.provider)} / transcoder: ${escapeHtml(readiness.transcoderMode)} / storage: ${escapeHtml(readiness.mediaStorageProvider)}</p>
      <div class="readiness-grid">
        <article class="${readiness.productionReady ? "ready" : "blocked"}"><strong>${readiness.productionReady ? "Ready" : "Blocked"}</strong><span>Production video delivery</span></article>
        <article class="${readiness.adaptiveStreamingReady ? "ready" : "blocked"}"><strong>${readiness.adaptiveStreamingReady ? "Ready" : "Blocked"}</strong><span>Adaptive quality path</span></article>
        <article><strong>${Number(readiness.hlsSegmentSeconds || 0).toLocaleString()} sec</strong><span>HLS segment target</span></article>
      </div>
      <h3>Blockers</h3>
      <ul>${blockerRows}</ul>
      <h3>Warnings</h3>
      <ul>${warningRows}</ul>
    </section>
    <section class="admin-panel">
      <h2>Create video category</h2>
      <form class="admin-form flat" method="post" action="/admin/videos/categories">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Name<input name="name" required></label>
          <label>Slug<input name="slug"></label>
          <label>Status<select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <label>Thumbnail URL<input name="thumbnailUrl" placeholder="/uploads/category.webp"></label>
          <label class="check-field"><input type="checkbox" name="featured"> Featured category</label>
          <label>Description<textarea name="description" required></textarea></label>
          <label>SEO title<input name="seoTitle"></label>
          <label>SEO description<textarea name="seoDescription"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save video category</button>
      </form>
    </section>
    <section class="admin-panel">
      <h2>Create playlist</h2>
      <form class="admin-form flat" method="post" action="/admin/videos/playlists">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Title<input name="title" required></label>
          <label>Slug<input name="slug"></label>
          <label>Status<select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <label>Description<textarea name="description" required></textarea></label>
        </div>
        <button class="button primary" type="submit">Save playlist</button>
      </form>
    </section>
    <section class="admin-panel">
      <h2>Publish video</h2>
      <form class="admin-form flat" method="post" action="/admin/videos">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Playlist<select name="playlistId"><option value="">No playlist</option>${playlistOptions}</select></label>
          <label>Article category<select name="category"><option value="">No article category</option>${categoryOptions}</select></label>
          <label>Video category<select name="videoCategory"><option value="">No video category</option>${videoCategoryOptions}</select></label>
          <label>Source type<select name="sourceType"><option value="upload">Uploaded MP4</option><option value="hls">Adaptive HLS</option><option value="youtube">YouTube</option><option value="stream">Stream</option><option value="external">External</option></select></label>
          <label>Streaming provider<select name="streamingProvider"><option value="local">Local MP4</option><option value="digitalocean-hls">DigitalOcean HLS</option><option value="mux">Mux</option><option value="cloudflare-stream">Cloudflare Stream</option><option value="youtube">YouTube</option></select></label>
          <label>Status<select name="status"><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <label>Title<input name="title" required></label>
          <label>Slug<input name="slug"></label>
          <label>Video URL<input name="videoUrl" list="uploaded-video-options" placeholder="/uploads/video.mp4 or https://youtube.com/watch?v=..." required></label>
          <label>HLS manifest URL<input name="hlsUrl" placeholder="https://cdn.example.com/video/master.m3u8"></label>
          <label>DASH manifest URL<input name="dashUrl" placeholder="https://cdn.example.com/video/manifest.mpd"></label>
          <label>Thumbnail URL<input name="thumbnailUrl" placeholder="/uploads/thumbnail.webp"></label>
          <label>Duration seconds<input name="durationSeconds" type="number" min="0" value="0"></label>
          <label class="check-field"><input type="checkbox" name="featured"> Feature this video</label>
          <label class="check-field"><input type="checkbox" name="liveChatEnabled"> Enable live comments/chat</label>
          <label>Description<textarea name="description" required></textarea></label>
          <label>Transcript<textarea name="transcript" placeholder="Optional transcript for accessibility and SEO"></textarea></label>
          <label>Subtitles<textarea name="subtitles" placeholder="English | /captions/video-en.vtt | en&#10;Arabic | /captions/video-ar.vtt | ar"></textarea></label>
          <label>SEO title<input name="seoTitle"></label>
          <label>SEO description<textarea name="seoDescription"></textarea></label>
        </div>
        <datalist id="uploaded-video-options">${uploadOptions}</datalist>
        <button class="button primary" type="submit">Save video</button>
      </form>
    </section>
    <section class="admin-panel"><h2>Playlists</h2><table><thead><tr><th>Playlist</th><th>Slug</th><th>Status</th><th>Videos</th></tr></thead><tbody>${playlistRows || "<tr><td colspan='4'>No playlists yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Video categories</h2><table><thead><tr><th>Category</th><th>Slug</th><th>Status</th><th>Videos</th></tr></thead><tbody>${dashboard.categories.map((category) => `<tr><td><strong>${escapeHtml(category.name)}</strong><small>${escapeHtml(category.description)}</small></td><td>${escapeHtml(category.slug)}</td><td><span class="status">${escapeHtml(category.status)}</span>${category.featured ? "<small>Featured</small>" : ""}</td><td>${Number(category.videoCount || 0).toLocaleString()}</td></tr>`).join("") || "<tr><td colspan='4'>No video categories yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Videos</h2><table><thead><tr><th>Video</th><th>Source</th><th>Status</th><th>Public page</th></tr></thead><tbody>${videoRows || "<tr><td colspan='4'>No videos yet.</td></tr>"}</tbody></table></section>
  `, "videos");
}

function podcastCenterPage(user, message = "") {
  const shows = getPodcastShows({ includeDrafts: true });
  const episodes = getPodcastEpisodes({ includeDrafts: true, limit: 200 });
  const categories = getPodcastCategories();
  const dashboard = getPodcastPlatformDashboard();
  const articles = getAdminArticles();
  const uploadedAudio = getAdminMedia().filter((item) => String(item.type || "").startsWith("audio/"));
  const showOptions = shows.map((show) => `<option value="${escapeHtml(show.id)}">${escapeHtml(show.title)}</option>`).join("");
  const showParentOptions = shows.map((show) => `<option value="${escapeHtml(show.id)}">${escapeHtml(show.title)}</option>`).join("");
  const categoryOptions = categories.map((category) => `<option value="${escapeHtml(category.slug)}">${escapeHtml(category.name)}</option>`).join("");
  const articleOptions = articles.map((article) => `<option value="${escapeHtml(article.id)}">${escapeHtml(article.title)}</option>`).join("");
  const audioOptions = uploadedAudio.map((media) => `<option value="${escapeHtml(media.url)}">${escapeHtml(media.title)} (${escapeHtml(media.url)})</option>`).join("");
  const categoryRows = categories.map((category) => `
    <tr>
      <td><strong>${escapeHtml(category.name)}</strong><small>${escapeHtml(category.description)}</small></td>
      <td>${escapeHtml(category.slug)}</td>
      <td><span class="status">${escapeHtml(category.status)}</span>${category.featured ? "<small>Featured</small>" : ""}</td>
      <td>${Number(category.showCount || 0).toLocaleString()}</td>
    </tr>
  `).join("");
  const distributionRows = dashboard.distribution.map((item) => `
    <tr>
      <td>${escapeHtml(item.provider)}</td>
      <td><span class="status">${escapeHtml(item.status)}</span></td>
      <td>${Number(item.count || 0).toLocaleString()}</td>
    </tr>
  `).join("");
  const showRows = shows.map((show) => `
    <tr>
      <td><strong>${escapeHtml(show.title)}</strong><small>${escapeHtml(show.description)}</small></td>
      <td>${escapeHtml(show.categoryName || "Uncategorized")}<small>${escapeHtml((show.hosts || []).join(", ") || show.host || "No host set")}</small></td>
      <td><span class="status">${escapeHtml(show.status)}</span>${show.featured ? "<small>Featured</small>" : ""}</td>
      <td>${Number(show.episodeCount || 0).toLocaleString()} episodes</td>
      <td>${show.status === "published" ? `<a href="/#/podcast/${escapeHtml(show.slug)}">Open show</a>` : `<span class="muted">Draft</span>`}</td>
    </tr>
  `).join("");
  const episodeRows = episodes.map((episode) => `
    <tr>
      <td><strong>${escapeHtml(episode.title)}</strong><small>${escapeHtml(episode.description)}</small></td>
      <td>${escapeHtml(episode.showTitle)}<small>Episode ${Number(episode.episodeNumber || 0).toLocaleString()}</small></td>
      <td><span class="status">${escapeHtml(episode.status)}</span>${episode.featured ? "<small>Featured</small>" : ""}</td>
      <td>${episode.status === "published" ? `<a href="/#/podcast-episode/${escapeHtml(episode.slug)}">Open episode</a>` : `<span class="muted">Draft</span>`}</td>
    </tr>
  `).join("");
  return adminLayout("Podcasts", user, `
    <section class="admin-heading"><span>Podcast system</span><h1>Shows, episodes, audio, RSS</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="admin-panel">
      <h2>Podcast operations</h2>
      <div class="stat-grid">
        <article><span>Shows</span><strong>${Number(dashboard.totals.shows || 0).toLocaleString()}</strong><small>${Number(dashboard.totals.publishedShows || 0).toLocaleString()} published</small></article>
        <article><span>Episodes</span><strong>${Number(dashboard.totals.episodes || 0).toLocaleString()}</strong><small>${Number(dashboard.totals.publishedEpisodes || 0).toLocaleString()} published</small></article>
        <article><span>Listen time</span><strong>${Math.round(Number(dashboard.totals.listenSeconds || 0) / 60).toLocaleString()}m</strong><small>${Number(dashboard.totals.events || 0).toLocaleString()} player events</small></article>
        <article><span>Revenue flags</span><strong>${Number(dashboard.totals.sponsoredEpisodes || 0).toLocaleString()}</strong><small>${Number(dashboard.totals.premiumEpisodes || 0).toLocaleString()} premium episodes</small></article>
      </div>
      ${dashboard.rss.ok ? `<p class="muted">RSS validation is passing.</p>` : `<div class="alert warning">${dashboard.rss.issues.map(escapeHtml).join("<br>")}</div>`}
    </section>
    <section class="admin-panel">
      <h2>Create podcast category</h2>
      <form class="admin-form flat" method="post" action="/admin/podcasts/categories">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Name<input name="name" required></label>
          <label>Slug<input name="slug"></label>
          <label>Cover image URL<input name="coverImage" placeholder="/uploads/podcast-category.webp"></label>
          <label>Status<select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <label class="check-field"><input type="checkbox" name="featured"> Feature this category</label>
          <label>Description<textarea name="description" required></textarea></label>
          <label>SEO title<input name="seoTitle"></label>
          <label>SEO description<textarea name="seoDescription"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save category</button>
      </form>
    </section>
    <section class="admin-panel">
      <h2>Create show</h2>
      <form class="admin-form flat" method="post" action="/admin/podcasts/shows">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Title<input name="title" required></label>
          <label>Slug<input name="slug"></label>
          <label>Category<select name="categorySlug"><option value="">Uncategorized</option>${categoryOptions}</select></label>
          <label>Host<input name="host" placeholder="Editorial host or newsroom desk"></label>
          <label>Hosts<input name="hosts" placeholder="Host One, Host Two"></label>
          <label>Tags<input name="tags" placeholder="ai, startups, security"></label>
          <label>Network parent<select name="networkParentId"><option value="">Standalone show</option>${showParentOptions}</select></label>
          <label>Language<input name="language" value="en"></label>
          <label>Cover image URL<input name="coverImage" placeholder="/uploads/podcast-cover.webp"></label>
          <label>Status<select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <label>Spotify URL<input name="spotifyUrl"></label>
          <label>Apple Podcasts URL<input name="appleUrl"></label>
          <label>Google Podcasts URL<input name="googlePodcastsUrl" placeholder="Legacy directory URL if needed"></label>
          <label>Amazon Music URL<input name="amazonUrl"></label>
          <label>Pocket Casts URL<input name="pocketCastsUrl"></label>
          <label>Overcast URL<input name="overcastUrl"></label>
          <label>External URL<input name="externalUrl"></label>
          <label class="check-field"><input type="checkbox" name="featured"> Feature this show</label>
          <label>Description<textarea name="description" required></textarea></label>
          <label>SEO title<input name="seoTitle"></label>
          <label>SEO description<textarea name="seoDescription"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save show</button>
      </form>
    </section>
    <section class="admin-panel">
      <h2>Publish episode</h2>
      <form class="admin-form flat" method="post" action="/admin/podcasts/episodes">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Show<select name="showId">${showOptions || `<option value="">Create a show first</option>`}</select></label>
          <label>Status<select name="status"><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <label>Episode number<input name="episodeNumber" type="number" min="0" value="0"></label>
          <label>Duration seconds<input name="durationSeconds" type="number" min="0" value="0"></label>
          <label>Title<input name="title" required></label>
          <label>Slug<input name="slug"></label>
          <label>Audio URL<input name="audioUrl" list="uploaded-audio-options" placeholder="/uploads/episode.mp3 or https://..." required></label>
          <label>Thumbnail URL<input name="thumbnailUrl" placeholder="/uploads/episode-thumb.webp"></label>
          <label>Scheduled at<input name="scheduledAt" type="datetime-local"></label>
          <label>Tags<input name="tags" placeholder="ai, enterprise, interview"></label>
          <label>Related article<select name="relatedArticleId"><option value="">No linked article</option>${articleOptions}</select></label>
          <label>Audio provider<select name="audioStorageProvider"><option value="local">Local URL</option><option value="digitalocean-spaces">DigitalOcean Spaces</option><option value="external-cdn">External CDN</option></select></label>
          <label>Audio format<input name="audioFormat" placeholder="mp3"></label>
          <label>Bitrate<input name="bitrate" placeholder="128kbps"></label>
          <label>Loudness<input name="loudness" placeholder="-16 LUFS"></label>
          <label>Audio source<input name="audioSource" placeholder="studio, remote, ai-narration"></label>
          <label>Sponsor name<input name="sponsorName"></label>
          <label class="check-field"><input type="checkbox" name="featured"> Feature this episode</label>
          <label class="check-field"><input type="checkbox" name="premium"> Premium episode</label>
          <label class="check-field"><input type="checkbox" name="aiTranscription"> Queue AI transcription</label>
          <label>Description<textarea name="description" required></textarea></label>
          <label>Summary<textarea name="summary" placeholder="Short episode summary"></textarea></label>
          <label>Chapters<textarea name="chapters" placeholder="00:00 | Intro&#10;08:30 | Interview begins | https://example.com"></textarea></label>
          <label>Clips<textarea name="clips" placeholder="00:30 | 01:10 | Launch quote"></textarea></label>
          <label>Transcript<textarea name="transcript" placeholder="Optional transcript for accessibility and SEO"></textarea></label>
          <label>SEO title<input name="seoTitle"></label>
          <label>SEO description<textarea name="seoDescription"></textarea></label>
        </div>
        <datalist id="uploaded-audio-options">${audioOptions}</datalist>
        <button class="button primary" type="submit" ${shows.length ? "" : "disabled"}>Save episode</button>
      </form>
    </section>
    <section class="admin-panel"><h2>Podcast categories</h2><table><thead><tr><th>Category</th><th>Slug</th><th>Status</th><th>Shows</th></tr></thead><tbody>${categoryRows || "<tr><td colspan='4'>No podcast categories yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Distribution</h2><table><thead><tr><th>Provider</th><th>Status</th><th>Shows</th></tr></thead><tbody>${distributionRows || "<tr><td colspan='3'>No distribution records yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Shows</h2><table><thead><tr><th>Show</th><th>Category and hosts</th><th>Status</th><th>Episodes</th><th>Public</th></tr></thead><tbody>${showRows || "<tr><td colspan='5'>No podcast shows yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Episodes</h2><table><thead><tr><th>Episode</th><th>Show</th><th>Status</th><th>Public</th></tr></thead><tbody>${episodeRows || "<tr><td colspan='4'>No podcast episodes yet.</td></tr>"}</tbody></table></section>
  `, "podcasts");
}

function reviewsPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/reviews");
  const dashboard = getProductReviewDashboard();
  const reviews = dashboard.reviews;
  const articles = getAdminArticles();
  const articleOptions = articles.map((article) => `<option value="${escapeHtml(article.id)}">${escapeHtml(article.title)}</option>`).join("");
  const page = adminListPage(args.url, reviews, "/admin/reviews");
  const readinessRows = Object.entries(dashboard.controls).map(([key, value]) => `<span class="${value === true && !key.includes("Required") ? "ready" : "pending"}">${escapeHtml(key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase()))}</span>`).join("");
  const workflowCards = dashboard.workflow.map((step, index) => `<article><span>${Number(index + 1).toLocaleString()}</span><strong>${escapeHtml(step.stage)}</strong><small>${escapeHtml(step.detail)}</small></article>`).join("");
  const rows = page.rows.map((review) => `
    <tr>
      <td><strong>${escapeHtml(review.productName)}</strong><small>${escapeHtml(review.brand || review.productCategory)}</small></td>
      <td>${Number(review.rating).toFixed(1)} / ${Number(review.ratingMax).toFixed(0)}</td>
      <td>${escapeHtml(review.scoreLabel || "Review")}</td>
      <td><span class="status">${escapeHtml(review.status)}</span></td>
      <td>${review.articleSlug ? `<a href="/#/article/${escapeHtml(review.articleSlug)}">Article</a>` : ""} <a href="/#/review/${escapeHtml(review.slug)}">Public</a></td>
    </tr>
  `).join("");
  return adminLayout("Reviews", user, `
    <section class="admin-heading"><span>Product desk</span><h1>Product review and comparison command center</h1></section>
    ${args.message ? `<div class="alert success">${escapeHtml(args.message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Reviews</span><strong>${Number(dashboard.stats.reviews).toLocaleString()}</strong><small>${Number(dashboard.stats.published).toLocaleString()} published</small></article>
      <article><span>Average rating</span><strong>${Number(dashboard.stats.averageRating).toFixed(1)}</strong><small>out of 10</small></article>
      <article><span>Specs</span><strong>${Number(dashboard.stats.specs).toLocaleString()}</strong><small>structured rows</small></article>
      <article><span>Benchmarks</span><strong>${Number(dashboard.stats.benchmarks).toLocaleString()}</strong><small>test results</small></article>
      <article><span>Affiliate ready</span><strong>${Number(dashboard.stats.affiliateReady).toLocaleString()}</strong><small>product URLs</small></article>
      <article><span>Structured reviews</span><strong>${Number(dashboard.stats.structured).toLocaleString()}</strong><small>pros, cons, specs, tests</small></article>
    </section>
    <section class="admin-grid two review-admin-command">
      <article class="admin-panel">
        <h2>Review workflow</h2>
        <div class="review-workflow-grid">${workflowCards}</div>
      </article>
      <article class="admin-panel">
        <h2>Readiness and compliance</h2>
        <p>Use this desk for professional product reviews, comparison tables, benchmark records, verdicts, affiliate-ready product links, and Review schema validation.</p>
        <div class="readiness-list">${readinessRows}</div>
      </article>
    </section>
    <section class="admin-panel">
      <h2>Create product review</h2>
      <form class="admin-form flat" method="post" action="/admin/reviews">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Linked article<select name="articleId"><option value="">No linked article</option>${articleOptions}</select></label>
          <label>Product name<input name="productName" required></label>
          <label>Slug<input name="slug" placeholder="auto-generated"></label>
          <label>Brand<input name="brand"></label>
          <label>Product category<select name="productCategory"><option value="hardware">Hardware</option><option value="software">Software</option><option value="mobile">Mobile</option><option value="gaming">Gaming</option><option value="cloud">Cloud</option><option value="security">Security</option><option value="gadget">Gadget</option></select></label>
          <label>Product URL<input name="productUrl"></label>
          <label>Image URL<input name="imageUrl"></label>
          <label>Rating out of 10<input type="number" step="0.1" min="0" max="10" name="rating" value="8.0"></label>
          <label>Score label<input name="scoreLabel" placeholder="Editor's Choice"></label>
          <label>Status<select name="status"><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <label>Pros<textarea name="pros" placeholder="One pro per line"></textarea></label>
          <label>Cons<textarea name="cons" placeholder="One con per line"></textarea></label>
          <label>Specifications<textarea name="specs" placeholder="Chip: Example processor&#10;Display: 14 inch OLED"></textarea></label>
          <label>Benchmarks<textarea name="benchmarks" placeholder="Battery test | 9.5 | hours | Looping video&#10;Geekbench | 1840 | single-core | Performance mode"></textarea></label>
          <label>Comparison notes<textarea name="comparisons" placeholder="Competitor A: Better battery, weaker display"></textarea></label>
          <label>Verdict<textarea name="verdict" required placeholder="Clear buying advice and editorial conclusion."></textarea></label>
        </div>
        <button class="button primary" type="submit">Save review</button>
      </form>
    </section>
    <section class="admin-panel">${page.controls}<table><thead><tr><th>Product</th><th>Rating</th><th>Label</th><th>Status</th><th>Links</th></tr></thead><tbody>${rows || "<tr><td colspan='5'>No product reviews yet.</td></tr>"}</tbody></table>${page.controls}</section>
  `, "reviews");
}

function devicesPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/devices");
  const dashboard = getDeviceDashboard();
  const deviceOptions = dashboard.devices.map((device) => `<option value="${escapeHtml(device.id)}">${escapeHtml(device.name)} (${escapeHtml(device.status)})</option>`).join("");
  const dollars = (amount = 0) => Number(amount || 0) > 0 ? `$${Number(amount || 0).toLocaleString()}` : "Not listed";
  const devicePage = adminListPage(args.url, dashboard.devices, "/admin/devices");
  const deviceRows = devicePage.rows.map((device) => `
    <tr>
      <td><strong>${escapeHtml(device.name)}</strong><small>${escapeHtml(device.brand)} / ${escapeHtml(device.slug)}</small></td>
      <td>${escapeHtml(device.deviceType)}<small>${Number(device.releaseYear || 0) || ""}</small></td>
      <td>${Number(device.rating || 0).toFixed(1)} / 10<small>Rank ${Number(device.rankScore || 0)}</small></td>
      <td>${Number(device.specCount || 0).toLocaleString()} specs / ${Number(device.benchmarkCount || 0).toLocaleString()} tests</td>
      <td><span class="status">${escapeHtml(device.status)}</span>${device.status === "published" ? `<small><a href="/#/device/${escapeHtml(device.slug)}">Open</a></small>` : ""}</td>
    </tr>
  `).join("");
  const specRows = dashboard.specs.map((spec) => `
    <tr>
      <td><strong>${escapeHtml(spec.deviceName)}</strong><small>${escapeHtml(spec.specGroup)}</small></td>
      <td>${escapeHtml(spec.label)}</td>
      <td>${escapeHtml(spec.value)}</td>
    </tr>
  `).join("");
  const benchmarkRows = dashboard.benchmarks.map((benchmark) => `
    <tr>
      <td><strong>${escapeHtml(benchmark.deviceName)}</strong><small>${escapeHtml(benchmark.benchmarkName)}</small></td>
      <td>${Number(benchmark.score || 0).toLocaleString()} ${escapeHtml(benchmark.unit || "")}</td>
      <td>${escapeHtml(benchmark.note || "")}</td>
    </tr>
  `).join("");
  const compareHref = dashboard.devices.slice(0, 2).map((device) => device.slug).join(",");
  const readiness = [
    ["Smartphones", dashboard.readiness.smartphoneDatabaseReady],
    ["Laptops", dashboard.readiness.laptopDatabaseReady],
    ["GPU/CPU", dashboard.readiness.gpuCpuDatabaseReady],
    ["Companies", dashboard.readiness.companyProfilesReady],
    ["Startups", dashboard.readiness.startupProfilesReady],
    ["Specs", dashboard.readiness.productSpecificationsReady],
    ["Comparisons", dashboard.readiness.deviceComparisonsReady],
    ["History", dashboard.readiness.historicalTrackingReady],
    ["Benchmarks", dashboard.readiness.benchmarkDataReady],
    ["Timeline", dashboard.readiness.releaseTimelineReady]
  ].map(([label, ready]) => `<span class="${ready ? "ready" : "pending"}">${escapeHtml(label)}</span>`).join("");
  const typeCards = dashboard.types.map((type) => `<article><span>${escapeHtml(type.type)}</span><strong>${Number(type.count || 0).toLocaleString()}</strong><small>${Number(type.averageRating || 0).toFixed(1)} avg rating</small></article>`).join("");
  const workflowCards = dashboard.workflow.map((item, index) => `<article><span>${index + 1}</span><strong>${escapeHtml(item.stage)}</strong><small>${escapeHtml(item.detail)}</small></article>`).join("");
  const companyRows = dashboard.companyProfiles.map((company) => `
    <tr>
      <td><strong>${escapeHtml(company.brand)}</strong><small>${escapeHtml(company.headquarters || "")}</small></td>
      <td>${Number(company.deviceCount || 0).toLocaleString()} devices<small>${escapeHtml((company.categories || []).join(", "))}</small></td>
      <td>${Number(company.averageRating || 0).toFixed(1)} avg rating</td>
      <td>${company.topDevice ? `<a href="/#/device/${escapeHtml(company.topDevice)}">Top device</a>` : ""}${company.startupSlug ? `<small><a href="/#/startup/${escapeHtml(company.startupSlug)}">Startup profile</a></small>` : ""}</td>
    </tr>
  `).join("");
  const timelineRows = dashboard.releaseTimeline.slice(0, 12).map((item) => `
    <tr>
      <td>${Number(item.year || 0)}</td>
      <td><strong>${escapeHtml(item.device)}</strong><small>${escapeHtml(item.brand)} / ${escapeHtml(item.type)}</small></td>
      <td>${Number(item.rating || 0).toFixed(1)} rating<small>Rank ${Number(item.rankScore || 0)}</small></td>
      <td><a href="/#/device/${escapeHtml(item.slug)}">Open</a></td>
    </tr>
  `).join("");
  return adminLayout("Devices", user, `
    <section class="admin-heading"><span>Tech database</span><h1>Device directory and comparison command center</h1>${compareHref ? `<a class="button secondary" href="/#/compare/${escapeHtml(compareHref)}">Compare top devices</a>` : ""}</section>
    ${args.message ? `<div class="alert success">${escapeHtml(args.message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Devices</span><strong>${Number(dashboard.stats.devices).toLocaleString()}</strong></article>
      <article><span>Published</span><strong>${Number(dashboard.stats.published).toLocaleString()}</strong></article>
      <article><span>Categories</span><strong>${Number(dashboard.stats.categories).toLocaleString()}</strong></article>
      <article><span>Companies</span><strong>${Number(dashboard.stats.companies).toLocaleString()}</strong></article>
      <article><span>Specs</span><strong>${Number(dashboard.stats.specs).toLocaleString()}</strong></article>
      <article><span>Benchmarks</span><strong>${Number(dashboard.stats.benchmarks).toLocaleString()}</strong></article>
      <article><span>Avg rating</span><strong>${escapeHtml(dashboard.stats.averageRating)}</strong></article>
      <article><span>Timeline</span><strong>${Number(dashboard.stats.releaseTimeline).toLocaleString()}</strong></article>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel">
        <h2>Database workflow</h2>
        <div class="review-workflow-grid">${workflowCards}</div>
      </section>
      <section class="admin-panel">
        <h2>Readiness</h2>
        <p>Coverage for the public device directory, product comparison engine, company profile links, release timeline, and benchmark data.</p>
        <div class="readiness-pills">${readiness}</div>
      </section>
    </section>
    <section class="admin-panel">
      <h2>Category coverage</h2>
      <div class="review-signal-row">${typeCards}</div>
    </section>
    <section class="admin-panel">
      <h2>Create device</h2>
      <form class="admin-form flat" method="post" action="/admin/devices">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Name<input name="name" required></label>
          <label>Slug<input name="slug" placeholder="auto-generated"></label>
          <label>Brand<input name="brand" required></label>
          <label>Type<select name="deviceType"><option value="phone">Phone</option><option value="laptop">Laptop</option><option value="gpu">GPU</option><option value="cpu">CPU</option><option value="tablet">Tablet</option><option value="wearable">Wearable</option><option value="camera">Camera</option></select></label>
          <label>Image URL<input name="imageUrl" placeholder="https://..."></label>
          <label>Release year<input type="number" name="releaseYear" min="1990" max="2100" value="2026"></label>
          <label>Price USD<input type="number" name="priceUsd" min="0" value="0"></label>
          <label>Rating<input type="number" step="0.1" min="0" max="10" name="rating" value="8.5"></label>
          <label>Rank score<input type="number" name="rankScore" min="0" max="100" value="75"></label>
          <label>Status<select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <label>Summary<textarea name="summary" required></textarea></label>
        </div>
        <button class="button primary" type="submit">Save device</button>
      </form>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel">
        <h2>Add specification</h2>
        <form class="admin-form flat" method="post" action="/admin/devices/specs">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>Device<select name="deviceId" required>${deviceOptions}</select></label>
            <label>Group<input name="specGroup" value="General"></label>
            <label>Label<input name="label" required></label>
            <label>Value<input name="value" required></label>
            <label>Sort order<input type="number" name="sortOrder" value="0"></label>
          </div>
          <button class="button primary" type="submit">Save spec</button>
        </form>
      </section>
      <section class="admin-panel">
        <h2>Add benchmark</h2>
        <form class="admin-form flat" method="post" action="/admin/devices/benchmarks">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>Device<select name="deviceId" required>${deviceOptions}</select></label>
            <label>Benchmark<input name="benchmarkName" required></label>
            <label>Score<input type="number" step="0.1" name="score" value="0"></label>
            <label>Unit<input name="unit" placeholder="points, hours, tokens/s"></label>
            <label>Sort order<input type="number" name="sortOrder" value="0"></label>
            <label>Note<textarea name="note"></textarea></label>
          </div>
          <button class="button primary" type="submit">Save benchmark</button>
        </form>
      </section>
    </section>
    <section class="admin-panel"><h2>Devices</h2>${devicePage.controls}<table><thead><tr><th>Device</th><th>Type</th><th>Score</th><th>Data</th><th>Status</th></tr></thead><tbody>${deviceRows || "<tr><td colspan='5'>No devices yet.</td></tr>"}</tbody></table>${devicePage.controls}</section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Company profiles</h2><table><thead><tr><th>Company</th><th>Coverage</th><th>Rating</th><th>Links</th></tr></thead><tbody>${companyRows || "<tr><td colspan='4'>No company profile signals yet.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>Release timeline</h2><table><thead><tr><th>Year</th><th>Device</th><th>Score</th><th>Link</th></tr></thead><tbody>${timelineRows || "<tr><td colspan='4'>No timeline records yet.</td></tr>"}</tbody></table></section>
    </section>
    <section class="admin-panel"><h2>Specifications</h2><table><thead><tr><th>Device</th><th>Label</th><th>Value</th></tr></thead><tbody>${specRows || "<tr><td colspan='3'>No specs yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Benchmarks</h2><table><thead><tr><th>Benchmark</th><th>Score</th><th>Note</th></tr></thead><tbody>${benchmarkRows || "<tr><td colspan='3'>No benchmarks yet.</td></tr>"}</tbody></table></section>
  `, "devices");
}

function aiAssistantPage(user, result = null, message = "") {
  const runs = getAiAssistantRuns(12);
  const runRows = runs.map((run) => `
    <tr>
      <td><strong>${escapeHtml(run.task)}</strong><small>${escapeHtml(run.promptExcerpt || "")}</small></td>
      <td>${escapeHtml(run.provider)}<small>${escapeHtml(run.model)}</small></td>
      <td>${escapeHtml(run.createdBy || "System")}</td>
      <td>${escapeHtml(run.createdAt)}</td>
    </tr>
  `).join("");
  return adminLayout("AI Assistant", user, `
    <section class="admin-heading"><span>GPT newsroom</span><h1>Advanced AI newsroom assistant</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="admin-panel">
      <h2>Run assistant</h2>
      <form class="admin-form flat" method="post" action="/admin/ai-assistant">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Task<select name="task">
            <option value="newsroom">Full newsroom package</option>
            <option value="headlines">Rewrite headlines</option>
            <option value="seo">SEO optimization</option>
            <option value="tags">Tag suggestions</option>
            <option value="summary">Summary</option>
            <option value="social">Social posts</option>
            <option value="translation">Translation</option>
            <option value="trends">Trend detection</option>
          </select></label>
          <label>Category<input name="category" placeholder="AI, cybersecurity, cloud..."></label>
          <label>Target language<input name="targetLanguage" placeholder="Arabic, French, Spanish..."></label>
          <label>Title<input name="title" placeholder="Story or campaign title"></label>
          <label>Text<textarea name="text" placeholder="Paste article draft, brief, transcript, or newsroom notes"></textarea></label>
        </div>
        <button class="button primary" type="submit">Run AI assistant</button>
      </form>
    </section>
    ${result ? `<section class="admin-panel ai-assistant-result">
      <h2>AI result</h2>
      <div class="mini-grid">
        <article class="reader-card"><span>Provider</span><h3>${escapeHtml(result.provider || "unknown")}</h3><p>${escapeHtml(result.model || "")}</p></article>
        <article class="reader-card"><span>SEO title</span><h3>${escapeHtml(result.seoTitle || "")}</h3><p>${escapeHtml(result.seoDescription || "")}</p></article>
        <article class="reader-card"><span>Newsletter</span><h3>${escapeHtml(result.newsletterSubject || "")}</h3><p>${escapeHtml(result.summary || "")}</p></article>
      </div>
      <pre class="ai-output">${escapeHtml(JSON.stringify(result, null, 2))}</pre>
    </section>` : ""}
    <section class="admin-panel">
      <h2>Recent AI runs</h2>
      <table><thead><tr><th>Task</th><th>Provider</th><th>User</th><th>Date</th></tr></thead><tbody>${runRows || "<tr><td colspan='4'>No AI runs yet.</td></tr>"}</tbody></table>
    </section>
  `, "ai");
}

function siteCmsPage(user, message = "") {
  const settings = getSiteSettings();
  const sections = settings.homepageSections || {};
  const links = settings.utilityLinks?.length ? settings.utilityLinks : [];
  const utility = (index, field, fallback = "") => escapeHtml(links[index - 1]?.[field] || fallback);
  const checked = (value) => value ? "checked" : "";
  return adminLayout("Site CMS", user, `
    <section class="admin-heading"><span>Public website CMS</span><h1>Brand, theme, banners, homepage controls</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <form class="admin-form site-cms-form" method="post" action="/admin/site-cms">
      ${csrfInput(user)}
      <section class="admin-panel">
        <h2>Brand identity</h2>
        <div class="form-grid">
          <label>Brand name<input name="brandName" value="${escapeHtml(settings.brandName)}" required></label>
          <label>Header tagline<input name="brandTagline" value="${escapeHtml(settings.brandTagline)}"></label>
          <label>Footer tagline<input name="footerTagline" value="${escapeHtml(settings.footerTagline)}"></label>
          <label>Logo URL<input name="logoUrl" value="${escapeHtml(settings.logoUrl)}"></label>
          <label>Footer text<textarea name="footerText">${escapeHtml(settings.footerText)}</textarea></label>
        </div>
      </section>
      <section class="admin-panel">
        <h2>Theme colors and styling</h2>
        <div class="form-grid color-grid">
          <label>Primary color<input type="color" name="primaryColor" value="${escapeHtml(settings.primaryColor)}"></label>
          <label>Secondary color<input type="color" name="secondaryColor" value="${escapeHtml(settings.secondaryColor)}"></label>
          <label>Alert color<input type="color" name="dangerColor" value="${escapeHtml(settings.dangerColor)}"></label>
          <label>Background<input type="color" name="backgroundColor" value="${escapeHtml(settings.backgroundColor)}"></label>
          <label>Soft background<input type="color" name="softBackgroundColor" value="${escapeHtml(settings.softBackgroundColor)}"></label>
          <label>Panel<input type="color" name="panelColor" value="${escapeHtml(settings.panelColor)}"></label>
          <label>Strong panel<input type="color" name="strongPanelColor" value="${escapeHtml(settings.strongPanelColor)}"></label>
          <label>Text<input type="color" name="textColor" value="${escapeHtml(settings.textColor)}"></label>
          <label>Muted text<input type="color" name="mutedColor" value="${escapeHtml(settings.mutedColor)}"></label>
          <label>Card radius<input type="number" name="borderRadius" value="${escapeHtml(settings.borderRadius)}" min="0" max="24"></label>
        </div>
      </section>
      <section class="admin-panel">
        <h2>Top links and breaking banner</h2>
        <label class="check-field"><input type="checkbox" name="showUtilityBar" ${checked(settings.showUtilityBar)}> Show utility bar</label>
        <div class="form-grid">
          ${[1, 2, 3, 4].map((index) => `
            <label>Utility label ${index}<input name="utilityLabel${index}" value="${utility(index, "label")}"></label>
            <label>Utility URL ${index}<input name="utilityUrl${index}" value="${utility(index, "url")}"></label>
          `).join("")}
          <label class="check-field"><input type="checkbox" name="breakingBannerEnabled" ${checked(settings.breakingBannerEnabled)}> Show breaking banner</label>
          <label>Breaking banner text<input name="breakingBannerText" value="${escapeHtml(settings.breakingBannerText)}"></label>
          <label>Breaking banner URL<input name="breakingBannerUrl" value="${escapeHtml(settings.breakingBannerUrl)}"></label>
        </div>
      </section>
      <section class="admin-panel">
        <h2>Marketing banner</h2>
        <label class="check-field"><input type="checkbox" name="marketingBannerEnabled" ${checked(settings.marketingBannerEnabled)}> Show marketing banner on homepage</label>
        <div class="form-grid">
          <label>Label<input name="marketingBannerLabel" value="${escapeHtml(settings.marketingBannerLabel)}"></label>
          <label>Headline<input name="marketingBannerHeadline" value="${escapeHtml(settings.marketingBannerHeadline)}"></label>
          <label>CTA label<input name="marketingBannerCta" value="${escapeHtml(settings.marketingBannerCta)}"></label>
          <label>CTA URL<input name="marketingBannerUrl" value="${escapeHtml(settings.marketingBannerUrl)}"></label>
          <label>Body<textarea name="marketingBannerBody">${escapeHtml(settings.marketingBannerBody)}</textarea></label>
        </div>
      </section>
      <section class="admin-panel">
        <h2>Homepage sections</h2>
        <div class="toggle-row section-toggle-grid">
          <label><input type="checkbox" name="sectionFeaturedDesk" ${checked(sections.featuredDesk)}> Featured desk</label>
          <label><input type="checkbox" name="sectionTrendingPanel" ${checked(sections.trendingPanel)}> Trending panel</label>
          <label><input type="checkbox" name="sectionSponsoredBanner" ${checked(sections.sponsoredBanner)}> Sponsored banner</label>
          <label><input type="checkbox" name="sectionMagazineGrid" ${checked(sections.magazineGrid)}> Magazine grid</label>
          <label><input type="checkbox" name="sectionLatestFeed" ${checked(sections.latestFeed)}> Latest feed</label>
          <label><input type="checkbox" name="sectionCategoryShowcase" ${checked(sections.categoryShowcase)}> Category showcase</label>
          <label><input type="checkbox" name="sectionNewsletter" ${checked(sections.newsletter)}> Newsletter block</label>
        </div>
      </section>
      <button class="button primary" type="submit">Save public website CMS</button>
    </form>
  `, "sitecms");
}

function articleFormPage(user, article = null, error = "") {
  const collections = getAdminCollections();
  const isEdit = Boolean(article?.id);
  const bodyText = article?.body?.join("\n\n") || "";
  const tagText = article?.tags?.join(", ") || "";
  const revisions = isEdit ? getArticleRevisions(article.id) : [];
  const autosavePayload = article?.autosave ? JSON.stringify(article.autosave) : "";
  const pollOptions = getCommunityPolls({ includeDrafts: false }).map((poll) => `<option value="${escapeHtml(poll.slug || poll.id)}">${escapeHtml(poll.title)}</option>`).join("");
  const option = (items, selected) => items.map((item) => `<option value="${escapeHtml(item.slug || item.id)}" ${selected === (item.slug || item.id) ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("");
  const revisionRows = revisions.map((revision) => `
    <tr>
      <td><strong>${escapeHtml(revision.title)}</strong><small>${escapeHtml(revision.subtitle)}</small></td>
      <td><span class="status">${escapeHtml(revision.status)}</span></td>
      <td>${escapeHtml(revision.savedBy || "System")}</td>
      <td>${escapeHtml(revision.createdAt)}</td>
      <td>
        <form class="inline-form" method="post" action="/admin/articles/${article.id}/rollback/${revision.id}">
          ${csrfInput(user)}
          <button type="submit">Rollback</button>
        </form>
      </td>
    </tr>
  `).join("");

  return adminLayout(isEdit ? "Edit Article" : "New Article", user, `
    <section class="admin-heading"><span>CMS</span><h1>${isEdit ? "Edit article" : "Create article"}</h1><a class="button ghost dark" href="/admin/articles">Back</a></section>
    ${article?.deletedAt ? `<div class="alert">This article is in recoverable delete. Restore it from the article manager before publishing.</div>` : ""}
    <form class="admin-form rich-editor-form" method="post" action="${isEdit ? `/admin/articles/${article.id}/edit` : "/admin/articles/new"}" data-autosave-form data-autosave-key="article:${escapeHtml(article?.id || "new")}">
      ${error ? `<div class="alert">${escapeHtml(error)}</div>` : ""}
      <input type="hidden" name="id" value="${escapeHtml(article?.id || "")}">
      <input type="hidden" name="autosavePayload" value="${escapeHtml(autosavePayload)}" data-autosave-payload>
      ${csrfInput(user)}
      <div class="autosave-bar" data-autosave-status>
        <strong>Autosave ready</strong>
        <span>Changes are saved in this browser and, after first save, on the server.</span>
        <button type="button" data-restore-autosave hidden>Restore autosave</button>
        <button type="button" data-clear-autosave hidden>Clear autosave</button>
      </div>
      <div class="form-grid">
        <label>Title<input name="title" value="${escapeHtml(article?.title || "")}" required data-title-field></label>
        <label>Slug<input name="slug" value="${escapeHtml(article?.slug || "")}" data-slug-field></label>
        <label>Subtitle<input name="subtitle" value="${escapeHtml(article?.subtitle || "")}" required data-subtitle-field></label>
        <label>Status<select name="status">
          ${["draft", "pending_review", "approved", "scheduled", "published", "archived", "rejected"].map((status) => `<option value="${status}" ${(article?.status || "draft") === status ? "selected" : ""}>${status.replace("_", " ")}</option>`).join("")}
        </select></label>
        <label>Section<select name="channel">${option(collections.channels, article?.channel || "articles")}</select></label>
        <label>Category<select name="category">${option(collections.categories, article?.category || "ai")}</select></label>
        <label>Author<select name="author">${option(collections.authors, article?.author || "maya-chen")}</select></label>
        <label>Publish date<input type="date" name="date" value="${escapeHtml(article?.date || new Date().toISOString().slice(0, 10))}"></label>
        <label>Expires at<input type="date" name="expiresAt" value="${escapeHtml(article?.expiresAt || "")}"></label>
        <label>Reading minutes<input type="number" name="minutes" value="${escapeHtml(article?.minutes || 4)}" min="1" data-minutes-field></label>
        <label>Views<input type="number" name="views" value="${escapeHtml(article?.views || 0)}" min="0"></label>
        <label>Hero image URL<input name="image" value="${escapeHtml(article?.image || "")}" list="media-urls"></label>
        <label>Image caption<input name="caption" value="${escapeHtml(article?.caption || "")}"></label>
        <label>Tags<input name="tags" value="${escapeHtml(tagText)}" placeholder="AI, cloud, security"></label>
        <label>SEO title<input name="seoTitle" value="${escapeHtml(article?.seoTitle || article?.title || "")}" data-seo-title-field></label>
        <label>SEO description<textarea name="seoDescription" data-seo-description-field>${escapeHtml(article?.seoDescription || article?.subtitle || "")}</textarea></label>
        <label>Canonical URL<input name="canonicalUrl" value="${escapeHtml(article?.canonicalUrl || "")}" placeholder="https://example.com/original-story"></label>
        <label>Open Graph image<input name="ogImage" value="${escapeHtml(article?.ogImage || article?.image || "")}"></label>
        <label>Sponsor name<input name="sponsorName" value="${escapeHtml(article?.sponsorName || "")}" placeholder="Partner name"></label>
        <label>Content origin<select name="contentOrigin">
          ${["original", "imported", "sponsored", "partner", "updated"].map((origin) => `<option value="${origin}" ${(article?.contentOrigin || "original") === origin ? "selected" : ""}>${origin}</option>`).join("")}
        </select></label>
        <label>Source name<input name="sourceName" value="${escapeHtml(article?.sourceName || "")}" placeholder="Tech Magazine newsroom or publisher"></label>
        <label>Source URL<input name="sourceUrl" value="${escapeHtml(article?.sourceUrl || article?.canonicalUrl || "")}" placeholder="Primary source or original URL"></label>
        <label>Fact-check status<select name="factCheckStatus">
          ${["not_started", "source_reviewed", "editorial_reviewed", "fact_checked", "updated_after_publication"].map((status) => `<option value="${status}" ${(article?.factCheckStatus || "editorial_reviewed") === status ? "selected" : ""}>${status.replaceAll("_", " ")}</option>`).join("")}
        </select></label>
        <label>Fact checked by<input name="factCheckedBy" value="${escapeHtml(article?.factCheckedBy || "Editorial desk")}"></label>
        <label>Fact checked at<input type="date" name="factCheckedAt" value="${escapeHtml(article?.factCheckedAt || article?.date || new Date().toISOString().slice(0, 10))}"></label>
        <label>Trust score<input type="number" name="trustScore" min="0" max="100" value="${escapeHtml(article?.trustScore || 85)}"></label>
      </div>
      <section class="admin-panel editor-trust-panel">
        <h2>Article trust and transparency</h2>
        <p>These fields appear on the public article page so readers can see sourcing, disclosure, correction, and verification context.</p>
        <div class="form-grid">
          <label>Trust summary<textarea name="trustSummary" placeholder="Why readers can trust this story">${escapeHtml(article?.trustSummary || "")}</textarea></label>
          <label>Disclosure note<textarea name="disclosureNote" placeholder="Commercial, affiliate, source, or AI-use disclosure">${escapeHtml(article?.disclosureNote || "")}</textarea></label>
          <label>Correction note<textarea name="correctionNote" placeholder="Visible correction or update note">${escapeHtml(article?.correctionNote || "")}</textarea></label>
          <label>Correction updated at<input type="date" name="correctionUpdatedAt" value="${escapeHtml(article?.correctionUpdatedAt || "")}"></label>
        </div>
      </section>
      <datalist id="media-urls">${collections.media.map((item) => `<option value="${escapeHtml(item.url)}">${escapeHtml(item.title)}</option>`).join("")}</datalist>
      <section class="media-strip">
        ${collections.media.slice(0, 8).map((item) => `<button type="button" data-set-image="${escapeHtml(item.url)}" data-insert-media="${escapeHtml(item.url)}" data-media-alt="${escapeHtml(item.altText || item.title)}"><img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.altText || item.title)}"><span>${escapeHtml(item.title)}</span></button>`).join("") || `<a class="button ghost dark" href="/admin/media">Upload media</a>`}
      </section>
      <section class="editor-workspace">
        <div class="editor-pane">
          <div class="editor-command-bar">
            <button type="button" data-generate-slug>Generate slug</button>
            <button type="button" data-estimate-reading>Estimate read time</button>
            <button type="button" data-fill-seo>Fill SEO fields</button>
            ${article?.slug ? `<a href="/#/article/${escapeHtml(article.slug)}" target="_blank" rel="noreferrer">Preview public page</a><button type="button" data-copy-public-link="/#/article/${escapeHtml(article.slug)}">Copy public link</button>` : `<span>Save once to enable public preview</span>`}
          </div>
          <div class="editor-toolbar" aria-label="Article formatting tools">
            <button type="button" data-editor-wrap="<strong>|</strong>">B</button>
            <button type="button" data-editor-wrap="<em>|</em>">I</button>
            <button type="button" data-editor-block="<blockquote>|</blockquote>">Quote</button>
            <button type="button" data-editor-block="<pre><code>|</code></pre>">Code</button>
            <button type="button" data-editor-block="<h2>|</h2>">H2</button>
            <button type="button" data-editor-block="<ul><li>|</li></ul>">List</button>
            <button type="button" data-editor-table>Table</button>
            <button type="button" data-editor-embed="video">Video</button>
            <button type="button" data-editor-gallery>Gallery</button>
            <button type="button" data-editor-poll>Poll</button>
          </div>
          <label class="editor-mini-select">Poll to insert<select data-poll-select><option value="">Choose poll</option>${pollOptions}</select></label>
          <label>Article body<textarea class="content-editor" name="body" data-editor-body required>${escapeHtml(bodyText)}</textarea></label>
        </div>
        <aside class="editor-preview-panel">
          <div class="section-heading small"><span>Live preview</span><h2>Article body</h2></div>
          <div class="editor-quality-panel" data-editor-quality>
            <article><span>Words</span><strong data-word-count>0</strong></article>
            <article><span>Reading time</span><strong data-reading-estimate>0 min</strong></article>
            <article><span>SEO score</span><strong data-seo-score>0%</strong></article>
          </div>
          <ul class="editor-checklist" data-editor-checklist></ul>
          <div class="editor-preview" data-editor-preview></div>
        </aside>
      </section>
      <section class="admin-panel ai-panel" data-ai-panel data-ai-article="${escapeHtml(article?.id || "")}">
        <div class="section-heading small"><span>GPT assistant</span><h2>AI editorial tools</h2></div>
        <p>Generate summary, SEO metadata, tags, newsletter subject, and related-story ideas. Add your OpenAI key in the environment to use GPT live.</p>
        <div class="inline-form">
          <button type="button" data-ai-generate ${isEdit ? "" : "disabled"}>Generate suggestions</button>
          <button type="button" data-ai-apply ${isEdit ? "" : "disabled"}>Apply SEO and tags</button>
        </div>
        <pre class="ai-output" data-ai-output>${isEdit ? "Ready." : "Save the article first, then AI tools can analyze it."}</pre>
      </section>
      <div class="toggle-row">
        <label><input type="checkbox" name="featured" ${article?.featured ? "checked" : ""}> Featured</label>
        <label><input type="checkbox" name="breaking" ${article?.breaking ? "checked" : ""}> Breaking</label>
        <label><input type="checkbox" name="trending" ${article?.trending ? "checked" : ""}> Trending</label>
        <label><input type="checkbox" name="sponsored" ${article?.sponsored ? "checked" : ""}> Sponsored</label>
      </div>
      <button class="button primary" type="submit">Save article</button>
    </form>
    ${isEdit ? `<section class="admin-panel revision-panel"><h2>Revision history</h2><table><thead><tr><th>Snapshot</th><th>Status</th><th>Saved by</th><th>Date</th><th>Action</th></tr></thead><tbody>${revisionRows || "<tr><td colspan='5'>No revisions yet. Save an edit to create the first snapshot.</td></tr>"}</tbody></table></section>` : ""}
  `, "articles");
}

function adsPage(user) {
  const rows = getAdPlacements().map((ad) => `
    <form class="ad-editor-card" method="post" action="/admin/ads/${escapeHtml(ad.placement)}">
      ${csrfInput(user)}
      <div>
        <span>${escapeHtml(ad.placement)}</span>
        <h2>${escapeHtml(ad.headline)}</h2>
      </div>
      <div class="form-grid">
        <label>Label<input name="label" value="${escapeHtml(ad.label)}"></label>
        <label>Headline<input name="headline" value="${escapeHtml(ad.headline)}"></label>
        <label>Body<textarea name="body">${escapeHtml(ad.body)}</textarea></label>
        <label>Link URL<input name="linkUrl" value="${escapeHtml(ad.linkUrl)}"></label>
        <label>Link label<input name="linkLabel" value="${escapeHtml(ad.linkLabel)}"></label>
        <label class="check-field"><input type="checkbox" name="active" ${ad.active ? "checked" : ""}> Active</label>
      </div>
      <button class="button primary" type="submit">Save placement</button>
    </form>
  `).join("");

  return adminLayout("Ads", user, `
    <section class="admin-heading"><span>Revenue</span><h1>Ad placements</h1></section>
    <section class="ad-editor-grid">${rows}</section>
  `, "ads");
}

function affiliatesPage(user, message = "") {
  const links = getAffiliateLinks(true);
  const activeLinks = links.filter((link) => link.active);
  const totalClicks = links.reduce((sum, link) => sum + Number(link.clicks || 0), 0);
  const revenue = getRevenueSummary();
  const rows = links.map((link) => `
    <tr>
      <td><strong>${escapeHtml(link.label)}</strong><small>${escapeHtml(link.targetUrl)}</small></td>
      <td>${escapeHtml(link.partner)}</td>
      <td>${escapeHtml(link.campaign)}</td>
      <td>${Number(link.clicks).toLocaleString()}</td>
      <td><span class="status">${link.active ? "active" : "paused"}</span></td>
    </tr>
  `).join("");
  return adminLayout("Affiliates", user, `
    <section class="admin-heading"><span>Revenue</span><h1>Affiliate commerce command center</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="analytics-grid">
      <article><span>Total links</span><strong>${Number(links.length).toLocaleString()}</strong><small>all partner placements</small></article>
      <article><span>Active links</span><strong>${Number(activeLinks.length).toLocaleString()}</strong><small>public redirects enabled</small></article>
      <article><span>Tracked clicks</span><strong>${Number(totalClicks).toLocaleString()}</strong><small>server-side redirects</small></article>
      <article><span>Manual affiliate revenue</span><strong>$${(Number(revenue.manualRevenue || 0) / 100).toFixed(2)}</strong><small>recorded revenue events</small></article>
    </section>
    <section class="admin-grid two affiliate-command-grid">
      <article class="admin-panel">
        <h2>Affiliate disclosure and tracking</h2>
        <p>Affiliate links are routed through tracked redirects so reviews, buying guides, and device comparisons can show partner performance without hiding commercial disclosure.</p>
      </article>
      <article class="admin-panel">
        <h2>Production checklist</h2>
        <div class="readiness-list">
          <span class="${activeLinks.length ? "ready" : "pending"}">Active partner links</span>
          <span class="ready">Click tracking ready</span>
          <span class="ready">Product review integration ready</span>
          <span class="pending">Partner payout import required</span>
        </div>
      </article>
    </section>
    <section class="admin-panel">
      <h2>Create affiliate placement</h2>
      <form class="admin-form flat" method="post" action="/admin/affiliates">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Label<input name="label" required></label>
          <label>Partner<input name="partner" required></label>
          <label>Target URL<input name="targetUrl" required></label>
          <label>Campaign<input name="campaign" value="general"></label>
          <label>Commission note<input name="commissionNote"></label>
          <label class="check-field"><input type="checkbox" name="active" checked> Active</label>
        </div>
        <button class="button primary" type="submit">Save affiliate</button>
      </form>
    </section>
    <section class="admin-panel"><h2>Affiliate links</h2><table><thead><tr><th>Link</th><th>Partner</th><th>Campaign</th><th>Clicks</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></section>
  `, "affiliates");
}

function membershipsPage(user) {
  const summary = getRevenueSummary();
  const plans = getBootstrap().membershipPlans;
  const rows = plans.map((plan) => `
    <tr>
      <td><strong>${escapeHtml(plan.name)}</strong><small>${escapeHtml(plan.description)}</small></td>
      <td>${escapeHtml(plan.slug)}</td>
      <td>${plan.priceCents ? `$${(plan.priceCents / 100).toFixed(2)} / ${escapeHtml(plan.billingPeriod)}` : "Free"}</td>
      <td>${plan.features.map(escapeHtml).join(", ")}</td>
    </tr>
  `).join("");
  return adminLayout("Memberships", user, `
    <section class="admin-heading"><span>Revenue</span><h1>Membership and subscriber revenue</h1></section>
    <section class="analytics-grid">
      <article><span>Active members</span><strong>${Number(summary.memberships || 0).toLocaleString()}</strong><small>reader subscriptions</small></article>
      <article><span>Monthly run rate</span><strong>$${(Number(summary.monthlyRecurring || 0) / 100).toFixed(2)}</strong><small>manual mode estimate</small></article>
      <article><span>Payment mode</span><strong>${escapeHtml(config.paymentProvider)}</strong><small>gateway setup pending</small></article>
      <article><span>Paywall</span><strong>Ready</strong><small>article and category rules</small></article>
    </section>
    <section class="admin-grid two membership-admin-command">
      <article class="admin-panel">
        <h2>Manual checkout status</h2>
        <p>Plans are active in <strong>${escapeHtml(config.paymentProvider)}</strong> payment mode. For now, membership checkout is manual and does not charge cards or call any payment gateway.</p>
      </article>
      <article class="admin-panel">
        <h2>Production checklist</h2>
        <div class="readiness-list">
          <span class="ready">Reader plan UI ready</span>
          <span class="ready">Manual subscription activation ready</span>
          <span class="ready">Paywall rules ready</span>
          <span class="pending">Payment gateway required</span>
          <span class="pending">Tax and invoice workflow required</span>
        </div>
      </article>
    </section>
    <section class="admin-panel"><h2>Membership plans</h2><table><thead><tr><th>Plan</th><th>Slug</th><th>Price</th><th>Features</th></tr></thead><tbody>${rows}</tbody></table></section>
  `, "memberships");
}

function monetizationPage(user, message = "") {
  const summary = getRevenueSummary();
  const operations = getMonetizationOperationsDashboard();
  const rules = getPaywallRules();
  const campaigns = getSponsoredCampaigns();
  const articles = getAdminArticles();
  const collections = getAdminCollections();
  const money = (cents = 0) => `$${(Number(cents || 0) / 100).toFixed(2)}`;
  const readinessRows = (operations.readiness || []).map((item) => `
    <article>
      <span class="${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>
      <strong>${escapeHtml(item.label)}</strong>
      <small>${escapeHtml(item.detail)}</small>
    </article>
  `).join("");
  const articleOptions = articles.map((article) => `<option value="${escapeHtml(article.id)}">${escapeHtml(article.title)}</option>`).join("");
  const categoryOptions = collections.categories.map((category) => `<option value="${escapeHtml(category.slug)}">${escapeHtml(category.name)}</option>`).join("");
  const ruleRows = rules.map((rule) => `
    <tr>
      <td>${escapeHtml(rule.articleTitle || rule.categoryName || "Global rule")}</td>
      <td>${escapeHtml(rule.accessLevel)}</td>
      <td>${Number(rule.previewParagraphs || 0).toLocaleString()} paragraphs</td>
      <td><span class="status">${rule.active ? "active" : "paused"}</span></td>
    </tr>
  `).join("");
  const campaignRows = campaigns.map((campaign) => `
    <tr>
      <td><strong>${escapeHtml(campaign.name)}</strong><small>${escapeHtml(campaign.notes || "")}</small></td>
      <td>${escapeHtml(campaign.sponsor)}</td>
      <td>${money(campaign.budgetCents)}</td>
      <td><span class="status">${escapeHtml(campaign.status)}</span></td>
    </tr>
  `).join("");
  const adRows = summary.topAds.map((ad) => `<tr><td>${escapeHtml(ad.placement)}</td><td>${Number(ad.impressions).toLocaleString()}</td></tr>`).join("");
  const affiliateRows = summary.topAffiliates.map((link) => `<tr><td>${escapeHtml(link.label)}</td><td>${escapeHtml(link.partner)}</td><td>${Number(link.clicks || 0).toLocaleString()}</td></tr>`).join("");
  const videoAdRows = summary.videoAds.map((ad) => `<tr><td><strong>${escapeHtml(ad.label)}</strong><small>${escapeHtml(ad.placement)}</small></td><td>${escapeHtml(ad.adType)}</td><td>${money(ad.cpmCents)}</td><td>${escapeHtml(ad.sponsor || "")}</td><td><span class="status">${escapeHtml(ad.status)}</span></td></tr>`).join("");
  const sponsorAnalyticsRows = summary.sponsorAnalytics.map((item) => `<tr><td>${escapeHtml(item.sponsor)}</td><td>${Number(item.campaigns || 0).toLocaleString()}</td><td>${money(item.budgetCents)}</td><td>${Number(item.approvedCampaigns || 0).toLocaleString()}</td></tr>`).join("");
  const revenueRows = summary.recentRevenue.map((event) => `
    <tr>
      <td>${escapeHtml(event.source)}</td>
      <td>${money(event.amountCents)}</td>
      <td>${escapeHtml(event.currency)}</td>
      <td>${escapeHtml(event.description || "")}</td>
    </tr>
  `).join("");
  return adminLayout("Monetization", user, `
    <section class="admin-heading"><span>Revenue system / Monetization dashboard</span><h1>Monetization and revenue command center</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="analytics-grid">
      <article><span>Monthly memberships</span><strong>${money(summary.monthlyRecurring)}</strong><small>${Number(summary.memberships).toLocaleString()} active members</small></article>
      <article><span>Sponsored revenue</span><strong>${money(summary.sponsoredRevenue)}</strong><small>Campaign budget recorded</small></article>
      <article><span>Ad impressions</span><strong>${Number(summary.adImpressions).toLocaleString()}</strong><small>Tracked from public placements</small></article>
      <article><span>Affiliate clicks</span><strong>${Number(summary.affiliateClicks).toLocaleString()}</strong><small>Partner redirects</small></article>
    </section>

    <section class="admin-grid two revenue-command-center">
      <article class="admin-panel">
        <h2>Revenue journey</h2>
        <div class="workflow-lane">
          <span>Audience</span>
          <span>Inventory</span>
          <span>Approval</span>
          <span>Launch</span>
          <span>Measure</span>
          <span>Invoice</span>
        </div>
        <p>Use this page to manage premium access, sponsor campaigns, ad inventory, affiliate links, video ad slots, and manual revenue records until payment gateways, ad servers, and invoice systems are connected.</p>
      </article>
      <article class="admin-panel">
        <h2>Provider connection status</h2>
        <p>The platform is intentionally in manual/no-payment mode. Do not use it for real charges until a payment gateway, ad server, invoice/tax workflow, and sponsor settlement process are configured.</p>
        <div class="readiness-list"><span class="ready">Manual mode safe</span><span class="pending">Payment gateway required</span><span class="pending">Ad server required</span><span class="pending">Finance approval required</span></div>
      </article>
    </section>
    <section class="admin-panel monetization-readiness-panel">
      <h2>Commercial readiness matrix</h2>
      <div class="monetization-readiness-grid">${readinessRows}</div>
    </section>

    <section class="admin-panel">
      <h2>Paywall rules</h2>
      <form class="admin-form flat" method="post" action="/admin/monetization/paywall">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Article<select name="articleId"><option value="">Any article in category</option>${articleOptions}</select></label>
          <label>Category<select name="categorySlug"><option value="">Article-specific only</option>${categoryOptions}</select></label>
          <label>Access<select name="accessLevel"><option value="free">Free</option><option value="registered">Registered readers</option><option value="premium">Premium members</option></select></label>
          <label>Preview paragraphs<input type="number" name="previewParagraphs" min="1" max="10" value="2"></label>
          <label class="check-field"><input type="checkbox" name="active" checked> Active</label>
        </div>
        <button class="button primary" type="submit">Save paywall rule</button>
      </form>
      <table><thead><tr><th>Scope</th><th>Access</th><th>Preview</th><th>Status</th></tr></thead><tbody>${ruleRows || "<tr><td colspan='4'>No paywall rules yet.</td></tr>"}</tbody></table>
    </section>

    <section class="admin-panel">
      <h2>Sponsored campaigns</h2>
      <form class="admin-form flat" method="post" action="/admin/monetization/sponsors">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Campaign name<input name="name" required></label>
          <label>Sponsor<input name="sponsor" required></label>
          <label>Budget cents<input type="number" name="budgetCents" min="0" value="0"></label>
          <label>Starts at<input type="date" name="startsAt"></label>
          <label>Ends at<input type="date" name="endsAt"></label>
          <label>Status<select name="status"><option value="draft">Draft</option><option value="active">Active</option><option value="paused">Paused</option><option value="completed">Completed</option></select></label>
          <label>Notes<textarea name="notes"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save campaign</button>
      </form>
      <table><thead><tr><th>Campaign</th><th>Sponsor</th><th>Budget</th><th>Status</th></tr></thead><tbody>${campaignRows || "<tr><td colspan='4'>No sponsor campaigns yet.</td></tr>"}</tbody></table>
    </section>

    <section class="admin-panel">
      <h2>Video ad slots</h2>
      <form class="admin-form flat" method="post" action="/admin/monetization/video-ads">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Placement key<input name="placementKey" value="video-preroll"></label>
          <label>Label<input name="label" required placeholder="Launch campaign pre-roll"></label>
          <label>Type<select name="adType"><option value="pre-roll">Pre-roll</option><option value="mid-roll">Mid-roll</option><option value="overlay">Overlay</option><option value="sponsor-card">Sponsor card</option></select></label>
          <label>CPM cents<input type="number" name="cpmCents" min="0" value="0"></label>
          <label>Sponsor<input name="sponsor" placeholder="Partner name"></label>
          <label>Geo targets<input name="geoTargets" placeholder="US, GB, LB"></label>
          <label>Status<select name="status"><option value="active">Active</option><option value="paused">Paused</option><option value="draft">Draft</option></select></label>
        </div>
        <button class="button primary" type="submit">Save video ad slot</button>
      </form>
      <table><thead><tr><th>Slot</th><th>Type</th><th>CPM</th><th>Sponsor</th><th>Status</th></tr></thead><tbody>${videoAdRows || "<tr><td colspan='5'>No video ad slots yet.</td></tr>"}</tbody></table>
    </section>

    <section class="admin-panel">
      <h2>Manual revenue event</h2>
      <form class="admin-form flat" method="post" action="/admin/monetization/revenue">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Source<select name="source"><option value="manual">Manual</option><option value="membership">Membership</option><option value="ad">Ad</option><option value="affiliate">Affiliate</option><option value="sponsored_campaign">Sponsored campaign</option></select></label>
          <label>Amount cents<input type="number" name="amountCents" min="0" value="0"></label>
          <label>Currency<input name="currency" value="USD"></label>
          <label>Description<input name="description" placeholder="Invoice, sponsor, or campaign note"></label>
        </div>
        <button class="button primary" type="submit">Record revenue</button>
      </form>
    </section>

    <section class="admin-grid two">
      <section class="admin-panel"><h2>Top ad placements</h2><table><thead><tr><th>Placement</th><th>Impressions</th></tr></thead><tbody>${adRows || "<tr><td colspan='2'>No ad impressions yet.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>Top affiliate links</h2><table><thead><tr><th>Link</th><th>Partner</th><th>Clicks</th></tr></thead><tbody>${affiliateRows || "<tr><td colspan='3'>No affiliate clicks yet.</td></tr>"}</tbody></table></section>
    </section>
    <section class="admin-panel"><h2>Sponsor performance</h2><table><thead><tr><th>Sponsor</th><th>Campaigns</th><th>Budget</th><th>Legal approved</th></tr></thead><tbody>${sponsorAnalyticsRows || "<tr><td colspan='4'>No sponsor analytics yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Recent revenue records</h2><table><thead><tr><th>Source</th><th>Amount</th><th>Currency</th><th>Description</th></tr></thead><tbody>${revenueRows || "<tr><td colspan='4'>No revenue records yet.</td></tr>"}</tbody></table></section>
  `, "monetization");
}

function directoryPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/directory");
  const page = adminListPage(args.url, getDirectoryItems(), "/admin/directory");
  const rows = page.rows.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.description)}</small></td>
      <td>${escapeHtml(item.type)}</td>
      <td>${escapeHtml(item.slug)}</td>
      <td>${item.url ? `<a href="${escapeHtml(item.url)}">Open</a>` : ""}</td>
    </tr>
  `).join("");
  return adminLayout("Directory", user, `
    <section class="admin-heading"><span>Expansion</span><h1>Podcasts, jobs, events, marketplace</h1></section>
    ${args.message ? `<div class="alert success">${escapeHtml(args.message)}</div>` : ""}
    <section class="admin-panel">
      <h2>Create directory item</h2>
      <form class="admin-form flat" method="post" action="/admin/directory">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Type<select name="type"><option value="podcast">Podcast</option><option value="job">Job</option><option value="event">Event</option><option value="marketplace">Marketplace</option></select></label>
          <label>Title<input name="title" required></label>
          <label>Slug<input name="slug"></label>
          <label>URL<input name="url"></label>
          <label>Status<select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <label>Description<textarea name="description" required></textarea></label>
        </div>
        <button class="button primary" type="submit">Save item</button>
      </form>
    </section>
    <section class="admin-panel">${page.controls}<table><thead><tr><th>Item</th><th>Type</th><th>Slug</th><th>URL</th></tr></thead><tbody>${rows}</tbody></table>${page.controls}</section>
  `, "directory");
}

function eventsPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/events");
  const dashboard = getEventDashboard();
  const eventOptions = dashboard.events.map((event) => `<option value="${escapeHtml(event.id)}">${escapeHtml(event.title)} (${escapeHtml(event.status)})</option>`).join("");
  const eventPage = adminListPage(args.url, dashboard.events, "/admin/events");
  const eventRows = eventPage.rows.map((event) => `
    <tr>
      <td><strong>${escapeHtml(event.title)}</strong><small>${escapeHtml(event.description)}</small></td>
      <td>${escapeHtml(event.location)}<small>${escapeHtml(event.startsAt)}</small></td>
      <td>${Number(event.registrationCount || 0).toLocaleString()}${event.capacity ? ` / ${Number(event.capacity).toLocaleString()}` : ""}</td>
      <td><span class="status">${escapeHtml(event.status)}</span>${event.streamUrl ? "<small>Stream ready</small>" : ""}</td>
      <td>${event.status === "published" ? `<a href="/#/event/${escapeHtml(event.slug)}">Open</a>` : "<span class='muted'>Draft</span>"}</td>
    </tr>
  `).join("");
  const registrationRows = dashboard.registrations.map((registration) => `
    <tr>
      <td><strong>${escapeHtml(registration.name)}</strong><small>${escapeHtml(registration.email)}</small></td>
      <td>${escapeHtml(registration.eventTitle)}</td>
      <td>${escapeHtml(registration.ticketType)}<small>${escapeHtml(registration.paymentStatus)}</small></td>
      <td><span class="status">${escapeHtml(registration.status)}</span></td>
    </tr>
  `).join("");
  const money = (cents = 0) => `$${(Number(cents || 0) / 100).toFixed(2)}`;
  const readiness = [
    ["Event pages", dashboard.readiness.eventPagesReady],
    ["Schedules", dashboard.readiness.conferenceSchedulesReady],
    ["Speakers", dashboard.readiness.speakerProfilesReady],
    ["Tickets", dashboard.readiness.ticketSystemReady],
    ["Live coverage", dashboard.readiness.liveCoverageReady],
    ["Streams", dashboard.readiness.liveStreamsReady],
    ["RSVP", dashboard.readiness.rsvpManagementReady],
    ["Agenda", dashboard.readiness.agendaSystemReady],
    ["Sponsors", dashboard.readiness.sponsorshipReady],
    ["Virtual", dashboard.readiness.virtualConferencesReady]
  ].map(([label, ready]) => `<span class="${ready ? "ready" : "pending"}">${escapeHtml(label)}</span>`).join("");
  const workflowCards = dashboard.workflow.map((item, index) => `<article><span>${index + 1}</span><strong>${escapeHtml(item.stage)}</strong><small>${escapeHtml(item.detail)}</small></article>`).join("");
  const sponsorRows = dashboard.sponsorDesk.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.sponsor)}</strong><small>${escapeHtml(item.eventTitle)}</small></td>
      <td>${escapeHtml(item.ticketType)}</td>
      <td>${Number(item.registrations || 0).toLocaleString()} registrations</td>
      <td>${item.streamReady ? "Stream ready" : "No stream"}<small><a href="/#/event/${escapeHtml(item.eventSlug)}">Open</a></small></td>
    </tr>
  `).join("");
  return adminLayout("Events", user, `
    <section class="admin-heading"><span>Events & conferences</span><h1>Event, RSVP, and live conference command center</h1></section>
    ${args.message ? `<div class="alert success">${escapeHtml(args.message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Events</span><strong>${Number(dashboard.stats.events).toLocaleString()}</strong></article>
      <article><span>Upcoming</span><strong>${Number(dashboard.stats.upcoming).toLocaleString()}</strong></article>
      <article><span>Registrations</span><strong>${Number(dashboard.stats.registrations).toLocaleString()}</strong></article>
      <article><span>Speakers</span><strong>${Number(dashboard.stats.speakers).toLocaleString()}</strong></article>
      <article><span>Agenda items</span><strong>${Number(dashboard.stats.agendaItems).toLocaleString()}</strong></article>
      <article><span>Live streams</span><strong>${Number(dashboard.stats.liveStreams).toLocaleString()}</strong></article>
      <article><span>Sponsors</span><strong>${Number(dashboard.stats.sponsors).toLocaleString()}</strong></article>
      <article><span>Virtual</span><strong>${Number(dashboard.stats.virtualEvents).toLocaleString()}</strong></article>
      <article><span>Manual ticket value</span><strong>${money(dashboard.stats.revenueCents)}</strong></article>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel">
        <h2>Event workflow</h2>
        <div class="review-workflow-grid">${workflowCards}</div>
      </section>
      <section class="admin-panel">
        <h2>Readiness</h2>
        <p>Coverage for event pages, conference schedules, speaker profiles, ticketing, livestreams, RSVP management, sponsorships, and virtual conferences.</p>
        <div class="readiness-pills">${readiness}</div>
      </section>
    </section>
    <section class="admin-panel">
      <h2>Create event</h2>
      <form class="admin-form flat" method="post" action="/admin/events">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Title<input name="title" required></label>
          <label>Slug<input name="slug" placeholder="auto-generated"></label>
          <label>Type<select name="eventType"><option value="conference">Conference</option><option value="webinar">Webinar</option><option value="summit">Summit</option><option value="workshop">Workshop</option></select></label>
          <label>Status<select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <label>Location<input name="location" value="Online"></label>
          <label>Venue<input name="venue"></label>
          <label>Starts at<input type="datetime-local" name="startsAt" required></label>
          <label>Ends at<input type="datetime-local" name="endsAt"></label>
          <label>Timezone<input name="timezone" value="Asia/Beirut"></label>
          <label>Cover image<input name="coverImage" placeholder="https://..."></label>
          <label>Live stream URL<input name="streamUrl" placeholder="YouTube, Mux, Cloudflare Stream, or meeting URL"></label>
          <label>Ticket type<select name="ticketType"><option value="free">Free</option><option value="standard">Standard</option><option value="vip">VIP</option><option value="sponsor">Sponsor</option></select></label>
          <label>Price cents<input type="number" name="priceCents" value="0" min="0"></label>
          <label>Capacity<input type="number" name="capacity" value="0" min="0"></label>
          <label>Sponsor<input name="sponsor"></label>
          <label>Description<textarea name="description" required></textarea></label>
        </div>
        <button class="button primary" type="submit">Save event</button>
      </form>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel">
        <h2>Add speaker</h2>
        <form class="admin-form flat" method="post" action="/admin/events/speakers">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>Event<select name="eventId" required>${eventOptions}</select></label>
            <label>Name<input name="name" required></label>
            <label>Title<input name="title"></label>
            <label>Company<input name="company"></label>
            <label>Avatar URL<input name="avatar"></label>
            <label>Sort order<input name="sortOrder" type="number" value="0"></label>
            <label>Bio<textarea name="bio"></textarea></label>
          </div>
          <button class="button primary" type="submit">Save speaker</button>
        </form>
      </section>
      <section class="admin-panel">
        <h2>Add agenda item</h2>
        <form class="admin-form flat" method="post" action="/admin/events/agenda">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>Event<select name="eventId" required>${eventOptions}</select></label>
            <label>Title<input name="title" required></label>
            <label>Track<input name="track" value="Main stage"></label>
            <label>Starts at<input type="datetime-local" name="startsAt" required></label>
            <label>Ends at<input type="datetime-local" name="endsAt"></label>
            <label>Speaker IDs<input name="speakerIds" placeholder="Comma-separated speaker IDs"></label>
            <label>Sort order<input name="sortOrder" type="number" value="0"></label>
            <label>Description<textarea name="description"></textarea></label>
          </div>
          <button class="button primary" type="submit">Save agenda item</button>
        </form>
      </section>
    </section>
    <section class="admin-panel"><h2>Sponsor desk</h2><table><thead><tr><th>Sponsor</th><th>Ticket</th><th>Registrations</th><th>Live</th></tr></thead><tbody>${sponsorRows || "<tr><td colspan='4'>No sponsored events yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Events</h2>${eventPage.controls}<table><thead><tr><th>Event</th><th>When</th><th>Registrations</th><th>Status</th><th>Public</th></tr></thead><tbody>${eventRows || "<tr><td colspan='5'>No events yet.</td></tr>"}</tbody></table>${eventPage.controls}</section>
    <section class="admin-panel"><h2>Registrations</h2><table><thead><tr><th>Attendee</th><th>Event</th><th>Ticket</th><th>Status</th></tr></thead><tbody>${registrationRows || "<tr><td colspan='4'>No registrations yet.</td></tr>"}</tbody></table></section>
  `, "events");
}

function jobsPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/jobs");
  const dashboard = getJobBoardDashboard();
  const recruiterOptions = dashboard.recruiters.map((recruiter) => `<option value="${escapeHtml(recruiter.id)}">${escapeHtml(recruiter.companyName)}</option>`).join("");
  const moneyRange = (job) => {
    if (!job.salaryMin && !job.salaryMax) return "Not listed";
    const min = Number(job.salaryMin || 0).toLocaleString();
    const max = Number(job.salaryMax || 0).toLocaleString();
    return `${escapeHtml(job.currency || "USD")} ${min}${job.salaryMax ? ` - ${max}` : ""}`;
  };
  const jobPage = adminListPage(args.url, dashboard.jobs, "/admin/jobs");
  const jobRows = jobPage.rows.map((job) => `
    <tr>
      <td><strong>${escapeHtml(job.title)}</strong><small>${escapeHtml(job.companyName)} / ${escapeHtml(job.slug)}</small></td>
      <td>${escapeHtml(job.location)}<small>${escapeHtml(job.remoteType)} / ${escapeHtml(job.jobType)}</small></td>
      <td>${moneyRange(job)}</td>
      <td>${Number(job.applicationCount || 0).toLocaleString()}</td>
      <td><span class="status">${escapeHtml(job.status)}</span>${job.status === "published" ? `<small><a href="/#/job/${escapeHtml(job.slug)}">Open</a></small>` : ""}</td>
    </tr>
  `).join("");
  const recruiterRows = dashboard.recruiters.map((recruiter) => `
    <tr>
      <td><strong>${escapeHtml(recruiter.companyName)}</strong><small>${escapeHtml(recruiter.contactName)}</small></td>
      <td>${escapeHtml(recruiter.email)}</td>
      <td>${recruiter.website ? `<a href="${escapeHtml(recruiter.website)}" target="_blank" rel="noreferrer">Website</a>` : ""}</td>
      <td><span class="status">${escapeHtml(recruiter.status)}</span></td>
    </tr>
  `).join("");
  const applicationRows = dashboard.applications.map((application) => `
    <tr>
      <td><strong>${escapeHtml(application.name)}</strong><small>${escapeHtml(application.email)}</small></td>
      <td>${escapeHtml(application.jobTitle)}<small>${escapeHtml(application.companyName)}</small></td>
      <td>${(application.skills || []).map((skill) => escapeHtml(skill)).join(", ")}</td>
      <td><strong>${Number(application.matchScore || 0)}%</strong><small>${escapeHtml(application.status)}</small></td>
      <td>${application.resumeFileUrl ? `<a href="${escapeHtml(application.resumeFileUrl)}" target="_blank" rel="noreferrer">Uploaded resume</a>` : application.resumeUrl ? `<a href="${escapeHtml(application.resumeUrl)}" target="_blank" rel="noreferrer">Resume</a>` : ""}</td>
    </tr>
  `).join("");
  const salaryRows = dashboard.salaryInsights.map((insight) => `
    <tr>
      <td><strong>${escapeHtml(insight.jobType)}</strong><small>${Number(insight.roles || 0).toLocaleString()} roles with salary data</small></td>
      <td>${insight.averageSalary ? `${Number(insight.averageSalary).toLocaleString()} USD` : "Not enough data"}</td>
      <td>${escapeHtml(insight.salaryRange)}</td>
    </tr>
  `).join("");
  const readinessCards = Object.entries(dashboard.readiness).map(([key, ready]) => `
    <article class="${ready ? "ready" : "blocked"}"><strong>${ready ? "Ready" : "Needs attention"}</strong><span>${escapeHtml(key.replace(/([A-Z])/g, " $1").toLowerCase())}</span></article>
  `).join("");
  const trackCards = dashboard.hiringTracks.map((track) => `
    <article class="reader-card"><span>Hiring track</span><h2>${escapeHtml(track.label)}</h2><p>${escapeHtml(track.body)}</p></article>
  `).join("");
  return adminLayout("Jobs", user, `
    <section class="admin-heading"><span>Career platform</span><h1>Job board, recruiters, applications, and salary intelligence</h1></section>
    ${args.message ? `<div class="alert success">${escapeHtml(args.message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Jobs</span><strong>${Number(dashboard.stats.jobs).toLocaleString()}</strong></article>
      <article><span>Active</span><strong>${Number(dashboard.stats.activeJobs).toLocaleString()}</strong></article>
      <article><span>Featured</span><strong>${Number(dashboard.stats.featuredJobs).toLocaleString()}</strong></article>
      <article><span>Remote</span><strong>${Number(dashboard.stats.remoteJobs).toLocaleString()}</strong></article>
      <article><span>Applications</span><strong>${Number(dashboard.stats.applications).toLocaleString()}</strong></article>
      <article><span>Recruiters</span><strong>${Number(dashboard.stats.recruiters).toLocaleString()}</strong></article>
      <article><span>Alerts</span><strong>${Number(dashboard.stats.alerts).toLocaleString()}</strong></article>
      <article><span>Average match</span><strong>${Number(dashboard.stats.averageMatch).toLocaleString()}%</strong></article>
    </section>
    <section class="admin-panel">
      <h2>Career platform readiness</h2>
      <div class="readiness-grid">${readinessCards}</div>
    </section>
    <section class="admin-panel">
      <h2>Hiring desk tracks</h2>
      <div class="mini-grid">${trackCards}</div>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel">
        <h2>Create recruiter</h2>
        <form class="admin-form flat" method="post" action="/admin/jobs/recruiters">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>Company<input name="companyName" required></label>
            <label>Contact<input name="contactName" required></label>
            <label>Email<input type="email" name="email" required></label>
            <label>Website<input name="website" placeholder="https://..."></label>
            <label>Logo URL<input name="logoUrl" placeholder="https://..."></label>
            <label>Headquarters<input name="headquarters" placeholder="City / Remote"></label>
            <label>Industry<input name="industry" value="technology"></label>
            <label>Employee count<input name="employeeCount" placeholder="51-200"></label>
            <label>Hiring URL<input name="hiringUrl" placeholder="https://.../careers"></label>
            <label>Status<select name="status"><option value="active">Active</option><option value="paused">Paused</option></select></label>
            <label class="checkbox-row"><input type="checkbox" name="featured"> Featured profile</label>
            <label>Description<textarea name="description" placeholder="Company hiring profile"></textarea></label>
          </div>
          <button class="button primary" type="submit">Save recruiter</button>
        </form>
      </section>
      <section class="admin-panel">
        <h2>Create job post</h2>
        <form class="admin-form flat" method="post" action="/admin/jobs">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>Recruiter<select name="recruiterId"><option value="">No recruiter</option>${recruiterOptions}</select></label>
            <label>Title<input name="title" required></label>
            <label>Slug<input name="slug" placeholder="auto-generated"></label>
            <label>Company<input name="companyName" required></label>
            <label>Location<input name="location" value="Remote"></label>
            <label>Remote type<select name="remoteType"><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">Onsite</option></select></label>
            <label>Job type<select name="jobType"><option value="full-time">Full-time</option><option value="contract">Contract</option><option value="part-time">Part-time</option><option value="internship">Internship</option></select></label>
            <label>Salary min<input type="number" name="salaryMin" value="0" min="0"></label>
            <label>Salary max<input type="number" name="salaryMax" value="0" min="0"></label>
            <label>Currency<input name="currency" value="USD"></label>
            <label>Apply URL<input name="applyUrl" placeholder="Optional external link"></label>
            <label>Expires at<input type="date" name="expiresAt"></label>
            <label>Seniority<select name="seniority"><option value="entry">Entry</option><option value="mid" selected>Mid</option><option value="senior">Senior</option><option value="lead">Lead</option><option value="executive">Executive</option></select></label>
            <label>Status<select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label>
            <label class="checkbox-row"><input type="checkbox" name="featured"> Featured job</label>
            <label>Description<textarea name="description" required></textarea></label>
            <label>Skills<textarea name="skills" placeholder="One per line"></textarea></label>
            <label>Requirements<textarea name="requirements" placeholder="One per line"></textarea></label>
            <label>Benefits<textarea name="benefits" placeholder="One per line"></textarea></label>
            <label>Salary note<textarea name="salaryNote" placeholder="Compensation policy, equity, commission, or verification note"></textarea></label>
          </div>
          <button class="button primary" type="submit">Save job</button>
        </form>
      </section>
    </section>
    <section class="admin-panel"><h2>Salary insights</h2><table><thead><tr><th>Job type</th><th>Average salary</th><th>Range</th></tr></thead><tbody>${salaryRows || "<tr><td colspan='3'>Salary insights need published roles with salary ranges.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Job posts</h2>${jobPage.controls}<table><thead><tr><th>Role</th><th>Location</th><th>Salary</th><th>Applications</th><th>Status</th></tr></thead><tbody>${jobRows || "<tr><td colspan='5'>No jobs yet.</td></tr>"}</tbody></table>${jobPage.controls}</section>
    <section class="admin-panel"><h2>Applications</h2><table><thead><tr><th>Candidate</th><th>Job</th><th>Skills</th><th>Match</th><th>Resume</th></tr></thead><tbody>${applicationRows || "<tr><td colspan='5'>No applications yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Recruiters</h2><table><thead><tr><th>Company</th><th>Email</th><th>Website</th><th>Status</th></tr></thead><tbody>${recruiterRows || "<tr><td colspan='4'>No recruiters yet.</td></tr>"}</tbody></table></section>
  `, "jobs");
}

function startupsPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/startups");
  const dashboard = getStartupDashboard();
  const startupOptions = dashboard.startups.map((startup) => `<option value="${escapeHtml(startup.id)}">${escapeHtml(startup.name)} (${escapeHtml(startup.status)})</option>`).join("");
  const dollars = (amount = 0) => `$${Number(amount || 0).toLocaleString()}`;
  const startupPage = adminListPage(args.url, dashboard.startups, "/admin/startups");
  const startupRows = startupPage.rows.map((startup) => `
    <tr>
      <td><strong>${escapeHtml(startup.name)}</strong><small>${escapeHtml(startup.tagline)}</small></td>
      <td>${escapeHtml(startup.sector)}<small>${escapeHtml(startup.stage)} / ${escapeHtml(startup.headquarters || "Global")}</small></td>
      <td>${dollars(startup.totalFundingUsd)}</td>
      <td><strong>${Number(startup.rankScore || 0)}</strong><small>${Number(startup.founderCount || 0)} founders</small></td>
      <td><span class="status">${escapeHtml(startup.status)}</span>${startup.status === "published" ? `<small><a href="/#/startup/${escapeHtml(startup.slug)}">Open</a></small>` : ""}</td>
    </tr>
  `).join("");
  const founderRows = dashboard.founders.map((founder) => `
    <tr>
      <td><strong>${escapeHtml(founder.name)}</strong><small>${escapeHtml(founder.title || "")}</small></td>
      <td>${escapeHtml(founder.startupName)}</td>
      <td>${founder.socialUrl ? `<a href="${escapeHtml(founder.socialUrl)}" target="_blank" rel="noreferrer">Profile</a>` : ""}</td>
    </tr>
  `).join("");
  const fundingRows = dashboard.fundingRounds.map((round) => `
    <tr>
      <td><strong>${escapeHtml(round.roundName)}</strong><small>${escapeHtml(round.startupName)}</small></td>
      <td>${dollars(round.amountUsd)}</td>
      <td>${escapeHtml(round.announcedAt || "")}</td>
      <td>${(round.investors || []).map((investor) => escapeHtml(investor)).join(", ")}</td>
    </tr>
  `).join("");
  return adminLayout("Startups", user, `
    <section class="admin-heading"><span>Startup directory</span><h1>Profiles, founders, funding, rankings</h1></section>
    ${args.message ? `<div class="alert success">${escapeHtml(args.message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Startups</span><strong>${Number(dashboard.stats.startups).toLocaleString()}</strong></article>
      <article><span>Published</span><strong>${Number(dashboard.stats.published).toLocaleString()}</strong></article>
      <article><span>Founders</span><strong>${Number(dashboard.stats.founders).toLocaleString()}</strong></article>
      <article><span>Funding rounds</span><strong>${Number(dashboard.stats.fundingRounds).toLocaleString()}</strong></article>
      <article><span>Total funding</span><strong>${dollars(dashboard.stats.totalFundingUsd)}</strong></article>
      <article><span>Average rank</span><strong>${Number(dashboard.stats.averageRank).toLocaleString()}</strong></article>
    </section>
    <section class="admin-panel">
      <h2>Create startup profile</h2>
      <form class="admin-form flat" method="post" action="/admin/startups">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Name<input name="name" required></label>
          <label>Slug<input name="slug" placeholder="auto-generated"></label>
          <label>Tagline<input name="tagline" required></label>
          <label>Website<input name="website" placeholder="https://..."></label>
          <label>Logo URL<input name="logoUrl" placeholder="https://..."></label>
          <label>Headquarters<input name="headquarters" placeholder="Beirut / London"></label>
          <label>Sector<select name="sector"><option value="ai">AI</option><option value="cybersecurity">Cybersecurity</option><option value="cloud">Cloud</option><option value="software">Software</option><option value="hardware">Hardware</option><option value="fintech">Fintech</option><option value="gaming">Gaming</option></select></label>
          <label>Stage<select name="stage"><option value="pre-seed">Pre-seed</option><option value="seed">Seed</option><option value="series-a">Series A</option><option value="series-b">Series B</option><option value="growth">Growth</option></select></label>
          <label>Founded year<input type="number" name="foundedYear" min="1900" max="2100" value="2026"></label>
          <label>Total funding USD<input type="number" name="totalFundingUsd" min="0" value="0"></label>
          <label>Rank score<input type="number" name="rankScore" min="0" max="100" value="75"></label>
          <label>Status<select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <label>Description<textarea name="description" required></textarea></label>
        </div>
        <button class="button primary" type="submit">Save startup</button>
      </form>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel">
        <h2>Add founder</h2>
        <form class="admin-form flat" method="post" action="/admin/startups/founders">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>Startup<select name="startupId" required>${startupOptions}</select></label>
            <label>Name<input name="name" required></label>
            <label>Title<input name="title" value="Founder"></label>
            <label>Avatar URL<input name="avatar"></label>
            <label>Social URL<input name="socialUrl"></label>
            <label>Sort order<input type="number" name="sortOrder" value="0"></label>
            <label>Bio<textarea name="bio"></textarea></label>
          </div>
          <button class="button primary" type="submit">Save founder</button>
        </form>
      </section>
      <section class="admin-panel">
        <h2>Add funding round</h2>
        <form class="admin-form flat" method="post" action="/admin/startups/funding">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>Startup<select name="startupId" required>${startupOptions}</select></label>
            <label>Round<input name="roundName" placeholder="Seed, Series A, Grant" required></label>
            <label>Amount USD<input type="number" name="amountUsd" min="0" value="0"></label>
            <label>Announced at<input type="date" name="announcedAt"></label>
            <label>Investors<textarea name="investors" placeholder="One per line"></textarea></label>
          </div>
          <button class="button primary" type="submit">Save funding</button>
        </form>
      </section>
    </section>
    <section class="admin-panel"><h2>Ranked startups</h2>${startupPage.controls}<table><thead><tr><th>Startup</th><th>Sector</th><th>Funding</th><th>Rank</th><th>Status</th></tr></thead><tbody>${startupRows || "<tr><td colspan='5'>No startups yet.</td></tr>"}</tbody></table>${startupPage.controls}</section>
    <section class="admin-panel"><h2>Founders</h2><table><thead><tr><th>Founder</th><th>Startup</th><th>Profile</th></tr></thead><tbody>${founderRows || "<tr><td colspan='3'>No founders yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Funding rounds</h2><table><thead><tr><th>Round</th><th>Amount</th><th>Date</th><th>Investors</th></tr></thead><tbody>${fundingRows || "<tr><td colspan='4'>No funding rounds yet.</td></tr>"}</tbody></table></section>
  `, "startups");
}

function communityAdminPage(user, message = "") {
  const topics = getCommunityTopics();
  const polls = getCommunityPolls({ includeDrafts: true });
  const operations = getCommunityOperationsDashboard();
  const totalReplies = topics.reduce((sum, topic) => sum + Number(topic.replies || 0), 0);
  const totalVotes = operations.analytics.topicVotes.reduce((sum, item) => sum + Number(item.votes || 0), 0);
  const categoryRows = operations.categories.map((category) => `
    <tr>
      <td><strong>${escapeHtml(category.name)}</strong><small>${escapeHtml(category.description || "")}</small></td>
      <td>${escapeHtml(category.slug)}</td>
      <td><span class="status">${escapeHtml(category.status)}</span></td>
      <td>${Number(category.sortOrder || 0).toLocaleString()}</td>
    </tr>
  `).join("");
  const readinessRows = Object.entries(operations.controls || {}).map(([key, ready]) => `<span class="${ready ? "ready" : "pending"}">${escapeHtml(key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase()))}: ${ready ? "ready" : "review"}</span>`).join("");
  const reputationRows = (operations.analytics.reputationLeaders || []).map((reader) => `
    <tr>
      <td><strong>#${Number(reader.rank)} ${escapeHtml(reader.name)}</strong><small>${(reader.badges || []).map((badge) => escapeHtml(badge)).join(", ") || "No badges yet"}</small></td>
      <td>${Number(reader.points || 0).toLocaleString()}</td>
      <td>${Number(reader.currentStreak || 0).toLocaleString()} days</td>
      <td>${Number(reader.completedReads || 0).toLocaleString()}</td>
    </tr>
  `).join("");
  const commentSignalRows = (operations.analytics.commentAnalytics || []).map((signal) => `
    <tr>
      <td><strong>${escapeHtml(signal.status || "unknown")}</strong></td>
      <td>${Number(signal.count || 0).toLocaleString()}</td>
      <td>${Number(signal.avgSpam || 0).toFixed(2)}</td>
    </tr>
  `).join("");
  const topicRows = topics.map((topic) => `
    <tr>
      <td><strong>${escapeHtml(topic.title)}</strong><small>${escapeHtml(topic.body)}</small></td>
      <td>${escapeHtml(topic.authorName)}</td>
      <td>${Number(topic.replies || 0).toLocaleString()}</td>
      <td>${Number(topic.authorPoints || 0).toLocaleString()} pts</td>
      <td><a href="/#/community/${escapeHtml(topic.slug)}">Open</a></td>
    </tr>
  `).join("");
  const pollRows = polls.map((poll) => `
    <tr>
      <td><strong>${escapeHtml(poll.title)}</strong><small>${escapeHtml(poll.body || "")}</small></td>
      <td><span class="status">${escapeHtml(poll.status)}</span></td>
      <td>${poll.options.map((option) => `${escapeHtml(option.label)} (${Number(option.votes || 0).toLocaleString()})`).join(", ")}</td>
    </tr>
  `).join("");
  return adminLayout("Community", user, `
    <section class="admin-heading"><span>Community operations</span><h1>Social, forums, polls, reputation</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Published topics</span><strong>${Number(topics.length).toLocaleString()}</strong></article>
      <article><span>Replies</span><strong>${Number(totalReplies).toLocaleString()}</strong></article>
      <article><span>Polls</span><strong>${Number(polls.length).toLocaleString()}</strong></article>
      <article><span>Topic votes</span><strong>${Number(totalVotes).toLocaleString()}</strong></article>
      <article><span>Pending comments</span><strong>${Number(operations.moderationQueue.pendingComments || 0).toLocaleString()}</strong></article>
      <article><span>Open reports</span><strong>${Number(operations.moderationQueue.openReports || 0).toLocaleString()}</strong></article>
    </section>
    <section class="admin-panel community-admin-command">
      <h2>Community command center</h2>
      <p class="muted">A single operations view for profiles, author follows, forums, nested replies, polls, reputation, anti-abuse controls, and reader moderation.</p>
      <div class="workflow-lane">
        <span>Reader profile</span>
        <span>Follow authors</span>
        <span>Forum discussion</span>
        <span>Moderation review</span>
        <span>Reputation growth</span>
      </div>
      <div class="readiness-list">${readinessRows}</div>
    </section>
    <section class="admin-panel">
      <h2>Create poll</h2>
      <form class="admin-form flat" method="post" action="/admin/community/polls">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Title<input name="title" required></label>
          <label>Slug<input name="slug"></label>
          <label>Status<select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <label>Body<textarea name="body" placeholder="Context for the poll"></textarea></label>
          <label>Options<textarea name="options" required placeholder="Option one&#10;Option two"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save poll</button>
      </form>
    </section>
    <section class="admin-panel"><h2>Forum categories</h2><table><thead><tr><th>Category</th><th>Slug</th><th>Status</th><th>Order</th></tr></thead><tbody>${categoryRows || "<tr><td colspan='4'>No forum categories yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Moderation intelligence</h2><table><thead><tr><th>Status</th><th>Comments</th><th>Average spam score</th></tr></thead><tbody>${commentSignalRows || "<tr><td colspan='3'>No comment signals yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Reputation leaders</h2><table><thead><tr><th>Reader</th><th>Points</th><th>Streak</th><th>Reads</th></tr></thead><tbody>${reputationRows || "<tr><td colspan='4'>No reputation activity yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Reader topics</h2><table><thead><tr><th>Topic</th><th>Author</th><th>Replies</th><th>Reputation</th><th>Public</th></tr></thead><tbody>${topicRows || "<tr><td colspan='5'>No topics yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Polls</h2><table><thead><tr><th>Poll</th><th>Status</th><th>Votes</th></tr></thead><tbody>${pollRows || "<tr><td colspan='3'>No polls yet.</td></tr>"}</tbody></table></section>
  `, "community");
}

function itRoomsPage(user, message = "") {
  const rooms = getItRooms({ includeInactive: true });
  const rows = rooms.map((room) => `
    <tr>
      <td><strong>${escapeHtml(room.name)}</strong><small>${escapeHtml(room.description)}</small></td>
      <td>${escapeHtml(room.topic)}<small>${escapeHtml(room.accessLevel)}</small></td>
      <td><span class="status">${escapeHtml(room.status)}</span></td>
      <td>${Number(room.postCount || 0).toLocaleString()}</td>
      <td><a href="/#/it-rooms/${escapeHtml(room.slug)}">Open public room</a></td>
    </tr>
  `).join("");
  return adminLayout("IT Rooms", user, `
    <section class="admin-heading"><span>Professional discussion spaces</span><h1>IT rooms</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Rooms</span><strong>${Number(rooms.length).toLocaleString()}</strong></article>
      <article><span>Active</span><strong>${Number(rooms.filter((room) => room.status === "active").length).toLocaleString()}</strong></article>
      <article><span>Posts</span><strong>${Number(rooms.reduce((sum, room) => sum + Number(room.postCount || 0), 0)).toLocaleString()}</strong></article>
      <article><span>Reader-gated</span><strong>${Number(rooms.filter((room) => room.accessLevel !== "public").length).toLocaleString()}</strong></article>
    </section>
    <section class="admin-panel">
      <h2>Create IT room</h2>
      <form class="admin-form flat" method="post" action="/admin/it-rooms">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Name<input name="name" required></label>
          <label>Slug<input name="slug" placeholder="cloud-devops"></label>
          <label>Topic<input name="topic" placeholder="Cloud, Security, AI"></label>
          <label>Access<select name="accessLevel"><option value="public">Public</option><option value="reader">Signed-in readers</option><option value="member">Members</option></select></label>
          <label>Status<select name="status"><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
          <label>Sort order<input name="sortOrder" type="number" value="0"></label>
          <label>Description<textarea name="description" required></textarea></label>
        </div>
        <button class="button primary" type="submit">Save IT room</button>
      </form>
    </section>
    <section class="admin-panel">
      <h2>Rooms</h2>
      <table><thead><tr><th>Room</th><th>Topic</th><th>Status</th><th>Posts</th><th>Public</th></tr></thead><tbody>${rows || "<tr><td colspan='5'>No rooms yet.</td></tr>"}</tbody></table>
    </section>
  `, "itrooms");
}

function retentionPage(user) {
  const dashboard = getRetentionDashboard();
  const leaderboardRows = dashboard.leaderboard.map((reader) => `
    <tr>
      <td><strong>#${Number(reader.rank)} ${escapeHtml(reader.name)}</strong><small>${(reader.badges || []).map((badge) => escapeHtml(badge)).join(", ") || "No badges yet"}</small></td>
      <td>${Number(reader.points || 0).toLocaleString()}</td>
      <td>${Number(reader.currentStreak || 0).toLocaleString()} current / ${Number(reader.bestStreak || 0).toLocaleString()} best</td>
      <td>${Number(reader.completedReads || 0).toLocaleString()}</td>
    </tr>
  `).join("");
  const eventRows = dashboard.pointEvents.map((event) => `
    <tr>
      <td><strong>${escapeHtml(event.readerName)}</strong><small>${escapeHtml(event.createdAt)}</small></td>
      <td>${escapeHtml(event.action)}</td>
      <td>${Number(event.points || 0).toLocaleString()}</td>
      <td>${escapeHtml(event.referenceType || "")} ${escapeHtml(event.referenceId || "")}</td>
    </tr>
  `).join("");
  return adminLayout("Retention", user, `
    <section class="admin-heading"><span>Gamification & retention</span><h1>Reader streaks, badges, points</h1></section>
    <section class="admin-stats">
      <article><span>Readers</span><strong>${Number(dashboard.stats.readers).toLocaleString()}</strong></article>
      <article><span>Active today</span><strong>${Number(dashboard.stats.activeToday).toLocaleString()}</strong></article>
      <article><span>Completed reads</span><strong>${Number(dashboard.stats.completedReads).toLocaleString()}</strong></article>
      <article><span>Avg streak</span><strong>${Number(dashboard.stats.avgStreak).toLocaleString()}</strong></article>
      <article><span>Badges</span><strong>${Number(dashboard.stats.badgesAwarded).toLocaleString()}</strong></article>
      <article><span>Total points</span><strong>${Number(dashboard.stats.totalPoints).toLocaleString()}</strong></article>
    </section>
    <section class="admin-panel"><h2>Leaderboard</h2><table><thead><tr><th>Reader</th><th>Points</th><th>Streak</th><th>Completed reads</th></tr></thead><tbody>${leaderboardRows || "<tr><td colspan='4'>No reader activity yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Recent point events</h2><table><thead><tr><th>Reader</th><th>Action</th><th>Points</th><th>Reference</th></tr></thead><tbody>${eventRows || "<tr><td colspan='4'>No points awarded yet.</td></tr>"}</tbody></table></section>
  `, "retention");
}

function mediaPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/media");
  const optimization = getMediaOptimizationDashboard();
  const settings = optimization.settings;
  const readiness = optimization.readiness || getMediaStorageStatus();
  const blockerRows = readiness.blockers?.length ? readiness.blockers.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>Cloud media storage checks passed.</li>";
  const warningRows = readiness.warnings?.length ? readiness.warnings.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>No media warnings.</li>";
  const page = adminListPage(args.url, getAdminMedia(), "/admin/media", { defaultLimit: 24 });
  const rows = page.rows.map((item) => `
    <article class="media-card">
      ${String(item.type || "").startsWith("video/") ? `<video src="${escapeHtml(item.url)}" controls></video>` : String(item.type || "").startsWith("audio/") ? `<div class="audio-preview"><span>Audio</span><audio src="${escapeHtml(item.url)}" controls></audio></div>` : `<img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.altText || item.title)}">`}
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.type)} · ${escapeHtml(item.folder)}</small>
        <small>${escapeHtml(item.type)} / ${escapeHtml(item.folder)} / ${Number(item.sizeBytes || 0).toLocaleString()} bytes</small>
        <small>Storage: ${escapeHtml(item.storageProvider || "local")} / ${escapeHtml(item.processingStatus || "ready")} / ${escapeHtml(item.scanStatus || "unknown")}</small>
        <code>${escapeHtml(item.url)}</code>
        <small>CDN: ${escapeHtml(item.cdnUrl || item.optimizedUrl || item.url)}</small>
        ${item.variants?.length ? `<small>${item.variants.length} responsive variants ready</small>` : ""}
      </div>
    </article>
  `).join("");

  return adminLayout("Media", user, `
    <section class="admin-heading"><span>CDN & media optimization</span><h1>Media library</h1></section>
    ${args.message ? `<div class="alert success">${escapeHtml(args.message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Assets</span><strong>${Number(optimization.totals.assets).toLocaleString()}</strong></article>
      <article><span>Images</span><strong>${Number(optimization.totals.images).toLocaleString()}</strong></article>
      <article><span>Videos</span><strong>${Number(optimization.totals.videos).toLocaleString()}</strong></article>
      <article><span>Variants</span><strong>${Number(optimization.totals.variants).toLocaleString()}</strong></article>
      <article><span>Total size</span><strong>${Number(optimization.totals.totalBytes).toLocaleString()} bytes</strong></article>
      <article><span>Storage readiness</span><strong>${readiness.productionReady ? "Production-ready" : "Action needed"}</strong></article>
      <article><span>CDN</span><strong>${readiness.cdnReady ? "Configured" : "Missing"}</strong></article>
    </section>
    <section class="admin-panel">
      <h2>Production media readiness</h2>
      <p class="muted">Provider: ${escapeHtml(readiness.provider)} / upload mode: ${escapeHtml(readiness.uploadMode)} / scan mode: ${escapeHtml(readiness.scanMode)}</p>
      <div class="readiness-grid">
        <article class="${readiness.productionReady ? "ready" : "blocked"}"><strong>${readiness.productionReady ? "Ready" : "Blocked"}</strong><span>Cloud object storage</span></article>
        <article class="${readiness.cdnReady ? "ready" : "blocked"}"><strong>${readiness.cdnReady ? "Ready" : "Blocked"}</strong><span>Public media delivery</span></article>
        <article><strong>${Number(readiness.maxVideoUploadBytes || 0).toLocaleString()} bytes</strong><span>Video upload limit</span></article>
      </div>
      <h3>Blockers</h3>
      <ul>${blockerRows}</ul>
      <h3>Warnings</h3>
      <ul>${warningRows}</ul>
    </section>
    <section class="admin-panel">
      <h2>Optimization settings</h2>
      <form class="admin-form flat" method="post" action="/admin/media/optimization">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>CDN base URL<input name="cdnBaseUrl" value="${escapeHtml(settings.cdnBaseUrl)}" placeholder="https://cdn.yourdomain.com"></label>
          <label>Storage provider<select name="storageProvider"><option value="local" ${settings.storageProvider === "local" ? "selected" : ""}>Local development</option><option value="digitalocean-spaces" ${settings.storageProvider === "digitalocean-spaces" ? "selected" : ""}>DigitalOcean Spaces</option><option value="cloudflare-r2" ${settings.storageProvider === "cloudflare-r2" ? "selected" : ""}>Cloudflare R2</option><option value="aws-s3" ${settings.storageProvider === "aws-s3" ? "selected" : ""}>AWS S3 compatible</option></select></label>
          <label>Optimization mode<select name="optimizationMode"><option value="metadata" ${settings.optimizationMode === "metadata" ? "selected" : ""}>Metadata and CDN-ready URLs</option><option value="cdn-query" ${settings.optimizationMode === "cdn-query" ? "selected" : ""}>CDN query transforms</option></select></label>
          <label>Image widths<input name="imageWidths" value="${escapeHtml(settings.imageWidths.join(", "))}"></label>
          <label>Cache policy<input name="cacheControl" value="${escapeHtml(settings.cacheControl)}"></label>
          <label>Video streaming<select name="videoStreamingProvider"><option value="local" ${settings.videoStreamingProvider === "local" ? "selected" : ""}>Local MP4</option><option value="cloudflare-stream" ${settings.videoStreamingProvider === "cloudflare-stream" ? "selected" : ""}>Cloudflare Stream</option><option value="mux" ${settings.videoStreamingProvider === "mux" ? "selected" : ""}>Mux</option></select></label>
          <label>Multi-CDN JSON<textarea name="multiCdn">${escapeHtml(JSON.stringify({ primary: settings.cdnBaseUrl || "local", failover: [] }))}</textarea></label>
          <label class="check-field"><input type="checkbox" name="cdnEnabled" ${settings.cdnBaseUrl ? "checked" : ""}> Enable CDN URL rewriting</label>
          <label class="check-field"><input type="checkbox" name="adaptiveImages" ${settings.adaptiveImages ? "checked" : ""}> Enable adaptive images</label>
          <label class="check-field"><input type="checkbox" name="multiCdnEnabled"> Enable multi-CDN policy</label>
        </div>
        <button class="button primary" type="submit">Save media settings</button>
      </form>
      <form class="inline-form" method="post" action="/admin/media/variants/rebuild">${csrfInput(user)}<button type="submit">Rebuild responsive variants</button></form>
    </section>
    <section class="admin-panel media-upload-panel">
      <h2>Upload media</h2>
      <form class="admin-form flat" method="post" action="/admin/media/upload" enctype="multipart/form-data">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Title<input name="title" required></label>
          <label>Alt text<input name="altText"></label>
          <label>Caption<input name="caption"></label>
          <label>Folder<input name="folder" value="Editorial"></label>
          <label class="file-field">Media file<input type="file" name="media" accept=".jpg,.jpeg,.png,.webp,.svg,.mp4,.mp3,.m4a,.wav,.ogg,image/jpeg,image/png,image/webp,image/svg+xml,video/mp4,audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,audio/ogg" required></label>
        </div>
        <button class="button primary" type="submit">Upload media</button>
      </form>
    </section>
    <section class="admin-panel">${page.controls}</section>
    <section class="media-grid">${rows || "<p class='muted'>No media uploaded yet.</p>"}</section>
    <section class="admin-panel">${page.controls}</section>
  `, "media");
}

function commentsPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/comments");
  const page = adminListPage(args.url, getAdminComments(), "/admin/comments");
  const rows = page.rows.map((comment) => `
    <tr>
      <td><strong>${escapeHtml(comment.userName)}</strong><small>${escapeHtml(comment.content)}</small></td>
      <td><a href="/#/article/${escapeHtml(comment.articleSlug)}">${escapeHtml(comment.articleTitle)}</a></td>
      <td><span class="status">${escapeHtml(comment.status)}</span></td>
      <td>
        <form class="inline-form" method="post" action="/admin/comments/${comment.id}/status">
          ${csrfInput(user)}
          <button name="status" value="approved">Approve</button>
          <button name="status" value="rejected">Reject</button>
        </form>
      </td>
    </tr>
  `).join("");

  return adminLayout("Comments", user, `
    <section class="admin-heading"><span>Moderation</span><h1>Comments</h1></section>
    <section class="admin-panel">
      ${page.controls}
      <table><thead><tr><th>Comment</th><th>Article</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table>
      ${page.controls}
    </section>
  `, "comments");
}

function subscribersPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/subscribers");
  const dashboard = getNewsletterMarketingDashboard();
  const page = adminListPage(args.url, getAdminSubscribers(), "/admin/subscribers");
  const segmentRows = (dashboard.subscribers || []).map((segment) => `
    <article>
      <span>${escapeHtml(segment.status)}</span>
      <strong>${Number(segment.count || 0).toLocaleString()}</strong>
      <small>${escapeHtml(segment.segment || "weekly-tech")}</small>
    </article>
  `).join("");
  const rows = page.rows.map((subscriber) => `
    <tr><td><strong>${escapeHtml(subscriber.email)}</strong><small>${escapeHtml(subscriber.source)}</small></td><td>${escapeHtml(subscriber.segment)}</td><td>${escapeHtml(subscriber.status)}</td><td>${escapeHtml(subscriber.createdAt)}</td></tr>
  `).join("");
  return adminLayout("Subscribers", user, `
    <section class="admin-heading"><span>Audience</span><h1>Newsletter subscribers</h1></section>
    <section class="admin-panel newsletter-admin-command">
      <h2>Subscriber segmentation</h2>
      <p class="muted">Confirmed, pending, and unsubscribed readers are grouped by topic segment so campaigns can target the right audience.</p>
      <div class="newsletter-admin-segments">${segmentRows || "<p class='muted'>No subscribers yet.</p>"}</div>
    </section>
    <section class="admin-panel">${page.controls}<table><thead><tr><th>Email</th><th>Segment</th><th>Status</th><th>Created</th></tr></thead><tbody>${rows}</tbody></table>${page.controls}</section>
  `, "subscribers");
}

function usersPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/users");
  const collections = getAdminCollections();
  const roleOptions = (selected = "role-writer") => collections.roles.map((role) => `<option value="${escapeHtml(role.id)}" ${selected === role.id ? "selected" : ""}>${escapeHtml(role.name)}</option>`).join("");
  const roleSummary = collections.roles.map((role) => `
    <article>
      <strong>${escapeHtml(role.name)}</strong>
      <span>${Number(role.userCount || 0)} assigned</span>
    </article>
  `).join("");
  const page = adminListPage(args.url, getAdminUsers(), "/admin/users");
  const rows = page.rows.map((row) => `
    <tr>
      <td><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(row.email)}</small></td>
      <td>${escapeHtml(row.role)}</td>
      <td><span class="status">${escapeHtml(row.status)}</span></td>
      <td>${escapeHtml(row.createdAt)}</td>
      <td>
        <form class="inline-form" method="post" action="/admin/users">
          ${csrfInput(user)}
          <input type="hidden" name="id" value="${escapeHtml(row.id)}">
          <input type="hidden" name="name" value="${escapeHtml(row.name)}">
          <input type="hidden" name="email" value="${escapeHtml(row.email)}">
          <input type="hidden" name="roleId" value="${escapeHtml(row.roleId)}">
          <button name="status" value="${row.status === "suspended" ? "active" : "suspended"}">${row.status === "suspended" ? "Activate" : "Suspend"}</button>
        </form>
      </td>
    </tr>
  `).join("");
  return adminLayout("Users", user, `
    <section class="admin-heading admin-hero-heading">
      <div>
        <span>Access control</span>
        <h1>Users and role assignment</h1>
        <p>No admin signup is exposed. Admins create newsroom accounts here, choose the role, then control the privileges from the roles workbench.</p>
      </div>
      <a class="button secondary" href="/admin/roles#create-role">Create role</a>
    </section>
    ${args.message ? `<div class="alert success">${escapeHtml(args.message)}</div>` : ""}
    <section class="access-layout">
      <article class="admin-panel access-create-panel">
        <span class="panel-kicker">Step 1</span>
        <h2>Create newsroom account</h2>
        <p>Use this for reporters, writers, editors, moderators, and operational staff. The role below controls what appears in their admin.</p>
        <form class="admin-form flat" method="post" action="/admin/users">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>Name<input name="name" required></label>
            <label>Email<input type="email" name="email" required></label>
            <label>Temporary password<input type="password" name="password" minlength="8" placeholder="Set a private temporary password" required></label>
            <label class="role-select-field">Role and privilege set<select name="roleId">${roleOptions()}</select><small>Edit what this role can do from Roles.</small></label>
            <label>Status<select name="status"><option value="active">Active</option><option value="suspended">Suspended</option></select></label>
          </div>
          <button class="button primary" type="submit">Save user</button>
        </form>
      </article>
      <aside class="admin-panel access-guide-panel">
        <span class="panel-kicker">Step 2</span>
        <h2>Role placement</h2>
        <p>Create users here, then open Roles to create a new role or change the privileges attached to an existing role.</p>
        <div class="access-steps">
          <span>Create user</span>
          <span>Assign role</span>
          <span>Edit privileges</span>
        </div>
        <div class="role-summary-grid">${roleSummary}</div>
        <a class="button secondary" href="/admin/roles">Open roles workbench</a>
      </aside>
    </section>
    <section class="admin-panel">${page.controls}<table><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table>${page.controls}</section>
  `, "users");
}

function rolesPage(user, urlOrQuery = "", queryOrMessage = "", message = "") {
  const url = urlOrQuery?.searchParams ? urlOrQuery : new URL("http://local/admin/roles");
  const query = urlOrQuery?.searchParams ? String(queryOrMessage || "") : String(urlOrQuery || "");
  const notice = urlOrQuery?.searchParams ? String(message || "") : String(queryOrMessage || "");
  const permissions = getPermissionCatalog();
  const allRoles = getAdminRoles("");
  const permissionBoxes = (selected = []) => permissions.map((permission) => {
    const checked = selected.includes(permission.key) ? "checked" : "";
    return `
      <label class="permission-option">
        <input type="checkbox" name="permissions" value="${escapeHtml(permission.key)}" ${checked}>
        <span><strong>${escapeHtml(permission.label)}</strong><small>${escapeHtml(permission.description)}</small></span>
      </label>
    `;
  }).join("");
  const page = adminListPage(url, getAdminRoles(query), "/admin/roles");
  const privilegeCards = permissions.map((permission) => {
    const matchingRoles = allRoles
      .filter((role) => role.permissions.includes("all") || role.permissions.includes(permission.key))
      .map((role) => role.name);
    return `
      <article>
        <span>${Number(matchingRoles.length).toLocaleString()} roles</span>
        <strong>${escapeHtml(permission.label)}</strong>
        <small>${escapeHtml(permission.description)}</small>
        <em>${matchingRoles.slice(0, 4).map(escapeHtml).join(" · ") || "No roles yet"}</em>
      </article>
    `;
  }).join("");
  const roleRows = page.rows.map((role) => `
    <article class="role-card">
      <div>
        <span class="status">${Number(role.userCount || 0)} ${Number(role.userCount || 0) === 1 ? "user" : "users"}</span>
        <h2>${escapeHtml(role.name)}</h2>
        <p>${role.permissions.map((permission) => escapeHtml(permissions.find((item) => item.key === permission)?.label || permission)).join(" · ")}</p>
      </div>
      <form class="admin-form flat" method="post" action="/admin/roles">
        ${csrfInput(user)}
        <input type="hidden" name="id" value="${escapeHtml(role.id)}">
        <label>Role name<input name="name" value="${escapeHtml(role.name)}" required></label>
        <div class="permission-grid">${permissionBoxes(role.permissions)}</div>
        <button class="button secondary" type="submit">Update role</button>
      </form>
    </article>
  `).join("");
  return adminLayout("Roles", user, `
    <section class="admin-heading"><span>Access control</span><h1>Roles and privileges</h1><p>Create searchable roles and choose exactly which admin privileges each role receives.</p></section>
    ${notice ? `<div class="alert success">${escapeHtml(notice)}</div>` : ""}
    <section class="admin-panel">
      <h2>Create role</h2>
      <form class="admin-form flat" method="post" action="/admin/roles">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Role name<input name="name" placeholder="Senior Writer" required></label>
        </div>
        <div class="permission-grid">${permissionBoxes(["articles"])}</div>
        <button class="button primary" type="submit">Save role</button>
      </form>
    </section>
    <section class="admin-panel">
      <h2>Search roles</h2>
      <form class="admin-form flat" method="get" action="/admin/roles">
        <div class="form-grid">
          <label>Search by role or privilege<input name="q" value="${escapeHtml(query)}" placeholder="editor, media, analytics"></label>
        </div>
        <button class="button secondary" type="submit">Search roles</button>
      </form>
    </section>
    <section class="admin-panel">${page.controls}</section>
    <section class="role-grid">${roleRows || `<article class="admin-panel"><p>No roles found for this search.</p></article>`}</section>
    <section class="admin-panel">${page.controls}</section>
  `, "roles");
}

function rolesWorkbenchPage(user, urlOrQuery = "", queryOrMessage = "", message = "") {
  const url = urlOrQuery?.searchParams ? urlOrQuery : new URL("http://local/admin/roles");
  const query = urlOrQuery?.searchParams ? String(queryOrMessage || "") : String(urlOrQuery || "");
  const notice = urlOrQuery?.searchParams ? String(message || "") : String(queryOrMessage || "");
  const permissions = getPermissionCatalog();
  const allRoles = getAdminRoles("");
  const permissionBoxes = (selected = []) => permissions.map((permission) => {
    const checked = selected.includes(permission.key) ? "checked" : "";
    return `
      <label class="permission-option">
        <input type="checkbox" name="permissions" value="${escapeHtml(permission.key)}" ${checked}>
        <span><strong>${escapeHtml(permission.label)}</strong><small>${escapeHtml(permission.description)}</small></span>
      </label>
    `;
  }).join("");
  const page = adminListPage(url, getAdminRoles(query), "/admin/roles");
  const privilegeCards = permissions.map((permission) => {
    const matchingRoles = allRoles
      .filter((role) => role.permissions.includes("all") || role.permissions.includes(permission.key))
      .map((role) => role.name);
    return `
      <article>
        <span>${Number(matchingRoles.length).toLocaleString()} roles</span>
        <strong>${escapeHtml(permission.label)}</strong>
        <small>${escapeHtml(permission.description)}</small>
        <em>${matchingRoles.slice(0, 4).map(escapeHtml).join(" · ") || "No roles yet"}</em>
      </article>
    `;
  }).join("");
  const roleRows = page.rows.map((role) => `
    <article class="role-card">
      <div class="role-card-summary">
        <div>
          <span class="status">${Number(role.userCount || 0)} ${Number(role.userCount || 0) === 1 ? "user" : "users"}</span>
          <span class="status muted-status">${Number(role.permissions.length)} privileges</span>
        </div>
        <h2>${escapeHtml(role.name)}</h2>
        <p>${role.permissions.map((permission) => escapeHtml(permissions.find((item) => item.key === permission)?.label || permission)).join(" · ")}</p>
        <a class="button ghost dark" href="/admin/users">Assign users</a>
      </div>
      <details class="role-editor">
        <summary>Edit role privileges</summary>
        <form class="admin-form flat" method="post" action="/admin/roles">
          ${csrfInput(user)}
          <input type="hidden" name="id" value="${escapeHtml(role.id)}">
          <label>Role name<input name="name" value="${escapeHtml(role.name)}" required></label>
          <div class="permission-grid">${permissionBoxes(role.permissions)}</div>
          <button class="button secondary" type="submit">Update role</button>
        </form>
      </details>
    </article>
  `).join("");
  return adminLayout("Roles", user, `
    <section class="admin-heading admin-hero-heading">
      <div>
        <span>Access control</span>
        <h1>Roles and privileges</h1>
        <p>Create a new role, choose exactly what that role can do, then assign it to users from the Users screen.</p>
      </div>
      <a class="button primary" href="#create-role">Create new role</a>
    </section>
    ${notice ? `<div class="alert success">${escapeHtml(notice)}</div>` : ""}
    <section class="role-workbench">
      <article class="admin-panel role-create-panel" id="create-role">
        <span class="panel-kicker">New role</span>
        <h2>Open a role</h2>
        <p>This is where the admin creates a new role before assigning it to users. Start with the closest privilege set, then tighten it later.</p>
        <form class="admin-form flat" method="post" action="/admin/roles">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>Role name<input name="name" placeholder="Senior Writer" required></label>
          </div>
          <div class="permission-grid">${permissionBoxes(["articles"])}</div>
          <button class="button primary" type="submit">Save role</button>
        </form>
      </article>
      <aside class="admin-panel role-guide-panel">
        <span class="panel-kicker">Privilege map</span>
        <h2>What each permission unlocks</h2>
        <p>Use this map to see which roles already receive each privilege before changing access.</p>
        <div class="privilege-stat-grid">${privilegeCards}</div>
      </aside>
    </section>
    <section class="admin-panel role-search-panel">
      <div>
        <span class="panel-kicker">Find roles</span>
        <h2>Search roles</h2>
      </div>
      <form class="admin-form flat compact-search-form" method="get" action="/admin/roles">
        <label>Search by role or privilege<input name="q" value="${escapeHtml(query)}" placeholder="editor, media, analytics"></label>
        <button class="button secondary" type="submit">Search roles</button>
      </form>
    </section>
    <section class="admin-panel list-control-panel">${page.controls}</section>
    <section class="role-grid">${roleRows || `<article class="admin-panel"><p>No roles found for this search.</p></article>`}</section>
    <section class="admin-panel list-control-panel">${page.controls}</section>
  `, "roles");
}

function categoriesPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/categories");
  const categories = getAdminCollections().categories;
  const page = adminListPage(args.url, categories, "/admin/categories");
  const rows = page.rows.map((category) => `
    <tr>
      <td><strong>${escapeHtml(category.name)}</strong><small>${escapeHtml(category.description)}</small></td>
      <td>${escapeHtml(category.slug)}</td>
      <td><span class="status" style="border-color:${escapeHtml(category.color)}">${escapeHtml(category.icon)}</span></td>
      <td>${Number(category.sortOrder || 0)}</td>
      <td>
        <form class="inline-form" method="post" action="/admin/categories/${category.id}/delete">
          ${csrfInput(user)}
          <button type="submit">Delete</button>
        </form>
      </td>
    </tr>
  `).join("");
  return adminLayout("Categories", user, `
    <section class="admin-heading"><span>Taxonomy</span><h1>Category manager</h1></section>
    ${args.message ? `<div class="alert success">${escapeHtml(args.message)}</div>` : ""}
    <section class="admin-panel">
      <h2>Create or update category</h2>
      <form class="admin-form flat" method="post" action="/admin/categories">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Existing category<select name="id"><option value="">New category</option>${categories.map((category) => `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`).join("")}</select></label>
          <label>Name<input name="name" required></label>
          <label>Slug<input name="slug"></label>
          <label>Color<input name="color" type="color" value="#62d6ff"></label>
          <label>Icon label<input name="icon" value="IT" maxlength="4"></label>
          <label>Sort order<input name="sortOrder" type="number" value="0"></label>
          <label>Description<textarea name="description"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save category</button>
      </form>
    </section>
    <section class="admin-panel">${page.controls}<table><thead><tr><th>Category</th><th>Slug</th><th>Icon</th><th>Order</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table>${page.controls}</section>
  `, "categories");
}

function tagsPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/tags");
  const tags = getAdminCollections().tags;
  const page = adminListPage(args.url, tags, "/admin/tags");
  const rows = page.rows.map((tag) => `
    <tr>
      <td><strong>${escapeHtml(tag.name)}</strong></td>
      <td>${escapeHtml(tag.slug)}</td>
      <td>
        <form class="inline-form" method="post" action="/admin/tags/${tag.id}/delete">
          ${csrfInput(user)}
          <button type="submit">Delete</button>
        </form>
      </td>
    </tr>
  `).join("");
  return adminLayout("Tags", user, `
    <section class="admin-heading"><span>Taxonomy</span><h1>Tag manager</h1></section>
    ${args.message ? `<div class="alert success">${escapeHtml(args.message)}</div>` : ""}
    <section class="admin-panel">
      <h2>Create or update tag</h2>
      <form class="admin-form flat" method="post" action="/admin/tags">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Existing tag<select name="id"><option value="">New tag</option>${tags.map((tag) => `<option value="${escapeHtml(tag.id)}">${escapeHtml(tag.name)}</option>`).join("")}</select></label>
          <label>Name<input name="name" required></label>
          <label>Slug<input name="slug"></label>
        </div>
        <button class="button primary" type="submit">Save tag</button>
      </form>
    </section>
    <section class="admin-panel">${page.controls}<table><thead><tr><th>Tag</th><th>Slug</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table>${page.controls}</section>
  `, "tags");
}

function auditPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/audit");
  const page = adminListPage(args.url, getAuditLogs(), "/admin/audit");
  const rows = page.rows.map((log) => `
    <tr>
      <td><strong>${escapeHtml(log.action)}</strong><small>${escapeHtml(log.details || "")}</small></td>
      <td>${escapeHtml(log.userName || "System")}</td>
      <td>${escapeHtml(log.targetType)}${log.targetId ? `<small>${escapeHtml(log.targetId)}</small>` : ""}</td>
      <td>${escapeHtml(log.createdAt)}</td>
    </tr>
  `).join("");

  return adminLayout("Audit Log", user, `
    <section class="admin-heading"><span>Trace</span><h1>Audit log</h1></section>
    <section class="admin-panel">
      ${page.controls}
      <table><thead><tr><th>Action</th><th>User</th><th>Target</th><th>Date</th></tr></thead><tbody>${rows || "<tr><td colspan='4'>No audit activity yet.</td></tr>"}</tbody></table>
      ${page.controls}
    </section>
  `, "audit");
}

function backupPage(user, backup = null) {
  return adminLayout("Backups", user, `
    <section class="admin-heading"><span>Operations</span><h1>Backups</h1></section>
    <section class="admin-panel">
      <h2>Create backup/export</h2>
      <p>Creates a copy of the SQLite database and a JSON export of core content, media records, subscribers, and ad placements.</p>
      ${backup ? `<div class="alert success"><strong>Backup created.</strong><br>Database: ${escapeHtml(backup.dbBackupPath)}<br>JSON: ${escapeHtml(backup.jsonBackupPath)}</div>` : ""}
      <form class="inline-form" method="post" action="/admin/backup/create">
        ${csrfInput(user)}
        <button class="button primary" type="submit">Create backup</button>
      </form>
    </section>
  `, "backup");
}

function seoPage(user) {
  const seo = getSeoDashboard();
  const lowRows = seo.lowScoreItems.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.type)} / ${escapeHtml(item.slug)}</small></td>
      <td>${Number(item.score).toLocaleString()}%</td>
      <td>${item.checks.filter((check) => !check.ok).map((check) => escapeHtml(check.label)).join(", ") || "Ready"}</td>
    </tr>
  `).join("");
  const schemaRows = seo.schemaTypes.map((type) => `<tr><td>${escapeHtml(type)}</td><td><span class="status">active</span></td></tr>`).join("");
  return adminLayout("SEO", user, `
    <section class="admin-heading"><span>Advanced SEO infrastructure</span><h1>Google News, schema, scoring</h1></section>
    <section class="admin-stats">
      <article><span>Average SEO score</span><strong>${Number(seo.averageScore).toLocaleString()}%</strong></article>
      <article><span>Indexed URLs</span><strong>${Number(seo.indexedUrls).toLocaleString()}</strong></article>
      <article><span>Google News URLs</span><strong>${Number(seo.newsSitemapCount).toLocaleString()}</strong></article>
      <article><span>Schema types</span><strong>${Number(seo.schemaTypes.length).toLocaleString()}</strong></article>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Needs attention</h2><table><thead><tr><th>Item</th><th>Score</th><th>Missing</th></tr></thead><tbody>${lowRows || "<tr><td colspan='3'>All indexed items are healthy.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>Structured data</h2><table><thead><tr><th>Schema</th><th>Status</th></tr></thead><tbody>${schemaRows}</tbody></table></section>
    </section>
    <section class="admin-panel">
      <h2>SEO feeds</h2>
      <p>Primary sitemap, Google News sitemap, robots.txt, AMP articles, JSON-LD schema endpoints, Open Graph metadata, canonical URLs, and internal link suggestions are active.</p>
      <div class="inline-actions">
        <a class="button ghost" href="/sitemap.xml">Sitemap</a>
        <a class="button ghost" href="/news-sitemap.xml">Google News sitemap</a>
        <a class="button ghost" href="/robots.txt">Robots</a>
      </div>
    </section>
  `, "seo");
}

function languagesPage(user, message = "") {
  const globalization = getGlobalizationDashboard();
  const languages = globalization.languages;
  const translations = globalization.translations;
  const articles = getAdminArticles();
  const languageRows = languages.map((language) => `
    <tr>
      <td><strong>${escapeHtml(language.name)}</strong><small>${escapeHtml(language.nativeName)}</small></td>
      <td>${escapeHtml(language.code)}</td>
      <td>${escapeHtml(language.direction.toUpperCase())}</td>
      <td><span class="status">${language.enabled ? "enabled" : "disabled"}</span></td>
    </tr>
  `).join("");
  const translationRows = translations.map((translation) => `
    <tr>
      <td><strong>${escapeHtml(translation.title)}</strong><small>${escapeHtml(translation.articleTitle)}</small></td>
      <td>${escapeHtml(translation.nativeName)} / ${escapeHtml(translation.direction.toUpperCase())}</td>
      <td><span class="status">${escapeHtml(translation.status)}</span></td>
      <td><a href="/#/article/${escapeHtml(translation.articleSlug)}?lang=${escapeHtml(translation.languageCode)}">Open</a></td>
    </tr>
  `).join("");
  const articleOptions = articles.map((article) => `<option value="${escapeHtml(article.id)}">${escapeHtml(article.title)}</option>`).join("");
  const languageOptions = languages.filter((language) => language.code !== "en" && language.enabled).map((language) => `<option value="${escapeHtml(language.code)}">${escapeHtml(language.name)} (${escapeHtml(language.nativeName)})</option>`).join("");
  const readinessRows = globalization.readiness.map((item) => `
    <article>
      <span class="${item.ready ? "ready" : "pending"}">${item.ready ? "Ready" : "Needs setup"}</span>
      <strong>${escapeHtml(item.label)}</strong>
      <small>${escapeHtml(item.detail)}</small>
    </article>
  `).join("");
  const editionRows = globalization.countryEditions.map((edition) => `
    <tr>
      <td><strong>${escapeHtml(edition.label)}</strong><small>${escapeHtml(edition.contentFocus)}</small></td>
      <td>${edition.languageCodes.map((code) => `<span class="status">${escapeHtml(code.toUpperCase())}</span>`).join(" ")}</td>
      <td>${escapeHtml(edition.direction.toUpperCase())}</td>
      <td><strong>${escapeHtml(edition.timezone)}</strong><small>${escapeHtml(edition.currency)} / ${escapeHtml(edition.regions.join(", "))}</small></td>
      <td><span class="status">${escapeHtml(edition.status)}</span></td>
    </tr>
  `).join("");
  const targetingRows = globalization.regionalTargeting.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.signal)}</strong></td>
      <td>${escapeHtml(item.appliedTo)}</td>
      <td><span class="status">${item.ready ? "ready" : "pending"}</span></td>
    </tr>
  `).join("");
  const timezoneRows = globalization.timezones.map((item) => `<tr><td><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.zone)}</small></td><td>${escapeHtml(item.usage)}</td></tr>`).join("");
  const currencyRows = globalization.currencies.map((item) => `<tr><td><strong>${escapeHtml(item.code)}</strong><small>${escapeHtml(item.label)}</small></td><td>${escapeHtml(item.usage)}</td></tr>`).join("");
  const workflowItems = globalization.translationWorkflow.map((step, index) => `<li><strong>${index + 1}</strong><span>${escapeHtml(step)}</span></li>`).join("");
  return adminLayout("Languages", user, `
    <section class="admin-heading"><span>Section 24 multi-language & globalization</span><h1>Globalization command center</h1><p>Multi-language system operations for RTL/LTR publishing, localized SEO, country editions, regional targeting, timezone management, and multi-currency readiness.</p></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Enabled languages</span><strong>${globalization.stats.enabledLanguages.toLocaleString()}</strong></article>
      <article><span>Translations</span><strong>${globalization.stats.translations.toLocaleString()}</strong></article>
      <article><span>Country editions</span><strong>${globalization.stats.countryEditions.toLocaleString()}</strong></article>
      <article><span>Readiness checks</span><strong>${globalization.readiness.filter((item) => item.ready).length}/${globalization.readiness.length}</strong></article>
    </section>
    <section class="admin-panel globalization-command-center">
      <div class="section-kicker">Section 24 workflow</div>
      <h2>Global publishing workflow</h2>
      <div class="workflow-lane">
        <span>Languages</span><span>RTL/LTR</span><span>Translation workflow</span><span>Localized SEO</span><span>Regions</span><span>Country editions</span><span>Timezone management</span><span>Multi-currency support</span>
      </div>
      <p>Manage language switching, translated article pages, SEO metadata, regional edition rules, commercial currency defaults, and timezone-aware scheduling from one newsroom view.</p>
    </section>
    <section class="admin-panel">
      <h2>Section 24 readiness matrix</h2>
      <div class="admin-card-grid globalization-readiness-grid">${readinessRows}</div>
    </section>
    <section class="admin-panel">
      <h2>Create article translation</h2>
      <form class="admin-form flat" method="post" action="/admin/languages/translations">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Article<select name="articleId" required>${articleOptions}</select></label>
          <label>Language<select name="languageCode" required>${languageOptions}</select></label>
          <label>Translated title<input name="title" required></label>
          <label>Translated slug<input name="slug" placeholder="auto-generated"></label>
          <label>Status<select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label>
          <label>SEO title<input name="seoTitle"></label>
          <label>SEO description<textarea name="seoDescription"></textarea></label>
          <label>Translated subtitle<textarea name="subtitle" required></textarea></label>
          <label>Translated body<textarea name="body" required placeholder="Separate paragraphs with a blank line"></textarea></label>
        </div>
        <button class="button primary" type="submit">Save translation</button>
      </form>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Languages</h2><table><thead><tr><th>Language</th><th>Code</th><th>Direction</th><th>Status</th></tr></thead><tbody>${languageRows}</tbody></table></section>
      <section class="admin-panel"><h2>Translations</h2><table><thead><tr><th>Translation</th><th>Language</th><th>Status</th><th>Public</th></tr></thead><tbody>${translationRows || "<tr><td colspan='4'>No translations yet.</td></tr>"}</tbody></table></section>
    </section>
    <section class="admin-panel">
      <h2>Country editions</h2>
      <table><thead><tr><th>Edition</th><th>Languages</th><th>Direction</th><th>Timezone / currency</th><th>Status</th></tr></thead><tbody>${editionRows}</tbody></table>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Regional content targeting</h2><table><thead><tr><th>Signal</th><th>Applied to</th><th>Status</th></tr></thead><tbody>${targetingRows}</tbody></table></section>
      <section class="admin-panel"><h2>Localized SEO</h2><div class="readiness-list">
        <span class="${globalization.localizedSeo.hreflangReady ? "ready" : "pending"}">Hreflang ready</span>
        <span class="${globalization.localizedSeo.schemaReady ? "ready" : "pending"}">Schema markup</span>
        <span class="${globalization.localizedSeo.sitemapReady ? "ready" : "pending"}">Sitemap feeds</span>
        <span class="${globalization.localizedSeo.googleNewsReady ? "ready" : "pending"}">Google News</span>
      </div><p>${escapeHtml(globalization.localizedSeo.canonicalStrategy)}</p></section>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Timezone management</h2><table><thead><tr><th>Zone</th><th>Usage</th></tr></thead><tbody>${timezoneRows}</tbody></table></section>
      <section class="admin-panel"><h2>Multi-currency support</h2><table><thead><tr><th>Currency</th><th>Usage</th></tr></thead><tbody>${currencyRows}</tbody></table></section>
    </section>
    <section class="admin-panel">
      <h2>Translation workflow</h2>
      <ol class="globalization-workflow-list">${workflowItems}</ol>
    </section>
  `, "languages");
}

function newsApiPage(user, result = null) {
  const api = getApiDashboard();
  const integrations = getIntegrationDashboard();
  const keyRows = api.keys.map((key) => `
    <tr>
      <td><strong>${escapeHtml(key.name)}</strong><small>${escapeHtml(key.keyPrefix)}...</small></td>
      <td>${key.scopes.map((scope) => `<span class="status">${escapeHtml(scope)}</span>`).join(" ")}</td>
      <td>${Number(key.rateLimitPerMinute || 0).toLocaleString()} / min</td>
      <td><span class="status">${escapeHtml(key.status)}</span><small>${key.lastUsedAt ? `Last used ${escapeHtml(key.lastUsedAt)}` : "Not used yet"}</small></td>
      <td>${Number(key.usageCount || 0).toLocaleString()}</td>
      <td>
        <form class="inline-form" method="post" action="/admin/api/keys/${key.id}/status">
          ${csrfInput(user)}
          <button name="status" value="${key.status === "active" ? "paused" : "active"}" type="submit">${key.status === "active" ? "Pause" : "Activate"}</button>
        </form>
      </td>
    </tr>
  `).join("");
  const endpointRows = api.topEndpoints.map((endpoint) => `<tr><td>${escapeHtml(endpoint.path)}</td><td>${Number(endpoint.hits).toLocaleString()}</td></tr>`).join("");
  const restEndpointRows = integrations.restEndpoints.map((endpoint) => `
    <tr>
      <td><strong>${escapeHtml(endpoint.method)} ${escapeHtml(endpoint.path)}</strong><small>${escapeHtml(endpoint.description)}</small></td>
      <td><span class="status">${escapeHtml(endpoint.scope)}</span></td>
    </tr>
  `).join("");
  const usageRows = api.recentUsage.map((usage) => `
    <tr>
      <td><strong>${escapeHtml(usage.method)} ${escapeHtml(usage.path)}</strong><small>${escapeHtml(usage.keyName || "Unknown key")} / ${escapeHtml(usage.keyPrefix || "")}</small></td>
      <td>${Number(usage.statusCode).toLocaleString()}</td>
      <td>${escapeHtml(usage.ipAddress || "")}</td>
      <td>${escapeHtml(usage.createdAt)}</td>
    </tr>
  `).join("");
  const webhookRows = integrations.webhooks.map((webhook) => `
    <tr>
      <td><strong>${escapeHtml(webhook.name)}</strong><small>${escapeHtml(webhook.targetUrl)}</small></td>
      <td>${webhook.events.map((event) => `<span class="status">${escapeHtml(event)}</span>`).join(" ")}</td>
      <td><span class="status">${escapeHtml(webhook.status)}</span><small>${Number(webhook.deliveryCount || 0).toLocaleString()} deliveries / ${Number(webhook.failedDeliveries || 0).toLocaleString()} failed</small></td>
      <td>${escapeHtml(webhook.createdAt || "")}</td>
    </tr>
  `).join("");
  const webhookEventRows = integrations.recentWebhookEvents.map((event) => `
    <tr>
      <td><strong>${escapeHtml(event.eventType)}</strong><small>${escapeHtml(event.webhookName || "No webhook")}</small></td>
      <td><span class="status">${escapeHtml(event.deliveryStatus)}</span></td>
      <td>${Number(event.responseCode || 0).toLocaleString()}<small>${escapeHtml(event.lastError || "")}</small></td>
      <td>${escapeHtml(event.createdAt || "")}</td>
    </tr>
  `).join("");
  const integrationRows = integrations.thirdPartyIntegrations.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.key)}</small></td>
      <td>${escapeHtml(item.provider)}</td>
      <td><span class="status">${escapeHtml(item.status)}</span></td>
    </tr>
  `).join("");
  const socialRows = integrations.socialIntegrations.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.network)}</strong><small>${escapeHtml(item.notes)}</small></td>
      <td><span class="status">${item.sharingReady ? "sharing ready" : "review"}</span></td>
      <td><span class="status">${item.publishApiConnected ? "publish connected" : "provider token needed"}</span></td>
    </tr>
  `).join("");
  const readinessRows = integrations.readiness.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.id)}</small></td>
      <td><span class="status">${item.ready ? "ready" : "attention"}</span></td>
      <td>${escapeHtml(item.detail)}</td>
    </tr>
  `).join("");
  const readinessPills = integrations.readiness.map((item) => `<span class="${item.ready ? "ready" : "pending"}">${escapeHtml(item.label)}</span>`).join("");
  return adminLayout("News API", user, `
    <section class="admin-heading"><span>Section 23 API & integration ecosystem</span><h1>API and integration command center</h1></section>
    ${result?.message ? `<div class="alert success">${escapeHtml(result.message)}${result.token ? `<br><code>${escapeHtml(result.token)}</code>` : ""}</div>` : ""}
    <section class="admin-stats">
      <article><span>API keys</span><strong>${Number(api.keys.length).toLocaleString()}</strong></article>
      <article><span>Total requests</span><strong>${Number(api.totalRequests).toLocaleString()}</strong></article>
      <article><span>Requests 24h</span><strong>${Number(api.requests24h).toLocaleString()}</strong></article>
      <article><span>REST endpoints</span><strong>${Number(integrations.restEndpoints.length).toLocaleString()}</strong></article>
      <article><span>Webhooks</span><strong>${Number(integrations.webhooks.length).toLocaleString()}</strong></article>
      <article><span>Partner feed</span><strong>Ready</strong></article>
    </section>
    <section class="admin-grid two api-command-center">
      <article class="admin-panel">
        <h2>Integration workflow</h2>
        <div class="workflow-lane">
          <span>REST</span>
          <span>GraphQL</span>
          <span>Mobile API</span>
          <span>Webhooks</span>
          <span>OAuth</span>
          <span>RSS</span>
          <span>Syndication</span>
          <span>Social</span>
        </div>
        <p>Manage the developer API, mobile API contract, partner syndication, RSS feeds, GraphQL gateway, webhook delivery, OAuth provider readiness, third-party integrations, and social distribution from one admin-only surface.</p>
        <div class="readiness-list">${readinessPills}</div>
      </article>
      <article class="admin-panel">
        <h2>Developer portal</h2>
        <table><tbody>
          <tr><td>OpenAPI</td><td><a href="${escapeHtml(integrations.developerPortal.openApiUrl)}">${escapeHtml(integrations.developerPortal.openApiUrl)}</a></td></tr>
          <tr><td>GraphQL</td><td><code>${escapeHtml(integrations.developerPortal.graphqlUrl)}</code></td></tr>
          <tr><td>RSS</td><td><a href="${escapeHtml(integrations.developerPortal.rssUrl)}">${escapeHtml(integrations.developerPortal.rssUrl)}</a></td></tr>
          <tr><td>Auth</td><td>${integrations.developerPortal.authentication.map(escapeHtml).join(" / ")}</td></tr>
          <tr><td>Default rate limit</td><td>${Number(integrations.developerPortal.rateLimitPerMinuteDefault).toLocaleString()} / min</td></tr>
        </tbody></table>
      </article>
    </section>
    <section class="admin-panel">
      <h2>Section 23 readiness matrix</h2>
      <table><thead><tr><th>Capability</th><th>Status</th><th>Detail</th></tr></thead><tbody>${readinessRows}</tbody></table>
    </section>
    <section class="admin-panel">
      <h2>Create API key</h2>
      <form class="admin-form flat" method="post" action="/admin/api/keys">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Name<input name="name" placeholder="Mobile app, partner, syndication client" required></label>
          <label>Scopes<input name="scopes" value="news:read,articles:read,media:read,mobile:read,syndication:read"></label>
          <label>Rate limit per minute<input name="rateLimitPerMinute" type="number" value="120"></label>
          <label>Expires at<input name="expiresAt" type="datetime-local"></label>
          <label>Status<select name="status"><option value="active">Active</option><option value="paused">Paused</option></select></label>
        </div>
        <button class="button primary" type="submit">Create key</button>
      </form>
    </section>
    <section class="admin-panel">
      <h2>Partner endpoints</h2>
      <p>Use header <code>Authorization: Bearer YOUR_KEY</code> or <code>x-api-key</code>. Endpoints include <code>/api/v1/news</code>, <code>/api/v1/articles/:slug</code>, <code>/api/v1/categories</code>, <code>/api/v1/media</code>, <code>/api/v1/breaking</code>, and <code>/api/v1/openapi.json</code>.</p>
      <table><thead><tr><th>Endpoint</th><th>Scope</th></tr></thead><tbody>${restEndpointRows}</tbody></table>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel">
        <h2>Create webhook</h2>
        <form class="admin-form flat" method="post" action="/admin/api/webhooks">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>Name<input name="name" placeholder="Partner webhook" required></label>
            <label>Target URL<input name="targetUrl" placeholder="https://example.com/webhook" required></label>
            <label>Events<input name="events" value="article.published,breaking.created,newsletter.sent"></label>
            <label>Secret hint<input name="secretHint" placeholder="stored with provider"></label>
            <label>Status<select name="status"><option value="active">Active</option><option value="paused">Paused</option></select></label>
          </div>
          <button class="button primary" type="submit">Save webhook</button>
        </form>
      </section>
      <section class="admin-panel"><h2>GraphQL and mobile API</h2><table><tbody>
        <tr><td>GraphQL query types</td><td>${integrations.graphql.queryTypes.map(escapeHtml).join(", ")}</td></tr>
        <tr><td>Mobile API ready</td><td>${integrations.mobileApi.readyForNativeApps ? "Yes" : "No"}</td></tr>
        <tr><td>Mobile config</td><td><code>${escapeHtml(integrations.mobileApi.config)}</code></td></tr>
        <tr><td>Deep links</td><td><code>${escapeHtml(integrations.mobileApi.deepLinks)}</code></td></tr>
      </tbody></table></section>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Third-party integrations</h2><table><thead><tr><th>Integration</th><th>Provider</th><th>Status</th></tr></thead><tbody>${integrationRows}</tbody></table></section>
      <section class="admin-panel"><h2>OAuth authentication</h2><p>Reader/admin OAuth provider slots are modeled for ${integrations.oauth.recommendedProviders.map(escapeHtml).join(", ")}. Production login requires provider app credentials and callback approval.</p><table><tbody><tr><td>Callback</td><td><code>${escapeHtml(integrations.oauth.callbackPattern)}</code></td></tr><tr><td>Provider setup required</td><td>${integrations.oauth.productionProviderRequired ? "Yes" : "No"}</td></tr></tbody></table></section>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>RSS feeds and syndication</h2><table><tbody>${Object.entries(integrations.feeds).map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td><code>${escapeHtml(value)}</code></td></tr>`).join("")}${Object.entries(integrations.syndication).map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(String(value))}</td></tr>`).join("")}</tbody></table></section>
      <section class="admin-panel"><h2>Social media integrations</h2><table><thead><tr><th>Network</th><th>Sharing</th><th>Publishing</th></tr></thead><tbody>${socialRows}</tbody></table></section>
    </section>
    <section class="admin-panel"><h2>API keys</h2><table><thead><tr><th>Key</th><th>Scopes</th><th>Limit</th><th>Status</th><th>Usage</th><th>Action</th></tr></thead><tbody>${keyRows || "<tr><td colspan='6'>No API keys yet.</td></tr>"}</tbody></table></section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Webhooks</h2><table><thead><tr><th>Webhook</th><th>Events</th><th>Status</th><th>Created</th></tr></thead><tbody>${webhookRows || "<tr><td colspan='4'>No webhooks yet.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>Webhook delivery log</h2><table><thead><tr><th>Event</th><th>Status</th><th>Result</th><th>Date</th></tr></thead><tbody>${webhookEventRows || "<tr><td colspan='4'>No webhook events yet.</td></tr>"}</tbody></table></section>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Top endpoints</h2><table><thead><tr><th>Endpoint</th><th>Hits</th></tr></thead><tbody>${endpointRows || "<tr><td colspan='2'>No partner API traffic yet.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>Recent usage</h2><table><thead><tr><th>Request</th><th>Status</th><th>IP</th><th>Date</th></tr></thead><tbody>${usageRows || "<tr><td colspan='4'>No usage yet.</td></tr>"}</tbody></table></section>
    </section>
  `, "api");
}

function newsletterCampaignsPage(user, message = "") {
  const dashboard = getNewsletterMarketingDashboard();
  const delivery = getEmailDeliverySummary();
  const provider = getEmailProviderStatus();
  const campaigns = dashboard.campaigns || [];
  const eventCounts = Object.fromEntries((dashboard.events || []).map((event) => [event.eventType, event.count]));
  const automationRows = (dashboard.automations || []).map((automation) => `
    <tr>
      <td><strong>${escapeHtml(automation.name)}</strong><small>${escapeHtml(automation.triggerType)}</small></td>
      <td>${escapeHtml(automation.segment)}</td>
      <td><span class="status">${escapeHtml(automation.status)}</span></td>
      <td>${escapeHtml(automation.createdAt || "")}</td>
    </tr>
  `).join("");
  const growthRows = (dashboard.growth || []).slice(0, 8).map((item) => `<tr><td>${escapeHtml(item.date)}</td><td>${Number(item.count || 0).toLocaleString()}</td></tr>`).join("");
  const rows = campaigns.map((campaign) => `
    <tr>
      <td><strong>${escapeHtml(campaign.subject)}</strong><small>${escapeHtml((campaign.template?.preheader || campaign.body || "").slice(0, 120))}</small></td>
      <td>${escapeHtml(campaign.segment)}<small>Variant ${escapeHtml(campaign.abVariant || "A")}</small></td>
      <td><span class="status">${escapeHtml(campaign.status)}</span></td>
      <td>${Number(campaign.sentCount || 0).toLocaleString()} sent / ${Number(campaign.openCount || 0).toLocaleString()} opens / ${Number(campaign.clickCount || 0).toLocaleString()} clicks</td>
      <td>
        <form class="inline-form" method="post" action="/admin/newsletter/campaigns/${campaign.id}/send">
          ${csrfInput(user)}
          <button type="submit" ${campaign.status === "sent" ? "disabled" : ""}>Send</button>
        </form>
      </td>
    </tr>
  `).join("");
  return adminLayout("Newsletter Campaigns", user, `
    <section class="admin-heading"><span>Audience</span><h1>Newsletter campaigns</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Campaigns</span><strong>${Number(campaigns.length).toLocaleString()}</strong></article>
      <article><span>Automations</span><strong>${Number((dashboard.automations || []).length).toLocaleString()}</strong></article>
      <article><span>Email provider</span><strong>${escapeHtml(provider.provider)}</strong></article>
      <article><span>Queued</span><strong>${Number(delivery.counts.queued || 0).toLocaleString()}</strong></article>
      <article><span>Opens</span><strong>${Number(eventCounts.open || 0).toLocaleString()}</strong></article>
      <article><span>Clicks</span><strong>${Number(eventCounts.click || 0).toLocaleString()}</strong></article>
    </section>
    <section class="admin-panel newsletter-admin-command">
      <h2>Newsletter marketing command center</h2>
      <p class="muted">Manage double opt-in, subscriber segments, campaign templates, A/B variants, scheduled campaigns, automations, email outbox delivery, and open/click/unsubscribe analytics.</p>
      <div class="workflow-lane">
        <span>Capture</span>
        <span>Double opt-in</span>
        <span>Segment</span>
        <span>Schedule/send</span>
        <span>Measure</span>
      </div>
      <div class="readiness-list">
        ${Object.entries(dashboard.capabilities || {}).map(([key, ready]) => `<span class="${ready ? "ready" : "pending"}">${escapeHtml(key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase()))}: ${ready ? "ready" : "review"}</span>`).join("")}
      </div>
      <p class="muted">${provider.provider === "dummy" ? "Dummy outbox mode is ready for safe testing. Production sending still needs domain DNS plus sender provider credentials." : provider.ready ? "Production provider settings are present." : "Production sending still needs domain DNS plus sender provider credentials."}</p>
    </section>
    <section class="admin-panel">
      <h2>Create campaign</h2>
      <form class="admin-form flat" method="post" action="/admin/newsletter/campaigns">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Subject<input name="subject" required></label>
          <label>Preheader<input name="preheader" placeholder="Short inbox preview"></label>
          <label>Segment<input name="segment" value="weekly-tech"></label>
          <label>A/B variant<input name="abVariant" value="A"></label>
          <label>CTA label<input name="ctaLabel" value="Read more"></label>
          <label>CTA URL<input name="ctaUrl" value="${escapeHtml(config.siteUrl)}"></label>
          <label>Layout<select name="layout"><option value="editorial_digest">Editorial digest</option><option value="breaking_alert">Breaking alert</option><option value="sponsor_briefing">Sponsor briefing</option></select></label>
          <label>Status<select name="status"><option value="draft">Draft</option><option value="scheduled">Scheduled</option></select></label>
          <label>Scheduled date<input type="datetime-local" name="scheduledAt"></label>
          <label>Body<textarea name="body" required></textarea></label>
        </div>
        <button class="button primary" type="submit">Save campaign</button>
      </form>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Automated workflows</h2><table><thead><tr><th>Automation</th><th>Segment</th><th>Status</th><th>Created</th></tr></thead><tbody>${automationRows || "<tr><td colspan='4'>No automations configured.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>Subscriber growth</h2><table><thead><tr><th>Date</th><th>New subscribers</th></tr></thead><tbody>${growthRows || "<tr><td colspan='2'>No growth records yet.</td></tr>"}</tbody></table></section>
    </section>
    <section class="admin-panel"><h2>Campaign performance</h2><table><thead><tr><th>Campaign</th><th>Segment</th><th>Status</th><th>Analytics</th><th>Action</th></tr></thead><tbody>${rows || "<tr><td colspan='5'>No campaigns yet.</td></tr>"}</tbody></table></section>
  `, "subscribers");
}

function emailOutboxPage(user) {
  const provider = getEmailProviderStatus();
  const summary = getEmailDeliverySummary();
  const rows = getEmailOutbox().map((email) => `
    <tr>
      <td><strong>${escapeHtml(email.subject)}</strong><small>${escapeHtml(email.toEmail)}</small></td>
      <td>${escapeHtml(email.provider)}</td>
      <td><span class="status">${escapeHtml(email.status)}</span><small>${Number(email.attempts || 0).toLocaleString()} attempts</small></td>
      <td>${escapeHtml(email.relatedType || "")}</td>
      <td>${escapeHtml(email.providerMessageId || email.lastError || "")}</td>
      <td>${escapeHtml(email.createdAt)}</td>
    </tr>
  `).join("");
  return adminLayout("Email Outbox", user, `
    <section class="admin-heading"><span>Email delivery</span><h1>Email outbox</h1></section>
    <section class="admin-stats">
      <article><span>Provider</span><strong>${escapeHtml(provider.provider)}</strong></article>
      <article><span>Ready</span><strong>${provider.ready ? "Yes" : "No"}</strong></article>
      <article><span>Queued</span><strong>${Number(summary.counts.queued || 0).toLocaleString()}</strong></article>
      <article><span>Sent</span><strong>${Number(summary.counts.sent || 0).toLocaleString()}</strong></article>
      <article><span>Failed</span><strong>${Number(summary.counts.failed || 0).toLocaleString()}</strong></article>
    </section>
    <section class="admin-panel">
      <h2>Provider status</h2>
      <p>Email provider is <strong>${escapeHtml(provider.provider)}</strong>. Supported modes: ${provider.supported.map(escapeHtml).join(", ")}. ${provider.missing.length ? `Missing: ${provider.missing.map(escapeHtml).join(", ")}.` : "Required provider settings are present."}</p>
      <form class="admin-form compact" method="post" action="/admin/email-outbox/test">
        ${csrfInput(user)}
        <label>Test recipient<input type="email" name="to" value="${escapeHtml(user.email)}" required></label>
        <button class="button primary" type="submit">Queue test email</button>
      </form>
    </section>
    <section class="admin-panel"><table><thead><tr><th>Email</th><th>Provider</th><th>Status</th><th>Related</th><th>Provider result</th><th>Created</th></tr></thead><tbody>${rows || "<tr><td colspan='6'>No emails yet.</td></tr>"}</tbody></table></section>
  `, "outbox");
}

function notificationsPage(user, urlOrMessage = null, message = "") {
  const args = resolveAdminPageArgs(urlOrMessage, message, "/admin/notifications");
  const push = getPushProviderStatus();
  const page = adminListPage(args.url, getNotifications(), "/admin/notifications");
  const rows = page.rows.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.body)}</small></td>
      <td>${escapeHtml(item.type)}</td>
      <td>${escapeHtml(item.target)}${item.targetValue ? `<small>${escapeHtml(item.targetValue)}</small>` : ""}</td>
      <td><span class="status">${escapeHtml(item.status)}</span></td>
      <td>${Number(item.deliveries || 0).toLocaleString()}</td>
      <td>
        <form class="inline-form" method="post" action="/admin/notifications/${item.id}/send">
          ${csrfInput(user)}
          <button type="submit" ${item.status === "sent" ? "disabled" : ""}>Send</button>
        </form>
      </td>
    </tr>
  `).join("");
  return adminLayout("Notifications", user, `
    <section class="admin-heading"><span>Audience alerts</span><h1>Notification center</h1></section>
    ${args.message ? `<div class="alert success">${escapeHtml(args.message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>Provider</span><strong>${escapeHtml(push.provider)}</strong></article>
      <article><span>Project</span><strong>${escapeHtml(push.projectId || "Not set")}</strong></article>
      <article><span>Browser push</span><strong>${push.browserPushReady ? "Ready" : "Missing"}</strong></article>
      <article><span>Server push</span><strong>${push.serverPushReady ? "Ready" : "Waiting"}</strong></article>
    </section>
    <section class="admin-panel">
      <h2>Create notification</h2>
      <form class="admin-form flat" method="post" action="/admin/notifications">
        ${csrfInput(user)}
        <div class="form-grid">
          <label>Title<input name="title" required></label>
          <label>Type<select name="type"><option value="general">General</option><option value="breaking">Breaking news</option><option value="live">Live event</option><option value="membership">Membership</option><option value="category">Category</option></select></label>
          <label>Target<select name="target"><option value="all">All readers</option><option value="member">Members</option><option value="category">Favorite category</option><option value="reader">Specific reader ID</option></select></label>
          <label>Target value<input name="targetValue" placeholder="category slug or reader id"></label>
          <label>Link URL<input name="linkUrl" placeholder="#/article/story-slug"></label>
          <label>Priority<input name="priority" type="number" value="0"></label>
          <label>Status<select name="status"><option value="draft">Draft</option><option value="scheduled">Scheduled</option></select></label>
          <label>Scheduled date<input name="scheduledAt" type="datetime-local"></label>
          <label>Message<textarea name="body" required></textarea></label>
        </div>
        <button class="button primary" type="submit">Save notification</button>
      </form>
    </section>
    <section class="admin-panel">${page.controls}<table><thead><tr><th>Message</th><th>Type</th><th>Target</th><th>Status</th><th>Deliveries</th><th>Action</th></tr></thead><tbody>${rows || "<tr><td colspan='6'>No notifications yet.</td></tr>"}</tbody></table>${page.controls}</section>
  `, "notifications");
}

function securityPage(user, message = "") {
  const security = getUserSecurity(user.id);
  const operations = getSecurityOperations();
  const compliance = getComplianceDashboard();
  const policyRows = operations.policyRows.map((policy) => `
    <tr>
      <td><strong>${escapeHtml(policy.key)}</strong><small>${escapeHtml(policy.updatedAt)}</small></td>
      <td>${policy.enabled ? "<span class='status'>enabled</span>" : "<span class='status'>disabled</span>"}</td>
      <td>
        <form class="admin-form flat" method="post" action="/admin/security/policies">
          ${csrfInput(user)}
          <input type="hidden" name="key" value="${escapeHtml(policy.key)}">
          <label>Value<textarea name="value">${escapeHtml(policy.value)}</textarea></label>
          <label class="check-field"><input type="checkbox" name="enabled" ${policy.enabled ? "checked" : ""}> Enabled</label>
          <button type="submit">Save</button>
        </form>
      </td>
    </tr>
  `).join("");
  const eventRows = operations.recentEvents.map((event) => `
    <tr>
      <td><strong>${escapeHtml(event.eventType)}</strong><small>${escapeHtml(event.details || "")}</small></td>
      <td>${escapeHtml(event.severity)}</td>
      <td>${escapeHtml(event.ipAddress || "unknown")}</td>
      <td>${escapeHtml(event.path || "")}</td>
      <td>${escapeHtml(event.createdAt)}</td>
    </tr>
  `).join("");
  const blockedRows = operations.blockedIps.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.ipAddress)}</strong><small>${escapeHtml(item.reason)}</small></td>
      <td>${escapeHtml(item.expiresAt || "No expiry")}</td>
      <td>
        <form class="inline-form" method="post" action="/admin/security/blocked-ips/${encodeURIComponent(item.ipAddress)}/delete">
          ${csrfInput(user)}
          <button type="submit">Remove</button>
        </form>
      </td>
    </tr>
  `).join("");
  const backupRows = operations.backupRecords.map((backup) => `
    <tr>
      <td><strong>${escapeHtml(backup.status)}</strong><small>${escapeHtml(backup.dbPath)}</small></td>
      <td>${Number(backup.sizeBytes || 0).toLocaleString()} bytes</td>
      <td>${escapeHtml(backup.createdAt)}</td>
    </tr>
  `).join("");
  const consentRows = compliance.privacy.consentEvents.map((row) => `
    <tr>
      <td><strong>${escapeHtml(row.consentType)}</strong><small>${escapeHtml(row.region || "global")}</small></td>
      <td><span class="status">${row.consentValue ? "allowed" : "declined"}</span></td>
      <td>${Number(row.count || 0).toLocaleString()}</td>
    </tr>
  `).join("");
  const readinessPills = operations.securityReadiness.map((item) => `<span class="${item.ready ? "ready" : "pending"}">${escapeHtml(item.label)}</span>`).join("");
  const readinessRows = operations.securityReadiness.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.id)}</small></td>
      <td><span class="status">${item.ready ? "ready" : "attention"}</span></td>
      <td>${escapeHtml(item.detail)}</td>
    </tr>
  `).join("");
  const adminSessionRows = operations.activeAdminSessions.map((session) => `
    <tr>
      <td><strong>${escapeHtml(session.userName)}</strong><small>${escapeHtml(session.email)}</small></td>
      <td>${escapeHtml(session.role)}<small>${escapeHtml(session.tokenPreview)}</small></td>
      <td>${escapeHtml(session.ipAddress || "local")}<small>${escapeHtml(session.userAgent || "Unknown device").slice(0, 120)}</small></td>
      <td>${escapeHtml(session.lastSeenAt || session.createdAt)}</td>
    </tr>
  `).join("");
  const readerSessionRows = operations.activeReaderSessions.map((session) => `
    <tr>
      <td><strong>${escapeHtml(session.readerName)}</strong><small>${escapeHtml(session.email)}</small></td>
      <td>${escapeHtml(session.tokenPreview)}</td>
      <td>${escapeHtml(session.ipAddress || "local")}<small>${escapeHtml(session.userAgent || "Unknown device").slice(0, 120)}</small></td>
      <td>${escapeHtml(session.lastSeenAt || session.createdAt)}</td>
    </tr>
  `).join("");
  const mobileDeviceRows = operations.mobileDevices.map((device) => `
    <tr>
      <td><strong>${escapeHtml(device.platform || "unknown")}</strong><small>${escapeHtml(device.installationId || "")}</small></td>
      <td>${escapeHtml(device.readerName || "Unassigned")}<small>${escapeHtml(device.email || "")}</small></td>
      <td><span class="status">${device.pushEnabled ? "push enabled" : "push off"}</span><small>${escapeHtml(device.appVersion || "")}</small></td>
      <td>${escapeHtml(device.lastSeenAt || "")}</td>
    </tr>
  `).join("");
  return adminLayout("Security", user, `
    <section class="admin-heading"><span>Section 22 security & compliance system</span><h1>Security and compliance command center</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>WAF mode</span><strong>${operations.wafEnabled ? escapeHtml(operations.wafMode) : "off"}</strong></article>
      <article><span>Active admin sessions</span><strong>${Number(operations.sessions).toLocaleString()}</strong></article>
      <article><span>Active reader sessions</span><strong>${Number(operations.readerSessions).toLocaleString()}</strong></article>
      <article><span>Failed logins 24h</span><strong>${Number(operations.failedLogins24h).toLocaleString()}</strong></article>
      <article><span>WAF matches 24h</span><strong>${Number(operations.wafMatches24h).toLocaleString()}</strong></article>
      <article><span>Last backup</span><strong>${operations.lastBackup ? "Ready" : "None"}</strong></article>
    </section>
    <section class="admin-grid two security-command-center">
      <article class="admin-panel">
        <h2>Security workflow</h2>
        <div class="workflow-lane">
          <span>DDoS</span>
          <span>WAF</span>
          <span>CSRF/XSS</span>
          <span>Rate limits</span>
          <span>RBAC</span>
          <span>Consent</span>
          <span>Backups</span>
          <span>Devices</span>
        </div>
        <p>Use this area to verify DDoS application controls, WAF policy, CSRF tokens, XSS protections, rate limiting, login protection, role access, audit logs, content backups, disaster recovery, GDPR workflows, cookie consent, anti-spam scoring, and device/session tracking.</p>
        <div class="readiness-list">${readinessPills}</div>
      </article>
      <article class="admin-panel">
        <h2>Privacy readiness</h2>
        <div class="readiness-list">
          <span class="${compliance.privacy.cookieConsentReady ? "ready" : "pending"}">Cookie consent ready</span>
          <span class="${compliance.privacy.gdprWorkflowReady ? "ready" : "pending"}">GDPR workflow ready</span>
          <span class="${compliance.privacy.dataExportManualReview ? "ready" : "pending"}">Manual export review</span>
          <span class="${operations.wafEnabled ? "ready" : "pending"}">WAF policy ${operations.wafEnabled ? "enabled" : "monitoring"}</span>
          <span class="${operations.twoFactor ? "ready" : "pending"}">2FA coverage</span>
          <span class="ready">Device tracking ready</span>
        </div>
      </article>
    </section>
    <section class="admin-panel">
      <h2>Section 22 readiness matrix</h2>
      <table><thead><tr><th>Control</th><th>Status</th><th>Detail</th></tr></thead><tbody>${readinessRows}</tbody></table>
    </section>
    <section class="admin-panel">
      <h2>Two-factor authentication</h2>
      <p>Status: <strong>${security?.enabled ? "Enabled" : "Disabled"}</strong></p>
      ${security?.secret ? `<p>Setup secret: <code>${escapeHtml(security.secret)}</code></p>` : ""}
      <form class="inline-form" method="post" action="/admin/security/2fa/prepare">${csrfInput(user)}<button type="submit">Create setup secret</button></form>
      <form class="inline-form" method="post" action="/admin/security/2fa/confirm">${csrfInput(user)}<input name="code" inputmode="numeric" placeholder="6 digit code"><button type="submit">Enable 2FA</button></form>
      <form class="inline-form" method="post" action="/admin/security/2fa/disable">${csrfInput(user)}<button type="submit">Disable 2FA</button></form>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel">
        <h2>Block IP address</h2>
        <form class="admin-form flat" method="post" action="/admin/security/blocked-ips">
          ${csrfInput(user)}
          <div class="form-grid">
            <label>IP address<input name="ipAddress" required></label>
            <label>Reason<input name="reason" value="Manual security block"></label>
            <label>Expires at<input type="datetime-local" name="expiresAt"></label>
          </div>
          <button class="button primary" type="submit">Save block</button>
        </form>
      </section>
      <section class="admin-panel">
        <h2>Compliance coverage</h2>
        <p>DDoS application throttling, WAF firewall, CSRF protection, XSS prevention, rate limiting, login protection, role-based security, audit logging, content backups, disaster recovery controls, GDPR compliance, cookie consent, anti-spam AI scoring, and device/session tracking are active in the app layer.</p>
      </section>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Admin sessions and devices</h2><table><thead><tr><th>User</th><th>Role/session</th><th>Device</th><th>Last seen</th></tr></thead><tbody>${adminSessionRows || "<tr><td colspan='4'>No active admin sessions.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>Reader sessions</h2><table><thead><tr><th>Reader</th><th>Session</th><th>Device</th><th>Last seen</th></tr></thead><tbody>${readerSessionRows || "<tr><td colspan='4'>No active reader sessions.</td></tr>"}</tbody></table></section>
    </section>
    <section class="admin-panel"><h2>Mobile device tracking</h2><table><thead><tr><th>Device</th><th>Reader</th><th>Push</th><th>Last seen</th></tr></thead><tbody>${mobileDeviceRows || "<tr><td colspan='4'>No mobile devices registered yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Consent ledger</h2><table><thead><tr><th>Consent</th><th>Choice</th><th>Count</th></tr></thead><tbody>${consentRows || "<tr><td colspan='3'>No consent records yet.</td></tr>"}</tbody></table></section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Blocked IPs</h2><table><thead><tr><th>IP</th><th>Expiry</th><th>Action</th></tr></thead><tbody>${blockedRows || "<tr><td colspan='3'>No active IP blocks.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>Backup versions</h2><table><thead><tr><th>Backup</th><th>Size</th><th>Date</th></tr></thead><tbody>${backupRows || "<tr><td colspan='3'>No backup records yet.</td></tr>"}</tbody></table></section>
    </section>
    <section class="admin-panel"><h2>Security policies</h2><table><thead><tr><th>Policy</th><th>Status</th><th>Config</th></tr></thead><tbody>${policyRows}</tbody></table></section>
    <section class="admin-panel"><h2>Security events</h2><table><thead><tr><th>Event</th><th>Severity</th><th>IP</th><th>Path</th><th>Date</th></tr></thead><tbody>${eventRows || "<tr><td colspan='5'>No security events yet.</td></tr>"}</tbody></table></section>
  `, "security");
}

function operationsPage(user, message = "") {
  const operations = getOperationsDashboard();
  const cache = cacheStats();
  const auditRows = getAuditLogs(14).map((log) => `
    <tr>
      <td><strong>${escapeHtml(log.action)}</strong><small>${escapeHtml(log.userName || "System")}</small></td>
      <td>${escapeHtml(log.targetType || "")}</td>
      <td>${escapeHtml(log.details || log.targetId || "")}</td>
      <td>${escapeHtml(log.createdAt)}</td>
    </tr>
  `).join("");
  const featureRows = operations.features.map((toggle) => `
    <tr>
      <td><strong>${escapeHtml(toggle.label)}</strong><small>${escapeHtml(toggle.description)}</small></td>
      <td><span class="status">${toggle.enabled ? "enabled" : "disabled"}</span><small>${escapeHtml(toggle.updatedAt)}</small></td>
      <td>
        <form class="inline-form" method="post" action="/admin/operations/features">
          ${csrfInput(user)}
          <input type="hidden" name="key" value="${escapeHtml(toggle.key)}">
          <button name="enabled" value="${toggle.enabled ? "disabled" : "enabled"}" type="submit">${toggle.enabled ? "Disable" : "Enable"}</button>
        </form>
      </td>
    </tr>
  `).join("");
  const queueRows = operations.queue.recent.map((job) => `
    <tr>
      <td><strong>${escapeHtml(job.type)}</strong><small>${escapeHtml(job.id)}</small></td>
      <td><span class="status">${escapeHtml(job.status)}</span><small>${Number(job.attempts || 0).toLocaleString()} attempts</small></td>
      <td>${escapeHtml(job.runAt || "")}</td>
      <td>${escapeHtml(job.lastError || job.completedAt || "")}</td>
    </tr>
  `).join("");
  const endpointRows = operations.api.topEndpoints.map((endpoint) => `<tr><td>${escapeHtml(endpoint.path)}</td><td>${Number(endpoint.hits || 0).toLocaleString()}</td></tr>`).join("");
  const apiRecentRows = operations.api.recentUsage.map((event) => `
    <tr>
      <td><strong>${escapeHtml(event.endpoint || event.path || "API")}</strong><small>${escapeHtml(event.method || "GET")}</small></td>
      <td>${escapeHtml(event.consumer || event.keyName || "internal")}</td>
      <td>${Number(event.statusCode || event.status || 200).toLocaleString()}</td>
      <td>${escapeHtml(event.createdAt || "")}</td>
    </tr>
  `).join("");
  const securityRows = operations.security.recentEvents.map((event) => `
    <tr>
      <td><strong>${escapeHtml(event.eventType)}</strong><small>${escapeHtml(event.path || "")}</small></td>
      <td><span class="status">${escapeHtml(event.severity)}</span></td>
      <td>${escapeHtml(event.details || "")}</td>
      <td>${escapeHtml(event.createdAt)}</td>
    </tr>
  `).join("");
  const errorRows = [
    ...operations.errorLogs.map((event) => `
      <tr>
        <td><strong>${escapeHtml(event.eventType)}</strong><small>${escapeHtml(event.path || "")}</small></td>
        <td><span class="status">${escapeHtml(event.severity)}</span></td>
        <td>${escapeHtml(event.details || "")}</td>
        <td>${escapeHtml(event.createdAt || "")}</td>
      </tr>
    `),
    ...operations.failedJobs.map((job) => `
      <tr>
        <td><strong>${escapeHtml(job.type)}</strong><small>${escapeHtml(job.id)}</small></td>
        <td><span class="status">failed</span></td>
        <td>${escapeHtml(job.lastError || "Queue job failed")}</td>
        <td>${escapeHtml(job.completedAt || job.createdAt || "")}</td>
      </tr>
    `)
  ].join("");
  const backupRows = operations.backups.records.map((backup) => `
    <tr>
      <td><strong>${escapeHtml(backup.status)}</strong><small>${escapeHtml(backup.dbPath)}</small></td>
      <td>${Number(backup.sizeBytes || 0).toLocaleString()} bytes</td>
      <td>${escapeHtml(backup.createdAt)}</td>
    </tr>
  `).join("");
  const settingRows = Object.entries(operations.settings).map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(String(value))}</td></tr>`).join("");
  const cacheRows = cache.entries.map((entry) => `<tr><td>${escapeHtml(entry.key)}</td><td>${escapeHtml(entry.expiresAt)}</td></tr>`).join("");
  const serverRows = Object.entries(operations.server).map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(String(value))}</td></tr>`).join("");
  const deploymentRows = Object.entries(operations.deployment).map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(String(value))}</td></tr>`).join("");
  const cdnRows = Object.entries(operations.cdn).map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(String(value || "not connected"))}</td></tr>`).join("");
  const readinessPills = operations.readiness.map((item) => `<span class="${item.ready ? "ready" : "pending"}">${escapeHtml(item.label)}</span>`).join("");
  const readinessRows = operations.readiness.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.id)}</small></td>
      <td><span class="status">${item.ready ? "ready" : "attention"}</span></td>
      <td>${escapeHtml(item.detail)}</td>
    </tr>
  `).join("");
  return adminLayout("Operations", user, `
    <section class="admin-heading"><span>Section 21 administration & operations panel</span><h1>Administration and operations command center</h1></section>
    ${message ? `<div class="alert success">${escapeHtml(message)}</div>` : ""}
    <section class="admin-stats">
      <article><span>API requests 24h</span><strong>${Number(operations.api.requests24h).toLocaleString()}</strong></article>
      <article><span>Queue pending</span><strong>${Number(operations.queue.pending).toLocaleString()}</strong></article>
      <article><span>Queue failed</span><strong>${Number(operations.queue.failed).toLocaleString()}</strong></article>
      <article><span>Uptime</span><strong>${Number(operations.server.uptimeSeconds).toLocaleString()}s</strong></article>
      <article><span>Memory RSS</span><strong>${Number(operations.server.memoryRssMb).toLocaleString()} MB</strong></article>
      <article><span>Cache keys</span><strong>${Number(cache.keys).toLocaleString()}</strong></article>
    </section>
    <section class="admin-grid two operations-command-center">
      <article class="admin-panel">
        <h2>Operations workflow</h2>
        <div class="workflow-lane">
          <span>Global settings</span>
          <span>Feature toggles</span>
          <span>Cache & queue</span>
          <span>Server/API</span>
          <span>Logs & audit</span>
          <span>Backup/CDN</span>
        </div>
        <p>This is the admin-only control room for operational readiness, maintenance mode, deployment preparation, cache clearing, queue monitoring, audit trails, and production support.</p>
        <div class="readiness-list">${readinessPills}</div>
      </article>
      <article class="admin-panel">
        <h2>Maintenance mode</h2>
        <p>Status: <strong>${operations.maintenance?.enabled ? "Enabled" : "Disabled"}</strong>. Use this when the site needs planned downtime messaging before deployment, migrations, or incident response.</p>
        <form class="inline-form" method="post" action="/admin/operations/features">
          ${csrfInput(user)}
          <input type="hidden" name="key" value="maintenance_mode">
          <button class="button primary" name="enabled" value="${operations.maintenance?.enabled ? "disabled" : "enabled"}" type="submit">${operations.maintenance?.enabled ? "Disable maintenance" : "Enable maintenance"}</button>
        </form>
      </article>
    </section>
    <section class="admin-panel">
      <h2>Section 21 readiness matrix</h2>
      <table><thead><tr><th>Control</th><th>Status</th><th>Detail</th></tr></thead><tbody>${readinessRows}</tbody></table>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel">
        <h2>Global runtime settings</h2>
        <table><thead><tr><th>Setting</th><th>Value</th></tr></thead><tbody>${settingRows}</tbody></table>
      </section>
      <section class="admin-panel">
        <h2>Cache management</h2>
        <p>Provider: ${escapeHtml(cache.provider)}. Clearing cache refreshes bootstrap, feeds, and cached public API responses.</p>
        <form class="inline-form" method="post" action="/admin/operations/cache/clear">
          ${csrfInput(user)}
          <label>Prefix<input name="prefix" value="bootstrap"></label>
          <button class="button primary" type="submit">Clear cache</button>
        </form>
        <table><thead><tr><th>Key</th><th>Expires</th></tr></thead><tbody>${cacheRows || "<tr><td colspan='2'>No cache keys currently stored.</td></tr>"}</tbody></table>
      </section>
    </section>
    <section class="admin-panel"><h2>Feature toggles</h2><table><thead><tr><th>Feature</th><th>Status</th><th>Action</th></tr></thead><tbody>${featureRows}</tbody></table></section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Queue monitor</h2><table><thead><tr><th>Job</th><th>Status</th><th>Run at</th><th>Result</th></tr></thead><tbody>${queueRows || "<tr><td colspan='4'>No jobs queued yet.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>API monitor</h2><table><thead><tr><th>Endpoint</th><th>Hits</th></tr></thead><tbody>${endpointRows || "<tr><td colspan='2'>No partner API usage yet.</td></tr>"}</tbody></table></section>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Server monitoring</h2><table><tbody>${serverRows}</tbody></table></section>
      <section class="admin-panel"><h2>API activity log</h2><table><thead><tr><th>Request</th><th>Consumer</th><th>Status</th><th>Date</th></tr></thead><tbody>${apiRecentRows || "<tr><td colspan='4'>No API activity yet.</td></tr>"}</tbody></table></section>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Error logs</h2><table><thead><tr><th>Event</th><th>Severity</th><th>Details</th><th>Date</th></tr></thead><tbody>${errorRows || "<tr><td colspan='4'>No critical operational errors.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>Audit trails</h2><table><thead><tr><th>Action</th><th>Target</th><th>Details</th><th>Date</th></tr></thead><tbody>${auditRows || "<tr><td colspan='4'>No audit actions yet.</td></tr>"}</tbody></table></section>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Backup management</h2><p><a class="button" href="/admin/backup">Open backup manager</a></p><table><thead><tr><th>Backup</th><th>Size</th><th>Date</th></tr></thead><tbody>${backupRows || "<tr><td colspan='3'>No backup records yet.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>Deployment controls</h2><p><a class="button" href="/admin/launch">Open launch readiness</a> <a class="button" href="/admin/database">Open database runtime</a></p><table><tbody>${deploymentRows}</tbody></table></section>
    </section>
    <section class="admin-panel">
      <h2>CDN management</h2>
      <p><a class="button" href="/admin/media">Open media optimization</a> <a class="button" href="/admin/settings">Open global settings</a></p>
      <table><tbody>${cdnRows}</tbody></table>
    </section>
  `, "operations");
}

function futureExpansionPage(user) {
  const future = getFutureExpansionDashboard();
  const moduleCards = future.modules.map((module) => `
    <article class="future-module-card">
      <div>
        <span class="status">${escapeHtml(module.status)}</span>
        <h2>${escapeHtml(module.title)}</h2>
        <p>${escapeHtml(module.description)}</p>
      </div>
      <table><tbody>
        <tr><td>Surface</td><td>${escapeHtml(module.surface)}</td></tr>
        <tr><td>User journey</td><td>${escapeHtml(module.userJourney)}</td></tr>
        <tr><td>Business value</td><td>${escapeHtml(module.businessValue || "")}</td></tr>
        <tr><td>Prototype/API</td><td><code>${escapeHtml(module.prototypeEndpoint || "provider required")}</code></td></tr>
      </tbody></table>
      <div class="readiness-list">${(module.productionNeeds || []).map((need) => `<span class="${module.status === "prototype" ? "ready" : "pending"}">${escapeHtml(need)}</span>`).join("")}</div>
    </article>
  `).join("");
  const readinessRows = future.readinessMatrix.map((item) => `
    <article>
      <span class="${item.ready ? "ready" : "pending"}">${item.ready ? "Ready" : "Provider needed"}</span>
      <strong>${escapeHtml(item.label)}</strong>
      <small>${escapeHtml(item.detail)}</small>
    </article>
  `).join("");
  const strategyRows = future.productStrategy.map((item, index) => `<li><strong>${index + 1}</strong><span>${escapeHtml(item)}</span></li>`).join("");
  const qaRows = future.qaChecklist.map((item) => `<tr><td><span class="status">QA</span></td><td>${escapeHtml(item)}</td></tr>`).join("");
  return adminLayout("Future Ecosystem", user, `
    <section class="admin-heading"><span>Section 25 future expansion ecosystem</span><h1>Future ecosystem command center</h1><p>Plan and validate the next platform surfaces: Smart TV apps, AI news anchors, VR/AR news, blockchain verification, NFT/media collectibles, AI-generated media, smart assistants, and voice-controlled navigation.</p></section>
    <section class="admin-stats">
      <article><span>Future modules</span><strong>${Number(future.roadmap.total).toLocaleString()}</strong></article>
      <article><span>Prototypes</span><strong>${Number(future.roadmap.prototype).toLocaleString()}</strong></article>
      <article><span>Research</span><strong>${Number(future.roadmap.research).toLocaleString()}</strong></article>
      <article><span>Planned</span><strong>${Number(future.roadmap.planned).toLocaleString()}</strong></article>
      <article><span>Parked</span><strong>${Number(future.roadmap.parked).toLocaleString()}</strong></article>
      <article><span>Voice nav</span><strong>${future.readiness.voiceNavigationApiReady ? "Ready" : "No"}</strong></article>
    </section>
    <section class="admin-panel future-command-center">
      <div class="section-kicker">Section 25 workflow</div>
      <h2>Expansion workflow</h2>
      <div class="workflow-lane">
        <span>Smart TV apps</span><span>AI news anchors</span><span>VR/AR news</span><span>Blockchain verification</span><span>NFT/media collectibles</span><span>AI-generated media</span><span>Smart assistants</span><span>Voice navigation</span>
      </div>
      <p>Use this command center to separate production-ready prototypes from provider-dependent concepts before spending on native app stores, AI media vendors, blockchain providers, or headset builds.</p>
    </section>
    <section class="admin-panel">
      <h2>Section 25 readiness matrix</h2>
      <div class="admin-card-grid future-readiness-grid">${readinessRows}</div>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Product strategy</h2><ol class="future-strategy-list">${strategyRows}</ol></section>
      <section class="admin-panel"><h2>Prototype endpoints</h2><table><tbody>
        ${future.modules.map((module) => `<tr><td>${escapeHtml(module.title)}</td><td><code>${escapeHtml(module.prototypeEndpoint || "")}</code></td></tr>`).join("")}
      </tbody></table></section>
    </section>
    <section class="future-module-grid">${moduleCards}</section>
    <section class="admin-panel"><h2>Product owner QA checklist</h2><table><thead><tr><th>Type</th><th>Check</th></tr></thead><tbody>${qaRows}</tbody></table></section>
  `, "future");
}

function infrastructurePage(user) {
  const infrastructure = getEnterpriseInfrastructureDashboard();
  const readinessRows = infrastructure.readinessMatrix.map((item) => `
    <article>
      <span class="${item.ready ? "ready" : "pending"}">${item.ready ? "Ready" : "Needs provider"}</span>
      <strong>${escapeHtml(item.label)}</strong>
      <small>${escapeHtml(item.detail)}</small>
    </article>
  `).join("");
  const boundaryRows = infrastructure.serviceBoundaries.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.service)}</strong><small>${escapeHtml(item.owner)}</small></td>
      <td>${escapeHtml(item.scaling)}</td>
      <td><span class="status">${escapeHtml(item.status)}</span></td>
    </tr>
  `).join("");
  const pathRows = infrastructure.deploymentPath.map((step, index) => `<li><strong>${index + 1}</strong><span>${escapeHtml(step)}</span></li>`).join("");
  const blockerRows = infrastructure.productionBlockers.map((blocker) => `<tr><td><span class="status">setup</span></td><td>${escapeHtml(blocker)}</td></tr>`).join("");
  return adminLayout("Infrastructure", user, `
    <section class="admin-heading"><span>Section 26 enterprise infrastructure & scalability</span><h1>Enterprise scalability command center</h1><p>Track microservices readiness, Docker/Kubernetes path, Redis/PostgreSQL setup, queues, CDN, horizontal scaling, multi-region planning, disaster recovery, monitoring, and deployment controls.</p></section>
    <section class="admin-stats">
      <article><span>Database</span><strong>${escapeHtml(infrastructure.database.client)}</strong></article>
      <article><span>Cache</span><strong>${escapeHtml(infrastructure.cache.provider)}</strong></article>
      <article><span>Queue worker</span><strong>${infrastructure.scaling.queueWorkerReady ? "Ready" : "No"}</strong></article>
      <article><span>CDN</span><strong>${infrastructure.scaling.cdnReady ? "Ready" : "Setup"}</strong></article>
      <article><span>Horizontal scale</span><strong>${infrastructure.scaling.horizontalAppReady ? "Ready" : "Setup"}</strong></article>
      <article><span>HA blockers</span><strong>${infrastructure.productionBlockers.length.toLocaleString()}</strong></article>
    </section>
    <section class="admin-panel infrastructure-command-center">
      <div class="section-kicker">Section 26 workflow</div>
      <h2>Production infrastructure workflow</h2>
      <div class="workflow-lane">
        <span>Microservices</span><span>Docker</span><span>Kubernetes</span><span>PostgreSQL</span><span>Redis</span><span>Queues</span><span>CDN</span><span>Horizontal scaling</span><span>Multi-region</span><span>Disaster recovery</span><span>Monitoring</span><span>Deployment controls</span>
      </div>
      <p>The app can keep running locally for QA, but true production scale needs shared managed services so multiple app and worker instances can coordinate safely.</p>
    </section>
    <section class="admin-panel">
      <h2>Section 26 readiness matrix</h2>
      <div class="admin-card-grid infrastructure-readiness-grid">${readinessRows}</div>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Service boundaries</h2><table><thead><tr><th>Service</th><th>Scaling model</th><th>Status</th></tr></thead><tbody>${boundaryRows}</tbody></table></section>
      <section class="admin-panel"><h2>Production blockers</h2><table><thead><tr><th>Status</th><th>Item</th></tr></thead><tbody>${blockerRows || "<tr><td colspan='2'>No provider blockers detected.</td></tr>"}</tbody></table></section>
    </section>
    <section class="admin-panel"><h2>Deployment path</h2><ol class="infrastructure-path-list">${pathRows}</ol></section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Runtime components</h2><table><tbody>
        <tr><td>Docker Compose</td><td>${infrastructure.containers.dockerCompose ? "Ready" : "Missing"}</td></tr>
        <tr><td>Kubernetes manifests</td><td>${infrastructure.containers.kubernetesManifests ? "Ready" : "Missing"}</td></tr>
        <tr><td>NGINX templates</td><td>${infrastructure.containers.nginxTemplates ? "Ready" : "Missing"}</td></tr>
        <tr><td>Systemd templates</td><td>${infrastructure.containers.systemdTemplates ? "Ready" : "Missing"}</td></tr>
      </tbody></table></section>
      <section class="admin-panel"><h2>Disaster recovery</h2><table><tbody>
        ${Object.entries(infrastructure.disasterRecovery).map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(String(value))}</td></tr>`).join("")}
      </tbody></table></section>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Operational links</h2><p><a class="button" href="/admin/operations">Operations</a> <a class="button" href="/admin/database">Database</a> <a class="button" href="/admin/launch">Launch</a> <a class="button" href="/admin/backup">Backups</a></p></section>
      <section class="admin-panel"><h2>Monitoring snapshot</h2><table><tbody>
        <tr><td>Total API requests</td><td>${Number(infrastructure.monitoring.apiStats.totalRequests || 0).toLocaleString()}</td></tr>
        <tr><td>API requests 24h</td><td>${Number(infrastructure.monitoring.apiStats.requests24h || 0).toLocaleString()}</td></tr>
        <tr><td>Queue stats</td><td>${escapeHtml(JSON.stringify(infrastructure.monitoring.queueStats || {}))}</td></tr>
      </tbody></table></section>
    </section>
  `, "infrastructure");
}

function launchPage(user) {
  const readiness = getLaunchReadiness();
  const checkRows = readiness.checks.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.id)}</small></td>
      <td><span class="status">${escapeHtml(item.status)}</span></td>
      <td>${escapeHtml(item.detail)}</td>
      <td>${escapeHtml(item.action || "")}</td>
    </tr>
  `).join("");
  const dnsRows = readiness.dns.records.map((record) => `
    <tr>
      <td>${escapeHtml(record.type)}</td>
      <td>${escapeHtml(record.host)}</td>
      <td>${escapeHtml(record.value)}</td>
      <td><span class="status">${escapeHtml(record.status)}</span></td>
    </tr>
  `).join("");
  return adminLayout("Launch", user, `
    <section class="admin-heading"><span>Production launch</span><h1>Deployment readiness</h1></section>
    <section class="admin-stats">
      <article><span>Readiness score</span><strong>${Number(readiness.score).toLocaleString()}%</strong></article>
      <article><span>Passing checks</span><strong>${Number(readiness.counts.pass || 0).toLocaleString()}</strong></article>
      <article><span>Warnings</span><strong>${Number(readiness.counts.warn || 0).toLocaleString()}</strong></article>
      <article><span>Blockers</span><strong>${Number(readiness.counts.block || 0).toLocaleString()}</strong></article>
      <article><span>Status</span><strong>${readiness.launchReady ? "Ready" : "Blocked"}</strong></article>
    </section>
    <section class="admin-panel">
      <h2>Launch checks</h2>
      <table><thead><tr><th>Check</th><th>Status</th><th>Current value</th><th>Action</th></tr></thead><tbody>${checkRows}</tbody></table>
    </section>
    <section class="admin-panel">
      <h2>Domain and email DNS</h2>
      <p>Target email domain: <strong>${escapeHtml(readiness.dns.domain)}</strong>. Use the exact SPF and DKIM values from the email provider after the domain/server are connected.</p>
      <table><thead><tr><th>Type</th><th>Host</th><th>Value</th><th>Status</th></tr></thead><tbody>${dnsRows}</tbody></table>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>Server commands</h2><table><tbody>${Object.entries(readiness.commands).map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td><code>${escapeHtml(value)}</code></td></tr>`).join("")}</tbody></table></section>
      <section class="admin-panel"><h2>Next physical setup</h2><p>Docker is still waiting on Windows admin installation. Until then, the local app and worker can continue running normally, and this launch page shows every remaining non-code item before production.</p></section>
    </section>
  `, "launch");
}

function databasePage(user) {
  const status = getDatabaseRuntimeStatus();
  const blockerRows = status.blockers.map((blocker) => `<tr><td><span class="status">blocker</span></td><td>${escapeHtml(blocker)}</td></tr>`).join("");
  const stepRows = status.nextSteps.map((step, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(step)}</td></tr>`).join("");
  const postgresRows = [
    ["Configured", status.postgres.configured ? "yes" : "no"],
    ["URL valid", status.postgres.urlValid ? "yes" : "no"],
    ["Host", status.postgres.host || "Not set"],
    ["Port", String(status.postgres.port)],
    ["Database", status.postgres.database || "Not set"],
    ["Username", status.postgres.username || "Not set"],
    ["SSL", status.postgres.ssl ? "required" : "not required"],
    ["Adapter implemented", status.postgres.adapterImplemented ? "yes" : "no"],
    ["Generated schema", status.postgres.schemaGenerated ? `${Number(status.postgres.schemaSizeBytes).toLocaleString()} bytes` : "missing"]
  ].map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`).join("");
  return adminLayout("Database", user, `
    <section class="admin-heading"><span>Database runtime</span><h1>SQLite to PostgreSQL path</h1></section>
    <section class="admin-stats">
      <article><span>Requested client</span><strong>${escapeHtml(status.requestedClient)}</strong></article>
      <article><span>Active client</span><strong>${escapeHtml(status.activeClient)}</strong></article>
      <article><span>Runtime ready</span><strong>${status.runtimeReady ? "Yes" : "No"}</strong></article>
      <article><span>Switch ready</span><strong>${status.switchoverReady ? "Yes" : "No"}</strong></article>
      <article><span>SQLite size</span><strong>${Number(status.sqlite.sizeBytes || 0).toLocaleString()}</strong></article>
    </section>
    <section class="admin-grid two">
      <section class="admin-panel"><h2>SQLite runtime</h2><table><tbody><tr><td>Path</td><td>${escapeHtml(status.sqlite.path)}</td></tr><tr><td>Exists</td><td>${status.sqlite.exists ? "yes" : "no"}</td></tr></tbody></table></section>
      <section class="admin-panel"><h2>PostgreSQL target</h2><table><tbody>${postgresRows}</tbody></table></section>
    </section>
    <section class="admin-panel"><h2>Switchover blockers</h2><table><thead><tr><th>Status</th><th>Detail</th></tr></thead><tbody>${blockerRows || "<tr><td colspan='2'>No blockers detected.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Migration sequence</h2><table><thead><tr><th>#</th><th>Step</th></tr></thead><tbody>${stepRows}</tbody></table></section>
    <section class="admin-panel"><h2>Commands</h2><table><tbody><tr><td>Schema</td><td><code>npm run db:schema:postgres</code></td></tr><tr><td>Export</td><td><code>npm run db:export:postgres</code></td></tr><tr><td>Readiness</td><td><code>npm run db:postgres:check</code></td></tr></tbody></table></section>
  `, "database");
}

function simpleAdminPage(user, page) {
  const stats = getAdminStats();
  const title = page === "analytics" ? "Analytics" : "Settings";
  if (page === "analytics") {
    const analytics = getAnalyticsSummary();
    const intelligence = getBusinessIntelligenceDashboard();
    const integrations = getAnalyticsIntegrationStatus();
    const topArticleRows = analytics.topArticles.map((article) => `<tr><td><strong>${escapeHtml(article.title)}</strong><small>${escapeHtml(article.slug)}</small></td><td>${Number(article.views).toLocaleString()}</td></tr>`).join("");
    const categoryRows = analytics.topCategories.map((category) => `<tr><td>${escapeHtml(category.name)}</td><td>${Number(category.views).toLocaleString()}</td></tr>`).join("");
    const pathRows = analytics.recentPaths.map((path) => `<tr><td>${escapeHtml(path.path)}</td><td>${Number(path.hits).toLocaleString()}</td></tr>`).join("");
    const engagementRows = analytics.contentEngagement.map((article) => `<tr><td><strong>${escapeHtml(article.title)}</strong><small>${escapeHtml(article.slug)}</small></td><td>${Number(article.trackedReads).toLocaleString()}</td><td>${Number(article.avgDurationSeconds).toLocaleString()}s</td><td>${Number(article.avgScrollDepth).toLocaleString()}%</td></tr>`).join("");
    const authorRows = analytics.authorPerformance.map((author) => `<tr><td><strong>${escapeHtml(author.name)}</strong><small>${escapeHtml(author.role)}</small></td><td>${Number(author.articles).toLocaleString()}</td><td>${Number(author.views).toLocaleString()}</td><td>${Number(author.avgDurationSeconds).toLocaleString()}s</td></tr>`).join("");
    const sourceRows = analytics.trafficSources.map((source) => `<tr><td>${escapeHtml(source.source)}</td><td>${Number(source.visits).toLocaleString()}</td></tr>`).join("");
    const searchRows = analytics.searchAnalytics.topQueries.map((query) => `<tr><td>${escapeHtml(query.query)}</td><td>${Number(query.count).toLocaleString()}</td><td>${Number(query.maxResults || 0).toLocaleString()}</td></tr>`).join("");
    const deviceRows = analytics.deviceAnalytics.map((item) => `<tr><td>${escapeHtml(item.deviceType)}</td><td>${Number(item.events || 0).toLocaleString()}</td><td>${Number(item.avgScrollDepth || 0).toLocaleString()}%</td></tr>`).join("");
    const geoRows = analytics.geoAnalytics.map((item) => `<tr><td>${escapeHtml(item.country)}</td><td>${Number(item.events || 0).toLocaleString()}</td></tr>`).join("");
    const heatmapRows = analytics.heatmap.map((item) => `<tr><td>${escapeHtml(item.zone)}</td><td>${Number(item.events || 0).toLocaleString()}</td><td>${Number(item.avgX || 0)} / ${Number(item.avgY || 0)}</td></tr>`).join("");
    const funnelRows = intelligence.audience.readerFunnel.map((item) => `<tr><td>${escapeHtml(item.stage)}</td><td>${Number(item.value || 0).toLocaleString()}</td></tr>`).join("");
    const predictionRows = intelligence.content.predictions.map((item) => `<tr><td><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.slug)}</small></td><td>${Number(item.predictedEngagement || 0).toLocaleString()}</td><td><span class="status">${escapeHtml(item.recommendation)}</span></td></tr>`).join("");
    const alertRows = intelligence.operationalAlerts.map((item) => `<tr><td><span class="status">${escapeHtml(item.severity)}</span></td><td><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.action)}</small></td></tr>`).join("");
    const readinessRows = Object.entries(intelligence.readiness).map(([key, ready]) => `<article class="${ready ? "ready" : "blocked"}"><strong>${ready ? "Ready" : "Review"}</strong><span>${escapeHtml(key.replace(/([A-Z])/g, " $1").toLowerCase())}</span></article>`).join("");
    const subscriberRows = analytics.subscriberAnalytics.growth.map((item) => `<tr><td>${escapeHtml(item.date)}</td><td>${Number(item.subscribers || 0).toLocaleString()}</td></tr>`).join("");
    const topSearch = analytics.searchAnalytics.topQueries[0];
    const searchDailyRows = analytics.searchAnalytics.daily.map((item) => `<tr><td>${escapeHtml(item.date)}</td><td>${Number(item.searches || 0).toLocaleString()}</td><td>${Number(item.zeroResults || 0).toLocaleString()}</td></tr>`).join("");
    const searchTypeRows = analytics.searchAnalytics.byContentType.map((item) => `<tr><td>${escapeHtml(item.contentType)}</td><td>${Number(item.searches || 0).toLocaleString()}</td></tr>`).join("");
    const miniBarChart = (title, rows, labelKey, valueKey, empty = "No data yet.") => {
      const normalizedRows = rows.slice(0, 8);
      const max = Math.max(1, ...normalizedRows.map((row) => Number(row[valueKey] || 0)));
      return `
        <section class="admin-panel analytics-chart-card">
          <h2>${escapeHtml(title)}</h2>
          <div class="analytics-bars" role="img" aria-label="${escapeHtml(title)} chart">
            ${normalizedRows.map((row) => {
              const value = Number(row[valueKey] || 0);
              const width = Math.max(6, Math.round((value / max) * 100));
              return `
                <div class="analytics-bar-row">
                  <span>${escapeHtml(row[labelKey] || row.title || row.name || row.source || row.query || "Item")}</span>
                  <div><i style="width:${width}%"></i></div>
                  <strong>${value.toLocaleString()}</strong>
                </div>
              `;
            }).join("") || `<p class="muted">${escapeHtml(empty)}</p>`}
          </div>
        </section>
      `;
    };
    const verticalChart = (title, rows, valueKey, labelKey = "date", empty = "No data yet.") => {
      const normalizedRows = rows.slice(-10);
      const max = Math.max(1, ...normalizedRows.map((row) => Number(row[valueKey] || 0)));
      return `
        <section class="admin-panel analytics-chart-card analytics-chart-feature">
          <h2>${escapeHtml(title)}</h2>
          <div class="analytics-columns" role="img" aria-label="${escapeHtml(title)} chart">
            ${normalizedRows.map((row) => {
              const value = Number(row[valueKey] || 0);
              const height = Math.max(8, Math.round((value / max) * 100));
              return `
                <article>
                  <div><i style="height:${height}%"></i></div>
                  <strong>${value.toLocaleString()}</strong>
                  <span>${escapeHtml(String(row[labelKey] || "").replace(new Date().getFullYear().toString(), "").replace(/^-/, ""))}</span>
                </article>
              `;
            }).join("") || `<p class="muted">${escapeHtml(empty)}</p>`}
          </div>
        </section>
      `;
    };
    const integrationRows = [
      ["Google Analytics", integrations.googleAnalytics.enabled ? integrations.googleAnalytics.id : "Not configured", integrations.googleAnalytics.enabled ? "enabled" : "pending"],
      ["Google Tag Manager", integrations.googleTagManager.enabled ? integrations.googleTagManager.id : "Not configured", integrations.googleTagManager.enabled ? "enabled" : "pending"],
      ["Search Console", integrations.searchConsole.enabled ? "Verification meta enabled" : "Not configured", integrations.searchConsole.enabled ? "enabled" : "pending"],
      ["Matomo", integrations.matomo.enabled ? `${integrations.matomo.url} / Site ${integrations.matomo.siteId}` : "Not configured", integrations.matomo.enabled ? "enabled" : "pending"]
    ].map(([label, detail, status]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(detail)}</td><td><span class="status">${escapeHtml(status)}</span></td></tr>`).join("");
    const money = (cents = 0) => `$${(Number(cents || 0) / 100).toFixed(2)}`;
    return adminLayout("Analytics", user, `
      <section class="admin-heading"><span>Enterprise analytics</span><h1>Newsroom intelligence</h1></section>
      <section class="admin-stats">
        <article><span>Total article views</span><strong>${Number(stats.views).toLocaleString()}</strong></article>
        <article><span>Tracked page views</span><strong>${Number(analytics.pageViews).toLocaleString()}</strong></article>
        <article><span>Tracked article reads</span><strong>${Number(analytics.articleViews).toLocaleString()}</strong></article>
        <article><span>Realtime 15m</span><strong>${Number(analytics.realtime.events15m).toLocaleString()}</strong></article>
        <article><span>Avg time on page</span><strong>${Number(analytics.avgDurationSeconds).toLocaleString()}s</strong></article>
        <article><span>Avg scroll depth</span><strong>${Number(analytics.avgScrollDepth).toLocaleString()}%</strong></article>
        <article><span>MRR estimate</span><strong>${money(analytics.revenue.monthlyRecurring)}</strong></article>
      </section>
      <section class="admin-panel analytics-command-center">
        <div>
          <span>Search analytics</span>
          <h2>Search demand is visible and tracked</h2>
          <p class="muted">Queries, zero-result risk, content-type demand, and daily search volume are shown here before the long report tables.</p>
        </div>
        <div class="analytics-command-metrics">
          <article><span>Total searches</span><strong>${Number(analytics.searchAnalytics.searches || 0).toLocaleString()}</strong></article>
          <article><span>Zero-result searches</span><strong>${Number(analytics.searchAnalytics.zeroResultSearches || 0).toLocaleString()}</strong></article>
          <article><span>Top query</span><strong>${escapeHtml(topSearch?.query || "No searches yet")}</strong></article>
          <article><span>Max results found</span><strong>${Number(topSearch?.maxResults || 0).toLocaleString()}</strong></article>
        </div>
      </section>
      <section class="admin-grid two analytics-chart-grid analytics-priority-charts">
        ${verticalChart("Daily traffic events", analytics.dailyTraffic, "events", "date", "No traffic events yet.")}
        ${verticalChart("Daily search volume", analytics.searchAnalytics.daily, "searches", "date", "No search events yet.")}
        ${miniBarChart("Search analytics by query", analytics.searchAnalytics.topQueries, "query", "count", "No search data yet.")}
        ${miniBarChart("Search analytics by content type", analytics.searchAnalytics.byContentType, "contentType", "searches", "No content-type search data yet.")}
      </section>
      <section class="admin-panel">
        <h2>Business intelligence readiness</h2>
        <div class="readiness-grid">${readinessRows}</div>
      </section>
      <section class="admin-grid two">
        <section class="admin-panel">
          <h2>Reader conversion funnel</h2>
          <table><thead><tr><th>Stage</th><th>Value</th></tr></thead><tbody>${funnelRows}</tbody></table>
          <p class="muted">Subscriber conversion ${Number(intelligence.audience.conversionSignals.subscriberConversionRate || 0)}% / member conversion ${Number(intelligence.audience.conversionSignals.memberConversionRate || 0)}%.</p>
        </section>
        <section class="admin-panel">
          <h2>Predictive content actions</h2>
          <table><thead><tr><th>Article</th><th>Predicted signal</th><th>Action</th></tr></thead><tbody>${predictionRows || "<tr><td colspan='3'>Predictions need engagement events.</td></tr>"}</tbody></table>
        </section>
      </section>
      <section class="admin-grid two analytics-chart-grid">
        ${miniBarChart("Top article traffic", analytics.topArticles, "title", "views", "No article traffic yet.")}
        ${miniBarChart("Category demand", analytics.topCategories, "name", "views", "No category traffic yet.")}
        ${miniBarChart("Traffic sources", analytics.trafficSources, "source", "visits", "No traffic sources yet.")}
        ${miniBarChart("Search demand", analytics.searchAnalytics.topQueries, "query", "count", "No search data yet.")}
      </section>
      <section class="admin-grid two">
        <section class="admin-panel"><h2>Device analytics</h2><table><thead><tr><th>Device</th><th>Events</th><th>Avg scroll</th></tr></thead><tbody>${deviceRows || "<tr><td colspan='3'>No device analytics yet.</td></tr>"}</tbody></table></section>
        <section class="admin-panel"><h2>GEO analytics</h2><table><thead><tr><th>Country</th><th>Events</th></tr></thead><tbody>${geoRows || "<tr><td colspan='2'>No country signal yet.</td></tr>"}</tbody></table></section>
      </section>
      <section class="admin-grid two">
        <section class="admin-panel"><h2>Scroll and click heatmap</h2><table><thead><tr><th>Zone</th><th>Events</th><th>Avg X / Y</th></tr></thead><tbody>${heatmapRows || "<tr><td colspan='3'>No heatmap clicks yet.</td></tr>"}</tbody></table></section>
        <section class="admin-panel"><h2>Subscriber analytics</h2><table><thead><tr><th>Date</th><th>Subscribers</th></tr></thead><tbody>${subscriberRows || "<tr><td colspan='2'>No subscriber growth yet.</td></tr>"}</tbody></table></section>
      </section>
      <section class="admin-panel"><h2>BI alerts</h2><table><thead><tr><th>Severity</th><th>Recommendation</th></tr></thead><tbody>${alertRows || "<tr><td colspan='2'>No BI alerts right now.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>External integrations</h2><table><thead><tr><th>Provider</th><th>Configuration</th><th>Status</th></tr></thead><tbody>${integrationRows}</tbody></table></section>
      <section class="admin-panel"><h2>Content engagement</h2><table><thead><tr><th>Article</th><th>Reads</th><th>Avg time</th><th>Avg scroll</th></tr></thead><tbody>${engagementRows || "<tr><td colspan='4'>No engagement events yet.</td></tr>"}</tbody></table></section>
      <section class="admin-panel"><h2>Journalist analytics</h2><table><thead><tr><th>Author</th><th>Articles</th><th>Views</th><th>Avg time</th></tr></thead><tbody>${authorRows || "<tr><td colspan='4'>No author data yet.</td></tr>"}</tbody></table></section>
      <section class="admin-grid two">
        <section class="admin-panel"><h2>Traffic sources</h2><table><thead><tr><th>Source</th><th>Visits</th></tr></thead><tbody>${sourceRows || "<tr><td colspan='2'>No traffic sources yet.</td></tr>"}</tbody></table></section>
        <section class="admin-panel"><h2>Search intelligence</h2><table><thead><tr><th>Query</th><th>Searches</th><th>Max results</th></tr></thead><tbody>${searchRows || "<tr><td colspan='3'>No search data yet.</td></tr>"}</tbody></table></section>
      </section>
      <section class="admin-grid two">
        <section class="admin-panel"><h2>Daily search analytics</h2><table><thead><tr><th>Date</th><th>Searches</th><th>Zero-result</th></tr></thead><tbody>${searchDailyRows || "<tr><td colspan='3'>No search data yet.</td></tr>"}</tbody></table></section>
        <section class="admin-panel"><h2>Search content demand</h2><table><thead><tr><th>Content type</th><th>Searches</th></tr></thead><tbody>${searchTypeRows || "<tr><td colspan='2'>No search data yet.</td></tr>"}</tbody></table></section>
      </section>
      <section class="admin-grid two">
        <section class="admin-panel"><h2>Top articles</h2><table><thead><tr><th>Article</th><th>Views</th></tr></thead><tbody>${topArticleRows || "<tr><td colspan='2'>No article traffic yet.</td></tr>"}</tbody></table></section>
        <section class="admin-panel"><h2>Top categories</h2><table><thead><tr><th>Category</th><th>Views</th></tr></thead><tbody>${categoryRows || "<tr><td colspan='2'>No category traffic yet.</td></tr>"}</tbody></table></section>
      </section>
      <section class="admin-panel"><h2>Visited paths</h2><table><thead><tr><th>Path</th><th>Hits</th></tr></thead><tbody>${pathRows || "<tr><td colspan='2'>No path events yet.</td></tr>"}</tbody></table></section>
    `, "analytics");
  }
  const jobs = getJobStats().map((job) => `<tr><td>${escapeHtml(job.status)}</td><td>${Number(job.count).toLocaleString()}</td></tr>`).join("");
  return adminLayout(title, user, `
    <section class="admin-heading"><span>${page === "analytics" ? "Reporting" : "System"}</span><h1>${title}</h1></section>
    <section class="admin-stats">
      <article><span>Total views</span><strong>${Number(stats.views).toLocaleString()}</strong></article>
      <article><span>SEO sitemap</span><strong>Live</strong></article>
      <article><span>Database</span><strong>SQLite</strong></article>
      <article><span>Mobile API</span><strong>Ready</strong></article>
    </section>
    <section class="admin-panel"><h2>Queue workers</h2><table><thead><tr><th>Status</th><th>Jobs</th></tr></thead><tbody>${jobs || "<tr><td colspan='2'>No jobs yet.</td></tr>"}</tbody></table></section>
    <section class="admin-panel"><h2>Next integration layer</h2><p>PostgreSQL, Redis, email delivery, payment processing, and Kubernetes are now represented in config, deployment files, and runtime adapters.</p></section>
  `, page);
}

const httpServer = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const securityCheck = inspectSecurityRequest(request, url);
  if (!securityCheck.ok) {
    sendJson(response, { ok: false, message: securityCheck.message }, securityCheck.status || 403);
    return;
  }

  if (isAsset(url.pathname)) {
    serveFile(response, decodeURIComponent(url.pathname));
    return;
  }

  if (url.pathname === "/admin/login" && request.method === "GET") {
    sendHtml(response, adminLoginPage());
    return;
  }

  if (url.pathname === "/admin/forgot" && request.method === "GET") {
    sendHtml(response, forgotPasswordPage());
    return;
  }

  if (url.pathname === "/admin/forgot" && request.method === "POST") {
    const form = await readJson(request);
    const result = createPasswordReset(form.email);
    sendHtml(response, forgotPasswordPage(result.message, result.token));
    return;
  }

  if (url.pathname === "/admin/reset" && request.method === "GET") {
    sendHtml(response, resetPasswordPage(url.searchParams.get("token") || ""));
    return;
  }

  if (url.pathname === "/admin/reset" && request.method === "POST") {
    const form = await readJson(request);
    const result = resetPassword(form.token, form.password);
    if (!result.ok) sendHtml(response, resetPasswordPage(form.token, result.message), 400);
    else sendHtml(response, adminLoginPage(result.message));
    return;
  }

  if (url.pathname === "/admin/login" && request.method === "POST") {
    if (!checkRateLimit(request, "admin-login", 8, 15 * 60 * 1000)) {
      rateLimitResponse(response);
      return;
    }
    const form = await readJson(request);
    const result = authenticateUser(form.email, form.password, form.twoFactorCode, {
      ipAddress: clientIp(request),
      userAgent: request.headers["user-agent"] || ""
    });
    if (!result) {
      recordSecurityEvent({ eventType: "login_failed", ipAddress: clientIp(request), path: url.pathname, userAgent: request.headers["user-agent"] || "", severity: "medium", details: String(form.email || "").slice(0, 120) });
      sendHtml(response, adminLoginPage("Invalid email or password."), 401);
      return;
    }
    if (result.requires2fa) {
      sendHtml(response, adminLoginPage("Enter your 2FA code to continue."), 401);
      return;
    }
    redirect(response, "/admin", { "Set-Cookie": `tm_session=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${config.sessionDays * 24 * 60 * 60}` });
    return;
  }

  if (url.pathname === "/admin/logout") {
    deleteSession(getCookie(request, "tm_session"));
    redirect(response, "/admin/login", { "Set-Cookie": "tm_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax" });
    return;
  }

  if (url.pathname.startsWith("/admin")) {
    const user = adminUser(request);
    if (!user) {
      redirect(response, "/admin/login");
      return;
    }
    const sessionToken = getCookie(request, "tm_session");
    let adminForm = null;
    if (request.method === "POST" && url.pathname !== "/admin/media/upload") {
      adminForm = await readJson(request);
      if (!verifyCsrf(sessionToken, adminForm._csrf)) {
        recordSecurityEvent({ eventType: "csrf_failure", ipAddress: clientIp(request), path: url.pathname, userAgent: request.headers["user-agent"] || "", severity: "high", details: "Admin POST rejected by CSRF protection." });
        sendHtml(response, adminLayout("Forbidden", user, "<section class='admin-heading'><h1>Security check failed</h1></section><section class='admin-panel'><p>Your form expired or was submitted without a valid security token.</p></section>"), 403);
        return;
      }
    }
    if (request.method === "POST") await clearCache("bootstrap");

    if (request.method === "POST" && url.pathname === "/admin/articles/new") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveAdminArticle({ ...adminForm, savedBy: user.id });
      if (!result.ok) sendHtml(response, articleFormPage(user, null, result.message), 400);
      else redirect(response, "/admin/articles");
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/news-imports/run") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = await importTechNews({
        limit: adminForm.limit || config.newsImportTargetCount || 50,
        status: adminForm.status || config.newsImportStatus || "source_policy",
        savedBy: user.id
      });
      sendHtml(response, await newsImportsPage(user, result), result.importedCount || result.publishedCount >= 50 ? 200 : 502);
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/news-imports/sources") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      saveNewsImportSourceControls(adminForm, user.id);
      redirect(response, "/admin/news-imports");
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/media/upload") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const { fields, files } = await readMultipart(request);
      if (!verifyCsrf(sessionToken, fields._csrf)) {
        sendHtml(response, adminLayout("Forbidden", user, "<section class='admin-heading'><h1>Security check failed</h1></section><section class='admin-panel'><p>Your upload form expired or was submitted without a valid security token.</p></section>"), 403);
        return;
      }
      const file = files.media;
      const mediaSettings = getMediaOptimizationDashboard().settings;
      const stored = await storeMediaFile({ file, uploadDir, folder: fields.folder || "Editorial", storageProvider: mediaSettings.storageProvider }).catch((error) => ({
        ok: false,
        message: `Upload failed. ${error.message || "Storage provider rejected the file."}`
      }));
      if (!stored.ok) {
        sendHtml(response, mediaPage(user, stored.message), 400);
        return;
      }
      addMedia({
        title: fields.title || file.filename || "Uploaded media",
        fileUrl: stored.fileUrl,
        fileType: file.type,
        altText: fields.altText || fields.title || "",
        caption: fields.caption || "",
        folder: fields.folder || "Editorial",
        uploadedBy: user.id,
        sizeBytes: stored.sizeBytes,
        storageProvider: stored.storageProvider,
        storageKey: stored.storageKey,
        checksum: stored.checksum,
        scanStatus: stored.scanStatus,
        processingStatus: stored.processingStatus,
        metadata: { ...stored.metadata, uploadedVia: "admin" }
      });
      redirect(response, "/admin/media");
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/media/optimization") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveMediaOptimizationSettings(adminForm, user.id);
      sendHtml(response, mediaPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/media/variants/rebuild") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = rebuildMediaVariants(user.id);
      sendHtml(response, mediaPage(user, result.message));
      return;
    }

    const editMatch = url.pathname.match(/^\/admin\/articles\/([^/]+)\/edit$/);
    if (request.method === "POST" && editMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveAdminArticle({ ...adminForm, id: editMatch[1], savedBy: user.id });
      if (!result.ok) sendHtml(response, articleFormPage(user, getAdminArticle(editMatch[1]), result.message), 400);
      else redirect(response, "/admin/articles");
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/articles/autosave") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveArticleAutosave(adminForm, user.id);
      sendJson(response, result, result.ok ? 200 : 400);
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/articles/autosave/clear") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = clearArticleAutosave(adminForm.id || adminForm.articleId, user.id);
      sendJson(response, result, 200);
      return;
    }

    const duplicateMatch = url.pathname.match(/^\/admin\/articles\/([^/]+)\/duplicate$/);
    if (request.method === "POST" && duplicateMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      duplicateArticle(duplicateMatch[1], user.id);
      redirect(response, "/admin/articles");
      return;
    }

    const deleteMatch = url.pathname.match(/^\/admin\/articles\/([^/]+)\/delete$/);
    if (request.method === "POST" && deleteMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      softDeleteArticle(deleteMatch[1], user.id);
      redirect(response, "/admin/articles");
      return;
    }

    const restoreMatch = url.pathname.match(/^\/admin\/articles\/([^/]+)\/restore$/);
    if (request.method === "POST" && restoreMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      restoreArticle(restoreMatch[1], user.id);
      redirect(response, "/admin/articles");
      return;
    }

    const statusMatch = url.pathname.match(/^\/admin\/articles\/([^/]+)\/status$/);
    if (request.method === "POST" && statusMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      updateArticleStatus(statusMatch[1], adminForm.status, user.id);
      redirect(response, request.headers.referer?.includes("/admin/workflow") ? request.headers.referer : "/admin/workflow");
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/workflow/assignments") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveEditorialAssignment(adminForm, user.id);
      if (result.ok) broadcastWorkflowEvent("workflow.assignment", { id: result.id, articleId: adminForm.articleId, priority: adminForm.priority, status: adminForm.status || "assigned" });
      sendHtml(response, workflowPage(user, "all", result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/workflow/approvals") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = requestArticleApproval(adminForm, user.id);
      if (result.ok) broadcastWorkflowEvent("workflow.approval", { id: result.id, articleId: adminForm.articleId, stage: adminForm.stage, sensitivityLevel: adminForm.sensitivityLevel || "normal" });
      sendHtml(response, workflowPage(user, "all", result.message));
      return;
    }

    const approvalReviewMatch = url.pathname.match(/^\/admin\/workflow\/approvals\/([^/]+)\/review$/);
    if (request.method === "POST" && approvalReviewMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = reviewArticleApproval(approvalReviewMatch[1], adminForm, user.id);
      if (result.ok) broadcastWorkflowEvent("workflow.approval_review", { id: approvalReviewMatch[1], status: adminForm.status });
      sendHtml(response, workflowPage(user, "all", result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/workflow/calendar") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveEditorialCalendarEvent(adminForm, user.id);
      if (result.ok) broadcastWorkflowEvent("workflow.calendar", { id: result.id, title: adminForm.title, startsAt: adminForm.startsAt });
      sendHtml(response, workflowPage(user, "all", result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/workflow/tasks") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveEditorialTask(adminForm, user.id);
      if (result.ok) broadcastWorkflowEvent("workflow.task", { id: result.id, title: adminForm.title, status: adminForm.status || "open" });
      sendHtml(response, workflowPage(user, "all", result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/workflow/shifts") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveNewsroomShift(adminForm, user.id);
      if (result.ok) broadcastWorkflowEvent("workflow.shift", { id: result.id, userId: adminForm.userId, startsAt: adminForm.startsAt, status: adminForm.status || "scheduled" });
      sendHtml(response, workflowPage(user, "all", result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/workflow/messages") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = addNewsroomMessage(adminForm, user.id);
      if (result.ok) broadcastWorkflowEvent("workflow.message", { id: result.id, channel: adminForm.channel || "editorial", message: adminForm.message, userName: user.name });
      sendHtml(response, workflowPage(user, "all", result.message));
      return;
    }

    const homepageMatch = url.pathname.match(/^\/admin\/articles\/([^/]+)\/homepage$/);
    if (request.method === "POST" && homepageMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      updateHomepageFlags(homepageMatch[1], {
        featured: "featured" in adminForm,
        breaking: "breaking" in adminForm,
        trending: "trending" in adminForm
      }, user.id);
      redirect(response, "/admin/homepage");
      return;
    }

    const adMatch = url.pathname.match(/^\/admin\/ads\/([^/]+)$/);
    if (request.method === "POST" && adMatch) {
      if (!can(user, "all")) return forbiddenPage(response, user);
      updateAdPlacement(adMatch[1], { ...adminForm, active: "active" in adminForm }, user.id);
      redirect(response, "/admin/ads");
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/affiliates") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveAffiliateLink({ ...adminForm, active: "active" in adminForm }, user.id);
      sendHtml(response, affiliatesPage(user, result.ok ? "Affiliate saved." : result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/monetization/paywall") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = savePaywallRule({ ...adminForm, active: "active" in adminForm }, user.id);
      sendHtml(response, monetizationPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/monetization/sponsors") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveSponsoredCampaign(adminForm, user.id);
      sendHtml(response, monetizationPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/monetization/video-ads") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveVideoAdSlot(adminForm);
      sendHtml(response, monetizationPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/monetization/revenue") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = recordRevenueEvent(adminForm);
      sendHtml(response, monetizationPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/directory") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveDirectoryItem(adminForm, user.id);
      sendHtml(response, directoryPage(user, result.ok ? "Directory item saved." : result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/events") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveConferenceEvent(adminForm, user.id);
      sendHtml(response, eventsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/events/speakers") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveEventSpeaker(adminForm, user.id);
      sendHtml(response, eventsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/events/agenda") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveEventAgendaItem(adminForm, user.id);
      sendHtml(response, eventsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/jobs/recruiters") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveRecruiter(adminForm, user.id);
      sendHtml(response, jobsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/jobs") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveJobPost(adminForm, user.id);
      sendHtml(response, jobsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/startups") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveStartupProfile(adminForm, user.id);
      sendHtml(response, startupsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/startups/founders") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveStartupFounder(adminForm, user.id);
      sendHtml(response, startupsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/startups/funding") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveStartupFundingRound(adminForm, user.id);
      sendHtml(response, startupsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/devices") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveDevice(adminForm, user.id);
      sendHtml(response, devicesPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/devices/specs") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveDeviceSpec(adminForm, user.id);
      sendHtml(response, devicesPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/devices/benchmarks") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveDeviceBenchmark(adminForm, user.id);
      sendHtml(response, devicesPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/it-rooms") {
      if (!can(user, "comments")) return forbiddenPage(response, user);
      const result = saveItRoom(adminForm, user.id);
      sendHtml(response, itRoomsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/community/polls") {
      if (!can(user, "comments")) return forbiddenPage(response, user);
      const result = saveCommunityPoll(adminForm, user.id);
      sendHtml(response, communityAdminPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/languages/translations") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveArticleTranslation(adminForm, user.id);
      sendHtml(response, languagesPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/api/keys") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = createApiKey(adminForm, user.id);
      sendHtml(response, newsApiPage(user, result));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/api/webhooks") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveApiWebhook(adminForm, user.id);
      sendHtml(response, newsApiPage(user, result));
      return;
    }

    const apiKeyStatusMatch = url.pathname.match(/^\/admin\/api\/keys\/([^/]+)\/status$/);
    if (request.method === "POST" && apiKeyStatusMatch) {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = updateApiKeyStatus(apiKeyStatusMatch[1], adminForm.status, user.id);
      sendHtml(response, newsApiPage(user, result));
      return;
    }

    const commentMatch = url.pathname.match(/^\/admin\/comments\/([^/]+)\/status$/);
    if (request.method === "POST" && commentMatch) {
      if (!can(user, "comments")) return forbiddenPage(response, user);
      setCommentStatus(commentMatch[1], adminForm.status === "approved" ? "approved" : "rejected");
      redirect(response, "/admin/comments");
      return;
    }

    const rollbackMatch = url.pathname.match(/^\/admin\/articles\/([^/]+)\/rollback\/([^/]+)$/);
    if (request.method === "POST" && rollbackMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      rollbackArticleRevision(rollbackMatch[1], rollbackMatch[2], user.id);
      redirect(response, `/admin/articles/${rollbackMatch[1]}/edit`);
      return;
    }

    const articleAiMatch = url.pathname.match(/^\/admin\/articles\/([^/]+)\/ai$/);
    if (request.method === "POST" && articleAiMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const article = getAdminArticle(articleAiMatch[1]);
      if (!article) {
        sendJson(response, { ok: false, message: "Article not found." }, 404);
        return;
      }
      const result = await generateArticleAi(article, getArticles());
      sendJson(response, { ok: true, result });
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/users") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveAdminUser(adminForm, user.id);
      sendHtml(response, usersPage(user, result.ok ? "User saved." : result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/roles") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveAdminRole(adminForm, user.id);
      sendHtml(response, rolesWorkbenchPage(user, "", result.ok ? "Role saved." : result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/categories") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveCategory(adminForm, user.id);
      sendHtml(response, categoriesPage(user, result.ok ? "Category saved." : result.message));
      return;
    }

    const categoryDeleteMatch = url.pathname.match(/^\/admin\/categories\/([^/]+)\/delete$/);
    if (request.method === "POST" && categoryDeleteMatch) {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = deleteCategory(categoryDeleteMatch[1], user.id);
      sendHtml(response, categoriesPage(user, result.ok ? "Category deleted." : result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/tags") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveTag(adminForm, user.id);
      sendHtml(response, tagsPage(user, result.ok ? "Tag saved." : result.message));
      return;
    }

    const tagDeleteMatch = url.pathname.match(/^\/admin\/tags\/([^/]+)\/delete$/);
    if (request.method === "POST" && tagDeleteMatch) {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = deleteTag(tagDeleteMatch[1], user.id);
      sendHtml(response, tagsPage(user, result.ok ? "Tag deleted." : result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/newsletter/campaigns") {
      if (!can(user, "subscribers")) return forbiddenPage(response, user);
      const result = saveNewsletterCampaign(adminForm, user.id);
      sendHtml(response, newsletterCampaignsPage(user, result.ok ? "Campaign saved." : result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/notifications") {
      if (!can(user, "subscribers")) return forbiddenPage(response, user);
      const result = saveNotification(adminForm, user.id);
      sendHtml(response, notificationsPage(user, result.ok ? "Notification saved." : result.message));
      return;
    }

    const notificationSendMatch = url.pathname.match(/^\/admin\/notifications\/([^/]+)\/send$/);
    if (request.method === "POST" && notificationSendMatch) {
      if (!can(user, "subscribers")) return forbiddenPage(response, user);
      const result = sendNotification(notificationSendMatch[1], user.id);
      sendHtml(response, notificationsPage(user, result.message));
      return;
    }

    const campaignSendMatch = url.pathname.match(/^\/admin\/newsletter\/campaigns\/([^/]+)\/send$/);
    if (request.method === "POST" && campaignSendMatch) {
      if (!can(user, "subscribers")) return forbiddenPage(response, user);
      const result = sendNewsletterCampaign(campaignSendMatch[1], user.id);
      sendHtml(response, newsletterCampaignsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/email-outbox/test") {
      if (!can(user, "subscribers")) return forbiddenPage(response, user);
      createOutboxEmail({
        to: adminForm.to || user.email,
        subject: "Tech Magazine email delivery test",
        body: `<p>This is a Tech Magazine delivery test from ${escapeHtml(config.siteUrl)}.</p><p>Provider: ${escapeHtml(config.emailProvider)}</p>`,
        relatedType: "delivery_test",
        relatedId: user.id
      });
      sendHtml(response, emailOutboxPage(user));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/site-cms") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveSiteSettings(adminForm, user.id);
      sendHtml(response, siteCmsPage(user, result.ok ? "Public website CMS saved." : result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/breaking-news") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveBreakingNewsAlert(adminForm, user.id);
      sendHtml(response, breakingNewsPage(user, result.message));
      return;
    }

    const breakingActivateMatch = url.pathname.match(/^\/admin\/breaking-news\/([^/]+)\/activate$/);
    if (request.method === "POST" && breakingActivateMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = activateBreakingNewsAlert(breakingActivateMatch[1], user.id);
      sendHtml(response, breakingNewsPage(user, result.message));
      return;
    }

    const breakingResolveMatch = url.pathname.match(/^\/admin\/breaking-news\/([^/]+)\/resolve$/);
    if (request.method === "POST" && breakingResolveMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = resolveBreakingNewsAlert(breakingResolveMatch[1], user.id);
      sendHtml(response, breakingNewsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/live-blogs") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveLiveEvent({
        ...adminForm,
        notifyUpdates: "notifyUpdates" in adminForm,
        homepageOverride: "homepageOverride" in adminForm,
        allowComments: "allowComments" in adminForm
      }, user.id);
      sendHtml(response, liveBlogsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/live-blogs/updates") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = addLiveUpdate({
        ...adminForm,
        pinned: "pinned" in adminForm,
        notifyPush: "notifyPush" in adminForm
      }, user.id);
      sendHtml(response, liveBlogsPage(user, result.message));
      return;
    }

    const liveStatusMatch = url.pathname.match(/^\/admin\/live-blogs\/([^/]+)\/status$/);
    if (request.method === "POST" && liveStatusMatch) {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = updateLiveEventStatus(liveStatusMatch[1], adminForm.status, user.id);
      sendHtml(response, liveBlogsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/videos/playlists") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveVideoPlaylist(adminForm, user.id);
      sendHtml(response, videoCenterPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/videos/categories") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveVideoCategory(adminForm, user.id);
      sendHtml(response, videoCenterPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/videos") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveVideo({ ...adminForm, featured: "featured" in adminForm }, user.id);
      sendHtml(response, videoCenterPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/podcasts/shows") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = savePodcastShow({ ...adminForm, featured: "featured" in adminForm }, user.id);
      sendHtml(response, podcastCenterPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/podcasts/categories") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = savePodcastCategory({ ...adminForm, featured: "featured" in adminForm }, user.id);
      sendHtml(response, podcastCenterPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/podcasts/episodes") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = savePodcastEpisode({
        ...adminForm,
        featured: "featured" in adminForm,
        premium: "premium" in adminForm,
        aiTranscription: "aiTranscription" in adminForm
      }, user.id);
      sendHtml(response, podcastCenterPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/reviews") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = saveProductReview(adminForm, user.id);
      sendHtml(response, reviewsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/ai-assistant") {
      if (!can(user, "articles")) return forbiddenPage(response, user);
      const result = await generateNewsroomAi(adminForm, {
        articles: getArticles(),
        communityTopics: getCommunityTopics()
      });
      recordAiAssistantRun({
        task: adminForm.task || "newsroom",
        provider: result.provider,
        model: result.model,
        promptExcerpt: `${adminForm.title || ""} ${adminForm.text || ""}`.trim(),
        result
      }, user.id);
      sendHtml(response, aiAssistantPage(user, result, result.message || "AI assistant completed."));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/security/2fa/prepare") {
      const result = prepareTwoFactor(user.id);
      sendHtml(response, securityPage(user, result.ok ? "Setup secret created." : result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/security/policies") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveSecurityPolicy(adminForm, user.id);
      sendHtml(response, securityPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/security/blocked-ips") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = blockIpAddress(adminForm, user.id);
      sendHtml(response, securityPage(user, result.message));
      return;
    }

    const unblockMatch = url.pathname.match(/^\/admin\/security\/blocked-ips\/([^/]+)\/delete$/);
    if (request.method === "POST" && unblockMatch) {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = unblockIpAddress(decodeURIComponent(unblockMatch[1]), user.id);
      sendHtml(response, securityPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/security/2fa/confirm") {
      const result = confirmTwoFactor(user.id, adminForm.code);
      sendHtml(response, securityPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/security/2fa/disable") {
      const result = disableTwoFactor(user.id);
      sendHtml(response, securityPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/operations/features") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const result = saveFeatureToggle(adminForm, user.id);
      sendHtml(response, operationsPage(user, result.message));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/operations/cache/clear") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const prefix = String(adminForm.prefix || "");
      await clearCache(prefix);
      sendHtml(response, operationsPage(user, `Cache cleared${prefix ? ` for ${prefix}` : ""}.`));
      return;
    }

    if (request.method === "POST" && url.pathname === "/admin/backup/create") {
      if (!can(user, "all")) return forbiddenPage(response, user);
      const backup = createBackup(user.id);
      sendHtml(response, backupPage(user, backup));
      return;
    }

    if (url.pathname === "/admin") sendHtml(response, dashboardPage(user));
    else if (url.pathname === "/admin/articles") sendHtml(response, articlesPage(user, url));
    else if (url.pathname === "/admin/news-imports") can(user, "articles") ? sendHtml(response, await newsImportsPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/news-imports/inspection") can(user, "articles") ? sendHtml(response, newsInspectionPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/news-imports/performance") can(user, "articles") ? sendHtml(response, sourcePerformancePage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/workflow") sendHtml(response, workflowPage(user, url, url.searchParams.get("status") || "pending_review"));
    else if (url.pathname === "/admin/homepage") can(user, "homepage") ? sendHtml(response, homepagePage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/breaking-news") can(user, "articles") ? sendHtml(response, breakingNewsPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/live-blogs") can(user, "articles") ? sendHtml(response, liveBlogsPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/videos") can(user, "articles") ? sendHtml(response, videoCenterPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/podcasts") can(user, "articles") ? sendHtml(response, podcastCenterPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/reviews") can(user, "articles") ? sendHtml(response, reviewsPage(user, url)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/devices") can(user, "articles") ? sendHtml(response, devicesPage(user, url)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/ai-assistant") can(user, "articles") ? sendHtml(response, aiAssistantPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/site-cms") can(user, "all") ? sendHtml(response, siteCmsPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/monetization") can(user, "all") ? sendHtml(response, monetizationPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/ads") can(user, "all") ? sendHtml(response, adsPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/affiliates") can(user, "all") ? sendHtml(response, affiliatesPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/memberships") can(user, "all") ? sendHtml(response, membershipsPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/events") can(user, "all") ? sendHtml(response, eventsPage(user, url)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/jobs") can(user, "all") ? sendHtml(response, jobsPage(user, url)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/startups") can(user, "all") ? sendHtml(response, startupsPage(user, url)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/directory") can(user, "all") ? sendHtml(response, directoryPage(user, url)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/it-rooms") can(user, "comments") ? sendHtml(response, itRoomsPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/community") can(user, "comments") ? sendHtml(response, communityAdminPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/articles/new") sendHtml(response, articleFormPage(user));
    else if (editMatch) sendHtml(response, articleFormPage(user, getAdminArticle(editMatch[1])));
    else if (url.pathname === "/admin/media") sendHtml(response, mediaPage(user, url));
    else if (url.pathname === "/admin/comments") sendHtml(response, commentsPage(user, url));
    else if (url.pathname === "/admin/subscribers") sendHtml(response, subscribersPage(user, url));
    else if (url.pathname === "/admin/newsletter/campaigns") can(user, "subscribers") ? sendHtml(response, newsletterCampaignsPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/notifications") can(user, "subscribers") ? sendHtml(response, notificationsPage(user, url)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/email-outbox") can(user, "subscribers") ? sendHtml(response, emailOutboxPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/users") can(user, "all") ? sendHtml(response, usersPage(user, url)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/roles") can(user, "all") ? sendHtml(response, rolesWorkbenchPage(user, url, url.searchParams.get("q") || "")) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/categories") can(user, "all") ? sendHtml(response, categoriesPage(user, url)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/tags") can(user, "all") ? sendHtml(response, tagsPage(user, url)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/audit") can(user, "all") ? sendHtml(response, auditPage(user, url)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/backup") can(user, "all") ? sendHtml(response, backupPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/analytics") sendHtml(response, simpleAdminPage(user, "analytics"));
    else if (url.pathname === "/admin/retention") can(user, "all") ? sendHtml(response, retentionPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/seo") can(user, "articles") ? sendHtml(response, seoPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/languages") can(user, "articles") ? sendHtml(response, languagesPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/api") can(user, "all") ? sendHtml(response, newsApiPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/future") can(user, "all") ? sendHtml(response, futureExpansionPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/infrastructure") can(user, "all") ? sendHtml(response, infrastructurePage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/database") can(user, "all") ? sendHtml(response, databasePage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/launch") can(user, "all") ? sendHtml(response, launchPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/security") can(user, "all") ? sendHtml(response, securityPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/operations") can(user, "all") ? sendHtml(response, operationsPage(user)) : forbiddenPage(response, user);
    else if (url.pathname === "/admin/settings") can(user, "all") ? sendHtml(response, simpleAdminPage(user, "settings")) : forbiddenPage(response, user);
    else sendHtml(response, adminLayout("Not found", user, "<section class='admin-heading'><h1>Admin page not found</h1></section>"), 404);
    return;
  }

  if (url.pathname === "/api/health") {
    sendJson(response, { ok: true, service: "tech-magazine", database: "sqlite" });
    return;
  }

  if (url.pathname === "/api/bootstrap") {
    if (!apiReadAllowed(request, response, "api-bootstrap", 240, 60 * 1000)) return;
    const languageCode = String(url.searchParams.get("lang") || url.searchParams.get("language") || "en").trim().toLowerCase();
    const bootstrap = await cached(`bootstrap:v1:${languageCode || "en"}`, config.cacheTtlSeconds, () => getBootstrap(languageCode));
    const articlePage = paginatedCollection(bootstrap.articles || [], url, { defaultLimit: 100, maxLimit: 100 });
    const eventPage = paginatedCollection(bootstrap.events || [], url, { defaultLimit: 24, maxLimit: 100 });
    const jobPage = paginatedCollection(bootstrap.jobs || [], url, { defaultLimit: 24, maxLimit: 100 });
    const startupPage = paginatedCollection(bootstrap.startups || [], url, { defaultLimit: 24, maxLimit: 100 });
    const devicePage = paginatedCollection(bootstrap.devices || [], url, { defaultLimit: 24, maxLimit: 100 });
    const videoPage = paginatedCollection(bootstrap.videos || [], url, { defaultLimit: 24, maxLimit: 100 });
    const podcastPage = paginatedCollection(bootstrap.podcastEpisodes || [], url, { defaultLimit: 24, maxLimit: 100 });
    const reviewPage = paginatedCollection(bootstrap.reviews || [], url, { defaultLimit: 24, maxLimit: 100 });
    const topicPage = paginatedCollection(bootstrap.communityTopics || [], url, { defaultLimit: 24, maxLimit: 100 });
    const roomPage = paginatedCollection(bootstrap.itRooms || [], url, { defaultLimit: 24, maxLimit: 100 });
    const feedPage = paginatedCollection(bootstrap.feed || [], url, { defaultLimit: 30, maxLimit: 100 });
    sendJson(response, {
      ...bootstrap,
      articles: articlePage.items,
      events: eventPage.items,
      jobs: jobPage.items,
      startups: startupPage.items,
      devices: devicePage.items,
      videos: videoPage.items,
      podcastEpisodes: podcastPage.items,
      reviews: reviewPage.items,
      communityTopics: topicPage.items,
      itRooms: roomPage.items,
      feed: feedPage.items,
      pagination: {
        articles: articlePage.pagination,
        events: eventPage.pagination,
        jobs: jobPage.pagination,
        startups: startupPage.pagination,
        devices: devicePage.pagination,
        videos: videoPage.pagination,
        podcastEpisodes: podcastPage.pagination,
        reviews: reviewPage.pagination,
        communityTopics: topicPage.pagination,
        itRooms: roomPage.pagination,
        feed: feedPage.pagination
      }
    });
    return;
  }

  if (url.pathname === "/api/languages") {
    sendJson(response, { ok: true, languages: getLanguages() });
    return;
  }

  if (url.pathname === "/api/media/optimization") {
    const media = getMediaOptimizationDashboard();
    sendJson(response, { ok: true, media: { settings: media.settings, totals: media.totals, readiness: media.readiness } });
    return;
  }

  if (url.pathname === "/api/v1/openapi.json") {
    sendJson(response, {
      openapi: "3.1.0",
      info: { title: "Tech Magazine News API", version: "1.0.0" },
      security: [{ bearerApiKey: [] }, { headerApiKey: [] }],
      components: {
        securitySchemes: {
          bearerApiKey: { type: "http", scheme: "bearer" },
          headerApiKey: { type: "apiKey", in: "header", name: "x-api-key" }
        }
      },
      paths: {
        "/api/v1/news": { get: { summary: "Syndicated article feed", security: [{ bearerApiKey: [] }] } },
        "/api/v1/articles/{slug}": { get: { summary: "Full article by slug" } },
        "/api/v1/categories": { get: { summary: "Category list" } },
        "/api/v1/media": { get: { summary: "Media optimization config and published media totals" } },
        "/api/v1/breaking": { get: { summary: "Active breaking-news alerts" } },
        "/api/v1/mobile/config": { get: { summary: "Mobile app API contract and capabilities" } },
        "/api/v1/status": { get: { summary: "Developer API and integration status" } },
        "/graphql": { post: { summary: "GraphQL gateway for public content discovery" } }
      }
    });
    return;
  }

  if (url.pathname === "/api/v1/status") {
    const integrations = getIntegrationDashboard();
    sendJson(response, {
      ok: true,
      status: {
        restApiReady: true,
        graphqlReady: true,
        mobileApiReady: integrations.mobileApi.readyForNativeApps,
        syndicationReady: integrations.syndication.partnerAuthRequired,
        openApiUrl: integrations.developerPortal.openApiUrl,
        rssUrl: integrations.feeds.rss,
        authRequiredForPartnerFeeds: true
      }
    });
    return;
  }

  if (url.pathname === "/api/v1/news") {
    const apiKey = partnerApiRequest(request, response, url, "news:read");
    if (!apiKey) return;
    const feedPage = paginatedCollection(getSyndicationFeed({ ...Object.fromEntries(url.searchParams), limit: "100" }), url, { defaultLimit: 20, maxLimit: 100 });
    sendPartnerJson(request, response, url, apiKey, {
      ok: true,
      data: feedPage.items,
      pagination: feedPage.pagination,
      generatedAt: new Date().toISOString()
    });
    return;
  }

  if (url.pathname.startsWith("/api/v1/articles/")) {
    const apiKey = partnerApiRequest(request, response, url, "articles:read");
    if (!apiKey) return;
    const slug = decodeURIComponent(url.pathname.replace("/api/v1/articles/", ""));
    const article = getArticleForReader(slug, "", url.searchParams.get("lang") || "en");
    sendPartnerJson(request, response, url, apiKey, article ? { ok: true, article } : { ok: false, message: "Article not found." }, article ? 200 : 404);
    return;
  }

  if (url.pathname === "/api/v1/categories") {
    const apiKey = partnerApiRequest(request, response, url, "news:read");
    if (!apiKey) return;
    sendPartnerJson(request, response, url, apiKey, { ok: true, categories: getBootstrap().categories, languages: getLanguages() });
    return;
  }

  if (url.pathname === "/api/v1/media") {
    const apiKey = partnerApiRequest(request, response, url, "media:read");
    if (!apiKey) return;
    const media = getMediaOptimizationDashboard();
    sendPartnerJson(request, response, url, apiKey, { ok: true, media: { settings: media.settings, totals: media.totals, readiness: media.readiness } });
    return;
  }

  if (url.pathname === "/api/v1/breaking") {
    const apiKey = partnerApiRequest(request, response, url, "syndication:read");
    if (!apiKey) return;
    sendPartnerJson(request, response, url, apiKey, { ok: true, alerts: getBreakingNewsAlerts({ includeResolved: false }).filter((alert) => alert.status === "active") });
    return;
  }

  if (url.pathname === "/api/v1/mobile/config") {
    const apiKey = partnerApiRequest(request, response, url, "mobile:read");
    if (!apiKey) return;
    sendPartnerJson(request, response, url, apiKey, {
      ok: true,
      mobile: {
        config: getMobileExperienceDashboard(),
        app: getMobileHome("", { platform: url.searchParams.get("platform") || "partner", appVersion: url.searchParams.get("appVersion") || "1.0.0", installationId: url.searchParams.get("installationId") || "partner-api" }).capabilities,
        widgets: getMobileWidgetFeed()
      }
    });
    return;
  }

  if (url.pathname.startsWith("/api/media/variants/")) {
    const mediaId = decodeURIComponent(url.pathname.replace("/api/media/variants/", ""));
    sendJson(response, { ok: true, variants: getMediaVariants(mediaId) });
    return;
  }

  if (url.pathname === "/api/firebase/config") {
    sendJson(response, {
      ok: true,
      config: {
        apiKey: config.firebaseApiKey,
        authDomain: config.firebaseAuthDomain,
        projectId: config.firebaseProjectId,
        storageBucket: config.firebaseStorageBucket,
        messagingSenderId: config.firebaseMessagingSenderId,
        appId: config.firebaseAppId,
        measurementId: config.firebaseMeasurementId
      },
      vapidKey: config.firebaseVapidKey
    });
    return;
  }

  if (url.pathname === "/api/breaking-news") {
    sendJson(response, { ok: true, alerts: getBreakingNewsAlerts({ includeResolved: false }).filter((alert) => alert.status === "active") });
    return;
  }

  if (url.pathname === "/api/ai/status") {
    sendJson(response, {
      ok: true,
      enabled: Boolean(config.openaiApiKey),
      model: config.openaiModel,
      tools: ["summary", "headlines", "seo", "tags", "social", "translation", "trends", "recommendations"]
    });
    return;
  }

  if (url.pathname === "/api/workflow/overview") {
    const user = adminUser(request);
    if (!user || !can(user, "articles")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, {
      ok: true,
      realtime: {
        transport: "websocket",
        endpoint: "/api/workflow/realtime",
        connectedClients: workflowSockets.size,
        redisFanoutReady: redisConfigured,
        redisKey: "tm:realtime:workflow",
        instanceId: realtimeInstanceId,
        lastRedisPollAt: realtimeRedisLastPoll ? new Date(realtimeRedisLastPoll).toISOString() : "",
        productionScaleNote: redisConfigured
          ? "Redis-backed cross-instance fanout is enabled."
          : "Single-instance WebSocket is active; configure REDIS_URL or REDIS_REST_URL before horizontal scaling."
      },
      workflow: getWorkflowOperations(url.searchParams.get("status") || "all")
    });
    return;
  }

  if (url.pathname === "/api/security/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    const security = getSecurityOperations();
    sendJson(response, {
      ok: true,
      security: {
        wafMode: security.wafMode,
        wafEnabled: security.wafEnabled,
        geoEnabled: security.geoEnabled,
        antiSpamMode: security.antiSpamMode,
        blockedIps: security.blockedIps.length,
        sessions: security.sessions,
        readerSessions: security.readerSessions,
        twoFactor: security.twoFactor,
        adminUsers: security.adminUsers,
        failedLogins24h: security.failedLogins24h,
        wafMatches24h: security.wafMatches24h,
        rateLimited24h: security.rateLimited24h,
        csrfFailures24h: security.csrfFailures24h,
        securityReadiness: security.securityReadiness,
        activeAdminSessions: security.activeAdminSessions,
        activeReaderSessions: security.activeReaderSessions,
        mobileDevices: security.mobileDevices,
        recentEvents: security.recentEvents,
        backupRecords: security.backupRecords
      }
    });
    return;
  }

  if (url.pathname === "/api/compliance/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, compliance: getComplianceDashboard() });
    return;
  }

  if (url.pathname === "/api/compliance/consent" && request.method === "POST") {
    const payload = await readJson(request);
    sendJson(response, recordComplianceConsent(payload, readerToken(request), {
      ipAddress: clientIp(request),
      userAgent: request.headers["user-agent"] || "",
      region: request.headers["cf-ipcountry"] || request.headers["x-country-code"] || ""
    }));
    return;
  }

  if (url.pathname === "/api/launch/readiness") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, readiness: getLaunchReadiness() });
    return;
  }

  if (url.pathname === "/api/database/status") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, database: getDatabaseRuntimeStatus() });
    return;
  }

  if (url.pathname === "/api/email/status") {
    const user = adminUser(request);
    if (!user || !can(user, "subscribers")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, provider: getEmailProviderStatus(), delivery: getEmailDeliverySummary() });
    return;
  }

  if (url.pathname === "/api/push/status") {
    const user = adminUser(request);
    if (!user || !can(user, "subscribers")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, provider: getPushProviderStatus() });
    return;
  }

  if (url.pathname === "/api/operations/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, operations: getOperationsDashboard(), cache: cacheStats(), uptimeSeconds: Math.round(process.uptime()) });
    return;
  }

  if (url.pathname === "/api/integrations/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, integrations: getIntegrationDashboard() });
    return;
  }

  if (url.pathname === "/api/globalization/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "articles")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, globalization: getGlobalizationDashboard() });
    return;
  }

  if (url.pathname === "/api/future/summary") {
    sendJson(response, { ok: true, future: getFutureExpansionDashboard() });
    return;
  }

  if (url.pathname.startsWith("/api/future/")) {
    const key = url.pathname.replace("/api/future/", "").replace(/-/g, "_");
    const future = getFutureExpansionDashboard();
    const module = future.modules.find((item) => item.key === key || item.prototypeEndpoint === url.pathname);
    sendJson(response, module
      ? { ok: true, module, prototype: { ready: true, productionRequiresExternalProvider: true } }
      : { ok: false, message: "Future module not found." },
      module ? 200 : 404);
    return;
  }

  if (url.pathname === "/api/infrastructure/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, infrastructure: getEnterpriseInfrastructureDashboard() });
    return;
  }

  if (url.pathname === "/api/platform/sections-16-26") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, sections: getSections16To26Dashboard() });
    return;
  }

  if (url.pathname === "/api/ai/newsroom" && request.method === "POST") {
    const user = adminUser(request);
    if (!user || !can(user, "articles")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    if (!checkRateLimit(request, "ai-newsroom", 30, 10 * 60 * 1000)) {
      rateLimitResponse(response);
      return;
    }
    const payload = await readJson(request);
    const result = await generateNewsroomAi(payload, { articles: getArticles(), communityTopics: getCommunityTopics() });
    recordAiAssistantRun({
      task: payload.task || "newsroom",
      provider: result.provider,
      model: result.model,
      promptExcerpt: `${payload.title || ""} ${payload.text || ""}`.trim(),
      result
    }, user.id);
    sendJson(response, { ok: true, result });
    return;
  }

  const aiArticleAutomationMatch = url.pathname.match(/^\/api\/ai\/automation\/article\/([^/]+)$/);
  if (aiArticleAutomationMatch && request.method === "POST") {
    const user = adminUser(request);
    if (!user || !can(user, "articles")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, runArticleAutomation(decodeURIComponent(aiArticleAutomationMatch[1]), user.id));
    return;
  }

  if (url.pathname === "/api/ai/automation/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "articles")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, automation: getAiAutomationDashboard() });
    return;
  }

  if (url.pathname === "/api/live-events") {
    if (!apiReadAllowed(request, response, "api-live-events")) return;
    sendPaginatedCollection(response, "events", getLiveEvents({ includeDrafts: false }), url, { defaultLimit: 20, maxLimit: 100 });
    return;
  }

  if (url.pathname === "/api/events") {
    if (!apiReadAllowed(request, response, "api-events")) return;
    sendPaginatedCollection(response, "events", getConferenceEvents({ includeDrafts: false, limit: 500 }), url, { defaultLimit: 20, maxLimit: 100 });
    return;
  }

  if (url.pathname === "/api/events/experience") {
    if (!apiReadAllowed(request, response, "api-events-experience")) return;
    sendJson(response, getEventExperience());
    return;
  }

  const eventCalendarMatch = url.pathname.match(/^\/api\/events\/([^/]+)\/calendar$/);
  if (eventCalendarMatch) {
    const slug = decodeURIComponent(eventCalendarMatch[1]);
    const event = getConferenceEvent(slug);
    if (!event) {
      sendJson(response, { ok: false, message: "Event not found." }, 404);
      return;
    }
    const formatDate = (value) => String(value || "").replace(/[-:]/g, "").replace(/\.\d+/, "");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Tech Magazine//Events//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@tech-magazine`,
      `DTSTAMP:${formatDate(new Date().toISOString())}`,
      `DTSTART:${formatDate(event.startsAt)}`,
      event.endsAt ? `DTEND:${formatDate(event.endsAt)}` : "",
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}${event.venue ? ` - ${event.venue}` : ""}`,
      `URL:${config.siteUrl}/#/events/${event.slug}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].filter(Boolean).join("\r\n");
    response.writeHead(200, { "Content-Type": "text/calendar; charset=utf-8", ...securityHeaders });
    response.end(ics);
    return;
  }

  if (request.method === "POST" && url.pathname.match(/^\/api\/events\/([^/]+)\/register$/)) {
    const slug = decodeURIComponent(url.pathname.match(/^\/api\/events\/([^/]+)\/register$/)[1]);
    const result = registerForConferenceEvent(slug, await readJson(request), readerToken(request));
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (url.pathname.startsWith("/api/events/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/events/", ""));
    const event = getConferenceEvent(slug, { includeDrafts: false });
    sendJson(response, event ? { ok: true, event } : { ok: false, message: "Event not found." }, event ? 200 : 404);
    return;
  }

  const liveCommentMatch = url.pathname.match(/^\/api\/live-events\/([^/]+)\/comments$/);
  if (request.method === "POST" && liveCommentMatch) {
    const slug = decodeURIComponent(liveCommentMatch[1]);
    const result = addLiveEventComment(slug, await readJson(request), readerToken(request), request.socket.remoteAddress || "anonymous");
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (url.pathname.startsWith("/api/live-events/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/live-events/", ""));
    const event = getLiveEvent(slug, { includeDrafts: false });
    sendJson(response, event ? { ok: true, event } : { ok: false, message: "Live event not found." }, event ? 200 : 404);
    return;
  }

  if (url.pathname === "/api/jobs") {
    if (!apiReadAllowed(request, response, "api-jobs")) return;
    sendPaginatedCollection(response, "jobs", getJobBoard({ includeDrafts: false, limit: 500 }), url, { defaultLimit: 20, maxLimit: 100 });
    return;
  }

  if (url.pathname === "/api/jobs/experience") {
    if (!apiReadAllowed(request, response, "api-jobs-experience")) return;
    sendJson(response, { ok: true, experience: getJobBoardExperience() });
    return;
  }

  if (url.pathname === "/api/jobs/alerts" && request.method === "POST") {
    const payload = await readJson(request);
    sendJson(response, saveJobAlert(payload, readerToken(request)));
    return;
  }

  const jobApplyMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/apply$/);
  if (request.method === "POST" && jobApplyMatch) {
    const slug = decodeURIComponent(jobApplyMatch[1]);
    let payload;
    if (String(request.headers["content-type"] || "").includes("multipart/form-data")) {
      const { fields, files } = await readMultipart(request);
      payload = { ...fields };
      if (files.resume?.content?.length) {
        const stored = await storeResumeUpload(files.resume);
        if (!stored.ok) {
          sendJson(response, stored, 400);
          return;
        }
        payload.resumeFileUrl = stored.url;
      }
    } else {
      payload = await readJson(request);
    }
    const result = applyForJob(slug, payload, readerToken(request));
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (url.pathname.startsWith("/api/jobs/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/jobs/", ""));
    const job = getJobPost(slug, { includeDrafts: false });
    sendJson(response, job ? { ok: true, job } : { ok: false, message: "Job not found." }, job ? 200 : 404);
    return;
  }

  if (url.pathname === "/api/startups") {
    if (!apiReadAllowed(request, response, "api-startups")) return;
    sendPaginatedCollection(response, "startups", getStartups({ includeDrafts: false, limit: 500 }), url, { defaultLimit: 20, maxLimit: 100 });
    return;
  }

  if (url.pathname.startsWith("/api/startups/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/startups/", ""));
    const startup = getStartup(slug, { includeDrafts: false });
    sendJson(response, startup ? { ok: true, startup } : { ok: false, message: "Startup not found." }, startup ? 200 : 404);
    return;
  }

  if (url.pathname === "/api/devices") {
    if (!apiReadAllowed(request, response, "api-devices")) return;
    sendPaginatedCollection(response, "devices", getDevices({ includeDrafts: false, limit: 500, type: url.searchParams.get("type") || "" }), url, { defaultLimit: 20, maxLimit: 100 });
    return;
  }

  if (url.pathname === "/api/devices/experience") {
    if (!apiReadAllowed(request, response, "api-devices-experience")) return;
    sendJson(response, getDeviceDatabaseExperience());
    return;
  }

  if (url.pathname === "/api/devices/compare") {
    const slugs = String(url.searchParams.get("slugs") || "")
      .split(",")
      .map((slug) => slug.trim())
      .filter(Boolean);
    const comparison = compareDevices(slugs);
    sendJson(response, comparison.devices.length ? { ok: true, comparison } : { ok: false, message: "Choose devices to compare." }, comparison.devices.length ? 200 : 400);
    return;
  }

  if (url.pathname === "/api/tech-database/summary") {
    sendJson(response, { ok: true, database: getTechDatabaseDashboard() });
    return;
  }

  if (url.pathname.startsWith("/api/devices/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/devices/", ""));
    const device = getDevice(slug, { includeDrafts: false });
    sendJson(response, device ? { ok: true, device } : { ok: false, message: "Device not found." }, device ? 200 : 404);
    return;
  }

  if (url.pathname === "/api/videos") {
    if (!apiReadAllowed(request, response, "api-videos")) return;
    const videoPage = paginatedCollection(getVideos({ includeDrafts: false, limit: 500 }), url, { defaultLimit: 20, maxLimit: 100 });
    sendJson(response, {
      ok: true,
      videos: videoPage.items,
      playlists: getVideoPlaylists({ includeDrafts: false }),
      categories: getVideoCategories(),
      platform: getVideoPlatformDashboard(),
      pagination: videoPage.pagination
    });
    return;
  }

  if (url.pathname === "/api/videos/platform") {
    sendJson(response, { ok: true, platform: getVideoPlatformDashboard() });
    return;
  }

  if (url.pathname === "/api/videos/events" && request.method === "POST") {
    const result = recordVideoEvent({ ...(await readJson(request)), viewerKey: readerToken(request) || request.socket.remoteAddress || "anonymous" });
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (request.method === "POST" && url.pathname.startsWith("/api/videos/bookmark/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/videos/bookmark/", ""));
    const result = toggleVideoBookmark(readerToken(request), slug, request.socket.remoteAddress || "anonymous");
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (url.pathname.startsWith("/api/videos/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/videos/", ""));
    const video = getVideo(slug, { includeDrafts: false });
    sendJson(response, video ? { ok: true, video } : { ok: false, message: "Video not found." }, video ? 200 : 404);
    return;
  }

  if (url.pathname === "/api/mobile/config") {
    sendJson(response, {
      ok: true,
      app: {
        name: "Tech Magazine",
        scheme: "techmagazine",
        apiBaseUrl: config.siteUrl,
        pushProvider: "firebase",
        offlineMaxAgeDays: 30,
        deepLinks: ["techmagazine://article/:slug", "techmagazine://video/:slug", "techmagazine://podcast/:slug", "techmagazine://live/:slug"]
      },
      firebase: {
        projectId: config.firebaseProjectId,
        vapidKey: config.firebaseVapidKey,
        messagingSenderId: config.firebaseMessagingSenderId
      }
    });
    return;
  }

  if (url.pathname === "/api/mobile/experience") {
    sendJson(response, getMobileExperienceDashboard(readerToken(request), {
      platform: url.searchParams.get("platform") || request.headers["x-mobile-platform"] || "web-preview",
      appVersion: url.searchParams.get("appVersion") || request.headers["x-app-version"] || "0.1.0",
      installationId: url.searchParams.get("installationId") || request.headers["x-installation-id"] || "web-preview"
    }));
    return;
  }

  if (url.pathname === "/api/mobile/home") {
    sendJson(response, getMobileHome(readerToken(request), {
      platform: url.searchParams.get("platform") || request.headers["x-mobile-platform"] || "unknown",
      appVersion: url.searchParams.get("appVersion") || request.headers["x-app-version"] || "",
      installationId: url.searchParams.get("installationId") || request.headers["x-installation-id"] || ""
    }));
    return;
  }

  if (url.pathname === "/api/mobile/offline" && request.method === "GET") {
    const result = getMobileOfflineLibrary(readerToken(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/mobile/offline" && request.method === "POST") {
    const payload = await readJson(request);
    const result = payload.action === "remove" ? removeMobileOfflineItem(readerToken(request), payload) : saveMobileOfflineItem(readerToken(request), payload);
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (url.pathname === "/api/mobile/device" && request.method === "POST") {
    const result = registerMobileDevice(readerToken(request), await readJson(request));
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (url.pathname === "/api/mobile/analytics" && request.method === "POST") {
    const result = recordMobileAppEvent(readerToken(request), await readJson(request));
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (url.pathname === "/api/mobile/widgets") {
    sendJson(response, getMobileWidgetFeed({ limit: url.searchParams.get("limit") || 6 }));
    return;
  }

  if (url.pathname === "/api/mobile/deep-link") {
    sendJson(response, resolveMobileDeepLink(url.searchParams.get("url") || url.searchParams.get("link") || ""));
    return;
  }

  if (url.pathname === "/api/podcasts") {
    if (!apiReadAllowed(request, response, "api-podcasts")) return;
    const showPage = paginatedCollection(getPodcastShows({ includeDrafts: false }), url, { defaultLimit: 20, maxLimit: 100 });
    const episodePage = paginatedCollection(getPodcastEpisodes({ includeDrafts: false, limit: 500 }), url, { defaultLimit: 20, maxLimit: 100 });
    sendJson(response, {
      ok: true,
      shows: showPage.items,
      episodes: episodePage.items,
      categories: getPodcastCategories(),
      platform: getPodcastPlatformDashboard(),
      pagination: { shows: showPage.pagination, episodes: episodePage.pagination }
    });
    return;
  }

  if (url.pathname === "/api/podcasts/platform") {
    sendJson(response, { ok: true, platform: getPodcastPlatformDashboard() });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/podcasts/events") {
    const payload = await readJson(request);
    const result = recordPodcastEvent({
      ...payload,
      listenerKey: payload.listenerKey || request.socket.remoteAddress || "anonymous",
      deviceType: payload.deviceType || request.headers["user-agent"] || "",
      source: payload.source || "web-player"
    });
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (request.method === "POST" && url.pathname.startsWith("/api/podcasts/bookmark/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/podcasts/bookmark/", ""));
    const payload = await readJson(request);
    const result = togglePodcastBookmark(readerToken(request), slug, payload.listenerKey || request.socket.remoteAddress || "anonymous", payload.progressSeconds || 0);
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (url.pathname.startsWith("/api/podcasts/shows/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/podcasts/shows/", ""));
    const show = getPodcastShow(slug, { includeDrafts: false });
    sendJson(response, show ? { ok: true, show } : { ok: false, message: "Podcast show not found." }, show ? 200 : 404);
    return;
  }

  if (url.pathname.startsWith("/api/podcasts/episodes/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/podcasts/episodes/", ""));
    const episode = getPodcastEpisode(slug, { includeDrafts: false });
    sendJson(response, episode ? { ok: true, episode } : { ok: false, message: "Podcast episode not found." }, episode ? 200 : 404);
    return;
  }

  if (url.pathname === "/api/reviews") {
    if (!apiReadAllowed(request, response, "api-reviews")) return;
    sendPaginatedCollection(response, "reviews", getProductReviews({ includeDrafts: false, limit: 500 }), url, { defaultLimit: 20, maxLimit: 100 });
    return;
  }

  if (url.pathname === "/api/reviews/experience") {
    sendJson(response, getProductReviewExperience());
    return;
  }

  if (url.pathname === "/api/reviews/dashboard") {
    const user = adminUser(request);
    if (!user || !can(user, "articles")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, dashboard: getProductReviewDashboard() });
    return;
  }

  if (url.pathname === "/api/reviews/compare") {
    const slugs = (url.searchParams.get("slugs") || "").split(",").map((slug) => slug.trim()).filter(Boolean);
    const comparison = compareProductReviews(slugs);
    sendJson(response, comparison.reviews.length ? { ok: true, comparison } : { ok: false, message: "Choose reviews to compare." }, comparison.reviews.length ? 200 : 400);
    return;
  }

  if (url.pathname.startsWith("/api/reviews/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/reviews/", ""));
    const review = getProductReview(slug, { includeDrafts: false });
    sendJson(response, review ? { ok: true, review } : { ok: false, message: "Review not found." }, review ? 200 : 404);
    return;
  }

  if (url.pathname === "/podcasts/rss.xml") {
    const shows = getPodcastShows({ includeDrafts: false });
    const episodes = getPodcastEpisodes({ includeDrafts: false, limit: 100 });
    const channelDescription = "Technology podcasts, interviews, briefings, and narrated analysis from Tech Magazine.";
    const items = episodes.map((episode) => `
      <item>
        <title>${escapeXml(episode.title)}</title>
        <description>${escapeXml(episode.description)}</description>
        <link>${escapeXml(`${config.siteUrl}/#/podcast-episode/${episode.slug}`)}</link>
        <guid isPermaLink="false">${escapeXml(episode.id)}</guid>
        <pubDate>${new Date(episode.publishedAt || episode.createdAt).toUTCString()}</pubDate>
        <enclosure url="${escapeXml(new URL(episode.audioUrl, config.siteUrl).toString())}" type="audio/mpeg" length="0" />
        <itunes:duration>${Number(episode.durationSeconds || 0)}</itunes:duration>
        <itunes:author>${escapeXml(episode.host || "Tech Magazine")}</itunes:author>
      </item>
    `).join("");
    response.writeHead(200, { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "no-store", ...securityHeaders });
    response.end(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Tech Magazine Podcasts</title>
    <description>${escapeXml(channelDescription)}</description>
    <link>${escapeXml(`${config.siteUrl}/#/podcasts`)}</link>
    <language>${escapeXml(shows[0]?.language || "en")}</language>
    <itunes:author>Tech Magazine</itunes:author>
    ${shows[0]?.coverImage ? `<itunes:image href="${escapeXml(new URL(shows[0].coverImage, config.siteUrl).toString())}" />` : ""}
    ${items}
  </channel>
</rss>`);
    return;
  }

  if (request.method === "POST" && url.pathname === "/graphql") {
    if (!apiReadAllowed(request, response, "api-graphql", 180, 60 * 1000)) return;
    const payload = await readJson(request);
    const query = String(payload.query || "");
    const variables = payload.variables || {};
    const graphUrl = new URL(url.toString());
    graphUrl.searchParams.set("page", String(variables.page || 1));
    graphUrl.searchParams.set("limit", String(variables.limit || 20));
    const data = {};
    const pagination = {};
    if (query.includes("articles")) {
      const page = paginatedCollection(searchArticles(variables), graphUrl, { defaultLimit: 20, maxLimit: 100 });
      data.articles = page.items;
      pagination.articles = page.pagination;
    }
    if (query.includes("article")) data.article = variables.slug ? getArticleForReader(variables.slug, readerToken(request), variables.language || variables.lang || "en") : null;
    if (query.includes("categories")) data.categories = getBootstrap().categories;
    if (query.includes("authors")) data.authors = getBootstrap().authors;
    if (query.includes("liveEvents")) {
      const page = paginatedCollection(getLiveEvents({ includeDrafts: false }), graphUrl);
      data.liveEvents = page.items;
      pagination.liveEvents = page.pagination;
    }
    if (query.includes("events")) {
      const page = paginatedCollection(getConferenceEvents({ includeDrafts: false, limit: 500 }), graphUrl);
      data.events = page.items;
      pagination.events = page.pagination;
    }
    if (query.includes("videos")) {
      const page = paginatedCollection(getVideos({ includeDrafts: false, limit: 500 }), graphUrl);
      data.videos = page.items;
      pagination.videos = page.pagination;
    }
    if (query.includes("podcastShows")) {
      const page = paginatedCollection(getPodcastShows({ includeDrafts: false }), graphUrl);
      data.podcastShows = page.items;
      pagination.podcastShows = page.pagination;
    }
    if (query.includes("podcastEpisodes")) {
      const page = paginatedCollection(getPodcastEpisodes({ includeDrafts: false, limit: 500 }), graphUrl);
      data.podcastEpisodes = page.items;
      pagination.podcastEpisodes = page.pagination;
    }
    if (query.includes("reviews")) {
      const page = paginatedCollection(getProductReviews({ includeDrafts: false, limit: 500 }), graphUrl);
      data.reviews = page.items;
      pagination.reviews = page.pagination;
    }
    if (query.includes("review")) data.review = variables.slug ? getProductReview(variables.slug, { includeDrafts: false }) : null;
    if (query.includes("communityTopics")) {
      const page = paginatedCollection(getCommunityTopics(), graphUrl);
      data.communityTopics = page.items;
      pagination.communityTopics = page.pagination;
    }
    if (query.includes("communityPolls")) {
      const page = paginatedCollection(getCommunityPolls(), graphUrl);
      data.communityPolls = page.items;
      pagination.communityPolls = page.pagination;
    }
    sendJson(response, { data, pagination });
    return;
  }

  if (url.pathname === "/api/search/suggestions") {
    if (!apiReadAllowed(request, response, "api-search", 180, 60 * 1000)) return;
    sendJson(response, { ok: true, suggestions: getSearchSuggestions({ q: url.searchParams.get("q") || url.searchParams.get("query") || "" }) });
    return;
  }

  if (url.pathname === "/api/search/discovery") {
    if (!apiReadAllowed(request, response, "api-search", 180, 60 * 1000)) return;
    const result = searchDiscovery({ ...Object.fromEntries(url.searchParams), limit: "100" });
    const page = paginatedCollection(result.results || [], url, { defaultLimit: 20, maxLimit: 100 });
    sendJson(response, { ...result, results: page.items, pagination: page.pagination });
    return;
  }

  if (url.pathname === "/api/search/status") {
    sendJson(response, { ok: true, search: getSearchDiscoveryDashboard() });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/search/voice") {
    sendJson(response, interpretVoiceSearch(await readJson(request)));
    return;
  }

  if (url.pathname === "/api/search/saved-filters" && request.method === "GET") {
    const result = getSavedSearchFilters(readerToken(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/search/saved-filters" && request.method === "POST") {
    const result = saveSearchFilter(readerToken(request), await readJson(request));
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  const savedSearchDelete = url.pathname.match(/^\/api\/search\/saved-filters\/([^/]+)$/);
  if (request.method === "DELETE" && savedSearchDelete) {
    const result = deleteSearchFilter(readerToken(request), decodeURIComponent(savedSearchDelete[1]));
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/search/rebuild") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, rebuildSearchIndex(user.id));
    return;
  }

  if (url.pathname === "/api/search/trending") {
    if (!apiReadAllowed(request, response, "api-search", 180, 60 * 1000)) return;
    sendPaginatedCollection(response, "trending", getTrendingSearches(), url, { defaultLimit: 20, maxLimit: 100 });
    return;
  }

  if (url.pathname === "/api/search") {
    if (!apiReadAllowed(request, response, "api-search", 180, 60 * 1000)) return;
    const result = advancedSearchArticles({ ...Object.fromEntries(url.searchParams), limit: "100" });
    const articlePage = paginatedCollection(result.articles || [], url, { defaultLimit: 20, maxLimit: 100 });
    const resultPage = paginatedCollection(result.results || [], url, { defaultLimit: 20, maxLimit: 100 });
    sendJson(response, { ok: true, ...result, articles: articlePage.items, results: resultPage.items, pagination: { articles: articlePage.pagination, results: resultPage.pagination } });
    return;
  }

  if (url.pathname.startsWith("/api/articles/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/articles/", ""));
    const article = getArticleForReader(slug, readerToken(request), url.searchParams.get("lang") || url.searchParams.get("language") || "en");
    sendJson(response, article ? { ok: true, article } : { ok: false, message: "Article not found." }, article ? 200 : 404);
    return;
  }

  if (request.method === "POST" && url.pathname.startsWith("/api/ai/articles/")) {
    if (!checkRateLimit(request, "public-ai", 20, 10 * 60 * 1000)) {
      rateLimitResponse(response);
      return;
    }
    const slug = decodeURIComponent(url.pathname.replace("/api/ai/articles/", ""));
    const article = getArticle(slug);
    if (!article) {
      sendJson(response, { ok: false, message: "Article not found." }, 404);
      return;
    }
    const result = await generateArticleAi(article, getArticles());
    sendJson(response, {
      ok: true,
      summary: result.summary,
      recommendations: result.recommendations,
      provider: result.provider,
      model: result.model,
      message: result.message || ""
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/track") {
    if (!checkRateLimit(request, "analytics", 120, 10 * 60 * 1000)) {
      sendJson(response, { ok: true, dropped: true, message: "Analytics event sampled." }, 202);
      return;
    }
    try {
      const payload = await readJson(request);
      recordAnalyticsEvent({
        ...payload,
        referrer: payload.referrer || request.headers.referer || "",
        userAgent: request.headers["user-agent"] || "",
        country: payload.country || request.headers["cf-ipcountry"] || request.headers["x-vercel-ip-country"] || "",
        readerToken: readerToken(request)
      });
      sendJson(response, { ok: true });
    } catch {
      sendJson(response, { ok: false, message: "Analytics event failed." }, 400);
    }
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/ads/impression") {
    if (!checkRateLimit(request, "ad-impression", 240, 10 * 60 * 1000)) {
      sendJson(response, { ok: true, dropped: true, message: "Ad impression sampled." }, 202);
      return;
    }
    const payload = await readJson(request);
    const result = recordAdImpression({
      placement: payload.placement,
      path: payload.path,
      referrer: payload.referrer || request.headers.referer || "",
      userAgent: request.headers["user-agent"] || ""
    });
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  if (url.pathname === "/api/monetization/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, summary: getRevenueSummary(), paywallRules: getPaywallRules(), campaigns: getSponsoredCampaigns() });
    return;
  }

  if (url.pathname === "/api/monetization/operations") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, monetization: getMonetizationOperationsDashboard() });
    return;
  }

  if (url.pathname === "/api/commercial/experience") {
    sendJson(response, getCommercialExperience(readerToken(request)));
    return;
  }

  if (url.pathname === "/api/trust/experience") {
    sendJson(response, getTrustComplianceExperience(readerToken(request)));
    return;
  }

  if (url.pathname === "/api/analytics/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, analytics: getAnalyticsSummary() });
    return;
  }

  if (url.pathname === "/api/analytics/business-intelligence") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, intelligence: getBusinessIntelligenceDashboard() });
    return;
  }

  if (url.pathname === "/api/mobile/analytics/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, mobile: getMobileAnalyticsDashboard() });
    return;
  }

  if (url.pathname === "/api/analytics/integrations") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, integrations: getAnalyticsIntegrationStatus() });
    return;
  }

  if (url.pathname === "/api/retention/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "all")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, retention: getRetentionDashboard() });
    return;
  }

  if (url.pathname === "/api/gamification/leaderboard") {
    sendJson(response, { ok: true, leaderboard: getGamificationLeaderboard(20) });
    return;
  }

  if (url.pathname === "/api/seo/summary") {
    const user = adminUser(request);
    if (!user || !can(user, "articles")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, seo: getSeoAutomationDashboard() });
    return;
  }

  const seoPreviewMatch = url.pathname.match(/^\/api\/seo\/preview\/([^/]+)\/([^/]+)$/);
  if (seoPreviewMatch) {
    const preview = getSeoPreview(decodeURIComponent(seoPreviewMatch[1]), decodeURIComponent(seoPreviewMatch[2]));
    sendJson(response, preview ? { ok: true, preview } : { ok: false, message: "SEO preview not found." }, preview ? 200 : 404);
    return;
  }

  if (url.pathname === "/api/seo/queue-indexing" && request.method === "POST") {
    const user = adminUser(request);
    if (!user || !can(user, "articles")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, queueSeoIndexing(await readJson(request), user.id));
    return;
  }

  const seoLinkApprovalMatch = url.pathname.match(/^\/api\/seo\/internal-links\/([^/]+)\/approvals$/);
  if (seoLinkApprovalMatch && request.method === "POST") {
    const user = adminUser(request);
    if (!user || !can(user, "articles")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, createInternalLinkApprovals(decodeURIComponent(seoLinkApprovalMatch[1]), user.id));
    return;
  }

  if (url.pathname.startsWith("/api/seo/schema/")) {
    const parts = url.pathname.replace("/api/seo/schema/", "").split("/");
    const type = decodeURIComponent(parts[0] || "");
    const slug = decodeURIComponent(parts.slice(1).join("/") || "");
    const schema = getStructuredData(type, slug);
    sendJson(response, schema ? { ok: true, schema } : { ok: false, message: "Schema not found." }, schema ? 200 : 404);
    return;
  }

  if (url.pathname.startsWith("/api/seo/internal-links/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/seo/internal-links/", ""));
    sendJson(response, { ok: true, suggestions: getInternalLinkSuggestions(slug) });
    return;
  }

  if (url.pathname === "/api/reader/me") {
    const reader = getReaderBySession(readerToken(request));
    const bookmarks = reader ? getReaderBookmarks(readerToken(request)).articles.map((article) => article.slug) : [];
    sendJson(response, { ok: Boolean(reader), reader, bookmarks });
    return;
  }

  if (url.pathname === "/api/reader/experience") {
    const result = getReaderExperience(readerToken(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/reader/register") {
    const result = registerReader(await readJson(request), {
      ipAddress: clientIp(request),
      userAgent: request.headers["user-agent"] || ""
    });
    sendJson(
      response,
      result,
      result.ok ? 200 : 400,
      result.ok ? { "Set-Cookie": [`tm_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`, `tm_reader=${result.token}; Path=/; SameSite=Lax; Max-Age=${config.sessionDays * 24 * 60 * 60}`] } : {}
    );
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/reader/login") {
    const form = await readJson(request);
    const result = authenticateReader(form.email, form.password, {
      ipAddress: clientIp(request),
      userAgent: request.headers["user-agent"] || ""
    });
    sendJson(
      response,
      result,
      result.ok ? 200 : 401,
      result.ok ? { "Set-Cookie": [`tm_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`, `tm_reader=${result.token}; Path=/; SameSite=Lax; Max-Age=${config.sessionDays * 24 * 60 * 60}`] } : {}
    );
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/reader/logout") {
    deleteReaderSession(readerToken(request));
    sendJson(response, { ok: true }, 200, { "Set-Cookie": "tm_reader=; Path=/; Max-Age=0; SameSite=Lax" });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/reader/profile") {
    const result = updateReaderProfile(readerToken(request), await readJson(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/reader/bookmarks") {
    if (!apiReadAllowed(request, response, "api-reader", 300, 60 * 1000)) return;
    const result = getReaderBookmarks(readerToken(request));
    if (result.ok) {
      const page = paginatedCollection(result.articles || result.bookmarks || [], url, { defaultLimit: 20, maxLimit: 100 });
      sendJson(response, { ...result, articles: page.items, bookmarks: page.items, pagination: page.pagination });
      return;
    }
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/reader/social") {
    const result = getReaderSocial(readerToken(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/reader/following-feed") {
    if (!apiReadAllowed(request, response, "api-reader", 300, 60 * 1000)) return;
    const result = getFollowedAuthorFeed(readerToken(request));
    if (result.ok) {
      const page = paginatedCollection(result.articles || result.feed || [], url, { defaultLimit: 20, maxLimit: 100 });
      sendJson(response, { ...result, articles: page.items, feed: page.items, pagination: page.pagination });
      return;
    }
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/reader/gamification") {
    const result = getReaderGamification(readerToken(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/memberships") {
    const bootstrap = await cached("bootstrap:v1", config.cacheTtlSeconds, () => getBootstrap());
    sendJson(response, { ok: true, plans: bootstrap.membershipPlans, membership: getReaderMembership(readerToken(request)).membership, paymentProvider: config.paymentProvider });
    return;
  }

  if (url.pathname === "/api/notifications" && request.method === "GET") {
    if (!apiReadAllowed(request, response, "api-notifications", 300, 60 * 1000)) return;
    const result = getReaderNotifications(readerToken(request));
    if (result.ok) {
      const page = paginatedCollection(result.notifications || [], url, { defaultLimit: 20, maxLimit: 100 });
      sendJson(response, { ...result, notifications: page.items, pagination: page.pagination });
      return;
    }
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/notifications/preferences" && request.method === "GET") {
    const result = getNotificationPreferences(readerToken(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/notifications/preferences" && request.method === "POST") {
    const result = saveNotificationPreferences(readerToken(request), await readJson(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/notifications/device" && request.method === "POST") {
    const result = registerNotificationDevice(readerToken(request), await readJson(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  const notificationReadMatch = url.pathname.match(/^\/api\/notifications\/([^/]+)\/read$/);
  if (notificationReadMatch && request.method === "POST") {
    const result = markNotificationRead(readerToken(request), notificationReadMatch[1]);
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (request.method === "POST" && url.pathname.startsWith("/api/memberships/subscribe/")) {
    const planSlug = decodeURIComponent(url.pathname.replace("/api/memberships/subscribe/", ""));
    const result = subscribeReaderToPlan(readerToken(request), planSlug);
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/memberships/cancel") {
    const result = cancelReaderMembership(readerToken(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/feed") {
    if (!apiReadAllowed(request, response, "api-feed", 300, 60 * 1000)) return;
    const result = getPlatformFeed(readerToken(request), { limit: url.searchParams.get("limit") || "80" });
    const page = paginatedCollection(result.feed || [], url, { defaultLimit: 24, maxLimit: 100 });
    sendJson(response, { ...result, feed: page.items, pagination: page.pagination });
    return;
  }

  if (url.pathname === "/api/it-rooms") {
    if (!apiReadAllowed(request, response, "api-it-rooms", 300, 60 * 1000)) return;
    sendPaginatedCollection(response, "rooms", getItRooms(), url, { defaultLimit: 24, maxLimit: 100 });
    return;
  }

  const itRoomPostMatch = url.pathname.match(/^\/api\/it-rooms\/([^/]+)\/posts$/);
  if (request.method === "POST" && itRoomPostMatch) {
    const result = createItRoomPost(readerToken(request), decodeURIComponent(itRoomPostMatch[1]), await readJson(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  const itRoomMatch = url.pathname.match(/^\/api\/it-rooms\/([^/]+)$/);
  if (itRoomMatch) {
    if (!apiReadAllowed(request, response, "api-it-rooms", 300, 60 * 1000)) return;
    const room = getItRoom(decodeURIComponent(itRoomMatch[1]));
    sendJson(response, room ? { ok: true, room } : { ok: false, message: "IT room not found." }, room ? 200 : 404);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/community/topics") {
    const result = createCommunityTopic(readerToken(request), await readJson(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname === "/api/community/topics") {
    if (!apiReadAllowed(request, response, "api-community")) return;
    sendPaginatedCollection(response, "topics", getCommunityTopics(), url, { defaultLimit: 20, maxLimit: 100 });
    return;
  }

  if (url.pathname === "/api/community/operations") {
    const user = adminUser(request);
    if (!user || !can(user, "comments")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, community: getCommunityOperationsDashboard() });
    return;
  }

  if (url.pathname === "/api/community/experience") {
    if (!apiReadAllowed(request, response, "api-community")) return;
    sendJson(response, getSocialEngagementDashboard(readerToken(request)));
    return;
  }

  if (url.pathname === "/api/community/social-experience") {
    if (!apiReadAllowed(request, response, "api-community")) return;
    sendJson(response, getCommunitySocialExperience(readerToken(request)));
    return;
  }

  const topicReplyMatch = url.pathname.match(/^\/api\/community\/topics\/([^/]+)\/replies$/);
  if (request.method === "POST" && topicReplyMatch) {
    const result = addCommunityReply(readerToken(request), decodeURIComponent(topicReplyMatch[1]), await readJson(request));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  const topicVoteMatch = url.pathname.match(/^\/api\/community\/topics\/([^/]+)\/vote$/);
  if (request.method === "POST" && topicVoteMatch) {
    const payload = await readJson(request);
    const result = voteCommunityTopic(readerToken(request), decodeURIComponent(topicVoteMatch[1]), payload.vote || 1, request.socket.remoteAddress || "anonymous");
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  const profileMatch = url.pathname.match(/^\/api\/community\/profiles\/([^/]+)$/);
  if (profileMatch) {
    const profile = getPublicReaderProfile(decodeURIComponent(profileMatch[1]));
    sendJson(response, profile ? { ok: true, profile } : { ok: false, message: "Profile not found." }, profile ? 200 : 404);
    return;
  }

  if (url.pathname.startsWith("/api/community/topics/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/community/topics/", ""));
    const topic = getCommunityTopic(slug);
    sendJson(response, topic ? { ok: true, topic } : { ok: false, message: "Topic not found." }, topic ? 200 : 404);
    return;
  }

  if (url.pathname === "/api/community/polls") {
    if (!apiReadAllowed(request, response, "api-community")) return;
    sendPaginatedCollection(response, "polls", getCommunityPolls(), url, { defaultLimit: 20, maxLimit: 100 });
    return;
  }

  const pollVoteMatch = url.pathname.match(/^\/api\/community\/polls\/([^/]+)\/vote$/);
  if (request.method === "POST" && pollVoteMatch) {
    const result = voteCommunityPoll(readerToken(request), decodeURIComponent(pollVoteMatch[1]), await readJson(request), request.socket.remoteAddress || "anonymous");
    sendJson(response, result, result.ok ? 200 : 400);
    return;
  }

  const authorFollowMatch = url.pathname.match(/^\/api\/authors\/([^/]+)\/follow$/);
  if (request.method === "POST" && authorFollowMatch) {
    const result = toggleAuthorFollow(readerToken(request), decodeURIComponent(authorFollowMatch[1]));
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (url.pathname.startsWith("/api/directory/")) {
    if (!apiReadAllowed(request, response, "api-directory")) return;
    const type = decodeURIComponent(url.pathname.replace("/api/directory/", ""));
    sendPaginatedCollection(response, "items", getDirectoryItems(type), url, { defaultLimit: 20, maxLimit: 100 });
    return;
  }

  const affiliateClickMatch = url.pathname.match(/^\/go\/([^/]+)$/);
  if (affiliateClickMatch) {
    const result = recordAffiliateClick(affiliateClickMatch[1], { referrer: request.headers.referer || "", userAgent: request.headers["user-agent"] || "" });
    if (!result.ok) {
      sendHtml(response, "Affiliate link not found.", 404);
      return;
    }
    redirect(response, result.targetUrl);
    return;
  }

  if (request.method === "POST" && url.pathname.startsWith("/api/bookmarks/")) {
    const slug = decodeURIComponent(url.pathname.replace("/api/bookmarks/", ""));
    const result = toggleBookmark(readerToken(request), slug);
    sendJson(response, result, result.ok ? 200 : 401);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/comments/vote") {
    const result = voteComment({ ...(await readJson(request)), voterKey: readerToken(request) || request.socket.remoteAddress || "anonymous" });
    sendJson(response, result);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/comments/report") {
    const result = reportComment({ ...(await readJson(request)), reporterKey: readerToken(request) || request.socket.remoteAddress || "anonymous" });
    sendJson(response, result);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/newsletter") {
    if (!checkRateLimit(request, "newsletter", 30, 10 * 60 * 1000)) {
      rateLimitResponse(response);
      return;
    }
    try {
      const result = addSubscriber(await readJson(request));
      sendJson(response, result, result.ok ? 200 : 400);
    } catch {
      sendJson(response, { ok: false, message: "Newsletter request failed." }, 400);
    }
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/company/contact") {
    if (!checkRateLimit(request, "company-contact", 20, 10 * 60 * 1000)) {
      rateLimitResponse(response);
      return;
    }
    try {
      const payload = await readJson(request);
      const name = String(payload.name || "").trim();
      const email = String(payload.email || "").trim().toLowerCase();
      const company = String(payload.company || "").trim();
      const topic = String(payload.topic || payload.kind || "general").trim();
      const message = String(payload.message || "").trim();
      if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 10) {
        sendJson(response, { ok: false, message: "Name, valid email, and a short message are required." }, 400);
        return;
      }
      const recipient = topic.includes("advert") || topic.includes("sponsor") || topic.includes("media")
        ? "ads@techmag.local"
        : topic.includes("career")
          ? "careers@techmag.local"
          : "editorial@techmag.local";
      const outbox = createOutboxEmail({
        to: recipient,
        subject: `Website ${topic} request from ${name}`,
        body: [
          `Name: ${name}`,
          `Email: ${email}`,
          company ? `Company: ${company}` : "",
          `Topic: ${topic}`,
          "",
          message
        ].filter(Boolean).join("\n"),
        relatedType: "company_contact",
        relatedId: randomUUID()
      });
      sendJson(response, {
        ok: true,
        id: outbox.id,
        message: "Thanks. Your request was queued for the Tech Magazine team."
      });
    } catch {
      sendJson(response, { ok: false, message: "Contact request failed." }, 400);
    }
    return;
  }

  if (url.pathname === "/api/newsletter/verify") {
    sendJson(response, verifyNewsletterSubscriber(url.searchParams.get("token") || url.searchParams.get("email") || ""));
    return;
  }

  if (url.pathname === "/api/newsletter/experience") {
    if (!apiReadAllowed(request, response, "api-newsletter")) return;
    sendJson(response, getNewsletterExperience(readerToken(request)));
    return;
  }

  if (url.pathname === "/api/newsletter/unsubscribe" && request.method === "POST") {
    if (!checkRateLimit(request, "newsletter-unsubscribe", 30, 10 * 60 * 1000)) {
      rateLimitResponse(response);
      return;
    }
    const payload = await readJson(request);
    sendJson(response, unsubscribeNewsletterSubscriber(payload.token || payload.email || ""));
    return;
  }

  if (url.pathname === "/api/newsletter/event" && request.method === "POST") {
    sendJson(response, recordNewsletterEvent(await readJson(request)));
    return;
  }

  if (url.pathname === "/api/newsletter/marketing") {
    const user = adminUser(request);
    if (!user || !can(user, "subscribers")) {
      sendJson(response, { ok: false, message: "Admin access required." }, 401);
      return;
    }
    sendJson(response, { ok: true, newsletter: getNewsletterMarketingDashboard() });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/comments") {
    if (!checkRateLimit(request, "comments", 20, 10 * 60 * 1000)) {
      rateLimitResponse(response);
      return;
    }
    try {
      const result = addComment({ ...(await readJson(request)), readerToken: readerToken(request) });
      sendJson(response, result, result.ok ? 200 : 400);
    } catch {
      sendJson(response, { ok: false, message: "Comment request failed." }, 400);
    }
    return;
  }

  if (url.pathname === "/robots.txt") {
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", ...securityHeaders });
    response.end("User-agent: *\nAllow: /\nSitemap: /sitemap.xml\nSitemap: /news-sitemap.xml\nSitemap: /video-sitemap.xml\nSitemap: /podcast-sitemap.xml\nSitemap: /category-sitemap.xml\n");
    return;
  }

  if (url.pathname.startsWith("/amp/articles/")) {
    const slug = decodeURIComponent(url.pathname.replace("/amp/articles/", ""));
    const article = getArticle(slug);
    if (!article) {
      sendHtml(response, "Article not found.", 404);
      return;
    }
    const body = article.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    sendHtml(response, `<!doctype html><html amp lang="en"><head><meta charset="utf-8"><title>${escapeHtml(article.title)}</title><link rel="canonical" href="${config.siteUrl}/#/article/${escapeHtml(article.slug)}"><meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1"><script async src="https://cdn.ampproject.org/v0.js"></script><style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{animation:none}</style></noscript><style amp-custom>body{font-family:Arial,sans-serif;margin:0;padding:24px;line-height:1.6;color:#111}article{max-width:760px;margin:auto}h1{font-size:38px;line-height:1.05}p{font-size:18px}</style></head><body><article><h1>${escapeHtml(article.title)}</h1><p><strong>${escapeHtml(article.subtitle)}</strong></p><amp-img src="${escapeHtml(article.image)}" width="1200" height="675" layout="responsive" alt="${escapeHtml(article.title)}"></amp-img>${body}</article></body></html>`);
    return;
  }

  if (url.pathname === "/sitemap.xml") {
    response.writeHead(200, { "Content-Type": "application/xml; charset=utf-8", ...securityHeaders });
    const urls = getSitemapPaths()
      .map((path) => `<url><loc>${config.siteUrl}/${escapeXml(path)}</loc></url>`)
      .join("");
    response.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
    return;
  }

  if (url.pathname === "/news-sitemap.xml") {
    response.writeHead(200, { "Content-Type": "application/xml; charset=utf-8", ...securityHeaders });
    const entries = getNewsSitemapEntries()
      .map((entry) => `
        <url>
          <loc>${escapeXml(`${config.siteUrl}/#/article/${entry.slug}`)}</loc>
          <news:news>
            <news:publication><news:name>Tech Magazine</news:name><news:language>en</news:language></news:publication>
            <news:publication_date>${escapeXml(entry.publishedAt)}</news:publication_date>
            <news:title>${escapeXml(entry.title)}</news:title>
            <news:keywords>${escapeXml(entry.categoryName || "Technology")}</news:keywords>
          </news:news>
        </url>
      `)
      .join("");
    response.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${entries}</urlset>`);
    return;
  }

  if (url.pathname === "/video-sitemap.xml") {
    response.writeHead(200, { "Content-Type": "application/xml; charset=utf-8", ...securityHeaders });
    const entries = getVideoSitemapEntries().map((entry) => `
      <url>
        <loc>${escapeXml(entry.loc)}</loc>
        <video:video>
          <video:thumbnail_loc>${escapeXml(entry.thumbnail || config.siteUrl + "/assets/logo.svg")}</video:thumbnail_loc>
          <video:title>${escapeXml(entry.title)}</video:title>
          <video:description>${escapeXml(entry.description)}</video:description>
        </video:video>
      </url>
    `).join("");
    response.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${entries}</urlset>`);
    return;
  }

  if (url.pathname === "/podcast-sitemap.xml") {
    response.writeHead(200, { "Content-Type": "application/xml; charset=utf-8", ...securityHeaders });
    const entries = getPodcastSitemapEntries().map((entry) => `<url><loc>${escapeXml(entry.loc)}</loc><lastmod>${escapeXml(entry.publishedAt || new Date().toISOString())}</lastmod></url>`).join("");
    response.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`);
    return;
  }

  if (url.pathname === "/category-sitemap.xml") {
    response.writeHead(200, { "Content-Type": "application/xml; charset=utf-8", ...securityHeaders });
    const entries = getCategorySitemapEntries().map((entry) => `<url><loc>${escapeXml(entry.loc)}</loc></url>`).join("");
    response.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`);
    return;
  }

  serveFile(response, decodeURIComponent(url.pathname));
});

httpServer.on("upgrade", (request, socket) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  if (url.pathname !== "/api/workflow/realtime") {
    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    socket.destroy();
    return;
  }
  const origin = request.headers.origin || "";
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== request.headers.host) {
        socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
        socket.destroy();
        return;
      }
    } catch {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }
  }
  const user = adminUser(request);
  if (!user || !can(user, "articles")) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }
  const key = request.headers["sec-websocket-key"];
  if (!key) {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
    socket.destroy();
    return;
  }
  const accept = createHash("sha1")
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest("base64");
  socket.write([
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${accept}`,
    "Cache-Control: no-store",
    "\r\n"
  ].join("\r\n"));
  workflowSockets.add(socket);
  socket.on("close", () => workflowSockets.delete(socket));
  socket.on("end", () => workflowSockets.delete(socket));
  socket.on("error", () => workflowSockets.delete(socket));
  socket.on("data", (chunk) => {
    if ((chunk[0] & 0x0f) === 0x8) {
      workflowSockets.delete(socket);
      socket.end();
    }
  });
  sendWorkflowSocket(socket, {
    id: randomUUID(),
    instanceId: realtimeInstanceId,
    type: "workflow.connected",
    payload: {
      userId: user.id,
      userName: user.name,
      redisFanoutReady: redisConfigured,
      instanceId: realtimeInstanceId
    },
    sentAt: new Date().toISOString(),
    workflow: getWorkflowOperations("all")
  });
});

httpServer.listen(port, config.host, () => {
  if (redisConfigured) {
    setInterval(() => {
      pollRealtimeEvents().catch(() => {});
    }, 1000).unref();
  }
  if (config.newsImportOnStartup) {
    setTimeout(() => {
      importTechNews({ limit: config.newsImportTargetCount || 50, status: config.newsImportStatus || "source_policy", savedBy: "user-admin" })
        .then((result) => console.log(`Startup news import: ${result.importedCount} imported; ${result.publishedCount} published articles available.`))
        .catch((error) => console.error(`Startup news import failed: ${error.message}`));
    }, 2500).unref();
  }
  console.log(`Tech Magazine running at http://${config.host}:${port}`);
  console.log(`Public site URL: ${config.siteUrl}`);
});

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
