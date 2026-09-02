# Next Assignments

## GPT Work — W1 Reconcile and import canonical data spine
Use the Build Contract plus `build-assets/data-spine/MANIFEST.md` and `docs/data-spine/ARCHITECTURE_SUMMARY.md`.

Tasks:
1. Obtain the exact existing TypeScript schema freeze, Zod validators, validation tests and SQLite DDL from the source package.
2. Compare the two schema-freeze copies and select the canonical copy only after content/hash comparison.
3. Reconcile contract → validators → tests → DDL for enum/value/field/relationship fidelity.
4. Place reconciled artifacts under `src/domain/`, `src/domain/validation/`, `src/domain/__tests__/`, and `db/migrations/`.
5. Run the validation tests and SQLite migration checks.
6. Return commit/PR plus exact test evidence and discrepancies found.

Do not invent a replacement schema unless the existing package is proven unusable and the conflict is documented.

## GPT Other Profile — Independent W0/W1 audit
Read GitHub only. Inspect `FOREMAN.md`, Build Contract, manifests, queue and the reconciled data-spine PR when available.

Tasks:
1. Look for architecture drift or missing canonical states.
2. Verify that mobile/export do not acquire separate incompatible property models.
3. Verify source-health, human-escalation, provenance, identity-conflict and promotion metadata are representable.
4. Check contract/validator/DDL enum fidelity.
5. Produce findings tied to exact repo paths/lines or tests.

Do not rely on Google Drive.

## Tab — bounded traceability packet
Once exact data-spine files are in GitHub:
1. Build a machine-readable traceability table mapping major Build Contract requirements to TypeScript types, Zod validators, tests and SQLite tables/constraints.
2. Flag any contract item with no downstream implementation evidence.
3. Do not modify architecture.

## GPT Cloud — Foreman
Inspect incoming evidence, adjudicate conflicts against the frozen Build Contract, sequence W2 only after W1 passes reconciliation, and keep GitHub usable as the common bus for all four lanes.
