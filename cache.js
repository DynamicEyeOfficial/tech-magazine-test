import { config } from "./config.js";
import { connect as connectTcp } from "node:net";
import { connect as connectTls } from "node:tls";

const memoryCache = new Map();

function now() {
  return Date.now();
}

function encodeRedisCommand(parts) {
  const values = parts.map((part) => String(part ?? ""));
  return `*${values.length}\r\n${values.map((value) => `$${Buffer.byteLength(value)}\r\n${value}\r\n`).join("")}`;
}

function parseRedisReply(buffer, offset = 0) {
  const type = String.fromCharCode(buffer[offset]);
  const lineEnd = buffer.indexOf("\r\n", offset);
  if (lineEnd === -1) throw new Error("Incomplete Redis response.");
  const line = buffer.subarray(offset + 1, lineEnd).toString("utf8");
  const next = lineEnd + 2;

  if (type === "+") return { value: line, offset: next };
  if (type === "-") throw new Error(line);
  if (type === ":") return { value: Number(line), offset: next };
  if (type === "$") {
    const length = Number(line);
    if (length < 0) return { value: null, offset: next };
    const end = next + length;
    return { value: buffer.subarray(next, end).toString("utf8"), offset: end + 2 };
  }
  if (type === "*") {
    const length = Number(line);
    if (length < 0) return { value: null, offset: next };
    const values = [];
    let cursor = next;
    for (let index = 0; index < length; index += 1) {
      const parsed = parseRedisReply(buffer, cursor);
      values.push(parsed.value);
      cursor = parsed.offset;
    }
    return { value: values, offset: cursor };
  }
  throw new Error("Unknown Redis response.");
}

async function redisTcpCommand(command) {
  if (!config.redisUrl) return null;
  try {
    const url = new URL(config.redisUrl);
    const port = Number.parseInt(url.port || (url.protocol === "rediss:" ? "6380" : "6379"), 10);
    const socket = url.protocol === "rediss:"
      ? connectTls({ host: url.hostname, port, servername: url.hostname })
      : connectTcp({ host: url.hostname, port });
    socket.setTimeout(2500);

    return await new Promise((resolve) => {
      const chunks = [];
      let settled = false;
      const password = decodeURIComponent(url.password || "");
      const username = decodeURIComponent(url.username || "");
      const auth = password ? encodeRedisCommand(username ? ["AUTH", username, password] : ["AUTH", password]) : "";
      const select = url.pathname && url.pathname !== "/" ? encodeRedisCommand(["SELECT", url.pathname.replace("/", "")]) : "";
      const payload = `${auth}${select}${encodeRedisCommand(command)}`;
      const expectedReplies = (auth ? 1 : 0) + (select ? 1 : 0) + 1;

      function finish(value) {
        if (settled) return;
        settled = true;
        socket.destroy();
        resolve(value);
      }

      socket.on("connect", () => socket.write(payload));
      socket.on("data", (chunk) => {
        chunks.push(chunk);
        try {
          const buffer = Buffer.concat(chunks);
          let offset = 0;
          let value = null;
          for (let index = 0; index < expectedReplies; index += 1) {
            const parsed = parseRedisReply(buffer, offset);
            value = parsed.value;
            offset = parsed.offset;
          }
          finish({ result: value });
        } catch {
          // Wait for more bytes; errors eventually time out and fall back to memory cache.
        }
      });
      socket.on("timeout", () => finish(null));
      socket.on("error", () => finish(null));
      socket.on("end", () => {
        if (!settled) finish(null);
      });
    });
  } catch {
    return null;
  }
}

export async function redisCommand(command) {
  const tcp = await redisTcpCommand(command);
  if (tcp) return tcp;
  if (!config.redisRestUrl || !config.redisRestToken) return null;
  const response = await fetch(config.redisRestUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.redisRestToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command)
  });
  if (!response.ok) return null;
  return response.json();
}

export async function getCache(key) {
  const redis = await redisCommand(["GET", key]);
  if (redis?.result) {
    try {
      return JSON.parse(redis.result);
    } catch {
      return null;
    }
  }

  const item = memoryCache.get(key);
  if (!item || item.expiresAt <= now()) {
    memoryCache.delete(key);
    return null;
  }
  return item.value;
}

export async function setCache(key, value, ttlSeconds = config.cacheTtlSeconds) {
  const serialized = JSON.stringify(value);
  await redisCommand(["SET", key, serialized, "EX", String(ttlSeconds)]);
  memoryCache.set(key, { value, expiresAt: now() + ttlSeconds * 1000 });
  return value;
}

export async function cached(key, ttlSeconds, factory) {
  const existing = await getCache(key);
  if (existing) return existing;
  const value = await factory();
  await setCache(key, value, ttlSeconds);
  return value;
}

export async function clearCache(prefix = "") {
  for (const key of memoryCache.keys()) {
    if (!prefix || key.startsWith(prefix)) memoryCache.delete(key);
  }
  const pattern = prefix ? `${prefix}*` : "*";
  const keysReply = await redisCommand(["KEYS", pattern]).catch(() => null);
  const keys = Array.isArray(keysReply?.result) ? keysReply.result : [];
  if (keys.length) await redisCommand(["DEL", ...keys]).catch(() => null);
}

export function cacheStats() {
  const keys = [...memoryCache.keys()];
  const redisConfigured = Boolean(config.redisUrl || (config.redisRestUrl && config.redisRestToken));
  return {
    provider: redisConfigured ? `${config.redisUrl ? "redis" : "redis-rest"}+memory` : "memory",
    redisConfigured,
    keys: keys.length,
    entries: keys.map((key) => {
      const item = memoryCache.get(key);
      return { key, expiresAt: item ? new Date(item.expiresAt).toISOString() : "" };
    })
  };
}
