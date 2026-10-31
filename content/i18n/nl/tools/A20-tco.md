---
id: A20
type: tool
title: "Kosten van terrasverwarming over vijf jaar: elektrisch, aardgas en propaan"
audience: [COM]
stage: [CO]
cell: COM-CO
asset: A20
summary: "Zet elektrische, aardgas- en propaanterrasverwarming over vijf jaar naast elkaar: aanschaf, installatie, energie en de personeelstijd die het wisselen van propaanflessen kost."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Is elektrische of propaanterrasverwarming over vijf jaar goedkoper voor een restaurant?"
meta_description: "Vergelijk de kosten over vijf jaar van elektrische, aardgas- en propaanterrasverwarmers voor een restaurant: aanschaf, installatie, energie en het wisselen van gasflessen."
cta: {label: "Vraag uw ROI-analyse aan", asset: A21}
hero: l-013-111
owner_review: Blake Petty + Brian Kim
status: draft
gated: true
related: [COM-CO-01, COM-CO-KB1, COM-IN-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: US Energy Information Administration
    title: "Electric Power Monthly, Table 5.6.A — average price of electricity to ultimate customers"
    year: 2026
    url: https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a
    supports: "Commercial electricity price default ($/kWh)"
    verified: false
  - id: s2
    publisher: US Energy Information Administration
    title: "Natural Gas Prices — commercial"
    year: 2026
    url: https://www.eia.gov/dnav/ng/ng_pri_sum_dcu_nus_m.htm
    supports: "Commercial natural gas price default, converted to $/therm"
    verified: false
  - id: s3
    publisher: US Energy Information Administration
    title: "Heating Oil and Propane Update"
    year: 2026
    url: https://www.eia.gov/petroleum/heatingoilpropane/
    supports: "Propane price default ($/gal, residential series; commercial runs differently)"
    verified: false
  - id: s4
    publisher: US Bureau of Labor Statistics via O*NET OnLine
    title: "Occupational Employment and Wage Statistics, 35-9011"
    year: 2024
    url: https://www.onetonline.org/link/localwages/35-9011.00
    supports: "Hourly wage used to cost propane cylinder exchanges"
    verified: true
lang: nl
translation_of: A20
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Bromic Benelux distributor]]"
---
**Wat het doet.** Een restaurant- of hotelexploitant vergelijkt vijf jaar terrasverwarming per energiebron, op basis van vier snelle antwoorden: het aantal verwarmde plaatsen, hoe overdekt het terras is, hoe koud de avonden zijn, en de regio (die de energieprijzen bepaalt), plus het aantal avonden per jaar en het aantal uren per avond. Verwarmers worden gedimensioneerd volgens templates/calculation-model.md: ongeveer 1,9 m² per plaats; elektrische verwarming boven de tafels op basis van oppervlak, met de factoren voor overkapping en klimaat; vrijstaande gasverwarmers voor maximaal vier plaatsen per verwarmer. Het totaal per optie bestaat uit aanschaf, installatie, onderhoud, energie en, bij propaan, de personeelstijd voor het wisselen van flessen. De resultaatkaart toont de drie totalen, de energiekosten per dag en het oplopende totaal per jaar.

**Invoer.** Verwarmde plaatsen · overkapping (open, deels overdekt, overdekt) · avonden (mild, koel, koud) · regio · avonden per jaar · uren per avond. Onder "Uw eigen cijfers gebruiken": energieprijzen, aantal verwarmers, aanschaf en installatie per verwarmer.

**Uitvoer.** Op het scherm: het totaal over vijf jaar per energiebron en de goedkoopste. Achter het formulier: de tabel per jaar, de energieberekening en de verwarmers en bediening die voor elke optie zijn aangenomen.

**Aannames.** Energiekosten per uur: elektrisch = kW × prijs per kWh; aardgas en propaan = vermogen in kW × prijs per kWh gas, of het verbruik in m³ of kg × de prijs per m³ of kg. In de Amerikaanse versie komen de standaardprijzen van de EIA[^s1][^s2][^s3] en wachten ze op bevestiging van de commerciële tarieven voor 2026 door Finance. In Nederland gebruikt de tool de gemiddelde zakelijke prijzen voor elektriciteit en aardgas van Eurostat (excl. btw); voor propaan bestaat geen officiële zakelijke prijs, dus die vult u zelf in. Er worden geen dollarbedragen omgerekend naar euro's. [[VERIFY: of de Nederlandse versie van de tool de Eurostat-prijzen uit data/regional-prices.json gebruikt en propaan in kg of liter vraagt — Brian Kim/Finance]] De personeelstijd rekent in de Amerikaanse versie met het mediane uurloon van het BLS[^s4]; in Nederland vult u uw eigen uurloon in. [[VERIFY: standaarduurloon voor het wisselen van gasflessen in de Nederlandse versie — Brian Kim/Finance]] **De standaardwaarden voor aanschaf en installatie zijn plaatshouders, geen prijzen van Bromic**, en de pagina zegt dat ook. Elke waarde, bron en eigenaar: `tools/A20-tco/README.md`.

**Waar de lead naartoe gaat.** Het HubSpot-formulier met `asset_id=A20`, `matrix_cell=COM-CO` en de invoer als `tool_inputs`. Een voltooide berekening scoort +15. De volgende stap die wordt aangeboden is de ROI-calculator voor omzet (A21).
