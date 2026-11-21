# Guardrail Specification

**Package run ID:** 2026-11-21T01:15:46Z

## Summary

One protected MERGE (OP-DEMO-2026-001) is governed by 13 controls that must all be satisfied before the first persistent write and during and after the single atomic transaction. Evidence and identity gates (CTRL-01 to CTRL-04) establish whether the identity proposition is supported; CTRL-05 fixes canonical retention and identity preservation; CTRL-06 to CTRL-09 cover approvals, authorization path, write-set and atomicity proof and pre-write revalidation; CTRL-10 to CTRL-13 cover atomic commit, ambiguous commit, post-commit validation and quarantine. Unresolved cases are HOLD; contradictions and distinct registry IDs are blocked. These are design requirements for the customer application, not runtime verdicts.

## Control register

| Control ID | Operation | Trigger | Required action | Enforcement point | Failure behaviour | Validation |
|---|---|---|---|---|---|---|
| CTRL-01 | OP-DEMO-2026-001 | A candidate MERGE of CRM-ACCT-2097 into CRM-ACCT-1042 is proposed or re-proposed. | Require the narrow identity proposition stated for this operation and require an exact official registry ID match (FIC-REG-004821 on both records and in the authoritative registry evidence) plus evidence of legal continuity before the candidate may advance. Registry ID comparison must use a customer-defined, documented normalization rule applied identically to both records and the evidence. | Candidate preparation and again at pre-persistence evaluation, before any approval request is created. | Do not persist; route to Data Steward review with the failed check recorded. | TEST-01, TEST-02, TEST-03, TEST-04 |
| CTRL-02 | OP-DEMO-2026-001 | Candidate records resemble each other (names, domains, addresses, contacts, parent/subsidiary or brand relationship) but the evidence does not show the same official registry ID with legal continuity. | Treat names, domains, addresses and contact similarity as insufficient identity proof. Two records that carry different official registry IDs fail the exact-registry-ID criterion of POL-MDM-07 v3.2 and must not be merged on similarity alone; no approval or authorization path inside this operation can satisfy that criterion, and any exception process would be separate and customer-defined. | Before evidence promotion and again at the pre-persistence check. | Do not persist any identity change; record the rejected candidate and reason. | TEST-02, TEST-03 |
| CTRL-03 | OP-DEMO-2026-001 | Supplied evidence (registry extract, verification record, agreement, migration report, crosswalk) is to be used to support the identity proposition. | Admit evidence first as quarantined, promote it only for the specific proposition and role it supports, and record source, proposition, role, temporal applicability, validation basis and validator/policy version. Treat SRC-REG-001 as primary legal-continuity evidence only after its authenticity (SRC-REG-VERIFY-005, a supplied result) is tied to the exact extract and recorded. Treat SRC-LEGAL-002 as corroboration of post-rename name and registry ID. Do not count SRC-MIGRATION-003 and SRC-CROSSWALK-004 as independent identity evidence because they record the customer's own mapping to EC-004821 and share an upstream origin. Do not infer support from absence of a detected conflict. | Evidence admission and promotion step, before the approval request is created and again at pre-persistence evaluation. | Do not promote; record the unmet evidence requirement. | TEST-01, TEST-05, TEST-06, TEST-07 |
| CTRL-04 | OP-DEMO-2026-001 | The continuity claim relies on a rename effective 2024-04-01 and a registry extract dated 2026-10-15; the authorization and commit occur later. | Confirm that the continuity evidence applies to the referent and the interval from the rename to the authorization/commit time, that the extract is within a customer-defined freshness limit, and that no dissolution, successor, restructuring or new incorporation is recorded after the extract date. Refresh the evidence when stale or when its age is not covered by a defined freshness limit. | Pre-persistence evaluation and the immediate pre-write revalidation (CTRL-09). | Do not persist; require refreshed evidence and a new authorization record. | TEST-01, TEST-05, TEST-08 |
| CTRL-05 | OP-DEMO-2026-001 | The merge direction, resulting names and historical state are determined for the write. | Retain CRM-ACCT-1042 as canonical and merge CRM-ACCT-2097 into it; never the reverse. After an approved merge adopt the current legal name Northstar Industrial Components Limited on the canonical account while preserving the legacy name and all historical names with provenance; keep CRM-ACCT-2097 resolvable as a source alias; keep historical activity under its original account IDs; append, never update or delete, account_merge_history rows. | Candidate construction, the in-transaction pre-commit validation, and post-commit validation. | Abort before commit; if detected after commit, stop dependent mutations and quarantine (CTRL-13). | TEST-09, TEST-10 |
| CTRL-06 | OP-DEMO-2026-001 | The candidate has passed evidence and identity gates and is to be approved for persistence. | Require two separate human approvals, one from a Data Steward and one from a CRM Platform Owner, each by a different authorized individual and each bound to the exact operation ID OP-DEMO-2026-001, idempotency key demo-merge-1042-2097-v1, source row versions 18 and 23, identity schema CRM-IDENTITY-5, MergeCoordinator 2.8.0, pre-commit validator 1.6, policy POL-MDM-07 v3.2, the promoted evidence set and the declared write set. Any change to a bound item invalidates the approvals. No approval artifacts have been supplied, so no approval exists. These ordinary approvals are not acceptance of non-recovery risk. | Approval service / MergeCoordinator pre-persistence check and the immediate pre-write revalidation (CTRL-09). | Reject the approval and require a new approval for the current state. | TEST-11, TEST-12 |
| CTRL-07 | OP-DEMO-2026-001 | OP-DEMO-2026-001 is a production IRREVERSIBLE_WRITE whose factual reversibility is unknown. | Hold the write unless exactly one authorization path is established for this operation and its complete production effect scope. Path A requires A1 (documented recovery or compensation mechanism for this exact MERGE and complete effect scope), A2 (successful recovery test on materially equivalent state and schema using current persistence, policy and validator versions) and A3 (attestation by a customer-designated responsible role). When established Path A sets factual reversibility to reversible while the action class stays IRREVERSIBLE_WRITE. Path B is available only when Path A is not established and requires a current explicit customer policy accepting this exact operation's non-recovery risk, operation-specific approval by a role authorized by that policy, and customer-defined separation of duties from the ordinary approvals; it establishes neither reversible nor not_reversible. After Path A is established for the scope Path B is unavailable. An UNMERGE is not recovery for this MERGE unless it independently satisfies A1, A2 and A3. Neither path creates an automatic write. | Pre-persistence authorization decision and the immediate pre-write revalidation (CTRL-09). | HOLD; a stale Path A claim expires to unknown and does not automatically select Path B. | TEST-13, TEST-14, TEST-15, TEST-16, TEST-17, TEST-18, TEST-19, TEST-20, TEST-21 |
| CTRL-08 | OP-DEMO-2026-001 | Before any persistent write for the merge begins. | Prove, with customer-held evidence, that the write set is complete (accounts, account_contact_links, account_contract_links, account_external_ids, account_merge_history, audit_events, transactional_outbox, plus the storage for preserved historical names and any dependent object found by dependency analysis) and that all of it, including outbox insertion, commits in one atomic SERIALIZABLE transaction with a single identified commit point. Prove that no historical activity record or other unlisted object is written. Isolation level alone does not prove atomicity or write-set completeness. If proof is absent, HOLD and begin no write. | Before the first persistent write, at the MergeCoordinator boundary. | Do not begin any write; do not start a partial sequence. | TEST-22, TEST-23 |
| CTRL-09 | OP-DEMO-2026-001 | Immediately before any persistent write, including after any delay since approval. | Revalidate that CRM-ACCT-1042 is still at row version 18 and CRM-ACCT-2097 at row version 23 and both are active, that the identity schema is CRM-IDENTITY-5, the coordinator is MergeCoordinator 2.8.0, the pre-commit validator is 1.6, the policy is POL-MDM-07 v3.2, the evidence and eligibility state and the approvals and authorization-path basis are unchanged and unexpired, and the realized operation exactly matches the authorized operation and write set. Reject a stale authorization and re-evaluate from the evidence stage with a new authorization record; never replay a stale candidate. Retries share one customer-defined retry budget. | Immediately before the first persistent write, and again inside the transaction before commit. | Reject the authorization; require re-evaluation with a new authorization record. | TEST-12, TEST-24, TEST-29 |
| CTRL-10 | OP-DEMO-2026-001 | The write is executed after CTRL-01 to CTRL-09 are satisfied. | Execute every write and the outbox insertion in one SERIALIZABLE transaction. Evaluate the pre-commit validator and the resulting-state invariants inside the transaction before COMMIT, including evidence-to-claim support and the identity-preserving requirements. Commit only on PASS with valid scope and versions. On any failure or serialization conflict before commit, abort the transaction so that no write in any of the seven tables becomes committed; this is a transaction abort, not post-commit compensation. Persist the idempotency key inside the same transaction so that its presence proves the commit. | In-transaction, immediately before COMMIT, in MergeCoordinator 2.8.0 with pre-commit validator 1.6. | Abort the transaction and confirm that no committed rows result. | TEST-10, TEST-25, TEST-26 |
| CTRL-11 | OP-DEMO-2026-001 | The commit outcome is unknown (for example the connection is lost around COMMIT) or the same request is received again. | Do not retry blindly. First reconcile authoritative state by reading, after the failure, whether the idempotency key demo-merge-1042-2097-v1 and the corresponding merge-history, audit and outbox rows exist. Retry only after confirming that the original operation did not commit and that a retry is safe and revalidated under CTRL-09. A duplicate request after a confirmed commit returns the original outcome and performs no second merge. A new authorization record requires a new idempotency key version. | Immediately after any failure or timeout at or after COMMIT, and at request intake for the idempotency key. | Do not retry; escalate to the reconciliation owner. | TEST-27, TEST-28, TEST-29 |
| CTRL-12 | OP-DEMO-2026-001 | The transaction has committed. | Validate the committed state against the authorized operation and write set, then reconcile the asynchronous outbox consumers: CRM search index, Billing customer read model and ERP customer crosswalk. Consumers must be idempotent, tolerate duplicate and out-of-order delivery and tolerate a crosswalk that already maps both IDs to EC-004821. Detect and report divergence between the committed CRM state and each consumer. Stop dependent mutations while a mismatch is unresolved. | After commit: post-commit validator, outbox consumers and a reconciliation job. | Stop dependent mutations and quarantine (CTRL-13). | TEST-26, TEST-30, TEST-31 |
| CTRL-13 | OP-DEMO-2026-001 | An invariant fails after commit, an asynchronous effect fails or diverges, or no single atomic boundary can be guaranteed for an effect. | Stop dependent mutations, reconcile the actual persisted state, and invoke only a documented and tested recovery or compensation procedure for this exact MERGE. If none is established, quarantine the affected accounts and downstream projections and escalate to a named owner while keeping the overall decision on HOLD for further identity changes. Do not claim that a database rollback can reverse a committed or asynchronous effect and do not assume UNMERGE as recovery. | After commit, on any post-commit validation or reconciliation failure. | Quarantine and escalate; do not retry the merge. | TEST-30, TEST-32 |

## CTRL-01 — Identity proposition and exact official registry ID gate

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Identity proposition and exact official registry ID gate.
- **Trigger:** A candidate MERGE of CRM-ACCT-2097 into CRM-ACCT-1042 is proposed or re-proposed.
- **Required inputs:**
  - Exact official registry ID on both records and in the registry evidence
  - Evidence of legal continuity for the rename interval
  - Documented registry-ID normalization rule
- **Required action:** Require the narrow identity proposition stated for this operation and require an exact official registry ID match (FIC-REG-004821 on both records and in the authoritative registry evidence) plus evidence of legal continuity before the candidate may advance. Registry ID comparison must use a customer-defined, documented normalization rule applied identically to both records and the evidence.
- **Evidence / approval preconditions:** None for the gate itself; Data Steward review is separate (CTRL-06).
- **Enforcement point:** Candidate preparation and again at pre-persistence evaluation, before any approval request is created.
- **On sufficient support:** Advance to the remaining controls; this control alone does not authorize any write.
- **On conflict:** Block the candidate: do not merge when an official registry ID differs or any record carries a conflicting registry ID.
- **On indeterminate / insufficient evidence:** HOLD: ambiguous or non-normalizable registry ID, missing continuity evidence, or an identity proposition that is not exact.
- **On stale version / failed validation:** Do not persist; route to Data Steward review with the failed check recorded.
- **Requirement origin:** Customer-supplied policy requirement (POL-MDM-07 v3.2) plus reference-derived design requirement; the normalization rule is a recommendation.
- **Owner / component:** Data Steward (customer-stated role)
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-01, TEST-02, TEST-03, TEST-04
- **Provenance:** SRC-REQUEST, SRC-POLICY, SRC-MCP-PROFILE, SRC-MCP-EVID

## CTRL-02 — Similarity-is-not-identity and distinct-registry-ID prohibition (negative control)

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Similarity-is-not-identity and distinct-registry-ID prohibition (negative control).
- **Trigger:** Candidate records resemble each other (names, domains, addresses, contacts, parent/subsidiary or brand relationship) but the evidence does not show the same official registry ID with legal continuity.
- **Required inputs:**
  - Official registry ID of each record
  - Corporate relationship evidence retained as a typed relation, not collapsed into identity
- **Required action:** Treat names, domains, addresses and contact similarity as insufficient identity proof. Two records that carry different official registry IDs fail the exact-registry-ID criterion of POL-MDM-07 v3.2 and must not be merged on similarity alone; no approval or authorization path inside this operation can satisfy that criterion, and any exception process would be separate and customer-defined.
- **Evidence / approval preconditions:** No approval can convert a distinct-registry-ID pair into this MERGE; any exception would be a separate customer-defined process outside this plan.
- **Enforcement point:** Before evidence promotion and again at the pre-persistence check.
- **On sufficient support:** Not applicable: this control only blocks or holds.
- **On conflict:** Block the merge and retain the parent/subsidiary or related-entity relation as a typed relation.
- **On indeterminate / insufficient evidence:** HOLD pending evidence of the official registry IDs; similarity alone never resolves the case.
- **On stale version / failed validation:** Do not persist any identity change; record the rejected candidate and reason.
- **Requirement origin:** Customer-supplied policy requirement (similarity not sufficient) with reference-derived design requirement; blocking an unequal-registry-ID pair is the Planner's reading of that policy and needs customer confirmation (DEC-02).
- **Owner / component:** Data Steward (customer-stated role)
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-02, TEST-03
- **Provenance:** SRC-POLICY, SRC-MCP-PROFILE

## CTRL-03 — Claim-specific evidence eligibility and provenance

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Claim-specific evidence eligibility and provenance.
- **Trigger:** Supplied evidence (registry extract, verification record, agreement, migration report, crosswalk) is to be used to support the identity proposition.
- **Required inputs:**
  - Provenance and validation record IDs per proposition
  - Verification record tied to the exact extract (hash/identifier) with validator identity and version
  - Independence assessment of each source
- **Required action:** Admit evidence first as quarantined, promote it only for the specific proposition and role it supports, and record source, proposition, role, temporal applicability, validation basis and validator/policy version. Treat SRC-REG-001 as primary legal-continuity evidence only after its authenticity (SRC-REG-VERIFY-005, a supplied result) is tied to the exact extract and recorded. Treat SRC-LEGAL-002 as corroboration of post-rename name and registry ID. Do not count SRC-MIGRATION-003 and SRC-CROSSWALK-004 as independent identity evidence because they record the customer's own mapping to EC-004821 and share an upstream origin. Do not infer support from absence of a detected conflict.
- **Evidence / approval preconditions:** Evidence eligibility authority is a customer decision (DEC-02).
- **Enforcement point:** Evidence admission and promotion step, before the approval request is created and again at pre-persistence evaluation.
- **On sufficient support:** Mark the proposition supported for the stated scope and interval and continue to the remaining controls.
- **On conflict:** Keep conflicting observations quarantined for designated adjudication and block the candidate.
- **On indeterminate / insufficient evidence:** Keep the observation UNVERIFIED and block the candidate; do not treat repetition or the Planner's own label as support.
- **On stale version / failed validation:** Do not promote; record the unmet evidence requirement.
- **Requirement origin:** Reference-derived design requirement applied to customer-supplied evidence; independence classification of the migration and crosswalk records is the Planner's inference.
- **Owner / component:** Data Steward (customer-stated role) for adjudication; evidence-promotion owner unassigned
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-01, TEST-05, TEST-06, TEST-07
- **Provenance:** SRC-POLICY, SRC-MCP-EVID, SRC-REG-001, SRC-REG-VERIFY-005, SRC-LEGAL-002, SRC-MIGRATION-003, SRC-CROSSWALK-004

## CTRL-04 — Temporal continuity applicability and evidence freshness

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Temporal continuity applicability and evidence freshness.
- **Trigger:** The continuity claim relies on a rename effective 2024-04-01 and a registry extract dated 2026-10-15; the authorization and commit occur later.
- **Required inputs:**
  - Customer-defined maximum evidence age
  - Registry status as of the authorization/commit time
  - Extract content showing before and after legal names
- **Required action:** Confirm that the continuity evidence applies to the referent and the interval from the rename to the authorization/commit time, that the extract is within a customer-defined freshness limit, and that no dissolution, successor, restructuring or new incorporation is recorded after the extract date. Refresh the evidence when stale or when its age is not covered by a defined freshness limit.
- **Evidence / approval preconditions:** Freshness limit is a customer policy decision (DEC-02).
- **Enforcement point:** Pre-persistence evaluation and the immediate pre-write revalidation (CTRL-09).
- **On sufficient support:** Continue to the remaining controls for the validated interval.
- **On conflict:** Block and escalate when later registry evidence shows dissolution, succession or a distinct legal person.
- **On indeterminate / insufficient evidence:** HOLD or refresh when the freshness limit is undefined, exceeded, or the interval cannot be shown to be covered.
- **On stale version / failed validation:** Do not persist; require refreshed evidence and a new authorization record.
- **Requirement origin:** Reference-derived design requirement (rename/continuity must apply to the referent and interval) applied to customer evidence; freshness limit is an open customer decision.
- **Owner / component:** Data Steward (customer-stated role)
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-01, TEST-05, TEST-08
- **Provenance:** SRC-POLICY, SRC-MCP-PROFILE, SRC-MCP-EVID, SRC-REG-001

## CTRL-05 — Canonical record and identity-preserving requirements

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Canonical record and identity-preserving requirements.
- **Trigger:** The merge direction, resulting names and historical state are determined for the write.
- **Required inputs:**
  - Canonical-record decision per POL-MDM-07 v3.2
  - Resulting-state specification: names, aliases, links, lineage
  - Identification of where historical names and provenance are stored
- **Required action:** Retain CRM-ACCT-1042 as canonical and merge CRM-ACCT-2097 into it; never the reverse. After an approved merge adopt the current legal name Northstar Industrial Components Limited on the canonical account while preserving the legacy name and all historical names with provenance; keep CRM-ACCT-2097 resolvable as a source alias; keep historical activity under its original account IDs; append, never update or delete, account_merge_history rows.
- **Evidence / approval preconditions:** Approval of the resulting state is covered by CTRL-06.
- **Enforcement point:** Candidate construction, the in-transaction pre-commit validation, and post-commit validation.
- **On sufficient support:** Continue to the remaining controls.
- **On conflict:** Block when the merge direction, canonical retention or name adoption contradicts the policy.
- **On indeterminate / insufficient evidence:** HOLD when the storage of historical names or the disposition of the CRM-ACCT-2097 row is not specified (DEC-04).
- **On stale version / failed validation:** Abort before commit; if detected after commit, stop dependent mutations and quarantine (CTRL-13).
- **Requirement origin:** Customer-supplied policy requirements; storage location and tombstone semantics are open customer decisions.
- **Owner / component:** CRM Platform Owner (customer-stated role)
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-09, TEST-10
- **Provenance:** SRC-REQUEST, SRC-POLICY

## CTRL-06 — Separate human approvals bound to the exact operation and state

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Separate human approvals bound to the exact operation and state.
- **Trigger:** The candidate has passed evidence and identity gates and is to be approved for persistence.
- **Required inputs:**
  - Data Steward approval record bound to operation and state
  - CRM Platform Owner approval record bound to operation and state
  - Evidence that the two approvers are distinct and authorized
- **Required action:** Require two separate human approvals, one from a Data Steward and one from a CRM Platform Owner, each by a different authorized individual and each bound to the exact operation ID OP-DEMO-2026-001, idempotency key demo-merge-1042-2097-v1, source row versions 18 and 23, identity schema CRM-IDENTITY-5, MergeCoordinator 2.8.0, pre-commit validator 1.6, policy POL-MDM-07 v3.2, the promoted evidence set and the declared write set. Any change to a bound item invalidates the approvals. No approval artifacts have been supplied, so no approval exists. These ordinary approvals are not acceptance of non-recovery risk.
- **Evidence / approval preconditions:** Data Steward and CRM Platform Owner, separately (customer policy). Individual identities and the approval record format are not supplied (DEC-01).
- **Enforcement point:** Approval service / MergeCoordinator pre-persistence check and the immediate pre-write revalidation (CTRL-09).
- **On sufficient support:** Continue to the authorization-path and commit-boundary controls.
- **On conflict:** Block when a required approver rejects or the approvals disagree on scope.
- **On indeterminate / insufficient evidence:** HOLD when an approval is missing, unbound, unverifiable, expired or given by the same individual for both roles.
- **On stale version / failed validation:** Reject the approval and require a new approval for the current state.
- **Requirement origin:** Customer-supplied policy requirement; binding fields are a reference-derived design requirement (operation/effect scope and relevant versions).
- **Owner / component:** Data Steward and CRM Platform Owner (customer-stated roles)
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-11, TEST-12
- **Provenance:** SRC-REQUEST, SRC-POLICY, SRC-MCP-P1

## CTRL-07 — Protected-write authorization path (Path A recovery or Path B accepted non-recovery risk)

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Protected-write authorization path (Path A recovery or Path B accepted non-recovery risk).
- **Trigger:** OP-DEMO-2026-001 is a production IRREVERSIBLE_WRITE whose factual reversibility is unknown.
- **Required inputs:**
  - A1 mechanism documentation
  - A2 recovery-test record with versions
  - A3 attestation by a designated role
  - Or: current Path B policy, operation-specific approval, separation-of-duties rule
- **Required action:** Hold the write unless exactly one authorization path is established for this operation and its complete production effect scope. Path A requires A1 (documented recovery or compensation mechanism for this exact MERGE and complete effect scope), A2 (successful recovery test on materially equivalent state and schema using current persistence, policy and validator versions) and A3 (attestation by a customer-designated responsible role). When established Path A sets factual reversibility to reversible while the action class stays IRREVERSIBLE_WRITE. Path B is available only when Path A is not established and requires a current explicit customer policy accepting this exact operation's non-recovery risk, operation-specific approval by a role authorized by that policy, and customer-defined separation of duties from the ordinary approvals; it establishes neither reversible nor not_reversible. After Path A is established for the scope Path B is unavailable. An UNMERGE is not recovery for this MERGE unless it independently satisfies A1, A2 and A3. Neither path creates an automatic write.
- **Evidence / approval preconditions:** A3 attester and Path B approver roles and the separation-of-duties rule are not defined by the supplied policy (DEC-03).
- **Enforcement point:** Pre-persistence authorization decision and the immediate pre-write revalidation (CTRL-09).
- **On sufficient support:** Record the established path and continue to the remaining controls; the path never replaces approvals, evidence or atomicity proof.
- **On conflict:** Not applicable: path decision does not resolve identity conflicts.
- **On indeterminate / insufficient evidence:** HOLD when neither path is fully established or the separation-of-duties question is unresolved.
- **On stale version / failed validation:** HOLD; a stale Path A claim expires to unknown and does not automatically select Path B.
- **Requirement origin:** Skill-level planning requirement applied to the reference protected-write class; the customer has not supplied recovery or non-recovery-risk policy.
- **Owner / component:** Unassigned (A3 attester and Path B approver roles to be defined by the customer)
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-13, TEST-14, TEST-15, TEST-16, TEST-17, TEST-18, TEST-19, TEST-20, TEST-21
- **Provenance:** SRC-POLICY, SRC-MCP-PROFILE, SRC-MCP-P1

## CTRL-08 — Complete write-set and atomicity proof before the first persistent write

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Complete write-set and atomicity proof before the first persistent write.
- **Trigger:** Before any persistent write for the merge begins.
- **Required inputs:**
  - Dependency inventory of objects referencing either account ID
  - Transaction-boundary evidence for every write-set member
  - Evidence that triggers and extensions have no effects outside the transaction
- **Required action:** Prove, with customer-held evidence, that the write set is complete (accounts, account_contact_links, account_contract_links, account_external_ids, account_merge_history, audit_events, transactional_outbox, plus the storage for preserved historical names and any dependent object found by dependency analysis) and that all of it, including outbox insertion, commits in one atomic SERIALIZABLE transaction with a single identified commit point. Prove that no historical activity record or other unlisted object is written. Isolation level alone does not prove atomicity or write-set completeness. If proof is absent, HOLD and begin no write.
- **Evidence / approval preconditions:** CRM Platform Owner reviews the proof (customer-stated role).
- **Enforcement point:** Before the first persistent write, at the MergeCoordinator boundary.
- **On sufficient support:** Permit the write to proceed to the remaining controls.
- **On conflict:** Block when a write outside the declared set or inside historical activity is found.
- **On indeterminate / insufficient evidence:** HOLD when completeness, membership or the commit point is unknown or unverified.
- **On stale version / failed validation:** Do not begin any write; do not start a partial sequence.
- **Requirement origin:** Customer-supplied policy requirement (prove write set and atomicity before the first write); proof methods are recommendations.
- **Owner / component:** CRM Platform Owner (customer-stated role) with application/data owner
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-22, TEST-23
- **Provenance:** SRC-REQUEST, SRC-POLICY, SRC-MCP-P1

## CTRL-09 — Immediate pre-write revalidation of record state, schema, coordinator, validator, policy and approvals

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Immediate pre-write revalidation of record state, schema, coordinator, validator, policy and approvals.
- **Trigger:** Immediately before any persistent write, including after any delay since approval.
- **Required inputs:**
  - Current row versions, schema, coordinator, validator and policy identifiers
  - Authorization record bound to those versions
- **Required action:** Revalidate that CRM-ACCT-1042 is still at row version 18 and CRM-ACCT-2097 at row version 23 and both are active, that the identity schema is CRM-IDENTITY-5, the coordinator is MergeCoordinator 2.8.0, the pre-commit validator is 1.6, the policy is POL-MDM-07 v3.2, the evidence and eligibility state and the approvals and authorization-path basis are unchanged and unexpired, and the realized operation exactly matches the authorized operation and write set. Reject a stale authorization and re-evaluate from the evidence stage with a new authorization record; never replay a stale candidate. Retries share one customer-defined retry budget.
- **Evidence / approval preconditions:** New approvals are required whenever a bound item changes (CTRL-06).
- **Enforcement point:** Immediately before the first persistent write, and again inside the transaction before commit.
- **On sufficient support:** Proceed to the atomic transaction.
- **On conflict:** Block when current state contradicts the authorized state or evidence.
- **On indeterminate / insufficient evidence:** HOLD when a version or state cannot be read or compared.
- **On stale version / failed validation:** Reject the authorization; require re-evaluation with a new authorization record.
- **Requirement origin:** Customer-supplied requirement (revalidate record state, schema, coordinator, validator and policy) plus reference-derived version-binding obligations.
- **Owner / component:** CRM Platform Owner (customer-stated role)
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-12, TEST-24, TEST-29
- **Provenance:** SRC-REQUEST, SRC-POLICY, SRC-MCP-P1, SRC-MCP-P2

## CTRL-10 — Atomic SERIALIZABLE commit and pre-commit abort

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Atomic SERIALIZABLE commit and pre-commit abort.
- **Trigger:** The write is executed after CTRL-01 to CTRL-09 are satisfied.
- **Required inputs:**
  - Pre-commit validator result
  - Transaction identifier and commit evidence
  - Idempotency key persisted inside the transaction
- **Required action:** Execute every write and the outbox insertion in one SERIALIZABLE transaction. Evaluate the pre-commit validator and the resulting-state invariants inside the transaction before COMMIT, including evidence-to-claim support and the identity-preserving requirements. Commit only on PASS with valid scope and versions. On any failure or serialization conflict before commit, abort the transaction so that no write in any of the seven tables becomes committed; this is a transaction abort, not post-commit compensation. Persist the idempotency key inside the same transaction so that its presence proves the commit.
- **Evidence / approval preconditions:** None beyond CTRL-06.
- **Enforcement point:** In-transaction, immediately before COMMIT, in MergeCoordinator 2.8.0 with pre-commit validator 1.6.
- **On sufficient support:** COMMIT; record audit and outbox events committed in the same transaction.
- **On conflict:** Abort the transaction and keep the candidate non-persistent.
- **On indeterminate / insufficient evidence:** Abort the transaction; the validator or database being unavailable is a failure, not a pass.
- **On stale version / failed validation:** Abort the transaction and confirm that no committed rows result.
- **Requirement origin:** Customer-supplied requirement (single SERIALIZABLE transaction, validate before commit); keeping the idempotency key inside the transaction is a recommendation.
- **Owner / component:** CRM Platform Owner (customer-stated role)
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-10, TEST-25, TEST-26
- **Provenance:** SRC-REQUEST, SRC-POLICY, SRC-MCP-P2

## CTRL-11 — Ambiguous commit reconciliation, idempotency and no blind retry

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Ambiguous commit reconciliation, idempotency and no blind retry.
- **Trigger:** The commit outcome is unknown (for example the connection is lost around COMMIT) or the same request is received again.
- **Required inputs:**
  - Authoritative read-after-failure result keyed by the idempotency key
  - Reconciliation record
- **Required action:** Do not retry blindly. First reconcile authoritative state by reading, after the failure, whether the idempotency key demo-merge-1042-2097-v1 and the corresponding merge-history, audit and outbox rows exist. Retry only after confirming that the original operation did not commit and that a retry is safe and revalidated under CTRL-09. A duplicate request after a confirmed commit returns the original outcome and performs no second merge. A new authorization record requires a new idempotency key version.
- **Evidence / approval preconditions:** None; reconciliation is an automated or operator procedure with a named owner (DEC-05).
- **Enforcement point:** Immediately after any failure or timeout at or after COMMIT, and at request intake for the idempotency key.
- **On sufficient support:** If the key is found committed, return the original outcome and continue to post-commit controls.
- **On conflict:** If partial state is observed, stop and quarantine (CTRL-13).
- **On indeterminate / insufficient evidence:** Stay on HOLD until authoritative state can be read.
- **On stale version / failed validation:** Do not retry; escalate to the reconciliation owner.
- **Requirement origin:** Customer-supplied policy requirement (reconcile ambiguous outcomes before retry; blind retries prohibited); key lifecycle details are recommendations.
- **Owner / component:** Unassigned (reconciliation owner to be named by the customer)
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-27, TEST-28, TEST-29
- **Provenance:** SRC-REQUEST, SRC-POLICY

## CTRL-12 — Post-commit validation and downstream propagation reconciliation

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Post-commit validation and downstream propagation reconciliation.
- **Trigger:** The transaction has committed.
- **Required inputs:**
  - Post-commit validation result
  - Per-consumer reconciliation result
  - Outbox delivery and retry records
- **Required action:** Validate the committed state against the authorized operation and write set, then reconcile the asynchronous outbox consumers: CRM search index, Billing customer read model and ERP customer crosswalk. Consumers must be idempotent, tolerate duplicate and out-of-order delivery and tolerate a crosswalk that already maps both IDs to EC-004821. Detect and report divergence between the committed CRM state and each consumer. Stop dependent mutations while a mismatch is unresolved.
- **Evidence / approval preconditions:** None.
- **Enforcement point:** After commit: post-commit validator, outbox consumers and a reconciliation job.
- **On sufficient support:** Record reconciled and mark downstream consistent.
- **On conflict:** Quarantine on a mismatch between committed state and the authorized operation.
- **On indeterminate / insufficient evidence:** Treat unreconciled consumers as inconsistent; do not mark the operation complete.
- **On stale version / failed validation:** Stop dependent mutations and quarantine (CTRL-13).
- **Requirement origin:** Customer-supplied policy requirement (validate and reconcile after commit; idempotent consumers); consumer-level checks are recommendations.
- **Owner / component:** CRM Platform Owner (customer-stated role) with consumer owners unassigned
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-26, TEST-30, TEST-31
- **Provenance:** SRC-REQUEST, SRC-POLICY

## CTRL-13 — Post-commit failure, quarantine and recovery

- **Primary operation:** OP-DEMO-2026-001
- **Also applies to operations:** none (single-operation plan)
- **Purpose:** Post-commit failure, quarantine and recovery.
- **Trigger:** An invariant fails after commit, an asynchronous effect fails or diverges, or no single atomic boundary can be guaranteed for an effect.
- **Required inputs:**
  - Documented tested recovery or compensation procedure (A1/A2) or a quarantine and escalation procedure
  - Incident and reconciliation record
- **Required action:** Stop dependent mutations, reconcile the actual persisted state, and invoke only a documented and tested recovery or compensation procedure for this exact MERGE. If none is established, quarantine the affected accounts and downstream projections and escalate to a named owner while keeping the overall decision on HOLD for further identity changes. Do not claim that a database rollback can reverse a committed or asynchronous effect and do not assume UNMERGE as recovery.
- **Evidence / approval preconditions:** Recovery execution requires operation-specific approval under customer policy (DEC-07).
- **Enforcement point:** After commit, on any post-commit validation or reconciliation failure.
- **On sufficient support:** Return to normal once validation and reconciliation pass.
- **On conflict:** Quarantine and escalate.
- **On indeterminate / insufficient evidence:** Quarantine and escalate; remain on HOLD.
- **On stale version / failed validation:** Quarantine and escalate; do not retry the merge.
- **Requirement origin:** Customer-supplied policy requirement (reconcile after commit) with a Skill-level recovery requirement; no recovery procedure was supplied.
- **Owner / component:** Unassigned (recovery and quarantine owner to be named by the customer)
- **Audit record:** record the decision, evidence record IDs, versions, approval IDs and outcome in audit_events (customer to confirm).
- **Validation:** TEST-30, TEST-32
- **Provenance:** SRC-REQUEST, SRC-POLICY

## Decisions requiring customer policy

- DEC-01: Who are the Data Steward and CRM Platform Owner approvers, what is the approval record format, and how are approvals bound to operation OP-DEMO-2026-001 and its state? (owner: Customer Data Steward and CRM Platform Owner; blocking: yes)
- DEC-02: Which evidence is eligible for promotion for the identity and continuity claims, who decides eligibility, what is the registry-ID normalization rule, what is the maximum evidence age, and does the extract show the legacy and current names exactly? (owner: Customer domain-policy owner and Data Steward; blocking: yes)
- DEC-03: Is there a documented, tested and attested recovery for this MERGE (Path A), or does a current policy accept non-recovery risk with an authorized approver and separation of duties (Path B)? (owner: Customer risk owner and CRM Platform Owner; blocking: yes)
- DEC-04: What is the proven complete write set and atomic boundary, where are historical names and provenance stored, what is the disposition of the CRM-ACCT-2097 row, and which other objects reference the account IDs? (owner: Customer CRM application and data owner; blocking: yes)
- DEC-05: How is the idempotency key persisted atomically, what is the retry budget, and who owns ambiguous-commit reconciliation? (owner: Customer CRM application owner; blocking: yes)
- DEC-06: Are the outbox consumers idempotent and ordered, and who owns downstream reconciliation for the search index, Billing read model and ERP crosswalk? (owner: Customer consumer owners; blocking: yes)
- DEC-07: Who owns quarantine, escalation and any tested compensation after a post-commit failure? (owner: Customer CRM Platform Owner; blocking: yes)
- DEC-08: What is the origin of the EC-004821 mapping in the migration report and crosswalk, and should the crosswalk be reviewed independently of this merge? (owner: Customer Data Steward; blocking: no)
