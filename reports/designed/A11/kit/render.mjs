// Shared render and print check for the designed documents (A11, A25 blueprint; A16, A15 editorial).
// render({ dir, html, pdf, meta }) writes index.html, pages/pNN.png (deviceScaleFactor 1), the PDF and meta.json,
// and sets a failing exit code on any print problem: text off a page or clipped, overlapping blocks, a missing
// image, "coming soon" near Select or Coastal, or an unresolved [[VERIFY / [[DIAGRAM.
import { writeFileSync, mkdirSync, readdirSync, unlinkSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const KIT = dirname(fileURLToPath(import.meta.url));
export const REPO = join(KIT, '../../../..');

// Copy photos into <dir>/img as JPEG ≤ 2000 px, q82. map: { name: 'repo/relative/path[@x0,y0,x1,y1]' }
export function prepImages(dir, map) {
  const args = Object.entries(map).map(([k, v]) => `${k}=${v}`);
  execFileSync('python3', [join(KIT, 'prep.py'), join(dir, 'img'), ...args], { stdio: 'inherit' });
}

export async function render({ dir, html, pdf, meta }) {
  const { chromium } = require('playwright');
  writeFileSync(join(dir, 'index.html'), html);
  const pagesDir = join(dir, 'pages');
  mkdirSync(pagesDir, { recursive: true });
  for (const f of readdirSync(pagesDir)) if (f.endsWith('.png')) unlinkSync(join(pagesDir, f));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(dir, 'index.html')).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: 'html,body{background:#fff}' });
  const qa = await page.evaluate(async () => {
    const out = [];
    const pages = [...document.querySelectorAll('.page')];
    const skip = (el) => el.closest('svg') || el.closest('[data-qa-skip]');
    pages.forEach((pg, i) => {
      const P = `p${String(i + 1).padStart(2, '0')}`;
      const pr = pg.getBoundingClientRect();
      // 1. text off the page
      pg.querySelectorAll('p,h1,h2,h3,h4,li,td,th,figcaption,span,b,em,a,i,.blk').forEach((el) => {
        if (skip(el)) return;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || !el.textContent.trim()) return;
        if (r.bottom > pr.bottom + 0.5 || r.right > pr.right + 0.5 || r.left < pr.left - 0.5 || r.top < pr.top - 0.5) out.push(`${P} off page: <${el.tagName.toLowerCase()} class="${el.className}"> "${el.textContent.trim().slice(0, 50)}"`);
      });
      // 2. clipped: a box that hides overflow but holds more than it shows
      pg.querySelectorAll('*').forEach((el) => {
        if (skip(el)) return;
        const cs = getComputedStyle(el);
        if (cs.overflowX === 'visible' && cs.overflowY === 'visible') return;
        if (!el.textContent.trim()) return;
        if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) out.push(`${P} clipped: <${el.tagName.toLowerCase()} class="${el.className}"> ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight} "${el.textContent.trim().slice(0, 50)}"`);
      });
      // 3. text wider than its own box
      pg.querySelectorAll('p,li,td,th,h1,h2,h3,h4').forEach((el) => {
        if (skip(el)) return;
        if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) out.push(`${P} overflow-x: "${el.textContent.trim().slice(0, 50)}"`);
      });
      // 3b. page furniture (folio, title strip) must sit on the page itself, or a bad tag has swallowed it
      pg.querySelectorAll('.folio, .strip, .tblock').forEach((el) => { if (el.parentElement !== pg) out.push(`${P} ${el.className} is not a direct child of its page (unclosed tag?)`); });
      // 4. overlapping blocks (.blk) on the same page; a block nested in another block is the parent's business
      const blocks = [...pg.querySelectorAll('.blk')].filter((b) => !b.parentElement.closest('.blk'));
      for (let a = 0; a < blocks.length; a++) for (let b = a + 1; b < blocks.length; b++) {
        const A = blocks[a].getBoundingClientRect(), B = blocks[b].getBoundingClientRect();
        if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) out.push(`${P} overlap: .${String(blocks[a].className).replace(/ /g, '.')} × .${String(blocks[b].className).replace(/ /g, '.')}`);
      }
      // 5. drawing text that leaves the page or its drawing
      pg.querySelectorAll('svg.dwg').forEach((svg) => {
        const sr = svg.getBoundingClientRect();
        svg.querySelectorAll('text').forEach((t) => {
          const r = t.getBoundingClientRect();
          if (r.right > pr.right || r.left < pr.left || r.bottom > pr.bottom) out.push(`${P} drawing text off page: ${t.textContent}`);
          if (r.left < sr.left - 2 || r.right > sr.right + 2 || r.top < sr.top - 2 || r.bottom > sr.bottom + 2) out.push(`${P} drawing text outside its drawing: ${t.textContent}`);
        });
        // overlapping drawing labels
        const ts = [...svg.querySelectorAll('text')].map((t) => [t, t.getBoundingClientRect()]).filter(([, r]) => r.width);
        for (let a = 0; a < ts.length; a++) for (let b = a + 1; b < ts.length; b++) {
          const A = ts[a][1], B = ts[b][1];
          if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1.5 && B.top < A.bottom - 1.5) out.push(`${P} drawing labels overlap: "${ts[a][0].textContent}" × "${ts[b][0].textContent}"`);
        }
      });
    });
    // 6. images: <img> and CSS backgrounds
    document.querySelectorAll('img').forEach((im) => { if (!im.complete || !im.naturalWidth) out.push('missing image ' + im.getAttribute('src')); });
    const urls = new Set();
    document.querySelectorAll('.page, .page *').forEach((el) => {
      const bg = getComputedStyle(el).backgroundImage;
      for (const m of (bg || '').matchAll(/url\("?(.*?)"?\)/g)) if (!m[1].startsWith('data:')) urls.add(m[1]);
    });
    for (const u of urls) {
      const ok = await new Promise((res) => { const im = new Image(); im.onload = () => res(im.naturalWidth > 0); im.onerror = () => res(false); im.src = u; });
      if (!ok) out.push('missing background image ' + u);
    }
    // 7. words
    const txt = document.body.innerText;
    if (/\[\[\s*VERIFY/i.test(txt)) out.push('raw [[VERIFY in text');
    if (/\[\[\s*DIAGRAM/i.test(txt)) out.push('raw [[DIAGRAM in text');
    if (/\[\[|\]\]/.test(txt)) out.push('raw [[ or ]] in text');
    const soon = /(coming soon|when launched|upcoming|not yet launched|yet to launch|pre-launch)/i;
    if (soon.test(txt)) out.push(`"${txt.match(soon)[0]}" in text (Select and Coastal have launched)`);
    if (/\bClaude\b/.test(txt)) out.push('"Claude" in text');
    if (/\u2014/.test(txt)) out.push('long dash in text; use an en dash');
    if (/!/.test(txt)) out.push('exclamation mark in text');
    return out;
  });
  const els = await page.$$('.page');
  for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: join(pagesDir, `p${String(i + 1).padStart(2, '0')}.png`) });
  await page.pdf({ path: join(dir, pdf), width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  const rel = (p) => relative(REPO, join(dir, p)).split('\\').join('/');
  const m = { item_id: meta.item_id, theme: meta.theme, title: meta.title, pdf: rel(pdf), cover: rel('pages/p01.png'), pages: els.length };
  writeFileSync(join(dir, 'meta.json'), JSON.stringify(m, null, 2) + '\n');
  const mb = statSync(join(dir, pdf)).size / 1048576;
  if (mb > 6) qa.push(`PDF is ${mb.toFixed(2)} MB (limit 6 MB)`);
  console.log(`${meta.item_id}: ${els.length} pages, ${mb.toFixed(2)} MB`);
  if (qa.length) { console.log('PRINT CHECK FAILED:\n' + qa.join('\n')); process.exitCode = 1; } else console.log('Print check: clean');
  return qa;
}
