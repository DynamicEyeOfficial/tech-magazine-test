import { existsSync, statSync } from "node:fs";
import { config } from "./config.js";
import { getDatabaseRuntimeStatus } from "./database-runtime.js";
import { getMediaStorageStatus } from "./media-storage.js";
import { getVideoStreamingStatus } from "./video-streaming.js";

function fileExists(path) {
  return existsSync(path);
}

function dirExists(path) {
  try {
    return existsSync(path) && statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function isPlaceholderUrl(value) {
  return /your-domain|localhost|127\.0\.0\.1/i.test(value || "");
}

function emailDomain() {
  const parts = String(config.emailFrom || "").split("@");
  return parts.length === 2 ? parts[1].toLowerCase() : "";
}

function check(id, label, status, detail, action = "") {
  return { id, label, status, detail, action };
}

export function getLaunchReadiness() {
  const database = getDatabaseRuntimeStatus();
  const media = getMediaStorageStatus();
  const video = getVideoStreamingStatus();
  const checks = [
    check(
      "site-url",
      "Production domain",
      !isPlaceholderUrl(config.siteUrl) ? "pass" : "block",
      config.siteUrl,
      "Set SITE_URL to the real HTTPS domain before launch."
    ),
    check(
      "https",
      "HTTPS URL",
      config.siteUrl.startsWith("https://") && !isPlaceholderUrl(config.siteUrl) ? "pass" : "block",
      config.siteUrl.startsWith("https://") ? "HTTPS configured" : "HTTPS is not configured",
      "Enable SSL at NGINX, Cloudflare, Caddy, or the host."
    ),
    check(
      "trust-proxy",
      "Reverse proxy trust",
      config.trustProxy ? "pass" : "warn",
      config.trustProxy ? "TRUST_PROXY=true" : "TRUST_PROXY is not enabled",
      "Set TRUST_PROXY=true when behind Cloudflare, NGINX, Caddy, or a load balancer."
    ),
    check(
      "database",
      "Runtime database",
      database.runtimeReady && database.sqlite.exists ? "pass" : "block",
      `${database.activeClient}: ${database.sqlite.path}`,
      "Keep SQLite for first launch, then migrate to PostgreSQL after adapter testing."
    ),
    check(
      "postgres-runtime",
      "PostgreSQL rehearsal path",
      database.switchoverReady ? "pass" : "warn",
      database.postgres.adapterImplemented && database.postgres.rehearsalScript ? "Adapter and rehearsal script present" : "Migration rehearsal path incomplete",
      "Run npm run db:postgres:check, export data, then run db:postgres:rehearse before any switchover."
    ),
    check(
      "backups",
      "Backup directory",
      dirExists(config.backupDir) ? "pass" : "warn",
      config.backupDir,
      "Create backup directory and schedule off-server backups."
    ),
    check(
      "uploads",
      "Media storage/CDN",
      media.productionReady ? "pass" : "block",
      `${media.provider}: ${media.uploadMode}`,
      media.blockers[0] || "Cloud media storage and public delivery are configured."
    ),
    check(
      "openai",
      "AI newsroom key",
      config.openaiApiKey ? "pass" : "warn",
      config.openaiApiKey ? `Configured with ${config.openaiModel}` : "OPENAI_API_KEY is empty",
      "Add the OpenAI key in the private .env file only."
    ),
    check(
      "video-streaming",
      "Video adaptive delivery",
      video.productionReady ? "pass" : "warn",
      `${video.provider}: ${video.transcoderMode}`,
      video.blockers[0] || "Adaptive video delivery path is configured."
    ),
    check(
      "firebase",
      "Firebase push config",
      config.firebaseProjectId ? "pass" : "warn",
      config.firebaseProjectId || "Firebase project is not configured",
      "Keep Firebase public config in env and private credentials out of the repo."
    ),
    check(
      "email-provider",
      "Email delivery",
      config.emailProvider !== "dummy" ? "pass" : "block",
      `${config.emailProvider}: ${config.emailFrom}`,
      "Switch from dummy email after the domain has SPF, DKIM, and DMARC."
    ),
    check(
      "analytics",
      "Analytics integrations",
      config.googleAnalyticsId || config.googleTagManagerId || config.matomoUrl ? "pass" : "warn",
      config.googleAnalyticsId || config.googleTagManagerId || config.matomoUrl || "Analytics IDs are empty",
      "Add Google Analytics, Google Tag Manager, Search Console, or Matomo IDs before marketing launch."
    ),
    check(
      "payments",
      "Payment mode",
      config.paymentProvider === "none" ? "warn" : "pass",
      config.paymentProvider,
      "Payments are intentionally disabled until gateways are selected."
    ),
    check(
      "docker-files",
      "Docker package",
      fileExists("Dockerfile") && fileExists("docker-compose.yml") ? "pass" : "block",
      "Dockerfile and docker-compose.yml",
      "Install Docker Desktop locally before container testing."
    ),
    check(
      "proxy-files",
      "Proxy templates",
      fileExists("infra/nginx/tech-magazine.conf") && fileExists("infra/systemd/tech-magazine.service") ? "pass" : "warn",
      "NGINX and systemd templates",
      "Use these templates on a VPS or dedicated server."
    ),
    check(
      "kubernetes",
      "Kubernetes package",
      fileExists("infra/kubernetes/app.yaml") && fileExists("infra/kubernetes/worker.yaml") ? "pass" : "warn",
      "Kubernetes manifests",
      "Use after the Docker image has been built and pushed."
    ),
    check(
      "postgres-schema",
      "PostgreSQL migration inventory",
      fileExists("database/postgres/schema.generated.sql") ? "pass" : "warn",
      "database/postgres/schema.generated.sql",
      "Regenerate before a database migration phase."
    ),
    check(
      "admin-password",
      "Admin credential rotation",
      "warn",
      "Seed admin exists for development",
      "Change admin@techmag.local password before launch."
    )
  ];

  const counts = checks.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, { pass: 0, warn: 0, block: 0 });

  const dns = {
    domain: emailDomain() || "your-domain.com",
    records: [
      { type: "A/AAAA", host: "@", value: "Point to the server or load balancer IP.", status: isPlaceholderUrl(config.siteUrl) ? "block" : "todo" },
      { type: "CNAME", host: "www", value: "Point to the root domain or hosting target.", status: isPlaceholderUrl(config.siteUrl) ? "block" : "todo" },
      { type: "TXT", host: "@", value: "SPF record from the chosen email provider.", status: config.emailProvider === "dummy" ? "block" : "todo" },
      { type: "TXT/CNAME", host: "provider._domainkey", value: "DKIM record from SendGrid, Brevo, Mailchimp, or SES.", status: config.emailProvider === "dummy" ? "block" : "todo" },
      { type: "TXT", host: "_dmarc", value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@" + (emailDomain() || "your-domain.com"), status: config.emailProvider === "dummy" ? "block" : "todo" }
    ]
  };

  return {
    generatedAt: new Date().toISOString(),
    launchReady: counts.block === 0,
    score: Math.round((counts.pass / checks.length) * 100),
    counts,
    checks,
    dns,
    commands: {
      preflight: "npm run preflight",
      docker: "docker compose --profile proxy up --build",
      schema: "npm run db:schema:postgres",
      exportData: "npm run db:export:postgres",
      database: "npm run db:postgres:check",
      postgresRehearsal: "POSTGRES_REHEARSAL_CONFIRM=true POSTGRES_IMPORT_JSON=<export-file> npm run db:postgres:rehearse"
    }
  };
}
