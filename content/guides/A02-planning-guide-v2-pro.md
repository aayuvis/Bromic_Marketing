---
id: A02-pro
type: gated-guide
title: "The outdoor heating planning guide: professional edition"
slug: outdoor-heating-planning-guide-professional
audience: [ARC, BLD]
stage: [CO, IN]
cell: ARC-CO
asset: A02
summary: "The technical backbone for specifiers and builders: radiant theory by wavelength, codes and certification, coverage and mounting, electrical load at 208/240 V, controls integration and a submittal checklist."
primary_keyword: radiant heater outdoor design
secondary_keywords: [short wave infrared heater, infrared heater wavelength, patio heater specification, outdoor heater electrical requirements]
ai_prompt: "What is the difference between short wave and long wave infrared heaters?"
meta_description: "Specifier's guide to outdoor radiant heat: wavelength, codes, coverage and mounting, electrical load at 208/240 V, controls and a submittal checklist."
cta: {label: "Download the spec kit", asset: A11}
hero: l-010-075
images: [l-007-034, l-010-076, l-005-022, t-006-016, l-013-106]
owner_review: Mike Clifford + 454 Creative
status: draft
gated: true
related: [ARC-CO-01, ARC-IN-01, BLD-IN-01]
updated: 2026-10-29
version: "2.0 draft (replaces Planning Guide US v1.2, 10/2021)"
sources:
  - id: s1
    publisher: Bromic Heating / Atomik Research
    title: "Outdoor Living Trends 2026 (US Homeowner Survey)"
    year: 2026
    url: sources/Bromic_Outdoor_Living_Trends_2026.pdf
    supports: "23% of homeowners prioritize outdoor heating during the planning phase"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Current range, coverage, mounting, Affinity Smart-Heat Controls and integrations"
    verified: true
  - id: s3
    publisher: Bromic Heating
    title: "The Official Outdoor Heating Planning Guide, US v1.2"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "30% open rule, wavelength data, mounting heights, code references, accessories, 208/240/277 V options"
    verified: true
  - id: s4
    publisher: National Fire Protection Association
    title: "NFPA 70, National Electrical Code"
    year: 2023
    url: https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70
    supports: "Electric installations follow ANSI/NFPA 70; Article 424; 210.19/210.20 continuous loads"
    verified: false
  - id: s5
    publisher: EC&M
    title: "Article 424: Fixed Electric Space Heating"
    year: 2021
    url: https://www.ecmweb.com/national-electrical-code/code-basics/article/20888653/article-424-fixed-electric-space-heating
    supports: "Branch-circuit conductors and overcurrent devices for fixed electric space heating at not less than 125% of the load (210.19(A)(1), 210.20(A), 424)"
    verified: true
  - id: s6
    publisher: National Fire Protection Association
    title: "NFPA 54, National Fuel Gas Code (ANSI Z223.1)"
    year: 2024
    url: https://www.nfpa.org/codes-and-standards/nfpa-54-standard-development/54
    supports: "Gas appliance installation, clearances, piping and venting"
    verified: false
  - id: s7
    publisher: U.S. Energy Information Administration
    title: "Short-Term Energy Outlook, electricity (May 2026 release)"
    year: 2026
    url: https://www.eia.gov/outlooks/steo/report/elec_coal_renew.php
    supports: "US average residential electricity price forecast 18.2 cents/kWh for 2026"
    verified: true
  - id: s8
    publisher: U.S. Energy Information Administration
    title: "Natural Gas Annual, Table 23, 2024"
    year: 2025
    url: https://www.eia.gov/naturalgas/Annual/pdf/table_023.pdf
    supports: "US residential natural gas $14.50/Mcf; commercial $10.07/Mcf (2024)"
    verified: true
  - id: s9
    publisher: U.S. Energy Information Administration
    title: "FAQ: converting natural gas prices per Mcf to per therm"
    year: 2026
    url: https://www.eia.gov/tools/faqs/faq.php?id=45&t=8
    supports: "1 Mcf ≈ 10.37 therms"
    verified: true
  - id: s10
    publisher: U.S. Energy Information Administration (Winter Fuels Outlook, Oct 2025), reported by LP Gas magazine
    title: "Lower propane prices drive winter outlook"
    year: 2025
    url: https://www.lpgasmagazine.com/?p=86492
    supports: "US residential propane forecast $2.46/gal, winter 2025–26"
    verified: true
---

# The outdoor heating planning guide

*Professional edition, for architects, designers and builders. Designed from the start, not added later.*

Specify outdoor heat as part of the architecture: confirm the space is outdoor (30%+ open), choose a radiant source by wavelength, size it from published coverage, fix mounting heights and clearances, carry the electrical load or gas supply into the drawings, and specify the controls as part of the system. Each step below gives the data in the form a drawing set or submittal needs.

Fewer than one in four homeowners prioritize heating at planning[^s1]. When it reaches the drawings late, it arrives as surface conduit, a mismatched ceiling and a substitution at bid. When it is in the set from schematic design, it is a line item, a circuit and a recess — and it stays.

![Minimal glass pavilion with ceiling-recessed heaters](img:l-010-075)

## Contents

1. The outdoor space and the heat cloud
2. Radiant physics by wavelength
3. Fuel selection
4. Coverage and mounting matrix
5. Codes, certification and clearances
6. Electrical load
7. Gas supply
8. Accessories
9. Controls and integration
10. Running cost
11. Submittal checklist

## 1. What qualifies as an outdoor space?

An area is outdoor for heating design when at least 30% of its horizontal perimeter is permanently open[^s3]. A partial overhead cover holds a heat cloud that adds a convective contribution; design for it, but size on radiant coverage[^s3].

| Configuration | Qualifies | Design note |
|---|---|---|
| Walls on all sides, one permanent ground-level opening, no roof | Yes, if opening ≥ 30% of perimeter | No heat cloud; size for full exposure |
| Overhead cover, two open sides | Yes | Heat cloud under cover |
| Overhead cover, three walls, ≥ 30% open | Yes | Strong heat cloud; watch clearances |
| Retractable glazing or screens closing below 30% | Check | Treat as enclosed; confirm with AHJ and Bromic |

[[DIAGRAM: Plan and section of the four configurations, perimeter opening shaded and dimensioned as a percentage.]]

Inputs that change the design: climate and season of use, exposure to wind and water, new or existing construction, ceiling build-up, available utilities, code and clearances[^s3].

## 2. How do short, medium and long wave heaters differ?

Outdoors, convected heat rises and disperses; forced air cannot hold an open space at temperature and outdoor heat cannot be thermostatically controlled[^s3]. Radiant energy heats the surfaces and people it falls on. The share of output delivered as radiant energy depends on wavelength.

| | Short wave | Medium wave | Long wave |
|---|---|---|---|
| Radiant / convective split | ≈ 90 / 10 | ≈ 60 / 40 | ≈ 40 / 60 |
| Warm-up | Instant | ≈ 30 s | ≈ 5 min |
| Wind sensitivity | Lowest; heats people and objects directly | Limited | Highest |
| Typical use | Exposed and windy sites, high mounting | Covered areas, moderate heights | Sheltered, low-exposure spaces |

Source: Bromic Planning Guide 2021[^s3]. [[VERIFY: element surface temperatures by wavelength (2021 guide: 572 °F / 1,652 °F / 3,992 °F) and the wavelength classification of each current Bromic model — Mike Clifford]]

**Direct and directional heat.** Directional heaters push most output one way, toward the occupied zone, rather than evenly in all directions. That puts energy where people sit and avoids overheating guests near the unit[^s3].

![Black Tungsten Select grille glowing, macro detail](img:l-007-034)

## 3. Electric or gas?

Select on three factors: the confinement and design of the space, availability of utilities, and cost of operation[^s3].

| Factor | Electric | Gas |
|---|---|---|
| Space | Covered and semi-covered; ceilings, soffits, walls, poles | Larger and more open areas; freestanding |
| Utility | Dedicated branch circuits; 208/240/277 V options for commercial sites[^s3] | Natural gas line or propane |
| Integration | Recessed, flush, pendant | Surface or freestanding; deflectors reduce top clearance |
| Controls | On/off, dimming, zones, schedules, app, BMS/home automation | On/off, wall switch [[VERIFY: gas control options in the Affinity range — Mike Clifford]] |
| Trade | Licensed electrician | Licensed gas fitter |

For electrification requirements by jurisdiction, see the Electrification compliance guide ([A12](asset:A12)).

![Urban roof terrace, timber soffit with recessed heater](img:t-006-016)

## 4. Coverage and mounting matrix

| Product | Status | Fuel / rating | Approx. coverage | Recessed | Ceiling | Wall | Pole / post | Freestanding |
|---|---|---|---|---|---|---|---|---|
| Platinum Smart-Heat Electric (Classic, Marine) | Current | 2300 / 3400 / 4500 W | 65–143 ft² | Yes | Yes | Yes | Suspension pole (accessory) | — |
| Eclipse Smart-Heat Electric | Current | [[VERIFY: wattage]] · 33/66/100% | 121 ft² | — | — | — | 8", 24", 48" single; double; curved | — |
| Eclipse Smart-Heat Freestanding Electric | Current | [[VERIFY: wattage, plug/supply]] · 33/66/100% | 121 ft² | — | — | — | — | Yes |
| Tungsten Smart-Heat Freestanding Gas | Current | 38,000 BTU · NG or propane | 215 ft² | — | — | — | — | Yes |
| Tungsten Smart-Heat Electric — Coastal (coming soon) | Coming soon | [[VERIFY: wattages]] · 316 stainless | 64–144 ft² | Low-clearance, marine-grade | Yes | Yes | Single-post | — |
| Tungsten Smart-Heat Electric — Select (coming soon) | Coming soon | [[VERIFY: wattages]] | 64–144 ft² | Low-clearance | Yes | Yes | Single-post | — |
| Platinum Gas | Current | [[VERIFY]] | [[VERIFY]] | — | [[VERIFY]] | [[VERIFY]] | Ceiling pole (accessory) | — |
| Tungsten Gas (built-in) | Current | Not published [[VERIFY: BTU — do not publish until confirmed — Mike Clifford]] | [[VERIFY]] | — | [[VERIFY]] | [[VERIFY]] | Ceiling pole (accessory) | — |

Coverage source: Bromic Lookbook 2026[^s2]. Coverage is approximate and varies with model, size, mounting height, environment and installation conditions[^s2]. [[VERIFY: coverage per wattage and per mounting height for Platinum and Tungsten electric; Cobalt Electric and Platinum Electric Marine facts — Mike Clifford]]

**Sizing rule.** Heaters = heated floor area ÷ coverage per heater, rounded up; add one for high exposure or cold climates[^s3]. Lay heat blooms over seating, not over circulation.

**Mounting heights (Bromic guidance)**

| Mount | Minimum above finished floor | Note |
|---|---|---|
| Wall | 72" (6 ft) | [^s3] |
| Ceiling | 96" (8 ft) | Minimum clearance to ceiling varies with output[^s3] |
| Recessed | [[VERIFY: per model and recess kit]] | Low-clearance recessing on Tungsten Coastal/Select (coming soon)[^s2] |
| Suspended | Set to effective height per manual | For high ceilings |

[[DIAGRAM: Section through a covered patio showing wall mount at 72" min., ceiling mount at 96" min., recessed unit with recess kit, suspension pole in a high ceiling, and heat-bloom cones over seating.]]

![White heater between pergola louvres](img:l-010-076)

## 5. Which codes apply?

| Scope | US standard | What it governs |
|---|---|---|
| Electric heaters | ANSI/NFPA 70 (National Electrical Code)[^s4] | Branch circuits, overcurrent protection, disconnects, wiring methods, installation per listing |
| Gas heaters | ANSI Z223.1/NFPA 54 (National Fuel Gas Code)[^s6] | Where heaters may be installed, supply and piping, air and ventilation, clearance to combustibles |
| Certification | Intertek, UL or CSA mark | Gas and electrical appliances, including portable heaters, must be certified and bear a mark[^s3] |

[[VERIFY: the certification mark and listing standard for each current model — Mike Clifford]]

**Clearances.** Clearances to combustibles, to the ceiling and to the sides are set by each model's installation manual and listing. Do not interpolate between models. [[VERIFY: clearance table per model from current installation manuals — Mike Clifford]]

*Code references are indicative only. The adopted code edition and local amendments govern. Confirm with the local building authority, and have heaters installed by a licensed electrician or gas fitter to the manufacturer's instructions.*

## 6. How much electrical load do the heaters draw?

Current: **I = W ÷ V**. Bromic heaters are hard-wired; fixed electric space-heating loads are treated as continuous, so branch-circuit conductors are sized at not less than 125% of the load (NEC 424 with 210.19(A)(1) and 210.20(A))[^s5][^s4]. Feeder and service load calculations follow Article 220. [[VERIFY: whether the AHJ classifies these heaters under Art. 424 or Art. 422, and breaker size per Bromic installation manual — Arvin Avaness + licensed electrician]]

| Heater | Amps at 208 V | × 1.25 | Amps at 240 V | × 1.25 | Amps at 277 V | × 1.25 |
|---|---|---|---|---|---|---|
| 2300 W | 11.1 | 13.8 | 9.6 | 12.0 | 8.3 | 10.4 |
| 3400 W | 16.3 | 20.4 | 14.2 | 17.7 | 12.3 | 15.3 |
| 4500 W | 21.6 | 27.0 | 18.8 | 23.4 | 16.2 | 20.3 |

Arithmetic on rated wattage only. A resistive heater rated at 240 V delivers less power on 208 V; use the rating and voltage of the model actually specified. [[VERIFY: which Platinum models are offered at 208, 240 and 277 V, and their rated wattage at each — Mike Clifford]]

**Worked example.** Two 4500 W heaters at 240 V on individual circuits: 18.8 A each, minimum conductor ampacity 23.4 A each. On one shared circuit: 37.5 A, ×1.25 = 46.9 A — and the control device must be rated for the combined load. [[VERIFY: maximum heaters per Affinity controller/channel and its rating — Mike Clifford]]

Detailed rough-in guidance (junction boxes, blocking, control runs) is in the Pre-wire guide ([A16](asset:A16)).

## 7. Gas supply

- Size piping for the total connected Btu/hr load, length and pressure to ANSI Z223.1/NFPA 54[^s6], by a licensed gas fitter.
- Built-in heaters need a fixed supply with an accessible shut-off. [[VERIFY: inlet size and supply pressure per gas model — Mike Clifford]]
- Freestanding Tungsten gas runs on natural gas or propane[^s2]. Confirm the fuel at order: the two are not interchangeable without the correct kit. [[VERIFY: conversion policy — Mike Clifford]]
- Do not publish a Tungsten built-in gas input in drawings until confirmed.

## 8. Accessories

| Accessory | Fuel | Purpose |
|---|---|---|
| Recess kit | Electric (Platinum, Tungsten) | Flush-mounts the heater into the ceiling cavity |
| Suspension pole | Electric (Platinum, Tungsten) | Drops the heater to an effective height in high ceilings |
| Heat deflector | Gas (Platinum, Tungsten) | Dual-layer stainless; reduces the clearance needed above the heater |
| Ceiling pole | Gas (Platinum, Tungsten) | Mounts two heaters back to back under flat or pitched ceilings |

Source: Bromic Planning Guide 2021[^s3]. [[VERIFY: accessory part numbers and compatibility with current and coming-soon models, including Tungsten Coastal/Select recessing — Mike Clifford]]

![Tungsten Coastal recessed flush into a white ceiling](img:l-005-022)

## 9. Controls and integration

Controls are a specified part of the system, not an option. Every heater schedule carries a controls line.

| Item | Function | Specify with |
|---|---|---|
| Affinity Smart-Heat On/Off | Switching | Electric heaters |
| Affinity Smart-Heat Dimmer | Variable output | Platinum, Tungsten electric |
| Affinity Eclipse controller | 33/66/100% heat and rim-light dimming | Eclipse |
| Manual wall switch | Local on/off | All |
| Bromic Smart-Heat app | Zones, schedules, timers | Compatible Affinity controls |
| Voice and home automation | Amazon Alexa, Google Assistant, Control4, Crestron, Lutron | Compatible Affinity controls |

Wi-Fi and app features require compatible Affinity Smart-Heat Controls, sold separately. Integration compatibility varies by system and may require additional hardware or configuration[^s2]. [[VERIFY: Affinity controller electrical ratings, enclosure rating, mounting location, Wi-Fi range and integration protocol per platform — Mike Clifford]]

**Coordinate in the drawings:** controller location (accessible, protected, within Wi-Fi range), wall-switch box at the threshold, a zone per seating area, and the integrator's scope.

![Eclipse with dimmable rim lighting glowing](img:l-013-106)

## 10. Running cost

Formulas: electric $/h = kW × $/kWh · natural gas $/h = Btu/h ÷ 100,000 × $/therm · propane $/h = Btu/h ÷ 91,500 × $/gal.

[[VERIFY: 2026 rates — Brian Kim/Finance]] Rates used: 18.2¢/kWh residential (EIA 2026 forecast)[^s7]; natural gas $14.50/Mcf residential, $10.07/Mcf commercial (2024)[^s8], ≈ $1.40 and $0.97 per therm at 10.37 therms/Mcf[^s9]; propane $2.46/gal (EIA winter 2025–26 forecast)[^s10].

| Heater | $/h residential |
|---|---|
| Platinum 2300 / 3400 / 4500 W | $0.42 / $0.62 / $0.82 |
| Tungsten Freestanding Gas, natural gas (38,000 Btu/h) | $0.53 |
| Tungsten Freestanding Gas, propane | $1.02 |

## 11. Submittal checklist

**Design intent**
- [ ] Space confirmed outdoor (≥ 30% perimeter permanently open); configuration noted
- [ ] Heated zones drawn over seating, area per zone in ft²
- [ ] Heater count per zone = area ÷ coverage, rounded up; exposure allowance noted

**Product schedule**
- [ ] Model, finish, wattage or Btu/h, voltage, quantity per tag
- [ ] Coming-soon models (Tungsten Coastal/Select) flagged with an approved alternate
- [ ] Certification mark per model (Intertek, UL or CSA)
- [ ] Accessories: recess kits, suspension poles, deflectors, ceiling poles

**Mounting and clearances**
- [ ] Wall ≥ 72" AFF; ceiling ≥ 96" AFF; per-model clearances from manual
- [ ] Recess openings and ceiling build-up coordinated [[VERIFY: recess kit dims]]
- [ ] Structure/blocking for every heater and pole

**Electrical**
- [ ] Load per heater at specified voltage; conductors ≥ 125% of load
- [ ] Circuit, breaker and disconnect per manual and NEC; panel capacity checked
- [ ] Junction-box locations dimensioned

**Gas**
- [ ] Total Btu/h, pipe sizing and pressure by licensed fitter to NFPA 54
- [ ] Shut-off locations; propane storage per local fire code

**Controls (required)**
- [ ] Affinity controller per zone; wall switch location
- [ ] App/Wi-Fi coverage at controller; integration platform and integrator named

**Compliance**
- [ ] Permits identified; AHJ consulted; electrification requirements checked ([A12](asset:A12))

*All code content is indicative. Confirm with the local building authority and a licensed electrician or gas fitter; the adopted edition of NFPA 70[^s4] and NFPA 54[^s6] and the manufacturer's instructions govern.*

Download the spec kit for CSI sections, details and coverage tables.
