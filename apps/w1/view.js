// ============================================================
// MODULE: W1 Deposit Analysis / Capture Workspace
// FILE: view.js
// PURPOSE: DOM rendering extracted from legacy W1 HTML.
// ============================================================

import { DEFAULT_FORM_VALUES, MODULE_CONFIG, STATUS_MODEL, WORKSPACE_LINKS } from "./config.js";
import { METALS, PRESET_SCENARIOS, STATIONS } from "./presets.js";
import { classifyResult, formatEngineering, formatMoneyAud } from "./calculations.js";

export function renderWorkspace(root, state = {}) {
  const form = { ...DEFAULT_FORM_VALUES, ...(state.form || {}) };
  root.innerHTML = `
    <section class="ri-w1" data-module="${MODULE_CONFIG.moduleId}">
      ${renderStyles()}
      ${renderTracker()}
      ${renderHeader()}
      ${renderCaptureForm(form)}
      ${renderSweepForm(form)}
    </section>
  `;
}

function renderHeader() {
  return `
    <header class="ri-w1-header">
      <h1>Mag-Lev Orbital Metal Capture Simulator</h1>
      <p class="ri-w1-subtitle">High-fidelity screening model for electromagnetic capture and orbital metal handling.</p>
      <p class="ri-w1-note">Orbital mechanics · atmospheric approximation · eddy-current braking · ROI estimation</p>
    </header>
  `;
}

function renderTracker() {
  return `
    <section class="ri-w1-tracker">
      <div class="ri-w1-tracker-head">
        <div class="ri-w1-logo">⚡</div>
        <div class="ri-w1-tracker-title">
          <h2>Ops Tracker: W1 · Deposit Analysis</h2>
          <p>Ore body characterisation, capture feasibility and resource modelling · ${MODULE_CONFIG.route}</p>
        </div>
        <nav class="ri-w1-fuse">${WORKSPACE_LINKS.map(renderFuseLink).join("")}</nav>
      </div>
      <div class="ri-w1-meta">
        <span class="ri-w1-pill">● LIVE</span>
        <span>${MODULE_CONFIG.route}</span>
        <span>Backend: ${MODULE_CONFIG.dataRoute}</span>
        <span>Römer Industries / EMASSC</span>
        <span id="ri-w1-utc" class="ri-w1-clock"></span>
      </div>
      <div class="ri-w1-tracker-grid">
        ${renderTaskColumn("▶ Active Tasks", STATUS_MODEL.activeTasks)}
        ${renderTaskColumn("✓ Recent Completions", STATUS_MODEL.completions, STATUS_MODEL.queued)}
        ${renderLogColumn()}
      </div>
      <footer class="ri-w1-footer">
        <span>Workspace Backend:</span>
        <a class="ri-w1-btn small dataspace" href="${MODULE_CONFIG.dataRoute}">⚡ Open W1 Dataspace</a>
        <button class="ri-w1-btn small" data-action="run-simulation-shortcut">Field + Trajectory Sim</button>
        <button class="ri-w1-btn small" data-action="run-sweep-shortcut">Sweep Analysis</button>
        <span class="ri-w1-beacon">● Dataspace beacon active</span>
      </footer>
    </section>
  `;
}

function renderFuseLink(link) {
  const classes = ["ri-w1-fuse-link", link.active ? "active" : "", link.variant || ""].filter(Boolean).join(" ");
  return `<a class="${classes}" href="${link.href}">${link.label}</a>`;
}

function renderTaskColumn(title, primary, secondary = []) {
  const secondaryHtml = secondary.length
    ? `<h3 class="ri-w1-col-title secondary">▶ Queued</h3>${secondary.map(renderTask).join("")}`
    : `<div class="ri-w1-metrics">
        <div><span>Active simulations</span><strong>3</strong></div>
        <div><span>Last sweep</span><strong>session</strong></div>
        <div><span>Dataspace status</span><strong class="ok">● LIVE</strong></div>
        <div><span>Pending exports</span><strong>queue</strong></div>
      </div>`;
  return `<div class="ri-w1-col"><h3 class="ri-w1-col-title">${title}</h3>${primary.map(renderTask).join("")}${secondaryHtml}</div>`;
}

function renderTask(task) {
  const label = task.status === "in-progress" ? "IN PROGRESS" : task.status === "complete" ? "COMPLETE" : task.status === "blocked" ? "BLOCKED" : "QUEUED";
  return `
    <article class="ri-w1-task">
      <div><strong>${task.label}</strong><small>${task.sub}</small></div>
      <span class="ri-w1-status ${task.status}">${label}</span>
    </article>
  `;
}

function renderLogColumn() {
  return `
    <div class="ri-w1-col">
      <h3 class="ri-w1-col-title">■ Mission Log</h3>
      ${STATUS_MODEL.log.map((item) => `<div class="ri-w1-log"><time>${item.date}</time><span>${item.message}</span></div>`).join("")}
      <h3 class="ri-w1-col-title secondary">■ Connections</h3>
      <p class="ri-w1-connections">Feeds → W2, W4, W6<br />Consumes ← W3, W5, LIB</p>
    </div>
  `;
}

function renderCaptureForm(form) {
  return `
    <section class="ri-w1-panel">
      <h2><span></span>Capture Scenario Configuration</h2>
      <div class="ri-w1-input-grid">
        <label>Project Name<input id="ri-w1-project" value="${escapeHtml(form.project)}" /></label>
        <label>Metal Type<select id="ri-w1-metal">${Object.entries(METALS).map(([key, metal]) => `<option value="${key}" ${form.metal === key ? "selected" : ""}>${metal.label} - $${formatEngineering(metal.valueAudKg)}/kg</option>`).join("")}</select></label>
        <label>Mass kg<input id="ri-w1-mass" type="number" value="${form.massKg}" min="0.1" max="100000" step="10" /></label>
        <label>Release Altitude km<input id="ri-w1-altitude" type="number" value="${form.altitudeKm}" min="100" max="40000" step="100" /></label>
        <label>Station Configuration<select id="ri-w1-station">${Object.entries(STATIONS).map(([key, station]) => `<option value="${key}" ${form.station === key ? "selected" : ""}>${station.label} (${station.baseFieldT}T, ${station.captureDistanceM}m, ${station.powerMW}MW)</option>`).join("")}</select></label>
        <label>Safety Factor<input id="ri-w1-safety" type="number" value="${form.safetyFactor}" min="1" max="5" step="0.1" /></label>
      </div>
      <div class="ri-w1-actions">
        <button class="ri-w1-btn primary" data-action="run-simulation">Run Simulation</button>
        ${Object.keys(PRESET_SCENARIOS).map((key) => `<button class="ri-w1-btn" data-action="load-preset" data-preset="${key}">Load ${PRESET_SCENARIOS[key].project.replace(" Capture Study", "")}</button>`).join("")}
      </div>
      <div id="ri-w1-results" class="ri-w1-results" hidden></div>
    </section>
  `;
}

function renderSweepForm(form) {
  return `
    <section class="ri-w1-panel">
      <h2><span></span>Parameter Sweep Analysis</h2>
      <div class="ri-w1-input-grid">
        <label>Sweep Variable<select id="ri-w1-sweep-var"><option value="mass" ${form.sweepVar === "mass" ? "selected" : ""}>Mass</option><option value="altitude" ${form.sweepVar === "altitude" ? "selected" : ""}>Release Altitude</option><option value="v_factor" ${form.sweepVar === "v_factor" ? "selected" : ""}>Velocity Factor</option></select></label>
        <label>Range Factor Min<input id="ri-w1-sweep-min" type="number" value="${form.sweepMin}" step="0.1" /></label>
        <label>Range Factor Max<input id="ri-w1-sweep-max" type="number" value="${form.sweepMax}" step="0.1" /></label>
        <label>Steps<input id="ri-w1-sweep-steps" type="number" value="${form.sweepSteps}" min="5" max="50" /></label>
      </div>
      <div class="ri-w1-actions">
        <button class="ri-w1-btn primary" data-action="run-sweep">Generate Sweep Analysis</button>
        <button class="ri-w1-btn" data-action="export-sweep">Export Sweep Data</button>
      </div>
      <div id="ri-w1-sweep-results" class="ri-w1-results" hidden></div>
    </section>
  `;
}

export function renderResult(root, result) {
  const target = root.querySelector("#ri-w1-results");
  if (!target) return;
  const classes = classifyResult(result);
  const output = result.outputs;
  target.hidden = false;
  target.innerHTML = `
    <div class="ri-w1-summary">${result.material.label.toUpperCase()} · ${formatEngineering(result.adjusted.massKg)}kg · ${formatEngineering(result.adjusted.altitudeKm)}km → v=${formatEngineering(output.approachVelocityMS)}m/s · B=${formatEngineering(output.requiredFieldT)}T · P=${formatEngineering(output.peakPowerMW)}MW · Success=${formatEngineering(output.successProbability * 100)}% · ROI=${formatEngineering(output.efficiencyX)}×</div>
    <div class="ri-w1-result-grid">
      ${metric("Approach Velocity", output.approachVelocityMS, "m/s", "info")}
      ${metric("Required Field", output.requiredFieldT, "T", classes.fieldClass)}
      ${metric("Peak Power", output.peakPowerMW, "MW", classes.powerClass)}
      ${metric("Capture Time", output.captureTimeS, "s", "info")}
      ${metric("Success Probability", output.successProbability * 100, "%", classes.successClass)}
      ${metric("Economic Value", formatMoneyAud(output.economicValueAud), "", "success", true)}
      ${metric("G-Forces", output.gForces, "g", classes.gClass)}
      ${metric("Max Temperature", output.maxTemperatureK, "K", classes.tempClass)}
      ${metric("ROI Efficiency", output.efficiencyX, "×", classes.roiClass)}
      ${metric("Energy Cost", formatMoneyAud(output.energyCostAud), "", "info", true)}
    </div>
    <canvas id="ri-w1-timeseries-chart" class="ri-w1-chart" aria-label="Capture time series chart"></canvas>
  `;
}

export function renderSweep(root, rows) {
  const target = root.querySelector("#ri-w1-sweep-results");
  if (!target) return;
  target.hidden = false;
  target.innerHTML = `
    <div class="ri-w1-summary">Sweep generated · ${rows.length} rows · ${rows[0]?.sweepVar || "variable"}</div>
    <canvas id="ri-w1-sweep-chart" class="ri-w1-chart" aria-label="Sweep chart"></canvas>
    <pre class="ri-w1-json">${escapeHtml(JSON.stringify(rows.slice(0, 10), null, 2))}</pre>
  `;
}

function metric(label, value, unit, className, preformatted = false) {
  const display = preformatted ? value : formatEngineering(value);
  return `<div class="ri-w1-metric"><span>${label}</span><strong class="${className}">${display}${unit ? ` <small>${unit}</small>` : ""}</strong></div>`;
}

export function getFormValues(root) {
  return {
    project: root.querySelector("#ri-w1-project")?.value || DEFAULT_FORM_VALUES.project,
    metal: root.querySelector("#ri-w1-metal")?.value || DEFAULT_FORM_VALUES.metal,
    massKg: Number(root.querySelector("#ri-w1-mass")?.value || DEFAULT_FORM_VALUES.massKg),
    altitudeKm: Number(root.querySelector("#ri-w1-altitude")?.value || DEFAULT_FORM_VALUES.altitudeKm),
    station: root.querySelector("#ri-w1-station")?.value || DEFAULT_FORM_VALUES.station,
    safetyFactor: Number(root.querySelector("#ri-w1-safety")?.value || DEFAULT_FORM_VALUES.safetyFactor),
    sweepVar: root.querySelector("#ri-w1-sweep-var")?.value || DEFAULT_FORM_VALUES.sweepVar,
    sweepMin: Number(root.querySelector("#ri-w1-sweep-min")?.value || DEFAULT_FORM_VALUES.sweepMin),
    sweepMax: Number(root.querySelector("#ri-w1-sweep-max")?.value || DEFAULT_FORM_VALUES.sweepMax),
    sweepSteps: Number(root.querySelector("#ri-w1-sweep-steps")?.value || DEFAULT_FORM_VALUES.sweepSteps)
  };
}

export function applyFormValues(root, values = {}) {
  const map = {
    "#ri-w1-project": "project",
    "#ri-w1-metal": "metal",
    "#ri-w1-mass": "massKg",
    "#ri-w1-altitude": "altitudeKm",
    "#ri-w1-station": "station",
    "#ri-w1-safety": "safetyFactor"
  };
  Object.entries(map).forEach(([selector, key]) => {
    const el = root.querySelector(selector);
    if (el && values[key] !== undefined) el.value = values[key];
  });
}

function renderStyles() {
  return `<style>
    .ri-w1{--bg:#0a0e1a;--panel:#11182a;--line:#1f2940;--cyan:#00d4ff;--green:#00ff88;--pink:#ff6b9d;--amber:#ffaa00;--red:#ff5b5b;--text:#e8eaf0;--muted:#8b92a8;color:var(--text);font-family:Inter,system-ui,Segoe UI,Arial,sans-serif}.ri-w1 *{box-sizing:border-box}.ri-w1-tracker,.ri-w1-panel,.ri-w1-header{background:rgba(17,24,42,.86);border:1px solid rgba(0,212,255,.16);border-radius:16px;margin:0 0 22px;padding:22px;box-shadow:0 8px 32px rgba(0,0,0,.25)}.ri-w1-tracker{padding:0;overflow:hidden}.ri-w1-tracker-head,.ri-w1-meta,.ri-w1-footer{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:12px 16px;border-bottom:1px solid var(--line);background:#151b2a}.ri-w1-logo{font-size:1.2rem;color:var(--cyan)}.ri-w1-tracker-title{flex:1;min-width:230px}.ri-w1-tracker-title h2{margin:0;color:var(--cyan);font-size:.95rem;text-transform:uppercase;letter-spacing:.08em}.ri-w1-tracker-title p,.ri-w1-subtitle,.ri-w1-note{margin:4px 0 0;color:var(--muted)}.ri-w1-fuse{display:flex;gap:6px;flex-wrap:wrap}.ri-w1-fuse-link,.ri-w1-btn{border:1px solid #33405d;border-radius:8px;background:#232a3d;color:var(--text);padding:8px 12px;text-decoration:none;font-size:.78rem;font-weight:800;cursor:pointer}.ri-w1-fuse-link.active,.ri-w1-btn.primary{border-color:var(--cyan);color:#081019;background:linear-gradient(45deg,var(--green),var(--cyan))}.ri-w1-fuse-link.library{border-color:var(--pink);color:var(--pink)}.ri-w1-fuse-link.dataspace,.ri-w1-btn.dataspace{border-color:var(--green);color:var(--green);background:rgba(0,255,136,.06)}.ri-w1-meta{background:#1b2132;color:var(--muted);font-size:.72rem}.ri-w1-clock,.ri-w1-beacon{margin-left:auto}.ri-w1-pill,.ri-w1-status{border-radius:999px;padding:3px 8px;font-size:.65rem;font-weight:900}.ri-w1-pill{background:rgba(0,255,136,.14);color:var(--green)}.ri-w1-tracker-grid{display:grid;grid-template-columns:repeat(3,1fr)}.ri-w1-col{padding:14px 16px;border-right:1px solid var(--line)}.ri-w1-col:last-child{border-right:none}.ri-w1-col-title{margin:0 0 10px;color:var(--cyan);font-size:.78rem;text-transform:uppercase;letter-spacing:.08em}.ri-w1-col-title.secondary{margin-top:14px}.ri-w1-task{display:flex;gap:10px;align-items:flex-start;justify-content:space-between;background:#171d2d;border:1px solid #303b58;border-radius:10px;padding:10px;margin-bottom:8px}.ri-w1-task strong{font-size:.78rem}.ri-w1-task small{display:block;color:var(--muted);margin-top:4px}.ri-w1-status.in-progress{background:rgba(0,212,255,.12);color:var(--cyan)}.ri-w1-status.complete{background:rgba(0,255,136,.12);color:var(--green)}.ri-w1-status.blocked{background:rgba(255,91,91,.12);color:var(--red)}.ri-w1-status.queued{background:rgba(255,170,0,.12);color:var(--amber)}.ri-w1-metrics{background:#171d2d;border:1px solid #303b58;border-radius:10px;padding:10px}.ri-w1-metrics div{display:flex;justify-content:space-between;font-size:.75rem;padding:3px 0}.ri-w1-metrics span,.ri-w1-log time,.ri-w1-connections{color:var(--muted)}.ri-w1-metrics strong{color:var(--cyan)}.ri-w1-metrics strong.ok{color:var(--green)}.ri-w1-log{display:flex;gap:10px;border-bottom:1px solid rgba(58,64,89,.45);padding:5px 0;font-size:.72rem}.ri-w1-header{text-align:center;background:rgba(39,194,165,.08)}.ri-w1-header h1{font-size:clamp(1.9rem,5vw,3.4rem);margin:0 0 8px;background:linear-gradient(45deg,var(--green),var(--cyan),#7a8cff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.ri-w1-panel h2{color:var(--green);margin:0 0 18px}.ri-w1-input-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}.ri-w1 label{display:flex;flex-direction:column;gap:7px;font-weight:800}.ri-w1 input,.ri-w1 select{padding:12px 14px;background:rgba(10,14,26,.85);border:1px solid rgba(0,212,255,.24);border-radius:10px;color:var(--text)}.ri-w1-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.ri-w1-results{margin-top:18px}.ri-w1-summary{background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.22);padding:14px;border-radius:10px;color:var(--cyan);font-family:ui-monospace,monospace}.ri-w1-result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:14px}.ri-w1-metric{background:linear-gradient(135deg,rgba(15,24,29,.9),rgba(27,32,39,.9));border:1px solid rgba(39,194,165,.24);border-radius:12px;padding:16px;text-align:center}.ri-w1-metric span{display:block;color:var(--muted);font-size:.8rem}.ri-w1-metric strong{display:block;font-size:1.35rem;margin-top:7px}.success{color:#4ade80}.warning{color:#fbbf24}.danger{color:#ef4444}.info{color:#60a5fa}.ri-w1-chart{width:100%;max-height:400px;background:rgba(10,14,26,.5);border-radius:12px;border:1px solid rgba(0,212,255,.12);margin-top:16px;padding:12px}.ri-w1-json{overflow:auto;max-height:260px;background:#090d12;border:1px solid #1f2940;border-radius:12px;padding:12px;color:var(--muted)}@media(max-width:980px){.ri-w1-tracker-grid{grid-template-columns:1fr}.ri-w1-col{border-right:none;border-bottom:1px solid var(--line)}.ri-w1-col:last-child{border-bottom:none}.ri-w1-clock,.ri-w1-beacon{margin-left:0}}
  </style>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
