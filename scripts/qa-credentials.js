import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function readEnvFile() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return {};
  return Object.fromEntries(
    readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^["']|["']$/g, "")];
      })
  );
}

function readLocalCredentials() {
  const credentialPath = resolve(process.cwd(), ".qa-admin-credentials.json");
  if (!existsSync(credentialPath)) return {};
  try {
    return JSON.parse(readFileSync(credentialPath, "utf8"));
  } catch {
    return {};
  }
}

export function getQaAdminCredentials() {
  const env = readEnvFile();
  const local = readLocalCredentials();
  const email = process.env.QA_ADMIN_EMAIL || env.QA_ADMIN_EMAIL || local.admin?.email || "admin@techmag.local";
  const password = process.env.QA_ADMIN_PASSWORD || env.QA_ADMIN_PASSWORD || local.admin?.password || "";
  if (!password) throw new Error("QA admin password is not configured. Set QA_ADMIN_PASSWORD or .qa-admin-credentials.json.");
  return { email, password };
}

export function hasKnownCredentialLeak(text) {
  const oldPasswordMarkers = ["admin", "editor", "reporter"].map((name) => `${name}123`);
  const markers = ["admin@techmag.local", ...oldPasswordMarkers];
  return markers.some((marker) => String(text || "").toLowerCase().includes(marker.toLowerCase()));
}

export function hasSecretTokenLeak(text) {
  return /\bsk-(?:proj|live|test)?-[A-Za-z0-9_-]{12,}/i.test(String(text || ""));
}
