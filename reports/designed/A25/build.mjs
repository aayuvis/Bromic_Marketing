// A25 Growing Your Outdoor Heating Work (electrical contractor guide) — the whole document in the Blueprint theme.
// Every word, number and fact comes from content/sales/A25-electrical-contractor-guide.md (cut and restructured,
// never added to); its [[VERIFY]] items are left out or shown "To confirm". Run: node reports/designed/A25/build.mjs
// Shares the Blueprint kit and the print check with A11 (reports/designed/A11/kit/).
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { T, ROOT, TC, sup, zones, sheet, coverBlock, fig, plate, sourcesList, page, sectionAA, controls } from '../A11/kit/blueprint.mjs';
import { prepImages, render } from '../A11/kit/render.mjs';

const here = dirname(fileURLToPath(import.meta.url));
prepImages(here, {
  hero: 'images/library/d-tungsten-suspended-restaurant.webp',
  installers: 'images/library/d-installers-recessing.webp',
  louvre: 'images/library/d-tungsten-louvre-detail.webp',
  pavilion: 'images/library/d-recessed-pavilion.webp',
  rooftop: 'images/library/d-tungsten-pole-rooftop-bar.webp',
  lake: 'images/library/d-eclipse-freestanding-lake.webp',
  pendant: 'images/library/d-eclipse-pendant-dining.webp',
  pool: 'images/library/d-tungsten-gas-pool.webp',
  tablet: 'images/library/t-009-025.webp',
  terrace: 'images/library/d-tungsten-ceiling-pool-terrace.webp',
});
const IMG = (k) => `img/${k}.jpg`;

const DOC = { project: 'Growing Your Outdoor Heating Work', asset: 'A25', date: '2026-11-16', revision: 'Draft for review', total: 8 };
const NOTES = 'For electrical contractors. US: NFPA 70 (NEC) as adopted locally. Superscripts: sources, sheet 08.';

// ------------------------------------------------------------------ sheet 01: cover
const p1 = `<section class="page dark">
  <div class="grid"></div>${zones(true)}<div class="frame"></div>
  <header class="c-top blk">
    <img class="logo" src="${ROOT}/images/portfolio/bromic-logo-white.png" alt="Bromic Heating">
    <div class="c-meta"><span>SALES KIT · FOR ELECTRICAL CONTRACTORS</span><span>US · NFPA 70</span></div>
  </header>
  <div class="c-head blk cv-head">
    <p class="eyebrow">CODE · CONTROLS · WEATHER · THE QUOTE</p>
    <h1>Growing Your<br>Outdoor Heating<br>Work</h1>
    <p class="c-lede">Outdoor rooms have become part of the home, and the people who live in them want to stay out long after dark. The contractor who designs the circuit, connects the controls and hands over a system that works beautifully the first time is the one every builder, designer and homeowner calls again.</p>
  </div>
  <div class="x blk cv-ph">
    <figure class="plate"><div class="plate-img" style="height:3.0in;background-image:url(${IMG('hero')});background-position:50% 40%"></div>
    <figcaption><b>SITE PHOTO</b> A black Tungsten heater on suspension poles above a restaurant dining room that opens to the outdoors.</figcaption></figure>
  </div>
  <div class="x blk cv-idx index">
    <p class="lbl">CONTENTS · SHEET INDEX</p>
    <table>
      <tr><td>00</td><td>The work is already on the plan</td><td>Sheet 02</td></tr>
      <tr><td>01</td><td>Getting the code right from the start</td><td>Sheet 03</td></tr>
      <tr><td>02</td><td>Connecting to the systems your clients already have</td><td>Sheets 04–05</td></tr>
      <tr><td>03</td><td>Built for the weather, season after season</td><td>Sheet 05</td></tr>
      <tr><td>04</td><td>Making your quote the one they remember</td><td>Sheet 06</td></tr>
      <tr><td>05</td><td>The Bromic Partner Program</td><td>Sheets 07–08</td></tr>
    </table>
  </div>
  ${coverBlock(DOC)}
</section>`;

// ------------------------------------------------------------------ sheet 02: the work is on the plan
const bar = (pct, label, s, hi = false) => `<div class="bar${hi ? ' hi' : ''}">
  <div class="bl"><span class="bv">${pct}%</span><span class="bt">${label}${sup(s)}</span></div>
  <div class="track"><div class="fill" style="width:${pct}%"><i class="al"></i><i class="ar"></i></div></div>
</div>`;
const ruler = `<div class="ruler">${[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => `<span style="left:${v}%">${v}</span>`).join('')}</div>`;
const p2 = sheet(DOC, 2, {
  eyebrow: '00 · THE OPPORTUNITY',
  title: 'The Work Is Already On The Plan',
  lede: 'Raise heat at the first site walk and price the pre-wire with the patio, and the job is yours before anyone else is asked.',
  stripTitle: 'The Work Is On The Plan',
  notes: NOTES,
  body: `
  <div class="x blk s2-bars">
    <div class="lblr"><span class="lbl">THE GAP · SHARE OF HOMES, BUYERS AND HOMEOWNERS</span><span class="lbl r">PERCENT</span></div>
    ${bar(60.5, 'Single-family homes started in 2025 that came with a patio', 1)}
    ${bar(86, 'Buyers who rate a patio essential or desirable', 2)}
    ${bar(23, 'Homeowners who prioritise outdoor heating when they plan the space', 3, true)}
    ${ruler}
  </div>
  <div class="x blk s2-txt txt">
    <p>60.5% of single-family homes started in 2025 came with a patio,${sup(1)} and 86% of buyers rate a patio essential or desirable.${sup(2)} Far fewer homes come with the warmth to enjoy it once the sun goes down, because only 23% of homeowners prioritise outdoor heating when they plan the space.${sup(3)}</p>
    <p>You design the electrical system that powers the space, install it safely and keep it running efficiently for years. We make that easier, with the right heater for the space, the controls to run it and people who answer the phone when you have a question on site.</p>
  </div>
  <div class="x blk s2-pq"><p class="pullq">The right heater for the space, the controls to run it and people who answer the phone.</p></div>
  <div class="x blk s2-ph">${plate(IMG('installers'), 'Two installers fitting a recessed heater into a timber-lined ceiling.', '3.9in', '50% 30%')}</div>
  `,
});

// ------------------------------------------------------------------ sheet 03: code
const p3 = sheet(DOC, 3, {
  eyebrow: '01 · THE CODE',
  title: 'Getting The Code Right From The Start',
  lede: 'A job that passes inspection the first time is the job that earns the next referral. Bromic electric heaters are installed to ANSI/NFPA 70, the National Electrical Code, as your state and city adopt it.' + sup(4, 11),
  stripTitle: 'Getting The Code Right',
  notes: NOTES,
  body: `
  <div class="x blk s3-trip">
    <p class="lbl lblr"><span>GETTING IT RIGHT THE FIRST TIME</span><span class="r">WHAT TRIPS UP AN OUTDOOR JOB</span></p>
    <ol class="num">
      <li>Heaters fed from a shared circuit instead of their own, so the breaker trips on the first cold night.</li>
      <li>Cable runs left unprotected where a patio will see heavy use.</li>
      <li>Heaters mounted below the minimum height. Bromic's guidance is at least 72 in above the floor for a wall mount and at least 96 in for a ceiling mount; it varies with output, so take the figure from the installation manual for the model.${sup(4)}</li>
      <li>Supply voltage left unchecked against the heater. A 240 V heater on a 208 V supply gives less heat than the client was promised.</li>
      <li>Controls left until the end, with no box or cable run planned for them.</li>
    </ol>
    <p class="s3-cost">A job that misses the code costs you twice, first in red tags, stop-work orders and repeat visits, and then in the referral that never comes.</p>
  </div>
  <div class="x blk s3-dwg">${fig(sectionAA, 'A', 'SECTION A–A · MOUNTING HEIGHTS', 'GUIDANCE MINIMUMS · VARIES WITH OUTPUT · TAKE THE FIGURE FROM THE MANUAL')}</div>
  <div class="x blk s3-help">
    <p class="lbl lblr"><span>HOW WE HELP YOU GET IT RIGHT</span></p>
    <ul class="bul">
      <li><b>A free heating design plan</b> for every project, with heater selection and positions on the client's plan, coverage, and a parts and controls list you can price from.${sup(7, 10)}</li>
      <li><b>Installation manuals and CAD and Revit/BIM files</b> for every heater, from the technical resources page.${sup(10)}</li>
      <li><b>Technical support</b> from people who know the products, on 1-800-301-1293, Monday to Friday, 9 am to 4 pm Pacific.${sup(7)}</li>
      <li><b>The pre-wire guide</b> (A16), covering circuits, boxes, blocking, recess openings and control runs for every heater type, with a hand-off sheet.</li>
    </ul>
  </div>
  <div class="x blk s3-ph">${plate(IMG('louvre'), 'A black Tungsten heater glowing beneath a louvred pergola roof.', '2.55in', '45% 50%')}</div>
  <div class="x blk s3-code boxnote"><p class="lbl">CODES VARY BY LOCATION</p>
    <p>Confirm every installation with the local building authority and the authority having jurisdiction; electrical work must be carried out by a licensed electrician. The primary source is NFPA 70 as adopted locally.${sup(11)}</p></div>
  `,
});

// ------------------------------------------------------------------ sheet 04: connecting, controls
const ctl = [
  ['Affinity Smart-Heat On/Off controller', 'Switches heaters on and off by zone, by app or wall switch.', '6 kW per channel at 208–277 V; IP54 enclosure.', 6],
  ['Affinity Smart-Heat Dimmer controller', 'Sets heat output by zone, so owners turn it down on mild nights.', '6 kW per channel at 208–277 V.', 6],
  ['Affinity Eclipse controller', 'Runs Eclipse heat and rim lighting.', 'One Eclipse heater per channel.', 6],
  ['Manual wall switch', 'Local on and off, single or dual.', '20 A, 120–277 V; indoor or outdoor kit.', 6],
  ['Bromic Smart-Heat app', 'Zones, schedules and timers from a phone.', 'Wi-Fi coverage at the controller.', 7],
  ['Affinity expansion board', 'Ethernet and 0–10 V for a building management or home automation system.', 'Built into the 5-channel controller; BMS mode turns off the app.', 6],
];
const p4 = sheet(DOC, 4, {
  eyebrow: '02 · SUPPLY AND CONTROLS',
  title: 'Connecting To The Systems Your Clients Already Have',
  lede: 'On most outdoor jobs, the real craft lies in fitting new equipment into the electrical system and the smart home the client already has. Bromic heaters and Affinity Smart-Heat Controls are engineered to make that part straightforward.',
  stripTitle: 'Supply And Controls',
  notes: NOTES,
  body: `
  <div class="x blk s4-sup">
    <p class="lbl lblr"><span>ENGINEERED FOR THE SUPPLY YOU HAVE</span><span class="r">MATCH AT DESIGN STAGE</span></p>
    <table class="kv volt"><thead><tr><th>HEATER</th><th>208 V</th><th>220–240 V</th><th>277 V</th></tr></thead><tbody>
      <tr><td><b>Tungsten Smart-Heat<sup>®</sup> Electric</b></td><td class="dot">●</td><td class="dot">●</td><td class="code">4000 W, 6000 W</td></tr>
      <tr><td><b>Commercial projects</b></td><td class="dot">●</td><td class="code">240 V</td><td class="dot">●</td></tr>
    </tbody></table>
    <p class="fn">Tungsten Smart-Heat<sup>®</sup> Electric runs on 220–240 V and 208 V, and the 4000 W and 6000 W models also run on 277 V, the commercial supply many restaurants and hotels have.${sup(5)} Commercial projects can choose 208 V, 240 V or 277 V supply.${sup(7)} Match the heater to the supply at the design stage, well before the day of install.</p>
  </div>
  <div class="x blk s4-two boxnote"><p class="lbl">TWO ELEMENTS, ONE CIRCUIT</p>
    <p>The 4000 W and 6000 W Tungsten heaters have two elements that can be controlled separately, so one heater can run at part output on a dimmer channel without a second circuit.${sup(5)}</p></div>
  <div class="x blk sched s4-ctl">
    <div class="hdr"><span class="lbl">RECOMMENDED CONTROLS &amp; ACCESSORIES · AFFINITY SMART-HEAT<sup>®</sup></span><span class="lbl r">EVERY HEATER IS PAIRED WITH ITS CONTROLS</span></div>
    <table class="eq"><colgroup><col style="width:32px"><col style="width:160px"><col><col style="width:200px"></colgroup>
      <thead><tr><th>TAG</th><th>CONTROL</th><th>WHAT IT DOES</th><th>PLAN FOR</th></tr></thead>
      <tbody>${ctl.map(([n, d, p, s], i) => `<tr><td class="tag"><span>C${i + 1}</span></td><td class="ser">${n}</td><td>${d}</td><td class="m">${p}${sup(s)}</td></tr>`).join('')}</tbody>
    </table>
    <p class="fn">Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately. The controls connect to Amazon Alexa and Google Assistant, and to Control4, Crestron and Lutron systems; compatibility varies by system and may need extra integration hardware or configuration.${sup(7)} The controllers are certified to UL 60730-1 and CAN/CSA E60730-1.${sup(6)} Compatibility of each controller with each Platinum and Tungsten wattage and voltage: ${TC}</p>
  </div>
  <div class="x blk s4-dwg">${fig(controls, 'C', 'CONTROL ZONING · TYPICAL', 'ONE CONTROLLER CHANNEL AND ONE WALL SWITCH (WS) PER ZONE · APP OVER WI-FI')}</div>
  <div class="x blk s4-pq"><p class="pullq">The warmth is always exactly where, and when, your client wants it.</p></div>
  `,
});

// ------------------------------------------------------------------ sheet 05: checklist, weather, warranty
const pre = [
  'Supply voltage confirmed for every heater (208, 240 or 277 V).',
  'One dedicated circuit per heater or per controller channel, sized from the installation manual and the code.',
  'Controller location chosen: dry, reachable, inside Wi-Fi range if the app is used.',
  'Box and cable run to every wall switch.',
  `Recess framing or suspension pole fixing agreed with the builder.${sup(4)}`,
  'Integration with the home or building system confirmed with the integrator.',
];
const p5 = sheet(DOC, 5, {
  eyebrow: '02 · BEFORE ROUGH-IN &nbsp;·&nbsp; 03 · THE WEATHER',
  title: 'Built For The Weather, Season After Season',
  lede: 'Outdoor equipment lives with rain, salt air, wind and the long swing from summer to winter. A heater that fails in its second season costs you a callback and a client, so we build ours to last.',
  stripTitle: 'Rough-In, Weather, Warranty',
  notes: NOTES,
  body: `
  <div class="x blk s5-cl">
    <p class="lbl lblr"><span>YOUR CHECKLIST BEFORE ROUGH-IN</span></p>
    <ol class="checks">${pre.map((c, i) => `<li><span class="bx"></span><span class="no">${String(i + 1).padStart(2, '0')}</span><span>${c}</span></li>`).join('')}</ol>
  </div>
  <div class="x blk s5-ph">${plate(IMG('pavilion'), 'Heaters recessed in the roof of an open timber pavilion above a long dining table.', '2.05in', '50% 50%')}</div>
  <div class="x blk sched s5-ip">
    <div class="hdr"><span class="lbl">RATINGS SCHEDULE · BUILT FOR THE WEATHER</span><span class="lbl r">RATINGS AND MATERIALS</span></div>
    <table class="eq"><colgroup><col style="width:32px"><col style="width:190px"><col style="width:120px"><col></colgroup>
      <thead><tr><th>TAG</th><th>PRODUCT</th><th>RATING</th><th>NOTES</th></tr></thead>
      <tbody>
        <tr><td class="tag"><span>H1</span></td><td class="ser">Tungsten Smart-Heat<sup>®</sup> Electric</td><td class="m">IPX4</td><td>Rated against splashing water.${sup(5)}</td></tr>
        <tr><td class="tag"><span>H2</span></td><td class="ser">Platinum Smart-Heat<sup>®</sup> Electric Marine</td><td class="m">IPX5 · AISI 316</td><td>Marine-grade stainless steel; Lloyd's Register approval for marine use. The heater to specify within reach of the coast.${sup(8)}</td></tr>
        <tr><td class="tag"><span>H3</span></td><td class="ser">Tungsten Coastal · Tungsten Select</td><td class="m">${TC}</td><td>Available now, launched in October 2026. Ask your Bromic contact for their ratings before you specify them.</td></tr>
        <tr><td class="tag"><span>C1</span></td><td class="ser">Affinity Smart-Heat<sup>®</sup> On/Off controller</td><td class="m">IP54</td><td>Enclosure rating.${sup(6)}</td></tr>
      </tbody>
    </table>
  </div>
  <div class="x blk s5-war">
    <p class="lbl lblr"><span>A WARRANTY YOU CAN QUOTE WITH CONFIDENCE</span></p>
    <p class="w">Bromic publishes its warranty by product line.${sup(9)} Partners receive an additional year of warranty coverage on qualifying products.${sup(10)} Your clients deal with one manufacturer, one warranty process and one support line for the whole job.</p>
    <p class="fn">Warranty periods by product line, and which products qualify for the Partner Program's extra year: ${TC}</p>
  </div>
  <div class="x blk s5-ph2">${plate(IMG('rooftop'), 'Pole-mounted Tungsten heaters above high bar tables on a rooftop at night.', '2.55in', '50% 50%')}</div>
  `,
});

// ------------------------------------------------------------------ sheet 06: the quote
const quote = [
  ['Send a heating plan with the quote.', `A Bromic design plan shows where each heater goes and the space it warms, turning a line item into a picture of the evening ahead.${sup(10)}`],
  ['Quote the complete system.', 'Heaters, controllers, wall switch and app set-up belong in one price, because a heater is a finished job once its controls are in, and the client feels the difference on the first cold night.'],
  ['Offer the pre-wire on every patio.', 'Rough-in at framing costs far less than opening a finished soffit later, and it lets the owner add heat after they move in.'],
  ['Talk about safety plainly.', 'Dedicated circuits, the right mounting height and outdoor-rated controls build confidence, and clients trust the contractor who explains why.'],
  ['Show it working.', 'A heated patio at dusk sells the next one. Ask to photograph the finished job; as a Bromic partner you can have projects featured.'],
];
const p6 = sheet(DOC, 6, {
  eyebrow: '04 · THE QUOTE',
  title: 'Making Your Quote The One They Remember',
  lede: 'Clients compare quotes, and most look alike, with a heater, a price and a date. With a little more care, yours stays in their mind.',
  stripTitle: 'Making Your Quote',
  notes: NOTES,
  body: `
  <div class="x blk s6-ph">${plate(IMG('pendant'), 'Two Eclipse pendant heaters above an outdoor dining table at dusk.', '3.05in', '50% 45%')}</div>
  <div class="x blk s6-list">
    ${quote.map(([h, t], i) => `<div class="q"><span class="bubble">${i + 1}</span><div><h3>${h}</h3><p>${t}</p></div></div>`).join('')}
  </div>
  <div class="x blk s6-more">
    <p class="lbl lblr"><span>ROOM FOR OUTDOOR HEAT IN THE WORK YOU ALREADY DO</span></p>
    <div class="tags"><span>New homes</span><span>Remodels</span><span>Commercial fit-outs</span><span>Smart-home installs</span><span>Service work</span></div>
  </div>
  <div class="x blk s6-ph2">${plate(IMG('lake'), 'An Eclipse freestanding heater arcing over a sofa on a lakeside terrace.', '1.6in', '50% 50%')}</div>
  <div class="x blk s6-ph3">${plate(IMG('pool'), 'A Tungsten freestanding gas heater beside a poolside sofa.', '1.6in', '50% 40%')}</div>
  `,
});

// ------------------------------------------------------------------ sheet 07: partner program
const ben = [
  ['Exclusive Partner Pricing', 'Trade pricing on Bromic heaters and controls.'],
  ['Expert Product Recommendations', 'The right heater, wattage, voltage and controls for each space, from people who know the range inside out.'],
  ['Free Custom Heating Design Plans', "Heater positions and coverage drawn on your client's plan, with a parts and controls list to price from."],
  ['Extended Warranty', 'An additional year of warranty coverage on qualifying products.'],
  ['Dedicated Point Of Contact', 'One named Bromic contact for your projects.'],
  ['Project Coverage &amp; Marketing Spotlights', 'Your finished projects can be featured in Bromic case studies and marketing.'],
];
const p7 = sheet(DOC, 7, {
  eyebrow: '05 · THE BROMIC PARTNER PROGRAM',
  title: 'You Create Beautiful Spaces. We Know How To Heat Them.',
  lede: 'Together, we help your clients enjoy them all season long. The Bromic Partner Program gives trade professionals who specify, design, build or install outdoor spaces exclusive benefits and dedicated support.' + sup(10),
  stripTitle: 'The Bromic Partner Program',
  notes: 'Benefits as published on the Bromic Partner Program trade page. A reseller certificate is required to join the Bromic installer program.',
  body: `
  <div class="x blk s7-grid">
    ${ben.map(([h, t], i) => `<div class="ben"><div class="bh"><span class="bubble">${String(i + 1).padStart(2, '0')}</span><span class="lbl">BENEFIT</span></div><h3>${h}</h3><p>${t}</p></div>`).join('')}
  </div>
  <div class="x blk s7-inst">
    <div><p class="lbl">INSTALLER PROGRAM<span class="ast">*</span></p><p>Partners who install Bromic heaters can also join the Bromic installer program. Installer program benefits and how to apply: ${TC}</p></div>
    <div><p class="lbl">HOW TO JOIN</p><p>Register your project and meet your Bromic rep at <b>bromic.com/lp-builders</b>, or call <b style="white-space:nowrap">1-800-301-1293</b>.${sup(10, 7)}</p></div>
    <p class="foot">* A reseller certificate is required to join the Bromic installer program.</p>
  </div>
  <div class="x blk s7-ph">${plate(IMG('terrace'), 'Black linear electric heaters under the timber soffit of a covered pool terrace.', '3.05in', '50% 40%')}</div>
  `,
});

// ------------------------------------------------------------------ sheet 08: back cover — next step and sources
const SOURCES = [
  'National Association of Home Builders (Eye on Housing). <i>Share of new homes with patios dips to a six-year low</i>. 2026. <span class="u">eyeonhousing.org</span>',
  'National Association of Home Builders (Eye on Housing). <i>Outdoor features, a laundry room among most wanted features (What Home Buyers Really Want, 2024 edition)</i>. 2024. <span class="u">eyeonhousing.org</span>',
  'Bromic Heating / Atomik Research. <i>Outdoor Living Trends 2026 (US Homeowner Survey)</i>. 2026.',
  'Bromic Heating. <i>The Official Outdoor Heating Planning Guide, US v1.2</i>. 2021.',
  'Bromic Heating. <i>Tungsten Smart-Heat Electric product page</i>. 2026. <span class="u">bromic.com</span>',
  'Bromic Heating. <i>Affinity Smart-Heat controllers, manual wall switch and expansion board product pages</i>. 2026. <span class="u">bromic.com</span>',
  'Bromic Heating. <i>Lookbook 2026</i>. 2026.',
  'Bromic Heating. <i>Platinum Smart-Heat Electric Marine product page</i>. 2026. <span class="u">bromic.com</span>',
  'Bromic Heating. <i>Warranty</i>. 2026. <span class="u">bromic.com/warranty</span>',
  'Bromic Heating. <i>The Bromic Partner Program (trade landing page)</i>. 2026. <span class="u">bromic.com/lp-builders</span>',
  'National Fire Protection Association. <i>NFPA 70, National Electrical Code</i>. 2026. <span class="u">nfpa.org</span>',
];
const p8 = `<section class="page dark">
  <div class="grid"></div>${zones(true)}<div class="frame"></div>
  <header class="c-top blk">
    <img class="logo" src="${ROOT}/images/portfolio/bromic-logo-white.png" alt="Bromic Heating">
    <div class="c-meta"><span>YOUR NEXT STEP</span><span>BROMIC PARTNER PROGRAM</span></div>
  </header>
  <div class="x blk bk-cta">
    <p class="eyebrow">JOIN THE PROGRAM · REGISTER YOUR NEXT PROJECT</p>
    <h2>Join the Bromic Partner Program and register your next project, and we will send you a heating design plan for it.</h2>
    <a class="btn">JOIN THE BROMIC PARTNER PROGRAM <span>→</span></a>
    <p class="addr">BROMIC.COM/LP-BUILDERS · 1-800-301-1293<br>TECHNICAL SUPPORT MONDAY TO FRIDAY, 9 AM TO 4 PM PACIFIC</p>
  </div>
  <div class="x blk bk-ph">${plate(IMG('tablet'), 'A hand holding a tablet to set the warmth at an outdoor table.', '2.95in', '50% 40%')}</div>
  <div class="x blk bk-src">
    <p class="lbl lblr"><span>SOURCES</span></p>
    ${sourcesList(SOURCES)}
  </div>
  <p class="x blk bk-disc">Codes vary by location. Confirm every installation with the local building authority and the authority having jurisdiction; electrical work must be carried out by a licensed electrician.</p>
  <div class="tblock">
    <div class="r"><b>PROJECT</b><span>${DOC.project}</span></div>
    <div class="r two"><div><b>ASSET</b><span>${DOC.asset}</span></div><div><b>SCALE</b><span>NTS</span></div><div><b>DATE</b><span>${DOC.date}</span></div></div>
    <div class="r two"><div><b>REVISION</b><span>${DOC.revision}</span></div><div class="sh"><b>SHEET</b><span>08<i>/08</i></span></div></div>
  </div>
</section>`;

const css = `
.tcf{text-indent:0}
/* cover */
.cv-head{top:1.85in;width:6.6in}
.cv-head h1{font-size:54px;line-height:1.02}
.cv-head .c-lede{max-width:5.2in}
.cv-ph{left:.72in;width:4.3in;top:5.0in}
.cv-ph .plate figcaption{color:${T.navyLine}}
.cv-idx{left:5.3in;right:.72in;top:5.0in}
.cv-idx td:nth-child(2){font-size:8px;line-height:1.35;padding-right:8px}
.cv-idx td:last-child{font:400 6.6px BzMono,monospace;letter-spacing:.06em;color:${T.navyLine};text-transform:none}
/* sheet 2 */
.s2-bars{left:.72in;right:.72in;top:1.95in}
.bar{display:grid;grid-template-columns:2.25in 1fr;gap:.2in;align-items:center;padding:9px 0;border-bottom:.5px solid ${T.hair}}
.bl{display:flex;align-items:baseline;gap:10px}
.bv{font-family:BzDidot,Didot,serif;font-size:30px;line-height:1;color:${T.ink};min-width:.95in}
.bt{font-size:7.8px;line-height:1.4;color:#3a3637}
.track{position:relative;height:18px;border-left:.8px solid ${T.draw};border-right:.8px solid ${T.hair};background-image:linear-gradient(90deg,${T.hair} .6px,transparent .6px);background-size:10% 100%}
.fill{position:absolute;left:0;top:5px;height:8px;background:repeating-linear-gradient(45deg,${T.draw} 0 .7px,transparent .7px 4px);border:.8px solid ${T.draw}}
.bar.hi .fill{border-color:${T.flame};background:repeating-linear-gradient(45deg,${T.flame} 0 .7px,transparent .7px 4px)}
.bar.hi .bv{color:${T.flame}}
.ruler{position:relative;margin-left:2.45in;height:14px;font:500 5.8px BzMono,monospace;color:${T.steel};letter-spacing:.06em}
.ruler span{position:absolute;top:4px;transform:translateX(-50%)}
.s2-txt{left:.72in;top:4.62in;width:3.5in}
.s2-txt p{font-size:9.2px;line-height:1.6}
.s2-pq{left:.72in;top:8.3in;width:3.4in}
.s2-ph{left:4.5in;right:.72in;top:4.62in}
/* sheet 3 */
.s3-trip{left:.72in;top:2.05in;width:3.65in}
.s3-trip .num li{font-size:8.6px}
.s3-cost{font-size:8.4px;line-height:1.55;color:#3a3637;border-left:.8px solid ${T.flame};padding-left:9px;margin-top:4px}
.s3-dwg{left:.72in;top:4.8in;width:4.05in}
.s3-help{left:4.62in;right:.72in;top:2.05in}
.s3-help .bul li{font-size:8.6px}
.s3-ph{left:5.05in;right:.72in;top:4.8in}
.s3-code{left:.72in;right:.72in;top:8.3in}
.s3-code p:not(.lbl){font-size:8.4px}
/* sheet 4 */
.s4-sup{left:.72in;top:2.12in;width:4.1in}
.volt td.dot{color:${T.draw};font-size:8px}
.volt th:not(:first-child),.volt td:not(:first-child){text-align:center}
.s4-two{left:5.1in;right:.72in;top:2.12in}
.s4-ctl{left:.72in;right:.72in;top:3.95in}
.s4-ctl table{font-size:7.8px}
.s4-dwg{left:.72in;top:7.0in;width:4.05in}
.s4-pq{left:5.1in;right:.72in;top:7.4in}
/* sheet 5 */
.s5-cl{left:.72in;top:2.05in;width:3.65in}
.s5-cl .checks{border-top:0}
.s5-cl .checks li{font-size:8.4px}
.s5-ph{left:4.62in;right:.72in;top:2.05in}
.s5-ip{left:.72in;right:.72in;top:4.75in}
.s5-ip table{font-size:7.9px}
.s5-war{left:.72in;top:6.6in;width:3.65in}
.s5-war .w{font-size:8.6px;line-height:1.55;color:#3a3637}
.s5-war .fn{margin-top:7px}
.s5-ph2{left:4.62in;right:.72in;top:6.6in}
/* sheet 6 */
.s6-ph{left:.72in;right:.72in;top:1.8in}
.s6-list{left:.72in;top:5.62in;width:3.95in}
.s6-list .q{display:grid;grid-template-columns:30px 1fr;gap:6px;padding:7px 0;border-top:.5px solid ${T.hair}}
.s6-list .q:first-child{border-top:.9px solid ${T.draw}}
.s6-list .bubble{color:${T.draw}}
.s6-list h3{font-size:14px;line-height:1.15;color:${T.ink};margin-bottom:3px}
.s6-list p{font-size:8.2px;line-height:1.5;color:#3a3637}
.s6-more{left:4.95in;right:.72in;top:5.62in}
.tags{display:flex;flex-wrap:wrap;gap:5px}
.tags span{font:500 6.4px/1 BzMono,monospace;letter-spacing:.12em;text-transform:uppercase;color:${T.draw};border:.7px solid ${T.draw};padding:5px 6px}
.s6-ph2{left:4.95in;right:.72in;top:6.6in}
.s6-ph2 .plate-img,.s6-ph3 .plate-img{height:1.05in !important}
.s6-ph3{left:4.95in;right:.72in;top:8.18in}
/* sheet 7 */
.s7-grid{left:.72in;right:.72in;top:2.28in;display:grid;grid-template-columns:repeat(3,1fr);gap:0 .26in}
.ben{border-top:.9px solid ${T.draw};padding:9px 0 16px}
.ben .bh{display:flex;align-items:center;gap:8px;color:${T.draw}}
.ben .bh .lbl{color:${T.flame}}
.ben h3{font-size:17px;line-height:1.12;color:${T.ink};margin:9px 0 6px;min-height:38px}
.ben p{font-size:8.4px;line-height:1.55;color:#3a3637}
.s7-inst{left:.72in;right:.72in;top:5.0in;display:grid;grid-template-columns:1fr 1fr;gap:.26in}
.s7-inst>div{border-top:.9px solid ${T.draw};padding-top:8px}
.s7-inst .lbl{color:${T.flame};margin-bottom:6px}
.s7-inst .ast{color:${T.flame};margin-left:2px}
.s7-inst p:not(.lbl){font-size:8.4px;line-height:1.55;color:#3a3637}
.s7-inst p.foot{grid-column:1 / -1;font:400 6.6px/1.5 BzMono,monospace;color:${T.steel};letter-spacing:.02em}
.s7-ph{left:.72in;right:.72in;top:6.2in}
.page.light .s-head h2{max-width:6.9in}
/* back cover */
.bk-cta{left:.72in;width:4.3in;top:1.9in}
.bk-cta h2{font-size:30px;line-height:1.16;color:#fff;margin:12px 0 18px}
.bk-cta .btn{display:inline-flex}
.bk-ph{left:5.3in;right:.72in;top:1.9in}
.bk-ph .plate figcaption{color:${T.navyLine}}
.bk-src{left:.72in;width:4.4in;top:5.75in}
.bk-src .lblr{border-color:rgba(201,214,232,.6)}
.dark .srcs li{color:${T.navyLine};border-color:rgba(201,214,232,.22)}
.dark .srcs .u{color:#8E9BB0}
.bk-disc{left:5.3in;right:.72in;top:5.82in;font-size:7px;line-height:1.55;color:${T.navyLine}}
`;

const html = page({ title: 'Growing Your Outdoor Heating Work · Bromic Heating', css, body: [p1, p2, p3, p4, p5, p6, p7, p8].join('\n') });
await render({ dir: here, html, pdf: 'Bromic-A25-Growing-Your-Outdoor-Heating-Work.pdf', meta: { item_id: 'A25', theme: 'blueprint', title: 'Growing Your Outdoor Heating Work' } });
