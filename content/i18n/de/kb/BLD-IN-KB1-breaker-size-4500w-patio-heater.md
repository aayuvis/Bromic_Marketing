---
id: BLD-IN-KB1
type: kb
title: "Welche Absicherung braucht ein 4500-W-Terrassenheizstrahler?"
audience: [BLD]
stage: [IN]
cell: BLD-IN
asset: A16
summary: "Der Strom hinter einem 4500-W-Elektro-Heizstrahler an 230 V, was die Absicherung in Deutschland bestimmt und warum das Typenschild die Grenze setzt – damit der Stromkreis von Anfang an stimmt."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Welche Absicherung braucht ein 4500-W-Terrassenheizstrahler?"
meta_description: "Ein 4500-W-Terrassenheizstrahler zieht an 230 V rund 19,6 A. Absicherung und Leitung legt der Elektrofachbetrieb nach DIN VDE 0100 fest."
cta: {label: "Leitfaden zur Vorverkabelung herunterladen", asset: A16}
hero: t-006-016
owner_review: Fachhandelsvertrieb
status: draft
gated: false
related: [BLD-IN-01, BLD-IN-KB2]
updated: 2026-11-16
lang: de
translation_of: BLD-IN-KB1
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Partner Deutschland]]"
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

Ein 4500-W-Terrassenheizstrahler zieht an 230 V rund 19,6 A. Weil ein Heizstrahler einen ganzen Abend von drei Stunden und länger durchlaufen kann, gilt er als Dauerlast, und Leitung wie Schutzorgan müssen dafür ausgelegt sein. In Deutschland bemisst der Elektrofachbetrieb beides nach DIN VDE 0100, nicht nach US-Faustregeln. In jedem Fall muss die Absicherung innerhalb des Höchstwerts bleiben, der auf dem Typenschild des Heizstrahlers angegeben ist[^s2].

*Nur eine Planungshilfe. Klären Sie die Ausführung mit einem Elektrofachbetrieb, anhand der Montageanleitung und mit dem zuständigen Bauamt.*

[[VERIFY: aktuelle VDE-Regeln für Stromkreise von Heizstrahlern im Freien, insbesondere Absicherung und Leitungsquerschnitt bei 4500 W einphasig — Partner Deutschland]]

## So ermitteln Sie die Absicherung

Teilen Sie die Leistung des Heizstrahlers durch die Netzspannung, dann kennen Sie seinen Strom.

| 4500-W-Heizstrahler | Strom |
|---|---|
| Ausgelegt für 230 V, betrieben an 230 V | ca. 19,6 A |

Welche Absicherung und welcher Leitungsquerschnitt daraus folgen, hängt von der Verlegeart, der Leitungslänge, der Umgebungstemperatur und den übrigen Verbrauchern am Stromkreis ab. Das legt der Elektrofachbetrieb nach DIN VDE 0100 fest.

**Zum Vergleich die US-Regel:** In den USA gilt ein Heizstrahler, der drei Stunden oder länger läuft, nach dem National Electrical Code als Dauerlast; Stromkreis und Leitungsschutz werden dort mit mindestens 125 % des Bemessungsstroms ausgelegt[^s2][^s3]. Diese Rechnung und die US-Sicherungsgrößen gelten nicht für Deutschland.

## Wenn die Spannung vor Ort abweicht

Bestellen Sie einen Heizstrahler, der für die Spannung vor Ort ausgelegt ist. Im US-Markt gibt es Anschlüsse mit 208 V, für die eigene Ausführungen nötig sind [[VERIFY: 208 V availability for Platinum 4500 W — Produktteam]]. Ein Heizstrahler an zu niedriger Spannung zieht weniger Strom, liefert aber auch deutlich weniger Leistung: Ein 240-V-Gerät an 208 V bringt nur rund 75 % seiner Leistung, etwa 3380 W. So bleibt eine Terrasse an einem kühlen Abend leicht spürbar zu kühl.

## Was den Stromkreis außerdem prägt

- Die Absicherung darf den Höchstwert auf dem Typenschild des Heizstrahlers nie überschreiten.
- Lange Leitungen brauchen wegen des Spannungsfalls unter Umständen einen größeren Querschnitt.
- An einem gemeinsamen Stromkreis rechnen Sie den Strom aller Heizstrahler zusammen; ein Heizstrahler je Stromkreis hält die Planung einfacher.
- Der Stromkreis läuft über das zugehörige Affinity Smart-Heat On/Off- oder Dimmer-Steuergerät und einen Wandschalter[^s1]. Prüfen Sie deshalb die zulässige Last des Steuergeräts [[VERIFY: Affinity controller maximum load — Produktteam]].

## Bevor die Leitungen verlegt werden

- Leistung und Spannung laut Typenschild bestätigt.
- Strom bei 230 V berechnet.
- Absicherung und Leitungsquerschnitt vom Elektrofachbetrieb nach DIN VDE 0100 festgelegt, für Belastbarkeit und Leitungslänge.
- Absicherung innerhalb des Höchstwerts auf dem Typenschild.
- Steuergerät und Wandschalter im Stromlaufplan eingetragen.

[^s1]: Bromic, Lookbook 2026.
[^s2]: EC&M, NEC-Anforderungen an Geräte (Article 422; Article 100 zur Dauerlast) – US-Vorschrift.
[^s3]: EC&M, NEC-Regeln für Raumheizgeräte – US-Vorschrift.
