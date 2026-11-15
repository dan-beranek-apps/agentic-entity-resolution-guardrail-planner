# Guardrail Specification

**Package run ID:** 2026-11-15T17:25:14Z

## Summary

One protected operation (OP-01, production MERGE) is controlled by 14 customer-side controls. The strategy is fail-closed: the agent only proposes; identity support must be claim-specific and authorization-eligible; any unresolved conflict, unverified evidence, unknown write set, unknown atomicity or commit point, undefined approval policy, or unestablished authorization path produces HOLD / DEFER / REQUIRE REVIEW before any persistent production write. Decision terms are design recommendations, not runtime verdicts. Controls are requirements for the customer's implementation; none is implemented here.

## Control register

| Control ID | Operation | Trigger | Required action | Enforcement point | Failure behaviour | Validation |
|---|---|---|---|---|---|---|
| CTRL-01 | OP-01 | The agent proposes the MERGE of CRM-ACCT-1042 and CRM-ACCT-8891, and again immediately before any persistence. | Treat the proposal as a protected IRREVERSIBLE_WRITE candidate only. Bind the candidate to the exact operation, both record identifiers, entity class (legal-entity identity), the declared effect scope and the validity interval; reject any realized operation that differs. The agent's proposal is never an authorization and never triggers a write. | Customer commit-boundary guard before execution (Phase 1 equivalent) and again at the persistence adapter (scope match). | Guard or scope check unavailable: fail closed (no write). | TEST-01, TEST-07, TEST-17 |
| CTRL-02 | OP-01 | Before any identity decision on the candidate pair. | Require claim-specific, authorization-eligible evidence for CLAIM-02 (co-reference) as defined by customer policy. Name similarity, shared domain, an overlapping contact, embeddings, LLM confidence, agent-generated labels and repetition of the same signals are planner-visible hypotheses only. Absence of a detected conflict is not positive support. The planner may not weaken or replace the required claims. | Customer evidence service and policy evaluator ahead of the commit-boundary guard. | Evidence service unavailable or policy missing: fail closed (HOLD). | TEST-01, TEST-02, TEST-08 |
| CTRL-03 | OP-01 | A registry extract, or any new observation, is offered as support for CLAIM-02 or CLAIM-03. | Admit every observation first as quarantined/unverified. Before the registry extract may support the proposition, verify its currency, scope, jurisdiction and applicability to both records and to the identity proposition, and record the validation basis and validator version. A potentially matching identifier is a signal to verify, not a verified match. Shadow or agent-derived content must not be promoted. | Customer evidence admission / promotion service. | Validator unavailable: do not promote; HOLD. | TEST-01, TEST-03 |
| CTRL-04 | OP-01 | Any evidence or document indicates that the two records are related but distinct legal entities (parent/holding, subsidiary, affiliate). | Retain the indication as an unresolved or contradictory claim; clustering or merging does not reconcile it. Preserve the typed relation. Before MERGE, the customer-designated reviewer must adjudicate and record whether the records are one legal entity or related distinct entities. If distinct, do not merge; the alternative outcome (a typed parent/subsidiary link or keeping both accounts) is a separate, separately scoped operation outside this plan. | Customer evidence/policy evaluator and human-review queue before the commit-boundary guard. | Reviewer queue unavailable: HOLD. | TEST-04, TEST-05 |
| CTRL-05 | OP-01 | Before authorization and again at the commit boundary. | Require a policy-defined validity interval for the identity assertion and confirm that every supporting item, and any rename or continuity relied on, applies to the same referent and interval. Re-check at commit time against the interval and evidence currency. | Customer policy evaluator and commit-boundary guard. | Evidence staleness check unavailable: fail closed. | TEST-01, TEST-06 |
| CTRL-06 | OP-01 | Before the first persistent write of the MERGE, and whenever the schema or integrations change. | Require a customer-verified inventory of the complete persistent write set: account records, identity links, contacts, contracts, billing references, denormalized projections, search indexes, downstream integrations, audit/outbox records, assignments and history lineage. Each item carries one effect-boundary classification (in-transaction, outside-transaction, external/async, or unknown). If completeness is unverified, HOLD before any persistent write; do not start a partial sequence and do not rely on immediate rollback as a substitute. | Customer engineering review gate plus the commit-boundary guard. | Inventory source unavailable: HOLD. | TEST-09 |
| CTRL-07 | OP-01 | Before the first persistent write. | Require evidence of the actual transaction or equivalent atomic mechanism, which effects it covers, and the exact commit point. Effects outside the atomic unit (for example search indexes and downstream integrations) must be declared as outside-transaction or external/asynchronous with their delivery and reconciliation semantics. Do not infer atomicity from the database product, an isolation level or application sequencing, and assess concurrency/anomaly protection separately (database-specific design review required). If any of this is unverified: HOLD. | Customer persistence adapter design review and commit-boundary guard. | Verification tooling unavailable: HOLD. | TEST-10, TEST-11 |
| CTRL-08 | OP-01 | A required invariant or validation fails after writes begin but before commit, and only where CTRL-07 verified the atomic unit. | Abort the transaction and confirm by authoritative read that none of its writes committed. Treat this as transaction abort, not post-commit compensation. Re-evaluate from the start; do not blind retry. Invariants include realized-operation scope equals authorized scope, constraint checks on the candidate result, and evidence-to-claim support under the same snapshot. | Persistence adapter inside the transaction; commit-boundary guard. | Abort fails or outcome unknown: treat as ambiguous commit (CTRL-10). | TEST-12 |
| CTRL-09 | OP-01 | A failure or invariant breach occurs after commit, or an effect outside the atomic unit (index, downstream integration, async event) fails or has already occurred. | Do not claim that database rollback reverses the full effect. Stop dependent mutations and publications, reconcile the actual persisted state, and invoke only a documented, tested, operation-specific compensation/recovery procedure for this MERGE. If none is established, quarantine the affected records and escalate; keep further identity changes involving them on HOLD. | Customer recovery component, incident/escalation process and persistence adapter. | No tested compensation exists: quarantine/escalate; no improvised repair. | TEST-11, TEST-13 |
| CTRL-10 | OP-01 | A timeout, connection loss or error leaves it unclear whether the MERGE committed, or the same candidate is submitted more than once. | Do not retry blindly. Assign an idempotency key (or equivalent operation identifier) to the authorized candidate, perform a read-after-failure of authoritative state, and retry only after confirming the original operation did not commit and a retry is safe. A duplicate submission must resolve to the original outcome and must not apply the merge twice. | Persistence adapter and reconciliation component. | Reconciliation unavailable: HOLD; no retry. | TEST-14, TEST-15 |
| CTRL-11 | OP-01 | At authorization and again at the commit boundary for the protected production MERGE. | Fail closed unless one path is established. Path A requires operation-specific A1 (documented recovery/compensation covering this MERGE and its complete effect scope), A2 (successful recovery test on materially equivalent state/schema with current persistence, policy and validator versions) and A3 (attestation by a customer-designated role); it can set factual reversibility to reversible for the proven scope. Path B applies only when Path A is not established and requires a current explicit customer policy accepting this exact operation's non-recovery risk, operation-specific approval by an authorized role, and customer-defined separation of duties from ordinary approval; it establishes neither reversible nor not_reversible. An UNMERGE procedure is not recovery for MERGE unless it independently satisfies A1/A2/A3 for this operation. Recheck versions at commit; a changed version, scope or stale A2/A3 expires Path A for that decision and reversibility is treated as unknown. | Customer commit-boundary guard / authorization service. | Authorization service unavailable: fail closed. | TEST-21, TEST-22, TEST-23, TEST-24, TEST-25, TEST-26, TEST-27, TEST-28, TEST-29, TEST-30 |
| CTRL-12 | OP-01 | Before authorization of the protected MERGE. | Require operation-specific approval from a role authorized by a current customer policy; ordinary merge approval does not accept irreversibility risk. Until the policy and the authorized approver list are defined, no approval can be valid and the operation stays on HOLD. The policy must also state whether the Path B approver must be independent of the ordinary approver; if unresolved, keep Path B on HOLD. | Customer approval workflow and commit-boundary guard. | Approval workflow unavailable: HOLD. | TEST-18, TEST-19, TEST-25, TEST-27, TEST-28 |
| CTRL-13 | OP-01 | Authorization time and the commit boundary. | Bind the authorization to the operation/effect scope and to the graph/data version, evidence (active/quarantined and eligibility) version, policy version and validator version in force. At the commit boundary obtain one consistent snapshot, reject any stale authorization, re-evaluate from the start rather than replaying a stale candidate, and commit only when the checks pass, the scope is valid and the bound versions remain valid. Protect against stale reads, lost updates and concurrent modification of either record; the concrete mechanism depends on the customer's database engine and requires a database-specific design review. | Customer commit-boundary guard and persistence adapter. | Snapshot or version service unavailable: fail closed. | TEST-01, TEST-16, TEST-17, TEST-31 |
| CTRL-14 | OP-01 | Every candidate, decision, hold, approval, commit attempt and reconciliation. | Record the candidate, proposition, evidence record IDs and roles, versions, decisions and reasons (including HOLD reasons), approvals, the pre-merge identity of both records (lineage sufficient to reconstruct the source identities) and the observed outcome. Records must not be altered after the fact. Audit coverage does not substitute for recovery evidence. | Customer audit/lineage component, written inside the atomic unit where the architecture allows. | Audit store unavailable: fail closed. | TEST-20 |

## HOLD conditions before any persistent production write

Any one of these is sufficient to keep OP-01 on HOLD. Today, HOLD-01 to HOLD-06 are all in effect.

| HOLD | Condition | Controls | Decisions |
|---|---|---|---|
| HOLD-01 | Complete persistent write set not verified | CTRL-06 | GAP-01 |
| HOLD-02 | Transaction coverage, exact commit point or atomicity unknown or unverified | CTRL-07 | GAP-02, GAP-10 |
| HOLD-03 | Operation-specific approval policy or authorized approvers undefined | CTRL-12 | GAP-04 |
| HOLD-04 | Neither Path A (A1+A2+A3) nor Path B (policy + authorized approval + separation of duties) established | CTRL-11 | GAP-03, GAP-08 |
| HOLD-05 | Identity evidence insufficient, unverified (including the registry extract), contradicted, or an unresolved parent/holding indication | CTRL-02, CTRL-03, CTRL-04 | GAP-05, GAP-06, GAP-07 |
| HOLD-06 | Validity interval undefined or evidence not applicable to it | CTRL-05 | GAP-09 |
| HOLD-07 | Authorization stale, scope or version mismatch, or concurrent modification | CTRL-01, CTRL-13 | GAP-10 |
| HOLD-08 | Audit/lineage record incomplete | CTRL-14 | DEC-02 |
| HOLD-09 | Ambiguous commit outcome not yet reconciled | CTRL-10 | GAP-02 |

## CTRL-01 - Protected-operation qualification and scope binding

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Keeps an agent proposal from becoming a persistent identity change and prevents a staging or account-level claim from standing in for a legal-entity identity claim.
- **Trigger:** The agent proposes the MERGE of CRM-ACCT-1042 and CRM-ACCT-8891, and again immediately before any persistence.
- **Required inputs:** Operation identifier and declared effect scope; Both record identifiers and versions; Entity class and proposition text
- **Required action:** Treat the proposal as a protected IRREVERSIBLE_WRITE candidate only. Bind the candidate to the exact operation, both record identifiers, entity class (legal-entity identity), the declared effect scope and the validity interval; reject any realized operation that differs. The agent's proposal is never an authorization and never triggers a write.
- **Evidence / approval preconditions:** Operation-specific approval per CTRL-12; none is established.
- **Enforcement point:** Customer commit-boundary guard before execution (Phase 1 equivalent) and again at the persistence adapter (scope match).
- **On sufficient support:** Continue to the remaining controls; no write is implied.
- **On conflict:** Scope or entity-class mismatch: block and require a new candidate and new authorization.
- **On indeterminate / insufficient evidence:** Scope, entity class or effect scope not fully declared: HOLD.
- **On stale version / failed validation:** Candidate, scope or record version changed: discard the candidate and re-evaluate from the start. Failure behaviour: Guard or scope check unavailable: fail closed (no write).
- **Requirement origin:** Reference-derived design requirement (profile protected-write path) plus customer-supplied scenario.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer commit-boundary guard before execution (Phase 1 equivalent) and again at the persistence adapter (scope match).
- **Audit record:** Candidate ID, proposition, scope hash, record versions, requester/agent identity, decision.
- **Validation:** TEST-01, TEST-07, TEST-17
- **Provenance:** SRC-02, SRC-03

## CTRL-02 - Claim-specific identity evidence gate (similarity is not identity)

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Prevents a lexical or commercial-neighbourhood resemblance from being persisted as one legal-entity identity.
- **Trigger:** Before any identity decision on the candidate pair.
- **Required inputs:** CLAIM-01 candidate record; CLAIM-02 evidence with provenance, role (support / contradiction / unresolved indication), validation basis, policy and validator version
- **Required action:** Require claim-specific, authorization-eligible evidence for CLAIM-02 (co-reference) as defined by customer policy. Name similarity, shared domain, an overlapping contact, embeddings, LLM confidence, agent-generated labels and repetition of the same signals are planner-visible hypotheses only. Absence of a detected conflict is not positive support. The planner may not weaken or replace the required claims.
- **Evidence / approval preconditions:** Evidence eligibility is decided by the customer-designated promotion authority (unassigned).
- **Enforcement point:** Customer evidence service and policy evaluator ahead of the commit-boundary guard.
- **On sufficient support:** Evidence requirement satisfied; continue to conflict, temporal, authorization and atomicity controls (no automatic write).
- **On conflict:** Eligible contradiction: block the MERGE.
- **On indeterminate / insufficient evidence:** Insufficient or unverified support: HOLD / DEFER and route to evidence gathering or designated review.
- **On stale version / failed validation:** Evidence or policy version changed since promotion: re-evaluate. Failure behaviour: Evidence service unavailable or policy missing: fail closed (HOLD).
- **Requirement origin:** Reference-derived design requirement (illustrative profile pattern: similarity does not establish co-reference).
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer evidence service and policy evaluator ahead of the commit-boundary guard.
- **Audit record:** Evidence record IDs per proposition, role, validator and policy version, promotion decision.
- **Validation:** TEST-01, TEST-02, TEST-08
- **Provenance:** SRC-02, SRC-03

## CTRL-03 - Registry-extract eligibility and evidence admission

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Stops an unverified or out-of-scope extract from carrying the identity decision.
- **Trigger:** A registry extract, or any new observation, is offered as support for CLAIM-02 or CLAIM-03.
- **Required inputs:** Registry extract with date, source authority and scope; Validation record with validator and policy version
- **Required action:** Admit every observation first as quarantined/unverified. Before the registry extract may support the proposition, verify its currency, scope, jurisdiction and applicability to both records and to the identity proposition, and record the validation basis and validator version. A potentially matching identifier is a signal to verify, not a verified match. Shadow or agent-derived content must not be promoted.
- **Evidence / approval preconditions:** Promotion authority is customer-defined (unassigned).
- **Enforcement point:** Customer evidence admission / promotion service.
- **On sufficient support:** Extract becomes authorization-eligible for only the proposition and interval it was validated for.
- **On conflict:** Extract contradicts the proposition: record as contradiction; MERGE blocked.
- **On indeterminate / insufficient evidence:** Currency, scope or applicability unknown: keep UNVERIFIED; HOLD.
- **On stale version / failed validation:** Extract older than policy allows or superseded: re-validate. Failure behaviour: Validator unavailable: do not promote; HOLD.
- **Requirement origin:** Reference-derived design requirement (evidence promotion fields returned by the profile) plus customer-supplied scenario.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer evidence admission / promotion service.
- **Audit record:** Extract identity and hash, validation result, validator version, promotion decision, evidentiary role.
- **Validation:** TEST-01, TEST-03
- **Provenance:** SRC-02, SRC-03

## CTRL-04 - Parent/holding indication and contradiction handling

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Prevents collapsing two legal entities into one through a merge that loses the parent/holding relation.
- **Trigger:** Any evidence or document indicates that the two records are related but distinct legal entities (parent/holding, subsidiary, affiliate).
- **Required inputs:** Contract document (the document itself); Registry ownership/control or entity-type evidence for both records; Reviewer adjudication record
- **Required action:** Retain the indication as an unresolved or contradictory claim; clustering or merging does not reconcile it. Preserve the typed relation. Before MERGE, the customer-designated reviewer must adjudicate and record whether the records are one legal entity or related distinct entities. If distinct, do not merge; the alternative outcome (a typed parent/subsidiary link or keeping both accounts) is a separate, separately scoped operation outside this plan.
- **Evidence / approval preconditions:** Designated reviewer / policy owner (unassigned); approval authority unresolved (GAP-04).
- **Enforcement point:** Customer evidence/policy evaluator and human-review queue before the commit-boundary guard.
- **On sufficient support:** Only an adjudicated, evidenced determination that the records are one legal entity lets the control pass.
- **On conflict:** Eligible contradiction: block the MERGE and route to the typed-relation decision.
- **On indeterminate / insufficient evidence:** Indication unresolved: HOLD; the unresolved indication is INDETERMINATE and blocks commit.
- **On stale version / failed validation:** New evidence on the relationship after adjudication: re-open. Failure behaviour: Reviewer queue unavailable: HOLD.
- **Requirement origin:** Reference-derived design requirement (illustrative profile patterns: retain conflicts; preserve relation type) plus customer-supplied scenario; the parent/holding reading is an inference, not a verified fact.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer evidence/policy evaluator and human-review queue before the commit-boundary guard.
- **Audit record:** Indication source, adjudication outcome, reviewer identity, decision time.
- **Validation:** TEST-04, TEST-05
- **Provenance:** SRC-02, SRC-03

## CTRL-05 - Temporal applicability and validity interval

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Avoids persisting a continuity or identity claim for the wrong time or referent.
- **Trigger:** Before authorization and again at the commit boundary.
- **Required inputs:** Defined validity interval; Dated evidence with validity intervals
- **Required action:** Require a policy-defined validity interval for the identity assertion and confirm that every supporting item, and any rename or continuity relied on, applies to the same referent and interval. Re-check at commit time against the interval and evidence currency.
- **Evidence / approval preconditions:** Policy owner defines the interval (unassigned).
- **Enforcement point:** Customer policy evaluator and commit-boundary guard.
- **On sufficient support:** Continue when all evidence covers the interval.
- **On conflict:** Evidence for a different interval or referent: block until corrected.
- **On indeterminate / insufficient evidence:** Interval undefined or continuity unresolved: HOLD (currently the case, GAP-09).
- **On stale version / failed validation:** Interval or evidence validity changed: re-evaluate. Failure behaviour: Evidence staleness check unavailable: fail closed.
- **Requirement origin:** Reference-derived design requirement (illustrative profile pattern: continuity must apply to the relevant referent and interval) plus recommendation.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer policy evaluator and commit-boundary guard.
- **Audit record:** Interval used, evidence validity dates, comparison result.
- **Validation:** TEST-01, TEST-06
- **Provenance:** SRC-02, SRC-03

## CTRL-06 - Complete write-set inventory and pre-write HOLD

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Prevents a partially understood write set from being committed.
- **Trigger:** Before the first persistent write of the MERGE, and whenever the schema or integrations change.
- **Required inputs:** CLAIM-06 evidence; Effect inventory with per-effect boundary evidence
- **Required action:** Require a customer-verified inventory of the complete persistent write set: account records, identity links, contacts, contracts, billing references, denormalized projections, search indexes, downstream integrations, audit/outbox records, assignments and history lineage. Each item carries one effect-boundary classification (in-transaction, outside-transaction, external/async, or unknown). If completeness is unverified, HOLD before any persistent write; do not start a partial sequence and do not rely on immediate rollback as a substitute.
- **Evidence / approval preconditions:** Engineering/data-owner sign-off (unassigned).
- **Enforcement point:** Customer engineering review gate plus the commit-boundary guard.
- **On sufficient support:** Inventory verified complete: continue to CTRL-07.
- **On conflict:** Inventory contradicts the declared effect scope: block; correct the scope.
- **On indeterminate / insufficient evidence:** Any effect of unknown existence or membership: HOLD (currently all effects are unknown).
- **On stale version / failed validation:** Schema, code path or integration change: inventory invalid until re-verified. Failure behaviour: Inventory source unavailable: HOLD.
- **Requirement origin:** Skill-level engineering requirement derived from customer-supplied gaps; not a reference-contract field.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer engineering review gate plus the commit-boundary guard.
- **Audit record:** Inventory version, reviewer, per-effect classification, verification evidence.
- **Validation:** TEST-09
- **Provenance:** SRC-02, SRC-03

## CTRL-07 - Transaction coverage, commit point and atomicity gate

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Turns the undefined commit boundary into an explicit pre-write gate.
- **Trigger:** Before the first persistent write.
- **Required inputs:** Transaction and commit-point evidence; External/async effect list with delivery semantics; Database-specific concurrency design review
- **Required action:** Require evidence of the actual transaction or equivalent atomic mechanism, which effects it covers, and the exact commit point. Effects outside the atomic unit (for example search indexes and downstream integrations) must be declared as outside-transaction or external/asynchronous with their delivery and reconciliation semantics. Do not infer atomicity from the database product, an isolation level or application sequencing, and assess concurrency/anomaly protection separately (database-specific design review required). If any of this is unverified: HOLD.
- **Evidence / approval preconditions:** Engineering owner sign-off (unassigned).
- **Enforcement point:** Customer persistence adapter design review and commit-boundary guard.
- **On sufficient support:** Atomic unit and commit point verified: continue; effects outside it follow CTRL-09.
- **On conflict:** Evidence shows effects span multiple units: treat as non-atomic; stay on HOLD until a tested design exists.
- **On indeterminate / insufficient evidence:** Transaction, commit point or atomicity unknown: HOLD before the first persistent write (current state).
- **On stale version / failed validation:** Schema or persistence-version change: atomicity claim invalid until re-verified. Failure behaviour: Verification tooling unavailable: HOLD.
- **Requirement origin:** Skill-level engineering requirement; the profile's Phase 2 commit-check fields are the closest reference content and are not a transaction specification.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer persistence adapter design review and commit-boundary guard.
- **Audit record:** Transaction identifier, covered effects, commit point, verification evidence.
- **Validation:** TEST-10, TEST-11
- **Provenance:** SRC-02, SRC-03

## CTRL-08 - Pre-commit invariant failure inside a verified atomic transaction

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Ensures a failed pre-commit check leaves no partial identity change.
- **Trigger:** A required invariant or validation fails after writes begin but before commit, and only where CTRL-07 verified the atomic unit.
- **Required inputs:** Verified atomic unit (CTRL-07); Invariant definitions
- **Required action:** Abort the transaction and confirm by authoritative read that none of its writes committed. Treat this as transaction abort, not post-commit compensation. Re-evaluate from the start; do not blind retry. Invariants include realized-operation scope equals authorized scope, constraint checks on the candidate result, and evidence-to-claim support under the same snapshot.
- **Evidence / approval preconditions:** None additional; re-authorization if the candidate changes.
- **Enforcement point:** Persistence adapter inside the transaction; commit-boundary guard.
- **On sufficient support:** All invariants pass: commit may proceed only if every other control is satisfied.
- **On conflict:** Invariant breach: abort.
- **On indeterminate / insufficient evidence:** Invariant cannot be evaluated: abort.
- **On stale version / failed validation:** Authorization or version stale during the transaction: abort and re-authorize. Failure behaviour: Abort fails or outcome unknown: treat as ambiguous commit (CTRL-10).
- **Requirement origin:** Skill-level engineering requirement; Phase 2 commit-check fields returned in the profile are the related reference content.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Persistence adapter inside the transaction; commit-boundary guard.
- **Audit record:** Invariant results, abort reason, post-abort state read.
- **Validation:** TEST-12
- **Provenance:** SRC-02, SRC-03

## CTRL-09 - Post-commit and out-of-boundary failure handling

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Prevents improvised repair of an identity change that has leaked outside the atomic boundary.
- **Trigger:** A failure or invariant breach occurs after commit, or an effect outside the atomic unit (index, downstream integration, async event) fails or has already occurred.
- **Required inputs:** Documented and tested compensation procedure for this MERGE (not currently established); Reconciliation read of authoritative state
- **Required action:** Do not claim that database rollback reverses the full effect. Stop dependent mutations and publications, reconcile the actual persisted state, and invoke only a documented, tested, operation-specific compensation/recovery procedure for this MERGE. If none is established, quarantine the affected records and escalate; keep further identity changes involving them on HOLD.
- **Evidence / approval preconditions:** Recovery owner (unassigned) authorizes any compensation.
- **Enforcement point:** Customer recovery component, incident/escalation process and persistence adapter.
- **On sufficient support:** Reconciled and consistent: resume under CTRL-01.
- **On conflict:** Inconsistent state: quarantine and escalate.
- **On indeterminate / insufficient evidence:** State cannot be determined: quarantine and escalate.
- **On stale version / failed validation:** Compensation procedure version or schema change: re-test before reliance. Failure behaviour: No tested compensation exists: quarantine/escalate; no improvised repair.
- **Requirement origin:** Skill-level engineering requirement derived from the customer's untested-recovery gap.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer recovery component, incident/escalation process and persistence adapter.
- **Audit record:** Failure detection time, reconciled state, procedure invoked or quarantine decision.
- **Validation:** TEST-11, TEST-13
- **Provenance:** SRC-02, SRC-03

## CTRL-10 - Ambiguous commit outcome, idempotency and reconciliation

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Avoids a double application or an unseen partial application of an identity change.
- **Trigger:** A timeout, connection loss or error leaves it unclear whether the MERGE committed, or the same candidate is submitted more than once.
- **Required inputs:** Idempotency key bound to the authorization; Authoritative post-failure state read
- **Required action:** Do not retry blindly. Assign an idempotency key (or equivalent operation identifier) to the authorized candidate, perform a read-after-failure of authoritative state, and retry only after confirming the original operation did not commit and a retry is safe. A duplicate submission must resolve to the original outcome and must not apply the merge twice.
- **Evidence / approval preconditions:** None additional unless the candidate changes.
- **Enforcement point:** Persistence adapter and reconciliation component.
- **On sufficient support:** Confirmed not committed: retry may proceed under re-validated authorization.
- **On conflict:** Committed but not recorded: record outcome; no retry.
- **On indeterminate / insufficient evidence:** Outcome unknown: HOLD; escalate.
- **On stale version / failed validation:** Authorization expired during reconciliation: re-evaluate from the start. Failure behaviour: Reconciliation unavailable: HOLD; no retry.
- **Requirement origin:** Skill-level engineering requirement.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Persistence adapter and reconciliation component.
- **Audit record:** Idempotency key, failure observation, reconciliation read, decision.
- **Validation:** TEST-14, TEST-15
- **Provenance:** SRC-02, SRC-03

## CTRL-11 - Authorization-path eligibility for the protected MERGE (Path A / Path B)

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Keeps protected production identity writes behind explicit recovery proof or explicit accepted risk, and prevents Path B after Path A is established.
- **Trigger:** At authorization and again at the commit boundary for the protected production MERGE.
- **Required inputs:** A1/A2/A3 records or the Path B policy, approval and SoD record; Current persistence, policy and validator versions
- **Required action:** Fail closed unless one path is established. Path A requires operation-specific A1 (documented recovery/compensation covering this MERGE and its complete effect scope), A2 (successful recovery test on materially equivalent state/schema with current persistence, policy and validator versions) and A3 (attestation by a customer-designated role); it can set factual reversibility to reversible for the proven scope. Path B applies only when Path A is not established and requires a current explicit customer policy accepting this exact operation's non-recovery risk, operation-specific approval by an authorized role, and customer-defined separation of duties from ordinary approval; it establishes neither reversible nor not_reversible. An UNMERGE procedure is not recovery for MERGE unless it independently satisfies A1/A2/A3 for this operation. Recheck versions at commit; a changed version, scope or stale A2/A3 expires Path A for that decision and reversibility is treated as unknown.
- **Evidence / approval preconditions:** Path A attestor and Path B approver/policy roles are customer-defined and currently unresolved (GAP-04, GAP-08).
- **Enforcement point:** Customer commit-boundary guard / authorization service.
- **On sufficient support:** Path established: continue subject to every other control; action class remains IRREVERSIBLE_WRITE and no write is automatic.
- **On conflict:** Contradictory or inconsistent path evidence: HOLD.
- **On indeterminate / insufficient evidence:** Any prerequisite absent, stale or unresolved: HOLD.
- **On stale version / failed validation:** Version, scope or equivalence drift: Path A expires; HOLD until A2/A3 renewed or Path B independently established. Failure behaviour: Authorization service unavailable: fail closed.
- **Requirement origin:** Skill-level planning requirement applied to the protected path (Path A/B are Skill constructs, not reference-contract fields); customer-supplied gaps.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer commit-boundary guard / authorization service.
- **Audit record:** Path selected, A1/A2/A3 or policy/approval/SoD record IDs, versions checked, decision.
- **Validation:** TEST-21, TEST-22, TEST-23, TEST-24, TEST-25, TEST-26, TEST-27, TEST-28, TEST-29, TEST-30
- **Provenance:** SRC-02, SRC-03

## CTRL-12 - Operation-specific approval and authorized approvers

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Stops the agent, or an unauthorized person, from approving a protected identity change.
- **Trigger:** Before authorization of the protected MERGE.
- **Required inputs:** Current approval policy; Authorized approver roster; Approval record bound to this operation and its scope
- **Required action:** Require operation-specific approval from a role authorized by a current customer policy; ordinary merge approval does not accept irreversibility risk. Until the policy and the authorized approver list are defined, no approval can be valid and the operation stays on HOLD. The policy must also state whether the Path B approver must be independent of the ordinary approver; if unresolved, keep Path B on HOLD.
- **Evidence / approval preconditions:** Roles are not defined in the current documentation (GAP-04).
- **Enforcement point:** Customer approval workflow and commit-boundary guard.
- **On sufficient support:** Valid approval recorded: continue subject to all other controls.
- **On conflict:** Approver not authorized or not independent where required: reject.
- **On indeterminate / insufficient evidence:** Policy or roster unresolved: HOLD.
- **On stale version / failed validation:** Policy or scope changed after approval: approval void. Failure behaviour: Approval workflow unavailable: HOLD.
- **Requirement origin:** Customer-owned decision; the plan does not invent roles.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer approval workflow and commit-boundary guard.
- **Audit record:** Approver identity and role, policy version, scope bound, time.
- **Validation:** TEST-18, TEST-19, TEST-25, TEST-27, TEST-28
- **Provenance:** SRC-02, SRC-03

## CTRL-13 - Version binding, stale-state rejection and concurrency

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Prevents an authorization from outliving the state it was based on.
- **Trigger:** Authorization time and the commit boundary.
- **Required inputs:** Version identifiers and snapshot; Authorization record
- **Required action:** Bind the authorization to the operation/effect scope and to the graph/data version, evidence (active/quarantined and eligibility) version, policy version and validator version in force. At the commit boundary obtain one consistent snapshot, reject any stale authorization, re-evaluate from the start rather than replaying a stale candidate, and commit only when the checks pass, the scope is valid and the bound versions remain valid. Protect against stale reads, lost updates and concurrent modification of either record; the concrete mechanism depends on the customer's database engine and requires a database-specific design review.
- **Evidence / approval preconditions:** None additional.
- **Enforcement point:** Customer commit-boundary guard and persistence adapter.
- **On sufficient support:** Versions and scope valid: continue.
- **On conflict:** Version drift: reject authorization.
- **On indeterminate / insufficient evidence:** Version unknown: HOLD.
- **On stale version / failed validation:** Any bound version changed: re-evaluate from Phase 1 equivalent. Failure behaviour: Snapshot or version service unavailable: fail closed.
- **Requirement origin:** Reference-derived design requirement (version binding and stale-authorization rejection in the profile's commit checks); concurrency mechanism left to the customer.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer commit-boundary guard and persistence adapter.
- **Audit record:** Bound versions, snapshot ID, comparison result.
- **Validation:** TEST-01, TEST-16, TEST-17, TEST-31
- **Provenance:** SRC-02, SRC-03

## CTRL-14 - Audit and lineage record

- **Primary operation:** OP-01
- **Also applies to operations:** none (single-operation plan; no additional-operation basis objects)
- **Purpose:** Preserves traceability for review, reconciliation and any later separately authorized corrective operation.
- **Trigger:** Every candidate, decision, hold, approval, commit attempt and reconciliation.
- **Required inputs:** Pre-merge snapshot or lineage manifest; Decision log
- **Required action:** Record the candidate, proposition, evidence record IDs and roles, versions, decisions and reasons (including HOLD reasons), approvals, the pre-merge identity of both records (lineage sufficient to reconstruct the source identities) and the observed outcome. Records must not be altered after the fact. Audit coverage does not substitute for recovery evidence.
- **Evidence / approval preconditions:** None additional.
- **Enforcement point:** Customer audit/lineage component, written inside the atomic unit where the architecture allows.
- **On sufficient support:** Audit record complete: continue.
- **On conflict:** Audit write fails: block the commit.
- **On indeterminate / insufficient evidence:** Completeness unknown: HOLD.
- **On stale version / failed validation:** Schema change in audit store: re-verify. Failure behaviour: Audit store unavailable: fail closed.
- **Requirement origin:** Reference-derived design requirement (recorded basis and provenance) plus recommendation.
- **Action class and staging-isolation basis (`REVERSIBLE_WRITE`):** Not applicable; no REVERSIBLE_WRITE operation is defined.
- **Verified local preparation (`STAGE_LOCAL`):** Not applicable; no STAGE_LOCAL operation is defined.
- **Factual reversibility and evidence (`IRREVERSIBLE_WRITE`):** OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`; no `reversibility_evidence` or `irreversibility_evidence` object is present. See CTRL-11.
- **Path exclusivity:** Path A and Path B are alternatives only for OP-01; once Path A is established for the proven scope, Path B is unavailable for it. Neither changes the protected action class.
- **Owner / component:** unassigned (customer to designate); Customer audit/lineage component, written inside the atomic unit where the architecture allows.
- **Audit record:** The audit record itself.
- **Validation:** TEST-20
- **Provenance:** SRC-02, SRC-03

## Decisions requiring customer policy

GAP-04, GAP-05, GAP-07, GAP-08, GAP-09 and GAP-11 require customer policy or role definitions that this plan does not invent. See 07-assumptions-and-gaps.md.
