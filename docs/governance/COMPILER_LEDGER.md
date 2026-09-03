# Compiler Ledger

Status: ACTIVE
Repository: `digital-Alchemy-mcmg/AWayneCA`
Authority: `FOREMAN.md`, `docs/governance/BUILD_CONTRACT.md`, and frozen Build Assets.

This is the pickup surface for standing compiler workers and the verifier. Scheduled runner prompts identify the role; this ledger identifies the current work.

## Runner protocol

1. Read this ledger before doing any work.
2. Read the latest receipts and repository state.
3. Take only the first eligible assignment addressed to the runner's role.
4. Do not begin an assignment whose dependency lacks a passing receipt.
5. Record claim time, branch/commit, outcome, evidence, and PASS/BLOCKED/FAILED state.
6. Do not repair work while acting as verifier.
7. If no eligible assignment exists, record no claim and exit without inventing work.
8. A newer explicit operator or foreman instruction overrides the scheduled poll.

## Active assignments

### COMPILER-000 — Environment baseline
Role: WORKER
Preferred runner: WORKER-1
State: PASS
Dependencies: none
Scope: Prepare the pinned compiler environment, strict TypeScript, reproducible install/typecheck/test/build commands, environment schema, canonical directories, and local-only SQLite versus browser/Vercel separation.
Receipt required: changed files, commands, results, assumptions, gaps, exact commit, PASS/BLOCKED.

### COMPILER-001 — Data-spine reconciliation
Role: WORKER
Preferred runner: WORKER-2
State: PASS
Dependencies: passing COMPILER-000 receipt
Scope: Hash and compare the schema-freeze copies; reconcile and import the canonical contract, validators, and validation tests; run type-check and validation tests; return field-level traceability.
Receipt required: comparison result, selected authority, changed files, commands, test results, discrepancies, exact commit, PASS/BLOCKED.

### VERIFY-000-001 — Verify compiler stages 0 and 1
Role: VERIFIER
Preferred runner: VERIFIER-1
State:### VERIFY-000-001 — Verify compiler stages 0 and 1
Role: VERIFIER
Preferred runner: VERIFIER-1
 CLAIMED
Dependencies: passing receipts and exact commits for COMPILER-000 and COMPILER-001
Scope: Independently verify environment reproducibility, runtime boundaries, schema reconciliation, validator/test alignment, UI-required fields, Build Contract invariants, and traceability. Do not repair.
Receipt required: PASS/FAILED/BLOCKED with exact evidence and variances. Only PASS may open SQLite certification.

## Bounded fallback queue

Use this queue only when the primary compiler assignment is blocked or no higher-priority eligible packet exists. Fallback work must produce reusable evidence or fixtures and may not alter frozen architecture.

### RESEARCH-001 — Source capability cards
Role: WORKER
State: PASS
Scope: Build one evidence-based capability card per planned source: DS_Auction, DS_GIS, DS_BSEED, DS_Env, DS_Title, DS_MLS, and DS_Imagery. Record access method, expected fields, authority level, refresh pattern, failure modes, legal/access limitations, cost tier, and human escalation. Do not claim a source is operational without live proof.

### PREPROCESS-001 — Auction-data normalization plan
Role: WORKER
State: PASS
Scope: Using permitted source snapshots and existing contracts, document deterministic normalization, identity, deduplication, missing-value, conflict, and provenance rules. Produce test vectors; do not silently resolve ambiguous parcel identities.

### FIXTURE-001 — Property Envelope fixture factory
Role: WORKER
State: WAITING_ON_COMPILER-001
Dependencies: passing canonical schema/validator receipt
Scope: Create synthetic, non-private Property Envelope fixtures covering valid, incomplete, stale, blocked, conflicting-identity, missing-evidence, source-degraded, and 30-envelope boundary cases. Fixtures must validate against the canonical contract and must never masquerade as real properties.

### TRACE-001 — UI-to-envelope crosswalk
Role: WORKER
State: WAITING_ON_COMPILER-001
Dependencies: passing canonical schema/validator receipt
Scope: Map every field required by the frozen Desktop Workbench and Mobile Field Cockpit to its canonical Property Envelope path, evidence requirement, freshness behavior, and empty/unknown state. Report gaps; do not add fields unilaterally.

### FAILURE-001 — Source-health scenarios
Role: WORKER
State: WAITING_ON_W3_INTERFACE
Dependencies: accepted adapter/source-health interface
Scope: Create fixtures and expected behavior for source success, degradation, outage, schema drift, human-only state, stale-but-preserved evidence, and recovery.

## Fallback prohibitions

- No filler features, speculative screens, or architecture changes.
- No automated title conclusions or manufactured title clearance.
- No inference presented as verified property fact.
- No live/private property data committed to Git.
- No scraping that violates source terms or bypasses access controls.
- No promotion of research output into production authority without the required verification gate.

## Claims and receipts

Append runner claims and receipts below this line. Preserve history; do not rewrite prior entries.


### CLAIM — COMPILER-000
- Claim time: `2026-09-02T20:42:26Z`
- Runner: `WORKER-1`
- Assignment: `COMPILER-000 — Environment baseline`
- Branch: `main` (no separate branch was named by the packet; repository default is the authorized integration branch)
- State: `CLAIMED`


### RECEIPT — COMPILER-000
- Claim time: `2026-09-02T20:42:26Z`
- Completion time: `2026-09-02T20:52:34Z`
- Runner: `WORKER-1`
- State: `PASS`
- Exact implementation commit: `7e15b9291c7df0c7eb5bc09ec35cc3154adea6f1`
- Branch: `main`
- Changed files:
  - Compiler and delivery: `.nvmrc`, `package.json`, `package-lock.json`, `tsconfig.json`, `next-env.d.ts`, `next.config.ts`, `vitest.config.ts`, `vercel.json`.
  - Environment and boundaries: `.env.example`, `.gitignore`, `src/config/env.ts`, `src/server/runtime-policy.ts`, `src/server/persistence/sqlite-runtime.ts`, `docs/architecture/RUNTIME_BOUNDARIES.md`.
  - Canonical skeleton: `src/app/*`, `src/client/README.md`, `src/domain/README.md`, `src/server/adapters/README.md`, `src/server/promotion/README.md`, `migrations/README.md`.
  - Verification and operator entry points: `tests/env.test.ts`, `tests/runtime-policy.test.ts`, `.github/workflows/ci.yml`, `README.md`.
- Commands and results:
  - `npm install --package-lock-only --ignore-scripts` — PASS; npm lockfile generated from exact direct dependency pins.
  - `npm ci` — PASS; 78 packages installed from the lockfile.
  - `npm run typecheck` — PASS under strict TypeScript plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
  - `npm test` — PASS; 2 files, 5 tests covering environment parsing and local-SQLite runtime rejection on Vercel/Edge.
  - `npm run build` — PASS; Next.js 16.3.4 production build generated static `/` and `/_not-found` routes.
  - `npm run verify` — PASS; typecheck, test, and build completed in sequence.
  - `git diff --check` — PASS.
  - `vercel --version && vercel whoami` — BLOCKED locally because the Vercel CLI is not installed; no secret values were inspected or printed.
  - Vercel connector preflight — PASS for account access; team `metconmg` is visible. No project linked to `digital-Alchemy-mcmg/AWayneCA` exists.
- Assumptions:
  - The default branch `main` is authorized because the packet names no separate work branch.
  - Node 24 is the pinned compiler major because it is Vercel's current default supported LTS; local patch pin is `24.19.0`.
  - COMPILER-000 creates boundaries and a buildable shell only; it does not select a SQLite driver, import the Property Envelope, implement Firestore, or realize the frozen UI.
- Gaps / downstream gates:
  - No Vercel project was created or linked; foreman selection/authorization and CLI/link setup remain required before cloud-dependent dev/deploy checks.
  - SQLite driver and migrations remain closed until COMPILER-001 reconciles the canonical contract.
  - GitHub Actions was added, but no workflow run was yet attached when the receipt was written; local clean-install evidence is passing.
- Invariant check: PASS. SQLite remains local authoritative storage; Vercel/browser paths cannot open it; Firestore remains a future promoted-projection boundary; no UI structure or Property Envelope field was invented.


### CLAIM — COMPILER-001
- Claim time: `2026-09-02T21:14:45Z`
- Runner: `WORKER-2`
- Assignment: `COMPILER-001 — Data-spine reconciliation`
- Branch: `main` (packet names no separate work branch; repository default remains the integration branch)
- Dependency: COMPILER-000 PASS at `7e15b9291c7df0c7eb5bc09ec35cc3154adea6f1`
- State: `CLAIMED`


### CLAIM — RESEARCH-001
- Claim time: `2026-09-03T00:48:18Z`
- Runner: `WORKER-1`
- Assignment: `RESEARCH-001 — Source capability cards`
- Branch: `main` (packet names no separate work branch; repository default remains the integration branch)
- Eligibility: COMPILER-001 is already claimed by WORKER-2; this bounded fallback packet is the first unclaimed WORKER assignment available to WORKER-1.
- State: `CLAIMED`


### RECEIPT — RESEARCH-001
- Claim time: `2026-09-03T00:48:18Z`
- Completion time: `2026-09-03T00:51:00Z`
- Runner: `WORKER-1`
- State: `PASS`
- Exact implementation commit: `5c8c35190cb26b917b185072466ccc2b2db70d61`
- Branch: `main`
- Changed files:
  - `docs/research/SOURCE_CAPABILITY_CARDS.md` — seven evidence-based capability cards plus cross-source precedence and next-proof gates.
- Commands / checks and results:
  - Read `docs/governance/COMPILER_LEDGER.md`, `FOREMAN.md`, `docs/governance/BUILD_CONTRACT.md`, `docs/governance/WORK_QUEUE.md`, and latest commits — PASS; COMPILER-001 was already claimed by WORKER-2, making RESEARCH-001 the first eligible unclaimed WORKER packet for WORKER-1.
  - Current primary-source review — PASS for documented/discoverable access evidence covering official Wayne County Treasurer, Wayne County GIS/ArcGIS, Detroit Open Data/BSEED, FEMA, EPA, Wayne County Register of Deeds, RESO, and Google Maps Platform documentation.
  - Packet completeness check — PASS; exactly seven cards found: DS_Auction, DS_GIS, DS_BSEED, DS_Env, DS_Title, DS_MLS, and DS_Imagery.
  - Required-dimension count — PASS; documented access, expected fields, refresh pattern, failure modes, legal/access limits and cost, human escalation, and evidence/confidence each appear once in all seven cards.
  - Operational-claim guard — PASS; the document explicitly certifies no production adapter and labels every integration NOT OPERATIONAL/UNPROVEN, GATED, or HUMAN-ONLY.
  - Exact commit inspection — PASS; commit contains only the research artifact.
- Assumptions:
  - `main` is authorized because the packet names no separate branch.
  - “Expected fields” are separated into directly observed/documented fields and candidates requiring live schema proof; candidates are not promoted contracts.
  - Cost tiers are planning categories, not procurement approvals or price guarantees.
  - A live public documentation/service response proves discoverability only, not adapter reliability, permission for bulk use, or production readiness.
- Gaps / downstream gates:
  - No source adapter, credentials, full-corpus pull, authenticated title search, MLS agreement, billable imagery request, or source SLA was tested.
  - Auction has no proven supported bulk API/stable machine contract.
  - GIS full-corpus extraction/rate behavior and BSEED per-layer schema pinning remain open.
  - Title remains mandatory human/transactional; MLS remains license-gated; imagery remains metered/terms-constrained.
  - W3 adapter/source-health contract and W4 Wayne County identity/source proof must pass before any source is promoted operational.
- Invariant check: PASS. No canonical Property Envelope field, UI structure, storage boundary, promotion gate, source authority, or human-title limitation changed. No private/live property data or source evidence was committed.


### RECEIPT — COMPILER-001
- Claim time: `2026-09-02T21:14:45Z`
- Completion time: `2026-09-03T01:16:20Z`
- Runner: `WORKER-2`
- State: `PASS`
- Exact implementation commit: `496f41631bd432365bf2f0be98949d721141449b`
- Branch: `main`
- Dependency: COMPILER-000 PASS at `7e15b9291c7df0c7eb5bc09ec35cc3154adea6f1`
- Comparison and selected authority:
  - Both schema-freeze copies are exact duplicates: 40,868 bytes each; SHA-256 `2ba4bd1dfc2cbbead02e3788ca5375c8cf54241641a65d8e4021416dffa8b9b7`.
  - One canonical repository copy is carried at `src/domain/property-envelope.ts`; neither duplicate source copy was preferred semantically.
  - Source artifact hashes are recorded in `docs/data-spine/RECONCILIATION_REPORT.md`: validators `516551d4f2d559679c35112e481260d57cdf0f46531fab1a9c5aa2d439d3fb78`; validation tests `6ba939a9c0b89842649e2d3a6bd8b71bb9c1f3e58f201b42e32fd1174d9bbae7`; traceability `0a7fccd968cc94cca45e7c4f049cb60d759da8d1e89a08698156263b79a57e84`; SQLite DDL `c13e9f719878ef428f82a8e74776f527a5a4ce4c19743df9dfbb193e131653b1`.
- Changed files:
  - Canonical domain: `src/domain/property-envelope.ts`, `src/domain/index.ts`, `src/domain/README.md`.
  - Runtime validation: `src/domain/validation/property-envelope.ts`, `src/domain/validation/index.ts`.
  - Contract/tests: `src/domain/__tests__/property-envelope.validation.test.ts`, `src/domain/__tests__/property-envelope.contract-parity.test.ts`, `src/domain/__tests__/property-envelope.type-parity.ts`.
  - Evidence: `docs/data-spine/FIELD_TRACEABILITY.csv`, `docs/data-spine/SOURCE_TRACEABILITY.csv`, `docs/data-spine/RECONCILIATION_REPORT.md`.
- Commands and results:
  - Source artifact byte hashing/comparison — PASS; the two schema candidates are byte-identical.
  - `npm ci` — PASS; 78 packages installed from the lockfile in a fresh checkout of the exact implementation commit.
  - `npm run typecheck` — PASS under strict TypeScript.
  - `npm test` — PASS; 4 files, 32 tests.
  - `npm run build` — PASS; Next.js 16.3.4 production build generated static `/` and `/_not-found`.
  - `npm run verify` — PASS; clean typecheck, test, and build sequence.
  - `git diff --check` — PASS.
  - Field traceability row check — PASS; 356 canonical field rows plus header.
  - Exact implementation checkout remained clean at `496f41631bd432365bf2f0be98949d721141449b`.
- Reconciliations / discrepancies:
  - Thirteen source Zod enum validators restated string arrays and inferred outputs incompatible with the frozen TypeScript enum types. Validators now import/use the canonical enum objects; no enum member or accepted runtime value changed.
  - The supplied validation-test artifact is truncated during scenario 3 despite source documentation claiming a complete 46-case suite. The repository completes only the evident assertion/closing syntax and adds new invariant/parity tests. The passing repository total is 32 tests and is not represented as the claimed original 46.
  - The supplied SQLite DDL is also truncated: 29 observed `CREATE TABLE` statements rather than the documented 49-table total. It was inspected but not imported or certified. SQLite certification remains closed.
  - Bid normalization preserves deterministic identity so the planned roughly 30,000-record ingest establishes normalization habits and later refreshes update stable records instead of manufacturing duplicates; ambiguous identities remain explicit exceptions.
- Assumptions:
  - `main` is authorized because the packet names no separate work branch.
  - The frozen TypeScript schema remains semantic authority. Repairs were limited to making validators type-compatible and reconstructing the visibly truncated test boundary; no invariant was altered.
  - Field traceability covers all 31 validator-backed canonical interfaces and 356 fields; runtime top-level parity separately asserts the exact 34 Property Envelope keys.
- Gaps / downstream gates:
  - Independent VERIFY-000-001 review is still required before SQLite certification.
  - The source package's 46-test and 49-table completion claims conflict with the raw artifacts. The repository truth is 32 passing tests and an unpromoted 29-table partial DDL.
  - No source adapter, SQLite persistence, Firestore projection, promotion implementation, UI implementation, or Vercel project was certified by this packet.
- Invariant check: PASS. The canonical Property Envelope, UI lock, desktop/SQLite authority, explicit promotion boundary, bounded Firestore projection, title-human workflow, roof/freshness/bid blockers, and source-health semantics remain unchanged.


### CLAIM — PREPROCESS-001
- Claim time: `2026-09-03T01:43:19Z`
- Runner: `WORKER-1`
- Assignment: `PREPROCESS-001 — Auction-data normalization plan`
- Branch: `main` (packet names no separate work branch; repository default remains the integration branch)
- Eligibility: no higher-priority unclaimed WORKER packet exists; VERIFY-000-001 is verifier-owned.
- State: `CLAIMED`


### RECEIPT — PREPROCESS-001
- Claim time: `2026-09-03T01:43:19Z`
- Completion time: `2026-09-03T01:47:41Z`
- Runner: `WORKER-1`
- State: `PASS`
- Exact implementation commit: `0f36e5906522083d5b9daa026a2e46ca67aaf9b3`
- Branch: `main`
- Changed files:
  - `docs/data-spine/AUCTION_NORMALIZATION_PLAN.md` — deterministic normalization, identity, update, deduplication, missing-value, conflict, provenance, batch/replay, and downstream-gate rules.
  - `tests/fixtures/auction-normalization-vectors.json` — 12 synthetic normative vectors.
- Commands and results:
  - Read the live ledger, Build Contract, COMPILER-001 reconciliation report, source capability cards, and latest receipts — PASS; PREPROCESS-001 was the first eligible unclaimed WORKER packet.
  - JSON parse/fixture invariant check — PASS; 12 vectors, 12 unique IDs, `synthetic_only: true`.
  - Required plan-section check — PASS for deterministic normalization, match/update decision table, deduplication/replay, missing/conflict handling, provenance, 30,000-row operating pattern, and future acceptance tests.
  - `git diff --check` — PASS.
  - Local commit assembly — PASS. Direct local push was unavailable because the runner had no interactive GitHub credentials; identical file blobs/tree were published through the authenticated repository connector.
  - Exact remote commit inspection — PASS; exactly the two scoped files are present at `0f36e5906522083d5b9daa026a2e46ca67aaf9b3`.
- Assumptions:
  - `main` is authorized because the packet names no separate branch.
  - Work-value names such as `parcel_comparison_key` describe preprocessing and do not add fields to the frozen Property Envelope.
  - Source-specific parcel display formats and sentinel lists remain versioned adapter-profile details pending W3/W4 proof.
  - The first roughly 30,000-row ingest establishes stable records; later deliveries should primarily replay or update them. Creation remains an explicit identity-decision outcome, not the default refresh behavior.
- Gaps / downstream gates:
  - This packet specifies behavior and vectors; it does not implement a source adapter, database schema, normalizer runtime, or live ingestion.
  - W3 must establish the adapter/source-health interface, W4 must validate Wayne County identity/source precedence, and SQLite certification must supply complete constraints before implementation.
  - No live/private property payload, authenticated source session, or bulk source pull was used.
- Invariant check: PASS. Raw evidence remains preserved; parcel IDs stay string-safe with leading zeroes; address-only matches cannot silently merge; conflicts remain explicit; auction minimum bid cannot become target/hard maximum; no UI or canonical Property Envelope structure changed.


### CLAIM — VERIFY-000-001
- Claim time: `2026-09-03T02:04:25Z`
- Runner: `VERIFIER-1`
- Assignment: `VERIFY-000-001 — Verify compiler stages 0 and 1`
- Branch: `main` (ledger-only verification record; implementation commits are inspected without modification)
- Dependencies: COMPILER-000 PASS at `7e15b9291c7df0c7eb5bc09ec35cc3154adea6f1`; COMPILER-001 PASS at `496f41631bd432365bf2f0be98949d721141449b`.
- State: `CLAIMED`
