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
State: PASS
Dependencies: passing receipts and exact commits for COMPILER-000 and COMPILER-001
Scope: Independently verify environment reproducibility, runtime boundaries, schema reconciliation, validator/test alignment, UI-required fields, Build Contract invariants, and traceability. Do not repair.
Receipt required: PASS/FAILED/BLOCKED with exact evidence and variances. Only PASS may open SQLite certification.

### COMPILER-002 — SQLite schema reconstruction and certification candidate
Role: WORKER
Preferred runner: WORKER-2
State: FAILED_VERIFICATION
Dependencies: VERIFY-000-001 PASS
Scope: Produce a complete, canonical-contract-derived SQLite migration candidate and schema map for the authoritative local research corpus. Cover evidence relationships, source-health history, recommendation versions, operator actions, promotion history, and string-safe identity. Add migration/schema tests. The supplied 29-table DDL is evidence only and must not be represented as complete or copied forward blindly. Do not implement adapters, Firestore, promotion, or UI.
Receipt required: derivation map, changed files, commands, migration/schema test results, table and constraint inventory, source-DDL variances, assumptions, gaps, exact commit, PASS/BLOCKED.

### VERIFY-002 — Verify SQLite certification candidate
Role: VERIFIER
Preferred runner: VERIFIER-1
State: FAILED
Dependencies: passing COMPILER-002 receipt and exact implementation commit
Scope: Independently reproduce migrations and schema tests; inspect canonical field coverage, evidence/provenance relationships, identity constraints, history/version retention, runtime isolation, and divergence from the quarantined 29-table source. Do not repair.
Receipt required: PASS/FAILED/BLOCKED with exact evidence and variances. Only PASS may certify the migration candidate for repository-layer work.

### COMPILER-002R — Restore SQLite confidence-enum parity
Role: WORKER
Preferred runner: WORKER-2
State: READY_REWORK
Dependencies: VERIFY-002 FAILED receipt
Scope: Repair only the verified confidence-value divergence in `property_identity.match_confidence`, `evidence_ledger.confidence`, and `imagery_observations.confidence`. Use the frozen canonical values `high`, `medium`, `low`, and `unresolved`; reject uppercase aliases. For imagery, cap automated street/aerial observations at medium while allowing high only for `operator_drive_by`. Update migration tests and candidate documentation. Do not alter table inventory, identity rules, promotion rules, UI, adapters, Firestore, or other architecture.
Receipt required: changed files, exact old/new constraints, focused regression results, full verification, assumptions, gaps, exact commit, PASS/BLOCKED.

### VERIFY-002R — Reverify SQLite confidence-enum parity
Role: VERIFIER
Preferred runner: VERIFIER-1
State: WAITING_ON_COMPILER-002R
Dependencies: passing COMPILER-002R receipt and exact implementation commit
Scope: Independently reproduce the three corrected canonical confidence constraints, automated-imagery ceiling, exact 49-table inventory, history retention, runtime isolation, and full suite. Do not repair.
Receipt required: PASS/FAILED/BLOCKED with exact evidence and variances. Only PASS may certify the SQLite migration candidate for repository-layer work.

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
State: PASS
Dependencies: passing canonical schema/validator receipt
Scope: Create synthetic, non-private Property Envelope fixtures covering valid, incomplete, stale, blocked, conflicting-identity, missing-evidence, source-degraded, and 30-envelope boundary cases. Fixtures must validate against the canonical contract and must never masquerade as real properties.

### TRACE-001 — UI-to-envelope crosswalk
Role: WORKER
State: READY_FALLBACK
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


### RECEIPT — VERIFY-000-001
- Claim time: `2026-09-03T02:04:25Z`
- Completion time: `2026-09-03T02:09:25Z`
- Runner: `VERIFIER-1`
- State: `PASS`
- Verification record branch: `main`
- Exact implementation commits inspected:
  - COMPILER-000: `7e15b9291c7df0c7eb5bc09ec35cc3154adea6f1`
  - COMPILER-001: `496f41631bd432365bf2f0be98949d721141449b`
- Independence / method:
  - Cloned the repository into a new checkout and detached at each exact implementation commit.
  - Re-fetched all six recorded source artifacts from their canonical Drive IDs and recomputed byte sizes, SHA-256 hashes, truncation evidence, and DDL table count.
  - Read the Build Contract, frozen UI status, reconciliation evidence, exact commit file inventories, and canonical contract without changing compiler work.
- Commands and results:
  - COMPILER-000: `npm ci` — PASS, 78 packages; `npm run verify` — PASS with strict typecheck, 2 test files / 5 tests, and Next.js 16.3.4 production build; `git diff --check` and clean-checkout status — PASS.
  - COMPILER-001: `npm ci` — PASS, 78 packages; `npm run verify` — PASS with strict typecheck, 4 test files / 32 tests, and production build; `git diff --check` and clean-checkout status — PASS.
  - Toolchain — PASS: Node `v24.19.0`, npm `11.9.0`; package engines remain Node 24 / npm 11.
  - Runtime boundary — PASS: tests reject Vercel and Edge for authoritative SQLite; client/server documentation keeps browser code away from SQLite, raw evidence, credentials, and adapters.
  - Field traceability — PASS: 357 CSV lines, comprising one header plus 356 unique canonical field paths; compile-time coverage spans 31 validator-backed interfaces; runtime parity locks all 34 top-level Property Envelope keys and 13 canonical enums.
  - UI/build invariant representation — PASS: canonical fields cover title status, roof-condition knowledge/review gates, freshness, target bid, hard maximum bid, explicit promotion, source health, provenance, and mobile lineage. No second property model or UI structural change was introduced.
  - Source byte verification — PASS: both 40,868-byte schema copies recomputed to `2ba4bd1dfc2cbbead02e3788ca5375c8cf54241641a65d8e4021416dffa8b9b7`; validators `516551d4f2d559679c35112e481260d57cdf0f46531fab1a9c5aa2d439d3fb78`; tests `6ba939a9c0b89842649e2d3a6bd8b71bb9c1f3e58f201b42e32fd1174d9bbae7`; traceability `0a7fccd968cc94cca45e7c4f049cb60d759da8d1e89a08698156263b79a57e84`; DDL `c13e9f719878ef428f82a8e74776f527a5a4ce4c19743df9dfbb193e131653b1`.
  - Canonical-source comparison — PASS: repository schema and source-traceability content equal their source artifacts after terminal-whitespace normalization only.
  - Commit lineage and scope — PASS: COMPILER-000 is an ancestor of COMPILER-001; exact changed-file inventories match the two receipts.
- Exact variances / quarantines:
  - The source validation-test artifact still ends at `expect(result.data.match_confidence).`; the documented 46-case claim is not reproducible. The honest repository result is 32 passing tests, including repaired boundary and supplemental parity/invariant coverage.
  - The source DDL recomputes to only 29 `CREATE TABLE` statements, not the documented 49. No SQL/SQLite database artifact exists in the verified COMPILER-001 commit. This is correct quarantine, not certification.
  - No source adapter, SQLite persistence/repository layer, Firestore projection, promotion runtime, frozen-UI implementation, or linked Vercel project is certified by this PASS.
  - npm emitted a non-blocking host-level warning for an unknown `http-proxy` config; installs and all verification commands passed.
- Assumptions:
  - The exact commits, not later main-branch documentation, are the objects of compiler verification.
  - Terminal blank-line normalization is non-semantic because source and repository schema/traceability are equal after `trimEnd`.
  - The promotion gate and 30-envelope cap are contract requirements represented in the canonical model and tests but remain downstream runtime work.
- Release:
  - VERIFY-000-001 PASS opens `COMPILER-002` as the first active SQLite certification packet.
  - `FIXTURE-001` and `TRACE-001` are released as fallback work because the canonical schema/validator dependency is now independently verified.
  - SQLite itself remains uncertified until COMPILER-002 and VERIFY-002 pass.
- Invariant check: PASS. The frozen UI, canonical Property Envelope, local authoritative SQLite boundary, explicit promotion, bounded Firestore projection, human title limitation, mandatory title/roof/freshness/bid checks, source-health semantics, and uncertainty/provenance rules remain unchanged.


### CLAIM — COMPILER-002
- Claim time: `2026-09-03T02:15:35Z`
- Runner: `WORKER-2`
- Assignment: `COMPILER-002 — SQLite schema reconstruction and certification candidate`
- Branch: `main` (packet names no separate work branch; repository default remains the integration branch)
- Dependency: VERIFY-000-001 PASS recorded at `196e4ceb4402593f39fca41ea5b94968b67bf82e`.
- State: `CLAIMED`


### RECEIPT — COMPILER-002
- Claim time: `2026-09-03T02:15:35Z`
- Completion time: `2026-09-03T02:23:36Z`
- Runner: `WORKER-2`
- State: `PASS`
- Exact implementation commit: `195d50b6cf5d78689ae253978b91b67c185b6ad4`
- Branch: `main`
- Dependency: VERIFY-000-001 PASS at `196e4ceb4402593f39fca41ea5b94968b67bf82e`.
- Changed files:
  - `migrations/0001_canonical_research_schema.sql` — forward-only 49-table strict SQLite schema candidate, foreign keys, JSON guards, identity/bid/title/imagery constraints, and append-only history triggers.
  - `migrations/__tests__/canonical-schema.test.ts` — migration, inventory, relationship, string-identity, envelope round-trip, history-retention, and invariant tests.
  - `docs/data-spine/SQLITE_SCHEMA_CANDIDATE.md` — canonical derivation map, 49-table inventory, constraints, tests, source-DDL variance, and explicit gaps.
  - `migrations/README.md` — local-runtime application boundary and candidate verification instructions.
- Derivation and table inventory:
  - All 46 names in the frozen `SQLITE_TABLE_MANIFEST` are present exactly once.
  - Three contract-required projections are added and documented: `_schema_meta`, `property_envelopes`, and `property_characteristics`.
  - Total application tables: 49. All 49 are `STRICT`; JSON projection columns use `json_valid`.
  - Eight triggers make `evidence_ledger`, `audit_log`, `recommendation_versions`, and `promotion_snapshots` reject both updates and deletes.
- Commands and results:
  - Local candidate test: `npm test -- migrations/__tests__/canonical-schema.test.ts` — PASS; 1 file, 9 tests.
  - Full local `npm run verify` — PASS; strict typecheck, 5 test files / 41 tests, and Next.js 16.3.4 production build.
  - Exact remote checkout at `195d50b6cf5d78689ae253978b91b67c185b6ad4`: `npm ci` — PASS, 78 packages; `npm run verify` — PASS, 5 files / 41 tests plus production build.
  - `PRAGMA foreign_key_check` — PASS with no violations in a fresh in-memory migration.
  - Exact table-inventory assertion — PASS: frozen 46-table manifest plus only the three justified projections, total 49.
  - Leading-zero parcel identity, deterministic municipality/parcel uniqueness, complete envelope JSON round trip, source-linked immutable evidence, append-only histories, target-at-or-under-hard-cap, automated-imagery confidence ceiling, and forbidden-title-label tests — PASS.
  - `git diff --check` and exact remote checkout cleanliness — PASS.
  - Remote exact-commit inspection — PASS; only the four scoped files changed from claim commit `08e2a01f16a904c3752d03334c13fbe6e26c9b79`.
- Source-DDL variance:
  - The quarantined source artifact remains SHA-256 `c13e9f719878ef428f82a8e74776f527a5a4ce4c19743df9dfbb193e131653b1` with 29 observed `CREATE TABLE` statements.
  - It stops before operator actions and lacks 19 frozen manifest tables. It was not copied, imported, or represented as complete.
  - The new migration is explicitly derived from the canonical TypeScript manifest and Build Contract; its three extra tables are justified separately in the derivation map.
- Assumptions:
  - Node 24's built-in `node:sqlite` is acceptable for migration certification tests; no runtime database driver/API is selected for the future repository layer by this packet.
  - Canonical ISO date-time strings are validated by the existing Zod boundary before persistence; SQLite stores them as text without inventing a second parser.
  - Parcel uniqueness is scoped to municipality plus normalized parcel ID; ambiguous identity remains an exception record rather than an address-only merge.
  - The complete Property Envelope remains authoritative JSON; relational tables are query/history projections and do not redefine the property.
- Gaps / downstream gates:
  - VERIFY-002 must independently reproduce and inspect this exact commit before the migration is certified for repository-layer work.
  - This packet does not implement the repository layer, backup/restore, adapters, live ingestion, Firestore, promotion runtime, the transactional 30-envelope cap, UI, or deployment.
  - Cross-field Zod rules such as nulling the hard maximum when critical inputs are unknown remain at the canonical validation boundary and require later repository/promotion integration tests.
  - No live/private property data, local database file, credential, or source snapshot was committed.
- Invariant check: PASS. SQLite remains local authoritative storage; the canonical Property Envelope is unchanged; evidence and source uncertainty remain visible; title certainty is human-gated; automated imagery cannot claim HIGH confidence; promotion history is preserved without implementing or bypassing promotion; Firestore/mobile/UI/Vercel boundaries are untouched.
- Release: VERIFY-002 is READY. SQLite remains uncertified until that verifier returns PASS.


### CLAIM — FIXTURE-001
- Claim time: `2026-09-03T02:43:29Z`
- Runner: `WORKER-1`
- Assignment: `FIXTURE-001 — Property Envelope fixture factory`
- Branch: `main` (packet names no separate work branch; repository default remains the integration branch)
- Eligibility: no unclaimed active WORKER packet exists; VERIFY-002 is verifier-owned; the canonical schema and validator dependency is independently PASS.
- State: `CLAIMED`


### RECEIPT — FIXTURE-001
- Claim time: `2026-09-03T02:43:29Z`
- Completion time: `2026-09-03T02:48:13Z`
- Runner: `WORKER-1`
- State: `PASS`
- Exact implementation commit: `b6bc836610d9d86d6a43d629159811d63c54f8a7`
- Branch: `main`
- Dependency: canonical schema/validator verification PASS at `196e4ceb4402593f39fca41ea5b94968b67bf82e`.
- Changed files:
  - `tests/fixtures/property-envelope-factory.ts` — reusable, Zod-validating synthetic envelope factory and 30/31 promoted-envelope boundary sets.
  - `tests/property-envelope-fixtures.test.ts` — scenario semantics, canonical validation, uniqueness, synthetic labeling, and cardinality tests.
  - `tests/fixtures/README.md` — synthetic-data policy, scenario inventory, and explanation of the downstream transactional cap.
- Scenarios delivered:
  - Canonical-valid baseline.
  - Extensive incomplete/unknown state with null target and hard maximum.
  - Stale auction, bid-plan, recommendation, decision, and ingestion state.
  - Blocking title-review gate with no hard maximum.
  - Conflicting parcel/address evidence held in `IDENTITY_EXCEPTION`.
  - Missing evidence with unresolved confidence and explicit known unknowns.
  - Degraded source health preserved as an explicit warning.
  - Thirty distinct promoted envelopes at the locked limit and a 31-envelope over-limit set for later Promotion Gate rejection tests.
- Commands and results:
  - Focused `npm test -- tests/property-envelope-fixtures.test.ts` — PASS after correcting the initial fixture to use the frozen `ReviewGateType` vocabulary instead of inventing a `source_degraded` gate type.
  - Full local `npm run verify` — PASS; strict typecheck, 6 test files / 54 tests, and Next.js 16.3.4 production build.
  - Exact remote checkout at `b6bc836610d9d86d6a43d629159811d63c54f8a7`: `npm ci` — PASS, 78 packages; `npm run verify` — PASS, 6 files / 54 tests plus production build.
  - `git diff --check` and exact remote checkout cleanliness — PASS.
  - Exact remote commit scope — PASS; only the three fixture/test documentation files changed from claim commit `b68848dc17993c19c3edc6c9329cfd4da8b043c9`.
- Assumptions:
  - “Valid” means valid against the canonical Property Envelope contract; it does not mean promotion-eligible or professionally certified.
  - Blocked, incomplete, stale, conflicted, missing-evidence, and degraded records must remain structurally valid so downstream components can render and test their true states.
  - The 31-item collection is deliberately composed of individually valid envelopes; the later Promotion Gate owns the transactional collection-level rejection.
- Gaps / downstream gates:
  - The factory does not implement promotion eligibility, Firestore projection, database persistence, adapters, UI, or Vercel deployment.
  - Fixtures use fixed timestamps for deterministic tests; freshness evaluation against wall-clock time belongs to the promotion/runtime layer.
  - No live/private property, owner, parcel, source, or auction data is present.
- Invariant check: PASS. No canonical field, enum, review-gate type, UI structure, storage boundary, promotion rule, or human-title limitation changed. Unknowns stay unknown; conflicts remain unresolved; the 30-envelope cap is represented without being bypassed.


### CLAIM — VERIFY-002
- Claim time: `2026-09-03T02:59:27Z`
- Runner: `VERIFIER-1`
- Assignment: `VERIFY-002 — Verify SQLite certification candidate`
- Branch: `main` (ledger-only verification record; compiler implementation is inspected without modification)
- Dependency: COMPILER-002 PASS receipt for exact implementation commit `195d50b6cf5d78689ae253978b91b67c185b6ad4`.
- State: `CLAIMED`


### RECEIPT — VERIFY-002
- Claim time: `2026-09-03T02:59:27Z`
- Completion time: `2026-09-03T03:02:16Z`
- Runner: `VERIFIER-1`
- State: `FAILED`
- Exact implementation commit inspected: `195d50b6cf5d78689ae253978b91b67c185b6ad4`
- Verification record branch: `main`
- Passing evidence:
  - Fresh exact-commit fetch and detached checkout — PASS and clean.
  - `npm ci` — PASS; 78 packages installed.
  - `npm run verify` — PASS; strict typecheck, 5 test files / 41 tests, and Next.js 16.3.4 production build.
  - `git diff --check` and clean-checkout status — PASS.
  - Structural inventory — PASS: exactly 49 `CREATE TABLE` statements, covering all 46 frozen manifest names plus the three documented projections.
  - History and relationship checks — PASS under the submitted suite: 49 strict tables, no foreign-key-check violations, and eight append-only triggers.
  - Runtime placement — PASS: `node:sqlite` appears only in migration tests; migration instructions require `requireSQLiteRuntime()`; no client/browser/Vercel import was introduced.
  - Quarantined source divergence remains accurately documented: the source hash and 29-table count were not promoted as authority.
- Material canonical variance:
  - Frozen `Confidence` values are exactly `high`, `medium`, `low`, and `unresolved`.
  - `property_identity.match_confidence` instead accepts only `HIGH`, `MEDIUM`, `LOW`, and non-canonical `UNKNOWN`.
  - `evidence_ledger.confidence` has the same incompatible uppercase/non-canonical constraint.
  - `imagery_observations.confidence` accepts only uppercase `MEDIUM`, `LOW`, and non-canonical `UNKNOWN`; it rejects every canonical value. It also cannot represent the contract's allowed high-confidence `operator_drive_by` case because its constraint does not distinguish operator from automated observations.
- Independent reproductions:
  - Insert canonical PropertyIdentity with `match_confidence='high'` — REJECTED by the SQL CHECK.
  - Insert canonical Evidence with `confidence='medium'` — REJECTED by the SQL CHECK.
  - Insert canonical automated street imagery with `confidence='medium'` — REJECTED by the SQL CHECK.
  - Insert canonical operator drive-by imagery with `confidence='high'` — REJECTED by the SQL CHECK.
  - The submitted migration tests mask this divergence by inserting uppercase `HIGH` and `MEDIUM` values rather than canonical contract values.
- Variance impact:
  - Canonical Property Envelopes and evidence cannot round-trip into the typed relational projections without remapping or rejection.
  - Accepting `UNKNOWN` would introduce a second database-only confidence vocabulary, violating the one-contract invariant.
  - Therefore the schema cannot be certified for a repository layer despite its otherwise passing table, relationship, and history checks.
- No repair performed: verifier changed no migration, test, domain, UI, or application file.
- Release decision:
  - SQLite certification remains CLOSED.
  - No repository-layer gate is released.
  - `COMPILER-002R` is limited to the exact verified enum-parity repair; `VERIFY-002R` must independently pass afterward.
- Invariant check: FAILED at SQLite confidence projection parity. Frozen TypeScript, UI, storage, promotion, source-authority, and human-title contracts themselves remain unchanged.
