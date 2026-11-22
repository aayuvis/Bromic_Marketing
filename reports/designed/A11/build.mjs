// A11 The Architect's Spec Kit, designed edition: "Blueprint, lighter" (owner, 22 Nov 2026: the spec kits were too dense
// and imageless; controls only as far as needed to specify them). One idea a page, photo-led, body type 10.5 pt.
// Words and facts come from content/kits/A11-spec-kit.md and data/product-facts.json (cut, never added to); the CAD/BIM
// table comes from bromic.com/revit-bim-files (data/site-inventory.json, read 29 Oct 2026). [[VERIFY]] items are left out
// or shown "To confirm". The shared kit (./kit/) is used read-only: every A11-only style is scoped under .page.k.
// Run: node reports/designed/A11/build.mjs
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { T, ROOT, zones, coverBlock, page, dimV, dimH, lead, slab, timber } from './kit/blueprint.mjs';
import { prepImages, render } from './kit/render.mjs';

const here = dirname(fileURLToPath(import.meta.url));
rmSync(join(here, 'img'), { recursive: true, force: true });
const R = 'decks/product-renders/';
prepImages(here, {
  cover: 'images/library/l-004-012.webp',
  kitchen: 'images/library/w-bromic-platinum-electric.webp',
  platinum: 'images/library/w-045.webp',
  eclipse: 'images/library/l-012-093.webp',
  freestanding: 'images/library/l-016-131.webp',
  coastal: 'images/library/l-005-022.webp',
  select: 'images/library/l-006-028.webp',
  render: `${R}Tungsten-Series-II-Select-black-front.jpg@0.06,0.36,0.94,0.64`,
  wall: 'images/library/l-010-070.webp@0,0,1,0.72',
  post: 'images/library/t2-single-post-black.webp',
  pole: 'images/library/w-eclipse-electric-24twin-pole-residential-sce.webp',
  recesskit: 'images/library/t2-low-clearance-recess.webp',
  flush: 'images/library/w-bromic-shoot-may-11-2023-54.webp',
  stone: 'images/library/l-007-041.webp',
  design: 'images/library/l-022-201.webp',
  pavilion: 'images/library/d-recessed-pavilion.webp',
  dining: 'images/library/l-013-100.webp',
});
// A11 keeps its own photos lighter than the kit's 2000 px ceiling so ten photo-led sheets stay under 6 MB.
execFileSync('python3', ['-c', `import sys,glob\nfrom PIL import Image\nfor f in glob.glob(sys.argv[1]+'/*.jpg'):\n    im=Image.open(f)\n    if max(im.size)>1400:\n        im.thumbnail((1400,1400),Image.LANCZOS); im.save(f,'JPEG',quality=82,optimize=True)`, join(here, 'img')]);
const IMG = (k) => `img/${k}.jpg`;

const DOC = { project: "The Architect's Spec Kit", asset: 'A11', date: '2026-11-22', revision: 'Draft for review', total: 10 };
const pad = (v) => String(v).padStart(2, '0');
const sup = (...n) => `<sup class="kfn">${n.join(',')}</sup>`;
const TC = '<span class="ktc">To confirm</span>';

const strip = (n, title) => `<div class="strip k-strip">
  <div class="cell grow"><b>PROJECT</b><span>${DOC.project}</span></div>
  <div class="cell"><b>SHEET TITLE</b><span>${title}</span></div>
  <div class="cell s"><b>ASSET</b><span>${DOC.asset}</span></div>
  <div class="cell"><b>REVISION</b><span>${DOC.revision}</span></div>
  <div class="cell s"><b>DATE</b><span>${DOC.date}</span></div>
  <div class="cell sheet"><b>SHEET</b><span>${pad(n)}<i>/${pad(DOC.total)}</i></span></div>
</div>`;

// A light sheet: frame, zone letters, a faint grid, one content column and the slim title strip.
const sheet = (n, stripTitle, { eyebrow, title, lede = '' }, body) => `<section class="page light k">
  <div class="grid"></div>${zones(false)}<div class="frame"></div>
  <div class="kb blk">
    <header class="kh"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2>${lede ? `<p class="lede">${lede}</p>` : ''}</header>
    ${body}
  </div>
  ${strip(n, stripTitle)}
</section>`;

const ph = (k, cap, { h = '2in', pos = 'center', cls = '', fit = 'cover' } = {}) => `<figure class="ph ${cls}">
  <img src="${IMG(k)}" alt="${cap.replace(/<[^>]+>/g, '')}" style="height:${h};object-position:${pos};object-fit:${fit}">
  <figcaption>${cap}</figcaption></figure>`;

// ------------------------------------------------------------------ drawings (simple, lettered)
// Mounting section: wall heater at the 72 in guidance line, ceiling heater at the 96 in line (Planning Guide v1.2).
const FL = 226, PI = 1.5, y = (inch) => +(FL - inch * PI).toFixed(1);
const mountDwg = `<svg viewBox="0 0 470 250" class="dwg k-dwg" role="img" aria-label="Section: wall heater at least 72 inches and ceiling heater at least 96 inches above the finished floor, heights per the current manual">
  ${slab(30, 18, 410, 12)}
  ${slab(30, 30, 14, FL - 30)}
  ${slab(30, FL, 410, 10)}
  <line x1="44" y1="30" x2="440" y2="30" class="obj"/><line x1="44" y1="${FL}" x2="440" y2="${FL}" class="obj"/>
  <g class="furn">
    <rect x="270" y="${y(29)}" width="96" height="3"/><line x1="278" y1="${y(29) + 3}" x2="278" y2="${FL}"/><line x1="358" y1="${y(29) + 3}" x2="358" y2="${FL}"/>
    <path d="M250 ${FL} V${y(17)} H270 M250 ${y(17)} V${y(34)}"/><path d="M386 ${FL} V${y(17)} H366 M386 ${y(17)} V${y(34)}"/>
  </g>
  <g class="ray"><path d="M300 ${y(96) + 2} L286 ${y(40)} M318 ${y(96) + 2} V${y(40)} M336 ${y(96) + 2} L350 ${y(40)}"/>
  <path d="M74 ${y(72) - 2} L128 ${y(48)} M70 ${y(72) + 2} L110 ${y(36)}"/></g>
  <line x1="306" y1="30" x2="306" y2="${y(100)}" class="obj"/><line x1="330" y1="30" x2="330" y2="${y(100)}" class="obj"/>
  <rect x="282" y="${y(100)}" width="72" height="${(4 * PI).toFixed(1)}" class="heat"/>
  <rect x="44" y="${y(82)}" width="4" height="12" class="obj"/>
  <g transform="rotate(24 48 ${y(80)})"><rect x="48" y="${y(80)}" width="24" height="${(6 * PI).toFixed(1)}" class="heat"/></g>
  ${dimV(150, y(72), FL, '72 IN MIN', { ext: 78 })}
  ${dimV(420, y(96), FL, '96 IN MIN', { ext: 356 })}
  ${lead(70, y(79), 112, y(96), 'WALL MOUNT')}
  <text x="116" y="${y(96) + 12}" class="callt sub">TILT TO THE SEATS</text>
  ${lead(282, y(99), 220, 58, 'CEILING MOUNT', { anchor: 'end' })}
  <text x="318" y="${FL + 22}" class="callt sub" text-anchor="middle">FINISHED FLOOR</text>
</svg>`;

// Recess section with lettered dimensions A (cavity depth), B (clearance to structure), C (cut-out).
const recessDwg = `<svg viewBox="0 0 396 262" class="dwg k-dwg" role="img" aria-label="Recess section: heater in the manufacturer's recess kit, face flush with the ceiling finish, with blocking, junction box and lettered dimensions A, B and C">
  ${slab(14, 22, 290, 14)}
  ${timber(30, 36, 18, 116)}${timber(270, 36, 18, 116)}
  ${timber(96, 86, 14, 14)}${timber(210, 86, 14, 14)}
  <path d="M110 100 H210 V172 M110 100 V172" class="obj" fill="none"/>
  <line x1="96" y1="100" x2="224" y2="100" class="obj"/>
  <rect x="116" y="156" width="88" height="22" class="heat"/>
  <path d="M120 175 H200" stroke="${T.flame}" stroke-width="1.2"/>
  <rect x="14" y="172" width="96" height="6" class="cut" style="fill:url(#dots)"/><rect x="210" y="172" width="94" height="6" class="cut" style="fill:url(#dots)"/>
  <rect x="236" y="112" width="18" height="14" class="cut" style="fill:#fff"/><path d="M236 119 H212" class="thin" stroke-dasharray="3 2"/>
  <g class="ray"><path d="M132 182 L112 226 M160 182 V230 M188 182 L208 226"/></g>
  ${dimV(82, 100, 178, 'A', { ext: 96, side: 'left' })}
  ${dimV(160, 36, 100, 'B')}
  ${dimH(250, 110, 210, 'C', { ext: 182 })}
  ${lead(224, 92, 300, 60, 'BLOCKING')}
  ${lead(210, 150, 300, 150, 'RECESS KIT')}
  ${lead(254, 119, 300, 106, 'J-BOX')}
  ${lead(286, 175, 300, 200, 'CEILING FINISH')}
</svg>`;

// ------------------------------------------------------------------ 01 cover
const p1 = `<section class="page dark k">
  <div class="grid"></div>${zones(true)}<div class="frame"></div>
  <header class="c-top blk">
    <img class="logo" src="${ROOT}/images/portfolio/bromic-logo-white.png" alt="Bromic Heating">
    <div class="c-meta"><span>SPEC KIT · FOR ARCHITECTS AND SPECIFIERS</span><span>MASTERFORMAT 23 83 33</span></div>
  </header>
  <figure class="kc-photo blk"><img src="${IMG('cover')}" alt="A covered coastal terrace with Tungsten Smart-Heat Electric heaters on the ceiling, facing the sea">
    <figcaption><b>SITE PHOTO</b> Tungsten Smart-Heat Electric, Coastal collection, on a covered terrace by the sea.</figcaption></figure>
  <div class="kc-head blk">
    <p class="eyebrow">ELECTRIC RADIANT HEATERS · SECTION 23 83 33</p>
    <h1>The Architect's<br>Spec Kit</h1>
    <p class="kc-sub">Everything you need to write outdoor heat into your drawings: the range by space, a clean equipment schedule, the details to draw and a guide specification.</p>
  </div>
  ${coverBlock(DOC)}
</section>`;

// ------------------------------------------------------------------ 02 why
const sect = (code, name, txt, hi = false) => `<div class="kmf-row${hi ? ' hi' : ''}"><p class="code">${code}</p><div><p class="nm">${name}</p><p>${txt}</p></div></div>`;
const p2 = sheet(2, 'Why specify heat early', {
  eyebrow: '01 · AT THE DRAWING STAGE',
  title: 'Give Heat Its Own Section',
  lede: 'The outdoor rooms you design are meant to be lived in well after sunset. Give heat a named section, a listed product, its controls and a detail on the drawings, and it arrives on site as you intended.',
}, `${ph('kitchen', '<b>SITE PHOTO</b> Platinum Smart-Heat Electric recessed in a timber-batten ceiling over an outdoor kitchen.', { h: '3.35in', pos: '50% 40%' })}
  <div class="kmf">
    ${sect('23 83 33', 'Electric Radiant Heaters · recommended', `A Bromic heater is a self-contained electric infrared emitter, so it sits most naturally here.${sup(3, 4)} Other manufacturers' outdoor guide specifications use it too.${sup(5)}`, true)}
    ${sect('23 82 39', 'Unit Heaters', `Convection units that move warm air. Outdoors, warm air rises and drifts away; radiant heat warms people and surfaces directly.${sup(7, 2)}`)}
    ${sect('23 55 23', 'Gas-Fired Radiant Heaters', `The home for Bromic gas heaters, written as a separate section.${sup(6)}`)}
  </div>
  <p class="note">Confirm section numbers against the MasterFormat edition your practice uses.</p>`);

// ------------------------------------------------------------------ 03 range by space
const tile = (k, name, line, pos = 'center') => `<figure class="tile"><img src="${IMG(k)}" alt="${name}" style="object-position:${pos}">
  <figcaption><p class="tn">${name}</p><p>${line}</p></figcaption></figure>`;
const p3 = sheet(3, 'The range by space', {
  eyebrow: '02 · THE RANGE BY SPACE',
  title: 'Start With How The Space Is Used',
  lede: 'A dining table needs even warmth at seated head height, a bar rail heat where guests stand, a lounge gentle warmth without glare.',
}, `<div class="tiles">
    ${tile('platinum', 'Platinum Smart-Heat Electric', 'Covered terraces, soffits and outdoor kitchens. Marine variant for the coast.', '50% 35%')}
    ${tile('eclipse', 'Eclipse Smart-Heat Electric', 'Dining and lounges where heat and light are one pendant fixture.', '50% 40%')}
    ${tile('freestanding', 'Eclipse Smart-Heat Freestanding', 'Flexible lounge and terrace layouts, specified as FF&amp;E.', '50% 45%')}
    ${tile('coastal', 'Tungsten Coastal collection', 'Waterfront and marine settings, in 316 marine-grade stainless steel.', '50% 30%')}
    ${tile('select', 'Tungsten Select collection', 'Design-led homes and hospitality, in Black, White or Graphite.', '50% 40%')}
    <div class="tile test"><p class="eyebrow">THE OUTDOOR TEST</p><p class="big">At least 30% of the perimeter permanently open.</p>
      <p>A partial roof traps a heat cloud that adds a convective boost. Size for the open condition.${sup(2)}</p></div>
  </div>
  <p class="note">Tungsten Select and Coastal launched in October 2026; the Classic collection follows in January 2027.</p>`);

// ------------------------------------------------------------------ 04 equipment schedule + controls to specify
const row = (s, out, mount, fin, cov, ctl) => `<tr><td class="ser">${s}</td><td>${out}</td><td>${mount}</td><td>${fin}</td><td class="n">${cov}</td><td>${ctl}</td></tr>`;
const p4 = sheet(4, 'Equipment schedule', {
  eyebrow: '03 · EQUIPMENT SCHEDULE',
  title: 'One Line For Each Heater',
  lede: `Coverage is approximate and varies with model, mounting height, environment and installation.${sup(1)}`,
}, `${ph('render', '<b>PRODUCT RENDER</b> Tungsten Smart-Heat Electric, Select collection, in Black.', { h: '1.45in', cls: 'render' })}
  <table class="eq">
    <thead><tr><th>Series</th><th>Output</th><th>Mounting</th><th>Finish</th><th>Coverage ft²</th><th>Controller to specify</th></tr></thead>
    <tbody>
    ${row('Platinum Electric', '2300, 3400 or 4500 W', 'Recessed, ceiling, wall', 'Black, White; Classic or Marine', '65–143', 'Affinity On/Off or Dimmer')}
    ${row('Eclipse Electric', 'Steps 33, 66, 100%', 'Single pole 8, 24 or 48 in; double or curved pole', 'Black, dimmable rim light', '121', 'Affinity Eclipse')}
    ${row('Eclipse Freestanding', 'Steps 33, 66, 100%', 'Freestanding, wheels and weighted base', 'Black, dimmable rim light', '121', `Affinity Eclipse ${TC}`)}
    ${row('Tungsten Coastal', TC, 'Low-clearance recess, ceiling, wall, single-post', 'Black, White; 316 stainless', '64–144', `Affinity On/Off or Dimmer ${TC}`)}
    ${row('Tungsten Select', TC, 'Low-clearance recess, ceiling, wall, single-post', 'Black, White, Graphite', '64–144', `Affinity On/Off or Dimmer ${TC}`)}
    </tbody>
  </table>
  <div class="kctl">
    <p class="eyebrow">CONTROLS TO SPECIFY</p>
    <ul class="kl">
      <li>A controller for every heater: a heater without its controller is not a complete system.${sup(1)}</li>
      <li>A manual wall switch for each zone, visible from the heated area.</li>
      <li>Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately.${sup(1)}</li>
      <li>Zones: one channel per circuit, sized by your electrical engineer.</li>
    </ul>
    <p class="note">Warranty, Tungsten Select and Coastal: 3 years on the heater, 7 years on the elements.${sup(10)}</p>
  </div>`);

// ------------------------------------------------------------------ 05 mounting and clearances
const p5 = sheet(5, 'Mounting and clearances', {
  eyebrow: '04 · MOUNTING AND CLEARANCES',
  title: 'Height, Aim And Clearance',
  lede: `Mount no lower than the manufacturer's minimum for the model. Bromic's planning guidance has been 72 in for wall and 96 in for ceiling mounting, varying with output; confirm in the current manual.${sup(2)}`,
}, `<figure class="dwgf">${mountDwg}<figcaption><b>SECTION · NTS</b> Minimum heights above finished floor; take the figure for each model from its current manual.</figcaption></figure>
  <div class="trio">
    ${ph('wall', '<b>WALL</b> Aim at the seats, not at walkways or glazing.', { h: '1.75in', pos: '50% 30%' })}
    ${ph('post', '<b>SINGLE-POST</b> Tungsten Select and Coastal.', { h: '1.75in', fit: 'contain', cls: 'studio' })}
    ${ph('pole', `<b>POLE</b> Eclipse on 8, 24 or 48 in, double or curved poles.${sup(1)}`, { h: '1.75in', pos: '50% 30%' })}
  </div>
  <p class="body">Keep the manufacturer's clearances to ceilings, walls, combustibles, sprinklers, lights, fans and awnings, and NEC 424.13.${sup(8)} Under high or pitched ceilings, suspension poles bring heaters to effective height.${sup(2)}</p>`);

// ------------------------------------------------------------------ 06 recess detail
const p6 = sheet(6, 'Recess detail', {
  eyebrow: '05 · RECESS DETAIL',
  title: 'A Flush Recess, Drawn Once',
  lede: 'A few clear lines on the section are what let a recessed heater sit flush with the ceiling on site.',
}, `<div class="ktwo">
    <figure class="dwgf">${recessDwg}<figcaption><b>SECTION · NTS</b> A cavity depth · B clearance to structure · C cut-out. All per model, from the cut sheet.</figcaption></figure>
    ${ph('recesskit', '<b>PRODUCT RENDER</b> Tungsten Series II in its low-clearance recess kit.', { h: '3.0in', fit: 'contain', cls: 'studio' })}
  </div>
  <div class="ktwo b">
    ${ph('flush', '<b>SITE PHOTO</b> Platinum Smart-Heat Electric recessed flush in a timber ceiling.', { h: '3.0in', pos: '50% 40%' })}
    <ul class="kl">
      <li>Use the manufacturer's recess kit: Platinum, Tungsten Select (low-clearance) and Tungsten Coastal (marine-grade low-clearance).${sup(1, 2)}</li>
      <li>Show blocking and the junction box on the architectural section.</li>
      <li>Install the kit before the ceiling finish, and seal the penetration as the manufacturer instructs.</li>
    </ul>
  </div>`);

// ------------------------------------------------------------------ 07 guide spec, condensed
const cl = (n, t) => `<p class="cl"><b>${n}</b><span>${t}</span></p>`;
const p7 = sheet(7, 'Guide specification', {
  eyebrow: '06 · GUIDE SPECIFICATION, CONDENSED',
  title: 'Section 23 83 33 Electric Radiant Heaters',
}, `${ph('stone', '<b>SITE PHOTO</b> Tungsten Select over a pergola dining terrace at sunset.', { h: '2.1in', pos: '50% 35%' })}
  <div class="spec2">
    <div>
      <h4>PART 1 · GENERAL</h4>
      ${cl('1.1', 'Electric infrared radiant heaters for outdoor and semi-outdoor spaces, with their controls and mounting accessories. Controls are required.')}
      ${cl('1.2', `NFPA 70 (NEC) Article 424 as adopted by the AHJ.${sup(8)} Listing by an NRTL (UL, CSA or Intertek) for the location.${sup(2)}`)}
      ${cl('1.3', 'Submit product data, shop drawings with coverage zones, heights, clearances and recess details, finish samples, listings and O&amp;M data.')}
      <h4>PART 2 · PRODUCTS</h4>
      ${cl('2.1', 'Basis of design: Bromic Heating. Substitutions: [none] [only with equal performance and a coverage drawing for the same layout].')}
    </div>
    <div>
      ${cl('2.2', 'Heaters, outputs, finishes and mounting as the equipment schedule.')}
      ${cl('2.3', 'Controls: an Affinity Smart-Heat controller for each zone, and a manual wall switch.')}
      ${cl('2.4', 'Recess kits, suspension poles and brackets by the manufacturer.')}
      <h4>PART 3 · EXECUTION</h4>
      ${cl('3.1', 'Install to the current manual and the shop drawings; heights and clearances not less than its minimums.')}
      ${cl('3.2', 'Electrical work by a licensed electrician, on dedicated branch circuits per NEC Article 424.')}
      ${cl('3.3', 'Commission each zone, set the app schedules and train the Owner’s staff.')}
    </div>
  </div>
  <div class="kbox"><p class="eyebrow">THE FULL SECTION</p><p>The full editable Section 23 83 33 (.docx), with notes to specifier and both substitution options, is available on request from the Bromic design team.</p></div>`);

// ------------------------------------------------------------------ 08 CAD and BIM, design service
const bim = (p, rv, cad, yr, cls = '') => `<tr class="${cls}"><td class="ser">${p}</td><td>${rv}</td><td>${cad}</td><td class="n">${yr}</td></tr>`;
const p8 = sheet(8, 'CAD, BIM and design service', {
  eyebrow: '07 · CAD, BIM AND DESIGN SERVICE',
  title: 'Put The Heater In Your Model',
  lede: `Revit and CAD files are published by product and mounting. Download at <b>bromic.com/revit-bim-files</b>.${sup(9)}`,
}, `<table class="eq bim">
    <thead><tr><th>Product</th><th>Revit BIM</th><th>CAD / DWG</th><th>Year</th></tr></thead>
    <tbody>
    ${bim('Platinum Smart-Heat Electric', 'Ceiling, Wall', 'Yes', '2023')}
    ${bim('Eclipse Smart-Heat Electric', 'Ceiling, Wall', 'Yes', '2023')}
    ${bim('Eclipse Smart-Heat Freestanding', 'Yes', 'Yes', '2023')}
    ${bim('Tungsten Smart-Heat Electric (Series I)', 'Ceiling, Wall', 'Yes', '2023')}
    ${bim('Tungsten Series II, Select and Coastal', TC, TC, '–', 'pend')}
    ${bim('Platinum and Tungsten Smart-Heat Gas', 'Ceiling, Wall', 'Yes', '2023')}
    ${bim('Tungsten Smart-Heat Freestanding (gas)', 'Yes', 'Yes', '2023')}
    ${bim('Affinity On/Off, Dimmer, Eclipse controllers', 'Yes', '–', '2024')}
    </tbody>
  </table>
  <div class="ktwo c">
    ${ph('design', '<b>SITE PHOTO</b> A clifftop terrace with recessed heaters.', { h: '3.1in', pos: '50% 50%' })}
    <div class="svc"><p class="eyebrow">DESIGN SERVICE</p><p class="big">Send a plan, receive a coverage drawing.</p>
      <p>Bromic's complimentary design service covers heater selection, placement and coverage drawings from your photos, plans or drawings.${sup(1)}</p>
      <p class="mono">bromic.com/design-your-space · 1-800-301-1293</p></div>
  </div>`);

// ------------------------------------------------------------------ 09 checklist
const checks = [
  'Space is outdoor: at least 30% of the perimeter permanently open.',
  'Series chosen for each space: seated, standing, lounge; coastal exposure noted.',
  'Coverage plan drawn over the furniture and checked by Bromic’s design team.',
  'A controller and a manual wall switch scheduled for every zone.',
  'Mounting heights and clearances from the current manual for each model.',
  'Recess cavities and blocking shown on the sections.',
  'Circuits and voltage coordinated with the electrical engineer.',
  'Energy code: does the AHJ require occupancy or timer control?',
];
const p9 = sheet(9, 'Planning checklist', {
  eyebrow: '08 · BEFORE YOU ISSUE',
  title: 'Your Planning Checklist',
}, `${ph('pavilion', '<b>SITE PHOTO</b> An open timber pavilion with heaters recessed in the roof over a long dining table.', { h: '4.1in', pos: '50% 45%' })}
  <ul class="kchecks">${checks.map((c) => `<li><span class="kbx"></span>${c}</li>`).join('')}</ul>`);

// ------------------------------------------------------------------ 10 CTA and sources
const sources = [
  'Bromic, <i>Lookbook 2026</i>, 2026.',
  'Bromic, <i>The Official Outdoor Heating Planning Guide v1.2 (US)</i>, 2021.',
  'Sweets (Dodge Construction Network), MasterFormat 23 83 00 Radiant Heating Units, 2026.',
  'The Blue Book Building &amp; Construction Network, manufacturer listing showing MasterFormat 23 83 13 / 23 83 23 / 23 83 33, 2026.',
  'Third-party manufacturer guide specification, <i>3 Part Spec: Electric Radiant Heaters</i>, 2025.',
  'New York State Office of General Services, MasterSpec 23 55 23.16 High-Intensity, Gas-Fired, Radiant Heaters, 2024.',
  'University of Saskatchewan, Master specification 23 82 39 Unit Heaters, 2024.',
  'EC&amp;M, <i>Article 424: Fixed Electric Space-Heating Equipment</i>, 2020.',
  'Bromic, Revit BIM &amp; CAD Files, bromic.com/revit-bim-files, read 29 October 2026.',
  'Bromic, Tungsten Smart-Heat Electric Series II warranty terms, 2026.',
];
const p10 = `<section class="page light k">
  <div class="grid"></div>${zones(false)}<div class="frame"></div>
  <div class="kcta blk">
    <img src="${IMG('dining')}" alt="Eclipse pendant heaters above a long candlelit dining table">
    <div class="kcta-body">
      <p class="eyebrow">NEXT STEP</p>
      <h3>Send Us Your Plan</h3>
      <p>We will return a coverage drawing tailored to your specification.</p>
      <p class="kbtn">Book a design consult</p>
      <p class="mono">bromic.com/design-your-space · 1-800-301-1293</p>
    </div>
  </div>
  <div class="ksrc blk">
    <p class="eyebrow">SOURCES</p>
    <ol>${sources.map((s, i) => `<li><span class="ksn">${i + 1}</span><span>${s}</span></li>`).join('')}</ol>
    <p class="kdisc">This guide specification is a starting point for your professional judgement. Codes, listings and manufacturer requirements change. Confirm every requirement with the authority having jurisdiction and a licensed electrician, and use the manufacturer's current installation instructions for the model specified. Imagery is for design inspiration; product scale and placement may vary from actual specifications.${sup(1)}</p>
  </div>
  ${strip(10, 'Next step and sources')}
</section>`;

// ------------------------------------------------------------------ styles (all scoped to .page.k)
const css = `
.page.k .grid{opacity:.5}
.page.k .kfn{font:500 7px/0 BzMono,monospace;color:${T.flame};vertical-align:5px;margin-left:1px}
.page.k .ktc{display:inline-block;font:500 7px/1 BzMono,monospace;letter-spacing:.1em;text-transform:uppercase;color:${T.flame};border:.7px solid ${T.flame};padding:2px 4px 1.5px;white-space:nowrap;vertical-align:1px}
.page.k .eyebrow{font:500 8px/1.2 BzMono,monospace;letter-spacing:.16em;color:${T.flame}}
.k-strip{height:.4in}
.k-strip .cell{padding:5px 9px}
.k-strip span{font-size:7.5px}
.k-strip b{font-size:5.8px}
.k-strip .cell.grow span{font-size:7.5px;color:${T.ink}}
.kb{position:absolute;left:.72in;right:.72in;top:.7in;bottom:.98in;display:flex;flex-direction:column;gap:.2in;overflow:hidden}
.kh h2{font-size:34px;line-height:1.08;margin:8px 0 8px;color:${T.ink}}
.kh .lede{font-size:14px;line-height:1.5;color:#3a3637;max-width:6.3in}
:where(.page.light.k) p,:where(.page.light.k) li{font-size:14px;line-height:1.5;color:#3a3637}
.page.k .note{font-size:12px;color:${T.steel};font-style:italic}
.page.k .mono{font:500 10px/1.4 BzMono,monospace;letter-spacing:.06em;color:${T.draw}}
.page.k figcaption{display:block}
.ph{margin:0}
.ph img{display:block;width:100%;background:#F3F4F6}
.ph.studio img{background:#fff;border:.6px solid ${T.hair}}
.ph figcaption,.dwgf figcaption{display:block;margin-top:6px;font-size:10px;line-height:1.4;color:${T.steel}}
.ph figcaption b,.dwgf figcaption b{display:inline;font:500 8px BzMono,monospace;letter-spacing:.14em;color:${T.flame};margin-right:6px}
/* cover */
.page.dark.k .c-top{top:.7in}
.kc-photo{position:absolute;left:.72in;right:.72in;top:1.5in;margin:0}
.kc-photo img{display:block;width:100%;height:4.15in;object-fit:cover;object-position:50% 40%}
.kc-photo figcaption{display:block;margin-top:7px;font:400 8px/1.4 BzMono,monospace;letter-spacing:.06em;color:${T.navyLine}}
.kc-photo figcaption b{display:inline;font-size:8px;color:${T.flame};margin-right:6px;letter-spacing:.14em}
.kc-head{position:absolute;left:.72in;top:6.15in;width:6.2in}
.kc-head h1{font-size:58px;line-height:1.02;margin:12px 0 14px;color:#fff}
.kc-sub{font-size:14px;line-height:1.5;color:rgba(255,255,255,.85);max-width:4.1in;padding-left:12px;border-left:.8px solid ${T.flame}}
/* sheet 02 */
.kmf{border-top:.9px solid ${T.draw}}
.kmf-row{display:grid;grid-template-columns:1.15in 1fr;gap:.2in;padding:10px 0;border-bottom:.5px solid ${T.hair}}
.kmf-row .code{font:500 13px/1.3 BzMono,monospace;color:${T.draw}}
.kmf-row.hi .code{color:${T.flame}}
.kmf-row .nm{font:500 8px/1.3 BzMono,monospace;letter-spacing:.14em;text-transform:uppercase;color:${T.ink};margin-bottom:3px}
.kmf-row p:not(.nm):not(.code){font-size:13px}
/* sheet 03 */
.tiles{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.2in .18in}
.tile{margin:0}
.tile img{display:block;width:100%;height:2.35in;object-fit:cover}
.tile figcaption{padding-top:8px}
.tile .tn{font-family:BzDidot,Didot,serif;font-size:17px;line-height:1.15;color:${T.ink};margin-bottom:4px}
.page.k .tile figcaption p:not(.tn){font-size:12px;line-height:1.45}
.tile.test{border:.9px solid ${T.draw};padding:.16in;display:flex;flex-direction:column;gap:8px;height:fit-content}
.page.k .tile.test .big{font-family:BzDidot,Didot,serif;font-size:20px;line-height:1.15;color:${T.ink}}
.page.k .tile.test p:not(.big):not(.eyebrow){font-size:12px}
/* sheet 04 */
.ph.render img{object-fit:cover}
.eq{width:100%;border-collapse:collapse;table-layout:fixed}
.eq th{font:500 7.5px/1.2 BzMono,monospace;letter-spacing:.12em;text-transform:uppercase;text-align:left;color:${T.steel};padding:0 8px 6px 0;border-bottom:.9px solid ${T.draw};vertical-align:bottom}
.eq td{font-size:11.5px;line-height:1.4;color:#3a3637;padding:8px 8px 8px 0;border-bottom:.5px solid ${T.hair};vertical-align:top}
.eq td.ser{font-weight:700;color:${T.ink}}
.eq td.n{font:500 11px/1.4 BzMono,monospace;color:${T.draw}}
.eq:not(.bim) th:nth-child(1){width:1.15in}.eq:not(.bim) th:nth-child(2){width:1.0in}.eq:not(.bim) th:nth-child(3){width:1.4in}.eq:not(.bim) th:nth-child(4){width:1.2in}.eq:not(.bim) th:nth-child(5){width:.72in}
.kctl{border-top:.9px solid ${T.draw};padding-top:10px}
.kctl .eyebrow{margin-bottom:6px}
.kl{list-style:none}
.kl li{position:relative;padding:0 0 6px 18px}
.kl li::before{content:'';position:absolute;left:0;top:10px;width:9px;height:1px;background:${T.flame}}
.kctl .note{margin-top:4px}
/* sheets 05, 06 */
.dwgf{margin:0}
.k-dwg .dimt{font-size:9px}
.k-dwg .callt{font-size:8px}
.k-dwg .callt.sub{font-size:7.5px}
.trio{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.18in}
.page.k .trio figcaption{font-size:10.5px}
.ktwo{display:grid;grid-template-columns:3.9in 1fr;gap:.25in;align-items:start}
.ktwo.b{grid-template-columns:3.2in 1fr;align-items:start}
.ktwo.c{grid-template-columns:3.4in 1fr;align-items:start}
.page.k .body{font-size:13px}
/* sheet 07 */
.spec2{display:grid;grid-template-columns:1fr 1fr;gap:.3in}
.spec2 h4{font:500 8px/1.2 BzMono,monospace;letter-spacing:.16em;color:#fff;background:${T.draw};padding:5px 8px 4px;margin:0 0 9px}
.spec2 .cl+h4{margin-top:12px}
.spec2 .cl{display:grid;grid-template-columns:30px 1fr;margin-bottom:8px}
.page.k .spec2 .cl span{font-size:12.5px;line-height:1.5;color:#3a3637}
.spec2 .cl b{font:500 9px/1.9 BzMono,monospace;color:${T.flame}}
.kbox{border:.9px solid ${T.draw};padding:.14in .18in}
.kbox .eyebrow{margin-bottom:5px}
.page.k .kbox p:not(.eyebrow){font-size:13px}
/* sheet 08 */
.bim tr.pend td{background:#FDF3F1}
.bim th:nth-child(1){width:2.9in}.bim th:nth-child(4){width:.6in}
.svc{display:flex;flex-direction:column;gap:9px}
.page.k .svc .big{font-family:BzDidot,Didot,serif;font-size:22px;line-height:1.15;color:${T.ink}}
/* sheet 09 */
.kchecks{list-style:none;columns:2;column-gap:.3in;border-top:.9px solid ${T.draw};padding-top:4px}
.kchecks li{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:.5px solid ${T.hair};break-inside:avoid;font-size:13px}
.kchecks .kbx{flex:none;width:12px;height:12px;border:.9px solid ${T.draw};margin-top:4px}
/* sheet 10 */
.kcta{position:absolute;left:.42in;right:.42in;top:.42in;height:4.6in;background:${T.navy};display:grid;grid-template-columns:3.6in 1fr;overflow:hidden}
.kcta img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 50%}
.kcta-body{padding:.4in .4in;display:flex;flex-direction:column;justify-content:center;gap:10px}
.kcta h3{font-size:36px;line-height:1.1;color:#fff}
.page.k .kcta p{color:rgba(255,255,255,.85)}
.page.k .kcta .mono{color:${T.navyLine}}
.page.k .kcta .kbtn{align-self:flex-start;font:500 9px/1 BzMono,monospace;letter-spacing:.16em;text-transform:uppercase;color:#fff;background:${T.flame};padding:10px 14px;margin-top:6px}
.ksrc{position:absolute;left:.72in;right:.72in;top:5.35in;bottom:.98in;overflow:hidden}
.ksrc .eyebrow{margin-bottom:8px}
.ksrc ol{list-style:none;columns:2;column-gap:.3in}
.ksrc li{display:grid;grid-template-columns:14px 1fr;gap:5px;padding:3px 0;border-bottom:.5px solid ${T.hair};break-inside:avoid}
.page.k .ksrc li span{font-size:8.5px;line-height:1.4;color:${T.steel}}
.page.k .ksrc .ksn{font:500 8px/1.4 BzMono,monospace;color:${T.flame}}
.page.k .kdisc{font-size:8.5px;line-height:1.5;color:${T.steel};margin-top:12px}
`;

const html = page({ title: "The Architect's Spec Kit · Bromic Heating", css, body: [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10].join('\n') });
await render({ dir: here, html, pdf: 'Bromic-A11-Architects-Spec-Kit.pdf', meta: { item_id: 'A11', theme: 'blueprint', title: "The Architect's Spec Kit" } });
