#!/usr/bin/env node
// Renders a branded PDF of every gated asset (reports, guides, kits, sales kits) into app/dist/pdf/<id>.pdf, from the same
// built content the Hub shows. Run after `node scripts/build.mjs` (deploy.sh does). Needs Chromium (Playwright).
//   node scripts/pdf.mjs            all gated documents
//   node scripts/pdf.mjs A01-v2      one item
// The PDF is the reader-facing final version: internal sections (editor's notes, layout notes, change logs, open questions),
// [[VERIFY]] flags and draft labels are stripped (they stay visible in the Hub for reviewers), and every section gets a photo.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const APP = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(APP, 'dist');
const OUT = path.join(DIST, 'pdf');
const HUB = JSON.parse(fs.readFileSync(path.join(DIST, 'data.js'), 'utf8').replace(/^window\.HUB=/, '').replace(/;\s*$/, ''));
const only = process.argv.slice(2);
const DOC_TYPES = ['report', 'gated-guide', 'spec-kit', 'sales-kit', 'stats-page'];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const IMG = Object.fromEntries(HUB.images.map((i) => [i.id, i]));
const AUD = HUB.matrix.audiences; const ASSET = Object.fromEntries(HUB.assets.map((a) => [a.id, a]));

export const pdfItems = (items) => items.filter((it) => it.gated === true && DOC_TYPES.includes(it.type));

const css = `
@page { size: Letter; margin: 0.8in 0.75in 0.85in; }
@page :first { margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font: 10.5pt/1.55 "Helvetica Neue", Helvetica, Arial, sans-serif; color: #231F20; }
h1, h2, h3, h4 { font-family: Georgia, "Times New Roman", serif; font-weight: 400; line-height: 1.2; color: #231F20; break-after: avoid; }
h2 { font-size: 17pt; margin: 22pt 0 6pt; padding-top: 8pt; border-top: 0.75pt solid #DDD8D0; }
h3 { font-size: 12.5pt; margin: 14pt 0 4pt; }
p, ul, ol { margin: 0 0 8pt; orphans: 3; widows: 3; }
li { margin: 2pt 0; }
a { color: #231F20; text-decoration-color: #EF4123; }
strong { font-weight: 600; }
blockquote { margin: 12pt 0; padding: 2pt 0 2pt 12pt; border-left: 2pt solid #EF4123; font: italic 12pt/1.5 Georgia, serif; color: #4A4546; }
figure { margin: 12pt 0; break-inside: avoid; }
figure img { width: 100%; max-height: 3.6in; object-fit: cover; display: block; }
figcaption { font-size: 8pt; color: #71777D; margin-top: 3pt; }
table { border-collapse: collapse; width: 100%; font-size: 8.8pt; line-height: 1.4; margin: 8pt 0 12pt; break-inside: auto; }
tr { break-inside: avoid; }
th { text-align: left; font: 600 7.5pt/1.3 "Helvetica Neue", Helvetica, Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #575C61; background: #F4F1EC; }
th, td { padding: 5pt 6pt; border-bottom: 0.5pt solid #DDD8D0; vertical-align: top; text-align: left; }
code { font-size: 9pt; background: #F4F1EC; padding: 0 3pt; }
hr { border: 0; height: 0.75pt; background: #DDD8D0; margin: 16pt 0; }
sup.cite a { color: #C7321A; text-decoration: none; font-weight: 600; font-size: 7pt; }
mark.verify { background: #F6ECD9; color: #8A5A12; font-size: .85em; font-weight: 600; padding: 0 3pt; }
.diagram { border: 0.75pt dashed #CBC5BB; padding: 8pt 10pt; margin: 10pt 0; font-size: 9pt; color: #71777D; }
.cover { height: 11in; position: relative; display: flex; flex-direction: column; background: #F4F1EC; page-break-after: always; }
.cover .top { padding: 0.75in 0.75in 0; display: flex; justify-content: space-between; align-items: flex-start; }
.wordmark { font: 400 20pt/1 Georgia, serif; letter-spacing: .32em; display: inline-flex; flex-direction: column; align-items: center; }
.wordmark small { font: 600 6pt/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: .45em; margin-top: 4pt; color: #71777D; }
.cover .label { font: 600 7.5pt/1.4 "Helvetica Neue", Arial, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #575C61; }
.cover .draft { border: 0.75pt solid #EF4123; color: #231F20; padding: 4pt 8pt; font: 600 7.5pt/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; }
.cover .titles { padding: 0.55in 0.75in 0.35in; }
.cover .rule { width: 0.55in; height: 2pt; background: #EF4123; margin-bottom: 14pt; }
.cover h1 { font-size: 30pt; line-height: 1.12; margin: 8pt 0 12pt; max-width: 6.4in; text-wrap: balance; }
.cover .dek { font: italic 13pt/1.5 Georgia, serif; color: #4A4546; max-width: 6in; margin: 0; }
.cover .hero { flex: 1; min-height: 0; margin: 0 0.75in; overflow: hidden; background: #ECE7DF; }
.cover .hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cover .meta { padding: 16pt 0.75in 0.6in; display: flex; gap: 28pt; font-size: 8.5pt; color: #575C61; }
.cover .meta b { display: block; font: 600 7pt/1.4 "Helvetica Neue", Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #71777D; }
.sources { font-size: 8.5pt; line-height: 1.45; padding-left: 14pt; }
.sources li { margin: 0 0 5pt; break-inside: avoid; }
.sources .sup { color: #575C61; }
.cta { margin-top: 20pt; background: #231F20; color: #F4F1EC; padding: 14pt 16pt; break-inside: avoid; }
.cta .label { font: 600 7pt/1.4 "Helvetica Neue", Arial, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #CBC5BB; }
.cta p { font: 400 14pt/1.3 Georgia, serif; margin: 4pt 0 0; color: #F4F1EC; }
.notice { margin-top: 14pt; font-size: 8pt; color: #71777D; }
figure.sec { margin: 0 0 14pt; }
figure.sec img { width: 100%; height: 3.4in; max-height: none; object-fit: cover; }
.band { height: 1.3in; overflow: hidden; margin: 0 0 14pt; }
.band img { width: 100%; height: 100%; object-fit: cover; display: block; }
.colophon { margin-top: 18pt; padding-top: 8pt; border-top: 0.75pt solid #DDD8D0; font-size: 7.5pt; color: #71777D; }
/* trends reports: one trend per page, as the layout notes ask */
.trends section.s { break-before: page; }
.trends section.s:first-child { break-before: auto; }
.trends section.s h2 { border-top: 0; padding-top: 0; font-size: 22pt; margin-top: 0; }
.trends section.s figure.sec img { height: 4.3in; }
.trends section.s p strong:first-child { font-family: Georgia, serif; }
.trends section.lead { break-before: auto; }
.trends main { font-size: 12pt; line-height: 1.55; }
.trends section.s > p:first-of-type > strong:first-child { display: block; font: 400 40pt/1 Georgia, serif; color: #EF4123; margin: 4pt 0 6pt; }
.trends section.s ul { font-size: 12.5pt; }
.trends section.s p { max-width: 6.2in; }
`;

// Internal sections never go to readers.
const INTERNAL = /editor.{0,6}s note|layout notes|notes for 454|change ?log|open questions|for review|review notes|what changed|corrections applied|reviewer|anmerkung(en)? der redaktion|redaktionsnotiz|layout-hinweise|hinweise für 454|änderungsprotokoll|offene fragen|zur prüfung|prüfhinweise|was sich geändert hat|korrekturen|prüfer|notitie van de redactie|lay-?outnotities|notities voor 454|wijzigingslog|open vragen|ter review|reviewnotities|wat is er veranderd|correcties|beoordelaar/i;
// Labels per language for the printed page (the body text comes from the translation itself).
const LBL = {
  en: { next: 'Next step', sources: 'Sources', edition: 'Edition', site: 'bromic.com', locale: 'en-US', format: 'Letter', draft: '',
    colophon: 'Confirm every installation with your local building authority and a licensed electrician or gas fitter. Wi-Fi and app features need compatible Affinity Smart-Heat controls, sold separately.' },
  de: { next: 'Nächster Schritt', sources: 'Quellen', edition: 'Ausgabe', site: 'bromic.de', locale: 'de-DE', format: 'A4', draft: 'Maschinelle Übersetzung, Entwurf',
    colophon: 'Lassen Sie jede Installation mit Ihrer Baubehörde abstimmen und von einem Elektrofachbetrieb oder Gasinstallateur ausführen (DIN VDE 0100, DVGW-TRGI). WLAN- und App-Funktionen erfordern kompatible Affinity Smart-Heat-Steuerungen, separat erhältlich.',
    aud: { RES: 'Bauherren', ARC: 'Architekten und Planer', BLD: 'Bauunternehmer und Installateure', COM: 'Gastronomie und Hotellerie' } },
  nl: { next: 'Volgende stap', sources: 'Bronnen', edition: 'Editie', site: 'bromic.nl', locale: 'nl-NL', format: 'A4', draft: 'Machinevertaling, concept',
    colophon: 'Stem elke installatie af met uw gemeente en laat haar uitvoeren door een erkend installateur (NEN 1010, NEN 1078). Wifi- en appfuncties vereisen compatibele Affinity Smart-Heat-bediening, apart verkrijgbaar.',
    aud: { RES: 'Huiseigenaren', ARC: 'Architecten en ontwerpers', BLD: 'Aannemers en installateurs', COM: 'Horeca en hotels' } },
};
const PHOTO_OK = (i) => i && !i.notes && i.kind !== 'cutout' && i.kind !== 'diagram' && i.kind !== 'heat-plan' && i.kind !== 'render' && i.status !== 'rejected' && !/coming soon|coastal|select/i.test(i.product || '');
function imagePool(it) {
  const ownOnly = [...(it.images || [])].filter((id) => IMG[id] && id !== it.hero);
  const own = [...(it.images || []), ...[...(it.html.matchAll(/`([ltwpg]-[\w.-]+)`/g))].map((m) => m[1])].filter((id) => IMG[id] && id !== it.hero);
  const aud = new Set(it.audience);
  const rest = HUB.images.filter((i) => PHOTO_OK(i) && i.id !== it.hero && (i.audiences || []).some((a) => aud.has(a) || a === 'ALL') && /^(w|l|t)-/.test(i.id));
  let h = 0; for (const c of it.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;   // stable shuffle per document
  rest.sort((x, y) => ((x.id.length * 7 + h) % 13) - ((y.id.length * 7 + h) % 13) || x.id.localeCompare(y.id));
  return { own: [...new Set(own)], rest: [...new Set(rest.map((i) => i.id))].filter((id) => !own.includes(id)), ownOnly };
}
function finalBody(it) {
  let html = it.html.replace(/<mark class="verify"[^>]*>[\s\S]*?<\/mark>/g, '').replace(/:\s*\[\[VERIFY[^\]]*\]\]\s*\.?/g, ': see the current Bromic specification sheet.').replace(/\(\s*\[\[VERIFY[^\]]*\]\]\s*\)/g, '').replace(/\s*\[\[VERIFY[^\]]*\]\]/g, '').replace(/<p>\s*<\/p>/g, '');
  const plain = (h) => h.replace(/<[^>]+>/g, '').replace(/&#39;|&rsquo;|&#x27;/g, "'").replace(/&amp;/g, '&').trim();
  // cut every internal section (from its h2 to the next h2)
  const parts = html.split(/(?=<h2[\s>])/);
  const head = (p) => plain((p.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '');
  const kept = parts.filter((p) => !/^<h2/.test(p) || !INTERNAL.test(head(p)))
    // a heading that only repeats the title is dropped (its text stays)
    .map((p) => (/^<h2/.test(p) && it.title.toLowerCase().startsWith(head(p).toLowerCase()) ? p.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, '') : p))
    .filter((p) => plain(p).length > 0);
  // trailing <hr> left by a cut section
  const pool = imagePool(it); const used = new Set();
  // numbered sections (trends 01–10) take the item's own images in order; other pages draw from the wider pool first
  const take = (numbered) => { const order = numbered ? [...pool.own, ...pool.rest] : [...pool.rest, ...pool.own]; const id = order.find((x) => !used.has(x)); if (id) used.add(id); return id && IMG[id]; };
  const fig = (im) => `<figure class="sec"><img src="${esc(im.file)}" alt="${esc(im.alt)}"></figure>`;
  const out = kept.map((p, i) => {
    const isSec = /^<h2/.test(p);
    const hasImg = /<img\s/.test(p);
    const numbered = /^<h2[^>]*>\s*\d{2}\s/.test(p);
    const im = hasImg || (!isSec && plain(p).length <= 160) ? null : take(numbered);
    const trend = numbered || /plan from the start|sources/i.test((p.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '');
    if (!isSec) return `<section class="lead">${plain(p).length > 160 && im ? fig(im) : ''}${p}</section>`;
    const body = im ? p.replace(/(<\/h2>)/, `$1${fig(im)}`) : p;
    return `<section class="${trend ? 's' : 'n'}">${body}</section>`;
  }).join('').replace(/<hr>\s*(?=<\/section>)/g, '');
  return { html: out, band: take(false) };
}

function docHTML(it, built, L = LBL.en, lang = 'en') {
  const hero = it.hero && IMG[it.hero];
  const aud = it.audience.map((a) => (L.aud && L.aud[a]) || AUD[a]?.name || a).join(' · ');
  const dek = it.dek || it.meta_description || it.summary;
  const { html, band } = finalBody(it);
  const cta = it.cta && it.cta.label ? `<div class="cta"><span class="label">${esc(L.next)}</span><p>${esc(it.cta.label)}</p></div>` : '';
  const srcs = it.sources.length ? `<section class="s">${band ? `<div class="band"><img src="${esc(band.file)}" alt=""></div>` : ''}<h2>${esc(L.sources)}</h2><ol class="sources">${it.sources.map((s) => `<li id="src-${esc(it.id)}-${esc(s.id)}"><b>${esc(s.publisher || '')}</b>${s.title ? `, ${esc(s.title)}` : ''}${s.year ? ` (${esc(s.year)})` : ''}${/^https?:/.test(s.url || '') ? `. <a href="${esc(s.url)}">${esc(s.url)}</a>` : ''}</li>`).join('')}</ol>
    <p class="colophon">${esc(L.colophon)} © ${new Date(HUB.built).getFullYear()} Bromic Heating · ${L.site}</p></section>` : '';
  const month = new Date((it.updated || HUB.built.slice(0, 10)) + 'T12:00:00Z').toLocaleString(L.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(it.title)} | Bromic Heating</title><base href="file://${DIST}/"><style>${css}</style></head><body class="${/^A01/.test(it.id) ? 'trends' : ''}">
  <section class="cover">
    <div class="top"><span class="wordmark">BROMIC<small>HEATING</small></span></div>
    <div class="titles"><div class="rule"></div><span class="label">${esc(aud)}</span><h1>${esc(it.title)}</h1>${dek ? `<p class="dek">${esc(dek)}</p>` : ''}</div>
    <div class="hero">${hero ? `<img src="${esc(hero.file)}" alt="${esc(hero.alt)}">` : ''}</div>
    <div class="meta"><span><b>${esc(L.edition)}</b>${esc(month)}</span><span><b>Bromic Heating</b>${L.site}${L.draft ? ' · ' + esc(L.draft) : ''}</span></div>
  </section>
  <main>${html}${cta}${srcs}</main>
  </body></html>`;
}

const items = pdfItems(HUB.items).filter((it) => !only.length || only.includes(it.id));
const IMGDIR = path.join(OUT, '_img');
function printCopies(htmlDoc) {
  const ids = [...new Set([...htmlDoc.matchAll(/src="images\/library\/([\w.-]+?)(-t)?\.webp"/g)].map((m) => m[1]))];
  fs.mkdirSync(IMGDIR, { recursive: true });
  const todo = ids.filter((id) => !fs.existsSync(path.join(IMGDIR, id + '.jpg')));
  if (todo.length) {
    const py = `import sys\nfrom PIL import Image\nfor i in sys.argv[2:]:\n    im=Image.open(f"{sys.argv[1]}/{i}.webp").convert("RGB"); im.thumbnail((1500,1500)); im.save(f"${IMGDIR}/{i}.jpg",quality=72,optimize=True,progressive=True)`;
    const r = spawnSync('python3', ['-c', py, path.join(DIST, 'images', 'library'), ...todo]);
    if (r.status) throw new Error(String(r.stderr));
  }
  return htmlDoc.replace(/src="images\/library\/([\w.-]+?)(-t)?\.webp"/g, (m, id) => `src="pdf/_img/${id}.jpg"`);
}
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const built = `${new Date(HUB.built).toISOString().slice(0, 10)}${HUB.commit ? ' · ' + HUB.commit : ''}`;
async function print(it, L, lang, file) {
  const page = await browser.newPage();
  const tmp = path.join(DIST, `_pdf-${lang}-${it.id}.html`);
  fs.writeFileSync(tmp, printCopies(docHTML(it, built, L, lang)));
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.pdf({
    path: file, format: L.format, printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="width:100%;font:7pt Helvetica,Arial,sans-serif;color:#71777D;padding:0 0.75in;display:flex;justify-content:space-between">
      <span>Bromic Heating · ${esc(it.title).slice(0, 80)}${L.draft ? ' · ' + esc(L.draft) : ''}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    margin: { top: '0.8in', bottom: '0.85in', left: '0.75in', right: '0.75in' },
  });
  fs.unlinkSync(tmp); await page.close();
  console.log(`${path.relative(DIST, file)}  ${(fs.statSync(file).size / 1e6).toFixed(1)} MB  ${it.title.slice(0, 60)}`);
}
for (const it of items) await print(it, LBL.en, 'en', path.join(OUT, `${it.id}.pdf`));
// Translations: the same document in German and Dutch, from data-<lang>.js (A4, local labels, marked as a machine draft).
const langIndex = {};
for (const lang of Object.keys(LBL).filter((l) => l !== 'en')) {
  const f = path.join(DIST, `data-${lang}.js`); if (!fs.existsSync(f)) continue;
  const T = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\(window\.HUB_TR=window\.HUB_TR\|\|\{\}\)\[[^\]]+\]=/, '').replace(/;\s*$/, ''));
  fs.mkdirSync(path.join(OUT, lang), { recursive: true });
  langIndex[lang] = [];
  for (const it of items) {
    const t = T[it.id]; if (!t) continue;
    const tit = { ...it, title: t.title, summary: t.summary, dek: t.dek, meta_description: t.meta_description, html: t.html, cta: t.cta || it.cta };
    await print(tit, LBL[lang], lang, path.join(OUT, lang, `${it.id}.pdf`));
    langIndex[lang].push(it.id);
  }
}
await browser.close();
fs.rmSync(IMGDIR, { recursive: true, force: true });
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(items.map((it) => it.id)));
fs.writeFileSync(path.join(OUT, 'langs.json'), JSON.stringify(langIndex));
