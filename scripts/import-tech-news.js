import { initDatabase } from "../db.js";
import { importTechNews, previewTechNewsSources } from "../news-ingestion.js";

initDatabase();

const args = new Map(process.argv.slice(2).map((item) => {
  const [key, ...rest] = item.replace(/^--/, "").split("=");
  return [key, rest.join("=") || "true"];
}));

if (args.has("preview")) {
  const sources = await previewTechNewsSources();
  console.log(JSON.stringify({ ok: true, sources }, null, 2));
  process.exit(0);
}

const limit = args.get("limit") || process.env.NEWS_IMPORT_LIMIT || "50";
const status = args.get("status") || process.env.NEWS_IMPORT_STATUS || "source_policy";
const result = await importTechNews({ limit, status, savedBy: "user-admin" });
console.log(JSON.stringify(result, null, 2));
process.exit(result.importedCount > 0 || result.publishedCount >= Number(limit) ? 0 : 1);
