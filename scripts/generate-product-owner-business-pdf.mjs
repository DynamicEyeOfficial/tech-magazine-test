import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/joegh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright");

const root = process.cwd();
const htmlPath = path.join(root, "TECH_MAGAZINE_USER_STORY_BUSINESS_MODEL.html");
const pdfPath = path.join(root, "TECH_MAGAZINE_USER_STORY_BUSINESS_MODEL.pdf");
const qaDir = path.join(root, "qa", "product-owner-pdf");
const logoPath = path.join(root, "public", "assets", "logo.png").replaceAll("\\", "/");

const today = new Date().toISOString().slice(0, 10);

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function table(headers, rows) {
  return `
    <table>
      <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
}

function page(title, body, eyebrow = "Tech Magazine") {
  return `
    <section class="page">
      <header class="page-head">
        <div><span>${esc(eyebrow)}</span><h2>${esc(title)}</h2></div>
        <img src="file:///${logoPath}" alt="Tech Magazine logo">
      </header>
      <main>${body}</main>
      <footer>Tech Magazine - Business User Story and Platform Vision - ${today}</footer>
    </section>
  `;
}

const audienceRows = [
  ["Visitors", "Browse technology news, search topics, read articles, share stories, and subscribe to newsletters.", "Build traffic, brand awareness, search visibility, and advertising inventory."],
  ["Registered readers", "Save articles, manage profiles, follow authors, comment, vote, receive alerts, and personalize content.", "Increase retention, collect first-party audience insight, and grow community value."],
  ["Subscribers and members", "Access member experiences, premium newsletters, saved content, alerts, and future exclusive benefits.", "Create recurring revenue and stronger reader loyalty."],
  ["Reporters and writers", "Draft articles, add media, submit work, collaborate with editors, and track performance.", "Increase publishing speed while keeping editorial quality under control."],
  ["Editors and chief editors", "Review content, approve stories, manage homepage priorities, handle breaking news, and guide newsroom output.", "Protect brand quality and maintain a reliable publishing operation."],
  ["Administrators", "Manage users, roles, settings, analytics, monetization, operations, source controls, and platform governance.", "Keep the business scalable, secure, and operationally controlled."],
  ["Sponsors and advertisers", "Run sponsored stories, campaigns, ad placements, newsletter sponsorships, and future media packages.", "Generate commercial revenue from trusted technology audiences."],
  ["Recruiters and event partners", "Promote jobs, companies, conferences, agendas, speakers, registrations, and sponsorships.", "Open new revenue lines beyond traditional news publishing."]
];

const businessRows = [
  ["Advertising", "Banner, sidebar, in-feed, native, and video placements.", "Baseline media revenue from traffic."],
  ["Sponsored content", "Brand stories, reports, campaigns, newsletters, and video sponsorships.", "Higher-value commercial inventory."],
  ["Affiliate revenue", "Product reviews and buying guides can include tracked product links.", "Monetizes high-intent review traffic."],
  ["Memberships", "Free, Premium, and VIP models can unlock premium content or benefits.", "Recurring revenue and loyal audience base."],
  ["Newsletters", "Segmented digests and alerts can carry sponsorships and drive repeat visits.", "Owns the audience relationship outside social platforms."],
  ["Events", "Virtual or physical conferences, sponsor packages, registration, and live coverage.", "Turns the publication into an industry platform."],
  ["Job board", "Recruiters can pay for roles, employer profiles, and featured placements.", "Fits naturally with a technology audience."],
  ["Reports", "Whitepapers, sponsored research, gated reports, and lead generation.", "Creates enterprise-focused revenue opportunities."],
  ["Syndication", "Selected feeds and partner access can be offered through platform APIs.", "Expands reach and supports partnerships."]
];

const metricRows = [
  ["Audience", "Visitors, returning readers, signups, saved articles, followed authors, notification opt-ins."],
  ["Content", "Published articles, views, read completion, shares, comments, top authors, top categories."],
  ["Newsletter", "Subscribers, open rates, click rates, unsubscribes, segment growth."],
  ["Community", "Topics, replies, votes, reports, active readers, reputation points."],
  ["Revenue", "Ad impressions, sponsor performance, affiliate clicks, members, events, job board results."],
  ["Newsroom", "Drafts, approvals, assignments, publish speed, author performance, productivity."],
  ["Quality", "Rejected imports, pending inspections, duplicate rate, source risk score, moderation outcomes."]
];

const acceptance = [
  "A reader can understand the publication purpose within the first screen.",
  "A reader can browse, search, read, save, share, comment, and subscribe without confusion.",
  "An editor can create, review, schedule, publish, and manage content with clear workflow states.",
  "An admin can manage users, roles, content, media, newsletters, notifications, analytics, and operations.",
  "Imported news is controlled by source rules, risk inspection, duplicate handling, and editorial approval.",
  "The public client and admin dashboard remain clearly separated.",
  "The platform feels credible enough for a real technology media brand.",
  "Remaining work is clearly understood as production setup, provider configuration, content strategy, or future enhancement."
];

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tech Magazine - Business User Story and Platform Vision</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #e8f2f4;
      color: #12242b;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.45;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 17mm 16mm 14mm;
      background: #ffffff;
      page-break-after: always;
      position: relative;
      overflow: hidden;
    }
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      background:
        radial-gradient(circle at 80% 12%, rgba(72,226,154,.18), transparent 24%),
        radial-gradient(circle at 5% 90%, rgba(98,214,255,.2), transparent 24%),
        #ffffff;
    }
    .cover img { width: 92px; height: 92px; margin: 0 auto 24px; }
    .cover h1 { font-size: 42px; margin: 0 0 8px; letter-spacing: 0; color: #071014; }
    .cover h2 { font-size: 20px; margin: 0 0 20px; color: #0c4658; }
    .cover p { max-width: 640px; margin: 0 auto 12px; font-size: 15px; color: #43545b; }
    .quote {
      margin: 30px auto 0;
      padding: 16px 18px;
      max-width: 660px;
      border: 1px solid #62d6ff;
      background: #ebfbfa;
      border-radius: 10px;
      font-weight: 700;
      color: #071014;
    }
    .page-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      padding-bottom: 10px;
      border-bottom: 2px solid #d9e8eb;
      margin-bottom: 14px;
    }
    .page-head img { width: 42px; height: 42px; flex: 0 0 auto; }
    .page-head span {
      display: block;
      color: #0e9ec1;
      text-transform: uppercase;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: .08em;
      margin-bottom: 3px;
    }
    h2 { font-size: 24px; line-height: 1.15; margin: 0; color: #071014; }
    h3 { font-size: 15px; margin: 14px 0 6px; color: #0c4658; }
    p { font-size: 11px; margin: 0 0 8px; }
    ul { margin: 5px 0 10px 18px; padding: 0; }
    li { font-size: 10.5px; margin: 0 0 5px; padding-left: 2px; }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      align-items: start;
    }
    .card {
      padding: 11px;
      border: 1px solid #d5e4e8;
      border-radius: 10px;
      background: #f8fcfd;
    }
    .card h3 { margin-top: 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      margin: 8px 0 12px;
      font-size: 9px;
    }
    th, td {
      border: 1px solid #cddde1;
      padding: 7px;
      vertical-align: top;
      overflow-wrap: anywhere;
      word-break: normal;
      hyphens: auto;
    }
    th {
      background: #071014;
      color: #ffffff;
      text-align: left;
      font-size: 9.2px;
    }
    tr:nth-child(even) td { background: #f5fafb; }
    .pill-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 8px;
    }
    .pill {
      border: 1px solid #cbdde2;
      border-left: 4px solid #48e29a;
      border-radius: 8px;
      padding: 8px;
      background: #f9fcfd;
      font-size: 10px;
      font-weight: 700;
    }
    footer {
      position: absolute;
      left: 16mm;
      right: 16mm;
      bottom: 8mm;
      padding-top: 6px;
      border-top: 1px solid #d9e8eb;
      color: #70828a;
      font-size: 8px;
    }
    @media print {
      body { background: #fff; }
      .page { margin: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  <section class="page cover">
    <img src="file:///${logoPath}" alt="Tech Magazine logo">
    <h1>Tech Magazine</h1>
    <h2>Complete Business User Story and Platform Vision</h2>
    <p>A stakeholder-ready description of the product, target users, business model, editorial workflows, audience strategy, and product-owner validation scope.</p>
    <p>Prepared for product-owner review - ${today}</p>
    <div class="quote">Tech Magazine is designed to become a scalable technology media business: a newsroom, audience platform, media network, community hub, and commercial ecosystem in one product.</div>
  </section>

  ${page("Executive Product Story", `
    <p>Tech Magazine is a professional technology media platform created for a modern digital newsroom. It helps a media business publish trusted technology coverage, grow an audience, manage editorial operations, and build revenue through advertising, sponsorship, memberships, events, newsletters, jobs, and premium content.</p>
    <p>The product is not only a website. It is a business platform that connects readers, editors, reporters, sponsors, recruiters, event organizers, and future mobile-app users around high-quality technology content.</p>
    <h3>Business Vision</h3>
    ${list([
      "Become a recognizable technology publication with daily editorial output.",
      "Build recurring audience habits through newsletters, notifications, personalized feeds, and mobile experiences.",
      "Create multiple revenue streams without depending only on banner advertising.",
      "Support a professional newsroom workflow from idea to review to publication.",
      "Grow into a global platform with multiple languages, media formats, communities, and events."
    ])}
    <h3>Positioning</h3>
    <div class="pill-grid">
      <div class="pill">Technology media brand</div>
      <div class="pill">Digital newsroom</div>
      <div class="pill">Audience growth engine</div>
      <div class="pill">Community platform</div>
      <div class="pill">Video and podcast network</div>
      <div class="pill">Commercial ecosystem</div>
    </div>
  `)}

  ${page("Target Audiences", `
    <p>The platform serves multiple audiences. Each audience has a different journey, but all journeys support the same business goal: turning technology coverage into a scalable media company.</p>
    ${table(["Audience", "What They Need", "Business Value"], audienceRows)}
  `)}

  ${page("Core User Stories", `
    <div class="two-col">
      <div class="card">
        <h3>Reader Stories</h3>
        ${list([
          "As a visitor, I want to browse the latest technology news so I can stay informed quickly.",
          "As a reader, I want to search by topic, author, category, popularity, and date so I can find relevant coverage.",
          "As a reader, I want to save articles so I can return to them later.",
          "As a reader, I want to follow authors and topics so my feed becomes more relevant.",
          "As a community member, I want to comment, reply, vote, and participate in polls so I can engage with other readers."
        ])}
      </div>
      <div class="card">
        <h3>Newsroom Stories</h3>
        ${list([
          "As a reporter, I want to draft stories, upload media, and submit articles for review.",
          "As a writer, I want tools for formatting, SEO, tags, and related content so my work is polished before review.",
          "As an editor, I want to review, reject, approve, schedule, and publish content with clear status tracking.",
          "As a chief editor, I want to manage urgent coverage, final approvals, homepage priorities, and editorial planning.",
          "As a newsroom team, we want assignments, internal notes, calendar planning, and live coverage support."
        ])}
      </div>
    </div>
    <h3>Business Stories</h3>
    ${list([
      "As an administrator, I want to manage roles and permissions so every team member has the correct access.",
      "As a sponsor, I want branded content and ad placements that feel natural inside the magazine experience.",
      "As a recruiter, I want job posts and applications so the platform can support technology hiring.",
      "As an event partner, I want event pages, agenda, speakers, registration, and live coverage.",
      "As the business owner, I want analytics and revenue reporting so decisions are based on performance."
    ])}
  `)}

  ${page("Public Website Experience", `
    <p>The public website is the reader-facing product. It should feel premium, fast, editorial, and easy to scan. The reader should immediately understand that this is a technology publication with serious coverage and multiple content formats.</p>
    <div class="two-col">
      <div>${["Homepage with featured stories, breaking news, trending content, latest articles, sponsored sections, live updates, and personalized recommendations.", "Article pages with author, category, reading time, hero image, sharing, tags, related content, comments, and SEO-ready presentation.", "Search and discovery across articles, videos, podcasts, authors, reviews, devices, categories, and tags.", "Reader accounts with profile, bookmarks, followed authors, notifications, comments, and community features."].map((x) => `<div class="card"><p>${esc(x)}</p></div>`).join("")}</div>
      <div>${["Community discussions, replies, reactions, polls, voting, badges, and leaderboard features.", "Media network with video, podcasts, reviews, live events, devices, startups, jobs, and events.", "Mobile-ready experience with future support for alerts, offline reading, personalized feeds, and app widgets.", "Multi-language and accessibility direction so the platform can expand internationally."].map((x) => `<div class="card"><p>${esc(x)}</p></div>`).join("")}</div>
    </div>
  `)}

  ${page("Editorial and CMS Experience", `
    <p>The editorial dashboard supports the internal team. It helps writers and editors move from idea to published content in a controlled, organized way.</p>
    ${list([
      "Create, edit, duplicate, archive, delete, restore, and schedule articles.",
      "Use draft, review, approval, scheduled, published, rejected, and archived statuses.",
      "Manage categories, tags, authors, featured images, media embeds, and SEO fields.",
      "Support revision history, rollback concepts, editorial notes, and article performance visibility.",
      "Give editors control over homepage placement, featured stories, breaking news, and live coverage.",
      "Allow source-controlled news importing while preventing low-quality or risky stories from going straight to readers."
    ])}
    <h3>Workflow Areas</h3>
    ${table(["Workflow Area", "User Story"], [
      ["Assignments", "As an editor, I want to assign stories to reporters with priorities and deadlines."],
      ["Approvals", "As a chief editor, I want sensitive or important stories to pass through review before publishing."],
      ["Calendar", "As a newsroom manager, I want to see scheduled stories, campaigns, events, and deadlines."],
      ["Internal notes", "As an editor, I want to leave feedback directly on editorial work."],
      ["Live coverage", "As a reporter, I want to post real-time updates during conferences, launches, and breaking events."],
      ["Productivity", "As leadership, I want visibility into output, completed work, and editorial performance."]
    ])}
  `)}

  ${page("Content Formats and Expansion Areas", `
    ${list([
      "Articles and news briefs for daily publishing.",
      "Video content for product reviews, explainers, interviews, and event coverage.",
      "Podcast channels and episodes for audio audiences.",
      "Product reviews with ratings, pros and cons, specifications, benchmarks, and verdicts.",
      "Device database for phones, laptops, chips, hardware, and comparisons.",
      "Startup directory with profiles, founders, funding, sectors, and rankings.",
      "Events and conferences with speakers, agenda, registration, sponsors, and live streams.",
      "Job board with recruiter visibility, applications, job alerts, and matching concepts.",
      "Community forums, polls, voting, reputation, and user engagement systems."
    ])}
    <h3>Audience Growth and Retention</h3>
    ${list([
      "Newsletter subscription and segmentation turn anonymous visitors into reachable audiences.",
      "Notifications support breaking news, live events, followed authors, and personalized recommendations.",
      "Bookmarks and saved content give readers a reason to create accounts.",
      "Community features create participation instead of passive reading only.",
      "Personalized feeds and recommendations improve relevance over time.",
      "Mobile app readiness supports future offline reading, push alerts, widgets, and voice playback."
    ])}
  `)}

  ${page("Business Model", `
    <p>The platform is designed to support multiple revenue streams. Payment collection is intentionally not active in the current test version. The business model is prepared conceptually and operationally, while real payment providers can be connected later.</p>
    ${table(["Revenue Stream", "How It Works", "Why It Matters"], businessRows)}
  `)}

  ${page("Source Governance and Editorial Trust", `
    <p>A technology media platform must protect credibility. The news import system is designed so outside sources can support discovery and newsroom monitoring without removing editorial control.</p>
    ${list([
      "Editors can enable or disable sources.",
      "Each source can have a priority and trust level.",
      "Low-quality or promotional terms can be excluded.",
      "Risky stories can be routed to inspection before publication.",
      "Duplicates are controlled so the site does not fill with repeated items.",
      "Source performance can be reviewed through imported, rejected, pending, duplicate, and risk metrics."
    ])}
    <h3>Administration and Governance</h3>
    ${list([
      "Full admins manage platform settings, users, roles, security, operations, and business systems.",
      "Editors manage content, moderation, publishing, homepage placement, and workflow.",
      "Writers and reporters focus on creating and submitting content.",
      "Moderators manage comments, reports, spam, and community quality.",
      "Audit logs and operational dashboards help leadership understand what happened inside the platform."
    ])}
  `)}

  ${page("Success Metrics", `
    <p>The product owner should judge success through both user value and business value.</p>
    ${table(["Area", "Example Metrics"], metricRows)}
    <h3>Product Owner Acceptance Criteria</h3>
    ${list(acceptance)}
  `)}

  ${page("Product Owner Testing Scope", `
    <p>The product owner should test the platform as a business user. The goal is to judge whether the product supports the company vision and daily operations.</p>
    ${list([
      "Test the public reader journey from homepage to article to account creation.",
      "Test the admin journey from login to article creation and publication.",
      "Test user and role management.",
      "Test news importing and inspection behavior.",
      "Test media, video, podcast, reviews, events, jobs, startups, devices, and community areas.",
      "Test whether business modules make sense for future monetization.",
      "Report issues as launch blockers, major improvements, normal improvements, or nice-to-have items."
    ])}
    <h3>Issue Severity</h3>
    ${table(["Severity", "Meaning"], [
      ["P0", "Blocks testing or launch."],
      ["P1", "Major business or user issue."],
      ["P2", "Important improvement."],
      ["P3", "Nice-to-have enhancement."]
    ])}
  `)}

  ${page("Roadmap and Final Business Summary", `
    ${table(["Stage", "Business Focus"], [
      ["Current working platform", "Core public site, admin CMS, editorial workflow, reader accounts, search, news import, media modules, and business expansion areas."],
      ["Staging approval", "Product-owner QA, content review, user-flow corrections, role validation, and launch checklist completion."],
      ["Production launch", "Domain, server, email, analytics, push, backups, monitoring, security, and production credentials."],
      ["Audience growth", "Newsletter campaigns, SEO growth, source partnerships, social distribution, content calendar, and reader retention."],
      ["Revenue growth", "Sponsored packages, ad sales, affiliate review strategy, job board, events, memberships, and reports."],
      ["Global expansion", "Mobile apps, multilingual editions, podcasts, video network, community, events, and partner distribution."]
    ])}
    <p>Tech Magazine is positioned as a technology media company platform. It brings together publishing, editorial workflow, audience growth, monetization, community, media, and operational control.</p>
    <p>The next business decision is not whether the platform has a website. It does. The next decision is whether the stakeholder team approves the product direction, validates the user flows, and prepares the external production services needed for a reliable public launch.</p>
  `)}
</body>
</html>`;

await fs.mkdir(qaDir, { recursive: true });
await fs.writeFile(htmlPath, html, "utf8");

const browser = await chromium.launch({ headless: true });
const pageInstance = await browser.newPage({ viewport: { width: 1100, height: 1500 }, deviceScaleFactor: 1 });
await pageInstance.goto(`file:///${htmlPath.replaceAll("\\", "/")}`);
await pageInstance.emulateMedia({ media: "print" });

const qa = await pageInstance.evaluate(() => {
  const pages = [...document.querySelectorAll(".page")];
  const overflows = [];
  for (const page of pages) {
    const pageIndex = pages.indexOf(page) + 1;
    const descendants = [page, ...page.querySelectorAll("*")];
    for (const element of descendants) {
      if (element.scrollWidth > element.clientWidth + 2) {
        overflows.push({
          page: pageIndex,
          tag: element.tagName,
          className: element.className,
          text: element.textContent.trim().slice(0, 90),
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth
        });
      }
    }
  }
  return {
    pageCount: pages.length,
    bodyOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    overflows
  };
});

if (qa.bodyOverflow || qa.overflows.length) {
  console.error(JSON.stringify(qa, null, 2));
  await browser.close();
  process.exit(1);
}

await pageInstance.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" }
});

for (const index of [0, 2, 7, 10]) {
  await pageInstance.locator(".page").nth(index).screenshot({ path: path.join(qaDir, `page-${index + 1}.png`) });
}

await browser.close();
await fs.writeFile(path.join(qaDir, "qa-result.json"), JSON.stringify({ ok: true, ...qa, pdfPath, htmlPath }, null, 2));
console.log(JSON.stringify({ ok: true, ...qa, pdfPath, htmlPath, qaDir }, null, 2));
