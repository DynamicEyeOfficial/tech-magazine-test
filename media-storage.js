import { createHash, createHmac, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "./config.js";

export const allowedMediaTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
  ["video/mp4", ".mp4"],
  ["audio/mpeg", ".mp3"],
  ["audio/mp4", ".m4a"],
  ["audio/x-m4a", ".m4a"],
  ["audio/wav", ".wav"],
  ["audio/ogg", ".ogg"]
]);

const cloudProviders = new Set(["digitalocean-spaces", "aws-s3", "cloudflare-r2"]);

function cleanBaseUrl(value = "") {
  return String(value || "").replace(/\/$/, "");
}

function encodeObjectKey(key) {
  return String(key)
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function hasJpegSignature(content) {
  return content.length > 3 && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff;
}

function hasPngSignature(content) {
  return content.length > 8 && content.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
}

function hasWebpSignature(content) {
  return content.length > 12 && content.subarray(0, 4).toString("ascii") === "RIFF" && content.subarray(8, 12).toString("ascii") === "WEBP";
}

function hasMp4Signature(content) {
  return content.length > 12 && content.subarray(4, 8).toString("ascii") === "ftyp";
}

function hasSvgSignature(content) {
  const head = content.subarray(0, 256).toString("utf8").trimStart().toLowerCase();
  return head.startsWith("<svg") || head.startsWith("<?xml");
}

function hasAudioSignature(content, mimeType) {
  const head = content.subarray(0, 12).toString("ascii");
  if (mimeType === "audio/ogg") return head.startsWith("OggS");
  if (mimeType === "audio/wav") return head.startsWith("RIFF") && content.subarray(8, 12).toString("ascii") === "WAVE";
  if (mimeType === "audio/mpeg") return head.startsWith("ID3") || (content[0] === 0xff && (content[1] & 0xe0) === 0xe0);
  return hasMp4Signature(content);
}

function signatureLooksValid(content, mimeType) {
  if (mimeType === "image/jpeg") return hasJpegSignature(content);
  if (mimeType === "image/png") return hasPngSignature(content);
  if (mimeType === "image/webp") return hasWebpSignature(content);
  if (mimeType === "image/svg+xml") return hasSvgSignature(content);
  if (mimeType === "video/mp4") return hasMp4Signature(content);
  if (mimeType.startsWith("audio/")) return hasAudioSignature(content, mimeType);
  return false;
}

function maxBytesForType(mimeType) {
  if (mimeType.startsWith("video/")) return config.maxVideoUploadBytes || config.maxUploadBytes;
  if (mimeType.startsWith("audio/")) return config.maxAudioUploadBytes || config.maxUploadBytes;
  return config.maxImageUploadBytes || config.maxUploadBytes;
}

export function validateMediaFile(file) {
  if (!file?.content?.length) return { ok: false, message: "Upload failed. Choose a media file first." };
  if (!allowedMediaTypes.has(file.type)) {
    return { ok: false, message: "Upload failed. Use JPG, PNG, WebP, SVG, MP4, MP3, M4A, WAV, or OGG." };
  }
  const limit = maxBytesForType(file.type);
  if (file.content.length > limit) {
    return { ok: false, message: `Upload failed. File is larger than the configured ${Math.round(limit / 1024 / 1024)} MB limit.` };
  }
  if (!signatureLooksValid(file.content, file.type)) {
    return { ok: false, message: "Upload failed. File contents do not match the selected media type." };
  }
  return { ok: true };
}

async function scanMediaFile({ file, checksum }) {
  if (config.mediaScanMode === "webhook" && config.mediaScannerWebhookUrl) {
    const response = await fetch(config.mediaScannerWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.filename || "upload",
        mimeType: file.type,
        sizeBytes: file.content.length,
        checksum,
        contentBase64: file.content.toString("base64")
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok === false || result.clean === false) {
      return { ok: false, status: "rejected", message: result.message || "Upload rejected by media scanner." };
    }
    return { ok: true, status: "passed-webhook" };
  }
  return { ok: true, status: config.mediaScanMode === "trusted-provider" ? "trusted-provider" : "passed-basic" };
}

function hmac(key, value, encoding) {
  return createHmac("sha256", key).update(value).digest(encoding);
}

function s3SigningKey(secret, date, region) {
  const kDate = hmac(`AWS4${secret}`, date);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, "s3");
  return hmac(kService, "aws4_request");
}

async function uploadS3Compatible({ key, content, mimeType, provider }) {
  const isR2 = provider === "cloudflare-r2";
  const isDigitalOcean = provider === "digitalocean-spaces";
  const bucket = isDigitalOcean ? config.doSpacesName : isR2 ? config.r2Bucket : config.s3Bucket;
  const accessKeyId = isDigitalOcean ? config.doSpacesAccessKeyId : isR2 ? config.r2AccessKeyId : config.s3AccessKeyId;
  const secretAccessKey = isDigitalOcean ? config.doSpacesSecretAccessKey : isR2 ? config.r2SecretAccessKey : config.s3SecretAccessKey;
  const region = isDigitalOcean ? config.doSpacesRegion : isR2 ? "auto" : config.s3Region;
  const endpoint = cleanBaseUrl(isDigitalOcean
    ? (config.doSpacesEndpoint || `https://${region}.digitaloceanspaces.com`)
    : isR2
    ? (config.r2Endpoint || (config.r2AccountId ? `https://${config.r2AccountId}.r2.cloudflarestorage.com` : ""))
    : (config.s3Endpoint || `https://s3.${region}.amazonaws.com`));
  if (!bucket || !accessKeyId || !secretAccessKey || !endpoint) throw new Error(`${provider} storage credentials are incomplete.`);

  const endpointUrl = new URL(endpoint);
  const encodedKey = encodeObjectKey(key);
  const requestHost = isDigitalOcean ? `${bucket}.${endpointUrl.host}` : endpointUrl.host;
  const requestPath = isDigitalOcean ? `/${encodedKey}` : `/${encodeURIComponent(bucket)}/${encodedKey}`;
  const requestUrl = `${endpointUrl.protocol}//${requestHost}${requestPath}`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = createHash("sha256").update(content).digest("hex");
  const canonicalHeaders = [
    `cache-control:${config.mediaCacheControl}`,
    `content-type:${mimeType}`,
    `host:${requestHost}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`
  ].join("\n") + "\n";
  const signedHeaders = "cache-control;content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = ["PUT", requestPath, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, createHash("sha256").update(canonicalRequest).digest("hex")].join("\n");
  const signature = hmac(s3SigningKey(secretAccessKey, dateStamp, region), stringToSign, "hex");
  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "Cache-Control": config.mediaCacheControl,
      "Content-Type": mimeType,
      Host: requestHost,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
    },
    body: content
  });
  if (!response.ok) throw new Error(`${provider} upload failed with status ${response.status}.`);
}

function publicUrlForKey(provider, key, localUrl) {
  const encodedKey = encodeObjectKey(key);
  const cdnBase = cleanBaseUrl(config.mediaCdnBaseUrl);
  if (cdnBase) return `${cdnBase}/${encodedKey}`;
  if (provider === "digitalocean-spaces" && config.doSpacesCdnBaseUrl) return `${cleanBaseUrl(config.doSpacesCdnBaseUrl)}/${encodedKey}`;
  if (provider === "digitalocean-spaces" && config.doSpacesName) return `https://${config.doSpacesName}.${config.doSpacesRegion}.digitaloceanspaces.com/${encodedKey}`;
  if (provider === "aws-s3" && config.s3PublicBaseUrl) return `${cleanBaseUrl(config.s3PublicBaseUrl)}/${encodedKey}`;
  if (provider === "cloudflare-r2" && config.r2PublicBaseUrl) return `${cleanBaseUrl(config.r2PublicBaseUrl)}/${encodedKey}`;
  return localUrl;
}

export async function storeMediaFile({ file, uploadDir, publicPathPrefix = "/uploads", folder = "Editorial", storageProvider = "" }) {
  const validation = validateMediaFile(file);
  if (!validation.ok) return validation;
  const checksum = createHash("sha256").update(file.content).digest("hex");
  const scan = await scanMediaFile({ file, checksum });
  if (!scan.ok) return { ok: false, message: scan.message };

  const extension = allowedMediaTypes.get(file.type);
  const typeFolder = file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "audio" : "image";
  const safeFolder = String(folder || "Editorial").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || "editorial";
  const safeName = `${Date.now()}-${randomUUID()}${extension}`;
  const key = `${safeFolder}/${typeFolder}/${safeName}`;
  const selectedProvider = storageProvider || config.mediaStorageProvider;
  const provider = cloudProviders.has(selectedProvider) ? selectedProvider : "local";

  if (provider === "aws-s3" || provider === "cloudflare-r2" || provider === "digitalocean-spaces") await uploadS3Compatible({ key, content: file.content, mimeType: file.type, provider });
  else {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, safeName), file.content);
  }

  const localUrl = `${publicPathPrefix}/${safeName}`;
  const fileUrl = provider === "local" ? localUrl : publicUrlForKey(provider, key, localUrl);
  return {
    ok: true,
    fileUrl,
    storageProvider: provider,
    storageKey: provider === "local" ? safeName : key,
    checksum,
    scanStatus: scan.status,
    processingStatus: file.type.startsWith("video/") ? "queued-transcode" : file.type.startsWith("image/") ? "queued-optimize" : "ready",
    sizeBytes: file.content.length,
    metadata: {
      originalName: file.filename || "",
      checksum,
      storageProvider: provider,
      storageKey: provider === "local" ? safeName : key,
      scanStatus: scan.status
    }
  };
}

export function getMediaStorageStatus(overrides = {}) {
  const provider = overrides.storageProvider || config.mediaStorageProvider || "local";
  const cdnBaseUrl = cleanBaseUrl(overrides.cdnBaseUrl || config.mediaCdnBaseUrl);
  const videoStreamingProvider = overrides.videoStreamingProvider || config.videoStreamingProvider;
  const blockers = [];
  const warnings = [];

  if (provider === "local") {
    blockers.push("Local disk uploads are for development/small deployments only. Configure DigitalOcean Spaces before high traffic launch.");
  }
  if (provider === "digitalocean-spaces") {
    if (!config.doSpacesName || !config.doSpacesRegion || !config.doSpacesAccessKeyId || !config.doSpacesSecretAccessKey) blockers.push("DigitalOcean Spaces name, region, access key, and secret key are required.");
    if (!cdnBaseUrl && !config.doSpacesCdnBaseUrl) blockers.push("DigitalOcean Spaces needs MEDIA_CDN_BASE_URL or DO_SPACES_CDN_BASE_URL for CDN/public delivery.");
  }
  if (provider === "aws-s3") {
    if (!config.s3Bucket || !config.s3Region || !config.s3AccessKeyId || !config.s3SecretAccessKey) blockers.push("AWS S3 bucket, region, and access keys are required.");
    if (!cdnBaseUrl && !config.s3PublicBaseUrl) blockers.push("AWS S3 needs MEDIA_CDN_BASE_URL or S3_PUBLIC_BASE_URL for public delivery.");
  }
  if (provider === "cloudflare-r2") {
    if (!config.r2Bucket || (!config.r2Endpoint && !config.r2AccountId) || !config.r2AccessKeyId || !config.r2SecretAccessKey) blockers.push("Cloudflare R2 bucket, endpoint/account id, and access keys are required.");
    if (!cdnBaseUrl && !config.r2PublicBaseUrl) blockers.push("Cloudflare R2 needs MEDIA_CDN_BASE_URL or R2_PUBLIC_BASE_URL for public delivery.");
  }
  if (!cloudProviders.has(provider) && provider !== "local") blockers.push(`Unknown media storage provider: ${provider}.`);
  if (videoStreamingProvider === "local") warnings.push("Video delivery is local MP4 only. Use Mux or Cloudflare Stream for adaptive streaming at scale.");
  if (config.mediaScanMode === "basic") warnings.push("Only basic file signature validation is enabled. Use MEDIA_SCAN_MODE=webhook or trusted-provider for stronger malware scanning.");

  return {
    provider,
    cloudStorageReady: cloudProviders.has(provider) && blockers.length === 0,
    cdnReady: Boolean(cdnBaseUrl || config.doSpacesCdnBaseUrl || config.s3PublicBaseUrl || config.r2PublicBaseUrl),
    productionReady: cloudProviders.has(provider) && blockers.length === 0,
    uploadMode: provider === "local" ? "local-disk" : "cloud-object-storage",
    blockers,
    warnings,
    supportedTypes: Array.from(allowedMediaTypes.keys()),
    maxUploadBytes: config.maxUploadBytes,
    maxImageUploadBytes: config.maxImageUploadBytes,
    maxVideoUploadBytes: config.maxVideoUploadBytes,
    maxAudioUploadBytes: config.maxAudioUploadBytes,
    scanMode: config.mediaScanMode
  };
}
