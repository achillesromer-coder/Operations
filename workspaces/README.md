# Operations Workspace Interface Map

The W1–W6 structure is an operator-facing routing/interface map. A listed workspace name or route is not, by itself, proof that the route is deployed, complete or canonical for the underlying technical data.

## Workspace classes

- `w1-incoming-deposit-analysis/` → `/operations/w1`
- `w2-luke-catch-hold/` → `/operations/w2`
- `w3-rfs-emff/` → `/operations/w3`
- `w4-supply-chain-trajectory/` → `/operations/w4`
- `w5-mission-planning-gmat-mpl/` → `/operations/w5`
- `w6-asset-library-publication/` → `/operations/w6`

## W5 integration boundary

W5 is the operator integration surface for mission-planning outputs, receipted GMAT exports and Romer-MPL Maximum Probable Loss/risk results. GMAT propagation, MPL methodology and other specialist calculators remain distinct models with separate provenance and validation gates.

## Data/canon rule

A workspace should point to or consume the current owning Data/Drive/Type-1/project source through a stable, receipted interface. Do not duplicate the underlying canonical dataset merely to populate a workspace. When a corresponding Data route does not exist or is not current, mark the dependency explicitly rather than fabricating a live backend.
