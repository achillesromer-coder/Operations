export const W4_CONFIG = Object.freeze({
  moduleId: 'operations-w4',
  workspaceId: 'W4',
  route: '/operations/w4',
  dataRoute: '/w4/data',
  legacySourcePath: 'W4; SCS',
  title: 'W4 Supply Chain & Trajectory',
  shortTitle: 'W4 SCS',
  subtitle: 'Interplanetary supply chain, transfer, payload, and node-placement screening workspace',
  protocol: 'ACHILLES_PROTOCOL_v1.1',
  owner: 'Romer Industries / EMASSC',
  accent: '#ffaa00',
  dependencies: ['W1', 'W5', 'W6'],
  defaultInputs: {
    transferDeltaVkmS: 4.2,
    transitDays: 210,
    payloadTonnes: 12,
    dryMassTonnes: 18,
    propellantTonnes: 28.5,
    nodeCount: 4,
    nodeReliability: 0.91,
    launchCadenceDays: 45,
    supplyBufferPercent: 50,
    returnMassTonnes: 6,
    riskMultiplier: 1.12,
    carbonCostTonnes: 220
  },
  statusCards: [
    { id: 'dv', label: 'Transfer dV', unit: 'km/s' },
    { id: 'transit', label: 'Transit', unit: 'days' },
    { id: 'payload', label: 'Payload', unit: 't' },
    { id: 'nodes', label: 'Nodes', unit: '' }
  ]
});

export default W4_CONFIG;
