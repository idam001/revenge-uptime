-- REVENGE UPTIME — complete Supabase schema (free tier)
-- Run in Supabase SQL editor. Replace placeholders before running the cron statement.

create table if not exists public.rv_monitors (
    id bigint generated always as identity primary key,
    name text not null,
    url text not null,
    type text not null default 'http',
    keyword text,
    interval_seconds integer not null default 60,
    active boolean not null default true,
    status text not null default 'pending',
    last_checked_at timestamptz,
    last_response_ms integer,
    last_status_code integer,
    uptime_24h numeric(6,2) not null default 100,
    created_at timestamptz not null default now()
);

create table if not exists public.rv_heartbeats (
    id bigint generated always as identity primary key,
    monitor_id bigint not null references public.rv_monitors(id) on delete cascade,
    status text not null,
    response_ms integer,
    status_code integer,
    detail text,
    created_at timestamptz not null default now()
);
create index if not exists rv_heartbeats_monitor_time_idx on public.rv_heartbeats (monitor_id, created_at desc);

create table if not exists public.rv_incidents (
    id bigint generated always as identity primary key,
    monitor_id bigint not null references public.rv_monitors(id) on delete cascade,
    reason text,
    status text not null default 'ongoing',
    started_at timestamptz not null default now(),
    resolved_at timestamptz,
    duration_seconds integer
);
create index if not exists rv_incidents_monitor_started on public.rv_incidents (monitor_id, started_at desc);

create table if not exists public.rv_notifications (
    id bigint generated always as identity primary key,
    name text not null,
    type text not null default 'webhook',
    target text not null,
    active boolean not null default true,
    created_at timestamptz not null default now()
);
create table if not exists public.rv_notification_log (
    id bigint generated always as identity primary key,
    incident_id bigint,
    notification_id bigint,
    ok boolean not null default false,
    detail text,
    created_at timestamptz not null default now()
);
create table if not exists public.rv_status_pages (
    id bigint generated always as identity primary key,
    slug text not null unique,
    title text not null,
    description text,
    active boolean not null default true,
    created_at timestamptz not null default now()
);
create table if not exists public.rv_status_page_monitors (
    page_id bigint not null references public.rv_status_pages(id) on delete cascade,
    monitor_id bigint not null references public.rv_monitors(id) on delete cascade,
    primary key (page_id, monitor_id)
);
create table if not exists public.rv_maintenance (
    id bigint generated always as identity primary key,
    title text not null,
    starts_at timestamptz not null,
    ends_at timestamptz not null,
    active boolean not null default true,
    created_at timestamptz not null default now()
);

-- Public read access for the dashboard and public status pages.
grant usage on schema public to anon, authenticated;
grant select on public.rv_monitors, public.rv_heartbeats, public.rv_incidents,
    public.rv_notifications, public.rv_notification_log, public.rv_status_pages,
    public.rv_status_page_monitors, public.rv_maintenance to anon, authenticated;

alter table public.rv_monitors enable row level security;
alter table public.rv_heartbeats enable row level security;
alter table public.rv_incidents enable row level security;
alter table public.rv_notifications enable row level security;
alter table public.rv_notification_log enable row level security;
alter table public.rv_status_pages enable row level security;
alter table public.rv_status_page_monitors enable row level security;
alter table public.rv_maintenance enable row level security;

do $$ declare t text; begin
  foreach t in array array['rv_monitors','rv_heartbeats','rv_incidents','rv_notifications','rv_notification_log','rv_status_pages','rv_status_page_monitors','rv_maintenance'] loop
    execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true)', t || '_public_read', t);
  end loop;
end $$;

-- One minute scheduling, free-tier friendly.
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.unschedule(jobid) from cron.job where jobname = 'revenge-uptime-checks';
select cron.schedule(
    'revenge-uptime-checks',
    '* * * * *',
    $$select net.http_post(
        url := 'https://YOUR-PROJECT.supabase.co/functions/v1/rv-check',
        headers := jsonb_build_object('Content-Type', 'application/json', 'x-rv-secret', '<RV_CRON_SECRET>'),
        body := '{}'::jsonb
    )$$
);
