import type * as Contract from "../property-envelope";
import type * as Runtime from "../validation/property-envelope";

type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Assert<T extends true> = T;

// Compile-time, bidirectional checks: validators may neither widen nor narrow
// any imported canonical interface. This covers every row in
// docs/data-spine/FIELD_TRACEABILITY.csv.
export type CanonicalRuntimeParity = [
  Assert<Equal<Contract.PropertyEnvelope, Runtime.PropertyEnvelope>>,
  Assert<Equal<Contract.PropertyIdentity, Runtime.PropertyIdentity>>,
  Assert<Equal<Contract.Evidence, Runtime.Evidence>>,
  Assert<Equal<Contract.AuctionItem, Runtime.AuctionItem>>,
  Assert<Equal<Contract.SourceRegistryEntry, Runtime.SourceRegistryEntry>>,
  Assert<Equal<Contract.Recommendation, Runtime.Recommendation>>,
  Assert<Equal<Contract.BidPlan, Runtime.BidPlan>>,
  Assert<Equal<Contract.Strategy, Runtime.Strategy>>,
  Assert<Equal<Contract.ReviewGate, Runtime.ReviewGate>>,
  Assert<Equal<Contract.HumanEscalation, Runtime.HumanEscalation>>,
  Assert<Equal<Contract.OperatorAction, Runtime.OperatorAction>>,
  Assert<Equal<Contract.OperatorEvidence, Runtime.OperatorEvidence>>,
  Assert<Equal<Contract.OperatorPreferences, Runtime.OperatorPreferences>>,
  Assert<Equal<Contract.PromotionSnapshot, Runtime.PromotionSnapshot>>,
  Assert<Equal<Contract.ExportRecord, Runtime.ExportRecord>>,
  Assert<Equal<Contract.AuditLogEntry, Runtime.AuditLogEntry>>,
  Assert<Equal<Contract.FieldProvenance, Runtime.FieldProvenance>>,
  Assert<Equal<Contract.ParcelAttributes, Runtime.ParcelAttributes>>,
  Assert<Equal<Contract.PropertyCharacteristics, Runtime.PropertyCharacteristics>>,
  Assert<Equal<Contract.ZoningRecord, Runtime.ZoningRecord>>,
  Assert<Equal<Contract.EnvironmentalFlags, Runtime.EnvironmentalFlags>>,
  Assert<Equal<Contract.ImageryObservation, Runtime.ImageryObservation>>,
  Assert<Equal<Contract.MarketSale, Runtime.MarketSale>>,
  Assert<Equal<Contract.ComparableSet, Runtime.ComparableSet>>,
  Assert<Equal<Contract.ComparableMember, Runtime.ComparableMember>>,
  Assert<Equal<Contract.RepairScenario, Runtime.RepairScenario>>,
  Assert<Equal<Contract.FinanceScenario, Runtime.FinanceScenario>>,
  Assert<Equal<Contract.TitleResearchCase, Runtime.TitleResearchCase>>,
  Assert<Equal<Contract.CourtResearchCase, Runtime.CourtResearchCase>>,
  Assert<Equal<Contract.NeighborhoodContext, Runtime.NeighborhoodContext>>,
  Assert<Equal<Contract.PreferenceFeedback, Runtime.PreferenceFeedback>>,
];

