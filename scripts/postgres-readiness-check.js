import { existsSync, readFileSync } from "node:fs";
import { checkPostgresTcpConnection, getDatabaseRuntimeStatus } from "../database-runtime.js";

const status = getDatabaseRuntimeStatus();

console.log(`Requested database client: ${status.requestedClient}`);
console.log(`Active runtime client: ${status.activeClient}`);
console.log(`SQLite database: ${status.sqlite.path} (${status.sqlite.exists ? `${status.sqlite.sizeBytes} bytes` : "missing"})`);
console.log(`PostgreSQL configured: ${status.postgres.configured ? "yes" : "no"}`);
console.log(`PostgreSQL URL valid: ${status.postgres.urlValid ? "yes" : "no"}`);
console.log(`PostgreSQL adapter file: ${status.postgres.adapterImplemented ? "yes" : "no"}`);
console.log(`PostgreSQL driver declared: ${status.postgres.driverDeclared ? status.postgres.driverDependency : "no"}`);
console.log(`Migration rehearsal script: ${status.postgres.rehearsalScript ? "yes" : "no"}`);
console.log(`Generated schema: ${status.postgres.schemaGenerated ? `${status.postgres.schemaSizeBytes} bytes` : "missing"}`);

if (existsSync("database/postgres/schema.generated.sql")) {
  const schema = readFileSync("database/postgres/schema.generated.sql", "utf8");
  const tableCount = (schema.match(/CREATE TABLE IF NOT EXISTS/g) || []).length;
  console.log(`Generated table count: ${tableCount}`);
  if (tableCount < 80) status.blockers.push(`Generated schema only has ${tableCount} tables.`);
}

if (process.env.POSTGRES_CHECK_NETWORK === "true") {
  const tcp = await checkPostgresTcpConnection();
  console.log(`PostgreSQL TCP check: ${tcp.ok ? "pass" : "fail"} - ${tcp.message}`);
  if (!tcp.ok) status.blockers.push(tcp.message);
}

if (status.blockers.length) {
  console.log("\nBlockers:");
  for (const blocker of status.blockers) console.log(`- ${blocker}`);
}

console.log("\nNext steps:");
for (const step of status.nextSteps) console.log(`- ${step}`);

if (status.requestedClient === "postgres" || status.blockers.some((item) => item.includes("schema"))) {
  process.exit(status.blockers.length ? 1 : 0);
}

console.log("\nPostgreSQL migration package is prepared, but live runtime remains SQLite by design.");
