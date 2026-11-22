// A01-stats-au "How Australia Lives Outdoors 2027" in the Data Poster theme (reports/themes/data-poster), the Australian
// counterpart of reports/designed/A01-stats. Every figure is copied from content/reports/A01-stats-au-page.md (body or
// front matter `sources[].supports`). Nothing is rounded, combined or invented. Metric units, A$, Australian spelling.
// Declining statistics (templates/bromic-voice.md): no unfavourable comparison with an earlier year is shown.
// Run: node reports/designed/A01-stats-au/build.mjs  ->  index.html, pages/pNN.png, cover-thumb.webp, the PDF, meta.json
import { writeFileSync, mkdirSync, existsSync, statSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '../../..');
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ID = 'A01-stats-au', TITLE = 'How Australia Lives Outdoors 2027';
const PDF = `Bromic-${ID}-How-Australia-Lives-Outdoors-2027.pdf`;

// ---- Images: Bromic library webp (Australian installations) -> JPEG q82, long side <= 2000 px
const IMGS = ['w-residential-australia-sydney-03', 'w-residential-australia-sydney-02', 'w-commercial-australia-sydney-manly-wharf-15', 'w-residential-australia-melbourne-1', 'w-sydney-residential-platinum-electric-white'];
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
  s1: 'PropTrack, Rising keyword searches reveal emerging home buying trends, January 2026 (realestate.com.au searches, 2025)',
  s2: 'PropTrack, land and house size analysis, October 2025 (median land area of houses sold; average floor area of a newly built house)',
  s3: 'Australian Bureau of Statistics, Building Approvals, Australia, June 2026 release (financial year 2025-26, original terms)',
  s4: 'KPMG, New builds and renovation spending surge as knock-down rebuilds decline, October 2026 (financial year 2025-26)',
  s5: 'Weatherzone, Top 3 warmest winter on record for Sydney, Melbourne, Brisbane, Canberra, Adelaide and Hobart, 31 August 2026 (provisional seasonal averages)',
  s6: 'Weatherzone, Melbourne’s coldest night of 2026 as five states fall below zero, 6 July 2026',
  s7: 'Restaurant & Catering Australia, from ABS Retail Trade data, August 2025 (financial year ending June 2025)',
  s8: 'City of Sydney, Outdoor dining fees permanently waived across Sydney, 1 July 2025 (approvals since November 2020)',
  s9: 'Premier of Victoria, Securing Victoria’s gas supply while slashing energy bills, 24 June 2025',
  s10: 'ACT Government, Regulation to prevent new gas connections starts in December, 2023',
  s910: 'Premier of Victoria, 24 June 2025; ACT Government, 2023',
  s11: 'Australian Energy Council, Twenty-five years of rooftop solar, June 2025 (dwellings, April 2025)',
  s1213: 'Clean Energy Council, Rooftop Solar and Storage Report, July to December 2025 (February 2026), as reported by pv magazine, February 2026',
  s14: 'Telsyte, Australian Smart Home Market Study 2025–2029, as reported by iTWire, October 2026 (households, June 2026)',
};
const SOURCES = [
  ['s1', 'PropTrack', 'Rising keyword searches reveal emerging home buying trends', 2026, 'proptrack.com.au/insights-hub/rising-keyword-searches-reveal-emerging-home-buying-trends'],
  ['s2', 'PropTrack', 'Australia’s block sizes are shrinking and so are buyer expectations', 2025, 'proptrack.com.au/insights-hub/australias-block-sizes-are-shrinking-and-so-are-buyer-expectations'],
  ['s3', 'Australian Bureau of Statistics', 'Dwelling approvals rise in June 2026 (Building Approvals, Australia)', 2026, 'abs.gov.au/media-centre/media-releases/dwelling-approvals-rise-june-2026'],
  ['s4', 'KPMG Australia', 'New builds and renovation spending surge as knock-down rebuilds decline', 2026, 'kpmg.com/au/en/media/media-releases/2026/10/new-builds-and-renovation-spending-surge-as-knock-down-rebuilds-decline.html'],
  ['s5', 'Weatherzone', 'Top 3 warmest winter on record for Sydney, Melbourne, Brisbane, Canberra, Adelaide and Hobart', 2026, 'weatherzone.com/au/news/top-3-warmest-winter-on-record-for-sydney-melbourne-brisbane-canberra-adelaide-and-hobart/1891534'],
  ['s6', 'Weatherzone (via Elders Weather)', 'Melbourne’s coldest night of 2026 as five states fall below zero', 2026, 'eldersweather.com.au/news/melbournes-coldest-night-of-2026-as-five-states-fall-below-zero/1891443'],
  ['s7', 'Restaurant & Catering Australia', 'Australians Still Dining Out: What the Latest ABS Data Tells Us About Hospitality Spend', 2025, 'rca.asn.au/homepage-news-gallery/australians-still-dining-out-what-the-latest-abs-data-tells-us-about-hospitality-spend'],
  ['s8', 'City of Sydney', 'Outdoor dining fees permanently waived across Sydney', 2025, 'cityofsydney.nsw.gov.au/media-releases/2025/outdoor-dining-fees-permanently-waived-across-sydney'],
  ['s9', 'Premier of Victoria', 'Securing Victoria’s gas supply while slashing energy bills', 2025, 'premier.vic.gov.au/securing-victorias-gas-supply-while-slashing-energy-bills'],
  ['s10', 'ACT Government', 'Regulation to prevent new gas connections starts in December', 2023, 'cmtedd.act.gov.au/open_government/inform/act_government_media_releases/rattenbury/2023/regulation-to-prevent-new-gas-connections-starts-in-december'],
  ['s11', 'Australian Energy Council', 'Twenty-five years of rooftop solar: who were the pioneers?', 2025, 'energycouncil.com.au/analysis/twenty-five-years-of-rooftop-solar-who-were-the-pioneers'],
  ['s12', 'Clean Energy Council', 'Rooftop solar and storage report, July to December 2025', 2026, 'cleanenergycouncil.org.au/news-resources/rooftop-solar-and-storage-report-july-to-dec-2025'],
  ['s13', 'pv magazine', 'Australia’s rooftop solar hits 28.3 GW as home battery uptake surges', 2026, 'pv-magazine.com/2026/02/04/australias-rooftop-solar-hits-28-3-gw-as-home-battery-uptake-surges'],
  ['s14', 'iTWire (Telsyte Australian Smart Home Market Study 2025–2029)', 'Batteries push Australia’s smart home market past $11 billion as AI waits for the keys', 2026, 'itwire.com/your-it-news/home-it/batteries-push-australias-smart-home-market-past-11-billion-as-ai-waits-for-the-keys'],
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const src = s => `<p class="src">Source: ${esc(s)}</p>`;
const num = (x, y, s, o = {}) => `<text x="${x}" y="${y}" class="${o.cls || 'v'}" text-anchor="${o.a || 'start'}">${esc(s)}</text>`;
const fmtN = v => Number(v).toLocaleString('en-AU');

// ---- Charts (flat SVG) ------------------------------------------------------
// Waffle: 100 cells, n filled. One cell = 1%.
function waffle(size, gap, n, label) {
  const cell = (size - 9 * gap) / 10; let out = '';
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10, x = c * (cell + gap), y = r * (cell + gap);
    out += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${i < n ? FLAME : RULE}"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(label)}">${out}</svg>`;
}

// Horizontal bars from zero. rows: [label, value, key?, note?]
function hbars(rows, w, { max = 100, ticks = [0, 25, 50, 75, 100], unit = '%', fmt = v => v + unit, barH = 16, gapY = 12, labelW = 128 } = {}) {
  const plotW = w - labelW - 92, h = rows.length * (barH + gapY) + 22;
  const x = v => labelW + (v / max) * plotW;
  let g = '';
  for (const t of ticks) {
    g += `<line x1="${x(t)}" x2="${x(t)}" y1="0" y2="${h - 18}" stroke="${RULE}" stroke-width="1"/>`;
    g += num(x(t), h - 4, typeof t === 'number' && t >= 1000 ? fmtN(t) : t, { cls: 'tick', a: 'middle' });
  }
  rows.forEach(([lab, v, key, note], i) => {
    const y = i * (barH + gapY) + 4;
    g += `<text x="0" y="${y + barH - 4}" class="lab">${esc(lab)}</text>`;
    g += `<rect x="${labelW}" y="${y}" width="${x(v) - labelW}" height="${barH}" fill="${key ? FLAME : MUTE}"/>`;
    g += num(x(v) + 6, y + barH - 4, fmt(v), { cls: 'v' });
    if (note) g += num(w, y + barH - 4, note, { cls: 'tick', a: 'end' });
  });
  return `<svg width="${w}" height="${h + 14}" viewBox="0 -14 ${w} ${h + 14}">${g}</svg>`;
}

// The ten most-searched home keywords of 2025 on realestate.com.au (rank only: the source gives no counts).
function rankList(w) {
  const rows = ['Swimming pool', 'Garage', 'Air conditioning', 'Ensuite', 'Outdoor area', 'Single storey', 'Balcony', 'Built in robes', 'Dishwasher', 'Heating'];
  const key = new Set([4, 6, 9]), rowH = 25, h = rows.length * rowH;
  let g = '';
  rows.forEach((lab, i) => {
    const y = i * rowH, k = key.has(i);
    g += `<line x1="0" x2="${w}" y1="${y + rowH - 1}" y2="${y + rowH - 1}" stroke="${RULE}"/>`;
    g += `<rect x="0" y="${y + 5}" width="22" height="14" fill="${k ? FLAME : '#fff'}" stroke="${k ? FLAME : MUTE}"/>`;
    g += `<text x="11" y="${y + 15.5}" class="tick" text-anchor="middle" style="fill:${k ? '#fff' : STEEL};font-weight:700">${String(i + 1).padStart(2, '0')}</text>`;
    g += `<text x="32" y="${y + 16}" class="${k ? 'v' : 'lab'}">${esc(lab)}</text>`;
  });
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Top ten home keywords, 2025">${g}</svg>`;
}

// A share of a whole as one bar (value % of 100).
function share(w, v, left, right) {
  const p = w * v / 100;
  return `<svg width="${w}" height="56" viewBox="0 0 ${w} 56">
    <rect x="0" y="0" width="${w}" height="22" fill="${RULE}"/><rect x="0" y="0" width="${p}" height="22" fill="${FLAME}"/>
    <line x1="${p}" x2="${p}" y1="0" y2="30" stroke="${INK}" stroke-width="1.5"/>
    ${num(0, 44, left, { cls: 'lab' })}
    ${num(w, 44, right, { cls: 'lab', a: 'end' })}
  </svg>`;
}

// "More than one in three": three blocks, one filled.
function thirds(w) {
  const b = (w - 2 * 10) / 3;
  return `<svg width="${w}" height="40" viewBox="0 0 ${w} 40" role="img" aria-label="More than one in three">${[0, 1, 2].map(i => `<rect x="${i * (b + 10)}" y="0" width="${b}" height="40" fill="${i === 0 ? FLAME : RULE}"/>`).join('')}</svg>`;
}

// Policy timeline: ACT (8 Dec 2023) and Victoria (1 Jan 2027).
function timeline(w) {
  const L = 8, R = 8, x = t => L + (t - 2023) / 4.2 * (w - L - R), h = 118;
  let g = `<line x1="${L}" x2="${w - R}" y1="52" y2="52" stroke="${INK}" stroke-width="2"/>`;
  for (const yr of [2023, 2024, 2025, 2026, 2027]) {
    g += `<line x1="${x(yr)}" x2="${x(yr)}" y1="46" y2="58" stroke="${INK}"/>`;
    g += num(x(yr), 74, yr, { cls: 'tick', a: yr === 2023 ? 'start' : 'middle' });
  }
  const ev = [[2023 + 341 / 365, 'ACT · 8 December 2023', 'No new gas network connections', 'start'], [2027, 'Victoria · 1 January 2027', 'New homes and most new commercial buildings all-electric', 'end']];
  for (const [t, a, b, an] of ev) {
    g += `<circle cx="${x(t)}" cy="52" r="7" fill="${FLAME}" stroke="#fff" stroke-width="2"/>`;
    const tx = an === 'start' ? x(t) - 8 : x(t) + 8;
    g += num(tx, 18, a, { cls: 'v', a: an }) + num(tx, 34, b, { cls: 'lab', a: an });
  }
  g += num((x(2023.8) + x(2026.4)) / 2, 100, 'Dates from the ACT and Victorian governments', { cls: 'tick', a: 'middle' });
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
  <div class="kicker"><span class="disp title">${TITLE}</span><span class="kr"><span class="dot"></span>Outdoor Living Statistics · AU</span></div>
  <div class="hero-num">#5</div>
  <div class="cover-grid">
    <div class="cover-left">
      <h1 class="disp">Australians Search For The Outdoor Area</h1>
      <p class="lede">“Outdoor area” was the fifth most-searched home feature on realestate.com.au in 2025. “Balcony” came seventh and “heating” tenth.</p>
    </div>
    <figure class="cover-right">
      ${rankList(span(5))}
      <figcaption><span class="sw flame"></span>Outdoor living and heating in the top ten home searches, 2025</figcaption>
    </figure>
  </div>
  <div class="cover-foot">
    ${src(SRC.s1)}
    <img src="${ROOT}/decks/img/logo.png" alt="Bromic Heating" class="logo">
  </div>
</section>`);

pages.push(`
<section class="page inner">
  ${head('01', 'Where Australians Build')}
  <div class="intro">
    <h2 class="disp h2">The Numbers Behind The Australian Alfresco</h2>
    <p class="body">Every one of these numbers comes back to the same evening: a table set under the pergola, friends who would happily stay another hour, and the chill that settles in after sunset. Together they show how much of Australian life is lived outside.</p>
  </div>
  <figure class="band b2"><img src="${img('w-residential-australia-sydney-03')}" alt="A covered harbourside lounge in Sydney under a vaulted ceiling, four white heaters on angled stems"></figure>
  <article class="mod row">
    <div class="mn">01</div>
    <div class="split s940">
      <div class="fig">205,249</div>
      <p class="cap">Dwellings approved across Australia in 2025-26 – a 9.2% increase on the year before. Every one is a new outdoor space to plan, from a backyard alfresco to a balcony.</p>
    </div>
    ${src(SRC.s3)}
  </article>
  <div class="grid g2">
    <article class="mod">
      <div class="mn">02</div>
      <h3>More Apartments, More Balconies</h3>
      <p class="unit">Apartment dwellings approved, by financial year</p>
      ${hbars([['2024-25', 43079, false], ['2025-26', 48778, true]], span(6), { max: 60000, ticks: [0, 20000, 40000, 60000], fmt: fmtN, barH: 20, gapY: 16, labelW: 62 })}
      <p class="cap sm">48,778 apartments approved in 2025-26, up 13.2%.</p>
      ${src(SRC.s3)}
    </article>
    <article class="mod">
      <div class="mn">03</div>
      <h3>The Outdoor Space Works Harder</h3>
      <div class="fig md">645<span class="u">m²</span></div>
      <p class="cap">Median land area of a house sold in Australia in 2025. The average newly built house has 241 m² of floor area, so every square metre outside counts.</p>
      ${src(SRC.s2)}
    </article>
  </div>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('02', 'What Australians Spend')}
  <h2 class="disp h2">Australians Invest In The Homes They Have</h2>
  <div class="grid g-size">
    <article class="mod">
      <div class="mn">04</div>
      <div class="fig xl">$56.2<span class="u">billion</span></div>
      <p class="cap">Australian renovation spending in 2025-26 (A$), up almost 5% in a year. The alfresco that already exists is the next room to finish.</p>
      <p class="unit" style="margin-top:18px">Renovation as a share of all housing spending, 2025-26</p>
      ${share(span(12), 37, 'Renovation: 37%', 'All housing spending = 100%')}
      ${src(SRC.s4)}
    </article>
    <article class="mod">
      <div class="mn">05</div>
      <h3>Courtyards Are On The List</h3>
      <div class="fig">+62<span class="u">%</span></div>
      <p class="cap">Growth in searches for “courtyard” in Canberra over the past twelve months, as buyers look for outdoor space that works on a compact block.</p>
      ${src(SRC.s1)}
    </article>
    <aside class="note">
      <p class="note-k">Read It Right</p>
      <p>The keyword figures count what buyers type into realestate.com.au. “Outdoor area”, “balcony” and “heating” all sit in the national top ten for 2025; the courtyard figure is for Canberra searches.</p>
    </aside>
  </div>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('03', 'The Australian Evening')}
  <h2 class="disp h2">Milder Winters, Cold Nights</h2>
  <div class="grid g1">
    <article class="mod">
      <div class="mn">06</div>
      <div class="split">
        <div>
          <div class="fig">3.2<span class="u">°C</span></div>
          <p class="cap">Melbourne’s coldest night of 2026, on 6 July – in the city’s warmest winter on record. Hobart fell to 2.6 °C the same night.</p>
        </div>
        <div>
          <h3>Record-Warm Winters In Three Capitals</h3>
          <p class="unit">Mean winter temperature, 2026, °C (provisional seasonal averages; each a record)</p>
          ${hbars([['Sydney', 15.29, true], ['Melbourne', 12.18, true], ['Canberra', 8.14, true]], span(7), { max: 20, ticks: [0, 5, 10, 15, 20], fmt: v => v.toFixed(2) + ' °C', barH: 18, gapY: 14, labelW: 78 })}
          <p class="cap sm">More winter evenings are worth spending outside – once the chill after sunset is handled.</p>
        </div>
      </div>
      ${src(SRC.s6 + '; ' + SRC.s5)}
    </article>
  </div>
  <figure class="band b4 tall"><img src="${img('w-residential-australia-sydney-02')}" alt="A covered harbourside lounge in Sydney, two white heaters on short ceiling stems, the city skyline beyond"></figure>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('04', 'Dining Out, Outdoors')}
  <div class="grid g-close">
    <article class="mod">
      <div class="mn">07</div>
      <div class="fig big">$66.3<span class="u">bn</span></div>
      <p class="cap">Turnover of Australia’s cafés, restaurants and takeaway food services in the financial year to June 2025 (A$66.273 billion), up 2.5% on the year before.</p>
      ${src(SRC.s7)}
    </article>
    <figure class="plate"><img src="${img('w-commercial-australia-sydney-manly-wharf-15')}" alt="A busy wharf café terrace in Sydney, heaters on the slatted ceiling above the diners"></figure>
    <article class="mod">
      <div class="mn">08</div>
      <h3>Sydney Makes Outdoor Dining Permanent</h3>
      <div class="trio">
        <div><b>~1,000</b><span>outdoor dining applications approved since November 2020</span></div>
        <div><b>800+</b><span>businesses supported</span></div>
        <div><b>13,000 m²</b><span>of outdoor dining area, about</span></div>
      </div>
      <p class="unit" style="margin-top:16px">Participating businesses that saw a 20% increase in turnover</p>
      ${thirds(span(7))}
      <p class="cap">More than one in three. Outdoor dining fees have been waived permanently across the City of Sydney since 1 July 2025.</p>
      ${src(SRC.s8)}
    </article>
  </div>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('05', 'The All-Electric Alfresco')}
  <h2 class="disp h2">Power, Policy And The Outdoor Room</h2>
  <div class="grid g-size">
    <article class="mod">
      <div class="mn">09</div>
      <h3>New Homes Are Going All-Electric</h3>
      <p class="unit">Gas rules for new buildings in the ACT and Victoria</p>
      ${timeline(span(12))}
      <p class="cap wide">In the ACT, the regulation covers residential buildings and commercial and community facility zones; existing connections are not affected. In Victoria, the all-electric rule excludes industrial, manufacturing and agricultural buildings.</p>
      ${src(SRC.s910)}
    </article>
    <article class="mod">
      <div class="mn">10</div>
      <div class="split w55">
        <div>
          <div class="fig">~40<span class="u">%</span></div>
          <p class="cap">Australian dwellings with rooftop solar, April 2025.</p>
        </div>
        <figure class="wf">${waffle(span(3), 3, 40, 'About 40 of 100 squares filled')}<figcaption><span class="sw flame"></span>One square = 1% of dwellings</figcaption></figure>
      </div>
      ${src(SRC.s11)}
    </article>
    <article class="mod">
      <div class="mn">11</div>
      <div class="fig mid">454,753</div>
      <p class="cap">Home batteries installed across Australian households by the end of 2025 – 183,245 in the second half of the year alone, about four times the same period of 2024. Rooftop solar reached 28.3 GW across about 4.3 million installations.</p>
      ${src(SRC.s1213)}
    </article>
  </div>
  <figure class="band b4"><img src="${img('w-sydney-residential-platinum-electric-white')}" alt="A modern Sydney home: covered terrace and lawn, a white electric heater recessed in the soffit"></figure>
  ${foot()}
</section>`);

pages.push(`
<section class="page inner">
  ${head('06', 'Connected Comfort')}
  <h2 class="disp h2">The Smart Home Is The Australian Norm</h2>
  <div class="grid g-close">
    <article class="mod">
      <div class="mn">12</div>
      <div class="fig xl">86<span class="u">%</span></div>
      <p class="cap">Australian households that own at least one smart home product, June 2026 – up 10 percentage points since 2024.</p>
      ${src(SRC.s14)}
    </article>
    <figure class="plate"><img src="${img('w-residential-australia-melbourne-1')}" alt="A Melbourne balcony dining table under a timber-batten soffit, black heaters set into it"></figure>
    <article class="mod">
      <div class="mn">13</div>
      <h3>Households Budget For It</h3>
      <p class="unit">% of Australian households, 2026</p>
      ${hbars([['Own a smart home product', 86, true], ['Have a smart home budget', 71, false]], span(7), { max: 100, ticks: [0, 25, 50, 75, 100], barH: 20, gapY: 16, labelW: 150 })}
      <p class="cap">Households with a smart home budget rose from 44% to 71% in two years, and the average budget passed A$3,500 in 2026.</p>
      ${src(SRC.s14)}
    </article>
  </div>
  ${foot()}
</section>`);

const glance = [
  ['Rank of “outdoor area” among home searches', '#5', '“heating” #10', 'PropTrack', '2025'],
  ['Rank of “balcony” among home searches', '#7', '', 'PropTrack', '2025'],
  ['Growth in “courtyard” searches, Canberra', '+62%', 'past 12 months', 'PropTrack', '2025'],
  ['Dwellings approved', '205,249', 'up 9.2%', 'ABS Building Approvals', '2025-26'],
  ['Apartment dwellings approved', '48,778', 'up 13.2%', 'ABS Building Approvals', '2025-26'],
  ['Median land area, houses sold', '645 m²', '', 'PropTrack', '2025'],
  ['Average floor area, newly built house', '241 m²', '', 'PropTrack', '2025'],
  ['Renovation spending', 'A$56.2 billion', 'up almost 5%; 37% of housing spend', 'KPMG', '2025-26'],
  ['Mean winter temperature, Sydney · Melbourne · Canberra', '15.29 · 12.18 · 8.14 °C', 'each a record (provisional)', 'Weatherzone', 'Winter 2026'],
  ['Melbourne’s coldest night', '3.2 °C', '6 July', 'Weatherzone', '2026'],
  ['Café, restaurant and takeaway turnover', 'A$66.273 billion', 'up 2.5%', 'R&CA, from ABS data', 'FY to June 2025'],
  ['City of Sydney outdoor dining approvals', '~1,000', '800+ businesses', 'City of Sydney', 'Since Nov 2020'],
  ['Participating businesses with a 20% rise in turnover', 'More than 1 in 3', '', 'City of Sydney', '2025'],
  ['Dwellings with rooftop solar', '~40%', '', 'Australian Energy Council', 'April 2025'],
  ['Home batteries installed', '454,753', '183,245 in H2 2025', 'Clean Energy Council', 'End 2025'],
  ['Households owning a smart home product', '86%', '71% have a budget', 'Telsyte', 'June 2026'],
];
pages.push(`
<section class="page inner">
  ${head('07', 'The Year At A Glance')}
  <h2 class="disp h2">Every Number, With Its Source</h2>
  <table class="glance dense">
    <thead><tr><th class="n">#</th><th>Statistic</th><th class="r">Figure</th><th>Source</th><th>Year</th></tr></thead>
    <tbody>${glance.map(([s, f, f2, so, y], i) => `<tr><td class="n">${String(i + 1).padStart(2, '0')}</td><td>${esc(s)}</td><td class="r"><b>${esc(f)}</b>${f2 ? `<span>${esc(f2)}</span>` : ''}</td><td class="so">${esc(so)}</td><td class="so">${esc(y)}</td></tr>`).join('')}</tbody>
  </table>
  <div class="takeaways">
    <p class="note-k">What These Numbers Tell Us</p>
    <ol>
      <li>Australians search for outdoor space and build it on compact blocks and balconies.</li>
      <li>Renovation spending is close to its peak: the existing alfresco is the next room.</li>
      <li>Winters are milder, yet the nights still fall cold – and outdoor dining is here to stay.</li>
      <li>New homes are going all-electric, so outdoor heat, power and controls belong in the first drawing.</li>
    </ol>
  </div>
  ${foot()}
</section>`);

const faq = [
  ['What do Australian home buyers search for most?', '“Swimming pool” led realestate.com.au searches in 2025. “Outdoor area” came fifth, “balcony” seventh and “heating” tenth, according to PropTrack.'],
  ['How big is a typical Australian block?', 'The median land area of a house sold in 2025 was 645 m², and the average newly built house has 241 m² of floor area, according to PropTrack.'],
  ['How much do Australians spend on renovation?', 'A$56.2 billion in 2025-26, up almost 5% and 37% of all housing spending, according to KPMG.'],
  ['Do Australian winter nights get cold?', 'Yes. Even in its warmest winter on record, Melbourne fell to 3.2 °C on 6 July 2026, according to Weatherzone.'],
  ['Can new homes in Victoria have gas?', 'From 1 January 2027 all new homes and most new commercial buildings in Victoria must be built all-electric, according to the Victorian Government.'],
];
pages.push(`
<section class="page close">
  ${head('08', 'Questions And Sources')}
  <div class="grid g2 faq">
    ${faq.map(([q, a], i) => `<div class="qa"><div class="mn">Q${i + 1}</div><h4>${esc(q)}</h4><p>${esc(a)}</p></div>`).join('')}
    <div class="qa"><div class="mn">Q6</div><h4>Where do these numbers come from?</h4><p>Each figure comes from a named public source: PropTrack, the ABS, KPMG, Weatherzone, R&amp;CA, the City of Sydney, the Victorian and ACT governments, the AEC, the CEC and Telsyte.</p></div>
  </div>
  <div class="sources">
    <p class="note-k">Sources</p>
    <ol>${SOURCES.map(([id, p, t, y, u]) => `<li><b>${esc(p)}</b>, ${esc(t)}, ${y}. <span>${esc(u)}</span></li>`).join('')}</ol>
  </div>
  <div class="cta">
    <p class="cta-k">The Full Picture</p>
    <h2 class="disp cta-h">See What These Numbers Mean For Your Next Outdoor Space</h2>
    <div class="cta-row"><span class="btn">Download Outdoor Living Trends 2027 · Australia</span><span class="site">bromic.com.au</span></div>
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
.fig.md{font-size:96px}.fig.mid{font-size:74px}.fig.big{font-size:118px}.fig.big .u{font-size:40px}
.trio{display:grid;grid-template-columns:repeat(3,1fr);gap:${GUT}px;margin-top:12px}
.trio b{display:block;font-size:25px;white-space:nowrap;letter-spacing:-.03em;line-height:1}.trio span{display:block;font-size:10px;line-height:1.35;color:${STEEL};margin-top:6px}
.split.w55{grid-template-columns:${span(4)}px ${span(3)}px;align-items:end}.wf{margin:0}
.g-size .mod.half{grid-column:auto}
.band.tall{height:330px}
table.glance.dense{font-size:10px}.glance.dense td{padding:6px 10px}.glance.dense td.r b{font-size:12.5px}.glance.dense td.r span{font-size:8.5px}
.glance.dense + .takeaways{margin-top:20px}.glance.dense + .takeaways li{font-size:16px}
`;

const duo = `<svg width="0" height="0" style="position:absolute"><filter id="duo" color-interpolation-filters="sRGB">
<feColorMatrix type="saturate" values="0"/>
<feComponentTransfer><feFuncR type="table" tableValues="0.137 0.94"/><feFuncG type="table" tableValues="0.122 0.90"/><feFuncB type="table" tableValues="0.125 0.86"/></feComponentTransfer>
</filter></svg>`;

const html = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>${TITLE} – Bromic Heating</title><style>${css}</style></head><body>${duo}${pages.join('')}</body></html>`;
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
execFileSync('python3', ['-I', '-c', "import sys\nfrom PIL import Image\nImage.open(sys.argv[1]).convert('RGB').resize((640,830),Image.LANCZOS).save(sys.argv[2],'WEBP',quality=82)", join(pdir, 'p01.png'), join(here, 'cover-thumb.webp')]);
writeFileSync(join(here, 'meta.json'), JSON.stringify({ item_id: ID, theme: 'data-poster', title: TITLE, pdf: rel(PDF), cover: rel('pages/p01.png'), pages: els.length, thumb: rel('cover-thumb.webp') }, null, 2) + '\n');
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
else console.log(`OK: ${els.length} pages, ${(size / 1024).toFixed(0)} KB, print check clean`);
