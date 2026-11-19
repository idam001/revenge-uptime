# REVENGE UPTIME — free cloud app (Supabase + Vercel)

This is the always-on, free-tier application layer. It is **not a mock**: checks, heartbeats, incidents,
alert delivery and writes all happen against Supabase from Vercel.

## Features

- Rebuilt v2 console: refined dark design system, SVG icon set, glass panels, gradient accents and micro-interactions
- Good navigation: grouped sidebar, breadcrumbs, command palette (⌘/Ctrl+K), keyboard shortcuts and mobile drawer
- Synchronization engine: 10-second cloud polling, cross-tab BroadcastChannel, online/visibility reconciliation and optimistic write states
- Full control surface: monitor CRUD, bulk pause/resume/delete, duplicate, dense-view mode and session lock/unlock
- Monitor table with search, status segments, four sort modes, uptime bars, latency and sortable columns
- Monitor detail with gradient response-time chart, availability heatmap and automatic incident timeline
- Incidents with ongoing/resolved filters, manual resolve and delete
- Alert contacts with webhook / Slack / Discord channels and live test delivery
- Status pages with editor, monitor selection and a public component/timeline view
- Maintenance windows, integrations/API reference, team view and settings console
- Verified end-to-end in a real browser: navigation, command palette, monitor create and bulk pause/delete

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
