---
id: ARC-BY-01
type: article
title: "Outdoor heater submittals: a coordination checklist for architects"
slug: outdoor-heater-submittal-checklist
audience: [ARC]
stage: [BY]
cell: ARC-BY
asset: A24
summary: "What a complete outdoor heater submittal holds, and the circuit, framing, clearance and controls coordination that keeps RFIs and change orders off the job."
primary_keyword: patio heater submittal
secondary_keywords: [outdoor heater installation coordination, heater circuit requirements]
ai_prompt: "What should be in a submittal package for outdoor heaters?"
meta_description: "Outdoor heater submittal checklist for architects: product data, circuits, breakers, conduit, recess framing, clearances, controls wiring and NEC coordination."
cta: {label: "Book a design consult", asset: A07}
hero: l-010-076
images: [l-007-035]
owner_review: Shaughn Ritchie
status: draft
gated: false
related: [ARC-IN-01, BLD-IN-01, ARC-IN-KB1, ARC-BY-KB1]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Outdoor Heating Planning Guide v1.2, Steps 06–08 and design support"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "NFPA 70 / NFPA 54; wall ≥72 in, ceiling ≥96 in, varies with output; certification marks; recess kits, suspension poles, deflectors; commercial supply 208/240/277V; include hardware, utilities and permit fees in pricing"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Product range, coverage, mounting; Affinity controls, app, integrations and compatibility caveat; complimentary design service"
    verified: true
  - id: s3
    publisher: EC&M (Electrical Construction & Maintenance)
    title: "Article 424: Fixed electric space heating (code basics)"
    year: 2020
    url: https://www.ecmweb.com/code-basics/article-424-fixed-electric-space-heating
    supports: "NEC 424 scope: fixed electric space-heating equipment; conductors sized at not less than 125% of load (424.4(B), 2020 NEC); fossil-fuel heating equipment wiring sits in 422.12"
    verified: true
  - id: s4
    publisher: National Fire Protection Association
    title: "NFPA 70, National Electrical Code"
    year: 2023
    url: https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70
    supports: "Primary code text for Articles 422 and 424"
    verified: false
---

A complete outdoor heater submittal holds product data and the installation manual, a coverage layout, the electrical load per heater with circuit and breaker schedule, recess or mounting details with framing dimensions, clearance data, a controls schematic showing who wires what, and certification marks. Review it against three questions: does each heater have a sized, dedicated circuit; does the structure have the opening and blocking drawn; and does every control have a wire, a location and an owner.

![White heater set between pergola louvres](img:l-010-076)

## What should be in a submittal package for outdoor heaters?

| Submittal item | What to check | Coordinates with |
|---|---|---|
| Product data sheet per model | Wattage, voltage, amperage, finish, variant match the spec | Spec Section 23 83 33 |
| Installation manual (current edition) | Mounting heights, clearances, recess requirements | Contractor, AHJ |
| Coverage layout | Heater positions on RCP and plan; mounting heights in section | Design intent, lighting layout |
| Electrical schedule | Load per heater, circuit, breaker, conductor, disconnect | Electrical engineer, Division 26 |
| Recess kit or mounting accessory | Cut-out, cavity depth, framing, blocking, finish trim | Structure, ceiling sub |
| Controls schematic | Controller type and location, low-voltage or line-voltage runs, network | Electrician, AV / automation integrator |
| Certification | Intertek, UL or CSA mark on each unit[^s1] | AHJ |
| Warranty and O&M | Terms, cleaning, app set-up | Owner |

[[VERIFY: per-model electrical data (amps at 208/240/277V), recess kit dimensions and clearance tables to attach to submittals — Mike Clifford]]

## How should heater circuits be coordinated?

Treat each fixed electric heater as a continuous load. The NEC's fixed electric space-heating rules size branch-circuit conductors at not less than 125% of the heater load[^s3]. Ask the electrical engineer to confirm which article governs each unit (Article 424 for fixed space heating, or Article 422 for appliances) under the edition the jurisdiction has adopted, and to show it on the panel schedule[^s3][^s4].

Points that generate RFIs when left open:

- **Voltage.** Bromic lists 208V, 240V and 277V supply options for commercial sites[^s1]. Confirm the building service and the model voltage together; a 240V heater on a 208V service delivers less output. [[VERIFY: output and coverage derating at 208V per model — Mike Clifford]]
- **Dedicated breakers.** Show one circuit per heater, or a grouping the manual permits, with breaker size on the schedule.
- **Disconnect.** Locate the disconnecting means where the code and the manual require it, visible on the drawings. [[VERIFY: NEC disconnect requirements for fixed space heaters in the adopted edition — electrical engineer]]
- **Conduit and boxes.** Route conduit into the soffit or beam before the ceiling closes. Use wiring methods and boxes rated for damp or wet locations as the exposure requires.
- **Ground-fault protection.** Confirm any GFCI or ground-fault requirement under the adopted NEC edition. [[VERIFY: ground-fault requirements for hardwired outdoor heaters by NEC edition — electrical engineer]]

## What framing does a recessed heater need?

Recess kits flush-mount Platinum and Tungsten Electric heaters into roof or ceiling cavities[^s1]. The opening, its trimmers and the cavity depth must be on the framing drawings, not discovered by the installer. Suspension poles bring heaters down in high ceilings; detail the structural attachment above[^s1].

Submittal checks: cut-out dimensions match the kit; cavity depth and any required ventilation or clearance inside the recess match the manual; the ceiling finish returns cleanly to the kit's trim; the structure carries the heater weight. The Tungsten Select and Coastal collections (coming soon) are designed for low-clearance recessing; confirm dimensions before detailing[^s2].

![Ceiling-mounted black heater over a candlelit lounge](img:l-007-035)

## What clearances apply?

Bromic's guidance sets minimum mounting heights of 72 in above floor for wall mounts and 96 in for ceiling mounts, varying with output[^s1]. Clearances to combustible materials, to walls and to the ceiling come from each model's installation manual. Do not take them from a spec template or another product. Mark the clearance envelope on the RCP and on sections through pergolas, awnings, umbrellas and planting.

## How should controls be coordinated?

Controls are part of the heater, not an add-on. Every heater on the drawings needs:

- An Affinity Smart-Heat controller (On/Off, Dimmer, or the Eclipse controller for Eclipse heaters).
- A manual wall switch.
- The Bromic Smart-Heat app for zones, schedules and timers. Wi-Fi and app features require compatible Affinity Smart-Heat Controls, sold separately[^s2].

For Control4, Crestron or Lutron, compatibility varies by system and may need additional integration hardware or configuration[^s2]. Name who supplies the interface, who writes the programming and who provides the network drop at the controller. Show the controller location on the electrical plan, sheltered as the manual requires, and the circuit-to-zone mapping on the schedule.

## Planning checklist

- [ ] Product data and current installation manual per model
- [ ] Coverage layout with mounting heights in section
- [ ] Load, voltage, conductor and breaker per heater on the panel schedule
- [ ] Disconnect and any ground-fault protection located and confirmed
- [ ] Conduit routes and boxes in the soffit before close-up
- [ ] Recess opening, blocking and cavity depth on framing drawings
- [ ] Clearance envelope on RCP and sections
- [ ] Affinity controller, wall switch, app; integration responsibility assigned
- [ ] Certification marks and warranty

*Code references are for orientation only. Confirm with the local authority having jurisdiction and a licensed electrician; for gas units, a licensed gas fitter under NFPA 54[^s1].*

## FAQ

### What should be in a submittal package for outdoor heaters?
Product data, installation manual, coverage layout, electrical schedule, mounting or recess details, controls schematic, certification and warranty.

### Do outdoor electric heaters need a dedicated circuit?
Plan for it. Fixed electric space-heating loads are treated as continuous and sized at 125%[^s3]. The manual and the electrical engineer set the final circuiting.

### Which NEC article applies to outdoor infrared heaters?
Usually Article 424 for fixed electric space heating[^s3]. The electrical engineer confirms against the adopted edition and the unit's listing.

### Who wires the controls?
The electrician wires line-voltage connections and controllers; an integrator handles Control4, Crestron or Lutron programming. Assign both on the drawings.

### Can Bromic review a layout before submittal?
Yes. The complimentary design service prepares heater selection, placement and coverage drawings from photos, plans or drawings[^s2].

Book a design consult to have Bromic check the layout and BOM before submittal.
