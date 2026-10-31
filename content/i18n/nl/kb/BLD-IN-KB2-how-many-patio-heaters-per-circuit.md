---
id: BLD-IN-KB2
type: kb
title: "Hoeveel terrasverwarmers kunnen op één groep?"
audience: [BLD]
stage: [IN]
cell: BLD-IN
asset: A16
summary: "Hoeveel stroom elektrische verwarmers van 2300, 3400 of 4500 W bij 230 V trekken, hoe de installateur de groep daarop afstemt volgens NEN 1010, en waarom één verwarmer per groep meestal beter is."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Hoeveel verwarmers per groep?"
meta_description: "Bij 230 V trekt een verwarmer van 2300 W 10 A, 3400 W 14,8 A en 4500 W 19,6 A. De installateur dimensioneert de groep volgens NEN 1010; één verwarmer per groep is het eenvoudigst."
cta: {label: "Download de gids voor voorbekabeling", asset: A16}
hero: l-010-070
owner_review: Arvin Avaness
status: draft
gated: false
related: [BLD-IN-01, BLD-IN-KB1, BLD-PP-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Platinum Smart-Heat Electric 2300, 3400, 4500 W; Affinity Smart-Heat Controls"
    verified: true
  - id: s2
    publisher: EC&M
    title: "Understanding requirements for appliances (NEC Article 422)"
    year: 2020
    url: https://www.ecmweb.com/code-basics/understanding-requirements-appliances
    supports: "Continuous load = 3 hours or more; branch circuit at not less than 125% of the continuous load"
    verified: true
  - id: s3
    publisher: Mike Holt forums (practitioner discussion of NEC 424.4)
    title: "Branch circuit for heaters"
    year: 2023
    url: https://forums.mikeholt.com/threads/branch-circuit-for-heaters.2590116
    supports: "Discussion that NEC 424.4(A) limits branch circuits supplying two or more fixed heating outlets to 30 A"
    verified: false
lang: nl
translation_of: BLD-IN-KB2
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Bromic Benelux distributor]]"
---
Bij 230 V trekt een Platinum-verwarmer van 2300 W ongeveer 10,0 A, een van 3400 W ongeveer 14,8 A en een van 4500 W ongeveer 19,6 A (stroom = vermogen ÷ 230 V)[^s1]. Terrasverwarmers branden vaak uren achter elkaar, dus de installateur rekent ze als continubelasting en dimensioneert de groep volgens NEN 1010. Ter vergelijking: in de VS wordt een continubelasting op 125% gedimensioneerd[^s2]. Voor de meeste projecten is één verwarmer per groep het betere antwoord.

*Alleen een richtlijn voor de planning. Stem af met een erkend elektrotechnisch installateur en volg de installatiehandleiding. [[VERIFY: hoe NEN 1010 continubelasting en de keuze van installatieautomaat en kabel voor buitenverwarmers regelt, en de huidige editie — Bromic Benelux distributor]]*

## Hoeveel stroom trekt elke verwarmer bij 230 V?

Stroom = vermogen ÷ 230 V.

| Verwarmer (Platinum-vermogens[^s1]) | Stroom bij 230 V | Twee op één groep |
|---|---|---|
| 2300 W | 10,0 A | 4600 W, 20,0 A |
| 3400 W | 14,8 A | 6800 W, 29,6 A |
| 4500 W | 19,6 A | 9000 W, 39,1 A |

Welke installatieautomaat en kabeldoorsnede daarbij horen, bepaalt de installateur volgens NEN 1010, met de lengte van de leiding, de manier van aanleggen en de spanningsval erbij. Neem geen Amerikaanse automaatwaarden (15, 20 of 30 A bij 240 V) over. [[VERIFY: stroom per model bij 230 V volgens de Europese specificaties — Mike Clifford]]

## Is er een grens aan gedeelde groepen voor verwarmers?

In de VS lezen vakmensen artikel 424.4(A) van de NEC zo dat een eindgroep die twee of meer vaste verwarmingstoestellen voedt, beperkt is tot 30 A [[VERIFY: tekst van 424.4(A) in de toegepaste NEC-editie controleren en of buitenstralingsverwarmers onder artikel 424 of 422 vallen — erkend installateur / Mike Clifford]][^s3]. Voor Nederland bepaalt NEN 1010 wat mag; plan geen zware gedeelde groep zonder dat met de installateur te controleren.

## Waarom is één verwarmer per groep meestal beter?

- **Zones.** Elke verwarmer, of elke zone, krijgt een eigen Affinity Smart-Heat On/Off- of Dimmer-regelaar en wandschakelaar.
- **Storingen zoeken.** Een uitval treft één verwarmer, niet het hele terras.
- **Belasting van de regelaar.** Elke regelaar heeft een maximale belasting [[VERIFY: belastbaarheid van de Affinity-regelaar bij 230 V — Mike Clifford]].
- **Uitbreiden.** Een koper die een stap hoger gaat, voegt een verwarmer toe zonder een gedeelde leiding opnieuw te bekabelen.

App-, schema- en spraakbediening vragen om compatibele Affinity Smart-Heat Controls, die apart worden verkocht[^s1].

## Checklist

- Tel het vermogen van elke verwarmer op de groep op en deel door 230 V.
- Laat de installateur de groep dimensioneren volgens NEN 1010, binnen het maximum op elk typeplaatje.
- Controleer de belastbaarheid van de regelaars.
- Ga uit van één verwarmer per groep.

[^s1]: Bromic, Lookbook 2026.
[^s2]: EC&M, eisen voor apparaten in de NEC (artikel 422; artikel 100, continubelasting).
[^s3]: Mike Holt-forum, discussie over NEC 424.4.
