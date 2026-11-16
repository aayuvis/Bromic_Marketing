---
id: ARC-IN-01
type: article
title: "Buitenverwarmers voorschrijven: een gids volgens CSI MasterFormat voor infraroodverwarming"
audience: [ARC]
stage: [IN]
cell: ARC-IN
asset: A24
summary: "Waar elektrische infrarood buitenverwarmers thuishoren in MasterFormat, wat elk deel van een driedelige specificatie moet bevatten, het verwarmd oppervlak per product, en hoe u de bediening zo beschrijft dat uw ontwerpintentie de aanbesteding overleeft."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Hoe schrijf ik een bestekspecificatie voor infrarood buitenverwarmers?"
meta_description: "Buitenverwarmers voorschrijven: de MasterFormat-sectie, een driedelige specificatie, verwarmd oppervlak per product en bestekstekst voor de bediening."
cta: {label: "Download de specificatiekit", asset: A11}
hero: l-005-022
images: [l-010-067]
owner_review: specificatie en compliance
status: draft
gated: false
related: [ARC-BY-01, ARC-CO-01, ARC-IN-KB1, BLD-IN-01]
updated: 2026-11-16
lang: nl
translation_of: ARC-IN-01
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Bromic Benelux distributor]]"
sources:
  - id: s1
    publisher: The Blue Book Building & Construction Network (MasterFormat listing)
    title: "23 83 33 Electric Radiant Heaters"
    year: 2026
    url: https://thebluebook.com/iProView/315999
    supports: "23 83 33 Electric Radiant Heaters sits in the 23 83 radiant heating group beside 23 83 13 and 23 83 23"
    verified: true
  - id: s2
    publisher: Dodge Sweets (MasterFormat browse)
    title: "23 83 00 Radiant Heating Units"
    year: 2026
    url: https://sweets.construction.com/MasterFormat/Heating_Ventilating_and_Air_Conditioning_HVAC-23_00_00/Radiant_Heating_Units-23_83_00
    supports: "23 83 00 Radiant Heating Units with sub-sections incl. 23 83 26 Gas-Fired Radiant Heaters and 23 83 33 Electric Radiant Heaters; 23 82 39 is Unit Heaters"
    verified: true
  - id: s3
    publisher: Construction Specifications Institute
    title: "MasterFormat"
    year: 2020
    url: https://www.csiresources.org/standards/masterformat
    supports: "Authoritative MasterFormat numbers and titles"
    verified: false
  - id: s4
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Coverage, wattages, finishes, mounting per product; Affinity controls; integrations and compatibility caveat"
    verified: true
  - id: s5
    publisher: Bromic Heating
    title: "Outdoor Heating Planning Guide v1.2, Steps 06–08"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "NFPA 70; wall ≥72 in, ceiling ≥96 in; certification marks Intertek/UL/CSA; recess kits and suspension poles; commercial voltages 208/240/277V"
    verified: true
  - id: s6
    publisher: Washington State Building Code Council (WAC 51-11C-40392)
    title: "Washington State Energy Code, Commercial, C403.11.1 Heating outside a building"
    year: 2021
    url: https://lawfilesext.leg.wa.gov/law/WAC/WAC%20%2051%20%20TITLE/WAC%20%2051%20-%2011C%20CHAPTER/WAC%20%2051%20-%2011C-40392.htm
    supports: "Exterior heat must be radiant and controlled by occupancy sensor or timer switch"
    verified: true
  - id: s7
    publisher: EC&M (Electrical Construction & Maintenance)
    title: "Article 424: Fixed electric space heating (code basics)"
    year: 2020
    url: https://www.ecmweb.com/code-basics/article-424-fixed-electric-space-heating
    supports: "NEC 424 covers fixed electric space-heating equipment; branch-circuit conductors sized not smaller than 125% of load (424.4(B) in the 2020 NEC; 424.3(B) in earlier editions)"
    verified: true
---
In het Noord-Amerikaanse MasterFormat-systeem worden elektrische infrarood buitenverwarmers voorgeschreven in sectie 23 83 33, Electric Radiant Heaters, onder 23 83 00 Radiant Heating Units[^s1][^s2]. Werkt u met een Nederlands bestek, dan geldt dezelfde opbouw: verwarmer, montage, bediening en elektrotechnische afstemming als aparte, controleerbare eisen. [[VERIFY: overeenkomstige opbouw van een Nederlands bestek (bijv. STABU-hoofdstuk) voor vaste elektrische stralingsverwarmers — Bromic Benelux distributor]] Schrijf het als een driedelige sectie, waarin deel 1 referenties, in te dienen stukken en garantie vastlegt, deel 2 een referentieproduct noemt met vermogen, spanning, afwerking, montagetoebehoren en bediening, en deel 3 installatie, vrije afstanden, elektrotechnische afstemming en inbedrijfstelling van de bediening vastlegt. Als de bediening en het inbouwdetail als prestatie-eisen zijn geschreven, is de kans veel groter dat de verwarmer waaromheen u ontwierp ook de verwarmer is die wordt geplaatst.

![Verwarmer vlak verzonken in een strak wit plafond](img:l-005-022)

## De juiste MasterFormat-sectie vinden

MasterFormat kent geen titel voor "terrasverwarmers". De beste aansluiting, en de sectie die wij aanbevelen, is 23 83 33 Electric Radiant Heaters, omdat het product een vast gemonteerde elektrische stralingsverwarmer is[^s1].

| Sectie | Titel | Geschikt voor buitenverwarmers? |
|---|---|---|
| 23 83 33 | Electric Radiant Heaters | Ja: vaste elektrische infraroodverwarmers (aanbevolen) |
| 23 83 26 | Gas-Fired Radiant Heaters | Ingebouwde infraroodverwarmers op gas[^s2] |
| 23 82 39 | Unit Heaters | Nee: convectietoestellen met ventilator, die buiten niet werken |
| Division 26 | Electrical | Groepen, werkschakelaars, leidingwerk en schakelmateriaal; niet de verwarmer |
| Division 12 / buitenmeubilair | Vrijstaande toestellen, als het bureau verplaatsbare uitrusting daar onderbrengt | Voorkeur van het bureau |

De sectienummers en titels komen uit MasterFormat-overzichten in de Blue Book en Dodge Sweets[^s1][^s2]; de tekst van CSI zelf konden we vanaf hier niet openen. [[VERIFY: bevestig de nummers en titels 23 83 33 / 23 83 26 aan de hand van de huidige editie van CSI MasterFormat — specificatie en compliance]][^s3]

## Deel 1, Algemeen

- **Samenvatting en verwante secties.** Verwijs naar het elektrotechnische deel voor groepen, werkschakelaars en leidingwerk, en naar de integratiesectie als de verwarmers aan een domotica- of gebouwbeheersysteem worden gekoppeld.
- **Referenties.** Voor de elektrische installatie geldt in Nederland NEN 1010 (in de VS NFPA 70, de National Electrical Code), en het product moet een erkend keurmerk dragen (Bromic noemt Intertek, UL of CSA)[^s5]. [[VERIFY: volgens welke norm(en) elk elektrisch Bromic-model is gekeurd — productteam]] [[VERIFY: CE-markering en Europese conformiteit per model — Bromic Benelux distributor]]
- **In te dienen stukken.** Productgegevens, aansluitschema's, details van inbouwset en montage, vrije afstanden uit de installatiehandleiding, het schema van de bediening en een indeling met het verwarmd oppervlak.
- **Kwaliteitsborging.** Een installateur die bekwaam is in de producten van de fabrikant, en een gekwalificeerde elektrotechnisch installateur voor de aansluitingen.
- **Garantie.** Vermeld de standaardgarantie van de fabrikant. [[VERIFY: garantietermijn per product — productteam]]

## Deel 2, Producten

Noem een referentieproduct en de eigenschappen waaraan een alternatief moet voldoen. Algemene tekst zoals "infrarood buitenverwarmer, 3 kW" is precies het soort tekst dat bij de aanbesteding vaak wordt wegbezuinigd.

- Fabrikant en model, vermogen en voedingsspanning (in Nederland 230 V, 50 Hz; de Amerikaanse utiliteitsuitvoeringen die Bromic noemt zijn 208 V, 240 V en 277 V)[^s5]. [[VERIFY: spanning per model en stroom bij elke spanning — productteam]]
- Afwerking en uitvoering, bijvoorbeeld Platinum zwart of wit, Classic of Marine[^s4].
- Montage – inbouwset, plafond, wand of pendelstang – als toebehoren met een eigen bestekspost[^s5].
- Bediening, geschreven als verplicht onderdeel: een Affinity Smart-Heat® On/Off-, Dimmer- of Eclipse-regelaar, een handbediende wandschakelaar en de Bromic Smart-Heat app voor zones, tijdschema's en timers. Wifi- en app-functies vereisen compatibele Affinity Smart-Heat-bediening, die apart wordt verkocht[^s4].
- Integratie, waar nodig. De verwarmers zijn compatibel met Control4, Crestron en Lutron, al verschilt de compatibiliteit per systeem en kan extra integratiehardware of configuratie nodig zijn[^s4]. Leg in het bestek vast wie verantwoordelijk is voor de integratie.

## Hoeveel oppervlak elke verwarmer verwarmt

| Product | Vermogen | Verwarmd oppervlak (ca.) | Montage | Status |
|---|---|---|---|---|
| Platinum Smart-Heat Electric | 2300 W, 3400 W, 4500 W | 6–13 m² | Verzonken, plafond, wand | Leverbaar |
| Tungsten Smart-Heat Electric, Select | [[VERIFY: vermogens — productteam]] | 6–13 m² | Verzonken met weinig inbouwdiepte, plafond, wand, enkele paal | Binnenkort leverbaar |
| Tungsten Smart-Heat Electric, Coastal (rvs 316) | [[VERIFY: vermogens — productteam]] | 6–13 m² | Zeewaterbestendig, verzonken met weinig inbouwdiepte, plafond, wand, enkele paal | Binnenkort leverbaar |
| Eclipse Smart-Heat Electric | 33 / 66 / 100% vermogen | 11 m² | Enkele stang van 200, 610 of 1220 mm, dubbele of gebogen stang | Leverbaar |
| Eclipse Smart-Heat Freestanding Electric | 33 / 66 / 100% vermogen | 11 m² | Vrijstaand, op wieltjes, verzwaarde voet | Leverbaar |

Bron: Lookbook 2026[^s4]. Het verwarmd oppervlak varieert met model, montagehoogte, omgeving en installatieomstandigheden; gebruik deze waarden dus voor de planning en laat ze daarna bevestigen met een indeling van Bromic.

![Overdekte buitenkeuken, verwarmd door verwarmers vlak in het plafond](img:l-010-067)

## Deel 3, Uitvoering

- **Controle vooraf.** Controleer het plafond- of overstekregelwerk, de diepte van de inbouwholte en de achterhout vóór de voorbekabeling. [[VERIFY: maten van uitsparing en inbouwholte van de inbouwset per model — productteam]]
- **Installatie.** Volgens de installatiehandleiding van de fabrikant. De richtlijnen van Bromic noemen minimale montagehoogtes van minstens 1,83 m boven de vloer voor wandmontage en minstens 2,44 m voor plafondmontage, afhankelijk van het vermogen[^s5]. Neem de vrije afstanden tot brandbare materialen over uit de handleiding zelf, niet uit een schatting in het bestek.
- **Elektrische aansluitingen.** Door de elektrotechnisch installateur, op groepen die zijn gedimensioneerd op de belasting van de verwarmer, volgens NEN 1010. Ter vergelijking: de Amerikaanse NEC-regels voor vaste elektrische ruimteverwarming dimensioneren de groepsleidingen op minimaal 125% van de belasting[^s7]. Laat de geldende eisen bevestigen door de installatieadviseur; stroom bij 230 V = vermogen ÷ 230. [[VERIFY: huidige Nederlandse normen voor de installatie van buitenverwarmers — Bromic Benelux distributor]]
- **Bediening.** Monteer regelaars op een plek die zo beschermd is als de handleiding vraagt, programmeer zones en tijdschema's, en zorg voor automatische uitschakeling waar energievoorschriften dat eisen. De energiecode voor utiliteitsbouw van de Amerikaanse staat Washington eist bijvoorbeeld dat warmte buiten stralingswarmte is, geregeld door een aanwezigheidssensor of tijdschakelaar[^s6].
- **Kwaliteitscontrole en overdracht.** Test elke zone en neem daarna met de eigenaar de app, de wandschakelaar en de tijdschema's door.

## Uw ontwerpintentie door de aanbesteding heen houden

Schrijf prestaties in de bepalingen waaraan een alternatief het minst snel voldoet: verzonken inbouw met weinig inbouwdiepte, de afwerking, de standen- of dimbediening, tijdschema's via de app en de integratie-eis. Vraag dat een verzoek om een alternatief een indeling met het verwarmd oppervlak bevat voor dezelfde plattegrond bij dezelfde montagehoogte. Als u de inbouwset op de plafondplattegrond detailleert, is de opening zelf al getekend op het voorgeschreven product.

## Uw checklist voor de specificatie

- [ ] Sectie 23 83 33 (elektrisch) of 23 83 26 (gas), of de overeenkomstige bestekshoofdstukken, met verwijzing naar het elektrotechnische deel
- [ ] Referentiemodel, vermogen, spanning, afwerking, uitvoering
- [ ] Montagetoebehoren (inbouwset, stang) als eigen post
- [ ] Affinity-bediening en wandschakelaar voorgeschreven; verantwoordelijkheid voor app en integratie toegewezen
- [ ] Indeling met verwarmd oppervlak bijgevoegd; montagehoogtes in doorsnede aangegeven
- [ ] Vrije afstanden verwijzen naar de installatiehandleiding
- [ ] Bediening volgens energievoorschriften (tijdschakelaar of aanwezigheidsdetectie) waar vereist

*Verwijzingen naar voorschriften zijn ter oriëntatie. Laat de eisen bevestigen door uw gemeente en een gekwalificeerde elektrotechnisch installateur of gasinstallateur (NEN 1010, NEN 1078).*

## FAQ

### In welke CSI-sectie valt een infrarood buitenverwarmer?
Wij bevelen 23 83 33 Electric Radiant Heaters aan voor vaste elektrische toestellen en 23 83 26 voor stralingsverwarmers op gas[^s1][^s2]. Controleer dit aan de hand van de MasterFormat-editie van uw bureau.

### Past 23 82 39 Unit Heaters?
Nee. Unit heaters zijn convectietoestellen met een ventilator, en buiten stijgt de warme lucht die ze maken op en waait weg, terwijl het product dat u voorschrijft een stralingsverwarmer is.

### Hoort de bediening in de sectie van de verwarmer?
Ja. Schrijf de Affinity-regelaar, de wandschakelaar en de app voor samen met de verwarmer, en stem de bekabeling af in het elektrotechnische deel. Bediening die aan "derden" wordt overgelaten, is het meest voorkomende gat bij de oplevering.

### Kunnen buitenverwarmers koppelen met Crestron, Control4 of Lutron?
Ja, via Affinity Smart-Heat-bediening. De compatibiliteit verschilt en kan extra integratiehardware of configuratie vragen[^s4]; wijs de integratie daarom toe aan een met naam genoemde partij.

### Waar krijg ik een driedelige specificatie en details?
De Bromic Architect Spec Kit bevat de driedelige specificatie, tabellen met verwarmd oppervlak en een lijst met details. [[VERIFY: beschikbaarheid en formaat van BIM-/CAD-objecten (asset A13) — specificatie en compliance]]

Download de specificatiekit voor de bewerkbare driedelige sectie en de tabellen met verwarmd oppervlak.
