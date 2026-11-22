// Bromic Series Sheets: five retail one-pagers (US Letter portrait) on one shared template.
// The photo-led top comes from reports/themes/editorial, the spec schedule from reports/themes/blueprint.
// Facts only from data/retail/retail.json, data/product-facts.json, data/product-marketing/*.json and data/portfolio.json.
// Open facts ([[VERIFY]] in the data) print as "To confirm". No prices, no competitors.
// Run: node reports/retail/series-sheets/build.js   → <id>.html, pages/<id>.png, Bromic-<Series>-Sheet.pdf, print check.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '../../..');
const rel = (p) => path.relative(HERE, path.join(ROOT, p)).split(path.sep).join('/');
const TC = '<span class="tc">To confirm</span>';
const R = '<sup class="r">®</sup>';
const t = (s) => s.replace(/\{TC\}/g, TC).replace(/®/g, R);

// ---------- images: real Bromic photography and the Series II studio renders, re-encoded ≤2000 px, JPEG q82 ----------
const IMAGES = {
  's2-hero': 'images/library/l-006-028.webp',
  's2-close': 'decks/product-renders/Tungsten-Series-II-Select-black-and-white-pair.jpg',
  'pe-hero': 'images/library/w-bromic-platinum-electric.webp',
  'pe-close': 'images/library/w-bromic-shoot-may-11-2023-54.webp',
  'ec-hero': 'images/library/d-eclipse-pendant-dining.webp',
  'ec-close': 'images/library/l-016-131.webp',
  'pg-hero': 'images/library/w-bromic-pg-residential-hr.webp',
  'pg-close': 'images/library/w-bromic-centrico-photos-19.webp',
  'tg-hero': 'images/library/l-018-151.webp',
  'tg-close': 'images/library/w-usa-san-diego-decoy-lakehouse-hotel-tungsten.webp',
};
function prepImages() {
  const jobs = Object.entries(IMAGES).map(([k, src]) => [path.join(ROOT, src), path.join(HERE, 'img', `${k}.jpg`)]);
  const py = `
import sys, json
from PIL import Image
for src, out in json.loads(sys.argv[1]):
    im = Image.open(src).convert('RGB')
    im.thumbnail((2000, 2000), Image.LANCZOS)
    im.save(out, 'JPEG', quality=82, optimize=True, progressive=True)
`;
  const r = spawnSync('python3', ['-c', py, JSON.stringify(jobs)], { stdio: 'inherit' });
  if (r.status) throw new Error('image prep failed');
  fs.copyFileSync(path.join(ROOT, 'images/portfolio/bromic-logo-white.png'), path.join(HERE, 'img/bromic-logo-white.png'));
}

// ---------- the five sheets ----------
const ELEC_FINE = 'Coverage is approximate and varies with model, mounting height and conditions. Installation by a licensed electrician to local code: wall mounts at least 72 in and ceiling mounts at least 96 in above the floor, varying with output. Images are design inspiration.';
const GAS_FINE = 'Coverage is approximate and varies with model, mounting and conditions. Installation by a licensed gas fitter to local code; mounted heaters also need a licensed electrician for their 110 V supply. Mounted gas heaters sit at least 8 ft above the floor in covered outdoor areas. Images are design inspiration.';
const WIFI = 'Wi-Fi and app features need compatible Affinity Smart-Heat® Controls, sold separately.';

const SHEETS = [
  {
    id: 'tungsten-series-ii', file: 'Bromic-Tungsten-Series-II-Sheet.pdf', no: '01',
    kicker: 'Tungsten · Electric', title: 'Tungsten Smart-Heat® Electric Series II',
    deck: 'Slimmer heaters, three tiers and recessing for shallow ceilings.',
    status: ['Select & Coastal', 'Available now', 'Classic', 'January 2027'],
    hero: 's2-hero', heroPos: '50% 40%', close: 's2-close', closePos: '50% 45%',
    closeCap: ['Studio render', 'Tungsten Select on the single post'],
    intro: 'Precise directional infrared heat in a slimmer body, now in three tiers. Classic brings honest warmth to the garage and workshop, Select dresses a pergola in your colour and front, and Coastal is built for life by the water – for coastal homes and venues, never on boats.',
    reasons: [
      ['Up To 6 kW, Dimmed To The Evening', 'Dual elements on the 4 and 6 kW models, with the Affinity Smart-Heat® Dimmer to turn the warmth up on a cold night and down on a mild one.'],
      ['Flush In A 7.5 In Ceiling', 'Select and Coastal recess into a 7.5 in cavity. The kit is fan-ventilated and the recess box is supplied, so there is nothing to build on site.'],
      ['Visually Cleaner, Seemingly Floating', 'About 14% narrower and a third lighter than Series I, on a single post with no visible junction box.'],
      ['All Black, All White, All Graphite', 'Each finish covers the whole heater, with the Diamond front as standard and oval or triangle fronts sold separately on Select.'],
    ],
    spaces: ['Pergolas', 'Covered patios', 'Vaulted porches', 'Garages & workshops', 'Coastal homes', '277 V commercial'],
    cols: [['Classic', 'Good'], ['Select', 'Better'], ['Coastal', 'Best']],
    rows: [
      ['Outputs', '2, 3, 4, 6 kW', '2, 3, 4, 6 kW', '4, 6 kW'],
      ['Supply', '208, 220–240 V; 277 V on 4, 6 kW', '208, 240, 277 V (2 kW: 240 V only)', '208, 240 V'],
      ['Heat area', '{TC}', 'About 64–144 ft², by model', 'About 64–144 ft², by model'],
      ['Finishes', 'Black', 'Black, white, graphite (graphite on 4, 6 kW)', 'Black, white'],
      ['Front', 'Wireframe', 'Diamond; oval and triangle sold separately', 'Diamond'],
      ['Build', 'Black body, stainless end covers', 'IPX5', 'Corrosion-resistant coating over 316 marine-grade stainless; IPX5'],
      ['Recessing', 'Existing Tungsten recess kit', 'Low-Clearance Recess Kit', 'Marine-grade low-clearance kit'],
      ['Warranty', '3 years heater, 7 years elements', '3 years heater, 7 years elements', '3 years heater, 7 years elements'],
      ['Available', 'January 2027', 'Now', 'Now'],
    ],
    mounting: ['Single post', 'Flat ceiling', 'Pitched ceiling 3/12–12/12', 'Wall bracket, 14 or 18 in reach', 'Angled 15°, 30°, 45°', 'Low-clearance recess, 7.5 in'],
    mountNote: '45° on the 4 and 6 kW models: {TC}.',
    controls: 'The Affinity Smart-Heat® Dimmer as standard, or the On/Off Controller where dimming is not wanted, plus a manual wall switch – 6 kW a channel at 208–277 V.',
    accessories: 'Low-Clearance Recess Kit · Pitched-Ceiling Adaptor · Wall-Mounting Bracket · Mounting Bracket',
    pair: [
      ['Design-forward California room', 'Platinum Smart-Heat® Electric', 'flush and minimal, with the Affinity Dimmer'],
      ['Open seating away from walls', 'Tungsten Smart-Heat® Freestanding Gas', 'set at its own knob'],
      ['Lounging', 'Eclipse Smart-Heat® Freestanding', 'Eclipse Dimmer Controller and remote included'],
    ],
    fine: ELEC_FINE,
  },
  {
    id: 'platinum-electric', file: 'Bromic-Platinum-Electric-Sheet.pdf', no: '02',
    kicker: 'Platinum · Electric', title: 'Platinum Smart-Heat® Electric',
    deck: 'Discreet glass-faced heat that recesses into a 7.1 in ceiling.',
    status: ['Platinum Electric', 'Available', 'Marine', 'Available'],
    hero: 'pe-hero', heroPos: '50% 30%', close: 'pe-close', closePos: '50% 50%',
    closeCap: ['Recessed', 'Flush in a timber-lined ceiling'],
    intro: 'A tinted glass-ceramic face spreads warmth evenly and keeps visible light to a minimum, in a stainless body just 2.1 in deep, in black or white. It is the heater for the most considered outdoor rooms, with a Marine version in AISI 316 stainless for homes by the sea.',
    reasons: [
      ['Heat You Can Feel, Not See', 'The tinted glass face keeps visible light to a minimum, with no grille, reflector or guard on show, so the evening keeps the light you chose for it.'],
      ['Flush In A 7.1 In Ceiling', 'The low-clearance recess kit sets every output and colour flush in a 7.1 in cavity, with the recess box supplied and a cooling fan built in.'],
      ['Slim By Design', 'Just 2.1 in deep and finished in stainless steel and glass, Platinum reads as part of the architecture.'],
      ['Warmth, Dialled To The Evening', 'With the Affinity Smart-Heat® Dimmer, set the warmth in 1% steps, by zone and on a schedule. The 4500 W model has two elements for staged heat.'],
    ],
    spaces: ['Design-led terraces', 'Porches & shallow soffits', 'Restaurant patios', 'Outdoor kitchens', 'Coastal homes (Marine)'],
    cols: [['Platinum Electric', 'Covered spaces'], ['Platinum Electric Marine', 'By the sea']],
    rows: [
      ['Outputs', '2300, 3400, 4500 W', '2300, 3400, 4500 W'],
      ['Heat area', '65, 108, 143 ft²', '65, 108, 143 ft²'],
      ['Supply', '208 V or 220–240 V', '208 V or 220–240 V'],
      ['Body', '304 stainless, 2.1 in deep', 'AISI 316 marine-grade stainless'],
      ['Finishes', 'Black or white glass', 'Black or white glass'],
      ['Rating', '{TC}', 'IPX5; IP55 on 4500 W'],
      ['Weight', '17, 22, 33 lb', '17, 22, 33 lb'],
      ['Listing', 'Intertek ETL / cETL 5001799', 'Lloyd’s Register approval for marine applications'],
      ['Included', '8 in stainless pole and wall bracket', '{TC}'],
      ['Warranty', '3 years', '5 years on land; on vessels {TC}'],
    ],
    mounting: ['Low-clearance recess, 7.1 in', 'Standard recess kit', 'Ceiling', 'Wall', '8 in pole, included', '2 ft and 4 ft poles'],
    mountNote: 'Recess kits and longer poles are sold separately.',
    controls: 'Sold separately and quoted with every heater: the Affinity Smart-Heat® Dimmer in 1% steps or the On/Off Controller, a manual wall switch, and the expansion board for building systems.',
    accessories: 'Low-Clearance Recess Kit · Standard Recess Kit · 2 ft and 4 ft Poles',
    pair: [
      ['Pergola, vaulted porch or 277 V', 'Tungsten Smart-Heat® Electric Series II', 'up to 6 kW, with the Affinity Dimmer'],
      ['Over the dining table', 'Eclipse Smart-Heat® Electric', 'heat and light, with the Affinity Eclipse Controller'],
      ['Open seating away from walls', 'Tungsten Smart-Heat® Freestanding Gas', 'set at its own knob'],
    ],
    fine: ELEC_FINE,
  },
  {
    id: 'eclipse', file: 'Bromic-Eclipse-Sheet.pdf', no: '03',
    kicker: 'Eclipse · Electric', title: 'Eclipse Smart-Heat®',
    deck: 'Heat and light in one fixture, as a pendant or a freestanding arch.',
    status: ['Pendant', 'Available', 'Freestanding', 'Available'],
    hero: 'ec-hero', heroPos: '50% 38%', close: 'ec-close', closePos: '40% 50%',
    closeCap: ['Freestanding', 'The arch over a rooftop lounge'],
    intro: 'Eclipse pairs radiant heat with a warm, dimmable 3000K LED ring, so one fixture keeps the table warm and softly lit from sunset to the last glass. Hang it over the dining table, sweep it from a wall, or stand it beside the sofa on its own arch.',
    reasons: [
      ['Warmth And Light In One', 'Radiant heat and a dimmable LED ring in one fixture, with heat and light set separately from the remote or the app.'],
      ['Three Settings For Every Evening', 'Two elements give three heat steps, from 33% on a mild spring evening to the full 2,900 W on a cold night, over up to 121 ft² a heater.'],
      ['Seven Ways To Bring It In', 'The 24 in twin pole is included; 8, 24 and 48 in straight poles, a 24 in curved pole, a wall pole and the freestanding arch take it anywhere.'],
      ['Designed To Be Seen', 'A 27.6 in matte black disc with a radial ceramic screen and a halo of light: Eclipse is the heater you choose to show.'],
    ],
    spaces: ['Dining terraces', 'Restaurant canopies', 'Cafés under an awning', 'Pavilions', 'Lounges with no roof'],
    cols: [['Eclipse Electric', 'Pendant'], ['Eclipse Freestanding', 'Arch on a weighted base']],
    rows: [
      ['Output', '2,900 W; heat at 33, 66, 100%', '2,900 W; heat at 33, 66, 100%'],
      ['Heat area', 'Up to 121 ft²', 'Up to 121 ft²'],
      ['Light', '3000K dimmable LED ring, 497 lm', '3000K dimmable LED ring; lumens {TC}'],
      ['Supply', '208 V or 220–240 V, hard-wired', '220–240 V; 15 ft cable to an IP54 outdoor outlet'],
      ['Placement', 'Head at least 8 ft above the floor', '79 in minimum clearance; base holds in winds up to 20 mph'],
      ['Form', '27.6 in disc, 4.4 in deep', 'Arched arm on a weighted base with two wheels'],
      ['Finish, rating', 'Matte black; IP54', 'Matte black; IP54'],
      ['Controls', 'Affinity Eclipse Controller or Eclipse Dimmer Controller (sold separately)', 'Eclipse Dimmer Controller and remote included'],
      ['Warranty', '3 years', '3 years'],
    ],
    mounting: ['24 in twin pole, included', '8, 24, 48 in straight pole', '24 in curved pole', 'Wall mount pole', 'Freestanding arch'],
    mountNote: 'The pendant manual advises mounting under cover where possible.',
    controls: 'The Affinity Smart-Heat® Eclipse Controller (one Eclipse a channel) brings heat and light into the Bromic app with dimming, schedules and zones; or the Eclipse Dimmer Controller with remote. Add a manual wall switch. App control of the Freestanding: {TC}.',
    accessories: 'Straight, Curved and Wall Mount Poles',
    pair: [
      ['Ceiling that should stay clean', 'Platinum Smart-Heat® Electric', 'recessed, with the Affinity Dimmer'],
      ['Pergola needing more output', 'Tungsten Smart-Heat® Electric Series II', 'up to 6 kW, with the Affinity Dimmer'],
      ['Open seating away from power', 'Tungsten Smart-Heat® Freestanding Gas', 'set at its own knob'],
    ],
    fine: ELEC_FINE,
  },
  {
    id: 'platinum-gas', file: 'Bromic-Platinum-Gas-Sheet.pdf', no: '04',
    kicker: 'Platinum · Gas', title: 'Platinum Smart-Heat® Gas',
    deck: 'Radiant gas warmth behind a ceramic-glass screen, for covered terraces with a gas line.',
    status: ['Fuel', 'Natural gas or propane', 'Availability', 'To confirm'],
    hero: 'pg-hero', heroPos: '50% 22%', close: 'pg-close', closePos: '45% 40%',
    closeCap: ['Stainless', 'Angled on its wall bracket'],
    intro: 'Bromic’s design-led gas radiant heater: a ceramic-glass screen over a ceramic-tile burner, in black or stainless, for restaurant terraces, hotel and rooftop bars, pergolas and covered courtyards with a gas line.',
    reasons: [
      ['Up To 39,800 BTU Of Radiant Warmth', 'Two sizes, 23,600 and 39,800 BTU, warm up to 160 and 215 ft², so a covered terrace stays full long after the sun goes down.'],
      ['Designed To Be Seen', 'A signature ceramic-glass screen in a black or stainless body turns the heater into part of the design.'],
      ['Natural Gas Or Propane, The Same Warmth', 'Factory-built natural gas and propane models carry the same rated input, so the fuel follows the site and the warmth stays the same.'],
      ['Engineered For Peace Of Mind', 'Electronic spark ignition watches the flame and locks out if it fails, on an ETL and cETL listed heater with a factory-fitted isolating valve.'],
    ],
    spaces: ['Restaurant terraces', 'Hotel & rooftop bars', 'Pergolas', 'Covered courtyards', 'Outdoor kitchens'],
    cols: [['23,600 BTU', 'Three-tile burner'], ['39,800 BTU', 'Five-tile burner']],
    rows: [
      ['Heat area', '160 ft²', '215 ft²'],
      ['Fuel', 'Natural gas or propane, same input', 'Natural gas or propane, same input'],
      ['Size, weight', '22.1 in long; 33 lb', '29.8 in long; 44 lb'],
      ['Finishes', 'Black or stainless', 'Black or stainless'],
      ['Power', '110 V, under 2 A; 36 in cord and plug', '110 V, under 2 A; 36 in cord and plug'],
      ['Mounting height', 'At least 8 ft above the floor', 'At least 8 ft above the floor'],
      ['Listing, rating', 'ETL / cETL 4009079; IPX4', 'ETL / cETL 4009079; IPX4'],
      ['Ignition', 'Electronic spark, flame-monitored', 'Electronic spark, flame-monitored'],
      ['Warranty', '2 years, excl. hoses and igniters', '2 years, excl. hoses and igniters'],
    ],
    mounting: ['Wall bracket, included', 'Ceiling pole, two heaters back to back', 'Tilt 0°, 10° or 20°', 'Heat deflector, optional', 'Covered areas'],
    mountNote: 'On the ceiling pole, gas and power run inside the pole.',
    controls: 'The Affinity Smart-Heat® On/Off Controller switches up to 10 gas heaters a channel, or use a manual wall switch; the expansion board links the terrace to building systems. Gas heaters switch on and off; they do not dim.',
    accessories: 'Ceiling Mounting Pole · Heat Deflector',
    pair: [
      ['Open seating away from walls', 'Tungsten Smart-Heat® Freestanding Gas', 'set at its own knob'],
      ['No gas line, or dimming matters', 'Platinum Smart-Heat® Electric', 'with the Affinity Dimmer'],
      ['Shallow ceiling, heater out of sight', 'Tungsten Smart-Heat® Electric Series II', 'flush in 7.5 in, with the Affinity Dimmer'],
    ],
    fine: GAS_FINE,
  },
  {
    id: 'tungsten-gas', file: 'Bromic-Tungsten-Gas-Sheet.pdf', no: '05',
    kicker: 'Tungsten · Gas', title: 'Tungsten Smart-Heat® Gas',
    deck: 'A compact mounted heater for covered spaces and a wheeled tower for open seating.',
    status: ['Mounted', 'Available', 'Freestanding', 'Available'],
    hero: 'tg-hero', heroPos: '50% 12%', close: 'tg-close', closePos: '50% 30%',
    closeCap: ['Mounted', 'On ceiling brackets over a deck'],
    intro: 'Bromic’s gas workhorse: a compact mounted heater for covered patios, bars and homes with a gas line, and a wheeled freestanding tower for open terraces, sidewalks and pool decks. Every model runs on natural gas or propane.',
    reasons: [
      ['Warmth That Goes Where The Table Goes', 'The freestanding tower rolls on built-in wheels to wherever tonight’s seating is, and its tilting head aims the warmth at your guests.'],
      ['Compact Heat For Covered Spaces', 'On the wall, under the beam or on a drop pole, the mounted heater’s honeycomb face warms up to 215 ft² and stays out of the way.'],
      ['Natural Gas Or Propane, Every Model', 'Run it from the line you already have, or from propane where there is none: the tower houses a 20 lb cylinder in its base.'],
      ['Safety Built In', 'A flame failure device and an anti-tilt switch on the tower, and flame-monitored electronic ignition on the mounted heater.'],
    ],
    spaces: ['Restaurant terraces & bars', 'Patios with a gas line', 'Sidewalk cafés', 'Pool decks & lawns'],
    cols: [['Mounted', 'Smaller model'], ['Mounted', 'Larger model'], ['Freestanding', 'Wheeled tower']],
    rows: [
      ['Output', '{TC}', '{TC}', '{TC}'],
      ['Heat area', 'Up to 160 ft²', 'Up to 215 ft²', 'About 215 ft²'],
      ['Fuel', 'Natural gas or propane', 'Natural gas or propane', 'Propane, 20 lb cylinder in the base; or natural gas, 10 ft quick-connect'],
      ['Size, weight', 'About 19.3 in wide; 33 lb', 'About 25.4 in wide; 44 lb', '124 lb; 304 stainless column'],
      ['Power', '110 V, under 2 A', '110 V, under 2 A', 'No wiring on propane'],
      ['Aim', 'Pivot arm ±25°', 'Pivot arm ±25°', 'Tilting head'],
      ['Finish', 'Matte black, honeycomb face', 'Matte black, honeycomb face', 'Matte black'],
      ['Safety', 'Flame-monitored electronic ignition', 'Flame-monitored electronic ignition', 'Flame failure device, anti-tilt switch'],
      ['Warranty', '2 years, excl. hoses and igniters', '2 years, excl. hoses and igniters', '1 year (propane); natural gas {TC}'],
    ],
    mounting: ['Wall', 'Ceiling', 'Drop poles, six lengths', 'Pivot arm ±25°', 'Heat deflector', 'Freestanding on wheels'],
    mountNote: 'A deflector cuts the clearance above a mounted heater from 3 ft to 14 in.',
    controls: 'Mounted heaters switch from the Affinity Smart-Heat® On/Off Controller, up to 10 gas heaters a channel, or a manual wall switch; the expansion board links to building systems. On/Off with Tungsten Gas: {TC}. The tower is set at its own knob and is not on the app.',
    accessories: 'Ceiling Poles · Heat Deflector',
    pair: [
      ['Black or stainless glass face', 'Platinum Smart-Heat® Gas', 'same heat areas, with Affinity On/Off'],
      ['Flush ceiling, or no gas', 'Tungsten Smart-Heat® Electric Series II', 'recessed, with the Affinity Dimmer'],
      ['Heat and light over a lounge', 'Eclipse Smart-Heat® Freestanding', 'Eclipse Dimmer Controller included'],
    ],
    fine: GAS_FINE,
  },
];

// ---------- styles: editorial top, blueprint schedule ----------
const css = `
@font-face{font-family:BzDidot;src:url('${rel('app/src/fonts/gfs-didot-latin.woff2')}') format('woff2')}
@font-face{font-family:BzSans;src:url('${rel('app/src/fonts/arimo-latin.woff2')}') format('woff2')}
@font-face{font-family:BzMono;src:url('${rel('reports/themes/blueprint/fonts/plex-mono-400.woff2')}') format('woff2');font-weight:400}
@font-face{font-family:BzMono;src:url('${rel('reports/themes/blueprint/fonts/plex-mono-500.woff2')}') format('woff2');font-weight:500}
:root{--ink:#231F20;--steel:#6B7480;--hair:#C9CED4;--rule:#D9DBDC;--draw:#1C2B44;--flame:#EF4123;--m:.5in}
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:BzSans,'Helvetica Neue',Arial,sans-serif;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:8.5in;height:11in;position:relative;overflow:hidden;background:#fff}
sup.r{font-size:.5em;vertical-align:.7em;line-height:0;margin-left:.04em}
.mono{font-family:BzMono,monospace}
.lbl{font:500 6.6px/1.25 BzMono,monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--steel)}
.eyebrow{font:500 6.8px/1.2 BzMono,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--flame)}
.tc{font-family:BzMono,monospace;font-style:italic;font-size:.92em;color:var(--steel);letter-spacing:.02em;white-space:nowrap}
h1,h2,h3{font-family:BzDidot,Didot,serif;font-weight:400}

/* hero (editorial) */
.hero{position:absolute;left:0;top:0;width:8.5in;height:3.72in;background-size:cover;background-repeat:no-repeat}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,18,19,.7) 0%,rgba(20,18,19,.3) 18%,rgba(20,18,19,.08) 30%,rgba(20,18,19,0) 44%,rgba(20,18,19,.28) 64%,rgba(20,18,19,.82) 100%),linear-gradient(90deg,rgba(20,18,19,.35) 0%,rgba(20,18,19,0) 60%)}
.mast{position:absolute;top:.42in;left:var(--m);right:var(--m);display:flex;justify-content:space-between;align-items:center}
.mast img{height:.29in;display:block}
.mast .meta{text-shadow:0 0 6px rgba(0,0,0,.6);font:500 6.6px/1 BzMono,monospace;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.9);display:flex;gap:14px}
.mast .meta b{font-weight:500;color:var(--flame)}
.hcopy{position:absolute;left:var(--m);bottom:.36in;width:5.35in;color:#fff}
.kick{display:flex;align-items:center;gap:9px;margin-bottom:9px}
.kick::before{content:'';width:26px;height:1.2px;background:var(--flame)}
.kick span{font:500 7px/1 BzMono,monospace;letter-spacing:.28em;text-transform:uppercase;color:#fff}
.hcopy h1{font-size:30pt;line-height:1.0;letter-spacing:-.008em;text-shadow:0 1px 18px rgba(0,0,0,.2)}
.hcopy .deck{font-family:BzDidot,serif;font-style:italic;font-size:12.5pt;line-height:1.3;margin-top:8px;color:rgba(255,255,255,.92);max-width:4.6in}
.status{position:absolute;right:var(--m);bottom:.36in;display:grid;grid-template-columns:auto auto;border:.7px solid rgba(255,255,255,.75);color:#fff;font:400 6.6px/1.25 BzMono,monospace;letter-spacing:.12em;text-transform:uppercase;background:rgba(20,18,19,.28)}
.status div{padding:5px 8px;border-bottom:.5px solid rgba(255,255,255,.4)}
.status div:nth-child(odd){border-right:.5px solid rgba(255,255,255,.4);color:rgba(255,255,255,.72)}
.status div:nth-last-child(-n+2){border-bottom:0}
.status .tc{color:#fff;font-size:1em}

/* body */
.lede{position:absolute;left:var(--m);top:3.93in;width:4.66in}
.lede p{font-size:8.2pt;line-height:1.48;color:#3a3637;margin-top:6px}
.reasons{position:absolute;left:var(--m);right:var(--m);top:5.24in;display:grid;grid-template-columns:repeat(4,1fr);gap:0 .2in}
.reasons div{border-top:.6px solid var(--ink);padding-top:6px}
.reasons .no{font-family:BzDidot,serif;font-size:14pt;line-height:1;display:block;color:var(--ink)}
.reasons .rt{display:block;font:400 7.4px/1.3 BzSans,sans-serif;letter-spacing:.14em;text-transform:uppercase;margin:4px 0 3px;color:var(--ink)}
.reasons .rd{font-size:7pt;line-height:1.38;color:#4a4647}
.side{position:absolute;left:5.42in;right:var(--m);top:3.93in}
.lede .made{margin-top:8px}
.plate{border:.6px solid var(--draw);padding:4px}
.plate .pi{height:.98in;background-size:cover;background-repeat:no-repeat}
.plate figcaption{font:400 6.3px/1.4 BzMono,monospace;letter-spacing:.05em;margin-top:4px;color:var(--steel)}
.plate figcaption b{font-weight:500;color:var(--flame);letter-spacing:.14em;text-transform:uppercase;margin-right:4px}
.made .lbl{color:var(--draw);margin-bottom:5px}
.tags{display:flex;flex-wrap:wrap;gap:4px}
.tags span{border:.7px solid var(--draw);font:500 6.4px/1 BzMono,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--draw);padding:4px 5px 3px}

/* schedule (blueprint) */
.sched{position:absolute;left:var(--m);right:var(--m);top:6.43in}
.sched .hdr{display:flex;justify-content:space-between;border-bottom:.9px solid var(--draw);padding-bottom:4px;color:var(--draw)}
.sched .hdr .r{color:var(--flame)}
.sched table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:7.2px;line-height:1.3;color:var(--ink)}
.sched th{font:500 6px/1.2 BzMono,monospace;letter-spacing:.13em;text-transform:uppercase;text-align:left;color:var(--draw);padding:5px 8px 4px 0;border-bottom:.5px solid var(--hair);vertical-align:bottom}
.sched th i{display:block;font-style:normal;font-weight:400;color:var(--steel);letter-spacing:.1em;margin-top:2px}
.sched td{padding:2.8px 8px 2.4px 0;border-bottom:.5px solid var(--hair);vertical-align:top}
.sched td.k{font:500 6px/1.6 BzMono,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--steel)}
.sched td.k::before{content:'';display:inline-block;width:4px;height:4px;border:.6px solid var(--draw);margin:0 6px 1px 0;vertical-align:middle}

/* lower band */
.band{position:absolute;left:var(--m);right:var(--m);top:8.5in;display:grid;grid-template-columns:2.05in 2.6in 1fr;gap:.2in}
.band>div{border-top:.9px solid var(--draw);padding-top:5px}
.band h3{font-size:10.5pt;line-height:1.05;margin:3px 0 5px;color:var(--ink)}
.band .lbl.req{color:var(--flame)}
.band p,.band li{font-size:6.8pt;line-height:1.38;color:#3a3637}
.band .note{font-size:6.3pt;color:var(--steel);margin-top:4px}
.band .acc{font:400 6.2px/1.45 BzMono,monospace;letter-spacing:.04em;color:var(--draw);margin-top:4px}
.band ul{list-style:none}
.band li{padding:0 0 3px 0}
.band li b{display:block;font:500 6px/1.3 BzMono,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--steel)}
.band li em{font-style:normal;color:var(--ink)}

/* footer */
.foot{position:absolute;left:var(--m);right:var(--m);bottom:.28in;height:.6in;display:grid;grid-template-columns:2.15in 1fr 1.62in;gap:.2in;align-items:stretch;border-top:.5px solid var(--hair);padding-top:7px}
.cta .btn{display:inline-block;background:var(--ink);color:#fff;font:400 6.9px/1 BzSans,sans-serif;letter-spacing:.2em;text-transform:uppercase;padding:7px 10px 6px}
.cta .ct{font:400 6.3px/1.45 BzMono,monospace;letter-spacing:.04em;color:var(--draw);margin-top:5px}
.fine{font-size:5.6pt;line-height:1.42;color:var(--steel)}
.tb{border-left:.6px solid var(--draw);padding-left:8px;font:400 6.2px/1.5 BzMono,monospace;color:var(--draw);letter-spacing:.06em;display:grid;grid-template-columns:1fr auto;align-content:start;column-gap:8px}
.tb b{font-weight:500;font-size:5.4px;letter-spacing:.16em;color:var(--steel)}
.tb .sh{grid-row:span 3;font-size:17px;line-height:1;text-align:right;align-self:end}
.tb .sh i{font-style:normal;font-size:8px;color:var(--steel)}
`;

const cell = (s) => t(s);
const page = (s) => {
  const n = s.cols.length;
  const kw = n === 3 ? '1.05in' : '1.25in';
  return `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<title>${s.title.replace('®', '')} · Bromic Series Sheet</title><style>${css}</style></head><body>
<section class="page">
  <div class="hero" style="background-image:url('img/${s.hero}.jpg');background-position:${s.heroPos}">
  <div class="shade"></div>
  <div class="mast"><img src="img/bromic-logo-white.png" alt="Bromic Heating">
    <div class="meta"><span>Series Sheet <b>${s.no}</b> / 05</span><span>Retail</span></div></div>
  <div class="hcopy">
    <div class="kick"><span>${s.kicker}</span></div>
    <h1>${t(s.title)}</h1>
    <p class="deck">${s.deck}</p>
  </div>
  <div class="status">${s.status.map((x) => `<div>${x === 'To confirm' ? TC : x}</div>`).join('')}</div>
  </div>

  <div class="lede"><div class="eyebrow">The Series</div><p>${t(s.intro)}</p>
    <div class="made"><div class="lbl">Made For These Spaces</div><div class="tags">${s.spaces.map((x) => `<span>${x}</span>`).join('')}</div></div></div>
  <div class="reasons">${s.reasons.map(([h, d], i) => `<div><span class="no">0${i + 1}</span><span class="rt">${t(h)}</span><p class="rd">${t(d)}</p></div>`).join('')}</div>

  <div class="side">
    <figure class="plate"><div class="pi" style="background-image:url('img/${s.close}.jpg');background-position:${s.closePos}"></div>
      <figcaption><b>${s.closeCap[0]}</b>${t(s.closeCap[1])}</figcaption></figure>
  </div>

  <div class="sched">
    <div class="hdr lbl"><span>Specification · At A Glance</span><span class="r">Published figures only</span></div>
    <table><colgroup><col style="width:${kw}">${s.cols.map(() => '<col>').join('')}</colgroup>
      <tr><th></th>${s.cols.map(([a, b]) => `<th>${a}<i>${b}</i></th>`).join('')}</tr>
      ${s.rows.map(([k, ...v]) => `<tr><td class="k">${k}</td>${v.map((x) => `<td>${cell(x)}</td>`).join('')}</tr>`).join('')}
    </table>
  </div>

  <div class="band">
    <div class="mnt"><div class="lbl">Mounting</div><h3>Mounting Options</h3>
      <div class="tags">${s.mounting.map((x) => `<span>${x}</span>`).join('')}</div>
      <p class="note">${t(s.mountNote)}</p></div>
    <div class="ctl"><div class="lbl req">Required with every heater</div><h3>Recommended Controls &amp; Accessories</h3>
      <p>${t(s.controls)}</p><p class="note">${t(WIFI)}</p><div class="acc">${s.accessories}</div></div>
    <div class="pr"><div class="lbl">Across the range</div><h3>Pair It With</h3>
      <ul>${s.pair.map(([sp, prod, how]) => `<li><b>${sp}</b><em>${t(prod)}</em>, ${t(how)}</li>`).join('')}</ul></div>
  </div>

  <div class="foot">
    <div class="cta"><span class="btn">Request Your Design Plan</span>
      <div class="ct">bromic.com/design-your-space · 1-800-301-1293<br>Complimentary design service, Mon–Fri 9–4 PT</div></div>
    <p class="fine">${s.fine}</p>
    <div class="tb"><b>Series</b><span class="sh">${s.no}<i>/05</i></span><span>${s.kicker.replace(' · ', ' ')}</span><b>Issue</b><span>Draft · Nov 2026</span></div>
  </div>
</section></body></html>`;
};

// ---------- print check: nothing off the page, no overlapping blocks, no overflowing block, every image loaded ----------
async function check(p) {
  return p.evaluate(async () => {
    await document.fonts.ready;
    const out = [];
    const pg = document.querySelector('.page').getBoundingClientRect();
    const inside = (q, r, pad = 0.5) => q.left >= r.left - pad && q.right <= r.right + pad && q.top >= r.top - pad && q.bottom <= r.bottom + pad;
    const ov = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    document.querySelectorAll('img').forEach((i) => { if (!i.complete || !i.naturalWidth) out.push('image not loaded: ' + i.src); });
    for (const el of document.querySelectorAll('.hero,.pi')) {
      const u = getComputedStyle(el).backgroundImage.match(/url\("?(.*?)"?\)/)[1];
      const ok = await new Promise((res) => { const im = new Image(); im.onload = () => res(im.naturalWidth > 0); im.onerror = () => res(false); im.src = u; });
      if (!ok) out.push('background image missing: ' + u);
    }
    document.querySelectorAll('h1,h3,p,li,td,th,span,figcaption,.lbl').forEach((e) => {
      const q = e.getBoundingClientRect(); if (!q.width) return;
      if (!inside(q, pg)) out.push(`text off page: "${e.textContent.trim().slice(0, 40)}"`);
    });
    // footer and margins: no content past the 0.3in bottom margin
    const blocks = ['.hcopy', '.status', '.mast', '.lede', '.reasons', '.side', '.sched', '.band .mnt', '.band .ctl', '.band .pr', '.foot'].map((s) => {
      const e = document.querySelector(s); const r = e.getBoundingClientRect();
      // the real extent of a block is its children's extent
      let b = r.bottom; e.querySelectorAll('*').forEach((c) => { const q = c.getBoundingClientRect(); if (q.height) b = Math.max(b, q.bottom); });
      return { s, r: { left: r.left, right: r.right, top: r.top, bottom: b } };
    });
    for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
      if (ov(blocks[i].r, blocks[j].r) > 2) out.push(`blocks overlap: ${blocks[i].s} / ${blocks[j].s}`);
    }
    blocks.forEach(({ s, r }) => { if (r.bottom > pg.bottom - 0.25 * 96) out.push(`${s} runs into the bottom margin`); });
    // hero copy must not run into the status box or off the photo
    const hero = document.querySelector('.hero').getBoundingClientRect();
    ['.hcopy', '.status'].forEach((s) => { const q = document.querySelector(s).getBoundingClientRect(); if (q.bottom > hero.bottom || q.top < hero.top) out.push(`${s} leaves the photo`); });
    // no element clipped by overflow
    document.querySelectorAll('.page *').forEach((e) => { if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'hidden') out.push('clipped: ' + e.className); });
    if (document.body.innerHTML.includes('[[VERIFY')) out.push('raw VERIFY note in the page');
    if (/\$\s?\d/.test(document.body.innerText)) out.push('a price is on the page');
    return out;
  });
}

(async () => {
  prepImages();
  fs.mkdirSync(path.join(HERE, 'pages'), { recursive: true });
  const browser = await chromium.launch();
  let bad = 0;
  for (const s of SHEETS) {
    const html = path.join(HERE, `${s.id}.html`);
    fs.writeFileSync(html, page(s));
    const p = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
    await p.goto('file://' + html, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const issues = await check(p);
    await p.screenshot({ path: path.join(HERE, 'pages', `${s.id}.png`), clip: { x: 0, y: 0, width: 816, height: 1056 } });
    await p.pdf({ path: path.join(HERE, s.file), width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true });
    const pages = (fs.readFileSync(path.join(HERE, s.file), 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    if (pages !== 1) issues.push(`PDF has ${pages} pages`);
    const kb = Math.round(fs.statSync(path.join(HERE, s.file)).size / 1024);
    console.log(`${s.id}: ${kb} KB, ${issues.length} issues`); issues.forEach((x) => console.log('  ' + x));
    bad += issues.length;
    await p.close();
  }
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
