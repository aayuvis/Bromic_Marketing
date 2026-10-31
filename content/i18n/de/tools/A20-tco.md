---
id: A20
type: tool
title: "Fünf-Jahres-Kosten der Terrassenheizung: Strom, Erdgas und Flüssiggas"
audience: [COM]
stage: [CO]
cell: COM-CO
asset: A20
summary: "Stellt elektrische, Erdgas- und Flüssiggas-Heizstrahler über fünf Jahre nebeneinander: Anschaffung, Installation, Energie und die Personalzeit, die Gasflaschen kosten."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Ist eine elektrische oder eine Flüssiggas-Terrassenheizung für ein Restaurant über fünf Jahre günstiger?"
meta_description: "Vergleichen Sie die Fünf-Jahres-Kosten von Elektro-, Erdgas- und Flüssiggas-Heizstrahlern für die Gastronomie: Anschaffung, Installation, Energie und Flaschenwechsel."
cta: {label: "Ihre ROI-Einschätzung anfordern", asset: A21}
hero: l-013-111
owner_review: Blake Petty + Brian Kim
status: draft
gated: true
related: [COM-CO-01, COM-CO-KB1, COM-IN-01]
updated: 2026-10-29
lang: de
translation_of: A20
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Raffaele Marti]]"
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

**Was der Rechner leistet.** Gastronomen und Hoteliers vergleichen fünf Jahre Terrassenheizung nach Energieträger, ausgehend von vier kurzen Angaben: beheizte Sitzplätze, wie stark die Terrasse überdacht ist, wie kalt die Abende sind und der US-Bundesstaat (er bestimmt die Energiepreise der EIA), dazu die Abende pro Jahr und die Stunden pro Abend. Die Heizstrahler werden nach templates/calculation-model.md bemessen: ca. 1,9 m² je Sitzplatz; elektrische Deckenstrahler nach Fläche mit Faktoren für Überdachung und Klima; freistehende Gasstrahler mit höchstens vier Sitzplätzen je Gerät. Die Gesamtsumme jeder Variante setzt sich aus Anschaffung, Installation, Wartung, Energie und bei Flüssiggas der Personalzeit für den Flaschenwechsel zusammen. Die Ergebniskarte zeigt die drei Summen, die Energiekosten pro Tag und die laufende Summe Jahr für Jahr.

**Eingaben.** Beheizte Sitzplätze · Überdachung (offen, teilweise überdacht, überdacht) · Abende (mild, kühl, kalt) · US-Bundesstaat · Abende pro Jahr · Stunden pro Abend. Unter „Eigene Werte verwenden“: Energiepreise, Anzahl der Heizstrahler, Anschaffung und Installation je Gerät. Für einen Betrieb in Deutschland tragen Sie hier Ihre eigenen Preise je kWh und je Liter oder Kilogramm Flüssiggas ein. [[VERIFY: deutsche Eingabemaske ohne US-Bundesstaat und mit Preisen je kWh, Liter bzw. kg — Blake Petty + Brian Kim]]

**Ausgaben.** Auf dem Bildschirm: die Fünf-Jahres-Summe je Energieträger und die günstigste Variante. Hinter dem Formular: die Tabelle Jahr für Jahr, die Energierechnung sowie die Heizstrahler und die Steuerung, die für jede Variante angesetzt sind.

**Annahmen.** Energiekosten pro Stunde: Strom = kW × Preis je kWh; Erdgas = kW Nennwärmebelastung × Preis je kWh (in Deutschland wird Erdgas je kWh abgerechnet); Flüssiggas = kW ÷ ca. 7,09 kWh je Liter × Preis je Liter. Die Preisvorgaben sind US-Daten der EIA[^s1][^s2][^s3] und warten noch auf die Bestätigung der gewerblichen Tarife für 2026 durch die Finanzabteilung. Die Personalzeit wird mit dem US-Medianlohn des BLS bewertet[^s4]. **Die Vorgaben für Anschaffung und Installation sind Platzhalter, keine Bromic-Preise**, und die Seite sagt das auch. Alle Werte, Quellen und Verantwortlichen: `tools/A20-tco/README.md`.

**Wohin die Anfrage geht.** In das HubSpot-Formular mit `asset_id=A20`, `matrix_cell=COM-CO` und den Eingaben als `tool_inputs`. Eine abgeschlossene Berechnung zählt +15 Punkte. Als nächster Schritt wird der Umsatz-ROI-Rechner (A21) angeboten.
