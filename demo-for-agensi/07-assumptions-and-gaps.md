# Assumptions and Gaps

**Package run ID:** 2026-11-21T01:15:46Z

## Blocking decisions

| ID | Decision / gap | Why it matters | Owner | Needed before implementation? |
|---|---|---|---|---|
| DEC-01 | Who are the Data Steward and CRM Platform Owner approvers, what is the approval record format, and how are approvals bound to operation OP-DEMO-2026-001 and its state? | No approval artifacts exist and none were supplied; the operation cannot be authorized. | Customer Data Steward and CRM Platform Owner | Yes |
| DEC-02 | Which evidence is eligible for promotion for the identity and continuity claims, who decides eligibility, what is the registry-ID normalization rule, what is the maximum evidence age, and does the extract show the legacy and current names exactly? | The identity proposition cannot be treated as authorization-eligible until the customer promotes evidence under a defined policy. | Customer domain-policy owner and Data Steward | Yes |
| DEC-03 | Is there a documented, tested and attested recovery for this MERGE (Path A), or does a current policy accept non-recovery risk with an authorized approver and separation of duties (Path B)? | Factual reversibility is unknown and the protected write cannot be authorized without exactly one path. | Customer risk owner and CRM Platform Owner | Yes |
| DEC-04 | What is the proven complete write set and atomic boundary, where are historical names and provenance stored, what is the disposition of the CRM-ACCT-2097 row, and which other objects reference the account IDs? | POL-MDM-07 requires proof before the first write; completeness and atomicity are unproven. | Customer CRM application and data owner | Yes |
| DEC-05 | How is the idempotency key persisted atomically, what is the retry budget, and who owns ambiguous-commit reconciliation? | Blind retries are prohibited and reconciliation needs an authoritative key and an owner. | Customer CRM application owner | Yes |
| DEC-06 | Are the outbox consumers idempotent and ordered, and who owns downstream reconciliation for the search index, Billing read model and ERP crosswalk? | Post-commit validation and reconciliation cannot be assured without consumer evidence. | Customer consumer owners | Yes |
| DEC-07 | Who owns quarantine, escalation and any tested compensation after a post-commit failure? | Without an owner and procedure a post-commit failure has no safe path. | Customer CRM Platform Owner | Yes |
| DEC-08 | What is the origin of the EC-004821 mapping in the migration report and crosswalk, and should the crosswalk be reviewed independently of this merge? | The Planner treats these records as non-independent; a reviewed origin could change how they are used. Not blocking because the design does not rely on them. | Customer Data Steward | No |

Ranked by whether they prevent safe implementation: DEC-04, DEC-03 and DEC-01 prevent any write; DEC-02 prevents treating the identity proposition as authorized; DEC-05, DEC-06 and DEC-07 prevent safe handling of ambiguity and post-commit failure; DEC-08 is not blocking.

## Assumptions

| ID | Assumption | Basis | Impact if false | How to verify |
|---|---|---|---|---|
| ASM-01 | The merge may be difficult or impossible to reverse and is classified as the protected IRREVERSIBLE_WRITE path. | A production MERGE changes shared account identity and propagates downstream; no recovery mechanism, test or attestation was supplied. | If recovery is later proven through Path A the action class remains IRREVERSIBLE_WRITE and only factual reversibility changes. | Customer supplies A1/A2/A3 or a Path B policy (DEC-03). |
| ASM-02 | The seven tables named by the customer are the intended write set, and the customer's statement that all writes and outbox insertion must be atomic in one SERIALIZABLE transaction is a requirement, not proof of the implementation. | The request states the write set and the required atomicity but supplies no transaction evidence; POL-MDM-07 requires proof before the first write. | If the implementation differs, the write set or atomic boundary is wrong and the write must stay on HOLD. | Customer dependency analysis and transaction-boundary review (DEC-04). |
| ASM-03 | The registry extract, verification record, agreement, migration report and crosswalk say what the request describes; their content was not supplied and none was verified by the Planner. | Only descriptions of the evidence were supplied. | Different content could change the evidence assessment or reveal a conflict. | Customer evidence-promotion process reviews the actual documents (DEC-02). |
| ASM-04 | SRC-MIGRATION-003 and SRC-CROSSWALK-004 share an upstream origin and are not independent identity evidence. | Both record the customer's own mapping of the two accounts to EC-004821; the derivation of that mapping was not supplied. | If the mapping was derived independently from authoritative evidence it could be re-assessed for corroboration. | Customer documents the origin of the EC-004821 mapping (DEC-08). |
| ASM-05 | The three downstream consumers exist as stated and run after commit, outside the transaction, and read only committed outbox rows. | Customer statement; no consumer evidence supplied. | Consumer behaviour, ordering or idempotency could differ. | Customer consumer owners document idempotency and ordering (DEC-06). |
| ASM-06 | The pre-commit validator evaluates the candidate state inside the same transaction before COMMIT, so uncommitted writes are the isolated candidate state for Phase 2 validation. | Design mapping from the reference contract to the stated stack; not stated by the customer. | If the validator runs outside the transaction the pre-commit abort guarantee does not hold. | Customer confirms where validator 1.6 runs. |
| ASM-07 | Only a MERGE operation is in scope; no UNMERGE, SPLIT or staging operation is planned, and no customer requirement for this MERGE is extended to any other mutation type. | The request defines one operation. | A separate UNMERGE or staging operation would need its own classification, controls and tests. | Customer requests a separate plan if needed. |
| ASM-08 | The extract date of 2026-10-15 and the run date of 2026-11-21 make the extract 37 days old; no customer freshness limit applies. | Dates supplied or taken from the execution clock. | A defined limit could make the extract stale or acceptable. | Customer defines the freshness limit (DEC-02). |

## Missing evidence or sources

- Content of the registry extract (before and after legal names, status fields), the verification record details, the agreement, the migration report and the crosswalk: described only.
- Policy text of POL-MDM-07 v3.2: summary only; policy owner not named.
- Contract-side evidence for the six contracts on CRM-ACCT-1042.
- Origin of the EC-004821 mapping.
- Approval artifacts: none supplied.
- A1, A2, A3 or Path B policy: none supplied.

## Missing implementation details

- Transaction-boundary evidence and dependency analysis for the write set; storage location for historical names; disposition of the CRM-ACCT-2097 row.
- Where idempotency key demo-merge-1042-2097-v1 is persisted and the retry budget.
- Evidence-promotion service, approval service and authorization-path service: not evidenced.
- Idempotency, ordering and reconciliation behaviour of the three outbox consumers.
- Owners for reconciliation, quarantine and recovery.
- Patch level of pre-commit validator 1.6 and where it runs relative to the transaction.

## Out-of-scope matters

UNMERGE, SPLIT and staging operations; execution, deployment or authorization of any write; legal determinations on continuity; independent verification of the registry; downstream system internals; production access.

## Degraded-mode limitations

None: the run is reference_backed. Retrieved: status, IRREVERSIBLE_WRITE / MERGE profile, evidence promotion contract, PHASE_1 and PHASE_2 IRREVERSIBLE_WRITE contracts. Not retrieved because not needed: application mapping, policy-as-code mapping and concept tools. The reference does not assess customer evidence or authorize anything. Contract versions are inherited from the status record, not contract-specific. No structural schema validation was possible in this environment (see README).

## Production-readiness conditions

Before any production use the customer must: resolve every blocking decision; supply and promote evidence; implement and test the controls in a non-production environment; obtain separate bound approvals; establish exactly one authorization path; prove the write set and atomicity; execute and record the proposed tests; run the real Draft 2020-12 schema validation and format negative controls; and complete an operational review. Nothing in this package grants authorization.

## Limitations

- This is a design-time plan; no database operation was executed, no record was modified, no production system was accessed and no authorization was granted.
- No approval artifacts were supplied, so the operation is not authorized to commit and no approval has been assumed.
- The registry extract, verification record, agreement, migration report, crosswalk and policy text were described but not supplied; the Planner had no independent access to the fictional registry and verified nothing.
- The reference MCP provided reference requirements and illustrative examples only; it did not assess customer evidence, instantiate policy, issue authorization or return a commit verdict.
- No Draft 2020-12 JSON Schema engine was available, so structural schema validation, validator-enforced format checks and the format negative controls were not run.
- Proposed tests were designed, not executed; customer runtime tests were not run.
