# Synthetic fixture policy

Everything in this directory is fabricated test input. No record describes a
real parcel, address, owner, auction item, or source response.

## Property Envelope factory

`property-envelope-factory.ts` returns canonical Zod-validated envelopes for:

- valid contract shape;
- extensive incomplete/unknown state;
- stale auction and calculation state;
- blocking review gates;
- conflicting parcel/address identity evidence;
- missing evidence;
- degraded source health; and
- promoted-envelope arrays at 30 items and one over the limit at 31.

The 31-item set is deliberately schema-valid. The canonical envelope validates
one property at a time; the later Promotion Gate must reject the collection
transactionally when it would exceed the locked mobile cardinality cap.

Fixtures use stable `fixture-*` identifiers and carry an operator note stating
that they are synthetic. A fixture may model uncertainty or a blocker while
remaining structurally valid; tests must not convert unknowns into facts merely
to make a scenario pass.
