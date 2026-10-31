---
id: ARC-CO-KB1
type: kb
title: "Wie verändert die Montagehöhe die Wärmeintensität?"
audience: [ARC]
stage: [CO]
cell: ARC-CO
asset: A24
summary: "Eine höhere Montage verteilt die Strahlungswärme auf eine größere Fläche, aber mit geringerer Intensität; das Abstandsquadratgesetz und die Mindesthöhen von Bromic erklären den Zielkonflikt."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Wie verändert die Montagehöhe eines Heizstrahlers die Wärmeintensität?"
meta_description: "Wie die Montagehöhe Intensität und Heizfläche eines Infrarot-Heizstrahlers im Außenbereich verändert, mit den Mindesthöhen von Bromic für Wand- und Deckenmontage."
cta: {label: "Planungsleitfaden herunterladen (Ausgabe für Fachplaner)", asset: A02}
hero: l-004-012
images: []
owner_review: Mike Clifford
status: draft
gated: false
related: [ARC-CO-01, ARC-IN-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Outdoor Heating Planning Guide v1.2, Step 06"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "Wall mounts ≥72 in above floor, ceiling ≥96 in, varies with output; check local authority"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Coverage varies by model, mounting height, environment and installation conditions; Affinity controls"
    verified: true
  - id: s3
    publisher: Florida State Horticultural Society (Proceedings)
    title: "Grove heating study: radiant heat and distance (date to confirm)"
    year: null
    url: https://journals.flvc.org/fshs/article/download/99738/95709/128356
    supports: "At two and three units of distance a surface receives 1/4 and 1/9 of the radiant heat at one unit"
    verified: false
lang: de
translation_of: ARC-CO-KB1
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Raffaele Marti]]"
---
Wer einen Strahlungsheizer höher montiert, vergrößert die beheizte Fläche und senkt die Intensität, die Menschen spüren. Bei einer Quelle, die im Verhältnis zum Abstand klein ist, nimmt die Intensität mit dem Quadrat des Abstands ab: doppelter Abstand, ein Viertel der Wärme[^s3]. Lineare Heizstrahler fallen im Nahbereich weniger steil ab. Verstehen Sie die Regel daher als Richtung, nicht als Bemessungswert.

| Abstand zum Gast (relativ) | 1,0× | 1,25× | 1,5× | 2,0× |
|---|---|---|---|---|
| Relative Intensität, ideale Punktquelle | 100 % | 64 % | 44 % | 25 % |

## Was bedeutet das für die Planung?

- **Mindesthöhen einhalten.** Die Bromic-Empfehlung: Wandmontage mindestens ca. 1,83 m über dem Boden, Deckenmontage mindestens ca. 2,44 m, je nach Leistung unterschiedlich[^s1]. Prüfen Sie jedes Modell anhand seiner Installationsanleitung.
- **Hohe Decken.** Oberhalb der sinnvollen Höhe lieber weitere Heizstrahler vorsehen oder sie an Abhängestangen tiefer setzen, statt sich auf ein größeres Gerät zu verlassen.
- **Bis zu den Menschen messen.** Für Essbereiche und Lounges gilt die Kopfhöhe im Sitzen, für Bars die Kopfhöhe im Stehen.
- **Angaben zur Heizfläche setzen eine übliche Montage voraus.** Bromic weist darauf hin, dass die Heizfläche mit Montagehöhe, Umgebung und Installation variiert[^s2].

[[VERIFY: empfohlene maximale Montagehöhe und Tabelle der Heizfläche je Höhe für jedes Modell — Mike Clifford]]

Was die Höhe nicht leisten kann, regelt die Dimmung: ein Affinity Smart-Heat Dimmer (oder das Eclipse-Steuergerät für die Stufen 33/66/100 % des Eclipse), ein Wandschalter und die Bromic Smart-Heat App. WLAN- und App-Funktionen setzen kompatible Affinity Smart-Heat Controls voraus, die separat erhältlich sind[^s2].

*Montagehöhen und Abstände legen die Installationsanleitung und die örtlichen Vorschriften fest (in Deutschland u. a. DIN VDE 0100). Stimmen Sie die Installation mit Ihrem örtlichen Bauamt und einem Elektrofachbetrieb ab.* [[VERIFY: aktuelle VDE- und DVGW-Regeln für Heizstrahler im Außenbereich — Raffaele Marti]]
