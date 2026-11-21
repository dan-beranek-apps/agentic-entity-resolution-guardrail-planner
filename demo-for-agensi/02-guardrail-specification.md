# Guardrail Specification

**Package run ID:** 2026-11-21T01:44:38Z

## Summary

One protected operation (OP-DEMO-2026-001) is governed by 12 controls. Default for any unresolved, indeterminate, stale or unverified condition is HOLD (fail closed). Decision terms are design recommendations, not runtime verdicts. The controls cover evidence eligibility, the registry-ID and continuity gate with a negative control, separate bound approvals, version and scope binding, pre-write proof of write-set completeness and atomicity, pre-commit invariant abort, post-commit validation and reconciliation, out-of-boundary failure handling, ambiguous-commit reconciliation, and the Path A / Path B authorization gate. Action class is IRREVERSIBLE_WRITE; Path A would change factual reversibility only, never the class. Path A and Path B apply only to this protected operation.

## Control register

| Control ID | Operation | Trigger | Required action | Enforcement point | Failure behaviour | Validation |
|---|---|---|---|---|---|---|
| CTRL-01 | OP-DEMO-2026-001 | Any request to execute OP-DEMO-2026-001 or any change to its source, target, direction, canonical record or effect scope. | Before evidence evaluation and again immediately before the first persistent write, verify and record that the request is exactly MERGE of source CRM-ACCT-2097 into canonical CRM-ACCT-1042 (policy retains CRM-ACCT-1042), classified on the protected IRREVERSIBLE_WRITE path, with operation ID OP-DEMO-2026-001, idempotency key demo-merge-1042-2097-v1 and the declared effect scope. The agent or planner must not weaken, substitute or expand the required propositions or the effect scope. Any difference in direction, record IDs, canonical choice, added accounts or write-set members requires a new operation and fresh authorization. | Pre-persistence: MergeCoordinator request intake and the commit-boundary guard, before any approval request and again immediately before the first persistent write. | Fail closed: begin no persistent write and record the rejection in the audit trail. | TEST-SCOPE-01, TEST-APPR-02 |
| CTRL-02 | OP-DEMO-2026-001 | Any proposal to treat two CRM accounts as one identity. | Require for each candidate an exact official registry ID that matches the authoritative registry record, and separate evidence of legal continuity (a name change without dissolution, successor or new incorporation) applicable to the interval in scope. Names, domains, addresses and contact similarity are context only and never satisfy the gate. Candidates whose official registry IDs differ must not be merged regardless of similarity; the supplied policy defines no exception route, so an exception request is held for a customer policy decision. | Pre-persistence: evidence gate in the commit-boundary guard, before approval requests. | Fail closed: no promotion of the identity claim and no write. | TEST-EVID-01, TEST-EVID-02, TEST-EVID-03 |
| CTRL-03 | OP-DEMO-2026-001 | Any evidence item offered for the identity-continuity proposition. | Admit each item first to quarantine, check admission conflicts, and promote only claim-specific eligible evidence with recorded source, proposition, evidentiary role (support, contradiction or unresolved), temporal applicability, validation basis, and validator and policy version. Do not count records that share an upstream origin (the migration report and the crosswalk) as independent proof. Treat a supplied signature-verification result as authentication of its source document only, not as separate identity evidence. Do not rely on planner confidence, repetition, an agent-generated verified label, or the absence of a detected conflict as support. | Pre-persistence: evidence admission and promotion service feeding the commit-boundary guard. | Validator unavailable or promotion record missing: fail closed. | TEST-EVID-01, TEST-EVID-03, TEST-EVID-04, TEST-EVID-06, TEST-EVID-07 |
| CTRL-04 | OP-DEMO-2026-001 | Evaluation of the identity-continuity proposition and again at the commit boundary. | Run a claim-specific conflict check across eligible, active-unverified and quarantined evidence. Clear only when no unresolved material conflict remains. A contradiction (for example dissolution, a successor entity, a different registration number or a new incorporation) blocks the merge; indeterminate or unverified evidence blocks commit and routes to human adjudication. Absence of a detected conflict is never positive support. | Pre-persistence: conflict check in the commit-boundary guard. | Fail closed. | TEST-EVID-01, TEST-EVID-05, TEST-EVID-06 |
| CTRL-05 | OP-DEMO-2026-001 | A request for commit authorization of OP-DEMO-2026-001. | Require two separate human approvals, one from a Data Steward and one from a CRM Platform Owner, each bound to OP-DEMO-2026-001, the exact operation (MERGE of CRM-ACCT-2097 into CRM-ACCT-1042), idempotency key demo-merge-1042-2097-v1, source and canonical row versions (23 and 18), POL-MDM-07 v3.2, pre-commit validator 1.6 and the eligible-evidence record IDs. An approval is invalid if any bound element changes, if it is issued by an unauthorized or non-human principal, or if it precedes satisfaction of the evidence and write-set gates. No approval artifacts are currently supplied. | Pre-persistence: approval service and commit-boundary guard, rechecked at the commit boundary. | Fail closed: no write without both valid approvals. | TEST-APPR-01, TEST-APPR-02, TEST-APPR-03 |
| CTRL-06 | OP-DEMO-2026-001 | Authorization time and again at the commit boundary. | Bind and recheck source row version 23, canonical row version 18, POL-MDM-07 v3.2, pre-commit validator 1.6, identity schema CRM-IDENTITY-5 and the evidence eligibility state. Use compare-and-set or equivalent predicates on both account rows and on the link sets being re-pointed. Reject a stale authorization and re-evaluate from the beginning with a new authorization record (no replay) within one common retry budget. The SERIALIZABLE requirement is a customer requirement; whether it is sufficient against stale reads, lost updates, write skew and phantoms on the link sets needs database-specific design review, and isolation is assessed separately from atomicity. | Pre-persistence: commit-boundary guard and persistence adapter, at authorization and at the commit boundary. | Fail closed; no replay of the stale candidate. | TEST-VER-01, TEST-VER-02, TEST-ATOM-04 |
| CTRL-07 | OP-DEMO-2026-001 | Before the first persistent write of OP-DEMO-2026-001. | Require customer-verified evidence that (a) the persistent write set is complete: the seven declared tables plus every dependent record, foreign-key action, trigger, historical-name store and source-record disposition; (b) all database writes and the outbox insertion occur in one identified PostgreSQL transaction with an identified exact commit point; and (c) external and asynchronous effects are inventoried. Otherwise HOLD: begin no partial sequence of writes and do not rely on later rollback. Atomicity is not inferred from a database product, an isolation level or a sequence of application calls. | Pre-persistence: MergeCoordinator readiness gate, before the transaction begins. | Fail closed: no write begins. | TEST-ATOM-01, TEST-ATOM-02 |
| CTRL-08 | OP-DEMO-2026-001 | After the merge writes are applied inside the transaction and before COMMIT. | Evaluate the invariants and abort the whole transaction if any fails: the realized operation equals the authorized scope; the canonical record remains CRM-ACCT-1042; the current legal name is adopted with historical names and provenance preserved; account_merge_history is append-only (no update or delete); historical activity keeps original account IDs; source contract links are re-pointed so that no active contract is lost (inference from supplied counts: eight active contract links on the canonical record, subject to the confirmed inventory); contact links follow an approved duplicate rule; registry-ID and external-ID uniqueness holds; audit and outbox rows are present; bound versions are still valid. On abort, confirm that none of the transaction's writes are visible. | Pre-commit: pre-commit validator 1.6 evaluated inside the same transaction and snapshot (to be confirmed by the customer), before COMMIT. | Abort the transaction (not a post-commit compensation) and confirm that no writes committed. | TEST-ATOM-03, TEST-ATOM-04, TEST-HIST-01 |
| CTRL-09 | OP-DEMO-2026-001 | After the merge transaction commits. | Read authoritative state and compare it with the authorized effect (adopted name, historical names, link counts, merge-history, audit and outbox rows). Track each outbox event through the CRM search-index, Billing customer read-model and ERP customer-crosswalk consumers with idempotent, replay-safe processing, and reconcile each against authoritative state; report divergence. Consumer updates happen outside the database transaction and must not be described as covered by it. | Post-commit: reconciliation service and outbox consumers. | Apply CTRL-10. | TEST-POST-01, TEST-POST-02 |
| CTRL-10 | OP-DEMO-2026-001 | An invariant failure or consumer failure detected after commit or outside the atomic boundary. | Stop dependent mutations, including further merges that involve either account; reconcile the actual persisted state; and apply only a documented, tested, operation-specific compensation or recovery procedure. If none is established, quarantine the affected records and events and escalate to the designated owner, keeping the overall decision on HOLD for further changes. Do not claim that a database rollback reverses committed or external effects; do not treat another operation as recovery unless it independently satisfies A1, A2 and A3. | Post-commit: reconciliation and recovery service; incident escalation path. | Quarantine and escalate; no assumed rollback. | TEST-POST-01, TEST-POST-02 |
| CTRL-11 | OP-DEMO-2026-001 | A timeout, connection loss or other failure that leaves the commit outcome uncertain, or a repeated request. | Persist and enforce idempotency key demo-merge-1042-2097-v1 (or an equivalent operation identifier) with the operation record. On an ambiguous commit outcome, do not retry; first reconcile authoritative state using the key and a read-after-failure check of the account rows, merge history, audit and outbox rows. Retry only after confirming that the original operation did not commit and that retry is safe, under the common retry budget and with fresh authorization when the snapshot changed. A duplicate request with the same key after a successful commit returns the recorded outcome and performs no second merge. | Cross-phase: MergeCoordinator outcome handler and persistence adapter. | No blind retry. | TEST-AMB-01, TEST-IDEM-01 |
| CTRL-12 | OP-DEMO-2026-001 | A request for commit authorization of OP-DEMO-2026-001. | Treat OP-DEMO-2026-001 as IRREVERSIBLE_WRITE with factual reversibility unknown, and HOLD unless exactly one authorization path is established. Path A: A1 a documented recovery or compensation mechanism for this exact operation covering the complete production effect scope; A2 successful recovery tests on materially equivalent state and schema at current persistence, policy and validator versions; A3 attestation by a customer-designated responsible role. Path B (only when Path A is not established): a current explicit customer policy accepting this exact operation's non-recovery risk, operation-specific approval by an authorized role, and customer-defined separation of duties. Path A changes factual reversibility only; neither path changes the action class or replaces CTRL-01 through CTRL-11. Ordinary Data Steward and CRM Platform Owner approval does not count as acceptance of non-recovery risk. After Path A is established for the complete scope, Path B is unavailable for that scope. Path A eligibility expires on relevant version or scope drift, or when A2 or A3 goes stale. | Pre-persistence: authorization-path registry consulted by the commit-boundary guard. | Fail closed. | TEST-PATHA-POS, TEST-PATHA-A1, TEST-PATHA-A2, TEST-PATHA-A3, TEST-PATHB-POS, TEST-PATHB-POLICY, TEST-PATHB-AUTH, TEST-PATHB-SOD, TEST-PATH-EXCL |

## CTRL-01 — Operation, scope and action-class binding

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** Any request to execute OP-DEMO-2026-001 or any change to its source, target, direction, canonical record or effect scope.
- **Required action:** Before evidence evaluation and again immediately before the first persistent write, verify and record that the request is exactly MERGE of source CRM-ACCT-2097 into canonical CRM-ACCT-1042 (policy retains CRM-ACCT-1042), classified on the protected IRREVERSIBLE_WRITE path, with operation ID OP-DEMO-2026-001, idempotency key demo-merge-1042-2097-v1 and the declared effect scope. The agent or planner must not weaken, substitute or expand the required propositions or the effect scope. Any difference in direction, record IDs, canonical choice, added accounts or write-set members requires a new operation and fresh authorization.
- **Required evidence:** Operation request record bound to OP-DEMO-2026-001; Declared effect scope (write set and out-of-transaction effects); Retain-canonical rule from POL-MDM-07 v3.2
- **Approval requirement:** None at this control; separate human approvals are required by CTRL-05.
- **Enforcement point:** Pre-persistence: MergeCoordinator request intake and the commit-boundary guard, before any approval request and again immediately before the first persistent write.
- **On sufficient support:** Continue to the remaining controls; this control alone never authorizes the write.
- **On conflict:** Block the request and require a new operation ID and fresh evaluation.
- **On indeterminate / insufficient evidence:** HOLD; an unclassifiable or ambiguous effect class is treated as protected.
- **On stale version / failed validation:** Fail closed: begin no persistent write and record the rejection in the audit trail.
- **Requirement origin:** Customer-supplied (retain-canonical rule, operation scope) plus reference-derived design requirement (planner cannot weaken or expand required propositions or effect scope)
- **Owner / component:** unassigned (customer to designate)
- **Validation:** TEST-SCOPE-01, TEST-APPR-02
- **Provenance:** SRC-POLICY-MDM-07, SRC-APP-CONTEXT, SRC-MCP-PROFILE, SRC-MCP-PH1

## CTRL-02 — Registry-ID and legal-continuity identity gate (including negative control)

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** Any proposal to treat two CRM accounts as one identity.
- **Required action:** Require for each candidate an exact official registry ID that matches the authoritative registry record, and separate evidence of legal continuity (a name change without dissolution, successor or new incorporation) applicable to the interval in scope. Names, domains, addresses and contact similarity are context only and never satisfy the gate. Candidates whose official registry IDs differ must not be merged regardless of similarity; the supplied policy defines no exception route, so an exception request is held for a customer policy decision.
- **Required evidence:** Official registry ID confirmed against the authoritative registry for each candidate; Evidence of legal continuity for the validity interval in scope; Recorded context-only treatment of name, domain, address and contact similarity
- **Approval requirement:** None at this control.
- **Enforcement point:** Pre-persistence: evidence gate in the commit-boundary guard, before approval requests.
- **On sufficient support:** Pass this gate only; continue to CTRL-03 through CTRL-12.
- **On conflict:** Registry IDs differ or continuity is contradicted: block the merge; route any exception request to the customer policy owner.
- **On indeterminate / insufficient evidence:** Registry ID or continuity evidence missing or unverified: HOLD and request evidence; similarity is not a substitute.
- **On stale version / failed validation:** Fail closed: no promotion of the identity claim and no write.
- **Requirement origin:** Customer-supplied (exact registry ID and legal-continuity requirement; similarity not sufficient) plus reference-derived design requirement; the different-registry-ID negative control is a planner recommendation derived from the customer rule
- **Owner / component:** Data Steward (per POL-MDM-07 role); policy owner unassigned
- **Validation:** TEST-EVID-01, TEST-EVID-02, TEST-EVID-03
- **Provenance:** SRC-POLICY-MDM-07, SRC-CAND-RECORDS, SRC-REG-001, SRC-MCP-PROFILE

## CTRL-03 — Evidence eligibility: provenance, independence and temporal applicability

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** Any evidence item offered for the identity-continuity proposition.
- **Required action:** Admit each item first to quarantine, check admission conflicts, and promote only claim-specific eligible evidence with recorded source, proposition, evidentiary role (support, contradiction or unresolved), temporal applicability, validation basis, and validator and policy version. Do not count records that share an upstream origin (the migration report and the crosswalk) as independent proof. Treat a supplied signature-verification result as authentication of its source document only, not as separate identity evidence. Do not rely on planner confidence, repetition, an agent-generated verified label, or the absence of a detected conflict as support.
- **Required evidence:** Source and provenance record for each item; Validator identity and version, and the policy that makes the item eligible; Temporal applicability against the validity interval and a customer-defined currency window; Dependency map showing shared upstream origins
- **Approval requirement:** Evidence eligibility rules are a customer policy decision (see GAP-02).
- **Enforcement point:** Pre-persistence: evidence admission and promotion service feeding the commit-boundary guard.
- **On sufficient support:** Eligible evidence is recorded per proposition and passed to the conflict check.
- **On conflict:** Contested items stay quarantined for policy-designated adjudication.
- **On indeterminate / insufficient evidence:** Unverified, stale or non-independent items are not authorization-eligible: HOLD or refresh.
- **On stale version / failed validation:** Validator unavailable or promotion record missing: fail closed.
- **Requirement origin:** Reference-derived design requirement (admission and claim-specific promotion) applied to the customer evidence; independence rules are explicit in the task input
- **Owner / component:** unassigned (customer evidence validator owner)
- **Validation:** TEST-EVID-01, TEST-EVID-03, TEST-EVID-04, TEST-EVID-06, TEST-EVID-07
- **Provenance:** SRC-MCP-EVID, SRC-REG-001, SRC-REG-VERIFY-005, SRC-LEGAL-002, SRC-MIGRATION-003, SRC-CROSSWALK-004, SRC-POLICY-MDM-07

## CTRL-04 — Claim-specific conflict and indeterminate-evidence handling

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** Evaluation of the identity-continuity proposition and again at the commit boundary.
- **Required action:** Run a claim-specific conflict check across eligible, active-unverified and quarantined evidence. Clear only when no unresolved material conflict remains. A contradiction (for example dissolution, a successor entity, a different registration number or a new incorporation) blocks the merge; indeterminate or unverified evidence blocks commit and routes to human adjudication. Absence of a detected conflict is never positive support.
- **Required evidence:** Conflict-check result with evidence record IDs; Adjudication record when a conflict or indeterminate result occurs
- **Approval requirement:** Adjudication authority is a customer decision (see GAP-02).
- **Enforcement point:** Pre-persistence: conflict check in the commit-boundary guard.
- **On sufficient support:** Conflict status clear: continue to remaining controls.
- **On conflict:** Block the merge and retain the conflict for adjudication.
- **On indeterminate / insufficient evidence:** Block commit and route to human adjudication; do not treat as clear.
- **On stale version / failed validation:** Fail closed.
- **Requirement origin:** Reference-derived design requirement; customer policy requires legal-continuity evidence
- **Owner / component:** Data Steward (per POL-MDM-07 role)
- **Validation:** TEST-EVID-01, TEST-EVID-05, TEST-EVID-06
- **Provenance:** SRC-MCP-EVID, SRC-MCP-PH1, SRC-MCP-PROFILE

## CTRL-05 — Separate human approvals bound to the exact operation and state

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** A request for commit authorization of OP-DEMO-2026-001.
- **Required action:** Require two separate human approvals, one from a Data Steward and one from a CRM Platform Owner, each bound to OP-DEMO-2026-001, the exact operation (MERGE of CRM-ACCT-2097 into CRM-ACCT-1042), idempotency key demo-merge-1042-2097-v1, source and canonical row versions (23 and 18), POL-MDM-07 v3.2, pre-commit validator 1.6 and the eligible-evidence record IDs. An approval is invalid if any bound element changes, if it is issued by an unauthorized or non-human principal, or if it precedes satisfaction of the evidence and write-set gates. No approval artifacts are currently supplied.
- **Required evidence:** Data Steward approval record; CRM Platform Owner approval record; Binding fields (operation, key, row versions, policy and validator versions, evidence record IDs)
- **Approval requirement:** Data Steward and CRM Platform Owner, separately; whether one person may hold both roles is not stated (see GAP-01).
- **Enforcement point:** Pre-persistence: approval service and commit-boundary guard, rechecked at the commit boundary.
- **On sufficient support:** Approval gate passes; the commit still requires every other control.
- **On conflict:** A reviewer records a conflict: HOLD and return to evidence adjudication.
- **On indeterminate / insufficient evidence:** Approval missing, incomplete or unbound: HOLD.
- **On stale version / failed validation:** Fail closed: no write without both valid approvals.
- **Requirement origin:** Customer-supplied (two separate approvals bound to operation and state); binding fields are a reference-derived design requirement
- **Owner / component:** Data Steward and CRM Platform Owner (approvers); approval service owner unassigned
- **Validation:** TEST-APPR-01, TEST-APPR-02, TEST-APPR-03
- **Provenance:** SRC-POLICY-MDM-07, SRC-MCP-PH1, SRC-APP-CONTEXT

## CTRL-06 — Version binding and stale-state check

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** Authorization time and again at the commit boundary.
- **Required action:** Bind and recheck source row version 23, canonical row version 18, POL-MDM-07 v3.2, pre-commit validator 1.6, identity schema CRM-IDENTITY-5 and the evidence eligibility state. Use compare-and-set or equivalent predicates on both account rows and on the link sets being re-pointed. Reject a stale authorization and re-evaluate from the beginning with a new authorization record (no replay) within one common retry budget. The SERIALIZABLE requirement is a customer requirement; whether it is sufficient against stale reads, lost updates, write skew and phantoms on the link sets needs database-specific design review, and isolation is assessed separately from atomicity.
- **Required evidence:** Version snapshot recorded at authorization; Current-version snapshot at the commit boundary; Customer-defined retry budget
- **Approval requirement:** Re-approval is required when a bound version changes.
- **Enforcement point:** Pre-persistence: commit-boundary guard and persistence adapter, at authorization and at the commit boundary.
- **On sufficient support:** All bound versions match: continue.
- **On conflict:** A bound version changed or a competing change is detected: reject the authorization and re-evaluate.
- **On indeterminate / insufficient evidence:** Versions cannot be read or compared: HOLD.
- **On stale version / failed validation:** Fail closed; no replay of the stale candidate.
- **Requirement origin:** Customer-supplied (current row versions) plus reference-derived design requirement (version-bound authorization; no replay of a stale candidate)
- **Owner / component:** unassigned (customer to designate)
- **Validation:** TEST-VER-01, TEST-VER-02, TEST-ATOM-04
- **Provenance:** SRC-MCP-PH1, SRC-MCP-PH2, SRC-APP-CONTEXT

## CTRL-07 — Pre-write HOLD until write-set completeness and atomicity are proven

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** Before the first persistent write of OP-DEMO-2026-001.
- **Required action:** Require customer-verified evidence that (a) the persistent write set is complete: the seven declared tables plus every dependent record, foreign-key action, trigger, historical-name store and source-record disposition; (b) all database writes and the outbox insertion occur in one identified PostgreSQL transaction with an identified exact commit point; and (c) external and asynchronous effects are inventoried. Otherwise HOLD: begin no partial sequence of writes and do not rely on later rollback. Atomicity is not inferred from a database product, an isolation level or a sequence of application calls.
- **Required evidence:** Verified write-set inventory; Evidence identifying the transaction, its scope and the exact commit point; Inventory of asynchronous and external effects
- **Approval requirement:** Customer sign-off on the inventory (see GAP-03 and GAP-04).
- **Enforcement point:** Pre-persistence: MergeCoordinator readiness gate, before the transaction begins.
- **On sufficient support:** Inventory and atomicity verified: continue to the remaining controls.
- **On conflict:** An undeclared dependent or a second commit is found: HOLD and correct the inventory.
- **On indeterminate / insufficient evidence:** Unknown or unverified boundary or inventory: HOLD.
- **On stale version / failed validation:** Fail closed: no write begins.
- **Requirement origin:** Customer-supplied (prove complete write-set coverage and atomicity before the first write) plus reference-derived design requirement (effect scope verification)
- **Owner / component:** CRM Platform Owner (inventory sign-off role; owner assignment unconfirmed)
- **Validation:** TEST-ATOM-01, TEST-ATOM-02
- **Provenance:** SRC-APP-CONTEXT, SRC-POLICY-MDM-07, SRC-MCP-PH2

## CTRL-08 — Pre-commit invariant validation and transaction abort

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** After the merge writes are applied inside the transaction and before COMMIT.
- **Required action:** Evaluate the invariants and abort the whole transaction if any fails: the realized operation equals the authorized scope; the canonical record remains CRM-ACCT-1042; the current legal name is adopted with historical names and provenance preserved; account_merge_history is append-only (no update or delete); historical activity keeps original account IDs; source contract links are re-pointed so that no active contract is lost (inference from supplied counts: eight active contract links on the canonical record, subject to the confirmed inventory); contact links follow an approved duplicate rule; registry-ID and external-ID uniqueness holds; audit and outbox rows are present; bound versions are still valid. On abort, confirm that none of the transaction's writes are visible.
- **Required evidence:** Invariant list and validator results; Same-snapshot evaluation evidence
- **Approval requirement:** None at this control.
- **Enforcement point:** Pre-commit: pre-commit validator 1.6 evaluated inside the same transaction and snapshot (to be confirmed by the customer), before COMMIT.
- **On sufficient support:** All invariants pass: COMMIT is permitted subject to every other control.
- **On conflict:** Invariant conflict: abort the transaction.
- **On indeterminate / insufficient evidence:** Validator result unknown or unavailable: abort and hold.
- **On stale version / failed validation:** Abort the transaction (not a post-commit compensation) and confirm that no writes committed.
- **Requirement origin:** Customer-supplied (retain canonical, adopt current legal name, preserve history, append-only merge history, validate before commit) plus reference-derived design requirement (commit only on pass)
- **Owner / component:** unassigned (customer to designate)
- **Validation:** TEST-ATOM-03, TEST-ATOM-04, TEST-HIST-01
- **Provenance:** SRC-MCP-PH2, SRC-POLICY-MDM-07, SRC-APP-CONTEXT

## CTRL-09 — Post-commit validation and downstream reconciliation

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** After the merge transaction commits.
- **Required action:** Read authoritative state and compare it with the authorized effect (adopted name, historical names, link counts, merge-history, audit and outbox rows). Track each outbox event through the CRM search-index, Billing customer read-model and ERP customer-crosswalk consumers with idempotent, replay-safe processing, and reconcile each against authoritative state; report divergence. Consumer updates happen outside the database transaction and must not be described as covered by it.
- **Required evidence:** Post-commit state comparison; Per-consumer reconciliation records
- **Approval requirement:** None at this control.
- **Enforcement point:** Post-commit: reconciliation service and outbox consumers.
- **On sufficient support:** Post-commit validation and reconciliation complete: record closure.
- **On conflict:** Divergence found: apply CTRL-10.
- **On indeterminate / insufficient evidence:** Reconciliation incomplete: keep the operation open and further dependent changes on HOLD.
- **On stale version / failed validation:** Apply CTRL-10.
- **Requirement origin:** Customer-supplied (validate and reconcile after commit; idempotent consumers) plus recommendation for the reconciliation mechanics
- **Owner / component:** unassigned (customer to designate)
- **Validation:** TEST-POST-01, TEST-POST-02
- **Provenance:** SRC-APP-CONTEXT, SRC-POLICY-MDM-07, SRC-MCP-PH2

## CTRL-10 — Post-commit and out-of-boundary failure handling

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** An invariant failure or consumer failure detected after commit or outside the atomic boundary.
- **Required action:** Stop dependent mutations, including further merges that involve either account; reconcile the actual persisted state; and apply only a documented, tested, operation-specific compensation or recovery procedure. If none is established, quarantine the affected records and events and escalate to the designated owner, keeping the overall decision on HOLD for further changes. Do not claim that a database rollback reverses committed or external effects; do not treat another operation as recovery unless it independently satisfies A1, A2 and A3.
- **Required evidence:** Reconciled state record; Documented and tested same-operation compensation procedure, if one exists
- **Approval requirement:** Recovery owner approval per customer policy (see GAP-07).
- **Enforcement point:** Post-commit: reconciliation and recovery service; incident escalation path.
- **On sufficient support:** Recovered state is verified by reconciliation: close the incident.
- **On conflict:** Persisted state conflicts with the authorization: quarantine and escalate.
- **On indeterminate / insufficient evidence:** State cannot be established: quarantine and escalate.
- **On stale version / failed validation:** Quarantine and escalate; no assumed rollback.
- **Requirement origin:** Customer-supplied (reconcile; no blind retry) plus recommendation (quarantine and escalate when no tested compensation exists)
- **Owner / component:** unassigned (customer to designate)
- **Validation:** TEST-POST-01, TEST-POST-02
- **Provenance:** SRC-APP-CONTEXT, SRC-POLICY-MDM-07, SRC-MCP-PH2

## CTRL-11 — Ambiguous commit outcome and idempotency

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** A timeout, connection loss or other failure that leaves the commit outcome uncertain, or a repeated request.
- **Required action:** Persist and enforce idempotency key demo-merge-1042-2097-v1 (or an equivalent operation identifier) with the operation record. On an ambiguous commit outcome, do not retry; first reconcile authoritative state using the key and a read-after-failure check of the account rows, merge history, audit and outbox rows. Retry only after confirming that the original operation did not commit and that retry is safe, under the common retry budget and with fresh authorization when the snapshot changed. A duplicate request with the same key after a successful commit returns the recorded outcome and performs no second merge.
- **Required evidence:** Idempotency key record; Read-after-failure reconciliation result
- **Approval requirement:** None at this control.
- **Enforcement point:** Cross-phase: MergeCoordinator outcome handler and persistence adapter.
- **On sufficient support:** Outcome established: proceed according to the established state.
- **On conflict:** Reconciliation finds a conflicting or partial state: quarantine and escalate.
- **On indeterminate / insufficient evidence:** Outcome cannot be established: no retry; HOLD and escalate.
- **On stale version / failed validation:** No blind retry.
- **Requirement origin:** Customer-supplied (reconcile ambiguous outcomes; no blind retry; idempotency key supplied) plus recommendation for the persistence mechanics of the key
- **Owner / component:** unassigned (customer to designate)
- **Validation:** TEST-AMB-01, TEST-IDEM-01
- **Provenance:** SRC-APP-CONTEXT, SRC-POLICY-MDM-07, SRC-MCP-PH2

## CTRL-12 — Reversibility and authorization-path gate (Path A or Path B)

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none
- **Trigger:** A request for commit authorization of OP-DEMO-2026-001.
- **Required action:** Treat OP-DEMO-2026-001 as IRREVERSIBLE_WRITE with factual reversibility unknown, and HOLD unless exactly one authorization path is established. Path A: A1 a documented recovery or compensation mechanism for this exact operation covering the complete production effect scope; A2 successful recovery tests on materially equivalent state and schema at current persistence, policy and validator versions; A3 attestation by a customer-designated responsible role. Path B (only when Path A is not established): a current explicit customer policy accepting this exact operation's non-recovery risk, operation-specific approval by an authorized role, and customer-defined separation of duties. Path A changes factual reversibility only; neither path changes the action class or replaces CTRL-01 through CTRL-11. Ordinary Data Steward and CRM Platform Owner approval does not count as acceptance of non-recovery risk. After Path A is established for the complete scope, Path B is unavailable for that scope. Path A eligibility expires on relevant version or scope drift, or when A2 or A3 goes stale.
- **Required evidence:** A1 mechanism reference, A2 test records and A3 attestation (Path A); Path B policy reference, operation-specific approval and separation-of-duties rule (Path B)
- **Approval requirement:** Path B approval role, A3 attester and separation-of-duties rule are customer decisions (see GAP-05).
- **Enforcement point:** Pre-persistence: authorization-path registry consulted by the commit-boundary guard.
- **On sufficient support:** One path established for the exact operation and scope: the gate passes; every other control still applies.
- **On conflict:** Evidence shows both paths claimed for the same scope: block and resolve under customer policy.
- **On indeterminate / insufficient evidence:** Neither path established or evidence stale: HOLD.
- **On stale version / failed validation:** Fail closed.
- **Requirement origin:** Skill-level planning requirement (not text of the reference contract) applied to the protected write; no recovery or risk-acceptance evidence was supplied
- **Owner / component:** unassigned (customer to designate)
- **Validation:** TEST-PATHA-POS, TEST-PATHA-A1, TEST-PATHA-A2, TEST-PATHA-A3, TEST-PATHB-POS, TEST-PATHB-POLICY, TEST-PATHB-AUTH, TEST-PATHB-SOD, TEST-PATH-EXCL
- **Provenance:** SRC-MCP-PH1, SRC-MCP-PH2, SRC-POLICY-MDM-07, SRC-APP-CONTEXT

## Decisions requiring customer policy

- GAP-01: No approval artifacts were supplied. Who are the authorized Data Steward and CRM Platform Owner, what binding format and expiry apply, and may one person hold both roles?
- GAP-02: Who or what designates the registry extract and the supplied gateway result as authorization-eligible; which validator and version; what evidence currency window applies; is one authoritative source sufficient; and does the actual extract state the registration number and the old and new legal names?
- GAP-03: What is the complete persistent write set? Confirm dependent tables, foreign-key actions and triggers, where historical legal names and provenance are stored, the disposition of the source record, contact-link duplicate handling, uniqueness constraints and where historical activity keeps original account IDs.
- GAP-04: What evidence shows that all database writes and the outbox insertion run in one PostgreSQL transaction with an identified commit point, that pre-commit validator 1.6 can evaluate invariants in the same snapshot before COMMIT, and that SERIALIZABLE is adequate for the link-set anomalies?
- GAP-05: Is Path A (A1, A2, A3) established for this operation, or will the customer accept non-recovery risk under Path B? Who attests A3, who may approve Path B, and must the Path B approver be independent of the ordinary approvers?
- GAP-06: How are row versions 18 and 23, policy v3.2, validator 1.6 and schema CRM-IDENTITY-5 bound to the authorization and rechecked at the commit boundary, and what is the retry budget?
- GAP-07: Are the search-index, Billing read-model and ERP-crosswalk consumers idempotent and ordered, who owns reconciliation and recovery, and does any documented and tested compensation exist for this operation?
- GAP-08: Where is idempotency key demo-merge-1042-2097-v1 persisted and enforced, and what authoritative read-after-failure query reconciles an ambiguous commit?
