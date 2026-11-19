// REVENGE UPTIME — authenticated CRUD API (Supabase Edge Function)
// Secret is supplied as x-rv-admin header; never stored in source.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_SECRET = Deno.env.get("RV_ADMIN_SECRET")!;
const REST = `${SUPABASE_URL}/rest/v1`;
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, x-rv-admin" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers });
const h = (extra: Record<string, string> = {}) => ({ apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, ...extra });

async function read(table: string, query = "") {
  const r = await fetch(`${REST}/${table}?select=*${query}`, { headers: h() });
  return await r.json();
}
async function insert(table: string, body: any, returning = false) {
  const r = await fetch(`${REST}/${table}`, { method: "POST", headers: h({ "Content-Type": "application/json", Prefer: returning ? "return=representation" : "return=minimal" }), body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${table}: ${await r.text()}`);
  return returning ? await r.json() : { ok: true };
}
async function patch(table: string, id: number, body: any) {
  const r = await fetch(`${REST}/${table}?id=eq.${id}`, { method: "PATCH", headers: h({ "Content-Type": "application/json", Prefer: "return=minimal" }), body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${table}: ${await r.text()}`);
  return { ok: true };
}
async function remove(table: string, id: number) {
  const r = await fetch(`${REST}/${table}?id=eq.${id}`, { method: "DELETE", headers: h({ Prefer: "return=minimal" }) });
  if (!r.ok) throw new Error(`${table}: ${await r.text()}`);
  return { ok: true };
}
async function setPageMonitors(pageId: number, ids: number[]) {
  await fetch(`${REST}/rv_status_page_monitors?page_id=eq.${pageId}`, { method: "DELETE", headers: h({ Prefer: "return=minimal" }) });
  for (const mid of ids) await insert("rv_status_page_monitors", { page_id: pageId, monitor_id: mid });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.headers.get("x-rv-admin") !== ADMIN_SECRET) return json({ error: "unauthorized" }, 401);
  let body: any;
  try { body = await req.json(); } catch { return json({ error: "invalid json" }, 400); }
  const { action, payload = {} } = body;
  try {
    let result: unknown = { ok: false, error: "unknown action" };
    switch (action) {
      case "addMonitor":
        result = await insert("rv_monitors", { name: payload.name, url: payload.url, keyword: payload.keyword || null, type: payload.type || "http", interval_seconds: Number(payload.interval_seconds || 60), status: "pending", uptime_24h: 100 }, true);
        break;
      case "updateMonitor": {
        const id = Number(payload.id);
        if (!Number.isFinite(id)) throw new Error("invalid monitor id");
        const fields: any = {};
        for (const k of ["name", "url", "keyword", "type", "interval_seconds", "active"]) if (k in payload) fields[k] = payload[k];
        result = await patch("rv_monitors", id, fields);
        break;
      }
      case "pauseMonitor": result = await patch("rv_monitors", Number(payload.id), { active: false }); break;
      case "resumeMonitor": result = await patch("rv_monitors", Number(payload.id), { active: true, status: "pending" }); break;
      case "deleteMonitor": result = await remove("rv_monitors", Number(payload.id)); break;
      case "addNotification": result = await insert("rv_notifications", { name: payload.name, type: payload.type || "webhook", target: payload.target, active: true }, true); break;
      case "deleteNotification": result = await remove("rv_notifications", Number(payload.id)); break;
      case "testNotification": {
        const ch = (await read("rv_notifications", `&id=eq.${Number(payload.id)}`))[0];
        if (!ch) throw new Error("channel not found");
        const r = await fetch(ch.target, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "⚡ REVENGE UPTIME test alert — Powered by idam Emmanuel" }), signal: AbortSignal.timeout(8000) });
        result = { ok: r.ok, status: r.status };
        break;
      }
      case "addStatusPage": {
        const rows = await insert("rv_status_pages", { slug: payload.slug, title: payload.title, description: payload.description || "", active: true }, true);
        const id = rows[0].id; await setPageMonitors(id, payload.monitor_ids || []); result = { ok: true, id }; break;
      }
      case "updateStatusPage": {
        const id = Number(payload.id);
        await patch("rv_status_pages", id, { title: payload.title, description: payload.description || "", active: payload.active !== false });
        if (Array.isArray(payload.monitor_ids)) await setPageMonitors(id, payload.monitor_ids);
        result = { ok: true }; break;
      }
      case "deleteStatusPage": result = await remove("rv_status_pages", Number(payload.id)); break;
      case "addMaintenance": result = await insert("rv_maintenance", { title: payload.title, starts_at: payload.starts_at, ends_at: payload.ends_at, active: true }, true); break;
      case "deleteMaintenance": result = await remove("rv_maintenance", Number(payload.id)); break;
      case "resolveIncident": result = await patch("rv_incidents", Number(payload.id), { status: "resolved", resolved_at: new Date().toISOString() }); break;
      case "deleteIncident": result = await remove("rv_incidents", Number(payload.id)); break;
      case "bulkMonitorAction": {
        const ids = (payload.ids || []).map(Number).filter(Number.isFinite);
        for (const id of ids) {
          if (payload.bulk === "pauseMonitor") await patch("rv_monitors", id, { active: false });
          else if (payload.bulk === "resumeMonitor") await patch("rv_monitors", id, { active: true, status: "pending" });
          else if (payload.bulk === "deleteMonitor") await remove("rv_monitors", id);
        }
        result = { ok: true, count: ids.length };
        break;
      }
      default: result = { ok: false, error: "unknown action" };
    }
    return json({ ...(result as object), action });
  } catch (e) { return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500); }
});
