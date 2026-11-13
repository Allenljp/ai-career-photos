-- AI Career Headshots · Postgres schema (build doc §6)
-- Apply in Supabase SQL editor or via migration tooling.

create table orders (
  id uuid primary key default gen_random_uuid(),
  email text,
  status text not null default 'created', -- created|preview_ready|paid|generating|ready|delivered|refunded|failed
  amount_cents int default 2900,
  currency text default 'USD',
  creem_order_id text,
  target_role text,
  style text default 'professional',
  fingerprint text,
  utm jsonb,
  created_at timestamptz default now(),
  paid_at timestamptz,
  delivered_at timestamptz,
  refunded_at timestamptz
);

create table uploads (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  r2_key text not null,
  mime text, bytes int,
  face_count int, quality_score real,
  created_at timestamptz default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  kind text not null, -- preview|full
  status text not null default 'queued', -- queued|running|succeeded|failed
  attempts int default 0,
  provider text, provider_job_id text,
  error text,
  started_at timestamptz, finished_at timestamptz,
  created_at timestamptz default now()
);

create table assets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  kind text not null, -- headshot|pdf
  r2_key text not null,
  width int, height int,
  face_similarity real, aesthetic_score real,
  selected boolean default false,
  created_at timestamptz default now()
);

create table events (
  id bigserial primary key,
  order_id uuid,
  name text not null,
  meta jsonb,
  created_at timestamptz default now()
);

create table rate_limits (
  key text primary key,
  window_start timestamptz not null,
  count int not null default 0
);
