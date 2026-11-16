---
id: A20
type: tool
title: "Kosten van propaan- en elektrische terrasverwarmers: uw vijf jaar naast elkaar"
audience: [COM]
stage: [CO]
cell: COM-CO
asset: A20
summary: "Zie vijf seizoenen terrasverwarming met elektriciteit, aardgas en propaan naast elkaar – van aanschaf en installatie tot energie en de personeelstijd die propaanflessen ongemerkt kosten."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Is elektrische of propaanterrasverwarming over vijf jaar goedkoper voor een restaurant?"
meta_description: "Propaan of elektrisch voor uw horecaterras: vijf jaar aanschaf, installatie, energie en het wisselen van gasflessen naast elkaar, samen met aardgas."
cta: {label: "Vraag uw ROI-analyse aan", asset: A21}
hero: l-013-111
owner_review: verkoop horeca + digitale marketing
status: draft
gated: true
related: [COM-CO-01, COM-CO-KB1, COM-IN-01]
updated: 2026-11-16
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

## Vijf seizoenen warme avonden, doorgerekend

Een verwarmd terras houdt uw gasten buiten, lang nadat de zon is ondergegaan, en de energiebron die u kiest bepaalt wat die avonden
door de jaren heen kosten. Met deze calculator vergelijkt een restaurant- of hotelexploitant vijf jaar terrasverwarming per
energiebron, op basis van vier snelle antwoorden: het aantal verwarmde plaatsen, hoe overdekt het terras is, hoe koud de avonden
zijn, en de regio (die de energieprijzen bepaalt), plus het aantal avonden per jaar en het aantal uren per avond.

Verwarmers worden gedimensioneerd volgens templates/calculation-model.md: ongeveer 1,9 m² per plaats; elektrische verwarming boven
de tafels op basis van oppervlak, met de factoren voor overkapping en klimaat; vrijstaande gasverwarmers voor maximaal vier plaatsen
per verwarmer. Het totaal per optie brengt aanschaf, installatie, onderhoud, energie en, bij propaan, de personeelstijd voor het
wisselen van flessen samen. De resultaatkaart toont de drie totalen, de energiekosten per dag en het oplopende totaal per jaar.

## Wat u ons vertelt

Verwarmde plaatsen · overkapping (open, deels overdekt, overdekt) · avonden (mild, koel, koud) · regio · avonden per jaar · uren per
avond. Onder "Uw eigen cijfers gebruiken" stelt u energieprijzen, het aantal verwarmers en aanschaf en installatie per verwarmer in.

## Wat u ontdekt

Op het scherm ziet u het totaal over vijf jaar per energiebron en welke het goedkoopst uitkomt. Als u uw gegevens deelt, voegt het
volledige rapport de tabel per jaar toe, de energieberekening en de verwarmers en bediening die voor elke optie zijn aangenomen.

## Het denkwerk achter de getallen

De energiekosten per uur worden eenvoudig berekend: elektrisch = kW × prijs per kWh; aardgas en propaan = vermogen in kW × prijs per
kWh gas, of het verbruik in m³ of kg × de prijs per m³ of kg. In de Amerikaanse versie komen de standaardprijzen van de
EIA[^s1][^s2][^s3] en wachten ze op bevestiging van de commerciële tarieven voor 2026 door financiën. In Nederland gebruikt de tool
de gemiddelde zakelijke prijzen voor elektriciteit en aardgas van Eurostat (excl. btw); voor propaan bestaat geen officiële zakelijke
prijs, dus die vult u zelf in. Er worden geen dollarbedragen omgerekend naar euro's. [[VERIFY: of de Nederlandse versie van de tool de Eurostat-prijzen uit data/regional-prices.json gebruikt en propaan in kg of liter vraagt — financiën]]
De personeelstijd rekent in de Amerikaanse versie met het mediane uurloon van het BLS[^s4]; in Nederland vult u uw eigen uurloon in.
[[VERIFY: standaarduurloon voor het wisselen van gasflessen in de Nederlandse versie — financiën]] **De standaardwaarden voor aanschaf
en installatie zijn plaatshouders, geen prijzen van Bromic**, en de pagina zegt dat ook. Elke waarde, bron en eigenaar staat in
`tools/A20-tco/README.md`.

## Waar uw aanvraag naartoe gaat

Afgeronde vergelijkingen komen binnen via het HubSpot-formulier met `asset_id=A20`, `matrix_cell=COM-CO` en de invoer als
`tool_inputs`. Een voltooide berekening scoort +15, en de volgende stap die we aanbieden is de ROI-calculator voor omzet (A21).
