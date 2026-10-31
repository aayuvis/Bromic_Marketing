---
id: RES-IN-01
type: article
title: "Wat kost het om een buitenverwarmer te laten branden? Verbruik per uur voor elektriciteit, aardgas en propaan"
audience: [RES]
stage: [IN]
cell: RES-IN
asset: A24
summary: "Het energieverbruik per uur van elektrische en gasverwarmers van Bromic, met de formules om de kosten met je eigen energierekening uit te rekenen, een Amerikaans rekenvoorbeeld, en de andere posten in een totaalbudget."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Hoeveel kost het per uur om een terrasverwarmer te laten branden?"
meta_description: "Een elektrische terrasverwarmer van 3400 W verbruikt 3,4 kWh per uur; een gasverwarmer van 11,1 kW ongeveer 11 kWh aan aardgas of 0,8 kg propaan. Zo reken je de kosten uit."
cta: {label: "Download de planningsgids", asset: A02}
hero: l-010-067
images: [l-019-160]
owner_review: Megan Spies
status: draft
gated: false
related: [RES-CO-01, RES-PP-01, COM-CO-01, BLD-IN-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: U.S. Energy Information Administration
    title: "Electric Power Monthly, Table 5.6.A — Average price of electricity to ultimate customers, residential (July 2026 data, as reported by ElectricRates.org and Cronista)"
    year: 2026
    url: https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a
    supports: "US average residential electricity price 18.3 ¢/kWh, July 2026"
    verified: false
  - id: s2
    publisher: U.S. Energy Information Administration
    title: "Natural Gas Prices — US residential price, monthly"
    year: 2026
    url: https://www.eia.gov/dnav/ng/ng_pri_sum_dcu_nus_m.htm
    supports: "US residential natural gas price $26.45 per thousand cubic feet (latest month shown, July 2026)"
    verified: true
  - id: s3
    publisher: U.S. Energy Information Administration (via YCharts)
    title: "US Natural Gas Residential Price, monthly"
    year: 2025
    url: https://ycharts.com/indicators/us_natural_gas_residential_price
    supports: "US residential natural gas price $19.61 per thousand cubic feet, October 2025"
    verified: true
  - id: s4
    publisher: U.S. Energy Information Administration
    title: "FAQ: How do I convert natural gas prices in dollars per cubic feet to dollars per Btu or therm?"
    year: 2026
    url: https://www.eia.gov/tools/faqs/faq.php?id=45&t=8
    supports: "2025 average heat content about 1,037 Btu per cubic foot: 1 Mcf = 10.37 therms; $/Mcf ÷ 10.37 = $/therm"
    verified: true
  - id: s5
    publisher: U.S. Energy Information Administration
    title: "Heating Oil and Propane Update — weekly residential propane price"
    year: 2026
    url: https://www.eia.gov/petroleum/heatingoilpropane/
    supports: "US average residential propane price about $2.67 per gallon, week of 30 March 2026"
    verified: true
  - id: s6
    publisher: Bromic Heating
    title: "Outdoor Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Platinum 2300/3400/4500 W; Eclipse output steps 33/66/100%; Tungsten Freestanding Gas 38,000 BTU, approx. 215 ft²; controls"
    verified: true
  - id: s7
    publisher: Bromic Heating
    title: "Official Outdoor Heating Planning Guide (US) v1.2"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "An all-in quote includes hardware, utilities, permit fees and installation"
    verified: true
lang: nl
translation_of: RES-IN-01
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Bromic Benelux distributor]]"
---

Een ingebouwde elektrische terrasverwarmer verbruikt op vol vermogen 2,3 tot 4,5 kWh per uur, afhankelijk van het vermogen. Een gasverwarmer van 11,1 kW verbruikt per uur ongeveer 11 kWh aan aardgas, of ongeveer 0,8 kg propaan. Wat dat kost, bepaalt je eigen energierekening: hieronder staan de formules, vul je eigen tarief in en je hebt het bedrag. Ter vergelijking staat er een Amerikaans rekenvoorbeeld bij, met Amerikaanse gemiddelde tarieven: daar kost een elektrische verwarmer ongeveer $0,42–$0,82 per uur. [[VERIFY: 2026 rates — Brian Kim/Finance]]

## Wat verbruikt elke verwarmer per uur?

De gebruikskosten zijn de energie die per uur wordt verbruikt, maal de prijs van die energie.

| Verwarmer | Vermogen | Verbruik per uur (vol vermogen) | Kosten per uur |
|---|---|---|---|
| Platinum Smart-Heat Electric 2300 W | 2,3 kW[^s6] | 2,3 kWh | 2,3 × je prijs per kWh |
| Platinum Smart-Heat Electric 3400 W | 3,4 kW[^s6] | 3,4 kWh | 3,4 × je prijs per kWh |
| Platinum Smart-Heat Electric 4500 W | 4,5 kW[^s6] | 4,5 kWh | 4,5 × je prijs per kWh |
| Eclipse Smart-Heat Electric | [[VERIFY: wattage — Mike Clifford]] | kW × 1 uur | kW × je prijs per kWh |
| Tungsten Smart-Heat Freestanding Gas, aardgas | ca. 11,1 kW[^s6] | ca. 11,1 kWh aan gas | kWh ÷ energie-inhoud per m³ × je prijs per m³ |
| Tungsten Smart-Heat Freestanding Gas, propaan | ca. 11,1 kW[^s6] | ca. 0,8 kg (ca. 1,6 liter) | 0,8 × je prijs per kg |

[[VERIFY: bevestigen dat 11,1 kW (38.000 BTU/h) de belasting is waarmee het brandstofverbruik wordt berekend — Mike Clifford]]

### Amerikaans rekenvoorbeeld

Met de meest recente Amerikaanse gemiddelden die we konden vinden, komen die verbruiken op de volgende bedragen in dollars. Het zijn Amerikaanse cijfers; ze zijn niet omgerekend naar euro's en zeggen niets over Nederlandse tarieven.

- **Elektriciteit:** 18,3 dollarcent per kWh, Amerikaans gemiddelde voor huishoudens in juli 2026.[^s1]
- **Aardgas:** $19,61 per duizend kubieke voet (Mcf) in oktober 2025, een tussenseizoensmaand, en $26,45 per Mcf in juli 2026.[^s3][^s2] Gasprijzen voor huishoudens schommelen in de VS met het seizoen, daarom staan ze er allebei.
- **Propaan:** $2,67 per gallon, Amerikaans gemiddelde voor huishoudens, week van 30 maart 2026.[^s5]

| Verwarmer | Kosten per uur in de VS (vol vermogen) |
|---|---|
| Platinum Smart-Heat Electric 2300 W | **$0,42** |
| Platinum Smart-Heat Electric 3400 W | **$0,62** |
| Platinum Smart-Heat Electric 4500 W | **$0,82** |
| Tungsten Smart-Heat Freestanding Gas, aardgas | **$0,72–$0,97** |
| Tungsten Smart-Heat Freestanding Gas, propaan | **$1,11** |

Tarieven: Amerikaanse landelijke gemiddelden; per staat en energiebedrijf lopen ze sterk uiteen. Voor de omrekening van Amerikaanse gasprijzen gebruikt de EIA een energie-inhoud van ongeveer 10,37 therm per Mcf.[^s4]

## Hoe reken ik het uit met mijn eigen energierekening?

Drie formules, één per energiebron.

**Elektrisch:** kosten per uur = vermogen in kW × je prijs per kWh
- 3400 W = 3,4 kW. Bij een prijs per kWh van P kost een uur dus 3,4 × P.

**Aardgas:** kosten per uur = vermogen in kW ÷ energie-inhoud van je gas in kWh per m³ × je prijs per m³
- Op een Nederlandse energierekening staat gas in m³. Reken het vermogen van de verwarmer eerst om naar m³ per uur met de energie-inhoud van het gas, en vermenigvuldig dan met je prijs per m³. [[VERIFY: omrekenfactor kWh per m³ voor Nederlands aardgas — Brian Kim/Finance]]
- Een gasverwarmer van 11,1 kW verbruikt per uur ongeveer 11,1 kWh aan gas.

**Propaan:** kosten per uur = vermogen in kW ÷ 14 kWh per kg × je prijs per kg
- 11,1 ÷ 14 = ongeveer 0,8 kg per uur. Koop je propaan per fles, deel dan de flesprijs door het aantal kilo's in de fles. [[VERIFY: energie-inhoud van ongeveer 14 kWh per kg propaan, omgerekend uit de Amerikaanse bronnen — Mike Clifford]]

## Wat betekent dat over een seizoen?

Het aantal uren telt zwaarder dan het tarief. Neem een huishouden dat het terras drie uur per avond verwarmt, 100 avonden per jaar: 300 uur.

| Opstelling | Berekening | Verbruik per seizoen | In het Amerikaanse voorbeeld |
|---|---|---|---|
| Twee Platinum 3400 W (overdekt terras) | 6,8 kW × 300 uur | ca. 2040 kWh × je prijs per kWh | ongeveer $373 |
| Eén Tungsten Freestanding Gas, aardgas | 11,1 kW × 300 uur | ca. 3330 kWh aan gas | ongeveer $216 |
| Eén Tungsten Freestanding Gas, propaan | 0,8 kg × 300 uur | ca. 240 kg propaan × je prijs per kg | ongeveer $333 |

Dit zijn cijfers voor vol vermogen, elke minuut. In de praktijk dalen de kosten wanneer de warmte op de behoefte wordt afgestemd:

- **Zet hem lager.** De Eclipse werkt op 33%, 66% of 100% van het vermogen; met een Dimmer-regelaar laat je elektrische verwarmers onder vol vermogen werken.[^s6] [[VERIFY: power draw at reduced output is proportional to setting — Mike Clifford]]
- **Plan hem in.** De Bromic Smart-Heat app stelt schema's en timers in, zodat de warmte alleen aanstaat als er mensen buiten zijn; daarvoor zijn compatibele Affinity Smart-Heat Controls nodig, die apart worden verkocht.[^s6]
- **Werk met zones.** Verwarm de eethoek zonder de loungehoek.

![Overdekt zwembadterras bij nacht met een vrijstaande gasverwarmer](img:l-019-160)

## Wat hoort er nog meer in het totaalbudget?

Op de eerste dag zijn de gebruikskosten de kleinste post. Het advies in de planningsgids van Bromic is om de hele klus vooraf te begroten: apparatuur, aansluitingen, leges en installatie.[^s7]

| Post | Wat het bepaalt | Indicatie |
|---|---|---|
| Verwarmers | Model, vermogen, afwerking, aantal | [[VERIFY: adviesprijs 2026 per model voor Nederland — Brian Kim]] |
| Bediening (verplicht) | Affinity On/Off-, Dimmer- of Eclipse-regelaar, of wandschakelaar; app en spraakbediening vragen compatibele Affinity-bediening, die apart wordt verkocht[^s6] | [[VERIFY: adviesprijs bediening — Brian Kim]] |
| Montageaccessoires | Inbouwkits, pendels (elektrisch); warmtedeflectors, plafondpendels (gas)[^s7] | [[VERIFY: adviesprijs accessoires — Brian Kim]] |
| Elektrisch werk | Nieuwe groepen, afstand tot de meterkast, capaciteit van de meterkast, open of afgewerkte plafonds | Offerte van een vakbekwaam elektrotechnisch installateur |
| Gaswerk | Leidingtracé, fittingen, of propaanvoorziening | Offerte van een vakbekwaam gasinstallateur |
| Vergunningen | Gemeente | Vraag na bij je gemeente |
| Gebruikskosten | Uren × vermogen × tarief | Tabel hierboven |

Elektrisch werk en gaswerk die je laat doen terwijl wanden en plafonds nog open zijn, kosten minder dan achteraf aanpassen in een afgewerkte ruimte. Dat is het sterkste argument om warmte in het eerste budget op te nemen: vanaf het begin ontworpen, niet later toegevoegd.

## Checklist voor de planning

- Zoek je tarieven op je laatste energierekening: prijs per kWh, prijs per m³ gas, prijs per kg propaan (of per fles).
- Bepaal hoeveel uur je hem echt gaat gebruiken: avonden per jaar × uren per avond.
- Stem het aantal verwarmers af op de zitplekken ([elektrisch of gas](item:RES-CO-01) heeft een snelle methode).
- Neem de bediening op in de post apparatuur: die hoort bij een werkend systeem.
- Vraag offertes voor elektrisch werk, gaswerk en vergunningen aan voordat je het ontwerp van je terras vastlegt.
- Vraag de eisen na bij je gemeente en bij een vakbekwaam elektrotechnisch installateur of gasinstallateur (NEN 1010 voor elektrisch, NEN 1078 voor gas).

## FAQ

### Is een elektrische of een gasterrasverwarmer goedkoper in gebruik?
Dat hangt af van je eigen prijs per kWh, per m³ en per kg. In het Amerikaanse voorbeeld kost een elektrische verwarmer van 3400 W per uur minder ($0,62) dan de gasverwarmer ($0,72–$0,97 op aardgas, $1,11 op propaan). Maar één gasverwarmer verwarmt ongeveer 20 m², tegenover ongeveer 6–13 m² voor één Platinum, dus vergelijk wat het kost om je zitgedeelte warm te krijgen, niet één verwarmer.[^s6] Gebruik de formules met je eigen tarieven.

### Hoeveel kost een terrasverwarmer van 3400 W per uur?
Hij verbruikt 3,4 kWh per uur: 3,4 × je prijs per kWh. In de VS was dat bij het gemiddelde voor huishoudens van juli 2026 (18,3 dollarcent per kWh) ongeveer $0,62.[^s1]

### Hoeveel propaan verbruikt een gasverwarmer van 11,1 kW?
Ongeveer 0,8 kg (ongeveer 1,6 liter) per uur op vol vermogen. In de VS kwam dat bij $2,67 per gallon neer op ongeveer $1,11 per uur.[^s5]

### Waarom verandert mijn gasprijs zo sterk?
Gasprijzen voor huishoudens verschillen per periode. In de VS lag het EIA-cijfer voor juli 2026 ($26,45 per Mcf) ruim boven dat van oktober 2025 ($19,61 per Mcf).[^s2][^s3] Gebruik het tarief dat geldt in het seizoen waarin je verwarmt.

### Bespaart het dimmen van een elektrische verwarmer geld?
Een lager vermogen verbruikt minder energie. De Eclipse schakelt tussen 33%, 66% en 100%.[^s6] [[VERIFY: draw at each step — Mike Clifford]]

### Kan ik de kosten inschatten voordat ik koop?
Ja. De planningsgids van Bromic loopt stap voor stap door de dimensionering, de aansluitingen en een totaalbudget.

Krijg het hele budget in beeld voordat je met een dealer praat: download de planningsgids van Bromic.
