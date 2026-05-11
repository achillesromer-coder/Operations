const G0_KM_S2 = 0.00980665;

function asNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeMissionPlanningInput(input = {}, defaults = {}) {
  const merged = { ...defaults, ...input };

  return {
    missionId: String(merged.missionId || defaults.missionId || 'mission-template'),
    missionType: String(merged.missionType || defaults.missionType || 'propagation'),
    targetBody: String(merged.targetBody || defaults.targetBody || '433 Eros'),
    epochUtc: String(merged.epochUtc || defaults.epochUtc || new Date().toISOString()),
    coordinateSystem: String(merged.coordinateSystem || defaults.coordinateSystem || 'EarthMJ2000Eq'),
    initialSmaKm: asNumber(merged.initialSmaKm, defaults.initialSmaKm),
    initialEcc: clamp(asNumber(merged.initialEcc, defaults.initialEcc), 0, 0.99),
    initialIncDeg: asNumber(merged.initialIncDeg, defaults.initialIncDeg),
    initialRaanDeg: asNumber(merged.initialRaanDeg, defaults.initialRaanDeg),
    initialAopDeg: asNumber(merged.initialAopDeg, defaults.initialAopDeg),
    initialTaDeg: asNumber(merged.initialTaDeg, defaults.initialTaDeg),
    dryMassKg: Math.max(0, asNumber(merged.dryMassKg, defaults.dryMassKg)),
    payloadMassKg: Math.max(0, asNumber(merged.payloadMassKg, defaults.payloadMassKg)),
    propellantMassKg: Math.max(0, asNumber(merged.propellantMassKg, defaults.propellantMassKg)),
    specificImpulseSec: Math.max(1, asNumber(merged.specificImpulseSec, defaults.specificImpulseSec)),
    transferDeltaVkmS: Math.max(0, asNumber(merged.transferDeltaVkmS, defaults.transferDeltaVkmS)),
    correctionDeltaVkmS: Math.max(0, asNumber(merged.correctionDeltaVkmS, defaults.correctionDeltaVkmS)),
    missionArcDays: Math.max(1, asNumber(merged.missionArcDays, defaults.missionArcDays)),
    propagationStepSec: Math.max(1, asNumber(merged.propagationStepSec, defaults.propagationStepSec)),
    forceModel: String(merged.forceModel || defaults.forceModel || 'SunMoonEarthPointMass'),
    propagator: String(merged.propagator || defaults.propagator || 'RungeKutta89'),
    reportCadenceSec: Math.max(1, asNumber(merged.reportCadenceSec, defaults.reportCadenceSec)),
    dtsFloor: clamp(asNumber(merged.dtsFloor, defaults.dtsFloor || 0.72), 0, 1)
  };
}

export function simulateMissionPlanning(input = {}, defaults = {}) {
  const mission = normalizeMissionPlanningInput(input, defaults);
  const wetMassKg = mission.dryMassKg + mission.payloadMassKg + mission.propellantMassKg;
  const finalMassKg = Math.max(1, mission.dryMassKg + mission.payloadMassKg);
  const availableDeltaVkmS = mission.specificImpulseSec * G0_KM_S2 * Math.log(Math.max(wetMassKg, 1) / finalMassKg);
  const requiredDeltaVkmS = mission.transferDeltaVkmS + mission.correctionDeltaVkmS;
  const deltaVMarginKmS = availableDeltaVkmS - requiredDeltaVkmS;
  const propellantFraction = wetMassKg > 0 ? mission.propellantMassKg / wetMassKg : 0;
  const missionArcSeconds = mission.missionArcDays * 86400;
  const propagationSteps = Math.ceil(missionArcSeconds / mission.propagationStepSec);
  const reportRows = Math.ceil(missionArcSeconds / mission.reportCadenceSec);
  const massClosureScore = clamp((deltaVMarginKmS + 0.75) / 1.5, 0, 1);
  const runtimeScore = clamp(1 - propagationSteps / 1200000, 0, 1);
  const dts = clamp((0.46 * massClosureScore) + (0.24 * runtimeScore) + (0.18 * (1 - propellantFraction)) + 0.12, 0, 1);

  const arrivalDate = new Date(mission.epochUtc);
  if (!Number.isNaN(arrivalDate.getTime())) {
    arrivalDate.setUTCDate(arrivalDate.getUTCDate() + Math.round(mission.missionArcDays));
  }

  return {
    ...mission,
    wetMassKg,
    finalMassKg,
    availableDeltaVkmS,
    requiredDeltaVkmS,
    deltaVMarginKmS,
    propellantFraction,
    propagationSteps,
    reportRows,
    massClosureScore,
    runtimeScore,
    dts,
    passDtsFloor: dts >= mission.dtsFloor,
    arrivalUtc: Number.isNaN(arrivalDate.getTime()) ? '' : arrivalDate.toISOString()
  };
}

export function createDepartureWindowSweep(input = {}, defaults = {}, offsetsDays = [-30, -14, 0, 14, 30, 60]) {
  const base = normalizeMissionPlanningInput(input, defaults);
  const baseEpoch = new Date(base.epochUtc);

  return offsetsDays.map((offsetDays) => {
    const epoch = new Date(baseEpoch);
    if (!Number.isNaN(epoch.getTime())) {
      epoch.setUTCDate(epoch.getUTCDate() + offsetDays);
    }
    const phasePenalty = Math.abs(offsetDays) * 0.006;
    return simulateMissionPlanning({
      ...base,
      epochUtc: Number.isNaN(epoch.getTime()) ? base.epochUtc : epoch.toISOString(),
      correctionDeltaVkmS: base.correctionDeltaVkmS + phasePenalty
    }, defaults);
  });
}

export function buildGmatJobRequest(result = {}) {
  const mission = normalizeMissionPlanningInput(result, result);
  const now = new Date().toISOString();

  return {
    id: `gmat-${mission.missionId}-${Date.now()}`,
    jobType: 'propagation',
    missionId: mission.missionId,
    missionType: mission.missionType,
    targetBody: mission.targetBody,
    protocol: 'ACHILLES_PROTOCOL_v1.1',
    spacecraft: {
      name: `${mission.missionId}-SC`,
      epochUtc: mission.epochUtc,
      coordinateSystem: mission.coordinateSystem,
      dryMassKg: mission.dryMassKg,
      payloadMassKg: mission.payloadMassKg,
      propellantMassKg: mission.propellantMassKg,
      stateType: 'Keplerian',
      keplerian: {
        smaKm: mission.initialSmaKm,
        ecc: mission.initialEcc,
        incDeg: mission.initialIncDeg,
        raanDeg: mission.initialRaanDeg,
        aopDeg: mission.initialAopDeg,
        taDeg: mission.initialTaDeg
      }
    },
    propulsionBudget: {
      specificImpulseSec: mission.specificImpulseSec,
      transferDeltaVkmS: mission.transferDeltaVkmS,
      correctionDeltaVkmS: mission.correctionDeltaVkmS,
      requiredDeltaVkmS: result.requiredDeltaVkmS,
      availableDeltaVkmS: result.availableDeltaVkmS,
      deltaVMarginKmS: result.deltaVMarginKmS
    },
    forceModel: {
      name: mission.forceModel,
      centralBody: 'Earth',
      pointMasses: ['Sun', 'Moon']
    },
    propagator: {
      name: mission.propagator,
      integrator: mission.propagator,
      stepSeconds: mission.propagationStepSec,
      reportCadenceSeconds: mission.reportCadenceSec
    },
    duration: {
      days: mission.missionArcDays,
      stopEpochUtc: result.arrivalUtc || null
    },
    outputs: ['stateHistory', 'reportFile', 'gmatScript', 'summaryJson'],
    validation: {
      dts: result.dts,
      passDtsFloor: result.passDtsFloor,
      finite: Object.values(result).every((value) => typeof value !== 'number' || Number.isFinite(value))
    },
    createdAt: now
  };
}

export default {
  normalizeMissionPlanningInput,
  simulateMissionPlanning,
  createDepartureWindowSweep,
  buildGmatJobRequest
};
