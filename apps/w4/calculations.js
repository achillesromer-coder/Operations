export function clampNumber(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function normalizeScsInput(input = {}) {
  return {
    transferDeltaVkmS: clampNumber(input.transferDeltaVkmS, 0.01, 25),
    transitDays: clampNumber(input.transitDays, 1, 2000),
    payloadTonnes: clampNumber(input.payloadTonnes, 0, 100000),
    dryMassTonnes: clampNumber(input.dryMassTonnes, 0.1, 100000),
    propellantTonnes: clampNumber(input.propellantTonnes, 0, 100000),
    nodeCount: Math.round(clampNumber(input.nodeCount, 1, 64)),
    nodeReliability: clampNumber(input.nodeReliability, 0.01, 1),
    launchCadenceDays: clampNumber(input.launchCadenceDays, 1, 365),
    supplyBufferPercent: clampNumber(input.supplyBufferPercent, 0, 500),
    returnMassTonnes: clampNumber(input.returnMassTonnes, 0, 100000),
    riskMultiplier: clampNumber(input.riskMultiplier, 0.1, 10),
    carbonCostTonnes: clampNumber(input.carbonCostTonnes, 0, 1e7)
  };
}

export function simulateScs(input = {}) {
  const v = normalizeScsInput(input);
  const wetMassTonnes = v.payloadTonnes + v.dryMassTonnes + v.propellantTonnes;
  const propellantFraction = v.propellantTonnes / Math.max(1, wetMassTonnes);
  const annualLaunches = 365 / v.launchCadenceDays;
  const annualPayloadTonnes = annualLaunches * v.payloadTonnes;
  const roundTripDays = v.transitDays * 2 + v.launchCadenceDays;
  const nodeNetworkReliability = v.nodeReliability ** v.nodeCount;
  const bufferRatio = v.supplyBufferPercent / 100;
  const throughputTonnesPerDay = annualPayloadTonnes / 365;
  const returnRatio = v.returnMassTonnes / Math.max(1, v.payloadTonnes);
  const carbonPerPayloadTonne = v.carbonCostTonnes / Math.max(1, v.payloadTonnes);
  const logisticsRiskIndex = clampNumber(
    (v.transferDeltaVkmS / 12) * 0.28 + (v.transitDays / 800) * 0.22 + (1 - nodeNetworkReliability) * 0.25 + Math.max(0, propellantFraction - 0.55) * 0.5 + (1 / Math.max(0.1, bufferRatio + 0.1)) * 0.06,
    0,
    1
  );
  const dts = clampNumber(1 - logisticsRiskIndex * v.riskMultiplier + Math.min(0.12, returnRatio * 0.08), 0, 1);

  return {
    inputs: v,
    outputs: {
      wetMassTonnes,
      propellantFraction,
      annualLaunches,
      annualPayloadTonnes,
      roundTripDays,
      nodeNetworkReliability,
      bufferRatio,
      throughputTonnesPerDay,
      returnRatio,
      carbonPerPayloadTonne,
      logisticsRiskIndex,
      dts
    },
    validation: {
      finite: Object.values(v).every(Number.isFinite),
      assumptions: [
        'Screening model only; trajectory and supply-chain outputs require GMAT/CSALT-backed confirmation.',
        'Node reliability is treated multiplicatively across the active corridor.',
        'DTS is reduced by transfer energy, long transit duration, network unreliability, and insufficient buffer.'
      ]
    }
  };
}

export function createCadenceSweep(input = {}, cadences = [14, 30, 45, 60, 90]) {
  return cadences.map((launchCadenceDays) => ({ launchCadenceDays, ...simulateScs({ ...input, launchCadenceDays }).outputs }));
}

export default { normalizeScsInput, simulateScs, createCadenceSweep };
