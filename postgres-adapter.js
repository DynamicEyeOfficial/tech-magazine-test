import { readFileSync } from "node:fs";
import { config } from "./config.js";

export async function loadPgClient() {
  try {
    const pg = await import("pg");
    return pg.default?.Client || pg.Client;
  } catch (error) {
    const message = error?.code === "ERR_MODULE_NOT_FOUND"
      ? "PostgreSQL driver is not installed. Run npm install in the deployment environment."
      : error.message;
    throw new Error(message);
  }
}

export async function createPostgresClient({ connectionString = config.postgresUrl } = {}) {
  if (!connectionString) throw new Error("POSTGRES_URL is required.");
  const Client = await loadPgClient();
  const client = new Client({
    connectionString,
    ssl: connectionString.includes("sslmode=require") || connectionString.includes("ssl=true")
      ? { rejectUnauthorized: false }
      : undefined
  });
  await client.connect();
  return client;
}

export function splitPostgresStatements(sql) {
  const statements = [];
  let current = "";
  let quote = "";
  let dollarTag = "";
  for (let index = 0; index < sql.length; index += 1) {
    const char = sql[index];
    const next = sql[index + 1] || "";
    current += char;
    if (dollarTag) {
      if (current.endsWith(dollarTag)) dollarTag = "";
      continue;
    }
    if (quote) {
      if (char === quote && sql[index - 1] !== "\\") quote = "";
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (char === "$") {
      const match = sql.slice(index).match(/^\$[A-Za-z0-9_]*\$/);
      if (match) dollarTag = match[0];
      continue;
    }
    if (char === "-" && next === "-") {
      const lineEnd = sql.indexOf("\n", index + 2);
      if (lineEnd === -1) break;
      current += sql.slice(index + 1, lineEnd + 1);
      index = lineEnd;
      continue;
    }
    if (char === ";") {
      const statement = current.trim();
      if (statement) statements.push(statement);
      current = "";
    }
  }
  const tail = current.trim();
  if (tail) statements.push(tail);
  return statements;
}

export function quotePostgresIdentifier(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export async function applyPostgresSchema(client, schemaPath = "database/postgres/schema.generated.sql") {
  const sql = readFileSync(schemaPath, "utf8");
  for (const statement of splitPostgresStatements(sql)) {
    await client.query(statement);
  }
}

export async function importPostgresJson(client, exportData) {
  const tableOrder = exportData.tableOrder || Object.keys(exportData.tables || {});
  let insertedRows = 0;
  for (const table of tableOrder) {
    const rows = exportData.tables?.[table] || [];
    if (!rows.length) continue;
    for (const row of rows) {
      const columns = Object.keys(row);
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
      const sql = `INSERT INTO ${quotePostgresIdentifier(table)} (${columns.map(quotePostgresIdentifier).join(", ")}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
      await client.query(sql, columns.map((column) => row[column]));
      insertedRows += 1;
    }
  }
  return { insertedRows, tableCount: tableOrder.length };
}
