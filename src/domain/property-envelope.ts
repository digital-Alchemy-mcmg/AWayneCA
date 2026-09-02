
// ============================================================================
// ASHANTE CANONICAL DATA SPINE — SCHEMA FREEZE v1.0
// ============================================================================
// Authority: Ashante/build-assets/ (Google Drive)
// Sources reconciled:
//   - Ashante — Final Build Architecture & Deployment Contract
//   - Ashante — Final Build Architecture & Agent Handoff (both versions)
//   - ashante_wayne_county_backend_moscow_report.md
//   - ashante_wayne_county_data_endpoint_feasibility_and_constraint_mitigation.md
//   - SXV8-Risk-Fidelity-MoSCoW.md
//   - SXV8-Agent-Orchestration-Strategy.md
//   - Target Event.txt
//   - commons.txt
//
// This file is the SINGLE SOURCE OF TRUTH for all Ashante domain types.
// Desktop, promotion, Firestore, mobile, and HTML export consume this contract.
// Database-specific representations are PROJECTIONS of these types.
// ============================================================================

// ─── PRIMITIVES & ENUMS ─────────────────────────────────────────────────────

/** ISO-8601 datetime string */
type ISODateTime = string;

/** ISO-8601 date string */
type ISODate = string;

/** USD currency amount in whole cents or decimal dollars */
type USDAmount = number;

/** Unique internal identifier */
type AshID = string;

// ─── CONFIDENCE & PROVENANCE ────────────────────────────────────────────────

/**
 * FACT / SIGNAL / ESTIMATE / UNKNOWN — the four epistemic states.
 * Governs how every data point is displayed and trusted.
 * Source: Deployment Contract §4, Backend MoSCoW §2
 */
export enum EpistemicState {
  FACT = "FACT",
  SIGNAL = "SIGNAL",
  ESTIMATE = "ESTIMATE",
  UNKNOWN = "UNKNOWN",
}

export enum Confidence {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
  UNRESOLVED = "unresolved",
}

/**
 * Per-field fidelity companions.
 * Source: SXV8-Risk-Fidelity-MoSCoW §Part 2
 */
export interface FieldProvenance {
  source_id: string;
  source_url: string | null;
  source_document_hash: string | null;
  method: EvidenceMethod;
  captured_at: ISODateTime;
  source_effective_date: ISODateTime | null;
  confidence: Confidence;
  epistemic_state: EpistemicState;
  stale_after: ISODateTime | null;
  freshness_status: "current" | "stale" | "expired";
}

// ─── FIDELITY STATUS ────────────────────────────────────────────────────────

/**
 * Per-property fidelity rollup.
 * Source: SXV8-Risk-Fidelity-MoSCoW §Part 2 "Fidelity isn't binary"
 */
export enum FidelityStatus {
  VERIFIED = "verified",
  NEEDS_REVERIFY = "needs_reverify",
  FLAGGED = "flagged",
  INCOMPLETE = "incomplete",
  UNRESOLVED = "unresolved",
}

// ─── ASSET CLASSIFICATION ───────────────────────────────────────────────────

/**
 * Canonical asset classes.
 * Source: Backend MoSCoW §5 "Canonical taxonomy"
 */
export enum AssetClass {
  SINGLE_FAMILY = "single_family",
  TWO_FAMILY_FLAT = "two_family_flat",
  DUPLEX_SIDE_BY_SIDE = "duplex_side_by_side",
  TOWNHOUSE = "townhouse",
  MULTIFAMILY_3_PLUS = "multifamily_3_plus",
  MIXED_USE = "mixed_use",
  COMMERCIAL = "commercial",
  VACANT_LOT = "vacant_lot",
  DEMOLISHED_OR_UNCERTAIN = "demolished_or_uncertain",
  UNKNOWN = "unknown",
}

/**
 * Structure/improvement status.
 * Source: Backend MoSCoW M-07
 */
export enum StructureStatus {
  IMPROVED_PROPERTY = "improved_property",
  VACANT_LOT = "vacant_lot",
  DEMOLISHED_OR_UNCERTAIN = "demolished_or_uncertain",
  UNKNOWN = "unknown",
}

// ─── STRATEGY & RECOMMENDATION ──────────────────────────────────────────────

/**
 * Recommended actions.
 * Source: Backend MoSCoW §5 "Canonical taxonomy"
 */
export enum RecommendedAction {
  DO_NOT_BID = "do_not_bid",
  WATCH = "watch",
  FLIP = "flip",
  HOLD_RENTAL = "hold_rental",
  OWNER_OCCUPY = "owner_occupy",
  LAND_HOLD = "land_hold",
  LAND_ACTIVATION = "land_activation",
  ASSEMBLAGE = "assemblage",
  NEEDS_RESEARCH = "needs_research",
}

/**
 * Decision states for the recommendation lifecycle.
 * Source: Backend MoSCoW "Must-have recommendation contract"
 */
export enum DecisionState {
  RESEARCH = "research",
  FEASIBILITY = "feasibility",
  FINANCE = "finance",
  AUCTION_READY = "auction_ready",
  BLOCKED = "blocked",
  STALE = "stale",
}

// ─── REVIEW GATES ───────────────────────────────────────────────────────────

/**
 * Review gate types — blocking and warning.
 * Source: Backend MoSCoW §5 "Canonical taxonomy" + §7 "Recommendation gate rules"
 */
export enum ReviewGateType {
  IDENTITY_MATCH = "identity_match",
  AUCTION_STATUS_FRESH = "auction_status_fresh",
  TITLE_PROFESSIONAL_REVIEW = "title_professional_review",
  COURT_RECORD_REVIEW = "court_record_review",
  ZONING_VERIFICATION = "zoning_verification",
  CONDITION_REVIEW = "condition_review",
  OCCUPANCY_REVIEW = "occupancy_review",
  ENVIRONMENTAL_REVIEW = "environmental_review",
  MARKET_EVIDENCE_SUFFICIENT = "market_evidence_sufficient",
  FINANCE_SCENARIO_COMPLETE = "finance_scenario_complete",
  OPERATOR_ACKNOWLEDGMENT = "operator_acknowledgment",
}

export interface ReviewGate {
  gate_type: ReviewGateType;
  severity: "blocking" | "warning";
  status: "open" | "passed" | "failed" | "waived_with_reason";
  reason: string | null;
  evidence_ids: AshID[];
  reviewed_at: ISODateTime | null;
  reviewed_by: string | null;
}

// ─── SOURCE HEALTH ──────────────────────────────────────────────────────────

/**
 * Source operational status.
 * Source: Deployment Contract §9, Agent Handoff §8
 */
export enum SourceOperationalStatus {
  AVAILABLE = "AVAILABLE",
  DEGRADED = "DEGRADED",
  UNAVAILABLE = "UNAVAILABLE",
  HUMAN_ONLY = "HUMAN_ONLY",
  RETIRED = "RETIRED",
}

/**
 * Authority rank for source precedence.
 * Source: Feasibility Matrix "Required connector rules"
 */
export enum AuthorityRank {
  OFFICIAL_GOVERNMENT = "official_government",
  OFFICIAL_MUNICIPAL = "official_municipal",
  PUBLIC_AUTHORITATIVE = "public_authoritative",
  THIRD_PARTY_ENRICHMENT = "third_party_enrichment",
  OPERATOR_SUPPLIED = "operator_supplied",
  AI_DERIVED = "ai_derived",
}

export enum AccessMode {
  API = "api",
  ARCGIS_REST = "arcgis_rest",
  BULK_DOWNLOAD = "bulk_download",
  OFFICIAL_EXPORT = "official_export",
  OFFICIAL_PORTAL_SNAPSHOT = "official_portal_snapshot",
  PERMITTED_SNAPSHOT = "permitted_snapshot",
  MANUAL_REVIEW = "manual_review",
}

/**
 * Source registry entry.
 * Source: Backend MoSCoW §6, Feasibility Matrix §1-8
 */
export interface SourceRegistryEntry {
  source_id: string;
  display_name: string;
  authority_rank: AuthorityRank;
  owner: string;
  access_mode: AccessMode;
  endpoint_url: string | null; // stored in configuration, not in code
  api_status: "verified" | "unverified" | "not_available";
  download_status: "available" | "available_with_caveats" | "not_available";
  auth_type: "none" | "api_key" | "oauth" | "manual";
  license_or_terms_url: string | null;
  refresh_cadence: "realtime" | "daily" | "weekly" | "manual" | "event_driven";
  rate_limit_policy: string;
  schema_contract_version: string;
  last_health_check_at: ISODateTime | null;
  operational_status: SourceOperationalStatus;
  last_successful_retrieval: ISODateTime | null;
  last_attempted_retrieval: ISODateTime | null;
  failure_reason: string | null;
  coverage_municipalities: string[];
}

// ─── EVIDENCE ───────────────────────────────────────────────────────────────

export type EvidenceMethod =
  | "api"
  | "arcgis_rest"
  | "bulk_download"
  | "official_export"
  | "permitted_snapshot"
  | "manual_review"
  | "operator_supplied"
  | "ai_observation";

export type EvidenceEntityType =
  | "auction_item"
  | "property"
  | "parcel"
  | "recommendation";

export type EvidenceReviewState =
  | "unreviewed"
  | "validated"
  | "conflicted"
  | "superseded";

/**
 * Immutable evidence ledger record.
 * Source: Backend MoSCoW M-03, "Must-have data contracts"
 */
export interface Evidence {
  evidence_id: AshID;
  entity_type: EvidenceEntityType;
  entity_id: AshID;
  field_path: string;
  value_json: unknown;
  source_id: string;
  source_url: string | null;
  source_document_hash: string | null;
  method: EvidenceMethod;
  captured_at: ISODateTime;
  source_effective_date: ISODateTime | null;
  confidence: Confidence;
  epistemic_state: EpistemicState;
  review_state: EvidenceReviewState;
  reviewer: string | null;
  reviewed_at: ISODateTime | null;
}

// ─── TITLE STATUS ───────────────────────────────────────────────────────────

/**
 * Title research status enum.
 * Source: Feasibility Matrix §3 "Required status enum"
 * CRITICAL: "clear", "clean", "marketable", "insurable" are FORBIDDEN values.
 */
export enum TitleStatus {
  NOT_RESEARCHED = "not_researched",
  PUBLIC_INDEX_REVIEWED_NO_OBVIOUS_FLAG = "public_index_reviewed_no_obvious_flag",
  PUBLIC_INDEX_FLAGGED = "public_index_flagged",
  TITLE_COMPANY_REVIEW_PENDING = "title_company_review_pending",
  PROFESSIONAL_REPORT_RECEIVED = "professional_report_received",
  NOT_INSURABLE_OR_UNRESOLVED = "not_insurable_or_unresolved",
}

// The system MUST NOT produce these values anywhere:
// "clear" | "clean" | "marketable" | "insurable"

// ─── AUCTION ITEM ───────────────────────────────────────────────────────────

export type AuctionItemStatus = "listed" | "removed" | "sold" | "unknown";

/**
 * Raw auction item from the official catalog.
 * Source: Backend MoSCoW M-01, "Must-have data contracts"
 */
export interface AuctionItem {
  auction_item_id: string;
  parcel_id_raw: string | null;
  parcel_id_normalized: string | null;
  address_raw: string | null;
  address_normalized: string | null;
  municipality: string | null;
  zip: string | null;
  status: AuctionItemStatus;
  batch_id: string | null;
  auction_start_at: ISODateTime | null;
  minimum_bid: USDAmount | null;
  current_bid: USDAmount | null;
  sold_price: USDAmount | null;
  source_snapshot_id: AshID;
  source_page_reference: string | null;
  raw_fields: Record<string, unknown>;
  captured_at: ISODateTime;
}

// ─── PROPERTY IDENTITY ──────────────────────────────────────────────────────

/**
 * Stable internal property identity.
 * Source: Deployment Contract §5, Backend MoSCoW M-02
 *
 * Immutable internal ID independent of auction IDs, address formatting,
 * or source-specific identifiers.
 */
export type IdentityMatchStatus =
  | "verified"
  | "probable"
  | "ambiguous"
  | "conflict"
  | "unresolved";

export interface PropertyIdentity {
  property_id: AshID; // Immutable Ashante internal ID
  auction_item_ids: string[];
  parcel_id_normalized: string | null;
  parcel_id_raw_variants: string[];
  address_normalized: string | null;
  address_raw_variants: string[];
  municipality: string | null;
  zip: string | null;
  gis_identifiers: string[];
  match_status: IdentityMatchStatus;
  match_confidence: Confidence;
  identity_evidence_ids: AshID[];
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

// ─── PARCEL & GIS ───────────────────────────────────────────────────────────

export interface ParcelAttributes {
  parcel_id: string;
  property_id: AshID;
  geometry_wkt: string | null;
  lot_area_sqft: number | null;
  lot_frontage_ft: number | null;
  lot_depth_ft: number | null;
  legal_description: string | null;
  assessor_property_class: string | null;
  assessed_value_land: USDAmount | null;
  assessed_value_building: USDAmount | null;
  assessed_value_total: USDAmount | null;
  taxable_value: USDAmount | null;
  source_id: string;
  source_effective_date: ISODateTime | null;
  captured_at: ISODateTime;
}

// ─── PROPERTY CHARACTERISTICS ───────────────────────────────────────────────

export interface PropertyCharacteristics {
  property_id: AshID;
  asset_class: AssetClass;
  asset_class_confidence: Confidence;
  asset_class_raw_label: string | null;
  structure_status: StructureStatus;
  structure_status_signals: string[];
  exterior_material: string | null; // e.g., "brick", "brick_and_siding", "frame"
  exterior_material_confidence: Confidence;
  year_built: number | null;
  total_sqft: number | null;
  unit_count: number | null;
  stories: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  has_basement: boolean | null;
  has_garage: boolean | null;
  roof_condition_known: boolean;
  foundation_condition_known: boolean;
  occupancy_status: "occupied" | "vacant" | "unknown";
  occupancy_confidence: Confidence;
}

// ─── ZONING & LAND USE ──────────────────────────────────────────────────────

export interface ZoningRecord {
  property_id: AshID;
  zoning_district: string | null;
  zoning_overlay: string | null;
  future_land_use: string | null;
  permitted_uses: string[];
  modular_container_eligible: boolean | null;
  zoning_verified: boolean;
  zoning_source_id: string | null;
  zoning_verified_at: ISODateTime | null;
  municipality: string;
}

// ─── ENVIRONMENTAL & FLOOD ──────────────────────────────────────────────────

export interface EnvironmentalFlags {
  property_id: AshID;
  fema_flood_zone: string | null;
  fema_map_panel: string | null;
  fema_effective_date: ISODate | null;
  epa_facility_proximity: boolean | null;
  epa_facility_ids: string[];
  brownfield_flag: boolean | null;
  environmental_gate_required: boolean;
  source_ids: string[];
  captured_at: ISODateTime;
}

// ─── IMAGERY OBSERVATIONS ───────────────────────────────────────────────────

/**
 * Imagery-derived observations with hard confidence ceiling.
 * Source: Feasibility Matrix §5, Risk-Fidelity MoSCoW Constraint 2
 * 
 * RULE: Automated condition confidence is CAPPED at MEDIUM until
 * human field review or qualified inspector report.
 */
export interface ImageryObservation {
  observation_id: AshID;
  property_id: AshID;
  observation_type: "street_imagery_triage" | "aerial_triage" | "operator_drive_by";
  provider: string;
  capture_date_visible: ISODate | null;
  observed: string[]; // e.g., ["brick_exterior_likely", "windows_intact"]
  not_observed: string[]; // e.g., ["interior", "foundation", "mechanicals"]
  confidence: Confidence; // CAPPED at MEDIUM for automated
  human_review_required: boolean;
  evidence_id: AshID;
  captured_at: ISODateTime;
}

// ─── MARKET & COMPARABLE EVIDENCE ───────────────────────────────────────────

export interface MarketSale {
  sale_id: AshID;
  parcel_id: string | null;
  address: string | null;
  municipality: string;
  sale_date: ISODate;
  sale_price: USDAmount;
  property_type: AssetClass | null;
  sqft: number | null;
  unit_count: number | null;
  transaction_validity: "arms_length" | "non_arms_length" | "unknown";
  source_id: string;
  source_effective_date: ISODateTime | null;
  captured_at: ISODateTime;
}

export interface ComparableSet {
  comparable_set_id: AshID;
  property_id: AshID;
  comparables: ComparableMember[];
  exit_value_low: USDAmount | null;
  exit_value_base: USDAmount | null;
  exit_value_high: USDAmount | null;
  confidence: Confidence;
  minimum_comp_threshold_met: boolean; // requires ≥3 comps for HIGH
  model_version: string;
  calculated_at: ISODateTime;
}

export interface ComparableMember {
  sale_id: AshID;
  distance_miles: number;
  age_months: number;
  adjustment_notes: string[];
  weight: number;
}

// ─── REPAIR & FINANCE SCENARIOS ─────────────────────────────────────────────

export interface RepairScenario {
  property_id: AshID;
  repair_low: USDAmount;
  repair_base: USDAmount;
  repair_high: USDAmount;
  unknown_condition_contingency: USDAmount;
  scope_description: string;
  input_classification: Record<string, "source_derived" | "operator_entered" | "default" | "unknown">;
  evidence_ids: AshID[];
  calculated_at: ISODateTime;
}

export interface FinanceScenario {
  property_id: AshID;
  loan_product: string | null; // e.g., "Fast 50 Bridge", "Turnus DSCR"
  ltv_ratio: number | null;
  interest_rate: number | null;
  term_months: number | null;
  monthly_payment: USDAmount | null;
  holding_cost_monthly: USDAmount | null;
  financing_cost_total: USDAmount | null;
  dscr_ratio: number | null;
  projected_monthly_rent: USDAmount | null;
  rent_source: string | null;
  rent_confidence: Confidence;
  input_classification: Record<string, "source_derived" | "operator_entered" | "default" | "unknown">;
  calculated_at: ISODateTime;
}

// ─── TITLE & COURT RESEARCH ────────────────────────────────────────────────

export interface TitleResearchCase {
  case_id: AshID;
  property_id: AshID;
  title_status: TitleStatus;
  search_terms: string[];
  result_links: string[];
  red_flags: string[];
  professional_escalation_required: boolean;
  professional_reviewer: string | null;
  legal_title_reserve: USDAmount | null;
  title_insurance_cost_estimate: USDAmount | null;
  time_to_clear_months: number | null;
  evidence_ids: AshID[];
  researched_at: ISODateTime;
  reviewed_by: string | null;
}

export interface CourtResearchCase {
  case_id: AshID;
  property_id: AshID;
  court_name: string;
  docket_number: string | null;
  case_type: string | null;
  parties: string[];
  status_flag: string | null;
  documents_available_online: boolean;
  evidence_ids: AshID[];
  researched_at: ISODateTime;
}

// ─── NEIGHBORHOOD CONTEXT ───────────────────────────────────────────────────

/**
 * Tract/ZIP-level context from Census, Google Data Commons, etc.
 * Source: commons.txt, Feasibility Matrix §7
 */
export interface NeighborhoodContext {
  geography_id: string; // census tract or ZIP
  geography_type: "census_tract" | "census_block_group" | "zip";
  vacancy_rate: number | null;
  owner_occupancy_rate: number | null;
  median_household_income: USDAmount | null;
  median_gross_rent: USDAmount | null;
  poverty_rate: number | null;
  vacancy_5yr_trend: number | null;
  income_5yr_trend: number | null;
  source_dataset: string;
  release_year: number;
  captured_at: ISODateTime;
}

// ─── STRATEGY ───────────────────────────────────────────────────────────────

export interface Strategy {
  property_id: AshID;
  recommended_action: RecommendedAction;
  candidate_actions: RecommendedAction[];
  why: string[]; // evidence-backed reasoning strings
  counter_signals: string[];
  rules_triggered: string[];
  evidence_ids: AshID[];
  model_version: string;
  calculated_at: ISODateTime;
}

// ─── BID PLAN ───────────────────────────────────────────────────────────────

/**
 * Bid formula contract.
 * Source: Backend MoSCoW §5 "Bid formula contract"
 *
 * Hard Max Bid = Conservative Exit Value
 *   - (Repairs + Transaction Costs + Holding Costs + Financing Costs
 *      + Title/Legal Reserve + Contingency + Required Profit)
 *
 * RULES:
 *   - Formula version stored on every recommendation
 *   - Every input identified as source_derived | operator_entered | default | unknown
 *   - Hard cap MUST be null when critical inputs are unknown
 *   - Finance calculations don't begin until research/feasibility gates acknowledged
 *   - Operator override creates a separate event, never replaces computed value
 */
export interface BidPlan {
  bid_plan_id: AshID;
  property_id: AshID;
  target_bid: USDAmount | null;
  hard_max_bid: USDAmount | null;
  currency: "USD";
  formula_version: string;
  scenario: {
    exit_value_low: USDAmount | null;
    exit_value_base: USDAmount | null;
    exit_value_high: USDAmount | null;
    repair_low: USDAmount | null;
    repair_base: USDAmount | null;
    repair_high: USDAmount | null;
    transaction_costs: USDAmount | null;
    holding_cost_base: USDAmount | null;
    financing_cost_base: USDAmount | null;
    legal_title_reserve: USDAmount | null;
    title_insurance_cost_estimate: USDAmount | null;
    contingency: USDAmount | null;
    required_profit: USDAmount | null;
  };
  input_classification: Record<string, "source_derived" | "operator_entered" | "default" | "unknown">;
  sensitivity_results: Record<string, unknown> | null;
  blocking_gates: ReviewGateType[];
  warning_gates: ReviewGateType[];
  evidence_ids: AshID[];
  calculated_at: ISODateTime;
  fresh_until: ISODateTime | null;
}

// ─── RECOMMENDATION ─────────────────────────────────────────────────────────

/**
 * Complete recommendation record.
 * Source: Backend MoSCoW "Must-have recommendation contract"
 */
export interface Recommendation {
  recommendation_id: AshID;
  property_id: AshID;
  model_version: string;
  decision_state: DecisionState;
  strategy: Strategy;
  bid_plan: BidPlan;
  risks: {
    blocking: ReviewGate[];
    warnings: ReviewGate[];
    reviewed_at: ISODateTime | null;
  };
  explanation: {
    why: string[];
    counter_signals: string[];
    missing_information: string[];
    evidence_count: number;
  };
  fidelity_status: FidelityStatus;
  calculated_at: ISODateTime;
  fresh_until: ISODateTime | null;
}

// ─── HUMAN ESCALATION ───────────────────────────────────────────────────────

/**
 * Human escalation record.
 * Source: Deployment Contract §10, Agent Handoff §8
 */
export interface HumanEscalation {
  escalation_id: AshID;
  property_id: AshID;
  what_is_missing: string;
  why_automation_cannot_establish: string;
  official_destination: string | null;
  identifiers_needed: string[];
  information_to_bring_back: string[];
  escalation_type: "title" | "inspection" | "zoning" | "legal" | "environmental" | "other";
  status: "open" | "in_progress" | "resolved" | "waived";
  operator_result: OperatorEvidence | null;
  created_at: ISODateTime;
  resolved_at: ISODateTime | null;
}

// ─── OPERATOR ACTIONS ───────────────────────────────────────────────────────

export interface OperatorEvidence {
  evidence_id: AshID;
  property_id: AshID;
  source_description: string;
  finding: string;
  attribution: string;
  timestamp: ISODateTime;
  provenance: string;
  evidence_artifacts: string[]; // file references
}

export interface OperatorAction {
  action_id: AshID;
  property_id: AshID;
  action_type:
    | "override_bid_cap"
    | "acknowledge_gate"
    | "waive_gate"
    | "add_note"
    | "add_evidence"
    | "promote"
    | "unpublish"
    | "reject"
    | "reconsider";
  reason: string;
  previous_value: unknown | null;
  new_value: unknown | null;
  timestamp: ISODateTime;
  actor: string;
}

// ─── OPERATOR PREFERENCES ───────────────────────────────────────────────────

/**
 * Ashante's explicit preference profile.
 * Source: Target Event.txt, Backend MoSCoW M-14
 */
export interface OperatorPreferences {
  profile_id: AshID;
  version: number;
  preferences: {
    brick_required: boolean;
    max_rehab_budget: USDAmount;
    rehab_scope: "cosmetic_only";
    roof_replacement_tolerance: false;
    foundation_defect_tolerance: false;
    target_property_types: AssetClass[];
    geographic_focus_zips: string[];
    geographic_focus_municipalities: string[];
    hold_vs_flip_split: string; // e.g., "1 hold / 2 flip"
    acquisition_target_count: number;
    shortlist_target_count: number;
    lot_strategy_separate: boolean;
    multifamily_hold_preference: boolean;
    financing_products: string[];
  };
  feedback_events: PreferenceFeedback[];
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface PreferenceFeedback {
  feedback_id: AshID;
  property_id: AshID;
  signal: "thumbs_up" | "thumbs_down";
  reason: string | null;
  timestamp: ISODateTime;
}

// ─── PROMOTION ──────────────────────────────────────────────────────────────

/**
 * Promotion snapshot — the desktop→mobile boundary.
 * Source: Deployment Contract §7, Agent Handoff §6
 *
 * RULES:
 *   - Validates complete Property Envelope before publishing
 *   - Stamps schema version and promotion time
 *   - Preserves all active warnings and blocking gates
 *   - Promotion is NOT certification
 *   - Removing from mobile does NOT delete research history
 */
export interface PromotionSnapshot {
  promotion_id: AshID;
  property_id: AshID;
  envelope: PropertyEnvelope;
  schema_version: string;
  promoted_at: ISODateTime;
  promoted_by: string;
  stale_evidence: string[];
  missing_evidence: string[];
  active_warnings: string[];
  blocking_gates: ReviewGateType[];
  firestore_document_id: string | null;
  status: "promoted" | "updated" | "unpublished" | "retired";
  unpublished_at: ISODateTime | null;
}

// ─── INGESTION STATE MACHINE ────────────────────────────────────────────────

/**
 * Property processing states.
 * Source: Backend MoSCoW §7 "Ingestion state machine"
 */
export enum IngestionState {
  DISCOVERED = "DISCOVERED",
  RAW_CAPTURED = "RAW_CAPTURED",
  PARSED = "PARSED",
  NORMALIZED = "NORMALIZED",
  IDENTITY_RESOLVED = "IDENTITY_RESOLVED",
  IDENTITY_EXCEPTION = "IDENTITY_EXCEPTION",
  ENRICHMENT_QUEUED = "ENRICHMENT_QUEUED",
  FEASIBILITY_READY = "FEASIBILITY_READY",
  RISK_GATED = "RISK_GATED",
  RECOMMENDED = "RECOMMENDED",
  BLOCKED = "BLOCKED",
  STALE = "STALE",
  ARCHIVED = "ARCHIVED",
}

// ─── AUDIT LOG ──────────────────────────────────────────────────────────────

/**
 * Append-only audit log.
 * Source: Backend MoSCoW M-15
 */
export interface AuditLogEntry {
  log_id: AshID;
  event_type:
    | "ingestion"
    | "evidence_update"
    | "rule_execution"
    | "recommendation_change"
    | "manual_override"
    | "operator_acknowledgment"
    | "promotion"
    | "unpublish"
    | "source_health_change"
    | "schema_drift_detected"
    | "export";
  entity_type: string;
  entity_id: AshID;
  actor: string;
  version: string | null;
  detail: Record<string, unknown>;
  timestamp: ISODateTime;
}

// ─── EXPORT METADATA ────────────────────────────────────────────────────────

/**
 * Export record for HTML/CSV/XLSX artifacts.
 * Source: Deployment Contract §11
 */
export interface ExportRecord {
  export_id: AshID;
  property_id: AshID;
  format: "html" | "csv" | "xlsx" | "json" | "markdown";
  schema_version: string;
  envelope_snapshot: PropertyEnvelope;
  exported_at: ISODateTime;
  exported_by: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// THE CANONICAL PROPERTY ENVELOPE — THE SYSTEM INVARIANT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * THE CANONICAL PROPERTY ENVELOPE
 *
 * This is the central invariant of Ashante. One contract shared across:
 *   - Desktop Research Workbench (read + write)
 *   - Promotion Gate (validate + snapshot)
 *   - Firebase/Firestore (promoted projection)
 *   - Mobile Field Cockpit (read + field actions)
 *   - HTML Export (serialize)
 *
 * Source: Deployment Contract §4, Agent Handoff §4, Backend MoSCoW §10
 *
 * No surface may redefine a property into an incompatible representation.
 * Database representations are PROJECTIONS of this contract.
 */
export interface PropertyEnvelope {
  // ── Schema ──
  schema_version: string;
  envelope_timestamp: ISODateTime;

  // ── Identity ──
  identity: PropertyIdentity;

  // ── Auction ──
  auction: {
    auction_item_id: string;
    status: AuctionItemStatus;
    batch_id: string | null;
    auction_start_at: ISODateTime | null;
    minimum_bid: USDAmount | null;
    current_bid: USDAmount | null;
    sold_price: USDAmount | null;
    deposit_tier: USDAmount | null;
    is_premium: boolean | null;
    is_bundle: boolean | null;
    bundle_members: string[] | null;
    status_checked_at: ISODateTime | null;
    fresh_until: ISODateTime | null;
    is_stale: boolean;
  };

  // ── Classification ──
  classification: {
    asset_class: AssetClass;
    asset_class_confidence: Confidence;
    asset_class_raw_label: string | null;
    structure_status: StructureStatus;
    occupancy_status: "occupied" | "vacant" | "unknown";
  };

  // ── Property Characteristics ──
  characteristics: PropertyCharacteristics;

  // ── Parcel & GIS ──
  parcel: ParcelAttributes | null;

  // ── Zoning & Land Use ──
  zoning: ZoningRecord | null;

  // ── Environmental & Flood ──
  environmental: EnvironmentalFlags | null;

  // ── Neighborhood Context ──
  neighborhood: NeighborhoodContext | null;

  // ── Strategy ──
  strategy: Strategy;

  // ── Bid Plan ──
  bid_plan: BidPlan;

  // ── Scenarios ──
  scenarios: {
    repair: RepairScenario | null;
    finance: FinanceScenario | null;
    comparable_set: ComparableSet | null;
  };

  // ── Risks & Gates ──
  risks: {
    blocking_gates: ReviewGate[];
    warning_gates: ReviewGate[];
    reviewed_at: ISODateTime | null;
  };

  // ── Title & Legal ──
  title: TitleResearchCase | null;
  court_cases: CourtResearchCase[];

  // ── Imagery Observations ──
  imagery: ImageryObservation[];

  // ── Evidence ──
  evidence_summary: {
    total_evidence_count: number;
    high_confidence_count: number;
    conflicted_count: number;
    evidence_ids: AshID[];
  };

  // ── Source Health ──
  source_health: {
    sources_used: string[];
    degraded_sources: string[];
    unavailable_sources: string[];
    last_source_check: ISODateTime | null;
  };

  // ── Confidence & Fidelity ──
  confidence: Confidence;
  fidelity_status: FidelityStatus;
  epistemic_summary: {
    fact_count: number;
    signal_count: number;
    estimate_count: number;
    unknown_count: number;
  };

  // ── Missing Information ──
  missing_information: string[];
  known_unknowns: string[];

  // ── Human Escalation ──
  human_escalations: HumanEscalation[];

  // ── Recommendation ──
  recommendation: Recommendation;

  // ── Operator State ──
  operator: {
    notes: string[];
    decisions: OperatorAction[];
    feedback: PreferenceFeedback[];
  };

  // ── Decision State ──
  decision_state: DecisionState;
  ingestion_state: IngestionState;

  // ── Promotion State (populated only after promotion) ──
  promotion: {
    is_promoted: boolean;
    promoted_at: ISODateTime | null;
    promotion_id: AshID | null;
    last_synced_at: ISODateTime | null;
  };

  // ── Timestamps ──
  created_at: ISODateTime;
  updated_at: ISODateTime;
  last_enriched_at: ISODateTime | null;
  last_scored_at: ISODateTime | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// SQLITE TABLE MAP — RELATIONAL PROJECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Core tables for SQLite research database.
 * Source: Backend MoSCoW §5 "Core tables"
 *
 * These are PROJECTIONS of the canonical TypeScript contracts above.
 * The TypeScript types are authoritative; tables serve them.
 */
export const SQLITE_TABLE_MANIFEST = [
  // ── Source Management ──
  "source_registry",
  "source_snapshots",
  "source_schema_versions",
  "source_fetch_runs",

  // ── Auction ──
  "auction_items",
  "auction_item_status_history",
  "auction_events",
  "auction_outcomes",

  // ── Identity ──
  "property_identity",
  "identity_match_exceptions",

  // ── Parcel & GIS ──
  "parcel_geometries",
  "parcel_attributes",

  // ── Municipal ──
  "municipal_coverage_registry",
  "zoning_records",
  "permit_records",
  "demolition_records",
  "code_records",

  // ── Market ──
  "market_sales",
  "comparable_sets",
  "comparable_members",
  "rent_signals",

  // ── Scenarios ──
  "repair_scenarios",
  "finance_scenarios",

  // ── Environment ──
  "environmental_flags",
  "flood_flags",

  // ── Title & Court ──
  "title_research_cases",
  "court_research_cases",

  // ── Imagery ──
  "imagery_observations",

  // ── Neighborhood ──
  "neighborhood_context",

  // ── Preferences ──
  "preference_profiles",
  "preference_feedback",

  // ── Risk & Gates ──
  "risk_flags",
  "review_gates",

  // ── Recommendations ──
  "recommendations",
  "recommendation_versions",
  "bid_plans",

  // ── Strategy ──
  "strategies",

  // ── Evidence ──
  "evidence_ledger",
  "evidence_conflicts",

  // ── Human Escalation ──
  "human_escalations",

  // ── Operator ──
  "operator_actions",
  "operator_notes",

  // ── Promotion ──
  "promotion_snapshots",

  // ── Audit ──
  "audit_log",

  // ── Export ──
  "export_jobs",
  "export_artifacts",
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL SOURCE ADAPTER REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Source adapters required for production.
 * Source: Backend MoSCoW §6, Feasibility Matrix §1-8
 */
export const INITIAL_SOURCE_ADAPTERS: Array<{
  source_id: string;
  data_use: string;
  authority_rank: AuthorityRank;
  access_posture: string;
}> = [
  {
    source_id: "wayne_treasurer_auction",
    data_use: "Auction universe and statuses",
    authority_rank: AuthorityRank.OFFICIAL_GOVERNMENT,
    access_posture: "Official portal/PDF; API not assumed",
  },
  {
    source_id: "wayne_gis_parcel",
    data_use: "Geometry and property identity",
    authority_rank: AuthorityRank.OFFICIAL_GOVERNMENT,
    access_posture: "Public viewer/download; bulk data needs date validation",
  },
  {
    source_id: "detroit_demolition_permits",
    data_use: "Structure/removal signals",
    authority_rank: AuthorityRank.OFFICIAL_MUNICIPAL,
    access_posture: "Public Detroit Open Data / ArcGIS",
  },
  {
    source_id: "detroit_property_sales",
    data_use: "Public sale comps",
    authority_rank: AuthorityRank.OFFICIAL_MUNICIPAL,
    access_posture: "Public Detroit Open Data",
  },
  {
    source_id: "detroit_zoning",
    data_use: "Land-use classification",
    authority_rank: AuthorityRank.OFFICIAL_MUNICIPAL,
    access_posture: "Official lookup/ordinance",
  },
  {
    source_id: "wayne_register_of_deeds",
    data_use: "Recorded-record research",
    authority_rank: AuthorityRank.OFFICIAL_GOVERNMENT,
    access_posture: "Online index; no bulk/API assumed",
  },
  {
    source_id: "third_circuit_micourt",
    data_use: "Court/docket flags",
    authority_rank: AuthorityRank.OFFICIAL_GOVERNMENT,
    access_posture: "Public search but partial document access",
  },
  {
    source_id: "fema_nfhl",
    data_use: "Flood context",
    authority_rank: AuthorityRank.PUBLIC_AUTHORITATIVE,
    access_posture: "Public REST/WFS",
  },
  {
    source_id: "epa_envirofacts",
    data_use: "Environmental context",
    authority_rank: AuthorityRank.PUBLIC_AUTHORITATIVE,
    access_posture: "Public API/download",
  },
  {
    source_id: "census_acs",
    data_use: "Contextual demographics/housing",
    authority_rank: AuthorityRank.PUBLIC_AUTHORITATIVE,
    access_posture: "Public API/download",
  },
  {
    source_id: "google_data_commons",
    data_use: "Neighborhood vacancy/income/rent trends",
    authority_rank: AuthorityRank.PUBLIC_AUTHORITATIVE,
    access_posture: "Free Python API",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// FORBIDDEN VALUES — SYSTEM-WIDE SAFETY CONSTRAINTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Values the system MUST NEVER produce anywhere.
 * Source: Feasibility Matrix §3, Backend MoSCoW W-01 through W-10,
 *         Risk-Fidelity MoSCoW §Part 1
 */
export const FORBIDDEN_OUTPUT_VALUES = {
  title: ["clear", "clean", "marketable", "insurable"],
  condition: ["inspected", "certified", "guaranteed"],
  valuation: ["guaranteed_arv", "appraised"],
  auction: ["auto_bid_placed", "auto_purchased"],
  legal: ["no_liens", "title_clear", "quiet_title_resolved"],
  lending: ["approved", "pre_approved", "eligible"],
} as const;

/**
 * System-wide prohibited actions.
 * Source: Backend MoSCoW §2, Deployment Contract §14
 */
export const PROHIBITED_ACTIONS = [
  "No automatic bid placement or auction-account control",
  "No AI assertion that title is clear, marketable, or insurable",
  "No claim that exterior imagery establishes interior/structural/occupancy condition",
  "No claim of loan approval, lender eligibility, or underwriting outcome",
  "No scraping of gated/prohibited/credentialed systems without documented authorization",
  "No use of protected-class data or proxy variables to target/exclude people or neighborhoods",
] as const;
