# W6 Platform Asset Library

**Module:** `operations-w6`  
**Workspace:** `W6`  
**Route:** `/operations/w6`  
**Protocol:** `ACHILLES_PROTOCOL_v1.1`

## Purpose

W6 is the platform and asset-readiness layer for the Operations stack. It provides a browser-safe screening workspace for Mark, Luke, Solar Hull, Free Flow, RFS, and EMFF platform records before those records are consumed by mission planning, MPL publishing, Data dashboards, or local GMAT bridge execution.

## Extraction note

The legacy Operations topology referenced a `W6: PAL` / `W6 PAL` workspace, but the exact legacy file was not returned by the GitHub contents lookup. This module therefore preserves the W1-W5 modular architecture and implements W6 as the inferred **Platform Asset Library** required to close the Operations sequence.

## Files

- `config.js` — route metadata, default platform inputs, dependencies, display cards.
- `calculations.js` — deterministic power, endurance, readiness, DTS, and asset-record calculations.
- `view.js` — DOM rendering and table layout for the asset library.
- `events.js` — local state, audit events, JSON export, and asset-record creation.
- `index.js` — public mount entrypoint.

## Data flow

```text
W3 subsystem demand + W4 logistics + W5 GMAT mission contract
  -> W6 platform readiness screen
  -> asset record JSON
  -> Data / MPL / LocalBridge ingestion
```

## Execution boundary

W6 does not control hardware and does not execute GMAT. It produces auditable asset-readiness records and DTS proxies. GMAT execution remains behind W5 job contracts and the controlled LocalBridge/server runner boundary.

## Audit events

- `workspace.w6.mounted`
- `workspace.w6.screened`
- `workspace.w6.asset_record_built`
- `workspace.w6.exported`
- `workspace.w6.reset`
- `workspace.w6.unmounted`
