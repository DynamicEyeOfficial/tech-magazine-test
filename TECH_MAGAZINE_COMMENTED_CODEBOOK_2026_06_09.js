/**
 * Tech Magazine Commented Codebook
 * Generated for developer handoff on 2026-06-09.
 *
 * This file is documentation written as code. It does not run the product.
 * Its job is to explain the real source tree, route ownership, deployment
 * flow, QA gates, and production rules in a clean developer-readable format.
 *
 * Why this exists:
 * - The production-tested source files are already large and QA-passed.
 * - Adding random comments throughout those files would create risk and noise.
 * - This codebook gives developers the missing comments in one organized place.
 */

export const TechMagazineCodebook = {
  product: {
    name: "Tech Magazine",
    stagingUrl: "https://tech-magazine-test.onrender.com",
    repository: "https://github.com/DynamicEyeOfficial/tech-magazine-test",
    renderService: "tech-magazine-test",
    purpose:
      "Professional technology media platform with public client, protected admin, CMS, newsroom workflow, reader accounts, media modules, monetization, analytics, SEO, APIs, mobile paths, security, and operations."
  },

  /**
   * High-level runtime.
   *
   * One Node server currently serves:
   * - public SPA shell
   * - admin dashboard shell
   * - REST APIs
   * - GraphQL endpoint
   * - RSS/sitemap/AMP routes
   * - WebSocket workflow channel
   *
   * SQLite is the current staging runtime. PostgreSQL is prepared as a
   * migration path, not the default active runtime yet.
   */
  runtime: {
    server: "Node.js ESM single-server app",
    publicClient: "public/index.html + public/app.js",
    adminClient: "server-rendered admin shell + public/admin.js",
    database: "SQLite staging, PostgreSQL migration path",
    realtime: "/api/workflow/realtime WebSocket",
    deployment: "Render Docker web service",
    emailMode: "dummy outbox until real domain/provider setup",
    paymentMode: "none/manual membership mode"
  },

  /**
   * Source ownership map.
   *
   * When a developer needs to change a feature, start with the file that owns
   * that feature below. Do not create duplicate logic in a random file.
   */
  files: {
    "server.js": {
      owns: [
        "HTTP server",
        "public shell routes",
        "admin shell routes",
        "admin authentication",
        "reader authentication APIs",
        "REST API routes",
        "GraphQL endpoint",
        "WebSocket workflow endpoint",
        "security headers",
        "admin redirects",
        "file upload endpoints",
        "RSS, sitemap, AMP routes"
      ],
      changeWhen: [
        "adding an API",
        "adding a protected admin route",
        "changing auth/session behavior",
        "adding a webhook or integration endpoint",
        "changing public SEO/RSS/sitemap route behavior"
      ],
      warnings: [
        "Keep admin auth separate from reader auth.",
        "Never expose admin credentials in public HTML or docs.",
        "Protected admin routes must redirect or deny when logged out.",
        "Reader tokens must never authorize admin APIs."
      ]
    },

    "db.js": {
      owns: [
        "database schema",
        "seed data",
        "content queries",
        "article persistence",
        "role and user persistence",
        "reader accounts",
        "workflow data",
        "comments and community",
        "media records",
        "newsletter records",
        "monetization records",
        "analytics snapshots",
        "source import records",
        "events, jobs, startups, devices, reviews"
      ],
      changeWhen: [
        "a feature needs stored records",
        "a table/field is added",
        "a query or report changes",
        "seed data changes",
        "role or permission defaults change"
      ],
      warnings: [
        "Treat schema changes as migration work.",
        "Keep seed credentials private and environment-driven.",
        "After changing persistence, run smoke and use-case QA."
      ]
    },

    "public/app.js": {
      owns: [
        "public hash router",
        "homepage rendering",
        "search UI",
        "article page UI",
        "reader account UI",
        "bookmarks and follows",
        "comments and community UI",
        "notifications UI",
        "feed and IT Rooms UI",
        "videos, podcasts, reviews UI",
        "events, jobs, startups, devices UI",
        "language switching",
        "dark/light theme",
        "public SPA analytics tracking"
      ],
      changeWhen: [
        "adding a public page",
        "changing public navigation",
        "changing reader account UX",
        "changing language/theme behavior",
        "changing public page cards/forms/buttons"
      ],
      warnings: [
        "Do not add admin-only links or controls here.",
        "Mobile layout must be tested after public UI changes.",
        "Language changes must test English, French, and Arabic RTL."
      ]
    },

    "public/admin.js": {
      owns: [
        "admin dashboard UI",
        "admin route rendering",
        "CMS forms",
        "role-aware panels",
        "users and roles UI",
        "workflow forms",
        "news imports UI",
        "media, newsletter, monetization UI",
        "analytics, SEO, security, operations panels"
      ],
      changeWhen: [
        "adding an admin page",
        "changing admin form behavior",
        "changing role/permission visibility",
        "changing dashboard cards",
        "changing admin success/error messages"
      ],
      warnings: [
        "Admin has sign-in only; never add admin signup.",
        "Every POST-style form needs validation and clear feedback.",
        "Test admin, editor, reporter, reader, and logged-out access."
      ]
    },

    "public/styles.css": {
      owns: [
        "public and admin visual system",
        "layout",
        "cards",
        "forms",
        "buttons",
        "responsive behavior",
        "dark/light themes",
        "animations",
        "mobile polish"
      ],
      changeWhen: [
        "fixing visual layout",
        "uplifting UI",
        "adding components",
        "changing theme or responsive rules"
      ],
      warnings: [
        "Run visual QA after CSS edits.",
        "Avoid text overlap and clipped buttons.",
        "Check desktop and mobile screenshots."
      ]
    },

    "config.js": {
      owns: ["environment parsing", "runtime defaults", "feature configuration"],
      warnings: ["Secrets belong in environment variables, never committed source."]
    },

    "cache.js": {
      owns: ["cache helpers", "rate-limit helpers", "Redis wiring path"],
      warnings: ["Single-instance staging can run without Redis; production scaling should configure Redis."]
    },

    "ai.js": {
      owns: ["OpenAI integration path", "AI summaries", "AI SEO", "AI tags", "AI translation", "AI automation status"],
      warnings: ["OPENAI_API_KEY must stay private and should be rotated if exposed."]
    },

    "analytics-integrations.js": {
      owns: ["GA4", "GTM", "Search Console verification", "Matomo integration status"],
      warnings: ["Provider IDs are production setup items, not hardcoded source values."]
    },

    "media-storage.js": {
      owns: ["local media storage", "cloud storage readiness", "CDN readiness", "media optimization status"],
      warnings: ["Production should use object storage/CDN, not only local disk."]
    },

    "video-streaming.js": {
      owns: ["video provider status", "HLS/DASH readiness", "adaptive video delivery checks"],
      warnings: ["Real streaming needs CDN/storage/transcoding provider setup."]
    },

    "email.js": {
      owns: ["dummy email outbox", "SendGrid adapter", "Brevo adapter", "SES adapter"],
      warnings: ["Do not send real email until domain DNS and provider keys are configured."]
    },

    "push.js": {
      owns: ["Firebase/browser/mobile push readiness", "push provider status"],
      warnings: ["Production push needs Firebase service account and device registration testing."]
    },

    "worker.js": {
      owns: ["background queue processing", "email outbox delivery path", "future background jobs"],
      warnings: ["Enable worker for real queued sending/background operations."]
    },

    "postgres-adapter.js": {
      owns: ["PostgreSQL migration helpers", "schema rehearsal support"],
      warnings: [
        "Do not switch DATABASE_CLIENT=postgres until rehearsal passes.",
        "Run full smoke against PostgreSQL before production migration."
      ]
    },

    "news-ingestion.js": {
      owns: ["source imports", "dedupe", "keyword policy", "risk scoring", "inspection routing"],
      warnings: ["Risky imports must go to inspection instead of auto-publish."]
    },

    "news-sources.js": {
      owns: ["source URLs", "source priority", "exclude keywords", "required keywords", "source policy defaults"],
      warnings: ["Source quality rules should be reviewed before increasing automation."]
    }
  },

  /**
   * Public route map.
   *
   * Public routes use hash routing in public/app.js.
   * Example full URL: https://tech-magazine-test.onrender.com/#/search
   */
  publicRoutes: [
    "#/",
    "#/search",
    "#/sections",
    "#/feed",
    "#/it-rooms",
    "#/mobile",
    "#/videos",
    "#/podcasts",
    "#/reviews",
    "#/live",
    "#/newsletter",
    "#/membership",
    "#/community",
    "#/leaderboard",
    "#/notifications",
    "#/account",
    "#/article/{slug}",
    "#/category/{slug}",
    "#/author/{id}",
    "#/events",
    "#/event/{slug}",
    "#/jobs",
    "#/job/{slug}",
    "#/startups",
    "#/startup/{slug}",
    "#/devices",
    "#/device/{slug}",
    "#/compare/{slug}",
    "#/about",
    "#/contact",
    "#/authors",
    "#/trust-center",
    "#/advertise",
    "#/media-kit",
    "#/careers",
    "#/editorial",
    "#/editorial-team",
    "#/ethics",
    "#/privacy",
    "#/cookies",
    "#/terms"
  ],

  /**
   * Admin route map.
   *
   * Admin pages are protected by admin session auth.
   * Logged-out access to /admin must redirect to /admin/login.
   */
  adminRoutes: [
    "/admin",
    "/admin/articles",
    "/admin/articles/new",
    "/admin/workflow",
    "/admin/homepage",
    "/admin/breaking-news",
    "/admin/live-blogs",
    "/admin/news-imports",
    "/admin/news-imports/inspection",
    "/admin/news-imports/performance",
    "/admin/videos",
    "/admin/podcasts",
    "/admin/reviews",
    "/admin/devices",
    "/admin/ai-assistant",
    "/admin/site-cms",
    "/admin/monetization",
    "/admin/ads",
    "/admin/affiliates",
    "/admin/memberships",
    "/admin/events",
    "/admin/jobs",
    "/admin/startups",
    "/admin/directory",
    "/admin/community",
    "/admin/it-rooms",
    "/admin/media",
    "/admin/comments",
    "/admin/subscribers",
    "/admin/newsletter/campaigns",
    "/admin/notifications",
    "/admin/email-outbox",
    "/admin/users",
    "/admin/roles",
    "/admin/categories",
    "/admin/tags",
    "/admin/audit",
    "/admin/backup",
    "/admin/analytics",
    "/admin/retention",
    "/admin/seo",
    "/admin/languages",
    "/admin/api",
    "/admin/future",
    "/admin/infrastructure",
    "/admin/database",
    "/admin/launch",
    "/admin/security",
    "/admin/operations",
    "/admin/settings"
  ],

  apiGroups: {
    publicContent: [
      "/api/bootstrap",
      "/api/articles/{slug}",
      "/api/search",
      "/api/search/suggestions",
      "/api/search/trending",
      "/api/feed",
      "/api/it-rooms",
      "/api/videos",
      "/api/podcasts",
      "/api/reviews",
      "/api/events",
      "/api/jobs",
      "/api/startups",
      "/api/devices"
    ],
    reader: [
      "/api/reader/register",
      "/api/reader/login",
      "/api/reader/me",
      "/api/reader/profile",
      "/api/reader/bookmarks",
      "/api/notifications",
      "/api/notifications/preferences"
    ],
    adminAndWorkflow: [
      "/admin/*",
      "/api/workflow/overview",
      "/api/workflow/realtime"
    ],
    developerAndPartner: [
      "/api/v1/openapi.json",
      "/api/v1/status",
      "/api/v1/news",
      "/api/v1/articles",
      "/api/v1/media",
      "/graphql"
    ],
    seoAndDiscovery: [
      "/sitemap.xml",
      "/robots.txt",
      "/news-sitemap.xml",
      "/video-sitemap.xml",
      "/podcast-sitemap.xml",
      "/category-sitemap.xml",
      "/amp/articles/{slug}"
    ]
  },

  qaCommands: [
    "npm run check",
    "npm run smoke",
    "npm run audit:separated",
    "npm run qa:full-ui",
    "npm run qa:visual",
    "npm run qa:use-cases",
    "npm run qa:news-editor",
    "npm run qa:news-ingestion",
    "SMOKE_BASE_URL=https://tech-magazine-test.onrender.com npm run smoke",
    "SMOKE_BASE_URL=https://tech-magazine-test.onrender.com QA_BASE_URL=https://tech-magazine-test.onrender.com npm run qa:full-ui"
  ],

  productionChecklist: [
    "Attach real domain and SSL.",
    "Set SITE_URL to production domain.",
    "Rotate all secrets and admin passwords.",
    "Decide SQLite vs PostgreSQL production path and test it.",
    "Configure Redis before horizontal scaling.",
    "Configure verified email provider and DNS records.",
    "Configure push provider credentials.",
    "Configure analytics provider IDs.",
    "Move media to object storage/CDN.",
    "Enable payment provider only when real paid memberships are required.",
    "Run load test, backup drill, security review, and full product owner QA."
  ]
};

export default TechMagazineCodebook;
