# REVENGE UPTIME — free cloud app (Supabase + Vercel)

This is the always-on, free-tier application layer. It is **not a mock**: checks, heartbeats, incidents,
alert delivery and writes all happen against Supabase from Vercel.

## Features

- UptimeRobot-style dark dashboard: left navigation, dense monitor table, right status rail
- Monitor CRUD: add, edit, pause/resume and delete real monitors
- Search, status filter and sorting; segmented 24h availability bars; uptime percentages
- Monitor detail page: response-time chart, average/max latency, availability, incident history
- Incidents: automatically opened on DOWN and resolved on RECOVERY, with real durations
- Alert contacts: webhook / Slack / Discord channels, test button, automatic DOWN/UP alerts
- Status pages: create, edit, publish and view public pages with selected monitors
- Maintenance windows, integrations/API page, team/owner view
- 15-second dashboard refresh; responsive mobile layout
- Verified end-to-end in a real browser: navigation, monitor create/delete, and all read views

## Architecture

| Piece | Role |
| --- | --- |
| `supabase/schema.sql` | Tables, RLS policies, public read grants, minute cron |
| `supabase-functions/rv-check/index.ts` | Real HTTP/keyword checks, heartbeats, incidents, alert fan-out |
| `supabase-functions/rv-api/index.ts` | Authenticated CRUD API for all write actions |
| `web/index.html`, `web/styles.css`, `web/app.js` | The Vercel-deployed single-page dashboard |

Secrets (`RV_CRON_SECRET`, `RV_ADMIN_SECRET`) live only as Supabase edge-function secrets.
The admin secret is entered once in the browser and kept in `sessionStorage`; it is never in source.

## Live deployment (idam001)

- Dashboard: https://revenge-uptime-web.vercel.app
- Supabase project: `fszewuewdsjloiwwggvy`
- Edge functions: `rv-check`, `rv-api`
- Cron: `revenge-uptime-checks`, every minute

Vercel's Git deployments failed with `git_info_fail` in this environment, so the production entry document is
deployed from uploaded files and loads `cloud/web/styles.css` and `cloud/web/app.js` from a commit-pinned jsDelivr
URL. Any future dashboard change should be committed, then the pinned hash in the Vercel deployment's `index.html`
updated and redeployed.

## Original project

The full self-hosted Uptime Kuma-derived application is in the repository root. This cloud app is the
free hosted companion because the Kuma server itself needs a persistent Node process.
