import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.staging.yml",
  ".env.example",
  ".env.production.example",
  ".env.staging.example",
  "DEPLOYMENT.md",
  "LAUNCH_CHECKLIST.md",
  "PLATFORM_COMPLETION_REPORT.md",
  "infra/nginx/tech-magazine.conf",
  "infra/nginx/tech-magazine-compose.conf",
  "infra/systemd/tech-magazine.service",
  "infra/systemd/tech-magazine-worker.service",
  "infra/kubernetes/namespace.yaml",
  "infra/kubernetes/configmap.yaml",
  "infra/kubernetes/secret.example.yaml",
  "infra/kubernetes/storage.yaml",
  "infra/kubernetes/app.yaml",
  "infra/kubernetes/worker.yaml",
  "infra/kubernetes/ingress.yaml",
  "database/postgres/schema.sql",
  "database/postgres/schema.generated.sql",
  "scripts/export-postgres-json.js",
  "scripts/export-postgres-schema.js",
  "scripts/launch-readiness-check.js",
  "launch-readiness.js",
  "email.js",
  "push.js",
  "analytics-integrations.js",
  "database-runtime.js",
  "media-storage.js",
  "video-streaming.js",
  "postgres-adapter.js",
  "scripts/postgres-readiness-check.js",
  "scripts/postgres-migration-rehearsal.js",
  "scripts/staging-vps-bootstrap.sh",
  "scripts/deploy-staging-vps.ps1",
  "database/postgres/README.md"
];

const requiredEnvKeys = [
  "NODE_ENV",
  "HOST",
  "PORT",
  "SITE_URL",
  "DATABASE_CLIENT",
  "DATABASE_PATH",
  "BACKUP_DIR",
  "MAX_IMAGE_UPLOAD_BYTES",
  "MAX_VIDEO_UPLOAD_BYTES",
  "MAX_AUDIO_UPLOAD_BYTES",
  "MEDIA_CDN_BASE_URL",
  "MEDIA_STORAGE_PROVIDER",
  "MEDIA_SCAN_MODE",
  "MEDIA_SCANNER_WEBHOOK_URL",
  "DO_SPACES_NAME",
  "DO_SPACES_REGION",
  "DO_SPACES_ENDPOINT",
  "DO_SPACES_ACCESS_KEY_ID",
  "DO_SPACES_SECRET_ACCESS_KEY",
  "DO_SPACES_CDN_BASE_URL",
  "S3_BUCKET",
  "S3_REGION",
  "S3_ENDPOINT",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
  "S3_PUBLIC_BASE_URL",
  "R2_ACCOUNT_ID",
  "R2_BUCKET",
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_PUBLIC_BASE_URL",
  "VIDEO_STREAMING_PROVIDER",
  "VIDEO_TRANSCODER_MODE",
  "FFMPEG_PATH",
  "VIDEO_HLS_SEGMENT_SECONDS",
  "VIDEO_LIVE_CHAT_PROVIDER",
  "SEARCH_PROVIDER",
  "SEARCH_INDEX_MODE",
  "OPENSEARCH_URL",
  "OPENSEARCH_INDEX",
  "OPENSEARCH_API_KEY",
  "TRUST_PROXY",
  "CACHE_TTL_SECONDS",
  "REDIS_URL",
  "WORKER_INTERVAL_MS",
  "EMAIL_PROVIDER",
  "EMAIL_FROM",
  "EMAIL_REPLY_TO",
  "PAYMENT_PROVIDER",
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
  "OPENAI_TRANSCRIPTION_MODEL",
  "GOOGLE_ANALYTICS_ID",
  "GOOGLE_TAG_MANAGER_ID",
  "SEARCH_CONSOLE_VERIFICATION",
  "MATOMO_URL",
  "MATOMO_SITE_ID",
  "FIREBASE_SERVICE_ACCOUNT_JSON",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY"
];

const checks = [];

function record(name, passed, detail = "") {
  checks.push({ name, passed, detail });
}

function read(path) {
  return readFileSync(path, "utf8");
}

for (const file of requiredFiles) {
  record(`file exists: ${file}`, existsSync(file));
}

if (existsSync("Dockerfile")) {
  const dockerfile = read("Dockerfile");
  record("docker image has healthcheck", dockerfile.includes("HEALTHCHECK"));
  record("docker image runs as non-root user", dockerfile.includes("USER techmag"));
}

if (existsSync("package.json")) {
  const pkg = JSON.parse(read("package.json"));
  record("package declares PostgreSQL driver", Boolean(pkg.dependencies?.pg));
  record("package exposes PostgreSQL rehearsal script", Boolean(pkg.scripts?.["db:postgres:rehearse"]));
}

if (existsSync("docker-compose.yml")) {
  const compose = read("docker-compose.yml");
  record("compose has restart policies", compose.includes("restart: unless-stopped"));
  record("compose has healthchecks", compose.includes("healthcheck:"));
  record("compose has optional proxy profile", compose.includes("profiles:") && compose.includes("proxy"));
  record("compose includes app, worker, postgres, redis", ["app:", "worker:", "postgres:", "redis:"].every((item) => compose.includes(item)));
}

if (existsSync("docker-compose.staging.yml")) {
  const compose = read("docker-compose.staging.yml");
  record("staging compose has app, worker, redis, postgres, nginx", ["app:", "worker:", "redis:", "postgres:", "nginx:"].every((item) => compose.includes(item)));
  record("staging compose wires Redis URL", compose.includes("REDIS_URL: redis://redis:6379"));
  record("staging compose uses private env file", compose.includes(".env.staging"));
}

if (existsSync(".env.example")) {
  const env = read(".env.example");
  for (const key of requiredEnvKeys) {
    record(`env example includes ${key}`, env.includes(`${key}=`));
  }
}

if (existsSync(".env.production.example")) {
  const env = read(".env.production.example");
  record("production env keeps email in dummy mode", env.includes("EMAIL_PROVIDER=dummy"));
  record("production env keeps payments disabled", env.includes("PAYMENT_PROVIDER=none"));
  record("production env does not include real secrets", !env.includes("sk-") && !env.includes("replace-with-real-key"));
}

if (existsSync("infra/kubernetes/app.yaml")) {
  const app = read("infra/kubernetes/app.yaml");
  record("kubernetes app has readiness probe", app.includes("readinessProbe:"));
  record("kubernetes app has liveness probe", app.includes("livenessProbe:"));
  record("kubernetes app has resource limits", app.includes("resources:") && app.includes("limits:"));
}

if (existsSync("infra/kubernetes/worker.yaml")) {
  const worker = read("infra/kubernetes/worker.yaml");
  record("kubernetes worker has resource limits", worker.includes("resources:") && worker.includes("limits:"));
}

if (existsSync("DEPLOYMENT.md")) {
  const deployment = read("DEPLOYMENT.md");
  record("deployment docs mention preflight", deployment.includes("npm run preflight"));
  record("deployment docs mention operations panel", deployment.includes("/admin/operations"));
  record("deployment docs mention launch readiness", deployment.includes("npm run launch:check"));
  record("deployment docs mention database readiness", deployment.includes("npm run db:postgres:check"));
  record("deployment docs mention migration rehearsal", deployment.includes("db:postgres:rehearse"));
  record("deployment docs mention production media storage", deployment.includes("Production Media Storage") && deployment.includes("MEDIA_STORAGE_PROVIDER"));
  record("deployment docs mention video platform delivery", deployment.includes("Video Platform Delivery") && deployment.includes("VIDEO_STREAMING_PROVIDER"));
}

if (existsSync("scripts/deploy-staging-vps.ps1")) {
  const deploy = read("scripts/deploy-staging-vps.ps1");
  record("staging deploy script copies private env separately", deploy.includes("$EnvFile") && deploy.includes(".env.staging"));
  record("staging deploy script starts staging compose", deploy.includes("docker compose -f docker-compose.staging.yml up --build -d"));
}

if (existsSync("scripts/staging-vps-bootstrap.sh")) {
  const bootstrap = read("scripts/staging-vps-bootstrap.sh");
  record("staging bootstrap installs Docker on Ubuntu", bootstrap.includes("docker-ce") && bootstrap.includes("docker-compose-plugin"));
}

if (existsSync("database/postgres/schema.generated.sql")) {
  const generatedSchema = read("database/postgres/schema.generated.sql");
  const tableCount = (generatedSchema.match(/CREATE TABLE IF NOT EXISTS/g) || []).length;
  record("generated postgres schema covers live tables", tableCount >= 80, `${tableCount} tables`);
}

const failed = checks.filter((check) => !check.passed);

for (const check of checks) {
  console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}${check.detail ? ` - ${check.detail}` : ""}`);
}

if (failed.length) {
  console.error(`\n${failed.length} infrastructure check(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${checks.length} infrastructure checks passed.`);
