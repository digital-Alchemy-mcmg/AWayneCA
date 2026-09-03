PRAGMA foreign_keys = ON;

BEGIN IMMEDIATE;

CREATE TABLE _schema_meta (
  migration_id TEXT PRIMARY KEY,
  schema_version TEXT NOT NULL,
  applied_at TEXT NOT NULL,
  source_contract TEXT NOT NULL,
  source_contract_hash TEXT NOT NULL
) STRICT;

CREATE TABLE source_registry (
  source_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  authority_rank TEXT NOT NULL,
  access_mode TEXT NOT NULL,
  schema_contract_version TEXT NOT NULL,
  operational_status TEXT NOT NULL CHECK (operational_status IN ('AVAILABLE','DEGRADED','UNAVAILABLE','HUMAN_ONLY','RETIRED')),
  last_health_check_at TEXT,
  last_successful_retrieval TEXT,
  last_attempted_retrieval TEXT,
  failure_reason TEXT,
  config_json TEXT NOT NULL CHECK (json_valid(config_json))
) STRICT;

CREATE TABLE source_schema_versions (
  source_schema_version_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  schema_version TEXT NOT NULL,
  schema_hash TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  schema_json TEXT NOT NULL CHECK (json_valid(schema_json)),
  UNIQUE (source_id, schema_version, schema_hash)
) STRICT;

CREATE TABLE source_fetch_runs (
  fetch_run_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  source_schema_version_id TEXT REFERENCES source_schema_versions(source_schema_version_id) ON DELETE RESTRICT,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT NOT NULL CHECK (status IN ('started','succeeded','degraded','failed','human_only')),
  records_seen INTEGER NOT NULL DEFAULT 0 CHECK (records_seen >= 0),
  records_accepted INTEGER NOT NULL DEFAULT 0 CHECK (records_accepted >= 0),
  failure_json TEXT CHECK (failure_json IS NULL OR json_valid(failure_json))
) STRICT;

CREATE TABLE source_snapshots (
  source_snapshot_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  fetch_run_id TEXT REFERENCES source_fetch_runs(fetch_run_id) ON DELETE RESTRICT,
  content_hash TEXT NOT NULL,
  storage_reference TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  source_effective_at TEXT,
  metadata_json TEXT NOT NULL CHECK (json_valid(metadata_json)),
  UNIQUE (source_id, content_hash)
) STRICT;

CREATE TABLE property_identity (
  property_id TEXT PRIMARY KEY CHECK (length(property_id) > 0),
  parcel_id_normalized TEXT,
  address_normalized TEXT,
  municipality TEXT,
  zip TEXT,
  match_status TEXT NOT NULL CHECK (match_status IN ('verified','probable','ambiguous','conflict','unresolved')),
  match_confidence TEXT NOT NULL CHECK (match_confidence IN ('HIGH','MEDIUM','LOW','UNKNOWN')),
  identity_json TEXT NOT NULL CHECK (json_valid(identity_json)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
) STRICT;

CREATE UNIQUE INDEX uq_property_parcel_municipality
  ON property_identity(municipality, parcel_id_normalized)
  WHERE parcel_id_normalized IS NOT NULL AND municipality IS NOT NULL;

CREATE TABLE property_envelopes (
  property_id TEXT PRIMARY KEY REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  schema_version TEXT NOT NULL,
  envelope_timestamp TEXT NOT NULL,
  decision_state TEXT NOT NULL,
  ingestion_state TEXT NOT NULL,
  envelope_json TEXT NOT NULL CHECK (json_valid(envelope_json)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_enriched_at TEXT,
  last_scored_at TEXT
) STRICT;

CREATE TABLE property_characteristics (
  property_id TEXT PRIMARY KEY REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  asset_class TEXT NOT NULL,
  structure_status TEXT NOT NULL,
  roof_condition_known INTEGER NOT NULL CHECK (roof_condition_known IN (0,1)),
  foundation_condition_known INTEGER NOT NULL CHECK (foundation_condition_known IN (0,1)),
  occupancy_status TEXT NOT NULL CHECK (occupancy_status IN ('occupied','vacant','unknown')),
  characteristics_json TEXT NOT NULL CHECK (json_valid(characteristics_json)),
  updated_at TEXT NOT NULL
) STRICT;

CREATE TABLE identity_match_exceptions (
  exception_id TEXT PRIMARY KEY,
  property_id TEXT REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  candidate_property_id TEXT REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  source_id TEXT REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  reason TEXT NOT NULL,
  evidence_json TEXT NOT NULL CHECK (json_valid(evidence_json)),
  status TEXT NOT NULL CHECK (status IN ('open','resolved','dismissed')),
  created_at TEXT NOT NULL,
  resolved_at TEXT,
  CHECK (property_id IS NULL OR candidate_property_id IS NULL OR property_id <> candidate_property_id)
) STRICT;

CREATE TABLE auction_events (
  auction_event_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  event_name TEXT NOT NULL,
  starts_at TEXT,
  ends_at TEXT,
  event_json TEXT NOT NULL CHECK (json_valid(event_json))
) STRICT;

CREATE TABLE auction_items (
  auction_item_id TEXT PRIMARY KEY,
  auction_event_id TEXT REFERENCES auction_events(auction_event_id) ON DELETE RESTRICT,
  property_id TEXT REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  source_snapshot_id TEXT NOT NULL REFERENCES source_snapshots(source_snapshot_id) ON DELETE RESTRICT,
  parcel_id_raw TEXT,
  parcel_id_normalized TEXT,
  address_raw TEXT,
  address_normalized TEXT,
  status TEXT NOT NULL CHECK (status IN ('listed','removed','sold','unknown')),
  minimum_bid REAL CHECK (minimum_bid IS NULL OR minimum_bid >= 0),
  current_bid REAL CHECK (current_bid IS NULL OR current_bid >= 0),
  sold_price REAL CHECK (sold_price IS NULL OR sold_price >= 0),
  captured_at TEXT NOT NULL,
  raw_fields_json TEXT NOT NULL CHECK (json_valid(raw_fields_json))
) STRICT;

CREATE TABLE auction_item_status_history (
  auction_item_status_id TEXT PRIMARY KEY,
  auction_item_id TEXT NOT NULL REFERENCES auction_items(auction_item_id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('listed','removed','sold','unknown')),
  observed_at TEXT NOT NULL,
  source_snapshot_id TEXT NOT NULL REFERENCES source_snapshots(source_snapshot_id) ON DELETE RESTRICT,
  detail_json TEXT NOT NULL CHECK (json_valid(detail_json))
) STRICT;

CREATE TABLE auction_outcomes (
  auction_outcome_id TEXT PRIMARY KEY,
  auction_item_id TEXT NOT NULL REFERENCES auction_items(auction_item_id) ON DELETE RESTRICT,
  outcome TEXT NOT NULL,
  sold_price REAL CHECK (sold_price IS NULL OR sold_price >= 0),
  observed_at TEXT NOT NULL,
  source_snapshot_id TEXT REFERENCES source_snapshots(source_snapshot_id) ON DELETE RESTRICT,
  outcome_json TEXT NOT NULL CHECK (json_valid(outcome_json))
) STRICT;

CREATE TABLE parcel_geometries (
  parcel_geometry_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  parcel_id TEXT NOT NULL,
  geometry_wkt TEXT,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  captured_at TEXT NOT NULL,
  UNIQUE (property_id, parcel_id, source_id, captured_at)
) STRICT;

CREATE TABLE parcel_attributes (
  parcel_attribute_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  parcel_id TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  source_effective_date TEXT,
  captured_at TEXT NOT NULL,
  attributes_json TEXT NOT NULL CHECK (json_valid(attributes_json))
) STRICT;

CREATE TABLE municipal_coverage_registry (
  coverage_id TEXT PRIMARY KEY,
  municipality TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  data_domain TEXT NOT NULL,
  coverage_status TEXT NOT NULL,
  checked_at TEXT NOT NULL,
  detail_json TEXT NOT NULL CHECK (json_valid(detail_json)),
  UNIQUE (municipality, source_id, data_domain)
) STRICT;

CREATE TABLE zoning_records (
  zoning_record_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  source_id TEXT REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  zoning_district TEXT,
  municipality TEXT NOT NULL,
  zoning_verified INTEGER NOT NULL CHECK (zoning_verified IN (0,1)),
  verified_at TEXT,
  record_json TEXT NOT NULL CHECK (json_valid(record_json))
) STRICT;

CREATE TABLE permit_records (
  permit_record_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  permit_number TEXT,
  observed_at TEXT NOT NULL,
  record_json TEXT NOT NULL CHECK (json_valid(record_json))
) STRICT;

CREATE TABLE demolition_records (
  demolition_record_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  status TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  record_json TEXT NOT NULL CHECK (json_valid(record_json))
) STRICT;

CREATE TABLE code_records (
  code_record_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  status TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  record_json TEXT NOT NULL CHECK (json_valid(record_json))
) STRICT;

CREATE TABLE market_sales (
  market_sale_id TEXT PRIMARY KEY,
  property_id TEXT REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  parcel_id TEXT,
  sale_date TEXT,
  sale_price REAL CHECK (sale_price IS NULL OR sale_price >= 0),
  sale_json TEXT NOT NULL CHECK (json_valid(sale_json))
) STRICT;

CREATE TABLE comparable_sets (
  comparable_set_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  strategy_id TEXT,
  created_at TEXT NOT NULL,
  criteria_json TEXT NOT NULL CHECK (json_valid(criteria_json))
) STRICT;

CREATE TABLE comparable_members (
  comparable_member_id TEXT PRIMARY KEY,
  comparable_set_id TEXT NOT NULL REFERENCES comparable_sets(comparable_set_id) ON DELETE RESTRICT,
  market_sale_id TEXT REFERENCES market_sales(market_sale_id) ON DELETE RESTRICT,
  rank INTEGER CHECK (rank IS NULL OR rank > 0),
  adjustment_json TEXT NOT NULL CHECK (json_valid(adjustment_json))
) STRICT;

CREATE TABLE rent_signals (
  rent_signal_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  monthly_rent REAL CHECK (monthly_rent IS NULL OR monthly_rent >= 0),
  captured_at TEXT NOT NULL,
  signal_json TEXT NOT NULL CHECK (json_valid(signal_json))
) STRICT;

CREATE TABLE repair_scenarios (
  repair_scenario_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  scenario_name TEXT NOT NULL,
  repair_total REAL CHECK (repair_total IS NULL OR repair_total >= 0),
  created_at TEXT NOT NULL,
  scenario_json TEXT NOT NULL CHECK (json_valid(scenario_json))
) STRICT;

CREATE TABLE finance_scenarios (
  finance_scenario_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  scenario_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  scenario_json TEXT NOT NULL CHECK (json_valid(scenario_json))
) STRICT;

CREATE TABLE environmental_flags (
  environmental_flag_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  flag_type TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  flag_json TEXT NOT NULL CHECK (json_valid(flag_json))
) STRICT;

CREATE TABLE flood_flags (
  flood_flag_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  flood_zone TEXT,
  captured_at TEXT NOT NULL,
  flag_json TEXT NOT NULL CHECK (json_valid(flag_json))
) STRICT;

CREATE TABLE title_research_cases (
  title_case_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  title_status TEXT NOT NULL CHECK (title_status IN ('not_researched','public_index_reviewed_no_obvious_flag','public_index_flagged','title_company_review_pending','professional_report_received','not_insurable_or_unresolved')),
  operator_verified INTEGER NOT NULL DEFAULT 0 CHECK (operator_verified IN (0,1)),
  updated_at TEXT NOT NULL,
  case_json TEXT NOT NULL CHECK (json_valid(case_json))
) STRICT;

CREATE TABLE court_research_cases (
  court_case_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  case_json TEXT NOT NULL CHECK (json_valid(case_json))
) STRICT;

CREATE TABLE imagery_observations (
  observation_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  source_id TEXT REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  observation_type TEXT NOT NULL,
  confidence TEXT NOT NULL CHECK (confidence IN ('MEDIUM','LOW','UNKNOWN')),
  captured_at TEXT NOT NULL,
  observation_json TEXT NOT NULL CHECK (json_valid(observation_json))
) STRICT;

CREATE TABLE neighborhood_context (
  neighborhood_context_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  captured_at TEXT NOT NULL,
  context_json TEXT NOT NULL CHECK (json_valid(context_json))
) STRICT;

CREATE TABLE preference_profiles (
  profile_id TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version > 0),
  preferences_json TEXT NOT NULL CHECK (json_valid(preferences_json)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (profile_id, version)
) WITHOUT ROWID, STRICT;

CREATE TABLE preference_feedback (
  feedback_id TEXT PRIMARY KEY,
  profile_id TEXT,
  profile_version INTEGER,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  signal TEXT NOT NULL CHECK (signal IN ('thumbs_up','thumbs_down')),
  reason TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (profile_id, profile_version) REFERENCES preference_profiles(profile_id, version) ON DELETE RESTRICT
) STRICT;

CREATE TABLE risk_flags (
  risk_flag_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  risk_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  active INTEGER NOT NULL CHECK (active IN (0,1)),
  updated_at TEXT NOT NULL,
  risk_json TEXT NOT NULL CHECK (json_valid(risk_json))
) STRICT;

CREATE TABLE review_gates (
  review_gate_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  gate_type TEXT NOT NULL,
  state TEXT NOT NULL,
  blocking INTEGER NOT NULL CHECK (blocking IN (0,1)),
  reviewed_at TEXT,
  gate_json TEXT NOT NULL CHECK (json_valid(gate_json))
) STRICT;

CREATE TABLE strategies (
  strategy_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  strategy_type TEXT NOT NULL,
  selected INTEGER NOT NULL DEFAULT 0 CHECK (selected IN (0,1)),
  calculated_at TEXT NOT NULL,
  strategy_json TEXT NOT NULL CHECK (json_valid(strategy_json))
) STRICT;

CREATE TABLE bid_plans (
  bid_plan_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  target_bid REAL CHECK (target_bid IS NULL OR target_bid >= 0),
  hard_max_bid REAL CHECK (hard_max_bid IS NULL OR hard_max_bid >= 0),
  calculated_at TEXT NOT NULL,
  fresh_until TEXT,
  plan_json TEXT NOT NULL CHECK (json_valid(plan_json)),
  CHECK (target_bid IS NULL OR hard_max_bid IS NULL OR target_bid <= hard_max_bid)
) STRICT;

CREATE TABLE recommendations (
  recommendation_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  strategy_id TEXT NOT NULL REFERENCES strategies(strategy_id) ON DELETE RESTRICT,
  bid_plan_id TEXT NOT NULL REFERENCES bid_plans(bid_plan_id) ON DELETE RESTRICT,
  model_version TEXT NOT NULL,
  decision_state TEXT NOT NULL,
  calculated_at TEXT NOT NULL,
  fresh_until TEXT,
  recommendation_json TEXT NOT NULL CHECK (json_valid(recommendation_json))
) STRICT;

CREATE TABLE recommendation_versions (
  recommendation_version_id TEXT PRIMARY KEY,
  recommendation_id TEXT NOT NULL REFERENCES recommendations(recommendation_id) ON DELETE RESTRICT,
  version INTEGER NOT NULL CHECK (version > 0),
  snapshot_json TEXT NOT NULL CHECK (json_valid(snapshot_json)),
  created_at TEXT NOT NULL,
  UNIQUE (recommendation_id, version)
) STRICT;

CREATE TABLE evidence_ledger (
  evidence_id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('auction_item','property','parcel','recommendation')),
  entity_id TEXT NOT NULL,
  property_id TEXT REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  field_path TEXT NOT NULL,
  value_json TEXT NOT NULL CHECK (json_valid(value_json)),
  source_id TEXT NOT NULL REFERENCES source_registry(source_id) ON DELETE RESTRICT,
  source_snapshot_id TEXT REFERENCES source_snapshots(source_snapshot_id) ON DELETE RESTRICT,
  source_url TEXT,
  source_document_hash TEXT,
  method TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  confidence TEXT NOT NULL CHECK (confidence IN ('HIGH','MEDIUM','LOW','UNKNOWN')),
  epistemic_state TEXT NOT NULL CHECK (epistemic_state IN ('FACT','SIGNAL','ESTIMATE','UNKNOWN')),
  review_state TEXT NOT NULL CHECK (review_state IN ('unreviewed','validated','conflicted','superseded'))
) STRICT;

CREATE TABLE evidence_conflicts (
  conflict_id TEXT PRIMARY KEY,
  property_id TEXT REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  field_path TEXT NOT NULL,
  left_evidence_id TEXT NOT NULL REFERENCES evidence_ledger(evidence_id) ON DELETE RESTRICT,
  right_evidence_id TEXT NOT NULL REFERENCES evidence_ledger(evidence_id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('open','resolved','accepted_variance')),
  resolution_json TEXT CHECK (resolution_json IS NULL OR json_valid(resolution_json)),
  created_at TEXT NOT NULL,
  resolved_at TEXT,
  CHECK (left_evidence_id <> right_evidence_id)
) STRICT;

CREATE TABLE human_escalations (
  escalation_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  escalation_type TEXT NOT NULL CHECK (escalation_type IN ('title','inspection','zoning','legal','environmental','other')),
  status TEXT NOT NULL CHECK (status IN ('open','in_progress','resolved','waived')),
  what_is_missing TEXT NOT NULL,
  why_automation_cannot_establish TEXT NOT NULL,
  escalation_json TEXT NOT NULL CHECK (json_valid(escalation_json)),
  created_at TEXT NOT NULL,
  resolved_at TEXT
) STRICT;

CREATE TABLE operator_actions (
  action_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  action_type TEXT NOT NULL CHECK (action_type IN ('override_bid_cap','acknowledge_gate','waive_gate','add_note','add_evidence','promote','unpublish','reject','reconsider')),
  reason TEXT NOT NULL,
  actor TEXT NOT NULL,
  action_json TEXT NOT NULL CHECK (json_valid(action_json)),
  occurred_at TEXT NOT NULL
) STRICT;

CREATE TABLE operator_notes (
  note_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  actor TEXT NOT NULL,
  note_text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  supersedes_note_id TEXT REFERENCES operator_notes(note_id) ON DELETE RESTRICT
) STRICT;

CREATE TABLE promotion_snapshots (
  promotion_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  schema_version TEXT NOT NULL,
  envelope_json TEXT NOT NULL CHECK (json_valid(envelope_json)),
  promoted_at TEXT NOT NULL,
  promoted_by TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('promoted','updated','unpublished','retired')),
  firestore_document_id TEXT,
  warnings_json TEXT NOT NULL CHECK (json_valid(warnings_json)),
  blocking_gates_json TEXT NOT NULL CHECK (json_valid(blocking_gates_json)),
  unpublished_at TEXT
) STRICT;

CREATE TABLE audit_log (
  log_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  version TEXT,
  detail_json TEXT NOT NULL CHECK (json_valid(detail_json)),
  occurred_at TEXT NOT NULL
) STRICT;

CREATE TABLE export_jobs (
  export_job_id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES property_identity(property_id) ON DELETE RESTRICT,
  format TEXT NOT NULL CHECK (format IN ('html','csv','xlsx','json','markdown')),
  schema_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued','running','succeeded','failed')),
  requested_by TEXT NOT NULL,
  requested_at TEXT NOT NULL,
  completed_at TEXT,
  envelope_snapshot_json TEXT NOT NULL CHECK (json_valid(envelope_snapshot_json))
) STRICT;

CREATE TABLE export_artifacts (
  export_artifact_id TEXT PRIMARY KEY,
  export_job_id TEXT NOT NULL REFERENCES export_jobs(export_job_id) ON DELETE RESTRICT,
  content_hash TEXT NOT NULL,
  storage_reference TEXT NOT NULL,
  created_at TEXT NOT NULL,
  artifact_json TEXT NOT NULL CHECK (json_valid(artifact_json)),
  UNIQUE (export_job_id, content_hash)
) STRICT;

CREATE TRIGGER evidence_ledger_no_update
BEFORE UPDATE ON evidence_ledger BEGIN
  SELECT RAISE(ABORT, 'evidence_ledger is append-only');
END;

CREATE TRIGGER evidence_ledger_no_delete
BEFORE DELETE ON evidence_ledger BEGIN
  SELECT RAISE(ABORT, 'evidence_ledger is append-only');
END;

CREATE TRIGGER audit_log_no_update
BEFORE UPDATE ON audit_log BEGIN
  SELECT RAISE(ABORT, 'audit_log is append-only');
END;

CREATE TRIGGER audit_log_no_delete
BEFORE DELETE ON audit_log BEGIN
  SELECT RAISE(ABORT, 'audit_log is append-only');
END;

CREATE TRIGGER recommendation_versions_no_update
BEFORE UPDATE ON recommendation_versions BEGIN
  SELECT RAISE(ABORT, 'recommendation_versions is append-only');
END;

CREATE TRIGGER recommendation_versions_no_delete
BEFORE DELETE ON recommendation_versions BEGIN
  SELECT RAISE(ABORT, 'recommendation_versions is append-only');
END;

CREATE TRIGGER promotion_snapshots_no_update
BEFORE UPDATE ON promotion_snapshots BEGIN
  SELECT RAISE(ABORT, 'promotion_snapshots are append-only');
END;

CREATE TRIGGER promotion_snapshots_no_delete
BEFORE DELETE ON promotion_snapshots BEGIN
  SELECT RAISE(ABORT, 'promotion_snapshots are append-only');
END;

INSERT INTO _schema_meta (
  migration_id,
  schema_version,
  applied_at,
  source_contract,
  source_contract_hash
) VALUES (
  '0001_canonical_research_schema',
  '1.0.0-candidate',
  '2026-09-03T00:00:00Z',
  'src/domain/property-envelope.ts',
  '2ba4bd1dfc2cbbead02e3788ca5375c8cf54241641a65d8e4021416dffa8b9b7'
);

COMMIT;
