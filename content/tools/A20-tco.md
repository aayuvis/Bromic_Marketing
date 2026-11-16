---
id: A20
type: tool
title: "Propane Vs Electric Patio Heater Cost: Your Five Years, Side By Side"
slug: patio-heating-five-year-cost-calculator
audience: [COM]
stage: [CO]
cell: COM-CO
asset: A20
summary: "See five seasons of patio heating by electric, natural gas and propane laid side by side, from purchase and installation to fuel and the staff time propane cylinders quietly take."
primary_keyword: propane vs electric patio heater cost
secondary_keywords: [restaurant patio heater operating cost, commercial patio heater cost comparison]
ai_prompt: "Is electric or propane patio heating cheaper for a restaurant over five years?"
meta_description: "Propane vs electric patio heater cost for your restaurant: five years of purchase, install, fuel and cylinder handling, side by side with natural gas."
cta: {label: "Get your ROI assessment", asset: A21}
hero: l-013-111
owner_review: Hospitality sales + Digital marketing
status: draft
gated: true
related: [COM-CO-01, COM-CO-KB1, COM-IN-01]
updated: 2026-11-16
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

## Five Seasons Of Warm Evenings, Costed

A heated patio keeps your guests outside long after the sun has gone, and the fuel you choose shapes what those evenings cost over
the years. This calculator lets a restaurant or hotel operator compare five years of patio heating by fuel from four quick answers:
heated seats, how covered the patio is, how cold the evenings are, and the state (which sets EIA energy prices), plus evenings a
year and hours an evening.

Heaters are sized by templates/calculation-model.md: 20 ft² a seat; overhead electric by area with the cover and climate factors;
freestanding gas at no more than four seats a heater. Each option's total brings together purchase, install, service, fuel and, for
propane, the staff time spent swapping cylinders. The result card shows the three totals, the fuel cost a day and the running total
year by year.

## What You Tell Us

Heated seats · cover (open, partly covered, covered) · evenings (mild, cool, cold) · state · evenings a year · hours an
evening. Under "Use your own numbers" you can set energy prices, heater counts, purchase and install per heater.

## What You Discover

On screen you see the five-year total for each fuel and which comes out cheapest. When you share your details, the full report adds
the year-by-year table, the fuel maths and the heaters and controls assumed for each option.

## The Thinking Behind The Numbers

Fuel cost per hour is worked out simply: electric = kW × $/kWh; natural gas = BTU/h ÷ 100,000 × $/therm; propane = BTU/h ÷ 91,500 ×
$/gal. Price defaults come from EIA[^s1][^s2][^s3] and wait for Finance to confirm 2026 commercial rates. Staff time uses the BLS
median wage[^s4]. **Purchase and install defaults are placeholders, not Bromic prices**, and the page says so. Every value, source
and owner sits in `tools/A20-tco/README.md`.

## Where Your Enquiry Goes

Completed comparisons arrive through the HubSpot form with `asset_id=A20`, `matrix_cell=COM-CO` and the inputs as `tool_inputs`. A
calculator completion scores +15, and the next step we offer is the revenue ROI calculator (A21).
