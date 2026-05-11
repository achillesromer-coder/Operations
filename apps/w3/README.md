# W3 — Resonant Mining Systems (RMS)

Legacy source: `W3; RMS`

This module extracts the W3 Squarespace monolith into a LightSpeed-compatible Operations workspace.

## Scope

- RFS/EMFF formation-field screening
- Three-node phase-offset modelling with 120 degree baseline symmetry
- Power, duty-cycle, field-coupling, and resonance-efficiency sensitivity screening
- JSON export for W3 Dataspace and downstream W6 asset-library ingestion

## Files

- `config.js` — module identity, route metadata, default input set, status card definitions
- `calculations.js` — pure deterministic screening functions for RMS/RFS/EMFF trade studies
- `view.js` — DOM rendering and scoped styles
- `events.js` — form binding, local persistence, JSON export, audit hooks
- `index.js` — LightSpeed mount entrypoint

## Integration notes

W3 consumes W5 mission/orbital context and W6 power/asset specifications, then provides RMS/EMFF readiness outputs to W1, W2, and W4. The calculation layer is intentionally browser-safe and deterministic; laboratory calibration and GMAT/API execution remain separate validation layers.
