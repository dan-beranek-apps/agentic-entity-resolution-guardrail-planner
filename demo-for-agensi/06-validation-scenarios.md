# Validation Scenarios

**Package run ID:** 2026-11-15T17:25:14Z

The customer-operation scenarios below are proposed tests unless an execution record is explicitly included. None has been executed. Planner/Skill-level scenarios are listed separately and have no operation IDs. All fixtures are hypothetical and clearly labelled; they are not customer policy, evidence, attestation or approval.

## Customer-operation test register

| Test ID | Operation IDs | Scenario | Setup | Action | Expected result | Requirement validated | Status |
|---|---|---|---|---|---|---|---|
| TEST-01 | OP-01 | Sufficient support (all prerequisite controls satisfied) | Hypothetical fixtures: verified registry extract, co-reference evidence promoted, interval defined, no unresolved conflict, versions current. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Agent proposes the MERGE of CRM-ACCT-1042 and CRM-ACCT-8891. | Evidence, temporal, scope and version checks pass; result is ALLOW AS DESIGNED for these controls only, with write-set, atomicity, approval and authorization-path controls still required. No automatic write. | CTRL-01, CTRL-02, CTRL-03, CTRL-05, CTRL-13 | proposed |
| TEST-02 | OP-01 | Similarity without sufficient identity support | Similar names, same web domain and one overlapping contact are recorded; no verified registry evidence. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Propose the MERGE. | HOLD / DEFER; signals remain planner-visible hypotheses, not authorization-eligible; the merge is not persisted. | CTRL-02 | proposed |
| TEST-03 | OP-01 | Registry extract unverified, stale or out of scope | Extract contains a potentially matching identifier but its currency, scope and applicability are not verified. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Offer the extract as support for co-reference. | Extract stays UNVERIFIED and is not promoted; HOLD until validated for this proposition and interval. | CTRL-03 | proposed |
| TEST-04 | OP-01 | Parent/holding indication unresolved | Contract content indicates one company may be the parent/holding entity of the other; no adjudication. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Propose the MERGE. | Indication retained as an unresolved conflict; INDETERMINATE; HOLD and route to designated review; typed relation preserved. | CTRL-04 | proposed |
| TEST-05 | OP-01 | Material contradiction (distinct legal entities) | Authorization-eligible evidence shows two distinct legal entities. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Propose the MERGE. | MERGE blocked; the alternative typed-relation outcome is a separate decision outside this plan. | CTRL-04 | proposed |
| TEST-06 | OP-01 | Temporal mismatch | Registry evidence validity interval differs from the policy-defined interval or the rename date is not applicable. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Propose the MERGE. | HOLD / refresh evidence; no commit on an assumed interval. | CTRL-05 | proposed |
| TEST-07 | OP-01 | Wrong scope or entity class | Candidate scope covers an account-level duplicate rather than the legal-entity identity proposition, or the declared effect scope differs from the realized scope. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Submit the candidate for authorization. | Blocked; new candidate and new authorization required. | CTRL-01 | proposed |
| TEST-08 | OP-01 | Agent confidence offered as evidence | Agent supplies a high similarity score and a generated 'verified' label. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Propose the MERGE with that label as the only support. | Rejected as evidence; HOLD; confidence and generated labels have no authorization weight. | CTRL-02 | proposed |
| TEST-09 | OP-01 | Incomplete write-set inventory | Inventory lists account records and contacts only; billing references, indexes and integrations unclassified. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Request authorization to write. | HOLD before the first persistent write; no partial sequence started. | CTRL-06 | proposed |
| TEST-10 | OP-01 | Atomicity or commit point unverified | Transaction coverage and exact commit point are undocumented. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Request authorization to write. | HOLD before the first persistent write; atomicity is not inferred from the database product or isolation level. | CTRL-07 | proposed |
| TEST-11 | OP-01 | External or asynchronous effects outside the atomic unit | Search indexing and a downstream integration are driven by events after the transaction. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Plan the MERGE with these effects declared. | Effects declared outside the atomic boundary with delivery and reconciliation semantics; without them HOLD; rollback is not claimed to reverse them. | CTRL-07, CTRL-09 | proposed |
| TEST-12 | OP-01 | Pre-commit invariant failure inside a verified atomic transaction | Atomic unit verified in a non-production test environment; an invariant (scope match) fails before commit. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Execute in the test environment up to the invariant check. | Transaction aborts; authoritative read shows no write committed; no blind retry. | CTRL-08 | proposed |
| TEST-13 | OP-01 | Post-commit or out-of-boundary failure | Commit succeeded; a downstream integration fails afterwards. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Inject the failure in the test environment. | Dependent mutations stopped; state reconciled; only tested operation-specific compensation used, otherwise quarantine and escalate. | CTRL-09 | proposed |
| TEST-14 | OP-01 | Ambiguous commit outcome | The persistence call times out after the commit request. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Inject the timeout. | No blind retry; idempotency key and authoritative read-after-failure determine whether the merge committed before any retry. | CTRL-10 | proposed |
| TEST-15 | OP-01 | Duplicate submission / idempotency | The same authorized candidate is submitted twice. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Submit twice. | Second submission resolves to the original outcome; the merge is not applied twice. | CTRL-10 | proposed |
| TEST-16 | OP-01 | Stale graph, evidence, policy or validator version | A bound version changes between authorization and commit. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Attempt to commit. | Authorization rejected as stale; re-evaluation from the start; no replay of the stale candidate. | CTRL-13 | proposed |
| TEST-17 | OP-01 | Realized operation exceeds authorized scope | The realized write touches an effect not in the authorized scope. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Attempt to commit. | Scope mismatch detected; commit blocked; new authorization required. | CTRL-01, CTRL-13 | proposed |
| TEST-18 | OP-01 | Approval missing or invalid | No operation-specific approval, or approval given for a different scope. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Request authorization. | HOLD; ordinary merge approval does not count. | CTRL-12 | proposed |
| TEST-19 | OP-01 | Authorized approver or approval policy unresolved | No current policy lists authorized approvers (current state). (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Request authorization. | HOLD; no approval can be valid until the policy and roster exist. | CTRL-12 | proposed |
| TEST-20 | OP-01 | Audit and lineage completeness | Audit store rejects the write or omits the pre-merge lineage. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Attempt to commit. | Commit blocked; completeness unknown means HOLD. | CTRL-14 | proposed |
| TEST-21 | OP-01 | Path A positive | Hypothetical fixtures: A1 mechanism for this MERGE covering the complete effect scope, A2 successful recovery test on equivalent state/schema at current persistence, policy and validator versions, A3 attestation by a designated role. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Evaluate authorization path. | Path A eligibility; factual reversibility reversible for the proven scope; action class remains IRREVERSIBLE_WRITE; all other controls still apply. | CTRL-11 | proposed |
| TEST-22 | OP-01 | Path A negative A1 | Recovery mechanism absent, not specific to this MERGE, or not covering the complete effect scope. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Evaluate authorization path. | HOLD. | CTRL-11 | proposed |
| TEST-23 | OP-01 | Path A negative A2 | Recovery tests absent, failed, stale, or not on materially equivalent state/schema or current versions. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Evaluate authorization path. | HOLD. | CTRL-11 | proposed |
| TEST-24 | OP-01 | Path A negative A3 | Attestation absent, unauthorized, or not attesting A1/A2 applicability and results. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Evaluate authorization path. | HOLD. | CTRL-11 | proposed |
| TEST-25 | OP-01 | Path B positive | Path A not established; a current explicit policy accepts this exact operation's non-recovery risk; an authorized role approves this operation; separation of duties from ordinary approval is satisfied. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Evaluate authorization path. | Path B eligibility; action class remains IRREVERSIBLE_WRITE; factual reversibility remains unknown. | CTRL-11, CTRL-12 | proposed |
| TEST-26 | OP-01 | Path B negative policy | No current policy accepts this exact operation and its non-recovery risk. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Evaluate authorization path. | HOLD. | CTRL-11 | proposed |
| TEST-27 | OP-01 | Path B negative approval / authority | Approval absent, not operation-specific, or given by a role not authorized by the policy. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Evaluate authorization path. | HOLD. | CTRL-11, CTRL-12 | proposed |
| TEST-28 | OP-01 | Path B negative separation of duties | Separation of duties absent, unresolved or violated (the ordinary approver also gives the risk acceptance). (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Evaluate authorization path. | HOLD. | CTRL-11, CTRL-12 | proposed |
| TEST-29 | OP-01 | Path exclusivity | Path A is established for the complete scope. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Attempt to solicit or record non-recovery-risk acceptance for the same operation and scope. | Path B unavailable for that operation and scope; no acceptance solicited or recorded. | CTRL-11 | proposed |
| TEST-30 | OP-01 | UNMERGE offered as recovery without independent proof | An UNMERGE procedure is offered as the recovery mechanism for this MERGE without its own A1/A2/A3. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Evaluate authorization path. | Path A not established; reversibility stays unknown; HOLD. | CTRL-11 | proposed |
| TEST-31 | OP-01 | Concurrent modification of either record | A contact on one account changes between evidence capture and commit. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.) | Attempt to commit. | Stale state detected; authorization rejected; re-evaluation from the start. | CTRL-13 | proposed |

## TEST-01 - Sufficient support (all prerequisite controls satisfied)

- **Purpose:** Sufficient support (all prerequisite controls satisfied)
- **Setup:** Hypothetical fixtures: verified registry extract, co-reference evidence promoted, interval defined, no unresolved conflict, versions current. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Agent proposes the MERGE of CRM-ACCT-1042 and CRM-ACCT-8891.
- **Expected result:** Evidence, temporal, scope and version checks pass; result is ALLOW AS DESIGNED for these controls only, with write-set, atomicity, approval and authorization-path controls still required. No automatic write.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-01, CTRL-02, CTRL-03, CTRL-05, CTRL-13
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-02 - Similarity without sufficient identity support

- **Purpose:** Similarity without sufficient identity support
- **Setup:** Similar names, same web domain and one overlapping contact are recorded; no verified registry evidence. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Propose the MERGE.
- **Expected result:** HOLD / DEFER; signals remain planner-visible hypotheses, not authorization-eligible; the merge is not persisted.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-02
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-03 - Registry extract unverified, stale or out of scope

- **Purpose:** Registry extract unverified, stale or out of scope
- **Setup:** Extract contains a potentially matching identifier but its currency, scope and applicability are not verified. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Offer the extract as support for co-reference.
- **Expected result:** Extract stays UNVERIFIED and is not promoted; HOLD until validated for this proposition and interval.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-03
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-04 - Parent/holding indication unresolved

- **Purpose:** Parent/holding indication unresolved
- **Setup:** Contract content indicates one company may be the parent/holding entity of the other; no adjudication. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Propose the MERGE.
- **Expected result:** Indication retained as an unresolved conflict; INDETERMINATE; HOLD and route to designated review; typed relation preserved.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-04
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-05 - Material contradiction (distinct legal entities)

- **Purpose:** Material contradiction (distinct legal entities)
- **Setup:** Authorization-eligible evidence shows two distinct legal entities. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Propose the MERGE.
- **Expected result:** MERGE blocked; the alternative typed-relation outcome is a separate decision outside this plan.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-04
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-06 - Temporal mismatch

- **Purpose:** Temporal mismatch
- **Setup:** Registry evidence validity interval differs from the policy-defined interval or the rename date is not applicable. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Propose the MERGE.
- **Expected result:** HOLD / refresh evidence; no commit on an assumed interval.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-05
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-07 - Wrong scope or entity class

- **Purpose:** Wrong scope or entity class
- **Setup:** Candidate scope covers an account-level duplicate rather than the legal-entity identity proposition, or the declared effect scope differs from the realized scope. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Submit the candidate for authorization.
- **Expected result:** Blocked; new candidate and new authorization required.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-01
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-08 - Agent confidence offered as evidence

- **Purpose:** Agent confidence offered as evidence
- **Setup:** Agent supplies a high similarity score and a generated 'verified' label. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Propose the MERGE with that label as the only support.
- **Expected result:** Rejected as evidence; HOLD; confidence and generated labels have no authorization weight.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-02
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-09 - Incomplete write-set inventory

- **Purpose:** Incomplete write-set inventory
- **Setup:** Inventory lists account records and contacts only; billing references, indexes and integrations unclassified. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Request authorization to write.
- **Expected result:** HOLD before the first persistent write; no partial sequence started.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-06
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-10 - Atomicity or commit point unverified

- **Purpose:** Atomicity or commit point unverified
- **Setup:** Transaction coverage and exact commit point are undocumented. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Request authorization to write.
- **Expected result:** HOLD before the first persistent write; atomicity is not inferred from the database product or isolation level.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-07
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-11 - External or asynchronous effects outside the atomic unit

- **Purpose:** External or asynchronous effects outside the atomic unit
- **Setup:** Search indexing and a downstream integration are driven by events after the transaction. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Plan the MERGE with these effects declared.
- **Expected result:** Effects declared outside the atomic boundary with delivery and reconciliation semantics; without them HOLD; rollback is not claimed to reverse them.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-07, CTRL-09
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-12 - Pre-commit invariant failure inside a verified atomic transaction

- **Purpose:** Pre-commit invariant failure inside a verified atomic transaction
- **Setup:** Atomic unit verified in a non-production test environment; an invariant (scope match) fails before commit. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Execute in the test environment up to the invariant check.
- **Expected result:** Transaction aborts; authoritative read shows no write committed; no blind retry.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-08
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-13 - Post-commit or out-of-boundary failure

- **Purpose:** Post-commit or out-of-boundary failure
- **Setup:** Commit succeeded; a downstream integration fails afterwards. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Inject the failure in the test environment.
- **Expected result:** Dependent mutations stopped; state reconciled; only tested operation-specific compensation used, otherwise quarantine and escalate.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-09
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-14 - Ambiguous commit outcome

- **Purpose:** Ambiguous commit outcome
- **Setup:** The persistence call times out after the commit request. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Inject the timeout.
- **Expected result:** No blind retry; idempotency key and authoritative read-after-failure determine whether the merge committed before any retry.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-10
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-15 - Duplicate submission / idempotency

- **Purpose:** Duplicate submission / idempotency
- **Setup:** The same authorized candidate is submitted twice. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Submit twice.
- **Expected result:** Second submission resolves to the original outcome; the merge is not applied twice.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-10
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-16 - Stale graph, evidence, policy or validator version

- **Purpose:** Stale graph, evidence, policy or validator version
- **Setup:** A bound version changes between authorization and commit. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Attempt to commit.
- **Expected result:** Authorization rejected as stale; re-evaluation from the start; no replay of the stale candidate.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-13
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-17 - Realized operation exceeds authorized scope

- **Purpose:** Realized operation exceeds authorized scope
- **Setup:** The realized write touches an effect not in the authorized scope. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Attempt to commit.
- **Expected result:** Scope mismatch detected; commit blocked; new authorization required.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-01, CTRL-13
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-18 - Approval missing or invalid

- **Purpose:** Approval missing or invalid
- **Setup:** No operation-specific approval, or approval given for a different scope. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Request authorization.
- **Expected result:** HOLD; ordinary merge approval does not count.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-12
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-19 - Authorized approver or approval policy unresolved

- **Purpose:** Authorized approver or approval policy unresolved
- **Setup:** No current policy lists authorized approvers (current state). (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Request authorization.
- **Expected result:** HOLD; no approval can be valid until the policy and roster exist.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-12
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-20 - Audit and lineage completeness

- **Purpose:** Audit and lineage completeness
- **Setup:** Audit store rejects the write or omits the pre-merge lineage. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Attempt to commit.
- **Expected result:** Commit blocked; completeness unknown means HOLD.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-14
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-21 - Path A positive

- **Purpose:** Path A positive
- **Setup:** Hypothetical fixtures: A1 mechanism for this MERGE covering the complete effect scope, A2 successful recovery test on equivalent state/schema at current persistence, policy and validator versions, A3 attestation by a designated role. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Evaluate authorization path.
- **Expected result:** Path A eligibility; factual reversibility reversible for the proven scope; action class remains IRREVERSIBLE_WRITE; all other controls still apply.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-11
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-22 - Path A negative A1

- **Purpose:** Path A negative A1
- **Setup:** Recovery mechanism absent, not specific to this MERGE, or not covering the complete effect scope. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Evaluate authorization path.
- **Expected result:** HOLD.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-11
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-23 - Path A negative A2

- **Purpose:** Path A negative A2
- **Setup:** Recovery tests absent, failed, stale, or not on materially equivalent state/schema or current versions. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Evaluate authorization path.
- **Expected result:** HOLD.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-11
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-24 - Path A negative A3

- **Purpose:** Path A negative A3
- **Setup:** Attestation absent, unauthorized, or not attesting A1/A2 applicability and results. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Evaluate authorization path.
- **Expected result:** HOLD.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-11
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-25 - Path B positive

- **Purpose:** Path B positive
- **Setup:** Path A not established; a current explicit policy accepts this exact operation's non-recovery risk; an authorized role approves this operation; separation of duties from ordinary approval is satisfied. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Evaluate authorization path.
- **Expected result:** Path B eligibility; action class remains IRREVERSIBLE_WRITE; factual reversibility remains unknown.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-11, CTRL-12
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-26 - Path B negative policy

- **Purpose:** Path B negative policy
- **Setup:** No current policy accepts this exact operation and its non-recovery risk. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Evaluate authorization path.
- **Expected result:** HOLD.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-11
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-27 - Path B negative approval / authority

- **Purpose:** Path B negative approval / authority
- **Setup:** Approval absent, not operation-specific, or given by a role not authorized by the policy. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Evaluate authorization path.
- **Expected result:** HOLD.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-11, CTRL-12
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-28 - Path B negative separation of duties

- **Purpose:** Path B negative separation of duties
- **Setup:** Separation of duties absent, unresolved or violated (the ordinary approver also gives the risk acceptance). (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Evaluate authorization path.
- **Expected result:** HOLD.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-11, CTRL-12
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-29 - Path exclusivity

- **Purpose:** Path exclusivity
- **Setup:** Path A is established for the complete scope. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Attempt to solicit or record non-recovery-risk acceptance for the same operation and scope.
- **Expected result:** Path B unavailable for that operation and scope; no acceptance solicited or recorded.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-11
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-30 - UNMERGE offered as recovery without independent proof

- **Purpose:** UNMERGE offered as recovery without independent proof
- **Setup:** An UNMERGE procedure is offered as the recovery mechanism for this MERGE without its own A1/A2/A3. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Evaluate authorization path.
- **Expected result:** Path A not established; reversibility stays unknown; HOLD.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-11
- **Operation IDs:** OP-01
- **Status:** `proposed`

## TEST-31 - Concurrent modification of either record

- **Purpose:** Concurrent modification of either record
- **Setup:** A contact on one account changes between evidence capture and commit. (Hypothetical, clearly labelled proposed fixture; not actual customer evidence, policy or approval.)
- **Action:** Attempt to commit.
- **Expected result:** Stale state detected; authorization rejected; re-evaluation from the start.
- **Failure condition:** the application behaves differently from the expected result (for example it proceeds toward a write instead of holding).
- **Related operations / controls:** OP-01; CTRL-13
- **Operation IDs:** OP-01
- **Status:** `proposed`

## Operation-ID scope consistency

The plan has one operation (OP-01) and every test exercises it. The `operation_ids` array is an exact test boundary; every explicit operation ID in a test narrative matches it.

## Mandatory authorization-path coverage for protected writes

OP-01 is IRREVERSIBLE_WRITE with factual reversibility `unknown`, so at least nine separate tests are required:

| Required case | Test | Controls |
|---|---|---|
| Path A positive | TEST-21 | CTRL-11 |
| Path A negative A1 | TEST-22 | CTRL-11 |
| Path A negative A2 | TEST-23 | CTRL-11 |
| Path A negative A3 | TEST-24 | CTRL-11 |
| Path B positive | TEST-25 | CTRL-11, CTRL-12 |
| Path B negative policy | TEST-26 | CTRL-11 |
| Path B negative authority/approval | TEST-27 | CTRL-11, CTRL-12 |
| Path B negative separation of duties | TEST-28 | CTRL-11, CTRL-12 |
| Path exclusivity | TEST-29 | CTRL-11 |
| Supplementary: UNMERGE offered as recovery without independent proof | TEST-30 | CTRL-11 |

No REVERSIBLE_WRITE or STAGE_LOCAL operation is defined, so no staging-isolation tests apply. No operation has factual reversibility `reversible`, so the six-scenario Path A maintenance set does not apply yet; TEST-21 to TEST-24 and TEST-29 would be extended if Path A is later established.

## Planner-level check register

| Check ID | Validates | Scenario | Status |
|---|---|---|---|
| PCHK-01 | mcp_availability_and_response_completeness | Required reference retrieval unavailable or materially incomplete | proposed |
| PCHK-02 | reference_version_consistency | Reference version changes or is inconsistent across retrievals in one run | proposed |
| PCHK-03 | scope_qualification | Request outside the supported scope | proposed |

### PCHK-01 - Required reference retrieval unavailable or materially incomplete

- **Validates:** mcp_availability_and_response_completeness
- **Setup:** The mutation profile call fails or omits the requested mutation type, action class, or profile version.
- **Action:** Run the Skill workflow.
- **Expected result:** Run is labelled degraded_reference_unavailable; affected requirements are marked unresolved with the exact missing retrieval; no reference backing is claimed.
- **Source refs:** SRC-01, SRC-02
- **Status:** `proposed`

### PCHK-02 - Reference version changes or is inconsistent across retrievals in one run

- **Validates:** reference_version_consistency
- **Setup:** The status call and the profile report different reference-set versions.
- **Action:** Compare versions recorded in provenance.
- **Expected result:** Inconsistency recorded; affected provenance not treated as consistent; run marked degraded or repeated.
- **Source refs:** SRC-01, SRC-02
- **Status:** `proposed`

### PCHK-03 - Request outside the supported scope

- **Validates:** scope_qualification
- **Setup:** A request for ordinary field-update CRUD, or to execute the merge, is submitted.
- **Action:** Run qualification.
- **Expected result:** Scope boundary explained; no execution; no invented reference coverage; an implementation specification is offered instead.
- **Source refs:** none
- **Status:** `proposed`
