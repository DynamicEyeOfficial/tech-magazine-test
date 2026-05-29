# Tech Magazine Deployment

## Local Run

Use the bundled or installed Node 24+ runtime.

```bash
node server.js
```

Local URL:

```text
http://127.0.0.1:8000
```

Admin:

```text
Use a private admin account from the server environment or the local `.qa-admin-credentials.json` file.
Do not publish admin passwords in deployment notes.
```

## Environment Setup

Copy `.env.production.example` to `.env` on the server and update:

```text
HOST=0.0.0.0
PORT=8000
SITE_URL=https://your-domain.com
DATABASE_PATH=data/tech_magazine.db
BACKUP_DIR=backups
TRUST_PROXY=true
```

Keep email provider values empty until the domain and mail provider are ready.

## Preflight Check

Before deploying, run:

```bash
npm run preflight
```

This checks JavaScript syntax and verifies the deployment package: Docker, Compose, NGINX, systemd, Kubernetes, environment templates, and migration export tooling.

Run the launch readiness checklist:

```bash
npm run launch:check
```

The same checklist is available in the admin at:

```text
/admin/launch
```

## Docker

If Docker is not installed on Windows, open PowerShell as Administrator and run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\install-docker-windows-admin.ps1
```

Restart Windows if the installer asks, then open Docker Desktop once and wait until it says it is running.

Build:

```bash
docker build -t tech-magazine .
```

Run:

```bash
docker run -p 8000:8000 \
  -v tech-magazine-data:/app/data \
  -v tech-magazine-uploads:/app/public/uploads \
  -v tech-magazine-backups:/app/backups \
  --env-file .env \
  tech-magazine
```

## Docker Compose

The repository now includes `docker-compose.yml` with:

- app container
- worker container
- PostgreSQL service for the migration path
- Redis service for production cache/queue wiring

Run:

```bash
docker compose up --build
```

To run with the included NGINX reverse proxy container:

```bash
docker compose --profile proxy up --build
```

## Staging Server

For a VPS/testing server, use the staging compose file. It runs:

- app
- worker
- Redis
- PostgreSQL for migration rehearsal
- NGINX reverse proxy on port 80

Create the private staging environment file:

```bash
cp .env.staging.example .env.staging
```

Edit:

```text
SITE_URL=http://SERVER_IP_OR_TEST_DOMAIN
OPENAI_API_KEY=<private key>
POSTGRES_URL=postgres://tech_magazine:<same staging password>@postgres:5432/tech_magazine
```

Keep `DATABASE_CLIENT=sqlite` for the first staging run. PostgreSQL is included for rehearsal, not live runtime switchover yet.

Start staging:

```bash
docker compose -f docker-compose.staging.yml up --build -d
```

From this Windows workspace, after `.env.staging` is filled, you can deploy to an Ubuntu VPS with:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-staging-vps.ps1 -HostName SERVER_IP -User root
```

The helper installs Docker on the server when needed, uploads the app package, copies `.env.staging` separately, and starts the staging compose stack.

Check:

```bash
curl http://SERVER_IP_OR_TEST_DOMAIN/api/health
docker compose -f docker-compose.staging.yml ps
docker compose -f docker-compose.staging.yml logs --tail=100 app
```

Admin:

```text
http://SERVER_IP_OR_TEST_DOMAIN/admin/login
```

Rotate the seed admin password after the first successful login.

## PostgreSQL Migration Path

The app currently runs on SQLite for the working product. PostgreSQL artifacts are included for the migration path. A PostgreSQL adapter/rehearsal script is present, but the live app should stay on SQLite until rehearsal and a PostgreSQL smoke run pass in a real PostgreSQL environment.

The hand-written PostgreSQL schema starter is at:

```text
database/postgres/schema.sql
```

The generated full table inventory is at:

```text
database/postgres/schema.generated.sql
```

Regenerate it from the live app schema with:

```bash
npm run db:schema:postgres
```

Check PostgreSQL migration readiness:

```bash
npm run db:postgres:check
```

Admin status page:

```text
/admin/database
```

Export current SQLite content to JSON:

```bash
npm run db:export:postgres
```

Run a rehearsal against a non-production PostgreSQL database:

```bash
POSTGRES_REHEARSAL_CONFIRM=true POSTGRES_IMPORT_JSON=backups/postgres-import-0000000000000.json npm run db:postgres:rehearse
```

The rehearsal creates a separate schema such as `tm_rehearsal_...`, applies `database/postgres/schema.generated.sql`, and imports the exported JSON rows with `ON CONFLICT DO NOTHING`.

Do not switch production to `DATABASE_CLIENT=postgres` until:

- the rehearsal passes
- `pg` is installed from `package.json`
- a full smoke test passes against PostgreSQL
- backups and rollback are tested

## Realtime And Queue Worker

Workflow/chat realtime uses:

- WebSocket endpoint: `/api/workflow/realtime`
- Local in-process fanout for a single app instance
- Redis fanout key `tm:realtime:workflow` when `REDIS_URL` is configured
- Redis REST fanout key `tm:realtime:workflow` when `REDIS_REST_URL` and `REDIS_REST_TOKEN` are configured

For one server, the WebSocket path works without Redis. For multiple app instances or high newsroom concurrency, configure Redis before scaling horizontally.

Newsletter sending and future background work use the `job_queue` table.

Run locally:

```bash
node worker.js
```

With systemd, install both service templates:

```text
infra/systemd/tech-magazine.service
infra/systemd/tech-magazine-worker.service
```

## Production Media Storage

Local uploads are supported for development and first internal testing, but launch readiness blocks local disk storage for high-traffic production.

For the DigitalOcean VPS deployment, use:

- `MEDIA_STORAGE_PROVIDER=digitalocean-spaces`

Then set:

- `DO_SPACES_NAME`
- `DO_SPACES_REGION`
- `DO_SPACES_ACCESS_KEY_ID`
- `DO_SPACES_SECRET_ACCESS_KEY`
- `DO_SPACES_CDN_BASE_URL`, or a custom `MEDIA_CDN_BASE_URL`

DigitalOcean Spaces is S3-compatible, so the app uses the same signed S3 upload flow internally while exposing a clear `digitalocean-spaces` provider in the admin. Before launch, `/api/media/optimization` must report `productionReady: true`. Keep `MEDIA_SCAN_MODE=webhook` with `MEDIA_SCANNER_WEBHOOK_URL`, or use a trusted provider scanning policy, for high-volume public uploads.

## Video Platform Delivery

The Video Platform System supports standalone video pages, playlists, categories, video SEO metadata, HLS/DASH URLs, subtitles, PiP controls, bookmarks, and engagement telemetry.

For DigitalOcean VPS production video:

- Set `VIDEO_STREAMING_PROVIDER=digitalocean-hls`
- Set `VIDEO_TRANSCODER_MODE=ffmpeg` for self-hosted FFmpeg processing, or `managed` if a managed transcoder is connected
- Set `FFMPEG_PATH` to the installed binary path when using self-hosted transcoding
- Keep `MEDIA_STORAGE_PROVIDER=digitalocean-spaces` so HLS manifests, segments, thumbnails, subtitles, and MP4 assets live in Spaces/CDN

Before calling Section 7 production-ready, `/api/videos/platform` must report adaptive delivery ready and the video CDN path must pass a real upload/playback test.

## Reverse Proxy

Put NGINX, Caddy, or Cloudflare Tunnel in front of the app.

Recommended:

- Enable HTTPS.
- Proxy to `127.0.0.1:8000`.
- Set `SITE_URL=https://your-domain.com`.
- Set `TRUST_PROXY=true`.

Included NGINX templates:

```text
infra/nginx/tech-magazine.conf
infra/nginx/tech-magazine-compose.conf
```

Use `tech-magazine.conf` for a server install where NGINX proxies to `127.0.0.1:8000`. Use `tech-magazine-compose.conf` for Docker Compose where NGINX proxies to the `app` service.

## Kubernetes

Manifests live in:

```text
infra/kubernetes/
```

Apply order:

```bash
kubectl apply -f infra/kubernetes/namespace.yaml
kubectl apply -f infra/kubernetes/storage.yaml
kubectl apply -f infra/kubernetes/configmap.yaml
kubectl apply -f infra/kubernetes/secret.example.yaml
kubectl apply -f infra/kubernetes/app.yaml
kubectl apply -f infra/kubernetes/worker.yaml
kubectl apply -f infra/kubernetes/ingress.yaml
```

Before production, copy `secret.example.yaml`, replace secrets, and do not commit the real secret file.

## Backups

Admin backup page:

```text
/admin/backup
```

Backups include:

- SQLite `.db` copy
- JSON export of core content, articles, subscribers, media, and ads

Store server backups off-machine before production traffic.

## Operations Panel

The Super Admin Operations Panel is available at:

```text
/admin/operations
```

It includes:

- server health
- feature toggles
- cache status and clear action
- queue monitoring
- API usage snapshot
- recent security events
- recent backups

## Analytics Integrations

The public site and admin support:

- Google Analytics 4
- Google Tag Manager
- Google Search Console verification
- Matomo

Set the values in `.env`:

```text
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
SEARCH_CONSOLE_VERIFICATION=...
MATOMO_URL=https://analytics.your-domain.com
MATOMO_SITE_ID=1
```

The server injects verification and analytics tags into the first HTML response, and the client tracks SPA route changes after navigation. Admin status endpoints:

```text
/admin/analytics
/api/analytics/integrations
```

## Firebase Server Push

Browser/mobile push public config is already exposed through:

```text
/api/firebase/config
```

Server-side push delivery is switch-ready. Add one of these to the private `.env` after Firebase service account setup:

```text
FIREBASE_SERVICE_ACCOUNT_JSON={...}
```

Or:

```text
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

Admin/API status:

```text
/admin/notifications
/api/push/status
```

## Dummy Email Mode

Email is currently configured for local dummy mode:

```text
EMAIL_PROVIDER=dummy
EMAIL_FROM=dummy@techmag.local
```

Password reset and newsletter campaign emails are written to the CMS email outbox:

```text
/admin/email-outbox
```

Nothing is sent outside the app until a real provider is configured.

## Real Email Providers

The email adapter supports:

- `dummy`
- `sendgrid`
- `brevo`
- `ses`

Provider status is available in the admin at:

```text
/admin/email-outbox
```

And through the admin API:

```text
/api/email/status
```

After domain DNS is ready, switch one provider in `.env`:

```text
EMAIL_PROVIDER=sendgrid
EMAIL_FROM=news@your-domain.com
EMAIL_REPLY_TO=editorial@your-domain.com
SENDGRID_API_KEY=...
```

Or:

```text
EMAIL_PROVIDER=brevo
EMAIL_FROM=news@your-domain.com
EMAIL_REPLY_TO=editorial@your-domain.com
BREVO_API_KEY=...
```

Or:

```text
EMAIL_PROVIDER=ses
EMAIL_FROM=news@your-domain.com
EMAIL_REPLY_TO=editorial@your-domain.com
SES_REGION=us-east-1
SES_ACCESS_KEY_ID=...
SES_SECRET_ACCESS_KEY=...
```

Newsletter campaigns and password recovery emails write to the outbox first. In real provider mode, the worker sends queued outbox records and stores provider message IDs or delivery errors.

## Payment Mode

Memberships currently run without a payment gateway:

```text
PAYMENT_PROVIDER=none
```

The membership flow creates a manual active subscription for testing and does not charge cards.

## Email Later

After domain and server setup:

1. Choose provider: SendGrid, Brevo, Mailchimp, or Amazon SES.
2. Verify sender domain.
3. Add SPF/DKIM/DMARC DNS records.
4. Fill provider keys in `.env`.
5. Restart the app and worker.
6. Queue a test email from `/admin/email-outbox`.
