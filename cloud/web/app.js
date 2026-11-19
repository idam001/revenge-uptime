/* REVENGE UPTIME — full monitoring dashboard
   Powered by idam Emmanuel. Real Supabase-backed data and writes. */
const SB = "https://fszewuewdsjloiwwggvy.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzemV3dWV3ZHNqbG9pd3dnZ3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NTYyNjAsImV4cCI6MjEwOTMzMjI2MH0.xnpqp_LO8gqBzsm10SXJK4Avg1WG4POkHduhu71b5S0";
const API = SB + "/functions/v1/rv-api";
const CHECK = SB + "/functions/v1/rv-check";
const S = {
  monitors: [], heartbeats: [], incidents: [], channels: [], pages: [], pageMonitors: [], maintenance: [],
  admin: sessionStorage.getItem("rv_admin") || "", filter: "all", search: "", sort: "down", selected: new Set(),
};

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDur = (s) => { if (s == null) return "—"; s = Math.max(0, Math.floor(s)); if (s < 60) return s + "s"; if (s < 3600) return Math.floor(s / 60) + "m"; if (s < 86400) return Math.floor(s / 3600) + "h " + Math.floor((s % 3600) / 60) + "m"; return Math.floor(s / 86400) + "d " + Math.floor((s % 86400) / 3600) + "h"; };
const ago = (t) => { if (!t) return "never"; const s = Math.floor((Date.now() - new Date(t).getTime()) / 1000); return s < 0 ? "just now" : s < 60 ? s + "s ago" : s < 3600 ? Math.floor(s / 60) + "m ago" : s < 86400 ? Math.floor(s / 3600) + "h ago" : Math.floor(s / 86400) + "d ago"; };
const fmtDate = (t) => t ? new Date(t).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
function toast(msg) { const el = $("#toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 3200); }

async function get(table, query = "") {
  const r = await fetch(`${SB}/rest/v1/${table}?select=*${query}`, { headers: { apikey: ANON, Authorization: "Bearer " + ANON } });
  if (!r.ok) throw new Error(table + ": " + await r.text());
  return r.json();
}
async function loadAll() {
  const [m, hb, inc, ch, pg, pm, mt] = await Promise.all([
    get("rv_monitors", "&order=id"),
    get("rv_heartbeats", "&order=created_at.desc&limit=5000"),
    get("rv_incidents", "&order=started_at.desc&limit=200"),
    get("rv_notifications", "&order=id"),
    get("rv_status_pages", "&order=id"),
    get("rv_status_page_monitors"),
    get("rv_maintenance", "&order=id"),
  ]);
  Object.assign(S, { monitors: m, heartbeats: hb, incidents: inc, channels: ch, pages: pg, pageMonitors: pm, maintenance: mt });
}
async function admin(action, payload = {}) {
  if (!S.admin) return askSecret(() => admin(action, payload));
  const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json", "x-rv-admin": S.admin }, body: JSON.stringify({ action, payload }) });
  const j = await r.json();
  if (!r.ok || j.error || j.ok === false) throw new Error(j.error || "Action failed");
  toast("✓ " + action.replace(/([A-Z])/g, " $1").trim());
  await loadAll(); render();
  return j;
}
function askSecret(then) {
  modal(`<h2>Admin access</h2><p class="sub">Enter your REVENGE UPTIME admin secret to change monitors, alerts or pages.</p>
   <div class="field"><label>Admin secret</label><input id="secret" type="password" placeholder="••••••••••••"></div>
   <div class="modal-actions"><button class="btn ghost" data-close>Cancel</button><button class="btn violet" id="ok">Unlock</button></div>`, () => {
    const v = $("#secret").value.trim(); if (!v) return false;
    S.admin = v; sessionStorage.setItem("rv_admin", v); closeModal(); then(); return true;
  });
}
function modal(html, onSubmit) {
  $("#modal").innerHTML = '<div class="modal">' + html + "</div>";
  $("#modal").classList.add("open");
  $("#modal").querySelectorAll("[data-close]").forEach((b) => b.onclick = closeModal);
  $("#modal").onclick = (e) => { if (e.target.id === "modal") closeModal(); };
  const form = $("#modal").querySelector("form");
  if (form) form.onsubmit = (e) => { e.preventDefault(); onSubmit && onSubmit(); };
  const ok = $("#modal").querySelector("#ok");
  if (ok && onSubmit && !form) ok.onclick = () => onSubmit();
}
function closeModal() { $("#modal").classList.remove("open"); $("#modal").innerHTML = ""; }

const NAV = [
  ["#/monitors", "▣", "Monitoring"], ["#/incidents", "⚑", "Incidents"], ["#/status-pages", "◫", "Status pages"],
  ["#/maintenance", "◷", "Maintenance"], ["#/notifications", "🔔", "Alert contacts"],
  ["#/team", "♙", "Team members"], ["#/integrations", "⚙", "Integrations & API"],
];
function route() { return location.hash.replace(/^#\/?/, "") || "monitors"; }
function renderNav() {
  const r = route(), openInc = S.incidents.filter((i) => i.status === "ongoing").length;
  $("#nav").innerHTML = NAV.map(([href, ico, label]) => `<a href="${href}" class="${r === href.slice(2) || (href === "#/monitors" && r.startsWith("monitor/")) ? "active" : ""}"><span class="ico">${ico}</span>${label}${label === "Incidents" && openInc ? `<span class="badge">${openInc}</span>` : ""}</a>`).join("");
}
function renderRail() {
  const up = S.monitors.filter((m) => m.status === "up").length, down = S.monitors.filter((m) => m.status === "down").length, paused = S.monitors.filter((m) => !m.active).length;
  const avg = S.monitors.length ? (S.monitors.reduce((a, m) => a + Number(m.uptime_24h || 0), 0) / S.monitors.length).toFixed(2) : "100.00";
  const events = S.incidents.slice(0, 5).map((i) => { const m = S.monitors.find((x) => x.id === i.monitor_id); return `<div class="event"><span class="dot ${i.status === "ongoing" ? "down" : "up"}"></span><span><b>${esc(m ? m.name : "Monitor " + i.monitor_id)}</b>${i.status === "ongoing" ? "Went down" : "Recovered"} · ${ago(i.started_at)}</span></div>`; }).join("") || '<div class="muted">No incidents yet — all checks are healthy.</div>';
  $("#rail").innerHTML = `
   <div class="card"><h3>Current status</h3><div style="text-align:center;color:${down ? "var(--down)" : "var(--up)"};font-size:27px;font-weight:800">${down ? "●" : "●"} ${down ? "Attention" : "Operational"}</div>
    <div class="counts"><div class="count"><b style="color:var(--up)">${up}</b><small>Up</small></div><div class="count"><b style="color:var(--down)">${down}</b><small>Down</small></div><div class="count"><b style="color:var(--pause)">${paused}</b><small>Paused</small></div></div>
    <div class="kv" style="margin-top:12px"><span>Total monitors</span><b>${S.monitors.length}</b></div></div>
   <div class="card"><h3>Last 24 hours</h3><div class="kv"><span>Overall uptime</span><b style="color:var(--cyan)">${avg}%</b></div><div class="kv"><span>Checks recorded</span><b>${S.heartbeats.length}</b></div><div class="kv"><span>Incidents</span><b>${S.incidents.length}</b></div><div class="kv"><span>Failed checks</span><b>${S.heartbeats.filter((x) => x.status === "down").length}</b></div>
    <div class="legend"><span><i style="background:var(--up)"></i>Up</span><span><i style="background:var(--down)"></i>Down</span><span><i style="background:var(--pause)"></i>Paused</span></div></div>
   <div class="card"><h3>Latest events</h3><div class="event-feed">${events}</div></div>
   <div class="card" style="text-align:center;color:var(--muted);font-size:10px">REVENGE UPTIME<br><b style="color:var(--violet)">Powered by idam Emmanuel.</b></div>`;
}
function bars(id, count = 34) {
  const list = S.heartbeats.filter((h) => h.monitor_id === id).slice(0, count).reverse();
  if (!list.length) return '<div class="bars">' + Array.from({ length: count }, () => "<i class='p'></i>").join("") + "</div>";
  return '<div class="bars">' + list.map((h) => `<i class="${h.status === "up" ? "" : h.status === "down" ? "d" : "p"}" title="${esc(h.status)} · ${esc(h.detail || "")} · ${h.response_ms ?? "—"}ms"></i>`).join("") + "</div>";
}
function stateLabel(m) {
  const last = S.heartbeats.find((h) => h.monitor_id === m.id);
  const since = last ? fmtDur((Date.now() - new Date(last.created_at).getTime()) / 1000) : "—";
  return `${m.active ? (m.status || "pending").toUpperCase() : "PAUSED"} ${since}`;
}
function monitorTable(list) {
  if (!list.length) return '<div class="table-wrap"><div class="empty">No monitors match this view. Try a different filter or add a monitor.</div></div>';
  return `<div class="table-wrap"><table class="tbl"><thead><tr>
    <th class="c1"><input type="checkbox" id="selAll"></th><th class="c2">Monitor</th><th class="c3">Interval</th><th class="c4">Last 24 hours</th><th class="c5">Uptime</th><th class="c6"></th>
   </tr></thead><tbody>${list.map((m) => `<tr>
    <td><input type="checkbox" class="sel" value="${m.id}" ${S.selected.has(m.id) ? "checked" : ""}></td>
    <td><div class="mon-name"><span class="dot ${m.active ? m.status : "paused"}"></span><div style="min-width:0"><a href="#/monitor/${m.id}">${esc(m.name)}</a><div class="mon-sub">${esc((m.type || "HTTP").toUpperCase())} · ${stateLabel(m, S)}</div></div></div></td>
    <td class="muted">${m.interval_seconds >= 60 ? m.interval_seconds / 60 + " min" : m.interval_seconds + " sec"}</td>
    <td>${bars(m.id)}</td><td class="pct">${Number(m.uptime_24h ?? 100).toFixed(2)}%</td>
    <td><button class="btn ghost sm" data-menu="${m.id}">···</button></td></tr>`).join("")}</tbody></table></div>`;
}
function renderMonitors() {
  let list = [...S.monitors];
  if (S.filter !== "all") list = list.filter((m) => S.filter === "paused" ? !m.active : m.active && m.status === S.filter);
  if (S.search) { const q = S.search.toLowerCase(); list = list.filter((m) => m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q)); }
  if (S.sort === "down") list.sort((a, b) => (a.status === "down" ? -1 : 1) - (b.status === "down" ? -1 : 1));
  if (S.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  if (S.sort === "uptime") list.sort((a, b) => Number(a.uptime_24h) - Number(b.uptime_24h));
  $("#view").innerHTML = `
   <div class="page-head"><h1>Monitors.</h1><button class="btn primary" id="newMon">＋ New monitor</button></div>
   <div class="toolbar"><label><input type="checkbox" id="selAllTop"> ${S.selected.size}/${S.monitors.length}</label>
    <label><input type="checkbox" id="groups"> Show groups</label>
    <div class="search"><input type="search" id="q" placeholder="Search by name or URL" value="${esc(S.search)}"></div>
    <select id="filter"><option value="all">All statuses</option><option value="up">Up</option><option value="down">Down</option><option value="paused">Paused</option></select>
    <select id="sort"><option value="down">Down first</option><option value="name">Name A–Z</option><option value="uptime">Lowest uptime</option></select>
   </div>${monitorTable(list)}<p class="muted" style="margin-top:12px">Checks run from Supabase edge functions every minute · ${S.heartbeats.length} heartbeats stored</p>`;
  $("#filter").value = S.filter; $("#sort").value = S.sort;
  $("#q").oninput = (e) => { S.search = e.target.value; refreshTableOnly(); };
  $("#filter").onchange = (e) => { S.filter = e.target.value; renderMonitors(); bindTable(); };
  $("#sort").onchange = (e) => { S.sort = e.target.value; renderMonitors(); bindTable(); };
  $("#newMon").onclick = monitorForm;
  bindTable();
}
function refreshTableOnly() {
  const q = S.search.toLowerCase(); let list = S.monitors.filter((m) => m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q));
  const old = monitorTable(list); const wrap = $("#view .table-wrap"); if (wrap) wrap.outerHTML = old; bindTable();
}
function bindTable() {
  document.querySelectorAll(".sel").forEach((el) => el.onchange = () => { el.checked ? S.selected.add(Number(el.value)) : S.selected.delete(Number(el.value)); });
  document.querySelectorAll("[data-menu]").forEach((b) => b.onclick = () => monitorMenu(Number(b.dataset.menu)));
  const all = $("#selAll") || $("#selAllTop");
  if (all) all.onchange = (e) => { S.selected = e.target.checked ? new Set(S.monitors.map((m) => m.id)) : new Set(); renderMonitors(); };
}
function monitorMenu(id) {
  const m = S.monitors.find((x) => x.id === id); if (!m) return;
  modal(`<h2>${esc(m.name)}</h2><p class="sub">${esc(m.url)}</p>
   <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn" id="edit">Edit monitor</button>
    <button class="btn" id="toggle">${m.active ? "Pause" : "Resume"}</button>
    <button class="btn danger" id="del">Delete</button>
   </div><div class="modal-actions"><button class="btn ghost" data-close>Close</button></div>`);
  $("#edit").onclick = () => monitorForm(m);
  $("#toggle").onclick = () => safeAdmin(m.active ? "pauseMonitor" : "resumeMonitor", { id });
  $("#del").onclick = () => { closeModal(); confirmModal("Delete " + m.name + "?", "Heartbeats and incidents for this monitor will be removed.", () => safeAdmin("deleteMonitor", { id })); };
}
function safeAdmin(action, payload) { admin(action, payload).catch((e) => toast("✗ " + e.message)); }
function confirmModal(title, text, cb) {
  modal(`<h2>${esc(title)}</h2><p class="sub">${esc(text)}</p><div class="modal-actions"><button class="btn ghost" data-close>Cancel</button><button class="btn danger" id="yes">Confirm</button></div>`);
  $("#yes").onclick = () => { closeModal(); cb(); };
}
function monitorForm(m) {
  modal(`<h2>${m ? "Edit" : "New"} monitor</h2><p class="sub">Real checks run every interval from the REVENGE UPTIME engine.</p>
   <form id="mf"><div class="field"><label>Friendly name</label><input name="name" required value="${esc(m?.name || "")}" placeholder="My API"></div>
   <div class="field"><label>URL</label><input name="url" type="url" required value="${esc(m?.url || "")}" placeholder="https://example.com/health"></div>
   <div class="grid2"><div class="field"><label>Type</label><select name="type"><option value="http" ${m?.type === "http" ? "selected" : ""}>HTTP(S)</option><option value="keyword" ${m?.type === "keyword" ? "selected" : ""}>HTTP keyword</option></select></div>
   <div class="field"><label>Interval</label><select name="interval_seconds"><option value="60" ${m?.interval_seconds == 60 ? "selected" : ""}>1 minute</option><option value="300" ${m?.interval_seconds == 300 ? "selected" : ""}>5 minutes</option><option value="600" ${m?.interval_seconds == 600 ? "selected" : ""}>10 minutes</option></select></div></div>
   <div class="field"><label>Keyword (for keyword monitors)</label><input name="keyword" value="${esc(m?.keyword || "")}" placeholder="healthy"></div>
   <div class="modal-actions"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn violet">${m ? "Save changes" : "Create monitor"}</button></div></form>`, () => {
    const f = new FormData($("#mf")); const p = Object.fromEntries(f.entries());
    p.interval_seconds = Number(p.interval_seconds);
    if (m) p.id = m.id;
    closeModal(); safeAdmin(m ? "updateMonitor" : "addMonitor", p);
  });
}

function renderDetail(id) {
  const m = S.monitors.find((x) => x.id === Number(id)); if (!m) return $("#view").innerHTML = '<div class="empty">Monitor not found.</div>';
  const hs = S.heartbeats.filter((h) => h.monitor_id === m.id).slice(0, 200).reverse();
  const inc = S.incidents.filter((i) => i.monitor_id === m.id);
  const times = hs.map((h) => h.response_ms).filter((x) => x != null);
  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const max = times.length ? Math.max(...times) : 0;
  const width = 700, height = 170;
  const pts = times.length ? times.map((v, i) => `${(i / Math.max(1, times.length - 1)) * width},${height - (v / Math.max(1, max)) * (height - 20)}`).join(" ") : "";
  $("#view").innerHTML = `
   <div class="page-head"><a href="#/monitors" class="btn ghost">← Monitors</a><h1>${esc(m.name)}</h1><span class="pill ${m.active ? m.status : "paused"}">${m.active ? m.status : "paused"}</span><button class="btn sm" id="editM" style="margin-left:auto">Edit</button></div>
   <div class="grid4"><div class="statbox"><small>24h uptime</small><b style="color:var(--cyan)">${Number(m.uptime_24h ?? 100).toFixed(2)}%</b></div>
    <div class="statbox"><small>Avg response</small><b>${avg} ms</b></div><div class="statbox"><small>Max response</small><b>${max} ms</b></div>
    <div class="statbox"><small>Checks stored</small><b>${S.heartbeats.filter((h) => h.monitor_id === m.id).length}</b></div></div>
   <div class="card" style="margin-top:14px"><h3 style="margin:0 0 10px;color:var(--dim);font-size:12px">Response time · recent checks</h3>
    <svg class="chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><polyline fill="none" stroke="#6d5efc" stroke-width="2" points="${pts}"/><line x1="0" y1="${height - 1}" x2="${width}" y2="${height - 1}" stroke="#232c3b"/></svg></div>
   <div class="card" style="margin-top:14px"><h3 style="margin:0 0 10px;color:var(--dim);font-size:12px">Availability · last checks</h3>${bars(m.id, 48)}<p class="muted" style="font-size:11px">${esc(m.url)} · checks every ${m.interval_seconds / 60 || m.interval_seconds} ${m.interval_seconds >= 60 ? "minutes" : "seconds"} · ${ago(m.last_checked_at)}</p></div>
   <div class="card" style="margin-top:14px"><h3 style="margin:0 0 10px;color:var(--dim);font-size:12px">Incident history</h3>${inc.length ? inc.map((i) => `<div class="incident-row"><span class="pill ${i.status}">${i.status}</span> <b>${esc(i.reason || "Downtime detected")}</b><div class="muted">Started ${fmtDate(i.started_at)} · ${i.resolved_at ? "Resolved " + fmtDate(i.resolved_at) : "Ongoing"} · ${fmtDur(i.duration_seconds ?? (Date.now() - new Date(i.started_at).getTime()) / 1000)}</div></div>`).join("") : '<div class="empty">No incidents recorded for this monitor.</div>'}</div>`;
  $("#editM").onclick = () => monitorForm(m);
}
function renderIncidents() {
  const rows = S.incidents.map((i) => { const m = S.monitors.find((x) => x.id === i.monitor_id); return `<tr><td><span class="pill ${i.status}">${i.status}</span></td><td><b>${esc(m?.name || "Monitor " + i.monitor_id)}</b><div class="mon-sub">${esc(i.reason || "")}</div></td><td class="muted">${fmtDate(i.started_at)}</td><td>${fmtDur(i.duration_seconds ?? (i.status === "ongoing" ? (Date.now() - new Date(i.started_at).getTime()) / 1000 : null))}</td><td><button class="btn sm" data-res="${i.id}" ${i.status === "resolved" ? "disabled" : ""}>Resolve</button></td></tr>`; }).join("");
  $("#view").innerHTML = `<div class="page-head"><h1>Incidents.</h1><button class="btn primary" id="refreshI">↻ Refresh</button></div>
   <div class="table-wrap"><table class="tbl"><thead><tr><th style="width:100px">Status</th><th>Monitor</th><th style="width:150px">Started</th><th style="width:110px">Duration</th><th style="width:90px"></th></tr></thead><tbody>${rows || '<tr><td colspan="5"><div class="empty">No incidents yet. A real incident opens automatically when a check fails.</div></td></tr>'}</tbody></table></div>`;
  $("#refreshI").onclick = async () => { await loadAll(); render(); };
  document.querySelectorAll("[data-res]").forEach((b) => b.onclick = () => safeAdmin("resolveIncident", { id: Number(b.dataset.res) }));
}
function renderStatusPages() {
  $("#view").innerHTML = `<div class="page-head"><h1>Status pages.</h1><button class="btn primary" id="newPage">＋ New status page</button></div>
   ${S.pages.map((p) => { const ids = S.pageMonitors.filter((x) => x.page_id === p.id).length; return `<div class="card" style="margin-bottom:10px;display:flex;align-items:center;gap:12px"><div><b>${esc(p.title)}</b><div class="muted">/${esc(p.slug)} · ${ids} monitors · ${p.active ? "Live" : "Hidden"}</div></div><div style="margin-left:auto;display:flex;gap:7px"><a class="btn sm" href="#/status/${esc(p.slug)}">View</a><button class="btn sm" data-ep="${p.id}">Edit</button><button class="btn danger sm" data-dp="${p.id}">Delete</button></div></div>`; }).join("") || '<div class="card empty">No status pages yet.</div>'}`;
  $("#newPage").onclick = () => statusPageForm();
  document.querySelectorAll("[data-ep]").forEach((b) => b.onclick = () => statusPageForm(S.pages.find((p) => p.id === Number(b.dataset.ep))));
  document.querySelectorAll("[data-dp]").forEach((b) => b.onclick = () => confirmModal("Delete status page?", "The page and its monitor links will be removed.", () => safeAdmin("deleteStatusPage", { id: Number(b.dataset.dp) })));
}
function statusPageForm(p) {
  const selected = new Set(S.pageMonitors.filter((x) => x.page_id === p?.id).map((x) => x.monitor_id));
  modal(`<h2>${p ? "Edit" : "New"} status page</h2><form id="pf">
   <div class="field"><label>Title</label><input name="title" required value="${esc(p?.title || "")}"></div>
   <div class="field"><label>Slug</label><input name="slug" required pattern="[a-z0-9-]+" value="${esc(p?.slug || "my-status")}" ${p ? "readonly" : ""}></div>
   <div class="field"><label>Description</label><textarea name="description" rows="2">${esc(p?.description || "")}</textarea></div>
   <div class="field"><label>Monitors to display</label>${S.monitors.map((m) => `<label style="display:block;margin:4px 0"><input type="checkbox" name="mon" value="${m.id}" ${selected.has(m.id) ? "checked" : ""}> ${esc(m.name)}</label>`).join("")}</div>
   <div class="modal-actions"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn violet">Save page</button></div></form>`, () => {
    const f = $("#pf"), fd = new FormData(f), payload = { title: fd.get("title"), slug: fd.get("slug"), description: fd.get("description"), monitor_ids: fd.getAll("mon").map(Number) };
    if (p) { payload.id = p.id; payload.active = p.active; }
    closeModal(); safeAdmin(p ? "updateStatusPage" : "addStatusPage", payload);
  });
}
function renderPublicStatus(slug) {
  const p = S.pages.find((x) => x.slug === slug); if (!p) return $("#view").innerHTML = '<div class="empty">Status page not found.</div>';
  const ids = S.pageMonitors.filter((x) => x.page_id === p.id).map((x) => x.monitor_id);
  const list = S.monitors.filter((m) => ids.includes(m.id));
  const down = list.filter((m) => m.status === "down").length;
  $("#view").innerHTML = `<div class="page-head"><a href="#/status-pages" class="btn ghost">← Status pages</a><h1>${esc(p.title)}</h1></div>
   <div class="hero" style="background:linear-gradient(135deg,#6d5efc26,#22d3ee12);border:1px solid #2e2a52;border-radius:14px;padding:26px;margin-bottom:16px">
    <h2 style="margin:0;font-size:25px">${down ? "Some systems are experiencing issues" : "All systems operational"}</h2><p class="muted">${esc(p.description || "")} · Powered by idam Emmanuel.</p></div>
   <div class="services">${list.map((m) => `<div class="service"><span class="dot ${m.active ? m.status : "paused"}"></span><div style="flex:1"><b>${esc(m.name)}</b><small class="muted">${Number(m.uptime_24h ?? 100).toFixed(2)}% uptime · ${ago(m.last_checked_at)}</small></div>${bars(m.id, 20)}<span class="pill ${m.active ? m.status : "paused"}">${m.active ? m.status : "paused"}</span></div>`).join("") || '<div class="empty">No monitors assigned to this page yet.</div>'}</div>
   <div class="card" style="margin-top:16px"><h3 style="color:var(--dim);font-size:12px">Recent incidents</h3>${S.incidents.slice(0, 8).map((i) => { const m = S.monitors.find((x) => x.id === i.monitor_id); return `<div class="incident-row"><span class="pill ${i.status}">${i.status}</span> <b>${esc(m?.name || "Monitor")}</b> · ${esc(i.reason || "")}<div class="muted">${fmtDate(i.started_at)}</div></div>`; }).join("") || '<div class="empty">No incidents in the recorded window.</div>'}</div>`;
}
function renderMaintenance() {
  $("#view").innerHTML = `<div class="page-head"><h1>Maintenance.</h1><button class="btn primary" id="newMt">＋ Schedule maintenance</button></div>
   ${S.maintenance.map((w) => `<div class="card" style="margin-bottom:10px;display:flex;align-items:center"><div><b>${esc(w.title)}</b><div class="muted">${fmtDate(w.starts_at)} → ${fmtDate(w.ends_at)}</div></div><button class="btn danger sm" data-dm="${w.id}" style="margin-left:auto">Delete</button></div>`).join("") || '<div class="card empty">No maintenance windows scheduled.</div>'}`;
  $("#newMt").onclick = () => modal(`<h2>Schedule maintenance</h2><form id="mform"><div class="field"><label>Title</label><input name="title" required></div><div class="grid2"><div class="field"><label>Starts</label><input name="starts_at" type="datetime-local" required></div><div class="field"><label>Ends</label><input name="ends_at" type="datetime-local" required></div></div><div class="modal-actions"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn violet">Schedule</button></div></form>`, () => { const f = new FormData($("#mform")); closeModal(); safeAdmin("addMaintenance", Object.fromEntries(f.entries())); });
  document.querySelectorAll("[data-dm]").forEach((b) => b.onclick = () => safeAdmin("deleteMaintenance", { id: Number(b.dataset.dm) }));
}
function renderNotifications() {
  $("#view").innerHTML = `<div class="page-head"><h1>Alert contacts.</h1><button class="btn primary" id="newCh">＋ Add channel</button></div>
   <div class="card">${S.channels.map((c) => `<div class="incident-row" style="display:flex;align-items:center;gap:10px"><div style="flex:1"><b>${esc(c.name)}</b><div class="muted">${esc(c.type.toUpperCase())} · ${esc(c.target)}</div></div><button class="btn sm" data-test="${c.id}">Test</button><button class="btn danger sm" data-dc="${c.id}">Delete</button></div>`).join("") || '<div class="empty">No alert channels. Add a webhook, Slack or Discord URL to receive real alerts.</div>'}</div>
   <p class="muted">Alerts fire automatically on real DOWN and RECOVERED transitions detected by the check engine.</p>`;
  $("#newCh").onclick = () => modal(`<h2>Add alert channel</h2><form id="cform"><div class="field"><label>Name</label><input name="name" required></div><div class="field"><label>Type</label><select name="type"><option>webhook</option><option>slack</option><option>discord</option></select></div><div class="field"><label>Webhook URL</label><input name="target" required placeholder="https://hooks.slack.com/..."></div><div class="modal-actions"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn violet">Add channel</button></div></form>`, () => { const p = Object.fromEntries(new FormData($("#cform"))); closeModal(); safeAdmin("addNotification", p); });
  document.querySelectorAll("[data-test]").forEach((b) => b.onclick = () => safeAdmin("testNotification", { id: Number(b.dataset.test) }));
  document.querySelectorAll("[data-dc]").forEach((b) => b.onclick = () => safeAdmin("deleteNotification", { id: Number(b.dataset.dc) }));
}
function renderIntegrations() {
  $("#view").innerHTML = `<div class="page-head"><h1>Integrations & API.</h1></div>
   <div class="grid2"><div class="card"><h3 style="margin-top:0">Check engine</h3><p class="muted">Real HTTP and keyword checks run automatically every minute from <code>rv-check</code>. Heartbeats, incidents and alert delivery are stored in Supabase.</p><p class="muted">Live checks recorded: <b>${S.heartbeats.length}</b></p></div>
   <div class="card"><h3 style="margin-top:0">Admin API</h3><p class="muted">All write actions are signed with your admin secret, held only in this browser session.</p><code style="font-size:11px">POST ${API}<br>x-rv-admin: ••••••<br>{"action":"addMonitor", ...}</code></div></div>
   <div class="card" style="margin-top:12px"><h3 style="margin-top:0">Team access</h3><p class="muted">Owner: <b>idam001</b>. Notify-only and read-only seats use the same API role model.</p></div>`;
}
function renderTeam() {
  $("#view").innerHTML = `<div class="page-head"><h1>Team members.</h1></div><div class="card"><div class="incident-row"><b>idam001</b> · Owner <span class="pill up" style="float:right">active</span><div class="muted">Full access · Powered by idam Emmanuel.</div></div><p class="muted">Role-based seats (read, write, notify-only) use the same admin secret model as the API.</p></div>`;
}
function render() {
  renderNav(); renderRail(); const r = route();
  $("#crumb").textContent = NAV.find((n) => n[0].slice(2) === r)?.[2] || (r.startsWith("monitor/") ? "Monitor details" : r.startsWith("status/") ? "Public status" : "Monitoring");
  if (r === "monitors") renderMonitors();
  else if (r.startsWith("monitor/")) renderDetail(r.split("/")[1]);
  else if (r === "incidents") renderIncidents();
  else if (r === "status-pages") renderStatusPages();
  else if (r.startsWith("status/")) renderPublicStatus(r.split("/")[1]);
  else if (r === "maintenance") renderMaintenance();
  else if (r === "notifications") renderNotifications();
  else if (r === "integrations") renderIntegrations();
  else if (r === "team") renderTeam();
  else renderMonitors();
}
$("#menuBtn").onclick = () => $("#sidebar").classList.toggle("open");
$("#refreshBtn").onclick = async () => { await loadAll(); render(); toast("Refreshed"); };
addEventListener("hashchange", render);
(async function init() {
  try { await loadAll(); render(); setInterval(async () => { if (!document.hidden) { await loadAll(); render(); } }, 15000); }
  catch (e) { $("#view").innerHTML = '<div class="err">' + esc(e.message) + "</div>"; }
})();
