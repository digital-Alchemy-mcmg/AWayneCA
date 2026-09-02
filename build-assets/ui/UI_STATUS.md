# UI Specification and Prototype Status

Status: **DONE**

## Governing artifacts

1. `React-Artifact-ui-prototype-spec.html` is the governing UI specification.
2. `React-Artifact-ui-proto-demo.html` is the executable interaction and visual reference.
3. `Wayne-Auction-Cockpit-Ui-Only.html` remains preserved as earlier lineage/reference material.

When prose and implementation interpretation differ, agents must compare both governing artifacts and escalate a concrete conflict. They must not silently redesign the product.

## Locked interaction model

- Desktop is the research and decision Lab.
- A heart action promotes the complete Property Envelope; it is not a lightweight bookmark.
- The promotion boundary exposes gate checks and blocks incomplete or stale candidates.
- Mobile is the Field Cockpit and displays only promoted properties.
- Mobile uses a single-property, one-screen-at-a-time posture.
- Target, hard cap, watch-outs, evidence, risks, and freshness remain visible or directly reachable.
- Bidding is manual. No auto-bidding is authorized.
- Stale data must trigger explicit official-source reverification language.
- Day/night presentation, serif headings, calm orientation, and 44px touch targets belong to the accepted direction.

## Meta documentation mirror

Meta will place another set of formal documentation in the Build Assets folder mirroring this completed UI specification and prototype.

Until those files arrive:

- Their status is **EXPECTED / NOT YET REGISTERED**.
- Their function is formalization, traceability, and handoff support.
- Their arrival does not reopen the accepted UI direction.
- On arrival, add exact filenames, source identifiers, and scope to `../ASSET_MANIFEST.md`.

## Meta mirror acceptance gate

Compare Meta's mirror against both governing UI artifacts before promotion.

**Promote and close UI only when:**

- The mirror is the same as, or materially equivalent to, the operator's specification and prototype.
- All UI, workflow, boundary, data-visibility, status, risk, freshness, mobile, and bidding invariants remain unchanged.
- Differences are limited to wording, organization, clarification, traceability, or implementation-neutral formalization.

When those conditions pass:

1. Register and promote the Meta documents as companion Build Assets.
2. Change this file's status to **CLOSED — UI LOCKED**.
3. Mark the UI lane closed across the active work queue.
4. Permit implementation of the locked UI, but no further product-design changes.

**Do not promote when:**

- Any invariant is added, removed, weakened, strengthened, reinterpreted, or contradicted.
- A difference changes what the user sees, what the system gates, what data crosses the boundary, or how desktop/mobile behavior works.
- Material equivalence cannot be established confidently.

When any condition fails, keep the Meta documents unpromoted, record the exact variance, and flag the operator for adjudication.

## Closure authority

After the Meta mirror passes and the UI lane is marked closed, no agent may revise, optimize, reinterpret, expand, or reopen the UI. Any subsequent UI change requires a new explicit operator directive. Bug fixes may restore conformity to the locked artifacts; they may not alter the accepted design.

## Build instruction

Implementation agents should reproduce the accepted behavior and visual system in production components while preserving the Property Envelope contract and desktop-to-mobile promotion boundary. Prototype fixture data, embedded convenience code, and artifact-host wrappers are reference implementation material, not automatically production architecture.
