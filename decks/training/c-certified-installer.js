// Deck C: Bromic Certified Installer. Five modules (C1-C5), a 20-question exam and the proposed programme.
// Facts from data/product-facts.json, data/product-marketing/*.json, reports/white-papers/pergola-2027/content.py,
// content/sales/A15 and A25, content/articles/ARC-PP-01, content/kb/ARC-BY-KB1. Run:
//   cd decks/training && NODE_PATH=$PWD/node_modules node c-certified-installer.js
const L = require('./lib');
const { T, H1, card, ico, pic, bullets, HEX, W, M } = L;

const ICONS = ['LuShieldCheck', 'LuZap', 'LuRuler', 'LuDroplets', 'LuCloudRain', 'LuPlug', 'LuSmartphone', 'LuWrench', 'LuAward',
  'LuBookOpen', 'LuClipboardCheck', 'LuTag', 'LuMap', 'LuUserRound', 'LuMegaphone', 'LuBuilding2', 'LuWaves', 'LuSlidersHorizontal',
  'LuToggleRight', 'LuCalendarClock', 'LuTreePine', 'LuUmbrella', 'LuSprout', 'LuSignpost', 'LuBan', 'LuPower', 'LuWifi', 'LuMic',
  'LuFan', 'LuBox', 'LuCalendarCheck', 'LuCamera', 'LuListChecks', 'LuBadgeCheck', 'LuNetwork', 'LuBlinds', 'LuHardHat', 'LuLayers',
  'LuGraduationCap', 'LuHandshake', 'LuHouse', 'LuSun'];
const { pres } = L.start({ title: 'Bromic Certified Installer', footer: 'Bromic Certified Installer  ·  Training', icons: ICONS });

(async () => {
await L.prepIcons();

// ---------- drawing helpers (native shapes, so every diagram stays editable) ----------
const SH = () => L.pres.shapes;
function line(s, x1, y1, x2, y2, o = {}) {
  const x = Math.min(x1, x2), y = Math.min(y1, y2), w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
  const flipV = (x2 - x1) * (y2 - y1) < 0;
  s.addShape(SH().LINE, { x, y, w, h, flipV, line: { color: o.color || HEX.INK, width: o.width || 1.25, dashType: o.dash || 'solid', beginArrowType: o.begin, endArrowType: o.end }, objectName: o.name || 'line' });
}
function dim(s, x1, y1, x2, y2, label, o = {}) {
  const col = o.color || HEX.FLAME;
  line(s, x1, y1, x2, y2, { color: col, width: 1.25, begin: 'triangle', end: 'triangle', name: 'dimension' });
  if (!label) return;
  const vert = x1 === x2, lw = o.lw || 1.6, lh = o.lh || 0.32;
  let lx, ly, align = 'center';
  if (vert) { ly = (y1 + y2) / 2 - lh / 2; if (o.side === 'left') { lx = x1 - lw - 0.08; align = 'right'; } else { lx = x1 + 0.08; align = 'left'; } }
  else { lx = (x1 + x2) / 2 - lw / 2; ly = o.side === 'above' ? y1 - lh - 0.04 : y1 + 0.05; }
  T(s, label, { x: lx, y: ly, w: lw, h: lh, fontSize: o.size || 14, bold: true, color: col, align, valign: 'middle' });
}
const rect = (s, x, y, w, h, fill, o = {}) => s.addShape(o.round ? SH().ROUNDED_RECTANGLE : SH().RECTANGLE, { x, y, w, h, rectRadius: o.round || 0, rotate: o.rotate || 0, fill: fill ? { color: fill } : { type: 'none' }, line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || 'solid' } : { color: fill || HEX.WHITE, width: 0 }, objectName: o.name || 'shape' });
const heater = (s, x, y, w, h = 0.18) => { rect(s, x, y, w, h, HEX.INK, { name: 'heater' }); rect(s, x + 0.06, y + h - 0.05, w - 0.12, 0.05, HEX.FLAME, { name: 'heater-glow' }); };
const cap = (s, text, x, y, w, o = {}) => T(s, text, { x, y, w, h: o.h || 0.3, fontSize: o.size || 12, color: o.color || HEX.STEEL, align: o.align || 'center', valign: 'middle', bold: !!o.bold, italic: !!o.italic });
// icon row: icon, bold lead and a line of text
function row(s, icon, x, y, w, lead, text, o = {}) {
  ico(s, icon, x, y, o.d || 0.6, o.style || 'light');
  T(s, [{ text: lead, options: { bold: true, color: HEX.INK, breakLine: !!text } }, ...(text ? [{ text, options: {} }] : [])], { x: x + (o.d || 0.6) + 0.25, y: y - 0.02, w: w - (o.d || 0.6) - 0.25, h: o.h || 0.9, fontSize: o.size || 15 });
}
// big number + label (used for rules of thumb)
function big(s, x, y, w, num, label, o = {}) {
  H1(s, num, { x, y, w, h: 0.7, fontSize: o.size || 36, color: HEX.FLAME });
  T(s, label, { x, y: y + 0.72, w, h: o.lh || 0.6, fontSize: 15, color: HEX.INK });
}
const table = (s, rows, o) => s.addTable(rows.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: i === 0 || (j === 0 && o.boldFirst !== false), color: i === 0 ? HEX.WHITE : HEX.INK, fill: { color: i === 0 ? HEX.INK : (i % 2 ? HEX.WHITE : HEX.GREY) } } }))), { x: o.x, y: o.y, w: o.w, colW: o.colW, fontFace: 'Arial', fontSize: o.size || 15, rowH: o.rowH || 0.46, valign: 'middle', margin: [0.04, 0.12, 0.04, 0.12], border: { type: 'solid', pt: 0.75, color: HEX.LINE } });
// exercise with our own drawing panel on the right: a short task line, steps on the left, panel at right
function exPanel({ section, n, title, task, minutes, steps, notes, icon, draw, px = 7.15 }) {
  const s = L.exercise({ section, n, title, task, minutes, notes, icon });
  T(s, steps.map((t, i) => ({ text: `${i + 1}   ${t}`, options: { breakLine: i < steps.length - 1, paraSpaceAfter: 10 } })), { x: M, y: 2.75, w: px - M - 0.4, h: 4.0, fontSize: 15, color: HEX.BODY });
  card(s, px, 2.55, 12.73 - px, 4.25, HEX.WHITE, 'drawing-panel');
  draw(s, px, 2.55, 12.73 - px, 4.25);
  return s;
}

// ====================================================================== WELCOME
L.cover({
  kicker: 'Installer Certification', title: 'Bromic Certified Installer',
  sub: 'Safety, codes and clearances, electric and gas installs, controls, handover and care.',
  img: 'w-kion-sui-madrid-spain-tungsten-electric-4', meta: 'For licensed electricians, gas fitters and installation partners',
  notes: 'Welcome everyone. This course takes you from the rules that keep an outdoor install safe, through mounting and recessing Tungsten, Platinum and Eclipse, gas basics and Affinity controls, to the handover that makes a customer call you again. Each module ends with an exercise and a quick check, and the exam at the end is drawn from what we cover today.',
});

let s = L.content('Welcome', 'Proposed Programme', 'How Certification Works',
  'This is the proposed path to becoming a Bromic Certified Installer. Work through the five modules, then sit a 20-question exam; 16 right answers is a pass. The details are being confirmed with our Sales team, so treat this as the outline. To confirm with Sales: who issues the certificate, whether it is listed on bromic.com, renewal and refresher terms, and how it links to the Partner Program.');
[['LuBookOpen', '1', 'Complete Modules C1–C5', 'Safety, electric, gas, controls and handover, with an exercise in each.'],
 ['LuClipboardCheck', '2', 'Pass The Exam', '20 questions. The pass mark is 80%, so 16 right answers.'],
 ['LuAward', '3', 'Become A Bromic Certified Installer', 'Your certificate, and the next steps with your Bromic contact.']].forEach(([i, n, t, d], k) => {
  const x = M + k * 4.15;
  card(s, x, 2.0, 3.65, 4.0);
  ico(s, i, x + 0.35, 2.35, 0.85, k === 2 ? 'solid' : 'light');
  H1(s, n, { x: x + 2.6, y: 2.25, w: 0.8, h: 0.8, fontSize: 40, color: HEX.FLAME, align: 'right' });
  H1(s, t, { x: x + 0.35, y: 3.45, w: 3.0, h: 1.0, fontSize: 22 });
  T(s, d, { x: x + 0.35, y: 4.55, w: 3.0, h: 1.3, fontSize: 15 });
  if (k < 2) line(s, x + 3.72, 4.0, x + 4.08, 4.0, { color: HEX.FLAME, width: 2, end: 'triangle', name: 'arrow' });
});
T(s, 'A proposed programme: the final details are being confirmed with our Sales team.', { x: M, y: 6.3, w: 12, h: 0.4, fontSize: 14, color: HEX.STEEL, italic: true });

s = L.content('Welcome', 'The Course', 'Five Modules, One Exam',
  'Here is the shape of the day. C1 is the safety ground every install stands on. C2 and C3 are the hands-on modules for electric and gas. C4 covers the Affinity controls that come with every heater, and C5 is the handover, care and warranty. Then the exam.');
[['LuShieldCheck', 'C1', 'Safety And Clearances', 'Who installs, heights, space, water and circuits'],
 ['LuZap', 'C2', 'Electric Installs', 'Tungsten Series II, Platinum and Eclipse, surface and recessed'],
 ['LuHardHat', 'C3', 'Gas Installs', 'Cover, clearances, open walls and aiming the heat'],
 ['LuSlidersHorizontal', 'C4', 'Controls', 'Choosing, wiring and commissioning Affinity'],
 ['LuHandshake', 'C5', 'Handover And Care', 'The app, care by the coast and the warranty'],
 ['LuGraduationCap', 'Exam', 'The Exam', '20 questions, 80% to pass']].forEach(([i, c, t, d], k) => {
  const x = M + (k % 3) * 4.1, y = 1.95 + Math.floor(k / 3) * 2.45;
  card(s, x, y, 3.85, 2.2, k === 5 ? HEX.WASH : HEX.GREY);
  ico(s, i, x + 0.3, y + 0.3, 0.65, k === 5 ? 'solid' : 'light');
  T(s, c.toUpperCase(), { x: x + 1.15, y: y + 0.42, w: 2.4, h: 0.35, fontSize: 13, bold: true, color: HEX.FLAME, charSpacing: 3 });
  H1(s, t, { x: x + 0.3, y: y + 1.05, w: 3.35, h: 0.45, fontSize: 19 });
  T(s, d, { x: x + 0.3, y: y + 1.5, w: 3.35, h: 0.65, fontSize: 14 });
});

s = L.content('Welcome', 'The Bromic Partner Program', 'What Partners Receive',
  'Certification sits alongside the Bromic Partner Program, open to trade professionals who specify, design, build or install outdoor spaces. These six benefits are on the program page today. The extended warranty is an additional year on qualifying products. Partners who install can also join the Bromic installer program, and a reseller certificate is required for that. To join, register a project and meet your Bromic rep at bromic.com/lp-builders, or call 1-800-301-1293. To confirm with Trade sales: price tiers, which products qualify for the extra year, and the contact for each region.');
[['LuTag', 'Exclusive Partner Pricing', 'Trade pricing on heaters and controls'],
 ['LuLightbulb', 'Expert Product Recommendations', 'The right heater, wattage, voltage and controls'],
 ['LuMap', 'Free Custom Heating Design Plans', 'Positions and coverage on your client\'s plan'],
 ['LuShieldCheck', 'Extended Warranty', 'An additional year on qualifying products'],
 ['LuUserRound', 'A Dedicated Point Of Contact', 'One Bromic contact for your projects'],
 ['LuMegaphone', 'Project Marketing Spotlights', 'Your finished work in Bromic case studies']].forEach(([i, t, d], k) => {
  const x = M + (k % 3) * 4.1, y = 1.95 + Math.floor(k / 3) * 2.15;
  ico(s, i, x, y + 0.1, 0.75);
  H1(s, t, { x: x + 0.95, y: y, w: 2.95, h: 0.85, fontSize: 19, valign: 'middle' });
  T(s, d, { x: x + 0.95, y: y + 0.9, w: 2.95, h: 0.8, fontSize: 15 });
});
T(s, 'A reseller certificate is required to join the Bromic installer program.', { x: M, y: 6.35, w: 12, h: 0.4, fontSize: 14, color: HEX.STEEL, italic: true });

L.statement({ section: 'Welcome', kicker: 'The Bromic Partner Program', line: 'You Create Beautiful Spaces. We Know How To Heat Them.', img: 'w-gno-2',
  notes: 'This is the line on our Partner Program page, and it is the deal we make with you. You build the outdoor room; we stand behind the heat, the controls and the design plan. A certified installer is the person who makes both halves meet on site.' });

// ====================================================================== C1 SAFETY, CODES AND CLEARANCES
const C1 = 'C1 Safety';
L.divider({ section: C1, n: 'MODULE C1', title: 'Safety, Codes And Clearances', icon: 'LuShieldCheck', img: 'w-p1021414-hdr-denoiseai-low-light',
  line: 'The rules every outdoor install stands on: who installs, how high, how much space, and the circuit behind it.',
  notes: 'Module C1 is the ground rules. Nothing here is complicated, and every point is one we see missed on real jobs. Get these right and the inspection passes the first time.' });

s = L.content(C1, 'Who Installs', 'Licensed Hands, Local Rules',
  'Bromic electric heaters are installed to NFPA 70, the National Electrical Code, as the state and city adopt it, by a licensed electrician. Gas heaters follow ANSI Z223.1/NFPA 54 and are fitted by a licensed gas fitter. Codes vary by location, so the local building authority, the authority having jurisdiction, confirms every install. Source: A25 contractor guide and ARC-PP-01.');
[['LuZap', 'Electric heaters', 'A licensed electrician, to NFPA 70 (the National Electrical Code) as your state and city adopt it.'],
 ['LuHardHat', 'Gas heaters', 'A licensed gas fitter, to ANSI Z223.1/NFPA 54 and local code.'],
 ['LuBuilding2', 'The local authority', 'Codes vary by location. Confirm every install with the authority having jurisdiction.']].forEach(([i, t, d], k) =>
  row(s, i, M, 2.05 + k * 1.5, 6.9, t, d, { d: 0.75, h: 1.2, size: 16 }));
pic(s, 'w-bromic-shoot-may-11-2023-42', 7.85, 1.95, 4.88, 4.8);

s = L.content(C1, 'Mounting Heights', 'Start With The Height',
  'These are Bromic minimums, heater to floor. Wall mounts at least 72 in, ceiling mounts at least 96 in, and they vary with output, so the installation manual for the model has the final figure. A recessed Tungsten Series II sits at least 94 in, which is 2400 mm, to the face. Gas heaters and the Eclipse head go at 8 ft or higher. On the right are the recommended Tungsten heights: higher output can go higher. Sources: Planning Guide v1.2, Series II training points, Heat The Pergola guide.');
{
  const F = 6.25, k = 0.036; // floor line, inches to slide inches
  line(s, M, F, 7.5, F, { color: HEX.INK, width: 2, name: 'floor' });
  const cols = [['Wall mount', 72, 'wall'], ['Recessed Series II', 94, 'recess'], ['Ceiling mount', 96, 'ceil'], ['Gas and Eclipse', 96, 'ceil']];
  cols.forEach(([lab, inch, kind], i) => {
    const cx = 1.35 + i * 1.72, hy = F - inch * k;
    if (kind === 'wall') { rect(s, cx - 0.75, hy - 1.0, 0.1, F - hy + 1.0, HEX.LINE, { name: 'wall' }); heater(s, cx - 0.65, hy - 0.2, 1.05); }
    if (kind === 'recess') { rect(s, cx - 0.75, hy - 0.2, 1.5, 0.2, HEX.LINE, { name: 'ceiling' }); heater(s, cx - 0.5, hy - 0.2, 1.0, 0.2); }
    if (kind === 'ceil') { rect(s, cx - 0.75, hy - 0.62, 1.5, 0.16, HEX.LINE, { name: 'ceiling' }); rect(s, cx - 0.03, hy - 0.46, 0.06, 0.28, HEX.INK, { name: 'post' }); heater(s, cx - 0.5, hy - 0.2, 1.0); }
    dim(s, cx - 0.2, hy + 0.04, cx - 0.2, F - 0.02, `${inch} in`, { lw: 0.9, size: 15 });
    cap(s, lab, cx - 0.82, F + 0.1, 1.64, { size: 13, color: HEX.INK, h: 0.45 });
  });
  card(s, 8.1, 1.95, 4.63, 4.75);
  T(s, 'RECOMMENDED FOR TUNGSTEN', { x: 8.45, y: 2.25, w: 4, h: 0.3, fontSize: 12, bold: true, color: HEX.FLAME, charSpacing: 3 });
  [['2 and 3 kW', '8–9 ft'], ['4 kW', '8–10 ft'], ['6 kW', '8–12 ft']].forEach(([a, b], i) => {
    T(s, a, { x: 8.45, y: 2.8 + i * 0.75, w: 2, h: 0.5, fontSize: 17, color: HEX.INK, valign: 'middle' });
    H1(s, b, { x: 10.4, y: 2.8 + i * 0.75, w: 2.1, h: 0.5, fontSize: 24, align: 'right', valign: 'middle' });
  });
  T(s, 'Platinum 2300 and 3400 W: 8–9 ft. Platinum 4500 W: 8–10 ft. The manual for each model has the final word.', { x: 8.45, y: 5.2, w: 4.0, h: 1.3, fontSize: 14 });
}

s = L.content(C1, 'Clearances', 'Give The Heat Room To Work',
  'Three numbers for Tungsten electric heaters, from the Bromic FAQ and the Tungsten manual: at least 20 in between heaters, 12 in from the top of the heater to the ceiling, and 3 ft from the heater face to anything that burns. Every model sets its own clearances in its installation manual and listing, so check the manual for the exact model and voltage on the drawings. Source: Heat The Pergola guide, planning page; ARC-BY-KB1.');
{
  rect(s, 0.8, 2.0, 6.8, 0.2, 'C9C9C6', { name: 'ceiling' });
  cap(s, 'Ceiling or soffit', 0.8, 1.72, 2.0, { align: 'left', size: 12 });
  const hy = 2.8;
  [[1.3, 3.6], [4.6, 6.9]].forEach(([a, b]) => { rect(s, (a + b) / 2 - 0.03, 2.2, 0.06, hy - 2.2, HEX.INK, { name: 'post' }); heater(s, a, hy, b - a, 0.2); });
  dim(s, 1.05, 2.22, 1.05, hy - 0.02, '12 in', { side: 'left', lw: 0.7 });
  dim(s, 3.62, 3.3, 4.58, 3.3, '20 in', { lw: 1.0 });
  dim(s, 5.75, hy + 0.22, 5.75, 4.9, '3 ft', { lw: 0.8 });
  rect(s, 4.3, 4.92, 3.1, 0.42, HEX.WASH, { line: HEX.FLAME, dash: 'dash', name: 'combustibles' });
  cap(s, 'Fabric, awning, timber', 4.3, 4.98, 3.1, { size: 12, color: HEX.INK });
  line(s, 0.8, 6.4, 7.6, 6.4, { color: HEX.INK, width: 2, name: 'floor' });
  big(s, 8.5, 1.95, 4.2, '20 in', 'Between heaters');
  big(s, 8.5, 3.45, 4.2, '12 in', 'From the heater top to the ceiling');
  big(s, 8.5, 4.95, 4.2, '3 ft', 'From the face to anything that burns');
}

s = L.content(C1, 'Low-Tolerance Materials', 'Know What Sits In The Heat',
  'Low-tolerance materials are anything that can scorch, melt or fade in the heat. Draw the clearance envelope around each heater on the plan and the section, then look at what sits in it or moves into it: timber soffits, beams and pergola slats, umbrellas and awnings, curtains and screens, planting and signage. On a louvered roof, the louvre blades and their motors too. Source: ARC-BY-KB1 and the pergola guide.');
[['LuTreePine', 'Timber soffits, beams and slats'], ['LuUmbrella', 'Umbrellas and awnings'], ['LuBlinds', 'Curtains, screens and louvre blades'],
 ['LuSprout', 'Planting'], ['LuSignpost', 'Signage'], ['LuRuler', 'Draw the envelope on the plan and section']].forEach(([i, t], k) => {
  const x = M + (k % 2) * 3.55, y = 2.0 + Math.floor(k / 2) * 1.5;
  ico(s, i, x, y, 0.72, k === 5 ? 'solid' : 'light');
  T(s, t, { x: x + 0.9, y: y - 0.05, w: 2.5, h: 0.85, fontSize: 16, color: HEX.INK, valign: 'middle' });
});
pic(s, 'w-vbb7428', 7.95, 1.95, 4.78, 4.8);

s = L.content(C1, 'Wet Locations', 'Match The Rating To The Weather',
  'Water ratings tell you where each heater can live. Tungsten Series II, Select and Coastal, is IPX5, made for rain through open louvres. Series I Tungsten is IPX4. Platinum Marine is IPX5, IP55 on the 4500 W; standard Platinum is made for covered spaces. Eclipse is IP54 and goes under cover where possible. Gas heaters are IPX4 and must sit under a protective cover, out of the rain. Where a hollow post doubles as the downspout, use wet-location wiring. Sources: product frameworks and the pergola guide.');
table(s, [['Heater', 'Rating', 'Where it lives'],
  ['Tungsten Select and Coastal', 'IPX5', 'Rain through open louvres'],
  ['Tungsten Series I', 'IPX4', 'Covered spaces'],
  ['Platinum Electric Marine', 'IPX5', 'By the sea (IP55 on 4500 W)'],
  ['Platinum Electric', '–', 'Covered spaces'],
  ['Eclipse', 'IP54', 'Under cover where possible'],
  ['Gas heaters', 'IPX4', 'Under a cover, out of the rain']], { x: M, y: 1.95, w: 7.6, colW: [3.3, 1.0, 3.3], rowH: 0.52 });
T(s, 'Where a hollow post is also the downspout, use wet-location wiring.', { x: M, y: 5.85, w: 7.6, h: 0.6, fontSize: 15, color: HEX.INK, italic: true });
pic(s, 'l-001-000', 8.6, 1.95, 4.13, 4.8);

s = L.content(C1, 'Circuits', 'One Heater, One Circuit',
  'Each heater, or each controller channel, is hard-wired by a licensed electrician on its own dedicated circuit, sized from the installation manual and the code. Check panel space first. Match the heater to the supply: a 240 V heater on a 208 V supply gives less heat than the client was promised. GFCI and permit rules vary by jurisdiction, so ask the local inspector. The Tungsten currents are calculated as watts divided by volts; Platinum and Eclipse are from the product pages. The 2 kW Select is 240 V only, Coastal is 208 and 240 V, and the 4 and 6 kW models have two elements wired separately.');
[['LuPower', 'A dedicated circuit', 'For each heater or controller channel, sized from the manual. Check panel space first.'],
 ['LuZap', 'Match the supply', 'A 240 V heater on 208 V gives less heat. On 208 V, choose 208 V models.'],
 ['LuShieldCheck', 'GFCI and permits vary', 'Ask the local inspector before rough-in.']].forEach(([i, t, d], k) =>
  row(s, i, M, 2.05 + k * 1.5, 5.9, t, d, { d: 0.7, h: 1.2 }));
table(s, [['Heater', 'Current'], ['Tungsten 6 kW at 240 V', '25 A'], ['Tungsten 6 kW at 208 V', '28.8 A'], ['Tungsten 6 kW at 277 V', '21.7 A'],
  ['Platinum 2300 / 3400 / 4500 W at 240 V', '9.6 / 14.2 / 18.8 A'], ['Eclipse at 240 V', '12.1 A']], { x: 6.95, y: 2.0, w: 5.78, colW: [3.48, 2.3], rowH: 0.55 });
T(s, 'Tungsten figures are calculated: watts ÷ volts.', { x: 6.95, y: 5.45, w: 5.78, h: 0.4, fontSize: 12, color: HEX.STEEL });

s = L.content(C1, 'On The Pergola', 'Fix Every Heater To The Main Structure',
  'On a louvered pergola, fix heaters to the perimeter beam, a fan beam or a sub-beam, never to a rotating louvre. Keep clear of the louvre motors, the blades\' arc and any fabric. Run power inside the hollow post and beam, and pre-wire every heater position when the pergola goes up; it costs a fraction of a retrofit. Source: Heat The Pergola guide.');
pic(s, 'd-tungsten-louvre-detail', M, 1.95, 6.2, 4.8);
[['LuLayers', 'Perimeter beam, fan beam or sub-beam', 'The only places a heater fixes on a louvered roof.'],
 ['LuBan', 'Never on a rotating louvre', 'Keep clear of the motors, the blades\' arc and fabric.'],
 ['LuPlug', 'Power inside the post and beam', 'Pre-wire every position when the pergola goes up.']].forEach(([i, t, d], k) =>
  row(s, i, 7.2, 2.05 + k * 1.5, 5.5, t, d, { d: 0.7, h: 1.25, style: k === 1 ? 'solid' : 'light' }));

exPanel({ section: C1, n: 1, minutes: 8, icon: 'LuListChecks', title: 'Find The Five Faults',
  task: 'Five things on this pergola break the rules. Find every one.',
  steps: ['Work in pairs.', 'Check each dimension and fixing against the rules from this module.', 'Circle each fault and say the fix out loud.', 'First pair with all five calls time.'],
  notes: 'How to run it: show the slide, set a timer for five minutes, then take answers round the room, one fault per pair. Debrief, the five faults: 1, the left heater is 84 in above the floor on a ceiling mount; the minimum is 96 in. 2, the left heater is 6 in below the beam; Tungsten needs 12 in from the heater top to the ceiling. 3, the heaters are 10 in apart; the minimum is 20 in. 4, the right heater hangs from a rotating louvre; fix only to the perimeter beam, a fan beam or a sub-beam. 5, the shade sail is 2 ft from the heater face; combustibles need 3 ft. The wall switch on the post is fine, a good distractor.',
  draw: (s, X, Y) => {
    const F = Y + 3.85; // floor
    rect(s, X + 0.3, Y + 0.35, 4.98, 0.2, 'C9C9C6', { name: 'beam' });
    cap(s, 'Beam', X + 0.3, Y + 0.05, 1.0, { align: 'left', size: 12 });
    for (let i = 0; i < 7; i++) rect(s, X + 2.75 + i * 0.36, Y + 0.68, 0.3, 0.06, HEX.STEEL, { rotate: 35, name: 'louvre' });
    cap(s, 'Rotating louvres', X + 3.4, Y + 0.05, 1.9, { size: 12, align: 'right' });
    rect(s, X + 0.3, Y + 0.55, 0.14, F - Y - 0.55, HEX.LINE, { name: 'post' }); rect(s, X + 5.14, Y + 0.55, 0.14, F - Y - 0.55, HEX.LINE, { name: 'post' });
    rect(s, X + 1.43, Y + 0.55, 0.05, 0.28, HEX.INK, { name: 'heater-post' }); heater(s, X + 0.8, Y + 0.83, 1.3);
    rect(s, X + 3.2, Y + 0.74, 0.05, 0.12, HEX.INK, { name: 'heater-post' }); heater(s, X + 2.55, Y + 0.86, 1.3);
    dim(s, X + 0.65, Y + 0.57, X + 0.65, Y + 0.81, '6 in', { side: 'left', lw: 0.5, size: 12 });
    dim(s, X + 2.12, Y + 1.25, X + 2.53, Y + 1.25, '10 in', { lw: 0.7, size: 12 });
    dim(s, X + 3.2, Y + 1.06, X + 3.2, Y + 1.75, '2 ft', { lw: 0.6, size: 12 });
    rect(s, X + 2.4, Y + 1.77, 2.6, 0.08, HEX.WASH, { line: HEX.FLAME, dash: 'dash', name: 'shade-sail' });
    cap(s, 'Shade sail', X + 3.6, Y + 1.88, 1.4, { size: 12 });
    dim(s, X + 1.0, Y + 1.03, X + 1.0, F - 0.02, '84 in', { lw: 0.6, size: 12 });
    rect(s, X + 5.0, Y + 2.3, 0.13, 0.22, HEX.INK, { name: 'wall-switch' }); cap(s, 'Wall switch', X + 4.0, Y + 2.55, 1.2, { size: 12, align: 'right' });
    rect(s, X + 2.2, F - 0.75, 2.0, 0.08, HEX.STEEL, { name: 'table' }); rect(s, X + 2.4, F - 0.67, 0.06, 0.67, HEX.STEEL, { name: 'leg' }); rect(s, X + 3.95, F - 0.67, 0.06, 0.67, HEX.STEEL, { name: 'leg' });
    line(s, X + 0.1, F, X + 5.48, F, { width: 2, name: 'floor' });
  } });

L.quiz({ section: C1, n: 'C1', q: 'Does This Heater Circuit Need GFCI Protection?', options: ['Always, on every outdoor heater', 'Never on a hard-wired heater', 'It varies by jurisdiction – ask the local inspector'], answer: 2,
  why: 'GFCI and permit rules vary by jurisdiction, so the local inspector decides. Source: Heat The Pergola guide, planning page 2.' });

// ====================================================================== C2 ELECTRIC INSTALLS
const C2 = 'C2 Electric';
L.divider({ section: C2, n: 'MODULE C2', title: 'Electric Installs', icon: 'LuZap', img: 'd-installers-recessing',
  line: 'Tungsten Series II on its single post and in the low-clearance kit, Platinum and Eclipse.',
  notes: 'Module C2 is the hands-on part for electric heaters. Most of the time goes on Tungsten Series II, because the single post and the new low-clearance recess kit change how you install. Then Platinum and Eclipse.' });

s = L.content(C2, 'Tungsten Series II', 'One Post, One Small Plate',
  'Series II hangs from one post, and the cable runs inside it, so there is no junction box on show. The post fixes with a plate just 2.5 by 4 in, 62 by 102 mm, so it sits on a slim beam. The post is 5 in on the 2 and 3 kW and 9 in on the 4 and 6 kW. Fix to the main structure and mount the elements horizontal. Source: launch deck and Series II training points.');
card(s, M, 1.95, 5.3, 4.8, HEX.GREY); pic(s, 't2-single-post-black', M + 0.2, 2.15, 4.9, 4.4, 'contain');
{
  const px = 6.55, py = 2.65, pw = 1.25, ph = 2.0;
  rect(s, px, py, pw, ph, HEX.GREY, { line: HEX.INK, lw: 1.5, name: 'plate' });
  [[0.25, 0.3], [pw - 0.25, 0.3], [0.25, ph - 0.3], [pw - 0.25, ph - 0.3]].forEach(([a, b]) => s.addShape(SH().OVAL, { x: px + a - 0.07, y: py + b - 0.07, w: 0.14, h: 0.14, fill: { color: HEX.WHITE }, line: { color: HEX.INK, width: 1 }, objectName: 'screw' }));
  dim(s, px, py - 0.25, px + pw, py - 0.25, '2.5 in', { side: 'above', lw: 1.2 });
  dim(s, px + pw + 0.25, py, px + pw + 0.25, py + ph, '4 in', { lw: 0.8 });
  cap(s, 'Mounting plate, 62 × 102 mm', px - 0.4, py + ph + 0.15, 2.4, { size: 12 });
}
[['LuPlug', 'Cable inside the post', 'No junction box on show.'], ['LuRuler', '5 in or 9 in post', '5 in on 2 and 3 kW, 9 in on 4 and 6 kW.'], ['LuLayers', 'Fix to the main structure', 'Elements mounted horizontal.']].forEach(([i, t, d], k) =>
  row(s, i, 8.95, 2.05 + k * 1.55, 3.8, t, d, { h: 1.3 }));

s = L.content(C2, 'Tungsten Series II', 'Angle The Heat, Reach Off The Wall',
  'Two brackets aim the heat where people sit. The new mounting bracket has set positions at 15, 30 and 45 degrees. Check the manual for the maximum on the 4 and 6 kW before you set 45; that figure is being confirmed with the Product team. The wall bracket holds the heater out from the wall with 14 in or 18 in of reach, and wall mounts stay at least 72 in above the floor. Source: launch deck accessories.');
[['rv-pr-select-graphite-angled-bracket', 'Mounting Bracket', 'Set positions at 15°, 30° and 45°. Check the manual for the 4 and 6 kW maximum.'],
 ['rv-pr-bg-graphite-limestone-wall-dusk', 'Wall Bracket', '14 in or 18 in of reach off the wall, at least 72 in above the floor.']].forEach(([img, t, d], k) => {
  const x = M + k * 6.2;
  card(s, x, 1.95, 5.9, 3.2, HEX.GREY); pic(s, img, x, 1.95, 5.9, 3.2);
  H1(s, t, { x, y: 5.3, w: 5.9, h: 0.5, fontSize: 22 });
  T(s, d, { x, y: 5.85, w: 5.9, h: 0.8, fontSize: 15 });
});

s = L.content(C2, 'Tungsten Series II', 'Follow The Pitch From 3/12 To 12/12',
  'The pitched-ceiling adaptor takes Series II onto gabled pergolas and pitched patio covers. It has six set holes: 3/12, 4/12, 6/12, 8/12, 10/12 and 12/12, which is 14 to 45 degrees. 6/12 is the most common residential pitch. Fit it in line with the pitch or across it. Recessing suits flat or gently sloping ceilings, so on a steep pitch use the adaptor. Source: launch deck.');
{
  const ox = 0.9, oy = 6.3, R = 5.2;
  line(s, ox, oy, ox + R + 0.3, oy, { width: 2, name: 'level' });
  [['3/12', 14.0], ['4/12', 18.4], ['6/12', 26.6], ['8/12', 33.7], ['10/12', 39.8], ['12/12', 45.0]].forEach(([p, a], i) => {
    const r = a * Math.PI / 180, ex = ox + R * Math.cos(r), ey = oy - R * Math.sin(r);
    line(s, ox, oy, ex, ey, { color: i === 2 ? HEX.FLAME : HEX.STEEL, width: i === 2 ? 2.5 : 1.25, name: 'pitch' });
    T(s, `${p}  ·  ${Math.round(a)}°`, { x: ex + 0.08, y: ey - 0.17, w: 1.6, h: 0.34, fontSize: 14, bold: i === 2, color: i === 2 ? HEX.FLAME : HEX.INK, valign: 'middle' });
  });
  s.addShape(SH().OVAL, { x: ox - 0.09, y: oy - 0.09, w: 0.18, h: 0.18, fill: { color: HEX.INK }, line: { color: HEX.INK, width: 0 }, objectName: 'pivot' });
}
[['LuRuler', 'Six set holes', '3/12, 4/12, 6/12, 8/12, 10/12 and 12/12.'], ['LuHouse', '6/12 is the common one', 'The most common residential pitch.'], ['LuLayers', 'In line or across', 'Fit along the pitch or across it.']].forEach(([i, t, d], k) =>
  row(s, i, 8.3, 2.05 + k * 1.5, 4.45, t, d, { h: 1.25 }));

s = L.content(C2, 'Tungsten Series II', 'The Low-Clearance Recess Kit',
  'The low-clearance kit recesses Select and Coastal flush in a 7.5 in cavity. It brings its own recess box, so there is nothing to build on site. The integrated cooling fans go on a dedicated, unswitched supply under 1 A, and stay powered at all times. Never cover the kit with insulation. The structure must carry the kit, 52 or 61 lb. The Coastal kit is powder-coated 316 stainless, IPX5, and is never installed on boats. Source: Series II training points and launch deck. To confirm with the Product team: the number of fans and whether code asks for any fire-rated lining.');
card(s, M, 1.95, 5.3, 4.8, HEX.GREY); pic(s, 't2-low-clearance-recess', M + 0.2, 2.15, 4.9, 4.4, 'contain');
[['LuBox', 'Recess box supplied', 'Nothing to build on site; the structure must carry 52 or 61 lb.'],
 ['LuFan', 'Fans on their own supply', 'Dedicated, unswitched, under 1 A, powered at all times.'],
 ['LuBan', 'Never cover with insulation', 'Keep the cavity clear around the box.'],
 ['LuWaves', 'Coastal kit', 'Powder-coated 316 stainless, IPX5. Never on boats.']].forEach(([i, t, d], k) =>
  row(s, i, 6.4, 2.0 + k * 1.2, 6.33, t, d, { h: 1.05, style: k === 2 ? 'solid' : 'light' }));

s = L.content(C2, 'Recess Layout', 'Lay Out The Cut-Out',
  'Plan view of a recess between two joists. The cut-out is 1257 by 255 mm for the 2 and 4 kW, and 1550 by 255 mm for the 3 and 6 kW, so you need 255 mm clear between joists. Keep 500 mm, 19.7 in, from the cut-out to the wall, and the same between heaters. Leave 200 mm, 7.9 in, clear at the terminal-box end. Joists must not be cut or notched: if a joist is in the way, move the heater. Source: LC Ceiling Recess Kit for Tungsten Series II instructions.');
{
  const x0 = 0.75, k = 0.0027, yA = 2.45, gap = 255 * k * 2.2; // plan scale; joist gap drawn wider for legibility
  rect(s, x0, 1.95, 0.22, 3.9, HEX.INK, { name: 'wall' });
  cap(s, 'Wall', x0 - 0.1, 5.9, 0.6, { size: 12, color: HEX.INK });
  const cx = x0 + 0.22 + 500 * k, cl = 1550 * k;
  [yA, yA + 0.22 + gap].forEach((y) => rect(s, x0 + 0.22, y, 7.0, 0.22, 'C9C9C6', { name: 'joist' }));
  cap(s, 'Joist', x0 + 0.35, yA - 0.3, 0.7, { size: 12, align: 'left' });
  const cy = yA + 0.22;
  rect(s, cx, cy, cl, gap, HEX.WASH, { line: HEX.FLAME, lw: 1.75, name: 'cut-out' });
  T(s, 'Cut-out', { x: cx + 1.9, y: cy + gap / 2 - 0.2, w: 1.5, h: 0.4, fontSize: 15, bold: true, color: HEX.INK, align: 'center', valign: 'middle' });
  rect(s, cx + cl - 0.35, cy + 0.12, 0.25, gap - 0.24, HEX.STEEL, { name: 'terminal-box' });
  dim(s, x0 + 0.24, cy + gap + 0.75, cx, cy + gap + 0.75, '500 mm\n(19.7 in)', { lw: 1.3, lh: 0.5, size: 13 });
  dim(s, cx, cy + gap + 0.35, cx + cl, cy + gap + 0.35, '1550 mm (3 and 6 kW)', { lw: 2.6, size: 13 });
  dim(s, cx + cl, cy + gap + 0.75, cx + cl + 200 * k, cy + gap + 0.75, '200 mm', { lw: 0.9, size: 13 });
  cap(s, 'Terminal-box end', cx + cl - 1.3, yA - 0.3, 1.8, { size: 12, align: 'right' });
  dim(s, cx + 0.45, cy + 0.02, cx + 0.45, cy + gap - 0.02, '255 mm clear', { lw: 1.4, size: 13 });
}
card(s, 8.7, 1.95, 4.03, 4.8, HEX.GREY);
T(s, 'CUT-OUTS', { x: 9.0, y: 2.2, w: 3.5, h: 0.3, fontSize: 12, bold: true, color: HEX.FLAME, charSpacing: 3 });
[['2 and 4 kW', '1257 × 255 mm'], ['3 and 6 kW', '1550 × 255 mm']].forEach(([a, b], i) => {
  T(s, a, { x: 9.0, y: 2.6 + i * 0.95, w: 3.5, h: 0.35, fontSize: 15 });
  H1(s, b, { x: 9.0, y: 2.92 + i * 0.95, w: 3.5, h: 0.5, fontSize: 22 });
});
ico(s, 'LuBan', 9.0, 4.65, 0.6, 'solid');
T(s, 'Never cut or notch a joist. Move the heater instead.', { x: 9.8, y: 4.6, w: 2.75, h: 0.9, fontSize: 15, bold: true, color: HEX.INK });
T(s, 'Same 500 mm between heaters.', { x: 9.0, y: 5.75, w: 3.5, h: 0.6, fontSize: 14 });

s = L.content(C2, 'Recess Layout', 'Check The Cavity Before You Cut',
  'Section through the recess. The cavity needs at least 190.5 mm, 7.5 in, above the ceiling lining. The lining itself is 10 to 30 mm thick. The ceiling is flat or slopes no more than 1/4 in per inch; on a slope, put the control box at the lowest end. The heater face sits at least 2400 mm, 94 in, above the floor. Source: Series II LC recess instructions and training points.');
{
  const yC = 4.0; // underside of lining
  rect(s, 0.8, 2.0, 0.5, yC - 2.25, 'C9C9C6', { name: 'joist' }); rect(s, 6.3, 2.0, 0.5, yC - 2.25, 'C9C9C6', { name: 'joist' });
  rect(s, 0.6, yC - 0.25, 6.4, 0.25, HEX.GREY, { line: HEX.STEEL, name: 'lining' });
  rect(s, 1.55, 2.25, 4.5, yC - 2.5, HEX.WHITE, { line: HEX.INK, lw: 1.5, name: 'recess-box' });
  heater(s, 1.75, yC - 0.27, 4.1, 0.27);
  rect(s, 1.55, yC - 0.25, 4.5, 0.25, HEX.INK, { name: 'heater-face' }); rect(s, 1.7, yC - 0.06, 4.2, 0.06, HEX.FLAME, { name: 'glow' });
  T(s, 'Recess box (supplied)', { x: 1.55, y: 2.55, w: 4.5, h: 0.4, fontSize: 14, color: HEX.INK, align: 'center' });
  [2.45, 4.6].forEach((x) => { ico(s, 'LuFan', x, 3.0, 0.5); });
  dim(s, 7.25, 2.25, 7.25, yC - 0.25, '190.5 mm', { lw: 1.0, size: 13 });
  dim(s, 0.45, yC - 0.25, 0.45, yC, '', {});
  T(s, 'Lining 10–30 mm', { x: 0.1, y: yC + 0.1, w: 1.8, h: 0.3, fontSize: 13, bold: true, color: HEX.FLAME });
  line(s, 0.6, 6.4, 7.0, 6.4, { width: 2, name: 'floor' });
  line(s, 3.8, yC + 0.05, 3.8, 6.35, { color: HEX.FLAME, width: 1.25, begin: 'triangle', end: 'triangle', dash: 'dash', name: 'dimension' });
  T(s, 'Heater face to floor: 2400 mm (94 in) or more', { x: 3.95, y: 5.0, w: 3.2, h: 0.65, fontSize: 13, bold: true, color: HEX.FLAME });
  cap(s, 'Joist', 0.6, 1.7, 0.9, { size: 12 });
}
big(s, 8.6, 1.95, 4.1, '7.5 in', 'Minimum cavity, 190.5 mm', { size: 32 });
big(s, 8.6, 3.3, 4.1, '1/4 in per in', 'Maximum ceiling slope; control box at the low end', { size: 32 });
big(s, 8.6, 4.75, 4.1, '94 in', 'Heater face to floor, 2400 mm', { size: 32 });

s = L.content(C2, 'Platinum Electric', 'Platinum On A Pole, A Wall Or Flush',
  'Platinum Electric comes with an 8 in pole and a wall bracket in the box, with 2 ft and 4 ft poles for taller rooms. Minimums are 72 in on a wall and 96 in on a ceiling; recessed, about 8 ft, 2400 mm. The low-clearance kit needs a 180 mm, 7.1 in, cavity, has an integrated cooling fan and thermal cut-offs, and takes a ceiling slope up to 1/4 in per inch. The standard recess kit needs 10 in, or 13.8 in for the 4500 W. Source: Platinum framework and the Platinum LC recess manual.');
pic(s, 'w-bromic-shoot-may-11-2023-39', M, 1.95, 4.9, 4.8);
T(s, bullets(['8 in pole and wall bracket in the box; 2 ft and 4 ft poles for taller rooms.', 'Wall 72 in, ceiling 96 in, recessed about 8 ft (2400 mm).']), { x: 5.85, y: 1.95, w: 6.88, h: 1.2, fontSize: 15 });
table(s, [['Low-clearance kit', 'Cut-out'], ['2300 W', '995 × 240 mm'], ['3400 W', '1430 × 240 mm'], ['4500 W', '1550 × 317 mm']], { x: 5.85, y: 3.25, w: 6.88, colW: [3.44, 3.44], rowH: 0.45 });
T(s, bullets(['180 mm (7.1 in) cavity, integrated cooling fan, thermal cut-offs.', 'Ceiling slope up to 1/4 in per inch.']), { x: 5.85, y: 5.25, w: 6.88, h: 1.4, fontSize: 15 });

s = L.content(C2, 'Eclipse', 'Hang Eclipse At 8 ft Or Higher',
  'Eclipse hangs on a pole: 8, 24 or 48 in, with the 24 in twin pole as standard. Whatever the pole, the head sits at least 8 ft above the floor. Under a high ceiling, the 48 in pole brings the head down to about 8 ft. Eclipse is IP54, so mount it under cover where possible, and it is hard-wired by a licensed electrician. One Eclipse runs on each channel of the Eclipse controller. The ceiling height in the drawing is for illustration. Source: Eclipse framework and product facts.');
{
  const F = 6.4, k = 0.36; // ft to slide inches
  const ceil = F - 12 * k;
  rect(s, 0.7, ceil - 0.18, 6.0, 0.18, 'C9C9C6', { name: 'ceiling' });
  line(s, 0.7, F, 6.7, F, { width: 2, name: 'floor' });
  line(s, 0.7, F - 8 * k, 6.7, F - 8 * k, { color: HEX.FLAME, width: 1.25, dash: 'dash', name: '8 ft line' });
  T(s, '8 ft minimum to the head', { x: 0.75, y: F - 8 * k + 0.08, w: 3, h: 0.3, fontSize: 13, bold: true, color: HEX.FLAME });
  [['8 in', 8], ['24 in', 24], ['48 in', 48]].forEach(([lab, inch], i) => {
    const cx = 1.6 + i * 1.95, len = inch / 12 * k;
    rect(s, cx - 0.03, ceil, 0.06, len, HEX.INK, { name: 'pole' });
    s.addShape(SH().OVAL, { x: cx - 0.6, y: ceil + len, w: 1.2, h: 0.18, fill: { color: HEX.INK }, line: { color: HEX.FLAME, width: 1.5 }, objectName: 'eclipse-head' });
    rect(s, cx - 0.7, F - 2.5 / 12 * 12 * k * 1.0, 1.4, 0.07, HEX.STEEL, { name: 'table' }); rect(s, cx - 0.03, F - 2.5 * k + 0.07, 0.06, 2.5 * k - 0.07, HEX.STEEL, { name: 'table-leg' });
    cap(s, `${lab} pole`, cx - 0.75, i === 2 ? ceil + len + 0.45 : ceil + len + 0.22, 1.5, { size: 13, color: HEX.INK, bold: true });
  });
}
T(s, bullets(['Poles of 8, 24 or 48 in; the 24 in twin pole is standard.', 'Head at least 8 ft above the floor.', 'IP54: mount under cover where possible.', 'One Eclipse a channel on the Eclipse controller.']), { x: 7.3, y: 1.95, w: 5.43, h: 2.5, fontSize: 15 });
pic(s, 'w-eclipse-electric-24twin-pole-residential-sce', 7.3, 4.55, 5.43, 2.2);

exPanel({ section: C2, n: 2, minutes: 10, icon: 'LuRuler', title: 'Lay Out The Recess Cut-Out',
  task: 'The design plan shows two 6 kW Select heaters, recessed. Mark them up.',
  steps: ['Size each cut-out for a 6 kW heater.', 'Keep the distances to the wall, the other heater and the terminal-box end.', 'Check the cavity, lining, slope and height against the site notes.', 'Say what goes on the fan supply and how many controller channels you need.'],
  notes: 'How to run it: hand out a printed copy of the plan, or work on the screen in pairs. Ten minutes, then one pair talks the room through their layout. Debrief: each cut-out is 1550 by 255 mm, with its long side along the joists. The bays are 14.5 in clear, about 368 mm, which beats the 255 mm needed, so no joist is touched. Each cut-out starts at least 500 mm, 19.7 in, from the house wall, the two heaters sit in different bays at least 500 mm apart, and there is 200 mm clear at the terminal-box end. The site notes pass: a 9 in cavity beats 7.5 in, a 1/2 in lining is 12.7 mm, inside 10 to 30 mm, the ceiling is flat, and 9 ft is 108 in, above the 94 in minimum. The fans go on a dedicated, unswitched supply under 1 A. Controls: two 6 kW heaters, two channels, so a 2-channel Affinity Dimmer, or a 5-channel for growth, with a wall switch.',
  draw: (s, X, Y) => {
    rect(s, X + 0.3, Y + 0.3, 0.2, 3.3, HEX.INK, { name: 'house-wall' });
    cap(s, 'House wall', X + 0.1, Y + 3.9, 1.2, { size: 12, color: HEX.INK, align: 'left' });
    for (let i = 0; i < 6; i++) rect(s, X + 0.5, Y + 0.45 + i * 0.55, 4.6, 0.07, 'C9C9C6', { name: 'joist' });
    cap(s, 'Joists, 16 in centres (14.5 in clear)', X + 1.2, Y + 0.05, 3.9, { size: 12, align: 'right' });
    dim(s, X + 0.52, Y + 3.72, X + 5.1, Y + 3.72, 'Porch 10 ft deep', { side: 'above', lw: 2.0, size: 12 });
    card(s, X + 2.6, Y + 1.25, 2.6, 1.45, HEX.GREY, 'site-notes');
    T(s, [{ text: 'SITE NOTES', options: { bold: true, color: HEX.FLAME, breakLine: true, fontSize: 12 } }, { text: 'Cavity 9 in · lining 1/2 in', options: { breakLine: true } }, { text: 'Flat ceiling · 9 ft to floor', options: { breakLine: true } }, { text: '240 V supply', options: {} }], { x: X + 2.75, y: Y + 1.35, w: 2.4, h: 1.3, fontSize: 14, color: HEX.INK });
  } });

L.quiz({ section: C2, n: 'C2', q: 'A Joist Runs Through Your Cut-Out. What Do You Do?', options: ['Notch the joist to clear the box', 'Cut it and add a header', 'Move the heater to a clear bay'], answer: 2,
  why: 'Joists must not be cut or notched. Move the heater so the 255 mm cut-out sits in a clear bay. Source: LC Ceiling Recess Kit for Tungsten Series II instructions.' });

// ====================================================================== C3 GAS INSTALLS
const C3 = 'C3 Gas';
L.divider({ section: C3, n: 'MODULE C3', title: 'Gas Installs', icon: 'LuHardHat', img: 'w-bromic-tungsten-gas-4',
  line: 'Tungsten Gas and Platinum Gas: under cover, clear of what burns, with open walls under a roof.',
  notes: 'Module C3 covers the basics of Tungsten Gas and Platinum Gas. The gas work itself belongs to a licensed gas fitter; what every installer needs is where a gas heater can go, how much space it needs, and when electric is the simpler answer.' });

s = L.content(C3, 'Gas Basics', 'Gas Heaters Live Under Cover',
  'Gas heaters are fitted by a licensed gas fitter to ANSI Z223.1/NFPA 54 and local code. Mounted gas heaters are IPX4 and must sit under a protective cover, out of the rain. Gas heaters cannot be recessed. The ignition needs 110 V, under 2 A. Tungsten Gas has a 1/2 in NPT inlet with a factory isolating valve, and a wall bracket comes in the box. Sources: Tungsten Gas and Platinum Gas frameworks, product facts, Bromic FAQ via the pergola guide.');
pic(s, 'w-892rc6cyn0iocge2hikd', M, 1.95, 5.3, 4.8);
[['LuHardHat', 'A licensed gas fitter', 'To ANSI Z223.1/NFPA 54 and local code.'],
 ['LuCloudRain', 'Under a protective cover', 'IPX4 heads, kept out of the rain.'],
 ['LuBan', 'Never recessed', 'Gas heaters cannot be recessed.'],
 ['LuPlug', '110 V ignition, under 2 A', 'Tungsten Gas: 1/2 in NPT inlet, factory isolating valve.']].forEach(([i, t, d], k) =>
  row(s, i, 6.3, 2.0 + k * 1.2, 6.43, t, d, { h: 1.05, style: k === 2 ? 'solid' : 'light' }));

s = L.content(C3, 'Gas Clearances', 'Keep Gas Clear Of What Burns',
  'For Tungsten Gas, keep 3 ft to combustibles above the heater, or 14 in with the heat shield, also called the heat deflector, and mount at least 8 ft above the floor. Platinum Gas uses the same figures and also asks for 3 ft at the sides. The heat shield is a dual-layer stainless plate that lets a gas heater sit under a lower ceiling. Source: Heat The Pergola guide and the gas frameworks.');
{
  const F = 6.4, ceil = 2.05;
  [[0.7, 'Without the heat shield', false], [4.0, 'With the heat shield', true]].forEach(([x, lab, shield]) => {
    rect(s, x, ceil, 3.0, 0.18, 'C9C9C6', { name: 'ceiling' });
    const hy = shield ? ceil + 0.18 + 0.75 : ceil + 0.18 + 1.6;
    rect(s, x + 1.45, ceil + 0.18, 0.08, hy - ceil - 0.18, HEX.INK, { name: 'drop-pole' });
    if (shield) rect(s, x + 0.75, hy - 0.12, 1.5, 0.07, HEX.STEEL, { name: 'heat-shield' });
    rect(s, x + 0.95, hy, 1.1, 0.42, HEX.INK, { name: 'gas-heater' }); rect(s, x + 1.05, hy + 0.34, 0.9, 0.08, HEX.FLAME, { name: 'glow' });
    dim(s, x + 2.6, ceil + 0.2, x + 2.6, shield ? hy - 0.14 : hy - 0.02, shield ? '14 in' : '3 ft', { lw: 0.7 });
    dim(s, x + 0.35, hy + 0.44, x + 0.35, F - 0.02, '8 ft min', { side: 'left', lw: 0.6, size: 13 });
    cap(s, lab, x, F + 0.08, 3.0, { size: 13, color: HEX.INK, bold: true });
  });
  line(s, 0.4, F, 7.7, F, { width: 2, name: 'floor' });
}
big(s, 8.6, 1.95, 4.1, '3 ft', 'To combustibles above, and at the sides on Platinum Gas');
big(s, 8.6, 3.45, 4.1, '14 in', 'Above, with the heat shield');
big(s, 8.6, 4.95, 4.1, '8 ft', 'Minimum height above the floor');

s = L.content(C3, 'Open Walls', 'Under A Roof, Gas Needs Open Walls',
  'Gas under a roof follows its ventilation rule from the gas manual: with a roof and more than two walls, at least 25% of the total wall area must be fully open, plus 30% of the rest. Screens, blinds and closed louvres count against you when they are down. Where a space cannot meet the rule, specify electric: no gas line, no flue, no ventilation sums. Source: Heat The Pergola guide, citing the gas manual.');
card(s, M, 1.95, 3.45, 2.75, HEX.GREY); card(s, 4.3, 1.95, 3.45, 2.75, HEX.GREY);
H1(s, '25%', { x: M + 0.3, y: 2.15, w: 3, h: 0.9, fontSize: 48, color: HEX.FLAME });
T(s, 'Of the total wall area fully open, with a roof and more than two walls.', { x: M + 0.3, y: 3.15, w: 2.9, h: 1.9, fontSize: 16, color: HEX.INK });
H1(s, '+30%', { x: 4.6, y: 2.15, w: 3, h: 0.9, fontSize: 48, color: HEX.FLAME });
T(s, 'Of the rest, on top of that.', { x: 4.6, y: 3.15, w: 2.9, h: 1.9, fontSize: 16, color: HEX.INK });
row(s, 'LuZap', M, 5.15, 7.15, 'Can\'t meet it? Specify electric.', 'No gas line, no flue, no ventilation sums.', { d: 0.7, h: 1.0, style: 'solid' });
pic(s, 'w-bromic-centrico-photos-29', 8.1, 1.95, 4.63, 4.8);

s = L.content(C3, 'Mounting Gas', 'Aim The Warmth At The Seats',
  'Tungsten Gas mounts on a wall or ceiling with a pivot arm that turns 25 degrees each way, and ceiling poles from 9.69 to 41.18 in hang it vertical; the heat shield is optional. Platinum Gas tilts at 0, 10 or 20 degrees, wall brackets are included and poles are optional; two units can go back to back on a ceiling pole. Set the angle before lighting, then leave it. Controls are on and off only: an Affinity On/Off controller or a manual wall switch. To confirm with the Product team: whether the Affinity On/Off spec lists Tungsten Gas. Never quote a Btu figure for Tungsten Gas; it is unpublished until verified.');
[['Tungsten Gas', ['Wall or ceiling; pivot arm ±25°.', 'Ceiling poles 9.69–41.18 in, hanging vertical.', 'Heat shield optional.']],
 ['Platinum Gas', ['Tilt at 0°, 10° or 20°.', 'Wall brackets included; poles optional.', 'Two back to back on a ceiling pole.']]].forEach(([t, b], k) => {
  const y = 1.95 + k * 2.05;
  H1(s, t, { x: M, y, w: 6.5, h: 0.5, fontSize: 22 });
  T(s, bullets(b, { paraSpaceAfter: 4 }), { x: M, y: y + 0.55, w: 6.5, h: 1.35, fontSize: 15 });
});
row(s, 'LuToggleRight', M, 6.0, 6.6, 'On and off only', 'Affinity On/Off controller or a manual wall switch.', { h: 0.8 });
pic(s, 'w-gasceilingmountpole246mm-lifestyle2-1', 7.4, 1.95, 5.33, 4.8);

L.exercise({ section: C3, n: 3, minutes: 10, icon: 'LuHardHat', title: 'Gas Or Electric? Make The Call', img: 'w-aba-restaurant',
  task: 'Three sites, three calls. Choose gas or electric for each and say why.',
  steps: ['A timber pavilion: solid roof, three closed walls, the owner wants a flush ceiling.', 'A restaurant terrace: roof, two closed walls, 10 ft to a timber ceiling, gas on site.', 'A louvered pergola: roof closed all winter, screens down on three sides.', 'Each team defends one call in 60 seconds.'],
  notes: 'How to run it: split into three teams, give each team one site to lead on, and five minutes to decide; then each team defends its call in 60 seconds and the others can challenge. Debrief. Site 1: electric. Gas cannot be recessed, and with a roof and three walls the open-wall rule applies; Tungsten Select or Platinum in the low-clearance kit gives the flush ceiling. Site 2: gas can work. With two closed walls the more-than-two-walls rule is not triggered, but a heater at 8 ft under a 10 ft ceiling leaves 2 ft above, short of 3 ft, so fit the heat shield for 14 in, or choose electric. Site 3: electric. A closed roof with screens on three sides is a roof and more than two walls, so gas would need 25% of the wall area fully open plus 30% of the rest; with the screens down it fails. Electric on the perimeter beam, never on a louvre.' });

L.quiz({ section: C3, n: 'C3', q: 'Tungsten Gas Sits 20 in Below Timber. Is It OK?', options: ['Yes – 12 in is enough', 'Only with the heat shield fitted', 'Only if it is recessed'], answer: 1,
  why: 'Tungsten Gas needs 3 ft to combustibles above, or 14 in with the heat shield. At 20 in, it needs the shield. Gas heaters cannot be recessed. Source: Heat The Pergola guide.' });

// ====================================================================== C4 CONTROLS
const C4 = 'C4 Controls';
L.divider({ section: C4, n: 'MODULE C4', title: 'Controls', icon: 'LuSlidersHorizontal', img: 'w-e57caf05-21e4-4f53-9114-170c5861aec4',
  line: 'Every Bromic heater is paired with Affinity Smart-Heat® Controls. Choose them, wire them, commission them.',
  notes: 'Module C4. Controls are never an extra: every heater recommendation includes its controls, and a heater is a finished job only once they are in and commissioned. Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately, so they belong on every quote.' });

s = L.content(C4, 'Affinity Smart-Heat® Controls', 'Choose The Right Controller',
  'Four ways to run the heat. The On/Off controller switches heaters by zone, in 1, 2 or 5 channels, 6 kW a channel at 208 to 277 V, in an IP54 enclosure. The Dimmer has the same channels and capacity and dims in 1% steps; it is our recommended controller for electric heaters. The Eclipse controller runs one Eclipse a channel with heat and light set separately, or there is the Eclipse Dimmer Controller with a remote. The manual wall switch gives local on and off, 20 A, 120 to 277 V. Sources: A25, pergola guide, product facts.');
[['w-affinity-onoff', 'On/Off', '1, 2 or 5 channels. 6 kW a channel at 208–277 V. IP54.'],
 ['w-affinity-dimmer-5ch', 'Dimmer', 'Same channels and capacity. Dims in 1% steps. Our pick for electric.'],
 ['pf-eclipse-pendant', 'Eclipse Controller', 'One Eclipse a channel; heat and light set separately.'],
 ['w-manual-1ch-indoor-switch-image', 'Wall Switch', 'Local on and off. 20 A, 120–277 V; single or dual.']].forEach(([img, t, d], k) => {
  const x = M + k * 3.1;
  card(s, x, 1.95, 2.85, 4.8, HEX.GREY);
  pic(s, img, x + 0.15, 2.1, 2.55, 2.1, 'contain');
  H1(s, t, { x: x + 0.2, y: 4.35, w: 2.5, h: 0.5, fontSize: 20 });
  T(s, d, { x: x + 0.2, y: 4.9, w: 2.5, h: 1.7, fontSize: 15 });
});

s = L.content(C4, 'Channels', 'Count The Channels',
  'Sizing a controller is simple arithmetic. Add the kilowatts in each zone; one channel carries up to 6 kW at 208 to 277 V, on its own dedicated circuit. In this example, two 3 kW heaters over the dining table share one channel, the 6 kW over the lounge takes one, and the 4 kW at the bar takes one: three channels, so a 5-channel Dimmer with two spare. Eclipse is different: one heater a channel on the Eclipse controller. To confirm with the Product team: per-model compatibility of each controller with every wattage and voltage.');
[['Dining', '2 × 3 kW', '6 kW'], ['Lounge', '1 × 6 kW', '6 kW'], ['Bar', '1 × 4 kW', '4 kW']].forEach(([z, h, kw], k) => {
  const x = M + k * 2.75;
  card(s, x, 1.95, 2.45, 2.6, HEX.GREY);
  T(s, z.toUpperCase(), { x: x + 0.25, y: 2.15, w: 2, h: 0.3, fontSize: 12, bold: true, color: HEX.FLAME, charSpacing: 3 });
  H1(s, h, { x: x + 0.25, y: 2.55, w: 2.0, h: 0.6, fontSize: 26 });
  T(s, `${kw} → 1 channel`, { x: x + 0.25, y: 3.4, w: 2.0, h: 0.8, fontSize: 16, color: HEX.INK });
  line(s, x + 1.22, 4.6, x + 1.22, 5.05, { color: HEX.FLAME, width: 2, end: 'triangle', name: 'arrow' });
});
card(s, M, 5.15, 7.95, 1.55, HEX.WASH);
H1(s, '3 Channels: A 5-Channel Dimmer, Two Spare', { x: M + 0.3, y: 5.3, w: 7.4, h: 0.55, fontSize: 22 });
T(s, 'Plus a wall switch, and the app on the client\'s phone.', { x: M + 0.3, y: 5.9, w: 7.4, h: 0.6, fontSize: 15, color: HEX.INK });
big(s, 9.0, 1.95, 3.7, '6 kW', 'A channel, at 208–277 V, on its own circuit');
big(s, 9.0, 3.55, 3.7, '1, 2, 5', 'Channels on the On/Off and Dimmer');
big(s, 9.0, 5.15, 3.7, '1 Eclipse', 'A channel on the Eclipse controller');

s = L.content(C4, 'Wiring', 'How It All Connects',
  'The picture to carry in your head. Each controller channel has its own dedicated circuit from the panel, and each channel feeds a zone of heaters. The manual wall switch gives local on and off, and serves as the local disconnect where the code asks for one. Put the controller somewhere dry, reachable and inside Wi-Fi range if the app is used. For a home or building system, the expansion board adds Ethernet and 0 to 10 V; it is built into the 5-channel controller, and BMS mode turns off the app. Follow the wiring diagram in the manual for every terminal. Sources: A25 and pergola guide.');
{
  const box = (x, y, w, h, t, sub, fill = HEX.GREY, name = 'block') => { rect(s, x, y, w, h, fill, { name }); T(s, [{ text: t, options: { bold: true, breakLine: !!sub, fontSize: 16 } }, ...(sub ? [{ text: sub, options: { fontSize: 13 } }] : [])], { x: x + 0.15, y, w: w - 0.3, h, color: fill === HEX.INK ? HEX.WHITE : HEX.INK, align: 'center', valign: 'middle' }); };
  box(M, 3.2, 2.4, 1.3, 'Panel', 'A breaker for each channel');
  box(4.3, 3.0, 2.9, 1.7, 'Affinity Controller', 'Dry, reachable, in Wi-Fi range', HEX.INK);
  [0, 1, 2].forEach((i) => { const y = 2.05 + i * 1.35; box(9.3, y, 3.4, 1.05, `Zone ${i + 1}`, 'Heaters on one channel', HEX.WASH); line(s, 7.2, 3.85, 9.28, y + 0.52, { color: HEX.FLAME, width: 1.75, end: 'triangle', name: 'channel' }); });
  line(s, 3.0, 3.85, 4.28, 3.85, { color: HEX.INK, width: 2, end: 'triangle', name: 'circuit' });
  cap(s, 'Dedicated circuit', 2.85, 3.45, 1.6, { size: 12 });
  box(4.3, 5.45, 2.9, 1.2, 'Wall Switch', 'Local on/off; the disconnect where code asks');
  line(s, 5.75, 4.7, 5.75, 5.43, { color: HEX.INK, width: 1.5, name: 'link' });
  box(M, 5.45, 2.9, 1.2, 'Phone', 'Bromic app: zones, schedules');
  line(s, 3.5, 5.6, 4.28, 4.55, { color: HEX.STEEL, width: 1.5, dash: 'dash', name: 'wifi' });
  box(4.3, 1.75, 2.9, 0.95, 'Home System Or BMS', 'Ethernet, 0–10 V (5-channel)');
  line(s, 5.75, 2.7, 5.75, 2.98, { color: HEX.STEEL, width: 1.5, dash: 'dash', name: 'bms' });
}
T(s, 'BMS mode turns off the app. Follow the wiring diagram in the manual.', { x: 7.6, y: 6.2, w: 5.1, h: 0.5, fontSize: 14, color: HEX.STEEL, italic: true });

s = L.content(C4, 'Commissioning', 'Commission It Before You Leave',
  'Commissioning is the last hour on site and the part the customer remembers. Power up and check every heater and every zone runs, from the controller and from the wall switch. Pair the controller in the Bromic app, name the zones the way the client talks about the space, set schedules and timers with them, and add Alexa or Google Assistant if they use them. Source: Series II training module 5 and the pergola guide checklist.');
pic(s, 'w-connecticut-private-res-tungsten-electric-1', M, 1.95, 4.2, 4.8);
['Power up; check every heater and zone runs.', 'Pair the controller in the Bromic app.', 'Name the zones: dining, lounge, bar.', 'Set schedules and timers with the client.', 'Add Alexa or Google Assistant if they use them.', 'Test the wall switch, then show it.'].forEach((t, k) => {
  const y = 1.95 + k * 0.8;
  H1(s, String(k + 1), { x: 5.2, y, w: 0.6, h: 0.65, fontSize: 30, color: HEX.FLAME, valign: 'middle' });
  T(s, t, { x: 5.9, y, w: 6.8, h: 0.65, fontSize: 17, color: HEX.INK, valign: 'middle' });
});

s = L.content(C4, 'Home Systems', 'Hand Off To The Home System',
  'Affinity connects to Amazon Alexa and Google Assistant with no extra hub, and to Control4, Crestron and Lutron. Compatibility varies by system and may need extra integration hardware or configuration, so agree with the integrator who does what before rough-in. A building management system connects through Ethernet and 0 to 10 V on the 5-channel controller; BMS mode turns off the app. Wi-Fi and app features need compatible Affinity Smart-Heat Controls, sold separately. Sources: product facts, A25, pergola guide.');
[['LuMic', 'Alexa and Google Assistant', 'No extra hub needed.'],
 ['LuHouse', 'Control4, Crestron, Lutron', 'Compatibility varies by system; it may need extra hardware or configuration.'],
 ['LuNetwork', 'Building management', 'Ethernet and 0–10 V on the 5-channel controller. BMS mode turns off the app.'],
 ['LuHandshake', 'Agree it with the integrator', 'Who sets up what, before rough-in.']].forEach(([i, t, d], k) =>
  row(s, i, M, 2.0 + k * 1.2, 6.8, t, d, { h: 1.1 }));
pic(s, 'w-bromic-home-automation-hero', 7.7, 1.95, 5.03, 4.8);

L.exercise({ section: C4, n: 4, minutes: 8, icon: 'LuSlidersHorizontal', title: 'Which Controller, How Many Channels?', img: 'w-affinity-dimmer-5ch', imgMode: 'contain',
  task: 'Four jobs. Name the controller and count the channels for each.',
  steps: ['A pergola: three 6 kW Select heaters; the owner wants to dim from the phone.', 'A restaurant: two Eclipse pendants, heat and light set separately.', 'A patio: two Platinum Gas heaters.', 'A hotel terrace run from the building management system.'],
  notes: 'How to run it: individual work for four minutes, then compare in pairs, then take one answer per job from the room. Debrief. Job 1: three 6 kW heaters, three channels, so a 5-channel Affinity Dimmer, plus a wall switch and the app. Job 2: the Affinity Eclipse controller, one Eclipse a channel, so two channels: the 5-channel, or two 1-channel controllers. Job 3: gas is on and off only, so an Affinity On/Off controller or a manual wall switch; whether the On/Off spec lists every gas model is to confirm with the Product team. Job 4: the 5-channel controller has the expansion board built in, with Ethernet and 0 to 10 V for the BMS; remind them BMS mode turns off the app. Every answer includes its wall switch.' });

L.quiz({ section: C4, n: 'C4', q: 'How Many 6 kW Heaters On One Dimmer Channel?', options: ['One', 'Two', 'Three'], answer: 0,
  why: 'Each Affinity On/Off or Dimmer channel carries up to 6 kW at 208–277 V: one 6 kW Tungsten a channel. Source: pergola guide, controls box.' });

// ====================================================================== C5 HANDOVER, CARE AND WARRANTY
const C5 = 'C5 Handover';
L.divider({ section: C5, n: 'MODULE C5', title: 'Handover, Care And Warranty', icon: 'LuHandshake', img: 'l-004-012',
  line: 'The app on their phone, the care that keeps a heater looking new by the sea, and the warranty behind it.',
  notes: 'Module C5. The handover is where the customer decides whether they will recommend you. We cover the app walk-through, care by the coast and the warranty you can quote.' });

s = L.content(C5, 'The App', 'Put The Heat On Their Phone',
  'Do this on the customer\'s own phone, before you leave. Show them their zones, set schedules and timers together so the heat is on before guests arrive and off when the evening ends, show the dimming in 1% steps on the Dimmer, heat and light set separately on Eclipse, and voice control if they use Alexa or Google Assistant. Source: Heat The Pergola guide, the app page.');
pic(s, 'w-bromic-heating-app-blog-image', M, 1.95, 5.0, 4.8);
[['LuLayers', 'Zones', 'The dining table, the lounge and the bar, each on its own.'],
 ['LuCalendarClock', 'Schedules and timers', 'Warm before guests arrive, off when the evening ends.'],
 ['LuSlidersHorizontal', 'Dimming in 1% steps', 'On the Dimmer: up on a cold night, down on a mild one.'],
 ['LuSun', 'Heat and light on Eclipse', 'Set separately.'],
 ['LuMic', 'Voice', 'Alexa or Google Assistant, if they use them.']].forEach(([i, t, d], k) =>
  row(s, i, 6.0, 1.95 + k * 0.97, 6.73, t, d, { d: 0.55, h: 0.9, size: 15 }));

s = L.content(C5, 'Care By The Coast', 'Stainless Is Not Stain-Free',
  'Salt air tests every metal. Bromic\'s manuals ask for salt spray to be wiped off, a fortnightly clean by the coast, and a yearly check by a qualified technician. Show the customer the wipe-down at handover. Tungsten Coastal is 316 marine-grade stainless under a corrosion-resistant coating, made for coastal homes and venues, and never for boats. Source: Tungsten and Platinum manuals via the pergola guide.');
pic(s, 'w-bromic-shoot-may-11-2023-43', M, 1.95, 5.6, 4.8);
[['LuDroplets', 'After salt spray', 'Wipe it off.'], ['LuCalendarCheck', 'Every two weeks by the coast', 'A clean.'], ['LuWrench', 'Every year', 'A check by a qualified technician.']].forEach(([i, t, d], k) =>
  row(s, i, 6.6, 2.0 + k * 1.25, 6.1, t, d, { d: 0.7, h: 1.0, size: 17 }));
T(s, 'Tungsten Coastal: 316 marine-grade stainless under a corrosion-resistant coating. For coastal homes and venues, never boats.', { x: 6.6, y: 5.85, w: 6.1, h: 0.85, fontSize: 14, color: HEX.STEEL });

s = L.content(C5, 'Warranty', 'A Warranty You Can Quote',
  'Quote the warranty with confidence. Tungsten Select and Coastal, Series II: 3 years on the heater and 7 years on the elements. Tungsten Classic: 2 years. Platinum Electric: 3 years; Platinum Marine: 5 years on land. Eclipse: 3 years. Partners in the Bromic Partner Program receive an additional year on qualifying products. To confirm with the Product team: the Classic term (the Series II warranty note lists Classic with Select and Coastal) and which products qualify for the partner year.');
table(s, [['Heater', 'Warranty'], ['Tungsten Select and Coastal', '3 years heater, 7 years elements'], ['Tungsten Classic', '2 years'], ['Platinum Electric', '3 years'], ['Platinum Electric Marine', '5 years on land'], ['Eclipse', '3 years']], { x: M, y: 1.95, w: 7.3, colW: [3.5, 3.8], rowH: 0.58 });
row(s, 'LuShieldCheck', M, 5.65, 7.3, 'Partners: one more year', 'On qualifying products, through the Bromic Partner Program.', { d: 0.7, h: 1.0, style: 'solid' });
card(s, 8.3, 1.95, 4.43, 4.8, HEX.GREY); pic(s, 'dk-Tungsten-Series-II-Select-family-three-finishes', 8.4, 2.05, 4.23, 4.6, 'contain');

s = L.content(C5, 'Handover', 'Hand Over In Five Steps',
  'A good handover takes twenty minutes and earns the next job. Show the wall switch. Put the app on their phone with the zones and schedules set. By the sea, show the wipe-down. Walk them through the warranty. Then ask to photograph the finished job: a heated patio at dusk sells the next one, and as a partner your project can be featured by Bromic. Source: A25 and the pergola guide checklist.');
[['LuToggleRight', 'Show The Wall Switch', 'On, off and where it is.'],
 ['LuSmartphone', 'The App On Their Phone', 'Zones and schedules set.'],
 ['LuDroplets', 'Show The Care', 'By the sea, the wipe-down.'],
 ['LuShieldCheck', 'Walk Through The Warranty', 'What is covered and for how long.'],
 ['LuCamera', 'Photograph The Job', 'With the owner\'s permission.']].forEach(([i, t, d], k) => {
  const x = M + k * 2.47;
  card(s, x, 1.95, 2.25, 4.75, HEX.GREY);
  H1(s, String(k + 1), { x: x + 1.4, y: 2.1, w: 0.65, h: 0.7, fontSize: 36, color: HEX.FLAME, align: 'right' });
  ico(s, i, x + 0.25, 2.3, 0.8, k === 4 ? 'solid' : 'light');
  H1(s, t, { x: x + 0.25, y: 3.5, w: 1.85, h: 1.2, fontSize: 21 });
  T(s, d, { x: x + 0.25, y: 4.8, w: 1.85, h: 1.6, fontSize: 15 });
});

exPanel({ section: C5, n: 5, minutes: 6, icon: 'LuListChecks', title: 'The Commissioning Checklist Race',
  task: 'Twelve cards, rough-in to handover. Put them in order, fastest team wins.',
  steps: ['Teams of three get the twelve cards, shuffled.', 'Lay them in the order you would do them on site.', 'Call time when you are done; we check together.', 'A wrong card costs 30 seconds.'],
  notes: 'How to run it: print the twelve cards for each team, or use the slide and have teams write the letters in order. Debrief, the order: confirm supply voltage for every heater; run one dedicated circuit per channel; choose a dry controller spot in Wi-Fi range; box and cable run to the wall switch; wire the recess fans to an unswitched supply; fit the heater and front; power up and check every zone runs; pair the controller in the app; name the zones with the client; set schedules and timers; show the coastal wipe-down; walk through the warranty. The first four are rough-in, the next three install and test, the last five the handover. Accept small swaps in the handover order if the team can say why.',
  px: 5.85,
  draw: (s, X, Y) => {
    const cards = ['Pair the controller in the app', 'Confirm supply voltage for every heater', 'Wire recess fans to an unswitched supply', 'Name the zones with the client',
      'Run one dedicated circuit per channel', 'Fit the heater and front', 'Choose a dry controller spot in Wi-Fi range', 'Set schedules and timers',
      'Power up; check every zone runs', 'Box and cable run to the wall switch', 'Show the coastal wipe-down', 'Walk through the warranty'];
    cards.forEach((t, i) => {
      const cx = X + 0.15 + (i % 2) * 3.32, cy = Y + 0.15 + Math.floor(i / 2) * 0.67;
      card(s, cx, cy, 3.25, 0.6, HEX.GREY, 'checklist-card');
      T(s, String.fromCharCode(65 + i), { x: cx + 0.1, y: cy, w: 0.3, h: 0.6, fontSize: 14, bold: true, color: HEX.FLAME, valign: 'middle' });
      T(s, t, { x: cx + 0.42, y: cy, w: 2.78, h: 0.6, fontSize: 14, color: HEX.INK, valign: 'middle' });
    });
  } });

L.quiz({ section: C5, n: 'C5', q: 'What Care Does A Heater By The Coast Need?', options: ['A yearly wipe, nothing more', 'Wipe off salt spray, a fortnightly clean, a yearly technician check', 'None – 316 stainless never marks'], answer: 1,
  why: 'Bromic\'s manuals ask for salt spray to be wiped off, a fortnightly clean by the coast and a yearly check by a qualified technician. Source: pergola guide, Built For Salt Air.' });

// ====================================================================== EXAM
const EX = 'Exam';
L.divider({ section: EX, n: 'THE EXAM', title: 'The Certification Exam', icon: 'LuGraduationCap', img: 'w-strx-230222-bromic-dc-1',
  line: '20 questions, one answer each. 16 right answers, 80%, is a pass.',
  notes: 'How to run the exam: hand out answer sheets, or use the Hub form when it is ready. Read each question aloud, allow about a minute each, no notes and no talking. Mark against the answers in the speaker notes; 16 of 20 is a pass. Every question comes from a slide in this deck.' });

const Q = [
  ['Electric Heaters In The US Are Installed To…', ['ANSI Z223.1/NFPA 54', 'NFPA 70, the National Electrical Code, as adopted locally', 'Whatever the homeowner prefers'], 1, 'Electric heaters follow NFPA 70 as the state and city adopt it; NFPA 54 is gas. Module C1.'],
  ['Minimum Height For A Ceiling Mount?', ['72 in', '84 in', '96 in'], 2, 'Wall mounts at least 72 in, ceiling mounts at least 96 in; the manual has the final figure. Module C1.'],
  ['Minimum Space Between Two Tungsten Heaters?', ['12 in', '20 in', '36 in'], 1, 'At least 20 in between heaters. Module C1.'],
  ['Tungsten Heater Top To Ceiling: Keep At Least…', ['6 in', '12 in', '3 ft'], 1, '12 in from the heater top to the ceiling. Module C1.'],
  ['Combustibles Sit How Far From A Tungsten Face?', ['3 ft away', '1 ft away', '6 in away'], 0, 'Combustibles 3 ft from the face. Module C1.'],
  ['Water Rating Of Tungsten Select And Coastal?', ['IPX4', 'IPX5', 'No rating'], 1, 'Series II Select and Coastal are IPX5. Module C1.'],
  ['On A Louvered Pergola, Fix The Heater To…', ['A rotating louvre', 'The louvre motor housing', 'The perimeter beam, a fan beam or a sub-beam'], 2, 'Never to a rotating louvre. Module C1.'],
  ['Who Decides On GFCI And Permits?', ['The local inspector', 'The heater manufacturer', 'The homeowner'], 0, 'GFCI and permit rules vary by jurisdiction: ask the local inspector. Module C1.'],
  ['Series II Low-Clearance Kit: Minimum Cavity?', ['7.1 in (180 mm)', '7.5 in (190.5 mm)', '10 in'], 1, '7.5 in, 190.5 mm. 7.1 in is the Platinum kit. Module C2.'],
  ['The Cut-Out For A 3 Or 6 kW Series II Recess Is…', ['1257 × 255 mm', '1550 × 255 mm', '1550 × 317 mm'], 1, '1550 × 255 mm for 3 and 6 kW; 1257 × 255 mm for 2 and 4 kW; 1550 × 317 mm is Platinum 4500 W. Module C2.'],
  ['Recessed Series II, Face To Floor, At Least…', ['2000 mm (79 in)', '2400 mm (94 in)', '3000 mm (118 in)'], 1, 'At least 2400 mm, 94 in. Module C2.'],
  ['The Recess Kit Fans Are Wired To…', ['The heater\'s own switched circuit', 'A dedicated, unswitched supply under 1 A', 'A spare controller channel'], 1, 'A dedicated, unswitched supply under 1 A, powered at all times. Module C2.'],
  ['The Eclipse Head Hangs At Least How High?', ['7 ft', '8 ft', '10 ft'], 1, 'The Eclipse head sits at least 8 ft above the floor. Module C2.'],
  ['Tungsten Gas With Heat Shield: Space Above?', ['14 in', '3 ft', '8 in'], 0, '3 ft without the shield, 14 in with it. Module C3.'],
  ['Under A Roof With Three Walls, Gas Needs…', ['10% of the walls open', '25% of the total wall area fully open, plus 30% of the rest', 'No open walls'], 1, 'At least 25% of the total wall area fully open, plus 30% of the rest. Module C3.'],
  ['Can A Gas Heater Be Recessed?', ['Yes, with the low-clearance kit', 'Only Platinum Gas', 'No'], 2, 'Gas heaters cannot be recessed. Module C3.'],
  ['One Affinity Dimmer Channel Carries Up To…', ['3 kW', '6 kW at 208–277 V', '10 kW'], 1, '6 kW a channel at 208–277 V. Module C4.'],
  ['Two Eclipse, Heat And Light Separate, Run On…', ['An Affinity On/Off controller', 'The Affinity Eclipse controller, one Eclipse a channel', 'A manual wall switch alone'], 1, 'The Eclipse controller runs one Eclipse a channel, heat and light separately. Module C4.'],
  ['By The Coast, A Heater Needs…', ['A yearly wipe only', 'Salt spray wiped off, a fortnightly clean, a yearly technician check', 'No care'], 1, 'Wipe off salt spray, clean fortnightly by the coast, yearly check by a qualified technician. Module C5.'],
  ['The Warranty On Tungsten Select And Coastal Is…', ['2 years', '3 years heater, 7 years elements', '5 years'], 1, '3 years on the heater and 7 years on the elements. Module C5.'],
];
// spread the right answers across A, B and C (no favourite slot): move each answer to its target position
const SLOT = [0, 2, 1, 0, 2, 1, 2, 0, 1, 2, 0, 2, 1, 0, 2, 1, 0, 2, 0, 1];
Q.forEach(([q, options, answer, why], i) => {
  const right = options[answer], rest = options.filter((_, j) => j !== answer); rest.splice(SLOT[i], 0, right);
  L.quiz({ section: EX, n: `${i + 1} of 20`, q, options: rest, answer: SLOT[i], why: `${why} Pass mark: 16 of 20.` });
});

L.closing({ section: 'Next', title: 'You\'re Certified: What Happens Next', img: 'w-240619-yorba-linda-ca-dc-64',
  points: ['Your Bromic Certified Installer certificate.', 'Join the Bromic Partner Program at bromic.com/lp-builders.', 'Register each project for a free heating design plan.', 'Technical support: 1-800-301-1293, Monday to Friday, 9 am to 4 pm Pacific.'],
  next: 'Proposed programme. A reseller certificate is required to join the Bromic installer program.',
  notes: 'Close the day. Those who passed receive their certificate; those who did not can resit. Next steps: join the Partner Program, register projects for a free design plan, and keep the technical line handy. To confirm with Sales: who issues the certificate and when, whether certified installers are listed by Bromic, the resit policy, renewal, and how certification links to the Partner Program and installer program benefits.' });

await L.finish('Bromic-Certified-Installer-Training');
})().catch((e) => { console.error(e); process.exit(1); });
