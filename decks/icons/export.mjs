// PNG exports of the Bromic icons for the Hub's Icon Library: png/ink/<name>.png and png/white/<name>.png, 512 px, transparent.
// Run: NODE_PATH=decks/training/node_modules node decks/icons/export.mjs
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const require = createRequire(import.meta.url); const sharp = require('sharp');
const D = path.dirname(new URL(import.meta.url).pathname);
for (const v of ['ink', 'white']) fs.mkdirSync(path.join(D, 'png', v), { recursive: true });
for (const f of fs.readdirSync(path.join(D, 'svg')).filter((f) => f.endsWith('.svg'))) {
  const svg = fs.readFileSync(path.join(D, 'svg', f), 'utf8'), n = f.slice(0, -4);
  await sharp(Buffer.from(svg), { density: 768 }).resize(512, 512).png().toFile(path.join(D, 'png', 'ink', n + '.png'));
  await sharp(Buffer.from(svg.replace(/#231F20/gi, '#FFFFFF')), { density: 768 }).resize(512, 512).png().toFile(path.join(D, 'png', 'white', n + '.png'));
}
console.log('exported');
