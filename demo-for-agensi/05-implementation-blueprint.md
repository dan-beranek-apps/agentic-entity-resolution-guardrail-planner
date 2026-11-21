# Implementation Blueprint

**Package run ID:** 2026-11-21T01:15:46Z

## Architecture context

Established from customer context only: a CRM on PostgreSQL 16.5 with MergeCoordinator 2.8.0, identity schema CRM-IDENTITY-5 and pre-commit validator 1.6; seven declared write-set tables including an append-only account_merge_history and a transactional_outbox; asynchronous outbox consumers for the CRM search index, the Billing customer read model and the ERP customer crosswalk. No other component is assumed to exist.

## Proposed components and responsibilities

| Point ID | Component | Responsibility | Inputs | Outputs | Owner | Status |
|---|---|---|---|---|---|---|
| IMPL-01 | MergeCoordinator 2.8.0 (candidate preparation and transaction owner) | Assemble the candidate operation, bind it to operation ID, idempotency key and versions, run the pre-write revalidation and execute the single SERIALIZABLE transaction. | Candidate records; Operation ID and idempotency key; Authorization record | Candidate operation; Transaction outcome | CRM Platform Owner (customer-stated role) | existing |
| IMPL-02 | Evidence admission and promotion service | Quarantine evidence, check conflicts, promote evidence for specific propositions and roles with recorded provenance and validator/policy version. | Registry extract; Verification record; Agreement, migration and crosswalk records | Promotion and validation record IDs per proposition | unassigned | unknown |
| IMPL-03 | Evidence-control record and verification of the registry extract | Verify signature and issuer certificate of the extract and tie the result to the exact extract. | Registry extract; Issuer certificate chain | Verification record with validator identity and version | Customer evidence-control function (name not supplied) | existing |
| IMPL-04 | Policy evaluator for POL-MDM-07 v3.2 | Evaluate exact registry ID, continuity, canonical-record and name-adoption requirements and the distinct-registry-ID prohibition. | Promoted evidence; Record attributes; Policy version | Policy evaluation result | unassigned | unknown |
| IMPL-05 | Approval service for Data Steward and CRM Platform Owner approvals | Create approval requests, capture two separate approvals bound to operation and state, and invalidate them on change. | Operation ID; Idempotency key; Versions; Evidence set; Write set | Bound approval records | Data Steward and CRM Platform Owner (customer-stated roles) | customer_action_required |
| IMPL-06 | Authorization-path service (Path A / Path B) | Record A1/A2/A3 or the Path B policy, approval and separation-of-duties basis and expire them on version drift. | A1/A2/A3 records; Path B policy and approval | Authorization-path decision | unassigned | customer_action_required |
| IMPL-07 | Pre-commit validator 1.6 | Validate the resulting state and evidence-to-claim support inside the transaction before COMMIT. | Candidate state inside the transaction; Authorization record | PASS or failure result | CRM Platform Owner (customer-stated role) | existing |
| IMPL-08 | Idempotency and ambiguous-commit reconciliation component | Persist the idempotency key inside the transaction and reconcile unknown outcomes by authoritative read before any retry. | Idempotency key; Merge-history, audit and outbox rows | Reconciliation record | unassigned | customer_action_required |
| IMPL-09 | Asynchronous outbox consumers (CRM search index, Billing customer read model, ERP customer crosswalk) | Apply committed outbox events idempotently after commit. | Outbox events | Updated projections; Delivery records | Consumer owners (not supplied) | existing |
| IMPL-10 | Post-commit validation and reconciliation job | Compare committed CRM state with the authorized operation and each consumer and report divergence. | Committed state; Consumer state | Reconciliation result | unassigned | customer_action_required |
| IMPL-11 | Quarantine and escalation procedure | Stop dependent mutations, quarantine affected accounts and projections and escalate to a named owner. | Failure signal; Affected IDs | Quarantine record; Escalation | unassigned | customer_action_required |
| IMPL-12 | Audit recording (audit_events) | Record operation, evidence, approvals, versions, decisions and outcomes. | Decision events | Audit records | CRM Platform Owner (customer-stated role) | existing |

Statuses use the Schema 5.0.0 values. 'existing' reflects only what the customer stated; it does not mean the component already implements these controls.

## Logical interface contract

### Request

The merge request supplies: operation ID OP-DEMO-2026-001; idempotency key demo-merge-1042-2097-v1; source and target account IDs; the identity proposition; promoted-evidence record IDs per proposition; approval record IDs for the Data Steward and CRM Platform Owner; authorization-path record (Path A or Path B); versions (row versions 18 and 23, CRM-IDENTITY-5, MergeCoordinator 2.8.0, validator 1.6, POL-MDM-07 v3.2); the declared write set.

### Response

A control result of ALLOW AS DESIGNED, HOLD, DEFER, REQUIRE REVIEW or BLOCK for each stage, with the failed control IDs, reasons and record IDs. ALLOW AS DESIGNED at one stage is never a commit authorization; only the complete sequence authorizes persistence in the customer's runtime.

### Error behaviour

Missing evidence, unreadable versions, unavailable policy or validator, timeouts and malformed input fail closed (HOLD or abort). A timeout or connection loss at or after COMMIT is an ambiguous outcome: reconcile by idempotency key before any retry. A stale authorization is rejected and re-evaluated with a new authorization record. Retries share one customer-defined budget.

## Implementation sequence

1. Prove the write set and atomic boundary and decide where historical names are stored (CTRL-08).
2. Decide the authorization path and its roles (CTRL-07).
3. Implement evidence admission and promotion and record the verification result tied to the exact extract (CTRL-01 to CTRL-04).
4. Implement bound approvals and revalidation (CTRL-06, CTRL-09).
5. Implement the in-transaction validator call, idempotency key persistence and commit-or-abort (CTRL-10).
6. Implement reconciliation, idempotent consumers, quarantine and recovery (CTRL-11 to CTRL-13).
7. Execute the proposed tests in a non-production environment with the same schema and record real evidence.

## Stack-specific notes

Grounded only in the stated PostgreSQL 16.5 stack and conceptual, not tested: a SERIALIZABLE transaction can fail with a serialization error, which aborts the transaction; this is an abort, not an ambiguous outcome. A connection loss around COMMIT is ambiguous and needs the idempotency reconciliation. Unique constraints on the idempotency key and on external identifiers are customer schema decisions that must be checked against account_external_ids and account_merge_history. Triggers and extensions with effects outside the transaction must be inventoried. No executable sample code or policy is provided because the application semantics are not supplied.

## Operational concerns

- Authentication / service identity: customer-defined; unknown.
- Authorization: two separate human approvals plus an authorization path; the Planner issues none.
- Idempotency: key demo-merge-1042-2097-v1 persisted inside the transaction (recommendation); a new authorization record needs a new key version.
- Concurrency control (database-specific; distinguish isolation from atomicity): SERIALIZABLE is the customer's stated choice; atomicity must be proven separately.
- Atomic write set and transaction boundary (list all persistent and external effects): see 04-commit-boundary-design.md; unverified.
- Commit point and pre-commit invariant checks: COMMIT after validator PASS; commit point unverified.
- Ambiguous commit reconciliation and idempotency: CTRL-11.
- Logging and audit: audit_events inside the transaction; promotion, approval and reconciliation records.
- Monitoring: alert on outbox lag, consumer divergence and quarantined accounts (recommendation).
- Rollback / compensation (distinguish transaction abort from post-commit compensation; require operation-specific evidence and tests): abort before commit only; no post-commit compensation is established.
- Data retention: customer-defined; account_merge_history is append-only.
- Failure mode (pre-write HOLD / in-transaction abort / post-commit quarantine or proven compensation): all three are specified in CTRL-08, CTRL-10 and CTRL-13.
