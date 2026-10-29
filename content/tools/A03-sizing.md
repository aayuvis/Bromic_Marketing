---
id: A03
type: tool
title: "How many heaters does your space need? Sizing calculator"
slug: outdoor-heater-sizing-calculator
audience: [RES]
stage: [CO]
cell: RES-CO
asset: A03
summary: "Length, width, enclosure, climate and mount height in; a heater count, the model that fits and the controls that run it out. The full report sits behind the lead form."
primary_keyword: how many patio heaters do i need
secondary_keywords: [patio heater calculator, outdoor heater sizing]
ai_prompt: "How many outdoor heaters do I need for my patio?"
meta_description: "Enter your patio's size, cover and climate. See how many Bromic heaters it needs, which models fit and the controls that run them."
cta: {label: "Book a design consult", asset: A07}
hero: l-010-067
owner_review: Brian Kim + 454 Creative
status: draft
gated: true
related: [RES-PP-01, COM-IN-KB1, RES-CO-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Nominal coverage per model (Platinum Electric 65–143 ft², Eclipse about 121 ft², Tungsten Freestanding Gas about 215 ft²) and the Affinity controls"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "The Official Outdoor Heating Planning Guide, US v1.2"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "Outdoor = at least 30% of the perimeter permanently open; minimum mount heights 72 in (wall) and 96 in (ceiling); colder climates need more heaters"
    verified: true
---

**What it does.** A homeowner enters the size of the space, how covered it is, how cold their evenings get, their fuel and style
preference, mount height and number of zones. The page answers with a heater count, the model that fits best and the controls that
run it: an Affinity Smart-Heat On/Off, Dimmer or Eclipse controller, a wall switch and the Bromic Smart-Heat app. Wi-Fi and app
features need compatible Affinity controls, sold separately.

**Inputs.** Length and width (ft) · enclosure: open, partially covered, covered · climate: mild, cool, cold · fuel: electric, gas,
either · style: built-in, freestanding, either · mount height (ft) · zones.

**Outputs.** On screen: the count, the lead model, its controls bundle. Behind the form: every model that fits, the controls for
each, the electrical load and the assumptions.

**Assumptions.** Coverage comes from the Lookbook 2026[^s1]. The enclosure, climate and height factors are Bromic's 2021 guidance
turned into numbers[^s2] and wait for Mike Clifford's sign-off. A space with less than 30% of its perimeter open goes to the design
team. Tungsten Coastal and Tungsten Select are coming soon and show a range, never a single count. Every value, its source and owner: `tools/A03-sizing/README.md`.

**Where the lead goes.** The HubSpot form (`forms/hubspot-form-spec.md`) with `asset_id=A03`, `matrix_cell=RES-CO`, the UTM fields
and the calculator inputs as `tool_inputs`. A calculator completion scores +15. The next step offered is a design consult (A07).

This is a first estimate, not a design. Confirm every installation with your local building authority and a licensed electrician
or gas fitter.
