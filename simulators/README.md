# Operations Simulator Interfaces

This directory describes bounded simulator integration classes for Operations. It does not make Operations the canonical physics/model owner and does not imply that a listed simulator is deployed or empirically qualified.

## Capability classes

- `rfs-extraction/` — RFS screening/test/sweep interfaces routed to the owning RFS/EMFF evidence and twin lanes;
- `emff-node/` — bounded EMFF node/field scenario interfaces;
- `emf-fields/` — electromagnetic-field analysis interfaces using explicit geometry/material/control assumptions;
- `re-entry/` — mission/re-entry analysis interface consuming validated external/mission model inputs where required.

## Contract

- Reuse existing LightSpeed, Romer-MPL, specialist twin, GMAT or other validated model surfaces rather than cloning them into Operations.
- Operations receives compact scenario/result receipts and exposes operator controls/status.
- Preserve model/version, configuration, units, assumptions, uncertainty, evidence state and reproducibility pointers.
- Keep simulation evidence distinct from empirical performance, safety qualification, mission feasibility and regulatory acceptance.
