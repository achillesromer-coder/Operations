// ============================================================
// MODULE: W2 GOS Luke II Catch/Hold Workspace
// FILE: index.js
// PURPOSE: Public LightSpeed mount entrypoint for W2.
// ============================================================

import { DEFAULT_FORM_VALUES, MODULE_CONFIG } from "./config.js";
import { bindWorkspaceEvents, startClock } from "./events.js";
import { renderWorkspace } from "./view.js";

export async function mount(ctx = {}) {
  const root = ctx.root || document.querySelector("#ri-app-root") || document.body;
  const state = createInitialState(ctx);
  renderWorkspace(root, state);
  bindWorkspaceEvents(root, ctx, state);
  const stopClock = startClock(root);

  emit(ctx, "operations.w2.mounted", {
    moduleId: MODULE_CONFIG.moduleId,
    route: MODULE_CONFIG.route,
    legacySourcePath: MODULE_CONFIG.legacySourcePath
  });

  return {
    moduleId: MODULE_CONFIG.moduleId,
    destroy() {
      stopClock?.();
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
    lastSweepRows: draft?.lastSweepRows || []
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
