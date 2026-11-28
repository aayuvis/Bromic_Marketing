// A2 · Design Studio Workshop (45 minutes): architects, landscape architects, interior and outdoor designers heat-map a
// live project with the Bromic design team. It follows the AIA CE hour (a1): the physics, comfort zones, the inverse square
// law and clearances were taught there; here they are used, not repeated. Facts: data/product-facts.json,
// data/product-marketing/*.json, templates/calculation-model.md, decks/training/b1, b2, b3 and c (heights, clearances,
// channels). Run: cd decks/training && NODE_PATH=$PWD/node_modules node a2-design-studio-workshop.js
const path = require('path');
const fs = require('fs');
const L = require('./lib');
const { pic, T, H1, HEX, W, M, rule, num, icon, rich } = L;
const WHITE_PANEL = path.join(__dirname, 'cache', 'a2-white-panel.jpg');

(async () => {
  fs.mkdirSync(path.dirname(WHITE_PANEL), { recursive: true });
  await require('sharp')({ create: { width: 1076, height: 980, channels: 3, background: '#FFFFFF' } }).jpeg().toFile(WHITE_PANEL);
  const { pres } = L.start({ title: 'Design Studio Workshop', footer: 'Design Studio Workshop  ·  Heat-map a live project with the Bromic design team' });
  await L.prepIcons();
  const S = pres.shapes;

  // ---------- drawing kit (the white papers' and manuals' language) ----------
  const rect = (s, x, y, w, h, color, o = {}) => s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color, ...(o.t != null ? { transparency: o.t } : {}) }, line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || 'solid' } : { color, width: 0 }, objectName: o.name || 'shape' });
  const oval = (s, x, y, w, h, color, t = 0, line, lw = 1) => s.addShape(S.OVAL, { x, y, w, h, fill: { color, transparency: t }, line: line ? { color: line, width: lw } : { color, width: 0 }, objectName: 'shape' });
  const seg = (s, x1, y1, x2, y2, color = HEX.INK, width = 1.25, o = {}) => {
    const flip = (x2 - x1) * (y2 - y1) < 0, ex = Math.max(x1, x2), ey = flip ? Math.min(y1, y2) : Math.max(y1, y2);
    const atEnd = x2 === ex && y2 === ey && !(x1 === ex && y1 === ey);
    s.addShape(S.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: flip,
      line: { color, width, dashType: o.dash || 'solid', ...(o.arrow ? (atEnd ? { endArrowType: 'triangle' } : { beginArrowType: 'triangle' }) : {}), ...(o.both ? { beginArrowType: 'triangle', endArrowType: 'triangle' } : {}) }, objectName: o.name || 'line' });
  };
  const hatch = (s, x, y, w, h, color = HEX.INK) => { rect(s, x, y, w, h, HEX.WHITE, { line: color, lw: 0.75, name: 'structure' });
    for (let k = x + 0.1; k + h <= x + w; k += 0.14) seg(s, k, y + h, k + h, y, color, 0.5); };
  const fbar = (s, x, y, h) => rect(s, x, y, 0.05, h, HEX.FLAME, { name: 'flame-bar' });
  const caps = (s, t, x, y, w, o = {}) => T(s, t.toUpperCase(), { x, y, w, h: 0.28, fontSize: 9.5, bold: true, color: HEX.STEEL, charSpacing: 3, ...o });
  const cap = (s, t, x, y, w, o = {}) => T(s, t, { x, y, w, h: 0.3, fontSize: 10.5, color: HEX.STEEL, ...o });
  const ftable = (s, rows, o) => s.addTable(rows.map((r, i) => r.map((c, j) => {
    const cell = typeof c === 'object' ? c : { text: String(c) };
    return { text: cell.text, options: {
      bold: i === 0 || (j === 0 && o.boldFirst), color: i === 0 ? HEX.WHITE : (j === 0 && o.steelFirst ? HEX.STEEL : HEX.INK),
      fill: { color: i === 0 ? HEX.INK : (cell.fill || HEX.WHITE) }, fontSize: i === 0 ? (o.headSize || 9.5) : (o.size || 13), charSpacing: i === 0 ? 1 : 0,
      align: cell.align || (o.align && o.align[j]) || 'left',
      border: i === 0 ? [{ type: 'none' }, { type: 'none' }, { type: 'none' }, { type: 'none' }] : [{ type: 'none' }, { type: 'none' }, { pt: 0.75, color: 'C9C9C6' }, { type: 'none' }], ...(cell.o || {}) } };
  })), { x: o.x, y: o.y, w: o.w, colW: o.colW, fontFace: 'Arial', rowH: o.rowH || 0.45, valign: 'middle', margin: [0.03, 0.1, 0.03, 0.1] });
  // a hairline-headed block: rule, Didot lead, body
  const block = (s, x, y, w, lead, body, o = {}) => {
    rule(s, x, y, w, o.rc || HEX.INK, 0.75);
    H1(s, lead, { x, y: y + 0.1, w, h: o.lh || 0.42, fontSize: o.ls || 18, color: o.dark ? HEX.WHITE : HEX.INK });
    if (body) T(s, body, { x, y: y + 0.12 + (o.lh || 0.42), w, h: o.bh || 0.7, fontSize: o.bs || 13, color: o.dark ? 'D9D6D2' : HEX.BODY });
  };

  // ---------- Brief 01: the pavilion terrace, drawn in plan (feet → inches on the slide) ----------
  // Loggia 32 × 18 ft under a solid roof, flat plaster ceiling at 9 ft with an 8 in cavity; stone wall west; drapes on the
  // open east edge; a 10-seat dining table and a 6-seat lounge; a lawn with a fire table and 6 lounge chairs, no roof.
  const TINT = { linger: 'F8C9BC', pause: 'FCE3DC', pass: 'E9E8E6' };
  function pavilion(s, X, Y, f, o = {}) {
    const px = (v) => X + v * f, py = (v) => Y + v * f, d = (v) => v * f;
    const fs8 = o.small ? 6.5 : 8;
    // house
    rect(s, px(-0.8), py(-2.6), d(32.8), d(2.6), HEX.INK, { name: 'house' });
    if (!o.small) T(s, 'HOUSE  ·  GLASS DOORS', { x: px(0.4), y: py(-2.6), w: d(24), h: d(2.6), fontSize: 7.5, bold: true, color: HEX.WHITE, valign: 'middle', charSpacing: 2 });
    // lawn, open to the sky
    rect(s, px(1), py(20.5), d(23), d(14), o.zones ? HEX.WHITE : 'F3F3F0', { line: 'B9B5B0', lw: 0.75, dash: 'dash', name: 'lawn' });
    // zones (comfort intent), drawn under the furniture
    if (o.zones) {
      rect(s, px(0.6), py(5.6), d(17.2), d(7.2), TINT.linger, { name: 'zone-linger' });
      rect(s, px(19.2), py(2.6), d(11.2), d(12.8), TINT.linger, { name: 'zone-linger' });
      oval(s, px(5.2), py(21.2), d(13.6), d(13.6), TINT.linger, 0);
      rect(s, px(0.6), py(0.3), d(30.8), d(2.0), TINT.pass, { name: 'zone-pass' });
      rect(s, px(10.2), py(12.8), d(3.6), d(7.8), TINT.pass, { name: 'zone-pass' });
    }
    // loggia outline (the roof line) and its stone wall
    rect(s, px(0), py(0), d(32), d(18), HEX.WHITE, { line: HEX.INK, lw: 1, name: 'loggia', t: o.zones ? 100 : 0 });
    rect(s, px(-0.8), py(0), d(0.8), d(18), HEX.STEEL, { name: 'stone-wall' });
    [[15.6, 17.4], [31.4, 17.4]].forEach(([cx, cy]) => rect(s, px(cx), py(cy), d(0.9), d(0.9), HEX.INK, { name: 'column' }));
    // drapes on the open east edge
    seg(s, px(32.7), py(1.2), px(32.7), py(16.4), 'B08A5E', 2, { dash: 'sysDot', name: 'drapes' });
    // heat (coverage), under the furniture
    (o.heat || []).forEach(([hx, hy, r]) => oval(s, px(hx - r), py(hy - r), d(2 * r), d(2 * r), HEX.FLAME, 62));
    // dining: a 10-seat table
    const chair = (cx, cy) => rect(s, px(cx - 0.65), py(cy - 0.65), d(1.3), d(1.3), HEX.WHITE, { line: HEX.STEEL, lw: 0.75, name: 'chair' });
    rect(s, px(4.5), py(7.6), d(11), d(2.8), HEX.WHITE, { line: HEX.INK, lw: 0.75, name: 'table' });
    [5.9, 8.6, 11.4, 14.1].forEach((cx) => { chair(cx, 6.5); chair(cx, 11.5); });
    chair(3.4, 9); chair(16.6, 9);
    // lounge: two sofas and a low table
    rect(s, px(20.5), py(3.8), d(8), d(2.4), HEX.WHITE, { line: HEX.STEEL, lw: 0.75, name: 'sofa' });
    rect(s, px(20.5), py(11.8), d(8), d(2.4), HEX.WHITE, { line: HEX.STEEL, lw: 0.75, name: 'sofa' });
    rect(s, px(22.5), py(7.8), d(4), d(2.4), HEX.WHITE, { line: HEX.INK, lw: 0.75, name: 'low-table' });
    // path to the lawn
    if (!o.zones) rect(s, px(10.5), py(18), d(3), d(2.5), 'E3E3E1', { name: 'path' });
    // lawn: fire table and six chairs
    oval(s, px(10), py(26), d(4), d(4), o.small ? HEX.STEEL : 'C9C9C6', 0, HEX.INK, 0.75);
    for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + 0.5; chair(12 + Math.cos(a) * 5, 28 + Math.sin(a) * 5); }
    // planting
    for (let k = 0; k < 6; k++) oval(s, px(25.2), py(21.6 + k * 2.2), d(1.8), d(1.8), 'DDE3D6', 0, 'A9B59A', 0.5);
    // heaters (symbols over the furniture)
    (o.heaters || []).forEach(([kind, hx, hy, lab]) => {
      if (kind === 'eclipse' || kind === 'free') { oval(s, px(hx - 0.9), py(hy - 0.9), d(1.8), d(1.8), HEX.INK, 0, HEX.FLAME, 1.5); }
      if (kind === 'free') seg(s, px(hx), py(hy), px(hx - 2.2), py(hy - 2.2), HEX.INK, 1.25);
      if (kind === 'plat') rect(s, px(hx - 1.6), py(hy - 0.45), d(3.2), d(0.9), HEX.INK, { line: HEX.FLAME, lw: 1, name: 'heater' });
      if (lab) T(s, lab, { x: px(hx + 1.1), y: py(hy - 1.9), w: 0.5, h: 0.22, fontSize: 8, bold: true, color: HEX.FLAME });
    });
    if (o.small) return;
    // labels
    const lab = (t, x, y, w, al = 'left', c = HEX.STEEL) => T(s, t, { x: px(x), y: py(y), w: d(w), h: 0.22, fontSize: fs8, color: c, align: al });
    lab('Stone wall', -0.6, 18.3, 8);
    lab('Drapes', 33.1, 11.8, 4.5, 'left', '8A6A44');
    lab('Lawn, no roof', 1.5, 21, 10);
    lab('Planting', 23.5, 34.6, 6, 'left');
    if (!o.noDims) {
      T(s, '32 ft', { x: px(17.5), y: py(18.15), w: d(12.5), h: 0.22, fontSize: fs8, bold: true, color: HEX.INK, align: 'right' });
      T(s, '18 ft', { x: px(33.1), y: py(3.2), w: 0.5, h: 0.22, fontSize: fs8, bold: true, color: HEX.INK });
    }
  }
  // north arrow and the evening wind: arrows in the free corner beside the lawn, the words under the plan
  function windRose(s, x, y, capY, capX = 7.35) {
    seg(s, x + 0.15, y + 0.5, x + 0.15, y + 0.02, HEX.INK, 1.25, { arrow: true });
    T(s, 'N', { x: x, y: y - 0.24, w: 0.3, h: 0.22, fontSize: 9, bold: true, color: HEX.INK, align: 'center' });
    seg(s, x, y + 1.35, x + 0.45, y + 0.9, HEX.FLAME, 1.75, { arrow: true });
    seg(s, x + 0.12, y + 1.6, x + 0.57, y + 1.15, HEX.FLAME, 1.75, { arrow: true });
    T(s, 'EVENING WIND FROM THE SOUTHWEST', { x: capX, y: capY, w: 3.5, h: 0.24, fontSize: 8.5, bold: true, color: HEX.FLAME, charSpacing: 2 });
  }

  // ====================================================================== 1 · Cover
  L.cover({
    kicker: 'Architect And Designer Training  ·  A2', title: 'Design Studio *Workshop*',
    sub: 'Bring a plan, or take one of ours. Read the site, set the comfort, choose the heat and draw it with the Bromic design team.',
    meta: '45 minutes  ·  Teams of three or four  ·  Four exercises  ·  Two checks', img: 'w-architects-designers-hero-image',
    notes: 'Welcome everyone. This is a studio, not a lecture: in 45 minutes each team will heat-map a real plan, from the site read to the controls, and pin it up for the room. It follows the AIA CE hour, so we will use what that hour taught (comfort zones, the inverse square law, clearances and the sizing rule) without teaching it again. Get people into teams of three or four now, and hand out the printed briefs, tracing paper and a flame-coloured pen per team. Timing: 1 minute.',
  });

  // ====================================================================== 2 · What you will take away
  {
    const s = L.content('Welcome', 'In This Studio', 'What You Will Take Away',
      'Four things to leave with. One: a site read that turns wind, cover and materials into numbers you can size with. Two: a style-first way to choose the heater; for modern rooms the answer starts with Platinum and Eclipse. Three: a sized and placed heat map, at the right heights, recessed where the ceiling allows. Four: a zoned control schedule and a plan you can send to the Bromic design service the same afternoon. Timing: 1 minute.');
    const items = [
      ['Read The Site For Heat', 'Wind, cover and materials, turned into factors and a clearance envelope.'],
      ['Choose By Design Style', 'Modern rooms start with Platinum and Eclipse.'],
      ['Size, Place, Recess', 'The formula, the height for each model, the cavity each kit needs.'],
      ['Zone It, Send It', 'Channels and switches on the plan, then to the design service.'],
    ];
    items.forEach(([h, d], i) => {
      const y = 1.95 + i * 1.18;
      rule(s, M, y, 6.1);
      num(s, i + 1, M, y + 0.1, { size: 26, h: 0.55, w: 0.8 });
      H1(s, h, { x: M + 0.95, y: y + 0.13, w: 5.15, h: 0.45, fontSize: 21 });
      T(s, d, { x: M + 0.95, y: y + 0.6, w: 5.15, h: 0.45, fontSize: 13.5 });
    });
    pic(s, 'g-plans', 7.35, 0, W - 7.35, 6.8, 'cover', 'photo');
  }

  // ====================================================================== 3 · The studio, move by move
  {
    const s = L.content('Welcome', 'The Next 45 Minutes', 'Seven Moves, One Heat Map',
      'Walk the seven moves; they are the order every Bromic heat plan follows, and the order of the rest of this deck. Minutes are a guide: the heat-map itself gets the most time. Then the box underneath: four ideas carried in from the CE hour. We will use them all today, so if anyone missed the CE hour, the one-line version is here. Two studio rules: every heater on your plan carries its controls, and no number from memory; take it from this deck or the manual. Timing: 2 minutes.');
    const moves = [['Read The Site', '4 min'], ['Set Comfort Zones', '2 min'], ['Pick By Style', '2 min'], ['Size It', '3 min'],
      ['Place And Recess', '10 min'], ['Zone The Controls', '3 min'], ['Present Back', '6 min']];
    const cw = (W - 2 * M - 6 * 0.18) / 7;
    moves.forEach(([t, m], i) => {
      const x = M + i * (cw + 0.18), hot = i === 4;
      rule(s, x, 1.95, cw, hot ? HEX.FLAME : HEX.INK, hot ? 1.5 : 0.75);
      num(s, i + 1, x, 2.05, { size: 28, h: 0.6, w: 0.9 });
      H1(s, t, { x, y: 2.7, w: cw - 0.05, h: 0.75, fontSize: 17 });
      T(s, m.toUpperCase(), { x, y: 3.5, w: cw, h: 0.28, fontSize: 9.5, bold: true, color: hot ? HEX.FLAME : HEX.STEEL, charSpacing: 3 });
    });
    rect(s, M, 4.3, 7.6, 2.4, HEX.WASH, { name: 'action-box' });
    T(s, 'CARRIED IN FROM THE CE HOUR', { x: M + 0.3, y: 4.48, w: 6, h: 0.28, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
    [['Comfort zones', 'Overlap the heat where people stay.'], ['Inverse square', 'Too high, and the heat never reaches the seat.'],
      ['Clearances', 'The manual sets them; draw the envelope.'], ['The sizing rule', 'Area ÷ (coverage × site factors).']].forEach(([h, b], i) => {
      const x = M + 0.3 + (i % 2) * 3.65, y = 4.9 + Math.floor(i / 2) * 0.85;
      H1(s, h, { x, y, w: 3.4, h: 0.38, fontSize: 16 });
      T(s, b, { x, y: y + 0.38, w: 3.4, h: 0.4, fontSize: 12, color: HEX.INK });
    });
    const rx = 8.6, rw = W - M - rx;
    rule(s, rx, 4.3, rw, HEX.INK);
    T(s, 'STUDIO RULES', { x: rx, y: 4.45, w: rw, h: 0.28, fontSize: 9.5, bold: true, color: HEX.STEEL, charSpacing: 3 });
    H1(s, 'Every heater on your plan carries its controls.', { x: rx, y: 4.85, w: rw, h: 0.8, fontSize: 18 });
    H1(s, 'No number from memory: take it from this deck or the manual.', { x: rx, y: 5.75, w: rw, h: 0.85, fontSize: 18 });
  }

  // ====================================================================== 4 · The briefs
  {
    const s = L.content('Welcome', 'Your Plan, Or Ours', 'Three Studio Briefs On The Table',
      'Teams that brought a live project use it; everyone else takes a brief. The briefs are studio exercises, not real projects. Brief 01, the pavilion terrace, is the one we work through together on screen, so take it if you want the worked answers. Brief 02 is a rooftop restaurant under an aluminium pergola, 48 seats, beams at 10 ft, open on three sides and windy: it tests heights and channels. Brief 03 is a farmhouse porch with a 6/12 pitched beadboard ceiling, cold winters and 8 seats: it tests style and the pitched-ceiling adaptor, and why you cannot recess on that slope. For your own project you need a plan at a known scale, the ceiling height and construction, and how each area is used. Timing: 1 minute.');
    const cw = 3.85, gap = (W - 2 * M - 3 * cw) / 2, fy = 1.9, fh = 2.75;
    const frame = (x) => rect(s, x, fy, cw, fh, HEX.WHITE, { line: HEX.LINE, lw: 0.75, name: 'plan-frame' });
    // 01 pavilion
    { const x = M; frame(x); pavilion(s, x + 0.75, fy + 0.4, 0.062, { small: true }); }
    // 02 rooftop pergola: 40 × 24 ft, posts, beams, louvres, twelve tables of four
    { const x = M + cw + gap; frame(x); const f = 0.074, X = x + (cw - 40 * f) / 2 + 0.05, Y = fy + 0.38;
      rect(s, X, Y, 40 * f, 24 * f, HEX.WHITE, { line: HEX.INK, lw: 1 });
      for (let k = 1; k < 20; k++) seg(s, X + k * 2 * f, Y, X + k * 2 * f, Y + 24 * f, 'D9D6D2', 0.5);
      [8, 16].forEach((yy) => seg(s, X, Y + yy * f, X + 40 * f, Y + yy * f, HEX.INK, 1.25));
      for (let c = 0; c < 4; c++) for (let r = 0; r < 3; r++) oval(s, X + (5 + c * 10) * f - 0.12, Y + (4 + r * 8) * f - 0.12, 0.24, 0.24, HEX.WHITE, 0, HEX.STEEL, 0.75);
      rect(s, X - 0.15, Y - 0.15, 0.08, 24 * f + 0.3, HEX.INK, { name: 'parapet' });
      T(s, 'PLAN  ·  BEAMS AT 10 FT', { x: x + 0.2, y: fy + fh - 0.32, w: cw - 0.4, h: 0.22, fontSize: 7.5, bold: true, color: HEX.STEEL, charSpacing: 2 }); }
    // 03 porch, in section: a 6/12 pitched ceiling falling from the house to the eave, a table under it
    { const x = M + 2 * (cw + gap); frame(x); const wx = x + 0.55, fl = fy + 2.2, top = fy + 0.5, ex = x + 3.25, ey = fy + 1.15;
      rect(s, wx - 0.16, top - 0.1, 0.16, fl - top + 0.1, HEX.INK, { name: 'house-wall' });
      seg(s, wx, top, ex + 0.2, ey - 0.1, HEX.INK, 1.75);
      seg(s, wx, top + 0.12, ex, ey, 'B08A5E', 1.25, { dash: 'dash' });
      rect(s, ex - 0.04, ey, 0.09, fl - ey, HEX.INK, { name: 'post' });
      seg(s, wx - 0.16, fl, x + cw - 0.2, fl, HEX.INK, 1.5);
      const tx = wx + 0.95; seg(s, tx, fl - 0.45, tx + 0.75, fl - 0.45, HEX.STEEL, 1.5); seg(s, tx + 0.08, fl - 0.45, tx + 0.08, fl, HEX.STEEL, 1); seg(s, tx + 0.67, fl - 0.45, tx + 0.67, fl, HEX.STEEL, 1);
      seg(s, wx + 0.18, top + 0.2, wx + 0.18, fl - 0.02, HEX.FLAME, 1, { both: true });
      T(s, '11 ft', { x: wx + 0.24, y: fy + 1.05, w: 0.5, h: 0.22, fontSize: 8.5, bold: true, color: HEX.FLAME });
      seg(s, ex - 0.22, ey + 0.05, ex - 0.22, fl - 0.02, HEX.FLAME, 1, { both: true });
      T(s, '9 ft', { x: ex - 0.68, y: ey + 0.35, w: 0.42, h: 0.22, fontSize: 8.5, bold: true, color: HEX.FLAME, align: 'right' });
      T(s, '6/12 pitch', { x: wx + 1.15, y: top + 0.05, w: 1.0, h: 0.22, fontSize: 8.5, bold: true, color: HEX.INK });
      T(s, 'Beadboard ceiling', { x: wx + 0.55, y: top + 0.62, w: 1.3, h: 0.22, fontSize: 7.5, color: '8A6A44' });
      T(s, 'SECTION', { x: x + 0.2, y: fy + fh - 0.32, w: 2, h: 0.22, fontSize: 7.5, bold: true, color: HEX.STEEL, charSpacing: 2 }); }
    const briefs = [
      ['Brief 01', 'A Modern Pavilion Terrace', 'Loggia under a solid roof, 9 ft plaster ceiling with an 8 in cavity; a lawn with a fire table. 22 seats, cool evenings.'],
      ['Brief 02', 'A Rooftop Restaurant Pergola', 'Aluminium louvred pergola, beams at 10 ft clear, open on three sides. 48 seats, cool and windy.'],
      ['Brief 03', 'A Farmhouse Porch', 'Solid roof with a 6/12 pitched beadboard ceiling, 9 to 11 ft. 8 seats, cold winters.'],
    ];
    briefs.forEach(([k, h, d], i) => {
      const x = M + i * (cw + gap);
      T(s, k.toUpperCase(), { x, y: 4.8, w: cw, h: 0.28, fontSize: 9.5, bold: true, color: i === 0 ? HEX.FLAME : HEX.STEEL, charSpacing: 4 });
      H1(s, h, { x, y: 5.08, w: cw, h: 0.45, fontSize: 19 });
      T(s, d, { x, y: 5.58, w: cw, h: 0.95, fontSize: 12.5 });
    });
    rule(s, M, 6.6, W - 2 * M, HEX.LINE);
    cap(s, 'Your own project: a plan at a known scale, the ceiling height and construction, and how each area is used.', M, 6.64, 12.1, { fontSize: 10.5, h: 0.26 });
  }

  // ====================================================================== Part 1 · Read the site
  L.divider({ n: '01', title: 'Read The *Site*', section: 'Read The Site', img: 'l-010-075',
    line: 'Before a heater goes on the plan: the wind, the cover, the materials and the evenings.',
    notes: 'Part one, about six minutes: one slide and one exercise. The site read decides the numbers you size with and the places a heater can never go.' });

  {
    const s = L.content('Read The Site', 'The Site Read', 'Four Things The Site Tells You',
      'The four reads, each with what it does to the drawing. Wind: moving air strips radiant heat from people, so long-stay seats belong on the sheltered side; on an exposed edge plan more output or a screen. Cover: a solid roof holds warmth, so the sizing rule multiplies coverage by 1.1; a pergola or part roof by 1.0; an open lawn by 0.85. Climate: mild evenings above about 50°F, 1.0; cool, about 40 to 50°F, 0.85; cold, often below about 40°F, 0.7. Materials: anything that can scorch, melt or fade inside the heater\'s clearance envelope: drapes, timber, planting, umbrellas, shade sails. The Bromic guidance for Tungsten is 3 ft from the heater face to combustibles; every model sets its own in its manual. Source: templates/calculation-model.md (factors, to be confirmed by the Product team), Heat The Pergola guide (clearances). Timing: 2 minutes.');
    const rows = [['wind', 'Wind', 'Long-stay seats on the sheltered side.', 'Shelter first'],
      ['covered-patio', 'Cover', 'Solid roof, pergola, or open to the sky.', '× 1.1 · 1.0 · 0.85'],
      ['cold', 'Climate', 'Mild, cool or cold evenings.', '× 1.0 · 0.85 · 0.7'],
      ['clearance', 'Materials', 'Fabric, timber, planting in the envelope.', '3 ft face'],
    ];
    rows.forEach(([ic, h, b, v], i) => {
      const y = 1.92 + i * 1.18;
      icon(s, ic, M, y + 0.16, 0.55);
      rule(s, M + 0.8, y, 6.0, HEX.INK);
      H1(s, h, { x: M + 0.8, y: y + 0.1, w: 3.2, h: 0.42, fontSize: 19 });
      T(s, b, { x: M + 0.8, y: y + 0.55, w: 3.9, h: 0.5, fontSize: 13 });
      H1(s, v, { x: M + 4.5, y: y + 0.12, w: 2.3, h: 0.45, fontSize: 17, color: HEX.FLAME, align: 'right' });
    });
    // a section through the brief: house, loggia under its roof, open lawn, wind arriving from the open side
    const dx = 7.75, dy = 1.95, dw = W - M - dx;
    caps(s, 'Brief 01 in section', dx, dy, dw);
    const fl = dy + 3.65;
    rect(s, dx, dy + 0.55, 0.22, fl - dy - 0.55, HEX.INK, { name: 'house' });
    hatch(s, dx + 0.22, dy + 0.75, 2.75, 0.22);
    rect(s, dx + 2.85, dy + 0.97, 0.1, fl - dy - 0.97, HEX.INK, { name: 'column' });
    seg(s, dx, fl, dx + dw, fl, HEX.INK, 1.5);
    rect(s, dx + 0.22, dy + 0.97, 2.63, fl - dy - 0.97, 'F5F5F4', { name: 'covered' });
    T(s, 'COVERED  × 1.1', { x: dx + 0.4, y: dy + 2.0, w: 2.4, h: 0.3, fontSize: 10, bold: true, color: HEX.INK, charSpacing: 2 });
    T(s, 'OPEN  × 0.85', { x: dx + 3.25, y: dy + 2.6, w: 1.8, h: 0.3, fontSize: 10, bold: true, color: HEX.INK, charSpacing: 2 });
    seg(s, dx + 2.85, dy + 1.25, dx + 2.85, dy + 2.8, 'B08A5E', 2.5, { dash: 'sysDot', name: 'drapes' });
    T(s, 'Drapes', { x: dx + 1.95, y: dy + 2.85, w: 0.85, h: 0.22, fontSize: 9, color: '8A6A44', align: 'right' });
    [0, 0.38, 0.76].forEach((o) => seg(s, dx + dw - 0.1, dy + 1.3 + o, dx + dw - 1.4, dy + 1.3 + o, HEX.FLAME, 1.5, { arrow: true }));
    T(s, 'WIND', { x: dx + dw - 1.4, y: dy + 0.95, w: 1.3, h: 0.25, fontSize: 9, bold: true, color: HEX.FLAME, charSpacing: 3, align: 'right' });
    for (let k = 0; k < 4; k++) oval(s, dx + 3.6 + k * 0.38, fl - 0.3, 0.3, 0.3, 'DDE3D6', 0, 'A9B59A', 0.5);
    T(s, '9 ft plaster ceiling, 8 in cavity', { x: dx + 0.3, y: dy + 0.42, w: 2.9, h: 0.25, fontSize: 9, color: HEX.STEEL });
    rule(s, dx, 6.05, dw, HEX.LINE);
    T(s, 'Cover and climate multiply. Brief 01: the loggia is 1.1 × 0.85, the lawn 0.85 × 0.85.', { x: dx, y: 6.12, w: dw, h: 0.6, fontSize: 13, color: HEX.INK, fontFace: 'Bodoni MT' });
  }

  const ex1 = L.exercise({ section: 'Read The Site', n: 1, minutes: 4, title: 'Read Brief 01',
    task: 'Mark the wind, the cover and every material in reach of the heat. Then write the factors for each area.',
    steps: ['Draw the wind arrows; shade the sheltered side.', 'Mark covered and open; write the cover factor in each.', 'Circle what can scorch: fabric, timber, planting.', 'Cool evenings: add the climate factor and multiply.'],
    img: WHITE_PANEL,
    notes: 'Run it: three minutes on the printed plan, one minute debrief. Model answer. Wind: the evening wind comes from the southwest, so it crosses the open lawn first and reaches the loggia through its open south edge; the stone wall shelters the west end, so the dining table at the west end is the sheltered long-stay zone, and the fire table on the lawn is the exposed one. Cover: the loggia is under a solid roof, 1.1; the lawn has no roof, 0.85. Climate: cool evenings, 0.85. So the loggia multiplies by 1.1 × 0.85 = 0.935 and the lawn by 0.85 × 0.85 = 0.72. Materials: the drapes on the east edge are fabric inside the reach of any heater over the lounge, so keep the lounge heater clear of them by the manual\'s clearance (for Tungsten, 3 ft from the face); the planting bed beside the lawn rules out a freestanding heater at the east edge; the stone wall and plaster ceiling are not a concern. Note the plaster ceiling at 9 ft with an 8 in cavity: that is what will let us recess. Factors are from templates/calculation-model.md and are still to be confirmed by the Product team.' });
  pavilion(ex1, 8.25, 2.2, 0.118, {});
  windRose(ex1, 7.4, 4.75, 6.58);

  // ====================================================================== Part 2 · Comfort and style
  L.divider({ n: '02', title: 'Comfort And *Style*', section: 'Comfort And Style', img: 'l-013-100',
    line: 'Decide how long people stay in each area, then let the architecture choose the heater.',
    notes: 'Part two, about five minutes: comfort zones by how people use each area, then the heater by the design style, and a quick check.' });

  {
    const s = L.content('Comfort And Style', 'Set Comfort Zones', 'Linger, Pause, Pass',
      'In the CE hour we named the optimal, single and dead zones by where the heat lands. In the studio we start the other way round: by how long people stay. Linger: dining, lounges, the fire table: people sit for the evening, so the heat overlaps and they feel it on every side. Pause: the bar, the outdoor kitchen, a waiting area: one heater\'s reach is enough. Pass: paths, steps and doors: light, not heat; do not spend heaters here. On Brief 01 that gives three linger zones (the dining table, the lounge and the fire table) and two pass zones (the strip along the house doors and the path to the lawn). Ask teams to shade their own plan the same way before they size anything. Timing: 2 minutes.');
    const zones = [['Linger', 'Dining, lounges, the fire table. People stay all evening: overlap the heat over every seat.', TINT.linger],
      ['Pause', 'Bars, outdoor kitchens, waiting. One heater\'s reach is enough.', TINT.pause],
      ['Pass', 'Paths, steps and doors. Light the way; keep heaters for the seats.', TINT.pass]];
    zones.forEach(([h, b, c], i) => {
      const y = 1.95 + i * 1.5;
      rect(s, M, y, 5.6, 0.1, c, { name: 'zone-key' });
      H1(s, h, { x: M, y: y + 0.2, w: 5.6, h: 0.5, fontSize: 24 });
      T(s, b, { x: M, y: y + 0.72, w: 5.4, h: 0.65, fontSize: 13.5 });
    });
    caps(s, 'Brief 01, zoned', 7.35, 1.95, 5);
    pavilion(s, 7.85, 2.65, 0.112, { zones: true, noDims: true });
    T(s, 'LINGER', { x: 8.65, y: 3.52, w: 1.2, h: 0.25, fontSize: 9, bold: true, color: HEX.INK, charSpacing: 2 });
    T(s, 'PASS', { x: 8.98, y: 4.32, w: 0.42, h: 0.2, fontSize: 7, bold: true, color: HEX.INK, charSpacing: 1, align: 'center' });
    T(s, 'PASS', { x: 10.5, y: 2.69, w: 0.6, h: 0.2, fontSize: 7, bold: true, color: HEX.INK, charSpacing: 1 });
  }

  {
    const s = L.content('Comfort And Style', 'Pick By Design Style', 'The Architecture Chooses The Heater',
      'Start from the style of the outdoor room, then check the site and the ceiling. Modern, contemporary or minimal: Platinum and Eclipse, by default. Platinum is a glass-ceramic panel 2.1 inches deep that sits flush in the ceiling with very little visible glow; Eclipse makes the heater the light over the table, with a dimmable 3000K LED ring. Transitional or farmhouse: Tungsten Select on a single post or the pitched-ceiling adaptor, in black, white or graphite. Timber or traditional: Tungsten on the beam or recessed in the low-clearance kit, so the ceiling stays the feature. Coastal: Tungsten Coastal or Platinum Electric Marine, in 316 marine-grade stainless. Industrial or hospitality: Tungsten Electric, or Tungsten Gas where the gas line runs. Every one of them is specified with its Affinity controls and a wall switch. Sources: data/product-marketing/platinum-electric.json, eclipse.json, tungsten-electric-series-ii.json; owner direction, 28 Nov 2026 (modern defaults to Platinum and Eclipse). Timing: 2 minutes.');
    const cuts = [['w-platinum-black', 'Platinum Electric'], ['w-eclipse-electric', 'Eclipse, pendant'], ['w-eclipse-portable', 'Eclipse Freestanding'],
      ['dk-Tungsten-Series-II-Select-black-hero', 'Tungsten Select'], ['w-tungsten-gas-500', 'Tungsten Gas']];
    const cw = (W - 2 * M - 4 * 0.2) / 5;
    cuts.forEach(([id, t], i) => {
      const x = M + i * (cw + 0.2);
      pic(s, id, x, 1.8, cw, 1.35, 'contain', 'product');
      T(s, t, { x, y: 3.17, w: cw, h: 0.25, fontSize: 10.5, color: i < 3 ? HEX.FLAME : HEX.STEEL, bold: i < 3, align: 'center' });
    });
    const hot = { fill: HEX.WASH };
    ftable(s, [
      ['STYLE OF THE ROOM', 'START WITH', 'KEEPS THE LINE BY'],
      [{ text: 'Modern · contemporary · minimal', ...hot, o: { color: HEX.FLAME } }, { text: 'Platinum and Eclipse', ...hot, o: { bold: true } }, { text: 'Platinum flush in the ceiling; Eclipse as the light over the table', ...hot }],
      ['Transitional · farmhouse', 'Tungsten Select', 'One post, or the pitched-ceiling adaptor; black, white or graphite'],
      ['Timber · traditional', 'Tungsten, beam or recessed', 'The low-clearance kit, so the ceiling stays the feature'],
      ['Coastal', 'Tungsten Coastal · Platinum Marine', '316 marine-grade stainless for salt air'],
      ['Industrial · hospitality', 'Tungsten Electric or Gas', 'Graphite or black on exposed beams'],
    ], { x: M, y: 3.6, w: W - 2 * M, colW: [3.35, 3.35, 5.4], rowH: 0.46, size: 12.5, boldFirst: true });
  }

  L.quiz({ section: 'Comfort And Style', n: 1, q: 'A Minimal Glass Pavilion, A Flat Plaster Ceiling, An 8 in Cavity. Where Do You Start?',
    options: ['Tungsten Gas on the beams', 'Platinum Electric flush in the ceiling, with Eclipse over the table', 'Tungsten Freestanding Gas towers', 'Tungsten Classic on drop poles'],
    answer: 1, why: 'Modern defaults to Platinum and Eclipse. The 8 in cavity is deeper than the 7.1 in the Platinum low-clearance kit needs, so it can sit flush; Eclipse adds heat and dimmable light over the table. Gas is never recessed. Both on Affinity controls with a wall switch: an Affinity Dimmer for Platinum, the Affinity Eclipse controller for Eclipse.' });

  // ====================================================================== Part 3 · Size and place
  L.divider({ n: '03', title: 'Size And *Place*', section: 'Size And Place', img: 'w-06-hr-grosveldvandervelde-nl1-2021',
    line: 'The formula, the height for each model, the cavity each kit needs, then the heat map.',
    notes: 'Part three, about sixteen minutes, and the heart of the studio: three reference slides, then ten minutes to heat-map the plan, then the worked answer.' });

  {
    const s = L.content('Size And Place', 'Size It', 'Area ÷ (Coverage × Cover × Climate)',
      'The sizing rule from the CE hour, now with both site factors. Area is the seating, at 20 square feet a seat, aisles included (source: the NAFEM space-planning chart, as published in the Restaurant Furniture seating capacity guide; templates/calculation-model.md). Coverage is one heater\'s published figure: Platinum 2300, 3400 and 4500 W cover 65, 108 and 143 square feet; Tungsten 2, 3, 4 and 6 kW cover 65, 100, 130 and 160; Eclipse 121; Tungsten Freestanding Gas 215. Multiply coverage by the cover factor and the climate factor from your site read; the grid shows the product. Divide, and round up. Freestanding heaters also never serve more than 4 seats each, because guests block a freestanding heater\'s radiant heat: count both ways and take the larger. If the site is unknown, use 0.85, partly covered and cool, and say so. Size each linger zone on its own. Factors are to be confirmed by the Product team. Timing: 1.5 minutes.');
    // the formula and the coverage line-up
    H1(s, 'Seats × 20 ft², divided by one heater\'s coverage, adjusted for the site. Round up.', { x: M, y: 1.9, w: 6.0, h: 0.95, fontSize: 20 });
    rule(s, M, 3.0, 6.0, HEX.INK);
    caps(s, 'Coverage, one heater', M, 3.1, 6);
    [['Platinum 2300 · 3400 · 4500 W', '65 · 108 · 143 ft²'], ['Tungsten 2 · 3 · 4 · 6 kW', '65 · 100 · 130 · 160 ft²'], ['Eclipse, pendant or freestanding', '121 ft²'], ['Tungsten Freestanding Gas', '215 ft²']].forEach(([a, b], i) => {
      const y = 3.45 + i * 0.44;
      T(s, a, { x: M, y, w: 3.6, h: 0.38, fontSize: 13, color: HEX.INK, valign: 'middle' });
      T(s, b, { x: M + 3.6, y, w: 2.4, h: 0.38, fontSize: 13, bold: true, color: HEX.INK, align: 'right', valign: 'middle' });
      rule(s, M, y + 0.41, 6.0, HEX.LINE, 0.5);
    });
    rect(s, M, 5.4, 6.0, 1.3, HEX.INK, { name: 'ink-panel' });
    T(s, 'FREESTANDING', { x: M + 0.3, y: 5.55, w: 3, h: 0.25, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
    H1(s, 'Never more than 4 seats a heater. Count both ways; take the larger.', { x: M + 0.3, y: 5.85, w: 5.5, h: 0.75, fontSize: 17, color: HEX.WHITE });
    // the factor grid: cover × climate, a heat-map of the multiplier
    const gx = 7.35, gy = 1.95, cw = 1.58, ch = 0.98, lw = 1.05;
    caps(s, 'Cover × climate: the multiplier', gx, gy, 5.4);
    const cols = [['Mild', '1.0'], ['Cool', '0.85'], ['Cold', '0.7']], rows = [['Open', 0.85], ['Pergola', 1.0], ['Solid roof', 1.1]];
    cols.forEach(([c, v], j) => { T(s, c, { x: gx + lw + j * cw, y: gy + 0.38, w: cw, h: 0.28, fontSize: 12, bold: true, color: HEX.INK, align: 'center' }); T(s, '× ' + v, { x: gx + lw + j * cw, y: gy + 0.64, w: cw, h: 0.24, fontSize: 10, color: HEX.STEEL, align: 'center' }); });
    const shade = (v) => (v >= 1.0 ? 'F4A28C' : v >= 0.9 ? 'F7B8A6' : v >= 0.8 ? 'F9CDBF' : v >= 0.7 ? 'FBDDD3' : 'FCEAE4');
    rows.forEach(([r, rv], i) => {
      const y = gy + 0.95 + i * ch;
      T(s, r, { x: gx, y, w: lw - 0.05, h: ch * 0.55, fontSize: 12, bold: true, color: HEX.INK, valign: 'bottom' });
      T(s, '× ' + rv.toFixed(rv === 1 ? 1 : 2).replace(/0$/, '').replace(/\.$/, '.0'), { x: gx, y: y + ch * 0.55, w: lw - 0.05, h: 0.26, fontSize: 10, color: HEX.STEEL });
      cols.forEach(([, cv], j) => {
        const v = rv * Number(cv), x = gx + lw + j * cw, def = i === 1 && j === 1;
        rect(s, x + 0.03, y + 0.03, cw - 0.06, ch - 0.06, shade(v), { name: 'factor-cell', ...(def ? { line: HEX.INK, lw: 1.5 } : {}) });
        H1(s, (Math.round(v * 100 + 1e-6) / 100).toFixed(2), { x, y: y + 0.12, w: cw, h: 0.55, fontSize: 24, align: 'center', color: HEX.INK });
        if (def) T(s, 'SITE UNKNOWN', { x, y: y + 0.64, w: cw, h: 0.22, fontSize: 7.5, bold: true, color: HEX.INK, align: 'center', charSpacing: 2 });
      });
    });
    T(s, 'Brief 01: the loggia is solid roof and cool (0.94); the lawn is open and cool (0.72).', { x: gx, y: 5.95, w: W - M - gx, h: 0.6, fontSize: 13, color: HEX.INK, fontFace: 'Bodoni MT' });
  }

  {
    const s = L.content('Size And Place', 'Place It: Heights', 'Every Range Starts At 8 ft',
      'Mounting heights by model, as Bromic publishes them. Tungsten Series II 2 and 3 kW: 8 to 9 ft; 4 kW: 8 to 10 ft; 6 kW: 8 to 12 ft. Platinum Electric 2300 and 3400 W: 8 to 9 ft; 4500 W: 8 to 10 ft. Eclipse: head at 8 ft or above; the pole length sets it. Gas, mounted: 8 ft minimum. Code minimums under the NEC guidance: wall mounts at least 72 in, ceiling mounts at least 96 in; Tungsten Series II recessed at least 94 in. The design lesson from the inverse square law: a taller ceiling needs a higher-output heater, or a pole to bring it down, never a smaller heater set higher. Under the 9 ft ceiling of Brief 01 every model here works; at 11 ft only Tungsten 6 kW, or a pole or pendant. Sources: product-facts.json (codes-electric), tungsten-electric-series-ii.json, platinum-electric.json, platinum-gas.json and tungsten-gas.json. Timing: 1.5 minutes.');
    T(s, 'Higher ceilings need more output, or a pole to bring the heat down. Never a smaller heater set higher.', { x: M, y: 1.95, w: 4.6, h: 1.4, fontSize: 20, color: HEX.INK, fontFace: 'Bodoni MT' });
    [['72 in', 'Wall mount, minimum'], ['96 in', 'Ceiling mount, minimum'], ['94 in', 'Tungsten Series II, recessed']].forEach(([a, b], i) => {
      const y = 3.65 + i * 0.95;
      rule(s, M, y, 4.6, HEX.INK);
      H1(s, a, { x: M, y: y + 0.1, w: 1.6, h: 0.6, fontSize: 30, color: HEX.FLAME });
      T(s, b, { x: M + 1.7, y: y + 0.27, w: 2.9, h: 0.4, fontSize: 13.5, color: HEX.INK });
    });
    // a height ruler: 6 to 13 ft, a bar per model
    const rx = 5.95, rw = W - M - rx, floor = 6.3, top = 2.2, ft0 = 6, ft1 = 13, k = (floor - top) / (ft1 - ft0);
    const yAt = (ft) => floor - (ft - ft0) * k;
    for (let f = 6; f <= 13; f++) {
      seg(s, rx + 0.55, yAt(f), rx + rw, yAt(f), f === 8 ? HEX.INK : 'E3E3E1', f === 8 ? 1 : 0.5, { dash: f === 8 ? 'dash' : 'solid' });
      T(s, f + ' ft', { x: rx, y: yAt(f) - 0.12, w: 0.5, h: 0.24, fontSize: 9.5, color: f === 8 ? HEX.INK : HEX.STEEL, bold: f === 8, align: 'right' });
    }
    const bars = [['Tungsten', '2 · 3 kW', 8, 9], ['Tungsten', '4 kW', 8, 10], ['Tungsten', '6 kW', 8, 12], ['Platinum', '2300 · 3400 W', 8, 9], ['Platinum', '4500 W', 8, 10], ['Eclipse', 'head', 8, null], ['Gas', 'mounted', 8, null]];
    const bw = 0.42, step = (rw - 0.75) / bars.length;
    bars.forEach(([a, b, lo, hi], i) => {
      const x = rx + 0.75 + i * step + (step - bw) / 2;
      if (hi) rect(s, x, yAt(hi), bw, yAt(lo) - yAt(hi), HEX.FLAME, { name: 'range' });
      else { [[8, 8.8, HEX.FLAME], [8.8, 9.6, 'F4A28C'], [9.6, 10.4, 'F9CDBF'], [10.4, 11.0, HEX.WASH]].forEach(([a0, a1, c]) => rect(s, x, yAt(a1), bw, yAt(a0) - yAt(a1), c, { name: 'range-open' }));
        seg(s, x + bw / 2, yAt(10.9), x + bw / 2, yAt(11.6), HEX.FLAME, 1.25, { arrow: true }); }
      H1(s, hi ? `${lo}–${hi}` : `${lo} +`, { x: x - 0.3, y: (hi ? yAt(hi) : yAt(11.6)) - 0.42, w: bw + 0.6, h: 0.38, fontSize: 15, align: 'center', color: HEX.INK });
      T(s, a, { x: x - 0.32, y: floor + 0.06, w: bw + 0.64, h: 0.22, fontSize: 9.5, bold: true, color: HEX.INK, align: 'center' });
      T(s, b, { x: x - 0.32, y: floor + 0.27, w: bw + 0.64, h: 0.22, fontSize: 8.5, color: HEX.STEEL, align: 'center' });
    });
    seg(s, rx + 0.55, yAt(9), rx + rw, yAt(9), HEX.INK, 0.75, { dash: 'sysDot' });
    T(s, 'Brief 01 ceiling, 9 ft', { x: rx + rw - 1.7, y: yAt(9) - 0.26, w: 1.7, h: 0.22, fontSize: 8.5, color: HEX.INK, align: 'right' });
  }

  {
    const s = L.content('Size And Place', 'Place It: Recess', 'Recess Where The Ceiling Allows',
      'Recessing keeps the ceiling clean, and the cavity decides whether you can. Tungsten Series II, Select and Coastal: the low-clearance kit needs a cavity at least 7.5 in deep, brings its own recess box (nothing to build on site) and is dual fan-ventilated; the fans need an always-on supply under 1 A. Keep 19.7 in between recessed heaters and from walls, mount the elements horizontal, and never cover the kit with insulation. Platinum Electric: the low-clearance kit needs 7.1 in, with the box supplied and a cooling fan on its own always-on supply under 1 A; joists at least 9.4 in apart, 12.5 in for the 4500 W; the standard kit needs 10 in, 13.8 in for 4500 W. Both kits take a flat ceiling or a gentle slope, up to 1/4 in per inch. A steeper pitch: Tungsten Series II on the pitched-ceiling adaptor, 3/12 to 12/12, tilting up to 45°, which every Series II model does. Gas is never recessed. When in doubt, send the section to the design service: they confirm the detail. Sources: tungsten-electric-series-ii.json (training, dimensions), platinum-electric.json. Timing: 1.5 minutes.');
    // two sections side by side: the cavity, the box, the fans, the dimension
    const section = (x, w, title, depth, sub, fans) => {
      const y = 2.0, top = y + 0.45, ch = 1.15;
      caps(s, title, x, y, w, { color: HEX.INK });
      hatch(s, x, top, w, 0.22);
      [x + 0.05, x + w - 0.27].forEach((jx) => rect(s, jx, top + 0.22, 0.22, ch, 'E6E2DE', { line: HEX.STEEL, lw: 0.5, name: 'joist' }));
      rect(s, x + 0.55, top + 0.35, w - 1.1, ch - 0.13, HEX.WHITE, { line: HEX.INK, lw: 1, name: 'recess-box' });
      for (let k = 0; k < fans; k++) { const fx = x + 0.9 + k * (w - 1.8); oval(s, fx, top + 0.6, 0.36, 0.36, HEX.WHITE, 0, HEX.INK, 0.75); seg(s, fx + 0.08, top + 0.78, fx + 0.28, top + 0.78, HEX.INK, 0.75); }
      rect(s, x, top + 0.22 + ch, w, 0.08, HEX.INK, { name: 'ceiling-line' });
      rect(s, x + 0.65, top + 0.22 + ch - 0.14, w - 1.3, 0.14, HEX.INK, { name: 'heater' });
      rect(s, x + 0.75, top + 0.3 + ch, w - 1.5, 0.05, HEX.FLAME, { name: 'heater-glow' });
      seg(s, x + w + 0.15, top + 0.22, x + w + 0.15, top + 0.22 + ch, HEX.FLAME, 1.25, { both: true });
      H1(s, depth, { x: x + w + 0.25, y: top + 0.42, w: 1.1, h: 0.5, fontSize: 24, color: HEX.FLAME });
      T(s, sub, { x, y: top + ch + 0.5, w: w + 1.2, h: 0.75, fontSize: 12.5, color: HEX.INK });
    };
    section(M, 2.5, 'Tungsten Series II', '7.5 in', 'Box supplied, dual fan-ventilated. 19.7 in between heaters and from walls.', 2);
    section(M + 3.95, 2.5, 'Platinum Electric', '7.1 in', 'Box supplied, fan-cooled. Joists 9.4 in apart, 12.5 in for 4500 W.', 1);
    rect(s, M, 5.35, 7.55, 1.35, HEX.WASH, { name: 'action-box' });
    T(s, 'BOTH KITS', { x: M + 0.3, y: 5.5, w: 3, h: 0.25, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
    T(s, 'Flat, or a slope up to 1/4 in per inch. Fans on an always-on supply under 1 A. Never under insulation.', { x: M + 0.3, y: 5.8, w: 7.0, h: 0.8, fontSize: 15, color: HEX.INK, fontFace: 'Bodoni MT' });
    // the decision ladder
    const lx = 8.65, lw = W - M - lx;
    rule(s, lx, 1.95, lw, HEX.FLAME, 1.5);
    H1(s, 'Can It Go Flush?', { x: lx, y: 2.05, w: lw, h: 0.5, fontSize: 21 });
    [['Gas?', 'Never recessed. Surface or pole.'], ['Steeper than 1/4 in per inch?', 'Tungsten on the pitched adaptor, 3/12 to 12/12.'],
      ['Cavity 7.5 in or more?', 'Tungsten or Platinum, flush.'], ['7.1 to 7.5 in?', 'Platinum, flush.'], ['Less?', 'Surface, post or pendant. Or send us the section.']].forEach(([q, a], i) => {
      const y = 2.7 + i * 0.8;
      num(s, i + 1, lx, y, { size: 16, h: 0.32, w: 0.45 });
      T(s, q, { x: lx + 0.5, y: y + 0.01, w: lw - 0.5, h: 0.3, fontSize: 12.5, bold: true, color: HEX.INK });
      T(s, a, { x: lx + 0.5, y: y + 0.3, w: lw - 0.5, h: 0.45, fontSize: 12 });
    });
  }

  // ---------- Exercise 2 · the heat map
  const ex2 = L.exercise({ section: 'Size And Place', n: 2, minutes: 10, title: 'Heat-Map Brief 01',
    task: 'Size each linger zone, choose by style, place every heater at its height, and recess where the ceiling allows.',
    steps: ['Seats to area for the dining table, the lounge and the lawn.', 'Use your factors; count heaters for each zone.', 'Modern pavilion: start with Platinum and Eclipse.', 'Check heights and the 8 in cavity; keep clear of the drapes.', 'Draw the coverage: no long-stay seat outside it.'],
    img: WHITE_PANEL,
    notes: 'The main event: ten minutes. Two to size, five to place, three to check. Walk the room with the Bromic design team and prompt: which zone did you size first? What height is the heater at? Can it recess in 8 in? Where are the drapes? Is any long-stay seat outside the heat? Teams on Brief 02 or 03 or their own project follow the same five steps. Brief 02 model answer: 48 seats, 960 square feet, pergola and cool, 0.85: Tungsten Select 6 kW, 960 ÷ 136 = 7.1, so 8, on the perimeter beams and sub-beams at 10 ft (inside 8 to 12 ft), never on the louvres; Platinum 4500 W also gives 8 (960 ÷ 121.6 = 7.9) but 10 ft is the top of its 8 to 10 ft range on a windy roof, so Tungsten 6 kW has the headroom. Brief 03 model answer: 8 seats, 160 square feet, solid roof and cold, 1.1 × 0.7 = 0.77: Tungsten Select 4 kW, 160 ÷ 100.1 = 1.6, so 2, in white or black on the pitched-ceiling adaptor (6/12 is inside 3/12 to 12/12), at 9 to 10 ft (4 kW: 8 to 10 ft); the 6/12 pitch is too steep to recess. The worked answer for Brief 01 is on the next slide.' });
  pavilion(ex2, 8.25, 2.2, 0.118, {});
  windRose(ex2, 7.4, 4.75, 6.58);

  {
    const s = L.content('Size And Place', 'Brief 01: A Worked Answer', 'Five Heaters, Three Zones',
      'Walk the arithmetic zone by zone. Dining: 10 seats is 200 square feet; under the solid roof on cool evenings the multiplier is 1.1 × 0.85; Eclipse covers 121, so 200 ÷ 113.1 = 1.8: two Eclipse pendants over the table, heat and light where people eat. Lounge: 6 seats, 120 square feet; Platinum 4500 W covers 143, so 120 ÷ 133.7 = 0.9: one Platinum 4500 W flush in the ceiling: the 8 in cavity beats the 7.1 in the low-clearance kit needs, and 9 ft is inside its 8 to 10 ft range. Keep it the manual\'s clearance from the drapes. Lawn: 6 seats, 120 square feet, open and cool, 0.85 × 0.85; Eclipse Freestanding covers 121, so 120 ÷ 87.4 = 1.4, and 6 seats ÷ 4 = 1.5: two Eclipse Freestanding either side of the fire table with their heads over the chairs, each needing a 220 to 240 V IP54 outdoor outlet and 79 in of floor clearance under the head, and kept off the planting. Option A for a simpler ceiling: the whole loggia, 16 seats, 320 ÷ 133.7 = 2.4, so three Platinum 4500 W recessed. Pendant height: Eclipse is mounted with the head at 8 ft or above; the pole length that gives that under a 9 ft ceiling is to confirm on the Eclipse pole clearance drawing. Timing: 2 minutes.');
    const rows = [['Dining · 10 seats', '200 ÷ (121 × 1.1 × 0.85) = 1.8', '2 Eclipse pendants'],
      ['Lounge · 6 seats', '120 ÷ (143 × 1.1 × 0.85) = 0.9', '1 Platinum 4500 W, flush'],
      ['Lawn · 6 seats', '120 ÷ (121 × 0.85 × 0.85) = 1.4;  6 ÷ 4 = 1.5', '2 Eclipse Freestanding']];
    rows.forEach(([k, sum, r], i) => {
      const y = 1.95 + i * 1.08;
      rule(s, M, y, 6.3, HEX.INK);
      T(s, k.toUpperCase(), { x: M, y: y + 0.1, w: 3.2, h: 0.26, fontSize: 9.5, bold: true, color: HEX.STEEL, charSpacing: 3 });
      T(s, sum, { x: M, y: y + 0.38, w: 6.3, h: 0.3, fontSize: 13, color: HEX.INK });
      H1(s, r, { x: M, y: y + 0.66, w: 6.3, h: 0.4, fontSize: 19, color: HEX.FLAME });
    });
    rule(s, M, 5.2, 6.3, HEX.LINE);
    ['Platinum flush in the 8 in cavity (7.1 in needed), at 9 ft: inside 8–10 ft.', 'Eclipse heads at 8 ft or above; drapes outside every envelope.', 'Freestanding heads over the chairs, off the planting, on IP54 outlets.'].forEach((t, i) => {
      const y = 5.3 + i * 0.47; num(s, i + 1, M, y - 0.03, { size: 15, h: 0.32, w: 0.45 });
      T(s, t, { x: M + 0.48, y, w: 5.85, h: 0.42, fontSize: 12.5, color: HEX.INK });
    });
    caps(s, 'Plan  ·  worked answer', 7.35, 1.95, 5);
    pavilion(s, 7.85, 2.62, 0.11, { heat: [[7.5, 9, 6.2], [12.5, 9, 6.2], [24.5, 9, 6.8], [8.5, 24.5, 6.2], [15.5, 30.5, 6.2]],
      heaters: [['eclipse', 7.5, 9], ['eclipse', 12.5, 9], ['plat', 24.5, 9], ['free', 8.5, 24.5], ['free', 15.5, 30.5]] });
    // legend
    const lgx = 11.2; [['eclipse', 'Eclipse pendant'], ['plat', 'Platinum, flush'], ['free', 'Eclipse Freestanding'], ['heat', 'Coverage']].forEach(([k, t], i) => {
      const y = 4.95 + i * 0.36, cx = lgx + 0.12, cy = y + 0.11;
      if (k === 'eclipse' || k === 'free') oval(s, cx - 0.09, cy - 0.09, 0.18, 0.18, HEX.INK, 0, HEX.FLAME, 1.25);
      if (k === 'free') seg(s, cx, cy, cx - 0.16, cy - 0.16, HEX.INK, 1);
      if (k === 'plat') rect(s, cx - 0.15, cy - 0.05, 0.3, 0.1, HEX.INK, { line: HEX.FLAME, lw: 1, name: 'heater' });
      if (k === 'heat') oval(s, cx - 0.11, cy - 0.11, 0.22, 0.22, HEX.FLAME, 62);
      T(s, t, { x: lgx + 0.32, y, w: 1.25, h: 0.24, fontSize: 9, color: HEX.INK });
    });
  }

  // ====================================================================== Part 4 · Controls and the pin-up
  L.divider({ n: '04', title: 'Zone It, *Send It*', section: 'Zone It, Send It', img: 'w-bromic-scottsdale-aft-bracketed-9',
    line: 'Channels on the plan, the pin-up, then the plan to the design team.',
    notes: 'Part four, about twelve minutes: zoning the controls, a check, the present-back and the design service.' });

  {
    const s = L.content('Zone It, Send It', 'Zone The Controls', 'A Channel For Every Zone',
      'Controls are part of the design, never an option. Zone by how people use the space, then give each zone its channels. Affinity On/Off and Dimmer controllers come in 1, 2 or 5 channels, each up to 6 kW at 208 to 277 V: one 6 kW Tungsten fills a channel, two 3 kW Tungsten share one, a 4500 W Platinum takes one on its own. The Dimmer is the one we recommend for Tungsten and Platinum: 1% steps. Eclipse takes one heater a channel on the Affinity Eclipse controller, heat and light set separately. A manual wall switch is the local disconnect where code asks for one. Every heater gets a dedicated circuit by a licensed electrician: at 240 V a Tungsten 6 kW draws 25 A, a Platinum 4500 W 18.8 A, an Eclipse 2,900 W 12.1 A; the recess-kit fans need their own always-on supply. The app adds zones, schedules and timers, with Alexa, Google Assistant, Control4, Crestron and Lutron where compatible. Wi-Fi and app features need compatible Affinity controls, sold separately. Sources: product-facts.json (affinity-controls), tungsten-electric-series-ii.json, platinum-electric.json, eclipse.json; B3 Affinity deck. Controller capacities are to confirm with the Product team. Timing: 1.5 minutes.');
    const steps = [['Zone by use', 'Each linger zone on its own channel, so the client heats only what is in use.'],
      ['6 kW a channel', 'One Tungsten 6 kW, two Tungsten 3 kW, or one Platinum 4500 W. At 208–277 V.'],
      ['One Eclipse a channel', 'On the Affinity Eclipse controller; heat and light set separately.'],
      ['1, 2 or 5 channels', 'Choose the controller; a spare channel is next season\'s heater.'],
      ['Switch and circuit', 'A wall switch where code asks; a dedicated circuit for every heater.']];
    steps.forEach(([h, b], i) => {
      const y = 1.92 + i * 0.95;
      rule(s, M, y, 6.9, i === 1 ? HEX.FLAME : HEX.INK, i === 1 ? 1.5 : 0.75);
      num(s, i + 1, M, y + 0.08, { size: 22, h: 0.48, w: 0.7 });
      H1(s, h, { x: M + 0.75, y: y + 0.1, w: 2.3, h: 0.45, fontSize: 18 });
      T(s, b, { x: M + 3.1, y: y + 0.12, w: 3.8, h: 0.75, fontSize: 12.5 });
    });
    const px = 7.95, pw = W - M - px;
    rect(s, px, 1.92, pw, 4.78, HEX.INK, { name: 'ink-panel' });
    icon(s, 'circuit', px + 0.35, 2.15, 0.55, { dark: true });
    H1(s, 'Circuits At 240 V', { x: px + 1.05, y: 2.2, w: pw - 1.3, h: 0.5, fontSize: 22, color: HEX.WHITE });
    [['Tungsten 6 kW', '25 A'], ['Platinum 4500 W', '18.8 A'], ['Platinum 3400 W', '14.2 A'], ['Platinum 2300 W', '9.6 A'], ['Eclipse 2,900 W', '12.1 A']].forEach(([a, b], i) => {
      const y = 3.0 + i * 0.52; rule(s, px + 0.35, y, pw - 0.7, '5A5556', 0.5);
      T(s, a, { x: px + 0.35, y: y + 0.08, w: 2.8, h: 0.38, fontSize: 13.5, color: 'E6E2DE' });
      H1(s, b, { x: px + 3.0, y: y + 0.04, w: pw - 3.35, h: 0.42, fontSize: 18, color: HEX.FLAME, align: 'right' });
    });
    T(s, 'One dedicated circuit a heater, by a licensed electrician. Recess-kit fans on their own always-on supply. App features need compatible Affinity controls, sold separately.', { x: px + 0.35, y: 5.75, w: pw - 0.7, h: 0.85, fontSize: 11, color: 'B9B5B0' });
  }

  const ex3 = L.exercise({ section: 'Zone It, Send It', n: 3, minutes: 3, title: 'Write The Control Schedule',
    task: 'Fill in the schedule for your plan: one row a zone, with its channels, its controller and its switch.',
    steps: ['One row for each linger zone.', 'Count the load: 6 kW a channel; one Eclipse a channel.', 'Pick the controller: 1, 2 or 5 channels.', 'Add the wall switch, the circuits and the app.'],
    img: WHITE_PANEL,
    notes: 'Run it: three minutes, then compare with the model answer. Brief 01. Zone 1, dining: two Eclipse pendants, one a channel, on an Affinity Eclipse controller (two channels used), heat and light set separately; two dedicated circuits, 12.1 A each at 240 V; the light runs on its own 24 V DC circuit inside the same junction box. Zone 2, lounge: one Platinum 4500 W on a 1-channel Affinity Dimmer, 1% dimming; one dedicated circuit, 18.8 A at 240 V, plus the recess kit fan on an always-on supply under 1 A. Zone 3, lawn: two Eclipse Freestanding, each with its own Eclipse Dimmer Controller and remote, on 220 to 240 V IP54 outdoor outlets; app control of the freestanding model is to confirm with the Product team. A manual wall switch by the doors where code asks for a local disconnect. The app for zones and schedules: Wi-Fi and app features need compatible Affinity controls, sold separately. Brief 02: eight Tungsten 6 kW, one a channel, so eight channels: two 5-channel Affinity Dimmers with two spare, eight dedicated circuits at 25 A, 240 V, and a wall switch. Brief 03: two Tungsten 4 kW; two would be 8 kW, more than one 6 kW channel, so one a channel on a 2-channel Affinity Dimmer, two dedicated circuits sized from the manual, and a wall switch.' });
  {
    const fx = 7.35, fy = 1.85, fw = 5.38;
    caps(ex3, 'Control schedule  ·  your plan', fx, fy, fw);
    const blank = { text: ' ' };
    ftable(ex3, [['ZONE', 'HEATERS', 'CHANNELS', 'CONTROLLER', 'SWITCH · CIRCUITS'],
      ...[1, 2, 3, 4, 5].map(() => [blank, blank, blank, blank, blank])],
    { x: fx, y: fy + 0.38, w: fw, colW: [0.95, 1.05, 0.95, 1.15, 1.28], rowH: [0.4, 0.68, 0.68, 0.68, 0.68, 0.68], headSize: 8, size: 11 });
    T(ex3, 'Load check: a channel carries up to 6 kW at 208–277 V. One Eclipse a channel.', { x: fx, y: fy + 4.3, w: fw, h: 0.5, fontSize: 11, color: HEX.STEEL });
  }

  L.quiz({ section: 'Zone It, Send It', n: 2, q: 'Seven Platinum 4500 W Heaters On Affinity Dimmers. What Do You Specify?',
    options: ['Four channels: two heaters a channel', 'Seven channels: a 5-channel and a 2-channel Dimmer', 'One 5-channel Dimmer', 'Two channels, one for each side'],
    answer: 1, why: 'A channel carries up to 6 kW, and two 4500 W heaters would be 9 kW, so each Platinum 4500 W takes a channel of its own: seven channels, for example a 5-channel and a 2-channel Affinity Dimmer, with a manual wall switch and seven dedicated circuits. This is the 40-seat reference job from the sizing model (800 ÷ (143 × 0.85) = 6.6, so 7). Source: data/retail/retail.json, sizing page; templates/calculation-model.md.' });

  // ---------- Exercise 4 · present back: the pin-up
  const ex4 = L.exercise({ section: 'Zone It, Send It', n: 4, minutes: 6, title: 'Pin It Up',
    task: 'Two minutes a team. Present the heat map as you would to a client, then take one question from the design team.',
    steps: ['The site in one line: wind, cover, climate.', 'The linger zones, and the heater for each, by style.', 'The numbers: heaters, heights, recess or not.', 'The controls: zones, channels, the switch.'],
    img: WHITE_PANEL,
    notes: 'Run it: two or three teams, two minutes each, then one question from the Bromic design team per team. What good looks like: the site read names the sheltered side and the factors; every linger seat is inside the coverage; every heater has a height inside its range, and the recess is checked against the cavity; every heater carries its controls and a wall switch; nothing from memory. Questions the design team can ask: "What happens to your count if the client closes the drapes?" "Why this height?" "Which seat is coldest, and what would you do about it?" "Where does the electrician run the circuits?" Then tell them the next step: send this plan, as it is, to the design service, and they will get back heater selection, placement and coverage drawings, with Revit and CAD files for the set.' });
  {
    // a pin-up board, drawn: four panels in a landscape sheet
    const bx = 7.35, by = 1.85, bw = 5.38, bh = 3.8;
    rect(ex4, bx, by, bw, bh, HEX.WHITE, { line: HEX.INK, lw: 1, name: 'board' });
    const pane = (x, y, w, h, label, n) => { rect(ex4, x, y, w, h, HEX.GREY, { name: 'pane' }); num(ex4, n, x + 0.12, y + 0.06, { size: 14, h: 0.3, w: 0.4 }); T(ex4, label.toUpperCase(), { x: x + 0.5, y: y + 0.1, w: w - 0.6, h: 0.25, fontSize: 8, bold: true, color: HEX.INK, charSpacing: 2 }); };
    pane(bx + 0.15, by + 0.15, 3.0, 3.5, 'Plan and heat map', 1);
    pavilion(ex4, bx + 0.58, by + 0.75, 0.068, { small: true, heat: [[7.5, 9, 6.2], [12.5, 9, 6.2], [24.5, 9, 6.8], [8.5, 24.5, 6.2], [16.5, 31, 6.2]] });
    pane(bx + 3.3, by + 0.15, 1.93, 1.1, 'Section', 2);
    seg(ex4, bx + 3.45, by + 0.62, bx + 5.1, by + 0.62, HEX.INK, 1); rect(ex4, bx + 4.0, by + 0.62, 0.5, 0.07, HEX.INK); seg(ex4, bx + 3.45, by + 1.1, bx + 5.1, by + 1.1, HEX.INK, 1); seg(ex4, bx + 4.9, by + 0.66, bx + 4.9, by + 1.08, HEX.FLAME, 1, { both: true });
    pane(bx + 3.3, by + 1.35, 1.93, 1.1, 'Controls', 3);
    for (let r = 0; r < 3; r++) rule(ex4, bx + 3.45, by + 1.75 + r * 0.2, 1.65, HEX.STEEL, 0.5);
    pane(bx + 3.3, by + 2.55, 1.93, 1.1, 'Style', 4);
    pic(ex4, 'w-eclipse-electric', bx + 3.45, by + 2.9, 0.75, 0.68, 'contain'); pic(ex4, 'w-platinum-black', bx + 4.3, by + 2.9, 0.8, 0.68, 'contain');
    T(ex4, 'One board a team: plan, section, control schedule and the heaters by style.', { x: bx, y: by + bh + 0.12, w: bw, h: 0.5, fontSize: 12, color: HEX.INK, fontFace: 'Bodoni MT' });
  }

  {
    const s = L.content('Zone It, Send It', 'The Design Service', 'Send The Plan, Get The Heat Map Back',
      'The plan on your pin-up board is exactly what the Bromic design service works from. Send the plan with its dimensions, the ceiling height and construction (and the cavity depth if you want to recess), what covers each area and how open it is, the seats and how each area is used, the style and finish, and what power or gas is at hand. Photos work too. What comes back is complimentary: heater selection, placement and coverage drawings, with Revit and CAD files for your set. Send it at bromic.com/design-your-space or call 1-800-301-1293, Monday to Friday, 9 to 4 Pacific. Turnaround time is to confirm with the design team before you quote one to a client. The image is a design-service heat plan for a restaurant pavilion. Source: data/product-facts.json (principles.design-service), platinum-electric.json and eclipse.json (Revit and CAD). Timing: 1.5 minutes.');
    caps(s, 'Send', M, 1.92, 5);
    [['The plan, with dimensions', 'PDF, CAD, or a photo of the sketch'], ['The ceiling', 'Height, construction, cavity depth, slope'], ['The site', 'Cover, open sides, wind, the evenings'],
      ['The people', 'Seats, and how each area is used'], ['The look', 'Style and finish'], ['The supply', 'Power or gas at hand']].forEach(([h, b], i) => {
      const y = 2.3 + i * 0.7;
      rule(s, M, y, 6.0, HEX.INK, 0.75);
      num(s, i + 1, M, y + 0.08, { size: 17, h: 0.36, w: 0.5 });
      H1(s, h, { x: M + 0.55, y: y + 0.09, w: 2.85, h: 0.42, fontSize: 16 });
      T(s, b, { x: M + 3.45, y: y + 0.13, w: 2.6, h: 0.5, fontSize: 12 });
    });
    pic(s, 'w-centrico-case-study', 7.2, 1.92, W - M - 7.2, 2.9, 'cover', 'heat-plan');
    cap(s, 'A design-service heat plan for a restaurant pavilion.', 7.2, 4.86, 5, { fontSize: 10, h: 0.24 });
    rect(s, 7.2, 5.2, W - M - 7.2, 1.5, HEX.WASH, { name: 'action-box' });
    T(s, 'WHAT COMES BACK, COMPLIMENTARY', { x: 7.5, y: 5.33, w: 5, h: 0.25, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
    T(s, 'Heater selection, placement and coverage drawings. Revit and CAD files for your set.', { x: 7.5, y: 5.6, w: 5.0, h: 0.55, fontSize: 14, color: HEX.INK, fontFace: 'Bodoni MT' });
    T(s, 'bromic.com/design-your-space  ·  1-800-301-1293', { x: 7.5, y: 6.22, w: 5.0, h: 0.35, fontSize: 13, bold: true, color: HEX.INK });
  }

  L.closing({ section: 'Close', title: 'Draw The Heat With The *Building*',
    points: ['Read the site first: wind, cover, climate, materials.', 'Modern rooms start with Platinum and Eclipse.', 'Size each linger zone: area ÷ (coverage × cover × climate).', 'Inside the height range; flush where the cavity allows.', 'A channel for every zone, controls on every heater.'],
    next: 'Send your next plan: bromic.com/design-your-space  ·  1-800-301-1293', img: 'w-bromic-platinum-electric-marine-patio-heater',
    notes: 'Close with the five habits and ask each team which one changed their plan most. Then the action: every team leaves with a plan ready to send to the design service; ask them to send it this week, so the heat goes on the drawing before design development closes. Mon to Fri, 9 to 4 Pacific. Timing: 1 minute.' });

  await L.finish('Bromic-Design-Studio-Workshop');
})().catch((e) => { console.error(e); process.exit(1); });
