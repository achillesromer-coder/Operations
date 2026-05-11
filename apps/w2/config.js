// ============================================================
// MODULE: W2 GOS Luke II Catch/Hold Workspace
// FILE: config.js
// SYSTEM: Römer / EMASSC / Achilles
// PURPOSE: Central editable values for W2.
// ============================================================

export const MODULE_CONFIG = Object.freeze({
  moduleId: "operations-w2",
  workspaceId: "w2",
  workspaceCode: "W2",
  title: "W2 GOS Luke II Catch/Hold",
  subtitle: "Electromagnetic catch and hold system modelling.",
  legacySourcePath: "W2; GOS",
  route: "/operations/w2",
  dataRoute: "/w2/data",
  storageKey: "ri:operations:w2:catch-hold-results",
  draftKey: "ri:w2:draft",
  auditNamespace: "operations.w2",
  resultVersion: "w2.catch-hold-result.v1"
});

export const DEFAULT_FORM_VALUES = Object.freeze({
  scenario: "Luke II GEO rendezvous hold",
  targetMassKg: 1000,
  approachVelocityMS: 0.5,
  catchRadiusM: 50,
  holdForceN: 120,
  coilCurrentA: 850,
  coilTurns: 1200,
  coilRadiusM: 12,
  holdDurationHours: 24,
  safetyFactor: 1.5
});

export const WORKSPACE_LINKS = Object.freeze([
  { label: "W1", href: "/operations/w1" },
  { label: "W2", href: "/operations/w2", active: true },
  { label: "W3", href: "/operations/w3" },
  { label: "W4", href: "/operations/w4" },
  { label: "W5", href: "/operations/w5" },
  { label: "W6", href: "/operations/w6" },
  { label: "LIB", href: "/library", variant: "library" },
  { label: "W2 Dataspace", href: "/w2/data", variant: "dataspace" }
]);

export const STATUS_MODEL = Object.freeze({
  activeTasks: [
    { label: "EM coil configuration sweep — GEO rendezvous scenario", sub: "W2 Dataspace to EMFF catch simulation", status: "in-progress" },
    { label: "Hold force envelope validation at 850A coil current", sub: "Cross-ref W3 EMFF field power data", status: "in-progress" },
    { label: "Approach velocity constraint — 0.5 m/s rendezvous corridor", sub: "Awaiting W5 GMAT trajectory output", status: "blocked" }
  ],
  completions: [
    { label: "B-coil baseline measurement — rendezvous mode", sub: "Archived to W6 Asset Library", status: "complete" },
    { label: "Station-keep hold duration — 24hr test run", sub: "Results fed to W4 Supply Chain", status: "complete" }
  ],
  queued: [
    { label: "Multi-body capture sequence — 3 asteroid approach", sub: "Awaiting W1 deposit target list", status: "queued" }
  ],
  log: [
    { date: "24 Feb 26", message: "W2 to W4 hold data forwarded" },
    { date: "23 Feb 26", message: "Coil config v3 validated" },
    { date: "22 Feb 26", message: "W3 EMFF field config received" },
    { date: "21 Feb 26", message: "W1 deposit target data ingested" },
    { date: "20 Feb 26", message: "GMAT trajectory request sent to W5" },
    { date: "18 Feb 26", message: "INIT W2 Luke II workspace activated" }
  ]
});
