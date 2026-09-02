# AWayneCA — Ashante Wayne County Auction Intelligence

This repository is the shared implementation surface for Ashante, the Wayne County tax-auction intelligence and decision-support platform.

## Governing architecture

- One product family with two operating surfaces: Desktop Research Workbench and Mobile Field Cockpit.
- Shared Next.js / React / TypeScript lineage wherever practical.
- SQLite is authoritative for the heavy desktop research corpus.
- Firestore carries only explicitly promoted field projections and synchronization state.
- Vercel is the intended web/PWA deployment surface.
- One canonical versioned Property Envelope crosses research, promotion, mobile, and export boundaries.
- GitHub stores reproducible code, contracts, migrations, tests, adapters, rules, deployment configuration, and architecture documentation. Do not commit live property data, credentials, private evidence, local databases, or downloaded research artifacts.

## Start here

1. Read `FOREMAN.md` before changing architecture or assigning work.
2. Read `docs/governance/BUILD_CONTRACT.md` for frozen implementation boundaries.
3. Read `docs/governance/AGENT_ROSTER.md` for lane ownership across GPT Cloud, GPT Work, GPT Other Profile, and Tab.
4. Read `docs/governance/WORK_QUEUE.md` for the current build sequence and acceptance gates.
5. Treat `build-assets/` as the preserved source package from the Google Drive Build Assets folder.

## Repository posture

The remaining work is implementation validation and construction, not broad product rediscovery. Existing Build Assets remain authoritative inside their defined scopes unless concrete implementation evidence exposes a conflict.

## Compiler baseline

Use Node.js 24 (`.nvmrc`) and npm 11.9.0. The reproducible compiler path is:

```bash
npm ci
npm run verify
```

`verify` runs strict TypeScript checking, tests, and a production Next.js build. Environment names and runtime boundaries are documented in `.env.example` and `docs/architecture/RUNTIME_BOUNDARIES.md`. Do not create `.env.local`, run database commands, or start cloud-dependent development work until the intended Vercel project is linked and required environment key names are verified.
