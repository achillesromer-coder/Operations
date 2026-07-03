# GitHub Alignment Handoff — 2026-07-03

Status: active Operations pass.

## Decisions recorded

- GitHub Operations is the current Git control surface.
- Drive is context and source evidence.
- Local LightSpeed is the build surface.
- LightSpeed Go is the operator app lane.
- README dashboards wait until Codex completes local inventory.
- Do not mirror Drive copy sprawl into Git.

## Repositories visible

| Repo | Role |
|---|---|
| `NCNBOUWER/Raphael` | Raphael and continuity records. |
| `NCNBOUWER/Platform.CCC` | CCC scaffold; root README exists. |
| `achillesromer-coder/LightSpeed` | LightSpeed mirror candidate. |
| `achillesromer-coder/Operations` | Current Git control surface. |
| `achillesromer-coder/Data` | Public-safe data and schema lane. |
| `achillesromer-coder/Romer-MPL` | MPL and GMAT side lane. |

## Open issues observed

- `NCNBOUWER/Raphael#2` — ACR3 cross-agent closure handoff.
- `achillesromer-coder/Operations#2` — operations route integration.
- `achillesromer-coder/Data#2` — public-safe schema subset.

## Open PRs observed

- `NCNBOUWER/Raphael#1` — connector retry note.
- `achillesromer-coder/Operations#3` — operations workspace shell.
- `achillesromer-coder/Data#3` — source-status scaffold.
- `achillesromer-coder/LightSpeed#1` — LightSpeed scaffold.
- `achillesromer-coder/Data#1` — Data scaffold.
- `achillesromer-coder/Romer-MPL#1` — Romer-MPL scaffold.
- `achillesromer-coder/Operations#1` — Operations scaffold.

## Operations files inspected in this pass

`CORE/Drive_GitHub_Bridge.md`, `Agents/Achilles/Achilles_Tasks.md`, `Agents/Neo/Neo_Tasks.md`, `Agents/Oracle/Oracle_Tasks.md`, `W1; IDA`, `W2; GOS`, `W4; SCS`, `W5; MOP`, `W6: PAL`, `Calc; LW`.

## Finding

Operations contains root-level static route widgets and calculators. Several contain status labels, route links and dataspace references. Treat those as route-proof candidates until Codex local proof confirms them.

## Next action

Continue the Operations internal pass. Wait on README dashboards and merge decisions until local inventory is complete and more root files have been reviewed.
