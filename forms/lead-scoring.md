# Lead scoring — Bromic

**Status:** draft for review · **Owner:** Brian Kim (to tune) · **Updated:** 29 Oct 2026
**Source brief:** HANDOVER §9. Fields are defined in [hubspot-form-spec.md](hubspot-form-spec.md).

The FY27 target is +25% SQLs on +5% budget, with SAL→SQL conversion at 45% or higher (HANDOVER §1). The score exists to send
sales the leads that convert, and to keep everyone else in useful nurture. It is a starting point; Brian Kim tunes it against
real conversion data. Nothing here is configured in HubSpot.

---

## 1. The scoring table

| Signal | Points | How it is detected | Notes |
|---|---|---|---|
| Awareness download | +5 | Form conversion with `asset_id` in the awareness tier (§2) | |
| Consideration asset or calculator | +15 | Conversion with `asset_id` in the consideration tier, or a completed A03 or A20 lead gate | |
| Intent asset (A11, A16, BIM, A21) | +30 | Conversion with `asset_id` = A11, A13 (BIM/CAD), A16 or A21 | |
| Design request / talk to expert | +50, and route straight to sales | `bromic_design_request` submitted (A07), or "Talk to an expert" | Routes regardless of total score |
| Timing 0–3 months | +20 | `project_timing` = `0_3_months` | Re-scored if the answer changes |
| Professional role | +10 | `i_am_a` is `architect_designer`, `builder_installer` or `commercial_operator` | Dealers are routed, not scored (§4) |

Each asset scores once per contact: a second download of the same asset adds nothing. Count distinct assets from
`assets_converted`, not raw form submissions. Timing and role are property scores; they are set, not added again, on each
conversion.

---

## 2. Asset tiers

Tiers follow each asset's lifecycle stage in `data/assets.json`, with the intent list fixed by HANDOVER §9.

| Tier | Points | Assets |
|---|---|---|
| Awareness | +5 | A01 Trends 2026; A05 Lookbook (ungated, so only if a gated edition exists) |
| Consideration | +15 | A02 Planning Guide v2; A03 sizing calculator; A04 electric vs gas buyer's guide; A08 product finder quiz; A14 AIA CES course; A15 builder programme; A20 5-year TCO model |
| Intent | +30 | A11 Architect Spec Kit; A13 BIM / CAD library; A16 pre-wire guide; A21 patio revenue ROI calculator |
| Design request | +50, route to sales | A07 Design Your Space 2.0; "Talk to an expert" |
| Not yet tiered | — | A12 electrification guide, A18 builder pricing and lead-time sheet, A22 permit and fire-code checklist (pre-purchase assets, not in the §9 table). [[VERIFY: tier and points for A12, A18 and A22 — Brian Kim]] |

Ungated assets (A05, A06, A09, A10, A17, A19, A23, A24) carry no form, so they carry no form score.
[[VERIFY: whether page views of ungated assets should score (HubSpot behavioural scoring) — Brian Kim]]

---

## 3. Thresholds and lifecycle

| Lifecycle stage | Rule | Threshold |
|---|---|---|
| Lead | Any conversion with a valid email | — |
| MQL | Score at or above the MQL threshold | [[VERIFY: MQL score threshold — Brian Kim]] |
| SAL | Score at or above the SAL threshold, and sales accepts within the agreed time | [[VERIFY: SAL score threshold and acceptance SLA — Brian Kim]] |
| SQL | Sales qualifies: a real project with timing, and the contact can buy or specify | [[VERIFY: SQL definition and any score floor — Brian Kim]] |
| Design request | Bypasses thresholds: straight to the territory owner as an SQL candidate | +50 and routed |

Worked examples, to show how the table behaves. The outcomes depend on the thresholds above, which are not yet set.

| Contact | Signals | Score |
|---|---|---|
| Homeowner, researching, downloads A01 | +5 | 5 |
| Homeowner, 0–3 months, uses A03 then downloads A02 | +15 +15 +20 | 50 |
| Architect, 3–6 months, downloads A11 and the BIM library | +30 +30 +10 | 70 |
| Builder, 6–12 months, downloads A15 and A16 | +15 +30 +10 | 55 |
| Restaurant operator, 0–3 months, completes A21, then requests a design | +30 +20 +10 +50 (routed on the request) | 110 |

---

## 4. Exclusions and adjustments

Proposed rules; the points for each are Brian Kim's call.

| Rule | Action |
|---|---|
| `i_am_a` = `dealer` | Not scored; routed to the dealer queue (form spec §5) |
| Competitor email domain (Infratech, Heatscope, Heatstrip and their dealers) | Score set to 0 and suppressed from sales routing [[VERIFY: domain list — Shaughn Ritchie]] |
| Unsubscribed or hard-bounced | No marketing email; score kept for reporting only |
| Bromic or agency staff domains (454 Creative, test submissions) | Excluded from all reports [[VERIFY: internal domain list — Brian Kim]] |
| No activity for a set period | Score decay [[VERIFY: decay period and amount, or none — Brian Kim]] |
| Timing 3–6 or 6–12 months | Not in the §9 table; no points until Brian Kim decides [[VERIFY: points for 3–6 and 6–12 month timing — Brian Kim]] |

---

## 5. What to report

- Score at MQL, SAL and SQL by `i_am_a`, `matrix_cell` and first `asset_id`, so the table can be tuned against which assets
  produce SQLs, not downloads.
- SAL→SQL conversion against the 45% target (HANDOVER §1).
- Time from first conversion to SQL by audience.
- Leads in the "Needs territory" view each week (form spec §5).

Review the weights after the first full quarter of data. [[VERIFY: review date — Brian Kim]]
