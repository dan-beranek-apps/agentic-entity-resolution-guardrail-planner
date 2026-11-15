# Evidence Requirements

**Package run ID:** 2026-11-15T17:25:14Z

## Identity propositions

| Proposition ID | Operation | Claim to be established | Scope / period | Policy owner |
|---|---|---|---|---|
| CLAIM-01 | OP-01 | The pair CRM-ACCT-1042 / CRM-ACCT-8891 qualifies only as a candidate for identity evaluation; similar names, the same web domain and one overlapping contact do not themselves establish co-reference. | Point-in-time snapshot of both records at candidate generation; recorded. | unassigned (customer to designate) |
| CLAIM-02 | OP-01 | The two records denote one and the same legal entity (co-reference), not two related but distinct legal entities. | Must hold for the validity interval defined in CLAIM-03. | unassigned (customer to designate) |
| CLAIM-03 | OP-01 | The evidence for CLAIM-02 is current and applies to the validity interval for which the identity is asserted, and any rename or continuity relied on applies to the same referent and interval. | Interval undefined: decision GAP-09. Until defined, temporal applicability cannot be established. | unassigned (customer to designate) |
| CLAIM-04 | OP-01 | The contract-indicated parent/holding relationship does not contradict single-legal-entity identity; if it shows two distinct legal entities, the MERGE proposition is false and a typed relation is the candidate outcome. | Relationship as at the validity interval. | unassigned (customer to designate) |
| CLAIM-05 | OP-01 | An authorization path may be established for the protected production MERGE: Path A (operation-specific A1+A2+A3) or, only when Path A is not established, Path B (current explicit customer policy, operation-specific authorized approval, separation of duties). | Path A is bound to the state/schema, persistence, policy and validator versions evidenced by A2 and is rechecked at authorization and commit. | unassigned (customer to designate) |
| CLAIM-06 | OP-01 | The complete persistent write set, the transaction (or equivalent atomic unit) and its coverage, and the exact commit point of the MERGE are established by customer-verified technical evidence. | Valid for the persistence schema and application version in force at execution time. | unassigned (customer to designate) |

## Evidence requirements

Signals that are merely similar (names, domain, one overlapping contact) support candidate qualification only. Evidence roles are SUPPORT, CONTRADICTION and UNRESOLVED_INDICATION; the parent/holding indication is an unresolved indication until adjudicated.

### CLAIM-01

- **Claim kind:** candidate_qualification
- **Claim:** The pair CRM-ACCT-1042 / CRM-ACCT-8891 qualifies only as a candidate for identity evaluation; similar names, the same web domain and one overlapping contact do not themselves establish co-reference.
- **Evidence categories required:** Recorded candidate-generation basis (which signals, from which records, at which version); Statement that the candidate is a hypothesis, not evidence
- **Acceptable source characteristics:** Signals recorded with provenance and version; Agent-generated labels, similarity scores and model confidence excluded as proof
- **Claim-specific relevance:** evidence must support this specific proposition, not document relevance, query match or plausibility.
- **Temporal applicability:** Point-in-time snapshot of both records at candidate generation; recorded.
- **Validation method:** Candidate record reviewed by the customer-designated evidence process; qualification does not promote any evidence.
- **Contradictory evidence:** A candidate with an unresolved conflicting indication stays a candidate; it is never promoted by repetition of the same signals.
- **Promotion / eligibility authority:** unassigned (customer to designate)
- **Unverified evidence treatment:** All four signals remain UNVERIFIED planner-visible evidence until claim-specific promotion; they are not authorization-eligible.
- **Open questions:** Customer has not defined which signals may qualify a candidate for evaluation.; Shared upstream origin of the signals (for example the same domain recorded on both accounts) is not documented.
- **Provenance:** SRC-02, SRC-03

### CLAIM-02

- **Claim kind:** identity_proposition
- **Claim:** The two records denote one and the same legal entity (co-reference), not two related but distinct legal entities.
- **Evidence categories required:** Authoritative legal-entity registry record verified for currency, scope and applicability to this proposition; Independent corroboration of legal name, registration identifier and jurisdiction for BOTH records; Documentary evidence of any rename, restructuring or succession linking the two names; Evidence addressing the parent/holding indication (CLAIM-04)
- **Acceptable source characteristics:** Authority and directness for legal-entity identity; Independence: shared upstream origins are not counted as separate corroboration; Recorded provenance, validator and policy version; No dependence on planner-hypothesis-induced retrieval alone
- **Claim-specific relevance:** evidence must support this specific proposition, not document relevance, query match or plausibility.
- **Temporal applicability:** Must hold for the validity interval defined in CLAIM-03.
- **Validation method:** Customer-defined validation and claim-specific promotion by a trusted process; this plan does not define the legal evidence standard.
- **Contradictory evidence:** Authorization-eligible contradiction blocks the MERGE; possible conflict indicated only by unverified or quarantined evidence is INDETERMINATE and blocks the MERGE pending adjudication.
- **Promotion / eligibility authority:** unassigned (customer to designate)
- **Unverified evidence treatment:** Unverified or quarantined items are kept distinct from authorization-eligible evidence; absence of a detected conflict is not positive support.
- **Open questions:** Customer evidence standard for legal-entity co-reference is undefined (GAP-05).; Registry extract is unverified (GAP-06).; No evidence supplied for the two records' registration identifiers beyond one potentially matching identifier.
- **Provenance:** SRC-02, SRC-03

### CLAIM-03

- **Claim kind:** temporal_applicability
- **Claim:** The evidence for CLAIM-02 is current and applies to the validity interval for which the identity is asserted, and any rename or continuity relied on applies to the same referent and interval.
- **Evidence categories required:** Registry extract date/currency and the interval it covers; Effective dates of any rename, restructuring or succession; Defined validity interval in customer policy
- **Acceptable source characteristics:** Dated, versioned extracts; Interval-bound statements
- **Claim-specific relevance:** evidence must support this specific proposition, not document relevance, query match or plausibility.
- **Temporal applicability:** Interval undefined: decision GAP-09. Until defined, temporal applicability cannot be established.
- **Validation method:** Compare evidence validity intervals with the policy-defined interval at authorization and again at commit.
- **Contradictory evidence:** Temporal mismatch or unresolved continuity defers the MERGE; no commit on an assumed interval.
- **Promotion / eligibility authority:** unassigned (customer to designate)
- **Unverified evidence treatment:** An extract with unknown currency is UNVERIFIED for temporal purposes.
- **Open questions:** Validity interval undefined.; Registry extract currency and scope unknown.
- **Provenance:** SRC-02, SRC-03

### CLAIM-04

- **Claim kind:** other
- **Claim:** The contract-indicated parent/holding relationship does not contradict single-legal-entity identity; if it shows two distinct legal entities, the MERGE proposition is false and a typed relation is the candidate outcome.
- **Evidence categories required:** The contract document itself (not a description of it) with parties, dates and signatures; Registry evidence of ownership/control or entity type for each record; Customer decision on the typed relation to preserve (GAP-07)
- **Acceptable source characteristics:** Primary document with provenance; Corroboration independent of the contract wording
- **Claim-specific relevance:** evidence must support this specific proposition, not document relevance, query match or plausibility.
- **Temporal applicability:** Relationship as at the validity interval.
- **Validation method:** Customer-designated reviewer adjudicates; outcome recorded before any identity decision.
- **Contradictory evidence:** Treated as an unresolved indication (possible contradiction). Retain the conflict; do not merge; route to review. If authorization-eligible evidence shows distinct entities: MERGE blocked.
- **Promotion / eligibility authority:** unassigned (customer to designate)
- **Unverified evidence treatment:** The contract content has not been supplied or verified; the parent/holding reading is an inference from a customer description.
- **Open questions:** Contract document not supplied to the planner.; Direction and nature of the relationship unknown.
- **Provenance:** SRC-02, SRC-03

### CLAIM-05

- **Claim kind:** authorization_path_eligibility
- **Claim:** An authorization path may be established for the protected production MERGE: Path A (operation-specific A1+A2+A3) or, only when Path A is not established, Path B (current explicit customer policy, operation-specific authorized approval, separation of duties).
- **Evidence categories required:** A1 documented recovery/compensation mechanism for this MERGE and its complete effect scope; A2 successful recovery test on materially equivalent state/schema with current persistence/policy/validator versions; A3 attestation by a customer-designated role; Or: current policy accepting this exact operation's non-recovery risk; authorized approver; separation of duties from ordinary approval
- **Acceptable source characteristics:** Customer-owned documents and records; Operation-specific (an UNMERGE procedure is not recovery for MERGE unless independently proven)
- **Claim-specific relevance:** evidence must support this specific proposition, not document relevance, query match or plausibility.
- **Temporal applicability:** Path A is bound to the state/schema, persistence, policy and validator versions evidenced by A2 and is rechecked at authorization and commit.
- **Validation method:** Customer-defined; the plan specifies the gates, not the outcome.
- **Contradictory evidence:** Neither path established: HOLD. After Path A is established, Path B is unavailable for that scope.
- **Promotion / eligibility authority:** unassigned (customer to designate)
- **Unverified evidence treatment:** Unverified A1/A2/A3 or policy leaves reversibility unknown and the operation on HOLD.
- **Open questions:** Recovery testing status unknown (GAP-03).; Authorized approvers and approval policy unknown (GAP-04).; Attestor, Path B policy and separation-of-duties rules unknown (GAP-08).
- **Provenance:** SRC-02, SRC-03

### CLAIM-06

- **Claim kind:** other
- **Claim:** The complete persistent write set, the transaction (or equivalent atomic unit) and its coverage, and the exact commit point of the MERGE are established by customer-verified technical evidence.
- **Evidence categories required:** Schema and code-path inventory of every identity-bearing record and dependent effect; Transaction/atomicity evidence per effect; Inventory of external and asynchronous consumers with delivery semantics
- **Acceptable source characteristics:** Customer technical documentation verified against the running system; Per-effect statement of in-transaction / outside-transaction / external membership
- **Claim-specific relevance:** evidence must support this specific proposition, not document relevance, query match or plausibility.
- **Temporal applicability:** Valid for the persistence schema and application version in force at execution time.
- **Validation method:** Customer engineering review plus database-specific design review; tested in a non-production environment.
- **Contradictory evidence:** Any effect with unknown membership stays UNKNOWN_UNVERIFIED and blocks the first persistent write.
- **Promotion / eligibility authority:** unassigned (customer to designate)
- **Unverified evidence treatment:** Unverified inventory is not treated as complete.
- **Open questions:** Write-set completeness, transaction coverage, commit boundary and atomicity are all unestablished (GAP-01, GAP-02).
- **Provenance:** SRC-02, SRC-03

## Authorization-path claim semantics

CLAIM-05 is the only `authorization_path_eligibility` claim. It does not assert that the operation is recoverable; it states that an authorization path may be established.

| Path | What it establishes | Effect on factual reversibility |
|---|---|---|
| Path A | Recoverability for the exact operation and complete effect scope, only with A1 + A2 + A3 | `reversible` only after A1/A2/A3 are established; action class remains IRREVERSIBLE_WRITE for the proven scope |
| Path B | Explicit customer acceptance of this operation's non-recovery risk, with operation-specific authority and separation of duties | Does not establish `reversible` or `not_reversible`; retain `unknown`; action class remains IRREVERSIBLE_WRITE |

REVERSIBLE_WRITE (isolated shadow staging) is a different action class and is not used in this plan.

## Verified STAGE_LOCAL isolation evidence

Not applicable: no STAGE_LOCAL operation is defined, so no `staging_isolation` evidence requirement exists.

## Conflict handling

| Condition | Recommended customer-side response | Decision owner |
|---|---|---|
| Sufficient support under policy and no material unresolved conflict | Continue to the other required controls (no automatic write) | Customer-designated promotion authority (unassigned) |
| Material contradiction (for example evidence of two distinct legal entities) | Block the MERGE; route to the typed-relation decision | Customer domain policy owner (unassigned) |
| Insufficient support (current state) | Do not persist the identity change; HOLD / DEFER | Customer domain policy owner (unassigned) |
| Indeterminate evidence (for example the unresolved parent/holding indication) | Do not treat as clear; HOLD and review | Customer-designated reviewer (unassigned) |
| Stale / temporally inapplicable evidence | Refresh or defer | Customer domain policy owner (unassigned) |

Do not treat absence of a detected conflict as positive proof of identity.

## Information classification for evidence

| Item | Classification |
|---|---|
| Similar company names | Customer-provided signal; planner-visible UNVERIFIED hypothesis |
| Same web domain | Customer-provided signal; may share an upstream origin (not independent corroboration) |
| One overlapping contact | Customer-provided signal; relatedness, not identity |
| Registry extract with a potentially matching identifier | Customer-provided, unverified for currency, scope and applicability (GAP-06) |
| Contract suggesting a parent/holding relationship | Customer-provided; content not supplied; inference that the entities may be distinct (ASM-03) |
| Agent confidence or generated labels | Not evidence |
| Public reference profile | Reference content (illustrative patterns); not customer policy |
