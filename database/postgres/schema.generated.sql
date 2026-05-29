-- Generated from the live SQLite schema for migration planning.
-- Review data types and foreign keys before running against production PostgreSQL.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS ad_impressions (
      id TEXT PRIMARY KEY,
      placement_key TEXT NOT NULL,
      path TEXT,
      referrer TEXT,
      user_agent TEXT,
      created_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS ad_placements (
      id TEXT PRIMARY KEY,
      placement_key TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL,
      headline TEXT NOT NULL,
      body TEXT NOT NULL,
      link_url TEXT NOT NULL,
      link_label TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      updated_at timestamptz NOT NULL DEFAULT now()
    , ad_type TEXT NOT NULL DEFAULT 'banner', cpm_cents INTEGER NOT NULL DEFAULT 0, starts_at TEXT, ends_at TEXT, geo_targets_json TEXT NOT NULL DEFAULT '[]');

CREATE TABLE IF NOT EXISTS ad_video_slots (
      id TEXT PRIMARY KEY,
      placement_key TEXT NOT NULL,
      label TEXT NOT NULL,
      ad_type TEXT NOT NULL DEFAULT 'pre-roll',
      cpm_cents INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      sponsor TEXT,
      starts_at TEXT,
      ends_at TEXT,
      geo_targets_json TEXT NOT NULL DEFAULT '[]',
      created_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS affiliate_clicks (
      id TEXT PRIMARY KEY,
      affiliate_id TEXT NOT NULL,
      referrer TEXT,
      user_agent TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(affiliate_id) REFERENCES affiliate_links(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS affiliate_links (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      partner TEXT NOT NULL,
      target_url TEXT NOT NULL,
      campaign TEXT NOT NULL DEFAULT 'general',
      commission_note TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      clicks INTEGER NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now()
    , revenue_cents INTEGER NOT NULL DEFAULT 0);

CREATE TABLE IF NOT EXISTS ai_assistant_runs (
      id TEXT PRIMARY KEY,
      task TEXT NOT NULL,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      prompt_excerpt TEXT,
      result_json TEXT NOT NULL,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS ai_automation_jobs (
      id TEXT PRIMARY KEY,
      article_id TEXT,
      job_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'completed',
      input_json TEXT NOT NULL DEFAULT '{}',
      output_json TEXT NOT NULL DEFAULT '{}',
      cost_estimate_cents INTEGER NOT NULL DEFAULT 0,
      review_status TEXT NOT NULL DEFAULT 'pending_review',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE SET NULL,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      path TEXT NOT NULL,
      article_slug TEXT,
      referrer TEXT,
      user_agent TEXT,
      created_at timestamptz NOT NULL DEFAULT now()
    , duration_seconds INTEGER NOT NULL DEFAULT 0, scroll_depth INTEGER NOT NULL DEFAULT 0, metadata_json TEXT NOT NULL DEFAULT '{}');

CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      key_prefix TEXT NOT NULL,
      key_hash TEXT NOT NULL UNIQUE,
      scopes_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'active',
      rate_limit_per_minute INTEGER NOT NULL DEFAULT 120,
      expires_at TEXT,
      last_used_at TEXT,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS api_usage_events (
      id TEXT PRIMARY KEY,
      api_key_id TEXT,
      path TEXT NOT NULL,
      method TEXT NOT NULL,
      status_code INTEGER NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(api_key_id) REFERENCES api_keys(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS api_webhook_events (
      id TEXT PRIMARY KEY,
      webhook_id TEXT,
      event_type TEXT NOT NULL,
      payload_json TEXT NOT NULL DEFAULT '{}',
      delivery_status TEXT NOT NULL DEFAULT 'queued',
      response_code INTEGER NOT NULL DEFAULT 0,
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      delivered_at TEXT,
      FOREIGN KEY(webhook_id) REFERENCES api_webhooks(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS api_webhooks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target_url TEXT NOT NULL,
      events_json TEXT NOT NULL DEFAULT '[]',
      secret_hint TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS article_approvals (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'requested',
      requested_by TEXT,
      reviewed_by TEXT,
      notes TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      reviewed_at TEXT, sensitivity_level TEXT NOT NULL DEFAULT 'normal',
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY(requested_by) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY(reviewed_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS article_revisions (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      body_json TEXT NOT NULL,
      status TEXT NOT NULL,
      saved_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY(saved_by) REFERENCES users(id)
    );

CREATE TABLE IF NOT EXISTS article_tags (
      article_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY(article_id, tag_id),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS article_translations (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      language_code TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      body_json TEXT NOT NULL,
      seo_title TEXT,
      seo_description TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE(article_id, language_code),
      UNIQUE(language_code, slug),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY(language_code) REFERENCES languages(code) ON DELETE CASCADE,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      subtitle TEXT NOT NULL,
      category_slug TEXT NOT NULL,
      channel_slug TEXT NOT NULL,
      author_id TEXT NOT NULL,
      published_at TEXT NOT NULL,
      reading_minutes INTEGER NOT NULL,
      views INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      breaking INTEGER NOT NULL DEFAULT 0,
      trending INTEGER NOT NULL DEFAULT 0,
      hero_image TEXT NOT NULL,
      image_caption TEXT NOT NULL,
      body_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(), seo_title TEXT, seo_description TEXT, canonical_url TEXT, og_image TEXT, sponsored INTEGER NOT NULL DEFAULT 0, sponsor_name TEXT, expires_at TEXT, deleted_at TEXT, deleted_by TEXT, autosave_json TEXT, focus_keywords TEXT,
      FOREIGN KEY(category_slug) REFERENCES categories(slug),
      FOREIGN KEY(channel_slug) REFERENCES channels(slug),
      FOREIGN KEY(author_id) REFERENCES authors(id)
    );

CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      details TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

CREATE TABLE IF NOT EXISTS author_follows (
      reader_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY(reader_id, author_id),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE,
      FOREIGN KEY(author_id) REFERENCES authors(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS authors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT NOT NULL,
      bio TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS backup_records (
      id TEXT PRIMARY KEY,
      db_path TEXT NOT NULL,
      json_path TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'created',
      size_bytes INTEGER NOT NULL DEFAULT 0,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS blocked_ips (
      ip_address TEXT PRIMARY KEY,
      reason TEXT NOT NULL,
      expires_at TEXT,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS bookmarks (
      reader_id TEXT NOT NULL,
      article_id TEXT NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY(reader_id, article_id),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE,
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS breaking_news_alerts (
      id TEXT PRIMARY KEY,
      article_id TEXT,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'standard',
      priority_score INTEGER NOT NULL DEFAULT 50,
      banner_text TEXT NOT NULL,
      link_url TEXT NOT NULL,
      notify_push INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft',
      created_by TEXT,
      approved_by TEXT,
      activated_at TEXT,
      resolved_at TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE SET NULL,
      FOREIGN KEY(created_by) REFERENCES users(id),
      FOREIGN KEY(approved_by) REFERENCES users(id)
    );

CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

CREATE TABLE IF NOT EXISTS comment_reports (
      id TEXT PRIMARY KEY,
      comment_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      reporter_key TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS comment_votes (
      comment_id TEXT NOT NULL,
      voter_key TEXT NOT NULL,
      vote TEXT NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY(comment_id, voter_key),
      FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at timestamptz NOT NULL DEFAULT now(), parent_id TEXT, reader_id TEXT, likes INTEGER NOT NULL DEFAULT 0, dislikes INTEGER NOT NULL DEFAULT 0, report_count INTEGER NOT NULL DEFAULT 0, spam_score INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS community_poll_options (
      id TEXT PRIMARY KEY,
      poll_id TEXT NOT NULL,
      label TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(poll_id) REFERENCES community_polls(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS community_poll_votes (
      poll_id TEXT NOT NULL,
      option_id TEXT NOT NULL,
      voter_key TEXT NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY(poll_id, voter_key),
      FOREIGN KEY(poll_id) REFERENCES community_polls(id) ON DELETE CASCADE,
      FOREIGN KEY(option_id) REFERENCES community_poll_options(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS community_polls (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      body TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS community_replies (
      id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL,
      reader_id TEXT,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(topic_id) REFERENCES community_topics(id) ON DELETE CASCADE,
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS community_topic_votes (
      topic_id TEXT NOT NULL,
      voter_key TEXT NOT NULL,
      vote INTEGER NOT NULL DEFAULT 1,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY(topic_id, voter_key),
      FOREIGN KEY(topic_id) REFERENCES community_topics(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS community_topics (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      body TEXT NOT NULL,
      reader_id TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      created_at timestamptz NOT NULL DEFAULT now(), forum_category_id TEXT, pinned INTEGER NOT NULL DEFAULT 0, score INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS compliance_consents (
      id TEXT PRIMARY KEY,
      reader_id TEXT,
      consent_type TEXT NOT NULL,
      consent_value INTEGER NOT NULL DEFAULT 0,
      region TEXT,
      ip_address TEXT,
      user_agent TEXT,
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS conference_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      event_type TEXT NOT NULL DEFAULT 'conference',
      location TEXT NOT NULL,
      venue TEXT,
      starts_at TEXT NOT NULL,
      ends_at TEXT,
      timezone TEXT NOT NULL DEFAULT 'Asia/Beirut',
      cover_image TEXT,
      stream_url TEXT,
      ticket_type TEXT NOT NULL DEFAULT 'free',
      price_cents INTEGER NOT NULL DEFAULT 0,
      capacity INTEGER NOT NULL DEFAULT 0,
      sponsor TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS device_benchmarks (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      benchmark_name TEXT NOT NULL,
      score numeric NOT NULL DEFAULT 0,
      unit TEXT,
      note TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(device_id) REFERENCES devices(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS device_specs (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      spec_group TEXT NOT NULL DEFAULT 'General',
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(device_id) REFERENCES devices(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      brand TEXT NOT NULL,
      device_type TEXT NOT NULL DEFAULT 'phone',
      summary TEXT NOT NULL,
      image_url TEXT,
      release_year INTEGER NOT NULL DEFAULT 0,
      price_usd INTEGER NOT NULL DEFAULT 0,
      rating numeric NOT NULL DEFAULT 0,
      rank_score INTEGER NOT NULL DEFAULT 50,
      status TEXT NOT NULL DEFAULT 'published',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS directory_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      url TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      created_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS editorial_assignments (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      assignee_id TEXT NOT NULL,
      assigned_by TEXT,
      brief TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'normal',
      due_at TEXT,
      status TEXT NOT NULL DEFAULT 'assigned',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY(assignee_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(assigned_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS editorial_calendar_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      event_type TEXT NOT NULL DEFAULT 'deadline',
      starts_at TEXT NOT NULL,
      ends_at TEXT,
      article_id TEXT,
      owner_id TEXT,
      status TEXT NOT NULL DEFAULT 'planned',
      notes TEXT,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE SET NULL,
      FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS editorial_tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      task_type TEXT NOT NULL DEFAULT 'story',
      article_id TEXT,
      assignee_id TEXT,
      assigned_by TEXT,
      priority TEXT NOT NULL DEFAULT 'normal',
      status TEXT NOT NULL DEFAULT 'open',
      due_at TEXT,
      notes TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE SET NULL,
      FOREIGN KEY(assignee_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY(assigned_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS email_outbox (
      id TEXT PRIMARY KEY,
      to_email TEXT NOT NULL,
      from_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      provider TEXT NOT NULL DEFAULT 'dummy',
      status TEXT NOT NULL DEFAULT 'queued',
      related_type TEXT,
      related_id TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      sent_at TEXT
    , attempts INTEGER NOT NULL DEFAULT 0, provider_message_id TEXT, last_error TEXT);

CREATE TABLE IF NOT EXISTS event_agenda_items (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      starts_at TEXT NOT NULL,
      ends_at TEXT,
      track TEXT,
      speaker_ids TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(event_id) REFERENCES conference_events(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS event_registrations (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      reader_id TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      ticket_type TEXT NOT NULL DEFAULT 'free',
      status TEXT NOT NULL DEFAULT 'registered',
      payment_status TEXT NOT NULL DEFAULT 'manual',
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(event_id) REFERENCES conference_events(id) ON DELETE CASCADE,
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS event_speakers (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      title TEXT,
      company TEXT,
      bio TEXT,
      avatar TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(event_id) REFERENCES conference_events(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS feature_toggles (
      toggle_key TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      description TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      updated_by TEXT,
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(updated_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS forum_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS future_modules (
      key TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'planned',
      prototype_endpoint TEXT,
      business_value TEXT,
      technical_notes TEXT,
      updated_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS job_alerts (
      id TEXT PRIMARY KEY,
      reader_id TEXT,
      email TEXT NOT NULL,
      keywords TEXT,
      location TEXT,
      remote_type TEXT,
      frequency TEXT NOT NULL DEFAULT 'weekly',
      status TEXT NOT NULL DEFAULT 'active',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS job_applications (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL,
      reader_id TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      resume_url TEXT,
      cover_letter TEXT,
      skills_json TEXT NOT NULL DEFAULT '[]',
      match_score INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'submitted',
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(job_id) REFERENCES job_posts(id) ON DELETE CASCADE,
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS job_posts (
      id TEXT PRIMARY KEY,
      recruiter_id TEXT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      company_name TEXT NOT NULL,
      location TEXT NOT NULL,
      remote_type TEXT NOT NULL DEFAULT 'hybrid',
      job_type TEXT NOT NULL DEFAULT 'full-time',
      salary_min INTEGER NOT NULL DEFAULT 0,
      salary_max INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      description TEXT NOT NULL,
      requirements_json TEXT NOT NULL DEFAULT '[]',
      benefits_json TEXT NOT NULL DEFAULT '[]',
      apply_url TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      expires_at TEXT,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(recruiter_id) REFERENCES recruiter_accounts(id) ON DELETE SET NULL,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS job_queue (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      attempts INTEGER NOT NULL DEFAULT 0,
      run_at timestamptz NOT NULL DEFAULT now(),
      locked_at TEXT,
      completed_at TEXT,
      last_error TEXT,
      created_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS languages (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      native_name TEXT NOT NULL,
      direction TEXT NOT NULL DEFAULT 'ltr',
      enabled INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS live_event_comments (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      reader_id TEXT,
      name TEXT NOT NULL,
      email TEXT,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved',
      spam_score INTEGER NOT NULL DEFAULT 0,
      report_count INTEGER NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(event_id) REFERENCES live_events(id) ON DELETE CASCADE,
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS live_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      event_date TEXT,
      cover_image TEXT,
      host TEXT,
      notify_updates INTEGER NOT NULL DEFAULT 1,
      created_by TEXT,
      started_at TEXT,
      ended_at TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(), coverage_mode TEXT NOT NULL DEFAULT 'event', auto_refresh_seconds INTEGER NOT NULL DEFAULT 20, homepage_override INTEGER NOT NULL DEFAULT 0, allow_comments INTEGER NOT NULL DEFAULT 1, conference_event_id TEXT,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS live_updates (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      update_type TEXT NOT NULL DEFAULT 'text',
      source_url TEXT,
      notify_push INTEGER NOT NULL DEFAULT 0,
      pinned INTEGER NOT NULL DEFAULT 0,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(event_id) REFERENCES live_events(id) ON DELETE CASCADE,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS media_library (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT NOT NULL,
      alt_text TEXT,
      caption TEXT,
      folder TEXT NOT NULL DEFAULT 'Editorial',
      uploaded_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(), size_bytes INTEGER NOT NULL DEFAULT 0, optimized_url TEXT, metadata_json TEXT NOT NULL DEFAULT '{}', storage_provider TEXT NOT NULL DEFAULT 'local', storage_key TEXT, checksum TEXT, processing_status TEXT NOT NULL DEFAULT 'ready', scan_status TEXT NOT NULL DEFAULT 'not-scanned',
      FOREIGN KEY(uploaded_by) REFERENCES users(id)
    );

CREATE TABLE IF NOT EXISTS media_optimization_settings (
      setting_key TEXT PRIMARY KEY,
      setting_value TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      updated_by TEXT,
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(updated_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS media_variants (
      id TEXT PRIMARY KEY,
      media_id TEXT NOT NULL,
      label TEXT NOT NULL,
      width INTEGER NOT NULL DEFAULT 0,
      format TEXT NOT NULL,
      file_url TEXT NOT NULL,
      size_bytes INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'ready',
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(media_id) REFERENCES media_library(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS membership_plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      price_cents INTEGER NOT NULL DEFAULT 0,
      billing_period TEXT NOT NULL DEFAULT 'month',
      description TEXT NOT NULL,
      features_json TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS mobile_app_events (
      id TEXT PRIMARY KEY,
      reader_id TEXT,
      installation_id TEXT,
      event_type TEXT NOT NULL,
      screen TEXT,
      path TEXT,
      item_type TEXT,
      item_slug TEXT,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      platform TEXT,
      app_version TEXT,
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS mobile_devices (
      id TEXT PRIMARY KEY,
      reader_id TEXT,
      installation_id TEXT NOT NULL UNIQUE,
      platform TEXT NOT NULL DEFAULT 'unknown',
      app_version TEXT,
      device_name TEXT,
      device_token TEXT,
      push_enabled INTEGER NOT NULL DEFAULT 0,
      notification_channels_json TEXT NOT NULL DEFAULT '[]',
      last_seen_at timestamptz NOT NULL DEFAULT now(),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS mobile_offline_items (
      id TEXT PRIMARY KEY,
      reader_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      item_slug TEXT NOT NULL,
      title TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      downloaded_at timestamptz NOT NULL DEFAULT now(),
      expires_at TEXT,
      last_synced_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE(reader_id, item_type, item_slug),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS newsletter_automations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      trigger_type TEXT NOT NULL,
      segment TEXT NOT NULL DEFAULT 'weekly-tech',
      template_subject TEXT NOT NULL,
      template_body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS newsletter_campaigns (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      segment TEXT NOT NULL DEFAULT 'weekly-tech',
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      scheduled_at TEXT,
      sent_at TEXT,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(), template_json TEXT NOT NULL DEFAULT '{}', ab_variant TEXT, sent_count INTEGER NOT NULL DEFAULT 0, open_count INTEGER NOT NULL DEFAULT 0, click_count INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(created_by) REFERENCES users(id)
    );

CREATE TABLE IF NOT EXISTS newsletter_email_events (
      id TEXT PRIMARY KEY,
      campaign_id TEXT,
      subscriber_id TEXT,
      event_type TEXT NOT NULL,
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(campaign_id) REFERENCES newsletter_campaigns(id) ON DELETE SET NULL,
      FOREIGN KEY(subscriber_id) REFERENCES subscribers(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS newsroom_messages (
      id TEXT PRIMARY KEY,
      article_id TEXT,
      channel TEXT NOT NULL DEFAULT 'editorial',
      message TEXT NOT NULL,
      user_id TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS newsroom_shifts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      shift_role TEXT NOT NULL DEFAULT 'reporter',
      starts_at TEXT NOT NULL,
      ends_at TEXT,
      coverage_area TEXT,
      status TEXT NOT NULL DEFAULT 'scheduled',
      notes TEXT,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS notification_deliveries (
      id TEXT PRIMARY KEY,
      notification_id TEXT NOT NULL,
      reader_id TEXT,
      channel TEXT NOT NULL DEFAULT 'in_app',
      status TEXT NOT NULL DEFAULT 'delivered',
      read_at TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS notification_preferences (
      reader_id TEXT PRIMARY KEY,
      breaking INTEGER NOT NULL DEFAULT 1,
      newsletters INTEGER NOT NULL DEFAULT 1,
      live_events INTEGER NOT NULL DEFAULT 1,
      followed_authors TEXT NOT NULL DEFAULT '[]',
      favorite_categories TEXT NOT NULL DEFAULT '[]',
      push_enabled INTEGER NOT NULL DEFAULT 0,
      device_token TEXT,
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'general',
      target TEXT NOT NULL DEFAULT 'all',
      target_value TEXT,
      link_url TEXT,
      priority INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft',
      scheduled_at TEXT,
      sent_at TEXT,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id)
    );

CREATE TABLE IF NOT EXISTS paywall_rules (
      id TEXT PRIMARY KEY,
      article_id TEXT,
      category_slug TEXT,
      access_level TEXT NOT NULL DEFAULT 'free',
      preview_paragraphs INTEGER NOT NULL DEFAULT 2,
      active INTEGER NOT NULL DEFAULT 1,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY(category_slug) REFERENCES categories(slug) ON DELETE CASCADE,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS podcast_bookmarks (
      id TEXT PRIMARY KEY,
      episode_id TEXT NOT NULL,
      reader_id TEXT,
      listener_key TEXT,
      progress_seconds INTEGER NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(episode_id) REFERENCES podcast_episodes(id) ON DELETE CASCADE,
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS podcast_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      cover_image TEXT,
      seo_title TEXT,
      seo_description TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'published',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS podcast_distribution (
      id TEXT PRIMARY KEY,
      show_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      external_url TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      last_synced_at TEXT,
      validation_json TEXT NOT NULL DEFAULT '{}',
      FOREIGN KEY(show_id) REFERENCES podcast_shows(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS podcast_episodes (
      id TEXT PRIMARY KEY,
      show_id TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      audio_url TEXT NOT NULL,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      episode_number INTEGER NOT NULL DEFAULT 0,
      transcript TEXT,
      seo_title TEXT,
      seo_description TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft',
      published_at TEXT,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(), thumbnail_url TEXT, scheduled_at TEXT, tags_json TEXT NOT NULL DEFAULT '[]', metadata_json TEXT NOT NULL DEFAULT '{}', summary TEXT, chapters_json TEXT NOT NULL DEFAULT '[]', related_article_id TEXT, social_snippets_json TEXT NOT NULL DEFAULT '[]', clips_json TEXT NOT NULL DEFAULT '[]', audio_storage_provider TEXT NOT NULL DEFAULT 'local', processing_status TEXT NOT NULL DEFAULT 'ready', analytics_json TEXT NOT NULL DEFAULT '{}', premium INTEGER NOT NULL DEFAULT 0, sponsor_name TEXT,
      FOREIGN KEY(show_id) REFERENCES podcast_shows(id) ON DELETE CASCADE,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS podcast_events (
      id TEXT PRIMARY KEY,
      episode_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      listener_key TEXT,
      progress_seconds INTEGER NOT NULL DEFAULT 0,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      device_type TEXT,
      country TEXT,
      source TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(episode_id) REFERENCES podcast_episodes(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS podcast_shows (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      cover_image TEXT,
      host TEXT,
      language TEXT NOT NULL DEFAULT 'en',
      external_url TEXT,
      spotify_url TEXT,
      apple_url TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(), category_slug TEXT, hosts_json TEXT NOT NULL DEFAULT '[]', tags_json TEXT NOT NULL DEFAULT '[]', network_parent_id TEXT, seo_title TEXT, seo_description TEXT, featured INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS product_reviews (
      id TEXT PRIMARY KEY,
      article_id TEXT,
      product_name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      brand TEXT,
      product_category TEXT NOT NULL DEFAULT 'hardware',
      product_url TEXT,
      image_url TEXT,
      rating numeric NOT NULL DEFAULT 0,
      rating_max numeric NOT NULL DEFAULT 10,
      score_label TEXT,
      pros_json TEXT NOT NULL DEFAULT '[]',
      cons_json TEXT NOT NULL DEFAULT '[]',
      specs_json TEXT NOT NULL DEFAULT '[]',
      benchmarks_json TEXT NOT NULL DEFAULT '[]',
      comparisons_json TEXT NOT NULL DEFAULT '[]',
      verdict TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      reviewed_by TEXT,
      published_at TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE SET NULL,
      FOREIGN KEY(reviewed_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS reader_accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS reader_point_events (
      id TEXT PRIMARY KEY,
      reader_id TEXT NOT NULL,
      action TEXT NOT NULL,
      points INTEGER NOT NULL DEFAULT 0,
      reference_type TEXT,
      reference_id TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS reader_preferences (
      reader_id TEXT PRIMARY KEY,
      preferred_categories TEXT NOT NULL DEFAULT '[]',
      preferred_authors TEXT NOT NULL DEFAULT '[]',
      email_frequency TEXT NOT NULL DEFAULT 'weekly',
      theme TEXT NOT NULL DEFAULT 'system',
      language_code TEXT NOT NULL DEFAULT 'en',
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS reader_reading_activity (
      reader_id TEXT NOT NULL,
      article_slug TEXT NOT NULL,
      read_count INTEGER NOT NULL DEFAULT 0,
      max_scroll_depth INTEGER NOT NULL DEFAULT 0,
      total_seconds INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      last_read_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY(reader_id, article_slug),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS reader_reputation (
      reader_id TEXT PRIMARY KEY,
      points INTEGER NOT NULL DEFAULT 0,
      badges_json TEXT NOT NULL DEFAULT '[]',
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS reader_sessions (
      token TEXT PRIMARY KEY,
      reader_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS reader_streaks (
      reader_id TEXT PRIMARY KEY,
      current_streak INTEGER NOT NULL DEFAULT 0,
      best_streak INTEGER NOT NULL DEFAULT 0,
      last_active_date TEXT,
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS reader_subscriptions (
      id TEXT PRIMARY KEY,
      reader_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      started_at timestamptz NOT NULL DEFAULT now(),
      renews_at TEXT,
      provider TEXT NOT NULL DEFAULT 'manual',
      provider_ref TEXT,
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE,
      FOREIGN KEY(plan_id) REFERENCES membership_plans(id)
    );

CREATE TABLE IF NOT EXISTS recruiter_accounts (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      website TEXT,
      logo_url TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS revenue_events (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      source_id TEXT,
      amount_cents INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      description TEXT,
      created_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      permissions_json TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS saved_search_filters (
      id TEXT PRIMARY KEY,
      reader_id TEXT NOT NULL,
      name TEXT NOT NULL,
      filters_json TEXT NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS search_events (
      id TEXT PRIMARY KEY,
      query TEXT NOT NULL,
      normalized_query TEXT NOT NULL,
      category_slug TEXT,
      tag_slug TEXT,
      author_id TEXT,
      result_count INTEGER NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now()
    , content_type TEXT, corrected_query TEXT, voice_query INTEGER NOT NULL DEFAULT 0, country TEXT, device_type TEXT);

CREATE TABLE IF NOT EXISTS search_index (
      id TEXT PRIMARY KEY,
      item_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      body TEXT,
      category_slug TEXT,
      author_id TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      image_url TEXT,
      url TEXT NOT NULL,
      popularity INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      vector_json TEXT NOT NULL DEFAULT '[]',
      updated_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE(item_type, slug)
    );

CREATE TABLE IF NOT EXISTS security_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      ip_address TEXT,
      path TEXT,
      user_agent TEXT,
      severity TEXT NOT NULL DEFAULT 'low',
      details TEXT,
      created_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS security_policies (
      policy_key TEXT PRIMARY KEY,
      policy_value TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      updated_by TEXT,
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(updated_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS seo_indexing_queue (
      id TEXT PRIMARY KEY,
      item_type TEXT NOT NULL,
      item_slug TEXT NOT NULL,
      provider TEXT NOT NULL DEFAULT 'internal',
      status TEXT NOT NULL DEFAULT 'queued',
      payload_json TEXT NOT NULL DEFAULT '{}',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      completed_at TEXT,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS seo_link_approvals (
      id TEXT PRIMARY KEY,
      source_slug TEXT NOT NULL,
      target_slug TEXT NOT NULL,
      anchor_text TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'suggested',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(), csrf_token TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS site_settings (
      setting_key TEXT PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS sponsored_campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sponsor TEXT NOT NULL,
      budget_cents INTEGER NOT NULL DEFAULT 0,
      starts_at TEXT,
      ends_at TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      notes TEXT,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(), legal_status TEXT NOT NULL DEFAULT 'pending', analytics_json TEXT NOT NULL DEFAULT '{}',
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS startup_founders (
      id TEXT PRIMARY KEY,
      startup_id TEXT NOT NULL,
      name TEXT NOT NULL,
      title TEXT,
      bio TEXT,
      avatar TEXT,
      social_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(startup_id) REFERENCES startup_profiles(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS startup_funding_rounds (
      id TEXT PRIMARY KEY,
      startup_id TEXT NOT NULL,
      round_name TEXT NOT NULL,
      amount_usd INTEGER NOT NULL DEFAULT 0,
      announced_at TEXT,
      investors_json TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY(startup_id) REFERENCES startup_profiles(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS startup_profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      website TEXT,
      logo_url TEXT,
      headquarters TEXT,
      sector TEXT NOT NULL DEFAULT 'software',
      stage TEXT NOT NULL DEFAULT 'seed',
      founded_year INTEGER NOT NULL DEFAULT 0,
      total_funding_usd INTEGER NOT NULL DEFAULT 0,
      rank_score INTEGER NOT NULL DEFAULT 50,
      status TEXT NOT NULL DEFAULT 'published',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS subscribers (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      segment TEXT NOT NULL DEFAULT 'weekly-tech',
      status TEXT NOT NULL DEFAULT 'subscribed',
      source TEXT NOT NULL DEFAULT 'website',
      created_at timestamptz NOT NULL DEFAULT now()
    , verification_token TEXT, confirmed_at TEXT, unsubscribed_at TEXT, preferences_json TEXT NOT NULL DEFAULT '{}');

CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role_id TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at timestamptz NOT NULL DEFAULT now(), two_factor_secret TEXT, two_factor_enabled INTEGER NOT NULL DEFAULT 0, reset_token TEXT, reset_expires TEXT,
      FOREIGN KEY(role_id) REFERENCES roles(id)
    );

CREATE TABLE IF NOT EXISTS video_bookmarks (
      id TEXT PRIMARY KEY,
      video_id TEXT NOT NULL,
      reader_id TEXT,
      viewer_key TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE CASCADE,
      FOREIGN KEY(reader_id) REFERENCES reader_accounts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS video_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      thumbnail_url TEXT,
      parent_id TEXT,
      seo_title TEXT,
      seo_description TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'published',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(parent_id) REFERENCES video_categories(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS video_chapters (
      id TEXT PRIMARY KEY,
      video_id TEXT NOT NULL,
      starts_at_seconds INTEGER NOT NULL DEFAULT 0,
      title TEXT NOT NULL,
      url TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS video_events (
      id TEXT PRIMARY KEY,
      video_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      viewer_key TEXT,
      progress_seconds INTEGER NOT NULL DEFAULT 0,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      device_type TEXT,
      country TEXT,
      source TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS video_playlists (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );

CREATE TABLE IF NOT EXISTS video_tag_links (
      video_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY(video_id, tag_id),
      FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE CASCADE,
      FOREIGN KEY(tag_id) REFERENCES video_tags(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS video_tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      playlist_id TEXT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      video_url TEXT NOT NULL,
      source_type TEXT NOT NULL DEFAULT 'upload',
      thumbnail_url TEXT,
      category_slug TEXT,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      transcript TEXT,
      seo_title TEXT,
      seo_description TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft',
      published_at TEXT,
      created_by TEXT,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(), hls_url TEXT, dash_url TEXT, subtitles_json TEXT NOT NULL DEFAULT '[]', streaming_provider TEXT NOT NULL DEFAULT 'local', processing_status TEXT NOT NULL DEFAULT 'ready', live_chat_enabled INTEGER NOT NULL DEFAULT 0, analytics_json TEXT NOT NULL DEFAULT '{}', video_category_slug TEXT,
      FOREIGN KEY(playlist_id) REFERENCES video_playlists(id) ON DELETE SET NULL,
      FOREIGN KEY(category_slug) REFERENCES categories(slug) ON DELETE SET NULL,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );
