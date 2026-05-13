export const OPERATIONS_SCREENING_MODULES_MANIFEST = Object.freeze({
  schemaVersion: '1.0.0',
  kind: 'romer.operations.screening-modules.manifest',
  protocol: 'ACHILLES_PROTOCOL_v1.1',
  namespace: 'RomerOperationsScreeningModules',
  baseRoute: '/operations/screening',
  repository: Object.freeze({
    fullName: 'achillesromer-coder/Operations',
    branch: 'feature/lightspeed-wrapper-alignment'
  }),
  cdnBase: 'https://cdn.jsdelivr.net/gh/achillesromer-coder/Operations@feature/lightspeed-wrapper-alignment',
  modules: Object.freeze([
    Object.freeze({ id: 'screen-rfs', route: '/operations/screening/rfs', title: 'RFS Screening Module', entry: 'simulations/rfs-extraction/index.js', mount: 'mountRfsExtractionSimulation' }),
    Object.freeze({ id: 'screen-emff', route: '/operations/screening/emff', title: 'EMFF Screening Module', entry: 'simulations/emff-node/index.js', mount: 'mountEmffNodeSimulation' }),
    Object.freeze({ id: 'screen-fields', route: '/operations/screening/fields', title: 'Field Map Screening Module', entry: 'simulations/emf-fields/index.js', mount: 'mountEmfFieldsSimulation' }),
    Object.freeze({ id: 'screen-thermal', route: '/operations/screening/thermal', title: 'Thermal Screening Module', entry: 'simulations/re-entry/index.js', mount: 'mountReEntrySimulation' }),
    Object.freeze({ id: 'screen-gmat-preview', route: '/operations/screening/gmat-preview', title: 'GMAT Job Preview', entry: 'simulations/gmat-job-preview/index.js', mount: 'mountGmatJobPreviewSimulation' })
  ]),
  validation: Object.freeze({
    numericPolicy: 'Screening modules are deterministic interface layers. Mission records must pass Data/Achilles validation and GMAT-backed verification where orbital dynamics are involved.'
  })
});

export default OPERATIONS_SCREENING_MODULES_MANIFEST;
