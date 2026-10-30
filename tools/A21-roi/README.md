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
| `test.mjs` | `node tools/A21-roi/test.mjs` (5 cases; also run by `node app/test/tools.mjs`). |

## The maths (COM-IN-01)

```
Added revenue   = heated seats × turns × average check × extra nights × capture %
Added margin    = added revenue × contribution margin %
Running cost    = heaters × kW × hours a night × extra nights × $/kWh
Net annual gain = added margin − running cost
Payback months  = installed cost ÷ (net annual gain ÷ 12)      (none if net gain ≤ 0)
```

## Margin basis — what makes 15.5 months

The article's worked example is the config default and test case 1: 40 × 1.5 × $45 × 60 × 50% = **$81,000**;
× **30% contribution margin** (gross margin after food, drink and variable labour) = $24,300; less running cost of
6 × 4.5 kW × 5 h × 60 nights = 8,100 kWh × $0.1407 = $1,140; net $23,160 = $1,930 a month; $30,000 ÷ $1,930 =
**15.5 months**.

| Basis | Payback on $30,000 |
|---|---|
| Revenue ($81,000) | 4.4 months — overstates the return |
| 30% margin before running cost ($24,300) | 14.8 months |
| **30% margin after running cost ($23,160)** | **15.5 months — the basis used, on the page and here** |

Test 2 reproduces the article's sensitivity table (25% → $40,500 / $11,010 / about 33 months; 75% → $121,500 / $35,310 /
about 10 months). The report also shows the low/mid/high table and the capture rate needed for a 12-month payback.

## Inputs beyond the brief

The brief lists seats, check, turns, nights, capture, margin and installed cost. Running cost (heaters, kW, hours a night,
$/kWh) is added because the article's 15.5 months depends on it. Set heaters to 0 to leave it out.

## Every default is an assumption

All revenue defaults and the installed cost are the article's illustrative inputs, **not benchmarks**:
`[[VERIFY: benchmarks — Blake Petty]]`. The installed cost is also tagged "Placeholder" on the page: it is not a Bromic price.
The page says so above the inputs, and the report lists every assumption with its status.

## Controls

The running-cost heater is Platinum Smart-Heat Electric 4500W with Affinity Smart-Heat Dimmer or On/Off controller and a wall
switch per zone, and the Bromic Smart-Heat app. Wi-Fi and app features require compatible Affinity Smart-Heat controls, sold
separately. Shown in the teaser and the report; the installed-cost hint says to include controls.

## Every config value

| Config path | Value | Unit | Source | Owner | Status |
|---|---|---|---|---|---|
| `cta.href` | "#A22-permit-checklist" | url | Next-stage asset per data/journey-matrix.json (COM-IN → COM-PP, A22 permit & fire-code checklist). Placeholder anchor until the A22 page has a URL | 454 Creative | [[VERIFY: live URL of the A22 permit and fire-code checklist — 454 Creative]] |
| `revenue.heated_seats` | 40 | seats inside heated coverage | COM-IN-01 worked example (illustrative input, not a benchmark) | Blake Petty | [[VERIFY: benchmarks — Blake Petty]] |
| `revenue.average_check` | 45 | $ revenue per guest | COM-IN-01 worked example (illustrative input, not a benchmark) | Blake Petty | [[VERIFY: benchmarks — Blake Petty]] |
| `revenue.turns_per_night` | 1.5 | seatings per seat per evening | COM-IN-01 worked example (illustrative input, not a benchmark) | Blake Petty | [[VERIFY: benchmarks — Blake Petty]] |
| `revenue.extra_nights` | 60 | nights a year the patio opens that it would not unheated | COM-IN-01 worked example (illustrative input, not a benchmark) | Blake Petty | [[VERIFY: benchmarks — Blake Petty]] |
| `revenue.capture_pct` | 50 | % of heated seats filled on those nights | COM-IN-01 worked example (illustrative input, not a benchmark); the article advises starting low | Blake Petty | [[VERIFY: benchmarks — Blake Petty]] |
| `revenue.margin_pct` | 30 | % contribution (gross) margin: revenue left after food, drink and variable labour | COM-IN-01 worked example (illustrative input, not a benchmark). This is the basis that gives the article's 15.5-month payback | Blake Petty | [[VERIFY: benchmarks — Blake Petty]] |
| `running.heaters` | 6 | heaters | COM-IN-01 worked example (illustrative input) | Blake Petty | [[VERIFY: benchmarks — Blake Petty]] |
| `running.kw_per_heater` | 4.5 | kW per heater | Lookbook 2026 p.21 (Platinum Smart-Heat Electric 4500W); data/product-facts.json | Mike Clifford | [[VERIFY: sign-off of product-facts.json — Mike Clifford]] |
| `running.hours_per_night` | 5 | heated hours per extra night | COM-IN-01 worked example (illustrative input) | Blake Petty | [[VERIFY: benchmarks — Blake Petty]] |
| `running.price_kwh` | 0.1407 | $/kWh | EIA Monthly Energy Review: US commercial average retail electricity price, Jan–May 2026, 14.07¢/kWh (COM-IN-01 source s2). https://www.eia.gov/totalenergy/data/monthly/ | Brian Kim | [[VERIFY: 2026 commercial $/kWh; A20 uses 13.54¢ (May 2026) — align the two — Brian Kim/Finance]] |
| `investment.installed_cost` | 30000 | $ installed: heaters, Affinity controls, wiring, permits | PLACEHOLDER from the COM-IN-01 worked example, not a Bromic price or quote | Blake Petty | [[VERIFY: benchmarks — Blake Petty]] |
| `sensitivity.capture_pcts` | [25,50,75] | % capture rates shown in the sensitivity table | COM-IN-01 sensitivity table | Blake Petty | verified |
