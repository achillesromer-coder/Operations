import { W4_CONFIG } from './config.js';
import { restoreW4State, bindW4Events } from './events.js';
import { injectW4Styles, renderW4Shell } from './view.js';

export function mountOperationsW4(target, ctx = {}) {
  if (!target) throw new Error('mountOperationsW4 requires a target element');

  injectW4Styles(target.ownerDocument || document);

  const state = {
    ...restoreW4State(),
    ctx
  };

  renderW4Shell(target, state);
  bindW4Events(target, state);

  ctx.audit?.({
    type: 'workspace.w4.mounted',
    severity: 'info',
    route: W4_CONFIG.route,
    payload: { moduleId: W4_CONFIG.moduleId, legacySourcePath: W4_CONFIG.legacySourcePath }
  });

  return {
    workspaceId: W4_CONFIG.workspaceId,
    moduleId: W4_CONFIG.moduleId,
    state,
    unmount() {
      target.innerHTML = '';
    }
  };
}

export default mountOperationsW4;
