# Achilles Tasks

Status: ACTIVE
Updated: 2026-07-03
Authority: Operations control / Achilles audit

## ACH-0001 — Drive carrier extraction and Git operations alignment

Status: ACTIVE / EXTRACTION-FIRST
Priority: P0

### Current authority clarification

Drive remains context and evidence carrier. GitHub Operations is the current Git control surface. Local LightSpeed is the operating/build surface. LightSpeed Go is the operator app lane.

CORE was useful as the Drive consolidation target. In GitHub, do not create extra task systems just to mirror Drive copies.

### Current evidence base

- `CORE/Drive_GitHub_Bridge.md` records the current Operations bridge.
- `CORE/GITHUB_ALIGNMENT_HANDOFF_2026_07_03.md` records the first GitHub mapping pass.
- Operations root contains W1-W6 route widgets, calculators and simulator surfaces.
- Codex local inventory is still running and must remain the source for local build readiness.

### Required extraction targets

1. Operations control files for Git-facing authority and handoffs.
2. Operations route/widget files for public-safe route proof candidates.
3. Data repo for schema/catalogue outputs after review.
4. Local Codex result packets for build, storage, route and secrets proof.
5. Completed ledgers only after proof is recorded.

### Hard gates

- Read internal files before editing.
- Prefer updating existing files over adding new files.
- Do not merge or close PRs before a complete internal pass.
- Do not treat old task files as final truth without source review.
- Keep DeSporte on hold.

### Current blocker register

- Codex C-drive inventory/migration is still in progress.
- LightSpeed repo authority needs reconciliation between local `NCNBOUWER/LightSpeed` and connector-visible `achillesromer-coder/LightSpeed`.
- Operations route widgets contain route/status labels that need proof against local/web route checks.
- Root README dashboards are waiting.

### Safe next Achilles action

Continue the Operations internal pass:

1. Review remaining W, calculator and simulator files.
2. Record placeholders, route mismatches and status labels.
3. Wait for Codex local proof before public/build/launch decisions.
4. Keep commits limited to existing control-file updates unless a complete pass justifies more.
