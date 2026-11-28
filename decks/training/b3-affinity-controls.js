// B3 · Dealer track · Affinity Smart-Heat Controls
// Facts: data/product-facts.json (affinity-controls) and the Affinity lines in data/product-marketing/*.json.
// Controller capacities and compatibility are unverified in the data ([[VERIFY]] on affinity-controls.site): said
// plainly on the slides, flagged "to confirm" in the notes.
const L = require('./lib');
const { T, H1, pic, rule, num, HEX, W, H, M } = L;
// small local helpers: steel letter-spaced caps for column labels; a plain filled block (panels, channel tracks)
const caps = (s, t, x, y, w, o = {}) => T(s, t.toUpperCase(), { x, y, w, h: 0.3, fontSize: 10, bold: true, color: HEX.STEEL, charSpacing: 3, ...o });
const box = (s, x, y, w, h, fill, name = 'panel') => s.addShape(L.pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: name });

async function main() {
  L.start({ title: 'Affinity Smart-Heat Controls', footer: 'Bromic Training Hub  ·  Dealer track  ·  Affinity Smart-Heat® Controls' });
  await L.prepIcons();
  const P = () => L.pres;
  const APP = require('path').join(__dirname, 'cache/src/app-in-hand.jpg'); // the library photo less its green bottom strip
  require('fs').mkdirSync(require('path').dirname(APP), { recursive: true });
  await require('sharp')('/home/user/Bromic_Marketing/images/library/w-bromic-heating-app-blog-image.webp').extract({ left: 0, top: 0, width: 600, height: 576 }).jpeg({ quality: 95 }).toFile(APP);

  const arrow = (s, x1, y1, x2, y2, color = HEX.STEEL) => s.addShape(P().shapes.LINE, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001,
    flipV: (y2 < y1) !== (x2 < x1) && y1 !== y2 && x1 !== x2, line: { color, width: 1.5, endArrowType: 'triangle' }, objectName: 'connector' });

  // 1 · Cover
  L.cover({ kicker: 'Dealer Track  ·  Module B3', title: 'Affinity Smart-Heat® Controls', img: APP,
    sub: 'Every Bromic heater leaves with its controls. Here is how to choose them, size them and show them off.',
    meta: 'Bromic Training Hub  ·  About 60 minutes',
    notes: 'Welcome. This module is about the part of the sale that most often gets left off the quote: the controls. By the end you will pick the right Affinity controller for any Bromic electric heater, size it by channels, demo the app, and quote controls on every job.' });

  // 2 · What you will be able to do
  { const s = L.content('Welcome', 'This Session', 'What You Will Be Able To Do',
    'Run through the four outcomes. Tell the group there are two exercises and two quick checks, so they will be doing as much as listening. Keep the pace brisk here.');
    const items = [['Choose', 'The right Affinity controller for each Bromic heater'], ['Size', 'Heaters to channels, up to 6 kW a channel'],
      ['Demo', 'Zones, schedules, timers and dimming in the app'], ['Quote', 'Controls on every quote, every time']];
    // four outcomes across the page, numbered in Didot under rules; the photograph underneath
    const cw = (W - 2 * M - 3 * 0.3) / 4;
    items.forEach(([t, b], i) => { const x = M + i * (cw + 0.3); rule(s, x, 1.85, cw); num(s, i + 1, x, 1.97, { size: 26, h: 0.55, w: 0.8 });
      H1(s, t, { x: x + 0.8, y: 2.02, w: cw - 0.8, h: 0.5, fontSize: 24 }); T(s, b, { x, y: 2.65, w: cw, h: 0.7, fontSize: 14 }); });
    pic(s, 'l-013-100', M, 3.6, W - 2 * M, 3.2, 'cover', 'eclipse-dining'); }

  // 3 · Divider 01
  L.divider({ n: '01', title: 'Why Controls Sell Heat', line: 'The heater makes the warmth. The controls decide how the evening feels.', img: 't-009-025', section: 'Why Controls Sell Heat',
    notes: 'Section one: why controls are part of the heater, never an add-on. Ask the room how often a customer asks "how do I turn it on?" after install.' });

  // 4 · Four reasons
  { const s = L.content('Why Controls Sell Heat', 'Why Controls Sell Heat', 'Four Reasons Customers Love Their Controls',
    'Walk through the four cards with a real evening in mind. Comfort: the Dimmer turns the warmth up on a cold night and down on a mild one, in 1% steps. Zones: the dining table and the lounge run separately. Schedules: warm before guests arrive. Timers and remote off: the heat goes off when the evening ends, even if nobody remembers to flick a switch. Do not quote a default timer length – it is still being confirmed with the Product team.');
    const cards = [['controller-dimmer', 'Comfort', 'Dim the warmth to the evening, in 1% steps on the Affinity Dimmer.'], ['zones', 'Zones', 'Run the dining table, the lounge and the bar on their own.'],
      ['schedule', 'Schedules', 'Warm before guests arrive, off when the evening ends.'], ['timer', 'Remote Off And Timers', 'Switch heaters off from anywhere, or let a timer do it.']];
    // two by two, each reason headed by its Bromic control icon and a rule; a photograph to the right edge
    const cw = 3.4;
    cards.forEach(([ic, t, b], i) => { const x = M + (i % 2) * (cw + 0.4), y = 1.85 + Math.floor(i / 2) * 2.5;
      L.icon(s, ic, x, y, 0.62); rule(s, x, y + 0.78, cw); H1(s, t, { x, y: y + 0.9, w: cw, h: 0.5, fontSize: 22 }); T(s, b, { x, y: y + 1.42, w: cw, h: 0.8, fontSize: 14 }); });
    pic(s, 'w-vbb7418', 8.35, 1.85, W - 8.35, 4.95, 'cover', 'restaurant'); }

  // 5 · Statement
  L.statement({ section: 'Why Controls Sell Heat', kicker: 'Recommended Controls & Accessories', line: 'Every Bromic Heater Leaves With Its Controls.', img: 'l-021-180',
    notes: 'This is the rule for the whole module. A heater quoted without its controls is a heater the customer cannot dim, zone or schedule – and a call-back waiting to happen. Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately, so they must be on the quote.' });

  // 6 · Divider 02
  L.divider({ n: '02', title: 'The Line-Up', line: 'Four controls and one board. Learn what each one is for.', img: 'w-render-3', section: 'The Line-Up',
    notes: 'Section two: the Affinity line-up, which controller goes with which heater, and how channels work.' });

  // 7 · The line-up
  { const s = L.content('The Line-Up', 'The Line-Up', 'Meet The Affinity Family',
    'On/Off: switches heaters by channel, in 1, 2 or 5 channels. Dimmer: the same channels, with output from 0 to 100% in 1% steps – the one we recommend for Tungsten and Platinum electric. Eclipse controller: made for Eclipse, one Eclipse a channel, heat and light set separately in the app. Manual wall switch: 20 A, 120–277 V, single or dual, the simple local switch. All controllers are IP54 and connect over 2.4 GHz Wi-Fi and Bluetooth. Controller capacities are still to be confirmed by the Product team, so check the current cut sheet before you commit a design.');
    const items = [['w-affinity-onoff', 'On/Off', '1, 2 or 5 channels. Switches each zone on and off.'], ['w-affinity-dimmer-2ch-2', 'Dimmer', '1, 2 or 5 channels. Dims in 1% steps.'],
      ['w-eclipse-electric-w-bromic-heating-app', 'Eclipse Controller', 'One Eclipse a channel. Heat and light from the app.'], ['w-manual-1ch-indoor-switch-image', 'Wall Switch', '20 A, 120–277 V. Single or dual.']];
    // the range page: the controls themselves on white, side by side; the name in Didot over a rule, one line
    const cw = (W - 2 * M - 3 * 0.3) / 4;
    items.forEach(([img, t, b], i) => { const x = M + i * (cw + 0.3); pic(s, img, x, 1.85, cw, 3.2, img.includes('eclipse') ? 'cover' : 'contain', 'controller-' + i);
      rule(s, x, 5.25, cw, i === 1 ? HEX.FLAME : HEX.INK, i === 1 ? 2 : 0.75);
      H1(s, t, { x, y: 5.37, w: cw, h: 0.45, fontSize: 22 }); T(s, b, { x, y: 5.85, w: cw, h: 0.85, fontSize: 14 }); }); }

  // 8 · Which controller for which heater
  { const s = L.content('The Line-Up', 'Which Controller', 'Match The Controller To The Heater',
    'Use this as the cheat sheet. Tungsten and Platinum electric go on the Affinity Dimmer for 1% dimming, or the On/Off where the customer only wants on and off. Eclipse Electric takes the Affinity Eclipse Controller for heat and light from the app, or the Eclipse Dimmer Controller with its remote. Eclipse Freestanding includes its own Eclipse Dimmer Controller and remote. Gas heaters are on and off only, on the Affinity On/Off or a wall switch. The On/Off page says up to 10 gas heaters a channel, but the spec table lists only the electric heaters – to confirm with the Product team before you quote it.');
    const rows = [['t2-select-black', 'Tungsten Smart-Heat® Electric', 'Classic, Select, Coastal', 'Affinity Dimmer, or On/Off', 'contain'],
      ['w-platinum-black', 'Platinum Smart-Heat® Electric', '2300, 3400, 4500 W', 'Affinity Dimmer, or On/Off', 'contain'],
      ['pf-eclipse-pendant', 'Eclipse Smart-Heat® Electric', 'Pendant and poles', 'Affinity Eclipse Controller, or Eclipse Dimmer Controller with remote', 'cover'],
      ['pf-eclipse-freestanding', 'Eclipse Smart-Heat® Freestanding', 'On wheels', 'Eclipse Dimmer Controller and remote included', 'cover'],
      ['pf-tungsten-gas', 'Gas Heaters', 'Platinum and Tungsten Gas', 'Affinity On/Off or a wall switch – on and off only', 'cover']];
    // a table with a dark header row and hairline rows, as in the white papers' spec tables
    box(s, M, 1.8, W - 2 * M, 0.42, HEX.INK, 'table-head');
    T(s, 'HEATER', { x: M + 1.4, y: 1.8, w: 4, h: 0.42, fontSize: 10, bold: true, color: HEX.WHITE, charSpacing: 3, valign: 'middle' });
    T(s, 'RECOMMENDED CONTROLS', { x: 7.0, y: 1.8, w: 5, h: 0.42, fontSize: 10, bold: true, color: HEX.WHITE, charSpacing: 3, valign: 'middle' });
    rows.forEach(([img, n, sub, ctl, mode], i) => { const y = 2.27 + i * 0.84;
      pic(s, img, M, y + 0.06, 1.2, 0.7, mode, 'heater-' + i);
      T(s, n, { x: M + 1.4, y: y + 0.1, w: 5.0, h: 0.36, fontSize: 15, bold: true, color: HEX.INK });
      T(s, sub, { x: M + 1.4, y: y + 0.45, w: 5.0, h: 0.3, fontSize: 12, color: HEX.STEEL });
      T(s, ctl, { x: 7.0, y: y + 0.06, w: 5.7, h: 0.72, fontSize: 14, color: HEX.INK, valign: 'middle' });
      rule(s, M, y + 0.82, W - 2 * M, 'C9C9C6', 0.75); });
    L.icon(s, 'wall-switch', M, 6.5, 0.38);
    T(s, 'Add a manual wall switch where the code asks for a local disconnect.', { x: M + 0.5, y: 6.55, w: 9, h: 0.3, fontSize: 12, color: HEX.STEEL }); }

  // 9 · Channels and capacity
  { const s = L.content('The Line-Up', 'Channels And Capacity', 'Up To 6 kW A Channel',
    'This is the sum that sizes every controller. On the Affinity On/Off and Dimmer, each channel carries up to 6 kW at 208–277 V. One 6 kW Tungsten fills a channel; two 3 kW Tungsten share one; a 4500 W Platinum takes one on its own. Count the channels, then choose 1, 2 or 5. Any spare channel is room for a heater added next season. The 6 kW figure comes from the product pages and is still to be confirmed by the Product team – check the cut sheet on each job.');
    // controller block
    box(s, M, 1.95, 3.1, 4.75, HEX.INK, 'controller');
    L.icon(s, 'controller-dimmer', M + 0.3, 2.25, 0.75, { dark: true });
    T(s, 'Affinity Dimmer', { x: M + 0.3, y: 3.2, w: 2.6, h: 0.5, fontSize: 22, color: HEX.WHITE, fontFace: 'Bodoni MT' });
    T(s, '5 channels', { x: M + 0.3, y: 3.75, w: 2.6, h: 0.4, fontSize: 16, color: 'D9D6D2' });
    T(s, 'Each channel: up to 6 kW at 208–277 V', { x: M + 0.3, y: 4.9, w: 2.5, h: 1.2, fontSize: 15, color: 'D9D6D2' });
    const ch = [['Tungsten 6 kW', [6]], ['Two Tungsten 3 kW', [3, 3]], ['Platinum 4500 W', [4.5]], ['Tungsten 4 kW', [4]], ['Spare – room to grow', []]];
    const bx = 5.75, bw = 6.95; // bar area
    T(s, '0', { x: bx - 0.1, y: 1.72, w: 0.3, h: 0.25, fontSize: 11, color: HEX.STEEL }); T(s, '6 kW', { x: bx + bw - 0.5, y: 1.72, w: 0.6, h: 0.25, fontSize: 11, color: HEX.STEEL, align: 'right' });
    ch.forEach(([label, loads], i) => { const y = 2.05 + i * 0.93;
      T(s, `CH ${i + 1}`, { x: 3.95, y: y + 0.05, w: 0.8, h: 0.3, fontSize: 12, bold: true, color: HEX.FLAME, charSpacing: 2 });
      T(s, label, { x: 3.95, y: y + 0.35, w: 1.75, h: 0.4, fontSize: 13, color: HEX.INK });
      box(s, bx, y + 0.08, bw, 0.62, HEX.GREY, 'channel-track');
      let x = bx; loads.forEach((kw, j) => { const w = bw * kw / 6; box(s, x + 0.03, y + 0.11, w - 0.06, 0.56, j % 2 ? 'B22B12' : HEX.FLAME, 'load'); T(s, `${kw} kW`, { x: x + 0.15, y: y + 0.2, w: w - 0.3, h: 0.35, fontSize: 14, bold: true, color: HEX.WHITE }); x += w; });
      arrow(s, M + 3.1, 2.4 + i * 0.93, 3.9, 2.4 + i * 0.93, 'C9C9C6'); }); }

  // 10 · Eclipse: one a channel
  { const s = L.content('The Line-Up', 'Eclipse', 'Eclipse: One Heater A Channel',
    'Eclipse runs differently. On the Affinity Eclipse Controller each Eclipse has its own channel, so the heat and the light can be set on their own for each heater. The controller comes in 1 and 5 channels: two Eclipse over a table means two channels. If the customer would rather use a handheld remote, the Eclipse Dimmer Controller with remote is the alternative. Channel counts are from the product pages, to confirm with the Product team.');
    pic(s, 'l-013-106', 7.0, 1.85, 5.73, 4.9, 'cover', 'eclipse-rim-light');
    const pts = [['Heat and light, set separately', 'Each Eclipse on its own channel.'], ['1 or 5 channels', 'One Eclipse a channel, up to five on one controller.'], ['From the app', 'Dimming, schedules, timers and zones.']];
    pts.forEach(([t, b], i) => { const y = 1.95 + i * 1.6; rule(s, M, y, 5.9); num(s, i + 1, M, y + 0.12, { size: 30, h: 0.6, w: 0.9 });
      H1(s, t, { x: M + 1.0, y: y + 0.16, w: 4.9, h: 0.5, fontSize: 22 }); T(s, b, { x: M + 1.0, y: y + 0.7, w: 4.9, h: 0.6, fontSize: 15 }); });
    rule(s, M, 1.95 + 3 * 1.6, 5.9); }

  // 11 · Check 1
  L.quiz({ section: 'The Line-Up', n: 1, q: 'Two 3 kW Tungsten Heaters At 240 V On A Dimmer. How Many Channels?',
    options: ['One channel', 'Two channels', 'Three channels', 'It depends on the app'], answer: 0,
    why: 'Each Affinity On/Off or Dimmer channel carries up to 6 kW at 208–277 V, so two 3 kW heaters (6 kW) share one channel. Follow-up: what if they were two 4 kW heaters? Two channels, because 8 kW is over the 6 kW limit.' });

  // 12 · Divider 03
  L.divider({ n: '03', title: 'The App And The Smart Home', line: 'One app for warmth, schedules and zones – and the systems your customer already uses.', img: 'w-eclipse-electric-w-bromic-heating-app', section: 'The App And The Smart Home',
    notes: 'Section three: what the Bromic app does, and how Affinity connects to voice assistants, home systems and building management.' });

  // 13 · The app
  { const s = L.content('The App And The Smart Home', 'The Bromic App', 'Everything The Customer Does From Their Phone',
    'This is the list to demo, not just describe. Zones group heaters over the dining table, the lounge and the bar. Schedules warm the space before guests arrive. Timers and remote off switch the heat off when the evening ends. The Dimmer sets the output in 1% steps. On Eclipse, heat and light are set separately. The app connects over 2.4 GHz Wi-Fi, with Bluetooth as well. Remember: Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately. Never quote a default timer length.');
    pic(s, APP, 8.0, 1.85, 4.73, 4.9, 'cover', 'app-in-hand');
    // the six things to demo, each with its Bromic control icon, under rules, two columns
    const f = [['zones', 'Zones'], ['schedule', 'Schedules'], ['timer', 'Timers'], ['app', 'Remote off'], ['controller-dimmer', 'Dimming in 1% steps'], ['heater-eclipse', 'Heat and light on Eclipse']];
    f.forEach(([ic, t], i) => { const col = i % 2, row = Math.floor(i / 2); const x = M + col * 3.65, y = 1.9 + row * 1.2;
      rule(s, x, y, 3.4); L.icon(s, ic, x, y + 0.18, 0.62); H1(s, t, { x: x + 0.85, y: y + 0.2, w: 2.55, h: 0.6, fontSize: 19, valign: 'middle' }); });
    rule(s, M, 5.55, 7.05, HEX.FLAME, 1.5);
    T(s, '2.4 GHz Wi-Fi and Bluetooth. Wi-Fi and app features need compatible Affinity controls, sold separately.', { x: M, y: 5.68, w: 7.05, h: 0.7, fontSize: 14, color: HEX.INK }); }

  // 14 · Hub diagram
  { const s = L.content('The App And The Smart Home', 'Voice And Home Systems', 'One Controller, Many Ways In',
    'Read the diagram left to right. The heaters are wired to the Affinity controller; everything on the right talks to the controller, never to the heater. The Bromic app, Amazon Alexa and Google Assistant need no extra board. Control4, Crestron and Lutron are supported, but compatibility varies by system and may need extra hardware or set-up, so always say "where compatible". A building management system connects over Ethernet or 0–10 V through the expansion board.');
    const heaters = [['Tungsten', 'heater-tungsten'], ['Platinum', 'heater-platinum'], ['Eclipse', 'heater-eclipse']];
    caps(s, 'Heaters', M, 1.85, 2.4); caps(s, 'Ways in', 8.5, 1.6, 4);
    heaters.forEach(([n, ic], i) => { const y = 2.3 + i * 1.45; rule(s, M, y, 2.4); L.icon(s, ic, M, y + 0.15, 0.7); H1(s, n, { x: M + 0.9, y: y + 0.25, w: 1.5, h: 0.5, fontSize: 20 }); arrow(s, M + 2.45, y + 0.5, 4.4, 4.2); });
    box(s, 4.45, 3.2, 2.9, 2.0, HEX.INK, 'affinity-hub');
    T(s, 'AFFINITY', { x: 4.65, y: 3.45, w: 2.5, h: 0.3, fontSize: 12, bold: true, color: HEX.FLAME, charSpacing: 4 });
    T(s, 'Smart-Heat® Controller', { x: 4.65, y: 3.8, w: 2.5, h: 0.9, fontSize: 19, color: HEX.WHITE, fontFace: 'Bodoni MT' });
    const outs = [['app', 'Bromic app', 'Wi-Fi and Bluetooth'], ['voice', 'Amazon Alexa', 'No extra board'], ['voice', 'Google Assistant', 'No extra board'],
      ['home', 'Control4 · Crestron · Lutron', 'Where compatible'], ['hotel', 'Building management', 'Ethernet or 0–10 V']];
    outs.forEach(([ic, n, sub], i) => { const y = 1.9 + i * 0.98; arrow(s, 7.35, 4.2, 8.45, y + 0.42); rule(s, 8.5, y, 4.23, i < 3 ? HEX.INK : 'C9C9C6');
      T(s, n, { x: 8.5, y: y + 0.1, w: 4.2, h: 0.38, fontSize: 15, bold: true, color: HEX.INK }); T(s, sub, { x: 8.5, y: y + 0.47, w: 4.2, h: 0.32, fontSize: 13, color: i === 3 ? HEX.FLAME : HEX.STEEL }); }); }

  // 15 · BMS and the expansion board
  { const s = L.content('The App And The Smart Home', 'Building Management', 'Hotels, Restaurants And The BMS',
    'For commercial jobs the building management system often runs the heat. The expansion board adds Ethernet and 0–10 V; it is built into the 5-channel controller and added to the 1- and 2-channel ones. Tell the customer clearly: in BMS mode the app is disabled, so the building system becomes the control. Alexa and Google Assistant need no board at all.');
    pic(s, 'w-expansion-board', M, 1.95, 3.5, 3.6, 'contain', 'expansion-board');
    pic(s, 'w-affinity-dimmer-5ch', 4.35, 1.95, 3.5, 3.6, 'contain', 'dimmer-5ch');
    T(s, 'Expansion board', { x: M, y: 5.65, w: 3.5, h: 0.35, fontSize: 13, color: HEX.STEEL, align: 'center' });
    T(s, '5-channel controller: board built in', { x: 4.35, y: 5.65, w: 3.5, h: 0.35, fontSize: 13, color: HEX.STEEL, align: 'center' });
    const pts = ['Ethernet and 0–10 V to the building system', 'Built into the 5-channel controller', 'In BMS mode the app is disabled', 'Alexa and Google need no board'];
    pts.forEach((t, i) => { const y = 1.95 + i * 1.15, key = i === 2; rule(s, 8.3, y, 4.43, key ? HEX.FLAME : HEX.INK, key ? 1.5 : 0.75); num(s, i + 1, 8.3, y + 0.12, { size: 24, h: 0.5, w: 0.7 });
      H1(s, t, { x: 9.05, y: y + 0.12, w: 3.68, h: 0.85, fontSize: 18, color: key ? HEX.FLAME : HEX.INK }); });
    rule(s, 8.3, 1.95 + 4 * 1.15, 4.43); }

  // 16 · Exercise 1: demo the app
  L.exercise({ section: 'The App And The Smart Home', n: 1, minutes: 10, title: 'Demo The App Like You Own It',
    task: 'In pairs, one of you is the customer. Run a two-minute app demo, then swap.',
    steps: ['Group two heaters into a zone: "Dining"', 'Dim the zone from full to a mild-evening setting', 'Set a Friday schedule that warms before guests arrive', 'Set a timer, then switch everything off remotely', 'On Eclipse, set the heat and the light separately', 'Hand over the phone – the customer does it once'],
    img: 'w-render-1',
    notes: 'How to run it: use the showroom demo rig or a controller on the bench, with the Bromic app installed and connected over 2.4 GHz Wi-Fi. Pairs, two minutes each, then swap. Walk the room and listen for jargon. Debrief: which step got the biggest reaction from the "customer"? Usually dimming or switching off from the phone. The last step matters most – a customer who has done it once will use it. Do not state a default timer length; it is still to confirm.' });

  // 17 · Divider 04
  L.divider({ n: '04', title: 'Quote Controls Every Time', line: 'The controls are on the quote, or the heater is not finished.', img: 'w-connecticut-private-res-tungsten-electric-1', section: 'Quoting Controls',
    notes: 'Section four: putting controls on every quote, then two exercises to practise it.' });

  // 18 · The quote
  { const s = L.content('Quoting Controls', 'Recommended Controls & Accessories', 'Five Lines On Every Quote',
    'Build every quote in this order. The heaters. The Affinity controller, sized by channels. A manual wall switch where the code asks for a local disconnect. The expansion board if a 1- or 2-channel controller goes to a building system. And the circuit, wired by a licensed electrician on a dedicated circuit – check with the local authority for permits. Say once, clearly: Wi-Fi and app features need compatible Affinity controls, sold separately.');
    const lines = [['Heaters', 'Model, output, finish'], ['Affinity controller', 'On/Off, Dimmer or Eclipse – 1, 2 or 5 channels'], ['Manual wall switch', 'Where the code asks for a local disconnect'],
      ['Expansion board', 'For a BMS on a 1- or 2-channel controller'], ['Circuit and install', 'Licensed electrician, dedicated circuit']];
    // the quote as a sheet: a dark header, five numbered lines under hairlines
    box(s, M, 1.85, 7.4, 0.42, HEX.INK, 'quote-head');
    T(s, 'LINE', { x: M + 0.2, y: 1.85, w: 2, h: 0.42, fontSize: 10, bold: true, color: HEX.WHITE, charSpacing: 3, valign: 'middle' });
    T(s, 'WHAT GOES ON IT', { x: M + 3.85, y: 1.85, w: 3.4, h: 0.42, fontSize: 10, bold: true, color: HEX.WHITE, charSpacing: 3, valign: 'middle' });
    lines.forEach(([t, b], i) => { const y = 2.3 + i * 0.88; num(s, i + 1, M + 0.2, y + 0.16, { size: 22, h: 0.5, w: 0.6 });
      H1(s, t, { x: M + 0.9, y: y + 0.14, w: 2.9, h: 0.6, fontSize: 19, valign: 'middle' }); T(s, b, { x: M + 3.85, y: y + 0.14, w: 3.4, h: 0.6, fontSize: 14, valign: 'middle' });
      rule(s, M, y + 0.88, 7.4, 'C9C9C6'); });
    pic(s, 'w-argentina-residential-3', 8.35, 1.85, 4.38, 4.95, 'cover', 'wall-keypad'); }

  // 19 · Exercise 2: pick the controller
  { const s = L.exercise({ section: 'Quoting Controls', n: 2, minutes: 15, title: 'Pick The Controller',
      task: 'In small groups, write the controls for each job: controller, channels, wall switch and any board.',
      notes: 'How to run it: groups of three, about three minutes a scenario, then debrief one scenario per group. Suggested answers. 1) Three Tungsten 6 kW on a pergola: each heater fills a 6 kW channel, so three channels – an Affinity 5-channel Dimmer (two spare for later) plus a manual wall switch; a 2-channel plus a 1-channel also works but is two boxes. 2) Two Eclipse over a dining table: the Affinity Eclipse Controller, one Eclipse a channel, so two channels – the 5-channel, or two 1-channel controllers; heat and light set separately in the app. Or the Eclipse Dimmer Controller with remote if the customer wants a remote. 3) A restaurant with ten Tungsten 6 kW heaters on a BMS: ten channels, so two 5-channel controllers with Ethernet and 0–10 V built in; warn that BMS mode disables the app. 4) One Platinum by a pool: a 1-channel Affinity Dimmer and a wall switch; the app, Alexa and Google need no board. Capacities are from the product pages and still to confirm with the Product team.' });
    const sc = [['pergola', 'Three Tungsten 6 kW heaters on a pergola'], ['dining', 'Two Eclipse pendants over a dining table'], ['restaurant', 'A restaurant: ten Tungsten 6 kW heaters and a BMS'], ['pool', 'One Platinum Electric heater by a pool']];
    // four jobs on a wash panel: each a Didot numeral, its space as a Bromic icon, a rule and the brief
    box(s, M, 2.8, W - 2 * M, 3.95, HEX.WASH, 'jobs-panel');
    const cw = (W - 2 * M - 0.7 - 3 * 0.4) / 4;
    sc.forEach(([ic, t], i) => { const x = M + 0.35 + i * (cw + 0.4); num(s, i + 1, x, 3.1, { size: 44, h: 0.9, w: 1.1 }); L.icon(s, ic, x + cw - 0.75, 3.2, 0.75);
      rule(s, x, 4.15, cw); H1(s, t, { x, y: 4.35, w: cw, h: 2.2, fontSize: 23 }); }); }

  // 20 · Check 2
  L.quiz({ section: 'Quoting Controls', n: 2, q: 'A Hotel Wants Its Heaters On The Building System. What Do You Tell Them?',
    options: ['Alexa does it – no hardware needed', 'Ethernet or 0–10 V through the expansion board; in BMS mode the app is disabled', 'Only gas heaters connect to a BMS', 'The app and the BMS always run side by side'], answer: 1,
    why: 'The expansion board adds Ethernet and 0–10 V for building management and home automation (built into the 5-channel controller). In BMS mode the app is disabled. Alexa and Google Assistant need no board, but they are not a BMS.' });

  // 21 · Closing
  L.closing({ title: 'Quote It, Show It, Hand It Over', img: 'w-gno-2',
    points: ['Every heater leaves with its controls', 'Up to 6 kW a channel on On/Off and Dimmer; one Eclipse a channel', 'Dimmer for Tungsten and Platinum; Eclipse controller for Eclipse', 'Alexa and Google need no board; BMS mode disables the app', 'Wi-Fi and app features need compatible Affinity controls, sold separately'],
    next: 'Next: put a demo rig in your showroom and run Exercise 1 with your team this week.',
    notes: 'Recap the five points and ask each person to name one job this month where they will add or upgrade controls. Point them to the Affinity cut sheets in the Training Hub for current capacities.' });

  await L.finish('Bromic-Dealer-Affinity-Smart-Heat-Controls');
}
main().catch((e) => { console.error(e); process.exit(1); });
