---
id: ARC-BY-01
lang: nl
translation_of: ARC-BY-01
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Bromic Benelux distributor]]"
type: article
title: "Indieningsstukken voor buitenverwarmers: een coördinatiechecklist voor architecten"
audience: [ARC]
stage: [BY]
cell: ARC-BY
asset: A24
summary: "Wat een volledig pakket indieningsstukken voor buitenverwarmers bevat, en de afstemming van groepen, timmerwerk, afstanden en bediening die vragen en meerwerk van de bouwplaats houdt."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Wat hoort er in een pakket indieningsstukken voor buitenverwarmers?"
meta_description: "Checklist voor architecten bij buitenverwarmers: productgegevens, groepen, beveiliging, leidingen, inbouwopeningen, afstanden, bekabeling van de bediening en afstemming met NEN 1010."
cta: {label: "Boek een ontwerpadvies", asset: A07}
hero: l-010-076
images: [l-007-035]
owner_review: Shaughn Ritchie
status: draft
gated: false
related: [ARC-IN-01, BLD-IN-01, ARC-IN-KB1, ARC-BY-KB1]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Outdoor Heating Planning Guide v1.2, Steps 06–08 and design support"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "NFPA 70 / NFPA 54; wall ≥72 in, ceiling ≥96 in, varies with output; certification marks; recess kits, suspension poles, deflectors; commercial supply 208/240/277V; include hardware, utilities and permit fees in pricing"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Product range, coverage, mounting; Affinity controls, app, integrations and compatibility caveat; complimentary design service"
    verified: true
  - id: s3
    publisher: EC&M (Electrical Construction & Maintenance)
    title: "Article 424: Fixed electric space heating (code basics)"
    year: 2020
    url: https://www.ecmweb.com/code-basics/article-424-fixed-electric-space-heating
    supports: "NEC 424 scope: fixed electric space-heating equipment; conductors sized at not less than 125% of load (424.4(B), 2020 NEC); fossil-fuel heating equipment wiring sits in 422.12"
    verified: true
  - id: s4
    publisher: National Fire Protection Association
    title: "NFPA 70, National Electrical Code"
    year: 2023
    url: https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70
    supports: "Primary code text for Articles 422 and 424"
    verified: false
---

Een volledig pakket indieningsstukken voor buitenverwarmers bevat productgegevens en de installatiehandleiding, een indeling van het verwarmde oppervlak, de elektrische belasting per verwarmer met een overzicht van groepen en beveiliging, inbouw- of montagedetails met timmermaten, afstandsgegevens, een bedieningsschema dat laat zien wie wat bekabelt, en keurmerken. Toets het aan drie vragen: heeft elke verwarmer een eigen, goed gedimensioneerde groep; staan de opening en het regelwerk in de constructietekeningen; en heeft elk bedieningsonderdeel een kabel, een plek en een verantwoordelijke.

![Witte verwarmer tussen de lamellen van een pergola](img:l-010-076)

## Wat hoort er in een pakket indieningsstukken voor buitenverwarmers?

| Onderdeel | Wat u controleert | Afstemmen met |
|---|---|---|
| Productblad per model | Vermogen, spanning, stroom, afwerking en uitvoering komen overeen met het bestek | Bestekhoofdstuk verwarming (in de VS MasterFormat 23 83 33) |
| Installatiehandleiding (actuele editie) | Montagehoogtes, afstanden, eisen voor inbouw | Aannemer, bevoegd gezag |
| Indeling verwarmd oppervlak | Posities van de verwarmers op plafondplan en plattegrond; montagehoogtes in doorsnede | Ontwerpintentie, verlichtingsplan |
| Elektrisch overzicht | Belasting per verwarmer, groep, beveiliging, geleider, werkschakelaar | Elektrotechnisch adviseur |
| Inbouwset of montageaccessoire | Uitsparing, diepte van de plafondruimte, timmerwerk, regelwerk, afwerkrand | Constructie, plafondmonteur |
| Bedieningsschema | Type en plek van de regelaar, leidingen op laag- of netspanning, netwerk | Installateur, AV-/domotica-integrator |
| Keurmerken | Intertek-, UL- of CSA-markering op elk toestel (Amerikaanse uitvoering)[^s1] | Bevoegd gezag |
| Garantie en beheer en onderhoud | Voorwaarden, reiniging, instellen van de app | Opdrachtgever |

[[VERIFY: elektrische gegevens per model (stroom bij 230 V voor de Europese uitvoering), maten van de inbouwsets en afstandentabellen om bij de indieningsstukken te voegen — Mike Clifford]] [[VERIFY: CE-markering en Europese keuringen per model — Mike Clifford]]

## Hoe stemt u de groepen voor de verwarmers af?

In de VS geldt elke vast aangesloten elektrische verwarmer als continue belasting: de NEC-regels voor vaste elektrische ruimteverwarming dimensioneren de geleiders van de eindgroep op ten minste 125% van de belasting[^s3], en de elektrotechnisch adviseur bepaalt daar welk artikel van toepassing is (Article 424 voor vaste ruimteverwarming of Article 422 voor toestellen)[^s3][^s4]. In Nederland legt de elektrotechnisch adviseur de groepen vast volgens NEN 1010 en neemt ze op in de groepenverklaring. [[VERIFY: hoe NEN 1010 vaste buitenverwarming behandelt — Bromic Benelux distributor]]

Punten die vragen van de aannemer opleveren als ze open blijven:

- **Spanning.** Voor zakelijke projecten in de VS noemt Bromic voedingsopties van 208 V, 240 V en 277 V[^s1]; in Nederland is de netspanning 230 V. Bevestig de aansluiting van het gebouw en de spanning van het model samen; een verwarmer die voor een hogere spanning is gebouwd, levert op een lagere spanning minder vermogen. [[VERIFY: vermogen en verwarmd oppervlak per model bij 230 V — Mike Clifford]]
- **Eigen beveiliging.** Toon één groep per verwarmer, of een groepering die de handleiding toestaat, met de waarde van de beveiliging in het overzicht.
- **Werkschakelaar.** Plaats de scheidingsvoorziening waar de norm en de handleiding dat voorschrijven, zichtbaar op de tekeningen. [[VERIFY: eisen aan de scheidingsvoorziening voor vaste ruimteverwarming onder NEN 1010 — elektrotechnisch adviseur]]
- **Leidingen en dozen.** Leg de leidingen in het overstek of de balk voordat het plafond dichtgaat. Gebruik leidingsystemen en dozen die geschikt zijn voor vochtige of natte ruimten, afhankelijk van de blootstelling.
- **Aardlekbeveiliging.** Bevestig de eisen voor aardlekbeveiliging volgens NEN 1010. [[VERIFY: eisen aan aardlekbeveiliging voor vast aangesloten buitenverwarmers volgens NEN 1010 — elektrotechnisch adviseur]]

## Welk timmerwerk vraagt een ingebouwde verwarmer?

Met inbouwsets worden Platinum- en Tungsten Electric-verwarmers vlak in dak- of plafondruimten gemonteerd[^s1]. De opening, de raveelbalken en de diepte van de plafondruimte moeten op de constructietekeningen staan, niet pas door de monteur worden ontdekt. Met ophangpalen hangen verwarmers lager onder hoge plafonds; detailleer de bevestiging aan de constructie erboven[^s1].

Controles bij de indieningsstukken: de maten van de uitsparing komen overeen met de set; de diepte van de plafondruimte en eventuele ventilatie of afstanden in de inbouwruimte komen overeen met de handleiding; de plafondafwerking sluit netjes aan op de afwerkrand van de set; de constructie draagt het gewicht van de verwarmer. De collecties Tungsten Select en Coastal (binnenkort) zijn ontworpen voor inbouw met lage inbouwhoogte; bevestig de maten voordat u detailleert[^s2].

![Zwarte plafondverwarmer boven een lounge bij kaarslicht](img:l-007-035)

## Welke afstanden gelden?

De richtlijn van Bromic noemt minimale montagehoogtes van 1,83 m boven de vloer voor muurmontage en 2,44 m voor plafondmontage, afhankelijk van het vermogen[^s1]. Afstanden tot brandbare materialen, muren en het plafond komen uit de installatiehandleiding van elk model. Neem ze niet over uit een bestekssjabloon of van een ander product. Teken de afstandszone op het plafondplan en in doorsneden door pergola's, zonneschermen, parasols en beplanting.

## Hoe stemt u de bediening af?

Bediening hoort bij de verwarmer en is geen extraatje. Elke verwarmer op de tekeningen heeft nodig:

- Een Affinity Smart-Heat-regelaar (On/Off, Dimmer, of de Eclipse-regelaar voor Eclipse-verwarmers).
- Een handmatige wandschakelaar.
- De Bromic Smart-Heat-app voor zones, schema's en timers. Wifi- en app-functies vereisen compatibele Affinity Smart-Heat-bediening, die apart wordt verkocht[^s2].

Bij Control4, Crestron of Lutron verschilt de compatibiliteit per systeem en kan extra integratiehardware of configuratie nodig zijn[^s2]. Leg vast wie de interface levert, wie de programmering schrijft en wie de netwerkaansluiting bij de regelaar verzorgt. Toon de plek van de regelaar op de elektrotekening, beschut zoals de handleiding vraagt, en de koppeling tussen groepen en zones in het overzicht.

## Checklist voor de planning

- [ ] Productgegevens en actuele installatiehandleiding per model
- [ ] Indeling verwarmd oppervlak met montagehoogtes in doorsnede
- [ ] Belasting, spanning, geleider en beveiliging per verwarmer in de groepenverklaring
- [ ] Werkschakelaar en eventuele aardlekbeveiliging geplaatst en bevestigd
- [ ] Leidingroutes en dozen in het overstek vóór het dichtmaken
- [ ] Inbouwopening, regelwerk en diepte van de plafondruimte op de constructietekeningen
- [ ] Afstandszone op plafondplan en doorsneden
- [ ] Affinity-regelaar, wandschakelaar, app; verantwoordelijkheid voor integratie toegewezen
- [ ] Keurmerken en garantie

*Verwijzingen naar normen zijn alleen ter oriëntatie. Controleer de eisen bij de gemeente en een erkend elektrotechnisch installateur (NEN 1010); voor gastoestellen bij een erkend gasinstallateur, in Nederland volgens NEN 1078 en in de VS volgens NFPA 54[^s1].*

## FAQ

### Wat hoort er in een pakket indieningsstukken voor buitenverwarmers?
Productgegevens, installatiehandleiding, indeling van het verwarmde oppervlak, elektrisch overzicht, montage- of inbouwdetails, bedieningsschema, keurmerken en garantie.

### Hebben elektrische buitenverwarmers een eigen groep nodig?
Ga daarvan uit. In de VS gelden vaste elektrische ruimteverwarmers als continue belasting en worden ze op 125% gedimensioneerd[^s3]. In Nederland bepalen de handleiding en de elektrotechnisch adviseur de definitieve groepsindeling volgens NEN 1010.

### Welke norm geldt voor infraroodverwarmers buiten?
In Nederland NEN 1010 voor de elektrische installatie. In de VS is dat meestal NEC Article 424 voor vaste elektrische ruimteverwarming[^s3]. De elektrotechnisch adviseur toetst aan de geldende editie en de keuring van het toestel.

### Wie bekabelt de bediening?
De installateur legt de aansluitingen op netspanning en de regelaars aan; een integrator verzorgt de programmering van Control4, Crestron of Lutron. Wijs beide toe op de tekeningen.

### Kan Bromic een indeling bekijken vóór de indiening?
Ja. De kosteloze ontwerpservice maakt een keuze van verwarmers, plaatsing en tekeningen van het verwarmde oppervlak op basis van foto's, plannen of tekeningen[^s2].

Boek een ontwerpadvies en laat Bromic de indeling en de materiaallijst controleren vóór de indiening.
