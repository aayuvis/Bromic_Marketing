---
id: BLD-IN-KB1
type: kb
title: "What size breaker does a 4500W patio heater need?"
slug: breaker-size-4500w-patio-heater
audience: [BLD]
stage: [IN]
cell: BLD-IN
asset: A16
summary: "The amperage maths for a 4500 W electric patio heater at 240 V and 208 V, the 125% continuous-load rule, and the nameplate limit."
primary_keyword: 4500w patio heater breaker size
secondary_keywords: [patio heater wiring, outdoor heater rough in]
ai_prompt: "What size breaker does a 4500W patio heater need?"
meta_description: "A 4500 W heater at 240 V draws 18.75 A; at 125% that is 23.4 A, so a 25 A breaker minimum, often 30 A on 10 AWG, within the nameplate maximum."
cta: {label: "Download the pre-wire guide", asset: A16}
hero: t-006-016
owner_review: Arvin Avaness
status: draft
gated: false
related: [BLD-IN-01, BLD-IN-KB2]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Platinum Smart-Heat Electric available in 4500 W; Affinity Smart-Heat Controls"
    verified: true
  - id: s2
    publisher: EC&M
    title: "Understanding requirements for appliances (NEC Article 422)"
    year: 2020
    url: https://www.ecmweb.com/code-basics/understanding-requirements-appliances
    supports: "Continuous load = 3 hours or more; branch circuit at not less than 125% of marked rating; OCPD not to exceed appliance marking (422.11(A))"
    verified: true
  - id: s3
    publisher: EC&M
    title: "Don't get burned by the NEC's space-heating equipment rules"
    year: 2020
    url: https://www.ecmweb.com/national-electrical-code/code-basics/article/20901105/dont-get-burned-by-the-necs-space-heating-equipment-rules
    supports: "Fixed electric space-heating branch-circuit conductors and overcurrent devices at not less than 125% of the load"
    verified: true
---

A 4500 W patio heater on 240 V draws 18.75 A. Size the circuit at 125% of that, 23.4 A, because a heater can run for three hours or more and counts as a continuous load[^s2][^s3]. The next standard breaker is 25 A; many electricians use 30 A with 10 AWG copper. Either way, the breaker must not exceed the maximum marked on the heater's nameplate[^s2].

*Planning guidance only. Confirm with a licensed electrician, the installation manual and the local building authority.*

## How is it calculated?

Current = watts ÷ volts. Then multiply by 1.25.

| 4500 W heater | Current | × 125% | Minimum standard breaker | Typical copper conductor |
|---|---|---|---|---|
| Rated 240 V, on 240 V | 18.75 A | 23.4 A | 25 A (30 A common) | 10 AWG |
| Rated 208 V, on 208 V | 21.6 A | 27.0 A | 30 A | 10 AWG |

A 20 A breaker is too small in both cases.

## What if the site is 208 V?

Order a heater rated for 208 V [[VERIFY: 208 V availability for Platinum 4500 W — Mike Clifford]]. A 240 V heater on 208 V draws less current (about 16.2 A) but delivers only about 75% of its output, roughly 3,380 W. It is an easy way to end up with a heater that never feels warm enough.

## What else sets the size?

- **Nameplate maximum.** The breaker cannot exceed it.
- **Run length.** Long runs may need a larger conductor for voltage drop.
- **Shared circuits.** Add every heater's current before applying 125%. One heater per circuit is simpler.
- **Controls.** The circuit runs through its Affinity Smart-Heat On/Off or Dimmer controller and a manual wall switch[^s1]; check the controller's load rating [[VERIFY: Affinity controller maximum load — Mike Clifford]].

## Checklist

- Nameplate watts and volts confirmed.
- Current × 1.25 calculated; next standard breaker chosen.
- Breaker within nameplate maximum.
- Conductor sized by the electrician for ampacity and run length.
- Controller and wall switch on the circuit plan.

[^s1]: Bromic, Lookbook 2026.
[^s2]: EC&M, NEC appliance requirements (Article 422; Article 100 continuous load).
[^s3]: EC&M, NEC space-heating equipment rules.
