// Bromic training decks: one shared library so every deck in the Training Hub looks and behaves the same.
// Look: the Tungsten Series II launch playbook (Bodoni MT headlines as the Office-safe Didot, Arial body,
// white pages, ink and steel, flame #EF4123 as the single accent). LAYOUT_WIDE 13.333 x 7.5 in.
// Usage (each deck file):
//   const L = require('./lib'); const { pres, s } = L.start({ title, footer, icons: ['LuFlame', ...] });
//   ... L.cover(...), L.divider(...), L.content(...), L.exercise(...), L.quiz(...), L.closing(...)
//   L.finish('Deck-File-Name')   -> decks/training/out/Deck-File-Name.pptx (+ .pdf and slide thumbs for the Hub)
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');
const React = require('react'); const RDS = require('react-dom/server'); const LU = require('react-icons/lu');
const SKILL = '/root/.claude/skills/synced/2cb8c0ce-acbf-4859-87f0-b5c97456c048_4e8fdbab-129c-40f6-9715-5aa66209287a/pptx';
const { applyTheme } = require(SKILL + '/scripts/apply_theme.js');

const ROOT = '/home/user/Bromic_Marketing';
const OUTDIR = path.join(__dirname, 'out'); fs.mkdirSync(OUTDIR, { recursive: true });
const CACHE = path.join(__dirname, 'cache'); fs.mkdirSync(CACHE, { recursive: true });
const LOGO = path.join(ROOT, 'decks', 'img', 'logo.png'), LOGO_W = path.join(ROOT, 'decks', 'img', 'logo-white.png');
const THEME = {
  name: 'Bromic', headFontFace: 'Bodoni MT', bodyFontFace: 'Arial',
  colors: { dk1: '231F20', lt1: 'FFFFFF', dk2: '4A4546', lt2: 'F5F5F4', accent1: 'EF4123', accent2: '71777D', accent3: 'FCE3DC', accent4: 'E3E3E1', accent5: 'B22B12', accent6: 'C9C9C6', hlink: 'C7321A', folHlink: '71777D' },
};
const W = 13.333, H = 7.5, M = 0.6;
const HEX = { INK: '231F20', BODY: '4A4546', STEEL: '71777D', FLAME: 'EF4123', WASH: 'FCE3DC', LINE: 'E3E3E1', GREY: 'F5F5F4', WHITE: 'FFFFFF' };

let pres, C, sec = '', JOBS = [], ICONS = {}, NEED = new Set(), FOOT = '';

// ---- images: any library id (images/library/<id>.webp), review image ('rv-<id>' -> images/review/full), portfolio
// ('pf-<id>'), deck render ('dk-<name>' -> decks/product-renders), or an absolute path. Always cropped (cover) or
// letterboxed (contain) to the exact frame: never stretched.
function src(id) {
  if (path.isAbsolute(id)) return id;
  if (id.startsWith('rv-')) return path.join(ROOT, 'images/review/full', id.slice(3) + '.jpg');
  if (id.startsWith('pf-')) return path.join(ROOT, 'images/portfolio', id.slice(3) + '.webp');
  if (id.startsWith('dk-')) return path.join(ROOT, 'decks/product-renders', id.slice(3) + '.jpg');
  return path.join(ROOT, 'images/library', id + '.webp');
}
function pic(s, id, x, y, w, h, mode = 'cover', objectName = 'image') {
  const f = src(id); if (!fs.existsSync(f)) throw new Error('image not found: ' + id + ' -> ' + f);
  const out = path.join(CACHE, `${path.basename(id).replace(/[^a-z0-9-]/gi, '_')}-${Math.round(w * 100)}x${Math.round(h * 100)}-${mode}.jpg`);
  if (!fs.existsSync(out)) JOBS.push(sharp(f).resize({ width: Math.round(w * 200), height: Math.round(h * 200), fit: mode === 'contain' ? 'contain' : 'cover', position: 'attention', background: '#ffffff' }).flatten({ background: '#ffffff' }).jpeg({ quality: 84 }).toFile(out));
  s.addImage({ path: out, x, y, w, h, objectName, altText: objectName });
}
async function iconPng(name, color) {
  const key = name + color; if (ICONS[key]) return ICONS[key];
  if (!LU[name]) throw new Error('unknown lucide icon: ' + name);
  const svg = RDS.renderToStaticMarkup(React.createElement(LU[name], { color: '#' + color, size: 256, strokeWidth: 1.6 }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return (ICONS[key] = 'image/png;base64,' + buf.toString('base64'));
}
// An icon in a circle: style 'light' (flame on wash), 'solid' (white on flame), 'dark' (white on ink).
function ico(s, name, x, y, d = 0.62, style = 'light') {
  const fill = style === 'solid' ? HEX.FLAME : style === 'dark' ? HEX.INK : HEX.WASH, col = style === 'light' ? HEX.FLAME : HEX.WHITE;
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: 'icon-disc' });
  const k = name + col; if (!ICONS[k]) throw new Error('icon not prepared (list it in start({icons})): ' + name);
  s.addImage({ data: ICONS[k], x: x + d * 0.22, y: y + d * 0.22, w: d * 0.56, h: d * 0.56, objectName: 'icon-' + name, altText: name });
}
const T = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, fontSize: 15, color: HEX.BODY, valign: 'top', fontFace: 'Arial', ...o });
const H1 = (s, text, o) => T(s, text, { fontFace: 'Bodoni MT', color: HEX.INK, ...o });
const card = (s, x, y, w, h, fill = HEX.GREY, name = 'card') => s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: name });
const bullets = (items, o = {}) => items.map((t, i) => ({ text: t, options: { bullet: { code: '25A0' }, breakLine: i < items.length - 1, paraSpaceAfter: 8, ...o } }));

function slide(master, section) {
  if (section !== sec) { pres.addSection({ title: section }); sec = section; }
  return pres.addSlide({ masterName: master, sectionTitle: section });
}

function start({ title, footer, icons = [] }) {
  pres = new pptxgen(); sec = ''; JOBS = []; FOOT = footer || title;
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = title; pres.company = 'Bromic Heating'; pres.author = 'Bromic Heating';
  C = pres.SchemeColor;
  ['LuFlame', 'LuLightbulb', 'LuPencilRuler', 'LuCircleCheck', 'LuCircleHelp', 'LuClock', 'LuUsers', ...icons].forEach((n) => NEED.add(n));
  pres.defineSlideMaster({
    title: 'CONTENT', background: { color: C.background1 },
    objects: [
      { image: { path: LOGO, x: M, y: 7.0, w: 0.95, h: 0.3 } },
      { text: { text: FOOT, options: { x: 1.75, y: 7.0, w: 9, h: 0.3, fontSize: 9, color: C.accent2, valign: 'middle', margin: 0 } } },
      { placeholder: { options: { name: 'kicker', type: 'body', x: M, y: 0.4, w: 10, h: 0.3, fontSize: 11, bold: true, color: C.accent1, charSpacing: 3, margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.72, w: 12.1, h: 0.9, fontFace: 'Bodoni MT', fontSize: 34, color: C.text1, valign: 'top', align: 'left', margin: 0 }, text: '' } },
    ],
    slideNumber: { x: 12.2, y: 7.0, w: 0.5, h: 0.3, fontSize: 9, color: C.accent2, align: 'right' },
  });
  pres.defineSlideMaster({
    title: 'DARK', background: { color: C.text1 },
    objects: [
      { image: { path: LOGO_W, x: M, y: 0.5, w: 1.6, h: 0.5 } },
      { placeholder: { options: { name: 'kicker', type: 'body', x: M, y: 3.9, w: 6.6, h: 0.4, fontSize: 12, bold: true, color: C.accent1, charSpacing: 4, margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 4.35, w: 6.6, h: 1.9, fontFace: 'Bodoni MT', fontSize: 44, color: C.background1, valign: 'top', align: 'left', margin: 0 }, text: '' } },
    ],
  });
  pres.defineSlideMaster({
    title: 'EXERCISE', background: { color: C.accent3 },
    objects: [
      { image: { path: LOGO, x: M, y: 7.0, w: 0.95, h: 0.3 } },
      { text: { text: FOOT, options: { x: 1.75, y: 7.0, w: 9, h: 0.3, fontSize: 9, color: C.accent2, valign: 'middle', margin: 0 } } },
      { placeholder: { options: { name: 'kicker', type: 'body', x: 1.55, y: 0.5, w: 10, h: 0.3, fontSize: 11, bold: true, color: C.accent5, charSpacing: 3, margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'title', type: 'title', x: 1.55, y: 0.82, w: 11.1, h: 0.9, fontFace: 'Bodoni MT', fontSize: 34, color: C.text1, valign: 'top', align: 'left', margin: 0 }, text: '' } },
    ],
    slideNumber: { x: 12.2, y: 7.0, w: 0.5, h: 0.3, fontSize: 9, color: C.accent2, align: 'right' },
  });
  return { pres, C };
}

const kt = (s, kicker, title) => { s.addText(String(kicker).toUpperCase(), { placeholder: 'kicker' }); s.addText(title, { placeholder: 'title' }); };

// ---- slide recipes ----
// cover: full-height photo right, title block left on ink
function cover({ kicker, title, sub, img, meta, section = 'Welcome', notes }) {
  pres.addSection({ title: section }); sec = section;
  const s = pres.addSlide({ sectionTitle: section }); s.background = { color: HEX.INK };
  pic(s, img, 5.4, 0, W - 5.4, H, 'cover', 'cover-image');
  s.addImage({ path: LOGO_W, x: M, y: 0.55, w: 1.8, h: 0.56 });
  T(s, kicker.toUpperCase(), { x: M, y: 2.7, w: 4.5, h: 0.35, fontSize: 12, bold: true, color: HEX.FLAME, charSpacing: 4 });
  H1(s, title, { x: M, y: 3.1, w: 4.6, h: 2.0, fontSize: 38, color: HEX.WHITE });
  if (sub) T(s, sub, { x: M, y: 5.2, w: 4.5, h: 1.0, fontSize: 14, color: 'D9D6D2' });
  if (meta) T(s, meta, { x: M, y: 6.75, w: 4.6, h: 0.3, fontSize: 10, color: 'B9B5B0' });
  if (notes) s.addNotes(notes);
  return s;
}
// divider: ink page, photo right, big module number
function divider({ n, title, line, img, section, icon, notes }) {
  const s = slide('DARK', section || title);
  pic(s, img, 7.6, 0, W - 7.6, H, 'cover', 'divider-image');
  if (icon) ico(s, icon, M, 2.9, 0.75, 'solid');
  s.addText(n, { placeholder: 'kicker' }); s.addText(title, { placeholder: 'title' });
  if (line) T(s, line, { x: M, y: 6.1, w: 6.6, h: 0.8, fontSize: 14, color: 'D9D6D2' });
  if (notes) s.addNotes(notes);
  return s;
}
// content: kicker + title on the white layout; caller composes the rest. Returns the slide.
function content(section, kicker, title, notes) { const s = slide('CONTENT', section); kt(s, kicker, title); if (notes) s.addNotes(notes); return s; }
// exercise: flame-wash page with an icon, the task, how long, and the steps; optional photo or plan on the right
function exercise({ section, n, title, task, minutes, steps = [], img, imgMode = 'cover', notes, icon = 'LuPencilRuler' }) {
  const s = slide('EXERCISE', section);
  ico(s, icon, M, 0.55, 0.75, 'solid');
  kt(s, `Exercise ${n}  ·  ${minutes} min`, title);
  const tw = img ? 6.4 : 12.1;
  T(s, task, { x: M, y: 1.95, w: tw, h: 1.3, fontSize: 19, color: HEX.INK, fontFace: 'Bodoni MT' });
  if (steps.length) T(s, steps.map((t, i) => ({ text: `${i + 1}   ${t}`, options: { breakLine: i < steps.length - 1, paraSpaceAfter: 10 } })), { x: M, y: 3.35, w: tw, h: 3.4, fontSize: 15, color: HEX.BODY });
  if (img) pic(s, img, 7.35, 1.95, 5.38, 4.8, imgMode, 'exercise-image');
  if (notes) s.addNotes(notes);
  return s;
}
// quiz: question, 3-4 options as cards; the answer goes in the notes (never on the slide)
function quiz({ section, n, q, options, answer, why }) {
  const s = slide('CONTENT', section);
  kt(s, `Check ${n}`, q);
  const cw = (W - 2 * M - (options.length - 1) * 0.3) / options.length;
  options.forEach((o, i) => {
    const x = M + i * (cw + 0.3);
    card(s, x, 2.3, cw, 3.6, HEX.GREY, 'option-card');
    T(s, String.fromCharCode(65 + i), { x: x + 0.3, y: 2.55, w: 1, h: 0.7, fontFace: 'Bodoni MT', fontSize: 40, color: HEX.FLAME });
    T(s, o, { x: x + 0.3, y: 3.45, w: cw - 0.6, h: 2.3, fontSize: 16, color: HEX.INK });
  });
  s.addNotes(`Answer: ${String.fromCharCode(65 + answer)}. ${why || ''}`);
  return s;
}
// statement: one big line over a full-bleed photo
function statement({ section, kicker, line, img, notes }) {
  const s = slide('DARK', section);
  pic(s, img, 0, 0, W, H, 'cover', 'statement-image');
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 3.9, w: W, h: 3.6, fill: { color: HEX.INK, transparency: 25 }, line: { color: HEX.INK, width: 0 }, objectName: 'scrim' });
  T(s, kicker.toUpperCase(), { x: M, y: 4.3, w: 11, h: 0.35, fontSize: 12, bold: true, color: HEX.FLAME, charSpacing: 4 });
  H1(s, line, { x: M, y: 4.75, w: 11.8, h: 2.0, fontSize: 36, color: HEX.WHITE });
  if (notes) s.addNotes(notes);
  return s;
}
// closing: ink page with the take-aways and what to do next
function closing({ section = 'Close', title, points, next, img, notes }) {
  const s = slide('DARK', section);
  if (img) pic(s, img, 7.6, 0, W - 7.6, H, 'cover', 'closing-image');
  s.addText('NEXT', { placeholder: 'kicker' }); s.addText(title, { placeholder: 'title' });
  if (points) T(s, bullets(points), { x: M, y: 1.4, w: 6.6, h: 2.3, fontSize: 15, color: 'E6E2DE' });
  if (next) T(s, next, { x: M, y: 6.3, w: 6.6, h: 0.6, fontSize: 13, color: 'D9D6D2' });
  if (notes) s.addNotes(notes);
  return s;
}

async function finish(fileName) {
  for (const n of NEED) for (const c of [HEX.FLAME, HEX.WHITE]) await iconPng(n, c);
  await Promise.all(JOBS);
  const out = path.join(OUTDIR, fileName + '.pptx');
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  execFileSync('python3', [SKILL + '/scripts/office/soffice.py', '--headless', '--convert-to', 'pdf', '--outdir', OUTDIR, out], { stdio: 'ignore' });
  const thumbs = path.join(OUTDIR, fileName + '-thumbs'); fs.mkdirSync(thumbs, { recursive: true });
  for (const f of fs.readdirSync(thumbs)) fs.unlinkSync(path.join(thumbs, f));
  execFileSync('pdftoppm', ['-jpeg', '-r', '60', path.join(OUTDIR, fileName + '.pdf'), path.join(thumbs, 's')]);
  console.log('built', out);
  return out;
}

// icons must be known before slides that use them are composed: call prepIcons first (start() registers the list)
async function prepIcons(list = []) { list.forEach((n) => NEED.add(n)); for (const n of NEED) for (const c of [HEX.FLAME, HEX.WHITE]) await iconPng(n, c); }

module.exports = { start, prepIcons, cover, divider, content, exercise, quiz, statement, closing, finish, pic, ico, T, H1, card, bullets, HEX, W, H, M, get pres() { return pres; } };
