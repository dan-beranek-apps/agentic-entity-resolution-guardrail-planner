# Synthetic CRM MERGE — demonstration package

This directory contains the **nine canonical planning deliverables** produced by Agentic Entity Resolution Guardrail Planner, Skill **v0.4.0**, in a reference-backed run dated 15 November 2026.

**Release provenance:** Skill v0.4.1 aligns the Skill identifier, package directory and schema namespaces with the canonical product identity. This is a naming and packaging update only; the planning logic is unchanged. The sample below remains correctly attributed to its original v0.4.0 run, and its provenance has not been rewritten.

The scenario is synthetic: an AI agent proposes merging two CRM customer-account records. The plan does not determine whether the records represent the same legal entity and does not execute or authorize a merge.

The planner is published separately as a design-time Agent Skill on Agensi: [Agentic Entity Resolution Guardrail Planner](https://www.agensi.io/r/DANIELBERANEK?to=/skills/agentic-entity-resolution-guardrail-planner).

## Deliverables

| File | Purpose |
|---|---|
| [00-README.md](00-README.md) | Plan overview, provenance, validation record and handoff status |
| [01-mutation-scope.md](01-mutation-scope.md) | Application and operation scope |
| [02-guardrail-specification.md](02-guardrail-specification.md) | Operational control requirements |
| [03-evidence-requirements.md](03-evidence-requirements.md) | Evidence, provenance and conflict requirements |
| [04-commit-boundary-design.md](04-commit-boundary-design.md) | Pre-persistence controls, commit boundary and failure handling |
| [05-implementation-blueprint.md](05-implementation-blueprint.md) | Components, interfaces and implementation sequence |
| [06-validation-scenarios.md](06-validation-scenarios.md) | Proposed customer-operation and planner-level tests |
| [07-assumptions-and-gaps.md](07-assumptions-and-gaps.md) | Assumptions, unresolved decisions and limitations |
| [guardrail-spec.json](guardrail-spec.json) | Machine-readable plan specification |

## Why the artifact-creation ledger is not included

The separate `artifact-creation-ledger.json` is an auxiliary package-creation and audit sidecar. It is **not a tenth planning deliverable** and is intentionally omitted from this public demonstration. It contains supplementary file-level creation, freeze, export and integrity observations rather than additional customer-facing implementation requirements.

The included plan overview and JSON specification still disclose the run provenance, validation status and material limitations. However, this public example does **not** provide the sidecar's detailed per-file hash and export attestations. The JSON contains only a summary reference to the sidecar; that reference does not mean the sidecar is included here.

## Read this before interpreting the example

- This is a **design-time plan**, not an executed or deployed guardrail.
- The 31 customer-operation scenarios are **proposed tests**; none was executed against a customer application.
- The plan is marked `not_implementation_ready`. Eleven customer decisions remain blocking.
- Draft 2020-12 JSON Schema validation and format validation were not run in the original generation environment; see the validation record in [00-README.md](00-README.md).
- The public reference MCP is read-only. It does not inspect customer data, decide evidentiary sufficiency, establish customer policy or authorize writes.
- All names and account identifiers in the example are synthetic.

This package is provided to demonstrate the structure, specificity and transparency of the planner's output. It is not a production implementation recipe that can be applied without customer-specific engineering and policy review.
