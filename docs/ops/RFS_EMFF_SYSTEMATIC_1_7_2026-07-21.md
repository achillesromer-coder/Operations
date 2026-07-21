# RFS / EMFF systematic lanes 1–7

Status: controlled internal, in progress. This document is the Operations/CORE orchestration surface; it does not replace the RFS & EMFF Twin, the Free Flow Solenoid Stack Twin, or the Cognigrex/Data physics library.

## Authority and routing

- Digital Twin Suite: what is canon for the system and its specialised results.
- Cognigrex/Data physics library: overarching RFS/EMFF physics, equations, applicability and reusable models.
- LightSpeed: executable validators and route-facing software.
- Neo: normalises accepted result packets and returns them to CORE and the owning Twins.
- Achilles: evidence, conflict, publication, archive and deletion gates.
- Oracle: independent reasoning review.
- Smith: executable checks and repeatable queues.
- Raphael Equations: independent personal-IP source lens, never silently merged.
- N^3 / GeoMatrices: separate package boundary.
- MPL: Maximum Probable Loss, routed to `https://romer.industries/MPL`; not the Romer-MPL/N^3 repository collision.

## Retained empirical observation

The owner reports that magnetic and cymatic board tests caused metal particles to move through the remainder of the medium and that the path could be traced as pushed or pulled in the desired direction.

Evidence state: `OBSERVED_QUALITATIVE`.

Missing: apparatus identity, date/time, sample composition, particle distribution, medium properties, board geometry, drive frequency, amplitude, waveform, duration, field strength/gradient, power, calibration, control runs, raw logs, uncertainty and repeat count.

Therefore no extraction rate, enrichment, purity, threshold, optimal frequency, force, throughput, efficiency or equipment-safety value may be inferred.

## Lane 1 — source and parameter population

1. Capture POC lineage, older RFS/EMFF chats, Drive sources and legacy code with source IDs.
2. Populate explicit parameter fields for drive, board/medium, particle, coil/field and measured outputs.
3. Use `SOURCE_GAP` or `UNRECORDED_EMPIRICAL`; do not insert guessed defaults into evidence rows.
4. Route reusable physics to Data/Cognigrex and specialised values to the owning Twins.

## Lane 2 — epistemic separation

Every value or statement is assigned one state: observed qualitative, measured, calculated screening, modelled screening, proposed, empirically verified, rejected, superseded or held. Conflicting values remain in reconciliation history.

## Lane 3 — equations, units and falsification

Allowed screening relations include angular frequency, sinusoidal acceleration, particle mass, inertial force, long-solenoid field, linear-susceptibility gradient force, low-Re Stokes drag and conductor skin depth. Each result carries SI units, assumptions, uncertainty, applicability limits and a falsification criterion.

## Lane 4 — dual verification

- Mathematical audit checks dimensions, domains, finite outputs and model applicability.
- Oracle independently reviews boundary conditions, alternative causes, applicability and logical sufficiency.
- Controlled-canon eligibility requires empirical verification or both mathematics and independent reasoning.
- Physical-capability language remains blocked until instrumented raw logs, passed controls and at least two repeats exist.

## Lane 5 — Neo return packet

Neo receives a structured packet containing source IDs, inputs, units, equations, outputs, uncertainty, test status, conflicts, rejected values and destination Twins. Neo updates CORE only after the relevant gate passes and retains the rejected/superseded history.

## Lane 6 — held population fields

Collaborators and Mission 1 values remain `HELD`. The field structures may be prepared, but named people, commitments, mission performance and deployment values are not populated until the terrestrial evidence and owner gates are satisfied.

## Lane 7 — consolidation, archive and deletion controls

- Compare older and newer sources before promotion.
- Archive only after useful extraction and retained-copy proof.
- Record hash, source path, destination, reference scan and recovery path.
- Slack is chronology and handoff evidence, not sole canon.
- No Slack, Drive or Git deletion occurs from this lane without an approved deletion list.

## Test register and receipts

| Test | State | Result |
|---|---|---|
| Qualitative observation retention | PASS | Retained without claim promotion |
| RFS first-order calculation | PASS | SI calculation and math gate behaved as designed |
| Zero-amplitude control | PASS | Zero inertial force |
| Zero-gradient control | PASS | Zero magnetic force |
| Negative-input rejection | PASS | Invalid input rejected |
| Short-coil applicability | PASS | Reasoning gate blocked |
| Empirical promotion requirements | PASS | Requires repeats, controls, instrumentation and raw logs |

Local executable suite: 7/7 tests passed, no external dependencies.

Data/Cognigrex review: `achillesromer-coder/Data` draft PR #6.

LightSpeed executable review: `achillesromer-coder/LightSpeed` draft PR #14.

## Current cross-system receipts

- The live LinkDrive/DataIndex workbook now contains `18_RFS_EMFF_Systematic_1_7` and TASK-036 through TASK-042.
- The retained Slack ACR3 handoff canvas contains the review links, test receipt, Twin-sync blocker and purge hold.
- Local RFS/EMFF and Solenoid working copies contain specialised parameter/evidence, equation/test and routing/reconciliation sheets.
- Those local Office working copies are `FORMAT_REVIEW_REQUIRED`: the available editor warned that unsupported workbook extensions and conditional-format features may be removed. They are not Drive authorities and were not uploaded as parallel masters.

## Legacy quarantine

The legacy LightSpeed RFS theory and runner are preserved. Unsourced material resonance tables, claimed empirical extraction-energy relationships, assumed extraction efficiency/rate, equipment-safety threshold and ROI/value outputs are marked `LEGACY_UNVERIFIED` until source, dimensional and empirical review succeeds. They are not deleted and are not accepted as canon by this run.

## MPL code-authority result

- The five connected GitHub repositories are Raphael, Romer-MPL, LightSpeed, Operations and Data.
- Searches found no source match for `Maximum Probable Loss` or `probable loss` in the connected application repositories.
- The current LightSpeed public-route manifests do not contain an `/MPL` implementation route.
- `achillesromer-coder/Romer-MPL` contains the `N3_Trinity_Probability_Well_v1_1` package and is therefore explicitly excluded from Maximum Probable Loss code changes.
- Operational MPL code authority remains `SOURCE_GAP`. No code was created or modified under the wrong repository.

## Current blockers

- Instrumented test records do not yet exist.
- Exact POC page/section provenance and all oldest-chat deltas still require source-level extraction.
- RFS & EMFF and Free Flow Solenoid Stack specialised working copies exist locally, but in-place Drive sync is blocked by Office-file write support/authorization and package-level format-preservation review.
- Twin Master raw XLSX replacement path remains connector-blocked; validated candidate exists locally.
- Slack authority markers are present, but the message-level retention manifest, reference scan and recovery proof remain incomplete; purge stays held.
- MPL functional code source remains unidentified outside the connected repositories.

## Non-actions

No merge, deployment, public publication, source deletion, Slack purge, Drive deletion, collaborator population or Mission 1 activation is authorised by this document.
