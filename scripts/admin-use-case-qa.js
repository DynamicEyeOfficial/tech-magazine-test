import { cleanupQaData } from "./qa-cleanup.js";
import { getQaAdminCredentials } from "./qa-credentials.js";

const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const checks = [];

function record(name, ok, detail = "") {
  checks.push({ name, ok: Boolean(ok), detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` - ${detail}` : ""}`);
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
    return { response, json: JSON.parse(body), body };
  } catch {
    return { response, json: {}, body };
  }
}

function extractCsrf(body) {
  return body.match(/name="_csrf" value="([^"]+)"/)?.[1] || "";
}

async function adminLogin() {
  const credentials = getQaAdminCredentials();
  const response = await request("/admin/login", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email: credentials.email, password: credentials.password })
  });
  const cookie = response.headers.get("set-cookie")?.split(";")[0] || "";
  record("admin can sign in", response.status === 302 && Boolean(cookie), String(response.status));
  return cookie;
}

async function postForm(path, cookie, payload) {
  return request(path, {
    method: "POST",
    headers: { cookie, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(payload)
  });
}

async function createArticle(cookie) {
  const slug = `qa-article-${Date.now()}`;
  const form = await text("/admin/articles/new", { headers: { cookie } });
  const csrf = extractCsrf(form.body);
  record("article create form has csrf", Boolean(csrf));

  const create = await postForm("/admin/articles/new", cookie, {
    _csrf: csrf,
    title: "QA Production Article",
    slug,
    subtitle: "End-to-end article creation is verified from admin to public API.",
    status: "published",
    channel: "articles",
    category: "ai",
    author: "maya-chen",
    date: new Date().toISOString().slice(0, 10),
    minutes: "5",
    views: "11",
    tags: "QA, Production, AI",
    seoTitle: "QA Production Article SEO",
    seoDescription: "QA verifies article SEO metadata and public article delivery.",
    body: [
      "This article was created by the production QA suite.",
      "It verifies admin article creation, publishing, API delivery, and edit logic."
    ].join("\n\n")
  });
  record("admin creates published article", create.status === 302, String(create.status));

  const article = await json(`/api/articles/${slug}`);
  record("created article appears in public API", article.response.ok && article.json.article?.slug === slug, String(article.response.status));
  record("created article keeps SEO fields", article.json.article?.seoTitle === "QA Production Article SEO");

  const articleId = article.json.article?.id;
  record("created article has id", Boolean(articleId));
  if (!articleId) return { slug };

  const editForm = await text(`/admin/articles/${articleId}/edit`, { headers: { cookie } });
  const editCsrf = extractCsrf(editForm.body);
  record("article edit form loads", editForm.response.ok && Boolean(editCsrf), String(editForm.response.status));
  const edit = await postForm(`/admin/articles/${articleId}/edit`, cookie, {
    _csrf: editCsrf,
    id: articleId,
    title: "QA Production Article Updated",
    slug,
    subtitle: "Updated subtitle from end-to-end QA.",
    status: "published",
    channel: "articles",
    category: "ai",
    author: "maya-chen",
    date: new Date().toISOString().slice(0, 10),
    minutes: "6",
    views: "12",
    tags: "QA, Updated, AI",
    seoTitle: "QA Production Article Updated SEO",
    seoDescription: "QA verifies article update logic.",
    body: [
      "This updated article was edited by the production QA suite.",
      "It verifies admin edit logic and public API refresh."
    ].join("\n\n")
  });
  record("admin edits article", edit.status === 302, String(edit.status));

  const updated = await json(`/api/articles/${slug}`);
  record("edited article appears in public API", updated.json.article?.title === "QA Production Article Updated");
  return { slug, articleId };
}

async function createEvent(cookie) {
  const slug = `qa-event-${Date.now()}`;
  const page = await text("/admin/events", { headers: { cookie } });
  const csrf = extractCsrf(page.body);
  record("event create form has csrf", Boolean(csrf));

  const starts = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const ends = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const create = await postForm("/admin/events", cookie, {
    _csrf: csrf,
    title: "QA Leadership Summit",
    slug,
    eventType: "conference",
    status: "published",
    location: "Online",
    venue: "Tech Magazine Studio",
    startsAt: starts,
    endsAt: ends,
    timezone: "Asia/Beirut",
    ticketType: "free",
    priceCents: "0",
    capacity: "250",
    sponsor: "QA Sponsor",
    description: "This event verifies conference creation, public API delivery, and registration logic."
  });
  record("admin creates event", create.ok, String(create.status));

  const event = await json(`/api/events/${slug}`);
  record("created event appears in public API", event.response.ok && event.json.event?.slug === slug, String(event.response.status));

  const reader = await json("/api/reader/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Event QA Reader", email: `event-reader-${Date.now()}@example.com`, password: "password123" })
  });
  const token = reader.json.token;
  const registration = await json(`/api/events/${slug}/register`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: "Event QA Reader", email: `event-registered-${Date.now()}@example.com`, company: "QA Labs" })
  });
  record("reader registers for created event", registration.response.ok && Boolean(registration.json.registration?.id), String(registration.response.status));
  return { slug };
}

async function createJob(cookie) {
  const slug = `qa-job-${Date.now()}`;
  const page = await text("/admin/jobs", { headers: { cookie } });
  const csrf = extractCsrf(page.body);
  record("job create form has csrf", Boolean(csrf));

  const create = await postForm("/admin/jobs", cookie, {
    _csrf: csrf,
    recruiterId: "",
    title: "QA Cloud Platform Engineer",
    slug,
    companyName: "QA Systems",
    location: "Remote",
    remoteType: "remote",
    jobType: "full-time",
    salaryMin: "90000",
    salaryMax: "140000",
    currency: "USD",
    applyUrl: "https://example.com/apply",
    status: "published",
    description: "This job verifies admin job creation, public job delivery, and application logic.",
    requirements: "Node.js\nPostgreSQL\nCloud operations",
    benefits: "Remote work\nLearning budget\nHealth benefits"
  });
  record("admin creates job post", create.ok, String(create.status));

  const job = await json(`/api/jobs/${slug}`);
  record("created job appears in public API", job.response.ok && job.json.job?.slug === slug, String(job.response.status));

  const reader = await json("/api/reader/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Job QA Reader", email: `job-reader-${Date.now()}@example.com`, password: "password123" })
  });
  const token = reader.json.token;
  const application = await json(`/api/jobs/${slug}/apply`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: "Job QA Reader",
      email: `job-apply-${Date.now()}@example.com`,
      skills: "Node.js, PostgreSQL, cloud operations",
      resumeUrl: "https://example.com/resume.pdf",
      coverLetter: "I match the QA-created role requirements."
    })
  });
  record("reader applies to created job", application.response.ok && Boolean(application.json.application?.id), String(application.response.status));
  return { slug };
}

const cookie = await adminLogin();
if (cookie) {
  await createArticle(cookie);
  await createEvent(cookie);
  await createJob(cookie);
}

const failed = checks.filter((check) => !check.ok);
cleanupQaData({ log: false });
console.log(JSON.stringify({ passed: checks.length - failed.length, total: checks.length, failed }, null, 2));
if (failed.length) process.exitCode = 1;
