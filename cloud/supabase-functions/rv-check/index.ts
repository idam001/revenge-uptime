// REVENGE UPTIME — scheduled check engine (Supabase Edge Function)
// Powered by idam Emmanuel. Free-tier friendly: runs once per minute from pg_cron.
// It performs real HTTP/HTTPS checks, stores every heartbeat, and recomputes 24h uptime.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CRON_SECRET = Deno.env.get("RV_CRON_SECRET")!;
const REST = `${SUPABASE_URL}/rest/v1`;

const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "x-rv-secret, content-type",
};

function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function authHeaders(extra: Record<string, string> = {}) {
    return {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        ...extra,
    };
}

async function checkMonitor(m: any) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const started = Date.now();
    let status = "down";
    let statusCode: number | null = null;
    let detail = "No response";

    try {
        const response = await fetch(m.url, {
            redirect: "follow",
            signal: controller.signal,
            headers: { "user-agent": "REVENGE UPTIME/1.0 (+uptime monitor)" },
        });
        statusCode = response.status;
        const body = await response.text();
        const codeOk = response.status >= 200 && response.status < 400;
        const keywordOk = !m.keyword || body.includes(m.keyword);
        status = codeOk && keywordOk ? "up" : "down";
        detail = codeOk ? (keywordOk ? "OK" : "Keyword not found") : `HTTP ${response.status}`;
    } catch (error) {
        detail = error instanceof Error ? error.message : String(error);
    } finally {
        clearTimeout(timer);
    }

    const responseMs = Date.now() - started;
    const now = new Date().toISOString();

    await fetch(`${REST}/rv_heartbeats`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }),
        body: JSON.stringify({
            monitor_id: m.id,
            status,
            response_ms: responseMs,
            status_code: statusCode,
            detail,
            created_at: now,
        }),
    });

    // 24-hour uptime from real stored heartbeats (this run included).
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const historyRes = await fetch(
        `${REST}/rv_heartbeats?monitor_id=eq.${m.id}&created_at=gte.${encodeURIComponent(since)}&select=status`,
        { headers: authHeaders() }
    );
    const history: { status: string }[] = await historyRes.json();
    const uptime = history.length
        ? Math.round((history.filter((h) => h.status === "up").length / history.length) * 10000) / 100
        : 100;

    await fetch(`${REST}/rv_monitors?id=eq.${m.id}`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }),
        body: JSON.stringify({
            status,
            last_checked_at: now,
            last_response_ms: responseMs,
            last_status_code: statusCode,
            uptime_24h: uptime,
        }),
    });

    return { id: m.id, name: m.name, status, responseMs, statusCode, uptime };
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: jsonHeaders });
    if (req.headers.get("x-rv-secret") !== CRON_SECRET) return json({ error: "unauthorized" }, 401);

    try {
        const res = await fetch(`${REST}/rv_monitors?active=eq.true&select=*`, { headers: authHeaders() });
        const monitors = await res.json();
        const results = [];
        for (const m of monitors) results.push(await checkMonitor(m));
        return json({ ok: true, checked: results.length, results, at: new Date().toISOString() });
    } catch (error) {
        return json({ ok: false, error: error instanceof Error ? error.message : String(error) }, 500);
    }
});
