# Build Work Queue

This queue is ordered by dependency. Do not jump forward in a way that forces later layers to invent contracts that earlier layers should own.

## W0 — Repository and source-package bootstrap
Owner: GPT Cloud / Foreman
Review: GPT Other Profile
Acceptance: governance present; Build Asset manifest present; no secrets/private data committed; repo structure understandable without Drive.

## W1 — Shared domain contracts
Primary builder: GPT Work
Independent review: GPT Other Profile
Deliverables:
- PropertyIdentity
- PropertyEnvelope
- Evidence
- SourceHealth
- Recommendation
- HumanEscalation
- PromotionSnapshot
- ExportMetadata
- runtime validators
- contract tests and representative fixtures
Acceptance: one model can flow research → promotion → mobile → export without incompatible remapping.

## W2 — SQLite research persistence
Primary builder: GPT Work
Review: GPT Cloud + GPT Other Profile
Deliverables: migrations, repository layer, evidence relationships, source-health history, recommendation versions, operator actions, promotion history, backup/restore procedure.
Acceptance: migration tests plus round-trip persistence tests for representative Property Envelopes.

## W3 — Source-adapter framework
Primary builder: GPT Work
Complement: Tab for fixtures/contract checks; GPT Other Profile for adversarial review
Deliverables: adapter interface, registry, health state machine, timestamps, schema/version metadata, evidence/provenance capture, graceful failure path, human escalation.
Acceptance: mock source can demonstrate success, degradation, outage, schema drift and human-only states without corrupting prior evidence.

## W4 — Wayne County identity/source proof
Primary builder: GPT Work
Foreman: GPT Cloud
Independent verification: GPT Other Profile
Deliverables: deterministic identity rules and precedence, live-source validation notes, conflict queue behavior, fixture set drawn from allowed non-private examples.
Acceptance: conflicts surface; address-only matching cannot silently override stronger parcel identity.

## W5 — Desktop Research Workbench
Primary builder: GPT Work
Complement: Tab for component/test packets
Acceptance: research corpus can ingest, inspect, filter, score, compare, reject/reconsider and shortlist without putting full corpus in Firestore.

## W6 — Promotion Gate
Primary builder: GPT Work
Independent review: GPT Other Profile
Acceptance: explicit operator action validates envelope, captures schema/version/time, preserves blockers/warnings, and produces a deterministic field projection. Demotion never deletes desktop research.

## W7 — Firestore projection + security
Primary builder: GPT Work
Review: GPT Cloud + GPT Other Profile
Acceptance: only promoted data is published; rules/auth configured before real property data; projection remains small; sync metadata has clear authority.

## W8 — Mobile Field Cockpit
Primary builder: GPT Work
Complement: Tab for narrow UI/fixture work
Acceptance: mobile reads promoted projection only, preserves existing Ashante visual/status language, tolerates imperfect connectivity, and exposes warnings/freshness/source health.

## W9 — Portable Property Envelope export
Primary builder: GPT Work
Independent review: GPT Other Profile
Acceptance: self-contained HTML includes complete snapshot, versions and export time, remains readable independently of backend; secondary exports do not silently lose nested data.

## W10 — System validation and deployment
Primary builder: GPT Work
Foreman: GPT Cloud
Independent verification: GPT Other Profile + Tab bounded checks
Acceptance: end-to-end promotion/sync, failure tests, security tests, mobile-device behavior, backup/recovery, secrets posture, build/deploy evidence, Vercel configuration.

## Current release posture
Start W1 only after W0 context is sufficiently mirrored into GitHub for the GitHub-only reviewer to operate without Google Drive.
