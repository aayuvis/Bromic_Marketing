---
id: A16
type: gated-guide
title: "Pre-wire for outdoor heat: the builder's rough-in guide"
slug: pre-wire-patio-heaters-rough-in-guide
audience: [BLD]
stage: [IN]
cell: BLD-IN
asset: A16
summary: "What to decide before framing and what to rough in for every Bromic heater type: circuits and amps, junction boxes and blocking, recess openings, control runs and gas stub-outs, with a printable checklist and an electrician hand-off sheet."
primary_keyword: pre wire patio heater
secondary_keywords: [patio heater wiring, outdoor heater rough in, outdoor heater electrical requirements, patio heater circuit]
ai_prompt: "What wiring should I rough in for patio heaters?"
meta_description: "Rough-in guide for patio heaters: circuits and amps, 125% sizing, junction boxes, blocking, recess framing, control runs and gas stub-outs."
cta: {label: "Book a design consult", asset: A07}
hero: g-rough-in
images: [l-010-076, l-005-022, l-010-074, t-012-034]
owner_review: Arvin Avaness
status: draft
gated: true
related: [BLD-IN-01, BLD-CO-01, ARC-IN-01]
updated: 2026-10-29
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
    supports: "Current range, wattages, mounting, coverage, Affinity Smart-Heat Controls"
    verified: true
  - id: s3
    publisher: Bromic Heating
    title: "The Official Outdoor Heating Planning Guide, US v1.2"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "Mounting heights, code references, recess kits, suspension poles, 208/240/277 V options"
    verified: true
  - id: s4
    publisher: National Fire Protection Association
    title: "NFPA 70, National Electrical Code"
    year: 2023
    url: https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70
    supports: "Primary source for Article 424, 210.19(A)(1), 210.20(A), Article 220"
    verified: false
  - id: s5
    publisher: EC&M
    title: "Article 424: Fixed Electric Space Heating"
    year: 2021
    url: https://www.ecmweb.com/national-electrical-code/code-basics/article/20888653/article-424-fixed-electric-space-heating
    supports: "Branch-circuit conductors and overcurrent devices for fixed electric space-heating loads not less than 125% of the load, referencing 210.19(A)(1) and 210.20(A)"
    verified: true
  - id: s6
    publisher: National Fire Protection Association
    title: "NFPA 54, National Fuel Gas Code (ANSI Z223.1)"
    year: 2024
    url: https://www.nfpa.org/codes-and-standards/nfpa-54-standard-development/54
    supports: "Gas piping sizing, shut-offs, appliance installation"
    verified: false
---

# Pre-wire for outdoor heat

*The builder's rough-in guide. Designed from the start, not added later.*

Rough in a dedicated branch circuit for each electric heater (or heater group, per the controller), sized from I = W ÷ V with conductors at 125% of the load; a junction box and solid blocking at every heater, pole or recess location; a home run from each heater to the controller location; a box at the wall switch; and, for built-in gas, a stubbed and capped line with an accessible shut-off. Decide all of it before framing, while the ceiling is open.

![Covered outdoor kitchen and bar with flush ceiling heaters](img:l-010-067)

## Why decide before framing?

Fewer than one in four homeowners prioritize heating at planning[^s1]. The rest ask for it after drywall, soffits and stone are done. That means opening a finished ceiling, surface conduit, a heater placed where the wire reaches rather than where the table sits, and a callback.

| Decided at | What it costs |
|---|---|
| Design / pre-framing | A line on the electrical plan; blocking and boxes at rough-in |
| After framing, before close-in | A change order; extra trip for the electrician |
| After finish | Opened ceilings or walls, patching, repainting, surface conduit, often no recess option |

**Sell it at the options stage.** A pre-wire package (circuits, boxes, blocking, switch box) can be offered even when the heaters are bought later. See the builder programme and Good–Better–Best guide ([A15](asset:A15)).

## The decision timeline

| Stage | Decide | Who |
|---|---|---|
| Plans | Heated zones, heater type and count, mount type, fuel | Builder, designer, Bromic design service |
| Pre-framing | Recess openings, blocking, ceiling build-up | Framer, builder |
| Electrical rough-in | Circuits, boxes, control runs, switch location, panel capacity | Licensed electrician |
| Gas rough-in | Line size, stub-out, shut-off | Licensed gas fitter |
| Rough inspection | Inspect before close-in | AHJ |
| Trim-out | Heaters, recess kits, controllers, commissioning | Electrician, gas fitter |

## What to rough in, by product

| Product | Fuel / rating | Rough-in | Mount provisions |
|---|---|---|---|
| Platinum Smart-Heat Electric | 2300 / 3400 / 4500 W | Dedicated circuit(s) to controller; heater junction box | Recessed (recess kit), ceiling or wall; blocking |
| Eclipse Smart-Heat Electric | [[VERIFY: wattage and supply]] | Circuit to controller; ceiling box at pole | Single pole 8", 24" or 48"; double or curved pole; blocking for pole |
| Eclipse Smart-Heat Freestanding Electric | [[VERIFY: plug or hard-wire; receptacle rating]] | [[VERIFY: outdoor receptacle requirements]] | None; level surface |
| Tungsten Smart-Heat Electric — Coastal / Select (coming soon) | [[VERIFY: wattages]] | As Platinum, pending install manual | Low-clearance recessing, ceiling, wall, single-post |
| Tungsten Gas (built-in), Platinum Gas | [[VERIFY: Btu/h — do not publish Tungsten built-in figure until confirmed]] | Gas stub-out and shut-off; [[VERIFY: any electrical supply for ignition/controls]] | Ceiling, wall; ceiling poles, heat deflectors |
| Tungsten Smart-Heat Freestanding Gas | 38,000 Btu/h; natural gas or propane | Propane: none. Natural gas: [[VERIFY: quick-connect outlet requirement]] | None |

Product facts: Bromic Lookbook 2026[^s2] and Planning Guide 2021[^s3]. Always build to the current installation manual for the model.

## How many amps? The maths

**Step 1. Current per heater.** I = W ÷ V.

**Step 2. Continuous load.** Fixed electric space-heating equipment is treated as a continuous load. NEC Article 424 requires branch-circuit conductors for it to be sized at not less than 125% of the load, consistent with the continuous-load rules in 210.19(A)(1) and 210.20(A)[^s5][^s4]. Feeder and service calculations follow Article 220.

**Step 3. Circuit and breaker.** The electrician selects conductor and overcurrent device from the result, the installation manual and the adopted NEC.

| Heater | Amps at 208 V | × 1.25 | Amps at 240 V | × 1.25 |
|---|---|---|---|---|
| 2300 W | 11.1 | 13.8 | 9.6 | 12.0 |
| 3400 W | 16.3 | 20.4 | 14.2 | 17.7 |
| 4500 W | 21.6 | 27.0 | 18.8 | 23.4 |

Rated wattage divided by voltage. A heater rated at 240 V draws less on 208 V; use the rating of the model specified. Commercial sites may also be offered 277 V[^s3].

**Worked example: three 3400 W heaters on 240 V.**
- Per heater: 3400 ÷ 240 = 14.2 A; × 1.25 = 17.7 A.
- All three on one controller output: 42.5 A; × 1.25 = 53.1 A minimum conductor ampacity — too much for one typical circuit, so split them.
- Panel: add 10.2 kW to the load calculation.

[[VERIFY: (1) whether Bromic electric heaters are classified under NEC Art. 424 or Art. 422 by most AHJs; (2) the breaker size and maximum heaters per circuit stated in each installation manual; (3) the Affinity controller's maximum load per channel and whether it sits between breaker and heaters — Arvin Avaness + licensed electrician]]

[[DIAGRAM: Single-line diagram: panel → dedicated breakers → Affinity controller (one channel per zone) → junction boxes at heaters; wall switch and Wi-Fi shown; conductor sizes left blank for the electrician.]]

## Where do the boxes and blocking go?

| Item | Position | Note |
|---|---|---|
| Heater junction box | At each heater location, per manual | [[VERIFY: box type, offset from heater centreline, whether integral to recess kit — Mike Clifford]] |
| Wall-mount height | Heater ≥ 72" above finished floor | Bromic guidance[^s3] |
| Ceiling-mount height | Heater ≥ 96" above finished floor | Clearance to ceiling varies with output[^s3] |
| Blocking | Solid blocking between joists at every heater, pole and bracket | Sized for heater and pole weight [[VERIFY: weights per model]] |
| Suspension poles | Blocking and box at pole top | For high ceilings[^s3] |
| Clearances | To combustibles, ceiling and sides, per manual | Do not interpolate between models |
| Aim | Over seating, not the floor centre | Coordinate with furniture plan |

![White heater between pergola louvres](img:l-010-076)

## How do I frame for a recess kit?

Recess kits flush-mount Platinum and Tungsten electric heaters into the ceiling cavity[^s3]. They need to be in the framing plan.

| Dimension | Value |
|---|---|
| Rough opening (L × W) | [[VERIFY dims: per model and size — Mike Clifford]] |
| Minimum cavity depth | [[VERIFY dims: per model — Mike Clifford]] |
| Clearance above kit to combustibles | [[VERIFY dims: per installation manual — Mike Clifford]] |
| Low-clearance recessing (Tungsten Coastal / Select, coming soon) | [[VERIFY dims — Mike Clifford]] |
| Ceiling finish thickness allowed | [[VERIFY dims — Mike Clifford]] |

- Run joists or add headers to frame the opening square and level.
- Keep insulation, vapour barriers and other services clear of the kit per the manual.
- Mark openings on the framing plan and on the ceiling before close-in.

[[DIAGRAM: Reflected ceiling plan and section of a recess-kit opening between joists: header, blocking, junction box, cavity depth and clearance dimensions shown as callouts awaiting verified values.]]

![Tungsten Coastal recessed flush into a white ceiling](img:l-005-022)

## Controls: what to run to the switch and controller

Controls are part of the system. Rough them in with the heater circuits.

| Run | From → to | Note |
|---|---|---|
| Line voltage | Panel → Affinity controller → heaters | One controller channel per zone [[VERIFY: controller wiring topology — Mike Clifford]] |
| Wall switch | Controller → switch box at the threshold | [[VERIFY: line-voltage or low-voltage switch leg; box size — Mike Clifford]] |
| Controller location | Accessible, protected, within Wi-Fi range | [[VERIFY: indoor/outdoor rating and mounting — Mike Clifford]] |
| Integration | Controller → home-automation panel | Control4, Crestron or Lutron; compatibility varies and may need extra hardware[^s2] |
| Spare conduit | Heater zone → controller location | Allows later zones or integration without opening finishes |

Specify the matching control for every heater: an Affinity Smart-Heat On/Off or Dimmer controller (Platinum, Tungsten electric) or Eclipse controller (Eclipse), plus a wall switch. Wi-Fi and Bromic Smart-Heat app features require compatible Affinity Smart-Heat Controls, sold separately[^s2]. Check Wi-Fi signal at the controller location before close-in.

## Gas stub-outs for gas models

- **Licensed gas fitter only.** Size, route and test the line to ANSI Z223.1/NFPA 54[^s6] and the local code.
- **Size for the connected load.** Total Btu/h of all appliances on the line, run length and supply pressure. [[VERIFY: Btu/h input, inlet size and pressure for Platinum Gas and Tungsten Gas built-in — Mike Clifford]]
- **Stub out and cap** at each heater location; provide an accessible shut-off.
- **Mount provisions:** heat deflectors reduce the clearance needed above gas heaters; ceiling poles mount two heaters back to back[^s3]. Allow for both in the framing.
- **Fuel at order:** natural gas or propane, confirmed before the heater is ordered.

## What will the inspector check?

- [ ] Permits pulled for electrical and gas work
- [ ] Circuits match the approved plan and load calculation
- [ ] Boxes accessible, supported and at the planned positions
- [ ] Blocking in place for every heater and pole
- [ ] Recess openings framed to the manual
- [ ] Gas line pressure-tested and capped; shut-offs accessible
- [ ] Installation manuals on site for the inspector
- [ ] Final: heaters listed and marked (Intertek, UL or CSA)[^s3]; clearances met; controls working

*This guide is general guidance, not an engineering or code determination. Confirm requirements with the local building authority. Electrical work by a licensed electrician to the adopted NFPA 70[^s4]; gas work by a licensed gas fitter to ANSI Z223.1/NFPA 54[^s6]; both to the manufacturer's installation instructions.*

![Black heater on a timber cabana wall at dusk](img:l-010-074)

## Printable rough-in checklist

**Before framing**
- [ ] Heated zones and seating drawn
- [ ] Heater model, count, fuel and mount type chosen per zone
- [ ] Recess kits and poles identified
- [ ] Framing plan shows openings and blocking

**Electrical rough-in**
- [ ] Load per heater calculated (I = W ÷ V) at the supply voltage
- [ ] Conductors ≥ 125% of load; breakers per manual and NEC
- [ ] Panel capacity checked; load added to Art. 220 calculation
- [ ] Junction box at every heater; heights ≥ 72" wall, ≥ 96" ceiling
- [ ] Home runs to the Affinity controller location
- [ ] Wall-switch box at the threshold
- [ ] Spare conduit to controller location
- [ ] Wi-Fi coverage confirmed at controller

**Gas rough-in (gas models)**
- [ ] Line sized for total Btu/h by licensed fitter
- [ ] Stub-outs capped at each location; shut-offs accessible
- [ ] Pressure test passed

**Before close-in**
- [ ] Rough inspection passed
- [ ] Photos of every box and opening, with dimensions, filed with the job

## Electrician hand-off sheet

| Job | |
|---|---|
| Address / lot | |
| Builder contact | |
| Supply voltage | 208 V / 240 V / 277 V |
| Panel location and spare capacity | |

| Tag | Zone | Model | Watts | Volts | Amps (W ÷ V) | ×1.25 | Circuit / breaker | Mount | Height AFF |
|---|---|---|---|---|---|---|---|---|---|
| H1 | | | | | | | | | |
| H2 | | | | | | | | | |
| H3 | | | | | | | | | |
| H4 | | | | | | | | | |

| Controls | |
|---|---|
| Affinity controller(s) and channels | |
| Controller location | |
| Wall-switch location | |
| Integration platform (Control4 / Crestron / Lutron / none) | |
| Wi-Fi confirmed at controller | Y / N |

| Notes | |
|---|---|
| Recess openings (size, location) | |
| Blocking | |
| Gas stub-outs (if any) | |
| Installation manuals attached | Y / N |

![Large pergola patio with outdoor kitchen and dining](img:t-012-034)

Book a design consult and get the layout, heater schedule and controls bundle before framing.
