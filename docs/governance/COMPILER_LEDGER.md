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
State: CLAIMED
Dependencies: none
Scope: Prepare the pinned compiler environment, strict TypeScript, reproducible install/typecheck/test/build commands, environment schema, canonical directories, and local-only SQLite versus browser/Vercel separation.
Receipt required: changed files, commands, results, assumptions, gaps, exact commit, PASS/BLOCKED.

### COMPILER-001 — Data-spine reconciliation
Role: WORKER
Preferred runner: WORKER-2
State: WAITING_ON_COMPILER-000
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
State: READY_FALLBACK
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
