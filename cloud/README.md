# REVENGE UPTIME — free cloud layer (Supabase + Vercel)

This directory contains the optional serverless companion to the main self-hosted REVENGE UPTIME server.

## Why it exists

The core app in this repository is a stateful Node.js server. It cannot run inside Vercel's serverless runtime,
and Vercel's free cron only runs once per day. This cloud layer uses the actually-free pieces instead:

| Piece | What it does | Cost |
| --- | --- | --- |
| Supabase Postgres | Stores monitors and heartbeats (`rv_monitors`, `rv_heartbeats`) | Free tier |
| Supabase Edge Function `rv-check` | Performs real HTTP/HTTPS + keyword checks and records every result | Free tier |
| Supabase `pg_cron` + `pg_net` | Triggers the check function once per minute | Free tier |
| Vercel static dashboard | Live UptimeRobot-style dashboard reading Supabase over REST | Free (Hobby) |

## Files

- `supabase/schema.sql` — tables, RLS policies and the minute cron job (secret placeholders).
- `supabase-functions/rv-check/index.ts` — the Deno check engine source.
- `web/index.html` — the deployed Vercel dashboard (single file, no external dependencies).

## Deployment recap

1. Run `supabase/schema.sql` in your Supabase SQL editor.
2. Set edge-function secrets: `RV_CRON_SECRET` (and the platform-provided `SUPABASE_URL` /
   `SUPABASE_SERVICE_ROLE_KEY` are used automatically).
3. Deploy `supabase-functions/rv-check/index.ts` as edge function `rv-check` with JWT verification disabled.
4. Put the same `RV_CRON_SECRET` into the `cron.schedule` call in SQL.
5. Deploy `web/index.html` to a Vercel project. The Supabase anon key is a **publishable** key and is safe to
   embed; RLS allows public reads of monitor/heartbeat data only.

## Live deployment (idam001)

- Dashboard: https://revenge-uptime-web-idamemmanuel202-7391.vercel.app
- Check engine: `rv-check` on the REVENGE GPT Supabase project
- Schedule: `revenge-uptime-checks`, every minute

No API secret is stored in this repository.
