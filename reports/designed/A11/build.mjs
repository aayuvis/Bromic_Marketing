// A11 The Architect's Spec Kit, designed edition: "Blueprint, lighter" (owner, 22 Nov 2026: the spec kits were too dense
// and imageless; controls only as far as needed to specify them). One idea a page, photo-led, body type 10.5 pt.
// Words and facts come from content/kits/A11-spec-kit.md and data/product-facts.json (cut, never added to); the CAD/BIM
// table comes from bromic.com/revit-bim-files (data/site-inventory.json, read 29 Oct 2026). [[VERIFY]] items are left out
// or shown "To confirm". The shared kit (./kit/) is used read-only: every A11-only style is scoped under .page.k.
// Run: node reports/designed/A11/build.mjs
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rmSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { T, ROOT, zones, coverBlock, page, dimV, dimH, lead, slab, timber, plan } from './kit/blueprint.mjs';
import { prepImages, render } from './kit/render.mjs';

const here = dirname(fileURLToPath(import.meta.url));
rmSync(join(here, 'img'), { recursive: true, force: true });
const R = 'decks/product-renders/';
prepImages(here, {
  cover: 'images/library/w-platinum-electric-white-recessed-residential-4.webp',
  convection: 'reports/planning-guide/pro/img/aia-convection.webp',
  conduction: 'reports/planning-guide/pro/img/aia-conduction.webp@0,0.06,1,0.95',
  radiant: 'reports/planning-guide/pro/img/aia-radiant.webp',
  centrico: 'images/library/w-centrico-case-study.webp',
  gasplan: 'images/library/w-plat-gas-graphics.webp',
  portplan: 'images/library/w-tung-portable-graphics.webp',
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
  stone: 'images/library/l-013-104.webp',
  family: 'images/library/w-australia-sydney-greenwich-residence-1-cropp.webp',
  platclose: 'images/library/w-black-platinum-electric-close-up.webp',
  rim: 'images/library/l-013-106.webp',
  marine: 'images/library/w-bromic-heating-marine-platinum-electric-lady.webp',
  plgas: 'images/library/w-bromic-pg-residential-hr.webp',
  harbour: 'images/library/w-bromic-platinum-electric-marine-patio-heater.webp',
  dimmer: 'images/library/w-affinity-dimmer-2ch-2.webp',
  onoff: 'images/library/w-affinity-onoff.webp',
  design: 'images/library/l-022-201.webp',
  pavilion: 'images/library/d-recessed-pavilion.webp',
  dining: 'images/library/l-013-100.webp',
});
// A11 keeps its own photos lighter than the kit's 2000 px ceiling so fourteen photo-led sheets stay under 6 MB.
const SMALL = ['convection', 'conduction', 'radiant', 'gasplan', 'portplan', 'stone', 'harbour', 'platinum', 'marine', 'plgas', 'eclipse', 'freestanding', 'coastal', 'select', 'render', 'platclose', 'rim', 'dimmer', 'onoff', 'post', 'wall', 'pole', 'recesskit', 'flush', 'design', 'family'];
execFileSync('python3', ['-c', `import sys,glob,os\nfrom PIL import Image\nsmall=sys.argv[2].split(',')\nfor f in glob.glob(sys.argv[1]+'/*.jpg'):\n    m=720 if os.path.basename(f)[:-4] in small else 1100\n    im=Image.open(f)\n    if max(im.size)>m:\n        im.thumbnail((m,m),Image.LANCZOS); im.save(f,'JPEG',quality=82,optimize=True)`, join(here, 'img'), SMALL.join(',')]);
const IMG = (k) => `img/${k}.jpg`;

const DOC = { project: "The Architect's Spec Kit", asset: 'A11', date: '2026-11-22', revision: 'Draft for review', total: 14 };
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
  <figure class="kc-photo blk"><img src="${IMG('cover')}" alt="An outdoor room with four Platinum Smart-Heat Electric heaters recessed in a white coffered ceiling over a long dining table">
    <figcaption><b>SITE PHOTO</b> Platinum Smart-Heat Electric, four heaters recessed in a coffered ceiling over an outdoor dining room.</figcaption></figure>
  <div class="kc-head blk">
    <p class="eyebrow">ELECTRIC RADIANT HEATERS · SECTION 23 83 33</p>
    <h1>The Architect's<br>Spec Kit</h1>
    <p class="kc-sub">Everything you need to write outdoor heat into your drawings: the range by space, a clean equipment schedule, the details to draw and a guide specification.</p>
  </div>
  ${coverBlock(DOC)}
</section>`;

// ------------------------------------------------------------------ 02 why
const sect = (code, name, txt, hi = false) => `<div class="kmf-row${hi ? ' hi' : ''}"><p class="code">${code}</p><div><p class="nm">${name}</p><p>${txt}</p></div></div>`;
const p2 = sheet(4, 'Why specify heat early', {
  eyebrow: '03 · AT THE DRAWING STAGE',
  title: 'Give Heat Its Own Section',
  lede: 'The outdoor rooms you design are meant to be lived in well after sunset. Give heat a named section, a listed product, its controls and a detail on the drawings, and it arrives on site as you intended.',
}, `${ph('kitchen', '<b>SITE PHOTO</b> Platinum Smart-Heat Electric recessed in a timber-batten ceiling over an outdoor kitchen.', { h: '3.35in', pos: '50% 40%' })}
  <div class="kmf">
    ${sect('23 83 33', 'Electric Radiant Heaters · recommended', `A Bromic heater is a self-contained electric infrared emitter, so it sits most naturally here.${sup(3, 4)} Other manufacturers' outdoor guide specifications use it too.${sup(5)}`, true)}
    ${sect('23 82 39', 'Unit Heaters', `Convection units that move warm air. Outdoors, warm air rises and drifts away; radiant heat warms people and surfaces directly.${sup(7, 2)}`)}
    ${sect('23 55 23', 'Gas-Fired Radiant Heaters', `The home for Bromic gas heaters, written as a separate section.${sup(6)}`)}
  </div>
  <p class="note">Confirm section numbers against the MasterFormat edition your practice uses.</p>`);

// ------------------------------------------------------------------ 02 positioning heat with clients (owner, 22 Nov 2026)
const tp = (k, fam, line, fit = 'cover', pos = 'center') => `<figure class="ktp"><img src="${IMG(k)}" alt="${fam}" style="object-fit:${fit};object-position:${pos}">
  <figcaption><p class="tn">${fam}</p><p>${line}</p></figcaption></figure>`;
const pPos = sheet(2, 'Positioning heat with clients', {
  eyebrow: '01 · WITH YOUR CLIENTS',
  title: 'Positioning Outdoor Heat With Your Clients',
  lede: `Only 23% of homeowners prioritize outdoor heating at the planning stage.${sup(11)} Raise it in the first conversation, and heat goes into the drawing, the pre-wire and the first budget.`,
}, `<div class="ktwo c">
    ${ph('family', '<b>SITE PHOTO</b> Breakfast under recessed Platinum Smart-Heat Electric heaters.', { h: '2.35in', pos: '50% 40%' })}
    <div class="kexp"><p class="eyebrow">THE EXPERIENCE</p>
      <p>94% of homeowners say their outdoor space could be used more, and 67% say heating extends outdoor use.${sup(11)}</p>
      <p>Designed in, the heater sits flush in the soffit on its own circuit, controlled alongside the lights. Added later, it is bolted to the soffit and fed by surface conduit.</p></div>
  </div>
  <div class="kask"><p class="eyebrow">ASK YOUR CLIENT</p>
    <ul class="kq"><li>How and when will you use the space?</li><li>How many seats, seated or standing?</li><li>Roof, pergola or open sky?</li><li>Power or gas on site?</li><li>Should the heater be seen, or disappear?</li></ul></div>
  <div class="ktps">
    ${tp('render', 'Tungsten Smart-Heat Electric', `Slim, finished all over, and on a single post it seems to float. Recesses flush.${sup(14)}`, 'cover', '50% 50%')}
    ${tp('platclose', 'Platinum Smart-Heat Electric', `Heat you can feel, not see: a tinted glass-ceramic face keeps visible light low, just 2.1 in deep.${sup(12)}`, 'cover', '50% 50%')}
    ${tp('rim', 'Eclipse Smart-Heat Electric', `Warmth and light in one: a dimmable LED ring keeps the table warm and softly lit.${sup(13)}`, 'cover', '50% 50%')}
  </div>`);

// ------------------------------------------------------------------ 03 heating basics (owner, 22 Nov 2026)
const mode = (k, name, line, pos = 'center') => `<figure class="kmode"><img src="${IMG(k)}" alt="${name}" style="object-position:${pos}">
  <figcaption><p class="tn">${name}</p><p>${line}</p></figcaption></figure>`;
const pBasics = sheet(3, 'Heating basics', {
  eyebrow: '02 · HEATING BASICS',
  title: 'How Heat Moves Outdoors',
  lede: `Radiant (infrared) heat warms people and surfaces, not the air, so it holds up in light wind. Forced air does not work outdoors, and outdoor heat cannot be thermostatically controlled.${sup(2)}`,
}, `<div class="kmodes">
    ${mode('convection', 'Convection', 'Warms the air, which rises and drifts away outdoors.', '50% 60%')}
    ${mode('conduction', 'Conduction', 'Warms only what a guest touches.', '50% 50%')}
    ${mode('radiant', 'Radiant', 'Warms people and surfaces directly. The one that works outdoors.', '50% 40%')}
  </div>
  <p class="kcred">Images: Bromic AIA/CES course, The Evolution of Outdoor Heating.${sup(17)}</p>
  <div class="ktwo e">
    <div><p class="eyebrow">THREE WAVEBANDS</p>
      <div class="kwave"><p class="wn">Short wave</p><p>About 90% radiant; warms instantly.${sup(2)}</p></div>
      <div class="kwave hi"><p class="wn">Medium wave</p><p>About 60% radiant; warms in about 30 seconds.${sup(2)} Platinum, Eclipse and Tungsten Smart-Heat Electric are medium wave.${sup(20)}</p></div>
      <div class="kwave"><p class="wn">Long wave</p><p>About 40% radiant; about 5 minutes to warm, and the most wind-sensitive.${sup(2)}</p></div>
    </div>
    <div><p class="eyebrow">COVERAGE AND HEIGHT</p>
      <p>Coverage per heater is approximate and varies with model, mounting height, environment and installation.${sup(1)} Mounting higher widens the pattern and lowers the warmth at the seat; never mount below the minimums, 72 in on a wall and 96 in on a ceiling, varying with output.${sup(2)}</p>
      <p class="eyebrow sp">ELECTRIC OR GAS</p>
      <p>Electric dims with an Affinity Dimmer; mounted gas is on or off and is written in Section 23 55 23.${sup(16, 6)}</p>
    </div>
  </div>`);

// ------------------------------------------------------------------ 04 range by space
const tile = (k, name, line, pos = 'center') => `<figure class="tile"><img src="${IMG(k)}" alt="${name}" style="object-position:${pos}">
  <figcaption><p class="tn">${name}</p><p>${line}</p></figcaption></figure>`;
const p3 = sheet(5, 'The range by space', {
  eyebrow: '04 · THE RANGE BY SPACE',
  title: 'Start With How The Space Is Used',
  lede: 'A dining table needs even warmth at seated head height, a bar rail heat where guests stand, a lounge gentle warmth without glare.',
}, `<div class="tiles">
    ${tile('platinum', 'Platinum Smart-Heat Electric', 'Covered terraces, soffits and outdoor kitchens.', '50% 35%')}
    ${tile('marine', 'Platinum Electric Marine', `Yachts, ships and homes by the sea, in 316 marine-grade stainless.${sup(12)}`, '50% 45%')}
    ${tile('plgas', 'Platinum Smart-Heat Gas', `Natural gas or propane, where gas is on site. Section 23 55 23.${sup(15)}`, '20% 40%')}
    ${tile('eclipse', 'Eclipse Smart-Heat Electric', 'Pendant heat and light over dining and lounges.', '50% 40%')}
    ${tile('freestanding', 'Eclipse Smart-Heat Freestanding', 'Flexible lounge layouts, specified as FF&amp;E.', '50% 45%')}
    ${tile('coastal', 'Tungsten Coastal collection', 'Waterfront homes and venues, 316 marine-grade stainless.', '50% 30%')}
    ${tile('select', 'Tungsten Select collection', 'Design-led homes and hospitality, Black, White or Graphite.', '50% 40%')}
    <div class="tile test"><p class="eyebrow">THE OUTDOOR TEST</p><p class="big">At least 30% of the perimeter permanently open.</p>
      <p>A partial roof traps a heat cloud that adds a convective boost. Size for the open condition.${sup(2)}</p></div>
  </div>
  <p class="note">Tungsten Select and Coastal launched in October 2026; the Classic collection follows in January 2027.</p>`);

// ------------------------------------------------------------------ 06 plan the coverage (owner, 22 Nov 2026)
const pPlan = sheet(6, 'Plan the coverage', {
  eyebrow: '05 · PLAN THE COVERAGE',
  title: 'Plan The Coverage Over The Furniture',
  lede: `Draw each heater's approximate coverage over the furniture plan, zone by zone, and let Bromic's design team check it. Coverage varies with model, mounting height, environment and installation.${sup(1)}`,
}, `${ph('centrico', `<b>HEAT PLAN</b> Centrico, a circular restaurant pavilion: Bromic's heat plan over a photo of its Platinum Gas heaters.${sup(18)}`, { h: '3.05in', pos: '50% 50%' })}
  <div class="kplans">
    ${ph('gasplan', `<b>ILLUSTRATIVE</b> Coverage of two Platinum Gas sizes over tables and chairs.${sup(15)}`, { h: '2.1in', fit: 'contain', cls: 'onblack' })}
    ${ph('portplan', `<b>ILLUSTRATIVE</b> One Tungsten Freestanding Gas over six tables, about 16.5 by 13 ft.${sup(19)}`, { h: '2.1in', fit: 'contain', cls: 'green' })}
    <figure class="dwgf kplan">${plan}<figcaption><b>ILLUSTRATIVE</b> Electric heaters over a dining terrace in three zones; footprints approximate.</figcaption></figure>
  </div>
  <p class="body">Give seated, standing and lounge areas their own heaters and zone. Bromic's complimentary design service returns coverage drawings from your plans or photos.${sup(1)}</p>`);

// ------------------------------------------------------------------ 05 equipment schedule
const row = (s, out, mount, fin, cov, ctl) => `<tr><td class="ser">${s}</td><td>${out}</td><td>${mount}</td><td>${fin}</td><td class="n">${cov}</td><td>${ctl}</td></tr>`;
const p4 = sheet(7, 'Equipment schedule', {
  eyebrow: '06 · EQUIPMENT SCHEDULE',
  title: 'One Line For Each Heater',
  lede: `Coverage is approximate and varies with model, mounting height, environment and installation.${sup(1)}`,
}, `${ph('harbour', '<b>SITE PHOTO</b> Platinum Electric Marine recessed in a tray ceiling over a harbourfront living pavilion.', { h: '1.6in', pos: '50% 30%' })}
  <table class="eq">
    <thead><tr><th>Series</th><th>Output</th><th>Mounting</th><th>Finish</th><th>Coverage ft²</th><th>Affinity controller</th></tr></thead>
    <tbody>
    ${row('Platinum Electric', '2300, 3400 or 4500 W', 'Recessed, ceiling, wall', 'Black, White', '65–143', 'On/Off or Dimmer')}
    ${row('Platinum Electric Marine', '2300, 3400 or 4500 W', 'Recessed, ceiling, wall', '316 marine-grade stainless', '65–143', 'On/Off or Dimmer')}
    ${row('Platinum Gas', '23,600 or 39,800 BTU', 'Wall, ceiling, pole', 'Black, Stainless', '160–215', 'On/Off')}
    ${row('Eclipse Electric', '2900 W; steps 33, 66, 100%', 'Single pole 8, 24 or 48 in; double or curved pole', 'Black, dimmable LED ring', '121', 'Eclipse Controller or Eclipse Dimmer')}
    ${row('Eclipse Freestanding', '2900 W; steps 33, 66, 100%', 'Freestanding, wheels and weighted base', 'Black, dimmable LED ring', '121', 'Eclipse Dimmer, included')}
    ${row('Tungsten Coastal', `4 or 6 kW; 208 or 240 V${sup(14)}`, 'Low-clearance recess, ceiling, wall, single-post', 'Black, White; 316 stainless', '64–144', `Dimmer as standard, or On/Off${sup(14)}`)}
    ${row('Tungsten Select', `2, 3, 4 or 6 kW; 208, 240 or 277 V (2 kW: 240 V only)${sup(14)}`, 'Low-clearance recess, ceiling, wall, single-post', 'Black, White, Graphite', '64–144', `Dimmer as standard, or On/Off${sup(14)}`)}
    </tbody>
  </table>
  <p class="note">Every zone also takes a manual wall switch (sheet 08). Gas heaters are written in Section 23 55 23. Warranty: Platinum Electric and Eclipse 3 years; Marine 5 years on land, 3 on vessels; Tungsten Select and Coastal 3 years heater, 7 years elements; Platinum Gas 2 years, excluding hoses and igniters.${sup(10, 12, 13, 15)}</p>`);

// ------------------------------------------------------------------ 06 specifying the controls (owner, 22 Nov 2026)
const crow = (fam, ctl) => `<tr><td class="ser">${fam}</td><td>${ctl}</td><td>Manual wall switch</td></tr>`;
const pCtl = sheet(8, 'Specifying the controls', {
  eyebrow: '07 · CONTROLS',
  title: 'Specifying The Controls',
  lede: `Every heater is specified with its Affinity Smart-Heat controller and a manual wall switch. A heater without its controller is not a complete system.${sup(1)}`,
}, `<table class="eq kctlt">
    <thead><tr><th>Heater family</th><th>Controller to specify</th><th>Plus, each zone</th></tr></thead>
    <tbody>
    ${crow('Platinum Electric and Marine', `Affinity On/Off, or Affinity Dimmer for output in 1% steps${sup(16)}`)}
    ${crow('Tungsten Select and Coastal', `Affinity Dimmer as standard; On/Off where dimming is not wanted${sup(14)}`)}
    ${crow('Eclipse Electric', `Affinity Eclipse Controller, or Eclipse Dimmer Controller with remote${sup(13)}`)}
    ${crow('Eclipse Freestanding', `Eclipse Dimmer Controller and remote, included${sup(13)}`)}
    ${crow('Platinum Gas', `Affinity On/Off; on/off only${sup(15)}`)}
    </tbody>
  </table>
  <div class="ktwo d">
    <div class="kpair">
      ${ph('dimmer', '<b>PRODUCT</b> Affinity Dimmer.', { h: '1.75in', fit: 'contain', cls: 'studio' })}
      ${ph('onoff', '<b>PRODUCT</b> Affinity On/Off.', { h: '1.75in', fit: 'contain', cls: 'studio' })}
    </div>
    <ul class="kl">
      <li>The Bromic Smart-Heat app runs zones, schedules and timers. Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately.${sup(1)}</li>
      <li>Alexa, Google Assistant, Control4, Crestron, Lutron: compatibility varies by system.${sup(1)}</li>
      <li>Zones: one channel per circuit, sized by your electrical engineer.</li>
    </ul>
  </div>
  <div class="kbox"><p class="eyebrow">PASTE INTO YOUR SPECIFICATION</p>
    <p class="kpaste">Provide Affinity Smart-Heat® [On/Off] [Dimmer] [Eclipse] controller by Bromic Heating and a manual wall switch for each heater zone, as scheduled. Locate the wall switch where it is visible from the heated area. Wi-Fi and app features require compatible Affinity Smart-Heat Controls. Zone circuits as sized by the electrical engineer.</p></div>`);

// ------------------------------------------------------------------ 05 mounting and clearances
const p5 = sheet(9, 'Mounting and clearances', {
  eyebrow: '08 · MOUNTING AND CLEARANCES',
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
const p6 = sheet(10, 'Recess detail', {
  eyebrow: '09 · RECESS DETAIL',
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
const p7 = sheet(11, 'Guide specification', {
  eyebrow: '10 · GUIDE SPECIFICATION, CONDENSED',
  title: 'Section 23 83 33 Electric Radiant Heaters',
}, `${ph('stone', '<b>SITE PHOTO</b> Eclipse Smart-Heat Electric pendants in a resort loggia at dusk.', { h: '2.1in', pos: '50% 35%' })}
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
const p8 = sheet(12, 'CAD, BIM and design service', {
  eyebrow: '11 · CAD, BIM AND DESIGN SERVICE',
  title: 'Put The Heater In Your Model',
  lede: `Revit and CAD files are published by product and mounting. Download at <b style="white-space:nowrap">bromic.com/revit-bim-files</b>.${sup(9)}`,
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
const p9 = sheet(13, 'Planning checklist', {
  eyebrow: '12 · BEFORE YOU ISSUE',
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
  'Bromic Heating and Atomik Research, <i>Outdoor Living Trends 2026</i> (US homeowner survey), 2026.',
  'Bromic, Platinum Smart-Heat Electric and Electric Marine product pages, bromic.com, read 29 October 2026.',
  'Bromic, Eclipse Smart-Heat Electric and Freestanding product pages, bromic.com, read 29 October 2026.',
  'Bromic, Tungsten Smart-Heat Electric Series II launch deck, July 2026.',
  'Bromic, Platinum Smart-Heat Gas product page, bromic.com, read 29 October 2026.',
  'Bromic, Affinity Smart-Heat Controls product pages, bromic.com, read 29 October 2026.',
  'Bromic, <i>The Evolution of Outdoor Heating</i>, AIA/CES course AIA4041002 (course imagery), 2026.',
  'Bromic, Centrico case study, bromic.com, read 29 October 2026.',
  'Bromic, Tungsten Smart-Heat Freestanding product page, bromic.com, read 29 October 2026.',
  'Bromic, wavelength classification of Platinum, Eclipse and Tungsten Smart-Heat Electric, November 2026.',
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
  ${strip(14, 'Next step and sources')}
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
.tile img{display:block;width:100%;height:1.55in;object-fit:cover}
.tile figcaption{padding-top:8px}
.tile .tn,.ktp .tn{font-family:BzDidot,Didot,serif;font-size:17px;line-height:1.15;color:${T.ink};margin-bottom:4px}
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
/* positioning */
.kexp{display:flex;flex-direction:column;gap:9px}
.kask{border-top:.9px solid ${T.draw};padding-top:9px}
.kq{list-style:none;display:flex;flex-wrap:wrap;gap:6px 8px;margin-top:7px}
.page.k .kq li{font-size:12.5px;line-height:1.3;border:.7px solid ${T.hair};padding:5px 9px;color:${T.ink}}
.ktps{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.18in}
.ktp{margin:0}
.ktp img{display:block;width:100%;height:1.15in;background:#fff}
.ktp figcaption{padding-top:7px}
.page.k .ktp figcaption p:not(.tn){font-size:12px;line-height:1.45}
/* controls */
.kctlt th:nth-child(1){width:2.0in}.kctlt th:nth-child(3){width:1.45in}
.ktwo.d{grid-template-columns:3.3in 1fr;align-items:center}
.kpair{display:grid;grid-template-columns:1fr 1fr;gap:.12in}
.page.k .kpaste{font:400 11.5px/1.6 BzMono,monospace;color:${T.draw}}
/* heating basics */
.kmodes{display:grid;grid-template-columns:1fr 1fr 1.25fr;gap:.18in}
.kmode{margin:0}
.kmode img{display:block;width:100%;height:2.45in;object-fit:cover}
.kmode figcaption{padding-top:7px}
.kmode .tn{font-family:BzDidot,Didot,serif;font-size:18px;line-height:1.15;color:${T.ink};margin-bottom:3px}
.page.k .kmode figcaption p:not(.tn){font-size:12px;line-height:1.45}
.page.k .kcred{font-size:9.5px;color:${T.steel};margin-top:-8px}
.ktwo.e{grid-template-columns:1fr 1fr;gap:.3in}
.kwave{border-top:.5px solid ${T.hair};padding:7px 0}
.kwave .wn{font:500 8px/1.3 BzMono,monospace;letter-spacing:.14em;text-transform:uppercase;color:${T.ink};margin-bottom:2px}
.kwave.hi .wn{color:${T.flame}}
.page.k .kwave p:not(.wn){font-size:12.5px}
.page.k .ktwo.e p:not(.eyebrow):not(.wn){font-size:12.5px}
.page.k p.eyebrow.sp{margin-top:12px}
.ktwo.e .eyebrow{margin-bottom:6px}
/* plan the coverage */
.kplans{display:grid;grid-template-columns:1fr 1fr 1.15fr;gap:.18in;align-items:start}
.ph.onblack img{background:#000}
.ph.green img{background:#4E7A53}
.kplan .dwg{height:2.1in;width:100%}
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

const html = page({ title: "The Architect's Spec Kit · Bromic Heating", css, body: [p1, pPos, pBasics, p2, p3, pPlan, p4, pCtl, p5, p6, p7, p8, p9, p10].join('\n') });
await render({ dir: here, html, pdf: 'Bromic-A11-Architects-Spec-Kit.pdf', meta: { item_id: 'A11', theme: 'blueprint', title: "The Architect's Spec Kit" } });
// The gallery card: cover thumbnail 640 × 830, WebP q82, and its path in meta.json.
execFileSync('python3', ['-c', "import sys\nfrom PIL import Image\nImage.open(sys.argv[1]).convert('RGB').resize((640,830),Image.LANCZOS).save(sys.argv[2],'WEBP',quality=82)", join(here, 'pages/p01.png'), join(here, 'cover-thumb.webp')]);
const meta = JSON.parse(readFileSync(join(here, 'meta.json'), 'utf8'));
meta.thumb = 'reports/designed/A11/cover-thumb.webp';
writeFileSync(join(here, 'meta.json'), JSON.stringify(meta, null, 1) + '\n');
