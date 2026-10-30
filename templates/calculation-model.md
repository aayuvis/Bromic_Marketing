# The calculation model (every tool and every article)

One simple model, used the same way by the three tools (A03 sizing, A20 five-year cost, A21 ROI) and by every article, guide
and knowledge-base answer that does arithmetic. Owner direction (30 Oct 2026): people doing these sums think simply; keep the
variables few, the method visible, and the answer believable. If an article's worked example and a tool disagree, the model wins
and both are fixed.

## 1. Area

- Measure the **seating**, not the whole slab or deck.
- From seats: **20 ft² a seat**, aisles and breathing room included. Source: the NAFEM space-planning chart as published in the
  Restaurant Furniture seating capacity guide — full-service dining 12–15 ft² a seat, fine dining 18–20. The top of the range is
  used so tables are never crammed (owner). 40 seats = 800 ft².

## 2. How many heaters

**Overhead and built-in heaters** (wall, ceiling, recessed, pole, pendant: Platinum, Tungsten, Cobalt, Eclipse, built-in gas):

  heaters = area ÷ (coverage × cover factor × climate factor), rounded up

| Cover | Factor | Climate (evenings you heat) | Factor |
|---|---|---|---|
| Open (no roof) | 0.85 | Mild (above about 50°F) | 1.0 |
| Partly covered (pergola, umbrella, part roof) | 1.0 | Cool (about 40–50°F) | 0.85 |
| Covered (solid roof) | 1.1 | Cold (often below about 40°F) | 0.7 |

Factors live in `tools/A03-sizing/config.json` (assumptions, `[[VERIFY]]` with Mike Clifford). When an article does not know the
site, it uses **partly covered and cool** (0.85 combined), and says so.

**Freestanding heaters** (Tungsten Smart-Heat Freestanding Gas, Eclipse Freestanding): also **never more than 4 seats a heater**,
because guests block the radiant heat of a freestanding unit (owner rule, 30 Oct 2026; a patio-heater specialist's buyer guide
goes further, recommending close to one heater a guest). Count both ways and take the larger:
`max(area ÷ effective coverage, seats ÷ 4)`, rounded up. Without a seat count, seats = area ÷ 20.

Coverage figures come only from `data/product-facts.json` (Platinum 4500W 143 ft², 3400W 108, 2300W 65; Tungsten Electric
2000/3000/4000/6000W 65/100/130/160; Eclipse 121; Tungsten Freestanding Gas 215; built-in gas 160 or 215).

**Worked reference: 40 seats, partly covered, cool** → 800 ft² → Platinum 4500W: 800 ÷ (143 × 0.85) = 6.6 → **7**;
Tungsten Freestanding Gas: 800 ÷ (215 × 0.85) = 4.4, but 40 ÷ 4 = **10**.

Every heater count is followed by its controls (Affinity Smart-Heat On/Off, Dimmer or Eclipse controller, wall switch, app).

## 3. Running cost

- Electric: kW × hours × $/kWh
- Natural gas: BTU/hr ÷ 100,000 × hours × $/therm
- Propane: BTU/hr ÷ 91,500 × hours × $/gal; cylinder swaps = gallons ÷ 4.7 usable gallons a 20 lb cylinder
- Hours a year = evenings a year × hours an evening. Prices: EIA state averages (`tools/A20-tco/state-prices.json`) or the
  article's own dated, sourced rates. Prices held flat; no forecast.
- Never show Tungsten gas BTU (built-in): unpublished until verified.

## 4. Revenue and payback (A21, COM-IN-01)

added revenue = heated seats × turns a night × average check × extra nights × share of seats filled
net gain a year = added revenue × contribution margin − running cost
payback (months) = installed cost ÷ (net gain a year ÷ 12)

## What stays out

No dimming curve, no fuel escalation, no mounting-height curve and no layout allowance in the headline answer. Tools may keep
them as stated defaults in the full report, never as inputs a first-time visitor must set.

## Reference numbers used in articles (40 seats, 800 ft², partly covered, cool)

COM-CO-01 (1,000 heater hours; 14.07¢/kWh, $1.01/therm, $2.46/gal; 10 minutes a swap at $25/h):

| | Heaters | Energy a year | Fuel a year | Cylinder handling a year | Fuel + handling, 5 years |
|---|---|---|---|---|---|
| Electric, Platinum 4500W | 7 | 31,500 kWh | $4,432 | none | $22,160 |
| Natural gas, Tungsten Freestanding | 10 | 3,800 therms | $3,838 | none | $19,190 |
| Propane, Tungsten Freestanding | 10 | 4,153 gal | $10,216 | 884 swaps, 147 h, $3,683 | $69,499 |

COM-IN-01 (1.5 turns, $45 check, 60 extra nights, 30% margin, 7 × Platinum 4500W × 5 h, 14.07¢/kWh, installed 7 × $5,000
placeholder = $35,000): revenue $81,000; margin $24,300; running 9,450 kWh = $1,330; net $22,970; payback 18.3 months.
At 25% / 50% / 75% filled: 38.8 / 18.3 / 12.0 months. A one-year payback needs about 75% filled.
