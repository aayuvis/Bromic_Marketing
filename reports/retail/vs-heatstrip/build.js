// Bromic Platinum And Tungsten vs Heatstrip (Australia): a four-page US Letter comparison for retail floor staff and buyers,
// A4-friendly (every block inside the A4/Letter overlap), metric, Australian spelling. Mirrors reports/retail/vs-infratech.
// Owner, 23 Nov 2026: "create a bromic platinum and bromic tungsten v/s heatstrip too.....use the attached data for heatstrip
// comparison". Page 1 the differences up front, page 2 Platinum vs Heatstrip (the measured warm zone drawn to scale, then the
// side-by-side), page 3 Tungsten Series II vs Heatstrip (published specifications ONLY: no test exists, no performance claim),
// page 4 how to sell it and one CTA.
//
// Data: data/retail/vs-heatstrip.json (the owner's campaign page TESTS and SPEC tables, its claim register and gates, with
// every [verify] kept as [[VERIFY]]); Tungsten Series II from data/product-marketing/tungsten-electric-series-ii.json and
// data/product-facts.json. Sources are NOT printed: each fact carries `src` ids, checked here and written to sources.json.
// Gates (handover): comparative figures go public only after Infrascan Rev 2 and AU counsel; "safely" only once the LC kit's
// AU electrical approval is on file and the 180 mm AU figure is confirmed. Both are printed on every page as an internal
// status line; the sheet is marked DRAFT. Images: Bromic only (approved in data/image-review.json, or Bromic photographs in
// the library). Never a Heatstrip image, logo or trade dress: Heatstrip is named in text only. No prices, no people's names.
// Run: node reports/retail/vs-heatstrip/build.js
//   → index.html, pages/p1–p4.png, Bromic-vs-Heatstrip.pdf, meta.json, sources.json, print-check.txt, ../_hub/vs-heatstrip.webp
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '../../..');
const rel = (p) => path.relative(HERE, path.join(ROOT, p)).split(path.sep).join('/');
const repoRel = (p) => path.relative(ROOT, path.join(HERE, p)).split(path.sep).join('/');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const D = read('data/retail/vs-heatstrip.json');
const S2 = read('data/product-marketing/tungsten-electric-series-ii.json');
const PE = read('data/product-marketing/platinum-electric.json');
const PF = Object.fromEntries(read('data/product-facts.json').products.map((p) => [p.id, p]));
const PAGES = 4;

const T = { ink: '#231F20', steel: '#6B7480', mute: '#8E949B', hair: '#D9DDE2', wash: '#F5F5F3', flame: '#EF4123', tint: '#FDEDE8' };
const R = '®';
const TC = '<i class="tc">to confirm</i>';
const REVIEW = 'Specification and compliance review required before external use';
const GATE = 'Draft, internal. Test figures held until Infrascan Rev 2 and Australian counsel clear them; low-clearance recess lines held until each kit\'s Australian electrical approval is on file and the 180 mm figure is confirmed.';

// ---------- guard the data the sheet depends on ----------
if (D.needs_approval !== 'Specification and compliance') throw new Error('needs_approval must be Specification and compliance');
for (const g of ['comparative', 'lc-recess']) if (!D.gates.find((x) => x.id === g)) throw new Error('gate missing: ' + g);
if (!/October 2026/.test(PF['tungsten-select'].launched) || !/3 years heater, 7 years elements/.test(PF['tungsten-select'].facts.warranty)) throw new Error('Series II launch or warranty changed in product-facts');

// ---------- sources: kept in the build, never printed ----------
const byId = {};
for (const s of [...D.sources, ...S2.sources, ...PE.sources]) if (!byId[s.id]) byId[s.id] = s;
byId.pf = { id: 'pf', publisher: 'Bromic Heating', title: 'data/product-facts.json: Tungsten Select and Coastal launched October 2026; warranty "3 years heater, 7 years elements" (owner, 22 Nov 2026)', year: 2026, url: 'internal' };
const LEDGER = [];
const cite = (page, fact, ids) => {
  for (const id of ids) if (!byId[id]) throw new Error(`unknown source ${id} for "${fact}"`);
  LEDGER.push({ page, fact: fact.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(), src: ids.map((id) => { const s = byId[id]; return { id, publisher: s.publisher, title: s.title, year: s.year, url: s.url }; }) });
};

// ---------- the test numbers, computed from the quarter-ellipse radii (pi * a * b) ----------
const area = ([a, b]) => Math.PI * a * b;
const C34 = D.test.classes['34'], C23 = D.test.classes['23'];
const A = (c) => c.units.map((u) => u.d.map(area));
const a34 = A(C34), a23 = A(C23);
const f2 = (x) => x.toFixed(2);
const expect = (got, want, what) => { if (f2(got) !== want) throw new Error(`${what}: computed ${f2(got)}, expected ${want}`); };
// the campaign SPEC figures, re-derived: a wrong radius in the data fails the build
expect(a34[0][0], '18.85', '3400 +2'); expect(a34[1][0], '14.17', 'Enhance 3200 +2'); expect(a34[2][0], '14.18', 'Classic 3200 +2');
expect(a34[0][2], '5.24', '3400 +6'); expect(a34[1][2], '3.11', 'Enhance 3200 +6'); expect(a34[2][2], '2.84', 'Classic 3200 +6');
expect(a34[0][1], '8.55', '3400 +4'); expect(a34[1][1], '8.55', 'Enhance 3200 +4'); expect(a34[2][1], '7.07', 'Classic 3200 +4');
expect(a23[0][0], '14.51', '2300 +2'); expect(a23[2][0], '11.59', 'Enhance 2400 +2'); expect(a23[1][0], '13.82', 'Classic 2400 +2');
const pctMore = Math.round((a34[0][0] / Math.max(a34[1][0], a34[2][0]) - 1) * 100);      // vs the better of the two: 33
const pctMoreLow = Math.round((a34[0][0] / Math.min(a34[1][0], a34[2][0]) - 1) * 100);   // 33 as well
const xWarm = Math.floor((a34[0][2] / a34[2][2]) * 10) / 10;                              // 1.8 (vs Classic), "up to"
const pct23 = Math.round((a23[0][0] / a23[2][0] - 1) * 100);                               // 25 (vs Enhance 2400)
if (pctMore !== 33 || pctMoreLow !== 33 || xWarm !== 1.8 || pct23 !== 25) throw new Error(`headline numbers moved: ${pctMore} ${pctMoreLow} ${xWarm} ${pct23}`);
const TESTLINE = `Measured by Infrascan Thermal Imaging, Ingleburn NSW, 28 Jul to 12 Aug 2026, commissioned by Bromic using Bromic's test method: one unit of each model, as purchased, 2.0 m above a 4 × 4 m target; areas at 2, 4 and 6 °C above ambient after 35 minutes.`;

// ---------- icons: Lucide line icons (ISC licence) ----------
const ICON = {
  expand: '<path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/><path d="M3 16.2V21m0 0h4.8M3 21l6-6"/><path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"/><path d="M3 7.8V3m0 0h4.8M3 3l6 6"/>',
  thermo: '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
  timer: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  fan: '<path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/><path d="M12 12v.01"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  minus: '<path d="M5 12h14"/>',
  badge: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m16 9-5.5 5.5L8 12"/>',
  palette: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',
  house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  waves: '<path d="M2 12q2.5 2 5 0t5 0 5 0 5 0"/><path d="M2 19q2.5 2 5 0t5 0 5 0 5 0"/><path d="M2 5q2.5 2 5 0t5 0 5 0 5 0"/>',
  sliders: '<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
};
const icon = (k, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

// ---------- images: Bromic only ----------
const REVIEW_IMG = {   // approved in data/image-review.json
  't-recess': 'pr-bg-black-recess-kit-plaster-ceiling',
  't-family': 'pr-select-family-three-finishes',
  't-porch': 'ts2-r9c-07',
  't-room': 'ts2-ai-14',
};
const LIB_IMG = {      // Bromic photographs in images/library (site-source, Bromic-published)
  'p-hero': 'images/library/w-australia-sydney-greenwich-residence-1-cropp.webp',
  'p-recess': 'images/library/w-lc-recess-kit-platinum-electric-1-1-1600x113.webp',
  'p-face': 'images/library/w-black-platinum-electric-close-up.webp',
  'p-alfresco': 'images/library/w-platinum-electric-white-recessed-residential-3.webp',
};
function prepImages() {
  fs.mkdirSync(path.join(HERE, 'img'), { recursive: true });
  for (const f of fs.readdirSync(path.join(HERE, 'img'))) if (/\.jpg$/.test(f)) fs.unlinkSync(path.join(HERE, 'img', f));
  const rv = Object.fromEntries(read('data/image-review.json').items.map((r) => [r.id, r]));
  const man = Object.fromEntries(read('images/library/manifest.json').map((m) => [m.file, m]));
  const jobs = [];
  for (const [k, id] of Object.entries(REVIEW_IMG)) {
    const r = rv[id]; if (!r) throw new Error('not in image-review.json: ' + id);
    if (r.status !== 'approved') throw new Error(`image not approved: ${id} (${r.status})`);
    jobs.push([path.join(ROOT, r.file), path.join(HERE, 'img', `${k}.jpg`)]);
  }
  for (const [k, src] of Object.entries(LIB_IMG)) {
    const m = man[src]; if (!m) throw new Error('not in the library: ' + src);
    if (/rejected/i.test(m.status)) throw new Error('rejected image: ' + src);
    if (!/^Platinum Electric/.test(m.product || '')) throw new Error('not a Platinum Electric image: ' + src);
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

// ---------- page 1: the differences up front ----------
const n2 = (x) => x.toFixed(2);
const CALLOUTS = [
  { icon: 'expand', label: `${pctMore}% more warm zone`, big: n2(a34[0][0]), unit: 'm²', them: `${n2(a34[1][0])} · ${n2(a34[2][0])} m²`,
    b: 'Platinum 3400W: the area 2 °C or more above ambient after 35 minutes.', h: 'Heatstrip Enhance and Classic 3200W, same test.', src: ['ht', 'cp'] },
  { icon: 'thermo', label: `Up to ${xWarm}× the properly warm zone`, big: n2(a34[0][2]), unit: 'm²', them: `${n2(a34[1][2])} · ${n2(a34[2][2])} m²`,
    b: 'Platinum 3400W: the area 6 °C or more above ambient, where the heat is felt most.', h: 'Heatstrip Enhance and Classic 3200W.', src: ['ht', 'cp'] },
  { icon: 'timer', label: 'Faster in the first 5 minutes', big: C34.rise5[0].toFixed(2), unit: '°C', them: `${C34.rise5[1].toFixed(2)} · ${C34.rise5[2].toFixed(2)} °C`,
    b: 'Platinum 3400W: the target\'s temperature rise five minutes after switching on.', h: `Heatstrip Enhance and Classic 3200W (Classic figure ${TC}).`, src: ['ht', 'cp'] },
  { icon: 'zap', label: 'Fewer watts, more warm zone', big: n2(a23[0][0]), unit: 'm²', them: `${n2(a23[2][0])} m²`,
    b: `Platinum 2300W: ${pct23}% more warm zone at +2 °C with 100 fewer watts.`, h: 'Heatstrip Enhance 2400W, same test.', src: ['ht', 'cp'] },
  { icon: 'fan', label: 'Worry-free recessing, up to 6 kW', big: '6', unit: 'kW recessed', them: 'Passive vents',
    b: `Tungsten Series II recesses up to 6 kW in a dual fan-ventilated kit, recess box supplied. Platinum recesses up to 4500W in a fan-cooled low-clearance kit, cavity from 180 mm (${TC}).`,
    h: 'Heatstrip publishes passive-vented flush enclosures only.', src: ['b2', 'd1', 'cp', 'p7', 'hs'] },
  { icon: 'shield', label: '304 stainless, glass-ceramic face', big: '304', unit: 'stainless', them: 'Coated alloy',
    b: 'A 304 stainless steel chassis with a Schott tinted glass-ceramic face, and a 316 stainless Marine model for the coast.',
    h: 'Coated alloy bodies; no coastal or marine version listed.', src: ['cp', 'p1', 'p2', 'hs'] },
];
for (const c of CALLOUTS) cite(1, `${c.label}: ${c.big} ${c.unit} vs ${c.them}. Bromic: ${c.b} Heatstrip: ${c.h}`, c.src);
cite(1, TESTLINE, ['ht']);
const callouts = `<div class="co-grid">${CALLOUTS.map((c) => `<article class="co">
  <div class="co-top"><span class="co-ic">${icon(c.icon)}</span><span class="co-lbl">${c.label}</span></div>
  <div class="co-nums"><p class="co-big">${c.big}<small>${c.unit}</small></p><p class="co-them"><b>Heatstrip</b>${c.them}</p></div>
  <p class="co-b">${c.b}</p>
  <p class="co-i">${c.h}</p>
</article>`).join('')}</div>`;

// ---------- page 2: the bloom, to scale, and Platinum vs Heatstrip ----------
const BAND = { b: ['#FAD3C9', '#F48B72', T.flame], h: ['#E6E8EB', '#BCC2C9', '#79818B'] };
function bloom(u) {
  const S = 2.5, P = 112, k = P / S, pad = 4;
  let g = '';
  for (let m = 0; m <= S + 1e-9; m += 0.5) { const p = (pad + m * k).toFixed(1); g += `<line x1="${p}" y1="${pad}" x2="${p}" y2="${pad + P}"/><line x1="${pad}" y1="${p}" x2="${pad + P}" y2="${p}"/>`; }
  const cols = BAND[u.bromic ? 'b' : 'h'];
  const e = u.d.map(([a, b], i) => `<path d="M${pad} ${pad} L${(pad + a * k).toFixed(1)} ${pad} A${(a * k).toFixed(1)} ${(b * k).toFixed(1)} 0 0 1 ${pad} ${(pad + b * k).toFixed(1)} Z" fill="${cols[i]}"/>`).join('');
  return `<svg class="bl-svg" viewBox="0 0 ${P + pad * 2} ${P + pad * 2}" role="img" aria-label="Quarter warm zone of ${u.n}, to scale"><g stroke="${T.hair}" stroke-width=".6">${g}</g>${e}<rect x="${pad - 1}" y="${pad - 1}" width="9" height="3.5" fill="${T.ink}"/></svg>`;
}
const bloomRow = (c, ar) => `<div class="bl-row"><p class="bl-h">${c.title}</p><div class="bl-set">${c.units.map((u, i) => `<figure class="bl${u.bromic ? ' us' : ''}">
  <figcaption class="bl-n">${u.short}</figcaption>${bloom(u)}
  <dl class="bl-f">${['+2', '+4', '+6'].map((t, j) => `<dt>${t} °C</dt><dd>${n2(ar[i][j])} m²</dd>`).join('')}</dl></figure>`).join('')}</div></div>`;
const blooms = `<div class="blooms">${bloomRow(C34, a34)}${bloomRow(C23, a23)}</div>
  <div class="bl-key"><span><i style="background:${BAND.b[0]}"></i><i style="background:${BAND.h[0]}"></i>+2 °C noticeably warm</span><span><i style="background:${BAND.b[1]}"></i><i style="background:${BAND.h[1]}"></i>+4 °C comfortable</span><span><i style="background:${BAND.b[2]}"></i><i style="background:${BAND.h[2]}"></i>+6 °C properly warm</span><span class="bk">One quarter of each footprint from above, heater at the corner. Grid 0.5 m. Areas are full ellipses, π × a × b.</span></div>`;
cite(2, `Warm zones to scale, ${C34.title} and ${C23.title}: ` + [C34, C23].map((c, ci) => c.units.map((u, i) => `${u.short} ${[ci ? a23 : a34][0][i].map(n2).join(' / ')} m²`).join('; ')).join('; '), ['ht', 'cp']);

const Y = (t) => `<span class="ok">${icon('check', 'tk')}${t}</span>`;
const N = (t) => `<span class="no">${icon('minus', 'tk')}${t}</span>`;
const v = (t) => `<b class="v">${t}</b>`;
const HS = D.heatstrip.models, PL = D.platinum;
const EDGE = { bromic: ['b', 'Bromic'], parity: ['p', 'Level'], heatstrip: ['i', 'Heatstrip'], info: ['n', '–'] };
// rows: [feature, bromic, heatstrip 1, heatstrip 2, edge, src]
const PMATRIX = [
  ['Tested, 35 min', [
    ['Warm zone, +2 °C', v(`${n2(a34[0][0])} m²`), v(`${n2(a34[1][0])} m²`), v(`${n2(a34[2][0])} m²`), 'bromic', ['ht']],
    ['Comfort zone, +4 °C', v(`${n2(a34[0][1])} m²`), v(`${n2(a34[1][1])} m²`), v(`${n2(a34[2][1])} m²`), 'parity', ['ht']],
    ['Properly warm, +6 °C', v(`${n2(a34[0][2])} m²`), v(`${n2(a34[1][2])} m²`), v(`${n2(a34[2][2])} m²`), 'bromic', ['ht']],
    ['Rise at 5 minutes', v(`${C34.rise5[0]} °C`), v(`${C34.rise5[1]} °C`), `${v(`${C34.rise5[2]} °C`)} ${TC}`, 'bromic', ['ht']],
    ['Peak rise', v(`${C34.peak[0]} °C`), v(`${C34.peak[1]} °C`), v(`${C34.peak[2]} °C`), 'bromic', ['ht']],
  ]],
  ['Build', [
    ['Chassis', Y(PL.chassis), HS.enhance3200.chassis, HS.classic3200.chassis, 'bromic', ['cp', 'p1', 'hs']],
    ['Heating face', PL.face, HS.enhance3200.face, HS.classic3200.face, 'info', ['cp', 'hs']],
    ['Size, L × H × D', `${PL.models['3400'].size_mm} mm`, `${HS.enhance3200.size_mm} mm`, `${HS.classic3200.size_mm} mm`, 'info', ['cp', 'hs']],
    ['Weight', `${PL.models['3400'].kg} kg`, `${HS.enhance3200.kg} kg`, `${HS.classic3200.kg} kg`, 'info', ['cp', 'hs']],
    ['Coastal version', Y(PL.marine), N(HS.enhance3200.coastal), N(HS.classic3200.coastal), 'bromic', ['cp', 'p2', 'hs']],
  ]],
  ['Recess', [
    ['Standard recess', Y('Recess kit, face flush'), Y(`Flush mount kit`), Y('Flush enclosure, passive vents'), 'parity', ['cp', 'hs']],
    ['Low-clearance recess', Y(`Worry-free: fan-cooled kit to 4500W, cavity from 180 mm ${TC}`), N('None published'), N('None published; 125 mm enclosure plus 150 mm clear'), 'bromic', ['cp', 'p7', 'hs']],
  ]],
  ['Controls', [
    ['In the box', 'Affinity Smart-Heat' + R + ' On/Off or Dimmer, multi-zone, and a wall switch, sold separately', Y('Remote and app, 3 levels, timer'), 'Controller and remote available separately', 'heatstrip', ['cp', 'b3', 'hs']],
  ]],
  ['Protection', [
    ['Water rating', `${v('IPX4')} ${TC}`, v('IPX5'), v('IP55'), 'heatstrip', ['cp', 'hs']],
    ['Warranty', '3 years', '3 years residential, 2 commercial', `3 years residential, commercial ${TC}`, 'parity', ['cp', 'hs']],
  ]],
];
const tallyOf = (M) => { const t = { bromic: 0, parity: 0, heatstrip: 0 }; for (const [, rows] of M) for (const r of rows) if (r[4] in t) t[r[4]]++; return t; };
const tallyBar = (t) => `<div class="tally">
  <div class="tl-bar"><span class="tb b" style="flex:${t.bromic}"></span><span class="tb p" style="flex:${t.parity}"></span><span class="tb i" style="flex:${t.heatstrip}"></span></div>
  <div class="tl-key"><span><span class="mk b"></span><b>${t.bromic}</b> Bromic ahead</span><span><span class="mk p"></span><b>${t.parity}</b> level</span><span><span class="mk i"></span><b>${t.heatstrip}</b> Heatstrip ahead</span><span class="tl-n">of ${t.bromic + t.parity + t.heatstrip} points</span></div>
</div>`;
const matrix = (M, heads, cols) => `<table class="mx">${cols}
  <thead><tr><th></th><th>Feature</th>${heads.map((h, i) => `<th class="${i ? '' : 'hb'}">${h}</th>`).join('')}<th>Ahead</th></tr></thead>
  ${M.map(([g, rows]) => `<tbody>${rows.map((r, k) => `<tr class="e-${EDGE[r[4]][0]}">${k === 0 ? `<th class="grp" rowspan="${rows.length}">${g}</th>` : ''}<td class="ft">${r[0]}</td><td class="cb">${r[1]}</td>${r[3] === null ? `<td class="ci" colspan="2">${r[2]}</td>` : `<td class="ci">${r[2]}</td><td class="ci">${r[3]}</td>`}<td class="ed">${r[4] === 'info' ? '<span class="na">–</span>' : `<span class="mk ${EDGE[r[4]][0]}"></span>${EDGE[r[4]][1]}`}</td></tr>`).join('')}</tbody>`).join('')}
</table>`;
for (const [g, rows] of PMATRIX) for (const [f, b, h1, h2, e, src] of rows) cite(2, `${g} · ${f} · Platinum 3400W: ${b} · Heatstrip Enhance 3200W: ${h1} · Heatstrip Classic 3200W: ${h2} · edge ${e}`, src);
const COLS4 = '<colgroup><col style="width:62px"><col style="width:100px"><col><col style="width:118px"><col style="width:118px"><col style="width:58px"></colgroup>';
const pTable = matrix(PMATRIX, ['Platinum 3400W', 'Heatstrip Enhance 3200W', 'Heatstrip Classic 3200W'], COLS4);

// ---------- page 3: Tungsten Series II vs Heatstrip, specifications only ----------
const TU = D.tungsten;
const GLANCE = [
  ['calendar', 'Available', 'Select and Coastal since October 2026; Classic follows in January 2027.', ['pf', 'd1']],
  ['zap', 'Output', '2, 3, 4 and 6 kW on Select; 4 and 6 kW on Coastal. Dual elements on 4 and 6 kW.', ['d1', 'b1']],
  ['palette', 'Finish', 'Black, white or graphite on Select, the front in the same finish; Diamond Pattern front, oval and triangle sold separately.', ['d1', 's1']],
  ['house', 'Mounting', `Ceiling, pitched ceiling 3/12 to 12/12, wall, extended wall, single post or recessed; tilts up to 45° (4 and 6 kW ${TC}).`, ['b1', 'd1']],
  ['fan', 'Recess', `A dual fan-ventilated low-clearance kit with the recess box supplied; 190.5 mm cavity in the US manual (Australia ${TC}).`, ['b2', 'd1']],
  ['waves', 'Coastal', `Corrosion-resistant coating over 316 marine-grade stainless as standard (${TC}); IPX5.`, ['d1', 'b1', 'p11']],
  ['sliders', 'Controls', `Affinity Smart-Heat${R} Dimmer in 1% steps, zones, schedules and timers in the Bromic app.`, ['b3', 'b4']],
  ['badge', 'Warranty', '3 years on the heater, 7 years on the elements.', ['pf', 's4']],
];
byId.p11 = byId.p11 || { id: 'p11', publisher: 'Bromic Heating', title: 'Outdoor Lookbook 2026', year: 2026, url: 'internal' };
for (const [, k, t, src] of GLANCE) cite(3, `Tungsten Series II at a glance · ${k}: ${t}`, src);
const glance = `<div class="gl">${GLANCE.map(([ic, k, t]) => `<div class="gi">${icon(ic, 'gic')}<div><p class="gk">${k}</p><p class="gt">${t}</p></div></div>`).join('')}</div>`;
// rows: [feature, tungsten, heatstrip (both columns as one), null, edge, src]
const TMATRIX = [
  ['Heat', [
    ['Output range', '2 to 6 kW', '2.4 and 3.2 kW (Classic, Enhance); 3.6 kW (Max); 6 kW (MAX DC)', null, 'info', ['d1', 'hs']],
    ['Dimming', Y('1% steps, Affinity Dimmer'), 'Enhance: 3 levels', null, 'bromic', ['b3', 'hs']],
  ]],
  ['Build', [
    ['Body', 'Coastal: 316 marine-grade stainless, coated', 'Coated alloy (Classic, Enhance); anodised alloy (Max)', null, 'info', ['d1', 'p11', 'hs']],
    ['Coastal version', Y('Tungsten Coastal'), N('Not listed'), null, 'bromic', ['d1', 'hs']],
    ['Length', '1144 or 1436 mm', '920 to 1774 mm (Classic, Enhance)', null, 'info', ['d1', 'hs']],
    ['Weight', '5.9 or 6.8 kg', '7 to 10 kg (Classic, Enhance)', null, 'info', ['b1', 'hs']],
  ]],
  ['Recess', [
    ['Standard recess', Y('Recess kit on every collection'), Y('Flush enclosure or flush mount kit'), null, 'parity', ['d1', 'hs']],
    ['Low-clearance recess', Y('Worry-free, up to 6 kW: dual fan-ventilated kit, box supplied'), N('None published'), null, 'bromic', ['b2', 'd1', 'hs']],
  ]],
  ['Controls', [
    ['In the box', `Affinity Smart-Heat${R} controls and a wall switch, sold separately`, Y('Enhance: remote and app included'), null, 'heatstrip', ['b3', 'hs']],
  ]],
  ['Protection', [
    ['Water rating', v('IPX5'), `${v('IPX5')} Enhance · ${v('IP55')} Classic, dust-rated too`, null, 'heatstrip', ['b1', 'hs']],
    ['Warranty', Y('3 years heater, 7 years elements'), '3 years residential; 2 years commercial (Enhance)', null, 'bromic', ['pf', 's4', 'hs']],
  ]],
];
for (const [g, rows] of TMATRIX) for (const [f, b, h, , e, src] of rows) cite(3, `${g} · ${f} · Tungsten Series II: ${b} · Heatstrip: ${h} · edge ${e}`, src);
const COLS3 = '<colgroup><col style="width:62px"><col style="width:100px"><col style="width:178px"><col><col style="width:0"><col style="width:58px"></colgroup>';
const tTable = matrix(TMATRIX, ['Tungsten Series II', 'Heatstrip Classic, Enhance, Max', ''], COLS3);

// ---------- page 4: how to sell it ----------
const RECO = [
  { img: 'p-alfresco', pos: 'center 8%', name: `Platinum Smart-Heat${R} Electric`, when: 'Recommend it when',
    pts: ['The heater should all but disappear: a dark glass-ceramic face, recessed flush or slim on a wall.', 'The customer asks which heater warms more of the table: Platinum is the one measured against Heatstrip.', 'The ceiling cavity is shallow: the low-clearance kit is fan-cooled. By the sea, the 316 Marine model.'],
    ctl: `Affinity Smart-Heat${R} Dimmer or On/Off, and a manual wall switch.`, cap: 'Platinum Electric recessed in an alfresco ceiling. Bromic photograph.', src: ['cp', 'p1', 'p2', 'p7', 'b3'] },
  { img: 't-room', pos: 'center 45%', name: `Tungsten Smart-Heat${R} Electric Series II`, when: 'Recommend it when',
    pts: ['The heater is part of the look: black, white or graphite, front included, with three front patterns.', 'The ceiling is pitched, or the heat needs a single post or a tilt toward the seats.', 'The customer wants the longest cover: 3 years on the heater and 7 on the elements. By the sea, Coastal.'],
    ctl: `Affinity Smart-Heat${R} Dimmer as standard, On/Off where dimming is not wanted, and a manual wall switch.`, cap: 'Tungsten Series II in a coastal outdoor room. Concept render, not a product photograph.', src: ['d1', 'b1', 'pf', 's4', 'b3'] },
];
for (const r of RECO) cite(4, `${r.name}: ${r.pts.join(' ')} Controls: ${r.ctl}`, r.src);
const WIFI = 'Wi-Fi and app features need compatible Affinity controls, sold separately.';
const reco = `<div class="reco">${RECO.map((r) => `<article class="rc">
  <figure><div class="rci" style="${ph(r.img, r.pos)}"></div><figcaption>${r.cap}</figcaption></figure>
  <h3>${r.name}</h3><p class="wm">${r.when}</p>
  <ul class="pts">${r.pts.map((t) => `<li>${icon('check', 'pi')}<span>${t}</span></li>`).join('')}</ul>
  <dl class="kit"><dt>Controls</dt><dd>${r.ctl} ${WIFI}</dd></dl>
</article>`).join('')}</div>`;
const TALK = [
  { q: '“Everyone has a Heatstrip.”', a: `Then compare the warmth. In an independent thermal test, Platinum 3400W warmed ${pctMore}% more area than Heatstrip's Classic and Enhance 3200W, and up to ${xWarm}× the area that gets properly warm.`, src: ['ht', 'cp'] },
  { q: '“I want it in the ceiling, but there isn’t much room.”', a: `Bromic offers worry-free recessing up to 6 kW: Tungsten Series II's low-clearance kit is dual fan-ventilated with the box supplied, and Platinum's has a built-in cooling fan. A licensed electrician installs it to AS/NZS 3000.`, src: ['cp', 'p7', 'b2', 'd1'] },
  { q: '“The Heatstrip comes with a remote.”', a: 'The Enhance does, and it is rated IPX5. Bromic heaters are quoted with Affinity Smart-Heat' + R + ' controls chosen for the space: dimming, zones, schedules and the Bromic app.', src: ['hs', 'b3', 'b4'] },
];
for (const t of TALK) cite(4, `${t.q} ${t.a}`, t.src);
const talk = `<ol class="sell">${TALK.map((t, i) => `<li><span class="sn">${i + 1}</span><div><p class="q">${t.q}</p><p>${t.a}</p></div></li>`).join('')}</ol>`;
const FAIR = [
  'Name Heatstrip in words only: no logo, image or product shot.',
  'Say where Heatstrip leads: the IP rating, and the Enhance\'s included remote and app.',
  'Quote test figures with the test: Infrascan, 35 minutes, 2.0 m above the target.',
  'Tungsten has no test against Heatstrip: compare its specifications, never its warmth.',
  'No prices.',
];
const OPEN = [
  'Infrascan Rev 2 and Australian counsel, before any test figure is used outside Bromic',
  'Low-clearance kits: Australian electrical approval and the 180 mm cavity (US pages say 10 in)',
  'Platinum\'s Australian IP rating; Tungsten Series II\'s Australian models and supply',
];

// ---------- page furniture ----------
const top = () => `<header class="top"><img class="logo" src="img/bromic-logo.png" alt="Bromic Heating"><span class="tl">Retail kit · Australia · Bromic vs Heatstrip</span><span class="draft">Draft</span></header>`;
const foot = (n) => `<footer class="foot"><span class="gate">${GATE}</span><span class="rv">${REVIEW}</span><span class="pg">${String(n).padStart(2, '0')}<i> / ${String(PAGES).padStart(2, '0')}</i></span></footer>`;
const page = (n, body, cls = '') => `<section class="page ${cls}">${top()}<div class="flow">${body}</div>${foot(n)}</section>`;

const page1 = page(1, `
  <p class="eyebrow">Bromic Platinum and Tungsten vs Heatstrip · the differences</p>
  <h1>Wider. Warmer. Worry-Free Recessing.</h1>
  <p class="lede">Platinum Smart-Heat${R} Electric against Heatstrip Classic and Enhance, measured side by side in an independent thermal test; Tungsten Smart-Heat${R} Electric Series II against Heatstrip's published specifications.</p>
  <figure class="hero"><div class="hi" style="${ph('p-hero', 'center 4%')}"></div><figcaption>Platinum Smart-Heat${R} Electric recessed in a Sydney harbourside alfresco ceiling. Bromic photograph.</figcaption></figure>
  ${callouts}
  <p class="key"><span class="kb">Bromic</span> large, <span class="ki">Heatstrip</span> beside it in grey. ${TESTLINE} <i class="tc">To confirm</i>: a figure being checked.</p>`);

const page2 = page(2, `
  <p class="eyebrow">Platinum Smart-Heat${R} Electric vs Heatstrip · measured</p>
  <h2>The Warm Zone, Drawn To Scale</h2>
  ${blooms}
  <div class="p2-band"><figure><div class="ri" style="${ph('p-face', 'center 40%')}"></div><figcaption>Schott tinted glass-ceramic face</figcaption></figure><figure><div class="ri" style="${ph('p-recess', 'center 45%')}"></div><figcaption>Recessed flush, white</figcaption></figure>${tallyBar(tallyOf(PMATRIX))}</div>
  ${pTable}
  <p class="key">Flame rows: Bromic ahead. Plain rows: level, Heatstrip ahead, or a difference with no edge (–), as marked. ${TESTLINE}</p>`);

const page3 = page(3, `
  <p class="eyebrow">Tungsten Smart-Heat${R} Electric Series II vs Heatstrip · specifications</p>
  <h2>The Specification, Side By Side</h2>
  <p class="lede">No test compares Tungsten with Heatstrip, so this page sets published specifications side by side and makes no claim about warmth. Australian models, supply and listings: ${TC}.</p>
  <div class="p3-band"><figure><div class="ri tall" style="${ph('t-recess', 'center 40%')}"></div><figcaption>Select, black, in the low-clearance recess kit. Product render.</figcaption></figure><figure><div class="ri tall" style="${ph('t-family', 'center 45%')}"></div><figcaption>Select in black, graphite and white. Product render.</figcaption></figure><figure><div class="ri tall" style="${ph('t-porch', 'center 40%')}"></div><figcaption>Recessed on a beach-house porch. Product render.</figcaption></figure></div>
  ${glance}
  <div class="p3-row">${tallyBar(tallyOf(TMATRIX))}</div>
  ${tTable}
  <p class="key">Flame rows: Bromic ahead on the specification. Plain rows: level, Heatstrip ahead, or a difference with no edge (–). Heatstrip as published for Australia, October 2026.</p>`);

const page4 = page(4, `
  <p class="eyebrow">Bromic vs Heatstrip · on the floor</p>
  <h2>How To Sell It</h2>
  <p class="lede">Start with the space, then the heater. Every heater goes on the quote with its controls.</p>
  ${reco}
  ${talk}
  <div class="p4-row">
    <div class="box"><p class="bh">Keep it fair</p><ul class="rules">${FAIR.map((f) => `<li>${f}</li>`).join('')}</ul></div>
    <div class="box gatebox"><p class="bh">Status, internal</p><ul class="rules q">${OPEN.map((f) => `<li>${f}</li>`).join('')}</ul><p class="who">Open with the Product team and Specification and compliance.</p></div>
  </div>
  <div class="cta-row">
    <p class="disc"><b>Before you quote</b>Heatstrip as published, October 2026; check current specifications before quoting. Installation by a licensed electrician to AS/NZS 3000. <span class="rvm">${REVIEW}.</span></p>
    <a class="btn" href="https://www.bromic.com.au/">Plan the space with Bromic <span>→</span><em>bromic.com.au</em></a>
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
.top{position:absolute;left:.6in;right:.6in;top:.42in;display:flex;gap:12px;align-items:center;padding-bottom:8px;border-bottom:.8px solid ${T.ink}}
.logo{height:15px;display:block;margin-right:auto}
.tl,.eyebrow,.co-lbl,.bh,.wm,.mx th,.kit dt,.bl-h,.gk,.draft{font:700 7.2px/1.2 BzSans,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase}
.tl{color:${T.steel}}
.draft{color:${T.flame};border:.8px solid ${T.flame};padding:3px 6px 2px}
.eyebrow{color:${T.flame};margin-bottom:6px}
h1,h2,h3{font-family:BzDidot,Didot,serif;font-weight:400;letter-spacing:-.005em;color:${T.ink}}
h1{font-size:44px;line-height:1.04;margin-bottom:9px}
h2{font-size:32px;line-height:1.05;margin-bottom:10px}
.lede{font-size:10.2px;line-height:1.5;color:#3f3b3c;max-width:5.9in}
.flow{position:absolute;left:.6in;right:.6in;top:.86in;bottom:.86in;display:flex;flex-direction:column}
.flow>*{flex:none}
.foot{position:absolute;left:.6in;right:.6in;bottom:.4in;display:flex;gap:14px;align-items:flex-end;border-top:.6px solid ${T.hair};padding-top:6px;color:${T.mute};font-size:6.4px;line-height:1.4;letter-spacing:.02em}
.foot .gate{flex:1}
.foot .rv{color:${T.flame};letter-spacing:.04em;width:1.55in;flex:none}
.foot .pg{font:400 11px/1 BzDidot,serif;color:${T.ink};letter-spacing:0;flex:none}
.foot .pg i{font-style:normal;color:${T.mute};font-size:8px}
.tc{color:${T.flame};font-style:italic;font-weight:400}
figcaption{font-size:6.8px;line-height:1.4;color:${T.mute};margin-top:4px;letter-spacing:.02em}
/* page 1 */
.page:first-child .eyebrow{margin-top:14px}
.hero{margin:12px 0 12px}
.hi{height:2.75in;background-size:cover;background-color:${T.wash}}
.co-grid{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1.6px solid ${T.ink}}
.co{padding:10px 12px 11px 0;border-bottom:.6px solid ${T.hair};display:flex;flex-direction:column}
.co:not(:nth-child(3n+1)){padding-left:12px;border-left:.6px solid ${T.hair}}
.co-top{display:flex;align-items:center;gap:7px;margin-bottom:7px}
.co-ic{width:24px;height:24px;border-radius:50%;background:${T.tint};color:${T.flame};display:grid;place-items:center;flex:none}
.co-ic .ic{width:14px;height:14px}
.co-lbl{color:${T.ink};font-size:6.8px;line-height:1.25}
.co-nums{display:flex;align-items:flex-end;gap:10px;margin-bottom:7px}
.co-big{font:400 36px/1 BzDidot,Didot,serif;color:${T.ink};letter-spacing:-.01em;white-space:nowrap}
.co-big small{font:700 8px/1 BzSans,Arial,sans-serif;color:${T.flame};letter-spacing:.06em;margin-left:4px}
.co-them{font:400 13px/1.1 BzDidot,Didot,serif;color:${T.mute};padding-bottom:3px}
.co-them b{display:block;font:700 5.8px/1.2 BzSans,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;margin-bottom:2px}
.co-b{font-size:8.4px;line-height:1.42;color:${T.ink};font-weight:400;margin-bottom:6px}
.co-i{font-size:7.8px;line-height:1.42;color:${T.mute};border-top:.6px dotted ${T.hair};padding-top:5px;margin-top:auto}
.key{font-size:6.9px;line-height:1.5;color:${T.mute};margin-top:8px}
.key .kb{color:${T.ink};font-weight:700}.key .ki{color:${T.mute};font-weight:700}
/* page 2 blooms */
.blooms{display:grid;grid-template-columns:1fr 1fr;gap:18px;border-top:1.6px solid ${T.ink};padding-top:8px}
.bl-h{color:${T.ink};margin-bottom:6px}
.bl-set{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.bl{display:flex;flex-direction:column}
.bl-n{font-size:7px;line-height:1.25;color:${T.mute};margin:0 0 3px;min-height:18px;font-weight:400}
.bl.us .bl-n{color:${T.flame};font-weight:700}
.bl-svg{width:100%;height:auto;display:block}
.bl-f{display:grid;grid-template-columns:auto 1fr;gap:1px 6px;font-size:7.2px;margin-top:3px;color:${T.mute}}
.bl-f dd{text-align:right;font-variant-numeric:tabular-nums}
.bl.us .bl-f dd{color:${T.ink};font-weight:700}
.bl-key{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:7px;color:#3f3b3c;margin:8px 0 10px;align-items:center}
.bl-key i{display:inline-block;width:9px;height:9px;margin-right:2px;vertical-align:-1px}
.bl-key span i:last-of-type{margin-right:5px}
.bl-key .bk{color:${T.mute};flex-basis:100%}
.p2-band{display:grid;grid-template-columns:1.6in 1.6in 1fr;gap:10px;align-items:end;margin-bottom:10px}
.p3-band{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:12px 0 10px}
.ri{height:.9in;background-size:cover;background-color:${T.wash}}
.ri.tall{height:1.75in}
.tally{padding-bottom:12px;padding-left:10px}
.tl-bar{display:flex;height:10px;gap:2px;margin-bottom:7px}
.tb.b{background:${T.flame}}.tb.p{background:${T.hair}}.tb.i{background:${T.steel}}
.tl-key{display:flex;flex-wrap:wrap;gap:3px 12px;font-size:8px;color:#3f3b3c}
.tl-key b{font:400 14px/1 BzDidot,serif;color:${T.ink};margin:0 3px 0 1px}
.tl-key .tl-n{font-size:6.8px;color:${T.mute};letter-spacing:.06em;text-transform:uppercase;align-self:center}
.mk{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px;vertical-align:0}
.mk.b{background:${T.flame}}.mk.p{background:#fff;border:1px solid ${T.steel}}.mk.i{background:${T.steel}}
.na{color:${T.mute};padding-left:2px}
.mx{width:100%;border-collapse:collapse;table-layout:fixed;font-size:7.9px;line-height:1.28}
.mx thead th{color:${T.mute};text-align:left;padding:0 6px 5px 0;border-bottom:1.6px solid ${T.ink};font-size:6.4px;vertical-align:bottom}
.mx thead th.hb{color:${T.flame}}
.mx td{padding:3.6px 6px 3.6px 0;border-bottom:.5px solid ${T.hair};vertical-align:middle}
.mx th.grp{font:400 11px/1.15 BzDidot,serif;color:${T.ink};text-transform:none;letter-spacing:0;text-align:left;vertical-align:top;padding:4px 6px 0 0;border-bottom:.8px solid ${T.ink}}
.mx tbody tr:last-child td{border-bottom:.8px solid ${T.ink}}
.mx td.ft{color:#3f3b3c;font-weight:400;padding-left:6px}
.mx td.cb{color:${T.ink};font-weight:400}
.mx td.ci{color:${T.mute}}
.mx tr.e-b td{background:${T.tint}}
.mx tr.e-b td.ft{box-shadow:inset 2px 0 0 ${T.flame}}
.mx td.ed{font-size:7px;color:${T.steel};white-space:nowrap}
.mx tr.e-b td.ed{color:${T.flame};font-weight:700}
.ok,.no{display:inline-flex;align-items:flex-start;gap:4px}
.tk{width:10px;height:10px;flex:none;stroke-width:2.6;margin-top:.5px}
.ok .tk{color:${T.flame}}
.ci .ok .tk{color:${T.steel}}
.no .tk{color:${T.mute}}
.v{font:400 12px/1 BzDidot,serif}
.ci .v{color:${T.mute}}
/* page 3 */
.gl{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;border-top:1.6px solid ${T.ink};margin-bottom:6px}
.gi{display:grid;grid-template-columns:16px 1fr;gap:6px;padding:8px 9px 8px 0;border-bottom:.6px solid ${T.hair}}
.gi:not(:nth-child(4n+1)){padding-left:9px;border-left:.6px solid ${T.hair}}
.gic{width:14px;height:14px;color:${T.flame};margin-top:1px}
.gk{color:${T.ink};font-size:6.4px;margin-bottom:3px}
.gt{font-size:7.7px;line-height:1.4;color:#3f3b3c;font-weight:400}
.p3-row{display:flex;justify-content:flex-end;margin:4px 0 2px}
.p3-row .tally{width:3.4in}
/* page 4 */
.reco{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:12px 0 10px}
.rc{border-top:1.6px solid ${T.ink};padding-top:9px;display:flex;flex-direction:column}
.rci{height:2.05in;background-size:cover;background-color:${T.wash}}
.rc h3{font-size:16px;line-height:1.15;margin:7px 0 5px}
.wm{color:${T.flame};margin-bottom:5px;font-size:6.4px}
.pts{list-style:none;display:flex;flex-direction:column;gap:4px;margin-bottom:7px}
.pts li{display:grid;grid-template-columns:13px 1fr;gap:5px;font-size:8.2px;line-height:1.4;color:${T.ink};font-weight:400}
.pi{width:11px;height:11px;color:${T.flame};margin-top:1.5px;stroke-width:2.4}
.kit{display:grid;grid-template-columns:48px 1fr;gap:4px 8px;font-size:7.8px;line-height:1.4;padding-top:6px;border-top:.6px solid ${T.hair};margin-top:auto}
.kit dt{color:${T.flame};padding-top:1.5px;font-size:6.2px}
.kit dd{color:#3f3b3c;font-weight:400}
.sell{list-style:none;display:grid;grid-template-columns:1fr 1fr 1fr;margin:6px 0 14px;border-top:1.6px solid ${T.ink}}
.sell li{padding:9px 12px 10px 0;display:flex;gap:8px}
.sell li+li{padding-left:12px;border-left:.6px solid ${T.hair}}
.sn{font:400 28px/1 BzDidot,serif;color:${T.flame};flex:none}
.sell .q{font:400 12.5px/1.2 BzDidot,serif;color:${T.ink};margin-bottom:5px}
.sell p{font-size:8.1px;line-height:1.45;color:#3f3b3c;font-weight:400}
.p4-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.box{border:.6px solid ${T.hair};border-top:1.6px solid ${T.flame};padding:8px 11px 9px}
.gatebox{border-top-color:${T.ink}}
.bh{color:${T.ink};margin-bottom:6px}
.rules{list-style:none}
.rules li{font-size:7.8px;line-height:1.4;color:#3f3b3c;padding-left:10px;position:relative;margin-bottom:3px;font-weight:400}
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

const html = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bromic vs Heatstrip</title><style>${css}</style></head><body>${page1}${page2}${page3}${page4}</body></html>`;

// ---------- render and print check ----------
(async () => {
  prepImages();
  fs.mkdirSync(path.join(HERE, 'pages'), { recursive: true });
  for (const f of fs.readdirSync(path.join(HERE, 'pages'))) if (/^p\d+\.png$/.test(f)) fs.unlinkSync(path.join(HERE, 'pages', f));
  fs.writeFileSync(path.join(HERE, 'index.html'), html);
  fs.writeFileSync(path.join(HERE, 'sources.json'), JSON.stringify({
    _readme: 'Internal: the source of every fact on Bromic-vs-Heatstrip.pdf, page by page, for the Specification and compliance review. Not printed and not published. Built by build.js from data/retail/vs-heatstrip.json and the product frameworks.',
    needs_approval: D.needs_approval, gates: D.gates, open: D.open, built: new Date().toISOString().slice(0, 10), facts: LEDGER,
  }, null, 1) + '\n');
  const report = [];
  const body = html.replace(/<style>[\s\S]*?<\/style>/, '');
  const words = body.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ');
  if (/\$/.test(words)) report.push('a "$" appears');
  if (/\[\[/.test(words) || /VERIFY/.test(words)) report.push('a raw [[VERIFY appears');
  if (/coming soon/i.test(words)) report.push('"coming soon" appears');
  if (/optional/i.test(words)) report.push('"optional" appears');
  if (/—/.test(words)) report.push('long dash in copy');
  if (/!/.test(words)) report.push('exclamation mark');
  if (/\bthe only\b|shallowest|lowest clearance/i.test(words)) report.push('an "only" or superlative claim');
  if (/\b(\d+(\.\d+)?)\s?(in|ft|ft²|°F|lb)\b|\binches?\b|\bfeet\b/.test(words.replace(/US pages say 10 in/g, ''))) report.push('an imperial unit in the copy');
  if (/\bcolor|\bcenter\b|\bgray\b/i.test(words)) report.push('US spelling');
  if (/<sup|\bSOURCES\b|heatstrip\.com|cdn\.shopify|pim\.bromic/i.test(body)) report.push('a printed source or footnote marker');
  if (!/sold separately/i.test(words)) report.push('the Wi-Fi/app line is missing');
  if (!/Affinity Smart-Heat® Dimmer or On\/Off, and a manual wall switch/.test(words) || !/Affinity Smart-Heat® Dimmer as standard/.test(words)) report.push('a range without its controls');
  if (!/Classic follows in January 2027/.test(words)) report.push('Series II launch line missing');
  if (!/Wider\. Warmer\. Worry-Free Recessing\./.test(words)) report.push('platform line missing');
  if (/\bsafely\b/i.test(words)) report.push('"safely" in customer copy (owner: worry-free)');
  if ((words.match(new RegExp(REVIEW, 'g')) || []).length < PAGES) report.push('review mark not on every page');
  if ((words.match(/Test figures held until Infrascan Rev 2 and Australian counsel/g) || []).length < PAGES) report.push('gate status line not on every page');
  if ((words.match(/\bDraft\b/g) || []).length < PAGES) report.push('DRAFT mark not on every page');
  if (/(src=["']?|url\()[^"')]*heatstrip/i.test(html)) report.push('a Heatstrip image is referenced');
  // page 3 makes no warmth claim for Tungsten
  const p3 = page3.replace(/<footer[\s\S]*?<\/footer>/, '').replace(/<[^>]+>/g, ' ');
  if (/warm zone|m²|°C|Infrascan|warmer/i.test(p3.replace(/makes no claim about warmth/, ''))) report.push('a performance figure on the Tungsten page');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(HERE, 'index.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const qa = await page.evaluate(() => {
    const out = [];
    const hit = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    document.querySelectorAll('.page').forEach((pgEl, n) => {
      const pg = pgEl.getBoundingClientRect();
      // A4-friendly: A4 is 210 mm wide (0.13 in narrower than Letter each side once centred) and Letter is 279 mm tall
      // (0.35 in shorter than A4): keep everything at least 0.45 in in from the side edges and 0.35 in from top and bottom.
      const frame = { left: pg.left + 43, right: pg.right - 43, top: pg.top + 34, bottom: pg.bottom - 34 };
      const footTop = pgEl.querySelector('.foot').getBoundingClientRect().top;
      pgEl.querySelectorAll('p, h1, h2, h3, li, td, th, dt, dd, figcaption, .btn, .co-big, .tl-key span, .bl-key span, svg.bl-svg').forEach((el) => {
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
      const groups = [...pgEl.querySelectorAll('.co, .bl, .gi, .rc, .sell li, .box, .p2-band figure, .p3-band figure')];
      for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) {
        if (groups[i].contains(groups[j]) || groups[j].contains(groups[i])) continue;
        if (hit(groups[i].getBoundingClientRect(), groups[j].getBoundingClientRect()) > 4) out.push(`p${n + 1} overlap: ${groups[i].className} / ${groups[j].className}`);
      }
      pgEl.querySelectorAll('.co, .gi, .rc, .sell li').forEach((c) => { if (c.scrollHeight > c.clientHeight + 1) out.push(`p${n + 1} text overflows its block: "${c.textContent.trim().slice(0, 30)}"`); });
      pgEl.querySelectorAll('td').forEach((td) => { if (td.scrollWidth > td.clientWidth + 1) out.push(`p${n + 1} cell too narrow: "${td.textContent.trim().slice(0, 30)}"`); });
      pgEl.querySelectorAll('.co-nums').forEach((c) => { if (c.scrollWidth > c.clientWidth + 1) out.push(`p${n + 1} call-out numbers too wide: "${c.textContent.trim().slice(0, 30)}"`); });
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
  const pdf = path.join(HERE, 'Bromic-vs-Heatstrip.pdf');
  await page.pdf({ path: pdf, format: 'Letter', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  const size = fs.statSync(pdf).size;
  if (size > 4 * 1024 * 1024) report.push(`PDF is ${(size / 1048576).toFixed(2)} MB`);
  const pdfPages = (fs.readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pdfPages !== PAGES) report.push(`PDF has ${pdfPages} pages`);

  // the Hub's thumbnail (data/retail/kit.json → reports/retail/_hub/vs-heatstrip.webp), 640 wide like the rest of the kit
  const th = spawnSync('python3', ['-c', `
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB')
w = 640; im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
im.save(sys.argv[2], 'WEBP', quality=82, method=6)
`, path.join(HERE, 'pages/p1.png'), path.join(HERE, '../_hub/vs-heatstrip.webp')], { stdio: 'inherit' });
  if (th.status) report.push('thumbnail failed');

  fs.writeFileSync(path.join(HERE, 'meta.json'), JSON.stringify({
    title: 'Bromic Platinum And Tungsten vs Heatstrip',
    kicker: 'Retail kit · competitive sheet · Australia',
    desc: 'Four US Letter pages (A4-friendly) for Australian floor staff and buyers: the differences up front, Platinum Electric against Heatstrip Classic and Enhance with the measured warm zone drawn to scale, Tungsten Series II against Heatstrip on published specifications only, and how to sell it. Draft: test figures held until Infrascan Rev 2 and Australian counsel; Specification and compliance review required before external use.',
    market: 'AU',
    pages: PAGES,
    needs_approval: D.needs_approval,
    pdf: repoRel('Bromic-vs-Heatstrip.pdf'),
    cover: repoRel('pages/p1.png'),
    data: 'data/retail/vs-heatstrip.json',
    sources: repoRel('sources.json'),
  }, null, 1) + '\n');
  const txt = `Print check, ${new Date().toISOString().slice(0, 10)}\n` + (report.length ? report.join('\n')
    : `clean: ${PAGES} Letter pages inside the A4 overlap, no text off the margins or into the footer, no overlapping blocks, cards or cells, no overflowing text, all images load (Bromic only: approved or library, no Heatstrip imagery), no printed sources or footnote markers (${LEDGER.length} facts traced in sources.json), test numbers re-derived from the radii (π·a·b), no "$", no raw VERIFY, no "coming soon", no "only" claim, metric and Australian spelling, no warmth figure on the Tungsten page, controls with both ranges, DRAFT, gate line and review mark on every page, PDF ${(size / 1024).toFixed(0)} KB`) + '\n';
  fs.writeFileSync(path.join(HERE, 'print-check.txt'), txt);
  console.log(txt);
})().catch((e) => { console.error(e); process.exit(1); });
