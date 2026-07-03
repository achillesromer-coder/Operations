# GitHub Alignment Handoff — 2026-07-03

Status: active non-destructive mapping pass.

## Current authority

Drive CORE remains canonical. GitHub is the execution and documentation layer. Older task files, logs and handoff notes are source inputs until extracted into CORE or agent ledgers.

## Repositories visible in this pass

| Repo | Role | Access | State |
|---|---|---:|---|
| `NCNBOUWER/Raphael` | Raphael and Achilles continuity records | admin/push | Many continuity deltas; extract before adding more sprawl. |
| `NCNBOUWER/Platform.CCC` | CCC scaffold | admin/push | Root README exists. |
| `achillesromer-coder/LightSpeed` | LightSpeed GitHub scaffold/mirror | push/triage | Needs authority check against local Codex remote `NCNBOUWER/LightSpeed`. |
| `achillesromer-coder/Operations` | CORE and operations bridge | push/triage | Best current cross-repo handoff repo. |
| `achillesromer-coder/Data` | Public-safe data/schema lane | push/triage | Has public schema issue/PR queue. |
| `achillesromer-coder/Romer-MPL` | MPL/GMAT side lane | push/triage | Keep separate unless promoted. |

## Open issues observed

- `NCNBOUWER/Raphael#2` — ACR3 cross-agent closure handoff.
- `achillesromer-coder/Operations#2` — prepare operations route integration.
- `achillesromer-coder/Data#2` — prepare public-safe schema subset.

## Open PRs observed

- `NCNBOUWER/Raphael#1` — Achilles connector retry note.
- `achillesromer-coder/Operations#3` — Drive dossier operations workspace shell.
- `achillesromer-coder/Data#3` — Drive dossier source-status scaffold.
- `achillesromer-coder/LightSpeed#1` — LightSpeed orchestration scaffold.
- `achillesromer-coder/Data#1` — Data orchestration scaffold.
- `achillesromer-coder/Romer-MPL#1` — Romer-MPL orchestration scaffold.
- `achillesromer-coder/Operations#1` — Operations orchestration scaffold.

## Rich-view status

Root README was directly observed only in `NCNBOUWER/Platform.CCC`. Direct root README fetches for Raphael, LightSpeed, Operations, Data and Romer-MPL did not return a file in this pass. Recommended next Git step is small additive README dashboards after repo authority is confirmed.

## Questions before write/merge work

1. Is local Codex `NCNBOUWER/LightSpeed` the authoritative LightSpeed repo, or is `achillesromer-coder/LightSpeed` the mirror/target?
2. Should `achillesromer-coder/Operations` be the canonical Git control layer for CORE handoffs?
3. Should README dashboards be added now, or wait until Codex finishes the local C-drive inventory and authority packet?
4. Which scaffold PRs are current, and which are superseded by the Drive handover?

## Safe next action

Do not merge, deploy, or restructure from this connector pass. Next pass should review PRs against Drive CORE and the Codex local audit packet, then add only small dashboard/index files if approved.
