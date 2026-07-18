-- Run once in Supabase Dashboard → SQL Editor → New query.
-- All browser access is intentionally blocked by RLS. CivicShield's server API uses
-- SUPABASE_SERVICE_ROLE_KEY, while the public dashboard exposes only safe columns.

create table if not exists public.civic_reports (
  id bigint generated always as identity primary key,
  report_id text unique not null,
  description text not null,
  location_label text not null,
  latitude double precision,
  longitude double precision,
  duration text not null,
  affected_people integer check (affected_people is null or affected_people > 0),
  extra_details text,
  attachment_count integer not null default 0 check (attachment_count >= 0),
  category text,
  urgency text check (urgency in ('low', 'medium', 'high', 'critical')),
  route_name text,
  analysis jsonb,
  status text not null default 'ready-to-analyze' check (status in ('draft', 'ready-to-analyze', 'submitted', 'delivery-confirmed', 'acknowledged', 'assigned', 'in-progress', 'department-resolved', 'verification-pending', 'verified-resolved', 'disputed', 'reopened', 'overdue')),
  email_recipient text,
  gmail_message_id text,
  email_sent_at timestamptz,
  public_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.report_status_events (
  id bigint generated always as identity primary key,
  report_id text not null references public.civic_reports(report_id) on delete cascade,
  status text not null,
  note text not null,
  public_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.emergency_reports (
  id bigint generated always as identity primary key,
  emergency_id text unique not null,
  emergency_type text not null,
  location_label text not null,
  latitude double precision,
  longitude double precision,
  details text,
  is_safe boolean not null default false,
  public_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.community_verifications (
  id bigint generated always as identity primary key,
  report_id text not null references public.civic_reports(report_id) on delete cascade,
  client_token text not null,
  verdict text not null check (verdict in ('verified', 'disputed')),
  created_at timestamptz not null default now(),
  unique (report_id, client_token)
);

create index if not exists civic_reports_public_created_idx on public.civic_reports (public_visible, created_at desc);
create index if not exists report_status_events_report_idx on public.report_status_events (report_id, created_at desc);
create index if not exists emergency_reports_public_created_idx on public.emergency_reports (public_visible, created_at desc);
create index if not exists community_verifications_report_idx on public.community_verifications (report_id, created_at desc);

alter table public.civic_reports enable row level security;
alter table public.report_status_events enable row level security;
alter table public.emergency_reports enable row level security;
alter table public.community_verifications enable row level security;

-- No anon/authenticated policies by design. Only server code using the service-role key
-- can read or write rows. Do not add a broad public select policy.
