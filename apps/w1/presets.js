// ============================================================
// MODULE: W1 Deposit Analysis / Capture Workspace
// FILE: presets.js
// PURPOSE: Editable physics, material, station, and sweep presets.
// NOTE: Browser calculations are conceptual screening tools, not GMAT execution.
// ============================================================

export const PHYSICS_CONSTANTS = Object.freeze({
  muEarthM3S2: 3.986004418e14,
  earthRadiusM: 6.371e6,
  rho0KgM3: 1.225,
  reentryVelocityFactor: 0.2,
  eddyDragCoefficient: 0.75,
  captureEfficiency: 0.7,
  noseRadiusM: 0.5,
  heatingCoefficient: 1e-4,
  standardGravityMSS: 9.80665
});

export const METALS = Object.freeze({
  gold: {
    label: "Gold",
    densityKgM3: 19320,
    conductivitySM: 4.10e7,
    meltingPointK: 1337,
    valueAudKg: 65000
  },
  silver: {
    label: "Silver",
    densityKgM3: 10490,
    conductivitySM: 6.30e7,
    meltingPointK: 1235,
    valueAudKg: 800
  },
  platinum: {
    label: "Platinum",
    densityKgM3: 21450,
    conductivitySM: 9.43e6,
    meltingPointK: 2041,
    valueAudKg: 30000
  },
  palladium: {
    label: "Palladium",
    densityKgM3: 12023,
    conductivitySM: 9.50e6,
    meltingPointK: 1828,
    valueAudKg: 25000
  },
  rhodium: {
    label: "Rhodium",
    densityKgM3: 12410,
    conductivitySM: 2.40e6,
    meltingPointK: 2237,
    valueAudKg: 45000
  },
  neodymium: {
    label: "Neodymium",
    densityKgM3: 7010,
    conductivitySM: 1.60e6,
    meltingPointK: 1297,
    valueAudKg: 100
  },
  lithium: {
    label: "Lithium",
    densityKgM3: 534,
    conductivitySM: 1.08e7,
    meltingPointK: 454,
    valueAudKg: 80
  }
});

export const STATIONS = Object.freeze({
  small: {
    label: "Research Station",
    areaM2: 50,
    captureDistanceM: 100,
    baseFieldT: 2,
    powerMW: 50,
    successBonus: 0.8
  },
  "medium-large": {
    label: "Commercial Station",
    areaM2: 300,
    captureDistanceM: 500,
    baseFieldT: 5,
    powerMW: 300,
    successBonus: 0.9
  },
  generational: {
    label: "Industrial Station",
    areaM2: 1000,
    captureDistanceM: 1000,
    baseFieldT: 10,
    powerMW: 1000,
    successBonus: 0.95
  }
});

export const ATMOSPHERE_LAYERS = Object.freeze([
  { z0M: 0, z1M: 12000, scaleHeightM: 8500, densityFactor: 1 },
  { z0M: 12000, z1M: 50000, scaleHeightM: 7000, densityFactor: 0.1 },
  { z0M: 50000, z1M: 700000, scaleHeightM: 20000, densityFactor: 1e-3 }
]);

export const PRESET_SCENARIOS = Object.freeze({
  gold: {
    project: "Gold Standard Capture Study",
    metal: "gold",
    massKg: 1000,
    altitudeKm: 15000,
    station: "medium-large",
    safetyFactor: 1.5
  },
  platinum: {
    project: "Platinum Heavy Capture Study",
    metal: "platinum",
    massKg: 2500,
    altitudeKm: 12000,
    station: "generational",
    safetyFactor: 1.8
  },
  "rare-earth": {
    project: "Rare Earth Capture Study",
    metal: "neodymium",
    massKg: 5000,
    altitudeKm: 9000,
    station: "medium-large",
    safetyFactor: 1.4
  }
});

export const VALIDATION_LIMITS = Object.freeze({
  minMassKg: 0.1,
  maxMassKg: 100000,
  minAltitudeKm: 100,
  maxAltitudeKm: 40000,
  minSafetyFactor: 1.0,
  maxSafetyFactor: 5.0,
  minSweepSteps: 5,
  maxSweepSteps: 50
});
