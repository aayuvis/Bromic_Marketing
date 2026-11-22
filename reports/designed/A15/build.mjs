// A15 The Bromic Builder Program — the whole sales kit in the Editorial Lookbook theme.
// Every line of copy comes from content/sales/A15-builder-program.md (cut and restructured, never added to);
// its [[VERIFY]] items are left out or shown "To confirm". Run: node reports/designed/A15/build.mjs
// Shares the Editorial kit with A16 and the print check with A11.
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, folio, photo, TC, sup, doc } from '../A16/kit/editorial.mjs';
import { prepImages, render } from '../A11/kit/render.mjs';

const here = dirname(fileURLToPath(import.meta.url));
prepImages(here, {
  cover: 'images/library/l-010-069.webp',
  terrace: 'images/library/w-bromiceclipseheater-scottsdalehome-4.webp',
  pavilion: 'images/library/w-dsc01860-bearbeitet.webp',
  porch: 'images/library/l-010-067.webp',
  good: 'images/library/l-010-070.webp',
  better: 'images/library/l-010-071.webp',
  best: 'images/library/l-013-100.webp',
  twin: 'images/library/w-eclipse-electric-24twin-pole-residential-sce.webp',
  back: 'images/library/w-bromic-pe-white-residential.webp',
});
const I = (k) => `img/${k}.jpg`;
const TITLE = 'The Bromic Builder Program';
const AUD = 'For Home Builders';
const F = (n, side, light = false) => folio(n, TITLE, AUD, { side, light });

// ------------------------------------------------------------------ 1 cover
const p1 = `<section class="page cov">
  ${photo(I('cover'), 'full', '24% 50%')}
  <div class="shade"></div>
  <div class="x mast blk"><img src="${ROOT}/images/portfolio/bromic-logo-white.png" alt="Bromic Heating"><span class="label">Builder Program <i>·</i> Good, Better, Best</span></div>
  <div class="x kicker blk"><span class="label">For Home Builders</span></div>
  <h1 class="x blk">The Bromic Builder Program</h1>
  <p class="x deck blk">Sell the evening along with the patio.</p>
  <div class="x lines blk">
    <div><span class="no">Good</span><span class="t">Warmth Where Everyone Sits</span><span class="d">Dinner outside on a cool evening.</span></div>
    <div><span class="no">Better</span><span class="t">Heat You Can Feel, Not See</span><span class="d">The patio as an everyday room, morning to late.</span></div>
    <div><span class="no">Best</span><span class="t">A Complete Outdoor Room</span><span class="d">An outdoor room as finished as the inside.</span></div>
  </div>
  <div class="folio light"><span>Bromic Heating · For Home Builders</span><span>Pre-wired outdoor heating, three ways</span><span class="n">&nbsp;</span></div>
</section>`;

// ------------------------------------------------------------------ 2 opening
const p2 = `<section class="page p2">
  ${photo(I('terrace'), 'right-tall', '42% 50%')}
  <div class="x txt blk">
    <span class="label">Part 1 · The One-Pager</span>
    <h2>Sell The Evening Along With The Patio.</h2>
    <p class="lede">Your buyers stand on the patio and picture the evenings they will spend there. Radiant warmth is what lets them stay out long after the sun goes down. Most packages finish at the slab and the pergola, so we created a complete, pre-wired heating option at three price points that your sales team can present as naturally as cabinetry.</p>
  </div>
  <div class="x head2 blk">
    <span class="label">The Headline</span>
    <p class="deckp">Pre-wired Bromic radiant heat in three ready packages, planned in at framing from the first drawing.</p>
  </div>
  <div class="x who2 blk">
    <span class="label">Who It Is For</span>
    <p>Production and semi-custom builders with an outdoor living package, custom builders who want a standard heating detail, and remodelers who add covered patios.</p>
    <p class="fine">Eligibility criteria ${TC}</p>
  </div>
  <div class="x cap2 caption blk"><b>The evening ahead</b> – a covered terrace with fireplaces and an arched Eclipse heater at dusk.</div>
  ${F(2, 'l')}
</section>`;

// ------------------------------------------------------------------ 3 why heat belongs
const p3 = `<section class="page p3">
  <div class="x head3 blk">
    <span class="label">Why Heat Belongs On The Options Sheet</span>
    <h2>Everything Your Sales Team Needs, On A Single Page</h2>
  </div>
  <div class="x stats blk">
    <div class="stat"><span class="no">1</span><span class="t">Most new homes now come with a patio</span><span class="big didot">60.5<i>%</i></span><p>of single-family homes started in 2025 came with a patio,${sup(1)} and the average new-home patio is about 320 ft².${sup(2)}</p></div>
    <div class="stat"><span class="no">2</span><span class="t">Buyers are asking for it</span><span class="big didot">86<i>%</i></span><p>of recent and prospective buyers rate a patio essential or desirable, level with the laundry room as the most-wanted feature.${sup(3)}</p></div>
    <div class="stat"><span class="no">3</span><span class="t">Few homes come with the warmth to enjoy it</span><span class="big didot">23<i>%</i></span><p>of homeowners prioritise outdoor heating at the planning stage, yet 67% say heating extends how much they use their outdoor space.${sup(4)}</p></div>
  </div>
  <div class="x gap3 blk">
    <div class="gapbar"><span class="a" style="width:23%"><b>23%</b></span><span class="b" style="width:44%"></span><span class="c"><b>67%</b></span></div>
    <p class="deckp">Your upgrade lives in the distance between those two numbers.</p>
  </div>
  ${photo(I('pavilion'), 'bot3', '50% 55%')}
  <div class="x pull light pq3 blk"><q>You create beautiful spaces. We know how to heat them.</q></div>
  <div class="x cap3 caption light blk"><b>A garden pavilion at dusk</b> – a round heater glowing on the timber ceiling.</div>
  ${F(3, 'r', true)}
</section>`;

// ------------------------------------------------------------------ 4 what the program brings
const items = [
  ['Three ready packages', 'Good, Better, Best, each a complete system with heaters, controls and pre-wire scope.', 'Draft · Part 2'],
  ['Complimentary design service', `Heater selection, placement and coverage drawings from your plans or photos.${sup(5)}`, 'Live'],
  ['Pre-wire and rough-in guide', 'One page your electrician can price from (A16).', 'In development'],
  ['Builder pricing', 'Tiered trade pricing by volume.', TC],
  ['Margin structure', 'Suggested option pricing for your sales sheet.', TC],
  ['Supply and lead times', 'Stocking and delivery commitments.', TC],
  ['Model home support', 'Display units or demo program.', TC],
  ['Sales training', 'Short session for design-center staff.', TC],
  ['Installer support', `Technical line, 1-800-301-1293, Mon–Fri 9–4 PT.${sup(5)}`, 'Live'],
  ['Warranty', 'Manufacturer warranty per series.', TC],
  ['Co-marketing', 'Brochure inserts, imagery for your listings.', TC],
  ['Program contact', 'Named regional contact.', TC],
];
const p4 = `<section class="page p4">
  ${photo(I('porch'), 'left4', '62% 50%')}
  <div class="x cap4 caption light blk"><b>Ready at handover</b> – a covered outdoor kitchen and bar with heaters flush in the ceiling.</div>
  <div class="x txt4 blk">
    <span class="label">What The Program Brings Your Team</span>
    <h2>Everything To Put Warmth On The Options Sheet</h2>
    <p>Every item below is a proposal until confirmed, and none of it is yet a price, margin or lead-time commitment.</p>
  </div>
  <div class="x tbl4 blk">
    <table class="ed prog"><colgroup><col style="width:1.45in"><col><col style="width:.95in"></colgroup>
      <tbody>${items.map(([a, b, c]) => `<tr><td class="fam">${a}</td><td>${b}</td><td class="st">${c}</td></tr>`).join('')}</tbody></table>
  </div>
  <div class="folio blk f4"><span>Bromic Heating · ${TITLE}</span><span class="n">4</span></div>
</section>`;

// ------------------------------------------------------------------ 5 good–better–best table
const row = (k, g, b, x) => `<tr><th>${k}</th><td>${g}</td><td>${b}</td><td>${x}</td></tr>`;
const p5 = `<section class="page p5">
  <div class="x head5 blk">
    <span class="label">Part 2 · The Good–Better–Best Guide</span>
    <h2>Three Ways To Sell The Evening</h2>
    <p>From dinner outside on a cool night to an outdoor room as finished as the inside. Each tier is a complete working solution: the heaters, the controls that run them, the mounting and the rough-in your electrician installs at framing. Controls come with every tier as part of the system.</p>
  </div>
  <div class="x gbb blk">
    <table class="tiers"><colgroup><col style="width:1.1in"><col><col><col></colgroup>
      <thead><tr><th></th><th><span class="didot">Good</span></th><th><span class="didot">Better</span></th><th><span class="didot">Best</span></th></tr></thead>
      <tbody>
      ${row('The moment', '<i class="mo">Dinner outside on a cool evening</i>', '<i class="mo">The patio as an everyday room, morning to late</i>', '<i class="mo">An outdoor room as finished as the inside</i>')}
      ${row('Heater', 'Platinum Smart-Heat Electric, wall- or ceiling-mounted', 'Platinum Smart-Heat Electric, recessed flush in the soffit', 'Platinum Smart-Heat Electric recessed, plus Eclipse Smart-Heat Electric pendant over dining; Tungsten Smart-Heat Electric Select or Coastal as the recessed upgrade')}
      ${row('Output and finish', `2300 W or 3400 W; Black or White${sup(5)}`, '3400 W or 4500 W; Black or White', 'Platinum 3400 W or 4500 W; Eclipse with dimmable rim lighting, Black')}
      ${row('Approx. coverage per heater', `65–143 ft² by model${sup(5)}`, '65–143 ft² by model', 'Platinum 65–143 ft²; Eclipse 121 ft²; Tungsten 64–144 ft²')}
      ${row('Mounting', 'Wall or ceiling bracket', `Recess kit${sup(6)}`, 'Recess kit; Eclipse on single, double or curved pole')}
      ${row('Controls (required)', 'Affinity Smart-Heat On/Off controller + manual wall switch', 'Affinity Smart-Heat Dimmer controller + manual wall switch + Bromic Smart-Heat app (schedules, timers)', `Affinity Dimmer controller (Platinum) + Affinity Eclipse controller + wall switches + app with zones; integration with Control4, Crestron or Lutron where the home has it (compatibility varies; may need extra integration hardware)${sup(5)}`)}
      ${row('Zones', 'One', 'One or two', 'Two or more (dining, lounge)')}
      ${row('Pre-wire scope', 'Dedicated circuit(s), box at heater, box at switch', 'Dedicated circuits, recess framing and blocking, controller location, Wi-Fi coverage', 'As Better, plus pendant structure, extra zone circuits, integrator coordination')}
      ${row('Price · cost · lead time', TC, TC, TC)}
      </tbody>
    </table>
  <div class="notes5">
    <p>Wi-Fi and app features require compatible Affinity Smart-Heat Controls, sold separately; they are included in the tier where listed.${sup(5)} Tiers are shown for one covered patio. Heater count depends on the patio's size, height and exposure, and coverage per heater is approximate and varies with model, mounting height, environment and installation.${sup(5)} Bromic's design team confirms the count and positions for each plan.</p>
    <p>Affinity controller compatibility with each Platinum wattage, whether the On/Off controller supports the app, and the controller for a Tungsten Select or Coastal upgrade: ${TC}</p>
  </div>
  </div>
  ${F(5, 'r')}
</section>`;

// ------------------------------------------------------------------ 6 good and better
const p6 = `<section class="page p6">
  ${photo(I('good'), 'g6', '50% 40%')}
  <div class="x capg caption blk"><b>Good</b> – a courtyard dining table warmed by a black wall heater.</div>
  <div class="x tg blk">
    <span class="label">Good</span>
    <h2>Warmth Where Everyone Sits</h2>
    <p class="lede">A wall- or ceiling-mounted Platinum heater is aimed at the table and runs on one zone, with one switch and one controller. It is the simplest pre-wire and the easiest line to add to the options sheet, and Marine variants suit coastal lots.${sup(5)}</p>
    <div class="rows tierrows">
      <div><b>Controls</b><span>Affinity Smart-Heat On/Off controller + manual wall switch</span></div>
      <div><b>Pre-wire</b><span>Dedicated circuit(s), box at heater, box at switch</span></div>
    </div>
  </div>
  ${photo(I('better'), 'b6', '50% 50%')}
  <div class="x capb caption blk"><b>Better</b> – an ocean-view outdoor living room with recessed heaters.</div>
  <div class="x tb blk">
    <span class="label">Better</span>
    <h2>Heat You Can Feel, Not See</h2>
    <p>Platinum sits recessed flush into the soffit with Bromic's recess kit, so the ceiling stays clean and uncluttered.${sup(6)} The Affinity Dimmer controller lets owners soften the heat on mild nights, and the Smart-Heat app sets schedules and timers. This is the tier to show in your model home.</p>
    <div class="rows tierrows">
      <div><b>Controls</b><span>Affinity Smart-Heat Dimmer controller + manual wall switch + Bromic Smart-Heat app</span></div>
      <div><b>Pre-wire</b><span>Dedicated circuits, recess framing and blocking, controller location, Wi-Fi coverage</span></div>
    </div>
  </div>
  ${F(6, 'l')}
</section>`;

// ------------------------------------------------------------------ 7 best
const p7 = `<section class="page p7">
  ${photo(I('best'), 'full7', '50% 45%')}
  <div class="shade7"></div>
  <div class="x t7 blk">
    <span class="label">Best</span>
    <h2>A Complete Outdoor Room</h2>
    <p>Recessed Platinum warms the lounge while Eclipse pendants bring heat and light together over the dining table, each on its own zone and tied into the home's automation where it has one. For buyers who want the newest design, offer Tungsten Select or Coastal as the recessed heater.</p>
    <div class="rows tierrows light">
      <div><b>Controls</b><span>Affinity Dimmer controller (Platinum) + Affinity Eclipse controller + wall switches + app with zones; Control4, Crestron or Lutron where the home has it${sup(5)}</span></div>
      <div><b>Pre-wire</b><span>As Better, plus pendant structure, extra zone circuits, integrator coordination</span></div>
    </div>
  </div>
  <div class="x cap7 caption light blk"><b>Best</b> – Eclipse pendants glowing above a long candlelit dining table.</div>
  ${F(7, 'r', true)}
</section>`;

// ------------------------------------------------------------------ 8 bringing it to your buyers
const bring = [
  ['Show it lit.', 'A heated model-home patio at dusk tells the story better than any brochure.'],
  ['Price the pre-wire, even when buyers decline it.', 'A rough-in at framing costs far less than opening a finished soffit later, and it lets buyers add heat after closing.'],
  ['Lead with the moment, then the tier.', '"Dinner outside in October" sells better than a wattage.'],
  ['Keep controls in the price.', 'A heater becomes a finished option once its controller is included.'],
];
const check = [
  'Choose which plans get the program and mark the patio on each.',
  "Send plans to Bromic's design team for heater counts and positions per tier.",
  'Add Good, Better and Best to the options sheet with confirmed prices.',
  "Add the rough-in scope to the electrician's framing checklist (see the pre-wire guide).",
  'Brief the design-centre team and install the Better tier in the model home.',
  `Electrical work by a licensed electrician to NFPA 70 as adopted locally; confirm with the local building authority.${sup(6)}`,
];
const p8 = `<section class="page p8">
  ${photo(I('twin'), 'top8', '50% 50%')}
  <div class="x cap8 caption blk"><b>Show it lit</b> – a covered terrace dining table under round heaters on twin ceiling poles, dusk sky.</div>
  <div class="x t8 blk">
    <span class="label">Bringing It To Your Buyers</span>
    <h2>Let Buyers Feel It</h2>
    <p class="deckp">The surest way to sell warmth is to let buyers feel it.</p>
  </div>
  <div class="x br8 blk">${bring.map(([h, t], i) => `<div class="b"><span class="no didot">${i + 1}</span><div><h3>${h}</h3><p>${t}</p></div></div>`).join('')}</div>
  <div class="x cl8 blk">
    <span class="label">Your Planning Checklist</span>
    <ul class="check">${check.map((c) => `<li>${c}</li>`).join('')}</ul>
  </div>
  ${F(8, 'l')}
</section>`;

// ------------------------------------------------------------------ 9 back cover
const SOURCES = [
  'National Association of Home Builders (Eye on Housing). <i>Share of new homes with patios dips to a six-year low</i>. 2026. eyeonhousing.org',
  'National Association of Home Builders (Eye on Housing). <i>Share of new homes with patios edges down for first time in fifteen years (Builder Practices Survey)</i>. 2025. eyeonhousing.org',
  'National Association of Home Builders (Eye on Housing). <i>Outdoor features, a laundry room among most wanted features (What Home Buyers Really Want, 2024 edition)</i>. 2024. eyeonhousing.org',
  'Bromic / Atomik Research. <i>Outdoor Living Trends 2026 (US Homeowner Survey)</i>. 2026.',
  'Bromic. <i>Lookbook 2026</i>. 2026.',
  'Bromic. <i>The Official Outdoor Heating Planning Guide v1.2 (US)</i>. 2021.',
];
const p9 = `<section class="page p9">
  ${photo(I('back'), 'top9', '50% 55%')}
  <div class="x cap9 caption blk"><b>Ready for warmth</b> – white heaters on dark cladding beside a pergola dining area at dusk.</div>
  <div class="x cta9 blk">
    <span class="label">Your Next Step</span>
    <h2>All Three Tiers, Sized For Your Lead Plan.</h2>
    <p>Book a design consult, and we will size all three tiers for your lead plan.</p>
    <span class="btn">Book A Design Consult</span>
  </div>
  <div class="x src9 blk">
    <span class="label">Sources</span>
    <ol class="srcs">${SOURCES.map((s) => `<li>${s}</li>`).join('')}</ol>
  </div>
  <div class="x logo9 blk"><img src="${ROOT}/images/portfolio/bromic-logo.png" alt="Bromic Heating"><span>bromic.com · 1-800-301-1293</span></div>
  ${F(9, 'r')}
</section>`;

const pageCss = `
/* cover */
.cov .full { inset: 0; }
.cov .shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(20,18,19,.45) 0%, rgba(20,18,19,.15) 50%, rgba(20,18,19,0) 72%), linear-gradient(180deg, rgba(20,18,19,.5) 0%, rgba(20,18,19,.1) 32%, rgba(20,18,19,0) 50%, rgba(20,18,19,.2) 66%, rgba(20,18,19,.8) 100%); }
.cov .mast { top: .46in; left: var(--m); right: var(--m); display: flex; justify-content: space-between; align-items: center; }
.cov .mast img { height: .30in; }
.cov .mast .label { color: #fff; opacity: .9; }
.cov .mast .label i { font-style: normal; color: var(--flame); }
.cov .kicker { top: 1.3in; left: var(--m); display: flex; align-items: center; gap: 10pt; }
.cov .kicker::before { content: ''; width: 28pt; height: 1.2pt; background: var(--flame); }
.cov .kicker .label { color: #fff; }
.cov h1 { top: 1.55in; left: calc(var(--m) - 3pt); width: 6.4in; color: #fff; font-size: 70pt; line-height: .9; letter-spacing: -.012em; text-shadow: 0 1px 24px rgba(0,0,0,.2); }
.cov .deck { hyphens: manual; top: 4.42in; left: var(--m); width: 4in; color: #fff; font-family: 'Didot', serif; font-size: 15pt; line-height: 1.3; font-style: italic; }
.cov .lines { left: var(--m); right: var(--m); bottom: .86in; display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); }
.cov .lines div { border-top: .6pt solid rgba(255,255,255,.5); padding-top: 8pt; color: #fff; }
.cov .lines .no { font-family: 'Didot', serif; font-size: 22pt; line-height: 1; display: block; margin-bottom: 5pt; }
.cov .lines .t { font-size: 8.2pt; letter-spacing: .16em; text-transform: uppercase; display: block; margin-bottom: 4pt; }
.cov .lines .d { font-size: 8.4pt; line-height: 1.45; color: rgba(255,255,255,.82); }
/* 2 */
.p2 .right-tall { top: 0; right: 0; width: 3.7in; height: 9.45in; }
.p2 .cap2 { top: 9.55in; left: 4.8in; right: var(--m); }
.p2 .txt { top: .62in; left: var(--m); width: 3.9in; }
.p2 .head2 { top: 5.2in; left: var(--m); width: 3.9in; border-top: 1.2pt solid var(--flame); padding-top: 10pt; }
.p2 .head2 .deckp { margin-top: 8pt; font-size: 15pt; }
.p2 .who2 { top: 7.75in; left: var(--m); width: 3.9in; border-top: .5pt solid var(--ink); padding-top: 10pt; }
.p2 .who2 .label { margin-bottom: 6pt; }
.p2 .who2 .fine { margin-top: 6pt; }
/* 3 */
.p3 .head3 { top: .62in; left: var(--m); right: var(--m); }
.p3 .head3 h2 { max-width: 6in; }
.p3 .stats { top: 2.42in; left: var(--m); right: var(--m); display: grid; grid-template-columns: repeat(3, 1fr); gap: .3in; }
.p3 .stat { border-top: .5pt solid var(--ink); padding-top: 9pt; }
.p3 .stat .no { font-family: 'Didot', serif; font-size: 13pt; color: var(--flame); display: block; }
.p3 .stat .t { display: block; font-size: 7.3pt; letter-spacing: .16em; text-transform: uppercase; color: var(--ink); margin: 5pt 0 8pt; line-height: 1.4; min-height: 21pt; }
.p3 .stat .big { display: block; font-size: 56pt; line-height: .95; color: var(--ink); }
.p3 .stat .big i { font-style: normal; font-size: 28pt; }
.p3 .stat p { font-size: 8.6pt; margin-top: 8pt; }
.p3 .gap3 { top: 5.05in; left: var(--m); right: var(--m); }
.p3 .gapbar { display: flex; height: 18pt; align-items: stretch; margin-bottom: 10pt; }
.p3 .gapbar span { position: relative; }
.p3 .gapbar .a { background: var(--ink); }
.p3 .gapbar .b { background: repeating-linear-gradient(90deg, var(--flame) 0 1pt, transparent 1pt 5pt); border-top: .8pt solid var(--flame); border-bottom: .8pt solid var(--flame); }
.p3 .gapbar .c { flex: 1; background: var(--rule); }
.p3 .gapbar b { position: absolute; top: 4pt; font-weight: 400; font-size: 7.4pt; letter-spacing: .12em; }
.p3 .gapbar .a b { right: 6pt; color: #fff; }
.p3 .gapbar .c b { left: 6pt; color: var(--ink); }
.p3 .gap3 .deckp { font-size: 16pt; }
.p3 .bot3 { left: 0; right: 0; bottom: 0; height: 4.85in; }
.p3 .bot3::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,18,19,.15) 0%, rgba(20,18,19,.0) 35%, rgba(20,18,19,.65) 100%); }
.p3 .pq3 { left: var(--m); width: 4.4in; bottom: 1.45in; border-color: var(--flame); }
.p3 .pq3 q { font-size: 20pt; }
.p3 .cap3 { left: var(--m); right: var(--m); bottom: .78in; }
/* 4 */
.p4 .left4 { top: 0; left: 0; bottom: 0; width: 2.75in; }
.p4 .cap4 { left: .3in; width: 2.2in; bottom: .5in; }
.p4 .txt4 { top: .62in; left: 3.2in; right: var(--m); }
.p4 .txt4 h2 { font-size: 30pt; }
.p4 .tbl4 { top: 3.15in; left: 3.2in; right: var(--m); }
table.prog td { padding: 7pt 8pt 7pt 0; font-size: 8.3pt; }
table.prog tr:first-child td { border-top: .5pt solid var(--ink); }
table.prog td.fam { font-size: 11pt; }
table.prog td.st { font-size: 6.6pt; letter-spacing: .16em; text-transform: uppercase; text-align: right; color: var(--ink); padding-right: 0; padding-top: 9pt; white-space: nowrap; }
.p4 .folio.f4 { left: 3.2in; }
/* 5 */
.p5 .head5 { top: .55in; left: var(--m); right: var(--m); }
.p5 .head5 h2 { margin: 8pt 0 10pt; }
.p5 .head5 p { max-width: 6.2in; font-size: 9.2pt; }
.p5 .gbb { top: 2.4in; left: var(--m); right: var(--m); }
table.tiers { width: 100%; border-collapse: collapse; table-layout: fixed; }
table.tiers thead th { text-align: left; padding: 0 10pt 6pt 0; border-bottom: 1.2pt solid var(--ink); }
table.tiers thead th .didot { font-size: 24pt; line-height: 1; font-weight: 400; color: var(--ink); }
table.tiers thead th:last-child .didot { color: var(--flame); }
table.tiers tbody th { text-align: left; font-weight: 400; font-size: 6.6pt; letter-spacing: .14em; text-transform: uppercase; color: var(--steel); padding: 5.5pt 10pt 5.5pt 0; border-bottom: .5pt solid var(--rule); vertical-align: top; line-height: 1.4; }
table.tiers td { font-size: 8pt; line-height: 1.42; color: var(--body); padding: 5.5pt 12pt 5.5pt 0; border-bottom: .5pt solid var(--rule); vertical-align: top; }
table.tiers td .mo { font-family: 'Didot', serif; font-size: 11pt; line-height: 1.2; color: var(--ink); }
.p5 .notes5 { margin-top: 9pt; }
.p5 .notes5 p { font-size: 7.2pt; line-height: 1.5; color: var(--steel); }
.p5 .notes5 p + p { margin-top: 4pt; }
/* 6 */
.p6 .g6 { top: 0; left: 0; width: 3.2in; height: 5.05in; }
.p6 .capg { top: 5.12in; left: var(--m); width: 2.6in; }
.p6 .tg { top: .62in; left: 3.65in; right: var(--m); }
.p6 .tg h2, .p6 .tb h2 { font-size: 28pt; }
.p6 .b6 { top: 5.7in; right: 0; width: 3.7in; height: 4.0in; }
.p6 .capb { top: 9.78in; left: 4.8in; right: var(--m); }
.p6 .tb { top: 5.95in; left: var(--m); width: 3.85in; }
.rows.tierrows { margin-top: 10pt; }
.rows.tierrows > div { grid-template-columns: .85in 1fr; padding: 6pt 0; }
.rows.tierrows span { font-size: 8.4pt; }
.rows.light { border-color: rgba(255,255,255,.6); }
.rows.light > div { border-color: rgba(255,255,255,.25); }
.rows.light b, .rows.light span { color: #fff; }
/* 7 */
.p7 .full7 { inset: 0; }
.p7 .shade7 { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,18,19,.7) 0%, rgba(20,18,19,.35) 38%, rgba(20,18,19,0) 58%, rgba(20,18,19,.35) 85%, rgba(20,18,19,.7) 100%); }
.p7 .t7 { top: .62in; left: var(--m); width: 5.2in; }
.p7 .t7 .label { color: #fff; }
.p7 .t7 h2 { color: #fff; font-size: 40pt; }
.p7 .t7 p { color: rgba(255,255,255,.9); font-size: 9.6pt; }
.p7 .cap7 { left: var(--m); right: var(--m); bottom: .78in; }
/* 8 */
.p8 .top8 { top: 0; left: 0; right: 0; height: 4.2in; }
.p8 .cap8 { top: 4.3in; left: var(--m); right: var(--m); }
.p8 .t8 { top: 4.85in; left: var(--m); width: 3.2in; }
.p8 .t8 h2 { font-size: 30pt; }
.p8 .br8 { top: 4.85in; left: 4.0in; right: var(--m); }
.p8 .br8 .b { display: grid; grid-template-columns: 24pt 1fr; gap: 6pt; padding: 7pt 0; border-top: .5pt solid var(--rule); }
.p8 .br8 .b:first-child { border-top: .5pt solid var(--ink); }
.p8 .br8 .no { font-size: 20pt; line-height: 1; color: var(--flame); }
.p8 .br8 h3 { font-size: 13pt; margin-bottom: 3pt; }
.p8 .br8 p { font-size: 8.6pt; }
.p8 .cl8 { top: 7.15in; left: var(--m); width: 3.2in; }
.p8 .cl8 .label { margin-bottom: 8pt; }
.p8 .cl8 .check li { font-size: 8.3pt; padding-bottom: 5pt; }
/* 9 */
.p9 .top9 { top: 0; left: 0; right: 0; height: 5.6in; }
.p9 .cap9 { top: 5.7in; left: var(--m); right: var(--m); }
.p9 .cta9 { top: 6.3in; left: var(--m); width: 4.1in; border-top: 1.2pt solid var(--flame); padding-top: 12pt; }
.p9 .cta9 h2 { font-size: 28pt; margin: 8pt 0 10pt; }
.p9 .cta9 p { font-size: 10pt; margin-bottom: 14pt; }
.p9 .src9 { top: 6.3in; left: 5.0in; right: var(--m); border-top: .5pt solid var(--ink); padding-top: 12pt; }
.p9 .src9 .label { margin-bottom: 8pt; }
.p9 .logo9 { left: var(--m); bottom: .95in; display: flex; align-items: center; gap: 14pt; }
.p9 .logo9 img { height: .28in; }
.p9 .logo9 span { font-size: 7pt; letter-spacing: .2em; text-transform: uppercase; color: var(--steel); }
`;

const html = doc(`${TITLE} · Bromic Heating`, pageCss, [p1, p2, p3, p4, p5, p6, p7, p8, p9]);
await render({ dir: here, html, pdf: 'Bromic-A15-Builder-Program.pdf', meta: { item_id: 'A15', theme: 'editorial', title: TITLE } });
