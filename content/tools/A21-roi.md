---
id: A21
type: tool
title: "Patio revenue ROI calculator: what heated seats are worth"
slug: patio-heater-roi-calculator
audience: [COM]
stage: [AW, IN]
cell: COM-IN
asset: A21
summary: "Heated seats × turns × average check × the extra nights heating opens, at the share you expect to fill: added revenue, added margin and payback on the installed cost."
primary_keyword: patio heater roi
secondary_keywords: [restaurant patio heater payback, outdoor dining revenue calculator]
ai_prompt: "How long does it take a restaurant to pay back patio heaters?"
meta_description: "Estimate the revenue heated patio seats add, the margin they earn and how many months patio heaters take to pay back."
cta: {label: "Book a design consult", asset: A07}
hero: p-003-006
owner_review: Blake Petty + Brian Kim
status: draft
gated: true
related: [COM-IN-01, COM-AW-01, COM-CO-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Restaurant patio heater ROI: payback, worked example (COM-IN-01, draft)"
    year: 2026
    url: content/articles/COM-IN-01-patio-heater-roi-restaurant-payback.md
    supports: "Worked example and its assumptions: 40 seats × 1.5 turns × $45 × 60 nights × 50% capture = $81,000"
    verified: true
---

**What it does.** An operator sees what heating the patio could add: the extra revenue from nights they could not seat outside
before, the margin on it, and how many months the installed cost takes to pay back. Seven inputs; the heaters are sized from the
seats and the electricity price comes from the state (EIA). The result card shows a seat grid, where each added dollar goes, the cash position month by month with
the break-even point, and payback at other shares of seats filled.

**Inputs.** Heated seats · average check · turns a night · contribution margin % · extra evenings a year · share of seats filled ·
state (electricity price). Under "Use your own numbers": heaters (sized from the seats by templates/calculation-model.md), installed
cost a heater (placeholder), heated hours an evening, electricity price.

**Outputs.** On screen: added revenue a year and payback in months. Behind the form: margin, a sensitivity view and the heaters and
controls the installed cost should cover (Affinity Smart-Heat controller, wall switch, app).

**Assumptions.** Every default is an illustration, not a benchmark, flagged [[VERIFY: benchmarks — Blake Petty]] in the config. The
first test case is the worked example in COM-IN-01[^s1]. Every value, source and owner: `tools/A21-roi/README.md`.

**Where the lead goes.** The HubSpot form with `asset_id=A21`, `matrix_cell=COM-IN` and the inputs as `tool_inputs`. A21 is an
intent asset (+30). The next step offered is a design consult (A07).
