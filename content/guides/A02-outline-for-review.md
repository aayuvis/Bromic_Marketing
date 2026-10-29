---
id: A02-outline
type: report
title: "Planning Guide v2: structure and changes for owner review"
slug: planning-guide-v2-outline-review
audience: [RES, ARC, BLD, COM]
stage: [CO, IN]
cell: RES-IN
asset: A02
summary: "One page for Mike Clifford and 454 Creative: the nine-step sequence the three A02 editions now share, what changed against the 2021 guide and the session-1 drafts, and the open questions."
primary_keyword: outdoor heating planning guide
secondary_keywords: []
ai_prompt: "What changed in the Bromic Planning Guide v2?"
meta_description: "Internal review summary of the Bromic Outdoor Heating Planning Guide v2 editions and changes from v1.2 (2021)."
cta: {label: "Book a design consult", asset: A07}
hero: l-022-201
images: []
owner_review: Mike Clifford + 454 Creative
status: in-review
gated: false
related: [A02-homeowner, A02-pro, A02-commercial]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "The Official Outdoor Heating Planning Guide, US v1.2"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "Baseline structure and figures being replaced"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Current range, coverage and controls"
    verified: true
  - id: s3
    publisher: Bromic Heating
    title: "Product pages (Tungsten, Platinum, Platinum Marine, Eclipse, Eclipse Freestanding, Cobalt, Platinum Gas, Tungsten Gas, Tungsten Freestanding, Affinity controllers), bromic.com"
    year: 2026
    url: https://www.bromic.com/product/tungsten-smart-heat-electric/
    supports: "Per-model wattage, coverage, amps, mount heights, warranty, controller capacity (read 29 Oct 2026; see data/product-facts.json site blocks)"
    verified: false
  - id: s4
    publisher: U.S. Energy Information Administration
    title: "Monthly Energy Review, Natural Gas Prices, Heating Oil and Propane Update (rates used in tools/A20-tco/config.json)"
    year: 2026
    url: https://www.eia.gov/totalenergy/data/monthly/
    supports: "13.54 cents/kWh commercial (May 2026); $0.87/therm commercial (Jan–May 2026); $2.674/gal residential propane (30 Mar 2026)"
    verified: false
---

# Planning Guide v2: structure and changes

Revision 2 (29 Oct 2026) answers the owner's instruction: new numbers, new content, better flow, corrected products. All three editions now run one nine-step sequence, each step a short page ending in its own checklist. Product figures come from the Lookbook 2026[^s2] and the bromic.com product pages read on 29 Oct 2026[^s3], via `data/product-facts.json`; running costs use the EIA rates already in the A20 TCO model[^s4]; the 2021 guide supplies only the principles still valid[^s1]. Unknowns are `[[VERIFY]]`.

## The sequence (all editions)

1 Is it outdoor? → 2 Measure → 3 Choose fuel (radiant, electric vs gas, running cost) → 4 Choose style and mounting → 5 Size it (links the [A03 calculator](asset:A03)) → 6 Plan power or gas → 7 Controls (required) → 8 Clearances and code → 9 Design service ([A07](asset:A07)).

| | Homeowner ([A02-homeowner](item:A02-homeowner)) | Professional ([A02-pro](item:A02-pro)) | Operator ([A02-commercial](item:A02-commercial)) |
|---|---|---|---|
| Audience / stage | RES · CO, IN | ARC, BLD · CO, IN | COM · CO, IN |
| Depth | Plain language; 20 × 12 ft example | Range matrix with SKUs, IP and certification; amps at 208/240/277 V × 1.25; A03 factors; controller specs | Revenue formula up front; 600 ft² five-year energy example; zones by channel; fire-code table; rollout in Step 9 |
| CTA | Book a design consult → A07 | Download the spec kit → A11 | Get your ROI assessment → A21 |
| Length | ≈ 2,600 words | ≈ 2,600 words | ≈ 2,300 words |

## Change log

### Against the 2021 guide (v1.2)

| Topic | 2021 | v2 revision 2 |
|---|---|---|
| Range | Platinum and Tungsten gas/electric, Tungsten Portable; no Eclipse, Cobalt, Marine or app | Full current range by family and size: Tungsten Electric 2000–6000 W, Platinum Electric and Marine 2300/3400/4500 W, Eclipse Electric and Freestanding 2900 W, Cobalt 4000/6000 W, Platinum Gas 23,600/39,800 Btu/h, Tungsten Gas built-in (two sizes, output withheld), Tungsten Freestanding Gas; Coastal and Select coming soon |
| Naming | Numbered series | Family name plus size or output only |
| Coverage | Ranges (electric 65–108 ft², gas 160–215 ft²) | Per model: 65/100/130/160; 65/108/143; 121; 130/160; 160/215 ft² |
| Tungsten gas output | 39,800 Btu diagram | Built-in: coverage only. Freestanding: 38,000 Btu/h (Lookbook) |
| Running cost | $0.40 / $2.50 / $0.88 per hour for 200 ft² (2021 prices) | Formula plus per-heater cost at the A20 EIA rates, source and month stated |
| Electrical | 208/240/277 V listed | Amps per model at 208 and 240 V (pro adds 277 V and × 1.25); gas built-ins need 110 V 2 A |
| Mount heights | 72 in wall, 96 in ceiling | Per model, incl. Cobalt 6/8 ft, Eclipse 96 in, Eclipse Freestanding 79 in |
| Controls | Step 08, marked optional in 2021 | Required Step 7: controller, channels (6 kW per channel; up to 10 gas heaters per On/Off channel; one Eclipse per channel), wall switch, app, expansion board; Wi-Fi/app sold-separately note |
| Warranty | Not given | By product |
| Flow | Eight steps, controls last and not required | Nine steps, one sequence in every edition, checklist per step |

### Against the session-1 drafts

- Restructured all three editions onto the nine-step sequence; the homeowner's closing one-page checklist and the pro's closing submittal checklist were replaced by per-step checklists (no repetition).
- Added current Tungsten Electric (2–6 kW), Cobalt, Platinum Electric Marine, Platinum Gas and Tungsten Gas built-in by size; removed blanket "[[VERIFY: coverage per wattage]]" where the site now gives it.
- Replaced the residential EIA 2024/2025 rates (18.2¢/kWh, $1.40/therm, $2.46/gal) and commercial 12.75¢/kWh with the A20 config rates; worked examples recomputed.
- Pro: amps table extended to Eclipse, Cobalt and Tungsten (calculated, flagged); controller IP, range, connectivity and certification; SKUs; deflector thresholds; A03 sizing factors stated.
- Commercial: fuel table normalised by coverage; 600 ft² five-year example; controls by channel; mount heights in the code table; rollout folded into Step 9.

## Open questions for Mike Clifford

1. Current Tungsten Electric (2000–6000 W, 65–160 ft², site) vs Coastal/Select (64–144 ft², Lookbook): does the 6000 W / 160 ft² model stay when they launch? Wattages, warranty and certification for Coastal and Select, and launch dates.
2. Eclipse Electric 2900 W (spec table, used) vs 3000 W (FAQ).
3. Tungsten Freestanding Gas 38,000 Btu/h (Lookbook, used) vs 38,500 (site); its controls; warranty for the natural-gas model.
4. Tungsten Gas built-in output: site shows two models; content still withholds it. Release?
5. Tungsten Electric amps: not on the site; guides show W ÷ V, flagged. Cobalt 208 V amps (18.75 / 28.4) sit below W ÷ 208.
6. Cobalt coverage 130/160 ft² (spec table, used) vs "up to 144 ft²" (features).
7. Controller capacities: 6 kW per channel at 208–277 V; up to 10 gas heaters per On/Off channel; Cobalt and gas compatibility (spec table vs FAQ); does the Eclipse Freestanding need an Affinity Eclipse controller for the app?
8. List prices: may the homeowner edition quote "from $798" (Tungsten Electric) and "from $370" (On/Off controller)?
9. Platinum Electric Marine 316 vs 314 stainless (FAQ); Platinum Gas wind rating 20 km/h vs 12 mph.
10. Clearance tables, recess-kit cut-outs, gas inlet sizes and pressures per model.

Also open: residential 2026 rates for the homeowner edition (Brian Kim/Finance); A03 enclosure, climate and height factors (Mike Clifford); IFC 2024 text (Shaughn Ritchie); layout and diagrams (454 Creative).
