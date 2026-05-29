import { createSign } from "node:crypto";
import { config } from "./config.js";

function base64Url(input) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function serviceAccount() {
  if (config.firebaseServiceAccountJson) {
    try {
      const parsed = JSON.parse(config.firebaseServiceAccountJson);
      return {
        projectId: parsed.project_id || config.firebaseProjectId,
        clientEmail: parsed.client_email,
        privateKey: String(parsed.private_key || "").replace(/\\n/g, "\n")
      };
    } catch {
      return null;
    }
  }
  if (config.firebaseClientEmail && config.firebasePrivateKey) {
    return {
      projectId: config.firebaseProjectId,
      clientEmail: config.firebaseClientEmail,
      privateKey: config.firebasePrivateKey
    };
  }
  return null;
}

async function getAccessToken(account) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: account.clientEmail,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };
  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claim))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(account.privateKey, "base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const jwt = `${unsigned}.${signature}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Firebase token ${response.status}: ${body}`);
  return JSON.parse(body).access_token;
}

export function getPushProviderStatus() {
  const account = serviceAccount();
  return {
    provider: "firebase",
    projectId: config.firebaseProjectId,
    browserPushReady: Boolean(config.firebaseProjectId && config.firebaseVapidKey),
    serverPushReady: Boolean(account?.clientEmail && account?.privateKey && account?.projectId),
    missing: account ? [] : ["FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY"]
  };
}

export async function sendFirebasePush({ token, title, body, linkUrl = "", type = "general", priority = 0 }) {
  const account = serviceAccount();
  if (!account?.clientEmail || !account?.privateKey || !account?.projectId) {
    throw new Error("Firebase service account credentials are not configured.");
  }
  const accessToken = await getAccessToken(account);
  const response = await fetch(`https://fcm.googleapis.com/v1/projects/${encodeURIComponent(account.projectId)}/messages:send`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      message: {
        token,
        notification: { title, body },
        data: {
          linkUrl: String(linkUrl || ""),
          type: String(type || "general"),
          priority: String(priority || 0)
        },
        webpush: linkUrl ? { fcm_options: { link: linkUrl } } : undefined
      }
    })
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Firebase push ${response.status}: ${text}`);
  const json = text ? JSON.parse(text) : {};
  return { providerMessageId: json.name || "" };
}
