// Tungsten Smart-Heat Electric Series II launch playbook, in the Hub's Bromic look.
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const { applyTheme } = require('/root/.claude/skills/synced/2cb8c0ce-acbf-4859-87f0-b5c97456c048_4e8fdbab-129c-40f6-9715-5aa66209287a/pptx/scripts/apply_theme.js');

const D = JSON.parse(fs.readFileSync('/home/user/Bromic_Marketing/data/product-marketing/tungsten-electric-series-ii.json', 'utf8'));
const IMG = (id) => path.join(__dirname, 'img', id + '.jpg');
const LOGO = path.join(__dirname, 'img', 'logo.png'), LOGO_W = path.join(__dirname, 'img', 'logo-white.png');

const sharp = require('sharp');
const React = require('react'); const RDS = require('react-dom/server'); const LU = require('react-icons/lu');
const LIB = '/home/user/Bromic_Marketing/images/library/';
const CACHE = path.join(__dirname, 'img', 'c'); fs.mkdirSync(CACHE, { recursive: true });
const JOBS = [];
// Images are cropped (cover) or letterboxed on white (contain) to the exact frame, so nothing is ever stretched.
function pic(s, id, x, y, w, h, mode = 'cover', objectName) {
  const src = fs.existsSync(LIB + id + '.webp') ? LIB + id + '.webp' : IMG(id);
  const out = path.join(CACHE, `${id}-${Math.round(w * 100)}x${Math.round(h * 100)}-${mode}.jpg`);
  if (!fs.existsSync(out)) JOBS.push(sharp(src).resize({ width: Math.round(w * 220), height: Math.round(h * 220), fit: mode === 'contain' ? 'contain' : 'cover', position: 'attention', background: '#ffffff' }).flatten({ background: '#ffffff' }).jpeg({ quality: 86 }).toFile(out));
  s.addImage({ path: out, x, y, w, h, objectName });
}
const ICONS = {};
async function iconPng(name, color) {
  const key = name + color; if (ICONS[key]) return ICONS[key];
  const svg = RDS.renderToStaticMarkup(React.createElement(LU[name], { color: '#' + color, size: 256, strokeWidth: 1.6 }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return (ICONS[key] = 'image/png;base64,' + buf.toString('base64'));
}
const EXTRA_ICONS = ['LuScale', 'LuStore', 'LuCalendar', 'LuLayers', 'LuMegaphone', 'LuGraduationCap', 'LuMail', 'LuFan', 'LuCable', 'LuMessageCircle', 'LuCircleCheck', 'LuInstagram', 'LuVideo', 'LuFileText', 'LuClapperboard', 'LuSlidersHorizontal'];
async function prep() { const names = new Set([...Object.values(FIELD_ICON), ...Object.values(AUD_ICON), ...Object.values(PILLAR_ICON), ...EXTRA_ICONS]); for (const n of names) for (const c of ['EF4123', 'FFFFFF']) await iconPng(n, c); }
// An icon in a circle: flame line icon on a pale flame disc, or white on flame.
function ico(s, name, x, y, d = 0.62, style = 'light') {
  const fill = style === 'solid' ? 'EF4123' : style === 'dark' ? '231F20' : 'FCE3DC', col = style === 'light' ? 'EF4123' : 'FFFFFF';
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: 'icon-disc' });
  const k = name + col;
  if (!ICONS[k]) throw new Error('icon not prepared: ' + k);
  s.addImage({ data: ICONS[k], x: x + d * 0.22, y: y + d * 0.22, w: d * 0.56, h: d * 0.56, objectName: 'icon-' + name });
}
const FIELD_ICON = { recess: 'LuPanelTopDashed', heat: 'LuFlame', aesthetics: 'LuSparkles', controls: 'LuSmartphone', install_flex: 'LuMove', safety: 'LuShieldCheck', design_flex: 'LuPalette', multi_area: 'LuLayoutGrid', warranty: 'LuBadgeCheck', install_ease: 'LuWrench', support: 'LuBookOpen', coastal: 'LuWaves' };
const AUD_ICON = { RES: 'LuHouse', BLD: 'LuHardHat', INS: 'LuPlug', COM: 'LuUtensils', ARC: 'LuPencilRuler', DES: 'LuPenTool' };
const PILLAR_ICON = { p1: 'LuFlame', p2: 'LuMove', p3: 'LuFan', p4: 'LuWrench', p5: 'LuSparkles', p6: 'LuPalette', p7: 'LuLayoutGrid', p8: 'LuWaves' };

const OUT = process.argv[2] || path.join(__dirname, 'Tungsten-Series-II-Launch-Playbook.pptx');

const THEME = {
  name: 'Bromic', headFontFace: 'Bodoni MT', bodyFontFace: 'Arial',
  colors: { dk1: '231F20', lt1: 'FFFFFF', dk2: '4A4546', lt2: 'F5F5F4', accent1: 'EF4123', accent2: '71777D', accent3: 'FCE3DC', accent4: 'E3E3E1', accent5: 'B22B12', accent6: 'C9C9C6', hlink: 'C7321A', folHlink: '71777D' },
};
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = 'Tungsten Series II launch playbook';
pres.company = 'Bromic Heating';
const C = pres.SchemeColor;
const INK = C.text1, STEEL = C.accent2, FLAME = C.accent1, WASH = C.accent3, LINE = C.accent4, GREY = C.background2, BODY = C.text2;
const W = 13.333, H = 7.5, M = 0.6;

pres.defineSlideMaster({
  title: 'CONTENT', background: { color: C.background1 },
  objects: [
    { image: { path: LOGO, x: M, y: 7.0, w: 0.95, h: 0.3 } },
    { text: { text: 'Tungsten Smart-Heat® Electric Series II  ·  Launch playbook  ·  Draft for internal use', options: { x: 1.75, y: 7.0, w: 8, h: 0.3, fontSize: 9, color: STEEL, valign: 'middle', margin: 0 } } },
    { placeholder: { options: { name: 'kicker', type: 'body', x: M, y: 0.35, w: 9, h: 0.3, fontSize: 10, bold: true, color: FLAME, charSpacing: 3, margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.62, w: 11.2, h: 0.85, fontFace: 'Bodoni MT', fontSize: 30, color: INK, valign: 'top', align: 'left', margin: 0 }, text: '' } },
  ],
  slideNumber: { x: 12.2, y: 7.0, w: 0.5, h: 0.3, fontSize: 9, color: STEEL, align: 'right' },
});
pres.defineSlideMaster({
  title: 'DIVIDER', background: { color: C.text1 },
  objects: [
    { image: { path: LOGO_W, x: M, y: 0.5, w: 1.6, h: 0.5 } },
    { placeholder: { options: { name: 'kicker', type: 'body', x: M, y: 4.2, w: 8, h: 0.4, fontSize: 12, bold: true, color: FLAME, charSpacing: 4, margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: M, y: 4.65, w: 7.2, h: 1.6, fontFace: 'Bodoni MT', fontSize: 44, color: C.background1, valign: 'top', align: 'left', margin: 0 }, text: '' } },
  ],
});

const T = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, fontSize: 14, color: BODY, valign: 'top', ...o });
const card = (s, x, y, w, h, fill = GREY, name) => s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: name });
const kick = (s, k, t) => { s.addText(k.toUpperCase(), { placeholder: 'kicker' }); s.addText(t, { placeholder: 'title' }); };
const dots = (w) => [{ text: '●'.repeat(w), options: { color: FLAME } }, { text: '●'.repeat(3 - w), options: { color: LINE } }];
const WL = { 3: 'Matters most', 2: 'Matters', 1: 'Nice to have' };
const clean = (t) => String(t || '').replace(/\s*\[\[VERIFY[^\]]*\]\]/g, '').trim();
let sec = '';
const slide = (master, section) => { if (section !== sec) { pres.addSection({ title: section }); sec = section; } return pres.addSlide({ masterName: master, sectionTitle: section }); };
const divider = (n, title, img, section, icon) => {
  const s = slide('DIVIDER', section);
  if (icon) ico(s, icon, M, 3.3, 0.7, 'solid');
  pic(s, img, 7.6, 0, W - 7.6, H, 'cover', 'divider-image');
  s.addText(`CHAPTER ${n}`, { placeholder: 'kicker' }); s.addText(title, { placeholder: 'title' });
  return s;
};

const U = D.user_types, B = D.benefits;
const UN = Object.fromEntries(U.map((u) => [u.id, u.name]));
UN.COM = 'Commercial users';

async function build() {
// ---------- cover ----------
{
  pres.addSection({ title: 'Cover' }); sec = 'Cover';
  const s = pres.addSlide({ sectionTitle: 'Cover' });
  s.background = { color: '231F20' };
  pic(s, 'l-006-028', 5.2, 0, W - 5.2, H, 'cover', 'cover-image');
  s.addImage({ path: LOGO_W, x: M, y: 0.55, w: 1.8, h: 0.56 });
  T(s, 'LAUNCH PLAYBOOK', { x: M, y: 3.0, w: 4.4, h: 0.35, fontSize: 12, bold: true, color: FLAME, charSpacing: 4 });
  T(s, 'Tungsten Smart-Heat® Electric Series II', { x: M, y: 3.4, w: 4.4, h: 1.7, fontFace: 'Bodoni MT', fontSize: 36, color: C.background1 });
  T(s, 'Benefits and claims by audience, the case against Series I and Infratech, marketing, training and launch emails.', { x: M, y: 5.2, w: 4.3, h: 1.0, fontSize: 13, color: 'D9D6D2' });
  T(s, 'November 2026  ·  Draft for internal use', { x: M, y: 6.75, w: 4.4, h: 0.3, fontSize: 10, color: 'B9B5B0' });
  s.addNotes('Launch playbook for Tungsten Series II. Select and Coastal launched October 2026; Classic follows January 2027. Every claim in this deck comes from the Product marketing framework in the Content Hub, with its sources and open checks.');
}

// ---------- contents ----------
{
  const s = slide('CONTENT', 'Contents');
  kick(s, 'Contents', 'Five Chapters, One Launch');
  const ch = [['01', 'Benefit Fields And Claims', 'Who we talk to, the twelve benefit fields, and one page per field: the claim for each audience, and how Series II stacks up against Series I and Infratech.', 'l-003-009'],
    ['02', 'Marketing', 'The lead messages, the assets the launch needs, and example ads for homeowners and for the trade.', 'l-006-028'],
    ['03', 'Product Training', 'Modules for dealers, installers, builders, architects and designers, from the range to the recess install.', 'd-tungsten-louvre-detail'],
    ['04', 'Launch Emails', 'Four emails, each in its audience\'s language: architects, builders and installers, dealers, designers.', 'l-005-020'],
    ['05', 'One-Pagers', 'One page for each audience, and one against Infratech, ready to send.', 'd-installers-recessing']];
  ch.forEach(([n, t, d, im], i) => {
    const x = M + i * 2.46, cw = 2.28;
    pic(s, im, x, 1.75, cw, 1.8, 'cover', `contents-img-${n}`);
    ico(s, ['LuLayers', 'LuMegaphone', 'LuGraduationCap', 'LuMail', 'LuFileText'][i], x + cw - 0.5, 3.68, 0.5, 'light');
    T(s, n, { x, y: 3.78, w: 1.0, h: 0.4, fontSize: 12, bold: true, color: FLAME });
    T(s, t, { x, y: 4.25, w: cw, h: 0.8, fontFace: 'Bodoni MT', fontSize: 18, color: INK });
    T(s, d, { x, y: 5.05, w: cw, h: 1.7, fontSize: 11 });
  });
}

// ---------- chapter 1 ----------
const S1 = '1 · Benefit fields and claims';
divider(1, 'Benefit Fields And Claims', 'l-003-009', S1, 'LuLayers');
{
  const s = slide('CONTENT', S1);
  kick(s, 'Who we talk to', 'Six Audiences, Six Different Evenings');
  U.forEach((u, i) => {
    const col = i % 3, row = Math.floor(i / 3), x = M + col * 4.08, y = 1.7 + row * 2.62, w = 3.86, h = 2.45;
    card(s, x, y, w, h, GREY, `aud-${u.id}`);
    ico(s, AUD_ICON[u.id], x + w - 0.8, y + 0.18, 0.56, 'light');
    T(s, UN[u.id], { x: x + 0.25, y: y + 0.18, w: w - 1.15, h: 0.42, fontFace: 'Bodoni MT', fontSize: 19, color: INK });
    T(s, u.who, { x: x + 0.25, y: y + 0.62, w: w - 0.5, h: 0.52, fontSize: 10, color: STEEL });
    const top = B.filter((b) => !b.proposed && D.m1[u.id][b.id] && D.m1[u.id][b.id].w === 3).map((b) => b.name);
    T(s, 'What they care about most', { x: x + 0.25, y: y + 1.18, w: w - 0.5, h: 0.25, fontSize: 9, bold: true, color: FLAME, charSpacing: 2 });
    T(s, top.slice(0, 4).map((t, k) => ({ text: t, options: { bullet: { indent: 12 }, breakLine: k < Math.min(top.length, 4) - 1 } })), { x: x + 0.25, y: y + 1.45, w: w - 0.5, h: 0.95, fontSize: 11.5, color: INK, paraSpaceAfter: 1 });
  });
}
{
  const s = slide('CONTENT', S1);
  kick(s, 'The framework, in order of priority', 'Twelve Benefit Fields');
  B.forEach((b, i) => {
    const col = i % 4, row = Math.floor(i / 4), x = M + col * 3.07, y = 1.7 + row * 1.72, w = 2.88, h = 1.55;
    card(s, x, y, w, h, b.proposed ? 'FFFFFF' : GREY, `field-${b.id}`);
    if (b.proposed) s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: 'FFFFFF' }, line: { color: LINE, width: 1, dashType: 'dash' } });
    T(s, String(i + 1).padStart(2, '0'), { x: x + 0.2, y: y + 0.15, w: 0.6, h: 0.3, fontSize: 11, bold: true, color: FLAME });
    ico(s, FIELD_ICON[b.id], x + w - 0.62, y + 0.12, 0.46, b.proposed ? 'dark' : 'light');
    if (b.proposed) T(s, 'PROPOSED', { x: x + 0.7, y: y + 0.17, w: 1.0, h: 0.25, fontSize: 8, bold: true, color: STEEL, align: 'left', charSpacing: 2 });
    T(s, b.name, { x: x + 0.2, y: y + 0.42, w: w - 0.95, h: 0.55, fontFace: 'Bodoni MT', fontSize: 14, color: INK, valign: 'bottom' });
    T(s, b.what, { x: x + 0.2, y: y + 1.0, w: w - 0.4, h: 0.5, fontSize: 9.5, color: BODY });
  });
}
// one page per field
const SHORT = {
  heat: ['Up to 6 kW of directional infrared warmth, with dual elements on the 4 and 6 kW models dimmed in 1% steps.', 'carried over', 'Same 2–6 kW range and coverage up to 160 ft²; Classic adds 2 and 3 kW.', 'parity', 'Both reach 6 kW. Bromic publishes up to 160 ft² for 6 kW, Infratech about 121 ft²; each measures its own way.'],
  install_flex: ['One heater for every setting: flat or pitched ceiling, wall, cantilevered wall, single post or recessed, tilted up to 45°.', 'improved', 'Adds the single post, a pitched-ceiling adaptor (3/12 to 12/12) and a wall-mount adaptor; tilt up to 45° on every model, 6 kW included.', 'bromic', 'Infratech\'s flush frame is "ONLY to be used on a flat non-sloped ceiling".'],
  install_ease: ['Fewer parts and fewer trades: one post, and a recess box supplied with the kit.', 'improved', 'One post replaces Series I\'s two suspension tubes; nothing to build for a recess.', 'bromic', 'Infratech flush mounting needs a 2×8 pocket lined on five sides with Type X drywall; its drop pole is a pair of rods.'],
  recess: ['Flush heat in shallow ceilings: 6 kW in a 7.5 in cavity, dual fan-ventilated, with the recess box supplied.', 'new', 'Series I recessing needed a deep cavity (Bromic guidance about 20 in) and a site-built box.', 'bromic', 'No low-clearance kit and no fans shown; "a 15 minute cool down period is recommended" after 4 hours of continuous use.'],
  safety: ['Peace of mind all evening: IPX5, a fan-cooled recess, and app control of when the heat runs.', 'improved', 'IPX5 (Series I: IPX4); minimum heights of 72 in wall, 96 in ceiling and 94 in recessed.', 'bromic', 'Infratech is rated IPX4; its Smart Switch app route is on/off with a fixed 2-hour timer.'],
  aesthetics: ['A narrower, lighter heater that floats on one post, in one colour from end to end.', 'improved', 'About 14% narrower and a third lighter; no visible junction box.', 'bromic', 'Infratech\'s colour sits on the end caps and housing; the reflector and wire guard stay stainless in every colour.'],
  design_flex: ['Three finishes and three fronts that change without re-wiring.', 'new', 'Series I had one fascia and two colours.', 'bromic', 'Infratech\'s decorative Motif covers fit surface models only and cannot be used flush.'],
  controls: ['Affinity Smart-Heat® Controls: dimming, zones, schedules and timers from the Bromic app.', 'carried over', 'Same Affinity controls; the Dimmer is now the recommended controller.', 'bromic', 'Infratech dims through a separate control panel and schedules only through home-automation systems.'],
  warranty: ['Three years of manufacturer cover, with a partner extension on qualifying products.', 'improved', '3 years on the heater, up from 2 on Series I; 7 years on the elements, as before.', 'parity', 'Both 3 years. Infratech\'s fourth year comes through its programs; its terms cover replacement parts only and are not transferable.'],
  multi_area: ['The right Bromic heater for every outdoor room: electric or gas, mounted or freestanding.', 'improved', 'More mounts and a coastal model within the Tungsten family.', 'bromic', 'Infratech sells fixed electric heaters only: no gas and no freestanding models.'],
  coastal: ['Built for salt air: a coated, marine-grade build and a 316 stainless recess kit rated IPX5.', 'new', 'Series I was not rated for marine environments.', 'bromic', 'Infratech offers 316 as a paid upgrade, with no protective coating described.'],
  support: ['Design plans, documentation and a Partner Program behind every project.', 'carried over', 'Same support, plus launch literature, photography and training.', 'bromic', 'Free custom design plans, a dedicated contact and project spotlights through the Bromic Partner Program.'],
};
const EDGE = { bromic: ['Bromic stronger', FLAME, 'FFFFFF'], parity: ['Parity', 'E3E3E1', '231F20'], infratech: ['Infratech stronger', '231F20', 'FFFFFF'] };
const CHG = { 'carried over': ['Carried over', 'E3E3E1', '231F20'], improved: ['Improved', 'FCE3DC', 'B22B12'], new: ['New', 'EF4123', 'FFFFFF'] };
const FIELD_IMG = { heat: 'd-tungsten-suspended-restaurant', install_flex: 't2-single-post', install_ease: 'd-installers-recessing', recess: 't2-low-clearance-recess', safety: 'l-021-180', aesthetics: 't2-single-post-black', design_flex: 't2-select-white', controls: 't-009-025', warranty: 'w-045', multi_area: 'l-010-075', coastal: 'l-005-020', support: 'g-electrician' };
const badge = (s, x, y, [t, fill, col]) => { s.addText(t.toUpperCase(), { isTextBox: true, x, y, w: 1.7, h: 0.28, fontSize: 8.5, bold: true, color: col, fill: { color: fill }, align: 'center', valign: 'middle', margin: 0, charSpacing: 1 }); };
B.forEach((b, i) => {
  const s = slide('CONTENT', S1);
  const [ex, chg, s1, edge, inf] = SHORT[b.id];
  kick(s, `Benefit field ${String(i + 1).padStart(2, '0')} of 12, by priority${b.proposed ? '  ·  proposed' : ''}`, b.name);
  ico(s, FIELD_ICON[b.id], 12.0, 0.45, 0.75, 'solid');
  pic(s, FIELD_IMG[b.id], M, 1.65, 4.6, 1.55, 'cover', 'field-image');
  T(s, ex, { x: M, y: 3.35, w: 4.6, h: 0.95, fontSize: 14, color: INK });
  card(s, M, 4.38, 4.6, 1.15, GREY, 'vs-series-i');
  T(s, 'AGAINST SERIES I', { x: M + 0.2, y: 4.5, w: 2.4, h: 0.25, fontSize: 8.5, bold: true, color: STEEL, charSpacing: 2 });
  badge(s, M + 2.7, 4.48, CHG[chg]);
  T(s, s1, { x: M + 0.2, y: 4.82, w: 4.2, h: 0.68, fontSize: 10.5 });
  card(s, M, 5.63, 4.6, 1.2, GREY, 'vs-infratech');
  T(s, 'AGAINST INFRATECH', { x: M + 0.2, y: 5.75, w: 2.4, h: 0.25, fontSize: 8.5, bold: true, color: STEEL, charSpacing: 2 });
  badge(s, M + 2.7, 5.73, EDGE[edge]);
  T(s, inf, { x: M + 0.2, y: 6.07, w: 4.2, h: 0.72, fontSize: 10.5 });
  const rows = [[
    { text: 'Audience', options: { bold: true, fontSize: 9, color: STEEL } }, { text: 'How much it matters', options: { bold: true, fontSize: 9, color: STEEL } }, { text: 'The claim that lands', options: { bold: true, fontSize: 9, color: STEEL } }]];
  for (const u of U) {
    const c = D.m1[u.id][b.id];
    rows.push([{ text: UN[u.id], options: { bold: true, color: INK } },
      { text: [...dots(c.w), { text: '\n' + WL[c.w], options: { color: STEEL, fontSize: 8.5, breakLine: false } }] },
      { text: clean(c.claim), options: { color: INK } }]);
  }
  s.addTable(rows, { x: 5.55, y: 1.65, w: 7.18, colW: [1.45, 1.13, 4.6], fontFace: 'Arial', fontSize: 10, valign: 'middle', border: { type: 'solid', pt: 0.5, color: 'E3E3E1' }, margin: [0.06, 0.08, 0.06, 0.08], rowH: [0.3, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8] });
  s.addNotes(`${b.name}. ${ex} Against Series I: ${s1} Against Infratech: ${inf} Competitive lines need sign-off from Specification and compliance before public use.`);
});

// ---------- chapter 2: marketing ----------
const S2 = '2 · Marketing';
divider(2, 'Marketing', 'd-tungsten-suspended-restaurant', S2, 'LuMegaphone');
{
  const s = slide('CONTENT', S2);
  kick(s, 'What we lead with', 'Eight Messages Carry The Launch');
  D.pillars.forEach((p, i) => {
    const col = i % 4, row = Math.floor(i / 4), x = M + col * 3.07, y = 1.7 + row * 2.6, w = 2.88, h = 2.42;
    card(s, x, y, w, h, i === 2 ? WASH : GREY, `pillar-${p.id}`);
    ico(s, PILLAR_ICON[p.id], x + w - 0.62, y + 0.12, 0.46, i === 2 ? 'solid' : 'light');
    T(s, String(i + 1).padStart(2, '0'), { x: x + 0.2, y: y + 0.15, w: 0.6, h: 0.3, fontSize: 11, bold: true, color: FLAME });
    T(s, p.title, { x: x + 0.2, y: y + 0.42, w: w - 0.95, h: 0.72, fontFace: 'Bodoni MT', fontSize: 14, color: INK });
    T(s, clean(p.line), { x: x + 0.2, y: y + 1.18, w: w - 0.4, h: 1.18, fontSize: 9, color: BODY });
  });
}
{
  const s = slide('CONTENT', S2);
  kick(s, 'One family for every outdoor room', 'The Right Heater For Every Space');
  D.portfolio.forEach((p, i) => {
    const x = M + i * 2.45, w = 2.28;
    pic(s, p.image, x, 1.7, w, 2.6, 'cover', `portfolio-${i}`);
    T(s, p.space.toUpperCase(), { x, y: 4.45, w, h: 0.5, fontSize: 9, bold: true, color: FLAME, charSpacing: 2 });
    T(s, p.product, { x, y: 4.95, w, h: 0.8, fontFace: 'Bodoni MT', fontSize: 16, color: INK });
    T(s, p.why, { x, y: 5.75, w, h: 0.9, fontSize: 11 });
  });
}
{
  const s = slide('CONTENT', S2);
  kick(s, 'Launch kit', 'Assets The Launch Needs');
  ico(s, 'LuClapperboard', 12.0, 0.45, 0.75, 'solid');
  const rows = [['Asset', 'Channel', 'For', 'Claims it carries', 'Owner'].map((t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: '231F20' }, fontSize: 10 } }))];
  for (const a of D.assets_to_create) rows.push([{ text: a.name, options: { bold: true, color: INK } }, a.channel, a.audience, { text: a.claims.map(clean).join(' · ') }, a.owner]);
  s.addTable(rows, { x: M, y: 1.65, w: 12.13, colW: [2.9, 1.9, 1.9, 3.9, 1.53], fontFace: 'Arial', fontSize: 10, color: '4A4546', valign: 'middle', border: { type: 'solid', pt: 0.5, color: 'E3E3E1' }, margin: [0.05, 0.08, 0.05, 0.08] });
}
const adSlide = (seg, title, ads, tone) => {
  const s = slide('CONTENT', S2);
  kick(s, `Instagram  ·  ${seg}`, title);
  ico(s, 'LuInstagram', 12.0, 0.45, 0.75, 'solid');
  T(s, tone, { x: M, y: 1.5, w: 12.1, h: 0.35, fontSize: 12, color: STEEL, italic: true });
  ads.forEach((a, i) => {
    const x = M + i * 4.08, w = 3.86;
    card(s, x, 2.0, w, 4.85, GREY, `ad-${a.id}`);
    pic(s, a.images[0], x + 0.2, 2.2, 1.45, 1.8, 'cover', `ad-img-${a.id}`);
    s.addText(a.cta.toUpperCase(), { isTextBox: true, x: x + 0.2, y: 4.0, w: 1.45, h: 0.28, fontSize: 8.5, bold: true, color: 'FFFFFF', fill: { color: 'EF4123' }, align: 'center', valign: 'middle', margin: 0 });
    T(s, a.format.toUpperCase(), { x: x + 1.82, y: 2.2, w: w - 2.0, h: 0.45, fontSize: 8, bold: true, color: STEEL, charSpacing: 1 });
    T(s, a.headline, { x: x + 1.82, y: 2.62, w: w - 2.0, h: 0.95, fontFace: 'Bodoni MT', fontSize: a.headline.length > 34 ? 12 : 14.5, color: INK });
    T(s, a.primary_text, { x: x + 1.82, y: 3.58, w: w - 2.0, h: 0.75, fontSize: 9 });
    T(s, [{ text: 'Hook  ', options: { bold: true, color: FLAME } }, { text: a.hook }], { x: x + 0.2, y: 4.45, w: w - 0.4, h: 0.75, fontSize: 9.5 });
    T(s, [{ text: 'Claims  ', options: { bold: true, color: FLAME } }, { text: a.claims.map(clean).join(' · ') }], { x: x + 0.2, y: 5.2, w: w - 0.4, h: 0.8, fontSize: 9.5 });
    T(s, [{ text: 'Must carry  ', options: { bold: true, color: STEEL } }, { text: a.mandatory.map(clean).filter(Boolean).join(' ') || 'Controls line.' }], { x: x + 0.2, y: 6.0, w: w - 0.4, h: 0.78, fontSize: 8.5, color: STEEL });
  });
  return s;
};
const AD = Object.fromEntries(D.ad_briefs.map((a) => [a.id, a]));
adSlide('Homeowners', 'The Evening First, Then The Heater', [AD.c1, AD.c3, AD.c4], 'Tone for homeowners: the moment, the view, the people staying out longer. Short lines; no specifications beyond one number.');
adSlide('Homeowners', 'Style, The Coast And Every Outdoor Room', [AD.c2, AD.c5, AD.c6], 'Coastal ads run only in coastal postcodes; every ad carries the Affinity controls line.');
adSlide('Builders and installers', 'Numbers First, Then The Finish', [AD.t1, AD.t2, AD.t3], 'Tone for the trade: the figure up front (6 kW, 7.5 in, one post), then what it saves on site.');
adSlide('Builders and installers', 'The Options Sheet And The Partner Program', [AD.t4, AD.t5, AD.t1], 'No prices in any ad. The Partner Program ad carries the reseller-certificate footnote.');
// Storyboards: four frames each, made with an image model from real Tungsten Series II renders and photos (concepts, not for publication).
const sbSlide = (seg, title, file, meta, must) => {
  const s = slide('CONTENT', S2);
  kick(s, `Storyboard  ·  ${seg}`, title);
  ico(s, 'LuClapperboard', 12.0, 0.45, 0.75, 'solid');
  T(s, meta, { x: M, y: 1.38, w: 11.2, h: 0.3, fontSize: 11, color: STEEL, italic: true });
  s.addImage({ path: path.join(__dirname, 'img', file), x: M, y: 1.72, w: 12.13, h: 12.13 * 890 / 2340, objectName: `sb-${file}` });
  T(s, [{ text: 'Must carry  ', options: { bold: true, color: INK } }, { text: must }], { x: M, y: 6.4, w: 12.13, h: 0.3, fontSize: 9.5, color: '4A4546' });
  T(s, 'Frames generated with AI from Bromic product references, for planning only, not for publication.', { x: M, y: 6.68, w: 12.13, h: 0.25, fontSize: 8.5, color: STEEL });
  return s;
};
sbSlide('Homeowners', 'The Evening First, Then The Heater', 'sb-homeowners.jpg',
  'Reel 9:16 with a 4:5 feed cut  ·  12 seconds  ·  Objective: visits to the Series II page  ·  KPI: landing page views, thumb-stop rate',
  'Wi-Fi and app features need compatible Affinity Smart-Heat® Controls, sold separately. Installation by a licensed electrician, to local code. No prices.');
sbSlide('Architects, builders and installers', '6 kW. 7.5 In Cavity. No Box To Build.', 'sb-specifiers.jpg',
  'Reel 9:16 with a 4:5 feed cut  ·  15 seconds  ·  Objective: spec pack requests  ·  KPI: lead form completions, cost per request',
  'Installation by a licensed electrician, to local code. Controls sold separately. Airflow path in frame 2 to be confirmed by the Product team before production.');
// Four-benefit carousels (cards rendered by decks/build-carousels.py on Bromic's own photography).
for (const c of D.carousels) {
  const s = slide('CONTENT', S2);
  kick(s, `Carousel  ·  ${c.segment}`, c.name);
  ico(s, 'LuInstagram', 12.0, 0.45, 0.75, 'solid');
  T(s, `${c.format}  ·  KPI: ${c.kpi}`, { x: M, y: 1.38, w: 11.2, h: 0.3, fontSize: 11, color: STEEL, italic: true });
  c.cards.forEach((k, i) => {
    const x = M + i * 3.08, w = 2.9, h = w * 1350 / 1080;
    s.addImage({ path: path.join(__dirname, 'carousels', `${c.id}-${i + 1}.jpg`), x, y: 1.8, w, h, objectName: `${c.id}-${i + 1}` });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.8, w, h, fill: { type: 'none' }, line: { color: LINE, width: 0.75 } });
  });
  T(s, [{ text: 'Must carry  ', options: { bold: true, color: INK } }, { text: c.mandatory.join(' ') }], { x: M, y: 5.6 + 0.1, w: 12.13, h: 0.5, fontSize: 10, color: '4A4546' });
  T(s, 'Cards use Bromic photography and renders. Copy follows the benefit fields: power, recess, design, controls.', { x: M, y: 6.25, w: 12.13, h: 0.3, fontSize: 9, color: STEEL });
}

// ---------- chapter 3: training ----------
const S3 = '3 · Product training';
divider(3, 'Product Training', 'd-tungsten-pole-rooftop-bar', S3, 'LuGraduationCap');
{
  const s = slide('CONTENT', S3);
  kick(s, 'Training plan', 'Who Learns What, And How');
  ico(s, 'LuGraduationCap', 12.0, 0.45, 0.75, 'solid');
  const rows = [['Audience', 'Modules', 'Format', 'Time', 'Outcome'].map((t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: '231F20' }, fontSize: 10.5 } })),
    [{ text: 'Dealers and showroom staff', options: { bold: true } }, '1 Range · 5 Controls · 6 Selling and objections', 'Live session, then on-demand video', '60 min', 'Recommend the right tier and controls for every customer'],
    [{ text: 'Installers and electricians', options: { bold: true } }, '1 Range · 2 Mounting · 3 Low-clearance recess · 4 Electrical · 5 Controls', 'Hands-on with a demo rig; install video', '2 hours', 'Fit and commission Series II first time, recessed or surface'],
    [{ text: 'Builders and remodelers', options: { bold: true } }, '1 Range · 3 Recess planning · 6 Selling the options sheet', 'Site visit or webinar', '45 min', 'Put Series II on the plan and the options sheet'],
    [{ text: 'Architects and specifiers', options: { bold: true } }, '1 Range · 2 Mounting · 3 Recess detailing · Specification', 'Lunch-and-learn (AIA-accredited where offered)', '60 min', 'Detail and specify Series II correctly'],
    [{ text: 'Interior and landscape designers', options: { bold: true } }, '1 Range · Finishes and fronts · 5 Controls · Portfolio by space', 'Studio session with samples', '45 min', 'Choose finish, front and placement for each room'],
    [{ text: 'Bromic sales and reps', options: { bold: true } }, 'All modules, plus the three matrices and claim checks', 'Workshop', 'Half day', 'Tell the right story to each audience, within approved claims']];
  s.addTable(rows, { x: M, y: 1.65, w: 12.13, colW: [2.3, 3.4, 2.45, 0.9, 3.08], fontFace: 'Arial', fontSize: 10.5, color: '4A4546', valign: 'middle', border: { type: 'solid', pt: 0.5, color: 'E3E3E1' }, margin: [0.07, 0.09, 0.07, 0.09] });
}
{
  const s = slide('CONTENT', S3);
  kick(s, 'Module 1', 'Know The Range: Good, Better, Best');
  ico(s, 'LuLayers', 12.0, 0.45, 0.75, 'solid');
  D.tiers.forEach((t, i) => {
    const x = M + i * 4.08, w = 3.86;
    card(s, x, 1.7, w, 5.1, GREY, `tier-${t.id}`);
    pic(s, t.image, x + 0.2, 1.95, w - 0.4, 1.1, 'contain', `tier-img-${t.id}`);
    T(s, t.tier.toUpperCase(), { x: x + 0.25, y: 3.2, w: w - 0.5, h: 0.3, fontSize: 10, bold: true, color: FLAME, charSpacing: 3 });
    T(s, t.name, { x: x + 0.25, y: 3.5, w: w - 0.5, h: 0.5, fontFace: 'Bodoni MT', fontSize: 22, color: INK });
    T(s, `Wins on ${t.win_on.toLowerCase()}`, { x: x + 0.25, y: 4.0, w: w - 0.5, h: 0.3, fontSize: 11, color: FLAME });
    T(s, [{ text: 'Colours  ', options: { bold: true } }, { text: t.colours, options: { breakLine: true } }, { text: 'Front  ', options: { bold: true } }, { text: t.fascia, options: { breakLine: true } }, { text: 'Recessing  ', options: { bold: true } }, { text: t.recessing, options: { breakLine: true } }, ...t.notes.map((n, k) => ({ text: clean(n), options: { bullet: { indent: 10 }, breakLine: k < t.notes.length - 1 } }))], { x: x + 0.25, y: 4.4, w: w - 0.5, h: 2.3, fontSize: 10.5, paraSpaceAfter: 3 });
  });
  s.addNotes('Select and Coastal launched October 2026; Classic launches January 2027 when Series I has sold through. Cobalt is discontinued. Prices are not part of training slides for the trade.');
}
{
  const s = slide('CONTENT', S3);
  kick(s, 'Module 2', 'Mounting Options And Their Limits');
  ico(s, 'LuMove', 12.0, 0.45, 0.75, 'solid');
  const items = [['Ceiling', 'On its bracket or the single post; 96 in minimum (cETL: never below 96 in).'], ['Pitched ceiling', 'With the pitched-ceiling adaptor, 3/12 to 12/12 (launch deck), in line with the pitch or across it.'],
    ['Wall', 'Bracket at 71–72 in minimum; the cantilevered wall-mount adaptor reaches out from the wall.'], ['Tilt', 'Up to 45° on every model, 6 kW included, on the wall or the ceiling, and re-angled later.'],
    ['Single post', '5 in post for 2 and 3 kW, 9 in for 4 and 6 kW; straight or angled.'], ['Recessed', 'Low-clearance kit in a 7.5 in cavity, 94 in above the floor; see Module 3.']];
  items.forEach(([h, t], i) => {
    const col = i % 2, row = Math.floor(i / 2), x = M + 4.9 + col * 3.65, y = 1.7 + row * 1.7, w = 3.45;
    card(s, x, y, w, 1.55, GREY, `mount-${i}`);
    T(s, h, { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.4, fontFace: 'Bodoni MT', fontSize: 16, color: INK });
    T(s, t, { x: x + 0.2, y: y + 0.6, w: w - 0.4, h: 0.9, fontSize: 10.5 });
  });
  pic(s, 't2-single-post', M, 1.7, 4.6, 3.2, 'contain', 'mount-img');
  T(s, 'Mount the elements horizontal. Keep 19.7 in between heaters and from walls when recessed, and the clearances in the installation manual for every other condition.', { x: M, y: 5.2, w: 4.6, h: 1.4, fontSize: 12, color: INK });
  s.addNotes('Source: Tungsten Smart-Heat Electric Select & Coastal installation manual (2026) and the LC recess kit instructions. The pitch range of the adaptor comes from the launch deck; confirm with the Product team before printing.');
}
{
  const s = slide('CONTENT', S3);
  kick(s, 'Module 3', 'Installing The Low-Clearance Recess Kit');
  ico(s, 'LuFan', 12.0, 0.45, 0.75, 'solid');
  pic(s, 't2-low-clearance-recess', M, 1.7, 4.6, 3.05, 'contain', 'recess-img');
  card(s, M, 4.95, 4.6, 1.85, WASH, 'recess-key');
  T(s, [{ text: '7.5 in', options: { fontFace: 'Bodoni MT', fontSize: 40, color: 'B22B12', breakLine: true } }, { text: 'minimum cavity depth (190.5 mm). The kit brings its own recess box: nothing to build on site.', options: { fontSize: 12, color: '231F20' } }], { x: M + 0.25, y: 5.05, w: 4.1, h: 1.7 });
  const steps = ['Check the cavity: at least 7.5 in deep, flat or sloping no more than 1/4 in per inch; the structure must carry the kit (52 or 61 lb).', 'Cut the opening 19.7 in or more from the nearest wall and other heaters, with the heater face at least 94 in above the floor.',
    'Fix the recess box with the supplied fasteners; place the control box at the lowest end on a slope.', 'Wire the integrated cooling fans to a dedicated, unswitched supply under 1 A: the fans stay powered at all times.',
    'Wire the heater circuit through the Affinity controller; never cover the kit with insulation.', 'Fit the heater and front, power up, and commission the controls (Module 5).'];
  steps.forEach((t, i) => {
    const y = 1.7 + i * 0.85;
    s.addShape(pres.shapes.OVAL, { x: 5.55, y, w: 0.5, h: 0.5, fill: { color: 'EF4123' }, line: { color: 'EF4123' }, objectName: `step-${i}` });
    T(s, String(i + 1), { x: 5.55, y, w: 0.5, h: 0.5, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    T(s, t, { x: 6.25, y: y - 0.02, w: 6.45, h: 0.8, fontSize: 12, color: INK });
  });
  s.addNotes('From the LC Ceiling Recess Kit instructions for Tungsten Series II. Coastal kits are powder-coated 316 stainless, IPX5, and must not be installed on boats. Still to confirm with the Product team: the number of fans and whether any fire-rated lining is required by code.');
}
{
  const s = slide('CONTENT', S3);
  kick(s, 'Modules 4 and 5', 'Wire It Right, Then Hand Over The App');
  ico(s, 'LuCable', 12.0, 0.45, 0.75, 'solid');
  const L = [['Circuits', 'Dedicated circuits sized from the manual: 6 kW draws 25 A at 240 V, 28.8 A at 208 V and 21.7 A at 277 V. The 2 kW model is 240 V only; Coastal is 208 and 240 V.'],
    ['Dual elements', 'The 4 and 6 kW models have two elements, wired separately so one heater can run at part or full output.'],
    ['Controller', 'The Affinity Smart-Heat® Dimmer is the recommended controller: 6 kW a channel at 208–277 V, dimming in 1% steps.'],
    ['Commissioning', 'Pair the controller in the Bromic app, name the zones, set schedules and timers with the client, and add Alexa or Google if they use them.']];
  L.forEach(([h, t], i) => {
    const y = 1.65 + i * 1.2;
    card(s, M, y, 7.4, 1.08, GREY, `elec-${i}`);
    T(s, h, { x: M + 0.25, y: y + 0.15, w: 1.9, h: 0.8, fontFace: 'Bodoni MT', fontSize: 16, color: INK });
    T(s, t, { x: M + 2.2, y: y + 0.15, w: 5.0, h: 0.85, fontSize: 11.5 });
  });
  pic(s, 't-009-025', 8.3, 1.65, 4.43, 5.2, 'cover', 'app-img');
  T(s, 'Wi-Fi and app features need compatible Affinity Smart-Heat® Controls, sold separately. Installation by a licensed electrician, to local code.', { x: M, y: 6.48, w: 7.4, h: 0.4, fontSize: 9, color: STEEL });
}
{
  const s = slide('CONTENT', S3);
  kick(s, 'Module 6', 'Selling Series II: What To Say When You Hear');
  ico(s, 'LuMessageCircle', 12.0, 0.45, 0.75, 'solid');
  const Q = [['"Infratech recesses too."', 'It does, in a framed 2×8 pocket lined on five sides with fire-rated drywall, on flat ceilings only. Series II recesses 6 kW in a 7.5 in cavity with the box supplied and dual fan ventilation.'],
    ['"Can I run it all evening?"', 'The recess kit is fan-cooled, and the Bromic app lets you schedule the heat and switch it off from anywhere.'],
    ['"Infratech comes in colours."', 'Its colour is on the end caps and housing; the reflector and guard stay stainless. Series II is black, white or graphite end to end, front included.'],
    ['"My ceiling is pitched."', 'The pitched-ceiling adaptor mounts Series II on 3/12 to 12/12 pitches; recessing suits flat or gently sloping ceilings.'],
    ['"Is it right for the coast?"', 'Tungsten Coastal has a corrosion-resistant coating over a marine-grade build, and a powder-coated 316 recess kit rated IPX5.'],
    ['"Why not Series I?"', 'Series II is about 14% narrower, a third lighter, IPX5 instead of IPX4, and hangs from one post instead of two.']];
  Q.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2), x = M + col * 6.13, y = 1.7 + row * 1.7, w = 5.95;
    card(s, x, y, w, 1.55, GREY, `obj-${i}`);
    T(s, q, { x: x + 0.25, y: y + 0.15, w: w - 0.5, h: 0.38, fontFace: 'Bodoni MT', fontSize: 15, color: FLAME, italic: true });
    T(s, a, { x: x + 0.25, y: y + 0.55, w: w - 0.5, h: 0.95, fontSize: 11 });
  });
  s.addNotes('Competitive answers are for conversations, not print, until Specification and compliance signs off. Never disparage a competitor: state the facts and let them speak.');
}
{
  const s = slide('CONTENT', S3);
  kick(s, 'Knowledge check', 'Five Questions Before Anyone Sells Or Installs');
  ico(s, 'LuCircleCheck', 12.0, 0.45, 0.75, 'solid');
  const Q = [['What is the minimum cavity for the low-clearance recess kit?', '7.5 in (190.5 mm).'], ['How far can a 6 kW heater tilt?', 'Up to 45°, like every Series II model.'],
    ['What supply do the recess kit fans need?', 'A dedicated, unswitched supply under 1 A, powered at all times.'], ['Which controller do we recommend for electric heaters?', 'The Affinity Smart-Heat® Dimmer.'],
    ['Which tier suits a waterfront terrace?', 'Tungsten Coastal, with the marine-grade recess kit where recessed. Never on boats.']];
  Q.forEach(([q, a], i) => {
    const y = 1.7 + i * 1.02;
    T(s, String(i + 1).padStart(2, '0'), { x: M, y, w: 0.7, h: 0.6, fontFace: 'Bodoni MT', fontSize: 26, color: FLAME });
    T(s, q, { x: M + 0.8, y: y + 0.05, w: 6.2, h: 0.8, fontSize: 15, color: INK, bold: true });
    card(s, M + 7.2, y, 4.93, 0.85, GREY, `ans-${i}`);
    T(s, a, { x: M + 7.4, y: y + 0.12, w: 4.6, h: 0.65, fontSize: 12.5, valign: 'middle' });
  });
}

// ---------- chapter 4: launch emails ----------
const S4 = '4 · Launch emails';
divider(4, 'Launch Emails', 'l-007-041', S4, 'LuMail');
{
  const s = slide('CONTENT', S4);
  kick(s, 'Email plan', 'Four Emails, Four Voices');
  ico(s, 'LuMail', 12.0, 0.45, 0.75, 'solid');
  const rows = [['Audience', 'Send', 'Goal', 'Attach or link', 'Call to action'].map((t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: '231F20' }, fontSize: 10.5 } })),
    [{ text: 'Registered architects', options: { bold: true } }, 'Launch week, Tuesday', 'Get Series II into specifications', 'Spec sheet, Section 23 83 33 update, Revit files', 'Request the specification pack'],
    [{ text: 'Builders and installers', options: { bold: true } }, 'Launch week, Wednesday', 'Win recessed and pergola jobs', 'Trade sell sheet, recess install video', 'Join the Bromic Partner Program'],
    [{ text: 'Dealers', options: { bold: true } }, 'Before launch, then launch day', 'Stock, display and sell Series II', 'Sell sheet, training booking, ad kit', 'Book your team\'s training'],
    [{ text: 'Designers', options: { bold: true } }, 'Launch week, Thursday', 'Choose Series II for considered outdoor rooms', 'Finish and front swatches, lookbook pages', 'Request a finish sample']];
  s.addTable(rows, { x: M, y: 1.65, w: 12.13, colW: [2.4, 2.0, 2.9, 2.9, 1.93], fontFace: 'Arial', fontSize: 11, color: '4A4546', valign: 'middle', border: { type: 'solid', pt: 0.5, color: 'E3E3E1' }, margin: [0.08, 0.1, 0.08, 0.1] });
  T(s, 'Every email: one call to action, the controls line where a heater is recommended, no prices, and competitive lines only after sign-off.', { x: M, y: 5.6, w: 12.1, h: 0.5, fontSize: 12, color: STEEL, italic: true });
}
const emailSlide = (aud, subj, pre, intro, points, close, cta, assets, img, notes) => {
  const s = slide('CONTENT', S4);
  kick(s, `Launch email  ·  ${aud}`, subj);
  ico(s, 'LuMail', 12.0, 0.45, 0.75, 'solid');
  card(s, M, 1.65, 7.75, 5.15, GREY, 'email-card');
  T(s, [{ text: 'Subject  ', options: { bold: true, color: FLAME } }, { text: subj, options: { bold: true, breakLine: true } }, { text: 'Preview  ', options: { bold: true, color: FLAME } }, { text: pre }], { x: M + 0.3, y: 1.8, w: 7.15, h: 0.62, fontSize: 11.5, color: INK });
  T(s, intro, { x: M + 0.3, y: 2.5, w: 7.15, h: 0.6, fontSize: 13, color: INK });
  const runs = [];
  points.forEach(([lead, rest], k) => { runs.push({ text: lead + ' ', options: { bold: true, color: INK, bullet: { indent: 14 } } }); runs.push({ text: rest, options: { color: BODY, breakLine: k < points.length - 1 } }); });
  T(s, runs, { x: M + 0.3, y: 3.15, w: 7.15, h: 2.3, fontSize: 12.5, paraSpaceAfter: 7 });
  T(s, close, { x: M + 0.3, y: 5.5, w: 7.15, h: 0.65, fontSize: 11, color: STEEL });
  s.addText(cta.toUpperCase(), { isTextBox: true, x: M + 0.3, y: 6.25, w: 3.6, h: 0.4, fontSize: 10.5, bold: true, color: 'FFFFFF', fill: { color: 'EF4123' }, align: 'center', valign: 'middle', margin: 0, charSpacing: 1 });
  pic(s, img, 8.6, 1.65, 4.13, 2.6, 'cover', 'email-img');
  T(s, 'ASSETS', { x: 8.6, y: 4.45, w: 4.1, h: 0.3, fontSize: 9, bold: true, color: STEEL, charSpacing: 2 });
  T(s, assets.map((a, k) => ({ text: a, options: { bullet: { indent: 10 }, breakLine: k < assets.length - 1 } })), { x: 8.6, y: 4.78, w: 4.1, h: 2.0, fontSize: 11, color: INK, paraSpaceAfter: 3 });
  if (notes) s.addNotes(notes);
};
emailSlide('Registered architects', 'Specify 6 kW Of Flush Heat In A 7.5 In Ceiling',
  'Tungsten Series II: low-clearance recessing, three finishes, one specification family.',
  'Give your outdoor rooms heat that disappears into the ceiling.',
  [['6 kW recessed in a 7.5 in cavity.', 'A dual fan-ventilated low-clearance kit that supplies its own recess box.'],
    ['Every mounting condition.', 'Flat or pitched ceilings (3/12 to 12/12), walls, a single post, tilt up to 45°.'],
    ['Specified to last.', 'IPX5, three years of cover, and Tungsten Coastal for waterfront sites.'],
    ['Black, white or graphite.', 'With a Diamond, oval or triangle front.']],
  'Affinity Smart-Heat® Controls integrate with BMS and home automation; Wi-Fi and app features need compatible Affinity controls, sold separately.',
  'Request the specification pack', ['Series II spec sheet', 'Section 23 83 33 update', 'Revit and CAD files', 'Low-clearance recess detail', 'Recess airflow animation', 'AIA-accredited course invitation'], 'l-010-075',
  'Precise and technical; numbers lead. Revit files and the airflow animation must be live on launch day.');
emailSlide('Builders and installers', 'No Box To Build: 6 kW Recessed In A 7.5 In Cavity',
  'Tungsten Series II goes up faster: one post, one kit, nothing to frame.',
  'Your buyers want the evening outside. Series II gets you there faster.',
  [['No box to build.', 'Recess 6 kW in a 7.5 in cavity; the kit brings its own box and is dual fan-ventilated.'],
    ['One post, not two.', 'A single post replaces two suspension tubes on pergolas and porches.'],
    ['Any ceiling.', 'Pitched-ceiling adaptor for 3/12 to 12/12; tilt up to 45°.'],
    ['Good, Better, Best.', 'Classic, Select and Coastal for your options sheet, each with Affinity Smart-Heat® Controls.']],
  'Join the Bromic Partner Program: partner pricing, free design plans, an extended warranty and a dedicated contact.* Installation by a licensed electrician, to local code. *A reseller certificate is required to join the Bromic installer program.',
  'Join the Bromic Partner Program', ['Trade sell sheet', 'Recess install video (90 s)', 'Recess airflow animation', 'Options-sheet artwork', 'Installation manuals', 'Partner Program sign-up'], 'd-installers-recessing',
  'Direct and practical: what it saves on site. The reseller-certificate footnote is mandatory.');
emailSlide('Dealers', 'Tungsten Series II Is Here: Stock It, Show It, Sell It',
  'Three tiers, a new recess kit and a launch kit for your showroom.',
  'More reasons for your customers to say yes, and an easier story for your team.',
  [['Three tiers.', 'Classic for style and value, Select for performance and recessing, Coastal for life by the water.'],
    ['Slimmer, lighter, tougher.', 'About 14% narrower, a third lighter, rated IPX5, with three years of cover.'],
    ['New jobs to quote.', 'The low-clearance recess kit opens shallow ceilings you could not quote before.'],
    ['Smart from day one.', 'Dimming, schedules and timers in the Bromic app (compatible Affinity controls sold separately).']],
  'Book a 60-minute session for your team, and download the showroom and social kit.',
  'Book your team\'s training', ['Sell sheet and range card', 'Training booking link', 'Instagram and social ad kit', 'Showroom display guide', 'Launch photography'], 'l-006-028',
  'Commercial and upbeat; no prices in the email.');
emailSlide('Designers', 'Heat That Belongs In The Design',
  'All black, all white or all graphite, with a front you choose.',
  'The best outdoor rooms feel finished to the ceiling. Now the heater can, too.',
  [['One finish, end to end.', 'Black, white or graphite, the front included.'],
    ['A front for every mood.', 'Diamond, oval or triangle, swapped without re-wiring.'],
    ['Seemingly floating.', 'About 14% narrower, on a single post with no junction box in sight.'],
    ['A heater for every room.', 'Platinum for the California room, Eclipse for the lounge, Tungsten for the pergola.']],
  'Request a finish and front sample; we will send swatches with lookbook pages for your next presentation.',
  'Request a finish sample', ['Finish and front swatches', 'Lookbook pages', 'Portfolio by space', 'Product renders for mood boards'], 't2-select-white',
  'Visual and sensory; nothing technical beyond what shapes the look.');

// ---------- chapter 5: one-pagers ----------
const S5 = '5 · One-pagers';
divider(5, 'One-Pagers', 'd-installers-recessing', S5, 'LuFileText');
const onePager = (aud, title, intro, points, cta, foot, img, icon) => {
  const s = slide('CONTENT', S5);
  kick(s, `One-pager  ·  ${aud}`, title);
  ico(s, icon, 12.0, 0.45, 0.75, 'solid');
  pic(s, img, M, 1.65, 4.3, 5.15, 'cover', 'op-image');
  T(s, intro, { x: 5.2, y: 1.65, w: 7.5, h: 0.75, fontFace: 'Bodoni MT', fontSize: 18, color: INK });
  points.forEach(([ic, lead, rest], i) => {
    const col = i % 2, row = Math.floor(i / 2), x = 5.2 + col * 3.83, y = 2.55 + row * 1.68, w = 3.65, h = 1.55;
    card(s, x, y, w, h, GREY, `op-pt-${i}`);
    ico(s, ic, x + 0.18, y + 0.18, 0.5, 'light');
    T(s, lead, { x: x + 0.82, y: y + 0.2, w: w - 1.0, h: 0.45, fontSize: 12.5, bold: true, color: INK, valign: 'middle' });
    T(s, rest, { x: x + 0.82, y: y + 0.68, w: w - 1.0, h: 0.82, fontSize: 10.5, color: BODY });
  });
  s.addText(cta.toUpperCase(), { isTextBox: true, x: 5.2, y: 6.0, w: 3.3, h: 0.4, fontSize: 10, bold: true, color: 'FFFFFF', fill: { color: 'EF4123' }, align: 'center', valign: 'middle', margin: 0, charSpacing: 1 });
  T(s, foot, { x: 8.7, y: 5.95, w: 4.03, h: 0.85, fontSize: 8.5, color: STEEL });
  return s;
};
{
  const s = slide('CONTENT', S5);
  kick(s, 'One-pager  ·  Against Infratech', 'Where Tungsten Series II Leads');
  ico(s, 'LuScale', 12.0, 0.45, 0.75, 'solid');
  const lead = B.filter((b) => SHORT[b.id][3] === 'bromic').slice(0, 7);
  const rows = [['Benefit field', 'Tungsten Series II', 'Infratech'].map((t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: '231F20' }, fontSize: 10 } }))];
  for (const b of lead) rows.push([{ text: b.name, options: { bold: true, color: INK } }, { text: SHORT[b.id][0], options: { color: INK } }, { text: SHORT[b.id][4], options: { color: '4A4546' } }]);
  s.addTable(rows, { x: M, y: 1.6, w: 12.13, colW: [2.2, 4.9, 5.03], fontFace: 'Arial', fontSize: 11, rowH: [0.35, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62], valign: 'middle', border: { type: 'solid', pt: 0.5, color: 'E3E3E1' }, margin: [0.05, 0.08, 0.05, 0.08] });
  T(s, [{ text: 'Parity  ', options: { bold: true, color: INK } }, { text: 'Heat output (both reach 6 kW) and warranty (both 3 years).  ' }, { text: 'Use  ', options: { bold: true, color: INK } }, { text: 'factual and sourced only; never disparage. Every line needs Specification and compliance sign-off before it leaves Bromic.' }], { x: M, y: 6.45, w: 12.13, h: 0.4, fontSize: 9.5, color: '4A4546' });
}
onePager('Builders and installers', 'Faster On Site, Easier To Sell',
  'Tungsten Series II goes up faster and gives your buyers the evening outside.',
  [['LuPanelTopDashed', 'No box to build', 'Recess 6 kW in a 7.5 in cavity; the dual fan-ventilated kit brings its own box.'],
    ['LuMove', 'One post, any ceiling', 'A single post replaces two tubes; pitched ceilings 3/12 to 12/12; tilt to 45°.'],
    ['LuLayers', 'Good, Better, Best', 'Classic, Select and Coastal for your options sheet.'],
    ['LuSlidersHorizontal', 'Controls in the quote', 'Every heater with Affinity Smart-Heat® Controls; the Dimmer is the default.']],
  'Join the Partner Program', 'Installation by a licensed electrician, to local code. *A reseller certificate is required to join the Bromic installer program.', 'd-installers-recessing', 'LuHardHat');
onePager('Architects and specifiers', 'Specify Flush Heat In Shallow Ceilings',
  'One specification family for every outdoor room, with heat that disappears into the ceiling.',
  [['LuPanelTopDashed', '6 kW in a 7.5 in cavity', 'Dual fan-ventilated low-clearance recessing, with the recess box supplied.'],
    ['LuMove', 'Every mounting condition', 'Flat or pitched ceilings, walls, a single post, recessed; tilt up to 45°.'],
    ['LuShieldCheck', 'Specified to last', 'IPX5, three years of cover, and Tungsten Coastal for waterfront sites.'],
    ['LuCable', 'Building systems', 'Affinity Smart-Heat® Controls with Ethernet and 0–10 V for BMS and home automation.']],
  'Request the spec pack', 'Spec sheet, Section 23 83 33 update, Revit and CAD files. Controls sold separately.', 'l-010-075', 'LuPencilRuler');
onePager('Homeowners', 'Extend The Moment',
  'Power-packed heat that recesses worry-free, in a finish that suits your outdoor style.',
  [['LuFlame', 'Power-packed heat', 'Up to 6 kW from dual elements, dimmed to the evening.'],
    ['LuPanelTopDashed', 'Recessed, worry-free', 'Flush in a shallow ceiling and dual fan-ventilated.'],
    ['LuPalette', 'Your outdoor persona', 'All black, all white or all graphite, with a Diamond, oval or triangle front.'],
    ['LuSmartphone', 'Smart controls, smart home', 'Schedules and timers in the Bromic app; Alexa and Google Assistant.']],
  'Find a dealer', 'Wi-Fi, app and voice features need compatible Affinity Smart-Heat® Controls, sold separately. Installation by a licensed electrician.', 'l-006-028', 'LuHouse');
onePager('Dealers', 'Three Tiers, One Easy Story',
  'More reasons for customers to say yes, and new jobs your team could not quote before.',
  [['LuLayers', 'Three tiers', 'Classic for style and value, Select for performance and recessing, Coastal by the water.'],
    ['LuSparkles', 'Slimmer, lighter, tougher', 'About 14% narrower, a third lighter, IPX5, three years of cover.'],
    ['LuPanelTopDashed', 'New jobs to quote', 'The low-clearance kit opens shallow ceilings.'],
    ['LuSmartphone', 'Smart from day one', 'Dimming, schedules and timers with Affinity Smart-Heat® Controls.']],
  'Book your team\'s training', 'Sell sheet, showroom display guide, Instagram kit. No prices on customer-facing material.', 'l-007-041', 'LuStore');
onePager('Designers', 'Heat That Belongs In The Design',
  'The best outdoor rooms feel finished to the ceiling. Now the heater can, too.',
  [['LuPalette', 'One finish, end to end', 'Black, white or graphite, the front included.'],
    ['LuSparkles', 'A front for every mood', 'Diamond, oval or triangle, swapped without re-wiring.'],
    ['LuMove', 'Seemingly floating', 'About 14% narrower, on one post, no junction box in sight.'],
    ['LuLayoutGrid', 'A heater for every room', 'Platinum for the California room, Eclipse for the lounge, Tungsten for the pergola.']],
  'Request a finish sample', 'Graphite on 4 and 6 kW Tungsten Select. Controls sold separately.', 'l-005-020', 'LuPenTool');
onePager('Commercial users', 'More Comfortable Covers, Every Season',
  'Heat zoned table by table, built for daily service and the coast.',
  [['LuFlame', 'Up to 6 kW a heater', 'Dual elements, dimmed zone by zone through the night.'],
    ['LuLayoutGrid', 'Zones and schedules', 'Affinity Smart-Heat® Controls, with BMS integration when you need it.'],
    ['LuWaves', 'Built for the waterfront', 'Tungsten Coastal: 316 marine-grade stainless and a protective coating.'],
    ['LuPanelTopDashed', 'Clean ceilings', 'Flush, dual fan-ventilated recessing in shallow soffits.']],
  'Talk to our commercial team', 'Installation by a licensed electrician, to local code. Controls sold separately.', 'd-tungsten-pole-rooftop-bar', 'LuUtensils');

// ---------- close: high-level asks ----------
{
  const s = slide('CONTENT', 'Next steps');
  kick(s, 'Next steps', 'Clear Asks, Clear Owners');
  card(s, M, 1.55, 12.13, 0.62, WASH, 'suggestion');
  T(s, [{ text: 'This playbook is a suggestion.  ', options: { bold: true, color: INK } }, { text: 'A starting point for the team to test, change and own; every claim stays open until it is validated.' }], { x: M + 0.25, y: 1.6, w: 11.6, h: 0.52, fontSize: 13, color: INK, valign: 'middle' });
  const col = (x, name, role, icon, asks) => {
    card(s, x, 2.4, 5.95, 4.4, GREY, 'asks-' + icon);
    ico(s, icon, x + 0.3, 2.65, 0.7, 'solid');
    T(s, name, { x: x + 1.2, y: 2.62, w: 4.5, h: 0.42, fontFace: 'Bodoni MT', fontSize: 22, color: INK });
    T(s, role.toUpperCase(), { x: x + 1.2, y: 3.06, w: 4.5, h: 0.3, fontSize: 9, bold: true, color: FLAME, charSpacing: 2 });
    asks.forEach(([ic, a], k) => {
      const y = 3.65 + k * 0.76;
      ico(s, ic, x + 0.35, y, 0.5, 'light');
      T(s, a, { x: x + 1.05, y: y + 0.02, w: 4.7, h: 0.48, fontSize: 14, color: INK, valign: 'middle' });
    });
  };
  col(M, 'Mike Clifford', 'Product and channel management', 'LuSlidersHorizontal', [
    ['LuCircleCheck', 'Validate the claims against the twelve benefit fields'],
    ['LuGraduationCap', 'Create the training modules'],
    ['LuFileText', 'Create the one-pagers'],
    ['LuCalendar', 'Set channel dates: Series I sell-through, Classic in January'],
  ]);
  col(M + 6.18, 'Megan Spies', 'Brand marketing', 'LuMegaphone', [
    ['LuClapperboard', `Create the ${D.assets_to_create.length} launch assets, the airflow animation first`],
    ['LuInstagram', 'Create the two four-benefit carousels'],
    ['LuVideo', 'Produce the two storyboard Reels'],
    ['LuMail', 'Send the four launch emails'],
  ]);
  s.addNotes('Detailed open checks behind these asks live in the Content Hub (Product marketing, claim checks and VERIFY notes): recess kit facts, tilt on 4 and 6 kW, Coastal build and listing, app behaviour, Partner Program terms, website fixes, competitive sign-off.');
}

await Promise.all(JOBS);
await pres.writeFile({ fileName: OUT }); await applyTheme(OUT, THEME); console.log('wrote', OUT);
}
prep().then(build).catch((e) => { console.error(e); process.exit(1); });
