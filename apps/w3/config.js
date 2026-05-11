export const W3_CONFIG = Object.freeze({
  moduleId: 'operations-w3',
  workspaceId: 'W3',
  route: '/operations/w3',
  dataRoute: '/w3/data',
  legacySourcePath: 'W3; RMS',
  title: 'W3 Resonant Mining Systems',
  shortTitle: 'W3 RMS',
  subtitle: 'RFS and EMFF formation-field screening workspace',
  protocol: 'ACHILLES_PROTOCOL_v1.1',
  owner: 'Romer Industries / EMASSC',
  accent: '#ff3366',
  dependencies: ['W1', 'W2', 'W5', 'W6'],
  defaultInputs: {
    spinRateRpm: 12,
    magneticFieldT: 0.05,
    formationSeparationM: 80,
    phaseOffsetDeg: 120,
    nodeCount: 3,
    powerKw: 45,
    dutyCycle: 0.72,
    targetMassKg: 1200,
    resonanceEfficiency: 0.31,
    fieldCoupling: 0.64,
    runHours: 6
  },
  statusCards: [
    { id: 'spin', label: 'Spin Rate', unit: 'rpm' },
    { id: 'field', label: 'B Field', unit: 'T' },
    { id: 'separation', label: 'Formation Sep', unit: 'm' },
    { id: 'power', label: 'Power', unit: 'kW' }
  ]
});

export default W3_CONFIG;
