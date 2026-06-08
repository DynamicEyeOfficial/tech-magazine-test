# Tech Magazine Complete User And Developer Guides

Version: 2026-06-08  
Live staging URL: https://tech-magazine-test.onrender.com  
Repository: https://github.com/DynamicEyeOfficial/tech-magazine-test  
Render service: `tech-magazine-test`

This single file contains two guides:

1. Platform user guide for readers, newsroom users, editors, admins, and product owners.
2. Developer and deployment guide for engineers who will maintain, deploy, test, and extend the code.

The project is a professional technology media platform with a public news website, separated admin dashboard, CMS, editorial workflow, reader accounts, media modules, monetization modules, analytics, security, APIs, and production deployment path.

---

# Part 1 - Platform User Guide

## 1. Platform Purpose

Tech Magazine is a complete IT magazine and technology media platform. It is built to support technology news, AI coverage, cybersecurity, software, hardware, startups, gaming, cloud, reviews, tutorials, events, jobs, devices, podcasts, video, newsletters, community, and future mobile app experiences.

The platform is separated into two main products:

- Public client website: for readers, subscribers, members, and community users.
- Admin dashboard: for admins, editors, reporters, newsroom staff, commercial staff, and operators.

Public readers must never see admin-only controls. Admin users must sign in through the admin login page. There is no public admin sign-up.

## 2. Current Test Links

Use these current staging links:

- Public website: https://tech-magazine-test.onrender.com
- Reader account page: https://tech-magazine-test.onrender.com/#/account
- Reader notifications: https://tech-magazine-test.onrender.com/#/notifications
- Search: https://tech-magazine-test.onrender.com/#/search
- Example article: https://tech-magazine-test.onrender.com/#/article/ai-agents-newsroom-workflows
- Sections: https://tech-magazine-test.onrender.com/#/sections
- Feed: https://tech-magazine-test.onrender.com/#/feed
- IT Rooms: https://tech-magazine-test.onrender.com/#/it-rooms
- Videos: https://tech-magazine-test.onrender.com/#/videos
- Podcasts: https://tech-magazine-test.onrender.com/#/podcasts
- Reviews: https://tech-magazine-test.onrender.com/#/reviews
- Live coverage: https://tech-magazine-test.onrender.com/#/live
- Events: https://tech-magazine-test.onrender.com/#/events
- Jobs: https://tech-magazine-test.onrender.com/#/jobs
- Startups: https://tech-magazine-test.onrender.com/#/startups
- Devices: https://tech-magazine-test.onrender.com/#/devices
- Community: https://tech-magazine-test.onrender.com/#/community
- Leaderboard: https://tech-magazine-test.onrender.com/#/leaderboard
- Membership: https://tech-magazine-test.onrender.com/#/membership
- Newsletter: https://tech-magazine-test.onrender.com/#/newsletter
- Admin login: https://tech-magazine-test.onrender.com/admin/login
- Admin dashboard: https://tech-magazine-test.onrender.com/admin
- Health check: https://tech-magazine-test.onrender.com/api/health

## 3. Test Accounts And Password Policy

Admin passwords are intentionally not written into public documentation. They are stored privately in `.qa-admin-credentials.json` for local QA or in private Render environment variables for staging.

### Admin

- Login URL: https://tech-magazine-test.onrender.com/admin/login
- Email: `admin@techmag.local`
- Password: request from the project owner or retrieve from the private QA credentials file.
- Purpose: full platform control.

### Editor

- Login URL: https://tech-magazine-test.onrender.com/admin/login
- Email: `editor@techmag.local`
- Password: request privately.
- Purpose: editorial workflow, article review, homepage content, moderation, and publishing.
- Expected restriction: no access to high-risk admin-only sections such as users, roles, security, or infrastructure.

### Reporter

- Login URL: https://tech-magazine-test.onrender.com/admin/login
- Email: `po.reporter@techmag.local`
- Password: request privately.
- Purpose: reporter workflow, article drafting, assignments, and limited newsroom access.
- Expected restriction: no access to system administration.

### Second Reporter

- Login URL: https://tech-magazine-test.onrender.com/admin/login
- Email: `qa.reporter@techmag.local`
- Password: request privately.
- Purpose: assignment, collaboration, internal workflow, and reporter restriction testing.

### Reader

- URL: https://tech-magazine-test.onrender.com/#/account
- Readers can create accounts directly from the public account page.
- Suggested QA reader email format: `qa.reader.<date>@example.com`
- Suggested password: use a test password only. Do not reuse real personal passwords.

## 4. Roles And Privileges

### Visitor

Can:

- Browse the homepage.
- Read articles.
- Search and filter content.
- View videos, podcasts, reviews, live pages, jobs, events, startups, devices, sections, and community pages.
- Subscribe to newsletters.
- Use dark/light mode.
- Change language.
- Share articles.
- View public comments.

Cannot:

- Access the admin dashboard.
- Create articles.
- Manage users.
- Moderate content.
- Save private bookmarks without signing in.

### Reader

Can:

- Register and sign in from the public account page.
- Edit profile details.
- Save/bookmark articles.
- Follow authors.
- View notifications.
- Comment on content.
- Participate in community and polls.
- Use saved searches and reading personalization.
- View reader progress and leaderboard.

Cannot:

- Access admin dashboard.
- Publish newsroom content.
- Moderate other users.

### Subscriber Or Member

Can:

- Use reader account features.
- Subscribe to newsletter categories.
- View membership plans.
- Activate manual/test membership during staging.
- Access member journey surfaces.

Payment note:

- Payment gateways are not connected yet.
- Memberships are currently manual/test mode.

### Reporter

Can:

- Open permitted newsroom dashboard areas.
- Create or edit assigned content where allowed.
- Save drafts.
- Submit content to review.
- View assigned workflow items.
- Upload or use media if the role permits it.
- Participate in internal workflow.

Cannot:

- Manage all users.
- Manage roles.
- Access infrastructure/security operations.
- Publish directly unless permissions are expanded.

### Writer Or Senior Writer

Can:

- Create articles.
- Work with drafts.
- Add SEO fields where permitted.
- Suggest featured content.
- Use media and CMS controls where permitted.
- Collaborate with editors.

Cannot by default:

- Manage platform security.
- Manage users and roles.
- Access infrastructure operations.

### Editor

Can:

- Review submitted content.
- Approve or reject articles.
- Edit newsroom content.
- Manage comments.
- Manage homepage editorial placements.
- Use workflow, review queues, notes, and internal messages.
- Manage categories/tags if permission is granted.

Cannot by default:

- Access super admin infrastructure settings.
- Create unrestricted system users.
- Change security policies unless explicitly granted.

### Chief Editor

Can:

- Control editorial strategy.
- Manage multi-step approval flow.
- Use emergency publishing.
- Schedule publications.
- Monitor newsroom productivity.
- Manage live coverage and breaking news priority.

Cannot by default:

- Change low-level deployment or infrastructure settings unless also admin.

### Admin

Can:

- Access all admin dashboard areas.
- Create users.
- Create roles and assign privileges.
- Manage articles, workflow, media, newsletters, monetization, analytics, SEO, languages, operations, security, APIs, and settings.
- Run backup and operational checks.
- Manage source import risk controls.

### Super Admin

Can:

- Do everything an admin can do.
- Manage infrastructure-oriented settings and platform-wide operations.
- Review launch readiness.
- Manage feature toggles and security policies.

## 5. Public Website Pages And Controls

### Home - `#/`

Purpose:

- Main reader entry point.
- Shows breaking news, live ticker, featured stories, trending content, latest feeds, categories, ads, marketing banners, recommendations, and editorial highlights.

Important controls:

- Top navigation links.
- Mega menu/sections area.
- Dark/light toggle.
- Language selector.
- Reader account links: Sign in, Sign up, Profile, Log out.
- Notification bell.
- Breaking banner link.
- Live ticker links.
- Hero story read button.
- Category explore buttons.
- Sponsored/advertising calls to action.
- Footer links.

Expected behavior:

- No empty large spaces.
- No admin controls.
- Responsive on mobile.
- Theme and language choices persist.

### Search - `#/search`

Purpose:

- Search articles, videos, podcasts, authors, categories, tags, reviews, jobs, events, devices, and other indexed content.

Controls:

- Keyword input.
- Category filter.
- Author filter.
- Tag/date/popularity/type filters.
- Sorting.
- Suggested searches.
- Trending searches.
- Voice search test path.
- Save search button for signed-in readers.
- Pagination previous/next controls.

Expected behavior:

- Results update when filters change.
- Pagination works.
- Saved searches require reader sign-in.

### Sections - `#/sections`

Purpose:

- Browse all topic desks and editorial categories.

Controls:

- Category cards.
- Section links.
- Video, podcast, device, and feed cross-links.

Expected behavior:

- Each category opens the correct category or section page.
- The menu closes correctly after navigation.

### Category Pages - `#/category/{slug}`

Purpose:

- Show content for a single topic such as AI, Cybersecurity, Software, Hardware, Startups, Gaming, Cloud, Reviews, Tutorials, or Enterprise Tech.

Controls:

- Popular story links.
- Feed link.
- Alert preferences.
- Newsletter topic link.
- Tag links.
- Search links.

### Article Pages - `#/article/{slug}`

Purpose:

- Full news article reading experience.

Visible elements:

- Title.
- Subtitle.
- Category.
- Author.
- Publish date.
- Reading time.
- Hero image.
- Trust panel.
- Article content.
- Code blocks, quotes, tables, polls, embeds where available.
- Tags.
- Related articles.
- Author box.
- Comments.
- Reading progress bar.

Controls:

- Share to Facebook.
- Share to X.
- Share to LinkedIn.
- Share to WhatsApp.
- Share to Reddit.
- Share to Telegram.
- Bookmark/save article.
- Newsletter link.
- Trust/correction links.
- Comment form.
- Comment vote/report controls.
- Membership links when content is premium/manual mode.

Expected behavior:

- Published articles display publicly.
- Drafts and archived articles do not show as normal public content.
- Bookmarking requires reader sign-in.

### Author Pages - `#/author/{id}`

Purpose:

- Show journalist profile, expertise, bio, social/contact links, published content, and follow controls.

Controls:

- Follow author.
- Contact desk if configured.
- Article list.

### Feed - `#/feed`

Purpose:

- Personalized content stream blending articles, rooms, media, followed authors, and community activity.

Controls:

- Type filter.
- Category filter.
- Feed cards.
- Open IT Rooms.
- Reader profile link.
- Search all content.

### IT Rooms - `#/it-rooms` and `#/it-rooms/{slug}`

Purpose:

- Topic-specific community/workspace rooms for technology conversations and grouped content.

Controls:

- Room cards.
- Room details.
- Related feed links.
- Community actions.

### Videos - `#/videos`, `#/video/{slug}`

Purpose:

- Video platform for technology explainers, reviews, interviews, and playlists.

Controls:

- Video cards.
- Category and playlist links.
- Video playback surfaces.
- Bookmark video.
- Related video suggestions.
- Video SEO/trust details where available.

### Podcasts - `#/podcasts`, `#/podcast/{slug}`, `#/podcast-episode/{slug}`

Purpose:

- Podcast network, shows, episodes, audio player, transcripts, and RSS distribution.

Controls:

- Podcast channel cards.
- Episode cards.
- Audio playback controls.
- Subscribe/download/RSS paths.
- Bookmark episode.

### Reviews - `#/reviews`, `#/review/{slug}`, `#/reviews-compare/{slug}`

Purpose:

- Product reviews and comparison engine.

Controls:

- Review cards.
- Ratings.
- Pros/cons.
- Specs.
- Comparison links.
- Affiliate links where configured.

### Live Coverage - `#/live`, `#/live/{slug}`

Purpose:

- Breaking news and event live blog coverage.

Controls:

- Live event cards.
- Timestamped live updates.
- Comments/reactions.
- Auto-refresh/live feed behavior.

### Events - `#/events`, `#/event/{slug}`

Purpose:

- Technology events, conferences, speakers, agendas, registration, and live coverage.

Controls:

- Event cards.
- Detail page.
- Register/RSVP.
- Calendar link.
- Speaker/agenda sections.

### Jobs - `#/jobs`, `#/job/{slug}`

Purpose:

- Tech job board and career platform.

Controls:

- Job cards.
- Filters.
- Job alert creation.
- Apply form.
- Company/recruiter information.

### Startups - `#/startups`, `#/startup/{slug}`

Purpose:

- Startup directory and startup profile area.

Controls:

- Startup cards.
- Founder/funding/profile links.
- Related content.

### Devices - `#/devices`, `#/device/{slug}`, `#/compare/{slug}`

Purpose:

- Device database, specifications, benchmarks, and comparisons.

Controls:

- Device cards.
- Product specs.
- Benchmark sections.
- Comparison tools.

### Newsletter - `#/newsletter`

Purpose:

- Audience growth and subscriber capture.

Controls:

- Newsletter signup form.
- Category/segment choices.
- Unsubscribe path.
- Campaign previews.
- Alert preferences links.

### Membership - `#/membership`

Purpose:

- Membership and premium access journey.

Controls:

- Plan cards.
- Subscribe buttons.
- Membership status.
- Commercial partner links.

Payment note:

- Current staging uses manual/no-payment mode.

### Community - `#/community`, `#/community/{topic}`

Purpose:

- Reader discussions, topics, replies, polls, voting, and moderation flow.

Controls:

- Create topic.
- Reply.
- Vote.
- Poll participation.
- Report/moderation paths.

### Leaderboard - `#/leaderboard`

Purpose:

- Gamification, reputation, badges, reading streaks, and active community ranking.

Controls:

- Leaderboard filters or user cards.
- Profile links.

### Notifications - `#/notifications`

Purpose:

- Reader alert center and notification preferences.

Controls:

- Notification list.
- Preference toggles.
- Category/followed author alert settings.
- Device registration path.

### Reader Account - `#/account`

Purpose:

- Reader sign in, sign up, profile, saved articles, following, progress, and log out.

Controls:

- Sign in form.
- Create account form.
- Profile name/avatar/bio fields.
- Update profile.
- Saved articles.
- Followed authors.
- Reader progress.
- Log out.

### Static And Trust Pages

Routes:

- `#/about`
- `#/contact`
- `#/authors`
- `#/trust-center`
- `#/advertise`
- `#/media-kit`
- `#/careers`
- `#/editorial`
- `#/editorial-team`
- `#/ethics`
- `#/privacy`
- `#/cookies`
- `#/terms`

Purpose:

- Brand, business, editorial standards, contact, advertising, careers, legal, cookie, and trust information.

## 6. Admin Dashboard Pages And Controls

Admin URL: https://tech-magazine-test.onrender.com/admin/login

Admin users must sign in. There is no admin sign-up. Admin-created users receive roles and privileges from inside the dashboard.

### Admin Login - `/admin/login`

Controls:

- Email field.
- Password field.
- 2FA code field when enabled.
- Sign in button.
- Password recovery path.

Expected behavior:

- `/admin` redirects to login when logged out.
- No credentials are displayed to logged-out users.

### Dashboard Home - `/admin`

Purpose:

- Main operations overview.

Controls and widgets:

- Total articles.
- Published today.
- Pending approvals.
- Trending articles.
- Subscriber growth.
- Traffic/analytics overview.
- Active writers.
- Quick links to major modules.

### Articles - `/admin/articles`

Purpose:

- Article manager and CMS list.

Controls:

- Create article.
- Search/filter.
- Pagination.
- Status filters.
- Edit.
- Duplicate.
- Archive.
- Restore.
- Publish.
- Schedule.
- Draft management.

### New Article / Editor - `/admin/articles/new`

Purpose:

- Create or edit article content.

Controls:

- Title.
- Subtitle.
- Slug.
- Excerpt.
- Content editor.
- Rich text/block controls.
- Markdown/HTML support.
- Category.
- Tags.
- Featured image.
- SEO title.
- SEO description.
- Canonical URL.
- OG image.
- Publish status.
- Schedule date.
- Expiration date.
- Auto-save.
- Save draft.
- Submit for review.
- Publish.

### Workflow - `/admin/workflow`

Purpose:

- Newsroom workflow, approvals, assignments, editorial notes, and internal collaboration.

Controls:

- Assignment form.
- Task form.
- Approval queue.
- Calendar item form.
- Shift form.
- Editorial notes.
- Internal newsroom message form.
- Message feed.
- WebSocket real-time updates.
- Status filters.
- Deadline management.

### Homepage Management - `/admin/homepage`

Purpose:

- Control public homepage layout and editorial placements.

Controls:

- Featured stories.
- Trending/manual picks.
- Homepage blocks.
- Marketing banners.
- Sponsored blocks.
- Scheduling controls.

### Breaking News - `/admin/breaking-news`

Purpose:

- Publish urgent news banners and alerts.

Controls:

- Create breaking alert.
- Priority.
- Link target.
- Homepage override.
- Push/email alert paths.
- Enable/disable banner.

### Live Blogs - `/admin/live-blogs`

Purpose:

- Manage live coverage events and timestamped updates.

Controls:

- Create live event.
- Add live update.
- Manage comments.
- Event status.
- Conference coverage details.

### Videos - `/admin/videos`

Purpose:

- Video CMS and multimedia publishing.

Controls:

- Video page creation.
- Categories.
- Playlists.
- Thumbnails.
- Video metadata.
- HLS/DASH URL fields.
- Subtitle/caption fields.
- Featured video placement.
- Video analytics.

### Podcasts - `/admin/podcasts`

Purpose:

- Podcast shows, channels, episodes, RSS, and audio publishing.

Controls:

- Create podcast show.
- Create episode.
- Upload/audio URL.
- Episode metadata.
- RSS feed fields.
- Transcript fields.
- Podcast analytics.

### Reviews - `/admin/reviews`

Purpose:

- Product review and comparison management.

Controls:

- Create review.
- Rating.
- Pros/cons.
- Specs.
- Benchmarks.
- Comparison mapping.
- Affiliate link fields.

### Devices - `/admin/devices`

Purpose:

- Device database and comparison engine.

Controls:

- Create device.
- Add specs.
- Add benchmark data.
- Manage comparison data.
- Device categories.

### AI Assistant - `/admin/ai-assistant`

Purpose:

- AI editorial support.

Controls:

- AI summaries.
- SEO suggestions.
- Tag suggestions.
- Translation path.
- Automation summary.

Important:

- Requires private OpenAI API key in the server environment for real AI calls.

### Site CMS - `/admin/site-cms`

Purpose:

- Public website styling and content controls.

Controls:

- Brand colors.
- Banners.
- Marketing blocks.
- Homepage copy.
- Design settings.
- Public site widgets.

### Monetization - `/admin/monetization`

Purpose:

- Revenue and commercial operations.

Controls:

- Revenue summary.
- Manual revenue records.
- Sponsor operations.
- Paywall/manual membership mode.
- Video ad records.

### Ads - `/admin/ads`

Purpose:

- Advertisement placement management.

Controls:

- Banner ads.
- Native ads.
- Sidebar/in-feed placements.
- Scheduling.
- CPM/performance tracking.

### Affiliates - `/admin/affiliates`

Purpose:

- Affiliate marketing links and tracking.

Controls:

- Create affiliate partner.
- Link label.
- Commission note.
- Redirect/tracking link.
- Product review integration.

### Memberships - `/admin/memberships`

Purpose:

- Membership plans and subscriber access.

Controls:

- Create/edit plans.
- View member subscriptions.
- Premium/manual access controls.

### Events - `/admin/events`

Purpose:

- Events and conferences.

Controls:

- Create event.
- Speakers.
- Agenda.
- Sponsors.
- Registration.
- Live coverage links.

### Jobs - `/admin/jobs`

Purpose:

- Job board management.

Controls:

- Create job.
- Recruiter/company data.
- Featured jobs.
- Applications.
- Job alerts.

### Startups - `/admin/startups`

Purpose:

- Startup directory.

Controls:

- Startup profile.
- Founder profiles.
- Funding data.
- Ranking/category data.

### Directory - `/admin/directory`

Purpose:

- Manage broader ecosystem directory records.

Controls:

- Company/entity records.
- Type filters.
- Directory metadata.

### Community - `/admin/community`

Purpose:

- Community moderation and command center.

Controls:

- Topics.
- Replies.
- Polls.
- Reports.
- Moderation actions.
- Reputation/badge views.

### IT Rooms - `/admin/it-rooms`

Purpose:

- Admin management for IT Rooms.

Controls:

- Create room.
- Room category.
- Room moderation.
- Related content.

### Media - `/admin/media`

Purpose:

- Digital asset management.

Controls:

- Upload media.
- Media search.
- Folders/tags.
- Metadata editing.
- Rebuild variants.
- Image/video/audio handling.
- Optimization status.

### Comments - `/admin/comments`

Purpose:

- Comment moderation.

Controls:

- Approve.
- Reject.
- Delete/soft-delete.
- Report handling.
- Spam filtering path.

### Subscribers - `/admin/subscribers`

Purpose:

- Newsletter subscriber management.

Controls:

- Subscriber list.
- Status.
- Segments.
- Unsubscribe/verify status.

### Newsletter Campaigns - `/admin/newsletter/campaigns`

Purpose:

- Email campaign management.

Controls:

- Create campaign.
- Subject.
- Segment.
- Template/body.
- Schedule/manual send path.
- Campaign analytics.

### Notifications - `/admin/notifications`

Purpose:

- Mobile/browser notification system.

Controls:

- Create notification.
- Segment audience.
- Breaking news alert path.
- Device registration summary.
- Push provider status.

### Email Outbox - `/admin/email-outbox`

Purpose:

- Dummy/real email outbox.

Controls:

- View queued emails.
- Queue test email.
- Check provider status.

Important:

- Current staging uses dummy email mode. Real sending requires domain/email provider setup.

### Users - `/admin/users`

Purpose:

- Create and manage admin/newsroom users.

Controls:

- Create user.
- Edit user.
- Assign role.
- Suspend/activate.
- Search/pagination.
- Activity view.

### Roles - `/admin/roles`

Purpose:

- Role and privilege management.

Controls:

- Create role.
- Search roles.
- Select privileges.
- Save role.
- Handle duplicate role names.
- Assign role to users from Users page.

### Categories - `/admin/categories`

Purpose:

- Public content category management.

Controls:

- Create category.
- Edit category.
- Delete/archive.
- Color/icon.
- Ordering.

### Tags - `/admin/tags`

Purpose:

- Tag management.

Controls:

- Create tag.
- Edit tag.
- Search.
- Trending/SEO tag support.

### Audit - `/admin/audit`

Purpose:

- Access logs and security/audit history.

Controls:

- View audit events.
- Filter logs.
- Review role/security actions.

### Backup - `/admin/backup`

Purpose:

- Backup management.

Controls:

- Create backup.
- View backup history.
- Export data.

### Analytics - `/admin/analytics`

Purpose:

- Traffic, search, content, business, and integration analytics.

Controls:

- Traffic charts.
- Search analytics.
- Author/content metrics.
- Revenue analytics.
- Provider status.

### Retention - `/admin/retention`

Purpose:

- Reader retention, personalization, and engagement reporting.

Controls:

- Reader progress.
- Bookmarks/follows.
- Streaks and badges.
- Personalization data.

### SEO - `/admin/seo`

Purpose:

- SEO and discoverability management.

Controls:

- SEO summary.
- Schema preview.
- Sitemap status.
- Internal linking approvals.
- Indexing queue.
- SEO score/audit path.

### Languages - `/admin/languages`

Purpose:

- Globalization and translations.

Controls:

- Language list.
- Translation fields.
- RTL/LTR state.
- Localized SEO.

### API - `/admin/api`

Purpose:

- API ecosystem and partner integrations.

Controls:

- API keys.
- Webhooks.
- REST/GraphQL/mobile API summaries.
- Syndication configuration.

### Future - `/admin/future`

Purpose:

- Future expansion planning.

Controls:

- Smart TV readiness.
- AI anchors.
- VR/AR.
- Blockchain verification.
- Smart assistants.
- Voice navigation.

### Infrastructure - `/admin/infrastructure`

Purpose:

- Scalability and production infrastructure status.

Controls:

- Redis/PostgreSQL/CDN/queue readiness.
- Docker/Kubernetes path.
- Monitoring readiness.
- Horizontal scaling checklist.

### Database - `/admin/database`

Purpose:

- Database runtime and migration readiness.

Controls:

- Runtime status.
- SQLite/PostgreSQL status.
- Migration rehearsal information.

### Launch - `/admin/launch`

Purpose:

- Launch readiness.

Controls:

- Domain/SSL readiness.
- Email readiness.
- Analytics readiness.
- Media storage readiness.
- Security readiness.

### Security - `/admin/security`

Purpose:

- Security and compliance operations.

Controls:

- 2FA prepare/confirm/disable.
- Session controls.
- Blocked IPs.
- Security policies.
- Compliance summary.

### Operations - `/admin/operations`

Purpose:

- Super admin operations panel.

Controls:

- Health.
- Feature toggles.
- Cache clear.
- Queue monitoring.
- API monitoring.
- Error/audit summaries.
- Backup summaries.

### Settings - `/admin/settings`

Purpose:

- General global settings.

Controls:

- Site settings.
- System defaults.
- Operational configuration.

## 7. News Import System

Purpose:

- Automatically import technology news from configured sources.
- Apply source quality controls and risk management.

Admin pages:

- `/admin/news-imports`
- `/admin/news-imports/inspection`
- `/admin/news-imports/performance`

Controls:

- Enable or disable source.
- Set priority.
- Exclude keywords.
- Required keywords.
- Choose publish policy: published or pending review.
- Inspect high-risk stories.
- Approve or reject imports.
- View source performance.

Source performance metrics:

- Imported count.
- Rejected count.
- Pending inspection count.
- Duplicate rate.
- Average risk score.

Expected behavior:

- Low-risk trusted content follows source policy.
- Risky or low-quality content goes to inspection.
- Duplicates are blocked or flagged.

## 8. QA Flow For Product Owners

### Public QA

1. Open the public homepage.
2. Confirm header links, account actions, notification bell, theme toggle, and language selector.
3. Open every public navigation item.
4. Search for `AI`, `cloud`, `security`, and `gaming`.
5. Open an article and test sharing, comments, bookmarks, related articles, and progress bar.
6. Create a reader account.
7. Edit profile.
8. Follow author.
9. Save article.
10. Open notifications.
11. Test newsletter subscription.
12. Test videos, podcasts, reviews, events, jobs, startups, devices, community, feed, and IT Rooms.
13. Check mobile width.

### Admin QA

1. Open `/admin` while logged out. It must redirect.
2. Log in as admin.
3. Open every admin page.
4. Create user.
5. Create role and select privileges.
6. Create article, publish it, and verify public search.
7. Create assignment, task, editorial note, and internal message.
8. Check WebSocket workflow updates.
9. Test news imports and source inspection.
10. Test media upload/variant rebuild.
11. Test newsletter campaign.
12. Test notification creation.
13. Test monetization, ads, affiliates, and memberships.
14. Check analytics, search analytics, SEO, security, operations, infrastructure, database, and launch pages.

### Role QA

1. Admin should access all areas.
2. Editor should access editorial/content areas only.
3. Reporter should access limited newsroom areas only.
4. Reader should be blocked from all admin routes.

## 9. Known Production Setup Items

These are not staging product bugs:

- Real domain and SSL.
- Production PostgreSQL migration if moving beyond SQLite staging.
- Redis for scaled cache, queues, rate limiting, and multi-instance WebSocket fanout.
- Cloud media storage and CDN.
- Real email provider with SPF/DKIM/DMARC.
- Real push notification credentials.
- Real analytics provider IDs.
- Payment gateway if paid memberships are enabled.
- Mobile app store accounts and signed builds.
- Load testing.
- Security review.
- Backup and disaster recovery drill.

---

# Part 2 - Developer And Deployment Guide

## 1. Codebase Overview

This is a Node.js single-server application with a public single-page client, an admin dashboard, database-backed content, and staging deployment through Render Docker.

Primary files:

- `server.js`: main HTTP server, public routes, admin routes, API routes, auth, security, WebSocket, and server-side HTML serving.
- `db.js`: database schema, seed data, persistence helpers, content queries, admin operations, reader operations, workflow operations, and business modules.
- `public/app.js`: public client application, routing, UI rendering, reader account logic, public API calls, theme/language behavior, and SPA tracking.
- `public/admin.js`: admin dashboard UI, admin route rendering, forms, admin API calls, role-aware surfaces, and operational panels.
- `public/styles.css`: public and admin styling.
- `config.js`: environment configuration.
- `cache.js`: cache/rate-limit support and Redis wiring path.
- `ai.js`: AI assistant integration path.
- `analytics-integrations.js`: GA/GTM/Search Console/Matomo injection and status.
- `database-runtime.js`: database runtime status helpers.
- `media-storage.js`: local/cloud media storage and optimization readiness.
- `video-streaming.js`: video streaming configuration/readiness.
- `email.js`: dummy and real email providers.
- `push.js`: Firebase/browser push readiness.
- `worker.js`: queued background work and email sending path.
- `postgres-adapter.js`: PostgreSQL migration/rehearsal support.
- `news-ingestion.js`: automated technology news import pipeline.
- `news-sources.js`: source list and source quality configuration.

Important folders:

- `public/`: browser assets, public SPA, admin SPA, logo, uploads.
- `scripts/`: QA, import, migration, infrastructure, and launch scripts.
- `database/postgres/`: PostgreSQL schema artifacts.
- `infra/`: NGINX, systemd, and Kubernetes deployment templates.
- `mobile/`: mobile app notes/source placeholder path.
- `backups/`: backup output.
- `data/`: local/staging SQLite database files. Do not commit runtime DB data.
- `screenshots/`: QA screenshot output. Do not treat as product code unless intentionally updating QA evidence.

## 2. Architecture Summary

Runtime:

- Node.js app serves both public client and admin.
- Public client uses hash routing.
- Admin uses server routes under `/admin`.
- SQLite is current staging runtime.
- PostgreSQL migration path exists but should not be enabled until rehearsal and smoke tests pass.
- Redis is optional for single-instance staging and recommended for production scaling.
- WebSocket workflow endpoint is `/api/workflow/realtime`.

Deployment:

- Render Docker web service.
- Dockerfile builds/runs Node app.
- `render.yaml` defines free staging service.
- `SITE_URL` is set to `https://tech-magazine-test.onrender.com`.

## 3. Local Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm start
```

Default local URL:

```text
http://127.0.0.1:8000
```

Admin login:

```text
http://127.0.0.1:8000/admin/login
```

Use private credentials from `.qa-admin-credentials.json` or environment variables. Never commit real passwords.

## 4. Environment Variables

Core:

```text
NODE_ENV=production
HOST=0.0.0.0
PORT=8000
SITE_URL=https://your-domain.com
TRUST_PROXY=true
DATABASE_CLIENT=sqlite
DATABASE_PATH=data/tech_magazine.db
SESSION_DAYS=7
```

Seed accounts:

```text
SEED_ADMIN_PASSWORD=<private>
SEED_EDITOR_PASSWORD=<private>
SEED_REPORTER_PASSWORD=<private>
SEED_QA_REPORTER_PASSWORD=<private>
```

AI:

```text
OPENAI_API_KEY=<private>
```

Email:

```text
EMAIL_PROVIDER=dummy
EMAIL_FROM=dummy@techmag.local
EMAIL_REPLY_TO=dummy@techmag.local
```

Payment:

```text
PAYMENT_PROVIDER=none
```

News import:

```text
NEWS_IMPORT_ENABLED=true
NEWS_IMPORT_ON_STARTUP=true
NEWS_IMPORT_TARGET_COUNT=50
NEWS_IMPORT_STATUS=source_policy
```

Analytics:

```text
GOOGLE_ANALYTICS_ID=
GOOGLE_TAG_MANAGER_ID=
SEARCH_CONSOLE_VERIFICATION=
MATOMO_URL=
MATOMO_SITE_ID=
```

Redis:

```text
REDIS_URL=
REDIS_REST_URL=
REDIS_REST_TOKEN=
```

Media:

```text
MEDIA_STORAGE_PROVIDER=local
MEDIA_CDN_BASE_URL=
```

## 5. Render Staging Deployment

Current service:

```text
https://tech-magazine-test.onrender.com
```

Render configuration:

- File: `render.yaml`
- Service name: `tech-magazine-test`
- Runtime: Docker
- Plan: free
- Health check: `/api/health`
- Auto deploy: enabled
- Database: SQLite staging path
- Email: dummy
- Payment: none

Deployment flow:

1. Commit changes to `main`.
2. Push to GitHub.
3. Render auto-deploys.
4. Wait for Render health check.
5. Open `/api/health`.
6. Run live smoke QA.

## 6. Docker

Build:

```bash
docker build -t tech-magazine .
```

Run:

```bash
docker run -p 8000:8000 --env-file .env tech-magazine
```

Docker Compose:

```bash
docker compose up --build
```

Staging Compose:

```bash
docker compose -f docker-compose.staging.yml up --build -d
```

## 7. Database

Current staging:

- SQLite.
- Runtime file under `data/`.

PostgreSQL migration path:

- `database/postgres/schema.sql`
- `database/postgres/schema.generated.sql`
- `postgres-adapter.js`
- `scripts/export-postgres-schema.js`
- `scripts/export-postgres-json.js`
- `scripts/postgres-readiness-check.js`
- `scripts/postgres-migration-rehearsal.js`

Commands:

```bash
npm run db:schema:postgres
npm run db:export:postgres
npm run db:postgres:check
```

Rehearsal:

```bash
POSTGRES_REHEARSAL_CONFIRM=true POSTGRES_IMPORT_JSON=backups/postgres-import-0000000000000.json npm run db:postgres:rehearse
```

Do not switch production to PostgreSQL until:

- Schema export passes.
- Rehearsal passes.
- Full smoke passes against PostgreSQL.
- Backup and rollback are tested.

## 8. QA Commands

Syntax check:

```bash
npm run check
```

Infrastructure check:

```bash
npm run infra:check
```

Preflight:

```bash
npm run preflight
```

Launch readiness:

```bash
npm run launch:check
```

Smoke:

```bash
npm run smoke
```

Separated public/admin audit:

```bash
npm run audit:separated
```

Full UI crawl:

```bash
npm run qa:full-ui
```

Visual browser QA:

```bash
npm run qa:visual
```

Admin use cases:

```bash
npm run qa:use-cases
```

News editor QA:

```bash
npm run qa:news-editor
```

News ingestion QA:

```bash
npm run qa:news-ingestion
```

Live QA example:

```bash
SMOKE_BASE_URL=https://tech-magazine-test.onrender.com npm run smoke
SMOKE_BASE_URL=https://tech-magazine-test.onrender.com QA_BASE_URL=https://tech-magazine-test.onrender.com npm run qa:full-ui
SMOKE_BASE_URL=https://tech-magazine-test.onrender.com QA_BASE_URL=https://tech-magazine-test.onrender.com npm run qa:visual
```

## 9. QA Evidence From Latest Full Pass

Latest completed QA pass:

- Code syntax check: passed.
- Local smoke: 251/251 passed.
- Local separated client/admin audit: client 79/79, admin 167/167 passed.
- Local admin use cases: 17/17 passed.
- Local news editor QA: 42/42 passed.
- Local news ingestion QA: 10/10 passed.
- Local full UI crawl: 759/759 passed.
- Local visual browser QA: 127/127 passed.
- Live smoke: 251/251 passed.
- Live separated client/admin audit: client 79/79, admin 168/168 passed.
- Live admin use cases: 17/17 passed.
- Live full UI crawl: 759/759 passed.
- Live visual browser QA: 127/127 passed.

## 10. Public API Map

Important public APIs:

- `/api/health`
- `/api/bootstrap`
- `/api/languages`
- `/api/articles/{slug}`
- `/api/search`
- `/api/search/suggestions`
- `/api/search/trending`
- `/api/search/discovery`
- `/api/search/voice`
- `/api/feed`
- `/api/it-rooms`
- `/api/videos`
- `/api/videos/platform`
- `/api/podcasts`
- `/api/podcasts/platform`
- `/api/reviews`
- `/api/reviews/compare`
- `/api/events`
- `/api/jobs`
- `/api/startups`
- `/api/devices`
- `/api/devices/compare`
- `/api/community/topics`
- `/api/community/polls`
- `/api/newsletter`
- `/api/reader/register`
- `/api/reader/login`
- `/api/reader/me`
- `/api/reader/profile`
- `/api/reader/bookmarks`
- `/api/notifications`
- `/api/notifications/preferences`
- `/api/memberships`
- `/api/mobile/config`
- `/api/mobile/home`
- `/api/mobile/offline`
- `/api/mobile/widgets`
- `/api/seo/summary`
- `/api/analytics/summary`
- `/api/future/summary`

Partner/API ecosystem:

- `/api/v1/openapi.json`
- `/api/v1/status`
- `/api/v1/news`
- `/api/v1/articles`
- `/api/v1/media`
- `/api/v1/mobile/config`
- `/graphql`

RSS/sitemaps:

- `/sitemap.xml`
- `/robots.txt`
- `/news-sitemap.xml`
- `/video-sitemap.xml`
- `/podcast-sitemap.xml`
- `/category-sitemap.xml`
- `/podcasts/rss.xml`
- `/amp/articles/{slug}`

## 11. Admin API And Admin Route Map

Important admin routes:

- `/admin`
- `/admin/login`
- `/admin/logout`
- `/admin/articles`
- `/admin/articles/new`
- `/admin/workflow`
- `/admin/homepage`
- `/admin/breaking-news`
- `/admin/live-blogs`
- `/admin/news-imports`
- `/admin/news-imports/inspection`
- `/admin/news-imports/performance`
- `/admin/videos`
- `/admin/podcasts`
- `/admin/reviews`
- `/admin/devices`
- `/admin/ai-assistant`
- `/admin/site-cms`
- `/admin/monetization`
- `/admin/ads`
- `/admin/affiliates`
- `/admin/memberships`
- `/admin/events`
- `/admin/jobs`
- `/admin/startups`
- `/admin/directory`
- `/admin/community`
- `/admin/it-rooms`
- `/admin/media`
- `/admin/comments`
- `/admin/subscribers`
- `/admin/newsletter/campaigns`
- `/admin/notifications`
- `/admin/email-outbox`
- `/admin/users`
- `/admin/roles`
- `/admin/categories`
- `/admin/tags`
- `/admin/audit`
- `/admin/backup`
- `/admin/analytics`
- `/admin/retention`
- `/admin/seo`
- `/admin/languages`
- `/admin/api`
- `/admin/future`
- `/admin/infrastructure`
- `/admin/database`
- `/admin/launch`
- `/admin/security`
- `/admin/operations`
- `/admin/settings`

Important admin action routes include:

- `/admin/workflow/assignments`
- `/admin/workflow/tasks`
- `/admin/workflow/approvals`
- `/admin/workflow/calendar`
- `/admin/workflow/messages`
- `/admin/workflow/shifts`
- `/admin/news-imports/run`
- `/admin/news-imports/sources`
- `/admin/media/upload`
- `/admin/media/variants/rebuild`
- `/admin/email-outbox/test`
- `/admin/api/keys`
- `/admin/api/webhooks`
- `/admin/backup/create`
- `/admin/operations/cache/clear`
- `/admin/operations/features`
- `/admin/security/2fa/prepare`
- `/admin/security/2fa/confirm`
- `/admin/security/2fa/disable`

## 12. Security Rules For Developers

Never:

- Commit real passwords.
- Commit real OpenAI API keys.
- Commit real email provider keys.
- Commit real Firebase service account JSON.
- Expose admin credentials in `/admin`, `/admin/login`, public HTML, JS, docs, or QA reports.
- Add public admin sign-up.
- Let reader tokens access admin APIs.
- Commit runtime `data/` database files unless explicitly intended.

Always:

- Use environment variables for secrets.
- Keep `.env` private.
- Keep `.qa-admin-credentials.json` private.
- Test `/admin` logged out.
- Test reader blocked from admin.
- Rotate exposed credentials.
- Run smoke and separated audits after security changes.

## 13. Code Commenting And Maintenance Notes

The codebase is large and feature-rich. New developers should add short comments only where logic is not obvious.

Recommended comment style:

- Explain why a security check exists.
- Explain why a migration path is staged but not active.
- Explain non-obvious workflow states.
- Explain production-readiness gates.
- Do not add comments that simply repeat a variable name.

Examples of useful comments:

```js
// Keep admin auth separate from reader auth so public accounts cannot reach CMS routes.
```

```js
// Route risky imported stories into inspection even when the source normally auto-publishes.
```

```js
// Redis fanout is optional for one instance, but required before horizontal scaling.
```

When adding a new feature, update:

- Relevant API route in `server.js`.
- Persistence helpers in `db.js`.
- Public UI in `public/app.js` or admin UI in `public/admin.js`.
- Styling in `public/styles.css`.
- Smoke/full UI QA if the feature is user-visible.
- This guide if the feature adds a new page, role, or operational flow.

## 14. Adding A New Public Page

1. Add route handling in `public/app.js`.
2. Add links where appropriate in navigation/footer.
3. Add API endpoint in `server.js` if needed.
4. Add data helpers in `db.js`.
5. Add styles in `public/styles.css`.
6. Add full UI crawler route in `scripts/full-ui-qa-crawl.js`.
7. Add smoke assertions if it is a core feature.
8. Test desktop and mobile.

## 15. Adding A New Admin Page

1. Add protected route in `server.js`.
2. Add admin UI rendering in `public/admin.js`.
3. Add role/privilege checks.
4. Add persistence helpers in `db.js`.
5. Add forms and validation.
6. Add clear success/error states.
7. Add admin route to `scripts/full-ui-qa-crawl.js`.
8. Add separated audit checks if the route must not leak to public users.
9. Test as admin, editor, reporter, and logged-out user.

## 16. Adding A New Role Or Privilege

1. Define the role in the database seed or admin UI.
2. Define privilege keys consistently.
3. Add role checks around admin pages and API actions.
4. Test role access from:
   - Admin.
   - Editor.
   - Reporter.
   - Reader.
   - Logged-out visitor.
5. Verify restricted users get a safe redirect or access-denied view.

## 17. News Import Development Notes

Files:

- `news-ingestion.js`
- `news-sources.js`
- `scripts/import-tech-news.js`
- Admin routes under `/admin/news-imports`

When adding a source:

1. Add source name, URL/feed, priority, and trust settings.
2. Define exclude keywords and required keywords.
3. Decide default status policy.
4. Run preview import.
5. Run ingestion QA.
6. Check inspection queue.
7. Check source performance.

Commands:

```bash
npm run news:preview
npm run news:import
npm run qa:news-ingestion
```

## 18. Email Development Notes

Current staging:

- `EMAIL_PROVIDER=dummy`
- Emails are written to admin outbox.

Real providers supported:

- SendGrid.
- Brevo.
- Amazon SES.

Before enabling real sending:

1. Configure domain.
2. Add SPF/DKIM/DMARC.
3. Add provider API key to environment.
4. Restart app and worker.
5. Queue a test email from `/admin/email-outbox`.
6. Confirm provider message ID or delivery error is stored.

## 19. Push Notification Development Notes

Public config:

- `/api/firebase/config`

Server status:

- `/api/push/status`

Admin:

- `/admin/notifications`

For production:

- Add Firebase service account credentials.
- Add browser/mobile push credentials.
- Test device registration.
- Test notification segmentation.

## 20. Analytics Development Notes

Supported paths:

- Google Analytics 4.
- Google Tag Manager.
- Search Console verification.
- Matomo.

Environment:

```text
GOOGLE_ANALYTICS_ID=
GOOGLE_TAG_MANAGER_ID=
SEARCH_CONSOLE_VERIFICATION=
MATOMO_URL=
MATOMO_SITE_ID=
```

Admin:

- `/admin/analytics`
- `/api/analytics/integrations`

Public:

- SPA route changes are tracked from the public client when provider IDs are configured.

## 21. Media And CDN Development Notes

Development:

- Local uploads are acceptable.

Production:

- Use DigitalOcean Spaces, S3-compatible storage, or another cloud storage provider.
- Use CDN base URL.
- Ensure `/api/media/optimization` reports production readiness before public launch.

## 22. WebSocket And Realtime Notes

Endpoint:

- `/api/workflow/realtime`

Staging:

- In-process fanout works for one instance.

Production:

- Configure Redis for multi-instance fanout.
- Test workflow internal messages across two browser sessions.
- Run smoke check for WebSocket status.

## 23. Production Launch Checklist

Before production:

1. Real domain and SSL configured.
2. `SITE_URL` set to production domain.
3. Secrets rotated.
4. Admin passwords rotated.
5. PostgreSQL decision made and tested.
6. Redis configured if scaling beyond one instance.
7. Email provider configured and verified.
8. Push credentials configured.
9. Analytics provider configured.
10. Cloud media storage and CDN configured.
11. Backups stored off-machine.
12. Load test completed.
13. Security review completed.
14. Full local QA passed.
15. Full live QA passed.
16. Product owner final QA passed.

## 24. Developer Handoff Rules

When taking over this project:

1. Read this guide first.
2. Read `DEPLOYMENT.md`.
3. Read `render.yaml`.
4. Run `npm run check`.
5. Run `npm run smoke`.
6. Open the live site and admin.
7. Do not change secrets or DB files casually.
8. Do not claim a feature is fixed until it is tested locally and live when relevant.
9. Keep public and admin separate.
10. Update QA scripts when adding visible functionality.

## 25. Final Current Status

The staging product is online and tested at:

```text
https://tech-magazine-test.onrender.com
```

The current staging code supports the public client, admin dashboard, reader accounts, CMS, workflow, roles, news imports, media, newsletter, monetization, analytics surfaces, SEO, APIs, mobile paths, security, operations, and future expansion modules.

Remaining work before real public production is mostly external setup:

- Domain.
- SSL.
- Production database/storage.
- Real email.
- Real analytics.
- Real push credentials.
- Payment provider if needed.
- Load/security review.

