---
id: A03
type: tool
title: "Hoeveel terrasverwarmers heeft je buitenruimte nodig? Rekenhulp"
audience: [RES]
stage: [CO]
cell: RES-CO
asset: A03
summary: "Vorm, afmetingen, overkapping, klimaat en een aangetikte verwarmer erin; een plattegrond op schaal, het aantal verwarmers, het passende model en de bediening die het aanstuurt eruit. Het volledige rapport krijg je na het invullen van het formulier."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Hoeveel buitenverwarmers heb ik nodig voor mijn terras?"
meta_description: "Vul de afmetingen, overkapping en het klimaat van je terras in. Zie hoeveel Bromic-verwarmers je nodig hebt, welke modellen passen en welke bediening erbij hoort."
cta: {label: "Plan een ontwerpgesprek", asset: A07}
hero: l-010-067
owner_review: Brian Kim + 454 Creative
status: draft
gated: true
related: [RES-PP-01, COM-IN-KB1, RES-CO-01]
updated: 2026-10-29
lang: nl
translation_of: A03
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Bromic Benelux distributor]]"
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

**Wat het doet.** Je kiest de vorm van de ruimte (rechthoek, L, U of binnenplaats, lang en smal, rond), stelt de afmetingen in,
geeft aan hoe overdekt hij is en hoe koud je avonden worden, en tikt dan een afbeelding van een verwarmer aan (of "Help me kiezen").
Elke verwarmerkaart toont direct zijn eigen aantal. Je krijgt een plattegrond op schaal te zien waarin het bereik van elke verwarmer
als een gloed is getekend, het aantal verwarmers, het model dat het best past en de bediening die het aanstuurt: een Affinity
Smart-Heat On/Off, Dimmer of Eclipse-regelaar, een wandschakelaar en de Bromic Smart-Heat app. Wifi- en app-functies werken alleen
met compatibele Affinity-bediening, die apart wordt verkocht.

**Invoer.** Vorm · zijden of diameter (m) · type verwarmer (afbeeldingskaarten) · overkapping: open, deels overdekt, overdekt ·
klimaat: mild, koel, koud · energiebron: elektrisch, gas, beide · stijl: inbouw, vrijstaand, beide · montagehoogte (m) · zones.

**Uitvoer.** Op het scherm: het aantal, het hoofdmodel en de bijbehorende bediening. Na het formulier: elk passend model, de
bediening bij elk model, de elektrische belasting en de aannames.

**Aannames.** Het verwarmd oppervlak per model komt uit de Lookbook 2026[^s1]. De factoren voor overkapping, klimaat en hoogte zijn
de richtlijnen van Bromic uit 2021, omgezet in getallen[^s2], en wachten op de goedkeuring van Mike Clifford. Een ruimte waarvan
minder dan 30% van de omtrek open is, gaat naar het ontwerpteam. Tungsten Coastal en Tungsten Select zijn binnenkort leverbaar en
tonen een bandbreedte, nooit één aantal. Elke waarde, de bron en de eigenaar: `tools/A03-sizing/README.md`.

**Waar de lead naartoe gaat.** Het HubSpot-formulier (`forms/hubspot-form-spec.md`) met `asset_id=A03`, `matrix_cell=RES-CO`, de
UTM-velden en de invoer van de rekenhulp als `tool_inputs`. Een ingevulde rekenhulp levert +15 punten op. De volgende stap die we
aanbieden is een ontwerpgesprek (A07).

Dit is een eerste schatting, geen ontwerp. Laat elke installatie controleren door je gemeente en een gekwalificeerde
elektrotechnisch installateur of gasinstallateur, volgens NEN 1010 (elektra) en NEN 1078 (gas).
[[VERIFY: current Dutch codes for outdoor heater installations — Bromic Benelux distributor]]
