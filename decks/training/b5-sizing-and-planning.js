// Training Hub · Dealer track · B5: Sizing And Planning (30-minute dealer workshop).
// Floor maths for showroom and pergola sales staff: seats to area, area ÷ (coverage × cover × climate), freestanding at
// 4 seats a heater, heights by model, spacing and clearances, circuits and 6 kW channels, and when to hand the job to the
// design service. Facts: templates/calculation-model.md, data/product-facts.json, data/product-marketing/*.json,
// data/retail/retail.json (sizing page), decks b1, b3 and c. Run: NODE_PATH=$PWD/node_modules node b5-sizing-and-planning.js
const path = require('path');
const fs = require('fs');
const L = require('./lib');
const { pic, T, H1, HEX, W, M, rule, num, stat, icon } = L;
const WHITE_PANEL = path.join(__dirname, 'cache', 'b5-white-panel.jpg');

(async () => {
  fs.mkdirSync(path.dirname(WHITE_PANEL), { recursive: true });
  await require('sharp')({ create: { width: 1076, height: 980, channels: 3, background: '#FFFFFF' } }).jpeg().toFile(WHITE_PANEL);
  const { pres } = L.start({ title: 'Sizing And Planning', footer: 'Dealer Training  ·  Sizing And Planning' });
  await L.prepIcons();
  const S = pres.shapes;

  // ---------- drawing kit ----------
  const rect = (s, x, y, w, h, color, o = {}) => s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color, ...(o.t != null ? { transparency: o.t } : {}) }, line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || 'solid' } : { color, width: 0 }, objectName: o.name || 'shape' });
  const oval = (s, x, y, w, h, color, t = 0, line, lw = 1) => s.addShape(S.OVAL, { x, y, w, h, fill: { color, transparency: t }, line: line ? { color: line, width: lw } : { color, width: 0 }, objectName: 'shape' });
  const seg = (s, x1, y1, x2, y2, color = HEX.INK, width = 1.25, o = {}) => {
    const flip = (x2 - x1) * (y2 - y1) < 0, ex = Math.max(x1, x2), ey = flip ? Math.min(y1, y2) : Math.max(y1, y2);
    const atEnd = x2 === ex && y2 === ey && !(x1 === ex && y1 === ey);
    s.addShape(S.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: flip,
      line: { color, width, dashType: o.dash || 'solid', ...(o.arrow ? (atEnd ? { endArrowType: 'triangle' } : { beginArrowType: 'triangle' }) : {}), ...(o.both ? { beginArrowType: 'triangle', endArrowType: 'triangle' } : {}) }, objectName: o.name || 'line' });
  };
  const caps = (s, t, x, y, w, o = {}) => T(s, t.toUpperCase(), { x, y, w, h: 0.28, fontSize: 9.5, bold: true, color: HEX.STEEL, charSpacing: 3, ...o });
  const cap = (s, t, x, y, w, o = {}) => T(s, t, { x, y, w, h: 0.3, fontSize: 10.5, color: HEX.STEEL, ...o });
  const ftable = (s, rows, o) => s.addTable(rows.map((r, i) => r.map((c, j) => {
    const cell = typeof c === 'object' ? c : { text: String(c) };
    return { text: cell.text, options: {
      bold: i === 0 || (j === 0 && o.boldFirst) || cell.bold, color: i === 0 ? HEX.WHITE : (cell.color || HEX.INK),
      fill: { color: i === 0 ? HEX.INK : (cell.fill || HEX.WHITE) }, fontSize: i === 0 ? (o.headSize || 9.5) : (o.size || 13), charSpacing: i === 0 ? 1 : 0,
      align: cell.align || (o.align && o.align[j]) || 'left',
      border: i === 0 ? [{ type: 'none' }, { type: 'none' }, { type: 'none' }, { type: 'none' }] : [{ type: 'none' }, { type: 'none' }, { pt: 0.75, color: 'C9C9C6' }, { type: 'none' }] } };
  })), { x: o.x, y: o.y, w: o.w, colW: o.colW, fontFace: 'Arial', rowH: o.rowH || 0.45, valign: 'middle', margin: [0.03, 0.1, 0.03, 0.1] });
  const chairAt = (s, cx, cy, d = 0.17) => rect(s, cx - d / 2, cy - d / 2, d, d, HEX.WHITE, { line: HEX.STEEL, lw: 0.75, name: 'chair' });

  // ====================================================================== 1 · Cover
  L.cover({
    kicker: 'Dealer Training  ·  B5', title: 'Sizing And *Planning*',
    sub: 'Seats to heaters, heights to the right model, channels to the right controller, and when to call in the design service.',
    meta: '30 minutes  ·  3 exercises  ·  2 knowledge checks', img: 'w-bromicatria23',
    notes: 'Welcome. This is a working session: by the end everyone at the table can size a patio or pergola on the shop floor in under a minute, check the mounting height before naming a heater, put the right controller on the quote, and know when to hand the job to the Bromic design service. Have a calculator or a phone and a pen ready. Timing: 30 seconds.',
  });

  // ====================================================================== 2 · Take-aways
  {
    const s = L.content('Welcome', 'In This Workshop', 'What You Will Take Away',
      'Four things. One: area and coverage: seats to square feet, and the one formula that turns them into heaters. Two: mounting heights: which heater fits which ceiling or beam. Three: circuits and channels: one heater a dedicated circuit, up to 6 kW a controller channel. Four: the design service: what you quote yourself and what you send. Three exercises and two checks along the way. Timing: 1 minute.');
    const items = [['Area And Coverage', 'Seats × 20 ft², then one formula.'], ['Mounting Heights', 'The right heater for the ceiling.'],
      ['Circuits And Channels', '6 kW a channel, controls on every line.'], ['The Design Service', 'What to quote, what to send.']];
    items.forEach(([h, d], i) => {
      const x = M + (i % 2) * 3.2, y = 1.95 + Math.floor(i / 2) * 2.05;
      rule(s, x, y, 2.9);
      num(s, i + 1, x, y + 0.1, { size: 32, h: 0.65, w: 1 });
      H1(s, h, { x, y: y + 0.8, w: 2.9, h: 0.45, fontSize: 19 });
      T(s, d, { x, y: y + 1.28, w: 2.9, h: 0.6, fontSize: 13.5 });
    });
    pic(s, 'rv-ts2-photo-06', 7.25, 0, W - 7.25, 6.8, 'cover', 'photo');
  }

  // ====================================================================== Part 1 · Area and coverage
  L.divider({ n: '01', title: 'Area And *Coverage*', section: 'Area And Coverage', img: 't-012-034',
    line: 'Count the seats, not the slab. Then one line sizes almost every job.',
    notes: 'Part one, about twelve minutes: seats to area, the formula, three worked jobs, freestanding heaters, a drill and a check.' });

  {
    const s = L.content('Area And Coverage', 'Seats To Area', 'Count The Seats, Not The Slab',
      'Start with how many people will sit there, not the size of the deck. Allow 20 square feet a seat, aisles and breathing room included. That is the top of the restaurant planning range (full-service dining 12 to 15 square feet a seat, fine dining 18 to 20), so tables are never crammed. Source: the NAFEM space-planning chart, as published in the Restaurant Furniture seating capacity guide; templates/calculation-model.md. If the customer cannot say how many seats, measure only the area where people sit; the lawn, the steps and the barbecue corner do not need heat. The drawing: a 24 by 12 foot patio is 288 square feet, but the eight seats around the table need 160. Timing: 1 minute.');
    stat(s, '20 ft²', 'A seat, aisles and breathing room included. Measure where people sit.', M, 1.95, 4.2, { size: 64, h: 1.1, lh: 0.8, ls: 14 });
    ftable(s, [['SEATS', 'AREA'], ...[[2, 40], [4, 80], [6, 120], [8, 160], [10, 200], [12, 240], [20, 400], [40, 800]].map(([a, b]) => [{ text: String(a), bold: true }, { text: b + ' ft²', align: 'right' }])],
      { x: M, y: 4.05, w: 4.2, colW: [1.8, 2.4], rowH: [0.34, 0.31, 0.31, 0.31, 0.31, 0.31, 0.31, 0.31, 0.31], size: 12, headSize: 9 });
    // the slab versus the seats, in plan
    const px = 5.75, py = 2.3, f = 0.25, k = 1.25, pw = 24 * f, ph = 12 * f;
    caps(s, 'Plan  ·  the slab and the seats', px, 1.95, 6);
    rect(s, px, py, pw, ph, 'F5F5F4', { line: HEX.INK, lw: 1, name: 'slab' });
    rect(s, px - 0.12, py, 0.12, ph, HEX.INK, { name: 'house' });
    rect(s, px + 1.25, py + 0.438, 3.25, 2.31, HEX.WASH, { line: HEX.FLAME, lw: 1.25, dash: 'dash', name: 'seating' });
    rect(s, px + 1.938, py + 1.188, 1.875, 0.81, HEX.WHITE, { line: HEX.INK, lw: 0.75, name: 'table' });
    [1.75, 2.3, 2.85].forEach((cx) => { chairAt(s, px + cx * k, py + 0.938, 0.21); chairAt(s, px + cx * k, py + 2.25, 0.21); }); chairAt(s, px + 1.663, py + 1.587, 0.21); chairAt(s, px + 4.088, py + 1.587, 0.21);
    rect(s, px + 5.062, py + 0.375, 0.75, 1.25, 'E3E3E1', { line: HEX.STEEL, lw: 0.5, name: 'grill' });
    T(s, 'Grill', { x: px + 4.94, y: py + 1.7, w: 1.0, h: 0.22, fontSize: 9, color: HEX.STEEL, align: 'center' });
    for (let j = 0; j < 4; j++) rect(s, px + 0.375 + j * 1.375, py + ph - 0.38, 1.12, 0.24, HEX.WHITE, { line: HEX.STEEL, lw: 0.5, name: 'step' });
    T(s, 'Steps to the lawn', { x: px + 0.375, y: py + ph + 0.02, w: 3, h: 0.22, fontSize: 9, color: HEX.STEEL });
    [['Slab', '24 × 12 ft = 288 ft²', HEX.STEEL], ['Seats', '8 × 20 = 160 ft²: size this', HEX.FLAME]].forEach(([a, b, c], i) => {
      const y = 5.68 + i * 0.6; rule(s, px, y, pw, i ? HEX.FLAME : HEX.INK, i ? 1.5 : 0.75);
      T(s, a.toUpperCase(), { x: px, y: y + 0.12, w: 1.2, h: 0.3, fontSize: 9.5, bold: true, color: c, charSpacing: 3 });
      H1(s, b, { x: px + 1.2, y: y + 0.06, w: pw - 1.2, h: 0.42, fontSize: 18, color: i ? HEX.FLAME : HEX.INK });
    });
  }

  {
    const s = L.content('Area And Coverage', 'The One Formula', 'Area ÷ (Coverage × Cover × Climate)',
      'One line sizes the job: heaters equal the seating area divided by one heater\'s coverage, times a cover factor and a climate factor, rounded up. Coverage: Tungsten 2, 3, 4 and 6 kW cover 65, 100, 130 and 160 square feet, Classic and Select the same; Platinum 2300, 3400 and 4500 W cover 65, 108 and 143; Eclipse 121; Tungsten Freestanding Gas 215; Tungsten Gas mounted 160 or 215. Cover: open, no roof 0.85; partly covered (pergola, umbrella, part roof) 1.0; solid roof 1.1. Climate, the evenings they heat: mild, above about 50°F, 1.0; cool, about 40 to 50°F, 0.85; cold, often below about 40°F, 0.7. When you do not know the site, use partly covered and cool: 0.85 combined, and say so. Sources: templates/calculation-model.md, data/product-facts.json, data/retail/retail.json (sizing page). The factors are still to be confirmed by the Product team. Timing: 2 minutes.');
    H1(s, 'Heaters = area ÷ (coverage × cover × climate), rounded up', { x: M, y: 1.9, w: 12.1, h: 0.55, fontSize: 22, color: HEX.INK });
    rule(s, M, 2.55, 12.1, HEX.FLAME, 1.5);
    ftable(s, [['HEATER', 'COVERAGE'],
      ['Tungsten 2 · 3 · 4 · 6 kW', { text: '65 · 100 · 130 · 160 ft²', align: 'right' }], ['Platinum 2300 · 3400 · 4500 W', { text: '65 · 108 · 143 ft²', align: 'right' }],
      ['Eclipse, pendant or freestanding', { text: '121 ft²', align: 'right' }], ['Tungsten Freestanding Gas', { text: '215 ft²', align: 'right' }], ['Tungsten Gas, mounted', { text: '160 or 215 ft²', align: 'right' }]],
    { x: M, y: 2.8, w: 5.6, colW: [3.0, 2.6], rowH: 0.47, size: 13, boldFirst: true });
    T(s, 'Classic and Select share the same coverage.', { x: M, y: 5.7, w: 5.6, h: 0.3, fontSize: 11, color: HEX.STEEL });
    ftable(s, [['COVER', '×', 'EVENINGS', '×'],
      ['Open, no roof', { text: '0.85', align: 'right' }, 'Mild, above 50°F', { text: '1.0', align: 'right' }],
      ['Pergola, part roof', { text: '1.0', align: 'right' }, 'Cool, 40–50°F', { text: '0.85', align: 'right' }],
      ['Solid roof', { text: '1.1', align: 'right' }, 'Cold, below 40°F', { text: '0.7', align: 'right' }]],
    { x: 6.75, y: 2.8, w: 5.98, colW: [1.9, 0.7, 2.68, 0.7], rowH: 0.47, size: 13 });
    rect(s, 6.75, 4.85, 5.98, 1.85, HEX.INK, { name: 'ink-panel' });
    T(s, 'DON\'T KNOW THE SITE?', { x: 7.1, y: 5.05, w: 4, h: 0.28, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
    H1(s, 'Use 0.85: partly covered, cool evenings. Say so on the quote.', { x: 7.1, y: 5.38, w: 5.3, h: 0.9, fontSize: 20, color: HEX.WHITE });
  }

  {
    const s = L.content('Area And Coverage', 'Worked Examples', 'Two Jobs, One Rule',
      'Two jobs the floor sees every week. Job A: a 10-seat dining pergola, cool evenings. 10 × 20 = 200 square feet. Partly covered and cool is 0.85, so a Tungsten 6 kW counts as 160 × 0.85 = 136: 200 ÷ 136 = 1.47, round up, two heaters. Two heaters, two channels: a 2-channel Affinity Dimmer and a wall switch, two dedicated circuits. Job B: a 12-seat porch under a solid roof, cold winters. 240 square feet. Solid roof 1.1 × cold 0.7 = 0.77, so a Platinum 4500 W counts as 143 × 0.77 = 110.1: 240 ÷ 110.1 = 2.2, round up, three. The same porch in a mild climate: 240 ÷ (143 × 1.1) = 1.5, two heaters. The climate changes the count, so ask about the evenings. Three Platinum 4500 W need three channels: a 5-channel Affinity Dimmer with two spare, or a 2-channel and a 1-channel; a wall switch; three dedicated circuits. App features need compatible Affinity controls, sold separately. Timing: 2 minutes.');
    const job = (x, w, k, title, rows, result, ctrl, dark) => {
      const ink = dark ? HEX.WHITE : HEX.INK, body = dark ? 'D9D6D2' : HEX.BODY, line = dark ? '5A5556' : HEX.LINE;
      if (dark) rect(s, x, 1.9, w, 4.85, HEX.INK, { name: 'ink-panel' }); else rule(s, x, 1.9, w, HEX.INK);
      const ix = x + (dark ? 0.35 : 0), iw = w - (dark ? 0.7 : 0);
      T(s, k, { x: ix, y: 2.08, w: iw, h: 0.28, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
      H1(s, title, { x: ix, y: 2.38, w: iw, h: 0.5, fontSize: 21, color: ink });
      rows.forEach(([a, b], i) => { const y = 3.0 + i * 0.48; rule(s, ix, y, iw, line, 0.5);
        T(s, a, { x: ix, y: y + 0.1, w: iw * 0.5, h: 0.36, fontSize: 13, color: body }); T(s, b, { x: ix + iw * 0.4, y: y + 0.1, w: iw * 0.6, h: 0.36, fontSize: 13.5, bold: true, color: ink, align: 'right' }); });
      H1(s, result, { x: ix, y: 5.0, w: iw, h: 0.6, fontSize: 30, color: HEX.FLAME });
      T(s, ctrl, { x: ix, y: 5.68, w: iw, h: 0.95, fontSize: 12.5, color: body });
    };
    job(M, 5.85, 'JOB A', '10-Seat Dining Pergola, Cool', [['Area', '10 × 20 = 200 ft²'], ['Factor', '1.0 × 0.85 = 0.85'], ['Tungsten 6 kW', '160 × 0.85 = 136 ft²'], ['Heaters', '200 ÷ 136 = 1.47']],
      '2 × Tungsten 6 kW', 'A 2-channel Affinity Dimmer, a wall switch, two dedicated circuits.', false);
    job(6.88, 5.85, 'JOB B', '12-Seat Porch, Solid Roof, Cold', [['Area', '12 × 20 = 240 ft²'], ['Factor', '1.1 × 0.7 = 0.77'], ['Platinum 4500 W', '143 × 0.77 = 110 ft²'], ['Heaters', '240 ÷ 110 = 2.2']],
      '3 × Platinum 4500 W', 'Three channels: a 5-channel Affinity Dimmer, two spare. A wall switch, three circuits. In a mild climate, two.', true);
  }

  {
    const s = L.content('Area And Coverage', 'Freestanding', 'Never More Than 4 Seats A Heater',
      'Freestanding heaters, Eclipse Freestanding and the Tungsten Freestanding Gas tower, have one more rule: never more than 4 seats a heater, because guests sitting around a freestanding heater block its radiant heat from the people behind them. Count both ways and take the larger: area ÷ effective coverage, and seats ÷ 4. Worked reference from the calculation model: 40 seats, partly covered, cool. By area: 800 ÷ (215 × 0.85) = 4.4, so five towers. By seats: 40 ÷ 4 = 10. Ten towers. Controls: each Tungsten Freestanding Gas tower runs at its own knob; Eclipse Freestanding comes with its Eclipse Dimmer Controller and remote and needs a 220 to 240 V IP54 outdoor outlet. Source: templates/calculation-model.md (owner rule, 30 Oct 2026). Timing: 1.5 minutes.');
    // plan: one heater, four chairs reached; a fifth chair in its shadow
    const cx = 3.35, cy = 4.3;
    caps(s, 'Plan  ·  four seats a heater', M, 1.95, 5.5);
    oval(s, cx - 1.6, cy - 1.6, 3.2, 3.2, HEX.FLAME, 70);
    oval(s, cx - 0.2, cy - 0.2, 0.4, 0.4, HEX.INK, 0, HEX.FLAME, 1.5);
    [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => chairAt(s, cx + dx * 1.0, cy + dy * 1.0, 0.32));
    chairAt(s, cx + 1.95, cy + 1.55, 0.32);
    seg(s, cx + 0.2, cy + 0.15, cx + 1.75, cy + 1.4, HEX.STEEL, 1, { dash: 'dash' });
    T(s, 'A fifth seat sits in the others\' shadow', { x: cx + 0.9, y: cy + 1.85, w: 2.6, h: 0.45, fontSize: 11, color: HEX.STEEL });
    const rx = 7.0, rw = W - M - rx;
    rule(s, rx, 1.95, rw, HEX.FLAME, 1.5);
    H1(s, 'Count both ways. Take the larger.', { x: rx, y: 2.08, w: rw, h: 0.55, fontSize: 24 });
    T(s, 'Area ÷ effective coverage, and seats ÷ 4.', { x: rx, y: 2.68, w: rw, h: 0.35, fontSize: 14, color: HEX.INK });
    caps(s, '40 seats  ·  pergola  ·  cool  ·  Freestanding Gas', rx, 3.35, rw);
    [['By area', '800 ÷ (215 × 0.85) = 4.4', '5'], ['By seats', '40 ÷ 4 = 10', '10']].forEach(([a, b, c], i) => {
      const y = 3.75 + i * 0.85; rule(s, rx, y, rw, HEX.INK, 0.75);
      T(s, a.toUpperCase(), { x: rx, y: y + 0.12, w: 1.3, h: 0.3, fontSize: 9.5, bold: true, color: HEX.STEEL, charSpacing: 3 });
      T(s, b, { x: rx + 1.3, y: y + 0.1, w: 3.4, h: 0.5, fontSize: 15, color: HEX.INK, valign: 'middle' });
      H1(s, c, { x: rx + rw - 1.0, y: y + 0.02, w: 1.0, h: 0.65, fontSize: 32, color: i ? HEX.FLAME : 'C9C9C6', align: 'right' });
    });
    rect(s, rx, 5.6, rw, 1.1, HEX.WASH, { name: 'action-box' });
    T(s, 'Ten towers, each at its own knob. Eclipse Freestanding: its own Eclipse Dimmer Controller and remote, on an IP54 outlet.', { x: rx + 0.3, y: 5.68, w: rw - 0.6, h: 0.95, fontSize: 13.5, color: HEX.INK, valign: 'middle' });
  }

  const ex1 = L.exercise({ section: 'Area And Coverage', n: 1, minutes: 4, title: 'Quick Drill: Count The Heaters',
    task: 'Five jobs, four minutes. Write the heater count for each, and the controls that go with it.',
    steps: ['Seats × 20 = area.', 'Coverage × cover × climate.', 'Divide and round up.', 'Freestanding: check seats ÷ 4 too.'],
    img: WHITE_PANEL,
    notes: 'Run it: individually, four minutes, then read the answers round the table. Answers. 1: 6 seats is 120 square feet; 120 ÷ (160 × 0.85 = 136) = 0.88: one Tungsten 6 kW, on a 1-channel Affinity Dimmer with a wall switch. 2: 16 seats is 320; 320 ÷ (143 × 0.85 = 121.6) = 2.63: three Platinum 4500 W, three channels, so a 5-channel Affinity Dimmer (or a 2 and a 1) and a wall switch. 3: 8 seats is 160; open and cool is 0.85 × 0.85 = 0.72; 160 ÷ (121 × 0.72 = 87.4) = 1.8, and 8 ÷ 4 = 2: two Eclipse Freestanding, each with its Eclipse Dimmer Controller and remote, on IP54 outdoor outlets. 4: 24 seats is 480; solid roof and cold is 1.1 × 0.7 = 0.77; 480 ÷ (160 × 0.77 = 123.2) = 3.9: four Tungsten 6 kW, four channels on a 5-channel Affinity Dimmer, one spare, and a wall switch. 5: 12 seats is 240; open and cool 0.72; 240 ÷ (215 × 0.72 = 155.3) = 1.5, so two by area, but 12 ÷ 4 = 3: three Tungsten Freestanding Gas towers, each at its own knob. Debrief: who missed the seat rule on job 5? Who forgot a controller?' });
  {
    const fx = 7.35, fy = 1.85, fw = 5.38;
    const jobs = [['6 seats · pergola · cool', 'Tungsten 6 kW'], ['16 seats · pergola · cool', 'Platinum 4500 W'], ['8 seats · open lawn · cool', 'Eclipse Freestanding'],
      ['24 seats · solid roof · cold', 'Tungsten 6 kW'], ['12 seats · open · cool', 'Tungsten Freestanding Gas']];
    jobs.forEach(([a, b], i) => {
      const y = fy + i * 0.95;
      rule(ex1, fx, y, fw, HEX.INK, 0.75);
      num(ex1, i + 1, fx, y + 0.1, { size: 24, h: 0.5, w: 0.7 });
      T(ex1, a, { x: fx + 0.7, y: y + 0.1, w: 3.0, h: 0.32, fontSize: 13.5, bold: true, color: HEX.INK });
      T(ex1, b, { x: fx + 0.7, y: y + 0.45, w: 3.0, h: 0.3, fontSize: 12, color: HEX.STEEL });
      rule(ex1, fx + 3.85, y + 0.75, fw - 3.85, 'B9B5B0', 0.75);
      T(ex1, 'HEATERS', { x: fx + 3.85, y: y + 0.12, w: 1.5, h: 0.22, fontSize: 7.5, bold: true, color: 'B9B5B0', charSpacing: 2 });
    });
    rule(ex1, fx, fy + 4.75, fw, HEX.INK, 0.75);
  }

  L.quiz({ section: 'Area And Coverage', n: 1, q: '12 Seats Around Two Fire Tables On An Open Lawn. How Many Freestanding Heaters, At Least?',
    options: ['2', '3', '4', '6'], answer: 1,
    why: 'A freestanding heater serves 4 seats at most, so 12 ÷ 4 = 3 is the floor. Check the area too: 240 ÷ (121 × 0.85 × 0.85) = 2.7 for Eclipse Freestanding on cool evenings, also 3. Take the larger. Each Eclipse Freestanding with its own Eclipse Dimmer Controller and remote; Tungsten Freestanding Gas towers at their own knobs.' });

  // ====================================================================== Part 2 · Heights, spacing, circuits
  L.divider({ n: '02', title: 'Heights, Spacing, *Circuits*', section: 'Heights, Spacing, Circuits', img: 'w-boardwalk-edits-49',
    line: 'Check the beam before you name the heater. Then the channels and the circuits.',
    notes: 'Part two, about twelve minutes: heights by model, spacing and clearances on a pergola, circuits and channels, the whole package on one job, an exercise and a check.' });

  {
    const s = L.content('Heights, Spacing, Circuits', 'Mounting Heights', 'Check The Height Before You Name The Heater',
      'Ask how high the ceiling or the beam is before you show a heater. Every range starts at 8 ft; the top of the range is what changes. Tungsten Series II 2 and 3 kW: 8 to 9 ft. 4 kW: 8 to 10 ft. 6 kW: 8 to 12 ft. Platinum Electric 2300 and 3400 W: 8 to 9 ft. 4500 W: 8 to 10 ft. Eclipse: head at 8 ft or above, set by the pole length. Mounted gas: 8 ft minimum. Code minimums under the NEC guidance: wall mounts at least 72 in, ceiling mounts at least 96 in; Tungsten Series II recessed at least 94 in. Read the table across: at 11 ft only Tungsten 6 kW is in range, or bring a heater down on a pole. A heater mounted too high loses heat at the seat. Sources: tungsten-electric-series-ii.json, platinum-electric.json, eclipse.json, platinum-gas.json; product-facts.json (codes-electric). Timing: 1.5 minutes.');
    const hs = [8, 9, 10, 11, 12];
    const models = [['Tungsten 2 · 3 kW', 8, 9], ['Tungsten 4 kW', 8, 10], ['Tungsten 6 kW', 8, 12], ['Platinum 2300 · 3400 W', 8, 9], ['Platinum 4500 W', 8, 10], ['Eclipse, head', 8, 99]];
    const on = { fill: HEX.FLAME, color: HEX.WHITE, bold: true, align: 'center' }, open = { fill: HEX.WASH, color: HEX.INK, align: 'center' }, off = { text: '', align: 'center' };
    ftable(s, [['HEATER', ...hs.map((h) => h + ' FT')],
      ...models.map(([n, lo, hi]) => [{ text: n, bold: true }, ...hs.map((h) => (hi === 99 ? (h === 8 ? { text: '8 ft +', ...on } : { text: 'pole', ...open }) : h >= lo && h <= hi ? { text: 'Yes', ...on } : off))])],
    { x: M, y: 1.95, w: 8.3, colW: [2.8, 1.1, 1.1, 1.1, 1.1, 1.1], rowH: 0.56, size: 13 });
    cap(s, 'Eclipse: the head at 8 ft or above, set by the pole length. Mounted gas: 8 ft minimum.', M, 6.0, 8.3, { h: 0.3 });
    const rx = 9.35, rw = W - M - rx;
    [['72 in', 'Wall mount, minimum'], ['96 in', 'Ceiling mount, minimum'], ['94 in', 'Tungsten Series II, recessed']].forEach(([a, b], i) => {
      const y = 1.95 + i * 1.6;
      stat(s, a, b, rx, y, rw, { size: 44, h: 0.8, lh: 0.5, ls: 13 });
    });
  }

  {
    const s = L.content('Heights, Spacing, Circuits', 'Spacing And Clearances', 'Give The Heat Room On The Pergola',
      'On a pergola, fix heaters only to the perimeter beam, a fan beam or a sub-beam; never to a rotating louvre. Bromic guidance from the Tungsten manual and FAQ: at least 20 in between heaters, 12 in from the top of the heater to the ceiling, and 3 ft from the heater face to anything that burns: shade sails, umbrellas, curtains, planting. Recessed Tungsten Series II: 19.7 in between heaters and from walls, in a cavity at least 7.5 in deep. Every Series II model tilts up to 45°, so the heat can be aimed at the seats from the beam. Gas: 8 ft minimum mounting height and 3 ft clearance above, or 14 in with the heat deflector. Every model sets its own clearances in its installation manual: check the manual for the exact model on the job. Sources: Heat The Pergola guide (planning page), c-certified-installer deck, tungsten-electric-series-ii.json, platinum-gas.json and tungsten-gas.json. Timing: 1.5 minutes.');
    // elevation of a louvred pergola: posts, perimeter beam, louvres, two heaters on the beam with dimensions
    const dx = M, dy = 1.95, dw = 7.3, fl = 6.4, by = 2.55;
    rect(s, dx + 0.3, by, 0.16, fl - by, HEX.INK, { name: 'post' }); rect(s, dx + dw - 0.46, by, 0.16, fl - by, HEX.INK, { name: 'post' });
    rect(s, dx + 0.3, by - 0.22, dw - 0.6, 0.22, HEX.INK, { name: 'beam' });
    for (let k = 0; k < 14; k++) rect(s, dx + 0.7 + k * 0.46, by - 0.56, 0.3, 0.1, 'C9C9C6', { name: 'louvre' });
    T(s, 'LOUVRES: NEVER', { x: dx + 0.5, y: dy - 0.22, w: 3, h: 0.22, fontSize: 8.5, bold: true, color: HEX.STEEL, charSpacing: 2 });
    T(s, 'PERIMETER BEAM: YES', { x: dx + dw - 3.3, y: dy - 0.22, w: 3, h: 0.22, fontSize: 8.5, bold: true, color: HEX.FLAME, charSpacing: 2, align: 'right' });
    seg(s, dx, fl, dx + dw, fl, HEX.INK, 1.5);
    const heater = (x, y) => { seg(s, x + 0.55, by, x + 0.55, y, HEX.INK, 1.5); rect(s, x, y, 1.1, 0.14, HEX.INK, { name: 'heater' }); rect(s, x + 0.08, y + 0.14, 0.94, 0.05, HEX.FLAME, { name: 'heater-glow' }); };
    const hy = by + 0.45; heater(dx + 1.6, hy); heater(dx + 3.4, hy);
    seg(s, dx + 2.72, hy + 0.07, dx + 3.38, hy + 0.07, HEX.FLAME, 1.25, { both: true }); T(s, '20 in min', { x: dx + 2.55, y: hy - 0.32, w: 1.0, h: 0.25, fontSize: 11, bold: true, color: HEX.FLAME, align: 'center' });
    seg(s, dx + 1.35, by + 0.02, dx + 1.35, hy - 0.02, HEX.FLAME, 1.25, { both: true }); T(s, '12 in', { x: dx + 0.6, y: by + 0.08, w: 0.7, h: 0.25, fontSize: 11, bold: true, color: HEX.FLAME, align: 'right' });
    // shade sail on the right at 3 ft from the face
    seg(s, dx + 5.3, hy + 1.6, dx + 6.7, hy + 1.1, '8A6A44', 2, { name: 'sail' }); T(s, 'Shade sail', { x: dx + 5.45, y: hy + 1.55, w: 1.4, h: 0.25, fontSize: 10, color: '8A6A44' });
    seg(s, dx + 4.52, hy + 0.25, dx + 5.3, hy + 1.55, HEX.FLAME, 1.25, { both: true }); T(s, '3 ft from the face', { x: dx + 3.3, y: hy + 0.75, w: 1.3, h: 0.5, fontSize: 11, bold: true, color: HEX.FLAME, align: 'right' });
    seg(s, dx + 0.9, hy + 0.25, dx + 0.9, fl - 0.02, HEX.INK, 1.1, { both: true }); T(s, '8–12 ft for Tungsten 6 kW', { x: dx + 1.0, y: 4.9, w: 2.6, h: 0.3, fontSize: 11, bold: true, color: HEX.INK });
    const sx = 1.9; seg(s, dx + sx + 1.6, fl - 0.42, dx + sx + 2.5, fl - 0.42, HEX.STEEL, 1.75); seg(s, dx + sx + 1.68, fl - 0.42, dx + sx + 1.68, fl, HEX.STEEL, 1.25); seg(s, dx + sx + 2.42, fl - 0.42, dx + sx + 2.42, fl, HEX.STEEL, 1.25);
    // the rules
    const rx = 8.35, rw = W - M - rx;
    [['20 in', 'between heaters'], ['12 in', 'heater top to ceiling'], ['3 ft', 'face to anything that burns'], ['19.7 in', 'recessed Series II, apart and from walls'], ['45°', 'tilt on every Series II model']].forEach(([a, b], i) => {
      const y = 1.95 + i * 0.95; rule(s, rx, y, rw, i === 2 ? HEX.FLAME : HEX.INK, i === 2 ? 1.5 : 0.75);
      H1(s, a, { x: rx, y: y + 0.1, w: 1.45, h: 0.55, fontSize: 26, color: HEX.FLAME });
      T(s, b, { x: rx + 1.5, y: y + 0.2, w: rw - 1.5, h: 0.65, fontSize: 13, color: HEX.INK });
    });
  }

  {
    const s = L.content('Heights, Spacing, Circuits', 'Circuits And Channels', 'One Circuit A Heater, 6 kW A Channel',
      'Two sums size the electrics. Circuits: every heater gets its own dedicated circuit, run by a licensed electrician; permit and GFCI rules vary by jurisdiction. The table gives the current each one draws: Tungsten 6 kW 25 A at 240 V, 28.8 A at 208 V; Platinum 2300, 3400 and 4500 W 9.6, 14.2 and 18.8 A at 240 V (11.1, 16.3 and 21.6 A at 208 V); Eclipse 2,900 W 12.1 A at 240 V, 13.9 A at 208 V. Recess-kit fans need their own always-on supply under 1 A. Channels: Affinity On/Off and Dimmer controllers come in 1, 2 or 5 channels, each up to 6 kW at 208 to 277 V. One Tungsten 6 kW fills a channel; two 3 kW Tungsten share one; a Platinum 4500 W takes one on its own (two would be 9 kW). Eclipse is one heater a channel on the Affinity Eclipse controller. Add a manual wall switch as the local disconnect where code asks for one. Wi-Fi and app features need compatible Affinity controls, sold separately. Sources: tungsten-electric-series-ii.json, platinum-electric.json, eclipse.json, product-facts.json (affinity-controls), B3 controls deck. Controller capacities are to confirm with the Product team. Timing: 1.5 minutes.');
    ftable(s, [['HEATER', '240 V', '208 V'],
      ['Tungsten 6 kW', { text: '25 A', align: 'right' }, { text: '28.8 A', align: 'right' }], ['Platinum 4500 W', { text: '18.8 A', align: 'right' }, { text: '21.6 A', align: 'right' }],
      ['Platinum 3400 W', { text: '14.2 A', align: 'right' }, { text: '16.3 A', align: 'right' }], ['Platinum 2300 W', { text: '9.6 A', align: 'right' }, { text: '11.1 A', align: 'right' }],
      ['Eclipse 2,900 W', { text: '12.1 A', align: 'right' }, { text: '13.9 A', align: 'right' }]],
    { x: M, y: 1.95, w: 5.4, colW: [2.6, 1.4, 1.4], rowH: 0.5, size: 13.5, boldFirst: true });
    T(s, 'One dedicated circuit a heater, by a licensed electrician. Recess-kit fans: their own always-on supply.', { x: M, y: 5.1, w: 5.4, h: 0.6, fontSize: 12, color: HEX.STEEL });
    // channel fill diagram: a channel is a 6 kW bar
    const cx = 6.6, cw = W - M - cx;
    caps(s, 'An Affinity channel carries up to 6 kW', cx, 1.95, cw);
    const bx = cx + 2.4, bw = cw - 2.4;
    [['Tungsten 6 kW', [6]], ['Two Tungsten 3 kW', [3, 3]], ['Platinum 4500 W', [4.5]], ['Two Platinum 4500 W', null]].forEach(([lab, parts], i) => {
      const y = 2.45 + i * 0.78, k = bw / 6;
      T(s, lab, { x: cx, y: y + 0.06, w: 2.35, h: 0.4, fontSize: 13, bold: true, color: HEX.INK, valign: 'middle' });
      if (parts) {
        rect(s, bx, y, bw, 0.5, HEX.WHITE, { line: HEX.INK, lw: 1, name: 'channel' });
        let x = bx; parts.forEach((p) => { rect(s, x + 0.03, y + 0.05, p * k - 0.06, 0.4, HEX.FLAME, { name: 'load' }); x += p * k; });
      } else {
        const hw = (bw - 0.12) / 2;
        [bx, bx + hw + 0.12].forEach((x0) => { rect(s, x0, y, hw, 0.5, HEX.WHITE, { line: HEX.INK, lw: 1, name: 'channel' }); rect(s, x0 + 0.03, y + 0.05, hw * 0.75 - 0.06, 0.4, HEX.FLAME, { name: 'load' }); });
        T(s, '9 kW is more than 6: two channels', { x: bx, y: y + 0.55, w: bw, h: 0.25, fontSize: 10, color: HEX.STEEL });
      }
    });
    rect(s, cx, 5.7, cw, 1.0, HEX.WASH, { name: 'action-box' });
    T(s, '1, 2 or 5 channels a controller. One Eclipse a channel. A wall switch where code asks. Controls on every line of the quote.', { x: cx + 0.3, y: 5.75, w: cw - 0.6, h: 0.9, fontSize: 14, color: HEX.INK, fontFace: 'Bodoni MT', valign: 'middle' });
  }

  {
    const s = L.content('Heights, Spacing, Circuits', 'The Whole Package', '48 Seats On A Rooftop Pergola',
      'One job, start to finish, the way you would quote it. A rooftop restaurant terrace under a louvred pergola, beams at 10 ft, 48 seats, cool evenings. Area: 48 × 20 = 960 square feet. Factor: partly covered and cool, 0.85. Heater: Tungsten Select 6 kW counts as 136, so 960 ÷ 136 = 7.06: eight. Height: 10 ft is inside the 6 kW range of 8 to 12 ft; a Platinum 4500 W would give the same count (960 ÷ 121.6 = 7.9) but 10 ft is the top of its 8 to 10 ft range on a windy roof, so the 6 kW has the headroom. Spacing: on the perimeter beams and sub-beams, never the louvres, at least 20 in apart and 12 in below the roof, tilted to the tables. Channels: eight heaters at 6 kW is eight channels: two 5-channel Affinity Dimmers, two spare for next season. Circuits: eight dedicated circuits, 25 A each at 240 V. A wall switch. A job this size, on a roof, goes to the design service before you quote it: the next part. Timing: 2 minutes.');
    const steps = [['Area', '48 × 20', '960 ft²'], ['Heaters', '960 ÷ (160 × 0.85) = 7.06', '8 × Tungsten 6 kW'], ['Height', 'Beams at 10 ft; 6 kW runs 8–12 ft', 'In range'],
      ['Spacing', 'Perimeter and sub-beams; 20 in apart, 12 in below', 'Never louvres'], ['Channels', '8 × 6 kW = 8 channels', '2 × 5-ch Dimmer'], ['Circuits', 'One a heater, 25 A at 240 V', '8 + wall switch']];
    steps.forEach(([k, sum, r], i) => {
      const y = 1.92 + i * 0.8;
      rule(s, M, y, 7.4, i === 1 ? HEX.FLAME : HEX.INK, i === 1 ? 1.5 : 0.75);
      num(s, i + 1, M, y + 0.1, { size: 20, h: 0.42, w: 0.6 });
      T(s, k.toUpperCase(), { x: M + 0.65, y: y + 0.16, w: 1.3, h: 0.28, fontSize: 9.5, bold: true, color: HEX.STEEL, charSpacing: 3 });
      T(s, sum, { x: M + 1.95, y: y + 0.12, w: 3.2, h: 0.6, fontSize: 12.5, color: HEX.INK });
      H1(s, r, { x: M + 5.1, y: y + 0.08, w: 2.3, h: 0.45, fontSize: 17, color: HEX.FLAME, align: 'right' });
    });
    pic(s, 'w-aba-restaurant', 8.35, 1.92, W - M - 8.35, 4.3, 'cover', 'photo');
    cap(s, 'A rooftop pergola bar with heaters on the beams.', 8.35, 6.27, 4.4, { fontSize: 10, h: 0.24 });
  }

  const ex2 = L.exercise({ section: 'Heights, Spacing, Circuits', n: 2, minutes: 5, title: 'Plan This Pergola',
    task: 'A 12 × 24 ft louvred pergola, beams at 9 ft, three tables of four, cool evenings. The customer wants slim and black.',
    steps: ['Seats to area.', 'Count with Tungsten Select 6 kW, then Platinum 4500 W.', 'Check 9 ft against each range.', 'Mark the beam positions, 20 in apart at least.', 'Channels, controller, circuits, switch.'],
    img: WHITE_PANEL,
    notes: 'Run it in pairs, five minutes. Model answer. 12 seats × 20 = 240 square feet. Tungsten Select 6 kW: 240 ÷ 136 = 1.76, two. Platinum 4500 W: 240 ÷ 121.6 = 1.97, two (close: say so, and offer the design service check). 9 ft is inside both ranges: 8 to 12 ft for Tungsten 6 kW, 8 to 10 ft for Platinum 4500 W. Positions: on the two long perimeter beams, one over each half of the tables, never on the louvres, tilted toward the seats (every Series II model tilts up to 45°), 12 in below the roof line, 3 ft from the face to anything that burns. Controls: two channels, one heater each, on a 2-channel Affinity Dimmer, so each half dims on its own; a wall switch; two dedicated circuits, 25 A each at 240 V for Tungsten 6 kW or 18.8 A for Platinum 4500 W. Slim and black: Tungsten Select in black on the single post, or Platinum Electric in black glass. App features need compatible Affinity controls, sold separately: put it on the quote.' });
  {
    // the pergola in plan: house wall, posts, perimeter beams, louvres, three tables of four
    const f = 0.2, X = 7.6, Y = 2.25, pw = 24 * f, ph = 12 * f;
    rect(ex2, X - 0.18, Y - 0.25, pw + 0.36, 0.18, HEX.INK, { name: 'house' });
    T(ex2, 'HOUSE', { x: X, y: Y - 0.25, w: 2, h: 0.18, fontSize: 7.5, bold: true, color: HEX.WHITE, charSpacing: 2, valign: 'middle' });
    rect(ex2, X, Y, pw, ph, HEX.WHITE, { line: HEX.INK, lw: 2, name: 'perimeter-beam' });
    for (let k = 1; k < 24; k++) seg(ex2, X + k * f, Y + 0.05, X + k * f, Y + ph - 0.05, 'E3E3E1', 0.5);
    [[0, 0], [pw, 0], [0, ph], [pw, ph]].forEach(([dx, dy]) => rect(ex2, X + dx - 0.07, Y + dy - 0.07, 0.14, 0.14, HEX.INK, { name: 'post' }));
    [4, 12, 20].forEach((c) => { oval(ex2, X + c * f - 0.33, Y + 6 * f - 0.33, 0.66, 0.66, HEX.WHITE, 0, HEX.INK, 0.75);
      [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => chairAt(ex2, X + c * f + dx * 0.55, Y + 6 * f + dy * 0.55, 0.2)); });
    T(ex2, '24 ft', { x: X, y: Y + ph + 0.08, w: pw, h: 0.25, fontSize: 11, bold: true, color: HEX.INK, align: 'center' });
    T(ex2, '12 ft', { x: X + pw + 0.1, y: Y + ph / 2 - 0.12, w: 0.5, h: 0.25, fontSize: 11, bold: true, color: HEX.INK });
    T(ex2, 'Perimeter beams in ink; louvres in grey.', { x: X, y: Y + ph + 0.4, w: pw, h: 0.25, fontSize: 10, color: HEX.STEEL, align: 'center' });
    pic(ex2, 'w-vbb7428', X - 0.25, 5.45, 5.38, 1.3, 'cover', 'photo');
  }

  L.quiz({ section: 'Heights, Spacing, Circuits', n: 2, q: 'The Pergola Beams Are 11 ft. Which Heater Can Go On Them?',
    options: ['Platinum 4500 W', 'Tungsten 6 kW', 'Tungsten 3 kW', 'Platinum 3400 W'], answer: 1,
    why: 'Tungsten 6 kW mounts at 8 to 12 ft, so 11 ft is in range. Platinum 4500 W is 8 to 10 ft, Tungsten 3 kW and Platinum 3400 W 8 to 9 ft: too high at 11 ft unless a pole brings them down. Quote it with an Affinity Dimmer channel and a wall switch.' });

  // ====================================================================== Part 3 · The design service
  L.divider({ n: '03', title: 'The Design *Service*', section: 'The Design Service', img: 'w-bromic-centrico-photos-2',
    line: 'Quote the simple ones. Send the rest, and quote from the plan that comes back.',
    notes: 'Part three, about five minutes: when to hand the job over, how to send it, and a quick sort.' });

  {
    const s = L.content('The Design Service', 'Quote It Or Send It', 'Know When To Hand It Over',
      'You can quote most residential patios and pergolas on the floor with the formula. Hand the job to the Bromic design service when it gets harder than one line: commercial or hospitality terraces and rooftops; recessing, or a pitched ceiling; gas; more than one series or more than one zone; real wind or coastal exposure; an architect or builder who needs drawings; or a customer who wants to see the coverage before they buy. The service is complimentary: heater selection, placement and coverage drawings from photos, plans or drawings, with Revit and CAD files for the trade. You still own the sale: you quote from the plan that comes back, with controls on every line. Source: data/product-facts.json (principles.design-service), data/retail/retail.json. Timing: 1 minute.');
    const cw = 5.85;
    rule(s, M, 1.92, cw, HEX.INK);
    icon(s, 'quote', M, 2.1, 0.55);
    H1(s, 'You Quote It', { x: M + 0.75, y: 2.12, w: 4, h: 0.5, fontSize: 24 });
    ['One space, seats you can count', 'One series, electric', 'A flat ceiling or a simple pergola', 'Inside the height range'].forEach((t, i) => {
      const y = 2.95 + i * 0.6; num(s, i + 1, M, y, { size: 16, h: 0.35, w: 0.5 });
      T(s, t, { x: M + 0.55, y: y + 0.02, w: cw - 0.6, h: 0.4, fontSize: 14.5, color: HEX.INK });
      rule(s, M, y + 0.48, cw, HEX.LINE, 0.5);
    });
    const rx = 6.88, rw = W - M - rx;
    rect(s, rx, 1.92, rw, 4.8, HEX.INK, { name: 'ink-panel' });
    icon(s, 'plan', rx + 0.35, 2.1, 0.55, { dark: true });
    H1(s, 'Send It To The Design Service', { x: rx + 1.1, y: 2.12, w: rw - 1.3, h: 0.5, fontSize: 22, color: HEX.WHITE });
    ['Commercial, hospitality or a rooftop', 'Recessing, or a pitched ceiling', 'Gas, or mixed series and zones', 'Wind or coastal exposure', 'An architect or builder needs drawings', 'The customer wants to see the coverage'].forEach((t, i) => {
      const y = 2.95 + i * 0.6; rule(s, rx + 0.35, y + 0.48, rw - 0.7, '5A5556', 0.5);
      T(s, t, { x: rx + 0.35, y: y + 0.02, w: rw - 0.7, h: 0.4, fontSize: 14.5, color: 'E6E2DE' });
    });
  }

  {
    const s = L.content('The Design Service', 'How To Send A Job', 'Send It Today, Quote From The Plan',
      'Four steps. Collect: photos or a plan with dimensions, the ceiling or beam height and what it is made of, how many seats and how each area is used, whether it is covered, open or windy, what power or gas is there, and the style and finish the customer likes. Send: bromic.com/design-your-space, or call 1-800-301-1293, Monday to Friday, 9 to 4 Pacific. Receive: heater selection, placement and coverage drawings. Quote: from the plan, with the controls, wall switch and circuits on every line, and walk the customer through the coverage drawing. Turnaround time is to confirm with the design team before you promise one to a customer. The picture: a design-service heat plan for a restaurant pavilion. Timing: 1 minute.');
    const st = [['Collect', 'Photos or a plan, dimensions, ceiling height, seats, cover and wind, power or gas, style.'], ['Send', 'bromic.com/design-your-space or 1-800-301-1293, Mon–Fri 9–4 PT.'],
      ['Receive', 'Heater selection, placement and coverage drawings.'], ['Quote', 'From the plan, with controls, switch and circuits on every line.']];
    st.forEach(([h, b], i) => {
      const y = 1.92 + i * 1.18, hot = i === 1;
      rule(s, M, y, 6.2, hot ? HEX.FLAME : HEX.INK, hot ? 1.5 : 0.75);
      num(s, i + 1, M, y + 0.1, { size: 28, h: 0.6, w: 0.85 });
      H1(s, h, { x: M + 0.95, y: y + 0.12, w: 5.2, h: 0.45, fontSize: 21 });
      T(s, b, { x: M + 0.95, y: y + 0.58, w: 5.25, h: 0.55, fontSize: 13, color: hot ? HEX.INK : HEX.BODY, bold: hot });
    });
    pic(s, 'w-centrico-case-study', 7.25, 1.92, W - M - 7.25, 4.4, 'cover', 'heat-plan');
    cap(s, 'A design-service heat plan for a restaurant pavilion.', 7.25, 6.38, 5.4, { fontSize: 10, h: 0.24 });
  }

  const ex3 = L.exercise({ section: 'The Design Service', n: 3, minutes: 3, title: 'Quote It Or Send It?',
    task: 'Six customers walk in. Sort them: quote on the floor, or send to the design service.',
    steps: ['Read each job card.', 'Write Q (quote) or S (send).', 'For each S, name the reason.'],
    img: WHITE_PANEL,
    notes: 'Run it fast, three minutes, as a call-out. Answers. 1, quote it: one space, electric, a flat pergola inside the height range: two Tungsten 6 kW (200 ÷ 136 = 1.5) on a 2-channel Affinity Dimmer with a wall switch. 2, send it: a 60-seat restaurant rooftop with wind on three sides is commercial and exposed. 3, send it: a 6/12 pitched porch ceiling is too steep to recess (the kits take up to 1/4 in per inch), so the design team confirms the pitched-ceiling adaptor and positions. 4, quote it: 8 lawn seats, two Eclipse Freestanding (8 ÷ 4 = 2), each with its Eclipse Dimmer Controller and remote, on IP54 outdoor outlets. 5, send it: a builder with recessed heaters in three outdoor rooms needs drawings and recess details. 6, send it: gas on a covered courtyard means clearances and the open-wall rule under a roof. Debrief: when in doubt, send it; it costs the customer nothing and you quote from a plan.' });
  {
    const fx = 7.35, fy = 1.85, fw = 5.38, cw = (fw - 0.2) / 2, ch = 1.5;
    const jobs = ['10-seat pergola, flat beams at 9 ft, electric', '60-seat restaurant rooftop, wind on three sides', 'Shingle porch, 6/12 pitched ceiling, wants it flush',
      'Lawn by the pool, 8 lounge seats, no roof', 'Builder: recessed heaters in three outdoor rooms', 'Café courtyard under a roof, gas line ready'];
    jobs.forEach((t, i) => {
      const x = fx + (i % 2) * (cw + 0.2), y = fy + Math.floor(i / 2) * (ch + 0.15);
      rect(ex3, x, y, cw, ch, HEX.WHITE, { line: HEX.INK, lw: 0.75, name: 'job-card' });
      num(ex3, i + 1, x + 0.15, y + 0.08, { size: 22, h: 0.45, w: 0.7 });
      T(ex3, t, { x: x + 0.15, y: y + 0.55, w: cw - 0.3, h: 0.6, fontSize: 12.5, color: HEX.INK });
      T(ex3, 'Q  /  S', { x: x + cw - 0.95, y: y + 0.12, w: 0.8, h: 0.3, fontSize: 11, bold: true, color: 'B9B5B0', align: 'right' });
    });
  }

  L.closing({ section: 'Close', title: 'Size It On The *Floor*',
    points: ['Seats × 20 ft², then ÷ (coverage × cover × climate).', 'Freestanding: never more than 4 seats a heater.', 'Check the height range before you name the heater.', 'One circuit a heater, 6 kW a channel, controls on every line.', 'Big, recessed, gas or exposed: send it to the design service.'],
    next: 'Next: B6 Merchandising And The Showroom.  Design service: 1-800-301-1293', img: 'l-006-028',
    notes: 'Close with the five rules. Ask everyone to size one job they quoted last month with the formula and see whether the count matches. Leave them the design service number: bromic.com/design-your-space, 1-800-301-1293, Monday to Friday 9 to 4 Pacific. Next session: Merchandising And The Showroom. Timing: 30 seconds.' });

  await L.finish('Bromic-Dealer-Sizing-And-Planning');
})().catch((e) => { console.error(e); process.exit(1); });
