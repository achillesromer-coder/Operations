export const OPERATIONS_CALCULATORS_MANIFEST = Object.freeze({
  schemaVersion: '1.0.0',
  kind: 'romer.operations.calculators.manifest',
  protocol: 'ACHILLES_PROTOCOL_v1.1',
  namespace: 'RomerOperationsCalculators',
  baseRoute: '/operations/calculators',
  repository: Object.freeze({
    fullName: 'achillesromer-coder/Operations',
    branch: 'feature/lightspeed-wrapper-alignment'
  }),
  cdnBase: 'https://cdn.jsdelivr.net/gh/achillesromer-coder/Operations@feature/lightspeed-wrapper-alignment',
  calculators: Object.freeze([
    Object.freeze({
      id: 'calculator-orbital',
      route: '/operations/calculators/orbital',
      title: 'Orbital Calculator',
      entry: 'calculators/orbital/index.js',
      mount: 'mountOrbitalCalculator',
      inputUnits: Object.freeze(['km', 'km/s', 'deg', 'kg']),
      produces: Object.freeze(['orbital-elements-record', 'delta-v-estimate-record'])
    }),
    Object.freeze({
      id: 'calculator-launch',
      route: '/operations/calculators/launch',
      title: 'Launch Window Calculator',
      entry: 'calculators/launch/index.js',
      mount: 'mountLaunchCalculator',
      inputUnits: Object.freeze(['deg', 'km', 's', 'kg']),
      produces: Object.freeze(['launch-geometry-record', 'window-screen-record'])
    }),
    Object.freeze({
      id: 'calculator-magnetostatics',
      route: '/operations/calculators/magnetostatics',
      title: 'Magnetostatics Calculator',
      entry: 'calculators/magnetostatics/index.js',
      mount: 'mountMagnetostaticsCalculator',
      inputUnits: Object.freeze(['A', 'm', 'T', 'N']),
      produces: Object.freeze(['field-strength-record', 'coil-screen-record'])
    }),
    Object.freeze({
      id: 'calculator-energy',
      route: '/operations/calculators/energy',
      title: 'Energy Calculator',
      entry: 'calculators/energy/index.js',
      mount: 'mountEnergyCalculator',
      inputUnits: Object.freeze(['W', 'Wh', 'kW', 'kWh', 'kg']),
      produces: Object.freeze(['power-budget-record', 'storage-endurance-record'])
    }),
    Object.freeze({
      id: 'calculator-fluids',
      route: '/operations/calculators/fluids',
      title: 'Fluids Calculator',
      entry: 'calculators/fluids/index.js',
      mount: 'mountFluidsCalculator',
      inputUnits: Object.freeze(['Pa', 'm3/s', 'kg/m3', 'm/s']),
      produces: Object.freeze(['flow-screen-record', 'pressure-drop-record'])
    })
  ]),
  validation: Object.freeze({
    numericPolicy: 'Browser calculators are deterministic screening tools. Records feeding mission execution must be validated by Data/Achilles and, where orbital, by GMAT or an equivalent verified dynamics stack.'
  })
});

export default OPERATIONS_CALCULATORS_MANIFEST;
