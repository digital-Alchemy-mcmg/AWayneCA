# Domain boundary

`property-envelope.ts` is the reconciled v1.0.0 canonical TypeScript contract. Runtime consumers use `validation/property-envelope.ts`; the validator imports canonical enum authorities and its inferred interfaces are checked bidirectionally against the contract during `npm run typecheck`.

UI, persistence, promotion, Firestore projection, and export must import this contract through `src/domain/index.ts`; none may redefine it.
