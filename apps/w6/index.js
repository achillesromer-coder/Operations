import { createW6Controller } from './events.js';

export function mountOperationsW6(target, ctx = {}) {
  if (!target) {
    throw new Error('mountOperationsW6 requires a target element.');
  }
  return createW6Controller(target, ctx);
}

if (typeof window !== 'undefined') {
  window.RomerOperations = window.RomerOperations || {};
  window.RomerOperations.mountOperationsW6 = mountOperationsW6;
}

export default mountOperationsW6;
