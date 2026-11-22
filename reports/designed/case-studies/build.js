// Project File engine – a designed PDF for every complete Bromic case study.
//
//   node reports/designed/case-studies/build.js            build every study
//   node reports/designed/case-studies/build.js CSW-03 cs-provenance   build some
//   node reports/designed/case-studies/build.js --sheet     also (re)make the contact sheet only
//
// Sources (read, never written):
//   data/case-studies.json          Bromic-published case studies (kind "case-study") and gallery projects
//   data/site-inventory.json        what each bromic.com case-study page carries (read 29 Oct 2026)
//   images/library/manifest.json    every image, its source and status
//   content/case-studies/web/CSW-*.md   full-draft web case studies (front matter + body)
//   copy.js (beside this file)      the editorial layer: each sheet's words, written from the page
//                                   (bromic.com case studies re-read 22 Nov 2026) or the draft, no new facts
//
// For each study the engine builds one P object (the page reads only from it) and writes it to
// data/<id>.json. A data file with "locked": true is used as it stands, so a reviewer can edit it.
// Output: <id>/Bromic-Project-File-<slug>.pdf, <id>/pages/pN.png, index.json, contact-sheet.jpg.
//
// Theme: reports/themes/project-file (approved sample). One change from the sample: the plan never
// shows heaters, counts or positions – heated ZONES only, labelled "Illustrative layout".
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '../../..');
const CACHE = process.env.PF_CACHE || path.join(os.tmpdir(), 'bromic-project-file-cache');
const COPY = require('./copy.js');
const fileUrl = (p) => 'file://' + p.split(path.sep).map(encodeURIComponent).join('/').replace(/^file:\/\/%2F/, 'file:///');

// ---------------------------------------------------------------- sources
const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const CASES = readJSON('data/case-studies.json');
const CASE = Object.fromEntries(CASES.map((c) => [c.id, c]));
const INV = Object.fromEntries(readJSON('data/site-inventory.json').filter((i) => i.kind === 'case-study').map((i) => [i.url, i]));
const MANIFEST = Object.fromEntries(readJSON('images/library/manifest.json').map((i) => [i.id, i]));
const REVIEW = (() => { try { const r = readJSON('data/image-review.json'); return r.images || r.items || r; } catch { return []; } })();
const REJECTED = new Set((Array.isArray(REVIEW) ? REVIEW : []).filter((i) => i.status === 'rejected').map((i) => i.id));

// Products: collection, display name, fallback product photograph (images/portfolio)
const PRODUCTS = {
  'platinum-electric': ['Platinum', 'Platinum Smart-Heat® Electric', 'platinum-electric'],
  'platinum-marine': ['Platinum', 'Platinum Smart-Heat® Electric Marine', 'platinum-electric'],
  'platinum-gas': ['Platinum', 'Platinum Smart-Heat® Gas', 'platinum-gas'],
  'tungsten-electric': ['Tungsten', 'Tungsten Smart-Heat® Electric', 'tungsten-electric'],
  'tungsten-gas': ['Tungsten', 'Tungsten Smart-Heat® Gas', 'tungsten-gas'],
  'tungsten-freestanding-gas': ['Tungsten', 'Tungsten Smart-Heat® Freestanding Gas', 'tungsten-freestanding-gas'],
  'tungsten': ['Tungsten', 'Tungsten Smart-Heat® – electric or gas to confirm', 'tungsten-electric'],
  'eclipse-freestanding': ['Eclipse', 'Eclipse Smart-Heat® Freestanding', 'eclipse-freestanding'],
  'eclipse-electric': ['Eclipse', 'Eclipse Smart-Heat® Electric', 'eclipse-pendant'],
  'eclipse-pendant': ['Eclipse', 'Eclipse Pendant', 'eclipse-pendant'],
  'bromic': ['Bromic', 'Bromic heaters – model to confirm', null],
};
const TO_CONFIRM = 'To confirm – the source does not name them';
const AFFINITY = 'Every Bromic heater is specified with its controls: an Affinity Smart-Heat® On/Off, Dimmer or Eclipse controller, a wall switch and the Bromic Smart-Heat app. Wi-Fi and app features need compatible Affinity Smart-Heat controls, sold separately.';
const CTA = { label: 'Request Your Design Plan', url: 'bromic.com/design-your-space', href: 'https://www.bromic.com/design-your-space/' };

// [[VERIFY: what — team]] never reaches a page: it becomes "to confirm".
const clean = (s) => String(s ?? '')
  .replace(/\s*\[\[VERIFY:[^\]]*(\]\][^\]]*)?\]\]/g, ' – to confirm')
  .replace(/\s*\[\^s\d+\]/g, '')
  .replace(/ — /g, ' – ')
  .replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- web drafts (CSW-*.md)
function parseWeb(file) {
  const t = fs.readFileSync(file, 'utf8');
  const [, fm, body] = t.split(/^---$/m);
  const get = (k) => { const m = fm.match(new RegExp('^' + k + ':\\s*(.*)$', 'm')); return m ? m[1].trim().replace(/^"(.*)"$/, '$1') : null; };
  const sources = [];
  const re = /- id: (s\d+)\n\s+publisher: "(.*?)"\n\s+title: "(.*?)"\n\s+url: (\S+)\n\s+verified: \w+\n\s+supports: "(.*?)"\n/gs;
  let m; while ((m = re.exec(fm))) sources.push({ id: m[1], publisher: m[2], title: m[3], url: m[4], supports: m[5] });
  const glance = {};
  const g = body.split('## At a glance')[1]?.split('\n## ')[0] || '';
  for (const line of g.split('\n')) { const c = line.split('|').map((x) => x.trim()); if (c.length > 3 && c[1] && !/^-+$/.test(c[1])) glance[c[1]] = c[2]; }
  const sections = {};
  for (const part of body.split(/\n## /).slice(1)) { const [h, ...rest] = part.split('\n'); sections[h.trim()] = rest.join('\n').trim(); }
  return { id: get('id'), title: get('title'), hero: get('hero'), hero_caption: get('hero_caption'), images: JSON.parse(get('images') || '[]'),
    evidence: get('evidence'), completeness: get('completeness'), owner_review: get('owner_review'), sources, glance, sections, file: path.relative(ROOT, file) };
}
const WEB = Object.fromEntries(fs.readdirSync(path.join(ROOT, 'content/case-studies/web')).filter((f) => /^CSW-.*\.md$/.test(f))
  .map((f) => { const w = parseWeb(path.join(ROOT, 'content/case-studies/web', f)); return [w.id, w]; }));

// ---------------------------------------------------------------- build P
const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'®™]/g, '').replace(/&/g, 'and').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
const hostOnly = (u) => { try { return new URL(u).host.replace(/^www\./, ''); } catch { return u; } };
const shortUrl = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

function buildP(id) {
  const c = COPY[id];
  if (!c) throw new Error('no copy for ' + id);
  const web = WEB[id];
  const rec = CASE[id];
  const P = { id, kind: web ? 'web-draft' : 'bromic', draft: !!web, built: '2026-11-22' };
  Object.assign(P, JSON.parse(JSON.stringify(c)));
  P.slug = c.slug || slugify(c.name);
  P.cta = Object.assign({}, CTA, c.cta || {});
  P.products = (c.products || []).map((p) => {
    const [coll, name, fallback] = PRODUCTS[p.p] || PRODUCTS.bromic;
    return Object.assign({ coll, name, img: fallback ? 'portfolio:' + fallback : null }, p, { controls: p.controls || TO_CONFIRM });
  });
  // data strip: Controls always present
  const data = c.data.map(([k, v]) => [k, clean(v)]);
  if (!data.find(([k]) => k === 'Controls')) data.splice(3, 0, ['Controls', 'To confirm']);
  P.data = data;
  if (web) {
    P.source = { file: web.file, evidence: web.evidence, completeness: web.completeness, owner_review: clean(web.owner_review) };
    const residential = !!c.privateHome;
    const src = web.sources.map((s) => { const r = s.title.replace(/^\w+ source\s*/i, ''); const t = r ? ' ' + r : ''; return residential ? `${s.publisher}${t} (${hostOnly(s.url)}).` : `${s.publisher}${t}: ${shortUrl(s.url)}`; });
    P.sources = [...new Set(src)].concat(c.sources || []);
    P.notes = ['Draft from public sources: nothing here has been confirmed with the customer. Publish only once the consent checklist in the case-study template is complete.'].concat(c.notes || []);
    if (!c.hero) P.hero = { img: web.hero, caption: web.hero_caption };
  } else {
    const inv = rec && INV[rec.url];
    P.source = { record: 'data/case-studies.json#' + id, url: rec.url, also_at: rec.also_at, read: '2026-11-22' };
    const page = `Bromic, “${inv ? inv.title : rec.title}”, case study${c.dateText ? ', ' + c.dateText : ''} – ${shortUrl(rec.url)}${rec.also_at && rec.also_at.length ? ' (also on ' + [...new Set(rec.also_at.map(hostOnly))].join(' and ') + ')' : ''}.`;
    P.sources = [page].concat(c.sources || []);
    P.notes = (c.notes || []).slice();
  }
  P.sources = P.sources.map(clean);
  P.notes = P.notes.map(clean);
  return P;
}

// ---------------------------------------------------------------- images
function imageFile(ref) {
  if (!ref) return null;
  if (ref.startsWith('portfolio:')) return path.join(ROOT, 'images/portfolio', ref.slice(10) + '.webp');
  const m = MANIFEST[ref];
  if (!m) throw new Error('image not in manifest: ' + ref);
  if (REJECTED.has(ref) || m.status === 'rejected') throw new Error('rejected image: ' + ref);
  return path.join(ROOT, m.file);
}
function imageSize(ref) {
  if (!ref) return [0, 0];
  if (ref.startsWith('portfolio:')) return [1000, 750];
  return [MANIFEST[ref].w, MANIFEST[ref].h];
}
function prepareImages(refs) {
  fs.mkdirSync(CACHE, { recursive: true });
  const todo = [];
  for (const r of refs) {
    const out = path.join(CACHE, r.replace(':', '__') + '.jpg');
    if (!fs.existsSync(out)) todo.push([imageFile(r), out]);
  }
  if (todo.length) {
    const py = `import sys,json\nfrom PIL import Image\nfor src,out in json.load(sys.stdin):\n  im=Image.open(src)\n  if im.mode in ('RGBA','LA','P'):\n    im=im.convert('RGBA'); bg=Image.new('RGB',im.size,'white'); bg.paste(im,mask=im.split()[-1]); im=bg\n  im=im.convert('RGB'); im.thumbnail((1800,1800)); im.save(out,'JPEG',quality=80,optimize=True,progressive=True)\n`;
    execFileSync('python3', ['-I', '-c', py], { input: JSON.stringify(todo) });
  }
}
const imgUrl = (ref) => fileUrl(path.join(CACHE, ref.replace(':', '__') + '.jpg'));

// ---------------------------------------------------------------- drawing: heated zones only
const INK = '#231F20', STEEL = '#8A8F94', HAIR = '#C9CDD1', FLAME = '#EF4123';
function zonePlan(z, W, H) {
  const items = z.items;
  const n = items.length;
  const hull = z.shape === 'hull';
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" font-family="Arimo, Arial, sans-serif">`;
  s += `<defs><radialGradient id="warm" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#F1C9B5"/><stop offset=".5" stop-color="#F6DDD0" stop-opacity=".8"/><stop offset="1" stop-color="#FCF6F2" stop-opacity="0"/></radialGradient>
  <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="${HAIR}" stroke-width="1"/></pattern></defs>`;
  const X0 = 14, Y0 = 18, X1 = W - 14, Y1 = H - 10;
  let inner;
  if (hull) {
    const bow = 120, r = (Y1 - Y0) / 2;
    s += `<path d="M ${X0 + 30} ${Y0} L ${X1 - bow} ${Y0} Q ${X1 - 20} ${Y0 + 6} ${X1} ${Y0 + r} Q ${X1 - 20} ${Y1 - 6} ${X1 - bow} ${Y1} L ${X0 + 30} ${Y1} Q ${X0} ${Y1} ${X0} ${Y1 - 30} L ${X0} ${Y0 + 30} Q ${X0} ${Y0} ${X0 + 30} ${Y0} Z" fill="url(#hatch)" stroke="${INK}" stroke-width="2.5"/>`;
    s += `<text x="${X1 - 70}" y="${Y0 + r + 3}" font-size="7.5" letter-spacing="1.6" fill="${STEEL}" text-anchor="middle">BOW</text>`;
    s += `<text x="${X0 + 6}" y="${Y0 - 6}" font-size="7.5" letter-spacing="1.6" fill="${STEEL}">AFT</text>`;
    inner = [X0 + 12, Y0 + 12, X1 - bow - 6, Y1 - 12];
  } else {
    s += `<rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" fill="url(#hatch)" stroke="${INK}" stroke-width="3"/>`;
    inner = [X0 + 8, Y0 + 8, X1 - 8, Y1 - 8];
  }
  // rooms: one row up to 4, two rows beyond
  const rows = n > 4 ? [items.slice(0, Math.ceil(n / 2)), items.slice(Math.ceil(n / 2))] : [items];
  const [ix0, iy0, ix1, iy1] = inner;
  const gap = 8;
  const rowH = (iy1 - iy0 - gap * (rows.length - 1)) / rows.length;
  rows.forEach((row, ri) => {
    const tw = row.reduce((a, b) => a + (b.w || 1), 0);
    let x = ix0;
    const avail = ix1 - ix0 - gap * (row.length - 1);
    row.forEach((it) => {
      const w = avail * (it.w || 1) / tw;
      const y = iy0 + ri * (rowH + gap);
      s += `<rect x="${x}" y="${y}" width="${w}" height="${rowH}" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`;
      s += `<rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${rowH - 20}" rx="${Math.min(22, rowH / 4)}" fill="#FCF6F2" stroke="${FLAME}" stroke-width=".8" stroke-dasharray="3 3" stroke-opacity=".55"/>`;
      s += `<ellipse cx="${x + w / 2}" cy="${y + rowH / 2 + 10}" rx="${(w - 30) / 2}" ry="${(rowH - 50) / 2}" fill="url(#warm)"/>`;
      const cx = x + 22, cy = y + 24;
      s += `<circle cx="${cx}" cy="${cy}" r="9" fill="#fff" stroke="${FLAME}" stroke-width="1.2"/><text x="${cx}" y="${cy + 3.2}" font-size="9" fill="${FLAME}" text-anchor="middle" font-weight="700">${it.l}</text>`;
      const label = esc(it.name.toUpperCase());
      const maxChars = Math.max(6, Math.floor((w - 52) / 7.7));
      const words = label.split(' '); const lines = ['']; for (const wd of words) { if ((lines[lines.length - 1] + ' ' + wd).trim().length > maxChars && lines[lines.length - 1]) lines.push(wd); else lines[lines.length - 1] = (lines[lines.length - 1] + ' ' + wd).trim(); }
      lines.slice(0, 3).forEach((ln, i) => { s += `<text x="${cx + 15}" y="${cy + 3 + i * 11}" font-size="7.6" letter-spacing="1.3" fill="${INK}">${ln}</text>`; });
      if (it.dims) s += `<text x="${x + w / 2}" y="${y + rowH - 18}" font-size="7.5" letter-spacing=".8" fill="${STEEL}" text-anchor="middle">${esc(it.dims)}</text>`;
      x += w + gap;
    });
  });
  s += '</svg>';
  return s;
}

// ---------------------------------------------------------------- page html
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const reg = (s) => esc(s).replace(/([®™])/g, '<sup>$1</sup>');
const bg = (ref, pos) => `background-image:url('${imgUrl(ref)}');background-position:${pos || '50% 50%'}`;

const CSS = `
@font-face{font-family:'Didot';src:url('${fileUrl(path.join(ROOT, 'app/src/fonts/gfs-didot-latin.woff2'))}') format('woff2');}
@font-face{font-family:'Arimo';src:url('${fileUrl(path.join(ROOT, 'app/src/fonts/arimo-latin.woff2'))}') format('woff2');font-weight:100 900;}
:root{--ink:#231F20;--steel:#5E6469;--steel2:#8A8F94;--hair:#D7DADD;--flame:#EF4123;--paper:#fff;}
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#e9eaeb}
body{font-family:Arimo,Arial,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.page{width:8.5in;height:11in;background:var(--paper);position:relative;overflow:hidden;page-break-after:always;padding:0.55in 0.6in 0.5in}
.page:last-child{page-break-after:auto}
sup{font-size:.6em;line-height:0}
.kicker{font-size:7.5pt;letter-spacing:.22em;text-transform:uppercase;color:var(--flame);display:flex;gap:14px;align-items:center}
.kicker::before{content:'';width:22px;height:1.5px;background:var(--flame)}
.kicker .grey{color:var(--steel2)}
.stamp{position:absolute;top:.5in;right:.6in;font-size:6.8pt;letter-spacing:.2em;text-transform:uppercase;color:var(--flame);border:1px solid var(--flame);padding:4px 8px 3px}
.stamp.over{background:#fff}
h1{font-family:Didot,serif;font-weight:400;font-size:var(--h1,58pt);line-height:.98;letter-spacing:-.01em;margin-top:14px}
.line{font-family:Didot,serif;font-size:var(--lineSize,17pt);color:var(--steel);margin-top:10px}
.hero{margin:20px -0.6in 0;height:var(--heroH,4.8in);background-size:cover;background-color:#eee}
.hero.inset{margin:20px 0 0}
.cap{font-size:7pt;color:var(--steel2);margin-top:7px;letter-spacing:.02em;line-height:1.4}
.data{display:flex;border-top:1.5px solid var(--ink);border-bottom:1px solid var(--hair);margin-top:var(--dataTop,20px)}
.data div{padding:10px 12px 12px 0;border-right:1px solid var(--hair);margin-right:12px;flex:1 1 0;min-width:0}
.data div.w2{flex-grow:1.5}
.data div:last-child{border-right:0;margin-right:0}
.data dt{font-size:6.5pt;letter-spacing:.2em;text-transform:uppercase;color:var(--steel2);margin-bottom:5px}
.data dd{font-size:var(--ddSize,8.5pt);line-height:1.35}
.lede{font-family:Didot,serif;font-size:var(--ledeSize,15.5pt);line-height:1.4;margin-top:var(--ledeTop,24px);max-width:6.5in}
.foot{position:absolute;left:.6in;right:.6in;bottom:.38in;display:flex;align-items:center;gap:14px;font-size:6.5pt;letter-spacing:.18em;text-transform:uppercase;color:var(--steel2);border-top:1px solid var(--hair);padding-top:9px}
.foot img{height:12px}
.foot .dr{color:var(--flame)}
.foot .pg{margin-left:auto}
.beats{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:var(--beatsTop,14px)}
.beat .n{font-size:7pt;letter-spacing:.2em;color:var(--flame)}
.beat h2{font-family:Didot,serif;font-weight:400;font-size:var(--beatH,17pt);margin:6px 0 10px;padding-bottom:9px;border-bottom:1px solid var(--hair)}
.beat p{font-size:var(--beatSize,8.6pt);line-height:1.55;color:#3a3536}
.team{margin-top:14px;font-size:7.4pt;line-height:1.5;color:var(--steel);display:flex;gap:10px}
.team b{font-size:6.5pt;letter-spacing:.2em;text-transform:uppercase;color:var(--steel2);font-weight:400;white-space:nowrap;padding-top:1px}
.section{display:flex;align-items:baseline;justify-content:space-between;margin-top:var(--secTop,24px);border-top:1.5px solid var(--ink);padding-top:10px}
.section h3{font-family:Didot,serif;font-weight:400;font-size:15pt}
.section .tag{font-size:6.5pt;letter-spacing:.2em;text-transform:uppercase;color:var(--steel2)}
.planwrap{margin-top:12px}
.legend{display:flex;gap:20px;flex-wrap:wrap;font-size:7pt;color:var(--steel);margin-top:6px;align-items:center}
.legend span{display:flex;align-items:center;gap:6px}
.zones{display:grid;gap:18px;margin-top:14px}
.zones .z b{display:inline-flex;flex:none;align-items:center;justify-content:center;width:17px;height:17px;border:1.2px solid var(--flame);border-radius:50%;color:var(--flame);font-size:7.5pt;margin-right:7px}
.zones .z h4{font-size:7pt;letter-spacing:.16em;text-transform:uppercase;font-weight:700;display:flex;align-items:center;margin-bottom:6px;line-height:1.25}
.zones .z p{font-size:7.8pt;line-height:1.5;color:#3a3536}
.note{font-size:7pt;color:var(--steel2);margin-top:6px;font-style:italic;line-height:1.4}
.strip{margin:16px -0.6in 0;height:var(--stripH,1.5in);background-size:cover}
.pair{display:grid;grid-template-columns:var(--pairCols,1fr 1fr);gap:14px;margin-top:var(--pairTop,18px)}
.pair .ph{height:var(--pairH,2.3in);background-size:cover;background-color:#eee}
.quote{margin-top:var(--quoteTop,22px);display:grid;grid-template-columns:28px 1fr;gap:10px}
.quote .mk{font-family:Didot,serif;font-size:42pt;line-height:.8;color:var(--flame)}
.quote p{font-family:Didot,serif;font-size:var(--quoteSize,15pt);line-height:1.35}
.quote .who{font-size:7pt;letter-spacing:.18em;text-transform:uppercase;color:var(--steel2);margin-top:8px;line-height:1.5}
.wide{margin:-0.55in -0.6in 0;height:var(--wideH,3.75in);background-size:cover}
.tbl{width:100%;border-collapse:collapse;margin-top:10px;font-size:7.6pt}
.tbl th{font-size:6.3pt;letter-spacing:.18em;text-transform:uppercase;color:var(--steel2);font-weight:400;text-align:left;padding:5px 8px 5px 0;border-bottom:1px solid var(--ink)}
.tbl td{padding:5px 8px 5px 0;border-bottom:1px solid var(--hair);vertical-align:top;line-height:1.35}
.prods{display:grid;gap:22px;margin-top:16px}
.prod .ph{height:var(--prodH,1.55in);background-size:cover;background-color:#f1f2f3}
.prod .coll{font-size:6.5pt;letter-spacing:.32em;color:var(--flame);margin-top:12px}
.prod h4{font-family:Didot,serif;font-weight:400;font-size:var(--prodName,13pt);margin:4px 0 8px;line-height:1.15}
.prod dl{border-top:1px solid var(--hair)}
.prod dl div{display:grid;grid-template-columns:62px 1fr;gap:6px;padding:var(--rowPad,6px) 0;border-bottom:1px solid var(--hair)}
.prod dt{font-size:6.3pt;letter-spacing:.18em;text-transform:uppercase;color:var(--steel2);padding-top:1px}
.prod dd{font-size:var(--prodSize,7.8pt);line-height:1.4}
.prods.one .prod{display:grid;grid-template-columns:2.6in 1fr;gap:22px}
.prods.one .prod .ph{height:auto;min-height:1.7in}
.prods.one .prod .coll{margin-top:0}
.prods.nophoto .prod .coll{margin-top:0}
.sheetfoot{display:grid;grid-template-columns:1.65fr 1fr;gap:28px;margin-top:16px}
.sheetfoot .section{margin-top:0}
.sheetfoot .prods{gap:16px;margin-top:10px}
.sheetfoot .cta{padding-top:10px}
.sheetfoot .cta p{font-size:12pt;margin-bottom:10px}
.affinity{font-size:6.8pt;line-height:1.45;color:var(--steel);margin-top:10px}
.closing{display:grid;grid-template-columns:1.55fr 1fr;gap:34px;margin-top:var(--closeTop,24px);align-items:start}
.sources h5{font-size:6.5pt;letter-spacing:.2em;text-transform:uppercase;color:var(--steel2);margin-bottom:6px}
.sources ol{padding-left:14px;font-size:var(--srcSize,6.6pt);line-height:1.45;color:var(--steel)}
.sources li{margin-bottom:3px;overflow-wrap:anywhere}
.cta{border-top:1.5px solid var(--ink);padding-top:12px}
.cta p{font-family:Didot,serif;font-size:13pt;line-height:1.3;margin-bottom:12px}
.cta .sub{font-size:8pt;line-height:1.5;color:var(--steel);margin:-4px 0 12px}
.cta a{display:inline-block;font-size:7pt;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);text-decoration:none;border-bottom:1.5px solid var(--flame);padding-bottom:4px}
.cta .url{font-size:7pt;color:var(--steel2);margin-top:8px}
`;

const footer = (P, n, total) => `<footer class="foot"><img src="${fileUrl(path.join(ROOT, 'images/portfolio/bromic-logo.png'))}" alt="Bromic"><span>Project File · ${esc(P.name)}</span>${P.draft ? '<span class="dr">Draft – facts to confirm</span>' : ''}<span class="pg">${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></footer>`;
const stamp = (P, over) => (P.draft ? `<div class="stamp${over ? ' over' : ''}">Draft – facts to confirm</div>` : '');
const kicker = (P) => `<div class="kicker">Project File <span class="grey">${esc(P.sector)} · ${esc(P.country)}</span></div>`;

function dataStrip(P) {
  return `<dl class="data">${P.data.map(([k, v]) => `<div class="${v.length > 46 ? 'w2' : ''}"><dt>${esc(k)}</dt><dd>${reg(v)}</dd></div>`).join('')}</dl>`;
}
function heroBlock(P, opt) {
  const [w] = imageSize(P.hero.img);
  const inset = w && w < 900;
  return `<div class="hero${inset ? ' inset' : ''}" style="${bg(P.hero.img, P.hero.pos)}"></div><div class="cap">${reg(P.hero.caption)}</div>`;
}
function beatsBlock(P) {
  return `<div class="beats">${P.beats.map(([h, t], i) => `<div class="beat"><div class="n">0${i + 1}</div><h2>${esc(h)}</h2><p>${reg(t)}</p></div>`).join('')}</div>` +
    (P.team && P.team.length ? `<div class="team"><b>Project team</b><span>${reg(P.team.join(' · '))}</span></div>` : '');
}
function zonesBlock(P, H) {
  const z = P.zones;
  const cols = Math.min(4, z.items.length);
  const plan = z.shape === 'none' ? '' : `<div class="planwrap">${zonePlan(z, 700, H)}<div class="legend"><span><svg width="22" height="12"><rect x="1" y="1" width="20" height="10" rx="4" fill="#F2D9CC" stroke="${FLAME}" stroke-dasharray="3 3" stroke-opacity=".55"/></svg>Heated zone</span><span>Heater counts and positions are not shown</span></div></div>`;
  return `<div class="section"><h3>${esc(z.title || 'Where The Warmth Goes')}</h3><span class="tag">${z.shape === 'none' ? esc(z.tag || 'As described') : 'Illustrative layout · not to scale'}</span></div>${plan}
  <div class="zones" style="grid-template-columns:repeat(${cols},1fr)">${z.items.map((it) => `<div class="z"><h4><b>${it.l}</b>${esc(it.name)}</h4><p>${reg(it.text)}</p></div>`).join('')}</div>
  ${z.shape === 'none' ? '' : `<p class="note">${esc(z.note || 'Zones are drawn from the source’s description, not from site drawings.')}</p>`}`;
}
function tableBlock(P) {
  const t = P.table;
  return `<div class="section"><h3>${esc(t.title)}</h3><span class="tag">${esc(t.tag || 'As listed by the source')}</span></div>
  <table class="tbl"><thead><tr>${t.cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((c) => `<td>${reg(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function quoteBlock(P) {
  const q = P.quote;
  return `<div class="quote"><div class="mk">“</div><div><p>${reg(q.text)}</p><div class="who">${esc(q.who)}${q.role ? ' · ' + esc(q.role) : ''}</div></div></div>`;
}
function pairBlock(P, photos) {
  const cols = photos.map((p) => { const [w, h] = imageSize(p.img); return h > w * 1.1 ? '0.62fr' : '1fr'; }).join(' ');
  return `<div class="pair" style="--pairCols:${cols}">${photos.map((p) => `<div><div class="ph" style="${bg(p.img, p.pos)}"></div><div class="cap">${reg(p.caption)}</div></div>`).join('')}</div>`;
}
function productsBlock(P, opt) {
  const ps = P.products;
  const one = ps.length === 1 && !opt.compact;
  const noPhoto = opt.noProductPhotos || ps.every((p) => !p.img);
  const cols = one ? 1 : Math.max(ps.length, opt.compact ? 2 : 3);
  const card = (p) => {
    const rows = [['Where', p.where], ...(p.qty ? [['Quantity', p.qty]] : []), ['Mounting', p.mount || 'To confirm'], ...(p.extra || []), ['Controls', p.controls]];
    return `<div class="prod">${!noPhoto && p.img ? `<div class="ph" style="${bg(p.img, p.pos)}"></div>` : ''}<div><div class="coll">${esc(p.coll.toUpperCase())}</div><h4>${reg(p.name)}</h4>
    <dl>${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${reg(clean(v))}</dd></div>`).join('')}</dl></div></div>`;
  };
  return `<div class="section"><h3>Heaters &amp; Controls</h3><span class="tag">${P.draft ? 'As reported' : 'As specified'}</span></div>
  <div class="prods${one ? ' one' : ''}${noPhoto ? ' nophoto' : ''}" style="grid-template-columns:repeat(${cols},1fr)">${ps.map(card).join('')}</div><p class="affinity">${esc(AFFINITY)}</p>`;
}
function closingBlock(P) {
  const items = P.sources.concat(P.notes);
  return `<div class="closing"><div class="sources"><h5>Sources &amp; Notes</h5><ol>${items.map((s) => `<li>${reg(s)}</li>`).join('')}</ol></div>
  <div class="cta"><p>${esc(P.cta.lead || 'Planning an outdoor space like this one?')}</p><div class="sub">${esc(P.cta.sub || 'Send us your plans and our design team will map the heat for every zone.')}</div><a href="${P.cta.href}">${esc(P.cta.label)}</a><div class="url">${esc(P.cta.url)}</div></div></div>`;
}

// Layouts. Each returns an array of page bodies; opt carries the step-downs tried by fit().
function layout1(P, opt) {
  // one sheet: cover band, the three beats, then heaters + controls beside the CTA and sources
  const nameSize = P.name.length > 30 ? 32 : P.name.length > 20 ? 36 : 40;
  const v = `--h1:${opt.h1 || nameSize}pt;--lineSize:13pt;--heroH:${opt.heroH || 2.9}in;--ledeSize:${opt.ledeSize || 12}pt;--ledeTop:14px;--dataTop:12px;--ddSize:8pt;--beatH:12.5pt;--beatSize:${opt.beatSize || 7.8}pt;--beatsTop:14px;--quoteSize:12pt;--quoteTop:12px;--prodName:11pt;--prodSize:7.4pt;--rowPad:3px;--srcSize:6.1pt`;
  const prods = P.products.map((p) => {
    const rows = [['Where', p.where], ...(p.qty ? [['Quantity', p.qty]] : []), ['Mounting', p.mount || 'To confirm'], ...(p.extra || []), ['Controls', p.controls]];
    return `<div class="prod"><div class="coll">${esc(p.coll.toUpperCase())}</div><h4>${reg(p.name)}</h4><dl>${rows.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${reg(clean(val))}</dd></div>`).join('')}</dl></div>`;
  }).join('');
  const items = P.sources.concat(P.notes);
  return [`<section class="page" style="${v}">${stamp(P, false)}${kicker(P)}<h1>${reg(P.name)}</h1><div class="line">${reg(P.line)}</div>
    ${heroBlock(P, opt)}${dataStrip(P)}${opt.lede === false ? '' : `<p class="lede">${reg(P.lede)}</p>`}${beatsBlock(P)}
    ${opt.quote && P.quote ? quoteBlock(P) : ''}
    <div class="sheetfoot"><div><div class="section"><h3>Heaters &amp; Controls</h3><span class="tag">${P.draft ? 'As reported' : 'As specified'}</span></div>
      <div class="prods nophoto" style="grid-template-columns:repeat(${Math.min(2, P.products.length)},1fr)">${prods}</div><p class="affinity">${esc(AFFINITY)}</p></div>
      <div><div class="cta"><p>${esc(P.cta.lead || 'Planning an outdoor space like this one?')}</p><a href="${P.cta.href}">${esc(P.cta.label)}</a><div class="url">${esc(P.cta.url)}</div></div>
      <div class="sources" style="margin-top:14px"><h5>Sources &amp; Notes</h5><ol>${items.map((x) => `<li>${reg(x)}</li>`).join('')}</ol></div></div></div></section>`];
}
function cover(P, opt) {
  const v = `--heroH:${opt.heroH || 4.8}in;--h1:${P.name.length > 30 ? 44 : P.name.length > 20 ? 50 : 58}pt`;
  return `<section class="page" style="${v}">${stamp(P, false)}${kicker(P)}<h1>${reg(P.name)}</h1><div class="line">${reg(P.line)}</div>
    ${heroBlock(P, opt)}${dataStrip(P)}<p class="lede">${reg(P.lede)}</p></section>`;
}
function layout2(P, opt) {
  const photos = (P.photos || []).slice(0, opt.photos ?? 2);
  let middle = '';
  if (opt.zones && P.zones) middle = zonesBlock(P, opt.planH || 190);
  else if (opt.table && P.table) middle = tableBlock(P);
  else if (photos.length) middle = pairBlock(P, photos);
  const v = `--pairH:${opt.pairH || 2.25}in;--prodH:${opt.prodH || 1.15}in;--quoteSize:${opt.quoteSize || 14}pt;--secTop:20px;--closeTop:20px`;
  return [cover(P, opt), `<section class="page" style="${v}">${stamp(P, false)}<div class="kicker">The Project</div>${beatsBlock(P)}${middle}
    ${opt.quote && P.quote ? quoteBlock(P) : ''}${productsBlock(P, { noProductPhotos: opt.noProductPhotos })}${closingBlock(P)}</section>`];
}
function layout3(P, opt) {
  const photos = P.photos || [];
  const wide = photos[0];
  const rest = photos.slice(1);
  let p2mid = '';
  if (P.zones) p2mid = zonesBlock(P, opt.planH || 230);
  else if (P.table) p2mid = tableBlock(P);
  else if (rest.length) p2mid = pairBlock(P, rest.slice(0, 2));
  const strip = P.zones && rest[0] && opt.strip !== false ? `<div class="strip" style="${bg(rest[0].img, rest[0].pos)}"></div><div class="cap">${reg(rest[0].caption)}</div>` : '';
  const v2 = `--pairH:${opt.pairH || 3.0}in;--stripH:${opt.stripH || 1.5}in;--quoteSize:15pt`;
  const v3 = `--wideH:${opt.wideH || 3.75}in;--prodH:${opt.prodH || 1.55}in`;
  return [cover(P, opt),
    `<section class="page" style="${v2}">${stamp(P, false)}<div class="kicker">The Project</div>${beatsBlock(P)}${p2mid}${opt.quote && P.quote && opt.quoteOn === 2 ? quoteBlock(P) : ''}${strip}</section>`,
    `<section class="page" style="${v3}">${stamp(P, true)}${wide ? `<div class="wide" style="${bg(wide.img, wide.pos)}"></div><div class="cap">${reg(wide.caption)}</div>` : ''}
    ${opt.quote && P.quote && opt.quoteOn === 3 ? quoteBlock(P) : ''}<div style="height:6px"></div>${productsBlock(P, {})}${closingBlock(P)}</section>`];
}

function candidates(P) {
  const want = P.pages || 2;
  const L1 = [
    { pages: 1, quote: true }, { pages: 1, quote: true, heroH: 2.6 }, { pages: 1, quote: false }, { pages: 1, quote: false, heroH: 2.6, beatSize: 7.6 },
    { pages: 1, quote: false, heroH: 2.2, beatSize: 7.5 }, { pages: 1, quote: false, heroH: 2.3, beatSize: 7.4, lede: false }];
  // rich two-page forms keep the plan or table, the quote and the product photographs
  const L2rich = [
    { pages: 2, zones: true, table: true, quote: true }, { pages: 2, zones: true, table: true, quote: true, planH: 160, prodH: 1.0, pairH: 1.9 },
    { pages: 2, zones: true, table: true, quote: true, planH: 150, photos: 1, pairH: 1.8, prodH: 0.95 }];
  const L3 = [
    { pages: 3, quote: true, quoteOn: 2 }, { pages: 3, quote: true, quoteOn: 2, wideH: 3.2 }, { pages: 3, quote: true, quoteOn: 2, wideH: 2.8, prodH: 1.3 },
    { pages: 3, quote: true, quoteOn: 3, wideH: 2.8, prodH: 1.2 }, { pages: 3, quote: true, quoteOn: 2, planH: 200, stripH: 1.2, wideH: 2.6, prodH: 1.15 },
    { pages: 3, quote: true, quoteOn: 2, strip: false, planH: 200, wideH: 2.6, prodH: 1.1 }];
  const L2lean = [
    { pages: 2, zones: true, table: true, quote: false }, { pages: 2, zones: true, table: true, quote: false, planH: 150, noProductPhotos: true },
    { pages: 2, zones: false, table: false, quote: true, photos: 1, pairH: 1.8, noProductPhotos: true },
    { pages: 2, zones: false, table: false, quote: false, photos: 0, noProductPhotos: true }];
  const rich3 = (P.photos || []).length >= 1;
  if (want === 1) return [...L1, ...L2rich, ...L2lean];
  if (want === 3) return [...L3, ...L2rich, ...L2lean];
  return [...L2rich, ...(rich3 ? L3 : []), ...L2lean];
}
const render = (P, opt) => (opt.pages === 1 ? layout1 : opt.pages === 3 ? layout3 : layout2)(P, opt);
function html(P, bodies) {
  const total = bodies.length;
  const withFoot = bodies.map((b, i) => b.replace(/<\/section>$/, footer(P, i + 1, total) + '</section>'));
  return `<!doctype html><html lang="en-US"><head><meta charset="utf-8"><title>Project File – ${esc(P.name)}</title><style>${CSS}</style></head><body>${withFoot.join('\n')}</body></html>`;
}

// ---------------------------------------------------------------- print check
async function check(page, P) {
  return page.evaluate((draft) => {
    const bad = [];
    const vis = (el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
    document.querySelectorAll('.page').forEach((pg, i) => {
      const r = pg.getBoundingClientRect();
      const foot = pg.querySelector('.foot').getBoundingClientRect();
      pg.querySelectorAll('*').forEach((el) => {
        if (!vis(el) || el.closest('.hero,.wide,.strip') || el.closest('svg')) return;
        const b = el.getBoundingClientRect();
        if (b.bottom > r.bottom + 0.5 || b.right > r.right + 0.5 || b.left < r.left - 0.5) bad.push(`p${i + 1}: ${el.tagName}.${el.className} off page`);
        if (el.scrollHeight > el.clientHeight + 1 && getComputedStyle(el).overflow === 'hidden' && !el.classList.contains('page')) bad.push(`p${i + 1}: ${el.className} clipped`);
        if (el.scrollWidth > el.clientWidth + 1 && el.tagName === 'DD') bad.push(`p${i + 1}: dd overflows`);
      });
      [...pg.children].filter((c) => !c.classList.contains('foot') && !c.classList.contains('stamp')).forEach((c) => {
        const b = c.getBoundingClientRect(); if (b.height && b.bottom > foot.top - 4) bad.push(`p${i + 1}: ${c.className || c.tagName} runs into footer`);
      });
      // overlaps between consecutive blocks (normal flow should never overlap; a stamp over text would)
      const kids = [...pg.children].filter((c) => vis(c) && !c.classList.contains('foot') && !c.classList.contains('stamp'));
      for (let a = 0; a < kids.length; a++) for (let b2 = a + 1; b2 < kids.length; b2++) {
        const A = kids[a].getBoundingClientRect(), B = kids[b2].getBoundingClientRect();
        const ov = Math.min(A.right, B.right) - Math.max(A.left, B.left) > 1 && Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top) > 1;
        if (ov) bad.push(`p${i + 1}: ${kids[a].className || kids[a].tagName} overlaps ${kids[b2].className || kids[b2].tagName}`);
      }
      // the stamp must not sit on text
      const st = pg.querySelector('.stamp');
      if (st) { const S = st.getBoundingClientRect(); pg.querySelectorAll('h1,.kicker,.beat,.line').forEach((el) => { const B = el.getBoundingClientRect(); if (Math.min(S.right, B.right) - Math.max(S.left, B.left) > 1 && Math.min(S.bottom, B.bottom) - Math.max(S.top, B.top) > 1 && el.textContent.trim()) { const range = document.createRange(); range.selectNodeContents(el); for (const rr of range.getClientRects()) if (Math.min(S.right, rr.right) - Math.max(S.left, rr.left) > 1 && Math.min(S.bottom, rr.bottom) - Math.max(S.top, rr.top) > 1) { bad.push(`p${i + 1}: stamp over text`); break; } } }); }
      if (draft && !pg.textContent.includes('Draft – facts to confirm')) bad.push(`p${i + 1}: draft label missing`);
    });
    document.querySelectorAll('img').forEach((im) => { if (!im.naturalWidth) bad.push('missing image ' + im.src); });
    const text = document.body.innerText;
    if (/\[\[VERIFY/i.test(text)) bad.push('raw [[VERIFY in text');
    if (/\[\^s\d/.test(text)) bad.push('raw footnote marker in text');
    if (/coming soon/i.test(text)) bad.push('"coming soon" in text');
    if (/500 series/i.test(text)) bad.push('legacy "500 Series" naming');
    if (/[!]/.test(text.replace(/<!--.*?-->/g, ''))) bad.push('exclamation mark');
    if (/Claude/.test(text)) bad.push('"Claude" in text');
    return bad;
  }, P.draft);
}

// ---------------------------------------------------------------- run
async function buildOne(browser, id, log) {
  const dataFile = path.join(HERE, 'data', id + '.json');
  let P;
  if (fs.existsSync(dataFile)) { const old = JSON.parse(fs.readFileSync(dataFile, 'utf8')); if (old.locked) P = old; }
  if (!P) P = buildP(id);
  const refs = new Set([P.hero.img, ...(P.photos || []).map((p) => p.img), ...P.products.map((p) => p.img)].filter(Boolean));
  prepareImages([...refs]);
  for (const r of refs) if (!fs.existsSync(path.join(CACHE, r.replace(':', '__') + '.jpg'))) throw new Error('image not prepared ' + r);
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
  let chosen = null; let last = null;
  const tmp = path.join(CACHE, 'html'); fs.mkdirSync(tmp, { recursive: true });
  const cands = process.env.PF_FORCE ? [JSON.parse(process.env.PF_FORCE)] : candidates(P);
  for (const opt of cands) {
    if (opt.pages === 3 && !(P.photos || []).length) continue;
    const doc = html(P, render(P, opt));
    const f = path.join(tmp, id + '.html');
    fs.writeFileSync(f, doc);
    await page.goto(fileUrl(f), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    let problems = await check(page, P);
    for (const h of [4.3, 3.9, 3.5]) {
      if (!problems.length || opt.pages === 1 || problems.some((x) => !x.startsWith('p1:'))) break;
      opt.heroH = h;
      fs.writeFileSync(f, html(P, render(P, opt)));
      await page.goto(fileUrl(f), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      problems = await check(page, P);
    }
    last = { opt, problems };
    if (process.env.PF_DEBUG) console.log('  try', JSON.stringify(opt), problems.slice(0, 5).join(' | '));
    if (!problems.length) { chosen = opt; break; }
  }
  if (!chosen && process.env.PF_FORCE) { chosen = last.opt; console.log('FORCED with problems:', last.problems.join(' | ')); }
  if (!chosen) { await page.close(); throw new Error(`${id}: no layout fits – ${last.problems.slice(0, 4).join('; ')}`); }
  P.layout = chosen;
  delete P.built;
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(P, null, 1) + '\n');
  const outDir = path.join(HERE, id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, 'pages'), { recursive: true });
  const pages = await page.$$('.page');
  const pngs = [];
  for (let i = 0; i < pages.length; i++) { const p = path.join(outDir, 'pages', `p${i + 1}.png`); await pages[i].screenshot({ path: p }); pngs.push(path.relative(HERE, p)); }
  await page.emulateMedia({ media: 'print' });
  const pdf = path.join(outDir, `Bromic-Project-File-${P.slug}.pdf`);
  await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
  await page.close();
  const size = fs.statSync(pdf).size;
  if (size > 3 * 1024 * 1024) throw new Error(`${id}: PDF ${size} bytes > 3 MB`);
  const thumb = path.join(outDir, 'cover-thumb.webp');
  execFileSync('python3', ['-I', '-c', "import sys\nfrom PIL import Image\nim=Image.open(sys.argv[1]).convert('RGB'); im.thumbnail((640,830)); im.save(sys.argv[2],'WEBP',quality=82)", path.join(HERE, pngs[0]), thumb]);
  log(`ok ${id}: ${pages.length} p, ${(size / 1024).toFixed(0)} KB, layout ${JSON.stringify(chosen)}`);
  return { id, item_id: id, title: P.name, kind: P.kind, pdf: path.relative(HERE, pdf), cover: pngs[0], thumb: path.relative(ROOT, thumb), pages: pngs, page_count: pngs.length, bytes: size };
}

async function contactSheet(index) {
  const py = `import sys,json\nfrom PIL import Image,ImageDraw\nrows=json.load(sys.stdin); W=6; tw,th=272,352\nH=(len(rows)+W-1)//W\nsheet=Image.new('RGB',(W*tw+ (W+1)*12, H*(th+26)+12),'#e9eaeb'); d=ImageDraw.Draw(sheet)\nfor i,(p,label) in enumerate(rows):\n  im=Image.open(p).convert('RGB'); im.thumbnail((tw,th)); x=12+(i%W)*(tw+12); y=12+(i//W)*(th+26); sheet.paste(im,(x,y)); d.text((x,y+th+4),label,fill='#231F20')\nsheet.save(sys.argv[1],'JPEG',quality=82)\n`;
  const rows = index.map((r) => [path.join(HERE, r.cover), `${r.id.slice(0, 34)} (${r.page_count}p${r.kind === 'web-draft' ? ', draft' : ''})`]);
  execFileSync('python3', ['-I', '-c', py, path.join(HERE, 'contact-sheet.jpg')], { input: JSON.stringify(rows) });
}

(async () => {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const ids = args.length ? args : Object.keys(COPY).filter((k) => !COPY[k].skip);
  let browser = await chromium.launch();
  let n = 0;
  const idxFile = path.join(HERE, 'index.json');
  const prev = fs.existsSync(idxFile) ? JSON.parse(fs.readFileSync(idxFile, 'utf8')) : { built: [], skipped: [] };
  const byId = Object.fromEntries((prev.built || []).map((r) => [r.id, r]));
  const failed = [];
  for (const id of ids) {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (!browser.isConnected() || ++n % 8 === 0) { try { await browser.close(); } catch {} browser = await chromium.launch(); }
      try { byId[id] = await buildOne(browser, id, console.log); break; } catch (e) {
        if (attempt === 0 && /closed|crash|Target/i.test(e.message)) { try { await browser.close(); } catch {} browser = await chromium.launch(); continue; }
        failed.push(id); console.error('FAIL', e.message); break;
      }
    }
  }
  await browser.close();
  const order = Object.keys(COPY);
  const built = order.filter((k) => byId[k] && !COPY[k].skip).map((k) => byId[k]);
  const skipped = order.filter((k) => COPY[k].skip).map((k) => ({ id: k, kind: COPY[k].kind || 'bromic', reason: COPY[k].skip }));
  const index = { generated: '2026-11-22', engine: 'reports/designed/case-studies/build.js', theme: 'reports/themes/project-file',
    counts: { built: built.length, bromic: built.filter((r) => r.kind === 'bromic').length, web_draft: built.filter((r) => r.kind === 'web-draft').length, skipped: skipped.length },
    total_bytes: built.reduce((a, r) => a + r.bytes, 0), built, skipped };
  fs.writeFileSync(idxFile, JSON.stringify(index, null, 1) + '\n');
  await contactSheet(built);
  console.log(`built ${built.length}, skipped ${skipped.length}, failed ${failed.length}${failed.length ? ': ' + failed.join(', ') : ''}; ${(index.total_bytes / 1048576).toFixed(1)} MB`);
  if (failed.length) process.exitCode = 1;
})();
