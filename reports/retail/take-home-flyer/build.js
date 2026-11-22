// Bromic take-home flyer: the two-sided sheet a retail associate hands a shopper.
// US Letter (front + back) and a half-letter (5.5 x 8.5 in) version, in the Editorial Lookbook theme
// (reports/themes/editorial). Copy is cut from data/retail/retail.json, data/product-facts.json and
// data/product-marketing/*.json – no prices, every heater with its controls.
// Run: node reports/retail/take-home-flyer/build.js   (needs python3 with Pillow, segno and opencv for the QR check)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '../../..');
const rel = (p) => path.relative(HERE, path.join(ROOT, p)).split(path.sep).join('/');
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, 'flyer.json'), 'utf8'));
const QR = Object.fromEntries(cfg.qr.map((q) => [q.id, q]));
const qrImg = (id) => `<img class="qr" src="img/qr-${id}.png" alt="QR code: ${QR[id].url}">`;
const shortUrl = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const R = '®';
const PICKS = [
  { img: 'pick-platinum', pos: '62% 40%', space: 'Covered Patio, Ceiling Or Wall', name: `Platinum Smart-Heat${R} Electric`,
    d: 'A tinted glass-ceramic face in a body just 2.1 in deep, mounted or set flush into a 7.1 in ceiling cavity.',
    c: `Affinity Smart-Heat${R} Dimmer or On/Off, plus a wall switch` },
  { img: 'pick-eclipse', pos: '50% 30%', space: 'Over The Dining Table', name: `Eclipse Smart-Heat${R} Electric Pendant`,
    d: 'Radiant heat and a warm, dimmable 3000K LED ring in one fixture, in three heat settings.',
    c: `Affinity Smart-Heat${R} Eclipse Controller, or Eclipse Dimmer Controller with remote, plus a wall switch` },
  { img: 'pick-freestanding', pos: '40% 50%', space: 'Open Seating, No Roof', name: `Eclipse Smart-Heat${R} Freestanding`,
    d: 'An arched arm on a weighted base with two wheels that plugs into an outdoor outlet.',
    c: 'Eclipse Dimmer Controller and remote, included' },
  { img: 'pick-gas', pos: '30% 40%', space: 'Heat On Gas', name: `Platinum Gas · Tungsten Freestanding Gas`,
    d: 'Platinum Gas mounts under cover; the Tungsten tower rolls to wherever tonight’s seating is, on propane or natural gas.',
    c: `Platinum Gas: Affinity Smart-Heat${R} On/Off or a wall switch. The tower: its own knob` },
  { img: 'pick-tungsten', pos: '50% 30%', space: 'Pitched Porch Or Coastal Home', name: `Tungsten Smart-Heat${R} Electric Series II`,
    d: 'Mounts on pitched ceilings from 3/12 to 12/12 with its adaptor; the Coastal tier is built for life by the water.',
    c: `Affinity Smart-Heat${R} Dimmer, plus a wall switch` },
];

const QUESTIONS = [
  { t: 'Your Space', d: 'Is it covered, partly covered or open? Count the seats: plan about 20 ft² a seat.' },
  { t: 'Mounting', d: 'Ceiling, wall, recessed flush, on a pole – or freestanding, so it moves with the table?' },
  { t: 'Power Or Fuel', d: 'An electric circuit at 208 V or 220–240 V, or a natural gas or propane line?' },
];

const css = (fmt) => `
@font-face { font-family: 'Didot'; src: url('${rel('app/src/fonts/gfs-didot-latin.woff2')}') format('woff2'); }
@font-face { font-family: 'Arimo'; src: url('${rel('app/src/fonts/arimo-latin.woff2')}') format('woff2'); font-weight: 100 900; }
:root { --ink: #231F20; --steel: #6E7377; --mist: #A7ABAE; --rule: #D9DBDC; --flame: #EF4123; --paper: #FFFFFF; --body: #3a3637; }
@page { size: ${fmt === 'half' ? '5.5in 8.5in' : '8.5in 11in'}; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--paper); }
body { font-family: 'Arimo', 'Helvetica Neue', Arial, sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.didot { font-family: 'Didot', 'Bodoni 72', serif; font-weight: 400; }
.label { font-size: 7.2pt; letter-spacing: 0.22em; text-transform: uppercase; color: var(--flame); }
.page { width: 8.5in; height: 11in; position: relative; overflow: hidden; background: var(--paper); page-break-after: always; --m: 0.5in; }
.page:last-child { page-break-after: auto; }
.photo { position: absolute; background-size: cover; background-repeat: no-repeat; }

/* ---------- front ---------- */
.front .photo { inset: 0; background-position: 50% 50%; }
.front .shade { position: absolute; inset: 0; background:
  radial-gradient(ellipse 70% 30% at 22% 36%, rgba(24,18,14,.5) 0%, rgba(24,18,14,0) 100%),
  linear-gradient(180deg, rgba(24,18,14,.66) 0%, rgba(24,18,14,.42) 22%, rgba(24,18,14,.10) 38%, rgba(24,18,14,0) 48%, rgba(24,18,14,.45) 64%, rgba(24,18,14,.82) 78%, rgba(24,18,14,.92) 100%); }
.front .mast { position: absolute; top: 0.46in; left: var(--m); right: var(--m); display: flex; justify-content: space-between; align-items: center; }
.front .mast img { height: 0.30in; }
.front .mast .label { color: #fff; opacity: .92; }
.front .kicker { position: absolute; top: 1.28in; left: var(--m); display: flex; align-items: center; gap: 10pt; }
.front .kicker::before { content: ''; width: 28pt; height: 1.2pt; background: var(--flame); }
.front .kicker .label { color: #fff; }
.front .hero { position: absolute; top: 1.5in; left: var(--m); right: var(--m); }
.front h1 { margin-left: -3pt; color: #fff; font-size: 80pt; line-height: 0.92; letter-spacing: -0.012em; text-shadow: 0 1px 26px rgba(0,0,0,.25); }
.front .deck { margin-top: 16pt; width: 3.9in; color: #fff; font-family: 'Didot', serif; font-size: 16pt;
  line-height: 1.3; font-style: italic; text-shadow: 0 1px 14px rgba(0,0,0,.4); }
.front .why { position: absolute; left: var(--m); right: var(--m); bottom: 0.84in; }
.front .reasons-h { color: #fff; display: flex; align-items: center; gap: 10pt; margin-bottom: 12pt; }
.front .reasons-h .label { color: #fff; }
.front .reasons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.24in; }
.front .reasons div { border-top: 1.2pt solid var(--flame); padding-top: 9pt; color: #fff; }
.front .reasons .no { font-family: 'Didot', serif; font-size: 24pt; line-height: 1; display: block; margin-bottom: 6pt; }
.front .reasons .t { font-family: 'Didot', serif; font-size: 13.5pt; line-height: 1.12; display: block; margin-bottom: 5pt; }
.front .reasons .d { font-size: 8.4pt; line-height: 1.48; color: rgba(255,255,255,.86); display: block; }
.front .reasons .d small { display: block; font-size: 6.9pt; margin-top: 4pt; color: rgba(255,255,255,.72); }
.folio { position: absolute; left: var(--m); right: var(--m); bottom: 0.36in; display: flex; justify-content: space-between; align-items: baseline;
  font-size: 6.8pt; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); border-top: 0.5pt solid var(--rule); padding-top: 7pt; }
.folio.light { color: rgba(255,255,255,.88); border-color: rgba(255,255,255,.35); }
.folio b { font-weight: 400; color: var(--flame); }

/* ---------- back ---------- */
.back .head { position: absolute; top: 0.48in; left: var(--m); right: var(--m); display: flex; justify-content: space-between; align-items: flex-start; }
.back .head .label { display: block; margin-bottom: 8pt; }
.back .head h2 { font-size: 30pt; line-height: 1; letter-spacing: -0.006em; }
.back .head img { height: 0.26in; margin-top: 2pt; }
.back .picks { position: absolute; top: 1.36in; left: var(--m); width: 4.42in; border-top: 0.6pt solid var(--ink); }
.back h3 { font-size: 15.5pt; line-height: 1; margin: 9pt 0 8pt; }
.back .pick { display: grid; grid-template-columns: 0.8in 1fr; gap: 11pt; padding: 6.5pt 0; border-bottom: 0.5pt solid var(--rule); }
.back .pick .ph { width: 0.8in; height: 0.8in; background-size: cover; position: relative; }
.back .pick .sp { display: block; font-size: 6.6pt; letter-spacing: 0.18em; text-transform: uppercase; color: var(--flame); margin-bottom: 3pt; }
.back .pick .n { display: block; font-family: 'Didot', serif; font-size: 11.6pt; line-height: 1.12; margin-bottom: 3pt; }
.back .pick .d { display: block; font-size: 7.5pt; line-height: 1.38; color: var(--body); margin-bottom: 3pt; }
.back .pick .c { display: block; font-size: 7.4pt; line-height: 1.38; color: var(--ink); }
.back .pick .c b { font-weight: 400; font-size: 6.2pt; letter-spacing: 0.18em; text-transform: uppercase; color: var(--steel); margin-right: 4pt; }
.back .wifi { font-size: 6.6pt; line-height: 1.4; color: var(--steel); margin-top: 6pt; }
.back .side { position: absolute; top: 1.36in; left: 5.24in; right: var(--m); border-top: 0.6pt solid var(--ink); }
.back .qs { list-style: none; }
.back .qs li { display: grid; grid-template-columns: 0.3in 1fr; padding: 6pt 0 7pt; border-bottom: 0.5pt solid var(--rule); }
.back .qs .no { font-family: 'Didot', serif; font-size: 17pt; line-height: 0.95; }
.back .qs .t { display: block; font-size: 6.8pt; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 3pt; }
.back .qs .d { display: block; font-size: 7.7pt; line-height: 1.42; color: var(--body); }
.back .need h3 { margin-top: 15pt; }
.back .need .k { display: block; font-size: 6.6pt; letter-spacing: 0.18em; text-transform: uppercase; color: var(--flame); margin: 6pt 0 3pt; }
.back .need ul { list-style: none; }
.back .need li { font-size: 7.4pt; line-height: 1.4; color: var(--body); padding: 0 0 3.5pt 10pt; position: relative; }
.back .need li::before { content: ''; position: absolute; left: 0; top: 4.2pt; width: 4pt; height: 0.8pt; background: var(--ink); }
.back .need .short { display: none; }
.back .need .legal { font-size: 6.7pt; line-height: 1.42; color: var(--ink); margin-top: 6pt; padding-top: 5pt; border-top: 0.5pt solid var(--rule); }
.back .act { position: absolute; left: var(--m); right: var(--m); bottom: 0.62in; height: 2.02in; display: grid; grid-template-columns: 4.42in 1fr; gap: 0.3in;
  border-top: 1.2pt solid var(--flame); padding-top: 10pt; }
.back .act .label { display: block; margin-bottom: 7pt; }
.back .codes { display: grid; grid-template-columns: 1fr 1fr 1.3in; gap: 0.18in; align-items: start; }
.back .code .qr { width: 1.0in; height: 1.0in; display: block; margin: 0 0 4pt -0.07in; image-rendering: pixelated; }
.back .code .t { display: block; font-family: 'Didot', serif; font-size: 11pt; line-height: 1.1; margin-bottom: 2pt; }
.back .code .u { display: block; font-size: 6.4pt; color: var(--steel); letter-spacing: 0.02em; word-break: break-all; }
.back .phone { font-size: 7.2pt; line-height: 1.45; color: var(--body); padding-top: 2pt; }
.back .phone b { display: block; font-family: 'Didot', serif; font-weight: 400; font-size: 11.5pt; line-height: 1.1; color: var(--ink); margin-bottom: 4pt; }
.back .boxes { display: grid; grid-template-columns: 1fr; gap: 0.1in; }
.back .box { border: 0.7pt solid var(--ink); height: 0.78in; padding: 7pt 8pt; position: relative; }
.back .box .label { color: var(--ink); margin: 0; font-size: 6.6pt; }
.back .box.notes { background: repeating-linear-gradient(180deg, transparent 0, transparent 17pt, var(--rule) 17pt, var(--rule) 17.6pt); background-position: 0 20pt; background-origin: content-box; }

/* ---------- half-letter: the same two sides, re-set for 5.5 x 8.5 in ---------- */
${fmt === 'half' ? `
.page { width: 5.5in; height: 8.5in; --m: 0.34in; }
.front .mast { top: 0.32in; } .front .mast img { height: 0.22in; } .front .mast .label { font-size: 5.6pt; letter-spacing: 0.18em; }
.front .kicker { top: 0.86in; } .front .kicker::before { width: 20pt; }
.front .kicker .label { font-size: 6pt; }
.front .hero { top: 1.04in; } .front h1 { font-size: 54pt; }
.front .deck { margin-top: 10pt; width: 3.1in; font-size: 12pt; }
.front .why { bottom: 0.62in; } .front .reasons-h { margin-bottom: 7pt; } .front .reasons-h .label { font-size: 6pt; }
.front .reasons { grid-template-columns: 1fr; gap: 7pt; }
.front .reasons div { display: grid; grid-template-columns: 0.36in 1fr; column-gap: 6pt; padding-top: 6pt; border-top-width: 0.9pt; }
.front .reasons .no { font-size: 16pt; grid-row: span 2; margin: 0; }
.front .reasons .t { font-size: 11pt; margin-bottom: 2pt; }
.front .reasons .d { font-size: 7.4pt; line-height: 1.4; }
.front .reasons .d small { font-size: 6.2pt; margin-top: 2pt; }
.folio { bottom: 0.24in; font-size: 5.6pt; letter-spacing: 0.16em; padding-top: 5pt; }
.back .head { top: 0.32in; } .back .head h2 { font-size: 20pt; } .back .head .label { font-size: 6pt; margin-bottom: 5pt; } .back .head img { height: 0.18in; }
.back .picks { top: 0.92in; width: auto; right: var(--m); }
.back h3 { font-size: 11.5pt; margin: 6pt 0 4pt; }
.back .pick { grid-template-columns: 0.46in 1fr; gap: 8pt; padding: 4pt 0; align-items: center; }
.back .pick .ph { width: 0.46in; height: 0.46in; }
.back .pick .sp { font-size: 5.4pt; margin-bottom: 1.5pt; }
.back .pick .n { font-size: 9.2pt; margin-bottom: 1.5pt; }
.back .pick .d { display: none; }
.back .pick .c { font-size: 6.7pt; line-height: 1.32; } .back .pick .c b { font-size: 5.4pt; }
.back .wifi { font-size: 5.9pt; margin-top: 4pt; }
.back .side { top: 4.6in; left: var(--m); right: var(--m); display: grid; grid-template-columns: 1fr 1fr; gap: 0.18in; border-top: 0.6pt solid var(--ink); }
.back .qs li { grid-template-columns: 0.2in 1fr; padding: 3.5pt 0 4pt; }
.back .qs .no { font-size: 11pt; } .back .qs .t { font-size: 5.6pt; margin-bottom: 1.5pt; } .back .qs .d { font-size: 6.5pt; line-height: 1.32; }
.back .need h3 { margin-top: 6pt; } .back .side h3 { font-size: 10.5pt; }
.back .need .k { font-size: 5.4pt; margin: 2pt 0 2pt; }
.back .need ul { display: none; } .back .need .short { display: block; font-size: 6.4pt; line-height: 1.34; color: var(--body); }
.back .need .legal { font-size: 5.9pt; line-height: 1.32; margin-top: 3pt; padding-top: 3pt; }
.back .act { bottom: 0.46in; height: 1.5in; grid-template-columns: 2.86in 1fr; gap: 0.16in; padding-top: 6pt; border-top-width: 0.9pt; }
.back .act .label { font-size: 5.8pt; margin-bottom: 4pt; }
.back .codes { grid-template-columns: 1fr 1fr; gap: 0.1in; }
.back .code .qr { width: 0.74in; height: 0.74in; margin: 0 0 3pt -0.05in; }
.back .code .t { font-size: 8.2pt; white-space: nowrap; } .back .code .u { font-size: 5.2pt; }
.back .phone { display: none; }
.back .boxes { grid-template-columns: 1fr; gap: 0.08in; }
.back .box { height: 0.6in; padding: 4pt 6pt; } .back .box .label { font-size: 5.4pt; }
.back .box.notes { background-size: auto; background: repeating-linear-gradient(180deg, transparent 0, transparent 12pt, var(--rule) 12pt, var(--rule) 12.5pt); background-origin: content-box; background-position: 0 12pt; }
` : ''}
`;

const html = (fmt) => `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<title>Bromic Take-Home Flyer${fmt === 'half' ? ' · Half Letter' : ''}</title><style>${css(fmt)}</style></head><body>

<section class="page front">
  <div class="photo" style="background-image:url('img/front.jpg')"></div>
  <div class="shade"></div>
  <div class="mast"><img src="${rel('images/portfolio/bromic-logo-white.png')}" alt="Bromic Heating"><span class="label">Your Take-Home Guide To Outdoor Heat</span></div>
  <div class="kicker"><span class="label">For Your Outdoor Space</span></div>
  <div class="hero"><h1 class="didot">Extend The Moment</h1>
  <div class="deck">Radiant warmth turns a cool evening into one more hour around the table, season after season.</div></div>
  <div class="why"><div class="reasons-h"><span class="label">Why Bromic</span></div>
  <div class="reasons">
    <div><span class="no">01</span><span class="t">Heat You Can Feel, Not See</span><span class="d">Radiant infrared warms people and objects directly, so it holds up in a light breeze. Bromic electric heaters are warm in about 30 seconds.</span></div>
    <div><span class="no">02</span><span class="t">Designed Around Your Space</span><span class="d">Platinum Smart-Heat${R} Electric is just 2.1 in deep and can sit flush in the ceiling. Eclipse adds a warm, dimmable LED ring over the table.</span></div>
    <div><span class="no">03</span><span class="t">Exactly Where, And When, You Want It</span><span class="d">Every Bromic heater is paired with Affinity Smart-Heat${R} Controls: dim Platinum and Tungsten Electric in 1% steps, with zones and schedules in the Bromic app.<small>Wi-Fi and app features need compatible Affinity Smart-Heat${R} Controls, sold separately.</small></span></div>
  </div></div>
  <div class="folio light"><span>Bromic Heating · bromic.com</span><span>Turn Over To Find Your Heater <b>→</b></span></div>
</section>

<section class="page back">
  <div class="head">
    <div><span class="label">Plan Your Space</span><h2 class="didot">Find The Warmth That Fits</h2></div>
    <img src="${rel('images/portfolio/bromic-logo.png')}" alt="Bromic Heating">
  </div>

  <div class="picks">
    <h3 class="didot">Which Heater For Your Space</h3>
    ${PICKS.map((p) => `<div class="pick"><div class="ph" style="background-image:url('img/${p.img}.jpg');background-position:${p.pos}"></div>
      <div><span class="sp">${p.space}</span><span class="n">${p.name}</span><span class="d">${p.d}</span>
      <span class="c"><b>Controls</b>${p.c}</span></div></div>`).join('\n    ')}
    <p class="wifi">Wi-Fi and app features need compatible Affinity Smart-Heat${R} Controls, sold separately. Tungsten Series II Classic from January 2027.</p>
  </div>

  <div class="side">
    <div>
      <h3 class="didot">Three Questions To Ask Yourself</h3>
      <ol class="qs">${QUESTIONS.map((q, i) => `<li><span class="no didot">${i + 1}</span><div><span class="t">${q.t}</span><span class="d">${q.d}</span></div></li>`).join('')}</ol>
    </div>
    <div class="need">
      <h3 class="didot">What Your Installer Will Need</h3>
      <span class="k">Electric</span>
      <ul>
        <li>A hard-wired circuit at 208 V or 220–240 V, sized by your electrician – or an outdoor outlet for Eclipse Freestanding.</li>
        <li>A junction box at each heater: wall mounts at least 72 in above the floor, ceiling mounts at least 96 in (varies with output).</li>
        <li>A place for the Affinity controller and a wall switch, with Wi-Fi there for the app.</li>
        <li class="long">For a flush ceiling, room for the recess kit – a 7.1 in cavity for Platinum Electric.</li>
      </ul>
      <p class="short">A circuit at 208 V or 220–240 V (an outdoor outlet for Eclipse Freestanding), a junction box at each heater, and a place for the Affinity controller and a wall switch.</p>
      <span class="k">Gas</span>
      <ul>
        <li>A natural gas or propane line with an accessible shut-off.</li>
        <li>Mounted gas heaters sit under cover at least 96 in above the floor and also need 110 V for ignition and controls.</li>
      </ul>
      <p class="short">A natural gas or propane line with a shut-off. Mounted gas heaters sit under cover, at least 96 in above the floor, with 110 V for ignition and controls.</p>
      <p class="legal">Installation by a licensed electrician or gas fitter to local codes. Check every installation with your local building authority.</p>
    </div>
  </div>

  <div class="act">
    <div>
      <span class="label">Scan To Plan</span>
      <div class="codes">
        ${['design', 'sizing'].map((id) => `<div class="code" data-qr="${id}">${qrImg(id)}<span class="t">${QR[id].label}</span><span class="u">${shortUrl(QR[id].url)}</span></div>`).join('')}
        <p class="phone"><b>Or Call Our Design Team</b>A complimentary design service: heater selection and placement from your photos or plans. 1-800-301-1293, Mon–Fri 9–4 PT.</p>
      </div>
    </div>
    <div class="boxes">
      <div class="box stamp"><span class="label">Your Retailer</span></div>
      <div class="box notes"><span class="label">Your Notes</span></div>
    </div>
  </div>
  <div class="folio"><span>Bromic Heating · bromic.com</span><span>Ask Your Retailer For Pricing</span></div>
</section>
</body></html>`;

async function render(browser, fmt) {
  const file = fmt === 'half' ? 'index-half-letter.html' : 'index.html';
  fs.writeFileSync(path.join(HERE, file), html(fmt));
  const [w, h] = fmt === 'half' ? [528, 816] : [816, 1056];
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(HERE, file));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  const problems = await page.evaluate(() => {
    const out = [];
    const fonts = [...document.fonts].filter((f) => f.status !== 'loaded').map((f) => f.family);
    if (fonts.length) out.push('font not loaded: ' + fonts.join(', '));
    document.querySelectorAll('img').forEach((im) => { if (!im.complete || !im.naturalWidth) out.push('missing image: ' + im.src); });
    document.querySelectorAll('.photo, .ph').forEach((el) => { if (!/url\(/.test(getComputedStyle(el).backgroundImage)) out.push('missing background: ' + el.className); });
    document.querySelectorAll('.page').forEach((pg, i) => {
      const pr = pg.getBoundingClientRect();
      pg.querySelectorAll('p,h1,h2,h3,li,span,.pick,.box,.code,.qr,.folio').forEach((el) => {
        if (getComputedStyle(el).display === 'none') return;
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        if (r.bottom > pr.bottom + 0.5 || r.right > pr.right + 0.5 || r.left < pr.left - 0.5 || r.top < pr.top - 0.5) out.push(`p${i + 1} off page: ${el.className || el.tagName} "${el.textContent.trim().slice(0, 40)}"`);
        if (el.scrollHeight > el.clientHeight + 1 && getComputedStyle(el).overflow !== 'visible') out.push(`p${i + 1} clipped: ${el.textContent.trim().slice(0, 40)}`);
      });
      // every block's content must stay inside the block (nothing spills out of a column)
      pg.querySelectorAll(':scope > .picks, :scope > .side, :scope > .act, :scope > .why, :scope > .hero, :scope .box, :scope .code').forEach((blk) => {
        const b = blk.getBoundingClientRect();
        blk.querySelectorAll('*').forEach((el) => {
          if (getComputedStyle(el).display === 'none') return;
          const r = el.getBoundingClientRect();
          if (r.width && (r.bottom > b.bottom + 1 || r.right > b.right + 1)) out.push(`p${i + 1} spills out of ${blk.className}: ${el.className || el.tagName} "${el.textContent.trim().slice(0, 30)}"`);
        });
      });
      const blocks = [...pg.querySelectorAll(':scope > .mast, :scope > .kicker, :scope > .hero, :scope > .why, :scope > .head, :scope > .picks, :scope > .side, :scope > .act, :scope > .folio')];
      for (let a = 0; a < blocks.length; a++) for (let b = a + 1; b < blocks.length; b++) {
        const A = blocks[a].getBoundingClientRect(), B = blocks[b].getBoundingClientRect();
        if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) out.push(`p${i + 1} overlap: ${blocks[a].className || blocks[a].tagName} × ${blocks[b].className || blocks[b].tagName}`);
      }
    });
    // copy rules: no prices, no long dash, no exclamation mark, every heater line names its controls
    const text = document.body.innerText;
    if (/\$\s?\d/.test(text)) out.push('a price appears');
    if (/—/.test(text)) out.push('a long dash appears');
    if (/!/.test(text)) out.push('an exclamation mark appears');
    document.querySelectorAll('.pick').forEach((p) => { if (!p.querySelector('.c b')) out.push('pick without controls: ' + p.textContent.slice(0, 40)); });
    return out;
  });
  const shots = path.join(HERE, 'pages');
  fs.mkdirSync(shots, { recursive: true });
  const sections = await page.$$('.page');
  const names = ['front', 'back'];
  for (let i = 0; i < sections.length; i++) await sections[i].screenshot({ path: path.join(shots, `${fmt === 'half' ? 'half-' : ''}${names[i]}.png`) });
  // a 4x render of the back for the QR scan test
  const big = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 4 });
  await big.goto('file://' + path.join(HERE, file));
  await big.evaluate(() => document.fonts.ready);
  for (const id of ['design', 'sizing']) await (await big.$(`[data-qr="${id}"] .qr`)).screenshot({ path: path.join(HERE, 'img', `scan-${fmt}-${id}.png`) });
  await big.close();
  const pdf = fmt === 'half' ? 'Bromic-Take-Home-Flyer-Half-Letter.pdf' : 'Bromic-Take-Home-Flyer.pdf';
  await page.pdf({ path: path.join(HERE, pdf), width: fmt === 'half' ? '5.5in' : '8.5in', height: fmt === 'half' ? '8.5in' : '11in', printBackground: true, preferCSSPageSize: true });
  await page.close();
  return problems.map((p) => `[${fmt}] ${p}`);
}

(async () => {
  execFileSync('python3', [path.join(HERE, 'prep.py')], { stdio: 'inherit' });
  const browser = await chromium.launch();
  const problems = [...await render(browser, 'letter'), ...await render(browser, 'half')];
  await browser.close();
  // QR: decode what was actually rendered on the page, and the PDF's page rendered back to pixels
  const scan = execFileSync('python3', [path.join(HERE, 'qrcheck.py')], { encoding: 'utf8' });
  process.stdout.write(scan);
  if (/FAIL/.test(scan)) problems.push('a QR code does not decode to its URL');
  if (problems.length) { console.error('PRINT CHECK FAILED\n' + problems.join('\n')); process.exit(1); }
  console.log('print check: no overflow, no overlap, nothing missing, QR codes decode – letter and half-letter');
})();
