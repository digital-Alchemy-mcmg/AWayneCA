
// ============================================================================
// ASHANTE CANONICAL VALIDATION TESTS — v1.0.0
// ============================================================================
// Recovered portion of the source validation suite. The Build Asset ends
// mid-assertion during the identity-conflict case; the syntactic completion
// below is marked and the missing advertised cases are recorded in the
// reconciliation report rather than silently claimed as present.
// Intended Task 1 specification requirements:
//   1. Valid complete property
//   2. Partially known property
//   3. Identity conflict
//   4. Stale source
//   5. Degraded source
//   6. Human-only title check
//   7. Promoted property containing warnings
//   8. Attempted invalid envelope
// Plus:
//   9. Forbidden output value guard
//  10. Imagery confidence cap enforcement
//  11. Hard max bid null-when-unknown enforcement
//  12. Individual schema validations
// ============================================================================

import { describe, it, expect } from "vitest"; // or jest
import {
  PropertyEnvelopeSchema,
  PropertyIdentitySchema,
  EvidenceSchema,
  SourceRegistryEntrySchema,
  BidPlanSchema,
  ImageryObservationSchema,
  HumanEscalationSchema,
  PromotionSnapshotSchema,
  TitleResearchCaseSchema,
  AuctionItemSchema,
  ReviewGateSchema,
  containsForbiddenValue,
  SCHEMA_VERSION,
} from "../validation/property-envelope";

// ─── TEST HELPERS: MINIMAL VALID FRAGMENTS ──────────────────────────────────

const NOW = "2026-09-01T06:00:00Z";
const STALE_TIME = "2026-08-15T12:00:00Z";
const FRESH_UNTIL = "2026-09-02T06:00:00Z";

function makeIdentity(overrides: Record<string, unknown> = {}) {
  return {
    property_id: "ash-prop-wayne-00001",
    auction_item_ids: ["WC-2026-SEP-10044"],
    parcel_id_normalized: "22044010300500",
    parcel_id_raw_variants: ["22044010300500", "22-044-01-0300-500"],
    address_normalized: "1842 Holden St, Detroit, MI 48202",
    address_raw_variants: ["1842 Holden St", "1842 HOLDEN ST DETROIT MI 48202"],
    municipality: "Detroit",
    zip: "48202",
    gis_identifiers: [],
    match_status: "verified",
    match_confidence: "high",
    identity_evidence_ids: ["ev-id-001"],
    created_at: NOW,
    updated_at: NOW,
    ...overrides,
  };
}

function makeStrategy(overrides: Record<string, unknown> = {}) {
  return {
    property_id: "ash-prop-wayne-00001",
    recommended_action: "flip",
    candidate_actions: ["flip", "hold_rental"],
    why: ["Brick SFH in target ZIP", "Exit value supports cosmetic rehab margin"],
    counter_signals: ["Occupancy unknown — field verification needed"],
    rules_triggered: ["brick_required_pass", "cosmetic_rehab_budget_within_range"],
    evidence_ids: ["ev-strat-001"],
    model_version: "1.0.0",
    calculated_at: NOW,
    ...overrides,
  };
}

function makeBidPlan(overrides: Record<string, unknown> = {}) {
  return {
    bid_plan_id: "bp-001",
    property_id: "ash-prop-wayne-00001",
    target_bid: 8500,
    hard_max_bid: 14200,
    currency: "USD",
    formula_version: "1.0.0",
    scenario: {
      exit_value_low: 38000,
      exit_value_base: 52000,
      exit_value_high: 65000,
      repair_low: 12000,
      repair_base: 18000,
      repair_high: 27000,
      transaction_costs: 4200,
      holding_cost_base: 3600,
      financing_cost_base: 2800,
      legal_title_reserve: 2500,
      title_insurance_cost_estimate: 1200,
      contingency: 3000,
      required_profit: 8000,
    },
    input_classification: {
      exit_value_base: "source_derived",
      repair_base: "default",
      transaction_costs: "default",
    },
    sensitivity_results: null,
    blocking_gates: [],
    warning_gates: ["condition_review"],
    evidence_ids: ["ev-bid-001"],
    calculated_at: NOW,
    fresh_until: FRESH_UNTIL,
    ...overrides,
  };
}

function makeRecommendation(overrides: Record<string, unknown> = {}) {
  return {
    recommendation_id: "rec-001",
    property_id: "ash-prop-wayne-00001",
    model_version: "1.0.0",
    decision_state: "feasibility",
    strategy: makeStrategy(),
    bid_plan: makeBidPlan(),
    risks: {
      blocking: [],
      warnings: [
        {
          gate_type: "condition_review",
          severity: "warning",
          status: "open",
          reason: "No interior inspection performed",
          evidence_ids: [],
          reviewed_at: null,
          reviewed_by: null,
        },
      ],
      reviewed_at: null,
    },
    explanation: {
      why: ["Brick SFH in target geography"],
      counter_signals: ["Occupancy unverified"],
      missing_information: ["Interior condition", "Title depth"],
      evidence_count: 7,
    },
    fidelity_status: "incomplete",
    calculated_at: NOW,
    fresh_until: FRESH_UNTIL,
    ...overrides,
  };
}

function makeCharacteristics(overrides: Record<string, unknown> = {}) {
  return {
    property_id: "ash-prop-wayne-00001",
    asset_class: "single_family",
    asset_class_confidence: "high",
    asset_class_raw_label: "RESIDENTIAL - SINGLE FAMILY",
    structure_status: "improved_property",
    structure_status_signals: ["assessor_class_residential", "imagery_structure_visible"],
    exterior_material: "brick",
    exterior_material_confidence: "medium",
    year_built: 1928,
    total_sqft: 1450,
    unit_count: 1,
    stories: 1.5,
    bedrooms: 3,
    bathrooms: 1,
    has_basement: true,
    has_garage: null,
    roof_condition_known: false,
    foundation_condition_known: false,
    occupancy_status: "unknown",
    occupancy_confidence: "unresolved",
    ...overrides,
  };
}

function makeMinimalEnvelope(overrides: Record<string, unknown> = {}) {
  const base = {
    schema_version: SCHEMA_VERSION,
    envelope_timestamp: NOW,
    identity: makeIdentity(),
    auction: {
      auction_item_id: "WC-2026-SEP-10044",
      status: "listed",
      batch_id: "WC-2026-SEP-BATCH-01",
      auction_start_at: "2026-10-15T09:00:00Z",
      minimum_bid: 500,
      current_bid: null,
      sold_price: null,
      deposit_tier: 600,
      is_premium: false,
      is_bundle: false,
      bundle_members: null,
      status_checked_at: NOW,
      fresh_until: FRESH_UNTIL,
      is_stale: false,
    },
    classification: {
      asset_class: "single_family",
      asset_class_confidence: "high",
      asset_class_raw_label: "RESIDENTIAL - SINGLE FAMILY",
      structure_status: "improved_property",
      occupancy_status: "unknown",
    },
    characteristics: makeCharacteristics(),
    parcel: {
      parcel_id: "22044010300500",
      property_id: "ash-prop-wayne-00001",
      geometry_wkt: null,
      lot_area_sqft: 4200,
      lot_frontage_ft: 35,
      lot_depth_ft: 120,
      legal_description: "LOT 500 HOLDEN PARK SUB L50 P33 PLATS W C R",
      assessor_property_class: "401",
      assessed_value_land: 1200,
      assessed_value_building: 6800,
      assessed_value_total: 8000,
      taxable_value: 8000,
      source_id: "wayne_gis_parcel",
      source_effective_date: "2026-01-01T00:00:00Z",
      captured_at: NOW,
    },
    zoning: null,
    environmental: null,
    neighborhood: null,
    strategy: makeStrategy(),
    bid_plan: makeBidPlan(),
    scenarios: {
      repair: null,
      finance: null,
      comparable_set: null,
    },
    risks: {
      blocking_gates: [],
      warning_gates: [
        {
          gate_type: "condition_review",
          severity: "warning",
          status: "open",
          reason: "No interior inspection",
          evidence_ids: [],
          reviewed_at: null,
          reviewed_by: null,
        },
      ],
      reviewed_at: null,
    },
    title: null,
    court_cases: [],
    imagery: [],
    evidence_summary: {
      total_evidence_count: 7,
      high_confidence_count: 3,
      conflicted_count: 0,
      evidence_ids: ["ev-001", "ev-002", "ev-003", "ev-004", "ev-005", "ev-006", "ev-007"],
    },
    source_health: {
      sources_used: ["wayne_treasurer_auction", "wayne_gis_parcel"],
      degraded_sources: [],
      unavailable_sources: [],
      last_source_check: NOW,
    },
    confidence: "medium",
    fidelity_status: "incomplete",
    epistemic_summary: {
      fact_count: 3,
      signal_count: 2,
      estimate_count: 1,
      unknown_count: 5,
    },
    missing_information: [
      "Interior condition",
      "Title research",
      "Zoning verification",
      "Environmental check",
      "Occupancy verification",
    ],
    known_unknowns: [
      "Roof condition — requires field inspection",
      "Foundation condition — requires field inspection",
      "Occupancy — requires drive-by or field visit",
    ],
    human_escalations: [],
    recommendation: makeRecommendation(),
    operator: {
      notes: [],
      decisions: [],
      feedback: [],
    },
    decision_state: "feasibility",
    ingestion_state: "FEASIBILITY_READY",
    promotion: {
      is_promoted: false,
      promoted_at: null,
      promotion_id: null,
      last_synced_at: null,
    },
    created_at: NOW,
    updated_at: NOW,
    last_enriched_at: NOW,
    last_scored_at: NOW,
  };
  return { ...base, ...overrides };
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════

describe("Ashante Canonical Zod Validators", () => {
  // ── TEST 1: Valid Complete Property ──────────────────────────────────
  describe("1. Valid Complete Property", () => {
    it("accepts a well-formed complete Property Envelope", () => {
      const envelope = makeMinimalEnvelope();
      const result = PropertyEnvelopeSchema.safeParse(envelope);
      expect(result.success).toBe(true);
    });

    it("round-trips without data loss", () => {
      const envelope = makeMinimalEnvelope();
      const result = PropertyEnvelopeSchema.parse(envelope);
      expect(result.identity.property_id).toBe("ash-prop-wayne-00001");
      expect(result.auction.minimum_bid).toBe(500);
      expect(result.characteristics.exterior_material).toBe("brick");
      expect(result.schema_version).toBe(SCHEMA_VERSION);
    });
  });

  // ── TEST 2: Partially Known Property ────────────────────────────────
  describe("2. Partially Known Property", () => {
    it("accepts an envelope with extensive null/unknown fields", () => {
      const partial = makeMinimalEnvelope({
        parcel: null,
        zoning: null,
        environmental: null,
        neighborhood: null,
        title: null,
        court_cases: [],
        imagery: [],
        scenarios: { repair: null, finance: null, comparable_set: null },
        confidence: "low",
        fidelity_status: "incomplete",
        epistemic_summary: {
          fact_count: 1,
          signal_count: 0,
          estimate_count: 0,
          unknown_count: 15,
        },
        missing_information: [
          "Parcel attributes",
          "Zoning",
          "Environmental",
          "Neighborhood context",
          "Title",
          "Interior condition",
          "Market comparables",
          "Repair estimate",
          "Finance scenario",
        ],
        bid_plan: makeBidPlan({
          target_bid: null,
          hard_max_bid: null,
          scenario: {
            exit_value_low: null,
            exit_value_base: null,
            exit_value_high: null,
            repair_low: null,
            repair_base: null,
            repair_high: null,
            transaction_costs: null,
            holding_cost_base: null,
            financing_cost_base: null,
            legal_title_reserve: null,
            title_insurance_cost_estimate: null,
            contingency: null,
            required_profit: null,
          },
        }),
        strategy: makeStrategy({
          recommended_action: "needs_research",
          why: ["Insufficient data for classification"],
          counter_signals: [],
        }),
        recommendation: makeRecommendation({
          decision_state: "research",
          fidelity_status: "incomplete",
        }),
        decision_state: "research",
        ingestion_state: "ENRICHMENT_QUEUED",
      });

      const result = PropertyEnvelopeSchema.safeParse(partial);
      expect(result.success).toBe(true);
    });
  });

  // ── TEST 3: Identity Conflict ───────────────────────────────────────
  describe("3. Identity Conflict", () => {
    it("represents an ambiguous identity match as reviewable conflict", () => {
      const conflict = makeIdentity({
        match_status: "conflict",
        match_confidence: "low",
        parcel_id_raw_variants: [
          "22044010300500",
          "22044010300501",
        ],
        address_raw_variants: [
          "1842 Holden St",
          "1844 Holden St",
        ],
      });

      const result = PropertyIdentitySchema.safeParse(conflict);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.match_status).toBe("conflict");
        // COMPILER-001 recovery: the source file truncates after this member
        // access. The assertion follows directly from the fixture above.
        expect(result.data.match_confidence).toBe("low");
      }
    });
  });
});

// COMPILER-001 supplemental coverage reconstructs the remaining advertised
// invariant scenarios from the frozen contract. These tests are new evidence;
// they are not represented as bytes recovered from the truncated source file.
describe("COMPILER-001 supplemental invariant coverage", () => {
  const sourceBase = {
    source_id: "wayne_treasurer_auction",
    display_name: "Wayne County Treasurer auction",
    authority_rank: "official_government",
    owner: "Wayne County",
    access_mode: "official_portal_snapshot",
    endpoint_url: null,
    api_status: "not_available",
    download_status: "available_with_caveats",
    auth_type: "none",
    license_or_terms_url: null,
    refresh_cadence: "event_driven",
    rate_limit_policy: "manual",
    schema_contract_version: SCHEMA_VERSION,
    last_health_check_at: NOW,
    operational_status: "AVAILABLE",
    last_successful_retrieval: NOW,
    last_attempted_retrieval: NOW,
    failure_reason: null,
    coverage_municipalities: ["Detroit"],
  };

  it("preserves stale auction state instead of presenting it as current", () => {
    const envelope = makeMinimalEnvelope();
    const result = PropertyEnvelopeSchema.safeParse({
      ...envelope,
      auction: { ...envelope.auction, is_stale: true, fresh_until: STALE_TIME },
      decision_state: "stale",
      ingestion_state: "STALE",
    });
    expect(result.success).toBe(true);
  });

  it("represents degraded and human-only sources explicitly", () => {
    expect(
      SourceRegistryEntrySchema.parse({
        ...sourceBase,
        operational_status: "DEGRADED",
        failure_reason: "Partial fields returned",
      }).operational_status,
    ).toBe("DEGRADED");
    expect(
      SourceRegistryEntrySchema.parse({
        ...sourceBase,
        source_id: "wayne_register_of_deeds",
        operational_status: "HUMAN_ONLY",
        access_mode: "manual_review",
      }).operational_status,
    ).toBe("HUMAN_ONLY");
  });

  it("accepts a promoted snapshot with active non-blocking warnings", () => {
    const envelope = makeMinimalEnvelope();
    const result = PromotionSnapshotSchema.safeParse({
      promotion_id: "promotion-001",
      property_id: envelope.identity.property_id,
      envelope: {
        ...envelope,
        promotion: {
          is_promoted: true,
          promoted_at: NOW,
          promotion_id: "promotion-001",
          last_synced_at: null,
        },
      },
      schema_version: SCHEMA_VERSION,
      promoted_at: NOW,
      promoted_by: "operator",
      stale_evidence: [],
      missing_evidence: [],
      active_warnings: ["SOURCE DEGRADED"],
      blocking_gates: [],
      firestore_document_id: null,
      status: "promoted",
      unpublished_at: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an envelope missing canonical identity", () => {
    const envelope = makeMinimalEnvelope();
    const invalid = { ...envelope } as Record<string, unknown>;
    delete invalid.identity;
    expect(PropertyEnvelopeSchema.safeParse(invalid).success).toBe(false);
  });

  it("detects forbidden certainty language at any nested path", () => {
    expect(containsForbiddenValue({ title: { status: "clear" } })).toEqual({
      found: true,
      path: "title.status",
      category: "title",
    });
  });

  it("caps automated imagery confidence below high", () => {
    const observation = {
      observation_id: "image-001",
      property_id: "ash-prop-wayne-00001",
      observation_type: "street_imagery_triage",
      provider: "fixture",
      capture_date_visible: null,
      observed: ["roof visible"],
      not_observed: ["interior condition"],
      confidence: "high",
      human_review_required: true,
      evidence_id: "ev-image-001",
      captured_at: NOW,
    };
    expect(ImageryObservationSchema.safeParse(observation).success).toBe(false);
    expect(
      ImageryObservationSchema.safeParse({ ...observation, observation_type: "operator_drive_by" })
        .success,
    ).toBe(true);
  });

  it("requires a null hard cap when critical bid inputs are unknown", () => {
    const bid = makeBidPlan();
    const missingInputs = {
      ...bid,
      scenario: { ...bid.scenario, exit_value_base: null },
    };
    expect(BidPlanSchema.safeParse(missingInputs).success).toBe(false);
    expect(BidPlanSchema.safeParse({ ...missingInputs, hard_max_bid: null }).success).toBe(true);
  });

  it("allows only cautious title workflow states", () => {
    const title = {
      case_id: "title-001",
      property_id: "ash-prop-wayne-00001",
      title_status: "professional_report_received",
      search_terms: ["22044010300500"],
      result_links: [],
      red_flags: [],
      professional_escalation_required: false,
      professional_reviewer: "title-company-review",
      legal_title_reserve: 2500,
      title_insurance_cost_estimate: 1200,
      time_to_clear_months: null,
      evidence_ids: ["ev-title-001"],
      researched_at: NOW,
      reviewed_by: "operator",
    };
    expect(TitleResearchCaseSchema.safeParse(title).success).toBe(true);
    expect(TitleResearchCaseSchema.safeParse({ ...title, title_status: "clear" }).success).toBe(false);
  });

  it("validates individual auction, review-gate, evidence, and escalation records", () => {
    expect(
      AuctionItemSchema.safeParse({
        auction_item_id: "WC-2026-SEP-10044",
        parcel_id_raw: "22-044-01-0300-500",
        parcel_id_normalized: "22044010300500",
        address_raw: "1842 Holden St",
        address_normalized: "1842 HOLDEN ST DETROIT MI 48202",
        municipality: "Detroit",
        zip: "48202",
        status: "listed",
        batch_id: "batch-001",
        auction_start_at: null,
        minimum_bid: 500,
        current_bid: null,
        sold_price: null,
        source_snapshot_id: "snapshot-001",
        source_page_reference: null,
        raw_fields: {},
        captured_at: NOW,
      }).success,
    ).toBe(true);
    expect(
      ReviewGateSchema.safeParse({
        gate_type: "title_professional_review",
        severity: "blocking",
        status: "open",
        reason: "Professional report required",
        evidence_ids: [],
        reviewed_at: null,
        reviewed_by: null,
      }).success,
    ).toBe(true);
    expect(
      EvidenceSchema.safeParse({
        evidence_id: "ev-001",
        entity_type: "property",
        entity_id: "ash-prop-wayne-00001",
        field_path: "title.title_status",
        value_json: "title_company_review_pending",
        source_id: "wayne_register_of_deeds",
        source_url: null,
        source_document_hash: null,
        method: "manual_review",
        captured_at: NOW,
        source_effective_date: null,
        confidence: "medium",
        epistemic_state: "FACT",
        review_state: "unreviewed",
        reviewer: null,
        reviewed_at: null,
      }).success,
    ).toBe(true);
    expect(
      HumanEscalationSchema.safeParse({
        escalation_id: "esc-001",
        property_id: "ash-prop-wayne-00001",
        what_is_missing: "Professional title review",
        why_automation_cannot_establish: "Public index is not title certification",
        official_destination: "Wayne County Register of Deeds",
        identifiers_needed: ["parcel ID"],
        information_to_bring_back: ["professional report"],
        escalation_type: "title",
        status: "open",
        operator_result: null,
        created_at: NOW,
        resolved_at: null,
      }).success,
    ).toBe(true);
  });
});
