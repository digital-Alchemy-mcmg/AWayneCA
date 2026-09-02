# COMPILER-001 Data-Spine Reconciliation

Status: implemented; pending independent verification.

## Selected authority

The two Drive schema-freeze candidates are exact duplicates. Both are 40,868 source bytes and have SHA-256 `2ba4bd1dfc2cbbead02e3788ca5375c8cf54241641a65d8e4021416dffa8b9b7`. The repository therefore carries one canonical copy at `src/domain/property-envelope.ts`; neither Drive copy was preferred semantically because their bytes are identical. The repository formatter normalizes terminal blank lines but changes no source token.

| Source artifact | Drive ID | Source SHA-256 | Repository disposition |
| --- | --- | --- | --- |
| Schema Freeze v1.0 (1) | `1YQOdw_fnaeOdUJ-hB0UJg8dMvOmW77Aa` | `2ba4bd1dfc2cbbead02e3788ca5375c8cf54241641a65d8e4021416dffa8b9b7` | Canonical import |
| Schema Freeze v1.0 (2) | `1DCzAW7rz64h71jNMYFsvDy0B0HYosO5r` | `2ba4bd1dfc2cbbead02e3788ca5375c8cf54241641a65d8e4021416dffa8b9b7` | Proven duplicate; not imported twice |
| Zod Validators v1.0.0 | `1IT14DW_-k9l_vvlZI7VyIrwHT6t4YVwV` | `516551d4f2d559679c35112e481260d57cdf0f46531fab1a9c5aa2d439d3fb78` | Imported with enum-authority repair |
| Validation Tests v1.0.0 | `1w9gNfZYCaOawJ91a40HsSBC3DXqeQC9U` | `6ba939a9c0b89842649e2d3a6bd8b71bb9c1f3e58f201b42e32fd1174d9bbae7` | Recovered through truncation; supplemented |
| Source traceability matrix | `1oBWSkaO0VZK_PId9bxlsBPZ2sRo7XLgq` | `0a7fccd968cc94cca45e7c4f049cb60d759da8d1e89a08698156263b79a57e84` | Imported as `SOURCE_TRACEABILITY.csv` |
| SQLite DDL v1.0.0 | `1UielL-GFhSKftUefeymhtenTEd9IVE1K` | `c13e9f719878ef428f82a8e74776f527a5a4ce4c19743df9dfbb193e131653b1` | Inspected only; incomplete source is not promoted |

## Repairs made without invariant changes

1. The source Zod schemas independently restated canonical enum values as string arrays. Their runtime output was not TypeScript-assignable to the canonical enum-bearing interfaces. The repository validators now import the frozen enums and use those enum objects directly. No enum member or accepted runtime value changed.
2. The source validation test file ends mid-expression in the identity-conflict assertion. The repository completes only that evident assertion and closing syntax, marks the recovery inline, and adds fresh tests for the remaining advertised invariant categories.
3. Compile-time parity now checks all 31 validator-backed canonical interfaces bidirectionally. This covers 356 field rows in `FIELD_TRACEABILITY.csv`; a validator can neither narrow nor widen a canonical interface without failing typecheck.
4. Runtime parity tests compare all 13 canonical enum objects with their Zod schemas and lock the 34 top-level Property Envelope fields.

## Field-level traceability

- `SOURCE_TRACEABILITY.csv` preserves the supplied type-to-Build-Asset lineage.
- `FIELD_TRACEABILITY.csv` expands 31 canonical interfaces into 356 field rows with canonical type, validator, source-authority key, source line, and compile-time parity evidence.
- Critical UI/build invariants are represented without a second model: immutable identity (`PropertyIdentity.property_id`), title workflow (`TitleResearchCase.title_status`), roof evidence (`PropertyCharacteristics.roof_condition_known` plus review gates), freshness (`PropertyEnvelope.auction.fresh_until` and bid/recommendation freshness), target/hard cap (`BidPlan.target_bid` and `BidPlan.hard_max_bid`), explicit promotion (`PromotionSnapshot`), source degradation (`SourceRegistryEntry.operational_status`), uncertainty/provenance, and mobile projection lineage.

For a first corpus on the order of 30,000 auction records, this contract establishes the normalization habit needed for cheaper subsequent refreshes: match against immutable `property_id` and normalized parcel/address evidence, update the established record when identity is deterministic, preserve raw variants, and route ambiguity to `identity_match_exceptions` instead of creating or silently merging another property.

## Contradictions and downstream blocks

The source package's architecture documents claim a complete 46-case validation suite and a complete 49-table SQLite DDL. The raw artifacts available under the recorded Drive IDs do not support those claims:

- The validation source stops during scenario 3. The repository now passes the four recoverable source tests plus nine supplemental scenario tests and fourteen parity tests. The broader project suite passes 32 tests, but this must not be described as the originally claimed 46 source cases.
- The DDL contains 29 `CREATE TABLE` statements, then truncates at the `OPERATOR ACTIONS` heading. Nineteen of the 46 manifest tables are absent, including `operator_actions`, `promotion_snapshots`, `audit_log`, and export tables. The DDL is therefore not imported or certified by COMPILER-001.
- SQLite certification remains closed. A complete DDL artifact or a bounded reconstruction derived from the canonical contract must be separately built and independently verified before any migration is promoted.

## Verification result

`npm run typecheck` and `npm test` pass with the canonical contract, validator parity, recovered tests, and supplemental invariant coverage. `npm run build` also passes. This report makes no claim that source adapters, SQLite persistence, Firestore projection, or promotion logic are operational.
