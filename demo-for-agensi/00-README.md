# Agentic Entity Resolution Guardrail Plan

**Application:** CRM account merge after a legal name change (MERGE of CRM-ACCT-2097 into CRM-ACCT-1042)  
**Generated:** 2026-11-21  
**Package run ID:** 2026-11-21T01:15:46Z  
**Skill version:** 0.4.2  
**Artifact revision:** Fresh complete Skill run (Skill 0.4.2, plan schema 5.0.0); no prior baseline and no revision. Original generation timestamp 2026-11-21T01:15:46Z; latest revision timestamp: none (revised_at is null).  
**Freeze status:** FROZEN  
**Reference mode:** Reference-backed (five retrievals from the public DIO/ODI reference MCP; see Reference provenance)  
**Implementation readiness:** `not_implementation_ready`. Blocking decisions: DEC-01, DEC-02, DEC-03, DEC-04, DEC-05, DEC-06, DEC-07. Failed readiness-critical checks: none. Unverified readiness-critical checks: schema_validation, format_checker_negative_control.
**Status:** Design-time specification; not deployed; readiness does not imply runtime authorization, deployment, customer-test execution, production readiness, or package-coherence verification.

## Purpose

This package specifies the guardrails for one agent-proposed, identity-changing operation in a CRM: merging account CRM-ACCT-2097 (created by migration under the current legal name Northstar Industrial Components Limited) into the established canonical account CRM-ACCT-1042 (legacy legal name Northstar Components Limited) after a registry-documented legal-name change. It assesses the supplied evidence, the human approval and authorization conditions, the complete write set and atomic commit boundary, downstream propagation, and failure, ambiguity and recovery handling. Nothing was executed against any database or production system, and no approval has been granted or assumed.

## Assessment summary

| Question | Result |
|---|---|
| Does the supplied evidence support identity continuity? | **Supported in principle; not yet established for authorization.** SRC-REG-001 (the registry extract) is the only supplied source that directly addresses legal-person continuity: it records a name change on 2024-04-01 with the registration number and legal-person continuity unchanged and no dissolution, successor or new incorporation. SRC-REG-VERIFY-005 (a supplied verification result, not performed by the Planner) would support its authenticity, and SRC-LEGAL-002 corroborates the post-rename name and registry ID. SRC-MIGRATION-003 and SRC-CROSSWALK-004 are the customer's own mapping to EC-004821 and share an upstream origin, so they are not independent identity evidence. No evidence has been promoted as authorization-eligible; the extract is 37 days older than the run date with no customer freshness limit; the extract content and policy text were described, not supplied. |
| Is the operation ready for human review? | **Conditionally, for the identity and evidence question only.** A Data Steward can review the evidence packet once the supplied documents, the verification record tied to the exact extract, and a freshness decision are available. Commit approvals must not be requested or recorded yet, because approvals must be bound to the exact operation and state, including the proven write set and authorization path (DEC-01, DEC-03, DEC-04). |
| Is it authorized to commit? | **No. HOLD.** No approval artifacts exist; no authorization record exists; the write set and atomicity are unproven; factual reversibility is unknown and neither Path A nor Path B is established; ambiguous-commit, post-commit reconciliation and recovery owners are undefined. |
| Negative control | Two superficially similar parent/subsidiary records with different official registry IDs must not be merged on names, domains or contacts alone (CTRL-02, TEST-03). |

## Decisions at a glance

| Area | Result |
|---|---|
| Operations reviewed | 1: OP-DEMO-2026-001 (MERGE) |
| Highest-risk action class | IRREVERSIBLE_WRITE (factual reversibility: unknown) |
| Recommended unresolved-case behaviour | HOLD before the first persistent write; block on contradiction or distinct registry IDs |
| Controls | 13: CTRL-01, CTRL-02, CTRL-03, CTRL-04, CTRL-05, CTRL-06, CTRL-07, CTRL-08, CTRL-09, CTRL-10, CTRL-11, CTRL-12, CTRL-13 |
| Pre-persistence controls | 9 (CTRL-01 to CTRL-09); CTRL-10 to CTRL-13 govern commit, ambiguity, post-commit validation and recovery |
| Blocking decisions | 7 (DEC-01, DEC-02, DEC-03, DEC-04, DEC-05, DEC-06, DEC-07) |
| MCP reference status | Available; reference_backed |
| Customer-operation tests | 32 proposed, none executed |
| Planner-level checks | 3 PCHK records, all proposed |

## Scope

**Included:** The single operation OP-DEMO-2026-001: MERGE of CRM-ACCT-2097 into CRM-ACCT-1042 in the CRM (PostgreSQL 16.5, MergeCoordinator 2.8.0, schema CRM-IDENTITY-5), its evidence, approvals, authorization path, write set, atomic commit, downstream propagation and failure handling, and one negative control.

**Excluded:** Any execution or modification of data; production authorization; UNMERGE, SPLIT or shadow-staging operations; generic CRM CRUD; legal determinations; verification of the fictional registry; downstream consumer internals beyond the stated contract.

## Recommended implementation priorities

1. Prove the complete write set and the single atomic SERIALIZABLE boundary (including the storage for historical names and the CRM-ACCT-2097 row disposition) before any write (CTRL-08, DEC-04).
2. Decide and document the authorization path: tested recovery (Path A) or an explicitly accepted non-recovery risk with separation of duties (Path B) (CTRL-07, DEC-03).
3. Run customer evidence promotion for the registry extract, tie the verification record to the exact extract, define the freshness limit and registry-ID normalization rule (CTRL-01, CTRL-03, CTRL-04, DEC-02).
4. Implement bound, separate Data Steward and CRM Platform Owner approvals (CTRL-06, DEC-01).
5. Implement idempotency-key persistence inside the transaction and ambiguous-commit reconciliation (CTRL-10, CTRL-11, DEC-05).
6. Establish idempotent consumers, post-commit reconciliation, quarantine and recovery ownership (CTRL-12, CTRL-13, DEC-06, DEC-07).

## Control inventory

Exactly 13 controls:

- CTRL-01 - Identity proposition and exact official registry ID gate
- CTRL-02 - Similarity-is-not-identity and distinct-registry-ID prohibition (negative control)
- CTRL-03 - Claim-specific evidence eligibility and provenance
- CTRL-04 - Temporal continuity applicability and evidence freshness
- CTRL-05 - Canonical record and identity-preserving requirements
- CTRL-06 - Separate human approvals bound to the exact operation and state
- CTRL-07 - Protected-write authorization path (Path A recovery or Path B accepted non-recovery risk)
- CTRL-08 - Complete write-set and atomicity proof before the first persistent write
- CTRL-09 - Immediate pre-write revalidation of record state, schema, coordinator, validator, policy and approvals
- CTRL-10 - Atomic SERIALIZABLE commit and pre-commit abort
- CTRL-11 - Ambiguous commit reconciliation, idempotency and no blind retry
- CTRL-12 - Post-commit validation and downstream propagation reconciliation
- CTRL-13 - Post-commit failure, quarantine and recovery

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

All retrievals used the public read-only reference MCP at https://mcp.danielberanek.cz/mcp. Only abstract labels were submitted (action class, mutation type, 'customer account', 'CRM account resolution', 'current status'); I inspected the arguments of every call in this run and none contained a company name, account ID, evidence text or other scenario detail. Retrieval time is the shared run timestamp 2026-11-21T01:15:46Z, not a per-call time. Versions returned: Reference Model 0.9.0, Reference Vocabulary 0.2.2, Agentic ER mapping 0.3.1 (derived, non-normative); the profile and status results were consistent. Not retrieved (not needed): application mapping, policy-as-code mapping, concept and taxonomy tools.

| Source ID | Tool / source | Version and basis | Time basis | Epistemic status |
|---|---|---|---|---|
| SRC-REQUEST | Customer task request, sections 1, 4 and 5: proposed operation, application stack, commit boundary, write set, operation ID and idempotency ... | n/a | not_applicable | customer_supplied |
| SRC-POLICY | Customer policy POL-MDM-07 v3.2 as summarised in the task request, section 3 (policy text itself not supplied) | n/a | not_applicable | customer_supplied |
| SRC-REG-001 | Registry extract FCR-EXTRACT-004821-2026-10-15 (as described in the task request; extract content not supplied) | n/a | not_applicable | customer_supplied |
| SRC-REG-VERIFY-005 | Customer evidence-control record: reported successful verification of the extract digital signature and issuer certificate (supplied result;... | n/a | not_applicable | customer_supplied |
| SRC-LEGAL-002 | Executed agreement MSA-NSI-2025-02 dated 2025-02-14 (as described in the task request; document not supplied) | n/a | not_applicable | customer_supplied |
| SRC-MIGRATION-003 | Migration report MIG-REPORT-2024-05-15 (as described in the task request; report not supplied) | n/a | not_applicable | customer_supplied |
| SRC-CROSSWALK-004 | Account-to-entity crosswalk (as described in the task request; crosswalk content not supplied) | n/a | not_applicable | customer_supplied |
| SRC-MCP-STATUS | get_reference_status (no arguments) | Reference Model 0.9.0; Reference Vocabulary 0.2.2; Agentic ER mapping 0.3.1; Semantic Change Feed live 0.1.4 | run_timestamp | canonical_reference |
| SRC-MCP-PROFILE | get_mutation_guardrail_profile (actionClass=IRREVERSIBLE_WRITE, mutationType=MERGE, entityClass='customer account', observationDomain='CRM a... | 0.1.0 | run_timestamp | illustrative |
| SRC-MCP-EVID | get_evidence_promotion_contract (no arguments) | inherited from SRC-MCP-STATUS | run_timestamp | derived_non_normative |
| SRC-MCP-P1 | get_commit_boundary_contract (phase=PHASE_1, actionClass=IRREVERSIBLE_WRITE) | inherited from SRC-MCP-STATUS | run_timestamp | derived_non_normative |
| SRC-MCP-P2 | get_commit_boundary_contract (phase=PHASE_2, actionClass=IRREVERSIBLE_WRITE) | inherited from SRC-MCP-STATUS | run_timestamp | derived_non_normative |

## Validation performed

The validation table includes planner-level checks separately from customer-operation tests. Planner check statuses describe the planning workflow; they do not imply customer operation execution.

| Check | Status | Tool / method | Result or limitation |
|---|---|---|---|
| `schema_validation` | not_run | No compatible JSON Schema Draft 2020-12 engine invoked (Python jsonschema not installed; only Ajv 6.15.0, which does not implement Draft 2020-12, was found; network disabled) | Not run. Structural schema validation of guardrail-spec.json against templates/guardrail-spec.schema.json (Draft 2020-12) is outstanding. A separate custom conformance probe was run as a supplementary check only and is not a JSON Schema validator. |
| `artifact_ledger_schema_validation` | deferred_post_freeze | Deferred to the post-freeze sidecar and handoff record | Deferred post-freeze; not part of the frozen plan bytes. |
| `format_validation` | manual_pass | Manual review: helper script applied RFC 3339 date-time and absolute-URI pattern checks to every date-time and uri value in the JSON; not validator-enforced | manual_pass for the manual review only. It is not schema-engine format assertion. |
| `semantic_reference_validation` | executed_pass | Custom Python semantic checker (check.py): unique IDs; operation/control/test/source/evidence/planner-check references; reciprocal control-test links; version_source_id resolution | Passed on the candidate bytes. |
| `operation_coverage_validation` | executed_pass | Custom Python semantic checker: every control and evidence proposition resolves to the operation; every control has at least one test; every operation has controls, evidence and tests | Passed on the candidate bytes. |
| `test_operation_scope_validation` | executed_pass | Custom Python semantic checker: explicit OP-ID mentions in scenario, setup, action and expected result compared with operation_ids | Passed on the candidate bytes; the single operation is exercised by every test. |
| `markdown_json_consistency` | executed_pass | Custom Python comparison of IDs, counts, statuses, provenance, control core fields, test registers, planner-check registers, README validation table and readiness fields across all eight Markdown files and the JSON | Passed on the candidate bytes. |
| `zip_integrity` | not_run | Post-build check; not run | Not run; no archive was created. |
| `customer_runtime_tests` | not_run | Customer environment | Not run; the proposed tests are designed, not executed. |
| `external_client_compatibility` | not_run | External client | Not run. |
| `format_checker_negative_control` | not_run | Requires the same real Draft 2020-12 engine as schema_validation | Not run; no compatible engine with a format checker was available. |
| `operation_classification_consistency` | manual_pass | Manual review with a scripted rule probe of the Schema 5.0.0 action-class / reversibility / evidence-object rules | manual_pass: IRREVERSIBLE_WRITE with factual reversibility unknown and no reversibility, irreversibility or staging evidence object. |
| `authorization_path_coverage_validation` | manual_pass | Scripted tally of tagged Path A / Path B tests plus manual review of each test's setup and expected result | manual_pass: nine operation-specific authorization-path tests (TEST-13 to TEST-21) cover Path A positive, A1/A2/A3 negatives, Path B positive, policy/authority/separation-of-duties negatives and exclusivity. |
| `operation_effect_boundary_validation` | manual_pass | Scripted prefix and uncertainty-wording probe plus manual review of each affected_state item against the supplied evidence | manual_pass: no IN_TRANSACTION or OUTSIDE_TRANSACTION label is used because no transaction-membership evidence was supplied; the three consumers are EXTERNAL_OR_ASYNC on customer statement; everything else is UNKNOWN_UNVERIFIED. |
| `mcp_provenance_validation` | manual_pass | Manual comparison of each recorded tool, request parameters, mutation type, action class, phase and version basis with the actual response, plus scripted reference resolution | manual_pass: every source supports only content actually returned; no STAGE_LOCAL or REVERSIBLE_WRITE claim is made; inherited versions point to SRC-MCP-STATUS. |
| `planner_checks_validation` | manual_pass | Manual review plus scripted ID/field checks of planner_checks | manual_pass: three baseline planner checks present, proposed, with no operation IDs or control links. |
| `artifact_coherence_validation` | deferred_post_freeze | Deferred to the sidecar package_coherence field and the handoff record | Deferred post-freeze. |
| `timestamp_chronology_validation` | executed_pass | Custom Python check of validated_at against generated_at and revised_at | Passed: validated_at is later than generated_at; revised_at is null. |

Automated (custom helper scripts, not a JSON Schema engine): semantic reference, operation coverage, test-operation scope, Markdown/JSON consistency, timestamp chronology. Manual: format review, operation classification, authorization-path coverage, effect-boundary semantics, MCP provenance, planner checks. Not run: schema validation, format negative controls, ZIP integrity, customer runtime tests, external-client compatibility. Final frozen-byte checks and sidecar checks are reported separately in the handoff record.

## Artifact creation ledger

Supplemental audit sidecar: `artifact-creation-ledger.json` (separate from the nine canonical plan artifacts). The frozen plan files contain no post-freeze ledger status, counts, export status or coherence result.

| Field | Value |
|---|---|
| Sidecar version | 2.1.1 |
| Run ID | 2026-11-21T01:15:46Z |
| Attestation scope | Nine frozen plan artifacts and post-freeze sidecar checks |
| Post-freeze results | See the sidecar and final handoff evidence |

The main plan schema is Draft 2020-12 version `5.0.0`; the separate ledger sidecar schema is version `2.1.1`.

## Artifact integrity

The nine plan artifacts are frozen at the freeze step; the frozen state is recorded only in the sidecar and the handoff message. See `artifact-creation-ledger.json` for the candidate snapshot evidence, frozen hashes, export observations and post-freeze checks. This README does not claim that the package is complete or verified.

## Important limitations

This package is a design-time plan. It does not change customer data, authorize a live operation, deploy controls, or prove that the proposed controls are effective. The application owner must define domain policy and approval authority, implement the controls, and execute the proposed tests.
