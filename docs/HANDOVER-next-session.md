# Handover — finish the Bromic Content Hub (for a new chat)

**Prepared:** 29 Oct 2026 · **Sponsor:** Aayush Vishnoi, President, Global Heating
**Repo:** `aayuvis/Bromic_Marketing` · **Branch:** `claude/cool-noether-3ivd0z` (develop and push here)
**Preview of the app (private):** https://claude.ai/artifact/DL4yWhz2KcMoxMHoLhLd8i — republish to this URL with `url`

Read in this order: `CLAUDE.md` → `HANDOVER.md` (original brief, binding) → this file → `templates/content-schema.md`
→ `templates/writer-brief.md` (the research and voice rules every content writer followed).

There are two jobs. **Part A** finishes work that was cut off in session 1 and needs no special network access.
**Part B** needs `bromic.com` allowed in the environment's network settings. Do A first unless the owner says otherwise.

---

## 0. Setup

```bash
git clone https://github.com/aayuvis/bromic_marketing && cd bromic_marketing
git checkout claude/cool-noether-3ivd0z
cd app && npm install && npm test && npm run build && cd ..
```

Expected today: `items 42 · errors 0`, content rules `0 failures`, tools `ok A03-sizing` (its unit test passes; its page does
not — see A1). Open `app/dist/index.html` from file:// to browse.

## 1. State at hand-off

| Area | State |
|---|---|
| Content Hub app (`app/`) | Done. Overview · Library · Journey · Backlog · Tools · Images · Sources · Review. HTML export with FAQ + Article JSON-LD. |
| A24 anchor articles | **Done, 20/20** (RES, ARC, BLD, COM × AW, CO, IN, PP, BY) |
| Knowledge base | **Done, 12** (3 per audience) |
| A01 Trends 2026 | **Done**: corrections (38 rows) + stat verification + AI-citable stats page |
| A02 Planning Guide v2 | **Done**: homeowner, pro, commercial + outline for review |
| A11 Spec kit · A12 Electrification · A15 Builder programme · A16 Pre-wire | **Done** (drafts) |
| **A03 sizing tool** | **Broken page** — logic, config, test exist; inliner missing (A1) |
| **A20 TCO tool** | **Config only** (A2) |
| **A21 ROI tool** | **Not started** (A3) |
| **Tool content cards** | **Not started** (A4) |
| **HubSpot form spec + lead scoring** | **Not started** (A5) |
| **Case-study template + candidates** | **Not started** (A6) |
| Open-questions logs | 6 of 8 writers logged; ARC writer and kits writer did not (A7) |
| Images | 89 from the three Bromic PDFs + 5 owner-approved generated (`g-*`) |
| Data | `product-facts.json` done; `journey-matrix.json` and `assets.json` **reconstructed** (originals never supplied — ask the owner) |

All content is `draft` / `in-review`. Nothing is published.

## 2. Owner rules from session 1 (binding, on top of CLAUDE.md)

1. **No image generation until bromic.com imagery and the existing library have been studied.** A generated restaurant scene
   drew heaters installed wrongly and was rejected. Generated images show Bromic products only as they really are and are really
   installed, or no heater at all; each is shown to the owner before it enters the library.
2. Mature tone; Bromic design language (warm paper `#F4F1EC`, ink `#231F20`, steel `#71777D`/`#DDE0E2`, flame `#EF4123` the only
   accent; Georgia headings, Helvetica body; uppercase only for small letterspaced labels; no emoji, no exclamation marks).
3. Pithy, researched writing; every number sourced (`[^sN]` + `sources:`); unknowns `[[VERIFY: what — owner]]`.
4. Asset preference: bromic.com → Bromic asset library → Bromic publications → generated.
5. Every heater recommendation includes its controls (Affinity On/Off, Dimmer or Eclipse controller, wall switch, app; Wi-Fi/app
   features need compatible Affinity controls, sold separately). Tungsten Coastal/Select always "coming soon".

---

## PART A — finish the cut-off work (no special network needed)

### A1. Fix A03 (sizing) — write `tools/build-config.mjs`

`tools/A03-sizing/index.html` has inline markers and expects a build step to fill them:

```
/* @inline:begin ../_shared/brand.css */  /* @inline:end ../_shared/brand.css */   (inside <style>)
/* @inline:begin config.json */           /* @inline:end config.json */            (inside <script type="module">)
/* @inline:begin logic.js */              /* @inline:end logic.js */
/* @inline:begin ../_shared/lead.js */    /* @inline:end ../_shared/lead.js */
```

The page then uses `CONFIG`, `Logic.defaults(...)`, `Logic.size(...)` and the lead gate from `lead.js`.
Write `tools/build-config.mjs` that, for every `tools/<id>/index.html`:
- replaces the text **between** each begin/end pair with the referenced file (path relative to the tool folder), idempotently;
- for `config.json` emits `const CONFIG = <json>;`;
- for a `.js` ES module emits it wrapped as a namespace without `export` keywords — e.g. `const Logic = (() => { …source with
  "export " stripped… ; return { defaults, normalise, size, … }; })();` (collect exported names with a regex) — and the same
  for `lead.js` as `const Lead = …` (check what name the page calls);
- leaves `logic.js` / `config.json` as the editable sources, so `test.mjs` keeps importing `logic.js` directly.

Run it, open `tools/A03-sizing/index.html` in Playwright (Chromium is preinstalled: `require('playwright')`), confirm no console
errors at 1200px and 400px, a teaser result renders, the lead form appears, and `?embed=1` removes outer margins.
Add `node tools/build-config.mjs` to `app/package.json` `build` and `test` scripts (before `scripts/build.mjs`).
Write `tools/A03-sizing/README.md` (each config value, its unit, source, owner, `[[VERIFY]]` status).

### A2. Finish A20 (5-year TCO) — `tools/A20-tco/`

`config.json` exists (read its `_readme`). Build `logic.js` (pure, exported), `index.html` (same pattern and markers as A03,
inline SVG bar chart of 5-year totals for electric / natural gas / propane, formula shown), `test.mjs` (3–5 cases), `README.md`.
Inputs: seats or ft², operating hours/yr, fuel prices ($/kWh, $/therm, $/gal), purchase + install per option, propane handling
(exchanges/yr × labour minutes × wage). Output: 5-year total per fuel incl. propane handling. Purchase/install defaults are
placeholders and the page says so. Fuel maths (same as the articles): electric kW × $/kWh; natural gas BTU/h ÷ 100,000 × $/therm;
propane BTU/h ÷ 91,500 × $/gal. Reuse the numbers already sourced in `content/articles/COM-CO-01-*.md` (its five-year example
is the natural first test case).

### A3. Build A21 (patio revenue ROI) — `tools/A21-roi/`

Same file set and pattern. Inputs: heated seats, average check, turns per night, extra operating nights/yr, capture rate,
gross margin %, installed cost. Outputs: added revenue/yr, added margin/yr, payback months. Every default is an assumption with
`[[VERIFY: benchmarks — Blake Petty]]`. First test case: `content/articles/COM-IN-01-*.md` worked example
(40 seats × 1.5 turns × $45 × 60 nights × 50% capture = $81,000; ≈15.5 months on $30,000 installed — check margin basis).

**All three tools:** single self-contained page after inlining (no external calls, no CDNs); Bromic styling via
`_shared/brand.css`; works at 400px; keyboard accessible; teaser result on screen, full report behind the lead form from
HANDOVER §9 (first/last name, email, I am a… [Homeowner, Architect / designer, Builder / installer, Commercial operator, Dealer],
ZIP/postal, project timing [0–3 months, 3–6, 6–12, Researching], company for professionals, project size optional; hidden
`asset_id`, `matrix_cell`, `utm_*` from the URL, `tool_inputs` JSON). On submit: show the full report and `console.log` the
payload with the comment "HubSpot form embed replaces this". Result always includes the recommended controls bundle where
heaters are recommended. `node app/test/tools.mjs` must pass.

### A4. Tool content cards — `content/tools/A03-sizing.md`, `A20-tco.md`, `A21-roi.md`

Frontmatter per `templates/content-schema.md`: `type: tool`, `id`/`asset` = A03/A20/A21, audience and stage from
`data/assets.json`, `hero` image id from `images/library/manifest.json`, `summary`, `cta`, `sources` (for the rates used),
`owner_review` (A03 Brian Kim + 454 Creative; A20/A21 Blake Petty + Brian Kim). Body: what it does, inputs, outputs,
assumptions, where the lead goes. The Hub's Tools tab matches a card to a tool folder by `asset` prefix.

### A5. Forms — `forms/hubspot-form-spec.md` and `forms/lead-scoring.md`

From HANDOVER §9, fleshed out: field internal names, required/optional, picklist values, progressive-profiling plan (what is asked
on the 2nd and 3rd conversion), hidden fields, routing rules by "I am a…" and ZIP, the scoring table (+5 awareness download,
+15 consideration asset or calculator, +30 intent asset A11/A16/BIM/A21, +50 design request → route to sales, +20 timing 0–3
months, +10 professional role), SAL/SQL thresholds as `[[VERIFY: Brian Kim]]`. Do not configure HubSpot.

### A6. Case studies — `content/case-studies/`

- `case-study-template.md` — `id: CS-TEMPLATE`, `type: case-study`, `status: template`, audience `[RES, ARC, BLD, COM]`,
  stage `[IN, PP]`, `cta: {label: "Book a design consult", asset: A07}`, a hero id. Structure: situation, brief, solution
  (products **and controls**), result with numbers (only with written permission), quote (with permission), photo list;
  plus a 10-question interview guide and a consent checklist.
- `case-study-candidates.md` — `id: CS-CANDIDATES`, same frontmatter shape: the kinds of projects to source per audience
  (coastal residence with Coastal when launched, builder community with pre-wire, restaurant season extension with before/after
  covers, hotel rooftop, architect-specified recessed install). **No invented names, numbers or quotes.**

### A7. Open questions

Read every `[[VERIFY]]` in `content/articles/ARC-*`, `content/kb/ARC-*`, `content/kits/A11-*`, `content/guides/A12-*`,
`content/sales/A15-*`, and write `reviews/open-questions/arc-writer.md` and `kits-writer.md` as
`| item id | question | suggested owner |`. Then merge all logs into `reviews/open-questions.md`, grouped by owner, de-duplicated,
with the top 10 first (the Hub's Review tab renders it).

### A8. Ship Part A

```bash
cd app && npm test && npm run single && cd ..
git add -A && git commit -m "Finish tools A03/A20/A21, forms, case-study kit, open questions" && git push -u origin claude/cool-noether-3ivd0z
```

Republish the preview to the **same URL**: strip the `<!doctype>/<html>/<head>/<body>` wrapper from
`app/dist-single/index.html` into `app/dist-single/artifact.html` (keep `<title>`, `<style>`, scripts), then publish with the
Artifact tool: `url: https://claude.ai/artifact/DL4yWhz2KcMoxMHoLhLd8i`, `root: app/dist-single`, `files` = every file under
`images/` and `tools/` (≈200; limit 255 per publish). Note: in the preview frame the Export HTML / Print buttons are inert
(downloads and print are blocked there); either hide them when framed or wire `downloads` via the artifact-capabilities skill.
Update §1 of this file.

---

## PART B — bromic.com (needs `bromic.com`, `www.bromic.com` allowed; ideally also eia.gov, nahb.org, nar.realtor, aia.org, nfpa.org, iccsafe.org)

```bash
node scripts/fetch_bromic.mjs --max=600     # site → sources/web/*.md + sources/web/index.json; images → images/inbox/web/
python3 scripts/ingest_images.py            # inbox → images/library (status needs-tagging)
```

1. **Product facts.** From product pages, update `data/product-facts.json` (Platinum Gas, Tungsten Gas built-in, Platinum Electric
   Marine, Cobalt Electric, Eclipse wattage, coverage per wattage, voltages, clearances, warranty, accessories, controls
   compatibility). `source` = page URL; `verified: false` until Mike Clifford signs off. Then search content for `[[VERIFY]]`
   flags the site now answers and clear them.
2. **Images.** Tag every `needs-tagging` image in `images/library/manifest.json` (product, setting, audiences, alt, rights).
   Re-point heroes to bromic.com photography where it shows current product correctly installed; prefer it over the 2021 `p-*` set.
3. **Blog audit.** Map the ~9 posts at bromic.com/blog/ to journey cells; keep / rewrite / retire; record as
   `content/reports/blog-audit.md` (type `report`). Never duplicate a live URL's topic without a redirect plan.
4. **Re-verify snippet-only sources.** Session 1 could not open eia.gov, nahb.org, nar.realtor, aia.org, nfpa.org; many sources are
   `verified: true` from search snippets only. Open each (Hub → Sources), confirm or fix.
5. **Only then, image generation** for real gaps (`scripts/gen_images.py`; key at `/root/.gkey`, mode 600 — if absent, ask the
   owner; never commit it). Study real Bromic installations first; show every image to the owner before `--accept`.
6. Test, commit, push, republish the preview (as A8).

---

## 3. Top open questions for humans

| # | Question | Owner |
|---|---|---|
| 1 | Coverage, wattage, voltage, BTU per current SKU; Tungsten built-in gas BTU (39,800 vs 38,000) | Mike Clifford |
| 2 | 2026 utility rates by region; delivered commercial propane price | Brian Kim / Finance |
| 3 | ROI benchmarks: check, turns, extra nights, capture rate, margin; typical installed cost | Blake Petty |
| 4 | Atomik survey date, base n, wording; 94% vs 92% topline | Megan Spies |
| 5 | NEC Article 422 vs 424; GFCI in the install manual; breaker sizes; Affinity load per channel | Mike Clifford + licensed electrician |
| 6 | Builder price tiers, margins, lead times (A15, A18) | Arvin Avaness / Peter Abraham |
| 7 | Tungsten Coastal and Select launch dates | Mike Clifford |
| 8 | Original `journey-matrix.json` and `assets.json` | Aayush Vishnoi |
| 9 | Case-study candidates with permission to publish numbers | Regional leads |
| 10 | Validated keyword volumes and the 40-term priority list | Brian Kim |

## 4. How the repo works (short)

- Content = Markdown + YAML frontmatter; lifecycle `stage`, `audience`, `type` (+ folder). Citations `[^s1]` ↔ `sources:`;
  images `![alt](img:<id>)`; links `item:<id>`, `asset:<id>`.
- `app/scripts/build.mjs` → `app/dist/` (opens from file://); `--check` validates; `--single` writes the preview bundle.
- `app/test/content.mjs` enforces the hard rules (controls, coming soon, no "500 series", no published 39,800 BTU, one CTA,
  source fields, local-authority disclaimer on code content, competitor approval flag, no exclamation marks/emoji).
- `app/test/tools.mjs` runs every `tools/<id>/test.mjs`.
- Never commit keys or model identifiers. Commit trailer per the session's instructions. Nothing is published to bromic.com from
  this repo; 454 Creative lays out, WordPress publishing follows owner sign-off.
