// Training Hub · Builder track · D1: Heat At Planning (30-minute builder workshop).
// Facts: content/guides/A16-pre-wire-guide.md (trade order, rough-in, circuits, checklist), content/sales/A15-builder-program.md and
// content/articles/BLD-CO-01 (Good, Better, Best; budget; model home), content/sales/A25-electrical-contractor-guide.md (controls,
// Partner Program, reseller certificate), BLD-AW-01 (NAHB figures), reports/white-papers/pergola-2027/content.py (recess cavities,
// 23% from Bromic Trends 2026 / Atomik Research), templates/calculation-model.md (sizing), data/product-facts.json.
// Run: cd decks/training && NODE_PATH=$PWD/node_modules node d1-heat-at-planning.js
const L = require('./lib');
const { T, H1, pic, rule, num, stat, HEX, W, M } = L;
const path = require('path');

async function main() {
  L.start({ title: 'Heat At Planning', footer: 'Builder Workshop · Heat At Planning' });
  await L.prepIcons();
  const pres = L.pres, SH = () => pres.shapes;
  const caps = (s, t, x, y, w, o = {}) => T(s, t.toUpperCase(), { x, y, w, h: 0.3, fontSize: 9.5, bold: true, color: HEX.STEEL, charSpacing: 3, ...o });
  const box = (s, x, y, w, h, fill, name = 'panel', o = {}) => s.addShape(SH().RECTANGLE, { x, y, w, h, fill: fill ? { color: fill } : { type: 'none' }, line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || 'solid' } : { color: fill || HEX.WHITE, width: 0 }, objectName: name });
  function line(s, x1, y1, x2, y2, o = {}) {
    s.addShape(SH().LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: (x2 - x1) * (y2 - y1) < 0,
      line: { color: o.color || HEX.INK, width: o.width || 1, dashType: o.dash || 'solid', endArrowType: o.end, beginArrowType: o.begin }, objectName: o.name || 'line' });
  }
  const heater = (s, x, y, w) => { box(s, x, y, w, 0.14, HEX.INK, 'heater'); box(s, x + 0.05, y + 0.1, w - 0.1, 0.04, HEX.FLAME, 'heater-glow'); };
  const lab = (s, t, x, y, w, o = {}) => T(s, t, { x, y, w, h: o.h || 0.28, fontSize: o.size || 10.5, color: o.color || HEX.STEEL, align: o.align || 'left', valign: 'middle', bold: !!o.bold });
  const WHITE = path.join(__dirname, 'cache', 'd-white-panel.jpg');
  await require('sharp')({ create: { width: 1076, height: 980, channels: 3, background: '#FFFFFF' } }).jpeg().toFile(WHITE);
  const SRC = (s, t) => T(s, t, { x: M, y: 6.62, w: 12.1, h: 0.3, fontSize: 9, color: HEX.STEEL });

  // 1 · cover
  L.cover({
    kicker: 'Builder Workshop · D1', title: 'Heat At *Planning*',
    sub: 'Put outdoor heat on the drawing, pre-wire it at framing, and sell it as a package your buyers can choose.',
    meta: '30 minutes · 2 exercises · 2 knowledge checks', img: 'd-recessed-pavilion',
    notes: 'Welcome (1 min). This workshop is for home builders and their teams: sales, purchasing, site supervisors and the design centre. In thirty minutes we cover why heat belongs on the drawing, the pre-wire at framing, a Good, Better, Best package with controls in every tier, and how to put heat in the budget without anyone guessing at prices. Two exercises and two quick checks; have a pen, a plan and a partner ready.',
  });

  // 2 · take-aways
  {
    const s = L.content('Welcome', 'In This Workshop', 'What You Will Take Away',
      'Four things (1 min). Why heat goes on the drawing, not the punch list. The pre-wire: what goes in at framing, and in what order. A builder package in three tiers, each with its controls. And how to carry heat in the base budget or as a standard option, with our design service and the Partner Program behind you.');
    [['Why Heat Goes On The Drawing', 'Most new homes get a patio. Few plan the warmth to use it.'],
     ['The Pre-Wire At Framing', 'Circuits, blocking, recess cavities, the controller and the wall switch.'],
     ['A Builder Package', 'Good, Better, Best, with controls in every tier.'],
     ['Heat In The Budget', 'In the base package or as a standard option, with our design service and the Partner Program.']].forEach(([h, d], i) => {
      const y = 1.95 + i * 1.2;
      rule(s, M, y, 6.0);
      num(s, i + 1, M, y + 0.12, { size: 26, h: 0.55, w: 0.8 });
      H1(s, h, { x: M + 0.95, y: y + 0.14, w: 5.05, h: 0.45, fontSize: 21 });
      T(s, d, { x: M + 0.95, y: y + 0.6, w: 5.05, h: 0.5, fontSize: 14 });
    });
    pic(s, 'l-010-067', 7.35, 0, W - 7.35, 6.8, 'cover', 'photo');
  }

  // 3 · divider
  L.divider({ n: '01', title: 'Why Heat Goes On The *Drawing*', line: 'The patio is already on the plan. The evenings are not, yet.', img: 'l-010-071', section: 'Why Heat Goes On The Drawing',
    notes: 'Part one (4 min). Three numbers on the patio, one on heat, and what it costs to decide late.' });

  // 4 · the patio is on the plan
  {
    const s = L.content('Why Heat Goes On The Drawing', 'The Market', 'The Patio Is Already On The Plan',
      'Three numbers from the National Association of Home Builders. 60.5% of single-family homes started in 2025 came with a patio, up from 59.6% in 2019 (Census Survey of Construction data, NAHB Eye on Housing, Sept 2026). The average new-home patio is about 320 square feet (NAHB Builder Practices Survey 2025). And 86% of recent and prospective buyers rate a patio essential or desirable, level with the laundry room as the most-wanted feature (NAHB, What Home Buyers Really Want, 2024 edition). The patio sells. The question is whether it works after dark.');
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    [['60.5%', 'of single-family homes started in 2025 came with a patio'], ['320 ft²', 'the average new-home patio'], ['86%', 'of buyers rate a patio essential or desirable']].forEach(([f, l], i) => {
      stat(s, f, l, M + i * (cw + 0.4), 1.9, cw, { size: 60, h: 1.0, lh: 0.6, ls: 15, lc: HEX.INK });
    });
    pic(s, 'w-240619-yorba-linda-ca-dc-64', M, 3.85, W - 2 * M, 2.7, 'cover', 'photo');
    SRC(s, 'Sources: NAHB Eye on Housing, 2026 (Census Survey of Construction); NAHB Builder Practices Survey 2025; NAHB What Home Buyers Really Want, 2024.');
  }

  // 5 · statement
  L.statement({ section: 'Why Heat Goes On The Drawing', kicker: 'The Planning Gap', img: 'l-006-028',
    line: 'Only 23% Of Homeowners Plan Heat In From The *Start*.',
    notes: 'Pause on this one (1 min). Only 23% of homeowners prioritise outdoor heating at the planning stage, yet 67% say heating extends how much they use their outdoor space. Your option sheet is where most buyers meet the idea for the first time. Source: Bromic Outdoor Living Trends 2026, US homeowner survey by Atomik Research. The survey base and fieldwork date are still to confirm with Marketing before external use.' });

  // 6 · the cost of deciding late
  {
    const s = L.content('Why Heat Goes On The Drawing', 'Decide Early', 'The Same Heater Costs More Every Week You Wait',
      'Walk the three moments (1.5 min). Decided at design or pre-framing, heat is a line on the electrical plan, with blocking and boxes at rough-in, and the heater sits exactly over the table, flush if you like. After framing but before close-in, it is a change order and an extra trip for the electrician. After finish, it means opened ceilings or walls, patching, repainting, surface conduit, and often no recess option at all. Source: A16 pre-wire guide. We do not quote retrofit costs: a typical rough-in cost range from partner electricians is still to confirm with US field sales.');
    const st = [['At Design Or Pre-Framing', 'A line on the electrical plan. Blocking and boxes at rough-in. The heater sits over the table, flush if you like.', HEX.STEEL, 0.75],
      ['Before Close-In', 'A change order, and an extra trip for the electrician.', HEX.INK, 1.5],
      ['After Finish', 'Opened ceilings, patching and paint, surface conduit, and often no recess at all.', HEX.FLAME, 3]];
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    st.forEach(([h, d, c, pt], i) => {
      const x = M + i * (cw + 0.4);
      num(s, i + 1, x, 1.95, { size: 44, h: 0.8, w: 1.2, color: i === 2 ? HEX.FLAME : HEX.INK });
      rule(s, x, 2.9, cw, c, pt);
      H1(s, h, { x, y: 3.05, w: cw, h: 0.5, fontSize: 20 });
      T(s, d, { x, y: 3.6, w: cw, h: 1.1, fontSize: 14 });
    });
    box(s, M, 5.0, W - 2 * M, 1.55, HEX.WASH, 'action-box');
    T(s, 'ACTION', { x: M + 0.35, y: 5.22, w: 3, h: 0.28, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
    H1(s, 'Offer heat at the options stage. A pre-wire of circuits, boxes and blocking can be sold even when the heaters come later.', { x: M + 0.35, y: 5.52, w: W - 2 * M - 0.7, h: 0.9, fontSize: 19 });
  }

  // 7 · divider
  L.divider({ n: '02', title: 'The Pre-Wire At *Framing*', line: 'Circuits, blocking, recess cavities, the controller and the wall switch.', img: 'd-installers-recessing', section: 'The Pre-Wire',
    notes: 'Part two (9 min with the exercise). What goes in at framing, who does it, and in what order.' });

  // 8 · every trade in the right order
  {
    const s = L.content('The Pre-Wire', 'Every Trade, In The Right Order', 'Six Moments, One Install',
      'Read the sequence left to right (1 min). One, plans: the builder, the designer and Bromic\'s design service fix the heated zones, heater type and count, mount and fuel. Two, pre-framing: the framer sets recess openings, blocking and the ceiling build-up. Three, electrical rough-in by a licensed electrician: circuits, boxes, control runs, the switch location and panel capacity. Four, gas rough-in by a licensed gas fitter, for gas models only. Five, the rough inspection before close-in. Six, trim-out: heaters, recess kits, controllers and commissioning. When each trade knows its moment, heat goes in once. Source: A16 pre-wire guide.');
    const S6 = [['Plans', 'Builder, designer, Bromic design service', 'Heated zones, heater type and count, mount, fuel'],
      ['Pre-Framing', 'Framer, builder', 'Recess openings, blocking, ceiling build-up'],
      ['Electrical Rough-In', 'Licensed electrician', 'Circuits, boxes, control runs, switch, panel capacity'],
      ['Gas Rough-In', 'Licensed gas fitter', 'Line size, stub-out, shut-off. Gas models only'],
      ['Rough Inspection', 'The authority having jurisdiction', 'Inspected before close-in'],
      ['Trim-Out', 'Electrician, gas fitter', 'Heaters, recess kits, controllers, commissioning']];
    const cw = (W - 2 * M - 5 * 0.22) / 6;
    S6.forEach(([h, who, d], i) => {
      const x = M + i * (cw + 0.22);
      num(s, i + 1, x, 1.95, { size: 40, h: 0.75, w: 1.2, color: i === 2 ? HEX.FLAME : HEX.INK });
      rule(s, x, 2.8, cw, i === 2 ? HEX.FLAME : HEX.INK, i === 2 ? 2 : 0.75);
      H1(s, h, { x, y: 2.95, w: cw, h: 0.75, fontSize: 18 });
      caps(s, who, x, 3.72, cw, { h: 0.55, fontSize: 8.5, charSpacing: 1.5, valign: 'top' });
      T(s, d, { x, y: 4.35, w: cw, h: 0.95, fontSize: 13 });
    });
    pic(s, 'd-tungsten-louvre-detail', M, 5.45, W - 2 * M, 1.3, 'cover', 'photo');
  }

  // 9 · the rough-in at every heater position: list and a single-line diagram
  {
    const s = L.content('The Pre-Wire', 'Electrical Rough-In', 'What Goes In While The Ceiling Is Open',
      'This is the rough-in checklist (2 min). A dedicated branch circuit for each electric heater, or each controller channel. A junction box and solid blocking at every heater, pole or bracket. A home run from each heater to the controller location. A box for the wall switch at the threshold. Spare conduit from the heater zone to the controller, so a later zone or a home system needs no opened finishes. And for built-in gas, a stubbed and capped line with an accessible shut-off, by a licensed gas fitter. The diagram reads left to right: panel, dedicated breakers, the Affinity controller with one channel per zone, the heaters. Conductor sizes are the electrician\'s, from the manual and the adopted NEC. Source: A16 pre-wire guide and A25 contractor guide.');
    const items = ['A dedicated circuit to every heater, or controller channel', 'A junction box and solid blocking at every heater, pole or bracket', 'A home run from each heater to the controller', 'A box for the wall switch at the door', 'Spare conduit from the heater zone to the controller'];
    items.forEach((t, i) => {
      const y = 1.9 + i * 0.86;
      rule(s, M, y, 5.6, HEX.INK, 0.5);
      num(s, i + 1, M, y + 0.1, { size: 20, h: 0.45, w: 0.6 });
      T(s, t, { x: M + 0.7, y: y + 0.12, w: 4.9, h: 0.65, fontSize: 15, color: HEX.INK });
    });
    rule(s, M, 1.9 + 5 * 0.86, 5.6, HEX.INK, 0.5);
    T(s, 'Gas models: a stubbed, capped line with an accessible shut-off.', { x: M, y: 6.3, w: 5.6, h: 0.35, fontSize: 12, color: HEX.STEEL });
    // single-line diagram: panel -> breakers -> Affinity controller -> heaters; switch below
    const dx = 6.75;
    box(s, dx, 1.9, W - M - dx, 4.85, HEX.GREY, 'diagram-ground');
    caps(s, 'Single-line, one zone of three heaters', dx + 0.3, 2.05, 5, { color: HEX.STEEL });
    const py = 2.75;
    box(s, dx + 0.3, py, 1.2, 2.0, HEX.WHITE, 'panel', { line: HEX.INK, lw: 1.25 });
    lab(s, 'Panel', dx + 0.3, py + 2.05, 1.2, { align: 'center', color: HEX.INK, bold: true });
    const cx = dx + 2.35;
    box(s, cx, py, 1.35, 2.0, HEX.INK, 'controller');
    T(s, 'AFFINITY', { x: cx, y: py + 0.2, w: 1.35, h: 0.3, fontSize: 9, bold: true, color: HEX.FLAME, charSpacing: 2, align: 'center' });
    lab(s, 'Controller', cx, py + 2.05, 1.35, { align: 'center', color: HEX.INK, bold: true });
    [0, 1, 2].forEach((k) => {
      const ly = py + 0.65 + k * 0.45;
      box(s, dx + 0.95, ly - 0.09, 0.32, 0.18, HEX.INK, 'breaker');
      line(s, dx + 1.27, ly, cx, ly, { color: HEX.INK, width: 1 });
      T(s, `CH ${k + 1}`, { x: cx + 0.15, y: ly - 0.13, w: 1.05, h: 0.26, fontSize: 9, color: HEX.WHITE, bold: true, align: 'center', valign: 'middle' });
      const hx = cx + 2.25, hy = py + 0.35 + k * 0.72;
      line(s, cx + 1.35, ly, hx - 0.2, hy + 0.07, { color: HEX.INK, width: 1 });
      box(s, hx - 0.25, hy - 0.04, 0.22, 0.22, HEX.WHITE, 'junction-box', { line: HEX.INK, lw: 1 });
      heater(s, hx + 0.05, hy, 1.05);
    });
    lab(s, 'Box, blocking, heater', cx + 1.95, py + 2.05, 1.5, { color: HEX.INK, bold: true, align: 'center' });
    // wall switch and Wi-Fi
    line(s, cx + 0.67, py + 2.35, cx + 0.67, py + 2.85, { color: HEX.FLAME, width: 1.25, dash: 'dash' });
    box(s, cx + 0.42, py + 2.85, 0.5, 0.5, HEX.WHITE, 'wall-switch', { line: HEX.FLAME, lw: 1.5 });
    lab(s, 'Wall switch at the door', cx + 1.05, py + 2.93, 2.4, { color: HEX.FLAME, bold: true });
    lab(s, 'One dedicated breaker per heater or channel', dx + 0.3, py + 3.6, 5.3, { color: HEX.STEEL });
  }

  // 10 · circuits sized right
  {
    const s = L.content('The Pre-Wire', 'Circuits', 'Size The Circuit Once: I = W ÷ V, Then × 1.25',
      'Two lines of arithmetic (1.5 min). Find the current per heater, watts divided by volts. Fixed electric space heating is treated as a continuous load, so NEC Article 424 sizes the branch-circuit conductors at not less than 125% of the load. The electrician picks the conductor and breaker from that, the installation manual and the adopted NEC. Worked example from the pre-wire guide: three Platinum 3400 W heaters at 240 V. Each draws 14.2 A, 17.7 A at 125%. All three on one controller output would need 53.1 A, more than one typical circuit carries, so split them: one circuit a heater. On the Affinity On/Off and Dimmer, each channel carries up to 6 kW at 208–277 V (to confirm on the current cut sheet). A heater rated for 240 V gives less heat on 208 V, so confirm the supply first. Whether most authorities classify these heaters under Article 424 or 422 is still to confirm with Trade sales and a licensed electrician.');
    const hd = { bold: true, color: HEX.WHITE, fill: { color: HEX.INK }, fontSize: 9, charSpacing: 1 };
    const rows = [[{ text: 'HEATER', options: hd }, { text: 'AT 208 V', options: { ...hd, align: 'right' } }, { text: 'AT 240 V', options: { ...hd, align: 'right' } }]]
      .concat([['Platinum 2300 W', '11.1 A  (13.8)', '9.6 A  (12.0)'], ['Platinum 3400 W', '16.3 A  (20.4)', '14.2 A  (17.7)'], ['Platinum 4500 W', '21.6 A  (27.0)', '18.8 A  (23.4)']]
        .map(([a, b, c]) => [{ text: a, options: { bold: true, color: HEX.INK } }, { text: b, options: { align: 'right' } }, { text: c, options: { align: 'right' } }]));
    s.addTable(rows, { x: M, y: 1.95, w: 6.4, colW: [2.4, 2.0, 2.0], rowH: 0.6, fontFace: 'Arial', fontSize: 14, color: HEX.BODY, valign: 'middle', margin: [0, 0.15, 0, 0.15],
      border: [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 0.75, color: 'C9C9C6' }, { type: 'none' }] });
    T(s, 'Current per heater, rated watts ÷ volts. In brackets, × 1.25 for continuous load.', { x: M, y: 4.45, w: 6.4, h: 0.35, fontSize: 11, color: HEX.STEEL });
    L.icon(s, 'circuit', M, 5.05, 0.55);
    H1(s, 'One dedicated circuit per heater, or per controller channel of up to 6 kW.', { x: M + 0.75, y: 5.05, w: 5.6, h: 0.8, fontSize: 17 });
    box(s, 7.45, 1.95, 5.28, 4.6, HEX.INK, 'example');
    T(s, 'WORKED EXAMPLE', { x: 7.8, y: 2.25, w: 4, h: 0.3, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
    H1(s, 'Three Platinum 3400 W, 240 V', { x: 7.8, y: 2.6, w: 4.7, h: 0.95, fontSize: 20, color: HEX.WHITE });
    [['Per heater', '3400 ÷ 240 = 14.2 A;  × 1.25 = 17.7 A'], ['All three on one output', '42.5 A;  × 1.25 = 53.1 A'], ['So', 'Split them: one circuit a heater']].forEach(([a, b], i) => {
      const y = 3.75 + i * 0.85;
      rule(s, 7.8, y, 4.6, '5A5556', 0.5);
      T(s, a.toUpperCase(), { x: 7.8, y: y + 0.1, w: 4.6, h: 0.25, fontSize: 8.5, bold: true, color: 'B9B5B0', charSpacing: 2 });
      T(s, b, { x: 7.8, y: y + 0.36, w: 4.6, h: 0.4, fontSize: 15, color: i === 2 ? HEX.FLAME : HEX.WHITE, bold: i === 2 });
    });
    SRC(s, 'Source: A16 pre-wire guide (NEC Art. 424; 210.19(A)(1), 210.20(A)). Electrical work by a licensed electrician to NFPA 70 as adopted locally.');
  }

  // 11 · blocking, heights and recess cavities
  {
    const s = L.content('The Pre-Wire', 'Pre-Framing', 'Frame For The Heater You Will Sell',
      'Three numbers for the framer (1.5 min). A low-clearance recess kit sets Tungsten Select or Coastal flush in a 7.5 inch cavity, and Platinum in 7.1 inches; the kits are dual fan-ventilated and the recess box is supplied. A recessed Tungsten Series II sits at least 94 inches, 2400 mm, from the floor to its face. Surface mounts: at least 72 inches for a wall mount and 96 inches for a ceiling mount; it varies with output, so take the final figure from the model\'s manual. Recommended heights: Tungsten 2 and 3 kW 8 to 9 ft, 4 kW 8 to 10 ft, 6 kW 8 to 12 ft; Platinum 2300 and 3400 W 8 to 9 ft, 4500 W 8 to 10 ft; Eclipse 8 ft and up. Solid blocking at every heater, pole and bracket. Gas heaters are never recessed. Sources: Heat The Pergola guide (Series II manuals, Platinum low-clearance kit manual), Planning Guide v1.2. Rough-opening dimensions per model are still to confirm with the Product team: take them from the kit manual.');
    const cw = 1.9;
    [['7.5 in', 'Cavity for a flush Tungsten Select or Coastal'], ['7.1 in', 'Cavity for a flush Platinum'], ['94 in', 'Minimum, floor to the face of a recessed Series II']].forEach(([f, l], i) => {
      stat(s, f, l, M + i * (cw + 0.25), 1.95, cw, { size: 48, h: 0.85, lh: 0.9, ls: 13, lc: HEX.INK });
    });
    caps(s, 'Recommended mounting heights', M, 4.0, 6.2);
    const hd = { bold: true, color: HEX.WHITE, fill: { color: HEX.INK }, fontSize: 9, charSpacing: 1 };
    const rows = [[{ text: 'HEATER', options: hd }, { text: 'HEIGHT', options: { ...hd, align: 'right' } }]]
      .concat([['Tungsten 2 and 3 kW', '8–9 ft'], ['Tungsten 4 kW', '8–10 ft'], ['Tungsten 6 kW', '8–12 ft'], ['Platinum 2300 and 3400 W', '8–9 ft'], ['Platinum 4500 W', '8–10 ft'], ['Eclipse', '8 ft and up']]
        .map(([a, b]) => [{ text: a, options: { color: HEX.INK } }, { text: b, options: { align: 'right', bold: true, color: HEX.INK } }]));
    s.addTable(rows, { x: M, y: 4.32, w: 6.2, colW: [4.2, 2.0], rowH: 0.33, fontFace: 'Arial', fontSize: 12, color: HEX.BODY, valign: 'middle', margin: [0, 0.12, 0, 0.12],
      border: [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 0.5, color: 'C9C9C6' }, { type: 'none' }] });
    pic(s, 'rv-pr-bg-black-recess-kit-plaster-ceiling', 7.25, 1.95, 5.48, 3.6, 'cover', 'photo');
    rule(s, 7.25, 5.75, 5.48, HEX.FLAME, 1.5);
    H1(s, 'Solid blocking at every heater, pole and bracket. Gas heaters are never recessed.', { x: 7.25, y: 5.85, w: 5.48, h: 0.8, fontSize: 16 });
  }

  // 12 · the controls belong on the drawing
  {
    const s = L.content('The Pre-Wire', 'Controls', 'The Controller And The Wall Switch Go On The Drawing',
      'Controls left to the end become a surface-mounted afterthought or a callback (1.5 min). Every heater comes with its controls: an Affinity Smart-Heat On/Off or Dimmer controller for Tungsten and Platinum, the Affinity Eclipse controller for Eclipse, and a wall switch. Controllers come in 1, 2 or 5 channels, each up to 6 kW at 208–277 V. Put the controller somewhere dry and reachable, inside Wi-Fi range if the app will be used, and check the signal there before close-in. Run a box for the wall switch at the door. If the home will have Control4, Crestron or Lutron, leave a pathway to the AV location; compatibility varies and may need extra hardware. Wi-Fi and app features need compatible Affinity controls, sold separately. The controller\'s wiring topology and indoor or outdoor mounting are still to confirm with the Product team. Sources: A16, A25, product pages.');
    pic(s, 'w-affinity-dimmer-5ch', M, 1.85, 4.9, 4.4, 'contain', 'controller');
    T(s, 'Affinity Smart-Heat Dimmer, 5 channels.', { x: M, y: 6.3, w: 4.9, h: 0.3, fontSize: 10, color: HEX.STEEL });
    const P = [['controller-dimmer', 'The Controller', 'Dry, reachable, inside Wi-Fi range. On/Off or Dimmer for Tungsten and Platinum; the Eclipse controller for Eclipse.'],
      ['wall-switch', 'The Wall Switch', 'A box at the door, so the heat is one tap from the house.'],
      ['zones', 'One Channel A Zone', '1, 2 or 5 channels, each up to 6 kW at 208–277 V. A spare channel is next season\'s heater.'],
      ['app', 'App And Home System', 'Check the Wi-Fi before close-in. Leave a pathway to the AV location for Control4, Crestron or Lutron.']];
    P.forEach(([ic, h, d], i) => {
      const x = 6.0 + (i % 2) * 3.45, y = 1.9 + Math.floor(i / 2) * 2.45;
      L.icon(s, ic, x, y, 0.55);
      rule(s, x, y + 0.7, 3.1);
      H1(s, h, { x, y: y + 0.8, w: 3.1, h: 0.45, fontSize: 18 });
      T(s, d, { x, y: y + 1.28, w: 3.1, h: 1.05, fontSize: 13 });
    });
    T(s, 'Wi-Fi and app features need compatible Affinity controls, sold separately.', { x: 6.0, y: 6.45, w: 6.7, h: 0.3, fontSize: 10, color: HEX.STEEL });
  }

  // 13 · exercise 1: mark up a plan
  {
    const s = L.exercise({ section: 'The Pre-Wire', n: 1, minutes: 8, title: 'Mark Up A Plan For The Pre-Wire',
      task: 'A 16 × 20 ft covered patio, solid roof, 9 ft ceiling: a table for eight and a lounge. Mark everything the electrician needs at framing.',
      steps: ['Mark the two seating zones: dining and lounge.', 'Size the heaters: seating area ÷ (heat area × 0.85), rounded up.', 'Place each heater with its junction box, blocking or recess opening.', 'Draw the home runs to the controller, and the wall switch at the door.'],
      img: WHITE,
      notes: 'Eight minutes in pairs (1 to set up, 5 to draw, 2 to compare). Hand out the plan or draw it on the board. Model answer. Area: 16 × 20 is 320 square feet, all seating. Using the default factor for an unknown site (partly covered, cool: 0.85): Tungsten Select 6 kW covers up to 160, so 320 ÷ (160 × 0.85) = 2.35, round up to three; Platinum 4500 W covers 143, so 320 ÷ (143 × 0.85) = 2.63, also three. 9 ft suits Tungsten 6 kW (8–12 ft) and Platinum 4500 W (8–10 ft). Zones: two heaters over the dining table, one over the lounge. Pre-wire: three dedicated circuits, one per heater; a junction box and solid blocking at each position, or a recess opening framed for a 7.5 in cavity (Select) or 7.1 in (Platinum); home runs to the controller location inside by the patio door, with Wi-Fi checked there; an Affinity Dimmer with three channels used (a 5-channel controller leaves two spare for later); a wall-switch box at the door; spare conduit to the controller. Debrief: did anyone forget the wall switch, or put a heater over the middle of the floor instead of over the seats? Our design service would confirm the count and positions on a real plan (calculation-model.md; A16).' });
    const F = { x: 7.35, y: 1.85, w: 5.38, h: 4.9 };
    const sc = 0.215, px = F.x + 0.55, pyy = F.y + 0.85, pw = 20 * sc, ph = 16 * sc;
    // the house wall, hatched, with a door
    box(s, px - 0.1, pyy - 0.32, pw + 0.2, 0.3, HEX.GREY, 'house-wall', { line: HEX.INK, lw: 1 });
    for (let k = px; k + 0.3 <= px + pw + 0.1; k += 0.16) line(s, k, pyy - 0.02, k + 0.28, pyy - 0.32, { color: HEX.STEEL, width: 0.5, name: 'hatch' });
    box(s, px + pw * 0.42, pyy - 0.33, 0.7, 0.33, HEX.WHITE, 'door', { line: HEX.WHITE, lw: 0 });
    lab(s, 'Door', px + pw * 0.42, pyy - 0.33, 0.7, { align: 'center', size: 9, color: HEX.INK, bold: true });
    lab(s, 'HOUSE', px - 0.1, pyy - 0.62, 1.5, { size: 8.5, bold: true, color: HEX.STEEL });
    // patio outline (roof edge dashed)
    box(s, px, pyy, pw, ph, null, 'patio', { line: HEX.INK, lw: 1, dash: 'dash' });
    // dining table and chairs
    const tx = px + 0.55, ty = pyy + 1.0, tw = 8 * sc, th = 3.5 * sc;
    box(s, tx, ty, tw, th, HEX.WHITE, 'table', { line: HEX.INK, lw: 1 });
    for (let k = 0; k < 4; k++) { box(s, tx + 0.12 + k * (tw - 0.3) / 3, ty - 0.2, 0.16, 0.14, HEX.LINE, 'chair'); box(s, tx + 0.12 + k * (tw - 0.3) / 3, ty + th + 0.06, 0.16, 0.14, HEX.LINE, 'chair'); }
    lab(s, 'Dining, 8', tx, ty + th + 0.28, tw, { align: 'center', size: 9.5, color: HEX.INK });
    // lounge: an L-shaped sofa and a low table
    const lx = px + pw - 1.75, ly = pyy + 1.6;
    box(s, lx, ly, 1.4, 0.32, HEX.LINE, 'sofa'); box(s, lx + 1.08, ly - 0.9, 0.32, 1.22, HEX.LINE, 'sofa'); box(s, lx + 0.25, ly - 0.6, 0.65, 0.4, HEX.WHITE, 'low-table', { line: HEX.INK, lw: 0.75 });
    lab(s, 'Lounge', lx, ly + 0.4, 1.4, { align: 'center', size: 9.5, color: HEX.INK });
    // dimensions
    line(s, px, pyy + ph + 0.22, px + pw, pyy + ph + 0.22, { color: HEX.FLAME, width: 1, begin: 'triangle', end: 'triangle', name: 'dimension' });
    lab(s, '20 ft', px + pw / 2 - 0.4, pyy + ph + 0.27, 0.8, { align: 'center', color: HEX.FLAME, bold: true, size: 10 });
    line(s, px - 0.25, pyy, px - 0.25, pyy + ph, { color: HEX.FLAME, width: 1, begin: 'triangle', end: 'triangle', name: 'dimension' });
    T(s, '16 ft', { x: px - 0.55, y: pyy + ph / 2 - 0.14, w: 0.6, h: 0.28, fontSize: 10, bold: true, color: HEX.FLAME, rotate: 270, align: 'center', valign: 'middle' });
    lab(s, 'Solid roof · 9 ft clear', F.x + F.w - 2.6, F.y + 0.12, 2.3, { size: 10, color: HEX.STEEL, align: 'right' });
  }

  // 14 · check 1
  L.quiz({ section: 'The Pre-Wire', n: 1, q: 'When Does Adding Outdoor Heat Cost The Least?',
    options: ['At handover, once the buyer has seen the patio.', 'At framing: circuits, boxes, blocking and recess openings.', 'After the first winter, when the buyer asks.', 'Once the drywall is up and the finish is chosen.'],
    answer: 1, why: 'Decided before framing, heat is a line on the electrical plan and a few boxes at rough-in. After framing it is a change order; after finish it means opened ceilings, patching, surface conduit and often no recess option. Source: A16 pre-wire guide. Allow 1 minute.' });

  // 15 · divider
  L.divider({ n: '03', title: 'The Builder *Package*', line: 'Three tiers, one rough-in, controls in every tier.', img: 'l-013-100', section: 'The Builder Package',
    notes: 'Part three (8 min with the exercise). A package the design centre can present as naturally as cabinetry.' });

  // 16 · good, better, best: the moments, photo-led
  {
    const s = L.content('The Builder Package', 'Good, Better, Best', 'Three Ways To Sell The Evening',
      'Lead with the moment, then the tier (1.5 min). Good is warm where you sit: one zone, a wall- or ceiling-mounted heater aimed at the table, on an Affinity On/Off controller and a wall switch. Better is warm at the level you want: two zones, dining and lounge, on an Affinity Dimmer with the Bromic app for schedules and timers. Best is heat you feel, not see: heaters recessed flush with the low-clearance kit, an Eclipse pendant bringing heat and light over the dining table, every zone on its own controller, and the home system where it has one. For a modern home, show Platinum and Eclipse first. Source: A15 builder program and BLD-CO-01. Prices are not shown; builder pricing comes from Trade sales.');
    const TIERS = [['Good', 'Warm Where You Sit', 'l-010-070', 'One zone. Platinum or Tungsten Select on the wall or ceiling.', 'Affinity On/Off and a wall switch'],
      ['Better', 'Warmth, Zone By Zone', 'l-010-071', 'Two zones, dining and lounge, each set to its own warmth.', 'Affinity Dimmer, wall switch and the app'],
      ['Best', 'Heat You Feel, Not See', 'rv-pr-c-graphite-recessed-pair-cedar-garden-dining-dusk', 'Recessed flush, with an Eclipse pendant over the dining table.', 'Affinity Dimmer and Eclipse controller, wall switches, app, home system']];
    const cw = (W - 2 * M - 2 * 0.35) / 3;
    TIERS.forEach(([t, h, im, d, c], i) => {
      const x = M + i * (cw + 0.35);
      pic(s, im, x, 1.85, cw, 2.35, 'cover', 'photo');
      T(s, t.toUpperCase(), { x, y: 4.35, w: cw, h: 0.28, fontSize: 10, bold: true, charSpacing: 4, color: HEX.FLAME });
      H1(s, h, { x, y: 4.63, w: cw, h: 0.5, fontSize: 20 });
      T(s, d, { x, y: 5.15, w: cw, h: 0.65, fontSize: 13.5 });
      rule(s, x, 5.85, cw, i === 2 ? HEX.FLAME : HEX.INK, i === 2 ? 1.5 : 0.75);
      T(s, c, { x, y: 5.95, w: cw, h: 0.6, fontSize: 13, bold: true, color: HEX.INK });
    });
  }

  // 17 · what each tier includes: dark-header table, one rough-in strip
  {
    const s = L.content('The Builder Package', 'What Each Tier Includes', 'Heaters, Controls And Pre-Wire, Tier By Tier',
      'This is the sheet purchasing and the site team work from (1.5 min). Read down a column: each tier is a complete system, heaters, controls, zones and pre-wire. Then the strip at the bottom: design the rough-in for Best and you can sell any tier. Fix heater positions for the largest tier the plan could sell, run a dedicated circuit to each, frame for recess kits where the soffit allows, and leave a pathway to the AV location. If Good sells, cap and label the unused positions; the owner steps up later without opening finished work. Coverage: Platinum 65–143 ft², Tungsten Select 65–160, Eclipse 121, approximately, by model and mounting. Wi-Fi and app features need compatible Affinity controls, sold separately: say so on the option sheet. Whether the On/Off controller runs the app is still to confirm with the Product team. Sources: A15, BLD-CO-01, product facts.');
    const hd = (t) => ({ text: t.toUpperCase(), options: { bold: true, color: HEX.WHITE, fill: { color: HEX.INK }, fontSize: 9, charSpacing: 2 } });
    const c0 = (t) => ({ text: t, options: { bold: true, color: HEX.INK } });
    const best = (t) => ({ text: t, options: { fill: { color: HEX.WASH }, color: HEX.INK } });
    const rows = [[hd(''), hd('Good'), hd('Better'), hd('Best')],
      [c0('Heaters'), 'Platinum or Tungsten Select, wall or ceiling', 'The same, in two zones', best('Recessed flush, low-clearance kit; Eclipse pendant over dining')],
      [c0('Controls'), 'Affinity On/Off + wall switch', 'Affinity Dimmer + wall switch + app', best('Dimmer per zone + Eclipse controller + wall switches + app; Control4, Crestron or Lutron where compatible')],
      [c0('Zones'), 'One', 'Two: dining, lounge', best('Two or more')],
      [c0('Pre-wire'), 'Dedicated circuit, box at heater, box at switch', 'As Good, by zone; controller location; Wi-Fi checked', best('As Better; recess framing; blocking for the pendant; pathway to AV')]]
      .map((r, i) => i === 0 ? r : r.map((c) => typeof c === 'string' ? { text: c, options: {} } : c));
    s.addTable(rows, { x: M, y: 1.85, w: W - 2 * M, colW: [1.6, 3.3, 3.3, 3.9], rowH: [0.42, 0.75, 0.9, 0.55, 0.9], fontFace: 'Arial', fontSize: 12.5, color: HEX.BODY, valign: 'middle', margin: [0.03, 0.12, 0.03, 0.12],
      border: [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 0.5, color: 'C9C9C6' }, { type: 'none' }] });
    box(s, M, 5.55, W - 2 * M, 1.15, HEX.INK, 'one-rough-in');
    T(s, 'ONE ROUGH-IN', { x: M + 0.35, y: 5.72, w: 3, h: 0.28, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
    H1(s, 'Pre-wire for Best, sell any tier. Cap and label the unused positions.', { x: M + 0.35, y: 6.0, w: 8.2, h: 0.6, fontSize: 18, color: HEX.WHITE });
    T(s, 'The owner steps up later without opening finished work.', { x: 9.0, y: 5.95, w: 3.7, h: 0.6, fontSize: 13, color: 'E6E2DE' });
  }

  // 18 · exercise 2: build a builder package
  L.exercise({ section: 'The Builder Package', n: 2, minutes: 10, title: 'Build A Builder Package',
    task: 'Write Good, Better and Best for the covered patio on your lead plan, or use the 16 × 20 ft patio from Exercise 1.',
    steps: ['One line each: the moment the buyer is paying for.', 'Heaters and zones for each tier, sized with the one-line rule.', 'The controls for each tier, and the wall switch.', 'The pre-wire scope, designed for Best. Then: base package, option or pre-wire only?'],
    img: 'l-010-069',
    notes: 'Ten minutes in threes, ideally sales, purchasing and site together. Model answer for the 16 × 20 ft patio (three heater positions from Exercise 1). Good, "Dinner outside on a cool evening": three Platinum 4500 W or Tungsten Select 6 kW, surface-mounted, one zone, an Affinity On/Off controller and a wall switch. Better, "The patio as an everyday room": the same three heaters in two zones (two over dining, one over the lounge) on an Affinity Dimmer with two of its channels, plus the wall switch and the Bromic app for schedules and timers. Best, "Heat you feel, not see": three heaters recessed flush with the low-clearance kit, or two recessed over the lounge and an Eclipse pendant over the dining table on the Affinity Eclipse controller; Dimmer on the recessed zone, wall switches, the app, and Control4, Crestron or Lutron where the home has it. Pre-wire for all three: three dedicated circuits, boxes and blocking, recess openings framed, controller location with Wi-Fi checked, switch box at the door, spare conduit and a pathway to the AV location. Placement: carry Better in the base package on the lead plan, with Best as an upgrade and a pre-wire-only option for buyers who decide later. Debrief: did every tier carry its controls? No prices: they come from your purchasing team and Bromic builder pricing. App features need compatible Affinity controls, sold separately.' });

  // 19 · check 2
  L.quiz({ section: 'The Builder Package', n: 2, q: 'Which Tier Can Leave Out Its Controls To Save Money?',
    options: ['Good, because it has only one zone.', 'Better, if the buyer has the app.', 'None: every tier includes its controls and a wall switch.', 'Best, because the home system runs it.'],
    answer: 2, why: 'Every Bromic heater comes with its controls. At minimum an Affinity On/Off controller and a wall switch; Dimmer and app in Better; the Eclipse controller for Eclipse. Pricing controls into every tier also keeps the comparison fair for the buyer. Source: BLD-CO-01. Allow 1 minute.' });

  // 20 · divider
  L.divider({ n: '04', title: 'Heat In The *Budget*', line: 'In the base package or as a standard option, and we help you plan it.', img: 'w-bromic-patio-heater-platinum-electric', section: 'Heat In The Budget',
    notes: 'Part four (5 min). Where heat sits in your budget, how to show it, and what Bromic does for you.' });

  // 21 · three ways to carry heat
  {
    const s = L.content('Heat In The Budget', 'Without A Price On The Slide', 'Three Ways To Carry Heat In The Budget',
      'Three placements, no prices (1.5 min). One, in the base package: quote the patio with heat and controls, and offer a version without, so the buyer decides to take it out rather than to add it. Two, as a standard option on the option sheet, offered at contract, before electrical rough-in: the last point where adding heat costs a circuit and a box rather than a ceiling repair. Three, the pre-wire on its own: circuits, boxes, blocking and a switch box, sold even when the heaters come later. Whichever you choose, price the pre-wire, keep controls in every price, and say on the sheet that app features need compatible Affinity controls, sold separately. Option prices, builder cost, margin guidance and lead times all come from your purchasing team and Bromic Trade sales: none are given here (to confirm with Trade sales and Sales operations). Sources: A15, BLD-CO-01, A16.');
    const C3 = [['In The Base Package', 'Quote the patio with heat and controls, and a version without.', 'The buyer decides to take it out, not to add it.'],
      ['As A Standard Option', 'On the option sheet, offered at contract, before rough-in.', 'A circuit and a box, not a ceiling repair.'],
      ['The Pre-Wire On Its Own', 'Circuits, boxes, blocking and a switch box, with heaters later.', 'Ready for warmth whenever they choose.']];
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    C3.forEach(([h, d, w], i) => {
      const x = M + i * (cw + 0.4);
      rule(s, x, 1.95, cw);
      num(s, i + 1, x, 2.05, { size: 54, h: 1.0, w: 1.4 });
      H1(s, h, { x, y: 3.05, w: cw, h: 0.5, fontSize: 21 });
      T(s, d, { x, y: 3.6, w: cw, h: 0.75, fontSize: 14 });
      T(s, w, { x, y: 4.4, w: cw, h: 0.6, fontSize: 14, color: HEX.FLAME, bold: true });
    });
    box(s, M, 5.25, W - 2 * M, 1.4, HEX.WASH, 'action-box');
    T(s, 'ON EVERY OPTION SHEET', { x: M + 0.35, y: 5.45, w: 5, h: 0.28, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
    H1(s, 'Price the pre-wire, keep controls in every price, and say that app features need compatible Affinity controls, sold separately.', { x: M + 0.35, y: 5.75, w: W - 2 * M - 0.7, h: 0.8, fontSize: 18 });
  }

  // 22 · sell it in the model home
  {
    const s = L.content('Heat In The Budget', 'At The Design Centre', 'Let Buyers Feel It',
      'The surest way to sell warmth is to let buyers feel it (1 min). Show it lit: a heated model-home patio at dusk, Better or Best, switched on. Lead with the moment, then the tier: "Dinner outside in October" sells Good, "dinner and the lounge, each at its own warmth" sells Better, "a ceiling with nothing visible but warmth" sells Best. Keep the controls in the price, so it arrives as a finished option. Whether Bromic offers display units or a demo program for model homes is still to confirm with Trade sales. Source: A15 and BLD-CO-01.');
    pic(s, 'rv-ts2-r9c-06', 6.88, 0, W - 6.88, 6.85, 'cover', 'photo');
    const Q = [['Good', '"Dinner outside in October."'], ['Better', '"Dinner and the lounge, each at its own warmth."'], ['Best', '"A ceiling with nothing visible but warmth."']];
    Q.forEach(([t, q], i) => {
      const y = 1.95 + i * 1.25;
      rule(s, M, y, 5.8, i === 2 ? HEX.FLAME : HEX.INK, i === 2 ? 1.5 : 0.75);
      T(s, t.toUpperCase(), { x: M, y: y + 0.12, w: 2, h: 0.28, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
      H1(s, q, { x: M, y: y + 0.42, w: 5.8, h: 0.75, fontSize: 21, italic: true });
    });
    rule(s, M, 5.85, 5.8);
    T(s, 'Show the model home lit at dusk, with Better or Best switched on.', { x: M, y: 5.97, w: 5.8, h: 0.6, fontSize: 14, color: HEX.INK });
  }

  // 23 · the design service
  {
    const s = L.content('Heat In The Budget', 'The Design Service', 'Send Us The Plan. We Draw The Heat.',
      'Our design service is free (1 min). Send plans or photos to bromic.com/design-your-space, or call 1-800-301-1293, Monday to Friday, 9 am to 4 pm Pacific. We send back heater selection, positions and coverage drawn on the plan, with a parts and controls list your purchasing team can price from, for all three tiers if you ask. Installation manuals and CAD and Revit/BIM files for every heater are on the technical resources page. Sources: Lookbook 2026, A25, A15.');
    const S3 = [['Send', 'Your plans or photos, with the patio and seating marked.'], ['We Draw', 'Heater selection, positions and coverage on your plan.'], ['You Price', 'A parts and controls list for each tier, ready for purchasing.']];
    S3.forEach(([h, d], i) => {
      const y = 1.95 + i * 1.3;
      rule(s, M, y, 6.0);
      num(s, i + 1, M, y + 0.1, { size: 40, h: 0.8, w: 1.0 });
      H1(s, h, { x: M + 1.15, y: y + 0.15, w: 4.85, h: 0.45, fontSize: 21 });
      T(s, d, { x: M + 1.15, y: y + 0.62, w: 4.85, h: 0.55, fontSize: 14 });
    });
    box(s, M, 5.95, 6.0, 0.75, HEX.INK, 'contact');
    H1(s, 'bromic.com/design-your-space  ·  1-800-301-1293', { x: M + 0.3, y: 5.95, w: 5.6, h: 0.75, fontSize: 17, color: HEX.WHITE, valign: 'middle' });
    pic(s, 'd-eclipse-pendant-dining', 7.1, 1.95, 5.63, 4.75, 'cover', 'photo');
  }

  // 24 · partner program
  {
    const s = L.content('Heat In The Budget', 'The Bromic Partner Program', 'What Partners Receive',
      'The Partner Program is open to trade professionals who specify, design, build or install outdoor spaces (1 min). These six benefits are on the program page today. The extended warranty is an additional year on qualifying products. Partners who install can also join the Bromic installer program; a reseller certificate is required for that. To join, register a project and meet your Bromic rep at bromic.com/lp-builders, or call 1-800-301-1293. To confirm with Trade sales: price tiers and qualifying volumes, which products qualify for the extra year, and the contact for each region. Source: bromic.com/lp-builders (A25).');
    const B6 = [['Exclusive Partner Pricing', 'Trade pricing on heaters and controls'], ['Expert Product Recommendations', 'The right heater, wattage, voltage and controls'],
      ['Free Custom Heating Design Plans', 'Positions and coverage on your client\'s plan'], ['Extended Warranty', 'An additional year on qualifying products'],
      ['A Dedicated Point Of Contact', 'One Bromic contact for your projects'], ['Project Marketing Spotlights', 'Your finished work in Bromic case studies']];
    B6.forEach(([t, d], k) => {
      const cw = 3.85, x = M + (k % 3) * (cw + 0.275), y = 1.95 + Math.floor(k / 3) * 1.55;
      rule(s, x, y, cw);
      num(s, k + 1, x, y + 0.1, { size: 22, h: 0.45, w: 0.6 });
      H1(s, t, { x: x + 0.65, y: y + 0.12, w: cw - 0.65, h: 0.7, fontSize: 17 });
      T(s, d, { x: x + 0.65, y: y + 0.85, w: cw - 0.65, h: 0.55, fontSize: 13 });
    });
    pic(s, 'rv-pr-a-black-trio-row-warm-grey', M, 5.15, 7.6, 1.55, 'cover', 'photo');
    rule(s, 8.55, 5.15, 4.18, HEX.FLAME, 1.5);
    T(s, 'REGISTER A PROJECT', { x: 8.55, y: 5.27, w: 4.18, h: 0.28, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
    H1(s, 'bromic.com/lp-builders', { x: 8.55, y: 5.55, w: 4.18, h: 0.45, fontSize: 19 });
    T(s, 'A reseller certificate is required to join the Bromic installer program.', { x: 8.55, y: 6.05, w: 4.18, h: 0.6, fontSize: 11, color: HEX.STEEL });
  }

  // 25 · closing
  L.closing({ section: 'Close', title: 'Put Heat On The *First* Drawing',
    points: ['Heat goes on the plan before framing, not on the punch list.', 'Pre-wire every position: circuit, box, blocking, controller, switch.', 'Three tiers, one rough-in, controls in every tier.', 'Carry heat in the base package, as an option, or as a pre-wire.', 'Send the plan to our design service; join the Partner Program.'],
    next: 'Next: send your lead plan to bromic.com/design-your-space, and we will size all three tiers.', img: 'l-005-022',
    notes: 'Close (1 min). Read the five habits. Ask each team to name the one plan they will send to the design service this week, and who will brief the electrician on the pre-wire. Leave the pre-wire guide (A16) and the Good, Better, Best guide (A15) on the table.' });

  await L.finish('Bromic-Builder-Heat-At-Planning');
}
main().catch((e) => { console.error(e); process.exit(1); });
