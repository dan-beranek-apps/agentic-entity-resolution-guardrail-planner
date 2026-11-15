# Implementation Blueprint

**Package run ID:** 2026-11-15T17:25:14Z

## Architecture context

The only established context is a CRM holding two account records and an AI agent that proposes a MERGE. The CRM's persistence mechanism, transaction model, integrations and approval workflow are not described. The blueprint is therefore stack-neutral; no language, framework, OPA/Rego or Cedar guidance is given because the stack was not stated.

## Proposed components and responsibilities

| Point ID | Component | Responsibility | Inputs | Outputs | Owner | Status |
|---|---|---|---|---|---|---|
| IMPL-01 | Mutation planner (AI agent) interface | Prepares and submits a candidate MERGE proposal only; has no write path. | Candidate pair; Signals with provenance | Candidate record | unassigned (customer to designate) | unknown |
| IMPL-02 | Evidence admission and promotion service | Quarantine/admission, claim-specific promotion and conflict check per proposition. | Observations; Registry extract; Contract document | Evidence records with role, validity interval, validator and policy version | unassigned (customer to designate) | customer_action_required |
| IMPL-03 | Policy evaluator | Applies the customer's evidence standard, validity interval and approval policy once defined. | Evidence records; Policy version | Policy result with reasons | unassigned (customer to designate) | customer_action_required |
| IMPL-04 | Commit-boundary guard | Pre-execution and pre-persistence checks: scope binding, version binding, stale rejection, HOLD decisions. | Candidate; Policy result; Approval; Versions | Authorization decision bound to scope and versions, or HOLD with reasons | unassigned (customer to designate) | customer_action_required |
| IMPL-05 | Persistence adapter and transaction boundary | Performs the write only after the guard allows; owns the atomic unit and commit point once verified. | Authorized candidate; Idempotency key | Committed state or abort | unassigned (customer to designate) | unknown |
| IMPL-06 | Reconciliation and idempotency component | Read-after-failure reconciliation, idempotency handling, no blind retry. | Idempotency key; Authoritative state | Reconciled outcome | unassigned (customer to designate) | proposed |
| IMPL-07 | Recovery / compensation procedure and quarantine | Operation-specific tested compensation, or quarantine and escalation. | Reconciled state | Recovery or quarantine record | unassigned (customer to designate) | customer_action_required |
| IMPL-08 | Approval workflow | Operation-specific approval by authorized roles with separation of duties. | Candidate; Approval policy | Approval record | unassigned (customer to designate) | customer_action_required |
| IMPL-09 | Audit and lineage store | Immutable decision, approval and lineage records. | Events; Pre-merge snapshot | Audit records | unassigned (customer to designate) | proposed |

Status values follow Schema 5.0.0. None of these components is asserted to exist.

## Logical interface contract

### Request

Candidate ID; operation OP-01; mutation MERGE; both record identifiers and versions; entity class; proposition text; validity interval; evidence record IDs with role; policy, validator, evidence and graph/data versions; idempotency key; approval record ID; authorization path reference (Path A records or Path B policy/approval/SoD).

### Response

A decision of ALLOW AS DESIGNED, HOLD, DEFER, REQUIRE REVIEW or BLOCK with reasons per control, the bound scope and versions, and a record ID. A response is a design recommendation; it never performs a write.

### Error behaviour

Timeout, missing evidence, unavailable policy or validator, stale version and malformed input all fail closed (HOLD). An ambiguous commit outcome is reconciled with the idempotency key and an authoritative read before any retry.

## Implementation sequence

1. Customer resolves the blocking decisions in 07-assumptions-and-gaps.md, starting with the policy decisions GAP-05, GAP-07, GAP-09 and GAP-11.
2. Customer engineering verifies the write-set inventory, transaction coverage and commit point (GAP-01, GAP-02, GAP-10) in a non-production environment.
3. Implement the commit-boundary guard with pre-write HOLD gates (CTRL-01, CTRL-06, CTRL-07, CTRL-12, CTRL-13).
4. Implement evidence admission/promotion and the conflict check (CTRL-02 to CTRL-05).
5. Implement idempotency, reconciliation, abort and quarantine paths and, if Path A is pursued, a tested recovery procedure (CTRL-08 to CTRL-11).
6. Implement audit/lineage (CTRL-14) and execute the proposed tests in a non-production environment.

## Stack-specific notes

None; the customer's stack was not stated. Do not prescribe an isolation level or locking scheme generically; concurrency protection requires a database-specific design review (GAP-10).

## Operational concerns

- Authentication / service identity: agent identity distinct from approver identities; unresolved.
- Authorization: operation-specific approval (CTRL-12); undefined today.
- Idempotency: key bound to the authorized candidate (CTRL-10).
- Concurrency control (database-specific; distinguish isolation from atomicity): required invariant is protection against stale reads, lost updates and concurrent changes to either record; mechanism undetermined (GAP-10).
- Atomic write set and transaction boundary (list all persistent and external effects): unverified (GAP-01, GAP-02).
- Commit point and pre-commit invariant checks: unknown; invariants per CTRL-08.
- Ambiguous commit reconciliation and idempotency: CTRL-10.
- Logging and audit: CTRL-14.
- Monitoring: alert on HOLD volume, reconciliation outcomes and quarantines; not specified further.
- Rollback / compensation: transaction abort (pre-commit, verified atomic unit only) is distinct from post-commit compensation, which requires an operation-specific tested procedure (CTRL-09); none exists today.
- Data retention: DEC-02.
- Failure mode: pre-write HOLD / in-transaction abort / post-commit quarantine or proven compensation.
