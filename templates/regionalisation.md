# Regionalisation and translation

The Hub serves seven regions (`data/regions.json`): US · Canada · AUS · NZ · UK · Benelux · Germany. A region sets units,
currency, mains voltage, the codes an installer works to and the local Bromic site. English (US) is the master; every other
version follows it and never adds a fact it does not hold.

| Region | Languages | Units | Electrical | Gas |
|---|---|---|---|---|
| US | English | imperial, °F, USD | NEC (NFPA 70) | NFPA 54 / NFPA 58 |
| Canada | English | metric with imperial in brackets, °C, CAD | CEC (CSA C22.1) | CSA B149.1 |
| AUS | English | metric, °C, AUD | AS/NZS 3000 | AS/NZS 5601.1 |
| NZ | English | metric, °C, NZD | AS/NZS 3000 | AS/NZS 5601.1 |
| UK | English | metric, °C, GBP | BS 7671 | Gas Safety (Installation and Use) Regulations 1998, Gas Safe engineer |
| Benelux | Dutch (Netherlands), English | metric, °C, EUR | NEN 1010 | NEN 1078 |
| Germany | German, English | metric, °C, EUR | DIN VDE 0100 | DVGW-TRGI, TRF (LPG) |

French (Belgium, Luxembourg) and Belgian-specific context are **on hold** (owner, 30 Oct 2026).

## English in other regions

Shown from the US master with the Hub converting units on the page (ft² → m², ft → m, in → mm, °F → °C, BTU/hr → kW,
gallons of propane → litres) and a regional panel on every item: codes, voltage, energy prices, local site. Money in the
English text stays as written (it is US data) and the panel says so.

## Translations (Dutch for the Netherlands, German for Germany)

Files: `content/i18n/<lang>/<same path as the English file>`, e.g. `content/i18n/de/articles/COM-CO-01-….md`.

**Front matter:** copy every key of the English file. Translate `title`, `summary`, `meta_description`, `dek`, `cta.label`,
`ai_prompt`, the FAQ questions and, where they are prose, `owner_review` notes may stay English. Keep `id`, `type`, `audience`,
`stage`, `cell`, `asset`, `hero`, `images`, `sources`, `related`, `status`, `gated` exactly. Add:
`lang: de` (or `nl`), `translation_of: <id>`, `translation_status: machine-draft`, `native_reviewer: "[[VERIFY: native reviewer — Raffaele Marti]]"`
(German) or `"[[VERIFY: native reviewer — Bromic Benelux distributor]]"` (Dutch). Do not translate `primary_keyword` or
`secondary_keywords`: replace them with `primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"` and `secondary_keywords: []`.
Drop `live_url`, `merges` and `slug` (they are US bromic.com URLs).

**Body — translate AND regionalise:**
1. **Units:** metric only. Convert exactly, then round sensibly: 1 ft = 0.3048 m; 1 ft² = 0.0929 m² (800 ft² ≈ 74 m²);
   1 in = 25.4 mm; °C = (°F − 32) × 5/9; 1 kW = 3,412 BTU/h (38,000 BTU/h ≈ 11.1 kW); 1 US gal = 3.785 L; 1 lb = 0.454 kg.
   Product wattages stay as they are. Coverage "about 143 ft²" → "ca. 13 m²" / "ongeveer 13 m²". 20 ft² a seat → about 1.9 m² a seat.
2. **Codes and installers:** replace US codes (NEC, NFPA 70/54/58, local building authority) with the region's codes from the
   table above and `data/regions.json` (installer wording, authority). Keep the safety disclaimer: local authority plus a
   qualified installer, and link the primary source the English file links if it is a code page; otherwise no link.
3. **Voltage:** 230 V, 50 Hz. Where the English file computes amps at 208/240 V, recompute at 230 V (A = W ÷ 230) and say
   circuits follow the local code; do not copy US breaker sizes.
4. **Money and energy prices:** never convert dollars into euros. A US price, US survey or US statistic stays, clearly framed
   as US data ("in the US, …", "US-Durchschnitt", "in de VS"). Where the English file works a running-cost example in US
   prices, keep the method and quantities (kWh, kW, hours) and replace the money with "× your price per kWh" — or show the
   US figures labelled as a US example. Do not invent European prices.
5. **Propane:** Europe and Germany call it Flüssiggas / propaan; quantities in kg or litres; cylinder sizes from `data/regions.json`.
6. **Products:** product and collection names stay in English (Tungsten Smart-Heat Electric, Platinum, Eclipse, Affinity
   Smart-Heat, Bromic Smart-Heat app). Never add a product, model, price or availability claim. If the English says a product is
   US-only or "coming soon", keep that.
7. **Keep intact:** every `[^sN]` citation marker, every `![…](img:…)` image, `item:` and `asset:` links, tables (translate the
   cells), headings structure, FAQ structure (`## FAQ` / `### question`), and every `[[VERIFY: …]]` and `[[DIAGRAM: …]]` note
   (translate only the description inside, keep the owner name).
8. **Rules that never change:** every heater recommendation keeps its controls (Affinity Smart-Heat On/Off, Dimmer or Eclipse
   controller, wall switch, app; Wi-Fi and app features need compatible Affinity controls, sold separately); controls are never
   optional; Tungsten Coastal and Select stay "coming soon"; no "500 series"; competitors stay factual; one CTA.
9. **Voice:** direct, expert, calm; no exclamation marks, no emoji, sentence case. German: "Sie", short sentences, no
   anglicisms where a plain German word exists. Dutch: "u" for commercial and professional audiences, "je" for homeowner and blog
   pieces, plain Dutch.
10. **CTA links:** point to the region's Bromic site (`https://www.bromic.de/`, `https://www.bromic.nl/`) where the English
    links bromic.com; Hub-internal links (`item:`, `asset:`) stay.

## Glossary

| English | German | Dutch |
|---|---|---|
| outdoor heater / patio heater | Terrassenheizstrahler / Heizstrahler | terrasverwarmer / buitenverwarmer |
| radiant / infrared heat | Strahlungswärme / Infrarotwärme | stralingswarmte / infraroodwarmte |
| controls | Steuerung | bediening / besturing |
| controller | Steuergerät | regelaar |
| wall switch | Wandschalter | wandschakelaar |
| zone | Zone | zone |
| dimmer | Dimmer | dimmer |
| coverage (area a heater warms) | Heizfläche / beheizte Fläche | verwarmd oppervlak |
| pergola / covered patio | Pergola / überdachte Terrasse | pergola / overdekt terras |
| builder | Bauunternehmer / Bauträger | aannemer / bouwer |
| architect / specifier | Architekt / Planer | architect / voorschrijver |
| restaurant operator | Gastronom / Betreiber | horecaondernemer / exploitant |
| pre-wire / rough-in | Vorverkabelung / Leerrohr-Vorbereitung | voorbekabeling |
| payback | Amortisation | terugverdientijd |
| propane | Flüssiggas (Propan) | propaan |
| natural gas | Erdgas | aardgas |
| design service | Planungsservice | ontwerpservice |
