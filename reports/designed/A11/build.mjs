// A11 The Architect's Spec Kit — the whole document in the Blueprint theme.
// Every word, number and fact comes from content/kits/A11-spec-kit.md (cut and restructured, never added to);
// its [[VERIFY]] items are left out or shown "To confirm". Run: node reports/designed/A11/build.mjs
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  T, ROOT, THEME, TC, sup, zones, sheet, coverBlock, fig, plate, sourcesList, page,
  dimV, dimH, lead, slab, timber, sectionAA, d1, controls, plan, mf,
} from './kit/blueprint.mjs';
import { prepImages, render } from './kit/render.mjs';

const here = dirname(fileURLToPath(import.meta.url));
prepImages(here, {
  pavilion: 'images/library/l-010-075.webp',
  roof: 'images/library/t-006-016.webp',
  coastal: 'images/library/l-005-022.webp',
  ocean: 'images/library/l-010-071.webp',
  night: 'images/library/w-84-hr-grosveldvandervelde-nl1-2021.webp',
  porch: 'images/library/w-connecticut-privateresidence-tungstenelectri-2.webp',
});
const IMG = (k) => `img/${k}.jpg`;
const d1w = d1.replace('viewBox="-4 0 330 280"', 'viewBox="-4 0 352 280"');

const DOC = { project: "The Architect's Spec Kit", asset: 'A11', date: '2026-11-16', revision: 'Draft for review', total: 8 };
const NOTES = 'Notes to specifier in italics in square brackets: delete before issue. Bracketed options [ ] are choices. Superscripts: sources, sheet 08.';

// ------------------------------------------------------------------ drawings new to this document
// D2 wall-mount elevation, with a side view for the tilt
const d2 = `<svg viewBox="0 0 340 250" class="dwg" role="img" aria-label="Wall-mount elevation: mounting height above finished floor, clearance to ceiling, conduit entry, wall switch and controller; side view showing tilt">
  ${slab(40, 14, 196, 10)}
  <rect x="40" y="24" width="196" height="196" class="thin" style="fill:url(#dots);opacity:.35"/>
  ${slab(40, 220, 196, 8)}
  <line x1="40" y1="220" x2="236" y2="220" class="obj"/>
  <rect x="78" y="62" width="110" height="18" class="heat"/>
  <path d="M84 77 H182" stroke="${T.flame}" stroke-width="1.1"/>
  <rect x="100" y="56" width="8" height="6" class="cut" style="fill:#fff"/><rect x="158" y="56" width="8" height="6" class="cut" style="fill:#fff"/>
  <path d="M166 24 V56" class="thin" stroke-dasharray="3 2"/>
  <rect x="198" y="100" width="32" height="120" class="thin" style="fill:#fff"/>
  <rect x="52" y="128" width="16" height="22" class="cut" style="fill:#fff"/>
  <rect x="52" y="164" width="9" height="14" class="cut" style="fill:#fff"/>
  ${dimV(26, 80, 220, 'MOUNTING HEIGHT · MIN PER MANUAL', { ext: 78, side: 'left' })}
  ${dimV(134, 24, 62, 'C', {})}
  ${lead(166, 40, 176, 34, 'CONDUIT ENTRY')}
  ${lead(108, 58, 124, 48, 'BRACKET', { anchor: 'end' })}
  ${lead(68, 140, 110, 128, 'AFFINITY CONTROLLER')}
  ${lead(61, 172, 110, 176, 'MANUAL WALL SWITCH')}
  ${lead(214, 160, 196, 196, 'OPENING', { anchor: 'end' })}
  <g transform="translate(262 30)">
    <rect x="0" y="0" width="10" height="150" class="cut" style="fill:url(#hatch)"/>
    <line x1="10" y1="38" x2="26" y2="38" class="obj"/>
    <g transform="rotate(24 26 38)"><rect x="22" y="34" width="12" height="30" class="heat"/><line x1="34" y1="38" x2="34" y2="60" stroke="${T.flame}" stroke-width="1"/></g>
    <path d="M26 38 V78" class="thin" stroke-dasharray="2 2"/>
    <path d="M26 70 A32 32 0 0 0 39 67" class="thin"/>
    <text x="34" y="88" class="callt">TILT</text>
    <g class="ray"><path d="M40 62 L68 104 M36 66 L52 116"/></g>
    <text x="0" y="168" class="callt sub">SIDE VIEW</text>
  </g>
</svg>`;

// D3 pole suspension under a pitched ceiling, and Eclipse on single and double poles
const d3 = `<svg viewBox="0 0 330 250" class="dwg" role="img" aria-label="Pole suspension under a pitched ceiling bringing a heater to effective height; Eclipse pendant on single and double poles">
  <path d="M8 70 L150 18 L292 70" class="obj" fill="none"/>
  <path d="M8 76 L150 24 L292 76" class="thin" fill="none"/>
  <line x1="8" y1="226" x2="300" y2="226" class="obj"/>
  ${slab(8, 226, 292, 8)}
  <!-- left: linear heater on suspension pole -->
  ${timber(64, 46, 16, 12)}
  <line x1="72" y1="58" x2="72" y2="126" class="obj"/><line x1="75" y1="58" x2="75" y2="126" class="obj"/>
  <rect x="40" y="126" width="68" height="13" class="heat"/>
  <path d="M45 137 H103" stroke="${T.flame}" stroke-width="1.1"/>
  <g class="ray"><path d="M52 140 L40 200 M74 140 V206 M96 140 L108 200"/></g>
  ${dimV(28, 139, 226, 'EFFECTIVE HEIGHT · PER MANUAL', { ext: 40, side: 'left' })}
  ${lead(80, 52, 114, 82, 'STRUCTURAL FIXING')}
  ${lead(75, 100, 114, 104, 'SUSPENSION POLE')}
  <!-- right: Eclipse on single pole -->
  <line x1="196" y1="40" x2="196" y2="124" class="obj"/>
  <ellipse cx="196" cy="128" rx="20" ry="4.5" class="heat"/>
  <ellipse cx="196" cy="128" rx="13" ry="2.6" fill="none" stroke="${T.flame}" stroke-width=".9"/>
  <text x="196" y="146" class="callt" text-anchor="middle">SINGLE POLE</text>
  <!-- right: Eclipse on double pole -->
  <line x1="246" y1="58" x2="246" y2="112" class="obj"/><line x1="270" y1="66" x2="270" y2="112" class="obj"/>
  <ellipse cx="258" cy="116" rx="22" ry="4.8" class="heat"/>
  <ellipse cx="258" cy="116" rx="14" ry="2.8" fill="none" stroke="${T.flame}" stroke-width=".9"/>
  <text x="258" y="134" class="callt" text-anchor="middle">DOUBLE POLE</text>
  <g class="ray"><path d="M186 134 L176 196 M206 134 L216 196 M248 122 L238 186 M268 122 L280 186"/></g>
  <text x="232" y="214" class="callt sub" text-anchor="middle">ECLIPSE · 8", 24", 48" POLES · DOUBLE · CURVED</text>
</svg>`;

// "Outdoor" test: at least 30% of the perimeter permanently open (indicative plan)
const open30 = `<svg viewBox="0 0 230 128" class="dwg" role="img" aria-label="Plan: a space counts as outdoor when at least 30 percent of its perimeter is permanently open">
  <path d="M20 20 H200 V96" class="cut" style="stroke-width:3"/>
  <path d="M20 20 V108 H74" class="cut" style="stroke-width:3"/>
  <path d="M74 108 H200 V96" class="thin" stroke="${T.flame}" stroke-dasharray="5 3" style="stroke:${T.flame};stroke-width:1.2"/>
  <rect x="40" y="38" width="140" height="52" fill="rgba(239,65,35,.05)" stroke="none"/>
  <g class="ray"><path d="M70 50 L60 80 M110 50 V84 M150 50 L160 80"/></g>
  <rect x="80" y="44" width="60" height="7" class="heat"/>
  <text x="137" y="122" class="zonet" text-anchor="middle">≥ 30% OF PERIMETER PERMANENTLY OPEN</text>
  <text x="110" y="14" class="callt sub" text-anchor="middle">PARTIAL ROOF · HEAT CLOUD ADDS A CONVECTIVE BOOST</text>
</svg>`;

// ------------------------------------------------------------------ sheet 01: cover
const p1 = `<section class="page dark">
  <div class="grid"></div>${zones(true)}<div class="frame"></div>
  <header class="c-top blk">
    <img class="logo" src="${ROOT}/images/portfolio/bromic-logo-white.png" alt="Bromic Heating">
    <div class="c-meta"><span>SPEC KIT · FOR ARCHITECTS AND SPECIFIERS</span><span>DIVISION 23 · HVAC</span></div>
  </header>
  <div class="c-head blk">
    <p class="eyebrow">MASTERFORMAT 23 83 33 · ELECTRIC RADIANT HEATERS</p>
    <h1>The Architect's<br>Spec Kit</h1>
    <p class="c-sub">Outdoor electric radiant heaters, Section 23 83 33.</p>
    <p class="c-lede">The outdoor rooms you design are meant to be lived in well after sunset, and the warmth that makes that possible deserves the same care in the specification as the lighting. Give heat its own named section, a listed product, its required controls and a detail on the drawings, and it arrives on site exactly as you intended.</p>
  </div>
  <figure class="c-elev blk">
    <svg viewBox="0 0 640 40" class="c-dim"><g>${dimH(26, 8, 632, 'OVERALL LENGTH · PER MODEL · SEE CUT SHEET', { col: T.navyLine, mk: 'arW', ext: 40 })}</g></svg>
    <img src="${THEME}/img/select-front-line.png" alt="Elevation of a Tungsten Smart-Heat Electric heater, Select collection, traced from a product render">
    <figcaption><span class="bubble">1</span><span><b>ELEVATION · TUNGSTEN SMART-HEAT<sup>®</sup> ELECTRIC, SELECT COLLECTION</b><em>FINISHES BLACK, WHITE, GRAPHITE · TRACED FROM PRODUCT RENDER · NTS</em></span></figcaption>
  </figure>
  <div class="c-low blk">
    <div class="index">
      <p class="lbl">INSIDE THIS KIT · SHEET INDEX</p>
      <table>
        <tr><td>01</td><td>This index and how to use it</td><td>Sheets 01–02</td><td>Draft</td></tr>
        <tr><td>02</td><td>Guide specification, Section 23 83 33</td><td>Sheets 04–05</td><td>Draft</td></tr>
        <tr><td>03</td><td>Coverage and selection table</td><td>Sheet 03</td><td>Draft</td></tr>
        <tr><td>04</td><td>Detail drawings D1–D4</td><td>Sheet 06</td><td class="tc">To confirm</td></tr>
        <tr><td>05</td><td>CAD and BIM file index</td><td>Sheet 07</td><td class="tc">To confirm</td></tr>
        <tr><td>06</td><td>Design consult request</td><td>Sheet 08</td><td class="live">Live</td></tr>
      </table>
    </div>
    ${plate(IMG('pavilion'), 'A glass pavilion warmed by ceiling-recessed heaters.', '1.32in')}
  </div>
  ${coverBlock(DOC)}
</section>`;

// ------------------------------------------------------------------ sheet 02: how to use, MasterFormat
const related = [
  ['26 05 19', 'Conductors'], ['26 05 33', 'Raceways and boxes'], ['26 27 26', 'Wiring devices'], ['26 28 16', 'Disconnects'],
  ['23 09 00', 'HVAC instrumentation and control, if a building automation system is in scope'],
  ['Div. 06 / 09', 'Soffit framing and finish around recessed units'],
];
const p2 = sheet(DOC, 2, {
  eyebrow: '01 · HOW TO USE THIS KIT',
  title: 'The Right Home In MasterFormat',
  lede: 'Written in the right section, the heater you chose is the heater that is built, through value engineering and bid. We recommend <strong>23 83 33 Electric Radiant Heaters</strong>, and the reasoning below supports that choice in a spec review.',
  stripTitle: 'How To Use, MasterFormat',
  notes: NOTES,
  body: `
  <div class="x blk s2-use">
    <div class="boxnote">
      <p class="lbl">HOW TO USE THIS KIT</p>
      <p>Inside is a CSI three-part guide specification for Bromic Smart-Heat electric radiant heaters under <strong>MasterFormat 23 83 33, Electric Radiant Heaters</strong>, a coverage and selection table, the details to draw and the CAD/BIM files to request. Edit the bracketed text, remove what does not apply, and send the coverage plan to the Bromic design team before you issue for bid.</p>
    </div>
  </div>
  <figure class="x blk mf2 panel">
    <div class="lblr"><span class="lbl">MASTERFORMAT · DIVISION 23</span><span class="lbl r">SECTION 23 83 33</span></div>
    ${mf}
  </figure>
  <div class="x blk s2-why">
    <p class="lbl lblr"><span>WHY 23 83 33</span></p>
    <ol class="num">
      <li><b>Division 23 (HVAC), 23 83 00 Radiant Heating Units</b> is MasterFormat's home for equipment that heats by radiation.${sup(3)} Its level-3 children are 23 83 13 (radiant heating electric cables and mats), 23 83 23 (radiant heating electric panels) and <b>23 83 33 (electric radiant heaters)</b>.${sup(4)} A Bromic heater is a self-contained electric infrared emitter, which places it most naturally in 23 83 33.</li>
      <li><b>23 82 39 Unit Heaters</b> covers convection units (cabinet, propeller, wall and ceiling unit heaters) that move warm air.${sup(7)} Outdoors, warm air rises and drifts away on the breeze, and radiant heat warms people and surfaces directly,${sup(2)} so this section is a poor match.</li>
      <li><b>23 55 23 Gas-Fired Radiant Heaters</b> is the home for gas radiant equipment.${sup(6)} If a project also uses Bromic gas heaters, write them there as a separate section.</li>
      <li><b>Industry precedent.</b> Other manufacturers' guide specifications for outdoor electric radiant heaters use 23 83 33.${sup(5)} Some product directories also tag infrared heaters under 23 82 39, a directory convention that need not shape your specification.</li>
    </ol>
  </div>
  <div class="x blk s2-rel">
    <p class="lbl lblr"><span>RELATED SECTIONS YOU WILL COORDINATE</span></p>
    <table class="kv"><tbody>${related.map(([c, t]) => `<tr><td class="code">${c}</td><td>${t}</td></tr>`).join('')}</tbody></table>
    <p class="fn">${TC} Section numbers and titles against the current CSI MasterFormat edition your practice uses.</p>
  </div>
  <div class="x blk s2-ph">${plate(IMG('ocean'), 'An ocean-view outdoor living room with recessed heaters.', '1.72in', '50% 62%')}</div>
  `,
});

// ------------------------------------------------------------------ sheet 03: selection
const row = (tag, series, status, output, fin, cov, mount, best, ctl) => `<tr>
  <td class="tag"><span>${tag}</span></td><td class="ser">${series}</td><td>${status}</td><td class="m">${output}</td><td>${fin}</td><td class="m">${cov}</td><td>${mount}</td><td>${best}</td><td class="ctl">${ctl}</td></tr>`;
const p3 = sheet(DOC, 3, {
  eyebrow: '02 · COVERAGE AND SELECTION',
  title: 'Choosing The Right Heater For Each Space',
  lede: 'Begin with the people who will use the space. A dining table calls for even warmth at seated head height, a bar rail for heat where guests stand, and a lounge for gentle warmth without glare. The numbers follow from there.',
  stripTitle: 'Coverage And Selection',
  notes: 'Coverage is approximate and varies with model, mounting height, environment and installation. Sources: Bromic Lookbook 2026; Bromic Planning Guide v1.2 (US), 2021.',
  body: `
  <div class="x blk sched3 sched">
    <div class="hdr"><span class="lbl">EQUIPMENT SCHEDULE · ELECTRIC RADIANT HEATERS</span><span class="lbl r">CONTROLS ARE REQUIRED ON EVERY HEATER</span></div>
    <table class="eq"><colgroup><col style="width:30px"><col style="width:84px"><col style="width:48px"><col style="width:52px"><col style="width:74px"><col style="width:50px"><col style="width:84px"><col><col style="width:108px"></colgroup>
      <thead><tr><th>TAG</th><th>SERIES</th><th>STATUS</th><th>OUTPUT</th><th>FINISHES</th><th>APPROX. COVERAGE</th><th>MOUNTING</th><th>BEST FOR</th><th>CONTROLS (REQUIRED)</th></tr></thead>
      <tbody>
      ${row('H1', 'Platinum Smart-Heat<sup>®</sup> Electric', 'Current', '2300, 3400, 4500 W', 'Black, White; Classic and Marine variants', '65–143 ft²<br>by model and size', 'Recessed, ceiling, wall', 'Covered terraces, soffits, outdoor kitchens, coastal (Marine)', 'Affinity On/Off or Dimmer controller + manual wall switch; app via compatible Affinity controls')}
      ${row('H2', 'Eclipse Smart-Heat<sup>®</sup> Electric', 'Current', '33 · 66 · 100 %<br>' + TC, 'Black, dimmable rim lighting', '121 ft²', 'Single pole 8", 24" or 48"; double pole; curved pole', 'Dining tables and lounges where heat and light are one fixture', 'Affinity Eclipse controller + manual wall switch; app via compatible Affinity controls')}
      ${row('H3', 'Eclipse Smart-Heat<sup>®</sup> Freestanding Electric', 'Current', '33 · 66 · 100 %', 'Black, dimmable rim lighting', '121 ft²', 'Freestanding: integrated wheels, weighted base, curved arm', 'Flexible lounge and terrace layouts; FF&amp;E rather than built-in', 'Affinity Eclipse controller · method ' + TC)}
      ${row('H4', 'Tungsten Smart-Heat<sup>®</sup> Electric, Coastal collection', 'Current · launched October 2026', TC, 'Black, White; 316 marine-grade stainless; Signature Diamond Pattern grille', '64–144 ft²<br>by model and size', 'Recessed (marine-grade low-clearance), ceiling, wall, single-post', 'Waterfront and marine environments', 'Affinity controls as for Platinum · compatibility ' + TC)}
      ${row('H5', 'Tungsten Smart-Heat<sup>®</sup> Electric, Select collection', 'Current · launched October 2026', TC, 'Black, White, Graphite; expanded fascia options', '64–144 ft²<br>by model and size', 'Recessed (low-clearance), ceiling, wall, single-post', 'Design-led residential and hospitality', 'Affinity controls as for Platinum · compatibility ' + TC)}
      </tbody>
    </table>
    <p class="fn">Coverage is approximate and varies with model, mounting height, environment and installation.${sup(1)} Platinum coverage and mounting height by individual wattage: ${TC}. Wi-Fi and app features need compatible Affinity Smart-Heat<sup>®</sup> Controls, sold separately.</p>
  </div>
  <div class="x blk s3-dwg">${fig(sectionAA, 'A', 'SECTION A–A · MOUNTING HEIGHTS', 'PLANNING GUIDANCE MINIMUMS · CONFIRM PER MODEL IN THE CURRENT MANUAL · NTS')}</div>
  <div class="x blk s3-open">
    ${fig(open30, 'B', 'WHEN A SPACE COUNTS AS OUTDOOR', 'INDICATIVE PLAN · NTS')}
    <p class="s3-p">A space counts as outdoor when at least 30% of its perimeter is permanently open; a partial roof traps a "heat cloud" that adds a convective boost.${sup(2)} Size for the open condition, and let the cover add to the comfort.</p>
  </div>
  <div class="x blk s3-pq"><p class="pullq">Heat You Can Feel, Not See.</p></div>
  <div class="x blk s3-ph">${plate(IMG('roof'), 'A heater recessed into a timber soffit on a city roof terrace.', '1.55in', '50% 12%')}</div>
  `,
});

// ------------------------------------------------------------------ guide specification text
const L = (l, t) => `<p><b class="l">${l}.</b>${t}</p>`;
const S = (l, t) => `<p class="s"><b class="l">${l}.</b>${t}</p>`;
const ns = (t) => `<span class="ns">[${t}]</span>`;

const part1 = `
<h4>PART 1 – GENERAL</h4>
<h5>1.1 SUMMARY</h5>
${L('A', 'Section includes:')}
${S(1, 'Electric infrared radiant heaters for outdoor and semi-outdoor spaces: recessed, ceiling-mounted, wall-mounted and pole-suspended.')}
${S(2, 'Heater controls: controllers, wall switches and app-based scheduling. Controls are part of the heating system and are required.')}
${S(3, 'Mounting accessories: recess kits and suspension poles.')}
${L('B', 'Related requirements:')}
${S(1, 'Division 06 / 09: soffit framing, blocking and finishes at recessed units.')}
${S(2, 'Division 26: branch circuits, raceways, disconnects, wiring devices.')}
${S(3, 'Section 23 09 00: building automation interface, where used.')}
${S(4, 'Section 23 55 23: gas-fired radiant heaters, where used.')}
<h5>1.2 REFERENCES</h5>
${L('A', `NFPA 70, National Electrical Code (NEC), edition adopted by the authority having jurisdiction (AHJ), including Article 424, Fixed Electric Space-Heating Equipment.${sup(8)}`)}
${L('B', `Product safety listing by a Nationally Recognized Testing Laboratory (NRTL): UL, CSA or Intertek (ETL).${sup(2)} Listing standard and file numbers per heater: ${TC}`)}
${L('C', `Ingress protection rating per IEC 60529. IP rating per series: ${TC}`)}
${L('D', 'Local building, energy and fire codes as adopted by the AHJ. Commercial energy codes may require outdoor heating to be radiant and controlled by an occupancy sensor or timer; see the Bromic electrification guide (A12).')}
<h5>1.3 SUBMITTALS</h5>
${L('A', 'Product data: for each heater and controller, rated wattage, voltage, phase, amperage, listing marks, IP rating, finish, dimensions, weight and minimum clearances.')}
${L('B', `Shop drawings: heater layout with coverage zones overlaid, mounting heights, clearances to combustibles, recess and blocking details, circuiting and control zoning. ${ns(`Bromic's complimentary design service prepares coverage drawings from plans or photos.${sup(1)}`)}`)}
${L('C', 'Wiring diagrams: power and control, including interface to building automation where used.')}
${L('D', 'Samples: finish samples for [Black] [White] [Graphite – Tungsten Select only].')}
${L('E', 'Certificates: NRTL listing for each product and its intended location (damp or wet).')}
${L('F', 'Operation and maintenance data: installation manual, cleaning, element replacement, app set-up.')}
${L('G', "Warranty: manufacturer's standard warranty document.")}
<h5>1.4 QUALITY ASSURANCE</h5>
${L('A', 'Manufacturer qualifications: a manufacturer whose products are listed by an NRTL for outdoor use and who provides layout and coverage design support.')}
${L('B', 'Installer qualifications: electrical work by an electrician licensed in the jurisdiction of the project.')}
${L('C', "Install per the manufacturer's current installation instructions. Where these differ from the drawings, notify the Architect before proceeding.")}
${L('D', ns('Mock-up: for hospitality projects, consider one recessed unit installed in the finished soffit for review of finish, alignment and glare.'))}
<h5>1.5 DELIVERY, STORAGE AND HANDLING</h5>
${L('A', 'Deliver in original packaging, labelled with model and finish. Store dry and protected from construction damage until installation.')}
<h5>1.6 WARRANTY</h5>
${L('A', `Manufacturer's standard limited warranty. Terms and periods per series, residential and commercial, and any marine or coastal conditions: ${TC}`)}
`;

const part2a = `
<h4>PART 2 – PRODUCTS</h4>
<h5>2.1 MANUFACTURER</h5>
${L('A', `Basis of design: Bromic Heating, 7595 Irvine Center Drive, Suite 100, Irvine, CA 92618. 1-800-301-1293. www.bromic.com.${sup(1)}`)}
${L('B', `Substitutions: ${ns('Choose one. See "Protecting Your Design Intent Through Bid", sheet 07.')}`)}
${S(1, '[Option A – proprietary: No substitutions.]')}
${S(2, '[Option B – base bid with substitution: Products of other manufacturers will be considered only if they meet every performance requirement in 2.2–2.4 and are submitted under Division 01 substitution procedures with a coverage drawing for the same layout.]')}
<h5>2.2 ELECTRIC RADIANT HEATERS</h5>
${L('A', 'General: electric infrared radiant heaters, listed for outdoor use in the location where installed, designed to warm people and surfaces directly.')}
${L('B', '<strong>Platinum Smart-Heat Electric</strong> (basis of design for recessed, ceiling and wall applications):')}
${S(1, `Rated output: [2300 W] [3400 W] [4500 W].${sup(1)}`)}
${S(2, `Voltage and phase: available voltages per wattage ${TC} Commercial options have been listed as 208 / 240 / 277 V.${sup(2)}`)}
${S(3, `Variant: [Classic] [Marine]. ${ns('Marine for coastal and poolside locations.')}`)}
${S(4, 'Finish: [Black] [White].')}
${S(5, "Mounting: [recessed with manufacturer's recess kit] [ceiling-mounted] [wall-mounted].")}
${S(6, `Approximate coverage: 65–143 ft² per heater depending on model and size.${sup(1)}`)}
`;
const part2c = `
${L('C', '<strong>Eclipse Smart-Heat Electric</strong> (pendant heat and light):')}
${S(1, `Heat output steps: 33%, 66%, 100%.${sup(1)}`)}
${S(2, 'Integrated dimmable rim lighting.')}
${S(3, 'Finish: Black.')}
${S(4, 'Suspension: [single pole 8"] [single pole 24"] [single pole 48"] [double pole] [curved pole].')}
${S(5, 'Approximate coverage: 121 ft² per heater, depending on installation.')}
${S(6, `Rated wattage and voltage: ${TC}`)}
${L('D', `<strong>Eclipse Smart-Heat Freestanding Electric</strong> ${ns('usually specified as FF&amp;E; include here only if the heating contractor supplies it')}:`)}
${S(1, `Integrated wheels, weighted base, curved arm, heat and dimmable light in one.${sup(1)}`)}
${S(2, 'Heat output steps: 33%, 66%, 100%. Approximate coverage: 121 ft².')}
${S(3, `Power supply, plug and cord, receptacle: ${TC}`)}
${L('E', '<strong>Tungsten Smart-Heat Electric, Coastal collection</strong>:')}
${S(1, `316 marine-grade stainless steel; Signature Diamond Pattern grille.${sup(1)}`)}
${S(2, 'Finish: [Black] [White].')}
${S(3, 'Mounting: [marine-grade low-clearance recessed] [ceiling] [wall] [single-post].')}
${S(4, 'Approximate coverage: 64–144 ft² depending on model and size.')}
${S(5, `Wattage, voltage, dimensions: ${TC}`)}
${L('F', '<strong>Tungsten Smart-Heat Electric, Select collection</strong>:')}
${S(1, `Finish: [Black] [White] [Graphite]; expanded fascia options.${sup(1)}`)}
${S(2, 'Mounting: [low-clearance recessed] [ceiling] [wall] [single-post].')}
${S(3, 'Approximate coverage: 64–144 ft² depending on model and size.')}
${S(4, `Wattage, voltage, dimensions: ${TC}`)}
${L('G', `Performance requirements (for Option B substitutions): ${TC}`)}
`;

const part2b = `
<h5>2.3 CONTROLS (REQUIRED)</h5>
${L('A', `Every heater shall be controlled by Affinity Smart-Heat Controls by Bromic Heating. A heater without its controller is not a complete system and shall not be accepted.${sup(1)}`)}
${L('B', 'Controllers, as scheduled on the drawings:')}
${S(1, '[Affinity Smart-Heat On/Off controller] – on/off control of one or more heaters per zone.')}
${S(2, `[Affinity Smart-Heat Dimmer controller] – variable output for Platinum and Tungsten heaters. Compatibility per series and wattage: ${TC}`)}
${S(3, '[Affinity Smart-Heat Eclipse controller] – heat steps and rim lighting for Eclipse heaters.')}
${S(4, 'Manual wall switch at each zone, mounted at [__] in AFF, in a location visible from the heated area.')}
${L('C', `App: Bromic Smart-Heat app for zones, schedules and timers. Wi-Fi connectivity and app features require compatible Affinity Smart-Heat Controls, sold separately.${sup(1)} Provide Wi-Fi coverage at controller locations. Network requirements: ${TC}`)}
${L('D', `Integrations: where scheduled, interface with [Amazon Alexa] [Google Assistant] [Control4] [Crestron] [Lutron]. Compatibility varies by system; integration requires compatible Affinity controls and may require additional integration hardware or configuration.${sup(1)} Coordinate with the integrator before rough-in.`)}
${L('E', `Energy code compliance: where the AHJ requires outdoor heating to switch off automatically when unoccupied, provide [occupancy sensor] [time switch] control. Whether Affinity schedules and timers meet a timer-switch requirement, and the occupancy-sensor interface: ${TC}`)}
${L('F', 'Zoning: separate zones for areas used at different times (for example dining, bar, lounge).')}
<h5>2.4 ACCESSORIES</h5>
${L('A', `Recess kits: manufacturer's recess kit for flush mounting of Platinum and Tungsten electric heaters in ceiling and soffit cavities.${sup(2)} Part numbers, cut-out sizes and cavity depth per model: ${TC}`)}
${L('B', `Suspension poles: manufacturer's suspension poles to bring heaters to effective height under high ceilings.${sup(2)} Available lengths: ${TC}`)}
${L('C', 'Wall and ceiling brackets: as supplied with each heater.')}
`;

const part3 = `
<h4>PART 3 – EXECUTION</h4>
<h5>3.1 EXAMINATION</h5>
${L('A', "Verify that blocking, recess cavities and structure are in place and sized to the manufacturer's cut-out and cavity dimensions.")}
${L('B', 'Verify that branch circuits, disconnects and control wiring are in place, labelled and match the approved shop drawings.')}
${L('C', 'Verify clearances to combustible materials, sprinkler heads, lighting, fans, drapes and awnings before mounting. Do not proceed until conditions are corrected.')}
<h5>3.2 INSTALLATION</h5>
${L('A', "Install heaters, controls and accessories per the manufacturer's current installation instructions and the approved shop drawings.")}
${L('B', `Mounting heights: not less than the manufacturer's minimums for the model and wattage. ${ns(`Bromic's planning guidance has been a minimum of 72 in above floor for wall mounting and 96 in for ceiling mounting, varying with output.${sup(2)} Confirm against the current installation manual for each model.`)} Current minimums per model and wattage: ${TC}`)}
${L('C', 'Aim wall-mounted heaters at the occupied zone, not at walkways or glazing.')}
${L('D', "Recessed units: install recess kit before ceiling finish; seal the ceiling penetration per the manufacturer's instructions.")}
<h5>3.3 CLEARANCES</h5>
${L('A', `Maintain the manufacturer's minimum clearances to ceilings, walls, combustible materials and other fixtures, and NEC 424.13.${sup(8)}`)}
${L('B', 'Show clearances on the shop drawings and confirm on site before final fixing.')}
<h5>3.4 ELECTRICAL</h5>
${L('A', "Electrical work by an electrician licensed in the project's jurisdiction, per NFPA 70 as adopted by the AHJ.")}
${L('B', `Provide dedicated branch circuits sized per NEC Article 424 (branch-circuit conductors not less than 125% of the heating load) and the manufacturer's instructions.${sup(8)}`)}
${L('C', 'Use wiring methods, boxes and devices suitable for damp or wet locations as the location requires.')}
${L('D', 'Provide a disconnecting means as required by NEC Article 424.')}
${L('E', "Run control wiring and network per the controller manufacturer's requirements.")}
<h5>3.5 COMMISSIONING</h5>
${L('A', 'Energise each zone; confirm every heater reaches operating output and every controller step (on/off, dimmer levels, Eclipse heat steps and rim lighting) responds.')}
${L('B', 'Confirm the wall switch overrides as intended.')}
${L('C', "Set up the Smart-Heat app: zones named to match the drawings, schedules and timers per the Owner's operating hours.")}
${L('D', 'Test any third-party integration end to end.')}
${L('E', 'Record measured voltage and current per circuit in the commissioning report.')}
<h5>3.6 DEMONSTRATION</h5>
${L('A', "Train the Owner's staff on site [one hour] [two hours]: operation, zones, schedules, wall switch, app, cleaning and safe distances.")}
${L('B', 'Hand over O&amp;M manuals, warranty documents and the commissioning report.')}
<p class="end">END OF SECTION 23 83 33</p>
`;

const specNote = `<div class="x blk specnote"><p><b>NOTES TO SPECIFIER</b> are in italics in square brackets. Delete them before issue. Bracketed options [ ] are choices. <span class="tcf">To confirm</span> marks a value Bromic will confirm per model.</p></div>`;

const p4 = sheet(DOC, 4, {
  eyebrow: '03 · GUIDE SPECIFICATION · 1 OF 2',
  title: 'Section 23 83 33 Electric Radiant Heaters',
  lede: 'Edit it once, and the warmth you designed arrives on site exactly as drawn, with its controls, listing and details in place.',
  stripTitle: 'Guide Spec, Parts 1–2',
  notes: NOTES,
  body: `${specNote}<div class="x blk spec spec4">${part1}${part2a}${part2c}</div>`,
});
const p5 = sheet(DOC, 5, {
  eyebrow: '03 · GUIDE SPECIFICATION · 2 OF 2',
  title: 'Controls, Accessories, Execution',
  stripTitle: 'Guide Spec, Parts 2–3',
  notes: NOTES,
  body: `<div class="x blk spec spec5">${part2b}${part3}</div>
  <div class="x blk s6-dwg">${fig(controls, 'C', 'CONTROL ZONING · AFFINITY SMART-HEAT<sup>®</sup>', 'ONE CONTROLLER AND ONE WALL SWITCH (WS) PER ZONE · TYPICAL')}</div>
  <div class="x blk s6-int">
    <p class="lbl lblr"><span>INTEGRATIONS</span><span class="r">VARIES BY SYSTEM</span></p>
    <table class="kv"><tbody>
      <tr><td class="code">VOICE</td><td>Amazon Alexa · Google Assistant</td></tr>
      <tr><td class="code">AUTOMATION</td><td>Control4 · Crestron · Lutron</td></tr>
      <tr><td class="code">APP</td><td>Bromic Smart-Heat app: zones, schedules, timers. Needs compatible Affinity Smart-Heat Controls, sold separately.</td></tr>
    </tbody></table>
    <p class="fn">Integration may need additional hardware or configuration. Coordinate with the integrator before rough-in.</p>
  </div>`,
});

// ------------------------------------------------------------------ sheet 08: details
const p6 = sheet(DOC, 6, {
  eyebrow: '04 · STANDARD DETAILS',
  title: 'The Details Your Drawings Should Carry',
  lede: 'A few clear details on the drawings are what let a recessed heater sit perfectly flush on site. Four standard details cover most projects. Each is drawn as a section or plan, with dimensions left as tags for the model you choose.',
  stripTitle: 'Standard Details D1–D4',
  notes: 'Details are illustrative and drawn not to scale; dimensions are tags to fill from the current installation manual for the model. DWG and PDF files of these details: to confirm.',
  body: `
  <div class="x blk s8-a">${fig(d1w, 'D1', 'RECESSED SOFFIT SECTION', 'A CAVITY DEPTH · B CLEARANCE TO STRUCTURE AND COMBUSTIBLES · PER MODEL')}
    <p class="dd">Heater in recess kit, cavity depth, blocking, ceiling finish, clearance to structure and combustibles, junction box location.</p></div>
  <div class="x blk s8-b">${fig(d2, 'D2', 'WALL-MOUNT ELEVATION', 'C CLEARANCE TO CEILING · HEIGHT AND TILT PER MANUAL')}
    <p class="dd">Bracket, mounting height above finished floor, tilt, clearance to ceiling and openings, conduit entry, wall switch location.</p></div>
  <div class="x blk s8-c">${fig(d3, 'D3', 'POLE SUSPENSION', 'EFFECTIVE HEATER HEIGHT · STRUCTURAL FIXING')}
    <p class="dd">Suspension pole or Eclipse single, double or curved pole, effective heater height, structural fixing.</p></div>
  <div class="x blk s8-d">${fig(plan, 'D4', 'COVERAGE PLAN · DINING TERRACE', 'ILLUSTRATIVE · FOOTPRINT AREAS FROM THE SCHEDULE · SHAPES INDICATIVE')}
    <div class="legend">
      <span><i class="lg-h"></i>H1 PLATINUM · 65–143 FT²</span><span><i class="lg-e"></i>H2 ECLIPSE · 121 FT²</span><span><i class="lg-c">C</i>AFFINITY CONTROLLER</span><span><i class="lg-s">S</i>WALL SWITCH</span>
    </div>
    <p class="dd">Heater positions with approximate coverage footprints over the furniture plan, zones, circuits, controller and switch locations.</p></div>
  `,
});

// ------------------------------------------------------------------ sheet 09: bid, CAD/BIM
const files = [
  ['Revit families, electric heaters', '.rfa', 'Platinum (2300/3400/4500 W), Eclipse, Tungsten Coastal and Select'],
  ['Revit families, controllers', '.rfa', 'Affinity On/Off, Dimmer, Eclipse controllers'],
  ['2D CAD blocks', '.dwg', 'Plan and elevation blocks per heater'],
  ['Standard details D1–D4', '.dwg · .pdf', 'As drawn on sheet 06'],
  ['Specification sheets', '.pdf', 'Per model: dimensions, weight, wattage, voltage, clearances'],
  ['Installation manuals', '.pdf', 'Per model, current edition'],
  ['Listing certificates', '.pdf', 'NRTL listing per model'],
];
const p7 = sheet(DOC, 7, {
  eyebrow: '05 · THROUGH BID AND INTO THE MODEL',
  title: 'Protecting Your Design Intent Through Bid',
  lede: 'Whether the specification is proprietary or "or approved equal", the aim is the same: the outdoor room your client approved is the one that opens.',
  stripTitle: 'Bid Approach, CAD And BIM',
  notes: 'File formats, level of development and hosting (bromic.com, BIMobject, ARCAT or other): to confirm with Bromic before you rely on them.',
  body: `
  <div class="x blk s9-opt">
    <div class="opt"><p class="lbl">OPTION A · PROPRIETARY</p><h3>No Substitutions</h3>
      <p>Protects the design intent through bid by limiting substitution. Common on private residential and hospitality work.</p></div>
    <div class="opt"><p class="lbl">OPTION B · BASE BID WITH SUBSTITUTION</p><h3>Equal, At A Higher Standard</h3>
      <p>Many public owners, and some private ones, require competition, so an architect may need to allow substitutions. Option B keeps Bromic as basis of design, sets performance criteria and asks for a coverage drawing for any substitute, so alternatives are allowed at a higher standard.</p></div>
    <p class="fn">Both options are drafted in 2.1 B. Bromic's preferred default and the performance criteria for Option B: ${TC}</p>
  </div>
  <div class="x blk s9-cad">
    <p class="lbl lblr"><span>CAD AND BIM FILES FOR YOUR MODEL</span><span class="r">INDEX</span></p>
    <p class="s9-l">With the heater in your model, every view, from the reflected ceiling plan to the section, shows it as it will be built.</p>
    <table class="kv"><thead><tr><th>FILE</th><th>FORMAT</th><th>CONTENTS</th><th style="text-align:right">STATUS</th></tr></thead><tbody>
      ${files.map(([f, x, c]) => `<tr><td><b>${f}</b></td><td class="code">${x}</td><td>${c}</td><td class="st">${TC}</td></tr>`).join('')}
      <tr><td><b>This guide specification</b></td><td class="code">.docx</td><td>Section 23 83 33</td><td class="st">Draft</td></tr>
    </tbody></table>
  </div>
  <div class="x blk s9-ph">${plate(IMG('coastal'), 'A heater recessed into a white coastal ceiling.', '2.9in', '50% 30%')}</div>
  `,
});

// ------------------------------------------------------------------ sheet 10: checklist, next step, sources
const check = [
  `Space confirmed as outdoor (at least 30% of the perimeter permanently open).${sup(2)}`,
  'Heater series chosen by use: seated, standing, lounge; coastal exposure noted.',
  "Coverage plan (D4) drawn over the furniture layout and checked by Bromic's design team.",
  'Controls scheduled for every zone: controller type, wall switch, app, any integration.',
  'Mounting heights and clearances taken from the current installation manual for each model.',
  'Recess cavities and blocking shown on the architectural sections (D1).',
  'Circuits, voltage and disconnects coordinated with the electrical engineer.',
  'Energy code check: does the AHJ require occupancy or timer control for outdoor heat?',
  'Substitution approach (Option A or B) agreed with the Owner.',
];
const SOURCES = [
  'Bromic. <i>Lookbook 2026</i>. 2026.',
  'Bromic. <i>The Official Outdoor Heating Planning Guide v1.2 (US)</i>. 2021.',
  'Sweets (Dodge Construction Network). <i>MasterFormat 23 83 00 – Radiant Heating Units</i>. 2026. <span class="u">sweets.construction.com</span>',
  'The Blue Book Building &amp; Construction Network. <i>Manufacturer listing showing MasterFormat 23 83 13 / 23 83 23 / 23 83 33</i>. 2026. <span class="u">thebluebook.com</span>',
  'Third-party manufacturer guide specification (published PDF). <i>3 Part Spec – Electric Radiant Heaters</i>. 2025.',
  'New York State Office of General Services. <i>MasterSpec Section 23 55 23.16 – High-Intensity, Gas-Fired, Radiant Heaters</i>. 2024. <span class="u">online2.ogs.ny.gov</span>',
  'University of Saskatchewan. <i>Master specification 23 82 39 Unit Heaters</i>. 2024. <span class="u">suppliers.usask.ca</span>',
  'EC&amp;M. <i>Article 424: Fixed Electric Space-Heating Equipment</i>. 2020. <span class="u">ecmweb.com</span>',
  'UL Standards &amp; Engagement. <i>UL 499 Electric Heating Appliances (scope)</i>. 2025.',
];
const p8 = `<section class="page light">
  <div class="grid"></div>${zones(false)}<div class="frame"></div>
  <header class="s-head blk">
    <p class="eyebrow">06 · CHECKLIST AND NEXT STEP</p>
    <h2>Your Planning Checklist</h2>
  </header>
  <div class="x blk s10-cl">
    <ol class="checks">${check.map((c, i) => `<li><span class="bx"></span><span class="no">${String(i + 1).padStart(2, '0')}</span><span>${c}</span></li>`).join('')}</ol>
  </div>
  <div class="x blk s10-src">
    <p class="lbl lblr"><span>SOURCES</span></p>
    ${sourcesList(SOURCES)}
  </div>
  <div class="x blk s10-ph">${plate(IMG('porch'), 'Heaters recessed flush in a white beadboard porch ceiling.', '1.5in', '50% 45%')}</div>
  <div class="cta blk">
    <div class="cta-grid"></div>
    ${plate(IMG('night'), 'A covered terrace at dusk with heaters recessed in the ceiling.', '1.08in', '60% 40%', 'sm')}
    <div class="cta-body">
      <p class="eyebrow">DESIGN SERVICE · COMPLIMENTARY</p>
      <h3>Send us your plan, and we will return a coverage drawing tailored to your specification.</h3>
      <a class="btn">BOOK A DESIGN CONSULT <span>→</span></a>
      <p class="addr">BROMIC HEATING · 7595 IRVINE CENTER DRIVE, SUITE 100, IRVINE, CA 92618<br>1-800-301-1293 · WWW.BROMIC.COM</p>
    </div>
  </div>
  <p class="disc blk">This guide specification is a starting point for your professional judgement. Codes, listings and manufacturer requirements change. Confirm every requirement with the authority having jurisdiction and a licensed electrician, and use the manufacturer's current installation instructions for the model specified. Imagery is for design inspiration; product scale and placement may vary from actual specifications.${sup(1)}</p>
  ${''}
  <div class="strip">
    <div class="cell grow"><b>NOTES</b><span>Draft for review. Every product fact from the Bromic Lookbook 2026 and Planning Guide v1.2 (US); open items read "To confirm".</span></div>
    <div class="cell"><b>PROJECT</b><span>${DOC.project}</span></div>
    <div class="cell"><b>SHEET TITLE</b><span>Checklist, Next Step</span></div>
    <div class="cell s"><b>ASSET</b><span>A11</span></div>
    <div class="cell s"><b>SCALE</b><span>NTS</span></div>
    <div class="cell"><b>REVISION</b><span>${DOC.revision}</span></div>
    <div class="cell s"><b>DATE</b><span>${DOC.date}</span></div>
    <div class="cell sheet"><b>SHEET</b><span>08<i>/08</i></span></div>
  </div>
</section>`;

// ------------------------------------------------------------------ layout
const css = `
.tcf{text-indent:0}
.s2-use{left:.72in;right:.72in;top:1.72in}
.s2-use .boxnote p:not(.lbl){font-size:8.6px;column-count:2;column-gap:.3in}
.mf2{left:.72in;right:.72in;top:2.82in}
.s2-why{left:.72in;top:4.86in;width:3.7in}
.s2-why .num li{font-size:8.6px}
.s2-rel{left:4.7in;right:.72in;top:4.86in}
.s2-rel .fn{margin-top:8px}
.s2-ph{left:.72in;right:.72in;top:7.8in}
.sched3{top:1.92in;left:.72in;right:.72in;position:absolute}
.sched3 table{font-size:7.1px}
.sched3 td.ser{font-size:7.3px}
.sched3 .tcf{margin-top:2px}
.s3-dwg{left:.72in;top:5.3in;width:4.05in}
.s3-open{left:5.05in;right:.72in;top:5.3in}
.s3-p{font-size:8px;line-height:1.5;color:#3a3637;margin-top:8px}
.s3-pq{left:.72in;top:8.85in;width:3.6in}
.s3-ph{left:5.05in;right:.72in;top:7.95in}
.s3-ph .plate-img{height:1.3in !important}
.specnote{left:.72in;right:.72in;top:1.62in}
.specnote p{font-size:7.4px;line-height:1.5;color:${T.steel};border-left:.8px solid ${T.flame};padding-left:9px}
.specnote b{font:500 6.4px BzMono,monospace;letter-spacing:.12em;color:${T.draw}}
.spec{column-fill:balance}
.spec p{font-size:8.2px}
.spec4{left:.72in;right:.72in;top:2.0in;column-count:3}
.spec5{left:.72in;right:.72in;top:1.4in;column-count:3}
.spec6{left:.72in;right:.72in;top:1.4in;column-count:3}
.s6-dwg{left:.72in;top:7.25in;width:4.05in}
.s6-int{left:5.05in;right:.72in;top:7.25in}
.s8-a{left:.72in;top:2.1in;width:3.3in}
.s8-b{left:4.3in;right:.72in;top:2.1in}
.s8-c{left:.72in;top:6.0in;width:3.3in}
.s8-d{left:4.3in;right:.72in;top:6.0in}
.dd{font-size:7.4px;line-height:1.45;color:#4A4546;margin-top:5px}
.s8-d .dwg{height:2.6in;width:auto;margin:0 auto}
.s9-opt{left:.72in;top:1.95in;width:3.4in}
.s9-opt .opt{border-top:.9px solid ${T.draw};padding:9px 0 14px}
.s9-opt .opt .lbl{color:${T.flame}}
.s9-opt h3{font-size:21px;line-height:1.1;margin:6px 0 6px;color:${T.ink}}
.s9-opt .opt p:not(.lbl){font-size:8.8px;line-height:1.6;color:#3a3637}
.s9-ph{left:4.4in;right:.72in;top:1.95in}
.s9-cad{left:.72in;right:.72in;top:5.75in}
.s9-cad .kv{font-size:8.4px}
.s9-cad .kv td{padding:7px 8px 7px 0}
.s9-l{font-size:8.6px;line-height:1.5;color:#3a3637;margin-bottom:8px}
.s10-cl{left:.72in;top:1.55in;width:3.9in}
.s10-cl .checks li{font-size:8.8px;padding:8.6px 0}
.s10-src{left:4.9in;right:.72in;top:1.62in}
.s10-ph{left:.72in;right:.72in;top:5.0in}
.disc{top:9.62in}
.cta{top:7.18in;padding:.2in .3in}
.page.light .s-head h2{max-width:6.8in}
`;

const html = page({ title: "The Architect's Spec Kit · Bromic Heating", css, body: [p1, p2, p3, p4, p5, p6, p7, p8].join('\n') });
await render({ dir: here, html, pdf: 'Bromic-A11-Architects-Spec-Kit.pdf', meta: { item_id: 'A11', theme: 'blueprint', title: "The Architect's Spec Kit" } });
