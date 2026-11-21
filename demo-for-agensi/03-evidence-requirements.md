# Evidence Requirements

**Package run ID:** 2026-11-21T01:44:38Z

## Assessment of the supplied evidence

All sources are customer-provided descriptions; none was verified by the Planner and none is declared verified or authorization-eligible. Support below means support on the description, pending customer promotion.

| Source | Relevance | Provenance | Temporal applicability | Independence | Planner assessment |
|---|---|---|---|---|---|
| SRC-REG-001 | Direct: continuity and name-change date | Registry extract FCR-EXTRACT-004821-2026-10-15 (description only) | States change on 2024-04-01; extract dated 2026-10-15; no currency window defined | Independent of CRM systems | Candidate SUPPORT; eligibility not established |
| SRC-REG-VERIFY-005 | Authenticity of SRC-REG-001 only | Customer gateway result; validator identity and version not supplied | Applies to the same extract | Not independent of SRC-REG-001 | Validation basis, not identity evidence |
| SRC-LEGAL-002 | Partial: current name and same registry ID used on 2025-02-14 | Executed agreement MSA-NSI-2025-02 (description only) | Post-dates the name change; states no change or legacy name; linked CRM account not stated | Separate origin; registry ID stated by the parties | Limited corroborating SUPPORT |
| SRC-MIGRATION-003 | Context: how the duplicate arose | Internal migration report MIG-REPORT-2024-05-15 | 2024-05-15 | Shares origin with the crosswalk | Context only; not independent proof |
| SRC-CROSSWALK-004 | Context: both IDs map to EC-004821 | Internal mapping | Not dated | Same dependency cluster as the migration report | Context only; not independent proof |
| Similarity attributes | Names, domain, address, contacts | CRM record fields | Current | Same systems | Context only; policy says not sufficient |

Findings: (1) the registry extract is the only direct authoritative source; (2) the gateway result authenticates that same extract and does not add independent identity evidence; (3) the agreement is limited corroboration; (4) the migration report and crosswalk are one dependency cluster and must not be counted as independent identity proof; (5) no contradictory evidence was supplied, but absence of a detected conflict is not positive support; (6) the description does not restate the registration number or the old and new legal names, and the extract identifier or the EC-004821 code is not accepted as proof of the registry ID; (7) the name change (2024-04-01) precedes the creation of CRM-ACCT-2097 (2024-05-15) and the legacy record dates from 2019-06-12, which is consistent with a rename but must be confirmed against the actual extract.

## Identity propositions

| Proposition ID | Operation | Claim to be established | Scope / period | Policy owner |
|---|---|---|---|---|
| CLAIM-01 | OP-DEMO-2026-001 | CRM-ACCT-2097 and CRM-ACCT-1042 denote the same continuing legal person: the legal name changed on 2024-04-01 and the registration number and legal-person continuity are unchanged, with no dissolution, successor or new incorporation. | Must cover the name change on 2024-04-01 and continuity from creation of CRM-ACCT-1042 (2019-06-12) through the commit time; the extract is dated 2026-10-15 and no currency window is defined. | unassigned (MDM policy owner for POL-MDM-07 not identified) |
| CLAIM-02 | OP-DEMO-2026-001 | Both candidate accounts carry the exact official registry ID FIC-REG-004821, and that ID matches the authoritative registry record for the legal person in the registry extract. | Current at evaluation time and at the commit boundary. | unassigned (MDM policy owner for POL-MDM-07 not identified) |
| CLAIM-03 | OP-DEMO-2026-001 | The name-change continuity claim applies to the relevant referent and validity interval: the change took effect on 2024-04-01, before the source record was created on 2024-05-15, and continuity still holds at the time of commit. | Interval from 2019-06-12 (creation of CRM-ACCT-1042) through the commit time, including 2024-04-01 and 2024-05-15. | unassigned (MDM policy owner for POL-MDM-07 not identified) |
| CLAIM-04 | OP-DEMO-2026-001 | Evidence items count as independent corroboration only when they do not share an upstream origin; the migration report and the crosswalk form one dependency cluster and are not independent identity proof. | Origin and creation dates of the migration report (2024-05-15) and the crosswalk. | unassigned (MDM policy owner for POL-MDM-07 not identified) |
| CLAIM-05 | OP-DEMO-2026-001 | Two related companies with different official registry IDs are not the same legal person and must not be merged merely because names, domain, address or contacts are similar (negative control). | Current at evaluation time. | unassigned (MDM policy owner for POL-MDM-07 not identified) |
| CLAIM-06 | OP-DEMO-2026-001 | An authorization path for the protected merge may be established only through Path A (A1, A2 and A3 demonstrating recovery for the complete production effect scope) or, when Path A is not established, Path B (explicit customer acceptance of the exact operation's non-recovery risk with operation-specific authorized approval and separation of duties); Path B does not demonstrate recoverability. | Current at authorization and at the commit boundary; expires on relevant version or scope drift. | unassigned (customer to designate A3 attester and Path B approver) |
| CLAIM-07 | OP-DEMO-2026-001 | Two separate human approvals (Data Steward and CRM Platform Owner) exist and are bound to the exact operation and state before the commit boundary. | Valid only while the bound versions and evidence remain current. | unassigned (customer to designate approvers) |
| CLAIM-08 | OP-DEMO-2026-001 | The complete persistent write set and the single atomic transaction boundary are established before the first write, and the realized operation will equal the authorized effect scope. | Current at the commit boundary. | CRM Platform Owner (inventory sign-off role; owner assignment unconfirmed) |

## Evidence requirements

Every proposition maps to JSON `proposition_id`, `operation_id`, `claim_kind` and `provenance_refs`; the Sources line matches that array exactly.

### CLAIM-01

- **Operation:** OP-DEMO-2026-001
- **Claim kind:** identity_proposition
- **Claim:** CRM-ACCT-2097 and CRM-ACCT-1042 denote the same continuing legal person: the legal name changed on 2024-04-01 and the registration number and legal-person continuity are unchanged, with no dissolution, successor or new incorporation.
- **Evidence categories required:** Authoritative registry evidence of the registration and of continuity across the name change; Authentication of that registry evidence by a customer-designated validator; Independent corroboration where customer policy requires it
- **Acceptable source characteristics:** Issued by the authoritative registry and identifying the registration number; Authenticated with recorded validator identity and version; Independent of the CRM systems and of the migration that created the duplicate; Directly stating continuity, not inferred from similarity
- **Temporal applicability:** Must cover the name change on 2024-04-01 and continuity from creation of CRM-ACCT-1042 (2019-06-12) through the commit time; the extract is dated 2026-10-15 and no currency window is defined.
- **Validation method:** Customer-defined: authoritative registry lookup or authenticated extract, with a promotion record naming the policy and validator version. Not performed by the Planner.
- **Contradictory evidence:** Any evidence of dissolution, successor entity, different registration number or new incorporation is a contradiction that blocks the merge and goes to Data Steward adjudication.
- **Unverified evidence treatment:** Keep unverified or quarantined items distinct from authorization-eligible evidence; do not treat them as support.
- **Promotion / eligibility authority:** unassigned (MDM policy owner for POL-MDM-07 not identified)
- **Open questions:** The description of the extract does not restate the registration number or the old and new legal names; Evidence currency window not defined; Whether one authoritative source suffices or corroboration is required is not stated; Promotion eligibility has not been decided by the customer
- **Sources:** SRC-POLICY-MDM-07, SRC-REG-001, SRC-REG-VERIFY-005, SRC-LEGAL-002, SRC-MCP-PROFILE, SRC-MCP-EVID

### CLAIM-02

- **Operation:** OP-DEMO-2026-001
- **Claim kind:** candidate_qualification
- **Claim:** Both candidate accounts carry the exact official registry ID FIC-REG-004821, and that ID matches the authoritative registry record for the legal person in the registry extract.
- **Evidence categories required:** Registry ID attribute on each candidate record; Authoritative registry record showing the same registration number
- **Acceptable source characteristics:** Registry ID read from the authoritative registry, not only copied between CRM records; Exact match, not fuzzy or partial
- **Temporal applicability:** Current at evaluation time and at the commit boundary.
- **Validation method:** Customer-defined authoritative lookup; shared values across the two CRM records are not by themselves proof.
- **Contradictory evidence:** A mismatch or a different registry ID for either candidate blocks the merge (negative control).
- **Unverified evidence treatment:** A registry ID appearing only in CRM fields is a candidate attribute, not verified identity evidence.
- **Promotion / eligibility authority:** unassigned (MDM policy owner for POL-MDM-07 not identified)
- **Open questions:** The registry extract description does not state the registration number; the extract identifier containing 004821 and the enterprise-entity code EC-004821 are not accepted as proof of the registry ID
- **Sources:** SRC-CAND-RECORDS, SRC-REG-001, SRC-POLICY-MDM-07

### CLAIM-03

- **Operation:** OP-DEMO-2026-001
- **Claim kind:** temporal_applicability
- **Claim:** The name-change continuity claim applies to the relevant referent and validity interval: the change took effect on 2024-04-01, before the source record was created on 2024-05-15, and continuity still holds at the time of commit.
- **Evidence categories required:** Registry statement of the effective date of the name change; Evidence currency relative to the commit time; Link between each CRM record's creation date and the pre-change or post-change name
- **Acceptable source characteristics:** States an effective date; Dated, with a customer-defined currency window
- **Temporal applicability:** Interval from 2019-06-12 (creation of CRM-ACCT-1042) through the commit time, including 2024-04-01 and 2024-05-15.
- **Validation method:** Customer-defined comparison of the extract date and effective date with policy; recheck at the commit boundary.
- **Contradictory evidence:** Defer if temporal applicability or legal continuity is unresolved.
- **Unverified evidence treatment:** Stale or undated evidence is not authorization-eligible.
- **Promotion / eligibility authority:** unassigned (MDM policy owner for POL-MDM-07 not identified)
- **Open questions:** No evidence currency window; No statement that the legal agreement of 2025-02-14 is linked to either CRM account
- **Sources:** SRC-REG-001, SRC-MIGRATION-003, SRC-LEGAL-002, SRC-CAND-RECORDS, SRC-MCP-PROFILE

### CLAIM-04

- **Operation:** OP-DEMO-2026-001
- **Claim kind:** other
- **Claim:** Evidence items count as independent corroboration only when they do not share an upstream origin; the migration report and the crosswalk form one dependency cluster and are not independent identity proof.
- **Evidence categories required:** Dependency map of evidence origins; Recorded provenance of each mapping
- **Acceptable source characteristics:** Separate origin from the CRM migration; Not produced or induced by the merge hypothesis
- **Temporal applicability:** Origin and creation dates of the migration report (2024-05-15) and the crosswalk.
- **Validation method:** Customer-defined dependency analysis recorded with the promotion decision.
- **Contradictory evidence:** Do not promote a mapping solely because the planner hypothesis induced the retrieval or the mapping.
- **Unverified evidence treatment:** Keep both items as context in the active set; neither counts as independent support.
- **Promotion / eligibility authority:** unassigned (MDM policy owner for POL-MDM-07 not identified)
- **Open questions:** The derivation of the crosswalk from the migration report is not described
- **Sources:** SRC-MIGRATION-003, SRC-CROSSWALK-004, SRC-MCP-EVID

### CLAIM-05

- **Operation:** OP-DEMO-2026-001
- **Claim kind:** candidate_qualification
- **Claim:** Two related companies with different official registry IDs are not the same legal person and must not be merged merely because names, domain, address or contacts are similar (negative control).
- **Evidence categories required:** Official registry ID of each company from the authoritative registry
- **Acceptable source characteristics:** Authoritative, exact registry IDs
- **Temporal applicability:** Current at evaluation time.
- **Validation method:** Exact registry-ID comparison before any similarity is considered.
- **Contradictory evidence:** Different registry IDs block the merge; the policy defines no exception route, so exceptions are a customer policy decision.
- **Unverified evidence treatment:** Similarity evidence is context only and is never promoted as identity support.
- **Promotion / eligibility authority:** unassigned (MDM policy owner for POL-MDM-07 not identified)
- **Open questions:** Exception process, if any, is undefined
- **Sources:** SRC-POLICY-MDM-07, SRC-MCP-PROFILE

### CLAIM-06

- **Operation:** OP-DEMO-2026-001
- **Claim kind:** authorization_path_eligibility
- **Claim:** An authorization path for the protected merge may be established only through Path A (A1, A2 and A3 demonstrating recovery for the complete production effect scope) or, when Path A is not established, Path B (explicit customer acceptance of the exact operation's non-recovery risk with operation-specific authorized approval and separation of duties); Path B does not demonstrate recoverability.
- **Evidence categories required:** A1 mechanism, A2 test records and A3 attestation for Path A; Current policy, operation-specific approval and separation-of-duties rule for Path B
- **Acceptable source characteristics:** Operation-specific and scope-complete; Current relevant versions; Customer-designated roles
- **Temporal applicability:** Current at authorization and at the commit boundary; expires on relevant version or scope drift.
- **Validation method:** Customer-defined attestation and approval records; none supplied.
- **Contradictory evidence:** Both paths claimed for the same scope, or stale evidence: HOLD.
- **Unverified evidence treatment:** Absence of recovery evidence leaves factual reversibility unknown; it does not prove irreversibility.
- **Promotion / eligibility authority:** unassigned (customer to designate A3 attester and Path B approver)
- **Open questions:** No A1, A2 or A3 evidence supplied; No Path B policy, approver or separation-of-duties rule supplied; Path A and Path B are Skill-level planning constraints; the reference contract retrieved here defines the protected authorization phases, not these paths
- **Sources:** SRC-MCP-PH1, SRC-MCP-PH2, SRC-POLICY-MDM-07, SRC-APP-CONTEXT

### CLAIM-07

- **Operation:** OP-DEMO-2026-001
- **Claim kind:** other
- **Claim:** Two separate human approvals (Data Steward and CRM Platform Owner) exist and are bound to the exact operation and state before the commit boundary.
- **Evidence categories required:** Approval records from both roles; Binding fields: operation, idempotency key, row versions, policy and validator versions, evidence record IDs
- **Acceptable source characteristics:** Human principals authorized for the role; Issued after the evidence gate and bound to current versions
- **Temporal applicability:** Valid only while the bound versions and evidence remain current.
- **Validation method:** Customer approval service and commit-boundary guard.
- **Contradictory evidence:** Changed binding or conflicting reviewer finding: HOLD.
- **Unverified evidence treatment:** No approval artifacts were supplied; none is assumed.
- **Promotion / eligibility authority:** unassigned (customer to designate approvers)
- **Open questions:** No approval artifacts supplied; Whether one person may hold both roles is not stated; Approval expiry not stated
- **Sources:** SRC-POLICY-MDM-07, SRC-MCP-PH1

### CLAIM-08

- **Operation:** OP-DEMO-2026-001
- **Claim kind:** other
- **Claim:** The complete persistent write set and the single atomic transaction boundary are established before the first write, and the realized operation will equal the authorized effect scope.
- **Evidence categories required:** Verified write-set inventory; Evidence identifying the transaction, its scope and the exact commit point; Inventory of asynchronous and external effects
- **Acceptable source characteristics:** Customer-verified, not only declared; Specific to this operation
- **Temporal applicability:** Current at the commit boundary.
- **Validation method:** Customer verification of schema, foreign-key actions, triggers and coordinator behaviour; database-specific design review.
- **Contradictory evidence:** Any undeclared effect or second commit: HOLD.
- **Unverified evidence treatment:** Declared architecture is a requirement, not verified fact.
- **Promotion / eligibility authority:** CRM Platform Owner (inventory sign-off role; owner assignment unconfirmed)
- **Open questions:** Seven tables declared; dependent tables, history and name-preservation stores, source-record disposition and triggers are not described; Transaction membership and commit point are not evidenced
- **Sources:** SRC-APP-CONTEXT, SRC-POLICY-MDM-07, SRC-MCP-PH2

## Authorization-path claim semantics (CLAIM-06)

The combined claim is only that an authorization path may be established; it does not say the merge is recoverable through either path.

| Path | What it establishes | Effect on factual reversibility |
|---|---|---|
| Path A | Recoverability for the exact operation and complete effect scope, only with A1 + A2 + A3 | reversible only after A1/A2/A3 are established; action class remains IRREVERSIBLE_WRITE |
| Path B | Explicit customer acceptance of the exact operation's non-recovery risk, with operation-specific authority and separation of duties | Does not establish reversible or not_reversible; retain unknown; action class remains IRREVERSIBLE_WRITE |

## Conflict handling

| Condition | Recommended customer-side response | Decision owner |
|---|---|---|
| Sufficient support under policy and no material unresolved conflict | Continue to the other required controls (not an authorization) | Data Steward |
| Material contradiction | Block the merge; adjudicate | Data Steward |
| Insufficient support | Do not persist the identity change; HOLD | Data Steward |
| Indeterminate or unverified evidence | Keep quarantined; do not treat as clear | Data Steward |
| Stale or temporally inapplicable evidence | Refresh or defer | Data Steward |

Do not treat absence of a detected conflict as positive proof of identity. Negative control (CLAIM-05): two related companies with different official registry IDs must not be merged because names, domain, address or contacts are similar.
