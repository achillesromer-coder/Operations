const TWO_PI = Math.PI * 2;

export function clampNumber(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function normalizeRmsInput(input = {}) {
  return {
    spinRateRpm: clampNumber(input.spinRateRpm, 0.1, 120),
    magneticFieldT: clampNumber(input.magneticFieldT, 0.001, 2.5),
    formationSeparationM: clampNumber(input.formationSeparationM, 1, 10000),
    phaseOffsetDeg: clampNumber(input.phaseOffsetDeg, 0, 360),
    nodeCount: Math.round(clampNumber(input.nodeCount, 1, 24)),
    powerKw: clampNumber(input.powerKw, 0.1, 5000),
    dutyCycle: clampNumber(input.dutyCycle, 0.01, 1),
    targetMassKg: clampNumber(input.targetMassKg, 1, 1e9),
    resonanceEfficiency: clampNumber(input.resonanceEfficiency, 0.01, 1),
    fieldCoupling: clampNumber(input.fieldCoupling, 0.01, 1),
    runHours: clampNumber(input.runHours, 0.01, 240)
  };
}

export function simulateRms(input = {}) {
  const v = normalizeRmsInput(input);
  const spinHz = v.spinRateRpm / 60;
  const angularVelocityRadS = TWO_PI * spinHz;
  const phaseSymmetry = Math.max(0, Math.cos((Math.abs(v.phaseOffsetDeg - 120) * Math.PI) / 180));
  const formationGain = Math.sqrt(v.nodeCount) * (0.55 + 0.45 * phaseSymmetry);
  const fieldEnergyIndex = v.magneticFieldT ** 2 * v.formationSeparationM * formationGain;
  const usablePowerKw = v.powerKw * v.dutyCycle;
  const energyKwh = usablePowerKw * v.runHours;
  const resonanceYieldKg = energyKwh * v.resonanceEfficiency * v.fieldCoupling * formationGain * 0.018;
  const massFractionProcessed = resonanceYieldKg / v.targetMassKg;
  const thermalLoadIndex = usablePowerKw * (1 - v.resonanceEfficiency) / Math.max(1, v.nodeCount);
  const phaseRisk = Math.min(1, Math.abs(v.phaseOffsetDeg - 120) / 120);
  const stabilityIndex = clampNumber(
    1 - phaseRisk * 0.35 - thermalLoadIndex / 2500 - Math.max(0, angularVelocityRadS - 10) / 40,
    0,
    1
  );
  const readinessScore = clampNumber(
    0.25 + stabilityIndex * 0.35 + Math.min(0.25, massFractionProcessed * 2) + Math.min(0.15, v.fieldCoupling * 0.15),
    0,
    1
  );

  return {
    inputs: v,
    outputs: {
      spinHz,
      angularVelocityRadS,
      formationGain,
      fieldEnergyIndex,
      usablePowerKw,
      energyKwh,
      resonanceYieldKg,
      massFractionProcessed,
      thermalLoadIndex,
      stabilityIndex,
      readinessScore
    },
    validation: {
      finite: Object.values(v).every(Number.isFinite),
      assumptions: [
        'Screening model only; not a substitute for laboratory RFS/EMFF calibration.',
        'Yield coefficient is deliberately conservative pending W6 power-spec closure.',
        'Phase optimum is centred on 120 degrees for three-node formation symmetry.'
      ]
    }
  };
}

export function createPowerSweep(input = {}, points = [5, 15, 45, 100, 200]) {
  return points.map((powerKw) => ({ powerKw, ...simulateRms({ ...input, powerKw }).outputs }));
}

export default { normalizeRmsInput, simulateRms, createPowerSweep };
