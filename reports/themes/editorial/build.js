// Editorial Lookbook theme: a 3-page US Letter sample built from content/guides/A16-pre-wire-guide.md.
// Every line of copy below comes from that file (cut, never added to). Images are Bromic photography
// from images/library. Run: node reports/themes/editorial/build.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '../../..');
const rel = (p) => path.relative(HERE, path.join(ROOT, p)).split(path.sep).join('/');
const img = (id) => rel(`images/library/${id}.webp`);

const IMG = {
  cover: 'w-84-hr-grosveldvandervelde-nl1-2021', // dusk terrace, recessed ceiling heaters
  spread: 'w-connecticut-privateresidence-tungstenelectri-2', // recessed heaters in a porch ceiling
  install: 'w-bromic-shoot-may-11-2023-39', // installers lifting a heater into a recess kit
  kitchen: 'l-010-067', // covered kitchen and bar, heaters flush in the ceiling
};

const css = `
@font-face { font-family: 'Didot'; src: url('${rel('app/src/fonts/gfs-didot-latin.woff2')}') format('woff2'); }
@font-face { font-family: 'Arimo'; src: url('${rel('app/src/fonts/arimo-latin.woff2')}') format('woff2'); }
:root {
  --ink: #231F20; --steel: #6E7377; --mist: #A7ABAE; --rule: #D9DBDC; --flame: #EF4123; --paper: #FFFFFF;
  --m: 0.5in; --col: calc((8.5in - 2 * var(--m) - 11 * 0.18in) / 12); --gap: 0.18in;
}
@page { size: 8.5in 11in; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--paper); }
body { font-family: 'Arimo', 'Helvetica Neue', Arial, sans-serif; font-weight: 400; color: var(--ink);
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 8.5in; height: 11in; position: relative; overflow: hidden; background: var(--paper); page-break-after: always; }
.page:last-child { page-break-after: auto; }
.photo { position: absolute; background-size: cover; background-repeat: no-repeat; }
.didot { font-family: 'Didot', 'Bodoni 72', serif; font-weight: 400; }
.label { font-size: 7.5pt; letter-spacing: 0.22em; text-transform: uppercase; color: var(--flame); }
.smallcaps { font-variant: small-caps; text-transform: lowercase; letter-spacing: 0.08em; }
.caption { font-size: 7.6pt; line-height: 1.45; color: var(--steel); letter-spacing: 0.04em; }
.caption b { font-variant: small-caps; text-transform: lowercase; letter-spacing: 0.1em; font-weight: 400; color: var(--ink); }
p { font-size: 9.4pt; line-height: 1.6; font-weight: 400; color: #3a3637; hyphens: auto; }
sup { font-size: 6pt; color: var(--flame); vertical-align: 3pt; line-height: 0; }

/* folio */
.folio { position: absolute; left: var(--m); right: var(--m); bottom: 0.34in; display: flex; justify-content: space-between;
  align-items: baseline; font-size: 6.8pt; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel);
  border-top: 0.5pt solid var(--rule); padding-top: 7pt; }
.folio .n { font-family: 'Didot', serif; font-size: 10pt; letter-spacing: 0; color: var(--ink); }
.folio.light { color: rgba(255,255,255,.85); border-color: rgba(255,255,255,.35); }
.folio.light .n { color: #fff; }

/* ---------- page 1: cover ---------- */
.p1 .photo { inset: 0; background-position: 62% 50%; }
.p1 .shade { position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(20,18,19,.42) 0%, rgba(20,18,19,.18) 45%, rgba(20,18,19,0) 70%), linear-gradient(180deg, rgba(20,18,19,.55) 0%, rgba(20,18,19,.12) 30%, rgba(20,18,19,0) 48%, rgba(20,18,19,.15) 66%, rgba(20,18,19,.78) 100%); }
.p1 .mast { position: absolute; top: 0.46in; left: var(--m); right: var(--m); display: flex; justify-content: space-between; align-items: center; }
.p1 .mast img { height: 0.30in; }
.p1 .mast .label { color: #fff; opacity: .9; }
.p1 .mast .label i { font-style: normal; color: var(--flame); }
.p1 .kicker { position: absolute; top: 1.3in; left: var(--m); display: flex; align-items: center; gap: 10pt; }
.p1 .kicker::before { content: ''; width: 28pt; height: 1.2pt; background: var(--flame); }
.p1 .kicker span { color: #fff; }
.p1 h1 { position: absolute; top: 1.55in; left: calc(var(--m) - 3pt); width: 7.3in; color: #fff;
  font-size: 70pt; line-height: 0.9; letter-spacing: -0.012em; text-shadow: 0 1px 24px rgba(0,0,0,.18); }
.p1 .deck { position: absolute; top: 4.42in; left: var(--m); width: 3.1in; color: #fff; font-family: 'Didot', serif;
  font-size: 15pt; line-height: 1.3; font-style: italic; }
.p1 .lines { position: absolute; left: var(--m); right: var(--m); bottom: 0.86in; display: grid;
  grid-template-columns: repeat(3, 1fr); gap: var(--gap); }
.p1 .lines div { border-top: 0.6pt solid rgba(255,255,255,.5); padding-top: 8pt; color: #fff; }
.p1 .lines .no { font-family: 'Didot', serif; font-size: 22pt; line-height: 1; display: block; margin-bottom: 5pt; }
.p1 .lines .t { font-size: 8.2pt; letter-spacing: 0.16em; text-transform: uppercase; display: block; margin-bottom: 4pt; }
.p1 .lines .d { font-size: 8.4pt; line-height: 1.45; color: rgba(255,255,255,.82); }

/* ---------- page 2: feature ---------- */
.p2 .spread { top: 0; right: 0; width: 3.62in; height: 5.6in; }
.p2 .cap-spread { position: absolute; top: 5.7in; left: 4.88in; right: var(--m); }
.p2 .pull { position: absolute; top: 5.8in; left: var(--m); width: 3.9in; }
.p2 .text { position: absolute; top: 0.62in; left: var(--m); width: 3.86in; }
.p2 .text .label { display: block; margin-bottom: 12pt; }
.p2 h2 { font-size: 36pt; line-height: 0.98; letter-spacing: -0.008em; margin-bottom: 16pt; }
.p2 .lede { position: relative; }
.p2 .lede::first-letter { font-family: 'Didot', serif; float: left; font-size: 58pt; line-height: 0.78; padding: 5pt 7pt 0 0; color: var(--ink); }
.p2 p + p { margin-top: 7pt; }
.p2 .pull { padding: 0 0 0 12pt; border-left: 1.2pt solid var(--flame); }
.p2 .pull q { font-family: 'Didot', serif; font-size: 14pt; line-height: 1.22; font-style: italic; quotes: '\\201C' '\\201D'; display: block; }
.p2 .steps-head { position: absolute; top: 6.92in; left: var(--m); right: var(--m); display: flex; align-items: baseline; gap: 14pt;
  border-top: 0.5pt solid var(--ink); padding-top: 10pt; }
.p2 .steps-head h3 { font-size: 20pt; line-height: 1; white-space: nowrap; }
.p2 .steps-head p { font-size: 8.6pt; color: var(--steel); }
.p2 .steps { position: absolute; top: 7.58in; left: var(--m); right: var(--m); display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--gap); }
.p2 .step .no { font-family: 'Didot', serif; font-size: 30pt; line-height: 1; display: block; color: var(--ink); }
.p2 .step .t { display: block; font-size: 7.4pt; letter-spacing: 0.16em; text-transform: uppercase; margin: 7pt 0 3pt; color: var(--ink); }
.p2 .step .who { display: block; font-size: 7.2pt; color: var(--flame); letter-spacing: 0.04em; margin-bottom: 5pt; }
.p2 .step .d { font-size: 7.9pt; line-height: 1.45; color: #4a4647; }
.p2 .stat { position: absolute; top: 9.24in; left: var(--m); right: var(--m); display: grid; grid-template-columns: 2.1in 1fr; gap: 0.25in;
  align-items: center; border-top: 0.5pt solid var(--rule); padding-top: 9pt; }
.p2 .stat .big { font-family: 'Didot', serif; font-size: 40pt; line-height: 0.9; }
.p2 .stat p { font-size: 8.2pt; line-height: 1.5; }

/* ---------- page 3: closing ---------- */
.p3 .spread { top: 0; left: 0; width: 3.0in; height: 5.6in; }
.p3 .inset { left: var(--m); top: 6.05in; width: 2.5in; height: 1.66in; }
.p3 .cap-inset { position: absolute; left: var(--m); top: 7.8in; width: 2.5in; }
.p3 .col { position: absolute; top: 0.62in; left: 3.42in; right: var(--m); }
.p3 .col .label { display: block; margin-bottom: 12pt; }
.p3 h2 { font-size: 34pt; line-height: 0.98; letter-spacing: -0.008em; margin-bottom: 13pt; }
.p3 .controls { display: grid; grid-template-columns: 1fr; gap: 0; margin: 12pt 0 0; border-top: 0.5pt solid var(--ink); }
.p3 .controls div { display: grid; grid-template-columns: 1.15in 1fr; gap: 10pt; padding: 7pt 0; border-bottom: 0.5pt solid var(--rule); }
.p3 .controls b { font-weight: 400; font-size: 7.2pt; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink); padding-top: 1.5pt; }
.p3 .controls span { font-size: 8.4pt; line-height: 1.45; color: #3a3637; }
.p3 h3 { font-size: 19pt; line-height: 1; margin: 20pt 0 9pt; }
.p3 .check { list-style: none; columns: 2; column-gap: 0.22in; }
.p3 .check li { font-size: 8.2pt; line-height: 1.4; padding: 0 0 6pt 15pt; position: relative; break-inside: avoid; color: #3a3637; }
.p3 .check li::before { content: ''; position: absolute; left: 0; top: 2.2pt; width: 7pt; height: 7pt; border: 0.7pt solid var(--ink); }
.p3 .cta { position: absolute; left: 3.42in; right: var(--m); top: 7.62in; border-top: 1.2pt solid var(--flame); padding-top: 12pt; }
.p3 .cta .q { font-family: 'Didot', serif; font-size: 23pt; line-height: 1.05; margin: 6pt 0 8pt; }
.p3 .cta p { font-size: 9pt; }
.p3 .cta .btn { display: inline-block; margin-top: 11pt; background: var(--ink); color: #fff; font-size: 7.6pt; letter-spacing: 0.22em;
  text-transform: uppercase; padding: 9pt 16pt; }
.p3 .fine { position: absolute; left: var(--m); right: var(--m); bottom: 0.76in; display: grid; grid-template-columns: 2.5in 1fr; gap: 0.42in; }
.p3 .fine p { font-size: 6.4pt; line-height: 1.45; color: var(--steel); }
.p3 .fine p sup { vertical-align: 2pt; }
`;

const folio = (n, side, light = false) => `
  <div class="folio${light ? ' light' : ''}">${side === 'l'
    ? `<span class="n">${n}</span><span>Ready For Warmth From Day One</span><span>Bromic Heating · For Builders</span>`
    : `<span>Bromic Heating · For Builders</span><span>Ready For Warmth From Day One</span><span class="n">${n}</span>`}</div>`;

// The spread photo runs across the gutter: page 2 shows its left part, page 3 its right part.
// Both boxes are 6.6in tall; the image is sized to the combined width (3.62in + 3.0in).
// Sized to the strip height (5.6in tall → 8.4in wide), centred across the combined 6.62in.
const SPREAD_H = 5.6, SPREAD_IMG_W = SPREAD_H * 1.5, OFF = (SPREAD_IMG_W - 6.62) / 2;
const spreadStyle = (side) => `background-image:url('${img(IMG.spread)}');background-size:auto ${SPREAD_H}in;` +
  `background-position:${side === 'l' ? -OFF : -(OFF + 3.62)}in 0;`;

const html = `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<title>Ready For Warmth From Day One · Editorial Lookbook sample</title><style>${css}</style></head><body>

<section class="page p1">
  <div class="photo" style="background-image:url('${img(IMG.cover)}')"></div>
  <div class="shade"></div>
  <div class="mast"><img src="${rel('images/portfolio/bromic-logo-white.png')}" alt="Bromic Heating"><span class="label">The Builder's Guide <i>·</i> Pre-Wiring Outdoor Heat</span></div>
  <div class="kicker"><span class="label" style="color:#fff">For Builders</span></div>
  <h1 class="didot">Ready For Warmth From Day One</h1>
  <div class="deck">That evening starts at rough-in, with a few circuits, boxes and blocking.</div>
  <div class="lines">
    <div><span class="no">01</span><span class="t">Plan It While The Ceiling Is Open</span><span class="d">A heater planned at the drawing stage sits exactly over the table.</span></div>
    <div><span class="no">02</span><span class="t">Every Trade, In The Right Order</span><span class="d">When each trade knows its moment, the heat goes in once.</span></div>
    <div><span class="no">03</span><span class="t">Circuits Sized Right</span><span class="d">One that never trips on the first cold night.</span></div>
  </div>
  ${folio('', 'r', true).replace('<span class="n"></span>', '<span class="n">&nbsp;</span>')}
</section>

<section class="page p2">
  <div class="photo spread" style="${spreadStyle('l')}"></div>
  <div class="text">
    <span class="label">Plan It While The Ceiling Is Open</span>
    <h2 class="didot">Designed To Fit. Built To Perform.</h2>
    <p class="lede">Picture your buyers on their first evening at home, stepping outside after dinner to a patio that is already warm. That evening starts at rough-in, with a few circuits, boxes and blocking that cost little while the ceiling is open and save a callback later.</p>
    <p>Fewer than one in four homeowners prioritize heating at planning.<sup>1</sup> Many of the rest ask for it once the drywall, soffits and stone are finished, and by then it means opening a finished ceiling, running surface conduit and placing the heater wherever the wire reaches instead of over the table.</p>
    <p>A pre-wire package of circuits, boxes, blocking and a switch box can be sold at the options stage even when the heaters are bought later, so your buyers move into an outdoor space that is ready for warmth whenever they choose.</p>
  </div>
  <div class="caption cap-spread"><b>Flush in the ceiling</b> – heaters recessed into a porch ceiling, the detail buyers notice in the model home.</div>
  <div class="pull"><q>A heater planned at the drawing stage sits exactly over the table, flush in a clean ceiling, with nothing to patch.</q></div>

  <div class="steps-head"><h3 class="didot">Every Trade, In The Right Order</h3><p>When each trade knows its moment, the heat goes in once and the schedule holds.</p></div>
  <div class="steps">
    <div class="step"><span class="no">1</span><span class="t">Plans</span><span class="who">Builder, designer, Bromic design service</span><span class="d">Heated zones, heater type and count, mount type, fuel.</span></div>
    <div class="step"><span class="no">2</span><span class="t">Pre-framing</span><span class="who">Framer, builder</span><span class="d">Recess openings, blocking, ceiling build-up.</span></div>
    <div class="step"><span class="no">3</span><span class="t">Electrical</span><span class="who">Licensed electrician</span><span class="d">Circuits, boxes, control runs, switch location, panel capacity.</span></div>
    <div class="step"><span class="no">4</span><span class="t">Gas</span><span class="who">Licensed gas fitter</span><span class="d">Line size, stub-out, shut-off.</span></div>
    <div class="step"><span class="no">5</span><span class="t">Inspection</span><span class="who">AHJ</span><span class="d">Inspect before close-in.</span></div>
    <div class="step"><span class="no">6</span><span class="t">Trim-out</span><span class="who">Electrician, gas fitter</span><span class="d">Heaters, recess kits, controllers, commissioning.</span></div>
  </div>
  <div class="stat">
    <div class="big">125<span style="font-size:24pt">%</span></div>
    <p><span class="label" style="display:block;margin-bottom:4pt">Circuits Sized Right The First Time</span>Fixed electric space heating is a continuous load: NEC Article 424 sizes its branch-circuit conductors at not less than 125% of the load.<sup>2</sup> Three 3400 W heaters on 240 V draw 14.2 A each – 17.7 A at 125% – so split them across circuits.</p>
  </div>
  ${folio(2, 'l')}
</section>

<section class="page p3">
  <div class="photo spread" style="${spreadStyle('r')}"></div>
  <div class="photo inset" style="background-image:url('${img(IMG.install)}');background-position:50% 30%"></div>
  <div class="caption cap-inset"><b>Trim-out</b> – a Platinum Smart-Heat Electric heater lifted into its recess kit, set flush within the ceiling cavity.<sup>3</sup></div>

  <div class="col">
    <span class="label">Wiring The Controls</span>
    <h2 class="didot">Warmth Exactly Where, And When, They Want It</h2>
    <p>Rough in Affinity Smart-Heat® Controls together with the heater circuits, and specify the matching control for every heater, plus a wall switch.</p>
    <div class="controls">
      <div><b>Platinum, Tungsten Electric</b><span>Affinity Smart-Heat® On/Off or Dimmer controller, with a wall switch.</span></div>
      <div><b>Eclipse</b><span>Eclipse controller, with a wall switch.</span></div>
      <div><b>Wi-Fi and app</b><span>Require compatible Affinity Smart-Heat Controls, sold separately.<sup>3</sup></span></div>
      <div><b>Tungsten Series II</b><span>Select and Coastal available now, with the Affinity Smart-Heat® Dimmer as standard; Classic from January 2027.</span></div>
    </div>
    <h3 class="didot">Before Close-In</h3>
    <ul class="check">
      <li>Circuits match the approved plan and load calculation</li>
      <li>Junction box at every heater; heights ≥ 72" wall, ≥ 96" ceiling</li>
      <li>Blocking in place for every heater and pole</li>
      <li>Recess openings framed to the manual</li>
      <li>Home runs to the Affinity controller location</li>
      <li>Wall-switch box at the threshold</li>
      <li>Wi-Fi coverage confirmed at controller</li>
      <li>Gas line pressure-tested and capped; shut-offs accessible</li>
    </ul>
  </div>

  <div class="cta">
    <span class="label">Your Next Step</span>
    <div class="q didot">Settle All Of It Before Framing.</div>
    <p>We will send the layout, heater schedule and controls bundle before framing.</p>
    <span class="btn">Book A Design Consult</span>
  </div>

  <div class="fine">
    <p>This guide is general guidance, not an engineering or code determination. Confirm requirements with the local building authority. Electrical work by a licensed electrician to the adopted NFPA 70; gas work by a licensed gas fitter to ANSI Z223.1/NFPA 54; both to the manufacturer's installation instructions.</p>
    <p><sup>1</sup> Bromic Heating / Atomik Research, Outdoor Living Trends 2026 (US Homeowner Survey), 2026. &nbsp;<sup>2</sup> EC&amp;M, Article 424: Fixed Electric Space Heating, 2021; NFPA 70, National Electrical Code, 2023. &nbsp;<sup>3</sup> Bromic Heating, Lookbook 2026; The Official Outdoor Heating Planning Guide, US v1.2, 2021.</p>
  </div>
  ${folio(3, 'r')}
</section>
</body></html>`;

(async () => {
  fs.writeFileSync(path.join(HERE, 'sample.html'), html);
  fs.mkdirSync(path.join(HERE, 'pages'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(HERE, 'sample.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  // print QA: any text box that runs past its page or overlaps a sibling text box
  const problems = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.page').forEach((pg, i) => {
      const pr = pg.getBoundingClientRect();
      pg.querySelectorAll('p,h1,h2,h3,li,.caption,.step,.folio,.cta,.deck,.lines div').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > pr.bottom + 0.5 || r.right > pr.right + 0.5 || r.left < pr.left - 0.5) out.push(`p${i + 1} off page: ${el.className || el.tagName} "${el.textContent.trim().slice(0, 40)}"`);
        if (el.scrollHeight > el.clientHeight + 1 && getComputedStyle(el).overflow !== 'visible') out.push(`p${i + 1} clipped: ${el.textContent.trim().slice(0, 40)}`);
      });
      const blocks = [...pg.querySelectorAll(':scope > .text, :scope > .col, :scope > .steps, :scope > .steps-head, :scope > .stat, :scope > .cta, :scope > .fine, :scope > .folio, :scope > .caption, :scope > .inset, :scope > .spread, :scope > h1, :scope > .deck, :scope > .lines, :scope > .kicker')];
      for (let a = 0; a < blocks.length; a++) for (let b = a + 1; b < blocks.length; b++) {
        const A = blocks[a].getBoundingClientRect(), B = blocks[b].getBoundingClientRect();
        if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) out.push(`p${i + 1} overlap: ${blocks[a].className} × ${blocks[b].className}`);
      }
    });
    return out;
  });
  const pages = await page.$$('.page');
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(HERE, 'pages', `p${i + 1}.png`) });
  await page.pdf({ path: path.join(HERE, 'sample.pdf'), width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log(problems.length ? 'QA:\n' + problems.join('\n') : 'QA: clean');
})();
