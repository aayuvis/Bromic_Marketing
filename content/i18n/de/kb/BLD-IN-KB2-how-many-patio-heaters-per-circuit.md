---
id: BLD-IN-KB2
type: kb
title: "Wie viele Terrassenheizstrahler passen auf einen Stromkreis?"
audience: [BLD]
stage: [IN]
cell: BLD-IN
asset: A16
summary: "Welchen Strom 2300-, 3400- und 4500-W-Heizstrahler bei 230 V ziehen, wie der Elektrofachbetrieb den Stromkreis nach DIN VDE 0100 auslegt und warum ein Heizstrahler je Stromkreis meist die bessere Wahl ist."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Wie viele Heizstrahler passen auf einen Stromkreis?"
meta_description: "Bei 230 V zieht ein 2300-W-Heizstrahler rund 10 A, ein 3400-W-Gerät rund 15 A, ein 4500-W-Gerät rund 20 A. Ein Heizstrahler je Stromkreis ist am einfachsten."
cta: {label: "Leitfaden zur Vorverkabelung herunterladen", asset: A16}
hero: l-010-070
owner_review: Arvin Avaness
status: draft
gated: false
related: [BLD-IN-01, BLD-IN-KB1, BLD-PP-01]
updated: 2026-10-29
lang: de
translation_of: BLD-IN-KB2
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Raffaele Marti]]"
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
---

Ein Heizstrahler ist eine Dauerlast: Er läuft oft über Stunden mit voller Leistung. Bei 230 V zieht ein 2300-W-Gerät rund 10 A, ein 3400-W-Gerät rund 15 A und ein 4500-W-Gerät rund 20 A (Strom = Watt ÷ 230)[^s1]. Wie viele Geräte ein Stromkreis trägt, legt der Elektrofachbetrieb nach DIN VDE 0100 fest: Absicherung, Leitungsquerschnitt, Verlegeart und Leitungslänge gehören zusammen. Für die meisten Bauvorhaben ist ein Heizstrahler je Stromkreis die bessere Lösung.

*Nur eine Planungshilfe. Klären Sie die Auslegung mit einem eingetragenen Elektrofachbetrieb, der Installationsanleitung und Ihrer zuständigen Baubehörde (Bauamt) ab. [[VERIFY: current VDE and DVGW rules for outdoor heaters — Raffaele Marti]]*

## Welchen Strom ziehen die Heizstrahler bei 230 V?

Strom = Summe der Watt auf dem Stromkreis ÷ 230 V.

| Last auf dem Stromkreis (Platinum-Leistungen[^s1]) | Strom bei 230 V |
|---|---|
| Ein 2300-W-Gerät | ca. 10,0 A |
| Ein 3400-W-Gerät | ca. 14,8 A |
| Ein 4500-W-Gerät | ca. 19,6 A |
| Zwei 2300-W-Geräte (4600 W) | ca. 20,0 A |
| Ein 2300-W- und ein 3400-W-Gerät (5700 W) | ca. 24,8 A |

Welche Absicherung und welcher Querschnitt zu diesen Strömen passen, hängt von der Dauerlast, der Verlegeart, der Umgebungstemperatur und der Leitungslänge ab. Das bemisst der Elektrofachbetrieb nach DIN VDE 0100, nicht eine Tabelle in einem Leitfaden. [[VERIFY: Auslegung von Stromkreisen für ortsfeste Heizgeräte im Außenbereich nach DIN VDE 0100 (Absicherung, Dauerlast, Fehlerstromschutz) — Raffaele Marti]]

Zum Vergleich: In den USA wird eine Dauerlast nach dem National Electrical Code mit 125 % angesetzt, sodass ein Stromkreis nur zu 80 % seines Nennwerts belastet wird[^s2]. Diese US-Regel gilt in Deutschland nicht unmittelbar; sie zeigt aber, warum ein Stromkreis für Heizstrahler Reserve braucht.

## Gibt es eine Grenze für gemeinsam genutzte Heizstromkreise?

In den USA lesen Praktiker den NEC so, dass ein Stromkreis, der zwei oder mehr ortsfeste Heizgeräte versorgt, auf 30 A begrenzt ist [[VERIFY: confirm 424.4(A) text in the adopted NEC edition and whether outdoor radiant heaters fall under Article 424 or 422 — licensed electrician / Mike Clifford]][^s3]. Für Deutschland gilt DIN VDE 0100. Planen Sie keinen gemeinsamen Stromkreis für mehrere Geräte, ohne das mit dem Elektrofachbetrieb abzustimmen.

## Warum ist ein Heizstrahler je Stromkreis meist besser?

- **Zonen.** Jeder Heizstrahler oder jede Zone erhält ein eigenes Affinity Smart-Heat On/Off- oder Dimmer-Steuergerät und einen Wandschalter.
- **Fehlersuche.** Löst eine Sicherung aus, ist nur ein Heizstrahler betroffen, nicht die ganze Terrasse.
- **Last am Steuergerät.** Jedes Steuergerät hat eine Höchstlast [[VERIFY: Affinity controller load rating — Mike Clifford]].
- **Erweiterungen.** Wer später aufrüstet, ergänzt einen Heizstrahler, ohne eine gemeinsame Leitung neu zu verlegen.

App-, Zeitplan- und Sprachsteuerung setzen kompatible Affinity Smart-Heat Controls voraus, die separat erhältlich sind[^s1].

## Checkliste

- Die Watt aller Heizstrahler auf dem Stromkreis addieren und durch 230 V teilen.
- Absicherung und Querschnitt vom Elektrofachbetrieb nach DIN VDE 0100 für Dauerlast auslegen lassen; die Höchstwerte auf jedem Typenschild einhalten.
- Die Lastangaben der Steuergeräte prüfen.
- Standardmäßig ein Heizstrahler je Stromkreis.

[^s1]: Bromic, Lookbook 2026.
[^s2]: EC&M, NEC-Anforderungen an Geräte (Article 422; Article 100, Dauerlast) – US-Vorschrift.
[^s3]: Mike Holt Forums, Diskussion zu NEC 424.4 – US-Vorschrift.
