# Commit-Boundary Design

**Package run ID:** 2026-11-15T17:25:14Z

## Design objective

OP-01 is a protected production MERGE. The customer application must enforce its requirements at a commit-boundary guard before execution and before persistence, bind the authorization to the exact scope and versions, and fail closed. The reference profile's Phase 1 (pre-execution authorization) and Phase 2 (post-execution validation) checks are the conceptual model; they are a conceptual architecture, not an implemented supervisor, and no phase-contract version is claimed.

## Control sequence

1. **Candidate preparation:** capture OP-01, the proposition, both record identifiers and versions, entity class and declared effect scope (CTRL-01).
2. **Evidence readiness:** check claim-specific, authorization-eligible evidence for CLAIM-01 to CLAIM-04 (CTRL-02, CTRL-03).
3. **Conflict assessment:** evaluate conflicts, including the parent/holding indication; retain unresolved conflicts and defer (CTRL-04).
4. **Authority and scope:** operation-specific approval and authorization path A or B (CTRL-11, CTRL-12).
5. **Version binding:** bind graph/data, evidence, policy and validator versions; confirm the validity interval (CTRL-05, CTRL-13).
6. **Pre-persistence enforcement:** final checks, write-set and atomicity gates, idempotency key (CTRL-06, CTRL-07, CTRL-10).
7. **Post-execution validation:** where the architecture supports it, apply the writes to an isolated candidate result, re-derive the required claims, evaluate constraints and evidence-to-claim support under one consistent snapshot, and commit only on PASS with valid scope and versions (CTRL-08, CTRL-13). The customer has not described such a stage; this is a customer implementation task.
8. **Atomic commit and recovery:** see below; pre-write HOLD, pre-commit abort, post-commit/out-of-boundary compensation or quarantine, and ambiguous-commit reconciliation (CTRL-08, CTRL-09, CTRL-10).

## Per-operation write set and atomicity

| Operation ID | Complete persistent write set | Inside atomic boundary | Outside / external / asynchronous effects | Transaction / equivalent mechanism | Exact commit point | Verification status / evidence |
|---|---|---|---|---|---|---|
| OP-01 | Unconfirmed inventory (not asserted complete): 11 effect classes, all UNKNOWN_UNVERIFIED (see 01-mutation-scope.md) | None established | None established; search indexes and downstream integrations are suspected asynchronous but unverified | Not established | unknown / unverified - HOLD before first persistent write | Write-set completeness: unverified; atomicity: unknown (GAP-01, GAP-02) |

Use of the effect-boundary prefixes: `IN_TRANSACTION:` only where this exact effect is verified inside the identified atomic unit; `OUTSIDE_TRANSACTION:` only where confirmed outside; `EXTERNAL_OR_ASYNC:` only where the effect is known to exist; everything else `UNKNOWN_UNVERIFIED:`. This plan currently has only `UNKNOWN_UNVERIFIED:` entries. Staging isolation is a separate gate and is not claimed here.

## Version and scope requirements

| Version / scope item | Required behaviour | Current application support | Gap |
|---|---|---|---|
| Data / graph snapshot | Bind authorization to the snapshot of both records and relations; reject if changed | Unknown | GAP-10 |
| Evidence state and eligibility | Bind the active/quarantined evidence and eligibility version | Unknown | GAP-05, GAP-06 |
| Domain policy | Bind the policy version | No policy version identified | GAP-04, GAP-05 |
| Evidence validator | Bind the validator version and re-check at commit | Unknown | GAP-06 |
| Operation scope | Realized operation and effects must equal the authorized scope | Unknown | GAP-01 |

## Failure behaviour

| Failure condition | Required application behaviour | Retry / review |
|---|---|---|
| Missing required evidence | HOLD / DEFER | Gather evidence; re-evaluate from the start |
| Material unresolved conflict (including parent/holding indication) | HOLD / DEFER; retain conflict | Designated review |
| Scope mismatch | Block; require new authorization | New candidate |
| Stale state or policy version | Re-evaluate against the current version; do not replay the stale candidate | Re-authorize |
| Validator unavailable | Fail closed | Retry after restoration |
| Atomicity / write-set completeness unverified before first write (current state) | HOLD; do not begin the persistent mutation; do not rely on immediate rollback as a substitute | Resolve the transaction boundary and prove atomicity (GAP-01, GAP-02) |
| Required invariant fails before commit inside a verified atomic transaction | Abort transaction; confirm by authoritative read that no write committed (transaction abort, not compensation) | Re-evaluate; no blind retry |
| Failure or invariant breach after commit / outside atomic boundary | Stop dependent writes; reconcile state; use only documented, tested, operation-specific compensation, otherwise quarantine and escalate | Recovery owner and procedure (GAP-03); further changes stay on HOLD |
| Commit outcome ambiguous | Do not retry until authoritative reconciliation and idempotency check | Reconcile, then decide |
| Isolation level known but atomicity not established | Do not infer atomicity from isolation; keep pre-write HOLD | Assess atomicity and isolation separately |

These are design requirements for the customer application, not operations performed by this Skill.

## Integration points

All integration points are unknown or customer-owned: where the agent's proposal enters the CRM, the actual write path, the transaction boundary, the outbox/event mechanism, search indexing, downstream integrations, the approval workflow and the audit store. See 05-implementation-blueprint.md.
