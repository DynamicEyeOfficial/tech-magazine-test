import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { database, initDatabase } from "../db.js";

initDatabase();

const rows = database
  .prepare(
    "SELECT type, name, tbl_name, sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type, name"
  )
  .all();

function normalizeSql(sql) {
  return sql
    .replaceAll("DEFAULT CURRENT_TIMESTAMP", "DEFAULT now()")
    .replace(/\bTEXT\s+NOT NULL\s+DEFAULT\s+now\(\)/g, "timestamptz NOT NULL DEFAULT now()")
    .replace(/\bTEXT\s+DEFAULT\s+now\(\)/g, "timestamptz DEFAULT now()")
    .replace(/\bINTEGER PRIMARY KEY\b/g, "integer PRIMARY KEY")
    .replace(/\bREAL\b/g, "numeric")
    .replace(/,\s*\)/g, "\n)")
    .trim();
}

const tableSql = rows
  .filter((row) => row.type === "table")
  .map((row) => normalizeSql(row.sql).replace(/^CREATE TABLE/i, "CREATE TABLE IF NOT EXISTS"));

const indexSql = rows
  .filter((row) => row.type === "index")
  .map((row) => normalizeSql(row.sql).replace(/^CREATE INDEX/i, "CREATE INDEX IF NOT EXISTS").replace(/^CREATE UNIQUE INDEX/i, "CREATE UNIQUE INDEX IF NOT EXISTS"));

const content = [
  "-- Generated from the live SQLite schema for migration planning.",
  "-- Review data types and foreign keys before running against production PostgreSQL.",
  "CREATE EXTENSION IF NOT EXISTS pgcrypto;",
  "",
  ...tableSql.map((sql) => `${sql};\n`),
  ...indexSql.map((sql) => `${sql};\n`)
].join("\n");

const target = join("database", "postgres", "schema.generated.sql");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, content);
console.log(target);
