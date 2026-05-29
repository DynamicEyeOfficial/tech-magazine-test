import { setTimeout as delay } from "node:timers/promises";
import { config } from "./config.js";
import { getEmailProviderStatus, sendEmail } from "./email.js";
import { getPushProviderStatus, sendFirebasePush } from "./push.js";
import { transcribeAudioAi } from "./ai.js";
import { importTechNews } from "./news-ingestion.js";
import { claimNextJob, completeJob, createCampaignOutbox, failJob, getNotificationPushBatch, getOutboxEmail, initDatabase, markOutboxFailed, markOutboxSent, recordPushDelivery, updatePodcastTranscription } from "./db.js";

initDatabase();
let lastNewsImportAt = 0;

async function processJob(job) {
  if (job.type === "newsletter.send") {
    const recipients = job.payload.recipients || 0;
    const outbox = createCampaignOutbox(job.payload.campaignId);
    const status = getEmailProviderStatus();
    completeJob(job.id, `Newsletter campaign processed in ${config.emailProvider} mode. ${outbox.count || recipients} email records created. Provider ready: ${status.ready}.`);
    return;
  }

  if (job.type === "email.deliver") {
    const email = getOutboxEmail(job.payload.emailId);
    if (!email) {
      completeJob(job.id, "Email outbox record was not found.");
      return;
    }
    if (email.status === "sent") {
      completeJob(job.id, `Email ${email.id} was already sent.`);
      return;
    }
    try {
      const result = await sendEmail(email);
      markOutboxSent(email.id, result.providerMessageId || "");
      completeJob(job.id, `Email ${email.id} delivered through ${config.emailProvider}.`);
    } catch (error) {
      markOutboxFailed(email.id, error.message);
      throw error;
    }
    return;
  }

  if (job.type === "notification.push") {
    const recipients = job.payload.recipients || 0;
    const status = getPushProviderStatus();
    if (!status.serverPushReady) {
      completeJob(job.id, `Notification recorded in-app for ${recipients || "public"} recipients. Server push is waiting for Firebase service account credentials.`);
      return;
    }
    const batch = getNotificationPushBatch(job.payload.notificationId);
    let sent = 0;
    let failed = 0;
    for (const recipient of batch.recipients || []) {
      try {
        const result = await sendFirebasePush({
          token: recipient.deviceToken,
          title: batch.notification.title,
          body: batch.notification.body,
          linkUrl: batch.notification.linkUrl,
          type: batch.notification.type,
          priority: batch.notification.priority
        });
        sent += 1;
        recordPushDelivery({ notificationId: batch.notification.id, readerId: recipient.readerId, status: "delivered", providerMessageId: result.providerMessageId });
      } catch (error) {
        failed += 1;
        recordPushDelivery({ notificationId: batch.notification.id, readerId: recipient.readerId, status: "failed", error: error.message });
      }
    }
    completeJob(job.id, `Firebase push processed. Sent: ${sent}. Failed: ${failed}. In-app recipients: ${recipients || "public"}.`);
    return;
  }

  if (job.type === "breaking.distribute") {
    completeJob(job.id, `Breaking alert distribution recorded at priority ${job.payload.priorityScore || 0}. Homepage, banner, and in-app notifications are already synced.`);
    return;
  }

  if (job.type === "live.update") {
    completeJob(job.id, `Live update ${job.payload.updateId || ""} recorded for event ${job.payload.eventId || ""}. Public timeline and mobile API are refreshed through the database.`);
    return;
  }

  if (job.type === "video.process") {
    completeJob(job.id, `Video ${job.payload.videoId || ""} registered for ${job.payload.sourceType || "media"} processing with provider ${job.payload.streamingProvider || config.videoStreamingProvider}.`);
    return;
  }
  if (job.type === "image.optimize") {
    completeJob(job.id, `Image ${job.payload.mediaId || ""} registered for responsive variants and CDN cache delivery. Connect Sharp, Cloudflare Images, or an edge optimizer for physical transcoding.`);
    return;
  }
  if (job.type === "video.transcode") {
    completeJob(job.id, `Uploaded video ${job.payload.videoId || job.payload.mediaId || ""} queued for adaptive HLS output. DigitalOcean Spaces delivery is enabled after VIDEO_TRANSCODER_MODE and provider credentials are configured.`);
    return;
  }

  if (job.type === "podcast.publish") {
    completeJob(job.id, `Podcast episode ${job.payload.episodeId || ""} registered. RSS/API output is live; add Spotify and Apple distribution credentials when accounts are connected.`);
    return;
  }

  if (job.type === "podcast.transcribe") {
    if (!config.openaiApiKey) {
      updatePodcastTranscription({ episodeId: job.payload.episodeId, processingStatus: "waiting-openai-key" });
      completeJob(job.id, `Podcast episode ${job.payload.episodeId || ""} is waiting for OPENAI_API_KEY before AI transcription can run.`);
      return;
    }
    const result = await transcribeAudioAi(job.payload.audioUrl, { language: job.payload.language || "" });
    updatePodcastTranscription({ episodeId: job.payload.episodeId, transcript: result.transcript, processingStatus: "ready" });
    completeJob(job.id, `Podcast episode ${job.payload.episodeId || ""} transcribed with ${result.model}.`);
    return;
  }

  if (job.type === "ai.assistant") {
    completeJob(job.id, `AI assistant job ${job.payload.runId || ""} recorded. Live generation is handled through admin/API requests.`);
    return;
  }

  if (job.type === "workflow.reminder") {
    completeJob(job.id, `Workflow reminder recorded for ${job.payload.articleId || "newsroom item"}. Connect email/push delivery when production messaging is enabled.`);
    return;
  }

  if (job.type === "monetization.report") {
    completeJob(job.id, `Monetization report prepared for ${job.payload.period || "current period"}. Revenue dashboard data is available in the CMS.`);
    return;
  }

  if (job.type === "review.publish") {
    completeJob(job.id, `Product review ${job.payload.reviewId || ""} published. Review page, API, and mobile feeds are database-backed.`);
    return;
  }

  completeJob(job.id, `No processor registered for ${job.type}.`);
}

export async function processOneJob() {
  const job = claimNextJob();
  if (!job) return false;
  try {
    await processJob(job);
  } catch (error) {
    failJob(job.id, error.message);
  }
  return true;
}

async function processScheduledNewsImport() {
  if (!config.newsImportEnabled) return false;
  const intervalMs = Math.max(15, config.newsImportIntervalMinutes || 60) * 60 * 1000;
  if (Date.now() - lastNewsImportAt < intervalMs) return false;
  lastNewsImportAt = Date.now();
  const result = await importTechNews({
    limit: config.newsImportTargetCount || 50,
    status: config.newsImportStatus || "source_policy",
    savedBy: "user-admin"
  });
  console.log(`News import checked ${result.sources.length} sources. Imported ${result.importedCount}; skipped ${result.skippedCount}; failed ${result.failedCount}.`);
  return result.importedCount > 0;
}

if (process.argv[1]?.endsWith("worker.js")) {
  console.log(`Tech Magazine worker running every ${config.workerIntervalMs}ms`);
  while (true) {
    const processed = await processOneJob() || await processScheduledNewsImport();
    if (!processed) await delay(config.workerIntervalMs);
  }
}
