import W5_CONFIG from './config.js';
import { createW5Controller } from './events.js';

export function mountOperationsW5(target, ctx = {}) {
  if (!target) {
    throw new Error('[W5] mount target is required');
  }

  const controller = createW5Controller(target, ctx);
  controller.mount();

  return {
    moduleId: W5_CONFIG.moduleId,
    workspaceId: W5_CONFIG.workspaceId,
    route: W5_CONFIG.route,
    getState: controller.getState,
    unmount: controller.unmount
  };
}

if (typeof window !== 'undefined') {
  window.RomerOperations = window.RomerOperations || {};
  window.RomerOperations.mountOperationsW5 = mountOperationsW5;
}

export default mountOperationsW5;
