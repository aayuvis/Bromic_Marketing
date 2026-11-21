// Portfolio By Application: a 6-page US Letter retail brochure in the Editorial Lookbook theme
// (reports/themes/editorial). Which Bromic heater goes where, with its controls, and who it sells to.
// Facts only from data/retail/retail.json, data/product-facts.json and data/product-marketing/*.json;
// open [[VERIFY]] facts are left out or shown as "To confirm". No prices.
// Run: node reports/retail/portfolio-applications/build.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '../../..');
const rel = (p) => path.relative(HERE, path.join(ROOT, p)).split(path.sep).join('/');

// ---------- images: every one downscaled to <= 2000 px, JPEG q82 (prep.py) ----------
const lib = (id) => `images/library/${id}.webp`;
const SRC = {
  cover: [lib('l-001-000'), 2000],
  p3hero: [lib('l-006-028'), 2000],
  p3a: [lib('w-connecticut-privateresidence-tungstenelectri-3'), 1000],
  p3b: [lib('w-dsc05737-courtney-saib'), 1000],
  p3c: [lib('w-platinumelectricflushmountedw-lowclearancere'), 1000],
  p4hero: [lib('l-014-122'), 2000],
  p4a: [lib('l-010-071'), 1000],
  p4b: [lib('l-013-102'), 1000],
  p4c: [lib('l-005-022'), 1000],
  p5hero: [lib('l-016-131'), 2000],
  p5a: [lib('l-018-151'), 1000],
  p5b: [lib('w-tungsten-gas-500-fiddler-sydney-2-1'), 1000],
  p5c: [lib('w-platinum-electric-del-friscos-century-city-2'), 1000],
  p6hero: [lib('l-019-163'), 2000],
  t_ts2: ['decks/product-renders/Tungsten-Series-II-Select-black-endcap.jpg', 700],
  t_pe: ['images/portfolio/platinum-electric.webp', 700],
  t_ee: ['images/portfolio/eclipse-pendant.webp', 700],
  t_ef: ['images/portfolio/eclipse-freestanding.webp', 700],
  t_pg: ['images/portfolio/platinum-gas.webp', 700],
  t_tg: ['images/portfolio/tungsten-gas.webp', 700],
  t_tfg: ['images/portfolio/tungsten-freestanding-gas.webp', 700],
};
execFileSync('python3', [path.join(HERE, 'prep.py'), JSON.stringify(SRC)], { stdio: 'inherit' });
const img = (k) => `img/${k}.jpg`;
const bg = (k, pos = '50% 50%') => `background-image:url('${img(k)}');background-position:${pos}`;

// ---------- the theme's CSS (reports/themes/editorial/build.js), extended for this brochure ----------
const css = `
@font-face { font-family: 'Didot'; src: url('${rel('app/src/fonts/gfs-didot-latin.woff2')}') format('woff2'); }
@font-face { font-family: 'Arimo'; src: url('${rel('app/src/fonts/arimo-latin.woff2')}') format('woff2'); }
:root { --ink: #231F20; --steel: #6E7377; --mist: #A7ABAE; --rule: #D9DBDC; --flame: #EF4123; --paper: #FFFFFF;
  --m: 0.5in; --gap: 0.18in; }
@page { size: 8.5in 11in; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--paper); }
body { font-family: 'Arimo', 'Helvetica Neue', Arial, sans-serif; font-weight: 400; color: var(--ink);
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 8.5in; height: 11in; position: relative; overflow: hidden; background: var(--paper); page-break-after: always; }
.page:last-child { page-break-after: auto; }
.photo { position: absolute; background-size: cover; background-repeat: no-repeat; }
.didot { font-family: 'Didot', 'Bodoni 72', serif; font-weight: 400; }
.label { font-size: 7.5pt; letter-spacing: 0.22em; text-transform: uppercase; color: var(--flame); }
.caption { font-size: 7.4pt; line-height: 1.45; color: var(--steel); letter-spacing: 0.04em; }
.caption b { font-variant: small-caps; text-transform: lowercase; letter-spacing: 0.1em; font-weight: 400; color: var(--ink); }
p { font-size: 9.2pt; line-height: 1.58; color: #3a3637; hyphens: manual; }
.tc { color: var(--flame); font-size: 6.6pt; letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap; }

.folio { position: absolute; left: var(--m); right: var(--m); bottom: 0.34in; display: flex; justify-content: space-between;
  align-items: baseline; font-size: 6.8pt; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel);
  border-top: 0.5pt solid var(--rule); padding-top: 7pt; }
.folio .n { font-family: 'Didot', serif; font-size: 10pt; letter-spacing: 0; color: var(--ink); }
.folio.light { color: rgba(255,255,255,.85); border-color: rgba(255,255,255,.35); }
.folio.light .n { color: #fff; }

/* ---------- 1 cover ---------- */
.p1 .photo { inset: 0; background-position: 50% 50%; }
.p1 .shade { position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(20,18,19,.66) 0%, rgba(20,18,19,.5) 28%, rgba(20,18,19,.28) 42%, rgba(20,18,19,0) 54%, rgba(20,18,19,.3) 64%, rgba(20,18,19,.72) 77%, rgba(20,18,19,.9) 100%); }
.p1 .mast { position: absolute; top: 0.46in; left: var(--m); right: var(--m); display: flex; justify-content: space-between; align-items: center; }
.p1 .mast img { height: 0.30in; }
.p1 .mast .label { color: #fff; opacity: .92; }
.p1 .mast .label i { font-style: normal; color: var(--flame); }
.p1 .kicker { position: absolute; top: 1.32in; left: var(--m); display: flex; align-items: center; gap: 10pt; }
.p1 .kicker::before { content: ''; width: 28pt; height: 1.2pt; background: var(--flame); }
.p1 .kicker span { color: #fff; }
.p1 h1 { position: absolute; top: 1.58in; left: calc(var(--m) - 3pt); width: 7.4in; color: #fff;
  font-size: 76pt; line-height: 0.9; letter-spacing: -0.012em; text-shadow: 0 1px 24px rgba(0,0,0,.2); }
.p1 .deck { position: absolute; bottom: 2.36in; left: var(--m); width: 4.9in; color: #fff; font-family: 'Didot', serif;
  font-size: 15pt; line-height: 1.3; font-style: italic; text-shadow: 0 1px 14px rgba(0,0,0,.25); }
.p1 .cap { position: absolute; right: var(--m); width: 1.9in; text-align: right; line-height: 1.45; bottom: 2.4in; color: rgba(255,255,255,.78); font-size: 7pt; letter-spacing: 0.05em; }
.p1 .cap b { font-variant: small-caps; text-transform: lowercase; letter-spacing: 0.1em; font-weight: 400; color: #fff; }
.p1 .lines { position: absolute; left: var(--m); right: var(--m); bottom: 0.88in; display: grid;
  grid-template-columns: repeat(3, 1fr); gap: var(--gap); }
.p1 .lines div { border-top: 0.6pt solid rgba(255,255,255,.5); padding-top: 8pt; color: #fff; }
.p1 .lines .no { font-family: 'Didot', serif; font-size: 22pt; line-height: 1; display: block; margin-bottom: 5pt; }
.p1 .lines .t { font-size: 8pt; letter-spacing: 0.16em; text-transform: uppercase; display: block; margin-bottom: 4pt; }
.p1 .lines .d { font-size: 8.4pt; line-height: 1.45; color: rgba(255,255,255,.85); }

/* ---------- 2 the portfolio at a glance ---------- */
.p2 .head { position: absolute; top: 0.6in; left: var(--m); right: var(--m); display: grid; grid-template-columns: 4.55in 1fr; gap: 0.35in; align-items: end; }
.p2 .head .label { display: block; margin-bottom: 11pt; }
.p2 h2 { font-size: 31pt; line-height: 0.98; letter-spacing: -0.008em; }
.p2 .head p { font-size: 8.4pt; line-height: 1.55; }
.p2 .mx { position: absolute; top: 1.98in; left: var(--m); right: var(--m); border-collapse: collapse; table-layout: fixed; width: 7.5in; }
.p2 .mx col.app { width: 1.72in; }
.p2 .mx th, .p2 .mx td { vertical-align: middle; text-align: center; font-weight: 400; }
.p2 .mx thead th { vertical-align: bottom; padding: 0 3pt 7pt; border-bottom: 0.8pt solid var(--ink); }
.p2 .mx thead th.app { text-align: left; padding-left: 0; }
.p2 .tile { width: 100%; height: 0.66in; background-size: cover; background-position: 50% 50%; margin-bottom: 6pt; }
.p2 .coll { display: block; font-size: 6.2pt; letter-spacing: 0.2em; color: var(--steel); text-transform: uppercase; }
.p2 .nm { display: block; font-family: 'Didot', serif; font-size: 10pt; line-height: 1.05; margin-top: 2pt; min-height: 2.1em; }
.p2 .mx tbody th { text-align: left; padding: 0 6pt 0 0; font-size: 8pt; line-height: 1.25; color: var(--ink); }
.p2 .mx tbody th small { display: block; font-size: 6.2pt; letter-spacing: 0.16em; text-transform: uppercase; color: var(--mist); margin-top: 1.5pt; }
.p2 .mx tbody tr { height: 0.405in; }
.p2 .mx tbody td, .p2 .mx tbody th { border-bottom: 0.5pt solid var(--rule); }
.p2 .mx tbody td:nth-child(even) { background: #FAFAFA; }
.p2 .dot { display: inline-block; width: 8pt; height: 8pt; border-radius: 50%; background: var(--ink); vertical-align: middle; }
.p2 .ring { display: inline-block; width: 8pt; height: 8pt; border-radius: 50%; border: 0.8pt solid var(--ink); vertical-align: middle; }
.p2 .note { display: block; font-size: 5.9pt; line-height: 1.15; color: var(--steel); margin-top: 2pt; letter-spacing: 0.02em; }
.p2 .mx tfoot th { text-align: left; font-size: 6.4pt; letter-spacing: 0.18em; text-transform: uppercase; color: var(--flame); padding: 6pt 6pt 6pt 0; vertical-align: top; }
.p2 .mx tfoot td { font-size: 6.7pt; line-height: 1.35; color: #3a3637; padding: 6pt 3pt; vertical-align: top; }
.p2 .mx tfoot tr:first-child th, .p2 .mx tfoot tr:first-child td { border-top: 0.8pt solid var(--ink); }
.p2 .mx tfoot tr + tr th, .p2 .mx tfoot tr + tr td { border-top: 0.5pt solid var(--rule); }
.p2 .mx tfoot tr.ctl td { color: var(--ink); }
.p2 .legend { position: absolute; left: var(--m); right: var(--m); top: 9.1in; display: grid; grid-template-columns: 1.72in 1fr; gap: 0; align-items: start;
  border-top: 0.5pt solid var(--rule); padding-top: 8pt; }
.p2 .legend .keys { font-size: 7.2pt; color: var(--ink); line-height: 1.9; }
.p2 .legend .keys span { margin-right: 4pt; }
.p2 .legend p { font-size: 7.4pt; line-height: 1.5; color: var(--steel); }

/* ---------- 3 & 5 application pages: hero on top, three spaces below ---------- */
.app .hero { top: 0; left: 0; width: 8.5in; height: 3.42in; }
.app .herocap { position: absolute; top: 3.51in; right: var(--m); width: 3.2in; text-align: right; }
.app .head { position: absolute; top: 3.54in; left: var(--m); width: 4.1in; }
.app .head .label { display: block; margin-bottom: 8pt; }
.app h2 { font-size: 30pt; line-height: 0.98; letter-spacing: -0.008em; }
.app .lede { position: absolute; top: 3.96in; right: var(--m); width: 3.2in; font-size: 8.6pt; line-height: 1.55; }
.app .cols { position: absolute; top: 4.88in; left: var(--m); right: var(--m); display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.24in; }
.sp .thumb { height: 1.06in; background-size: cover; position: relative; }
.sp .no { font-family: 'Didot', serif; font-size: 20pt; line-height: 1; display: block; margin: 7pt 0 1pt; }
.sp h3 { font-family: 'Didot', serif; font-weight: 400; font-size: 14pt; line-height: 1.05; margin-bottom: 6pt; min-height: 2.1em; }
.sp .pick { font-size: 6.8pt; letter-spacing: 0.18em; text-transform: uppercase; color: var(--flame); display: block; margin-bottom: 3pt; }
.sp .series { font-size: 8.2pt; line-height: 1.33; color: var(--ink); margin-bottom: 4pt; }
.sp .why { font-size: 7.6pt; line-height: 1.45; color: #3a3637; margin-bottom: 6pt; }
.sp dl { border-top: 0.5pt solid var(--ink); }
.sp dl div { display: grid; grid-template-columns: 0.62in 1fr; gap: 6pt; padding: 3.4pt 0; border-bottom: 0.5pt solid var(--rule); }
.sp dt { font-size: 6.2pt; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink); padding-top: 1.2pt; }
.sp dd { font-size: 7.2pt; line-height: 1.36; color: #3a3637; }
.sp .sell { margin-top: 6pt; padding-left: 8pt; border-left: 1.2pt solid var(--flame); font-size: 7.6pt; line-height: 1.45; color: var(--ink); }
.sp .sell b { display: block; font-weight: 400; font-size: 6.2pt; letter-spacing: 0.18em; text-transform: uppercase; color: var(--flame); margin-bottom: 1.5pt; }
.thumb .tcap { position: absolute; left: 0; right: 0; bottom: 0; padding: 10pt 6pt 4pt; font-size: 6pt; letter-spacing: 0.06em; color: rgba(255,255,255,.92);
  background: linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.72)); }

/* ---------- 4 application page: tall photo left, three spaces stacked right ---------- */
.p4 .hero { top: 0; left: 0; width: 3.05in; height: 11in; }
.p4 .herocap { position: absolute; left: 0.22in; width: 2.6in; bottom: 0.36in; color: rgba(255,255,255,.88); }
.p4 .herocap b { color: #fff; }
.p4 .side { position: absolute; top: 0.52in; left: 3.42in; right: var(--m); }
.p4 .side .label { display: block; margin-bottom: 9pt; }
.p4 h2 { font-size: 25pt; white-space: nowrap; line-height: 0.98; letter-spacing: -0.008em; margin-bottom: 9pt; }
.p4 .side > p { font-size: 8.4pt; line-height: 1.5; }
.p4 .stack { position: absolute; top: 1.84in; left: 3.42in; right: var(--m); }
.p4 .sp { display: grid; grid-template-columns: 1.15in 1fr; gap: 0.16in; padding: 6pt 0 6pt; border-top: 0.5pt solid var(--ink); }
.p4 .sp + .sp { margin-top: 2pt; }
.p4 .sp .thumb { height: 1.5in; margin-top: 4pt; }
.p4 .sp .no { display: none; }
.p4 .sp h3 { min-height: 0; margin-bottom: 4pt; }
.p4 .sp dl { border-top: 0.5pt solid var(--rule); }
.p4 .sp dl div { grid-template-columns: 0.66in 1fr; padding: 3.4pt 0; }
.p4 .sp .sell { margin-top: 6pt; }
.p4 .folio { left: 3.42in; }

/* ---------- 6 how to choose ---------- */
.p6 .hero { top: 0; right: 0; width: 3.35in; height: 4.45in; }
.p6 .herocap { position: absolute; top: 4.53in; right: var(--m); width: 2.85in; }
.p6 .head { position: absolute; top: 0.6in; left: var(--m); width: 3.9in; }
.p6 .head .label { display: block; margin-bottom: 11pt; }
.p6 h2 { font-size: 34pt; line-height: 0.98; letter-spacing: -0.008em; margin-bottom: 12pt; }
.p6 .qs { position: absolute; top: 2.42in; left: var(--m); width: 4.3in; }
.p6 .q { display: grid; grid-template-columns: 0.42in 1fr; gap: 6pt; padding: 8pt 0 9pt; border-top: 0.5pt solid var(--ink); }
.p6 .q .no { font-family: 'Didot', serif; font-size: 24pt; line-height: 0.95; }
.p6 .q h3 { font-family: 'Didot', serif; font-weight: 400; font-size: 15pt; line-height: 1.1; margin-bottom: 4pt; }
.p6 .q ul { list-style: none; }
.p6 .q li { font-size: 8.3pt; line-height: 1.45; color: #3a3637; padding: 1.6pt 0 1.6pt 11pt; position: relative; }
.p6 .q li::before { content: ''; position: absolute; left: 0; top: 6pt; width: 6pt; height: 1pt; background: var(--flame); }
.p6 .q li b { font-weight: 400; color: var(--ink); }
.p6 .then { position: absolute; top: 7.76in; left: var(--m); right: var(--m); display: grid; grid-template-columns: 1fr 1fr; gap: 0.3in;
  border-top: 0.5pt solid var(--rule); padding-top: 9pt; }
.p6 .then h4 { font-family: 'Didot', serif; font-weight: 400; font-size: 13pt; margin-bottom: 4pt; }
.p6 .then p { font-size: 8.2pt; line-height: 1.5; }
.p6 .cta { position: absolute; top: 4.98in; left: 5.08in; right: var(--m); border-top: 1.2pt solid var(--flame); padding-top: 11pt; }
.p6 .cta .q2 { font-family: 'Didot', serif; font-size: 17pt; line-height: 1.08; margin: 6pt 0 8pt; }
.p6 .cta p { font-size: 8.2pt; line-height: 1.5; }
.p6 .cta .btn { display: inline-block; margin-top: 10pt; background: var(--ink); color: #fff; font-size: 7.2pt; letter-spacing: 0.22em;
  text-transform: uppercase; padding: 9pt 14pt; }
.p6 .cta .contact { margin-top: 9pt; font-size: 7.6pt; line-height: 1.55; color: var(--ink); }
.p6 .fine { position: absolute; left: var(--m); right: var(--m); top: 8.92in; display: grid; grid-template-columns: 1fr 1fr; gap: 0.3in;
  border-top: 0.5pt solid var(--rule); padding-top: 7pt; }
.p6 .fine p { font-size: 6.3pt; line-height: 1.45; color: var(--steel); }
`;

const folio = (n, light = false) => `
  <div class="folio${light ? ' light' : ''}">${n % 2 === 0
    ? `<span class="n">${n}</span><span>Portfolio By Application</span><span>Bromic Heating · For Retail Partners</span>`
    : `<span>Bromic Heating · For Retail Partners</span><span>Portfolio By Application</span><span class="n">${n}</span>`}</div>`;

// ---------- page 2 matrix ----------
const COLS = [
  { k: 't_ts2', pos: '30% 50%', coll: 'Tungsten', nm: 'Electric Series II' },
  { k: 't_pe', pos: '30% 50%', coll: 'Platinum', nm: 'Electric' },
  { k: 't_ee', pos: '50% 50%', coll: 'Eclipse', nm: 'Electric Pendant' },
  { k: 't_ef', pos: '50% 55%', coll: 'Eclipse', nm: 'Freestanding' },
  { k: 't_pg', pos: '55% 50%', coll: 'Platinum', nm: 'Gas' },
  { k: 't_tg', pos: '50% 50%', coll: 'Tungsten', nm: 'Gas, Mounted' },
  { k: 't_tfg', pos: '20% 40%', coll: 'Tungsten', nm: 'Freestanding Gas' },
];
// [space, page, {colIndex: [mark, note]}]; ● show first, ○ also fits
const D = 'dot', R = 'ring';
const ROWS = [
  ['Covered patio or porch', 3, { 0: [D, 'Select'], 1: [R], 4: [R], 5: [D, 'Wall or ceiling'] }],
  ['Pergola', 3, { 0: [D, 'Single post'], 4: [R], 5: [R, 'Beam or pole'] }],
  ['Pitched porch or gable', 3, { 0: [D, 'Pitched adaptor'], 5: [R, 'Ceiling pole'] }],
  ['Shallow ceiling, flush look', 3, { 0: [D, '7.5 in cavity'], 1: [D, '7.1 in cavity'] }],
  ['Design-led outdoor room', 4, { 1: [D], 2: [R], 4: [R] }],
  ['Over the dining table', 4, { 2: [D, 'Heat and light'] }],
  ['Coastal home', 4, { 0: [D, 'Coastal'], 1: [D, 'Marine'] }],
  ['Open lawn, poolside, no roof', 5, { 3: [D, 'Plug-in'], 6: [D, 'Propane or NG'] }],
  ['Restaurant dining and bar', 5, { 1: [R, 'Drop poles'], 2: [D, 'Pendant or wall'], 4: [D], 5: [D], 6: [R, 'Sidewalk'] }],
  ['Rooftop or commercial terrace', 5, { 0: [D, '277 V'], 1: [R, 'Drop poles'], 3: [R], 4: [D, 'Rooftop bar'], 6: [R] }],
];
const FOOT = [
  ['Heat area', ['About 64–144 ft²', '65–143 ft²', 'Up to 121 ft²', 'Up to 121 ft²', '160 or 215 ft²', '160 or 215 ft²', 'About 215 ft²']],
  ['Power', ['2–6 kW; 208, 240 or 277 V', '2300–4500 W; 208 or 220–240 V', '2,900 W; 208 or 220–240 V', '2,900 W; 220–240 V, plugs in', 'Natural gas or propane', 'Natural gas or propane', 'Propane or natural gas']],
  ['Controls to quote', [
    'Affinity Dimmer or On/Off, and a wall switch',
    'Affinity Dimmer or On/Off, and a wall switch',
    'Affinity Eclipse Controller or Eclipse Dimmer Controller, and a wall switch',
    'Eclipse Dimmer Controller and remote, included',
    'Affinity On/Off or a manual wall switch',
    'Affinity On/Off <span class="tc">To confirm</span> or a manual wall switch',
    'Set at its own knob; not on the app']],
];
const matrix = `
<table class="mx">
  <colgroup><col class="app">${COLS.map(() => '<col>').join('')}</colgroup>
  <thead><tr><th class="app"><span class="label">The space</span></th>${COLS.map((c) =>
    `<th><div class="tile" style="${bg(c.k, c.pos)}"></div><span class="coll">${c.coll}</span><span class="nm">${c.nm}</span></th>`).join('')}</tr></thead>
  <tbody>${ROWS.map(([s, pg, cells]) => `<tr><th>${s}<small>Page ${pg}</small></th>${COLS.map((_, i) => {
    const c = cells[i];
    return c ? `<td><span class="${c[0]}"></span>${c[1] ? `<span class="note">${c[1]}</span>` : ''}</td>` : '<td></td>';
  }).join('')}</tr>`).join('')}</tbody>
  <tfoot>${FOOT.map(([h, v], i) => `<tr${i === 2 ? ' class="ctl"' : ''}><th>${h}</th>${v.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tfoot>
</table>`;

// ---------- application blocks ----------
const space = (s) => `
  <div class="sp">
    <div class="thumb photo-in" style="${bg(s.img, s.pos || '50% 50%')};background-size:cover">${s.tcap ? `<span class="tcap">${s.tcap}</span>` : ''}</div>
    <div>
      <span class="no">${s.no}</span>
      <h3>${s.title}</h3>
      <span class="pick">Show first</span>
      <div class="series">${s.series}</div>
      <div class="why">${s.why}</div>
      <dl>${s.rows.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
      <div class="sell"><b>Sell it to</b>${s.sell}</div>
    </div>
  </div>`;

const P3 = [
  { no: '01', img: 'p3a', pos: '50% 35%', tcap: 'Tungsten Smart-Heat® Electric, porch ceiling', title: 'Covered Patio Or Porch',
    series: 'Tungsten Select (Series II) <span class="tc">Coming soon</span><br>Tungsten Classic from January 2027',
    why: 'About 14% narrower and a third lighter than Series I, in black, white or graphite, with the Diamond front or an oval or triangle front, sold separately.',
    rows: [['Mounting', 'Wall or ceiling, on a wall bracket or the single post'], ['With gas', 'Tungsten Gas, mounted: 160 or 215 ft², natural gas or propane'], ['Controls', 'Affinity Smart-Heat® Dimmer, or On/Off where dimming is not wanted, and a manual wall switch']],
    sell: 'Homeowners finishing a covered patio or porch, and the builders who bring them in – at outdoor-living stores and patio dealers.' },
  { no: '02', img: 'p3b', pos: '50% 30%', tcap: 'Tungsten Smart-Heat® Electric, vaulted porch', title: 'Pergola Or Pitched Ceiling',
    series: 'Tungsten Series II with the Pitched-Ceiling Adaptor',
    why: 'Mounts on a vaulted porch or gable from 3/12 to 12/12, and drops from a pergola beam on its single post, with no visible junction box.',
    rows: [['Mounting', 'Pitched-Ceiling Adaptor (3/12 to 12/12); single post; Mounting Bracket'], ['With gas', 'Tungsten Gas on a ceiling pole, for covered areas'], ['Controls', 'Affinity Smart-Heat® Dimmer or On/Off, and a manual wall switch']],
    sell: 'Homeowners with a vaulted porch or a new pergola, and the installers who fit them – at pergola and patio-cover dealers.' },
  { no: '03', img: 'p3c', pos: '50% 40%', tcap: 'Platinum Smart-Heat® Electric, low-clearance recess', title: 'Shallow Ceiling, Flush Look',
    series: 'Tungsten Select or Coastal, Low-Clearance Recess Kit<br>Platinum Electric, Low-Clearance Recess Kit',
    why: 'Tungsten recesses 6 kW into a 7.5 in cavity, fan-ventilated, with the recess box supplied. Platinum sits flush in 7.1 in, with a cooling fan built in.',
    rows: [['Mounting', 'Recessed flush; recess box supplied with each kit'], ['With gas', 'Gas heaters are not recessed'], ['Controls', 'Affinity Smart-Heat® Dimmer and a manual wall switch']],
    sell: 'Homeowners who want the heater to disappear into the ceiling, with their builders and electricians – at showrooms and outdoor-living stores.' },
];
const P4 = [
  { no: '04', img: 'p4a', pos: '50% 30%', title: 'Design-Led Outdoor Room',
    series: 'Platinum Smart-Heat® Electric<br>Platinum Smart-Heat® Gas, where there is a gas line',
    why: 'A tinted glass-ceramic face in a 304 stainless body just 2.1 in deep, black or white, over 65, 108 or 143 ft² a heater. Platinum Gas sits behind a ceramic-glass screen, in black or stainless. For 6 kW or 277 V, move to Tungsten Series II.',
    rows: [['Mounting', 'Standard or low-clearance recess kit; 8 in pole and wall bracket included'], ['Controls', 'Affinity Smart-Heat® Dimmer (1% steps) or On/Off, and a manual wall switch; gas on Affinity On/Off or a wall switch']],
    sell: 'Homeowners building a California room or outdoor kitchen, with their architects and interior designers – at design showrooms.' },
  { no: '05', img: 'p4b', pos: '40% 50%', title: 'Over The Dining Table',
    series: 'Eclipse Smart-Heat® Electric, pendant',
    why: 'Radiant heat and a warm, dimmable 3000K LED ring in one fixture, so the table stays warm and softly lit from sunset to the last glass: 2,900 W in three settings, over up to 121 ft².',
    rows: [['Mounting', '24 in twin pole included, or a straight, curved or wall pole; head at least 8 ft up, under cover where possible'], ['Controls', 'Affinity Smart-Heat® Eclipse Controller or the Eclipse Dimmer Controller with remote, and a manual wall switch']],
    sell: 'Homeowners who entertain at the table, and the designers who light their terraces – at lighting and design showrooms.' },
  { no: '06', img: 'p4c', pos: '50% 40%', title: 'Coastal Home',
    series: 'Tungsten Coastal <span class="tc">Coming soon</span><br>Platinum Smart-Heat® Electric Marine',
    why: 'Tungsten Coastal adds a corrosion-resistant coating over 316 marine-grade stainless, in black or white, with a marine-grade low-clearance recess kit. Platinum Electric Marine is AISI 316 stainless, IPX5. Coastal is for homes by the water, never for boats.',
    rows: [['Mounting', 'Recessed, ceiling, wall or single post'], ['Controls', 'Affinity Smart-Heat® Dimmer and a manual wall switch']],
    sell: 'Homeowners by the ocean, a lake or a bay, and their builders – at coastal outdoor-living and patio stores.' },
];
const P5 = [
  { no: '07', img: 'p5a', pos: '45% 50%', tcap: 'Tungsten Smart-Heat® Freestanding Gas, pool terrace', title: 'Open Lawn, Poolside, No Roof',
    series: 'Eclipse Smart-Heat® Freestanding<br>Tungsten Smart-Heat® Freestanding Gas',
    why: 'Eclipse arches heat and light over the sofa from a weighted base on two wheels. The Tungsten tower runs on a 20 lb propane cylinder in its base or a 10 ft natural gas quick-connect, with a tilting head.',
    rows: [['Placing', 'Eclipse plugs into an IP54 outdoor outlet (220–240 V), 79 in minimum clearance; one freestanding heater for every 4 seats at most'], ['Controls', 'Eclipse Dimmer Controller and remote, included; the Tungsten tower is set at its own knob and is not on the app']],
    sell: 'Homeowners with a pool deck, lawn or open terrace – at BBQ, patio and pool stores.' },
  { no: '08', img: 'p5b', pos: '50% 50%', tcap: 'Tungsten Smart-Heat® Gas, pub terrace', title: 'Restaurant Dining And Bar',
    series: 'Tungsten Gas or Platinum Gas, mounted<br>Eclipse Smart-Heat® Electric over the tables',
    why: 'Under a roof with a gas line, compact Tungsten Gas heads go on beams or drop poles and switch by zone; Platinum Gas brings its ceramic-glass screen to the front of house. Eclipse reaches out from the façade on its wall pole.',
    rows: [['Mounting', 'Mounted gas under cover, at least 8 ft above the floor; ceiling poles hold two heaters back to back'], ['Controls', 'Affinity On/Off, up to 10 gas heaters a channel, or a manual wall switch; Eclipse on the Affinity Eclipse Controller. Tungsten Gas on Affinity <span class="tc">To confirm</span>']],
    sell: 'Restaurant, bar and hotel owners, and the contractors who fit out their terraces – through commercial and hospitality dealers.' },
  { no: '09', img: 'p5c', pos: '50% 40%', tcap: 'Platinum Smart-Heat® Electric, drop poles', title: 'Rooftop Or Commercial Terrace',
    series: 'Tungsten Select on 208, 240 or 277 V<br>Platinum Electric on drop poles',
    why: 'Tungsten Select is engineered for the supply in commercial buildings, up to 6 kW at 208, 240 or 277 V (2 kW is 240 V only). Platinum Electric hangs on drop poles to the right height under a high ceiling.',
    rows: [['With gas', 'Platinum Gas for a rooftop bar, on beams, walls or pole pairs'], ['Controls', 'Affinity Smart-Heat® Dimmer or On/Off and a manual wall switch; the expansion board links to building systems']],
    sell: 'Hotel, restaurant and property owners, with their architects and electrical contractors – through commercial dealers.' },
];

const html = `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<title>Portfolio By Application · Bromic Heating</title><style>${css}</style></head><body>

<section class="page p1">
  <div class="photo" style="${bg('cover', '50% 60%')}"></div>
  <div class="shade"></div>
  <div class="mast"><img src="${rel('images/portfolio/bromic-logo-white.png')}" alt="Bromic Heating"><span class="label">Retail Guide <i>·</i> The Bromic Range</span></div>
  <div class="kicker"><span class="label" style="color:#fff">For Retail Partners</span></div>
  <h1 class="didot">Portfolio By Application</h1>
  <div class="deck">Every outdoor space your customers describe has a Bromic heater made for it, and the controls that go with it.</div>
  <div class="cap"><b>Tungsten Smart-Heat® Electric</b> – a covered terrace above the sea. Bromic Lookbook 2026.</div>
  <div class="lines">
    <div><span class="no">01</span><span class="t">Start With The Space</span><span class="d">A porch, a pergola, a shallow ceiling, the coast or open sky.</span></div>
    <div><span class="no">02</span><span class="t">Match The Series</span><span class="d">Tungsten, Platinum and Eclipse, in electric and gas.</span></div>
    <div><span class="no">03</span><span class="t">Quote The Controls</span><span class="d">Every heater leaves the store with its Affinity Smart-Heat® Controls.</span></div>
  </div>
  ${folio(1, true).replace('<span class="n">1</span>', '<span class="n">&nbsp;</span>')}
</section>

<section class="page p2">
  <div class="head">
    <div><span class="label">The Portfolio At A Glance</span><h2 class="didot">One Family For Every Outdoor Room</h2></div>
    <p>Bromic covers every space your customers bring to the counter, from a shallow porch ceiling to an open lawn. Find their space, read across to the heater, and quote it with the controls at the foot of its column.</p>
  </div>
  ${matrix}
  <div class="legend">
    <div class="keys"><span class="dot" style="display:inline-block;width:7pt;height:7pt;border-radius:50%;background:#231F20"></span> Show first<br><span style="display:inline-block;width:7pt;height:7pt;border-radius:50%;border:0.8pt solid #231F20"></span> Also fits</div>
    <p>Tungsten Select and Coastal are coming soon; Tungsten Classic follows in January 2027, as Series I sells through. Heat areas are Bromic's published coverage, approximate and depending on model. Wi-Fi and app features need compatible Affinity Smart-Heat® Controls, sold separately. Gas heaters are not recessed. Installation by a licensed electrician or gas fitter to local code.</p>
  </div>
  ${folio(2)}
</section>

<section class="page app p3">
  <div class="photo hero" style="${bg('p3hero', '50% 8%')}"></div>
  <div class="caption herocap"><b>Tungsten Select</b> – a timber pergola lounge at dusk. Bromic Lookbook 2026.</div>
  <div class="head"><span class="label">Under The Roof At Home</span><h2 class="didot">Warmth For Every Kind Of Ceiling</h2></div>
  <p class="lede">Most heaters your customers ask about go under a roof of their own. Tungsten Smart-Heat® Electric Series II is the place to start: up to 6 kW from dual elements, dimmed to the evening, on a wall, a ceiling, a single post or recessed flush.</p>
  <div class="cols">${P3.map(space).join('')}</div>
  ${folio(3)}
</section>

<section class="page p4">
  <div class="photo hero" style="${bg('p4hero', '62% 50%')}"></div>
  <div class="caption herocap"><b style="color:#fff">Eclipse Smart-Heat® Electric</b> – heat and light over a lounge at sunset. Bromic Lookbook 2026.</div>
  <div class="side">
    <span class="label">The Considered Outdoor Room</span>
    <h2 class="didot">Heat You Can Feel, Not See</h2>
    <p>When the design matters as much as the warmth, show the heaters that belong to the architecture: Platinum, Eclipse and Tungsten Coastal.</p>
  </div>
  <div class="stack">${P4.map(space).join('')}</div>
  ${folio(4)}
</section>

<section class="page app p5">
  <div class="photo hero" style="${bg('p5hero', '50% 22%')}"></div>
  <div class="caption herocap"><b>Eclipse Smart-Heat® Freestanding</b> – a rooftop lounge with no roof above it. Bromic Lookbook 2026.</div>
  <div class="head"><span class="label">Open Air And Hospitality</span><h2 class="didot">Warmth Wherever The Evening Goes</h2></div>
  <p class="lede">Beyond the roofline, the heater comes to the guests: the freestanding range rolls to wherever tonight's seating is. On the busiest terraces, mounted heaters warm a restaurant row by row, switched by zone.</p>
  <div class="cols">${P5.map(space).join('')}</div>
  ${folio(5)}
</section>

<section class="page p6">
  <div class="photo hero" style="${bg('p6hero', '40% 50%')}"></div>
  <div class="caption herocap"><b>Tungsten Smart-Heat® Freestanding Gas</b> – a stone courtyard at dusk. Bromic Lookbook 2026.</div>
  <div class="head">
    <span class="label">On The Floor</span>
    <h2 class="didot">Three Questions, The Right Heater</h2>
    <p>Ask them in order, and your customer's space points to the right series.</p>
  </div>
  <div class="qs">
    <div class="q"><span class="no">1</span><div><h3>Is There A Roof, Wall Or Post?</h3><ul>
      <li><b>No:</b> Eclipse Smart-Heat® Freestanding for heat and light, or the Tungsten Smart-Heat® Freestanding Gas tower on propane or natural gas.</li>
      <li><b>Yes:</b> mount it, and go to question two. A space counts as outdoor when at least 30% of its perimeter is permanently open.</li></ul></div></div>
    <div class="q"><span class="no">2</span><div><h3>Electric Or Gas?</h3><ul>
      <li><b>Electric</b> dims with an Affinity Dimmer and can recess flush.</li>
      <li><b>Gas</b> is on or off, mounts under cover at least 8 ft up and needs 110 V for ignition: Tungsten Gas in matte black, or Platinum Gas in black or stainless.</li></ul></div></div>
    <div class="q"><span class="no">3</span><div><h3>How Should It Look?</h3><ul>
      <li><b>Flush in a shallow ceiling:</b> Tungsten Select or Coastal (7.5 in), or Platinum Electric (7.1 in).</li>
      <li><b>On a pitched ceiling, a pergola, or up to 6 kW and 277 V:</b> Tungsten Series II.</li>
      <li><b>On show in a design-led room:</b> Platinum Electric. <b>Heat and light over a table:</b> Eclipse.</li>
      <li><b>By the sea:</b> Tungsten Coastal or Platinum Electric Marine.</li></ul></div></div>
  </div>
  <div class="cta">
    <span class="label">Your Next Step</span>
    <div class="q2 didot">Not Sure Which Heaters Are Right For The Space?</div>
    <p>Send your customer's photos, plans or drawings to Bromic's complimentary design service for heater selection, placement and coverage drawings.</p>
    <span class="btn">Request Your Design Plan</span>
    <div class="contact">bromic.com/design-your-space/<br>1-800-301-1293 · Mon–Fri 9–4 PT</div>
  </div>
  <div class="then">
    <div><h4 class="didot">Then Size It</h4><p>Allow 20 ft² a seat, aisles included, and divide by what one heater covers. A freestanding heater serves 4 seats at most. For anything beyond a simple patio, the design service draws the plan.</p></div>
    <div><h4 class="didot">And Close With The Controls</h4><p>Every Bromic heater is quoted with its Affinity Smart-Heat® Controls and a manual wall switch, on the same quote. Wi-Fi and app features need compatible Affinity Smart-Heat® Controls, sold separately.</p></div>
  </div>
  <div class="fine">
    <p>Installation by a licensed electrician to NFPA 70 (NEC) or a licensed gas fitter to ANSI Z223.1/NFPA 54, and to the manufacturer's instructions; check every install with the local building authority. Tungsten Select and Coastal: coming soon. Tungsten Classic: January 2027. Specifications are Bromic's published figures and may change; ask your Bromic rep for the current cut sheet.</p>
    <p>Sources: Bromic Lookbook 2026; bromic.com product pages; Tungsten Smart-Heat® Electric Series II launch materials, 2026; The Official Outdoor Heating Planning Guide, US v1.2, 2021. Lifestyle images from the Bromic Lookbook 2026 and bromic.com; Lookbook imagery is design inspiration, not installation guidance.</p>
  </div>
  ${folio(6)}
</section>
</body></html>`;

(async () => {
  fs.writeFileSync(path.join(HERE, 'index.html'), html);
  fs.mkdirSync(path.join(HERE, 'pages'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(HERE, 'index.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');

  // print QA: text off its page, text clipped, blocks that overlap, images that did not load
  const problems = await page.evaluate(async () => {
    const out = [];
    // images: <img> and background images
    const urls = new Set();
    document.querySelectorAll('img').forEach((i) => { if (!i.complete || !i.naturalWidth) out.push('missing image: ' + i.src); });
    document.querySelectorAll('*').forEach((el) => {
      const m = getComputedStyle(el).backgroundImage.match(/url\("?([^")]+)"?\)/);
      if (m) urls.add(m[1]);
    });
    await Promise.all([...urls].map((u) => new Promise((res) => {
      const im = new Image(); im.onload = () => res(); im.onerror = () => { out.push('missing image: ' + u); res(); }; im.src = u;
    })));
    const fontsOk = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family);
    ['Didot', 'Arimo'].forEach((f) => { if (!fontsOk.some((x) => x.includes(f))) out.push('font not loaded: ' + f); });

    document.querySelectorAll('.page').forEach((pg, i) => {
      const pr = pg.getBoundingClientRect();
      const n = `p${i + 1}`;
      pg.querySelectorAll('p,h1,h2,h3,h4,li,dd,dt,.caption,.folio,.cta,.deck,.lines div,.series,.why,.sell,.note,td,th,.label').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        if (r.bottom > pr.bottom - 0.2 * 96 + 0.5 || r.right > pr.right + 0.5 || r.left < pr.left - 0.5 || r.top < pr.top - 0.5)
          out.push(`${n} off page: ${el.className || el.tagName} "${el.textContent.trim().slice(0, 40)}"`);
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') out.push(`${n} clipped: ${el.textContent.trim().slice(0, 40)}`);
      });
      // top-level blocks must not overlap each other (photos may sit under their own shade/caption on the cover)
      const blocks = [...pg.querySelectorAll(':scope > .head, :scope > .lede, :scope > .cols, :scope > .stack, :scope > .side, :scope > .qs, :scope > .then, :scope > .cta, :scope > .fine, :scope > .folio, :scope > .caption, :scope > .legend, :scope > .mx, :scope > h1, :scope > .deck, :scope > .lines, :scope > .kicker, :scope > .mast, :scope > .cap, :scope > .hero')];
      const allowed = (a, b) => (pg.classList.contains('p4') && [a, b].some((x) => x.classList.contains('hero')) && [a, b].some((x) => x.classList.contains('herocap')));
      for (let a = 0; a < blocks.length; a++) for (let b = a + 1; b < blocks.length; b++) {
        if (allowed(blocks[a], blocks[b])) continue;
        const A = blocks[a].getBoundingClientRect(), B = blocks[b].getBoundingClientRect();
        if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1)
          out.push(`${n} overlap: ${blocks[a].className} × ${blocks[b].className}`);
      }
      // within each column of spaces, the blocks must clear the folio
      const folio = pg.querySelector('.folio');
      if (folio) {
        const f = folio.getBoundingClientRect();
        pg.querySelectorAll('.sp, .q, .then, .fine, .legend, .mx').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom > f.top - 4 && r.left < f.right && r.right > f.left) out.push(`${n} runs into folio: ${el.className} "${el.textContent.trim().slice(0, 30)}"`);
        });
      }
    });
    return out;
  });

  const pages = await page.$$('.page');
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(HERE, 'pages', `p${i + 1}.png`) });
  const pdf = path.join(HERE, 'Bromic-Portfolio-By-Application.pdf');
  await page.pdf({ path: pdf, width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  const mb = (fs.statSync(pdf).size / 1048576).toFixed(2);
  console.log(`pages: ${pages.length} · PDF ${mb} MB`);
  if (pages.length !== 6) problems.push(`expected 6 pages, got ${pages.length}`);
  if (problems.length) { console.log('QA:\n' + problems.join('\n')); process.exitCode = 1; } else console.log('QA: clean');
})();
