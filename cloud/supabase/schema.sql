-- REVENGE UPTIME — Supabase schema (free tier)
-- Run in Supabase SQL editor. Replace <RV_CRON_SECRET> before running the cron statement.

create table if not exists public.rv_monitors (
    id bigint generated always as identity primary key,
    name text not null,
    url text not null,
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

create index if not exists rv_heartbeats_monitor_time_idx
    on public.rv_heartbeats (monitor_id, created_at desc);

alter table public.rv_monitors enable row level security;
alter table public.rv_heartbeats enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.rv_monitors, public.rv_heartbeats to anon, authenticated;

drop policy if exists rv_monitors_public_read on public.rv_monitors;
create policy rv_monitors_public_read on public.rv_monitors
    for select to anon, authenticated using (true);

drop policy if exists rv_heartbeats_public_read on public.rv_heartbeats;
create policy rv_heartbeats_public_read on public.rv_heartbeats
    for select to anon, authenticated using (true);

-- One minute scheduling, free-tier friendly.
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule(jobid) from cron.job where jobname = 'revenge-uptime-checks';
select cron.schedule(
    'revenge-uptime-checks',
    '* * * * *',
    $$select net.http_post(
        url := 'https://YOUR-PROJECT.supabase.co/functions/v1/rv-check',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-rv-secret', '<RV_CRON_SECRET>'
        ),
        body := '{}'::jsonb
    )$$
);
