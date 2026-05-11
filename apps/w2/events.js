// ============================================================
// MODULE: W2 GOS Luke II Catch/Hold Workspace
// FILE: events.js
// PURPOSE: Event bindings, state persistence and audit events for W2.
// ============================================================

import { DEFAULT_FORM_VALUES, MODULE_CONFIG } from "./config.js";
import { createCurrentSweep, simulateCatchHold } from "./calculations.js";
import { getFormValues, renderResult, renderSweep } from "./view.js";

export function bindWorkspaceEvents(root, ctx, state) {
  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (action === "run-catch-hold" || action === "run-catch-hold-shortcut") {
      event.preventDefault();
      runCatchHold(root, ctx, state);
    }

    if (action === "run-sweep" || action === "run-sweep-shortcut") {
      event.preventDefault();
      runSweep(root, ctx, state);
    }

    if (action === "export-result") {
      event.preventDefault();
      exportResult(ctx, state);
    }
  });
}

export function runCatchHold(root, ctx, state) {
  const form = { ...DEFAULT_FORM_VALUES, ...getFormValues(root) };
  const result = simulateCatchHold(form);
  state.form = form;
  state.lastResult = result;
  persistState(ctx, state);
  renderResult(root, result);
  emit(ctx, "catchHold.simulation.completed", {
    resultId: result.id,
    scenario: result.scenario,
    stabilityIndex: result.outputs.stabilityIndex,
    forceMargin: result.outputs.forceMargin
  });
}

export function runSweep(root, ctx, state) {
  const form = { ...DEFAULT_FORM_VALUES, ...getFormValues(root) };
  const rows = createCurrentSweep(form);
  state.form = form;
  state.lastSweepRows = rows;
  persistState(ctx, state);
  renderSweep(root, rows);
  emit(ctx, "catchHold.currentSweep.completed", { rowCount: rows.length });
}

export function exportResult(ctx, state) {
  const payload = {
    id: `w2_export_${Date.now()}`,
    moduleId: MODULE_CONFIG.moduleId,
    workspaceId: MODULE_CONFIG.workspaceId,
    createdAt: new Date().toISOString(),
    result: state.lastResult || null,
    sweepRows: state.lastSweepRows || []
  };
  writeLocal(ctx, MODULE_CONFIG.storageKey, payload);
  emit(ctx, "catchHold.exported", { exportId: payload.id });

  if (typeof document === "undefined") return payload;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${payload.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
  return payload;
}

export function startClock(root) {
  const clock = root.querySelector("#ri-w2-utc");
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
  window.dispatchEvent(new CustomEvent("ri:audit", { detail: event }));
  return event;
}
