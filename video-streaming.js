import { existsSync } from "node:fs";
import { config } from "./config.js";
import { getMediaStorageStatus } from "./media-storage.js";

function hasFfmpegBinary() {
  if (!config.ffmpegPath || config.ffmpegPath === "ffmpeg") return false;
  return existsSync(config.ffmpegPath);
}

export function getVideoStreamingStatus(overrides = {}) {
  const provider = overrides.videoStreamingProvider || config.videoStreamingProvider || "local";
  const media = getMediaStorageStatus(overrides.media || {});
  const transcoderMode = overrides.videoTranscoderMode || config.videoTranscoderMode;
  const blockers = [];
  const warnings = [];

  if (provider === "local") {
    blockers.push("Local MP4 delivery is not adaptive streaming. Use digitalocean-hls, Mux, or Cloudflare Stream before high traffic video launch.");
  }

  if (provider === "digitalocean-hls") {
    if (!media.productionReady || media.provider !== "digitalocean-spaces") {
      blockers.push("DigitalOcean HLS needs production-ready DigitalOcean Spaces media storage.");
    }
    if (!["ffmpeg", "managed"].includes(transcoderMode)) {
      blockers.push("DigitalOcean HLS needs VIDEO_TRANSCODER_MODE=ffmpeg or managed.");
    }
    if (transcoderMode === "ffmpeg" && !hasFfmpegBinary()) {
      warnings.push("FFmpeg path is not verified locally. Set FFMPEG_PATH to the server binary before enabling self-hosted HLS transcoding.");
    }
  }

  if (provider === "mux" && !process.env.MUX_TOKEN_ID) {
    blockers.push("Mux streaming needs MUX_TOKEN_ID and MUX_TOKEN_SECRET.");
  }

  if (provider === "cloudflare-stream" && !process.env.CLOUDFLARE_STREAM_TOKEN) {
    blockers.push("Cloudflare Stream needs CLOUDFLARE_STREAM_TOKEN and account configuration.");
  }

  if (!["local", "digitalocean-hls", "mux", "cloudflare-stream", "youtube"].includes(provider)) {
    blockers.push(`Unknown video streaming provider: ${provider}.`);
  }

  if (config.videoLiveChatProvider === "internal") {
    warnings.push("Internal live chat is suitable for MVP; load-test or connect a managed realtime backend before major livestreams.");
  }

  return {
    provider,
    productionReady: blockers.length === 0,
    adaptiveStreamingReady: provider !== "local" && blockers.length === 0,
    transcoderMode,
    ffmpegPath: config.ffmpegPath,
    hlsSegmentSeconds: config.videoHlsSegmentSeconds,
    liveChatProvider: config.videoLiveChatProvider,
    mediaStorageProvider: media.provider,
    blockers,
    warnings,
    supportedProviders: ["digitalocean-hls", "mux", "cloudflare-stream", "youtube", "local"]
  };
}
