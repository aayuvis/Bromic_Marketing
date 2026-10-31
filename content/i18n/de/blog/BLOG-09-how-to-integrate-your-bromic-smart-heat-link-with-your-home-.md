---
id: BLOG-09
type: blog
title: "Bromic Heizstrahler mit Hausautomation oder Gebäudeleittechnik verbinden"
action: merge-target
audience: [BLD, RES]
stage: [BY]
cell: BLD-BY
asset: A24
summary: "Wie sich Bromic Heizstrahler heute mit Alexa, Google Home, Control4, Crestron, Lutron oder einer Gebäudeleittechnik verbinden: Affinity-Steuergeräte, Ethernet und 0–10 V über die Erweiterungsplatine, was der Systemintegrator braucht und was den Smart-Heat Link abgelöst hat."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Wie verbinde ich meinen Heizstrahler für draußen mit Control4, Crestron oder Lutron?"
meta_description: "Bromic Heizstrahler an Hausautomation oder Gebäudeleittechnik anbinden: Affinity-Steuergeräte, Ethernet und 0–10 V über die Erweiterungsplatine, und was der Systemintegrator braucht."
cta: {label: "Die Installationsleitfäden herunterladen", asset: A17}
hero: w-expansion-board-2-1600x1600-1
images: [w-expansion-board]
owner_review: Megan Spies
technical_reviewer: Mike Clifford
last_reviewed: 2026-10-29
status: draft
gated: false
related: [BLD-BY-01, RES-BY-01, COM-BY-01, BLD-IN-01]
updated: 2026-10-29
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
lang: de
translation_of: BLOG-09
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Raffaele Marti]]"
---
Bromic Heizstrahler werden über Affinity Smart-Heat Steuergeräte, die separat erhältlich sind, in ein Smart Home eingebunden. Alexa und Google Home verbinden sich direkt mit der Bromic App, ohne zusätzliche Hardware. Control4, Crestron, Lutron und Systeme der Gebäudeleittechnik werden über die Affinity-Erweiterungsplatine angebunden, die Ethernet und einen 0–10-V-Steuereingang ergänzt; in 5-Kanal-Steuergeräten ist sie eingebaut, bei 1- und 2-Kanal-Geräten wird sie nachgerüstet.[^s1][^s2] Dieser Weg ersetzt den älteren Smart-Heat Link über RS232.

![Affinity-Erweiterungsplatine in ihrem transparenten Gehäuse](img:w-expansion-board-2-1600x1600-1)

## Welcher Weg passt zum Projekt?

| Ziel | Was installiert wird | Hinweise |
|---|---|---|
| App und Sprachsteuerung (Alexa, Google Home) | Affinity On/Off-, Dimmer- oder Eclipse-Steuergerät im WLAN | Keine Erweiterungsplatine nötig[^s1]. Apple Home wird nicht unterstützt[^s4] |
| Hausautomation (Control4, Crestron, Lutron und andere) | Affinity-Steuergerät plus Erweiterungsplatine | 0–10 V und Ethernet; die Kompatibilität hängt vom System ab und kann zusätzliche Integrationshardware oder Konfiguration erfordern[^s3] |
| Gebäudeleittechnik (GLT) | Affinity-Steuergerät plus Erweiterungsplatine, GLT-Modus | Die GLT übernimmt, die App wird deaktiviert[^s1][^s4] |
| Keine Automation | Manueller Wandschalter | Ein und aus an der Wand; keine App, keine Sprachsteuerung |

Bromic nennt außerdem Domotica und Josh.ai als kompatible Plattformen.[^s2] [[VERIFY: getestete Integrationen, Treiber oder Module für Control4, Crestron, Lutron, Domotica und Josh.ai, und ob 0–10 V die einzige Schnittstelle ist — Mike Clifford]]

## Was leistet die Erweiterungsplatine?

Sie sitzt in einem 1- oder 2-Kanal-Steuergerät (On/Off oder Dimmer), wird mit zwei Schrauben befestigt, vom Steuergerät mit Strom versorgt und ergänzt zwei Dinge:[^s1]

- **Ethernet**, eine kabelgebundene Netzwerkverbindung, die auf großen Anlagen stabiler ist als WLAN.
- **Eine 0–10-V-Klemmleiste**, über die das Automationssystem jeden Kanal schalten oder seine Stufe einstellen kann.

Die 5-Kanal-Steuergeräte On/Off und Dimmer enthalten die Platine bereits.[^s5] [[VERIFY: ob das Eclipse-Steuergerät die Erweiterungsplatine oder 0–10 V unterstützt — Mike Clifford]]

<div class="diagram">Diagramm: Automationsprozessor → 0–10-V-Adernpaar und Ethernet → Erweiterungsplatine in einem Affinity 2-Kanal-Dimmer → zwei Heizstrahlerstromkreise; eine gestrichelte Linie vom Router zum Steuergerät für die App, durchgestrichen, wenn der GLT-Modus aktiv ist.</div>

## Was passiert im GLT-Modus mit der App?

App und GLT können nicht gleichzeitig laufen. Wird die Steckbrücke (Jumper) auf der Platine gesetzt, geht die Steuerung an die GLT über, und die App funktioniert für dieses Steuergerät nicht mehr; auch die Sprachsteuerung entfällt.[^s1][^s4] Legen Sie vor der Inbetriebnahme mit dem Bauherrn fest, welches System die einzige Steuerstelle sein soll. Eine Gastronomiegruppe, die die Wärme über ihre Gebäudetechnik steuert, wählt die GLT; die meisten Hausbesitzer behalten App und Sprachsteuerung.

## Was braucht der Systemintegrator?

- **Modell des Steuergeräts und Kanalbelegung:** welcher Kanal welchen Heizstrahler versorgt, und mit welcher Last.
- **Das Steuersignal je Kanal:** Ein/Aus für On/Off-Steuergeräte und Gasheizstrahler; eine Stufe für Dimmer-Kanäle. [[VERIFY: Skalierung von 0–10 V auf die Heizleistung bei Dimmer-Kanälen, und ob On/Off-Kanäle an einem Schwellwert schalten — Mike Clifford]]
- **Einen Netzwerkanschluss** am Standort des Steuergeräts, wenn Ethernet genutzt wird.
- **Die Affinity-Installationsanleitung und die Schaltpläne** aus den technischen Unterlagen von Bromic. [[VERIFY: ob die Affinity-Schaltpläne neben 220–240 V auch 208 V und 277 V abdecken; die früheren Smart-Heat-Link-Schaltpläne zeigten nur 220–240 V — Mike Clifford]]

Laut den US-Angaben schalten die Steuergeräte 6 kW je Kanal bei 208–277 V, und 5-Kanal-Geräte gibt es in Drehstromausführungen, darunter 120/208 V.[^s5] Für das deutsche Netz mit 230 V, 50 Hz (Drehstrom 400 V) gelten die Angaben der jeweiligen Ausführung. [[VERIFY: Ausführungen und Kanallasten der Affinity-Steuergeräte für 230/400 V, 50 Hz in Deutschland — Mike Clifford]]

## Und der Smart-Heat Link?

Der Smart-Heat Link war ein RS232-Gateway, das über eine serielle Verbindung programmiert wurde. Er arbeitete mit den früheren Wireless On/Off- und Dimmer-Steuergeräten zusammen, nicht mit Affinity.[^s6][^s7] Neue Projekte nutzen Affinity-Steuergeräte und die Erweiterungsplatine. [[VERIFY: Status des Smart-Heat Link (eingestellt, nur Ersatzteile oder weiter unterstützt) und der Umstiegsweg für bestehende RS232-Anlagen — Mike Clifford]] Wer eine Anlage mit Smart-Heat Link besitzt, sollte sich vor jeder Änderung an den technischen Support von Bromic wenden.

## Wer installiert?

Ein Elektrofachbetrieb installiert Heizstrahler, Steuergeräte und Stromkreise, und ein qualifizierter Systemintegrator konfiguriert die Automationsseite.[^s6][^s7] In den USA folgt die Verdrahtung von Heizung und Steuerung NFPA 70, dem National Electrical Code,[^s8] in Deutschland der DIN VDE 0100. Klären Sie die Anforderungen vor Beginn der Arbeiten mit Ihrem örtlichen Bauamt und einem Elektrofachbetrieb. [[VERIFY: aktuelle VDE- und DVGW-Regeln für Heizstrahler im Außenbereich — Raffaele Marti]]

## Häufige Fragen

### Brauche ich die Erweiterungsplatine für Alexa?
Nein. Alexa und Google Home verbinden sich ohne sie über die Bromic App.[^s1]

### Kann ich App und GLT zusammen nutzen?
Nein. Der GLT-Modus deaktiviert die App für dieses Steuergerät.[^s4]

### Lassen sich Gasheizstrahler automatisieren?
Ja, über ein Affinity On/Off-Steuergerät, bis zu 10 Gasheizstrahler je Kanal, ein- und ausgeschaltet.[^s5]

### Funktioniert mein Smart-Heat Link (RS232) mit Affinity?
[[VERIFY: Kompatibilität zwischen Smart-Heat Link und Affinity-Steuergeräten — Mike Clifford]] Zur Einrichtung der App siehe [so nutzen Sie die Bromic Heizungs-App](https://www.bromic.de/); zum gesamten Sortiment die [Bromic-Seite zur Steuerung](https://www.bromic.de/).

Die Schritte zu Verdrahtung und Inbetriebnahme stehen in den Installationsleitfäden.
