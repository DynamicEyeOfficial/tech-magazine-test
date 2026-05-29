# Tech Magazine Product Owner QA Run

Date: 2026-05-22
Environment: Local app at `http://127.0.0.1:8000`

## Result

The product-owner acceptance pass completed successfully after fixing the issues found during QA.

Total checks executed: 1,409
Total failed after fixes: 0

## Suites Run

| Area | Result |
| --- | ---: |
| Admin use cases: article, event, job creation/editing | 17 / 17 passed |
| News/editor article rendering and editor tools | 309 / 309 passed |
| Full UI crawl across client and admin pages | 649 / 649 passed |
| API, admin, security, workflow, newsletter, mobile, SEO, video, podcast, monetization smoke | 194 / 194 passed |
| Client/admin separation and CSRF audit | 202 / 202 passed |
| News ingestion and source risk controls | 10 / 10 passed |
| Browser public client click-through | 10 / 10 passed |
| Browser admin click-through | 13 / 13 passed |
| Browser reporter/admin role restrictions | 5 / 5 passed |

## Product Owner Coverage

- Public website routes, navigation, search, article pages, newsletter, account/profile, mobile layouts.
- Article reader tools: share, bookmark, comments, reading progress, no horizontal overflow.
- Admin sign-in only, no admin signup.
- Admin dashboard, grouped navigation, quick actions, roles, users, article editor.
- Reporter dashboard and direct URL access guards.
- Admin role creation, user creation, category/tag creation, CSRF on POST forms.
- Article create/edit/publish and public API delivery.
- Event creation and reader registration.
- Job creation and reader application.
- Live workflow and realtime websocket smoke.
- News source ingestion, source controls, risk scoring, inspection routing, duplicate/source performance metrics.
- SEO, sitemap, AMP, schema, internal links, GraphQL, public API, partner API.
- Newsletter, notifications, memberships, community, comments, bookmarks, follows.
- Video, podcast, review, device, startup, directory, analytics, monetization, launch, security, operations, database status.
- Mobile API flows: home, device registration, offline save/read, app analytics, widgets, deep links.

## Issues Found And Fixed

1. Stale public bootstrap cache could reference an article removed during QA cleanup.
   - Fixed by clearing the public bootstrap cache after admin POST mutations.
   - Redis-backed cache clearing now also deletes matching Redis keys.

2. Smoke QA expected the video provider to always be `local`.
   - Fixed the test to accept the configured provider as long as the video platform is healthy.
   - Current local `.env` uses `VIDEO_STREAMING_PROVIDER=youtube`.

3. Browser newsletter QA left a `browser-qa-*` subscriber.
   - Cleanup now removes browser-created QA subscriber records.

## Final State

- Local server restarted cleanly after fixes.
- Test data cleanup completed.
- Remaining local test account intentionally kept for reporter-role QA:
  - `qa.reporter@techmag.local`
  - password stored privately in `.qa-admin-credentials.json`; request from project owner.
