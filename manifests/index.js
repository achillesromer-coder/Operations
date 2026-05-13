export { default as OPERATIONS_APPS_MANIFEST } from './operations-apps.manifest.js';
export { default as OPERATIONS_CALCULATORS_MANIFEST } from './calculators.manifest.js';
export { default as OPERATIONS_SCREENING_MODULES_MANIFEST } from './screening-modules.manifest.js';

export const OPERATIONS_MANIFEST_INDEX = Object.freeze({
  schemaVersion: '1.0.0',
  kind: 'romer.operations.manifest-index',
  protocol: 'ACHILLES_PROTOCOL_v1.1',
  manifests: Object.freeze([
    Object.freeze({ id: 'operations-apps', path: 'manifests/operations-apps.manifest.js', jsonPath: 'manifests/operations-apps.manifest.json' }),
    Object.freeze({ id: 'operations-calculators', path: 'manifests/calculators.manifest.js', jsonPath: 'manifests/calculators.manifest.json' }),
    Object.freeze({ id: 'operations-screening-modules', path: 'manifests/screening-modules.manifest.js', jsonPath: 'manifests/simulations.manifest.json' })
  ]),
  routeFamilies: Object.freeze(['/operations/w1', '/operations/w2', '/operations/w3', '/operations/w4', '/operations/w5', '/operations/w6', '/operations/calculators', '/operations/screening'])
});

export default OPERATIONS_MANIFEST_INDEX;
