// ============================================================
// MODULE: W1 Deposit Analysis / Capture Workspace
// FILE: config.js
// SYSTEM: Römer / EMASSC / Achilles
// PURPOSE: Central editable values for the W1 workspace module.
// ============================================================

export const MODULE_CONFIG = Object.freeze({
  moduleId: "operations-w1",
  workspaceId: "w1",
  workspaceCode: "W1",
  title: "W1 Incoming Deposit Analysis",
  subtitle: "Ore body characterisation, capture feasibility and resource modelling.",
  legacySourcePath: "W1; IDA",
  route: "/operations/w1",
  dataRoute: "/operations/w1/data",
  storageKey: "ri:operations:w1:capture-results",
  draftKey: "ri:w1:draft",
  sweepKey: "ri:operations:w1:sweep-results",
  auditNamespace: "operations.w1",
  chartJsUrl: "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js",
  enableCharts: true,
  enableLocalStorage: true,
  enableSessionDraft: true,
  enableSheetsQueue: false,
  enableDebugPanel: false,
  resultVersion: "w1.capture-result.v1"
});

export const ROUTES = Object.freeze({
  workspace: "/operations/w1",
  dataspace: "/operations/w1/data",
  w2: "/operations/w2",
  w3: "/operations/w3",
  w4: "/operations/w4",
  w5: "/operations/w5",
  w6: "/operations/w6",
  library: "/library",
  gmat: "/gmat",
  mpl: "/mpl"
});

export const WORKSPACE_LINKS = Object.freeze([
  { label: "W1", href: ROUTES.workspace, active: true },
  { label: "W2", href: ROUTES.w2 },
  { label: "W3", href: ROUTES.w3 },
  { label: "W4", href: ROUTES.w4 },
  { label: "W5", href: ROUTES.w5 },
  { label: "W6", href: ROUTES.w6 },
  { label: "LIB", href: ROUTES.library, variant: "library" },
  { label: "W1 Dataspace", href: ROUTES.dataspace, variant: "dataspace" }
]);

export const DEFAULT_FORM_VALUES = Object.freeze({
  project: "Orbital Mining Study",
  metal: "gold",
  massKg: 1000,
  altitudeKm: 15000,
  station: "medium-large",
  safetyFactor: 1.5,
  sweepVar: "mass",
  sweepMin: -0.5,
  sweepMax: 0.5,
  sweepSteps: 21
});

export const STATUS_MODEL = Object.freeze({
  activeTasks: [
    { label: "EM sweep — Asteroid 2024 XR3 deposit mapping", sub: "W1 Dataspace → Luke IV module", status: "in-progress" },
    { label: "Pareto optimisation of ring/module configurations", sub: "Variable compound analysis sweep", status: "in-progress" },
    { label: "B-field surface calibration at GEO altitude", sub: "Dipole model vs observational set", status: "blocked" }
  ],
  completions: [
    { label: "Initial deposit characterisation — 16 Psyche preset", sub: "Archived to W6 Asset Library", status: "complete" },
    { label: "Trajectory arc validation — GEO release scenario", sub: "Cross-checked with W5 GMAT output", status: "complete" },
    { label: "Iron volume sweep across Ryugu / Bennu presets", sub: "Pattern simplification tool run", status: "complete" }
  ],
  queued: [
    { label: "Large-scale optimisation — ring count 1–8 full sweep", sub: "Pending W3 EMFF power data", status: "queued" },
    { label: "Widen search — extend target asteroid database", sub: "Pending W5 orbital windows", status: "queued" }
  ],
  log: [
    { date: "24 Feb 26", message: "W1→W2 deposit package sent to Luke II" },
    { date: "24 Feb 26", message: "Dataspace updated — v1.1.0 deployed" },
    { date: "23 Feb 26", message: "SWEEP variable compound analysis completed — 48 scenarios" },
    { date: "22 Feb 26", message: "W1→W4 resource model forwarded to supply chain" },
    { date: "21 Feb 26", message: "16 Psyche preset calibration completed" },
    { date: "20 Feb 26", message: "GMAT orbital window received from W5" },
    { date: "19 Feb 26", message: "RFS field power config received from W3" },
    { date: "18 Feb 26", message: "INIT W1 deposit analysis activated" }
  ]
});
