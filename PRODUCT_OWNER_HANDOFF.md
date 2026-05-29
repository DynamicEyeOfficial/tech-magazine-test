# Tech Magazine Product Owner Handoff

## 1. Product Summary

Tech Magazine is a professional IT magazine and technology media platform. It is designed to work as a complete digital newsroom, not only as a simple blog.

The platform supports:

- Public technology news website
- Admin and editorial dashboard
- Content management system
- Multi-role newsroom workflows
- Reader accounts and community features
- News importing with source controls and risk inspection
- Search, SEO, analytics, monetization, media, events, jobs, startups, devices, podcasts, videos, and reviews
- Mobile-app-ready API structure

The business goal is to become a scalable technology media platform similar in ambition to TechCrunch, The Verge, Wired, Ars Technica, and Technology Magazine, with room to expand into newsletters, mobile apps, memberships, events, and media products.

## 2. Business Purpose

The platform is built to publish and manage technology content across multiple formats:

- Breaking news
- Editorial articles
- Reviews
- Tutorials
- AI and cybersecurity coverage
- Startup coverage
- Gaming and hardware coverage
- Events and conferences
- Jobs and career content
- Podcasts and video content
- Device and product databases

The long-term business model can include:

- Advertising
- Sponsored content
- Affiliate links
- Premium memberships
- Newsletter sponsorships
- Events
- Job board revenue
- Partner syndication/API access

Payment gateways are intentionally not enabled yet. They can be added later.

## 3. Platform Surfaces

### Public Client Website

The public website is for readers. It includes:

- Homepage
- Breaking news
- Featured stories
- Trending articles
- Latest news
- Search
- Sections/categories
- Article pages
- Videos
- Podcasts
- Reviews
- Live events
- Events
- Jobs
- Startups
- Devices
- Community
- Newsletter
- Membership page
- Reader profile
- Notifications
- Leaderboard
- Multi-language controls
- Dark/light mode

The public website must never expose admin controls or admin signup.

### Admin Dashboard

The admin dashboard is separate from the public client. It has sign-in only. Admin users are created from inside the admin dashboard.

Admin includes:

- Dashboard overview
- Article manager
- Article editor
- News importer
- News inspection queue
- Source performance dashboard
- Workflow and approvals
- Homepage management
- Breaking news
- Live blogs
- Video CMS
- Podcast CMS
- Reviews
- Devices
- AI assistant
- Site CMS
- Monetization
- Ads
- Affiliates
- Memberships
- Events
- Jobs
- Startups
- Directory
- Community moderation
- Media library
- Comments
- Subscribers
- Newsletter campaigns
- Notifications
- Email outbox
- Users
- Roles and privileges
- Categories
- Tags
- Audit logs
- Backups
- Analytics
- SEO
- Languages
- API management
- Database status
- Launch readiness
- Security
- Operations

## 4. What Has Been Built

### Core Platform

- Public website and admin dashboard are separated.
- Admin has login only, no public signup.
- Users and roles are managed inside admin.
- Role permissions exist and can be searched/managed.
- Public articles, categories, tags, author pages, article pages, search, comments, bookmarks, reader profile, and newsletter features exist.

### CMS and Editorial Workflow

- Articles can be created, edited, duplicated, archived, soft deleted, restored, scheduled, and reviewed.
- Workflow statuses exist: draft, pending review, approved, scheduled, published, rejected, archived.
- Editorial workflow includes assignments, approvals, tasks, calendar, shifts, notes, internal newsroom messages, and productivity tracking.
- Live workflow updates use WebSocket support.

### News Importing

- Automatic technology news import system exists.
- Source quality controls exist in admin.
- Admin can enable/disable sources.
- Admin can set source priority.
- Admin can set source trust level.
- Admin can exclude keywords.
- Admin can require inspection for risky keywords.
- Imported news can go to published, draft, or pending review depending on risk/source rules.
- Source performance dashboard shows source metrics.

### Reader and Community

- Reader account login/register exists.
- Reader profile exists.
- Bookmarks/saved articles exist.
- Follow authors exists.
- Community topics, replies, votes, polls, reputation, and leaderboard exist.
- Reader notifications exist.

### Media and Content Modules

- Media library exists.
- Image/audio/video upload handling exists.
- Video platform section exists.
- Podcast section exists.
- Review engine exists.
- Device database exists.
- Events system exists.
- Job board exists.
- Startup directory exists.
- Directory/marketplace style expansion area exists.

### SEO, Search, Analytics, Security

- SEO metadata, schema, sitemap, robots, AMP, internal links, and SEO preview APIs exist.
- Search supports filters, semantic-style discovery, suggestions, trending searches, and pagination.
- Analytics dashboards and event tracking exist.
- Security dashboard, audit logs, CSRF protection, rate limiting, sessions, 2FA hooks, and compliance/consent tools exist.

### Pagination and Rate Limiting

- Public APIs return pagination metadata.
- Admin tables have pagination controls.
- Search has pagination.
- Public read/search APIs have rate limiting.
- Rate limiting was verified.

## 5. Current Test Links

Important: `127.0.0.1` and `localhost` only work on the same laptop where the server is running. They will not open from the product owner's PC.

For someone on another PC, use one of these options:

### Option A: Temporary Public Tunnel

Use this when the platform is still running from the developer laptop.

Current tunnel URL:

```text
https://tear-bowl-den-gradually.trycloudflare.com
```

Product owner links:

- Public client: https://tear-bowl-den-gradually.trycloudflare.com/?cache=23
- Admin login: https://tear-bowl-den-gradually.trycloudflare.com/admin/login
- Admin dashboard: https://tear-bowl-den-gradually.trycloudflare.com/admin
- Search test: https://tear-bowl-den-gradually.trycloudflare.com/#/search?page=1&limit=3
- Health check: https://tear-bowl-den-gradually.trycloudflare.com/api/health
- Bootstrap API: https://tear-bowl-den-gradually.trycloudflare.com/api/bootstrap?page=2&limit=5
- Search API: https://tear-bowl-den-gradually.trycloudflare.com/api/search?query=ai&page=1&limit=3
- Events API: https://tear-bowl-den-gradually.trycloudflare.com/api/events?page=1&limit=2

Tunnel links are temporary unless a permanent tunnel/domain is configured. If the laptop sleeps, shuts down, loses internet, or the tunnel stops, the links stop working.

### Option B: Same Wi-Fi / Local Network Testing

Use this only if the product owner is connected to the same Wi-Fi/network.

Replace `DEVELOPER_LAPTOP_IP` with the laptop's local network IP address.

- Public client: `http://DEVELOPER_LAPTOP_IP:8000/?cache=23`
- Admin login: `http://DEVELOPER_LAPTOP_IP:8000/admin/login`
- Admin dashboard: `http://DEVELOPER_LAPTOP_IP:8000/admin`

Windows Firewall may need to allow port `8000`.

### Option C: Proper Staging Server

Use this for serious QA.

Replace `STAGING_URL` with the deployed server URL.

- Public client: `STAGING_URL/?cache=23`
- Admin login: `STAGING_URL/admin/login`
- Admin dashboard: `STAGING_URL/admin`
- Health check: `STAGING_URL/api/health`

This is the recommended setup when the product owner needs stable access without depending on the developer laptop.

### Local Developer Links

These links work only on the developer laptop itself:

- Public client: http://127.0.0.1:8000/?cache=23
- Admin login: http://127.0.0.1:8000/admin/login
- Admin dashboard: http://127.0.0.1:8000/admin
- Search test: http://127.0.0.1:8000/#/search?page=1&limit=3
- Health check: http://127.0.0.1:8000/api/health
- Bootstrap API: http://127.0.0.1:8000/api/bootstrap?page=2&limit=5
- Search API: http://127.0.0.1:8000/api/search?query=ai&page=1&limit=3
- Events API: http://127.0.0.1:8000/api/events?page=1&limit=2

## 6. Test Accounts

### Full Admin

- Email: admin@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- 2FA code: leave empty unless 2FA is enabled later

### Editor

- Email: editor@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- 2FA code: leave empty unless 2FA is enabled later

### Reader

- Email: reader@test.local
- Password: reader12345

These are testing credentials only. They must be changed before real production launch.

## 7. Product Owner Test Mission

The product owner should test the platform as a real business product, not only as a developer checklist.

The product owner should confirm:

- The platform makes sense as a technology magazine.
- The public website is readable, professional, and easy to navigate.
- The admin dashboard supports real newsroom work.
- Permissions make sense for each role.
- Every important action gives a clear result.
- No admin features leak into the client website.
- Imported news is controlled and does not publish bad/risky content automatically.
- Pagination and filtering work on large lists.
- The product is understandable for editors, writers, admins, and readers.

## 8. Public Website Test Flow

### Homepage

Test:

- Open the public client.
- Check hero/featured stories.
- Check breaking news banners.
- Check latest stories.
- Check trending section.
- Check sponsored/ad areas.
- Check live ticker.
- Check dark/light mode.
- Check language selector.
- Check mobile responsiveness.

Expected:

- Homepage looks like a serious technology media website.
- No test junk such as "Audit Category", "Smoke", or QA labels appears.
- Navigation is clean.
- No admin link or admin signup is visible.

### Search

Test:

- Open search.
- Search for "AI".
- Test category filter.
- Test tag filter.
- Test author filter.
- Test date filters.
- Test sort by newest/popular/relevance.
- Test pagination.

Expected:

- Results update correctly.
- Pagination shows page, total, previous/next.
- No layout overflow.

### Article Page

Test:

- Open multiple articles.
- Check title, subtitle, category, author, date, reading time.
- Check hero image.
- Check body formatting.
- Check code/table/quote support where available.
- Test share buttons.
- Test bookmark after reader login.
- Test comments.
- Test related articles.
- Test reading progress bar.

Expected:

- Article reads professionally.
- Share/bookmark/comment actions are understandable.
- Related content is relevant enough for a first version.

### Reader Account

Test:

- Sign in with reader@test.local.
- Update profile.
- Bookmark articles.
- Follow an author.
- Check saved articles.
- Check notifications.
- Check leaderboard/progress.

Expected:

- Reader account feels separate from admin.
- Reader cannot access admin dashboard.

### Community

Test:

- Open community.
- Create topic.
- Reply to topic.
- Vote.
- Check polls.

Expected:

- Community interactions work.
- Moderation can still be handled in admin.

### Media Modules

Test:

- Videos page
- Podcasts page
- Reviews page
- Devices page
- Events page
- Jobs page
- Startups page

Expected:

- Each page has real structure and clear purpose.
- Detail pages open correctly.
- Empty or thin areas should be listed as product backlog, not treated as broken unless a button fails.

## 9. Admin Dashboard Test Flow

### Login and Separation

Test:

- Go to admin login.
- Login as admin.
- Logout.
- Login as editor.

Expected:

- Admin login works.
- No admin signup exists.
- Admin and public client remain separate.

### Articles and CMS

Test:

- Create article.
- Save draft.
- Add SEO metadata.
- Add category and tags.
- Add featured image.
- Publish article.
- Schedule article.
- Duplicate article.
- Archive article.
- Soft delete and restore article.
- Check pagination on article manager.

Expected:

- Editorial actions are clear.
- Article appears on public side only when status allows it.

### Workflow

Test:

- Create assignment.
- Submit article for review.
- Approve/reject.
- Add editorial note.
- Create task.
- Create calendar item.
- Create shift.
- Send internal newsroom message.
- Check WebSocket/live workflow area.

Expected:

- Workflow supports a newsroom process.
- Role permissions make sense.

### News Importing

Test:

- Open News Imports.
- Enable/disable a source.
- Change priority.
- Add exclude keywords.
- Add inspection keywords.
- Set auto-publish risk threshold.
- Run/import news if available.
- Open inspection queue.
- Open source performance dashboard.

Expected:

- Risky stories go to inspection.
- Duplicates are controlled.
- Source metrics are visible.

### Users and Roles

Test:

- Create a new user.
- Assign role.
- Suspend user.
- Reactivate user.
- Create a new role.
- Search roles.
- Add/remove privileges.

Expected:

- Admin can manage newsroom users internally.
- Public users cannot self-register as admins.

### Media

Test:

- Upload image.
- Upload audio if needed.
- Upload video if needed.
- Check media card display.
- Rebuild responsive variants.
- Check media settings.

Expected:

- Media upload works locally.
- Production CDN/storage still needs final provider setup.

### Newsletter and Notifications

Test:

- Create newsletter subscriber from public site.
- Open subscribers in admin.
- Create newsletter campaign.
- Queue/send test email.
- Create notification.
- Send notification.

Expected:

- Local/dummy email flow works.
- Real sending requires production email provider/domain.

### Monetization

Test:

- Create ad placements.
- Create sponsor campaign.
- Create affiliate item.
- Check revenue dashboard.
- Check membership plans.

Expected:

- Business tools exist.
- Payment gateway is not active by design.

### SEO and Analytics

Test:

- Check SEO summary.
- Check article SEO preview.
- Check sitemap URLs.
- Check analytics dashboard.
- Check search analytics.

Expected:

- SEO infrastructure exists.
- Real Google/Search Console/Matomo data requires production accounts.

### Security and Operations

Test:

- Check audit logs.
- Check security page.
- Check sessions/device tracking.
- Check backup page.
- Check database status.
- Check launch readiness.
- Check operations dashboard.

Expected:

- Admin has operational visibility.
- Production backup/disaster recovery still needs server configuration.

## 10. Role Permission Test

### Admin

Admin should access everything.

Test:

- Users
- Roles
- Security
- Settings
- Site CMS
- Articles
- Media
- News imports
- Analytics
- Operations

Expected:

- Full access.

### Editor

Editor should access editorial areas but not global admin operations.

Test:

- Login as editor@techmag.local.
- Try articles/workflow/comments/subscribers.
- Try users/roles/security/global settings.

Expected:

- Editorial areas are allowed.
- Full admin-only areas are blocked.

### Reader

Reader should access only public reader features.

Test:

- Login as reader.
- Try profile, bookmarks, comments, community.
- Try opening /admin.

Expected:

- Reader cannot access admin.

## 11. API Test Flow

Open:

- http://127.0.0.1:8000/api/health
- http://127.0.0.1:8000/api/bootstrap?page=2&limit=5
- http://127.0.0.1:8000/api/search?query=ai&page=1&limit=3
- http://127.0.0.1:8000/api/events?page=1&limit=2
- http://127.0.0.1:8000/api/jobs?page=1&limit=2
- http://127.0.0.1:8000/api/startups?page=1&limit=2
- http://127.0.0.1:8000/api/devices?page=1&limit=2
- http://127.0.0.1:8000/api/videos?page=1&limit=2
- http://127.0.0.1:8000/api/podcasts?page=1&limit=2
- http://127.0.0.1:8000/api/reviews?page=1&limit=2

Expected:

- APIs return JSON.
- List APIs return pagination.
- Search is rate-limited if abused.

## 12. Known Production Dependencies

These are not local bugs. They require real production accounts/configuration:

- Domain name
- SSL certificate
- VPS or cloud server
- Redis
- Production database decision, ideally PostgreSQL for scale
- Email provider such as Brevo, SendGrid, Amazon SES, or SMTP
- Firebase production push notification configuration
- Google Analytics
- Search Console
- Google News setup
- CDN/media storage such as DigitalOcean Spaces, Cloudflare R2, or S3
- OpenAI API key stored securely in environment variables
- Real backup storage
- Monitoring/logging setup

## 13. Laptop / Online Availability Answer

If the platform is only running locally at http://127.0.0.1:8000, then it works only on the same laptop.

For another person to test from another device, one of these must happen:

### Option A: Local Testing Only

Keep the laptop on.
Keep the server running.
The product owner must be on the same machine, or use a temporary tunnel.

### Option B: Temporary Public Testing

Keep the laptop on.
Keep the local server running.
Keep the tunnel running.
Send the tunnel URL to the product owner.

If the laptop sleeps, shuts down, loses internet, or the tunnel stops, the product owner loses access.

### Option C: Proper Staging Server

Deploy the platform to a testing VPS.
Then the product owner can test any time without your laptop staying on.

This is the recommended next step for serious QA.

## 14. Recommended Product Owner Output

The product owner should return a report with:

- Critical bugs
- Confusing flows
- Missing business requirements
- UI/UX problems
- Permission problems
- Content quality notes
- Mobile issues
- Admin workflow issues
- Launch blockers
- Nice-to-have improvements

Use this severity:

- P0: Blocks testing or launch
- P1: Major business/user issue
- P2: Important improvement
- P3: Nice-to-have

## 15. Launch Readiness Decision

The platform is ready for product-owner QA as a working staging-style product.

It is not yet a real public production launch until:

- It is deployed to a VPS/cloud server.
- Production domain and SSL are configured.
- Email/push/CDN/analytics providers are connected.
- Production credentials are changed.
- Backups and monitoring are configured.
- Final browser QA is done on the deployed URL.

