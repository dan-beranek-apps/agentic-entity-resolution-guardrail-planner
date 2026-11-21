# Commit-Boundary Design

**Package run ID:** 2026-11-21T01:15:46Z

## Design objective

Specify how the single protected MERGE OP-DEMO-2026-001 may become persistent only after the customer application has enforced evidence, policy, approval, authorization-path, write-set and version requirements, and how failure, ambiguity and recovery are handled. These are design requirements; nothing here was executed.

## Control sequence

1. **Candidate preparation:** MergeCoordinator captures the operation ID OP-DEMO-2026-001, idempotency key demo-merge-1042-2097-v1, source row versions 18 and 23, identity proposition and declared write set.
2. **Evidence readiness:** claim-specific promotion of registry, verification and contract evidence (CTRL-01 to CTRL-04); internal mappings are context only.
3. **Conflict assessment:** contradictions, distinct registry IDs or later dissolution/succession block the candidate (CTRL-02, CTRL-04).
4. **Authority and scope:** two separate human approvals bound to the exact operation and state (CTRL-06) and exactly one authorization path (CTRL-07).
5. **Version binding:** row versions, CRM-IDENTITY-5, MergeCoordinator 2.8.0, pre-commit validator 1.6, POL-MDM-07 v3.2, evidence and eligibility state (CTRL-09).
6. **Pre-persistence enforcement:** proof of write-set completeness and atomicity before the first write (CTRL-08), then immediate revalidation (CTRL-09).
7. **Post-execution validation:** inside the transaction, the pre-commit validator checks the resulting state and evidence-to-claim support before COMMIT; commit only on PASS with valid scope and versions (CTRL-10).
8. **Atomic commit and recovery:** one SERIALIZABLE transaction; abort before commit leaves nothing committed; ambiguous outcomes are reconciled by idempotency key before any retry (CTRL-11); post-commit validation, consumer reconciliation, quarantine and tested recovery (CTRL-12, CTRL-13).

## Per-operation write set and atomicity

| Operation ID | Complete persistent write set | Inside atomic boundary | Outside / external / asynchronous effects | Transaction / equivalent mechanism | Exact commit point | Verification status / evidence |
|---|---|---|---|---|---|---|
| OP-DEMO-2026-001 | Declared: accounts, account_contact_links, account_contract_links, account_external_ids, account_merge_history, audit_events, transactional_outbox; plus unresolved: storage for historical names, other dependents of the account IDs (UNKNOWN_UNVERIFIED) | None proven. The customer requires all seven tables and the outbox insertion inside one SERIALIZABLE transaction; membership is not proven. | EXTERNAL_OR_ASYNC (customer-stated): CRM search index, Billing customer read model, ERP customer crosswalk, applied by outbox consumers after commit | Customer-required single SERIALIZABLE PostgreSQL 16.5 transaction via MergeCoordinator 2.8.0; not evidenced | unknown / unverified — HOLD before first persistent write (intended: COMMIT of that transaction) | Unverified; no dependency analysis or transaction evidence supplied; completeness not confirmed by the customer (DEC-04) |

Isolation level is not atomicity: SERIALIZABLE is the customer's stated concurrency choice and does not by itself establish write-set completeness or atomicity. Database-specific design review (PostgreSQL 16.5) is required to confirm that the stated mechanism protects against stale reads, lost updates and write skew for these tables, that serialization conflicts are handled as aborts, and that triggers or extensions have no effects outside the transaction.

## Version and scope requirements

| Version / scope item | Required behaviour | Current application support | Gap |
|---|---|---|---|
| Record state | Row versions 18 (CRM-ACCT-1042) and 23 (CRM-ACCT-2097) must be unchanged and both active at write time | Row versions supplied; check implementation unknown | Verify optimistic check in MergeCoordinator |
| Identity schema | CRM-IDENTITY-5 at authorization and write | Stated | Revalidation not evidenced |
| Coordinator and validator | MergeCoordinator 2.8.0 and pre-commit validator 1.6 | Stated (validator patch level not given) | Revalidation not evidenced |
| Domain policy | POL-MDM-07 v3.2 | Summary supplied | Policy text not supplied; owner not named |
| Evidence and eligibility | Promotion records unchanged since approval | Unknown | No promotion service evidenced |
| Operation scope | Realized write set must equal the authorized write set | Unknown | No scope-match check evidenced |

## Failure behaviour

| Failure condition | Required application behaviour | Retry / review |
|---|---|---|
| Missing required evidence | HOLD; no write | Obtain evidence; new authorization record |
| Material unresolved conflict or distinct registry IDs | HOLD or block; quarantine the observation | Designated adjudication |
| Scope mismatch | Block; require new authorization | New authorization record |
| Stale state, schema, coordinator, validator or policy version | Reject authorization; re-evaluate from the evidence stage | New authorization record; common retry budget |
| Validator unavailable | Fail closed; abort | Retry only after revalidation |
| Atomicity / write-set completeness unverified before first write | HOLD; do not begin the persistent mutation | Prove atomicity and completeness (CTRL-08) |
| Required invariant fails before commit inside the transaction | Abort the transaction; confirm no writes committed | Re-evaluate; no blind retry |
| Failure or breach after commit or outside the atomic boundary | Stop dependent writes; reconcile; use only proven same-operation compensation, otherwise quarantine and escalate | Recovery owner (unassigned) |
| Commit outcome ambiguous | Do not retry until authoritative state is read by idempotency key | Reconcile, then decide |
| Isolation level known but atomicity not established | Do not infer atomicity; keep pre-write HOLD | Assess atomicity and isolation separately |

## Integration points

| Point ID | Component | Status |
|---|---|---|
| IMPL-01 | MergeCoordinator 2.8.0 (candidate preparation and transaction owner) | existing |
| IMPL-02 | Evidence admission and promotion service | unknown |
| IMPL-03 | Evidence-control record and verification of the registry extract | existing |
| IMPL-04 | Policy evaluator for POL-MDM-07 v3.2 | unknown |
| IMPL-05 | Approval service for Data Steward and CRM Platform Owner approvals | customer_action_required |
| IMPL-06 | Authorization-path service (Path A / Path B) | customer_action_required |
| IMPL-07 | Pre-commit validator 1.6 | existing |
| IMPL-08 | Idempotency and ambiguous-commit reconciliation component | customer_action_required |
| IMPL-09 | Asynchronous outbox consumers (CRM search index, Billing customer read model, ERP customer crosswalk) | existing |
| IMPL-10 | Post-commit validation and reconciliation job | customer_action_required |
| IMPL-11 | Quarantine and escalation procedure | customer_action_required |
| IMPL-12 | Audit recording (audit_events) | existing |

Owners of unknown or customer-action-required components are unresolved and must be assigned by the customer.
