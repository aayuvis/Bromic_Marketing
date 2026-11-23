// Bromic vs Infratech: a four-page US Letter comparison for retail floor staff and buyers.
// Owner, 23 Nov 2026: "remove sources..make it more visual...can run 3-4 pages....call out differences first...highlight
// differences more clearly". So: page 1 the differences up front, page 2 the side-by-side matrix with product photos,
// page 3 three settings with their heaters and controls, page 4 how to sell it and the CTA.
//
// Sources are NOT printed. Every fact below carries `src: [...]`: ids from data/product-marketing/tungsten-electric-series-ii.json
// sources[] (and platinum-electric.json, plus `pf` = data/product-facts.json and `lp` = the Partner Program page). The build
// checks each id resolves and writes them, fact by fact, to sources.json beside this file, so the sheet stays traceable for
// the Specification and compliance review (needs_approval). sources.json is internal: the Hub publishes only the PDF and thumb.
//
// Rules kept: facts only from the framework's m3 rows, claim_checks and product-facts (no new facts); open facts
// ([[VERIFY]]) print as "To confirm"; no prices; no Infratech logo or imagery (Bromic images only, approved in
// data/image-review.json or in the image library); never "only" unqualified, "shallowest" or "lowest clearance" (claim_checks);
// every heater with its Affinity controls (hard rule 4); Series II has launched (hard rule 7); where Infratech matches or
// leads, the sheet says so, plainly.
// Run: node reports/retail/vs-infratech/build.js
//   → index.html, pages/p1–p4.png, Bromic-vs-Infratech.pdf, meta.json, sources.json, print-check.txt, ../_hub/vs-infratech.webp
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '../../..');
const rel = (p) => path.relative(HERE, path.join(ROOT, p)).split(path.sep).join('/');
const repoRel = (p) => path.relative(ROOT, path.join(HERE, p)).split(path.sep).join('/');
const S2 = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/product-marketing/tungsten-electric-series-ii.json'), 'utf8'));
const PE = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/product-marketing/platinum-electric.json'), 'utf8'));
const PAGES = 4;

const T = { ink: '#231F20', steel: '#6B7480', mute: '#8E949B', hair: '#D9DDE2', wash: '#F5F5F3', flame: '#EF4123', tint: '#FDEDE8' };
const R = '®';
const TC = '<i class="tc">to confirm</i>';
const REVIEW = 'Specification and compliance review required before external use';

// ---------- sources: kept in the build, never printed ----------
const byId = {};
for (const s of [...S2.sources, ...PE.sources]) if (!byId[s.id]) byId[s.id] = s;
byId.lp = { id: 'lp', publisher: 'Bromic Heating', title: 'Bromic Partner Program (builders and trade) page, read 29 Oct 2026', year: 2026, url: 'https://www.bromic.com/lp-builders/' };
byId.pf = { id: 'pf', publisher: 'Bromic Heating', title: 'data/product-facts.json, Tungsten Series II: warranty "3 years heater, 7 years elements" (owner, 22 Nov 2026)', year: 2026, url: 'internal' };
byId.p11 = byId.p11 || { id: 'p11', publisher: 'Bromic Heating', title: 'Outdoor Lookbook 2026', year: 2026, url: 'internal' };
const LEDGER = [];   // [{page, fact, src:[{id,publisher,title,year,url}]}] → sources.json
const cite = (page, fact, ids) => {
  for (const id of ids) if (!byId[id]) throw new Error(`unknown source ${id} for "${fact}"`);
  LEDGER.push({ page, fact: fact.replace(/<[^>]+>/g, ''), src: ids.map((id) => { const s = byId[id]; return { id, publisher: s.publisher, title: s.title, year: s.year, url: s.url }; }) });
};

// ---------- icons: Lucide line icons (ISC licence), the set the launch deck uses ----------
const ICON = {
  badge: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m16 9-5.5 5.5L8 12"/>',
  fan: '<path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/><path d="M12 12v.01"/>',
  house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  palette: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',
  phone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  waves: '<path d="M2 12q2.5 2 5 0t5 0 5 0 5 0"/><path d="M2 19q2.5 2 5 0t5 0 5 0 5 0"/><path d="M2 5q2.5 2 5 0t5 0 5 0 5 0"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  minus: '<path d="M5 12h14"/>',
  sliders: '<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>',
  store: '<path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"/><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/>',
};
const icon = (k, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

// ---------- images: Bromic only. Series II renders and scenes approved in data/image-review.json; one Lookbook photo ----------
const REVIEW_IMG = {
  'hero-family': 'pr-select-family-three-finishes',
  'r-recess': 'pr-bg-black-recess-kit-plaster-ceiling',
  'r-post': 'pr-a-graphite-ceiling-hero-light',
  'r-wall': 'pr-select-white-angled-bracket',
  's-porch': 'ts2-r9c-07',
  's-loggia': 'pr-bg-graphite-pair-ceiling-lounge-f14',
  's-court': 'pr-c-black-wall-limewash-bench',
};
const LIB_IMG = { 'l-beach': 'images/library/l-002-006.webp' };
function prepImages() {
  fs.mkdirSync(path.join(HERE, 'img'), { recursive: true });
  for (const f of fs.readdirSync(path.join(HERE, 'img'))) if (/\.jpg$/.test(f)) fs.unlinkSync(path.join(HERE, 'img', f));
  const rv = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/image-review.json'), 'utf8')).items.map((r) => [r.id, r]));
  const man = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, 'images/library/manifest.json'), 'utf8')).map((m) => [m.file, m]));
  const jobs = [];
  for (const [k, id] of Object.entries(REVIEW_IMG)) {
    const r = rv[id]; if (!r) throw new Error('not in image-review.json: ' + id);
    if (r.status !== 'approved') throw new Error(`image not approved: ${id} (${r.status})`);
    jobs.push([path.join(ROOT, r.file), path.join(HERE, 'img', `${k}.jpg`)]);
  }
  for (const [k, src] of Object.entries(LIB_IMG)) {
    if (!man[src]) throw new Error('not in the library: ' + src);
    if (/rejected/i.test(man[src].status)) throw new Error('rejected image: ' + src);
    jobs.push([path.join(ROOT, src), path.join(HERE, 'img', `${k}.jpg`)]);
  }
  const py = `
import sys, json
from PIL import Image
for src, out in json.loads(sys.argv[1]):
    im = Image.open(src).convert('RGB')
    im.thumbnail((1600, 1600), Image.LANCZOS)
    im.save(out, 'JPEG', quality=80, optimize=True, progressive=True)
`;
  const r = spawnSync('python3', ['-c', py, JSON.stringify(jobs)], { stdio: 'inherit' });
  if (r.status) throw new Error('image prep failed');
  fs.copyFileSync(path.join(ROOT, 'images/portfolio/bromic-logo.png'), path.join(HERE, 'img/bromic-logo.png'));
}
const ph = (k, pos = 'center') => `background-image:url(img/${k}.jpg);background-position:${pos}`;

// ---------- page 1: the differences up front (each a "bromic" edge in m3.rows) ----------
const edgeOf = Object.fromEntries(S2.m3.rows.map((r) => [r.benefit, r.edge]));
const CALLOUTS = [
  { b: 'warranty', icon: 'badge', label: 'Warranty', big: '3 <em>+</em> 7', unit: 'years: heater + elements',
    bromic: 'Three years on the heater and seven on the elements, across Select, Coastal and Classic.',
    infra: 'A 3-year limited warranty; a fourth year through Elite Retailers and the Installer Program.',
    src: ['pf', 's4', 'i9', 'i17'] },
  { b: 'recess', icon: 'fan', label: 'Worry-free recessing', big: '6 kW', unit: 'worry-free recessing, up to 6 kW',
    bromic: `Worry-free recessing up to 6,000 W, into a 7.5 in ceiling cavity (${TC}). The low-clearance kit is dual fan-ventilated and the recess box comes with it.`,
    infra: 'Flush frames sit in a framed 2×8 pocket lined on five sides with Type X drywall; no fans are shown.',
    src: ['b2', 's5', 'd1', 'i12', 'i13'] },
  { b: 'install_flex', icon: 'house', label: 'Pitched ceilings and tilt', big: '3/12<em>–</em>12/12', unit: 'pitched-ceiling range',
    bromic: `Mounts to a pitched ceiling with its adaptor, and to a wall, extended wall or single post; tilts up to 45° (4 and 6 kW: ${TC}).`,
    infra: 'Its flush frame "is ONLY to be used on a flat non-sloped ceiling".',
    src: ['b1', 'd1', 'i12', 'i6'] },
  { b: 'aesthetics', icon: 'palette', label: 'One finish, front included', big: '3', unit: 'finishes, the front in the same one',
    bromic: 'All black, all white or all graphite, front included; three front patterns swap without re-wiring.',
    infra: 'Eight powder-coat colours plus custom on the housing; the reflector face and wire guard stay stainless.',
    src: ['d1', 's1', 'i2', 'i14'] },
  { b: 'controls', icon: 'phone', label: 'Smart controls and app', big: '1%', unit: 'dimming steps in the Bromic app',
    bromic: `Affinity Smart-Heat${R} Controls: zones, schedules, timers, remote off, Alexa and Google Assistant. Wi-Fi and app features need compatible Affinity controls, sold separately.`,
    infra: 'App control through Bond: a Smart Dimmer with its control panel, or a Smart Switch for on/off with a 2-hour timer.',
    src: ['b3', 'b4', 'i7', 'i16'] },
  { b: 'coastal', icon: 'waves', label: 'Built for the coast', big: 'IPX5', unit: 'weather rating',
    bromic: `Tungsten Coastal adds a corrosion-resistant coating over a marine-grade build as standard (316 per the Lookbook: ${TC}).`,
    infra: 'IPX4; 316 stainless is a Marine UpGrade at extra cost.',
    src: ['b1', 'p11', 'i3', 'i18'] },
];
for (const c of CALLOUTS) {
  if (edgeOf[c.b] !== 'bromic') throw new Error(`call-out ${c.b} is not a "bromic" edge in the data`);
  cite(1, `${c.label}: ${c.big.replace(/<[^>]+>/g, '')} ${c.unit}. Bromic: ${c.bromic} Infratech: ${c.infra}`, c.src);
}
const callouts = `<div class="co-grid">${CALLOUTS.map((c) => `<article class="co">
  <div class="co-top"><span class="co-ic">${icon(c.icon)}</span><span class="co-lbl">${c.label}</span></div>
  <p class="co-big">${c.big}</p><p class="co-unit">${c.unit}</p>
  <p class="co-b">${c.bromic}</p>
  <p class="co-i"><b>Infratech</b>${c.infra}</p>
</article>`).join('')}</div>`;

// ---------- page 2: the matrix. Each row is a fact from m3.rows (edge per row: bromic, parity or infratech) ----------
const Y = (t) => `<span class="ok">${icon('check', 'tk')}${t}</span>`;
const N = (t) => `<span class="no">${icon('minus', 'tk')}${t}</span>`;
const bar = (yrs, txt, extra) => `<span class="bar"><span class="bt" style="width:${yrs * 11}px"></span>${extra ? `<span class="bx" style="width:${extra * 11}px"></span>` : ''}<span class="bl">${txt}</span></span>`;
const MATRIX = [
  ['Recess', [
    ['Recessed output', Y('6,000 W'), Y('6,000 W (W/WD)'), 'parity', ['b2', 'd1', 'i13']],
    ['Fans in the recess kit', Y('Two, dual fan-ventilated'), N('None shown'), 'bromic', ['b2', 'i12']],
    ['Recess enclosure', Y('Recess box supplied with the kit'), 'Framed 2×8 pocket, lined on five sides', 'bromic', ['d1', 'b2', 'i12']],
  ]],
  ['Mounting', [
    ['Pitched ceilings', Y('3/12 to 12/12, with adaptor'), 'Flush frame: flat ceilings only', 'bromic', ['b1', 'i12']],
    ['Suspended', Y('One post'), 'A pair of drop rods a heater', 'bromic', ['d1', 'i15']],
  ]],
  ['Look', [
    ['Front in the heater\'s finish', Y('Black, white or graphite'), 'Reflector and guard stay stainless', 'bromic', ['d1', 'i14']],
    ['Housing colours', '3', '8 plus custom, or brushed stainless', 'infratech', ['d1', 'i2', 'i14']],
    ['Interchangeable fronts', Y('3 patterns, no re-wiring'), 'Motif covers, surface-mount C/CD only', 'bromic', ['d1', 'i2']],
    ['Junction box', Y('None visible'), 'On top of the heater', 'bromic', ['d1', 'b1', 'i2']],
  ]],
  ['Weather', [
    ['Water rating', '<b class="v">IPX5</b>', '<b class="v">IPX4</b>', 'bromic', ['b1', 'i3']],
    ['Coastal protection', Y(`Coating as standard on Coastal`), '316 stainless at extra cost', 'bromic', ['p11', 'b1', 'i18']],
  ]],
  ['Controls', [
    ['Dimming', Y('1% steps, Affinity'), Y('Bond Smart Dimmer'), 'parity', ['b3', 'i7', 'i16']],
    ['Controls and app', Y('Bromic\'s own: Affinity and the Bromic app'), 'Through Bond', 'bromic', ['b3', 'b4', 'i7', 'i16']],
    ['Voice and home systems', 'Alexa, Google; Control4, Crestron, Lutron', 'Lutron and Crestron', 'bromic', ['b3', 'i7']],
  ]],
  ['Heat', [
    ['Output', '2 to 6 kW', '1.5 to 6 kW', 'parity', ['b1', 'i3']],
    ['Supply voltage', '208, 240 and 277 V', '120 to 480 V', 'infratech', ['d1', 'i3']],
    ['Coverage, 6 kW', 'Up to 160 ft²', 'About 121 ft² at 8–12 ft', 'parity', ['b1', 'i19']],
  ]],
  ['Warranty', [
    ['Warranty, years', bar(3, 'Heater 3') + bar(7, 'Elements 7'), bar(3, '3, limited', 1) + '<span class="bn">+1 through Elite Retailers and installers</span>', 'bromic', ['pf', 's4', 'i9', 'i17']],
  ]],
  ['Range', [
    ['Gas and freestanding', Y('In the same portfolio'), N('Fixed electric only'), 'bromic', ['s1', 'p11', 'i2']],
    ['Design support', Y('Free custom design plans; Revit, CAD'), Y('Design guides, CAD details, CE credits'), 'parity', ['lp', 'p10', 'i10']],
  ]],
];
for (const [g, rows] of MATRIX) for (const [f, b, i, e, src] of rows) cite(2, `${g} · ${f} · Bromic: ${b} · Infratech: ${i} · edge ${e}`, src);
const tally = { bromic: 0, parity: 0, infratech: 0 };
for (const [, rows] of MATRIX) for (const r of rows) tally[r[3]]++;
const EDGE = { bromic: ['b', 'Bromic'], parity: ['p', 'Level'], infratech: ['i', 'Infratech'] };
const matrix = `<table class="mx"><colgroup><col style="width:58px"><col style="width:118px"><col><col style="width:178px"><col style="width:62px"></colgroup>
  <thead><tr><th></th><th>Feature</th><th class="hb">Tungsten Series II</th><th>Infratech</th><th>Ahead</th></tr></thead>
  ${MATRIX.map(([g, rows]) => `<tbody>${rows.map((r, k) => `<tr class="e-${EDGE[r[3]][0]}">${k === 0 ? `<th class="grp" rowspan="${rows.length}">${g}</th>` : ''}<td class="ft">${r[0]}</td><td class="cb">${r[1]}</td><td class="ci">${r[2]}</td><td class="ed"><span class="mk ${EDGE[r[3]][0]}"></span>${EDGE[r[3]][1]}</td></tr>`).join('')}</tbody>`).join('')}
</table>`;
const total = tally.bromic + tally.parity + tally.infratech;
const tallyBar = `<div class="tally">
  <div class="tl-bar"><span class="tb b" style="flex:${tally.bromic}"></span><span class="tb p" style="flex:${tally.parity}"></span><span class="tb i" style="flex:${tally.infratech}"></span></div>
  <div class="tl-key"><span><span class="mk b"></span><b>${tally.bromic}</b> Bromic ahead</span><span><span class="mk p"></span><b>${tally.parity}</b> level</span><span><span class="mk i"></span><b>${tally.infratech}</b> Infratech ahead</span><span class="tl-n">of ${total} points</span></div>
</div>`;
const renders = `<div class="renders">${[['r-post', 'Ceiling post', 'center 55%'], ['r-recess', 'Recessed in the low-clearance kit', 'center 35%'], ['r-wall', 'Angled wall bracket', 'center']].map(([k, c, pos]) => `<figure><div class="ri" style="${ph(k, pos)}"></div><figcaption>${c}</figcaption></figure>`).join('')}</div>`;

// ---------- page 3: in use. Each setting names its heater and its controls (hard rule 4) ----------
const CTL = `Affinity Smart-Heat${R} Dimmer, or On/Off where dimming is not wanted, with a manual wall switch. Wi-Fi and app features need compatible Affinity controls, sold separately.`;
const SETTINGS = [
  { img: 's-porch', pos: 'center 40%', title: 'The Covered Porch', cap: 'Series II recessed in the low-clearance kit, white, on a beach-house porch. Product render.',
    heater: `Tungsten Smart-Heat${R} Electric Series II, Coastal, recessed in the marine-grade low-clearance kit`,
    points: [
      ['fan', 'Recessed into the ceiling with a dual fan-ventilated kit; the recess box comes with it, so there is no lined pocket to build.', ['b2', 'd1']],
      ['waves', 'By the sea, Coastal\'s corrosion-resistant coating is standard and the heater is rated IPX5.', ['b1', 'p11']],
      ['palette', 'A white heater, front included, reads as part of a white ceiling.', ['d1']],
    ], src: ['b1', 'b2', 'b3'] },
  { img: 's-loggia', pos: 'center 45%', title: 'The Loggia Lounge', cap: 'Two Series II Select, graphite, on short ceiling posts, angled over the seating. Product render.',
    heater: `Tungsten Smart-Heat${R} Electric Series II, Select, on single ceiling posts`,
    points: [
      ['wrench', 'One post a heater, where a drop-pole install takes a pair of rods.', ['d1', 'i15']],
      ['house', `Gable or vaulted roof: the adaptor mounts to pitched ceilings from 3/12 to 12/12, and the heater tilts toward the seats (up to 45°; 4 and 6 kW ${TC}).`, ['b1', 'd1']],
      ['sliders', 'Two heaters, two zones: dim each in 1% steps, or schedule both, in the Bromic app.', ['b3', 'b4']],
    ], src: ['b1', 'b3'] },
  { img: 's-court', pos: 'center 40%', title: 'The Courtyard Wall', cap: 'Series II Select, black, on the angled wall bracket over a built-in bench. Product render.',
    heater: `Tungsten Smart-Heat${R} Electric Series II, Select, on the angled wall bracket`,
    points: [
      ['palette', 'All black, front included, with no visible junction box on the wall.', ['d1', 'b1']],
      ['phone', 'Timers, schedules and remote off from the Bromic app; Alexa or Google Assistant by voice.', ['b3', 'b4']],
      ['badge', 'Three years on the heater and seven on the elements.', ['pf', 's4']],
    ], src: ['b1', 'b3'] },
];
for (const s of SETTINGS) { cite(3, `${s.title}: ${s.heater}. Controls: ${CTL}`, s.src); for (const [, t, src] of s.points) cite(3, `${s.title}: ${t}`, src); }
const settings = SETTINGS.map((s) => `<article class="set">
  <figure class="sp"><div class="si" style="${ph(s.img, s.pos)}"></div><figcaption>${s.cap}</figcaption></figure>
  <div class="st"><h3>${s.title}</h3>
    <dl class="kit"><dt>Heater</dt><dd>${s.heater}</dd><dt>Controls</dt><dd>${CTL}</dd></dl>
    <p class="wm">Where it matters</p>
    <ul class="pts">${s.points.map(([ic, t]) => `<li>${icon(ic, 'pi')}<span>${t}</span></li>`).join('')}</ul>
  </div>
</article>`).join('');

// ---------- page 4: how to sell it ----------
const POINTS = [
  { h: 'Start With The Ceiling', t: `Ask where the heat will mount. Flat, pitched from 3/12 to 12/12, or recessed: Series II offers worry-free recessing up to 6,000 W, with a dual fan-ventilated kit and the recess box supplied. Infratech recesses 6 kW too; its flush frame needs a lined 2×8 pocket on a flat ceiling, and its drawing says: "After 4 hours of continuous use, a 15 minute cool down period is recommended".`,
    src: ['b1', 'b2', 'i12', 'i13'] },
  { h: 'Show The Whole Heater', t: 'Black, white or graphite carries through to the front, with three front patterns that swap without re-wiring. If the customer wants a specific colour, Infratech offers eight plus custom: say so, then show how the Bromic heater reads as one piece.',
    src: ['d1', 'i2', 'i14'] },
  { h: 'Quote It With Its Controls', t: `Every heater goes on the quote with its Affinity Smart-Heat${R} control and a wall switch. Then the warranty: three years on the heater and seven on the elements.`,
    src: ['b3', 'pf', 's4'] },
];
for (const p of POINTS) cite(4, `${p.h}: ${p.t}`, p.src);
const FAIR = [
  'Factual lines only; never run down another brand.',
  'Where Infratech leads or matches, say so: colours, voltages to 480 V, recessing to 6 kW.',
  'Never "only" without its qualifier, and no superlatives about depth or clearance.',
  'No prices, and no Infratech logo or imagery.',
];
cite(4, 'Keep it fair: Infratech colours, voltages to 480 V, recessing to 6 kW', ['i2', 'i3', 'i13']);
const OPEN = [
  'Series II recess kit: 7.5 in as the cavity depth, no fire-rated lining under its listing, and continuous-use guidance',
  'Tilt to 45° on 4 and 6 kW (the Series II manual gives 30°)',
  'Coastal body material (316 per the Lookbook) and the coating\'s name',
];
const sell = `<ol class="sell">${POINTS.map((p, i) => `<li><span class="sn">${i + 1}</span><div><h3>${p.h}</h3><p>${p.t}</p></div></li>`).join('')}</ol>`;

// ---------- page furniture ----------
const top = (n) => `<header class="top"><img class="logo" src="img/bromic-logo.png" alt="Bromic Heating"><span class="tl">Retail kit · Bromic vs Infratech</span></header>`;
const foot = (n) => `<footer class="foot"><span>Tungsten Smart-Heat${R} Electric Series II and Infratech electric infrared heaters, as each brand published them, November 2026.</span><span class="rv">${REVIEW}</span><span class="pg">${String(n).padStart(2, '0')}<i> / ${String(PAGES).padStart(2, '0')}</i></span></footer>`;
const page = (n, body, cls = '') => `<section class="page ${cls}">${top(n)}<div class="flow">${body}</div>${foot(n)}</section>`;

const page1 = page(1, `
  <div class="p1-head">
    <div><p class="eyebrow">Bromic vs Infratech · the differences</p>
    <h1>Where Bromic Pulls Ahead</h1>
    <p class="lede">Tungsten Smart-Heat${R} Electric Series II against Infratech's electric infrared heaters, on the six points customers ask about. Select and Coastal are available now; Classic follows in January 2027.</p></div>
  </div>
  <figure class="hero"><div class="hi" style="${ph('hero-family', 'center 42%')}"></div><figcaption>Tungsten Series II Select in black, graphite and white. Product render.</figcaption></figure>
  ${callouts}
  <p class="key"><span class="kb">Bromic</span> in ink, <span class="ki">Infratech</span> in grey, from each brand's own documents. <i class="tc">To confirm</i>: a Bromic fact the Product team is checking.</p>`);

const page2 = page(2, `
  <p class="eyebrow">Bromic vs Infratech · side by side</p>
  <h2>Point By Point</h2>
  <div class="p2-band">${renders}${tallyBar}</div>
  ${matrix}
  <p class="key">Flame rows: Bromic ahead. Plain rows: level, or Infratech ahead, as marked. Each brand measures coverage its own way; Bromic coverage is approximate and varies with model, height and site.</p>`);

const page3 = page(3, `
  <p class="eyebrow">Bromic vs Infratech · in use</p>
  <h2>Where It Matters To Your Customer</h2>
  <div class="sets">${settings}</div>`);

const page4 = page(4, `
  <figure class="band"><div class="bi" style="${ph('l-beach', 'center 8%')}"></div><figcaption>Tungsten Electric on a beach-house porch. Bromic Outdoor Lookbook 2026.</figcaption></figure>
  <p class="eyebrow">Bromic vs Infratech · on the floor</p>
  <h2>How To Sell It</h2>
  <p class="lede">When a customer names Infratech, start with the space, then the heater.</p>
  ${sell}
  <div class="p4-row">
    <div class="box"><p class="bh">Keep it fair</p><ul class="rules">${FAIR.map((f) => `<li>${f}</li>`).join('')}</ul></div>
    <div class="box"><p class="bh">Confirm before quoting</p><ul class="rules q">${OPEN.map((f) => `<li>${f}</li>`).join('')}</ul><p class="who">Open with the Product team.</p></div>
  </div>
  <div class="cta-row">
    <p class="disc"><b>Before you quote</b>Facts as each brand published them, November 2026; check current specifications before quoting. Installation by a licensed electrician to local code. <span class="rvm">${REVIEW}.</span></p>
    <a class="btn" href="https://www.bromic.com/design-your-space/">Request your design plan <span>→</span><em>bromic.com/design-your-space</em></a>
  </div>`);

// ---------- styles ----------
const css = `
@font-face{font-family:BzDidot;src:url('${rel('app/src/fonts/gfs-didot-latin.woff2')}') format('woff2')}
@font-face{font-family:BzSans;src:url('${rel('app/src/fonts/arimo-latin.woff2')}') format('woff2')}
@page{size:Letter;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:'Helvetica Neue',BzSans,Arial,sans-serif;font-weight:300;color:${T.ink};-webkit-print-color-adjust:exact;print-color-adjust:exact}
b{font-weight:700}
.page{width:8.5in;height:11in;position:relative;overflow:hidden;margin:0 auto;background:#fff;break-after:page}
.page:last-child{break-after:auto}
.top{position:absolute;left:.6in;right:.6in;top:.42in;display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:.8px solid ${T.ink}}
.logo{height:15px;display:block}
.tl,.eyebrow,.co-lbl,.bh,.wm,.mx th,.foot,.kit dt{font:700 7.2px/1.2 BzSans,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase}
.tl{color:${T.steel}}
.eyebrow{color:${T.flame};margin-bottom:6px}
h1,h2,h3{font-family:BzDidot,Didot,serif;font-weight:400;letter-spacing:-.005em;color:${T.ink}}
h1{font-size:46px;line-height:1.02;margin-bottom:9px}
h2{font-size:34px;line-height:1.05;margin-bottom:12px}
.lede{font-size:10.5px;line-height:1.5;color:#3f3b3c;max-width:5.6in}
.flow{position:absolute;left:.6in;right:.6in;top:.82in;bottom:.72in;display:flex;flex-direction:column}
.flow>*{flex:none}
.foot{position:absolute;left:.6in;right:.6in;bottom:.4in;display:flex;gap:14px;align-items:baseline;border-top:.6px solid ${T.hair};padding-top:6px;color:${T.mute};font-weight:400;letter-spacing:.04em;text-transform:none;font-size:6.6px}
.foot span:first-child{flex:1}
.foot .rv{color:${T.flame};letter-spacing:.06em}
.foot .pg{font:400 11px/1 BzDidot,serif;color:${T.ink};letter-spacing:0}
.foot .pg i{font-style:normal;color:${T.mute};font-size:8px}
.tc{color:${T.flame};font-style:italic;font-weight:400}
/* page 1 */
.p1-head{margin-top:16px}
.hero{margin:16px 0 18px}
.hi{height:2.45in;background-size:cover;background-color:${T.wash}}
figcaption{font-size:6.8px;line-height:1.4;color:${T.mute};margin-top:4px;letter-spacing:.02em}
.co-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;border-top:1.6px solid ${T.ink}}
.co{padding:15px 12px 15px 0;border-bottom:.6px solid ${T.hair};display:flex;flex-direction:column}
.co:not(:nth-child(3n+1)){padding-left:12px;border-left:.6px solid ${T.hair}}
.co-top{display:flex;align-items:center;gap:7px;margin-bottom:8px}
.co-ic{width:24px;height:24px;border-radius:50%;background:${T.tint};color:${T.flame};display:grid;place-items:center;flex:none}
.co-ic .ic{width:14px;height:14px}
.co-lbl{color:${T.ink};font-size:6.8px;line-height:1.25}
.co-big{font:400 42px/1 BzDidot,Didot,serif;color:${T.ink};letter-spacing:-.01em}
.co-big em{font-style:normal;color:${T.flame}}
.co-unit{font-size:7.4px;color:${T.flame};font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin:4px 0 7px}
.co-b{font-size:9px;line-height:1.42;color:${T.ink};font-weight:400;margin-bottom:7px}
.co-i{font-size:8.4px;line-height:1.42;color:${T.mute};border-top:.6px dotted ${T.hair};padding-top:6px;margin-top:auto}
.co-i b{display:block;font-size:6.4px;letter-spacing:.16em;text-transform:uppercase;color:${T.mute};margin-bottom:2px}
.key{font-size:7px;line-height:1.5;color:${T.mute};margin-top:9px}
.key .kb{color:${T.ink};font-weight:700}.key .ki{color:${T.mute};font-weight:700}
/* page 2 */
.p2-band{display:grid;grid-template-columns:1fr 2.05in;gap:16px;align-items:end;margin-bottom:12px}
.renders{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.ri{height:1.6in;background-size:cover;background-color:${T.wash}}
.tally{padding-bottom:16px}
.tl-bar{display:flex;height:10px;gap:2px;margin-bottom:7px}
.tb.b{background:${T.flame}}.tb.p{background:${T.hair}}.tb.i{background:${T.steel}}
.tl-key{display:flex;flex-direction:column;gap:3px;font-size:8px;color:#3f3b3c}
.tl-key b{font:400 14px/1 BzDidot,serif;color:${T.ink};margin:0 3px 0 1px}
.tl-key .tl-n{font-size:6.8px;color:${T.mute};letter-spacing:.06em;text-transform:uppercase}
.mk{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px;vertical-align:0}
.mk.b{background:${T.flame}}.mk.p{background:#fff;border:1px solid ${T.steel}}.mk.i{background:${T.steel}}
.mx{width:100%;border-collapse:collapse;table-layout:fixed;font-size:8.6px;line-height:1.3}
.mx thead th{color:${T.mute};text-align:left;padding:0 6px 5px 0;border-bottom:1.6px solid ${T.ink};font-size:6.6px}
.mx thead th.hb{color:${T.flame}}
.mx td{padding:6.8px 6px 6.8px 0;border-bottom:.5px solid ${T.hair};vertical-align:middle}
.mx th.grp{font:400 11.5px/1.15 BzDidot,serif;color:${T.ink};text-transform:none;letter-spacing:0;text-align:left;vertical-align:top;padding:5px 6px 0 0;border-bottom:.8px solid ${T.ink}}
.mx tbody tr:last-child td{border-bottom:.8px solid ${T.ink}}
.mx td.ft{color:#3f3b3c;font-weight:400}
.mx td.cb{color:${T.ink};font-weight:400}
.mx td.ci{color:${T.mute}}
.mx tr.e-b td{background:${T.tint}}
.mx tr.e-b td.ft{box-shadow:inset 2px 0 0 ${T.flame};padding-left:6px}
.mx tr:not(.e-b) td.ft{padding-left:6px}
.mx td.ed{font-size:7px;color:${T.steel};white-space:nowrap}
.mx tr.e-b td.ed{color:${T.flame};font-weight:700}
.ok,.no{display:inline-flex;align-items:center;gap:4px}
.tk{width:10px;height:10px;flex:none;stroke-width:2.6}
.ok .tk{color:${T.flame}}
.ci .ok .tk{color:${T.steel}}
.no .tk{color:${T.mute}}
.v{font:400 13px/1 BzDidot,serif}
.ci .v{color:${T.mute}}
.bar{display:flex;align-items:center;gap:5px;margin:1px 0}
.bt{display:inline-block;height:7px;background:${T.flame}}
.ci .bt{background:${T.steel}}
.bx{display:inline-block;height:7px;margin-left:-5px;background:#fff;border:1px solid ${T.steel};margin-left:0}
.bl{font-size:7.6px}
.bn{display:block;font-size:7px;color:${T.mute}}
/* page 3 */
.sets{display:flex;flex-direction:column;gap:18px;margin-top:2px}
.set{display:grid;grid-template-columns:3.05in 1fr;gap:18px;padding-top:14px;border-top:1.6px solid ${T.ink}}
.si{height:2.4in;background-size:cover;background-color:${T.wash}}
.st h3{font-size:22px;line-height:1.1;margin-bottom:8px}
.kit{display:grid;grid-template-columns:52px 1fr;gap:4px 8px;font-size:8.2px;line-height:1.4;margin-bottom:9px;padding-bottom:8px;border-bottom:.6px solid ${T.hair}}
.kit dt{color:${T.flame};padding-top:1.5px;font-size:6.4px}
.kit dd{color:#3f3b3c;font-weight:400}
.wm{color:${T.mute};margin-bottom:5px;font-size:6.4px}
.pts{list-style:none;display:flex;flex-direction:column;gap:5px}
.pts li{display:grid;grid-template-columns:16px 1fr;gap:6px;font-size:9.2px;line-height:1.42;color:${T.ink};font-weight:400}
.pi{width:13px;height:13px;color:${T.flame};margin-top:1px}
/* page 4 */
.band{margin-bottom:14px}
.bi{height:3.1in;background-size:cover;background-color:${T.wash}}
.sell{list-style:none;display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;margin:14px 0 14px;border-top:1.6px solid ${T.ink}}
.sell li{padding:11px 12px 12px 0;display:flex;flex-direction:column;gap:6px}
.sell li+li{padding-left:12px;border-left:.6px solid ${T.hair}}
.sn{font:400 34px/1 BzDidot,serif;color:${T.flame}}
.sell h3{font-size:18px;line-height:1.15;margin-bottom:5px}
.sell p{font-size:9.2px;line-height:1.5;color:#3f3b3c;font-weight:400}
.p4-row{margin-bottom:16px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
.box{border:.6px solid ${T.hair};border-top:1.6px solid ${T.flame};padding:9px 11px 10px}
.bh{color:${T.ink};margin-bottom:6px}
.rules{list-style:none}
.rules li{font-size:8.6px;line-height:1.42;color:#3f3b3c;padding-left:10px;position:relative;margin-bottom:3px;font-weight:400}
.rules li:before{content:'';position:absolute;left:0;top:5px;width:5px;height:.9px;background:${T.flame}}
.rules.q li:before{content:'?';background:none;width:auto;height:auto;top:0;font-size:8px;font-weight:700;color:${T.flame}}
.who{font-size:7px;color:${T.mute};margin-top:3px}
.cta-row{display:flex;gap:.26in;align-items:center;margin-top:auto}
.disc{flex:1;font-size:7.8px;line-height:1.5;color:#3f3b3c;border-left:1.2px solid ${T.flame};padding-left:9px;font-weight:400}
.disc b{font-size:6.6px;letter-spacing:.16em;text-transform:uppercase;color:${T.flame};margin-right:6px}
.disc .rvm{display:block;margin-top:2px;font-size:6.6px;letter-spacing:.08em;text-transform:uppercase;color:${T.ink};font-weight:700}
.btn{flex:none;display:inline-flex;flex-wrap:wrap;gap:4px 10px;align-items:center;background:${T.ink};color:#fff;font:700 8px/1 BzSans,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:10px 14px;text-decoration:none;max-width:2.5in}
.btn span{color:${T.flame}}
.btn em{flex-basis:100%;font-style:normal;font-size:6.4px;letter-spacing:.12em;color:#C9CDD2;text-transform:lowercase}
`;

const html = `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bromic vs Infratech</title><style>${css}</style></head><body>${page1}${page2}${page3}${page4}</body></html>`;

// ---------- render and print check ----------
(async () => {
  prepImages();
  fs.mkdirSync(path.join(HERE, 'pages'), { recursive: true });
  for (const f of fs.readdirSync(path.join(HERE, 'pages'))) if (/^p\d+\.png$/.test(f)) fs.unlinkSync(path.join(HERE, 'pages', f));
  fs.writeFileSync(path.join(HERE, 'index.html'), html);
  fs.writeFileSync(path.join(HERE, 'sources.json'), JSON.stringify({
    _readme: 'Internal: the source of every fact on Bromic-Vs-Infratech.pdf, page by page, for the Specification and compliance review. Not printed and not published. Built by build.js.',
    needs_approval: 'Specification and compliance', built: new Date().toISOString().slice(0, 10), facts: LEDGER,
  }, null, 1) + '\n');
  const report = [];
  const words = html.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ');
  if (/\$/.test(words)) report.push('a "$" appears');
  if (/\[\[/.test(words) || /VERIFY/.test(words)) report.push('a raw [[VERIFY appears');
  if (/coming soon/i.test(words)) report.push('"coming soon" appears');
  if (/optional/i.test(words)) report.push('"optional" appears');
  if (/—/.test(words)) report.push('long dash in copy');
  if (/!/.test(words)) report.push('exclamation mark');
  if (/shallowest|lowest clearance/i.test(words)) report.push('a claim the claim check bars');
  if (/\bthe only\b/i.test(words)) report.push('an "only" claim');
  if (/<sup|\bSOURCES\b|infratech\.com|cdn\.shopify|pim\.bromic/i.test(html.replace(/<style>[\s\S]*?<\/style>/, ''))) report.push('a printed source or footnote marker');
  if (!/sold separately/i.test(words)) report.push('the Wi-Fi/app line is missing');
  if ((words.match(/Affinity Smart-Heat® Dimmer/g) || []).length < SETTINGS.length) report.push('a setting without its controls');
  if (!words.includes('After 4 hours of continuous use, a 15 minute cool down period is recommended')) report.push('flush-frame quote not exact');
  if (!/Classic follows in January 2027/.test(words)) report.push('Series II launch line missing');
  if ((words.match(new RegExp(REVIEW, 'g')) || []).length < PAGES) report.push('review mark not on every page');
  if (/(src=["']?|url\()[^"')]*infratech/i.test(html)) report.push('an Infratech image is referenced');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(HERE, 'index.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const qa = await page.evaluate(() => {
    const out = [];
    const hit = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    document.querySelectorAll('.page').forEach((pgEl, n) => {
      const pg = pgEl.getBoundingClientRect();
      const frame = { left: pg.left + 40, right: pg.right - 40, top: pg.top + 30, bottom: pg.bottom - 30 };
      const footTop = pgEl.querySelector('.foot').getBoundingClientRect().top;
      pgEl.querySelectorAll('p, h1, h2, h3, li, td, th, dt, dd, figcaption, .btn, .co-big, .tl-key span').forEach((el) => {
        const r = el.getBoundingClientRect(); if (!r.width) return;
        const t = el.textContent.trim().slice(0, 40);
        if (r.left < frame.left - 1 || r.right > frame.right + 1 || r.top < frame.top - 1 || r.bottom > frame.bottom + 1) out.push(`p${n + 1} off the page margin: "${t}"`);
        if (!el.closest('.foot') && r.bottom > footTop - 2) out.push(`p${n + 1} runs into the footer: "${t}"`);
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') out.push(`p${n + 1} clipped: "${t}"`);
      });
      const fl = pgEl.querySelector('.flow');
      if (fl.scrollHeight > fl.clientHeight + 1) out.push(`p${n + 1} content is ${fl.scrollHeight - fl.clientHeight}px taller than the page`);
      const kids = [...fl.children].map((e) => ({ e, r: e.getBoundingClientRect() }));
      for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) if (hit(kids[i].r, kids[j].r) > 4) out.push(`p${n + 1} blocks overlap: ${kids[i].e.className || kids[i].e.tagName} / ${kids[j].e.className || kids[j].e.tagName}`);
      // text inside a cell, card or setting never overlaps its neighbour
      const groups = [...pgEl.querySelectorAll('.co, .set, .sell li, .renders figure, .box')];
      for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) {
        if (groups[i].contains(groups[j]) || groups[j].contains(groups[i])) continue;
        if (hit(groups[i].getBoundingClientRect(), groups[j].getBoundingClientRect()) > 4) out.push(`p${n + 1} overlap: ${groups[i].className} / ${groups[j].className}`);
      }
      pgEl.querySelectorAll('.co, .set .st, .sell li').forEach((c) => { if (c.scrollHeight > c.clientHeight + 1) out.push(`p${n + 1} text overflows its block: "${c.textContent.trim().slice(0, 30)}"`); });
      pgEl.querySelectorAll('td').forEach((td) => { if (td.scrollWidth > td.clientWidth + 1) out.push(`p${n + 1} cell too narrow: "${td.textContent.trim().slice(0, 30)}"`); });
    });
    const bg = [...document.querySelectorAll('[style*="background-image"]')].map((d) => getComputedStyle(d).backgroundImage.slice(5, -2));
    document.querySelectorAll('img').forEach((im) => { if (!im.naturalWidth) out.push('missing image ' + im.src); });
    return { out, bg, pages: document.querySelectorAll('.page').length };
  });
  for (const u of qa.bg) {
    const ok = await page.evaluate((u) => new Promise((res) => { const i = new Image(); i.onload = () => res(i.naturalWidth); i.onerror = () => res(0); i.src = u; }), u);
    if (!ok) qa.out.push('missing photo ' + u);
  }
  report.push(...qa.out);
  if (qa.pages !== PAGES) report.push(`${qa.pages} pages`);
  const secs = await page.$$('.page');
  for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: path.join(HERE, 'pages', `p${i + 1}.png`) });
  const pdf = path.join(HERE, 'Bromic-vs-Infratech.pdf');
  await page.pdf({ path: pdf, format: 'Letter', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  const size = fs.statSync(pdf).size;
  if (size > 4 * 1024 * 1024) report.push(`PDF is ${(size / 1048576).toFixed(2)} MB`);
  const pdfPages = (fs.readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pdfPages !== PAGES) report.push(`PDF has ${pdfPages} pages`);

  // the Hub's thumbnail (data/retail/kit.json → reports/retail/_hub/vs-infratech.webp), 640 wide like the rest of the kit
  const th = spawnSync('python3', ['-c', `
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB')
w = 640; im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
im.save(sys.argv[2], 'WEBP', quality=82, method=6)
`, path.join(HERE, 'pages/p1.png'), path.join(HERE, '../_hub/vs-infratech.webp')], { stdio: 'inherit' });
  if (th.status) report.push('thumbnail failed');

  fs.writeFileSync(path.join(HERE, 'meta.json'), JSON.stringify({
    title: 'Bromic vs Infratech',
    kicker: 'Retail kit · competitive sheet',
    desc: 'Four US Letter pages for floor staff and buyers: the six places Tungsten Series II pulls ahead of Infratech, a point-by-point comparison with product photos, three settings with their heaters and controls, and how to sell it. Specification and compliance review required before external use.',
    pages: PAGES,
    pdf: repoRel('Bromic-vs-Infratech.pdf'),
    cover: repoRel('pages/p1.png'),
    sources: repoRel('sources.json'),
  }, null, 1) + '\n');
  const txt = `Print check, ${new Date().toISOString().slice(0, 10)}\n` + (report.length ? report.join('\n')
    : `clean: ${PAGES} Letter pages, no text off the margins or into the footer, no overlapping blocks, cards or cells, no overflowing text, all images load (approved or library only, no Infratech imagery), no printed sources or footnote markers (${LEDGER.length} facts traced in sources.json), no "$", no raw VERIFY, no "coming soon", no "only" claim, exact flush-frame quote, controls with every setting, review mark on every page, PDF ${(size / 1024).toFixed(0)} KB`) + '\n';
  fs.writeFileSync(path.join(HERE, 'print-check.txt'), txt);
  console.log(txt);
})().catch((e) => { console.error(e); process.exit(1); });
