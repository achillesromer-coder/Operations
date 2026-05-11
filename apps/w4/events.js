import { W4_CONFIG } from './config.js';
import { simulateScs, createCadenceSweep } from './calculations.js';
import { renderW4Shell, renderW4Results, renderW4Sweep } from './view.js';

const STORAGE_KEY = 'ri.operations.w4.state.v1';

function emitAudit(ctx, type, payload = {}) {
  const event = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    route: W4_CONFIG.route,
    pageId: W4_CONFIG.moduleId,
    moduleId: W4_CONFIG.moduleId,
    timestamp: new Date().toISOString(),
    payload,
    severity: 'info',
    protocol: W4_CONFIG.protocol
  };
  if (ctx?.audit?.record) ctx.audit.record(event);
  else if (ctx?.onAudit) ctx.onAudit(event);
  return event;
}

function persistState(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify({ inputs: state.inputs, result: state.result, sweep: state.sweep }));
  } catch (err) {
    console.warn('[W4] State persistence failed', err);
  }
}

export function restoreW4State(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return createInitialW4State();
    const parsed = JSON.parse(raw);
    return createInitialW4State(parsed);
  } catch {
    return createInitialW4State();
  }
}

export function createInitialW4State(seed = {}) {
  const inputs = { ...W4_CONFIG.defaultInputs, ...(seed.inputs || {}) };
  const result = seed.result || simulateScs(inputs);
  const sweep = seed.sweep || createCadenceSweep(inputs);
  return { config: W4_CONFIG, inputs, result, sweep };
}

export function readW4Form(form) {
  return Array.from(new FormData(form).entries()).reduce((acc, [key, value]) => {
    acc[key] = Number(value);
    return acc;
  }, {});
}

function paint(root, state) {
  renderW4Shell(root, state);
  renderW4Results(root.querySelector('[data-role="w4-results"]'), state.result);
  renderW4Sweep(root.querySelector('[data-role="w4-sweep"]'), state.sweep);
}

export function bindW4Events(root, state, ctx = {}) {
  const handleRun = () => {
    const form = root.querySelector('[data-role="w4-form"]');
    state.inputs = readW4Form(form);
    state.result = simulateScs(state.inputs);
    state.sweep = createCadenceSweep(state.inputs);
    persistState(state, ctx.storage);
    emitAudit(ctx, 'workspace.w4.scs.simulated', { inputs: state.inputs, outputs: state.result.outputs });
    paint(root, state);
    bindW4Events(root, state, ctx);
  };

  root.querySelector('[data-role="w4-form"]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    handleRun();
  });

  root.querySelector('[data-action="w4-reset"]')?.addEventListener('click', () => {
    Object.assign(state, createInitialW4State());
    persistState(state, ctx.storage);
    emitAudit(ctx, 'workspace.w4.reset', { inputs: state.inputs });
    paint(root, state);
    bindW4Events(root, state, ctx);
  });

  root.querySelector('[data-action="w4-export"]')?.addEventListener('click', () => {
    const packet = {
      id: `w4-scs-${Date.now()}`,
      type: 'supply-chain-screening-result',
      workspaceId: W4_CONFIG.workspaceId,
      moduleId: W4_CONFIG.moduleId,
      protocol: W4_CONFIG.protocol,
      createdAt: new Date().toISOString(),
      inputs: state.inputs,
      result: state.result,
      sweep: state.sweep
    };
    emitAudit(ctx, 'workspace.w4.scs.exported', { id: packet.id });
    if (ctx?.exportJson) ctx.exportJson(packet);
    else {
      const blob = new Blob([JSON.stringify(packet, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${packet.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
}

export function renderAndBindW4(root, state, ctx = {}) {
  paint(root, state);
  bindW4Events(root, state, ctx);
}

export default { createInitialW4State, restoreW4State, readW4Form, bindW4Events, renderAndBindW4 };
