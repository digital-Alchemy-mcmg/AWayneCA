# SQLite Schema Candidate — COMPILER-002

Status: **IMPLEMENTED; PENDING VERIFY-002**

## Authority and derivation

`src/domain/property-envelope.ts` is the semantic authority. Its
`SQLITE_TABLE_MANIFEST` names 46 relational projections. The migration adds
exactly three contract-required tables that are not in that manifest:

1. `_schema_meta` — forward-only migration identity and source-contract hash.
2. `property_envelopes` — the complete canonical envelope JSON plus indexing
   state; this preserves one model rather than creating a SQLite-only property.
3. `property_characteristics` — direct projection of the frozen
   `PropertyCharacteristics` interface, including roof/foundation knowledge.

The result is 49 strict application tables. The supplied DDL artifact is not
authority: its verified SHA-256 is
`c13e9f719878ef428f82a8e74776f527a5a4ce4c19743df9dfbb193e131653b1`,
but its bytes contain only 29 `CREATE TABLE` statements and stop before the
operator-action section. It remains quarantined and was not copied forward.

## Table inventory

| Area | Tables | Count |
| --- | --- | ---: |
| Infrastructure and canonical projections | `_schema_meta`, `property_envelopes`, `property_characteristics` | 3 |
| Source management | `source_registry`, `source_snapshots`, `source_schema_versions`, `source_fetch_runs` | 4 |
| Auction | `auction_items`, `auction_item_status_history`, `auction_events`, `auction_outcomes` | 4 |
| Identity | `property_identity`, `identity_match_exceptions` | 2 |
| Parcel and GIS | `parcel_geometries`, `parcel_attributes` | 2 |
| Municipal | `municipal_coverage_registry`, `zoning_records`, `permit_records`, `demolition_records`, `code_records` | 5 |
| Market | `market_sales`, `comparable_sets`, `comparable_members`, `rent_signals` | 4 |
| Scenarios | `repair_scenarios`, `finance_scenarios` | 2 |
| Environmental | `environmental_flags`, `flood_flags` | 2 |
| Title and court | `title_research_cases`, `court_research_cases` | 2 |
| Imagery and neighborhood | `imagery_observations`, `neighborhood_context` | 2 |
| Preferences | `preference_profiles`, `preference_feedback` | 2 |
| Risk and gates | `risk_flags`, `review_gates` | 2 |
| Recommendation and strategy | `recommendations`, `recommendation_versions`, `bid_plans`, `strategies` | 4 |
| Evidence and escalation | `evidence_ledger`, `evidence_conflicts`, `human_escalations` | 3 |
| Operator | `operator_actions`, `operator_notes` | 2 |
| Promotion, audit, and export | `promotion_snapshots`, `audit_log`, `export_jobs`, `export_artifacts` | 4 |
| **Total** |  | **49** |

## Constraint inventory

- All 49 tables are `STRICT`; JSON projection columns require `json_valid`.
- Foreign keys are enabled by the migration and use restrictive deletion for
  research history and evidence relationships.
- Internal property IDs and parcel/source identifiers are `TEXT`, preserving
  leading zeroes. A partial unique index prevents a deterministic parcel within
  one municipality from silently becoming two properties.
- Ambiguous/conflicting identity has its own queue and cannot equate a property
  with itself as the competing identity.
- `evidence_ledger`, `audit_log`, `recommendation_versions`, and
  `promotion_snapshots` reject updates and deletes through append-only triggers.
- Evidence retains source, optional source snapshot, field path, confidence,
  epistemic state, review state, and capture time.
- Source health retains schema versions, fetch runs, last success/attempt, and
  failure details without overwriting source snapshots.
- Bid plans reject a target above the hard maximum. Runtime rules still own the
  stronger requirement that the hard maximum be null when critical inputs are
  unknown.
- Title status accepts only the frozen status enum; `clear`, `clean`,
  `marketable`, and `insurable` cannot be inserted.
- Automated imagery observations cannot claim `HIGH` confidence.
- Promotion snapshots retain the complete envelope, schema version, operator,
  warnings, blockers, lifecycle state, and unpublish time. This schema does not
  implement or bypass the Promotion Gate or its transactional 30-item limit.
- Export jobs retain the complete envelope snapshot and link produced artifacts
  by content hash; no nested data has to be flattened to create an export.

## Test evidence

`migrations/__tests__/canonical-schema.test.ts` checks:

- exact equality with all 46 manifest names plus the three justified tables;
- exact 49-table count, strict mode, and `PRAGMA foreign_key_check`;
- leading-zero identity preservation and deterministic parcel uniqueness;
- complete-envelope JSON round trip;
- source-linked immutable evidence;
- append-only recommendation, promotion, and audit history;
- conservative bid and imagery constraints; and
- rejection of manufactured title-clearance labels.

## Explicit gaps

- This packet does not implement a repository layer, backup/restore tooling,
  adapters, Firestore, promotion logic, UI, or deployment.
- Date-time strings are contract-validated before persistence; SQLite stores the
  canonical ISO strings but does not duplicate the Zod parser.
- Cross-field promotion eligibility and the 30-envelope mobile cap require a
  transaction in the later Promotion Gate, not a migration-time assertion.
- The schema remains a candidate until an independent verifier reproduces the
  migration and inspects its canonical coverage and source-DDL divergence.
