// A16 Ready For Warmth From Day One — the whole builder's pre-wire guide in the Editorial Lookbook theme.
// Every line of copy comes from content/guides/A16-pre-wire-guide.md (cut and restructured, never added to);
// its [[VERIFY]] items are left out or shown "To confirm". Run: node reports/designed/A16/build.mjs
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, folio, photo, TC, sup, doc } from './kit/editorial.mjs';
import { prepImages, render } from '../A11/kit/render.mjs';

const here = dirname(fileURLToPath(import.meta.url));
prepImages(here, {
  cover: 'images/library/w-84-hr-grosveldvandervelde-nl1-2021.webp',
  kitchen: 'images/library/l-010-067.webp',
  porch: 'images/library/w-connecticut-privateresidence-tungstenelectri-2.webp',
  install: 'images/library/w-bromic-shoot-may-11-2023-39.webp',
  louvre: 'images/library/l-010-076.webp',
  coastal: 'images/library/l-005-022.webp',
  gas: 'images/library/w-provenancerestaurant-platinumgas-03.webp',
  cabana: 'images/library/l-010-074.webp',
  pergola: 'images/library/w-delmonico-08.webp',
  night: 'images/library/w-p1021449-hdr-denoiseai-low-light.webp',
});
const I = (k) => `img/${k}.jpg`;
const TITLE = 'Ready For Warmth From Day One';
const AUD = 'For Builders';
const F = (n, side, light = false) => folio(n, TITLE, AUD, { side, light });

// ------------------------------------------------------------------ 1 cover
const p1 = `<section class="page cov">
  ${photo(I('cover'), 'full', '62% 50%')}
  <div class="shade"></div>
  <div class="x mast blk"><img src="${ROOT}/images/portfolio/bromic-logo-white.png" alt="Bromic Heating"><span class="label">The Builder's Guide <i>·</i> Pre-Wiring Outdoor Heat</span></div>
  <div class="x kicker blk"><span class="label">For Builders</span></div>
  <h1 class="x blk">Ready For Warmth From Day One</h1>
  <p class="x deck blk">The builder's guide to pre-wiring outdoor heat.</p>
  <div class="x lines blk">
    <div><span class="no">01</span><span class="t">Plan It While The Ceiling Is Open</span><span class="d">A heater planned at the drawing stage sits exactly over the table.</span></div>
    <div><span class="no">02</span><span class="t">Every Trade, In The Right Order</span><span class="d">When each trade knows its moment, the heat goes in once.</span></div>
    <div><span class="no">03</span><span class="t">Circuits Sized Right</span><span class="d">One that never trips on the first cold night.</span></div>
  </div>
  <div class="folio light"><span>Bromic Heating · For Builders</span><span>A guide for every Bromic heater type</span><span class="n">&nbsp;</span></div>
</section>`;

// ------------------------------------------------------------------ 2 opening
const p2 = `<section class="page p2">
  ${photo(I('kitchen'), 'right-tall', '50% 50%')}
  <div class="x txt blk">
    <span class="label">Before You Begin</span>
    <h2>That Evening Starts At Rough&#8209;In</h2>
    <p class="lede">Picture your buyers on their first evening at home, stepping outside after dinner to a patio that is already warm. That evening starts at rough-in, with a few circuits, boxes and blocking that cost little while the ceiling is open and save a callback later.</p>
  </div>
  <div class="x glance blk">
    <span class="label">At A Glance</span>
    <p>Run a dedicated branch circuit for each electric heater (or heater group, per the controller), sized from I = W ÷ V with conductors at 125% of the load.${sup(5)} Add a junction box and solid blocking at every heater, pole or recess location, a home run from each heater to the controller location, a box at the wall switch and, for built-in gas, a stubbed and capped line with an accessible shut-off.</p>
    <p class="settle didot">Settle all of it before framing.</p>
  </div>
  <div class="x cap2 caption blk"><b>Flush in the ceiling</b> – a covered outdoor kitchen and bar warmed by heaters set flush into the ceiling.</div>
  <div class="x inside blk">
    <span class="label">Inside This Guide</span>
    <ol>
      <li><span>Plan it while the ceiling is open</span><i>3</i></li>
      <li><span>Every trade, in the right order</span><i>4</i></li>
      <li><span>The right rough-in for each heater</span><i>5</i></li>
      <li><span>Circuits sized right the first time</span><i>6</i></li>
      <li><span>Boxes, blocking and a flush recess</span><i>7</i></li>
      <li><span>Wiring the controls · gas stub-outs</span><i>8</i></li>
      <li><span>Passing the rough inspection</span><i>9</i></li>
      <li><span>Printable checklist · hand-off sheet</span><i>10</i></li>
    </ol>
  </div>
  ${F(2, 'l')}
</section>`;

// ------------------------------------------------------------------ 3 plan it while the ceiling is open
const p3 = `<section class="page p3">
  ${photo(I('porch'), 'top-right', '30% 50%')}
  <div class="x txt blk">
    <span class="label">Plan It While The Ceiling Is Open</span>
    <h2>Designed To Fit. Built To Perform.</h2>
    <p class="lede">Fewer than one in four homeowners prioritize heating at planning.${sup(1)} Many of the rest ask for it once the drywall, soffits and stone are finished, and by then it means opening a finished ceiling, running surface conduit, placing the heater wherever the wire reaches instead of over the table, and a callback.</p>
  </div>
  <div class="x cap3 caption blk"><b>Flush in the ceiling</b> – heaters recessed into a porch ceiling, the detail buyers notice in the model home.</div>
  <div class="x when blk">
    <div class="wh"><h3>When It Is Decided</h3><p>The later heat is planned, the more it costs to put in.</p></div>
    <div class="stages">
      <div class="st s1"><span class="no didot">I</span><span class="t">At design or pre-framing</span><span class="bar"></span><p>A line on the electrical plan, with blocking and boxes at rough-in.</p></div>
      <div class="st s2"><span class="no didot">II</span><span class="t">After framing, before close-in</span><span class="bar"></span><p>A change order and an extra trip for the electrician.</p></div>
      <div class="st s3"><span class="no didot">III</span><span class="t">After finish</span><span class="bar"></span><p>Opened ceilings or walls, patching, repainting, surface conduit, and often no recess option.</p></div>
    </div>
  </div>
  <div class="x pull blk"><q>A heater planned at the drawing stage sits exactly over the table, flush in a clean ceiling, with nothing to patch.</q></div>
  <div class="x opt blk">
    <span class="label">Offer It At The Options Stage</span>
    <p>A pre-wire package of circuits, boxes, blocking and a switch box can be sold even when the heaters are bought later, so your buyers move into an outdoor space that is ready for warmth whenever they choose. The builder program and its Good–Better–Best guide show how (A15).</p>
  </div>
  ${F(3, 'r')}
</section>`;

// ------------------------------------------------------------------ 4 every trade
const steps = [
  ['Plans', 'Builder, designer, Bromic design service', 'Heated zones, heater type and count, mount type, fuel.'],
  ['Pre-framing', 'Framer, builder', 'Recess openings, blocking, ceiling build-up.'],
  ['Electrical rough-in', 'Licensed electrician', 'Circuits, boxes, control runs, switch location, panel capacity.'],
  ['Gas rough-in', 'Licensed gas fitter', 'Line size, stub-out, shut-off.'],
  ['Rough inspection', 'AHJ', 'Inspect before close-in.'],
  ['Trim-out', 'Electrician, gas fitter', 'Heaters, recess kits, controllers, commissioning.'],
];
const p4 = `<section class="page p4">
  ${photo(I('install'), 'top-full', '50% 30%')}
  <div class="shade4"></div>
  <div class="x head4 blk">
    <span class="label" style="color:#fff">Every Trade, In The Right Order</span>
    <h2>The Heat Goes In Once</h2>
  </div>
  <div class="x cap4 caption blk"><b>Trim-out</b> – a Platinum Smart-Heat Electric heater lifted into its recess kit, set flush within the ceiling cavity.${sup(3)}</div>
  <div class="x intro4 blk"><p class="deckp">When each trade knows its moment, the heat goes in once and the schedule holds.</p></div>
  <div class="x steps blk">
    ${steps.map(([t, w, d], i) => `<div class="step"><span class="no didot">${i + 1}</span><span class="t">${t}</span><span class="who">${w}</span><p>${d}</p></div>`).join('')}
  </div>
  ${F(4, 'l')}
</section>`;

// ------------------------------------------------------------------ 5 rough-in per heater
const fam = [
  ['Platinum Smart-Heat Electric', '2300 / 3400 / 4500 W', 'Dedicated circuit(s) to controller; heater junction box', 'Recessed (recess kit), ceiling or wall; blocking'],
  ['Eclipse Smart-Heat Electric', `Wattage and supply ${TC}`, 'Circuit to controller; ceiling box at pole', 'Single pole 8", 24" or 48"; double or curved pole; blocking for pole'],
  ['Eclipse Smart-Heat Freestanding Electric', `Plug or hard-wire; receptacle rating ${TC}`, `Outdoor receptacle requirements ${TC}`, 'None; level surface'],
  ['Tungsten Smart-Heat Electric – Coastal / Select', `Wattages ${TC}`, 'As Platinum, pending install manual', 'Low-clearance recessing, ceiling, wall, single-post'],
  ['Tungsten Gas (built-in), Platinum Gas', `Btu/h ${TC}`, `Gas stub-out and shut-off; any electrical supply for ignition or controls ${TC}`, 'Ceiling, wall; ceiling poles, heat deflectors'],
  ['Tungsten Smart-Heat Freestanding Gas', '38,000 Btu/h; natural gas or propane', `Propane: none. Natural gas: quick-connect outlet ${TC}`, 'None'],
];
const p5 = `<section class="page p5">
  <div class="x txt5 blk">
    <span class="label">The Right Rough-In For Each Heater</span>
    <h2>It Fits On The Day It Arrives</h2>
    <p>Each Bromic family asks for something slightly different at rough-in, and getting it right means the heater your buyer chose fits on the day it arrives.</p>
  </div>
  ${photo(I('louvre'), 'sq5', '50% 50%')}
  <div class="x cap5 caption blk"><b>Between the louvres</b> – a white heater set neatly into a pergola.</div>
  <div class="x tbl5 blk">
    <table class="ed"><colgroup><col style="width:1.75in"><col style="width:1.45in"><col><col style="width:1.85in"></colgroup>
      <thead><tr><th>Family</th><th>Fuel / rating</th><th>Rough-in</th><th>Mount provisions</th></tr></thead>
      <tbody>${fam.map((r) => `<tr><td class="fam">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody>
    </table>
    <p class="fine note5">Product facts come from the Bromic Lookbook 2026${sup(2)} and Planning Guide 2021.${sup(3)} Always build to the current installation manual for the model. Specify the matching Affinity Smart-Heat® control for every electric heater (page 8).</p>
  </div>
  ${F(5, 'r')}
</section>`;

// ------------------------------------------------------------------ 6 circuits
const amps = [
  ['2300 W', '11.1 A', '13.8', '9.6 A', '12.0'],
  ['3400 W', '16.3 A', '20.4', '14.2 A', '17.7'],
  ['4500 W', '21.6 A', '27.0', '18.8 A', '23.4'],
];
const p6 = `<section class="page p6">
  <div class="x txt6 blk">
    <span class="label">Circuits Sized Right The First Time</span>
    <h2>One That Never Trips On The First Cold Night</h2>
    <p class="lede">A circuit sized correctly is one that never trips on the first cold night, and it takes three steps. Fixed electric space-heating equipment is treated as a continuous load.</p>
  </div>
  <div class="x big6 blk"><span class="didot n">125<i>%</i></span><p>NEC Article 424 requires its branch-circuit conductors to be sized at not less than 125% of the load, consistent with the continuous-load rules in 210.19(A)(1) and 210.20(A).${sup(5, 4)} Feeder and service calculations follow Article 220.</p></div>
  <div class="x steps6 blk">
    <div><span class="no didot">1</span><span class="t">Find the current per heater</span><p class="eq didot">I = W ÷ V</p></div>
    <div><span class="no didot">2</span><span class="t">Allow for continuous load</span><p>Branch-circuit conductors at not less than 125% of the load.</p></div>
    <div><span class="no didot">3</span><span class="t">Choose the circuit and breaker</span><p>The electrician selects conductor and overcurrent device from the result, the installation manual and the adopted NEC.</p></div>
  </div>
  <div class="x ex6 blk">
    <span class="label">Worked Example</span>
    <h3>Three 3400&nbsp;W Heaters On 240&nbsp;V</h3>
    <div class="rows">
      <div><b>Per heater</b><span>3400 ÷ 240 = 14.2 A; × 1.25 = 17.7 A.</span></div>
      <div><b>All three on one controller output</b><span>42.5 A; × 1.25 = 53.1 A minimum conductor ampacity – more than one typical circuit carries, so split them.</span></div>
      <div><b>Panel</b><span>Add 10.2 kW to the load calculation.</span></div>
    </div>
  </div>
  <div class="x amps6 blk">
    <span class="label">Current Per Heater</span>
    <p class="sub">Rated wattage ÷ voltage; × 1.25 in the second column.</p>
    <table class="ed amps"><thead><tr><th>Rating</th><th>208 V</th><th>× 1.25</th><th>240 V</th><th>× 1.25</th></tr></thead>
      <tbody>${amps.map((r) => `<tr><td class="fam">${r[0]}</td><td>${r[1]}</td><td class="m">${r[2]}</td><td>${r[3]}</td><td class="m">${r[4]}</td></tr>`).join('')}</tbody></table>
    <p class="fine">A heater rated at 240 V draws less on 208 V, so use the rating of the model specified. Commercial sites may also be offered 277 V.${sup(3)} Breaker size and maximum heaters per circuit for each model: ${TC}</p>
  </div>
  ${photo(I('night'), 'bot6', '50% 55%')}
  <div class="x cap6 caption light blk"><b>Sized right</b> – heaters glowing on the timber ceiling of a garden pavilion at night.</div>
  ${F(6, 'l', true)}
</section>`;

// ------------------------------------------------------------------ 7 boxes, blocking, recess
const p7 = `<section class="page p7">
  ${photo(I('coastal'), 'left7', '40% 50%')}
  <div class="x cap7 caption light blk"><b>Low-clearance recessing</b> – Tungsten Coastal recessed flush into a white ceiling.</div>
  <div class="x txt7 blk">
    <span class="label">Boxes And Blocking In The Right Place</span>
    <h2>Square, Secure, Aimed At The Seating</h2>
    <p>Heat aimed at the seating, from a heater that sits square and secure, is what your buyer feels on the first night.</p>
    <ul class="dash">
      <li><strong>Heater junction box</strong> at each heater location, per manual. Box type, offset and whether it is integral to the recess kit: ${TC}</li>
      <li><strong>Wall mounts</strong> with the heater at least 72" above finished floor, and <strong>ceiling mounts</strong> at least 96"; clearance to the ceiling varies with output.${sup(3)}</li>
      <li><strong>Solid blocking</strong> between joists at every heater, pole and bracket, sized for heater and pole weight. Weights per model: ${TC}</li>
      <li><strong>Suspension poles</strong> for high ceilings, with blocking and a box at the pole top.${sup(3)}</li>
      <li><strong>Clearances</strong> to combustibles, ceiling and sides, per manual. Do not interpolate between models.</li>
      <li><strong>Aim</strong> over the seating, not the floor centre, coordinated with the furniture plan.</li>
    </ul>
  </div>
  <div class="x rec7 blk">
    <span class="label">Framing For A Flush Recess</span>
    <h3>Part Of The Architecture</h3>
    <p>A recessed heater reads as part of the architecture, and it is the detail buyers notice in the model home. Recess kits let Platinum and Tungsten electric heaters sit flush within the ceiling cavity,${sup(3)} so give them a place in the framing plan.</p>
    <div class="rows dims">
      <div><b>Rough opening (L × W)</b><span>Per model and size · ${TC}</span></div>
      <div><b>Minimum cavity depth</b><span>Per model · ${TC}</span></div>
      <div><b>Clearance above kit</b><span>To combustibles, per installation manual · ${TC}</span></div>
      <div><b>Low-clearance recessing</b><span>Tungsten Coastal / Select · ${TC}</span></div>
      <div><b>Ceiling finish</b><span>Thickness allowed · ${TC}</span></div>
    </div>
    <ul class="dash site">
      <li>Run joists or add headers to frame the opening square and level.</li>
      <li>Keep insulation, vapour barriers and other services clear of the kit per the manual.</li>
      <li>Mark openings on the framing plan and on the ceiling before close-in.</li>
    </ul>
  </div>
  <div class="folio blk f7"><span>Bromic Heating · ${TITLE}</span><span class="n">7</span></div>
</section>`;

// ------------------------------------------------------------------ 8 controls and gas
const p8 = `<section class="page p8">
  <div class="x txt8 blk">
    <span class="label">Wiring The Controls</span>
    <h2>Warmth Exactly Where, And When, They Want It</h2>
    <p>Affinity Smart-Heat® Controls let your buyers enjoy warmth exactly where, and when, they want it, so rough them in together with the heater circuits. Specify the matching control for every heater, plus a wall switch.</p>
    <div class="rows ctl">
      <div><b>Platinum, Tungsten electric</b><span>Affinity Smart-Heat On/Off or Dimmer controller, with a wall switch.</span></div>
      <div><b>Eclipse</b><span>Eclipse controller, with a wall switch.</span></div>
      <div><b>Wi-Fi and app</b><span>Bromic Smart-Heat app features require compatible Affinity Smart-Heat Controls, sold separately.${sup(2)}</span></div>
    </div>
  </div>
  <div class="x runs8 blk">
    <span class="label">The Runs To Rough In</span>
    <ul class="dash">
      <li><strong>Line voltage:</strong> panel → Affinity controller → heaters, one controller channel per zone. Controller wiring topology: ${TC}</li>
      <li><strong>Wall switch:</strong> controller → switch box at the threshold. Line- or low-voltage switch leg and box size: ${TC}</li>
      <li><strong>Controller location:</strong> accessible, protected, within Wi-Fi range; check the signal there before close-in. Indoor or outdoor rating and mounting: ${TC}</li>
      <li><strong>Integration:</strong> controller → home-automation panel for Control4, Crestron or Lutron; compatibility varies and may need extra hardware.${sup(2)}</li>
      <li><strong>Spare conduit:</strong> heater zone → controller location, so later zones or integration need no opened finishes.</li>
    </ul>
  </div>
  ${photo(I('gas'), 'gas8', '50% 45%')}
  <div class="x cap8 caption blk"><b>The presence of gas</b> – a gas heater on a timber beam above a restaurant patio.</div>
  <div class="x gas8t blk">
    <span class="label">Gas Stub-Outs For Gas Models</span>
    <h3>No Visible Lines On The Finished Patio</h3>
    <p>For buyers who want the presence of gas, a clean stub-out at framing keeps the finished patio free of visible lines.</p>
    <ul class="dash">
      <li><strong>A licensed gas fitter sizes, routes and tests the line</strong> to ANSI Z223.1/NFPA 54${sup(6)} and the local code.</li>
      <li><strong>Size for the connected load</strong>, using the total Btu/h of all appliances on the line, run length and supply pressure. Btu/h input, inlet size and pressure for Platinum Gas and Tungsten Gas built-in: ${TC}</li>
      <li><strong>Stub out and cap</strong> at each heater location, with an accessible shut-off.</li>
      <li><strong>Allow for mount provisions.</strong> Heat deflectors reduce the clearance needed above gas heaters, and ceiling poles mount two heaters back to back.${sup(3)} Leave room for both in the framing.</li>
      <li><strong>Confirm the fuel</strong>, natural gas or propane, before the heater is ordered.</li>
    </ul>
  </div>
  ${F(8, 'l')}
</section>`;

// ------------------------------------------------------------------ 9 rough inspection
const insp = [
  'Permits pulled for electrical and gas work', 'Circuits match the approved plan and load calculation',
  'Boxes accessible, supported and at the planned positions', 'Blocking in place for every heater and pole',
  'Recess openings framed to the manual', 'Gas line pressure-tested and capped; shut-offs accessible',
  'Installation manuals on site for the inspector', `Final: heaters listed and marked (Intertek, UL or CSA);${sup(3)} clearances met; controls working`,
];
const p9 = `<section class="page p9">
  ${photo(I('cabana'), 'top9', '50% 55%')}
  <div class="x cap9 caption blk"><b>Square and secure</b> – a black heater warming a timber cabana wall at dusk.</div>
  <div class="x txt9 blk">
    <span class="label">Passing The Rough Inspection</span>
    <h2>Keep The Schedule Moving</h2>
    <p class="deckp">A clean rough inspection keeps the schedule moving and the buyer's handover on time.</p>
  </div>
  <div class="x list9 blk"><ul class="check">${insp.map((c) => `<li>${c}</li>`).join('')}</ul></div>
  <div class="x disc9 blk">
    <span class="label">General Guidance</span>
    <p>This guide is general guidance, not an engineering or code determination. Confirm requirements with the local building authority. Electrical work by a licensed electrician to the adopted NFPA 70;${sup(4)} gas work by a licensed gas fitter to ANSI Z223.1/NFPA 54;${sup(6)} both to the manufacturer's installation instructions.</p>
  </div>
  ${F(9, 'r')}
</section>`;

// ------------------------------------------------------------------ 10 printable checklist
const cl = [
  ['Before framing', ['Heated zones and seating drawn', 'Heater model, count, fuel and mount type chosen per zone', 'Recess kits and poles identified', 'Framing plan shows openings and blocking']],
  ['Electrical rough-in', ['Load per heater calculated (I = W ÷ V) at the supply voltage', 'Conductors ≥ 125% of load; breakers per manual and NEC', 'Panel capacity checked; load added to Art. 220 calculation', 'Junction box at every heater; heights ≥ 72" wall, ≥ 96" ceiling', 'Home runs to the Affinity controller location', 'Wall-switch box at the threshold', 'Spare conduit to controller location', 'Wi-Fi coverage confirmed at controller']],
  ['Gas rough-in (gas models)', ['Line sized for total Btu/h by licensed fitter', 'Stub-outs capped at each location; shut-offs accessible', 'Pressure test passed']],
  ['Before close-in', ['Rough inspection passed', 'Photos of every box and opening, with dimensions, filed with the job']],
];
const p10 = `<section class="page p10 form">
  <div class="x fh blk">
    <span class="label">Printable</span>
    <h2>Rough-In Checklist</h2>
    <div class="job"><span>Job</span><i></i><span>Date</span><i class="s"></i><span>Checked by</span><i></i></div>
  </div>
  <div class="x cl10 blk">
    ${cl.map(([h, items], i) => `<div class="grp"><div class="gh"><span class="no didot">${String(i + 1).padStart(2, '0')}</span><h3>${h}</h3></div>
      <ul>${items.map((t) => `<li><span class="bx"></span><span class="t">${t}</span><span class="ini">Initials</span></li>`).join('')}</ul></div>`).join('')}
  </div>
  ${F(10, 'l')}
</section>`;

// ------------------------------------------------------------------ 11 hand-off sheet
const blank = (k, v = '') => `<tr><th>${k}</th><td>${v}</td></tr>`;
const p11 = `<section class="page p11 form">
  <div class="x fh blk">
    <span class="label">For The Electrician</span>
    <h2>Electrician Hand-Off Sheet</h2>
  </div>
  <div class="x hj blk">
    <table class="hand"><tbody>${blank('Job')}${blank('Address / lot')}${blank('Builder contact')}${blank('Supply voltage', '208 V &nbsp;/&nbsp; 240 V &nbsp;/&nbsp; 277 V')}${blank('Panel location and spare capacity')}</tbody></table>
  </div>
  <div class="x hs blk">
    <table class="sched11"><thead><tr><th>Tag</th><th>Zone</th><th>Model</th><th>Watts</th><th>Volts</th><th>Amps<br>(W ÷ V)</th><th>×1.25</th><th>Circuit /<br>breaker</th><th>Mount</th><th>Height<br>AFF</th></tr></thead>
      <tbody>${['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map((t) => `<tr><td class="tag didot">${t}</td>${'<td></td>'.repeat(9)}</tr>`).join('')}</tbody></table>
  </div>
  <div class="x hc blk">
    <span class="label">Controls</span>
    <table class="hand"><tbody>${blank('Affinity controller(s) and channels')}${blank('Controller location')}${blank('Wall-switch location')}${blank('Integration platform', 'Control4 &nbsp;/&nbsp; Crestron &nbsp;/&nbsp; Lutron &nbsp;/&nbsp; none')}${blank('Wi-Fi confirmed at controller', 'Y &nbsp;/&nbsp; N')}</tbody></table>
  </div>
  <div class="x hn blk">
    <span class="label">Notes</span>
    <table class="hand"><tbody>${blank('Recess openings (size, location)')}${blank('Blocking')}${blank('Gas stub-outs (if any)')}${blank('Installation manuals attached', 'Y &nbsp;/&nbsp; N')}</tbody></table>
  </div>
  ${F(11, 'r')}
</section>`;

// ------------------------------------------------------------------ 12 back cover
const SOURCES = [
  'Bromic Heating / Atomik Research. <i>Outdoor Living Trends 2026 (US Homeowner Survey)</i>. 2026.',
  'Bromic Heating. <i>Lookbook 2026</i>. 2026.',
  'Bromic Heating. <i>The Official Outdoor Heating Planning Guide, US v1.2</i>. 2021.',
  'National Fire Protection Association. <i>NFPA 70, National Electrical Code</i>. 2023. nfpa.org',
  'EC&amp;M. <i>Article 424: Fixed Electric Space Heating</i>. 2021. ecmweb.com',
  'National Fire Protection Association. <i>NFPA 54, National Fuel Gas Code (ANSI Z223.1)</i>. 2024. nfpa.org',
];
const p12 = `<section class="page p12">
  ${photo(I('pergola'), 'top12', '50% 60%')}
  <div class="x cap12 caption blk"><b>Ready for warmth</b> – a timber pavilion over an outdoor kitchen, two heaters glowing on the beam.</div>
  <div class="x cta12 blk">
    <span class="label">Your Next Step</span>
    <h2>Settle All Of It Before Framing.</h2>
    <p>Book a design consult, and we will send the layout, heater schedule and controls bundle before framing.</p>
    <span class="btn">Book A Design Consult</span>
  </div>
  <div class="x src12 blk">
    <span class="label">Sources</span>
    <ol class="srcs">${SOURCES.map((s) => `<li>${s}</li>`).join('')}</ol>
  </div>
  <div class="x logo12 blk"><img src="${ROOT}/images/portfolio/bromic-logo.png" alt="Bromic Heating"><span>bromic.com · 1-800-301-1293</span></div>
  ${F(12, 'l')}
</section>`;

const pageCss = `
/* cover */
.cov .full { inset: 0; }
.cov .shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(20,18,19,.42) 0%, rgba(20,18,19,.18) 45%, rgba(20,18,19,0) 70%), linear-gradient(180deg, rgba(20,18,19,.55) 0%, rgba(20,18,19,.12) 30%, rgba(20,18,19,0) 48%, rgba(20,18,19,.15) 66%, rgba(20,18,19,.78) 100%); }
.cov .mast { top: .46in; left: var(--m); right: var(--m); display: flex; justify-content: space-between; align-items: center; }
.cov .mast img { height: .30in; }
.cov .mast .label { color: #fff; opacity: .9; }
.cov .mast .label i { font-style: normal; color: var(--flame); }
.cov .kicker { top: 1.3in; left: var(--m); display: flex; align-items: center; gap: 10pt; }
.cov .kicker::before { content: ''; width: 28pt; height: 1.2pt; background: var(--flame); }
.cov .kicker .label { color: #fff; }
.cov h1 { top: 1.55in; left: calc(var(--m) - 3pt); width: 7.3in; color: #fff; font-size: 70pt; line-height: .9; letter-spacing: -.012em; text-shadow: 0 1px 24px rgba(0,0,0,.18); }
.cov .deck { hyphens: manual; top: 4.42in; left: var(--m); width: 4.2in; color: #fff; font-family: 'Didot', serif; font-size: 15pt; line-height: 1.3; font-style: italic; }
.cov .lines { left: var(--m); right: var(--m); bottom: .86in; display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); }
.cov .lines div { border-top: .6pt solid rgba(255,255,255,.5); padding-top: 8pt; color: #fff; }
.cov .lines .no { font-family: 'Didot', serif; font-size: 22pt; line-height: 1; display: block; margin-bottom: 5pt; }
.cov .lines .t { font-size: 8.2pt; letter-spacing: .16em; text-transform: uppercase; display: block; margin-bottom: 4pt; }
.cov .lines .d { font-size: 8.4pt; line-height: 1.45; color: rgba(255,255,255,.82); }
/* 2 */
.p2 .right-tall { top: 0; right: 0; width: 3.7in; height: 9.45in; }
.p2 .txt { top: .62in; left: var(--m); width: 3.9in; }
.p2 .txt h2 { margin-top: 12pt; }
.p2 .glance { top: 4.3in; left: var(--m); width: 3.9in; border-top: 1.2pt solid var(--flame); padding-top: 10pt; }
.p2 .glance .label { margin-bottom: 7pt; }
.p2 .glance p { font-size: 9pt; }
.p2 .settle { font-size: 17pt; line-height: 1.1; color: var(--ink); margin-top: 10pt; }
.p2 .cap2 { top: 9.55in; left: 4.8in; right: var(--m); }
.p2 .inside { top: 7.05in; left: var(--m); width: 3.9in; }
.p2 .inside .label { margin-bottom: 6pt; }
.p2 .inside ol { list-style: none; border-top: .5pt solid var(--ink); }
.p2 .inside li { display: flex; justify-content: space-between; align-items: baseline; font-size: 8pt; line-height: 1.3; padding: 3.2pt 0; border-bottom: .5pt solid var(--rule); color: var(--body); }
.p2 .inside li i { font-family: 'Didot', serif; font-style: normal; font-size: 10pt; color: var(--ink); }
/* 3 */
.p3 .top-right { top: 0; right: 0; width: 3.62in; height: 5.0in; }
.p3 .txt { top: .62in; left: var(--m); width: 3.86in; }
.p3 .cap3 { top: 5.1in; left: 4.88in; right: var(--m); }
.p3 .pull { top: 3.62in; left: var(--m); width: 3.86in; }
.p3 .when { top: 5.75in; left: var(--m); right: var(--m); border-top: .5pt solid var(--ink); padding-top: 10pt; }
.p3 .wh { display: flex; align-items: baseline; gap: 14pt; margin-bottom: 12pt; }
.p3 .wh h3 { margin: 0; font-size: 20pt; white-space: nowrap; }
.p3 .wh p { font-size: 8.6pt; color: var(--steel); }
.p3 .stages { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); }
.p3 .st .no { font-size: 26pt; line-height: 1; display: block; }
.p3 .st .t { display: block; font-size: 7.4pt; letter-spacing: .16em; text-transform: uppercase; margin: 7pt 0 6pt; color: var(--ink); }
.p3 .st .bar { display: block; height: 3pt; background: var(--flame); margin-bottom: 7pt; }
.p3 .s1 .bar { width: 22%; } .p3 .s2 .bar { width: 58%; } .p3 .s3 .bar { width: 100%; }
.p3 .st p { font-size: 9pt; line-height: 1.5; }
.p3 .opt { top: 8.0in; left: var(--m); right: var(--m); display: grid; grid-template-columns: 2.1in 1fr; gap: .25in; border-top: .5pt solid var(--rule); padding-top: 10pt; }
.p3 .opt p { font-size: 9.6pt; margin: 0; }
/* 4 */
.p4 .top-full { top: 0; left: 0; right: 0; height: 6.7in; }
.p4 .shade4 { position: absolute; top: 0; left: 0; right: 0; height: 6.7in; background: linear-gradient(180deg, rgba(20,18,19,.55) 0%, rgba(20,18,19,.05) 40%, rgba(20,18,19,0) 100%); }
.p4 .head4 { top: .55in; left: var(--m); right: var(--m); }
.p4 .head4 h2 { color: #fff; font-size: 40pt; margin-top: 8pt; white-space: nowrap; text-shadow: 0 1px 18px rgba(0,0,0,.3); }
.p4 .cap4 { top: 6.8in; left: var(--m); width: 4.2in; }
.p4 .intro4 { top: 6.8in; left: 5.0in; right: var(--m); }
.p4 .intro4 .deckp { font-size: 13pt; }
.p4 .steps { top: 7.85in; left: var(--m); right: var(--m); display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--gap); border-top: .5pt solid var(--ink); padding-top: 10pt; }
.p4 .step .no { font-size: 32pt; line-height: 1; display: block; color: var(--ink); }
.p4 .step .t { display: block; font-size: 7.3pt; letter-spacing: .14em; text-transform: uppercase; margin: 8pt 0 3pt; color: var(--ink); line-height: 1.35; }
.p4 .step .who { display: block; font-size: 7.2pt; color: var(--flame); letter-spacing: .03em; margin-bottom: 5pt; line-height: 1.35; }
.p4 .step p { font-size: 8pt; line-height: 1.48; color: #4a4647; }
/* 5 */
.p5 .txt5 { top: .62in; left: var(--m); width: 4.3in; }
.p5 .sq5 { top: .62in; right: var(--m); width: 2.55in; height: 2.55in; }
.p5 .cap5 { top: 3.25in; right: var(--m); width: 2.55in; }
.p5 .tbl5 { top: 3.85in; left: var(--m); right: var(--m); }
.p5 .tbl5 td .tcf { display: inline-block; margin-top: 2pt; }
.p5 .note5 { margin-top: 10pt; max-width: 5.2in; }
/* 6 */
.p6 .txt6 { top: .62in; left: var(--m); width: 4.4in; }
.p6 .big6 { top: .9in; left: 5.25in; right: var(--m); }
.p6 .big6 .n { display: block; font-size: 76pt; line-height: .9; color: var(--ink); }
.p6 .big6 .n i { font-style: normal; font-size: 40pt; }
.p6 .big6 p { font-size: 8.4pt; margin-top: 10pt; }
.p6 .steps6 { top: 3.55in; left: var(--m); right: var(--m); display: grid; grid-template-columns: repeat(3, 1fr); gap: .3in; border-top: .5pt solid var(--ink); padding-top: 10pt; }
.p6 .steps6 .no { font-size: 30pt; line-height: 1; display: block; }
.p6 .steps6 .t { display: block; font-size: 7.4pt; letter-spacing: .16em; text-transform: uppercase; color: var(--ink); margin: 7pt 0 5pt; }
.p6 .steps6 p { font-size: 8.6pt; }
.p6 .steps6 .eq { font-size: 20pt; color: var(--ink); line-height: 1.1; }
.p6 .ex6 { top: 5.3in; left: var(--m); width: 3.75in; }
.p6 .ex6 h3 { margin-top: 6pt; }
.p6 .ex6 .rows > div { grid-template-columns: 1.15in 1fr; }
.p6 .amps6 { top: 5.3in; left: 4.6in; right: var(--m); }
.p6 .amps6 .sub { font-size: 8pt; color: var(--steel); margin: 4pt 0 8pt; }
.p6 table.amps td { padding: 6pt 8pt 6pt 0; }
.p6 table.amps td.m { color: var(--flame); }
.p6 .amps6 .fine { margin-top: 9pt; }
.p6 .bot6 { left: 0; right: 0; bottom: 0; height: 2.75in; }
.p6 .bot6::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,18,19,0) 45%, rgba(20,18,19,.6) 100%); }
.p6 .cap6 { left: var(--m); right: var(--m); bottom: .72in; }
/* 7 */
.p7 .left7 { top: 0; left: 0; width: 3.4in; bottom: 0; }
.p7 .cap7 { left: .35in; width: 2.7in; bottom: .9in; }
.p7 .txt7 { top: .62in; left: 3.85in; right: var(--m); }
.p7 .txt7 h2 { font-size: 28pt; }
.p7 .txt7 .dash { margin-top: 9pt; }
.p7 .txt7 .dash li { font-size: 8.5pt; padding-bottom: 5pt; }
.p7 .rec7 { top: 5.55in; left: 3.85in; right: var(--m); border-top: 1.2pt solid var(--flame); padding-top: 10pt; }
.p7 .rec7 h3 { margin-top: 6pt; }
.p7 .rec7 p { font-size: 8.6pt; }
.p7 .dims { margin: 9pt 0 8pt; }
.p7 .dims > div { grid-template-columns: 1.55in 1fr; padding: 5pt 0; }
.p7 .dims span { font-size: 8.2pt; }
.p7 .site li { font-size: 8.3pt; padding-bottom: 3pt; }
.p7 .folio.f7 { left: 3.85in; }
/* 8 */
.p8 .txt8 { top: .62in; left: var(--m); width: 3.85in; }
.p8 .txt8 h2 { font-size: 27pt; }
.p8 .ctl { margin-top: 10pt; }
.p8 .ctl > div { grid-template-columns: 1.15in 1fr; }
.p8 .ctl span { font-size: 9.2pt; }
.p8 .txt8 p { font-size: 9.8pt; }
.p8 .runs8 { top: 5.55in; left: var(--m); width: 3.85in; }
.p8 .runs8 .label { margin-bottom: 7pt; }
.p8 .runs8 .dash li { font-size: 8.9pt; padding-bottom: 6pt; }
.p8 .gas8 { top: 0; right: 0; width: 3.4in; height: 4.45in; }
.p8 .cap8 { top: 4.55in; left: 4.6in; right: var(--m); }
.p8 .gas8t { top: 5.12in; left: 4.6in; right: var(--m); }
.p8 .gas8t h3 { margin-top: 6pt; font-size: 17pt; }
.p8 .gas8t p { font-size: 8.6pt; }
.p8 .gas8t .dash { margin-top: 8pt; }
.p8 .gas8t .dash li { font-size: 8.2pt; padding-bottom: 5pt; }
/* 9 */
.p9 .top9 { top: 0; left: 0; right: 0; height: 5.1in; }
.p9 .cap9 { top: 5.2in; left: var(--m); right: var(--m); }
.p9 .txt9 { top: 5.75in; left: var(--m); width: 3.3in; }
.p9 .txt9 .deckp { font-size: 13pt; }
.p9 .list9 { top: 5.75in; left: 4.15in; right: var(--m); border-top: .5pt solid var(--ink); padding-top: 10pt; }
.p9 .list9 .check li { font-size: 9.8pt; padding-bottom: 11pt; }
.p9 .disc9 { top: 8.55in; left: var(--m); width: 3.3in; }
.p9 .disc9 .label { margin-bottom: 5pt; }
.p9 .disc9 p { font-size: 7.4pt; line-height: 1.5; color: var(--steel); }
/* forms */
.form .fh { top: .55in; left: var(--m); right: var(--m); }
.form .fh h2 { font-size: 32pt; margin: 6pt 0 10pt; }
.form .job { display: grid; grid-template-columns: auto 1fr auto .9in auto 1fr; gap: 8pt; align-items: end; font-size: 7pt; letter-spacing: .18em; text-transform: uppercase; color: var(--steel); }
.form .job i { border-bottom: .6pt solid var(--ink); height: 14pt; }
.p10 .cl10 { top: 1.95in; left: var(--m); right: var(--m); columns: 2; column-gap: .35in; column-fill: balance; }
.p10 .grp { break-inside: avoid; margin-bottom: 16pt; }
.p10 .gh { display: flex; align-items: baseline; gap: 9pt; border-bottom: .5pt solid var(--ink); padding-bottom: 5pt; margin-bottom: 3pt; }
.p10 .gh .no { font-size: 18pt; line-height: 1; color: var(--flame); }
.p10 .gh h3 { font-size: 15pt; margin: 0; }
.p10 ul { list-style: none; }
.p10 li { display: grid; grid-template-columns: 12pt 1fr auto; gap: 8pt; align-items: start; padding: 7pt 0; border-bottom: .5pt solid var(--rule); }
.p10 .bx { width: 9pt; height: 9pt; border: .8pt solid var(--ink); margin-top: 1pt; }
.p10 .t { font-size: 8.8pt; line-height: 1.4; color: var(--body); }
.p10 .ini { font-size: 5.8pt; letter-spacing: .16em; text-transform: uppercase; color: var(--mist); border-bottom: .5pt solid var(--mist); padding: 6pt 0 1pt; width: .6in; }
.p11 .fh { top: .55in; }
table.hand { width: 100%; border-collapse: collapse; }
table.hand th { width: 2.2in; text-align: left; font-weight: 400; font-size: 7pt; letter-spacing: .16em; text-transform: uppercase; color: var(--ink); padding: 9pt 10pt 4pt 0; border-bottom: .5pt solid var(--rule); vertical-align: bottom; }
table.hand td { border-bottom: .6pt solid var(--ink); font-size: 8.4pt; color: var(--steel); padding: 9pt 0 4pt; vertical-align: bottom; }
.p11 .hj { top: 1.55in; left: var(--m); right: var(--m); }
.p11 .hs { top: 3.75in; left: var(--m); right: var(--m); }
table.sched11 { width: 100%; border-collapse: collapse; table-layout: fixed; }
table.sched11 th { font-weight: 400; font-size: 6.2pt; letter-spacing: .12em; text-transform: uppercase; color: var(--steel); text-align: left; padding: 0 4pt 6pt; border-bottom: .8pt solid var(--ink); vertical-align: bottom; line-height: 1.3; }
table.sched11 td { height: .36in; border-bottom: .5pt solid var(--rule); border-left: .5pt solid var(--rule); }
table.sched11 td:first-child { border-left: 0; }
table.sched11 td.tag { font-size: 12pt; color: var(--ink); padding-left: 4pt; width: .5in; }
.p11 .hc { top: 6.55in; left: var(--m); width: 3.6in; }
.p11 .hn { top: 6.55in; left: 4.35in; right: var(--m); }
.p11 .hc table.hand th, .p11 .hn table.hand th { width: 1.55in; }
.p11 .hc .label, .p11 .hn .label { margin-bottom: 2pt; }
/* 12 */
.p12 .top12 { top: 0; left: 0; right: 0; height: 5.6in; }
.p12 .cap12 { top: 5.7in; left: var(--m); right: var(--m); }
.p12 .cta12 { top: 6.3in; left: var(--m); width: 4.1in; border-top: 1.2pt solid var(--flame); padding-top: 12pt; }
.p12 .cta12 h2 { font-size: 30pt; margin: 8pt 0 10pt; }
.p12 .cta12 p { font-size: 10pt; margin-bottom: 14pt; }
.p12 .src12 { top: 6.3in; left: 5.0in; right: var(--m); border-top: .5pt solid var(--ink); padding-top: 12pt; }
.p12 .src12 .label { margin-bottom: 8pt; }
.p12 .logo12 { left: var(--m); bottom: .95in; display: flex; align-items: center; gap: 14pt; }
.p12 .logo12 img { height: .28in; }
.p12 .logo12 span { font-size: 7pt; letter-spacing: .2em; text-transform: uppercase; color: var(--steel); }
`;

const html = doc(`${TITLE} · Bromic Heating`, pageCss, [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12]);
await render({ dir: here, html, pdf: 'Bromic-A16-Ready-For-Warmth-From-Day-One.pdf', meta: { item_id: 'A16', theme: 'editorial', title: TITLE } });
