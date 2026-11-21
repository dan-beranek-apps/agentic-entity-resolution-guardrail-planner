# Commit-Boundary Design

**Package run ID:** 2026-11-21T01:44:38Z

## Design objective

Protect the production MERGE OP-DEMO-2026-001 so that it can reach persistence only through a fail-closed guard that checks scope, evidence, conflicts, approvals, versions, write-set and atomicity proof and the authorization path before the first write, validates invariants before COMMIT, and reconciles after commit. The reference contract for a protected write requires pre-execution authorization and post-execution validation before commit; here that is a design for the customer application, not an implemented supervisor.

## Control sequence

1. **Candidate preparation:** capture OP-DEMO-2026-001, the identity proposition and the target scope (CTRL-01).
2. **Evidence readiness:** admit evidence to quarantine and promote only claim-specific eligible evidence (CTRL-02, CTRL-03).
3. **Conflict assessment:** claim-specific conflict check; contradictions block, indeterminate results go to adjudication (CTRL-04).
4. **Authority and scope:** two separate human approvals bound to the exact operation and state (CTRL-05); authorization path gate (CTRL-12).
5. **Version binding:** bind row versions 23 and 18, POL-MDM-07 v3.2, validator 1.6 and CRM-IDENTITY-5; recheck at the commit boundary (CTRL-06).
6. **Pre-persistence enforcement:** HOLD until write-set completeness and atomicity are proven (CTRL-07).
7. **Post-execution validation:** inside the transaction and snapshot, before COMMIT, evaluate invariants and abort on failure (CTRL-08).
8. **Atomic commit and recovery:** single transaction, exact commit point, post-commit validation and reconciliation, out-of-boundary failure handling and ambiguous-commit reconciliation (CTRL-09, CTRL-10, CTRL-11).

## Per-operation write set and atomicity

| Operation ID | Complete persistent write set | Inside atomic boundary | Outside / external / asynchronous effects | Transaction / equivalent mechanism | Exact commit point | Verification status / evidence |
|---|---|---|---|---|---|---|
| OP-DEMO-2026-001 | Seven declared tables plus undeclared plausible effects, all UNKNOWN_UNVERIFIED (see 01-mutation-scope.md) | None verified (membership is a customer requirement) | Search index, Billing read model and ERP crosswalk updates are customer-declared post-commit effects; none verified | Customer requirement: one PostgreSQL 16.5 SERIALIZABLE transaction; unverified | unknown / unverified - HOLD before first persistent write | Unverified; write-set completeness not confirmed by the customer |

Do not call the write set complete until the customer confirms the inventory. Atomicity is assessed separately from isolation and concurrency control: SERIALIZABLE does not by itself establish atomicity, and an atomic transaction does not by itself prevent stale reads, lost updates, write skew or phantoms on the link sets. Any later unmerge or publication would be a separate operation.

## Version and scope requirements

| Version / scope item | Required behaviour | Current application support | Gap |
|---|---|---|---|
| Data snapshot (row versions) | Bind 23 and 18; compare-and-set at commit; reject stale | Versions supplied; enforcement unknown | GAP-06 |
| Domain policy | Bind POL-MDM-07 v3.2; re-evaluate on change | Version supplied; binding unknown | GAP-06 |
| Evidence validator | Record validator identity and version in the promotion record; validator 1.6 pre-commit | Gateway and validator 1.6 declared; versions of the gateway not supplied | GAP-02, GAP-04 |
| Operation scope | Exact operation, direction, canonical record and effect scope | Operation ID supplied; enforcement unknown | GAP-03 |

## Failure behaviour

| Failure condition | Required application behaviour | Retry / review |
|---|---|---|
| Missing required evidence | HOLD | Obtain evidence; re-evaluate |
| Material unresolved conflict | HOLD and adjudicate | Data Steward |
| Scope mismatch | Block; new operation and authorization | New request |
| Stale state, policy or validator version | Reject authorization; re-evaluate from the start with a new record | Common retry budget; no replay |
| Validator unavailable | Fail closed | Restore validator |
| Atomicity or write-set completeness unverified before first write | HOLD; do not begin the persistent mutation | Prove boundary and inventory |
| Invariant fails before commit inside a verified atomic transaction | Abort transaction; confirm no writes committed | Re-evaluate; no blind retry |
| Failure after commit or outside the atomic boundary | Stop dependent writes; reconcile; proven same-operation compensation only, else quarantine and escalate | Recovery owner |
| Commit outcome ambiguous | No retry until authoritative reconciliation by idempotency key | Reconcile, then decide |
| Isolation level known but atomicity not established | Do not infer atomicity; keep pre-write HOLD | Assess separately |

These are design requirements for the customer application, not operations performed by this Skill.

## Integration points

MergeCoordinator 2.8.0 (intake, sequencing), pre-commit validator 1.6 (invariants; same-snapshot capability to be confirmed), PostgreSQL 16.5 transaction (commit point to be identified), transactional outbox and three consumers (idempotency unknown), audit_events, evidence gateway, and the not-yet-existing approval service, promotion service, commit-boundary guard, reconciliation service and authorization-path registry (see 05-implementation-blueprint.md).
