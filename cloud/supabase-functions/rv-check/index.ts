// REVENGE UPTIME — real check engine (Supabase Edge Function)
// Runs from pg_cron every minute; protected by RV_CRON_SECRET.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CRON_SECRET = Deno.env.get("RV_CRON_SECRET")!;
const REST = `${SUPABASE_URL}/rest/v1`;
const jsonHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "x-rv-secret, content-type" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: jsonHeaders });
const h = (extra: Record<string, string> = {}) => ({ apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, ...extra });

async function notify(incidentId: number | null, monitor: any, status: string, detail: string, event: string) {
  const nr = await fetch(`${REST}/rv_notifications?active=eq.true&select=*`, { headers: h() });
  const channels = await nr.json();
  for (const c of channels) {
    let ok = false, info = "";
    try {
      const payload = {
        text: `⚡ REVENGE UPTIME ${event}: ${monitor.name} (${monitor.url})\nStatus: ${status}\nDetail: ${detail}`,
        monitor: monitor.name, status, detail, poweredBy: "idam Emmanuel",
      };
      const r = await fetch(c.target, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
      ok = r.ok; info = `HTTP ${r.status}`;
    } catch (e) { info = e instanceof Error ? e.message : String(e); }
    await fetch(`${REST}/rv_notification_log`, { method: "POST", headers: h({ "Content-Type": "application/json", Prefer: "return=minimal" }), body: JSON.stringify({ incident_id: incidentId, notification_id: c.id, ok, detail: info }) });
  }
}

async function check(m: any) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  const start = Date.now();
  let status = "down", code: number | null = null, detail = "No response";
  try {
    const r = await fetch(m.url, { redirect: "follow", signal: controller.signal, headers: { "user-agent": "REVENGE UPTIME/1.1" } });
    code = r.status;
    const body = await r.text();
    const codeOk = code >= 200 && code < 400;
    const keywordOk = !m.keyword || body.includes(m.keyword);
    status = codeOk && keywordOk ? "up" : "down";
    detail = codeOk ? (keywordOk ? "OK" : "Keyword not found") : `HTTP ${code}`;
  } catch (e) { detail = e instanceof Error ? e.message : String(e); }
  finally { clearTimeout(timer); }

  const ms = Date.now() - start, now = new Date().toISOString();
  await fetch(`${REST}/rv_heartbeats`, { method: "POST", headers: h({ "Content-Type": "application/json", Prefer: "return=minimal" }), body: JSON.stringify({ monitor_id: m.id, status, response_ms: ms, status_code: code, detail, created_at: now }) });

  const since = new Date(Date.now() - 86400000).toISOString();
  const hr = await fetch(`${REST}/rv_heartbeats?monitor_id=eq.${m.id}&created_at=gte.${encodeURIComponent(since)}&select=status`, { headers: h() });
  const hist: { status: string }[] = await hr.json();
  const uptime = hist.length ? Math.round((hist.filter(x => x.status === "up").length / hist.length) * 10000) / 100 : 100;

  let incidentId: number | null = null;
  if (m.status === "up" && status === "down") {
    const ir = await fetch(`${REST}/rv_incidents`, { method: "POST", headers: h({ "Content-Type": "application/json", Prefer: "return=representation" }), body: JSON.stringify({ monitor_id: m.id, reason: detail, status: "ongoing", started_at: now }) });
    const rows = await ir.json(); incidentId = rows[0]?.id ?? null;
    await notify(incidentId, m, status, detail, "DOWN ALERT");
  } else if (m.status === "down" && status === "up") {
    const open: { id: number; started_at: string }[] = await (await fetch(`${REST}/rv_incidents?monitor_id=eq.${m.id}&status=eq.ongoing&select=id,started_at`, { headers: h() })).json();
    for (const inc of open) {
      const duration = Math.max(0, Math.floor((Date.now() - new Date(inc.started_at).getTime()) / 1000));
      await fetch(`${REST}/rv_incidents?id=eq.${inc.id}`, { method: "PATCH", headers: h({ "Content-Type": "application/json", Prefer: "return=minimal" }), body: JSON.stringify({ status: "resolved", resolved_at: now, duration_seconds: duration }) });
      await notify(inc.id, m, status, detail, "RECOVERED");
    }
  }

  await fetch(`${REST}/rv_monitors?id=eq.${m.id}`, { method: "PATCH", headers: h({ "Content-Type": "application/json", Prefer: "return=minimal" }), body: JSON.stringify({ status, last_checked_at: now, last_response_ms: ms, last_status_code: code, uptime_24h: uptime }) });
  return { id: m.id, name: m.name, status, responseMs: ms, statusCode: code, uptime };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: jsonHeaders });
  if (req.headers.get("x-rv-secret") !== CRON_SECRET) return json({ error: "unauthorized" }, 401);
  try {
    const monitors = await (await fetch(`${REST}/rv_monitors?active=eq.true&select=*`, { headers: h() })).json();
    const results = [];
    for (const m of monitors) results.push(await check(m));
    return json({ ok: true, checked: results.length, results, at: new Date().toISOString() });
  } catch (e) { return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500); }
});
