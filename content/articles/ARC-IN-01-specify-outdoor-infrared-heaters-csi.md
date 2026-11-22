---
id: ARC-IN-01
type: article
title: "How to specify outdoor heaters: a CSI-ready guide to infrared heating"
slug: specify-outdoor-infrared-heaters-csi
audience: [ARC]
stage: [IN]
cell: ARC-IN
asset: A24
summary: "Where outdoor electric infrared heaters sit in MasterFormat, what each part of a 3-part spec should hold, coverage by product, and how to write the controls so your design intent carries through bid."
primary_keyword: specify outdoor heater
secondary_keywords: [patio heater specification, infrared heater CSI section]
ai_prompt: "How do I write a specification for outdoor infrared heaters?"
meta_description: "How to specify outdoor heater systems: the MasterFormat section, a 3-part spec checklist, coverage by product and controls language that holds through bid."
cta: {label: "Download the spec kit", asset: A11}
hero: l-005-022
images: [l-010-067]
owner_review: Specification and compliance
status: draft
gated: false
related: [ARC-BY-01, ARC-CO-01, ARC-IN-KB1, BLD-IN-01]
updated: 2026-11-16
sources:
  - id: s1
    publisher: The Blue Book Building & Construction Network (MasterFormat listing)
    title: "23 83 33 Electric Radiant Heaters"
    year: 2026
    url: https://thebluebook.com/iProView/315999
    supports: "23 83 33 Electric Radiant Heaters sits in the 23 83 radiant heating group beside 23 83 13 and 23 83 23"
    verified: true
  - id: s2
    publisher: Dodge Sweets (MasterFormat browse)
    title: "23 83 00 Radiant Heating Units"
    year: 2026
    url: https://sweets.construction.com/MasterFormat/Heating_Ventilating_and_Air_Conditioning_HVAC-23_00_00/Radiant_Heating_Units-23_83_00
    supports: "23 83 00 Radiant Heating Units with sub-sections incl. 23 83 26 Gas-Fired Radiant Heaters and 23 83 33 Electric Radiant Heaters; 23 82 39 is Unit Heaters"
    verified: true
  - id: s3
    publisher: Construction Specifications Institute
    title: "MasterFormat"
    year: 2020
    url: https://www.csiresources.org/standards/masterformat
    supports: "Authoritative MasterFormat numbers and titles"
    verified: false
  - id: s4
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Coverage, wattages, finishes, mounting per product; Affinity controls; integrations and compatibility caveat"
    verified: true
  - id: s5
    publisher: Bromic Heating
    title: "Outdoor Heating Planning Guide v1.2, Steps 06–08"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "NFPA 70; wall ≥72 in, ceiling ≥96 in; certification marks Intertek/UL/CSA; recess kits and suspension poles; commercial voltages 208/240/277V"
    verified: true
  - id: s6
    publisher: Washington State Building Code Council (WAC 51-11C-40392)
    title: "Washington State Energy Code, Commercial, C403.11.1 Heating outside a building"
    year: 2021
    url: https://lawfilesext.leg.wa.gov/law/WAC/WAC%20%2051%20%20TITLE/WAC%20%2051%20-%2011C%20CHAPTER/WAC%20%2051%20-%2011C-40392.htm
    supports: "Exterior heat must be radiant and controlled by occupancy sensor or timer switch"
    verified: true
  - id: s7
    publisher: EC&M (Electrical Construction & Maintenance)
    title: "Article 424: Fixed electric space heating (code basics)"
    year: 2020
    url: https://www.ecmweb.com/code-basics/article-424-fixed-electric-space-heating
    supports: "NEC 424 covers fixed electric space-heating equipment; branch-circuit conductors sized not smaller than 125% of load (424.4(B) in the 2020 NEC; 424.3(B) in earlier editions)"
    verified: true
---

Outdoor electric infrared heaters are specified in MasterFormat Section 23 83 33, Electric Radiant Heaters, under 23 83 00 Radiant Heating Units[^s1][^s2]. Write it as a 3-part section, with Part 1 setting references, submittals and warranty, Part 2 naming a basis-of-design product with its wattage, voltage, finish, mounting accessory and controls, and Part 3 fixing installation, clearances, electrical coordination and controls commissioning. When the controls and the recess detail are written as performance requirements, the heater you designed around is far more likely to be the one that is installed.

![Heater recessed flush into a clean white ceiling](img:l-005-022)

## Finding The Right MasterFormat Section

MasterFormat has no title for "patio heaters". The closest fit, and the one we recommend, is 23 83 33 Electric Radiant Heaters, because the product is a fixed electric radiant heater[^s1].

| Section | Title | Use for outdoor heaters? |
|---|---|---|
| 23 83 33 | Electric Radiant Heaters | Yes: fixed electric infrared heaters (recommended) |
| 23 83 26 | Gas-Fired Radiant Heaters | Built-in gas infrared heaters[^s2] |
| 23 82 39 | Unit Heaters | No: fan-forced convective units, which do not work outdoors |
| Division 26 | Electrical | Circuits, disconnects, raceway and wiring devices; not the heater |
| Division 12 / site furnishings | Freestanding units, if the office files portable equipment there | Office preference |

The section numbers and titles come from MasterFormat listings in the Blue Book and Dodge Sweets[^s1][^s2]; we could not open CSI's own text from here. [[VERIFY: confirm 23 83 33 / 23 83 26 numbers and titles against the current CSI MasterFormat edition — Specification and compliance]][^s3]

## Part 1, General

- **Summary and related sections.** Cross-reference Division 26 for branch circuits, disconnects and raceway, and the integration section if the heaters connect to a home automation or building control system.
- **References.** NFPA 70 (National Electrical Code) governs the electrical installation, and the product must carry a recognised certification mark (Intertek, UL or CSA)[^s5]. [[VERIFY: listing standard(s) each Bromic electric model is certified to — Product team]]
- **Submittals.** Product data, wiring diagrams, recess kit and mounting details, clearance data from the installation manual, the controls schematic and a coverage layout.
- **Quality assurance.** An installer qualified for the manufacturer's products, and a licensed electrician for connections.
- **Warranty.** State the manufacturer's standard warranty. [[VERIFY: warranty term per product — Product team]]

## Part 2, Products

Name a basis-of-design product and the attributes a substitute must match. Generic text such as "outdoor infrared heater, 3 kW" is the kind that tends to be value-engineered away.

- Manufacturer and model, wattage and supply voltage (Bromic lists commercial supply options of 208V, 240V and 277V)[^s5]. [[VERIFY: voltage per model and amperage at each voltage — Product team]]
- Finish and variant, for example Platinum Black or White, Classic or Marine[^s4].
- Mounting – recess kit, ceiling, wall or suspension pole – as an accessory with its own line[^s5].
- Controls, written as a required component: Affinity Smart-Heat® On/Off, Dimmer or Eclipse controller, a manual wall switch, and the Bromic Smart-Heat app for zones, schedules and timers. Wi-Fi and app features require compatible Affinity Smart-Heat Controls, sold separately[^s4].
- Integration, where needed. The heaters are compatible with Control4, Crestron and Lutron, though compatibility varies by system and may need additional integration hardware or configuration[^s4]. Name the integrator's responsibility in the spec.

## How Much Each Heater Covers

| Product | Output | Coverage (approx.) | Mounting | Status |
|---|---|---|---|---|
| Platinum Smart-Heat Electric | 2300W, 3400W, 4500W | 65–143 ft² | Recessed, ceiling, wall | Current |
| Tungsten Smart-Heat Electric, Select | [[VERIFY: wattages — Product team]] | 64–144 ft² | Low-clearance recessed, ceiling, wall, single post | Current (launched October 2026) |
| Tungsten Smart-Heat Electric, Coastal (316 stainless) | [[VERIFY: wattages — Product team]] | 64–144 ft² | Marine-grade low-clearance recessed, ceiling, wall, single post | Current (launched October 2026) |
| Eclipse Smart-Heat Electric | 33 / 66 / 100% output | 121 ft² | Single pole 8, 24 or 48 in, double or curved pole | Current |
| Eclipse Smart-Heat Freestanding Electric | 33 / 66 / 100% output | 121 ft² | Freestanding, wheeled, weighted base | Current |

Source: Lookbook 2026[^s4]. Coverage varies by model, mounting height, environment and installation conditions, so use these figures for planning and then confirm them with a Bromic layout.

![Covered outdoor kitchen warmed by flush ceiling heaters](img:l-010-067)

## Part 3, Execution

- **Examination.** Verify ceiling or soffit framing, recess cavity depth and blocking before rough-in. [[VERIFY: recess kit cut-out and cavity dimensions per model — Product team]]
- **Installation.** Follow the manufacturer's installation manual. Bromic's guidance sets minimum mounting heights of at least 72 in above floor for wall mounts and at least 96 in for ceiling mounts, varying with output[^s5]. Take clearances to combustibles from the manual itself rather than from an estimate in the spec.
- **Electrical connections.** By Division 26, on circuits sized for the heater load. NEC fixed electric space-heating rules size branch-circuit conductors at not less than 125% of the load[^s7]; confirm the article and edition in force with the electrical engineer.
- **Controls.** Mount controllers in a location protected as the manual requires, program zones and schedules, and provide automatic shut-off where the energy code applies. Washington's commercial code, for example, requires exterior heat to be radiant and controlled by occupancy sensor or timer[^s6].
- **Field quality control and demonstration.** Test each zone, then walk the owner through the app, the wall switch and the schedules.

## Keeping Your Design Intent Through Bid

Write performance into the clauses a substitute is least likely to meet: recessed low-clearance installation, the finish, the step or dimming control, app scheduling and the integration requirement. Ask that substitution requests include a coverage layout for the same plan at the same mounting height. Detailing the recess kit on the reflected ceiling plan means the opening itself is drawn to the specified product.

## Your Specification Checklist

- [ ] Section 23 83 33 (electric) or 23 83 26 (gas), cross-referenced to Division 26
- [ ] Basis-of-design model, wattage, voltage, finish, variant
- [ ] Mounting accessory (recess kit, pole) as its own line
- [ ] Affinity controls and wall switch specified; app and integration responsibilities assigned
- [ ] Coverage layout attached; mounting heights shown in section
- [ ] Clearances referenced to the installation manual
- [ ] Energy-code controls (timer or occupancy) where required

*Code references are for orientation. Confirm requirements with the local authority having jurisdiction and a licensed electrician or gas fitter.*

## FAQ

### What CSI section is an outdoor infrared heater?
We recommend 23 83 33 Electric Radiant Heaters for fixed electric units and 23 83 26 for gas-fired radiant heaters[^s1][^s2]. Confirm against your office's MasterFormat edition.

### Is 23 82 39 Unit Heaters a good fit?
It is not. Unit heaters are fan-forced convective equipment, and outdoors the warm air they produce rises and blows away, whereas the product you are specifying is radiant.

### Should controls be specified in the heater section?
Yes. Specify the Affinity controller, wall switch and app with the heater, and coordinate the wiring in Division 26. Controls left to "by others" are the most common gap at handover.

### Can outdoor heaters connect to Crestron, Control4 or Lutron?
Yes, through Affinity Smart-Heat Controls. Compatibility varies and may need extra integration hardware or configuration[^s4], so assign the integration to a named trade.

### Where do I get a 3-part spec and details?
The Bromic Architect Spec Kit carries the 3-part spec, coverage tables and detail list. [[VERIFY: BIM/CAD object availability and format (asset A13) — Specification and compliance]]

Download the spec kit for the editable 3-part section and coverage tables.
