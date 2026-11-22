// Bromic Retail One-Pagers: the seven remaining Retail Hub pages as designed US Letter sheets, in the look of the
// approved retail set (series-sheets: photo-led hero; controls-mounting: white Blueprint sheet with drawings).
// Photo-led: why-bromic, selling, merchandising. Blueprint: range-selector, sizing, install-warranty, ordering.
// Facts only from data/retail/retail.json and data/product-facts.json. Open facts ([[VERIFY]]) print as "To confirm".
// No prices. Competitor lines only on the selling page, exactly as retail.json states them.
// Run: node reports/retail/one-pagers/build.js → <id>.html, pages/<id>.png, Bromic-<Title>.pdf, index.json, print-check.txt
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '../../..');
const rel = (p) => path.relative(HERE, path.join(ROOT, p)).split(path.sep).join('/');
const RETAIL = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/retail/retail.json'), 'utf8'));
const PG = Object.fromEntries(RETAIL.pages.map((p) => [p.id, p]));

const T = { ink: '#231F20', draw: '#1C2B44', steel: '#6B7480', hair: '#B9C3D0', flame: '#EF4123' };
const TC = '<i class="tc">To confirm</i>';
const R = '<sup class="r">®</sup>';
// retail.json text → page text: [[VERIFY]] notes become "To confirm", ® is set small
const t = (s) => String(s).replace(/\s*\[\[VERIFY:[^\]]*\]\]/g, ` ${TC}`).replace(/\{TC\}/g, TC).replace(/®/g, R).trim();
const sec = (id, i) => PG[id].sections[i];

// ---------- images: real Bromic photography and product renders, ≤2000 px, JPEG q82 ----------
const IMAGES = {
  'why-hero': 'images/library/l-004-012.webp',
  'sell-hero': 'images/library/w-barangaroo-house-sydney-platinum-electric-4.webp',
  'sell-app': 'images/library/w-bromic-home-automation-hero.webp',
  'merch-hero': 'images/library/l-013-100.webp',
  'merch-dimmer': 'images/library/w-affinity-dimmer-2ch-2.webp',
  'p-s2': 'decks/product-renders/Tungsten-Series-II-Select-graphite-hero.jpg',
  'p-pe': 'images/portfolio/platinum-electric.webp',
  'p-ec': 'images/portfolio/eclipse-pendant.webp',
  'p-ef': 'images/portfolio/eclipse-freestanding.webp',
  'p-pg': 'images/portfolio/platinum-gas.webp',
  'p-tf': 'images/portfolio/tungsten-freestanding-gas.webp',
  'p-ctl': 'images/portfolio/affinity-controls.webp',
  't-classic': 'images/library/t2-classic.webp',
  't-select': 'images/library/t2-select-black.webp',
  't-coastal': 'images/library/l-005-020.webp',
};
const HERO_Y = { 'why-hero': 0.62, 'sell-hero': 0.62, 'merch-hero': 0.42 };
function prepImages() {
  fs.mkdirSync(path.join(HERE, 'img'), { recursive: true });
  // never use an image the library marks rejected
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'images/library/manifest.json'), 'utf8'));
  const st = Object.fromEntries(man.map((m) => [m.file, m.status]));
  for (const src of Object.values(IMAGES)) if (/rejected/i.test(st[src] || '')) throw new Error('rejected image: ' + src);
  // heroes are cropped to the hero's shape and the shade is baked in (a see-through gradient would print as a full-page bitmap)
  const jobs = Object.entries(IMAGES).map(([k, src]) => [path.join(ROOT, src), path.join(HERE, 'img', `${k}.jpg`), HERO_Y[k] ?? null]);
  const py = `
import sys, json
from PIL import Image
def shade(im):
    w, h = im.size
    v = [(0, .78), (.22, .42), (.36, .08), (.48, 0), (.66, .3), (1, .86)]
    def at(stops, x):
        for (a, p), (b, q) in zip(stops, stops[1:]):
            if a <= x <= b: return p + (q - p) * (x - a) / (b - a)
        return stops[-1][1]
    mask = Image.new('L', (w, h))
    px = mask.load()
    col = [at(v, y / (h - 1)) for y in range(h)]
    row = [at([(0, .38), (.55, 0), (.75, .05), (1, .42)], x / (w - 1)) for x in range(w)]
    for y in range(h):
        for x in range(w):
            a = 1 - (1 - col[y]) * (1 - row[x])
            px[x, y] = int(a * 255)
    return Image.composite(Image.new('RGB', (w, h), (20, 18, 19)), im, mask)
for src, out, yp in json.loads(sys.argv[1]):
    im = Image.open(src).convert('RGB')
    if yp is not None:
        w, h = im.size
        ch = round(w * 3.55 / 8.5)
        top = round((h - ch) * yp)
        im = im.crop((0, top, w, top + ch))
        im.thumbnail((2000, 2000), Image.LANCZOS)
        im = shade(im)
    im.thumbnail((2000, 2000), Image.LANCZOS)
    im.save(out, 'JPEG', quality=82, optimize=True, progressive=True)
`;
  const r = spawnSync('python3', ['-c', py, JSON.stringify(jobs)], { stdio: 'inherit' });
  if (r.status) throw new Error('image prep failed');
  fs.copyFileSync(path.join(ROOT, 'images/portfolio/bromic-logo-white.png'), path.join(HERE, 'img/bromic-logo-white.png'));
  fs.copyFileSync(path.join(ROOT, 'images/portfolio/bromic-logo.png'), path.join(HERE, 'img/bromic-logo.png'));
}

// ---------- shared pieces ----------
const WIFI = 'Wi-Fi and app features need compatible Affinity Smart-Heat® Controls, sold separately.';
const QUOTE = 'Quote every heater with its Affinity Smart-Heat® Controls and a manual wall switch.';
const INSTALL = 'Installation by a licensed electrician / gas fitter to local code; check every install with the local building authority.';
const DS = 'bromic.com/design-your-space · 1-800-301-1293 · Mon–Fri 9–4 PT';
const N = 7;

const zones = () => {
  const cols = [1, 2, 3, 4, 5, 6], rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const top = cols.map((k, i) => `<span style="left:${(i + 0.5) * 100 / cols.length}%">${k}</span>`).join('');
  const side = rows.map((k, i) => `<span style="top:${(i + 0.5) * 100 / rows.length}%">${k}</span>`).join('');
  return `<div class="zones"><div class="zt">${top}</div><div class="zb">${top}</div><div class="zl">${side}</div><div class="zr">${side}</div></div>`;
};
const strip = (no, title, sources) => `<div class="strip">
  <div class="cell grow"><b>SOURCES</b><span>${sources}</span></div>
  <div class="cell"><b>FOR</b><span>Retail partners</span></div>
  <div class="cell"><b>SHEET TITLE</b><span>${title}</span></div>
  <div class="cell s"><b>SCALE</b><span>NTS</span></div>
  <div class="cell"><b>REVISION</b><span>Draft for review</span></div>
  <div class="cell s"><b>DATE</b><span>2026-11-22</span></div>
  <div class="cell sheet"><b>SHEET</b><span>${no}<i>/0${N}</i></span></div>
</div>`;
const ctaRow = (label, line, note) => `<div class="foot2"><p class="disc"><b>GOOD TO KNOW</b> ${t(note)}</p>
  <div class="ctab"><a class="btn">${label} <span>→</span></a>${line ? `<span class="addr">${line}</span>` : ''}</div></div>`;
const hdr = (l, r = '') => `<div class="hdr"><span class="lbl">${l}</span>${r ? `<span class="lbl r">${r}</span>` : ''}</div>`;
const bpHead = (id, eyebrow, lede, photo) => `<header class="s-head">
  <div class="s-text"><div class="brand"><img class="logo" src="img/bromic-logo.png" alt="Bromic Heating"><span class="lbl">RETAIL ONE-PAGER · ${eyebrow}</span></div>
  <p class="eyebrow">${PG[id].kicker}</p><h2>${t(PG[id].title)}</h2><p class="s-lede">${t(lede)}</p></div>
  ${photo ? `<figure class="ph top"><div class="ph-img" style="background-image:url(img/${photo[0]}.jpg);background-position:${photo[2] || 'center'}"></div><figcaption><b>PHOTO</b> ${t(photo[1])}</figcaption></figure>` : ''}
</header>`;
const photoHead = (id, no, img, pos, deck, cap) => `<div class="hero" style="background-image:url('img/${img}.jpg');background-position:center">
  <div class="mast"><img src="img/bromic-logo-white.png" alt="Bromic Heating"><div class="meta"><span>Retail One-Pager <b>${no}</b> / 0${N}</span><span>Retail</span></div></div>
  <div class="hcopy"><div class="kick"><span>${PG[id].kicker}</span></div><h1>${t(PG[id].title)}</h1><p class="deck">${t(deck)}</p></div>
  <div class="hcap">${t(cap)}</div>
</div>`;
const cap1 = (x) => x.charAt(0).toUpperCase() + x.slice(1);
const bul = (arr) => `<ul class="bl">${arr.map((b) => `<li>${t(cap1(b.replace(/^Suggested:\s*/, '')))}</li>`).join('')}</ul>`;

// SVG helpers (as in controls-mounting)
const bub = (x, y, k, flame = false) => `<circle cx="${x}" cy="${y}" r="8" class="${flame ? 'bubf' : 'bub'}"/><text x="${x}" y="${y + 3}" class="bubt${flame ? ' f' : ''}" text-anchor="middle">${k}</text>`;
// the Diamond grille as two zigzags (a pattern fill would print as a full-page bitmap)
const grille = (gx, gy, gw, gh) => {
  const st = Math.max(2, gh * 0.9), n = Math.floor(gw / st);
  const zz = (ph) => Array.from({ length: n + 1 }, (_, i) => `${(gx + i * st).toFixed(1)},${(((i + ph) % 2) ? gy : gy + gh).toFixed(1)}`).join(' ');
  return `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="none" stroke="${T.draw}" stroke-width=".4"/><polyline points="${zz(0)}" fill="none" stroke="${T.draw}" stroke-width=".35"/><polyline points="${zz(1)}" fill="none" stroke="${T.draw}" stroke-width=".35"/>`;
};
const heater = (x, y, w, h = 12) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2.6}" class="heat"/>
  ${grille(x + h * 0.7, y + h * 0.25, w - h * 1.4, h * 0.5)}
  <line x1="${x + h * 0.75}" y1="${y + h / 2}" x2="${x + w - h * 0.75}" y2="${y + h / 2}" stroke="${T.flame}" stroke-width=".7" opacity=".85"/></g>`;
const defs = `<svg width="0" height="0" style="position:absolute"><defs>
  <marker id="arD" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1.5 L10 5 L0 8.5" fill="${T.draw}"/></marker>
  <marker id="arF" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1.5 L10 5 L0 8.5" fill="${T.flame}"/></marker>
  <marker id="arS" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1.5 L10 5 L0 8.5" fill="${T.draw}"/></marker>
  <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="${T.draw}" stroke-width=".5"/></pattern>
</defs></svg>`;

// =====================================================================================================
// 01 · WHY STOCK BROMIC (photo-led)
// =====================================================================================================
const FAMILY = [
  ['p-s2', '50% 50%', 'Tungsten Smart-Heat® Electric Series II', 'Ceilings, walls, posts, recesses', 'Affinity Dimmer'],
  ['p-pe', '70% 40%', 'Platinum Smart-Heat® Electric', 'Glass-ceramic face, 2.1 in deep', 'Affinity Dimmer'],
  ['p-ec', '50% 55%', 'Eclipse Smart-Heat® Electric', 'Pendant, heat and light', 'Affinity Eclipse Controller'],
  ['p-ef', '50% 50%', 'Eclipse Smart-Heat® Freestanding', 'Open seating', 'Eclipse Dimmer Controller and remote, included'],
  ['p-pg', '40% 50%', 'Platinum Smart-Heat® Gas', 'Built-in gas, black or stainless', 'Affinity On/Off'],
  ['p-tf', '62% 40%', 'Tungsten Smart-Heat® Freestanding Gas', 'Wheeled, natural gas or propane', 'Set at its own knob'],
];
const whyBromic = () => {
  const s = PG['why-bromic'].sections;
  return `<section class="page photo">
  ${photoHead('why-bromic', '01', 'why-hero', '50% 62%', PG['why-bromic'].summary, '<b>PHOTO</b> Tungsten Coastal on a covered terrace')}
  <div class="flow pflow">
    <div class="two w1">
      <div><p class="eyebrow">01 · The Range</p><h3>${s[0].h}</h3><p class="body">${t(s[0].body[0])}</p></div>
      <div class="fam">${FAMILY.map(([img, pos, n, d, c]) => `<figure><div class="fi" style="background-image:url(img/${img}.jpg);background-position:${pos}"></div>
        <figcaption><b>${t(n)}</b><span>${d}</span><em><i>CONTROLS</i>${t(c)}</em></figcaption></figure>`).join('')}</div>
    </div>
    <div class="three">
      <div class="col"><p class="eyebrow">02 · The Look</p><h3>${s[1].h}</h3>${bul(s[1].bullets)}</div>
      <div class="col ctlc"><p class="eyebrow">03 · The Controls</p><h3>${s[2].h}</h3><p class="body">${t(s[2].body[0].replace(' ' + WIFI, ''))}</p>
        <p class="wifi">${t(WIFI)}</p></div>
      <figure class="plate"><div class="pi" style="background-image:url(img/p-ctl.jpg);background-position:30% 50%"></div><figcaption><b>PHOTO</b> ${t("Affinity Smart-Heat® controller")}</figcaption></figure>
    </div>
    <div class="sup">${hdr('04 · ' + s[3].h.toUpperCase(), 'FOR EVERY STOCKING RETAILER')}
      <div class="sgrid">
        <div><span class="no">01</span><b>Design Service</b><p>Complimentary heater selection, placement and coverage drawings from photos, plans or drawings.</p><p class="mono">${DS}</p></div>
        <div><span class="no">02</span><b>Listed</b><p>Intertek ETL / cETL listed electric ranges.</p></div>
        <div><span class="no">03</span><b>Warranty</b><p>Up to 3 years of warranty cover on Platinum Electric, Eclipse and Tungsten Series II.</p><p class="mono">Series II terms: ${TC}</p></div>
        <div><span class="no">04</span><b>Retailer Program</b><p>Retailer program terms, including pricing, design plans, extended warranty and a point of contact.</p><p class="mono">Terms: ${TC}</p></div>
      </div></div>
    ${ctaRow('MEET YOUR BROMIC REP', '', `${QUOTE} ${WIFI}`)}
  </div>
  ${strip('01', 'Why Stock Bromic', 'Bromic Lookbook 2026 · data/product-facts.json (Tungsten, Platinum, Eclipse, gas, Affinity, design service) · Series II launch deck · Retail Hub, why-bromic')}
</section>`;
};

// =====================================================================================================
// 02 · WHICH HEATER FOR WHICH SPACE (blueprint matrix)
// =====================================================================================================
// small pictograms, one per space (24 × 20)
const pic = {
  wall: `<path d="M3 2 V22 M3 2 H23" class="o"/><rect x="5" y="4" width="12" height="3.4" rx="1.4" class="h"/><rect x="5" y="9" width="3.4" height="9" rx="1.4" class="h"/><path d="M9 7 l-2 9 M14 8 l1 9 M10 13 l6 6" class="r"/>`,
  shallow: `<path d="M1 4 H25" class="o"/><path d="M1 1 H25" class="o"/><rect x="7" y="1.6" width="12" height="2.4" class="h"/><path d="M10 6 l-2 14 M13 6 v14 M16 6 l2 14" class="r"/>`,
  pitched: `<path d="M1 12 L13 2 L25 12" class="o"/><path d="M13 3 V10" class="o"/><rect x="7" y="10" width="12" height="3" rx="1.3" class="h"/><path d="M10 15 l-2 7 M16 15 l2 7" class="r"/>`,
  coastal: `<path d="M1 16 q3 -3 6 0 t6 0 t6 0 t6 0" class="o"/><path d="M1 21 q3 -3 6 0 t6 0 t6 0 t6 0" class="o"/><path d="M3 3 H23" class="o"/><rect x="7" y="4" width="12" height="3" rx="1.3" class="h"/>`,
  design: `<path d="M1 3 H25" class="o"/><rect x="6" y="3" width="14" height="3" class="h"/><path d="M2 15 q11 -10 22 0 q-11 10 -22 0 Z" class="o"/><circle cx="13" cy="15" r="3" class="h"/>`,
  dining: `<path d="M13 1 V7" class="o"/><path d="M5 9 q8 -3 16 0 Z" class="h"/><path d="M4 17 H22 M7 17 V23 M19 17 V23" class="o"/><path d="M10 11 l-1 4 M16 11 l1 4" class="r"/>`,
  open: `<path d="M5 23 V6 q0 -4 6 -4 h6" class="o"/><path d="M12 5 q6 -2 11 0 Z" class="h"/><path d="M14 23 H24 M16 19 H22 V23" class="o"/><path d="M16 8 l-1 7 M21 8 l1 7" class="r"/>`,
};
const PICS = ['wall', 'shallow', 'pitched', 'coastal', 'design', 'dining', 'open'];
const rangeSelector = () => {
  const s = PG['range-selector'].sections;
  const tbl = s[0].table;
  const tiers = s[1].table.rows;
  const timg = [['t-classic', 'contain', '50% 50%', 'January 2027'], ['t-select', 'contain', '50% 50%', 'Available now'], ['t-coastal', 'cover', '50% 34%', 'Available now']];
  return `<section class="page light">
  <div class="grid"></div>${zones()}<div class="frame"></div>
  <div class="flow">
  ${bpHead('range-selector', 'THE RANGE', PG['range-selector'].summary + ' Find the space on the left, read across for the heater, then quote the controls in the last column.')}
  <div class="sec">${hdr('BY SPACE · WHAT TO QUOTE', 'CONTROLS ARE QUOTED WITH EVERY HEATER')}
    <table class="mx sel"><colgroup><col style="width:44px"><col style="width:124px"><col style="width:190px"><col style="width:142px"><col></colgroup>
    <thead><tr><th></th>${tbl.head.map((h) => `<th>${h.toUpperCase()}</th>`).join('')}</tr></thead><tbody>
    ${tbl.rows.map((r, i) => `<tr><td class="pic"><svg viewBox="0 0 26 24" class="pg">${pic[PICS[i]]}</svg></td><td class="ser">${t(r[0])}</td><td>${t(r[1])}</td><td>${r[2] === '–' ? '<span class="no-m">–</span>' : t(r[2])}</td><td class="ctl">${t(r[3])}</td></tr>`).join('')}
    </tbody></table></div>
  <div class="split">
    <div class="sec">${hdr('TUNGSTEN SERIES II · ' + s[1].h.toUpperCase(), 'SELECT AND COASTAL AVAILABLE NOW')}
      <div class="tiers">${tiers.map((r, i) => `<div class="tier${i === 2 ? ' best' : ''}"><div class="tl"><span class="lbl">${r[0].toUpperCase()}</span><span class="av">${timg[i][3]}</span></div>
        <div class="ti" style="background-image:url(img/${timg[i][0]}.jpg);background-size:${timg[i][1]};background-position:${timg[i][2]}"></div>
        <p class="tn">${t(r[1].replace(/\s*\(January 2027\)/, ''))}</p><p class="tw"><i>WINS ON</i>${r[2]}</p><p class="tq"><i>QUOTE WITH</i>Affinity Dimmer</p></div>`).join('')}</div>
      <div class="bar"><span>GOOD</span><span>BETTER</span><span>BEST</span></div>
    </div>
    <div class="sec gas">${hdr(s[2].h.toUpperCase())}
      <svg viewBox="0 0 200 92" class="dwg">
        <text x="0" y="10" class="boxt">ELECTRIC · DIMS</text>
        <rect x="0" y="16" width="180" height="10" class="box"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => `<rect x="${1 + k * 17.9}" y="17" width="${16.5}" height="8" fill="${T.flame}" opacity="${0.1 + k * 0.09}"/>`).join('')}
        <text x="0" y="36" class="boxs">AFFINITY DIMMER · 1% STEPS</text>
        <text x="0" y="56" class="boxt">MOUNTED GAS · ON OR OFF</text>
        <rect x="0" y="62" width="88" height="10" class="box"/><rect x="92" y="62" width="88" height="10" class="box" style="fill:${T.flame};opacity:.85"/>
        <text x="44" y="69.5" class="tiny" text-anchor="middle">OFF</text><text x="136" y="69.5" class="tiny" text-anchor="middle" style="fill:#fff">ON</text>
        <text x="0" y="84" class="boxs">AFFINITY ON/OFF</text>
      </svg>
      ${bul(s[2].bullets)}</div>
  </div>
  ${ctaRow('REQUEST YOUR DESIGN PLAN', DS, `${WIFI} Coastal means coastal homes and venues, not boats.`)}
  </div>
  ${strip('02', 'Which Heater For Which Space', 'Series II launch deck (tiers, portfolio, accessories) · Platinum Electric, Platinum Gas, Tungsten Gas and Eclipse frameworks · data/product-facts.json Affinity controls · Retail Hub, range-selector')}
</section>`;
};

// =====================================================================================================
// 03 · SIZING IN 60 SECONDS (blueprint, worked diagram)
// =====================================================================================================
const FT = 7.2; // px a foot in the plans
const plan = (ox, oy, kind) => {
  const W = 40 * FT, H = 20 * FT;
  const cid = 'clip-' + kind;
  let g = `<clipPath id="${cid}"><rect x="${ox}" y="${oy}" width="${W}" height="${H}"/></clipPath><rect x="${ox}" y="${oy}" width="${W}" height="${H}" class="terr"/>`;
  let cov = '';
  // ten tables of four on a 5 × 2 grid
  const tables = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) tables.push([4 + c * 8, 5 + r * 10]);
  tables.forEach(([x, y]) => {
    const cx = ox + x * FT, cy = oy + y * FT;
    g += `<rect x="${cx - 1.6 * FT}" y="${cy - 1.6 * FT}" width="${3.2 * FT}" height="${3.2 * FT}" class="tbl"/>`;
    [[0, -2.6], [0, 2.6], [-2.6, 0], [2.6, 0]].forEach(([dx, dy]) => { g += `<rect x="${cx + dx * FT - 0.8 * FT}" y="${cy + dy * FT - 0.6 * FT}" width="${1.6 * FT}" height="${1.2 * FT}" class="chr"/>`; });
  });
  if (kind === 'elec') {
    const hs = [[5, 4.6], [15, 4.6], [25, 4.6], [35, 4.6], [10, 15.4], [20, 15.4], [30, 15.4]];
    hs.forEach(([x, y], i) => {
      const cx = ox + x * FT, cy = oy + y * FT;
      cov += `<ellipse cx="${cx}" cy="${cy}" rx="${5.6 * FT}" ry="${5.2 * FT}" class="cov"/>`;
    });
    g += `<g clip-path="url(#${cid})">${cov}</g>`;
    hs.forEach(([x, y], i) => {
      const cx = ox + x * FT, cy = oy + y * FT;
      g += `${heater(cx - 2.6 * FT, cy - 0.45 * FT, 5.2 * FT, 0.9 * FT)}<rect x="${cx - 9}" y="${cy + 0.75 * FT}" width="18" height="8" fill="#fff" stroke="${T.flame}" stroke-width=".5"/><text x="${cx}" y="${cy + 0.75 * FT + 6}" class="chn" text-anchor="middle">CH${i + 1}</text>`;
    });
  } else {
    tables.forEach(([x, y]) => {
      const cx = ox + (x + 2.9) * FT, cy = oy + (y - 2.9) * FT;
      g += `<circle cx="${cx}" cy="${cy}" r="${3.0 * FT}" class="cov" clip-path="url(#${cid})"/><circle cx="${cx}" cy="${cy}" r="${0.75 * FT}" class="twr"/><circle cx="${cx}" cy="${cy}" r="${0.25 * FT}" fill="${T.flame}"/>`;
    });
  }
  // dimensions
  g += `<line x1="${ox}" y1="${oy + H + 10}" x2="${ox + W}" y2="${oy + H + 10}" class="dim" marker-start="url(#arS)" marker-end="url(#arS)"/>
    <text x="${ox + W / 2}" y="${oy + H + 20}" class="tiny" text-anchor="middle">40 FT</text>
    <line x1="${ox + W + 10}" y1="${oy}" x2="${ox + W + 10}" y2="${oy + H}" class="dim" marker-start="url(#arS)" marker-end="url(#arS)"/>
    <text x="${ox + W + 20}" y="${oy + H / 2}" class="tiny" text-anchor="middle" transform="rotate(90 ${ox + W + 20} ${oy + H / 2})">20 FT</text>`;
  return g;
};
const COVER = [
  ['Platinum Smart-Heat® Electric 2300 / 3400 / 4500 W', '65 / 108 / 143 ft²', 'Affinity Dimmer or On/Off'],
  ['Tungsten Smart-Heat® Electric Series II, Select and Coastal', 'About 64–144 ft², by model', 'Affinity Dimmer or On/Off'],
  ['Eclipse Smart-Heat® Electric and Freestanding', 'Up to 121 ft²', 'Affinity Eclipse Controller (pendant); Eclipse Dimmer Controller and remote'],
  ['Platinum Gas 23,600 / 39,800 BTU · Tungsten Gas, mounted', '160 / 215 ft²', 'Affinity On/Off'],
  ['Tungsten Smart-Heat® Freestanding Gas', 'About 215 ft² · 4 seats at most', 'Set at its own knob'],
];
const sizing = () => {
  const s = PG['sizing'].sections;
  const f = s[1].table.rows;
  const factors = `<div class="facts">
    <table class="mx fx"><thead><tr><th>COVER</th><th>FACTOR</th></tr></thead><tbody>${f.map((r, i) => `<tr${i === 1 ? ' class="on"' : ''}><td>${r[0]}</td><td class="n">${r[1]}</td></tr>`).join('')}</tbody></table>
    <table class="mx fx"><thead><tr><th>EVENINGS YOU HEAT</th><th>FACTOR</th></tr></thead><tbody>${f.map((r, i) => `<tr${i === 1 ? ' class="on"' : ''}><td>${t(r[2])}</td><td class="n">${r[3]}</td></tr>`).join('')}</tbody></table>
  </div>`;
  const steps = [
    ['SEATS', '40', 'Count the seats'],
    ['AREA', '800 ft²', '40 × 20 ft² a seat'],
    ['FACTORS', '1.0 × 0.85', 'Partly covered × cool'],
    ['DIVIDE', '6.6', '800 ÷ (143 × 1.0 × 0.85)'],
    ['ROUND UP', '7', 'Platinum Electric 4500 W'],
  ];
  const dwg = `<svg viewBox="0 0 678 232" class="dwg" role="img" aria-label="Plan of a 40 by 20 ft terrace with ten tables of four: seven Platinum Electric heaters on seven dimmer channels, or ten freestanding gas towers, one for every four seats">
    <text x="0" y="10" class="boxt">A · ELECTRIC, OVERHEAD</text><text x="0" y="21" class="boxs">PLATINUM ELECTRIC 4500 W · 143 FT² EACH</text>
    ${plan(0, 30, 'elec')}
    <text x="0" y="214" class="flamet">7 HEATERS · 7 DIMMER CHANNELS</text><text x="0" y="226" class="boxs">E.G. A 5-CHANNEL + A 2-CHANNEL DIMMER · WALL SWITCH</text>
    <text x="352" y="10" class="boxt">B · GAS, FREESTANDING</text><text x="352" y="21" class="boxs">TUNGSTEN FREESTANDING GAS · 215 FT² EACH</text>
    ${plan(352, 30, 'gas')}
    <text x="352" y="214" class="flamet">10 TOWERS · NOT 5</text><text x="352" y="226" class="boxs">800 ÷ (215 × 0.85) = 4.4, BUT 4 SEATS A TOWER AT MOST</text>
  </svg>`;
  return `<section class="page light">
  <div class="grid"></div>${zones()}<div class="frame"></div>
  <div class="flow">
  ${bpHead('sizing', 'PLAN YOUR SPACE', s[0].body[0])}
  <div class="formula"><span class="lbl">THE ONE SUM</span><p>heaters = area ÷ (coverage × cover factor × climate factor)<em>, rounded up</em></p></div>
  <div class="sec">${hdr('THE TWO FACTORS', 'FACTORS: <i class="tcw">TO CONFIRM</i>')}${factors}
    <p class="fn">Highlighted: the worked example below. Not sure of the site? Use partly covered and cool (0.85 combined) and say so.</p></div>
  <div class="sec">${hdr('WHAT ONE HEATER COVERS', 'APPROXIMATE · VARIES WITH MODEL, MOUNTING AND CONDITIONS')}
    <table class="mx cov2"><colgroup><col style="width:34%"><col style="width:30%"><col></colgroup><thead><tr><th>HEATER</th><th>COVERAGE A HEATER</th><th>CONTROLS TO QUOTE</th></tr></thead><tbody>
    ${COVER.map(([h, c, k]) => `<tr><td class="ser">${t(h)}</td><td class="mono2">${c}</td><td class="ctl">${t(k)}</td></tr>`).join('')}</tbody></table></div>
  <figure class="panel">${hdr('WORKED EXAMPLE · 40 SEATS, PARTLY COVERED, COOL', 'ILLUSTRATIVE LAYOUT · NOT A DESIGN PLAN')}
    <ol class="steps">${steps.map(([k, v, d], i) => `<li><span class="no">${i + 1}</span><b>${k}</b><strong>${v}</strong>${d}</li>`).join('')}</ol>
    ${dwg}
  </figure>
  <div class="two w2">
    <div class="note"><b>CONTROLS FOR EXAMPLE A</b><p>Affinity Dimmers at one 4500 W heater a channel – seven channels, for example a 5-channel and a 2-channel Dimmer – and a manual wall switch. Controller capacities: ${TC}</p></div>
    <div class="note"><b>CONTROLS FOR EXAMPLE B</b><p>Each Tungsten Smart-Heat® Freestanding Gas tower is set at its own knob. A freestanding heater serves 4 seats at most, so 40 ÷ 4 = 10 towers.</p></div>
  </div>
  ${ctaRow('REQUEST YOUR DESIGN PLAN', DS, `${s[3].h}: send the customer's photos or plans to the complimentary design service for a full plan. ${WIFI}`)}
  </div>
  ${strip('03', 'Sizing In 60 Seconds', 'templates/calculation-model.md (20 ft² a seat; cover and climate factors; 4 seats a freestanding heater) · data/product-facts.json: Platinum Electric, Tungsten Freestanding Gas, Affinity controls, design service')}
</section>`;
};

// =====================================================================================================
// 04 · INSTALLATION, WARRANTY AND SUPPORT (blueprint)
// =====================================================================================================
const installWarranty = () => {
  const s = PG['install-warranty'].sections;
  const F = 186, SC = 1.42, y = (inch) => +(F - inch * SC).toFixed(1);
  const elev = `<svg viewBox="0 0 300 206" class="dwg" role="img" aria-label="Elevation: electric wall mount at least 72 in, electric ceiling mount at least 96 in and gas at least 96 in above the floor">
    <rect x="6" y="${y(120)}" width="10" height="${F - y(120)}" style="fill:url(#hatch)" class="cut"/>
    <rect x="6" y="${F}" width="290" height="8" style="fill:url(#hatch)" class="cut"/>
    <rect x="16" y="${y(120)}" width="280" height="8" style="fill:url(#hatch)" class="cut"/>
    <line x1="16" y1="${y(96)}" x2="296" y2="${y(96)}" class="lvl"/><line x1="16" y1="${y(72)}" x2="120" y2="${y(72)}" class="lvl"/>
    <!-- electric wall -->
    <line x1="16" y1="${y(76)}" x2="26" y2="${y(76)}" class="obj" style="stroke-width:2"/>
    <g transform="rotate(30 26 ${y(76)})"><rect x="24" y="${y(76) - 2}" width="34" height="10" rx="4" class="heat"/></g>
    <line x1="70" y1="${F}" x2="70" y2="${y(72)}" class="dim" marker-start="url(#arF)" marker-end="url(#arF)" style="stroke:${T.flame}"/>
    <text x="74" y="${y(36)}" class="railv">72 IN</text><text x="74" y="${y(36) + 10}" class="raill">ELECTRIC · WALL</text>
    ${bub(40, y(92), 1, true)}
    <!-- electric ceiling -->
    <line x1="160" y1="${y(116)}" x2="160" y2="${y(100)}" class="obj" style="stroke-width:2"/>
    ${heater(134, y(100), 52, 8)}
    <line x1="160" y1="${F}" x2="160" y2="${y(96)}" class="dim" marker-start="url(#arF)" marker-end="url(#arF)" style="stroke:${T.flame}"/>
    <text x="164" y="${y(56)}" class="railv">96 IN</text><text x="164" y="${y(56) + 10}" class="raill">ELECTRIC · CEILING</text>
    ${bub(198, y(106), 2, true)}
    <!-- gas -->
    <line x1="256" y1="${y(116)}" x2="256" y2="${y(102)}" class="obj" style="stroke-width:2"/>
    <rect x="238" y="${y(102)}" width="36" height="14" rx="1.5" class="heat"/>${[0, 1, 2, 3].map((k) => `<rect x="${242 + k * 7.5}" y="${y(102) + 3}" width="5.5" height="8" fill="${T.flame}" opacity=".55"/>`).join('')}
    <line x1="256" y1="${F}" x2="256" y2="${y(96)}" class="dim" marker-start="url(#arF)" marker-end="url(#arF)" style="stroke:${T.flame}"/>
    <text x="252" y="${y(30)}" class="railv" text-anchor="end">96 IN</text><text x="252" y="${y(30) + 10}" class="raill" text-anchor="end">GAS</text>
    ${bub(284, y(112), 3, true)}
    <text x="20" y="${F + 18}" class="boxs">FINISHED FLOOR · MINIMUMS, VARYING WITH OUTPUT</text>
  </svg>`;
  // warranty bars: years of cover, as published; open terms print "to confirm"
  const W = [
    ['Tungsten Series II', [[3, '']], 'Element cover and Coastal terms to confirm'],
    ['Tungsten Electric (Series I)', [[2, 'heater'], [7, 'elements']], ''],
    ['Platinum Electric', [[3, '']], ''],
    ['Platinum Electric Marine', [[5, 'on land'], [3, 'on vessels']], ''],
    ['Eclipse Electric and Freestanding', [[3, '']], ''],
    ['Platinum Gas, Tungsten Gas (mounted)', [[2, '']], 'Excl. hoses and igniters'],
    ['Tungsten Freestanding (propane)', [[1, '']], 'Natural gas model to confirm'],
    ['Affinity Smart-Heat® Controls', [[1, '']], ''],
  ];
  const X0 = 190, PX = 38;
  let yy = 18, rows = '';
  for (const [n, bars, note] of W) {
    const h = bars.length * 12 + (bars.length - 1) * 3;
    rows += `<text x="0" y="${yy + h / 2 + 3}" class="wn">${n.replace('®', '®')}</text>`;
    bars.forEach(([v, l], k) => {
      const by = yy + k * 15;
      rows += `<rect x="${X0}" y="${by}" width="${v * PX}" height="12" class="${k ? 'wb2' : 'wb'}"/><text x="${X0 + v * PX + 5}" y="${by + 9}" class="wv">${v} YR${v > 1 ? 'S' : ''}${l ? ' · ' + l.toUpperCase() : ''}</text>`;
    });
    if (note) rows += `<text x="${X0 + Math.max(...bars.map((b) => b[0])) * PX + 62}" y="${yy + 9}" class="${/confirm/.test(note) ? 'wt' : 'wx'}">${note.toUpperCase()}</text>`;
    yy += h + 12;
  }
  const ticks = [0, 1, 2, 3, 4, 5, 6, 7].map((v) => `<line x1="${X0 + v * PX}" y1="10" x2="${X0 + v * PX}" y2="${yy - 4}" class="tick"/><text x="${X0 + v * PX}" y="7" class="tiny" text-anchor="middle">${v}</text>`).join('');
  const bars = `<svg viewBox="0 0 678 ${yy}" class="dwg" role="img" aria-label="Warranty cover in years by heater">${ticks}${rows}</svg>`;
  return `<section class="page light">
  <div class="grid"></div>${zones()}<div class="frame"></div>
  <div class="flow">
  ${bpHead('install-warranty', 'AFTER THE SALE', PG['install-warranty'].summary + ' Installation by a licensed electrician / gas fitter to local code.')}
  <div class="two w3">
    <figure class="panel">${hdr('ELEVATION · MINIMUM MOUNTING HEIGHTS', 'NOT TO SCALE')}${elev}</figure>
    <div class="sec">${hdr('01 · ' + s[0].h.toUpperCase())}
      <ol class="nl">
        <li><b>Licensed installer</b>Installation by a licensed electrician / gas fitter to local code.</li>
        <li><b>Electric · NFPA 70 (NEC)</b>Wall mounts at least 72 in above the floor, ceiling mounts at least 96 in, varying with output.</li>
        <li><b>Gas · ANSI Z223.1/NFPA 54</b>Mount at least 96 in above the floor.</li>
        <li><b>Local authority</b>Check every install with the local building authority, and follow the installation manual for the model.</li>
      </ol></div>
  </div>
  <figure class="panel">${hdr('02 · ' + s[1].h.toUpperCase() + ' · YEARS OF COVER', 'TERMS: <i class="tcw">TO CONFIRM</i> AGAINST BROMIC.COM/WARRANTY')}${bars}</figure>
  <div class="sec">${hdr('03 · ' + s[2].h.toUpperCase())}
    <div class="help">
      <div><b>DESIGN SERVICE</b><p>Complimentary heater selection, placement and coverage drawings.</p><p class="mono">${DS}</p></div>
      <div><b>CLAIMS AND SERVICE</b><p>How a retailer raises a warranty claim, and who handles parts and labour: ${TC}</p></div>
      <div><b>CONTROLS WITH EVERY HEATER</b><p>${t(QUOTE)} ${t(WIFI)}</p></div>
    </div></div>
  ${ctaRow('MEET YOUR BROMIC REP', '', 'Follow the installation manual for the model and local codes. Warranty terms above are as published; check each against bromic.com/warranty before quoting.')}
  </div>
  ${strip('04', 'Installation, Warranty And Support', 'data/product-facts.json: codes (electric, gas), Tungsten, Platinum, Platinum Marine, Eclipse, Platinum Gas, Tungsten Gas, Tungsten Freestanding, Affinity, design service · Series II warranty note')}
</section>`;
};

// =====================================================================================================
// 05 · SELLING ON THE FLOOR (photo-led)
// =====================================================================================================
const selling = () => {
  const s = PG['selling'].sections;
  const qa = s[0].table.rows;
  const cmp = s[1].table.rows;
  return `<section class="page photo">
  ${photoHead('selling', '05', 'sell-hero', '50% 62%', PG['selling'].summary, '<b>PHOTO</b> Platinum Electric, recessed over a waterfront terrace')}
  <div class="flow pflow">
    <div class="sec">${hdr('01 · ' + s[0].h.toUpperCase(), 'FIVE QUESTIONS, FIVE ANSWERS')}
      <div class="qa">${qa.map(([q, a], i) => `<div class="q"><span class="no">Q${i + 1}</span><p class="qq">${q}</p><p class="aa">${t(a)}</p></div>`).join('')}
        <figure class="plate"><div class="pi" style="background-image:url(img/sell-app.jpg);background-position:62% 60%"></div><figcaption><b>PHOTO</b> The Bromic app, with compatible Affinity controls</figcaption></figure>
      </div></div>
    <div class="sec">${hdr('02 · ' + s[1].h.toUpperCase(), 'USE AS WRITTEN')}
      <table class="mx cmp"><colgroup><col style="width:36%"><col></colgroup><thead><tr><th>${s[1].table.head[0].toUpperCase()}</th><th>${s[1].table.head[1].toUpperCase()}</th></tr></thead><tbody>
      ${cmp.map(([a, b]) => `<tr><td class="say">“${a}”</td><td>${t(b)}</td></tr>`).join('')}</tbody></table></div>
    <div class="fair"><b>03 · ${s[2].h.toUpperCase()}</b><p>${t(s[2].body[0])}</p></div>
    ${ctaRow('REQUEST YOUR DESIGN PLAN', DS, `${QUOTE} ${WIFI}`)}
  </div>
  ${strip('05', 'Selling On The Floor', 'data/product-facts.json: radiant, wavelength, outdoor definition, Affinity · Series II, Platinum Electric, Eclipse and Tungsten Gas frameworks (m3, battlecards) · Retail Hub, selling')}
</section>`;
};

// =====================================================================================================
// 06 · DISPLAY AND MERCHANDISING (photo-led, suggested bay drawing)
// =====================================================================================================
const merchandising = () => {
  const s = PG['merchandising'].sections;
  const F = 196, SC = 1.35, y = (inch) => +(F - inch * SC).toFixed(1);
  const bay = `<svg viewBox="0 0 678 222" class="dwg" role="img" aria-label="A suggested display bay: a live heater at its listed height on an Affinity Dimmer with the wall switch and one shelf label, the app on a tablet, Tungsten Classic, Select and Coastal side by side, and an Eclipse pendant over a set table">
    <rect x="0" y="${F}" width="678" height="7" style="fill:url(#hatch)" class="cut"/>
    <line x1="0" y1="${y(140)}" x2="440" y2="${y(140)}" class="obj"/>
    <!-- 1 live heater, controller, switch, label -->
    <line x1="20" y1="${y(72)}" x2="210" y2="${y(72)}" class="lvl"/>
    ${heater(40, y(84), 110, 12)}
    <path d="M60 ${y(80)} l-10 60 M95 ${y(80)} v62 M130 ${y(80)} l10 60" class="rayp"/>
    <text x="214" y="${y(72) + 3}" class="railv">72 IN</text><text x="214" y="${y(72) + 13}" class="rails">ELECTRIC WALL MINIMUM</text>
    <rect x="168" y="${y(64)}" width="30" height="38" rx="3" class="box"/>${[0, 1, 2, 3, 4].map((k) => `<line x1="${173 + k * 5}" y1="${y(61)}" x2="${173 + k * 5}" y2="${y(40)}" class="thin"/>`).join('')}
    <rect x="206" y="${y(46)}" width="13" height="20" rx="1.5" class="box"/><rect x="210" y="${y(43)}" width="5" height="10" class="box"/>
    <rect x="166" y="${y(30)}" width="56" height="13" class="lab"/><text x="194" y="${y(30) + 9}" class="tiny" text-anchor="middle">ONE LABEL</text>
    <path d="M150 ${y(78)} H183 V${y(64)}" class="run"/><path d="M198 ${y(52)} H212 V${y(46)}" class="run"/>
    ${bub(30, y(92), 1, true)}${bub(234, y(38), 2, true)}
    <!-- counter with tablet and sizing card -->
    <rect x="20" y="${y(36)}" width="128" height="${36 * SC}" class="cnt"/>
    <rect x="34" y="${y(36) - 26}" width="38" height="26" rx="3" class="box"/><rect x="37" y="${y(36) - 23}" width="32" height="20" class="scr"/>
    ${[0, 1, 2].map((k) => `<line x1="40" y1="${y(36) - 19 + k * 6}" x2="66" y2="${y(36) - 19 + k * 6}" class="thin"/><circle cx="${58 - k * 6}" cy="${y(36) - 19 + k * 6}" r="1.8" fill="#fff" stroke="${T.flame}" stroke-width=".8"/>`).join('')}
    <rect x="88" y="${y(36) - 26}" width="48" height="26" class="lab"/><text x="112" y="${y(36) - 15}" class="tiny" text-anchor="middle">20 FT²</text><text x="112" y="${y(36) - 5}" class="tiny" text-anchor="middle">A SEAT</text>
    ${bub(84, y(36) + 22, 3, true)}
    <!-- the choice: three tiers and samples -->
    <line x1="290" y1="${y(140)}" x2="290" y2="${F}" class="thin" stroke-dasharray="3 3"/>
    ${['CLASSIC · GOOD', 'SELECT · BETTER', 'COASTAL · BEST'].map((n, k) => `${heater(310, y(112) + k * 30, 112, 11)}<text x="428" y="${y(112) + k * 30 + 8}" class="tiny">${n}</text>`).join('')}
    ${[['#1d1d1d', 'BLACK'], ['#ffffff', 'WHITE'], ['#5b5e62', 'GRAPHITE']].map(([c, n], k) => `<rect x="${310 + k * 44}" y="${y(36)}" width="24" height="24" fill="${c}" stroke="${T.draw}" stroke-width=".7"/><text x="${322 + k * 44}" y="${y(36) + 33}" class="tiny" text-anchor="middle">${n}</text>`).join('')}
    <path d="M454 ${y(26)} l10 -9 l10 9 l-10 9 Z" class="box"/><ellipse cx="490" cy="${y(26)}" rx="11" ry="7" class="box"/><path d="M505 ${y(26) + 8} l10 -17 l10 17 Z" class="box"/>
    <text x="490" y="${y(26) + 22}" class="tiny" text-anchor="middle">DIAMOND · OVAL · TRIANGLE</text>
    ${bub(304, y(124), 4, true)}
    <!-- Eclipse over a set table -->
    <line x1="550" y1="${y(140)}" x2="660" y2="${y(140)}" class="obj"/>
    <line x1="604" y1="${y(140)}" x2="604" y2="${y(104)}" class="obj" style="stroke-width:1.6"/>
    <path d="M578 ${y(104)} Q604 ${y(108)} 630 ${y(104)} L626 ${y(101)} Q604 ${y(103.5)} 582 ${y(101)} Z" class="heat"/>
    <ellipse cx="604" cy="${y(101.2)}" rx="22" ry="1.6" fill="none" stroke="${T.flame}" stroke-width="1"/>
    <path d="M590 ${y(99)} l-8 60 M604 ${y(99)} v62 M618 ${y(99)} l8 60" class="rayp"/>
    <path d="M560 ${y(29)} H648 M568 ${y(29)} V${F} M640 ${y(29)} V${F}" class="furn"/>
    <path d="M548 ${F} V${y(17)} H562 M548 ${y(17)} V${y(34)} M660 ${F} V${y(17)} H646 M660 ${y(17)} V${y(34)}" class="furn"/>
    ${bub(650, y(120), 5, true)}
  </svg>`;
  const legend = [
    ['Live heater', 'At its listed height, on an Affinity Dimmer'],
    ['Controls beside it', 'Controller and wall switch, one shelf label'],
    ['The app', 'Zones and schedules on a store tablet'],
    ['Show the choice', 'Classic, Select, Coastal; finishes and fronts'],
    ['Heat and light', 'Eclipse pendant over a set table'],
  ];
  return `<section class="page photo">
  ${photoHead('merchandising', '06', 'merch-hero', '50% 42%', PG['merchandising'].summary, '<b>PHOTO</b> Eclipse Smart-Heat® Electric over a dining table')}
  <div class="flow pflow">
    <figure class="panel">${hdr('A SUGGESTED DISPLAY BAY', 'SUGGESTED · NOT TO SCALE')}${bay}
      <ol class="legend">${legend.map(([b, d], i) => `<li><span class="no">${i + 1}</span><b>${b}</b>${d}</li>`).join('')}</ol></figure>
    <div class="three m3">
      <div class="col"><p class="eyebrow">Suggested</p><h3>${s[0].h}</h3>${bul(s[0].bullets)}</div>
      <div class="col"><p class="eyebrow">Suggested</p><h3>${s[1].h}</h3>${bul(s[1].bullets)}
        <figure class="plate sm"><div class="pi" style="background-image:url(img/merch-dimmer.jpg);background-position:50% 45%"></div><figcaption><b>PHOTO</b> Affinity 2-channel Dimmer and the app</figcaption></figure></div>
      <div class="col"><p class="eyebrow">Suggested</p><h3>${s[2].h}</h3>${bul(s[2].bullets)}</div>
    </div>
    <div class="fair"><b>${s[3].h.toUpperCase()}</b><p>${t(s[3].bullets[0])} Display kits, fixtures and a showroom guide: what is available to retailers and how to order, ${TC}</p></div>
    ${ctaRow('MEET YOUR BROMIC REP', '', `${QUOTE} ${WIFI} Every idea on this page is a suggestion.`)}
  </div>
  ${strip('06', 'Display And Merchandising', 'data/product-facts.json: wavelength, Affinity controls, design service, electric codes · Series II tiers and finishes · Eclipse framework · templates/calculation-model.md · Retail Hub, merchandising')}
</section>`;
};

// =====================================================================================================
// 07 · ORDERING AND SUPPORT (blueprint)
// =====================================================================================================
const ordering = () => {
  const s = PG['ordering'].sections;
  const teams = [
    ['SALES OPERATIONS', ['Price list and SKUs', 'by region', 'Lead times']],
    ['TRADE SALES', ['Minimum orders', 'Account terms']],
    ['MARKETING', ['Marketing co-op', 'Images, literature', 'and sell sheets']],
    ['PRODUCT TEAM', ['Product training']],
  ];
  const tx = [0, 173, 346, 519];
  const flow = `<svg viewBox="0 0 678 162" class="dwg" role="img" aria-label="Your Bromic rep connects the retailer to Sales operations, Trade sales, Marketing and the Product team, each sending its items">
    <rect x="230" y="4" width="218" height="34" rx="2" class="box"/><text x="339" y="19" class="boxt" text-anchor="middle">YOUR STORE</text><text x="339" y="31" class="boxs" text-anchor="middle">ASK ONE PERSON</text>
    <line x1="339" y1="38" x2="339" y2="52" class="run" marker-end="url(#arD)"/>
    <rect x="250" y="52" width="178" height="26" rx="13" class="boxf"/><text x="339" y="68.5" class="flamet" text-anchor="middle">YOUR BROMIC REP</text>
    <path d="M339 78 V90 M${tx[0] + 79} 90 H${tx[3] + 79}" class="run"/>
    ${teams.map(([n, items], i) => `<line x1="${tx[i] + 79}" y1="90" x2="${tx[i] + 79}" y2="100" class="run" marker-end="url(#arD)"/>
      <rect x="${tx[i]}" y="100" width="159" height="60" class="box"/><text x="${tx[i] + 9}" y="115" class="boxt">${n}</text>
      ${items.map((it, k) => `<text x="${tx[i] + 9}" y="${130 + k * 11}" class="boxs">${it.toUpperCase()}</text>`).join('')}`).join('')}
  </svg>`;
  const line = `<svg viewBox="0 0 330 64" class="dwg" role="img" aria-label="One order line: the heater, its Affinity Smart-Heat Controls and a wall switch">
    <rect x="2" y="10" width="92" height="40" class="box"/>${heater(10, 22, 76, 10)}<text x="48" y="44" class="tiny" text-anchor="middle">HEATER</text>
    <text x="108" y="35" class="flamet" text-anchor="middle">+</text>
    <rect x="122" y="10" width="92" height="40" class="box"/><rect x="156" y="16" width="22" height="20" rx="2" class="box"/>${[0, 1, 2].map((k) => `<line x1="${161 + k * 6}" y1="19" x2="${161 + k * 6}" y2="33" class="thin"/>`).join('')}<text x="168" y="44" class="tiny" text-anchor="middle">AFFINITY CONTROLS</text>
    <text x="228" y="35" class="flamet" text-anchor="middle">+</text>
    <rect x="242" y="10" width="86" height="40" class="box"/><rect x="278" y="16" width="12" height="20" rx="1.5" class="box"/><rect x="281.5" y="21" width="5" height="9" class="box"/><text x="285" y="44" class="tiny" text-anchor="middle">WALL SWITCH</text>
    <text x="2" y="62" class="boxs">ONE ORDER LINE, EVERY TIME</text>
  </svg>`;
  return `<section class="page light">
  <div class="grid"></div>${zones()}<div class="frame"></div>
  <div class="flow">
  ${bpHead('ordering', 'WORKING WITH BROMIC', PG['ordering'].summary + ' Your Bromic rep is the one point of contact; each item below comes from the team named.')}
  <figure class="panel">${hdr('WHO SENDS WHAT', 'ONE POINT OF CONTACT')}${flow}</figure>
  <div class="sec">${hdr('01 · ' + s[0].h.toUpperCase(), 'DETAILS FROM EACH TEAM')}
    <table class="mx rec"><colgroup><col style="width:40%"><col style="width:22%"><col></colgroup><thead><tr>${s[0].table.head.map((h) => `<th>${h.toUpperCase()}</th>`).join('')}</tr></thead><tbody>
    ${s[0].table.rows.map((r) => `<tr><td class="ser">${r[0]}</td><td class="mono2">${r[1].toUpperCase()}</td><td>${t(r[2])}</td></tr>`).join('')}</tbody></table></div>
  <div class="sec">${hdr('02 · ' + s[1].h.toUpperCase(), 'SKUS AS READ FROM BROMIC.COM · <i class="tcw">TO CONFIRM</i> AGAINST 2026 CUT SHEETS')}
    <table class="mx sku"><colgroup><col style="width:34%"><col></colgroup><thead><tr>${s[1].table.head.map((h) => `<th>${h.toUpperCase()}</th>`).join('')}</tr></thead><tbody>
    ${s[1].table.rows.map((r) => `<tr><td class="ser">${r[0]}</td><td class="mono2">${r[1]}</td></tr>`).join('')}</tbody></table></div>
  <div class="two w4">
    <div class="sec">${hdr('03 · ' + s[2].h.toUpperCase())}${line}</div>
    <ul class="bl gk"><li>${t('Every order line for a heater carries its Affinity Smart-Heat® Controls and wall switch.')}</li><li>${t(WIFI)}</li><li>Prices stay off customer-facing material.</li><li>Series II SKUs: ${TC}</li></ul>
  </div>
  ${ctaRow('MEET YOUR BROMIC REP', '', 'Ask your Bromic rep for the price list, SKUs and lead times for your region; they come from Sales operations.')}
  </div>
  ${strip('07', 'Ordering And Support', 'data/product-facts.json: Platinum Electric, Platinum Gas, Tungsten Gas (site models) · Eclipse framework tiers · Series II and Platinum Electric price_verify · Retail Hub, ordering')}
</section>`;
};

// ---------- styles ----------
const css = `
@font-face{font-family:BzDidot;src:url('${rel('app/src/fonts/gfs-didot-latin.woff2')}') format('woff2')}
@font-face{font-family:BzSans;src:url('${rel('app/src/fonts/arimo-latin.woff2')}') format('woff2')}
@font-face{font-family:BzMono;src:url('${rel('reports/themes/blueprint/fonts/plex-mono-400.woff2')}') format('woff2');font-weight:400}
@font-face{font-family:BzMono;src:url('${rel('reports/themes/blueprint/fonts/plex-mono-500.woff2')}') format('woff2');font-weight:500}
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:BzSans,'Helvetica Neue',Arial,sans-serif;color:${T.ink};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:8.5in;height:11in;position:relative;overflow:hidden;background:#fff}
sup.r{font-size:.5em;vertical-align:.7em;line-height:0;margin-left:.04em}
.lbl,.eyebrow{font:500 7.4px/1.2 BzMono,monospace;letter-spacing:.16em;text-transform:uppercase}
.eyebrow{color:${T.flame}}
h1,h2,h3{font-family:BzDidot,Didot,serif;font-weight:400}
.tc{color:${T.flame};font-style:italic;font-family:BzMono,monospace;font-size:.9em;letter-spacing:.02em;white-space:nowrap}
.tcw{font-style:italic;color:${T.flame}}
.mono{font:400 7px/1.45 BzMono,monospace;letter-spacing:.03em;color:${T.draw};margin-top:3px}
.no-m{color:${T.steel}}
/* blueprint sheet */
.grid{position:absolute;inset:.42in;pointer-events:none;background-image:linear-gradient(rgba(28,43,68,.07) .6px,transparent .6px),linear-gradient(90deg,rgba(28,43,68,.07) .6px,transparent .6px),linear-gradient(rgba(28,43,68,.028) .5px,transparent .5px),linear-gradient(90deg,rgba(28,43,68,.028) .5px,transparent .5px);background-size:1in 1in,1in 1in,.125in .125in,.125in .125in}
.frame{position:absolute;inset:.42in;border:.9px solid ${T.draw};pointer-events:none}
.zones{position:absolute;inset:.3in;border:.5px solid ${T.steel};color:${T.steel};font:500 6px/1 BzMono,monospace;letter-spacing:.1em;pointer-events:none}
.zones .zt,.zones .zb{position:absolute;left:.12in;right:.12in;height:.12in}.zones .zt{top:0}.zones .zb{bottom:0}
.zones .zl,.zones .zr{position:absolute;top:.12in;bottom:.12in;width:.12in}.zones .zl{left:0}.zones .zr{right:0}
.zones span{position:absolute;transform:translate(-50%,-50%)}
.zones .zt span,.zones .zb span{top:50%}.zones .zl span,.zones .zr span{left:50%}
.flow{position:absolute;left:.72in;right:.72in;top:.62in;bottom:1.0in;display:flex;flex-direction:column;gap:11px}
.flow>*{flex:none}
.flow{justify-content:space-between}
.s-head{display:flex;gap:.3in;align-items:flex-start}
.s-text{flex:1}
.brand{display:flex;align-items:center;justify-content:space-between;border-bottom:.9px solid ${T.draw};padding-bottom:7px;margin-bottom:11px;color:${T.draw}}
.logo{height:15px;display:block}
.s-head h2{font-size:32px;line-height:1.06;margin:5px 0 7px;color:${T.ink}}
.s-lede{font-size:11px;line-height:1.55;color:#3f3b3c;max-width:6.2in}
.ph{border:.6px solid ${T.draw};padding:4px;background:#fff}
.ph.top{width:1.5in;flex:none}
.ph-img{height:.92in;background-size:cover;background-position:center}
.ph figcaption,.plate figcaption{display:block;font:400 6.6px/1.4 BzMono,monospace;letter-spacing:.04em;margin-top:4px;color:${T.steel}}
.ph figcaption b,.plate figcaption b{font-weight:500;color:${T.flame};margin-right:4px;letter-spacing:.14em}
.hdr{display:flex;justify-content:space-between;gap:12px;border-bottom:.9px solid ${T.draw};padding-bottom:5px;margin-bottom:7px;color:${T.draw}}
.hdr .r{color:${T.flame};text-align:right}
.panel{color:${T.draw}}
.dwg{display:block;width:100%;height:auto;overflow:visible}
.dwg .cut{stroke:${T.draw};stroke-width:.9}
.dwg .obj{stroke:${T.draw};stroke-width:1;fill:none}
.dwg .thin{stroke:${T.draw};stroke-width:.5;fill:none}
.dwg .dim{stroke:${T.draw};stroke-width:.6}
.dwg .lvl{stroke:${T.flame};stroke-width:.5;stroke-dasharray:6 4;opacity:.6}
.dwg .heat{fill:#fff;stroke:${T.draw};stroke-width:1}
.dwg .box{fill:#fff;stroke:${T.draw};stroke-width:.9}
.dwg .boxf{fill:#fff;stroke:${T.flame};stroke-width:1.1}
.dwg .scr{fill:#fff;stroke:${T.draw};stroke-width:.5}
.dwg .lab{fill:rgba(239,65,35,.06);stroke:${T.flame};stroke-width:.7}
.dwg .cnt{fill:#fff;stroke:${T.draw};stroke-width:.9}
.dwg .run{stroke:${T.draw};stroke-width:1;fill:none}
.dwg .rayp{stroke:${T.flame};stroke-width:.6;stroke-dasharray:3 3;fill:none;opacity:.75}
.dwg .furn{stroke:${T.steel};stroke-width:.8;fill:none}
.dwg .boxt{font:500 8.2px BzMono,monospace;letter-spacing:.06em;fill:${T.draw}}
.dwg .boxs{font:400 7px BzMono,monospace;letter-spacing:.05em;fill:${T.steel}}
.dwg .tiny{font:500 6.6px BzMono,monospace;letter-spacing:.05em;fill:${T.draw}}
.dwg .flamet{font:500 8.8px BzMono,monospace;letter-spacing:.1em;fill:${T.flame}}
.dwg .railv{font:500 10px BzMono,monospace;letter-spacing:.04em;fill:${T.flame}}
.dwg .raill{font:500 6.8px BzMono,monospace;letter-spacing:.08em;fill:${T.draw}}
.dwg .rails{font:400 6.4px BzMono,monospace;letter-spacing:.06em;fill:${T.steel}}
.dwg .chn{font:500 6px BzMono,monospace;letter-spacing:.04em;fill:${T.flame}}
.dwg .bub{fill:#fff;stroke:${T.draw};stroke-width:.9}.dwg .bubf{fill:#fff;stroke:${T.flame};stroke-width:1}
.dwg .bubt{font:500 8px BzMono,monospace;fill:${T.draw}}.dwg .bubt.f{fill:${T.flame}}
.dwg .terr{fill:rgba(28,43,68,.025);stroke:${T.draw};stroke-width:1}
.dwg .tbl{fill:#fff;stroke:${T.steel};stroke-width:.7}
.dwg .chr{fill:none;stroke:${T.steel};stroke-width:.5}
.dwg .cov{fill:rgba(239,65,35,.07);stroke:${T.flame};stroke-width:.6;stroke-dasharray:3 2}
.dwg .twr{fill:#fff;stroke:${T.draw};stroke-width:1}
.dwg .tick{stroke:${T.hair};stroke-width:.5}
.dwg .wn{font:400 9.4px BzSans,Arial,sans-serif;fill:${T.ink}}
.dwg .wb{fill:${T.draw}}.dwg .wb2{fill:none;stroke:${T.draw};stroke-width:.8}
.dwg .wv{font:500 7.6px BzMono,monospace;letter-spacing:.06em;fill:${T.draw}}
.dwg .wt{font:500 7px BzMono,monospace;letter-spacing:.05em;fill:${T.flame};font-style:italic}
.dwg .wx{font:400 7px BzMono,monospace;letter-spacing:.05em;fill:${T.steel}}
.mx{width:100%;border-collapse:collapse;table-layout:fixed;font-size:9.2px;line-height:1.36;color:${T.ink}}
.mx th{font:500 7px/1.2 BzMono,monospace;letter-spacing:.12em;text-align:left;color:${T.steel};padding:0 8px 5px 0;border-bottom:.6px solid ${T.draw};vertical-align:bottom}
.mx td{padding:5px 8px 5px 0;border-bottom:.5px solid ${T.hair};vertical-align:top}
.mx td.ser{font-weight:700}
.mx td.ctl{color:${T.draw}}
.mx td.pic{padding:5px 6px 4px 0}
.mx.sel td{padding-top:8px;padding-bottom:8px;font-size:9.6px}.mx.sel td.pic{padding-top:5px;padding-bottom:4px}
.split .ti{height:.95in}
.mx .mono2{font:400 7.2px/1.45 BzMono,monospace;letter-spacing:.02em;color:${T.draw}}
.pg{width:34px;height:31px;display:block}
.pg .o{stroke:${T.draw};stroke-width:1;fill:none}.pg .h{fill:#fff;stroke:${T.draw};stroke-width:.9}.pg .r{stroke:${T.flame};stroke-width:.7;stroke-dasharray:1.6 1.4;fill:none}
.split{display:grid;grid-template-columns:1fr 2.05in;gap:.24in}
.tiers{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.tier{border:.7px solid ${T.draw};padding:6px 8px 7px;background:#fff}
.tier.best{border-color:${T.flame}}
.tl{display:flex;justify-content:space-between;align-items:center;color:${T.draw}}
.tier.best .tl .lbl{color:${T.flame}}
.av{font:500 6.2px/1 BzMono,monospace;letter-spacing:.1em;text-transform:uppercase;color:${T.steel}}
.ti{height:.7in;margin:6px 0;background-repeat:no-repeat;background-color:#fff}
.tn{font-family:BzDidot,serif;font-size:17px;line-height:1.1}
.tw,.tq{font-size:9px;line-height:1.35;margin-top:4px;color:#3f3b3c}
.tw i,.tq i{display:block;font:500 6.2px BzMono,monospace;font-style:normal;letter-spacing:.12em;color:${T.steel}}
.tq i{color:${T.flame}}
.bar{display:grid;grid-template-columns:repeat(3,1fr);margin-top:6px;height:12px;background:linear-gradient(90deg,rgba(28,43,68,.12),rgba(239,65,35,.6));font:500 6.2px/12px BzMono,monospace;letter-spacing:.2em;color:${T.draw};text-align:center}
.gas .dwg{margin-bottom:6px}
.bl{list-style:none}
.bl li{position:relative;padding-left:11px;font-size:9.2px;line-height:1.45;color:#3f3b3c;margin-bottom:5px}
.bl li::before{content:'';position:absolute;left:0;top:.55em;width:5px;height:.8px;background:${T.flame}}
.formula{border:.9px solid ${T.draw};background:#fff;padding:8px 12px;display:flex;align-items:center;gap:16px}
.formula .lbl{color:${T.flame};flex:none}
.formula p{font:500 12.5px/1.3 BzMono,monospace;color:${T.draw};letter-spacing:.01em}
.formula em{font-style:normal;color:${T.steel};font-weight:400}
.facts{display:grid;grid-template-columns:1fr 1fr;gap:.24in}
.mx.fx td.n{text-align:right;font:500 9px BzMono,monospace;color:${T.draw}}
.mx.fx th:last-child{text-align:right;padding-right:8px}
.mx.fx td.n{padding-right:8px}
.mx.fx tr.on td{background:rgba(239,65,35,.07)}
.mx.fx td,.mx.cov2 td{padding-top:3.5px;padding-bottom:3.5px}
.mx.cov2 td{font-size:8.8px}
.mx.fx tr.on td.n{color:${T.flame}}
.fn{font:400 6.9px/1.5 BzMono,monospace;color:${T.steel};margin-top:5px}
.steps,.legend{list-style:none;display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:0 0 8px}
.legend{margin:6px 0 0;border-top:.6px solid ${T.draw};padding-top:7px}
.steps li,.legend li{font-size:8.6px;line-height:1.35;color:#3f3b3c;position:relative;padding-left:21px}
.steps b,.legend b{display:block;font:500 7px/1.3 BzMono,monospace;letter-spacing:.1em;text-transform:uppercase;color:${T.draw}}
.steps strong{display:block;font:400 17px/1.15 BzDidot,serif;color:${T.ink}}
.steps li:last-child strong{color:${T.flame}}
.steps .no,.legend .no{position:absolute;left:0;top:0;width:15px;height:15px;border-radius:50%;border:.8px solid ${T.flame};display:grid;place-items:center;font:500 7.4px/1 BzMono,monospace;color:${T.flame}}
.two{display:grid;gap:.26in}
.w2{grid-template-columns:1fr 1fr}
.w3{grid-template-columns:3.35in 1fr}
.w4{grid-template-columns:3.45in 1fr;align-items:end}
.note{border-left:1.2px solid ${T.draw};padding-left:9px}
.note b{display:block;font:500 6.8px BzMono,monospace;letter-spacing:.14em;color:${T.draw};margin-bottom:2px}
.note p{font-size:9.2px;line-height:1.45;color:#3f3b3c}
.nl{list-style:none;counter-reset:n}
.nl li{counter-increment:n;position:relative;padding:0 0 9px 22px;font-size:9.2px;line-height:1.42;color:#3f3b3c}
.nl li::before{content:counter(n);position:absolute;left:0;top:0;width:14px;height:14px;border-radius:50%;border:.8px solid ${T.draw};display:grid;place-items:center;font:500 7px/1 BzMono,monospace;color:${T.draw}}
.nl b{display:block;font:500 7px/1.3 BzMono,monospace;letter-spacing:.1em;text-transform:uppercase;color:${T.draw};margin-bottom:1px}
.help{display:grid;grid-template-columns:repeat(3,1fr);gap:.22in}
.help b{display:block;font:500 6.8px BzMono,monospace;letter-spacing:.14em;color:${T.draw};margin-bottom:3px}
.help p{font-size:9.2px;line-height:1.42;color:#3f3b3c}
.help p.mono{font-size:7px}
.gk{padding-bottom:4px}
/* footer: disclaimer + CTA, then the title strip */
.foot2{display:flex;gap:.3in;align-items:center}
.disc{flex:1;font-size:8.4px;line-height:1.45;color:#3f3b3c;border-left:1.2px solid ${T.flame};padding-left:8px}
.disc b{font:500 6.6px BzMono,monospace;letter-spacing:.14em;color:${T.flame};margin-right:5px}
.ctab{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:5px}
.btn{display:inline-flex;gap:12px;align-items:center;border:.9px solid ${T.flame};color:${T.flame};font:500 7.6px/1 BzMono,monospace;letter-spacing:.16em;padding:7px 12px;text-decoration:none;background:#fff}
.addr{font:400 6.6px/1 BzMono,monospace;letter-spacing:.06em;color:${T.steel}}
.strip{position:absolute;left:.42in;right:.42in;bottom:.42in;height:.48in;display:flex;border-top:.9px solid ${T.draw};font:400 7px/1.25 BzMono,monospace;color:${T.ink};background:#fff}
.strip .cell{padding:5px 7px;border-right:.5px solid ${T.hair};display:flex;flex-direction:column;justify-content:space-between;white-space:nowrap}
.strip .cell:last-child{border-right:0}
.strip .cell.grow{flex:1;white-space:normal}
.strip .cell.grow span{font-size:5.9px;line-height:1.35;color:${T.steel}}
.strip b{font-weight:500;font-size:5.4px;letter-spacing:.16em;color:${T.steel}}
.strip .sheet span{font-size:15px;line-height:1;color:${T.draw}}
.strip .sheet i{font-style:normal;font-size:7px;color:${T.steel}}
/* photo-led sheet */
.page.photo .strip{border:.9px solid ${T.draw}}
.hero{position:absolute;left:0;top:0;width:8.5in;height:3.55in;background-size:cover;background-repeat:no-repeat}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,18,19,.68) 0%,rgba(20,18,19,.28) 20%,rgba(20,18,19,.05) 34%,rgba(20,18,19,0) 46%,rgba(20,18,19,.3) 66%,rgba(20,18,19,.84) 100%),linear-gradient(90deg,rgba(20,18,19,.35) 0%,rgba(20,18,19,0) 60%)}
.mast{position:absolute;top:.42in;left:.5in;right:.5in;display:flex;justify-content:space-between;align-items:center}
.mast img{height:.29in;display:block}
.mast .meta{font:500 6.6px/1 BzMono,monospace;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.9);display:flex;gap:14px}
.mast .meta b{font-weight:500;color:${T.flame}}
.hcopy{position:absolute;left:.5in;bottom:.32in;width:5.6in;color:#fff}
.kick{display:flex;align-items:center;gap:9px;margin-bottom:9px}
.kick::before{content:'';width:26px;height:1.2px;background:${T.flame}}
.kick span{font:500 7px/1 BzMono,monospace;letter-spacing:.28em;text-transform:uppercase;color:#fff}
.hcopy h1{font-size:32pt;line-height:1.0;letter-spacing:-.008em}
.hcopy .deck{font-family:BzDidot,serif;font-style:italic;font-size:12.5pt;line-height:1.3;margin-top:8px;color:rgba(255,255,255,.92);max-width:5in}
.hcap{position:absolute;right:.5in;bottom:.34in;font:400 6.4px/1.3 BzMono,monospace;letter-spacing:.06em;color:rgba(255,255,255,.85);max-width:1.9in;text-align:right}
.hcap b{color:${T.flame};font-weight:500;letter-spacing:.14em;margin-right:4px}
.pflow{left:.5in;right:.5in;top:3.75in;bottom:1.0in;gap:12px}
.page.photo h3{font-size:18px;line-height:1.1;margin:3px 0 6px;color:${T.ink}}
.body{font-size:9.4px;line-height:1.52;color:#3f3b3c}
.wifi{font-size:7.6px;line-height:1.45;color:${T.steel};margin-top:5px;border-left:1.2px solid ${T.flame};padding-left:7px}
.w1{grid-template-columns:2.05in 1fr;gap:.24in}
.fam{display:grid;grid-template-columns:repeat(6,1fr);gap:7px}
.fam figure{border-top:.9px solid ${T.draw};padding-top:4px}
.fi{height:.95in;background-size:cover;background-color:#f2f2f2}
.fam figcaption{margin-top:4px}
.fam b{display:block;font-size:7.8px;line-height:1.25;font-weight:700;color:${T.ink}}
.fam span{display:block;font-size:7.4px;line-height:1.3;color:#59555a;margin-top:2px}
.fam em{display:block;font-style:normal;font-size:7.4px;line-height:1.3;color:${T.draw};margin-top:3px}
.fam em i{display:block;font:500 5.6px BzMono,monospace;letter-spacing:.12em;font-style:normal;color:${T.flame}}
.three{display:grid;grid-template-columns:1fr 1fr 1.7in;gap:.24in;border-top:.9px solid ${T.draw};padding-top:8px}
.three.m3{grid-template-columns:1fr 1fr 1fr}
.plate{border:.6px solid ${T.draw};padding:4px;align-self:start}
.plate .pi{height:1.2in;background-size:cover;background-repeat:no-repeat}
.plate.sm{margin-top:6px}.plate.sm .pi{height:.72in}
.sgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:.2in}
.sgrid>div{position:relative}
.sgrid .no{font-family:BzDidot,serif;font-size:14pt;line-height:1;display:block}
.sgrid b{display:block;font:400 7.2px/1.3 BzSans,sans-serif;letter-spacing:.14em;text-transform:uppercase;margin:4px 0 3px}
.sgrid p{font-size:9px;line-height:1.42;color:#4a4647}
.sgrid p.mono{font-size:6.8px;color:${T.draw}}
.qa{display:grid;grid-template-columns:repeat(3,1fr);gap:16px .22in}
.q{border-top:.6px solid ${T.ink};padding-top:7px;position:relative}
.q .no{font:500 6.6px BzMono,monospace;letter-spacing:.16em;color:${T.flame}}
.qq{font-family:BzDidot,serif;font-size:15px;line-height:1.15;margin:2px 0 4px;color:${T.ink}}
.aa{font-size:9.2px;line-height:1.45;color:#3f3b3c}
.qa .plate .pi{height:1.0in}
.mx.cmp td{font-size:9.6px;line-height:1.45;padding:9px 12px 9px 0}
.mx.cmp td.say{font-family:BzDidot,serif;font-size:13px;line-height:1.25;color:${T.ink}}
.fair{border-left:1.2px solid ${T.draw};padding-left:9px}
.fair b{display:block;font:500 6.8px BzMono,monospace;letter-spacing:.14em;color:${T.draw};margin-bottom:2px}
.fair p{font-size:9.2px;line-height:1.45;color:#3f3b3c}
`;

const doc = (title, body) => `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<meta name="viewport" content="width=816"><title>${title}</title><style>${css}</style></head><body>${defs}${body}</body></html>`;

const SHEETS = [
  { id: 'why-bromic', pdf: 'Bromic-Why-Stock-Bromic.pdf', body: whyBromic, cover: 'pages/why-bromic.png' },
  { id: 'range-selector', pdf: 'Bromic-Which-Heater-For-Which-Space.pdf', body: rangeSelector },
  { id: 'sizing', pdf: 'Bromic-Sizing-In-60-Seconds.pdf', body: sizing },
  { id: 'install-warranty', pdf: 'Bromic-Installation-Warranty-And-Support.pdf', body: installWarranty },
  { id: 'selling', pdf: 'Bromic-Selling-On-The-Floor.pdf', body: selling },
  { id: 'merchandising', pdf: 'Bromic-Display-And-Merchandising.pdf', body: merchandising },
  { id: 'ordering', pdf: 'Bromic-Ordering-And-Support.pdf', body: ordering },
];

// ---------- print check ----------
async function check(p) {
  return p.evaluate(async () => {
    await document.fonts.ready;
    const out = [];
    const pg = document.querySelector('.page').getBoundingClientRect();
    const hit = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    const stripTop = document.querySelector('.strip').getBoundingClientRect().top;
    const fl = document.querySelector('.flow');
    if (fl.scrollHeight > fl.clientHeight + 1) out.push(`content is ${fl.scrollHeight - fl.clientHeight}px taller than the sheet`);
    const fr = fl.getBoundingClientRect();
    document.querySelectorAll('.flow p, .flow h2, .flow h3, .flow li, .flow td, .flow th, .flow figcaption, .flow .btn, .flow .lbl').forEach((el) => {
      const r = el.getBoundingClientRect(); if (!r.width) return;
      if (r.left < fr.left - 1 || r.right > fr.right + 1) out.push(`off the column: "${el.textContent.trim().slice(0, 40)}"`);
      if (r.bottom > stripTop - 2) out.push(`runs into the title strip: "${el.textContent.trim().slice(0, 40)}"`);
      if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') out.push(`clipped: "${el.textContent.trim().slice(0, 40)}"`);
    });
    document.querySelectorAll('.strip span, .hero *').forEach((el) => {
      const r = el.getBoundingClientRect(); if (!r.width) return;
      if (r.left < pg.left || r.right > pg.right || r.top < pg.top || r.bottom > pg.bottom) out.push(`off page: "${el.textContent.trim().slice(0, 40)}"`);
    });
    document.querySelectorAll('.strip .cell').forEach((c) => { if (c.scrollHeight > c.clientHeight + 1) out.push('strip cell overflows: ' + c.textContent.trim().slice(0, 30)); });
    // blocks in the flow must not collide
    const blocks = [...fl.children].map((e) => ({ e, r: e.getBoundingClientRect() }));
    for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
      if (hit(blocks[i].r, blocks[j].r) > 4) out.push(`blocks overlap: ${blocks[i].e.className} / ${blocks[j].e.className}`);
    }
    // hero copy against the caption
    const hc = document.querySelector('.hcopy'), cp = document.querySelector('.hcap');
    if (hc && cp && hit(hc.getBoundingClientRect(), cp.getBoundingClientRect()) > 0) out.push('hero title overlaps its caption');
    // drawing labels: inside the drawing, not on top of each other
    document.querySelectorAll('svg.dwg').forEach((svg) => {
      const sr = svg.getBoundingClientRect();
      const ts = [...svg.querySelectorAll('text')].map((x) => ({ t: x.textContent, r: x.getBoundingClientRect() })).filter((x) => x.r.width);
      ts.forEach((x) => { if (x.r.left < sr.left - 2 || x.r.right > sr.right + 2 || x.r.top < sr.top - 2 || x.r.bottom > sr.bottom + 2) out.push(`drawing text outside its drawing: "${x.t}"`); });
      for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
        const ov = hit(ts[i].r, ts[j].r);
        if (ov > 0.15 * Math.min(ts[i].r.width * ts[i].r.height, ts[j].r.width * ts[j].r.height)) out.push(`drawing labels overlap: "${ts[i].t}" / "${ts[j].t}"`);
      }
    });
    // images
    document.querySelectorAll('img').forEach((im) => { if (!im.complete || !im.naturalWidth) out.push('missing image ' + im.src); });
    for (const el of document.querySelectorAll('.hero,.pi,.fi,.ti,.ph-img')) {
      const u = (getComputedStyle(el).backgroundImage.match(/url\("?(.*?)"?\)/) || [])[1];
      const ok = u && await new Promise((res) => { const im = new Image(); im.onload = () => res(im.naturalWidth > 0); im.onerror = () => res(false); im.src = u; });
      if (!ok) out.push('missing background image: ' + u);
    }
    // copy rules
    const txt = document.body.innerText;
    if (document.body.innerHTML.includes('[[VERIFY')) out.push('raw VERIFY note on the page');
    if (/\$\s?\d/.test(txt)) out.push('a price is on the page');
    if (/coming soon/i.test(txt)) out.push('"coming soon" on the page');
    if (/—/.test(txt)) out.push('long dash in the copy');
    if (/!/.test(txt)) out.push('exclamation mark in the copy');
    if (/\boptional\b/i.test(txt)) out.push('"optional" on the page');
    if (!/sold separately/i.test(txt)) out.push('the Wi-Fi/app line is missing');
    return out;
  });
}

(async () => {
  prepImages();
  fs.mkdirSync(path.join(HERE, 'pages'), { recursive: true });
  const browser = await chromium.launch();
  const report = [], index = [];
  for (const s of SHEETS) {
    const P = PG[s.id];
    const file = path.join(HERE, `${s.id}.html`);
    fs.writeFileSync(file, doc(`${P.title} · Bromic Retail One-Pager`, s.body()));
    const p = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
    await p.goto('file://' + file, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const issues = await check(p);
    await p.screenshot({ path: path.join(HERE, 'pages', `${s.id}.png`), clip: { x: 0, y: 0, width: 816, height: 1056 } });
    await p.pdf({ path: path.join(HERE, s.pdf), width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true });
    const buf = fs.readFileSync(path.join(HERE, s.pdf), 'latin1');
    const pages = (buf.match(/\/Type\s*\/Page[^s]/g) || []).length;
    if (pages !== 1) issues.push(`PDF has ${pages} pages`);
    const kb = Math.round(fs.statSync(path.join(HERE, s.pdf)).size / 1024);
    if (kb > 2048) issues.push(`PDF is ${kb} KB, over 2 MB`);
    console.log(`${s.id}: ${kb} KB, ${issues.length} issues`); issues.forEach((x) => console.log('  ' + x));
    issues.forEach((x) => report.push(`${s.id}: ${x}`));
    const base = 'reports/retail/one-pagers/';
    index.push({ id: s.id, title: P.title, kicker: P.kicker, desc: P.summary, pdf: base + s.pdf, cover: base + `pages/${s.id}.png`, cta: P.cta, needs_approval: P.needs_approval });
    await p.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(HERE, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  const txt = `Print check, ${new Date().toISOString().slice(0, 10)}\n` + (report.length ? report.join('\n') : 'clean: seven sheets, one Letter page each, under 2 MB, nothing off the column or into the title strip, no overlapping blocks or drawing labels, all images load, no price, no raw VERIFY, no "coming soon", no long dash, Wi-Fi line on every sheet') + '\n';
  fs.writeFileSync(path.join(HERE, 'print-check.txt'), txt);
  console.log(txt);
  process.exit(report.length ? 1 : 0);
})();
