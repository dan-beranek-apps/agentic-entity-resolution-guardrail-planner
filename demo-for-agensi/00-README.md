# Agentic Entity Resolution Guardrail Plan

**Application:** Synthetic CRM account master (MergeCoordinator 2.8.0, identity schema CRM-IDENTITY-5) — Agentic MERGE of duplicate customer account CRM-ACCT-2097 into canonical CRM-ACCT-1042 (planning exercise; no production access)  
**Generated:** 2026-11-21  
**Package run ID:** 2026-11-21T01:44:38Z  
**Skill version:** 0.4.2  
**Artifact revision:** Fresh complete Skill run (original generation; no manual revision; synthetic CRM MERGE demo); original generation 2026-11-21T01:44:38Z; latest revision: none  
**Freeze status:** FROZEN  
**Reference mode:** Reference-backed (five public MCP retrievals completed)  
**Implementation readiness:** `not_implementation_ready`; blocking decisions: GAP-01, GAP-02, GAP-03, GAP-04, GAP-05, GAP-06, GAP-07, GAP-08; failed checks: none; unverified checks: schema_validation, format_validation, format_checker_negative_control  
**Status:** Design-time specification; not deployed; readiness does not imply runtime authorization, deployment, customer-test execution, production readiness, or package-coherence verification.

## Purpose

This package plans the guardrails around one proposed identity-changing operation in a synthetic CRM: MERGE of account CRM-ACCT-2097 into canonical account CRM-ACCT-1042 (operation OP-DEMO-2026-001, idempotency key demo-merge-1042-2097-v1). It states what evidence, approvals, scope and version checks, write-set and atomicity proof, commit-boundary controls, failure handling, reconciliation and recovery the customer application must implement before any production write. It is a planning exercise: no production access, database write, deployment or real authorization occurred.

## Three separate determinations

| Question | Result |
|---|---|
| 1. Does the supplied evidence support the identity-continuity proposition? | Yes on the supplied descriptions, conditionally. A registry extract states a legal-name change on 2024-04-01 with unchanged registration number and continuity and no dissolution, successor or new incorporation; an authenticity result and a 2025 agreement add limited corroboration. The Planner verified nothing; the evidence is not yet authorization-eligible; the migration report and crosswalk are one dependency cluster and are not independent proof. |
| 2. Is the proposed MERGE ready for human review? | Yes, for Data Steward and CRM Platform Owner review of the proposition, evidence and scope (review is not approval). Reviewers must receive the original documents and the blocking gaps below. |
| 3. Is the operation currently authorized to commit? | No. HOLD. No approval artifacts exist; write-set completeness and atomicity are unverified; Path A or Path B is not established; no authorization record exists. |

## Decisions at a glance

| Area | Result |
|---|---|
| Operations reviewed | 1 (MERGE) |
| Highest-risk action class | IRREVERSIBLE_WRITE (protected path), factual reversibility unknown |
| Recommended unresolved-case behaviour | HOLD |
| Controls | 12: CTRL-01, CTRL-02, CTRL-03, CTRL-04, CTRL-05, CTRL-06, CTRL-07, CTRL-08, CTRL-09, CTRL-10, CTRL-11, CTRL-12 |
| Pre-persistence controls | 8 (CTRL-01, CTRL-02, CTRL-03, CTRL-04, CTRL-05, CTRL-06, CTRL-07, CTRL-12) |
| Blocking decisions | 8 (GAP-01, GAP-02, GAP-03, GAP-04, GAP-05, GAP-06, GAP-07, GAP-08) |
| MCP reference status | Available; reference-backed |
| Planner-level checks | 3 PCHK records, all proposed (none executed) |
| Customer-operation tests | 31, all proposed (none executed) |

## Scope

**Included:** OP-DEMO-2026-001 — MERGE of CRM-ACCT-2097 into CRM-ACCT-1042, its evidence, approvals, version and scope binding, write set, single-transaction commit boundary, failure handling, post-commit consumers, reconciliation and recovery, and a negative control for related companies with different registry IDs.

**Excluded:** Any later unmerge or publication operation (would be separate operations with their own evidence), other CRUD, legal handling of contract names, production access, deployment, and verification of the underlying documents.

## Recommended implementation priorities

1. Close GAP-03 and GAP-04: verify the complete write set and the single-transaction boundary and commit point (CTRL-07).
2. Close GAP-02 and GAP-01: define evidence eligibility and the two bound human approvals (CTRL-03, CTRL-05).
3. Close GAP-05: establish Path A or Path B for this exact operation (CTRL-12).
4. Implement version binding, ambiguous-commit reconciliation and consumer reconciliation (GAP-06, GAP-07, GAP-08).

## Control inventory

Exact count: 12.

- - CTRL-01 — Operation, scope and action-class binding (Pre-persistence)
- - CTRL-02 — Registry-ID and legal-continuity identity gate (including negative control) (Pre-persistence)
- - CTRL-03 — Evidence eligibility: provenance, independence and temporal applicability (Pre-persistence)
- - CTRL-04 — Claim-specific conflict and indeterminate-evidence handling (Pre-persistence)
- - CTRL-05 — Separate human approvals bound to the exact operation and state (Pre-persistence)
- - CTRL-06 — Version binding and stale-state check (Pre-persistence)
- - CTRL-07 — Pre-write HOLD until write-set completeness and atomicity are proven (Pre-persistence)
- - CTRL-08 — Pre-commit invariant validation and transaction abort (Pre-commit (inside the verified transaction))
- - CTRL-09 — Post-commit validation and downstream reconciliation (Post-commit)
- - CTRL-10 — Post-commit and out-of-boundary failure handling (Post-commit)
- - CTRL-11 — Ambiguous commit outcome and idempotency (Cross-phase (commit outcome))
- - CTRL-12 — Reversibility and authorization-path gate (Path A or Path B) (Pre-persistence)

## Files

- 00-README.md — this package overview, provenance, validation record, and handoff status.
- 01-mutation-scope.md — application and operation scope.
- 02-guardrail-specification.md — actionable control requirements.
- 03-evidence-requirements.md — evidence, provenance, and conflict requirements.
- 04-commit-boundary-design.md — pre-persistence and post-execution design.
- 05-implementation-blueprint.md — integration points and responsibilities.
- 06-validation-scenarios.md — proposed tests.
- 07-assumptions-and-gaps.md — unresolved issues and limitations.
- guardrail-spec.json — machine-readable plan.

## Reference provenance

Retrieved from the public DIO-ODI Reference MCP in this run. Retrieval time is the shared run timestamp (2026-11-21T01:44:38Z), not a per-call time. Versions for the two commit-boundary contracts and the evidence-promotion contract are inherited from SRC-MCP-STATUS because no contract-specific version was returned. Customer-supplied sources have no retrieval timestamp. Arguments sent to the service were inspected and contained only abstract labels: actionClass IRREVERSIBLE_WRITE, mutationType MERGE, entityClass 'customer account', observationDomain 'CRM account resolution', temporalScope 'validity interval required', include evidence_requirements and commit_checks, and phase PHASE_1 or PHASE_2. Application-mapping and policy-as-code sections were not retrieved and are not relied on.

| Source ID | Tool | Version | Version basis | Time basis | Epistemic status |
|---|---|---|---|---|---|
| SRC-MCP-STATUS | DIO-ODI Reference MCP - get_reference_status | Reference Model 0.9.0 (archived); Reference Vocabulary 0.2.2; agentic ER mapping 0.3.1 (derived, non-normative); semantic change feed live 0.1.4; service checkedAt 2026-11-12 | direct | run_timestamp | canonical_reference |
| SRC-MCP-PROFILE | DIO-ODI Reference MCP - get_mutation_guardrail_profile | 0.1.0 | direct | run_timestamp | illustrative |
| SRC-MCP-EVID | DIO-ODI Reference MCP - get_evidence_promotion_contract | 0.9.0 (reference-set version inherited; no contract-specific version returned) | inherited_reference_set | run_timestamp | derived_non_normative |
| SRC-MCP-PH1 | DIO-ODI Reference MCP - get_commit_boundary_contract | 0.9.0 (reference-set version inherited; no contract-specific version returned) | inherited_reference_set | run_timestamp | derived_non_normative |
| SRC-MCP-PH2 | DIO-ODI Reference MCP - get_commit_boundary_contract | 0.9.0 (reference-set version inherited; no contract-specific version returned) | inherited_reference_set | run_timestamp | derived_non_normative |

## Validation performed

Planner check statuses describe the planning workflow; they do not imply customer operation execution. No Draft 2020-12 engine, format checker or RFC 8785 implementation was available, so structural, format and sidecar-dependent checks were not run and the package is not fully validated. Automated checks were run by a custom helper script (not a schema validator); judgement checks were done manually.

| Check | Status | Tool / method | Result or limitation |
|---|---|---|---|
| `schema_validation` | not_run | No Draft 2020-12 engine invoked (Python 3.12.3 has no jsonschema; Node v22.23.5 has only Ajv 6.15.0, Draft-07 only, no ajv/dist/2020) | Not run: no compatible engine; nothing was installed. JSON parsing succeeded but is not schema validation. |
| `artifact_ledger_schema_validation` | deferred_post_freeze | Deferred: final sidecar validation is a handoff-record item | Not recorded in frozen bytes by design. |
| `format_validation` | not_run | No schema-validator format support available | Not run; date-time and URI values were not validator-checked. |
| `semantic_reference_validation` | executed_pass | Custom helper script check.py (Python 3.12.3; semantic/reference-integrity checker, not a schema validator) | ID uniqueness and resolution, source and test links, reciprocity and version-source references all consistent. |
| `operation_coverage_validation` | executed_pass | Custom helper script check.py | Operation has controls and tests; each control has at least one test; nine Path A/B tests present. |
| `test_operation_scope_validation` | executed_pass | Custom helper script check.py compares explicit OP-IDs in scenario, setup, action and expected result with operation_ids | Every named operation is listed; no spurious IDs. |
| `markdown_json_consistency` | executed_pass | Custom helper script check.py (Markdown parsed against JSON) | Operation, control, test, planner-check, evidence, decision and assumption registers, counts, statuses and README validation table agree. |
| `zip_integrity` | not_run | Post-build check; no archive created | Not run. |
| `customer_runtime_tests` | not_run | Customer environment | Not run; no customer environment exists for this synthetic case. |
| `external_client_compatibility` | not_run | External MCP client compatibility | Not run. |
| `format_checker_negative_control` | not_run | No schema-validator format support available | Not run; malformed date-time and URI probes were not exercised. |
| `operation_classification_consistency` | manual_pass | Manual review | Action class and factual reversibility were assessed separately: IRREVERSIBLE_WRITE with reversibility unknown, no recovery or irreversibility evidence object, no staging fields. Schema edge-case probes were not machine-run. |
| `authorization_path_coverage_validation` | manual_pass | Manual review of nine Path A/Path B tests plus script count | All nine tests reviewed for operation-specific content, hypothetical labelling, independent prerequisite isolation, and reciprocal link to CTRL-12. |
| `operation_effect_boundary_validation` | manual_pass | Manual semantic review plus script prefix-syntax check | All 15 effect lines use UNKNOWN_UNVERIFIED because transaction membership and effect existence are declared but not verified; no positive prefix overstates evidence. |
| `mcp_provenance_validation` | manual_pass | Manual comparison of recorded tool, parameters, phase and action class with the retrieved responses | Five sources match their retrievals; PHASE_1 and PHASE_2 contracts are used only for protected-write phases; inherited versions point to SRC-MCP-STATUS. |
| `planner_checks_validation` | executed_pass | Custom helper script check.py | Three baseline PCHK records present, proposed, with no operation IDs or control links. |
| `artifact_coherence_validation` | deferred_post_freeze | Deferred: reported as package_coherence in the sidecar | Not recorded in frozen bytes by design. |
| `timestamp_chronology_validation` | executed_pass | Custom helper script check.py | validated_at is later than generated_at; revised_at is null. |

`validated_at` records completion of candidate-scoped content checks before the freeze. Frozen-byte checks and sidecar checks are reported separately in the sidecar and the handoff message.

## Artifact creation ledger

Supplemental audit sidecar: `artifact-creation-ledger.json` (separate from the nine canonical plan artifacts). The plan files contain no post-freeze ledger status, counts, export status or coherence result.

| Field | Value |
|---|---|
| Sidecar version | 2.1.1 |
| Run ID | 2026-11-21T01:44:38Z |
| Attestation scope | Nine frozen plan artifacts and post-freeze sidecar checks |
| Post-freeze results | See the sidecar and final handoff evidence |

## Artifact integrity

The line headed Freeze status above is authoritative. When it reads FROZEN, the nine plan artifacts are locked against further edits; that word does not mean checks, exports or coherence are verified. Candidate snapshot evidence, frozen hashes, export observations and post-freeze checks are in `artifact-creation-ledger.json`; the handoff message carries final-byte evidence.

## Assumptions and unresolved blockers

Eight blocking decisions (GAP-01 to GAP-08) remain; see 07-assumptions-and-gaps.md. Assumptions ASM-01 to ASM-09 are listed there.

## Important limitations

This package is a design-time plan. It does not change customer data, authorize a live operation, deploy controls, or prove that the proposed controls are effective. The application owner must define domain policy and approval authority, implement the controls, and execute the proposed tests.
