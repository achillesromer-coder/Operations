// ============================================================
// MODULE: W2 GOS Luke II Catch/Hold Workspace
// FILE: calculations.js
// PURPOSE: Pure screening calculations for electromagnetic catch/hold feasibility.
// ============================================================

const MU0 = 4 * Math.PI * 1e-7;
const G0 = 9.80665;

export function clampNumber(value, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

export function formatEngineering(value, digits = 2) {
  if (!Number.isFinite(Number(value))) return "N/A";
  const n = Number(value);
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(digits)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(digits)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(digits)}k`;
  return n.toFixed(digits);
}

export function normalizeCatchHoldInput(input = {}) {
  return {
    scenario: String(input.scenario || "Luke II GEO rendezvous hold"),
    targetMassKg: clampNumber(input.targetMassKg, 1, 100000),
    approachVelocityMS: clampNumber(input.approachVelocityMS, 0.01, 50),
    catchRadiusM: clampNumber(input.catchRadiusM, 1, 1000),
    holdForceN: clampNumber(input.holdForceN, 0.1, 1e6),
    coilCurrentA: clampNumber(input.coilCurrentA, 1, 20000),
    coilTurns: clampNumber(input.coilTurns, 1, 100000),
    coilRadiusM: clampNumber(input.coilRadiusM, 0.1, 200),
    holdDurationHours: clampNumber(input.holdDurationHours, 0.01, 8760),
    safetyFactor: clampNumber(input.safetyFactor, 1, 5)
  };
}

export function simulateCatchHold(input = {}) {
  const p = normalizeCatchHoldInput(input);
  const coilFieldT = (MU0 * p.coilTurns * p.coilCurrentA) / (2 * p.coilRadiusM);
  const kineticEnergyJ = 0.5 * p.targetMassKg * p.approachVelocityMS ** 2;
  const stoppingForceN = kineticEnergyJ / Math.max(1e-9, p.catchRadiusM);
  const requiredHoldForceN = p.holdForceN * p.safetyFactor;
  const forceMargin = p.holdForceN / Math.max(1e-9, stoppingForceN * p.safetyFactor);
  const gEquivalent = stoppingForceN / (p.targetMassKg * G0);
  const copperLossProxyKW = (p.coilCurrentA ** 2 * p.coilTurns * 1e-5) / 1000;
  const holdEnergyKWh = copperLossProxyKW * p.holdDurationHours;
  const stabilityIndex = Math.max(0, Math.min(1, forceMargin)) * Math.max(0, Math.min(1, coilFieldT / 0.05));
  const captureClass = stabilityIndex > 0.75 ? "success" : stabilityIndex > 0.45 ? "warning" : "danger";

  return {
    id: `w2_catch_hold_${Date.now()}`,
    version: "w2.catch-hold-result.v1",
    scenario: p.scenario,
    input: p,
    outputs: {
      coilFieldT,
      kineticEnergyJ,
      stoppingForceN,
      requiredHoldForceN,
      forceMargin,
      gEquivalent,
      copperLossProxyKW,
      holdEnergyKWh,
      stabilityIndex,
      captureClass
    },
    createdAt: new Date().toISOString()
  };
}

export function createCurrentSweep(input = {}) {
  const base = normalizeCatchHoldInput(input);
  return Array.from({ length: 21 }, (_, index) => {
    const scalar = 0.5 + index * 0.05;
    const result = simulateCatchHold({ ...base, coilCurrentA: base.coilCurrentA * scalar });
    return {
      scalar,
      coilCurrentA: result.input.coilCurrentA,
      coilFieldT: result.outputs.coilFieldT,
      forceMargin: result.outputs.forceMargin,
      stabilityIndex: result.outputs.stabilityIndex,
      holdEnergyKWh: result.outputs.holdEnergyKWh
    };
  });
}
