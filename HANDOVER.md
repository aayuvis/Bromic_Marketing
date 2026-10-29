# Bromic Heating — Content & MQL Asset Base
## Handover brief for Claude Code

**Prepared:** 29 Oct 2026 · **Sponsor:** Aayush Vishnoi, President, Global Heating · **Market:** United States first (copy must be adaptable to CA, AU, UK, EU)

---

## 1. Mission

Build the content and lead-capture asset base that turns Bromic's website traffic into qualified leads across four audiences, with the gaps concentrated in the middle of the funnel.

**Business target (FY27, Sep 2026 – Feb 2027):** +25% SQLs on +5% budget, with SAL→SQL conversion at 45% or higher.

**The strategic thesis, in one line:** only 23% of homeowners prioritize outdoor heating at the planning stage (Bromic Trends 2026, Atomik Research). Every asset exists to move heating earlier: into the architect's drawing, the builder's pre-wire, and the homeowner's first budget. Once Bromic is in the drawings or the framing, the brand decision is effectively made.

---

## 2. What's in this folder

| Path | What it is | How to use it |
|---|---|---|
| `HANDOVER.md` | This brief | Read fully before building anything |
| `CLAUDE.md` | Standing rules for every session | Auto-loaded; non-negotiables |
| `data/journey-matrix.json` | 20 cells: 4 audiences × 5 funnel stages, each with pain point, opportunity, problem to solve, MQL asset, anchor articles, keywords, AI prompt, intent, KPI | Source of truth for article briefs and asset positioning |
| `data/assets.json` | 24 assets (A01–A24) with type, priority, status, gating, stages, audiences, owner, key themes, keywords | Source of truth for the build backlog |
| `sources/` | Trends 2026 report, Lookbook 2026, Planning Guide v1.2 (2021) | Only approved source of product facts and brand voice; see the data conflicts in §6 |

Live reference: the interactive matrix artifact (Journey matrix + Asset plan tabs) mirrors the JSON. Current site: https://www.bromic.com, blog at https://www.bromic.com/blog/ (9 posts, mostly PR recaps, no keyword structure).

---

## 3. Audiences and funnel

### Audiences (personas match the FY27 creative brief)
| ID | Audience | Persona | What they need from Bromic |
|---|---|---|---|
| RES | Residential homeowner | The Outdoor Investor | Confidence to choose, a clear all-in cost, a design that looks right |
| ARC | Architect / designer | The Specifier | Fast, exact technical data; spec language; BIM; code answers |
| BLD | Builder / installer | The Spec Master | Economics, simple install, no callbacks, reliable supply |
| COM | Commercial end user (HORECA) | The Revenue Operator | Revenue case, running cost, permits, multi-site rollout |

### Funnel stages
| ID | Stage | Funnel status | Typical signal |
|---|---|---|---|
| AW | Awareness | Traffic | Social, paid, organic search |
| CO | Consideration | → MQL | Comparisons, guides, calculator use |
| IN | Intent | SAL | Repeat visits, downloads, tool completions |
| PP | Pre-purchase | SAL → SQL | Form fill, talk to an expert, design request |
| BY | Buyer | SQL → Customer | Where to buy, how to install, setup |

---

## 4. Build backlog (from `data/assets.json`)

### Priority 1: build first (10 assets)
| ID | Asset | Type | Status | Audiences | Owner (reviewer) |
|---|---|---|---|---|---|
| A01 | Trends 2026 report + HTML stats page | Report | Fix | RES, ARC, BLD | Megan Spies |
| A02 | Planning Guide v2 (homeowner, pro, commercial editions) | Guide | Fix | RES, ARC, COM | Mike Clifford + 454 Creative |
| A03 | "How many heaters?" sizing calculator | Tool | New | RES | Brian Kim + 454 Creative |
| A07 | Design Your Space 2.0 (48–72h layout + BOM) | Service / form | Fix | RES, ARC, COM | Shaughn Ritchie + Brian Kim |
| A11 | Architect Spec Kit | Kit | New | ARC | Shaughn Ritchie + Mike Clifford |
| A12 | Electrification compliance guide | Guide | New | ARC, COM | Shaughn Ritchie |
| A15 | Builder program one-pager + Good-Better-Best guide | Sales kit | New | BLD | Arvin Avaness |
| A16 | Pre-wire / rough-in guide | Guide | New | BLD | Arvin Avaness |
| A20 | Commercial 5-year TCO model | Tool | New | COM | Blake Petty + Brian Kim |
| A21 | Patio revenue ROI calculator | Tool | New | COM | Blake Petty + Brian Kim |
| A24 | SEO / AEO anchor article program (20 articles) | Article series | New | All | Megan Spies (editorial) |

P2 and P3 assets are in `data/assets.json`. Do not start them until P1 drafts are in review.

### Recommended build order
1. **Foundation** (no reviewer dependency): product facts file, article template, AEO checklist, HubSpot form spec (§8, §9, §10).
2. **A01 Trends QA** (quick win; fixes are listed in §6).
3. **A02 Planning Guide v2**: the content backbone that A03, A20 and the articles draw on.
4. **A16 Pre-wire guide** and **A11 Spec Kit**: the lock-in assets.
5. **Tools A03, A20, A21**: built config-driven so humans can fill in assumptions later.
6. **A24 articles**: 20 anchor articles, one per matrix cell, in priority order (Intent and Pre-purchase cells first).
7. **A12, A15, A07** copy and specs.

---

## 5. Brand and writing rules

**Visual (for any HTML/tool output)**
- Accent: flame `#EF4123` is the only accent, on a black, white and steel base.
- Type: Georgia for headings, Helvetica (Helvetica Neue / Arial fallback) for body.
- UPPERCASE for small labels only; sentence case everywhere else.

**Voice**
- Direct, expert, calm. No hype, no exclamation marks, no emoji.
- One CTA per asset. Use one of: book a design consult · download the spec kit · get your ROI assessment.
- Brand phrases already in use: "Extend the Moment" (campaign platform), "Heat you can feel, not see", "Designed from the start, not added later."
- Talk about people and moments, then prove it with numbers.

**Commercial rules (non-negotiable)**
- **Every heater recommendation includes the controls needed for a complete working solution** (Affinity Smart-Heat On/Off, Dimmer or Eclipse controller, wall switch, app). No asset may present controls as optional. Wi-Fi and app features require compatible Affinity controls, sold separately; say so.
- Competitor references (Infratech, Heatscope, Heatstrip) must be factual, sourced, and approved by Shaughn Ritchie before publishing. No disparagement.
- "Coming soon" products (new Tungsten Coastal and Select collections) may be featured, but always labelled "Coming soon" until Mike Clifford confirms launch.

---

## 6. Product facts and known data conflicts

Use only these facts. Anything not here is a `[[VERIFY: …]]` placeholder (see §7).

### Current range (from Lookbook 2026 unless noted)
| Product | Key facts |
|---|---|
| Tungsten Smart-Heat Electric, new **Coastal** collection (coming soon) | 316 marine-grade stainless; Black or White; Signature Diamond Pattern grille; single-post mounting; marine-grade low-clearance recessing |
| Tungsten Smart-Heat Electric, new **Select** collection (coming soon) | Black, White, Graphite; expanded fascia options; single-post mounting; low-clearance recessing |
| Tungsten Electric (both collections) | Heats approx. 64–144 ft² depending on model and size; recessed, ceiling or wall mount; gas models also available |
| Platinum Smart-Heat Electric | 2300W, 3400W, 4500W; Black or White; Classic and Marine; approx. 65–143 ft²; recessed, ceiling or wall mount |
| Eclipse Smart-Heat Electric | Approx. 121 ft²; heat output 33/66/100%; dimmable rim lighting; Black; single pole 8", 24" or 48", double pole, curved pole |
| Eclipse Smart-Heat Freestanding Electric | Approx. 121 ft²; integrated wheels; weighted base; curved arm; heat and light in one |
| Tungsten Smart-Heat Freestanding Gas | Approx. 215 ft²; 38,000 BTU; natural gas or propane; tilting head; wheels; anti-tilt design |
| Affinity Smart-Heat Controls | On/Off, Dimmer, Eclipse controllers, manual wall switch, Bromic Smart-Heat app (zones, schedules, timers); works with Amazon Alexa, Google Assistant, Control4, Crestron, Lutron (compatibility varies; may need extra integration hardware) |
| Also on site, not in Lookbook | Platinum Gas, Tungsten Gas (built-in), Platinum Electric Marine, Cobalt Electric. Get facts from bromic.com product pages and mark them `[[VERIFY]]` |

### Technical principles (Planning Guide, still valid)
- Outdoor = at least 30% of the perimeter permanently open. Partial covers create a "heat cloud" (convective boost).
- Radiant heat warms people and objects, not air, so it works in wind; forced air does not work outdoors.
- Wavelength: short wave about 90% radiant, warms instantly; medium about 60% radiant, about 30-second warm-up; long wave about 40% radiant, about 5-minute warm-up, most wind-sensitive.
- Codes (US): electric follows ANSI/NFPA 70, with wall mounts at 72" minimum above floor and ceiling mounts at 96" minimum (varies with output). Gas follows ANSI Z223.1/NFPA 54. Certification marks: Intertek, UL, CSA. Always add: check with the local building authority.
- Accessories: recess kits and suspension poles (electric); heat deflectors and ceiling poles (gas).

### Conflicts you must not paper over
| Topic | Planning Guide v1.2 (2021) | Current source | Rule |
|---|---|---|---|
| Tungsten Electric coverage | 65–108 ft² | 64–144 ft² (Lookbook) | Use the Lookbook; flag to Mike Clifford |
| Platinum Electric coverage | 65–108 ft² | 65–143 ft² (Lookbook) | Use the Lookbook |
| Tungsten gas output | 39,800 BTU (diagram) | 38,000 BTU (Lookbook, freestanding) | Do not publish a number until verified |
| Running cost per hour (200 ft²) | NG $0.40, propane $2.50, electric $0.88 | none | 2021 prices; recompute with sourced 2026 utility rates, show the formula, mark `[[VERIFY]]` |
| Product naming | "500 series" | Tungsten, Platinum, Eclipse | Never use legacy naming |
| Controls | "Optional Step 08" | Required (commercial rule) | Controls are a required step in v2 |
| Product range | No Eclipse, no app | Full current range | v2 must cover the current range |

### Trends 2026 report: QA fixes (asset A01)
- Typos: "Sturdies" (p.6, trend 04), "radient" (p.8, trend 06), "intgration" (p.10, trend 08), "Mulit-Use" (p.11, trend 09), "begining" (p.12, trend 10).
- Broken sentence on p.6 (trend 04): "a desire for lifestyle upgrades centered."
- The p.10 Bromic Insight (trend 08, smart controls) sits on the design-led page; rewrite it to match the page.
- Stats need exact citations (survey year, question, base): 55% vs 40% from AIA, 39% infrared heater popularity (AIA), 61.8% patios (NAHB), $522B (Harvard JCHS LIRA), 95% cost recovery and 9.9 score (NAR), 67%, 94% and 23% (Atomik Research). Unverified stats get removed, not softened.
- Deliverable: a corrections list for the PDF, plus an HTML stats page (one stat per H2, source line, FAQ schema) built to be cited by AI search.

---

## 7. Accuracy rules

1. **Never invent** a spec, price, statistic, customer name, quote, code requirement, or keyword volume.
2. Anything unknown becomes an inline placeholder: `[[VERIFY: what is needed — suggested owner]]`. Keep a running list in `reviews/open-questions.md`.
3. Every statistic gets a source line: publisher, study, year.
4. Code and permit content (A12, A22, the A16 electrical content) carries a disclaimer to confirm with the local authority and a licensed electrician or gas fitter. It never states a city rule as fact without a linked primary source.
5. Keyword volume tiers in the JSON are **directional estimates**. Use them for prioritization only, never in published copy. Brian Kim validates them before the calendar locks.
6. Do not reproduce third-party copyrighted text. Paraphrase and cite.

---

## 8. Output formats and repo layout

```
bromic-asset-base/
├─ CLAUDE.md  HANDOVER.md
├─ data/              assets.json, journey-matrix.json, product-facts.json (you create, §6)
├─ sources/           original PDFs (read-only)
├─ articles/          <cell-id>-<slug>.md   e.g. BLD-IN-pre-wire-patio-heaters.md
├─ guides/            A02-planning-guide-v2/{homeowner,pro,commercial}.md, A16-…, A12-…
├─ kits/              A11-spec-kit/ (CSI 3-part spec .md, detail list, coverage table), A15-builder-kit/
├─ tools/             A03-sizing/, A20-tco/, A21-roi/  (each: index.html + config.json + README.md)
├─ forms/             hubspot-form-spec.md, lead-scoring.md
├─ templates/         article-template.md, aeo-checklist.md
└─ reviews/           open-questions.md, review-log.md
```

### Articles (A24 and all supporting posts)
Markdown with YAML frontmatter:
```yaml
---
id: BLD-IN-01
title: "Pre-wiring a patio for outdoor heaters: rough-in checklist for builders"
slug: pre-wire-patio-outdoor-heaters
audience: Builder / installer
stage: Intent
primary_keyword: pre wire patio heater
secondary_keywords: [patio heater wiring, outdoor heater rough in]
ai_prompt: "What wiring should I rough in for patio heaters?"
meta_description: "<=155 chars"
mql_asset: A16
cta: "Download the pre-wire guide"
owner_review: Arvin Avaness
status: draft
---
```
**Body structure (AEO):**
- The first 2–3 sentences directly answer the AI prompt.
- At least one data table (specs, costs or comparisons).
- H2s phrased as the questions people actually ask.
- A "Planning checklist" or "Key takeaways" block.
- A 4–6 question FAQ with JSON-LD `FAQPage` schema at the bottom.
- One CTA to the mapped MQL asset.
- 2–4 internal links to related articles.
- 900–1,600 words.

### Guides and kits
Write them as Markdown source. 454 Creative handles layout. Write short, scannable sections with tables and checklists, and mark where a diagram is needed: `[[DIAGRAM: description]]`.

### Tools (A03, A20, A21)
- One self-contained `index.html` with no external calls, brand styling, and mobile support.
- **Every assumption lives in `config.json`**: coverage per model, utility rates, seat revenue and so on. Ship it with `[[VERIFY]]` values and a README explaining each one.
- Show the result on screen as a teaser; the full report sits behind the lead form (fields in §9).
- The result always includes a recommended controls bundle.
- Logic lives in pure functions with a small test file covering 3–5 sample inputs.

**A03 sizing calculator**
- Inputs: space length and width, enclosure type (open, partially covered, covered), climate zone, ceiling or mount height, preference (electric or gas, built-in or freestanding).
- Output: heater count and model options, plus controls.
- Coverage numbers come from §6, Lookbook values.

**A20 TCO model**
- Inputs: seats or ft², operating hours per year, fuel prices, purchase price, install cost.
- Output: 5-year cost for propane, natural gas and electric, including propane handling.

**A21 ROI calculator**
- Inputs: heated seats, average check, turns per night, extra operating nights per year, capture rate.
- Output: added revenue, payback in months.

---

## 9. Lead capture spec (HubSpot)

Every gated asset uses the same core form, with progressive profiling after the first conversion.

| Field | Required | Values | Why |
|---|---|---|---|
| First name, last name, email | Yes | | Contact |
| **I am a…** | Yes | Homeowner · Architect / designer · Builder / installer · Commercial operator · Dealer | Routing; the single most important field |
| ZIP / postal code | Yes | | Territory and climate |
| Project timing | Yes | 0–3 months · 3–6 · 6–12 · Researching | SAL/SQL qualification |
| Company | Professionals only | | Account matching |
| Project size | Optional | No. of homes · seats · ft² | Scoring |

Hidden fields to pass: `asset_id` (A01–A24), `matrix_cell` (e.g. `BLD-IN`), `utm_*`, `tool_inputs` (JSON for tools).

**Scoring starting point** (Brian Kim to tune):

| Signal | Points |
|---|---|
| Awareness download | +5 |
| Consideration asset or calculator | +15 |
| Intent asset (A11, A16, BIM, A21) | +30 |
| Design request / talk to expert | +50 and route straight to sales |
| Timing 0–3 months | +20 |
| Professional role | +10 |

Write this up in `forms/hubspot-form-spec.md` and `forms/lead-scoring.md`. Do not configure HubSpot itself; humans implement it.

---

## 10. Definition of done (per asset)

- [ ] Matches the brief in `assets.json` (themes covered, keywords used naturally, correct audience and stage).
- [ ] All facts traceable to §6 or a cited source; unknowns are `[[VERIFY]]` and logged.
- [ ] Controls included in every product recommendation.
- [ ] One CTA, mapped to the correct next-stage asset.
- [ ] AEO checklist passed (articles): direct answer first, table, question H2s, FAQ schema.
- [ ] Tools: config-driven, tests pass, works at 400px wide, lead gate in place.
- [ ] Logged in `reviews/review-log.md` with the named owner for human sign-off.

Nothing is "published" by Claude Code. The output is review-ready drafts. Publishing to WordPress happens after owner sign-off; the site is maintained by 454 Creative.

---

## 11. Decisions needed from humans (seed `reviews/open-questions.md`)

1. Confirmed coverage, wattage and BTU figures per current SKU, and the Tungsten gas BTU conflict (Mike Clifford).
2. 2026 utility rate assumptions for running-cost and TCO maths, by region (Brian Kim / Finance).
3. ROI benchmarks: average check, turns, season-extension months by climate (Blake Petty).
4. Builder price tiers, margin structure and lead times for A15 and A18 (Arvin Avaness / Peter Abraham).
5. Approved Infratech comparison claims (Shaughn Ritchie).
6. Launch dates for Tungsten Coastal and Select (Mike Clifford).
7. Gating rules: which assets require full form vs email-only (Brian Kim).
8. Case-study candidates with permission to publish numbers (regional leads).
9. Validated keyword volumes and the 40-term priority list (Brian Kim).

---

## 12. First session: do this, in order

1. Read `CLAUDE.md`, this file, both JSON files, and all three PDFs in `sources/`.
2. Create `data/product-facts.json` from §6, with `source` and `verified: false/true` per fact.
3. Create `templates/article-template.md` and `templates/aeo-checklist.md`.
4. Create `forms/hubspot-form-spec.md` and `forms/lead-scoring.md`.
5. Produce the A01 corrections list and HTML stats page.
6. Outline A02 Planning Guide v2 (all three editions), then stop and post the outline for review.
7. Seed `reviews/open-questions.md` with §11 plus anything found along the way.
8. Report back: what was produced, what is blocked, and the top 5 open questions.
