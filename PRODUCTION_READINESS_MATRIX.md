# Tech Magazine Production Readiness Matrix

This file is the source of truth for status wording.

## Status Rules

- **Done Production-Ready** means the feature is implemented, tested, secured, deployable, observable, documented, and ready for real users on production infrastructure.
- **Done MVP** means the feature works in the current app, but still needs scale hardening, provider setup, deeper QA, or production infrastructure.
- **Partial** means the feature has a foundation but important behavior is still missing.
- **Blocked** means the remaining work needs an external account, domain, DNS, paid provider, server, or credentials.

Do not call a feature simply "Done" unless it is **Done Production-Ready**.

## Section Status

| Section | Current Status | Production-Ready Gap |
|---|---|---|
| 1. Public News & Media Website | Done MVP | Needs browser/device QA, CDN/media production tuning, real analytics IDs, accessibility audit, load test. |
| 2. Article & CMS | Done MVP | Needs collaborative editing locks, full editor QA, production media storage/CDN, PostgreSQL smoke run, permission hardening. |
| 3. Breaking News & Live Coverage | Done MVP | Realtime fanout layer exists for workflow; live coverage still needs provider push credentials, load test for live traffic, and incident runbook. |
| 4. Newsroom & Editorial Workflow | Done MVP, production path implemented | Authenticated WebSocket and Redis-backed cross-instance fanout are implemented; production readiness is blocked until Redis credentials are configured and load-tested. Presence, typing, read receipts, and attachment policy remain next upgrades. |
| 5. User Roles & Access Control | Partial | Needs granular enforcement audit, 2FA/password recovery production QA, IP/geo policy testing, device/session dashboards. |
| 6. Media & Digital Asset Management | Done MVP, production path implemented | Upload validation, checksums, provider metadata, media readiness checks, and DigitalOcean Spaces upload support are implemented. Production readiness is blocked until Spaces credentials, CDN/public delivery, media scanner mode, and provider upload tests are configured. |
| 7. Video Platform System | Done MVP, production path implemented | Video pages, playlists, categories, SEO metadata, subtitles, bookmarks, PiP controls, telemetry APIs, analytics dashboard data, and DigitalOcean HLS readiness checks are implemented. Production readiness still needs real Spaces credentials, transcoder mode/FFmpeg or managed processing, CDN validation, and load testing for video delivery/live chat. |
| 8. Podcast & Audio Platform | Done MVP, production path implemented | Podcast categories, channel metadata, multi-host/tag/network fields, episode scheduling metadata, thumbnails, chapters, clips, bookmarks, mini-player, playback telemetry, RSS validation, distribution dashboard, PodcastEpisode schema, OpenAI transcription worker path, and sponsor/premium flags are implemented. Production readiness still needs real directory accounts, audio CDN/provider credentials, and ad/payment provider decisions. |
| 9. Mobile Application System | Done MVP, production path implemented | Expo/React Native app source, dedicated mobile API, personalized feed, offline library, push registration path, deep links, narration, saved content, pull-to-refresh/swipe gestures, and mobile analytics are implemented. Production readiness still needs Apple/Google developer accounts, signed native builds, device QA, Firebase/APNs credentials, crash monitoring, and large media download testing. |
| 10. Search & Discovery Engine | Done MVP, production path implemented | Unified search index, mixed-result discovery across articles/videos/podcasts/authors/reviews/devices/categories/tags, semantic expansion, typo correction, smart filters, saved searches, trending/heatmap data, voice-query endpoint, mobile client support, and admin rebuild controls are implemented. Production readiness still needs a real OpenSearch/Elastic cluster, embedding/vector infrastructure, device voice-capture QA, load testing, and relevance tuning. |
| 11. SEO & Discoverability | Done MVP, production path implemented | SEO previews, focus keywords, metadata validation, NewsArticle/VideoObject/PodcastEpisode/Review/FAQ schema validation, video/podcast/category sitemaps, indexing queue, internal-link approval records, Google News readiness flags, and SEO audit summary are implemented. Production readiness still needs Search Console verification, Publisher Center approval, real indexing credentials, PageSpeed API/validation, and Google structured-data review. |
| 12. AI & Automation | Done MVP, production path implemented | Article automation jobs, AI summaries, key points, newsletter/social snippets, SEO suggestions, auto-tagging suggestions, translation review queue, voice narration scripts, moderation scoring, recommendation output, usage dashboard, and smoke coverage are implemented. Production readiness still needs secret-vault key storage, usage budgets, model evaluation suite, cost monitoring, and human review policy. |
| 13. Community & Social | Done MVP, production path implemented | Reader profiles/preferences, public profile API, follow-author feed, forum categories, topic voting/ranking, moderation operations dashboard, comment analytics, reputation leaderboard, anti-abuse controls flags, polls, and smoke coverage are implemented. Production readiness still needs provider-backed notification fanout, abuse/load testing, legal community policy, avatar storage/CDN, and moderator staffing. |
| 14. Newsletter & Email Marketing | Done MVP, production path implemented | Double opt-in, verification tokens, subscriber preferences, email event tracking, growth analytics, campaign template/A-B fields, welcome/breaking/weekly automations, dummy outbox delivery, marketing dashboard, and smoke coverage are implemented. Production sending remains blocked until the real domain, SPF/DKIM/DMARC, sender provider credentials, and webhook verification are configured. |
| 15. Monetization & Revenue | Done MVP, production path implemented | Banner/native/video ad slots, CPM/GEO/scheduling fields, sponsored campaign analytics/legal status, manual memberships, premium flags, affiliate click/revenue fields, product-review affiliate integration, revenue forecasting, monetization operations dashboard, and smoke coverage are implemented. Production revenue remains blocked until payment gateway, ad network/ad server, invoice/tax workflow, sponsor settlement, and legal review are configured. |
| 16. Product Review & Comparison | Done MVP, production path implemented | Product review seed data, review detail, pros/cons/specs/benchmarks, affiliate-ready links, comparison API, review schema path, and smoke coverage are implemented. Production readiness still needs editorial review templates QA, benchmark provenance policy, affiliate compliance review, and structured-data validation in Google's tools. |
| 17. Tech Database & Device Directory | Done MVP, production path implemented | Device database, specs, benchmarks, comparisons, startup profiles, founders, funding rounds, directory records, and tech database quality summary are implemented. Production readiness still needs bulk import/update workflows, external data-source attribution, data QA, and scheduled refresh operations. |
| 18. Events & Conference System | Done MVP, production path implemented | Event pages, speaker/agenda records, registration flow, livestream URL fields, ticket/manual revenue handling, admin dashboard, live coverage links, and ICS calendar export are implemented. Production readiness still needs ticket/payment provider, attendee email delivery, livestream provider, and event operations QA. |
| 19. Job Board & Career Platform | Done MVP, production path implemented | Recruiter accounts, job posts, reader applications, AI-style match scoring, resume URL capture, job alerts, admin dashboard, and smoke coverage are implemented. Production readiness still needs recruiter billing, resume privacy/legal review, moderation workflows, and real email alert delivery. |
| 20. Analytics & Business Intelligence | Done MVP, production path implemented | Traffic, engagement, author, search, mobile, revenue, heatmap, and predictive content dashboards are implemented through `/api/analytics/business-intelligence`. Production readiness still needs real GA/Matomo/Search Console IDs, warehouse/export plan, consent validation, dashboard load tests, and privacy review. |
| 21. Administration & Operations | Done MVP, production path implemented | Operations panel, feature toggles, queue stats, cache controls, API/security/media/retention rollups, backup records, launch checks, and infrastructure summary are implemented. Production readiness still needs production metrics provider, alerting, restore drills, deployment permissions, and Redis-backed queue scaling. |
| 22. Security & Compliance | Done MVP, production path implemented | WAF policy, geo policy, anti-spam mode, audit logs, blocked IPs, 2FA/password reset paths, backup records, compliance consent tracking, and compliance summary are implemented. Production readiness still needs external security review, WAF/DDoS provider, GDPR/cookie legal review, and penetration test. |
| 23. API & Integration Ecosystem | Done MVP, production path implemented | REST partner API, OpenAPI document, GraphQL endpoint, RSS/news feeds, API keys, usage logging, webhook registry, integration summary, and smoke coverage are implemented. Production readiness still needs versioning policy, partner documentation, webhook delivery worker, API load tests, OAuth provider, and key rotation workflow. |
| 24. Multi-Language & Globalization | Done MVP, production path implemented | Language registry, RTL/LTR support, article translation workflow, localized article retrieval, localized SEO fields, admin translation UI, and smoke coverage are implemented. Production readiness still needs translation review operations, regional SEO QA, RTL browser/device QA, country editions, and locale-specific editorial staffing. |
| 25. Future Expansion Ecosystem | Done MVP, production path implemented | Future module registry, roadmap API, prototype endpoints for smart TV, AI anchors, VR/AR, blockchain verification, AI media, smart assistants, and voice navigation are implemented. Production readiness still needs native apps/providers, legal approval, prototype budgets, and device/platform certification. |
| 26. Enterprise Infrastructure & Scalability | Done MVP, production path implemented | Docker/Kubernetes/systemd/NGINX files, PostgreSQL schema generation, migration rehearsal path, queue worker, infrastructure summary endpoint, cache/media/video/search config, and smoke/infra coverage are implemented. Production readiness still needs real PostgreSQL credentials, successful rehearsal, full PostgreSQL smoke run, Redis credentials, CDN, monitoring, load tests, and HA drills. |

## Current Production-Ready Items

- Static deployment package files exist and pass infrastructure checks.
- Health endpoint works.
- Smoke suite covers the current working app.
- Workflow/chat now has a same-origin authenticated WebSocket channel.
- Workflow realtime can publish through Redis REST (`tm:realtime:workflow`) for cross-instance fanout when Redis credentials are configured.
- PostgreSQL migration rehearsal can apply the generated schema and import exported SQLite JSON when `pg` and `POSTGRES_URL` are available.
- Media uploads now store provider/key/checksum/scan status metadata and the launch check blocks local disk storage from being called production-ready.
- DigitalOcean Spaces media upload support exists with CDN/public URL readiness reporting.
- Podcast/audio platform now has database-backed category, distribution, analytics, bookmark, RSS validation, and OpenAI transcription paths.
- Mobile app platform now has a dedicated API layer plus Expo/React Native app source for personalized feed, offline saves, push registration, deep links, narration, saved content, and analytics.
- Search/discovery now has an internal unified index, mixed-content search results, semantic expansion, saved filters, trending/heatmap logging, voice-query interpretation, mobile client support, and admin index rebuild controls.
- Sections 11-15 now have in-product completion paths: SEO automation/sitemaps/previews, AI article automation, public community profiles/forum voting/moderation operations, newsletter double opt-in/automation/analytics, and monetization video ads/revenue operations.
- Sections 16-26 now have in-product completion paths: review comparison, tech database summary, event calendar export, job alerts, business intelligence, compliance consent, webhook/integration registry, future-module roadmap APIs, and enterprise infrastructure summary.

## Current Hard Blocks Before Thousands Of Users

- Real HTTPS domain.
- Real email provider and SPF/DKIM/DMARC.
- Admin credential rotation.
- PostgreSQL runtime switchover is not proven yet.
- PostgreSQL rehearsal credentials and full smoke run against PostgreSQL.
- Redis credentials and load testing for multi-instance realtime and queues.
- DigitalOcean Spaces/CDN credentials and provider upload test.
- Media malware scanner webhook or trusted-provider scanning mode.
- OpenSearch/Elastic credentials and search load/relevance testing before high-volume discovery traffic.
- External provider/account setup for SEO validation/indexing, AI secret vault/usage governance, community notification fanout, newsletter sending/webhooks, ad/payment providers, events, app stores, analytics, WAF/DDoS, webhooks, and future platform certifications.
- Load testing and security review.
