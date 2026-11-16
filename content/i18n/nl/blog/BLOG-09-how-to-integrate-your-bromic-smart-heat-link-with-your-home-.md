---
id: BLOG-09
type: blog
title: "Buitenverwarmers koppelen aan domotica of een gebouwbeheersysteem"
action: merge-target
audience: [BLD, RES]
stage: [BY]
cell: BLD-BY
asset: A24
summary: "Hoe Bromic-verwarmers vandaag deel worden van een slim huis of gebouw: via Alexa, Google Home, Control4, Crestron, Lutron of een gebouwbeheersysteem, met Affinity-regelaars, Ethernet en 0–10 V via de uitbreidingsprint, wat de integrator nodig heeft en wat de Smart-Heat Link heeft vervangen."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Hoe koppel ik mijn buitenverwarmer aan Control4, Crestron of Lutron?"
meta_description: "Buitenverwarmers in je domotica: Affinity-regelaars, Ethernet en 0-10 V via de uitbreidingsprint, en wat je integrator nodig heeft."
cta: {label: "Ontvang de reeks installatiegidsen", asset: A17}
hero: w-expansion-board-2-1600x1600-1
images: [w-expansion-board]
owner_review: marketing
technical_reviewer: productteam
last_reviewed: 2026-10-29
status: draft
gated: false
related: [BLD-BY-01, RES-BY-01, COM-BY-01, BLD-IN-01]
updated: 2026-11-16
lang: nl
translation_of: BLOG-09
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Bromic Benelux distributor]]"
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Affinity Smart-Heat Expansion Board"
    year: 2026
    url: https://www.bromic.com/product/affinity-smart-heat-expansion-board/
    supports: "Ethernet and 0–10 V for home automation or BMS; fits 1- and 2-channel On/Off and Dimmer, built into 5-channel; fits inside the controller with two screws and draws its power from it; BMS needs the included jumper and disables the app; Alexa and Google Home integrate without the board; $384"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "Intelligent Controls Systems (smart controls page)"
    year: 2026
    url: https://www.bromic.com/smart-controls/
    supports: "Compatible with Google Home, Amazon Alexa, Lutron, Crestron, Control4, Domotica and Josh.ai; 0–10 V via the expansion board"
    verified: false
  - id: s3
    publisher: Bromic Heating
    title: "Outdoor Lookbook 2026, p.41 — Affinity Smart-Heat Control System"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Alexa, Google Assistant, Control4, Crestron, Lutron; compatibility varies by system and may need additional integration hardware or configuration; Wi-Fi and app features need compatible Affinity controls, sold separately"
    verified: true
  - id: s4
    publisher: Bromic Heating
    title: "Bromic heating app page (FAQ)"
    year: 2026
    url: https://www.bromic.com/affinity-smart-heat-app/
    supports: "BMS and app cannot run at the same time; voice control does not work on Bluetooth or BMS setups; Apple Home not supported"
    verified: true
  - id: s5
    publisher: Bromic Heating
    title: "Affinity On/Off, Dimmer and Eclipse controller pages"
    year: 2026
    url: https://www.bromic.com/product/affinity-smart-heat-on-off-controllers/
    supports: "Channels, 6 kW per channel at 208–277 V, 5-channel three-phase options including 120/208 V; 5-channel includes the expansion board; 2.4 GHz Wi-Fi, Bluetooth 30 ft"
    verified: true
  - id: s6
    publisher: Bromic Heating
    title: "How to Integrate Your Bromic Smart-Heat Link with Your Home Automation System (live post, 2022)"
    year: 2022
    url: https://www.bromic.com/blog/how-to-integrate-your-bromic-smart-heat-link-with-your-home-automation-system/
    supports: "Smart-Heat Link: RS232 (DB9), 5 VDC 500 mA supply, 19200 baud 8-N-1, Docklight programming, pairs with Wireless On/Off and Dimmer controllers, up to 50 remotes; licensed system integrator; wiring diagrams 220–240 V"
    verified: true
  - id: s7
    publisher: Bromic Heating
    title: "How Do I Connect My Outdoor Radiant Heater to My Home Automation System? (live post, 2022)"
    year: 2022
    url: https://www.bromic.com/blog/how-do-i-connect-my-outdoor-radiant-heater-to-my-home-automation-system/
    supports: "Merged post: RS232 route, professional installer and licensed electrician, integrator maps commands to the interface"
    verified: true
  - id: s8
    publisher: National Fire Protection Association
    title: "NFPA 70, National Electrical Code"
    year: 2026
    url: https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70
    supports: "US electrical installation code that governs heater and controller circuits"
    verified: false
---

Bromic-verwarmers worden onderdeel van een slim huis via Affinity Smart-Heat-regelaars, die apart worden verkocht. Alexa en Google Home koppel je zonder extra hardware rechtstreeks aan de Bromic-app, terwijl Control4, Crestron, Lutron en gebouwbeheersystemen (GBS) aansluiten via de Affinity-uitbreidingsprint, die Ethernet en een 0–10 V-stuuringang toevoegt; in 5-kanaalsregelaars zit hij ingebouwd, bij 1- en 2-kanaalsregelaars voeg je hem toe.[^s1][^s2] Deze route vervangt de oudere RS232 Smart-Heat Link.

![De Affinity-uitbreidingsprint in zijn transparante behuizing](img:w-expansion-board-2-1600x1600-1)

## De juiste route voor je project

| Doel | Wat je installeert | Opmerkingen |
|---|---|---|
| App en spraak (Alexa, Google Home) | Affinity On/Off-, Dimmer- of Eclipse-regelaar op wifi | Geen uitbreidingsprint nodig[^s1]. Apple Home wordt niet ondersteund[^s4] |
| Domoticasysteem voor het hele huis (Control4, Crestron, Lutron en andere) | Affinity-regelaar plus uitbreidingsprint | 0–10 V en Ethernet; de compatibiliteit verschilt per systeem en kan extra integratiehardware of configuratie vragen[^s3] |
| Gebouwbeheersysteem (GBS/BMS) | Affinity-regelaar plus uitbreidingsprint, in BMS-modus | Het GBS neemt de besturing over en de app wordt uitgeschakeld[^s1][^s4] |
| Geen automatisering | Handbediende wandschakelaar | Aan en uit aan de muur; geen app of spraak |

Bromic noemt daarnaast Domotica en Josh.ai als compatibele platforms.[^s2] [[VERIFY: geteste integraties, drivers of modules voor Control4, Crestron, Lutron, Domotica en Josh.ai, en of 0–10 V de enige interface is — productteam]]

## Hoe de uitbreidingsprint alles verbindt

De print past netjes in een 1- of 2-kanaals On/Off- of Dimmer-regelaar, vastgezet met twee schroeven en gevoed door de regelaar zelf, en voegt twee aansluitingen toe:[^s1]

- **Ethernet** geeft een bedrade netwerkverbinding die op een groot terrein stabieler blijft dan wifi.
- **Een 0–10 V-klemmenblok** laat het domoticasysteem elk kanaal schakelen of op een niveau zetten.

De 5-kanaals On/Off- en Dimmer-regelaars hebben de print al aan boord.[^s5] [[VERIFY: werkt de Eclipse-regelaar met de uitbreidingsprint of met 0–10 V — productteam]]

<div class="diagram">Diagram: domoticaprocessor → 0–10 V-aderpaar en Ethernet → uitbreidingsprint in een Affinity 2-kanaals Dimmer → twee verwarmingsgroepen; een stippellijn van de router naar de regelaar voor de app, doorgestreept zodra de BMS-modus aan staat.</div>

## Kiezen tussen de app en de BMS-modus

De app en een GBS kunnen niet tegelijk werken. Zodra je de jumper op de print plaatst, gaat de besturing naar het GBS, en werken de app en spraakbesturing niet meer voor die regelaar.[^s1][^s4] Spreek vóór de inbedrijfstelling met de eigenaar af welk systeem het enige bedienpunt wordt. Een horecaketen die de verwarming vanuit het gebouwbeheersysteem regelt, kiest meestal voor het GBS, terwijl de meeste huiseigenaren de app en spraak houden.

## Wat je integrator nodig heeft

- **Het type regelaar en de kanaalindeling**, met welk kanaal welke verwarmer voedt, en de belasting ervan.
- **Het stuursignaal per kanaal**, aan/uit voor On/Off-regelaars en gasverwarmers en een niveau voor Dimmer-kanalen. [[VERIFY: 0–10 V-schaal ten opzichte van het verwarmingsvermogen op Dimmer-kanalen, en of On/Off-kanalen bij een drempelwaarde schakelen — productteam]]
- **Een netwerkaansluiting** op de plek van de regelaar als je Ethernet gebruikt.
- **De installatiehandleiding en aansluitschema's van Affinity** uit de technische documentatie van Bromic. [[VERIFY: of de aansluitschema's van Affinity naast 220–240 V ook 208 V en 277 V dekken; de eerdere schema's van de Smart-Heat Link toonden alleen 220–240 V — productteam]]

De regelaars schakelen 6 kW per kanaal bij 208–277 V, dus ook bij het Nederlandse net van 230 V, 50 Hz, en 5-kanaalsregelaars zijn er ook in driefasige uitvoeringen, waaronder 120/208 V.[^s5] [[VERIFY: welke driefasige uitvoeringen voor het Nederlandse net (3 × 400 V) leverbaar zijn — Bromic Benelux distributor]]

## Wat er van de Smart-Heat Link werd

De Smart-Heat Link was een RS232-gateway die via een seriële verbinding werd geprogrammeerd, en hij werkte alleen samen met de eerdere Wireless On/Off- en Dimmer-regelaars, nooit met Affinity.[^s6][^s7] Nieuwe projecten gebruiken Affinity-regelaars en de uitbreidingsprint. [[VERIFY: status van de Smart-Heat Link (uit het assortiment, alleen reserveonderdelen of ondersteund) en de upgraderoute voor bestaande RS232-installaties — productteam]] Heb je een systeem met een Smart-Heat Link, neem dan contact op met de technische ondersteuning van Bromic voordat je iets verandert.

## Het team achter de installatie

Een erkend installateur plaatst de verwarmers, regelaars en groepen, en een vakkundige systeemintegrator configureert de domoticakant.[^s6][^s7] In de VS volgt de bekabeling van verwarmers en bediening NFPA 70, de National Electrical Code;[^s8] in Nederland is dat NEN 1010. Stem de eisen daarom af met je gemeente en een erkend installateur voordat het werk begint. [[VERIFY: actuele Nederlandse normen voor de installatie van buitenverwarmers — Bromic Benelux distributor]]

## Veelgestelde vragen

### Heb ik de uitbreidingsprint nodig voor Alexa?
Nee. Alexa en Google Home koppelen zonder print via de Bromic-app.[^s1]

### Kan ik de app en een GBS samen gebruiken?
Nee. In BMS-modus is de app voor die regelaar uitgeschakeld.[^s4]

### Kun je gasverwarmers automatiseren?
Ja. Een Affinity On/Off-regelaar schakelt tot 10 gasverwarmers per kanaal aan en uit.[^s5]

### Werkt mijn RS232 Smart-Heat Link met Affinity?
[[VERIFY: compatibiliteit tussen de Smart-Heat Link en Affinity-regelaars — productteam]] Voor het instellen van de app, zie [zo gebruik je de Bromic-app](https://www.bromic.com/blog/how-to-use-the-new-bromic-heating-app/) (Engelstalig), en voor het volledige assortiment bediening, [bromic.nl](https://www.bromic.nl/).

Onze reeks installatiegidsen neemt je stap voor stap mee door bekabeling en inbedrijfstelling.
