---
id: ARC-CO-01
type: article
title: "Radiant heat outdoors: a specifier's guide to short, medium and long wave"
slug: radiant-heat-short-medium-long-wave
audience: [ARC]
stage: [CO]
cell: ARC-CO
asset: A24
summary: "Short, medium and long wave infrared compared on radiant fraction, warm-up and wind, plus how enclosure, mounting height and the heat cloud change what you specify."
primary_keyword: radiant heater outdoor design
secondary_keywords: [short wave infrared heater, infrared heater wavelength]
ai_prompt: "What is the difference between short wave and long wave infrared heaters?"
meta_description: "Short vs medium vs long wave infrared heaters for outdoor design: radiant output, warm-up, wind, mounting height and the 30% open-perimeter rule."
cta: {label: "Download the Planning Guide (pro edition)", asset: A02}
hero: l-010-071
images: [l-013-111, l-004-012]
owner_review: Mike Clifford
status: draft
gated: false
related: [ARC-IN-01, ARC-CO-KB1, ARC-AW-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Outdoor Heating Planning Guide v1.2, Step 04: heat wave mapping"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "Long wave ~572°F, 40% radiant / 60% convective, ~5 min warm-up, wind-susceptible; medium ~1652°F, 60/40, ~30 s; short ~3992°F, 90/10, instantaneous"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "Outdoor Heating Planning Guide v1.2, pp.3–4, Step 06"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "Radiant heat warms objects not air and resists mild wind; outdoor cannot be thermostatically controlled; outdoor = ≥30% perimeter permanently open; heat cloud; wall ≥72 in, ceiling ≥96 in, varies with output"
    verified: true
  - id: s3
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Coverage figures per product; coverage varies by heater model, mounting height, environment and installation conditions; Affinity controls"
    verified: true
  - id: s4
    publisher: Florida State Horticultural Society (Proceedings)
    title: "Grove heating study: radiant heat and distance (date to confirm)"
    year: null
    url: https://journals.flvc.org/fshs/article/download/99738/95709/128356
    supports: "Areas two and three units from a radiant source receive 1/4 and 1/9 of the radiant heat received at one unit (inverse square)"
    verified: false
  - id: s5
    publisher: Washington State Building Code Council (WAC 51-11C-40392)
    title: "Washington State Energy Code, Commercial, C403.11.1 Heating outside a building"
    year: 2021
    url: https://lawfilesext.leg.wa.gov/law/WAC/WAC%20%2051%20%20TITLE/WAC%20%2051%20-%2011C%20CHAPTER/WAC%20%2051%20-%2011C-40392.htm
    supports: "Heat provided outside a building must be radiant and controlled by an occupancy sensor or timer switch"
    verified: true
---

Short wave infrared runs hottest and is about 90% radiant, so it warms people almost instantly and holds up best in wind. Long wave runs coolest, is only about 40% radiant, takes around five minutes to warm and loses much of its effect to breeze. Medium wave sits between: about 60% radiant with a warm-up of roughly 30 seconds[^s1]. For open outdoor spaces, specify the most radiant source the setting allows and place it for the people, not the floor area.

![Ocean-view outdoor living room with heaters recessed into the ceiling](img:l-010-071)

## What is the difference between short, medium and long wave infrared?

Wavelength follows element temperature. The hotter the emitter, the shorter the wave and the larger the share of energy leaving as radiation rather than as warm air.

| | Short wave | Medium wave | Long wave |
|---|---|---|---|
| Emitter temperature (approx.) | 3,992°F | 1,652°F | 572°F |
| Radiant / convective split | 90 / 10 | 60 / 40 | 40 / 60 |
| Warm-up | Instant | ~30 s | ~5 min |
| Wind | Warms people and objects directly | Limited susceptibility | Susceptible to dispersal |
| Indicative fit | Open, exposed, windy | Covered, semi-sheltered | Sheltered, enclosed |

Source: Bromic Planning Guide v1.2 heat-wave mapping[^s1]. The "indicative fit" row is our reading of those properties, not a published rule.

The convective share matters outdoors because warm air rises and drifts away. Indoors that air would be kept; outside it is lost. That is why the Planning Guide's position is blunt: outdoor heat cannot be thermostatically controlled, and forced air does not work in the open[^s2].

[[VERIFY: wavelength classification (short / medium / long, element type) for each current Bromic model — Mike Clifford]]

## Why does radiant heat work in wind when forced air does not?

Radiant energy travels in straight lines and is absorbed by the surfaces it hits: skin, clothing, furniture, stone. It does not need the air to carry it, so a breeze moves the air without moving the heat already delivered. Forced air is the air, and goes with the wind[^s2].

The practical rule: the more exposed the space, the more radiant the source you need. A long wave unit on a windy rooftop is a lamp that happens to be warm.

![Wall-arm Eclipse heaters over a restaurant terrace under an awning](img:l-013-111)

## How does the enclosure change the spec?

Bromic treats a space as outdoor when at least 30% of its horizontal perimeter is permanently open[^s2]. Below that, it starts behaving like a room, and indoor ventilation and appliance rules may apply; confirm with the authority having jurisdiction.

Inside the outdoor range, the cover matters. A roof or deep overhang traps a layer of warm air, the "heat cloud", which adds a convective boost on top of the radiant output[^s2]. The same heater does more under a soffit than on an open deck. Plan for the design condition: a covered terrace with one open side behaves differently from a pergola with open louvres.

| Condition | Effect on design |
|---|---|
| Fully open, no cover | Radiant only; prioritise short wave and tighter spacing |
| Partial cover (soffit, cantilever, closed pergola) | Heat cloud adds convective gain; mount to the soffit |
| Open louvres or slatted roof | Little heat cloud; treat as open for sizing |
| Under 30% of perimeter open | Not "outdoor" for Bromic's purposes; check local code |

## How does mounting height change heat intensity?

Intensity falls with distance. For a source small relative to the distance, irradiance follows the inverse-square law: double the distance and the heat received drops to a quarter[^s4]. Linear heaters fall off less steeply close in, so treat the table as a direction of travel, not a design value.

| Distance from heater (relative) | 1.0× | 1.25× | 1.5× | 2.0× |
|---|---|---|---|---|
| Relative intensity, ideal point source | 100% | 64% | 44% | 25% |

Two consequences. Raise a heater and its pattern widens while intensity at head height drops, so a high ceiling may need more heaters or a suspension pole to bring units down. Lower it and you hit Bromic's minimums: wall mounts at least 72 in above floor and ceiling mounts at least 96 in, varying with output[^s2]. Lookbook coverage figures assume typical installation; Bromic notes coverage varies with mounting height, environment and installation conditions[^s3].

[[VERIFY: recommended mounting-height range per model and coverage at each height — Mike Clifford]]

## Which Bromic heaters fit which setting?

| Heater | Coverage (approx.) | Mounting | Controls to specify |
|---|---|---|---|
| Platinum Smart-Heat Electric, 2300/3400/4500W | 65–143 ft² | Recessed, ceiling, wall | Affinity On/Off or Dimmer, wall switch, Smart-Heat app |
| Tungsten Smart-Heat Electric, Select and Coastal (coming soon) | 64–144 ft² | Recessed (low-clearance), ceiling, wall, single post | Affinity On/Off or Dimmer, wall switch, Smart-Heat app |
| Eclipse Smart-Heat Electric | 121 ft² | Single, double or curved pole | Eclipse controller, wall switch, Smart-Heat app |
| Tungsten Smart-Heat Freestanding Gas | 215 ft² | Freestanding | [[VERIFY: control options for Tungsten Freestanding Gas — Mike Clifford]] |

Source: Lookbook 2026[^s3]. Wi-Fi and app features require compatible Affinity Smart-Heat Controls, sold separately.

Controls are not a finish item. Commercial energy codes increasingly require them: Washington's commercial energy code, for example, requires heat outside a building to be radiant and to switch off automatically by occupancy sensor or timer[^s5]. Check the code in force on your project.

## Key takeaways

- Short wave: ~90% radiant, instant, best in wind. Long wave: ~40% radiant, ~5 min, most wind-sensitive[^s1].
- Outdoor means 30% or more of the perimeter permanently open; covers add a heat cloud[^s2].
- Intensity drops with distance; respect the 72 in wall and 96 in ceiling minimums and confirm per model[^s2].
- Size from the Lookbook coverage, then adjust for exposure, height and cover[^s3].
- Specify controls with every heater.

## FAQ

### Is short wave or long wave better for a patio?
For open or windy patios, short wave: about 90% of its output is radiant and it warms instantly. Long wave suits sheltered spaces where its larger convective share is not blown away[^s1].

### Do infrared heaters work in wind?
Radiant heat holds up in light to mild wind because it warms people and surfaces, not air[^s2]. Strong, constant wind reduces comfort with any heater; add screening on the windward side.

### Does a covered patio need fewer heaters?
Often, because the cover traps a heat cloud that adds convective warmth[^s2]. Confirm with a layout from Bromic's design team.

### How high should an outdoor heater be mounted?
No lower than Bromic's minimums of 72 in for wall mounts and 96 in for ceiling mounts, which vary with output[^s2]. Higher mounting spreads heat but lowers intensity. Check the installation manual for each model.

### Can I control outdoor heat with a thermostat?
Not meaningfully. Outdoors the air temperature is not the variable you control[^s2]. Use On/Off, Dimmer or scheduled control through Affinity Smart-Heat Controls.

The pro edition of the Planning Guide carries the full sizing method.
