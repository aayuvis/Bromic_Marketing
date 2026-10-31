---
id: A03
type: tool
title: "Wie viele Heizstrahler braucht Ihre Fläche? Der Bedarfsrechner"
audience: [RES]
stage: [CO]
cell: RES-CO
asset: A03
summary: "Form, Größe, Überdachung, Klima und ein angetipptes Heizstrahler-Bild rein; ein maßstäblicher Plan, die Anzahl der Heizstrahler, das passende Modell und die zugehörige Steuerung raus. Der vollständige Bericht liegt hinter dem Kontaktformular."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Wie viele Heizstrahler brauche ich für meine Terrasse?"
meta_description: "Geben Sie Größe, Überdachung und Klima Ihrer Terrasse ein. Sehen Sie, wie viele Bromic-Heizstrahler sie braucht, welche Modelle passen und welche Steuerung sie bedient."
cta: {label: "Planungsgespräch buchen", asset: A07}
hero: l-010-067
owner_review: Brian Kim + 454 Creative
status: draft
gated: true
related: [RES-PP-01, COM-IN-KB1, RES-CO-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Nominal coverage per model (Platinum Electric 65–143 ft², Eclipse about 121 ft², Tungsten Freestanding Gas about 215 ft²) and the Affinity controls"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "The Official Outdoor Heating Planning Guide, US v1.2"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "Outdoor = at least 30% of the perimeter permanently open; minimum mount heights 72 in (wall) and 96 in (ceiling); colder climates need more heaters"
    verified: true
lang: de
translation_of: A03
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Raffaele Marti]]"
---
**Was der Rechner leistet.** Hausbesitzer wählen die Form der Fläche (Rechteck, L, U oder Innenhof, lang und schmal, rund), geben ihre Größe ein,
wie stark sie überdacht ist und wie kühl ihre Abende werden, und tippen dann auf ein Heizstrahler-Bild (oder „Hilfe bei der Auswahl“). Jede Heizstrahler-Karte zeigt ihre eigene
Anzahl live an. Als Antwort zeigt die Seite einen maßstäblichen Plan der Fläche, auf dem die Reichweite jedes Heizstrahlers als Lichtschein erscheint, die Anzahl der Heizstrahler, das am besten passende Modell und die Steuerung,
die es bedient: ein Affinity Smart-Heat On/Off, ein Dimmer oder das Eclipse-Steuergerät, ein Wandschalter und die Bromic Smart-Heat App. WLAN- und App-Funktionen
setzen kompatible Affinity-Steuerungen voraus, die separat erhältlich sind.

**Eingaben.** Form · Seitenlängen oder Durchmesser (m) · Heizstrahler-Familie (Bildkarten) · Überdachung: offen, teilweise überdacht, überdacht · Klima: mild, kühl, kalt · Energie: Strom, Gas,
beides · Bauform: Einbau, freistehend, beides · Montagehöhe (m) · Zonen.

**Ergebnisse.** Auf dem Bildschirm: die Anzahl, das empfohlene Modell und sein Steuerungspaket. Hinter dem Formular: jedes passende Modell, die Steuerung für
jedes, die elektrische Last und die Annahmen.

**Annahmen.** Die Heizflächen stammen aus dem Lookbook 2026[^s1]. Die Faktoren für Überdachung, Klima und Höhe sind die Bromic-Empfehlungen von 2021,
in Zahlen übersetzt[^s2], und warten auf die Freigabe durch Mike Clifford. Eine Fläche, deren Umfang zu weniger als 30 % offen ist, geht an das Planungs-
team. Tungsten Coastal und Tungsten Select sind demnächst erhältlich und zeigen eine Spanne, nie eine einzelne Anzahl. Jeder Wert, seine Quelle und sein Verantwortlicher: `tools/A03-sizing/README.md`.

**Wohin der Kontakt geht.** Das HubSpot-Formular (`forms/hubspot-form-spec.md`) mit `asset_id=A03`, `matrix_cell=RES-CO`, den UTM-Feldern
und den Eingaben des Rechners als `tool_inputs`. Ein abgeschlossener Rechnerdurchlauf zählt +15 Punkte. Als nächster Schritt wird ein Planungsgespräch angeboten (A07).

Dies ist eine erste Schätzung, keine Planung. Stimmen Sie jede Installation mit Ihrem örtlichen Bauamt und einem Elektrofachbetrieb
oder Gasinstallateur ab; maßgeblich sind DIN VDE 0100 sowie DVGW-TRGI (Erdgas) und TRF (Flüssiggas).
