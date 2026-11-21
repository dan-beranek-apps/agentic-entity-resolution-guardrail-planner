# Evidence Requirements

**Package run ID:** 2026-11-21T01:15:46Z

## Identity propositions

| Proposition ID | Operation | Claim to be established | Scope / period | Policy owner |
|---|---|---|---|---|
| CLAIM-01 | OP-DEMO-2026-001 | CRM-ACCT-1042 and CRM-ACCT-2097 denote the same legal person identified by official registry ID FIC-REG-004821, which continued across a legal-name change. | Must cover the period from the rename on 2024-04-01 to the authorization and commit time; the extract is dated 2026-10-15. | Customer domain-policy owner for POL-MDM-07 v3.2 (named owner not supplied) |
| CLAIM-02 | OP-DEMO-2026-001 | The legal-continuity evidence is temporally applicable: the name change on 2024-04-01 and unchanged legal-person identity apply to the interval through the authorization and commit time with no later dissolution or succession. | From 2024-04-01 to the authorization and commit time. The extract is 37 days older than the run date of 2026-11-21; the customer has not stated a freshness limit. | Customer domain-policy owner (named owner not supplied) |
| CLAIM-03 | OP-DEMO-2026-001 | Both records are active customer-account records of the same entity class at the recorded row versions (18 and 23) under identity schema CRM-IDENTITY-5, and CRM-ACCT-1042 qualifies as the canonical retained record under POL-MDM-07 v3.2. | Current state at authorization and at the pre-write revalidation. | CRM Platform Owner (customer-stated role) |
| CLAIM-04 | OP-DEMO-2026-001 | The migration report and the account-to-entity crosswalk, which both map the two CRM accounts to entity EC-004821, are internal mapping records that share an upstream origin and are not independent evidence of identity. | Mapping created at migration on 2024-05-15; later changes not supplied. | Customer domain-policy owner (named owner not supplied) |
| CLAIM-05 | OP-DEMO-2026-001 | The complete persistent write set for this MERGE is known and all of it, including the outbox insertion, commits in one atomic transaction with a single commit point, with no write to historical activity or to any undeclared object. | Applies to the exact schema CRM-IDENTITY-5 and coordinator version 2.8.0 current at authorization and commit. | CRM Platform Owner (customer-stated role) |
| CLAIM-06 | OP-DEMO-2026-001 | An authorization path can be established for this protected MERGE: either Path A (documented, tested and attested recovery or compensation for this exact operation and complete effect scope) or, only if Path A is not established, Path B (explicitly accepted non-recovery risk under current customer policy, operation-specific approval and separation of duties). | Version-bound: valid only while the equivalent state and schema and the persistence, policy and validator versions evidenced by A2 remain current at authorization and commit. | Unassigned (customer must designate attester and Path B approver roles) |

## Identity decision on the supplied evidence

The Planner reads the supplied evidence against the customer's stated policy POL-MDM-07 v3.2, which needs an exact official registry ID and evidence of legal continuity. This is a design-time reading of described evidence, not a verification and not an eligibility decision.

- **Exact registry ID:** both CRM records are stated to carry FIC-REG-004821, and the extract concerns registration number 004821. The customer must compare the record fields with the authenticated extract under a documented normalization rule; that comparison has not been evidenced.
- **Legal continuity:** SRC-REG-001, as described, states that the legal name changed on 2024-04-01 while the registration number and legal-person continuity stayed unchanged and records no dissolution, successor or new incorporation. This directly addresses the continuity prong for the rename interval.
- **Temporal consistency:** CRM-ACCT-1042 predates the rename (created 2019-06-12 under the legacy name) and CRM-ACCT-2097 was created after it (2024-05-15 under the current name); this is consistent with a duplicate created by migration, but it is context and not proof.
- **Contradictions:** none were supplied. Absence of a supplied contradiction is not positive support and is not treated as such.
- **Result:** the evidence supports identity continuity in principle, conditional on authenticity being tied to the exact extract, freshness, and customer promotion of the evidence for these propositions. It is not yet authorization-eligible, and the extract is 37 days older than the run date with no freshness limit defined.

## Evidence assessment by source

| Source | Contribution | Role | Limitations | Status |
|---|---|---|---|---|
| SRC-REG-001 | Directly states the 2024-04-01 name change and unchanged registration number and legal-person continuity; no dissolution or successor recorded. | SUPPORT (primary) for continuity | Described, not supplied; dated 2026-10-15; before and after names not evidenced; customer-supplied; authenticity depends on SRC-REG-VERIFY-005; no freshness limit. | Candidate for promotion by the customer; not promoted |
| SRC-REG-VERIFY-005 | Reports successful verification of the extract's digital signature and issuer certificate. | Authenticity basis for SRC-REG-001 | Supplied result, not a check performed by the Planner; must be tied to the exact extract with validator identity, version and time; revocation status and time not stated. | Candidate; not promoted |
| SRC-LEGAL-002 | Executed agreement dated 2025-02-14 identifies the current legal name and the same registry ID, corroborating the post-rename identity. | SUPPORT (corroborating) | Described, not supplied; shares the registry ID rather than independently proving continuity; does not show which account it is linked to or that it remains in force; does not cover the six contracts on CRM-ACCT-1042. | Candidate; not promoted |
| SRC-MIGRATION-003 | Explains that both CRM records were imported and mapped to EC-004821. | UNRESOLVED_INDICATION / context | Customer's own internal mapping; derivation not supplied; shares an upstream origin with the crosswalk; not independent corroboration. | Not eligible as identity support |
| SRC-CROSSWALK-004 | Both account IDs map to EC-004821. | UNRESOLVED_INDICATION / context | Same limitations as the migration report; the existing mapping may itself be an earlier unverified resolution. Useful for downstream idempotent handling. | Not eligible as identity support |

## Evidence requirements

Every proposition maps to JSON `proposition_id`, `operation_id`, `claim_kind` and a non-empty `provenance_refs` array; the source IDs below match that array exactly.

### CLAIM-01

- **Operation:** OP-DEMO-2026-001
- **Claim:** CRM-ACCT-1042 and CRM-ACCT-2097 denote the same legal person identified by official registry ID FIC-REG-004821, which continued across a legal-name change.
- **Claim kind:** identity_proposition
- **Evidence categories required:**
  - Authoritative official registry record for FIC-REG-004821
  - Exact registry-ID match on both CRM records under a documented normalization rule
  - Evidence of legal-person continuity (registration number unchanged; no dissolution, successor or new incorporation)
  - Post-rename contracting evidence that corroborates name and registry ID
- **Acceptable source characteristics:**
  - Official registry source with traceable provenance and authenticity validation
  - Scope covering the referent and the rename interval
  - Corroboration that is independent of the customer's own migration and crosswalk mapping
- **Temporal applicability:** Must cover the period from the rename on 2024-04-01 to the authorization and commit time; the extract is dated 2026-10-15.
- **Validation method:** Customer promotion process records the proposition, role, provenance, temporal applicability, validation basis and validator/policy version for SRC-REG-001, SRC-REG-VERIFY-005 and SRC-LEGAL-002; the Planner has performed none of these checks.
- **Contradictory evidence:** Any indication of a distinct, successor or dissolved entity, or a differing official registry ID, is a conflict that blocks the merge until adjudicated.
- **Promotion / eligibility authority:** Customer domain-policy owner for POL-MDM-07 v3.2 (named owner not supplied)
- **Unverified evidence treatment:** Observations that are not promoted stay UNVERIFIED and are not authorization-eligible; similarity, repetition or Planner confidence is not support.
- **Open questions:**
  - Extract content (before and after legal names, status fields) was described but not supplied.
  - Registry-ID normalization rule not stated.
  - Contract-side evidence for the six contracts on CRM-ACCT-1042 not supplied.
  - Evidence-eligibility authority not named.
- **Source IDs:** SRC-POLICY, SRC-REG-001, SRC-REG-VERIFY-005, SRC-LEGAL-002, SRC-MCP-EVID, SRC-MCP-PROFILE

### CLAIM-02

- **Operation:** OP-DEMO-2026-001
- **Claim:** The legal-continuity evidence is temporally applicable: the name change on 2024-04-01 and unchanged legal-person identity apply to the interval through the authorization and commit time with no later dissolution or succession.
- **Claim kind:** temporal_applicability
- **Evidence categories required:**
  - Registry status as of the authorization/commit time
  - Rename effective date and continuity statement
  - Customer-defined maximum evidence age
- **Acceptable source characteristics:**
  - Dated registry evidence with issuer and signature validation
  - Status information newer than the 2026-10-15 extract when the freshness limit requires it
- **Temporal applicability:** From 2024-04-01 to the authorization and commit time. The extract is 37 days older than the run date of 2026-11-21; the customer has not stated a freshness limit.
- **Validation method:** Customer-defined freshness check on the registry source at authorization and again at the pre-write revalidation.
- **Contradictory evidence:** A later dissolution, successor, restructuring or new incorporation contradicts continuity and blocks the merge.
- **Promotion / eligibility authority:** Customer domain-policy owner (named owner not supplied)
- **Unverified evidence treatment:** Evidence of unknown age is UNVERIFIED for temporal applicability and holds the candidate.
- **Open questions:**
  - Freshness limit not defined.
  - Whether the extract states the legacy and current names exactly as on the two records is not evidenced.
- **Source IDs:** SRC-POLICY, SRC-REG-001, SRC-REG-VERIFY-005, SRC-MCP-EVID, SRC-MCP-PROFILE

### CLAIM-03

- **Operation:** OP-DEMO-2026-001
- **Claim:** Both records are active customer-account records of the same entity class at the recorded row versions (18 and 23) under identity schema CRM-IDENTITY-5, and CRM-ACCT-1042 qualifies as the canonical retained record under POL-MDM-07 v3.2.
- **Claim kind:** candidate_qualification
- **Evidence categories required:**
  - Current record state and row versions
  - Entity class and schema version
  - Canonical-retention rule from the policy
- **Acceptable source characteristics:**
  - Authoritative CRM state read at authorization and again before the write
  - Policy text identifying the canonical-retention rule
- **Temporal applicability:** Current state at authorization and at the pre-write revalidation.
- **Validation method:** MergeCoordinator pre-persistence read of row versions, status and schema, compared with the authorized values.
- **Contradictory evidence:** A changed row version, status or schema is a stale-state conflict that requires re-evaluation with a new authorization record.
- **Promotion / eligibility authority:** CRM Platform Owner (customer-stated role)
- **Unverified evidence treatment:** State that cannot be read or compared is treated as unverified and holds the candidate.
- **Open questions:**
  - Policy text itself not supplied; only the supplied summary was used.
- **Source IDs:** SRC-REQUEST, SRC-POLICY, SRC-MCP-P1

### CLAIM-04

- **Operation:** OP-DEMO-2026-001
- **Claim:** The migration report and the account-to-entity crosswalk, which both map the two CRM accounts to entity EC-004821, are internal mapping records that share an upstream origin and are not independent evidence of identity.
- **Claim kind:** other
- **Evidence categories required:**
  - Origin and derivation of the EC-004821 mapping
  - Independence assessment relative to the registry evidence
- **Acceptable source characteristics:**
  - Recorded provenance showing whether the mapping derived from the same matching decision
- **Temporal applicability:** Mapping created at migration on 2024-05-15; later changes not supplied.
- **Validation method:** Customer review of how the mapping to EC-004821 was produced; until then it is context only.
- **Contradictory evidence:** If the mapping contradicts registry evidence (for example a different entity) it is a conflict to adjudicate, not a vote.
- **Promotion / eligibility authority:** Customer domain-policy owner (named owner not supplied)
- **Unverified evidence treatment:** Treated as UNRESOLVED_INDICATION or context; never promoted as sole or corroborating support for the identity proposition.
- **Open questions:**
  - Provenance of the EC-004821 mapping not supplied.
  - Whether the pre-existing crosswalk is correct or itself an earlier unverified resolution is unknown.
- **Source IDs:** SRC-MIGRATION-003, SRC-CROSSWALK-004, SRC-MCP-EVID

### CLAIM-05

- **Operation:** OP-DEMO-2026-001
- **Claim:** The complete persistent write set for this MERGE is known and all of it, including the outbox insertion, commits in one atomic transaction with a single commit point, with no write to historical activity or to any undeclared object.
- **Claim kind:** other
- **Evidence categories required:**
  - Dependency inventory of objects referencing either account ID
  - Transaction-boundary evidence for each write-set member
  - Storage location for preserved historical names and provenance
- **Acceptable source characteristics:**
  - Customer-held schema, catalog and transaction evidence
  - Evidence produced in a non-production environment with the same schema, not by a production write
- **Temporal applicability:** Applies to the exact schema CRM-IDENTITY-5 and coordinator version 2.8.0 current at authorization and commit.
- **Validation method:** Customer-owned dependency analysis and transaction-boundary review; a design-review method is a customer decision.
- **Contradictory evidence:** A write found outside the declared set or inside historical activity contradicts the proposition and blocks the write.
- **Promotion / eligibility authority:** CRM Platform Owner (customer-stated role)
- **Unverified evidence treatment:** Unproven membership stays UNKNOWN_UNVERIFIED and holds the write before the first persistent write.
- **Open questions:**
  - No transaction-boundary evidence supplied.
  - Storage location of historical names not stated.
  - Disposition of the CRM-ACCT-2097 row not stated.
- **Source IDs:** SRC-REQUEST, SRC-POLICY, SRC-MCP-P1

### CLAIM-06

- **Operation:** OP-DEMO-2026-001
- **Claim:** An authorization path can be established for this protected MERGE: either Path A (documented, tested and attested recovery or compensation for this exact operation and complete effect scope) or, only if Path A is not established, Path B (explicitly accepted non-recovery risk under current customer policy, operation-specific approval and separation of duties).
- **Claim kind:** authorization_path_eligibility
- **Evidence categories required:**
  - A1 recovery mechanism documentation
  - A2 recovery test record with versions
  - A3 attestation by a customer-designated role
  - Or Path B policy, operation-specific approval and separation-of-duties rule
- **Acceptable source characteristics:**
  - Operation-specific evidence for this MERGE and its complete effect scope
  - Customer-designated attester and approver roles
- **Temporal applicability:** Version-bound: valid only while the equivalent state and schema and the persistence, policy and validator versions evidenced by A2 remain current at authorization and commit.
- **Validation method:** Customer attestation and approval process; none is supplied.
- **Contradictory evidence:** A stale or failed Path A claim expires to unknown and does not select Path B automatically; an unresolved separation-of-duties question keeps Path B on HOLD.
- **Promotion / eligibility authority:** Unassigned (customer must designate attester and Path B approver roles)
- **Unverified evidence treatment:** Unproven A1, A2 or A3, or an unproven Path B policy, approval or separation of duties, holds the write.
- **Open questions:**
  - No recovery mechanism, recovery test, attestation or non-recovery-risk policy supplied.
- **Source IDs:** SRC-POLICY, SRC-MCP-P1, SRC-MCP-PROFILE

## Authorization-path claim semantics

CLAIM-06 is an authorization-path claim. The combined claim is only that an authorization path may be established; it is not a claim that the operation is recoverable.

| Path | What it establishes | Effect on factual reversibility |
|---|---|---|
| Path A | Recoverability for the exact operation and complete effect scope, only with A1 + A2 + A3 | `reversible` only after A1/A2/A3 are established; action class remains `IRREVERSIBLE_WRITE` |
| Path B | Explicit customer acceptance of this exact operation's non-recovery risk, with operation-specific authority and separation of duties | Does not establish `reversible` or `not_reversible`; retain `unknown`; action class remains `IRREVERSIBLE_WRITE` |

JSON `authorization_path_semantics` encodes: path_a = demonstrates_recoverability_only_when_A1_A2_A3_are_established; path_b = accepts_non_recovery_risk_without_demonstrating_recoverability; factual_reversibility_effect = path_b_does_not_establish_reversible_or_not_reversible. No staging or STAGE_LOCAL isolation claim is made in this plan.

## Conflict handling

| Condition | Recommended customer-side response | Decision owner |
|---|---|---|
| Sufficient support under policy and no material unresolved conflict | Continue to the other required controls; this is not authorization | Data Steward |
| Material contradiction (differing registry ID, dissolution, successor) | Block; quarantine for adjudication | Data Steward |
| Insufficient support (similarity only) | Do not persist the identity change | Data Steward |
| Indeterminate evidence (authenticity not tied to the extract) | Keep UNVERIFIED; do not treat as clear; HOLD | Data Steward |
| Stale / temporally inapplicable evidence | Refresh or defer; new authorization record | Data Steward |

Do not treat absence of a detected conflict as positive proof of identity.

## Negative control

A parent and a subsidiary with near-identical names, the same domain and address and shared contacts, but different official registry IDs, fail the exact-registry-ID criterion and must not be merged on those similarities alone (CTRL-02; TEST-03, a hypothetical fixture). Related entities keep their typed relation.
