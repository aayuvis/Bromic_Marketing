#!/usr/bin/env node
// Builds the private Claude preview of the Hub (app/dist-artifact/) from app/dist (run `npm run build` first).
// A Claude page holds at most 511 files and runs no outside requests, so: the page carries the app inline, data.js and
// the tools ship as files, and every image is packed as a 520px thumbnail into a few img-N.js bundles that a small shim
// swaps in for any images/library/… src. Downloads and print are blocked there, so window.HUB_FRAME switches those to copy.
//   node scripts/artifact.mjs      → app/dist-artifact/ (publish artifact.html with files = everything else)
import fs from 'node:fs';
import path from 'node:path';

const APP = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ROOT = path.resolve(APP, '..');
const DIST = path.join(APP, 'dist');
const OUT = path.join(APP, 'dist-artifact');
const CHUNK = 5.5e6;  // bytes of base64 per bundle (a text file may be 16 MB)

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const body = html.split(/<body[^>]*>/)[1].split('</body>')[0].replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, '');
const head = html.split('</head>')[0];
const title = (head.match(/<title>[^<]*<\/title>/) || ['<title>Bromic Content Hub</title>'])[0];
const metas = (head.match(/<meta name="(description|robots)"[^>]*>/g) || []).join('\n');
const css = fs.readFileSync(path.join(DIST, 'styles.css'), 'utf8');

// images → thumbnail data URIs, packed into bundles
const lib = path.join(ROOT, 'images', 'library');
const thumbs = fs.readdirSync(lib).filter((f) => f.endsWith('-t.webp')).sort();
const bundles = []; let cur = {}; let size = 0;
for (const f of thumbs) {
  const uri = 'data:image/webp;base64,' + fs.readFileSync(path.join(lib, f)).toString('base64');
  if (size + uri.length > CHUNK && size) { bundles.push(cur); cur = {}; size = 0; }
  cur[f.replace(/-t\.webp$/, '')] = uri; size += uri.length;
}
if (size) bundles.push(cur);
bundles.forEach((b, i) => fs.writeFileSync(path.join(OUT, `img-${i + 1}.js`), `Object.assign(window.IMGDATA = window.IMGDATA || {}, ${JSON.stringify(b)});\n`));

fs.copyFileSync(path.join(DIST, 'data.js'), path.join(OUT, 'data.js'));
fs.copyFileSync(path.join(DIST, 'app.js'), path.join(OUT, 'app.js'));
for (const t of fs.readdirSync(path.join(DIST, 'tools'))) {
  const src = path.join(DIST, 'tools', t, 'index.html');
  if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.join(OUT, 'tools', t), { recursive: true });
  fs.copyFileSync(src, path.join(OUT, 'tools', t, 'index.html'));
}

const shim = `window.HUB_FRAME = true;
(function () {
  var re = /images\\/library\\/([\\w.-]+?)(-t)?\\.webp$/;
  function fix(img) { var m = (img.getAttribute('src') || '').match(re); if (m && window.IMGDATA && IMGDATA[m[1]]) img.src = IMGDATA[m[1]]; }
  function scan(root) { if (root.tagName === 'IMG') fix(root); if (root.querySelectorAll) root.querySelectorAll('img[src*="images/library/"]').forEach(fix); }
  new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n); }); if (m.type === 'attributes') fix(m.target); }); })
    .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  window.addEventListener('load', function () { scan(document.body); });
})();`;
const page = `${title}
${metas}
<style>
${css}
</style>
${body}
<script>${shim}</script>
<script src="data.js"></script>
${bundles.map((_, i) => `<script src="img-${i + 1}.js"></script>`).join('\n')}
<script src="app.js"></script>
`;
fs.writeFileSync(path.join(OUT, 'artifact.html'), page);
const files = fs.readdirSync(OUT, { recursive: true }).filter((f) => fs.statSync(path.join(OUT, f)).isFile());
const total = files.reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`${files.length} files · ${(total / 1e6).toFixed(1)} MB · ${bundles.length} image bundles · ${thumbs.length} images → app/dist-artifact/`);
