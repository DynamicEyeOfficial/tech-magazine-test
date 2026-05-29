import { config } from "./config.js";

function escapeAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function scriptJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function getAnalyticsIntegrationStatus() {
  return {
    googleAnalytics: {
      enabled: Boolean(config.googleAnalyticsId),
      id: config.googleAnalyticsId,
      mode: config.googleAnalyticsId ? "ga4" : "not_configured"
    },
    googleTagManager: {
      enabled: Boolean(config.googleTagManagerId),
      id: config.googleTagManagerId,
      mode: config.googleTagManagerId ? "gtm" : "not_configured"
    },
    searchConsole: {
      enabled: Boolean(config.searchConsoleVerification),
      verification: config.searchConsoleVerification ? "configured" : "not_configured"
    },
    matomo: {
      enabled: Boolean(config.matomoUrl && config.matomoSiteId),
      url: config.matomoUrl,
      siteId: config.matomoSiteId
    },
    activeProviders: [
      config.googleAnalyticsId ? "Google Analytics" : "",
      config.googleTagManagerId ? "Google Tag Manager" : "",
      config.searchConsoleVerification ? "Search Console" : "",
      config.matomoUrl && config.matomoSiteId ? "Matomo" : ""
    ].filter(Boolean)
  };
}

export function analyticsHeadMarkup() {
  const parts = [];

  if (config.searchConsoleVerification) {
    parts.push(`<meta name="google-site-verification" content="${escapeAttr(config.searchConsoleVerification)}">`);
  }

  if (config.googleTagManagerId) {
    parts.push(`<script data-gtm-loader>window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});</script>`);
    parts.push(`<script async data-gtm-loader src="https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.googleTagManagerId)}"></script>`);
  }

  if (config.googleAnalyticsId) {
    parts.push(`<script async data-ga-loader src="https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.googleAnalyticsId)}"></script>`);
    parts.push(`<script data-ga-loader>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${scriptJson(config.googleAnalyticsId)},{send_page_view:false});</script>`);
  }

  if (config.matomoUrl && config.matomoSiteId) {
    const matomoUrl = config.matomoUrl.replace(/\/$/, "");
    parts.push(`<script data-matomo-loader>window._paq=window._paq||[];window._paq.push(['enableLinkTracking']);window._paq.push(['setTrackerUrl',${scriptJson(`${matomoUrl}/matomo.php`)}]);window._paq.push(['setSiteId',${scriptJson(config.matomoSiteId)}]);</script>`);
    parts.push(`<script async data-matomo-loader src="${escapeAttr(`${matomoUrl}/matomo.js`)}"></script>`);
  }

  return parts.join("\n  ");
}

export function analyticsBodyMarkup() {
  if (!config.googleTagManagerId) return "";
  return `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${escapeAttr(config.googleTagManagerId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
}

export function injectAnalyticsIntoHtml(html) {
  const head = analyticsHeadMarkup();
  const body = analyticsBodyMarkup();
  let output = String(html);
  if (head && !output.includes("data-ga-loader") && !output.includes("data-matomo-loader") && !output.includes("data-gtm-loader")) {
    output = output.replace("</head>", `  ${head}\n</head>`);
  }
  if (body && !output.includes("googletagmanager.com/ns.html")) {
    output = output.replace("<body>", `<body>\n  ${body}`);
  }
  return output;
}
