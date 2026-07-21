# MPL systematic audit return — 2026-07-21

Status: `CONTROLLED_INTERNAL / SOURCE_RESOLVED / RELEASE_GATE_BLOCKED`

## Authority resolution

- Live route: `https://romer.industries/mpl`.
- Git repository: `achillesromer-coder/Romer-MPL`.
- Canonical operational source: `index.html`.
- Observed source blob: `34741b3cf8923cb55fe7c6ccaabdb3f5f1ba2053`.
- Source lineage commit: `27bf2d90278c9f36d3fad941daf8a0433ac51f07`, rename of the earlier `romer_mpl_v0.00.1` build.
- Review branch: `mpl/systematic-audit-2026-07-21`.
- Draft review: `https://github.com/achillesromer-coder/Romer-MPL/pull/2`.

MPL is confirmed as **Maximum Probable Loss**. N^3 / GeoMatrices / Trinity Probability Well remains a separate package even though historical N3 material exists in the same repository.

## Regulatory-source result

The public Australian Space Agency Maximum Probable Loss Methodology is dated 1 August 2019. The Agency states that its own estimator is not comprehensive, is not a substitute for specialist advice, and cannot be used in an application.

The app currently contains mixed `ASA 2019`, `ASA METHODOLOGY: 2019`, `AUD 2024`, and unqualified `ASA-compliant` or compliance-pass wording. Therefore regulator/application-ready language remains blocked until one method version, value-level provenance and independent review are recorded.

## Initial failures and review gates

| ID | State | Operational effect |
|---|---|---|
| MPL-REG-001 | FAIL | Mixed regulatory-year provenance. |
| MPL-CLAIM-001 | REVIEW_REQUIRED | Model output can be mistaken for regulator acceptance. |
| MPL-CLAIM-002 | FAIL | IIP probability display is hard-coded to `< 1×10⁻⁷`. |
| MPL-MODEL-001 | REVIEW_REQUIRED | Simplified IIP visualization is not clearly separated from application-grade trajectory analysis. |
| MPL-MODEL-002 | REVIEW_REQUIRED | Custom HVA corridor weighting needs independent source/method review. |
| MPL-BUG-001 | FAIL | Risk-heat color reads `latest.zone` although the stored point contains `risk`. |
| MPL-BUG-002 | FAIL | FSS status returns `NOMINAL` at five seconds or less before failure. |
| MPL-SEC-001 | FAIL | `no-cors` webhook attempt is reported as verified dispatch. |
| MPL-SEC-002 | REVIEW_REQUIRED | Imported config may set an arbitrary HTTP webhook destination. |
| MPL-SEC-003 | REVIEW_REQUIRED | Dynamic HTML/report interpolation requires escaping tests. |
| MPL-PROV-001 | OPEN | Constants and fallback data need machine-readable source receipts. |
| MPL-PROV-002 | OPEN | Runs and reports need immutable code/data/method identifiers. |
| MPL-LIVE-001 | BLOCKED | Deployed browser identity and behavior await Codex/Playwright evidence. |

## Test receipt

- Harness: `Romer-MPL/tools/mpl_static_audit.py`.
- Tests: `Romer-MPL/tests/test_mpl_static_audit.py`.
- Local result: **12 tests run, 12 passed**.
- Full execution against the repository `index.html`: pending Codex or CI receipt.
- Live visual, responsive, offline/fallback and integration tests: pending Codex/browser receipt.

## Agent routing

- Smith: run static harness against `index.html`, browser matrix and integration mocks.
- Oracle: independently review methodology attribution, equations, heuristics, claim language and trust boundaries.
- Neo: build a result packet carrying source commit/blob, data snapshots, inputs, outputs, uncertainty, tests, rejects and destination receipts.
- Achilles: keep merge, deployment, public wording and deletion gates closed until critical/high findings have evidence.
- Cognigrex/Data: receive reusable method, equation, provenance and validation structures after independent review.
- MPL-specific values and results remain in the MPL source/data surfaces and relevant Twin/CORE registers.

## Codex coordination

PR #2 is additive and does not edit `index.html`, so current Codex automation may inspect or remediate the live source without direct path collision. Codex should attach or cross-reference:

1. deployed route identity;
2. full static-audit JSON;
3. visual/browser matrix;
4. network and data-source state;
5. outbound-write acknowledgement tests;
6. accessibility and responsive-layout results;
7. any remediation branch and changed-file list.

Conflicting edits must be reconciled before merge. Newer output does not automatically outrank source authority; evidence and completeness decide promotion.

## Release disposition

`RELEASE_GATE_BLOCKED`.

The route may remain controlled, `noindex`, and internal/demo. No final LightSpeed soft launch, Cognigrex fleet activation, regulatory claim, merge, deployment, data write, collaborator/Mission 1 population, archive move or deletion is authorised by this receipt.
