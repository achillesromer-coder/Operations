import { W6_CONFIG } from './config.js';
import {
  buildAssetRecord,
  createPlatformLibraryRows,
  simulatePlatformAsset
} from './calculations.js';
import { renderPlatformAssetWorkspace } from './view.js';

const STORAGE_KEY = 'ri.operations.w6.state.v1';

function safeAudit(ctx, type, payload = {}) {
  const event = {
    id: `${type}-${Date.now()}`,
    type,
    route: W6_CONFIG.route,
    pageId: W6_CONFIG.moduleId,
    moduleId: W6_CONFIG.moduleId,
    timestamp: new Date().toISOString(),
    protocol: W6_CONFIG.protocol,
    payload
  };
  if (typeof ctx.audit === 'function') ctx.audit(event);
  return event;
}

function restoreState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Non-fatal in embedded/Squarespace contexts.
  }
}

function readForm(target, currentInputs) {
  const form = target.querySelector('[data-role="w6-form"]');
  const next = { ...currentInputs };
  form?.querySelectorAll('input').forEach((input) => {
    const fallback = currentInputs[input.name];
    next[input.name] = typeof fallback === 'number' ? Number(input.value) : input.value;
  });
  return next;
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

export function createW6Controller(target, ctx = {}) {
  const restored = restoreState();
  let state = restored || {
    inputs: { ...W6_CONFIG.defaultInputs },
    result: null,
    assetRows: [],
    assetRecord: null
  };

  function rerender() {
    renderPlatformAssetWorkspace(target, state, {
      onRun: (event) => {
        event.preventDefault();
        state.inputs = readForm(target, state.inputs);
        state.result = simulatePlatformAsset(state.inputs, W6_CONFIG.defaultInputs);
        state.assetRows = createPlatformLibraryRows(state.inputs, W6_CONFIG.defaultInputs);
        state.assetRecord = null;
        persistState(state);
        safeAudit(ctx, 'workspace.w6.screened', {
          assetId: state.result.asset.assetId,
          platformClass: state.result.asset.platformClass,
          readinessScore: state.result.readinessScore,
          dts: state.result.dts,
          status: state.result.status
        });
        rerender();
      },
      onBuildAssetRecord: (event) => {
        event.preventDefault();
        state.inputs = readForm(target, state.inputs);
        state.result = state.result || simulatePlatformAsset(state.inputs, W6_CONFIG.defaultInputs);
        state.assetRecord = buildAssetRecord(state.result);
        persistState(state);
        safeAudit(ctx, 'workspace.w6.asset_record_built', state.assetRecord);
        rerender();
      },
      onExport: (event) => {
        event.preventDefault();
        const payload = {
          config: W6_CONFIG,
          state,
          exportedAt: new Date().toISOString()
        };
        downloadJson(`${W6_CONFIG.moduleId}-${Date.now()}.json`, payload);
        safeAudit(ctx, 'workspace.w6.exported', { assetId: state.inputs.assetId });
      },
      onReset: (event) => {
        event.preventDefault();
        state = {
          inputs: { ...W6_CONFIG.defaultInputs },
          result: null,
          assetRows: [],
          assetRecord: null
        };
        persistState(state);
        safeAudit(ctx, 'workspace.w6.reset');
        rerender();
      }
    });
  }

  rerender();
  safeAudit(ctx, 'workspace.w6.mounted', { moduleId: W6_CONFIG.moduleId });

  return {
    getState: () => state,
    unmount: () => {
      target.innerHTML = '';
      safeAudit(ctx, 'workspace.w6.unmounted', { moduleId: W6_CONFIG.moduleId });
    }
  };
}
