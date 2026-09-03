import { describe, expect, it } from "vitest";

import { PropertyEnvelopeSchema } from "../src/domain/validation/property-envelope";
import {
  SYNTHETIC_FIXTURE_NOTICE,
  makeMobileCardinalityBoundaryFixtures,
  makePropertyEnvelopeFixture,
  type PropertyEnvelopeFixtureScenario,
} from "./fixtures/property-envelope-factory";

const scenarios: PropertyEnvelopeFixtureScenario[] = [
  "valid",
  "incomplete",
  "stale",
  "blocked",
  "conflicting_identity",
  "missing_evidence",
  "source_degraded",
];

describe("synthetic Property Envelope fixture factory", () => {
  it.each(scenarios)("returns a canonical-valid %s envelope", (scenario) => {
    const fixture = makePropertyEnvelopeFixture(scenario);
    expect(PropertyEnvelopeSchema.safeParse(fixture).success).toBe(true);
    expect(fixture.identity.property_id).toMatch(/^fixture-property-/);
    expect(fixture.operator.notes).toContain(SYNTHETIC_FIXTURE_NOTICE);
  });

  it("represents incomplete data with nulls and unknowns, not invented facts", () => {
    const fixture = makePropertyEnvelopeFixture("incomplete");
    expect(fixture.parcel).toBeNull();
    expect(fixture.bid_plan.target_bid).toBeNull();
    expect(fixture.bid_plan.hard_max_bid).toBeNull();
    expect(fixture.missing_information.length).toBeGreaterThan(0);
  });

  it("preserves stale state and timestamps visibly", () => {
    const fixture = makePropertyEnvelopeFixture("stale");
    expect(fixture.auction.is_stale).toBe(true);
    expect(fixture.decision_state).toBe("stale");
    expect(fixture.ingestion_state).toBe("STALE");
  });

  it("keeps blocking gates blocking and removes the hard cap", () => {
    const fixture = makePropertyEnvelopeFixture("blocked");
    expect(fixture.risks.blocking_gates).toHaveLength(1);
    expect(fixture.bid_plan.blocking_gates).toContain("title_professional_review");
    expect(fixture.bid_plan.hard_max_bid).toBeNull();
  });

  it("surfaces identity conflict without resolving it by address", () => {
    const fixture = makePropertyEnvelopeFixture("conflicting_identity");
    expect(fixture.identity.match_status).toBe("conflict");
    expect(fixture.identity.parcel_id_raw_variants).toHaveLength(2);
    expect(fixture.ingestion_state).toBe("IDENTITY_EXCEPTION");
  });

  it("preserves a degraded source as an explicit warning", () => {
    const fixture = makePropertyEnvelopeFixture("source_degraded");
    expect(fixture.source_health.degraded_sources).toEqual(["fixture_source"]);
    expect(fixture.risks.warning_gates[0]?.gate_type).toBe("auction_status_fresh");
    expect(fixture.risks.warning_gates[0]?.reason).toContain("degraded");
  });

  it("provides distinct canonical-valid 30 and 31 item boundary sets", () => {
    const { atLimit, overLimit } = makeMobileCardinalityBoundaryFixtures();
    expect(atLimit).toHaveLength(30);
    expect(overLimit).toHaveLength(31);
    expect(new Set(overLimit.map((item) => item.identity.property_id)).size).toBe(31);
    expect(overLimit.every((item) => item.promotion.is_promoted)).toBe(true);
    expect(overLimit.every((item) => PropertyEnvelopeSchema.safeParse(item).success)).toBe(true);
  });
});
