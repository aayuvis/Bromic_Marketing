---
id: A21
type: tool
title: "ROI von Terrassenheizstrahlern: Entdecken Sie, was Ihre beheizten Plätze wert sind"
audience: [COM]
stage: [AW, IN]
cell: COM-IN
asset: A21
summary: "Jeder Abend, an dem Ihre Terrasse warm bleibt, ist ein weiterer Abend voller Tische. Sehen Sie, welchen Umsatz und welche Marge beheizte Plätze bringen können – aus Plätzen, Belegungen, durchschnittlichem Bon und den zusätzlichen Abenden, die eine Heizung möglich macht – und wie schnell sich die Installationskosten amortisieren."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Wie lange braucht ein Restaurant, bis sich Terrassenheizstrahler amortisiert haben?"
meta_description: "ROI von Terrassenheizstrahlern für Ihr Restaurant: Mehrumsatz beheizter Plätze, ihre Marge und nach wie vielen Monaten sich die Heizstrahler amortisieren."
cta: {label: "Planungsgespräch vereinbaren", asset: A07}
hero: p-003-006
owner_review: Vertrieb Gastronomie + Digitales Marketing
status: draft
gated: true
related: [COM-IN-01, COM-AW-01, COM-CO-01]
updated: 2026-11-16
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
native_reviewer: "[[VERIFY: native reviewer — Partner Deutschland]]"
---

## Mehr Abende mit vollen Tischen

Wenn die Terrasse warm bleibt, werden die Abende, die Sie bisher an die Kälte verloren haben, zu Abenden, an denen Ihre Gäste
draußen bleiben können. Dieser Rechner zeigt einem Gastronomen, was eine beheizte Terrasse bringen kann: den Mehrumsatz aus Abenden,
an denen er bisher draußen nicht bewirten konnte, die Marge darauf und nach wie vielen Monaten sich die Installationskosten
amortisiert haben.

Sie beantworten sieben Fragen; wir bemessen die Heizstrahler aus der Zahl der Plätze. Im US-Rechner kommt der Strompreis aus dem
jeweiligen Bundesstaat (EIA, US-Daten); für Deutschland verwendet der Rechner einen durchschnittlichen Strompreis für Gewerbekunden
(Eurostat, `data/regional-prices.json`), den Sie unter „Eigene Zahlen verwenden“ durch Ihren eigenen Preis je kWh ersetzen. Die
Ergebniskarte zeigt ein Raster der Plätze, wohin jeder zusätzlich eingenommene Betrag fließt, den Kassenstand Monat für Monat mit dem
Break-even-Punkt und die Amortisation bei anderen Auslastungen.

## Was Sie uns sagen

Beheizte Plätze · durchschnittlicher Bon · Belegungen pro Abend · Deckungsbeitrag in % · zusätzliche Abende pro Jahr · Anteil
belegter Plätze · Bundesstaat (Strompreis; in Deutschland der Durchschnittspreis für Gewerbekunden). Unter „Eigene Zahlen verwenden“
legen Sie die Anzahl der Heizstrahler fest (aus den Plätzen bemessen nach templates/calculation-model.md), die Installationskosten je
Heizstrahler (Platzhalter), die Heizstunden pro Abend und den Strompreis.

## Was Sie erfahren

Auf dem Bildschirm sehen Sie den Mehrumsatz pro Jahr und die Amortisation in Monaten. Wenn Sie Ihre Kontaktdaten teilen, ergänzt der
vollständige Bericht die Marge, eine Sensitivitätsansicht sowie die Heizstrahler und die Steuerung, die die Installationskosten
abdecken sollten (Affinity Smart-Heat Steuergerät, Wandschalter, App).

## Die Überlegungen hinter den Zahlen

Jeder Standardwert ist ein Beispiel und kein Richtwert, in der Konfiguration mit [[VERIFY: Richtwerte — Vertrieb Gastronomie]]
gekennzeichnet. Der erste Testfall ist das Rechenbeispiel aus COM-IN-01[^s1]. Jeder Wert, jede Quelle und jeder Verantwortliche steht
in `tools/A21-roi/README.md`.

## Wohin Ihre Anfrage geht

Fertige Schätzungen kommen über das HubSpot-Formular mit `asset_id=A21`, `matrix_cell=COM-IN` und den Eingaben als `tool_inputs` an.
A21 zeigt ein starkes Kaufinteresse an (+30), und als nächsten Schritt bieten wir ein Planungsgespräch an (A07).
