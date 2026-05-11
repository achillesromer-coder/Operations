// ============================================================
// MODULE: W2 GOS Luke II Catch/Hold Workspace
// FILE: view.js
// PURPOSE: DOM rendering for W2 modular workspace.
// ============================================================

import { DEFAULT_FORM_VALUES, MODULE_CONFIG, STATUS_MODEL, WORKSPACE_LINKS } from "./config.js";
import { formatEngineering } from "./calculations.js";

export function renderWorkspace(root, state = {}) {
  const form = { ...DEFAULT_FORM_VALUES, ...(state.form || {}) };
  root.innerHTML = `
    <section class="ri-w2" data-module="${MODULE_CONFIG.moduleId}">
      ${renderStyles()}
      ${renderTracker()}
      ${renderForm(form)}
    </section>
  `;
}

function renderTracker() {
  return `
    <section class="ri-w2-tracker">
      <div class="ri-w2-head">
        <div class="ri-w2-logo">⚡</div>
        <div class="ri-w2-title"><h2>Ops Tracker: W2 · GOS Luke II Catch/Hold</h2><p>${MODULE_CONFIG.subtitle} · ${MODULE_CONFIG.route}</p></div>
        <nav class="ri-w2-fuse">${WORKSPACE_LINKS.map(renderLink).join("")}</nav>
      </div>
      <div class="ri-w2-meta"><span class="ri-w2-pill">● LIVE</span><span>${MODULE_CONFIG.route}</span><span>Backend: ${MODULE_CONFIG.dataRoute}</span><span>Römer Industries / EMASSC</span><span id="ri-w2-utc" class="ri-w2-clock"></span></div>
      <div class="ri-w2-grid">
        ${renderTaskColumn("▶ Active Tasks", STATUS_MODEL.activeTasks)}
        ${renderTaskColumn("✓ Recent Completions", STATUS_MODEL.completions, STATUS_MODEL.queued)}
        ${renderLogColumn()}
      </div>
      <footer class="ri-w2-footer"><span>Workspace Backend:</span><a class="ri-w2-btn dataspace" href="${MODULE_CONFIG.dataRoute}">⚡ Open W2 Dataspace</a><button class="ri-w2-btn" data-action="run-catch-hold-shortcut">Run Catch/Hold</button><button class="ri-w2-btn" data-action="run-sweep-shortcut">Current Sweep</button><span class="ri-w2-beacon">● Dataspace beacon active</span></footer>
    </section>
  `;
}

function renderLink(link) {
  return `<a class="${["ri-w2-fuse-link", link.active ? "active" : "", link.variant || ""].filter(Boolean).join(" ")}" href="${link.href}">${link.label}</a>`;
}

function renderTaskColumn(title, primary, secondary = []) {
  const secondaryHtml = secondary.length ? `<h3 class="ri-w2-col-title secondary">▶ Queued</h3>${secondary.map(renderTask).join("")}` : `<div class="ri-w2-metrics"><div><span>Catch Radius</span><strong>50m</strong></div><div><span>Hold Force</span><strong>120N</strong></div><div><span>Coil Current</span><strong>850A</strong></div><div><span>Dataspace Status</span><strong class="ok">● LIVE</strong></div></div>`;
  return `<div class="ri-w2-col"><h3 class="ri-w2-col-title">${title}</h3>${primary.map(renderTask).join("")}${secondaryHtml}</div>`;
}

function renderTask(task) {
  const label = task.status === "in-progress" ? "IN PROGRESS" : task.status === "complete" ? "COMPLETE" : task.status === "blocked" ? "BLOCKED" : "QUEUED";
  return `<article class="ri-w2-task"><div><strong>${task.label}</strong><small>${task.sub}</small></div><span class="ri-w2-status ${task.status}">${label}</span></article>`;
}

function renderLogColumn() {
  return `<div class="ri-w2-col"><h3 class="ri-w2-col-title">■ Mission Log</h3>${STATUS_MODEL.log.map((item) => `<div class="ri-w2-log"><time>${item.date}</time><span>${item.message}</span></div>`).join("")}<h3 class="ri-w2-col-title secondary">■ Connections</h3><p class="ri-w2-connections">Feeds → W4, W6<br />Consumes ← W1, W3, W5</p></div>`;
}

function renderForm(form) {
  return `
    <section class="ri-w2-panel">
      <h1>Luke II Catch/Hold Modelling</h1>
      <p class="ri-w2-subtitle">Electromagnetic rendezvous capture, stopping-force envelope and station-keep energy screening.</p>
      <div class="ri-w2-input-grid">
        ${field("Scenario", "scenario", form.scenario)}
        ${field("Target Mass kg", "targetMassKg", form.targetMassKg, "number")}
        ${field("Approach Velocity m/s", "approachVelocityMS", form.approachVelocityMS, "number", "0.01")}
        ${field("Catch Radius m", "catchRadiusM", form.catchRadiusM, "number")}
        ${field("Hold Force N", "holdForceN", form.holdForceN, "number")}
        ${field("Coil Current A", "coilCurrentA", form.coilCurrentA, "number")}
        ${field("Coil Turns", "coilTurns", form.coilTurns, "number")}
        ${field("Coil Radius m", "coilRadiusM", form.coilRadiusM, "number", "0.1")}
        ${field("Hold Duration h", "holdDurationHours", form.holdDurationHours, "number", "0.1")}
        ${field("Safety Factor", "safetyFactor", form.safetyFactor, "number", "0.1")}
      </div>
      <div class="ri-w2-actions"><button class="ri-w2-btn primary" data-action="run-catch-hold">Run Catch/Hold</button><button class="ri-w2-btn" data-action="run-sweep">Generate Current Sweep</button><button class="ri-w2-btn" data-action="export-result">Export Result</button></div>
      <div id="ri-w2-results" class="ri-w2-results" hidden></div>
      <div id="ri-w2-sweep" class="ri-w2-results" hidden></div>
    </section>
  `;
}

function field(label, key, value, type = "text", step = "1") {
  return `<label>${label}<input id="ri-w2-${key}" data-field="${key}" type="${type}" step="${step}" value="${escapeHtml(value)}" /></label>`;
}

export function getFormValues(root) {
  const values = {};
  root.querySelectorAll("[data-field]").forEach((input) => {
    values[input.dataset.field] = input.type === "number" ? Number(input.value) : input.value;
  });
  return values;
}

export function renderResult(root, result) {
  const target = root.querySelector("#ri-w2-results");
  if (!target) return;
  const o = result.outputs;
  target.hidden = false;
  target.innerHTML = `<div class="ri-w2-summary">${escapeHtml(result.scenario)} · B=${formatEngineering(o.coilFieldT)}T · stop=${formatEngineering(o.stoppingForceN)}N · margin=${formatEngineering(o.forceMargin)}× · stability=${formatEngineering(o.stabilityIndex * 100)}%</div><div class="ri-w2-result-grid">${metric("Coil Field", o.coilFieldT, "T", "info")}${metric("Kinetic Energy", o.kineticEnergyJ, "J", "info")}${metric("Stopping Force", o.stoppingForceN, "N", o.captureClass)}${metric("Required Hold", o.requiredHoldForceN, "N", "warning")}${metric("Force Margin", o.forceMargin, "×", o.captureClass)}${metric("G Equivalent", o.gEquivalent, "g", o.gEquivalent > 1 ? "warning" : "success")}${metric("Power Proxy", o.copperLossProxyKW, "kW", "info")}${metric("Hold Energy", o.holdEnergyKWh, "kWh", "info")}</div>`;
}

export function renderSweep(root, rows) {
  const target = root.querySelector("#ri-w2-sweep");
  if (!target) return;
  target.hidden = false;
  target.innerHTML = `<div class="ri-w2-summary">Current sweep generated · ${rows.length} rows</div><pre class="ri-w2-json">${escapeHtml(JSON.stringify(rows, null, 2))}</pre>`;
}

function metric(label, value, unit, className) {
  return `<div class="ri-w2-metric"><span>${label}</span><strong class="${className}">${formatEngineering(value)} <small>${unit}</small></strong></div>`;
}

function renderStyles() {
  return `<style>.ri-w2{--bg:#0a0e1a;--panel:#11182a;--line:#3a4059;--accent:#7b2cbf;--green:#00ff88;--cyan:#00d4ff;--pink:#ff6b9d;--red:#ff3366;--amber:#ffaa00;--text:#e8eaf0;--muted:#8b92a8;color:var(--text);font-family:Inter,system-ui,Segoe UI,Arial,sans-serif}.ri-w2 *{box-sizing:border-box}.ri-w2-tracker,.ri-w2-panel{background:rgba(17,24,42,.9);border:1px solid rgba(123,44,191,.28);border-radius:16px;margin:0 0 22px;padding:0;overflow:hidden}.ri-w2-panel{padding:22px}.ri-w2-head,.ri-w2-meta,.ri-w2-footer{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:12px 16px;border-bottom:1px solid var(--line);background:#1a1f2e}.ri-w2-logo,.ri-w2-title h2,.ri-w2-col-title{color:var(--accent)}.ri-w2-title{flex:1;min-width:240px}.ri-w2-title h2{margin:0;text-transform:uppercase;letter-spacing:.07em;font-size:.9rem}.ri-w2-title p,.ri-w2-subtitle{margin:.25rem 0 0;color:var(--muted)}.ri-w2-fuse{display:flex;gap:6px;flex-wrap:wrap}.ri-w2-fuse-link,.ri-w2-btn{border:1px solid #3a4059;border-radius:8px;background:#252b3d;color:var(--text);padding:8px 12px;text-decoration:none;font-weight:800;font-size:.75rem;cursor:pointer}.ri-w2-fuse-link.active,.ri-w2-btn.primary{border-color:var(--accent);color:var(--accent);background:#7b2cbf1a}.ri-w2-fuse-link.library{border-color:var(--pink);color:var(--pink)}.ri-w2-fuse-link.dataspace,.ri-w2-btn.dataspace{border-color:var(--green);color:var(--green);background:rgba(0,255,136,.06)}.ri-w2-meta{background:#252b3d;color:var(--muted);font-size:.7rem}.ri-w2-pill,.ri-w2-status{border-radius:999px;padding:3px 8px;font-size:.65rem;font-weight:900}.ri-w2-pill{background:rgba(0,255,136,.15);color:var(--green)}.ri-w2-clock,.ri-w2-beacon{margin-left:auto}.ri-w2-grid{display:grid;grid-template-columns:repeat(3,1fr)}.ri-w2-col{padding:14px 16px;border-right:1px solid var(--line)}.ri-w2-col:last-child{border-right:none}.ri-w2-col-title{margin:0 0 10px;text-transform:uppercase;letter-spacing:.06em;font-size:.75rem}.ri-w2-col-title.secondary{margin-top:14px}.ri-w2-task{display:flex;justify-content:space-between;gap:10px;background:#1a1f2e;border:1px solid #3a4059;border-radius:10px;padding:10px;margin-bottom:8px}.ri-w2-task strong{font-size:.78rem}.ri-w2-task small{display:block;color:var(--muted);margin-top:4px}.ri-w2-status.in-progress{background:rgba(0,212,255,.15);color:var(--cyan)}.ri-w2-status.complete{background:rgba(0,255,136,.15);color:var(--green)}.ri-w2-status.blocked,.danger{background:rgba(255,51,102,.15);color:var(--red)}.ri-w2-status.queued{background:rgba(255,170,0,.12);color:var(--amber)}.ri-w2-metrics{background:#1a1f2e;border:1px solid #3a4059;border-radius:10px;padding:10px}.ri-w2-metrics div,.ri-w2-log{display:flex;gap:10px;justify-content:space-between;font-size:.72rem;padding:4px 0}.ri-w2-metrics span,.ri-w2-log time,.ri-w2-connections{color:var(--muted)}.ri-w2-metrics strong{color:var(--accent)}.ri-w2-metrics strong.ok{color:var(--green)}.ri-w2-log{justify-content:flex-start;border-bottom:1px solid rgba(58,64,89,.4)}.ri-w2-panel h1{margin:0;color:var(--accent);font-size:clamp(1.7rem,4vw,2.8rem)}.ri-w2-input-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:18px}.ri-w2 label{display:flex;flex-direction:column;gap:7px;font-weight:800}.ri-w2 input{padding:12px 14px;background:rgba(10,14,26,.85);border:1px solid rgba(123,44,191,.4);border-radius:10px;color:var(--text)}.ri-w2-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.ri-w2-results{margin-top:18px}.ri-w2-summary{background:#7b2cbf14;border:1px solid rgba(123,44,191,.32);padding:14px;border-radius:10px;color:var(--accent);font-family:ui-monospace,monospace}.ri-w2-result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:14px}.ri-w2-metric{background:#1a1f2e;border:1px solid #3a4059;border-radius:12px;padding:16px;text-align:center}.ri-w2-metric span{display:block;color:var(--muted);font-size:.8rem}.ri-w2-metric strong{display:block;font-size:1.25rem;margin-top:7px}.success{color:#4ade80}.warning{color:#fbbf24}.info{color:#60a5fa}.ri-w2-json{overflow:auto;max-height:320px;background:#090d12;border:1px solid #1f2940;border-radius:12px;padding:12px;color:var(--muted)}@media(max-width:980px){.ri-w2-grid{grid-template-columns:1fr}.ri-w2-col{border-right:none;border-bottom:1px solid var(--line)}.ri-w2-clock,.ri-w2-beacon{margin-left:0}}</style>`;
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
