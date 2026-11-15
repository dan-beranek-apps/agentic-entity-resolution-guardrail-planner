# Mutation Scope

**Package run ID:** 2026-11-15T17:25:14Z

## Application profile

- Application: AI-assisted CRM entity-resolution workflow (synthetic scenario)
- Workflow: the agent proposes a MERGE of two customer-account records
- Environment reviewed: not described (no staging target described)
- Entity classes: Customer account / legal-entity identity
- Agent / automation role: proposes the candidate; has no authorization or write role under this plan
- Persistence mechanism: unknown / unverified (GAP-02)
- Domain policy owner: unassigned (customer to designate)
- Relevant policy version: none identified
- Temporal scope: current legal-entity status; validity interval required but not defined (GAP-09)
- Factual production reversibility / recovery basis: unknown; no A1/A2/A3 evidence established (GAP-03)

## Operation register

| Operation ID | Identity proposition | Mutation type | Action class | Factual production reversibility | Entity class | Persistence point | Scope |
|---|---|---|---|---|---|---|---|
| OP-01 | CRM-ACCT-1042 (Example Ridge Services Ltd) and CRM-ACCT-8891 (Example Ridge Service Holdings Ltd) denote the same legal entity, for the CRM customer-account identity, over a validity interval that customer policy must define; a parent/holding relationship between two distinct legal entities would contradict this proposition. | MERGE | IRREVERSIBLE_WRITE | unknown | Customer account / legal-entity identity | unknown / unverified - HOLD before first persistent write. Not established: the actual write mechanism, the transaction (or equivalent atomic unit) and which effects it covers, and the exact commit point. Atomicity is not inferred from the CRM product, an isolation level, a staging label or the application's write sequence. | unresolved |

## Operation details

### OP-01 - Production MERGE of CRM-ACCT-1042 and CRM-ACCT-8891

**Identity proposition:**  
CRM-ACCT-1042 (Example Ridge Services Ltd) and CRM-ACCT-8891 (Example Ridge Service Holdings Ltd) denote the same legal entity, for the CRM customer-account identity, over a validity interval that customer policy must define; a parent/holding relationship between two distinct legal entities would contradict this proposition.

**Proposed operation:**  
The agent proposes combining the two account records into one customer-account identity in the production CRM. Survivor selection and retirement semantics were not described (ASM-01, GAP-11). The agent only proposes; it does not authorize or perform the write.

**Affected state:**  
- UNKNOWN_UNVERIFIED: Account records CRM-ACCT-1042 and CRM-ACCT-8891 - survivor/retirement semantics (surviving record, tombstone, redirect, status flag) and membership in any transaction are not established.
- UNKNOWN_UNVERIFIED: Identity link / cross-reference records (alias, same-as, parent-child links) that the merge would create, repoint or retire - existence, schema and transaction membership not established.
- UNKNOWN_UNVERIFIED: Contact records, including the one overlapping contact (deduplication, re-parenting, roles, communication preferences) - transaction membership not established.
- UNKNOWN_UNVERIFIED: Contract records and the contract document that suggests a parent/holding relationship (re-association to a surviving account; possible loss of the typed relation) - transaction membership not established.
- UNKNOWN_UNVERIFIED: Billing references (billing accounts, payment terms, tax/VAT identifiers, billing contacts) - existence and transaction membership not established.
- UNKNOWN_UNVERIFIED: Denormalized projections, rollup fields and reporting tables derived from account identity - plausible effect class, not assessed.
- UNKNOWN_UNVERIFIED: Search indexes (re-indexing, alias entries) - probably asynchronous, but existence and boundary are not verified.
- UNKNOWN_UNVERIFIED: Downstream integrations (for example ERP/billing, data warehouse, marketing automation, support tooling) that receive merge events or changed identifiers - consumers and delivery semantics unknown.
- UNKNOWN_UNVERIFIED: Audit trail and transactional outbox/event records for the merge - existence and transaction membership not established.
- UNKNOWN_UNVERIFIED: Ownership, territory, permission, subscription and entitlement assignments attached to either account - plausible effect class, not assessed.
- UNKNOWN_UNVERIFIED: Notes, activities, attachments and history lineage of both records - plausible effect class, not assessed.

**Persistent write set and effect inventory:**  
Every effect class above is UNKNOWN_UNVERIFIED because existence, applicability and transaction membership are not established by current documentation. The list is not asserted to be complete; the customer must confirm the inventory (GAP-01). No effect is asserted as in-transaction, outside the transaction, or external/asynchronous.

**Transaction / atomicity mechanism:**  
Not established. No transaction, equivalent atomic unit, or coverage of effects is documented. Atomicity is not inferred from the CRM product or any isolation level.

**Exact commit point:**  
unknown / unverified - HOLD before first persistent write.

**Write-set completeness and atomicity status:**  
Unverified (write-set completeness) and unknown (atomicity). Remaining gaps: GAP-01, GAP-02, GAP-10. Required behaviour: HOLD before the first persistent write (CTRL-06, CTRL-07).

**Evidence context:**  
Customer-provided signals: similar names, same web domain, one overlapping contact, a registry extract with a potentially matching identifier (unverified), and a contract document suggesting a parent/holding relationship (content not supplied). See 03-evidence-requirements.md.

**Action class and factual production reversibility:**  
IRREVERSIBLE_WRITE (protected path), classification confirmed: a production MERGE can persistently alter shared identity interpretation, and the retrieved profile states that an ambiguous effect class is treated as protected. No isolated staging target exists in the description, so no STAGE_LOCAL or REVERSIBLE_WRITE claim is made. Factual reversibility is `unknown`: No operation-specific recovery/compensation mechanism (A1), successful recovery test (A2) or customer-designated attestation (A3) is established by the current documentation. Absence of documentation does not prove the merge is not reversible; factual reversibility is therefore unknown. Path A and Path B are the only alternative authorization paths for this operation (CTRL-11); neither changes the action class.

**Temporal applicability:**  
Current legal-entity status; validity interval required but not yet defined (GAP-09).

**Current enforcement point:**  
Unknown; no commit-boundary guard is described (IMPL-04).

**Scope decision:**  
Included, scope_status `unresolved`: the plan covers the protected MERGE, but the identity proposition is unproven and may be false (GAP-07); the alternative typed-relation outcome is excluded and would need its own operation.

## Information classification

This plan keeps these categories separate. Matching signals are not treated as proof of legal-entity identity.

| Category | Items |
|---|---|
| Verified facts (by this planner) | Public reference service status and the returned IRREVERSIBLE_WRITE / MERGE profile content (SRC-01, SRC-02). No customer fact has been verified. |
| Customer-provided information (unverified) | Similar company names; same web domain; one overlapping contact; a registry extract with a potentially matching identifier; a contract that suggests a parent/holding relationship; the five documentation gaps (write set, transaction coverage, commit boundary/atomicity, tested post-commit recovery, approval policy and approvers). |
| Inferences | The two companies may be related but distinct (parent/holding reading, ASM-03); a MERGE may therefore be the wrong operation. |
| Assumptions | ASM-01 to ASM-06 in 07-assumptions-and-gaps.md |
| Unresolved decisions | GAP-01 to GAP-11 (blocking) and DEC-01, DEC-02 (non-blocking) |
