export { mountOperationsW1 } from './w1/index.js';
export { mountOperationsW2 } from './w2/index.js';
export { mountOperationsW3 } from './w3/index.js';
export { mountOperationsW4 } from './w4/index.js';
export { mountOperationsW5 } from './w5/index.js';
export { mountOperationsW6 } from './w6/index.js';

export const OPERATIONS_MODULES = Object.freeze({
  W1: () => import('./w1/index.js'),
  W2: () => import('./w2/index.js'),
  W3: () => import('./w3/index.js'),
  W4: () => import('./w4/index.js'),
  W5: () => import('./w5/index.js'),
  W6: () => import('./w6/index.js')
});

export async function mountOperationsWorkspace(workspaceId, target, ctx = {}) {
  const key = String(workspaceId || '').toUpperCase();
  const loader = OPERATIONS_MODULES[key];
  if (!loader) {
    throw new Error(`Unknown Operations workspace: ${workspaceId}`);
  }
  const mod = await loader();
  const mountName = `mountOperations${key}`;
  if (typeof mod[mountName] !== 'function') {
    throw new Error(`Operations workspace ${key} does not expose ${mountName}.`);
  }
  return mod[mountName](target, ctx);
}

if (typeof window !== 'undefined') {
  window.RomerOperations = window.RomerOperations || {};
  window.RomerOperations.modules = OPERATIONS_MODULES;
  window.RomerOperations.mountWorkspace = mountOperationsWorkspace;
}

export default OPERATIONS_MODULES;
