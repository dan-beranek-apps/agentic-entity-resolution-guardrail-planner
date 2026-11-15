# Assumptions and Gaps

**Package run ID:** 2026-11-15T17:25:14Z

## Blocking decisions

| ID | Decision / gap | Why it matters | Owner | Needed before implementation? |
|---|---|---|---|---|
| GAP-01 | What is the complete persistent write set of the MERGE (account records, identity links, contacts, contracts, billing references, projections, search indexes, downstream integrations, audit/outbox, assignments, history)? | Without a verified inventory the first persistent write must stay on HOLD. | Customer data/application owner (unassigned) | Yes |
| GAP-02 | Which effects are covered by one transaction, where is the exact commit point, and what atomicity guarantee holds? | Without it no commit and no recovery design can be validated; HOLD before the first write. | Customer engineering owner (unassigned) | Yes |
| GAP-03 | Has post-commit recovery or compensation for this MERGE been documented and successfully tested (Path A A1/A2)? | Determines whether Path A can ever apply; otherwise Path B or HOLD. | Customer recovery owner (unassigned) | Yes |
| GAP-04 | Which operation-specific approval policy applies and who are the authorized approvers? | No approval can be valid; the operation stays on HOLD. | Customer policy owner (unassigned) | Yes |
| GAP-05 | What evidence standard establishes legal-entity co-reference for this customer? | The plan cannot decide legal or domain evidentiary sufficiency. | Customer domain policy owner (unassigned) | Yes |
| GAP-06 | Is the registry extract current, in scope and applicable to the identity proposition (verification of currency, scope, applicability)? | The potentially matching identifier cannot support the MERGE while unverified. | Customer evidence owner (unassigned) | Yes |
| GAP-07 | How is the parent/holding indication resolved: one legal entity, related distinct entities (typed relation), or keep both? | If distinct, the MERGE proposition is false; the typed-relation alternative needs its own operation and plan. | Customer domain policy owner (unassigned) | Yes |
| GAP-08 | Who attests A1/A2 (Path A), who may approve Path B, what policy accepts non-recovery risk, and is the Path B approver required to be independent of the ordinary approver? | Without it neither authorization path can be established; Path B stays on HOLD. | Customer governance owner (unassigned) | Yes |
| GAP-09 | What validity interval or point in time does the identity assertion cover, and how are renames or continuity treated? | Temporal applicability cannot be established. | Customer domain policy owner (unassigned) | Yes |
| GAP-10 | Which concurrency and anomaly protections (stale read, lost update, write skew) are required for the customer's database engine and workload? | Database-specific design review is required before implementation; no generic isolation level is prescribed. | Customer database/engineering owner (unassigned) | Yes |
| GAP-11 | What are the survivorship rules (which record survives, field-level conflict resolution, treatment of the overlapping contact)? | Changes the write set and the result invariants. | Customer data owner (unassigned) | Yes |
| DEC-01 | Should an isolated shadow-staging target be introduced for candidate preparation before any production publication? | Recommendation only; any staging would need its own verified isolation evidence and tests, and production publication stays a separate protected operation. | Customer architecture owner (unassigned) | No |
| DEC-02 | How long must evidence snapshots and the pre-merge lineage be retained? | Affects audit and reconstruction capability; not a gate for the plan. | Customer records/compliance owner (unassigned) | No |

Blocking IDs are exactly those with `blocking: true` in the JSON. The first five documentation gaps stated in the request (write set, transaction coverage, commit boundary/atomicity, tested post-commit recovery, operation-specific approval policy and approvers) are GAP-01 to GAP-04.

## Assumptions

| ID | Assumption | Basis | Impact if false | How to verify |
|---|---|---|---|---|
| ASM-01 | The two records live in one CRM system of record and the MERGE would collapse them into a single surviving account identity. | Inference from the scenario; the survivor and retirement semantics were not described. | Different semantics change the write set and recovery design. | Customer confirms the merge model (GAP-11). |
| ASM-02 | The registry extract and the contract document exist but their content was not supplied to the planner. | Scenario describes them but attaches nothing. | If supplied later, evidence analysis and CLAIM-04 may change. | Provide the actual documents to the customer's evidence process. |
| ASM-03 | The parent/holding reading of the contract is an inference from the customer's phrase 'may be a parent or holding entity'. | Customer description only. | If wrong, CLAIM-04 resolves differently; if right, the MERGE proposition is likely false. | Reviewer adjudication per CTRL-04. |
| ASM-04 | A single production environment is in scope; the plan assumes no isolated shadow staging exists. | No staging was described. | If an isolated shadow target exists and is verified, a separate staging operation could be added. | Customer describes any staging target and its isolation evidence (DEC-01). |
| ASM-05 | All identifiers in the request are synthetic and are used as labels only. | Stated in the request. | None for design purposes. | None required. |
| ASM-06 | MCP calls used only abstract labels (customer account, CRM account resolution, current status; validity interval required); no company names, identifiers or records were sent. | Inspected from the actual call arguments in this run. | If wrong, a privacy incident would need review. | Inspect the host call log. |

## Missing evidence or sources

- The registry extract content and its currency, scope and applicability (GAP-06).
- The contract document itself and the nature and direction of the suggested parent/holding relationship (GAP-07).
- Registration identifiers and legal-entity evidence for both records (GAP-05).
- The validity interval (GAP-09).

## Missing implementation details

- Persistence mechanism, transaction boundary, commit point and effect membership (GAP-01, GAP-02).
- Integration inventory: search indexes, downstream consumers, event/outbox mechanism and delivery semantics.
- Recovery/compensation procedure and test history (GAP-03).
- Approval workflow, authorized approvers, Path A attestor, Path B policy and separation-of-duties rules (GAP-04, GAP-08).
- Concurrency protections for the customer's database engine (GAP-10).
- Survivorship rules (GAP-11).

## Out-of-scope matters

- Whether the two records are in fact the same legal entity (a customer/legal determination).
- The alternative outcome of a typed parent/subsidiary relation or keeping both accounts (needs its own operation and plan).
- Optional isolated shadow staging (DEC-01); any production publication from staging would be a separate protected operation.
- Unrelated CRUD, access-control review, and execution or authorization of any mutation.

## Degraded-mode limitations

The run is reference-backed for the IRREVERSIBLE_WRITE / MERGE profile (SRC-01, SRC-02). Two reference tools were not retrieved: the separate evidence-promotion contract (SRC-04) and the PHASE_1/PHASE_2 commit-boundary contract (SRC-05). Statements about evidence admission/promotion and commit checks rely only on the fields returned inside the profile, and no separate contract version is claimed. The three validation limitations are: no compatible Draft 2020-12 validator was available (schema validation, format validation and the format negative control were not run), no JSON canonicalization tool for the sidecar comparison, and per-call retrieval times were not retained.

## Production-readiness conditions

Before any production use the customer must: resolve every blocking decision; implement the controls; verify the write set and atomicity in a non-production environment; define approvers and approval policy; decide on Path A or Path B; execute the proposed tests; and obtain a fresh authorization for any actual write. This package does not authorize any of these.
