# A21 — Patio heating payback (ROI calculator)

Draft 0.1.0. Cell COM-IN (also serves COM-AW), gated (lead form from `../_shared/lead.js`), CTA → A22 permit and fire-code
checklist (COM-PP). Turns heated patio seats into a capex case: added revenue, added margin, payback in months.

The visitor picks a venue picture (a starting profile of seats and shoulder season, every part a placeholder they change), sets
the trade (seats, average check, margin, turns), taps the months heat keeps the patio open (`seasonNights` gives the extra nights),
sets the capture rate, and picks a state for the electricity price (A20's `state-prices.json`, EIA). Heaters are sized from the
seats (`autoHeaters`: seats × ft² a seat ÷ coverage) and the installed cost is heaters × an all-in cost a heater (a placeholder).
The result card shows the payback, a seat grid, a revenue-to-net waterfall, the cash position by month for three years
(`cash`) with the break-even month, and payback at other capture rates. Venue photos come from A20's `images.json`.

## Files

| File | Role |
|---|---|
| `config.json` | Every default, each with unit, source, owner and verify status. **Edit this, not the page.** |
| `logic.js` | Pure functions (`FIELDS`, `defaults`, `normalise`, `addedRevenue`, `runningCost`, `kwhPerYear`, `paybackMonths`, `evaluate`, `roi`). No DOM, no imports. |
| `index.html` | The page; `node tools/build-config.mjs` inlines brand.css, config.json, logic.js and lead.js between the `@inline` markers. |
| `config.js` | Generated from config.json. Do not edit. |
| `test.mjs` | `node tools/A21-roi/test.mjs` (6 cases; also run by `node app/test/tools.mjs`). |

## The maths (COM-IN-01)

```
Added revenue   = heated seats × turns × average check × extra nights × capture %
Added margin    = added revenue × contribution margin %
Running cost    = heaters × kW × hours a night × extra nights × $/kWh
Net annual gain = added margin − running cost
Payback months  = installed cost ÷ (net annual gain ÷ 12)      (none if net gain ≤ 0)
```

## Margin basis — what makes 18.3 months

The article's worked example is the config default and test case 1: 40 × 1.5 × $45 × 60 × 50% = **$81,000**;
× **30% contribution margin** (gross margin after food, drink and variable labour) = $24,300; less running cost of
7 × 4.5 kW × 5 h × 60 nights = 9,450 kWh × $0.1407 = $1,330; net $22,970 = $1,914 a month; $35,000 ÷ $1,914 =
**18.3 months**.

| Basis | Payback on $35,000 |
|---|---|
| Revenue ($81,000) | 5.2 months — overstates the return |
| 30% margin before running cost ($24,300) | 17.3 months |
| **30% margin after running cost ($22,970)** | **18.3 months — the basis used, on the page and here** |

Test 2 reproduces the article's sensitivity table (25% → $40,500 / $10,820 / about 39 months; 75% → $121,500 / $35,120 /
about 12 months). The report also shows the low/mid/high table and the capture rate needed for a 12-month payback (about 75%).

## Inputs beyond the brief

The brief lists seats, check, turns, nights, capture, margin and installed cost. Running cost (heaters, kW, hours a night,
$/kWh) is added because the article's 18.3 months depends on it. Set heaters to 0 to leave it out.

## Every default is an assumption

All revenue defaults and the installed cost are the article's illustrative inputs, **not benchmarks**:
`[[VERIFY: benchmarks — Hospitality sales]]`. The installed cost is also tagged "Placeholder" on the page: it is not a Bromic price.
The page says so above the inputs, and the report lists every assumption with its status.

## Controls

The running-cost heater is Platinum Smart-Heat Electric 4500W with Affinity Smart-Heat Dimmer or On/Off controller and a wall
switch per zone, and the Bromic Smart-Heat app. Wi-Fi and app features require compatible Affinity Smart-Heat controls, sold
separately. Shown in the teaser and the report; the installed-cost hint says to include controls.

## Every config value

| Config path | Value | Unit | Source | Owner | Status |
|---|---|---|---|---|---|
| `cta.href` | "#A22-permit-checklist" | url | Next-stage asset per data/journey-matrix.json (COM-IN → COM-PP, A22 permit & fire-code checklist). Placeholder anchor until the A22 page has a URL | 454 Creative | [[VERIFY: live URL of the A22 permit and fire-code checklist — 454 Creative]] |
| `revenue.heated_seats` | 40 | seats inside heated coverage | COM-IN-01 worked example (illustrative input, not a benchmark) | Hospitality sales | [[VERIFY: benchmarks — Hospitality sales]] |
| `revenue.average_check` | 45 | $ revenue per guest | COM-IN-01 worked example (illustrative input, not a benchmark) | Hospitality sales | [[VERIFY: benchmarks — Hospitality sales]] |
| `revenue.turns_per_night` | 1.5 | seatings per seat per evening | COM-IN-01 worked example (illustrative input, not a benchmark) | Hospitality sales | [[VERIFY: benchmarks — Hospitality sales]] |
| `revenue.extra_nights` | 60 | nights a year the patio opens that it would not unheated | COM-IN-01 worked example (illustrative input, not a benchmark) | Hospitality sales | [[VERIFY: benchmarks — Hospitality sales]] |
| `revenue.capture_pct` | 50 | % of heated seats filled on those nights | COM-IN-01 worked example (illustrative input, not a benchmark); the article advises starting low | Hospitality sales | [[VERIFY: benchmarks — Hospitality sales]] |
| `revenue.margin_pct` | 30 | % contribution (gross) margin: revenue left after food, drink and variable labour | COM-IN-01 worked example (illustrative input, not a benchmark). This is the basis that gives the article's 18.3-month payback | Hospitality sales | [[VERIFY: benchmarks — Hospitality sales]] |
| `running.heaters` | 7 | heaters | COM-IN-01 worked example: 40 seats × 20 ft² ÷ (143 × 0.85) = 6.6 → 7 (templates/calculation-model.md) | Hospitality sales | [[VERIFY: benchmarks — Hospitality sales]] |
| `running.kw_per_heater` | 4.5 | kW per heater | Lookbook 2026 p.21 (Platinum Smart-Heat Electric 4500W); data/product-facts.json | Product team | [[VERIFY: sign-off of product-facts.json — Product team]] |
| `running.hours_per_night` | 5 | heated hours per extra night | COM-IN-01 worked example (illustrative input) | Hospitality sales | [[VERIFY: benchmarks — Hospitality sales]] |
| `running.price_kwh` | 0.1407 | $/kWh | EIA Monthly Energy Review: US commercial average retail electricity price, Jan–May 2026, 14.07¢/kWh (COM-IN-01 source s2). https://www.eia.gov/totalenergy/data/monthly/ | Digital marketing | [[VERIFY: 2026 commercial $/kWh; A20 uses 13.54¢ (May 2026) — align the two — Finance]] |
| `investment.installed_cost` | 35000 | $ installed: heaters, Affinity controls, wiring, permits | PLACEHOLDER: 7 heaters × the $5,000 all-in placeholder a heater (COM-IN-01 worked example). Not a Bromic price or quote | Hospitality sales | [[VERIFY: benchmarks — Hospitality sales]] |
| `investment.installed_per_heater` | 5000 | $ per heater installed, all in: heater, its share of Affinity controls, wiring, mounting, permits | PLACEHOLDER: the COM-IN-01 worked example's $35,000 for seven heaters, divided by seven. Not a Bromic price or quote | Specification and compliance | [[VERIFY: typical all-in installed cost per Platinum 4500W heater with Affinity controls — Specification and compliance]] |
| `sensitivity.capture_pcts` | [25,50,75] | % capture rates shown in the sensitivity table | COM-IN-01 sensitivity table | Hospitality sales | verified |
| `venues[0] (restaurant).profile` | {"heated_seats":40,"months":[0,0,1,0,0,0,0,0,0,0,1,0],"days_per_week":7,"hours_per_night":5} | starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night | Starting point only, not a survey: heat adds March and November, close to the COM-IN-01 example of 60 extra nights. The visitor changes every part of it. | Digital marketing | [[VERIFY: typical heated seats and shoulder season for this venue type — Digital marketing]] |
| `venues[1] (rooftop).profile` | {"heated_seats":60,"months":[0,0,1,1,0,0,0,0,0,1,1,0],"days_per_week":7,"hours_per_night":5} | starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night | Starting point only, not a survey: heat adds spring and autumn evenings. The visitor changes every part of it. | Digital marketing | [[VERIFY: typical heated seats and shoulder season for this venue type — Digital marketing]] |
| `venues[2] (hotel).profile` | {"heated_seats":30,"months":[0,0,1,1,0,0,0,0,0,1,1,0],"days_per_week":7,"hours_per_night":4} | starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night | Starting point only, not a survey: heat adds spring and autumn evenings. The visitor changes every part of it. | Digital marketing | [[VERIFY: typical heated seats and shoulder season for this venue type — Digital marketing]] |
| `venues[3] (pub).profile` | {"heated_seats":80,"months":[0,0,1,0,0,0,0,0,0,1,1,0],"days_per_week":7,"hours_per_night":5} | starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night | Starting point only, not a survey: heat adds March, October and November. The visitor changes every part of it. | Digital marketing | [[VERIFY: typical heated seats and shoulder season for this venue type — Digital marketing]] |
| `venues[4] (casual).profile` | {"heated_seats":50,"months":[0,0,1,0,0,0,0,0,0,0,1,0],"days_per_week":7,"hours_per_night":6} | starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night | Starting point only, not a survey: heat adds March and November, longer hours. The visitor changes every part of it. | Digital marketing | [[VERIFY: typical heated seats and shoulder season for this venue type — Digital marketing]] |
| `venues[5] (cafe).profile` | {"heated_seats":20,"months":[0,0,1,1,0,0,0,0,0,0,1,0],"days_per_week":7,"hours_per_night":4} | starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night | Starting point only, not a survey: heat adds cool spring and autumn days. The visitor changes every part of it. | Digital marketing | [[VERIFY: typical heated seats and shoulder season for this venue type — Digital marketing]] |
| `sizing.ft2_per_seat` | 20 | ft² of heated patio a seat, aisles and breathing room included | NAFEM space-planning chart as published in the Restaurant Furniture seating capacity guide (https://www.restaurant-furniture.com/resources/guides/restaurant-seating-capacity-guide): full-service dining 12–15 ft² a seat, fine dining 18–20. The top of the range is used so tables are not crammed (owner, 30 Oct 2026) | Digital marketing | [[VERIFY: open the NAFEM chart itself and confirm the 18–20 ft² fine-dining figure — Digital marketing]] |
| `sizing.coverage_ft2` | 143 | ft² per heater | Lookbook 2026 p.21 (top of the 65–143 ft² range mapped to the 4500W Platinum); same basis as A20 | Product team | [[VERIFY: coverage of the 4500W model — Product team]] |
| `sizing.derate` | 0.85 | × coverage (partly covered, cool evenings) | templates/calculation-model.md: the A03 factors for the default site, partly covered (1.0) × cool (0.85) | Product team | [[VERIFY: A03 cover and climate factors — Product team]] |
