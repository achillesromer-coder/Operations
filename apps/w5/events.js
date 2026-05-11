import W5_CONFIG from './config.js';
import { buildGmatJobRequest, createDepartureWindowSweep, simulateMissionPlanning } from './calculations.js';
import { renderW5 } from './view.js';

function parseForm(target) {
  const form = target.querySelector('[data-role="w5-form"]');
  const data = { ...W5_CONFIG.defaultInputs };
  if (!form) return data;
  const formData = new FormData(form);
  Object.keys(W5_CONFIG.defaultInputs).forEach((key) => {
    const fallback = W5_CONFIG.defaultInputs[key];
    const raw = formData.get(key);
    data[key] = typeof fallback === 'number' ? Number(raw) : String(raw ?? fallback);
  });
  return data;
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function safeAudit(ctx, type, payload) {
  try {
    ctx.audit?.({
      type,
      route: W5_CONFIG.route,
      pageId: W5_CONFIG.moduleId,
      moduleId: W5_CONFIG.moduleId,
      severity: 'info',
      timestamp: new Date().toISOString(),
      protocol: W5_CONFIG.protocol,
      payload
    });
  } catch (error) {
    console.warn('[W5] audit adapter unavailable', error);
  }
}

function persistState(state) {
  try {
    localStorage.setItem(W5_CONFIG.storage.stateKey, JSON.stringify(state));
  } catch (error) {
    console.warn('[W5] local state persistence unavailable', error);
  }
}

function restoreState() {
  try {
    const raw = localStorage.getItem(W5_CONFIG.storage.stateKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function appendJob(job) {
  try {
    const raw = localStorage.getItem(W5_CONFIG.storage.jobQueueKey);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push(job);
    localStorage.setItem(W5_CONFIG.storage.jobQueueKey, JSON.stringify(queue));
    return queue.length;
  } catch {
    return null;
  }
}

export function createW5Controller(target, ctx = {}) {
  let state = restoreState() || {
    inputs: { ...W5_CONFIG.defaultInputs },
    result: simulateMissionPlanning(W5_CONFIG.defaultInputs, W5_CONFIG.defaultInputs),
    sweep: createDepartureWindowSweep(W5_CONFIG.defaultInputs, W5_CONFIG.defaultInputs),
    jobRequest: null
  };

  const rerender = () => {
    persistState(state);
    renderW5(target, state, {
      onRun: () => {
        const inputs = parseForm(target);
        const result = simulateMissionPlanning(inputs, W5_CONFIG.defaultInputs);
        const sweep = createDepartureWindowSweep(inputs, W5_CONFIG.defaultInputs);
        state = { ...state, inputs, result, sweep, jobRequest: null };
        safeAudit(ctx, 'workspace.w5.screened', { missionId: result.missionId, dts: result.dts, passDtsFloor: result.passDtsFloor });
        rerender();
      },
      onBuildJob: () => {
        const inputs = parseForm(target);
        const result = simulateMissionPlanning(inputs, W5_CONFIG.defaultInputs);
        const jobRequest = buildGmatJobRequest(result);
        const queueLength = appendJob(jobRequest);
        state = { ...state, inputs, result, sweep: createDepartureWindowSweep(inputs, W5_CONFIG.defaultInputs), jobRequest };
        safeAudit(ctx, 'workspace.w5.gmat_job_queued', { jobId: jobRequest.id, missionId: jobRequest.missionId, queueLength });
        rerender();
      },
      onExport: () => {
        const payload = {
          workspaceId: W5_CONFIG.workspaceId,
          moduleId: W5_CONFIG.moduleId,
          route: W5_CONFIG.route,
          protocol: W5_CONFIG.protocol,
          exportedAt: new Date().toISOString(),
          ...state
        };
        downloadJson(`w5-gmat-mission-${Date.now()}.json`, payload);
        safeAudit(ctx, 'workspace.w5.exported', { missionId: state.result?.missionId });
      },
      onReset: () => {
        state = {
          inputs: { ...W5_CONFIG.defaultInputs },
          result: simulateMissionPlanning(W5_CONFIG.defaultInputs, W5_CONFIG.defaultInputs),
          sweep: createDepartureWindowSweep(W5_CONFIG.defaultInputs, W5_CONFIG.defaultInputs),
          jobRequest: null
        };
        safeAudit(ctx, 'workspace.w5.reset', {});
        rerender();
      }
    });
  };

  return {
    mount() {
      rerender();
      safeAudit(ctx, 'workspace.w5.mounted', { route: W5_CONFIG.route });
    },
    getState() {
      return state;
    },
    unmount() {
      target.innerHTML = '';
    }
  };
}

export default { createW5Controller };
