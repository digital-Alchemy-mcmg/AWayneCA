# Ashante Build Contract

Status: governing implementation architecture.

## Product topology
Ashante is one product family with two deliberately different surfaces sharing lineage, contracts, domain types, visual grammar, validation rules, status semantics, and business logic.

### Desktop Research Workbench
Owns the complete auction universe, ingestion, normalization, enrichment, evidence preservation, source validation, filtering, scoring, comparison, strategy analysis, rejection/reconsideration, shortlist construction, and local research history.

### Mobile Field Cockpit
Receives only properties explicitly promoted from desktop. It is a focused field and auction decision surface, not a bulk-research environment.

The desktop/mobile split is an architectural constraint, not merely responsive design.

## Technology boundaries
- Shared Next.js / React / TypeScript codebase where practical.
- GitHub: code, schemas, migrations, tests, adapters, rules, deployment config, architecture docs.
- Vercel: web/PWA delivery.
- SQLite: authoritative desktop research corpus.
- Firebase / Firestore: promoted field projection and synchronization state only.
- Local evidence store: bulky PDFs, imagery, raw downloads, source snapshots and other evidence artifacts. Git stores no live/private evidence.

## Canonical Property Envelope
One versioned machine-readable Property Envelope is the central invariant. It must be defined in shared TypeScript plus runtime validation (Zod or equivalent) and reused by research, promotion, Firestore projection, mobile rendering, and export.

The envelope must be capable of preserving:
- immutable internal property identity and parcel/source identifiers;
- auction identity and status;
- normalized address and asset classification;
- property characteristics;
- strategy;
- target bid and hard maximum bid;
- scenario values;
- market/comparable evidence;
- zoning/land-use evidence;
- environmental/flood evidence;
- title/legal research state;
- imagery-derived observations with limits;
- risks and counter-signals;
- evidence/source references;
- confidence, freshness and source health;
- known unknowns and human escalation;
- recommendations;
- operator notes/actions and decision state;
- calculation, schema and version timestamps;
- promotion and export metadata.

No surface may redefine the property into an incompatible model.

## Identity
Each property receives an immutable Ashante internal ID independent of address formatting and auction-specific IDs. Strong parcel identifiers take precedence over address-only matching. Identity conflicts must surface for review and must not be silently merged.

## Promotion gate
Nothing reaches mobile merely because research encountered it. Promotion is an explicit operator action.

Promotion must:
- validate the complete Property Envelope;
- require title clearance verified through the defined human workflow;
- reject high roof risk pending the required reverification;
- require freshness TTL under 72 hours;
- require configured target bid and non-negotiable hard cap;
- enforce the 30-envelope mobile cardinality cap transactionally;
- capture promotion timestamp and schema/envelope version;
- preserve active non-blocking warnings;
- identify stale/missing evidence;
- publish the bounded field projection of the complete canonical envelope to Firestore.

The four mandatory UI-specification checks — title, roof, freshness and bid cap — may not be bypassed or downgraded to warnings. Promotion is not broader certification. Other non-blocking warnings such as SOURCE DEGRADED or AUCTION STATUS REVERIFY may remain visible after promotion. A stricter 48-hour Auction Mode reverification warning supplements the 72-hour promotion gate; it does not replace it.

Demotion/removal from mobile never deletes desktop research history.

## Source health
Every source adapter exposes an explicit operational state such as available, degraded, unavailable, human-only or retired. Preserve last successful retrieval, last attempted check, failure information, and source/schema version where practical.

A dead source must not masquerade as a working feature. Staleness and next action must be visible.

## Human escalation
Automation must not manufacture certainty for title, insurability, legal conclusions, interior/structural condition, unavailable MLS-grade evidence, or other professionally/human-gated facts. The system shows what is missing, why it could not be established, where the operator can continue the check, what information is needed, and how a human finding re-enters the evidence record with provenance.

## Export
Export Property means the complete current Property Envelope. Primary field-friendly export is a self-contained HTML dossier that remains readable without the live backend and preserves the complete snapshot, schema version and export timestamp. CSV/XLSX may be secondary formats but may not silently discard nested data.

## Failure boundaries
- Vercel outage must not destroy desktop research.
- Firebase outage must not destroy desktop research.
- Loss of a mobile device must not destroy research.
- Source outage must not erase previously verified evidence.
- Exported self-contained HTML must remain independently readable.

## Adapter contract
Each automated integration follows: fetch → validate → preserve evidence/reference → normalize → timestamp → report health → detect material drift where possible → fail safely → escalate where automation cannot establish the fact.

UI and rules consume normalized contracts, not vendor-specific response logic spread throughout the application.

## Already-settled boundaries
Do not reopen without contradictory implementation evidence: provenance-first evidence philosophy, recommendation/decision-state concepts, risk/review gates, conservative bid-cap behavior, improved parcel vs lot strategy separation, human/legal/title limits, source hierarchy, freshness requirements, mobile-first field interaction, progressive disclosure, FACT/SIGNAL/ESTIMATE/UNKNOWN semantics, Auction-Day Mode, operator preferences, and prohibitions on automated bidding, legal/title certainty, unauthorized scraping, loan approval claims, or protected-class targeting.

## Production validation still required
1. Identity resolution and source precedence against real Wayne County records.
2. Exact versioned Property Envelope schema.
3. Live validation and failure contracts for production source adapters.
4. SQLite schema/migrations covering evidence, source health, recommendation versions, operator actions and promotion history.
5. Firestore projection size/security model.
6. End-to-end promotion and sync.
7. Real-device self-contained HTML export behavior.
8. Backup/recovery for SQLite and evidence files.
9. Secrets/configuration management.

## Invariants
One product family. One shared code lineage. One canonical Property Envelope. One authoritative heavy research store. One explicit promotion boundary. One deliberately small cloud field projection. One mobile-first field cockpit. One transparent source-health model. One human-escalation path. One complete portable property export.


## Frozen UI compatibility contract
The UI design lane is **CLOSED — UI LOCKED**. The canonical UI authority is `build-assets/ui/Ashante_SXV8_Figma_Wireframe_Spec_v1.0.0.pdf`, interpreted through `build-assets/ui/UI_STATUS.md`.

Engineering must build to the same frozen specification that produced the accepted UI, not reverse-engineer incidental prototype code. A component or implementation is promotable only when it conforms to that specification, this Build Contract and the canonical Property Envelope. Prototype shortcuts cannot bypass invariants. Accessibility, responsive behavior, production wiring and defect repairs are conformity work; they may not materially change structural components or interaction architecture.
