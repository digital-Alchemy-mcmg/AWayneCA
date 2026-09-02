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
State: READY
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

## Claims and receipts

Append runner claims and receipts below this line. Preserve history; do not rewrite prior entries.
