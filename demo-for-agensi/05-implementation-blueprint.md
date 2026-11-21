# Implementation Blueprint

**Package run ID:** 2026-11-21T01:44:38Z

## Architecture context

Established from customer context only: MergeCoordinator 2.8.0, PostgreSQL 16.5, identity schema CRM-IDENTITY-5, pre-commit validator 1.6, an evidence gateway, a transactional outbox with three asynchronous consumers, and the seven declared tables. Everything else is proposed or customer-owned.

## Proposed components and responsibilities

| Point ID | Component | Responsibility | Inputs | Outputs | Owner | Status |
|---|---|---|---|---|---|---|
| IMPL-01 | MergeCoordinator 2.8.0 | Customer-declared coordinator of the merge: receive the request, bind operation and scope, sequence the controls and the single transaction. | Candidate operation; Authorization record | Operation record; Commit or abort outcome | unassigned | existing |
| IMPL-02 | Customer evidence gateway | Customer-declared service that reported signature and issuer-certificate verification of the registry extract; supply validator identity and version to the promotion record. | Registry extract | Verification result with validator identity and version | unassigned | existing |
| IMPL-03 | Evidence admission and promotion service | Quarantine admission, conflict check and claim-specific promotion with recorded provenance, role, temporal applicability and validator version. | Evidence items; Policy version | Eligible-evidence record IDs; Conflict status | unassigned | customer_action_required |
| IMPL-04 | POL-MDM-07 policy evaluator | Evaluate the registry-ID and continuity rules, retain-canonical rule and name-adoption rule against eligible evidence. | Eligible evidence; Operation record | Policy decision with policy version | unassigned (MDM policy owner) | customer_action_required |
| IMPL-05 | Approval service | Collect and validate separate Data Steward and CRM Platform Owner approvals bound to the exact operation and state. | Operation record; Binding fields | Bound approval records | Data Steward and CRM Platform Owner (approvers) | customer_action_required |
| IMPL-06 | Pre-commit validator 1.6 | Customer-declared validator; confirm that it can evaluate the listed invariants inside the same transaction and snapshot before COMMIT. | Uncommitted transaction state; Invariant list | Invariant results | unassigned | existing |
| IMPL-07 | Commit-boundary guard | Verify operation, scope, evidence, conflicts, approvals, versions, write-set and atomicity proof and authorization path before the first write and at the commit boundary; fail closed. | Operation record; Evidence record IDs; Approvals; Version snapshots; Path A or Path B record | Allow or HOLD decision with reasons | unassigned | customer_action_required |
| IMPL-08 | PostgreSQL 16.5 persistence adapter and transaction | Customer-declared single SERIALIZABLE transaction over the declared tables and outbox insertion; identify the exact commit point; compare-and-set on row versions. | Approved operation | Committed or aborted state | unassigned | existing |
| IMPL-09 | Transactional outbox and consumers (search index, Billing read model, ERP crosswalk) | Customer-declared asynchronous consumers after commit; require idempotent, replay-safe processing and reconciliation. | Outbox events | Consumer updates; Delivery status | unassigned | existing |
| IMPL-10 | Reconciliation and recovery service | Post-commit validation, ambiguous-commit reconciliation by idempotency key, downstream reconciliation, quarantine and escalation. | Idempotency key; Authoritative state; Consumer status | Reconciliation record; Quarantine or closure | unassigned | customer_action_required |
| IMPL-11 | Audit trail (audit_events and retention) | Record every gate decision, rejection and outcome, including rejections recorded outside an aborted transaction. | Gate decisions; Outcomes | Audit records | unassigned | existing |
| IMPL-12 | Authorization-path registry | Hold A1, A2 and A3 evidence and the Path B policy, approval and separation-of-duties records, with version-drift expiry. | Recovery mechanism, test and attestation records; Path B policy and approval | Path A or Path B eligibility with expiry | unassigned (customer to designate) | customer_action_required |

Status `existing` means customer-declared; behaviour is not verified. Do not imply these components already enforce the controls.

## Logical interface contract

### Request

Operation ID OP-DEMO-2026-001, idempotency key demo-merge-1042-2097-v1, mutation MERGE, source CRM-ACCT-2097, canonical CRM-ACCT-1042, source and canonical row versions, policy and validator versions, eligible-evidence record IDs, both approval records, and the Path A or Path B record.

### Response

A design-level decision: ALLOW AS DESIGNED only when every control is satisfied, otherwise HOLD, DEFER or REQUIRE REVIEW, with the failing control IDs and reasons. This is a customer-implementation output, not a runtime verdict from this plan.

### Error behaviour

Timeout, missing evidence, unavailable policy or validator, stale version and malformed input all fail closed. A serialization failure is a definite abort and leads to re-evaluation within the common retry budget. A lost connection around COMMIT is an ambiguous outcome and must be reconciled by idempotency key before any retry.

## Implementation sequence

1. Verify the write set and the transaction boundary (GAP-03, GAP-04).
2. Define evidence eligibility, validator and approvers (GAP-01, GAP-02).
3. Decide Path A or Path B (GAP-05).
4. Build the commit-boundary guard, version binding and approval binding (GAP-06).
5. Build reconciliation, idempotency and consumer idempotency (GAP-07, GAP-08).
6. Execute the proposed tests and review before any production use.

## Stack-specific notes

Conceptual, grounded only in the declared PostgreSQL 16.5: a SERIALIZABLE transaction can fail with a serialization failure, in which case the whole transaction must be retried from a fresh snapshot; a connection loss during COMMIT leaves the outcome unknown. These are generic database behaviours, not claims about this application. Adequacy of SERIALIZABLE for the link-set anomalies needs database-specific design review.

## Operational concerns

- Authentication / service identity: unassigned; approvers must be authenticated human principals.
- Authorization: two separate role-bound approvals plus the authorization-path record.
- Idempotency: persist and enforce demo-merge-1042-2097-v1; same key with different content is rejected.
- Concurrency control (database-specific; distinguish isolation from atomicity): compare-and-set on both account rows and the link sets; SERIALIZABLE is a customer requirement.
- Atomic write set and transaction boundary: seven declared tables plus outbox insertion; unverified; external consumers outside.
- Commit point and pre-commit invariant checks: the COMMIT of one transaction after validator 1.6 passes in the same snapshot.
- Ambiguous commit reconciliation and idempotency: read-after-failure by key before any retry.
- Logging and audit: log every gate decision and rejection, including rejections outside an aborted transaction.
- Monitoring: alert on outbox lag, consumer failure and reconciliation divergence.
- Rollback / compensation: transaction abort before commit is not post-commit compensation; post-commit recovery requires a documented, tested, operation-specific procedure, otherwise quarantine and escalate.
- Data retention: unassigned (GAP-10).
- Failure mode: pre-write HOLD, in-transaction abort, post-commit quarantine or proven compensation.
