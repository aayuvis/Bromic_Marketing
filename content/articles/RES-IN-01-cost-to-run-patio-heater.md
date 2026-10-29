---
id: RES-IN-01
type: article
title: "How much does it cost to run an outdoor heater? Per-hour costs for electric, natural gas and propane"
slug: cost-to-run-patio-heater
audience: [RES]
stage: [IN]
cell: RES-IN
asset: A24
summary: "Per-hour running costs for Bromic electric and gas heaters at current US average utility rates, with the formulas to recompute them for your own bill — plus the other lines in an all-in budget."
primary_keyword: cost to run patio heater
secondary_keywords: [electric patio heater cost per hour, propane heater running cost]
ai_prompt: "How much does it cost to run a patio heater per hour?"
meta_description: "At US average rates, a 3400 W electric patio heater costs about $0.62 an hour; a 38,000 BTU gas heater $0.72–$0.97 on natural gas, $1.11 on propane."
cta: {label: "Download the Planning Guide", asset: A02}
hero: l-010-067
images: [l-019-160]
owner_review: Megan Spies
status: draft
gated: false
related: [RES-CO-01, RES-PP-01, COM-CO-01, BLD-IN-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: U.S. Energy Information Administration
    title: "Electric Power Monthly, Table 5.6.A — Average price of electricity to ultimate customers, residential (July 2026 data, as reported by ElectricRates.org and Cronista)"
    year: 2026
    url: https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a
    supports: "US average residential electricity price 18.3 ¢/kWh, July 2026"
    verified: false
  - id: s2
    publisher: U.S. Energy Information Administration
    title: "Natural Gas Prices — US residential price, monthly"
    year: 2026
    url: https://www.eia.gov/dnav/ng/ng_pri_sum_dcu_nus_m.htm
    supports: "US residential natural gas price $26.45 per thousand cubic feet (latest month shown, July 2026)"
    verified: true
  - id: s3
    publisher: U.S. Energy Information Administration (via YCharts)
    title: "US Natural Gas Residential Price, monthly"
    year: 2025
    url: https://ycharts.com/indicators/us_natural_gas_residential_price
    supports: "US residential natural gas price $19.61 per thousand cubic feet, October 2025"
    verified: true
  - id: s4
    publisher: U.S. Energy Information Administration
    title: "FAQ: How do I convert natural gas prices in dollars per cubic feet to dollars per Btu or therm?"
    year: 2026
    url: https://www.eia.gov/tools/faqs/faq.php?id=45&t=8
    supports: "2025 average heat content about 1,037 Btu per cubic foot: 1 Mcf = 10.37 therms; $/Mcf ÷ 10.37 = $/therm"
    verified: true
  - id: s5
    publisher: U.S. Energy Information Administration
    title: "Heating Oil and Propane Update — weekly residential propane price"
    year: 2026
    url: https://www.eia.gov/petroleum/heatingoilpropane/
    supports: "US average residential propane price about $2.67 per gallon, week of 30 March 2026"
    verified: true
  - id: s6
    publisher: Bromic Heating
    title: "Outdoor Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Platinum 2300/3400/4500 W; Eclipse output steps 33/66/100%; Tungsten Freestanding Gas 38,000 BTU, approx. 215 ft²; controls"
    verified: true
  - id: s7
    publisher: Bromic Heating
    title: "Official Outdoor Heating Planning Guide (US) v1.2"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "An all-in quote includes hardware, utilities, permit fees and installation"
    verified: true
---

At current US average rates, a built-in electric patio heater costs about $0.42–$0.82 an hour to run at full output, depending on wattage. A 38,000 BTU gas heater costs about $0.72–$0.97 an hour on natural gas and about $1.11 an hour on propane. Your own bill decides the real number, so the formulas are below — plug in your rate and you have it. [[VERIFY: 2026 rates — Brian Kim/Finance]]

## What does each heater cost per hour?

Running cost is energy used per hour times the price of that energy. The rates used here are the latest US averages we could source:

- **Electricity:** 18.3 ¢/kWh, US residential average for July 2026.[^s1]
- **Natural gas:** $19.61 per thousand cubic feet (Mcf) in October 2025, a shoulder-season month, and $26.45/Mcf in July 2026.[^s3][^s2] Residential gas prices swing with the season, so we show both.
- **Propane:** $2.67 per gallon, US residential average, week of 30 March 2026.[^s5]

| Heater | Energy input | Rate | Cost per hour (full output) |
|---|---|---|---|
| Platinum Smart-Heat Electric 2300 W | 2.3 kW[^s6] | $0.183/kWh | **$0.42** |
| Platinum Smart-Heat Electric 3400 W | 3.4 kW[^s6] | $0.183/kWh | **$0.62** |
| Platinum Smart-Heat Electric 4500 W | 4.5 kW[^s6] | $0.183/kWh | **$0.82** |
| Eclipse Smart-Heat Electric | [[VERIFY: wattage — Mike Clifford]] | $0.183/kWh | kW × $0.183 |
| Tungsten Smart-Heat Freestanding Gas, natural gas | 38,000 BTU/h = 0.38 therm/h[^s6] | $1.89–$2.55/therm | **$0.72–$0.97** |
| Tungsten Smart-Heat Freestanding Gas, propane | 38,000 BTU/h = 0.415 gal/h[^s6] | $2.67/gal | **$1.11** |

Rates: national averages; state and utility rates vary widely. [[VERIFY: confirm 38,000 BTU is the input rating used for fuel maths — Mike Clifford]]

## How do I calculate it for my own bill?

Three formulas, one per fuel.

**Electric:** cost per hour = kW × $/kWh
- 3400 W = 3.4 kW. 3.4 × $0.183 = $0.622 → about $0.62.

**Natural gas:** cost per hour = BTU/h ÷ 100,000 × $/therm
- First convert your price. EIA reports residential gas in $/Mcf; one Mcf is about 10.37 therms, so $/therm = $/Mcf ÷ 10.37.[^s4]
- $19.61 ÷ 10.37 = $1.891/therm. 38,000 ÷ 100,000 × $1.891 = $0.719 → about $0.72.
- $26.45 ÷ 10.37 = $2.551/therm. 0.38 × $2.551 = $0.969 → about $0.97.
- If your bill already shows $/therm, skip the conversion.

**Propane:** cost per hour = BTU/h ÷ 91,500 × $/gallon
- 38,000 ÷ 91,500 = 0.415 gallons an hour. 0.415 × $2.67 = $1.109 → about $1.11.

## What does that mean over a season?

Hours matter more than rates. Take a household that heats the patio three hours a night, 100 nights a year — 300 hours.

| Setup | Calculation | Season cost |
|---|---|---|
| Two Platinum 3400 W (covered patio) | 6.8 kW × 300 h × $0.183 | about $373 |
| One Tungsten Freestanding Gas, natural gas | 300 h × $0.72 | about $216 |
| One Tungsten Freestanding Gas, propane | 300 h × 0.415 gal × $2.67 | about $333 |

These are full-output, every-minute figures. In practice cost falls when heat is matched to need:

- **Dial it down.** Eclipse runs at 33%, 66% or 100% output; a Dimmer controller sets electric heaters below full.[^s6] [[VERIFY: power draw at reduced output is proportional to setting — Mike Clifford]]
- **Schedule it.** The Bromic Smart-Heat app sets schedules and timers so heat is on only when people are out there; it needs compatible Affinity Smart-Heat Controls, sold separately.[^s6]
- **Zone it.** Heat the dining end without the lounge end.

![Covered pool deck at night with a freestanding gas heater](img:l-019-160)

## What else goes into the all-in cost?

Running cost is the smallest line on day one. Bromic's planning guidance is to price the whole job up front: hardware, utilities, permit fees and installation.[^s7]

| Line | What drives it | Typical figure |
|---|---|---|
| Heaters | Model, wattage, finish, count | [[VERIFY: 2026 US MSRP per model — Brian Kim]] |
| Controls (required) | Affinity On/Off, Dimmer or Eclipse controller, or wall switch; app and voice need compatible Affinity controls, sold separately[^s6] | [[VERIFY: controls MSRP — Brian Kim]] |
| Mounting accessories | Recess kits, suspension poles (electric); heat deflectors, ceiling poles (gas)[^s7] | [[VERIFY: accessory MSRP — Brian Kim]] |
| Electrical work | New circuits, distance to panel, panel capacity, open or finished ceilings | Quote from a licensed electrician |
| Gas work | Line run, fittings, or propane supply | Quote from a licensed gas fitter |
| Permits | City or county | Confirm with your local building authority |
| Running cost | Hours × output × rate | Table above |

Electrical and gas work done while walls and ceilings are open costs less than retrofitting a finished space. That is the strongest argument for putting heat in the first budget — designed from the start, not added later.

## Planning checklist

- Find your rates on your last utility bill: ¢/kWh, $/therm (or $/Mcf ÷ 10.37), $/gallon.
- Decide the hours you will really use it: nights a year × hours a night.
- Size the heaters to the seating ([electric vs gas](item:RES-CO-01) has a quick method).
- Include controls in the hardware line — they are part of a working system.
- Get electrical, gas and permit quotes before you finalise the patio design.
- Confirm requirements with your local building authority and a licensed electrician or gas fitter.

## FAQ

### Is it cheaper to run an electric or gas patio heater?
Per heater-hour, a 3400 W electric heater ($0.62) costs less than the gas heater ($0.72–$0.97 on natural gas, $1.11 on propane). But one gas heater covers approx. 215 ft² against approx. 65–143 ft² for one Platinum, so compare the cost of warming your seating area, not one heater.[^s6] Use the formulas with your own rates.

### How much does a 3400 W patio heater cost per hour?
About $0.62 at the July 2026 US residential average of 18.3 ¢/kWh: 3.4 kW × $0.183.[^s1]

### How much propane does a 38,000 BTU heater use?
About 0.415 gallons an hour at full output (38,000 ÷ 91,500). At $2.67 a gallon that is about $1.11 an hour.[^s5]

### Why does my natural gas price change so much?
Residential gas prices vary by month: EIA's figure for July 2026 ($26.45/Mcf) was well above October 2025 ($19.61/Mcf).[^s2][^s3] Use the rate from the season you will heat in.

### Does dimming an electric heater save money?
Lower output uses less energy. Eclipse steps between 33%, 66% and 100%.[^s6] [[VERIFY: draw at each step — Mike Clifford]]

### Can I estimate cost before I buy?
Yes. The Bromic Planning Guide walks through sizing, utilities and an all-in budget step by step.

Get the full budget picture before you talk to a dealer — download the Bromic Planning Guide.
