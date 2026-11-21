// Blueprint theme — 3-page sample on the Architect's Spec Kit (content/kits/A11-spec-kit.md).
// Every word, number and fact below comes from A11 or data/product-facts.json; open facts read "To confirm".
// Run: node reports/themes/blueprint/build.mjs   → sample.html, pages/p1..p3.png, sample.pdf
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ROOT = '../../..';

// ---------- tokens ----------
const T = {
  navy: '#0E1A2B', navyLine: '#C9D6E8', ink: '#231F20', draw: '#1C2B44', steel: '#6B7480',
  hair: '#B9C3D0', flame: '#EF4123', paper: '#FFFFFF',
};

// ---------- SVG helpers ----------
const n = (v) => +v.toFixed(1);
// vertical dimension line, arrowheads both ends, extension lines to the left reaching `ext` x
function dimV(x, y1, y2, label, { ext = null, col = T.draw, side = 'right', mk = 'arD' } = {}) {
  const exts = ext === null ? '' :
    `<line x1="${ext}" y1="${y1}" x2="${x + 6}" y2="${y1}" class="ext"/><line x1="${ext}" y1="${y2}" x2="${x + 6}" y2="${y2}" class="ext"/>`;
  const my = (y1 + y2) / 2, tx = side === 'right' ? x + 9 : x - 5;
  return `${exts}<line x1="${x}" y1="${y1 + 0.5}" x2="${x}" y2="${y2 - 0.5}" stroke="${col}" stroke-width=".8" marker-start="url(#${mk}s)" marker-end="url(#${mk}e)"/>
  <text x="${tx}" y="${my}" class="dimt" transform="rotate(-90 ${tx} ${my})" text-anchor="middle" fill="${col}">${label}</text>`;
}
function dimH(y, x1, x2, label, { col = T.draw, mk = 'arD', ext = null } = {}) {
  const exts = ext === null ? '' :
    `<line x1="${x1}" y1="${ext}" x2="${x1}" y2="${y - 6}" class="ext"/><line x1="${x2}" y1="${ext}" x2="${x2}" y2="${y - 6}" class="ext"/>`;
  return `${exts}<line x1="${x1 + 0.5}" y1="${y}" x2="${x2 - 0.5}" y2="${y}" stroke="${col}" stroke-width=".8" marker-start="url(#${mk}s)" marker-end="url(#${mk}e)"/>
  <text x="${(x1 + x2) / 2}" y="${y - 5}" class="dimt" text-anchor="middle" fill="${col}">${label}</text>`;
}
// callout leader: dot on the object, elbow, label
function lead(x1, y1, x2, y2, label, { anchor = 'start', col = T.draw } = {}) {
  const lx = anchor === 'start' ? x2 + 4 : x2 - 4;
  return `<circle cx="${x1}" cy="${y1}" r="1.6" fill="${col}"/><polyline points="${x1},${y1} ${x2},${y2}" fill="none" stroke="${col}" stroke-width=".6"/>
  <text x="${lx}" y="${y2 + 2.6}" class="callt" text-anchor="${anchor}" fill="${col}">${label}</text>`;
}
const timber = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="cut"/><path d="M${x} ${y}L${x + w} ${y + h}M${x + w} ${y}L${x} ${y + h}" class="thin"/>`;
const slab = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#hatch)" class="cut"/>`;

// ---------- Drawings ----------
// Section A–A: mounting heights. Scale 2.2 px per inch, floor at y=282.
const F = 282, S = 2.2, yIn = (inch) => n(F - inch * S);
const sectionAA = `<svg viewBox="0 0 450 318" class="dwg" role="img" aria-label="Section showing minimum mounting heights of 72 in for wall and 96 in for ceiling heaters">
  <!-- structure -->
  ${slab(40, 20, 372, 16)}
  <path d="M412 16 l6 6 -10 6 10 6 -6 6" class="thin" fill="none"/>
  ${slab(40, F, 372, 16)}
  <path d="M412 ${F - 4} l6 6 -10 6 10 6 -6 6" class="thin" fill="none"/>
  ${slab(40, 36, 16, F - 36)}
  <line x1="56" y1="36" x2="412" y2="36" class="obj"/><line x1="56" y1="${F}" x2="412" y2="${F}" class="obj"/>
  <!-- furniture, lounge table and chairs in elevation -->
  <g class="furn">
    <rect x="246" y="${yIn(29)}" width="96" height="3"/><line x1="254" y1="${yIn(29) + 3}" x2="254" y2="${F}"/><line x1="334" y1="${yIn(29) + 3}" x2="334" y2="${F}"/>
    <path d="M226 ${F} V${yIn(17)} H246 M226 ${yIn(17)} V${yIn(34)}"/><path d="M362 ${F} V${yIn(17)} H342 M362 ${yIn(17)} V${yIn(34)}"/>
  </g>
  <!-- radiant field -->
  <g class="ray"><path d="M268 ${yIn(97)} L236 ${yIn(36)} M296 ${yIn(97)} L294 ${yIn(36)} M324 ${yIn(97)} L352 ${yIn(36)}"/>
  <path d="M86 ${yIn(74)} L224 ${yIn(40)} M84 ${yIn(70)} L190 ${yIn(16)}"/></g>
  <!-- ceiling-mounted heater, bracket to soffit -->
  <line x1="276" y1="36" x2="276" y2="${yIn(101)}" class="obj"/><line x1="316" y1="36" x2="316" y2="${yIn(101)}" class="obj"/>
  <rect x="252" y="${yIn(101)}" width="88" height="${n(4 * S)}" class="heat"/>
  <line x1="258" y1="${yIn(97) - 0.6}" x2="334" y2="${yIn(97) - 0.6}" stroke="${T.flame}" stroke-width="1"/>
  <!-- wall-mounted heater on bracket, tilted toward the occupied zone -->
  <line x1="56" y1="${yIn(79)}" x2="70" y2="${yIn(79)}" class="obj"/>
  <g transform="rotate(18 70 ${yIn(76)})"><rect x="66" y="${yIn(79)}" width="24" height="${n(7 * S)}" class="heat"/><line x1="90" y1="${yIn(78)}" x2="90" y2="${yIn(73)}" stroke="${T.flame}" stroke-width="1"/></g>
  <!-- wall switch and controller -->
  <rect x="56" y="${yIn(52)}" width="6" height="10" class="cut" fill="#fff"/>
  <rect x="56" y="${yIn(64)}" width="9" height="14" class="cut" fill="#fff"/>
  <!-- dimensions -->
  ${dimV(122, yIn(72), F, '72 IN MIN · AFF', { ext: 82 })}
  ${dimV(392, yIn(97), F, '96 IN MIN · AFF', { ext: 342 })}
  <!-- callouts -->
  ${lead(340, yIn(99), 360, 52, 'CEILING-MOUNTED')}
  ${lead(62, yIn(59), 150, yIn(56), 'AFFINITY CONTROLLER')}
  ${lead(60, yIn(47), 150, yIn(43), 'MANUAL WALL SWITCH')}
  <text x="150" y="${yIn(43) + 12}" class="callt sub">VISIBLE FROM THE HEATED AREA</text>
  ${lead(88, yIn(80), 150, yIn(88), 'WALL-MOUNTED · AIMED AT THE OCCUPIED ZONE')}
  <text x="296" y="${F + 30}" class="callt sub" text-anchor="middle">FINISHED FLOOR</text>
</svg>`;

// D1: recessed soffit section
const d1 = `<svg viewBox="0 0 300 318" class="dwg" role="img" aria-label="Recessed soffit section with recess kit, blocking, cavity depth, ceiling finish and junction box">
  ${slab(14, 26, 272, 14)}
  ${timber(34, 40, 18, 112)}${timber(248, 40, 18, 112)}
  ${timber(92, 84, 16, 16)}${timber(192, 84, 16, 16)}
  <!-- recess kit -->
  <path d="M100 100 H200 V172 M100 100 V172" class="obj" fill="none"/>
  <line x1="92" y1="100" x2="208" y2="100" class="obj"/>
  <!-- heater in kit, face flush with finish -->
  <rect x="108" y="150" width="84" height="22" class="heat"/>
  <path d="M112 166 H188" stroke="${T.flame}" stroke-width="1.2"/>
  <!-- ceiling finish line -->
  <rect x="14" y="172" width="86" height="6" fill="url(#dots)" class="cut"/><rect x="200" y="172" width="86" height="6" fill="url(#dots)" class="cut"/>
  <line x1="100" y1="178" x2="200" y2="178" class="obj"/>
  <!-- junction box and conduit -->
  <rect x="220" y="112" width="18" height="14" class="cut" fill="#fff"/><path d="M220 119 H196" class="thin" stroke-dasharray="3 2"/>
  <!-- radiant field below -->
  <g class="ray"><path d="M124 180 L104 236 M150 180 V240 M176 180 L196 236"/></g>
  <!-- tag dimensions -->
  ${dimV(72, 100, 178, 'A', { ext: 92, side: 'left' })}
  ${dimV(150, 40, 100, 'B')}
  <!-- callouts -->
  ${lead(52, 60, 14, 12, 'STRUCTURE', { anchor: 'start' })}
  ${lead(208, 92, 232, 66, 'BLOCKING')}
  ${lead(200, 136, 232, 146, 'RECESS KIT')}
  ${lead(238, 119, 270, 100, 'J-BOX', { anchor: 'end' })}
  ${lead(250, 175, 232, 206, 'CEILING FINISH LINE')}
  ${lead(186, 172, 150, 262, 'HEATER FACE FLUSH WITH FINISH', { anchor: 'middle' })}
</svg>`;

// Controls: one controller per zone, wall switch per zone, app over Wi-Fi
const zone = (x, name, ctrl, tags) => {
  const hs = tags.map((t, i) => `<rect x="${x + 6 + i * 44}" y="146" width="36" height="12" class="heat"/><text x="${x + 24 + i * 44}" y="170" class="callt" text-anchor="middle">${t}</text>
  <line x1="${x + 24 + i * 44}" y1="128" x2="${x + 24 + i * 44}" y2="146" class="obj"/>`).join('');
  return `<g><rect x="${x}" y="90" width="${Math.max(tags.length * 44 + 4, 100)}" height="38" class="box"/>
  <text x="${x + 6}" y="104" class="boxt">${ctrl[0]}</text><text x="${x + 6}" y="117" class="boxs">${ctrl[1]}</text>
  <line x1="${x + 6}" y1="128" x2="${x + 6 + (tags.length - 1) * 44 + 18}" y2="128" class="obj"/>${hs}
  <circle cx="${x + Math.max(tags.length * 44 + 4, 100) - 9}" cy="${80}" r="6" class="box"/><text x="${x + Math.max(tags.length * 44 + 4, 100) - 9}" y="82.5" class="tiny" text-anchor="middle">WS</text>
  <line x1="${x + Math.max(tags.length * 44 + 4, 100) - 9}" y1="86" x2="${x + Math.max(tags.length * 44 + 4, 100) - 9}" y2="90" class="obj"/>
  <text x="${x}" y="194" class="zonet">${name}</text></g>`;
};
const controls = `<svg viewBox="0 0 450 206" class="dwg" role="img" aria-label="Control zoning diagram: one Affinity controller and one manual wall switch per zone, the app over Wi-Fi">
  <rect x="150" y="6" width="150" height="30" class="box"/>
  <text x="225" y="19" class="boxt" text-anchor="middle">BROMIC SMART-HEAT APP</text><text x="225" y="30" class="boxs" text-anchor="middle">ZONES · SCHEDULES · TIMERS</text>
  <path d="M225 36 V54 M62 54 H372 M62 54 V90 M212 54 V90 M372 54 V90" class="wifi"/>
  <text x="232" y="50" class="tiny">WI-FI</text>
  ${zone(12, 'ZONE 1 · DINING', ['AFFINITY DIMMER', 'VARIABLE OUTPUT'], ['H1', 'H1', 'H1'])}
  ${zone(162, 'ZONE 2 · BAR', ['AFFINITY ON/OFF', 'ON/OFF PER ZONE'], ['H1', 'H1'])}
  ${zone(322, 'ZONE 3 · LOUNGE', ['AFFINITY ECLIPSE', 'HEAT STEPS + RIM LIGHT'], ['H2', 'H2'])}
</svg>`;

// D4: coverage plan (illustrative). Footprint radii from equal-area circles: 121 ft² → r 6.2 ft; drawn at 7 px/ft.
const PX = 7, r121 = n(Math.sqrt(121 / Math.PI) * PX);
const tbl = (cx, cy) => `<rect x="${cx - 18}" y="${cy - 9}" width="36" height="18" class="furnp"/>` +
  [-12, 0, 12].map((d) => `<rect x="${cx + d - 4}" y="${cy - 17}" width="8" height="6" class="furnp"/><rect x="${cx + d - 4}" y="${cy + 11}" width="8" height="6" class="furnp"/>`).join('');
const plan = `<svg viewBox="0 0 420 300" class="dwg" role="img" aria-label="Illustrative coverage plan of a dining terrace with heater positions, footprints, zones and controller locations">
  <defs><clipPath id="terr"><rect x="20" y="20" width="380" height="250"/></clipPath></defs>
  ${slab(14, 14, 392, 6)}${slab(14, 20, 6, 256)}
  <path d="M20 270 H400 V20" class="thin" stroke-dasharray="8 3 2 3" fill="none"/>
  <text x="396" y="284" class="tiny" text-anchor="end">OPEN EDGE</text>
  <g clip-path="url(#terr)">
    <path d="M150 20 V270 M290 20 V270" class="zone"/>
    ${[[52, 70], [52, 150], [52, 230], [112, 110], [112, 190]].map(([x, y]) => tbl(x + 14, y)).join('')}
    <rect x="160" y="40" width="22" height="200" class="furnp"/>
    ${[60, 90, 120, 150, 180, 210].map((y) => `<circle cx="196" cy="${y}" r="5" class="furnp"/>`).join('')}
    <rect x="318" y="70" width="60" height="24" rx="4" class="furnp"/><rect x="318" y="190" width="60" height="24" rx="4" class="furnp"/><rect x="330" y="122" width="36" height="36" rx="18" class="furnp"/>
    ${[[66, 70], [66, 150], [66, 230], [126, 110], [126, 190]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r121 * 0.9}" class="foot"/>`).join('')}
    ${[[210, 80], [210, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r121 * 0.95}" class="foot"/>`).join('')}
    ${[[348, 100], [348, 180]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r121}" class="foot f2"/>`).join('')}
  </g>
  ${[[66, 70], [66, 150], [66, 230], [126, 110], [126, 190], [210, 80], [210, 200]].map(([x, y]) => `<rect x="${x - 13}" y="${y - 2.5}" width="26" height="5" class="heat"/>`).join('')}
  ${[[348, 100], [348, 180]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" class="heat"/><circle cx="${x}" cy="${y}" r="3" fill="${T.flame}"/>`).join('')}
  <text x="85" y="36" class="zonet" text-anchor="middle">ZONE 1 · DINING</text>
  <text x="220" y="36" class="zonet" text-anchor="middle">ZONE 2 · BAR</text>
  <text x="345" y="36" class="zonet" text-anchor="middle">ZONE 3 · LOUNGE</text>
  ${[[26, 254, 'C1'], [156, 254, 'C2'], [296, 254, 'C3']].map(([x, y, t]) => `<rect x="${x}" y="${y}" width="18" height="10" class="ctl"/><text x="${x + 9}" y="${y + 7.5}" class="tiny" text-anchor="middle">${t}</text><circle cx="${x + 30}" cy="${y + 5}" r="5" class="ctl"/><text x="${x + 30}" y="${y + 7.5}" class="tiny" text-anchor="middle">S</text>`).join('')}
</svg>`;

// ---------- page furniture ----------
const zones = (dark) => {
  const c = dark ? 'rgba(201,214,232,.55)' : T.steel;
  const cols = [1, 2, 3, 4, 5, 6], rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const top = cols.map((k, i) => `<span style="left:${(i + 0.5) * 100 / cols.length}%">${k}</span>`).join('');
  const side = rows.map((k, i) => `<span style="top:${(i + 0.5) * 100 / rows.length}%">${k}</span>`).join('');
  return `<div class="zones" style="color:${c}"><div class="zt">${top}</div><div class="zb">${top}</div><div class="zl">${side}</div><div class="zr">${side}</div></div>`;
};
const titleStrip = (sheet, title, left) => `<div class="strip">
  <div class="cell grow"><b>NOTES</b><span>${left}</span></div>
  <div class="cell"><b>PROJECT</b><span>The Architect's Spec Kit</span></div>
  <div class="cell"><b>SHEET TITLE</b><span>${title}</span></div>
  <div class="cell s"><b>ASSET</b><span>A11</span></div>
  <div class="cell s"><b>SCALE</b><span>NTS</span></div>
  <div class="cell"><b>REVISION</b><span>Draft for review</span></div>
  <div class="cell s"><b>DATE</b><span>2026-11-16</span></div>
  <div class="cell sheet"><b>SHEET</b><span>0${sheet}<i>/03</i></span></div>
</div>`;

const SOURCES = 'Bromic Lookbook 2026 · Bromic Outdoor Heating Planning Guide v1.2 (US), 2021 · EC&amp;M, NEC Article 424, 2020 · Sweets and The Blue Book, MasterFormat 23 83, 2026';

// ---------- pages ----------
const p1 = `<section class="page dark">
  <div class="grid"></div>${zones(true)}<div class="frame"></div>
  <header class="c-top">
    <img class="logo" src="${ROOT}/images/portfolio/bromic-logo-white.png" alt="Bromic">
    <div class="c-meta"><span>SPEC KIT · FOR ARCHITECTS AND SPECIFIERS</span><span>DIVISION 23 · HVAC</span></div>
  </header>
  <div class="c-head">
    <p class="eyebrow">MASTERFORMAT 23 83 33 · ELECTRIC RADIANT HEATERS</p>
    <h1>The Architect's<br>Spec Kit</h1>
    <p class="c-sub">Outdoor electric radiant heaters, Section 23 83 33.</p>
    <p class="c-lede">The outdoor rooms you design are meant to be lived in well after sunset, and the warmth that makes that possible deserves the same care in the specification as the lighting. Give heat its own named section, a listed product, its required controls and a detail on the drawings, and it arrives on site exactly as you intended.</p>
  </div>
  <figure class="c-elev">
    <svg viewBox="0 0 640 40" class="c-dim"><g>${dimH(26, 22, 618, 'OVERALL LENGTH · PER MODEL · SEE CUT SHEET', { col: T.navyLine, mk: 'arW', ext: 40 })}</g></svg>
    <img src="img/select-front-line.png" alt="Elevation of a Tungsten Smart-Heat Electric heater, Select collection, traced from a product render">
    <svg viewBox="0 0 640 18" class="c-cl"><line x1="320" y1="0" x2="320" y2="18" stroke="${T.flame}" stroke-width=".8" stroke-dasharray="6 2 1.5 2"/></svg>
    <figcaption><span class="bubble">1</span><span><b>ELEVATION · TUNGSTEN SMART-HEAT<sup>®</sup> ELECTRIC, SELECT COLLECTION</b><em>COMING SOON · FINISHES BLACK, WHITE, GRAPHITE · TRACED FROM PRODUCT RENDER · NTS</em></span></figcaption>
  </figure>
  <div class="c-low">
    <div class="index">
      <p class="lbl">INSIDE THIS KIT · DRAWING INDEX</p>
      <table>
        <tr><td>01</td><td>This index and how to use it</td><td>PDF</td><td>Draft</td></tr>
        <tr><td>02</td><td>Guide specification, Section 23 83 33</td><td>DOCX</td><td>Draft</td></tr>
        <tr><td>03</td><td>Coverage and selection table</td><td>XLSX on request</td><td>Draft</td></tr>
        <tr><td>04</td><td>Detail drawings D1–D4</td><td>DWG · PDF</td><td class="tc">To confirm</td></tr>
        <tr><td>05</td><td>CAD and BIM file index</td><td>DWG · RVT · PDF</td><td class="tc">To confirm</td></tr>
        <tr><td>06</td><td>Design consult request</td><td>Service</td><td class="live">Live</td></tr>
      </table>
    </div>
    <figure class="plate">
      <div class="plate-img" style="background-image:url(${ROOT}/images/library/l-010-075.webp)"></div>
      <figcaption><b>SITE PHOTO</b> A glass pavilion warmed by ceiling-recessed heaters.</figcaption>
    </figure>
  </div>
  <div class="tblock">
    <div class="r"><b>PROJECT</b><span>The Architect's Spec Kit</span></div>
    <div class="r two"><div><b>ASSET</b><span>A11</span></div><div><b>SCALE</b><span>NTS</span></div><div><b>DATE</b><span>2026-11-16</span></div></div>
    <div class="r two"><div><b>REVISION</b><span>Draft for review</span></div><div class="sh"><b>SHEET</b><span>01<i>/03</i></span></div></div>
  </div>
</section>`;

const row = (tag, series, status, output, cov, mount, ctl, soon = false) => `<tr${soon ? ' class="soon"' : ''}>
  <td class="tag"><span>${tag}</span></td><td class="ser">${series}</td><td>${status}</td><td class="m">${output}</td><td class="m">${cov}</td><td>${mount}</td><td class="ctl">${ctl}</td></tr>`;

const p2 = `<section class="page light">
  <div class="grid"></div>${zones(false)}<div class="frame"></div>
  <header class="s-head">
    <p class="eyebrow">02 · SELECTION, DETAILS AND CONTROLS</p>
    <h2>Choosing The Right Heater For Each Space</h2>
    <p class="s-lede">Begin with the people who will use the space. A dining table calls for even warmth at seated head height, a bar rail for heat where guests stand, and a lounge for gentle warmth without glare.</p>
  </header>
  <div class="sched">
    <div class="hdr"><span class="lbl">EQUIPMENT SCHEDULE · ELECTRIC RADIANT HEATERS</span><span class="lbl r">CONTROLS ARE REQUIRED ON EVERY HEATER</span></div>
    <table>
      <thead><tr><th>TAG</th><th>SERIES</th><th>STATUS</th><th>OUTPUT</th><th>APPROX. COVERAGE</th><th>MOUNTING</th><th>CONTROLS (REQUIRED)</th></tr></thead>
      <tbody>
      ${row('H1', 'Platinum Smart-Heat<sup>®</sup> Electric', 'Current', '2300 · 3400 · 4500 W', '65–143 ft²', 'Recessed, ceiling, wall · Classic and Marine', 'Affinity On/Off or Dimmer controller + manual wall switch')}
      ${row('H2', 'Eclipse Smart-Heat<sup>®</sup> Electric', 'Current', '33 · 66 · 100 %', '121 ft²', 'Single pole 8", 24" or 48"; double pole; curved pole', 'Affinity Eclipse controller + manual wall switch')}
      ${row('H3', 'Eclipse Smart-Heat<sup>®</sup> Freestanding Electric', 'Current', '33 · 66 · 100 %', '121 ft²', 'Freestanding: wheels, weighted base, curved arm', 'Affinity Eclipse controller · <i class="tc">method to confirm</i>')}
      ${row('H4', 'Tungsten Smart-Heat<sup>®</sup> Electric, Coastal', '<span class="soon-t">Coming soon</span>', '<i class="tc">To confirm</i>', '64–144 ft²', 'Recessed (marine-grade low-clearance), ceiling, wall, single-post', 'Affinity controls as for Platinum · <i class="tc">to confirm</i>', true)}
      ${row('H5', 'Tungsten Smart-Heat<sup>®</sup> Electric, Select', '<span class="soon-t">Coming soon</span>', '<i class="tc">To confirm</i>', '64–144 ft²', 'Recessed (low-clearance), ceiling, wall, single-post', 'Affinity controls as for Platinum · <i class="tc">to confirm</i>', true)}
      </tbody>
    </table>
    <p class="fn">Coverage is approximate and varies with model, mounting height, environment and installation. Wi-Fi and app features need compatible Affinity Smart-Heat<sup>®</sup> Controls, sold separately.</p>
  </div>
  <div class="dwgs">
    <figure class="panel w">
      ${sectionAA}
      <figcaption><span class="bubble">A</span><span><b>SECTION A–A · MOUNTING HEIGHTS</b><em>PLANNING GUIDANCE MINIMUMS · CONFIRM PER MODEL IN THE CURRENT MANUAL · NTS</em></span></figcaption>
    </figure>
    <figure class="panel">
      ${d1}
      <figcaption><span class="bubble">D1</span><span><b>RECESSED SOFFIT SECTION</b><em>A CAVITY DEPTH · B CLEARANCE TO STRUCTURE AND COMBUSTIBLES · PER MODEL · NTS</em></span></figcaption>
    </figure>
  </div>
  <div class="lower">
    <figure class="panel w">
      ${controls}
      <figcaption><span class="bubble">C</span><span><b>CONTROL ZONING · AFFINITY SMART-HEAT<sup>®</sup></b><em>ONE CONTROLLER AND ONE WALL SWITCH (WS) PER ZONE · TYPICAL</em></span></figcaption>
    </figure>
    <div class="notes">
      <p class="lbl">GENERAL NOTES</p>
      <ol>
        <li>A space counts as outdoor when at least 30% of its perimeter is permanently open. Size for the open condition.</li>
        <li>Dedicated branch circuits per NEC Article 424: conductors not less than 125% of the heating load.</li>
        <li>Maintain the manufacturer's minimum clearances and NEC 424.13. Show them on the shop drawings; confirm on site.</li>
        <li>Wiring methods, boxes and devices suitable for damp or wet locations, as the location requires.</li>
        <li>Electrical work by an electrician licensed in the project's jurisdiction.</li>
        <li>Integrations: Amazon Alexa, Google Assistant, Control4, Crestron, Lutron. Compatibility varies by system.</li>
      </ol>
    </div>
  </div>
  ${titleStrip(2, 'Selection, Details, Controls', SOURCES)}
</section>`;

const check = [
  'Space confirmed as outdoor (at least 30% of the perimeter permanently open).',
  'Heater series chosen by use: seated, standing, lounge; coastal exposure noted.',
  "Coverage plan (D4) drawn over the furniture layout and checked by Bromic's design team.",
  'Controls scheduled for every zone: controller type, wall switch, app, any integration.',
  'Mounting heights and clearances taken from the current installation manual for each model.',
  'Recess cavities and blocking shown on the architectural sections (D1).',
  'Circuits, voltage and disconnects coordinated with the electrical engineer.',
  'Energy code check: does the AHJ require occupancy or timer control for outdoor heat?',
  'Substitution approach (Option A or B) agreed with the Owner.',
  'Tungsten Coastal and Select only where Bromic confirms availability for the programme.',
];

const p3 = `<section class="page light">
  <div class="grid"></div>${zones(false)}<div class="frame"></div>
  <header class="s-head">
    <p class="eyebrow">03 · COVERAGE PLAN AND CHECKLIST</p>
    <h2>Your Planning Checklist</h2>
  </header>
  <div class="p3">
    <figure class="panel">
      ${plan}
      <figcaption><span class="bubble">D4</span><span><b>COVERAGE PLAN · DINING TERRACE</b><em>ILLUSTRATIVE · FOOTPRINT AREAS FROM THE SCHEDULE · SHAPES INDICATIVE · NTS</em></span></figcaption>
      <div class="legend">
        <span><i class="lg-h"></i>H1 PLATINUM · 65–143 FT²</span><span><i class="lg-e"></i>H2 ECLIPSE · 121 FT²</span><span><i class="lg-c">C</i>AFFINITY CONTROLLER</span><span><i class="lg-s">S</i>WALL SWITCH</span>
      </div>
    </figure>
    <div class="cl">
      <ol class="checks">${check.map((c, i) => `<li><span class="bx"></span><span class="no">${String(i + 1).padStart(2, '0')}</span><span>${c}</span></li>`).join('')}</ol>
    </div>
  </div>
  <div class="cta">
    <div class="cta-grid"></div>
    <figure class="plate sm">
      <div class="plate-img" style="background-image:url(${ROOT}/images/library/t-006-016.webp)"></div>
      <figcaption><b>SITE PHOTO</b> A heater recessed into a timber soffit on a city roof terrace.</figcaption>
    </figure>
    <div class="cta-body">
      <p class="eyebrow">DESIGN SERVICE · COMPLIMENTARY</p>
      <h3>Send us your plan, and we will return a coverage drawing tailored to your specification.</h3>
      <a class="btn">BOOK A DESIGN CONSULT <span>→</span></a>
      <p class="addr">BROMIC HEATING · 7595 IRVINE CENTER DRIVE, SUITE 100, IRVINE, CA 92618 · 1-800-301-1293 · WWW.BROMIC.COM</p>
    </div>
  </div>
  <p class="disc">This guide specification is a starting point for your professional judgement. Codes, listings and manufacturer requirements change. Confirm every requirement with the authority having jurisdiction and a licensed electrician, and use the manufacturer's current installation instructions for the model specified. Imagery is for design inspiration; product scale and placement may vary from actual specifications.</p>
  ${titleStrip(3, 'Coverage Plan, Checklist', SOURCES)}
</section>`;

// ---------- styles ----------
const css = `
@font-face{font-family:BzDidot;src:url(${ROOT}/app/src/fonts/gfs-didot-latin.woff2) format('woff2')}
@font-face{font-family:BzSans;src:url(${ROOT}/app/src/fonts/arimo-latin.woff2) format('woff2')}
@font-face{font-family:BzMono;src:url(fonts/plex-mono-400.woff2) format('woff2');font-weight:400}
@font-face{font-family:BzMono;src:url(fonts/plex-mono-500.woff2) format('woff2');font-weight:500}
@page{size:Letter;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#888}
body{font-family:BzSans,Arial,sans-serif;color:${T.ink};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:8.5in;height:11in;position:relative;overflow:hidden;margin:0 auto;page-break-after:always;break-after:page}
.page:last-child{page-break-after:auto;break-after:auto}
.dark{background:${T.navy};color:#fff}
.light{background:${T.paper}}
/* fine grid: 1/8 in minor, 1 in major */
.grid{position:absolute;inset:.42in;pointer-events:none}
.dark .grid{background-image:linear-gradient(rgba(201,214,232,.10) .6px,transparent .6px),linear-gradient(90deg,rgba(201,214,232,.10) .6px,transparent .6px),linear-gradient(rgba(201,214,232,.04) .5px,transparent .5px),linear-gradient(90deg,rgba(201,214,232,.04) .5px,transparent .5px);background-size:1in 1in,1in 1in,.125in .125in,.125in .125in}
.light .grid{background-image:linear-gradient(rgba(28,43,68,.07) .6px,transparent .6px),linear-gradient(90deg,rgba(28,43,68,.07) .6px,transparent .6px),linear-gradient(rgba(28,43,68,.028) .5px,transparent .5px),linear-gradient(90deg,rgba(28,43,68,.028) .5px,transparent .5px);background-size:1in 1in,1in 1in,.125in .125in,.125in .125in}
.frame{position:absolute;inset:.42in;border:.9px solid;pointer-events:none}
.dark .frame{border-color:rgba(201,214,232,.7)}.light .frame{border-color:${T.draw}}
.zones{position:absolute;inset:.3in;border:.5px solid currentColor;font:500 6px/1 BzMono,monospace;letter-spacing:.1em;pointer-events:none}
.zones .zt,.zones .zb{position:absolute;left:.12in;right:.12in;height:.12in}.zones .zt{top:0}.zones .zb{bottom:0}
.zones .zl,.zones .zr{position:absolute;top:.12in;bottom:.12in;width:.12in}.zones .zl{left:0}.zones .zr{right:0}
.zones span{position:absolute;transform:translate(-50%,-50%)}
.zones .zt span,.zones .zb span{top:50%}.zones .zl span,.zones .zr span{left:50%}
.lbl,.eyebrow{font:500 7px/1.2 BzMono,monospace;letter-spacing:.16em;text-transform:uppercase}
.eyebrow{color:${T.flame}}
h1,h2,h3{font-family:BzDidot,Didot,serif;font-weight:400;letter-spacing:-.005em}

/* ---- cover ---- */
.c-top{position:absolute;left:.72in;right:.72in;top:.7in;display:flex;justify-content:space-between;align-items:flex-start}
.logo{width:1.3in;display:block}
.c-meta{display:flex;flex-direction:column;align-items:flex-end;gap:5px;font:400 7px/1 BzMono,monospace;letter-spacing:.16em;color:${T.navyLine}}
.c-head{position:absolute;left:.72in;top:1.95in;width:5.4in}
.c-head h1{font-size:60px;line-height:1.02;margin:14px 0 14px;color:#fff}
.c-sub{font:400 13px/1.4 BzSans,sans-serif;color:${T.navyLine};margin-bottom:16px}
.c-lede{font:400 10.5px/1.6 BzSans,sans-serif;color:rgba(255,255,255,.82);max-width:4.6in;padding-left:12px;border-left:.8px solid ${T.flame}}
.c-elev{position:absolute;left:.72in;right:.72in;top:5.55in}
.c-elev img{display:block;width:6.66in;margin:0 auto;opacity:.95}
.c-dim{display:block;width:6.66in;margin:0 auto 2px;overflow:visible}
.c-cl{display:block;width:6.66in;height:.19in;margin:0 auto}
.c-dim .ext{stroke:${T.navyLine};stroke-width:.5;opacity:.7}
.c-dim .dimt{font:500 7px BzMono,monospace;letter-spacing:.14em}
figcaption{display:flex;gap:8px;align-items:center}
figcaption b{display:block;font:500 7.2px/1.3 BzMono,monospace;letter-spacing:.12em}
figcaption em{display:block;font:400 6.4px/1.4 BzMono,monospace;letter-spacing:.1em;font-style:normal;opacity:.75;margin-top:1px}
.bubble{flex:none;width:22px;height:22px;border-radius:50%;border:.8px solid currentColor;display:grid;place-items:center;font:500 7.5px/1 BzMono,monospace;position:relative}
.bubble::after{content:"";position:absolute;left:100%;top:50%;width:3.2in;border-top:.6px solid currentColor;opacity:.0}
.c-elev figcaption{margin:6px 0 0 .03in;color:#fff}
.c-elev figcaption em{color:${T.navyLine}}
.c-low{position:absolute;left:.72in;right:.72in;top:7.55in;display:grid;grid-template-columns:1fr 2.5in;gap:.35in}
.index .lbl{color:${T.navyLine};margin-bottom:8px}
.index table{width:100%;border-collapse:collapse;font-size:8.5px}
.index td{padding:5px 6px 5px 0;border-top:.5px solid rgba(201,214,232,.28);color:rgba(255,255,255,.88);vertical-align:baseline}
.index tr:last-child td{border-bottom:.5px solid rgba(201,214,232,.28)}
.index td:first-child{font:500 7px BzMono,monospace;color:${T.flame};width:22px}
.index td:nth-child(3){font:400 6.8px BzMono,monospace;letter-spacing:.06em;color:${T.navyLine};white-space:nowrap}
.index td:last-child{font:500 6.8px BzMono,monospace;letter-spacing:.08em;text-transform:uppercase;text-align:right;white-space:nowrap}
.tc{color:#9AA6B6;font-style:normal}.dark .tc{color:#8E9BB0}
.live{color:#fff}
.plate{border:.6px solid;padding:5px}
.dark .plate{border-color:rgba(201,214,232,.6)}
.plate-img{height:1.32in;background-size:cover;background-position:center}
.plate figcaption{display:block;font:400 6.6px/1.4 BzMono,monospace;letter-spacing:.06em;margin-top:5px;color:${T.navyLine}}
.plate figcaption b{display:inline;font-size:6.6px;color:${T.flame};margin-right:4px;letter-spacing:.14em}
.tblock{position:absolute;right:.42in;bottom:.42in;width:3.3in;border-left:.9px solid rgba(201,214,232,.7);border-top:.9px solid rgba(201,214,232,.7);font:400 7.5px/1.2 BzMono,monospace;color:#fff}
.tblock .r{padding:5px 8px;border-bottom:.5px solid rgba(201,214,232,.35)}
.tblock .r:last-child{border-bottom:0}
.tblock .two{display:flex;padding:0}.tblock .two>div{flex:1;padding:5px 8px;border-right:.5px solid rgba(201,214,232,.35)}.tblock .two>div:last-child{border-right:0}
.tblock b{display:block;font-weight:500;font-size:5.6px;letter-spacing:.16em;color:${T.navyLine};margin-bottom:3px}
.tblock .sh span{font-size:14px;line-height:1}.tblock i{font-style:normal;opacity:.55;font-size:8px}

/* ---- inner sheets ---- */
.s-head{position:absolute;left:.72in;right:.72in;top:.7in}
.s-head h2{font-size:30px;line-height:1.1;margin:8px 0 6px;color:${T.ink}}
.s-lede{font-size:9.5px;line-height:1.55;color:#4A4546;max-width:5.6in}
.sched{position:absolute;left:.72in;right:.72in;top:1.82in}
.sched .hdr{display:flex;justify-content:space-between;border-bottom:.9px solid ${T.draw};padding-bottom:5px;color:${T.draw}}
.sched .r{color:${T.flame}}
.sched table{width:100%;border-collapse:collapse;font-size:7.6px;line-height:1.35;color:${T.ink}}
.sched th{font:500 5.9px/1.2 BzMono,monospace;letter-spacing:.13em;text-align:left;color:${T.steel};padding:6px 6px 5px 0;border-bottom:.5px solid ${T.hair}}
.sched td{padding:5px 7px 5px 0;border-bottom:.5px solid ${T.hair};vertical-align:top}
.sched td.m{font:400 7.2px/1.35 BzMono,monospace;white-space:nowrap}
.sched td.ser{font-weight:700;color:${T.ink};width:1.25in}
.sched td.ctl{width:1.6in}
.sched td.tag span{display:inline-grid;place-items:center;width:22px;height:13px;border:.7px solid ${T.draw};font:500 6.4px BzMono,monospace;color:${T.draw}}
.sched tr.soon td{color:#5d5a5b}
.soon-t{font:500 6px BzMono,monospace;letter-spacing:.1em;text-transform:uppercase;color:${T.flame};white-space:nowrap}
.sched .tc{color:${T.steel};font-style:italic}
.fn{font:400 6.4px/1.45 BzMono,monospace;color:${T.steel};margin-top:6px;letter-spacing:.02em}
.dwgs{position:absolute;left:.72in;right:.72in;top:4.62in;display:grid;grid-template-columns:4.05in 1fr;gap:.25in}
.lower{position:absolute;left:.72in;right:.72in;top:8.06in;display:grid;grid-template-columns:4.05in 1fr;gap:.25in}
.panel{color:${T.draw};position:relative}
.panel figcaption{margin-top:4px;padding-top:6px;border-top:.6px solid ${T.draw}}
.dwg{display:block;width:100%;height:auto;overflow:visible}
.dwg .cut{stroke:${T.draw};stroke-width:.9;fill:none}
.dwg rect.cut[fill]{}
.dwg .obj{stroke:${T.draw};stroke-width:1;fill:none}
.dwg .thin{stroke:${T.draw};stroke-width:.5;fill:none}
.dwg .ext{stroke:${T.draw};stroke-width:.4}
.dwg .heat{fill:#fff;stroke:${T.draw};stroke-width:1}
.dwg .furn path,.dwg .furn line,.dwg .furn rect{stroke:${T.steel};stroke-width:.7;fill:none}
.dwg .ray path{stroke:${T.flame};stroke-width:.6;stroke-dasharray:3 3;fill:none;opacity:.8}
.dwg .dimt{font:500 6.6px BzMono,monospace;letter-spacing:.1em}
.dwg .callt{font:500 6.2px BzMono,monospace;letter-spacing:.1em;fill:${T.draw}}
.dwg .callt.sub{font-weight:400;fill:${T.steel};font-size:5.6px}
.dwg .box{fill:#fff;stroke:${T.draw};stroke-width:.8}
.dwg .boxt{font:500 6.3px BzMono,monospace;letter-spacing:.08em;fill:${T.draw}}
.dwg .boxs{font:400 5.3px BzMono,monospace;letter-spacing:.06em;fill:${T.steel}}
.dwg .tiny{font:500 5px BzMono,monospace;letter-spacing:.06em;fill:${T.draw}}
.dwg .zonet{font:500 6px BzMono,monospace;letter-spacing:.14em;fill:${T.flame}}
.dwg .wifi{stroke:${T.draw};stroke-width:.6;stroke-dasharray:2 2;fill:none}
.dwg .furnp{fill:#fff;stroke:${T.steel};stroke-width:.6}
.dwg .foot{fill:rgba(239,65,35,.05);stroke:${T.flame};stroke-width:.6;stroke-dasharray:3 2}
.dwg .zone{stroke:${T.draw};stroke-width:.6;stroke-dasharray:10 3 2 3;fill:none}
.dwg .ctl{fill:#fff;stroke:${T.draw};stroke-width:.7}
.notes .lbl{color:${T.draw};border-bottom:.9px solid ${T.draw};padding-bottom:5px;margin-bottom:6px}
.notes ol{list-style:none;counter-reset:n}
.notes li{counter-increment:n;position:relative;padding:0 0 5px 18px;font-size:7.4px;line-height:1.45;color:#3a3637}
.notes li::before{content:counter(n,decimal-leading-zero);position:absolute;left:0;top:.5px;font:500 6.2px BzMono,monospace;color:${T.flame}}
.strip{position:absolute;left:.42in;right:.42in;bottom:.42in;height:.48in;display:flex;border-top:.9px solid ${T.draw};font:400 7px/1.25 BzMono,monospace;color:${T.ink};background:#fff}
.strip .cell{padding:5px 7px;border-right:.5px solid ${T.hair};display:flex;flex-direction:column;justify-content:space-between;white-space:nowrap}
.strip .cell:last-child{border-right:0}
.strip .cell.grow{flex:1;white-space:normal}
.strip .cell.grow span{font-size:5.4px;line-height:1.35;color:${T.steel}}
.strip b{font-weight:500;font-size:5.4px;letter-spacing:.16em;color:${T.steel}}
.strip .sheet span{font-size:15px;line-height:1;color:${T.draw}}.strip .sheet i{font-style:normal;font-size:8px;color:${T.steel}}

/* ---- sheet 3 ---- */
.p3{position:absolute;left:.72in;right:.72in;top:1.5in;display:grid;grid-template-columns:4.15in 1fr;gap:.3in}
.legend{display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:6px;font:500 5.8px BzMono,monospace;letter-spacing:.1em;color:${T.draw}}
.legend span{display:flex;align-items:center;gap:5px}
.legend i{display:inline-grid;place-items:center;font:500 4.6px BzMono,monospace;font-style:normal}
.lg-h{width:14px;height:4px;border:.8px solid ${T.draw}}
.lg-e{width:9px;height:9px;border-radius:50%;border:.8px solid ${T.draw};box-shadow:inset 0 0 0 2px #fff,inset 0 0 0 4px ${T.flame}}
.lg-c{width:12px;height:8px;border:.7px solid ${T.draw}}
.lg-s{width:9px;height:9px;border-radius:50%;border:.7px solid ${T.draw}}
.checks{list-style:none;border-top:.9px solid ${T.draw}}
.checks li{display:grid;grid-template-columns:12px 18px 1fr;gap:6px;align-items:start;padding:6.4px 0;border-bottom:.5px solid ${T.hair};font-size:8.2px;line-height:1.42;color:#3a3637}
.checks .bx{width:9px;height:9px;border:.8px solid ${T.draw};margin-top:1.5px}
.checks .no{font:500 6.4px/1.9 BzMono,monospace;color:${T.flame}}
.cta{position:absolute;left:.42in;right:.42in;top:6.62in;height:2.6in;background:${T.navy};color:#fff;display:grid;grid-template-columns:2.15in 1fr;gap:.35in;padding:.3in .3in .3in .3in;overflow:hidden}
.cta-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,214,232,.08) .6px,transparent .6px),linear-gradient(90deg,rgba(201,214,232,.08) .6px,transparent .6px);background-size:1in 1in;background-position:-.42in -.62in}
.cta>*{position:relative}
.cta .plate{border-color:rgba(201,214,232,.6)}
.cta .plate-img{height:1.6in}
.cta-body{display:flex;flex-direction:column;justify-content:center}
.cta h3{font-size:25px;line-height:1.18;margin:9px 0 18px;max-width:4.3in}
.btn{align-self:flex-start;display:inline-flex;gap:14px;align-items:center;background:${T.flame};color:#fff;font:500 8px/1 BzMono,monospace;letter-spacing:.18em;padding:10px 16px;text-decoration:none}
.addr{font:400 6.2px/1.5 BzMono,monospace;letter-spacing:.1em;color:${T.navyLine};margin-top:16px}
.disc{position:absolute;left:.72in;right:.72in;top:9.42in;font-size:6.6px;line-height:1.5;color:${T.steel}}
`;

const defs = `<svg width="0" height="0" style="position:absolute"><defs>
  <marker id="arDs" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10 1.5 L0 5 L10 8.5" fill="${T.draw}"/></marker>
  <marker id="arDe" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1.5 L10 5 L0 8.5" fill="${T.draw}"/></marker>
  <marker id="arWs" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10 1.5 L0 5 L10 8.5" fill="${T.navyLine}"/></marker>
  <marker id="arWe" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1.5 L10 5 L0 8.5" fill="${T.navyLine}"/></marker>
  <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="${T.draw}" stroke-width=".5"/></pattern>
  <pattern id="dots" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".45" fill="${T.draw}"/><circle cx="3" cy="3" r=".45" fill="${T.draw}"/></pattern>
</defs></svg>`;

const html = `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Blueprint Theme Sample</title><style>${css}</style></head><body>${defs}${p1}${p2}${p3}</body></html>`;

writeFileSync(join(here, 'sample.html'), html);

// ---------- render ----------
const { chromium } = require('playwright');
mkdirSync(join(here, 'pages'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(here, 'sample.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: 'html,body{background:#fff}' });
// QA: text that overflows its box, and images that failed
const qa = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('.page *').forEach((el) => {
    if (el.closest('svg')) return;
    const cs = getComputedStyle(el);
    if (el.scrollWidth > el.clientWidth + 1 && cs.overflow === 'visible' && el.clientWidth > 0 && !['IMG'].includes(el.tagName) && el.children.length === 0) out.push('overflow-x: ' + el.className + ' ' + el.textContent.slice(0, 40));
  });
  document.querySelectorAll('.page').forEach((pg, i) => {
    const pr = pg.getBoundingClientRect();
    pg.querySelectorAll('p,h1,h2,h3,table,figure,ol,.strip,.tblock').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom > pr.bottom - 0.42 * 96 + 1 && !el.closest('.strip,.tblock') && !el.matches('.strip,.tblock')) out.push(`page ${i + 1}: ${el.tagName}.${el.className} runs into the frame foot (${Math.round(r.bottom - pr.top)}px)`);
    });
  });
  document.querySelectorAll('img').forEach((im) => { if (!im.naturalWidth) out.push('missing image ' + im.src); });
  return out;
});
const pages = await page.$$('.page');
for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: join(here, 'pages', `p${i + 1}.png`) });
await page.pdf({ path: join(here, 'sample.pdf'), format: 'Letter', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(qa.length ? 'QA:\n' + qa.join('\n') : 'QA: clean');
