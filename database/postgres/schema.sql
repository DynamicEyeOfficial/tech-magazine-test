CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  permissions_json jsonb NOT NULL DEFAULT '[]'
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role_id uuid REFERENCES roles(id),
  avatar text,
  bio text,
  status text NOT NULL DEFAULT 'active',
  two_factor_secret text,
  two_factor_enabled boolean NOT NULL DEFAULT false,
  reset_token text,
  reset_expires timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  color text NOT NULL,
  icon text NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE authors (
  id text PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  avatar text NOT NULL,
  bio text NOT NULL
);

CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  subtitle text NOT NULL,
  category_slug text NOT NULL REFERENCES categories(slug),
  channel_slug text NOT NULL REFERENCES channels(slug),
  author_id text NOT NULL REFERENCES authors(id),
  published_at date NOT NULL,
  reading_minutes integer NOT NULL DEFAULT 4,
  views integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  breaking boolean NOT NULL DEFAULT false,
  trending boolean NOT NULL DEFAULT false,
  hero_image text NOT NULL,
  image_caption text NOT NULL,
  body_json jsonb NOT NULL,
  seo_title text,
  seo_description text,
  canonical_url text,
  og_image text,
  sponsored boolean NOT NULL DEFAULT false,
  sponsor_name text,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE
);

CREATE TABLE article_tags (
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY(article_id, tag_id)
);

CREATE TABLE reader_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  avatar text,
  bio text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  parent_id uuid,
  reader_id uuid REFERENCES reader_accounts(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  user_email text,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  likes integer NOT NULL DEFAULT 0,
  dislikes integer NOT NULL DEFAULT 0,
  report_count integer NOT NULL DEFAULT 0,
  spam_score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  segment text NOT NULL DEFAULT 'weekly-tech',
  status text NOT NULL DEFAULT 'subscribed',
  source text NOT NULL DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE newsletter_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  segment text NOT NULL DEFAULT 'weekly-tech',
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  alt_text text,
  caption text,
  folder text NOT NULL DEFAULT 'Editorial',
  uploaded_by uuid REFERENCES users(id),
  size_bytes integer NOT NULL DEFAULT 0,
  optimized_url text,
  metadata_json jsonb NOT NULL DEFAULT '{}',
  storage_provider text NOT NULL DEFAULT 'local',
  storage_key text,
  checksum text,
  processing_status text NOT NULL DEFAULT 'ready',
  scan_status text NOT NULL DEFAULT 'not-scanned',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE video_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'published',
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE video_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  thumbnail_url text,
  parent_id uuid REFERENCES video_categories(id) ON DELETE SET NULL,
  seo_title text,
  seo_description text,
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES video_playlists(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  video_url text NOT NULL,
  hls_url text,
  dash_url text,
  source_type text NOT NULL DEFAULT 'upload',
  thumbnail_url text,
  subtitles_json jsonb NOT NULL DEFAULT '[]',
  streaming_provider text NOT NULL DEFAULT 'local',
  processing_status text NOT NULL DEFAULT 'ready',
  live_chat_enabled boolean NOT NULL DEFAULT false,
  analytics_json jsonb NOT NULL DEFAULT '{}',
  video_category_slug text REFERENCES video_categories(slug) ON DELETE SET NULL,
  category_slug text REFERENCES categories(slug) ON DELETE SET NULL,
  duration_seconds integer NOT NULL DEFAULT 0,
  transcript text,
  seo_title text,
  seo_description text,
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE video_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  viewer_key text,
  progress_seconds integer NOT NULL DEFAULT 0,
  duration_seconds integer NOT NULL DEFAULT 0,
  device_type text,
  country text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE membership_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  price_cents integer NOT NULL DEFAULT 0,
  billing_period text NOT NULL DEFAULT 'month',
  description text NOT NULL,
  features_json jsonb NOT NULL DEFAULT '[]',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reader_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reader_id uuid NOT NULL REFERENCES reader_accounts(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES membership_plans(id),
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  renews_at timestamptz,
  provider text NOT NULL DEFAULT 'manual',
  provider_ref text
);

CREATE TABLE affiliate_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  partner text NOT NULL,
  target_url text NOT NULL,
  campaign text NOT NULL DEFAULT 'general',
  commission_note text,
  active boolean NOT NULL DEFAULT true,
  clicks integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE community_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  body text NOT NULL,
  reader_id uuid REFERENCES reader_accounts(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE directory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  url text,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE job_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  payload_json jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'queued',
  attempts integer NOT NULL DEFAULT 0,
  run_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  completed_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_articles_status_date ON articles(status, published_at DESC);
CREATE INDEX idx_articles_category ON articles(category_slug);
CREATE INDEX idx_job_queue_status_run_at ON job_queue(status, run_at);
