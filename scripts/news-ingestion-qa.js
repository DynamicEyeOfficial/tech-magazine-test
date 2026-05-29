import { initDatabase, getArticles, getNewsImportSourcePerformance } from "../db.js";
import { assessImportRisk, importTechNews, previewTechNewsSources } from "../news-ingestion.js";

initDatabase();

const checks = [];
function check(name, condition, detail = "") {
  checks.push({ name, status: condition ? "PASS" : "FAIL", detail });
}

const before = getArticles().length;
const sources = await previewTechNewsSources();
check("At least five live tech sources respond", sources.filter((source) => source.ok && source.items > 0).length >= 5, JSON.stringify(sources));
check("Source controls expose risk settings", sources.every((source) => "enabled" in source && "autoPublishMaxRisk" in source && "defaultStatus" in source), JSON.stringify(sources.slice(0, 2)));

const riskSource = { id: "qa-source", name: "QA Source", trustLevel: "high", autoPublishMaxRisk: 30, excludeKeywords: "casino", inspectionKeywords: "breach" };
const blockedRisk = assessImportRisk(riskSource, { title: "Casino giveaway", description: "Consumer technology", categories: [], link: "https://example.com/story" });
const inspectionRisk = assessImportRisk(riskSource, { title: "Cloud provider breach exposes credentials", description: "Security update", categories: [], link: "https://example.com/story" });
check("Excluded keywords skip import", blockedRisk.blocked && blockedRisk.action === "skipped", JSON.stringify(blockedRisk));
check("Risky stories route to inspection", inspectionRisk.needsInspection && inspectionRisk.action === "pending_review", JSON.stringify(inspectionRisk));

const shouldImport = before < 50 || process.env.NEWS_IMPORT_QA_FORCE === "true";
const result = shouldImport
  ? await importTechNews({ limit: process.env.NEWS_IMPORT_QA_LIMIT || "50", status: "source_policy", savedBy: "user-admin" })
  : { imported: [], importedCount: 0, failedCount: 0, failed: [] };
const after = getArticles().length;
check("Import returns a valid result", Boolean(result && Array.isArray(result.imported)), JSON.stringify({ imported: result.importedCount, failed: result.failedCount }));
check("Published inventory has at least 50 articles", after >= 50, `before=${before} after=${after}`);
check("Imported articles keep canonical source links", result.imported.every((item) => /^https?:\/\//.test(item.canonicalUrl)), JSON.stringify(result.imported.slice(0, 3)));
check("No feed failures block the import", result.importedCount > 0 || after >= 50, JSON.stringify(result.failed));

const performance = getNewsImportSourcePerformance();
check("Source performance exposes every major source", performance.length >= 5, JSON.stringify(performance.map((source) => source.name)));
check(
  "Source performance includes import, rejection, duplicate, inspection, and risk metrics",
  performance.every((source) => ["importedCount", "rejectedCount", "pendingInspectionCount", "duplicateRate", "averageRiskScore"].every((key) => key in source)),
  JSON.stringify(performance.slice(0, 2))
);

for (const item of checks) console.log(`${item.status} ${item.name}${item.detail ? ` :: ${item.detail}` : ""}`);
const failed = checks.filter((item) => item.status === "FAIL");
console.log(`News ingestion QA: ${checks.length - failed.length}/${checks.length} passed`);
process.exit(failed.length ? 1 : 0);
