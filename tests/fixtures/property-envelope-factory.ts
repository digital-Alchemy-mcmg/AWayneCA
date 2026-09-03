import {
  PropertyEnvelopeSchema,
  SCHEMA_VERSION,
  type PropertyEnvelope,
} from "../../src/domain/validation/property-envelope";

export const SYNTHETIC_FIXTURE_NOTICE =
  "Synthetic test data only. This record does not describe a real property.";

export type PropertyEnvelopeFixtureScenario =
  | "valid"
  | "incomplete"
  | "stale"
  | "blocked"
  | "conflicting_identity"
  | "missing_evidence"
  | "source_degraded";

const NOW = "2026-09-03T00:00:00Z";
const FRESH_UNTIL = "2026-09-05T00:00:00Z";
const STALE_AT = "2026-08-15T00:00:00Z";

function fixtureId(sequence: number): string {
  return `fixture-property-${String(sequence).padStart(3, "0")}`;
}

function makeRawEnvelope(sequence: number): Record<string, unknown> {
  const propertyId = fixtureId(sequence);
  const auctionItemId = `FIXTURE-AUCTION-${String(sequence).padStart(3, "0")}`;
  const parcelId = `00${String(1000000000 + sequence)}`;
  const address = `${1000 + sequence} Synthetic Fixture Ave, Detroit, MI 48200`;

  const strategy = {
    property_id: propertyId,
    recommended_action: "needs_research",
    candidate_actions: ["flip", "hold_rental"],
    why: ["Synthetic fixture for contract verification"],
    counter_signals: ["No real-world inference is permitted from this fixture"],
    rules_triggered: ["synthetic_fixture_only"],
    evidence_ids: [`fixture-evidence-strategy-${sequence}`],
    model_version: "fixture-v1",
    calculated_at: NOW,
  };

  const bidPlan = {
    bid_plan_id: `fixture-bid-${sequence}`,
    property_id: propertyId,
    target_bid: 8_000,
    hard_max_bid: 12_000,
    currency: "USD",
    formula_version: "fixture-v1",
    scenario: {
      exit_value_low: 35_000,
      exit_value_base: 45_000,
      exit_value_high: 55_000,
      repair_low: 10_000,
      repair_base: 15_000,
      repair_high: 22_000,
      transaction_costs: 4_000,
      holding_cost_base: 3_000,
      financing_cost_base: 2_000,
      legal_title_reserve: 2_500,
      title_insurance_cost_estimate: 1_200,
      contingency: 3_000,
      required_profit: 8_000,
    },
    input_classification: {
      exit_value_base: "source_derived",
      repair_base: "operator_entered",
      transaction_costs: "default",
    },
    sensitivity_results: null,
    blocking_gates: [],
    warning_gates: ["condition_review"],
    evidence_ids: [`fixture-evidence-bid-${sequence}`],
    calculated_at: NOW,
    fresh_until: FRESH_UNTIL,
  };

  return {
    schema_version: SCHEMA_VERSION,
    envelope_timestamp: NOW,
    identity: {
      property_id: propertyId,
      auction_item_ids: [auctionItemId],
      parcel_id_normalized: parcelId,
      parcel_id_raw_variants: [parcelId, `00-${1000000000 + sequence}`],
      address_normalized: address,
      address_raw_variants: [address],
      municipality: "Detroit",
      zip: "48200",
      gis_identifiers: [],
      match_status: "verified",
      match_confidence: "high",
      identity_evidence_ids: [`fixture-evidence-identity-${sequence}`],
      created_at: NOW,
      updated_at: NOW,
    },
    auction: {
      auction_item_id: auctionItemId,
      status: "listed",
      batch_id: "FIXTURE-BATCH",
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
      asset_class_confidence: "medium",
      asset_class_raw_label: "SYNTHETIC FIXTURE",
      structure_status: "improved_property",
      occupancy_status: "unknown",
    },
    characteristics: {
      property_id: propertyId,
      asset_class: "single_family",
      asset_class_confidence: "medium",
      asset_class_raw_label: "SYNTHETIC FIXTURE",
      structure_status: "improved_property",
      structure_status_signals: ["synthetic_fixture"],
      exterior_material: "brick",
      exterior_material_confidence: "medium",
      year_built: 1930,
      total_sqft: 1_400,
      unit_count: 1,
      stories: 1,
      bedrooms: 3,
      bathrooms: 1,
      has_basement: true,
      has_garage: null,
      roof_condition_known: false,
      foundation_condition_known: false,
      occupancy_status: "unknown",
      occupancy_confidence: "unresolved",
    },
    parcel: {
      parcel_id: parcelId,
      property_id: propertyId,
      geometry_wkt: null,
      lot_area_sqft: 4_000,
      lot_frontage_ft: 40,
      lot_depth_ft: 100,
      legal_description: SYNTHETIC_FIXTURE_NOTICE,
      assessor_property_class: "FIXTURE",
      assessed_value_land: 1_000,
      assessed_value_building: 6_000,
      assessed_value_total: 7_000,
      taxable_value: 7_000,
      source_id: "fixture_source",
      source_effective_date: NOW,
      captured_at: NOW,
    },
    zoning: null,
    environmental: null,
    neighborhood: null,
    strategy,
    bid_plan: bidPlan,
    scenarios: { repair: null, finance: null, comparable_set: null },
    risks: {
      blocking_gates: [],
      warning_gates: [
        {
          gate_type: "condition_review",
          severity: "warning",
          status: "open",
          reason: "Synthetic fixture has no field inspection",
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
      total_evidence_count: 3,
      high_confidence_count: 1,
      conflicted_count: 0,
      evidence_ids: [
        `fixture-evidence-identity-${sequence}`,
        `fixture-evidence-strategy-${sequence}`,
        `fixture-evidence-bid-${sequence}`,
      ],
    },
    source_health: {
      sources_used: ["fixture_source"],
      degraded_sources: [],
      unavailable_sources: [],
      last_source_check: NOW,
    },
    confidence: "medium",
    fidelity_status: "incomplete",
    epistemic_summary: {
      fact_count: 1,
      signal_count: 1,
      estimate_count: 1,
      unknown_count: 5,
    },
    missing_information: ["Title research", "Field inspection"],
    known_unknowns: ["Roof condition", "Foundation condition", "Occupancy"],
    human_escalations: [],
    recommendation: {
      recommendation_id: `fixture-recommendation-${sequence}`,
      property_id: propertyId,
      model_version: "fixture-v1",
      decision_state: "research",
      strategy,
      bid_plan: bidPlan,
      risks: {
        blocking: [],
        warnings: [
          {
            gate_type: "condition_review",
            severity: "warning",
            status: "open",
            reason: "Synthetic fixture has no field inspection",
            evidence_ids: [],
            reviewed_at: null,
            reviewed_by: null,
          },
        ],
        reviewed_at: null,
      },
      explanation: {
        why: ["Synthetic fixture for contract verification"],
        counter_signals: ["No real-world inference is permitted"],
        missing_information: ["Title research", "Field inspection"],
        evidence_count: 3,
      },
      fidelity_status: "incomplete",
      calculated_at: NOW,
      fresh_until: FRESH_UNTIL,
    },
    operator: {
      notes: [SYNTHETIC_FIXTURE_NOTICE],
      decisions: [],
      feedback: [],
    },
    decision_state: "research",
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
}

function validate(raw: Record<string, unknown>): PropertyEnvelope {
  return PropertyEnvelopeSchema.parse(raw);
}

export function makePropertyEnvelopeFixture(
  scenario: PropertyEnvelopeFixtureScenario = "valid",
  sequence = 1,
): PropertyEnvelope {
  const raw = makeRawEnvelope(sequence);

  switch (scenario) {
    case "valid":
      break;
    case "incomplete": {
      raw.parcel = null;
      raw.zoning = null;
      raw.environmental = null;
      raw.neighborhood = null;
      raw.title = null;
      raw.confidence = "low";
      raw.fidelity_status = "incomplete";
      raw.decision_state = "research";
      raw.ingestion_state = "ENRICHMENT_QUEUED";
      raw.missing_information = [
        "Parcel attributes",
        "Zoning",
        "Environmental review",
        "Title research",
        "Market comparables",
      ];
      const bidPlan = raw.bid_plan as Record<string, unknown>;
      bidPlan.target_bid = null;
      bidPlan.hard_max_bid = null;
      bidPlan.scenario = Object.fromEntries(
        Object.keys(bidPlan.scenario as Record<string, unknown>).map((key) => [key, null]),
      );
      break;
    }
    case "stale": {
      const auction = raw.auction as Record<string, unknown>;
      auction.is_stale = true;
      auction.fresh_until = STALE_AT;
      raw.decision_state = "stale";
      raw.ingestion_state = "STALE";
      (raw.bid_plan as Record<string, unknown>).fresh_until = STALE_AT;
      (raw.recommendation as Record<string, unknown>).fresh_until = STALE_AT;
      break;
    }
    case "blocked": {
      const blockingGate = {
        gate_type: "title_professional_review",
        severity: "blocking",
        status: "open",
        reason: "Professional title report is missing",
        evidence_ids: [],
        reviewed_at: null,
        reviewed_by: null,
      };
      raw.decision_state = "blocked";
      raw.ingestion_state = "BLOCKED";
      (raw.risks as Record<string, unknown>).blocking_gates = [blockingGate];
      const bidPlan = raw.bid_plan as Record<string, unknown>;
      bidPlan.blocking_gates = ["title_professional_review"];
      bidPlan.hard_max_bid = null;
      const recommendation = raw.recommendation as Record<string, unknown>;
      recommendation.decision_state = "blocked";
      (recommendation.risks as Record<string, unknown>).blocking = [blockingGate];
      break;
    }
    case "conflicting_identity": {
      const identity = raw.identity as Record<string, unknown>;
      identity.match_status = "conflict";
      identity.match_confidence = "low";
      identity.parcel_id_raw_variants = [
        identity.parcel_id_normalized,
        `conflicting-fixture-parcel-${sequence}`,
      ];
      identity.address_raw_variants = [
        identity.address_normalized,
        `${2000 + sequence} Conflicting Fixture Ave, Detroit, MI 48200`,
      ];
      raw.decision_state = "blocked";
      raw.ingestion_state = "IDENTITY_EXCEPTION";
      break;
    }
    case "missing_evidence": {
      raw.evidence_summary = {
        total_evidence_count: 0,
        high_confidence_count: 0,
        conflicted_count: 0,
        evidence_ids: [],
      };
      raw.confidence = "unresolved";
      raw.missing_information = ["All source evidence is missing"];
      raw.known_unknowns = ["Property facts cannot be established without evidence"];
      raw.decision_state = "research";
      break;
    }
    case "source_degraded": {
      raw.source_health = {
        sources_used: ["fixture_source"],
        degraded_sources: ["fixture_source"],
        unavailable_sources: [],
        last_source_check: NOW,
      };
      const warning = {
        gate_type: "auction_status_fresh",
        severity: "warning",
        status: "open",
        reason: "Synthetic source is degraded",
        evidence_ids: [],
        reviewed_at: null,
        reviewed_by: null,
      };
      (raw.risks as Record<string, unknown>).warning_gates = [warning];
      (raw.recommendation as Record<string, unknown>).risks = {
        blocking: [],
        warnings: [warning],
        reviewed_at: null,
      };
      break;
    }
  }

  return validate(raw);
}

function asPromoted(envelope: PropertyEnvelope, sequence: number): PropertyEnvelope {
  return PropertyEnvelopeSchema.parse({
    ...envelope,
    promotion: {
      is_promoted: true,
      promoted_at: NOW,
      promotion_id: `fixture-promotion-${sequence}`,
      last_synced_at: null,
    },
  });
}

export function makeMobileCardinalityBoundaryFixtures(): {
  atLimit: PropertyEnvelope[];
  overLimit: PropertyEnvelope[];
} {
  const overLimit = Array.from({ length: 31 }, (_, index) => {
    const sequence = index + 1;
    return asPromoted(makePropertyEnvelopeFixture("valid", sequence), sequence);
  });

  return { atLimit: overLimit.slice(0, 30), overLimit };
}
