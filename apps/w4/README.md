# W4 Supply Chain & Trajectory

**Legacy source:** `W4; SCS`  
**Module ID:** `operations-w4`  
**Route:** `/operations/w4`  
**Protocol:** `ACHILLES_PROTOCOL_v1.1`

W4 is the logistics and trajectory-corridor screening workspace for the Operations module set. It converts transfer, cadence, payload, propellant, node-reliability, supply-buffer, return-mass, risk, and carbon-cost inputs into a compact decision packet for interplanetary supply-chain planning.

## Extracted module files

| File | Purpose |
| --- | --- |
| `config.js` | Workspace metadata, defaults, status-card definitions, and integration pointers. |
| `calculations.js` | Deterministic SCS calculations: wet mass, payload throughput, network reliability, logistics risk, carbon intensity, and DTS proxy. |
| `view.js` | Squarespace-safe DOM renderer, styles, result packet view, and cadence-sweep table. |
| `events.js` | Input collection, state restoration/persistence, simulation execution, audit hook, reset, and JSON export. |
| `index.js` | Public `mountOperationsW4(target, ctx)` entry point for the LightSpeed shared loader. |

## Integration position

W4 consumes:

- W1 extraction feasibility and target material context.
- W5 mission-orbit planning outputs and transfer assumptions.
- W6 power, asset, and platform specifications.

W4 produces:

- Corridor logistics decision packets.
- Cadence sensitivity rows.
- Carbon-per-payload and risk-index proxies.
- DTS-compatible readiness score for downstream Achilles/Data dashboards.

## Notes

This module is an extracted front-end screening layer only. It does not execute GMAT. GMAT execution should remain behind the LocalBridge or a controlled server runner using the shared GMAT job contract.