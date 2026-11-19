/* REVENGE UPTIME — premium monitoring console
   Powered by idam Emmanuel. Real Supabase-backed data and writes. */

const SB = "https://fszewuewdsjloiwwggvy.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzemV3dWV3ZHNqbG9pd3dnZ3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NTYyNjAsImV4cCI6MjEwOTMzMjI2MH0.xnpqp_LO8gqBzsm10SXJK4Avg1WG4POkHduhu71b5S0";
const API = SB + "/functions/v1/rv-api";

const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  flag: '<path d="M5 21V4m0 1c4-2 8 2 13 0v10c-5 2-9-2-13 0"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.5M17 20a6 6 0 0 0 4-5.5"/>',
  plug: '<path d="M9 3v6m6-6v6M6 9h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V9Z"/><path d="M12 18v3"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1H21v4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  x: '<path d="M6 6 18 18M18 6 6 18"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  play: '<path d="m8 5 11 7-11 7V5Z"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3m-8 0 1 14h8l1-14"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 10-13h-7l0-7z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9 2 2-2 2 2 2-3 3-2-2-2 2"/>'
};

const state = {
  monitors: [], heartbeats: [], incidents: [], channels: [], pages: [], pageMonitors: [], maintenance: [],
  admin: sessionStorage.getItem("rv_admin") || "",
  dense: localStorage.getItem("rv_dense") === "1",
  filter: "all", sort: "down", query: "", selected: new Set(),
  sync: { status: "connecting", at: null, error: null },
  pending: 0, incidentFilter: "all", paletteQuery: "", paletteIndex: 0,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icon = (name, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.grid}</svg>`;
const initials = (s) => String(s || "?").trim().split(/[\s·_-]+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join("").toUpperCase() || "?";
const fmtDur = (s) => { if (s == null || !isFinite(s)) return "—"; s = Math.max(0, Math.floor(s)); if (s < 60) return s + "s"; if (s < 3600) return Math.floor(s / 60) + "m"; if (s < 86400) return Math.floor(s / 3600) + "h " + Math.floor((s % 3600) / 60) + "m"; return Math.floor(s / 86400) + "d " + Math.floor((s % 86400) / 3600) + "h"; };
const ago = (t) => { if (!t) return "never"; const s = Math.floor((Date.now() - new Date(t).getTime()) / 1000); if (s < 0) return "just now"; if (s < 60) return s + "s ago"; if (s < 3600) return Math.floor(s / 60) + "m ago"; if (s < 86400) return Math.floor(s / 3600) + "h ago"; return Math.floor(s / 86400) + "d ago"; };
const fmtDate = (t) => t ? new Date(t).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const stateOf = (m) => !m.active ? "paused" : (m.status || "pending");
const lastHeartbeat = (id) => state.heartbeats.find((h) => h.monitor_id === id);
const durationSince = (t) => t ? fmtDur((Date.now() - new Date(t).getTime()) / 1000) : "—";

function toast(message, kind = "") {
  const el = document.createElement("div");
  el.className = "toast " + kind;
  el.innerHTML = `<i></i><span>${esc(message)}</span><button aria-label="Dismiss">×</button>`;
  el.querySelector("button").onclick = () => el.remove();
  $("#toastStack").appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateX(12px)"; setTimeout(() => el.remove(), 220); }, 3600);
}

/* ---------- data + sync engine ---------- */

async function get(table, query = "") {
  const r = await fetch(`${SB}/rest/v1/${table}?select=*${query}`, { headers: { apikey: ANON, Authorization: "Bearer " + ANON } });
  if (!r.ok) throw new Error(`${table}: ${await r.text()}`);
  return r.json();
}

const CHANNEL = ("BroadcastChannel" in window) ? new BroadcastChannel("revenge-uptime-sync") : null;

async function syncNow({ silent = false, broadcast = true } = {}) {
  if (state.sync.status === "syncing") return;
  state.sync = { ...state.sync, status: "syncing" };
  renderSync();
  try {
    const [monitors, heartbeats, incidents, channels, pages, pageMonitors, maintenance] = await Promise.all([
      get("rv_monitors", "&order=id"),
      get("rv_heartbeats", "&order=created_at.desc&limit=5000"),
      get("rv_incidents", "&order=started_at.desc&limit=300"),
      get("rv_notifications", "&order=id"),
      get("rv_status_pages", "&order=id"),
      get("rv_status_page_monitors"),
      get("rv_maintenance", "&order=id"),
    ]);
    Object.assign(state, { monitors, heartbeats, incidents, channels, pages, pageMonitors, maintenance });
    state.sync = { status: "synced", at: new Date(), error: null };
    render();
    if (!silent) toast("Cloud state synchronized", "info");
    if (broadcast && CHANNEL) CHANNEL.postMessage({ type: "sync" });
  } catch (e) {
    state.sync = { status: "error", at: state.sync.at, error: e.message };
    renderSync();
    if (!silent) toast("Sync failed: " + e.message, "error");
  }
}

async function admin(action, payload = {}) {
  if (!state.admin) return new Promise((resolve) => promptAdmin(() => resolve(admin(action, payload))));
  state.pending++;
  renderSync();
  try {
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json", "x-rv-admin": state.admin }, body: JSON.stringify({ action, payload }) });
    const j = await r.json();
    if (!r.ok || j.error || j.ok === false) throw new Error(j.error || "Action failed");
    toast(action.replace(/([A-Z])/g, " $1").trim() + " complete", "ok");
    await syncNow({ silent: true });
    return j;
  } catch (e) {
    toast(e.message, "error");
    throw e;
  } finally {
    state.pending = Math.max(0, state.pending - 1);
    renderSync();
  }
}
const safeAdmin = (action, payload) => admin(action, payload).catch(() => {});

/* ---------- routing ---------- */

const NAV_MAIN = [
  { id: "monitors", label: "Monitors", icon: "grid" },
  { id: "incidents", label: "Incidents", icon: "flag", badge: true },
  { id: "status-pages", label: "Status pages", icon: "layers" },
  { id: "maintenance", label: "Maintenance", icon: "calendar" },
  { id: "alerts", label: "Alert contacts", icon: "bell" },
];
const NAV_SYS = [
  { id: "team", label: "Team members", icon: "users" },
  { id: "integrations", label: "Integrations & API", icon: "plug" },
  { id: "settings", label: "Settings", icon: "settings" },
];
const route = () => {
  const raw = location.hash.replace(/^#\/?/, "") || "monitors";
  const [name, param] = raw.split("/");
  return { name, param };
};
const go = (path) => { location.hash = "#/" + path; if (route().name === path) render(); };

/* ---------- shell rendering ---------- */

function renderNav() {
  const r = route();
  const open = state.incidents.filter((i) => i.status === "ongoing").length;
  const build = (items) => items.map((n) => {
    const active = r.name === n.id || (n.id === "monitors" && r.name === "monitor") || (n.id === "status-pages" && r.name === "status");
    const badge = n.badge && open ? `<span class="nav-badge">${open}</span>` : "";
    return `<a href="#/${n.id}" class="${active ? "active" : ""}"><span class="nav-icon">${icon(n.icon)}</span><span>${n.label}</span>${badge}</a>`;
  }).join("");
  $("#nav").innerHTML = build(NAV_MAIN);
  $("#navSecondary").innerHTML = build(NAV_SYS);
}

function renderSync() {
  const chip = $("#syncChip"), mini = $("#syncMini");
  if (!chip || !mini) return;
  const s = state.sync.status;
  chip.className = "sync-chip" + (s === "error" ? " error" : s === "syncing" ? " syncing" : "");
  chip.querySelector("b").textContent = state.pending ? "Saving…" : s === "syncing" ? "Syncing…" : s === "error" ? "Offline" : "Synced";
  mini.className = "sync-mini" + (s === "error" ? " error" : s === "syncing" ? " syncing" : "");
  $("#syncMiniTitle").textContent = state.pending ? "Saving changes…" : s === "syncing" ? "Synchronizing…" : s === "error" ? "Sync paused" : "All changes synced";
  $("#syncMiniSub").textContent = s === "error" ? (state.sync.error || "Connection lost") : state.sync.at ? "Updated " + ago(state.sync.at) : "Supabase cloud";
}

function renderRail() {
  const up = state.monitors.filter((m) => stateOf(m) === "up").length;
  const down = state.monitors.filter((m) => stateOf(m) === "down").length;
  const paused = state.monitors.filter((m) => stateOf(m) === "paused").length;
  const uptime = state.monitors.length ? (state.monitors.reduce((a, m) => a + Number(m.uptime_24h || 0), 0) / state.monitors.length) : 100;
  const failed = state.heartbeats.filter((h) => h.status === "down").length;
  const events = state.incidents.slice(0, 4).map((i) => {
    const m = state.monitors.find((x) => x.id === i.monitor_id);
    return `<div class="rail-event"><i class="${i.status === "ongoing" ? "down" : ""}"></i><span><b>${esc(m ? m.name : "Monitor " + i.monitor_id)}</b><small>${i.status === "ongoing" ? "Went down" : "Recovered"} · ${ago(i.started_at)}</small></span></div>`;
  }).join("") || `<div class="rail-event"><i></i><span><b>No active incidents</b><small>Every check is healthy right now.</small></span></div>`;

  $("#rail").innerHTML = `
    <div class="rail-card">
      <div class="rail-head"><h3>Current status</h3><button data-go="incidents">View all</button></div>
      <div class="big-status">
        <div class="status-ring ${down ? "bad" : ""}"><span>${down ? state.monitors.length ? Math.round((up / state.monitors.length) * 100) : 0 : 100}%</span></div>
        <div><b>${down ? "Attention needed" : "All systems go"}</b><small>${down ? down + " monitor" + (down > 1 ? "s" : "") + " need attention" : "Every monitor is operational"}</small></div>
      </div>
      <div class="rail-stats">
        <div class="rail-stat"><b style="color:var(--good)">${up}</b><small>Up</small></div>
        <div class="rail-stat"><b style="color:var(--bad)">${down}</b><small>Down</small></div>
        <div class="rail-stat"><b style="color:var(--paused)">${paused}</b><small>Paused</small></div>
      </div>
    </div>
    <div class="rail-card">
      <div class="rail-head"><h3>Last 24 hours</h3><button data-go="settings">Details</button></div>
      <div class="rail-kv"><span>Overall uptime</span><b style="color:var(--accent-2)">${uptime.toFixed(2)}%</b></div>
      <div class="rail-kv"><span>Checks recorded</span><b>${state.heartbeats.length}</b></div>
      <div class="rail-kv"><span>Failed checks</span><b style="color:${failed ? "var(--bad)" : "var(--good)"}">${failed}</b></div>
      <div class="rail-kv"><span>Incidents</span><b>${state.incidents.length}</b></div>
    </div>
    <div class="rail-card">
      <div class="rail-head"><h3>Latest events</h3></div>
      <div class="rail-list">${events}</div>
    </div>
    <div class="rail-foot">REVENGE UPTIME<br><b>Powered by idam Emmanuel.</b></div>`;
  $$("[data-go]", $("#rail")).forEach((b) => b.onclick = () => go(b.dataset.go));
}

function renderTopbar() {
  const r = route();
  const label = r.name === "monitor" ? "Monitor details" : r.name === "status" ? "Public status" : (NAV_MAIN.concat(NAV_SYS).find((n) => n.id === r.name) || {}).label || "Monitors";
  $("#crumbTitle").textContent = label;
  $("#crumbSection").textContent = r.name.startsWith("monitor") || r.name.startsWith("status") ? "Monitoring" : "Workspace";
  renderSync();
}

function render() {
  renderNav(); renderTopbar(); renderRail();
  const r = route();
  const views = {
    monitors: renderMonitors, monitor: renderMonitorDetail, incidents: renderIncidents,
    "status-pages": renderStatusPages, status: renderPublicStatus, maintenance: renderMaintenance,
    alerts: renderAlerts, team: renderTeam, integrations: renderIntegrations, settings: renderSettings,
  };
  (views[r.name] || renderMonitors)();
}

/* ---------- shared UI helpers ---------- */

function pageHead(eyebrow, title, sub, actions = "") {
  return `<div class="page-head"><div><div class="eyebrow">${esc(eyebrow)}</div><h1 class="page-title">${esc(title)}</h1><div class="page-sub">${esc(sub)}</div></div><div class="page-actions">${actions}</div></div>`;
}
function emptyState(title, text, button = "") {
  return `<div class="empty-state"><div class="empty-icon">${icon("activity")}</div><b>${esc(title)}</b><p>${esc(text)}</p>${button}</div>`;
}
function statusPill(s, text) {
  const v = String(s || "pending").toLowerCase();
  return `<span class="status-pill ${v}"><i></i>${esc(text || v)}</span>`;
}
function bars(id, count = 30) {
  const list = state.heartbeats.filter((h) => h.monitor_id === id).slice(0, count).reverse();
  if (!list.length) return `<div class="bars">${Array.from({ length: count }, () => "<i class='p'></i>").join("")}</div>`;
  return `<div class="bars">${list.map((h) => {
    const cls = h.status === "up" ? "" : h.status === "down" ? "d" : "p";
    return `<i class="${cls}" title="${esc(h.status)} · ${esc(h.detail || "")} · ${h.response_ms ?? "—"}ms"></i>`;
  }).join("")}</div>`;
}

function showModal(html, onMount) {
  const root = $("#modalRoot");
  root.innerHTML = `<div class="modal">${html}</div>`;
  root.classList.add("open");
  $$("[data-close]", root).forEach((b) => b.onclick = closeModal);
  root.onclick = (e) => { if (e.target === root) closeModal(); };
  onMount && onMount(root);
}
function closeModal() { $("#modalRoot").classList.remove("open"); $("#modalRoot").innerHTML = ""; }

function modalForm(title, sub, fields, onSubmit) {
  showModal(`
    <div class="modal-head"><div><h2>${esc(title)}</h2><p>${esc(sub)}</p></div><button class="icon-btn icon-x" data-close aria-label="Close">${icon("x")}</button></div>
    <form id="modalForm"><div class="modal-body">${fields}</div>
      <div class="modal-foot"><button type="button" class="btn btn-ghost" data-close>Cancel</button><button type="submit" class="btn btn-primary">Save changes</button></div>
    </form>`, () => {
    $("#modalForm").onsubmit = (e) => {
      e.preventDefault();
      const payload = Object.fromEntries(new FormData($("#modalForm")).entries());
      closeModal();
      onSubmit(payload);
    };
  });
}

function confirmModal(title, text, onConfirm) {
  showModal(`
    <div class="modal-head"><div><h2>${esc(title)}</h2><p>${esc(text)}</p></div><button class="icon-btn icon-x" data-close>${icon("x")}</button></div>
    <div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-danger" id="confirmYes">Confirm</button></div>`, () => {
    $("#confirmYes").onclick = () => { closeModal(); onConfirm(); };
  });
}

function promptAdmin(then) {
  showModal(`
    <div class="modal-head"><div><h2>Admin control</h2><p>Your secret unlocks monitor, alert and status-page writes.</p></div><button class="icon-btn icon-x" data-close>${icon("x")}</button></div>
    <div class="modal-body"><div class="field"><label>Admin secret</label><input id="adminSecret" type="password" autocomplete="current-password" placeholder="Enter admin secret"></div><div class="field-hint">Held only in this browser session — never sent to the page source.</div></div>
    <div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="adminUnlock">Unlock controls</button></div>`, () => {
    $("#adminUnlock").onclick = () => {
      const v = $("#adminSecret").value.trim();
      if (!v) return toast("Enter the admin secret", "error");
      state.admin = v; sessionStorage.setItem("rv_admin", v); closeModal(); toast("Admin controls unlocked", "ok"); then();
    };
  });
}

/* ---------- command palette ---------- */

const COMMANDS = [
  { id: "new", title: "Create a new monitor", hint: "Add a real HTTP or keyword check", icon: "plus", key: "N", run: () => monitorForm() },
  { id: "sync", title: "Synchronize now", hint: "Pull the latest cloud state", icon: "refresh", key: "R", run: () => syncNow() },
  { id: "monitors", title: "Go to monitors", hint: "Open the monitor table", icon: "grid", run: () => go("monitors") },
  { id: "incidents", title: "Go to incidents", hint: "Review uptime events", icon: "flag", run: () => go("incidents") },
  { id: "status", title: "Go to status pages", hint: "Manage public status", icon: "layers", run: () => go("status-pages") },
  { id: "alerts", title: "Go to alert contacts", hint: "Webhook, Slack and Discord", icon: "bell", run: () => go("alerts") },
  { id: "settings", title: "Open settings", hint: "Sync and session controls", icon: "settings", run: () => go("settings") },
];
function openPalette() {
  state.paletteQuery = ""; state.paletteIndex = 0;
  renderPalette(); $("#paletteRoot").classList.add("open"); $("#paletteInput").focus();
}
function closePalette() { $("#paletteRoot").classList.remove("open"); $("#paletteRoot").innerHTML = ""; }
function filteredCommands() {
  const q = state.paletteQuery.toLowerCase();
  return COMMANDS.filter((c) => !q || c.title.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
}
function renderPalette() {
  const list = filteredCommands();
  $("#paletteRoot").innerHTML = `<div class="palette">
    <div class="palette-input-wrap">${icon("search")}<input id="paletteInput" placeholder="Search actions or pages…" value="${esc(state.paletteQuery)}" autocomplete="off"></div>
    <div class="palette-list">${list.length ? list.map((c, i) => `<button class="palette-item ${i === state.paletteIndex ? "selected" : ""}" data-cmd="${c.id}">
      <span class="pi-icon">${icon(c.icon)}</span><span><b>${esc(c.title)}</b><small>${esc(c.hint)}</small></span>${c.key ? `<kbd>${c.key}</kbd>` : ""}</button>`).join("") : `<div class="palette-empty">No matching commands.</div>`}</div>
  </div>`;
  $("#paletteInput").oninput = (e) => { state.paletteQuery = e.target.value; state.paletteIndex = 0; renderPalette(); $("#paletteInput").focus(); };
  $$("[data-cmd]").forEach((b) => b.onclick = () => runCommand(b.dataset.cmd));
}
function runCommand(id) {
  const c = COMMANDS.find((x) => x.id === id);
  closePalette(); c && c.run();
}

/* ---------- monitors ---------- */

function visibleMonitors() {
  let list = [...state.monitors];
  if (state.filter !== "all") list = list.filter((m) => state.filter === "paused" ? stateOf(m) === "paused" : stateOf(m) === state.filter);
  if (state.query) { const q = state.query.toLowerCase(); list = list.filter((m) => m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q)); }
  if (state.sort === "down") list.sort((a, b) => (stateOf(a) === "down" ? 0 : 1) - (stateOf(b) === "down" ? 0 : 1));
  if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  if (state.sort === "uptime") list.sort((a, b) => Number(a.uptime_24h) - Number(b.uptime_24h));
  if (state.sort === "latency") list.sort((a, b) => Number(b.last_response_ms || 0) - Number(a.last_response_ms || 0));
  return list;
}

function renderMonitors() {
  const active = document.activeElement, preserveSearch = active && active.id === "monitorSearch";
  const caret = preserveSearch ? active.selectionStart : 0;
  const list = visibleMonitors();
  const up = state.monitors.filter((m) => stateOf(m) === "up").length;
  const down = state.monitors.filter((m) => stateOf(m) === "down").length;
  const avg = state.monitors.length ? (state.monitors.reduce((a, m) => a + Number(m.uptime_24h || 0), 0) / state.monitors.length).toFixed(2) : "100.00";

  $("#view").innerHTML = `
    ${pageHead("Monitoring", "Monitors.", "Real checks, real heartbeats, real control.", `<button class="btn btn-ghost" id="denseBtn">${state.dense ? "Comfortable" : "Dense"} view</button><button class="btn btn-primary" id="newMonitorBtn">${icon("plus")} New monitor</button>`)}
    <div class="metric-grid">
      <div class="metric-card"><div class="metric-label">Total monitors</div><div class="metric-value">${state.monitors.length}</div><div class="metric-sub">Across all checks</div></div>
      <div class="metric-card"><div class="metric-label">Operational</div><div class="metric-value" style="color:var(--good)">${up}</div><div class="metric-sub">${down ? `<b>${down} need attention</b>` : "Everything is healthy"}</div></div>
      <div class="metric-card"><div class="metric-label">Open incidents</div><div class="metric-value" style="color:${state.incidents.some((i) => i.status === "ongoing") ? "var(--bad)" : "var(--good)"}">${state.incidents.filter((i) => i.status === "ongoing").length}</div><div class="metric-sub">${state.incidents.length} recorded total</div></div>
      <div class="metric-card"><div class="metric-label">Average uptime</div><div class="metric-value" style="color:var(--accent-2)">${avg}%</div><div class="metric-sub">Rolling 24-hour window</div></div>
    </div>
    ${state.selected.size ? `<div class="bulk-bar">${icon("check")}<b>${state.selected.size} selected</b><span class="spacer"></span><button class="btn btn-sm" data-bulk="pauseMonitor">${icon("pause")} Pause</button><button class="btn btn-sm" data-bulk="resumeMonitor">${icon("play")} Resume</button><button class="btn btn-danger btn-sm" data-bulk="deleteMonitor">${icon("trash")} Delete</button><button class="btn btn-ghost btn-sm" id="clearSelection">Clear</button></div>` : ""}
    <div class="panel">
      <div class="panel-head">
        <div><div class="panel-title">All monitors</div><div class="panel-sub">${state.heartbeats.length} heartbeats stored · synced ${state.sync.at ? ago(state.sync.at) : "just now"}</div></div>
        <div class="panel-actions"><button class="btn btn-ghost btn-sm" id="syncInline">${icon("refresh")} Sync</button></div>
      </div>
      <div class="panel-body" style="padding:12px 14px">
        <div class="toolbar">
          <div class="search-field">${icon("search")}<input id="monitorSearch" placeholder="Search by name or URL" value="${esc(state.query)}"></div>
          <div class="segmented" id="statusFilter">
            <button data-filter="all" class="${state.filter === "all" ? "active" : ""}">All</button>
            <button data-filter="up" class="${state.filter === "up" ? "active" : ""}">Up</button>
            <button data-filter="down" class="${state.filter === "down" ? "active" : ""}">Down</button>
            <button data-filter="paused" class="${state.filter === "paused" ? "active" : ""}">Paused</button>
          </div>
          <select id="sortSelect" style="width:150px">
            <option value="down" ${state.sort === "down" ? "selected" : ""}>Down first</option>
            <option value="name" ${state.sort === "name" ? "selected" : ""}>Name A–Z</option>
            <option value="uptime" ${state.sort === "uptime" ? "selected" : ""}>Lowest uptime</option>
            <option value="latency" ${state.sort === "latency" ? "selected" : ""}>Slowest first</option>
          </select>
        </div>
        ${list.length ? `<div class="table-wrap"><table>
          <thead><tr>
            <th class="col-check"><input type="checkbox" id="selectAll" ${list.length && list.every((m) => state.selected.has(m.id)) ? "checked" : ""}></th>
            <th data-sort="name" class="sortable">Monitor</th>
            <th>Status</th>
            <th class="col-interval">Interval</th>
            <th class="col-bars">Last 24 hours</th>
            <th class="col-uptime">Uptime</th>
            <th class="col-latency">Latency</th>
            <th class="col-actions"></th>
          </tr></thead>
          <tbody>${list.map((m) => {
            const hb = lastHeartbeat(m.id);
            const st = stateOf(m);
            return `<tr>
              <td><input type="checkbox" class="rowCheck" value="${m.id}" ${state.selected.has(m.id) ? "checked" : ""}></td>
              <td><div class="mon-cell"><span class="mon-avatar">${esc(initials(m.name))}</span><span style="min-width:0"><a class="mon-name" href="#/monitor/${m.id}">${esc(m.name)}</a><span class="mon-url">${esc(m.url)}</span></span><span class="tag">${esc((m.type || "http").toUpperCase())}</span></div></td>
              <td>${statusPill(st, st === "up" ? "Up · " + durationSince(hb && hb.created_at) : st)}</td>
              <td class="col-interval" style="color:var(--muted)">${m.interval_seconds >= 60 ? m.interval_seconds / 60 + " min" : m.interval_seconds + " sec"}</td>
              <td class="col-bars">${bars(m.id)}</td>
              <td class="uptime-value">${Number(m.uptime_24h ?? 100).toFixed(2)}%</td>
              <td class="latency">${m.last_response_ms != null ? m.last_response_ms + " ms" : "—"}</td>
              <td><button class="btn btn-ghost btn-sm btn-icon" data-menu="${m.id}" aria-label="Monitor actions">${icon("more")}</button></td>
            </tr>`;
          }).join("")}</tbody>
        </table></div>` : emptyState("No monitors match this view", "Adjust the filters or create a new monitor to start checking.", `<button class="btn btn-primary" id="emptyNew">${icon("plus")} New monitor</button>`)}
      </div>
    </div>`;

  $("#newMonitorBtn").onclick = () => monitorForm();
  const emptyNew = $("#emptyNew"); if (emptyNew) emptyNew.onclick = () => monitorForm();
  $("#syncInline").onclick = () => syncNow();
  $("#denseBtn").onclick = () => { state.dense = !state.dense; localStorage.setItem("rv_dense", state.dense ? "1" : "0"); document.body.classList.toggle("dense", state.dense); render(); };
  $("#monitorSearch").oninput = (e) => { state.query = e.target.value; renderMonitors(); const el = $("#monitorSearch"); el.focus(); el.setSelectionRange(el.value.length, el.value.length); };
  $$("#statusFilter button").forEach((b) => b.onclick = () => { state.filter = b.dataset.filter; render(); });
  $("#sortSelect").onchange = (e) => { state.sort = e.target.value; render(); };
  $$("th.sortable").forEach((th) => th.onclick = () => { state.sort = th.dataset.sort; render(); });
  const all = $("#selectAll"); if (all) all.onchange = (e) => { state.selected = e.target.checked ? new Set(list.map((m) => m.id)) : new Set(); render(); };
  $$(".rowCheck").forEach((el) => el.onchange = () => { el.checked ? state.selected.add(Number(el.value)) : state.selected.delete(Number(el.value)); render(); });
  $$("[data-menu]").forEach((b) => b.onclick = () => monitorMenu(Number(b.dataset.menu)));
  $$("[data-bulk]").forEach((b) => b.onclick = () => bulkMonitors(b.dataset.bulk));
  const clear = $("#clearSelection"); if (clear) clear.onclick = () => { state.selected.clear(); render(); };
  if (preserveSearch) { const el = $("#monitorSearch"); if (el) { el.focus(); el.setSelectionRange(caret, caret); } }
}

function monitorForm(m) {
  modalForm(m ? "Edit monitor" : "New monitor", "Real checks run from Supabase on the configured interval.",
    `<div class="field"><label>Friendly name</label><input name="name" required value="${esc(m?.name || "")}" placeholder="My API"></div>
     <div class="field"><label>URL to check</label><input name="url" type="url" required value="${esc(m?.url || "")}" placeholder="https://example.com/health"></div>
     <div class="field-row">
       <div class="field"><label>Type</label><select name="type"><option value="http" ${!m || m.type === "http" ? "selected" : ""}>HTTP(S)</option><option value="keyword" ${m?.type === "keyword" ? "selected" : ""}>HTTP keyword</option></select></div>
       <div class="field"><label>Interval</label><select name="interval_seconds">
         <option value="60" ${!m || m.interval_seconds == 60 ? "selected" : ""}>1 minute</option>
         <option value="300" ${m?.interval_seconds == 300 ? "selected" : ""}>5 minutes</option>
         <option value="600" ${m?.interval_seconds == 600 ? "selected" : ""}>10 minutes</option>
       </select></div>
     </div>
     <div class="field"><label>Keyword</label><input name="keyword" value="${esc(m?.keyword || "")}" placeholder="healthy"><div class="field-hint">Only used for keyword monitors.</div></div>`,
    (p) => { p.interval_seconds = Number(p.interval_seconds); if (m) p.id = m.id; safeAdmin(m ? "updateMonitor" : "addMonitor", p); });
}

function monitorMenu(id) {
  const m = state.monitors.find((x) => x.id === id); if (!m) return;
  showModal(`
    <div class="modal-head"><div><h2>${esc(m.name)}</h2><p>${esc(m.url)}</p></div><button class="icon-btn icon-x" data-close>${icon("x")}</button></div>
    <div class="modal-body" style="display:grid;gap:8px">
      <button class="btn" id="mDetail">${icon("external")} Open details</button>
      <button class="btn" id="mEdit">${icon("edit")} Edit monitor</button>
      <button class="btn" id="mToggle">${icon(stateOf(m) === "paused" ? "play" : "pause")} ${stateOf(m) === "paused" ? "Resume" : "Pause"}</button>
      <button class="btn" id="mDup">${icon("copy")} Duplicate</button>
      <button class="btn btn-danger" id="mDel">${icon("trash")} Delete monitor</button>
    </div>`, () => {
    $("#mDetail").onclick = () => { closeModal(); go("monitor/" + id); };
    $("#mEdit").onclick = () => { closeModal(); monitorForm(m); };
    $("#mToggle").onclick = () => { closeModal(); safeAdmin(stateOf(m) === "paused" ? "resumeMonitor" : "pauseMonitor", { id }); };
    $("#mDup").onclick = () => { closeModal(); safeAdmin("addMonitor", { name: m.name + " (copy)", url: m.url, keyword: m.keyword || "", type: m.type || "http", interval_seconds: m.interval_seconds }); };
    $("#mDel").onclick = () => { closeModal(); confirmModal("Delete " + m.name + "?", "Heartbeats and incidents for this monitor will be removed too.", () => safeAdmin("deleteMonitor", { id })); };
  });
}

function bulkMonitors(action) {
  const ids = [...state.selected];
  if (!ids.length) return;
  const label = action === "deleteMonitor" ? "delete" : action === "pauseMonitor" ? "pause" : "resume";
  confirmModal("Bulk " + label + " " + ids.length + " monitor" + (ids.length > 1 ? "s" : "") + "?", "This applies to every selected monitor.", () => {
    state.selected.clear(); safeAdmin("bulkMonitorAction", { ids, bulk: action });
  });
}

/* ---------- monitor detail ---------- */

function lineChart(values) {
  if (!values.length) return `<div class="empty-state" style="padding:34px"><b>No response samples yet</b><p>Charts appear after the first real checks.</p></div>`;
  const w = 700, hgt = 190, max = Math.max(...values, 1);
  const pts = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * w},${hgt - 18 - (v / max) * (hgt - 34)}`).join(" ");
  const area = `M0,${hgt} L${pts.replace(/ /g, " L")} L${w},${hgt} Z`;
  return `<div class="chart-wrap"><svg class="chart-svg" viewBox="0 0 ${w} ${hgt}" preserveAspectRatio="none">
    <defs><linearGradient id="rvChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#22d3ee" stop-opacity=".35"/><stop offset="100%" stop-color="#7c5cff" stop-opacity="0"/></linearGradient></defs>
    <line class="chart-grid" x1="0" y1="48" x2="${w}" y2="48"/><line class="chart-grid" x1="0" y1="96" x2="${w}" y2="96"/><line class="chart-grid" x1="0" y1="144" x2="${w}" y2="144"/>
    <path class="chart-area" d="${area}"/><polyline class="chart-line" points="${pts}"/>
    <circle class="chart-dot" cx="${w}" cy="${hgt - 18 - (values[values.length - 1] / max) * (hgt - 34)}" r="4"/>
  </svg><div class="chart-labels"><span>Older checks</span><span>Peak ${max} ms</span><span>Latest</span></div></div>`;
}

function renderMonitorDetail(id) {
  const m = state.monitors.find((x) => x.id === Number(id));
  if (!m) { $("#view").innerHTML = emptyState("Monitor not found", "It may have been deleted."); return; }
  const hs = state.heartbeats.filter((h) => h.monitor_id === m.id).slice(0, 200).reverse();
  const inc = state.incidents.filter((i) => i.monitor_id === m.id);
  const times = hs.map((h) => h.response_ms).filter((x) => x != null);
  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const st = stateOf(m);
  $("#view").innerHTML = `
    ${pageHead("Monitor details", m.name, esc(m.url) + " · " + esc((m.type || "http").toUpperCase()) + " check",
      `<a class="btn btn-ghost" href="#/monitors">${icon("chevron")} Back</a><button class="btn" id="detailEdit">${icon("edit")} Edit</button>${st === "paused" ? `<button class="btn btn-primary" id="detailResume">${icon("play")} Resume</button>` : `<button class="btn" id="detailPause">${icon("pause")} Pause</button>`}`)}
    <div class="metric-grid">
      <div class="metric-card"><div class="metric-label">Current status</div><div style="margin-top:9px">${statusPill(st, st)}</div><div class="metric-sub">Checked ${ago(m.last_checked_at)}</div></div>
      <div class="metric-card"><div class="metric-label">24h uptime</div><div class="metric-value" style="color:var(--accent-2)">${Number(m.uptime_24h ?? 100).toFixed(2)}%</div><div class="metric-sub">Rolling window</div></div>
      <div class="metric-card"><div class="metric-label">Avg response</div><div class="metric-value">${avg}<span style="font-size:13px;color:var(--muted)"> ms</span></div><div class="metric-sub">Peak ${times.length ? Math.max(...times) : 0} ms</div></div>
      <div class="metric-card"><div class="metric-label">Checks stored</div><div class="metric-value">${state.heartbeats.filter((h) => h.monitor_id === m.id).length}</div><div class="metric-sub">${inc.length} incident${inc.length === 1 ? "" : "s"} recorded</div></div>
    </div>
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Response time</div><div class="panel-sub">Recent real checks from the Supabase engine</div></div></div><div class="panel-body">${lineChart(times)}</div></div>
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Availability</div><div class="panel-sub">Latest recorded checks</div></div></div><div class="panel-body">${bars(m.id, 48)}</div></div>
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Incident history</div><div class="panel-sub">Automatically opened and resolved by real check transitions</div></div></div><div class="panel-body">
      ${inc.length ? `<div class="timeline">${inc.map((i) => `<div class="timeline-item ${i.status === "ongoing" ? "down" : ""}"><b>${esc(i.reason || "Downtime detected")}</b><small>${fmtDate(i.started_at)} · ${i.resolved_at ? "Resolved " + fmtDate(i.resolved_at) : "Ongoing · " + fmtDur((Date.now() - new Date(i.started_at).getTime()) / 1000)}</small></div>`).join("")}</div>` : emptyState("Clean record", "No incidents recorded for this monitor.")}
    </div></div>`;
  $("#detailEdit").onclick = () => monitorForm(m);
  const pause = $("#detailPause"); if (pause) pause.onclick = () => safeAdmin("pauseMonitor", { id: m.id });
  const resume = $("#detailResume"); if (resume) resume.onclick = () => safeAdmin("resumeMonitor", { id: m.id });
}

/* ---------- incidents ---------- */

function renderIncidents() {
  let list = [...state.incidents];
  if (state.incidentFilter !== "all") list = list.filter((i) => i.status === state.incidentFilter);
  $("#view").innerHTML = `
    ${pageHead("Event log", "Incidents.", "Real downtime events, opened and closed by the check engine.", `<button class="btn btn-ghost" id="incidentSync">${icon("refresh")} Sync</button>`)}
    <div class="panel"><div class="panel-head">
      <div class="segmented" id="incidentFilter">
        <button data-filter="all" class="${state.incidentFilter === "all" ? "active" : ""}">All</button>
        <button data-filter="ongoing" class="${state.incidentFilter === "ongoing" ? "active" : ""}">Ongoing</button>
        <button data-filter="resolved" class="${state.incidentFilter === "resolved" ? "active" : ""}">Resolved</button>
      </div>
      <div class="panel-actions"><span class="panel-sub">${list.length} event${list.length === 1 ? "" : "s"}</span></div>
    </div><div class="panel-body" style="padding:0">
      ${list.length ? `<div class="table-wrap"><table><thead><tr><th>Status</th><th>Monitor</th><th>Started</th><th>Duration</th><th style="width:110px"></th></tr></thead><tbody>
        ${list.map((i) => { const m = state.monitors.find((x) => x.id === i.monitor_id); return `<tr>
          <td>${statusPill(i.status, i.status)}</td>
          <td><div class="mon-cell"><span class="mon-avatar">${esc(initials(m?.name || "?"))}</span><span><b>${esc(m?.name || "Monitor " + i.monitor_id)}</b><span class="mon-url">${esc(i.reason || "Downtime detected")}</span></span></div></td>
          <td style="color:var(--muted)">${fmtDate(i.started_at)}</td>
          <td>${fmtDur(i.duration_seconds ?? (i.status === "ongoing" ? (Date.now() - new Date(i.started_at).getTime()) / 1000 : null))}</td>
          <td>${i.status === "ongoing" ? `<button class="btn btn-sm" data-resolve="${i.id}">Resolve</button>` : ""}<button class="btn btn-ghost btn-sm btn-icon" data-delinc="${i.id}" aria-label="Delete">${icon("trash")}</button></td>
        </tr>`; }).join("")}
      </tbody></table></div>` : emptyState("No incidents here", "A real incident opens automatically when a check fails.")}
    </div></div>`;
  $("#incidentSync").onclick = () => syncNow();
  $$("#incidentFilter button").forEach((b) => b.onclick = () => { state.incidentFilter = b.dataset.filter; render(); });
  $$("[data-resolve]").forEach((b) => b.onclick = () => safeAdmin("resolveIncident", { id: Number(b.dataset.resolve) }));
  $$("[data-delinc]").forEach((b) => b.onclick = () => confirmModal("Delete incident?", "This removes the event from the log.", () => safeAdmin("deleteIncident", { id: Number(b.dataset.delinc) })));
}

/* ---------- status pages ---------- */

function renderStatusPages() {
  $("#view").innerHTML = `
    ${pageHead("Public presence", "Status pages.", "Publish a clean view of your systems and incidents.", `<button class="btn btn-primary" id="newPageBtn">${icon("plus")} New status page</button>`)}
    ${state.pages.length ? `<div class="info-grid">${state.pages.map((p) => {
      const ids = state.pageMonitors.filter((x) => x.page_id === p.id).map((x) => x.monitor_id);
      const down = state.monitors.filter((m) => ids.includes(m.id) && stateOf(m) === "down").length;
      return `<div class="info-card"><div style="display:flex;gap:10px;align-items:flex-start"><div class="mon-avatar">${icon("layers")}</div><div style="flex:1"><h3>${esc(p.title)}</h3><p>/${esc(p.slug)} · ${ids.length} monitors · ${p.active ? "Published" : "Hidden"}</p></div>${statusPill(down ? "down" : "up", down ? "Issues" : "Live")}</div>
        <div style="display:flex;gap:7px;margin-top:15px"><a class="btn btn-sm" href="#/status/${esc(p.slug)}">${icon("external")} View</a><button class="btn btn-sm" data-editpage="${p.id}">${icon("edit")} Edit</button><button class="btn btn-danger btn-sm" data-delpage="${p.id}">${icon("trash")}</button></div></div>`;
    }).join("")}</div>` : emptyState("No status pages yet", "Create one to share live service health.", `<button class="btn btn-primary" id="emptyPageBtn">${icon("plus")} New status page</button>`)}`;
  $("#newPageBtn").onclick = () => statusPageForm();
  const ep = $("#emptyPageBtn"); if (ep) ep.onclick = () => statusPageForm();
  $$("[data-editpage]").forEach((b) => b.onclick = () => statusPageForm(state.pages.find((p) => p.id === Number(b.dataset.editpage))));
  $$("[data-delpage]").forEach((b) => b.onclick = () => confirmModal("Delete status page?", "The page and its monitor links will be removed.", () => safeAdmin("deleteStatusPage", { id: Number(b.dataset.delpage) })));
}

function statusPageForm(p) {
  const selected = new Set(state.pageMonitors.filter((x) => x.page_id === p?.id).map((x) => x.monitor_id));
  modalForm(p ? "Edit status page" : "New status page", "Choose the monitors this public page should show.",
    `<div class="field"><label>Title</label><input name="title" required value="${esc(p?.title || "")}" placeholder="REVENGE Status"></div>
     <div class="field"><label>Slug</label><input name="slug" required pattern="[a-z0-9-]+" value="${esc(p?.slug || "my-status")}" ${p ? "readonly" : ""}></div>
     <div class="field"><label>Description</label><textarea name="description" rows="2">${esc(p?.description || "")}</textarea></div>
     <div class="field"><label>Monitors</label><div class="check-list">${state.monitors.map((m) => `<label><input type="checkbox" name="mon" value="${m.id}" ${selected.has(m.id) ? "checked" : ""}> ${esc(m.name)}</label>`).join("") || `<div class="field-hint">Create a monitor first.</div>`}</div></div>`,
    (payload) => {
      const fd = $("#modalForm") ? new FormData($("#modalForm")) : null;
      // FormData is captured before close by modalForm; rebuild monitor ids from a snapshot set on the form.
      payload.monitor_ids = (window.__rvPageMonitors || []).map(Number);
      if (p) { payload.id = p.id; payload.active = p.active; }
      delete payload.mon;
      safeAdmin(p ? "updateStatusPage" : "addStatusPage", payload);
    });
  // Capture checkbox values before the form is removed by modalForm's submit handler.
  const form = $("#modalForm");
  if (form) form.addEventListener("submit", () => { window.__rvPageMonitors = [...$$("input[name=mon]:checked")].map((el) => el.value); }, true);
}

function renderPublicStatus(slug) {
  const p = state.pages.find((x) => x.slug === slug);
  if (!p) { $("#view").innerHTML = emptyState("Status page not found", "Check the slug or create the page again."); return; }
  const ids = state.pageMonitors.filter((x) => x.page_id === p.id).map((x) => x.monitor_id);
  const list = state.monitors.filter((m) => ids.includes(m.id));
  const down = list.filter((m) => stateOf(m) === "down").length;
  $("#view").innerHTML = `
    ${pageHead("Public status", p.title, esc(p.description || "Live system health") + " · Powered by idam Emmanuel.", `<a class="btn btn-ghost" href="#/status-pages">${icon("chevron")} Back</a>`)}
    <div class="panel" style="margin-bottom:14px;background:linear-gradient(135deg,rgba(124,92,255,.16),rgba(34,211,238,.07));padding:22px">
      <h2 style="margin:0 0 7px;font-size:23px">${down ? "Some systems need attention" : "All systems operational"}</h2>
      <div class="panel-sub">${esc(p.description || "Live availability across selected services.")}</div>
    </div>
    <div class="panel"><div class="panel-head"><div class="panel-title">Service components</div><div class="panel-actions"><span class="panel-sub">${list.length} services</span></div></div><div class="panel-body" style="padding:0">
      ${list.length ? list.map((m) => `<div class="service-row"><div class="mon-cell"><span class="mon-avatar">${esc(initials(m.name))}</span><span><b>${esc(m.name)}</b><span class="mon-url">${Number(m.uptime_24h ?? 100).toFixed(2)}% uptime · checked ${ago(m.last_checked_at)}</span></span></div>${bars(m.id, 20)}${statusPill(stateOf(m), stateOf(m))}</div>`).join("") : emptyState("No monitors assigned", "Edit this page and select monitors to display.")}
    </div></div>
    <div class="panel"><div class="panel-head"><div class="panel-title">Incident timeline</div></div><div class="panel-body">
      ${state.incidents.length ? `<div class="timeline">${state.incidents.slice(0, 10).map((i) => { const m = state.monitors.find((x) => x.id === i.monitor_id); return `<div class="timeline-item ${i.status === "ongoing" ? "down" : ""}"><b>${esc(m?.name || "Monitor")} · ${esc(i.status)}</b><small>${esc(i.reason || "Downtime")} · ${fmtDate(i.started_at)}</small></div>`; }).join("")}</div>` : emptyState("No incidents recorded", "The timeline will populate when a real check fails.")}
    </div></div>`;
}

/* ---------- maintenance + alerts ---------- */

function renderMaintenance() {
  $("#view").innerHTML = `
    ${pageHead("Planned work", "Maintenance.", "Schedule windows without confusing your uptime history.", `<button class="btn btn-primary" id="newMaintenanceBtn">${icon("plus")} Schedule window</button>`)}
    ${state.maintenance.length ? state.maintenance.map((w) => `<div class="info-card" style="margin-bottom:10px;display:flex;align-items:center;gap:12px"><div class="mon-avatar">${icon("calendar")}</div><div style="flex:1"><h3>${esc(w.title)}</h3><p>${fmtDate(w.starts_at)} → ${fmtDate(w.ends_at)} · ${w.active ? "Active" : "Inactive"}</p></div><button class="btn btn-danger btn-sm" data-delmt="${w.id}">${icon("trash")}</button></div>`).join("") : emptyState("No maintenance windows", "Schedule planned downtime so it is not treated as an outage.")}`;
  $("#newMaintenanceBtn").onclick = () => modalForm("Schedule maintenance", "Times are interpreted in your local timezone.",
    `<div class="field"><label>Title</label><input name="title" required placeholder="Database upgrade"></div>
     <div class="field-row"><div class="field"><label>Starts</label><input name="starts_at" type="datetime-local" required></div><div class="field"><label>Ends</label><input name="ends_at" type="datetime-local" required></div></div>`,
    (p) => safeAdmin("addMaintenance", p));
  $$("[data-delmt]").forEach((b) => b.onclick = () => confirmModal("Delete maintenance window?", "This removes it from the schedule.", () => safeAdmin("deleteMaintenance", { id: Number(b.dataset.delmt) })));
}

function renderAlerts() {
  $("#view").innerHTML = `
    ${pageHead("Notifications", "Alert contacts.", "Real DOWN and RECOVERY alerts are fanned out by the check engine.", `<button class="btn btn-primary" id="newChannelBtn">${icon("plus")} Add channel</button>`)}
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Delivery channels</div><div class="panel-sub">Webhooks, Slack and Discord are supported</div></div></div><div class="panel-body">
      ${state.channels.length ? state.channels.map((c) => `<div class="service-row"><div class="mon-avatar">${icon("bell")}</div><div style="flex:1;min-width:0"><b>${esc(c.name)}</b><span class="mon-url">${esc((c.type || "webhook").toUpperCase())} · ${esc(c.target)}</span></div><button class="btn btn-sm" data-testch="${c.id}">Test</button><button class="btn btn-danger btn-sm btn-icon" data-delch="${c.id}">${icon("trash")}</button></div>`).join("") : emptyState("No alert channels", "Add a webhook URL to receive real outage alerts.")}
    </div></div>
    <div class="panel"><div class="panel-head"><div class="panel-title">Alert behavior</div></div><div class="panel-body info-grid">
      <div class="info-card"><h3>DOWN alerts</h3><p>Fired on the first real failed check transition, with monitor name, URL and failure detail.</p></div>
      <div class="info-card"><h3>RECOVERY alerts</h3><p>Fired when a following check succeeds; the incident is closed with a real duration.</p></div>
    </div></div>`;
  $("#newChannelBtn").onclick = () => modalForm("Add alert channel", "The check engine POSTs JSON to this URL.",
    `<div class="field"><label>Name</label><input name="name" required placeholder="Ops webhook"></div>
     <div class="field"><label>Type</label><select name="type"><option>webhook</option><option>slack</option><option>discord</option></select></div>
     <div class="field"><label>Webhook URL</label><input name="target" type="url" required placeholder="https://hooks.slack.com/..."></div>`,
    (p) => safeAdmin("addNotification", p));
  $$("[data-testch]").forEach((b) => b.onclick = () => safeAdmin("testNotification", { id: Number(b.dataset.testch) }));
  $$("[data-delch]").forEach((b) => b.onclick = () => confirmModal("Delete alert channel?", "It will stop receiving alerts immediately.", () => safeAdmin("deleteNotification", { id: Number(b.dataset.delch) })));
}

/* ---------- team, integrations, settings ---------- */

function renderTeam() {
  $("#view").innerHTML = `
    ${pageHead("Access", "Team members.", "Role-aware control for the REVENGE UPTIME workspace.")}
    <div class="panel"><div class="panel-head"><div class="panel-title">Members</div></div><div class="panel-body">
      <div class="service-row" style="border:0"><div class="avatar">IE</div><div style="flex:1"><b>idam001</b><span class="mon-url">Owner · full control</span></div>${statusPill("up", "Active")}</div>
      <p class="panel-sub" style="margin:16px 0 0">Write actions are protected by the admin secret. Share it only with trusted operators.</p>
    </div></div>`;
}

function renderIntegrations() {
  $("#view").innerHTML = `
    ${pageHead("Developer surface", "Integrations & API.", "Everything the dashboard does is available through the admin API.")}
    <div class="info-grid">
      <div class="info-card"><h3>${icon("activity")} Check engine</h3><p>HTTP and keyword checks run every minute from Supabase Edge Functions. Heartbeats, incidents and alert logs are stored in Postgres.</p><div class="code-block">rv-check · ${state.heartbeats.length} heartbeats stored</div></div>
      <div class="info-card"><h3>${icon("key")} Admin API</h3><p>All mutations are signed with the admin secret held in your browser session.</p><div class="code-block">POST ${API}\nx-rv-admin: ••••••••\n{ "action": "addMonitor", "payload": {...} }</div></div>
      <div class="info-card"><h3>${icon("shield")} Public reads</h3><p>Monitor and status data use the Supabase publishable key with read-only policies.</p><div class="code-block">GET ${SB}/rest/v1/rv_monitors?select=*</div></div>
      <div class="info-card"><h3>${icon("refresh")} Synchronization</h3><p>The console polls every 10 seconds, broadcasts changes across open tabs, and reconciles after every write.</p><div class="code-block">Last sync: ${state.sync.at ? state.sync.at.toISOString() : "pending"}</div></div>
    </div>`;
}

function renderSettings() {
  $("#view").innerHTML = `
    ${pageHead("Preferences", "Settings.", "Sync engine, session and display controls.")}
    <div class="info-grid">
      <div class="info-card"><h3>${icon("refresh")} Cloud synchronization</h3><p>Status: <b>${esc(state.sync.status)}</b><br>Last successful sync: ${state.sync.at ? fmtDate(state.sync.at) : "not yet"}<br>Open tabs stay in sync automatically.</p><div class="code-block">${esc(state.sync.error || "No sync errors.")}</div><div style="margin-top:12px"><button class="btn" id="settingsSync">${icon("refresh")} Sync now</button></div></div>
      <div class="info-card"><h3>${icon("key")} Admin session</h3><p>${state.admin ? "Admin controls are unlocked for this browser session." : "Admin controls are locked. Unlock to make changes."}</p><div style="margin-top:12px;display:flex;gap:8px"><button class="btn" id="settingsLock">${state.admin ? "Lock controls" : "Unlock controls"}</button></div></div>
      <div class="info-card"><h3>${icon("grid")} Display</h3><p>Dense mode reduces row height for more monitors on screen.</p><div style="margin-top:12px"><button class="btn" id="settingsDense">${state.dense ? "Use comfortable view" : "Use dense view"}</button></div></div>
      <div class="info-card"><h3>${icon("bolt")} Branding</h3><p>REVENGE UPTIME — Powered by idam Emmanuel.<br>Built from Uptime Kuma under the MIT License.</p><div class="code-block">github.com/idam001/revenge-uptime</div></div>
    </div>`;
  $("#settingsSync").onclick = () => syncNow();
  $("#settingsLock").onclick = () => {
    if (state.admin) { state.admin = ""; sessionStorage.removeItem("rv_admin"); toast("Admin controls locked", "info"); render(); }
    else promptAdmin(() => render());
  };
  $("#settingsDense").onclick = () => { state.dense = !state.dense; localStorage.setItem("rv_dense", state.dense ? "1" : "0"); document.body.classList.toggle("dense", state.dense); render(); };
}

/* ---------- global events + init ---------- */

function bindGlobalEvents() {
  $("#menuBtn").onclick = () => document.body.classList.toggle("nav-open");
  $("#refreshBtn").onclick = () => syncNow();
  $("#cmdTrigger").onclick = openPalette;
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); }
    if (e.key === "Escape") { closePalette(); closeModal(); document.body.classList.remove("nav-open"); }
    if ($("#paletteRoot").classList.contains("open") && ["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
      e.preventDefault();
      const list = filteredCommands();
      if (e.key === "ArrowDown") state.paletteIndex = (state.paletteIndex + 1) % Math.max(1, list.length);
      if (e.key === "ArrowUp") state.paletteIndex = (state.paletteIndex - 1 + Math.max(1, list.length)) % Math.max(1, list.length);
      if (e.key === "Enter" && list[state.paletteIndex]) return runCommand(list[state.paletteIndex].id);
      renderPalette(); $("#paletteInput").focus();
    }
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) syncNow({ silent: true }); });
  addEventListener("online", () => syncNow({ silent: true }));
  if (CHANNEL) CHANNEL.onmessage = (e) => { if (e.data?.type === "sync") syncNow({ silent: true, broadcast: false }); };
  addEventListener("hashchange", () => { document.body.classList.remove("nav-open"); render(); });
}

document.body.classList.toggle("dense", state.dense);
bindGlobalEvents();
render();
syncNow({ silent: true });
setInterval(() => { if (!document.hidden && $("#modalRoot").className === "modal-root") syncNow({ silent: true }); }, 10000);
