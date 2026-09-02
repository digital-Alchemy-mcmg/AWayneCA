# FOREMAN — AWayneCA Operating Contract

## Mission
Build Ashante into a working Wayne County tax-auction research and field-decision system without reopening settled product decisions or letting parallel agents create incompatible implementations.

## Authority order
1. Operator instruction.
2. `docs/governance/BUILD_CONTRACT.md` and frozen architecture invariants.
3. Preserved Build Assets and their scope-specific requirements.
4. Accepted implementation evidence and tests.
5. Agent proposals.

If implementation evidence contradicts a frozen assumption, document the conflict. Do not silently redesign around it.

## Team
Only these working lanes are assumed for this project:
- **GPT Cloud / shop foreman** — architecture custody, decomposition, inspection, integration decisions, acceptance gates, cross-lane orchestration.
- **GPT Work / primary builder** — local implementation, repository construction, tests, migrations, adapters, integration, release assembly.
- **GPT Other Profile / independent complement** — GitHub-only inspection, critique, contract checking, test/spec generation, bounded research and adversarial review. It must not depend on Google Drive access.
- **Tab** — bounded parallel utility work: file inspection, transformations, narrow implementation or verification tasks assigned through GitHub artifacts/issues.

No lane should both invent a major architectural change and certify that change as correct.

## Working protocol
- GitHub is the common project bus.
- Each meaningful work packet starts from an issue or an explicit repo task document.
- Builder changes should be isolated by branch/PR when practical.
- Reviewers inspect the artifact and acceptance criteria, not the builder's narrative.
- Evidence beats confidence. A task is not complete because an agent says it is complete.
- Keep private/live property data, secrets, downloaded evidence, local SQLite files, and credentials out of Git.

## Build sequence
1. Freeze shared contracts.
2. Establish SQLite persistence and migration system.
3. Establish source-adapter interface, evidence ledger, source health and failure states.
4. Bind research/scoring requirements into the Desktop Research Workbench.
5. Implement explicit Promotion Gate.
6. Implement Firestore promoted projection and security rules.
7. Bind mobile Field Cockpit to promoted data only.
8. Implement complete self-contained HTML Property Envelope export.
9. Validate synchronization, source failure, mobile behavior, security, backup/recovery and deployment.

## Acceptance posture
A feature must have a defined contract, failure behavior, provenance behavior where applicable, tests appropriate to its risk, and evidence that it respects the architecture boundary it crosses.

## Stop conditions
Stop and escalate instead of guessing when:
- property identity conflicts cannot be deterministically resolved;
- a source is gated, prohibited, unstable, or materially changed;
- a task would create legal/title certainty the source cannot establish;
- a proposed mobile model diverges from the canonical Property Envelope;
- private data or secrets would need to enter Git;
- implementation requires changing a frozen invariant rather than merely filling an open implementation detail.
