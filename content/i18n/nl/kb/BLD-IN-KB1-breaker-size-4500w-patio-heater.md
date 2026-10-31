---
id: BLD-IN-KB1
lang: nl
translation_of: BLD-IN-KB1
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Bromic Benelux distributor]]"
type: kb
title: "Welke groep en installatieautomaat heeft een terrasverwarmer van 4500 W nodig?"
audience: [BLD]
stage: [IN]
cell: BLD-IN
asset: A16
summary: "De stroomberekening voor een elektrische terrasverwarmer van 4500 W op 230 V, waarom een verwarmer als continue belasting telt, en de grens op het typeplaatje."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Welke groep en installatieautomaat heeft een terrasverwarmer van 4500 W nodig?"
meta_description: "Een verwarmer van 4500 W op 230 V trekt 19,6 A. Waarom dat een eigen, zwaardere groep vraagt, binnen het maximum op het typeplaatje, volgens NEN 1010."
cta: {label: "Download de gids voor voorbekabeling", asset: A16}
hero: t-006-016
owner_review: Arvin Avaness
status: draft
gated: false
related: [BLD-IN-01, BLD-IN-KB2]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Platinum Smart-Heat Electric available in 4500 W; Affinity Smart-Heat Controls"
    verified: true
  - id: s2
    publisher: EC&M
    title: "Understanding requirements for appliances (NEC Article 422)"
    year: 2020
    url: https://www.ecmweb.com/code-basics/understanding-requirements-appliances
    supports: "Continuous load = 3 hours or more; branch circuit at not less than 125% of marked rating; OCPD not to exceed appliance marking (422.11(A))"
    verified: true
  - id: s3
    publisher: EC&M
    title: "Don't get burned by the NEC's space-heating equipment rules"
    year: 2020
    url: https://www.ecmweb.com/national-electrical-code/code-basics/article/20901105/dont-get-burned-by-the-necs-space-heating-equipment-rules
    supports: "Fixed electric space-heating branch-circuit conductors and overcurrent devices at not less than 125% of the load"
    verified: true
---

Een terrasverwarmer van 4500 W op 230 V trekt 19,6 A. Een verwarmer kan drie uur of langer achter elkaar branden en telt daarom als continue belasting[^s2][^s3]. Een gangbare groep van 16 A is daarvoor te licht: reken op een eigen, zwaardere groep, met beveiliging en kabeldoorsnede bepaald door de installateur volgens NEN 1010. De beveiliging mag in elk geval niet hoger zijn dan het maximum op het typeplaatje van de verwarmer[^s2].

*Alleen bedoeld als planningsrichtlijn. Stem af met een erkende installateur, de installatiehandleiding en uw gemeente.* [[VERIFY: groepsindeling en beveiliging voor 4500 W-verwarmers volgens de huidige NEN 1010 — Bromic Benelux distributor]]

## Hoe wordt het berekend?

Stroom = watt ÷ volt.

| Platinum Smart-Heat Electric | Stroom op 230 V |
|---|---|
| 2300 W | 10,0 A |
| 3400 W | 14,8 A |
| 4500 W | 19,6 A |

In de VS telt de NEC een continue belasting voor 125% mee bij het kiezen van de automaat en de geleiders[^s2][^s3]. Voor Nederland bepaalt NEN 1010 de rekenregels; neem geen Amerikaanse automaatwaarden of draaddiktes over.

## Wat als de spanning op locatie afwijkt?

Bestel een verwarmer die is uitgevoerd voor de netspanning op locatie, 230 V, 50 Hz [[VERIFY: 230 V-uitvoering van Platinum 4500 W voor de Nederlandse markt — Mike Clifford]]. Een verwarmer op een lagere spanning dan zijn nominale spanning trekt minder stroom, maar levert ook duidelijk minder vermogen. Zo krijg je makkelijk een verwarmer die nooit warm genoeg aanvoelt.

## Wat bepaalt verder de groep?

- **Maximum op het typeplaatje.** De beveiliging mag daar niet boven komen.
- **Kabellengte.** Lange kabels kunnen vanwege spanningsverlies een grotere doorsnede vragen.
- **Gedeelde groepen.** Tel de stroom van alle verwarmers op de groep bij elkaar op. Eén verwarmer per groep is eenvoudiger.
- **Bediening.** De groep loopt via de Affinity Smart-Heat On/Off- of Dimmer-regelaar en een handmatige wandschakelaar[^s1]; controleer het maximale schakelvermogen van de regelaar [[VERIFY: maximale belasting Affinity-regelaar — Mike Clifford]].

## Checklist

- Vermogen en spanning op het typeplaatje bevestigd.
- Stroom berekend op 230 V; groep en beveiliging door de installateur bepaald volgens NEN 1010.
- Beveiliging binnen het maximum op het typeplaatje.
- Kabeldoorsnede door de installateur bepaald op belastbaarheid en lengte.
- Regelaar en wandschakelaar op het groepenschema.

[^s1]: Bromic, Lookbook 2026.
[^s2]: EC&M, NEC-eisen voor apparaten (Article 422; Article 100, continue belasting).
[^s3]: EC&M, NEC-regels voor ruimteverwarming.
