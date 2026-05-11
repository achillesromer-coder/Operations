export const W5_CONFIG = Object.freeze({
  moduleId: 'operations-w5',
  workspaceId: 'W5',
  route: '/operations/w5',
  dataRoute: '/w5/data',
  legacySourcePath: 'W5; MOP',
  title: 'W5 Mission Planning GMAT',
  shortTitle: 'W5 MOP',
  subtitle: 'Mission template, transfer-budget, and GMAT job-contract staging workspace',
  protocol: 'ACHILLES_PROTOCOL_v1.1',
  owner: 'Romer Industries / EMASSC',
  accent: '#00ff88',
  dependencies: ['W1', 'W2', 'W4', 'W6'],
  defaultInputs: {
    missionId: 'mark-iii-template-calibration',
    missionType: 'asteroid-transfer-screen',
    targetBody: '433 Eros',
    epochUtc: '2026-01-01T00:00:00.000Z',
    coordinateSystem: 'EarthMJ2000Eq',
    initialSmaKm: 7005,
    initialEcc: 0.008,
    initialIncDeg: 28.5,
    initialRaanDeg: 75,
    initialAopDeg: 90,
    initialTaDeg: 45,
    dryMassKg: 850,
    payloadMassKg: 120,
    propellantMassKg: 410,
    specificImpulseSec: 320,
    transferDeltaVkmS: 4.2,
    correctionDeltaVkmS: 0.35,
    missionArcDays: 820,
    propagationStepSec: 120,
    forceModel: 'SunMoonEarthPointMass',
    propagator: 'RungeKutta89',
    reportCadenceSec: 3600,
    dtsFloor: 0.72
  },
  statusCards: [
    { id: 'dv', label: 'Total dV', unit: 'km/s' },
    { id: 'prop', label: 'Propellant margin', unit: 'kg' },
    { id: 'arc', label: 'Mission arc', unit: 'days' },
    { id: 'dts', label: 'DTS proxy', unit: '' }
  ]
});

export default W5_CONFIG;
