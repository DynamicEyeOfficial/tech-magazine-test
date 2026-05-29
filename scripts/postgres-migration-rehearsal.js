import { existsSync, readFileSync } from "node:fs";
import { config } from "../config.js";
import { applyPostgresSchema, createPostgresClient, importPostgresJson } from "../postgres-adapter.js";

if (process.env.POSTGRES_REHEARSAL_CONFIRM !== "true") {
  console.error("Refusing to touch PostgreSQL without POSTGRES_REHEARSAL_CONFIRM=true.");
  process.exit(1);
}

if (!config.postgresUrl) {
  console.error("POSTGRES_URL is required for migration rehearsal.");
  process.exit(1);
}

const exportPath = process.env.POSTGRES_IMPORT_JSON || "";
if (!exportPath || !existsSync(exportPath)) {
  console.error("Set POSTGRES_IMPORT_JSON to a file created by npm run db:export:postgres.");
  process.exit(1);
}

const schemaName = process.env.POSTGRES_REHEARSAL_SCHEMA || `tm_rehearsal_${Date.now()}`;
const client = await createPostgresClient();

function quoteIdent(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

try {
  await client.query("BEGIN");
  await client.query(`CREATE SCHEMA IF NOT EXISTS ${quoteIdent(schemaName)}`);
  await client.query(`SET search_path TO ${quoteIdent(schemaName)}`);
  await applyPostgresSchema(client);
  const exportData = JSON.parse(readFileSync(exportPath, "utf8"));
  const result = await importPostgresJson(client, exportData);
  const tableCount = await client.query("SELECT COUNT(*)::int AS count FROM information_schema.tables WHERE table_schema = $1", [schemaName]);
  await client.query("COMMIT");
  console.log(JSON.stringify({
    ok: true,
    schemaName,
    importedTables: result.tableCount,
    insertedRows: result.insertedRows,
    postgresTables: tableCount.rows[0]?.count || 0
  }, null, 2));
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
