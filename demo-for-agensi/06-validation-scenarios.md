# Validation Scenarios

**Package run ID:** 2026-11-21T01:44:38Z

All customer-operation scenarios are proposed tests; none was executed. Positive fixtures are labelled hypothetical and are not customer evidence, policy, approval or attestation. Planner-level scenarios are in the separate register below.

| Test ID | Operation IDs | Scenario | Setup | Action | Expected result | Requirement validated | Status |
|---|---|---|---|---|---|---|---|
| TEST-EVID-01 | OP-DEMO-2026-001 | Sufficient support under policy (hypothetical positive) | HYPOTHETICAL fixture, not customer evidence or policy. Both candidates carry the same official registry ID confirmed against the authoritative registry; an authenticated, currently applicable registry extract states a legal-name change on 2024-04-01 with unchanged registration number and continuity and no dissolution, successor or new incorporation; the validator, policy version and promotion record are recorded; no conflicting evidence exists in eligible, active or quarantined sets. | Submit the proposed MERGE OP-DEMO-2026-001 to the evidence gate (registry-ID and continuity gate, evidence eligibility and conflict check). | The gate records support with a clear conflict status and per-proposition evidence record IDs. The result does not authorize the operation: approvals, version binding, write-set and atomicity proof, and the authorization-path gate all still apply. | CTRL-02, CTRL-03, CTRL-04 | proposed |
| TEST-EVID-02 | OP-DEMO-2026-001 | Negative control: related companies with different official registry IDs | HYPOTHETICAL fixture, not customer evidence or policy. A synthetic pair of related companies (for example parent and subsidiary) with similar names, the same domain, the same address and overlapping contacts, but different official registry IDs, each confirmed by the authoritative registry. | Propose a MERGE of the synthetic pair through the same gate that evaluates OP-DEMO-2026-001. | The exact registry-ID requirement fails. Name, domain, address and contact similarity is recorded as context only. No merge authorization can be produced and the request is held with no write started. Any exception request is routed to a customer policy decision because the supplied policy defines no exception route. | CTRL-02 | proposed |
| TEST-EVID-03 | OP-DEMO-2026-001 | Same registry ID but no legal-continuity evidence | Both candidates carry the same registry ID; only name, domain and address similarity and internal mappings are available; no registry extract or equivalent continuity evidence is supplied. | Submit OP-DEMO-2026-001 to the evidence gate. | Required positive support is missing: HOLD, no promotion of the internal mappings as identity proof, and a request for continuity evidence. Similarity is not accepted as a substitute. | CTRL-02, CTRL-03 | proposed |
| TEST-EVID-04 | OP-DEMO-2026-001 | Non-independent corroboration (shared upstream origin) | The only corroboration for the identity claim is the migration report and the crosswalk that both map the two CRM IDs to one enterprise-entity code, plus the matching registry-ID field copied into both CRM records. | Submit OP-DEMO-2026-001 to the evidence gate with no registry-origin evidence. | The migration report and crosswalk are treated as one dependency cluster and are not counted as independent identity proof; the claim stays unsupported and the request is held. | CTRL-03 | proposed |
| TEST-EVID-05 | OP-DEMO-2026-001 | Material contradiction in registry evidence | HYPOTHETICAL fixture, not customer evidence or policy. The registry evidence shows a different registration number for one candidate, or records a dissolution, a successor entity or a new incorporation that reuses the trading name. | Submit OP-DEMO-2026-001 to the evidence gate. | A material contradiction is established: the merge is blocked, the conflict is retained for Data Steward adjudication, and no write begins. The planner cannot override or weaken the finding. | CTRL-04 | proposed |
| TEST-EVID-06 | OP-DEMO-2026-001 | Unverified or indeterminate evidence (verification absent, failed or validator unavailable) | The signature and issuer-certificate verification result for the registry extract is absent, failed, from an unidentified validator, or the evidence gateway is unavailable. | Submit OP-DEMO-2026-001 to the evidence gate. | The extract stays quarantined or unverified, is not authorization-eligible, and the request is held (fail closed). An unverified item is not treated as clear. | CTRL-03, CTRL-04 | proposed |
| TEST-EVID-07 | OP-DEMO-2026-001 | Temporal mismatch or stale registry evidence | The registry extract is older than the customer-defined currency window, or does not cover the 2024-04-01 name change and the validity interval in scope. | Submit OP-DEMO-2026-001 to the evidence gate. | Temporal applicability fails: HOLD, refresh the evidence, and re-evaluate with a new authorization record. | CTRL-03 | proposed |
| TEST-SCOPE-01 | OP-DEMO-2026-001 | Wrong operation scope, direction or canonical record | The request is altered so that it merges CRM-ACCT-1042 into CRM-ACCT-2097, adds a third account, or names a canonical record other than CRM-ACCT-1042, contrary to the retain-canonical rule. | Submit the altered request to the operation and scope binding check for OP-DEMO-2026-001. | The request is blocked; a new operation ID and fresh evaluation are required; no write begins. | CTRL-01 | proposed |
| TEST-APPR-01 | OP-DEMO-2026-001 | Only one of the two required approvals | Evidence and write-set gates are satisfied in a fixture; only the Data Steward approval exists (then repeat with only the CRM Platform Owner approval). | Request commit authorization for OP-DEMO-2026-001. | HOLD in both variants: both separate human approvals are required and neither substitutes for the other. | CTRL-05 | proposed |
| TEST-APPR-02 | OP-DEMO-2026-001 | Approvals bound to a different operation or state | HYPOTHETICAL fixture, not customer evidence or policy. Both approvals exist but are bound to a different operation ID, a different idempotency key, row versions other than 18 and 23, or a different policy version. | Request commit authorization for OP-DEMO-2026-001. | The approvals are invalid for this operation and state: HOLD and request new approvals bound to the exact operation and state. | CTRL-01, CTRL-05 | proposed |
| TEST-APPR-03 | OP-DEMO-2026-001 | Valid bound approvals (hypothetical positive) | HYPOTHETICAL fixture, not customer evidence or policy. Data Steward and CRM Platform Owner approvals are issued by principals authorized for those roles, are human, and are bound to OP-DEMO-2026-001, its idempotency key, row versions 18 and 23, the policy version and the evidence record IDs. | Request commit authorization for OP-DEMO-2026-001 after the evidence gate has passed. | The approval gate passes only. The commit still requires version binding, write-set and atomicity proof, pre-commit invariants and the authorization-path gate. | CTRL-05 | proposed |
| TEST-VER-01 | OP-DEMO-2026-001 | Stale row version between approval and commit | After approval, the canonical row version changes from 18 to 19, or the source row version from 23 to 24, before the commit boundary. | Attempt to commit OP-DEMO-2026-001 with the existing authorization. | The authorization is rejected as stale; the stale candidate is not replayed; evaluation restarts from the beginning with a new authorization record within the common retry budget. | CTRL-06 | proposed |
| TEST-VER-02 | OP-DEMO-2026-001 | Policy, validator or schema version drift | After approval, the policy version moves from POL-MDM-07 v3.2, or the pre-commit validator from 1.6, or the identity schema from CRM-IDENTITY-5. | Attempt to commit OP-DEMO-2026-001 with the existing authorization. | The authorization is stale: HOLD and re-evaluate against the current versions; no replay of the earlier decision. | CTRL-06 | proposed |
| TEST-ATOM-01 | OP-DEMO-2026-001 | Write-set completeness unverified before first write | HYPOTHETICAL fixture, not customer evidence or policy. Review finds a dependent table, foreign-key action or trigger that references either account but is outside the seven declared tables. | Request the pre-write readiness check for OP-DEMO-2026-001. | HOLD before the first persistent write; no partial sequence of writes begins; the inventory is corrected and re-reviewed before any retry. | CTRL-07 | proposed |
| TEST-ATOM-02 | OP-DEMO-2026-001 | Atomicity unverified before first write | Evidence cannot show that all database writes and the outbox insertion occur in one identified transaction with a single commit point (for example the outbox insert is issued separately, or more than one commit is used). | Request the pre-write readiness check for OP-DEMO-2026-001. | HOLD; no reliance on later rollback; the SERIALIZABLE setting is not accepted as proof of atomicity; database-specific design review is required. | CTRL-07 | proposed |
| TEST-ATOM-03 | OP-DEMO-2026-001 | Pre-commit invariant failure inside a verified atomic transaction | HYPOTHETICAL fixture, not customer evidence or policy. Atomicity is verified for the fixture. The validator then detects a violated invariant, such as an update to account_merge_history, a lost contract link, or missing historical-name preservation. | Run the pre-commit invariant validation for OP-DEMO-2026-001. | The whole transaction is aborted; none of the transaction's writes, including audit and outbox rows, are committed; the rejection is recorded outside the aborted transaction; no event is published. | CTRL-08 | proposed |
| TEST-ATOM-04 | OP-DEMO-2026-001 | Serialization failure (definite abort) under the SERIALIZABLE requirement | HYPOTHETICAL fixture, not customer evidence or policy. A concurrent transaction causes the database to report a serialization failure for the merge transaction. | Execute the fixture transaction for OP-DEMO-2026-001. | The transaction is rolled back with no partial effects; the stale candidate is not replayed; evaluation restarts from a fresh snapshot with a new authorization record within the common retry budget; when the budget is exhausted the request is held and escalated. | CTRL-06, CTRL-08 | proposed |
| TEST-POST-01 | OP-DEMO-2026-001 | Post-commit validation failure | HYPOTHETICAL fixture, not customer evidence or policy. After commit, read-after-commit validation finds a divergence from the authorized effect (for example link counts or the adopted legal name). | Run post-commit validation for OP-DEMO-2026-001. | Dependent mutations stop; actual persisted state is reconciled; only a documented, tested compensation for this exact operation may be used, otherwise affected records and events are quarantined and escalated; no claim that rollback undoes the commit. | CTRL-09, CTRL-10 | proposed |
| TEST-POST-02 | OP-DEMO-2026-001 | Consumer failure and duplicate events outside the database transaction | HYPOTHETICAL fixture, not customer evidence or policy. The ERP crosswalk consumer times out and the search-index consumer receives the same outbox event twice. | Process the outbox events for OP-DEMO-2026-001 and run downstream reconciliation. | Consumers are idempotent (no double apply); failed deliveries are retried from the outbox; reconciliation reports divergence against authoritative state; the database merge is not re-executed and the Billing read model is not reported complete until reconciled. | CTRL-09, CTRL-10 | proposed |
| TEST-AMB-01 | OP-DEMO-2026-001 | Ambiguous commit outcome | HYPOTHETICAL fixture, not customer evidence or policy. The connection is lost while the COMMIT of the merge transaction is in flight. | Handle the failure for OP-DEMO-2026-001 under key demo-merge-1042-2097-v1. | No blind retry. Authoritative state is read back using the idempotency key (account rows, merge history, audit and outbox rows). A retry occurs only after confirming the original did not commit and retry is safe; if it did commit, post-commit validation and consumer reconciliation proceed instead. | CTRL-11 | proposed |
| TEST-IDEM-01 | OP-DEMO-2026-001 | Duplicate request and idempotency key reuse | HYPOTHETICAL fixture, not customer evidence or policy. The operation already committed under key demo-merge-1042-2097-v1; the same request is submitted again, and separately a request with the same key but different content is submitted. | Submit both requests for OP-DEMO-2026-001. | The identical request returns the recorded outcome with no second merge and no duplicate outbox event; the same key with different content is rejected. | CTRL-11 | proposed |
| TEST-HIST-01 | OP-DEMO-2026-001 | Preservation invariants (history, append-only, name adoption) | HYPOTHETICAL fixture, not customer evidence or policy. A merge fixture in which historical activity rows are touched, account_merge_history is updated or deleted, the current legal name is not adopted, or historical names and provenance are dropped. | Run pre-commit invariant validation for OP-DEMO-2026-001. | Each violation is detected and aborts the transaction; in the conforming fixture, historical activity keeps its original account IDs, merge history is append-only, the current legal name is adopted, and historical names and provenance are preserved. | CTRL-08 | proposed |
| TEST-PATHA-POS | OP-DEMO-2026-001 | Path A positive (hypothetical): A1, A2 and A3 established | HYPOTHETICAL fixture, not customer evidence or policy. A1: a documented recovery or compensation mechanism for this exact MERGE operation covers the complete production effect scope, including the downstream consumer effects. A2: successful recovery tests on materially equivalent state and schema at the current PostgreSQL, policy, validator and schema versions. A3: attestation by a customer-designated responsible role confirms A1 and A2 applicability and results. The write-set inventory is complete. | Evaluate the authorization path for OP-DEMO-2026-001. | Path A eligibility and factual reversibility reversible for the proven scope only; the action class stays IRREVERSIBLE_WRITE; all other controls still apply. | CTRL-12 | proposed |
| TEST-PATHA-A1 | OP-DEMO-2026-001 | Path A negative A1: mechanism missing, wrong operation or incomplete scope | A2 and A3 exist, but the documented recovery mechanism is absent, belongs to a different operation (for example a separate unmerge procedure not independently qualified), or does not cover the complete effect scope. | Evaluate the authorization path for OP-DEMO-2026-001. | Path A is not established: HOLD; factual reversibility remains unknown. | CTRL-12 | proposed |
| TEST-PATHA-A2 | OP-DEMO-2026-001 | Path A negative A2: recovery test absent, failed, stale or not equivalent | A1 and A3 exist, but recovery tests are absent, failed, stale, or run on non-equivalent state, schema or non-current persistence, policy or validator versions. | Evaluate the authorization path for OP-DEMO-2026-001. | Path A is not established: HOLD; factual reversibility remains unknown. | CTRL-12 | proposed |
| TEST-PATHA-A3 | OP-DEMO-2026-001 | Path A negative A3: attestation absent, unauthorized or not covering A1/A2 | A1 and A2 exist, but the attestation is absent, signed by a role not designated by the customer, or does not attest A1 and A2 applicability and results. | Evaluate the authorization path for OP-DEMO-2026-001. | Path A is not established: HOLD; factual reversibility remains unknown. | CTRL-12 | proposed |
| TEST-PATHB-POS | OP-DEMO-2026-001 | Path B positive (hypothetical): explicit acceptance of non-recovery risk | HYPOTHETICAL fixture, not customer evidence or policy. Path A is not established. A current explicit customer policy accepts this exact operation's non-recovery risk; an authorized role gives operation-specific approval; the customer-defined separation of duties is satisfied. | Evaluate the authorization path for OP-DEMO-2026-001. | Path B eligibility only. The action class stays IRREVERSIBLE_WRITE and factual reversibility stays unknown; Path B does not demonstrate recoverability. All other controls still apply. | CTRL-12 | proposed |
| TEST-PATHB-POLICY | OP-DEMO-2026-001 | Path B negative policy: no current policy accepting this risk | Path A is not established and approvals exist, but no current explicit policy accepts this exact operation's non-recovery risk. | Evaluate the authorization path for OP-DEMO-2026-001. | HOLD; Path B is unavailable. | CTRL-12 | proposed |
| TEST-PATHB-AUTH | OP-DEMO-2026-001 | Path B negative approval or authority | A current policy exists, but operation-specific risk-acceptance approval is absent or given by a role the policy does not authorize; only the ordinary Data Steward and CRM Platform Owner merge approvals exist. | Evaluate the authorization path for OP-DEMO-2026-001. | HOLD; ordinary merge approval does not count as acceptance of non-recovery risk. | CTRL-12 | proposed |
| TEST-PATHB-SOD | OP-DEMO-2026-001 | Path B negative separation of duties | A current policy and an authorized approval exist, but separation of duties is undefined, unresolved or violated (for example the risk approver is the ordinary approver and the policy requires independence). | Evaluate the authorization path for OP-DEMO-2026-001. | HOLD; Path B is unavailable until separation of duties is resolved under customer policy. | CTRL-12 | proposed |
| TEST-PATH-EXCL | OP-DEMO-2026-001 | Path exclusivity after Path A is established | HYPOTHETICAL fixture, not customer evidence or policy. Path A is established for the complete effect scope of this operation. | Attempt to solicit or record non-recovery-risk acceptance (Path B) for OP-DEMO-2026-001. | Path B is unavailable for that operation and scope; no risk acceptance is solicited or recorded. If A2 or A3 later goes stale or a relevant version drifts, Path A expires, factual reversibility returns to unknown, and HOLD applies until Path A is renewed or Path B is independently established. | CTRL-12 | proposed |

## TEST-EVID-01 — Sufficient support under policy (hypothetical positive)

- **Purpose:** Sufficient support under policy (hypothetical positive)
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. Both candidates carry the same official registry ID confirmed against the authoritative registry; an authenticated, currently applicable registry extract states a legal-name change on 2024-04-01 with unchanged registration number and continuity and no dissolution, successor or new incorporation; the validator, policy version and promotion record are recorded; no conflicting evidence exists in eligible, active or quarantined sets.
- **Action:** Submit the proposed MERGE OP-DEMO-2026-001 to the evidence gate (registry-ID and continuity gate, evidence eligibility and conflict check).
- **Expected result:** The gate records support with a clear conflict status and per-proposition evidence record IDs. The result does not authorize the operation: approvals, version binding, write-set and atomicity proof, and the authorization-path gate all still apply.
- **Validates:** CTRL-02, CTRL-03, CTRL-04
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-EVID-02 — Negative control: related companies with different official registry IDs

- **Purpose:** Negative control: related companies with different official registry IDs
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. A synthetic pair of related companies (for example parent and subsidiary) with similar names, the same domain, the same address and overlapping contacts, but different official registry IDs, each confirmed by the authoritative registry.
- **Action:** Propose a MERGE of the synthetic pair through the same gate that evaluates OP-DEMO-2026-001.
- **Expected result:** The exact registry-ID requirement fails. Name, domain, address and contact similarity is recorded as context only. No merge authorization can be produced and the request is held with no write started. Any exception request is routed to a customer policy decision because the supplied policy defines no exception route.
- **Validates:** CTRL-02
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-EVID-03 — Same registry ID but no legal-continuity evidence

- **Purpose:** Same registry ID but no legal-continuity evidence
- **Setup:** Both candidates carry the same registry ID; only name, domain and address similarity and internal mappings are available; no registry extract or equivalent continuity evidence is supplied.
- **Action:** Submit OP-DEMO-2026-001 to the evidence gate.
- **Expected result:** Required positive support is missing: HOLD, no promotion of the internal mappings as identity proof, and a request for continuity evidence. Similarity is not accepted as a substitute.
- **Validates:** CTRL-02, CTRL-03
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-EVID-04 — Non-independent corroboration (shared upstream origin)

- **Purpose:** Non-independent corroboration (shared upstream origin)
- **Setup:** The only corroboration for the identity claim is the migration report and the crosswalk that both map the two CRM IDs to one enterprise-entity code, plus the matching registry-ID field copied into both CRM records.
- **Action:** Submit OP-DEMO-2026-001 to the evidence gate with no registry-origin evidence.
- **Expected result:** The migration report and crosswalk are treated as one dependency cluster and are not counted as independent identity proof; the claim stays unsupported and the request is held.
- **Validates:** CTRL-03
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-EVID-05 — Material contradiction in registry evidence

- **Purpose:** Material contradiction in registry evidence
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. The registry evidence shows a different registration number for one candidate, or records a dissolution, a successor entity or a new incorporation that reuses the trading name.
- **Action:** Submit OP-DEMO-2026-001 to the evidence gate.
- **Expected result:** A material contradiction is established: the merge is blocked, the conflict is retained for Data Steward adjudication, and no write begins. The planner cannot override or weaken the finding.
- **Validates:** CTRL-04
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-EVID-06 — Unverified or indeterminate evidence (verification absent, failed or validator unavailable)

- **Purpose:** Unverified or indeterminate evidence (verification absent, failed or validator unavailable)
- **Setup:** The signature and issuer-certificate verification result for the registry extract is absent, failed, from an unidentified validator, or the evidence gateway is unavailable.
- **Action:** Submit OP-DEMO-2026-001 to the evidence gate.
- **Expected result:** The extract stays quarantined or unverified, is not authorization-eligible, and the request is held (fail closed). An unverified item is not treated as clear.
- **Validates:** CTRL-03, CTRL-04
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-EVID-07 — Temporal mismatch or stale registry evidence

- **Purpose:** Temporal mismatch or stale registry evidence
- **Setup:** The registry extract is older than the customer-defined currency window, or does not cover the 2024-04-01 name change and the validity interval in scope.
- **Action:** Submit OP-DEMO-2026-001 to the evidence gate.
- **Expected result:** Temporal applicability fails: HOLD, refresh the evidence, and re-evaluate with a new authorization record.
- **Validates:** CTRL-03
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-SCOPE-01 — Wrong operation scope, direction or canonical record

- **Purpose:** Wrong operation scope, direction or canonical record
- **Setup:** The request is altered so that it merges CRM-ACCT-1042 into CRM-ACCT-2097, adds a third account, or names a canonical record other than CRM-ACCT-1042, contrary to the retain-canonical rule.
- **Action:** Submit the altered request to the operation and scope binding check for OP-DEMO-2026-001.
- **Expected result:** The request is blocked; a new operation ID and fresh evaluation are required; no write begins.
- **Validates:** CTRL-01
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-APPR-01 — Only one of the two required approvals

- **Purpose:** Only one of the two required approvals
- **Setup:** Evidence and write-set gates are satisfied in a fixture; only the Data Steward approval exists (then repeat with only the CRM Platform Owner approval).
- **Action:** Request commit authorization for OP-DEMO-2026-001.
- **Expected result:** HOLD in both variants: both separate human approvals are required and neither substitutes for the other.
- **Validates:** CTRL-05
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-APPR-02 — Approvals bound to a different operation or state

- **Purpose:** Approvals bound to a different operation or state
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. Both approvals exist but are bound to a different operation ID, a different idempotency key, row versions other than 18 and 23, or a different policy version.
- **Action:** Request commit authorization for OP-DEMO-2026-001.
- **Expected result:** The approvals are invalid for this operation and state: HOLD and request new approvals bound to the exact operation and state.
- **Validates:** CTRL-01, CTRL-05
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-APPR-03 — Valid bound approvals (hypothetical positive)

- **Purpose:** Valid bound approvals (hypothetical positive)
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. Data Steward and CRM Platform Owner approvals are issued by principals authorized for those roles, are human, and are bound to OP-DEMO-2026-001, its idempotency key, row versions 18 and 23, the policy version and the evidence record IDs.
- **Action:** Request commit authorization for OP-DEMO-2026-001 after the evidence gate has passed.
- **Expected result:** The approval gate passes only. The commit still requires version binding, write-set and atomicity proof, pre-commit invariants and the authorization-path gate.
- **Validates:** CTRL-05
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-VER-01 — Stale row version between approval and commit

- **Purpose:** Stale row version between approval and commit
- **Setup:** After approval, the canonical row version changes from 18 to 19, or the source row version from 23 to 24, before the commit boundary.
- **Action:** Attempt to commit OP-DEMO-2026-001 with the existing authorization.
- **Expected result:** The authorization is rejected as stale; the stale candidate is not replayed; evaluation restarts from the beginning with a new authorization record within the common retry budget.
- **Validates:** CTRL-06
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-VER-02 — Policy, validator or schema version drift

- **Purpose:** Policy, validator or schema version drift
- **Setup:** After approval, the policy version moves from POL-MDM-07 v3.2, or the pre-commit validator from 1.6, or the identity schema from CRM-IDENTITY-5.
- **Action:** Attempt to commit OP-DEMO-2026-001 with the existing authorization.
- **Expected result:** The authorization is stale: HOLD and re-evaluate against the current versions; no replay of the earlier decision.
- **Validates:** CTRL-06
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-ATOM-01 — Write-set completeness unverified before first write

- **Purpose:** Write-set completeness unverified before first write
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. Review finds a dependent table, foreign-key action or trigger that references either account but is outside the seven declared tables.
- **Action:** Request the pre-write readiness check for OP-DEMO-2026-001.
- **Expected result:** HOLD before the first persistent write; no partial sequence of writes begins; the inventory is corrected and re-reviewed before any retry.
- **Validates:** CTRL-07
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-ATOM-02 — Atomicity unverified before first write

- **Purpose:** Atomicity unverified before first write
- **Setup:** Evidence cannot show that all database writes and the outbox insertion occur in one identified transaction with a single commit point (for example the outbox insert is issued separately, or more than one commit is used).
- **Action:** Request the pre-write readiness check for OP-DEMO-2026-001.
- **Expected result:** HOLD; no reliance on later rollback; the SERIALIZABLE setting is not accepted as proof of atomicity; database-specific design review is required.
- **Validates:** CTRL-07
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-ATOM-03 — Pre-commit invariant failure inside a verified atomic transaction

- **Purpose:** Pre-commit invariant failure inside a verified atomic transaction
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. Atomicity is verified for the fixture. The validator then detects a violated invariant, such as an update to account_merge_history, a lost contract link, or missing historical-name preservation.
- **Action:** Run the pre-commit invariant validation for OP-DEMO-2026-001.
- **Expected result:** The whole transaction is aborted; none of the transaction's writes, including audit and outbox rows, are committed; the rejection is recorded outside the aborted transaction; no event is published.
- **Validates:** CTRL-08
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-ATOM-04 — Serialization failure (definite abort) under the SERIALIZABLE requirement

- **Purpose:** Serialization failure (definite abort) under the SERIALIZABLE requirement
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. A concurrent transaction causes the database to report a serialization failure for the merge transaction.
- **Action:** Execute the fixture transaction for OP-DEMO-2026-001.
- **Expected result:** The transaction is rolled back with no partial effects; the stale candidate is not replayed; evaluation restarts from a fresh snapshot with a new authorization record within the common retry budget; when the budget is exhausted the request is held and escalated.
- **Validates:** CTRL-06, CTRL-08
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-POST-01 — Post-commit validation failure

- **Purpose:** Post-commit validation failure
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. After commit, read-after-commit validation finds a divergence from the authorized effect (for example link counts or the adopted legal name).
- **Action:** Run post-commit validation for OP-DEMO-2026-001.
- **Expected result:** Dependent mutations stop; actual persisted state is reconciled; only a documented, tested compensation for this exact operation may be used, otherwise affected records and events are quarantined and escalated; no claim that rollback undoes the commit.
- **Validates:** CTRL-09, CTRL-10
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-POST-02 — Consumer failure and duplicate events outside the database transaction

- **Purpose:** Consumer failure and duplicate events outside the database transaction
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. The ERP crosswalk consumer times out and the search-index consumer receives the same outbox event twice.
- **Action:** Process the outbox events for OP-DEMO-2026-001 and run downstream reconciliation.
- **Expected result:** Consumers are idempotent (no double apply); failed deliveries are retried from the outbox; reconciliation reports divergence against authoritative state; the database merge is not re-executed and the Billing read model is not reported complete until reconciled.
- **Validates:** CTRL-09, CTRL-10
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-AMB-01 — Ambiguous commit outcome

- **Purpose:** Ambiguous commit outcome
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. The connection is lost while the COMMIT of the merge transaction is in flight.
- **Action:** Handle the failure for OP-DEMO-2026-001 under key demo-merge-1042-2097-v1.
- **Expected result:** No blind retry. Authoritative state is read back using the idempotency key (account rows, merge history, audit and outbox rows). A retry occurs only after confirming the original did not commit and retry is safe; if it did commit, post-commit validation and consumer reconciliation proceed instead.
- **Validates:** CTRL-11
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-IDEM-01 — Duplicate request and idempotency key reuse

- **Purpose:** Duplicate request and idempotency key reuse
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. The operation already committed under key demo-merge-1042-2097-v1; the same request is submitted again, and separately a request with the same key but different content is submitted.
- **Action:** Submit both requests for OP-DEMO-2026-001.
- **Expected result:** The identical request returns the recorded outcome with no second merge and no duplicate outbox event; the same key with different content is rejected.
- **Validates:** CTRL-11
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-HIST-01 — Preservation invariants (history, append-only, name adoption)

- **Purpose:** Preservation invariants (history, append-only, name adoption)
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. A merge fixture in which historical activity rows are touched, account_merge_history is updated or deleted, the current legal name is not adopted, or historical names and provenance are dropped.
- **Action:** Run pre-commit invariant validation for OP-DEMO-2026-001.
- **Expected result:** Each violation is detected and aborts the transaction; in the conforming fixture, historical activity keeps its original account IDs, merge history is append-only, the current legal name is adopted, and historical names and provenance are preserved.
- **Validates:** CTRL-08
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-PATHA-POS — Path A positive (hypothetical): A1, A2 and A3 established

- **Purpose:** Path A positive (hypothetical): A1, A2 and A3 established
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. A1: a documented recovery or compensation mechanism for this exact MERGE operation covers the complete production effect scope, including the downstream consumer effects. A2: successful recovery tests on materially equivalent state and schema at the current PostgreSQL, policy, validator and schema versions. A3: attestation by a customer-designated responsible role confirms A1 and A2 applicability and results. The write-set inventory is complete.
- **Action:** Evaluate the authorization path for OP-DEMO-2026-001.
- **Expected result:** Path A eligibility and factual reversibility reversible for the proven scope only; the action class stays IRREVERSIBLE_WRITE; all other controls still apply.
- **Validates:** CTRL-12
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-PATHA-A1 — Path A negative A1: mechanism missing, wrong operation or incomplete scope

- **Purpose:** Path A negative A1: mechanism missing, wrong operation or incomplete scope
- **Setup:** A2 and A3 exist, but the documented recovery mechanism is absent, belongs to a different operation (for example a separate unmerge procedure not independently qualified), or does not cover the complete effect scope.
- **Action:** Evaluate the authorization path for OP-DEMO-2026-001.
- **Expected result:** Path A is not established: HOLD; factual reversibility remains unknown.
- **Validates:** CTRL-12
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-PATHA-A2 — Path A negative A2: recovery test absent, failed, stale or not equivalent

- **Purpose:** Path A negative A2: recovery test absent, failed, stale or not equivalent
- **Setup:** A1 and A3 exist, but recovery tests are absent, failed, stale, or run on non-equivalent state, schema or non-current persistence, policy or validator versions.
- **Action:** Evaluate the authorization path for OP-DEMO-2026-001.
- **Expected result:** Path A is not established: HOLD; factual reversibility remains unknown.
- **Validates:** CTRL-12
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-PATHA-A3 — Path A negative A3: attestation absent, unauthorized or not covering A1/A2

- **Purpose:** Path A negative A3: attestation absent, unauthorized or not covering A1/A2
- **Setup:** A1 and A2 exist, but the attestation is absent, signed by a role not designated by the customer, or does not attest A1 and A2 applicability and results.
- **Action:** Evaluate the authorization path for OP-DEMO-2026-001.
- **Expected result:** Path A is not established: HOLD; factual reversibility remains unknown.
- **Validates:** CTRL-12
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-PATHB-POS — Path B positive (hypothetical): explicit acceptance of non-recovery risk

- **Purpose:** Path B positive (hypothetical): explicit acceptance of non-recovery risk
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. Path A is not established. A current explicit customer policy accepts this exact operation's non-recovery risk; an authorized role gives operation-specific approval; the customer-defined separation of duties is satisfied.
- **Action:** Evaluate the authorization path for OP-DEMO-2026-001.
- **Expected result:** Path B eligibility only. The action class stays IRREVERSIBLE_WRITE and factual reversibility stays unknown; Path B does not demonstrate recoverability. All other controls still apply.
- **Validates:** CTRL-12
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-PATHB-POLICY — Path B negative policy: no current policy accepting this risk

- **Purpose:** Path B negative policy: no current policy accepting this risk
- **Setup:** Path A is not established and approvals exist, but no current explicit policy accepts this exact operation's non-recovery risk.
- **Action:** Evaluate the authorization path for OP-DEMO-2026-001.
- **Expected result:** HOLD; Path B is unavailable.
- **Validates:** CTRL-12
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-PATHB-AUTH — Path B negative approval or authority

- **Purpose:** Path B negative approval or authority
- **Setup:** A current policy exists, but operation-specific risk-acceptance approval is absent or given by a role the policy does not authorize; only the ordinary Data Steward and CRM Platform Owner merge approvals exist.
- **Action:** Evaluate the authorization path for OP-DEMO-2026-001.
- **Expected result:** HOLD; ordinary merge approval does not count as acceptance of non-recovery risk.
- **Validates:** CTRL-12
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-PATHB-SOD — Path B negative separation of duties

- **Purpose:** Path B negative separation of duties
- **Setup:** A current policy and an authorized approval exist, but separation of duties is undefined, unresolved or violated (for example the risk approver is the ordinary approver and the policy requires independence).
- **Action:** Evaluate the authorization path for OP-DEMO-2026-001.
- **Expected result:** HOLD; Path B is unavailable until separation of duties is resolved under customer policy.
- **Validates:** CTRL-12
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## TEST-PATH-EXCL — Path exclusivity after Path A is established

- **Purpose:** Path exclusivity after Path A is established
- **Setup:** HYPOTHETICAL fixture, not customer evidence or policy. Path A is established for the complete effect scope of this operation.
- **Action:** Attempt to solicit or record non-recovery-risk acceptance (Path B) for OP-DEMO-2026-001.
- **Expected result:** Path B is unavailable for that operation and scope; no risk acceptance is solicited or recorded. If A2 or A3 later goes stale or a relevant version drifts, Path A expires, factual reversibility returns to unknown, and HOLD applies until Path A is renewed or Path B is independently established.
- **Validates:** CTRL-12
- **Operation IDs:** OP-DEMO-2026-001
- **Status:** `proposed`

## Operation-ID scope consistency

The `operation_ids` array is an exact test boundary. Every test names OP-DEMO-2026-001 only, because it is the only operation in this plan; no test names or exercises any other operation.

## Mandatory authorization-path coverage for protected writes

OP-DEMO-2026-001 is IRREVERSIBLE_WRITE with factual reversibility unknown, so nine operation-specific tests are present: TEST-PATHA-POS, TEST-PATHA-A1, TEST-PATHA-A2, TEST-PATHA-A3, TEST-PATHB-POS, TEST-PATHB-POLICY, TEST-PATHB-AUTH, TEST-PATHB-SOD and TEST-PATH-EXCL. Path B is not used for any non-protected class (none exists in this plan). The negative control for different registry IDs is TEST-EVID-02.

## Planner-level checks (JSON `planner_checks`; not customer-operation tests)

| Planner check ID | Scenario | validates | Setup | Action | Expected result | Status |
|---|---|---|---|---|---|---|
| PCHK-MCP-01 | Public reference MCP unavailable or materially incomplete | `mcp_availability_and_response_completeness` | A required public MCP retrieval is unavailable or a required response field is materially incomplete. | Apply the reference dependency fallback. | Use degraded_reference_unavailable; mark affected claims unresolved; invent no reference-backed content or provenance. | proposed |
| PCHK-REF-01 | Reference version drift within one run | `reference_version_consistency` | Two or more required retrievals in the same run expose incompatible reference-set versions. | Compare the version basis of each source and resolve the mismatch. | Do not silently combine versions; refresh consistently or mark dependent decisions unresolved or degraded. | proposed |
| PCHK-SCOPE-01 | Request outside the supported scope | `scope_qualification` | The request is not an identity-changing entity-resolution operation (for example an ordinary field update). | Qualify the request against the Skill's scope. | State the scope boundary; fabricate no operations, controls or reference coverage. | proposed |

### PCHK-MCP-01 — Public reference MCP unavailable or materially incomplete

- **Setup:** A required public MCP retrieval is unavailable or a required response field is materially incomplete.
- **Action:** Apply the reference dependency fallback.
- **Expected result:** Use degraded_reference_unavailable; mark affected claims unresolved; invent no reference-backed content or provenance.
- **Validates:** `mcp_availability_and_response_completeness`
- **Status:** `proposed`

### PCHK-REF-01 — Reference version drift within one run

- **Setup:** Two or more required retrievals in the same run expose incompatible reference-set versions.
- **Action:** Compare the version basis of each source and resolve the mismatch.
- **Expected result:** Do not silently combine versions; refresh consistently or mark dependent decisions unresolved or degraded.
- **Validates:** `reference_version_consistency`
- **Status:** `proposed`

### PCHK-SCOPE-01 — Request outside the supported scope

- **Setup:** The request is not an identity-changing entity-resolution operation (for example an ordinary field update).
- **Action:** Qualify the request against the Skill's scope.
- **Expected result:** State the scope boundary; fabricate no operations, controls or reference coverage.
- **Validates:** `scope_qualification`
- **Status:** `proposed`

