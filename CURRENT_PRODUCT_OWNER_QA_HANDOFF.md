# Tech Magazine - Product Owner QA Handoff

## 1. Current Test Server

The platform is online now through a temporary Cloudflare test tunnel:

**Public test URL:** https://tear-bowl-den-gradually.trycloudflare.com

Important:

- This is a temporary test tunnel running from the developer laptop.
- The laptop must stay awake, connected to the internet, and the local server/tunnel must keep running.
- If the laptop sleeps, restarts, loses internet, or the tunnel process stops, the URL will stop working.
- This is suitable for product-owner QA today, not final production hosting.
- For permanent QA or production, deploy to a real host such as DigitalOcean, Render, Railway, Fly.io, or a VPS with PostgreSQL, Redis, storage/CDN, email, and domain DNS.

## 2. Test Links

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
- Future ecosystem API: https://tear-bowl-den-gradually.trycloudflare.com/api/future/summary

## 3. Test Accounts

### Full Admin

- URL: https://tear-bowl-den-gradually.trycloudflare.com/admin/login
- Email: admin@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- Purpose: full platform control, users, roles, CMS, operations, security, APIs, infrastructure, monetization, and all admin modules.

### Editor

- URL: https://tear-bowl-den-gradually.trycloudflare.com/admin/login
- Email: editor@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- Purpose: editorial workflow, articles, moderation, subscribers, and newsroom review.

### Reporter

- URL: https://tear-bowl-den-gradually.trycloudflare.com/admin/login
- Email: po.reporter@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- Purpose: limited newsroom account to verify reporter-level access.

### Reader

- URL: https://tear-bowl-den-gradually.trycloudflare.com/#/account
- Email: reader@test.local
- Password: reader12345
- Purpose: reader profile, bookmarks, comments, followed authors, notifications, memberships, and saved content.

The product owner may also create a new reader account from the public account page.

## 4. Business Summary

Tech Magazine is a professional IT magazine and technology media platform. It is designed as a full digital newsroom, not just a blog.

The platform supports:

- Public technology news website
- Admin and editorial dashboard
- Content management system
- Multi-role newsroom workflow
- Reader accounts
- Comments and community
- Newsletter and notification systems
- News import and source-risk inspection
- Videos, podcasts, live coverage, reviews, jobs, events, startups, devices, and product comparisons
- SEO, analytics, monetization, API, security, operations, globalization, and future-expansion modules
- Mobile-app-ready API structure

The long-term business model can include:

- Advertising
- Sponsored content
- Affiliate links
- Premium memberships
- Newsletter sponsorships
- Events and conference revenue
- Job board revenue
- Partner API/syndication access
- Product review and comparison revenue

Payment gateways are intentionally not enabled yet. Memberships and revenue flows are in manual/testing mode.

## 5. What Was Built

### Public Website

The reader-facing website includes:

- Homepage
- Breaking news
- Featured stories
- Trending articles
- Latest feed
- Search and filters
- Sections/categories
- Article pages
- Author pages
- Videos
- Podcasts
- Reviews and comparisons
- Live blogs
- Events
- Jobs
- Startups
- Devices
- Community
- Newsletter
- Membership
- Reader profile
- Notifications
- Leaderboard
- Dark/light mode
- Multi-language support
- Responsive desktop/mobile layout

### Admin Dashboard

The admin is separate from the public client. There is no public admin signup. Admin users are created inside the admin dashboard.

Admin includes:

- Dashboard overview
- Article manager
- Article editor
- Drafts, scheduling, revisions, rollback path, SEO fields
- News imports
- Source controls and risk inspection
- Source performance dashboard
- Workflow and approvals
- Homepage management
- Breaking news
- Live blogs
- Video CMS
- Podcast CMS
- Reviews
- Device database
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
- Categories and tags
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

## 6. Product Owner Test Mission

The product owner should test this as a real product, not as a static demo.

Focus on:

- Can a reader understand and use the public site?
- Can an admin operate the newsroom?
- Can an editor review and manage content?
- Can a reporter access only limited areas?
- Are the admin and public client clearly separated?
- Do all buttons, forms, routes, and links behave cleanly?
- Is the UI professional enough for a tech media brand?
- Are there confusing, empty, ugly, broken, or duplicated areas?
- Is there any test junk visible to users?
- Does the platform feel like a serious media business?

## 7. Recommended QA Flow

### A. Public Reader Flow

1. Open the public website.
2. Check the homepage, hero, breaking banner, tickers, featured stories, latest articles, and sections.
3. Use the search page with terms like AI, cloud, cybersecurity, gaming, and startup.
4. Open articles and verify:
   - title
   - author
   - reading time
   - progress bar
   - sharing buttons
   - related content
   - comments
   - SEO-looking structure
5. Toggle dark/light mode.
6. Try videos, podcasts, reviews, events, jobs, startups, devices, community, newsletter, and membership pages.
7. Sign in as reader@test.local.
8. Save/bookmark an article.
9. Follow an author.
10. Update reader profile.
11. Check notifications and leaderboard.
12. Confirm the public website does not show admin links.

### B. Admin Flow

1. Open admin login.
2. Sign in as admin@techmag.local.
3. Confirm no admin signup exists.
4. Open every admin menu item.
5. Check that pages load cleanly and are visually professional.
6. Create or edit:
   - article
   - category
   - tag
   - user
   - role
   - notification
   - newsletter campaign
   - homepage item
   - live event
   - job
   - event
   - startup
   - review
7. Verify roles and privileges are understandable.
8. Check source import, inspection queue, and source performance.
9. Check analytics, SEO, operations, security, API, globalization, future ecosystem, and infrastructure pages.

### C. Reporter Flow

1. Sign in as po.reporter@techmag.local.
2. Confirm reporter sees limited newsroom-related access only.
3. Try creating or editing content where allowed.
4. Confirm system/admin areas are restricted.

### D. Editor Flow

1. Sign in as editor@techmag.local.
2. Check article review, moderation, subscribers, and publishing workflow areas.
3. Confirm the editor does not have full system infrastructure access.

### E. API Flow

Open these URLs:

- https://tear-bowl-den-gradually.trycloudflare.com/api/health
- https://tear-bowl-den-gradually.trycloudflare.com/api/bootstrap?page=1&limit=5
- https://tear-bowl-den-gradually.trycloudflare.com/api/search?query=ai&page=1&limit=5
- https://tear-bowl-den-gradually.trycloudflare.com/api/events?page=1&limit=2
- https://tear-bowl-den-gradually.trycloudflare.com/api/jobs?page=1&limit=2
- https://tear-bowl-den-gradually.trycloudflare.com/api/startups?page=1&limit=2
- https://tear-bowl-den-gradually.trycloudflare.com/api/devices?page=1&limit=2
- https://tear-bowl-den-gradually.trycloudflare.com/api/videos?page=1&limit=2
- https://tear-bowl-den-gradually.trycloudflare.com/api/podcasts?page=1&limit=2
- https://tear-bowl-den-gradually.trycloudflare.com/api/reviews?page=1&limit=2

## 8. Recent QA Status

Latest remote test against the public tunnel:

- Remote smoke QA: 235/235 passed
- Local smoke QA: 235/235 passed
- Client/admin separation QA: 241/241 passed
- Chrome visual QA: 122/122 passed
- Full UI crawl: 759/759 passed
- Health check: passing

## 9. Known Non-Code Production Items

These are not product-owner bugs. They are provider/deployment items:

- Permanent hosting
- Real domain
- PostgreSQL production database
- Redis production cache/queue/rate-limit layer
- CDN/object storage for media
- Real email provider and DNS
- Real push notification credentials
- Real analytics/Search Console/Matomo IDs
- Payment gateway if paid memberships are enabled later
- Mobile app store accounts and signed builds
- Load testing and security review before large public traffic

## 10. Final Note

For today, the product owner should use:

https://tear-bowl-den-gradually.trycloudflare.com

The developer laptop must stay on and online while this temporary test URL is being used.
