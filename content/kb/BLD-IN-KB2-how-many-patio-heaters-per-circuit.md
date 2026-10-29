---
id: BLD-IN-KB2
type: kb
title: "How many patio heaters can go on one circuit?"
slug: how-many-patio-heaters-per-circuit
audience: [BLD]
stage: [IN]
cell: BLD-IN
asset: A16
summary: "How many 2300, 3400 or 4500 W electric heaters fit on a 15, 20 or 30 A 240 V circuit, using the 125% continuous-load rule, and why one per circuit is usually better."
primary_keyword: patio heaters per circuit
secondary_keywords: [patio heater wiring, outdoor heater rough in]
ai_prompt: "How many heaters per circuit?"
meta_description: "At 240 V, a 20 A circuit carries one 2300 W or one 3400 W heater; a 30 A circuit, one 4500 W or two 2300 W. One per circuit is simplest."
cta: {label: "Download the pre-wire guide", asset: A16}
hero: l-010-070
owner_review: Arvin Avaness
status: draft
gated: false
related: [BLD-IN-01, BLD-IN-KB1, BLD-PP-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Platinum Smart-Heat Electric 2300, 3400, 4500 W; Affinity Smart-Heat Controls"
    verified: true
  - id: s2
    publisher: EC&M
    title: "Understanding requirements for appliances (NEC Article 422)"
    year: 2020
    url: https://www.ecmweb.com/code-basics/understanding-requirements-appliances
    supports: "Continuous load = 3 hours or more; branch circuit at not less than 125% of the continuous load"
    verified: true
  - id: s3
    publisher: Mike Holt forums (practitioner discussion of NEC 424.4)
    title: "Branch circuit for heaters"
    year: 2023
    url: https://forums.mikeholt.com/threads/branch-circuit-for-heaters.2590116
    supports: "Discussion that NEC 424.4(A) limits branch circuits supplying two or more fixed heating outlets to 30 A"
    verified: false
---

On a 240 V circuit, a heater load can use up to 80% of the breaker rating, because a continuous load is sized at 125%[^s2]. That means a 20 A circuit carries one 2300 W or one 3400 W heater, and a 30 A circuit carries one 4500 W heater or two 2300 W heaters. For most builds, one heater per circuit is the better answer.

*Planning guidance only. Confirm with a licensed electrician, the installation manual and the local building authority.*

## What fits on each circuit at 240 V?

Usable load = breaker × 0.8 × 240 V.

| Breaker | Usable continuous load | Fits (Platinum wattages[^s1]) |
|---|---|---|
| 15 A | 12 A, 2,880 W | One 2300 W |
| 20 A | 16 A, 3,840 W | One 2300 W or one 3400 W |
| 30 A | 24 A, 5,760 W | One 4500 W; two 2300 W (4,600 W); or one 2300 W + one 3400 W (5,700 W) |

At 208 V the usable wattage falls by about 13%: a 30 A circuit gives about 4,990 W, so two 2300 W heaters (4,600 W) still fit, but 2300 W + 3400 W does not.

## Is there a cap on shared heater circuits?

Possibly. Practitioners read NEC 424.4(A) as limiting a branch circuit that feeds two or more fixed heating outlets to 30 A [[VERIFY: confirm 424.4(A) text in the adopted NEC edition and whether outdoor radiant heaters fall under Article 424 or 422 — licensed electrician / Mike Clifford]][^s3]. Do not plan a 40 A shared circuit without checking.

## Why is one heater per circuit usually better?

- **Zoning.** Each heater, or each zone, gets its own Affinity Smart-Heat On/Off or Dimmer controller and wall switch.
- **Fault-finding.** A trip affects one heater, not the whole patio.
- **Controller load.** Each controller has a maximum load [[VERIFY: Affinity controller load rating — Mike Clifford]].
- **Upgrades.** A buyer stepping from one tier to the next adds a heater without re-wiring a shared run.

App, schedule and voice control need compatible Affinity Smart-Heat Controls, sold separately[^s1].

## Checklist

- Add every heater's watts on the circuit; divide by volts; × 1.25.
- Stay within 80% of the breaker and within each nameplate maximum.
- Check controller load ratings.
- Default to one heater per circuit.

[^s1]: Bromic, Lookbook 2026.
[^s2]: EC&M, NEC appliance requirements (Article 422; Article 100 continuous load).
[^s3]: Mike Holt forums, discussion of NEC 424.4.
