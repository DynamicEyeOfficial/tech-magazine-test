import { firebaseConfig, firebaseVapidKey } from "./firebase-config.js";

let categories = [
  { name: "AI", slug: "ai", color: "#62d6ff", icon: "AI", description: "Models, agents, automation, and applied machine intelligence." },
  { name: "Cybersecurity", slug: "cybersecurity", color: "#ff637d", icon: "SEC", description: "Threat intelligence, privacy, risk, and practical defense." },
  { name: "Software", slug: "software", color: "#9b7cff", icon: "DEV", description: "Developer tools, SaaS, open source, and product platforms." },
  { name: "Hardware", slug: "hardware", color: "#ffbd59", icon: "CPU", description: "Chips, devices, infrastructure, laptops, and components." },
  { name: "Startups", slug: "startups", color: "#48e29a", icon: "VC", description: "Founders, funding, product strategy, and market shifts." },
  { name: "Gaming", slug: "gaming", color: "#ff70c8", icon: "XP", description: "Games, engines, esports, hardware, and culture." },
  { name: "Cloud", slug: "cloud", color: "#4d9fff", icon: "CLD", description: "Cloud platforms, DevOps, Kubernetes, and infrastructure." },
  { name: "Reviews", slug: "reviews", color: "#ffd166", icon: "★", description: "Hands-on analysis of devices, apps, and services." },
  { name: "Tutorials", slug: "tutorials", color: "#a1e887", icon: "HOW", description: "Practical explainers, guides, and engineering walkthroughs." },
  { name: "Enterprise Tech", slug: "enterprise-tech", color: "#bac4d8", icon: "IT", description: "CIO strategy, procurement, operations, and business systems." }
];

let channels = [
  { name: "News", slug: "news", description: "Fast-moving technology stories and market updates." },
  { name: "Articles", slug: "articles", description: "Longer analysis, explainers, and editorial insight." },
  { name: "Interviews", slug: "interviews", description: "Conversations with technology leaders, founders, and operators." },
  { name: "Top 10", slug: "top-10", description: "Ranked lists for platforms, leaders, companies, and trends." },
  { name: "Videos", slug: "videos", description: "Video-led technology coverage and executive briefings." },
  { name: "Events", slug: "events", description: "Industry events, webinars, conferences, and live sessions." },
  { name: "Reports", slug: "reports", description: "Research reports, whitepapers, and enterprise briefings." }
];

let authors = [
  {
    id: "maya-chen",
    name: "Maya Chen",
    role: "Chief Editor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    bio: "Leads editorial strategy across AI, enterprise IT, and technology policy.",
    verified: true,
    location: "Singapore / New York",
    beat: "AI strategy, enterprise IT, technology policy",
    experienceYears: 14,
    contactEmail: "maya.chen@techmag.local",
    expertise: ["AI governance", "enterprise platforms", "media technology", "technology policy"],
    credentials: ["Former enterprise technology editor", "AI policy roundtable moderator", "Editorial standards owner"],
    sourcePolicy: "Uses named enterprise leaders, primary documents, product briefings, and independently checked technical context before publication.",
    correctionsPolicy: "Corrections are reviewed by the chief editor and appended to the story record when a material detail changes.",
    social: { linkedin: "https://www.linkedin.com/company/tech-magazine", x: "https://x.com/techmagazine" }
  },
  {
    id: "omar-haddad",
    name: "Omar Haddad",
    role: "Senior Editor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    bio: "Covers cloud architecture, security, and platform engineering.",
    verified: true,
    location: "Dubai / London",
    beat: "Cybersecurity, cloud infrastructure, platform engineering",
    experienceYears: 11,
    contactEmail: "omar.haddad@techmag.local",
    expertise: ["zero trust", "cloud cost governance", "Kubernetes", "security operations"],
    credentials: ["Cloud architecture analyst", "Security conference speaker", "Enterprise infrastructure reviewer"],
    sourcePolicy: "Prioritizes vendor documentation, practitioner interviews, incident reports, and reproducible product evidence.",
    correctionsPolicy: "Security and infrastructure updates are rechecked against source material before correction notes are published.",
    social: { linkedin: "https://www.linkedin.com/company/tech-magazine" }
  },
  {
    id: "lina-park",
    name: "Lina Park",
    role: "Writer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    bio: "Writes about consumer tech, developer culture, and startup products.",
    verified: true,
    location: "Seoul / San Francisco",
    beat: "Consumer technology, startups, developer culture",
    experienceYears: 8,
    contactEmail: "lina.park@techmag.local",
    expertise: ["mobile products", "startup launches", "developer tools", "gaming hardware"],
    credentials: ["Product review lead", "Startup interview host", "Developer community reporter"],
    sourcePolicy: "Combines product testing notes, founder interviews, release documents, and audience feedback signals.",
    correctionsPolicy: "Product details are updated when manufacturers clarify specifications, pricing, or availability.",
    social: { linkedin: "https://www.linkedin.com/company/tech-magazine", x: "https://x.com/techmagazine" }
  }
];

let articles = [
  {
    title: "AI Agents Move From Demos To Real Newsroom Workflows",
    slug: "ai-agents-newsroom-workflows",
    subtitle: "Editorial teams are testing assistants for research, metadata, and audience operations.",
    category: "ai",
    author: "maya-chen",
    date: "2026-05-18",
    minutes: 6,
    views: 12840,
    featured: true,
    breaking: true,
    trending: true,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=82",
    caption: "AI systems are becoming practical tools inside publishing teams.",
    tags: ["AI agents", "media tech", "automation"],
    channel: "news",
    body: [
      "Technology publishers are moving beyond novelty prompts and testing AI agents inside daily operations. The most useful deployments are narrow: drafting summaries, checking SEO metadata, clustering sources, and helping editors package stories for different audiences.",
      "The strongest teams still keep human judgment at the center. Editors approve every claim, reporters own interviews, and the systems are treated as newsroom software rather than replacement writers.",
      "Over the next year, expect magazine platforms to expose AI suggestions directly in CMS workflows: tags, related links, schema hints, and newsletter subject lines."
    ]
  },
  {
    title: "Zero Trust Security Becomes A Board-Level Budget Priority",
    slug: "zero-trust-board-budget-priority",
    subtitle: "Enterprises are refactoring identity, device posture, and network access around continuous verification.",
    category: "cybersecurity",
    author: "omar-haddad",
    date: "2026-05-17",
    minutes: 5,
    views: 8940,
    featured: true,
    trending: true,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1600&q=82",
    caption: "Security strategy is shifting from perimeter control to continuous verification.",
    tags: ["zero trust", "identity", "risk"],
    channel: "articles",
    body: [
      "Zero trust has matured from a vendor slogan into a practical operating model. The new priority is connecting identity, endpoint health, application access, and audit data into one policy layer.",
      "Security leaders say the hardest part is not buying tools. It is simplifying legacy access rules and making the experience usable enough that employees do not route around it.",
      "The next wave will focus on automated remediation, stronger phishing-resistant authentication, and better visibility for hybrid workforces."
    ]
  },
  {
    title: "Cloud Cost Dashboards Are Finally Reaching Product Teams",
    slug: "cloud-cost-dashboards-product-teams",
    subtitle: "FinOps practices are moving closer to engineering decisions before bills arrive.",
    category: "cloud",
    author: "omar-haddad",
    date: "2026-05-16",
    minutes: 4,
    views: 7310,
    featured: true,
    trending: true,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=82",
    caption: "Cloud spending is becoming a product design constraint.",
    tags: ["FinOps", "cloud cost", "DevOps"],
    channel: "interviews",
    body: [
      "Engineering teams are being asked to understand cost at feature level, not just infrastructure level. The result is a new generation of dashboards that tie usage, deployments, and unit economics together.",
      "Instead of waiting for finance to flag overages, teams can see the cost impact of a new data pipeline, model inference path, or customer-facing feature while the work is still in progress.",
      "The best FinOps cultures treat cost as observability: visible, shared, and actionable."
    ]
  },
  {
    title: "Inside The New Wave Of Developer-First Startup Launches",
    slug: "developer-first-startup-launches",
    subtitle: "Small teams are shipping infrastructure products with sharper positioning and faster feedback loops.",
    category: "startups",
    author: "lina-park",
    date: "2026-05-15",
    minutes: 5,
    views: 5150,
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1600&q=82",
    caption: "Developer tools startups are compressing the path from prototype to paid usage.",
    tags: ["startups", "developer tools", "go-to-market"],
    channel: "articles",
    body: [
      "The strongest developer-first startups are no longer relying on vague platform promises. They launch with sharp use cases, transparent pricing, excellent docs, and communities that create early trust.",
      "Founders say distribution now matters as much as architecture. Tutorials, changelogs, benchmark reports, and open examples often decide whether a tool gets adopted.",
      "That shift is making editorial coverage more technical, because readers want to see how a product behaves before they care about the pitch."
    ]
  },
  {
    title: "The Practical Guide To Building A Faster Article Page",
    slug: "faster-article-page-guide",
    subtitle: "A performance checklist for media websites that need speed without losing design quality.",
    category: "tutorials",
    author: "lina-park",
    date: "2026-05-14",
    minutes: 7,
    views: 4520,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=82",
    caption: "Performance is a product feature for news platforms.",
    tags: ["performance", "SEO", "frontend"],
    channel: "top-10",
    body: [
      "Fast article pages are built from many small decisions: compressed images, limited third-party scripts, predictable layout, cached API responses, and server-side rendering for the first view.",
      "For publishers, performance is directly connected to search traffic, reader trust, and advertising revenue.",
      "A strong CMS should make the fast path easy by default: responsive image fields, clean embeds, lazy sections, and metadata controls built into the article workflow."
    ]
  },
  {
    title: "Handheld Gaming PCs Are Forcing Laptop Makers To Adapt",
    slug: "handheld-gaming-pcs-laptop-makers",
    subtitle: "Gaming hardware is blurring the line between console, PC, and portable workstation.",
    category: "gaming",
    author: "lina-park",
    date: "2026-05-13",
    minutes: 4,
    views: 3890,
    trending: true,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=82",
    caption: "Portable gaming hardware is becoming a serious product category.",
    tags: ["gaming", "hardware", "portable PC"],
    channel: "videos",
    body: [
      "Handheld gaming PCs are pushing laptop makers to rethink thermal design, battery targets, and software overlays.",
      "The devices are not just smaller laptops; they need console-like simplicity with PC-level flexibility.",
      "Expect more competition around custom chips, docked performance, and cloud save integrations."
    ]
  },
  {
    title: "Open Source Maintainers Want Better Security Funding",
    slug: "open-source-security-funding",
    subtitle: "Critical software projects are asking enterprises to support the dependencies they rely on.",
    category: "software",
    author: "maya-chen",
    date: "2026-05-12",
    minutes: 5,
    views: 3420,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=82",
    caption: "Open source security has become infrastructure work.",
    tags: ["open source", "security", "funding"],
    channel: "reports",
    body: [
      "Open source maintainers are asking companies to treat security work as shared infrastructure, not volunteer labor.",
      "Several foundations are experimenting with dependency funding, vulnerability response pools, and maintainer grants.",
      "For enterprise teams, the lesson is simple: the software supply chain has a human supply chain underneath it."
    ]
  },
  {
    title: "Laptop Chips Are Becoming The New AI Battleground",
    slug: "laptop-chips-ai-battleground",
    subtitle: "NPUs and local inference are changing how laptop makers sell performance.",
    category: "hardware",
    author: "omar-haddad",
    date: "2026-05-11",
    minutes: 4,
    views: 4180,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=82",
    caption: "AI acceleration is moving into everyday machines.",
    tags: ["chips", "laptops", "AI"],
    channel: "news",
    body: [
      "Laptop chip announcements are increasingly measured by AI acceleration, not just CPU and GPU numbers.",
      "The shift matters because local inference can reduce latency, improve privacy, and make software features feel more responsive.",
      "The challenge for hardware makers is proving that these AI features are useful now, not only in future demos."
    ]
  },
  {
    title: "GITEX AI Europe Sets The Agenda For Enterprise Automation",
    slug: "gitex-ai-europe-enterprise-automation",
    subtitle: "The event program points to procurement, data governance, and practical AI deployment as the biggest executive themes.",
    category: "enterprise-tech",
    author: "maya-chen",
    date: "2026-05-10",
    minutes: 3,
    views: 2980,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=82",
    caption: "Technology events are becoming practical planning hubs for enterprise teams.",
    tags: ["events", "enterprise AI", "automation"],
    channel: "events",
    body: [
      "Enterprise technology events are shifting from broad inspiration to practical implementation tracks.",
      "The strongest agendas now combine executive interviews, technical sessions, procurement guidance, and security requirements.",
      "For a magazine platform, event coverage should connect previews, live updates, sponsor pages, and post-event analysis."
    ]
  },
  {
    title: "Top 10 Digital Infrastructure Trends For The Next Budget Cycle",
    slug: "top-10-digital-infrastructure-trends",
    subtitle: "From edge AI to sustainable data centers, infrastructure leaders are preparing for a tighter and more automated year.",
    category: "enterprise-tech",
    author: "omar-haddad",
    date: "2026-05-09",
    minutes: 6,
    views: 3760,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=82",
    caption: "Infrastructure strategy is being reshaped by cost, AI demand, and energy constraints.",
    tags: ["top 10", "infrastructure", "data centers"],
    channel: "top-10",
    body: [
      "The next infrastructure cycle will be measured by resilience, automation, energy efficiency, and the ability to support AI workloads without uncontrolled cost growth.",
      "Leaders are prioritizing observability, platform engineering, hybrid cloud standards, and security-by-design.",
      "Ranked content gives readers a fast way to scan priorities while still linking into deeper analysis."
    ]
  }
];

let ads = [
  {
    placement: "home-banner",
    label: "Sponsored intelligence",
    headline: "Cloud security briefing placements available for enterprise partners.",
    body: "Reach technology leaders with native homepage sponsorship.",
    linkUrl: "#/advertise",
    linkLabel: "Contact sales",
    active: true
  },
  {
    placement: "article-inline",
    label: "Partner briefing",
    headline: "Modernize your cloud security stack",
    body: "A native inline placement for relevant enterprise technology sponsors.",
    linkUrl: "#/advertise",
    linkLabel: "Explore sponsorship",
    active: true
  }
];
let membershipPlans = [];
let affiliateLinks = [];
let communityTopics = [];
let communityPolls = [];
let itRooms = [];
let feedItems = [];
let socialEngagement = null;
let communitySocialExperience = null;
let mobileExperience = null;
let commercialExperience = null;
let trustComplianceExperience = null;
let newsletterExperience = null;
let directoryItems = [];
let analyticsConfig = {};
let publicCredibility = { stats: {}, proofPoints: [], standards: [], externalProof: [] };
let audienceConversion = {
  subscribers: 0,
  confirmedSubscribers: 0,
  readerAccounts: 0,
  savedArticles: 0,
  sentAlerts: 0,
  notificationPreferences: 0,
  segments: [],
  capabilities: {}
};
let breakingNews = [];
let liveEvents = [];
let conferenceEvents = [];
let jobPosts = [];
let jobExperience = null;
let startupProfiles = [];
let devices = [];
let videos = [];
let videoPlaylists = [];
let videoCategories = [];
let videoPlatform = {};
let podcastShows = [];
let podcastEpisodes = [];
let podcastCategories = [];
let podcastPlatform = {};
let productReviews = [];
let mediaOptimization = {
  cdnBaseUrl: "",
  optimizationMode: "metadata",
  imageWidths: [480, 768, 1200, 1600],
  adaptiveImages: true
};
let languages = [
  { code: "en", name: "English", nativeName: "English", direction: "ltr", enabled: true, sortOrder: 0 }
];
let currentLanguage = localStorage.getItem("tm_language") || "en";
const uiTranslations = {
  ar: {
    home: "الرئيسية",
    search: "بحث",
    sections: "الأقسام",
    video: "فيديو",
    podcasts: "بودكاست",
    reviews: "مراجعات",
    live: "مباشر",
    jobs: "وظائف",
    devices: "الأجهزة",
    newsletter: "النشرة",
    membership: "العضوية",
    community: "المجتمع",
    leaderboard: "المتصدرون",
    alerts: "التنبيهات",
    profile: "الملف الشخصي",
    signIn: "تسجيل الدخول",
    categories: "الفئات",
    magazine: "المجلة",
    trending: "الرائج",
    breakingNews: "خبر عاجل",
    sponsoredStory: "قصة ممولة",
    editorPick: "اختيار المحرر",
    readStory: "اقرأ القصة",
    explore: "استكشف",
    featuredDesk: "مكتب التحرير",
    editorsWatching: "قصص يتابعها المحررون",
    liveSignal: "إشارة مباشرة",
    trendingNow: "الرائج الآن",
    mostPopular: "الأكثر قراءة",
    personalizedForYou: "مخصص لك",
    smartRecommendations: "توصيات ذكية",
    basedOnSignals: "بناء على قراءاتك",
    newsroomSignals: "موصى به من إشارات غرفة الأخبار",
    tuneProfile: "عدّل ملفك",
    signInPersonalize: "سجّل لتخصيص المحتوى",
    latestFeed: "آخر الأخبار",
    freshCoverage: "تغطية تقنية جديدة",
    topics: "المواضيع",
    browseNewsroom: "تصفح غرفة الأخبار",
    languageNoticeTitle: "الموقع يعمل الآن بالعربية",
    languageNoticeBody: "تتغير الواجهة واتجاه القراءة، وتظهر ترجمات المقالات عندما يضيفها فريق التحرير."
  }
};
let siteSettings = {
  brandName: "Tech Magazine",
  brandTagline: "Professional IT newsroom",
  footerTagline: "AI, security, cloud, startups, reviews",
  footerText: "A professional technology media platform for AI, cybersecurity, cloud, startups, reviews, tutorials, and enterprise IT insight.",
  logoUrl: "/assets/logo.svg",
  primaryColor: "#62d6ff",
  secondaryColor: "#48e29a",
  dangerColor: "#ff637d",
  backgroundColor: "#071014",
  softBackgroundColor: "#0e1a20",
  panelColor: "#101f27",
  strongPanelColor: "#152934",
  textColor: "#f4f7f8",
  mutedColor: "#9fb1ba",
  borderRadius: "8",
  showUtilityBar: true,
  utilityLinks: [],
  breakingBannerEnabled: false,
  breakingBannerText: "",
  breakingBannerUrl: "#/",
  marketingBannerEnabled: false,
  marketingBannerLabel: "",
  marketingBannerHeadline: "",
  marketingBannerBody: "",
  marketingBannerUrl: "#/advertise",
  marketingBannerCta: "Learn more",
  homepageSections: {
    featuredDesk: true,
    trendingPanel: true,
    sponsoredBanner: true,
    magazineGrid: true,
    latestFeed: true,
    categoryShowcase: true,
    newsletter: true
  }
};
let notifications = [];
let notificationPreferences = null;
let savedSearchFilters = [];

const app = document.querySelector("#app");
const nav = document.querySelector("[data-nav]");
const footerCategories = document.querySelector("[data-footer-categories]");
let heroTimer = null;
let liveTimer = null;
let lastTrackedRoute = "";
let engagementStartedAt = Date.now();
let engagementMaxScroll = 0;
let engagementArticleSlug = "";
let engagementPath = window.location.hash || "#/";
let themeMode = localStorage.getItem("tm_theme") || "dark";
let visibleLatestCount = 8;
let latestFeedObserver = null;
let progressTicking = false;
let readerSession = {
  token: localStorage.getItem("tm_reader_token") || "",
  reader: null,
  bookmarks: [],
  social: { follows: [], reputation: { points: 0, badges: [] }, gamification: null }
};
let readerExperience = null;
let activePodcastAudio = null;
let activePodcastEpisode = null;

function categoryBySlug(slug) {
  return categories.find((category) => category.slug === slug) || categories[0];
}

function isQaArtifact(value = "") {
  return /^(audit|smoke|qa)(-|\\s)|\\s(audit|smoke)\\s|\\b(test|qa)\\b/i.test(String(value || ""));
}

function publicCategories() {
  return categories.filter((category) => !isQaArtifact(`${category.slug} ${category.name}`));
}

function authorById(id) {
  return authors.find((author) => author.id === id) || authors[0];
}

function parseAuthorJson(value, fallback) {
  if (Array.isArray(value) || (value && typeof value === "object")) return value;
  try {
    return JSON.parse(value || "");
  } catch {
    return fallback;
  }
}

function normalizeAuthor(author) {
  return {
    ...author,
    verified: Boolean(author.verified),
    expertise: parseAuthorJson(author.expertise, parseAuthorJson(author.expertiseJson, [])),
    credentials: parseAuthorJson(author.credentials, parseAuthorJson(author.credentialsJson, [])),
    social: parseAuthorJson(author.social, parseAuthorJson(author.socialJson, {})),
    experienceYears: Number(author.experienceYears || author.experience_years || 0),
    contactEmail: author.contactEmail || author.contact_email || "",
    sourcePolicy: author.sourcePolicy || author.source_policy || "",
    correctionsPolicy: author.correctionsPolicy || author.corrections_policy || ""
  };
}

function authorTrustMetrics(author, authorArticles) {
  const totalViews = authorArticles.reduce((sum, article) => sum + Number(article.views || 0), 0);
  const avgMinutes = authorArticles.length
    ? Math.round(authorArticles.reduce((sum, article) => sum + Number(article.minutes || 0), 0) / authorArticles.length)
    : 0;
  return { totalViews, avgMinutes };
}

function authorExpertiseChips(author, limit = 6) {
  return (author.expertise || [])
    .slice(0, limit)
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");
}

function authorSocialLinks(author) {
  const social = author.social || {};
  const links = [
    ["linkedin", "LinkedIn", social.linkedin],
    ["x", "X", social.x],
    ["website", "Website", social.website]
  ].filter((item) => item[2]);
  return links.map(([, label, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${label}</a>`).join("");
}

function sourceHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function trustStatusLabel(status = "") {
  return String(status || "editorial_reviewed")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function articleTrustDetails(article, author) {
  const sourceUrl = article.sourceUrl || article.canonicalUrl || "";
  const sourceName = article.sourceName || sourceHost(sourceUrl) || "Tech Magazine newsroom";
  const origin = article.contentOrigin || (article.canonicalUrl ? "imported" : article.sponsored ? "sponsored" : "original");
  const status = article.factCheckStatus || "editorial_reviewed";
  return {
    origin,
    sourceUrl,
    sourceName,
    status,
    statusLabel: trustStatusLabel(status),
    checkedBy: article.factCheckedBy || "Editorial desk",
    checkedAt: article.factCheckedAt || article.date,
    score: Number(article.trustScore || 85),
    summary: article.trustSummary || (origin === "imported"
      ? "Imported story reviewed through source controls, duplicate checks, risk scoring, and canonical attribution."
      : "Original newsroom article with named author, visible category, source policy, SEO metadata, and correction route."),
    disclosure: article.disclosureNote || (article.sponsored
      ? "This story is commercial content and must remain clearly labeled for readers."
      : "This story was produced under Tech Magazine editorial standards. Commercial teams do not control editorial conclusions."),
    correction: article.correctionNote || "",
    correctionAt: article.correctionUpdatedAt || "",
    authorPolicy: author.sourcePolicy || ""
  };
}

function articleTrustPanel(article, author) {
  const trust = articleTrustDetails(article, author);
  return `
    <section class="article-trust-panel" id="trust">
      <div class="article-trust-main">
        <span>Trust and source transparency</span>
        <h2>${escapeHtml(trust.summary)}</h2>
        <p>${escapeHtml(trust.disclosure)}</p>
        ${trust.correction ? `<div class="correction-note"><strong>Correction / update</strong><p>${escapeHtml(trust.correction)}</p>${trust.correctionAt ? `<small>Updated ${escapeHtml(trust.correctionAt)}</small>` : ""}</div>` : ""}
      </div>
      <div class="article-trust-facts">
        <article><span>Origin</span><strong>${escapeHtml(trust.origin)}</strong></article>
        <article><span>Fact check</span><strong>${escapeHtml(trust.statusLabel)}</strong><small>${escapeHtml(trust.checkedBy)} / ${escapeHtml(trust.checkedAt)}</small></article>
        <article><span>Trust score</span><strong>${Math.max(0, Math.min(100, trust.score)).toLocaleString()}/100</strong></article>
        <article><span>Primary source</span>${trust.sourceUrl ? `<a href="${escapeHtml(trust.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(trust.sourceName)}</a>` : `<strong>${escapeHtml(trust.sourceName)}</strong>`}</article>
      </div>
      ${trust.authorPolicy ? `<p class="article-source-policy">${escapeHtml(author.name)} source method: ${escapeHtml(trust.authorPolicy)}</p>` : ""}
    </section>
  `;
}

function credibilityStats() {
  const stats = publicCredibility.stats || {};
  return [
    { label: "Published articles", value: stats.publishedArticles || articles.length, detail: `${Number(stats.originalArticles || 0).toLocaleString()} original / ${Number(stats.importedArticles || 0).toLocaleString()} imported` },
    { label: "Verified authors", value: stats.verifiedAuthors || authors.filter((author) => author.verified).length, detail: `${Number(stats.totalAuthors || authors.length).toLocaleString()} public profiles` },
    { label: "Average trust score", value: `${Number(stats.averageTrustScore || 85).toLocaleString()}/100`, detail: "Across active article trust metadata" },
    { label: "Enabled sources", value: stats.enabledSources || 0, detail: `${Number(stats.highTrustSources || 0).toLocaleString()} high-trust source rules` },
    { label: "Reader reach", value: Number(stats.totalViews || 0).toLocaleString(), detail: "Tracked article view total" },
    { label: "Content network", value: Number((stats.categories || 0) + (stats.channels || 0)).toLocaleString(), detail: "Categories and publishing sections" }
  ];
}

function credibilityBand({ compact = false } = {}) {
  const proof = publicCredibility.proofPoints?.length ? publicCredibility.proofPoints : [
    { label: "Editorial accountability", title: "Named authors and visible trust panels", body: "Article pages show author profiles, fact-check status, source context, disclosure notes, and correction history when available.", url: "#/editorial" },
    { label: "Commercial clarity", title: "Sponsored content is labeled", body: "Advertising and sponsorships are separated from editorial conclusions.", url: "#/advertise" }
  ];
  const stats = credibilityStats();
  return `
    <section class="content-band credibility-band ${compact ? "compact" : ""}">
      <div class="section-heading">
        <span>Credibility signals</span>
        <h2>Built for reader trust, not anonymous publishing</h2>
        <a href="#/trust-center">Trust center</a>
      </div>
      <div class="credibility-stat-grid">
        ${stats.slice(0, compact ? 4 : 6).map((item) => `
          <article>
            <span>${escapeHtml(item.label)}</span>
            <strong>${typeof item.value === "number" ? Number(item.value).toLocaleString() : escapeHtml(item.value)}</strong>
            <p>${escapeHtml(item.detail)}</p>
          </article>
        `).join("")}
      </div>
      <div class="credibility-proof-grid">
        ${proof.slice(0, compact ? 2 : 4).map((item) => `
          <a href="${escapeHtml(item.url || "#/trust-center")}">
            <span>${escapeHtml(item.label)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function audienceMetricCards() {
  const audience = audienceConversion || {};
  return [
    { label: "Subscribers", value: audience.confirmedSubscribers || audience.subscribers || 0, detail: `${Number(audience.pendingSubscribers || 0).toLocaleString()} waiting for double opt-in` },
    { label: "Reader accounts", value: audience.readerAccounts || 0, detail: "Profiles, saved stories, and followed authors" },
    { label: "Saved articles", value: audience.savedArticles || 0, detail: "Cross-session reader libraries" },
    { label: "Sent alerts", value: audience.sentAlerts || 0, detail: "Breaking, live, category, and newsletter updates" }
  ];
}

function newsletterTopicControls(selectedSegment = "weekly-tech") {
  const fallback = [
    ["weekly-tech", "Weekly Tech"],
    ["ai-digest", "AI Digest"],
    ["security-alerts", "Security Alerts"],
    ["startup-brief", "Startup Brief"],
    ["gaming-weekly", "Gaming Weekly"]
  ];
  const fromCategories = publicCategories().slice(0, 8).map((category) => [`${category.slug}-brief`, category.name]);
  const options = [...fallback, ...fromCategories].filter((item, index, list) => list.findIndex((entry) => entry[0] === item[0]) === index);
  return `
    <fieldset class="topic-choice-grid">
      <legend>Choose your briefing</legend>
      ${options.slice(0, 10).map(([value, label], index) => `
        <label class="topic-choice">
          <input type="radio" name="segment" value="${escapeHtml(value)}" ${value === selectedSegment || (!selectedSegment && index === 0) ? "checked" : ""}>
          <span>${escapeHtml(label)}</span>
        </label>
      `).join("")}
    </fieldset>
  `;
}

function audienceConversionPanel({ compact = false } = {}) {
  const metrics = audienceMetricCards();
  const capabilities = audienceConversion.capabilities || {};
  const capabilityLabels = [
    ["doubleOptIn", "Double opt-in"],
    ["categorySubscriptions", "Topic subscriptions"],
    ["readerAlertPreferences", "Reader alert controls"],
    ["pushDeviceRegistration", "Push device registration"],
    ["serverSideRateLimiting", "Rate limited forms"]
  ];
  return `
    <section class="content-band audience-band ${compact ? "compact" : ""}">
      <div class="section-heading">
        <span>Audience engine</span>
        <h2>Built to turn casual readers into owned audience</h2>
        <a href="#/notifications">Manage alerts</a>
      </div>
      <div class="audience-metrics">
        ${metrics.slice(0, compact ? 3 : 4).map((item) => `
          <article>
            <span>${escapeHtml(item.label)}</span>
            <strong>${Number(item.value || 0).toLocaleString()}</strong>
            <p>${escapeHtml(item.detail)}</p>
          </article>
        `).join("")}
      </div>
      <div class="audience-proof-row">
        ${capabilityLabels.map(([key, label]) => `<span class="${capabilities[key] ? "ready" : ""}">${escapeHtml(label)}</span>`).join("")}
      </div>
    </section>
  `;
}

function articleAudienceCta(article, category) {
  return `
    <section class="article-audience-cta">
      <div>
        <span>Follow this beat</span>
        <h2>Get the next ${escapeHtml(category.name)} briefing before it trends</h2>
        <p>Subscribe to a focused email, save this story to your reader profile, or turn on alerts for breaking updates and live coverage.</p>
      </div>
      <form data-newsletter-form>
        <input type="hidden" name="segment" value="${escapeHtml(`${category.slug}-brief`)}">
        <label>Email address<input type="email" name="email" placeholder="you@example.com" required></label>
        <button class="button primary" type="submit">Subscribe to ${escapeHtml(category.name)}</button>
        <div class="inline-actions">
          <a class="button ghost" href="#/notifications">Alert preferences</a>
          <button class="button ghost" type="button" data-bookmark="${escapeHtml(article.slug)}">${readerSession.bookmarks.includes(article.slug) ? "Saved" : "Save story"}</button>
        </div>
        <p class="form-message" data-form-message></p>
      </form>
    </section>
  `;
}

function legitimacyPanel() {
  const stats = publicCredibility.stats || {};
  const externalProof = publicCredibility.externalProof || [];
  return `
    <section class="content-band legitimacy-panel">
      <div>
        <div class="section-heading">
          <span>Social proof policy</span>
          <h2>No fake awards, no fake press logos</h2>
        </div>
        <p>Tech Magazine can display press mentions, award badges, partner logos, and sponsor logos only when they are real, approved, and clearly labeled. Until then, the public trust layer shows operational proof: verified authors, visible corrections, source governance, analytics-backed readership, and transparent commercial labeling.</p>
        <div class="standards-links">
          ${(publicCredibility.standards || []).map((item) => `<a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a>`).join("")}
        </div>
      </div>
      <div class="proof-status-list">
        ${(externalProof.length ? externalProof : [
          { label: "Press mentions", status: "Ready to add", body: "Add only after real coverage exists." },
          { label: "Awards", status: "Ready to add", body: "Add only after verified nominations or wins." },
          { label: "Partner logos", status: "Media kit controlled", body: "Add approved partner logos with clear labeling." }
        ]).map((item) => `
          <article>
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.status)}</strong>
            <p>${escapeHtml(item.body)}</p>
          </article>
        `).join("")}
      </div>
      <div class="source-governance-card">
        <span>Source governance</span>
        <h3>${Number(stats.enabledSources || 0).toLocaleString()} enabled sources, ${Number(stats.sourcePendingInspection || 0).toLocaleString()} pending inspection</h3>
        <p>Imported stories route through priority, trust-level, duplicate, exclusion, required-keyword, and inspection controls before readers see them.</p>
      </div>
    </section>
  `;
}

function articleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function listenerKey() {
  let key = localStorage.getItem("tm_listener_key");
  if (!key) {
    key = `listener-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("tm_listener_key", key);
  }
  return key;
}

function optimizedImageUrl(url, width = 1200) {
  const cleanUrl = String(url || "");
  if (!cleanUrl) return "";
  if (cleanUrl.includes("images.unsplash.com")) {
    const imageUrl = new URL(cleanUrl);
    imageUrl.searchParams.set("auto", "format");
    imageUrl.searchParams.set("fit", "crop");
    imageUrl.searchParams.set("w", String(width));
    imageUrl.searchParams.set("q", "82");
    return imageUrl.toString();
  }
  if (mediaOptimization.cdnBaseUrl && cleanUrl.startsWith("/")) {
    const base = `${mediaOptimization.cdnBaseUrl}${cleanUrl}`;
    if (mediaOptimization.optimizationMode === "cdn-query" && width) return `${base}?width=${encodeURIComponent(width)}&format=auto`;
    return base;
  }
  return cleanUrl;
}

function responsiveImageAttrs(url, alt, sizes = "(max-width: 760px) 92vw, 33vw") {
  const widths = mediaOptimization.adaptiveImages ? mediaOptimization.imageWidths || [480, 768, 1200, 1600] : [];
  const src = optimizedImageUrl(url, widths[1] || 768);
  const srcset = widths.length ? ` srcset="${widths.map((width) => `${escapeHtml(optimizedImageUrl(url, width))} ${width}w`).join(", ")}" sizes="${escapeHtml(sizes)}"` : "";
  return `src="${escapeHtml(src)}"${srcset} alt="${escapeHtml(alt)}"`;
}

function channelBySlug(slug) {
  return channels.find((channel) => channel.slug === slug);
}

function articlesByChannel(slug) {
  if (slug === "news") return articles.filter((article) => article.channel === "news" || article.breaking);
  if (slug === "articles") return articles.filter((article) => ["articles", "news"].includes(article.channel));
  return articles.filter((article) => article.channel === slug);
}

function articleEngagementScore(article) {
  const comments = Number(article.comments?.length || article.commentCount || 0);
  const shares = Number(article.shareCount || 0);
  const durationBoost = Math.min(120, Number(article.avgDurationSeconds || article.minutes * 12 || 0));
  const freshnessDays = Math.max(1, (Date.now() - new Date(article.date || Date.now()).getTime()) / 86400000);
  const freshnessBoost = 120 / freshnessDays;
  return Math.round(Number(article.views || 0) + comments * 180 + shares * 90 + durationBoost * 12 + freshnessBoost);
}

function trendingArticles(limit = 8) {
  return [...articles]
    .sort((a, b) => articleEngagementScore(b) - articleEngagementScore(a))
    .slice(0, limit);
}

function readerInterestSlugs() {
  const followedAuthors = new Set((readerSession.social?.follows || []).map((item) => item.id));
  const saved = new Set(readerSession.bookmarks || []);
  const savedCategories = articles.filter((article) => saved.has(article.slug)).map((article) => article.category);
  const favoriteCategories = (notificationPreferences?.favoriteCategories || []).map((item) => String(item).trim()).filter(Boolean);
  return {
    categories: new Set([...favoriteCategories, ...savedCategories]),
    authors: followedAuthors,
    saved
  };
}

function personalizedArticles({ current = null, limit = 6 } = {}) {
  const interests = readerInterestSlugs();
  return [...articles]
    .filter((article) => article.slug !== current?.slug)
    .map((article) => {
      const sharedTags = current?.tags?.filter((tag) => article.tags?.includes(tag)).length || 0;
      const score =
        (current && article.category === current.category ? 1200 : 0) +
        sharedTags * 700 +
        (interests.categories.has(article.category) ? 900 : 0) +
        (interests.authors.has(article.author) ? 600 : 0) +
        (article.trending ? 350 : 0) +
        Math.min(500, articleEngagementScore(article) / 20);
      return { article, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
}

function shareUrl(article, platform) {
  const url = encodeURIComponent(`${location.origin}${location.pathname}#/article/${article.slug}`);
  const text = encodeURIComponent(article.title);
  const summary = encodeURIComponent(article.subtitle || article.title);
  const targets = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
    reddit: `https://www.reddit.com/submit?url=${url}&title=${text}`,
    telegram: `https://t.me/share/url?url=${url}&text=${summary}`
  };
  return targets[platform] || `${location.origin}${location.pathname}#/article/${article.slug}`;
}

function breadcrumbs(items = []) {
  if (!items.length) return "";
  return `
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="#/">Home</a>
      ${items.map((item, index) => `${index < items.length - 1 ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>` : `<span aria-current="page">${escapeHtml(item.label)}</span>`}`).join("")}
    </nav>
  `;
}

function paginationControls(pagination, hashBase, params = new URLSearchParams()) {
  if (!pagination || Number(pagination.totalPages || 1) <= 1) return "";
  const page = Number(pagination.page || 1);
  const buildHref = (nextPage) => {
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    next.set("limit", String(pagination.limit || 20));
    return `${hashBase}?${next.toString()}`;
  };
  const start = pagination.total ? ((page - 1) * Number(pagination.limit || 20)) + 1 : 0;
  const end = Math.min(page * Number(pagination.limit || 20), Number(pagination.total || 0));
  return `
    <nav class="pagination-bar" aria-label="Pagination">
      <span>Showing ${start.toLocaleString()}-${end.toLocaleString()} of ${Number(pagination.total || 0).toLocaleString()}</span>
      <div class="pagination-actions">
        ${pagination.hasPrevious ? `<a class="button ghost" href="${escapeHtml(buildHref(page - 1))}">Previous</a>` : `<span class="button ghost disabled">Previous</span>`}
        <span>Page ${page.toLocaleString()} of ${Number(pagination.totalPages || 1).toLocaleString()}</span>
        ${pagination.hasNext ? `<a class="button ghost" href="${escapeHtml(buildHref(page + 1))}">Next</a>` : `<span class="button ghost disabled">Next</span>`}
      </div>
    </nav>
  `;
}

function paginateFallback(items = [], page = 1, limit = 20) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return { page, limit, total, totalPages, hasNext: page < totalPages, hasPrevious: page > 1 };
}

function routeParts() {
  const hash = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  if (hash) return hash.split("/");
  const cleanPath = window.location.pathname.replace(/^\/+|\/+$/g, "");
  const cleanRoutes = new Set([
    "search",
    "sections",
    "feed",
    "mobile",
    "it-rooms",
    "authors",
    "account",
    "membership",
    "advertise",
    "leaderboard",
    "community",
    "newsletter",
    "notifications",
    "alerts",
    "breaking",
    "live",
    "events",
    "videos",
    "video",
    "podcasts",
    "podcast",
    "reviews",
    "review",
    "reviews-compare",
    "jobs",
    "job",
    "startups",
    "startup",
    "devices",
    "device",
    "compare",
    "marketplace",
    "trust-center",
    "about",
    "contact",
    "privacy",
    "cookies",
    "terms",
    "media-kit",
    "careers",
    "editorial",
    "editorial-team",
    "ethics",
    "reports"
  ]);
  if (!cleanPath || cleanPath.startsWith("api/") || cleanPath.startsWith("admin")) return [""];
  const parts = cleanPath.split("/");
  return cleanRoutes.has(parts[0]) ? parts : [""];
}

function setTitle(title, description, options = {}) {
  document.title = `${title} | Tech Magazine`;
  document.querySelector("meta[name='description']").setAttribute("content", description);
  document.querySelector("meta[property='og:title']").setAttribute("content", title);
  document.querySelector("meta[property='og:description']").setAttribute("content", description);
  setMeta("property", "og:image", options.ogImage || "");
  setCanonical(options.canonicalUrl || location.href);
  if (options.schema) setStructuredData(options.schema);
}

function setMeta(attribute, key, content) {
  let node = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function setCanonical(url) {
  let node = document.querySelector("link[rel='canonical']");
  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", "canonical");
    document.head.appendChild(node);
  }
  node.setAttribute("href", url);
}

function setStructuredData(schema) {
  let node = document.querySelector("script[data-json-ld='page']");
  if (!node) {
    node = document.createElement("script");
    node.type = "application/ld+json";
    node.dataset.jsonLd = "page";
    document.head.appendChild(node);
  }
  node.textContent = JSON.stringify(schema);
}

async function loadBootstrap() {
  try {
    const response = await fetch("/api/bootstrap", { cache: "no-store" });
    if (!response.ok) throw new Error("Bootstrap API failed");
    const data = await response.json();
    categories = data.categories?.length ? data.categories.filter((category) => !isQaArtifact(`${category.slug} ${category.name}`)) : categories;
    channels = data.channels?.length ? data.channels : channels;
    authors = (data.authors?.length ? data.authors : authors).map(normalizeAuthor);
    articles = data.articles?.length ? data.articles : articles;
    ads = data.ads?.length ? data.ads : ads;
    membershipPlans = data.membershipPlans || [];
    affiliateLinks = data.affiliateLinks || [];
    communityTopics = data.communityTopics || [];
    communityPolls = data.communityPolls || [];
    itRooms = data.itRooms || [];
    feedItems = data.feed || [];
    directoryItems = data.directory || [];
    analyticsConfig = data.analytics || {};
    publicCredibility = data.credibility || publicCredibility;
    audienceConversion = data.audienceConversion || audienceConversion;
    breakingNews = data.breakingNews || [];
    liveEvents = data.liveEvents || [];
    conferenceEvents = data.events || [];
    jobPosts = data.jobs || [];
    startupProfiles = data.startups || [];
    devices = data.devices || [];
    videos = data.videos || [];
    videoPlaylists = data.videoPlaylists || [];
    videoCategories = data.videoCategories || [];
    videoPlatform = data.videoPlatform || {};
    podcastShows = data.podcastShows || [];
    podcastEpisodes = data.podcastEpisodes || [];
    podcastCategories = data.podcastCategories || [];
    podcastPlatform = data.podcastPlatform || {};
    productReviews = data.reviews || [];
    mediaOptimization = { ...mediaOptimization, ...(data.mediaOptimization || {}) };
    languages = data.languages?.length ? data.languages : languages;
    if (!languages.some((language) => language.code === currentLanguage)) currentLanguage = "en";
    siteSettings = { ...siteSettings, ...(data.siteSettings || {}), homepageSections: { ...siteSettings.homepageSections, ...(data.siteSettings?.homepageSections || {}) } };
    applySiteSettings();
    applyLanguageSettings();
    installAnalyticsIntegrations();
  } catch (error) {
    console.warn("Using local fallback content.", error);
    applySiteSettings();
    applyLanguageSettings();
  }
}

async function loadCommercialExperience() {
  try {
    const response = await fetch("/api/commercial/experience", { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || "Commercial experience unavailable.");
    commercialExperience = data;
    membershipPlans = data.plans?.length ? data.plans : membershipPlans;
    affiliateLinks = data.affiliates?.length ? data.affiliates : affiliateLinks;
    return data;
  } catch (error) {
    console.warn("Commercial experience fallback.", error);
    commercialExperience = null;
    return null;
  }
}

async function loadTrustComplianceExperience() {
  try {
    const response = await fetch("/api/trust/experience", { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || "Trust experience unavailable.");
    trustComplianceExperience = data;
    if (data.credibility) publicCredibility = data.credibility;
    return data;
  } catch (error) {
    console.warn("Trust experience fallback.", error);
    trustComplianceExperience = null;
    return null;
  }
}

function activeLanguage() {
  return languages.find((language) => language.code === currentLanguage) || languages[0] || { code: "en", direction: "ltr", nativeName: "English" };
}

function t(key, fallback = "") {
  return uiTranslations[currentLanguage]?.[key] || fallback || key;
}

function applyLanguageSettings() {
  const language = activeLanguage();
  document.documentElement.lang = language.code || "en";
  document.documentElement.dir = language.direction || "ltr";
  document.body?.classList.toggle("rtl", language.direction === "rtl");
}

function applyTheme() {
  const mode = themeMode === "light" ? "light" : "dark";
  const root = document.documentElement;
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
  document.body?.classList.toggle("light-theme", mode === "light");
  if (mode === "light") {
    root.style.setProperty("--bg", "#f6fafb");
    root.style.setProperty("--bg-soft", "#e8f0f3");
    root.style.setProperty("--panel", "#ffffff");
    root.style.setProperty("--panel-strong", "#edf5f7");
    root.style.setProperty("--text", "#0b1b22");
    root.style.setProperty("--muted", "#50636c");
    root.style.setProperty("--line", "rgba(9, 29, 38, 0.14)");
    document.querySelector("meta[name='theme-color']")?.setAttribute("content", "#f6fafb");
    return;
  }
  root.style.setProperty("--bg", siteSettings.backgroundColor);
  root.style.setProperty("--bg-soft", siteSettings.softBackgroundColor);
  root.style.setProperty("--panel", siteSettings.panelColor);
  root.style.setProperty("--panel-strong", siteSettings.strongPanelColor);
  root.style.setProperty("--text", siteSettings.textColor);
  root.style.setProperty("--muted", siteSettings.mutedColor);
  root.style.setProperty("--line", "rgba(255, 255, 255, 0.12)");
  document.querySelector("meta[name='theme-color']")?.setAttribute("content", siteSettings.backgroundColor || "#071014");
}

function applySiteSettings() {
  const root = document.documentElement;
  root.style.setProperty("--accent", siteSettings.primaryColor);
  root.style.setProperty("--accent-2", siteSettings.secondaryColor);
  root.style.setProperty("--danger", siteSettings.dangerColor);
  root.style.setProperty("--bg", siteSettings.backgroundColor);
  root.style.setProperty("--bg-soft", siteSettings.softBackgroundColor);
  root.style.setProperty("--panel", siteSettings.panelColor);
  root.style.setProperty("--panel-strong", siteSettings.strongPanelColor);
  root.style.setProperty("--text", siteSettings.textColor);
  root.style.setProperty("--muted", siteSettings.mutedColor);
  root.style.setProperty("--radius", `${Number(siteSettings.borderRadius || 8)}px`);
  document.querySelector("meta[name='theme-color']")?.setAttribute("content", siteSettings.backgroundColor || "#071014");
  document.querySelectorAll(".brand-logo, .login-logo").forEach((image) => {
    image.setAttribute("src", siteSettings.logoUrl || "/assets/logo.svg");
    image.setAttribute("alt", `${siteSettings.brandName} logo`);
  });
  document.querySelectorAll(".brand strong").forEach((node) => {
    node.textContent = siteSettings.brandName || "Tech Magazine";
  });
  const brandSmall = document.querySelector(".site-header .brand small");
  if (brandSmall) brandSmall.textContent = siteSettings.brandTagline || "";
  const footerSmall = document.querySelector(".footer-brand small");
  if (footerSmall) footerSmall.textContent = siteSettings.footerTagline || siteSettings.brandTagline || "";
  const footerIntro = document.querySelector("[data-footer-intro]");
  if (footerIntro) footerIntro.textContent = siteSettings.footerText || "";
  const utilityBar = document.querySelector("[data-utility-bar]");
  if (utilityBar) {
    utilityBar.hidden = !siteSettings.showUtilityBar;
    const utilityLinks = [
      ...(siteSettings.utilityLinks || []),
      { label: "Media kit", url: "#/media-kit" },
      { label: "Editorial team", url: "#/editorial-team" },
      { label: "Authors", url: "#/authors" },
      { label: "Trust center", url: "#/trust-center" },
      { label: "Careers", url: "#/careers" }
    ].filter((link, index, list) => link.url && list.findIndex((item) => item.url === link.url) === index);
    utilityBar.innerHTML = utilityLinks.map((link) => `<a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>`).join("");
  }
  applyTheme();
}

function installAnalyticsIntegrations() {
  if (analyticsConfig.searchConsoleVerification && !document.querySelector("meta[name='google-site-verification']")) {
    const node = document.createElement("meta");
    node.name = "google-site-verification";
    node.content = analyticsConfig.searchConsoleVerification;
    document.head.appendChild(node);
  }
  if (analyticsConfig.googleTagManagerId && !document.querySelector("[data-gtm-loader]")) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(analyticsConfig.googleTagManagerId)}`;
    script.dataset.gtmLoader = "true";
    document.head.appendChild(script);
  }
  if (analyticsConfig.googleAnalyticsId && !document.querySelector("[data-ga-loader]")) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsConfig.googleAnalyticsId)}`;
    script.dataset.gaLoader = "true";
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", analyticsConfig.googleAnalyticsId, { send_page_view: false });
  }
  if (analyticsConfig.matomoUrl && analyticsConfig.matomoSiteId && !document.querySelector("[data-matomo-loader]")) {
    window._paq = window._paq || [];
    window._paq.push(["trackPageView"]);
    window._paq.push(["enableLinkTracking"]);
    window._paq.push(["setTrackerUrl", `${analyticsConfig.matomoUrl}/matomo.php`]);
    window._paq.push(["setSiteId", analyticsConfig.matomoSiteId]);
    const script = document.createElement("script");
    script.async = true;
    script.src = `${analyticsConfig.matomoUrl}/matomo.js`;
    script.dataset.matomoLoader = "true";
    document.head.appendChild(script);
  }
}

function trackExternalPageView(path, title, articleSlug = "") {
  if (analyticsConfig.googleTagManagerId && window.dataLayer) {
    window.dataLayer.push({ event: "tm_page_view", page_path: path, page_title: title, article_slug: articleSlug });
  }
  if (analyticsConfig.googleAnalyticsId && typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_title: title,
      page_location: window.location.href,
      page_path: path,
      article_slug: articleSlug
    });
  }
  if (analyticsConfig.matomoUrl && analyticsConfig.matomoSiteId && window._paq) {
    window._paq.push(["setCustomUrl", path]);
    window._paq.push(["setDocumentTitle", title]);
    if (articleSlug) window._paq.push(["setCustomVariable", 1, "Article", articleSlug, "page"]);
    window._paq.push(["trackPageView"]);
  }
}

async function loadReaderSession() {
  if (!readerSession.token) return;
  try {
    const { data } = await fetchJsonWithRetry("/api/reader/me", { headers: authHeaders(), cache: "no-store" });
    if (!data.ok) {
      localStorage.removeItem("tm_reader_token");
      readerSession = { token: "", reader: null, bookmarks: [], social: { follows: [], reputation: { points: 0, badges: [] }, gamification: null } };
      readerExperience = null;
      return;
    }
    readerSession.reader = data.reader;
    readerSession.bookmarks = data.bookmarks || [];
    const social = await fetchJsonWithRetry("/api/reader/social", { headers: authHeaders(), cache: "no-store" }).then((item) => item.data).catch(() => null);
    if (social?.ok) readerSession.social = social;
  } catch {
    readerSession = { ...readerSession, reader: null, bookmarks: [], social: { follows: [], reputation: { points: 0, badges: [] }, gamification: null } };
    readerExperience = null;
  }
}

function authHeaders(extra = {}) {
  return readerSession.token ? { ...extra, Authorization: `Bearer ${readerSession.token}` } : extra;
}

async function fetchJsonWithRetry(url, options = {}, attempts = 3) {
  let lastError = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { ok: false, message: response.ok ? "The server returned an unreadable response." : "The server is warming up. Try again in a moment." };
      }
      if (response.ok || ![502, 503, 504].includes(response.status) || attempt === attempts - 1) {
        return { response, data };
      }
      lastError = new Error(data.message || `Transient server response ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === attempts - 1) break;
    }
    await new Promise((resolve) => setTimeout(resolve, 700 + attempt * 900));
  }
  return {
    response: { ok: false, status: 0 },
    data: { ok: false, message: lastError?.message || "Could not reach the server." }
  };
}

function analyticsDeviceType() {
  const width = window.innerWidth || 0;
  if (width <= 640) return "mobile";
  if (width <= 1024) return "tablet";
  return "desktop";
}

function saveReaderSession(data) {
  readerSession = { token: data.token, reader: data.reader, bookmarks: data.bookmarks || [], social: { follows: [], reputation: { points: 0, badges: [] }, gamification: null } };
  readerExperience = null;
  localStorage.setItem("tm_reader_token", data.token);
}

async function loadReaderExperience() {
  if (!readerSession.token) {
    readerExperience = null;
    return null;
  }
  try {
    const response = await fetch("/api/reader/experience", { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    readerExperience = data.ok ? data : null;
  } catch {
    readerExperience = null;
  }
  return readerExperience;
}

async function loadSocialEngagement() {
  try {
    const response = await fetch("/api/community/experience", { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    socialEngagement = data.ok ? data : null;
  } catch {
    socialEngagement = null;
  }
  return socialEngagement;
}

async function loadCommunitySocialExperience() {
  try {
    const response = await fetch("/api/community/social-experience", { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    communitySocialExperience = data.ok ? data : null;
    if (communitySocialExperience) {
      socialEngagement = {
        ok: true,
        signedIn: communitySocialExperience.signedIn,
        totals: communitySocialExperience.totals,
        feedMix: communitySocialExperience.feedMix,
        topRooms: communitySocialExperience.topRooms,
        topTopics: communitySocialExperience.topTopics,
        nextActions: communitySocialExperience.nextActions,
        readerStats: communitySocialExperience.readerStats || null
      };
    }
  } catch {
    communitySocialExperience = null;
  }
  return communitySocialExperience;
}

async function loadMobileExperience() {
  try {
    const response = await fetch("/api/mobile/experience?platform=web-preview&appVersion=0.1.0&installationId=web-preview", { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    mobileExperience = data.ok ? data : null;
  } catch {
    mobileExperience = null;
  }
  return mobileExperience;
}

async function loadNewsletterExperience() {
  try {
    const response = await fetch("/api/newsletter/experience", { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    newsletterExperience = data.ok ? data : null;
  } catch {
    newsletterExperience = null;
  }
  return newsletterExperience;
}

async function loadSavedSearchFilters() {
  if (!readerSession.token) {
    savedSearchFilters = [];
    return [];
  }
  try {
    const response = await fetch("/api/search/saved-filters", { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    savedSearchFilters = data.ok ? data.filters || [] : [];
  } catch {
    savedSearchFilters = [];
  }
  return savedSearchFilters;
}

async function loadNotifications() {
  try {
    const { data } = await fetchJsonWithRetry("/api/notifications", { headers: authHeaders(), cache: "no-store" });
    notifications = data.notifications || [];
    if (readerSession.token) {
      const prefs = await fetchJsonWithRetry("/api/notifications/preferences", { headers: authHeaders(), cache: "no-store" }).then((item) => item.data);
      if (prefs.ok) notificationPreferences = prefs.preferences;
    }
  } catch {
    notifications = [];
  }
}

async function connectFirebasePush(message) {
  if (!readerSession.token) {
    window.location.hash = "#/account";
    return;
  }
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    if (message) message.textContent = "This browser does not support web push notifications.";
    return;
  }
  if (message) message.textContent = "Requesting permission...";
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    if (message) message.textContent = "Notifications were not enabled.";
    return;
  }
  try {
    const [{ initializeApp }, { getMessaging, getToken }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging.js")
    ]);
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const firebaseApp = initializeApp(firebaseConfig);
    const messaging = getMessaging(firebaseApp);
    const deviceToken = await getToken(messaging, { vapidKey: firebaseVapidKey, serviceWorkerRegistration: registration });
    const result = await fetch("/api/notifications/device", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ deviceToken })
    }).then((response) => response.json());
    if (result.preferences) notificationPreferences = result.preferences;
    if (message) message.textContent = result.message || "Push notifications connected.";
  } catch (error) {
    if (message) message.textContent = "Firebase push could not be connected yet.";
  }
}

function adByPlacement(placement) {
  return ads.find((ad) => ad.placement === placement && ad.active);
}

function renderNav() {
  const primaryLinks = [
    ["#/", t("home", "Home")],
    ["#/search", t("search", "Search")],
    ["#/feed", "Feed"],
    ["#/mobile", "Mobile"],
    ["#/videos", t("video", "Video")],
    ["#/podcasts", t("podcasts", "Podcasts")],
    ["#/reviews", t("reviews", "Reviews")],
    ["#/live", t("live", "Live")],
    ["#/jobs", t("jobs", "Jobs")],
    ["#/devices", t("devices", "Devices")],
    ["#/it-rooms", "IT Rooms"],
    ["#/newsletter", t("newsletter", "Newsletter")],
    ["#/membership", t("membership", "Membership")],
    ["#/community", t("community", "Community")],
    ["#/leaderboard", t("leaderboard", "Leaderboard")],
    ["#/notifications", `${t("alerts", "Alerts")}${notifications.filter((item) => !item.readAt).length ? ` (${notifications.filter((item) => !item.readAt).length})` : ""}`],
    ["#/account", readerSession.reader ? t("profile", "Profile") : t("signIn", "Sign in")]
  ];
  const languageOptions = languages
    .map((language) => `<option value="${escapeHtml(language.code)}" ${language.code === currentLanguage ? "selected" : ""}>${escapeHtml(language.nativeName || language.name)}</option>`)
    .join("");
  const visibleCategories = publicCategories();
  const megaTopics = visibleCategories.map((category) => `
    <a class="mega-card" href="#/category/${category.slug}" style="--category:${escapeHtml(category.color)}">
      <span>${escapeHtml(category.icon)}</span>
      <strong>${escapeHtml(category.name)}</strong>
      <small>${escapeHtml(category.description)}</small>
    </a>
  `).join("");
  const megaChannels = channels.map((channel) => `<a href="#/section/${channel.slug}">${escapeHtml(channel.name)}<small>${escapeHtml(channel.description)}</small></a>`).join("");
  const megaTrending = trendingArticles(5).map((article, index) => `<a href="#/article/${article.slug}"><span>#${index + 1}</span>${escapeHtml(article.title)}</a>`).join("");
  nav.innerHTML = `
    ${primaryLinks.slice(0, 2).map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
    <div class="mega-menu">
      <button type="button" class="mega-trigger" aria-expanded="false" data-mega-trigger>${t("sections", "Sections")}</button>
      <div class="mega-panel" data-mega-panel>
        <section>
          <span>${t("categories", "Categories")}</span>
          <div class="mega-grid">${megaTopics}</div>
        </section>
        <section>
          <span>${t("magazine", "Magazine")}</span>
          <div class="mega-link-list">${megaChannels}</div>
        </section>
        <section>
          <span>${t("trending", "Trending")}</span>
          <div class="mega-trending">${megaTrending}</div>
        </section>
      </div>
    </div>
    ${primaryLinks.slice(2).map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
    <select class="language-switcher" data-language-switch aria-label="Language">${languageOptions}</select>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch ${themeMode === "light" ? "dark" : "light"} mode">${themeMode === "light" ? "Dark" : "Light"}</button>
  `;
  footerCategories.innerHTML = visibleCategories.map((category) => `<a href="#/category/${category.slug}">${category.name}</a>`).join("");
}

function articleCard(article, variant = "") {
  const category = categoryBySlug(article.category);
  const author = authorById(article.author);
  const label = article.sponsored ? `Sponsored${article.sponsorName ? ` · ${article.sponsorName}` : ""}` : (article.breaking ? "Breaking" : category.name);
  return `
    <article class="article-card ${variant}">
      <a class="card-image" href="#/article/${article.slug}">
        <img ${responsiveImageAttrs(article.image, article.title)} loading="lazy">
        <span style="--category:${article.sponsored ? "#ffd166" : category.color}">${label}</span>
      </a>
      <div class="card-body">
        <div class="meta">${author.name} · ${article.date} · ${article.minutes} min</div>
        <h3><a href="#/article/${article.slug}">${article.title}</a></h3>
        <p>${article.subtitle}</p>
      </div>
    </article>
  `;
}

function adBlock(placement, className = "sponsor-band") {
  const ad = adByPlacement(placement);
  if (!ad) return "";
  return `
    <section class="${className}" data-ad-impression="${escapeHtml(placement)}">
      <span>${ad.label}</span>
      <strong>${ad.headline}</strong>
      <p>${ad.body}</p>
      <a href="${ad.linkUrl}">${ad.linkLabel}</a>
    </section>
  `;
}

function siteBreakingBanner() {
  if (!siteSettings.breakingBannerEnabled || !siteSettings.breakingBannerText) return "";
  return `
    <a class="breaking-site-banner" href="${escapeHtml(siteSettings.breakingBannerUrl || "#/")}">
      <span>Breaking</span>
      <strong>${escapeHtml(siteSettings.breakingBannerText)}</strong>
    </a>
  `;
}

function breakingNewsRail() {
  if (!breakingNews.length) return "";
  return `
    <section class="content-band breaking-rail">
      <div class="section-heading small">
        <span>Breaking desk</span>
        <h2>Live priority updates</h2>
      </div>
      <div class="headline-stack">
        ${breakingNews.map((alert) => `
          <a href="${escapeHtml(alert.linkUrl || "#/breaking")}">
            <span>${escapeHtml(alert.severity)} / score ${Number(alert.priorityScore || 0).toLocaleString()}</span>
            <strong>${escapeHtml(alert.title)}</strong>
            <small>${escapeHtml(alert.summary)}</small>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function liveUpdatesTicker() {
  const alerts = breakingNews.map((alert) => ({
    label: alert.severity || "breaking",
    title: alert.title,
    href: alert.linkUrl || "#/breaking"
  }));
  const live = liveEvents.slice(0, 4).map((event) => ({
    label: event.status === "live" ? "live" : "coverage",
    title: event.title,
    href: `#/live/${event.slug}`
  }));
  const trending = trendingArticles(4).map((article) => ({
    label: "trending",
    title: article.title,
    href: `#/article/${article.slug}`
  }));
  const items = [...alerts, ...live, ...trending].slice(0, 10);
  if (!items.length) return "";
  const tickerItems = [...items, ...items].map((item) => `
    <a href="${escapeHtml(item.href)}"><span>${escapeHtml(item.label)}</span>${escapeHtml(item.title)}</a>
  `).join("");
  return `
    <section class="live-ticker" aria-label="Live technology updates">
      <strong>Live updates</strong>
      <div><div class="live-ticker-track">${tickerItems}</div></div>
    </section>
  `;
}

function marketingBanner() {
  if (!siteSettings.marketingBannerEnabled || !siteSettings.marketingBannerHeadline) return "";
  return `
    <section class="marketing-cms-banner">
      <div>
        <span>${escapeHtml(siteSettings.marketingBannerLabel || "Featured")}</span>
        <h2>${escapeHtml(siteSettings.marketingBannerHeadline)}</h2>
        <p>${escapeHtml(siteSettings.marketingBannerBody || "")}</p>
      </div>
      <a class="button primary" href="${escapeHtml(siteSettings.marketingBannerUrl || "#/")}">${escapeHtml(siteSettings.marketingBannerCta || "Learn more")}</a>
    </section>
  `;
}

function startHeroSlider() {
  window.clearInterval(heroTimer);
  const slider = document.querySelector("[data-hero-slider]");
  if (!slider) return;
  const slides = [...slider.querySelectorAll("[data-hero-slide]")];
  const buttons = [...slider.querySelectorAll("[data-hero-dot]")];
  if (!slides.length) return;

  const show = (index) => {
    const safeIndex = (index + slides.length) % slides.length;
    slider.dataset.active = String(safeIndex);
    slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === safeIndex));
    buttons.forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === safeIndex);
      button.setAttribute("aria-pressed", buttonIndex === safeIndex ? "true" : "false");
    });
  };

  show(0);
  heroTimer = window.setInterval(() => show(Number(slider.dataset.active || 0) + 1), 6500);
}

function startLatestFeedObserver() {
  latestFeedObserver?.disconnect();
  const sentinel = document.querySelector("[data-latest-sentinel]");
  if (!sentinel) return;
  if (!("IntersectionObserver" in window)) {
    sentinel.innerHTML = `<button class="button ghost" type="button" data-load-more-latest>Load more stories</button>`;
    return;
  }
  latestFeedObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    visibleLatestCount += 6;
    renderHome();
  }, { rootMargin: "360px 0px" });
  latestFeedObserver.observe(sentinel);
}

function renderBodyBlock(block, index) {
  const trimmed = String(block || "").trim();
  if (!trimmed) return "";
  if (/^<tm-poll\b/i.test(trimmed)) return renderArticlePoll(trimmed);
  if (/^```/.test(trimmed)) return `<pre><code>${escapeHtml(trimmed.replace(/^```[a-z]*\n?/i, "").replace(/```$/i, ""))}</code></pre>`;
  if (/^#{2,3}\s+/.test(trimmed)) return `<h2>${escapeHtml(trimmed.replace(/^#{2,3}\s+/, ""))}</h2>`;
  if (/^[-*]\s+/m.test(trimmed)) return `<ul>${trimmed.split(/\n/).filter(Boolean).map((item) => `<li>${escapeHtml(item.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
  if (/^<(h2|blockquote|pre|ul|ol|figure|iframe|img|p|table)\b/i.test(trimmed)) return trimmed;
  if (index === 1) return `<blockquote>${trimmed}</blockquote>`;
  return `<p>${trimmed}</p>`;
}

function renderArticlePoll(markup) {
  const slug = /slug=["']([^"']+)["']/i.exec(markup)?.[1] || "";
  const poll = communityPolls.find((item) => item.slug === slug || item.id === slug);
  if (!poll) {
    return `<aside class="reader-card poll-card"><span>Article poll</span><h2>Poll unavailable</h2><p>This poll may be unpublished or archived.</p></aside>`;
  }
  return `
    <aside class="reader-card poll-card article-poll">
      <span>Reader poll</span>
      <h2>${escapeHtml(poll.title)}</h2>
      <p>${escapeHtml(poll.body || "")}</p>
      <div class="poll-options">
        ${(poll.options || []).map((option) => `<button type="button" data-poll-vote="${escapeHtml(poll.id)}" data-option-id="${escapeHtml(option.id)}">${escapeHtml(option.label)} <small>${Number(option.votes || 0).toLocaleString()}</small></button>`).join("")}
      </div>
    </aside>
  `;
}

function editorialSection(channelSlug, title, leadSlug) {
  const items = articlesByChannel(channelSlug);
  const lead = articleBySlug(leadSlug) || items[0];
  const rest = items.filter((article) => !lead || article.slug !== lead.slug).slice(0, 4);
  if (!lead) return "";

  return `
    <section class="magazine-section">
      <div class="section-heading">
        <span>${channelBySlug(channelSlug)?.name || title}</span>
        <h2>${title}</h2>
        <a href="#/section/${channelSlug}">View all</a>
      </div>
      <div class="feature-list">
        ${articleCard(lead, "lead-card")}
        <div class="headline-stack">
          ${rest.map((article) => {
            const category = categoryBySlug(article.category);
            return `<a href="#/article/${article.slug}"><span>${category.name}</span><strong>${article.title}</strong><small>${article.subtitle}</small></a>`;
          }).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderHome() {
  visibleLatestCount = visibleLatestCount || 8;
  const heroSlides = articles.filter((article) => article.featured).slice(0, 4);
  if (!heroSlides.length) heroSlides.push(...articles.slice(0, 1));
  const hero = heroSlides[0] || articles[0];
  const featured = articles.filter((article) => article.featured && article.slug !== hero.slug);
  const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const seenDeskSlugs = new Set([hero.slug]);
  const editorDesk = [...featured, ...latest]
    .filter((article) => {
      if (!article?.slug || seenDeskSlugs.has(article.slug)) return false;
      seenDeskSlugs.add(article.slug);
      return true;
    })
    .slice(0, 6);
  const trending = trendingArticles(8);
  const personalized = personalizedArticles({ limit: 4 });
  const visibleLatest = latest.slice(0, visibleLatestCount);

  setTitle("Professional IT News Platform", "Technology news, AI, cybersecurity, cloud, startups, reviews, tutorials, and enterprise IT insight.");
  const sections = siteSettings.homepageSections || {};
  app.innerHTML = `
    ${siteBreakingBanner()}
    ${liveUpdatesTicker()}
    ${breakingNewsRail()}
    ${currentLanguage !== "en" ? `<section class="language-notice"><strong>${t("languageNoticeTitle", "Selected language active")}</strong><span>${t("languageNoticeBody", "The interface and reading direction update for this language.")}</span></section>` : ""}
    <section class="hero hero-slider" data-hero-slider>
      ${heroSlides.map((item, index) => {
        const heroCategory = categoryBySlug(item.category);
        return `
          <div class="hero-slide ${index === 0 ? "active" : ""}" data-hero-slide>
            <div class="hero-media">
              <img ${responsiveImageAttrs(item.image, item.title, "(max-width: 760px) 92vw, 50vw")} loading="lazy">
            </div>
            <div class="hero-content">
              <span class="eyebrow">${item.breaking ? t("breakingNews", "Breaking news") : item.sponsored ? t("sponsoredStory", "Sponsored story") : t("editorPick", "Editor pick")} / ${heroCategory.name}</span>
              <h1>${item.title}</h1>
              <p>${item.subtitle}</p>
              <div class="hero-actions">
                <a class="button primary" href="#/article/${item.slug}">${t("readStory", "Read story")}</a>
                <a class="button ghost" href="#/category/${heroCategory.slug}">${t("explore", "Explore")} ${heroCategory.name}</a>
              </div>
            </div>
          </div>
        `;
      }).join("")}
      <div class="hero-dots" aria-label="Featured stories">
        ${heroSlides.map((item, index) => `<button type="button" data-hero-dot="${index}" aria-label="${item.title}" aria-pressed="${index === 0 ? "true" : "false"}"></button>`).join("")}
      </div>
    </section>

    ${sections.featuredDesk || sections.trendingPanel ? `<section class="content-band top-grid">
      <div>
        <div class="section-heading">
          <span>${t("featuredDesk", "Featured desk")}</span>
          <h2>${t("editorsWatching", "Stories editors are watching")}</h2>
        </div>
        ${sections.featuredDesk ? `<div class="mini-grid editor-watch-grid">${editorDesk.map((article) => articleCard(article, "compact")).join("")}</div>` : ""}
      </div>
      ${sections.trendingPanel ? `<aside class="trend-panel">
        <div class="section-heading small">
          <span>${t("liveSignal", "Live signal")}</span>
          <h2>${t("trendingNow", "Trending now")}</h2>
        </div>
        <ol>
          ${trending.map((article) => {
            const category = categoryBySlug(article.category);
            return `<li><a href="#/article/${article.slug}"><span>${category.name}</span><strong>${article.title}</strong><small>${articleEngagementScore(article).toLocaleString()} live signal</small></a></li>`;
          }).join("")}
        </ol>
        <div class="most-popular">
          <h3>${t("mostPopular", "Most popular")}</h3>
          ${[...articles].sort((a, b) => b.views - a.views).slice(0, 4).map((article, index) => `<a href="#/article/${article.slug}"><span>#${index + 1}</span>${article.title}</a>`).join("")}
        </div>
      </aside>` : ""}
    </section>` : ""}

    ${sections.sponsoredBanner ? adBlock("home-banner") : ""}
    ${marketingBanner()}
    ${credibilityBand({ compact: true })}

    <section class="content-band personalized-band">
      <div class="section-heading">
        <span>${readerSession.reader ? t("personalizedForYou", "Personalized for you") : t("smartRecommendations", "Smart recommendations")}</span>
        <h2>${readerSession.reader ? t("basedOnSignals", "Based on your reading signals") : t("newsroomSignals", "Recommended by newsroom signals")}</h2>
        <a href="#/account">${readerSession.reader ? t("tuneProfile", "Tune profile") : t("signInPersonalize", "Sign in to personalize")}</a>
      </div>
      <div class="mini-grid">${personalized.map((article) => articleCard(article, "compact")).join("")}</div>
    </section>

    ${sections.magazineGrid ? `<section class="content-band magazine-grid">
      ${editorialSection("interviews", "Executive interviews", "cloud-cost-dashboards-product-teams")}
      ${editorialSection("top-10", "Top 10 technology lists", "top-10-digital-infrastructure-trends")}
      ${editorialSection("videos", "Videos and briefings", "handheld-gaming-pcs-laptop-makers")}
      ${editorialSection("events", "Events and webinars", "gitex-ai-europe-enterprise-automation")}
    </section>` : ""}

    ${sections.latestFeed ? `<section class="content-band">
      <div class="section-heading">
        <span>${t("latestFeed", "Latest feed")}</span>
        <h2>${t("freshCoverage", "Fresh technology coverage")}</h2>
      </div>
      <div class="article-grid" data-latest-feed>${visibleLatest.map((article) => articleCard(article)).join("")}</div>
      ${visibleLatest.length < latest.length ? `<div class="feed-loader" data-latest-sentinel><span>Loading more stories</span></div>` : ""}
    </section>` : ""}

    ${sections.categoryShowcase ? `<section class="content-band">
      <div class="section-heading">
        <span>${t("topics", "Topics")}</span>
        <h2>${t("browseNewsroom", "Browse the newsroom")}</h2>
      </div>
      <div class="category-grid">
        ${publicCategories().map((category) => `
          <a class="category-tile" style="--category:${category.color}" href="#/category/${category.slug}">
            <span>${category.icon}</span>
            <strong>${category.name}</strong>
            <small>${category.description}</small>
          </a>
        `).join("")}
      </div>
    </section>` : ""}

    ${liveEvents.length ? `<section class="content-band">
      <div class="section-heading">
        <span>Live desk</span>
        <h2>Live coverage</h2>
        <a href="#/live">View all</a>
      </div>
      <div class="mini-grid">
        ${liveEvents.slice(0, 3).map((event) => `
          <a class="reader-card live-event-card" href="#/live/${event.slug}">
            <span>${escapeHtml(event.status)} / ${Number(event.updateCount || 0).toLocaleString()} updates</span>
            <h2>${escapeHtml(event.title)}</h2>
            <p>${escapeHtml(event.description)}</p>
          </a>
        `).join("")}
      </div>
    </section>` : ""}

    ${sections.newsletter ? newsletterBlock() : ""}
    ${audienceConversionPanel({ compact: true })}
  `;
  startHeroSlider();
  startLatestFeedObserver();
}

function renderArticle(slug, hydratedArticle = null) {
  const article = hydratedArticle || articleBySlug(slug);
  if (!article) {
    app.innerHTML = `<section class="content-band"><p class="muted">Loading article...</p></section>`;
    const languageParam = currentLanguage !== "en" ? `?lang=${encodeURIComponent(currentLanguage)}` : "";
    fetch(`/api/articles/${encodeURIComponent(slug)}${languageParam}`, { headers: authHeaders(), cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (result?.ok && result.article) renderArticle(slug, result.article);
        else renderNotFound();
      })
      .catch(renderNotFound);
    return;
  }

  const category = categoryBySlug(article.category);
  const author = authorById(article.author);
  const related = personalizedArticles({ current: article, limit: 3 });
  const trust = articleTrustDetails(article, author);

  setTitle(article.seoTitle || article.title, article.seoDescription || article.subtitle, {
    canonicalUrl: article.canonicalUrl || `${location.origin}/#/article/${article.slug}`,
    ogImage: article.ogImage || article.image,
    schema: {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: article.seoDescription || article.subtitle,
      image: article.ogImage || article.image,
      datePublished: article.date,
      author: { "@type": "Person", name: author.name },
      publisher: { "@type": "Organization", name: "Tech Magazine" },
      keywords: (article.tags || []).join(", "),
      isBasedOn: trust.sourceUrl || undefined,
      correction: trust.correction || undefined
    }
  });
  app.innerHTML = `
    <div class="reading-progress" aria-hidden="true"><span data-reading-progress></span></div>
    <article class="article-shell">
      ${breadcrumbs([
        { label: category.name, href: `#/category/${category.slug}` },
        { label: article.title, href: `#/article/${article.slug}` }
      ])}
      <header class="article-header">
        <a class="pill" style="--category:${category.color}" href="#/category/${category.slug}">${category.name}</a>
        ${article.sponsored ? `<span class="sponsored-label">Sponsored${article.sponsorName ? ` by ${article.sponsorName}` : ""}</span>` : ""}
        <span class="trust-label">${escapeHtml(trust.origin)} / ${escapeHtml(trust.statusLabel)}</span>
        <h1>${article.title}</h1>
        <p>${article.subtitle}</p>
        <div class="article-meta">
          <img src="${author.avatar}" alt="${author.name}">
          <a href="#/author/${author.id}">${author.name}</a>
          ${author.verified ? `<span>Verified</span>` : ""}
          <span>${article.date}</span>
          <span>${article.minutes} min read</span>
          <span>${article.views.toLocaleString()} views</span>
        </div>
        <div class="article-action-strip">
          <button class="button primary bookmark-button" type="button" data-bookmark="${article.slug}" aria-label="${readerSession.bookmarks.includes(article.slug) ? "Article saved" : "Save article"}">
            <span aria-hidden="true">${readerSession.bookmarks.includes(article.slug) ? "✓" : "+"}</span>
            ${readerSession.bookmarks.includes(article.slug) ? "Saved article" : "Save article"}
          </button>
          <a class="button secondary" href="#/notifications">Reader alerts</a>
        </div>
      </header>
      <figure class="article-hero-image">
        <img ${responsiveImageAttrs(article.image, article.title, "(max-width: 760px) 100vw, 1100px")}>
        <figcaption>${article.caption}</figcaption>
      </figure>
      <div class="article-layout">
        <aside class="share-rail">
          <button type="button" data-share="${article.title}">Copy</button>
          <a href="${shareUrl(article, "facebook")}" target="_blank" rel="noreferrer" aria-label="Share on Facebook">Facebook</a>
          <a href="${shareUrl(article, "x")}" target="_blank" rel="noreferrer" aria-label="Share on X">X</a>
          <a href="${shareUrl(article, "linkedin")}" target="_blank" rel="noreferrer" aria-label="Share on LinkedIn">LinkedIn</a>
          <a href="${shareUrl(article, "whatsapp")}" target="_blank" rel="noreferrer" aria-label="Share on WhatsApp">WhatsApp</a>
          <a href="${shareUrl(article, "reddit")}" target="_blank" rel="noreferrer" aria-label="Share on Reddit">Reddit</a>
          <a href="${shareUrl(article, "telegram")}" target="_blank" rel="noreferrer" aria-label="Share on Telegram">Telegram</a>
          <button type="button" data-bookmark="${article.slug}">${readerSession.bookmarks.includes(article.slug) ? "Saved" : "Save"}</button>
          <a href="#/newsletter">Newsletter</a>
          <a href="#/search?category=${category.slug}">More</a>
          <a href="#trust">Trust</a>
        </aside>
        <div class="article-content">
          ${articleTrustPanel(article, author)}
          <section class="ai-reader-panel">
            <button class="button ghost" type="button" data-ai-summary="${article.slug}">AI summary</button>
            <div class="form-message" data-ai-summary-output></div>
          </section>
          ${article.body.map(renderBodyBlock).join("")}
          ${article.paywall?.locked ? `
            <section class="paywall-card">
              <span>${article.paywall.accessLevel === "premium" ? "Premium access" : "Reader access"}</span>
              <h2>${escapeHtml(article.paywall.message || "Sign in to continue reading.")}</h2>
              <p>This article is protected by the Tech Magazine monetization system. Create a reader account or start a membership to unlock the full story.</p>
              <div class="inline-actions">
                <a class="button primary" href="#/membership">View membership</a>
                <a class="button ghost" href="#/account">Sign in</a>
              </div>
            </section>
          ` : ""}
          ${adBlock("article-inline", "article-ad")}
          <pre><code>workflow = draft + editorial_review + seo_metadata + scheduled_publish</code></pre>
        </div>
      </div>
      <section class="tag-row">
        ${article.tags.map((tag) => `<a href="#/search?query=${encodeURIComponent(tag)}">${tag}</a>`).join("")}
      </section>
      ${articleAudienceCta(article, category)}
      <section class="author-box">
        <img src="${escapeHtml(author.avatar)}" alt="${escapeHtml(author.name)}">
        <div>
          <span>${escapeHtml(author.role)} ${author.verified ? "/ Verified author" : ""}</span>
          <h2><a href="#/author/${escapeHtml(author.id)}">${escapeHtml(author.name)}</a></h2>
          <p>${escapeHtml(author.bio)}</p>
          <div class="author-expertise">${authorExpertiseChips(author, 4)}</div>
          <div class="author-box-meta">
            ${author.beat ? `<span>${escapeHtml(author.beat)}</span>` : ""}
            ${author.experienceYears ? `<span>${Number(author.experienceYears).toLocaleString()} years reporting</span>` : ""}
            <a href="#/author/${escapeHtml(author.id)}">View full profile</a>
          </div>
        </div>
      </section>
      <section class="content-band flush">
        <div class="section-heading">
          <span>Recommended articles</span>
          <h2>Matched by topic, behavior, and live signal</h2>
        </div>
        <div class="mini-grid">${related.map((item) => articleCard(item, "compact")).join("")}</div>
      </section>
      <section class="comments-section">
        <div class="section-heading small">
          <span>Community</span>
          <h2>Comments</h2>
        </div>
        ${(article.comments?.length ? article.comments : [{ id: "", userName: "Nadine", createdAt: article.date, content: "This is exactly the kind of coverage a serious IT magazine needs.", likes: 0, dislikes: 0 }]).map((comment) => `
          <article class="comment" style="${comment.parentId ? "margin-left:24px" : ""}">
            <strong>${escapeHtml(comment.userName)}</strong><time>${escapeHtml(comment.createdAt)}</time><p>${escapeHtml(comment.content)}</p>
            ${comment.id ? `<div class="comment-actions"><button type="button" data-comment-vote="${comment.id}" data-vote="like">Like ${comment.likes || 0}</button><button type="button" data-comment-vote="${comment.id}" data-vote="dislike">Dislike ${comment.dislikes || 0}</button><button type="button" data-comment-report="${comment.id}">Report</button></div>` : ""}
          </article>
        `).join("")}
        <form class="comment-form" data-comment-form>
          <input type="hidden" name="articleSlug" value="${article.slug}">
          <label>Name<input name="userName" required></label>
          <label>Email<input type="email" name="userEmail"></label>
          <label>Reply to comment ID<input name="parentId" placeholder="Optional"></label>
          <label>Comment<textarea name="content" required></textarea></label>
          <button class="button primary" type="submit">Submit for moderation</button>
          <p class="form-message" data-form-message></p>
        </form>
      </section>
    </article>
  `;
  recordAdImpressions();
  if (!hydratedArticle) {
    const languageQuery = currentLanguage && currentLanguage !== "en" ? `?lang=${encodeURIComponent(currentLanguage)}` : "";
    fetch(`/api/articles/${encodeURIComponent(slug)}${languageQuery}`, { headers: authHeaders(), cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (result?.ok && (result.article?.paywall || result.article?.translated)) renderArticle(slug, result.article);
      })
      .catch(() => {});
  }
}

function renderCategory(slug) {
  const category = categoryBySlug(slug);
  const categoryArticles = articles.filter((article) => article.category === category.slug);
  const categoryTags = [...new Set(categoryArticles.flatMap((article) => article.tags || []))].slice(0, 10);
  const topStory = [...categoryArticles].sort((a, b) => Number(b.views || 0) - Number(a.views || 0))[0];
  const liveMatches = liveEvents.filter((event) => String(event.title || event.description || "").toLowerCase().includes(category.name.toLowerCase()) || String(event.category || "").toLowerCase() === category.slug);
  setTitle(category.name, category.description);
  app.innerHTML = `
    <section class="page-hero compact-hero category-discovery-hero" style="--category:${category.color}">
      <span>${escapeHtml(category.icon)} / Topic desk</span>
      <h1>${category.name}</h1>
      <p>${category.description}</p>
      <form class="search-panel compact-search" data-search-form>
        <input name="query" placeholder="Search inside ${escapeHtml(category.name)}">
        <input type="hidden" name="category" value="${escapeHtml(category.slug)}">
        <select name="sort">
          <option value="relevance">Relevance</option>
          <option value="popular">Most popular</option>
          <option value="newest">Newest</option>
        </select>
        <button class="button primary" type="submit">Search ${escapeHtml(category.name)}</button>
      </form>
    </section>
    <section class="content-band category-insight-grid">
      <article class="reader-card">
        <span>Coverage depth</span>
        <strong>${categoryArticles.length.toLocaleString()}</strong>
        <p>Published articles in this topic desk.</p>
      </article>
      <article class="reader-card">
        <span>Reader signal</span>
        <strong>${categoryArticles.reduce((sum, article) => sum + Number(article.views || 0), 0).toLocaleString()}</strong>
        <p>Tracked views across ${escapeHtml(category.name)} coverage.</p>
      </article>
      <article class="reader-card">
        <span>Live coverage</span>
        <strong>${liveMatches.length.toLocaleString()}</strong>
        <p>Matching live events and update hubs.</p>
      </article>
      <article class="reader-card">
        <span>Top story</span>
        <h2>${topStory ? escapeHtml(topStory.title) : "No lead story yet"}</h2>
        ${topStory ? `<a class="button ghost" href="#/article/${escapeHtml(topStory.slug)}">Open story</a>` : `<a class="button ghost" href="#/search?category=${escapeHtml(category.slug)}">Search topic</a>`}
      </article>
    </section>
    <section class="content-band topic-path-grid">
      <a class="reader-card" href="#/search?category=${escapeHtml(category.slug)}&sort=popular"><span>Popular</span><h2>Most-read ${escapeHtml(category.name)}</h2><p>Ranked by newsroom engagement and reader interest.</p></a>
      <a class="reader-card" href="#/feed"><span>Feed</span><h2>Add it to your signal flow</h2><p>Use the feed to blend topic coverage with community, rooms, and media.</p></a>
      <a class="reader-card" href="#/notifications"><span>Alerts</span><h2>Follow this category</h2><p>Save ${escapeHtml(category.name)} as an alert preference from the notification center.</p></a>
      <a class="reader-card" href="#/newsletter"><span>Briefing</span><h2>Subscribe to the topic</h2><p>Get this desk as a focused reader briefing.</p></a>
    </section>
    ${categoryTags.length ? `<section class="content-band"><div class="section-heading"><span>Discovery tags</span><h2>Explore related angles</h2></div><div class="tag-row">${categoryTags.map((tag) => `<a href="#/search?category=${escapeHtml(category.slug)}&query=${encodeURIComponent(tag)}">${escapeHtml(tag)}</a>`).join("")}</div></section>` : ""}
    <section class="content-band">
      <div class="section-heading">
        <span>Latest ${escapeHtml(category.name)}</span>
        <h2>Coverage from this desk</h2>
      </div>
      <div class="article-grid">${categoryArticles.map((article) => articleCard(article)).join("") || `<p class="muted">No articles in this category yet.</p>`}</div>
    </section>
  `;
}

function renderSection(slug) {
  const channel = channelBySlug(slug);
  if (!channel) {
    renderNotFound();
    return;
  }
  const channelArticles = articlesByChannel(slug);
  const channelCategories = [...new Set(channelArticles.map((article) => article.category))].map(categoryBySlug).filter(Boolean);
  setTitle(channel.name, channel.description);
  app.innerHTML = `
    <section class="page-hero compact-hero section-discovery-hero">
      <span>Magazine section</span>
      <h1>${channel.name}</h1>
      <p>${channel.description}</p>
      <div class="hero-actions">
        <a class="button primary" href="#/search?type=article&sort=newest">Search latest</a>
        <a class="button secondary" href="#/sections">All sections</a>
      </div>
    </section>
    <section class="content-band section-routing-card">
      <div>
        <span>Section routing</span>
        <h2>Move through this desk by format, topic, or signal</h2>
        <p>Each section keeps a path back to search, feed, newsletters, and topic desks so readers do not hit a dead end.</p>
      </div>
      <div class="quick-link-grid">
        ${channelCategories.slice(0, 6).map((category) => `<a href="#/category/${escapeHtml(category.slug)}" style="--category:${escapeHtml(category.color)}"><span>${escapeHtml(category.icon)}</span>${escapeHtml(category.name)}</a>`).join("") || `<a href="#/search">Open search</a>`}
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading">
        <span>${channelArticles.length.toLocaleString()} stories</span>
        <h2>${escapeHtml(channel.name)} archive</h2>
      </div>
      <div class="article-grid">${channelArticles.map((article) => articleCard(article)).join("") || `<p class="muted">No articles in this section yet.</p>`}</div>
    </section>
  `;
}

function renderSectionsHub() {
  setTitle("Sections", "Browse Tech Magazine by topic, format, desk, and reader journey.");
  const trending = trendingArticles(5);
  app.innerHTML = `
    <section class="page-hero compact-hero discovery-hub-hero">
      <span>Discovery hub</span>
      <h1>Browse by topic, format, and reader signal</h1>
      <p>A professional news platform should never feel like a flat list. Use this hub to move between editorial desks, formats, live coverage, search, feed, and reader subscriptions.</p>
      <form class="search-panel compact-search" data-search-form>
        <input name="query" placeholder="Search all desks">
        <select name="type">
          <option value="all">All content</option>
          <option value="article">Articles</option>
          <option value="video">Videos</option>
          <option value="podcast">Podcasts</option>
          <option value="review">Reviews</option>
          <option value="device">Devices</option>
        </select>
        <button class="button primary" type="submit">Search platform</button>
      </form>
    </section>
    <section class="content-band">
      <div class="section-heading">
        <span>Topic desks</span>
        <h2>Technology sectors</h2>
        <a href="#/search">Advanced search</a>
      </div>
      <div class="category-grid">
        ${publicCategories().map((category) => `
          <a class="category-tile" style="--category:${escapeHtml(category.color)}" href="#/category/${escapeHtml(category.slug)}">
            <span>${escapeHtml(category.icon)}</span>
            <strong>${escapeHtml(category.name)}</strong>
            <small>${escapeHtml(category.description)}</small>
          </a>
        `).join("")}
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading">
        <span>Magazine formats</span>
        <h2>Read, watch, listen, compare, attend</h2>
      </div>
      <div class="search-journey-grid">
        ${channels.map((channel) => `<a class="reader-card" href="#/section/${escapeHtml(channel.slug)}"><span>Section</span><h2>${escapeHtml(channel.name)}</h2><p>${escapeHtml(channel.description)}</p></a>`).join("")}
        <a class="reader-card" href="#/videos"><span>Media</span><h2>Video desk</h2><p>Reviews, explainers, playlists, and multimedia publishing.</p></a>
        <a class="reader-card" href="#/podcasts"><span>Audio</span><h2>Podcast network</h2><p>Shows, episodes, transcripts, and distribution feeds.</p></a>
        <a class="reader-card" href="#/devices"><span>Database</span><h2>Device directory</h2><p>Specs, comparisons, benchmarks, and review journeys.</p></a>
      </div>
    </section>
    <section class="content-band discovery-signal-grid">
      <article class="reader-card">
        <span>Trending now</span>
        <h2>Reader demand</h2>
        <div class="headline-stack">${trending.map((article, index) => `<a href="#/article/${escapeHtml(article.slug)}"><span>#${index + 1}</span><strong>${escapeHtml(article.title)}</strong></a>`).join("")}</div>
      </article>
      <article class="reader-card">
        <span>Personal journey</span>
        <h2>Build a feed</h2>
        <p>Sign in to combine saved articles, followed authors, category preferences, IT room activity, and recommendations.</p>
        <div class="inline-actions"><a class="button primary" href="#/feed">Open feed</a><a class="button ghost" href="#/account">Reader profile</a></div>
      </article>
      <article class="reader-card">
        <span>Alerts</span>
        <h2>Subscribe to signals</h2>
        <p>Connect breaking news, live events, newsletters, authors, and favorite categories into one preference center.</p>
        <div class="inline-actions"><a class="button primary" href="#/notifications">Alert center</a><a class="button ghost" href="#/newsletter">Newsletter</a></div>
      </article>
    </section>
  `;
}

function searchResultCard(item) {
  if (item.type === "article" || !item.type) {
    const article = articles.find((entry) => entry.slug === item.slug) || {
      ...item,
      subtitle: item.excerpt,
      image: item.image,
      minutes: 4,
      body: [],
      views: item.popularity || 0
    };
    return articleCard(article);
  }
  const labels = {
    video: "Video",
    podcast: "Podcast",
    review: "Review",
    device: "Device",
    author: "Author",
    category: "Category",
    tag: "Tag"
  };
  return `
    <a class="reader-card search-result-card" href="${escapeHtml(item.url || "#/search")}">
      <span>${escapeHtml(labels[item.type] || item.type || "Result")}${item.score ? ` / ${Number(item.score).toLocaleString()} score` : ""}</span>
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.excerpt || item.category || "Search result")}</p>
      ${(item.tags || []).length ? `<small>${item.tags.slice(0, 4).map(escapeHtml).join(", ")}</small>` : ""}
    </a>
  `;
}

async function renderSearch() {
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const query = params.get("query") || "";
  const selectedType = params.get("type") || "all";
  const selectedCategory = params.get("category") || "";
  const selectedTag = params.get("tag") || "";
  const selectedAuthor = params.get("author") || "";
  const dateFrom = params.get("dateFrom") || "";
  const dateTo = params.get("dateTo") || "";
  const sort = params.get("sort") || "newest";
  const page = Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(params.get("limit") || "20", 10) || 20));
  const tags = [...new Set(articles.flatMap((article) => article.tags || []))].sort((a, b) => a.localeCompare(b));
  let results = [];
  let suggestions = [];
  let trending = [];
  let correctedQuery = "";
  let facets = { types: [], categories: [] };
  let semantic = null;
  let resultPagination = null;
  if (readerSession.token) await loadSavedSearchFilters();
  try {
    const apiParams = new URLSearchParams();
    if (query) apiParams.set("query", query);
    if (selectedType && selectedType !== "all") apiParams.set("type", selectedType);
    if (selectedCategory) apiParams.set("category", selectedCategory);
    if (selectedTag) apiParams.set("tag", selectedTag);
    if (selectedAuthor) apiParams.set("author", selectedAuthor);
    if (dateFrom) apiParams.set("dateFrom", dateFrom);
    if (dateTo) apiParams.set("dateTo", dateTo);
    if (sort) apiParams.set("sort", sort);
    apiParams.set("page", String(page));
    apiParams.set("limit", String(limit));
    const response = await fetch(`/api/search?${apiParams.toString()}`, { cache: "no-store" });
    const data = await response.json();
    results = data.results || data.articles || [];
    suggestions = data.suggestions || [];
    trending = data.trending || [];
    correctedQuery = data.correctedQuery || "";
    facets = data.facets || facets;
    semantic = data.semantic || null;
    resultPagination = data.pagination?.results || data.pagination?.articles || null;
  } catch {
    results = articles.filter((article) => {
      const text = `${article.title} ${article.subtitle} ${article.tags.join(" ")} ${article.body.join(" ")}`.toLowerCase();
      return query ? text.includes(query.toLowerCase()) : true;
    });
    resultPagination = paginateFallback(results, page, limit);
    results = results.slice((page - 1) * limit, page * limit);
  }

  setTitle("Search", "Search articles, videos, podcasts, authors, reviews, devices, tags, and topics.");
  const typeOptions = [
    ["all", "All content"],
    ["article", "Articles"],
    ["video", "Videos"],
    ["podcast", "Podcasts"],
    ["review", "Reviews"],
    ["device", "Devices"],
    ["author", "Authors"]
  ];
  app.innerHTML = `
    <section class="page-hero compact-hero search-command-hero">
      <span>Search and discovery</span>
      <h1>Find technology coverage</h1>
      <p>Search articles, videos, podcasts, authors, reviews, devices, categories, and tags with typo-aware semantic discovery.</p>
      <form class="search-panel" data-search-form>
        <input name="query" value="${escapeHtml(query)}" placeholder="AI, cybersecurity, cloud...">
        <select name="type">
          ${typeOptions.map(([value, label]) => `<option value="${value}" ${selectedType === value ? "selected" : ""}>${label}</option>`).join("")}
        </select>
        <select name="category">
          <option value="">All categories</option>
          ${publicCategories().map((category) => `<option value="${category.slug}" ${selectedCategory === category.slug ? "selected" : ""}>${category.name}</option>`).join("")}
        </select>
        <select name="tag">
          <option value="">All tags</option>
          ${tags.map((tag) => `<option value="${slugify(tag)}" ${selectedTag === slugify(tag) ? "selected" : ""}>${tag}</option>`).join("")}
        </select>
        <select name="author">
          <option value="">All authors</option>
          ${authors.map((author) => `<option value="${author.id}" ${selectedAuthor === author.id ? "selected" : ""}>${author.name}</option>`).join("")}
        </select>
        <input type="date" name="dateFrom" value="${escapeHtml(dateFrom)}" aria-label="From date">
        <input type="date" name="dateTo" value="${escapeHtml(dateTo)}" aria-label="To date">
        <select name="sort">
          <option value="relevance" ${sort === "relevance" ? "selected" : ""}>Relevance</option>
          <option value="newest" ${sort === "newest" ? "selected" : ""}>Newest</option>
          <option value="popular" ${sort === "popular" ? "selected" : ""}>Most popular</option>
          <option value="oldest" ${sort === "oldest" ? "selected" : ""}>Oldest</option>
        </select>
        <button class="button primary" type="submit">Search</button>
      </form>
      <form class="voice-search-card" data-voice-search-form>
        <label>Voice-style search transcript<input name="transcript" placeholder="Example: best AI chips for local inference"></label>
        <button class="button secondary" type="submit">Interpret search</button>
        <p class="form-message" data-form-message></p>
      </form>
    </section>
    <section class="content-band search-journey-panel">
      <div class="section-heading">
        <span>Reader journey</span>
        <h2>Discovery paths beyond one query</h2>
      </div>
      <div class="search-journey-grid">
        <a class="reader-card" href="#/sections"><span>Browse</span><h2>Sections hub</h2><p>Move by topic desk, magazine format, and live signal.</p></a>
        <a class="reader-card" href="#/feed"><span>Personalized</span><h2>Technology feed</h2><p>Blend articles, IT rooms, videos, and followed authors.</p></a>
        <a class="reader-card" href="#/authors"><span>Trust</span><h2>Author directory</h2><p>Find journalists by beat, expertise, and verified profile.</p></a>
        <a class="reader-card" href="#/devices"><span>Research</span><h2>Device database</h2><p>Compare products, specs, benchmarks, and reviews.</p></a>
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading small">
        <span>${Number(resultPagination?.total || results.length || 0).toLocaleString()} results</span>
        <h2>${escapeHtml(correctedQuery || query || (selectedCategory ? categoryBySlug(selectedCategory).name : "All content"))}</h2>
      </div>
      ${semantic ? `<p class="search-hint">Semantic discovery active: ${(semantic.tokens || []).slice(0, 10).map(escapeHtml).join(", ") || "keyword intent"}.</p>` : ""}
      ${correctedQuery ? `<p class="search-hint">Showing results for <strong>${escapeHtml(correctedQuery)}</strong>. Original search: ${escapeHtml(query)}.</p>` : ""}
      <div class="search-save-row">
        ${readerSession.token ? `<button class="button secondary" type="button" data-save-current-search>Save this search</button>` : `<a class="button secondary" href="#/account">Sign in to save searches</a>`}
        <a class="button ghost" href="#/search?sort=popular">Popular searches</a>
        <a class="button ghost" href="#/search?type=video">Videos</a>
        <a class="button ghost" href="#/search?type=podcast">Podcasts</a>
      </div>
      ${readerSession.token ? `
        <div class="saved-search-strip">
          <span>Saved searches</span>
          <div>${savedSearchFilters.map((filter) => {
            const filters = filter.filters || {};
            const linkParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => { if (value) linkParams.set(key === "query" ? "query" : key, value); });
            return `<a href="#/search?${linkParams.toString()}">${escapeHtml(filter.name)}</a>`;
          }).join("") || `<small>No saved searches yet.</small>`}</div>
        </div>
      ` : ""}
      <div class="search-assist">
        <section>
          <span>Suggestions</span>
          <div>${suggestions.map((item) => `<a href="${item.type === "article" ? `#/article/${escapeHtml(item.value)}` : `#/search?${item.type === "category" ? `category=${escapeHtml(item.value)}` : item.type === "author" ? `author=${escapeHtml(item.value)}` : `query=${encodeURIComponent(item.label)}`}`}">${escapeHtml(item.label)}</a>`).join("") || `<small>No suggestions yet.</small>`}</div>
        </section>
        <section>
          <span>Trending searches</span>
          <div>${trending.map((item) => `<a href="#/search?query=${encodeURIComponent(item.label)}">${escapeHtml(item.label)}</a>`).join("") || `<small>Searches will appear after readers use search.</small>`}</div>
        </section>
        <section>
          <span>Content types</span>
          <div>${(facets.types || []).map((item) => `<a href="#/search?query=${encodeURIComponent(query)}&type=${encodeURIComponent(item.label)}">${escapeHtml(item.label)} (${Number(item.count).toLocaleString()})</a>`).join("") || `<small>All indexed content is searchable.</small>`}</div>
        </section>
        <section>
          <span>Topic facets</span>
          <div>${(facets.categories || []).slice(0, 8).map((item) => `<a href="#/search?query=${encodeURIComponent(query)}&category=${encodeURIComponent(item.label)}">${escapeHtml(categoryBySlug(item.label).name || item.label)} (${Number(item.count).toLocaleString()})</a>`).join("") || `<small>Choose a category above to narrow results.</small>`}</div>
        </section>
      </div>
      ${paginationControls(resultPagination, "#/search", params)}
      <div class="article-grid">${results.map(searchResultCard).join("") || `<p class="muted">No matching content yet.</p>`}</div>
      ${paginationControls(resultPagination, "#/search", params)}
    </section>
  `;
}

function renderAuthor(id) {
  const author = authorById(id);
  const byAuthor = articles.filter((article) => article.author === author.id);
  const metrics = authorTrustMetrics(author, byAuthor);
  const following = readerSession.social?.follows?.some((item) => item.id === author.id);
  const credentials = author.credentials || [];
  setTitle(`${author.name} - ${author.role}`, `${author.bio} ${author.beat || ""}`);
  app.innerHTML = `
    <section class="author-profile author-profile-pro">
      <div class="author-photo-stack">
        <img src="${escapeHtml(author.avatar)}" alt="${escapeHtml(author.name)}">
        ${author.verified ? `<span class="verified-badge">Verified author</span>` : ""}
      </div>
      <div class="author-profile-copy">
        <span>${escapeHtml(author.role)}</span>
        <h1>${escapeHtml(author.name)}</h1>
        <p>${escapeHtml(author.bio)}</p>
        <div class="author-meta-row">
          ${author.location ? `<span>${escapeHtml(author.location)}</span>` : ""}
          ${author.beat ? `<span>${escapeHtml(author.beat)}</span>` : ""}
          ${author.experienceYears ? `<span>${Number(author.experienceYears).toLocaleString()} years reporting</span>` : ""}
        </div>
        <div class="author-expertise">${authorExpertiseChips(author)}</div>
        <div class="author-actions">
          <button class="button primary" type="button" data-follow-author="${escapeHtml(author.id)}">${following ? "Following" : "Follow author"}</button>
          ${author.contactEmail ? `<a class="button secondary" href="mailto:${escapeHtml(author.contactEmail)}">Contact desk</a>` : ""}
          ${authorSocialLinks(author)}
        </div>
      </div>
    </section>
    <section class="content-band author-trust-grid">
      <article>
        <span>Published work</span>
        <strong>${byAuthor.length.toLocaleString()}</strong>
        <p>Public articles connected to this author profile.</p>
      </article>
      <article>
        <span>Total readership</span>
        <strong>${metrics.totalViews.toLocaleString()}</strong>
        <p>Combined public article views tracked by the platform.</p>
      </article>
      <article>
        <span>Average depth</span>
        <strong>${metrics.avgMinutes || "-"} min</strong>
        <p>Average reading time across this author archive.</p>
      </article>
      <article>
        <span>Accountability</span>
        <strong>${author.verified ? "Verified" : "Listed"}</strong>
        <p>Profile details, editorial role, source method, and corrections path are public.</p>
      </article>
    </section>
    <section class="content-band author-standards">
      <div>
        <span>Source method</span>
        <p>${escapeHtml(author.sourcePolicy || "This author follows Tech Magazine editorial standards for verification, sourcing, and corrections.")}</p>
      </div>
      <div>
        <span>Corrections</span>
        <p>${escapeHtml(author.correctionsPolicy || "Correction requests are reviewed by the editorial desk and recorded when material changes are made.")}</p>
      </div>
      <div>
        <span>Credentials</span>
        <ul>${(credentials.length ? credentials : ["Tech Magazine editorial contributor"]).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading">
        <span>Author archive</span>
        <h2>Latest reporting by ${escapeHtml(author.name)}</h2>
      </div>
      <div class="article-grid">${byAuthor.map((article) => articleCard(article)).join("") || `<p class="muted">No published articles yet.</p>`}</div>
    </section>
  `;
}

function renderAuthorsDirectory() {
  setTitle("Authors", "Verified author profiles, expertise areas, beats, and published reporting from Tech Magazine.");
  app.innerHTML = `
    <section class="compact-hero company-hero">
      <span>Editorial credibility</span>
      <h1>Verified technology journalists and contributors</h1>
      <p>Every public author profile shows role, beat, expertise, source method, correction path, and a direct profile archive.</p>
    </section>
    <section class="content-band author-directory-grid">
      ${authors.map((author) => {
        const authorArticles = articles.filter((article) => article.author === author.id);
        const metrics = authorTrustMetrics(author, authorArticles);
        return `
          <article class="author-directory-card">
            <img src="${escapeHtml(author.avatar)}" alt="${escapeHtml(author.name)}">
            <div>
              <span>${escapeHtml(author.role)} ${author.verified ? "/ Verified" : ""}</span>
              <h2><a href="#/author/${escapeHtml(author.id)}">${escapeHtml(author.name)}</a></h2>
              <p>${escapeHtml(author.bio)}</p>
              <div class="author-expertise">${authorExpertiseChips(author, 4)}</div>
              <div class="stat-row"><strong>${authorArticles.length}</strong><span>articles</span><strong>${metrics.totalViews.toLocaleString()}</strong><span>views</span></div>
            </div>
          </article>
        `;
      }).join("")}
    </section>
  `;
}

function newsletterBlock() {
  const segments = audienceConversion.segments || [];
  return `
    <section class="newsletter-band">
      <div>
        <span>Newsletter and briefings</span>
        <h2>Build your personal technology briefing</h2>
        <p>Choose a focused newsletter, confirm by email, then connect alerts so the newsroom can reach you for breaking news, live events, and followed topics.</p>
        <div class="newsletter-value-row">
          <article><strong>${Number(audienceConversion.confirmedSubscribers || audienceConversion.subscribers || 0).toLocaleString()}</strong><small>confirmed subscribers</small></article>
          <article><strong>${Number(audienceConversion.campaignCount || 0).toLocaleString()}</strong><small>campaigns prepared</small></article>
          <article><strong>${Number(audienceConversion.openRate || 0).toLocaleString()}%</strong><small>tracked open rate</small></article>
        </div>
        ${segments.length ? `<div class="segment-preview">${segments.slice(0, 4).map((item) => `<span>${escapeHtml(item.segment)} / ${Number(item.count || 0).toLocaleString()}</span>`).join("")}</div>` : ""}
      </div>
      <form data-newsletter-form>
        <label>Email address<input type="email" name="email" placeholder="you@example.com" required></label>
        ${newsletterTopicControls("weekly-tech")}
        <div class="newsletter-consent">
          <span>Double opt-in required</span>
          <small>You will receive a confirmation email before subscription becomes active. Forms are rate limited server-side.</small>
        </div>
        <button class="button primary" type="submit">Subscribe to briefing</button>
        <a class="button ghost" href="#/notifications">Tune alert preferences</a>
        <p class="form-message" data-form-message></p>
      </form>
    </section>
  `;
}

async function renderNewsletterExperience() {
  setTitle("Newsletter", "Focused technology briefings, double opt-in, segments, automations, and email preferences from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Newsletter</span><h1>Loading briefings</h1><p>Preparing segments, campaigns, and reader preferences.</p></section>`;
  const experience = await loadNewsletterExperience();
  const stats = experience?.stats || {};
  const readiness = experience?.readiness || {};
  const readinessItems = [
    ["Double opt-in", readiness.doubleOptInReady],
    ["Segmentation", readiness.segmentationReady],
    ["Campaign builder", readiness.campaignBuilderReady],
    ["Templates", readiness.templateFieldsReady],
    ["A/B testing", readiness.abTestingReady],
    ["Automations", readiness.automationsReady],
    ["Event tracking", readiness.eventTrackingReady],
    ["Unsubscribe", readiness.unsubscribeReady]
  ];
  app.innerHTML = `
    <section class="page-hero compact-hero newsletter-hero-pro">
      <span>Newsletter and email marketing</span>
      <h1>Build your personal technology briefing</h1>
      <p>Subscribe by topic, confirm with double opt-in, connect alert preferences, and receive editorial briefings built for AI, security, startups, gaming, cloud, and enterprise technology readers.</p>
      <div class="hero-actions">
        <a class="button primary" href="#newsletter-signup">Choose briefing</a>
        <a class="button secondary" href="#/notifications">Alert preferences</a>
        <a class="button ghost" href="#/account">Reader profile</a>
      </div>
      <div class="newsletter-signal-row">
        <article><strong>${Number(stats.confirmedSubscribers || 0).toLocaleString()}</strong><span>confirmed</span></article>
        <article><strong>${Number(stats.pendingSubscribers || 0).toLocaleString()}</strong><span>pending opt-in</span></article>
        <article><strong>${Number(stats.campaignCount || 0).toLocaleString()}</strong><span>campaigns</span></article>
        <article><strong>${Number(stats.openRate || 0).toLocaleString()}%</strong><span>open rate</span></article>
      </div>
      <div class="readiness-pills newsletter-readiness-pills">
        ${readinessItems.map(([label, ready]) => `<span class="${ready ? "ready" : "pending"}">${escapeHtml(label)} ${ready ? "ready" : "review"}</span>`).join("")}
      </div>
    </section>
    <section class="content-band newsletter-command-grid">
      <article class="reader-card newsletter-status-card">
        <span>${experience?.signedIn ? "Reader status" : "Subscriber journey"}</span>
        <h2>${experience?.signedIn ? escapeHtml(experience.reader?.name || "Reader") : "Confirm once, personalize forever"}</h2>
        <p>${experience?.subscriber ? `Subscription status: ${escapeHtml(experience.subscriber.status)} / segment: ${escapeHtml(experience.subscriber.segment)}.` : "Your email is not subscribed yet. Choose a segment and confirm the queued email before campaigns can reach you."}</p>
        <div class="newsletter-mini-metrics">
          <article><strong>${Number(stats.automations || 0).toLocaleString()}</strong><small>automations</small></article>
          <article><strong>${Number(stats.clickRate || 0).toLocaleString()}%</strong><small>click rate</small></article>
          <article><strong>${Number(stats.unsubscribes || 0).toLocaleString()}</strong><small>unsubscribes</small></article>
        </div>
      </article>
      <article class="reader-card">
        <span>Segments</span>
        <h2>Topic briefings</h2>
        <div class="newsletter-segment-list">
          ${(experience?.segments || []).slice(0, 8).map((segment) => `<a href="#newsletter-signup"><strong>${escapeHtml(segment.label)}</strong><small>${Number(segment.count || 0).toLocaleString()} ${escapeHtml(segment.status || "subscribers")}</small></a>`).join("") || `<p class="muted">Segments will appear as readers subscribe.</p>`}
        </div>
      </article>
      <article class="reader-card">
        <span>Next actions</span>
        <h2>Make email useful</h2>
        <div class="feed-action-stack">${(experience?.nextActions || []).map((item) => `<a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a>`).join("")}</div>
      </article>
    </section>
    <section class="content-band newsletter-journey-band">
      <div class="section-heading"><span>Email workflow</span><h2>From signup to measurable campaign</h2></div>
      <div class="newsletter-journey-grid">
        ${(experience?.journey || []).map((step) => `<article class="reader-card"><span>${escapeHtml(step.label)}</span><h2>${escapeHtml(step.label)}</h2><p>${escapeHtml(step.body)}</p></article>`).join("")}
      </div>
    </section>
    <section class="content-band newsletter-layout-pro" id="newsletter-signup">
      ${newsletterBlock()}
      <aside class="reader-card newsletter-side-panel">
        <span>Recent campaigns</span>
        <h2>Briefings in the newsroom</h2>
        <div class="mini-leaderboard-list">
          ${(experience?.campaigns || []).slice(0, 5).map((campaign) => `<a href="#newsletter-signup"><strong>${escapeHtml(campaign.subject)}</strong><small>${escapeHtml(campaign.segment)} / ${escapeHtml(campaign.status)} / ${Number(campaign.openCount || 0).toLocaleString()} opens</small></a>`).join("") || `<p class="muted">No campaigns prepared yet.</p>`}
        </div>
      </aside>
    </section>
    <section class="content-band newsletter-command-grid">
      <article class="reader-card">
        <span>Automated email workflows</span>
        <h2>Triggered messages</h2>
        <div class="mini-leaderboard-list">
          ${(experience?.automations || []).slice(0, 5).map((automation) => `<a href="#newsletter-signup"><strong>${escapeHtml(automation.name)}</strong><small>${escapeHtml(automation.triggerType)} / ${escapeHtml(automation.segment)} / ${escapeHtml(automation.status)}</small></a>`).join("") || `<p class="muted">No automations configured yet.</p>`}
        </div>
      </article>
      <article class="reader-card">
        <span>Analytics</span>
        <h2>Open, click, unsubscribe</h2>
        <div class="newsletter-mini-metrics">
          <article><strong>${Number(experience?.eventAnalytics?.openEvents || 0).toLocaleString()}</strong><small>opens</small></article>
          <article><strong>${Number(experience?.eventAnalytics?.clickEvents || 0).toLocaleString()}</strong><small>clicks</small></article>
          <article><strong>${Number(experience?.eventAnalytics?.unsubscribeEvents || 0).toLocaleString()}</strong><small>unsubscribes</small></article>
        </div>
      </article>
      <form class="admin-form reader-card" data-newsletter-unsubscribe>
        <span>Preference center</span>
        <h2>Unsubscribe safely</h2>
        <p>Use the same email used for subscription. The system records an unsubscribe event for compliance and analytics.</p>
        <label>Email<input type="email" name="email" value="${escapeHtml(experience?.reader?.email || "")}" required></label>
        <button class="button ghost" type="submit">Unsubscribe</button>
        <p class="form-message" data-form-message></p>
      </form>
    </section>
  `;
}

function preferenceChips(name, items, selected = [], limit = 10) {
  const selectedSet = new Set(selected || []);
  return items.slice(0, limit).map((item) => `
    <label class="preference-chip">
      <input type="checkbox" name="${name}" value="${escapeHtml(item.id || item.slug)}" ${selectedSet.has(item.id || item.slug) ? "checked" : ""}>
      <span>${escapeHtml(item.name)}</span>
    </label>
  `).join("");
}

function completionChecklist(items = []) {
  return items.map((item) => `
    <li class="${item.done ? "complete" : ""}">
      <span>${item.done ? "Done" : "Next"}</span>
      ${escapeHtml(item.label)}
    </li>
  `).join("");
}

function savedSearchCards(filters = []) {
  return filters.slice(0, 4).map((item) => {
    const filters = item.filters || {};
    const params = new URLSearchParams();
    if (filters.query) params.set("query", filters.query);
    if (filters.type && filters.type !== "all") params.set("type", filters.type);
    if (filters.category) params.set("category", filters.category);
    if (filters.author) params.set("author", filters.author);
    if (filters.sort) params.set("sort", filters.sort);
    return `
      <a class="saved-search-card" href="#/search?${params.toString()}">
        <span>${escapeHtml(filters.type || "all")} / ${escapeHtml(filters.sort || "relevance")}</span>
        <strong>${escapeHtml(item.name || filters.query || "Saved search")}</strong>
        <small>${escapeHtml(filters.query || filters.category || "Open saved discovery view")}</small>
      </a>
    `;
  }).join("");
}

function mobileDeviceCards(devices = []) {
  return devices.map((device) => `
    <article class="reader-card mobile-device-card">
      <span>${escapeHtml(device.platform || "device")} / ${escapeHtml(device.appVersion || "app")}</span>
      <h3>${escapeHtml(device.deviceName || device.installationId || "Mobile install")}</h3>
      <p>${device.pushEnabled ? "Push connected" : "Push not enabled"} / ${escapeHtml((device.channels || []).join(", ") || "default channels")}</p>
      <small>Last seen ${escapeHtml(device.lastSeenAt || "not synced yet")}</small>
    </article>
  `).join("");
}

function mobileQaChecklist(items = []) {
  return items.map((item) => `<li class="${item.done ? "complete" : ""}"><span>${item.done ? "Ready" : "Next"}</span>${escapeHtml(item.label)}</li>`).join("");
}

function mobileDeepLinkCards() {
  const links = [
    ["Article", "techmagazine://article/ai-agents-newsroom-workflows", "#/article/ai-agents-newsroom-workflows"],
    ["Live", "techmagazine://live/ai-leadership-forum", "#/live"],
    ["Search", "techmagazine://search/ai", "#/search?query=ai"],
    ["Profile", "techmagazine://account", "#/account"]
  ];
  return links.map(([label, deepLink, webUrl]) => `
    <article class="reader-card mobile-link-card">
      <span>${label}</span>
      <h3>${escapeHtml(deepLink)}</h3>
      <a href="${escapeHtml(webUrl)}">Open web route</a>
    </article>
  `).join("");
}

async function renderMobileExperience() {
  setTitle("Mobile Experience", "Mobile app API, offline reading, push notifications, widgets, and cross-device sync for Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Mobile</span><h1>Loading mobile experience</h1><p>Checking app API, offline library, push readiness, widgets, and deep links.</p></section>`;
  const data = await loadMobileExperience();
  if (!data) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Mobile</span><h1>Mobile layer unavailable</h1><p>Could not load the mobile experience API.</p><a class="button primary" href="#/">Back home</a></section>`;
    return;
  }
  const prefs = data.notificationPrefs || {};
  const offline = data.offline || [];
  const devices = data.devices || [];
  const analytics = data.analytics || {};
  const feedPreview = data.feedPreview || [];
  app.innerHTML = `
    <section class="page-hero compact-hero mobile-hero-pro">
      <span>Mobile and cross-device</span>
      <h1>App-ready reader experience</h1>
      <p>Tech Magazine now exposes the core mobile contract: personalized feeds, offline saves, push preferences, widgets, analytics events, and deep links for native iOS and Android builds.</p>
      <div class="hero-actions">
        <a class="button primary" href="#/notifications">Notification center</a>
        <a class="button secondary" href="#/account">${readerSession.reader ? "Reader profile" : "Sign in to sync"}</a>
      </div>
      <div class="mobile-signal-row">
        <article><strong>${Number(analytics.devices || 0).toLocaleString()}</strong><span>registered devices</span></article>
        <article><strong>${Number(analytics.pushEnabled || 0).toLocaleString()}</strong><span>push enabled</span></article>
        <article><strong>${Number(analytics.offlineItems || 0).toLocaleString()}</strong><span>offline items</span></article>
        <article><strong>${Number(feedPreview.length || 0).toLocaleString()}</strong><span>feed preview</span></article>
      </div>
    </section>
    <section class="content-band mobile-command-grid">
      <section class="reader-card">
        <div class="card-heading-row">
          <div><span>Native app contract</span><h2>Capabilities</h2></div>
          <strong>${data.sync?.apiContractReady ? "Ready" : "Review"}</strong>
        </div>
        <div class="mobile-capability-grid">
          ${Object.entries(data.capabilities || {}).map(([key, value]) => `<article><span>${escapeHtml(key.replace(/([A-Z])/g, " $1"))}</span><strong>${Array.isArray(value) ? value.length : value ? "Yes" : "No"}</strong></article>`).join("")}
        </div>
      </section>
      <section class="reader-card">
        <div class="card-heading-row">
          <div><span>QA checklist</span><h2>Mobile readiness</h2></div>
          <a class="button secondary" href="/api/mobile/config">Config API</a>
        </div>
        <ul class="mobile-checklist">${mobileQaChecklist(data.qaChecklist || [])}</ul>
      </section>
    </section>
    <section class="content-band mobile-command-grid">
      <section class="reader-card">
        <div class="card-heading-row">
          <div><span>Devices</span><h2>Cross-device sync</h2></div>
          <button class="button secondary" type="button" data-mobile-register-device>${readerSession.reader ? "Register web test device" : "Sign in first"}</button>
        </div>
        <div class="mini-grid">${mobileDeviceCards(devices) || `<div class="empty-state"><strong>No devices connected yet</strong><p>Register a device from the native app or use the web test control after signing in.</p></div>`}</div>
        <p class="form-message" data-mobile-message></p>
      </section>
      <section class="reader-card">
        <div class="card-heading-row">
          <div><span>Offline</span><h2>Saved for offline</h2></div>
          <button class="button secondary" type="button" data-mobile-save-offline="ai-agents-newsroom-workflows">${readerSession.reader ? "Save top story offline" : "Sign in first"}</button>
        </div>
        <div class="offline-library-list">
          ${offline.slice(0, 5).map((item) => `<a href="#/${item.type === "article" ? "article" : item.type}/${escapeHtml(item.slug)}"><span>${escapeHtml(item.type)}</span><strong>${escapeHtml(item.title)}</strong><small>Synced ${escapeHtml(item.lastSyncedAt || "")}</small></a>`).join("") || `<div class="empty-state"><strong>No offline saves yet</strong><p>Saved stories, podcast episodes, and videos appear here for app sync.</p></div>`}
        </div>
        <p class="form-message" data-offline-message></p>
      </section>
    </section>
    <section class="content-band mobile-command-grid">
      <section class="reader-card">
        <div class="card-heading-row">
          <div><span>Push preferences</span><h2>Delivery status</h2></div>
          <a class="button secondary" href="#/notifications">Tune alerts</a>
        </div>
        <div class="mobile-pref-grid">
          <article><span>Breaking</span><strong>${prefs.breaking !== false ? "On" : "Off"}</strong></article>
          <article><span>Newsletters</span><strong>${prefs.newsletters !== false ? "On" : "Off"}</strong></article>
          <article><span>Live events</span><strong>${prefs.liveEvents !== false ? "On" : "Off"}</strong></article>
          <article><span>Push</span><strong>${prefs.pushEnabled ? "Connected" : "Waiting"}</strong></article>
        </div>
      </section>
      <section class="reader-card">
        <div class="card-heading-row">
          <div><span>Deep links</span><h2>Native routes</h2></div>
          <a class="button secondary" href="/api/mobile/deep-link?url=techmagazine://article/ai-agents-newsroom-workflows">Test resolver</a>
        </div>
        <div class="mobile-deep-link-grid">${mobileDeepLinkCards()}</div>
      </section>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Widgets</span><h2>Home-screen content</h2></div>
      <div class="mini-grid">
        ${(data.widgets?.trending || []).slice(0, 3).map((item) => `<a class="reader-card" href="#/article/${escapeHtml(item.slug)}"><span>Trending widget</span><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.subtitle || "")}</p></a>`).join("")}
        ${(data.widgets?.live || []).slice(0, 2).map((item) => `<a class="reader-card" href="#/live/${escapeHtml(item.slug)}"><span>Live widget</span><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.status || "")}</p></a>`).join("")}
      </div>
    </section>
  `;
}

async function renderAccount() {
  const experience = readerSession.reader ? await loadReaderExperience() : null;
  const saved = (experience?.bookmarks?.length ? experience.bookmarks : readerSession.bookmarks.map((slug) => articleBySlug(slug)).filter(Boolean));
  const gamification = experience?.gamification || readerSession.social?.gamification || null;
  const preferences = experience?.preferences || { categories: [], authors: [], emailFrequency: "weekly", theme: "system", languageCode: currentLanguage };
  const follows = experience?.follows || readerSession.social?.follows || [];
  const recommendations = experience?.recommendations?.length ? experience.recommendations : personalizedArticles({ limit: 4 });
  const completion = experience?.completion || { score: 0, completed: 0, total: 6, items: [] };
  const readerName = readerSession.reader?.name || "Reader";
  const readerInitial = readerName.trim().slice(0, 1).toUpperCase() || "R";
  const badges = gamification?.badges || experience?.reputation?.badges || [];
  const nextActions = experience?.retention?.nextBestActions || [];
  setTitle(readerSession.reader ? "Reader Profile" : "Reader Sign In", "Create a reader account, manage profile details, and save articles.");
  app.innerHTML = `
    <section class="account-hero account-hero-pro">
      <div>
        <span>Reader account</span>
        <h1>${readerSession.reader ? `Welcome back, ${escapeHtml(readerName.split(" ")[0])}` : "Build your personal technology desk"}</h1>
        <p>${readerSession.reader ? "Your saved stories, followed authors, alerts, reading progress, and recommendations now work together from one reader dashboard." : "Create a free account to save stories, follow authors, tune alerts, join rooms, and make the site adapt to your interests."}</p>
        <div class="hero-actions">
          <a class="button primary" href="#/feed">Open feed</a>
          <a class="button secondary" href="#/notifications">Alert center</a>
        </div>
      </div>
      <div class="account-hero-card completion-card">
        <span>${readerSession.reader ? "Profile strength" : "Reader benefits"}</span>
        <strong>${readerSession.reader ? `${Number(completion.score || 0).toLocaleString()}%` : "Free"}</strong>
        <p>${readerSession.reader ? `${completion.completed || 0} of ${completion.total || 6} retention signals connected` : "Bookmarks, follows, alerts, newsletters, and community tools."}</p>
      </div>
    </section>
    ${readerSession.reader ? `
      <section class="content-band reader-command-center">
        <form class="reader-card account-profile-card profile-command-card" data-reader-profile>
          <div class="profile-summary">
            ${readerSession.reader.avatar ? `<img src="${escapeHtml(readerSession.reader.avatar)}" alt="${escapeHtml(readerName)}">` : `<div class="profile-initial">${escapeHtml(readerInitial)}</div>`}
            <div>
              <span>Signed in</span>
              <h2>${escapeHtml(readerName)}</h2>
              <p>${escapeHtml(readerSession.reader.email || "Reader account")}</p>
            </div>
          </div>
          <div class="profile-fields">
            <label>Name<input name="name" value="${escapeHtml(readerName)}" required></label>
            <label>Avatar URL<input name="avatar" value="${escapeHtml(readerSession.reader.avatar || "")}" placeholder="https://..."></label>
            <label>Bio<textarea name="bio" placeholder="Tell readers what you care about">${escapeHtml(readerSession.reader.bio || "")}</textarea></label>
          </div>
          <div class="preference-editor">
            <div class="card-heading-row">
              <div><span>Personalization</span><h2>Your interests</h2></div>
              <small>${Number(preferences.categories?.length || 0).toLocaleString()} topics selected</small>
            </div>
            <div class="preference-group">
              <strong>Favorite categories</strong>
              <div class="preference-chip-grid">${preferenceChips("preferredCategories", publicCategories(), preferences.categories, 12)}</div>
            </div>
            <div class="preference-group">
              <strong>Authors to prioritize</strong>
              <div class="preference-chip-grid">${preferenceChips("preferredAuthors", authors, preferences.authors, 6)}</div>
            </div>
            <div class="preference-select-grid">
              <label>Email rhythm<select name="emailFrequency">
                ${["daily", "weekly", "breaking_only", "monthly"].map((value) => `<option value="${value}" ${preferences.emailFrequency === value ? "selected" : ""}>${value.replace("_", " ")}</option>`).join("")}
              </select></label>
              <label>Theme preference<select name="theme">
                ${["system", "dark", "light"].map((value) => `<option value="${value}" ${preferences.theme === value ? "selected" : ""}>${value}</option>`).join("")}
              </select></label>
              <label>Language<select name="languageCode">
                ${languages.map((language) => `<option value="${escapeHtml(language.code)}" ${preferences.languageCode === language.code ? "selected" : ""}>${escapeHtml(language.name)}</option>`).join("")}
              </select></label>
            </div>
          </div>
          <div class="account-actions">
            <button class="button primary" type="submit">Save profile and interests</button>
            <button class="button ghost" type="button" data-reader-logout>Log out</button>
          </div>
          <p class="form-message" data-form-message></p>
        </form>
        <aside class="reader-account-rail">
          <section class="reader-card progress-card">
            <div class="card-heading-row">
              <div><span>Reader progress</span><h2>Your activity</h2></div>
              <a class="button secondary" href="#/leaderboard">Leaderboard</a>
            </div>
            <div class="progress-metrics">
              <article><span>Points</span><strong>${Number(gamification?.points || 0).toLocaleString()}</strong></article>
              <article><span>Streak</span><strong>${Number(gamification?.streak?.currentStreak || 0).toLocaleString()}</strong><small>days</small></article>
              <article><span>Reads</span><strong>${Number(gamification?.completedReads || 0).toLocaleString()}</strong></article>
              <article><span>Rank</span><strong>#${Number(gamification?.rank || 0).toLocaleString()}</strong></article>
            </div>
            <div class="badge-row">${badges.length ? badges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join("") : `<span>Read</span><span>Save</span><span>Comment</span><span>Follow</span>`}</div>
          </section>
          <section class="reader-card completion-panel">
            <div class="card-heading-row">
              <div><span>Retention path</span><h2>Next best actions</h2></div>
              <strong>${Number(completion.score || 0)}%</strong>
            </div>
            <ul>${completionChecklist(completion.items)}</ul>
            <p class="muted">${nextActions.length ? `Next: ${nextActions.map((item) => item.label).join(", ")}.` : "Your reader setup is complete. Keep reading to grow your streak."}</p>
          </section>
        </aside>
      </section>
      <section class="content-band reader-retention-grid">
        <section class="reader-card saved-card">
          <div class="card-heading-row">
            <div><span>Library</span><h2>Saved articles</h2></div>
            <a class="button secondary" href="#/">Browse stories</a>
          </div>
          <div class="mini-grid">${saved.slice(0, 4).map((article) => articleCard(article, "compact")).join("") || `<div class="empty-state"><strong>No saved articles yet</strong><p>Open any article and press Save to build your reading list.</p></div>`}</div>
        </section>
        <section class="reader-card">
          <div class="card-heading-row">
            <div><span>Recommended</span><h2>Based on your signals</h2></div>
            <a class="button secondary" href="#/feed">Open feed</a>
          </div>
          <div class="mini-grid">${recommendations.slice(0, 4).map((article) => articleCard(article, "compact")).join("")}</div>
        </section>
        <section class="reader-card">
          <div class="card-heading-row">
            <div><span>Following</span><h2>Author signal</h2></div>
            <a class="button secondary" href="#/authors">Find authors</a>
          </div>
          <div class="follow-list">${follows.length ? follows.map((author) => `<a href="#/author/${escapeHtml(author.id)}"><span>${escapeHtml(author.role || "Author")}</span><strong>${escapeHtml(author.name)}</strong></a>`).join("") : `<div class="empty-state"><strong>No followed authors yet</strong><p>Follow verified writers from author pages to shape your feed.</p></div>`}</div>
        </section>
        <section class="reader-card">
          <div class="card-heading-row">
            <div><span>Saved discovery</span><h2>Search shortcuts</h2></div>
            <a class="button secondary" href="#/search">Search</a>
          </div>
          <div class="saved-search-grid">${savedSearchCards(experience?.savedSearches || savedSearchFilters) || `<div class="empty-state"><strong>No saved searches yet</strong><p>Run a search, then save the filter for repeat discovery.</p></div>`}</div>
        </section>
      </section>
    ` : `
      <section class="content-band account-onboarding-grid">
        <div class="reader-card account-onboarding-copy">
          <span>Why sign in</span>
          <h2>A reader account turns the site into your own briefing desk</h2>
          <div class="onboarding-steps">
            <article><strong>1</strong><span>Save articles, videos, podcasts, and searches.</span></article>
            <article><strong>2</strong><span>Pick favorite topics and follow trusted authors.</span></article>
            <article><strong>3</strong><span>Receive alerts, newsletters, and feed recommendations.</span></article>
          </div>
        </div>
        <form class="reader-card auth-card" data-reader-login>
          <span>Welcome back</span>
          <h2>Sign in</h2>
          <p>Use your reader account to save articles, comment, and personalize recommendations.</p>
          <label>Email<input type="email" name="email" placeholder="you@example.com" required></label>
          <label>Password<input type="password" name="password" placeholder="Your password" required></label>
          <button class="button primary" type="submit">Sign in</button>
          <p class="form-message" data-form-message></p>
        </form>
        <form class="reader-card auth-card featured-auth" data-reader-register>
          <span>New reader</span>
          <h2>Create account</h2>
          <p>Start a free profile for bookmarks, followed authors, alerts, and community activity.</p>
          <label>Name<input name="name" placeholder="Joe Ghawi" required></label>
          <label>Email<input type="email" name="email" placeholder="joe@example.com" required></label>
          <label>Password<input type="password" name="password" minlength="8" placeholder="At least 8 characters" required></label>
          <button class="button primary" type="submit">Create account</button>
          <p class="form-message" data-form-message></p>
        </form>
      </section>
    `}
  `;
}

function moneyFromCents(cents = 0) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`;
}

function commercialSignalCards(experience) {
  const signals = experience?.revenueSignals || {};
  return [
    ["MRR", moneyFromCents(signals.monthlyRecurring), "manual membership run rate"],
    ["Sponsors", moneyFromCents(signals.sponsoredRevenue), "recorded campaign value"],
    ["Ads", Number(signals.adImpressions || 0).toLocaleString(), "tracked impressions"],
    ["Affiliates", Number(signals.affiliateClicks || 0).toLocaleString(), "partner redirects"]
  ].map(([label, value, detail]) => `<article><span>${label}</span><strong>${value}</strong><small>${detail}</small></article>`).join("");
}

function readinessPills(readiness = {}) {
  return [
    ["Manual checkout", readiness.manualCheckoutReady],
    ["Paywall", readiness.paywallReady],
    ["Sponsor workflow", readiness.sponsorWorkflowReady],
    ["Ad inventory", readiness.adInventoryReady],
    ["Video ads", readiness.videoAdsReady],
    ["Affiliate tracking", readiness.affiliateTrackingReady],
    ["Revenue reports", readiness.revenueReportingReady],
    ["Payment gateway", readiness.paymentGatewayConnected],
    ["Ad server", readiness.adServerConnected],
    ["Invoice workflow", readiness.invoiceWorkflowConnected]
  ].map(([label, ready]) => `<span class="${ready ? "ready" : "pending"}">${label}</span>`).join("");
}

function commercialModelCards(experience) {
  const models = experience?.revenueModel?.length ? experience.revenueModel : [];
  return models.map((model) => `
    <article class="reader-card commercial-model-card">
      <span>${escapeHtml(model.label)}</span>
      <h2>${escapeHtml(model.title)}</h2>
      <p>${escapeHtml(model.description)}</p>
      <small>${escapeHtml(model.status)}</small>
    </article>
  `).join("");
}

function sponsorJourneyCards(experience) {
  const stages = experience?.sponsorJourney?.length ? experience.sponsorJourney : [];
  return stages.map((stage, index) => `
    <article class="reader-card sponsor-journey-card">
      <span>${Number(index + 1).toLocaleString()} / ${escapeHtml(stage.stage)}</span>
      <p>${escapeHtml(stage.description)}</p>
    </article>
  `).join("");
}

function commercialReadinessPanel(experience) {
  const readiness = experience?.readiness || {};
  return `
    <article class="reader-card commercial-readiness-panel">
      <span>Production status</span>
      <h2>${readiness.productionPaymentsConnected ? "Payment provider connected" : "Manual payment mode is active"}</h2>
      <p>${escapeHtml(readiness.productOwnerDecisionNeeded || "Third-party providers can be connected during deployment.")}</p>
      <div class="readiness-pills">${readinessPills(readiness)}</div>
    </article>
  `;
}

function membershipStatusCard(experience) {
  const membership = experience?.membership;
  if (!readerSession.reader) {
    return `
      <article class="reader-card membership-status-card">
        <span>Reader account required</span>
        <h2>Sign in to activate member benefits</h2>
        <p>Memberships connect to bookmarks, notifications, premium articles, mobile sync, and community history.</p>
        <a class="button secondary" href="#/account">Create or sign in</a>
      </article>
    `;
  }
  if (!membership) {
    return `
      <article class="reader-card membership-status-card">
        <span>Current access</span>
        <h2>Free reader account</h2>
        <p>You can start a manual membership now. No card is charged until a real gateway is connected.</p>
        <a class="button secondary" href="#plans">View plans</a>
      </article>
    `;
  }
  return `
    <article class="reader-card membership-status-card active">
      <span>Active membership</span>
      <h2>${escapeHtml(membership.planName)}</h2>
      <p>Renews ${escapeHtml(membership.renewsAt || "manually")} in ${escapeHtml(experience.paymentProvider || "manual")} mode. No external card charge happens while the platform is in manual mode.</p>
      <button class="button secondary" type="button" data-cancel-membership>Cancel membership</button>
    </article>
  `;
}

async function renderMembership() {
  setTitle("Membership", "Premium subscriptions for technology leaders and serious readers.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Membership</span><h1>Loading member access</h1><p>Preparing plans, benefits, and commercial integrity checks.</p></section>`;
  const experience = await loadCommercialExperience();
  const plans = experience?.plans?.length ? experience.plans : membershipPlans;
  const affiliates = experience?.affiliates?.length ? experience.affiliates : affiliateLinks;
  app.innerHTML = `
    <section class="page-hero compact-hero membership-hero-pro">
      <span>Membership and reader value</span>
      <h1>Choose your access without losing editorial trust</h1>
      <p>Start with free reader tools or upgrade to premium briefings, reports, mobile sync, member alerts, and future event access.</p>
      <div class="hero-actions">
        <a class="button primary" href="#plans">Compare plans</a>
        <a class="button secondary" href="#/advertise">Commercial partners</a>
      </div>
      <div class="commercial-signal-row">${commercialSignalCards(experience)}</div>
    </section>
    <section class="content-band membership-command-grid">
      ${membershipStatusCard(experience)}
      ${commercialReadinessPanel(experience)}
      <article class="reader-card commercial-integrity-card">
        <span>Commercial integrity</span>
        <h2>Premium access stays separate from editorial judgment</h2>
        <p>Sponsored stories, ad inventory, affiliate links, and memberships are commercial products. Editorial conclusions and review scores remain newsroom-controlled.</p>
      </article>
    </section>
    <section class="content-band plan-grid" id="plans">
      ${plans.map((plan) => `
        <article class="reader-card plan-card">
          <span>${escapeHtml(plan.billingPeriod)}</span>
          <h2>${escapeHtml(plan.name)}</h2>
          <strong>${plan.priceCents ? moneyFromCents(plan.priceCents) : "Free"}</strong>
          <p>${escapeHtml(plan.description)}</p>
          <ul>${(plan.features || []).map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
          <button class="button primary" type="button" data-subscribe-plan="${escapeHtml(plan.slug)}">${experience?.membership?.planSlug === plan.slug ? "Active" : (plan.priceCents ? "Start membership" : "Use free plan")}</button>
        </article>
      `).join("")}
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Revenue model</span><h2>How memberships connect to the whole business</h2></div>
      <div class="commercial-model-grid">${commercialModelCards(experience)}</div>
    </section>
    <section class="content-band commercial-funnel-band">
      <div class="section-heading"><span>Revenue journey</span><h2>How the reader experience becomes a business</h2></div>
      <div class="commercial-funnel-grid">
        ${(experience?.funnel || []).map((step, index) => `
          <article class="reader-card">
            <span>Step ${(index + 1).toLocaleString()}</span>
            <h2>${escapeHtml(step.stage)}</h2>
            <p>${escapeHtml(step.description)}</p>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Partner offers</span><h2>Affiliate and sponsor placements</h2></div>
      <div class="mini-grid">
        ${affiliates.map((link) => `<a class="reader-card commercial-link-card" href="/go/${link.id}"><span>${escapeHtml(link.partner)}</span><h2>${escapeHtml(link.label)}</h2><p>${escapeHtml(link.commissionNote || "Sponsored partner link.")}</p><small>Tracked affiliate redirect</small></a>`).join("") || `<div class="empty-state"><strong>No active partner offers</strong><p>Affiliate placements can be created from the admin business panel.</p></div>`}
      </div>
    </section>
  `;
}

async function renderAdvertiseExperience() {
  setTitle("Advertise", "Commercial sponsorships, media packages, and brand-safe revenue products.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Commercial</span><h1>Loading sponsorship options</h1><p>Preparing media products, integrity controls, and contact flow.</p></section>`;
  const experience = await loadCommercialExperience();
  app.innerHTML = `
    <section class="page-hero compact-hero commercial-hero-pro">
      <span>Advertise with Tech Magazine</span>
      <h1>Reach technology decision-makers with labeled, brand-safe media products</h1>
      <p>Build campaigns across sponsored stories, newsletters, display ads, video, podcasts, reports, events, reviews, and affiliate-ready buying guides.</p>
      <div class="hero-actions">
        <a class="button primary" href="#commercial-products">View products</a>
        <a class="button secondary" href="#commercial-contact">Request options</a>
      </div>
      <div class="commercial-signal-row">${commercialSignalCards(experience)}</div>
    </section>
    <section class="content-band commercial-products" id="commercial-products">
      <div class="section-heading"><span>Commercial products</span><h2>Revenue channels ready for sales</h2></div>
      <div class="media-kit-grid">
        ${(experience?.packages || []).map((item) => `
          <article>
            <span>${escapeHtml(item.label)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <small>${escapeHtml(item.status)}</small>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Business model</span><h2>What the platform can monetize</h2></div>
      <div class="commercial-model-grid">${commercialModelCards(experience)}</div>
    </section>
    <section class="content-band commercial-proof-grid">
      ${commercialReadinessPanel(experience)}
      <article class="reader-card commercial-integrity-card">
        <span>Brand safety</span>
        <h2>Clear labels, no hidden influence</h2>
        <p>Sponsored campaigns, affiliate redirects, and ad placements are visible commercial products, while editorial conclusions stay independent.</p>
      </article>
      <article class="reader-card">
        <span>Active sponsor pipeline</span>
        <h2>${Number(experience?.sponsorCampaigns?.length || 0).toLocaleString()} active campaigns</h2>
        <p>Admin can record campaign budgets, legal status, notes, and performance signals for sponsor reporting.</p>
      </article>
      <article class="reader-card">
        <span>Ad inventory</span>
        <h2>${Number(experience?.adPlacements?.length || 0).toLocaleString()} placements</h2>
        <p>Homepage, article, in-feed, sidebar, and video ad slots can be managed from the business dashboard.</p>
      </article>
    </section>
    <section class="content-band commercial-funnel-band">
      <div class="section-heading"><span>Sales journey</span><h2>From campaign brief to measurable revenue</h2></div>
      <div class="sponsor-journey-grid">${sponsorJourneyCards(experience)}</div>
    </section>
    <div id="commercial-contact">${companyContactForm("advertising", "Request advertising options", "Tell us the campaign goal, market, timing, budget range, and preferred formats.")}</div>
  `;
}

function feedCard(item) {
  return `
    <a class="reader-card feed-card" href="${escapeHtml(item.url || "#/")}">
      <span>${escapeHtml(item.label || item.type || "Feed")} / ${escapeHtml(item.category || "Technology")}</span>
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.description || "")}</p>
      <small>${escapeHtml(item.createdAt || "Updated now")}</small>
    </a>
  `;
}

async function renderFeed() {
  setTitle("Tech Feed", "Personalized and latest technology activity feed from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Feed</span><h1>Loading your technology feed</h1><p>Combining articles, IT rooms, community, videos, and live newsroom signals.</p></section>`;
  try {
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const activeType = params.get("type") || "all";
    const activeCategory = params.get("category") || "";
    const response = await fetch("/api/feed?page=1&limit=80", { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || "Feed unavailable.");
    await loadSocialEngagement();
    feedItems = (data.feed || []).filter((item) => {
      const typeMatch = activeType === "all" || item.type === activeType;
      const categoryMatch = !activeCategory || String(item.category || "").toLowerCase() === activeCategory.toLowerCase();
      return typeMatch && categoryMatch;
    });
    const feedMix = socialEngagement?.feedMix || {};
    const categories = [...new Set((data.feed || []).map((item) => item.category).filter(Boolean))].slice(0, 10);
    app.innerHTML = `
      <section class="page-hero compact-hero feed-hero-pro">
        <span>${data.personalized ? "Personalized feed" : "Live newsroom feed"}</span>
        <h1>Your technology feed</h1>
        <p>One place for latest stories, professional IT rooms, community discussions, videos, and signals worth following.</p>
        <div class="hero-actions">
          <a class="button primary" href="#/it-rooms">Browse IT Rooms</a>
          <a class="button secondary" href="#/account">${readerSession.reader ? "Tune profile" : "Sign in to personalize"}</a>
        </div>
        <div class="feed-signal-row">
          <article><strong>${Number(socialEngagement?.totals?.feedItems || data.feed?.length || 0).toLocaleString()}</strong><span>signals indexed</span></article>
          <article><strong>${Number(feedMix.article || 0).toLocaleString()}</strong><span>articles</span></article>
          <article><strong>${Number(feedMix["it-room"] || 0).toLocaleString()}</strong><span>rooms</span></article>
          <article><strong>${Number(feedMix.community || 0).toLocaleString()}</strong><span>discussions</span></article>
        </div>
      </section>
      <section class="content-band feed-filter-band">
        <div class="feed-filter-tabs">
          ${[
            ["all", "All"],
            ["article", "Articles"],
            ["it-room", "IT Rooms"],
            ["community", "Community"],
            ["video", "Video"]
          ].map(([value, label]) => `<a class="${activeType === value ? "active" : ""}" href="#/feed?type=${value}${activeCategory ? `&category=${encodeURIComponent(activeCategory)}` : ""}">${label}</a>`).join("")}
        </div>
        <div class="feed-category-strip">
          <a class="${!activeCategory ? "active" : ""}" href="#/feed?type=${encodeURIComponent(activeType)}">All categories</a>
          ${categories.map((category) => `<a class="${activeCategory === category ? "active" : ""}" href="#/feed?type=${encodeURIComponent(activeType)}&category=${encodeURIComponent(category)}">${escapeHtml(category)}</a>`).join("")}
        </div>
      </section>
      <section class="content-band feed-layout">
        <div class="feed-list">${feedItems.map(feedCard).join("") || `<div class="empty-state"><strong>No feed items yet</strong><p>Publish articles, videos, or room posts to populate the feed.</p></div>`}</div>
        <aside class="reader-card feed-side-panel">
          <span>Feed controls</span>
          <h2>Signals included</h2>
          <p>Articles, IT rooms, community topics, videos, followed authors, saved interests, and trending newsroom engagement.</p>
          <div class="feed-action-stack">
            ${(socialEngagement?.nextActions || []).map((item) => `<a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a>`).join("")}
          </div>
          <a class="button secondary" href="#/search">Search all content</a>
        </aside>
      </section>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Feed</span><h1>Feed unavailable</h1><p>${escapeHtml(error.message || "Could not load feed.")}</p><a class="button primary" href="#/">Back home</a></section>`;
  }
}

function roomCard(room) {
  return `
    <a class="reader-card room-card" href="#/it-rooms/${escapeHtml(room.slug)}">
      <span>${escapeHtml(room.topic)} / ${escapeHtml(room.accessLevel || "public")}</span>
      <h2>${escapeHtml(room.name)}</h2>
      <p>${escapeHtml(room.description)}</p>
      <div class="room-card-meta">
        <strong>${Number(room.postCount || 0).toLocaleString()}</strong>
        <small>posts / latest ${escapeHtml(room.latestPostAt || room.updatedAt || "now")}</small>
      </div>
    </a>
  `;
}

async function renderItRooms() {
  setTitle("IT Rooms", "Professional IT discussion rooms for CIOs, cloud teams, security leaders, and AI builders.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>IT Rooms</span><h1>Loading rooms</h1><p>Fetching professional technology discussion spaces.</p></section>`;
  try {
    const response = await fetch("/api/it-rooms?page=1&limit=50", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || "Rooms unavailable.");
    await loadSocialEngagement();
    itRooms = data.rooms || [];
    app.innerHTML = `
      <section class="page-hero compact-hero rooms-hero-pro">
        <span>IT Rooms</span>
        <h1>Professional rooms for technology teams</h1>
        <p>Focused spaces for CIO strategy, security operations, cloud engineering, AI builders, and practical IT leadership.</p>
        <div class="hero-actions">
          <a class="button primary" href="#/feed">Open feed</a>
          <a class="button secondary" href="#/community">Community</a>
        </div>
        <div class="community-signal-row">
          <article><strong>${Number(socialEngagement?.totals?.activeRooms || itRooms.length).toLocaleString()}</strong><span>active rooms</span></article>
          <article><strong>${Number(socialEngagement?.totals?.roomPosts || 0).toLocaleString()}</strong><span>room posts</span></article>
          <article><strong>${Number(socialEngagement?.totals?.topicCount || 0).toLocaleString()}</strong><span>community topics</span></article>
        </div>
      </section>
      <section class="content-band">
        <div class="section-heading"><span>Rooms</span><h2>Choose a focused discussion space</h2></div>
        <div class="room-topic-strip">
          ${[...new Set(itRooms.map((room) => room.topic).filter(Boolean))].map((topic) => `<a href="#/feed?type=it-room&category=${encodeURIComponent(topic)}">${escapeHtml(topic)}</a>`).join("")}
        </div>
        <div class="mini-grid room-grid">${itRooms.map(roomCard).join("") || `<div class="empty-state"><strong>No IT rooms yet</strong><p>Create rooms from the admin dashboard.</p></div>`}</div>
      </section>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>IT Rooms</span><h1>Rooms unavailable</h1><p>${escapeHtml(error.message || "Could not load rooms.")}</p><a class="button primary" href="#/">Back home</a></section>`;
  }
}

async function renderItRoom(slug) {
  setTitle("IT Room", "Professional IT room from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>IT Room</span><h1>Loading room</h1><p>Fetching room posts and controls.</p></section>`;
  try {
    const response = await fetch(`/api/it-rooms/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.room) throw new Error(data.message || "Room not found.");
    const room = data.room;
    setTitle(room.name, room.description);
    app.innerHTML = `
      <section class="page-hero compact-hero room-detail-hero">
        <span>${escapeHtml(room.topic)} / ${escapeHtml(room.accessLevel)}</span>
        <h1>${escapeHtml(room.name)}</h1>
        <p>${escapeHtml(room.description)}</p>
        <div class="hero-actions">
          <a class="button primary" href="#/feed?type=it-room&category=${encodeURIComponent(room.topic || "")}">Room feed</a>
          <a class="button secondary" href="#/it-rooms">All rooms</a>
        </div>
      </section>
      <section class="content-band room-detail-layout">
        <section class="reader-card room-discussion-card">
          <div class="card-heading-row">
            <div><span>Room posts</span><h2>Latest discussion</h2></div>
            <strong>${Number(room.postCount || 0).toLocaleString()} posts</strong>
          </div>
          ${(room.posts || []).map((post) => `<article class="topic-row room-post-row"><span>${escapeHtml(post.authorName)} / ${Number(post.authorPoints || 0).toLocaleString()} pts / ${escapeHtml(post.createdAt || "")}</span><h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.body)}</p></article>`).join("") || `<div class="empty-state"><strong>No posts yet</strong><p>Start the first useful discussion in this room.</p></div>`}
        </section>
        <form class="admin-form reader-card" data-it-room-post="${escapeHtml(room.slug)}">
          <h2>Post in this room</h2>
          <p>${readerSession.reader ? `Posting as ${escapeHtml(readerSession.reader.name)}.` : "Sign in as a reader to post."}</p>
          <label>Title<input name="title" required></label>
          <label>Body<textarea name="body" required></textarea></label>
          <button class="button primary" type="submit">${readerSession.reader ? "Publish post" : "Sign in to post"}</button>
          <p class="form-message" data-form-message></p>
        </form>
      </section>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>IT Room</span><h1>Room unavailable</h1><p>${escapeHtml(error.message || "Could not load this room.")}</p><a class="button primary" href="#/it-rooms">Back to rooms</a></section>`;
  }
}

async function renderLeaderboard() {
  setTitle("Reader Leaderboard", "Reader points, streaks, badges, and completed reads from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Leaderboard</span><h1>Loading reader rankings</h1><p>Fetching points, streaks, and badges.</p></section>`;
  try {
    const experience = await loadCommunitySocialExperience();
    const leaderboard = experience?.leaderboard || [];
    const readiness = experience?.readiness || {};
    app.innerHTML = `
      <section class="page-hero compact-hero community-hero-pro leaderboard-hero-pro">
        <span>Gamification</span>
        <h1>Reader reputation and badges</h1>
        <p>Earn points by reading, saving articles, following authors, voting in polls, and contributing to professional community discussions.</p>
        <div class="community-signal-row">
          <article><strong>${Number(leaderboard.length).toLocaleString()}</strong><span>ranked readers</span></article>
          <article><strong>${Number((experience?.social?.reputation?.points || 0)).toLocaleString()}</strong><span>your points</span></article>
          <article><strong>${readiness.reputationReady ? "Ready" : "Review"}</strong><span>badges engine</span></article>
          <article><strong>${readiness.moderationReady ? "Live" : "Review"}</strong><span>safety queues</span></article>
        </div>
      </section>
      <section class="content-band">
        <div class="leaderboard-rank-grid">
          ${leaderboard.map((reader) => `
            <article class="reader-card leaderboard-rank-card">
              <strong>#${Number(reader.rank)}</strong>
              <div>
                <span>${Number(reader.currentStreak || 0).toLocaleString()} day streak</span>
                <h2>${escapeHtml(reader.name)}</h2>
                <p>${Number(reader.points || 0).toLocaleString()} points / ${Number(reader.completedReads || 0).toLocaleString()} completed reads</p>
                <small>${(reader.badges || []).map((badge) => escapeHtml(badge)).join(", ") || "No badges yet"}</small>
              </div>
            </article>
          `).join("") || `<p class="muted">No ranked readers yet.</p>`}
        </div>
      </section>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Leaderboard</span><h1>Leaderboard unavailable</h1><p>${escapeHtml(error.message || "Reader rankings could not be loaded.")}</p></section>`;
  }
}

async function renderCommunity() {
  setTitle("Community", "Technology community discussions for readers and members.");
  try {
    const [topicsResponse, pollsResponse] = await Promise.all([
      fetch("/api/community/topics?page=1&limit=30", { cache: "no-store" }),
      fetch("/api/community/polls?page=1&limit=12", { cache: "no-store" })
    ]);
    const topicsData = await topicsResponse.json();
    const pollsData = await pollsResponse.json();
    if (topicsData.ok) communityTopics = topicsData.topics || communityTopics;
    if (pollsData.ok) communityPolls = pollsData.polls || communityPolls;
  } catch {}
  const experience = await loadCommunitySocialExperience();
  const reputation = experience?.social?.reputation || readerSession.social?.reputation || { points: 0, badges: [] };
  const totals = experience?.totals || socialEngagement?.totals || {};
  const profile = experience?.reader || null;
  const readerStats = {
    topics: profile?.activity?.topics?.length || 0,
    replies: profile?.activity?.replies?.length || 0,
    roomPosts: experience?.readerStats?.roomPosts || socialEngagement?.readerStats?.roomPosts || 0
  };
  const readiness = experience?.readiness || {};
  const forums = experience?.forums || [];
  const leaderboard = experience?.leaderboard || [];
  const recentReplies = experience?.recentReplies || [];
  const moderationSignals = experience?.moderationSignals || {};
  const readinessItems = [
    ["Profiles", readiness.readerProfilesReady],
    ["Author follows", readiness.followAuthorsReady],
    ["Forums", readiness.forumsReady],
    ["Replies", readiness.nestedRepliesReady],
    ["Polls", readiness.pollsReady],
    ["Reputation", readiness.reputationReady],
    ["Moderation", readiness.moderationReady],
    ["Feed", readiness.feedReady]
  ];
  app.innerHTML = `
    <section class="page-hero compact-hero community-hero-pro">
      <span>Community and social hub</span>
      <h1>Discuss technology with readers, authors, and IT teams</h1>
      <p>Profiles, followed authors, forums, polls, badges, IT Rooms, and a personalized community feed are connected into one reader journey.</p>
      <div class="hero-actions">
        <a class="button primary" href="#/it-rooms">Join IT Rooms</a>
        <a class="button secondary" href="#/feed?type=community">Community feed</a>
        <a class="button ghost" href="#/leaderboard">Leaderboard</a>
      </div>
      <div class="community-signal-row">
        <article><strong>${Number(totals.topicCount || communityTopics.length).toLocaleString()}</strong><span>topics</span></article>
        <article><strong>${Number(totals.replyCount || 0).toLocaleString()}</strong><span>replies</span></article>
        <article><strong>${Number(totals.pollCount || communityPolls.length).toLocaleString()}</strong><span>polls</span></article>
        <article><strong>${Number(totals.roomPosts || 0).toLocaleString()}</strong><span>room posts</span></article>
      </div>
      <div class="readiness-pills community-readiness-pills">
        ${readinessItems.map(([label, ready]) => `<span class="${ready ? "ready" : "pending"}">${escapeHtml(label)} ${ready ? "ready" : "review"}</span>`).join("")}
      </div>
    </section>
    <section class="content-band community-command-grid">
      <article class="reader-card community-profile-card">
        <span>${experience?.signedIn ? "Signed-in profile" : "Reader profile"}</span>
        <h2>${experience?.signedIn ? escapeHtml(profile?.name || readerSession.reader?.name || "Reader") : "Create your reader identity"}</h2>
        <p>${experience?.signedIn ? escapeHtml(profile?.bio || "Your profile now powers follows, saved articles, badges, and community activity.") : "Sign in to save articles, follow authors, join discussions, and sync your reputation across devices."}</p>
        <div class="community-profile-metrics">
          <article><strong>${Number(reputation.points || 0).toLocaleString()}</strong><small>points</small></article>
          <article><strong>${Number((reputation.badges || []).length).toLocaleString()}</strong><small>badges</small></article>
          <article><strong>${Number((experience?.social?.follows || readerSession.social?.follows || []).length).toLocaleString()}</strong><small>authors</small></article>
          <article><strong>${Number((readerStats.topics || 0) + (readerStats.replies || 0)).toLocaleString()}</strong><small>posts</small></article>
        </div>
        <div class="badge-row">${(reputation.badges || []).map((badge) => `<span>${escapeHtml(badge)}</span>`).join("") || `<span>Post, reply, vote, and follow authors to earn badges.</span>`}</div>
      </article>
      <article class="reader-card">
        <span>Forum categories</span>
        <h2>Structured reader spaces</h2>
        <div class="forum-category-list">
          ${forums.map((forum) => `<a href="#/community"><strong>${escapeHtml(forum.name)}</strong><small>${Number(forum.topicCount || 0).toLocaleString()} topics / ${Number(forum.pinnedCount || 0).toLocaleString()} pinned</small></a>`).join("") || `<p class="muted">Forum categories are ready for configuration.</p>`}
        </div>
      </article>
      <article class="reader-card">
        <span>Safety and moderation</span>
        <h2>Healthy discussions</h2>
        <div class="community-profile-metrics">
          <article><strong>${Number(moderationSignals.pendingComments || 0).toLocaleString()}</strong><small>pending</small></article>
          <article><strong>${Number(moderationSignals.openReports || 0).toLocaleString()}</strong><small>reports</small></article>
          <article><strong>${Number(moderationSignals.hiddenTopics || 0).toLocaleString()}</strong><small>hidden topics</small></article>
          <article><strong>${Number(moderationSignals.heldReplies || 0).toLocaleString()}</strong><small>held replies</small></article>
        </div>
        <p>Spam filtering, reports, moderator queues, and reputation signals are exposed to the newsroom team.</p>
      </article>
    </section>
    <section class="content-band community-layout-pro">
      <section class="reader-card topic-board-card">
        <div class="card-heading-row">
          <div><span>Discussion board</span><h2>Latest topics</h2></div>
          <a class="button secondary" href="#/feed?type=community">Open feed</a>
        </div>
        ${communityTopics.map((topic) => `<article class="topic-row topic-row-pro"><span>${escapeHtml(topic.forumCategory || "Community")} / ${escapeHtml(topic.authorName)} / ${Number(topic.replies || 0).toLocaleString()} replies / ${Number(topic.score || 0).toLocaleString()} score</span><h3><a href="#/community/${escapeHtml(topic.slug)}">${escapeHtml(topic.title)}</a></h3><p>${escapeHtml(topic.body)}</p><div class="topic-actions"><a href="#/community/${escapeHtml(topic.slug)}">Open discussion</a><button type="button" data-topic-vote="${escapeHtml(topic.id)}" data-vote="1">Upvote</button></div></article>`).join("") || `<div class="empty-state"><strong>No topics yet</strong><p>Start the first useful discussion.</p></div>`}
      </section>
      <aside class="community-side-stack">
        <form class="admin-form reader-card" data-community-topic>
          <span>New discussion</span>
          <h2>Start a discussion</h2>
          <p>${readerSession.reader ? `Posting as ${escapeHtml(readerSession.reader.name)}.` : "Sign in as a reader to post and earn reputation."}</p>
          <label>Title<input name="title" required></label>
          <label>Body<textarea name="body" required></textarea></label>
          <button class="button primary" type="submit">${readerSession.reader ? "Post topic" : "Sign in to post"}</button>
          <p class="form-message" data-form-message></p>
        </form>
        <section class="reader-card">
          <span>Next actions</span>
          <h2>Grow your signal</h2>
          <div class="feed-action-stack">${(experience?.nextActions || socialEngagement?.nextActions || []).map((item) => `<a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a>`).join("")}</div>
        </section>
        <section class="reader-card">
          <span>Reputation leaders</span>
          <h2>Top readers</h2>
          <div class="mini-leaderboard-list">
            ${leaderboard.slice(0, 5).map((reader) => `<a href="#/leaderboard"><strong>#${Number(reader.rank)} ${escapeHtml(reader.name)}</strong><small>${Number(reader.points || 0).toLocaleString()} points</small></a>`).join("") || `<p class="muted">No reader activity yet.</p>`}
          </div>
        </section>
        <section class="reader-card">
          <span>IT Rooms</span>
          <h2>Professional rooms</h2>
          <div class="mini-leaderboard-list">
            ${(experience?.topRooms || []).slice(0, 4).map((room) => `<a href="#/it-rooms/${escapeHtml(room.slug)}"><strong>${escapeHtml(room.name)}</strong><small>${Number(room.postCount || 0).toLocaleString()} posts / ${escapeHtml(room.topic || "Technology")}</small></a>`).join("") || `<p class="muted">No active rooms yet.</p>`}
          </div>
        </section>
      </aside>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Live participation</span><h2>Recent replies</h2></div>
      <div class="mini-grid">
        ${recentReplies.map((reply) => `
          <article class="reader-card">
            <span>${escapeHtml(reply.authorName)} / ${Number(reply.authorPoints || 0).toLocaleString()} pts</span>
            <h2><a href="#/community/${escapeHtml(reply.topicSlug)}">${escapeHtml(reply.topicTitle)}</a></h2>
            <p>${escapeHtml(reply.body)}</p>
          </article>
        `).join("") || `<p class="muted">No replies yet.</p>`}
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Polls</span><h2>Community voting</h2></div>
      <div class="mini-grid">
        ${communityPolls.map((poll) => `
          <article class="reader-card poll-card">
            <span>${escapeHtml(poll.createdBy || "Editorial team")}</span>
            <h2>${escapeHtml(poll.title)}</h2>
            <p>${escapeHtml(poll.body || "")}</p>
            <div class="poll-options">
              ${(poll.options || []).map((option) => `<button type="button" data-poll-vote="${escapeHtml(poll.id)}" data-option-id="${escapeHtml(option.id)}">${escapeHtml(option.label)} <small>${Number(option.votes || 0).toLocaleString()}</small></button>`).join("")}
            </div>
          </article>
        `).join("") || `<p class="muted">No polls are published yet.</p>`}
      </div>
    </section>
  `;
}

async function renderCommunityTopic(slug) {
  setTitle("Community Topic", "Reader discussion from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Community</span><h1>Loading topic</h1><p>Fetching reader discussion.</p></section>`;
  try {
    const response = await fetch(`/api/community/topics/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.topic) throw new Error(data.message || "Topic not found.");
    const topic = data.topic;
    setTitle(topic.title, topic.body);
    app.innerHTML = `
      <section class="page-hero compact-hero community-topic-hero">
        <span>${escapeHtml(topic.authorName)} / ${Number(topic.authorPoints || 0).toLocaleString()} pts</span>
        <h1>${escapeHtml(topic.title)}</h1>
        <p>${escapeHtml(topic.body)}</p>
        <div class="hero-actions">
          <button class="button primary" type="button" data-topic-vote="${escapeHtml(topic.id)}" data-vote="1">Upvote discussion</button>
          <a class="button secondary" href="#/community">Back to community</a>
        </div>
      </section>
      <section class="content-band community-topic-layout">
        <section class="reader-card">
          <div class="card-heading-row">
            <div><span>Replies</span><h2>Discussion thread</h2></div>
            <strong>${Number((topic.replies || []).length).toLocaleString()} replies</strong>
          </div>
          ${(topic.replies || []).map((reply) => `<article class="topic-row"><span>${escapeHtml(reply.authorName)} / ${Number(reply.authorPoints || 0).toLocaleString()} pts / ${escapeHtml(reply.createdAt || "")}</span><p>${escapeHtml(reply.body)}</p></article>`).join("") || `<div class="empty-state"><strong>No replies yet</strong><p>Be the first to add a helpful answer.</p></div>`}
        </section>
        <form class="admin-form reader-card" data-community-reply="${escapeHtml(topic.id)}">
          <h2>Reply</h2>
          <p>${readerSession.reader ? `Replying as ${escapeHtml(readerSession.reader.name)}.` : "Sign in as a reader to reply."}</p>
          <label>Message<textarea name="body" required></textarea></label>
          <button class="button primary" type="submit">${readerSession.reader ? "Post reply" : "Sign in to reply"}</button>
          <p class="form-message" data-form-message></p>
        </form>
      </section>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Community</span><h1>Topic unavailable</h1><p>${escapeHtml(error.message || "This discussion could not be loaded.")}</p><a class="button primary" href="#/community">Back to community</a></section>`;
  }
}

async function renderNotifications() {
  const mobile = await loadMobileExperience();
  const prefs = notificationPreferences || {};
  const favoriteCategoryValue = (prefs.favoriteCategories || []).join(", ");
  const followedAuthorValue = (prefs.followedAuthors || []).join(", ");
  setTitle("Notifications", "Manage breaking news, live event, and personalized technology alerts.");
  app.innerHTML = `
    <section class="page-hero compact-hero alert-hero">
      <span>Alerts and subscriptions</span>
      <h1>Control exactly how Tech Magazine reaches you</h1>
      <p>Follow breaking news, live events, favorite categories, authors, newsletters, and future mobile push notifications from one reader preference center.</p>
      <div class="alert-hero-metrics">
        <article><strong>${Number(audienceConversion.sentAlerts || notifications.length || 0).toLocaleString()}</strong><span>alerts sent</span></article>
        <article><strong>${Number(audienceConversion.notificationPreferences || 0).toLocaleString()}</strong><span>reader preferences</span></article>
        <article><strong>${Number(audienceConversion.pushEnabledReaders || 0).toLocaleString()}</strong><span>push-enabled readers</span></article>
      </div>
    </section>
    <section class="content-band account-grid">
      <section class="reader-card alert-feed-card">
        <div class="card-heading-row">
          <div>
            <span>Inbox</span>
            <h2>Latest alerts</h2>
          </div>
          <a class="button secondary" href="#/breaking">Breaking desk</a>
        </div>
        ${notifications.map((item) => `
          <article class="topic-row notification-row ${item.readAt ? "is-read" : ""}">
            <span>${escapeHtml(item.type)} / ${escapeHtml(item.sentAt || item.createdAt || "")}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p>
            <div class="inline-actions">
              ${item.linkUrl ? `<a class="button ghost" href="${escapeHtml(item.linkUrl)}">Open</a>` : ""}
              ${readerSession.token ? `<button class="button ghost" type="button" data-notification-read="${escapeHtml(item.id)}">${item.readAt ? "Read" : "Mark read"}</button>` : ""}
            </div>
          </article>
        `).join("") || `<p class="muted">No notifications sent yet.</p>`}
      </section>
      <form class="admin-form reader-card alert-preferences-card" data-notification-preferences>
        <div class="card-heading-row">
          <div>
            <span>Preference center</span>
            <h2>What should trigger alerts?</h2>
          </div>
          ${readerSession.token ? `<span class="status-pill">${prefs.pushEnabled ? "Push connected" : "Signed in"}</span>` : `<span class="status-pill">Sign in required</span>`}
        </div>
        ${readerSession.token ? `
          <div class="alert-toggle-grid">
            <label class="alert-toggle"><input type="checkbox" name="breaking" ${prefs.breaking !== false ? "checked" : ""}><span><strong>Breaking news</strong><small>Emergency banners and priority updates.</small></span></label>
            <label class="alert-toggle"><input type="checkbox" name="newsletters" ${prefs.newsletters !== false ? "checked" : ""}><span><strong>Newsletter alerts</strong><small>Briefings, campaigns, and digests.</small></span></label>
            <label class="alert-toggle"><input type="checkbox" name="liveEvents" ${prefs.liveEvents !== false ? "checked" : ""}><span><strong>Live events</strong><small>Conference and live blog updates.</small></span></label>
          </div>
          <label>Favorite categories<input name="favoriteCategories" value="${escapeHtml(favoriteCategoryValue)}" placeholder="ai, cybersecurity, cloud"></label>
          <div class="quick-category-row">
            ${publicCategories().slice(0, 8).map((category) => `<button class="chip-button" type="button" data-fill-category="${escapeHtml(category.slug)}">${escapeHtml(category.name)}</button>`).join("")}
          </div>
          <label>Followed authors<input name="followedAuthors" value="${escapeHtml(followedAuthorValue)}" placeholder="maya-chen, omar-haddad"></label>
          <div class="quick-category-row">
            ${authors.slice(0, 5).map((author) => `<button class="chip-button" type="button" data-fill-author="${escapeHtml(author.id)}">${escapeHtml(author.name)}</button>`).join("")}
          </div>
          <button class="button primary" type="submit">Save preferences</button>
          <button class="button ghost" type="button" data-enable-push>Enable Firebase push</button>
          <p class="form-message" data-form-message>${prefs.pushEnabled ? "Firebase push is connected for this reader." : ""}</p>
        ` : `
          <div class="alert-locked-state">
            <strong>Create a reader account to save preferences.</strong>
            <p class="muted">You can still read public alerts, but saved categories, followed authors, push registration, and cross-device preferences require a reader profile.</p>
          </div>
          <a class="button primary" href="#/account">Sign in</a>
        `}
      </form>
    </section>
    <section class="content-band notification-mobile-panel">
      <section class="reader-card">
        <div class="card-heading-row">
          <div><span>Mobile delivery</span><h2>Cross-device status</h2></div>
          <a class="button secondary" href="#/mobile">Open mobile center</a>
        </div>
        <div class="mobile-pref-grid">
          <article><span>Devices</span><strong>${Number(mobile?.analytics?.devices || 0).toLocaleString()}</strong></article>
          <article><span>Push enabled</span><strong>${Number(mobile?.analytics?.pushEnabled || 0).toLocaleString()}</strong></article>
          <article><span>Offline saves</span><strong>${Number(mobile?.analytics?.offlineItems || 0).toLocaleString()}</strong></article>
          <article><span>Sync</span><strong>${mobile?.sync?.readyForNativeApps ? "Ready" : "Review"}</strong></article>
        </div>
      </section>
      <section class="reader-card">
        <div class="card-heading-row">
          <div><span>App routes</span><h2>Deep-link coverage</h2></div>
          <a class="button secondary" href="/api/mobile/widgets">Widget API</a>
        </div>
        <div class="mobile-deep-link-grid">${mobileDeepLinkCards()}</div>
      </section>
    </section>
    ${newsletterBlock()}
  `;
}

function renderBreakingNews() {
  setTitle("Breaking News", "Live priority technology alerts and emergency newsroom updates.");
  app.innerHTML = `
    ${siteBreakingBanner()}
    <section class="page-hero compact-hero">
      <span>Breaking news</span>
      <h1>Live priority updates</h1>
      <p>Urgent technology stories, live newsroom alerts, and high-priority editorial updates.</p>
    </section>
    <section class="content-band">
      <div class="mini-grid">
        ${breakingNews.map((alert) => `
          <article class="reader-card">
            <span>${escapeHtml(alert.severity)} / priority ${Number(alert.priorityScore || 0).toLocaleString()}</span>
            <h2>${escapeHtml(alert.title)}</h2>
            <p>${escapeHtml(alert.summary)}</p>
            <a class="button primary" href="${escapeHtml(alert.linkUrl || "#/")}">Open update</a>
          </article>
        `).join("") || `<p class="muted">No active breaking alerts right now.</p>`}
      </div>
    </section>
  `;
}

function formatLiveTime(value) {
  if (!value) return "Now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function renderLiveEvents() {
  setTitle("Live Events", "Real-time event coverage, keynotes, product launches, and conference live blogs.");
  app.innerHTML = `
    <section class="page-hero compact-hero">
      <span>Live desk</span>
      <h1>Live events</h1>
      <p>Real-time technology coverage for keynotes, launches, conferences, and breaking newsroom updates.</p>
    </section>
    <section class="content-band">
      <div class="mini-grid">
        ${liveEvents.map((event) => `
          <a class="reader-card live-event-card" href="#/live/${event.slug}">
            <span>${escapeHtml(event.status)}${event.updateCount ? ` / ${Number(event.updateCount).toLocaleString()} updates` : ""}</span>
            <h2>${escapeHtml(event.title)}</h2>
            <p>${escapeHtml(event.description)}</p>
            <small>${escapeHtml(event.host || "Tech Magazine newsroom")} / ${escapeHtml(formatLiveTime(event.latestUpdateAt || event.eventDate || event.startedAt))}</small>
          </a>
        `).join("") || `<p class="muted">No live events are public yet. When the newsroom starts one, it will appear here automatically.</p>`}
      </div>
    </section>
  `;
}

function liveUpdateMarkup(update) {
  return `
    <article class="live-update ${update.pinned ? "is-pinned" : ""}">
      <div class="live-update-meta">
        <span>${escapeHtml(update.updateType?.replace("_", " ") || "update")}</span>
        <time>${escapeHtml(formatLiveTime(update.createdAt))}</time>
      </div>
      <h3>${escapeHtml(update.title)}</h3>
      <p>${escapeHtml(update.body)}</p>
      ${update.sourceUrl ? `<a href="${escapeHtml(update.sourceUrl)}" target="_blank" rel="noreferrer">Open source</a>` : ""}
    </article>
  `;
}

async function renderLiveEvent(slug) {
  setTitle("Live Event", "Real-time live coverage from Tech Magazine.");
  app.innerHTML = `
    <section class="page-hero compact-hero">
      <span>Live desk</span>
      <h1>Loading live event</h1>
      <p>Fetching the newest event updates.</p>
    </section>
  `;

  async function refresh() {
    try {
      const response = await fetch(`/api/live-events/${encodeURIComponent(slug)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.event) throw new Error(data.message || "Live event not found.");
      const event = data.event;
      setTitle(event.title, event.description);
      app.innerHTML = `
        <section class="page-hero compact-hero live-hero">
          <span>${escapeHtml(event.status)} coverage</span>
          <h1>${escapeHtml(event.title)}</h1>
          <p>${escapeHtml(event.description)}</p>
          <div class="live-meta">
            <strong>${escapeHtml(event.host || "Tech Magazine newsroom")}</strong>
            <span>${escapeHtml(formatLiveTime(event.startedAt || event.eventDate || event.createdAt))}</span>
          </div>
        </section>
        <section class="content-band live-layout">
          <aside class="reader-card live-summary">
            <span>${escapeHtml(event.status)}</span>
            <h2>${Number(event.updates?.length || 0).toLocaleString()} updates</h2>
            <p>${event.status === "live" ? "This page refreshes automatically while coverage is live." : "Coverage has ended. The full timeline remains available."}</p>
            <a class="button secondary" href="#/live">All live events</a>
          </aside>
          <div class="live-feed">
            ${(event.updates || []).map(liveUpdateMarkup).join("") || `<p class="muted">No live updates have been posted yet.</p>`}
          </div>
        </section>
        <section class="content-band live-comments">
          <div class="section-heading">
            <span>Live comments</span>
            <h2>Audience reaction</h2>
          </div>
          <div class="account-grid">
            <section class="reader-card">
              <h2>${Number(event.comments?.length || 0).toLocaleString()} comments</h2>
              ${(event.comments || []).map((comment) => `
                <article class="topic-row">
                  <span>${escapeHtml(formatLiveTime(comment.createdAt))}</span>
                  <h3>${escapeHtml(comment.name || "Live reader")}</h3>
                  <p>${escapeHtml(comment.body)}</p>
                </article>
              `).join("") || `<p class="muted">No live comments yet.</p>`}
            </section>
            ${event.allowComments ? `
              <form class="admin-form reader-card" data-live-comment data-live-slug="${escapeHtml(event.slug)}">
                <h2>Join the live discussion</h2>
                ${readerSession.reader ? `<p class="muted">Posting as ${escapeHtml(readerSession.reader.name)}.</p>` : `
                  <label>Name<input name="name" required></label>
                  <label>Email<input type="email" name="email"></label>
                `}
                <label>Comment<textarea name="body" required></textarea></label>
                <button class="button primary" type="submit">Post live comment</button>
                <p class="form-message" data-form-message></p>
              </form>
            ` : `<section class="reader-card"><p class="muted">Live comments are closed for this event.</p></section>`}
          </div>
        </section>
      `;
      return Number(event.sync?.autoRefreshSeconds || event.autoRefreshSeconds || 20);
    } catch (error) {
      app.innerHTML = `
        <section class="page-hero compact-hero">
          <span>Live desk</span>
          <h1>Live event unavailable</h1>
          <p>${escapeHtml(error.message || "This live event could not be loaded.")}</p>
          <a class="button primary" href="#/live">Back to live events</a>
        </section>
      `;
      window.clearInterval(liveTimer);
      return 20;
    }
  }

  const refreshSeconds = await refresh();
  window.clearInterval(liveTimer);
  liveTimer = window.setInterval(refresh, Math.max(5, refreshSeconds) * 1000);
}

function youtubeEmbedUrl(url) {
  const value = String(url || "");
  const watch = value.match(/[?&]v=([^&]+)/);
  const short = value.match(/youtu\.be\/([^?]+)/);
  const embed = value.match(/youtube\.com\/embed\/([^?]+)/);
  const id = watch?.[1] || short?.[1] || embed?.[1];
  return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : "";
}

function videoPlayerMarkup(video) {
  if (video.sourceType === "youtube") {
    const embed = youtubeEmbedUrl(video.videoUrl);
    return embed ? `<iframe src="${escapeHtml(embed)}" title="${escapeHtml(video.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` : `<a class="button primary" href="${escapeHtml(video.videoUrl)}" target="_blank" rel="noreferrer">Open video</a>`;
  }
  const tracks = (video.subtitles || []).map((subtitle) => `<track kind="subtitles" src="${escapeHtml(subtitle.src)}" srclang="${escapeHtml(subtitle.srclang || "en")}" label="${escapeHtml(subtitle.label || subtitle.srclang || "Subtitles")}">`).join("");
  if (video.hlsUrl || video.sourceType === "hls") {
    return `<video data-video-id="${escapeHtml(video.id || "")}" src="${escapeHtml(video.hlsUrl || video.videoUrl)}" poster="${escapeHtml(video.thumbnailUrl || "")}" controls playsinline preload="metadata">${tracks}</video>`;
  }
  if (video.sourceType === "upload" || String(video.videoUrl || "").endsWith(".mp4")) {
    return `<video data-video-id="${escapeHtml(video.id || "")}" src="${escapeHtml(video.videoUrl)}" poster="${escapeHtml(video.thumbnailUrl || "")}" controls playsinline preload="metadata">${tracks}</video>`;
  }
  return `<a class="button primary" href="${escapeHtml(video.videoUrl)}" target="_blank" rel="noreferrer">Open video</a>`;
}

function bindVideoTelemetry(video) {
  const player = document.querySelector(`[data-video-id="${CSS.escape(video.id || "")}"]`);
  if (!player) return;
  let started = false;
  const send = (eventType) => {
    fetch("/api/videos/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId: video.id,
        eventType,
        progressSeconds: Math.round(player.currentTime || 0),
        durationSeconds: Math.round(player.duration || video.durationSeconds || 0),
        source: location.hash
      })
    }).catch(() => {});
  };
  send("view");
  player.addEventListener("play", () => {
    if (started) return;
    started = true;
    send("start");
  });
  player.addEventListener("timeupdate", () => {
    if (Math.round(player.currentTime || 0) % 30 === 0) send("progress");
  });
  player.addEventListener("ended", () => send("complete"));
}

function videoCard(video) {
  return `
    <a class="video-card" href="#/video/${video.slug}">
      <div class="video-thumb">
        ${video.thumbnailUrl ? `<img ${responsiveImageAttrs(video.thumbnailUrl, video.title)} loading="lazy">` : `<span>Video</span>`}
      </div>
      <div>
        <span>${escapeHtml(video.playlistTitle || video.sourceType || "Video")}</span>
        <h2>${escapeHtml(video.title)}</h2>
        <p>${escapeHtml(video.description)}</p>
      </div>
    </a>
  `;
}

function renderVideos() {
  setTitle("Video Center", "Technology videos, interviews, product reviews, briefings, and live stream archives.");
  const featured = videos.find((video) => video.featured) || videos[0];
  app.innerHTML = `
    <section class="page-hero compact-hero">
      <span>Video media center</span>
      <h1>Technology videos and briefings</h1>
      <p>Video news, interviews, product reviews, executive briefings, playlists, and stream-ready media coverage.</p>
    </section>
    ${featured ? `<section class="content-band video-feature">
      <div class="video-player">${videoPlayerMarkup(featured)}</div>
      <article>
        <span>${escapeHtml(featured.playlistTitle || "Featured video")}</span>
        <h2>${escapeHtml(featured.title)}</h2>
        <p>${escapeHtml(featured.description)}</p>
        <a class="button primary" href="#/video/${featured.slug}">Open video page</a>
      </article>
    </section>` : ""}
    <section class="content-band">
      <div class="section-heading">
        <span>Video categories</span>
        <h2>Browse by technology sector</h2>
      </div>
      <div class="mini-grid">
        ${videoCategories.map((category) => `
          <article class="reader-card">
            <span>${Number(category.videoCount || 0).toLocaleString()} videos</span>
            <h2>${escapeHtml(category.name)}</h2>
            <p>${escapeHtml(category.description)}</p>
          </article>
        `).join("") || `<p class="muted">No video categories are published yet.</p>`}
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading">
        <span>Playlists</span>
        <h2>Video series</h2>
      </div>
      <div class="mini-grid">
        ${videoPlaylists.map((playlist) => `
          <article class="reader-card">
            <span>${Number(playlist.videoCount || 0).toLocaleString()} videos</span>
            <h2>${escapeHtml(playlist.title)}</h2>
            <p>${escapeHtml(playlist.description)}</p>
          </article>
        `).join("") || `<p class="muted">No video playlists are published yet.</p>`}
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading">
        <span>Latest video</span>
        <h2>Watch now</h2>
      </div>
      <div class="video-grid">
        ${videos.map(videoCard).join("") || `<p class="muted">No videos are published yet. The newsroom can publish uploaded MP4s, YouTube links, and stream URLs from the admin Video Center.</p>`}
      </div>
    </section>
  `;
}

async function renderVideo(slug) {
  setTitle("Video", "Technology video from Tech Magazine.");
  app.innerHTML = `
    <section class="page-hero compact-hero">
      <span>Video media center</span>
      <h1>Loading video</h1>
      <p>Fetching the video page.</p>
    </section>
  `;
  try {
    const response = await fetch(`/api/videos/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.video) throw new Error(data.message || "Video not found.");
    const video = data.video;
    setTitle(video.seoTitle || video.title, video.seoDescription || video.description, {
      canonicalUrl: `${location.origin}/#/video/${video.slug}`,
      ogImage: video.thumbnailUrl || "",
      schema: {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: video.title,
        description: video.seoDescription || video.description,
        thumbnailUrl: video.thumbnailUrl || "",
        uploadDate: video.publishedAt || video.createdAt,
        contentUrl: video.videoUrl
      }
    });
    app.innerHTML = `
      <article class="video-page">
        <header class="page-hero compact-hero">
          <span>${escapeHtml(video.playlistTitle || video.sourceType || "Video")}</span>
          <h1>${escapeHtml(video.title)}</h1>
          <p>${escapeHtml(video.description)}</p>
        </header>
        <section class="content-band video-detail">
          <div class="video-player">${videoPlayerMarkup(video)}</div>
          <aside class="reader-card">
            <span>${escapeHtml(video.status || "published")}</span>
            <h2>Video details</h2>
            <p>${video.durationSeconds ? `${Math.round(video.durationSeconds / 60)} min` : "Duration not set yet"}</p>
            <p>${escapeHtml(video.streamingProvider || "local")} / ${escapeHtml(video.processingStatus || "ready")}</p>
            <button class="button secondary" data-video-pip>PiP</button>
            <button class="button secondary" data-video-bookmark>Save video</button>
            <a class="button secondary" href="#/videos">All videos</a>
          </aside>
        </section>
        ${(video.subtitles || []).length ? `<section class="content-band"><article class="reader-card"><span>Subtitles</span><p>${video.subtitles.map((subtitle) => escapeHtml(`${subtitle.label} (${subtitle.srclang})`)).join(", ")}</p></article></section>` : ""}
        ${video.transcript ? `<section class="content-band"><article class="reader-card"><span>Transcript</span><p>${escapeHtml(video.transcript)}</p></article></section>` : ""}
        <section class="content-band">
          <div class="section-heading"><span>Related</span><h2>More videos</h2></div>
          <div class="video-grid">${(video.related || []).map(videoCard).join("") || `<p class="muted">No related videos yet.</p>`}</div>
        </section>
      </article>
    `;
    bindVideoTelemetry(video);
    const player = document.querySelector(`[data-video-id="${CSS.escape(video.id || "")}"]`);
    document.querySelector("[data-video-pip]")?.addEventListener("click", () => {
      if (player?.requestPictureInPicture) player.requestPictureInPicture().catch(() => {});
    });
    document.querySelector("[data-video-bookmark]")?.addEventListener("click", () => {
      fetch(`/api/videos/bookmark/${encodeURIComponent(video.slug)}`, { method: "POST" }).catch(() => {});
    });
  } catch (error) {
    app.innerHTML = `
      <section class="page-hero compact-hero">
        <span>Video media center</span>
        <h1>Video unavailable</h1>
        <p>${escapeHtml(error.message || "This video could not be loaded.")}</p>
        <a class="button primary" href="#/videos">Back to videos</a>
      </section>
    `;
  }
}

function formatDuration(seconds) {
  const value = Number(seconds || 0);
  if (!value) return "Duration not set";
  const mins = Math.floor(value / 60);
  const secs = value % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function podcastAudioPlayerMarkup(episode, { compact = false } = {}) {
  return `
    <div class="audio-console ${compact ? "compact" : ""}" data-podcast-player data-episode-id="${escapeHtml(episode.id || "")}" data-episode-slug="${escapeHtml(episode.slug || "")}">
      <audio src="${escapeHtml(episode.audioUrl)}" preload="metadata"></audio>
      <div>
        <span>${escapeHtml(episode.showTitle || "Podcast")}</span>
        <strong>${escapeHtml(episode.title)}</strong>
      </div>
      <div class="audio-controls">
        <button class="icon-button" type="button" data-audio-skip="-15" aria-label="Skip back 15 seconds">-15</button>
        <button class="button primary" type="button" data-audio-play>Play</button>
        <button class="icon-button" type="button" data-audio-skip="30" aria-label="Skip forward 30 seconds">+30</button>
        <select data-audio-speed aria-label="Playback speed">
          <option value="0.75">0.75x</option>
          <option value="1" selected>1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </div>
      <label class="audio-progress">
        <span data-audio-time>0:00 / ${escapeHtml(formatDuration(episode.durationSeconds))}</span>
        <input type="range" min="0" max="${Number(episode.durationSeconds || 0) || 100}" value="0" step="1" data-audio-progress>
      </label>
      <div class="audio-actions">
        <button class="button secondary" type="button" data-audio-bookmark>Save</button>
        <a class="button secondary" href="${escapeHtml(episode.audioUrl)}" download>Download</a>
      </div>
    </div>
  `;
}

function recordPodcastPlayback(episode, eventType, audio = null) {
  if (!episode?.slug && !episode?.id) return;
  fetch("/api/podcasts/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug: episode.slug,
      episodeId: episode.id,
      eventType,
      listenerKey: listenerKey(),
      progressSeconds: Math.round(audio?.currentTime || 0),
      durationSeconds: Math.round(audio?.duration || episode.durationSeconds || 0),
      source: location.hash || "web-player"
    })
  }).catch(() => {});
}

function ensurePodcastMiniPlayer() {
  let mini = document.querySelector("[data-podcast-mini]");
  if (!mini) {
    mini = document.createElement("aside");
    mini.className = "audio-mini-player";
    mini.dataset.podcastMini = "true";
    mini.innerHTML = `
      <div><span data-mini-show>Podcast</span><strong data-mini-title>Episode</strong></div>
      <button class="button primary" type="button" data-mini-play>Pause</button>
      <input type="range" min="0" max="100" value="0" step="1" data-mini-progress aria-label="Podcast progress">
      <button class="icon-button" type="button" data-mini-close aria-label="Close audio player">x</button>
    `;
    document.body.appendChild(mini);
    mini.querySelector("[data-mini-play]")?.addEventListener("click", () => {
      if (!activePodcastAudio) return;
      if (activePodcastAudio.paused) activePodcastAudio.play().catch(() => {});
      else activePodcastAudio.pause();
    });
    mini.querySelector("[data-mini-progress]")?.addEventListener("input", (event) => {
      if (activePodcastAudio) activePodcastAudio.currentTime = Number(event.target.value || 0);
    });
    mini.querySelector("[data-mini-close]")?.addEventListener("click", () => {
      activePodcastAudio?.pause();
      activePodcastAudio = null;
      activePodcastEpisode = null;
      mini.classList.remove("active");
      document.body.classList.remove("audio-mini-active");
    });
  }
  return mini;
}

function syncPodcastMiniPlayer() {
  if (!activePodcastAudio || !activePodcastEpisode) return;
  const mini = ensurePodcastMiniPlayer();
  mini.classList.add("active");
  document.body.classList.add("audio-mini-active");
  mini.querySelector("[data-mini-show]").textContent = activePodcastEpisode.showTitle || "Podcast";
  mini.querySelector("[data-mini-title]").textContent = activePodcastEpisode.title || "Episode";
  mini.querySelector("[data-mini-play]").textContent = activePodcastAudio.paused ? "Play" : "Pause";
  const progress = mini.querySelector("[data-mini-progress]");
  progress.max = String(Math.round(activePodcastAudio.duration || activePodcastEpisode.durationSeconds || 100));
  progress.value = String(Math.round(activePodcastAudio.currentTime || 0));
}

function bindPodcastPlayers(episodes = []) {
  document.querySelectorAll("[data-podcast-player]").forEach((node) => {
    const slug = node.dataset.episodeSlug || "";
    const episode = episodes.find((item) => item.slug === slug || item.id === node.dataset.episodeId) || podcastEpisodes.find((item) => item.slug === slug);
    const audio = node.querySelector("audio");
    const playButton = node.querySelector("[data-audio-play]");
    const progress = node.querySelector("[data-audio-progress]");
    const time = node.querySelector("[data-audio-time]");
    let progressSent = false;
    if (!audio || !episode || node.dataset.bound === "true") return;
    node.dataset.bound = "true";
    audio.addEventListener("loadedmetadata", () => {
      if (progress && Number.isFinite(audio.duration)) progress.max = String(Math.round(audio.duration));
    });
    audio.addEventListener("play", () => {
      if (activePodcastAudio && activePodcastAudio !== audio) activePodcastAudio.pause();
      activePodcastAudio = audio;
      activePodcastEpisode = episode;
      playButton.textContent = "Pause";
      recordPodcastPlayback(episode, "play", audio);
      syncPodcastMiniPlayer();
    });
    audio.addEventListener("pause", () => {
      playButton.textContent = "Play";
      syncPodcastMiniPlayer();
    });
    audio.addEventListener("ended", () => {
      playButton.textContent = "Play";
      recordPodcastPlayback(episode, "complete", audio);
    });
    audio.addEventListener("timeupdate", () => {
      if (progress) progress.value = String(Math.round(audio.currentTime || 0));
      if (time) time.textContent = `${formatDuration(Math.round(audio.currentTime || 0))} / ${formatDuration(Math.round(audio.duration || episode.durationSeconds || 0))}`;
      if (audio === activePodcastAudio) syncPodcastMiniPlayer();
      if (!progressSent && audio.duration && audio.currentTime / audio.duration > 0.5) {
        progressSent = true;
        recordPodcastPlayback(episode, "progress", audio);
      }
    });
    playButton?.addEventListener("click", () => {
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    });
    node.querySelectorAll("[data-audio-skip]").forEach((button) => {
      button.addEventListener("click", () => {
        audio.currentTime = Math.max(0, Math.min(audio.duration || Number.MAX_SAFE_INTEGER, audio.currentTime + Number(button.dataset.audioSkip || 0)));
      });
    });
    node.querySelector("[data-audio-speed]")?.addEventListener("change", (event) => {
      audio.playbackRate = Number(event.target.value || 1);
    });
    progress?.addEventListener("input", () => {
      audio.currentTime = Number(progress.value || 0);
    });
    node.querySelector("[data-audio-bookmark]")?.addEventListener("click", () => {
      fetch(`/api/podcasts/bookmark/${encodeURIComponent(episode.slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listenerKey: listenerKey(), progressSeconds: Math.round(audio.currentTime || 0) })
      }).catch(() => {});
    });
  });
}

function podcastEpisodeCard(episode) {
  return `
    <a class="podcast-card" href="#/podcast-episode/${episode.slug}">
      <div class="podcast-cover">
        ${(episode.thumbnailUrl || episode.coverImage) ? `<img src="${escapeHtml(episode.thumbnailUrl || episode.coverImage)}" alt="${escapeHtml(episode.showTitle || episode.title)}" loading="lazy">` : `<span>Audio</span>`}
      </div>
      <div>
        <span>${escapeHtml(episode.showTitle || "Podcast")}</span>
        <h2>${escapeHtml(episode.title)}</h2>
        <p>${escapeHtml(episode.summary || episode.description)}</p>
        <small>Episode ${Number(episode.episodeNumber || 0).toLocaleString()} / ${escapeHtml(formatDuration(episode.durationSeconds))}${episode.premium ? " / Premium" : ""}</small>
      </div>
    </a>
  `;
}

function renderPodcasts() {
  setTitle("Podcasts", "Technology podcasts, interviews, briefings, and narrated analysis from Tech Magazine.");
  const featured = podcastEpisodes.find((episode) => episode.featured) || podcastEpisodes[0];
  app.innerHTML = `
    <section class="page-hero compact-hero">
      <span>Podcast network</span>
      <h1>Technology podcasts</h1>
      <p>Audio interviews, executive briefings, product discussions, event previews, and narrated technology analysis.</p>
      <div class="hero-actions">
        <a class="button primary" href="/podcasts/rss.xml">RSS feed</a>
      </div>
    </section>
    ${featured ? `<section class="content-band podcast-feature">
      <div class="podcast-cover large">${(featured.thumbnailUrl || featured.coverImage) ? `<img src="${escapeHtml(featured.thumbnailUrl || featured.coverImage)}" alt="${escapeHtml(featured.showTitle)}">` : `<span>Featured</span>`}</div>
      <article>
        <span>${escapeHtml(featured.showTitle || "Featured episode")}</span>
        <h2>${escapeHtml(featured.title)}</h2>
        <p>${escapeHtml(featured.summary || featured.description)}</p>
        ${podcastAudioPlayerMarkup(featured, { compact: true })}
        <a class="button secondary" href="#/podcast-episode/${featured.slug}">Open episode</a>
      </article>
    </section>` : ""}
    <section class="content-band">
      <div class="section-heading">
        <span>Categories</span>
        <h2>Browse audio by topic</h2>
      </div>
      <div class="mini-grid">
        ${podcastCategories.map((category) => `
          <article class="reader-card">
            <span>${Number(category.showCount || 0).toLocaleString()} shows</span>
            <h2>${escapeHtml(category.name)}</h2>
            <p>${escapeHtml(category.description)}</p>
          </article>
        `).join("") || `<p class="muted">No podcast categories are published yet.</p>`}
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading">
        <span>Shows</span>
        <h2>Podcast shows</h2>
      </div>
      <div class="mini-grid">
        ${podcastShows.map((show) => `
          <a class="reader-card" href="#/podcast/${show.slug}">
            <span>${Number(show.episodeCount || 0).toLocaleString()} episodes</span>
            <h2>${escapeHtml(show.title)}</h2>
            <p>${escapeHtml(show.description)}</p>
            <small>${escapeHtml((show.hosts || []).join(", ") || show.host || show.categoryName || "Tech Magazine")}</small>
          </a>
        `).join("") || `<p class="muted">No podcast shows are published yet.</p>`}
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading">
        <span>Latest audio</span>
        <h2>Episodes</h2>
      </div>
      <div class="podcast-grid">
        ${podcastEpisodes.map(podcastEpisodeCard).join("") || `<p class="muted">No podcast episodes are published yet. The newsroom can add audio from the admin Podcast Center.</p>`}
      </div>
    </section>
  `;
  bindPodcastPlayers([featured].filter(Boolean));
}

async function renderPodcastShow(slug) {
  setTitle("Podcast Show", "Podcast show from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Podcast network</span><h1>Loading show</h1><p>Fetching episodes.</p></section>`;
  try {
    const response = await fetch(`/api/podcasts/shows/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.show) throw new Error(data.message || "Podcast show not found.");
    const show = data.show;
    setTitle(show.title, show.description, { canonicalUrl: `${location.origin}/#/podcast/${show.slug}`, ogImage: show.coverImage || "" });
    app.innerHTML = `
      <section class="page-hero compact-hero">
        <span>${escapeHtml(show.categoryName || show.host || "Tech Magazine")}</span>
        <h1>${escapeHtml(show.title)}</h1>
        <p>${escapeHtml(show.description)}</p>
        ${(show.hosts || []).length ? `<p>${escapeHtml(show.hosts.join(", "))}</p>` : ""}
        <div class="hero-actions">
          ${show.spotifyUrl ? `<a class="button secondary" href="${escapeHtml(show.spotifyUrl)}" target="_blank" rel="noreferrer">Spotify</a>` : ""}
          ${show.appleUrl ? `<a class="button secondary" href="${escapeHtml(show.appleUrl)}" target="_blank" rel="noreferrer">Apple Podcasts</a>` : ""}
          ${show.externalUrl ? `<a class="button secondary" href="${escapeHtml(show.externalUrl)}" target="_blank" rel="noreferrer">Website</a>` : ""}
          <a class="button primary" href="/podcasts/rss.xml">RSS feed</a>
        </div>
      </section>
      <section class="content-band">
        <div class="podcast-grid">${(show.episodes || []).map(podcastEpisodeCard).join("") || `<p class="muted">No episodes published for this show yet.</p>`}</div>
      </section>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Podcast network</span><h1>Show unavailable</h1><p>${escapeHtml(error.message || "This show could not be loaded.")}</p><a class="button primary" href="#/podcasts">Back to podcasts</a></section>`;
  }
}

async function renderPodcastEpisode(slug) {
  setTitle("Podcast Episode", "Podcast episode from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Podcast network</span><h1>Loading episode</h1><p>Fetching audio.</p></section>`;
  try {
    const response = await fetch(`/api/podcasts/episodes/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.episode) throw new Error(data.message || "Podcast episode not found.");
    const episode = data.episode;
    setTitle(episode.seoTitle || episode.title, episode.seoDescription || episode.description, {
      canonicalUrl: `${location.origin}/#/podcast-episode/${episode.slug}`,
      ogImage: episode.coverImage || "",
      schema: {
        "@context": "https://schema.org",
        "@type": "PodcastEpisode",
        name: episode.title,
        description: episode.seoDescription || episode.description,
        associatedMedia: { "@type": "MediaObject", contentUrl: episode.audioUrl },
        partOfSeries: { "@type": "PodcastSeries", name: episode.showTitle || "Tech Magazine Podcasts" }
      }
    });
    app.innerHTML = `
      <article class="podcast-page">
        <header class="page-hero compact-hero">
          <span>${escapeHtml(episode.showTitle || "Podcast episode")}</span>
          <h1>${escapeHtml(episode.title)}</h1>
          <p>${escapeHtml(episode.description)}</p>
        </header>
        <section class="content-band podcast-detail">
          <div class="podcast-cover large">${(episode.thumbnailUrl || episode.coverImage) ? `<img src="${escapeHtml(episode.thumbnailUrl || episode.coverImage)}" alt="${escapeHtml(episode.showTitle)}">` : `<span>Audio</span>`}</div>
          <aside class="reader-card">
            <span>Episode ${Number(episode.episodeNumber || 0).toLocaleString()}</span>
            <h2>${escapeHtml(formatDuration(episode.durationSeconds))}</h2>
            ${episode.sponsorName ? `<p>Sponsored by ${escapeHtml(episode.sponsorName)}</p>` : ""}
            ${episode.premium ? `<p>Premium episode</p>` : ""}
            ${podcastAudioPlayerMarkup(episode)}
            <a class="button secondary" href="#/podcast/${episode.showSlug}">Open show</a>
          </aside>
        </section>
        ${episode.summary ? `<section class="content-band"><article class="reader-card"><span>Summary</span><p>${escapeHtml(episode.summary)}</p></article></section>` : ""}
        ${(episode.chapters || []).length ? `<section class="content-band"><div class="section-heading"><span>Chapters</span><h2>Episode timeline</h2></div><div class="mini-grid">${episode.chapters.map((chapter) => `<article class="reader-card"><span>${escapeHtml(chapter.time)}</span><h2>${escapeHtml(chapter.title)}</h2>${chapter.url ? `<a href="${escapeHtml(chapter.url)}" target="_blank" rel="noreferrer">Open link</a>` : ""}</article>`).join("")}</div></section>` : ""}
        ${(episode.clips || []).length ? `<section class="content-band"><div class="section-heading"><span>Clips</span><h2>Shareable moments</h2></div><div class="mini-grid">${episode.clips.map((clip) => `<article class="reader-card"><span>${escapeHtml(`${clip.start} - ${clip.end}`)}</span><h2>${escapeHtml(clip.label)}</h2></article>`).join("")}</div></section>` : ""}
        ${episode.relatedArticleSlug ? `<section class="content-band"><article class="reader-card"><span>Related article</span><h2>${escapeHtml(episode.relatedArticleTitle)}</h2><a class="button secondary" href="#/article/${escapeHtml(episode.relatedArticleSlug)}">Read article</a></article></section>` : ""}
        ${episode.transcript ? `<section class="content-band"><article class="reader-card"><span>Transcript</span><p>${escapeHtml(episode.transcript)}</p></article></section>` : ""}
        <section class="content-band">
          <div class="section-heading"><span>Related</span><h2>More episodes</h2></div>
          <div class="podcast-grid">${(episode.related || []).map(podcastEpisodeCard).join("") || `<p class="muted">No related episodes yet.</p>`}</div>
        </section>
      </article>
    `;
    bindPodcastPlayers([episode]);
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Podcast network</span><h1>Episode unavailable</h1><p>${escapeHtml(error.message || "This episode could not be loaded.")}</p><a class="button primary" href="#/podcasts">Back to podcasts</a></section>`;
  }
}

function reviewCard(review) {
  return `
    <a class="review-card" href="#/review/${review.slug}">
      <div class="review-score"><strong>${Number(review.rating || 0).toFixed(1)}</strong><span>/ ${Number(review.ratingMax || 10).toFixed(0)}</span></div>
      <div>
        <span>${escapeHtml(review.brand || review.productCategory || "Review")}</span>
        <h2>${escapeHtml(review.productName)}</h2>
        <p>${escapeHtml(review.verdict)}</p>
        <small>${escapeHtml(review.scoreLabel || "Product review")} / ${(review.benchmarks || []).length} tests / ${(review.specs || []).length} specs</small>
      </div>
    </a>
  `;
}

function reviewSignalCards(experience) {
  const signals = experience?.labSignals || {};
  return [
    ["Reviews", Number(signals.publishedReviews || 0).toLocaleString(), "published verdicts"],
    ["Average", Number(signals.averageRating || 0).toFixed(1), "rating out of 10"],
    ["Benchmarks", Number(signals.benchmarkTests || 0).toLocaleString(), "recorded tests"],
    ["Affiliate", Number(signals.affiliateReady || 0).toLocaleString(), "disclosed product links"]
  ].map(([label, value, detail]) => `<article><span>${label}</span><strong>${value}</strong><small>${detail}</small></article>`).join("");
}

function reviewCategoryCards(categories = []) {
  return categories.map((category) => `
    <a class="reader-card review-category-card" href="#/reviews?category=${encodeURIComponent(category.category)}">
      <span>${escapeHtml(category.category)}</span>
      <h2>${Number(category.count || 0).toLocaleString()} reviews</h2>
      <p>${Number(category.averageRating || 0).toFixed(1)} average rating</p>
    </a>
  `).join("");
}

function scoringCards(experience) {
  return (experience?.scoringSystem || []).map((item) => `
    <article class="reader-card">
      <span>${escapeHtml(item.label)}</span>
      <p>${escapeHtml(item.description)}</p>
    </article>
  `).join("");
}

function reviewReadinessPills(readiness = {}) {
  return [
    ["Review pages", readiness.reviewPagesReady],
    ["Comparison engine", readiness.comparisonReady],
    ["Rating system", readiness.ratingSystemReady],
    ["Pros/cons", readiness.prosConsReady],
    ["Specifications", readiness.specificationTablesReady],
    ["Benchmarks", readiness.benchmarkTablesReady],
    ["Affiliate disclosure", readiness.affiliateDisclosureReady],
    ["Review schema", readiness.reviewSchemaReady],
    ["Benchmark policy", !readiness.benchmarkProvenancePolicyRequired],
    ["Google validation", !readiness.externalStructuredDataValidationRequired]
  ].map(([label, ready]) => `<span class="${ready ? "ready" : "pending"}">${label}</span>`).join("");
}

async function loadReviewExperience() {
  try {
    const response = await fetch("/api/reviews/experience", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || "Review experience unavailable.");
    productReviews = data.reviews?.length ? data.reviews : productReviews;
    return data;
  } catch (error) {
    console.warn("Review experience fallback.", error);
    return { reviews: productReviews, categories: [], labSignals: {}, scoringSystem: [], readiness: {} };
  }
}

async function renderReviews() {
  setTitle("Reviews", "Professional technology product reviews, ratings, benchmarks, and buying advice.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Review lab</span><h1>Loading review desk</h1><p>Preparing ratings, comparisons, and benchmark data.</p></section>`;
  const experience = await loadReviewExperience();
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const category = params.get("category") || "";
  const reviews = (experience.reviews?.length ? experience.reviews : productReviews).filter((review) => !category || review.productCategory === category);
  const compareSlugs = reviews.slice(0, 3).map((review) => review.slug).join(",");
  app.innerHTML = `
    <section class="page-hero compact-hero review-lab-hero">
      <span>Review lab</span>
      <h1>Product reviews, benchmarks, and buying verdicts</h1>
      <p>Structured ratings, pros and cons, specifications, benchmark results, comparison notes, affiliate disclosure, and clear editorial verdicts.</p>
      <div class="hero-actions">
        <a class="button primary" href="${compareSlugs ? `#/reviews-compare/${escapeHtml(compareSlugs)}` : "#/reviews"}">Compare reviews</a>
        <a class="button secondary" href="#/devices">Device database</a>
      </div>
      <div class="review-signal-row">${reviewSignalCards(experience)}</div>
    </section>
    <section class="content-band review-command-grid">
      <article class="reader-card">
        <span>Review integrity</span>
        <h2>Scores are tied to evidence</h2>
        <p>Each review can carry specifications, test results, comparison notes, product links, a linked article, and structured Review schema.</p>
        <div class="readiness-pills">${reviewReadinessPills(experience.readiness || {})}</div>
      </article>
      <article class="reader-card">
        <span>Scoring system</span>
        <h2>What we evaluate</h2>
        <div class="review-scoring-grid">${scoringCards(experience)}</div>
      </article>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Categories</span><h2>Browse tested products</h2></div>
      <div class="mini-grid">${reviewCategoryCards(experience.categories || []) || `<p class="muted">Review categories will appear as reviews are published.</p>`}</div>
    </section>
    <section class="content-band">
      <div class="section-heading">
        <span>${category ? escapeHtml(category) : "Latest reviews"}</span>
        <h2>Tested by the newsroom</h2>
      </div>
      <div class="review-grid">
        ${reviews.map(reviewCard).join("") || `<p class="muted">No product reviews are published yet. Editors can publish structured reviews from the CMS Review System.</p>`}
      </div>
    </section>
  `;
}

async function renderReview(slug) {
  setTitle("Review", "Technology product review from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Review lab</span><h1>Loading review</h1><p>Fetching structured review data.</p></section>`;
  try {
    const response = await fetch(`/api/reviews/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.review) throw new Error(data.message || "Review not found.");
    const review = data.review;
    setTitle(`${review.productName} Review`, review.verdict, {
      canonicalUrl: `${location.origin}/#/review/${review.slug}`,
      ogImage: review.imageUrl || "",
      schema: {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: { "@type": "Product", name: review.productName, brand: review.brand || "" },
        reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: review.ratingMax },
        reviewBody: review.verdict,
        author: { "@type": "Organization", name: "Tech Magazine" }
      }
    });
    app.innerHTML = `
      <article class="review-page">
        <header class="page-hero compact-hero review-hero">
          <span>${escapeHtml(review.brand || review.productCategory || "Review")}</span>
          <h1>${escapeHtml(review.productName)}</h1>
          <p>${escapeHtml(review.verdict)}</p>
          <div class="review-score large"><strong>${Number(review.rating || 0).toFixed(1)}</strong><span>/ ${Number(review.ratingMax || 10).toFixed(0)}</span></div>
        </header>
        <section class="content-band review-detail">
          ${review.imageUrl ? `<figure class="review-image"><img ${responsiveImageAttrs(review.imageUrl, review.productName, "(max-width: 760px) 92vw, 520px")}></figure>` : ""}
          <aside class="reader-card">
            <span>${escapeHtml(review.scoreLabel || "Review score")}</span>
            <h2>Verdict</h2>
            <p>${escapeHtml(review.verdict)}</p>
            ${review.articleSlug ? `<a class="button secondary" href="#/article/${escapeHtml(review.articleSlug)}">Read full article</a>` : ""}
            ${review.productUrl ? `<a class="button ghost" href="${escapeHtml(review.productUrl)}" target="_blank" rel="noreferrer">Product page</a>` : ""}
          </aside>
        </section>
        <section class="content-band review-columns">
          <article class="reader-card"><span>Pros</span><ul>${(review.pros || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>No pros entered yet.</li>"}</ul></article>
          <article class="reader-card"><span>Cons</span><ul>${(review.cons || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>No cons entered yet.</li>"}</ul></article>
        </section>
        <section class="content-band review-integrity-band">
          <article class="reader-card">
            <span>Review method</span>
            <h2>Evidence-backed score</h2>
            <p>This review stores structured verdict, pros, cons, specs, benchmark rows, comparison notes, linked article, product URL disclosure, and Review schema.</p>
          </article>
          <article class="reader-card">
            <span>Reviewer</span>
            <h2>${escapeHtml(review.reviewerName || "Tech Magazine review desk")}</h2>
            <p>${escapeHtml(review.publishedAt || review.updatedAt || "Publication date pending")}</p>
          </article>
          <article class="reader-card">
            <span>Disclosure</span>
            <h2>${review.productUrl ? "Product link available" : "No product link"}</h2>
            <p>${review.productUrl ? "External product links are treated as commercial/affiliate-ready placements and must remain labeled." : "No external commerce link is attached to this review."}</p>
          </article>
        </section>
        <section class="content-band">
          <div class="section-heading"><span>Specifications</span><h2>Product details</h2></div>
          <div class="spec-grid">${(review.specs || []).map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join("") || `<p class="muted">No specifications entered yet.</p>`}</div>
        </section>
        <section class="content-band">
          <div class="section-heading"><span>Benchmarks</span><h2>Test results</h2></div>
          <table class="review-table"><thead><tr><th>Test</th><th>Score</th><th>Unit</th><th>Note</th></tr></thead><tbody>${(review.benchmarks || []).map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.score)}</td><td>${escapeHtml(item.unit || "")}</td><td>${escapeHtml(item.note || "")}</td></tr>`).join("") || `<tr><td colspan="4">No benchmark data entered yet.</td></tr>`}</tbody></table>
        </section>
        <section class="content-band">
          <div class="section-heading"><span>Comparison</span><h2>How it compares</h2></div>
          <div class="mini-grid">${(review.comparisons || []).map((item) => `<article class="reader-card"><span>${escapeHtml(item.label)}</span><p>${escapeHtml(item.value)}</p></article>`).join("") || `<p class="muted">No comparison notes entered yet.</p>`}</div>
          <a class="button secondary" href="#/reviews-compare/${escapeHtml(review.slug)}">Open comparison view</a>
        </section>
      </article>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Review lab</span><h1>Review unavailable</h1><p>${escapeHtml(error.message || "This review could not be loaded.")}</p><a class="button primary" href="#/reviews">Back to reviews</a></section>`;
  }
}

async function renderReviewComparison(value = "") {
  setTitle("Compare Reviews", "Side-by-side product review comparison from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Review comparison</span><h1>Loading comparison</h1><p>Building score, spec, benchmark, and verdict matrices.</p></section>`;
  try {
    const experience = await loadReviewExperience();
    const requestedSlugs = String(value || "").split(",").map((slug) => slug.trim()).filter(Boolean);
    const publicSlugs = (experience.reviews?.length ? experience.reviews : productReviews).map((review) => review.slug).filter(Boolean);
    const slugs = [...new Set([...requestedSlugs, ...publicSlugs])].slice(0, 3).join(",");
    const response = await fetch(`/api/reviews/compare?slugs=${encodeURIComponent(slugs)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.comparison) throw new Error(data.message || "Comparison unavailable.");
    const comparison = data.comparison;
    app.innerHTML = `
      <section class="page-hero compact-hero review-lab-hero">
        <span>Review comparison</span>
        <h1>Side-by-side product verdicts</h1>
        <p>Compare ratings, score labels, specifications, benchmark results, product links, and editorial verdicts.</p>
        <div class="review-signal-row">
          ${comparison.reviews.map((review) => `<article><span>${escapeHtml(review.brand || review.productCategory || "Review")}</span><strong>${Number(review.rating || 0).toFixed(1)}</strong><small>${escapeHtml(review.productName)}</small></article>`).join("")}
        </div>
      </section>
      <section class="content-band">
        <div class="section-heading"><span>Verdicts</span><h2>Editorial conclusions</h2></div>
        <div class="mini-grid">${comparison.verdicts.map((item) => `<article class="reader-card"><span>${Number(item.rating || 0).toFixed(1)} / 10</span><h2>${escapeHtml(item.scoreLabel || item.slug)}</h2><p>${escapeHtml(item.verdict)}</p></article>`).join("")}</div>
      </section>
      <section class="content-band">
        <div class="section-heading"><span>Specifications</span><h2>Spec matrix</h2></div>
        <table class="review-table"><thead><tr><th>Spec</th>${comparison.reviews.map((review) => `<th>${escapeHtml(review.productName)}</th>`).join("")}</tr></thead><tbody>${comparison.specMatrix.map((row) => `<tr><td>${escapeHtml(row.label)}</td>${row.values.map((value) => `<td>${escapeHtml(value.value)}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${comparison.reviews.length + 1}">No shared specs.</td></tr>`}</tbody></table>
      </section>
      <section class="content-band">
        <div class="section-heading"><span>Benchmarks</span><h2>Test matrix</h2></div>
        <table class="review-table"><thead><tr><th>Test</th>${comparison.reviews.map((review) => `<th>${escapeHtml(review.productName)}</th>`).join("")}</tr></thead><tbody>${comparison.benchmarkMatrix.map((row) => `<tr><td>${escapeHtml(row.name)}</td>${row.values.map((value) => `<td>${escapeHtml(value.score || "-")} ${escapeHtml(value.unit || "")}<small>${escapeHtml(value.note || "")}</small></td>`).join("")}</tr>`).join("") || `<tr><td colspan="${comparison.reviews.length + 1}">No benchmark matrix yet.</td></tr>`}</tbody></table>
      </section>
      <section class="content-band">
        <div class="section-heading"><span>Commerce disclosure</span><h2>Product link readiness</h2></div>
        <div class="mini-grid">${comparison.affiliateReady.map((item) => `<article class="reader-card"><span>${escapeHtml(item.slug)}</span><h2>${item.ready ? "Product link ready" : "No product link"}</h2><p>${item.ready ? escapeHtml(item.productUrl) : "Add a product URL in the review desk before commercial placement."}</p></article>`).join("")}</div>
      </section>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Review comparison</span><h1>Comparison unavailable</h1><p>${escapeHtml(error.message || "This comparison could not be loaded.")}</p><a class="button primary" href="#/reviews">Back to reviews</a></section>`;
  }
}

function renderDirectory(type) {
  const labels = { podcasts: "podcast", jobs: "job", events: "event", marketplace: "marketplace" };
  const itemType = labels[type] || type;
  const items = directoryItems.filter((item) => item.type === itemType);
  setTitle(type[0].toUpperCase() + type.slice(1), `Technology ${type} directory.`);
  app.innerHTML = `
    <section class="page-hero compact-hero">
      <span>Expansion module</span>
      <h1>${type[0].toUpperCase() + type.slice(1)}</h1>
      <p>This module is database-backed and ready for deeper workflows.</p>
    </section>
    <section class="content-band">
      <div class="mini-grid">${items.map((item) => `<a class="reader-card" href="${item.url || "#/"}"><span>${item.type}</span><h2>${item.title}</h2><p>${item.description}</p></a>`).join("") || `<p class="muted">No items published yet.</p>`}</div>
    </section>
  `;
}

function formatJobSalary(job) {
  if (!job.salaryMin && !job.salaryMax) return "Salary not listed";
  const min = Number(job.salaryMin || 0).toLocaleString();
  const max = Number(job.salaryMax || 0).toLocaleString();
  return `${job.currency || "USD"} ${min}${job.salaryMax ? ` - ${max}` : ""}`;
}

async function loadJobExperience() {
  try {
    const response = await fetch("/api/jobs/experience", { cache: "no-store" });
    const data = await response.json();
    if (data.ok) {
      jobExperience = data.experience;
      jobPosts = data.experience.jobs || jobPosts;
      return jobExperience;
    }
  } catch {
    // Keep bootstrap jobs if the experience endpoint is temporarily unavailable.
  }
  return jobExperience || { jobs: jobPosts.filter((job) => job.status === "published"), featuredJobs: [], companyProfiles: [], salaryInsights: [], hiringTracks: [], readiness: {}, stats: {} };
}

function jobCard(job) {
  return `
    <a class="reader-card job-card" href="#/job/${escapeHtml(job.slug)}" data-job-card data-title="${escapeHtml(String(job.title || "").toLowerCase())}" data-company="${escapeHtml(String(job.companyName || "").toLowerCase())}" data-remote="${escapeHtml(job.remoteType || "hybrid")}" data-type="${escapeHtml(job.jobType || "full-time")}">
      <span>${job.featured ? "Featured / " : ""}${escapeHtml(job.companyName)} / ${escapeHtml(job.remoteType || "hybrid")}</span>
      <h2>${escapeHtml(job.title)}</h2>
      <p>${escapeHtml(job.description)}</p>
      <small>${escapeHtml(job.location)} / ${escapeHtml(job.jobType || "full-time")} / ${escapeHtml(formatJobSalary(job))}</small>
    </a>
  `;
}

function salaryInsightCards(insights = []) {
  return insights.map((insight) => `
    <article class="reader-card">
      <span>${escapeHtml(insight.jobType)}</span>
      <h2>${insight.averageSalary ? `${Number(insight.averageSalary).toLocaleString()} USD` : "Salary building"}</h2>
      <p>${escapeHtml(insight.salaryRange || "Not enough salary data yet")}</p>
    </article>
  `).join("");
}

function jobCompanyProfileCards(companies = []) {
  return companies.map((company) => `
    <article class="reader-card">
      <span>${company.featured ? "Featured employer" : "Hiring company"}</span>
      <h2>${escapeHtml(company.companyName || company.name)}</h2>
      <p>${escapeHtml(company.description || "Company profile is being completed by the hiring desk.")}</p>
      <small>${escapeHtml(company.headquarters || "Global")} / ${escapeHtml(company.industry || "technology")} / ${escapeHtml(company.employeeCount || "team size pending")}</small>
      ${company.website ? `<a class="button ghost" href="${escapeHtml(company.website)}" target="_blank" rel="noreferrer">Company profile</a>` : ""}
    </article>
  `).join("");
}

async function renderJobs() {
  const experience = await loadJobExperience();
  const activeJobs = experience.jobs || jobPosts.filter((job) => job.status === "published");
  const stats = experience.stats || {};
  setTitle("Tech Jobs", "Technology jobs, recruiter accounts, resume applications, and AI-ready matching from Tech Magazine.");
  app.innerHTML = `
    <section class="page-hero compact-hero">
      <span>Tech job board</span>
      <h1>Technology roles for builders, leaders, and security teams</h1>
      <p>Recruiter-backed job posts, company hiring profiles, resume uploads, application tracking, salary insights, alerts, and matching signals for technology professionals.</p>
    </section>
    <section class="content-band">
      <div class="spec-grid">
        <div><span>Open roles</span><strong>${Number(stats.openRoles ?? activeJobs.length).toLocaleString()}</strong></div>
        <div><span>Remote roles</span><strong>${Number(stats.remoteRoles || 0).toLocaleString()}</strong></div>
        <div><span>Featured roles</span><strong>${Number(stats.featuredRoles || 0).toLocaleString()}</strong></div>
        <div><span>Recruiters</span><strong>${Number(stats.recruiters || 0).toLocaleString()}</strong></div>
        <div><span>Applications</span><strong>${Number(stats.applications || 0).toLocaleString()}</strong></div>
        <div><span>Avg match</span><strong>${Number(stats.averageMatch || 0).toLocaleString()}%</strong></div>
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Search</span><h2>Find a technology role</h2></div>
      <form class="newsletter-card compact-form" data-job-filters>
        <label>Keyword<input name="keyword" placeholder="security, AI, platform"></label>
        <label>Remote type<select name="remote"><option value="">Any</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">Onsite</option></select></label>
        <label>Job type<select name="type"><option value="">Any</option><option value="full-time">Full-time</option><option value="contract">Contract</option><option value="part-time">Part-time</option><option value="internship">Internship</option></select></label>
        <button class="button primary" type="submit">Filter jobs</button>
      </form>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Hiring</span><h2>Featured jobs</h2></div>
      <div class="mini-grid" data-job-list>${activeJobs.map(jobCard).join("") || `<p class="muted">No jobs are published yet.</p>`}</div>
      <p class="form-message" data-job-filter-message></p>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Salary</span><h2>Salary insights</h2></div>
      <div class="mini-grid">${salaryInsightCards(experience.salaryInsights) || `<p class="muted">Salary insights will appear after verified roles include compensation bands.</p>`}</div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Companies</span><h2>Hiring profiles</h2></div>
      <div class="mini-grid">${jobCompanyProfileCards(experience.companyProfiles) || `<p class="muted">Recruiter profiles are being reviewed.</p>`}</div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Alerts</span><h2>Create a job alert</h2></div>
      <form class="newsletter-card compact-form" data-job-alert>
        <label>Email<input type="email" name="email" value="${escapeHtml(readerSession.reader?.email || "")}" required></label>
        <label>Keywords<input name="keywords" placeholder="AI, cloud, security"></label>
        <label>Location<input name="location" placeholder="Remote, Beirut, London"></label>
        <label>Remote type<select name="remoteType"><option value="">Any</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">Onsite</option></select></label>
        <label>Frequency<select name="frequency"><option value="weekly">Weekly</option><option value="daily">Daily</option><option value="instant">Instant</option></select></label>
        <button class="button primary" type="submit">Save alert</button>
        <p class="form-message" data-form-message></p>
      </form>
    </section>
  `;
}

async function renderJob(slug) {
  setTitle("Tech Job", "Technology job listing from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Jobs</span><h1>Loading job</h1><p>Fetching role and application details.</p></section>`;
  try {
    const response = await fetch(`/api/jobs/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.job) throw new Error(data.message || "Job not found.");
    const job = data.job;
    setTitle(job.title, job.description, {
      canonicalUrl: `${location.origin}/#/job/${job.slug}`,
      schema: {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.description,
        hiringOrganization: { "@type": "Organization", name: job.companyName, sameAs: job.companyWebsite || "" },
        jobLocationType: job.remoteType === "remote" ? "TELECOMMUTE" : undefined,
        employmentType: String(job.jobType || "full-time").toUpperCase(),
        datePosted: job.createdAt,
        validThrough: job.expiresAt || undefined,
        applicantLocationRequirements: { "@type": "Country", name: job.location || "Remote" }
      }
    });
    app.innerHTML = `
      <article class="job-page">
        <header class="page-hero compact-hero">
          <span>${escapeHtml(job.companyName)} / ${escapeHtml(job.location)}</span>
          <h1>${escapeHtml(job.title)}</h1>
          <p>${escapeHtml(job.description)}</p>
          <div class="hero-actions">
            <button class="button primary" type="button" data-scroll-to-job-apply>Apply</button>
            ${job.companyWebsite ? `<a class="button secondary" href="${escapeHtml(job.companyWebsite)}" target="_blank" rel="noreferrer">Company</a>` : ""}
          </div>
        </header>
        <section class="content-band event-detail">
          <aside class="reader-card">
            <span>${escapeHtml(job.remoteType || "hybrid")} / ${escapeHtml(job.jobType || "full-time")}</span>
            <h2>${escapeHtml(formatJobSalary(job))}</h2>
            <p>${escapeHtml(job.location)}</p>
            <p>${escapeHtml(job.seniority || "mid")} level</p>
            <p>${Number(job.applicationCount || 0).toLocaleString()} applications saved</p>
            ${job.salaryNote ? `<p>${escapeHtml(job.salaryNote)}</p>` : ""}
          </aside>
          <div class="mini-grid">
            <article class="reader-card"><span>Skills</span><ul>${(job.skills || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>Skills will be added soon.</li>"}</ul></article>
            <article class="reader-card"><span>Requirements</span><ul>${(job.requirements || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>Requirements will be added soon.</li>"}</ul></article>
            <article class="reader-card"><span>Benefits</span><ul>${(job.benefits || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>Benefits will be added soon.</li>"}</ul></article>
          </div>
        </section>
        <section id="job-apply" class="content-band">
          <div class="section-heading"><span>Application</span><h2>Apply for this role</h2></div>
          <form class="newsletter-card" data-job-application data-job-slug="${escapeHtml(job.slug)}" enctype="multipart/form-data">
            <label>Name<input name="name" value="${escapeHtml(readerSession.reader?.name || "")}" required></label>
            <label>Email<input type="email" name="email" value="${escapeHtml(readerSession.reader?.email || "")}" required></label>
            <label>Resume URL<input name="resumeUrl" placeholder="https://..."></label>
            <label>Resume upload<input type="file" name="resume" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"></label>
            <label>Portfolio URL<input name="portfolioUrl" placeholder="https://portfolio.example.com"></label>
            <label>Skills<textarea name="skills" placeholder="Cloud security, Kubernetes, zero trust"></textarea></label>
            <label>Cover letter<textarea name="coverLetter" placeholder="Short note for the recruiter"></textarea></label>
            <button class="button primary" type="submit">Submit application</button>
            ${job.applyUrl ? `<a class="button ghost" href="${escapeHtml(job.applyUrl)}" target="_blank" rel="noreferrer">External application</a>` : ""}
            <p class="form-message" data-form-message></p>
          </form>
        </section>
      </article>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Jobs</span><h1>Job unavailable</h1><p>${escapeHtml(error.message || "This job could not be loaded.")}</p><a class="button primary" href="#/jobs">Back to jobs</a></section>`;
  }
}

function formatFunding(amount = 0) {
  const value = Number(amount || 0);
  if (value >= 1000000) return `$${(value / 1000000).toFixed(value % 1000000 ? 1 : 0)}M`;
  if (value >= 1000) return `$${Math.round(value / 1000)}K`;
  return value > 0 ? `$${value.toLocaleString()}` : "Undisclosed";
}

function startupCard(startup) {
  return `
    <a class="reader-card startup-card" href="#/startup/${escapeHtml(startup.slug)}">
      <span>${escapeHtml(startup.sector)} / ${escapeHtml(startup.stage)}</span>
      <h2>${escapeHtml(startup.name)}</h2>
      <p>${escapeHtml(startup.tagline)}</p>
      <small>${escapeHtml(startup.headquarters || "Global")} / ${formatFunding(startup.totalFundingUsd)} / rank ${Number(startup.rankScore || 0)}</small>
    </a>
  `;
}

function renderStartups() {
  const published = startupProfiles.filter((startup) => startup.status === "published");
  const totalFunding = published.reduce((sum, startup) => sum + Number(startup.totalFundingUsd || 0), 0);
  const sectors = new Set(published.map((startup) => startup.sector).filter(Boolean));
  setTitle("Startup Directory", "Startup profiles, funding data, founder pages, and rankings from Tech Magazine.");
  app.innerHTML = `
    <section class="page-hero compact-hero">
      <span>Startup directory</span>
      <h1>Track the companies building the next wave of technology</h1>
      <p>Profiles, founders, funding rounds, sectors, stages, and editorial ranking signals for the startup ecosystem.</p>
    </section>
    <section class="content-band">
      <div class="spec-grid">
        <div><span>Startups</span><strong>${Number(published.length).toLocaleString()}</strong></div>
        <div><span>Sectors</span><strong>${Number(sectors.size).toLocaleString()}</strong></div>
        <div><span>Total funding</span><strong>${formatFunding(totalFunding)}</strong></div>
      </div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Ranked profiles</span><h2>Featured startups</h2></div>
      <div class="mini-grid">${published.map(startupCard).join("") || `<p class="muted">No startup profiles are published yet.</p>`}</div>
    </section>
  `;
}

async function renderStartup(slug) {
  setTitle("Startup Profile", "Startup profile from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Startups</span><h1>Loading startup</h1><p>Fetching founder and funding details.</p></section>`;
  try {
    const response = await fetch(`/api/startups/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.startup) throw new Error(data.message || "Startup not found.");
    const startup = data.startup;
    setTitle(startup.name, startup.tagline, {
      canonicalUrl: `${location.origin}/#/startup/${startup.slug}`,
      ogImage: startup.logoUrl || "",
      schema: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: startup.name,
        url: startup.website || "",
        description: startup.description,
        foundingDate: startup.foundedYear ? String(startup.foundedYear) : undefined,
        founder: (startup.founders || []).map((founder) => ({ "@type": "Person", name: founder.name, jobTitle: founder.title || "Founder" }))
      }
    });
    app.innerHTML = `
      <article class="startup-page">
        <header class="page-hero compact-hero">
          <span>${escapeHtml(startup.sector)} / ${escapeHtml(startup.stage)} / rank ${Number(startup.rankScore || 0)}</span>
          <h1>${escapeHtml(startup.name)}</h1>
          <p>${escapeHtml(startup.description)}</p>
          <div class="hero-actions">
            ${startup.website ? `<a class="button primary" href="${escapeHtml(startup.website)}" target="_blank" rel="noreferrer">Website</a>` : ""}
            <a class="button secondary" href="#/startups">All startups</a>
          </div>
        </header>
        <section class="content-band event-detail">
          <aside class="reader-card">
            <span>${escapeHtml(startup.headquarters || "Global")}</span>
            <h2>${formatFunding(startup.totalFundingUsd)}</h2>
            <p>Founded ${startup.foundedYear || "not listed"}</p>
            <p>${Number(startup.fundingRoundCount || 0).toLocaleString()} funding rounds</p>
          </aside>
          <div class="mini-grid">
            ${(startup.founders || []).map((founder) => `
              <article class="reader-card">
                ${founder.avatar ? `<img class="avatar-small" src="${escapeHtml(founder.avatar)}" alt="${escapeHtml(founder.name)}">` : ""}
                <span>${escapeHtml(founder.title || "Founder")}</span>
                <h2>${escapeHtml(founder.name)}</h2>
                <p>${escapeHtml(founder.bio || "")}</p>
                ${founder.socialUrl ? `<a href="${escapeHtml(founder.socialUrl)}" target="_blank" rel="noreferrer">Founder profile</a>` : ""}
              </article>
            `).join("") || `<p class="muted">Founder profiles will be added soon.</p>`}
          </div>
        </section>
        <section class="content-band">
          <div class="section-heading"><span>Funding</span><h2>Rounds and investors</h2></div>
          <table class="review-table"><thead><tr><th>Round</th><th>Amount</th><th>Date</th><th>Investors</th></tr></thead><tbody>${(startup.fundingRounds || []).map((round) => `<tr><td>${escapeHtml(round.roundName)}</td><td>${formatFunding(round.amountUsd)}</td><td>${escapeHtml(round.announcedAt || "")}</td><td>${(round.investors || []).map((investor) => escapeHtml(investor)).join(", ")}</td></tr>`).join("") || `<tr><td colspan="4">No funding rounds entered yet.</td></tr>`}</tbody></table>
        </section>
      </article>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Startups</span><h1>Startup unavailable</h1><p>${escapeHtml(error.message || "This startup could not be loaded.")}</p><a class="button primary" href="#/startups">Back to startups</a></section>`;
  }
}

function formatDevicePrice(amount = 0) {
  return Number(amount || 0) > 0 ? `$${Number(amount || 0).toLocaleString()}` : "Price not listed";
}

function deviceCard(device) {
  return `
    <a class="reader-card device-card" href="#/device/${escapeHtml(device.slug)}">
      <span>${escapeHtml(device.brand)} / ${escapeHtml(device.deviceType)}</span>
      <h2>${escapeHtml(device.name)}</h2>
      <p>${escapeHtml(device.summary)}</p>
      <small>${formatDevicePrice(device.priceUsd)} / ${Number(device.rating || 0).toFixed(1)} rating / rank ${Number(device.rankScore || 0)}</small>
    </a>
  `;
}

function deviceSignalCards(experience = {}) {
  const quality = experience.quality || {};
  return [
    ["Devices", quality.deviceRecords || 0, "published records"],
    ["Companies", quality.companyProfiles || 0, "brand profiles"],
    ["Benchmarks", experience.benchmarkFamilies?.length || 0, "test families"],
    ["Timeline", quality.releaseTimelineEntries || 0, "release entries"]
  ].map(([label, value, detail]) => `<article><span>${label}</span><strong>${Number(value || 0).toLocaleString()}</strong><small>${detail}</small></article>`).join("");
}

function deviceTypeCards(types = []) {
  return types.map((type) => `
    <a class="reader-card review-category-card" href="#/devices?type=${encodeURIComponent(type.type)}">
      <span>${escapeHtml(type.type)}</span>
      <h2>${Number(type.count || 0).toLocaleString()} devices</h2>
      <p>${Number(type.averageRating || 0).toFixed(1)} average rating</p>
    </a>
  `).join("");
}

function deviceReadinessPills(readiness = {}) {
  return [
    ["Smartphones", readiness.smartphoneDatabaseReady],
    ["Laptops", readiness.laptopDatabaseReady],
    ["GPU/CPU", readiness.gpuCpuDatabaseReady],
    ["Companies", readiness.companyProfilesReady],
    ["Startups", readiness.startupProfilesReady],
    ["Specifications", readiness.productSpecificationsReady],
    ["Comparisons", readiness.deviceComparisonsReady],
    ["Historical tracking", readiness.historicalTrackingReady],
    ["Benchmarks", readiness.benchmarkDataReady],
    ["Release timeline", readiness.releaseTimelineReady]
  ].map(([label, ready]) => `<span class="${ready ? "ready" : "pending"}">${label}</span>`).join("");
}

function companyProfileCards(companies = []) {
  return companies.map((company) => `
    <article class="reader-card">
      <span>${escapeHtml((company.categories || []).join(", ") || "company")}</span>
      <h2>${escapeHtml(company.brand)}</h2>
      <p>${Number(company.deviceCount || 0).toLocaleString()} records / ${Number(company.averageRating || 0).toFixed(1)} average rating / ${escapeHtml(company.headquarters || "Global market")}</p>
      ${company.topDevice ? `<a class="button secondary" href="#/device/${escapeHtml(company.topDevice)}">Open top device</a>` : ""}
    </article>
  `).join("");
}

function releaseTimelineCards(items = []) {
  return items.slice(0, 8).map((item) => `
    <a class="reader-card timeline-card" href="#/device/${escapeHtml(item.slug)}">
      <span>${Number(item.year || 0)} / ${escapeHtml(item.type)}</span>
      <h2>${escapeHtml(item.device)}</h2>
      <p>${escapeHtml(item.brand)} / ${Number(item.rating || 0).toFixed(1)} rating / rank ${Number(item.rankScore || 0)}</p>
    </a>
  `).join("");
}

async function loadDeviceExperience() {
  try {
    const response = await fetch("/api/devices/experience", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || "Device experience unavailable.");
    devices = data.devices?.length ? data.devices : devices;
    return data;
  } catch (error) {
    console.warn("Device experience fallback.", error);
    const published = devices.filter((device) => device.status === "published");
    return { devices: published, types: [], companyProfiles: [], releaseTimeline: [], benchmarkFamilies: [], readiness: {}, quality: {} };
  }
}

async function renderDevices() {
  setTitle("Device Database", "Phone, laptop, GPU, CPU, and gadget specifications, benchmarks, and comparisons from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Tech database</span><h1>Loading device directory</h1><p>Preparing product records, specs, benchmarks, and release history.</p></section>`;
  const experience = await loadDeviceExperience();
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const selectedType = params.get("type") || "";
  const published = (experience.devices?.length ? experience.devices : devices).filter((device) => device.status === "published" && (!selectedType || device.deviceType === selectedType));
  const compareSlugs = (experience.devices?.length ? experience.devices : published).slice(0, 3).map((device) => device.slug).join(",");
  app.innerHTML = `
    <section class="page-hero compact-hero review-lab-hero">
      <span>Device database</span>
      <h1>Specs, benchmarks, and comparisons for modern technology</h1>
      <p>Track phones, laptops, GPUs, CPUs, company profiles, startup links, historical releases, benchmark data, and side-by-side comparisons.</p>
      <div class="hero-actions">${compareSlugs ? `<a class="button primary" href="#/compare/${escapeHtml(compareSlugs)}">Compare top devices</a>` : ""}</div>
      <div class="review-signal-row">${deviceSignalCards(experience)}</div>
    </section>
    <section class="content-band review-command-grid">
      <article class="reader-card">
        <span>Directory readiness</span>
        <h2>Structured device intelligence</h2>
        <p>The database covers device records, categories, brand/company profiles, startup links, specs, benchmark rows, comparison pages, and release timelines.</p>
        <div class="readiness-pills">${deviceReadinessPills(experience.readiness || {})}</div>
      </article>
      <article class="reader-card">
        <span>Benchmark index</span>
        <h2>Reusable test families</h2>
        <div class="review-scoring-grid">${(experience.benchmarkFamilies || []).slice(0, 4).map((family) => `<article class="reader-card"><span>${escapeHtml(family.name)}</span><p>${Number(family.deviceCount || 0).toLocaleString()} devices tested${family.topResult ? ` / leader: ${escapeHtml(family.topResult.device)}` : ""}</p></article>`).join("")}</div>
      </article>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Categories</span><h2>Browse the database</h2></div>
      <div class="mini-grid">${deviceTypeCards(experience.types || []) || `<p class="muted">Device categories will appear as products are published.</p>`}</div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>${selectedType ? escapeHtml(selectedType) : "Database"}</span><h2>Featured devices</h2></div>
      <div class="mini-grid">${published.map(deviceCard).join("") || `<p class="muted">No devices are published yet.</p>`}</div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Companies</span><h2>Brand and company profiles</h2></div>
      <div class="mini-grid">${companyProfileCards(experience.companyProfiles || []) || `<p class="muted">Company profiles will appear as brands are added.</p>`}</div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Release history</span><h2>Product timeline</h2></div>
      <div class="mini-grid">${releaseTimelineCards(experience.releaseTimeline || []) || `<p class="muted">Release timeline entries will appear as products are dated.</p>`}</div>
    </section>
  `;
}

async function renderDevice(slug) {
  setTitle("Device", "Device profile from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Devices</span><h1>Loading device</h1><p>Fetching specifications and benchmark data.</p></section>`;
  try {
    const response = await fetch(`/api/devices/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.device) throw new Error(data.message || "Device not found.");
    const device = data.device;
    const compareSlugs = [device.slug, ...devices.filter((item) => item.slug !== device.slug).slice(0, 1).map((item) => item.slug)].join(",");
    setTitle(device.name, device.summary, {
      canonicalUrl: `${location.origin}/#/device/${device.slug}`,
      ogImage: device.imageUrl || "",
      schema: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: device.name,
        brand: { "@type": "Brand", name: device.brand },
        description: device.summary,
        image: device.imageUrl || undefined,
        offers: device.priceUsd ? { "@type": "Offer", price: device.priceUsd, priceCurrency: "USD" } : undefined,
        aggregateRating: device.rating ? { "@type": "AggregateRating", ratingValue: device.rating, bestRating: 10, ratingCount: 1 } : undefined
      }
    });
    app.innerHTML = `
      <article class="device-page">
        <header class="page-hero compact-hero">
          <span>${escapeHtml(device.brand)} / ${escapeHtml(device.deviceType)} / ${device.releaseYear || "Release year TBD"}</span>
          <h1>${escapeHtml(device.name)}</h1>
          <p>${escapeHtml(device.summary)}</p>
          <div class="hero-actions">
            <a class="button primary" href="#/compare/${escapeHtml(compareSlugs)}">Compare</a>
            <a class="button secondary" href="#/devices">All devices</a>
          </div>
          <div class="review-signal-row">
            <article><span>Price</span><strong>${formatDevicePrice(device.priceUsd)}</strong><small>listed price</small></article>
            <article><span>Rating</span><strong>${Number(device.rating || 0).toFixed(1)}</strong><small>out of 10</small></article>
            <article><span>Specs</span><strong>${Number(device.specCount || 0).toLocaleString()}</strong><small>structured rows</small></article>
            <article><span>Tests</span><strong>${Number(device.benchmarkCount || 0).toLocaleString()}</strong><small>benchmarks</small></article>
          </div>
        </header>
        ${device.imageUrl ? `<figure class="article-hero-image"><img ${responsiveImageAttrs(device.imageUrl, device.name, "(max-width: 760px) 100vw, 1100px")}><figcaption>${escapeHtml(device.brand)}</figcaption></figure>` : ""}
        <section class="content-band event-detail">
          <aside class="reader-card">
            <span>${formatDevicePrice(device.priceUsd)}</span>
            <h2>${Number(device.rating || 0).toFixed(1)} / 10</h2>
            <p>Rank score ${Number(device.rankScore || 0)}</p>
            <p>${Number(device.specCount || 0).toLocaleString()} specs / ${Number(device.benchmarkCount || 0).toLocaleString()} tests</p>
          </aside>
          <div class="spec-grid">${(device.specs || []).map((spec) => `<div><span>${escapeHtml(spec.specGroup)} / ${escapeHtml(spec.label)}</span><strong>${escapeHtml(spec.value)}</strong></div>`).join("") || `<p class="muted">No specifications entered yet.</p>`}</div>
        </section>
        <section class="content-band">
          <div class="section-heading"><span>Benchmarks</span><h2>Performance tests</h2></div>
          <table class="review-table"><thead><tr><th>Benchmark</th><th>Score</th><th>Unit</th><th>Note</th></tr></thead><tbody>${(device.benchmarks || []).map((benchmark) => `<tr><td>${escapeHtml(benchmark.benchmarkName)}</td><td>${Number(benchmark.score || 0).toLocaleString()}</td><td>${escapeHtml(benchmark.unit || "")}</td><td>${escapeHtml(benchmark.note || "")}</td></tr>`).join("") || `<tr><td colspan="4">No benchmark data entered yet.</td></tr>`}</tbody></table>
        </section>
      </article>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Devices</span><h1>Device unavailable</h1><p>${escapeHtml(error.message || "This device could not be loaded.")}</p><a class="button primary" href="#/devices">Back to devices</a></section>`;
  }
}

async function renderDeviceComparison(value = "") {
  setTitle("Compare Devices", "Side-by-side device specification and benchmark comparison from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Compare</span><h1>Loading comparison</h1><p>Building spec and benchmark tables.</p></section>`;
  try {
    const experience = await loadDeviceExperience();
    const requestedSlugs = String(value || "").split(",").map((slug) => slug.trim()).filter(Boolean);
    const publicSlugs = (experience.devices?.length ? experience.devices : devices).map((device) => device.slug).filter(Boolean);
    const slugs = [...new Set([...requestedSlugs, ...publicSlugs])].slice(0, 4).join(",");
    const response = await fetch(`/api/devices/compare?slugs=${encodeURIComponent(slugs)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.comparison) throw new Error(data.message || "Comparison unavailable.");
    const comparison = data.comparison;
    app.innerHTML = `
      <section class="page-hero compact-hero">
        <span>Comparison engine</span>
        <h1>Device comparison matrix</h1>
        <p>${comparison.devices.map((device) => escapeHtml(device.name)).join(" vs ")}. Compare normalized specifications, benchmark scores, prices, ratings, and rankings.</p>
      </section>
      <section class="content-band">
        <div class="mini-grid">${comparison.devices.map((device) => `<article class="reader-card"><span>${escapeHtml(device.brand)} / ${escapeHtml(device.deviceType)}</span><h2>${escapeHtml(device.name)}</h2><p>${escapeHtml(device.summary)}</p><small>${formatDevicePrice(device.priceUsd)} / ${Number(device.rating || 0).toFixed(1)} rating</small></article>`).join("")}</div>
      </section>
      <section class="content-band">
        <div class="section-heading"><span>Specifications</span><h2>Side-by-side specs</h2></div>
        <table class="review-table"><thead><tr><th>Spec</th>${comparison.devices.map((device) => `<th>${escapeHtml(device.name)}</th>`).join("")}</tr></thead><tbody>${(comparison.specMatrix || []).map((row) => `<tr><td>${escapeHtml(row.specGroup)} / ${escapeHtml(row.label)}</td>${(row.values || []).map((item) => `<td>${escapeHtml(item.value)}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${comparison.devices.length + 1}">No specs available.</td></tr>`}</tbody></table>
      </section>
      <section class="content-band">
        <div class="section-heading"><span>Benchmarks</span><h2>Performance matrix</h2></div>
        <table class="review-table"><thead><tr><th>Benchmark</th>${comparison.devices.map((device) => `<th>${escapeHtml(device.name)}</th>`).join("")}</tr></thead><tbody>${(comparison.benchmarkMatrix || []).map((row) => `<tr><td>${escapeHtml(row.benchmarkName)}</td>${(row.values || []).map((item) => `<td>${item.score === null ? "-" : `${Number(item.score || 0).toLocaleString()} ${escapeHtml(item.unit || "")}`}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${comparison.devices.length + 1}">No benchmarks available.</td></tr>`}</tbody></table>
      </section>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Compare</span><h1>Comparison unavailable</h1><p>${escapeHtml(error.message || "This comparison could not be loaded.")}</p><a class="button primary" href="#/devices">Back to devices</a></section>`;
  }
}

function money(cents = 0) {
  return Number(cents || 0) > 0 ? `$${(Number(cents || 0) / 100).toFixed(2)}` : "Free";
}

function eventCard(event) {
  return `
    <a class="reader-card event-card" href="#/event/${event.slug}">
      <span>${escapeHtml(event.eventType || "event")} / ${escapeHtml(event.location || "Online")}</span>
      <h2>${escapeHtml(event.title)}</h2>
      <p>${escapeHtml(event.description)}</p>
      <small>${escapeHtml(event.startsAt || "")} / ${money(event.priceCents)} / ${Number(event.registrationCount || 0).toLocaleString()} registered${event.streamUrl ? " / live stream" : ""}</small>
    </a>
  `;
}

function eventSignalCards(experience = {}) {
  const stats = experience.stats || {};
  return [
    ["Events", stats.events || 0, "published programs"],
    ["Speakers", stats.speakers || 0, "profiled guests"],
    ["Agenda", stats.agendaItems || 0, "scheduled sessions"],
    ["Streams", stats.liveStreams || 0, "live links ready"]
  ].map(([label, value, detail]) => `<article><span>${label}</span><strong>${Number(value || 0).toLocaleString()}</strong><small>${detail}</small></article>`).join("");
}

function eventReadinessPills(readiness = {}) {
  return [
    ["Event pages", readiness.eventPagesReady],
    ["Schedules", readiness.conferenceSchedulesReady],
    ["Speakers", readiness.speakerProfilesReady],
    ["Tickets", readiness.ticketSystemReady],
    ["Live coverage", readiness.liveCoverageReady],
    ["Streams", readiness.liveStreamsReady],
    ["RSVP", readiness.rsvpManagementReady],
    ["Agenda", readiness.agendaSystemReady],
    ["Sponsors", readiness.sponsorshipReady],
    ["Virtual", readiness.virtualConferencesReady]
  ].map(([label, ready]) => `<span class="${ready ? "ready" : "pending"}">${label}</span>`).join("");
}

function eventTypeCards(types = []) {
  return types.map((type) => `
    <article class="reader-card review-category-card">
      <span>${escapeHtml(type.type)}</span>
      <h2>${Number(type.count || 0).toLocaleString()} events</h2>
      <p>${Number(type.registrations || 0).toLocaleString()} registrations / ${Number(type.streamReady || 0).toLocaleString()} streams</p>
    </article>
  `).join("");
}

function eventAgendaCards(items = []) {
  return items.slice(0, 6).map((item) => `
    <a class="reader-card timeline-card" href="#/event/${escapeHtml(item.eventSlug)}">
      <span>${escapeHtml(item.track || item.eventType || "session")}</span>
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.eventTitle)} / ${escapeHtml(item.startsAt || "")}</p>
    </a>
  `).join("");
}

function eventSponsorCards(items = []) {
  return items.map((item) => `
    <article class="reader-card">
      <span>${escapeHtml(item.ticketType || "sponsor")}</span>
      <h2>${escapeHtml(item.sponsor)}</h2>
      <p>${escapeHtml(item.eventTitle)} / ${Number(item.registrations || 0).toLocaleString()} registrations / ${item.streamReady ? "stream ready" : "stream pending"}</p>
      <a class="button secondary" href="#/event/${escapeHtml(item.eventSlug)}">Open event</a>
    </article>
  `).join("");
}

async function loadEventExperience() {
  try {
    const response = await fetch("/api/events/experience", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || "Event experience unavailable.");
    conferenceEvents = data.events?.length ? data.events : conferenceEvents;
    return data;
  } catch (error) {
    console.warn("Event experience fallback.", error);
    return { events: conferenceEvents, eventTypes: [], agendaTimeline: [], sponsorDesk: [], readiness: {}, stats: {} };
  }
}

async function renderEvents() {
  setTitle("Events & Conferences", "Technology conferences, webinars, live streams, speaker agendas, and registration from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Events & conferences</span><h1>Loading event desk</h1><p>Preparing schedules, speakers, streams, sponsors, and RSVP status.</p></section>`;
  const experience = await loadEventExperience();
  const events = experience.events?.length ? experience.events : conferenceEvents;
  app.innerHTML = `
    <section class="page-hero compact-hero review-lab-hero">
      <span>Events & conferences</span>
      <h1>Technology events, livestreams, and executive forums</h1>
      <p>Conferences, virtual expos, webinars, live streams, sponsor programs, speaker agendas, RSVP journeys, and event coverage for serious technology audiences.</p>
      <div class="hero-actions">
        ${events[0] ? `<a class="button primary" href="#/event/${escapeHtml(events[0].slug)}">Open next event</a>` : ""}
        <a class="button secondary" href="#/live">Live coverage</a>
      </div>
      <div class="review-signal-row">${eventSignalCards(experience)}</div>
    </section>
    <section class="content-band review-command-grid">
      <article class="reader-card">
        <span>Event readiness</span>
        <h2>Conference system is connected</h2>
        <p>Events include public pages, ticket/RSVP flow, calendar exports, stream links, speaker profiles, agenda systems, sponsor placement, and live coverage paths.</p>
        <div class="readiness-pills">${eventReadinessPills(experience.readiness || {})}</div>
      </article>
      <article class="reader-card">
        <span>Event types</span>
        <h2>Programming mix</h2>
        <div class="review-scoring-grid">${eventTypeCards(experience.eventTypes || [])}</div>
      </article>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Upcoming</span><h2>Featured events</h2></div>
      <div class="mini-grid">${events.map(eventCard).join("") || `<p class="muted">No events are published yet.</p>`}</div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Agenda</span><h2>Conference schedule preview</h2></div>
      <div class="mini-grid">${eventAgendaCards(experience.agendaTimeline || []) || `<p class="muted">Agenda items will appear as sessions are scheduled.</p>`}</div>
    </section>
    <section class="content-band">
      <div class="section-heading"><span>Sponsors</span><h2>Event sponsorships</h2></div>
      <div class="mini-grid">${eventSponsorCards(experience.sponsorDesk || []) || `<p class="muted">Sponsor placements will appear as campaigns are added.</p>`}</div>
    </section>
  `;
}

async function renderEvent(slug) {
  setTitle("Event", "Technology event from Tech Magazine.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Events</span><h1>Loading event</h1><p>Fetching agenda and registration details.</p></section>`;
  try {
    const response = await fetch(`/api/events/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.event) throw new Error(data.message || "Event not found.");
    const event = data.event;
    setTitle(event.title, event.description, {
      canonicalUrl: `${location.origin}/#/event/${event.slug}`,
      ogImage: event.coverImage || "",
      schema: {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.description,
        startDate: event.startsAt,
        endDate: event.endsAt,
        eventAttendanceMode: event.streamUrl ? "https://schema.org/MixedEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: event.venue || event.location, address: event.location },
        offers: { "@type": "Offer", price: Number(event.priceCents || 0) / 100, priceCurrency: "USD", availability: event.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock" }
      }
    });
    app.innerHTML = `
      <article class="event-page">
        <header class="page-hero compact-hero">
          <span>${escapeHtml(event.eventType)} / ${escapeHtml(event.location)}</span>
          <h1>${escapeHtml(event.title)}</h1>
          <p>${escapeHtml(event.description)}</p>
          <div class="hero-actions">
            <button class="button primary" type="button" data-scroll-to-event-register>Register</button>
            ${event.streamUrl ? `<a class="button secondary" href="${escapeHtml(event.streamUrl)}" target="_blank" rel="noreferrer">Live stream</a>` : ""}
            <a class="button ghost" href="/api/events/${escapeHtml(event.slug)}/calendar">Add calendar</a>
          </div>
          <div class="review-signal-row">
            <article><span>Ticket</span><strong>${money(event.priceCents)}</strong><small>${escapeHtml(event.ticketType || "standard")}</small></article>
            <article><span>RSVP</span><strong>${Number(event.registrationCount || 0).toLocaleString()}</strong><small>${event.capacity ? `${Number(event.capacity).toLocaleString()} capacity` : "open capacity"}</small></article>
            <article><span>Speakers</span><strong>${Number((event.speakers || []).length).toLocaleString()}</strong><small>profiles</small></article>
            <article><span>Agenda</span><strong>${Number((event.agenda || []).length).toLocaleString()}</strong><small>sessions</small></article>
          </div>
        </header>
        ${event.coverImage ? `<figure class="article-hero-image"><img ${responsiveImageAttrs(event.coverImage, event.title, "(max-width: 760px) 100vw, 1100px")}><figcaption>${escapeHtml(event.venue || event.location)}</figcaption></figure>` : ""}
        <section class="content-band event-detail">
          <aside class="reader-card">
            <span>${event.soldOut ? "Sold out" : "Registration open"}</span>
            <h2>${money(event.priceCents)}</h2>
            <p>${escapeHtml(event.startsAt)}${event.endsAt ? ` to ${escapeHtml(event.endsAt)}` : ""}</p>
            <p>${Number(event.registrationCount || 0).toLocaleString()} registered${event.capacity ? ` / ${Number(event.capacity).toLocaleString()} capacity` : ""}</p>
            ${event.sponsor ? `<p>Sponsored by ${escapeHtml(event.sponsor)}</p>` : ""}
            ${event.streamUrl ? `<p>Virtual access and stream link ready.</p>` : ""}
          </aside>
          <div class="mini-grid">
            ${(event.speakers || []).map((speaker) => `
              <article class="reader-card">
                ${speaker.avatar ? `<img class="avatar-small" src="${escapeHtml(speaker.avatar)}" alt="${escapeHtml(speaker.name)}">` : ""}
                <span>${escapeHtml(speaker.company || "Speaker")}</span>
                <h2>${escapeHtml(speaker.name)}</h2>
                <p>${escapeHtml(speaker.title || speaker.bio || "")}</p>
              </article>
            `).join("") || `<p class="muted">Speakers will be announced soon.</p>`}
          </div>
        </section>
        <section class="content-band">
          <div class="section-heading"><span>Agenda</span><h2>Program</h2></div>
          <div class="live-feed">
            ${(event.agenda || []).map((item) => `
              <article class="live-update">
                <div class="live-update-meta"><span>${escapeHtml(item.track || "Main stage")}</span><time>${escapeHtml(item.startsAt)}${item.endsAt ? ` - ${escapeHtml(item.endsAt)}` : ""}</time></div>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description || "")}</p>
                ${(item.speakers || []).length ? `<small>${item.speakers.map((speaker) => escapeHtml(speaker.name)).join(", ")}</small>` : ""}
              </article>
            `).join("") || `<p class="muted">Agenda will be published soon.</p>`}
          </div>
        </section>
        <section id="event-register" class="content-band">
          <div class="section-heading"><span>Tickets</span><h2>Register</h2></div>
          <form class="newsletter-card" data-event-registration data-event-slug="${escapeHtml(event.slug)}">
            <label>Name<input name="name" value="${escapeHtml(readerSession.reader?.name || "")}" required></label>
            <label>Email<input type="email" name="email" value="${escapeHtml(readerSession.reader?.email || "")}" required></label>
            <label>Company<input name="company"></label>
            <button class="button primary" type="submit" ${event.soldOut ? "disabled" : ""}>${event.soldOut ? "Sold out" : "Register"}</button>
            <p class="form-message" data-form-message></p>
          </form>
        </section>
      </article>
    `;
  } catch (error) {
    app.innerHTML = `<section class="page-hero compact-hero"><span>Events</span><h1>Event unavailable</h1><p>${escapeHtml(error.message || "This event could not be loaded.")}</p><a class="button primary" href="#/events">Back to events</a></section>`;
  }
}

function companyContactForm(kind = "general", title = "Contact the team", description = "Send the right request to the right desk.") {
  return `
    <form class="company-form" data-company-contact data-company-kind="${escapeHtml(kind)}">
      <div>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(description)}</p>
      </div>
      <div class="form-grid">
        <label>Name<input name="name" required></label>
        <label>Email<input type="email" name="email" required></label>
        <label>Company<input name="company" placeholder="Optional"></label>
        <label>Topic<select name="topic">
          <option value="${escapeHtml(kind)}">${escapeHtml(kind.replace(/-/g, " "))}</option>
          <option value="editorial-tip">Editorial tip</option>
          <option value="correction">Correction</option>
          <option value="advertising">Advertising</option>
          <option value="media-kit">Media kit</option>
          <option value="career">Career</option>
          <option value="privacy">Privacy request</option>
        </select></label>
      </div>
      <label>Message<textarea name="message" rows="5" required placeholder="Tell us what you need."></textarea></label>
      <button class="button primary" type="submit">Send request</button>
      <p class="form-message" data-form-message></p>
    </form>
  `;
}

function trustStrip() {
  return `
    <section class="company-trust-strip">
      <article><strong>Independent editorial</strong><span>Commercial content is labeled and separated from newsroom decisions.</span></article>
      <article><strong>Corrections visible</strong><span>Material updates and corrections are documented for readers.</span></article>
      <article><strong>Named accountability</strong><span>Every story has an author, desk, source context, and contact path.</span></article>
    </section>
  `;
}

function leadershipGrid() {
  return `
    <section class="content-band">
      <div class="section-heading"><span>Editorial team</span><h2>People behind the newsroom</h2></div>
      <div class="company-team-grid">
        ${authors.map((author) => `
          <article class="company-person">
            <img src="${escapeHtml(author.avatar)}" alt="${escapeHtml(author.name)}">
            <span>${escapeHtml(author.role)}</span>
            <h3>${escapeHtml(author.name)}</h3>
            <p>${escapeHtml(author.bio)}</p>
            <a href="#/author/${escapeHtml(author.id)}">View articles</a>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function trustSignalCards(experience) {
  const stats = experience?.credibility?.stats || publicCredibility.stats || {};
  return [
    ["Trust score", `${Number(stats.averageTrustScore || 85).toLocaleString()}/100`, "average article score"],
    ["Verified authors", Number(stats.verifiedAuthors || 0).toLocaleString(), "public accountability"],
    ["Enabled sources", Number(stats.enabledSources || 0).toLocaleString(), "governed imports"],
    ["Consent records", Number(experience?.compliance?.consentEvents?.reduce((sum, row) => sum + Number(row.count || 0), 0) || 0).toLocaleString(), "privacy choices saved"]
  ].map(([label, value, detail]) => `<article><span>${label}</span><strong>${value}</strong><small>${detail}</small></article>`).join("");
}

function privacyChoiceCards(choices = []) {
  return choices.map((choice) => `
    <article class="reader-card privacy-choice-card">
      <span>${escapeHtml(choice.required ? "Required" : "Optional")}</span>
      <h2>${escapeHtml(choice.label)}</h2>
      <p>${escapeHtml(choice.description)}</p>
      <div class="privacy-choice-actions">
        <button class="button secondary" type="button" data-consent-choice="${escapeHtml(choice.key)}" data-consent-value="true" ${choice.required ? "disabled" : ""}>Allow</button>
        <button class="button ghost" type="button" data-consent-choice="${escapeHtml(choice.key)}" data-consent-value="false" ${choice.required ? "disabled" : ""}>Decline</button>
      </div>
    </article>
  `).join("");
}

async function renderTrustCenterExperience() {
  setTitle("Trust Center", "Public proof points, privacy controls, source governance, and compliance posture.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>Trust Center</span><h1>Loading trust and privacy controls</h1><p>Preparing public credibility, consent, and compliance signals.</p></section>`;
  const experience = await loadTrustComplianceExperience();
  const protection = experience?.compliance?.protection || {};
  const source = experience?.sourceGovernance || {};
  app.innerHTML = `
    <section class="page-hero compact-hero trust-hero-pro">
      <span>Trust, privacy, and compliance</span>
      <h1>Proof that the newsroom is accountable</h1>
      <p>See how Tech Magazine handles sourcing, corrections, commercial labels, privacy choices, consent, and security controls.</p>
      <div class="hero-actions">
        <a class="button primary" href="#privacy-controls">Manage privacy</a>
        <a class="button secondary" href="#/editorial">Editorial standards</a>
      </div>
      <div class="trust-signal-row">${trustSignalCards(experience)}</div>
    </section>
    <section class="content-band trust-command-grid">
      ${(experience?.trustModules || []).map((item) => `
        <article class="reader-card trust-module-card">
          <span>${escapeHtml(item.label)}</span>
          <h2>${escapeHtml(item.title)}</h2>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `).join("")}
    </section>
    <section class="content-band trust-operations-grid">
      <article class="reader-card">
        <span>Source governance</span>
        <h2>${Number(source.enabledSources || 0).toLocaleString()} enabled sources</h2>
        <p>${Number(source.pendingInspection || 0).toLocaleString()} imported items pending inspection, ${Number(source.rejected || 0).toLocaleString()} rejected, ${Number(source.duplicateCount || 0).toLocaleString()} duplicates, and ${Number(source.averageRisk || 0).toLocaleString()} average risk score.</p>
      </article>
      <article class="reader-card">
        <span>Security posture</span>
        <h2>${protection.wafEnabled ? "WAF active" : "WAF monitoring"}</h2>
        <p>${escapeHtml(protection.antiSpamMode || "score-and-moderate")} anti-spam mode, ${Number(protection.activeSessions || 0).toLocaleString()} active sessions, ${Number(protection.blockedIps || 0).toLocaleString()} blocked IPs.</p>
      </article>
      <article class="reader-card">
        <span>Rights workflow</span>
        <h2>GDPR-style request path</h2>
        <p>Access, correction, deletion, and consent requests route through the privacy desk and admin outbox for review.</p>
      </article>
    </section>
    <section class="content-band privacy-controls" id="privacy-controls">
      <div class="section-heading"><span>Privacy choices</span><h2>Control how the platform uses your data</h2></div>
      <div class="privacy-choice-grid">${privacyChoiceCards(experience?.privacyChoices || [])}</div>
      <p class="form-message" data-consent-message></p>
    </section>
    <section class="content-band rights-workflow-band">
      <div class="section-heading"><span>Reader rights</span><h2>What a reader can ask the team to do</h2></div>
      <div class="rights-workflow-grid">
        ${(experience?.rightsWorkflow || []).map((item) => `
          <article class="reader-card">
            <span>${escapeHtml(item.label)}</span>
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `).join("")}
      </div>
    </section>
    ${legitimacyPanel()}
    ${companyContactForm("privacy", "Privacy, correction, or trust request", "Ask for account export, deletion, correction, source review, or commercial-label clarification.")}
  `;
}

function policyCards(items = []) {
  return `<div class="policy-card-grid">${items.map((item) => `
    <article>
      <span>${escapeHtml(item.label)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </article>
  `).join("")}</div>`;
}

function renderStaticPage(page) {
  const pageData = {
    about: {
      title: "About Tech Magazine",
      eyebrow: "Company",
      description: "Tech Magazine is a professional technology newsroom covering AI, cybersecurity, cloud, startups, software, hardware, gaming, reviews, and enterprise IT.",
      body: `
        ${trustStrip()}
        ${credibilityBand()}
        <section class="content-band company-story">
          <div>
            <div class="section-heading"><span>Mission</span><h2>Technology coverage for serious readers</h2></div>
            <p>We publish fast news, practical analysis, executive context, product coverage, live event reporting, newsletters, podcasts, videos, reviews, jobs, and community discussions for people who build, buy, secure, and lead technology.</p>
            <p>The platform is designed as a media business, not just a blog: editorial workflows, commercial sponsorships, source controls, audience accounts, analytics, newsletters, and mobile-ready APIs all work together.</p>
          </div>
          <aside class="company-metrics">
            <article><strong>${articles.length.toLocaleString()}+</strong><span>published stories in local inventory</span></article>
            <article><strong>${publicCategories().length}</strong><span>core coverage categories</span></article>
            <article><strong>${authors.length}</strong><span>editorial profiles</span></article>
          </aside>
        </section>
        ${leadershipGrid()}
      `
    },
    "trust-center": {
      title: "Trust Center",
      eyebrow: "Credibility",
      description: "Public proof points, editorial policies, source governance, commercial labeling, and social-proof rules for Tech Magazine.",
      body: `
        ${credibilityBand()}
        ${legitimacyPanel()}
        ${policyCards([
          { label: "Corrections", title: "Visible article updates", body: "Material changes appear inside article trust panels and can be requested through the public correction form." },
          { label: "Sources", title: "Imported news controls", body: "External sources are governed by enablement, priority, trust level, risk score, duplicate rate, exclusions, and inspection routing." },
          { label: "Authors", title: "Named accountability", body: "Author pages show roles, beats, expertise, source method, correction method, and article archives." },
          { label: "Commercial", title: "Clear sponsorship labels", body: "Sponsored stories, ad placements, reports, affiliates, and memberships are separated from editorial conclusions." }
        ])}
        ${companyContactForm("correction", "Challenge or verify a story", "Send a correction request, source concern, missing context, or credibility question.")}
      `
    },
    "editorial-team": {
      title: "Editorial Team",
      eyebrow: "Newsroom",
      description: "Meet the editors and writers responsible for Tech Magazine's public coverage.",
      body: `${leadershipGrid()}${companyContactForm("editorial-tip", "Pitch the newsroom", "Send tips, interview requests, source offers, or embargoed briefings.")}`
    },
    contact: {
      title: "Contact Tech Magazine",
      eyebrow: "Contact",
      description: "Reach the newsroom, advertising team, privacy desk, or business operations from one place.",
      body: `
        <section class="content-band">
          <div class="company-contact-grid">
            <article><span>Newsroom</span><h3>editorial@techmag.local</h3><p>Tips, corrections, interviews, source briefings, and sensitive editorial questions.</p></article>
            <article><span>Advertising</span><h3>ads@techmag.local</h3><p>Media kit, sponsorships, native campaigns, newsletters, events, and brand safety.</p></article>
            <article><span>Support</span><h3>support@techmag.local</h3><p>Account, newsletter, privacy, accessibility, or technical support requests.</p></article>
          </div>
        </section>
        ${companyContactForm("general", "Send a request", "Requests are routed into the email outbox so the team can handle them from admin.")}
      `
    },
    advertise: {
      title: "Advertise With Tech Magazine",
      eyebrow: "Commercial",
      description: "Reach technology decision-makers through labeled, brand-safe sponsorships across articles, newsletters, video, podcasts, events, and reports.",
      body: `
        <section class="content-band">
          <div class="media-kit-grid">
            <article><span>Native sponsorship</span><h3>Sponsored stories</h3><p>Labeled partner stories with approval workflow, analytics, and brand safety controls.</p></article>
            <article><span>Audience growth</span><h3>Newsletter placements</h3><p>Segmented sponsorship slots for AI, cybersecurity, cloud, startup, and enterprise readers.</p></article>
            <article><span>Events</span><h3>Live coverage packages</h3><p>Event sponsorship, speaker profiles, agenda visibility, and post-event report distribution.</p></article>
            <article><span>Performance</span><h3>Ad analytics</h3><p>Impressions, clicks, CPM tracking, campaign performance, and sponsor reporting.</p></article>
          </div>
        </section>
        ${companyContactForm("advertising", "Request advertising options", "Tell us your campaign goal and we will queue the request for the commercial team.")}
      `
    },
    "media-kit": {
      title: "Media Kit",
      eyebrow: "Advertisers",
      description: "A concise overview of Tech Magazine's audience, formats, sponsorship inventory, and commercial standards.",
      body: `
        ${legitimacyPanel()}
        <section class="content-band company-story">
          <div>
            <div class="section-heading"><span>Audience</span><h2>Technology operators and decision-makers</h2></div>
            <p>Tech Magazine is built for readers who evaluate platforms, follow AI and security shifts, compare products, attend events, listen to podcasts, and engage with professional communities.</p>
            <p>Commercial partners can sponsor clearly labeled placements without interfering with editorial judgment.</p>
          </div>
          <aside class="company-metrics">
            <article><strong>News</strong><span>homepage, category, and article sponsorships</span></article>
            <article><strong>Media</strong><span>video, podcast, reports, and newsletters</span></article>
            <article><strong>B2B</strong><span>events, jobs, reviews, and lead generation</span></article>
          </aside>
        </section>
        ${policyCards([
          { label: "Format", title: "Display and native", body: "Banner, in-feed, sidebar, sponsored stories, and native partner cards." },
          { label: "Newsletter", title: "Segmented briefings", body: "Category-based newsletter sponsorships with future open and click tracking." },
          { label: "Reports", title: "Whitepapers", body: "Gated report campaigns connected to subscriber capture and follow-up." },
          { label: "Events", title: "Conference coverage", body: "Sponsorship around live event hubs, speaker profiles, agendas, and recap stories." }
        ])}
        ${companyContactForm("media-kit", "Request the media kit", "Ask for pricing, audience details, available inventory, or custom sponsorship ideas.")}
      `
    },
    careers: {
      title: "Careers",
      eyebrow: "Work with us",
      description: "Tech Magazine needs editors, writers, producers, moderators, analysts, designers, and commercial operators as the platform grows.",
      body: `
        <section class="content-band">
          <div class="media-kit-grid">
            <article><span>Editorial</span><h3>Writers and reporters</h3><p>AI, cybersecurity, cloud, startups, hardware, software, gaming, and enterprise technology beats.</p></article>
            <article><span>Media</span><h3>Video and podcast producers</h3><p>Interviews, explainers, product reviews, live event coverage, and audio shows.</p></article>
            <article><span>Community</span><h3>Moderators and audience editors</h3><p>Forums, comments, notifications, newsletters, and reader trust operations.</p></article>
            <article><span>Business</span><h3>Commercial and partnerships</h3><p>Sponsorships, events, job board, affiliate operations, and media kit support.</p></article>
          </div>
        </section>
        <section class="content-band">
          <div class="section-heading"><span>Open roles</span><h2>Use the job board for active listings</h2></div>
          <p>Public job listings are managed through the platform job board. Internal hiring leads can also be routed to the careers desk.</p>
          <a class="button secondary" href="#/jobs">View job board</a>
        </section>
        ${companyContactForm("career", "Join the talent bench", "Send your profile, beat, portfolio link, or partnership idea.")}
      `
    },
    editorial: {
      title: "Editorial Standards",
      eyebrow: "Trust",
      description: "How Tech Magazine separates editorial judgment, commercial work, corrections, sourcing, AI assistance, and reader accountability.",
      body: `
        ${policyCards([
          { label: "Independence", title: "Editorial decisions", body: "Editors choose coverage based on reader value, public interest, relevance, and evidence." },
          { label: "Labeling", title: "Sponsored content", body: "Commercial material is labeled and handled through separate sponsorship workflows." },
          { label: "Corrections", title: "Visible updates", body: "Material corrections should be attached to stories with clear update labels." },
          { label: "Sources", title: "Attribution", body: "Imported and original reporting should preserve source context, canonical links, and risk review." },
          { label: "AI", title: "Assisted, not autonomous", body: "AI can suggest summaries, tags, SEO, and translations, but editors remain accountable." },
          { label: "Review", title: "Approval workflow", body: "Sensitive or high-impact stories can move through multi-step editorial and legal review." }
        ])}
        ${companyContactForm("correction", "Request a correction", "Send a correction, missing context, source concern, or factual challenge.")}
      `
    },
    ethics: {
      title: "Ethics Policy",
      eyebrow: "Trust",
      description: "The public rules for conflicts of interest, sponsorship labeling, review integrity, privacy, and corrections.",
      body: `
        ${policyCards([
          { label: "Conflicts", title: "Disclose relationships", body: "Writers and editors should disclose meaningful financial, employment, or personal conflicts." },
          { label: "Reviews", title: "Independent verdicts", body: "Product reviews should distinguish hands-on testing, specs, sponsor material, and affiliate links." },
          { label: "Privacy", title: "Minimize harm", body: "Coverage should avoid unnecessary exposure of private individuals or sensitive technical details." },
          { label: "Embargoes", title: "Transparent access", body: "Embargoed briefings do not guarantee positive coverage or placement." },
          { label: "Corrections", title: "Fix the record", body: "Errors should be corrected quickly and visibly when they affect reader understanding." },
          { label: "AI", title: "Human accountability", body: "AI-generated suggestions require human review before publication." }
        ])}
      `
    },
    privacy: {
      title: "Privacy Policy",
      eyebrow: "Reader rights",
      description: "How Tech Magazine handles reader accounts, subscriptions, analytics, notifications, community activity, and data requests.",
      body: `${policyCards([
        { label: "Accounts", title: "Reader profiles", body: "Profiles, saved articles, follows, comments, and preferences are used to personalize the experience." },
        { label: "Newsletters", title: "Email preferences", body: "Subscribers can confirm, segment, and unsubscribe from future email programs." },
        { label: "Analytics", title: "Performance data", body: "Traffic, engagement, search, and content analytics help improve editorial products." },
        { label: "Notifications", title: "Push preferences", body: "Readers control breaking news, category, author, live event, and newsletter notifications." }
      ])}${companyContactForm("privacy", "Privacy request", "Ask for account export, correction, deletion, or data handling details.")}`
    },
    cookies: {
      title: "Cookie Notice",
      eyebrow: "Privacy",
      description: "How Tech Magazine uses essential storage, analytics tools, preferences, and advertising measurement.",
      body: `${policyCards([
        { label: "Essential", title: "Session and security", body: "Login sessions, CSRF protection, reader tokens, and basic app preferences keep the platform usable." },
        { label: "Preferences", title: "Theme and language", body: "Local storage saves dark/light mode, selected language, and reader preferences." },
        { label: "Analytics", title: "Measurement", body: "Google Analytics, Search Console, or Matomo can be connected when production IDs are configured." },
        { label: "Advertising", title: "Campaign reporting", body: "Ad impressions and clicks may be recorded for sponsored inventory and reporting." }
      ])}${companyContactForm("privacy", "Cookie or GDPR request", "Ask about consent, export, deletion, analytics, or advertising measurement.")}`
    },
    terms: {
      title: "Terms of Use",
      eyebrow: "Legal",
      description: "Rules for using Tech Magazine content, reader accounts, community features, job listings, events, and sponsored material.",
      body: `${policyCards([
        { label: "Content", title: "Information and analysis", body: "Editorial content is provided for news, education, analysis, and professional context." },
        { label: "Community", title: "Account responsibility", body: "Readers are responsible for comments, forum posts, profile content, and job applications." },
        { label: "Commercial", title: "Sponsored material", body: "Ads, affiliate links, sponsored stories, and partner reports must be clearly labeled." },
        { label: "Availability", title: "Service changes", body: "Features can change as the platform evolves toward production hosting and third-party integrations." }
      ])}`
    },
    newsletter: {
      title: "Newsletter",
      eyebrow: "Audience",
      description: "Subscribe to focused briefings by topic and frequency.",
      body: newsletterBlock()
    },
    reports: {
      title: "Reports & Whitepapers",
      eyebrow: "Research",
      description: "Research reports and whitepapers use the same audience, SEO, sponsorship, and subscriber infrastructure.",
      body: `${policyCards([
        { label: "Reports", title: "Original research", body: "Enterprise technology reports can be published as gated or open resources." },
        { label: "Lead capture", title: "Subscriber growth", body: "Downloads can connect to newsletter segments and commercial follow-up." },
        { label: "Sponsors", title: "Labeled partnerships", body: "Sponsored research requires clear labeling and editorial review." }
      ])}${companyContactForm("reports", "Discuss a report", "Send an idea for a research report, whitepaper, or sponsored briefing.")}`
    }
  };
  const current = pageData[page] || pageData.about;
  setTitle(current.title, current.description);
  app.innerHTML = `
    <article class="company-page">
      <section class="page-hero compact-hero company-hero">
        <span>${escapeHtml(current.eyebrow || "Tech Magazine")}</span>
        <h1>${escapeHtml(current.title)}</h1>
        <p>${escapeHtml(current.description)}</p>
        <div class="company-page-tabs">
          <a href="#/about">About</a>
          <a href="#/editorial-team">Team</a>
          <a href="#/authors">Authors</a>
          <a href="#/trust-center">Trust Center</a>
          <a href="#/editorial">Standards</a>
          <a href="#/advertise">Advertise</a>
          <a href="#/media-kit">Media Kit</a>
          <a href="#/careers">Careers</a>
          <a href="#/contact">Contact</a>
        </div>
      </section>
      ${current.body || ""}
    </article>
  `;
}

function renderNotFound() {
  setTitle("Page not found", "This page could not be found.");
  app.innerHTML = `<section class="page-hero compact-hero"><span>404</span><h1>Page not found</h1><p>This story may have moved.</p><a class="button primary" href="#/">Back home</a></section>`;
}

function recordAdImpressions() {
  document.querySelectorAll("[data-ad-impression]").forEach((node) => {
    if (node.dataset.adTracked) return;
    node.dataset.adTracked = "true";
    fetch("/api/ads/impression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        placement: node.dataset.adImpression,
        path: window.location.hash || "#/",
        referrer: document.referrer
      })
    }).catch(() => {});
  });
}

function trackRoute(page, value) {
  sendEngagementEvent();
  engagementStartedAt = Date.now();
  engagementMaxScroll = 0;
  engagementArticleSlug = page === "article" ? value : "";
  engagementPath = window.location.hash || "#/";
  const path = window.location.hash || "#/";
  const key = `${page}:${value || ""}:${path}`;
  if (key === lastTrackedRoute) return;
  lastTrackedRoute = key;
  fetch("/api/track", {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    keepalive: true,
    body: JSON.stringify({
      eventType: page === "article" ? "article_view" : "page_view",
      path,
      articleSlug: page === "article" ? value : "",
      referrer: document.referrer,
      deviceType: analyticsDeviceType(),
      viewportWidth: window.innerWidth || 0,
      viewportHeight: window.innerHeight || 0
    })
  }).catch(() => {});
  trackExternalPageView(path, document.title, page === "article" ? value : "");
}

function calculateScrollDepth() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
  const viewport = window.innerHeight || document.documentElement.clientHeight || 0;
  const fullHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, viewport);
  if (fullHeight <= viewport) return 100;
  return Math.min(100, Math.round(((scrollTop + viewport) / fullHeight) * 100));
}

function sendEngagementEvent({ force = false } = {}) {
  const durationSeconds = Math.round((Date.now() - engagementStartedAt) / 1000);
  if (!force && durationSeconds < 5 && engagementMaxScroll < 25) return;
  const payload = {
    eventType: "engagement",
    path: engagementPath,
    articleSlug: engagementArticleSlug,
    referrer: document.referrer,
    durationSeconds,
    scrollDepth: engagementMaxScroll,
    deviceType: analyticsDeviceType(),
    viewportWidth: window.innerWidth || 0,
    viewportHeight: window.innerHeight || 0,
    heatmapX: Math.round(((window.lastAnalyticsClickX || 0) / Math.max(1, window.innerWidth || 1)) * 100),
    heatmapY: Math.round(((window.lastAnalyticsClickY || 0) / Math.max(1, document.documentElement.scrollHeight || 1)) * 100),
    metadata: {
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      deviceType: analyticsDeviceType(),
      title: document.title
    }
  };
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/track", { method: "POST", headers: authHeaders({ "Content-Type": "application/json" }), keepalive: true, body }).catch(() => {});
  }
  engagementStartedAt = Date.now();
  engagementMaxScroll = calculateScrollDepth();
}

function updateReadingProgress() {
  const bar = document.querySelector("[data-reading-progress]");
  if (!bar) return;
  const article = document.querySelector(".article-shell");
  if (!article) {
    bar.style.width = "0%";
    return;
  }
  const rect = article.getBoundingClientRect();
  const viewport = window.innerHeight || document.documentElement.clientHeight || 1;
  const total = Math.max(1, rect.height - viewport);
  const read = Math.min(total, Math.max(0, -rect.top));
  bar.style.width = `${Math.round((read / total) * 100)}%`;
}

function scheduleReadingProgress() {
  if (progressTicking) return;
  progressTicking = true;
  window.requestAnimationFrame(() => {
    progressTicking = false;
    updateReadingProgress();
  });
}

function renderRoute() {
  const [page, value] = routeParts();
  window.clearInterval(heroTimer);
  window.clearInterval(liveTimer);

  if (!page) renderHome();
  else if (page === "article") renderArticle(value);
  else if (page === "category") renderCategory(value);
  else if (page === "section") renderSection(value);
  else if (page === "sections") renderSectionsHub();
  else if (page === "search") renderSearch();
  else if (page === "feed") renderFeed();
  else if (page === "mobile") renderMobileExperience();
  else if (page === "it-rooms" && value) renderItRoom(value);
  else if (page === "it-rooms") renderItRooms();
  else if (page === "authors") renderAuthorsDirectory();
  else if (page === "author") renderAuthor(value);
  else if (page === "account") renderAccount();
  else if (page === "membership") renderMembership();
  else if (page === "advertise") renderAdvertiseExperience();
  else if (page === "leaderboard") renderLeaderboard();
  else if (page === "community" && value) renderCommunityTopic(value);
  else if (page === "community") renderCommunity();
  else if (page === "newsletter") renderNewsletterExperience();
  else if (page === "notifications" || page === "alerts") renderNotifications();
  else if (page === "breaking") renderBreakingNews();
  else if (page === "live" && value) renderLiveEvent(value);
  else if (page === "live") renderLiveEvents();
  else if (page === "event" && value) renderEvent(value);
  else if (page === "events") renderEvents();
  else if (page === "video" && value) renderVideo(value);
  else if (page === "video") renderVideos();
  else if (page === "videos") renderVideos();
  else if (page === "podcast" && value) renderPodcastShow(value);
  else if (page === "podcast") renderPodcasts();
  else if (page === "podcast-episode" && value) renderPodcastEpisode(value);
  else if (page === "podcast-episode") renderPodcasts();
  else if (page === "podcasts") renderPodcasts();
  else if (page === "review" && value) renderReview(value);
  else if (page === "review") renderReviews();
  else if (page === "reviews") renderReviews();
  else if (page === "reviews-compare") renderReviewComparison(value);
  else if (page === "job" && value) renderJob(value);
  else if (page === "job") renderJobs();
  else if (page === "jobs") renderJobs();
  else if (page === "startup" && value) renderStartup(value);
  else if (page === "startup") renderStartups();
  else if (page === "startups") renderStartups();
  else if (page === "device" && value) renderDevice(value);
  else if (page === "device") renderDevices();
  else if (page === "devices") renderDevices();
  else if (page === "compare") renderDeviceComparison(value);
  else if (page === "marketplace") renderDirectory(page);
  else if (page === "trust-center") renderTrustCenterExperience();
  else if (["about", "contact", "privacy", "cookies", "terms", "media-kit", "careers", "editorial", "editorial-team", "ethics", "reports"].includes(page)) renderStaticPage(page);
  else renderNotFound();

  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
  trackRoute(page || "home", value);
  recordAdImpressions();
  updateReadingProgress();
}

document.addEventListener("click", async (event) => {
  window.lastAnalyticsClickX = event.clientX || 0;
  window.lastAnalyticsClickY = (window.scrollY || 0) + (event.clientY || 0);
  const trackable = event.target.closest("a, button, [data-ad-impression], [data-hero-dot], [data-job-card]");
  if (trackable && !trackable.closest(".admin-shell")) {
    fetch("/api/track", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      keepalive: true,
      body: JSON.stringify({
        eventType: "click",
        path: window.location.hash || "#/",
        articleSlug: engagementArticleSlug,
        referrer: document.referrer,
        deviceType: analyticsDeviceType(),
        viewportWidth: window.innerWidth || 0,
        viewportHeight: window.innerHeight || 0,
        heatmapX: Math.round(((event.clientX || 0) / Math.max(1, window.innerWidth || 1)) * 100),
        heatmapY: Math.round((((window.scrollY || 0) + (event.clientY || 0)) / Math.max(1, document.documentElement.scrollHeight || 1)) * 100),
        metadata: {
          label: (trackable.textContent || trackable.getAttribute("aria-label") || "").trim().slice(0, 120),
          tag: trackable.tagName
        }
      })
    }).catch(() => {});
  }
  const routedLink = event.target.closest('a[href^="#/"]');
  if (routedLink) {
    document.querySelectorAll(".mega-menu.open").forEach((menu) => {
      menu.classList.remove("open");
      menu.querySelector("[data-mega-trigger]")?.setAttribute("aria-expanded", "false");
    });
    routedLink.blur();
    nav.classList.remove("open");
  }

  const toggle = event.target.closest("[data-nav-toggle]");
  if (toggle) {
    nav.classList.toggle("open");
    return;
  }

  const megaTrigger = event.target.closest("[data-mega-trigger]");
  if (megaTrigger) {
    const menu = megaTrigger.closest(".mega-menu");
    const expanded = menu?.classList.toggle("open");
    megaTrigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    return;
  }

  const themeToggle = event.target.closest("[data-theme-toggle]");
  if (themeToggle) {
    themeMode = themeMode === "light" ? "dark" : "light";
    localStorage.setItem("tm_theme", themeMode);
    applyTheme();
    renderNav();
    return;
  }

  const loadMore = event.target.closest("[data-load-more-latest]");
  if (loadMore) {
    visibleLatestCount += 6;
    renderHome();
    return;
  }

  const share = event.target.closest("[data-share]");
  if (share) {
    navigator.clipboard?.writeText(window.location.href);
    share.textContent = "Copied";
  }

  const followAuthor = event.target.closest("[data-follow-author]");
  if (followAuthor) {
    if (!readerSession.token) {
      window.location.hash = "#/account";
      return;
    }
    followAuthor.textContent = "Saving...";
    fetch(`/api/authors/${encodeURIComponent(followAuthor.dataset.followAuthor)}/follow`, { method: "POST", headers: authHeaders() })
      .then((response) => response.json())
      .then(async (result) => {
        await loadReaderSession();
        followAuthor.textContent = result.following ? "Following" : "Follow author";
      })
      .catch(() => {
        followAuthor.textContent = "Try again";
      });
  }

  const pollVote = event.target.closest("[data-poll-vote]");
  if (pollVote) {
    fetch(`/api/community/polls/${encodeURIComponent(pollVote.dataset.pollVote)}/vote`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ optionId: pollVote.dataset.optionId })
    })
      .then((response) => response.json())
      .then(async (result) => {
        if (result.polls) communityPolls = result.polls;
        if (readerSession.token) await loadReaderSession();
        const [page, value] = routeParts();
        if (page === "article") renderArticle(value);
        else renderCommunity();
      })
      .catch(() => {});
  }

  const topicVote = event.target.closest("[data-topic-vote]");
  if (topicVote) {
    topicVote.textContent = "Saving...";
    fetch(`/api/community/topics/${encodeURIComponent(topicVote.dataset.topicVote)}/vote`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ vote: topicVote.dataset.vote || 1 })
    })
      .then((response) => response.json())
      .then(async (result) => {
        topicVote.textContent = result.ok ? `Score ${Number(result.score || 0).toLocaleString()}` : "Try again";
        if (readerSession.token) await loadReaderSession();
        await loadSocialEngagement();
      })
      .catch(() => {
        topicVote.textContent = "Try again";
      });
  }

  const mobileRegister = event.target.closest("[data-mobile-register-device]");
  if (mobileRegister) {
    const message = document.querySelector("[data-mobile-message]");
    if (!readerSession.token) {
      window.location.hash = "#/account";
      return;
    }
    mobileRegister.textContent = "Registering...";
    try {
      const response = await fetch("/api/mobile/device", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          installationId: `web-preview-${Date.now()}`,
          platform: "mobile-web",
          appVersion: "0.1.0",
          deviceName: "Web preview device",
          channels: ["breaking", "live", "podcast", "personalized"]
        })
      });
      const result = await response.json();
      if (message) message.textContent = result.message || (response.ok ? "Device registered." : "Could not register device.");
      mobileExperience = null;
      renderMobileExperience();
    } catch {
      if (message) message.textContent = "Could not reach the mobile API.";
      mobileRegister.textContent = "Try again";
    }
  }

  const mobileOffline = event.target.closest("[data-mobile-save-offline]");
  if (mobileOffline) {
    const message = document.querySelector("[data-offline-message]");
    if (!readerSession.token) {
      window.location.hash = "#/account";
      return;
    }
    mobileOffline.textContent = "Saving...";
    try {
      const response = await fetch("/api/mobile/offline", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ itemType: "article", itemSlug: mobileOffline.dataset.mobileSaveOffline })
      });
      const result = await response.json();
      if (message) message.textContent = result.message || (response.ok ? "Saved offline." : "Could not save offline.");
      mobileExperience = null;
      renderMobileExperience();
    } catch {
      if (message) message.textContent = "Could not reach the offline API.";
      mobileOffline.textContent = "Try again";
    }
  }

  const saveCurrentSearch = event.target.closest("[data-save-current-search]");
  if (saveCurrentSearch) {
    if (!readerSession.token) {
      window.location.hash = "#/account";
      return;
    }
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const query = params.get("query") || params.get("category") || params.get("type") || "Discovery search";
    saveCurrentSearch.textContent = "Saving...";
    fetch("/api/search/saved-filters", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        name: `Saved: ${query}`.slice(0, 72),
        query: params.get("query") || "",
        type: params.get("type") || "all",
        category: params.get("category") || "",
        author: params.get("author") || "",
        sort: params.get("sort") || "relevance"
      })
    })
      .then((response) => response.json())
      .then(async (result) => {
        saveCurrentSearch.textContent = result.ok ? "Saved search" : "Try again";
        await loadSavedSearchFilters();
        window.setTimeout(() => renderSearch(), 450);
      })
      .catch(() => {
        saveCurrentSearch.textContent = "Try again";
      });
  }

  const bookmark = event.target.closest("[data-bookmark]");
  if (bookmark) {
    if (!readerSession.token) {
      window.location.hash = "#/account";
      return;
    }
    bookmark.textContent = "Saving...";
    fetch(`/api/bookmarks/${encodeURIComponent(bookmark.dataset.bookmark)}`, { method: "POST", headers: authHeaders() })
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) {
          if (result.bookmarked && !readerSession.bookmarks.includes(bookmark.dataset.bookmark)) readerSession.bookmarks.push(bookmark.dataset.bookmark);
          if (!result.bookmarked) readerSession.bookmarks = readerSession.bookmarks.filter((slug) => slug !== bookmark.dataset.bookmark);
          document.querySelectorAll(`[data-bookmark="${CSS.escape(bookmark.dataset.bookmark)}"]`).forEach((button) => {
            button.textContent = button.classList.contains("bookmark-button")
              ? (result.bookmarked ? "✓ Saved article" : "+ Save article")
              : (result.bookmarked ? "Saved" : "Save");
            button.setAttribute("aria-label", result.bookmarked ? "Article saved" : "Save article");
          });
        } else {
          bookmark.textContent = "Sign in";
        }
      })
      .catch(() => {
        bookmark.textContent = "Try again";
      });
  }

  const vote = event.target.closest("[data-comment-vote]");
  if (vote) {
    fetch("/api/comments/vote", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ commentId: vote.dataset.commentVote, vote: vote.dataset.vote })
    }).then(() => {
      vote.textContent = "Saved";
    }).catch(() => {});
  }

  const report = event.target.closest("[data-comment-report]");
  if (report) {
    fetch("/api/comments/report", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ commentId: report.dataset.commentReport, reason: "Reader report" })
    }).then(() => {
      report.textContent = "Reported";
    }).catch(() => {});
  }

  const aiSummary = event.target.closest("[data-ai-summary]");
  if (aiSummary) {
    const output = aiSummary.closest(".ai-reader-panel")?.querySelector("[data-ai-summary-output]");
    if (output) output.textContent = "Generating...";
    fetch(`/api/ai/articles/${encodeURIComponent(aiSummary.dataset.aiSummary)}`, { method: "POST" })
      .then((response) => response.json())
      .then((result) => {
        if (!output) return;
        output.innerHTML = result.ok ? `<strong>${escapeHtml(result.summary || "")}</strong>${(result.recommendations || []).length ? `<ul>${result.recommendations.map((item) => `<li><a href="#/article/${escapeHtml(item.slug)}">${escapeHtml(item.title)}</a></li>`).join("")}</ul>` : ""}` : escapeHtml(result.message || "Could not generate summary.");
      })
      .catch(() => {
        if (output) output.textContent = "Could not generate summary.";
      });
  }

  const subscribePlan = event.target.closest("[data-subscribe-plan]");
  if (subscribePlan) {
    if (!readerSession.token) {
      window.location.hash = "#/account";
      return;
    }
    subscribePlan.textContent = "Starting...";
    fetch(`/api/memberships/subscribe/${encodeURIComponent(subscribePlan.dataset.subscribePlan)}`, { method: "POST", headers: authHeaders() })
      .then((response) => response.json())
      .then((result) => {
        subscribePlan.textContent = result.ok ? "Active" : "Try again";
        if (result.ok) setTimeout(() => renderMembership(), 300);
      })
      .catch(() => {
        subscribePlan.textContent = "Try again";
      });
  }

  const cancelMembership = event.target.closest("[data-cancel-membership]");
  if (cancelMembership) {
    cancelMembership.textContent = "Canceling...";
    fetch("/api/memberships/cancel", { method: "POST", headers: authHeaders() })
      .then((response) => response.json())
      .then((result) => {
        cancelMembership.textContent = result.ok ? "Canceled" : "Try again";
        if (result.ok) setTimeout(() => renderMembership(), 300);
      })
      .catch(() => {
        cancelMembership.textContent = "Try again";
      });
  }

  const consentChoice = event.target.closest("[data-consent-choice]");
  if (consentChoice) {
    const message = document.querySelector("[data-consent-message]");
    if (message) message.textContent = "Saving privacy choice...";
    fetch("/api/compliance/consent", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        consentType: consentChoice.dataset.consentChoice,
        value: consentChoice.dataset.consentValue === "true",
        metadata: { source: "trust-center" }
      })
    })
      .then((response) => response.json())
      .then((result) => {
        if (message) message.textContent = result.ok ? "Privacy choice saved." : (result.message || "Could not save privacy choice.");
      })
      .catch(() => {
        if (message) message.textContent = "Could not save privacy choice.";
      });
  }

  const fillCategory = event.target.closest("[data-fill-category]");
  if (fillCategory) {
    const input = fillCategory.closest("form")?.querySelector('input[name="favoriteCategories"]');
    if (input) {
      const values = new Set(String(input.value || "").split(",").map((item) => item.trim()).filter(Boolean));
      values.add(fillCategory.dataset.fillCategory);
      input.value = [...values].join(", ");
      input.focus();
    }
  }

  const fillAuthor = event.target.closest("[data-fill-author]");
  if (fillAuthor) {
    const input = fillAuthor.closest("form")?.querySelector('input[name="followedAuthors"]');
    if (input) {
      const values = new Set(String(input.value || "").split(",").map((item) => item.trim()).filter(Boolean));
      values.add(fillAuthor.dataset.fillAuthor);
      input.value = [...values].join(", ");
      input.focus();
    }
  }

  const notificationRead = event.target.closest("[data-notification-read]");
  if (notificationRead) {
    if (!readerSession.token) {
      window.location.hash = "#/account";
      return;
    }
    notificationRead.textContent = "Saving...";
    fetch(`/api/notifications/${encodeURIComponent(notificationRead.dataset.notificationRead)}/read`, { method: "POST", headers: authHeaders() })
      .then((response) => response.json())
      .then(async (result) => {
        notificationRead.textContent = result.ok ? "Read" : "Try again";
        await loadNotifications();
        renderNav();
        renderNotifications();
      })
      .catch(() => {
        notificationRead.textContent = "Try again";
      });
  }

  const enablePush = event.target.closest("[data-enable-push]");
  if (enablePush) {
    const message = enablePush.closest("form")?.querySelector("[data-form-message]");
    connectFirebasePush(message).then(async () => {
      await loadNotifications();
      renderNotifications();
    });
  }

  const logout = event.target.closest("[data-reader-logout]");
  if (logout) {
    fetch("/api/reader/logout", { method: "POST", headers: authHeaders() }).finally(() => {
      localStorage.removeItem("tm_reader_token");
      readerSession = { token: "", reader: null, bookmarks: [], social: { follows: [], reputation: { points: 0, badges: [] }, gamification: null } };
      readerExperience = null;
      notificationPreferences = null;
      loadNotifications().catch(() => {});
      renderNav();
      renderAccount();
    });
  }

  const eventRegisterScroll = event.target.closest("[data-scroll-to-event-register]");
  if (eventRegisterScroll) {
    document.getElementById("event-register")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const jobApplyScroll = event.target.closest("[data-scroll-to-job-apply]");
  if (jobApplyScroll) {
    document.getElementById("job-apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const heroDot = event.target.closest("[data-hero-dot]");
  if (heroDot) {
    const slider = heroDot.closest("[data-hero-slider]");
    const slides = [...slider.querySelectorAll("[data-hero-slide]")];
    const buttons = [...slider.querySelectorAll("[data-hero-dot]")];
    const selected = Number(heroDot.dataset.heroDot || 0);
    slides.forEach((slide, index) => slide.classList.toggle("active", index === selected));
    buttons.forEach((button, index) => {
      button.classList.toggle("active", index === selected);
      button.setAttribute("aria-pressed", index === selected ? "true" : "false");
    });
    slider.dataset.active = String(selected);
    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(() => {
      const next = (Number(slider.dataset.active || 0) + 1) % slides.length;
      buttons[next]?.click();
    }, 6500);
  }
});

document.addEventListener("change", (event) => {
  const languageSwitch = event.target.closest("[data-language-switch]");
  if (!languageSwitch) return;
  currentLanguage = languageSwitch.value || "en";
  localStorage.setItem("tm_language", currentLanguage);
  applyLanguageSettings();
  renderNav();
  renderRoute();
});

document.addEventListener("submit", async (event) => {
  const newsletterForm = event.target.closest("[data-newsletter-form]");
  const commentForm = event.target.closest("[data-comment-form]");
  const searchForm = event.target.closest("[data-search-form]");
  const readerLogin = event.target.closest("[data-reader-login]");
  const readerRegister = event.target.closest("[data-reader-register]");
  const readerProfile = event.target.closest("[data-reader-profile]");
  const communityTopic = event.target.closest("[data-community-topic]");
  const communityReply = event.target.closest("[data-community-reply]");
  const itRoomPost = event.target.closest("[data-it-room-post]");
  const notificationPrefs = event.target.closest("[data-notification-preferences]");
  const liveComment = event.target.closest("[data-live-comment]");
  const eventRegistration = event.target.closest("[data-event-registration]");
  const jobApplication = event.target.closest("[data-job-application]");
  const jobAlert = event.target.closest("[data-job-alert]");
  const jobFilters = event.target.closest("[data-job-filters]");
  const companyContact = event.target.closest("[data-company-contact]");
  const voiceSearchForm = event.target.closest("[data-voice-search-form]");
  const newsletterUnsubscribe = event.target.closest("[data-newsletter-unsubscribe]");

  if (searchForm) {
    event.preventDefault();
    const form = new FormData(searchForm);
    const params = new URLSearchParams();
    ["query", "type", "category", "tag", "author", "dateFrom", "dateTo", "sort"].forEach((key) => {
      if (form.get(key)) params.set(key, form.get(key));
    });
    window.location.hash = `#/search?${params.toString()}`;
    return;
  }

  if (jobFilters) {
    event.preventDefault();
    const form = new FormData(jobFilters);
    const keyword = String(form.get("keyword") || "").trim().toLowerCase();
    const remote = String(form.get("remote") || "").trim();
    const type = String(form.get("type") || "").trim();
    const cards = [...document.querySelectorAll("[data-job-card]")];
    let visible = 0;
    cards.forEach((card) => {
      const matchesKeyword = !keyword || `${card.dataset.title || ""} ${card.dataset.company || ""}`.includes(keyword);
      const matchesRemote = !remote || card.dataset.remote === remote;
      const matchesType = !type || card.dataset.type === type;
      const show = matchesKeyword && matchesRemote && matchesType;
      card.hidden = !show;
      if (show) visible += 1;
    });
    const message = document.querySelector("[data-job-filter-message]");
    if (message) message.textContent = `${visible.toLocaleString()} matching roles.`;
    return;
  }

  if (voiceSearchForm) {
    event.preventDefault();
    const message = voiceSearchForm.querySelector("[data-form-message]");
    const form = new FormData(voiceSearchForm);
    const transcript = String(form.get("transcript") || "").trim();
    if (!transcript) {
      if (message) message.textContent = "Enter a transcript first.";
      return;
    }
    if (message) message.textContent = "Interpreting...";
    try {
      const response = await fetch("/api/search/voice", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ transcript, type: "all", deviceType: "web" })
      });
      const result = await response.json();
      if (message) message.textContent = result.ok ? "Opening interpreted results..." : result.message || "Could not interpret search.";
      if (result.ok) window.location.hash = `#/search?query=${encodeURIComponent(result.interpretation?.query || transcript)}&type=all&sort=relevance`;
    } catch {
      if (message) message.textContent = "Could not reach the search engine.";
    }
    return;
  }

  if (newsletterForm || commentForm) {
    event.preventDefault();
    const activeForm = newsletterForm || commentForm;
    const message = activeForm.querySelector("[data-form-message]");
    const endpoint = newsletterForm ? "/api/newsletter" : "/api/comments";
    const payload = Object.fromEntries(new FormData(activeForm));

    if (message) message.textContent = "Saving...";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: commentForm ? authHeaders({ "Content-Type": "application/json" }) : { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (message) message.textContent = result.message || (response.ok ? "Saved." : "Could not save.");
      if (response.ok) activeForm.reset();
    } catch {
      if (message) message.textContent = "Could not reach the server.";
    }
  }

  if (newsletterUnsubscribe) {
    event.preventDefault();
    const message = newsletterUnsubscribe.querySelector("[data-form-message]");
    const payload = Object.fromEntries(new FormData(newsletterUnsubscribe));
    if (message) message.textContent = "Updating preference...";
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (message) message.textContent = result.message || (response.ok ? "Preference updated." : "Could not update preference.");
      if (result.ok) await loadNewsletterExperience();
    } catch {
      if (message) message.textContent = "Could not reach the newsletter preference center.";
    }
    return;
  }

  if (companyContact) {
    event.preventDefault();
    const message = companyContact.querySelector("[data-form-message]");
    const payload = Object.fromEntries(new FormData(companyContact));
    payload.kind = companyContact.dataset.companyKind || payload.topic || "general";
    if (message) message.textContent = "Sending...";
    try {
      const response = await fetch("/api/company/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (message) message.textContent = result.message || (response.ok ? "Sent." : "Could not send.");
      if (response.ok) companyContact.reset();
    } catch {
      if (message) message.textContent = "Could not reach the server.";
    }
  }

  if (readerLogin || readerRegister || readerProfile) {
    event.preventDefault();
    const activeForm = readerLogin || readerRegister || readerProfile;
    const message = activeForm.querySelector("[data-form-message]");
    const endpoint = readerLogin ? "/api/reader/login" : readerRegister ? "/api/reader/register" : "/api/reader/profile";
    if (message) message.textContent = "Saving...";
    try {
      const formData = new FormData(activeForm);
      const payload = Object.fromEntries(formData);
      if (readerProfile) {
        payload.preferredCategories = formData.getAll("preferredCategories");
        payload.preferredAuthors = formData.getAll("preferredAuthors");
      }
      const { response, data: result } = await fetchJsonWithRetry(endpoint, {
        method: "POST",
        headers: readerProfile ? authHeaders({ "Content-Type": "application/json" }) : { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (result.token) saveReaderSession(result);
      if (result.reader) readerSession.reader = result.reader;
      readerExperience = null;
      if (message) message.textContent = result.message || (response.ok ? "Saved." : "Could not save.");
      await loadReaderSession();
      renderNav();
      renderAccount();
    } catch {
      if (message) message.textContent = "Could not reach the server.";
    }
  }

  if (communityTopic) {
    event.preventDefault();
    const message = communityTopic.querySelector("[data-form-message]");
    if (!readerSession.token) {
      if (message) message.textContent = "Sign in first.";
      window.location.hash = "#/account";
      return;
    }
    if (message) message.textContent = "Posting...";
    try {
      const response = await fetch("/api/community/topics", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(Object.fromEntries(new FormData(communityTopic)))
      });
      const result = await response.json();
      if (message) message.textContent = result.message || (response.ok ? "Posted." : "Could not post.");
      if (response.ok) {
        communityTopic.reset();
        const latest = await fetch("/api/community/topics").then((r) => r.json());
        communityTopics = latest.topics || communityTopics;
        await loadReaderSession();
        renderCommunity();
      }
    } catch {
      if (message) message.textContent = "Could not reach the server.";
    }
  }

  if (communityReply) {
    event.preventDefault();
    const message = communityReply.querySelector("[data-form-message]");
    if (!readerSession.token) {
      if (message) message.textContent = "Sign in first.";
      window.location.hash = "#/account";
      return;
    }
    if (message) message.textContent = "Posting...";
    try {
      const response = await fetch(`/api/community/topics/${encodeURIComponent(communityReply.dataset.communityReply)}/replies`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(Object.fromEntries(new FormData(communityReply)))
      });
      const result = await response.json();
      if (message) message.textContent = result.message || (response.ok ? "Reply posted." : "Could not post.");
      if (response.ok) {
        await loadReaderSession();
        renderCommunityTopic(routeParts()[1]);
      }
    } catch {
      if (message) message.textContent = "Could not reach the server.";
    }
  }

  if (itRoomPost) {
    event.preventDefault();
    const message = itRoomPost.querySelector("[data-form-message]");
    if (!readerSession.token) {
      if (message) message.textContent = "Sign in first.";
      window.location.hash = "#/account";
      return;
    }
    if (message) message.textContent = "Publishing...";
    try {
      const response = await fetch(`/api/it-rooms/${encodeURIComponent(itRoomPost.dataset.itRoomPost)}/posts`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(Object.fromEntries(new FormData(itRoomPost)))
      });
      const result = await response.json();
      if (message) message.textContent = result.message || (response.ok ? "Post published." : "Could not publish.");
      if (response.ok) {
        itRoomPost.reset();
        await loadReaderSession();
        renderItRoom(itRoomPost.dataset.itRoomPost);
      }
    } catch {
      if (message) message.textContent = "Could not reach the server.";
    }
  }

  if (notificationPrefs) {
    event.preventDefault();
    const message = notificationPrefs.querySelector("[data-form-message]");
    if (!readerSession.token) {
      window.location.hash = "#/account";
      return;
    }
    const form = new FormData(notificationPrefs);
    const payload = {
      breaking: form.has("breaking"),
      newsletters: form.has("newsletters"),
      liveEvents: form.has("liveEvents"),
      favoriteCategories: form.get("favoriteCategories") || "",
      followedAuthors: form.get("followedAuthors") || "",
      pushEnabled: Boolean(notificationPreferences?.pushEnabled),
      deviceToken: notificationPreferences?.deviceToken || ""
    };
    if (message) message.textContent = "Saving...";
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.preferences) notificationPreferences = result.preferences;
      if (message) message.textContent = result.message || (response.ok ? "Saved." : "Could not save.");
    } catch {
      if (message) message.textContent = "Could not reach the server.";
    }
  }

  if (liveComment) {
    event.preventDefault();
    const message = liveComment.querySelector("[data-form-message]");
    if (message) message.textContent = "Posting...";
    try {
      const response = await fetch(`/api/live-events/${encodeURIComponent(liveComment.dataset.liveSlug)}/comments`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(Object.fromEntries(new FormData(liveComment)))
      });
      const result = await response.json();
      if (message) message.textContent = result.message || (response.ok ? "Posted." : "Could not post.");
      if (response.ok) {
        liveComment.reset();
        renderLiveEvent(liveComment.dataset.liveSlug);
      }
    } catch {
      if (message) message.textContent = "Could not reach the server.";
    }
  }

  if (eventRegistration) {
    event.preventDefault();
    const message = eventRegistration.querySelector("[data-form-message]");
    if (message) message.textContent = "Registering...";
    try {
      const response = await fetch(`/api/events/${encodeURIComponent(eventRegistration.dataset.eventSlug)}/register`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(Object.fromEntries(new FormData(eventRegistration)))
      });
      const result = await response.json();
      if (message) message.textContent = result.message || (response.ok ? "Registered." : "Could not register.");
      if (response.ok) {
        const latest = await fetch("/api/events", { cache: "no-store" }).then((r) => r.json());
        conferenceEvents = latest.events || conferenceEvents;
      }
    } catch {
      if (message) message.textContent = "Could not reach the server.";
    }
  }

  if (jobApplication) {
    event.preventDefault();
    const message = jobApplication.querySelector("[data-form-message]");
    if (message) message.textContent = "Submitting...";
    try {
      const response = await fetch(`/api/jobs/${encodeURIComponent(jobApplication.dataset.jobSlug)}/apply`, {
        method: "POST",
        headers: authHeaders(),
        body: new FormData(jobApplication)
      });
      const result = await response.json();
      if (message) {
        const score = result.application?.matchScore;
        message.textContent = result.message || (response.ok ? `Application submitted${Number.isFinite(score) ? ` / match ${score}%` : ""}.` : "Could not submit.");
      }
      if (response.ok) {
        const latest = await fetch("/api/jobs", { cache: "no-store" }).then((r) => r.json());
        jobPosts = latest.jobs || jobPosts;
        jobApplication.reset();
      }
    } catch {
      if (message) message.textContent = "Could not reach the server.";
    }
  }

  if (jobAlert) {
    event.preventDefault();
    const message = jobAlert.querySelector("[data-form-message]");
    if (message) message.textContent = "Saving alert...";
    try {
      const response = await fetch("/api/jobs/alerts", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(Object.fromEntries(new FormData(jobAlert)))
      });
      const result = await response.json();
      if (message) message.textContent = result.message || (response.ok ? "Job alert saved." : "Could not save alert.");
      if (response.ok) jobAlert.reset();
    } catch {
      if (message) message.textContent = "Could not reach the server.";
    }
  }
});

window.addEventListener("hashchange", renderRoute);
window.addEventListener("scroll", () => {
  engagementMaxScroll = Math.max(engagementMaxScroll, calculateScrollDepth());
  scheduleReadingProgress();
}, { passive: true });
window.addEventListener("resize", scheduleReadingProgress, { passive: true });
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") sendEngagementEvent({ force: true });
});
window.addEventListener("pagehide", () => sendEngagementEvent({ force: true }));
await loadBootstrap();
await loadReaderSession();
await loadNotifications();
applyTheme();
renderNav();
renderRoute();
