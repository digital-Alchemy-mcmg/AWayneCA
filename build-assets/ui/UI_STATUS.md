# UI Specification and Prototype Status

Status: **CLOSED — UI LOCKED**

Closed: 2026-09-02
Closure authority: Operator directive.
Canonical Figma/wireframe specification: `Ashante_SXV8_Figma_Wireframe_Spec_v1.0.0.pdf`

## Governing authority

All UI implementations must conform to the same frozen specification used to produce the accepted UI. Agents are not instructed to imitate prototype code or incidental demo wiring.

Authority order:

1. Operator directives.
2. Frozen architectural and interaction invariants in the canonical Figma/wireframe specification.
3. Shared canonical Property Envelope and Build Contract.
4. The governing HTML UI specification.
5. The prototype demo as visual and interaction evidence.

When a lower source conflicts with a higher source, the higher source controls. A prototype shortcut never overrides an invariant.

## Locked UI invariants

- Desktop is the high-entropy research and decision Workbench.
- Mobile is the low-entropy Field Cockpit and never exposes the unvetted research corpus.
- Heart stages the complete canonical Property Envelope for deterministic promotion; it is not a bookmark.
- Title clearance, roof-risk eligibility, freshness under 72 hours, and configured target/hard bid caps are mandatory promotion checks.
- Only passing envelopes enter the mobile projection.
- Mobile is capped at 30 promoted envelopes.
- Bidding is manual. The system never places or automates bids.
- Target, hard cap, watch-outs, evidence, risks, freshness, and status remain visible or directly reachable as specified.
- Status communicates through icon, text, and color together.
- Critical watch-outs cannot be hidden or collapsed.
- Desktop and mobile share the canonical contract without becoming the same interface.

## Implementation interpretations

These preserve the specification and do not constitute UI changes:

- A Figma or demo `Keep` action may select or stage a property, but it cannot bypass the Promotion Gate.
- A 36px carousel-arrow graphic must be placed inside an interactive target of at least 44px.
- Auction `+$500` and `+$1,000` controls modify only the local manual-bid input. They never submit or place a bid.
- The complete promoted envelope means the complete bounded canonical field projection. Bulky raw evidence remains in evidence storage and is referenced by stable metadata.
- The 72-hour threshold controls promotion eligibility. The stricter 48-hour auction warning is an additional reverification warning, not an alternate promotion rule.
- Non-blocking warnings may remain visible after promotion; the four mandatory checks above may not be bypassed.

## Compatibility and promotion rule

An implementation is compatible only when it conforms to the frozen specification and canonical contracts. Do not promote any design, component, screen, pull request, or implementation that changes an invariant, bypasses the Promotion Gate, introduces an incompatible property model, or substitutes prototype convenience behavior for specified behavior.

## Closure rule

The UI design lane is closed. No agent may redesign, optimize, expand, reinterpret, or reopen it without a new explicit operator directive. Engineering may make only conformity corrections, responsive/accessibility implementations, defect repairs, and production wiring required to realize the frozen specification. Those adjustments must not materially change structural components or interaction architecture.

GPT Cloud / Foreman owns adjudication of UI implementation variances against this specification. Material uncertainty returns to the operator; incompatible work remains unpromoted.
