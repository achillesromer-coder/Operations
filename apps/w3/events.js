import { W3_CONFIG } from './config.js';
import { simulateRms, createPowerSweep } from './calculations.js';
import { renderW3Results, renderW3Sweep } from './view.js';

const STORAGE_KEY = 'ri.operations.w3.state.v1';

export function readW3Form(form) {
  return Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => [key, Number(value)]));
}

export function bindW3Events(root, state) {
  const form = root.querySelector('[data-role="w3-form"]');
  const results = root.querySelector('[data-role="w3-results"]');
  const sweep = root.querySelector('[data-role="w3-sweep"]');

  const run = () => {
    state.inputs = { ...state.inputs, ...readW3Form(form) };
    state.result = simulateRms(state.inputs);
    state.sweep = createPowerSweep(state.inputs);
    persist(state);
    renderW3Results(results, state.result);
    renderW3Sweep(sweep, state.sweep);
    audit(state, 'workspace.w3.rms.simulated');
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    run();
  });

  root.querySelector('[data-action="w3-reset"]')?.addEventListener('click', () => {
    state.inputs = { ...W3_CONFIG.defaultInputs };
    form.reset();
    Object.entries(state.inputs).forEach(([key, value]) => {
      const input = form.elements[key];
      if (input) input.value = value;
    });
    run();
  });

  root.querySelector('[data-action="w3-export"]')?.addEventListener('click', () => {
    const payload = {
      id: `w3-rms-${Date.now()}`,
      workspaceId: W3_CONFIG.workspaceId,
      type: 'rfs-emff-screening-result',
      protocol: W3_CONFIG.protocol,
      route: W3_CONFIG.route,
      createdAt: new Date().toISOString(),
      inputs: state.inputs,
      outputs: state.result?.outputs,
      sweep: state.sweep
    };
    downloadJson(payload, `${payload.id}.json`);
    audit(state, 'workspace.w3.rms.exported', payload);
  });

  run();
}

export function restoreW3State() {
  try {
    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { config: W3_CONFIG, inputs: { ...W3_CONFIG.defaultInputs, ...(cached?.inputs || {}) } };
  } catch {
    return { config: W3_CONFIG, inputs: { ...W3_CONFIG.defaultInputs } };
  }
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs: state.inputs, updatedAt: new Date().toISOString() }));
  } catch {}
}

function audit(state, type, payload = {}) {
  state.ctx?.audit?.({ type, route: W3_CONFIG.route, pageId: W3_CONFIG.moduleId, severity: 'info', payload });
}

function downloadJson(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default { bindW3Events, restoreW3State };
