import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { database } from "../db.js";

const tables = database
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  .all()
  .map((row) => row.name);

function quoteIdent(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

const exportData = {
  exportedAt: new Date().toISOString(),
  source: "sqlite",
  target: "postgres",
  tableOrder: tables,
  tables: Object.fromEntries(tables.map((table) => [table, database.prepare(`SELECT * FROM ${quoteIdent(table)}`).all()]))
};

mkdirSync("backups", { recursive: true });
const target = join("backups", `postgres-import-${Date.now()}.json`);
writeFileSync(target, JSON.stringify(exportData, null, 2));
console.log(target);
