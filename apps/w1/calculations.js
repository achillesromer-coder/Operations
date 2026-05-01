// ============================================================
// MODULE: W1 Deposit Analysis / Capture Workspace
// FILE: calculations.js
// PURPOSE: Pure calculation functions extracted from legacy W1 HTML.
// ============================================================

import { ATMOSPHERE_LAYERS, METALS, PHYSICS_CONSTANTS, STATIONS, VALIDATION_LIMITS } from "./presets.js";

export function formatEngineering(value, digits = 2) {
  if (!Number.isFinite(value)) return "N/A";
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${(value / 1e9).toFixed(digits)}B`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(digits)}M`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(digits)}k`;
  return Number(value).toFixed(digits);
}

export function formatMoneyAud(value) {
  return `$${formatEngineering(value)}`;
}

export function clampNumber(value, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

export function orbitalVelocityMS(altitudeKm) {
  const rM = PHYSICS_CONSTANTS.earthRadiusM + altitudeKm * 1000;
  return Math.sqrt(PHYSICS_CONSTANTS.muEarthM3S2 / rM);
}

export function atmosphericDensityKgM3(altitudeM) {
  const layer = ATMOSPHERE_LAYERS.find((item) => altitudeM >= item.z0M && altitudeM <= item.z1M);
  if (!layer) return PHYSICS_CONSTANTS.rho0KgM3 * 1e-12;
  return PHYSICS_CONSTANTS.rho0KgM3 * layer.densityFactor * Math.exp(-(altitudeM - layer.z0M) / layer.scaleHeightM);
}

export function normalizeCaptureInput(input = {}) {
  return {
    project: String(input.project || "Orbital Mining Study"),
    metal: METALS[input.metal] ? input.metal : "gold",
    massKg: clampNumber(input.massKg, VALIDATION_LIMITS.minMassKg, VALIDATION_LIMITS.maxMassKg),
    altitudeKm: clampNumber(input.altitudeKm, VALIDATION_LIMITS.minAltitudeKm, VALIDATION_LIMITS.maxAltitudeKm),
    station: STATIONS[input.station] ? input.station : "medium-large",
    safetyFactor: clampNumber(input.safetyFactor, VALIDATION_LIMITS.minSafetyFactor, VALIDATION_LIMITS.maxSafetyFactor),
    nScalar: Number.isFinite(Number(input.nScalar)) ? Number(input.nScalar) : 0,
    sweepVar: input.sweepVar || ""
  };
}

export function simulateCapture(input = {}) {
  const params = normalizeCaptureInput(input);
  const metal = METALS[params.metal];
  const station = STATIONS[params.station];

  let adjustedMassKg = params.massKg;
  let adjustedAltitudeKm = params.altitudeKm;
  let velocityFactor = PHYSICS_CONSTANTS.reentryVelocityFactor;

  if (params.sweepVar === "mass") adjustedMassKg = Math.max(VALIDATION_LIMITS.minMassKg, params.massKg * (1 + params.nScalar));
  if (params.sweepVar === "altitude") adjustedAltitudeKm = Math.max(VALIDATION_LIMITS.minAltitudeKm, params.altitudeKm * (1 + params.nScalar));
  if (params.sweepVar === "v_factor") velocityFactor = Math.max(0.05, velocityFactor * (1 + params.nScalar));

  const volumeM3 = adjustedMassKg / metal.densityKgM3;
  const radiusM = Math.cbrt((3 * volumeM3) / (4 * Math.PI));
  const circularVelocityMS = orbitalVelocityMS(adjustedAltitudeKm);
  const approachVelocityMS = Math.max(0, circularVelocityMS * velocityFactor);
  const forceRequiredN = adjustedMassKg * approachVelocityMS * approachVelocityMS / (2 * station.captureDistanceM);

  const requiredFieldT = metal.conductivitySM > 0 && station.areaM2 > 0 && approachVelocityMS > 0
    ? Math.sqrt(Math.max(0, forceRequiredN / (PHYSICS_CONSTANTS.eddyDragCoefficient * metal.conductivitySM * station.areaM2 * approachVelocityMS))) * params.safetyFactor
    : 0;

  const mechanicalPowerW = forceRequiredN * approachVelocityMS;
  const electricalPowerW = mechanicalPowerW / Math.max(1e-3, PHYSICS_CONSTANTS.captureEfficiency);
  const peakPowerMW = electricalPowerW / 1e6;
  const accelerationMSS = forceRequiredN / adjustedMassKg;
  const captureTimeS = accelerationMSS > 0 ? approachVelocityMS / accelerationMSS : 0;

  const steps = 200;
  const timeSeriesS = Array.from({ length: steps }, (_, index) => (index / (steps - 1)) * Math.max(captureTimeS, 1));
  const velocitySeriesMS = timeSeriesS.map((time) => Math.max(0, approachVelocityMS * (1 - time / Math.max(captureTimeS, 1e-9))));
  const powerSeriesMW = velocitySeriesMS.map((velocity) => (forceRequiredN * velocity) / 1e6);
  const altitudeProfileM = timeSeriesS.map((_, index) => 50000 * (1 - index / (steps - 1)));
  const densitySeries = altitudeProfileM.map(atmosphericDensityKgM3);
  const heatingSeries = velocitySeriesMS.map((velocity, index) => PHYSICS_CONSTANTS.heatingCoefficient * Math.sqrt(Math.max(densitySeries[index], 1e-12) / PHYSICS_CONSTANTS.noseRadiusM) * velocity ** 3);

  const successProbability = Math.min(1, Math.max(0, (1 - approachVelocityMS / 1200)) * station.successBonus);
  const economicValueAud = adjustedMassKg * metal.valueAudKg;
  const dt = timeSeriesS[1] - timeSeriesS[0];
  const heatLoad = heatingSeries.reduce((sum, value) => sum + value * dt, 0);
  const ecoScore = Math.min(10, 0.1 + 0.4 * Math.sqrt(heatLoad / (adjustedMassKg + 1)));
  const energyMJ = powerSeriesMW.reduce((sum, value) => sum + value * dt, 0);
  const energyMWh = energyMJ / 3600;
  const energyCostAud = 100 * energyMWh;
  const efficiencyX = Math.min(1000, economicValueAud / Math.max(1, energyCostAud));

  return {
    id: `w1_capture_${Date.now()}`,
    version: "w1.capture-result.v1",
    project: params.project,
    input: params,
    adjusted: {
      massKg: adjustedMassKg,
      altitudeKm: adjustedAltitudeKm,
      velocityFactor
    },
    material: {
      key: params.metal,
      label: metal.label,
      radiusM,
      volumeM3
    },
    outputs: {
      approachVelocityMS,
      requiredFieldT,
      peakPowerMW,
      captureTimeS,
      successProbability,
      ecoScore,
      efficiencyX,
      economicValueAud,
      energyCostAud,
      gForces: approachVelocityMS * approachVelocityMS / (station.captureDistanceM * PHYSICS_CONSTANTS.standardGravityMSS),
      maxTemperatureK: 300 + heatLoad / (adjustedMassKg * 450),
      stationCapMW: station.powerMW,
      stationCapT: station.baseFieldT,
      metalMeltingPointK: metal.meltingPointK
    },
    series: {
      timeSeriesS,
      velocitySeriesMS,
      powerSeriesMW,
      heatingSeries
    },
    createdAt: new Date().toISOString()
  };
}

export function createSweep(input = {}) {
  const base = normalizeCaptureInput(input);
  const steps = clampNumber(input.sweepSteps ?? 21, VALIDATION_LIMITS.minSweepSteps, VALIDATION_LIMITS.maxSweepSteps);
  const min = Number.isFinite(Number(input.sweepMin)) ? Number(input.sweepMin) : -0.5;
  const max = Number.isFinite(Number(input.sweepMax)) ? Number(input.sweepMax) : 0.5;
  const sweepVar = input.sweepVar || "mass";

  return Array.from({ length: steps }, (_, index) => {
    const scalar = steps === 1 ? 0 : min + ((max - min) * index) / (steps - 1);
    const result = simulateCapture({ ...base, sweepVar, nScalar: scalar });
    return {
      scalar,
      sweepVar,
      massKg: result.adjusted.massKg,
      altitudeKm: result.adjusted.altitudeKm,
      approachVelocityMS: result.outputs.approachVelocityMS,
      requiredFieldT: result.outputs.requiredFieldT,
      peakPowerMW: result.outputs.peakPowerMW,
      successProbability: result.outputs.successProbability,
      efficiencyX: result.outputs.efficiencyX
    };
  });
}

export function classifyResult(result) {
  const outputs = result.outputs;
  return {
    powerClass: outputs.peakPowerMW <= outputs.stationCapMW ? "success" : "danger",
    fieldClass: outputs.requiredFieldT <= outputs.stationCapT ? "success" : outputs.requiredFieldT <= outputs.stationCapT * 1.2 ? "warning" : "danger",
    successClass: outputs.successProbability > 0.8 ? "success" : outputs.successProbability > 0.5 ? "warning" : "danger",
    gClass: outputs.gForces > 100 ? "danger" : outputs.gForces > 50 ? "warning" : "success",
    tempClass: outputs.maxTemperatureK > 1500 ? "danger" : outputs.maxTemperatureK > 1000 ? "warning" : "info",
    roiClass: outputs.efficiencyX > 10 ? "success" : outputs.efficiencyX > 2 ? "warning" : "danger"
  };
}
