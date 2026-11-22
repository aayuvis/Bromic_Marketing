// A01-stats-eu "How Europe Lives Outdoors 2027" in the Data Poster theme (reports/themes/data-poster), the European edition of A01-stats.
// Every figure is copied from content/reports/A01-stats-eu-page.md (body or front matter `sources[].supports`).
// Nothing is rounded, combined or invented. Metric units, British spelling, money as the source gives it.
// Run: node reports/designed/A01-stats-eu/build.mjs  ->  index.html, pages/pNN.png, the PDF, cover-thumb.webp, meta.json
import { writeFileSync, mkdirSync, existsSync, statSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '../../..');
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ID = 'A01-stats-eu', TITLE = 'How Europe Lives Outdoors 2027';
const PDF = `Bromic-${ID}-How-Europe-Lives-Outdoors-2027.pdf`;

// ---- Images: Bromic library webp (European installations) -> JPEG q82, long side <= 2000 px
const IMGS = ['w-84-hr-grosveldvandervelde-nl1-2021', 'w-the-ivy-london-tungsten-electric', 'w-residential-belgium-brussels-blackcontemp-re', 'w-tungsten-electric-dalloway-terrace-london'];
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
  s1: 'Horticultural Trades Association (HTA), garden industry statistics, 2025',
  s2: 'Eurostat, Housing in Europe, 2024 edition (2023 data)',
  s3: 'Met Office, summer 2026 provisionally hottest on record for the UK, September 2026',
  s4: 'KNMI (Royal Netherlands Meteorological Institute), year overview 2025',
  s5: 'Deutscher Wetterdienst (DWD), the weather in Germany in the year 2025, December 2025',
  s6: 'CBS (Statistics Netherlands), hospitality turnover, March 2026',
  s7: 'CGA RSM Hospitality Business Tracker, April 2025 (reported by The Morning Advertiser, May 2025)',
  s8: 'Ministry of Housing, Communities and Local Government, pavement licences guidance, 2024',
  s9: 'Décret n° 2022-452 du 30 mars 2022, as summarised by CCI Paris Île-de-France, 2022',
  s10: 'Eurostat, renewable electricity in the EU, January 2026 (2024 data)',
  s11: 'Carbon Brief, UK electricity in 2025, January 2026',
  s12: 'Ministry of Housing, Communities and Local Government, Future Homes and Buildings Standards: consultation response, March 2026',
  s13: 'HTA Market Update, July 2026 (reported by Insight DIY, August 2026)',
};
const SOURCES = [
  ['s1', 'Horticultural Trades Association (HTA)', 'Garden industry statistics', 2025, 'hta.org.uk/news-events-current-issues/industry-data/garden-industry-statistics'],
  ['s2', 'Eurostat', 'Housing in Europe, 2024 edition', 2024, 'ec.europa.eu/eurostat/web/interactive-publications/housing-2024'],
  ['s3', 'Met Office', 'Summer 2026 provisionally hottest on record for the UK', 2026, 'metoffice.gov.uk/about-us/news-and-media/media-centre/weather-and-climate-news/2026/summer-2026-provisionally-hottest-on-record-for-the-uk'],
  ['s4', 'KNMI', 'Jaar 2025 (maand- en seizoensoverzichten)', 2026, 'knmi.nl/nederland-nu/klimatologie/maand-en-seizoensoverzichten/2025/jaar'],
  ['s5', 'Deutscher Wetterdienst', 'The weather in Germany in the year 2025', 2025, 'dwd.de/EN/press/press_release/EN/2025/20251230_the_weather_in_germany_year_2025_news.html'],
  ['s6', 'CBS (Statistics Netherlands)', 'Omzet horeca groeit in vierde kwartaal met ruim 3 procent', 2026, 'cbs.nl/nl-nl/nieuws/2026/10/omzet-horeca-groeit-in-vierde-kwartaal-met-ruim-3-procent'],
  ['s7', 'The Morning Advertiser (CGA RSM Hospitality Business Tracker)', 'Pubs toast sales boom in April', 2025, 'morningadvertiser.co.uk/Article/2025/05/28/managed-pub-groups-sales-up-91-in-april-2025'],
  ['s8', 'Ministry of Housing, Communities and Local Government', 'Pavement licences: guidance', 2024, 'gov.uk/government/publications/pavement-licences-guidance/pavement-licences-guidance'],
  ['s9', 'CCI Paris Île-de-France', "L'interdiction de chauffer ou de climatiser les terrasses (Décret n° 2022-452)", 2022, 'entreprises.cci-paris-idf.fr/actualites/linterdiction-de-chauffer-ou-de-climatiser-les-terrasses-des-cafes-bars-et-restaurants'],
  ['s10', 'Eurostat', "Nearly half of the EU's electricity consumption came from renewables", 2026, 'ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20260114-1'],
  ['s11', 'Carbon Brief', 'Analysis: UK renewables enjoy record year in 2025', 2026, 'carbonbrief.org/analysis-uk-renewables-enjoy-record-year-in-2025-but-gas-power-still-rises'],
  ['s12', 'Ministry of Housing, Communities and Local Government', 'The Future Homes and Buildings Standards: consultation response', 2026, 'assets.publishing.service.gov.uk/media/69c13592bb0dfe55b83e4b85/Future_Homes_and_Buildings_Standards_Consultation_Response.pdf'],
  ['s13', 'Insight DIY, reporting the HTA Market Update', 'July garden centre sales strong despite weather challenges', 2026, 'insightdiy.co.uk/news/july-garden-centre-sales-strong-despite-weather-challenges/16757.htm'],
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const src = s => `<p class="src">Source: ${esc(s)}</p>`;
const num = (x, y, s, o = {}) => `<text x="${x}" y="${y}" class="${o.cls || 'v'}" text-anchor="${o.a || 'start'}">${esc(s)}</text>`;
const fmt = v => (typeof v === 'number' ? v.toLocaleString('en-GB') : v);

// ---- Charts (flat SVG) ------------------------------------------------------
// Waffle: 100 cells, n filled. One cell = 1% of British adults.
function waffle(size, gap, n) {
  const cell = (size - 9 * gap) / 10; let out = '';
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10;
    out += `<rect x="${c * (cell + gap)}" y="${r * (cell + gap)}" width="${cell}" height="${cell}" fill="${i < n ? FLAME : RULE}"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${n} of 100 squares filled">${out}</svg>`;
}

// Horizontal bars from zero, optional reference line. rows: [label, value, key?, note?]
function hbars(rows, w, { max = 100, ticks = [0, 25, 50, 75, 100], ref, refLabel, unit = '%', barH = 16, gapY = 12, labelW = 128 } = {}) {
  const plotW = w - labelW - 92, h = rows.length * (barH + gapY) + 22;
  const x = v => labelW + (v / max) * plotW;
  let g = '';
  for (const t of ticks) {
    g += `<line x1="${x(t)}" x2="${x(t)}" y1="0" y2="${h - 18}" stroke="${RULE}" stroke-width="1"/>`;
    g += num(x(t), h - 4, fmt(t), { cls: 'tick', a: 'middle' });
  }
  rows.forEach(([lab, v, key, note], i) => {
    const y = i * (barH + gapY) + 4;
    g += `<text x="0" y="${y + barH - 4}" class="lab">${esc(lab)}</text>`;
    g += `<rect x="${labelW}" y="${y}" width="${x(v) - labelW}" height="${barH}" fill="${key ? FLAME : MUTE}"/>`;
    g += num(x(v) + 6, y + barH - 4, fmt(v) + unit, { cls: 'v' });
    if (note) g += num(w, y + barH - 4, note, { cls: 'tick', a: 'end' });
  });
  if (ref != null) {
    g += `<line x1="${x(ref)}" x2="${x(ref)}" y1="-6" y2="${h - 18}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 3" class="ref"/>`;
    g += `<text x="${x(ref) + 4}" y="-8" class="tick">${esc(refLabel)}</text>`;
  }
  return `<svg width="${w}" height="${h + 14}" viewBox="0 -14 ${w} ${h + 14}">${g}</svg>`;
}

// Dot plot on a cut axis (not from zero, so dots, not bars). rows: [label, value, key?]
function dots(rows, w, { lo, hi, ticks, unit = '', labelW = 128, rowH = 34 } = {}) {
  const R = 30, h = rows.length * rowH + 34;
  const x = v => labelW + (v - lo) / (hi - lo) * (w - labelW - R);
  let g = '';
  for (const t of ticks) {
    g += `<line x1="${x(t)}" x2="${x(t)}" y1="6" y2="${h - 22}" stroke="${RULE}" stroke-dasharray="2 3"/>`;
    g += num(x(t), h - 6, t.toFixed(1) + unit, { cls: 'tick', a: 'middle' });
  }
  rows.forEach(([lab, v, key], i) => {
    const y = i * rowH + 20;
    g += `<text x="0" y="${y + 4}" class="lab">${esc(lab)}</text>`;
    g += `<line x1="${x(lo)}" x2="${x(hi)}" y1="${y}" y2="${y}" stroke="${RULE}"/>`;
    g += `<circle cx="${x(v)}" cy="${y}" r="${key ? 7 : 5.5}" fill="${key ? FLAME : INK}" stroke="#fff" stroke-width="2"/>`;
    g += num(x(v) - 13, y + 4, v.toFixed(1) + unit, { cls: key ? 'v strong' : 'v', a: 'end' });
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
  <div class="kicker"><span class="disp title">${TITLE}</span><span class="kr"><span class="dot"></span>UK · Benelux · Germany</span></div>
  <div class="hero-num">77<span class="pct">%</span></div>
  <div class="cover-grid">
    <div class="cover-left">
      <h1 class="disp">Three In Four British Adults Have A Garden</h1>
      <p class="lede">Share of British adults with access to a private garden – about 44 million people. Across the North Sea, 79% of people in the Netherlands and 77% in Belgium live in a house.</p>
    </div>
    <figure class="cover-right">
      ${waffle(span(5), 4, 77)}
      <figcaption><span class="sw flame"></span>One square = 1% of British adults</figcaption>
    </figure>
  </div>
  <div class="cover-foot">
    <div>${src(SRC.s1)}${src(SRC.s2)}</div>
    <img src="${ROOT}/decks/img/logo.png" alt="Bromic Heating" class="logo">
  </div>
</section>`);

pages.push(`
<section class="page inner">
  ${head('01', 'Homes With Room Outside')}
  <div class="intro">
    <h2 class="disp h2">The Numbers Behind The Evenings Europe Spends Outdoors</h2>
    <p class="body">Every one of these numbers comes back to the same evening: a table laid on the terrace, friends who would happily stay another hour, and the cool air that eventually calls everyone in. Together they show how much of European life now happens under the open sky.</p>
  </div>
  <figure class="band b2"><img src="${img('w-84-hr-grosveldvandervelde-nl1-2021')}" alt="A covered Dutch terrace at dusk beside a glass-walled kitchen, heaters recessed in the ceiling"></figure>
  <article class="mod row">
    <div class="mn">01</div>
    <div class="split s940">
      <div class="fig">44<span class="u">million</span></div>
      <p class="cap">British adults with access to a private garden – 77% of them. For most households the garden is already part of the home; the question is how many evenings of the year it can be used.</p>
    </div>
    ${src(SRC.s1)}
  </article>
  <div class="grid g2">
    <article class="mod">
      <div class="mn">02</div>
      <h3>Houses With Gardens Across The Low Countries</h3>
      <p class="unit">% of the population living in a house (incl. terraced houses), 2023</p>
      ${hbars([['Netherlands', 79, true], ['Belgium', 77, true], ['EU', 51.7, false]], span(6), { barH: 18, gapY: 14, labelW: 96 })}
      ${src(SRC.s2)}
    </article>
    <article class="mod">
      <div class="mn">03</div>
      <h3>In Germany, The Balcony Is The Outdoor Room</h3>
      <p class="unit">% of the population living in a flat, 2023</p>
      ${hbars([['Germany', 61, true], ['EU', 47.7, false]], span(6), { barH: 18, gapY: 14, labelW: 96 })}
      <p class="cap sm">Heat that mounts on a wall or a ceiling keeps a balcony's floor free.</p>
      ${src(SRC.s2)}
    </article>
  </div>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('02', 'Longer, Brighter Seasons')}
  <h2 class="disp h2">Warmer Years Bring More Evenings Outside</h2>
  <div class="grid g1 tight">
    <article class="mod">
      <div class="mn">04</div>
      <div class="split s-wide">
        <div>
          <div class="fig">16.5<span class="u">°C</span></div>
          <p class="cap">The UK's mean summer temperature in 2026 – provisionally the warmest summer since records began in 1884. All five of the warmest have come since 2003.</p>
        </div>
        <div>
          <h3>The UK's Five Warmest Summers</h3>
          <p class="unit">UK mean summer temperature, °C (axis from 15.5)</p>
          ${dots([['2026', 16.5, true], ['2025', 16.1], ['2018', 15.7], ['2006', 15.7], ['2003', 15.7]], span(7), { lo: 15.5, hi: 16.7, ticks: [15.5, 15.9, 16.3, 16.7], unit: '°C', labelW: 50, rowH: 28 })}
        </div>
      </div>
      ${src(SRC.s3)}
    </article>
  </div>
  <div class="grid g2 gap-top">
    <article class="mod">
      <div class="mn">05</div>
      <h3>The Netherlands' Second Sunniest Year</h3>
      <p class="unit">Hours of sunshine, Netherlands, 2025 and the normal</p>
      ${hbars([['2025', 2124, true], ['Normal', 1774, false]], span(6), { max: 2500, ticks: [0, 500, 1000, 1500, 2000, 2500], unit: ' h', barH: 20, gapY: 16, labelW: 64 })}
      <p class="cap sm">About 2,124 hours: the second sunniest year since observations began. The year averaged 11.4°C.</p>
      ${src(SRC.s4)}
    </article>
    <article class="mod">
      <div class="mn">06</div>
      <div class="fig md">1,945<span class="u">hours</span></div>
      <p class="cap">More than 1,945 hours of sunshine in Germany in 2025 – about 17% above the 1991–2020 average and one of the five sunniest years since 1951.</p>
      ${src(SRC.s5)}
    </article>
  </div>
  <aside class="note wide">
    <p class="note-k">Read It Right</p>
    <p>Brighter, warmer years bring more evenings outside. The cool hour after sunset, and the spring and autumn either side of summer, decide how long those evenings last.</p>
  </aside>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('03', 'Terraces Fill Up')}
  <h2 class="disp h2">When The Terrace Is Full, Hospitality Wins</h2>
  <div class="grid g2">
    <article class="mod">
      <div class="mn">07</div>
      <h3>Dutch Cafés And Restaurants Grow</h3>
      <p class="unit">Turnover growth, 2025 against 2024, %</p>
      ${hbars([['Eating and drinking', 4.8, true], ['All hospitality', 3.9, false], ['Accommodation', 1.7, false]], span(6), { max: 6, ticks: [0, 2, 4, 6], barH: 18, gapY: 14, labelW: 118 })}
      ${src(SRC.s6)}
    </article>
    <article class="mod">
      <div class="mn">08</div>
      <div class="fig md">+9.1<span class="u">%</span></div>
      <p class="cap">Like-for-like sales growth at Britain's managed pub groups in April 2025, as warmer weather drew people into beer gardens and terraces.</p>
      ${src(SRC.s7)}
    </article>
  </div>
  <figure class="band b3"><img src="${img('w-the-ivy-london-tungsten-electric')}" alt="A London restaurant garden under a white pergola with heaters along the beams"></figure>
  <article class="mod">
    <div class="mn">09</div>
    <div class="split s-lic">
      <div class="fig">2024</div>
      <div>
        <h3>Pavement Terraces Are Here To Stay In England</h3>
        <p class="cap">Pavement licences became permanent in England on 31 March 2024. Councils can grant them for up to two years, and heaters are named among the furniture a licence covers, alongside umbrellas and barriers. Conditions vary by council, so check the local licence before choosing a heater.</p>
      </div>
    </div>
    ${src(SRC.s8)}
  </article>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('04', 'Electric Heat, Cleaner Power')}
  <div class="grid g-close g-elec">
    <article class="mod">
      <div class="mn">10</div>
      <h3>Europe's Electricity, Nearly Half Renewable</h3>
      <p class="unit">% of gross electricity consumption from renewable sources, 2024</p>
      ${hbars([['Germany', 54.1, true], ['Netherlands', 50.5, true], ['EU', 47.5, false]], span(7), { max: 60, ticks: [0, 20, 40, 60], barH: 18, gapY: 14, labelW: 96 })}
      ${src(SRC.s10)}
    </article>
    <figure class="plate"><img src="${img('w-residential-belgium-brussels-blackcontemp-re')}" alt="A covered terrace dining table in Brussels with black electric heaters recessed in the white ceiling"></figure>
    <article class="mod">
      <div class="mn">11</div>
      <div class="fig md">47<span class="u">%</span></div>
      <p class="cap">Of UK electricity came from renewables in 2025, a record high. More of the power behind an electric heater now comes from wind and sun.</p>
      ${src(SRC.s11)}
    </article>
    <article class="mod">
      <div class="mn">12</div>
      <h3>New Homes In England, Built For Low-Carbon Heat</h3>
      <p class="cap">The Future Homes and Buildings Standards come into force on 24 March 2027, subject to transitional provisions, so that new homes are built with low-carbon heating and high levels of energy efficiency.</p>
      ${src(SRC.s12)}
    </article>
    <article class="mod">
      <div class="mn">13</div>
      <h3>In France, Heat Belongs On An Enclosed Terrace</h3>
      <p class="cap">Since 31 March 2022, French law has banned heating café, bar and restaurant terraces on public land, whatever the heater. Terraces that are covered and closed on their sides by solid walls are exempt unless the local authority objects; private land is not covered.</p>
      ${src(SRC.s9)}
    </article>
  </div>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('05', 'Investing In The Garden')}
  <h2 class="disp h2">Households Are Buying For The Evening</h2>
  <div class="grid g1">
    <article class="mod">
      <div class="mn">14</div>
      <div class="fig xl">£9<span class="u">billion</span></div>
      <p class="cap wide">Around what UK households spent on retail garden products in 2025. The garden is a room people furnish, light and plan.</p>
      ${src(SRC.s1)}
    </article>
    <article class="mod">
      <div class="mn">15</div>
      <div class="split">
        <div>
          <div class="fig">+25<span class="u">%</span></div>
          <p class="cap">UK garden centre sales of barbecues and heating in July 2026 against July 2025. Shoppers are buying for the evening as well as the afternoon.</p>
        </div>
        <div>
          <h3>Heat Sells With The Barbecue</h3>
          <p class="unit">UK garden centre sales, July 2026 against July 2025, %</p>
          ${hbars([['Tools and equipment', 27, false], ['BBQs and heating', 25, true], ['Garden furniture', 14, false], ['All sales', 11, false]], span(7), { max: 30, ticks: [0, 10, 20, 30], barH: 16, gapY: 12, labelW: 118 })}
        </div>
      </div>
      ${src(SRC.s13)}
    </article>
  </div>
  <figure class="band b4"><img src="${img('w-tungsten-electric-dalloway-terrace-london')}" alt="A London restaurant terrace with flower-covered walls and a heater mounted above a window"></figure>
  ${foot()}
</section>`);

const glance = [
  ['British adults with access to a private garden', '77%', 'about 44 million', 'HTA', '2025'],
  ['People living in a house: Netherlands and Belgium', '79% · 77%', 'EU 51.7%', 'Eurostat, Housing in Europe', '2023'],
  ['People living in a flat: Germany', '61%', 'EU 47.7%', 'Eurostat, Housing in Europe', '2023'],
  ['UK mean summer temperature, warmest on record', '16.5°C', 'provisional', 'Met Office', 'Summer 2026'],
  ['Sunshine, Netherlands: second sunniest year', 'About 2,124 h', 'normal 1,774 h', 'KNMI', '2025'],
  ['Sunshine, Germany: among the five sunniest since 1951', 'Over 1,945 h', 'about 17% above 1991–2020', 'DWD', '2025'],
  ['Turnover, Dutch eating and drinking establishments', '+4.8%', 'all hospitality +3.9%', 'CBS', '2025'],
  ['Like-for-like sales, British managed pub groups', '+9.1%', '', 'CGA RSM Business Tracker', 'April 2025'],
  ['Pavement licences in England made permanent', '31 March 2024', 'up to two years', 'MHCLG guidance', '2024'],
  ['EU electricity from renewables', '47.5%', 'NL 50.5% · DE 54.1%', 'Eurostat', '2024'],
  ['UK electricity from renewables, a record', '47%', '', 'Carbon Brief', '2025'],
  ['Future Homes and Buildings Standards in force', '24 March 2027', 'England', 'MHCLG', '2026'],
  ['Heating open public terraces in France', 'Banned', 'enclosed terraces exempt', 'Décret 2022-452', 'Since 2022'],
  ['UK spending on retail garden products', 'Around £9bn', '', 'HTA', '2025'],
  ['UK garden centre sales of BBQs and heating', '+25%', 'all sales +11%', 'HTA Market Update', 'July 2026'],
];
pages.push(`
<section class="page inner">
  ${head('06', 'The Year At A Glance')}
  <h2 class="disp h2">Every Number, With Its Source</h2>
  <table class="glance">
    <thead><tr><th class="n">#</th><th>Statistic</th><th class="r">Figure</th><th>Source</th><th>Year</th></tr></thead>
    <tbody>${glance.map(([s, f, f2, so, y], i) => `<tr><td class="n">${String(i + 1).padStart(2, '0')}</td><td>${esc(s)}</td><td class="r"><b>${esc(f)}</b>${f2 ? `<span>${esc(f2)}</span>` : ''}</td><td class="so">${esc(so)}</td><td class="so">${esc(y)}</td></tr>`).join('')}</tbody>
  </table>
  <div class="takeaways">
    <p class="note-k">What These Numbers Tell Us</p>
    <ol>
      <li>Most households in the UK and the Low Countries have a garden; in Germany the balcony does the same job.</li>
      <li>Brighter, warmer years bring more evenings outside.</li>
      <li>Terraces and pub gardens earn when they are full and warm.</li>
      <li>How a terrace feels after dark is decided at the planning stage, with power, mounting and controls drawn in from the start.</li>
    </ol>
  </div>
  ${foot()}
</section>`);

const faq = [
  ['How many people in the UK have a garden?', '77% of British adults have access to a private garden, about 44 million people, according to the Horticultural Trades Association (2025).'],
  ['What share of Europeans live in a house rather than a flat?', 'In the EU, 51.7% of people lived in a house in 2023. The share is 79% in the Netherlands and 77% in Belgium, while 61% of people in Germany live in a flat.'],
  ['Was summer 2026 the hottest on record in the UK?', "Provisionally, yes. The UK's mean summer temperature was 16.5°C, the highest since records began in 1884, according to the Met Office."],
  ['Can pubs and restaurants in England put heaters on a pavement terrace?', 'Heaters are named among the furniture a pavement licence covers, and licences have been permanent in England since 31 March 2024. Each council sets its own conditions.'],
  ['Are terrace heaters banned in France?', 'Heating open terraces on public land has been banned since 31 March 2022, whatever the heater. Covered terraces closed on their sides by solid walls are exempt unless the local authority objects.'],
];
pages.push(`
<section class="page close">
  ${head('07', 'Questions And Sources')}
  <div class="grid g2 faq">
    ${faq.map(([q, a], i) => `<div class="qa"><div class="mn">Q${i + 1}</div><h4>${esc(q)}</h4><p>${esc(a)}</p></div>`).join('')}
    <div class="qa"><div class="mn">Q6</div><h4>Where do these numbers come from?</h4><p>Each figure comes from a named public source: the HTA, Eurostat, the Met Office, KNMI, the DWD, CBS, the CGA RSM tracker, the UK government, French law and Carbon Brief.</p></div>
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
.fig.md{font-size:92px}
.s-wide{align-items:start}.s-wide .fig{font-size:120px}
.s-lic{grid-template-columns:${span(3)}px ${span(9)}px;align-items:start}.s-lic .fig{font-size:64px}.s-lic h3{margin-top:4px}
.gap-top{margin-top:40px}
.note.wide{margin-top:44px}.note.wide p{max-width:${span(9)}px}
.b3{height:270px;margin:30px 0 26px}.s-lic .cap{max-width:none}
.page.inner .b2{height:290px}
.g-elec{height:auto;grid-template-rows:auto auto auto;row-gap:30px;margin-top:22px}
.g-elec .plate{grid-row:1 / span 2;grid-column:2}
.cover-foot .src{margin:0 0 2px}
.glance td{padding:5px 8px;line-height:1.25;font-size:10.5px}.glance td.r b{font-size:12.5px}.glance td.r span{font-size:8.5px}.glance .so{font-size:9.5px}
.takeaways{margin-top:18px}.takeaways ol{gap:8px ${GUT}px;margin-top:8px}.takeaways li{font-size:14.5px}
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
// The gallery card: cover thumbnail 640 x 830, WebP q82, and its path in meta.json.
execFileSync('python3', ['-I', '-c', "import sys\nfrom PIL import Image\nImage.open(sys.argv[1]).convert('RGB').resize((640,830),Image.LANCZOS).save(sys.argv[2],'WEBP',quality=82)", join(pdir, 'p01.png'), join(here, 'cover-thumb.webp')]);
writeFileSync(join(here, 'meta.json'), JSON.stringify({ item_id: ID, theme: 'data-poster', title: TITLE, pdf: rel(PDF), cover: rel('pages/p01.png'), pages: els.length, thumb: rel('cover-thumb.webp') }, null, 2) + '\n');
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
else console.log(`OK: ${els.length} pages, ${(size / 1024).toFixed(0)} KB, print check clean`);
