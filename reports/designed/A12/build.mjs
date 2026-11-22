// A12 "Outdoor Heat In An All-Electric Future" in the Data Poster theme (reports/themes/data-poster).
// Every fact, date and figure is copied from content/guides/A12-electrification-guide.md (body or front matter
// `sources[].supports`). Nothing is rounded, combined or invented. Every statement the guide marks [[VERIFY]] is
// left out (the Platinum amp illustration, the NY State 2029 date, the Denver reading, the recess cavity depth,
// whether Affinity schedules satisfy a timer-switch rule, the IECC section numbers outside Washington).
// Run: node reports/designed/A12/build.mjs  ->  index.html, pages/pNN.png, Bromic-A12-All-Electric-Future.pdf, meta.json
import { writeFileSync, mkdirSync, existsSync, statSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '../../..');
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ID = 'A12', TITLE = 'Outdoor Heat In An All-Electric Future';
const PDF = `Bromic-${ID}-All-Electric-Future.pdf`;

// ---- Images: Bromic library webp -> JPEG q82, long side <= 2000 px -------
const IMGS = ['l-013-111', 'l-010-067', 'l-022-201', 'l-010-075'];
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
const INK = '#231F20', FLAME = '#EF4123', STEEL = '#6D6E71', RULE = '#D1D3D4', MUTE = '#BCBEC0', PALE = '#F1F1F2';
const W = 816, H = 1056, M = 48, COLS = 12, GUT = 16;
const colW = (W - 2 * M - (COLS - 1) * GUT) / COLS;
const span = n => n * colW + (n - 1) * GUT;
const ROOT = '../../..';

// ---- Sources: publisher, title, year (short form printed once under each figure) ---
const S = {
  s1: 'NYC Department of Buildings, Local Law 154: Building Electrification, 2026',
  s2: 'New York City Administrative Code §24-177.1 and §28-506.1 (American Legal Publishing), 2021',
  s3: 'Spectrum News NY1, Court affirms New York\'s all-electric buildings mandate, 2026',
  s4: 'JD Supra, New York Agrees to Delay Implementation of the All-Electric Buildings Act, 2025',
  s5: 'California Energy Commission, 2025 California Energy Code Fact Sheet, 2024',
  s6: 'Permit Sonoma, 2025 CA Energy Code Significant Changes, 2025',
  s7: 'City of Berkeley, Berkeley Municipal Code Chapter 12.80 (Ord. 7,672-N.S.) and §12.80.030, 2019',
  s8: 'AHRI, Ninth Circuit Denies en Banc Appeal of Berkeley Gas Ban Decision, 2024',
  s9: 'City of Berkeley, Repeal of BMC Chapter 12.80 (Ord. 7,907-N.S.), Council item 4 June 2024',
  s10: 'Washington State Legislature, WAC 51-11C-40392, Section C403.11 (2021 WSEC-Commercial), 2024',
  s11: 'Washington State Legislature, WSR 24-23-102 amending WAC 51-11C-40314 (Section C403.1.4), 2024',
  s12: 'Axios Seattle, Washington Supreme Court strikes down natural gas initiative, 2026',
  s13: 'City and County of Denver, 2025 Denver Energy Code – Key Commercial Amendments, 2025',
  s14: 'Colorado Division of Fire Prevention and Control, Guidance on DFPC Colorado Model Electric Ready and Solar Ready Code adoption, 2025',
  s15: 'Colorado General Assembly (via LegiScan), HB22-1362 Building Greenhouse Gas Emissions, 2022',
  s16: 'Massachusetts Department of Energy Resources, Municipal Fossil Fuel Free Building Demonstration Program; 225 CMR 24.00, 2024',
  s17: 'LEEDuser (BuildingGreen), ASHRAE 90.1 Section 6.5.8.1 Heating of unenclosed spaces, 2023',
  s18: 'EC&M, Article 424: Fixed Electric Space-Heating Equipment, 2020',
  s19: 'Bromic, Lookbook 2026',
  s20: 'Bromic, The Official Outdoor Heating Planning Guide v1.2 (US), 2021',
  s21: 'NYC Mayor\'s Office, Recovery agenda: winter outdoor dining guidance, 2020',
};
const URL = {
  s1: 'nyc.gov/site/buildings/codes/ll154-building-electrification.page', s2: 'codelibrary.amlegal.com/codes/newyorkcity/latest/NYCadmin/0-0-0-43994',
  s3: 'ny1.com/nyc/all-boroughs/politics/2026/06/30/court-affirms-new-york-s-all-electric-buildings-mandate', s4: 'jdsupra.com/legalnews/new-york-agrees-to-delay-implementation-4871346',
  s5: 'energy.ca.gov/sites/default/files/2024-09/2025_California_Energy_Code_Fact_Sheet_ada.pdf', s6: 'permitsonoma.org (2025-CA-Energy-Code-Significant-Changes.pdf)',
  s7: 'berkeley.municipal.codes/BMC/12.80.030', s8: 'ahrinet.org/news-events/news/ninth-circuit-denies-en-banc-appeal-berkeley-gas-ban-decision',
  s9: 'berkeleyca.gov (2024-06-04 Item 01 Repeal of Berkeley Municipal Code Chapter 12.80.pdf)', s10: 'lawfilesext.leg.wa.gov (WAC 51-11C-40392)',
  s11: 'lawfilesext.leg.wa.gov/law/WSR/2024/23/24-23-102.htm', s12: 'axios.com/local/seattle/2026/09/17/washington-supreme-court-strikes-down-natural-gas-initiative-2066',
  s13: 'denvergov.org (2025 Denver Energy Code – Key Commercial Amendments)', s14: 'dfpc.colorado.gov (Guidance on DFPC CMERSRC Adoption)',
  s15: 'legiscan.com/CO/text/HB1362/id/2581948', s16: 'mass.gov/info-details/municipal-fossil-fuel-free-building-demonstration-program',
  s17: 'leeduser.buildinggreen.com/node/61397', s18: 'ecmweb.com (Article 424: Fixed Electric Space-Heating Equipment)',
  s19: 'Bromic Lookbook 2026', s20: 'Bromic Planning Guide US v1.2 (2021)', s21: 'nyc.gov/office-of-the-mayor/news/715-20',
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const src = (...ids) => `<p class="src">Source${ids.length > 1 ? 's' : ''}: ${ids.map(i => esc(S[i])).join('; ')}</p>`;
const T = (x, y, s, cls = 'lab', a = 'start') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}">${esc(s)}</text>`;

// ---- Diagrams (flat SVG) ---------------------------------------------------
// NYC LL154 phasing on a time axis, by construction-document filing date.
function phasing(w) {
  const L = 118, R = 16, h = 150, t0 = 2024, t1 = 2028.5;
  const x = t => L + (t - t0) / (t1 - t0) * (w - L - R);
  const d = (y, m, dd) => y + (m - 1) / 12 + (dd - 1) / 365;
  let g = '';
  for (let y = 2024; y <= 2028; y++) { g += `<line x1="${x(y)}" x2="${x(y)}" y1="16" y2="${h - 22}" stroke="${RULE}"/>` + T(x(y), h - 6, y, 'tick', 'middle'); }
  const asof = d(2026, 10, 29);
  g += `<line x1="${x(asof)}" x2="${x(asof)}" y1="6" y2="${h - 22}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 3" class="ref"/>` + T(x(asof) - 4, 12, 'As of 29 Oct 2026', 'tick', 'end');
  const rows = [['Under 7 stories', d(2024, 1, 1), '1 Jan 2024', INK], ['All occupancies', d(2027, 7, 2), '2 Jul 2027', FLAME]];
  rows.forEach(([lab, s, ds, c], i) => {
    const y = 36 + i * 46;
    g += T(0, y + 13, lab);
    g += `<rect x="${x(s)}" y="${y}" width="${x(t1) - x(s)}" height="18" fill="${c}"/>`;
    g += T(x(s) + 6, y + 13, ds, 'v inv');
  });
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

// Berkeley: plan view of a new premises. The defined gas infrastructure runs from the meter onward,
// in or connected to the building or structure, or within the property lines.
function premises(w) {
  const h = 260;
  let g = `<rect x="10" y="20" width="${w - 20}" height="${h - 70}" fill="${PALE}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="6 4"/>`;
  g += T(20, 14, 'Property line', 'tick');
  g += `<rect x="40" y="50" width="${w * 0.42}" height="130" fill="#fff" stroke="${INK}" stroke-width="2"/>` + T(40 + w * 0.21, 120, 'New building', 'lab', 'middle');
  const px = w * 0.56, pw = w * 0.36;
  g += `<rect x="${px}" y="60" width="${pw}" height="110" fill="#fff" stroke="${INK}" stroke-width="1" stroke-dasharray="2 3"/>` + T(px + pw / 2, 80, 'Patio', 'lab', 'middle');
  // heater
  g += `<rect x="${px + pw / 2 - 26}" y="112" width="52" height="12" fill="${INK}"/>` + T(px + pw / 2, 104, 'Piped gas heater', 'tick', 'middle');
  // meter at the property line, street edge
  const my = h - 50;
  g += `<rect x="${w * 0.5 - 12}" y="${my - 12}" width="24" height="24" fill="#fff" stroke="${INK}" stroke-width="2"/>` + T(w * 0.5, my + 32, 'Gas meter (point of delivery)', 'tick', 'middle');
  // piping, meter onward (key series)
  g += `<path d="M${w * 0.5},${my - 12} V200 H${40 + w * 0.3} V180" fill="none" stroke="${FLAME}" stroke-width="3"/>`;
  g += `<path d="M${w * 0.5},200 H${px + pw / 2} V124" fill="none" stroke="${FLAME}" stroke-width="3"/>`;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
}

// ---- Page furniture ---------------------------------------------------------
let pg = 0;
const head = (n, label) => `<header class="run"><span class="run-n">${n}</span><span class="run-l">${label}</span><span class="run-r">${TITLE}</span></header>`;
const foot = () => `<footer class="foot"><img src="${ROOT}/decks/img/logo.png" alt="Bromic Heating" class="logo-s"><span>General information, not legal or code advice. Facts stated as of 29 October 2026; confirm each rule with the authority having jurisdiction.</span><span class="pg">${++pg}</span></footer>`;
const pages = [];

// ---- 1 Cover ----------------------------------------------------------------
pg++;
const PLACES = ['New York City', 'New York State', 'California', 'Berkeley', 'Washington State', 'Denver', 'Colorado', 'Massachusetts'];
pages.push(`
<section class="page cover">
  <div class="kicker"><span class="kr"><span class="dot"></span>Specification Guide · US</span><span class="kr st">Codes · Voltages · Circuits · Controls</span></div>
  <div class="cv-top">
    <div class="cv-num"><div class="hero-num">8</div><p class="hero-cap">Electrification rules, read closely for what they mean on the terrace.</p></div>
    <figure class="cv-plate"><img src="${img('l-013-111')}" alt="Eclipse heaters glowing over a restaurant terrace beneath an awning"></figure>
  </div>
  <h1 class="disp cv-h">Outdoor Heat In An<br>All-Electric Future</h1>
  <p class="lede">The terrace of an all-electric building can be every bit as warm and inviting as any other, and planned well it stays that way whichever direction the rules move. Plan the outdoor space around electric radiant heat from the first drawing, and those evenings outside stay secure.</p>
  <div class="places">${PLACES.map((p, i) => `<div><span>${String(i + 1).padStart(2, '0')}</span>${p}</div>`).join('')}</div>
  <div class="cover-foot"><p class="src">Facts in this guide are stated as of 29 October 2026. Laws, rulings and code adoptions change; confirm each one with the authority having jurisdiction before you rely on it.</p><img src="${ROOT}/decks/img/logo.png" alt="Bromic Heating" class="logo"></div>
</section>`);

// ---- 2 The eight rules ----------------------------------------------------------
const RULES = [
  ['New York City', 'Local Law 154 of 2021 (Admin. Code §24-177.1, §28-506.1)', 'Combustion in new buildings', 'Under 7 stories from 1 Jan 2024; all occupancies from 2 Jul 2027, by construction-document filing date', 'Not by name. A piped gas heater in a new building has no permitted gas supply; unpiped, intermittent devices are excepted only if they do not supply heat.', 0, 's1 s2'],
  ['New York State', 'All-Electric Buildings Act (2023)', 'Fossil-fuel equipment and building systems in new buildings', '7 stories or less first. Upheld by the Second Circuit on 30 Jun 2026; state enforcement had been paused pending appeal', 'Not established.', 0, 's3 s4'],
  ['California', '2025 Building Energy Efficiency Standards (Title 24, Part 6)', 'Heat-pump baselines for indoor space and water heating (prescriptive; not a gas ban)', 'Permit applications from 1 Jan 2026', 'Not found in the sources reviewed.', 0, 's5 s6'],
  ['Berkeley', 'BMC Chapter 12.80 (2019)', 'Natural gas piping in new buildings, to the property line', 'Preempted (9th Cir. 2023); repealed 2024; no longer in force', 'Yes, while in force: it reached piped outdoor appliances on new premises.', 1, 's7 s8 s9'],
  ['Washington State', 'WSEC-Commercial C403.1.4 and C403.11.1', 'Outdoor heat: radiant, with occupancy or timer control. Indoor space heating by heat pump', 'Initiative 2066 struck down in Sep 2026', 'Yes, directly: outdoor heat must be radiant and switch off when unoccupied. Fuel is not restricted.', 1, 's10 s11 s12'],
  ['Denver', '2025 Denver Energy Code', 'New buildings: no fossil furnaces, no electric resistance space heat, no fossil or electric resistance water heaters, with exceptions', 'Effective 31 Dec 2025 / 1 Jan 2026 (city pages differ)', 'Unclear.', 0, 's13'],
  ['Colorado', 'HB22-1362 and the Model Electric Ready and Solar Ready Code', 'Electric-ready and solar-ready provisions in local energy codes', 'DFPC adoption effective 15 Aug 2025', 'Electric-ready capacity, not a ban.', 0, 's14 s15'],
  ['Massachusetts', 'Municipal Fossil Fuel Free Building Demonstration (225 CMR 24.00)', 'Fossil fuel in new construction and major renovation, by local by-law', 'Ten participating municipalities', 'Depends on each town.', 0, 's16'],
];
pages.push(`
<section class="page inner">
  ${head('01', 'A Warm Terrace Under Every New Rule')}
  <div class="intro">
    <h2 class="disp h2">Do All-Electric Codes Ban Gas Patio Heaters? Rarely By Name.</h2>
    <p class="body">Read each rule for <b>what it regulates</b> (gas piping, combustion or heating equipment), <b>where it applies</b> (inside the building, the premises or any equipment) and <b>when</b> (new construction, major renovation or replacement). Electric radiant heat is the option they leave most open.</p>
  </div>
  <table class="mx rules">
    <thead><tr><th class="n">#</th><th>Place and rule</th><th>What it regulates</th><th>Dates</th><th>Does it reach outdoor heaters?</th></tr></thead>
    <tbody>${RULES.map(([pl, inst, what, when, verdict, yes], i) => `<tr><td class="n">${String(i + 1).padStart(2, '0')}</td><td><b>${esc(pl)}</b><span>${esc(inst)}</span></td><td>${esc(what)}</td><td>${esc(when)}</td><td class="vd${yes ? ' yes' : ''}">${yes ? '<i></i>' : ''}${esc(verdict)}</td></tr>`).join('')}</tbody>
  </table>
  <p class="cap sm"><span class="sw flame"></span> Reaches outdoor heaters directly. Status as of 29 October 2026.</p>
  <p class="src">Sources: the instruments named above, as listed on the last page (sources 1–16).</p>
  ${foot()}
</section>`);

// ---- 3 Timeline ----------------------------------------------------------------
const EVENTS = [
  ['1 Jan 2020', 'Berkeley', 'Natural gas infrastructure prohibited in newly constructed buildings', 's7'],
  ['17 Apr 2023', 'Berkeley', 'Ninth Circuit panel holds that EPCA preempts the ordinance', 's8'],
  ['1 Jan 2024', 'New York City', 'Local Law 154 applies to buildings under seven stories', 's1'],
  ['2 Jan 2024', 'Berkeley', 'Rehearing en banc denied; amended opinion, 89 F.4th 1094', 's8'],
  ['15 Mar 2024', 'Washington State', 'Amended heat-pump space heating rule (C403.1.4) in effect', 's11'],
  ['14 May 2024', 'Berkeley', 'Repeal of Chapter 12.80, first reading, 8–0', 's9'],
  ['Dec 2024', 'Washington State', 'Supplemental-heat options broadened', 's11'],
  ['15 Aug 2025', 'Colorado', 'DFPC adopts the Model Electric Ready and Solar Ready Code', 's14'],
  ['Nov 2025', 'New York State', 'State agrees to suspend enforcement regulations pending appeal', 's4'],
  ['31 Dec 2025 / 1 Jan 2026', 'Denver', '2025 Denver Energy Code effective (city pages differ)', 's13'],
  ['1 Jan 2026', 'California', '2025 Energy Code applies to permit applications', 's5'],
  ['30 Jun 2026', 'New York', 'Second Circuit: EPCA does not preempt the All-Electric Buildings Act or LL154', 's3'],
  ['Sep 2026', 'Washington State', 'Supreme Court (6–3) holds Initiative 2066 unconstitutional in its entirety', 's12'],
  ['29 Oct 2026', 'This guide', 'Facts stated as of this date', null],
  ['2 Jul 2027', 'New York City', 'Local Law 154 applies to all occupancies', 's1'],
];
pages.push(`
<section class="page inner">
  ${head('02', 'The Dates That Decide')}
  <div class="intro">
    <h2 class="disp h2">The Filing Date Often Decides Which Rules Apply</h2>
    <p class="body">Rulings and adoptions, in order. Two courts have read federal appliance-efficiency law (EPCA) in opposite ways, so the question remains unsettled nationally.</p>
  </div>
  <ol class="tl">${EVENTS.map(([d, who, what, s]) => `<li class="${s ? '' : 'asof'}${d === '2 Jul 2027' ? ' ahead' : ''}"><span class="td">${esc(d)}</span><span class="tw">${esc(who)}</span><span class="tx">${esc(what)}</span></li>`).join('')}</ol>
  ${src('s7', 's8', 's1', 's11', 's9', 's14', 's4', 's13', 's5', 's3', 's12')}
  ${foot()}
</section>`);

// ---- 4 New York City -----------------------------------------------------------
const EXC = ['Utilities', 'DEP facilities', 'Manufacturing', 'Laboratories', 'Laundromats', 'Hospitals', 'Crematoria', 'Commercial kitchens', 'Emergency / standby power'];
pages.push(`
<section class="page inner">
  ${head('03', 'New York City')}
  <h2 class="disp h2">Where New Buildings Run On Electric</h2>
  <div class="grid g75">
    <article class="mod">
      <div class="mn">01</div>
      <div class="fig">25<span class="u">kg CO₂</span></div>
      <p class="cap">Per million Btu: Local Law 154 bars burning any fuel that emits this much or more inside new buildings – which covers natural gas and oil.</p>
      ${src('s2')}
    </article>
    <article class="mod">
      <div class="mn">02</div>
      <h3>Two Dates, By Filing</h3>
      <p class="unit">When LL154 applies, by construction-document filing date</p>
      ${phasing(span(7))}
      ${src('s1')}
    </article>
  </div>
  <article class="mod mt">
    <div class="mn">03</div>
    <h3>The Exceptions – And What Is Not Among Them</h3>
    <p class="unit">Exceptions named by the Department of Buildings</p>
    <div class="cells">${EXC.map(e => `<div>${e}</div>`).join('')}<div class="out">Outdoor heaters are not an exception</div></div>
    ${src('s1')}
  </article>
  <div class="grid g2 mt">
    <article class="mod">
      <div class="mn">04</div>
      <h3>The Portable Question</h3>
      <p class="unit">The code excepts devices that meet all three conditions</p>
      <div class="cond">
        <div class="ok"><b>1</b>Not connected to the building's gas or fuel-oil piping<span>A portable heater: yes</span></div>
        <div class="ok"><b>2</b>Used intermittently<span>A portable heater: yes</span></div>
        <div class="no"><b>3</b>Not used to supply heat or hot water<span>Supplying heat is its purpose</span></div>
      </div>
      <p class="cap sm">Whether a portable propane heater on the terrace of a new building falls inside that exception is a question for the Department of Buildings and FDNY.</p>
      ${src('s2')}
    </article>
    <article class="mod">
      <div class="mn">05</div>
      <h3>Outdoor Dining, 2020 Guidance</h3>
      <p class="unit">Heaters allowed in outdoor dining under the 2020 winter guidance</p>
      <table class="mx dine"><thead><tr><th></th><th>Sidewalk</th><th>Roadway</th></tr></thead><tbody>
        <tr><td><b>Electric radiant</b></td><td class="y">Allowed</td><td class="y">Allowed</td></tr>
        <tr><td><b>Natural gas radiant</b></td><td>Allowed</td><td class="x">Not allowed</td></tr>
        <tr><td><b>Propane</b></td><td colspan="2">Only under an FDNY permit</td></tr>
      </tbody></table>
      <p class="cap sm">Written for the emergency program and governed by fire and right-of-way rules: confirm what applies today.</p>
      ${src('s21')}
    </article>
  </div>
  ${foot()}
</section>`);

// ---- 5 Berkeley and California ----------------------------------------------------
pages.push(`
<section class="page inner">
  ${head('04', 'Berkeley And California')}
  <h2 class="disp h2">Why A Repealed Ordinance Still Shapes The Debate</h2>
  <div class="g75 top">
    <article class="mod">
      <div class="mn">01</div>
      <h3>To The Property Line</h3>
      <p class="unit">"Natural gas infrastructure": fuel gas piping in or connected to a building or structure, or within the property lines of the premises, from the meter onward</p>
      ${premises(span(7))}
      <p class="cap sm"><span class="sw flame"></span> Covered piping. A piped gas heater on a new patio was covered, though the ordinance never used the word "heater".</p>
      ${src('s7')}
    </article>
    <article class="mod">
      <div class="mn">02</div>
      <h3>From Ban To Repeal</h3>
      <ol class="steps">
        <li><b>1 Jan 2020</b>Prohibition on natural gas infrastructure in newly constructed buildings takes effect</li>
        <li><b>17 Apr 2023</b><i>California Restaurant Association v. City of Berkeley</i>: Ninth Circuit panel holds EPCA preempts the ordinance</li>
        <li><b>2 Jan 2024</b>Rehearing en banc denied, with an amended opinion</li>
        <li><b>2024</b>Berkeley stops enforcing and repeals Chapter 12.80</li>
      </ol>
      ${src('s7', 's8', 's9')}
    </article>
  </div>
  <p class="body wide mt">The ruling turned on how the law was written, and left the wider question of electrification open: the Second Circuit read EPCA the other way for New York. Cities in the Ninth Circuit (including California, Washington and Oregon) have since moved towards energy-code routes such as heat-pump baselines and reach codes, which are less exposed to EPCA and still shape what gets built.</p>
  <article class="mod mt">
    <div class="mn">03</div>
    <div class="split">
      <div><p class="kick">California</p><div class="fig">1 Jan<span class="u">2026</span></div><p class="cap">The 2025 Energy Code applies to permit applications from this date. It does not ban gas.</p></div>
      <ul class="facts">
        <li>Heat pumps are the <b>baseline</b> for space and water heating – a dual baseline for new single-family homes.</li>
        <li>Prescriptive heat-pump space heating now covers all climate zones.</li>
        <li>Gas remains possible through the performance path, at a compliance cost.</li>
        <li>In the sources reviewed, these baselines govern heating of conditioned space; we found no Part 6 provision written for patio heaters. Local reach codes can be stricter, so check with the city as well.</li>
      </ul>
    </div>
    ${src('s5', 's6')}
  </article>
  ${foot()}
</section>`);

// ---- 6 Radiant codes and controls --------------------------------------------------
pages.push(`
<section class="page inner">
  ${head('05', 'The Codes That Already Favor Radiant Warmth')}
  <h2 class="disp h2">Warmth That Falls On The Guests, And Switches Off When The Terrace Empties</h2>
  <article class="mod">
    <div class="mn">01</div>
    <h3>Heating Outside A Building: The Rule Most Often Missed</h3>
    <p class="unit">Washington's commercial energy code, adopting the 2021 IECC, Section C403.11.1</p>
    <div class="eq">
      <div class="term"><b>Radiant</b><span>Any system installed to heat outside a building</span></div>
      <div class="op">+</div>
      <div class="term"><b>Occupancy sensor or timer switch</b><span>So it switches off when no one is present</span></div>
      <div class="op">=</div>
      <div class="term key"><b>Compliant outdoor heat</b><span>Whatever the fuel</span></div>
    </div>
    <p class="cap sm">ASHRAE 90.1 likewise requires radiant heating where unenclosed spaces are heated. The same IECC provision appears in other states that adopt the model code; section numbers vary by edition and state amendment.</p>
    ${src('s10', 's17')}
  </article>
  <blockquote class="pull disp">Heat You Can Feel, Not See.</blockquote>
  <div class="grid g2">
    <article class="mod">
      <div class="mn">02</div>
      <h3>Forced Air Falls Outside</h3>
      <p class="cap">Forced-air or convective outdoor heaters fall outside these codes on commercial projects, leaving radiant heat as the compliant choice.</p>
    </article>
    <article class="mod">
      <div class="mn">03</div>
      <h3>Controls Become Part Of Compliance</h3>
      <p class="cap">Affinity Smart-Heat Controls provide schedules and timers through the Bromic Smart-Heat app, with zones and a manual wall switch. Every heater is specified with its controls: Affinity Smart-Heat On/Off, Dimmer or Eclipse controller, wall switch and app.</p>
      <p class="cap sm">Wi-Fi and app features require compatible Affinity controls, sold separately.</p>
      ${src('s19')}
    </article>
  </div>
  <article class="mod mt">
    <div class="mn">04</div>
    <div class="split">
      <div><p class="kick">Washington State</p><div class="fig">6–3</div><p class="cap">The Washington Supreme Court vote, September 2026, holding Initiative 2066 unconstitutional in its entirety.</p></div>
      <ul class="facts">
        <li>The commercial code requires heat-pump space heating (C403.1.4), the amended version in effect from 15 March 2024, with supplemental-heat options broadened in December 2024.</li>
        <li>Initiative 2066 had been approved by voters in 2024 to curb these provisions.</li>
        <li>Outdoor heat falls under the radiant-plus-controls rule above, whatever the fuel.</li>
      </ul>
    </div>
    ${src('s11', 's12', 's10')}
  </article>
  ${foot()}
</section>`);

// ---- 7 Denver, Colorado, Massachusetts ------------------------------------------------
const TOWNS = ['Acton', 'Aquinnah', 'Arlington', 'Brookline', 'Cambridge', 'Concord', 'Lexington', 'Lincoln', 'Newton', 'Northampton'];
pages.push(`
<section class="page inner pg7">
  ${head('06', 'Three More Places Shaping The Terrace')}
  <h2 class="disp h2">Denver, Colorado, Massachusetts: One Direction</h2>
  <article class="mod">
    <div class="mn">01</div>
    <p class="kick">Denver</p>
    <h3>What New Buildings May Not Use</h3>
    <p class="unit">2025 Denver Energy Code, new buildings, with exceptions</p>
    <div class="cells c4">
      <div class="out">Fossil-fuel furnaces</div><div class="out hot">Electric resistance space heat</div><div class="out">Fossil-fuel water heaters</div><div class="out">Electric resistance water heaters</div>
    </div>
    <p class="cap">Electric infrared heaters are resistance devices, so the reading matters: if Denver treats outdoor radiant heat as "space heat", the rule would restrict electric patio heaters as well as gas. Ask Denver Community Planning and Development how outdoor radiant heaters are classified. The city's pages give both 31 December 2025 and 1 January 2026 as the effective date.</p>
    ${src('s13')}
  </article>
  <article class="mod mt">
    <div class="mn">02</div>
    <div class="split">
      <div><p class="kick">Colorado</p><div class="fig">2021<span class="u">IECC</span></div><p class="cap">Local governments updating building codes adopt an energy code at least as strong as the 2021 IECC, plus model electric-ready and solar-ready provisions.</p></div>
      <ul class="facts">
        <li>HB22-1362 sets this requirement for local governments.</li>
        <li>The state fire prevention division's own adoption took effect on 15 August 2025.</li>
        <li>Electric-ready rules require capacity and pathways for future electric equipment, and do not in themselves ban gas.</li>
      </ul>
    </div>
    ${src('s15', 's14')}
  </article>
  <article class="mod mt">
    <div class="mn">03</div>
    <div class="split">
      <div><p class="kick">Massachusetts</p><div class="fig">10</div><p class="cap">Municipalities allowed to require fossil-fuel-free new construction and major renovation under 225 CMR 24.00. Each adopts its own by-law.</p></div>
      <div>
        <div class="cells towns">${TOWNS.map(t => `<div class="key">${t}</div>`).join('')}</div>
        <p class="cap sm">The model rule exempts research laboratories and health-care facilities; we found nothing written for outdoor appliances.</p>
      </div>
    </div>
    ${src('s16')}
  </article>
  ${foot()}
</section>`);

// ---- 8 Ready from the first drawing: nine moves ---------------------------------------------
const MOVES = [
  ['Load', 'Add the heater load to the service calculation: sum the wattage of every planned heater.', 'Avoids a service upgrade later.'],
  ['Circuits', 'Dedicated branch circuits; conductors at not less than 125% of the heating load per NEC 424.', 'Code requirement for fixed electric space-heating equipment.'],
  ['Voltage', "Confirm each model's rated voltage; commercial options have included 208, 240 and 277 V.", 'Voltage drives amperage and circuit count.'],
  ['Panel space', 'Reserve breaker spaces for every heater zone plus one spare.', 'Late additions are where projects stall.'],
  ['Conduit', 'Empty conduit with pull string to every future heater and controller location, plus spare conduit to the panel.', 'Lets heat be added without opening finishes.'],
  ['Recess cavities', "Frame and block soffit cavities to the recess kit's dimensions.", 'Recessed heaters need depth that is hard to add later.'],
  ['Controls', 'Locate controllers and wall switches; plan Wi-Fi coverage at controller locations; coordinate any Control4, Crestron or Lutron interface.', 'Controls are required, and energy codes may require occupancy or timer shut-off.'],
  ['Zoning', 'One zone per area used at different times.', 'Lets schedules match use, which saves energy.'],
  ['Damp and wet locations', 'Boxes, devices and heaters listed for the location.', 'Outdoor locations are damp or wet.'],
];
pages.push(`
<section class="page inner">
  ${head('07', 'Ready For Warmth From The First Drawing')}
  <div class="grid g75 top">
    <div>
      <h2 class="disp h2">Nine Moves At Design Stage Keep The Terrace Electric-Ready</h2>
      <p class="body">Outdoor heat costs least, and looks its best, when it is added before the ceiling closes and the panel schedule is fixed.</p>
    </div>
    <figure class="plate p8"><img src="${img('l-010-067')}" alt="Covered outdoor kitchen warmed by heaters set flush into the ceiling"></figure>
  </div>
  <div class="moves">${MOVES.map(([t, d, w], i) => `<div class="mv"><div class="mn">${String(i + 1).padStart(2, '0')}</div><h4>${esc(t)}</h4><p>${esc(d)}</p><p class="why">${esc(w)}</p></div>`).join('')}</div>
  ${src('s18', 's20', 's19')}
  ${foot()}
</section>`);

// ---- 9 Load and circuits ------------------------------------------------------------------
pages.push(`
<section class="page inner pg9">
  ${head('08', 'How Much Load A Heater Adds')}
  <h2 class="disp h2">The Arithmetic Your Electrician Will Run</h2>
  <article class="mod">
    <div class="mn">01</div>
    <div class="split s66">
      <div class="fig xl">125<span class="u">%</span></div>
      <p class="cap">Of the heating load: the minimum branch-circuit conductor rating for fixed electric space-heating equipment under NEC Article 424, which also requires listing for damp and wet locations.</p>
    </div>
    ${src('s18')}
  </article>
  <article class="mod mt">
    <div class="mn">02</div>
    <h3>From Watts To Conductor Size</h3>
    <p class="unit">Two steps, per heater circuit</p>
    <div class="eq formula">
      <div class="term"><b>Watts</b><span>The heater's rated load</span></div>
      <div class="op">÷</div>
      <div class="term"><b>Volts</b><span>The model's rated voltage</span></div>
      <div class="op">=</div>
      <div class="term"><b>Amps</b><span>The heating load</span></div>
      <div class="op">×</div>
      <div class="term key"><b>125%</b><span>Conductor sizing load</span></div>
    </div>
    <p class="cap sm">Your electrician sizes the circuit and protective device to the adopted NEC and the nameplate.</p>
    ${src('s18')}
  </article>
  <article class="mod mt">
    <div class="mn">03</div>
    <h3>Commercial Supply Voltages</h3>
    <p class="unit">Commercial options have included</p>
    <div class="volts"><div><b>208</b><span>V</span></div><div><b>240</b><span>V</span></div><div><b>277</b><span>V</span></div></div>
    <p class="cap">Confirm each model's rated voltage: voltage drives amperage and circuit count. Gas work follows ANSI Z223.1/NFPA 54; electrical work follows ANSI/NFPA 70.</p>
    ${src('s20')}
  </article>
  ${foot()}
</section>`);

// ---- 10 Comparison -------------------------------------------------------------------------
const CHECK = [
  'Identify the AHJ and every instrument that applies: city law, state code, reach code, fire code.',
  'Note the dates: application filing date often decides which rules apply.',
  'Ask whether the AHJ treats outdoor radiant heat as "space heating" (Denver) or as heating outside the envelope.',
  'Specify radiant heaters with occupancy or timer control on commercial projects.',
  'Include outdoor heater load in the service calculation; reserve panel space.',
  'Rough in conduit, boxes and recess framing before finishes.',
  'Schedule controls for every zone: Affinity On/Off, Dimmer or Eclipse controller, wall switch, app.',
  "Use the spec kit's Section 23 83 33 so the electric solution is not swapped at bid.",
];
const CMP = [
  ['All-electric new buildings (NYC LL154, NY State)', 'Compatible', 'No gas supply in an all-electric building', 'A narrow, unclear exception: ask DOB and FDNY'],
  ['Heat-pump baselines (CA 2025)', 'Not affected in the sources reviewed', 'Not banned: baselines address indoor heating', 'Not affected in the sources reviewed'],
  ['Property-line gas definitions (the Berkeley model)', 'Not affected in the sources reviewed', 'Covered', 'Not piped: depends on wording'],
  ['Outdoor heating rule (IECC / WSEC C403.11.1)', 'Compliant when radiant and on occupancy or timer control', 'Compliant when radiant and controlled', 'Compliant when radiant, though automatic shut-off is harder'],
  ["Denver's new-building rules", 'Electric resistance space heat rule: ask Denver CPD', 'Fossil restrictions may apply', 'Depends on scope'],
  ['Permit and installer', 'Electrical permit and a licensed electrician', 'Plumbing or mechanical permit and a licensed gas fitter, to ANSI Z223.1/NFPA 54', 'Fire-department rules govern storage and use'],
  ['Controls', 'Affinity controllers, wall switch, app schedules and zones', 'Gas controls per model', 'Manual at the unit'],
  ['Outlook', 'Aligns with every direction of travel', 'Exposed to new local rules', 'Exposed to fire and local rules'],
];
pages.push(`
<section class="page inner">
  ${head('09', 'The Choice That Travels Well With Every Rule')}
  <h2 class="disp h2">Set Side By Side, Electric Radiant Sits Most Comfortably</h2>
  <table class="mx cmp">
    <thead><tr><th>Rule</th><th class="key">Electric radiant (built-in)</th><th>Piped natural gas (built-in)</th><th>Propane (portable)</th></tr></thead>
    <tbody>${CMP.map(([r, e, g, p]) => `<tr><td><b>${esc(r)}</b></td><td class="key">${esc(e)}</td><td>${esc(g)}</td><td>${esc(p)}</td></tr>`).join('')}</tbody>
  </table>
  <p class="cap sm">Electric radiant is specified with its controls: Affinity Smart-Heat On/Off, Dimmer or Eclipse controller, wall switch and app. Wi-Fi and app features require compatible Affinity controls, sold separately.</p>
  ${src('s1', 's2', 's5', 's7', 's10', 's13', 's19', 's20')}
  <div class="mod mt">
    <div class="mn">Your Planning Checklist</div>
    <ol class="check">${CHECK.map(c => `<li><i></i>${esc(c)}</li>`).join('')}</ol>
  </div>
  ${foot()}
</section>`);

// ---- 11 Checklist and FAQ -----------------------------------------------------------------
const FAQ = [
  ['Can I install a gas patio heater on a new building in New York City?', 'Not on piped gas, because a new building under LL154 has no permitted gas supply. Portable devices fall under a narrow exception whose application to heaters is unclear, so ask the Department of Buildings and FDNY.'],
  ['Did the Berkeley ruling end gas bans?', "It ended Berkeley's and constrains similar ordinances in the Ninth Circuit. The Second Circuit upheld New York's laws in 2026, so the question remains unsettled nationally."],
  ["Does California's 2025 Energy Code ban gas heaters?", 'No. It makes heat pumps the baseline for indoor space and water heating, and gas remains possible through the performance path.'],
  ['Do energy codes say anything about outdoor heaters?', "Yes. Under IECC-based commercial codes such as Washington's, outdoor heating must be radiant and controlled by an occupancy sensor or timer."],
  ['Are electric outdoor heaters affected by bans on electric resistance heat?', 'Possibly in Denver, where new buildings may not use electric resistance space heat. Confirm with the city how outdoor radiant heaters are classified.'],
];
pages.push(`
<section class="page inner">
  ${head('10', 'Questions, And The Fine Print')}
  <h2 class="disp h2">Five Questions Specifiers Ask</h2>
  <div class="grid g2 faq">
    ${FAQ.map(([q, a], i) => `<div class="qa"><div class="mn">Q${i + 1}</div><h4>${esc(q)}</h4><p>${esc(a)}</p></div>`).join('')}
  </div>
  <div class="disc mt">
    <p class="note-k">Disclaimer</p>
    <p>This guide is general information, not legal or code advice. It summarises laws and codes as of 29 October 2026 from the sources cited, some of which are secondary summaries. Requirements vary by jurisdiction, edition, amendment and filing date. Always confirm with the local building authority, fire department and energy code official, and have electrical work designed and installed by a licensed electrician and gas work by a licensed gas fitter. Read the primary source for every rule before you rely on it.</p>
  </div>
  <figure class="plate band" style="height:230px;margin-top:28px"><img src="${img('l-022-201')}" alt="Clifftop timber terrace over the sea with recessed heaters"></figure>
  ${foot()}
</section>`);

// ---- 12 Disclaimer, sources, CTA -------------------------------------------------------------
pages.push(`
<section class="page close">
  ${head('11', 'Primary Sources')}
  <div class="sources">
    <p class="note-k">Sources</p>
    <ol>${Object.keys(S).map(k => `<li>${esc(S[k])}. <span>${esc(URL[k])}</span></li>`).join('')}</ol>
  </div>
  <figure class="plate band" style="height:250px;margin-top:26px"><img src="${img('l-010-075')}" alt="Minimal glass pavilion with heaters recessed into the ceiling"></figure>
  <div class="cta">
    <p class="cta-k">Specify It</p>
    <h2 class="disp cta-h">Specify Electric Radiant Warmth In Section 23 83 33</h2>
    <div class="cta-row"><span class="btn">Download The Spec Kit</span><span class="site">bromic.com</span></div>
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
.v{font-size:11px;font-weight:700;fill:${INK}} .v.inv{fill:#fff}
.tick{font-size:9px;fill:${STEEL}} .lab{font-size:10.5px;fill:${INK}}
.src{font-size:8px;line-height:1.35;color:${STEEL};margin-top:8px}
.kicker{display:flex;justify-content:space-between;align-items:baseline;border-top:3px solid ${INK};padding-top:12px}
.kr{font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;display:flex;align-items:center;gap:8px}
.kr.st{color:${STEEL};font-weight:400}
.dot{width:8px;height:8px;background:${FLAME};display:inline-block}
.cover{display:flex;flex-direction:column}
.cv-top{display:grid;grid-template-columns:${span(6)}px ${span(6)}px;gap:${GUT}px;margin-top:22px;height:410px}
.cv-num{display:flex;flex-direction:column;justify-content:flex-end}
.hero-num{font-weight:700;font-size:400px;line-height:.74;letter-spacing:-.06em;margin-left:-16px}
.hero-cap{font-size:13px;line-height:1.45;margin-top:22px;max-width:${span(5)}px;border-top:1px solid ${INK};padding-top:10px}
.cv-plate{margin:0;overflow:hidden;background:${INK}}
.cv-h{font-size:52px;line-height:1.02;margin-top:28px;border-top:1px solid ${INK};padding-top:16px}
.lede{font-size:14px;line-height:1.5;margin-top:16px;max-width:${span(9)}px}
.places{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:auto;margin-bottom:18px}
.places div{background:${PALE};padding:9px 10px;font-size:11px;font-weight:700}
.places span{display:block;color:${FLAME};font-size:8.5px;margin-bottom:3px;letter-spacing:.1em}
.cover-foot{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;border-top:1px solid ${INK};padding-top:10px}
.cover-foot .src{margin:0;max-width:${span(8)}px}
.logo{height:34px}
.run{display:grid;grid-template-columns:${span(1)}px 1fr auto;gap:${GUT}px;align-items:baseline;border-top:3px solid ${INK};padding-top:10px;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:700}
.run-n{font-size:40px;letter-spacing:-.03em;line-height:.8;color:${FLAME}}
.run-r{color:${STEEL};font-weight:400}
.h2{font-size:32px;line-height:1.06;margin:16px 0 18px}
.intro{display:grid;grid-template-columns:${span(7)}px ${span(5)}px;gap:${GUT}px;align-items:end;margin-bottom:18px}
.intro .h2{margin:16px 0 0}
.body{font-size:11.5px;line-height:1.5}.body.wide{max-width:${span(10)}px}
.mt{margin-top:24px}.pg7 .mt{margin-top:40px}.pg9 .mt{margin-top:44px}
.grid.g2{display:grid;grid-template-columns:${span(6)}px ${span(6)}px;column-gap:${GUT}px;row-gap:18px}
.g75{display:grid;grid-template-columns:${span(5)}px ${span(7)}px;column-gap:${GUT}px}
.g75.top{grid-template-columns:${span(7)}px ${span(5)}px;align-items:start;margin-top:18px}
.mod{border-top:1px solid ${INK};padding-top:8px;position:relative}
.mn{font-size:9px;font-weight:700;color:${FLAME};letter-spacing:.1em}
.kick{font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;margin-top:4px}
.mod h3{font-family:Didot,serif;font-weight:400;font-size:19px;line-height:1.15;margin-top:4px}
.unit{font-size:9.5px;color:${STEEL};margin:4px 0 12px;line-height:1.4}
.fig{font-weight:700;font-size:96px;line-height:.9;letter-spacing:-.05em;margin-top:6px;white-space:nowrap}
.fig .u{font-size:26px;letter-spacing:-.01em;margin-left:8px}
.fig.xl{font-size:190px}.split.s66{grid-template-columns:${span(6)}px ${span(6)}px}.fig.xl .u{font-size:60px}
.cap{font-size:11.5px;line-height:1.45;margin-top:10px}
.cap.sm{font-size:10px;color:${STEEL};margin-top:8px}
.sw{width:9px;height:9px;display:inline-block;vertical-align:baseline;margin-right:4px}.sw.flame{background:${FLAME}}
.split{display:grid;grid-template-columns:${span(5)}px ${span(7)}px;gap:${GUT}px;align-items:start}
.facts{list-style:none;margin-top:6px}
.facts li{font-size:11.5px;line-height:1.45;padding:8px 0 8px 18px;border-bottom:1px solid ${RULE};position:relative}
.facts li::before{content:'';position:absolute;left:0;top:14px;width:7px;height:7px;background:${INK}}
table.mx{width:100%;border-collapse:collapse;font-size:9.6px;line-height:1.35}
.mx th{background:${INK};color:#fff;text-align:left;font-size:8px;letter-spacing:.12em;text-transform:uppercase;padding:7px 8px;vertical-align:bottom}
.mx td{border-bottom:1px solid ${RULE};padding:11px 8px;vertical-align:top}
.mx td b{font-size:10.5px;display:block}
.mx td span{display:block;color:${STEEL};font-size:8.6px;margin-top:2px}
.mx .n{color:${FLAME};font-weight:700;width:26px}
.rules td:nth-child(2){width:150px}.rules td:nth-child(3){width:150px}.rules td:nth-child(4){width:140px}
.rules .vd{font-weight:700;font-size:10px}
.rules .vd i{display:inline-block;width:8px;height:8px;background:${FLAME};margin-right:5px}
.rules .vd.yes{color:${INK}}
.dine td,.dine th{font-size:10px}.dine .y{color:${INK};font-weight:700;border-left:3px solid ${FLAME}}.dine .x{color:${STEEL}}
.cmp td{font-size:10px;padding:9px 8px}
.cmp td:first-child{width:170px}
.cmp th.key{background:${FLAME}}
.cmp td.key{font-weight:700;background:${PALE}}
.cells{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}
.cells div{background:${PALE};padding:10px 9px;font-size:10.5px;font-weight:700;min-height:44px}
.cells .out{background:#fff;border:1.5px solid ${INK}}
.cells.c4{grid-template-columns:repeat(4,1fr)}
.cells.c4 .out.hot{border:2px solid ${FLAME}}
.cells.towns{grid-template-columns:repeat(5,1fr);margin-top:6px}
.cells.towns .key{background:${FLAME};color:#fff;min-height:40px}
.cond{display:grid;gap:4px}
.cond div{display:grid;grid-template-columns:22px 1fr;column-gap:8px;padding:8px 10px;font-size:10.5px;background:${PALE};line-height:1.35}
.cond b{grid-row:1 / span 2;font-size:15px;color:${STEEL}}
.cond span{font-size:9px;color:${STEEL}}
.cond .no{background:#fff;border:1.5px solid ${FLAME}}
.cond .no b{color:${FLAME}}
.steps{list-style:none;border-left:2px solid ${INK};margin:8px 0 0 4px}
.steps li{position:relative;padding:0 0 14px 16px;font-size:11px;line-height:1.4}
.steps li::before{content:'';position:absolute;left:-6px;top:2px;width:10px;height:10px;background:${INK};border:2px solid #fff;border-radius:50%}
.steps li:last-child::before{background:${FLAME}}
.steps b{display:block;font-size:11px}
.tl{list-style:none;position:relative;margin-top:6px}
.tl::before{content:'';position:absolute;left:${span(3) + 8}px;top:4px;bottom:4px;width:2px;background:${INK}}
.tl li{display:grid;grid-template-columns:${span(3)}px ${span(2) + 8}px 1fr;column-gap:${GUT}px;padding:12px 0;border-bottom:1px solid ${RULE};font-size:11px;line-height:1.35;position:relative}
.tl li::after{content:'';position:absolute;left:${span(3) + 4}px;top:13px;width:10px;height:10px;border-radius:50%;background:${INK};border:2px solid #fff}
.tl .td{font-weight:700;text-align:right;padding-right:${GUT}px}
.tl .tw{font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:${STEEL};padding-left:${GUT}px;padding-top:1px}
.tl li.asof{background:${PALE}}.tl li.asof::after{background:#fff;border:2px solid ${INK}}
.tl li.ahead .td,.tl li.ahead .tx{color:${INK}}.tl li.ahead::after{background:${FLAME};width:14px;height:14px;left:${span(3) + 2}px;top:10px}
.eq{display:flex;align-items:stretch;gap:10px;margin-top:4px}
.eq .term{flex:1;background:${PALE};padding:14px 12px}
.eq .term b{display:block;font-size:15px;line-height:1.2}
.eq .term span{display:block;font-size:9.5px;color:${STEEL};margin-top:6px;line-height:1.35}
.eq .term.key{background:${FLAME};color:#fff}.eq .term.key span{color:#fff}
.eq .op{align-self:center;font-size:30px;font-weight:700}
.formula .term b{font-size:20px}
.pull{font-size:40px;line-height:1.1;margin:26px 0;padding-left:20px;border-left:4px solid ${FLAME}}
.volts{display:grid;grid-template-columns:repeat(3,1fr);gap:${GUT}px;margin-top:4px}
.volts div{border-top:3px solid ${INK};padding-top:6px}
.volts b{font-size:88px;letter-spacing:-.05em;line-height:.9}
.volts span{font-size:26px;font-weight:700;margin-left:6px}
.plate{margin:0;overflow:hidden;background:${INK}}
.p8{height:300px}
.plate img,.cv-plate img{width:100%;height:100%;object-fit:cover;filter:url(#duo);display:block}
.moves{display:grid;grid-template-columns:repeat(3,1fr);column-gap:${GUT}px;row-gap:24px;margin-top:26px}
.mv{border-top:1px solid ${INK};padding-top:8px}
.mv h4{font-family:Didot,serif;font-weight:400;font-size:21px;margin:3px 0 8px}
.mv p{font-size:11.5px;line-height:1.45}
.mv .why{color:${STEEL};font-size:10px;margin-top:8px}
.check{list-style:none;display:grid;grid-template-columns:1fr 1fr;column-gap:${GUT}px;row-gap:0;margin-top:6px}
.check li{display:grid;grid-template-columns:22px 1fr;font-size:10.5px;line-height:1.4;padding:7px 0;border-bottom:1px solid ${RULE}}
.check i{width:13px;height:13px;border:1.5px solid ${INK};margin-top:1px}
.faq{row-gap:16px}
.qa{border-top:1px solid ${INK};padding-top:8px}
.qa h4{font-family:Didot,serif;font-weight:400;font-size:18px;line-height:1.2;margin:3px 0 6px}
.qa p{font-size:11.5px;line-height:1.5}
.note-k{font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:${FLAME}}
.disc{border-top:1px solid ${INK};padding-top:8px;margin-top:18px}
.disc p:last-child{font-size:12px;line-height:1.5;margin-top:8px;max-width:${span(11)}px}
.sources{margin-top:22px;border-top:1px solid ${INK};padding-top:8px}
.sources ol{columns:2;column-gap:${GUT}px;margin:8px 0 0 16px;font-size:8.6px;line-height:1.4;color:${STEEL}}
.sources li{break-inside:avoid;margin-bottom:4px}
.sources li span{overflow-wrap:anywhere;color:${INK}}
.foot{position:absolute;left:${M}px;right:${M}px;bottom:${M - 18}px;display:flex;gap:14px;align-items:center;font-size:8px;color:${STEEL};border-top:1px solid ${RULE};padding-top:8px}
.logo-s{height:16px}.foot .pg{margin-left:auto;font-weight:700;color:${INK};font-size:10px}
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
  if (document.documentElement.innerHTML.includes('[[VERIFY') || document.documentElement.innerHTML.includes('VERIFY')) out.push('raw VERIFY in output');
  const hit = (a, b, t = 1) => a.left < b.right - t && b.left < a.right - t && a.top < b.bottom - t && b.top < a.bottom - t;
  document.querySelectorAll('.page').forEach((pg, pi) => {
    const P = pg.getBoundingClientRect(), tag = `p${pi + 1}`;
    pg.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || el.closest('defs,filter')) return;
      if (r.right > P.right - 20 || r.bottom > P.bottom - 10 || r.left < P.left + 20 || r.top < P.top + 20)
        out.push(`${tag} off page/margin: ${el.tagName}.${el.className?.baseVal ?? el.className} "${el.textContent.trim().slice(0, 30)}"`);
    });
    pg.querySelectorAll('.fig,.hero-num,h1,h2,h3,h4,p,td,th,li,.term,.cells div').forEach(el => { if (el.clientWidth && el.scrollWidth > el.clientWidth + 1) out.push(`${tag} text wider than its box: "${el.textContent.trim().slice(0, 30)}"`); });
    const tb = [...pg.querySelectorAll('.fig,.hero-num,h1,h2,h3,h4,p,svg,table,figure,ol,ul,.eq,.cells,.cond,.volts,blockquote,.places')].filter(e => !e.closest('defs') && e.getBoundingClientRect().width);
    for (let i = 0; i < tb.length; i++) for (let j = i + 1; j < tb.length; j++) {
      if (tb[i].contains(tb[j]) || tb[j].contains(tb[i])) continue;
      if (hit(tb[i].getBoundingClientRect(), tb[j].getBoundingClientRect(), 2)) out.push(`${tag} text block overlap: "${tb[i].textContent.trim().slice(0, 25)}" / "${tb[j].textContent.trim().slice(0, 25)}"`);
    }
    const ts = [...pg.querySelectorAll('svg text')].map(t => [t, t.getBoundingClientRect()]);
    pg.querySelectorAll('svg .ref').forEach(l => { const lr = l.getBoundingClientRect(); ts.forEach(([t, r]) => { if (r.top > lr.top + 4 && hit(r, { left: lr.left - 1, right: lr.right + 1, top: lr.top, bottom: lr.bottom }, 0)) out.push(`${tag} text on reference line: "${t.textContent}"`); }); });
    for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) if (hit(ts[i][1], ts[j][1])) out.push(`${tag} label overlap: "${ts[i][0].textContent}" / "${ts[j][0].textContent}"`);
    const blocks = [...pg.querySelectorAll('.run,.mod,.plate,.intro,table,.qa,.sources,.cta,.foot,.h2,.tl,.moves,.check,.disc,.pull,.g75,.grid,.cv-top,.cv-h,.places,.cover-foot,.kicker')].filter(b => !b.parentElement.closest('.mod,.cta,.intro,.cv-top,.g75,.grid,.moves'));
    for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
      if (blocks[i].contains(blocks[j]) || blocks[j].contains(blocks[i])) continue;
      if (hit(blocks[i].getBoundingClientRect(), blocks[j].getBoundingClientRect())) out.push(`${tag} block overlap: ${blocks[i].className} / ${blocks[j].className}`);
    }
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
