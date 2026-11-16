---
id: A21
lang: nl
translation_of: A21
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Bromic Benelux distributor]]"
type: tool
title: "ROI van terrasverwarmers: ontdek wat uw verwarmde zitplaatsen waard zijn"
audience: [COM]
stage: [AW, IN]
cell: COM-IN
asset: A21
summary: "Elke avond dat uw terras warm blijft, is weer een avond met volle tafels. Zie welke omzet en marge verwarmde zitplaatsen kunnen toevoegen – op basis van zitplaatsen, tafelrondes, gemiddelde besteding en de extra avonden die verwarming mogelijk maakt – en hoe snel de installatiekosten zijn terugverdiend."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Hoe lang duurt het voordat een horecazaak terrasverwarmers heeft terugverdiend?"
meta_description: "ROI van terrasverwarmers voor uw horecazaak: schat de extra omzet van verwarmde plaatsen, de marge erop en in hoeveel maanden de verwarmers zijn terugverdiend."
cta: {label: "Boek een ontwerpadvies", asset: A07}
hero: p-003-006
owner_review: verkoop horeca + digitale marketing
status: draft
gated: true
related: [COM-IN-01, COM-AW-01, COM-CO-01]
updated: 2026-11-16
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Restaurant patio heater ROI: payback, worked example (COM-IN-01, draft)"
    year: 2026
    url: content/articles/COM-IN-01-patio-heater-roi-restaurant-payback.md
    supports: "Worked example and its assumptions: 40 seats × 1.5 turns × $45 × 60 nights × 50% capture = $81,000"
    verified: true
---

## Meer avonden met volle tafels

Als het terras warm blijft, worden de avonden die u vroeger aan de kou verloor avonden waarop uw gasten buiten kunnen blijven. Deze
calculator laat een horecaondernemer zien wat het verwarmen van het terras kan opleveren: de extra omzet van avonden waarop hij
eerder niemand buiten kon plaatsen, de marge daarop, en in hoeveel maanden de installatiekosten zijn terugverdiend.

U beantwoordt zeven vragen; wij bepalen de verwarmers op basis van het aantal zitplaatsen, en de elektriciteitsprijs komt uit de
regionale prijzen van de tool (voor Nederland een Eurostat-gemiddelde voor zakelijke afnemers; in de VS de staat, volgens de EIA).
[[VERIFY: Nederlandse elektriciteitsprijs in data/regional-prices.json — financiën]] De resultaatkaart toont een raster van
zitplaatsen, waar elke extra euro naartoe gaat, de kaspositie per maand met het break-evenpunt, en de terugverdientijd bij andere
bezettingsgraden.

## Wat u ons vertelt

Verwarmde zitplaatsen · gemiddelde besteding · tafelrondes per avond · dekkingsbijdrage in % · extra avonden per jaar · aandeel
bezette zitplaatsen · regio (elektriciteitsprijs). Onder "Gebruik uw eigen cijfers" stelt u de verwarmers in (bepaald op basis van
de zitplaatsen volgens templates/calculation-model.md), de installatiekosten per verwarmer (voorlopige waarde), de verwarmde uren
per avond en de elektriciteitsprijs.

## Wat u ontdekt

Op het scherm ziet u de extra omzet per jaar en de terugverdientijd in maanden. Als u uw gegevens deelt, voegt het volledige rapport
de marge toe, een gevoeligheidsanalyse en de verwarmers en bediening die de installatiekosten moeten dekken (Affinity
Smart-Heat-regelaar, wandschakelaar, app).

## Het denkwerk achter de getallen

Elke standaardwaarde is een illustratie en geen benchmark, gemarkeerd als [[VERIFY: benchmarks — verkoop horeca]] in de
configuratie. Het eerste testgeval is het rekenvoorbeeld in COM-IN-01[^s1]. Elke waarde, bron en eigenaar staat in
`tools/A21-roi/README.md`.

## Waar uw aanvraag naartoe gaat

Afgeronde schattingen komen binnen via het HubSpot-formulier met `asset_id=A21`, `matrix_cell=COM-IN` en de invoer als
`tool_inputs`. A21 wijst op een sterke koopintentie (+30), en de volgende stap die we aanbieden is een ontwerpadvies (A07).
