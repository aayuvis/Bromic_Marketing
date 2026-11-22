// Bromic vs Infratech: a two-sheet US Letter comparison for retail floor staff and buyers, in the white Blueprint look
// of the approved retail set (reports/retail/controls-mounting, reports/retail/one-pagers).
// Facts only from data/product-marketing/tungsten-electric-series-ii.json (m3.rows, claim_checks, one_pagers footnote)
// and data/product-marketing/platinum-electric.json (m3 vs.infratech, competitive_summary), and their sources[].
// Open facts ([[VERIFY]]) print as "To confirm". No prices. No Infratech logo or imagery: Bromic product photos only.
// The recess line follows claim_checks: never "only" unqualified, "shallowest" or "lowest clearance".
// Run: node reports/retail/vs-infratech/build.js
//   → index.html, pages/p1.png, pages/p2.png, Bromic-vs-Infratech.pdf, meta.json, print-check.txt
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

const T = { ink: '#231F20', draw: '#1C2B44', steel: '#6B7480', hair: '#B9C3D0', flame: '#EF4123' };
const TC = '<i class="tc">To confirm</i>';
const R = '®';

// ---------- images: Bromic only, never a rejected library image, ≤ 1800 px JPEG q82 ----------
const IMAGES = {
  'p-s2-post': 'images/library/t2-single-post-black.webp',
  'p-s2-recess': 'images/library/t2-low-clearance-recess.webp',
};
function prepImages() {
  fs.mkdirSync(path.join(HERE, 'img'), { recursive: true });
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'images/library/manifest.json'), 'utf8'));
  const st = Object.fromEntries(man.map((m) => [m.file, m.status]));
  for (const src of Object.values(IMAGES)) {
    if (!(src in st)) throw new Error('not in the library: ' + src);
    if (/rejected/i.test(st[src])) throw new Error('rejected image: ' + src);
  }
  const jobs = Object.entries(IMAGES).map(([k, src]) => [path.join(ROOT, src), path.join(HERE, 'img', `${k}.jpg`)]);
  const py = `
import sys, json
from PIL import Image
for src, out in json.loads(sys.argv[1]):
    im = Image.open(src).convert('RGB')
    im.thumbnail((1800, 1800), Image.LANCZOS)
    im.save(out, 'JPEG', quality=82, optimize=True, progressive=True)
`;
  const r = spawnSync('python3', ['-c', py, JSON.stringify(jobs)], { stdio: 'inherit' });
  if (r.status) throw new Error('image prep failed');
  fs.copyFileSync(path.join(ROOT, 'images/portfolio/bromic-logo.png'), path.join(HERE, 'img/bromic-logo.png'));
}

// ---------- sources: numbered in the order printed on sheet 02 ----------
const byId = {};
for (const s of [...S2.sources, ...PE.sources]) if (!byId[s.id]) byId[s.id] = s;
// short print titles for the data's sources (the data's own titles carry notes for the team)
const SHORT = {
  s1: 'Tungsten Smart-Heat Electric product page', b1: 'Tungsten Electric Select & Coastal installation manual (dealer-hosted)',
  b2: 'LC Ceiling Recess Kit for Tungsten Series II, instructions (dealer-hosted)', s5: 'Tungsten Electric recess kit page',
  d1: 'Tungsten Electric Series II launch deck, July 2026', s4: 'Warranty', b3: 'Affinity Smart-Heat control system brochure',
  b4: 'Affinity Smart-Heat app page', p1: 'Platinum Smart-Heat Electric product page', p2: 'Platinum Smart-Heat Electric Marine product page',
  p7: 'Platinum Electric Low Clearance Ceiling Recess instructions', p9: 'Platinum Electric recess kit, poles and wall bracket pages',
  p10: 'Revit BIM and CAD files', i2: 'C/CD, W/WD, SL and Motif series pages', i14: 'C/CD Series colour options',
  i3: 'FAQs, read 19 Nov 2026', i12: 'W-33/W-39/W-61 flush mount frame drawing, Dec 2019 (dealer-hosted)',
  i13: 'W/WD Series installation manual (dealer-hosted)', i6: 'Mounting options; pole mount drawing (06-01-2026) and drop pole one-pager',
  i7: 'Controls', i16: 'Smart Switch and Smart Dimmer sell sheet (Bond), Enhanced Timer Package', i9: 'Limited warranty',
  i17: 'Warranty, 2024 terms; dealers and installers pages', i10: 'Dealers and trade programs', i18: 'Marine UpGrade',
  i4: "C-Series owner's instruction manual (dealer-hosted)", i19: 'C/CD coverage chart, 2025',
};
const SRC = [
  // [id, publisher, title, date, url] — title and date from the data's sources[]; url "internal" prints as such
  ['s1'], ['b1'], ['b2'], ['s5'], ['d1'], ['s4'], ['b3'], ['b4'],
  ['p1'], ['p2'], ['p7'], ['p9'], ['p10'],
  ['lp', 'Bromic Heating', 'Bromic Partner Program (builders and trade) page, read 29 Oct 2026', '2026', 'https://www.bromic.com/lp-builders/'],
  ['p11', 'Bromic Heating', 'Outdoor Lookbook 2026', '2026', 'internal'],
  ['i2'], ['i14'], ['i3'], ['i12'], ['i13'], ['i6'], ['i7'], ['i16'], ['i9'], ['i17'], ['i10'], ['i18'], ['i4'], ['i19'],
].map(([id, pub, title, date, url]) => {
  const s = byId[id];
  if (!s && !pub) throw new Error('unknown source ' + id);
  return { id, pub: pub || s.publisher, title: title || SHORT[id] || s.title, date: date || String(s.year), url: url || s.url };
});
const NUM = Object.fromEntries(SRC.map((s, i) => [s.id, i + 1]));
const ref = (...ids) => `<sup class="rf">${ids.map((id) => { if (!NUM[id]) throw new Error('ref to unlisted source ' + id); return NUM[id]; }).join(',')}</sup>`;

// ---------- the comparison: one row per benefit field, in the framework's priority order ----------
// Edge for Series II is the data's m3.rows[].edge; Platinum's is m3.rows[].edge in platinum-electric.json.
const s2Edge = Object.fromEntries(S2.m3.rows.map((r) => [r.benefit, r.edge]));
const peEdge = Object.fromEntries(PE.m3.rows.map((r) => [r.benefit, r.edge]));
const ROWS = [
  { b: 'recess', field: 'Recess ability',
    bromic: `<b>Series II:</b> 6 kW flush in a 7.5 in cavity (${TC}) with a dual fan-ventilated low-clearance kit; the recess box comes with the kit, so no site-built fire-rated box (${TC}). The only 6 kW kit of its kind found in Bromic's market check, 18 Nov 2026.${ref('b2', 's5', 'd1')} <b>Platinum:</b> 7.1 in cavity, box supplied, cooling fan, up to 4500 W.${ref('p7')}`,
    infra: `W/WD flush frame in a framed pocket "MIN. 2 x 8", lined on five sides with 5/8 in Type X drywall; flat ceilings only; up to 6,000 W; no fans shown; a cool-down is recommended after 4 hours of continuous use.${ref('i12', 'i13')}` },
  { b: 'heat', field: 'Heat performance',
    bromic: `<b>Series II:</b> 2 to 6 kW; dual elements on 4 and 6 kW, dimmable in 1% steps; up to 160 ft² for 6 kW.${ref('b1', 'd1')} <b>Platinum:</b> 2300, 3400 and 4500 W; about 65, 108 and 143 ft².${ref('p1')} Each brand measures coverage its own way.`,
    infra: `1.5 to 6 kW, 120 to 480 V models; its chart gives about 121 ft² for the 6,000 W CD at 8–12 ft.${ref('i3', 'i19')}` },
  { b: 'aesthetics', field: 'Design aesthetics',
    bromic: `<b>Series II:</b> all black, all white or all graphite, the front in the same finish; about 14% narrower and a third lighter than Series I; one post, no visible junction box.${ref('d1', 'b1')} <b>Platinum:</b> tinted glass-ceramic face, 2.1 in deep.${ref('p1')}`,
    infra: `Colour powder coat on the end caps and housing; the polished reflector and wire guard stay stainless (SL All Black Shadow aside); junction box on top of the heater.${ref('i2', 'i14')}` },
  { b: 'controls', field: 'Ease of controls',
    bromic: `Affinity Smart-Heat${R} Controls and the Bromic app: 1% dimming, zones, schedules, timers and remote off; Alexa and Google Assistant; Control4, Crestron or Lutron where compatible. Wi-Fi and app features need compatible Affinity controls, sold separately.${ref('b3', 'b4')}`,
    infra: `Bond Smart Dimmer with the Universal Control Panel (dimming, timing, zoning), or Smart Switch (on/off, built-in 2-hour timer); Lutron and Crestron through home systems; competitor controls may void the warranty.${ref('i7', 'i16', 'i9')}` },
  { b: 'install_flex', field: 'Installation flexibility',
    bromic: `<b>Series II:</b> ceiling, pitched ceiling 3/12 to 12/12, wall, extended wall, single post, recessed; tilts to 45° (the manual says 30° for 4 and 6 kW: ${TC}).${ref('b1', 'd1')} <b>Platinum:</b> wall straight or angled, ceiling, poles, standard or low-clearance recess.${ref('p9')}`,
    infra: `Wall, ceiling, flush, pole and drop pole; the flush frame "is ONLY to be used on a flat non-sloped ceiling".${ref('i6', 'i12')}` },
  { b: 'safety', field: 'Safety and peace of mind',
    bromic: `<b>Series II:</b> IPX5; fan-cooled recess kit; app schedules, timers and remote off. Continuous-use guidance for the recess kit: ${TC}.${ref('b1', 'b2', 'b4')} <b>Platinum:</b> Intertek ETL / cETL listed; recess kit with a fan and two thermal cut-offs.${ref('p1', 'p7')}`,
    infra: `UL and cUL listed, IPX4. Flush frame: a cool-down is recommended after 4 hours of continuous use. The Smart Switch app route is on/off with a 2-hour timer.${ref('i3', 'i12', 'i16')}` },
  { b: 'design_flex', field: 'Design flexibility',
    bromic: `<b>Series II:</b> three finishes carried through to the front; three fronts (Diamond standard; oval and triangle sold separately) that swap without re-wiring; fronts on recessed installs: ${TC}.${ref('d1', 's1')} <b>Platinum:</b> black or white, three lengths.${ref('p1')}`,
    infra: `Brushed stainless or eight powder-coated colours plus custom on C/CD and W/WD, reflector and guard stainless; Motif covers on surface-mount C/CD only, not flush.${ref('i2', 'i14')}` },
  { b: 'multi_area', field: 'Heat multiple areas',
    bromic: `One portfolio: electric for ceilings, walls, posts and recesses (Tungsten, Platinum), the Eclipse pendant, Eclipse Freestanding, mounted gas and Tungsten Freestanding Gas.${ref('s1', 'p11')}`,
    infra: `Fixed electric infrared heaters only (C/CD, W/WD, SL, Motif covers, an indoor garage heater); no gas and no freestanding heaters on infratech.com.${ref('i2')}` },
  { b: 'warranty', field: 'Warranty',
    bromic: `<b>Series II:</b> 3 years on the heater and 7 years on the elements, on Select, Coastal and Classic; a partner year on qualifying products.${ref('s4', 'lp')} <b>Platinum:</b> 3 years; Marine 5 years on land.${ref('p2')}`,
    infra: `3-year limited warranty; a fourth year through Elite Retailers and the Installer Program; not transferable; 2024 terms: replacement parts only, labour excluded.${ref('i9', 'i17')}` },
  { b: 'install_ease', field: 'Ease of installation',
    bromic: `<b>Series II:</b> one post instead of a pair of drop rods; the recess box comes with the kit, nothing to build on site; one kit for Select and Coastal.${ref('d1', 'b2')} <b>Platinum:</b> bracket and 8 in pole included; the recess fan needs a constant supply; two people to lift into the recess.${ref('p7', 'p9')}`,
    infra: `Flush: a framed 2×8 pocket lined on five sides with Type X drywall, junction box outside the pocket. Drop pole: a pair of rods per heater; pole mount on a 10 × 10 in base.${ref('i12', 'i6')}` },
  { b: 'support', field: 'Specification and support',
    bromic: `Bromic Partner Program: partner pricing, free custom heating design plans, extended warranty, a dedicated contact, project spotlights; Revit and CAD files.${ref('lp', 'p10')}`,
    infra: `Trade program with design guides, CAD details and continuing-education credits; Elite Retailers and the Installer Program add a fourth warranty year and leads.${ref('i10')}` },
  { b: 'coastal', field: 'Durability by the coast',
    bromic: `<b>Coastal:</b> a corrosion-resistant coating over a marine-grade build as standard (316 per the Lookbook; body material and coating name ${TC}); marine-grade recess kit; IPX5; not for boats.${ref('p11', 'b1', 'b2')} <b>Platinum Marine:</b> 316, IPX5 (IP55 on 4500 W).${ref('p2')}`,
    infra: `316 stainless as a Marine UpGrade at extra cost on C/CD, W/WD and flush frames (not SL); IPX4; its manual notes 316 is not fully corrosion-proof.${ref('i18', 'i3', 'i4')}` },
];
// every benefit field in the data is on the sheet, and nothing else
{
  const want = S2.m3.rows.map((r) => r.benefit).sort().join();
  const have = ROWS.map((r) => r.b).sort().join();
  if (want !== have) throw new Error(`rows ${have} do not match the data's ${want}`);
}
const CHIP = {
  bromic: ['b', 'Bromic stronger'], parity: ['p', 'Parity'], infratech: ['i', 'Infratech stronger'], competitor: ['i', 'Infratech stronger'],
  unknown: ['u', 'To confirm'], mixed: ['m', 'Mixed'],
};
const chip = (edge) => { const [c, t] = CHIP[edge]; return `<span class="chip ${c}">${t}</span>`; };
const edgeCell = (b) => `<div class="eg"><span class="who">SERIES II</span>${chip(s2Edge[b])}</div>${peEdge[b] ? `<div class="eg"><span class="who">PLATINUM</span>${chip(peEdge[b])}</div>` : ''}`;
const table = `<table class="mx cmp"><colgroup><col style="width:92px"><col><col style="width:200px"><col style="width:92px"></colgroup>
  <thead><tr><th>BENEFIT FIELD</th><th>BROMIC · TUNGSTEN SERIES II / PLATINUM ELECTRIC</th><th>INFRATECH · C/CD, W/WD, SL</th><th>EDGE</th></tr></thead><tbody>
  ${ROWS.map((r) => `<tr><td class="ser">${r.field}</td><td>${r.bromic}</td><td class="inf">${r.infra}</td><td class="ed">${edgeCell(r.b)}</td></tr>`).join('\n  ')}
  </tbody></table>`;

// ---------- sheet 02: on the floor ----------
const TALK = [
  ['"Infratech recesses too."', `It does, in a framed pocket of at least 2×8, lined on five sides with Type X drywall, on a flat ceiling. Tungsten Series II recesses 6,000 W into a 7.5 in ceiling cavity: the kit is dual fan-ventilated, so there is no site-built box.${ref('i12', 'b2')}`, `Cavity depth and the kit's listing: ${TC}.`],
  ['"Can a recessed heater run all evening?"', `Infratech's flush-frame drawing says: "After 4 hours of continuous use, a 15 minute cool down period is recommended". The Series II kit is dual fan-ventilated.${ref('i12', 'b2')}`, `Bromic's continuous-use guidance: ${TC}. Promise no run time until it is.`],
  ['"My porch ceiling is pitched."', `Tungsten Series II mounts on 3/12 to 12/12 with its adaptor; Infratech's flush frame is "ONLY to be used on a flat non-sloped ceiling".${ref('b1', 'i12')}`, ''],
  ['"Infratech comes in more colours."', `It does: brushed stainless or eight powder-coated colours plus custom, with the reflector and guard in stainless. Series II is all black, all white or all graphite, front included, in a Diamond, oval or triangle pattern.${ref('i2', 'd1')}`, 'Say so where Infratech leads.'],
  ['"What does the warranty cover?"', `Tungsten Series II: 3 years on the heater and 7 years on the elements. Infratech: a 3-year limited warranty, with a fourth year through its Elite Retailer and Installer programs.${ref('s4', 'i9')}`, ''],
  ['"Which one is warmer?"', `Both reach 6 kW, and each brand measures coverage its own way. Talk about where the warmth lands, and let a free design plan prove the coverage seat by seat.${ref('b1', 'i19')}`, ''],
];
const talk = `<ol class="talk">${TALK.map(([q, a, n], i) => `<li><span class="no">${i + 1}</span><p class="q"><b>THEY SAY</b><span>${q}</span></p><p class="a"><b>YOU CAN SAY</b><span>${a}</span></p>${n ? `<p class="nt">${n}</p>` : ''}</li>`).join('')}</ol>`;

const CONTROLS = [
  [`Tungsten Smart-Heat${R} Electric Series II`, 'SELECT, COASTAL · CLASSIC: JANUARY 2027', `Affinity Smart-Heat${R} Dimmer as standard, On/Off where dimming is not wanted, and a manual wall switch.`],
  [`Platinum Smart-Heat${R} Electric`, 'CLASSIC AND MARINE', `Affinity Smart-Heat${R} Dimmer or On/Off and a manual wall switch; the expansion board for building systems.`],
];
const ctlBox = `<div class="box"><p class="bh">QUOTE EVERY HEATER WITH ITS CONTROLS</p>
  ${CONTROLS.map(([n, s, c]) => `<p class="ci"><b>${n}</b><span class="sub">${s}</span>${c}</p>`).join('')}
  <p class="ci last">Wi-Fi and app features need compatible Affinity Smart-Heat${R} Controls, sold separately. Quote no default timer length.${ref('b3', 'b4')}</p></div>`;

const fairBox = `<div class="box"><p class="bh">KEEP IT FAIR</p>
  <ul class="rules">
    <li>Factual, sourced lines only; never run down another brand.</li>
    <li>Where Infratech leads or matches, say so: colours, voltages to 480 V, recessing to 6 kW.</li>
    <li>Never "only" without its qualifier, and no superlatives about depth or clearance.</li>
    <li>No prices, and no Infratech logo or imagery.</li>
  </ul></div>`;

const OPEN = [
  'Series II low-clearance kit: no fire-rated lining or enclosure under its listing, and 7.5 in as the cavity depth (Product team)',
  'Continuous-use guidance for the Series II recess kit (Product team)',
  'Tilt to 45° on 4 and 6 kW: the Series II manual gives 30° (Product team)',
  'Series II fronts on recessed installs; Coastal body material and coating name (Product team)',
  "Platinum low-clearance kit: no fire-rated lining under its listing (Product team)",
  "The market check behind the recess line: other brands' 6 kW recess products (Specification and compliance)",
];
const openBox = `<div class="sec open"><div class="hdr"><span class="lbl">TO CONFIRM BEFORE QUOTING</span><span class="lbl r">OPEN WITH THE TEAMS NAMED</span></div>
  <ul class="ol">${OPEN.map((o) => `<li>${o}</li>`).join('')}</ul></div>`;

const shortUrl = (u) => u === 'internal' ? 'internal document' : u.replace(/^https?:\/\/(www\.)?/, '');
const sources = `<div class="sec srcs"><div class="hdr"><span class="lbl">SOURCES</span><span class="lbl r">COMPARED BY BROMIC 18–19 NOV 2026</span></div>
  <ol class="src">${SRC.map((s, i) => `<li><span class="n">${i + 1}</span>${s.pub}, ${s.title}, ${s.date}. <span class="u">${shortUrl(s.url)}</span></li>`).join('')}</ol></div>`;

// ---------- page furniture ----------
const zones = () => {
  const cols = [1, 2, 3, 4, 5, 6], rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const top = cols.map((k, i) => `<span style="left:${(i + 0.5) * 100 / cols.length}%">${k}</span>`).join('');
  const side = rows.map((k, i) => `<span style="top:${(i + 0.5) * 100 / rows.length}%">${k}</span>`).join('');
  return `<div class="zones"><div class="zt">${top}</div><div class="zb">${top}</div><div class="zl">${side}</div><div class="zr">${side}</div></div>`;
};
const REVIEW = 'Specification and compliance review required before external use';
const strip = (sheet, notes) => `<div class="strip">
  <div class="cell grow"><b>SOURCES</b><span>${notes}</span></div>
  <div class="cell"><b>FOR</b><span>Retail floor and buyers</span></div>
  <div class="cell"><b>SHEET TITLE</b><span>Bromic vs Infratech</span></div>
  <div class="cell rv"><b>REVIEW</b><span>${REVIEW}</span></div>
  <div class="cell s"><b>DATE</b><span>2026-11-22</span></div>
  <div class="cell sheet"><b>SHEET</b><span>${sheet}<i>/02</i></span></div>
</div>`;
const head = (eyebrow, h2, lede, photo) => `<header class="s-head">
  <div class="s-text"><div class="brand"><img class="logo" src="img/bromic-logo.png" alt="Bromic Heating"><span class="lbl">RETAIL KIT · COMPETITIVE SHEET</span></div>
  <p class="eyebrow">${eyebrow}</p><h2>${h2}</h2><p class="s-lede">${lede}</p></div>
  ${photo ? `<figure class="ph top"><div class="ph-img" style="background-image:url(img/${photo[0]}.jpg);background-size:${photo[2] || 'cover'};background-position:${photo[3] || 'center'}"></div><figcaption><b>PHOTO</b> ${photo[1]}</figcaption></figure>` : ''}
</header>`;
const legend = `<div class="legend"><span class="lbl">EDGE</span>${chip('bromic')}${chip('parity')}${chip('competitor')}${chip('mixed')}<span class="lk">Mixed: Bromic leads on some points, Infratech on others. ${TC}: a Bromic fact the Product team is checking.</span></div>`;

const page1 = `<section class="page">
  <div class="grid"></div>${zones()}<div class="frame"></div><div class="flow">
  ${head('BROMIC VS INFRATECH · ELECTRIC INFRARED', 'Bromic And Infratech, Side By Side',
    `Twelve benefit fields, as each brand publishes them: Tungsten Smart-Heat${R} Electric Series II (Select and Coastal now, Classic from January 2027) and, where the data covers it, Platinum Smart-Heat${R} Electric. Where the brands match, or Infratech leads, the sheet says so.`,
    ['p-s2-post', 'Tungsten Select Series II, black, on its single post. Product render.', 'contain', 'center'])}
  <div class="sec"><div class="hdr"><span class="lbl">THE COMPARISON · ONE ROW PER BENEFIT FIELD</span><span class="lbl r">NUMBERED SOURCES ON SHEET 02</span></div>
    ${legend}${table}
    <p class="fn">Facts as published by each brand on the dates shown; check current specifications before quoting. Bromic coverage figures are approximate and vary with model, height and site. ${REVIEW}.</p>
  </div>
  </div>
  ${strip('01', 'Bromic: Tungsten Series II and Platinum Electric product pages, manuals, recess kit instructions, warranty and Affinity pages · Infratech: series pages, FAQs, flush frame drawing, mounting, controls and warranty · Listed in full on sheet 02')}
</section>`;

const page2 = `<section class="page">
  <div class="grid"></div>${zones()}<div class="frame"></div><div class="flow f2">
  ${head('BROMIC VS INFRATECH · ON THE FLOOR', 'How To Talk About It On The Floor',
    'When a customer names Infratech, start with the space, then the heater. Use these lines as written.', null)}
  <div class="two">
    <div class="sec talkw"><div class="hdr"><span class="lbl">SIX FAIR LINES</span><span class="lbl r">NO PRICES · NO DISPARAGEMENT</span></div>${talk}</div>
    <div class="side">
      <figure class="ph"><div class="ph-img" style="background-image:url(img/p-s2-recess.jpg)"></div><figcaption><b>PHOTO</b> Tungsten Series II in its low-clearance recess kit. Product render.</figcaption></figure>
      ${ctlBox}${fairBox}
    </div>
  </div>
  ${openBox}
  ${sources}
  <div class="foot2"><p class="disc"><b>BEFORE YOU QUOTE</b> Facts as published by each brand on the dates shown; check current specifications before quoting. Installation by a licensed electrician to local code. <span class="rvm">${REVIEW}.</span></p>
  <a class="btn" href="https://www.bromic.com/design-your-space/">REQUEST YOUR DESIGN PLAN <span>→</span><em>BROMIC.COM/DESIGN-YOUR-SPACE</em></a></div>
  </div>
  ${strip('02', 'Numbered list above. Infratech facts from Infratech documents and dealer-hosted copies of them; Bromic facts from Bromic product pages, manuals and the Series II launch deck. No retail prices are used.')}
</section>`;

// ---------- styles ----------
const css = `
@font-face{font-family:BzDidot;src:url('${rel('app/src/fonts/gfs-didot-latin.woff2')}') format('woff2')}
@font-face{font-family:BzSans;src:url('${rel('app/src/fonts/arimo-latin.woff2')}') format('woff2')}
@font-face{font-family:BzMono;src:url('${rel('reports/themes/blueprint/fonts/plex-mono-400.woff2')}') format('woff2');font-weight:400}
@font-face{font-family:BzMono;src:url('${rel('reports/themes/blueprint/fonts/plex-mono-500.woff2')}') format('woff2');font-weight:500}
@page{size:Letter;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:BzSans,Arial,sans-serif;color:${T.ink};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:8.5in;height:11in;position:relative;overflow:hidden;margin:0 auto;background:#fff;break-after:page}
.page:last-child{break-after:auto}
.grid{position:absolute;inset:.42in;pointer-events:none;background-image:linear-gradient(rgba(28,43,68,.07) .6px,transparent .6px),linear-gradient(90deg,rgba(28,43,68,.07) .6px,transparent .6px),linear-gradient(rgba(28,43,68,.028) .5px,transparent .5px),linear-gradient(90deg,rgba(28,43,68,.028) .5px,transparent .5px);background-size:1in 1in,1in 1in,.125in .125in,.125in .125in}
.frame{position:absolute;inset:.42in;border:.9px solid ${T.draw};pointer-events:none}
.zones{position:absolute;inset:.3in;border:.5px solid ${T.steel};color:${T.steel};font:500 6px/1 BzMono,monospace;letter-spacing:.1em;pointer-events:none}
.zones .zt,.zones .zb{position:absolute;left:.12in;right:.12in;height:.12in}.zones .zt{top:0}.zones .zb{bottom:0}
.zones .zl,.zones .zr{position:absolute;top:.12in;bottom:.12in;width:.12in}.zones .zl{left:0}.zones .zr{right:0}
.zones span{position:absolute;transform:translate(-50%,-50%)}
.zones .zt span,.zones .zb span{top:50%}.zones .zl span,.zones .zr span{left:50%}
.lbl,.eyebrow{font:500 7.6px/1.2 BzMono,monospace;letter-spacing:.16em;text-transform:uppercase}
.eyebrow{color:${T.flame}}
h2{font-family:BzDidot,Didot,serif;font-weight:400;letter-spacing:-.005em}
.flow{position:absolute;left:.72in;right:.72in;top:.62in;bottom:.98in;display:flex;flex-direction:column;gap:10px}
.flow>*{flex:none}
.flow.f2{gap:8px}
.flow>.foot2{margin-top:auto}
.s-head{display:flex;gap:.3in;align-items:flex-start}
.s-text{flex:1}
.brand{display:flex;align-items:center;justify-content:space-between;border-bottom:.9px solid ${T.draw};padding-bottom:7px;margin-bottom:10px;color:${T.draw}}
.logo{height:15px;display:block}
.s-head h2{font-size:31px;line-height:1.08;margin:6px 0 7px;color:${T.ink}}
.s-lede{font-size:10px;line-height:1.5;color:#3f3b3c;max-width:5.4in}
.ph{border:.6px solid ${T.draw};padding:4px;background:#fff}
.ph.top{width:1.42in;flex:none}
.ph.top .ph-img{height:1.08in;background-color:#fff}
.ph-img{height:1.1in;background-size:cover;background-position:center;background-repeat:no-repeat}
.ph figcaption{display:block;font:400 6.6px/1.4 BzMono,monospace;letter-spacing:.04em;margin-top:4px;color:${T.steel}}
.ph figcaption b{font-weight:500;color:${T.flame};margin-right:4px;letter-spacing:.14em}
.hdr{display:flex;justify-content:space-between;border-bottom:.9px solid ${T.draw};padding-bottom:5px;margin-bottom:7px;color:${T.draw}}
.hdr .r{color:${T.flame}}
.legend{display:flex;align-items:center;gap:6px;margin:0 0 6px;flex-wrap:wrap}
.legend .lbl{color:${T.steel};margin-right:2px}
.legend .lk{font:400 6.6px/1.3 BzMono,monospace;color:${T.steel};letter-spacing:.02em;margin-left:4px}
.chip{display:inline-block;font:500 6.2px/1 BzMono,monospace;letter-spacing:.08em;text-transform:uppercase;padding:2.6px 4px 2.2px;border:.7px solid ${T.draw};color:${T.draw};background:#fff;white-space:nowrap}
.chip.b{background:${T.flame};border-color:${T.flame};color:#fff}
.chip.p{border-color:${T.draw};color:${T.draw}}
.chip.i{background:${T.draw};border-color:${T.draw};color:#fff}
.chip.m{border-style:dashed;color:${T.draw}}
.chip.u{border-style:dotted;color:${T.steel}}
.mx{width:100%;border-collapse:collapse;table-layout:fixed;font-size:7.9px;line-height:1.32;color:${T.ink}}
.mx th{font:500 6.4px/1.2 BzMono,monospace;letter-spacing:.12em;text-align:left;color:${T.steel};padding:0 8px 5px 0;border-bottom:.6px solid ${T.draw}}
.mx td{padding:3.7px 8px 3.7px 0;border-bottom:.5px solid ${T.hair};vertical-align:top}
.mx td.ser{font:500 7px/1.3 BzMono,monospace;letter-spacing:.06em;text-transform:uppercase;color:${T.draw}}
.mx td b{font-weight:700}
.mx td.inf{color:#3f3b3c}
.mx td.ed{padding-right:0}
.eg{display:flex;flex-direction:column;align-items:flex-start;gap:1.5px;margin-bottom:3px}
.eg .who{font:500 5.4px/1 BzMono,monospace;letter-spacing:.14em;color:${T.steel}}
.rf{font:500 5.6px/0 BzMono,monospace;color:${T.steel};margin-left:1px;letter-spacing:0}
.tc{color:${T.flame};font-style:italic}
.fn{font:400 6.7px/1.5 BzMono,monospace;color:${T.steel};margin-top:6px;letter-spacing:.01em}
.two{display:grid;grid-template-columns:1fr 2.28in;gap:.22in}
.talk{list-style:none;display:flex;flex-direction:column;gap:0}
.talk li{position:relative;padding:5px 0 5px 22px;border-bottom:.5px solid ${T.hair}}
.talk li:first-child{padding-top:1px}
.talk .no{position:absolute;left:0;top:6px;width:15px;height:15px;border-radius:50%;border:.8px solid ${T.flame};display:grid;place-items:center;font:500 7.4px/1 BzMono,monospace;color:${T.flame}}
.talk li:first-child .no{top:1px}
.talk p{font-size:8.3px;line-height:1.4}
.talk .q,.talk .a{display:grid;grid-template-columns:72px 1fr;align-items:baseline}
.talk b{font:500 6.2px/1 BzMono,monospace;letter-spacing:.12em;color:${T.steel}}
.talk .q{font-family:BzDidot,Didot,serif;font-size:11.8px;line-height:1.25;color:${T.ink};margin-bottom:2px}
.talk .a{color:#2f2b2c}
.talk .nt{padding-left:72px;font:400 6.8px/1.4 BzMono,monospace;color:${T.steel};margin-top:2px}
.side{display:flex;flex-direction:column;gap:9px}
.side .ph-img{height:.92in;background-color:#fff}
.box{border:.7px solid ${T.draw};padding:7px 9px 8px;background:#fff}
.bh{font:500 6.8px/1.2 BzMono,monospace;letter-spacing:.14em;color:${T.flame};margin-bottom:5px}
.ci{font-size:7.9px;line-height:1.38;color:#3f3b3c;margin-bottom:5px}
.ci b{display:block;color:${T.ink};font-size:8.2px}
.ci .sub{display:block;font:500 5.8px/1.5 BzMono,monospace;letter-spacing:.08em;color:${T.steel}}
.ci.last{margin:0;padding-top:5px;border-top:.5px solid ${T.hair}}
.rules{list-style:none}
.rules li{font-size:7.9px;line-height:1.38;color:#3f3b3c;padding-left:9px;position:relative;margin-bottom:3px}
.rules li:before{content:'';position:absolute;left:0;top:4.4px;width:4px;height:.8px;background:${T.flame}}
.sec.open .ol{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:2px 16px}
.ol li{font-size:7.3px;line-height:1.32;color:#3f3b3c;padding-left:11px;position:relative}
.ol li:before{content:'?';position:absolute;left:0;top:0;font:500 7px/1.36 BzMono,monospace;color:${T.flame}}
.src{list-style:none;columns:3;column-gap:14px}
.src li{font:400 5.7px/1.3 BzMono,monospace;color:${T.steel};break-inside:avoid;padding-left:12px;position:relative;margin-bottom:2px;letter-spacing:0}
.src .n{position:absolute;left:0;top:0;color:${T.draw};font-weight:500}
.src .u{color:${T.draw};word-break:break-all}
.foot2{display:flex;gap:.26in;align-items:center}
.disc{flex:1;font-size:7.8px;line-height:1.45;color:#3f3b3c;border-left:1.2px solid ${T.flame};padding-left:8px}
.disc b{font:500 6.6px BzMono,monospace;letter-spacing:.14em;color:${T.flame};margin-right:5px}
.disc .rvm{font:500 6.4px/1.4 BzMono,monospace;letter-spacing:.06em;color:${T.draw};text-transform:uppercase;display:block;margin-top:2px}
.btn{flex:none;display:inline-flex;flex-direction:row;flex-wrap:wrap;gap:4px 10px;align-items:center;border:.9px solid ${T.flame};color:${T.flame};font:500 7.6px/1 BzMono,monospace;letter-spacing:.16em;padding:7px 12px;text-decoration:none;background:#fff;max-width:2.4in}
.btn em{flex-basis:100%;font-style:normal;font-size:6px;letter-spacing:.12em;color:${T.steel}}
.strip{position:absolute;left:.42in;right:.42in;bottom:.42in;height:.48in;display:flex;border-top:.9px solid ${T.draw};font:400 7px/1.25 BzMono,monospace;color:${T.ink};background:#fff}
.strip .cell{padding:5px 7px;border-right:.5px solid ${T.hair};display:flex;flex-direction:column;justify-content:space-between;white-space:nowrap}
.strip .cell:last-child{border-right:0}
.strip .cell.grow{flex:1;white-space:normal}
.strip .cell.grow span{font-size:5.6px;line-height:1.3;color:${T.steel}}
.strip .cell.rv{white-space:normal;width:1.3in}
.strip .cell.rv span{font-size:5.6px;line-height:1.3;color:${T.flame}}
.strip b{font-weight:500;font-size:5.4px;letter-spacing:.16em;color:${T.steel}}
.strip .sheet span{font-size:15px;line-height:1;color:${T.draw}}
.strip .sheet i{font-style:normal;font-size:8px;color:${T.steel};margin-left:1px}
`;

const html = `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bromic vs Infratech</title><style>${css}</style></head><body>${page1}${page2}</body></html>`;

// ---------- render and print check ----------
(async () => {
  prepImages();
  fs.mkdirSync(path.join(HERE, 'pages'), { recursive: true });
  fs.writeFileSync(path.join(HERE, 'index.html'), html);
  const report = [];
  const words = html.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<[^>]+>/g, ' ');
  if (/\$/.test(words)) report.push('a "$" appears');
  if (/\[\[/.test(words) || /VERIFY/.test(words)) report.push('a raw [[VERIFY appears');
  if (/coming soon/i.test(words)) report.push('"coming soon" appears');
  if (/optional/i.test(words)) report.push('"optional" appears');
  if (/—/.test(words)) report.push('long dash in copy');
  if (/!/.test(words)) report.push('exclamation mark');
  if (/shallowest|lowest clearance/i.test(words)) report.push('a claim the claim check bars');
  if (/\bthe only 6 kW low-clearance recess option\b/i.test(words)) report.push('the unqualified recess claim');
  if (!/sold separately/i.test(words)) report.push('the Wi-Fi/app line is missing');
  if (!words.includes('After 4 hours of continuous use, a 15 minute cool down period is recommended')) report.push('flush-frame quote not exact');
  if (!words.includes('Facts as published by each brand on the dates shown; check current specifications before quoting.')) report.push('dates line missing');
  if ((words.match(/Specification and compliance review required before external use/g) || []).length < 2) report.push('review mark not on both pages');
  if (/(src=["']?|url\()[^"')]*infratech/i.test(html)) report.push('an Infratech image is referenced');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(HERE, 'index.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const qa = await page.evaluate(() => {
    const out = [];
    const hit = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    document.querySelectorAll('.page').forEach((pgEl, n) => {
      const pg = pgEl.getBoundingClientRect();
      const frame = { left: pg.left + 40, right: pg.right - 40, top: pg.top + 40, bottom: pg.bottom - 40 };
      const stripTop = pgEl.querySelector('.strip').getBoundingClientRect().top;
      pgEl.querySelectorAll('p, h2, li, td, th, figcaption, .btn, .chip').forEach((el) => {
        const r = el.getBoundingClientRect(); if (!r.width) return;
        const t = el.textContent.trim().slice(0, 40);
        if (r.left < frame.left - 1 || r.right > frame.right + 1 || r.top < frame.top - 1) out.push(`p${n + 1} off frame: "${t}"`);
        if (!el.closest('.strip') && r.bottom > stripTop - 2) out.push(`p${n + 1} runs into the title strip: "${t}"`);
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') out.push(`p${n + 1} clipped: "${t}"`);
      });
      pgEl.querySelectorAll('.strip .cell').forEach((c) => { if (c.scrollHeight > c.clientHeight + 1 || c.scrollWidth > c.clientWidth + 1) out.push(`p${n + 1} strip cell overflows: "${c.textContent.trim().slice(0, 30)}"`); });
      const fl = pgEl.querySelector('.flow');
      if (fl.scrollHeight > fl.clientHeight + 1) out.push(`p${n + 1} content is ${fl.scrollHeight - fl.clientHeight}px taller than the sheet`);
      const kids = [...fl.children].map((e) => ({ e, r: e.getBoundingClientRect() }));
      for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) if (hit(kids[i].r, kids[j].r) > 4) out.push(`p${n + 1} blocks overlap: ${kids[i].e.className} / ${kids[j].e.className}`);
      // chips inside the edge column
      pgEl.querySelectorAll('td.ed').forEach((td) => { const tr = td.getBoundingClientRect(); td.querySelectorAll('.chip').forEach((c) => { const r = c.getBoundingClientRect(); if (r.right > tr.right + 1) out.push(`p${n + 1} chip wider than its column`); }); });
    });
    const bg = [...document.querySelectorAll('.ph-img')].map((d) => getComputedStyle(d).backgroundImage.slice(5, -2));
    document.querySelectorAll('img').forEach((im) => { if (!im.naturalWidth) out.push('missing image ' + im.src); });
    return { out, bg, pages: document.querySelectorAll('.page').length };
  });
  for (const u of qa.bg) {
    const ok = await page.evaluate((u) => new Promise((res) => { const i = new Image(); i.onload = () => res(i.naturalWidth); i.onerror = () => res(0); i.src = u; }), u);
    if (!ok) qa.out.push('missing photo ' + u);
  }
  report.push(...qa.out);
  if (qa.pages !== 2) report.push(`${qa.pages} pages`);
  const secs = await page.$$('.page');
  for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: path.join(HERE, 'pages', `p${i + 1}.png`) });
  const pdf = path.join(HERE, 'Bromic-vs-Infratech.pdf');
  await page.pdf({ path: pdf, format: 'Letter', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  const size = fs.statSync(pdf).size;
  if (size > 2 * 1024 * 1024) report.push(`PDF is ${(size / 1048576).toFixed(2)} MB`);
  const pdfPages = (fs.readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pdfPages !== 2) report.push(`PDF has ${pdfPages} pages`);

  fs.writeFileSync(path.join(HERE, 'meta.json'), JSON.stringify({
    title: 'Bromic vs Infratech',
    kicker: 'Retail kit · competitive sheet',
    desc: 'Two US Letter sheets for floor staff and buyers: Tungsten Series II and Platinum Electric against Infratech across twelve benefit fields, with fair talk lines, controls and numbered sources. Specification and compliance review required before external use.',
    pdf: repoRel('Bromic-vs-Infratech.pdf'),
    cover: repoRel('pages/p1.png'),
  }, null, 1) + '\n');
  const txt = `Print check, ${new Date().toISOString().slice(0, 10)}\n` + (report.length ? report.join('\n')
    : `clean: two Letter pages, no text off the frame or into the title strip, no overlapping blocks, all images load, no "$", no raw VERIFY, no "coming soon", exact flush-frame quote, review mark on both pages, PDF ${(size / 1024).toFixed(0)} KB`) + '\n';
  fs.writeFileSync(path.join(HERE, 'print-check.txt'), txt);
  console.log(txt);
})().catch((e) => { console.error(e); process.exit(1); });
