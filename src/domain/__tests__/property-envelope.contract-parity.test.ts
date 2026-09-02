import { describe, expect, it } from "vitest";

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
import {
  AccessModeSchema,
  AssetClassSchema,
  AuthorityRankSchema,
  ConfidenceSchema,
  DecisionStateSchema,
  EpistemicStateSchema,
  FidelityStatusSchema,
  IngestionStateSchema,
  PropertyEnvelopeSchema,
  RecommendedActionSchema,
  ReviewGateTypeSchema,
  SourceOperationalStatusSchema,
  StructureStatusSchema,
  TitleStatusSchema,
} from "../validation/property-envelope";

const enumPairs = [
  [EpistemicState, EpistemicStateSchema],
  [Confidence, ConfidenceSchema],
  [FidelityStatus, FidelityStatusSchema],
  [AssetClass, AssetClassSchema],
  [StructureStatus, StructureStatusSchema],
  [RecommendedAction, RecommendedActionSchema],
  [DecisionState, DecisionStateSchema],
  [ReviewGateType, ReviewGateTypeSchema],
  [SourceOperationalStatus, SourceOperationalStatusSchema],
  [AuthorityRank, AuthorityRankSchema],
  [AccessMode, AccessModeSchema],
  [TitleStatus, TitleStatusSchema],
  [IngestionState, IngestionStateSchema],
] as const;

describe("canonical contract/runtime parity", () => {
  it.each(enumPairs)("keeps a canonical enum and its Zod schema identical", (canonical, schema) => {
    expect([...schema.options].sort()).toEqual(Object.values(canonical).sort());
  });

  it("keeps every canonical PropertyEnvelope top-level field in the runtime schema", () => {
    expect(Object.keys(PropertyEnvelopeSchema.shape)).toEqual([
      "schema_version",
      "envelope_timestamp",
      "identity",
      "auction",
      "classification",
      "characteristics",
      "parcel",
      "zoning",
      "environmental",
      "neighborhood",
      "strategy",
      "bid_plan",
      "scenarios",
      "risks",
      "title",
      "court_cases",
      "imagery",
      "evidence_summary",
      "source_health",
      "confidence",
      "fidelity_status",
      "epistemic_summary",
      "missing_information",
      "known_unknowns",
      "human_escalations",
      "recommendation",
      "operator",
      "decision_state",
      "ingestion_state",
      "promotion",
      "created_at",
      "updated_at",
      "last_enriched_at",
      "last_scored_at",
    ]);
  });
});
