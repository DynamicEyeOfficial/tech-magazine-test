# Tech Magazine Launch Checklist

## Current Status

- Public magazine website is built.
- Node + SQLite backend is working.
- Admin CMS is working.
- Media uploads are working locally; production media requires cloud storage/CDN credentials.
- Rich article editor is working.
- Editorial workflow is working.
- SEO/sponsored/ad controls are working.
- Security hardening and backups are working.
- Docker/deployment files are prepared.
- Operations panel is working.
- Infrastructure preflight is available.

## Before Server Deployment

- Change seeded admin password after first login.
- Copy `.env.example` to `.env`.
- Set `NODE_ENV=production`.
- Set `HOST=0.0.0.0`.
- Set `SITE_URL=https://your-domain.com`.
- Set `TRUST_PROXY=true` if behind NGINX, Caddy, Cloudflare, or a load balancer.
- Confirm `DATABASE_PATH`, `BACKUP_DIR`, and upload storage paths.
- Set `MEDIA_STORAGE_PROVIDER=digitalocean-spaces` before production traffic.
- Set `DO_SPACES_NAME`, `DO_SPACES_REGION`, `DO_SPACES_ACCESS_KEY_ID`, `DO_SPACES_SECRET_ACCESS_KEY`, and `DO_SPACES_CDN_BASE_URL`.
- Set `MEDIA_SCAN_MODE=webhook` with `MEDIA_SCANNER_WEBHOOK_URL`, or use a trusted provider scanning policy.
- For adaptive video delivery, set `VIDEO_STREAMING_PROVIDER=digitalocean-hls` and configure `VIDEO_TRANSCODER_MODE=ffmpeg` or `managed`.
- If using self-hosted HLS transcoding on the VPS, install FFmpeg and set `FFMPEG_PATH`.
- Run `npm run check`.
- Run `npm run infra:check`.
- Run `npm run preflight`.
- Run `npm run launch:check`.
- Run `npm run db:postgres:check`.
- Run `npm run db:export:postgres`.
- Run `POSTGRES_REHEARSAL_CONFIRM=true POSTGRES_IMPORT_JSON=<export-file> npm run db:postgres:rehearse` in a non-production PostgreSQL database.
- Run `npm run smoke` while the app is running.

## Server Setup

- Install Node 24+ or use Docker.
- Configure a reverse proxy to the app port.
- Enable HTTPS/SSL.
- Point the domain DNS to the server.
- Set firewall rules for HTTP/HTTPS only.
- Keep the app behind the reverse proxy, not directly exposed if possible.
- Configure process management with Docker, systemd, PM2, or hosting platform restart policy.
- If using Docker Compose, enable the proxy profile only after domain routing is ready.
- If using systemd, install both the web app and worker service templates.

## Data And Backups

- Use `/admin/backup` before launch.
- Store backup files off the server.
- Schedule daily database backups.
- Include `data/`, `public/uploads/`, and `backups/` in the server backup plan while local uploads are in use.
- For production media, confirm cloud object storage lifecycle rules, CDN cache rules, and off-provider backups.
- Test restoring a copied `.db` before real traffic.
- Confirm `database/postgres/schema.generated.sql` covers the current live tables before any PostgreSQL migration phase.

## Public Website QA

- Homepage loads.
- Article page loads.
- Category pages load.
- Section pages load.
- Search works.
- Author pages load.
- Newsletter form saves.
- Comments submit for moderation.
- Sponsored labels display correctly.
- Ads display correctly.
- Mobile navigation works.
- Sitemap and robots.txt load.
- Google Analytics or Matomo IDs are configured if marketing tracking is required.
- Search Console verification is configured before indexing push.

## Admin CMS QA

- Admin login works.
- Dashboard loads.
- Article create/edit works.
- Rich editor preview works.
- Media upload works.
- `/api/media/optimization` reports `productionReady: true` only after cloud storage/CDN is configured and tested.
- Review queue actions work.
- Homepage controls save.
- Comment moderation works.
- Subscribers page loads.
- Ads page saves placements.
- Audit log records admin actions.
- Backup page creates `.db` and `.json`.
- Operations panel loads.
- Launch readiness page loads.
- Database readiness page loads.
- Feature toggles save.
- Cache clear works.
- Queue monitoring loads.
- API monitoring loads.
- Analytics integration status loads.
- Workflow realtime WebSocket connects at `/api/workflow/realtime`.
- Redis realtime fanout is configured and load-tested before horizontal scaling.

## Email Later

Do this only after domain/server setup:

- Choose provider: SendGrid, Brevo, Mailchimp, or Amazon SES.
- Verify sender domain.
- Add SPF DNS record.
- Add DKIM DNS records.
- Add DMARC DNS record.
- Add provider API key to `.env`.
- Set `EMAIL_PROVIDER`, `EMAIL_FROM`, and `EMAIL_REPLY_TO`.
- Restart the app and worker.
- Queue a test email from `/admin/email-outbox`.
- Send test campaign to internal emails first.

## Mobile App Later

- Keep using the same public API.
- Add token-based auth endpoints for saved articles/profile.
- Add pagination for feeds.
- Add push notification preferences.
- Add Firebase service account credentials before server-side push launch.
- Use the same article/category/channel/media models from `MOBILE_APP_NOTES.md`.
