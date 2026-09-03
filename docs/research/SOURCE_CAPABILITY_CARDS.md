# Source Capability Cards

Status: research evidence only — no production adapter is certified by this document.
Checked: 2026-09-03 UTC
Packet: RESEARCH-001

## Use rules

- A reachable public page or documented API proves discoverability, not production operability.
- Each adapter must still pass the W3 fetch/validate/preserve/normalize/health contract and W4 Wayne County identity proof.
- Store raw source snapshots and bulky evidence outside Git. Store hashes, retrieval metadata, normalized values, and field provenance in SQLite.
- Treat parcel identifiers as source-scoped strings. Do not strip punctuation destructively or merge address-only matches.
- A missing, stale, gated, or contradictory source produces explicit source health and human escalation; it never becomes a verified negative fact.
- Cost tiers are planning labels: **free public**, **metered**, **licensed/paid**, or **human/transactional**.
- Integration status for all cards is **NOT OPERATIONAL / UNPROVEN** until an adapter has live credentials where required, contract tests, legal approval, and a passing receipt.

## DS_Auction — Wayne County Treasurer auction and delinquent-tax sources

**Purpose and authority.** Primary authority for Wayne County tax-auction lot identity, published minimum bid, auction timing, and auction status. It does not establish parcel geometry, physical condition, market value, insurability, or title clearance.

**Documented access.**

- Event site: https://waynecountytreasurermi.com/
- County auction policy/context: https://www.waynecountymi.gov/Government/Elected-Officials/Treasurer/Claims-Auctions
- Delinquent property lookup: https://pta.waynecounty.com/
- Annual foreclosure-list archive: https://www.waynecountymi.gov/Government/Elected-Officials/Treasurer/Property-Tax-Information/Forfeited-Property-List-with-Interested-Parties
- Access is browser/PDF/form oriented. No supported bulk API or stable machine contract was proven in this packet.

**Expected fields.** Documented or directly exposed: parcel ID/search key, property address/municipality, foreclosure year/list membership, auction dates, and minimum-bid context. Candidate fields requiring live schema proof: auction/lot ID, current lot status, bid amount/history, deposit/registration status, and cancellation/reoffer reason.

**Refresh pattern.** Event-driven and volatile during the auction cycle; annual foreclosure lists plus auction-site updates. Recheck close to operator action and preserve every observed snapshot with retrieval time.

**Failure modes.** Page/PDF layout drift; late lot withdrawal or reoffer; stale saved list; punctuation differences in Detroit parcel IDs; form/session controls; auction vendor changes; address mismatch; source unavailable near bidding deadlines.

**Legal/access limits and cost.** Public browsing is free. Do not automate bidding, bypass registration/session controls, or scrape contrary to site terms. Treat participation deposits and purchase costs as transaction costs, not API fees.

**Human escalation.** Operator must confirm current lot availability, auction rules, registration/deposit readiness, and final pre-bid status in the official auction surface. A published minimum bid is not the Ashante hard cap.

**Evidence and confidence.** Official pages were reachable/documented on 2026-09-03. Production endpoint and schema: unproven. Integration status: **NOT OPERATIONAL / UNPROVEN**.

## DS_GIS — Wayne County and Detroit parcel GIS

**Purpose and authority.** Primary spatial/parcel-boundary reference and strong corroborating source for parcel identifiers and normalized location. Assessor and municipal systems remain authoritative for assessed/property-record details; GIS geometry is not a survey or title opinion.

**Documented access.**

- Wayne County maps/data: https://www.waynecountymi.gov/Government/Departments/Information-Technology/Maps-Data
- Wayne County public ArcGIS layer: https://www.waynecounty.com/gisserver/rest/services/ParcelViewer/prcls_fullAdd_parsed_FINAL/FeatureServer/0
- Detroit current parcels: https://data.detroitmi.gov/datasets/detroitmi::parcels-current-1/explore
- ArcGIS REST supports query responses in JSON, GeoJSON, and PBF, pagination, and a 2,000-record maximum per response on the observed Wayne layer.

**Expected fields.** Proven on the observed Wayne layer: polygon geometry; source object ID; parcel identifiers including `packedParc`, `PID_Dborn`, and `PID_All`; owner-name field; street/city/state/ZIP; several parsed/full-address fields; shape area/length. Detroit's portal identifies its current layer as 2026 tax-year parcel boundaries. Do not assume identical schemas across municipalities.

**Refresh pattern.** Dataset/publication driven. Detroit labels the current parcel layer by tax year; Wayne publishes without a proven change feed or historical-moment support on the observed layer. Capture service item ID, layer schema, spatial reference, and retrieval time; poll metadata before bulk refresh.

**Failure modes.** Service/layer replacement; 2,000-row truncation; schema alias drift; tax-year lag; invalid/complex geometry; CRS mistakes; owner-name privacy handling; duplicate parcel fields; municipal coverage differences; layer advertises edit capabilities that Ashante must never use.

**Legal/access limits and cost.** Public query/download surfaces are free at observed access. Wayne County disclaims accuracy/currentness for downloadable GIS data. Use read-only queries; never call edit/apply-edits operations. Confirm acceptable bulk-use terms before a countywide pull.

**Human escalation.** Escalate identifier conflicts, geometry ambiguity, split/combined parcels, tax-year mismatch, and any address-only match. A surveyor or appropriate local authority resolves boundary/legal-description questions.

**Evidence and confidence.** Live service metadata and field list were observable on 2026-09-03. Full-corpus extraction and rate behavior were not tested. Integration status: **NOT OPERATIONAL / UNPROVEN**.

## DS_BSEED — Detroit building, safety, and property-condition records

**Purpose and authority.** City of Detroit authority for published BSEED administrative records such as permits, vacant-property registrations, certificates of occupancy/compliance, demolition permits, and related enforcement records. Coverage is Detroit-specific and does not imply current physical condition.

**Documented access.**

- Portal landing/search: https://data.detroitmi.gov/search?tags=bseed
- Building permits: https://data.detroitmi.gov/datasets/detroitmi::building-permits/about
- Vacant-property registrations: https://data.detroitmi.gov/datasets/vacant-property-registrations-1/about
- Certificates of occupancy: https://data.detroitmi.gov/datasets/detroitmi::certificate-of-occupancy-1/about
- Blight tickets: https://data.detroitmi.gov/datasets/detroitmi::blight-tickets/about
- Portal datasets expose ArcGIS download/API resources; individual service item/layer IDs and schemas must be pinned during adapter proof.

**Expected fields.** Dataset-dependent candidates: record/permit/ticket ID; parcel/address/location; record type; status; issue/application/event dates; work description; permit valuation; contractor/applicant where published; vacancy registration; certificate status. The building-permit metadata states coverage from 2019 to present. Exact fields must come from each live layer metadata, never a union guessed across datasets.

**Refresh pattern.** Dataset-specific administrative updates. Use incremental date/object-ID windows only after proving stable semantics; retain the portal's data-updated timestamp and source snapshot ID.

**Failure modes.** Layer/item replacement; retrospective corrections; duplicate addresses; missing parcel IDs; open permit interpreted as unfinished work; closed ticket interpreted as repaired condition; coverage beginning in 2019; delayed publication; conflicting records across BSEED datasets.

**Legal/access limits and cost.** Public portal/API access appears free. Confirm portal/API terms, rate limits, and published-field privacy constraints before bulk use. Do not infer protected or private facts from names or contact fields.

**Human escalation.** Refer uncertain permit/compliance/vacancy meaning to BSEED or a qualified inspector. Administrative records are evidence, not an automated structural, occupancy, or insurability certification.

**Evidence and confidence.** Official portal pages and dataset descriptions were discoverable on 2026-09-03. No production adapter or full schema snapshot exists yet. Integration status: **NOT OPERATIONAL / UNPROVEN**.

## DS_Env — FEMA flood and EPA environmental sources

**Purpose and authority.** FEMA is the primary federal source for effective flood-hazard mapping. EPA Envirofacts aggregates federal environmental program data. These sources support screening and evidence; they do not provide a parcel-specific environmental assessment, insurance determination, or clean bill of health.

**Documented access.**

- FEMA NFHL overview/services: https://www.fema.gov/flood-maps/national-flood-hazard-layer and https://hazards.fema.gov/femaportal/wps/portal/NFHLWMS
- OpenFEMA read-only API documentation: https://www.fema.gov/about/openfema/api
- EPA Envirofacts REST API: https://www.epa.gov/enviro/envirofacts-data-service-api
- EPA documents REST queries with JSON default and CSV/Excel/HTML/JSONP/Parquet/PDF/XML alternatives; long queries must be paged because service requests are limited to 15 minutes.

**Expected fields.** FEMA candidates: effective flood zone, special-flood-hazard-area indicator, floodway, base-flood-elevation where present, panel/community identifiers, map effective date, geometry/version. EPA candidates vary by program: facility/program identifiers, facility name/location, program system, regulated activity/release/waste/cleanup indicators, reporting/effective dates, and coordinates. Keep program-specific provenance; proximity is not parcel contamination.

**Refresh pattern.** FEMA effective-map publication and revision driven; record map effective/version dates. EPA is program/dataset specific; inspect model metadata and update schedules rather than inventing one global TTL.

**Failure modes.** Point-versus-parcel spatial joins; CRS errors; map revisions; no mapped coverage; geocoding error; facility proximity misrepresented as parcel impact; duplicated EPA facilities across programs; stale reporting years; large-query timeout.

**Legal/access limits and cost.** Federal public services are free at documented access. Respect service limits and paging; preserve federal disclaimers and source dates.

**Human escalation.** Flood-zone or insurance decisions require current official determination and appropriate insurance/professional review. Environmental flags requiring diligence route to environmental professionals/local records; never auto-clear a property because no API record was found.

**Evidence and confidence.** Official service documentation was reachable on 2026-09-03. Parcel-level join accuracy and production availability are unproven. Integration status: **NOT OPERATIONAL / UNPROVEN**.

## DS_Title — Wayne County Register of Deeds and human title workflow

**Purpose and authority.** Recorded land documents are primary evidence for deed/mortgage/lien research. The source does not itself produce a legal conclusion, marketable-title opinion, or Ashante title clearance.

**Documented access.**

- Register of Deeds: https://www.waynecountymi.gov/Government/Elected-Officials/Register-of-Deeds
- Search/copy services: https://www.waynecountymi.gov/Government/Elected-Officials/Register-of-Deeds/Search-Services-and-Copy-Requests
- Remote post-1986 records: https://www.waynecountylandrecords.com/recorder/web/
- The county states that online access requires a credit-card account: $6 for 15 minutes or $24 for 60 minutes, plus $2 per copied page. Search-by-mail is $15 per address; certifications are $10 per document. Appointment-only service has been in effect since 2025-10-01.

**Expected fields.** Candidate index/document evidence: instrument/document number; liber/page; recording date; document type; grantor/grantee; legal description; parcel/address reference where present; image/page count; copy/certification metadata. Exact online index fields and permitted automation must be established under the account terms.

**Refresh pattern.** Transactional as documents are recorded, with possible indexing delay. Title workflow must record search-through date/time, search method, query variants, documents reviewed, reviewer identity, and unresolved gaps.

**Failure modes.** Pre-1986 online gap; name spelling variants; incomplete parcel/address indexing; recording-to-index delay; scanned-image quality; legal-description mismatch; unrecorded interests; paid session expiry; appointment delay; document chain requiring professional interpretation.

**Legal/access limits and cost.** Human/transactional and paid. Do not share credentials, bypass session/payment controls, bulk scrape, or store redistributable document images in Git. Current posted fee/access rules may change and must be rechecked before use.

**Human escalation.** Mandatory. The canonical promotion gate requires title clearance through the defined human workflow. A qualified title professional/attorney or authorized operator must review unresolved interests; the system may record evidence and blockers but cannot manufacture legal certainty.

**Evidence and confidence.** Official fee/access statements were observed on 2026-09-03. No authenticated search or legal review was performed. Integration status: **HUMAN-ONLY / NOT OPERATIONAL**.

## DS_MLS — Licensed MLS/RESO market evidence

**Purpose and authority.** Licensed MLS data can be primary evidence for listing status and broker-entered listing facts and strong market/comparable evidence within its permitted scope. It is not an assessor, title, condition, or auction-status authority.

**Documented access.**

- RESO Web API overview: https://www.reso.org/reso-web-api/
- RESO explicitly states that RESO defines standards but does not provide MLS data. Credentials come from the relevant local MLS after data-use/licensing agreement, then from its technology provider.
- Provider, dataset, fields, refresh entitlement, retention rules, and display/export rights are not yet selected or proven.

**Expected fields.** Contract-dependent candidates: listing key/ID; property type/subtype; status and status-change dates; list/original/close price; list/contract/close dates; address/parcel ID where licensed; beds/baths/area/year built; remarks/media; broker attribution; modification timestamp. Normalize only fields granted by the executed agreement.

**Refresh pattern.** Provider feed and licensing policy determine cadence, often incremental by modification timestamp. Do not promise real-time or near-real-time behavior before credentialed testing and SLA review.

**Failure modes.** Credential expiry; OAuth/provider outage; local-field extensions; RESO-version drift; deleted/expired listing retention restrictions; duplicate listings; off-market gaps; field-level display/export prohibitions; comp-selection bias.

**Legal/access limits and cost.** Licensed/paid, price unknown until provider selection. No scraping consumer listing sites. Data use, storage, derived analytics, export, attribution, and retention must follow the executed MLS/provider agreement.

**Human escalation.** If credentials are unavailable, show MLS as gated/human-only and use permitted public records or operator-entered evidence with lower authority. Comparable selection and adjustments remain reviewable; absence of MLS evidence is not evidence of no market.

**Evidence and confidence.** RESO access requirements were confirmed from the standards body on 2026-09-03. No local MLS agreement/provider/credentials exist in evidence. Integration status: **GATED / NOT OPERATIONAL**.

## DS_Imagery — street-level/aerial imagery and operator observations

**Purpose and authority.** Imagery is observation evidence for visible exterior signals and navigation/context. It cannot establish interior condition, structural soundness, occupancy, insurability, legal compliance, or title.

**Documented access.**

- Google Street View Static API usage/billing: https://developers.google.com/maps/documentation/streetview/usage-and-billing
- Street View metadata: https://developers.google.com/maps/documentation/streetview/metadata
- Google Maps Platform terms: https://cloud.google.com/maps-platform/terms
- Static Street View requires billing plus an API key/OAuth token and is pay-as-you-go. Metadata requests can identify availability/capture date without consuming image quota. Google restricts scraping, bulk download, caching, rehosting, and derived-content uses except as specifically permitted.

**Expected fields.** Provider metadata candidates: panorama/provider ID, availability, capture date granularity, location/heading/pitch/FOV, requested address/coordinates, retrieval time, attribution, and source URL/reference. Ashante observations must separately record the human/model observation, confidence, limitation, reviewer, and evidence reference; provider imagery is not copied into Git.

**Refresh pattern.** Capture dates are irregular and provider controlled; metadata date may be year-only or omitted. Refresh on property review/promotion according to risk policy, not by assuming new imagery exists.

**Failure modes.** No panorama; wrong-side/wrong-property image; geocoding/parallax error; old or seasonally obscured view; image/date unavailable; quota/billing/key failure; terms change; imagery mistaken for current roof/interior condition.

**Legal/access limits and cost.** Metered. Enable billing and quotas only with operator approval. Obey attribution, caching, storage, display, and no-scraping/no-bulk-download restrictions. Google Maps content must not be used to train/test/validate/fine-tune machine-learning models under the observed terms.

**Human escalation.** Mandatory for material condition decisions. High roof risk remains blocked pending required reverification. Operator field photos/notes, with consent and provenance, are a separate evidence class and must not be mislabeled as provider imagery.

**Evidence and confidence.** Current official documentation was observed on 2026-09-03; no API key, billable request, or provider selection was tested. Integration status: **GATED / NOT OPERATIONAL**.

## Cross-source precedence and next proof

| Question | Leading authority | Required corroboration/escalation |
|---|---|---|
| Is the lot currently offered and at what published minimum? | DS_Auction | Recheck official auction surface immediately before action |
| Which parcel does this record identify? | DS_GIS plus municipal assessor identifiers | Conflict queue; never silent address-only merge |
| What Detroit administrative actions are published? | DS_BSEED | Interpret status/date in source context; inspect/ask agency if material |
| What federal flood/environmental flags exist? | DS_Env | Current map/program metadata; professional review where material |
| Is title cleared for promotion? | Human title workflow using DS_Title evidence | Qualified review; automation cannot clear |
| What licensed listing/comp evidence is available? | DS_MLS under executed agreement | Human comp review and provenance |
| What exterior conditions are visible? | Dated DS_Imagery/operator evidence | Field reverification; no interior/structural inference |

The next admissible step is not production ingestion. W3 must define and test the common adapter/source-health contract; W4 must then prove identity and source precedence against allowed Wayne County examples. Only those receipts can promote a source from documented capability to operational status.
