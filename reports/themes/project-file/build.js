// Project File – a case-study theme drawn like an architecture firm's project sheet.
// Sample: Pink Hill Hotel (Bromic-published case study, bromic.com, Dec 2023).
// node reports/themes/project-file/build.js  → sample.html, sample.pdf, pages/p1.png …
// Every fact below comes from the case-study record (data/case-studies.json,
// data/site-inventory.json) and the bromic.com page it was read from. No quote is shown:
// the page carries only a fragment of one, so the quote block is left out by rule.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '../../..');
const rel = (p) => path.relative(HERE, path.join(ROOT, p)).split(path.sep).join('/');
const img = (id) => rel(`images/library/${id}.webp`);

// ---- The project file (data only; the layout reads from here) ----
const P = {
  id: 'cs-eclipse-electric-and-tungsten-electric-at-pink-hill-hotel',
  sector: 'Hospitality',
  name: 'Pink Hill Hotel',
  line: 'Warmth Under Every Ceiling',
  lede: 'A newly built pub and live entertainment venue wanted its outdoor terraces full through the colder months, with nothing taking away from the room. Bromic matched a heater to each ceiling, keeping precise directional heat on the tables and every feature wall in view.',
  hero: 'w-tungsten-electric-bromic-pinkhill-547-1',
  heroCaption: 'Tungsten Smart-Heat® Electric on drop poles over the dining terrace.',
  data: [
    ['Location', 'Beaconsfield, Australia'],
    ['Setting', 'Pub and live entertainment venue – outdoor terraces'],
    ['Heaters', 'Eclipse Smart-Heat® Electric · Eclipse Pendant · Tungsten Smart-Heat® Electric'],
    ['Controls', 'Eclipse Dimmer Controller on Eclipse; Tungsten to confirm'],
    ['Date', 'December 2023'],
  ],
  beats: [
    ['The Space', 'Pink Hill is a new pub built for live music, with outdoor terraces under high ceilings, sections of operable roof and feature walls that give each room its character.'],
    ['The Challenge', 'The venue wanted its terraces in use through the colder months without losing the atmosphere. Heaters had to suit ceilings of very different heights and never block the view of a feature wall.'],
    ['The Solution', 'After reviewing the site plans, Bromic’s commercial sales team specified a mix: compact Eclipse Pendants under the high fixed ceiling, Eclipse Electric over the dining tables and high-output Tungsten Electric in the larger rooms and under the operable roof.'],
  ],
  zones: [
    ['A', 'Feature-wall lounge', 'Higher fixed ceiling. The smaller Eclipse Pendant keeps the view of the feature wall clear.'],
    ['B', 'Modern dining', 'Eclipse Electric gives spot heat and light over each table, on a 24-inch twin pole and a custom pole.'],
    ['C', 'Industrial-style room', 'Tungsten Electric for high output, lowered to a suitable height on a 1200 mm pole.'],
    ['D', 'Operable roof', 'Tungsten Electric mounted on the structural beams and angled toward guests, chosen for Melbourne’s winter.'],
  ],
  lounge: 'w-pink-hills-hotel-aus-2',
  loungeCaption: 'Eclipse Pendants on drop rods in the feature-wall lounge.',
  wide: 'w-eclipse-electric-tungsten-electric-bromic-pi',
  wideCaption: 'Tungsten Electric and Eclipse heaters under the timber-slat ceiling, the feature wall left clear.',
  products: [
    { coll: 'Eclipse', name: 'Eclipse Smart-Heat® Electric', img: 'w-eclipse-electric-bromic-pinkhill-532-2', pos: '50% 55%',
      where: 'Modern dining, over the tables', mount: '24-inch twin pole and a custom pole',
      controls: 'Eclipse Dimmer Controller – three built-in heat and light presets for staff' },
    { coll: 'Eclipse', name: 'Eclipse Pendant', img: 'w-eclipse-electric-bromic-pinkhill-553-1', pos: '20% 30%',
      where: 'Feature-wall lounge, higher fixed ceiling', mount: 'Pendant on drop rods',
      controls: 'Eclipse Dimmer Controller – three built-in heat and light presets for staff' },
    { coll: 'Tungsten', name: 'Tungsten Smart-Heat® Electric', img: 'w-tungsten-electric-bromic-pinkhill-524', pos: '30% 50%',
      where: 'Industrial-style room and operable roof', mount: '1200 mm pole; structural beams, angled',
      controls: 'Controls: to confirm – the case study does not name them' },
  ],
  sources: [
    'Bromic, “Eclipse Electric and Tungsten Electric at Pink Hill Hotel”, case study, December 2023 – bromic.com/case-study/eclipse-electric-and-tungsten-electric-at-pink-hill-hotel/ (also on bromic.com.au and bromic.ca).',
    'Photography: Bromic-published images from the case study and the Eclipse 24-inch Twin Pole and Tungsten Smart-Heat® Electric product pages. Photographer credit to confirm.',
    'The source gives no heater quantities or positions; the plan on page 2 is illustrative. It lists the Tungsten pole as “3 ft (1200 mm)” – 1200 mm is about 4 ft, so the length is shown in millimetres only until it is confirmed.',
  ],
  cta: { label: 'Request Your Design Plan', url: 'bromic.com/design-your-space' },
};

// ---- Illustrative plan (SVG, drawn by hand-set coordinates) ----
function plan() {
  const W = 712, H = 330;
  const ink = '#231F20', steel = '#8A8F94', hair = '#C9CDD1', pale = '#F1F2F3', flame = '#EF4123';
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" font-family="Arimo, Arial, sans-serif">`;
  s += `<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="${hair}" stroke-width="1"/></pattern>
  <radialGradient id="heat"><stop offset="0" stop-color="#E7E2DE"/><stop offset="1" stop-color="#E7E2DE" stop-opacity="0"/></radialGradient></defs>`;
  // building outline (thick wall), interior partitions
  const X0 = 20, Y0 = 26, X1 = 692, Y1 = 300;
  s += `<rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" fill="#fff" stroke="${ink}" stroke-width="3"/>`;
  // feature wall (hatched) at top of zone A
  s += `<rect x="${X0 + 3}" y="${Y0 + 3}" width="236" height="12" fill="url(#hatch)" stroke="${steel}" stroke-width=".75"/>`;
  s += `<text x="${X0 + 121}" y="${Y0 - 8}" font-size="8" letter-spacing="1.6" fill="${steel}" text-anchor="middle">FEATURE WALL</text>`;
  // partitions
  s += `<line x1="262" y1="${Y0}" x2="262" y2="190" stroke="${ink}" stroke-width="1.5"/>`;
  s += `<line x1="262" y1="232" x2="262" y2="${Y1}" stroke="${ink}" stroke-width="1.5"/>`;
  s += `<line x1="472" y1="${Y0}" x2="472" y2="96" stroke="${ink}" stroke-width="1.5"/>`;
  s += `<line x1="472" y1="196" x2="472" y2="${Y1}" stroke="${ink}" stroke-width="1.5"/>`;
  s += `<line x1="472" y1="156" x2="560" y2="156" stroke="${ink}" stroke-width="1.5"/>`;
  s += `<line x1="604" y1="156" x2="${X1}" y2="156" stroke="${ink}" stroke-width="1.5"/>`;
  // operable roof: dashed panel lines over zone D (top right)
  for (let y = Y0 + 26; y < 156; y += 26) s += `<line x1="475" y1="${y}" x2="${X1 - 3}" y2="${y}" stroke="${hair}" stroke-width="1" stroke-dasharray="4 4"/>`;
  s += `<text x="${(472 + X1) / 2}" y="${Y0 - 8}" font-size="8" letter-spacing="1.6" fill="${steel}" text-anchor="middle">OPERABLE ROOF ABOVE</text>`;
  // structural beams in D
  for (const x of [512, 652]) s += `<line x1="${x}" y1="${Y0 + 3}" x2="${x}" y2="153" stroke="${steel}" stroke-width="2.5"/>`;
  const heat = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#heat)"/>`;
  const disc = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="8" fill="#fff" stroke="${ink}" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="3" fill="${ink}"/>`;
  const bar = (cx, cy, rot = 0) => `<g transform="translate(${cx} ${cy}) rotate(${rot})"><rect x="-17" y="-4" width="34" height="8" fill="${ink}"/><line x1="-13" y1="0" x2="13" y2="0" stroke="#fff" stroke-width="1"/></g>`;
  const table = (cx, cy, r = 9) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${steel}" stroke-width="1"/>`;
  const rtable = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${steel}" stroke-width="1"/>`;
  const seat = (cx, cy) => `<rect x="${cx - 3.5}" y="${cy - 3.5}" width="7" height="7" rx="1.5" fill="${pale}" stroke="${steel}" stroke-width=".75"/>`;

  // Zone A: lounge – curved banquette, low tables, pendants
  s += `<path d="M ${X0 + 14} 120 Q ${X0 + 14} 52 90 52 L 200 52" fill="none" stroke="${steel}" stroke-width="9" stroke-linecap="round" opacity=".35"/>`;
  for (const [cx, cy] of [[90, 120], [170, 96], [130, 200], [210, 170], [70, 250], [190, 255]]) { s += heat(cx, cy, 44); }
  for (const [cx, cy] of [[90, 120], [170, 96], [130, 200], [210, 170], [70, 250], [190, 255]]) {
    s += table(cx, cy, 8); for (const a of [0, 120, 240]) s += seat(cx + 17 * Math.cos(a * Math.PI / 180), cy + 17 * Math.sin(a * Math.PI / 180));
    s += disc(cx, cy);
  }
  // Zone B: dining – square tables in a grid, Eclipse over each
  const bT = [[300, 70], [380, 70], [300, 150], [380, 150], [300, 240], [380, 240], [440, 110], [440, 200]];
  for (const [cx, cy] of bT) s += heat(cx, cy, 40);
  for (const [cx, cy] of bT) {
    s += rtable(cx - 11, cy - 11, 22, 22);
    for (const [dx, dy] of [[-19, 0], [19, 0], [0, -19], [0, 19]]) s += seat(cx + dx, cy + dy);
    s += disc(cx, cy);
  }
  // Zone D: operable roof – Tungsten on the beams, angled toward the table
  const longT = (x, y, n = 4) => { let o = rtable(x, y, 17 * n + 2, 18); for (let i = 0; i < n; i++) { o += seat(x + 9 + i * 17, y - 8); o += seat(x + 9 + i * 17, y + 26); } return o; };
  s += heat(582, 92, 70);
  s += longT(546, 70) + longT(546, 112, 4);
  s += bar(512, 80, 90) + bar(512, 128, 90) + bar(652, 80, 90) + bar(652, 128, 90);
  const aim = (x, y, dir) => `<path d="M ${x} ${y} l ${dir * 11} 0 m ${-dir * 4} -3 l ${dir * 4} 3 l ${-dir * 4} 3" stroke="${ink}" stroke-width="1" fill="none"/>`;
  for (const y of [80, 128]) { s += aim(519, y, 1); s += aim(645, y, -1); }
  // Zone C: industrial-style room – long tables, Tungsten on poles
  for (const [cx, cy] of [[540, 212], [626, 212], [540, 262], [626, 262]]) s += heat(cx, cy, 44);
  s += longT(497, 200, 5) + longT(590, 200, 4) + longT(497, 250, 5) + longT(590, 250, 4);
  s += bar(540, 212) + bar(626, 212) + bar(540, 262) + bar(626, 262);
  // Zone labels
  const lab = (x, y, l, t) => `<g><circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="${flame}" stroke-width="1.2"/><text x="${x}" y="${y + 3.2}" font-size="9" fill="${flame}" text-anchor="middle" font-weight="700">${l}</text><text x="${x + 15}" y="${y + 3.2}" font-size="8" letter-spacing="1.4" fill="${ink}">${t}</text></g>`;
  s += lab(X0 + 18, Y1 - 14, 'A', 'LOUNGE');
  s += lab(278, Y1 - 14, 'B', 'DINING');
  s += lab(X1 - 20 - 0, Y1 - 14, 'C', '');
  s += lab(X1 - 20, 140, 'D', '');
  // north arrow and scale-free note
  s += `<g transform="translate(${X1 + 0} ${Y1 + 18})"></g>`;
  s += `</svg>`;
  return s;
}

// C and D share the right-hand room in the drawing; say so in the legend rather than invent a wall.
function legend() {
  const ink = '#231F20';
  return `<div class="legend">
    <span><svg width="18" height="18"><circle cx="9" cy="9" r="7" fill="#fff" stroke="${ink}" stroke-width="1.5"/><circle cx="9" cy="9" r="2.6" fill="${ink}"/></svg>Eclipse Pendant / Eclipse Electric</span>
    <span><svg width="30" height="12"><rect x="0" y="2" width="30" height="8" fill="${ink}"/></svg>Tungsten Electric</span>
    <span><svg width="22" height="12"><line x1="0" y1="6" x2="22" y2="6" stroke="#C9CDD1" stroke-dasharray="4 4"/></svg>Operable roof panels</span>
    <span><svg width="22" height="12"><circle cx="11" cy="6" r="6" fill="#E7E2DE"/></svg>Area of radiant warmth</span>
  </div>`;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const reg = (s) => esc(s).replace(/®/g, '<sup>®</sup>');

const footer = (n) => `<footer class="foot"><img src="${rel('images/portfolio/bromic-logo.png')}" alt="Bromic"><span>Project File · ${esc(P.name)}</span><span class="pg">${String(n).padStart(2, '0')} / 03</span></footer>`;

const html = `<!doctype html><html lang="en-US"><head><meta charset="utf-8"><title>Project File – ${esc(P.name)}</title>
<style>
@font-face{font-family:'Didot';src:url('${rel('app/src/fonts/gfs-didot-latin.woff2')}') format('woff2');}
@font-face{font-family:'Arimo';src:url('${rel('app/src/fonts/arimo-latin.woff2')}') format('woff2');font-weight:100 900;}
:root{--ink:#231F20;--steel:#5E6469;--steel2:#8A8F94;--hair:#D7DADD;--flame:#EF4123;--paper:#fff;}
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#e9eaeb}
body{font-family:Arimo,Arial,sans-serif;color:var(--ink);font-weight:400;-webkit-font-smoothing:antialiased}
.page{width:8.5in;height:11in;background:var(--paper);position:relative;overflow:hidden;page-break-after:always;padding:0.55in 0.6in 0.5in}
.page:last-child{page-break-after:auto}
.kicker{font-size:7.5pt;letter-spacing:.22em;text-transform:uppercase;color:var(--flame);display:flex;gap:14px;align-items:center}
.kicker::before{content:'';width:22px;height:1.5px;background:var(--flame)}
.kicker .grey{color:var(--steel2)}
h1{font-family:Didot,serif;font-weight:400;font-size:58pt;line-height:.95;letter-spacing:-.01em;margin-top:14px}
.line{font-family:Didot,serif;font-size:17pt;color:var(--steel);margin-top:10px}
.hero{margin:22px -0.6in 0;height:4.8in;background-size:cover;background-position:50% 55%}
.cap{font-size:7pt;color:var(--steel2);margin-top:7px;letter-spacing:.02em}
.data{display:grid;grid-template-columns:1fr 1.25fr 1.6fr 1.35fr .8fr;border-top:1.5px solid var(--ink);border-bottom:1px solid var(--hair);margin-top:20px}
.data div{padding:10px 12px 12px 0;border-right:1px solid var(--hair);margin-right:12px}
.data div:last-child{border-right:0;margin-right:0}
.data dt{font-size:6.5pt;letter-spacing:.2em;text-transform:uppercase;color:var(--steel2);margin-bottom:5px}
.data dd{font-size:8.5pt;line-height:1.35}
.lede{font-family:Didot,serif;font-size:15.5pt;line-height:1.4;margin-top:24px;max-width:6.4in}
sup{font-size:.6em;line-height:0}
.foot{position:absolute;left:.6in;right:.6in;bottom:.38in;display:flex;align-items:center;gap:14px;font-size:6.5pt;letter-spacing:.18em;text-transform:uppercase;color:var(--steel2);border-top:1px solid var(--hair);padding-top:9px}
.foot img{height:12px}
.foot .pg{margin-left:auto}
/* page 2 */
.beats{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:14px}
.beat .n{font-size:7pt;letter-spacing:.2em;color:var(--flame)}
.beat h2{font-family:Didot,serif;font-weight:400;font-size:17pt;margin:6px 0 10px;padding-bottom:9px;border-bottom:1px solid var(--hair)}
.beat p{font-size:8.6pt;line-height:1.55;color:#3a3536}
.section{display:flex;align-items:baseline;justify-content:space-between;margin-top:24px;border-top:1.5px solid var(--ink);padding-top:10px}
.section h3{font-family:Didot,serif;font-weight:400;font-size:15pt}
.section .tag{font-size:6.5pt;letter-spacing:.2em;text-transform:uppercase;color:var(--steel2)}
.planwrap{margin-top:14px}
.legend{display:flex;gap:20px;flex-wrap:wrap;font-size:7pt;color:var(--steel);margin-top:8px}
.legend span{display:flex;align-items:center;gap:6px}
.zones{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:16px}
.zones .z b{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border:1.2px solid var(--flame);border-radius:50%;color:var(--flame);font-size:7.5pt;margin-right:7px}
.zones .z h4{font-size:7pt;letter-spacing:.16em;text-transform:uppercase;font-weight:700;display:flex;align-items:center;margin-bottom:6px}
.zones .z p{font-size:7.8pt;line-height:1.5;color:#3a3536}
.note{font-size:7pt;color:var(--steel2);margin-top:3px;font-style:italic}
.strip{margin:16px -0.6in 0;height:1.5in;background-size:cover;background-position:50% 30%}
/* page 3 */
.wide{margin:-0.55in -0.6in 0;height:3.75in;background-size:cover;background-position:50% 40%}
.prods{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:16px}
.prod .ph{height:1.55in;background-size:cover}
.prod .coll{font-size:6.5pt;letter-spacing:.32em;color:var(--flame);margin-top:12px}
.prod h4{font-family:Didot,serif;font-weight:400;font-size:13pt;margin:4px 0 8px;line-height:1.15}
.prod dl{border-top:1px solid var(--hair)}
.prod dl div{display:grid;grid-template-columns:58px 1fr;gap:6px;padding:6px 0;border-bottom:1px solid var(--hair)}
.prod dt{font-size:6.3pt;letter-spacing:.18em;text-transform:uppercase;color:var(--steel2);padding-top:1px}
.prod dd{font-size:7.8pt;line-height:1.4}
.closing{display:grid;grid-template-columns:1.55fr 1fr;gap:34px;margin-top:26px;align-items:start}
.sources h5{font-size:6.5pt;letter-spacing:.2em;text-transform:uppercase;color:var(--steel2);margin-bottom:6px}
.sources ol{padding-left:14px;font-size:6.6pt;line-height:1.5;color:var(--steel)}
.sources li{margin-bottom:4px}
.cta{border-top:1.5px solid var(--ink);padding-top:12px}
.cta p{font-family:Didot,serif;font-size:13pt;line-height:1.3;margin-bottom:12px}
.cta .sub{font-size:8pt;line-height:1.5;color:var(--steel);margin:-4px 0 12px}
.cta a{display:inline-block;font-size:7pt;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);text-decoration:none;border-bottom:1.5px solid var(--flame);padding-bottom:4px}
.cta .url{font-size:7pt;color:var(--steel2);margin-top:8px}
</style></head><body>

<section class="page">
  <div class="kicker">Project File <span class="grey">${esc(P.sector)} · Australia</span></div>
  <h1>${esc(P.name)}</h1>
  <div class="line">${esc(P.line)}</div>
  <div class="hero" style="background-image:url('${img(P.hero)}')"></div>
  <div class="cap">${reg(P.heroCaption)}</div>
  <dl class="data">${P.data.map(([k, v]) => `<div><dt>${k}</dt><dd>${reg(v)}</dd></div>`).join('')}</dl>
  <p class="lede">${esc(P.lede)}</p>
  ${footer(1)}
</section>

<section class="page">
  <div class="kicker">The Project</div>
  <div class="beats">${P.beats.map(([h, t], i) => `<div class="beat"><div class="n">0${i + 1}</div><h2>${h}</h2><p>${reg(t)}</p></div>`).join('')}</div>
  <div class="section"><h3>One Heater For Each Ceiling</h3><span class="tag">Illustrative layout · not to scale</span></div>
  <div class="planwrap">${plan()}${legend()}</div>
  <div class="zones">${P.zones.map(([l, h, t]) => `<div class="z"><h4><b>${l}</b>${h}</h4><p>${reg(t)}</p></div>`).join('')}</div>
  <div class="strip" style="background-image:url('${img(P.lounge)}')"></div>
  <div class="cap">${reg(P.loungeCaption)}</div>
  <p class="note">Rooms and heater positions are drawn from the case study’s description, not from site drawings. The source gives no heater quantities.</p>
  ${footer(2)}
</section>

<section class="page">
  <div class="wide" style="background-image:url('${img(P.wide)}')"></div>
  <div class="cap">${reg(P.wideCaption)}</div>
  <div class="section" style="margin-top:22px"><h3>Heaters &amp; Controls</h3><span class="tag">As specified</span></div>
  <div class="prods">${P.products.map((p) => `<div class="prod"><div class="ph" style="background-image:url('${img(p.img)}');background-position:${p.pos}"></div>
    <div class="coll">${p.coll.toUpperCase()}</div><h4>${reg(p.name)}</h4>
    <dl><div><dt>Where</dt><dd>${esc(p.where)}</dd></div><div><dt>Mounting</dt><dd>${esc(p.mount)}</dd></div><div><dt>Controls</dt><dd>${esc(p.controls)}</dd></div></dl></div>`).join('')}</div>
  <div class="closing">
    <div class="sources"><h5>Sources &amp; Notes</h5><ol>${P.sources.map((s) => `<li>${reg(s)}</li>`).join('')}</ol></div>
    <div class="cta"><p>Not sure which heaters are right for your outdoor space?</p><div class="sub">Send us your plans and our design team will map the heat, ceiling by ceiling.</div><a href="https://www.bromic.com/design-your-space/">${esc(P.cta.label)}</a><div class="url">${esc(P.cta.url)}</div></div>
  </div>
  ${footer(3)}
</section>
</body></html>`;

(async () => {
  const out = path.join(HERE, 'sample.html');
  fs.writeFileSync(out, html);
  fs.mkdirSync(path.join(HERE, 'pages'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
  await page.goto('file://' + out, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // print check: nothing may spill out of its page, no image may be missing
  const problems = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.page').forEach((pg, i) => {
      const r = pg.getBoundingClientRect();
      pg.querySelectorAll('*').forEach((el) => {
        const b = el.getBoundingClientRect();
        if (!b.width || el.closest('.hero,.wide,.strip')) return;
        if (b.bottom > r.bottom + 0.5 || b.right > r.right + 0.5 || b.left < r.left - 0.5) bad.push(`p${i + 1}: ${el.tagName}.${el.className} off page`);
        if (el.scrollHeight > el.clientHeight + 1 && getComputedStyle(el).overflow === 'hidden' && !el.classList.contains('page')) bad.push(`p${i + 1}: ${el.className} clipped`);
      });
      const foot = pg.querySelector('.foot').getBoundingClientRect();
      [...pg.children].filter((c) => !c.classList.contains('foot')).forEach((c) => { const b = c.getBoundingClientRect(); if (b.bottom > foot.top - 2 && b.height) bad.push(`p${i + 1}: ${c.className} runs into footer`); });
    });
    document.querySelectorAll('img').forEach((im) => { if (!im.naturalWidth) bad.push('missing image ' + im.src); });
    document.querySelectorAll('[style*="background-image"]').forEach((el) => { /* checked below */ });
    return bad;
  });
  const bgs = await page.evaluate(() => [...document.querySelectorAll('[style*="background-image"]')].map((e) => e.style.backgroundImage.slice(5, -2)));
  for (const b of bgs) if (!fs.existsSync(path.resolve(HERE, decodeURI(b)))) problems.push('missing background ' + b);
  const pages = await page.$$('.page');
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(HERE, 'pages', `p${i + 1}.png`) });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: path.join(HERE, 'sample.pdf'), preferCSSPageSize: true, printBackground: true });
  await browser.close();
  if (problems.length) { console.error('PRINT CHECK:\n' + problems.join('\n')); process.exitCode = 1; }
  else console.log(`ok: ${pages.length} pages, sample.html, sample.pdf, pages/p1..p${pages.length}.png`);
})();
