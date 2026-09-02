# Data Spine Architecture Summary — v1.0.0 Source Package

This summary mirrors the governing structure of the existing data-spine architecture package so GitHub-only agents can work without Google Drive.

## Authority chain
Build Assets architecture → canonical TypeScript contract/enums/manifest → Zod runtime validators → validation test suite → SQLite relational projections → materialized Property Envelope.

Downstream layers may not invent domain concepts or enum values that contradict upstream authority. Contract changes propagate through every layer.

## Existing package posture
The source package records:
- canonical TypeScript schema freeze;
- Zod validators as a 1:1 runtime projection;
- validation tests intended to prove positive/negative/boundary/enum/identity behavior;
- SQLite DDL as relational projection;
- a materialized `property_envelopes` JSON representation for read convenience.

The normalized relational tables remain authoritative over a materialized envelope copy if they conflict.

## Property Envelope
The package models a single property representation across desktop, promotion, mobile and export. Major facets include identity, parcel, characteristics, zoning, environmental state, imagery observations, market/rent signals, repair and finance scenarios, title/court research, neighborhood context, recommendation, evidence, escalations, operator actions, review gates, risk flags, ingestion/confidence/fidelity states and timestamps.

## Identity resolution
Recorded precedence is strongest parcel identifier first, then normalized address, then GIS proximity, then auction-item cross-reference. Match states include verified, probable, ambiguous, conflict and unresolved. Conflicts create an exception and blocking review state; they are not silently merged.

## Unknown-state handling
The package treats uncertainty as first-class and distinguishes unknown, unresolved, stale, degraded, human-only and incomplete conditions. Missing evidence is not equivalent to negative evidence.

Evidence epistemic states distinguish FACT, SIGNAL, ESTIMATE and UNKNOWN so modeled or observational data cannot silently inherit authoritative status.

## Evidence/provenance
The expected chain is source registry → fetch run → immutable source snapshot → field-level evidence ledger entry → entity links/conflict handling. Raw evidence is preserved before normalization where permitted. Conflicting evidence remains inspectable rather than overwritten.

## Source adapter lifecycle
Mandatory lifecycle: fetch → validate → preserve → normalize → timestamp → source-health assessment → fail safe → human escalation where required.

A failed source must record failure, avoid silently substituting stale data as current, update affected freshness/confidence state and create an escalation path when automation cannot establish the required fact.

## Audit
Significant ingestion, evidence, rules, recommendation, override, promotion, unpublish, source-health, schema-drift and export events are expected to be append-only audit events with actor/time/entity context.

## Reconciliation warning
The Google Drive package contains two `Schema Freeze v1.0` TypeScript files with the same recorded byte size. Treat them as possible duplicates until content/hash comparison establishes whether they are identical.

GPT Work should import/reconcile the actual source artifacts before authoring replacement schemas. GPT Other Profile should review the reconciled GitHub versions, not infer missing details from this summary when exact contract behavior is at issue.
