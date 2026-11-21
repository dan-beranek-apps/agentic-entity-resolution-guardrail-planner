# Mutation Scope

**Package run ID:** 2026-11-21T01:44:38Z

## Application profile

- Application: Synthetic CRM account master (MergeCoordinator 2.8.0, identity schema CRM-IDENTITY-5)
- Workflow: Agentic MERGE of duplicate customer account CRM-ACCT-2097 into canonical CRM-ACCT-1042 (planning exercise; no production access)
- Environment reviewed: PostgreSQL 16.5; MergeCoordinator 2.8.0; pre-commit validator 1.6; identity schema CRM-IDENTITY-5 (all customer-declared; not independently verified)
- Entity classes: customer account (legal entity)
- Agent / automation role: agentic proposal of a MERGE; MergeCoordinator 2.8.0 coordinates execution (customer-declared)
- Persistence mechanism: Customer requirement: one PostgreSQL 16.5 SERIALIZABLE transaction covering all database writes and the outbox insertion, with asynchronous outbox consumers after commit (declared; not verified)
- Domain policy owner: unassigned (not identified in the task input)
- Relevant policy version: POL-MDM-07 v3.2
- Temporal scope: Legal-name change effective 2024-04-01; registry extract dated 2026-10-15; continuity must hold from creation of CRM-ACCT-1042 (2019-06-12) through the commit time; evidence currency window not defined by policy
- Factual production reversibility / recovery basis: unknown; no A1, A2, A3 or irreversibility evidence supplied

## Operation register

| Operation ID | Identity proposition | Mutation type | Action class | Factual production reversibility | Entity class | Persistence point | Scope |
|---|---|---|---|---|---|---|---|
| OP-DEMO-2026-001 | CRM-ACCT-2097 (Northstar Industrial Components Limited) and CRM-ACCT-1042 (Northstar Components Ltd.; legacy legal name Northstar Components Limited) denote the same continuing legal person identified by official registry ID FIC-REG-004821, whose legal name changed on 2024-04-01 without change of registration number or legal-person continuity, so that CRM-ACCT-2097 may be merged into canonical CRM-ACCT-1042 under POL-MDM-07 v3.2. | MERGE | IRREVERSIBLE_WRITE | unknown | customer account (legal entity) | unknown / unverified - HOLD before first persistent write (see detail) | In |

## Operation details

### OP-DEMO-2026-001 — Merge CRM-ACCT-2097 into canonical CRM-ACCT-1042

**Identity proposition:**  
CRM-ACCT-2097 (Northstar Industrial Components Limited) and CRM-ACCT-1042 (Northstar Components Ltd.; legacy legal name Northstar Components Limited) denote the same continuing legal person identified by official registry ID FIC-REG-004821, whose legal name changed on 2024-04-01 without change of registration number or legal-person continuity, so that CRM-ACCT-2097 may be merged into canonical CRM-ACCT-1042 under POL-MDM-07 v3.2.

**Proposed operation:**  
MERGE source account CRM-ACCT-2097 into canonical account CRM-ACCT-1042 (policy retains CRM-ACCT-1042), adopt the current legal name after approved merge, and preserve historical names and provenance. Historical activity keeps its original account IDs.

**Affected state:**  
- UNKNOWN_UNVERIFIED: accounts - customer-declared write-set member (canonical row CRM-ACCT-1042 at row version 18; source row CRM-ACCT-2097 at row version 23); membership in one SERIALIZABLE transaction is a customer requirement and is not verified by implementation evidence
- UNKNOWN_UNVERIFIED: account_contact_links - customer-declared write-set member (three links on CRM-ACCT-2097, four on CRM-ACCT-1042); duplicate-contact handling and transaction membership not verified
- UNKNOWN_UNVERIFIED: account_contract_links - customer-declared write-set member (two active contracts on CRM-ACCT-2097, six on CRM-ACCT-1042); transaction membership not verified
- UNKNOWN_UNVERIFIED: account_external_ids - customer-declared write-set member (registry ID FIC-REG-004821 and enterprise-entity mapping EC-004821 on both records); uniqueness constraints and transaction membership not verified
- UNKNOWN_UNVERIFIED: account_merge_history - customer-declared append-only write-set member; append-only enforcement and transaction membership not verified
- UNKNOWN_UNVERIFIED: audit_events - customer-declared write-set member; event content and transaction membership not verified
- UNKNOWN_UNVERIFIED: transactional_outbox - customer-declared write-set member (outbox insertion required in the same transaction); event schema, ordering and transaction membership not verified
- UNKNOWN_UNVERIFIED: CRM search index update by an outbox consumer - customer-declared asynchronous effect after commit, outside the database transaction; consumer idempotency, ordering and reconciliation not verified
- UNKNOWN_UNVERIFIED: Billing customer read model update by an outbox consumer - customer-declared asynchronous effect after commit, outside the database transaction; consumer idempotency, ordering and reconciliation not verified
- UNKNOWN_UNVERIFIED: ERP customer crosswalk update by an outbox consumer - customer-declared asynchronous effect after commit, outside the database transaction; consumer idempotency, ordering and reconciliation not verified
- UNKNOWN_UNVERIFIED: storage of historical legal names and provenance needed for the adopt-current-name and preserve-history requirement - no table or column declared; may sit in accounts, account_external_ids, account_merge_history or an undeclared store
- UNKNOWN_UNVERIFIED: disposition of source record CRM-ACCT-2097 (status flag, tombstone, redirect or retention) and its external IDs - mechanism and affected tables not declared
- UNKNOWN_UNVERIFIED: historical activity records that must retain original account IDs - no table declared; foreign-key actions (for example cascading updates), triggers and rewrite risk not assessed
- UNKNOWN_UNVERIFIED: undeclared dependents that may reference either account ID (contracts, subscriptions, billing or invoice records, tickets, ownership and permissions, reporting copies) - existence and foreign-key or trigger behaviour not assessed
- UNKNOWN_UNVERIFIED: other write paths touching these tables during the operation (triggers, change-data-capture or replication consumers, other services) - not assessed

**Persistent write set and effect inventory:**  
The customer declared seven tables: accounts, account_contact_links, account_contract_links, account_external_ids, account_merge_history (append-only), audit_events and transactional_outbox. After commit, asynchronous outbox consumers update the CRM search index, the Billing customer read model and the ERP customer crosswalk. The list above adds plausible effects the customer did not declare. No item is verified, so the inventory is not complete. Missing dependencies identified: a historical-name and provenance store, source-record disposition, historical activity tables and their foreign-key actions, undeclared dependents, triggers and other write paths, outbox and audit event schemas, and consumer idempotency.

**Transaction / atomicity mechanism:**  
Customer requirement: all database writes and the outbox insertion occur in one SERIALIZABLE transaction in PostgreSQL 16.5. This is a requirement, not verified fact. Atomicity is not inferred from the product or the isolation level. Verification status: unverified.

**Exact commit point:**  
unknown / unverified — HOLD before first persistent write. Intended: the COMMIT of the single transaction.

**Write-set completeness and atomicity status:**  
Unverified. Blocking gaps GAP-03 and GAP-04. Consumer updates are outside the database transaction by customer declaration and cannot be rolled back with it.

**Evidence context:**  
Registry extract (SRC-REG-001), supplied authenticity result (SRC-REG-VERIFY-005), executed agreement (SRC-LEGAL-002), migration report (SRC-MIGRATION-003) and crosswalk (SRC-CROSSWALK-004); policy POL-MDM-07 v3.2 (SRC-POLICY-MDM-07). Details in 03-evidence-requirements.md.

**Action class and factual production reversibility:**  
Action class IRREVERSIBLE_WRITE (protected path; confirmed). Mutation type MERGE is stated by the customer. IRREVERSIBLE_WRITE is the protected authorization class for a potentially shared production identity effect; it does not assert that technical recovery is impossible. Factual reversibility: unknown. No recovery or compensation mechanism (A1), recovery test (A2) or customer attestation (A3) was supplied, and no positive technical evidence of irreversibility was supplied. Absence of evidence does not prove irreversibility, so factual reversibility remains unknown. The action class is the protected IRREVERSIBLE_WRITE path because a production MERGE changes shared identity state and feeds downstream consumers. Path A and Path B are alternatives; neither changes the action class (see CTRL-12).

**Temporal applicability:**  
Legal-name change effective 2024-04-01; registry extract dated 2026-10-15; continuity must hold from creation of CRM-ACCT-1042 (2019-06-12) through the commit time; evidence currency window not defined by policy

**Current enforcement point:**  
Not established. MergeCoordinator 2.8.0 and pre-commit validator 1.6 are declared; which checks they enforce is unknown.

**Scope decision:**  
Included. The negative control for related companies with different registry IDs is included as a test of the same gate (TEST-EVID-02).
