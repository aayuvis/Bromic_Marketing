// Bromic icon set: writes svg/<name>.svg, icons.json and sheet.png.
// node decks/icons/build.mjs   (NODE_PATH must reach sharp)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { ICONS, INK, FLAME } from './icons.src.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

function svg({ ink, glow }) {
  const inkEls = ink.map((e) => (e.startsWith('<') ? e : `<path d="${e}"/>`)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10">` +
    `<g stroke="${INK}" stroke-width="2">${inkEls}</g>${glow}</svg>\n`;
}

fs.mkdirSync(path.join(dir, 'svg'), { recursive: true });
for (const f of fs.readdirSync(path.join(dir, 'svg'))) fs.unlinkSync(path.join(dir, 'svg', f));
const out = ICONS.map((i) => {
  const s = svg(i);
  const n = (s.match(new RegExp(FLAME, 'gi')) || []).length;
  if (n !== 1) throw new Error(`${i.name}: ${n} flame elements`);
  fs.writeFileSync(path.join(dir, 'svg', `${i.name}.svg`), s);
  return { ...i, s };
});
fs.writeFileSync(path.join(dir, 'icons.json'), JSON.stringify(out.map(({ name, label, group }) => ({ name, label, group })), null, 2) + '\n');

// contact sheet: white panel, then ink panel (strokes white, flame kept)
const sharp = require('sharp');
const cols = 10, cw = 128, ch = 128, pad = 40;
const rows = Math.ceil(out.length / cols);
const pw = cols * cw + pad * 2, ph = rows * ch + pad * 2 + 30;
function panel(y0, bg, fg, sub) {
  let g = `<rect x="0" y="${y0}" width="${pw}" height="${ph}" fill="${bg}"/>`;
  g += `<text x="${pad}" y="${y0 + 34}" font-family="Helvetica, Arial, sans-serif" font-size="14" letter-spacing="2" fill="${FLAME}">${sub}</text>`;
  out.forEach((i, k) => {
    const x = pad + (k % cols) * cw, y = y0 + pad + 24 + Math.floor(k / cols) * ch;
    let s = i.s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    if (fg !== INK) s = s.split(INK).join(fg);
    g += `<svg x="${x + (cw - 64) / 2}" y="${y}" width="64" height="64" viewBox="0 0 48 48" fill="none" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10">${s}</svg>`;
    g += `<text x="${x + cw / 2}" y="${y + 90}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="${fg === INK ? '#71777D' : '#C9CCCF'}">${i.name}</text>`;
  });
  return g;
}
const H = ph * 2;
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${H}">` +
  panel(0, '#FFFFFF', INK, 'BROMIC ICONS · ON WHITE') + panel(ph, INK, '#FFFFFF', 'BROMIC ICONS · ON INK') + '</svg>';
await sharp(Buffer.from(sheet)).png().toFile(path.join(dir, 'sheet.png'));
console.log(out.length, 'icons');
