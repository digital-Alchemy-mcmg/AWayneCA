# Data Spine Source Manifest

Source: Ashante Build Assets → `data-spine/`.

## Files present
- `Ashante Canonical Validation Tests — v1.0.0.ts` — Drive ID `1w9gNfZYCaOawJ91a40HsSBC3DXqeQC9U` — 13,395 bytes.
- `Ashante Canonical Zod Validators — v1.0.0.ts` — Drive ID `1IT14DW_-k9l_vvlZI7VyIrwHT6t4YVwV` — 40,685 bytes.
- `Data Spine ↔ Build-Asset Traceability Matrix` — Drive ID `1oBWSkaO0VZK_PId9bxlsBPZ2sRo7XLgq` — 1,735 bytes.
- `Ashante Canonical Data Spine — Schema Freeze v1.0 (1).ts` — Drive ID `1YQOdw_fnaeOdUJ-hB0UJg8dMvOmW77Aa` — 40,868 bytes.
- `Ashante Canonical Data Spine — Schema Freeze v1.0 (2).ts` — Drive ID `1DCzAW7rz64h71jNMYFsvDy0B0HYosO5r` — 40,868 bytes.
- `Ashante SQLite DDL Migrations — v1.0.0.sql` — Drive ID `1UielL-GFhSKftUefeymhtenTEd9IVE1K` — 30,759 bytes.
- `ASHANTE-DATA-SPINE-ARCHITECTURE-v1.0.0.md` — Drive ID `1Bex-NJzqJqwDHZblziOjbmkS6l4bJ9bL` — 32,177 bytes.
- `ASHANTE___Data_Spine_Architecture_Document_v1_0_2026_09_01T19_13_40.md` — Drive ID `1IyniF_JX9El6ltCBS3qWRgkqNx_CAB3C` — 12,738 bytes.

## Foreman assessment
This is not a greenfield schema task. A v1.0 data spine, runtime validators, validation tests and SQLite DDL already exist and must be inspected before W1/W2 implementation begins.

The two `Schema Freeze v1.0` files have identical recorded byte size. Treat them as possible duplicates until content/hash comparison proves otherwise; do not independently modify both.

The first implementation task is therefore **reconciliation**, not rewriting:
1. compare schema freeze, Zod validators, tests and DDL;
2. compare them against the governing Property Envelope contract and Build Assets;
3. identify omissions/conflicts;
4. select one canonical repo path for each artifact;
5. preserve provenance to the source package;
6. only then patch the schema or migrations.

## Expected repo destinations after reconciliation
- `src/domain/` — canonical TypeScript contracts.
- `src/domain/validation/` — runtime validators.
- `src/domain/__tests__/` — contract/validation tests.
- `db/migrations/` — SQLite migrations.
- `docs/data-spine/` — architecture and traceability documentation.

No implementation lane should create a second independent property schema while these artifacts exist.
