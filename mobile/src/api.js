export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function fetchBootstrap() {
  const response = await fetch(`${API_BASE_URL}/api/bootstrap`);
  if (!response.ok) throw new Error("Could not load magazine content");
  return response.json();
}

export async function fetchMobileConfig() {
  const response = await fetch(`${API_BASE_URL}/api/mobile/config`);
  if (!response.ok) throw new Error("Could not load mobile config");
  return response.json();
}

export async function fetchMobileHome(token = "", params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_BASE_URL}/api/mobile/home?${query.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!response.ok) throw new Error("Could not load mobile home");
  return response.json();
}

export async function registerMobileDevice(token = "", payload = {}) {
  const response = await fetch(`${API_BASE_URL}/api/mobile/device`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function fetchMobileOffline(token = "") {
  const response = await fetch(`${API_BASE_URL}/api/mobile/offline`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.json();
}

export async function saveMobileOffline(token = "", payload = {}) {
  const response = await fetch(`${API_BASE_URL}/api/mobile/offline`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function removeMobileOffline(token = "", payload = {}) {
  return saveMobileOffline(token, { ...payload, action: "remove" });
}

export async function fetchMobileWidgets() {
  const response = await fetch(`${API_BASE_URL}/api/mobile/widgets`);
  if (!response.ok) throw new Error("Could not load mobile widgets");
  return response.json();
}

export async function resolveMobileDeepLink(link) {
  const query = new URLSearchParams({ url: link || "" });
  const response = await fetch(`${API_BASE_URL}/api/mobile/deep-link?${query.toString()}`);
  if (!response.ok) throw new Error("Could not resolve mobile link");
  return response.json();
}

export async function recordMobileEvent(token = "", event = {}) {
  const response = await fetch(`${API_BASE_URL}/api/mobile/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(event)
  });
  return response.json();
}

export async function fetchLanguages() {
  const response = await fetch(`${API_BASE_URL}/api/languages`);
  if (!response.ok) throw new Error("Could not load languages");
  return response.json();
}

export async function fetchMediaOptimization() {
  const response = await fetch(`${API_BASE_URL}/api/media/optimization`);
  if (!response.ok) throw new Error("Could not load media optimization settings");
  return response.json();
}

export async function fetchArticle(slug, language = "en") {
  const query = language && language !== "en" ? `?lang=${encodeURIComponent(language)}` : "";
  const response = await fetch(`${API_BASE_URL}/api/articles/${encodeURIComponent(slug)}${query}`);
  if (!response.ok) throw new Error("Article not found");
  return response.json();
}

export async function fetchTranslatedArticle(slug, language) {
  return fetchArticle(slug, language);
}

export async function searchArticles(params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_BASE_URL}/api/search?${query.toString()}`);
  if (!response.ok) throw new Error("Search failed");
  return response.json();
}

export async function fetchSearchSuggestions(query = "") {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`${API_BASE_URL}/api/search/suggestions?${params.toString()}`);
  if (!response.ok) throw new Error("Could not load search suggestions");
  return response.json();
}

export async function fetchTrendingSearches() {
  const response = await fetch(`${API_BASE_URL}/api/search/trending`);
  if (!response.ok) throw new Error("Could not load trending searches");
  return response.json();
}

export async function searchDiscovery(params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_BASE_URL}/api/search/discovery?${query.toString()}`);
  if (!response.ok) throw new Error("Discovery search failed");
  return response.json();
}

export async function voiceSearch(payload = {}) {
  const response = await fetch(`${API_BASE_URL}/api/search/voice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function saveSearchFilter(token = "", payload = {}) {
  const response = await fetch(`${API_BASE_URL}/api/search/saved-filters`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function fetchSavedSearchFilters(token = "") {
  const response = await fetch(`${API_BASE_URL}/api/search/saved-filters`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.json();
}

export async function loginReader(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/reader/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

export async function registerReader(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/api/reader/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  return response.json();
}

export async function fetchReaderProfile(token = "") {
  const response = await fetch(`${API_BASE_URL}/api/reader/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.json();
}

export async function getMemberships(token = "") {
  const response = await fetch(`${API_BASE_URL}/api/memberships`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.json();
}

export async function fetchNotifications(token = "") {
  const response = await fetch(`${API_BASE_URL}/api/notifications`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.json();
}

export async function fetchLiveEvents() {
  const response = await fetch(`${API_BASE_URL}/api/live-events`);
  if (!response.ok) throw new Error("Could not load live events");
  return response.json();
}

export async function fetchLiveEvent(slug) {
  const response = await fetch(`${API_BASE_URL}/api/live-events/${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error("Live event not found");
  return response.json();
}

export async function fetchEvents() {
  const response = await fetch(`${API_BASE_URL}/api/events`);
  if (!response.ok) throw new Error("Could not load events");
  return response.json();
}

export async function fetchEvent(slug) {
  const response = await fetch(`${API_BASE_URL}/api/events/${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error("Event not found");
  return response.json();
}

export async function registerForEvent(slug, payload, token = "") {
  const response = await fetch(`${API_BASE_URL}/api/events/${encodeURIComponent(slug)}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function fetchJobs() {
  const response = await fetch(`${API_BASE_URL}/api/jobs`);
  if (!response.ok) throw new Error("Could not load jobs");
  return response.json();
}

export async function fetchJob(slug) {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error("Job not found");
  return response.json();
}

export async function applyForJob(slug, payload, token = "") {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${encodeURIComponent(slug)}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function fetchStartups() {
  const response = await fetch(`${API_BASE_URL}/api/startups`);
  if (!response.ok) throw new Error("Could not load startups");
  return response.json();
}

export async function fetchStartup(slug) {
  const response = await fetch(`${API_BASE_URL}/api/startups/${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error("Startup not found");
  return response.json();
}

export async function fetchDevices(params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_BASE_URL}/api/devices${query.toString() ? `?${query.toString()}` : ""}`);
  if (!response.ok) throw new Error("Could not load devices");
  return response.json();
}

export async function fetchDevice(slug) {
  const response = await fetch(`${API_BASE_URL}/api/devices/${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error("Device not found");
  return response.json();
}

export async function compareDevices(slugs = []) {
  const response = await fetch(`${API_BASE_URL}/api/devices/compare?slugs=${encodeURIComponent(slugs.join(","))}`);
  if (!response.ok) throw new Error("Device comparison not found");
  return response.json();
}

export async function fetchVideos() {
  const response = await fetch(`${API_BASE_URL}/api/videos`);
  if (!response.ok) throw new Error("Could not load videos");
  return response.json();
}

export async function fetchVideo(slug) {
  const response = await fetch(`${API_BASE_URL}/api/videos/${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error("Video not found");
  return response.json();
}

export async function fetchPodcasts() {
  const response = await fetch(`${API_BASE_URL}/api/podcasts`);
  if (!response.ok) throw new Error("Could not load podcasts");
  return response.json();
}

export async function fetchPodcastEpisode(slug) {
  const response = await fetch(`${API_BASE_URL}/api/podcasts/episodes/${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error("Podcast episode not found");
  return response.json();
}

export async function fetchReviews() {
  const response = await fetch(`${API_BASE_URL}/api/reviews`);
  if (!response.ok) throw new Error("Could not load product reviews");
  return response.json();
}

export async function fetchReview(slug) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error("Review not found");
  return response.json();
}

export async function fetchAiStatus() {
  const response = await fetch(`${API_BASE_URL}/api/ai/status`);
  if (!response.ok) throw new Error("Could not load AI status");
  return response.json();
}

export async function fetchWorkflowOverview(adminToken = "") {
  const response = await fetch(`${API_BASE_URL}/api/workflow/overview`, {
    headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
  });
  return response.json();
}

export async function fetchCommunityTopics() {
  const response = await fetch(`${API_BASE_URL}/api/community/topics`);
  if (!response.ok) throw new Error("Could not load community topics");
  return response.json();
}

export async function fetchCommunityTopic(slug) {
  const response = await fetch(`${API_BASE_URL}/api/community/topics/${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error("Community topic not found");
  return response.json();
}

export async function fetchCommunityPolls() {
  const response = await fetch(`${API_BASE_URL}/api/community/polls`);
  if (!response.ok) throw new Error("Could not load community polls");
  return response.json();
}

export async function voteCommunityPoll(token, pollId, optionId) {
  const response = await fetch(`${API_BASE_URL}/api/community/polls/${encodeURIComponent(pollId)}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ optionId })
  });
  return response.json();
}

export async function followAuthor(token, authorId) {
  const response = await fetch(`${API_BASE_URL}/api/authors/${encodeURIComponent(authorId)}/follow`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.json();
}

export async function fetchMonetizationSummary(adminToken = "") {
  const response = await fetch(`${API_BASE_URL}/api/monetization/summary`, {
    headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
  });
  return response.json();
}

export async function fetchAnalyticsSummary(adminToken = "") {
  const response = await fetch(`${API_BASE_URL}/api/analytics/summary`, {
    headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
  });
  return response.json();
}

export async function fetchRetentionSummary(adminToken = "") {
  const response = await fetch(`${API_BASE_URL}/api/retention/summary`, {
    headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
  });
  return response.json();
}

export async function fetchOperationsSummary(adminToken = "") {
  const response = await fetch(`${API_BASE_URL}/api/operations/summary`, {
    headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
  });
  return response.json();
}

export async function fetchGamificationLeaderboard() {
  const response = await fetch(`${API_BASE_URL}/api/gamification/leaderboard`);
  if (!response.ok) throw new Error("Could not load leaderboard");
  return response.json();
}

export async function fetchReaderGamification(token = "") {
  const response = await fetch(`${API_BASE_URL}/api/reader/gamification`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.json();
}

export async function fetchSeoSummary(adminToken = "") {
  const response = await fetch(`${API_BASE_URL}/api/seo/summary`, {
    headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
  });
  return response.json();
}

export async function fetchStructuredData(type, slug = "") {
  const response = await fetch(`${API_BASE_URL}/api/seo/schema/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error("Structured data not found");
  return response.json();
}

export async function fetchPartnerNews(apiKey, params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_BASE_URL}/api/v1/news?${query.toString()}`, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
  });
  if (!response.ok) throw new Error("Partner news API request failed");
  return response.json();
}

export async function fetchPartnerArticle(apiKey, slug, language = "en") {
  const query = language && language !== "en" ? `?lang=${encodeURIComponent(language)}` : "";
  const response = await fetch(`${API_BASE_URL}/api/v1/articles/${encodeURIComponent(slug)}${query}`, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
  });
  if (!response.ok) throw new Error("Partner article API request failed");
  return response.json();
}

export async function trackEngagement(event, token = "") {
  const response = await fetch(`${API_BASE_URL}/api/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(event)
  });
  return response.json();
}

export async function saveNotificationPreferences(token, preferences) {
  const response = await fetch(`${API_BASE_URL}/api/notifications/preferences`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(preferences)
  });
  return response.json();
}

export async function registerDeviceToken(token, deviceToken) {
  const response = await fetch(`${API_BASE_URL}/api/notifications/device`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ deviceToken })
  });
  return response.json();
}

export async function bookmarkArticle(token, slug) {
  const response = await fetch(`${API_BASE_URL}/api/bookmarks/${encodeURIComponent(slug)}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.json();
}

export async function bookmarkVideo(token, slug) {
  const response = await fetch(`${API_BASE_URL}/api/videos/bookmark/${encodeURIComponent(slug)}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.json();
}

export async function bookmarkPodcast(token, slug, progressSeconds = 0) {
  const response = await fetch(`${API_BASE_URL}/api/podcasts/bookmark/${encodeURIComponent(slug)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ progressSeconds })
  });
  return response.json();
}
