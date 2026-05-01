// ============================================================
// MODULE: W1 Deposit Analysis / Capture Workspace
// FILE: events.js
// PURPOSE: Event bindings and browser-state handoffs for W1.
// ============================================================

import { DEFAULT_FORM_VALUES, MODULE_CONFIG } from "./config.js";
import { PRESET_SCENARIOS } from "./presets.js";
import { createSweep, simulateCapture } from "./calculations.js";
import { applyFormValues, getFormValues, renderResult, renderSweep } from "./view.js";

export function bindWorkspaceEvents(root, ctx, state) {
  root.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) return;
    const action = actionTarget.dataset.action;

    if (action === "run-simulation" || action === "run-simulation-shortcut") {
      event.preventDefault();
      runSimulation(root, ctx, state);
    }

    if (action === "load-preset") {
      event.preventDefault();
      const presetKey = actionTarget.dataset.preset;
      loadPreset(root, ctx, state, presetKey);
    }

    if (action === "run-sweep" || action === "run-sweep-shortcut") {
      event.preventDefault();
      runSweep(root, ctx, state);
    }

    if (action === "export-sweep") {
      event.preventDefault();
      exportSweep(ctx, state);
    }
  });
}

export function runSimulation(root, ctx, state) {
  const form = getFormValues(root);
  const result = simulateCapture(form);
  state.form = form;
  state.lastResult = result;
  persistState(ctx, state);
  renderResult(root, result);
  renderTimeSeriesChart(root, result, state);
  emit(ctx, "capture.simulation.completed", {
    resultId: result.id,
    project: result.project,
    metal: result.input.metal,
    massKg: result.adjusted.massKg,
    altitudeKm: result.adjusted.altitudeKm,
    successProbability: result.outputs.successProbability
  });
}

export function runSweep(root, ctx, state) {
  const form = getFormValues(root);
  const rows = createSweep(form);
  state.form = form;
  state.lastSweepRows = rows;
  persistState(ctx, state);
  renderSweep(root, rows);
  renderSweepChart(root, rows, state);
  emit(ctx, "capture.sweep.completed", {
    sweepVar: form.sweepVar,
    rowCount: rows.length
  });
}

export function loadPreset(root, ctx, state, presetKey) {
  const preset = PRESET_SCENARIOS[presetKey] || PRESET_SCENARIOS.gold || DEFAULT_FORM_VALUES;
  state.form = { ...DEFAULT_FORM_VALUES, ...preset };
  applyFormValues(root, state.form);
  persistState(ctx, state);
  emit(ctx, "capture.preset.loaded", { presetKey });
}

export function exportSweep(ctx, state) {
  const rows = state.lastSweepRows || [];
  const payload = {
    id: `w1_sweep_export_${Date.now()}`,
    workspaceId: MODULE_CONFIG.workspaceId,
    type: "capture-sweep-export",
    createdAt: new Date().toISOString(),
    rows
  };

  writeLocal(ctx, MODULE_CONFIG.sweepKey, payload);
  emit(ctx, "capture.sweep.exported", {
    exportId: payload.id,
    rowCount: rows.length
  });

  if (!rows.length) return;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${payload.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function startClock(root) {
  const clock = root.querySelector("#ri-w1-utc");
  if (!clock) return () => {};
  const update = () => {
    clock.textContent = new Date().toISOString();
  };
  update();
  const interval = window.setInterval(update, 30000);
  return () => window.clearInterval(interval);
}

function persistState(ctx, state) {
  writeLocal(ctx, MODULE_CONFIG.draftKey, {
    form: state.form,
    lastResult: state.lastResult || null,
    lastSweepRows: state.lastSweepRows || [],
    updatedAt: new Date().toISOString()
  });
  if (state.lastResult) writeLocal(ctx, MODULE_CONFIG.storageKey, state.lastResult);
}

function writeLocal(ctx, key, value) {
  if (typeof ctx?.writeLocal === "function") return ctx.writeLocal(key, value);
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function emit(ctx, type, payload = {}) {
  const event = {
    id: crypto.randomUUID?.() || `evt_${Date.now()}`,
    type: `${MODULE_CONFIG.auditNamespace}.${type}`,
    moduleId: MODULE_CONFIG.moduleId,
    workspaceId: MODULE_CONFIG.workspaceId,
    timestamp: new Date().toISOString(),
    payload
  };
  if (typeof ctx?.emitAudit === "function") return ctx.emitAudit(event.type, event);
  if (typeof ctx?.emit === "function") return ctx.emit(event.type, event);
  const key = "ri:audit:events";
  const current = JSON.parse(window.localStorage.getItem(key) || "[]");
  current.push(event);
  window.localStorage.setItem(key, JSON.stringify(current.slice(-500)));
  window.dispatchEvent(new CustomEvent("ri:audit", { detail: event }));
  return event;
}

function renderTimeSeriesChart(root, result, state) {
  if (!window.Chart) return;
  const canvas = root.querySelector("#ri-w1-timeseries-chart");
  if (!canvas) return;
  if (state.timeSeriesChart) state.timeSeriesChart.destroy();
  state.timeSeriesChart = new window.Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: result.series.timeSeriesS.map((value) => value.toFixed(1)),
      datasets: [
        { label: "Velocity m/s", data: result.series.velocitySeriesMS, borderWidth: 2, tension: 0.25 },
        { label: "Power MW", data: result.series.powerSeriesMW, borderWidth: 2, tension: 0.25 },
        { label: "Heating", data: result.series.heatingSeries, borderWidth: 2, tension: 0.25 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function renderSweepChart(root, rows, state) {
  if (!window.Chart || !rows.length) return;
  const canvas = root.querySelector("#ri-w1-sweep-chart");
  if (!canvas) return;
  if (state.sweepChart) state.sweepChart.destroy();
  state.sweepChart = new window.Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: rows.map((row) => row.scalar.toFixed(2)),
      datasets: [
        { label: "Success %", data: rows.map((row) => row.successProbability * 100), borderWidth: 2, tension: 0.25 },
        { label: "Field T", data: rows.map((row) => row.requiredFieldT), borderWidth: 2, tension: 0.25 },
        { label: "Peak MW", data: rows.map((row) => row.peakPowerMW), borderWidth: 2, tension: 0.25 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}
