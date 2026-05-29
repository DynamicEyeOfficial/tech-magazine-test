import { existsSync, readFileSync, statSync } from "node:fs";
import { Socket } from "node:net";
import { config } from "./config.js";

const supportedClients = ["sqlite", "postgres"];

export function parsePostgresUrl(value = config.postgresUrl) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return {
      protocol: url.protocol.replace(":", ""),
      host: url.hostname,
      port: Number.parseInt(url.port || "5432", 10),
      database: url.pathname.replace(/^\//, ""),
      username: decodeURIComponent(url.username || ""),
      ssl: url.searchParams.get("sslmode") === "require" || url.searchParams.get("ssl") === "true"
    };
  } catch {
    return null;
  }
}

function fileStatus(path) {
  if (!existsSync(path)) return { exists: false, sizeBytes: 0 };
  const stats = statSync(path);
  return { exists: true, sizeBytes: stats.size };
}

function packageDependency(name) {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    return pkg.dependencies?.[name] || pkg.devDependencies?.[name] || "";
  } catch {
    return "";
  }
}

export function getDatabaseRuntimeStatus() {
  const requestedClient = String(config.databaseClient || "sqlite").toLowerCase();
  const postgres = parsePostgresUrl();
  const sqliteFile = fileStatus(config.databasePath);
  const generatedSchema = fileStatus("database/postgres/schema.generated.sql");
  const starterSchema = fileStatus("database/postgres/schema.sql");
  const adapterFile = fileStatus("postgres-adapter.js");
  const rehearsalScript = fileStatus("scripts/postgres-migration-rehearsal.js");
  const pgDependency = packageDependency("pg");
  return {
    requestedClient,
    activeClient: "sqlite",
    supportedClients,
    runtimeReady: requestedClient === "sqlite",
    switchoverReady: false,
    sqlite: {
      path: config.databasePath,
      exists: sqliteFile.exists,
      sizeBytes: sqliteFile.sizeBytes
    },
    postgres: {
      configured: Boolean(config.postgresUrl),
      urlValid: Boolean(postgres),
      host: postgres?.host || "",
      port: postgres?.port || 5432,
      database: postgres?.database || "",
      username: postgres?.username || "",
      ssl: Boolean(postgres?.ssl),
      adapterImplemented: adapterFile.exists,
      driverDependency: pgDependency,
      driverDeclared: Boolean(pgDependency),
      rehearsalScript: rehearsalScript.exists,
      schemaGenerated: generatedSchema.exists,
      schemaSizeBytes: generatedSchema.sizeBytes,
      starterSchema: starterSchema.exists
    },
    blockers: [
      requestedClient !== "sqlite" ? "Live runtime switchover still requires a successful PostgreSQL smoke run." : "",
      !adapterFile.exists ? "PostgreSQL adapter file is missing." : "",
      !pgDependency ? "PostgreSQL driver dependency pg is not declared." : "",
      !rehearsalScript.exists ? "PostgreSQL migration rehearsal script is missing." : "",
      !generatedSchema.exists ? "Generate database/postgres/schema.generated.sql before migration." : "",
      requestedClient === "postgres" && !postgres ? "POSTGRES_URL is missing or invalid." : ""
    ].filter(Boolean),
    nextSteps: [
      "Keep DATABASE_CLIENT=sqlite for production until adapter testing is complete.",
      "Run npm run db:schema:postgres after schema changes.",
      "Run npm run db:export:postgres before migration rehearsal.",
      "Provision PostgreSQL and set POSTGRES_URL only during migration rehearsal.",
      "Run POSTGRES_REHEARSAL_CONFIRM=true POSTGRES_IMPORT_JSON=<export> npm run db:postgres:rehearse.",
      "Run the full smoke suite against PostgreSQL before switchover."
    ]
  };
}

export function assertRuntimeCanStart() {
  const status = getDatabaseRuntimeStatus();
  if (!supportedClients.includes(status.requestedClient)) {
    throw new Error(`Unsupported DATABASE_CLIENT=${status.requestedClient}. Use sqlite or postgres.`);
  }
  if (status.requestedClient === "postgres") {
    throw new Error("DATABASE_CLIENT=postgres is not enabled for live runtime yet. Keep DATABASE_CLIENT=sqlite until migration rehearsal and the PostgreSQL smoke suite pass.");
  }
}

export function checkPostgresTcpConnection({ timeoutMs = 3000 } = {}) {
  const parsed = parsePostgresUrl();
  return new Promise((resolve) => {
    if (!parsed) {
      resolve({ ok: false, message: "POSTGRES_URL is missing or invalid." });
      return;
    }
    const socket = new Socket();
    let finished = false;
    function done(result) {
      if (finished) return;
      finished = true;
      socket.destroy();
      resolve(result);
    }
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => done({ ok: true, message: `TCP connection opened to ${parsed.host}:${parsed.port}.` }));
    socket.once("timeout", () => done({ ok: false, message: `Timed out connecting to ${parsed.host}:${parsed.port}.` }));
    socket.once("error", (error) => done({ ok: false, message: error.message }));
    socket.connect(parsed.port, parsed.host);
  });
}
