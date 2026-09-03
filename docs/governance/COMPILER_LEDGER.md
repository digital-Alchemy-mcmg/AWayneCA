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
State: CLAIMED
Dependencies: passing COMPILER-000 receipt
Scope: Hash and compare the schema-freeze copies; reconcile and import the canonical contract, validators, and validation tests; run type-check and validation tests; return field-level traceability.
Receipt required: comparison result, selected authority, changed files, commands, test results, discrepancies, exact commit, PASS/BLOCKED.

### VERIFY-000-001 — Verify compiler stages 0 and 1
Role: VERIFIER
Preferred runner: VERIFIER-1
State: WAITING_ON_COMPILER-000-AND-001
Dependencies: passing receipts and exact commits for COMPILER-000 and COMPILER-001
Scope: Independently verify environment reproducibility, runtime boundaries, schema reconciliation, validator/test alignment, UI-required fields, Build Contract invariants, and traceability. Do not repair.
Receipt required: PASS/FAILED/BLOCKED with exact evidence and variances. Only PASS may open SQLite certification.

## Bounded fallback queue

Use this queue only when the primary compiler assignment is blocked or no higher-priority eligible packet exists. Fallback work must produce reusable evidence or fixtures and may not alter frozen architecture.

### RESEARCH-001 — Source capability cards
Role: WORKER
State: CLAIMED
Scope: Build one evidence-based capability card per planned source: DS_Auction, DS_GIS, DS_BSEED, DS_Env, DS_Title, DS_MLS, and DS_Imagery. Record access method, expected fields, authority level, refresh pattern, failure modes, legal/access limitations, cost tier, and human escalation. Do not claim a source is operational without live proof.

### PREPROCESS-001 — Auction-data normalization plan
Role: WORKER
State: READY_FALLBACK
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
