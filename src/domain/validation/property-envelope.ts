
// ============================================================================
// ASHANTE CANONICAL ZOD VALIDATORS — v1.0.0
// ============================================================================
// Generated from: Ashante Canonical Data Spine — Schema Freeze v1.0
// Authority chain: build-assets/ → Data Spine → these validators
//
// RULES:
//   1. Every validator mirrors the frozen TypeScript contract EXACTLY.
//   2. Do not add fields. Do not relax constraints. Do not invent defaults.
//   3. Nullable fields use .nullable(). Missing/optional fields do not exist
//      in the frozen contract — if the TS type says `string | null`, the Zod
//      schema says z.string().nullable(), NOT z.string().optional().
//   4. ISO-8601 patterns enforced at the boundary.
//   5. FORBIDDEN_OUTPUT_VALUES enforced via .refine() where applicable.
// ============================================================================

import { z } from "zod";

import {
  AccessMode,
  AssetClass,
  AuthorityRank,
  Confidence,
  DecisionState,
  EpistemicState,
  FidelityStatus,
  IngestionState,
  RecommendedAction,
  ReviewGateType,
  SourceOperationalStatus,
  StructureStatus,
  TitleStatus,
} from "../property-envelope";

// ─── SCHEMA VERSION ─────────────────────────────────────────────────────────

export const SCHEMA_VERSION = "1.0.0" as const;

// ─── PRIMITIVES ─────────────────────────────────────────────────────────────

/**
 * ISO-8601 datetime: YYYY-MM-DDTHH:mm:ss or with fractional seconds/timezone.
 * Accepts: 2026-09-01T04:00:00Z, 2026-09-01T04:00:00.000Z,
 *          2026-09-01T04:00:00+00:00, 2026-09-01T04:00:00
 */
const ISODateTimeSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/,
    "Must be ISO-8601 datetime (YYYY-MM-DDTHH:mm:ss with optional fractional seconds and timezone)"
  );

/** ISO-8601 date: YYYY-MM-DD */
const ISODateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be ISO-8601 date (YYYY-MM-DD)");

/** USD amount — whole cents or decimal dollars, finite, non-NaN */
const USDAmountSchema = z.number().finite();

/** Ashante internal identifier — non-empty string */
const AshIDSchema = z.string().min(1, "AshID must be non-empty");

// ─── ENUMS ──────────────────────────────────────────────────────────────────

export const EpistemicStateSchema = z.enum(EpistemicState);

export const ConfidenceSchema = z.enum(Confidence);

export const FidelityStatusSchema = z.enum(FidelityStatus);

export const AssetClassSchema = z.enum(AssetClass);

export const StructureStatusSchema = z.enum(StructureStatus);

export const RecommendedActionSchema = z.enum(RecommendedAction);

export const DecisionStateSchema = z.enum(DecisionState);

export const ReviewGateTypeSchema = z.enum(ReviewGateType);

export const SourceOperationalStatusSchema = z.enum(SourceOperationalStatus);

export const AuthorityRankSchema = z.enum(AuthorityRank);

export const AccessModeSchema = z.enum(AccessMode);

export const AuctionItemStatusSchema = z.enum([
  "listed",
  "removed",
  "sold",
  "unknown",
]);

export const IdentityMatchStatusSchema = z.enum([
  "verified",
  "probable",
  "ambiguous",
  "conflict",
  "unresolved",
]);

export const TitleStatusSchema = z.enum(TitleStatus);

export const IngestionStateSchema = z.enum(IngestionState);

// ─── UNION STRING TYPES ─────────────────────────────────────────────────────

export const EvidenceMethodSchema = z.enum([
  "api",
  "arcgis_rest",
  "bulk_download",
  "official_export",
  "permitted_snapshot",
  "manual_review",
  "operator_supplied",
  "ai_observation",
]);

export const EvidenceEntityTypeSchema = z.enum([
  "auction_item",
  "property",
  "parcel",
  "recommendation",
]);

export const EvidenceReviewStateSchema = z.enum([
  "unreviewed",
  "validated",
  "conflicted",
  "superseded",
]);

// ─── REUSABLE CLASSIFICATION RECORD ─────────────────────────────────────────

const InputClassificationValueSchema = z.enum([
  "source_derived",
  "operator_entered",
  "default",
  "unknown",
]);

const InputClassificationSchema = z.record(
  z.string(),
  InputClassificationValueSchema
);

// ─── FIELD PROVENANCE ───────────────────────────────────────────────────────

export const FieldProvenanceSchema = z.object({
  source_id: z.string(),
  source_url: z.string().nullable(),
  source_document_hash: z.string().nullable(),
  method: EvidenceMethodSchema,
  captured_at: ISODateTimeSchema,
  source_effective_date: ISODateTimeSchema.nullable(),
  confidence: ConfidenceSchema,
  epistemic_state: EpistemicStateSchema,
  stale_after: ISODateTimeSchema.nullable(),
  freshness_status: z.enum(["current", "stale", "expired"]),
});

// ─── REVIEW GATE ────────────────────────────────────────────────────────────

export const ReviewGateSchema = z.object({
  gate_type: ReviewGateTypeSchema,
  severity: z.enum(["blocking", "warning"]),
  status: z.enum(["open", "passed", "failed", "waived_with_reason"]),
  reason: z.string().nullable(),
  evidence_ids: z.array(AshIDSchema),
  reviewed_at: ISODateTimeSchema.nullable(),
  reviewed_by: z.string().nullable(),
});

// ─── SOURCE REGISTRY ENTRY ──────────────────────────────────────────────────

export const SourceRegistryEntrySchema = z.object({
  source_id: z.string().min(1),
  display_name: z.string(),
  authority_rank: AuthorityRankSchema,
  owner: z.string(),
  access_mode: AccessModeSchema,
  endpoint_url: z.string().nullable(),
  api_status: z.enum(["verified", "unverified", "not_available"]),
  download_status: z.enum([
    "available",
    "available_with_caveats",
    "not_available",
  ]),
  auth_type: z.enum(["none", "api_key", "oauth", "manual"]),
  license_or_terms_url: z.string().nullable(),
  refresh_cadence: z.enum([
    "realtime",
    "daily",
    "weekly",
    "manual",
    "event_driven",
  ]),
  rate_limit_policy: z.string(),
  schema_contract_version: z.string(),
  last_health_check_at: ISODateTimeSchema.nullable(),
  operational_status: SourceOperationalStatusSchema,
  last_successful_retrieval: ISODateTimeSchema.nullable(),
  last_attempted_retrieval: ISODateTimeSchema.nullable(),
  failure_reason: z.string().nullable(),
  coverage_municipalities: z.array(z.string()),
});

// ─── EVIDENCE ───────────────────────────────────────────────────────────────

export const EvidenceSchema = z.object({
  evidence_id: AshIDSchema,
  entity_type: EvidenceEntityTypeSchema,
  entity_id: AshIDSchema,
  field_path: z.string(),
  value_json: z.unknown(),
  source_id: z.string(),
  source_url: z.string().nullable(),
  source_document_hash: z.string().nullable(),
  method: EvidenceMethodSchema,
  captured_at: ISODateTimeSchema,
  source_effective_date: ISODateTimeSchema.nullable(),
  confidence: ConfidenceSchema,
  epistemic_state: EpistemicStateSchema,
  review_state: EvidenceReviewStateSchema,
  reviewer: z.string().nullable(),
  reviewed_at: ISODateTimeSchema.nullable(),
});

// ─── AUCTION ITEM ───────────────────────────────────────────────────────────

export const AuctionItemSchema = z.object({
  auction_item_id: z.string(),
  parcel_id_raw: z.string().nullable(),
  parcel_id_normalized: z.string().nullable(),
  address_raw: z.string().nullable(),
  address_normalized: z.string().nullable(),
  municipality: z.string().nullable(),
  zip: z.string().nullable(),
  status: AuctionItemStatusSchema,
  batch_id: z.string().nullable(),
  auction_start_at: ISODateTimeSchema.nullable(),
  minimum_bid: USDAmountSchema.nullable(),
  current_bid: USDAmountSchema.nullable(),
  sold_price: USDAmountSchema.nullable(),
  source_snapshot_id: AshIDSchema,
  source_page_reference: z.string().nullable(),
  raw_fields: z.record(z.string(), z.unknown()),
  captured_at: ISODateTimeSchema,
});

// ─── PROPERTY IDENTITY ──────────────────────────────────────────────────────

export const PropertyIdentitySchema = z.object({
  property_id: AshIDSchema,
  auction_item_ids: z.array(z.string()),
  parcel_id_normalized: z.string().nullable(),
  parcel_id_raw_variants: z.array(z.string()),
  address_normalized: z.string().nullable(),
  address_raw_variants: z.array(z.string()),
  municipality: z.string().nullable(),
  zip: z.string().nullable(),
  gis_identifiers: z.array(z.string()),
  match_status: IdentityMatchStatusSchema,
  match_confidence: ConfidenceSchema,
  identity_evidence_ids: z.array(AshIDSchema),
  created_at: ISODateTimeSchema,
  updated_at: ISODateTimeSchema,
});

// ─── PARCEL ATTRIBUTES ──────────────────────────────────────────────────────

export const ParcelAttributesSchema = z.object({
  parcel_id: z.string(),
  property_id: AshIDSchema,
  geometry_wkt: z.string().nullable(),
  lot_area_sqft: z.number().nullable(),
  lot_frontage_ft: z.number().nullable(),
  lot_depth_ft: z.number().nullable(),
  legal_description: z.string().nullable(),
  assessor_property_class: z.string().nullable(),
  assessed_value_land: USDAmountSchema.nullable(),
  assessed_value_building: USDAmountSchema.nullable(),
  assessed_value_total: USDAmountSchema.nullable(),
  taxable_value: USDAmountSchema.nullable(),
  source_id: z.string(),
  source_effective_date: ISODateTimeSchema.nullable(),
  captured_at: ISODateTimeSchema,
});

// ─── PROPERTY CHARACTERISTICS ───────────────────────────────────────────────

export const PropertyCharacteristicsSchema = z.object({
  property_id: AshIDSchema,
  asset_class: AssetClassSchema,
  asset_class_confidence: ConfidenceSchema,
  asset_class_raw_label: z.string().nullable(),
  structure_status: StructureStatusSchema,
  structure_status_signals: z.array(z.string()),
  exterior_material: z.string().nullable(),
  exterior_material_confidence: ConfidenceSchema,
  year_built: z.number().int().nullable(),
  total_sqft: z.number().nullable(),
  unit_count: z.number().int().nullable(),
  stories: z.number().nullable(),
  bedrooms: z.number().int().nullable(),
  bathrooms: z.number().nullable(),
  has_basement: z.boolean().nullable(),
  has_garage: z.boolean().nullable(),
  roof_condition_known: z.boolean(),
  foundation_condition_known: z.boolean(),
  occupancy_status: z.enum(["occupied", "vacant", "unknown"]),
  occupancy_confidence: ConfidenceSchema,
});

// ─── ZONING RECORD ──────────────────────────────────────────────────────────

export const ZoningRecordSchema = z.object({
  property_id: AshIDSchema,
  zoning_district: z.string().nullable(),
  zoning_overlay: z.string().nullable(),
  future_land_use: z.string().nullable(),
  permitted_uses: z.array(z.string()),
  modular_container_eligible: z.boolean().nullable(),
  zoning_verified: z.boolean(),
  zoning_source_id: z.string().nullable(),
  zoning_verified_at: ISODateTimeSchema.nullable(),
  municipality: z.string(),
});

// ─── ENVIRONMENTAL FLAGS ────────────────────────────────────────────────────

export const EnvironmentalFlagsSchema = z.object({
  property_id: AshIDSchema,
  fema_flood_zone: z.string().nullable(),
  fema_map_panel: z.string().nullable(),
  fema_effective_date: ISODateSchema.nullable(),
  epa_facility_proximity: z.boolean().nullable(),
  epa_facility_ids: z.array(z.string()),
  brownfield_flag: z.boolean().nullable(),
  environmental_gate_required: z.boolean(),
  source_ids: z.array(z.string()),
  captured_at: ISODateTimeSchema,
});

// ─── IMAGERY OBSERVATION ────────────────────────────────────────────────────

/**
 * Imagery confidence is CAPPED at "medium" for automated observations.
 * Source: Feasibility Matrix §5, Risk-Fidelity MoSCoW Constraint 2
 */
export const ImageryObservationSchema = z
  .object({
    observation_id: AshIDSchema,
    property_id: AshIDSchema,
    observation_type: z.enum([
      "street_imagery_triage",
      "aerial_triage",
      "operator_drive_by",
    ]),
    provider: z.string(),
    capture_date_visible: ISODateSchema.nullable(),
    observed: z.array(z.string()),
    not_observed: z.array(z.string()),
    confidence: ConfidenceSchema,
    human_review_required: z.boolean(),
    evidence_id: AshIDSchema,
    captured_at: ISODateTimeSchema,
  })
  .refine(
    (data) => {
      // Automated observations MUST NOT claim high confidence
      if (
        data.observation_type !== "operator_drive_by" &&
        data.confidence === "high"
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Automated imagery confidence is capped at 'medium'. Only operator_drive_by may claim 'high'.",
    }
  );

// ─── MARKET SALE ────────────────────────────────────────────────────────────

export const MarketSaleSchema = z.object({
  sale_id: AshIDSchema,
  parcel_id: z.string().nullable(),
  address: z.string().nullable(),
  municipality: z.string(),
  sale_date: ISODateSchema,
  sale_price: USDAmountSchema,
  property_type: AssetClassSchema.nullable(),
  sqft: z.number().nullable(),
  unit_count: z.number().int().nullable(),
  transaction_validity: z.enum(["arms_length", "non_arms_length", "unknown"]),
  source_id: z.string(),
  source_effective_date: ISODateTimeSchema.nullable(),
  captured_at: ISODateTimeSchema,
});

// ─── COMPARABLE MEMBER ──────────────────────────────────────────────────────

export const ComparableMemberSchema = z.object({
  sale_id: AshIDSchema,
  distance_miles: z.number().nonnegative(),
  age_months: z.number().nonnegative(),
  adjustment_notes: z.array(z.string()),
  weight: z.number().min(0).max(1),
});

// ─── COMPARABLE SET ─────────────────────────────────────────────────────────

export const ComparableSetSchema = z.object({
  comparable_set_id: AshIDSchema,
  property_id: AshIDSchema,
  comparables: z.array(ComparableMemberSchema),
  exit_value_low: USDAmountSchema.nullable(),
  exit_value_base: USDAmountSchema.nullable(),
  exit_value_high: USDAmountSchema.nullable(),
  confidence: ConfidenceSchema,
  minimum_comp_threshold_met: z.boolean(),
  model_version: z.string(),
  calculated_at: ISODateTimeSchema,
});

// ─── REPAIR SCENARIO ────────────────────────────────────────────────────────

export const RepairScenarioSchema = z.object({
  property_id: AshIDSchema,
  repair_low: USDAmountSchema,
  repair_base: USDAmountSchema,
  repair_high: USDAmountSchema,
  unknown_condition_contingency: USDAmountSchema,
  scope_description: z.string(),
  input_classification: InputClassificationSchema,
  evidence_ids: z.array(AshIDSchema),
  calculated_at: ISODateTimeSchema,
});

// ─── FINANCE SCENARIO ───────────────────────────────────────────────────────

export const FinanceScenarioSchema = z.object({
  property_id: AshIDSchema,
  loan_product: z.string().nullable(),
  ltv_ratio: z.number().nullable(),
  interest_rate: z.number().nullable(),
  term_months: z.number().int().nullable(),
  monthly_payment: USDAmountSchema.nullable(),
  holding_cost_monthly: USDAmountSchema.nullable(),
  financing_cost_total: USDAmountSchema.nullable(),
  dscr_ratio: z.number().nullable(),
  projected_monthly_rent: USDAmountSchema.nullable(),
  rent_source: z.string().nullable(),
  rent_confidence: ConfidenceSchema,
  input_classification: InputClassificationSchema,
  calculated_at: ISODateTimeSchema,
});

// ─── TITLE RESEARCH CASE ───────────────────────────────────────────────────

/**
 * FORBIDDEN: "clear", "clean", "marketable", "insurable" as title_status.
 * Enforced structurally — TitleStatusSchema only allows the canonical values.
 */
export const TitleResearchCaseSchema = z.object({
  case_id: AshIDSchema,
  property_id: AshIDSchema,
  title_status: TitleStatusSchema,
  search_terms: z.array(z.string()),
  result_links: z.array(z.string()),
  red_flags: z.array(z.string()),
  professional_escalation_required: z.boolean(),
  professional_reviewer: z.string().nullable(),
  legal_title_reserve: USDAmountSchema.nullable(),
  title_insurance_cost_estimate: USDAmountSchema.nullable(),
  time_to_clear_months: z.number().nullable(),
  evidence_ids: z.array(AshIDSchema),
  researched_at: ISODateTimeSchema,
  reviewed_by: z.string().nullable(),
});

// ─── COURT RESEARCH CASE ────────────────────────────────────────────────────

export const CourtResearchCaseSchema = z.object({
  case_id: AshIDSchema,
  property_id: AshIDSchema,
  court_name: z.string(),
  docket_number: z.string().nullable(),
  case_type: z.string().nullable(),
  parties: z.array(z.string()),
  status_flag: z.string().nullable(),
  documents_available_online: z.boolean(),
  evidence_ids: z.array(AshIDSchema),
  researched_at: ISODateTimeSchema,
});

// ─── NEIGHBORHOOD CONTEXT ───────────────────────────────────────────────────

export const NeighborhoodContextSchema = z.object({
  geography_id: z.string(),
  geography_type: z.enum(["census_tract", "census_block_group", "zip"]),
  vacancy_rate: z.number().nullable(),
  owner_occupancy_rate: z.number().nullable(),
  median_household_income: USDAmountSchema.nullable(),
  median_gross_rent: USDAmountSchema.nullable(),
  poverty_rate: z.number().nullable(),
  vacancy_5yr_trend: z.number().nullable(),
  income_5yr_trend: z.number().nullable(),
  source_dataset: z.string(),
  release_year: z.number().int(),
  captured_at: ISODateTimeSchema,
});

// ─── STRATEGY ───────────────────────────────────────────────────────────────

export const StrategySchema = z.object({
  property_id: AshIDSchema,
  recommended_action: RecommendedActionSchema,
  candidate_actions: z.array(RecommendedActionSchema),
  why: z.array(z.string()),
  counter_signals: z.array(z.string()),
  rules_triggered: z.array(z.string()),
  evidence_ids: z.array(AshIDSchema),
  model_version: z.string(),
  calculated_at: ISODateTimeSchema,
});

// ─── BID PLAN ───────────────────────────────────────────────────────────────

/**
 * Bid formula contract.
 * Hard Max Bid = Conservative Exit Value
 *   - (Repairs + Transaction Costs + Holding Costs + Financing Costs
 *      + Title/Legal Reserve + Contingency + Required Profit)
 *
 * RULE: hard_max_bid MUST be null when critical inputs are unknown.
 */
export const BidPlanSchema = z
  .object({
    bid_plan_id: AshIDSchema,
    property_id: AshIDSchema,
    target_bid: USDAmountSchema.nullable(),
    hard_max_bid: USDAmountSchema.nullable(),
    currency: z.literal("USD"),
    formula_version: z.string(),
    scenario: z.object({
      exit_value_low: USDAmountSchema.nullable(),
      exit_value_base: USDAmountSchema.nullable(),
      exit_value_high: USDAmountSchema.nullable(),
      repair_low: USDAmountSchema.nullable(),
      repair_base: USDAmountSchema.nullable(),
      repair_high: USDAmountSchema.nullable(),
      transaction_costs: USDAmountSchema.nullable(),
      holding_cost_base: USDAmountSchema.nullable(),
      financing_cost_base: USDAmountSchema.nullable(),
      legal_title_reserve: USDAmountSchema.nullable(),
      title_insurance_cost_estimate: USDAmountSchema.nullable(),
      contingency: USDAmountSchema.nullable(),
      required_profit: USDAmountSchema.nullable(),
    }),
    input_classification: InputClassificationSchema,
    sensitivity_results: z.record(z.string(), z.unknown()).nullable(),
    blocking_gates: z.array(ReviewGateTypeSchema),
    warning_gates: z.array(ReviewGateTypeSchema),
    evidence_ids: z.array(AshIDSchema),
    calculated_at: ISODateTimeSchema,
    fresh_until: ISODateTimeSchema.nullable(),
  })
  .refine(
    (data) => {
      // If critical inputs are null, hard_max_bid MUST also be null
      const s = data.scenario;
      const criticalInputsMissing =
        s.exit_value_base === null ||
        s.repair_base === null;
      if (criticalInputsMissing && data.hard_max_bid !== null) {
        return false;
      }
      return true;
    },
    {
      message:
        "hard_max_bid must be null when critical inputs (exit_value_base, repair_base) are unknown",
    }
  );

// ─── RECOMMENDATION ─────────────────────────────────────────────────────────

/** Inline risks sub-object for Recommendation */
const RecommendationRisksSchema = z.object({
  blocking: z.array(ReviewGateSchema),
  warnings: z.array(ReviewGateSchema),
  reviewed_at: ISODateTimeSchema.nullable(),
});

/** Inline explanation sub-object for Recommendation */
const RecommendationExplanationSchema = z.object({
  why: z.array(z.string()),
  counter_signals: z.array(z.string()),
  missing_information: z.array(z.string()),
  evidence_count: z.number().int().nonnegative(),
});

export const RecommendationSchema = z.object({
  recommendation_id: AshIDSchema,
  property_id: AshIDSchema,
  model_version: z.string(),
  decision_state: DecisionStateSchema,
  strategy: StrategySchema,
  bid_plan: BidPlanSchema,
  risks: RecommendationRisksSchema,
  explanation: RecommendationExplanationSchema,
  fidelity_status: FidelityStatusSchema,
  calculated_at: ISODateTimeSchema,
  fresh_until: ISODateTimeSchema.nullable(),
});

// ─── HUMAN ESCALATION ───────────────────────────────────────────────────────

/** Operator-supplied evidence returned from an escalation */
export const OperatorEvidenceSchema = z.object({
  evidence_id: AshIDSchema,
  property_id: AshIDSchema,
  source_description: z.string(),
  finding: z.string(),
  attribution: z.string(),
  timestamp: ISODateTimeSchema,
  provenance: z.string(),
  evidence_artifacts: z.array(z.string()),
});

export const HumanEscalationSchema = z.object({
  escalation_id: AshIDSchema,
  property_id: AshIDSchema,
  what_is_missing: z.string(),
  why_automation_cannot_establish: z.string(),
  official_destination: z.string().nullable(),
  identifiers_needed: z.array(z.string()),
  information_to_bring_back: z.array(z.string()),
  escalation_type: z.enum([
    "title",
    "inspection",
    "zoning",
    "legal",
    "environmental",
    "other",
  ]),
  status: z.enum(["open", "in_progress", "resolved", "waived"]),
  operator_result: OperatorEvidenceSchema.nullable(),
  created_at: ISODateTimeSchema,
  resolved_at: ISODateTimeSchema.nullable(),
});

// ─── OPERATOR ACTION ────────────────────────────────────────────────────────

export const OperatorActionSchema = z.object({
  action_id: AshIDSchema,
  property_id: AshIDSchema,
  action_type: z.enum([
    "override_bid_cap",
    "acknowledge_gate",
    "waive_gate",
    "add_note",
    "add_evidence",
    "promote",
    "unpublish",
    "reject",
    "reconsider",
  ]),
  reason: z.string(),
  previous_value: z.unknown().nullable(),
  new_value: z.unknown().nullable(),
  timestamp: ISODateTimeSchema,
  actor: z.string(),
});

// ─── PREFERENCE FEEDBACK ────────────────────────────────────────────────────

export const PreferenceFeedbackSchema = z.object({
  feedback_id: AshIDSchema,
  property_id: AshIDSchema,
  signal: z.enum(["thumbs_up", "thumbs_down"]),
  reason: z.string().nullable(),
  timestamp: ISODateTimeSchema,
});

// ─── OPERATOR PREFERENCES ───────────────────────────────────────────────────

export const OperatorPreferencesSchema = z.object({
  profile_id: AshIDSchema,
  version: z.number().int(),
  preferences: z.object({
    brick_required: z.boolean(),
    max_rehab_budget: USDAmountSchema,
    rehab_scope: z.literal("cosmetic_only"),
    roof_replacement_tolerance: z.literal(false),
    foundation_defect_tolerance: z.literal(false),
    target_property_types: z.array(AssetClassSchema),
    geographic_focus_zips: z.array(z.string()),
    geographic_focus_municipalities: z.array(z.string()),
    hold_vs_flip_split: z.string(),
    acquisition_target_count: z.number().int(),
    shortlist_target_count: z.number().int(),
    lot_strategy_separate: z.boolean(),
    multifamily_hold_preference: z.boolean(),
    financing_products: z.array(z.string()),
  }),
  feedback_events: z.array(PreferenceFeedbackSchema),
  created_at: ISODateTimeSchema,
  updated_at: ISODateTimeSchema,
});

// ─── AUDIT LOG ENTRY ────────────────────────────────────────────────────────

export const AuditLogEntrySchema = z.object({
  log_id: AshIDSchema,
  event_type: z.enum([
    "ingestion",
    "evidence_update",
    "rule_execution",
    "recommendation_change",
    "manual_override",
    "operator_acknowledgment",
    "promotion",
    "unpublish",
    "source_health_change",
    "schema_drift_detected",
    "export",
  ]),
  entity_type: z.string(),
  entity_id: AshIDSchema,
  actor: z.string(),
  version: z.string().nullable(),
  detail: z.record(z.string(), z.unknown()),
  timestamp: ISODateTimeSchema,
});

// ─── EXPORT RECORD ──────────────────────────────────────────────────────────

// Forward-declare PropertyEnvelopeSchema (used in ExportRecord and PromotionSnapshot)
// Defined below after the main envelope schema.

export const ExportRecordSchema = z.lazy(() =>
  z.object({
    export_id: AshIDSchema,
    property_id: AshIDSchema,
    format: z.enum(["html", "csv", "xlsx", "json", "markdown"]),
    schema_version: z.string(),
    envelope_snapshot: PropertyEnvelopeSchema,
    exported_at: ISODateTimeSchema,
    exported_by: z.string(),
  })
);

// ═══════════════════════════════════════════════════════════════════════════
// THE CANONICAL PROPERTY ENVELOPE VALIDATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * THE PROPERTY ENVELOPE — the system invariant.
 *
 * Consumed by: Desktop, Promotion Gate, Firestore, Mobile, HTML Export.
 * No surface may redefine a property into an incompatible representation.
 */
export const PropertyEnvelopeSchema = z.object({
  // ── Schema ──
  schema_version: z.string(),
  envelope_timestamp: ISODateTimeSchema,

  // ── Identity ──
  identity: PropertyIdentitySchema,

  // ── Auction ──
  auction: z.object({
    auction_item_id: z.string(),
    status: AuctionItemStatusSchema,
    batch_id: z.string().nullable(),
    auction_start_at: ISODateTimeSchema.nullable(),
    minimum_bid: USDAmountSchema.nullable(),
    current_bid: USDAmountSchema.nullable(),
    sold_price: USDAmountSchema.nullable(),
    deposit_tier: USDAmountSchema.nullable(),
    is_premium: z.boolean().nullable(),
    is_bundle: z.boolean().nullable(),
    bundle_members: z.array(z.string()).nullable(),
    status_checked_at: ISODateTimeSchema.nullable(),
    fresh_until: ISODateTimeSchema.nullable(),
    is_stale: z.boolean(),
  }),

  // ── Classification ──
  classification: z.object({
    asset_class: AssetClassSchema,
    asset_class_confidence: ConfidenceSchema,
    asset_class_raw_label: z.string().nullable(),
    structure_status: StructureStatusSchema,
    occupancy_status: z.enum(["occupied", "vacant", "unknown"]),
  }),

  // ── Property Characteristics ──
  characteristics: PropertyCharacteristicsSchema,

  // ── Parcel & GIS ──
  parcel: ParcelAttributesSchema.nullable(),

  // ── Zoning & Land Use ──
  zoning: ZoningRecordSchema.nullable(),

  // ── Environmental & Flood ──
  environmental: EnvironmentalFlagsSchema.nullable(),

  // ── Neighborhood Context ──
  neighborhood: NeighborhoodContextSchema.nullable(),

  // ── Strategy ──
  strategy: StrategySchema,

  // ── Bid Plan ──
  bid_plan: BidPlanSchema,

  // ── Scenarios ──
  scenarios: z.object({
    repair: RepairScenarioSchema.nullable(),
    finance: FinanceScenarioSchema.nullable(),
    comparable_set: ComparableSetSchema.nullable(),
  }),

  // ── Risks & Gates ──
  risks: z.object({
    blocking_gates: z.array(ReviewGateSchema),
    warning_gates: z.array(ReviewGateSchema),
    reviewed_at: ISODateTimeSchema.nullable(),
  }),

  // ── Title & Legal ──
  title: TitleResearchCaseSchema.nullable(),
  court_cases: z.array(CourtResearchCaseSchema),

  // ── Imagery Observations ──
  imagery: z.array(ImageryObservationSchema),

  // ── Evidence ──
  evidence_summary: z.object({
    total_evidence_count: z.number().int().nonnegative(),
    high_confidence_count: z.number().int().nonnegative(),
    conflicted_count: z.number().int().nonnegative(),
    evidence_ids: z.array(AshIDSchema),
  }),

  // ── Source Health ──
  source_health: z.object({
    sources_used: z.array(z.string()),
    degraded_sources: z.array(z.string()),
    unavailable_sources: z.array(z.string()),
    last_source_check: ISODateTimeSchema.nullable(),
  }),

  // ── Confidence & Fidelity ──
  confidence: ConfidenceSchema,
  fidelity_status: FidelityStatusSchema,
  epistemic_summary: z.object({
    fact_count: z.number().int().nonnegative(),
    signal_count: z.number().int().nonnegative(),
    estimate_count: z.number().int().nonnegative(),
    unknown_count: z.number().int().nonnegative(),
  }),

  // ── Missing Information ──
  missing_information: z.array(z.string()),
  known_unknowns: z.array(z.string()),

  // ── Human Escalation ──
  human_escalations: z.array(HumanEscalationSchema),

  // ── Recommendation ──
  recommendation: RecommendationSchema,

  // ── Operator State ──
  operator: z.object({
    notes: z.array(z.string()),
    decisions: z.array(OperatorActionSchema),
    feedback: z.array(PreferenceFeedbackSchema),
  }),

  // ── Decision State ──
  decision_state: DecisionStateSchema,
  ingestion_state: IngestionStateSchema,

  // ── Promotion State ──
  promotion: z.object({
    is_promoted: z.boolean(),
    promoted_at: ISODateTimeSchema.nullable(),
    promotion_id: AshIDSchema.nullable(),
    last_synced_at: ISODateTimeSchema.nullable(),
  }),

  // ── Timestamps ──
  created_at: ISODateTimeSchema,
  updated_at: ISODateTimeSchema,
  last_enriched_at: ISODateTimeSchema.nullable(),
  last_scored_at: ISODateTimeSchema.nullable(),
});

// ─── PROMOTION SNAPSHOT ─────────────────────────────────────────────────────

export const PromotionSnapshotSchema = z.object({
  promotion_id: AshIDSchema,
  property_id: AshIDSchema,
  envelope: PropertyEnvelopeSchema,
  schema_version: z.string(),
  promoted_at: ISODateTimeSchema,
  promoted_by: z.string(),
  stale_evidence: z.array(z.string()),
  missing_evidence: z.array(z.string()),
  active_warnings: z.array(z.string()),
  blocking_gates: z.array(ReviewGateTypeSchema),
  firestore_document_id: z.string().nullable(),
  status: z.enum(["promoted", "updated", "unpublished", "retired"]),
  unpublished_at: ISODateTimeSchema.nullable(),
});

// ═══════════════════════════════════════════════════════════════════════════
// FORBIDDEN OUTPUT GUARD — RUNTIME SAFETY NET
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Deep-scan any object for forbidden output values.
 * This is a runtime safety net, not a replacement for structural enforcement.
 * Call this before any database write, promotion, or export.
 */
export const FORBIDDEN_OUTPUT_VALUES = {
  title: ["clear", "clean", "marketable", "insurable"],
  condition: ["inspected", "certified", "guaranteed"],
  valuation: ["guaranteed_arv", "appraised"],
  auction: ["auto_bid_placed", "auto_purchased"],
  legal: ["no_liens", "title_clear", "quiet_title_resolved"],
  lending: ["approved", "pre_approved", "eligible"],
} as const;

type ForbiddenCategory = keyof typeof FORBIDDEN_OUTPUT_VALUES;

export function containsForbiddenValue(
  value: unknown,
  visited = new WeakSet()
): { found: boolean; path: string; category: ForbiddenCategory } | null {
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    for (const [category, forbidden] of Object.entries(
      FORBIDDEN_OUTPUT_VALUES
    )) {
      for (const f of forbidden) {
        if (lower === f) {
          return {
            found: true,
            path: "",
            category: category as ForbiddenCategory,
          };
        }
      }
    }
    return null;
  }

  if (value !== null && typeof value === "object") {
    if (visited.has(value as object)) return null;
    visited.add(value as object);

    const entries = Array.isArray(value)
      ? value.map((v, i) => [String(i), v] as const)
      : Object.entries(value as Record<string, unknown>);

    for (const [key, val] of entries) {
      const result = containsForbiddenValue(val, visited);
      if (result) {
        return {
          ...result,
          path: result.path ? `${key}.${result.path}` : key,
        };
      }
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// INFERRED TYPES — use these instead of re-declaring interfaces
// ═══════════════════════════════════════════════════════════════════════════

export type PropertyEnvelope = z.infer<typeof PropertyEnvelopeSchema>;
export type PropertyIdentity = z.infer<typeof PropertyIdentitySchema>;
export type Evidence = z.infer<typeof EvidenceSchema>;
export type AuctionItem = z.infer<typeof AuctionItemSchema>;
export type SourceRegistryEntry = z.infer<typeof SourceRegistryEntrySchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type BidPlan = z.infer<typeof BidPlanSchema>;
export type Strategy = z.infer<typeof StrategySchema>;
export type ReviewGate = z.infer<typeof ReviewGateSchema>;
export type HumanEscalation = z.infer<typeof HumanEscalationSchema>;
export type OperatorAction = z.infer<typeof OperatorActionSchema>;
export type OperatorEvidence = z.infer<typeof OperatorEvidenceSchema>;
export type OperatorPreferences = z.infer<typeof OperatorPreferencesSchema>;
export type PromotionSnapshot = z.infer<typeof PromotionSnapshotSchema>;
export type ExportRecord = z.infer<typeof ExportRecordSchema>;
export type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;
export type FieldProvenance = z.infer<typeof FieldProvenanceSchema>;
export type ParcelAttributes = z.infer<typeof ParcelAttributesSchema>;
export type PropertyCharacteristics = z.infer<typeof PropertyCharacteristicsSchema>;
export type ZoningRecord = z.infer<typeof ZoningRecordSchema>;
export type EnvironmentalFlags = z.infer<typeof EnvironmentalFlagsSchema>;
export type ImageryObservation = z.infer<typeof ImageryObservationSchema>;
export type MarketSale = z.infer<typeof MarketSaleSchema>;
export type ComparableSet = z.infer<typeof ComparableSetSchema>;
export type ComparableMember = z.infer<typeof ComparableMemberSchema>;
export type RepairScenario = z.infer<typeof RepairScenarioSchema>;
export type FinanceScenario = z.infer<typeof FinanceScenarioSchema>;
export type TitleResearchCase = z.infer<typeof TitleResearchCaseSchema>;
export type CourtResearchCase = z.infer<typeof CourtResearchCaseSchema>;
export type NeighborhoodContext = z.infer<typeof NeighborhoodContextSchema>;
export type PreferenceFeedback = z.infer<typeof PreferenceFeedbackSchema>;


