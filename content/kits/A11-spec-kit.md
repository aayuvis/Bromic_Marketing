---
id: A11
type: spec-kit
title: "Architect Spec Kit: outdoor electric radiant heaters (Section 23 83 33)"
slug: spec-kit
audience: [ARC]
stage: [IN]
cell: ARC-IN
asset: A11
summary: "A CSI three-part guide specification for Bromic Smart-Heat electric radiant heaters and Affinity controls, with a coverage and selection table, detail list and CAD/BIM index."
primary_keyword: specify outdoor heater
secondary_keywords: [patio heater specification, infrared heater CSI section, outdoor radiant heater spec]
ai_prompt: "How do I write a specification for outdoor infrared heaters?"
meta_description: "CSI three-part guide spec for outdoor electric radiant heaters, Section 23 83 33: products, controls, clearances, coverage table and detail list."
cta: {label: "Book a design consult", asset: A07}
hero: l-010-075
images: [t-006-016, l-005-022]
owner_review: "Shaughn Ritchie + Mike Clifford"
status: draft
gated: true
related: [ARC-IN-01, ARC-CO-01, ARC-PP-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Product series, wattages, finishes, coverage, mounting, Affinity controls and integrations, design service"
    verified: true
  - id: s2
    publisher: Bromic
    title: "The Official Outdoor Heating Planning Guide v1.2 (US)"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "30% open perimeter definition; ANSI/NFPA 70; 72 in wall / 96 in ceiling guidance; Intertek/UL/CSA marks; recess kits and suspension poles; 208/240/277 V commercial supply"
    verified: true
  - id: s3
    publisher: Sweets (Dodge Construction Network)
    title: "MasterFormat 23 83 00 - Radiant Heating Units"
    year: 2026
    url: https://sweets.construction.com/MasterFormat/Heating_Ventilating_and_Air_Conditioning_HVAC_-23_00_00/Radiant_Heating_Units-23_83_00
    supports: "23 83 00 is the MasterFormat level-2 section for radiant heating units under Division 23 HVAC"
    verified: true
  - id: s4
    publisher: The Blue Book Building & Construction Network
    title: "Manufacturer listing showing MasterFormat 23 83 13 / 23 83 23 / 23 83 33"
    year: 2026
    url: https://thebluebook.com/iProView/893075/climatemaster-inc/manufacturers
    supports: "23 83 33 is titled Electric Radiant Heaters (siblings: 23 83 13 cables and mats, 23 83 23 panels)"
    verified: true
  - id: s5
    publisher: Third-party manufacturer guide specification (published PDF)
    title: "3 Part Spec - Electric Radiant Heaters"
    year: 2025
    url: https://cdn.shopify.com/s/files/1/0813/8725/8148/files/3-Part-Spec-Electric-Radiant-Heaters-Eclipse.pdf
    supports: "Industry precedent: outdoor electric radiant heaters specified under Section 23 83 33, citing UL 2021 and NFPA 70"
    verified: true
  - id: s6
    publisher: New York State Office of General Services
    title: "MasterSpec Section 23 55 23.16 - High-Intensity, Gas-Fired, Radiant Heaters"
    year: 2024
    url: https://online2.ogs.ny.gov/dnc/masterspec24/docs/Division23HeatingVentilatingAndAirConditioning/235523.16HighIntensityGasFiredRadiantHeaters.docx
    supports: "Gas-fired radiant heaters sit in 23 55 23, not 23 83"
    verified: true
  - id: s7
    publisher: University of Saskatchewan
    title: "Master specification 23 82 39 Unit Heaters"
    year: 2024
    url: https://suppliers.usask.ca/documents/master-specifications/23-82-39-unit-heaters.pdf
    supports: "23 82 39 covers convection unit heaters (cabinet, propeller, wall and ceiling)"
    verified: true
  - id: s8
    publisher: EC&M
    title: "Article 424: Fixed Electric Space-Heating Equipment"
    year: 2020
    url: https://www.ecmweb.com/national-electrical-code/article/20900735/article-424-fixed-electric-spaceheating-equipment
    supports: "NEC 424: 125% branch-circuit sizing; fixed infrared equipment in non-dwellings on branch circuits up to 50 A; listing for damp/wet locations (424.12(B)); clearances to combustibles (424.13)"
    verified: true
  - id: s9
    publisher: UL Standards & Engagement
    title: "UL 499 Electric Heating Appliances (scope)"
    year: 2025
    url: https://datasheets.globalspec.com/ds/uls/ul-499/8c3e0500-bd99-4c6f-93a0-4b41e223b0f7
    supports: "UL 499 scope: heating appliances up to 600 V used per NFPA 70; 2025 revision adds outdoor/wet rating marking"
    verified: true
---

# Architect Spec Kit: outdoor electric radiant heaters

Write outdoor heat into the specification the same way you write lighting: a named section, a listed product, a required control, a detail on the drawings. This kit gives you a CSI three-part guide specification for Bromic Smart-Heat electric radiant heaters under **MasterFormat 23 83 33, Electric Radiant Heaters**, a coverage and selection table, the details to draw and the CAD/BIM files to request. Edit the bracketed text, delete what does not apply, and send the coverage plan to the Bromic design team before you issue for bid.

![Glass pavilion with ceiling-recessed heaters](img:l-010-075)

## What is in this kit?

| Part | What it is | Format | Status |
|---|---|---|---|
| 1 | This index and how to use it | Markdown → PDF | Draft |
| 2 | Guide specification, Section 23 83 33 (three-part CSI format) | Editable .docx from this text | Draft |
| 3 | Coverage and selection table | Table below; .xlsx on request | Draft |
| 4 | Detail drawing list (four standard details) | DWG / PDF | [[VERIFY: which details exist today — Mike Clifford]] |
| 5 | CAD and BIM file index | DWG, RVT, PDF | [[VERIFY: which files exist — Mike Clifford]] |
| 6 | Design consult request (coverage drawings) | Service, [asset:A07](asset:A07) | Live |

## Which MasterFormat section should outdoor infrared heaters go in?

Use **23 83 33 Electric Radiant Heaters**. The reasoning, so you can defend it in a spec review:

- **Division 23 (HVAC), 23 83 00 Radiant Heating Units** is MasterFormat's home for equipment that heats by radiation.[^s3] Its level-3 children are 23 83 13 (radiant heating electric cables and mats), 23 83 23 (radiant heating electric panels) and **23 83 33 (electric radiant heaters)**.[^s4] A Bromic heater is a self-contained electric infrared emitter, not a cable, mat or panel, so 23 83 33 is the closest fit.
- **Not 23 82 39 Unit Heaters.** That section covers convection units (cabinet, propeller, wall and ceiling unit heaters) that move warm air.[^s7] Outdoors, warm air rises and is carried off by the breeze; radiant heat warms people and surfaces instead.[^s2]
- **Not 23 55 23 Gas-Fired Radiant Heaters.** That is the home for gas radiant equipment.[^s6] If a project also uses Bromic gas heaters, write them there as a separate section.
- **Industry precedent.** Other manufacturers' guide specifications for outdoor electric radiant heaters use 23 83 33.[^s5] Some product directories also tag infrared heaters under 23 82 39; treat that as a directory habit, not a reason to follow it.
- **Related sections** you will coordinate: 26 05 19 (conductors), 26 05 33 (raceways and boxes), 26 27 26 (wiring devices), 26 28 16 (disconnects), 23 09 00 (HVAC instrumentation and control) if a building automation system is in scope, and Division 06/09 for the soffit framing and finish around recessed units.

[[VERIFY: confirm section numbers and titles against the current CSI MasterFormat edition the practice uses — specifier / Shaughn Ritchie]]

## Which Bromic heater suits which space?

People first: a dining table needs even heat at seated head height; a bar rail needs heat where people stand; a lounge needs heat that does not glare. Then the numbers. Coverage is approximate and varies with model, mounting height, environment and installation.[^s1]

| Series | Status | Output | Finishes | Approx. coverage per heater | Mounting | Best for | Controls (required) |
|---|---|---|---|---|---|---|---|
| Platinum Smart-Heat Electric | Current | 2300 W, 3400 W, 4500 W | Black, White; Classic and Marine variants | 65–143 ft² (by model and size) | Recessed, ceiling, wall | Covered terraces, soffits, outdoor kitchens, coastal (Marine) | Affinity On/Off or Dimmer controller + manual wall switch; app via compatible Affinity controls |
| Eclipse Smart-Heat Electric | Current | Heat output 33 / 66 / 100% [[VERIFY: rated wattage and voltage — Mike Clifford]] | Black, dimmable rim lighting | 121 ft² | Single pole 8", 24" or 48"; double pole; curved pole | Dining tables and lounges where heat and light are one fixture | Affinity Eclipse controller + manual wall switch; app via compatible Affinity controls |
| Eclipse Smart-Heat Freestanding Electric | Current | 33 / 66 / 100% | Black, dimmable rim lighting | 121 ft² | Freestanding: integrated wheels, weighted base, curved arm | Flexible lounge and terrace layouts; FF&E rather than built-in | Affinity Eclipse controller [[VERIFY: freestanding control method — Mike Clifford]] |
| Tungsten Smart-Heat Electric, Coastal collection (coming soon) | Coming soon | [[VERIFY: wattages — Mike Clifford]] | Black, White; 316 marine-grade stainless; Signature Diamond Pattern grille | 64–144 ft² (by model and size) | Recessed (marine-grade low-clearance), ceiling, wall, single-post | Waterfront and marine environments | Affinity controls as for Platinum [[VERIFY: controller compatibility — Mike Clifford]] |
| Tungsten Smart-Heat Electric, Select collection (coming soon) | Coming soon | [[VERIFY: wattages — Mike Clifford]] | Black, White, Graphite; expanded fascia options | 64–144 ft² (by model and size) | Recessed (low-clearance), ceiling, wall, single-post | Design-led residential and hospitality | Affinity controls as for Platinum [[VERIFY: controller compatibility — Mike Clifford]] |

Platinum coverage by individual wattage is not yet published in this kit. [[VERIFY: coverage and mounting height per Platinum wattage (2300 / 3400 / 4500 W) — Mike Clifford]]

A space counts as outdoor when at least 30% of its perimeter is permanently open; a partial roof traps a "heat cloud" that adds a convective boost.[^s2] Size for the open condition, then let the cover help.

![Recessed heater in a timber soffit on a city roof terrace](img:t-006-016)

## Guide specification: Section 23 83 33 Electric Radiant Heaters

> **Notes to specifier** are in italics in square brackets. Delete them before issue. Bracketed options [ ] are choices.

### PART 1 – GENERAL

**1.1 SUMMARY**

A. Section includes:
1. Electric infrared radiant heaters for outdoor and semi-outdoor spaces: recessed, ceiling-mounted, wall-mounted and pole-suspended.
2. Heater controls: controllers, wall switches and app-based scheduling. Controls are part of the heating system and are required.
3. Mounting accessories: recess kits and suspension poles.

B. Related requirements:
1. Division 06 / 09: soffit framing, blocking and finishes at recessed units.
2. Division 26: branch circuits, raceways, disconnects, wiring devices.
3. Section 23 09 00: building automation interface, where used.
4. Section 23 55 23: gas-fired radiant heaters, where used.

**1.2 REFERENCES**

A. NFPA 70, National Electrical Code (NEC), edition adopted by the authority having jurisdiction (AHJ), including Article 424, Fixed Electric Space-Heating Equipment.[^s8]
B. Product safety listing by a Nationally Recognized Testing Laboratory (NRTL): UL, CSA or Intertek (ETL).[^s2] [[VERIFY: the exact standard each Bromic electric heater is listed to (for example UL 499 or UL 2021; CSA C22.2) and the listing file numbers — Mike Clifford]][^s9]
C. Ingress protection rating per IEC 60529. [[VERIFY: IP rating per series — Mike Clifford]]
D. Local building, energy and fire codes as adopted by the AHJ. Commercial energy codes may require outdoor heating to be radiant and controlled by an occupancy sensor or timer; see the [electrification guide](asset:A12).

**1.3 SUBMITTALS**

A. Product data: for each heater and controller, rated wattage, voltage, phase, amperage, listing marks, IP rating, finish, dimensions, weight and minimum clearances.
B. Shop drawings: heater layout with coverage zones overlaid, mounting heights, clearances to combustibles, recess and blocking details, circuiting and control zoning. *[Bromic's complimentary design service prepares coverage drawings from plans or photos.[^s1]]*
C. Wiring diagrams: power and control, including interface to building automation where used.
D. Samples: finish samples for [Black] [White] [Graphite – Tungsten Select only].
E. Certificates: NRTL listing for each product and its intended location (damp or wet).
F. Operation and maintenance data: installation manual, cleaning, element replacement, app set-up.
G. Warranty: manufacturer's standard warranty document.

**1.4 QUALITY ASSURANCE**

A. Manufacturer qualifications: a manufacturer whose products are listed by an NRTL for outdoor use and who provides layout and coverage design support.
B. Installer qualifications: electrical work by an electrician licensed in the jurisdiction of the project.
C. Install per the manufacturer's current installation instructions. Where these differ from the drawings, notify the Architect before proceeding.
D. *[Mock-up: for hospitality projects, consider one recessed unit installed in the finished soffit for review of finish, alignment and glare.]*

**1.5 DELIVERY, STORAGE AND HANDLING**

A. Deliver in original packaging, labelled with model and finish. Store dry and protected from construction damage until installation.

**1.6 WARRANTY**

A. Manufacturer's standard limited warranty. [[VERIFY: warranty terms and periods per series, residential vs commercial, and any marine/coastal conditions — Mike Clifford]]

### PART 2 – PRODUCTS

**2.1 MANUFACTURER**

A. Basis of design: Bromic Heating, 7595 Irvine Center Drive, Suite 100, Irvine, CA 92618. 1-800-301-1293. www.bromic.com.[^s1]

B. Substitutions: *[Choose one. See "Proprietary or 'or approved equal'?" below.]*
1. [Option A – proprietary: No substitutions.]
2. [Option B – base bid with substitution: Products of other manufacturers will be considered only if they meet every performance requirement in 2.2–2.4 and are submitted under Division 01 substitution procedures with a coverage drawing for the same layout.]

**2.2 ELECTRIC RADIANT HEATERS**

A. General: electric infrared radiant heaters, listed for outdoor use in the location where installed, designed to warm people and surfaces rather than air.

B. **Platinum Smart-Heat Electric** (basis of design for recessed, ceiling and wall applications):
1. Rated output: [2300 W] [3400 W] [4500 W].[^s1]
2. Voltage and phase: [[[VERIFY: available voltages per wattage; commercial options listed historically as 208 / 240 / 277 V — Mike Clifford]]][^s2]
3. Variant: [Classic] [Marine]. *[Marine for coastal and poolside locations.]*
4. Finish: [Black] [White].
5. Mounting: [recessed with manufacturer's recess kit] [ceiling-mounted] [wall-mounted].
6. Approximate coverage: 65–143 ft² per heater depending on model and size.[^s1]

C. **Eclipse Smart-Heat Electric** (pendant heat and light):
1. Heat output steps: 33%, 66%, 100%.[^s1]
2. Integrated dimmable rim lighting.
3. Finish: Black.
4. Suspension: [single pole 8"] [single pole 24"] [single pole 48"] [double pole] [curved pole].
5. Approximate coverage: 121 ft² per heater, depending on installation.
6. Rated wattage and voltage: [[VERIFY — Mike Clifford]].

D. **Eclipse Smart-Heat Freestanding Electric** *[usually specified as FF&E; include here only if the heating contractor supplies it]*:
1. Integrated wheels, weighted base, curved arm, heat and dimmable light in one.[^s1]
2. Heat output steps: 33%, 66%, 100%. Approximate coverage: 121 ft².
3. Power supply: [[VERIFY: plug/cord and receptacle requirements — Mike Clifford]].

E. **Tungsten Smart-Heat Electric, Coastal collection (coming soon)** *[specify only after Bromic confirms availability for the project schedule]*:
1. 316 marine-grade stainless steel; Signature Diamond Pattern grille.[^s1]
2. Finish: [Black] [White].
3. Mounting: [marine-grade low-clearance recessed] [ceiling] [wall] [single-post].
4. Approximate coverage: 64–144 ft² depending on model and size.
5. Wattage, voltage, dimensions: [[VERIFY — Mike Clifford]].

F. **Tungsten Smart-Heat Electric, Select collection (coming soon)** *[as above]*:
1. Finish: [Black] [White] [Graphite]; expanded fascia options.[^s1]
2. Mounting: [low-clearance recessed] [ceiling] [wall] [single-post].
3. Approximate coverage: 64–144 ft² depending on model and size.
4. Wattage, voltage, dimensions: [[VERIFY — Mike Clifford]].

G. Performance requirements (for Option B substitutions): [[VERIFY: Bromic's preferred performance criteria — e.g. wavelength class, element type, IP rating, listing, warm-up time, glare/visible light — Mike Clifford + Shaughn Ritchie]]

**2.3 CONTROLS (REQUIRED)**

A. Every heater shall be controlled by Affinity Smart-Heat Controls by Bromic Heating. A heater without its controller is not a complete system and shall not be accepted.[^s1]

B. Controllers, as scheduled on the drawings:
1. [Affinity Smart-Heat On/Off controller] – on/off control of one or more heaters per zone.
2. [Affinity Smart-Heat Dimmer controller] – variable output for Platinum and Tungsten heaters. [[VERIFY: dimmer compatibility per series and wattage — Mike Clifford]]
3. [Affinity Smart-Heat Eclipse controller] – heat steps and rim lighting for Eclipse heaters.
4. Manual wall switch at each zone, mounted at [__] in AFF, in a location visible from the heated area.

C. App: Bromic Smart-Heat app for zones, schedules and timers. Wi-Fi connectivity and app features require compatible Affinity Smart-Heat Controls, sold separately.[^s1] Provide Wi-Fi coverage at controller locations. [[VERIFY: network requirements (band, signal strength) — Mike Clifford]]

D. Integrations: where scheduled, interface with [Amazon Alexa] [Google Assistant] [Control4] [Crestron] [Lutron]. Compatibility varies by system; integration requires compatible Affinity controls and may require additional integration hardware or configuration.[^s1] Coordinate with the integrator before rough-in.

E. Energy code compliance: where the AHJ requires outdoor heating to switch off automatically when unoccupied, provide [occupancy sensor] [time switch] control. [[VERIFY: whether Affinity schedules/timers satisfy the "timer switch" requirement, and approved occupancy-sensor interface — Mike Clifford]]

F. Zoning: separate zones for areas used at different times (for example dining, bar, lounge).

**2.4 ACCESSORIES**

A. Recess kits: manufacturer's recess kit for flush mounting of Platinum and Tungsten electric heaters in ceiling and soffit cavities.[^s2] [[VERIFY: recess kit part numbers, cut-out sizes and cavity depth per model — Mike Clifford]]
B. Suspension poles: manufacturer's suspension poles to bring heaters to effective height under high ceilings.[^s2] [[VERIFY: available lengths — Mike Clifford]]
C. Wall and ceiling brackets: as supplied with each heater.

### PART 3 – EXECUTION

**3.1 EXAMINATION**

A. Verify that blocking, recess cavities and structure are in place and sized to the manufacturer's cut-out and cavity dimensions.
B. Verify that branch circuits, disconnects and control wiring are in place, labelled and match the approved shop drawings.
C. Verify clearances to combustible materials, sprinkler heads, lighting, fans, drapes and awnings before mounting. Do not proceed until conditions are corrected.

**3.2 INSTALLATION**

A. Install heaters, controls and accessories per the manufacturer's current installation instructions and the approved shop drawings.
B. Mounting heights: not less than the manufacturer's minimums for the model and wattage. *[Bromic's planning guidance has been a minimum of 72 in above floor for wall mounting and 96 in for ceiling mounting, varying with output.[^s2] Confirm against the current installation manual for each model.]* [[VERIFY: current minimum mounting heights and clearances per model and wattage — Mike Clifford]]
C. Aim wall-mounted heaters at the occupied zone, not at walkways or glazing.
D. Recessed units: install recess kit before ceiling finish; seal the ceiling penetration per the manufacturer's instructions.

**3.3 CLEARANCES**

A. Maintain the manufacturer's minimum clearances to ceilings, walls, combustible materials and other fixtures, and NEC 424.13.[^s8]
B. Show clearances on the shop drawings and confirm on site before final fixing.

**3.4 ELECTRICAL**

A. Electrical work by an electrician licensed in the project's jurisdiction, per NFPA 70 as adopted by the AHJ.
B. Provide dedicated branch circuits sized per NEC Article 424 (branch-circuit conductors not less than 125% of the heating load) and the manufacturer's instructions.[^s8]
C. Use wiring methods, boxes and devices suitable for damp or wet locations as the location requires.
D. Provide a disconnecting means as required by NEC Article 424.
E. Run control wiring and network per the controller manufacturer's requirements.

**3.5 COMMISSIONING**

A. Energise each zone; confirm every heater reaches operating output and every controller step (on/off, dimmer levels, Eclipse heat steps and rim lighting) responds.
B. Confirm the wall switch overrides as intended.
C. Set up the Smart-Heat app: zones named to match the drawings, schedules and timers per the Owner's operating hours.
D. Test any third-party integration end to end.
E. Record measured voltage and current per circuit in the commissioning report.

**3.6 DEMONSTRATION**

A. Train the Owner's staff on site [one hour] [two hours]: operation, zones, schedules, wall switch, app, cleaning and safe distances.
B. Hand over O&M manuals, warranty documents and the commissioning report.

**END OF SECTION 23 83 33**

## Proprietary or "or approved equal"?

*Note for review (Shaughn Ritchie):* the goal of this kit is to stop substitution at bid. A proprietary specification (Option A) does that, and is common on private residential and hospitality work. Many public owners, and some private ones, require competition, so an architect may be required to allow substitutions. Option B keeps Bromic as basis of design but sets performance criteria and demands a coverage drawing for any substitute, which raises the bar without forbidding it. Both options are drafted above. [[VERIFY: Bromic's preferred default (A or B) and the performance criteria for Option B — Shaughn Ritchie + Mike Clifford]]

## Which details should the drawings carry?

Four standard details cover most projects. Each is drawn as a section or plan with dimensions left as tags for the model chosen.

| No. | Detail | Shows | Diagram |
|---|---|---|---|
| D1 | Recessed soffit section | Heater in recess kit, cavity depth, blocking, ceiling finish, clearance to structure and combustibles, junction box location | [[DIAGRAM: section through a timber or plaster soffit showing a recessed Platinum heater in its recess kit, blocking, cavity depth tag, ceiling finish line, junction box, clearance dimensions as tags]] |
| D2 | Wall-mount elevation | Bracket, mounting height above finished floor, tilt, clearance to ceiling and openings, conduit entry, wall switch location | [[DIAGRAM: elevation of a wall-mounted heater with mounting height tag (min. per manual), tilt angle, ceiling clearance tag, conduit entry, wall switch and controller location]] |
| D3 | Pole suspension | Suspension pole or Eclipse single/double/curved pole, effective heater height, structural fixing | [[DIAGRAM: section under a high or pitched ceiling showing a suspension pole bringing a heater to effective height; second view of an Eclipse pendant on single and double poles]] |
| D4 | Coverage plan | Heater positions with approximate coverage footprints over the furniture plan, zones, circuits, controller and switch locations | [[DIAGRAM: plan of a dining terrace with furniture, heater symbols, approximate coverage footprints, zone boundaries, circuit tags and Affinity controller / wall switch locations]] |

![Recessed heater in a white coastal ceiling](img:l-005-022)

## Which CAD and BIM files are available?

[[VERIFY: which files exist, their formats, LOD and where they are hosted (bromic.com, BIMobject, ARCAT, other) — Mike Clifford]]

| File | Format | Covers | Status |
|---|---|---|---|
| Revit families, electric heaters | .rfa | Platinum (2300/3400/4500 W), Eclipse, Tungsten Coastal and Select (when launched) | [[VERIFY — Mike Clifford]] |
| Revit families, controllers | .rfa | Affinity On/Off, Dimmer, Eclipse controllers | [[VERIFY — Mike Clifford]] |
| 2D CAD blocks | .dwg | Plan and elevation blocks per heater | [[VERIFY — Mike Clifford]] |
| Standard details D1–D4 | .dwg / .pdf | As listed above | [[VERIFY — Mike Clifford]] |
| Specification sheets | .pdf | Per model: dimensions, weight, wattage, voltage, clearances | [[VERIFY — Mike Clifford]] |
| Installation manuals | .pdf | Per model, current edition | [[VERIFY — Mike Clifford]] |
| Listing certificates | .pdf | NRTL listing per model | [[VERIFY — Mike Clifford]] |
| This guide specification | .docx | Section 23 83 33 | Draft (this document) |

## Planning checklist

- [ ] Space confirmed as outdoor (at least 30% of the perimeter permanently open).[^s2]
- [ ] Heater series chosen by use: seated, standing, lounge; coastal exposure noted.
- [ ] Coverage plan (D4) drawn over the furniture layout and checked by Bromic's design team.
- [ ] Controls scheduled for every zone: controller type, wall switch, app, any integration.
- [ ] Mounting heights and clearances taken from the current installation manual, not from memory.
- [ ] Recess cavities and blocking shown on the architectural sections (D1).
- [ ] Circuits, voltage and disconnects coordinated with the electrical engineer.
- [ ] Energy code check: does the AHJ require occupancy or timer control for outdoor heat?
- [ ] Substitution approach (Option A or B) agreed with the Owner.
- [ ] Tungsten Coastal and Select only where Bromic confirms availability for the programme.

## Disclaimer

This guide specification is a starting point, not a substitute for professional judgement. Codes, listings and manufacturer requirements change. Confirm every requirement with the authority having jurisdiction and a licensed electrician, and use the manufacturer's current installation instructions for the model specified. Imagery is for design inspiration; product scale and placement may vary from actual specifications.[^s1]

Send us the plan and we will return a coverage drawing for your specification.
