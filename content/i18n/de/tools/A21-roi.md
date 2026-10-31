---
id: A21
type: tool
title: "ROI-Rechner für die Terrasse: was beheizte Plätze wert sind"
audience: [COM]
stage: [AW, IN]
cell: COM-IN
asset: A21
summary: "Beheizte Plätze × Belegungen × durchschnittlicher Bon × die zusätzlichen Abende, die eine Heizung möglich macht, bei der Auslastung, die Sie erwarten: Mehrumsatz, Mehrmarge und Amortisation der Installationskosten."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Wie lange braucht ein Restaurant, bis sich Terrassenheizstrahler amortisiert haben?"
meta_description: "Schätzen Sie, wie viel Umsatz beheizte Terrassenplätze bringen, welche Marge sie erwirtschaften und nach wie vielen Monaten sich die Heizstrahler amortisiert haben."
cta: {label: "Planungsgespräch vereinbaren", asset: A07}
hero: p-003-006
owner_review: Blake Petty + Brian Kim
status: draft
gated: true
related: [COM-IN-01, COM-AW-01, COM-CO-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Restaurant patio heater ROI: payback, worked example (COM-IN-01, draft)"
    year: 2026
    url: content/articles/COM-IN-01-patio-heater-roi-restaurant-payback.md
    supports: "Worked example and its assumptions: 40 seats × 1.5 turns × $45 × 60 nights × 50% capture = $81,000"
    verified: true
lang: de
translation_of: A21
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Raffaele Marti]]"
---

**Was er leistet.** Ein Gastronom sieht, was eine beheizte Terrasse bringen kann: den Mehrumsatz aus Abenden, an denen er bisher
draußen nicht bewirten konnte, die Marge darauf und nach wie vielen Monaten sich die Installationskosten amortisiert haben. Sieben
Eingaben; die Heizstrahler werden aus der Zahl der Plätze bemessen. Im US-Rechner kommt der Strompreis aus dem jeweiligen
Bundesstaat (EIA, US-Daten); für Deutschland verwendet der Rechner einen durchschnittlichen Strompreis für Gewerbekunden
(Eurostat, `data/regional-prices.json`), den Sie unter „Eigene Zahlen verwenden“ durch Ihren eigenen Preis je kWh ersetzen. Die Ergebniskarte zeigt ein Raster der
Plätze, wohin jeder zusätzlich eingenommene Betrag fließt, den Kassenstand Monat für Monat mit dem Break-even-Punkt und die
Amortisation bei anderen Auslastungen.

**Eingaben.** Beheizte Plätze · durchschnittlicher Bon · Belegungen pro Abend · Deckungsbeitrag in % · zusätzliche Abende pro Jahr ·
Anteil belegter Plätze · Bundesstaat (Strompreis; in Deutschland der Durchschnittspreis für Gewerbekunden). Unter „Eigene Zahlen verwenden“:
Anzahl Heizstrahler (aus den Plätzen bemessen nach templates/calculation-model.md), Installationskosten je Heizstrahler (Platzhalter),
Heizstunden pro Abend, Strompreis.

**Ergebnisse.** Auf dem Bildschirm: Mehrumsatz pro Jahr und Amortisation in Monaten. Hinter dem Formular: Marge, eine
Sensitivitätsansicht sowie die Heizstrahler und die Steuerung, die die Installationskosten abdecken sollten (Affinity Smart-Heat
Steuergerät, Wandschalter, App).

**Annahmen.** Jeder Standardwert ist ein Beispiel, kein Richtwert, und in der Konfiguration mit [[VERIFY: Richtwerte — Blake Petty]]
gekennzeichnet. Der erste Testfall ist das Rechenbeispiel aus COM-IN-01[^s1]. Alle Werte, Quellen und Verantwortlichen:
`tools/A21-roi/README.md`.

**Wohin der Lead geht.** In das HubSpot-Formular mit `asset_id=A21`, `matrix_cell=COM-IN` und den Eingaben als `tool_inputs`. A21 ist
ein Asset der Phase „Interesse“ (+30). Als nächster Schritt wird ein Planungsgespräch angeboten (A07).
