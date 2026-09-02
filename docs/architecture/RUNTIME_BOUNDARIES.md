# Compiler Environment and Runtime Boundaries

Status: COMPILER-000 baseline. This document creates implementation guardrails; it does not supersede the Build Contract.

## Pinned compiler

- Node.js `24.x`, pinned locally to `24.19.0` by `.nvmrc` and constrained to major 24 by `package.json`.
- npm `11.9.0`, declared by `packageManager`.
- Next.js, React, TypeScript, Zod, test runner, and type packages are exact-version dependencies recorded in `package-lock.json`.
- `npm ci` is the only clean/reproducible install command.
- `npm run typecheck`, `npm test`, `npm run build`, and `npm run verify` are the canonical compiler checks.

## Canonical directories

| Path | Authority |
| --- | --- |
| `src/domain/` | Shared Property Envelope and domain contracts after reconciliation |
| `src/server/persistence/` | Local SQLite access and materialization |
| `migrations/` | Ordered SQLite migrations |
| `src/server/adapters/` | Source adapters and source-health behavior |
| `src/server/promotion/` | Explicit promotion gate and Firestore projection writes |
| `src/client/` | Browser-safe UI/application modules |
| `src/app/` | Next.js delivery shell and routes |
| `tests/` | Cross-boundary compiler and contract verification |

## Runtime separation

SQLite is the authoritative heavy desktop research store. It is local-only. Any SQLite entry point must import `server-only` and call `requireSQLiteRuntime()` before opening the corpus. The runtime policy rejects Vercel and Edge execution.

Vercel serves the Next.js/PWA surface. Firestore integration is limited to the explicitly promoted field projection and sync state. Browser code may receive only variables whose names begin with `NEXT_PUBLIC_`; server credentials are parsed separately and must never be imported through client modules.

## Environment lifecycle

`.env.example` is names-only configuration. `.env.local`, `.vercel/`, SQLite files, private evidence, and credentials are ignored. Do not run a database migration, seed, or development server until the repository is linked to the intended Vercel project and the required environment key names are verified. No Vercel project or cloud resource is created by COMPILER-000.

## Open gates

- COMPILER-001 must import and reconcile the existing canonical contract before domain implementation starts.
- A foreman-selected Vercel project must be linked before deployment or development-server verification that depends on cloud integration.
- SQLite driver selection and migrations remain closed until the reconciled schema is verified.
