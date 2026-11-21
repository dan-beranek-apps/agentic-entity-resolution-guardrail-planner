# Validation Scenarios

**Package run ID:** 2026-11-21T01:15:46Z

The customer-operation scenarios below are proposed tests; none was executed. Fixtures are hypothetical and labelled; they are not customer evidence, policy, approval or attestation. Planner-level scenarios are in the separate register below and in JSON `planner_checks`; they have no operation IDs.

| Test ID | Operation IDs | Scenario | Setup | Action | Expected result | Requirement validated | Status |
|---|---|---|---|---|---|---|---|
| TEST-01 | OP-DEMO-2026-001 | Sufficient support under customer policy (hypothetical positive path) | HYPOTHETICAL FIXTURE (not customer data or evidence): the registry evidence for FIC-REG-004821 is authentic, current within the customer's freshness limit, shows the 2024-04-01 name change with unchanged registration number and legal-person continuity, and no dissolution or successor; both records carry the same registry ID under the documented normalization rule. | Submit the candidate MERGE of CRM-ACCT-2097 into CRM-ACCT-1042 to the identity and evidence gates. | CTRL-01, CTRL-03 and CTRL-04 report support for the stated interval and the candidate advances to the remaining controls. No authorization to write results from this test alone. | CTRL-01, CTRL-03, CTRL-04 | proposed |
| TEST-02 | OP-DEMO-2026-001 | Similarity without sufficient identity support | HYPOTHETICAL FIXTURE (not customer data or evidence): two records share a similar name, domain, address and contacts, but no official registry ID or continuity evidence is attached. | Submit the candidate MERGE. | The candidate is held; names, domains, addresses and contact similarity are not accepted as identity proof; no persistent write occurs. | CTRL-01, CTRL-02 | proposed |
| TEST-03 | OP-DEMO-2026-001 | Negative control: parent and subsidiary with different official registration IDs | HYPOTHETICAL FIXTURE (not customer data or evidence): a parent company record and a subsidiary record have near-identical names, the same web domain and address and shared contacts, but different official registry IDs. | Submit the candidate MERGE through the same merge gates, with every approval present in the fixture. | The merge is blocked on the distinct registry IDs; no approval or authorization path overrides it; the related-entity relation is retained as a typed relation; no persistent write occurs. | CTRL-02, CTRL-01 | proposed |
| TEST-04 | OP-DEMO-2026-001 | Registry ID equal only after ambiguous normalization | HYPOTHETICAL FIXTURE (not customer data or evidence): the two registry ID values differ in formatting (case, spacing or leading characters) and the customer has not defined a normalization rule. | Submit the candidate MERGE. | The candidate is held until a documented normalization rule resolves the comparison; no persistent write occurs. | CTRL-01 | proposed |
| TEST-05 | OP-DEMO-2026-001 | Material contradiction in registry evidence | HYPOTHETICAL FIXTURE (not customer data or evidence): fresh registry evidence shows a dissolution of the entity or a successor/new incorporation after the 2024-04-01 name change. | Submit the candidate MERGE with the new evidence quarantined and adjudicated as a contradiction. | The candidate is blocked and escalated for designated adjudication; absence of a conflict is never treated as proof; no persistent write occurs. | CTRL-03, CTRL-04 | proposed |
| TEST-06 | OP-DEMO-2026-001 | Authenticity of the registry extract indeterminate | HYPOTHETICAL FIXTURE (not customer data or evidence): the verification record cannot be tied to the exact extract (identifier or hash mismatch) or lacks validator identity and version. | Submit the candidate MERGE. | The extract stays UNVERIFIED and quarantined; it is not promoted as authorization-eligible support; the candidate is held. | CTRL-03 | proposed |
| TEST-07 | OP-DEMO-2026-001 | Only non-independent internal mapping evidence | HYPOTHETICAL FIXTURE (not customer data or evidence): the only support is the migration report mapping and the account-to-entity crosswalk, with no registry or contract evidence. | Submit the candidate MERGE. | The two records are treated as non-independent internal mappings that share an upstream origin; they are not counted as independent corroboration; the candidate is held. | CTRL-03 | proposed |
| TEST-08 | OP-DEMO-2026-001 | Temporal mismatch or stale evidence | HYPOTHETICAL FIXTURE (not customer data or evidence): the registry extract is older than the customer's freshness limit, or the freshness limit is undefined, or the evidence does not cover the interval to the commit time. | Re-evaluate the candidate at the pre-persistence check. | The candidate is held until refreshed registry evidence covers the interval; a new authorization record is required; no persistent write occurs. | CTRL-04 | proposed |
| TEST-09 | OP-DEMO-2026-001 | Wrong merge direction or canonical record | HYPOTHETICAL FIXTURE (not customer data or evidence): the candidate attempts to retain CRM-ACCT-2097 as canonical, or to merge CRM-ACCT-1042 into CRM-ACCT-2097. | Submit the candidate for pre-persistence validation. | The candidate is blocked because POL-MDM-07 v3.2 retains CRM-ACCT-1042 as canonical; no persistent write occurs. | CTRL-05 | proposed |
| TEST-10 | OP-DEMO-2026-001 | Resulting-state check fails on name adoption or history preservation | HYPOTHETICAL FIXTURE (not customer data or evidence): the prepared resulting state drops the legacy name, omits provenance of historical names, rewrites historical activity to the canonical ID, or updates or deletes an existing account_merge_history row. | Run the pre-commit validator inside the transaction. | Validation fails and the transaction aborts with no committed rows in any of the seven tables; the current legal name is adopted only with historical names and provenance preserved. | CTRL-05, CTRL-10 | proposed |
| TEST-11 | OP-DEMO-2026-001 | Required approvals missing | HYPOTHETICAL FIXTURE (not customer data or evidence): no approval, or only one of the Data Steward and CRM Platform Owner approvals, exists. | Attempt to proceed to persistence. | The operation is held before any persistent write; approvals are not inferred or accepted from the Planner. | CTRL-06 | proposed |
| TEST-12 | OP-DEMO-2026-001 | Approval invalid, unbound or replayed on changed state | HYPOTHETICAL FIXTURE (not customer data or evidence): an approval is not bound to the operation ID, idempotency key and state, or both roles were filled by the same individual, or the row version changed after approval. | Attempt to proceed to persistence. | The approval is rejected as invalid and a new approval for the current state is required; no persistent write occurs. | CTRL-06, CTRL-09 | proposed |
| TEST-13 | OP-DEMO-2026-001 | Path A positive (hypothetical fixture) | HYPOTHETICAL FIXTURE (not customer data or evidence): A1 (documented recovery or compensation mechanism for this exact MERGE and its complete effect scope), A2 (successful recovery test on materially equivalent state and schema using current persistence, policy and validator versions) and A3 (attestation by a customer-designated role) are all established; the write set is complete. | Evaluate the authorization path for the operation. | Path A eligibility is recorded and factual reversibility becomes reversible for the proven scope while the action class remains IRREVERSIBLE_WRITE; every other control still applies and nothing is written automatically. | CTRL-07 | proposed |
| TEST-14 | OP-DEMO-2026-001 | Path A negative: A1 missing or incomplete | HYPOTHETICAL FIXTURE (not customer data or evidence): the recovery mechanism is absent, undocumented, for a different operation, or does not cover the complete effect scope; A2 and A3 are otherwise present. | Evaluate the authorization path. | Path A is not established and the operation is held. | CTRL-07 | proposed |
| TEST-15 | OP-DEMO-2026-001 | Path A negative: A2 missing, failed, stale or non-equivalent | HYPOTHETICAL FIXTURE (not customer data or evidence): recovery tests are absent, failed, run against non-equivalent state or schema, or predate a change in persistence, policy or validator version; A1 and A3 are otherwise present. | Evaluate the authorization path. | Path A is not established and the operation is held. | CTRL-07 | proposed |
| TEST-16 | OP-DEMO-2026-001 | Path A negative: A3 attestation missing or invalid | HYPOTHETICAL FIXTURE (not customer data or evidence): the attestation is absent, given by a non-designated role, or does not attest the applicability and results of A1 and A2; A1 and A2 are otherwise present. | Evaluate the authorization path. | Path A is not established and the operation is held. | CTRL-07 | proposed |
| TEST-17 | OP-DEMO-2026-001 | Path B positive (hypothetical fixture) | HYPOTHETICAL FIXTURE (not customer data or evidence): Path A is not established; a current explicit customer policy accepts this exact operation's non-recovery risk; an authorized role gives operation-specific approval; the customer-defined separation of duties from the ordinary approvals is satisfied. | Evaluate the authorization path. | Path B eligibility is recorded; the action class stays IRREVERSIBLE_WRITE and factual reversibility stays unknown; every other control still applies and nothing is written automatically. | CTRL-07 | proposed |
| TEST-18 | OP-DEMO-2026-001 | Path B negative: no current policy accepting the non-recovery risk | HYPOTHETICAL FIXTURE (not customer data or evidence): Path A is not established and no current customer policy accepts this exact operation's non-recovery risk. | Evaluate the authorization path. | Path B is unavailable and the operation is held. | CTRL-07 | proposed |
| TEST-19 | OP-DEMO-2026-001 | Path B negative: approval absent or from an unauthorized role | HYPOTHETICAL FIXTURE (not customer data or evidence): a policy exists but operation-specific approval is absent, not specific to this operation, or given by a role the policy does not authorize; the Data Steward and CRM Platform Owner approvals are present. | Evaluate the authorization path. | Path B is unavailable and the operation is held; ordinary approvals do not count as acceptance of non-recovery risk. | CTRL-07 | proposed |
| TEST-20 | OP-DEMO-2026-001 | Path B negative: separation of duties absent, unresolved or violated | HYPOTHETICAL FIXTURE (not customer data or evidence): policy and approval exist but separation of duties from the ordinary approvals is not defined, is unresolved, or the same individual gave both approvals. | Evaluate the authorization path. | Path B is unavailable and the operation is held. | CTRL-07 | proposed |
| TEST-21 | OP-DEMO-2026-001 | Path A and Path B mutual exclusivity | HYPOTHETICAL FIXTURE (not customer data or evidence): Path A is established for the complete effect scope. | Attempt to solicit or record acceptance of non-recovery risk for the same operation and scope. | Path B is unavailable for that operation and scope; no non-recovery-risk acceptance is solicited or recorded while Path A remains established. | CTRL-07 | proposed |
| TEST-22 | OP-DEMO-2026-001 | Write-set completeness or atomicity unverified before the first write | HYPOTHETICAL FIXTURE (not customer data or evidence): no evidence shows that all seven tables, the storage for historical names and the outbox insertion are covered by one atomic transaction with a single commit point. | Request execution. | The operation is held before the first persistent write; no partial write sequence starts and isolation level is not accepted as proof of atomicity. | CTRL-08 | proposed |
| TEST-23 | OP-DEMO-2026-001 | Write outside the declared set or into historical activity | HYPOTHETICAL FIXTURE (not customer data or evidence): dependency analysis finds an object referencing the account IDs that is not in the declared write set, or the candidate write set includes a historical activity record. | Evaluate the write set. | The operation is blocked and held until the write set is reconciled; historical activity keeps its original account IDs. | CTRL-08 | proposed |
| TEST-24 | OP-DEMO-2026-001 | State, schema, coordinator, validator or policy drift before the write | HYPOTHETICAL FIXTURE (not customer data or evidence): after approval, CRM-ACCT-1042 moves from row version 18 or CRM-ACCT-2097 from row version 23, or the schema, coordinator, validator or policy identifier changes. | Run the immediate pre-write revalidation. | The authorization is rejected as stale and the candidate is re-evaluated from the evidence stage with a new authorization record; the stale candidate is not replayed. | CTRL-09 | proposed |
| TEST-25 | OP-DEMO-2026-001 | Pre-commit invariant failure inside the atomic transaction | HYPOTHETICAL FIXTURE (not customer data or evidence): the pre-commit validator returns a failure or the database reports a serialization conflict before COMMIT. | Execute the write inside the single SERIALIZABLE transaction. | The transaction aborts and a read of all seven tables shows no committed change from the operation; this is a transaction abort and not post-commit compensation. | CTRL-10 | proposed |
| TEST-26 | OP-DEMO-2026-001 | Outbox atomicity | HYPOTHETICAL FIXTURE (not customer data or evidence): a failure is injected after the outbox insertion but before COMMIT, and separately after a successful COMMIT. | Execute the write and inspect the outbox. | The outbox event exists if and only if the merge committed; no downstream event is emitted for an aborted transaction. | CTRL-10, CTRL-12 | proposed |
| TEST-27 | OP-DEMO-2026-001 | Ambiguous commit outcome | HYPOTHETICAL FIXTURE (not customer data or evidence): the connection is lost at COMMIT and the outcome is unknown. | Trigger reconciliation without retrying. | No blind retry occurs; the authoritative state is read by idempotency key demo-merge-1042-2097-v1; the original outcome is returned if committed; retry is considered only after confirming non-commit. | CTRL-11 | proposed |
| TEST-28 | OP-DEMO-2026-001 | Duplicate request after a confirmed commit | HYPOTHETICAL FIXTURE (not customer data or evidence): the merge committed and the same idempotency key is submitted again. | Submit the duplicate request. | No second merge is performed and the original outcome is returned. | CTRL-11 | proposed |
| TEST-29 | OP-DEMO-2026-001 | Retry after confirmed non-commit | HYPOTHETICAL FIXTURE (not customer data or evidence): reconciliation confirms the original transaction did not commit and the failure was a serialization conflict. | Request a retry. | The retry is allowed only after revalidation of state, versions and approvals, within the common retry budget, with a new authorization record if any bound item changed. | CTRL-11, CTRL-09 | proposed |
| TEST-30 | OP-DEMO-2026-001 | Post-commit validation mismatch | HYPOTHETICAL FIXTURE (not customer data or evidence): after commit the canonical account has a contract or contact link count that differs from the authorized result, or the historical names were not preserved. | Run post-commit validation. | Dependent mutations stop, the accounts and projections are quarantined, and the overall decision stays on HOLD for further identity changes. | CTRL-12, CTRL-13 | proposed |
| TEST-31 | OP-DEMO-2026-001 | Downstream consumer failure, duplicate delivery or divergence | HYPOTHETICAL FIXTURE (not customer data or evidence): the search index, Billing read model or ERP crosswalk consumer fails, receives the event twice, or diverges; the ERP crosswalk already maps both IDs to EC-004821. | Run outbox consumers and the reconciliation job. | Consumers handle duplicates idempotently; divergence is detected and reconciled without re-running the merge; the operation is not marked complete until all consumers reconcile. | CTRL-12 | proposed |
| TEST-32 | OP-DEMO-2026-001 | Post-commit failure with no tested recovery procedure | HYPOTHETICAL FIXTURE (not customer data or evidence): a post-commit failure is detected and no documented, tested compensation procedure for this exact MERGE exists. | Handle the failure. | Dependent mutations stop, affected accounts and projections are quarantined and escalated, the decision stays on HOLD, and UNMERGE is not assumed to be recovery. | CTRL-13 | proposed |

## TEST-01 — Sufficient support under customer policy (hypothetical positive path)

- **Purpose:** Sufficient support under customer policy (hypothetical positive path).
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the registry evidence for FIC-REG-004821 is authentic, current within the customer's freshness limit, shows the 2024-04-01 name change with unchanged registration number and legal-person continuity, and no dissolution or successor; both records carry the same registry ID under the documented normalization rule.
- **Action:** Submit the candidate MERGE of CRM-ACCT-2097 into CRM-ACCT-1042 to the identity and evidence gates.
- **Expected result:** CTRL-01, CTRL-03 and CTRL-04 report support for the stated interval and the candidate advances to the remaining controls. No authorization to write results from this test alone.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-01, CTRL-03, CTRL-04
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-02 — Similarity without sufficient identity support

- **Purpose:** Similarity without sufficient identity support.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): two records share a similar name, domain, address and contacts, but no official registry ID or continuity evidence is attached.
- **Action:** Submit the candidate MERGE.
- **Expected result:** The candidate is held; names, domains, addresses and contact similarity are not accepted as identity proof; no persistent write occurs.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-01, CTRL-02
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-03 — Negative control: parent and subsidiary with different official registration IDs

- **Purpose:** Negative control: parent and subsidiary with different official registration IDs.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): a parent company record and a subsidiary record have near-identical names, the same web domain and address and shared contacts, but different official registry IDs.
- **Action:** Submit the candidate MERGE through the same merge gates, with every approval present in the fixture.
- **Expected result:** The merge is blocked on the distinct registry IDs; no approval or authorization path overrides it; the related-entity relation is retained as a typed relation; no persistent write occurs.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-02, CTRL-01
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-04 — Registry ID equal only after ambiguous normalization

- **Purpose:** Registry ID equal only after ambiguous normalization.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the two registry ID values differ in formatting (case, spacing or leading characters) and the customer has not defined a normalization rule.
- **Action:** Submit the candidate MERGE.
- **Expected result:** The candidate is held until a documented normalization rule resolves the comparison; no persistent write occurs.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-01
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-05 — Material contradiction in registry evidence

- **Purpose:** Material contradiction in registry evidence.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): fresh registry evidence shows a dissolution of the entity or a successor/new incorporation after the 2024-04-01 name change.
- **Action:** Submit the candidate MERGE with the new evidence quarantined and adjudicated as a contradiction.
- **Expected result:** The candidate is blocked and escalated for designated adjudication; absence of a conflict is never treated as proof; no persistent write occurs.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-03, CTRL-04
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-06 — Authenticity of the registry extract indeterminate

- **Purpose:** Authenticity of the registry extract indeterminate.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the verification record cannot be tied to the exact extract (identifier or hash mismatch) or lacks validator identity and version.
- **Action:** Submit the candidate MERGE.
- **Expected result:** The extract stays UNVERIFIED and quarantined; it is not promoted as authorization-eligible support; the candidate is held.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-03
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-07 — Only non-independent internal mapping evidence

- **Purpose:** Only non-independent internal mapping evidence.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the only support is the migration report mapping and the account-to-entity crosswalk, with no registry or contract evidence.
- **Action:** Submit the candidate MERGE.
- **Expected result:** The two records are treated as non-independent internal mappings that share an upstream origin; they are not counted as independent corroboration; the candidate is held.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-03
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-08 — Temporal mismatch or stale evidence

- **Purpose:** Temporal mismatch or stale evidence.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the registry extract is older than the customer's freshness limit, or the freshness limit is undefined, or the evidence does not cover the interval to the commit time.
- **Action:** Re-evaluate the candidate at the pre-persistence check.
- **Expected result:** The candidate is held until refreshed registry evidence covers the interval; a new authorization record is required; no persistent write occurs.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-04
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-09 — Wrong merge direction or canonical record

- **Purpose:** Wrong merge direction or canonical record.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the candidate attempts to retain CRM-ACCT-2097 as canonical, or to merge CRM-ACCT-1042 into CRM-ACCT-2097.
- **Action:** Submit the candidate for pre-persistence validation.
- **Expected result:** The candidate is blocked because POL-MDM-07 v3.2 retains CRM-ACCT-1042 as canonical; no persistent write occurs.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-05
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-10 — Resulting-state check fails on name adoption or history preservation

- **Purpose:** Resulting-state check fails on name adoption or history preservation.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the prepared resulting state drops the legacy name, omits provenance of historical names, rewrites historical activity to the canonical ID, or updates or deletes an existing account_merge_history row.
- **Action:** Run the pre-commit validator inside the transaction.
- **Expected result:** Validation fails and the transaction aborts with no committed rows in any of the seven tables; the current legal name is adopted only with historical names and provenance preserved.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-05, CTRL-10
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-11 — Required approvals missing

- **Purpose:** Required approvals missing.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): no approval, or only one of the Data Steward and CRM Platform Owner approvals, exists.
- **Action:** Attempt to proceed to persistence.
- **Expected result:** The operation is held before any persistent write; approvals are not inferred or accepted from the Planner.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-06
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-12 — Approval invalid, unbound or replayed on changed state

- **Purpose:** Approval invalid, unbound or replayed on changed state.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): an approval is not bound to the operation ID, idempotency key and state, or both roles were filled by the same individual, or the row version changed after approval.
- **Action:** Attempt to proceed to persistence.
- **Expected result:** The approval is rejected as invalid and a new approval for the current state is required; no persistent write occurs.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-06, CTRL-09
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-13 — Path A positive (hypothetical fixture)

- **Purpose:** Path A positive (hypothetical fixture).
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): A1 (documented recovery or compensation mechanism for this exact MERGE and its complete effect scope), A2 (successful recovery test on materially equivalent state and schema using current persistence, policy and validator versions) and A3 (attestation by a customer-designated role) are all established; the write set is complete.
- **Action:** Evaluate the authorization path for the operation.
- **Expected result:** Path A eligibility is recorded and factual reversibility becomes reversible for the proven scope while the action class remains IRREVERSIBLE_WRITE; every other control still applies and nothing is written automatically.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-07
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-14 — Path A negative: A1 missing or incomplete

- **Purpose:** Path A negative: A1 missing or incomplete.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the recovery mechanism is absent, undocumented, for a different operation, or does not cover the complete effect scope; A2 and A3 are otherwise present.
- **Action:** Evaluate the authorization path.
- **Expected result:** Path A is not established and the operation is held.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-07
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-15 — Path A negative: A2 missing, failed, stale or non-equivalent

- **Purpose:** Path A negative: A2 missing, failed, stale or non-equivalent.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): recovery tests are absent, failed, run against non-equivalent state or schema, or predate a change in persistence, policy or validator version; A1 and A3 are otherwise present.
- **Action:** Evaluate the authorization path.
- **Expected result:** Path A is not established and the operation is held.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-07
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-16 — Path A negative: A3 attestation missing or invalid

- **Purpose:** Path A negative: A3 attestation missing or invalid.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the attestation is absent, given by a non-designated role, or does not attest the applicability and results of A1 and A2; A1 and A2 are otherwise present.
- **Action:** Evaluate the authorization path.
- **Expected result:** Path A is not established and the operation is held.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-07
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-17 — Path B positive (hypothetical fixture)

- **Purpose:** Path B positive (hypothetical fixture).
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): Path A is not established; a current explicit customer policy accepts this exact operation's non-recovery risk; an authorized role gives operation-specific approval; the customer-defined separation of duties from the ordinary approvals is satisfied.
- **Action:** Evaluate the authorization path.
- **Expected result:** Path B eligibility is recorded; the action class stays IRREVERSIBLE_WRITE and factual reversibility stays unknown; every other control still applies and nothing is written automatically.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-07
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-18 — Path B negative: no current policy accepting the non-recovery risk

- **Purpose:** Path B negative: no current policy accepting the non-recovery risk.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): Path A is not established and no current customer policy accepts this exact operation's non-recovery risk.
- **Action:** Evaluate the authorization path.
- **Expected result:** Path B is unavailable and the operation is held.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-07
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-19 — Path B negative: approval absent or from an unauthorized role

- **Purpose:** Path B negative: approval absent or from an unauthorized role.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): a policy exists but operation-specific approval is absent, not specific to this operation, or given by a role the policy does not authorize; the Data Steward and CRM Platform Owner approvals are present.
- **Action:** Evaluate the authorization path.
- **Expected result:** Path B is unavailable and the operation is held; ordinary approvals do not count as acceptance of non-recovery risk.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-07
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-20 — Path B negative: separation of duties absent, unresolved or violated

- **Purpose:** Path B negative: separation of duties absent, unresolved or violated.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): policy and approval exist but separation of duties from the ordinary approvals is not defined, is unresolved, or the same individual gave both approvals.
- **Action:** Evaluate the authorization path.
- **Expected result:** Path B is unavailable and the operation is held.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-07
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-21 — Path A and Path B mutual exclusivity

- **Purpose:** Path A and Path B mutual exclusivity.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): Path A is established for the complete effect scope.
- **Action:** Attempt to solicit or record acceptance of non-recovery risk for the same operation and scope.
- **Expected result:** Path B is unavailable for that operation and scope; no non-recovery-risk acceptance is solicited or recorded while Path A remains established.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-07
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-22 — Write-set completeness or atomicity unverified before the first write

- **Purpose:** Write-set completeness or atomicity unverified before the first write.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): no evidence shows that all seven tables, the storage for historical names and the outbox insertion are covered by one atomic transaction with a single commit point.
- **Action:** Request execution.
- **Expected result:** The operation is held before the first persistent write; no partial write sequence starts and isolation level is not accepted as proof of atomicity.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-08
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-23 — Write outside the declared set or into historical activity

- **Purpose:** Write outside the declared set or into historical activity.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): dependency analysis finds an object referencing the account IDs that is not in the declared write set, or the candidate write set includes a historical activity record.
- **Action:** Evaluate the write set.
- **Expected result:** The operation is blocked and held until the write set is reconciled; historical activity keeps its original account IDs.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-08
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-24 — State, schema, coordinator, validator or policy drift before the write

- **Purpose:** State, schema, coordinator, validator or policy drift before the write.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): after approval, CRM-ACCT-1042 moves from row version 18 or CRM-ACCT-2097 from row version 23, or the schema, coordinator, validator or policy identifier changes.
- **Action:** Run the immediate pre-write revalidation.
- **Expected result:** The authorization is rejected as stale and the candidate is re-evaluated from the evidence stage with a new authorization record; the stale candidate is not replayed.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-09
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-25 — Pre-commit invariant failure inside the atomic transaction

- **Purpose:** Pre-commit invariant failure inside the atomic transaction.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the pre-commit validator returns a failure or the database reports a serialization conflict before COMMIT.
- **Action:** Execute the write inside the single SERIALIZABLE transaction.
- **Expected result:** The transaction aborts and a read of all seven tables shows no committed change from the operation; this is a transaction abort and not post-commit compensation.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-10
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-26 — Outbox atomicity

- **Purpose:** Outbox atomicity.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): a failure is injected after the outbox insertion but before COMMIT, and separately after a successful COMMIT.
- **Action:** Execute the write and inspect the outbox.
- **Expected result:** The outbox event exists if and only if the merge committed; no downstream event is emitted for an aborted transaction.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-10, CTRL-12
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-27 — Ambiguous commit outcome

- **Purpose:** Ambiguous commit outcome.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the connection is lost at COMMIT and the outcome is unknown.
- **Action:** Trigger reconciliation without retrying.
- **Expected result:** No blind retry occurs; the authoritative state is read by idempotency key demo-merge-1042-2097-v1; the original outcome is returned if committed; retry is considered only after confirming non-commit.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-11
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-28 — Duplicate request after a confirmed commit

- **Purpose:** Duplicate request after a confirmed commit.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the merge committed and the same idempotency key is submitted again.
- **Action:** Submit the duplicate request.
- **Expected result:** No second merge is performed and the original outcome is returned.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-11
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-29 — Retry after confirmed non-commit

- **Purpose:** Retry after confirmed non-commit.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): reconciliation confirms the original transaction did not commit and the failure was a serialization conflict.
- **Action:** Request a retry.
- **Expected result:** The retry is allowed only after revalidation of state, versions and approvals, within the common retry budget, with a new authorization record if any bound item changed.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-11, CTRL-09
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-30 — Post-commit validation mismatch

- **Purpose:** Post-commit validation mismatch.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): after commit the canonical account has a contract or contact link count that differs from the authorized result, or the historical names were not preserved.
- **Action:** Run post-commit validation.
- **Expected result:** Dependent mutations stop, the accounts and projections are quarantined, and the overall decision stays on HOLD for further identity changes.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-12, CTRL-13
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-31 — Downstream consumer failure, duplicate delivery or divergence

- **Purpose:** Downstream consumer failure, duplicate delivery or divergence.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): the search index, Billing read model or ERP crosswalk consumer fails, receives the event twice, or diverges; the ERP crosswalk already maps both IDs to EC-004821.
- **Action:** Run outbox consumers and the reconciliation job.
- **Expected result:** Consumers handle duplicates idempotently; divergence is detected and reconciled without re-running the merge; the operation is not marked complete until all consumers reconcile.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-12
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## TEST-32 — Post-commit failure with no tested recovery procedure

- **Purpose:** Post-commit failure with no tested recovery procedure.
- **Setup:** HYPOTHETICAL FIXTURE (not customer data or evidence): a post-commit failure is detected and no documented, tested compensation procedure for this exact MERGE exists.
- **Action:** Handle the failure.
- **Expected result:** Dependent mutations stop, affected accounts and projections are quarantined and escalated, the decision stays on HOLD, and UNMERGE is not assumed to be recovery.
- **Failure condition:** any persistent write, approval, authorization or evidence promotion that the expected result prohibits.
- **Related operations / controls:** OP-DEMO-2026-001; CTRL-13
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`
- **Execution note:** none
- **Execution evidence:** none (not executed)

## Operation-ID scope consistency

The `operation_ids` array is an exact test boundary. This plan has one operation, OP-DEMO-2026-001, and every test exercises it. The negative-control tests that use a different hypothetical candidate pair (TEST-03) exercise the same operation type's merge gates for OP-DEMO-2026-001 and do not introduce another operation.

## Mandatory authorization-path coverage for protected writes

OP-DEMO-2026-001 is an IRREVERSIBLE_WRITE with factual reversibility unknown, so nine separate operation-specific tests are present: TEST-13 (Path A positive), TEST-14 (A1 negative), TEST-15 (A2 negative), TEST-16 (A3 negative), TEST-17 (Path B positive), TEST-18 (Path B policy negative), TEST-19 (Path B approval/authority negative), TEST-20 (Path B separation-of-duties negative) and TEST-21 (Path A/Path B exclusivity). All are hypothetical fixtures, `proposed`, and linked reciprocally to CTRL-07. Ordinary Data Steward and CRM Platform Owner approvals never count as acceptance of non-recovery risk. No STAGE_LOCAL or REVERSIBLE_WRITE operation exists, so no staging-isolation tests apply.

## Planner-level checks (JSON `planner_checks`; not customer-operation tests)

| Planner check ID | Scenario | `validates` | Setup | Action | Expected result | Status |
|---|---|---|---|---|---|---|
| PCHK-MCP-01 | MCP unavailable or materially incomplete | mcp_availability_and_response_completeness | A required public reference retrieval is unavailable or a required response field (profile version, requested mutation type or action class, phase) is materially incomplete. | Apply the reference dependency fallback. | Use degraded_reference_unavailable, mark the affected claims unresolved, list the exact missing retrievals and invent no reference-backed content or provenance. | proposed |
| PCHK-REF-01 | Reference version drift within one run | reference_version_consistency | Two required retrievals in the same run expose incompatible reference-set versions. | Compare version basis and source identifiers and resolve the mismatch. | Do not silently combine versions; refresh consistently or mark dependent decisions unresolved or degraded. | proposed |
| PCHK-SCOPE-01 | Request outside the supported scope | scope_qualification | The request is not an identity-changing entity-resolution task, for example an unrelated field update. | Qualify the request against the Skill scope. | State the scope boundary and fabricate no operations, controls or reference coverage. | proposed |

### PCHK-MCP-01 — MCP unavailable or materially incomplete

- **Setup:** A required public reference retrieval is unavailable or a required response field (profile version, requested mutation type or action class, phase) is materially incomplete.
- **Action:** Apply the reference dependency fallback.
- **Expected result:** Use degraded_reference_unavailable, mark the affected claims unresolved, list the exact missing retrievals and invent no reference-backed content or provenance.
- **Validates:** `mcp_availability_and_response_completeness`
- **Status:** `proposed`
- **Execution note/evidence:** none (not executed)

### PCHK-REF-01 — Reference version drift within one run

- **Setup:** Two required retrievals in the same run expose incompatible reference-set versions.
- **Action:** Compare version basis and source identifiers and resolve the mismatch.
- **Expected result:** Do not silently combine versions; refresh consistently or mark dependent decisions unresolved or degraded.
- **Validates:** `reference_version_consistency`
- **Status:** `proposed`
- **Execution note/evidence:** none (not executed)

### PCHK-SCOPE-01 — Request outside the supported scope

- **Setup:** The request is not an identity-changing entity-resolution task, for example an unrelated field update.
- **Action:** Qualify the request against the Skill scope.
- **Expected result:** State the scope boundary and fabricate no operations, controls or reference coverage.
- **Validates:** `scope_qualification`
- **Status:** `proposed`
- **Execution note/evidence:** none (not executed)

## Recommended baseline scenario coverage

Covered: sufficient evidence (TEST-01); similarity without identity support (TEST-02); distinct registry IDs negative control (TEST-03); normalization ambiguity (TEST-04); material contradiction (TEST-05); unverified or indeterminate evidence (TEST-06, TEST-07); temporal mismatch (TEST-08); wrong canonical direction (TEST-09); resulting-state failure (TEST-10); approval missing or invalid (TEST-11, TEST-12); Path A and Path B (TEST-13 to TEST-21); write-set or atomicity unverified (TEST-22, TEST-23); stale version or policy (TEST-24); pre-commit invariant failure and abort (TEST-25, TEST-26); ambiguous commit, duplicate and retry (TEST-27 to TEST-29); post-commit failure, downstream failure and quarantine (TEST-30 to TEST-32). Rollback of a committed merge is not tested because no recovery procedure exists; TEST-32 covers that absence.
