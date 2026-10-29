---
id: A20
type: tool
title: "Five-year cost of patio heating: electric, natural gas and propane"
slug: patio-heating-five-year-cost-calculator
audience: [COM]
stage: [CO]
cell: COM-CO
asset: A20
summary: "Puts electric, natural gas and propane patio heating side by side over five years: purchase, install, fuel and the staff time propane cylinders cost."
primary_keyword: propane vs electric patio heater cost
secondary_keywords: [restaurant patio heater operating cost, commercial patio heater cost comparison]
ai_prompt: "Is electric or propane patio heating cheaper for a restaurant over five years?"
meta_description: "Compare five-year costs of electric, natural gas and propane patio heaters for a restaurant: purchase, install, fuel and cylinder handling."
cta: {label: "Get your ROI assessment", asset: A21}
hero: l-013-111
owner_review: Blake Petty + Brian Kim
status: draft
gated: true
related: [COM-CO-01, COM-CO-KB1, COM-IN-01]
updated: 2026-10-29
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

**What it does.** A restaurant or hotel operator compares five years of patio heating by fuel. Each option's total is purchase,
install, fuel and, for propane, the staff time spent swapping cylinders. A bar chart shows the three totals and the page shows the
formula behind each.

**Inputs.** Seats or ft² · heated hours a year · electricity ($/kWh), natural gas ($/therm) and propane ($/gal) prices · purchase
and install per option · cylinder exchanges a year, minutes per exchange and hourly wage.

**Outputs.** On screen: the five-year total per fuel and the cheapest. Behind the form: the year-by-year table, the fuel maths and
the heaters and controls assumed for each option.

**Assumptions.** Fuel cost per hour: electric = kW × $/kWh; natural gas = BTU/h ÷ 100,000 × $/therm; propane = BTU/h ÷ 91,500 ×
$/gal. Price defaults come from EIA[^s1][^s2][^s3] and wait for Finance to confirm 2026 commercial rates. Staff time uses the BLS
median wage[^s4]. **Purchase and install defaults are placeholders, not Bromic prices**, and the page says so. Every value, source
and owner: `tools/A20-tco/README.md`.

**Where the lead goes.** The HubSpot form with `asset_id=A20`, `matrix_cell=COM-CO` and the inputs as `tool_inputs`. A calculator
completion scores +15. The next step offered is the revenue ROI calculator (A21).
