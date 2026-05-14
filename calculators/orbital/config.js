export const ORBITAL_CALCULATOR_CONFIG = Object.freeze({
  moduleId: 'calculator-orbital',
  route: '/operations/calculators/orbital',
  legacySourcePath: 'Calc; OM',
  title: 'Orbital Mechanics Calculator',
  shortTitle: 'ORB',
  subtitle: 'Keplerian propagation, J2 drift, transfer delta-v, comparison, and sweep screening',
  protocol: 'ACHILLES_PROTOCOL_v1.1',
  owner: 'Romer Industries / EMASSC',
  accent: '#4EC5C1',
  executionBoundary: 'Browser-side screening calculator. GMAT/API remains the verified propagation runner for mission-grade outputs.',
  bodies: Object.freeze({
    Earth: Object.freeze({ muKm3S2: 398600.4418, radiusKm: 6378.137, j2: 1.08262668e-3 }),
    Mars: Object.freeze({ muKm3S2: 42828.375214, radiusKm: 3396.19, j2: 1.96045e-3 }),
    Moon: Object.freeze({ muKm3S2: 4902.800066, radiusKm: 1737.4, j2: 2.032e-4 }),
    Sun: Object.freeze({ muKm3S2: 132712440041.93938, radiusKm: 695700, j2: 0 })
  }),
  defaultInputs: Object.freeze({
    body: 'Earth',
    useJ2: true,
    smaKm: 6778.137,
    ecc: 0,
    incDeg: 51.6,
    raanDeg: 0,
    argPeriapsisDeg: 0,
    trueAnomalyDeg: 0,
    durationSec: 86400,
    stepSec: 60,
    targetSmaKm: 42164,
    sweepVariable: 'altitudeKm',
    sweepStart: 300,
    sweepEnd: 40000,
    sweepSteps: 35
  }),
  presets: Object.freeze({
    LEO: Object.freeze({ label: 'LEO 400 km', body: 'Earth', smaKm: 6778.137, ecc: 0, incDeg: 51.6 }),
    MEO: Object.freeze({ label: 'MEO GNSS class', body: 'Earth', smaKm: 26578, ecc: 0, incDeg: 55 }),
    GEO: Object.freeze({ label: 'GEO', body: 'Earth', smaKm: 42164, ecc: 0, incDeg: 0 }),
    HEO: Object.freeze({ label: 'HEO 400 x 35786 km', body: 'Earth', smaKm: 24471.137, ecc: 0.7305, incDeg: 28.5 }),
    SSO: Object.freeze({ label: 'SSO screening', body: 'Earth', smaKm: 7078.137, ecc: 0.001, incDeg: 97.4 }),
    Molniya: Object.freeze({ label: 'Molniya', body: 'Earth', smaKm: 26600, ecc: 0.74, incDeg: 63.4 }),
    MarsLLO: Object.freeze({ label: 'Mars low orbit', body: 'Mars', smaKm: 3796.19, ecc: 0, incDeg: 30 })
  }),
  statusCards: Object.freeze([
    Object.freeze({ id: 'period', label: 'Period', unit: 'min' }),
    Object.freeze({ id: 'periapsis', label: 'Periapsis alt.', unit: 'km' }),
    Object.freeze({ id: 'apoapsis', label: 'Apoapsis alt.', unit: 'km' }),
    Object.freeze({ id: 'transferDv', label: 'Transfer dV', unit: 'm/s' })
  ])
});

export default ORBITAL_CALCULATOR_CONFIG;
