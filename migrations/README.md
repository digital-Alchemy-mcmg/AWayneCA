# SQLite migrations

These are ordered, forward-only migrations for Ashante's local authoritative
research corpus. They must never be opened from browser, Edge, or Vercel code.

## Candidate migration

- `0001_canonical_research_schema.sql` creates the 46 frozen manifest tables
  plus three documented contract projections. It is a certification candidate,
  not a certified production migration, until `VERIFY-002` passes.
- The migration enables foreign keys, uses strict tables, preserves identifiers
  as text, validates JSON payloads, and installs append-only history triggers.
- Apply migrations only after `requireSQLiteRuntime()` has accepted the local
  research runtime.

Run `npm run verify` to execute the schema inventory, relationship, constraint,
history-retention, typecheck, and production-build checks.

The partial 29-table source DDL is quarantined evidence. It is not copied into
this directory and must not be described as the migration authority.
