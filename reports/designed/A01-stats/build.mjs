// A01-stats "Outdoor Living Statistics 2026" in the Data Poster theme (reports/themes/data-poster).
// Every figure is copied from content/reports/A01-stats-page.md (body or front matter `sources[].supports`).
// Nothing is rounded, combined or invented. The "Awaiting Verification" list is left out.
// Run: node reports/designed/A01-stats/build.mjs  ->  index.html, pages/pNN.png, Bromic-A01-stats-Outdoor-Living-Statistics-2026.pdf, meta.json
import { writeFileSync, mkdirSync, existsSync, statSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '../../..');
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ID = 'A01-stats', TITLE = 'Outdoor Living Statistics 2026';
const PDF = `Bromic-${ID}-Outdoor-Living-Statistics-2026.pdf`;

// ---- Images: Bromic library webp -> JPEG q82, long side <= 2000 px -------
const IMGS = ['t-001-000', 't-005-013', 't-012-034'];
mkdirSync(join(here, 'img'), { recursive: true });
for (const id of IMGS) {
  const out = join(here, 'img', id + '.jpg');
  if (!existsSync(out)) execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); im.thumbnail((2000, 2000)); im.save(sys.argv[2], quality=82, optimize=True)`, join(repo, 'images/library', id + '.webp'), out]);
}
const img = id => `img/${id}.jpg`;

// ---- Theme tokens (Data Poster) -------------------------------------------
const INK = '#231F20', FLAME = '#EF4123', STEEL = '#6D6E71', RULE = '#D1D3D4', MUTE = '#BCBEC0';
const W = 816, H = 1056, M = 48, COLS = 12, GUT = 16;
const colW = (W - 2 * M - (COLS - 1) * GUT) / COLS;
const span = n => n * colW + (n - 1) * GUT;
const ROOT = '../../..';

// ---- Sources: publisher, study, year (from the front matter) -------------
const SRC = {
  s1: 'National Association of Home Builders, tabulation of the Census Survey of Construction, 2026 (2025 starts)',
  s1s2: 'National Association of Home Builders, tabulations of the Census Survey of Construction, 2025 and 2026',
  s3: 'National Association of Home Builders, Builder Practices Survey, 2025 (homes built in 2024)',
  s4: 'American Institute of Architects, Home Design Trends Survey, Q2 2025',
  s5: 'Harvard Joint Center for Housing Studies, Leading Indicator of Remodeling Activity, October 2026 release',
  s6: 'Houzz, 2024 U.S. Houzz Outdoor Trends Study (1,100+ homeowners planning, in the middle of, or recently finished an outdoor renovation; fielded May 2024)',
  s7: 'National Association of Realtors and National Association of Landscape Professionals, 2023 Remodeling Impact Report: Outdoor Features',
  s78: 'National Association of Realtors and National Association of Landscape Professionals, 2023 Remodeling Impact Report: Outdoor Features (as reported by Real Estate News, 2023)',
};
const SOURCES = [
  ['s1', 'National Association of Home Builders (Eye on Housing)', 'Share of new homes with patios dips to a six-year low (NAHB tabulation of the Census Survey of Construction)', 2026, 'eyeonhousing.org/2026/09/share-of-new-homes-with-patios-dips-to-a-six-year-low'],
  ['s2', 'National Association of Home Builders', 'Patios in new homes (Census Survey of Construction tabulation)', 2025, 'nahb.org/blog/2025/09/patios-in-new-homes'],
  ['s3', 'National Association of Home Builders (Eye on Housing)', 'Share of new homes with patios edges down for first time in fifteen years (2025 Builder Practices Survey)', 2025, 'eyeonhousing.org/2025/09/share-of-new-homes-with-patios-edges-down-for-first-time-in-fifteen-years'],
  ['s4', 'American Institute of Architects', 'Home Design Trends Survey, Q2 2025', 2025, 'hdts.aia.org/2025/reports/2025-q2/2025-Q2-Home-Design-Trends-Survey.pdf'],
  ['s5', 'Harvard Joint Center for Housing Studies', 'Remodeling Spending Continues to Stagnate (Leading Indicator of Remodeling Activity)', 2026, 'jchs.harvard.edu/press-releases/remodeling-spending-continues-stagnate'],
  ['s6', 'Houzz', '10 Outdoor Renovation Trends Everyone Should Know About (2024 U.S. Houzz Outdoor Trends Study)', 2024, 'houzz.com/magazine/10-outdoor-renovation-trends-everyone-should-know-about-stsetivw-vs~176358500'],
  ['s7', 'National Association of Realtors and National Association of Landscape Professionals', '2023 Remodeling Impact Report: Outdoor Features', 2023, 'nar.realtor/research-and-statistics/research-reports/remodeling-impact-report-outdoor-features'],
  ['s8', 'Real Estate News', 'For homeowners, joy can trump ROI when choosing outdoor projects', 2023, 'realestatenews.com/2023/03/17/homeowners-joy-trumps-roi-when-choosing-outdoor-projects'],
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const src = s => `<p class="src">Source: ${esc(s)}</p>`;
const num = (x, y, s, o = {}) => `<text x="${x}" y="${y}" class="${o.cls || 'v'}" text-anchor="${o.a || 'start'}">${esc(s)}</text>`;

// ---- Charts (flat SVG) ------------------------------------------------------
// Waffle: 100 cells, 60.5 filled (cell 61 half filled). One cell = 1% of 2025 starts.
function waffle(size, gap) {
  const cell = (size - 9 * gap) / 10; let out = '';
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10, x = c * (cell + gap), y = r * (cell + gap);
    out += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${i < 60 ? FLAME : RULE}"/>`;
    if (i === 60) out += `<rect x="${x}" y="${y}" width="${cell / 2}" height="${cell}" fill="${FLAME}"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="60.5 of 100 squares filled">${out}</svg>`;
}

// Horizontal bars from zero, optional reference line. rows: [label, value, key?, note?]
function hbars(rows, w, { max = 100, ticks = [0, 25, 50, 75, 100], ref, refLabel, unit = '%', barH = 16, gapY = 12, labelW = 128 } = {}) {
  const plotW = w - labelW - 92, h = rows.length * (barH + gapY) + 22;
  const x = v => labelW + (v / max) * plotW;
  let g = '';
  for (const t of ticks) {
    g += `<line x1="${x(t)}" x2="${x(t)}" y1="0" y2="${h - 18}" stroke="${RULE}" stroke-width="1"/>`;
    g += num(x(t), h - 4, t, { cls: 'tick', a: 'middle' });
  }
  rows.forEach(([lab, v, key, note], i) => {
    const y = i * (barH + gapY) + 4;
    g += `<text x="0" y="${y + barH - 4}" class="lab">${esc(lab)}</text>`;
    g += `<rect x="${labelW}" y="${y}" width="${x(v) - labelW}" height="${barH}" fill="${key ? FLAME : MUTE}"/>`;
    g += num(x(v) + 6, y + barH - 4, v + unit, { cls: 'v' });
    if (note) g += num(w, y + barH - 4, note, { cls: 'tick', a: 'end' });
  });
  if (ref != null) {
    g += `<line x1="${x(ref)}" x2="${x(ref)}" y1="-6" y2="${h - 18}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 3" class="ref"/>`;
    g += `<text x="${x(ref) + 4}" y="-8" class="tick">${esc(refLabel)}</text>`;
  }
  return `<svg width="${w}" height="${h + 14}" viewBox="0 -14 ${w} ${h + 14}">${g}</svg>`;
}

// Share of new homes with a patio by year started. 2020-2022 are not in the source file: left empty.
function yearDots(w, h) {
  const pts = [[2019, 59.6], [2023, 63.7], [2024, 61.8], [2025, 60.5]];
  const L = 34, R = 24, T = 24, B = 28, lo = 58, hi = 65;
  const x = yr => L + 16 + (yr - 2019) / 6 * (w - L - R - 16), y = v => T + (hi - v) / (hi - lo) * (h - T - B);
  let g = '';
  for (const t of [58, 60, 62, 64]) {
    g += `<line x1="${L}" x2="${w - R}" y1="${y(t)}" y2="${y(t)}" stroke="${RULE}"/>`;
    g += num(L - 6, y(t) + 4, t + '%', { cls: 'tick', a: 'end' });
  }
  for (let yr = 2019; yr <= 2025; yr++) g += num(x(yr), h - 8, yr, { cls: 'tick', a: 'middle' });
  g += `<text x="${(x(2020) + x(2022)) / 2}" y="${y(61) + 4}" class="tick" text-anchor="middle">2020–2022 not in source</text>`;
  g += `<polyline points="${pts.slice(1).map(([a, b]) => `${x(a)},${y(b)}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="2"/>`;
  for (const [yr, v] of pts) {
    const key = yr === 2025;
    g += `<circle cx="${x(yr)}" cy="${y(v)}" r="${key ? 6 : 4.5}" fill="${key ? FLAME : INK}" stroke="#fff" stroke-width="2"/>`;
    g += yr === 2019 ? num(x(yr) + 10, y(v) + 4, v + '%', { cls: 'v' }) : num(x(yr), y(v) - 11, v + '%', { cls: key ? 'v strong' : 'v', a: 'middle' });
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

// Patio size: a bar from zero for the US average (about 320 sq ft) on a sq ft scale, with the two regional
// bounds the source gives ("under 200", "over 400") drawn as open-ended markers, never as values.
function sizeScale(w) {
  const L = 0, R = 10, h = 150, max = 500, x = v => L + v / max * (w - L - R);
  let g = '';
  for (const t of [0, 100, 200, 300, 400, 500]) {
    g += `<line x1="${x(t)}" x2="${x(t)}" y1="34" y2="${h - 20}" stroke="${RULE}"/>`;
    g += num(x(t), h - 4, t + (t === 500 ? ' sq ft' : ''), { cls: 'tick', a: t === 0 ? 'start' : t === 500 ? 'end' : 'middle' });
  }
  // average bar
  g += `<rect x="${x(0)}" y="64" width="${x(320) - x(0)}" height="22" fill="${FLAME}"/>`;
  g += num(x(320) + 8, 80, 'US average, about 320', { cls: 'v' });
  // under 200 (West South Central): open arrow pointing down-scale from 200
  g += `<line x1="${x(200)}" x2="${x(200) - 70}" y1="22" y2="22" stroke="${INK}" stroke-width="2"/><path d="M${x(200) - 70},17 l-8,5 l8,5 z" fill="${INK}"/>`;
  g += `<line x1="${x(200)}" x2="${x(200)}" y1="14" y2="30" stroke="${INK}" stroke-width="2"/>`;
  g += num(x(200) - 4, 10, 'Under 200: West South Central', { cls: 'lab', a: 'end' });
  // over 400 (East North Central, East South Central)
  g += `<line x1="${x(400)}" x2="${x(400) + 60}" y1="112" y2="112" stroke="${INK}" stroke-width="2"/><path d="M${x(400) + 60},107 l8,5 l-8,5 z" fill="${INK}"/>`;
  g += `<line x1="${x(400)}" x2="${x(400)}" y1="104" y2="120" stroke="${INK}" stroke-width="2"/>`;
  g += num(x(400) - 6, 116, 'Over 400: East North Central, East South Central', { cls: 'lab', a: 'end' });
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

// Slope chart: AIA net scores 2024 -> Q2 2025.
function slope(w, h) {
  const rows = [['Outdoor living spaces', 60, 55, true], ['Blended indoor/outdoor spaces', 51, 40, false]];
  const L = 44, R = 44, T = 20, B = 24, lo = 36, hi = 64;
  const x0 = L, x1 = w - R, y = v => T + (hi - v) / (hi - lo) * (h - T - B);
  let g = `<line x1="${x0}" x2="${x0}" y1="${T - 8}" y2="${h - B + 4}" stroke="${RULE}"/><line x1="${x1}" x2="${x1}" y1="${T - 8}" y2="${h - B + 4}" stroke="${RULE}"/>`;
  g += num(x0, h - 6, '2024', { cls: 'tick', a: 'middle' }) + num(x1, h - 6, 'Q2 2025', { cls: 'tick', a: 'middle' });
  for (const [lab, a, b, key] of rows) {
    const c = key ? FLAME : MUTE;
    g += `<line x1="${x0}" y1="${y(a)}" x2="${x1}" y2="${y(b)}" stroke="${c}" stroke-width="${key ? 3 : 2}"/>`;
    g += `<circle cx="${x0}" cy="${y(a)}" r="5" fill="${c}" stroke="#fff" stroke-width="2"/><circle cx="${x1}" cy="${y(b)}" r="5" fill="${c}" stroke="#fff" stroke-width="2"/>`;
    g += num(x0 - 10, y(a) + 4, a + '%', { cls: key ? 'v strong' : 'v', a: 'end' });
    g += num(x1 + 10, y(b) + 4, b + '%', { cls: key ? 'v strong' : 'v' });
    g += `<text x="${(x0 + x1) / 2}" y="${y((a + b) / 2) - 10}" class="lab" text-anchor="middle">${esc(lab)}</text>`;
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

// Cost recovered: $10,500 = 100%, about 95% recovered.
function recovered(w) {
  const rec = w * 0.95;
  return `<svg width="${w}" height="56" viewBox="0 0 ${w} 56">
    <rect x="0" y="0" width="${w}" height="22" fill="${RULE}"/><rect x="0" y="0" width="${rec}" height="22" fill="${FLAME}"/>
    <line x1="${rec}" x2="${rec}" y1="0" y2="30" stroke="${INK}" stroke-width="1.5"/>
    ${num(0, 44, 'Recovered at resale: about 95%', { cls: 'lab' })}
    ${num(w, 44, 'Typical cost: $10,500 = 100%', { cls: 'lab', a: 'end' })}
  </svg>`;
}

// Joy Score dot plot on 9.0-10 (axis does not start at zero, so dots, not bars).
function joy(w) {
  const rows = [['In-ground pool', 10, false], ['Landscape lighting', 10, false], ['New patio', 9.9, true]];
  const L = 128, R = 30, lo = 9.0, hi = 10, rowH = 46, h = rows.length * rowH + 40;
  const x = v => L + (v - lo) / (hi - lo) * (w - L - R);
  let g = '';
  for (const t of [9.0, 9.25, 9.5, 9.75, 10]) {
    g += `<line x1="${x(t)}" x2="${x(t)}" y1="10" y2="${h - 24}" stroke="${RULE}" stroke-dasharray="2 3"/>`;
    g += num(x(t), h - 8, t === 9.25 || t === 9.75 ? t.toFixed(2) : t.toFixed(1), { cls: 'tick', a: 'middle' });
  }
  rows.forEach(([lab, v, key], i) => {
    const y = i * rowH + 26;
    g += `<text x="0" y="${y + 4}" class="lab">${esc(lab)}</text>`;
    g += `<line x1="${x(lo)}" x2="${x(hi)}" y1="${y}" y2="${y}" stroke="${RULE}"/>`;
    g += `<circle cx="${x(v)}" cy="${y}" r="${key ? 7 : 5.5}" fill="${key ? FLAME : INK}" stroke="#fff" stroke-width="2"/>`;
    g += num(x(v) - 13, y + 4, String(v === 10 ? '10' : v), { cls: key ? 'v strong' : 'v', a: 'end' });
  });
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

// ---- Pages -------------------------------------------------------------------
let pg = 0;
const head = (n, label) => `<header class="run"><span class="run-n">${n}</span><span class="run-l">${label}</span><span class="run-r">${TITLE}</span></header>`;
const foot = () => `<footer class="foot"><img src="${ROOT}/decks/img/logo.png" alt="Bromic Heating" class="logo-s"><span>Every figure is quoted from its named public source.</span><span class="pg">${++pg}</span></footer>`;

const pages = [];

pg++;
pages.push(`
<section class="page cover">
  <div class="kicker"><span class="disp title">${TITLE}</span><span class="kr"><span class="dot"></span>How America Lives Outdoors · US</span></div>
  <div class="hero-num">60.5<span class="pct">%</span></div>
  <div class="cover-grid">
    <div class="cover-left">
      <h1 class="disp">Six In Ten New Homes Come With A Patio</h1>
      <p class="lede">Share of the roughly 940,000 US single-family homes started in 2025 that came with a patio – down from 61.8% in 2024, and the lowest share since 2019.</p>
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
</section>`);

pages.push(`
<section class="page inner">
  ${head('01', 'How Many New Homes Come With A Patio')}
  <div class="intro">
    <h2 class="disp h2">The Numbers Behind The Evenings Americans Spend Outdoors</h2>
    <p class="body">Every one of these numbers comes back to the same evening: a table set outside, friends who would happily stay another hour, and the chill that eventually calls everyone in. Together they show how much of the American home now lives beneath the open sky.</p>
  </div>
  <figure class="band b2"><img src="${img('t-001-000')}" alt="A modern timber house with its deck glowing at dusk"></figure>
  <article class="mod row">
    <div class="mn">01</div>
    <div class="split s940">
      <div class="fig">940,000</div>
      <p class="cap">Roughly how many US single-family homes were started in 2025. 60.5% of them came with a patio – down from 61.8% in 2024, a second fall in a row after the first in fifteen years.</p>
    </div>
    ${src(SRC.s1)}
  </article>
  <div class="grid g2">
    <article class="mod">
      <div class="mn">02</div>
      <h3>Where You Build Makes A Real Difference</h3>
      <p class="unit">% of single-family homes started in 2025 with a patio, by census division</p>
      ${hbars([['West South Central', 77, true], ['Mountain', 74, true], ['South Atlantic', 66, true], ['New England', 26, false, 'up from 14% in 2024'], ['Middle Atlantic', 23, false, 'fewest']], span(6), { ref: 60.5, refLabel: 'US 60.5%' })}
      ${src(SRC.s1)}
    </article>
    <article class="mod">
      <div class="mn">03</div>
      <h3>A Second Fall In A Row</h3>
      <p class="unit">% of single-family homes started with a patio, by year started</p>
      ${yearDots(span(6), 150)}
      <p class="cap sm">2024 was the first decline in fifteen years; 2025 is the lowest share since 2019.</p>
      ${src(SRC.s1s2)}
    </article>
  </div>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('02', 'The Patio Becomes A Room')}
  <h2 class="disp h2">At This Size, A Patio Is A True Outdoor Room</h2>
  <div class="grid g-size">
    <article class="mod">
      <div class="mn">04</div>
      <div class="fig xl">320<span class="u">sq ft</span></div>
      <p class="cap">About the size of the average patio on a US home built in 2024. At that size it deserves the same thoughtful planning as any room inside.</p>
      <p class="unit" style="margin-top:18px">Average patio size, homes built in 2024, sq ft (regional averages given as bounds in the source)</p>
      ${sizeScale(span(12))}
      ${src(SRC.s3)}
    </article>
    <article class="mod">
      <div class="mn">05</div>
      <h3>Architects Still Rank Outdoor Living First</h3>
      <p class="unit">Net % of architects reporting rising popularity (share increasing minus share decreasing)</p>
      ${slope(span(7), 170)}
      ${src(SRC.s4)}
    </article>
    <aside class="note">
      <p class="note-k">Read It Right</p>
      <p>Outdoor living spaces remained the most popular exterior feature in Q2 2025. Blended indoor/outdoor spaces – kitchens that open onto a terrace, glass walls that slide away – also stayed positive: more architects still see this demand rising than falling.</p>
    </aside>
  </div>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('03', 'What Homeowners Invest')}
  <h2 class="disp h2">Steady Spending, Careful Choices</h2>
  <div class="grid g1">
    <article class="mod">
      <div class="mn">06</div>
      <div class="fig xl">$525<span class="u">billion</span></div>
      <p class="cap wide">About what US homeowners spend a year on improvements and repairs to owner-occupied homes. Harvard's Joint Center for Housing Studies expects spending to hold near that level through the third quarter of 2027 – so homeowners are choosing carefully and putting their money into the projects they value most.</p>
      ${src(SRC.s5)}
    </article>
    <article class="mod">
      <div class="mn">07</div>
      <div class="split">
        <div>
          <div class="fig">33<span class="u">%</span></div>
          <p class="cap">Of homeowners upgrading outdoor areas, the share whose goal was to extend their living space. Very often they want more room to live in.</p>
        </div>
        <div>
          <h3>Strongest Among Gen X</h3>
          <p class="unit">% of outdoor upgraders aiming to extend living space, by generation, 2024</p>
          ${hbars([['All upgraders', 33, true], ['Gen X', 41], ['Millennials', 38], ['Baby boomers', 28]], span(7), { max: 50, ticks: [0, 25, 50], barH: 16, gapY: 12, labelW: 100 })}
        </div>
      </div>
      ${src(SRC.s6)}
    </article>
  </div>
  <figure class="band b4"><img src="${img('t-012-034')}" alt="A large pergola patio with an outdoor kitchen and dining area"></figure>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('04', 'What A Patio Gives Back')}
  <div class="grid g-close">
    <article class="mod">
      <div class="mn">08</div>
      <div class="fig xl">95<span class="u">%</span></div>
      <p class="cap">About the share of a new patio's cost that Realtors estimate is recovered when the home sells, at a typical cost of $10,500.</p>
      ${recovered(span(7))}
      <p class="cap sm">Actual returns depend on design, materials, location and the home's condition.</p>
      ${src(SRC.s78)}
    </article>
    <figure class="plate"><img src="${img('t-005-013')}" alt="A couple relaxing by an outdoor fireplace beneath a covered patio"></figure>
    <article class="mod">
      <div class="mn">09</div>
      <h3>Third For Joy, Behind Only The Pool And The Lights</h3>
      <p class="unit">Joy Score out of 10, homeowners who completed the project (axis from 9.0)</p>
      ${joy(span(7))}
      <p class="cap sm">The people who build one use it often, and they are glad they did.</p>
      ${src(SRC.s7)}
    </article>
  </div>
  ${foot()}
</section>`);

const glance = [
  ['New single-family homes started with a patio', '60.5%', '61.8% in 2024', 'NAHB, Census Survey of Construction', '2025 starts'],
  ['Average new-home patio size', 'About 320 sq ft', '', 'NAHB, Builder Practices Survey', 'Homes built 2024'],
  ["Architects' net demand score, outdoor living spaces", '55%', '60% in 2024', 'AIA Home Design Trends Survey', 'Q2 2025'],
  ["Architects' net demand score, blended indoor/outdoor spaces", '40%', '51% in 2024', 'AIA Home Design Trends Survey', 'Q2 2025'],
  ['Annual US homeowner improvement and repair spending', 'About $525 billion', '', 'Harvard JCHS, LIRA', 'Through Q3 2027'],
  ['Outdoor upgraders aiming to extend living space', '33%', '', 'Houzz Outdoor Trends Study', '2024'],
  ['New patio cost recovered at resale', 'About 95%', 'of $10,500', 'NAR and NALP Remodeling Impact Report', '2023'],
  ['New patio Joy Score', '9.9', 'out of 10', 'NAR and NALP Remodeling Impact Report', '2023'],
];
pages.push(`
<section class="page inner">
  ${head('05', 'The Year At A Glance')}
  <h2 class="disp h2">Every Number, With Its Source</h2>
  <table class="glance">
    <thead><tr><th class="n">#</th><th>Statistic</th><th class="r">Figure</th><th>Source</th><th>Year</th></tr></thead>
    <tbody>${glance.map(([s, f, f2, so, y], i) => `<tr><td class="n">${String(i + 1).padStart(2, '0')}</td><td>${esc(s)}</td><td class="r"><b>${esc(f)}</b>${f2 ? `<span>${esc(f2)}</span>` : ''}</td><td class="so">${esc(so)}</td><td class="so">${esc(y)}</td></tr>`).join('')}</tbody>
  </table>
  <div class="takeaways">
    <p class="note-k">What These Numbers Tell Us</p>
    <ol>
      <li>Most new US homes now come with a patio, and the patio keeps growing.</li>
      <li>Architects still place outdoor living at the top of exterior features, even as demand cooled in 2025.</li>
      <li>A new patio comes close to paying for itself at resale and scores near the top for homeowner joy.</li>
      <li>How a patio feels after dark and through the cooler months is decided at the planning stage, when power, mounting and controls can be drawn into the design from the very beginning.</li>
    </ol>
  </div>
  ${foot()}
</section>`);

const faq = [
  ['What percentage of new homes have a patio?', "60.5% of US single-family homes started in 2025 came with a patio, according to NAHB's analysis of Census data. The share was 61.8% in 2024."],
  ['How big is a typical new-home patio in the US?', "Homes built in 2024 have a patio of about 320 square feet on average, according to NAHB's Builder Practices Survey. Regional averages run from under 200 to over 400 square feet."],
  ['Is outdoor living still a design trend in 2026?', "It is. AIA's Q2 2025 survey found outdoor living spaces were still the most popular exterior feature, with a net 55% of architects reporting rising popularity, down from 60% a year earlier."],
  ['Is a new patio a good investment?', 'On resale value alone it comes close to break-even, with Realtors estimating that a new patio recovers about 95% of its cost. Homeowners also rate it 9.9 out of 10 for joy.'],
  ['How much do Americans spend on home improvement each year?', "Americans spend about $525 billion a year on improvements and repairs to owner-occupied homes, according to Harvard's Leading Indicator of Remodeling Activity, released October 2026."],
];
pages.push(`
<section class="page close">
  ${head('06', 'Questions And Sources')}
  <div class="grid g2 faq">
    ${faq.map(([q, a], i) => `<div class="qa"><div class="mn">Q${i + 1}</div><h4>${esc(q)}</h4><p>${esc(a)}</p></div>`).join('')}
    <div class="qa"><div class="mn">Q6</div><h4>Where do these numbers come from?</h4><p>Each figure comes from a named public source: NAHB, the AIA, Harvard's Joint Center for Housing Studies, Houzz, and the NAR with the NALP.</p></div>
  </div>
  <div class="sources">
    <p class="note-k">Sources</p>
    <ol>${SOURCES.map(([id, p, t, y, u]) => `<li><b>${esc(p)}</b>, ${esc(t)}, ${y}. <span>${esc(u)}</span></li>`).join('')}</ol>
  </div>
  <div class="cta">
    <p class="cta-k">The Full Picture</p>
    <h2 class="disp cta-h">See What These Numbers Mean For Your Next Outdoor Space</h2>
    <div class="cta-row"><span class="btn">Download Outdoor Living Trends 2027</span><span class="site">bromic.com</span></div>
  </div>
  ${foot()}
</section>`);

// ---- Style -------------------------------------------------------------------
const css = `
@font-face{font-family:Didot;src:url(${ROOT}/app/src/fonts/gfs-didot-latin.woff2) format('woff2')}
@font-face{font-family:Arimo;src:url(${ROOT}/app/src/fonts/arimo-latin.woff2) format('woff2');font-weight:100 900}
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff;color:${INK};font-family:Arimo,Helvetica,Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:${W}px;height:${H}px;padding:${M}px;position:relative;overflow:hidden;page-break-after:always;break-after:page}
.disp{font-family:Didot,'GFS Didot',serif;font-weight:400;letter-spacing:-.005em}
svg{display:block;overflow:visible} svg text{font-family:Arimo,Helvetica,Arial,sans-serif}
.v{font-size:11px;font-weight:700;fill:${INK}} .v.strong{font-size:12px}
.tick{font-size:9px;fill:${STEEL}} .lab{font-size:10.5px;fill:${INK}}
.src{font-size:8px;line-height:1.35;color:${STEEL};margin-top:8px;max-width:${span(7)}px}
.kicker{display:flex;justify-content:space-between;align-items:baseline;border-top:3px solid ${INK};padding-top:12px}
.kicker .title{font-size:30px;line-height:1}
.kr{font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;display:flex;align-items:center;gap:8px}
.dot{width:8px;height:8px;background:${FLAME};display:inline-block}
.cover{display:flex;flex-direction:column}
.cover-grid{display:grid;grid-template-columns:${span(7)}px ${span(5)}px;gap:${GUT}px;margin-top:auto;margin-bottom:28px;align-items:end;border-top:1px solid ${INK};padding-top:14px}
.hero-num{font-weight:700;font-size:330px;line-height:.78;letter-spacing:-.065em;margin:auto 0 0 -14px;white-space:nowrap}
.hero-num .pct{font-size:150px;letter-spacing:-.02em;vertical-align:top;line-height:1;margin-left:4px}
.cover-left h1{font-size:50px;line-height:1.02;max-width:${span(7)}px}
.lede{font-size:15px;line-height:1.5;margin-top:24px;max-width:${span(6)}px}
.cover-right{margin:0}
figcaption{font-size:9.5px;color:${STEEL};margin-top:10px;display:flex;align-items:center;gap:6px}
.sw{width:9px;height:9px;display:inline-block}.sw.flame{background:${FLAME}}
.cover-foot{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid ${INK};padding-top:10px}
.cover-foot .src{margin:0}
.logo{height:34px}
.run{display:grid;grid-template-columns:${span(1)}px 1fr auto;gap:${GUT}px;align-items:baseline;border-top:3px solid ${INK};padding-top:10px;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:700}
.run-n{font-size:40px;letter-spacing:-.03em;line-height:.8;color:${FLAME}}
.run-r{color:${STEEL};font-weight:400}
.h2{font-size:34px;line-height:1.05;margin:16px 0 18px}
.intro{display:grid;grid-template-columns:${span(7)}px ${span(5)}px;gap:${GUT}px;align-items:end;margin-bottom:16px}
.intro .h2{margin:16px 0 0}
.body{font-size:11.5px;line-height:1.5}
.band{height:250px;overflow:hidden;margin:0 0 22px;background:${INK}}
.b2{height:220px}.b4{height:190px;margin:30px 0 0}.row{margin:0 0 22px}.s940{grid-template-columns:${span(7)}px ${span(5)}px}.s940 .fig{font-size:88px}.row .split{align-items:end}.row .cap{margin:0 0 6px}
.band img,.plate img{width:100%;height:100%;object-fit:cover;filter:url(#duo);display:block}
.grid.g2{display:grid;grid-template-columns:${span(6)}px ${span(6)}px;column-gap:${GUT}px;row-gap:18px}
.grid.g1{display:grid;grid-template-columns:1fr;row-gap:34px}
.g-size{display:grid;grid-template-columns:${span(7)}px ${span(5)}px;column-gap:${GUT}px;row-gap:30px}
.g-size .mod:first-child{grid-column:1 / span 2}
.note{border-top:1px solid ${INK};padding-top:8px;align-self:start}
.note p{font-size:11.5px;line-height:1.5;margin-top:10px}
.note-k{font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:${FLAME}}
.mod{border-top:1px solid ${INK};padding-top:8px;position:relative}
.mn{font-size:9px;font-weight:700;color:${FLAME};letter-spacing:.1em}
.mod h3{font-family:Didot,serif;font-weight:400;font-size:19px;line-height:1.15;margin-top:4px}
.unit{font-size:9.5px;color:${STEEL};margin:4px 0 12px}
.fig{font-weight:700;font-size:110px;line-height:.9;letter-spacing:-.05em;margin-top:6px;white-space:nowrap}
.fig .u{font-size:30px;letter-spacing:-.01em;margin-left:8px}
.fig.xl{font-size:200px}.g-close .fig.xl{font-size:240px}.fig.xl .u{font-size:60px;margin-left:6px}
.cap{font-size:11.5px;line-height:1.45;margin-top:10px;max-width:${span(6)}px}
.cap.wide{max-width:${span(9)}px;font-size:13px}
.cap.sm{font-size:10px;color:${STEEL};margin-top:6px}
.split{display:grid;grid-template-columns:${span(5)}px ${span(7)}px;gap:${GUT}px;align-items:start}
.split h3{margin-top:14px}
.foot{position:absolute;left:${M}px;right:${M}px;bottom:${M - 18}px;display:flex;gap:14px;align-items:center;font-size:8px;color:${STEEL};border-top:1px solid ${RULE};padding-top:8px}
.logo-s{height:16px}.foot .pg{margin-left:auto;font-weight:700;color:${INK};font-size:10px}
.g-close{display:grid;grid-template-columns:${span(7)}px ${span(5)}px;column-gap:${GUT}px;row-gap:40px;margin-top:22px;height:820px;grid-template-rows:auto 1fr}
.plate{grid-row:1 / span 2;grid-column:2;position:relative;overflow:hidden;background:${INK};margin:0}
table.glance{width:100%;border-collapse:collapse;font-size:11px;margin-top:4px}
.glance th{background:${INK};color:#fff;text-align:left;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;padding:8px 10px}
.glance td{border-bottom:1px solid ${RULE};padding:13px 10px;vertical-align:top;line-height:1.35}
.glance .n{color:${FLAME};font-weight:700;font-size:9px;width:34px}
.glance .r{text-align:right;white-space:nowrap}
.glance td.r b{font-size:15px;display:block}
.glance td.r span{font-size:9px;color:${STEEL}}
.glance .so{color:${STEEL};font-size:10px}
.takeaways{margin-top:34px;border-top:1px solid ${INK};padding-top:8px}
.takeaways ol{list-style:none;counter-reset:t;display:grid;grid-template-columns:1fr 1fr;gap:14px ${GUT}px;margin-top:12px}
.takeaways li{counter-increment:t;font-family:Didot,serif;font-size:19px;line-height:1.25;padding-left:34px;position:relative}
.takeaways li::before{content:counter(t,decimal-leading-zero);position:absolute;left:0;top:3px;font-family:Arimo,sans-serif;font-weight:700;font-size:11px;color:${FLAME}}
.faq{margin-top:22px;row-gap:16px}
.qa{border-top:1px solid ${INK};padding-top:8px}
.qa h4{font-family:Didot,serif;font-weight:400;font-size:15px;line-height:1.2;margin:3px 0 5px}
.qa p{font-size:10px;line-height:1.45}
.sources{margin-top:20px;border-top:1px solid ${INK};padding-top:8px}
.sources ol{columns:2;column-gap:${GUT}px;margin:8px 0 0 14px;font-size:7.8px;line-height:1.4;color:${STEEL}}
.sources li{break-inside:avoid;margin-bottom:4px}.sources li b{color:${INK};font-weight:700}
.sources li span{word-break:break-all}
.cta{position:absolute;left:${M}px;right:${M}px;bottom:${M + 26}px;background:${INK};color:#fff;padding:26px ${span(1) + GUT}px 28px}
.cta-k{font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:${FLAME}}
.cta-h{font-size:32px;line-height:1.08;margin-top:10px;max-width:${span(9)}px}
.cta-row{display:flex;align-items:center;gap:22px;margin-top:18px}
.btn{background:${FLAME};color:#fff;font-weight:700;font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding:13px 20px}
.site{font-size:12px;letter-spacing:.06em}
`;

const duo = `<svg width="0" height="0" style="position:absolute"><filter id="duo" color-interpolation-filters="sRGB">
<feColorMatrix type="saturate" values="0"/>
<feComponentTransfer><feFuncR type="table" tableValues="0.137 0.94"/><feFuncG type="table" tableValues="0.122 0.90"/><feFuncB type="table" tableValues="0.125 0.86"/></feComponentTransfer>
</filter></svg>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${TITLE} – Bromic Heating</title><style>${css}</style></head><body>${duo}${pages.join('')}</body></html>`;
writeFileSync(join(here, 'index.html'), html);

// ---- Render + print check ---------------------------------------------------
const pdir = join(here, 'pages');
if (existsSync(pdir)) rmSync(pdir, { recursive: true });
mkdirSync(pdir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto('file://' + join(here, 'index.html'));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
const problems = await page.evaluate(() => {
  const out = [];
  if (document.body.innerText.includes('[[VERIFY') || document.documentElement.innerHTML.includes('[[VERIFY')) out.push('raw [[VERIFY in output');
  const hit = (a, b, t = 1) => a.left < b.right - t && b.left < a.right - t && a.top < b.bottom - t && b.top < a.bottom - t;
  document.querySelectorAll('.page').forEach((pg, pi) => {
    const P = pg.getBoundingClientRect(), tag = `p${pi + 1}`;
    pg.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || el.closest('defs,filter')) return;
      if (r.right > P.right - 20 || r.bottom > P.bottom - 10 || r.left < P.left + 20 || r.top < P.top + 20)
        if (!el.closest('.foot') || r.bottom > P.bottom || r.right > P.right) out.push(`${tag} off page/margin: ${el.tagName}.${el.className?.baseVal ?? el.className} "${el.textContent.trim().slice(0, 30)}"`);
    });
    // text overflowing its own box
    pg.querySelectorAll('p,h1,h2,h3,h4,li,td,th,span,div').forEach(el => {
      if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible' && el.clientWidth) out.push(`${tag} clipped: ${el.className} "${el.textContent.slice(0, 30)}"`);
    });
    pg.querySelectorAll('.fig,.hero-num,h1,h2,h3,h4,p,td,th,li').forEach(el => { if (el.clientWidth && el.scrollWidth > el.clientWidth + 1) out.push(`${tag} text wider than its box: "${el.textContent.trim().slice(0, 30)}"`); });
    const tb = [...pg.querySelectorAll('.fig,.hero-num,h1,h2,h3,h4,p,svg,table,figure,ol')].filter(e => !e.closest('defs') && e.getBoundingClientRect().width);
    for (let i = 0; i < tb.length; i++) for (let j = i + 1; j < tb.length; j++) {
      if (tb[i].contains(tb[j]) || tb[j].contains(tb[i])) continue;
      if (hit(tb[i].getBoundingClientRect(), tb[j].getBoundingClientRect(), 2)) out.push(`${tag} text block overlap: "${tb[i].textContent.trim().slice(0, 25)}" / "${tb[j].textContent.trim().slice(0, 25)}"`);
    }
    // svg label overlaps
    const ts = [...pg.querySelectorAll('svg text')].map(t => [t, t.getBoundingClientRect()]);
    pg.querySelectorAll('svg .ref').forEach(l => { const lr = l.getBoundingClientRect(); ts.forEach(([t, r]) => { if (r.top > lr.top + 4 && hit(r, { left: lr.left - 1, right: lr.right + 1, top: lr.top, bottom: lr.bottom }, 0)) out.push(`${tag} text on reference line: "${t.textContent}"`); }); });
    for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) if (hit(ts[i][1], ts[j][1])) out.push(`${tag} label overlap: "${ts[i][0].textContent}" / "${ts[j][0].textContent}"`);
    // blocks overlapping each other, the CTA band or the footer
    const blocks = [...pg.querySelectorAll('.run,.mod,.plate,.band,.note,.intro,table,.takeaways,.qa,.sources,.cta,.foot,.h2,.cover-grid,.hero-num,.kicker,.cover-foot')].filter(b => !b.parentElement.closest('.mod,.cta,.intro,.cover-grid,.kicker'));
    for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
      if (blocks[i].contains(blocks[j]) || blocks[j].contains(blocks[i])) continue;
      if (hit(blocks[i].getBoundingClientRect(), blocks[j].getBoundingClientRect())) out.push(`${tag} block overlap: ${blocks[i].className} / ${blocks[j].className}`);
    }
    // content of a module running into the next block
    pg.querySelectorAll('img').forEach(im => { if (!im.complete || !im.naturalWidth) out.push(`${tag} missing image ${im.getAttribute('src')}`); });
  });
  return out;
});
const els = await page.$$('.page');
for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: join(pdir, `p${String(i + 1).padStart(2, '0')}.png`) });
const pdfPath = join(here, PDF);
await page.pdf({ path: pdfPath, width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true });
await browser.close();

const size = statSync(pdfPath).size;
if (size > 6 * 1024 * 1024) problems.push(`PDF too large: ${size} bytes`);
const rel = p => `reports/designed/${ID}/${p}`;
writeFileSync(join(here, 'meta.json'), JSON.stringify({ item_id: ID, theme: 'data-poster', title: TITLE, pdf: rel(PDF), cover: rel('pages/p01.png'), pages: els.length }, null, 2) + '\n');
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
else console.log(`OK: ${els.length} pages, ${(size / 1024).toFixed(0)} KB, print check clean`);
