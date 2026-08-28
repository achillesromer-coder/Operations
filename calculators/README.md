# Operations Calculator Interfaces

This directory is the bounded Operations integration surface for decision-useful calculators. The listed classes are routing/interface targets, not a claim that each calculator is already implemented, validated or canonical here.

## Capability classes

- `orbital-mechanics/` — consumes governed mission/orbital inputs or specialist model outputs;
- `launch-windows/` — consumes receipted trajectory/event/window outputs rather than inventing mission dynamics;
- `magnetostatics/` — bounded electromagnetic calculations with source geometry/material/control inputs;
- `energy-power/` — power/energy budgets and comparison models with explicit assumptions;
- `fluid-dynamics/` — bounded flow calculations where an identified model/method is appropriate.

## Contract

- Prefer existing calculators in LightSpeed, Romer-MPL, specialist twins or other controlling tools and expose them here by interface/reference when appropriate.
- Do not fork an existing validated calculator merely to fit the Operations workspace.
- Every result used operationally must retain model/version, inputs, units, assumptions, uncertainty/evidence state and source receipt.
- Model output does not become physical or regulatory validation without its independent gate.
