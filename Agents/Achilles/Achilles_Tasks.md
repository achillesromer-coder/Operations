# Achilles Tasks

Status: ACTIVE
Date: 2026-07-01
Authority: CORE / Achilles continuity audit

## ACH-0001 — Extract OPEN_TASKS and prior carriers into CORE

CORE link: CORE-0001
Status: ACTIVE / EXTRACTION-FIRST
Priority: P0

### Purpose

Assimilate actionable tasks, stale rows, blockers, continuation logic, source-carrier references and owner-decision requirements from legacy OPEN_TASKS files, prior logs, handoff registers, ZIP/package registers, Drive registers and older task files into CORE before any downstream divvy or completed-ledger migration.

### Current evidence base

- GitHub bridge confirms CORE replaces OPEN_TASKS as canonical task/index authority.
- GitHub bridge confirms Drive remains source-carrier/canonical storage while GitHub is execution bridge.
- Google Drive search finds active OPEN_TASKS workbook carriers and ACR3 consolidation/handoff registers.
- Neo task ledger is branch-visible and correctly blocked until CORE-0001 is complete.

### Required extraction targets

1. CORE.xlsx / CORE Entries.md as active intake and dependency index.
2. Achilles Oversight.xlsx for governance, blockers, owner-decision flags and deletion/publication gates.
3. Neo Oversight.xlsx for post-CORE divvy readiness only.
4. Relevant agent Tasks.md ledgers only after CORE provenance and route assignment exist.
5. Completed ledgers only after extraction proof, route proof and completion proof exist.

### Hard gates

- Do not treat OPEN_TASKS as master.
- Do not move rows to completed until CORE population and direction are stable.
- Do not delete or archive-finalize without extraction proof, checksum/classification where applicable, canonical placement comparison and owner approval.
- Preserve six-domain brackets separately from floor-agent operators.
- Z/floor ambiguity escalates to Neo; Neo/Athene ambiguity escalates to Achilles; Achilles ambiguity escalates to owner.

### Current blocker register

- CORE_Entries.md is not yet branch-visible at the expected path during this audit.
- Achilles_Tasks.md was missing at the expected path before this additive creation.
- Legacy OPEN_TASKS workbook(s), CL3 open task queue, ACR3 consolidation register, ACR3 handoff and Drive Alignment Map require row-level extraction into CORE.
- Completion-ledger migration remains blocked until CORE population is verified.

### Safe next Achilles action

Continue source-carrier-first extraction pass in this order:

1. ACR3 consolidation register.
2. ACR3 chat closure handoff.
3. Drive Alignment Map.
4. OPEN_TASKS workbook duplicates.
5. CL3 build/open task queue.
6. ZIP/check/archive registers.
7. Agent landing files and oversight workbooks.

Record every imported item with source title, source URL/ID where available, destination lane, owner-decision flag, blocker state and completed-ledger eligibility.
