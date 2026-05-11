# W5 · Mission Planning GMAT

W5 extracts the legacy `W5; MOP` Squarespace block into a modular Operations workspace for mission template screening and GMAT job-contract staging.

## Scope

- Route: `/operations/w5`
- Dataspace route: `/w5/data`
- Legacy source: `W5; MOP`
- Protocol: `ACHILLES_PROTOCOL_v1.1`
- Owner: Romer Industries / EMASSC

## Module files

| File | Responsibility |
| --- | --- |
| `config.js` | Route metadata, default mission input values, status cards, dependencies. |
| `calculations.js` | Mission input normalization, dV closure, propagation-step estimates, DTS proxy, GMAT job-contract assembly. |
| `view.js` | DOM rendering for mission inputs, closure cards, departure-window sweep, and GMAT job preview. |
| `events.js` | Local state, form binding, audit calls, JSON export, local GMAT job queue staging. |
| `index.js` | Public mount entrypoint for the LightSpeed wrapper. |

## Execution boundary

The browser workspace does not execute GMAT. It produces deterministic job packets that can be submitted to a local bridge or controlled server-side runner. This keeps the public wrapper thin and prevents uncontrolled browser-side mission execution.

## GMAT alignment

The generated job request carries the core GMAT execution concepts used by the local runner:

- spacecraft state and mass model
- force-model descriptor
- propagator/integrator descriptor
- propagation duration and reporting cadence
- outputs requested: `stateHistory`, `reportFile`, `gmatScript`, `summaryJson`

The GMAT API material identifies Spacecraft, ForceModel, Integrator, and Propagator objects as the key propagation objects, so W5 expresses those as a transport contract rather than direct API calls inside the website layer.

## Data flow

```text
W1/W2/W4 mission and supply inputs
  ↓
W5 mission template + dV closure + departure sweep
  ↓
GMAT job request packet
  ↓
LocalBridge / controlled runner
  ↓
GMAT R2025a output summary
  ↓
W6 asset library + MPL visualisation + Data audit
```

## Audit events

- `workspace.w5.mounted`
- `workspace.w5.screened`
- `workspace.w5.gmat_job_queued`
- `workspace.w5.exported`
- `workspace.w5.reset`

## Next hardening pass

- Replace placeholder force-model strings with validated templates.
- Add a shared `gmat-job.schema.json` validator from LightSpeed contracts.
- Add LocalBridge submission adapter once the server-side GMAT runner is available.
