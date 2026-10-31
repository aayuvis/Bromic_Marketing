---
id: A21
lang: nl
translation_of: A21
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Bromic Benelux distributor]]"
type: tool
title: "ROI-calculator voor terrasomzet: wat verwarmde zitplaatsen waard zijn"
audience: [COM]
stage: [AW, IN]
cell: COM-IN
asset: A21
summary: "Verwarmde zitplaatsen × tafelrondes × gemiddelde besteding × de extra avonden die verwarming mogelijk maakt, tegen de bezetting die u verwacht: extra omzet, extra marge en terugverdientijd van de installatiekosten."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Hoe lang duurt het voordat een horecazaak terrasverwarmers heeft terugverdiend?"
meta_description: "Schat hoeveel omzet verwarmde terrasplaatsen opleveren, welke marge ze verdienen en in hoeveel maanden terrasverwarmers zijn terugverdiend."
cta: {label: "Boek een ontwerpadvies", asset: A07}
hero: p-003-006
owner_review: Blake Petty + Brian Kim
status: draft
gated: true
related: [COM-IN-01, COM-AW-01, COM-CO-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Restaurant patio heater ROI: payback, worked example (COM-IN-01, draft)"
    year: 2026
    url: content/articles/COM-IN-01-patio-heater-roi-restaurant-payback.md
    supports: "Worked example and its assumptions: 40 seats × 1.5 turns × $45 × 60 nights × 50% capture = $81,000"
    verified: true
---

**Wat de tool doet.** Een horecaondernemer ziet wat het verwarmen van het terras kan opleveren: de extra omzet van avonden waarop hij eerder niemand buiten kon plaatsen, de marge daarop, en in hoeveel maanden de installatiekosten zijn terugverdiend. Zeven invoervelden; de verwarmers worden bepaald op basis van het aantal zitplaatsen en de elektriciteitsprijs komt uit de regionale prijzen van de tool (voor Nederland een Eurostat-gemiddelde voor zakelijke afnemers; in de VS de staat, volgens de EIA). [[VERIFY: Nederlandse elektriciteitsprijs in data/regional-prices.json — Brian Kim/Finance]] De resultaatkaart toont een raster van zitplaatsen, waar elke extra euro naartoe gaat, de kaspositie per maand met het break-evenpunt, en de terugverdientijd bij andere bezettingsgraden.

**Invoer.** Verwarmde zitplaatsen · gemiddelde besteding · tafelrondes per avond · dekkingsbijdrage in % · extra avonden per jaar · aandeel bezette zitplaatsen · regio (elektriciteitsprijs). Onder "Gebruik uw eigen cijfers": verwarmers (bepaald op basis van de zitplaatsen volgens templates/calculation-model.md), installatiekosten per verwarmer (voorlopige waarde), verwarmde uren per avond, elektriciteitsprijs.

**Uitkomsten.** Op het scherm: extra omzet per jaar en terugverdientijd in maanden. Achter het formulier: marge, een gevoeligheidsanalyse en de verwarmers en bediening die de installatiekosten moeten dekken (Affinity Smart-Heat-regelaar, wandschakelaar, app).

**Aannames.** Elke standaardwaarde is een illustratie, geen benchmark, gemarkeerd als [[VERIFY: benchmarks — Blake Petty]] in de configuratie. Het eerste testgeval is het rekenvoorbeeld in COM-IN-01[^s1]. Elke waarde, bron en eigenaar: `tools/A21-roi/README.md`.

**Waar de lead naartoe gaat.** Het HubSpot-formulier met `asset_id=A21`, `matrix_cell=COM-IN` en de invoer als `tool_inputs`. A21 is een intent-asset (+30). De volgende stap die wordt aangeboden is een ontwerpadvies (A07).
