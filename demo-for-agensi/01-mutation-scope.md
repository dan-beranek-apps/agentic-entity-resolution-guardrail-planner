# Mutation Scope

**Package run ID:** 2026-11-21T01:15:46Z

## Application profile

- Application: CRM on PostgreSQL 16.5; MergeCoordinator 2.8.0; identity schema CRM-IDENTITY-5; pre-commit validator 1.6
- Workflow: Agent-proposed MERGE of CRM-ACCT-2097 into canonical CRM-ACCT-1042 after a legal name change
- Environment reviewed: Synthetic design-time demonstration; no production access
- Entity classes: customer account; legal entity (registered company)
- Agent / automation role: the agent proposes the merge; MergeCoordinator performs the write only after the customer's controls pass (customer design; not verified)
- Persistence mechanism: customer-required single SERIALIZABLE transaction covering seven tables and outbox insertion; asynchronous outbox consumers after commit
- Domain policy owner: not supplied
- Relevant policy version: POL-MDM-07 v3.2 (supplied as a summary)
- Temporal scope: Current account identity as of authorization and commit time. The legal-name change took effect on 2024-04-01 per SRC-REG-001 (extract dated 2026-10-15); CRM-ACCT-1042 was created 2019-06-12 under the legacy name; CRM-ACCT-2097 was created 2024-05-15 by migration under the current name. Registry status after the extract date has not been evidenced.
- Factual production reversibility / recovery basis: unknown; no recovery mechanism, test, attestation or non-recovery-risk policy supplied

## Operation register

| Operation ID | Identity proposition | Mutation type | Action class | Factual production reversibility | Entity class | Persistence point | Scope |
|---|---|---|---|---|---|---|---|
| OP-DEMO-2026-001 | CRM-ACCT-2097 (current legal name Northstar Industrial Components Limited) and CRM-ACCT-1042 (legacy legal name Northstar Components Limited) both denote the single continuing legal person with official registry ID FIC-REG-004821, whose legal name changed on 2024-04-01 without change of legal-person identity, for the purpose of one persistent CRM customer-account identity as of the authorization and commit time. | MERGE | IRREVERSIBLE_WRITE | unknown | customer account / legal entity (registered company) | unknown / unverified - HOLD before first persistent write. Customer-required design: one SERIALIZABLE PostgreSQL 16.5 transaction coordinated by MergeCoordinator 2.8.0 covering the seven declared tables and the outbox insertion, with the commit point at that transaction's COMMIT. No evidence proves that the implementation matches this design, that the write set is complete, or that atomicity holds; asynchronous consumers run after commit outside the transaction. | in_scope |

## Operation details

### OP-DEMO-2026-001 — Proposed MERGE of CRM-ACCT-2097 into canonical CRM-ACCT-1042 after a legal name change

**Identity proposition:**  
CRM-ACCT-2097 (current legal name Northstar Industrial Components Limited) and CRM-ACCT-1042 (legacy legal name Northstar Components Limited) both denote the single continuing legal person with official registry ID FIC-REG-004821, whose legal name changed on 2024-04-01 without change of legal-person identity, for the purpose of one persistent CRM customer-account identity as of the authorization and commit time.

**Proposed operation:**  
Merge source record CRM-ACCT-2097 (current legal name Northstar Industrial Components Limited; same registry ID FIC-REG-004821, address and domain; active; created 2024-05-15 by CRM migration; row version 23; two active contracts, three contact links) into canonical record CRM-ACCT-1042 (Northstar Components Ltd., legacy legal name Northstar Components Limited; registry ID FIC-REG-004821; Unit 8 Forge Park, Leeds LS10 1AB; domain northstar-industrial.example; active; created 2019-06-12 by the legacy CRM; row version 18; six active contracts, four contact links). Per POL-MDM-07 v3.2, CRM-ACCT-1042 is retained, the current legal name is adopted after an approved merge, and historical names and provenance are preserved. Operation ID OP-DEMO-2026-001; idempotency key demo-merge-1042-2097-v1.

**Affected state:**  
- UNKNOWN_UNVERIFIED: accounts - retained canonical row CRM-ACCT-1042 (adoption of the current legal name, row version 18) and the CRM-ACCT-2097 source row (row version 23; its post-merge disposition, such as status flag or tombstone, is not specified); the table is in the customer-declared write set and is required to be in the single SERIALIZABLE transaction, but transaction membership is not proven
- UNKNOWN_UNVERIFIED: account_contact_links - re-association of the three CRM-ACCT-2097 contact links to the canonical account, including handling of duplicate contacts; declared write-set member, transaction membership not proven
- UNKNOWN_UNVERIFIED: account_contract_links - re-association of the two active CRM-ACCT-2097 contracts to the canonical account (six existing on CRM-ACCT-1042); declared write-set member, transaction membership not proven
- UNKNOWN_UNVERIFIED: account_external_ids - external identifiers including registry ID FIC-REG-004821 and the CRM-ACCT-2097 alias; declared write-set member, uniqueness-collision handling and transaction membership not proven
- UNKNOWN_UNVERIFIED: account_merge_history - append-only merge lineage record for this operation; declared write-set member, transaction membership not proven
- UNKNOWN_UNVERIFIED: audit_events - audit record for this operation; declared write-set member, transaction membership not proven
- UNKNOWN_UNVERIFIED: transactional_outbox - outbox event(s) that drive downstream propagation; declared write-set member required to be inserted in the same transaction, membership not proven
- UNKNOWN_UNVERIFIED: storage location for preserved historical legal names and provenance (policy requires preservation); no named table or column is identified, so write-set completeness for this effect is not established
- UNKNOWN_UNVERIFIED: other persistent objects that reference either account ID beyond the seven declared tables (dependent foreign keys, triggers, caches, exports); existence and membership not assessed; historical activity records must retain original account IDs and must not be written
- EXTERNAL_OR_ASYNC: CRM search index update performed after commit by an asynchronous outbox consumer (customer-stated)
- EXTERNAL_OR_ASYNC: Billing customer read model update performed after commit by an asynchronous outbox consumer (customer-stated)
- EXTERNAL_OR_ASYNC: ERP customer crosswalk update performed after commit by an asynchronous outbox consumer (customer-stated); the supplied crosswalk already maps both account IDs to EC-004821, so idempotent handling is required

**Persistent write set and effect inventory:**  
The customer declared the complete database write set as `accounts`, `account_contact_links`, `account_contract_links`, `account_external_ids`, `account_merge_history` (append-only), `audit_events` and `transactional_outbox`, and requires all writes and the outbox insertion to be atomic in one SERIALIZABLE transaction. Because no transaction-membership evidence was supplied, every database effect above is labelled UNKNOWN_UNVERIFIED rather than IN_TRANSACTION. The inventory is not complete: the storage for preserved historical names and any other dependents of the account IDs are unresolved. The three asynchronous consumers are labelled EXTERNAL_OR_ASYNC on the customer's statement. Historical activity must retain its original account IDs and must not be written.

**Transaction / atomicity mechanism:**  
Customer-required: one SERIALIZABLE PostgreSQL 16.5 transaction owned by MergeCoordinator 2.8.0. This is a requirement, not evidence. Atomicity is not inferred from the database product or the isolation level; isolation also does not by itself prevent every anomaly, and the concrete concurrency mechanism requires database-specific design review.

**Exact commit point:**  
unknown / unverified — HOLD before first persistent write. Intended: the COMMIT of the single transaction after the pre-commit validator passes.

**Write-set completeness and atomicity status:**  
Unverified. Basis: no dependency analysis or transaction-boundary evidence supplied; storage of historical names and the CRM-ACCT-2097 row disposition unspecified. HOLD before the first persistent write (CTRL-08, DEC-04).

**Evidence context:**  
Registry extract FCR-EXTRACT-004821-2026-10-15 (SRC-REG-001), customer verification record (SRC-REG-VERIFY-005), executed agreement MSA-NSI-2025-02 (SRC-LEGAL-002), migration report (SRC-MIGRATION-003) and crosswalk (SRC-CROSSWALK-004); all synthetic and customer-provided; see 03-evidence-requirements.md.

**Action class and factual production reversibility:**  
Action class IRREVERSIBLE_WRITE (confirmed): Production MERGE of persistent shared CRM account identity with downstream propagation: protected IRREVERSIBLE_WRITE path. The label identifies the authorization boundary and does not assert that technical recovery is impossible. Factual reversibility: unknown. No recovery or compensation mechanism (A1), recovery test (A2) or responsible-role attestation (A3) was supplied, and no customer policy accepts non-recovery risk for this operation. Absence of documentation does not prove the merge is not reversible, and ordinary Data Steward / CRM Platform Owner approvals are not acceptance of non-recovery risk. Factual reversibility therefore remains unknown. Path A and Path B are the only authorization paths and neither is established (CTRL-07, DEC-03). No staging, shadow or STAGE_LOCAL operation is planned.

**Temporal applicability:**  
Current account identity as of authorization and commit time. The legal-name change took effect on 2024-04-01 per SRC-REG-001 (extract dated 2026-10-15); CRM-ACCT-1042 was created 2019-06-12 under the legacy name; CRM-ACCT-2097 was created 2024-05-15 by migration under the current name. Registry status after the extract date has not been evidenced.

**Current enforcement point:**  
MergeCoordinator 2.8.0 with pre-commit validator 1.6 and revalidation immediately before any persistent write (customer-stated). The implementation of the remaining controls is unknown or customer action required.

**Scope decision:**  
Included. A single protected MERGE; no extension to other mutation types.
