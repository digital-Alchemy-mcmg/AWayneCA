# Agent Roster and Lane Boundaries

## GPT Cloud — Foreman / Integrator
Primary responsibilities: architecture custody, task decomposition, cross-lane coordination, source-package interpretation, acceptance criteria, review of implementation evidence, integration decisions, issue triage and build-order control.

May inspect Google Drive Build Assets and GitHub. Should avoid becoming sole builder and sole auditor of the same high-risk change.

## GPT Work — Primary Builder
Primary responsibilities: local implementation, dependency setup, schema and migration work, adapters, tests, desktop and mobile integration, build execution, local validation, packaging and release assembly.

Expected handoff: commits/PRs plus concise evidence showing commands run, tests passed/failed, known gaps and exact files changed.

## GPT Other Profile — GitHub-only Independent Complement
Constraint: no Google Drive access. GitHub must therefore contain enough governing context for this lane to work independently.

Best-use responsibilities:
- adversarial contract review;
- inspect PRs and changed files;
- generate or strengthen tests;
- detect architecture drift;
- review schemas for missing states/fields;
- verify source adapters against their declared contracts using public information where allowed;
- produce bounded implementation proposals/specifications;
- inspect UX/data-boundary consistency from repository artifacts.

Do not assign a task whose only source of truth remains in Google Drive.

## Tab — Parallel Utility Lane
Best-use responsibilities:
- narrow file transformations;
- bounded code or test generation;
- fixture construction;
- repetitive consistency checks;
- documentation normalization;
- targeted inspection tasks with explicit inputs and acceptance criteria.

Tab should receive small, closed work packets and return repository artifacts or evidence that can be independently inspected.

## Separation rule
For major contracts, persistence, synchronization, security rules, bidding logic, source authority or promotion-boundary work, the same lane should not be treated as both author and certifier. Use another lane to inspect the resulting artifact.

## Handoff format
Every lane returns:
1. Task/issue reference.
2. Files changed or artifacts produced.
3. What was actually executed or inspected.
4. Evidence/results.
5. Open defects or uncertainty.
6. Recommended next handoff.

Narrative claims without inspectable artifacts are not completion evidence.
