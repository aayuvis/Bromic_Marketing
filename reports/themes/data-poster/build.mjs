// Data Poster theme: a 3-page US Letter sample built from content/reports/A01-stats-page.md.
// Every figure below is copied from that file (front matter `sources[].supports` or body). Nothing is rounded or combined.
// Run: node reports/themes/data-poster/build.mjs  →  sample.html, pages/p1-3.png, sample.pdf
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

// ---- Theme tokens -------------------------------------------------------
const INK = '#231F20', FLAME = '#EF4123', STEEL = '#6D6E71', RULE = '#D1D3D4', MUTE = '#BCBEC0';
const W = 816, H = 1056, M = 48;            // US Letter at 96 dpi, 48 px (0.5 in) margins
const COLS = 12, GUT = 16;                  // 12-column grid
const colW = (W - 2 * M - (COLS - 1) * GUT) / COLS;
const span = n => n * colW + (n - 1) * GUT;
const ROOT = '../../..';

// ---- Sources (from the front matter, short form for print) --------------
const SRC = {
  s1: 'National Association of Home Builders, tabulation of the Census Survey of Construction, 2026',
  s1s2: 'National Association of Home Builders, tabulations of the Census Survey of Construction, 2025 and 2026',
  s3: 'National Association of Home Builders, Builder Practices Survey, 2025 (homes built in 2024)',
  s4: 'American Institute of Architects, Home Design Trends Survey, Q2 2025',
  s5: 'Harvard Joint Center for Housing Studies, Leading Indicator of Remodeling Activity, 2026',
  s6: 'Houzz, 2024 U.S. Houzz Outdoor Trends Study (1,100+ homeowners, May 2024)',
  s7: 'National Association of Realtors and National Association of Landscape Professionals, 2023 Remodeling Impact Report: Outdoor Features',
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const src = s => `<p class="src">Source: ${esc(s)}</p>`;
const num = (x, y, s, o = {}) => `<text x="${x}" y="${y}" class="${o.cls || 'v'}" text-anchor="${o.a || 'start'}"${o.fill ? ` fill="${o.fill}"` : ''}>${esc(s)}</text>`;

// ---- Charts (flat SVG) --------------------------------------------------
// Waffle: 100 cells, 60.5 filled (the 61st cell is half filled). One cell = 1% of 2025 starts.
function waffle(size, gap) {
  const cell = (size - 9 * gap) / 10; let out = '';
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10, x = c * (cell + gap), y = r * (cell + gap);
    out += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${i < 60 ? FLAME : RULE}"/>`;
    if (i === 60) out += `<rect x="${x}" y="${y}" width="${cell / 2}" height="${cell}" fill="${FLAME}"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="60.5 of 100 squares filled">${out}</svg>`;
}

// Horizontal bars with a reference line. rows: [label, value, key?]
function hbars(rows, w, { max = 100, ref, refLabel, unit = '%', barH = 14, gapY = 12, labelW = 118 } = {}) {
  const plotW = w - labelW - 40, h = rows.length * (barH + gapY) + 22;
  const x = v => labelW + (v / max) * plotW;
  let g = '';
  for (const t of [0, 25, 50, 75, 100].filter(t => t <= max)) {
    g += `<line x1="${x(t)}" x2="${x(t)}" y1="0" y2="${h - 18}" stroke="${RULE}" stroke-width="1"/>`;
    g += num(x(t), h - 4, t + (t === 0 ? '' : unit === '%' ? '' : ''), { cls: 'tick', a: 'middle' });
  }
  rows.forEach(([lab, v, key], i) => {
    const y = i * (barH + gapY) + 4;
    g += `<text x="0" y="${y + barH - 3}" class="lab">${esc(lab)}</text>`;
    g += `<rect x="${labelW}" y="${y}" width="${x(v) - labelW}" height="${barH}" fill="${key ? FLAME : MUTE}"/>`;
    g += num(x(v) + 6, y + barH - 3, v + unit, { cls: 'v' });
  });
  if (ref != null) {
    g += `<line x1="${x(ref)}" x2="${x(ref)}" y1="-6" y2="${h - 18}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    g += `<text x="${x(ref) + 4}" y="-8" class="tick">${esc(refLabel)}</text>`;
  }
  return `<svg width="${w}" height="${h + 14}" viewBox="0 -14 ${w} ${h + 14}">${g}</svg>`;
}

// Share of new homes with a patio: 2019 and 2025 starts (NAHB tabulation of the Census Survey of Construction).
function yearDots(w, h) {
  const pts = [[2019, 59.6], [2025, 60.5]];
  const L = 34, R = 20, T = 22, B = 28, lo = 58, hi = 62;
  const x = yr => L + 40 + (yr - 2019) / 6 * (w - L - R - 80), y = v => T + (hi - v) / (hi - lo) * (h - T - B);
  let g = '';
  for (const t of [58, 59, 60, 61, 62]) {
    g += `<line x1="${L}" x2="${w - R}" y1="${y(t)}" y2="${y(t)}" stroke="${RULE}"/>`;
    g += num(L - 6, y(t) + 4, t + '%', { cls: 'tick', a: 'end' });
  }
  for (const [yr] of pts) g += num(x(yr), h - 8, yr, { cls: 'tick', a: 'middle' });
  g += `<line x1="${x(2019)}" y1="${y(59.6)}" x2="${x(2025)}" y2="${y(60.5)}" stroke="${INK}" stroke-width="2"/>`;
  for (const [yr, v] of pts) {
    const key = yr === 2025;
    g += `<circle cx="${x(yr)}" cy="${y(v)}" r="${key ? 6 : 4.5}" fill="${key ? FLAME : INK}" stroke="#fff" stroke-width="2"/>`;
    g += num(x(yr), y(v) - 11, v + '%', { cls: key ? 'v strong' : 'v', a: 'middle' });
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

// Cost recovered: one bar of $10,500, about 95% of it recovered.
function recovered(w) {
  const h = 56, bw = w, rec = bw * 0.95;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect x="0" y="0" width="${bw}" height="22" fill="${RULE}"/>
    <rect x="0" y="0" width="${rec}" height="22" fill="${FLAME}"/>
    <line x1="${rec}" x2="${rec}" y1="-0" y2="30" stroke="${INK}" stroke-width="1.5"/>
    ${num(0, 44, 'Recovered at resale: about 95%', { cls: 'lab' })}
    ${num(bw, 44, 'Typical cost: $10,500 = 100%', { cls: 'lab', a: 'end' })}
  </svg>`;
}

// Joy Score dot plot, scale 9.0–10 (axis labelled; it does not start at zero, dots not bars).
function joy(w) {
  const rows = [['In-ground pool', 10, false], ['Landscape lighting', 10, false], ['New patio', 9.9, true]];
  const L = 128, R = 30, lo = 9.0, hi = 10, rowH = 32, h = rows.length * rowH + 40;
  const x = v => L + (v - lo) / (hi - lo) * (w - L - R);
  let g = '';
  for (const t of [9.0, 9.25, 9.5, 9.75, 10]) {
    g += `<line x1="${x(t)}" x2="${x(t)}" y1="10" y2="${h - 24}" stroke="${RULE}" stroke-dasharray="2 3"/>`;
    g += num(x(t), h - 8, t === 9.25 || t === 9.75 ? t.toFixed(2) : t.toFixed(1), { cls: 'tick', a: 'middle' });
  }
  rows.forEach(([lab, v, key], i) => {
    const y = i * rowH + 26;
    g += `<text x="0" y="${y + 4}" class="lab">${esc(lab)}</text>`;
    g += `<line x1="${x(lo)}" x2="${x(hi)}" y1="${y}" y2="${y}" stroke="${RULE}" stroke-width="1"/>`;
    g += `<circle cx="${x(v)}" cy="${y}" r="${key ? 7 : 5.5}" fill="${key ? FLAME : INK}" stroke="#fff" stroke-width="2"/>`;
    g += num(x(v) - 13, y + 4, String(v === 10 ? '10' : v), { cls: key ? 'v strong' : 'v', a: 'end' });
  });
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

// ---- Pages ---------------------------------------------------------------
const head = (n, label) => `<header class="run"><span class="run-n">${n}</span><span class="run-l">${label}</span><span class="run-r">Outdoor Living Statistics 2026</span></header>`;
const foot = (p) => `<footer class="foot"><img src="${ROOT}/decks/img/logo.png" alt="Bromic Heating" class="logo-s"><span>Every figure is quoted from its named public source.</span><span class="pg">${p}</span></footer>`;

const p1 = `
<section class="page cover">
  <div class="kicker"><span class="disp title">Outdoor Living Statistics 2026</span><span class="kr"><span class="dot"></span>How America Lives Outdoors · US</span></div>
  <div class="hero-num">60.5<span class="pct">%</span></div>
  <div class="cover-grid">
    <div class="cover-left">
      <h1 class="disp">Six In Ten New Homes Come With A Patio</h1>
      <p class="lede">Share of the roughly 940,000 US single-family homes started in 2025 that came with a patio – up from 59.6% in 2019.</p>
    </div>
    <figure class="cover-right">
      ${waffle(span(5), 4)}
      <figcaption><span class="sw flame"></span>One square = 1% of 2025 single-family starts</figcaption>
    </figure>
  </div>
  <div class="cover-foot">
    ${src(SRC.s1)}
    <img src="${ROOT}/decks/img/logo.png" alt="Bromic Heating" class="logo">
  </div>
</section>`;

const p2 = `
<section class="page inner">
  ${head('01', 'How America Lives Outdoors')}
  <h2 class="disp h2">The Patio Is Now Part Of The House</h2>
  <div class="grid g2">
    <article class="mod">
      <div class="mn">01</div>
      <h3>Where New Homes Come With A Patio</h3>
      <p class="unit">% of single-family homes started in 2025, by census division</p>
      ${hbars([['West South Central', 77, true], ['Mountain', 74, true], ['South Atlantic', 66, true], ['New England', 26], ['Middle Atlantic', 23]], span(6), { ref: 60.5, refLabel: 'US 60.5%' })}
      ${src(SRC.s1)}
    </article>
    <article class="mod">
      <div class="mn">02</div>
      <h3>More New Homes Plan For Outdoor Living Than In 2019</h3>
      <p class="unit">% of single-family starts with a patio, 2019 and 2025 starts</p>
      ${yearDots(span(6), 140)}
      ${src(SRC.s1)}
    </article>
    <article class="mod big">
      <div class="mn">03</div>
      <div class="fig">320<span class="u">sq ft</span></div>
      <p class="cap">About the size of the average patio on a new US home built in 2024 – over 400 sq ft in the East North Central and East South Central divisions, under 200 in the West South Central.</p>
      ${src(SRC.s3)}
    </article>
    <article class="mod">
      <div class="mn">04</div>
      <h3>Architects Still Rank Outdoor Living First</h3>
      <p class="unit">Net % of architects reporting rising popularity, Q2 2025 (rising minus falling)</p>
      ${hbars([['Outdoor living spaces', 55, true], ['Blended indoor/outdoor', 40]], span(6), { barH: 18, gapY: 14, labelW: 150 })}
      ${src(SRC.s4)}
    </article>
    <article class="mod">
      <div class="mn">05</div>
      <h3>More Room To Live</h3>
      <p class="unit">% of homeowners upgrading outdoors to extend their living space, 2024</p>
      ${hbars([['All upgraders', 33, true], ['Gen X', 41], ['Millennials', 38], ['Baby boomers', 28]], span(6), { max: 50, barH: 12, gapY: 10 })}
      ${src(SRC.s6)}
    </article>
    <article class="mod big">
      <div class="mn">06</div>
      <div class="fig">$525<span class="u">billion</span></div>
      <p class="cap">About what US homeowners are expected to spend each year on improvements and repairs, a level Harvard expects to hold through Q3 2027.</p>
      ${src(SRC.s5)}
    </article>
  </div>
  ${foot(2)}
</section>`;

const p3 = `
<section class="page close">
  ${head('02', 'What A Patio Gives Back')}
  <div class="grid g-close">
    <article class="mod">
      <div class="mn">07</div>
      <div class="fig xl">95<span class="u">%</span></div>
      <p class="cap">About the share of a new patio’s cost that Realtors estimate is recovered when the home sells, 2023.</p>
      ${recovered(span(7))}
    </article>
    <figure class="plate"><img src="${ROOT}/images/library/t-005-013.webp" alt="Couple by an outdoor fireplace under a covered patio"></figure>
    <article class="mod wide">
      <div class="mn">08</div>
      <h3>Third For Joy, Behind Only The Pool And The Lights</h3>
      <p class="unit">Joy Score, out of 10, homeowners who completed the project, 2023 (axis from 9.0)</p>
      ${joy(span(7))}
      ${src(SRC.s7)}
    </article>
  </div>
  <div class="cta">
    <p class="cta-k">The Full Picture</p>
    <h2 class="disp cta-h">See What These Numbers Mean For Your Next Outdoor Space</h2>
    <div class="cta-row"><span class="btn">Download The Trends 2026 Report</span><span class="site">bromic.com</span></div>
  </div>
  ${foot(3)}
</section>`;

// ---- Style -------------------------------------------------------------
const css = `
@font-face{font-family:Didot;src:url(${ROOT}/app/src/fonts/gfs-didot-latin.woff2) format('woff2')}
@font-face{font-family:Arimo;src:url(${ROOT}/app/src/fonts/arimo-latin.woff2) format('woff2');font-weight:100 900}
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff;color:${INK};font-family:Arimo,Helvetica,Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:${W}px;height:${H}px;padding:${M}px;position:relative;overflow:hidden;page-break-after:always;break-after:page;}
.disp{font-family:Didot,'GFS Didot',serif;font-weight:400;text-transform:capitalize;letter-spacing:-.005em}
svg text{font-family:Arimo,Helvetica,Arial,sans-serif}
.v{font-size:11px;font-weight:700;fill:${INK}} .v.strong{font-size:12px}
.tick{font-size:9px;fill:${STEEL}} .lab{font-size:10.5px;fill:${INK}}
.src{font-size:8px;line-height:1.35;color:${STEEL};margin-top:8px;max-width:${span(6)}px}
/* cover */
.kicker{display:flex;justify-content:space-between;align-items:baseline;border-top:3px solid ${INK};padding-top:12px}
.kicker .title{font-size:30px;line-height:1}
.kr{font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;display:flex;align-items:center;gap:8px}
.dot{width:8px;height:8px;background:${FLAME};display:inline-block}
.cover{display:flex;flex-direction:column}
.cover-grid{display:grid;grid-template-columns:${span(7)}px ${span(5)}px;gap:${GUT}px;margin-top:auto;margin-bottom:28px;align-items:end;border-top:1px solid ${INK};padding-top:14px}
.hero-num{font-weight:700;font-size:330px;line-height:.78;letter-spacing:-.065em;margin:auto 0 0 -14px;white-space:nowrap}
.hero-num .pct{font-size:150px;letter-spacing:-.02em;vertical-align:top;line-height:1;margin-left:4px}
.cover-left h1{font-size:50px;line-height:1.02;margin-top:0;max-width:${span(7)}px}
.lede{font-size:15px;line-height:1.5;margin-top:24px;max-width:${span(6)}px;font-weight:400}
.cover-right{margin:0}
figcaption{font-size:9.5px;color:${STEEL};margin-top:10px;display:flex;align-items:center;gap:6px}
.sw{width:9px;height:9px;display:inline-block}.sw.flame{background:${FLAME}}
.cover-foot{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid ${INK};padding-top:10px}
.cover-foot .src{margin:0}
.logo{height:34px}
/* running head */
.run{display:grid;grid-template-columns:${span(1)}px 1fr auto;gap:${GUT}px;align-items:baseline;border-top:3px solid ${INK};padding-top:10px;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:700}
.run-n{font-size:40px;letter-spacing:-.03em;line-height:.8;color:${FLAME}}
.run-r{color:${STEEL};font-weight:400}
.h2{font-size:34px;line-height:1.05;margin:16px 0 18px;white-space:nowrap}
.grid.g2{display:grid;grid-template-columns:${span(6)}px ${span(6)}px;column-gap:${GUT}px;row-gap:18px}
.mod{border-top:1px solid ${INK};padding-top:8px;position:relative}
.mn{font-size:9px;font-weight:700;color:${FLAME};letter-spacing:.1em}
.mod h3{font-family:Didot,serif;font-weight:400;font-size:19px;line-height:1.15;margin-top:4px}
.unit{font-size:9.5px;color:${STEEL};margin:4px 0 10px}
.fig{font-weight:700;font-size:100px;line-height:.9;letter-spacing:-.05em;margin-top:6px;white-space:nowrap}
.fig .u{font-size:30px;letter-spacing:-.01em;margin-left:8px;font-weight:700}
.fig.xl{font-size:200px}.fig.xl .u{font-size:80px;margin-left:2px}
.cap{font-size:11.5px;line-height:1.45;margin-top:10px;max-width:${span(6)}px}
.foot{position:absolute;left:${M}px;right:${M}px;bottom:${M - 18}px;display:flex;gap:14px;align-items:center;font-size:8px;color:${STEEL};border-top:1px solid ${RULE};padding-top:8px}
.logo-s{height:16px}.foot .pg{margin-left:auto;font-weight:700;color:${INK};font-size:10px}
/* close */
.g-close{display:grid;grid-template-columns:${span(7)}px ${span(5)}px;column-gap:${GUT}px;row-gap:22px;margin-top:22px}
.plate{grid-row:1 / span 2;grid-column:2;height:100%;position:relative;overflow:hidden;background:${INK}}
.plate img{width:100%;height:100%;object-fit:cover;filter:url(#duo)}
.cta{position:absolute;left:${M}px;right:${M}px;bottom:${M + 26}px;background:${INK};color:#fff;padding:28px ${span(1) + GUT}px 30px}
.cta-k{font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:${FLAME}}
.cta-h{font-size:34px;line-height:1.08;margin-top:10px;max-width:${span(9)}px}
.cta-row{display:flex;align-items:center;gap:22px;margin-top:20px}
.btn{background:${FLAME};color:#fff;font-weight:700;font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding:13px 20px}
.site{font-size:12px;letter-spacing:.06em}
`;

// Duotone: shadows to ink, highlights to a warm paper white (flame stays reserved for data).
const duo = `<svg width="0" height="0" style="position:absolute"><filter id="duo" color-interpolation-filters="sRGB">
<feColorMatrix type="saturate" values="0"/>
<feComponentTransfer><feFuncR type="table" tableValues="0.137 0.94"/><feFuncG type="table" tableValues="0.122 0.90"/><feFuncB type="table" tableValues="0.125 0.86"/></feComponentTransfer>
</filter></svg>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Outdoor Living Statistics 2026 – Data Poster</title><style>${css}</style></head><body>${duo}${p1}${p2}${p3}</body></html>`;

writeFileSync(join(here, 'sample.html'), html);
mkdirSync(join(here, 'pages'), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto('file://' + join(here, 'sample.html'));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
// Print check: nothing overflows its page, no SVG text overlaps another.
const problems = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('.page').forEach((pg, pi) => {
    const P = pg.getBoundingClientRect();
    pg.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || el.closest('defs,filter')) return;
      if (r.right > P.right + 0.5 || r.bottom > P.bottom + 0.5 || r.left < P.left - 0.5) out.push(`p${pi + 1} overflow: ${el.tagName}.${el.className?.baseVal ?? el.className} ${el.textContent.slice(0, 30)}`);
    });
    const ts = [...pg.querySelectorAll('svg text')].map(t => [t, t.getBoundingClientRect()]);
    for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
      const a = ts[i][1], b = ts[j][1];
      if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) out.push(`p${pi + 1} text overlap: "${ts[i][0].textContent}" / "${ts[j][0].textContent}"`);
    }
    pg.querySelectorAll('img').forEach(im => { if (!im.naturalWidth) out.push(`p${pi + 1} missing image ${im.src}`); });
  });
  return out;
});
const pages = await page.$$('.page');
for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: join(here, 'pages', `p${i + 1}.png`) });
await page.pdf({ path: join(here, 'sample.pdf'), width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true });
await browser.close();
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; } else console.log('OK: 3 pages, print check clean');
