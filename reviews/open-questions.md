# Open questions — all logs merged, 29 Oct 2026

Merged from `reviews/open-questions/` (a01-editor, arc-writer, bld-writer, com-writer, guides-writer, kits-writer, res-writer),
HANDOVER §11 and the `[[VERIFY]]` flags in `forms/`. Grouped by owner and de-duplicated: where several writers asked the same
thing, it appears once with every item id that depends on it. The per-writer logs stay as the detailed record.

## Top 10

The ten answers that unblock the most content (basis: docs/HANDOVER-next-session.md §3).

| # | question | suggested owner | item id |
|---|---|---|---|
| 1 | Coverage, wattage, voltage and BTU per current SKU, including coverage per Platinum wattage (2300/3400/4500 W) and the Tungsten built-in gas BTU conflict (39,800 vs 38,000). | Mike Clifford | A02 (all), A11-spec, A12, A16, ARC-IN-01, COM-CO-01, RES-IN-01, A03 config |
| 2 | 2026 utility rates by region (electricity, natural gas, propane), and the delivered price of commercial propane exchange cylinders. | Brian Kim / Finance | COM-CO-01, COM-CO-KB1, COM-IN-01, RES-IN-01, A02 (all), A20 config |
| 3 | ROI benchmarks: average check, turns, extra nights by climate, capture rate, margin basis, typical installed cost. | Blake Petty | COM-IN-01, A02-commercial, A21 config |
| 4 | Atomik Research survey: fieldwork dates, base n, question wording; is the topline 94% or 92%? | Megan Spies | A01-corrections, A01-stats, RES-AW-01, A15 |
| 5 | NEC Article 422 vs 424 for hard-wired outdoor radiant heaters; GFCI in the installation manual; breaker sizes and heaters per circuit; Affinity load per channel. | Mike Clifford + licensed electrician | BLD-IN-01, BLD-IN-KB1, BLD-IN-KB2, BLD-BY-KB1, BLD-PP-01, ARC-BY-01, A02-pro, A16 |
| 6 | Builder price tiers, margins and lead times (A15, A18). | Arvin Avaness / Peter Abraham | A15, BLD-AW-01, BLD-CO-01, BLD-PP-01 |
| 7 | Tungsten Coastal and Select launch dates (and their wattages). | Mike Clifford | A02 (all), A11-spec, ARC-IN-01 |
| 8 | The original `journey-matrix.json` and `assets.json` (both were reconstructed). | Aayush Vishnoi | data/ |
| 9 | Case-study candidates with written permission to publish numbers. | Regional leads | A10, A19, A23, case-study template |
| 10 | Validated keyword volumes and the 40-term priority list. | Brian Kim | A24 (all articles) |

## By owner

### Mike Clifford (product)

| item id | question | suggested owner |
|---|---|---|
| A02 (all), A16, A11-spec, COM-CO-01, COM-CO-KB1, COM-IN-KB1 | Coverage per individual Platinum wattage (which size gives ~65 ft² and which ~143 ft²) and coverage by mounting height; confirm Tungsten Electric coverage changed from 65–108 to 64–144 ft² (Lookbook). | Mike Clifford |
| A02-pro, A16, A11-spec, ARC-IN-01, RES-IN-01 | Wattage and supply for Eclipse Smart-Heat Electric and Freestanding, and Tungsten Coastal and Select (coming soon). | Mike Clifford |
| A02 (all), A16, RES-IN-01 | Platinum Gas and Tungsten Gas (built-in): coverage, mounting, Btu/h input, inlet size, supply pressure; Tungsten built-in BTU (39,800 vs 38,000) is unpublished; confirm 38,000 BTU is the Tungsten Freestanding Gas input rating used for running-cost maths. | Mike Clifford |
| A02-pro | Cobalt Electric and Platinum Electric Marine facts (on the site, not in the Lookbook). | Mike Clifford |
| ARC-IN-01, ARC-BY-01, BLD-IN-01, BLD-PP-01, BLD-IN-KB1, A02-pro, A02-commercial, A16, A11-spec, A12 | Supply voltage per model; which wattages are offered at 208, 240 and 277 V (and any 120 V model); amps at each voltage; output and coverage derating at 208 V. | Mike Clifford |
| ARC-CO-01, ARC-CO-KB1, BLD-IN-01, BLD-BY-01, BLD-PP-01, COM-PP-01, RES-PP-01, A11-spec | Recommended mounting-height range per model and wattage, maximum height, coverage at each height, and current minimums (2021 guide: 72 in wall, 96 in ceiling); Eclipse mounting height and pole selection. | Mike Clifford |
| ARC-BY-KB1, BLD-IN-01, BLD-BY-01, A02-pro, A16, A11-spec, RES-PP-01, RES-CO-01, RES-PP-KB1 | Clearance-to-combustibles tables per model (top, sides, front, below, ceiling, walls, beams), including Tungsten Freestanding Gas overhead clearance. | Mike Clifford |
| A02-homeowner, A02-pro, RES-PP-01 | Recommended centre-to-centre spacing between heaters per model and mounting height. | Mike Clifford |
| ARC-IN-01, ARC-IN-KB1, ARC-BY-01, BLD-IN-01, BLD-CO-01, BLD-BY-01, A16, A11-spec, A12 | Recess kits: part numbers, rough opening / cut-out, cavity depth, in-cavity clearance, ceiling finish thickness, low-clearance recessing on Coastal/Select. | Mike Clifford |
| BLD-IN-01, A16 | Junction-box type and offset per mount type; whether the box is integral to the recess kit; heater and pole weights for blocking. | Mike Clifford |
| A11-spec | Suspension pole lengths available. | Mike Clifford |
| ARC-CO-01, A02-pro | Wavelength classification (short / medium / long, element type) per current model; are the 2021 element temperatures (572 / 1,652 / 3,992 °F) still valid to publish? Approve or cut the "indicative fit" row in ARC-CO-01. | Mike Clifford |
| ARC-IN-01, A02-pro, A11-spec | Listing standard and certification mark per electric model (UL 499 or UL 2021; CSA C22.2; Intertek/UL/CSA) and listing file numbers. | Mike Clifford |
| A11-spec | IP rating (IEC 60529) per series. | Mike Clifford |
| ARC-IN-01, A11-spec, A15, BLD-BY-01 | Warranty terms and periods per series (residential vs commercial, marine/coastal conditions) and the registration process. | Mike Clifford |
| ARC-CO-01, RES-AW-01, RES-CO-01, COM-AW-01, COM-CO-01, COM-CO-KB1, COM-IN-KB1, A02-homeowner, A02-pro, A11-spec, A15 | Affinity controller compatibility: which controllers pair with Tungsten Freestanding Gas, Eclipse Freestanding, gas heaters generally, each Platinum wattage and Tungsten Coastal/Select; does the On/Off controller support the app; which controllers are Wi-Fi enabled. | Mike Clifford |
| A11-spec, RES-BY-01, RES-IN-01 | Dimmer compatibility per series and wattage; Dimmer output levels; is power draw proportional to the Eclipse 33/66/100% steps and Dimmer settings? | Mike Clifford |
| BLD-IN-01, BLD-BY-01, BLD-PP-01, BLD-IN-KB1, BLD-IN-KB2, A02-pro, A16, A02-commercial, RES-BY-01 | Affinity controller electrical: rating, maximum load and heaters per controller or channel, wiring topology (inline line voltage vs low voltage or wireless), back-box size, terminal layout, indoor/outdoor rating, wall-switch leg. | Mike Clifford |
| RES-BY-01, A11-spec, A02-commercial | App and Wi-Fi: network requirements (band, signal), zones per account, Alexa skill and Google action names and supported commands, remote access, manual override without network, retrofit path, multi-site management, BMS (BACnet). | Mike Clifford |
| A11-spec, A12 | Do Affinity schedules and timers satisfy the energy code's "timer switch" for exterior heating, and is there an approved occupancy-sensor interface? | Mike Clifford |
| COM-CO-01, A16 | Tungsten Freestanding Gas on natural gas: connection method (fixed hose, quick-connect outlet), and the NG/propane conversion policy. | Mike Clifford |
| A11-spec | Eclipse Freestanding plug, cord and receptacle requirements; its control method. | Mike Clifford |
| RES-CO-KB2 | Cool-down time and housing surface temperatures per model; any manual guidance on pets. | Mike Clifford |
| COM-BY-01, BLD-BY-01 | Recommended cleaning method and maintenance intervals per model and finish. | Mike Clifford |
| A02-pro | Accessory part numbers and compatibility with current and coming-soon models. | Mike Clifford |
| A11-spec | Which standard details (D1–D4), CAD blocks, Revit families, spec sheets, installation manuals and listing certificates exist; formats, LOD and hosting (bromic.com, BIMobject, ARCAT, other). | Mike Clifford |
| A02 (all), A11-spec, ARC-IN-01 | Tungsten Coastal and Select launch status; labelled "coming soon" throughout until confirmed. | Mike Clifford |
| A01-corrections #28 | Should the p.9 insight carry the full Affinity controls line (integrations and "sold separately")? Confirm the integration list wording. | Mike Clifford |

### Megan Spies (editorial and research)

| item id | question | suggested owner |
|---|---|---|
| A01-corrections #9, #11, #13; A01-stats; RES-AW-01; A15 | Atomik Research survey (Bromic-commissioned): fieldwork dates, base n (public releases say 2,002 US homeowners, 2025, ±3 pts at 95%) and exact wording for 67%, 94% and 23%. | Megan Spies |
| A01-corrections #11 | 4 Feb 2026 release says "nearly 94%", April 2026 feature says "nearly 92%". Which is the topline? Use it everywhere. | Megan Spies |
| A01-corrections #2, #15; ARC-AW-01 | Keep 61.8% (2024 starts) or update to NAHB's 60.5% (2025 starts)? Recommend update, and date whichever is used. | Megan Spies |
| A01-corrections #4, #23; ARC-AW-01 | AIA HDTS: confirm category labels, respondent base and quarter for 55% / 40% in the AIA PDF; is the Q3 2026 "+10%" points or relative? Both 2025 net shares fell from 2024 (60%, 51%), so "increased demand" framing needs correcting. | Megan Spies |
| A01-corrections #34; ARC-AW-01 | The 39% infrared patio heater stat could not be found; cut it, or replace with AIA "heated exterior spaces" after checking the PDF? | Megan Spies |
| A01-corrections #5, #21 | $522B replaced with the Oct 2026 LIRA (~$525B through Q3 2027); re-check at print (next LIRA due 21 Jan 2027). | Megan Spies |
| A01-corrections #33 | Appliance decades on p.12 are unsourced. Supply a source or cut (recommended). | Megan Spies |
| A01-corrections #38 | Add a "Sources and method" back page (needs Atomik fieldwork dates and margin of error). | Megan Spies + 454 Creative |
| A01-stats, BLD (all), RES-PP-01, RES-CO-KB2, BLD-IN-01 | eyeonhousing.org, hdts.aia.org, gaar.com, nar.realtor and nfpa.org could not be opened from the sandbox; figures, NFPA heating-safety wording (3 ft kid-free zone) and the NFPA 70 free-access link were verified from search snippets. Click through before publishing. | Megan Spies |
| BLD-AW-01 | Confirm the 95% new-patio cost recovery in the NAR/NALP 2023 Remodeling Impact Report: Outdoor Features. | Megan Spies |
| ARC-CO-01, ARC-CO-KB1 | Inverse-square source (Florida State Horticultural Society proceedings): confirm year, or swap for a physics reference. | Megan Spies |
| COM-AW-01, A02-commercial | NRA "69% like the option to dine outside" (2023) is from a sponsored secondary source; the patio-share figures are from 2020–21. Confirm, date, replace or cut. | Megan Spies / Blake Petty |
| COM-PP-01, COM-BY-01 | CTA labels for A22 and A23 are not among the three standard CTAs, and both assets are P2 and unbuilt. Approve labels or remap. | Megan Spies |
| RES-CO-KB1, RES-CO-KB2, RES-PP-KB1 | KB items have no backlog asset id; map KB answers to A06/A09, or create a new asset? | Megan Spies |
| RES-*, A02 (all), A16 | `related:` ids were written before the A24 articles existed; confirm now that they are written. | Megan Spies |
| BLD-BY-01 (A17) | A17 install guide series has no named owner in `assets.json`; BLD-BY-01's CTA points to it. | Brian Kim / Megan Spies |
| A15 | Co-marketing: which assets and usage rights builders get. | Megan Spies |

### Brian Kim (marketing ops) and Finance

| item id | question | suggested owner |
|---|---|---|
| COM-CO-01, COM-CO-KB1, COM-IN-01, RES-IN-01, A02 (all) | 2026 utility rates by region. In use: commercial electricity 14.07¢/kWh (EIA MER) or 12.75¢/kWh (EIA EPA 2024); residential 18.2–18.3¢/kWh; natural gas $10.07–10.45/Mcf commercial, $14.50–26.45/Mcf residential; propane $2.46–2.67/gal (EIA 2026–27 outlook reportedly $2.52). The articles disagree with each other; pick one basis and regional rates for the A20 config. | Brian Kim / Finance |
| COM-CO-01, COM-CO-KB1, A02-commercial | Delivered price per gallon for commercial propane exchange cylinders; usable gallons per cylinder and cylinder size for Tungsten Freestanding Gas. | Brian Kim / Blake Petty |
| RES-IN-01, A02-homeowner | 2026 US MSRP per heater, Affinity control, recess kit, pole and deflector. | Brian Kim / Mike Clifford |
| HANDOVER §11.7; forms/hubspot-form-spec §1 | Gating rule per asset: full form vs email only. | Brian Kim |
| HANDOVER §11.9; A24 | Validated keyword volumes and the 40-term priority list. | Brian Kim |
| forms/lead-scoring §3 | MQL and SAL score thresholds, the SAL acceptance SLA and the SQL definition. | Brian Kim |
| forms/lead-scoring §2, §4 | Tier and points for A12, A18 and A22; points for 3–6 and 6–12 month timing; behavioural scoring of ungated pages; score decay; internal domain list; first review date. | Brian Kim |
| forms/hubspot-form-spec §5 | US territory map by ZIP or state with an owner per territory; ZIP-to-IECC-climate-zone source; owners for Canada, AU, UK and EU; dealer-referral rules for homeowners at SQL; whether the US form asks country. | Brian Kim |
| forms/hubspot-form-spec §6 | Bromic postal address for email footers; privacy policy URL per market. | Brian Kim |
| A02-outline | `type: report` file sits in content/guides/; schema puts reports in content/reports/. Move it? | Brian Kim / Hub owner |

### Blake Petty (commercial)

| item id | question | suggested owner |
|---|---|---|
| COM-IN-01, A02-commercial, A21 | ROI benchmarks: average check, turns, extra nights by climate, capture rate, contribution margin, typical installed cost; the 1,000 h/yr illustration (worked example: 40 seats, 1.5 turns, $45, 60 nights, 50%, 30%, $30,000). | Blake Petty |
| COM-CO-01, A20 | Purchase prices (heaters and Affinity controls), electrical install, gas-line extension, propane storage cage or cabinet costs for the 5-year table. | Blake Petty |
| A12 | Current FDNY and DOT/DOB outdoor dining heater rules (the 2020 winter guidance was for the emergency programme). | Blake Petty |
| forms/hubspot-form-spec §5 | Commercial owner per territory. | Blake Petty |

### Shaughn Ritchie (specification, codes and competitors), with counsel

| item id | question | suggested owner |
|---|---|---|
| ARC-IN-01, A11-spec | Confirm MasterFormat 23 83 33 (electric) and 23 83 26 (gas) numbers and titles against the current CSI edition. | Shaughn Ritchie |
| ARC-IN-01, A11-spec | BIM/CAD object availability and format (A13). | Shaughn Ritchie |
| A11-spec | Bromic's preferred default (Option A proprietary or Option B basis of design) and the performance criteria for Option B substitutions. | Shaughn Ritchie + Mike Clifford |
| ARC-PP-01, A12 | NYC LL154: DOB position on piped exterior gas appliances on new buildings, and on portable heaters under §24-177.1(c); does a roof terrace count as "within" the building? | Shaughn Ritchie / NYC code counsel |
| ARC-PP-01, A12 | New York State All-Electric Buildings Act: cert petition filed by 28 Oct 2026? Enforcement date, and treatment of outdoor appliances. | Shaughn Ritchie / counsel |
| ARC-PP-01 | LL97: how exterior-appliance gas on the building meter is counted; confirm the electricity coefficient applies. | Code counsel |
| ARC-PP-01, COM-PP-01, COM-PP-KB1 | FDNY and other fire-code rules on portable propane heaters on commercial patios; NYC: has anything reinstated propane heaters after EEO 200; where natural gas heaters are allowed under DOB Bulletin 2024-005 and DOT Dining Out NYC rules. | Shaughn Ritchie |
| COM-PP-01, COM-BY-01, A02-commercial | IFC 2021 §605.5 and IFC 2024 §603.4 / 603.4.2 text, verified only through local adoptions; confirm against ICC and add NFPA 1 equivalents; Palo Alto amendment year. | Shaughn Ritchie |
| COM-PP-01 | NFPA 58 current-edition separation distances for cylinder storage outside buildings. | Shaughn Ritchie |
| A12 | IECC exterior-heating provision (radiant only, occupancy sensor or timer): section number in the 2021 and 2024 model codes and each target state's adoption. | Shaughn Ritchie |
| A12 | California 2025 Title 24 Part 6 or CALGreen: any provision on outdoor heating equipment. | Shaughn Ritchie |
| A12 | Denver 2025 Energy Code: do outdoor infrared heaters count as "electric resistance space heat"? CPD interpretation and exceptions. | Shaughn Ritchie / Denver CPD |
| A12 | Colorado electric-ready model code: are outdoor heater circuits included? | Shaughn Ritchie |
| A12 | Massachusetts 225 CMR 24.00: each participating town's by-law on outdoor gas appliances and piping. | Shaughn Ritchie |
| ARC-PP-01, A12 | Both need legal and code review before publishing; current to 29 Oct 2026 only. | Shaughn Ritchie |
| HANDOVER §11.5 | Approved Infratech comparison claims. | Shaughn Ritchie |
| forms/lead-scoring §4; forms/hubspot-form-spec §5 | Competitor email-domain list for suppression; A&D owner per territory. | Shaughn Ritchie |
| A07; forms/hubspot-form-spec §4, §7 | Design Your Space turnaround promise (48–72 h), what the request must collect for a layout and BOM, and the response time on the thank-you. | Shaughn Ritchie + Brian Kim |

### Arvin Avaness and Peter Abraham (builder and dealer)

| item id | question | suggested owner |
|---|---|---|
| A15, BLD-AW-01, BLD-CO-01, HANDOVER §11.4 | Builder price tiers and qualifying volumes; Good-Better-Best option price to buyer and builder cost per tier; margin guidance. | Arvin Avaness / Peter Abraham |
| A15, BLD-PP-01 | Lead times by product (heaters, recess kits, Affinity controls), series and region. | Arvin Avaness / Peter Abraham |
| A15 | Model home support (display units, demo programme): offered, and on what terms? | Arvin Avaness |
| A15 | Sales training for design-centre staff: format and availability. | Arvin Avaness |
| A15 | Programme eligibility criteria. | Arvin Avaness |
| A15; forms/hubspot-form-spec §5 | Named programme and builder contact per region. | Arvin Avaness |
| A15 | Typical rough-in (pre-wire) cost range from partner electricians. | Arvin Avaness |
| forms/hubspot-form-spec §5 | Owner for dealer enquiries. | Peter Abraham |

### Licensed electrician (via Arvin Avaness or Mike Clifford)

| item id | question | suggested owner |
|---|---|---|
| BLD-IN-KB2, A02-pro, A16 | Are hard-wired outdoor radiant heaters treated under NEC Article 424 (fixed space heating, 125% rule) or 422? Confirm the 424.4(A) 30 A limit for circuits feeding two or more outlets, breaker size and maximum heaters per circuit per the installation manual. | Licensed electrician / Mike Clifford |
| BLD-IN-01, BLD-BY-KB1 | Does the Bromic installation manual require GFCI (US) or RCD protection? | Mike Clifford |
| ARC-BY-01 | NEC disconnect and ground-fault requirements for hardwired outdoor heaters under the adopted editions (2020/2023). | Electrical engineer via Arvin Avaness |

### Counsel

| item id | question | suggested owner |
|---|---|---|
| forms/hubspot-form-spec §6 | Consent wording and lawful basis per market (CAN-SPAM, CASL, GDPR/UK GDPR, Spam Act); CASL implied-consent window and record keeping; HubSpot data processing agreement and residency; AU wording. | Counsel via Brian Kim |

### 454 Creative

| item id | question | suggested owner |
|---|---|---|
| A02 (all) | Image picks and `[[DIAGRAM]]` markers for layout. | 454 Creative |
| RES-PP-01 | Diagram: plan view of a 24' × 10' terrace with two or three wall heaters and overlapping coverage. | 454 Creative |

### Aayush Vishnoi (sponsor)

| item id | question | suggested owner |
|---|---|---|
| data/journey-matrix.json, data/assets.json | Supply the originals; both were reconstructed. | Aayush Vishnoi |
| data/assets.json | Name owners for A04, A08, A09, A13, A14 and A17 (currently unassigned). | Aayush Vishnoi |

### Regional leads

| item id | question | suggested owner |
|---|---|---|
| A10, A19, A23, HANDOVER §11.8 | Case-study candidates with written permission to publish numbers and quotes. | Regional leads |
