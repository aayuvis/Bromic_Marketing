# Bromic E-Commerce Content Kit

Listing content for Bromic's online retail partners (Ferguson/Build.com, Home Depot, Lowe's, Best Buy, Costco, Amazon-style
marketplaces): one listing per current series, ready to paste or import. Draft until the Product team signs off, and no prices.

| File | What it is |
|---|---|
| `listings.json` | Every listing: titles (about 60, 120 and 200 characters), 5 bullets, description, specs, variants and SKUs, in the box, required and sold separately, optional accessories, search terms, image plan, enhanced content, open items (`verify`), gaps, sources, and the character counts (`checks`) |
| `listings.csv` | Flat import file, one row per variant (SKU blank where the SKU is still to confirm) |
| `images/main/` | Main images: 2000 × 2000 JPEG on pure white #FFFFFF, product at about 85% of the frame |
| `images/modules/` | Sample enhanced-content (A+ style) modules: banner and which-heater at 1464 × 600, three-feature row and series comparison at 970 × 600 |
| `images/plan/` | Thumbnails of the library images named in each image plan (for the preview) |
| `index.html` | Readable kit with a preview of every listing |
| `Bromic-Ecommerce-Content-Kit.pdf` | The same, US Letter |

Listings: Tungsten Smart-Heat® Electric Series II (Select and Coastal available now; Classic from January 2027), Platinum Electric,
Platinum Electric Marine, Eclipse Electric, Eclipse Freestanding, Platinum Gas, Tungsten Gas (mounted), Tungsten Freestanding Gas,
Affinity Smart-Heat® Controls. Cobalt is left out (discontinued).

## Rules the copy keeps

- Facts only from `data/product-facts.json`, `data/retail/retail.json`, `data/product-marketing/*.json` and `data/portfolio.json`.
  Open facts live in each listing's `verify` list and stay out of the copy (no `[[VERIFY]]` in customer text). No Tungsten Gas
  built-in BTU until the Product team confirms it.
- Every heater lists its Affinity Smart-Heat® Controls under "Required, sold separately" (never optional), the Wi-Fi line, and
  installation by a licensed electrician or gas fitter.
- No prices, no competitor names, no legacy series names, no promo words, no exclamation marks, en dashes only. Titles are brand-first
  and carry no ® (marketplaces restrict special characters in titles).
- Search terms are directional suggestions, never claims, with no volumes.

## Update it

1. Edit `src/listings.py` (copy) or `src/kit.css` (the preview's look).
2. Run `python3 reports/retail/ecommerce-kit/build.py` from the repo root (about 90 seconds). It fails on a copy rule: a title
   outside its length window, a bullet over 250 characters, a description outside 150–250 words, a VERIFY note, a price, a
   competitor, a banned word. `--no-pdf` skips the browser steps (modules and PDF).
3. The browser steps use Playwright (`NODE_PATH=/opt/node-tools/node_modules`, `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` by default).
4. Series II main images are cut from the CAD renders (`SERIES_II_RENDERS`, transparent PNGs; the caught shadow is cut back to a
   faint contact shadow). If the renders are not on disk the existing JPEGs are kept. Other mains come from the library's
   white-ground cutouts (`images/library/`); the ground is flood-filled to pure white from the edges.

## Before it goes to a retailer

- Confirm SKUs where blank, and every item in each listing's `verify` (most sit with the Product team).
- Three main images are still to supply: Platinum Electric Marine, Affinity controller alone (library shots show a hand and phone),
  and a clean white-ground Eclipse Freestanding (the current one is cut from a grey-ground shot). Most library cutouts are 1024 px,
  upscaled to 2000; ask Marketing for the originals. Image rights: `[[VERIFY: image rights for retailer use – Marketing]]`.
- Check each retailer's own limits in its vendor portal (Home Depot and Lowe's publish them only there; some Amazon categories cap
  titles lower than 200 characters – use the medium or short title).
