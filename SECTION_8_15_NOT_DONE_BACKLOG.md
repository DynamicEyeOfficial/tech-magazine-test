# Sections 8-15 Not Done Backlog

This file tracks remaining work for Sections 8-15 so we can return to it later without confusing MVP coverage with production-ready completion.

Status labels:

- **Not Done**: not implemented yet.
- **Partial**: foundation exists, but the full feature is not complete.
- **Blocked**: needs external provider, credentials, domain, app-store account, payment gateway, legal setup, or production infrastructure.

---

## 8. Podcast & Audio Platform

Current status: upgraded from MVP to in-product completion. The app now has podcast categories, channel/show metadata, multi-host fields, show tagging, network hierarchy, episode metadata, scheduling fields, thumbnails, tags, summaries, chapters, clipping metadata, related article links, bookmarks, player telemetry, mini-player behavior, RSS validation, distribution dashboard, PodcastEpisode schema, OpenAI transcription worker path, analytics aggregation, and premium/sponsor flags.

Remaining blocked items:

- **External podcast directory accounts**
  - Blocked: Spotify, Apple Podcasts, Amazon Music, Pocket Casts, and Overcast require the real publisher accounts and directory submission access.
  - Blocked: Google Podcasts is kept as a legacy distribution status because the product is no longer an active standalone directory.

- **Physical audio processing infrastructure**
  - Blocked: real audio file processing at production scale needs DigitalOcean Spaces credentials, CDN domain, and an audio processing worker budget.

- **Advanced monetization providers**
  - Blocked: dynamic ad insertion and paid premium podcast enforcement require an ad server/payment provider decision. Payment gateways are intentionally disabled for now.

---

## 9. Mobile Application System

Current status: upgraded from API foundation to a working Expo/React Native mobile application source plus a dedicated mobile API layer. The mobile app now has personalized feed sync, cached home data, reader login/register, saved/offline library, article/video/podcast offline save paths, push registration path, notification preferences, deep-link handling, pull-to-refresh, swipe-back gesture, voice narration, podcast/video open controls, and mobile analytics events.

Remaining blocked items:

- **Native store builds and signing**
  - Blocked: production iOS/Android binaries require Apple Developer and Google Play accounts, app signing, store assets, privacy declarations, and device QA.
  - Blocked: Face ID/biometric lock and Apple login need native credential setup and app-store capability configuration.
  - Blocked: iCloud sync, Siri shortcuts, Android widgets, and home-screen widgets need provider-specific native modules and device testing.

- **Production push delivery**
  - Blocked: mobile push registration path exists, but production delivery needs Firebase/APNs service credentials and physical-device testing.
  - Blocked: AI timing/GEO notification optimization needs real engagement volume and privacy rules.

- **Production offline media**
  - Blocked: offline article payloads are implemented; large podcast/video downloads need DigitalOcean Spaces/CDN, storage limits, and platform media-download QA.

- **Production mobile observability**
  - Blocked: mobile analytics events exist; crash/performance monitoring requires Sentry, Firebase Crashlytics, or a similar provider account.

---

## 10. Search & Discovery Engine

Current status: upgraded from article-only MVP search to in-product completion for the current app. The platform now has an internal unified search index, discovery search across articles, videos, podcasts, authors, reviews, devices, categories, and tags, semantic token expansion, typo correction, mixed-result ranking, content-type facets, search status/dashboard data, saved search filters for reader accounts, search heatmap/trending logs, voice-query interpretation endpoint, mobile API client support, and admin index rebuild controls.

Remaining blocked items:

- **ElasticSearch / OpenSearch production cluster**
  - Blocked: large-scale distributed search needs OpenSearch/Elastic credentials, cluster sizing, backups, monitoring, and deployment on the production VPS/infrastructure.
  - Blocked: the app exposes `SEARCH_PROVIDER`, `SEARCH_INDEX_MODE`, `OPENSEARCH_URL`, `OPENSEARCH_INDEX`, and `OPENSEARCH_API_KEY`, but no real cluster has been attached yet.

- **Embedding/vector infrastructure**
  - Blocked: full AI semantic search at international scale needs an embeddings provider, vector storage/indexing strategy, relevance evaluation, and cost limits.
  - Current app has semantic expansion and related-concept matching without a paid/vector search backend.

- **Production voice capture**
  - Blocked: the backend voice-search interpretation endpoint exists, but actual speech-to-text capture must be tested inside the native mobile app/browser permissions on real devices.

- **Relevance and scale hardening**
  - Blocked: thousands-of-users readiness still needs load testing, query analytics review, ranking tuning, privacy/GEO policy decisions, and OpenSearch/Elastic failover testing.

---

## 11. SEO & Discoverability System

Current status: upgraded to in-product completion. The app now has SEO previews, focus keyword storage, metadata validation, duplicate metadata checks, NewsArticle/VideoObject/PodcastEpisode/Review/FAQ validation, video/podcast/category sitemaps, Google News readiness metadata, indexing queue records, AI SEO output, internal-link approval records, and an SEO automation dashboard.

Remaining blocked items:

- **Google Search Console and Publisher Center**
  - Blocked: real Search Console verification, Google News Publisher Center setup, and Google policy review require the live domain.

- **External validation and indexing**
  - Blocked: real indexing credentials, PageSpeed API credentials, Google rich-results validation, and crawl-error ingestion require third-party setup.

- **Production SEO QA**
  - Blocked: final structured-data validation, Google News approval, and search performance review must happen after the HTTPS domain is live.

---

## 12. AI & Automation System

Current status: upgraded to in-product completion. The app now has article automation jobs, summaries, key points, newsletter snippets, social snippets, SEO keywords, headline suggestions, meta generation, auto-tagging suggestions, category suggestions, translation review queue, voice narration script output, moderation scoring, recommendation output, AI usage dashboard, and smoke coverage.

Remaining blocked items:

- **Provider operations**
  - Blocked: production OpenAI usage requires secret-vault storage, key rotation policy, budget limits, and provider billing controls.

- **AI quality governance**
  - Blocked: large-scale launch still needs prompt/version evaluation, editorial review policy, model-cost monitoring, safety red-team review, and acceptance metrics.

- **Generated media/audio providers**
  - Blocked: final natural voice narration, large transcription workloads, and advanced multimodal features need provider decisions and cost limits.

---

## 13. Community & Social System

Current status: upgraded to in-product completion. The app now has reader profiles and preferences, public profile API, saved content, author follows, followed-author feed, forums/categories, topics, replies, topic voting and ranking, polls, reputation points, badges, leaderboard, moderation operations dashboard, comment analytics, and anti-abuse readiness flags.

Remaining blocked items:

- **Production notification fanout**
  - Blocked: author updates, community alerts, and segmented push/email notifications need production Firebase/APNs/email provider credentials.

- **Production moderation operations**
  - Blocked: thousands-of-users readiness needs abuse/load testing, moderator staffing rules, escalation policies, and legal community guidelines.

- **Media-backed profiles**
  - Blocked: avatar/file uploads for reader profiles need production media storage/CDN and scanning mode.

---

## 14. Newsletter & Email Marketing System

Current status: upgraded to in-product completion. The app now has double opt-in, verification tokens, subscriber preferences, segmented subscriber data, campaign template/A-B fields, welcome/breaking/weekly automations, dummy outbox delivery, open/click event tracking endpoint, subscriber growth reporting, and marketing dashboard smoke coverage.

Remaining blocked items:

- **Real sender domain**
  - Blocked: production delivery requires the live domain, SPF, DKIM, DMARC, bounce address, unsubscribe URL, and sender reputation warmup.

- **Email provider credentials**
  - Blocked: SendGrid/Brevo/Mailchimp/Amazon SES credentials and webhooks are required before real sending, real opens/clicks, bounce handling, and complaint handling.

- **Deliverability QA**
  - Blocked: inbox placement, template rendering across clients, provider rate limits, and compliance review must be tested after provider setup.

---

## 15. Monetization & Revenue System

Current status: upgraded to in-product completion. The app now has banner/native/video ad slots, CPM fields, GEO target fields, scheduling fields, sponsored campaign analytics/legal status, manual memberships, premium flags, affiliate click and revenue fields, product-review affiliate integration readiness, revenue analytics, sponsor metrics, and revenue forecasting.

Remaining blocked items:

- **Payment gateway**
  - Blocked: real subscriptions, paywall charging, invoices, taxes, refunds, and settlement require a payment provider decision. Payments are intentionally disabled for now.

- **Ad network / ad server**
  - Blocked: programmatic ads, dynamic video ad insertion, advertiser reporting, and real CPM revenue need Google Ad Manager/AdSense or another ad-server account.

- **Commercial/legal operations**
  - Blocked: sponsor contracts, affiliate compliance, tax/legal review, invoice workflow, and revenue settlement need business-side setup before launch.
