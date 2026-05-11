export const W6_CONFIG = Object.freeze({
  moduleId: 'operations-w6',
  workspaceId: 'W6',
  route: '/operations/w6',
  dataRoute: '/w6/data',
  legacySourcePath: 'W6; PAL inferred from Operations topology',
  title: 'W6 Platform Asset Library',
  shortTitle: 'W6 PAL',
  subtitle: 'Asset, power, platform, and mission-readiness library for Mark/Luke/Free Flow/Solar Hull stack alignment.',
  protocol: 'ACHILLES_PROTOCOL_v1.1',
  owner: 'Romer Industries / EMASSC',
  accent: '#b7fb61',
  dependencies: ['W1', 'W2', 'W4', 'W5', 'MPL', 'Data'],
  defaultInputs: {
    assetId: 'mark-iii-alpha',
    platformClass: 'Mark III',
    missionRole: 'asteroid-field-linked-extraction',
    dryMassKg: 850,
    payloadCapacityKg: 120,
    solarHullAreaM2: 42,
    solarEfficiencyPct: 28,
    averageSolarFluxWm2: 1361,
    batteryCapacityKWh: 240,
    dischargePowerKW: 95,
    rfsPowerKW: 34,
    emffPowerKW: 26,
    avionicsPowerKW: 4,
    thermalPowerKW: 7,
    redundancyFactor: 1.18,
    sparesMassKg: 64,
    commsReliabilityPct: 96,
    propulsionReliabilityPct: 91,
    extractionReliabilityPct: 88,
    dataReadinessPct: 82,
    gmatContractReadinessPct: 74,
    mplPublishReadinessPct: 68
  },
  statusCards: [
    { id: 'power', label: 'Power margin', unit: 'kW' },
    { id: 'endurance', label: 'Battery endurance', unit: 'h' },
    { id: 'readiness', label: 'Readiness', unit: '%' },
    { id: 'dts', label: 'DTS proxy', unit: '' }
  ]
});

export default W6_CONFIG;
