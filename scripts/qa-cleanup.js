import { database, initDatabase, rebuildSearchIndex } from "../db.js";
import { pathToFileURL } from "node:url";

function runCleanup(label, sql, params = []) {
  const result = database.prepare(sql).run(...params);
  return { label, changes: result.changes || 0 };
}

export function cleanupQaData({ log = true } = {}) {
  initDatabase();
  const results = [];
  database.exec(`
    CREATE TEMP TABLE IF NOT EXISTS qa_articles AS
      SELECT id, slug FROM articles
      WHERE slug LIKE 'qa-%'
        OR slug LIKE 'editor-qa-%'
        OR title LIKE 'QA %'
        OR title LIKE '% QA %'
        OR title LIKE '%Smoke%';

    CREATE TEMP TABLE IF NOT EXISTS qa_readers AS
      SELECT id FROM reader_accounts
      WHERE email LIKE 'reader-%@example.com'
        OR email LIKE 'event-reader-%@example.com'
        OR email LIKE 'event-registered-%@example.com'
        OR email LIKE 'job-reader-%@example.com'
        OR email LIKE 'job-apply-%@example.com'
        OR email LIKE 'full-qa-reader-%@example.com'
        OR email LIKE 'client-audit-reader-%@example.com'
        OR name LIKE '%Smoke%'
        OR name LIKE '% QA %'
        OR name LIKE 'QA %'
        OR name LIKE '%Audit%';

    CREATE TEMP TABLE IF NOT EXISTS qa_live_events AS
      SELECT id FROM live_events
      WHERE slug LIKE 'section-three-live-%'
        OR title LIKE '%Smoke%'
        OR host LIKE '%Smoke%';

    CREATE TEMP TABLE IF NOT EXISTS qa_jobs AS
      SELECT id FROM job_posts
      WHERE slug LIKE 'qa-job-%'
        OR title LIKE 'QA %'
        OR company_name LIKE 'QA %';

    CREATE TEMP TABLE IF NOT EXISTS qa_events AS
      SELECT id FROM conference_events
      WHERE slug LIKE 'qa-event-%'
        OR title LIKE 'QA %'
        OR sponsor LIKE 'QA %';

    CREATE TEMP TABLE IF NOT EXISTS qa_topics AS
      SELECT id FROM community_topics
      WHERE title LIKE '%Smoke%'
        OR title LIKE '%Audit%'
        OR title LIKE '%QA %'
        OR slug LIKE 'smoke-%'
        OR slug LIKE 'audit-%'
        OR slug LIKE 'qa-%';
  `);

  database.exec("BEGIN");
  try {
    results.push(runCleanup("comment reports", "DELETE FROM comment_reports WHERE comment_id IN (SELECT id FROM comments WHERE article_id IN (SELECT id FROM qa_articles) OR user_email LIKE '%audit%' OR user_email LIKE '%smoke%' OR content LIKE '%audit%' OR content LIKE '%Smoke%')"));
    results.push(runCleanup("comment votes", "DELETE FROM comment_votes WHERE comment_id IN (SELECT id FROM comments WHERE article_id IN (SELECT id FROM qa_articles) OR user_email LIKE '%audit%' OR user_email LIKE '%smoke%' OR content LIKE '%audit%' OR content LIKE '%Smoke%')"));
    results.push(runCleanup("comments", "DELETE FROM comments WHERE article_id IN (SELECT id FROM qa_articles) OR reader_id IN (SELECT id FROM qa_readers) OR user_email LIKE '%audit%' OR user_email LIKE '%smoke%' OR content LIKE '%audit%' OR content LIKE '%Smoke%'"));

    results.push(runCleanup("article tags", "DELETE FROM article_tags WHERE article_id IN (SELECT id FROM qa_articles)"));
    results.push(runCleanup("article approvals", "DELETE FROM article_approvals WHERE article_id IN (SELECT id FROM qa_articles)"));
    results.push(runCleanup("article revisions", "DELETE FROM article_revisions WHERE article_id IN (SELECT id FROM qa_articles)"));
    results.push(runCleanup("article translations", "DELETE FROM article_translations WHERE article_id IN (SELECT id FROM qa_articles) OR title LIKE '%Smoke%' OR seo_title LIKE '%Smoke%'"));
    results.push(runCleanup("seo link approvals", "DELETE FROM seo_link_approvals WHERE source_slug IN (SELECT slug FROM qa_articles) OR target_slug IN (SELECT slug FROM qa_articles)"));
    results.push(runCleanup("bookmarks for QA articles", "DELETE FROM bookmarks WHERE article_id IN (SELECT id FROM qa_articles)"));
    results.push(runCleanup("QA articles", "DELETE FROM articles WHERE id IN (SELECT id FROM qa_articles)"));

    results.push(runCleanup("live comments", "DELETE FROM live_event_comments WHERE event_id IN (SELECT id FROM qa_live_events) OR reader_id IN (SELECT id FROM qa_readers) OR name LIKE '%Smoke%' OR email LIKE '%smoke%'"));
    results.push(runCleanup("live updates", "DELETE FROM live_updates WHERE event_id IN (SELECT id FROM qa_live_events) OR title LIKE '%Smoke%' OR body LIKE '%Smoke%'"));
    results.push(runCleanup("live events", "DELETE FROM live_events WHERE id IN (SELECT id FROM qa_live_events)"));

    results.push(runCleanup("event registrations", "DELETE FROM event_registrations WHERE event_id IN (SELECT id FROM qa_events) OR reader_id IN (SELECT id FROM qa_readers) OR email LIKE 'reader-%@example.com' OR email LIKE 'event-%@example.com' OR email LIKE '%audit%' OR name LIKE '%Smoke%' OR name LIKE '%QA%' OR company LIKE '%Smoke%' OR company LIKE '%Audit%' OR company LIKE '%QA%'"));
    results.push(runCleanup("event agenda", "DELETE FROM event_agenda_items WHERE event_id IN (SELECT id FROM qa_events)"));
    results.push(runCleanup("event speakers", "DELETE FROM event_speakers WHERE event_id IN (SELECT id FROM qa_events)"));
    results.push(runCleanup("conference events", "DELETE FROM conference_events WHERE id IN (SELECT id FROM qa_events)"));

    results.push(runCleanup("job applications", "DELETE FROM job_applications WHERE job_id IN (SELECT id FROM qa_jobs) OR reader_id IN (SELECT id FROM qa_readers) OR email LIKE 'reader-%@example.com' OR email LIKE 'job-%@example.com' OR name LIKE '%Smoke%' OR name LIKE '%QA%'"));
    results.push(runCleanup("job posts", "DELETE FROM job_posts WHERE id IN (SELECT id FROM qa_jobs)"));

    results.push(runCleanup("community replies", "DELETE FROM community_replies WHERE topic_id IN (SELECT id FROM qa_topics) OR reader_id IN (SELECT id FROM qa_readers) OR body LIKE '%Smoke%' OR body LIKE '%audit%'"));
    results.push(runCleanup("community votes", "DELETE FROM community_topic_votes WHERE topic_id IN (SELECT id FROM qa_topics)"));
    results.push(runCleanup("community topics", "DELETE FROM community_topics WHERE id IN (SELECT id FROM qa_topics) OR reader_id IN (SELECT id FROM qa_readers)"));

    results.push(runCleanup("author follows", "DELETE FROM author_follows WHERE reader_id IN (SELECT id FROM qa_readers)"));
    results.push(runCleanup("mobile offline", "DELETE FROM mobile_offline_items WHERE reader_id IN (SELECT id FROM qa_readers)"));
    results.push(runCleanup("mobile events", "DELETE FROM mobile_app_events WHERE reader_id IN (SELECT id FROM qa_readers) OR installation_id LIKE 'smoke-%'"));
    results.push(runCleanup("notification prefs", "DELETE FROM notification_preferences WHERE reader_id IN (SELECT id FROM qa_readers) OR device_token LIKE 'smoke-%' OR device_token LIKE 'client-audit-%'"));
    results.push(runCleanup("notification deliveries", "DELETE FROM notification_deliveries WHERE reader_id IN (SELECT id FROM qa_readers)"));
    results.push(runCleanup("saved searches", "DELETE FROM saved_search_filters WHERE reader_id IN (SELECT id FROM qa_readers) OR name LIKE '%Smoke%' OR name LIKE '%Audit%' OR name LIKE '%QA%'"));
    results.push(runCleanup("reader point events", "DELETE FROM reader_point_events WHERE reader_id IN (SELECT id FROM qa_readers)"));
    results.push(runCleanup("reader preferences", "DELETE FROM reader_preferences WHERE reader_id IN (SELECT id FROM qa_readers)"));
    results.push(runCleanup("reader reading", "DELETE FROM reader_reading_activity WHERE reader_id IN (SELECT id FROM qa_readers)"));
    results.push(runCleanup("reader reputation", "DELETE FROM reader_reputation WHERE reader_id IN (SELECT id FROM qa_readers)"));
    results.push(runCleanup("reader sessions", "DELETE FROM reader_sessions WHERE reader_id IN (SELECT id FROM qa_readers)"));
    results.push(runCleanup("reader streaks", "DELETE FROM reader_streaks WHERE reader_id IN (SELECT id FROM qa_readers)"));
    results.push(runCleanup("reader subscriptions", "DELETE FROM reader_subscriptions WHERE reader_id IN (SELECT id FROM qa_readers)"));
    results.push(runCleanup("reader accounts", "DELETE FROM reader_accounts WHERE id IN (SELECT id FROM qa_readers)"));

    results.push(runCleanup("subscribers", "DELETE FROM subscribers WHERE email LIKE 'newsletter-%@example.com' OR email LIKE 'client-audit-newsletter-%@example.com' OR email LIKE 'browser-qa-%@example.com' OR email LIKE 'browser-audience-%@example.com'"));
    results.push(runCleanup("company contact outbox", "DELETE FROM email_outbox WHERE related_type = 'company_contact' AND (to_email LIKE '%@techmag.local' OR subject LIKE '%QA%' OR subject LIKE '%Smoke%' OR subject LIKE '%Browser%')"));
    results.push(runCleanup("notifications", "DELETE FROM notifications WHERE title LIKE '%Smoke%' OR body LIKE '%Smoke%' OR title LIKE '%Audit%'"));
    const smokeBanner = database.prepare(`
      SELECT 1 FROM site_settings
      WHERE (setting_key = 'breakingBannerText' AND (setting_value LIKE '%Smoke%' OR setting_value LIKE '%Section Three%'))
        OR (setting_key = 'breakingBannerUrl' AND setting_value LIKE '%section-three-live%')
    `).get();
    if (smokeBanner) {
      results.push(runCleanup("breaking banner text", "UPDATE site_settings SET setting_value = ? WHERE setting_key = 'breakingBannerText'", [JSON.stringify("Firebase push alerts are ready for breaking technology coverage.")]));
      results.push(runCleanup("breaking banner url", "UPDATE site_settings SET setting_value = ? WHERE setting_key = 'breakingBannerUrl'", [JSON.stringify("#/notifications")]));
      results.push(runCleanup("breaking banner enabled", "UPDATE site_settings SET setting_value = ? WHERE setting_key = 'breakingBannerEnabled'", [JSON.stringify(true)]));
    }
    results.push(runCleanup("media smoke", "DELETE FROM media_library WHERE title LIKE '%Smoke%' OR caption LIKE '%smoke%'"));
    results.push(runCleanup("product review smoke", "DELETE FROM product_reviews WHERE product_name LIKE '%Smoke%' OR slug LIKE 'smoke-review-%' OR brand LIKE '%Smoke%' OR verdict LIKE '%smoke%'"));
    results.push(runCleanup("revenue audit", "DELETE FROM revenue_events WHERE description LIKE '%audit%' OR description LIKE '%Smoke%' OR description LIKE '%QA%'"));
    results.push(runCleanup("sponsor smoke", "DELETE FROM sponsored_campaigns WHERE name LIKE '%Smoke%' OR sponsor LIKE '%Smoke%' OR notes LIKE '%Smoke%'"));
    results.push(runCleanup("video ad smoke", "DELETE FROM ad_video_slots WHERE label LIKE '%Smoke%' OR sponsor LIKE '%Smoke%' OR placement_key LIKE '%smoke%'"));
    results.push(runCleanup("affiliate smoke", "DELETE FROM affiliate_links WHERE label LIKE '%Smoke%' OR partner LIKE '%Smoke%' OR campaign LIKE '%smoke%'"));
    results.push(runCleanup("api usage", "DELETE FROM api_usage_events WHERE api_key_id IN (SELECT id FROM api_keys WHERE name LIKE 'Smoke Partner %')"));
    results.push(runCleanup("api keys", "DELETE FROM api_keys WHERE name LIKE 'Smoke Partner %'"));
    results.push(runCleanup("api webhook events", "DELETE FROM api_webhook_events WHERE webhook_id IN (SELECT id FROM api_webhooks WHERE name LIKE 'Smoke Webhook %')"));
    results.push(runCleanup("api webhooks", "DELETE FROM api_webhooks WHERE name LIKE 'Smoke Webhook %'"));
    results.push(runCleanup("users", "DELETE FROM users WHERE email LIKE 'audit-user-%@example.com' OR name LIKE 'Audit User %'"));
    results.push(runCleanup("roles", "DELETE FROM roles WHERE name LIKE 'Audit Role %' OR name LIKE 'Smoke Role %'"));
    results.push(runCleanup("tags", "DELETE FROM tags WHERE name LIKE 'Audit Tag %' OR slug LIKE 'audit-tag-%' OR name = 'QA' OR slug = 'qa'"));
    results.push(runCleanup("categories", "DELETE FROM categories WHERE name LIKE 'Audit Category %' OR slug LIKE 'audit-category-%'"));
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
  rebuildSearchIndex();
  const removed = results.reduce((sum, item) => sum + item.changes, 0);
  if (log) {
    console.log(JSON.stringify({ ok: true, removed, results: results.filter((item) => item.changes > 0) }, null, 2));
  }
  return { ok: true, removed, results };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) cleanupQaData();
