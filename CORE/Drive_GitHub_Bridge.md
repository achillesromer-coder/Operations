# Operations Bridge

Status: ACTIVE
Updated: 2026-07-03

## Current authority split

| Surface | Role |
|---|---|
| GitHub Operations | Primary Git operating and control surface. |
| Google Drive | Context, source library, workbook carrier and evidence store. |
| Local LightSpeed | Build and runtime operating surface. |
| LightSpeed Go | Operator-facing app lane. |
| GitHub Data | Public-safe schema and catalogue lane. |
| GitHub Raphael | Raphael / N3 / GeoMatrices lane. |
| GitHub Romer-MPL | MPL and GMAT side lane. |

## CORE clarification

CORE was used as the Drive consolidation target and naming convention. In GitHub, Operations is the operating surface. Do not create parallel task systems just to mirror Drive copies.

## Current rule

Read internal repo files before writing. Prefer updating existing control files over adding new files. Keep Drive as context, local as operating, Git as authoritative repo control, and Go as operator lane.

## Current Operations priority

1. Inspect W1-W6, calculators and simulators.
2. Identify placeholders, stale labels, route mismatches and unsupported status text.
3. Update existing files only when enough context is present.
4. Wait on root README dashboards until Codex finishes the local C-drive inventory pass.
5. Keep DeSporte on hold.

## Known blockers

- Codex is still working through local inventory and migration.
- LightSpeed repo authority must be reconciled between local NCNBOUWER/LightSpeed and connector-visible achillesromer-coder/LightSpeed.
- Open scaffold PRs need internal review before merge or closure.
