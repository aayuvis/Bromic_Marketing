---
id: A20
type: tool
title: "Kosten von Flüssiggas- und Elektro-Heizstrahlern: Ihre fünf Jahre im direkten Vergleich"
audience: [COM]
stage: [CO]
cell: COM-CO
asset: A20
summary: "Sehen Sie fünf Saisons Terrassenheizung mit Strom, Erdgas und Flüssiggas nebeneinander – von Anschaffung und Installation bis zur Energie und der Personalzeit, die Gasflaschen ganz nebenbei kosten."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Ist eine elektrische oder eine Flüssiggas-Terrassenheizung für ein Restaurant über fünf Jahre günstiger?"
meta_description: "Flüssiggas oder Strom für Ihre Gastronomie-Terrasse: fünf Jahre Anschaffung, Installation, Energie und Flaschenwechsel im Vergleich, dazu Erdgas."
cta: {label: "Ihre ROI-Einschätzung anfordern", asset: A21}
hero: l-013-111
owner_review: Vertrieb Gastronomie + Digitales Marketing
status: draft
gated: true
related: [COM-CO-01, COM-CO-KB1, COM-IN-01]
updated: 2026-11-16
lang: de
translation_of: A20
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Partner Deutschland]]"
sources:
  - id: s1
    publisher: US Energy Information Administration
    title: "Electric Power Monthly, Table 5.6.A — average price of electricity to ultimate customers"
    year: 2026
    url: https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a
    supports: "Commercial electricity price default ($/kWh)"
    verified: false
  - id: s2
    publisher: US Energy Information Administration
    title: "Natural Gas Prices — commercial"
    year: 2026
    url: https://www.eia.gov/dnav/ng/ng_pri_sum_dcu_nus_m.htm
    supports: "Commercial natural gas price default, converted to $/therm"
    verified: false
  - id: s3
    publisher: US Energy Information Administration
    title: "Heating Oil and Propane Update"
    year: 2026
    url: https://www.eia.gov/petroleum/heatingoilpropane/
    supports: "Propane price default ($/gal, residential series; commercial runs differently)"
    verified: false
  - id: s4
    publisher: US Bureau of Labor Statistics via O*NET OnLine
    title: "Occupational Employment and Wage Statistics, 35-9011"
    year: 2024
    url: https://www.onetonline.org/link/localwages/35-9011.00
    supports: "Hourly wage used to cost propane cylinder exchanges"
    verified: true
---

## Fünf Saisons warmer Abende, durchgerechnet

Eine beheizte Terrasse hält Ihre Gäste draußen, lange nachdem die Sonne untergegangen ist, und der Energieträger, den Sie wählen,
bestimmt, was diese Abende über die Jahre kosten. Mit diesem Rechner vergleichen Gastronomen und Hoteliers fünf Jahre
Terrassenheizung nach Energieträger, ausgehend von vier kurzen Angaben: beheizte Sitzplätze, wie stark die Terrasse überdacht ist,
wie kalt die Abende sind und der US-Bundesstaat (er bestimmt die Energiepreise der EIA), dazu die Abende pro Jahr und die Stunden
pro Abend.

Die Heizstrahler werden nach templates/calculation-model.md bemessen: ca. 1,9 m² je Sitzplatz; elektrische Deckenstrahler nach
Fläche mit den Faktoren für Überdachung und Klima; freistehende Gasstrahler mit höchstens vier Sitzplätzen je Gerät. Die
Gesamtsumme jeder Variante vereint Anschaffung, Installation, Wartung, Energie und bei Flüssiggas die Personalzeit für den
Flaschenwechsel. Die Ergebniskarte zeigt die drei Summen, die Energiekosten pro Tag und die laufende Summe Jahr für Jahr.

## Was Sie uns sagen

Beheizte Sitzplätze · Überdachung (offen, teilweise überdacht, überdacht) · Abende (mild, kühl, kalt) · US-Bundesstaat · Abende pro
Jahr · Stunden pro Abend. Unter „Eigene Werte verwenden“ legen Sie Energiepreise, Anzahl der Heizstrahler sowie Anschaffung und
Installation je Gerät fest. Für einen Betrieb in Deutschland tragen Sie hier Ihre eigenen Preise je kWh und je Liter oder Kilogramm
Flüssiggas ein. [[VERIFY: deutsche Eingabemaske ohne US-Bundesstaat und mit Preisen je kWh, Liter bzw. kg — Vertrieb Gastronomie + Digitales Marketing]]

## Was Sie erfahren

Auf dem Bildschirm sehen Sie die Fünf-Jahres-Summe je Energieträger und welcher am günstigsten ist. Wenn Sie Ihre Kontaktdaten
teilen, ergänzt der vollständige Bericht die Tabelle Jahr für Jahr, die Energierechnung sowie die Heizstrahler und die Steuerung,
die für jede Variante angesetzt sind.

## Die Überlegungen hinter den Zahlen

Die Energiekosten pro Stunde werden einfach gerechnet: Strom = kW × Preis je kWh; Erdgas = kW Nennwärmebelastung × Preis je kWh (in
Deutschland wird Erdgas je kWh abgerechnet); Flüssiggas = kW ÷ ca. 7,09 kWh je Liter × Preis je Liter. Die Preisvorgaben sind
US-Daten der EIA[^s1][^s2][^s3] und warten auf die Bestätigung der gewerblichen Tarife für 2026 durch die Finanzabteilung. Die
Personalzeit wird mit dem US-Medianlohn des BLS bewertet[^s4]. **Die Vorgaben für Anschaffung und Installation sind Platzhalter,
keine Bromic-Preise**, und die Seite sagt das auch. Jeder Wert, jede Quelle und jeder Verantwortliche steht in
`tools/A20-tco/README.md`.

## Wohin Ihre Anfrage geht

Fertige Vergleiche kommen über das HubSpot-Formular mit `asset_id=A20`, `matrix_cell=COM-CO` und den Eingaben als `tool_inputs` an.
Eine abgeschlossene Berechnung zählt +15 Punkte, und als nächsten Schritt bieten wir den Umsatz-ROI-Rechner an (A21).
