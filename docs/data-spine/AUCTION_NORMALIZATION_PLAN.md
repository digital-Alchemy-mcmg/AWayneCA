# Auction Data Normalization Plan

Status: PREPROCESS-001 deliverable; implementation contract for later adapter work, not an operational source adapter.

## Objective

Normalize a county-scale auction inventory once, preserve every source observation, and make later imports update stable records instead of recreating properties. The expected first load may be roughly 30,000 rows. Volume does not relax identity rules: a fast wrong merge is worse than an explicit unresolved record.

This plan is subordinate to the canonical Property Envelope, the Build Contract, and source-specific terms. It adds no envelope fields. Names such as `parcel_comparison_key` describe preprocessing work values; they are not additions to the frozen domain contract.

## Immutable layers

Every fetch produces three separable layers:

1. **Source snapshot** — immutable bytes or permitted reference, SHA-256, source ID, retrieval time, effective/event date when known, schema fingerprint, and fetch outcome. A later fetch never overwrites it.
2. **Auction observation** — one normalized `AuctionItem` observation linked to the snapshot, source page/row, raw fields, and capture time. Status and money changes become history.
3. **Property identity** — one stable Ashante `PropertyIdentity.property_id`, independent of auction item ID, address spelling, and auction year. It may link many auction items over time.

Reprocessing the same snapshot and normalizer version must produce the same normalized observations and identity proposals. It must not create additional properties, snapshots, or current-state rows.

## Deterministic normalization

### General text

- Decode using the declared source encoding; if absent, detect conservatively and record the decision.
- Apply Unicode NFKC, replace nonbreaking whitespace with ordinary spaces, trim outer whitespace, and collapse internal whitespace.
- Preserve the original value in `raw_fields` and the relevant raw-variant array before any transformation.
- Convert blank strings and source sentinel values such as `N/A`, `UNKNOWN`, `-`, and `NULL` to `null` only through a versioned source profile. Never convert missing money to zero or missing booleans to false.
- Store timestamps as ISO 8601 UTC when the source supplies an instant. A date without time remains source-effective date evidence and must not be fabricated as midnight.

### Parcel identifiers

For every nonblank parcel value derive, without replacing the raw value:

1. `parcel_lexical_normalized`: NFKC, uppercase, trimmed, normalized Unicode dash characters, internal whitespace removed.
2. `parcel_comparison_key`: ASCII letters and digits from the lexical form, preserving all leading zeroes.
3. `parcel_namespace`: source jurisdiction plus municipality when known.

The comparison key is a candidate-generation aid, not a public parcel ID and not sufficient by itself across municipalities. Punctuation-bearing Detroit forms and unpunctuated forms may become candidates for the same parcel, but the stored canonical value is selected only after corroboration by the relevant GIS/assessor authority. Never coerce parcel IDs to numbers.

### Addresses

- Uppercase for comparison, normalize Unicode/whitespace, separate unit tokens when unambiguous, and standardize only a versioned list of street-suffix and directional aliases.
- Preserve house-number suffixes, fractional addresses, unit designators, leading zeroes, and city/ZIP evidence.
- Do not invent a municipality or ZIP from proximity alone.
- Build an address comparison tuple from municipality, ZIP when present, house number, normalized street name, suffix, directionals, and unit.
- An address match can propose a candidate. It cannot silently override or manufacture a parcel identity.

### Auction identity and money

- `source_record_key = source_id + event_or_season_key + auction_item_id`. If no stable auction item ID exists, use the source row reference plus snapshot ID and mark identity unresolved.
- Auction lot/item IDs are strings. Preserve leading zeroes and source punctuation.
- Parse currency only after removing explicitly permitted display symbols and grouping separators. Parentheses mean negative only when documented by the source profile. Reject malformed, non-finite, or out-of-range amounts; never guess.
- `minimum_bid`, `current_bid`, and `sold_price` remain distinct. A published minimum bid never becomes Ashante's target bid or hard maximum.
- Bundle membership is an auction relationship, not proof that member parcels share one property identity.

## Match and update decision table

Process candidates in this order:

| Condition | Result | Match status | Write behavior |
|---|---|---|---|
| Exact existing `source_record_key` and same snapshot hash | Replay | unchanged | No new record; deterministic no-op plus run receipt |
| Exact existing `source_record_key`, new snapshot, no identity contradiction | Observation update | unchanged | Append snapshot/status history; update current auction observation |
| Unique authoritative parcel match in the same namespace | Link existing property | `verified` | Add raw variant/evidence if new; never replace `property_id` |
| New unique authoritative parcel | Create property once | `verified` | Allocate immutable `property_id`; link auction item |
| Parcel comparison candidate corroborated by GIS/assessor but display forms differ | Link existing property | `verified` | Retain every raw variant and corroborating evidence |
| No parcel; unique strong address candidate with corroborating source | Candidate link | `probable` | Queue for confirmation before any destructive merge |
| Address-only match without corroboration | Do not merge | `unresolved` | Create/retain unlinked auction observation and exception |
| One auction row points to multiple authoritative parcels or sources disagree | Do not merge | `conflict` | Create identity-match exception; preserve all candidates |
| Same parcel key appears in different municipalities/namespaces | Do not merge across namespace | `ambiguous` or `conflict` | Separate candidates and escalate |
| Previously linked row later presents a different strong parcel ID | Freeze prior link | `conflict` | Append evidence; block automatic reassignment |

An operator resolution is append-only evidence. It may link or split records prospectively but must not erase the prior proposal, conflicting source values, or decision provenance.

## Deduplication and replay

- Snapshot identity is SHA-256 of exact bytes plus source ID. Same bytes from the same source are replay; same bytes from different sources remain separate provenance.
- Observation identity is the source record key within a snapshot. Duplicate rows inside one snapshot are retained as duplicate evidence and collapsed only into one current observation when every normalized material field agrees.
- Material disagreement between duplicate source rows creates a conflict; last-row-wins is forbidden.
- Property dedupe is a separate step from auction-row dedupe. Never use array position, address text alone, owner name, bid amount, or geometry proximity as a property primary key.
- Batch writes must be idempotent. Use uniqueness constraints or equivalent transactional guards for snapshot hash/source, source record key/current observation, and immutable `property_id`.

## Missing values and conflicts

- `null` means the source did not establish the value. `0`, `false`, an empty collection, and a source-confirmed negative are real values and remain distinct.
- Missing parcel or address data does not discard an auction row. It lowers match confidence and creates the appropriate known unknown/escalation.
- Source precedence is field-specific. DS_Auction governs current auction facts; GIS/assessor evidence governs parcel/location candidates; neither can establish title or condition.
- More recent evidence does not automatically erase older contradictory evidence. Current selection records the rule, source, timestamp, and displaced evidence IDs.
- A source outage preserves the last successful observation but marks freshness/source health; stale data must not masquerade as current.

## Provenance requirements

Every normalized material field must be traceable to:

- `source_id` and source record key;
- immutable snapshot ID/hash or permitted evidence reference;
- source page/row/reference where available;
- raw field name and raw value;
- normalizer name/version and rule ID;
- captured/retrieved time and source-effective time when known;
- transformation result, confidence, and conflict state;
- operator resolution ID when human judgment changes a link or selected value.

Logs and Git must not contain live/private payloads. Git may contain only synthetic fixtures such as the vectors accompanying this plan.

## 30,000-row operating pattern

The initial ingest establishes stable habits:

1. Land all permitted source bytes/references as immutable snapshots.
2. Normalize deterministically in bounded batches with a resumable cursor.
3. Allocate a property only after the identity decision table authorizes creation.
4. Commit batch results transactionally and record counts for created, updated, replayed, unresolved, ambiguous, and conflicted rows.
5. On every later source delivery, resolve exact source records and strong parcel identities first, then update. Creation is the exception path.
6. Alert on unexpected creation rate, collision rate, schema fingerprint change, or sharp null-rate change before promotion.

No percentage threshold may auto-approve identity conflicts. Metrics are drift alarms, not permission to merge.

## Acceptance tests for a future implementation

The synthetic vectors in `tests/fixtures/auction-normalization-vectors.json` are normative examples. A later normalizer test harness must prove:

- stable results across repeated runs and input order changes;
- raw-value preservation and leading-zero safety;
- exact replay produces no duplicate current records;
- new observations update history without changing `property_id`;
- missing is never converted to certainty;
- parcel/address contradictions generate exceptions rather than silent merges;
- bundle membership cannot collapse parcel identities;
- every selected normalized value has field-level provenance;
- no fixture is treated as a real property.

## Open implementation gates

- W3 must define the adapter and source-health interfaces before this becomes code.
- W4 must validate parcel normalization and source precedence against permitted Wayne County examples.
- SQLite schema certification must provide complete tables/constraints for snapshots, observations, histories, identities, and exceptions.
- Source-specific profiles must pin the auction source schema, sentinel list, terms, and event/season key.
- Independent verification must approve the implementation; this plan alone promotes no data source or property.
