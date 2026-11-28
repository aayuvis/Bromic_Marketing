// Bromic training decks: one shared library so every deck in the Training Hub looks and behaves the same.
// Look v2 (owner, 28 Nov 2026: "looks like Claude did it... the iconography is claudy... take the design elements from the PDFs"):
// the white papers' language. No icon discs. Didot headlines (Bodoni MT, the Office-safe Didot; rendered here with GFS Didot),
// a flame italic accent word (*word* in a title), big Didot figures over hairline rules, full-bleed photographs under a
// dark gradient, product cut-outs on white, numbered steps in Didot, white pages, ink and steel, flame as the one accent.
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
const LATE = { push: (f) => f() }; // shades are made by prepIcons() before any slide

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
// Icons: the Bromic set in decks/icons/svg (owner, 28 Nov 2026: "a Bromic style unique iconography"): line drawings
// in ink with one flame detail, no discs or containers. icon(s, name, x, y, size, { dark }) — dark: white strokes for ink or
// photo backgrounds. The old Lucide ico() is retired and draws nothing.
const ICON_DIR = path.join(ROOT, 'decks', 'icons', 'svg');
function icon(s, name, x, y, d = 0.5, o = {}) {
  const f = path.join(ICON_DIR, name + '.svg'); if (!fs.existsSync(f)) throw new Error('no Bromic icon: ' + name);
  const out = path.join(CACHE, `icon-${name}-${o.dark ? 'w' : 'k'}.png`);
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(f).mtimeMs) {
    let svg = fs.readFileSync(f, 'utf8'); if (o.dark) svg = svg.replace(/#231F20/gi, '#FFFFFF');
    JOBS.push(sharp(Buffer.from(svg), { density: 600 }).resize(400, 400).png().toFile(out));
  }
  s.addImage({ path: out, x, y, w: d, h: d, objectName: 'icon-' + name, altText: name });
}
function ico() {}
const T = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, fontSize: 15, color: HEX.BODY, valign: 'top', fontFace: 'Arial', ...o });
const H1 = (s, text, o) => T(s, text, { fontFace: 'Bodoni MT', color: HEX.INK, ...o });
const card = (s, x, y, w, h, fill = HEX.GREY, name = 'card') => {
  if (fill === HEX.GREY || fill === 'F5F5F4') return rule(s, x, y, w, HEX.INK, 0.75, name);
  return s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: name });
};
// a hairline rule (the PDFs put one over every column, stat and step)
function rule(s, x, y, w, color = HEX.INK, pt = 0.75, name = 'rule') { s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width: pt }, objectName: name }); }
// a Didot numeral in flame, for steps and lists: 01, 02...
function num(s, n, x, y, o = {}) { T(s, typeof n === 'number' ? String(n).padStart(2, '0') : n, { x, y, w: o.w || 0.9, h: o.h || 0.6, fontFace: 'Bodoni MT', fontSize: o.size || 30, color: o.color || HEX.FLAME, ...o.t }); }
// a big Didot figure over a rule, with its line underneath (the PDFs' 51% / 35% / 74%)
function stat(s, figure, label, x, y, w, o = {}) {
  rule(s, x, y, w, o.ruleColor || HEX.INK);
  T(s, figure, { x, y: y + 0.12, w, h: o.h || 1.1, fontFace: 'Bodoni MT', fontSize: o.size || 60, color: o.color || HEX.FLAME });
  T(s, label, { x, y: y + 0.12 + (o.h || 1.1), w, h: o.lh || 0.9, fontSize: o.ls || 14, color: o.lc || HEX.BODY });
}
// *word* in a title becomes the flame italic accent, as on the white papers' covers ("Heat The *Pergola*")
function rich(text, color) {
  const parts = String(text).split(/(\*[^*]+\*)/).filter(Boolean);
  return parts.map((p) => p.startsWith('*') ? { text: p.slice(1, -1), options: { italic: true, color: HEX.FLAME } } : { text: p, options: color ? { color } : {} });
}
// a dark gradient for text over photographs (left to right, or bottom to top)
async function shade(dir) {
  const f = path.join(CACHE, `shade-${dir}.png`); if (fs.existsSync(f)) return f;
  const g = dir === 'up' ? 'x1="0" y1="1" x2="0" y2="0"' : 'x1="0" y1="0" x2="1" y2="0"';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" ${g}><stop offset="0" stop-color="#231F20" stop-opacity=".9"/><stop offset=".5" stop-color="#231F20" stop-opacity=".6"/><stop offset="1" stop-color="#231F20" stop-opacity="0"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(f); return f;
}

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
      { placeholder: { options: { name: 'kicker', type: 'body', x: M, y: 0.42, w: 10, h: 0.28, fontSize: 9.5, bold: true, color: C.accent1, charSpacing: 4, margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.72, w: 12.1, h: 0.9, fontFace: 'Bodoni MT', fontSize: 32, color: C.text1, valign: 'top', align: 'left', margin: 0 }, text: '' } },
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
    title: 'EXERCISE', background: { color: C.background1 },
    objects: [
      { image: { path: LOGO, x: M, y: 7.0, w: 0.95, h: 0.3 } },
      { text: { text: FOOT, options: { x: 1.75, y: 7.0, w: 9, h: 0.3, fontSize: 9, color: C.accent2, valign: 'middle', margin: 0 } } },
      { placeholder: { options: { name: 'kicker', type: 'body', x: M, y: 0.42, w: 10, h: 0.28, fontSize: 9.5, bold: true, color: C.accent1, charSpacing: 4, margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.72, w: 12.1, h: 0.9, fontFace: 'Bodoni MT', fontSize: 32, color: C.text1, valign: 'top', align: 'left', margin: 0 }, text: '' } },
    ],
    slideNumber: { x: 12.2, y: 7.0, w: 0.5, h: 0.3, fontSize: 9, color: C.accent2, align: 'right' },
  });
  pres.defineSlideMaster({ title: 'BLANK', background: { color: C.text1 }, objects: [] });
  return { pres, C };
}

const kt = (s, kicker, title) => { s.addText(String(kicker).toUpperCase(), { placeholder: 'kicker' }); s.addText(rich(title), { placeholder: 'title' }); };

// ---- slide recipes (v2: the white papers' language) ----
// cover: a full-bleed photograph under a dark gradient; white logo; flame kicker; Didot title with a flame italic accent
function cover({ kicker, title, sub, img, meta, section = 'Welcome', notes }) {
  pres.addSection({ title: section }); sec = section;
  const s = pres.addSlide({ sectionTitle: section }); s.background = { color: HEX.INK };
  pic(s, img, 0, 0, W, H, 'cover', 'cover-image');
  LATE.push(() => s.addImage({ path: path.join(CACHE, 'shade-right.png'), x: 0, y: 0, w: W * 0.72, h: H, objectName: 'shade' }));
  LATE.push(() => {
    s.addImage({ path: LOGO_W, x: M, y: 0.55, w: 1.6, h: 0.5 });
    T(s, kicker.toUpperCase(), { x: M, y: 3.0, w: 6.5, h: 0.3, fontSize: 10, bold: true, color: HEX.FLAME, charSpacing: 5 });
    H1(s, rich(title), { x: M, y: 3.35, w: 7.2, h: 2.1, fontSize: 48, color: HEX.WHITE });
    if (sub) T(s, sub, { x: M, y: 5.5, w: 6.2, h: 0.9, fontSize: 15, color: 'E6E2DE' });
    if (meta) { rule(s, M, 6.6, 6.2, '8A8580', 0.5); T(s, meta, { x: M, y: 6.7, w: 6.2, h: 0.3, fontSize: 9, color: 'B9B5B0', charSpacing: 2 }); }
  });
  if (notes) s.addNotes(notes);
  return s;
}
// divider: a full-bleed photograph, gradient from the bottom; a big flame Didot numeral, the title, one line
function divider({ n, title, line, img, section, notes }) {
  const s = slide('BLANK', section || title);
  pic(s, img, 0, 0, W, H, 'cover', 'divider-image');
  LATE.push(() => s.addImage({ path: path.join(CACHE, 'shade-up.png'), x: 0, y: 0, w: W, h: H, objectName: 'shade' }));
  LATE.push(() => {
    H1(s, n, { x: M - 0.04, y: 3.5, w: 3, h: 1.4, fontSize: 96, color: HEX.FLAME });
    H1(s, rich(title), { x: M, y: 4.95, w: 9, h: 0.9, fontSize: 40, color: HEX.WHITE });
    if (line) T(s, line, { x: M, y: 5.9, w: 8, h: 0.7, fontSize: 15, color: 'E6E2DE' });
  });
  if (notes) s.addNotes(notes);
  return s;
}
// content: kicker + title on the white layout; caller composes the rest. Returns the slide.
function content(section, kicker, title, notes) { const s = slide('CONTENT', section); kt(s, kicker, title); if (notes) s.addNotes(notes); return s; }
// exercise: white page; the task in Didot; numbered steps on a wash panel; optional photo or plan on the right
function exercise({ section, n, title, task, minutes, steps = [], img, imgMode = 'cover', notes }) {
  const s = slide('EXERCISE', section);
  kt(s, `Exercise ${String(n).padStart(2, '0')}  ·  ${minutes} min`, title);
  const tw = img ? 6.4 : 12.1;
  rule(s, M, 1.85, tw, HEX.FLAME, 1.5);
  T(s, task, { x: M, y: 2.0, w: tw, h: 1.25, fontSize: 19, color: HEX.INK, fontFace: 'Bodoni MT' });
  if (steps.length) {
    s.addShape(pres.shapes.RECTANGLE, { x: M, y: 3.35, w: tw, h: 3.4, fill: { color: HEX.WASH }, line: { color: HEX.WASH, width: 0 }, objectName: 'steps-panel' });
    const sh = Math.min(0.8, 3.1 / steps.length);
    steps.forEach((t, i) => { num(s, i + 1, M + 0.25, 3.5 + i * sh, { size: 18, h: 0.4, w: 0.6 }); T(s, t, { x: M + 0.9, y: 3.55 + i * sh, w: tw - 1.15, h: sh, fontSize: 14, color: HEX.INK }); });
  }
  if (img) pic(s, img, 7.35, 1.85, 5.38, 4.9, imgMode, 'exercise-image');
  if (notes) s.addNotes(notes);
  return s;
}
// quiz: the question, then 3-4 options under hairline rules with Didot letters; the answer goes in the notes
function quiz({ section, n, q, options, answer, why }) {
  const s = slide('CONTENT', section);
  kt(s, `Check ${n}`, q);
  const cw = (W - 2 * M - (options.length - 1) * 0.35) / options.length;
  options.forEach((o, i) => {
    const x = M + i * (cw + 0.35);
    rule(s, x, 2.35, cw, HEX.INK, 0.75);
    T(s, String.fromCharCode(65 + i), { x, y: 2.5, w: 1, h: 0.9, fontFace: 'Bodoni MT', fontSize: 48, color: HEX.FLAME });
    T(s, o, { x, y: 3.55, w: cw - 0.1, h: 2.6, fontSize: 17, color: HEX.INK });
  });
  s.addNotes(`Answer: ${String.fromCharCode(65 + answer)}. ${why || ''}`);
  return s;
}
// statement: one big Didot line over a full-bleed photograph, gradient from the left
function statement({ section, kicker, line, img, notes }) {
  const s = slide('BLANK', section);
  pic(s, img, 0, 0, W, H, 'cover', 'statement-image');
  LATE.push(() => s.addImage({ path: path.join(CACHE, 'shade-right.png'), x: 0, y: 0, w: W * 0.8, h: H, objectName: 'shade' }));
  LATE.push(() => {
    T(s, kicker.toUpperCase(), { x: M, y: 3.6, w: 7, h: 0.3, fontSize: 10, bold: true, color: HEX.FLAME, charSpacing: 5 });
    H1(s, rich(line), { x: M, y: 3.95, w: 7.4, h: 2.6, fontSize: 34, color: HEX.WHITE });
  });
  if (notes) s.addNotes(notes);
  return s;
}
// closing: a photograph on the right; take-aways as numbered lines on ink
function closing({ section = 'Close', title, points, next, img, notes }) {
  const s = slide('BLANK', section); s.background = { color: HEX.INK };
  if (img) pic(s, img, 7.3, 0, W - 7.3, H, 'cover', 'closing-image');
  s.addImage({ path: LOGO_W, x: M, y: 0.55, w: 1.6, h: 0.5 });
  T(s, 'NEXT', { x: M, y: 1.5, w: 6, h: 0.3, fontSize: 10, bold: true, color: HEX.FLAME, charSpacing: 5 });
  H1(s, rich(title), { x: M, y: 1.85, w: 6.3, h: 1.2, fontSize: 34, color: HEX.WHITE });
  if (points) { const ph = Math.min(0.85, 3.2 / points.length); points.forEach((t, i) => { rule(s, M, 3.15 + i * ph, 6.2, '5A5556', 0.5); num(s, i + 1, M, 3.22 + i * ph, { size: 16, h: 0.35, w: 0.55 }); T(s, t, { x: M + 0.65, y: 3.25 + i * ph, w: 5.55, h: ph - 0.1, fontSize: 14, color: 'E6E2DE' }); }); }
  if (next) T(s, next, { x: M, y: 6.45, w: 6.2, h: 0.6, fontSize: 12, color: 'B9B5B0' });
  if (notes) s.addNotes(notes);
  return s;
}

// Renders here use GFS Didot for Bodoni MT (the brand's Didot; LibreOffice otherwise falls back to a sans): install it once.
function didot() {
  const f = path.join(require('os').homedir(), '.fonts', 'GFSDidot.ttf'); if (fs.existsSync(f)) return;
  fs.mkdirSync(path.dirname(f), { recursive: true });
  execFileSync('python3', ['-c', `from fontTools.ttLib import TTFont; t=TTFont('${ROOT}/app/src/fonts/gfs-didot-latin.woff2'); t.flavor=None; t.save('${f}')`]);
  const c = path.join(require('os').homedir(), '.config', 'fontconfig', 'fonts.conf'); fs.mkdirSync(path.dirname(c), { recursive: true });
  fs.writeFileSync(c, '<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><alias binding="same"><family>Bodoni MT</family><prefer><family>GFS Didot</family></prefer></alias><alias binding="same"><family>Didot</family><prefer><family>GFS Didot</family></prefer></alias></fontconfig>');
  execFileSync('fc-cache', ['-f']);
}
async function finish(fileName) {
  didot();
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
async function prepIcons() { await shade('right'); await shade('up'); }

module.exports = { icon, rule, num, stat, rich, start, prepIcons, cover, divider, content, exercise, quiz, statement, closing, finish, pic, ico, T, H1, card, bullets, HEX, W, H, M, get pres() { return pres; } };
