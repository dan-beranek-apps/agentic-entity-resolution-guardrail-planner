# Identity Mutation Guardrail Plan

**Application:** AI-assisted CRM entity-resolution workflow (synthetic scenario) - proposed MERGE of CRM-ACCT-1042 and CRM-ACCT-8891  
**Generated:** 2026-11-15  
**Package run ID:** 2026-11-15T17:25:14Z  
**Skill version:** 0.4.0  
**Artifact revision:** Fresh complete Skill run from the original user request (not a manual revision); no revision has been made  
**Freeze status:** FROZEN  
**Reference mode:** Reference-backed (get_reference_status and get_mutation_guardrail_profile retrieved; see provenance)  
**Implementation readiness:** `not_implementation_ready`. Blocking decisions: GAP-01, GAP-02, GAP-03, GAP-04, GAP-05, GAP-06, GAP-07, GAP-08, GAP-09, GAP-10, GAP-11. Failed checks: none. Unverified checks: schema_validation, format_validation, format_checker_negative_control.  
**Status:** Design-time specification; not deployed; readiness does not imply runtime authorization, deployment, customer-test execution, production readiness, or package-coherence verification.

## Purpose

An AI agent proposes merging two CRM customer-account records, Example Ridge Services Ltd (CRM-ACCT-1042) and Example Ridge Service Holdings Ltd (CRM-ACCT-8891), because of similar names, the same web domain, one overlapping contact and a registry extract with a potentially matching identifier. A contract also suggests that one company may be a parent or holding entity of the other. This package specifies the evidence requirements, authorization paths, commit-boundary controls, failure handling, implementation design and operation-specific validation scenarios, and the HOLD conditions that apply before any persistent production write. It does not decide whether the two records are the same legal entity and it does not execute or authorize any mutation.

## Decisions at a glance

| Area | Result |
|---|---|
| Operations reviewed | 1 (OP-01, MERGE) |
| Highest-risk action class | IRREVERSIBLE_WRITE (protected path); factual reversibility unknown |
| Recommended unresolved-case behaviour | HOLD before the first persistent write; DEFER / REQUIRE REVIEW for evidence and relationship conflicts |
| Controls | 14 (CTRL-01 to CTRL-14); full list in the Control inventory |
| Pre-persistence controls | CTRL-01 to CTRL-07, CTRL-11, CTRL-12, CTRL-13 and CTRL-14 act before or at the first persistent write; CTRL-08, CTRL-09 and CTRL-10 govern failure handling |
| Blocking decisions | 11 (GAP-01, GAP-02, GAP-03, GAP-04, GAP-05, GAP-06, GAP-07, GAP-08, GAP-09, GAP-10, GAP-11) |
| MCP reference status | Available; reference-backed for the IRREVERSIBLE_WRITE / MERGE profile only |
| Planner-level checks | 3 PCHK records (PCHK-01 to PCHK-03), all proposed, none executed |
| Customer-operation tests | 31 proposed, none executed |

**Pre-write HOLD summary.** The persistent write set, transaction coverage, commit boundary and atomicity, post-commit recovery testing, and the operation-specific approval policy with authorized approvers are all unestablished (GAP-01 to GAP-04). Each is a HOLD condition: no persistent production write may begin. The registry extract is unverified (GAP-06) and the contract indicates a possible parent/holding relationship (GAP-07), so the identity proposition itself is unproven and may be false.

## Scope

**Included:** OP-01, the production MERGE of the two account records as a protected identity-changing operation, with its evidence, authorization, commit-boundary and failure-handling requirements.

**Excluded:** the alternative outcome of recording a typed parent/subsidiary relation or keeping both accounts (it would be a separate operation needing its own plan); isolated shadow staging (none described, DEC-01); unrelated CRUD; access-control review; any execution or authorization of the merge.

## Recommended implementation priorities

1. Resolve the blocking policy decisions GAP-05, GAP-07, GAP-09 and GAP-11 (evidence standard, parent/holding resolution, validity interval, survivorship) because they determine whether the MERGE should happen at all.
2. Establish and verify the complete write-set inventory and transaction/commit-point evidence (GAP-01, GAP-02, GAP-10) and implement CTRL-06 and CTRL-07 as pre-write HOLD gates.
3. Define the approval policy, authorized approvers, Path A attestor and Path B policy/separation of duties (GAP-04, GAP-08) and decide whether to invest in tested recovery for Path A (GAP-03).
4. Implement the evidence admission/promotion gate and registry-extract verification (CTRL-02, CTRL-03, GAP-06).
5. Implement idempotency, reconciliation, version binding and audit (CTRL-10, CTRL-13, CTRL-14).

## Control inventory

14 controls:

- CTRL-01 - Protected-operation qualification and scope binding
- CTRL-02 - Claim-specific identity evidence gate (similarity is not identity)
- CTRL-03 - Registry-extract eligibility and evidence admission
- CTRL-04 - Parent/holding indication and contradiction handling
- CTRL-05 - Temporal applicability and validity interval
- CTRL-06 - Complete write-set inventory and pre-write HOLD
- CTRL-07 - Transaction coverage, commit point and atomicity gate
- CTRL-08 - Pre-commit invariant failure inside a verified atomic transaction
- CTRL-09 - Post-commit and out-of-boundary failure handling
- CTRL-10 - Ambiguous commit outcome, idempotency and reconciliation
- CTRL-11 - Authorization-path eligibility for the protected MERGE (Path A / Path B)
- CTRL-12 - Operation-specific approval and authorized approvers
- CTRL-13 - Version binding, stale-state rejection and concurrency
- CTRL-14 - Audit and lineage record

## Files

- 00-README.md - this package overview, provenance, validation record, and handoff status.
- 01-mutation-scope.md - application and operation scope.
- 02-guardrail-specification.md - actionable control requirements.
- 03-evidence-requirements.md - evidence, provenance, and conflict requirements.
- 04-commit-boundary-design.md - pre-persistence and post-execution design.
- 05-implementation-blueprint.md - integration points and responsibilities.
- 06-validation-scenarios.md - proposed tests.
- 07-assumptions-and-gaps.md - unresolved issues and limitations.
- guardrail-spec.json - machine-readable plan.

## Reference provenance

Sources actually retrieved in this run (retrieval time basis: `run_timestamp`; per-call times were not retained, so the value 2026-11-15T17:30:21Z is the run-level clock read taken immediately after the retrievals):

| Source ID | Tool / resource | Version | Version basis | Status | Used for |
|---|---|---|---|---|---|
| SRC-01 | get_reference_status (public DIO/ODI reference MCP; no arguments) | Reference Model 0.9.0; Reference Vocabulary 0.2.2; Agentic ER mapping 0.3.1 (derived, non-normative) | direct | canonical_reference | Reference-set and service version metadata for this run; Identification of the reference set that the mutation profile belongs to |
| SRC-02 | get_mutation_guardrail_profile (actionClass=IRREVERSIBLE_WRITE, mutationType=MERGE, include=evidence_requirements+commit_checks; abstract labels only) | 0.1.0 | direct | canonical_reference | IRREVERSIBLE_WRITE / MERGE protected-write profile and its statement that ambiguous effect class is treated as protected; Illustrative diagnostic-to-constraint patterns (similarity is not co-reference; temporal continuity interval; conflict retention; relation type preservation) - epistemic status illustrative; Fields returned by that profile for evidence admission/quarantine/promotion and for Phase 1 / Phase 2 commit checks (cited as profile-returned fields, not as separate contract retrievals) |
| SRC-03 | Customer scenario description supplied in the request (synthetic; records, registry extract and contract document were described, not supplied) | null | not_applicable | customer_supplied | Customer-provided signals, proposed MERGE, impacted state classes and the five documentation gaps |
| SRC-04 | get_evidence_promotion_contract (not separately retrieved) | null | unavailable | not_retrieved | Not used as support |
| SRC-05 | get_commit_boundary_contract PHASE_1 and PHASE_2 for IRREVERSIBLE_WRITE (not separately retrieved) | null | unavailable | not_retrieved | Not used as support |

Mapping and diagnostic-to-constraint content is derived or illustrative and is not a customer policy. SRC-03 is customer-supplied with `retrieved_at: null`. SRC-04 and SRC-05 were not retrieved and support nothing. The statement that no customer data was sent to the public MCP is based on inspection of the actual call arguments in this run (abstract labels only; see ASM-06); it was not independently audited by the host.

## Validation performed

The validation table includes planner-level checks separately from customer-operation tests. Planner check statuses describe the planning workflow; they do not imply customer operation execution.

| Check | Status | Tool / method | Result or limitation |
|---|---|---|---|
| `schema_validation` | not_run | Not invoked - no compatible Draft 2020-12 engine (Python jsonschema / Ajv 2020) available; Ajv 6.15.0 is Draft-07 only | No structural JSON Schema validation was completed; the package is not fully validated. Parsing the JSON succeeded (prerequisite only). |
| `artifact_ledger_schema_validation` | deferred_post_freeze | Reported only in the final handoff record for the exact D2 bytes | Deferred; not recorded in frozen plan files. |
| `format_validation` | not_run | Not invoked - requires the same schema engine with format assertion support | Not run. Supplementary regex inspection of date-time and URI values is not format validation. |
| `semantic_reference_validation` | executed_pass | Python script: unique IDs, ID resolution, provenance_refs, reciprocal test/control links, version_source_id | Passed on candidate content. |
| `operation_coverage_validation` | executed_pass | Python script: every operation has at least one control, evidence proposition and test | Passed (one operation). |
| `test_operation_scope_validation` | executed_pass | Python script: all explicit OP-nn mentions in test narrative fields compared with operation_ids; manual review for spurious IDs | Passed (every test exercises OP-01 only). |
| `markdown_json_consistency` | executed_pass | Python script on generated bytes: run ID, IDs, statuses, control required_action text, counts, readiness and validation table | Passed on final candidate bytes. |
| `zip_integrity` | not_run | Post-build; no archive created | Not run. |
| `customer_runtime_tests` | not_run | Customer environment | Not run; no customer test was executed. |
| `external_client_compatibility` | not_run | Host/client | Not run. |
| `format_checker_negative_control` | not_run | Not invoked - requires the schema engine | Not run; malformed date-time and URI probes were not exercised against a real format checker. |
| `operation_classification_consistency` | manual_pass | Manual review plus supplementary ad hoc subset keyword checker over the operations schema branches | Manual pass: IRREVERSIBLE_WRITE / MERGE / unknown with no evidence objects; no staging claim. |
| `authorization_path_coverage_validation` | executed_pass | Python script: nine Path A / Path B tests present for the IRREVERSIBLE_WRITE / unknown operation, linked to CTRL-11 | Passed (TEST-21 to TEST-29; TEST-30 supplementary). |
| `operation_effect_boundary_validation` | manual_pass | Python prefix-syntax script plus manual semantic review of each affected_state basis | Manual pass: every effect is UNKNOWN_UNVERIFIED; no effect is asserted in-transaction, outside, or external. |
| `mcp_provenance_validation` | manual_pass | Manual review of tool, request arguments, returned mutation type/action class and claims per source | Manual pass: claims map only to SRC-01 or SRC-02 content; SRC-04 and SRC-05 are not retrieved and are not cited as support. |
| `planner_checks_validation` | manual_pass | Python script plus manual review | Manual pass: three PCHK records (MCP completeness, version consistency, scope qualification), none with operation IDs; all proposed. |
| `artifact_coherence_validation` | deferred_post_freeze | Recorded as package_coherence in the sidecar | Deferred. |
| `timestamp_chronology_validation` | executed_pass | Python script: validated_at after generated_at; retrieval time not before generated_at | Passed. |

Automated (this run): the Python scripts named above. Manual: operation classification, effect-boundary semantics, MCP provenance semantics, planner-check content. Not run: schema validation, format validation, format negative control, ZIP integrity, customer runtime tests, external-client compatibility. `validated_at` (2026-11-15T17:33:11Z) records completion of the candidate-scoped content checks. No compatible Draft 2020-12 validator was available, so this package is not fully validated and the three readiness-critical structural checks are listed as unverified. A supplementary ad hoc subset keyword checker over the plan JSON was run; it is not a JSON Schema validator.

## Artifact creation ledger

Supplemental audit sidecar: `artifact-creation-ledger.json` (separate from the nine canonical plan artifacts). The frozen plan files contain no post-freeze ledger status, counts, export status or coherence result.

| Field | Value |
|---|---|
| Sidecar version | 2.1.1 |
| Run ID | 2026-11-15T17:25:14Z |
| Attestation scope | Nine frozen plan artifacts and post-freeze sidecar checks |
| Post-freeze results | See the sidecar and final handoff evidence |

The main plan schema is Draft 2020-12 version `5.0.0`; the separate ledger sidecar schema is version `2.1.1`. The sidecar distinguishes `export_status` (exported names/bytes only) from `package_coherence` (all mandatory checks). Its own final schema-validation result and final D2-byte evidence are reported in the handoff message, not written into the sidecar.

## Artifact integrity

The nine plan artifacts are locked once the freeze write is made; see `artifact-creation-ledger.json` for candidate snapshot evidence, frozen hashes, export observations and post-freeze checks, and the handoff message for final D2-byte evidence. This README does not declare the package complete or verified.

## Important limitations

This package is a design-time plan. It does not change customer data, authorize a live operation, deploy controls, or prove that the proposed controls are effective. The application owner must define domain policy and approval authority, implement the controls, and execute the proposed tests.
