---
id: BLD-IN-01
type: article
title: "Pre-wiring a patio for outdoor heaters: rough-in checklist for builders"
slug: pre-wire-patio-outdoor-heaters
audience: [BLD]
stage: [IN]
cell: BLD-IN
asset: A24
summary: "What to rough in before the soffit closes: a dedicated circuit per heater, the amperage maths at 240 V and 208 V, the 125% sizing rule, GFCI questions for the inspector, boxes and blocking, and a pathway for controls."
primary_keyword: pre wire patio heater
secondary_keywords: [patio heater wiring, outdoor heater rough in]
ai_prompt: "What wiring should I rough in for patio heaters?"
meta_description: "Rough in a dedicated circuit per patio heater, boxes and blocking at each position, and a control location. Amp maths at 240 V and 208 V inside."
cta: {label: "Download the pre-wire guide", asset: A16}
hero: g-rough-in
images: [l-005-022]
owner_review: Arvin Avaness
status: draft
gated: false
related: [BLD-IN-KB1, BLD-IN-KB2, BLD-BY-01, BLD-CO-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Platinum Smart-Heat Electric 2300/3400/4500 W; recessed, ceiling or wall mount; Affinity Smart-Heat Controls; Wi-Fi/app need compatible Affinity controls, sold separately"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "The Official Outdoor Heating Planning Guide, US v1.2"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "Electric heaters follow ANSI/NFPA 70; wall mounts at least 72 in. above floor, ceiling mounts at least 96 in. (varies with output); recess kits for flush mounting; commercial voltages 208/240/277 V; check with local building authority"
    verified: true
  - id: s3
    publisher: EC&M
    title: "Don't get burned by the NEC's space-heating equipment rules"
    year: 2020
    url: https://www.ecmweb.com/national-electrical-code/code-basics/article/20901105/dont-get-burned-by-the-necs-space-heating-equipment-rules
    supports: "Branch-circuit conductors and overcurrent devices for fixed electric space-heating equipment sized at not less than 125% of the total heating load (NEC Article 424 with 210.19(A)(1) and 210.20(A))"
    verified: true
  - id: s4
    publisher: EC&M
    title: "Understanding requirements for appliances (NEC Article 422)"
    year: 2020
    url: https://www.ecmweb.com/code-basics/understanding-requirements-appliances
    supports: "Branch circuit for a continuous-load appliance rated not less than 125% of marked ampere rating (100% where the assembly is listed for it); OCPD not to exceed the rating marked on the appliance (422.11(A)); continuous load = maximum current expected for 3 hours or more"
    verified: true
  - id: s5
    publisher: Eaton
    title: "NEC 2023 updates: GFCI 210.8(F) outdoor outlets"
    year: 2023
    url: https://www.eaton.com/us/en-us/markets/residential/nec-2023-updates/gfci-210-8f-outdoor-outlets.html
    supports: "2023 NEC 210.8(F): GFCI for dwelling outdoor outlets, single-phase, 150 V or less to ground, 50 A or less"
    verified: true
  - id: s6
    publisher: Minnesota Department of Labor and Industry
    title: "2026 NEC change summary"
    year: 2026
    url: https://dli.mn.gov/sites/default/files/pdf/boe-011526-change-summary.pdf
    supports: "2026 NEC raises the 210.8(F) outdoor-outlet threshold from 50 A to 60 A"
    verified: true
  - id: s7
    publisher: UL Solutions
    title: "Coordination between model codes and standards (2026 NEC)"
    year: 2025
    url: https://www.ul.com/thecodeauthority/knowledge/coordination-between-model-codes-standards09
    supports: "2026 NFPA 70 issued Aug. 20, 2025, effective Sept. 9, 2025; adoption varies by jurisdiction"
    verified: true
  - id: s8
    publisher: National Fire Protection Association
    title: "NFPA 70, National Electrical Code (free online access)"
    year: 2025
    url: https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70
    supports: "Primary code text: Articles 100, 210, 240, 422, 424"
    verified: false
---

Rough in one dedicated circuit to every heater position, sized from the heater's nameplate with the 125% continuous-load rule, plus a box and solid blocking at each position and a box at the controller location. Do it before drywall, soffit or ceiling boards go on. That is the whole job: a circuit, a box, blocking and a control point, decided once, so nobody opens a finished ceiling later.

*This is planning guidance, not code advice. Codes vary by jurisdiction and edition. Confirm every requirement with the local building authority and a licensed electrician, and follow the product installation manual.*

![Minimal glass pavilion with ceiling-recessed heaters](img:l-010-075)

## Why pre-wire at rough-in?

Because heat decided after framing becomes a retrofit. Running a 240 V circuit through a finished soffit means cutting, patching and repainting, and the callback lands on the builder. At rough-in it is one more home run on the panel schedule.

Pre-wire every covered patio that could sell heat, even if the buyer has not chosen it. Cap and label unused positions.

## What voltage and circuit does each heater need?

Platinum Smart-Heat Electric comes in 2300, 3400 and 4500 W[^s1]. Bromic lists 208, 240 and 277 V supply options for commercial sites[^s2]. Confirm the voltage of the exact model on order before you pull wire [[VERIFY: supply voltage per Platinum and Tungsten Electric model, residential and commercial — Mike Clifford]].

Current is watts divided by volts: **I = W ÷ V**. Treat an outdoor heater as a continuous load, which the NEC defines as one where maximum current is expected to run three hours or more[^s4]. Branch circuits for continuous loads, and for fixed space-heating equipment, are sized at no less than 125% of the load[^s3][^s4].

| Heater | Volts | Current (W ÷ V) | × 125% | Next standard breaker | Typical copper conductor |
|---|---|---|---|---|---|
| 2300 W | 240 V | 9.6 A | 12.0 A | 15 A | 14 AWG |
| 3400 W | 240 V | 14.2 A | 17.7 A | 20 A | 12 AWG |
| 4500 W | 240 V | 18.8 A | 23.4 A | 25 A (30 A common) | 10 AWG |
| 2300 W | 208 V | 11.1 A | 13.8 A | 15 A | 14 AWG |
| 3400 W | 208 V | 16.3 A | 20.4 A | 25 A | 10 AWG |
| 4500 W | 208 V | 21.6 A | 27.0 A | 30 A | 10 AWG |

The 208 V rows assume a heater rated at its wattage on 208 V. Two cautions from the same maths:

- **A 240 V heater on a 208 V supply** (common in multifamily) runs at (208 ÷ 240)², about 75% of its rated output. A 4500 W heater delivers roughly 3,380 W. Order the voltage-matched model.
- **120 V** does not suit these wattages. Even 2300 W draws 19.2 A at 120 V, or 24 A once the 125% rule applies.

The breaker must also not exceed the maximum marked on the heater's nameplate[^s4]. Conductor sizes above are typical for short runs; the electrician confirms ampacity, terminal ratings, voltage drop and conduit fill. The NEC text is free to read online from NFPA[^s8].

## Can heaters share a circuit?

They can, within limits, but one heater per circuit is simpler to zone and to fault-find. See [how many heaters per circuit](item:BLD-IN-KB2).

## Do patio heater circuits need GFCI protection?

Plan for it and ask the inspector early. The 2023 NEC requires GFCI protection for dwelling outdoor outlets on single-phase circuits of 150 V or less to ground and 50 A or less[^s5]; the 2026 edition raises that threshold to 60 A[^s6]. A residential 240 V circuit is 120 V to ground, so it falls inside that scope. Whether a hard-wired heater counts as an "outlet" under 210.8(F) is read differently by different authorities, and editions are adopted at different times[^s7]. Get the local answer in writing and check what the installation manual specifies [[VERIFY: Bromic installation-manual requirement for GFCI or RCD protection — Mike Clifford]]. More in [the GFCI answer](item:BLD-BY-KB1).

## What goes at each heater position?

| Item | Rough-in action |
|---|---|
| Box | Weather-rated junction box at each heater position, per the manual's location relative to the bracket [[VERIFY: box type and offset per mount — Mike Clifford]] |
| Blocking | Solid blocking between joists or studs to carry the bracket and heater weight [[VERIFY: heater weights per model — Mike Clifford]] |
| Height | Wall mounts at least 72 in. above the floor; ceiling mounts at least 96 in., varying with output[^s2] |
| Clearances | Mark clearances to walls, beams and combustibles from the manual [[VERIFY: clearance table per model — Mike Clifford]] |
| Recess kit | Frame the opening and cavity depth for the recess kit before boarding [[VERIFY: recess kit rough opening and cavity depth per model — Mike Clifford]] |

![Heater recessed flush into a white ceiling (Tungsten Coastal, coming soon)](img:l-005-022)

Recess kits let Platinum and Tungsten Electric heaters sit flush in the ceiling cavity[^s2]. The kit has to be decided at framing, not at trim.

## Where do the controls go?

Put the controller where the family stands when they want heat: usually inside, by the patio door. Every heater needs a control: an Affinity Smart-Heat On/Off or Dimmer controller (Eclipse controller for Eclipse heaters) and a manual wall switch[^s1].

At rough-in:

- Set a deep box at the controller location, sized for the Affinity controller [[VERIFY: Affinity controller box size and whether it is inline with the line-voltage circuit — Mike Clifford]].
- Run each heater circuit through that location, or as the manual's wiring diagram shows.
- Leave a pathway, such as an empty conduit with a pull string, to the AV or automation location if smart-home control may sell.

App, schedules and voice control need compatible Affinity Smart-Heat Controls, sold separately. Control4, Crestron and Lutron integration may need extra hardware or configuration[^s1].

## What should be documented?

Photograph every position before it is covered: box, blocking, cable label and a tape showing height. File the photos with the panel schedule, so the installer finds the box first time.

## Planning checklist

- Heater model, wattage and voltage confirmed before rough-in.
- One dedicated circuit per heater; breaker and wire sized at 125% and within the nameplate maximum.
- GFCI approach agreed with the authority having jurisdiction.
- Box and blocking at each position; heights at or above 72 in. (wall) and 96 in. (ceiling).
- Recess-kit openings framed where flush heaters may sell.
- Controller box by the door; pathway to the automation location.
- Unused positions capped and labelled.
- Photos of every position, with measurements, in the job file.

## FAQ

### What wiring do patio heaters need?
A dedicated branch circuit per heater at the heater's rated voltage, sized at 125% of its current, terminating in a box at the heater position, with a control point on the circuit. Confirm with a licensed electrician.

### What size circuit does a 4500 W heater need at 240 V?
It draws 18.75 A; at 125% that is 23.4 A, so the next standard breaker is 25 A, and many electricians use 30 A on 10 AWG copper, within the nameplate maximum. See [breaker size for a 4500 W heater](item:BLD-IN-KB1).

### Can I run a patio heater on 120 V?
Not at these wattages. A 2300 W heater would draw 19.2 A at 120 V.

### Should I pre-wire if the buyer has not chosen heat?
Yes. A capped, labelled circuit costs little at rough-in and avoids opening a finished soffit later.

### Do I need GFCI protection?
Possibly, depending on the code edition adopted and how the inspector reads 210.8(F). Ask before rough-in.

Before the next slab is framed, download the pre-wire guide.

[^s1]: Bromic, Lookbook 2026.
[^s2]: Bromic, Outdoor Heating Planning Guide US v1.2, 2021.
[^s3]: EC&M, NEC space-heating equipment rules.
[^s4]: EC&M, NEC appliance requirements (Article 422; Article 100 definition of continuous load).
[^s5]: Eaton, 2023 NEC 210.8(F) outdoor outlets.
[^s6]: Minnesota DLI, 2026 NEC change summary.
[^s7]: UL Solutions, 2026 NEC publication and adoption.
[^s8]: NFPA, NFPA 70 National Electrical Code.
