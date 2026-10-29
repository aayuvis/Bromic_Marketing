# HubSpot form spec — Bromic lead capture

**Status:** draft for review · **Owner:** Brian Kim (marketing ops) · **Updated:** 29 Oct 2026
**Source brief:** HANDOVER §9. Scoring lives in [lead-scoring.md](lead-scoring.md).

This is a specification for humans to build in HubSpot. Nothing here has been configured in HubSpot. Internal names are the
property names the tools already send (`tools/_shared/lead.js`, `buildPayload`); keep them identical when the properties are
created, or the tool payloads will not map.

Unknowns are marked `[[VERIFY: what — owner]]` and logged in `reviews/open-questions.md`.

---

## 1. One core form, everywhere

Every gated asset (guides, kits, tools, the Design Your Space request) uses the same core form. Assets differ only in their
hidden fields and their thank-you behaviour. One form means one routing rule set, one scoring model and one report.

| Form | Used by | Notes |
|---|---|---|
| `bromic_core_gate` | A01, A02, A04, A08, A11, A12, A13, A14, A15, A16, A18, A20, A21, A22, and the tool lead gates (A03, A20, A21) | Progressive profiling on (§4) |
| `bromic_design_request` | A07 Design Your Space 2.0, "Talk to an expert" | Core fields, plus project description and plan upload; never progressive (sales needs the full set) |
| `bromic_subscribe` | Blog and stats-page newsletter sign-up | Email and consent only; no score beyond the subscribe event |

Which assets take the full form and which take email only is an open decision. [[VERIFY: gating rule per asset, full form vs email-only — Brian Kim]]

---

## 2. Visible fields (first conversion)

| Order | Label on the form | Internal name | Type | Required | Values (picklist: internal value · label) | Why |
|---|---|---|---|---|---|---|
| 1 | First name | `firstname` | single-line text (HubSpot default) | Yes | | Contact |
| 2 | Last name | `lastname` | single-line text (HubSpot default) | Yes | | Contact |
| 3 | Email | `email` | email (HubSpot default) | Yes | Lower-cased on submit | Contact, de-duplication |
| 4 | I am a… | `i_am_a` | dropdown | Yes | `homeowner` · Homeowner; `architect_designer` · Architect / designer; `builder_installer` · Builder / installer; `commercial_operator` · Commercial operator; `dealer` · Dealer | Routing. The single most important field. |
| 5 | ZIP / postal code | `zip` | single-line text (HubSpot default) | Yes | US ZIP (5 or 9 digit), Canadian, UK, AU and EU postcodes; upper-cased on submit | Territory and climate |
| 6 | Project timing | `project_timing` | dropdown | Yes | `0_3_months` · 0–3 months; `3_6_months` · 3–6 months; `6_12_months` · 6–12 months; `researching` · Researching | SAL/SQL qualification |
| 7 | Company | `company` | single-line text (HubSpot default) | Professionals only: shown and required when `i_am_a` is not `homeowner` (dependent field) | | Account matching |
| 8 | Project size | `project_size_value` | number | Optional | Whole number above 0 | Scoring, sales prep |
| 9 | (unit, beside project size) | `project_size_unit` | dropdown | Only when a size is given | `homes` · No. of homes; `seats` · Seats; `ft2` · ft² | Read together with the value |
| 10 | Consent (see §6) | `marketing_consent` and HubSpot subscription types | checkbox | See §6 | | Lawful email |

Default the project size unit from the asset: `homes` for BLD assets, `seats` for COM assets, `ft2` for RES and ARC. The tools
already do this.

Field help text, short and plain:
- I am a… — "So we send you the right material and the right person."
- ZIP / postal code — "Used for your local team and climate. We never share it."
- Project timing — "Roughly is fine."

---

## 3. Hidden fields

Set on every form from the page, never shown to the visitor.

| Internal name | Type | Filled from | Example | Rules |
|---|---|---|---|---|
| `asset_id` | single-line text | The asset that holds the form | `A16` | One of A01–A24; required, the form refuses to post without it |
| `matrix_cell` | single-line text | The asset's primary journey cell; a `?matrix_cell=` URL parameter overrides it when valid | `BLD-IN` | Pattern `(RES\|ARC\|BLD\|COM)-(AW\|CO\|IN\|PP\|BY)`; an invalid override falls back to the default |
| `utm_source` | single-line text | URL query | `google` | First 200 characters |
| `utm_medium` | single-line text | URL query | `cpc` | First 200 characters |
| `utm_campaign` | single-line text | URL query | `fy27_bld_prewire` | First 200 characters |
| `utm_term` | single-line text | URL query | `pre wire patio heater` | First 200 characters |
| `utm_content` | single-line text | URL query | `video_a` | First 200 characters |
| `tool_inputs` | multi-line text | The tool's current inputs, as JSON | `{"length_ft":20,"width_ft":12,"enclosure":"covered"}` | Tools only (A03, A20, A21); `{}` elsewhere. Never holds name, email or other personal data. |
| `consent_text_version` | single-line text | The version id of the consent wording shown | `2026-10-v1` | See §6 |
| `form_page_url` | single-line text | HubSpot captures the conversion page by default; add only if the embed hides it | | |

HubSpot also records first and latest conversion, original source and page; use those rather than duplicating them.

Contact properties to create once (all in a property group "Bromic lead capture"): `i_am_a`, `project_timing`,
`project_size_value`, `project_size_unit`, `asset_id`, `matrix_cell`, `tool_inputs`, `consent_text_version`, plus the
progressive fields in §4 and the routing fields in §5. `asset_id` and `matrix_cell` are overwritten on each conversion; keep a
history with a multi-checkbox `assets_converted` (A01–A24) appended by workflow, so scoring can count distinct assets.

---

## 4. Progressive profiling

HubSpot's progressive fields swap a known field for the next unanswered one in the queue. The first conversion always takes the
core set in §2. Later conversions keep name and email (pre-filled for a recognised visitor), and replace every field already
known with up to **two** queued questions, so the form never grows.

### 2nd conversion

| Audience (`i_am_a`) | Ask | Internal name | Type | Values |
|---|---|---|---|---|
| All | Project type | `project_type` | dropdown | `new_build` · New build; `renovation` · Renovation or addition; `existing_space` · Existing outdoor space; `multi_site` · Several sites |
| All | Heating preference | `heating_preference` | dropdown | `electric` · Electric; `gas` · Gas; `not_sure` · Not sure yet |
| Homeowner | Space type | `space_type` | dropdown | `open` · Open; `partially_covered` · Partially covered; `covered` · Covered (the A03 enclosure options) |
| Architect / designer | Project phase | `design_phase` | dropdown | `schematic` · Schematic design; `design_development` · Design development; `construction_documents` · Construction documents; `bid_construction` · Bid or construction |
| Builder / installer | Homes per year | `homes_per_year` | number | Whole number |
| Commercial operator | Venue type | `venue_type` | dropdown | `restaurant` · Restaurant or bar; `hotel` · Hotel or resort; `club` · Club or venue; `other` · Other |
| Dealer | Showroom or trade only | `dealer_type` | dropdown | `showroom` · Showroom; `trade` · Trade only; `online` · Online |

### 3rd conversion

| Audience | Ask | Internal name | Type | Values |
|---|---|---|---|---|
| All | Phone (optional) | `phone` | phone (HubSpot default) | Optional; never required |
| All | Best way to reach you | `preferred_contact` | dropdown | `email` · Email; `phone` · Phone; `either` · Either |
| Professionals | Job title | `jobtitle` | single-line text (HubSpot default) | |
| Builder / installer | Where you build | `build_regions` | single-line text | States or metro areas |
| Commercial operator | Number of locations | `location_count` | number | Whole number |
| Architect / designer | Spec practice | `spec_practice` | dropdown | `proprietary` · Usually name one product; `basis_of_design` · Basis of design with substitutions; `performance` · Performance specification (links to the A11 Option A/B question) |

`bromic_design_request` (A07) always asks the full set, plus `project_description` (multi-line, optional), a plan upload
(file, optional) and `phone` (required on this form only, because the service is a call-back).
[[VERIFY: A07 turnaround promise (48–72 h) and what the request form must collect for a layout and BOM — Shaughn Ritchie + Brian Kim]]

---

## 5. Routing

Routing runs on submit, in this order. The first rule that matches wins.

| # | When | Then | Owner queue |
|---|---|---|---|
| 1 | Form is `bromic_design_request`, or the visitor clicked "Talk to an expert" | Create a deal-ready task at once; lifecycle to SQL candidate; notify the territory owner | Territory sales (by ZIP, below) |
| 2 | `i_am_a` = `architect_designer` | A&D specification queue; nurture with A11, A13, A14 | [[VERIFY: A&D owner per territory — Shaughn Ritchie]] |
| 3 | `i_am_a` = `builder_installer` | Builder programme queue; nurture with A15, A16, A18 | [[VERIFY: builder contact per region — Arvin Avaness]] |
| 4 | `i_am_a` = `commercial_operator` | Commercial (HORECA) queue; nurture with A20, A21, A22 | [[VERIFY: commercial owner per territory — Blake Petty]] |
| 5 | `i_am_a` = `dealer` | Dealer and partner queue, not the lead score | [[VERIFY: dealer enquiry owner — Peter Abraham]] |
| 6 | `i_am_a` = `homeowner` | Homeowner nurture; at SQL, hand to the nearest dealer or installer by ZIP | [[VERIFY: dealer-referral rules and who sends the hand-off — Brian Kim]] |

### By ZIP / postal code

- Create `territory` (dropdown) and `climate_zone` (dropdown) properties, set by workflow from `zip`.
- **US:** ZIP → territory from a lookup table owned by sales ops. [[VERIFY: US territory map by ZIP prefix or state, and owner per territory — Brian Kim]]
- **US climate:** ZIP → IECC climate zone from a published county list. [[VERIFY: lookup source for ZIP-to-climate-zone — Brian Kim]]
- **Canada:** the first letter of a postal code identifies the province or territory. Route to the Canada owner. [[VERIFY: Canada owner — Brian Kim]]
- **Outside US and Canada (AU, UK, EU):** route to the regional Bromic team. [[VERIFY: regional owners for AU, UK and EU — Brian Kim]]
- A ZIP that matches no table goes to a "Needs territory" view, reviewed weekly. It is never dropped.

### Country

`zip` alone cannot always tell the country, and consent rules depend on it (§6). On US pages default `country` (HubSpot default
property) to United States. On CA, UK, AU and EU pages show a required `country` dropdown. [[VERIFY: whether the US form also
asks country, or infers it from IP — Brian Kim + counsel]]

---

## 6. Consent and privacy

The rules differ by market. The safest single build is the strictest one: an unticked box, a privacy link and an unsubscribe in
every email. Counsel signs this section off before any form goes live. [[VERIFY: legal review of consent wording and lawful
basis per market — counsel via Brian Kim]]

| Internal name | Type | Shown | Required | Notes |
|---|---|---|---|---|
| `marketing_consent` | single checkbox (HubSpot subscription type "Marketing information") | Every form | No, except where the market requires express consent to send marketing (Canada, EU, UK) | Never pre-ticked |
| (processing consent text) | HubSpot "legitimate interest" or "consent to process" notice | Every form | Shown, not ticked | Links the privacy policy; says the data is used to answer the request |
| `consent_text_version` | hidden | Every form | Yes | Which wording the visitor saw, so consent can be proved later |

Suggested wording, plain and short:

> Send me Bromic design ideas, product news and events by email. You can unsubscribe at any time.
> We use your details to send what you asked for and to put you in touch with the right team. See our [privacy policy]([[VERIFY: privacy policy URL per market — Brian Kim]]).

**United States (CAN-SPAM).** Marketing email may be sent without prior consent, but every email must identify Bromic, carry a
valid postal address, and offer an unsubscribe honoured within 10 business days. Delivering the requested asset is a
transactional message. Use the unticked box anyway, so one form serves every market. [[VERIFY: Bromic postal address for email
footers — Brian Kim]]

**Canada (CASL).** Commercial email needs consent. Express consent must be an active opt-in (the unticked box), with the sender
identified and an unsubscribe in every message. A download request alone gives, at most, time-limited implied consent; treat it
as transactional only. Record when, where and how consent was given (`consent_text_version`, HubSpot's consent timestamp).
[[VERIFY: implied-consent window and record-keeping practice — counsel]]

**EU and UK (GDPR, UK GDPR, ePrivacy/PECR).** Name the lawful basis for processing (consent, or legitimate interest for answering
the request) in the processing notice. Marketing email needs an unticked opt-in. Keep consent records, honour access and erasure
requests, and do not send `tool_inputs` or any form data to systems outside the documented processors. [[VERIFY: data
processing agreement and data residency for HubSpot — counsel]]

**Australia (Spam Act 2003).** Consent, sender identification and a functional unsubscribe. The unticked box covers it.
[[VERIFY: AU wording — counsel]]

What the forms never ask: date of birth, household income, or anything about the visitor's finances beyond an optional project
size.

---

## 7. Thank-you behaviour

| Asset type | After submit |
|---|---|
| Gated guide or kit | Inline thank-you with the download link, and the same link by email (transactional) |
| Tool (A03, A20, A21) | The full report opens on the page; the payload is sent with `tool_inputs`. In the repo the tools `console.log` the payload where the HubSpot embed will go. |
| Design request (A07) | Confirmation with what happens next and when. [[VERIFY: response time promised — Shaughn Ritchie]] |

Each thank-you shows one next step: the next-stage asset for the same journey cell (CLAUDE.md rule 5).

---

## 8. Build checklist for the HubSpot admin

- [ ] Create the properties in §2–§5 with these exact internal names and picklist values.
- [ ] Build `bromic_core_gate`, `bromic_design_request`, `bromic_subscribe`; turn on progressive fields in the order in §4.
- [ ] Set `company` as a dependent field on `i_am_a` ≠ `homeowner`.
- [ ] Map hidden fields; test one submission per asset and confirm `asset_id`, `matrix_cell` and the UTMs land.
- [ ] Build the routing workflows in §5 and the scoring in [lead-scoring.md](lead-scoring.md).
- [ ] Counsel signs off §6 before launch; record the wording as `consent_text_version`.
- [ ] Replace the `console.log` in each tool with the HubSpot embed.
