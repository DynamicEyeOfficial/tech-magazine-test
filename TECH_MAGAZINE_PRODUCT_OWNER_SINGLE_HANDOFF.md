# Tech Magazine - Complete Product Owner Handoff

## 1. Live Test Server

The platform is currently online through this temporary public test URL:

**https://tear-bowl-den-gradually.trycloudflare.com**

This URL is for product-owner QA. It is not permanent production hosting.

Important:

- The site is running from the developer laptop through a temporary Cloudflare tunnel.
- The laptop must stay on, awake, online, and connected to the internet.
- If the laptop sleeps, restarts, disconnects, or the tunnel stops, the public URL will stop working.
- For real staging or production, the platform should be deployed to a VPS or cloud host with a real domain.

## 2. Main Test Links

- Public website: https://tear-bowl-den-gradually.trycloudflare.com
- Admin login: https://tear-bowl-den-gradually.trycloudflare.com/admin/login
- Admin dashboard: https://tear-bowl-den-gradually.trycloudflare.com/admin
- Search page: https://tear-bowl-den-gradually.trycloudflare.com/#/search
- Article example: https://tear-bowl-den-gradually.trycloudflare.com/#/article/ai-agents-newsroom-workflows
- Live coverage: https://tear-bowl-den-gradually.trycloudflare.com/#/live
- Videos: https://tear-bowl-den-gradually.trycloudflare.com/#/video
- Podcasts: https://tear-bowl-den-gradually.trycloudflare.com/#/podcasts
- Reviews: https://tear-bowl-den-gradually.trycloudflare.com/#/reviews
- Events: https://tear-bowl-den-gradually.trycloudflare.com/#/events
- Jobs: https://tear-bowl-den-gradually.trycloudflare.com/#/jobs
- Startups: https://tear-bowl-den-gradually.trycloudflare.com/#/startups
- Devices: https://tear-bowl-den-gradually.trycloudflare.com/#/devices
- Community: https://tear-bowl-den-gradually.trycloudflare.com/#/community
- Health check: https://tear-bowl-den-gradually.trycloudflare.com/api/health
- Bootstrap API: https://tear-bowl-den-gradually.trycloudflare.com/api/bootstrap?page=1&limit=5
- Search API: https://tear-bowl-den-gradually.trycloudflare.com/api/search?query=ai&page=1&limit=5
- Events API: https://tear-bowl-den-gradually.trycloudflare.com/api/events?page=1&limit=2
- Jobs API: https://tear-bowl-den-gradually.trycloudflare.com/api/jobs?page=1&limit=2
- Startups API: https://tear-bowl-den-gradually.trycloudflare.com/api/startups?page=1&limit=2
- Devices API: https://tear-bowl-den-gradually.trycloudflare.com/api/devices?page=1&limit=2
- Videos API: https://tear-bowl-den-gradually.trycloudflare.com/api/videos?page=1&limit=2
- Podcasts API: https://tear-bowl-den-gradually.trycloudflare.com/api/podcasts?page=1&limit=2
- Reviews API: https://tear-bowl-den-gradually.trycloudflare.com/api/reviews?page=1&limit=2
- Future ecosystem API: https://tear-bowl-den-gradually.trycloudflare.com/api/future/summary

## 3. Test Accounts

### Full Admin

- URL: https://tear-bowl-den-gradually.trycloudflare.com/admin/login
- Email: admin@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- Purpose: full platform control.

### Editor

- URL: https://tear-bowl-den-gradually.trycloudflare.com/admin/login
- Email: editor@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- Purpose: editorial workflow, content review, comments, subscribers, and newsroom operations.

### Reporter

- URL: https://tear-bowl-den-gradually.trycloudflare.com/admin/login
- Email: po.reporter@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- Purpose: limited newsroom access to test role restrictions.

### Reader

- URL: https://tear-bowl-den-gradually.trycloudflare.com/#/account
- Email: reader@test.local
- Password: reader12345
- Purpose: public reader account, profile, bookmarks, comments, notifications, memberships, and saved content.

The product owner can also create a new reader account from the public account page.

## 4. Business Summary

Tech Magazine is a professional IT magazine and technology media platform. It is designed as a complete digital newsroom and media business, not only a blog.

The platform is intended to compete in the direction of major technology media platforms such as TechCrunch, The Verge, Wired, Ars Technica, Engadget, Bloomberg Technology, and Technology Magazine.

The business goal is to support:

- High-traffic technology publishing
- Multi-author editorial workflow
- Professional content management
- Reader accounts and retention
- Newsletter growth
- Advertising and sponsorship
- Reviews and affiliate revenue
- Events and conference opportunities
- Job board revenue
- Startup and device database expansion
- API/syndication business opportunities
- Mobile app expansion

Payment gateways are not enabled yet. Memberships and revenue flows currently work in manual/test mode.

## 5. Platform Surfaces

### Public Client Website

This is the reader-facing website. It includes:

- Homepage
- Breaking news
- Featured stories
- Trending articles
- Latest news
- Search
- Sections and categories
- Article pages
- Author pages
- Videos
- Podcasts
- Reviews
- Product comparisons
- Live coverage
- Events
- Jobs
- Startups
- Devices
- Community
- IT rooms/feed surfaces
- Newsletter
- Membership
- Reader account
- Profile
- Notifications
- Leaderboard
- Multi-language support
- Dark/light mode
- Mobile responsive layout

The public website must not expose admin links, admin signup, or admin controls.

### Admin Dashboard

The admin dashboard is separate from the public client. Admin has sign-in only. Admin users are created from inside the admin dashboard.

Admin includes:

- Dashboard overview
- Article manager
- Article editor
- Drafts
- Revisions
- Scheduling
- SEO fields
- News imports
- Source controls
- Risk inspection queue
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
- IT rooms
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
- Retention
- SEO
- Languages/globalization
- API and integrations
- Future ecosystem
- Infrastructure/scalability
- Database runtime
- Launch readiness
- Security/compliance
- Operations/settings

## 6. Full Feature Scope Built

### 1. Public News and Media Website

Includes homepage, breaking news, featured stories, trending articles, latest feed, infinite-style pagination support, mega navigation, categories, sticky navigation, dark/light mode, responsive design, mobile optimization, sponsored blocks, ads, live ticker, recommended articles, reading progress, breadcrumbs, social sharing, reading time, multi-language support, and accessibility-aware structure.

### 2. Article and CMS

Includes article creation, drafts, rich editor, block-style controls, markdown/HTML support paths, SEO fields, slug generation, autosave, revisions, scheduling, categories, tags, featured images, media embedding, code blocks, polls, tables, quotes, related linking, duplication, archiving, soft delete, expiration path, rollback path, approval workflows, and performance tracking.

### 3. Breaking News and Live Coverage

Includes breaking alerts, live blogging, live update feeds, event coverage mode, push alert path, emergency publishing, homepage override, banners, timestamped live entries, comments, and conference coverage.

### 4. Newsroom and Editorial Workflow

Includes reporter/writer/editor/chief editor/admin workflows, assignments, editorial calendar, tasks, statuses, approvals, internal newsroom chat over WebSocket, review queues, approval chains, deadlines, editorial notes, internal comments, team collaboration, legal/sensitive approval paths, schedules, shifts, and productivity tracking.

### 5. Roles and Access Control

Includes super admin/admin/editor/writer/reporter/contributor/moderator/subscriber/reader concepts, granular permissions, role-based access, ownership rules, access logs, session management, 2FA path, IP/geo policies, and device tracking.

### 6. Media and Digital Asset Management

Includes image/video/audio upload paths, media folders, cloud storage integration path, image optimization, CDN path, WebP conversion path, video processing path, watermarking path, tags, metadata, search, AI tagging path, bulk upload path, and usage tracking.

### 7. Video Platform

Includes video articles, categories, playlists, video SEO, video analytics, adaptive delivery architecture, subtitles/captions, picture-in-picture/mini-player UI path, video monetization path, recommendation engine, and multi-quality infrastructure planning.

### 8. Podcast and Audio Platform

Includes podcast channels, episode management, audio player, podcast RSS, Spotify/Apple distribution path, audio SEO, AI transcription path, analytics, and monetization path.

### 9. Mobile Application System

Includes mobile app source, mobile API, personalized feed, offline reading, push registration path, bookmarks, voice narration path, gestures, widgets path, deep links, smart caching, and mobile analytics.

### 10. Search and Discovery

Includes global search, semantic-style expansion, smart filters, typo correction, trending searches, voice search endpoint, saved searches, AI recommendations path, and future Elastic/OpenSearch path.

### 11. SEO and Discoverability

Includes meta management, Open Graph, Twitter/social metadata, XML sitemap, robots, canonical URLs, schema markup, Google News sitemap, auto internal linking, SEO scoring, AI SEO assistant path, audit dashboard, AMP article path, and rich snippet structure.

### 12. AI and Automation

Includes AI content recommendations path, article summaries, SEO optimization, auto-tagging, grammar/title support path, translation path, voice narration path, moderation/spam path, content scoring, personalization, and AI assistant dashboard.

### 13. Community and Social

Includes user profiles, following authors, comments, nested replies path, reactions, reports, moderation, badges, reputation, forums, polls, voting, notifications, saved articles, reading history, and community moderation.

### 14. Newsletter and Email Marketing

Includes subscriptions, double opt-in, segmentation, campaigns, templates, scheduled/manual sending, automated workflows, breaking news emails path, open/click tracking, unsubscribe, drip path, and personalized newsletters path.

### 15. Monetization and Revenue

Includes banners, sponsored content, native ads, affiliate links, membership plans, premium path, paywall path, donation path, revenue analytics, CPM management, advertiser dashboard path, invoices path, and reports.

### 16. Product Review and Comparison

Includes product reviews, ratings, benchmarks, pros/cons, specs, comparison tools, summaries, affiliate links, galleries path, and review videos path.

### 17. Tech Database and Device Directory

Includes smartphones/laptops/GPU/CPU-style device database, company profiles, startup profiles, specs, comparisons, benchmarks, release timelines, and historical tracking path.

### 18. Events and Conference System

Includes event pages, schedules, speaker profiles, ticket/manual registration path, live coverage, streams path, RSVP, agendas, sponsors, and virtual conference structure.

### 19. Job Board and Career Platform

Includes job posts, recruiter/company path, resume URL capture, AI-style matching, featured jobs, application tracking, hiring profiles, job alerts, and salary insights.

### 20. Analytics and Business Intelligence

Includes traffic analytics, engagement, scroll tracking, heatmap-style data, author analytics, revenue analytics, subscriber analytics, device/GEO analytics, reports, realtime dashboard, and prediction path.

### 21. Administration and Operations

Includes global settings, cache management, queue monitoring, server/API monitoring, error logs, audit trails, backup management, maintenance mode, feature toggles, deployment controls, and CDN management.

### 22. Security and Compliance

Includes CSRF, XSS prevention path, rate limiting, login protection, role security, audit logs, backups, GDPR/cookie consent path, anti-spam AI path, device/session tracking, WAF/DDoS provider path, and disaster recovery planning.

### 23. API and Integration Ecosystem

Includes REST API, GraphQL endpoint, mobile API, third-party integrations, webhooks, OAuth provider path, RSS feeds, news syndication, public developer API, API keys, and social integrations.

### 24. Multi-Language and Globalization

Includes RTL/LTR support, language switching, translation workflow, localized SEO, regional content targeting, country editions, timezone management, and multi-currency support.

### 25. Future Expansion Ecosystem

Includes Smart TV apps planning, AI news anchors, VR/AR news experiences, blockchain publishing verification, NFT/media collectibles, AI-generated media, smart assistants, and voice-controlled news navigation.

### 26. Enterprise Infrastructure and Scalability

Includes microservices readiness, Docker/Kubernetes path, Redis/PostgreSQL production setup, queues, CDN, horizontal scaling, auto-scaling, multi-region planning, disaster recovery, high availability planning, monitoring, and deployment controls.

## 7. Product Owner QA Mission

The product owner should test this as a real product.

Main questions:

- Does the public website feel like a serious technology media platform?
- Can a reader browse, search, read, save, comment, subscribe, and use account features?
- Can an admin operate the platform from the dashboard?
- Can an editor manage editorial work?
- Can a reporter access only the correct limited areas?
- Are public and admin clearly separated?
- Do all pages look polished and usable?
- Are there any broken buttons, ugly sections, empty areas, overlapping text, bad spacing, or confusing flows?
- Does the platform feel ready for staging feedback?

## 8. Recommended QA Flow

### A. Public Website QA

1. Open the public website.
2. Review homepage layout, hero, breaking news, ticker, featured content, latest content, and sections.
3. Use search with terms like AI, cloud, cybersecurity, gaming, startup, and reviews.
4. Open articles and verify title, author, image, reading time, sharing, comments, related content, and progress bar.
5. Test dark/light mode.
6. Test videos, podcasts, reviews, events, jobs, startups, devices, community, newsletter, membership, and leaderboard pages.
7. Sign in as reader.
8. Save an article.
9. Follow an author.
10. Update profile.
11. Check notifications.
12. Confirm the public side has no admin links.

### B. Admin QA

1. Open admin login.
2. Sign in as admin.
3. Confirm there is no admin signup.
4. Open every admin menu item.
5. Create/edit article, category, tag, user, role, notification, newsletter campaign, homepage item, live event, job, event, startup, and review.
6. Check news imports, inspection queue, and source performance.
7. Check workflow and approvals.
8. Check users, roles, and privileges.
9. Check analytics, SEO, operations, security, API, globalization, future ecosystem, and infrastructure.
10. Confirm all forms and buttons behave cleanly.

### C. Editor QA

1. Sign in as editor.
2. Check editorial workflow, review queues, moderation, and subscribers.
3. Confirm editor is not full system admin.

### D. Reporter QA

1. Sign in as reporter.
2. Confirm reporter has limited newsroom access.
3. Try creating or editing content where allowed.
4. Confirm restricted system areas are not available.

### E. Reader QA

1. Sign in as reader.
2. Test profile update.
3. Test bookmarks.
4. Test following author.
5. Test comments.
6. Test membership page.
7. Test notifications.
8. Test saved content and leaderboard.

## 9. Recent QA Status

Latest remote QA was run against the public test URL, not only localhost.

- Remote smoke QA: 235/235 passed
- Local smoke QA: 235/235 passed
- Client/admin separation QA: 241/241 passed
- Chrome visual QA: 122/122 passed
- Full UI crawl: 759/759 passed
- Health check: passing

## 10. Known Non-Code Production Items

These are expected production setup items, not product bugs:

- Permanent hosting
- Real domain
- PostgreSQL production database
- Redis production cache/queue/rate-limit layer
- CDN/object storage for media
- Real email provider and DNS records
- Real push notification credentials
- Real analytics/Search Console/Matomo IDs
- Payment gateway if paid memberships are enabled later
- Mobile app store accounts and signed builds
- Load testing before high traffic
- Security review before public launch

## 11. Final Instruction for Product Owner

Use this link for QA:

**https://tear-bowl-den-gradually.trycloudflare.com**

If the link does not open, ask the developer to check that:

- The laptop is on.
- The laptop is connected to the internet.
- The local server is running.
- The Cloudflare tunnel is still running.

This is the single source of truth for the current product-owner QA round.
