# Tech Magazine Live QA Report

Date: 2026-05-29  
Environment: Render free test deployment  
Live URL: https://tech-magazine-test.onrender.com  
Render service: tech-magazine-test  
Live commit: fcc26ad - Refresh article index after CMS saves

## Result

Status: Passed after one live defect was fixed and redeployed.

Total automated live checks passed in this QA round: 1,589 / 1,589

## Suites Run

- Smoke, API, security, admin, public, WebSocket, and integration coverage: 243 / 243 passed.
- Admin end-to-end use cases: 17 / 17 passed.
- News/editor browser QA across live article inventory and editor tools: 186 / 186 passed.
- Live news ingestion and source-risk controls: 10 / 10 passed.
- Full public and admin UI crawl: 759 / 759 passed.
- Visual screenshot/layout QA across desktop and mobile: 127 / 127 passed.
- Client/admin separation audit: 247 / 247 passed.

## Areas Verified

- Public website, routing, homepage, articles, search, sections, mobile views, live coverage, newsletters, memberships, community, leaderboard, events, jobs, startups, devices, reviews, podcasts, and videos.
- Reader account flows: registration, profile update, bookmarks, followed authors, notifications, saved filters, event registration, job application, community posting, replies, voting, comments, and memberships in manual payment mode.
- Admin security: unauthenticated redirects, no credential leakage, no public admin links, CSRF on forms, protected admin pages, role-based access surfaces, old password rejection, active admin login.
- CMS and newsroom: create/edit/publish articles, SEO fields, public article API, editor command tools, editor SEO helper, quality panel, preview update, assignments, approvals, tasks, shifts, internal messages, and WebSocket realtime.
- News automation: live external sources, source controls, excluded keywords, risk routing to inspection, source performance metrics, duplicate metrics, and at least 50 published imported articles.
- Admin modules: users, roles, categories, tags, homepage, breaking news, live blogs, media, comments, subscribers, newsletter campaigns, notifications, email outbox, analytics, retention, SEO, languages, API, future ecosystem, infrastructure, database, launch, security, operations, ads, affiliates, memberships, monetization, events, jobs, startups, reviews, devices, community, and site CMS.
- SEO and APIs: sitemap, robots, AMP article, news/video/podcast/category sitemaps, schema previews, internal links, GraphQL, public partner API authentication behavior, and mobile API.
- Visual QA: desktop and mobile screenshots, layout overflow, runtime errors, failed resources, admin login logged-out state, admin dashboards, and key client pages.

## Defect Found And Fixed

Issue: After an admin edited an article, the public article detail API updated correctly, but the homepage/search/bootstrap listing could keep the old article title.

Fix: The CMS save path now refreshes the public search/listing index immediately after article create/edit.

Verification after fix:

- Admin use-case QA passed: 17 / 17.
- News/editor browser QA passed: 186 / 186.
- Final live smoke passed: 243 / 243.

## Screenshots

Visual screenshots were saved locally under:

`C:\Users\joegh\Documents\Codex\2026-05-18\if-i-need-you-to-make\screenshots\qa-final`

## Notes

This is a Render free test server for QA/product-owner testing. It is not the final production infrastructure. Before a real public launch, move to production-grade database/storage, rotate public test passwords, configure real email/domain, enable real payment providers if needed, add persistent backups, and set up monitoring/alerts.
