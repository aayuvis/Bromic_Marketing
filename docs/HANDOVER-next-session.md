# Handover — Bromic Content Hub, session 2 (with bromic.com access)

**Prepared:** 29 Oct 2026 · **For:** a new Claude Code session whose environment allows `bromic.com`, `www.bromic.com`
(and ideally `bromic.com.au`, `eia.gov`, `nahb.org`, `nar.realtor`, `aia.org`, `jchs.harvard.edu`, `nfpa.org`, `iccsafe.org`)
· **Sponsor:** Aayush Vishnoi, President, Global Heating · **Repo:** `aayuvis/Bromic_Marketing`, branch `claude/cool-noether-3ivd0z`

Read in this order: `CLAUDE.md` → `HANDOVER.md` (the original brief, binding) → this file → `templates/content-schema.md`.

---

## 1. Where things stand

| Area | State |
|---|---|
| **Content Hub app** (`app/`) | Built. Overview, Library (lifecycle × audience × type × access × status), Journey map, Backlog A01–A24, Tools, Images, Sources, Review. Exports WordPress-ready HTML with FAQ + Article JSON-LD. Preview: https://claude.ai/artifact/DL4yWhz2KcMoxMHoLhLd8i (private; export/print disabled in the preview frame only). |
| **Anchor articles (A24)** | 20 cells. Done: RES ×5, BLD ×5, COM ×5. ARC ×5 — check `content/articles/ARC-*` (an agent was finishing them at hand-off). |
| **Knowledge base** | 3 per audience (RES, BLD, COM done; ARC check). |
| **A01 Trends 2026** | Corrections list (38 rows) + stat verification + AI-citable stats page. Two stats to remove (39% infrared "AIA", $522B "Harvard"); AIA 55%/40% are net scores, not shares. |
| **A02 Planning Guide v2** | Homeowner, Pro, Commercial editions + outline for review. |
| **A16 Pre-wire guide** | Done. |
| **A11 Spec kit · A12 Electrification · A15 Builder programme · case-study kit** | Check `content/kits`, `content/guides/A12-*`, `content/sales`, `content/case-studies` (agent finishing at hand-off). |
| **Tools A03 / A20 / A21** | Check `tools/` — each needs index.html, config.json, logic.js, test.mjs, README; `npm test` runs them. |
| **Images** | 89 photos from the three Bromic PDFs + 5 owner-approved generated images (`g-*`). |
| **Data** | `product-facts.json` (Lookbook 2026 wins over Planning Guide 2021); `journey-matrix.json` and `assets.json` are **reconstructed** — the originals were never supplied (ask the owner for them). |

All content is `draft` or `in-review`. Nothing is published.

## 2. Owner rules learned in session 1 (binding, on top of CLAUDE.md)

1. **No image generation until bromic.com imagery and the existing library have been studied.** A generated restaurant scene
   showed heaters installed wrongly and was rejected. Generated images show Bromic products only as they really are and as
   they are really installed — or no heater at all. Every one is looked at and owner-approved before it enters the library.
2. Mature tone, Bromic design language (warm paper, ink, steel, flame `#EF4123` only accent, Georgia + Helvetica).
3. Articles pithy and researched; every number sourced; unknowns are `[[VERIFY: what — owner]]`.
4. Asset preference: bromic.com → Bromic asset library → Bromic publications → generated.

## 3. First steps for session 2

```bash
git clone https://github.com/aayuvis/bromic_marketing && cd bromic_marketing && git checkout claude/cool-noether-3ivd0z
cd app && npm install && npm test && npm run build && cd ..
node scripts/fetch_bromic.mjs --max=600     # bromic.com → sources/web/*.md + images/inbox/web/
python3 scripts/ingest_images.py            # inbox → images/library (+ manifest, status needs-tagging)
```

Then, in order:

1. **Study the site.** Read `sources/web/index.json` and every product page. Update `data/product-facts.json`: Platinum Gas,
   Tungsten Gas built-in, Platinum Electric Marine, Cobalt Electric, Eclipse wattage, coverage per wattage, voltages, clearances,
   warranty terms, accessories. Keep `verified: false` until Mike Clifford signs off; set `source` to the page URL.
2. **Tag the new images.** In the Hub's Images tab, review every `needs-tagging` image; fill product, setting, audiences, alt,
   rights in `images/library/manifest.json`. Re-point heroes to bromic.com photography where better (current product, correct
   installation). Prefer site images over the 2021 Planning Guide `p-*` set.
3. **Blog audit.** The 9 existing posts at bromic.com/blog/ (mostly PR recaps): map each to a journey cell, keep / rewrite /
   retire, and add as `content/blog-audit.md` (type `report`). Never duplicate an existing URL's topic without a redirect plan.
4. **Clear [[VERIFY]] flags that the site answers.** Review tab → "Most to verify". Re-run `npm test`.
5. **Re-verify sources that were snippet-only** (eia.gov, nahb.org, nar.realtor, aia.org, nfpa.org were unreachable in session 1):
   open each URL, confirm the number, set `verified: true` or fix. The Sources tab lists them.
6. **Then, and only then, image generation** for gaps the site does not cover — studied against real Bromic installations,
   shown to the owner before acceptance (`scripts/gen_images.py`, key at `/root/.gkey`, mode 600; never commit it).
7. Merge `reviews/open-questions/*.md` into a single owner-sorted list for the weekly review.
8. Commit, push, and republish the preview: `cd app && npm run single`, then publish `app/dist-single/artifact.html`
   (strip the html/head/body wrapper as session 1 did) to the same artifact URL.

## 4. Top open questions for humans

| # | Question | Owner |
|---|---|---|
| 1 | Coverage, wattage, voltage and BTU per current SKU; Tungsten built-in gas BTU (39,800 vs 38,000) | Mike Clifford |
| 2 | 2026 utility rates by region (electric, natural gas, commercial propane delivered) | Brian Kim / Finance |
| 3 | ROI benchmarks: average check, turns, extra nights, capture rate, margin | Blake Petty |
| 4 | Atomik survey: date, base n, question wording; 94% vs 92% | Megan Spies |
| 5 | NEC Article 422 vs 424 for Bromic electric heaters; GFCI in the install manual; breaker sizes | Mike Clifford + licensed electrician |
| 6 | Builder price tiers, margins, lead times (A15, A18) | Arvin Avaness / Peter Abraham |
| 7 | Launch dates for Tungsten Coastal and Select | Mike Clifford |
| 8 | Original `journey-matrix.json` and `assets.json` | Aayush Vishnoi |
| 9 | Case-study candidates with permission to publish numbers | Regional leads |
| 10 | Validated keyword volumes, 40-term priority list | Brian Kim |

Full lists: `reviews/open-questions/*.md` (one per writer).

## 5. How the repo works

- **Content** = Markdown + YAML frontmatter (`templates/content-schema.md`). Lifecycle = `stage`, audience = `audience`,
  type = `type` + folder. Citations `[^s1]` map to `sources:`; images `![alt](img:<id>)`; links `item:<id>`, `asset:<id>`.
- **`app/scripts/build.mjs`** compiles everything into `app/dist/` (opens from file://). `--check` validates;
  `--single` writes the preview bundle.
- **`app/test/content.mjs`** enforces the hard rules: controls named with every heater, Coastal/Select "coming soon",
  no "500 series", no published 39,800 BTU, one CTA, sourced claims, local-authority disclaimer on code content,
  competitor approval flag, no exclamation marks or emoji.
- **Tools** keep every assumption in `config.json`; `tools/build-config.mjs` regenerates the embedded `config.js`.
- **Never** commit keys or model identifiers. Nothing is published to bromic.com from this repo; 454 Creative lays out,
  WordPress publishing follows owner sign-off.
