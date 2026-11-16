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
summary: "De stroom achter een elektrische terrasverwarmer van 4500 W op 230 V, waarom een verwarmer als continue belasting telt en de grens op het typeplaatje, zodat de groep in één keer goed is."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Welke groep en installatieautomaat heeft een terrasverwarmer van 4500 W nodig?"
meta_description: "Een terrasverwarmer van 4500 W op 230 V trekt 19,6 A. Waarom dat een eigen, zwaardere groep vraagt, binnen het typeplaatje, volgens NEN 1010."
cta: {label: "Download de gids voor voorbekabeling", asset: A16}
hero: t-006-016
owner_review: verkoop vakhandel
status: draft
gated: false
related: [BLD-IN-01, BLD-IN-KB2]
updated: 2026-11-16
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

Een terrasverwarmer van 4500 W op 230 V trekt 19,6 A. Omdat een verwarmer een hele avond van drie uur of langer kan doorbranden, telt hij als continue belasting[^s2][^s3]. Een gangbare groep van 16 A is daarvoor te licht. Reken op een eigen, zwaardere groep, met beveiliging en kabeldoorsnede bepaald door de installateur volgens NEN 1010. De beveiliging moet in elk geval binnen het maximum blijven dat op het typeplaatje van de verwarmer staat[^s2].

*Alleen bedoeld als planningsrichtlijn. Stem af met een erkende installateur, de installatiehandleiding en uw gemeente.* [[VERIFY: groepsindeling en beveiliging voor 4500 W-verwarmers volgens de huidige NEN 1010 — Bromic Benelux distributor]]

## Zo bepaalt u de groep

Deel het vermogen van de verwarmer door de netspanning, dan weet u hoeveel stroom hij trekt.

| Platinum Smart-Heat Electric | Stroom op 230 V |
|---|---|
| 2300 W | 10,0 A |
| 3400 W | 14,8 A |
| 4500 W | 19,6 A |

In de VS telt de NEC een continue belasting voor 125% mee bij het kiezen van de automaat en de geleiders[^s2][^s3]. In Nederland bepaalt NEN 1010 de rekenregels; neem dus geen Amerikaanse automaatwaarden of draaddiktes over.

## Als de spanning op locatie afwijkt

Bestel een verwarmer die is uitgevoerd voor de netspanning op locatie, 230 V, 50 Hz [[VERIFY: 230 V-uitvoering van Platinum 4500 W voor de Nederlandse markt — productteam]]. Een verwarmer op een lagere spanning dan zijn nominale spanning trekt minder stroom, maar levert ook duidelijk minder vermogen. Dan blijft een terras op een koele avond net niet warm genoeg.

## Wat de groep verder bepaalt

- De beveiliging mag nooit hoger zijn dan het maximum op het typeplaatje van de verwarmer.
- Lange kabels kunnen vanwege spanningsverlies een grotere doorsnede vragen.
- Op een gedeelde groep telt u de stroom van alle verwarmers bij elkaar op; één verwarmer per groep houdt het eenvoudiger.
- De groep loopt via de Affinity Smart-Heat On/Off- of Dimmer-regelaar en een handmatige wandschakelaar[^s1]. Controleer daarom het maximale schakelvermogen van de regelaar [[VERIFY: maximale belasting Affinity-regelaar — productteam]].

## Voordat u gaat voorbekabelen

- Vermogen en spanning op het typeplaatje bevestigd.
- Stroom berekend op 230 V; groep en beveiliging door de installateur bepaald volgens NEN 1010.
- Beveiliging binnen het maximum op het typeplaatje.
- Kabeldoorsnede door de installateur bepaald op belastbaarheid en lengte.
- Regelaar en wandschakelaar op het groepenschema.

[^s1]: Bromic, Lookbook 2026.
[^s2]: EC&M, NEC-eisen voor apparaten (Article 422; Article 100, continue belasting).
[^s3]: EC&M, NEC-regels voor ruimteverwarming.
