<div align="center">

# ⚡ REVENGE UPTIME

**Premium uptime monitoring — fully self-hosted, no monthly fees.**

<p>Powered by <strong>idam Emmanuel</strong></p>

</div>

---

REVENGE UPTIME is a rebranded, custom-themed fork of the excellent open-source
[Uptime Kuma](https://github.com/louislam/uptime-kuma) project (MIT License, Copyright © 2021 Louis Lam).
It is a real monitoring server — not a mock or simulation. It runs background checks, stores heartbeats,
sends alerts, and serves public status pages.

## What it does

- HTTP/HTTPS, HTTP keyword, HTTP JSON query, TCP port, Ping, DNS, Push (heartbeat), Docker and more
- Configurable check intervals down to 20 seconds, retries, and upside-down monitors
- Real-time dashboard over WebSocket with heartbeat bars and response-time charts
- Public status pages with custom branding, incidents, and maintenance windows
- 90+ notification providers (email/SMTP, Telegram, Discord, Slack, webhook, and more)
- Auth, multi-user access, 2FA, proxy support, Prometheus metrics

## Quick start (free, self-hosted)

Requires Node.js **20.4+** (this fork is pinned to Uptime Kuma 2.5.12 for Node 20 compatibility).

```bash
npm ci
npm run build
npm start
```

Open `http://localhost:3001`, create your admin account, then add your first monitor.
Data is stored locally in `data/kuma.db` — back up that file.

### Development

```bash
npm ci
npm run dev
```

The dev server runs the frontend on port 3000 and the API/WebSocket server on port 3001.

### Docker

```bash
docker compose up -d
```

See `compose.yaml` for the service definition and volume mapping.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3001` | Server port |
| `HOST` | `0.0.0.0` | Bind address |
| `NODE_ENV` | `production` | Set to `development` for HMR |
| `DATA_DIR` | `./data` | Database / upload directory |
| `BASE_URL` | auto | Public URL behind a reverse proxy |

## Deployment notes

This is a **stateful Node server** (scheduler + WebSocket + local database), so it cannot run directly on a
serverless platform such as Vercel Functions. Deploy it on any always-on host: a VPS, a home server, a Raspberry Pi,
or a container platform with a persistent volume. For a free cloud setup, pair this server with a database backup
and put a reverse proxy (Caddy/Nginx/Cloudflare Tunnel) in front of it.

The companion `cloud/` directory contains the optional Supabase + Vercel layer: a scheduled serverless check engine
and a public status page that can run entirely on free tiers.

## License & attribution

REVENGE UPTIME is distributed under the **MIT License** (see `LICENSE`).
It is derived from Uptime Kuma by Louis Lam; the original copyright notice is preserved in `LICENSE`.
Branding, theme, icon and the "Powered by idam Emmanuel" signature are modifications by idam Emmanuel.

Original project: https://github.com/louislam/uptime-kuma
This fork: https://github.com/idam001/revenge-uptime
