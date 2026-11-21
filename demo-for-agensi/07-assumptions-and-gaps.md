# Assumptions and Gaps

**Package run ID:** 2026-11-21T01:44:38Z

## Blocking decisions

| ID | Decision / gap | Why it matters | Owner | Needed before implementation? |
|---|---|---|---|---|
| GAP-01 | No approval artifacts were supplied. Who are the authorized Data Steward and CRM Platform Owner, what binding format and expiry apply, and may one person hold both roles? | No commit authorization is possible without both separate, bound human approvals. | Customer MDM policy owner | Yes |
| GAP-02 | Who or what designates the registry extract and the supplied gateway result as authorization-eligible; which validator and version; what evidence currency window applies; is one authoritative source sufficient; and does the actual extract state the registration number and the old and new legal names? | Evidence supports the proposition on its description only; it is not authorization-eligible until promoted under a defined policy. | Customer MDM policy owner and Data Steward | Yes |
| GAP-03 | What is the complete persistent write set? Confirm dependent tables, foreign-key actions and triggers, where historical legal names and provenance are stored, the disposition of the source record, contact-link duplicate handling, uniqueness constraints and where historical activity keeps original account IDs. | Write-set completeness is unverified; HOLD applies before the first persistent write. | CRM Platform Owner | Yes |
| GAP-04 | What evidence shows that all database writes and the outbox insertion run in one PostgreSQL transaction with an identified commit point, that pre-commit validator 1.6 can evaluate invariants in the same snapshot before COMMIT, and that SERIALIZABLE is adequate for the link-set anomalies? | Atomicity is unverified; no reliance on rollback is permitted. | CRM Platform Owner and database engineering | Yes |
| GAP-05 | Is Path A (A1, A2, A3) established for this operation, or will the customer accept non-recovery risk under Path B? Who attests A3, who may approve Path B, and must the Path B approver be independent of the ordinary approvers? | Factual reversibility is unknown; HOLD applies until exactly one path is established. | Customer risk owner | Yes |
| GAP-06 | How are row versions 18 and 23, policy v3.2, validator 1.6 and schema CRM-IDENTITY-5 bound to the authorization and rechecked at the commit boundary, and what is the retry budget? | Without an enforced binding a stale authorization could commit. | CRM Platform Owner | Yes |
| GAP-07 | Are the search-index, Billing read-model and ERP-crosswalk consumers idempotent and ordered, who owns reconciliation and recovery, and does any documented and tested compensation exist for this operation? | Effects outside the database transaction cannot be rolled back with it; without a tested procedure the response is quarantine and escalation. | CRM Platform Owner and downstream system owners | Yes |
| GAP-08 | Where is idempotency key demo-merge-1042-2097-v1 persisted and enforced, and what authoritative read-after-failure query reconciles an ambiguous commit? | Without it a retry could repeat or conflict with a committed merge. | CRM Platform Owner | Yes |
| GAP-09 | Do active contracts held under the legacy legal name need legal notice or amendment after the current legal name is adopted? | Outside this identity-guardrail plan; legal or commercial handling by the customer. | Customer legal counsel | No |
| GAP-10 | What audit-event and outbox-event schemas, versions and retention periods apply? | Needed for audit completeness and consumer compatibility; does not change the HOLD logic. | CRM Platform Owner | No |

## Assumptions

| ID | Assumption | Basis | Impact if false | How to verify |
|---|---|---|---|---|
| ASM-01 | The evidence descriptions (registry extract, gateway result, agreement, migration report, crosswalk) accurately describe the underlying documents. | Customer-supplied task input; the Planner saw no source document. | If a description is inaccurate the support assessment may change or reverse. | Data Steward reviews the original documents, not the descriptions. |
| ASM-02 | The architecture and write set (seven tables, one SERIALIZABLE transaction including outbox insertion, asynchronous consumers) are customer-declared requirements and are not verified implementation facts. | Instruction in the task input. | If the implementation differs, atomicity and write-set completeness fail and HOLD applies. | Customer verifies schema, coordinator behaviour and consumers (GAP-03, GAP-04). |
| ASM-03 | The customer's premise that both CRM records may represent one legal person is a hypothesis to be tested, not a conclusion. | Customer-supplied proposition. | Treating it as established would bypass the evidence gate. | Evidence gate in CTRL-02 to CTRL-04. |
| ASM-04 | The full text of POL-MDM-07 v3.2 matches the summary supplied; no exception route, evidence currency window or approver identities are defined. | Task input summarizes the policy; the document was not supplied. | A different policy may change evidence sufficiency or approval rules. | Policy owner confirms the summary and answers GAP-01 and GAP-02. |
| ASM-05 | Source row version 23 and canonical row version 18 are the current versions at the time of the request and are re-read at authorization and at the commit boundary. | Customer-supplied current row versions. | Stale versions invalidate authorization. | CTRL-06 and TEST-VER-01. |
| ASM-06 | The enterprise-entity code EC-004821 and the registry ID FIC-REG-004821 are different identifiers; similarity of their digits is not treated as proof of equivalence. | Different prefixes and sources in the task input. | Treating them as equivalent could count an internal mapping as registry proof. | Registry lookup in CLAIM-02. |
| ASM-07 | All case data are synthetic; this is a planning exercise with no production access, database write, deployment or real authorization. | Task input. | None for a synthetic case; a real run would need production-safe handling. | Not applicable. |
| ASM-08 | Operation ID OP-DEMO-2026-001 and idempotency key demo-merge-1042-2097-v1 are intended for this exact operation only. | Customer-supplied identifiers. | Reuse for a different operation would defeat idempotency and binding. | CTRL-01, CTRL-11, TEST-IDEM-01. |
| ASM-09 | Arguments sent to the public reference service in this run contained only abstract labels (action class, mutation type, entity class, observation domain, temporal scope, include flags). | The submitted arguments were inspected in this run. | A leak would be a privacy breach of customer information. | Review the recorded call arguments listed in the README. |

## Missing evidence or sources

Original registry extract, gateway verification record and validator identity, the executed agreement and its linkage to a CRM account, the full policy text, any evidence currency window, approver identities and approvals, recovery evidence (A1, A2, A3) or a Path B policy, and a verified write-set inventory.

## Missing implementation details

Transaction boundary and commit point; where historical names and provenance are stored; source-record disposition; dependent tables, foreign-key actions and triggers; contact-link duplicate rule; version-binding enforcement; idempotency-key persistence; outbox schema and consumer idempotency; reconciliation and recovery ownership.

## Out-of-scope matters

Legal effects of the name change on contracts (GAP-09), any later unmerge or publication operation, general database security, and verification of the underlying documents.

## Degraded-mode limitations

The run is reference-backed; no degraded mode applies. Not retrieved and not relied on: application-mapping and policy-as-code sections. Limitations of validation: no Draft 2020-12 engine, format checker or JCS implementation, so schema, format and sidecar-dependent checks were not run. All templates mapped by the output contract were available and used.

## Production-readiness conditions

Close GAP-01 to GAP-08; obtain and review original evidence; implement and verify the controls; execute the proposed tests; obtain both bound approvals and a Path A or Path B record; complete database-specific design review; run an operational review. None of this has been done, and this plan authorizes nothing.

## Limitations

- Design-time plan only: no controls were deployed, no runtime authorization was performed, no database was accessed and no customer data was changed.
- All evidence is customer-supplied description; the Planner verified nothing and declares no evidence verified or authorization-eligible.
- The architecture, write set and policy are customer-declared requirements, not verified implementation facts; write-set completeness and atomicity are unverified.
- No approval artifacts exist and none is assumed; the operation is not authorized to commit.
- Reference material returned by the public service is a non-executable reference; constraint examples are illustrative and mappings are non-normative; the service does not assess evidence or issue verdicts.
- Path A and Path B are Skill-level planning constraints, not text of the retrieved reference contract.
- No Draft 2020-12 JSON Schema engine, format checker or RFC 8785 implementation was available: schema validation, format validation and negative controls, and sidecar checks that depend on them were not run; the package is not fully validated.
- Customer runtime tests, external-client compatibility and ZIP integrity were not run; all proposed validation tests and planner checks remain proposed.
- Nothing here is legal advice or a legal-entity determination.
