// ============================================================
// MODULE: W1 Deposit Analysis / Capture Workspace
// FILE: index.js
// PURPOSE: Public LightSpeed mount entrypoint for W1.
// ============================================================

import { DEFAULT_FORM_VALUES, MODULE_CONFIG } from "./config.js";
import { bindWorkspaceEvents, startClock } from "./events.js";
import { renderWorkspace } from "./view.js";

export async function mount(ctx = {}) {
  const root = ctx.root || document.querySelector("#ri-app-root") || document.body;
  const state = createInitialState(ctx);

  if (MODULE_CONFIG.enableCharts) {
    await loadScriptOnce(MODULE_CONFIG.chartJsUrl, "ri-chart-js");
  }

  renderWorkspace(root, state);
  bindWorkspaceEvents(root, ctx, state);
  const stopClock = startClock(root);

  emit(ctx, "operations.w1.mounted", {
    moduleId: MODULE_CONFIG.moduleId,
    route: MODULE_CONFIG.route,
    legacySourcePath: MODULE_CONFIG.legacySourcePath
  });

  return {
    moduleId: MODULE_CONFIG.moduleId,
    destroy() {
      stopClock?.();
      state.timeSeriesChart?.destroy?.();
      state.sweepChart?.destroy?.();
    }
  };
}

export const mountWorkspace = mount;
export const mountApp = mount;

function createInitialState(ctx) {
  const draft = readLocal(ctx, MODULE_CONFIG.draftKey, null);
  return {
    form: { ...DEFAULT_FORM_VALUES, ...(draft?.form || {}) },
    lastResult: draft?.lastResult || null,
    lastSweepRows: draft?.lastSweepRows || [],
    timeSeriesChart: null,
    sweepChart: null
  };
}

function readLocal(ctx, key, fallback = null) {
  if (typeof ctx?.readLocal === "function") return ctx.readLocal(key, fallback);
  try {
    const raw = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function emit(ctx, type, payload = {}) {
  if (typeof ctx?.emitAudit === "function") return ctx.emitAudit(type, payload);
  if (typeof ctx?.emit === "function") return ctx.emit(type, payload);
  window.dispatchEvent(new CustomEvent("ri:audit", {
    detail: {
      id: crypto.randomUUID?.() || `evt_${Date.now()}`,
      type,
      payload,
      timestamp: new Date().toISOString()
    }
  }));
}

function loadScriptOnce(src, id) {
  return new Promise((resolve, reject) => {
    if (!src) return resolve();
    if (window.Chart || document.getElementById(id)) return resolve();

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Unable to load script: ${src}`));
    document.head.appendChild(script);
  });
}
