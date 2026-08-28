# Operations ACHILLES Orchestration

This is the existing bounded orchestration marker for the Operations repository. It does not establish a second task system, data master or source of engineering truth.

## Role

Operations owns the operator-facing integration view for current programme state: workspaces, calculators/simulators, task/readiness surfaces and handoffs to LightSpeed/Cognigrex and owning Type-1/project canon.

Achilles P.A and ACR3 govern cross-corpus authority, reconciliation, gates and durable receipts. Domain workbooks own their detailed state. Git owns implementation, interface contracts and reproducible lineage.

## Rules

- Edit/reuse existing workspace, calculator and simulator implementations before creating replacements.
- Treat the W1–W6 map as an interface/routing contract, not proof that every route is deployed.
- Use stable pointers and receipted interfaces to Data/Drive owners rather than copying canonical datasets into Operations.
- Preserve source/model/version, units, assumptions, uncertainty and evidence state through calculator/simulator handoffs.
- Keep software/model success distinct from physical, regulatory and professional validation.
- Archive/delete only after extraction, reference, canonical-destination/readback and recovery gates.
