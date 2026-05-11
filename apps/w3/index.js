import { W3_CONFIG } from './config.js';
import { restoreW3State, bindW3Events } from './events.js';
import { renderW3Shell, injectW3Styles } from './view.js';

export async function mountOperationsW3(target, ctx = {}) {
  if (!target) throw new Error('mountOperationsW3 requires a target element.');
  injectW3Styles(document);
  const state = restoreW3State();
  state.config = W3_CONFIG;
  state.ctx = ctx;
  renderW3Shell(target, state);
  bindW3Events(target, state);
  ctx.audit?.({
    type: 'workspace.w3.mounted',
    route: W3_CONFIG.route,
    pageId: W3_CONFIG.moduleId,
    severity: 'info',
    payload: { legacySourcePath: W3_CONFIG.legacySourcePath }
  });
  return { state, unmount: () => { target.innerHTML = ''; } };
}

export default mountOperationsW3;
