import { createHash, createHmac } from "node:crypto";
import { config } from "./config.js";

function parseAddress(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(.*?)\s*<([^>]+)>$/);
  if (match) return { name: match[1].trim().replace(/^"|"$/g, ""), email: match[2].trim() };
  return { email: text };
}

function requireValue(value, label) {
  if (!value) throw new Error(`${label} is required for ${config.emailProvider} email delivery.`);
  return value;
}

function provider() {
  return String(config.emailProvider || "dummy").toLowerCase();
}

function awsHmac(key, value, encoding) {
  return createHmac("sha256", key).update(value, "utf8").digest(encoding);
}

function awsHash(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function awsSigningKey(secret, date, region, service) {
  const kDate = awsHmac(`AWS4${secret}`, date);
  const kRegion = awsHmac(kDate, region);
  const kService = awsHmac(kRegion, service);
  return awsHmac(kService, "aws4_request");
}

async function sendWithSendGrid(email) {
  const key = requireValue(config.sendgridApiKey, "SENDGRID_API_KEY");
  const from = parseAddress(email.fromEmail || config.emailFrom);
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: email.toEmail }], subject: email.subject }],
      from,
      reply_to: parseAddress(config.emailReplyTo),
      content: [{ type: "text/html", value: email.body }]
    })
  });
  if (!response.ok) throw new Error(`SendGrid ${response.status}: ${await response.text()}`);
  return { providerMessageId: response.headers.get("x-message-id") || "" };
}

async function sendWithBrevo(email) {
  const key = requireValue(config.brevoApiKey, "BREVO_API_KEY");
  const from = parseAddress(email.fromEmail || config.emailFrom);
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": key,
      "content-type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify({
      sender: from,
      to: [{ email: email.toEmail }],
      replyTo: parseAddress(config.emailReplyTo),
      subject: email.subject,
      htmlContent: email.body
    })
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Brevo ${response.status}: ${body}`);
  const json = body ? JSON.parse(body) : {};
  return { providerMessageId: json.messageId || "" };
}

async function sendWithSes(email) {
  const region = requireValue(config.sesRegion, "SES_REGION");
  const accessKey = requireValue(config.sesAccessKeyId, "SES_ACCESS_KEY_ID");
  const secret = requireValue(config.sesSecretAccessKey, "SES_SECRET_ACCESS_KEY");
  const service = "ses";
  const host = `email.${region}.amazonaws.com`;
  const endpoint = `https://${host}/v2/email/outbound-emails`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payload = JSON.stringify({
    FromEmailAddress: email.fromEmail || config.emailFrom,
    Destination: { ToAddresses: [email.toEmail] },
    ReplyToAddresses: [config.emailReplyTo],
    Content: {
      Simple: {
        Subject: { Data: email.subject, Charset: "UTF-8" },
        Body: { Html: { Data: email.body, Charset: "UTF-8" } }
      }
    }
  });
  const canonicalHeaders = `content-type:application/json\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-date";
  const canonicalRequest = ["POST", "/v2/email/outbound-emails", "", canonicalHeaders, signedHeaders, awsHash(payload)].join("\n");
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, awsHash(canonicalRequest)].join("\n");
  const signature = awsHmac(awsSigningKey(secret, dateStamp, region, service), stringToSign, "hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization,
      "content-type": "application/json",
      host,
      "x-amz-date": amzDate
    },
    body: payload
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Amazon SES ${response.status}: ${body}`);
  const json = body ? JSON.parse(body) : {};
  return { providerMessageId: json.MessageId || json.messageId || "" };
}

export function getEmailProviderStatus() {
  const active = provider();
  return {
    provider: active,
    from: config.emailFrom,
    replyTo: config.emailReplyTo,
    ready:
      active === "dummy" ||
      (active === "sendgrid" && Boolean(config.sendgridApiKey)) ||
      (active === "brevo" && Boolean(config.brevoApiKey)) ||
      (active === "ses" && Boolean(config.sesAccessKeyId && config.sesSecretAccessKey && config.sesRegion)),
    supported: ["dummy", "sendgrid", "brevo", "ses"],
    missing:
      active === "sendgrid" && !config.sendgridApiKey ? ["SENDGRID_API_KEY"] :
      active === "brevo" && !config.brevoApiKey ? ["BREVO_API_KEY"] :
      active === "ses" && !(config.sesAccessKeyId && config.sesSecretAccessKey && config.sesRegion) ? ["SES_ACCESS_KEY_ID", "SES_SECRET_ACCESS_KEY", "SES_REGION"] :
      []
  };
}

export async function sendEmail(email) {
  const active = provider();
  if (active === "dummy") return { ok: true, providerMessageId: `dummy-${Date.now()}` };
  if (active === "sendgrid") return { ok: true, ...(await sendWithSendGrid(email)) };
  if (active === "brevo") return { ok: true, ...(await sendWithBrevo(email)) };
  if (active === "ses") return { ok: true, ...(await sendWithSes(email)) };
  throw new Error(`Unsupported EMAIL_PROVIDER: ${config.emailProvider}`);
}
